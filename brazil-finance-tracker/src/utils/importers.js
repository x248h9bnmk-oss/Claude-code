import Papa from 'papaparse';
import { parseCSVAmount, parseDate } from './format';

// Generic CSV importer — auto-detects column mapping
export const importCSV = (file) => {
  return new Promise((resolve, reject) => {
    Papa.parse(file, {
      header: true,
      skipEmptyLines: true,
      complete: (results) => {
        try {
          const rows = results.data;
          if (!rows.length) { reject(new Error('CSV vazio')); return; }

          const headers = Object.keys(rows[0]).map(h => h.toLowerCase().trim());

          // Detect columns
          const dateCol = detectCol(headers, ['data', 'date', 'dt', 'data_lancamento', 'data lancamento']);
          const descCol = detectCol(headers, ['descricao', 'descrição', 'description', 'historico', 'histórico', 'memo', 'lancamento', 'lançamento']);
          const amountCol = detectCol(headers, ['valor', 'amount', 'value', 'quantia']);
          const typeCol = detectCol(headers, ['tipo', 'type', 'credito', 'debito']);
          const categoryCol = detectCol(headers, ['categoria', 'category']);

          if (!dateCol || !amountCol) {
            reject(new Error('Não foi possível detectar as colunas de data e valor. Verifique o formato do CSV.'));
            return;
          }

          const origHeaders = Object.keys(rows[0]);
          const getVal = (row, detected) => {
            if (!detected) return '';
            // Find original key that matches
            const key = origHeaders.find(k => k.toLowerCase().trim() === detected);
            return key ? (row[key] || '').trim() : '';
          };

          const transactions = rows.map((row, i) => {
            const rawAmount = getVal(row, amountCol);
            const rawDate = getVal(row, dateCol);
            const rawType = getVal(row, typeCol);

            let amount = parseCSVAmount(rawAmount);
            let type = 'expense';

            if (rawType) {
              const t = rawType.toLowerCase();
              if (t.includes('créd') || t.includes('cred') || t === 'c' || t === 'entrada' || t === 'receita') {
                type = 'income';
              }
            } else if (amount > 0) {
              type = 'income';
            }

            if (amount < 0) {
              amount = Math.abs(amount);
              type = 'expense';
            }

            return {
              id: `csv_${Date.now()}_${i}`,
              date: parseDate(rawDate) || new Date().toISOString().slice(0, 10),
              description: getVal(row, descCol) || 'Transação importada',
              amount,
              type,
              categoryId: getVal(row, categoryCol) || '',
              account: 'Importado',
              imported: true,
            };
          }).filter(t => t.amount > 0);

          resolve(transactions);
        } catch (e) {
          reject(e);
        }
      },
      error: reject,
    });
  });
};

// OFX importer (Open Finance / OFXB)
export const importOFX = (text) => {
  const transactions = [];
  const stmtTrn = text.match(/<STMTTRN>([\s\S]*?)<\/STMTTRN>/gi) || [];

  stmtTrn.forEach((block, i) => {
    const get = (tag) => {
      const m = block.match(new RegExp(`<${tag}>([^<\\n]+)`, 'i'));
      return m ? m[1].trim() : '';
    };

    const trntype = get('TRNTYPE').toLowerCase();
    const dtposted = get('DTPOSTED');
    const trnamt = get('TRNAMT');
    const name = get('NAME') || get('MEMO') || 'Transação OFX';

    let amount = parseFloat(trnamt) || 0;
    let type = amount < 0 ? 'expense' : 'income';
    amount = Math.abs(amount);

    if (trntype === 'credit' || trntype === 'dep' || trntype === 'int') type = 'income';
    if (trntype === 'debit' || trntype === 'atm' || trntype === 'payment') type = 'expense';

    // Parse OFX date: YYYYMMDD or YYYYMMDDHHMMSS
    let date = '';
    if (dtposted.length >= 8) {
      const y = dtposted.slice(0, 4);
      const m = dtposted.slice(4, 6);
      const d = dtposted.slice(6, 8);
      date = `${y}-${m}-${d}`;
    }

    if (amount > 0) {
      transactions.push({
        id: `ofx_${Date.now()}_${i}`,
        date: date || new Date().toISOString().slice(0, 10),
        description: name,
        amount,
        type,
        categoryId: '',
        account: 'OFX',
        imported: true,
      });
    }
  });

  return transactions;
};

