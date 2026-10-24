export function maskAadhaar(val) {
  if (!val) return 'XXXX-XXXX-XXXX';
  const clean = val.replace(/\D/g, '');
  if (clean.length < 4) return 'XXXX-XXXX-XXXX';
  const last4 = clean.slice(-4);
  return `XXXX-XXXX-${last4}`;
}

export function maskPAN(val) {
  if (!val) return 'XXXXX0000X';
  const clean = val.trim().toUpperCase();
  if (clean.length < 10) return 'XXXXX0000X';
  return `${clean.slice(0, 2)}***${clean.slice(5, 9)}${clean.slice(9)}`;
}

export function maskAccount(val) {
  if (!val) return 'XXXXXXXX0000';
  const clean = val.replace(/\D/g, '');
  if (clean.length < 4) return 'XXXXXXXX0000';
  return `•••• •••• ${clean.slice(-4)}`;
}

export function formatCurrency(amount) {
  if (amount === null || amount === undefined) return '₹0';
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0
  }).format(amount);
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  if (isNaN(date.getTime())) return dateString;
  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric'
  });
}
