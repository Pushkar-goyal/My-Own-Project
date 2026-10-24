function normalise(value) {
  return String(value ?? '').trim().toLowerCase();
}

function evaluateRule(rule, userProfile) {
  let userValue;
  switch (rule.field) {
    case 'age': userValue = parseInt(userProfile.age || 0, 10); break;
    case 'income': userValue = parseFloat(userProfile.annualIncome || 0); break;
    case 'occupation': userValue = userProfile.occupation || ''; break;
    case 'maritalStatus': userValue = userProfile.maritalStatus || ''; break;
    case 'landOwnership': userValue = Boolean(userProfile.landOwnership === true || userProfile.landOwnership === 'Yes'); break;
    default: userValue = userProfile[rule.field];
  }

  switch (rule.operator) {
    case '>=': return userValue >= rule.value;
    case '<=': return userValue <= rule.value;
    case '>': return userValue > rule.value;
    case '<': return userValue < rule.value;
    case '!=': return normalise(userValue) !== normalise(rule.value);
    case 'includes': return Array.isArray(userValue)
      ? userValue.some(v => normalise(v) === normalise(rule.value))
      : normalise(userValue).includes(normalise(rule.value));
    case '==':
    default: return normalise(userValue) === normalise(rule.value);
  }
}

export function matchSchemes(userProfile, documentsHeld, schemes) {
  if (!userProfile || !Array.isArray(schemes)) return [];

  const heldDocsList = (documentsHeld || []).map(d =>
    normalise(typeof d === 'string' ? d : (d.name || d.documentType || d.id || ''))
  );
  const userState = normalise(userProfile.state || 'All');

  return schemes.map(scheme => {
    const rules = scheme.requirements || [];
    const matchDetails = [];
    const missDetails = [];
    const criteria = [];

    rules.forEach(rule => {
      const passed = evaluateRule(rule, userProfile);
      criteria.push({ label: rule.label, passed, type: 'eligibility', field: rule.field });
      if (passed) matchDetails.push(`✓ ${rule.label} is satisfied`);
      else missDetails.push(`✗ ${rule.label} is not satisfied`);
    });

    const supportedStates = scheme.states || ['All'];
    const stateMatch = supportedStates.some(state => normalise(state) === 'all' || normalise(state) === userState);
    criteria.push({
      label: stateMatch ? `Available in ${userProfile.state || 'your location'}` : `Not listed for ${userProfile.state || 'your location'}`,
      passed: stateMatch,
      type: 'location',
      field: 'state'
    });
    if (stateMatch) matchDetails.push(`✓ Scheme location covers ${userProfile.state || 'your state'}`);
    else missDetails.push(`✗ Scheme is listed for ${supportedStates.filter(s => normalise(s) !== 'all').join(', ') || 'another location'}`);

    const requiredDocs = scheme.documents || [];
    const heldDocuments = [];
    const missingDocuments = [];
    requiredDocs.forEach(reqDoc => {
      const target = normalise(reqDoc);
      const isHeld = heldDocsList.some(held => held.includes(target) || target.includes(held));
      if (isHeld) heldDocuments.push(reqDoc);
      else missingDocuments.push(reqDoc);
    });

    const eligibilityPassed = criteria.filter(c => c.type !== 'location').filter(c => c.passed).length;
    const eligibilityTotal = rules.length;
    const eligibilityScore = eligibilityTotal ? (eligibilityPassed / eligibilityTotal) * 100 : 100;
    const documentScore = requiredDocs.length ? (heldDocuments.length / requiredDocs.length) * 100 : 100;
    const locationScore = stateMatch ? 100 : 0;
    const matchScore = Math.round((eligibilityScore * 0.55) + (documentScore * 0.30) + (locationScore * 0.15));

    if (missingDocuments.length) {
      missingDocuments.forEach(doc => missDetails.push(`✗ Document needed: ${doc}`));
    }

    const totalRequirements = eligibilityTotal + 1 + requiredDocs.length;
    const metRequirements = eligibilityPassed + (stateMatch ? 1 : 0) + heldDocuments.length;

    let status = 'Needs Verification';
    if (stateMatch && eligibilityPassed === eligibilityTotal && missingDocuments.length === 0) status = 'Ready to Explore';
    else if (stateMatch && matchScore >= 60) status = 'Almost Ready';
    else if (!stateMatch || matchScore < 35) status = "Currently Doesn't Match";

    const strengths = criteria.filter(c => c.passed).map(c => c.label).slice(0, 4);
    const blockers = criteria.filter(c => !c.passed).map(c => c.label).slice(0, 4);

    return {
      scheme,
      status,
      matchScore,
      metRequirements,
      totalRequirements,
      matchDetails,
      missDetails,
      heldDocuments,
      missingDocuments,
      criteria,
      strengths,
      blockers,
      stateMatch,
      eligibilityScore: Math.round(eligibilityScore),
      documentScore: Math.round(documentScore),
      isFullyEligible: stateMatch && eligibilityPassed === eligibilityTotal && missingDocuments.length === 0
    };
  }).sort((a, b) => b.matchScore - a.matchScore);
}