// Generate demo data for testing
export const generateDemoData = () => {
  const today = new Date();
  const transactions = [];
  const expenses = [
    { desc: 'Supermercado Extra', cat: 'mercado', amount: 287.50 },
    { desc: 'iFood - Pizza', cat: 'restaurante', amount: 62.90 },
    { desc: 'Uber', cat: 'transporte', amount: 24.70 },
    { desc: 'Netflix', cat: 'assinaturas', amount: 39.90 },
    { desc: 'Farmácia Drogasil', cat: 'saude', amount: 145.00 },
    { desc: 'Academia Smart Fit', cat: 'saude', amount: 99.90 },
    { desc: 'Posto de Gasolina', cat: 'transporte', amount: 180.00 },
    { desc: 'Conta de Luz', cat: 'moradia', amount: 220.00 },
    { desc: 'Internet Vivo', cat: 'moradia', amount: 110.00 },
    { desc: 'Rappi Market', cat: 'mercado', amount: 156.40 },
    { desc: 'Hering - Camiseta', cat: 'vestuario', amount: 89.90 },
    { desc: 'Spotify', cat: 'assinaturas', amount: 21.90 },
    { desc: 'Cinema', cat: 'lazer', amount: 48.00 },
    { desc: 'Padaria', cat: 'alimentacao', amount: 35.50 },
    { desc: 'Passagem aérea TAM', cat: 'viagem', amount: 650.00 },
    { desc: 'Restaurante Outback', cat: 'restaurante', amount: 142.00 },
    { desc: 'Livro - Amazon', cat: 'educacao', amount: 56.00 },
    { desc: 'Plano de saúde Amil', cat: 'saude', amount: 350.00 },
    { desc: 'Aluguel', cat: 'moradia', amount: 1800.00 },
    { desc: 'Ração Pet', cat: 'pets', amount: 120.00 },
  ];

  for (let m = 0; m < 3; m++) {
    const year = today.getFullYear();
    const month = today.getMonth() - m;
    const adjDate = new Date(year, month, 1);

    // Salary
    transactions.push({
      id: `demo_sal_${m}`,
      date: `${adjDate.getFullYear()}-${String(adjDate.getMonth()+1).padStart(2,'0')}-05`,
      description: 'Salário',
      amount: 5500.00,
      type: 'income',
      categoryId: 'salario',
      account: 'Conta Corrente',
      imported: false,
    });

    // Freelance occasionally
    if (m === 0) {
      transactions.push({
        id: `demo_free_${m}`,
        date: `${adjDate.getFullYear()}-${String(adjDate.getMonth()+1).padStart(2,'0')}-15`,
        description: 'Freelance - Projeto Web',
        amount: 1200.00,
        type: 'income',
        categoryId: 'freelance',
        account: 'Conta Corrente',
        imported: false,
      });
    }

    // Random subset of expenses
    const shuffled = [...expenses].sort(() => Math.random() - 0.5).slice(0, 14);
    shuffled.forEach((exp, i) => {
      const day = Math.floor(Math.random() * 28) + 1;
      transactions.push({
        id: `demo_exp_${m}_${i}`,
        date: `${adjDate.getFullYear()}-${String(adjDate.getMonth()+1).padStart(2,'0')}-${String(day).padStart(2,'0')}`,
        description: exp.desc,
        amount: exp.amount * (0.9 + Math.random() * 0.2),
        type: 'expense',
        categoryId: exp.cat,
        account: 'Cartão Nubank',
        imported: false,
      });
    });
  }

  return transactions.sort((a, b) => b.date.localeCompare(a.date));
};

function detectCol(headers, candidates) {
  for (const c of candidates) {
    if (headers.includes(c)) return c;
  }
  return null;
}
