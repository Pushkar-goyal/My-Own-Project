/**
 * UMANG Portal Gateway Integration Service Stub
 */
export const umangService = {
  async fetchUnifiedServices() {
    return [
      { id: 'epfo', name: 'EPFO Passbook & Claim', category: 'Labor & Employment' },
      { id: 'nps', name: 'National Pension System', category: 'Pension' },
      { id: 'passport', name: 'Passport Seva Services', category: 'Identity' }
    ];
  }
};
