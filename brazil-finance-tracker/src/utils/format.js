export const formatBRL = (value) =>
  new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);

export const formatDate = (dateStr) => {
  const d = new Date(dateStr + 'T00:00:00');
  return d.toLocaleDateString('pt-BR');
};

export const formatMonth = (year, month) => {
  const d = new Date(year, month, 1);
  return d.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
};

export const parseCSVAmount = (str) => {
  if (!str) return 0;
  // Handle Brazilian format: 1.234,56 or 1234.56
  const cleaned = str.replace(/\s/g, '');
  if (cleaned.includes(',')) {
    return parseFloat(cleaned.replace(/\./g, '').replace(',', '.')) || 0;
  }
  return parseFloat(cleaned) || 0;
};

export const parseDate = (str) => {
  if (!str) return '';
  // Try DD/MM/YYYY
  const ddmmyyyy = str.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
  if (ddmmyyyy) {
    const [, d, m, y] = ddmmyyyy;
    return `${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`;
  }
  // Try YYYY-MM-DD
  if (/^\d{4}-\d{2}-\d{2}$/.test(str)) return str;
  // Try DD-MM-YYYY
  const ddmmyyyy2 = str.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
  if (ddmmyyyy2) {
    const [, d, m, y] = ddmmyyyy2;
    return `${y}-${m.padStart(2,'0')}-${d.padStart(2,'0')}`;
  }
  return str;
};
