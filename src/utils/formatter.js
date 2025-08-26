export function formatDate(isoDate) {
  if (!isoDate) return '-';
  return isoDate.split('T')[0]; // Splits "2025-07-27T00:01:53.000Z" and takes "2025-07-27"
}
