// Sample transactions: Jan–May 2026
// 100 expense transactions (each ≤ R$1,000, total ≤ R$20,000)
// 10 income transactions (R$20,000 on day 15 and last day of each month)

export const SAMPLE_TRANSACTIONS_2026 = [
  // ─── INCOME ───────────────────────────────────────────────────────────────
  { id: 'smp_inc_0115', date: '2026-01-15', description: 'Salário 1ª Parcela - Janeiro', amount: 20000, type: 'income', categoryId: 'salario', account: 'Conta Corrente' },
  { id: 'smp_inc_0131', date: '2026-01-31', description: 'Salário 2ª Parcela - Janeiro', amount: 20000, type: 'income', categoryId: 'salario', account: 'Conta Corrente' },
  { id: 'smp_inc_0215', date: '2026-02-15', description: 'Salário 1ª Parcela - Fevereiro', amount: 20000, type: 'income', categoryId: 'salario', account: 'Conta Corrente' },
  { id: 'smp_inc_0228', date: '2026-02-28', description: 'Salário 2ª Parcela - Fevereiro', amount: 20000, type: 'income', categoryId: 'salario', account: 'Conta Corrente' },
  { id: 'smp_inc_0315', date: '2026-03-15', description: 'Salário 1ª Parcela - Março', amount: 20000, type: 'income', categoryId: 'salario', account: 'Conta Corrente' },
  { id: 'smp_inc_0331', date: '2026-03-31', description: 'Salário 2ª Parcela - Março', amount: 20000, type: 'income', categoryId: 'salario', account: 'Conta Corrente' },
  { id: 'smp_inc_0415', date: '2026-04-15', description: 'Salário 1ª Parcela - Abril', amount: 20000, type: 'income', categoryId: 'salario', account: 'Conta Corrente' },
  { id: 'smp_inc_0430', date: '2026-04-30', description: 'Salário 2ª Parcela - Abril', amount: 20000, type: 'income', categoryId: 'salario', account: 'Conta Corrente' },
  { id: 'smp_inc_0515', date: '2026-05-15', description: 'Salário 1ª Parcela - Maio', amount: 20000, type: 'income', categoryId: 'salario', account: 'Conta Corrente' },
  { id: 'smp_inc_0531', date: '2026-05-31', description: 'Salário 2ª Parcela - Maio', amount: 20000, type: 'income', categoryId: 'salario', account: 'Conta Corrente' },

  // ─── EXPENSES – JANUARY 2026  (total ≈ R$3,733.10) ───────────────────────
  { id: 'smp_jan_01', date: '2026-01-02', description: 'Supermercado Extra', amount: 342.50, type: 'expense', categoryId: 'mercado', account: 'Nubank' },
  { id: 'smp_jan_02', date: '2026-01-03', description: 'Aluguel Janeiro', amount: 950.00, type: 'expense', categoryId: 'moradia', account: 'Conta Corrente' },
  { id: 'smp_jan_03', date: '2026-01-04', description: 'Posto Ipiranga - Gasolina', amount: 175.00, type: 'expense', categoryId: 'transporte', account: 'Nubank' },
  { id: 'smp_jan_04', date: '2026-01-05', description: 'Outback Steakhouse', amount: 185.00, type: 'expense', categoryId: 'restaurante', account: 'Nubank' },
  { id: 'smp_jan_05', date: '2026-01-06', description: 'Farmácia Drogasil', amount: 89.90, type: 'expense', categoryId: 'saude', account: 'Nubank' },
  { id: 'smp_jan_06', date: '2026-01-07', description: 'Netflix', amount: 45.90, type: 'expense', categoryId: 'assinaturas', account: 'Nubank' },
  { id: 'smp_jan_07', date: '2026-01-08', description: 'Uber - Corrida', amount: 35.00, type: 'expense', categoryId: 'transporte', account: 'Nubank' },
  { id: 'smp_jan_08', date: '2026-01-09', description: 'Academia Smart Fit', amount: 99.90, type: 'expense', categoryId: 'saude', account: 'Conta Corrente' },
  { id: 'smp_jan_09', date: '2026-01-12', description: 'Renner - Roupas', amount: 220.00, type: 'expense', categoryId: 'vestuario', account: 'Nubank' },
  { id: 'smp_jan_10', date: '2026-01-13', description: 'Restaurante Coma', amount: 78.00, type: 'expense', categoryId: 'restaurante', account: 'Nubank' },
  { id: 'smp_jan_11', date: '2026-01-16', description: 'Pão de Açúcar', amount: 415.00, type: 'expense', categoryId: 'mercado', account: 'Nubank' },
  { id: 'smp_jan_12', date: '2026-01-17', description: 'Dentista Consulta', amount: 280.00, type: 'expense', categoryId: 'saude', account: 'Conta Corrente' },
  { id: 'smp_jan_13', date: '2026-01-18', description: 'Gasolina Shell', amount: 155.00, type: 'expense', categoryId: 'transporte', account: 'Nubank' },
  { id: 'smp_jan_14', date: '2026-01-20', description: 'Spotify', amount: 26.90, type: 'expense', categoryId: 'assinaturas', account: 'Nubank' },
  { id: 'smp_jan_15', date: '2026-01-21', description: 'iFood - Pedido', amount: 85.00, type: 'expense', categoryId: 'alimentacao', account: 'Nubank' },
  { id: 'smp_jan_16', date: '2026-01-22', description: 'Cobasi Pet Shop', amount: 140.00, type: 'expense', categoryId: 'pets', account: 'Nubank' },
  { id: 'smp_jan_17', date: '2026-01-24', description: 'Livraria Cultura', amount: 115.00, type: 'expense', categoryId: 'educacao', account: 'Nubank' },
  { id: 'smp_jan_18', date: '2026-01-25', description: 'Cinema Cinemark', amount: 60.00, type: 'expense', categoryId: 'lazer', account: 'Nubank' },
  { id: 'smp_jan_19', date: '2026-01-28', description: 'Conta de Energia Elétrica', amount: 180.00, type: 'expense', categoryId: 'moradia', account: 'Conta Corrente' },
  { id: 'smp_jan_20', date: '2026-01-29', description: 'Barbearia', amount: 55.00, type: 'expense', categoryId: 'beleza', account: 'Nubank' },

  // ─── EXPENSES – FEBRUARY 2026  (total ≈ R$3,760.80) ──────────────────────
  { id: 'smp_feb_01', date: '2026-02-02', description: 'Supermercado Carrefour', amount: 398.00, type: 'expense', categoryId: 'mercado', account: 'Inter' },
  { id: 'smp_feb_02', date: '2026-02-03', description: 'Aluguel Fevereiro', amount: 950.00, type: 'expense', categoryId: 'moradia', account: 'Conta Corrente' },
  { id: 'smp_feb_03', date: '2026-02-04', description: 'iFood - Pedido', amount: 72.00, type: 'expense', categoryId: 'alimentacao', account: 'Inter' },
  { id: 'smp_feb_04', date: '2026-02-05', description: 'Farmácia Ultrafarma', amount: 112.00, type: 'expense', categoryId: 'saude', account: 'Inter' },
  { id: 'smp_feb_05', date: '2026-02-06', description: 'Amazon Prime', amount: 19.90, type: 'expense', categoryId: 'assinaturas', account: 'Inter' },
  { id: 'smp_feb_06', date: '2026-02-07', description: 'Gasolina Petrobras', amount: 190.00, type: 'expense', categoryId: 'transporte', account: 'Inter' },
  { id: 'smp_feb_07', date: '2026-02-09', description: 'Salão de Beleza', amount: 120.00, type: 'expense', categoryId: 'beleza', account: 'Inter' },
  { id: 'smp_feb_08', date: '2026-02-11', description: 'Restaurante Madero', amount: 168.00, type: 'expense', categoryId: 'restaurante', account: 'Inter' },
  { id: 'smp_feb_09', date: '2026-02-12', description: 'Bilhete Metrô - Recarga', amount: 44.00, type: 'expense', categoryId: 'transporte', account: 'Inter' },
  { id: 'smp_feb_10', date: '2026-02-14', description: 'Festa de Carnaval', amount: 135.00, type: 'expense', categoryId: 'lazer', account: 'Inter' },
  { id: 'smp_feb_11', date: '2026-02-16', description: 'Pão de Açúcar', amount: 362.00, type: 'expense', categoryId: 'mercado', account: 'Inter' },
  { id: 'smp_feb_12', date: '2026-02-17', description: 'Oficina Mecânica', amount: 280.00, type: 'expense', categoryId: 'transporte', account: 'Conta Corrente' },
  { id: 'smp_feb_13', date: '2026-02-18', description: 'Zara - Roupas', amount: 180.00, type: 'expense', categoryId: 'vestuario', account: 'Inter' },
  { id: 'smp_feb_14', date: '2026-02-19', description: 'Dentista - Retorno', amount: 150.00, type: 'expense', categoryId: 'saude', account: 'Conta Corrente' },
  { id: 'smp_feb_15', date: '2026-02-20', description: 'Netflix', amount: 45.90, type: 'expense', categoryId: 'assinaturas', account: 'Inter' },
  { id: 'smp_feb_16', date: '2026-02-21', description: 'Curso Online - Udemy', amount: 149.00, type: 'expense', categoryId: 'educacao', account: 'Inter' },
  { id: 'smp_feb_17', date: '2026-02-22', description: 'Cobasi - Ração e Acessórios', amount: 87.00, type: 'expense', categoryId: 'pets', account: 'Inter' },
  { id: 'smp_feb_18', date: '2026-02-24', description: 'Cinema', amount: 58.00, type: 'expense', categoryId: 'lazer', account: 'Inter' },
  { id: 'smp_feb_19', date: '2026-02-25', description: 'Conta de Água', amount: 95.00, type: 'expense', categoryId: 'moradia', account: 'Conta Corrente' },
  { id: 'smp_feb_20', date: '2026-02-27', description: 'Restaurante Japonês', amount: 145.00, type: 'expense', categoryId: 'restaurante', account: 'Inter' },

  // ─── EXPENSES – MARCH 2026  (total ≈ R$3,741.20) ─────────────────────────
  { id: 'smp_mar_01', date: '2026-03-02', description: 'Supermercado Extra', amount: 375.00, type: 'expense', categoryId: 'mercado', account: 'Nubank' },
  { id: 'smp_mar_02', date: '2026-03-03', description: 'Aluguel Março', amount: 950.00, type: 'expense', categoryId: 'moradia', account: 'Conta Corrente' },
  { id: 'smp_mar_03', date: '2026-03-05', description: 'Farmácia Droga Raia', amount: 78.50, type: 'expense', categoryId: 'saude', account: 'Nubank' },
  { id: 'smp_mar_04', date: '2026-03-06', description: 'Posto de Gasolina', amount: 195.00, type: 'expense', categoryId: 'transporte', account: 'Nubank' },
  { id: 'smp_mar_05', date: '2026-03-07', description: 'Spotify + YouTube Premium', amount: 46.90, type: 'expense', categoryId: 'assinaturas', account: 'Nubank' },
  { id: 'smp_mar_06', date: '2026-03-09', description: 'Restaurante Cozinha Mineira', amount: 125.00, type: 'expense', categoryId: 'restaurante', account: 'Nubank' },
  { id: 'smp_mar_07', date: '2026-03-10', description: 'iFood - Pedido', amount: 68.00, type: 'expense', categoryId: 'alimentacao', account: 'Nubank' },
  { id: 'smp_mar_08', date: '2026-03-12', description: 'Shein - Roupas', amount: 245.00, type: 'expense', categoryId: 'vestuario', account: 'Nubank' },
  { id: 'smp_mar_09', date: '2026-03-13', description: 'Uber - Corrida', amount: 42.00, type: 'expense', categoryId: 'transporte', account: 'Nubank' },
  { id: 'smp_mar_10', date: '2026-03-14', description: 'Dentista Consulta', amount: 200.00, type: 'expense', categoryId: 'saude', account: 'Conta Corrente' },
  { id: 'smp_mar_11', date: '2026-03-16', description: 'Pão de Açúcar', amount: 389.00, type: 'expense', categoryId: 'mercado', account: 'Nubank' },
  { id: 'smp_mar_12', date: '2026-03-18', description: 'Netflix', amount: 45.90, type: 'expense', categoryId: 'assinaturas', account: 'Nubank' },
  { id: 'smp_mar_13', date: '2026-03-19', description: 'Academia Smart Fit', amount: 99.90, type: 'expense', categoryId: 'saude', account: 'Conta Corrente' },
  { id: 'smp_mar_14', date: '2026-03-20', description: 'Bar e Restaurante', amount: 155.00, type: 'expense', categoryId: 'restaurante', account: 'Nubank' },
  { id: 'smp_mar_15', date: '2026-03-21', description: 'Amazon - Livros', amount: 89.00, type: 'expense', categoryId: 'educacao', account: 'Nubank' },
  { id: 'smp_mar_16', date: '2026-03-23', description: 'Pet Shop - Ração', amount: 112.00, type: 'expense', categoryId: 'pets', account: 'Nubank' },
  { id: 'smp_mar_17', date: '2026-03-24', description: 'Show de Música', amount: 180.00, type: 'expense', categoryId: 'lazer', account: 'Nubank' },
  { id: 'smp_mar_18', date: '2026-03-26', description: 'Conta de Energia Elétrica', amount: 195.00, type: 'expense', categoryId: 'moradia', account: 'Conta Corrente' },
  { id: 'smp_mar_19', date: '2026-03-27', description: 'Barbearia', amount: 55.00, type: 'expense', categoryId: 'beleza', account: 'Nubank' },
  { id: 'smp_mar_20', date: '2026-03-30', description: 'Restaurante - Almoço', amount: 95.00, type: 'expense', categoryId: 'restaurante', account: 'Nubank' },

  // ─── EXPENSES – APRIL 2026  (total ≈ R$3,780.60) ─────────────────────────
  { id: 'smp_apr_01', date: '2026-04-01', description: 'Supermercado Carrefour', amount: 412.00, type: 'expense', categoryId: 'mercado', account: 'Inter' },
  { id: 'smp_apr_02', date: '2026-04-02', description: 'Aluguel Abril', amount: 950.00, type: 'expense', categoryId: 'moradia', account: 'Conta Corrente' },
  { id: 'smp_apr_03', date: '2026-04-03', description: 'iFood - Pedido', amount: 82.00, type: 'expense', categoryId: 'alimentacao', account: 'Inter' },
  { id: 'smp_apr_04', date: '2026-04-05', description: 'Farmácia - Medicamentos', amount: 56.00, type: 'expense', categoryId: 'saude', account: 'Inter' },
  { id: 'smp_apr_05', date: '2026-04-06', description: 'Gasolina - Posto BR', amount: 175.00, type: 'expense', categoryId: 'transporte', account: 'Inter' },
  { id: 'smp_apr_06', date: '2026-04-07', description: 'Disney+', amount: 43.90, type: 'expense', categoryId: 'assinaturas', account: 'Inter' },
  { id: 'smp_apr_07', date: '2026-04-08', description: 'Churrascaria', amount: 168.00, type: 'expense', categoryId: 'restaurante', account: 'Inter' },
  { id: 'smp_apr_08', date: '2026-04-09', description: 'Uber - Corrida', amount: 38.00, type: 'expense', categoryId: 'transporte', account: 'Inter' },
  { id: 'smp_apr_09', date: '2026-04-10', description: 'Sapatos - Loja', amount: 320.00, type: 'expense', categoryId: 'vestuario', account: 'Inter' },
  { id: 'smp_apr_10', date: '2026-04-12', description: 'Dentista Consulta', amount: 250.00, type: 'expense', categoryId: 'saude', account: 'Conta Corrente' },
  { id: 'smp_apr_11', date: '2026-04-14', description: 'Supermercado Zona Sul', amount: 298.00, type: 'expense', categoryId: 'mercado', account: 'Inter' },
  { id: 'smp_apr_12', date: '2026-04-15', description: 'Netflix', amount: 45.90, type: 'expense', categoryId: 'assinaturas', account: 'Inter' },
  { id: 'smp_apr_13', date: '2026-04-16', description: 'Academia Smart Fit', amount: 99.90, type: 'expense', categoryId: 'saude', account: 'Conta Corrente' },
  { id: 'smp_apr_14', date: '2026-04-18', description: 'Bar com Amigos', amount: 145.00, type: 'expense', categoryId: 'lazer', account: 'Inter' },
  { id: 'smp_apr_15', date: '2026-04-20', description: 'Livros - Kindle Store', amount: 45.00, type: 'expense', categoryId: 'educacao', account: 'Inter' },
  { id: 'smp_apr_16', date: '2026-04-22', description: 'Barbearia', amount: 55.00, type: 'expense', categoryId: 'beleza', account: 'Inter' },
  { id: 'smp_apr_17', date: '2026-04-23', description: 'Cobasi - Pet Shop', amount: 132.00, type: 'expense', categoryId: 'pets', account: 'Inter' },
  { id: 'smp_apr_18', date: '2026-04-25', description: 'Internet - Tim Fibra', amount: 99.90, type: 'expense', categoryId: 'moradia', account: 'Conta Corrente' },
  { id: 'smp_apr_19', date: '2026-04-27', description: 'Restaurante - Pizza', amount: 115.00, type: 'expense', categoryId: 'restaurante', account: 'Inter' },
  { id: 'smp_apr_20', date: '2026-04-29', description: 'Viagem Final de Semana', amount: 250.00, type: 'expense', categoryId: 'viagem', account: 'Inter' },

  // ─── EXPENSES – MAY 2026  (total ≈ R$3,783.70) ───────────────────────────
  { id: 'smp_may_01', date: '2026-05-02', description: 'Supermercado Extra', amount: 385.00, type: 'expense', categoryId: 'mercado', account: 'Nubank' },
  { id: 'smp_may_02', date: '2026-05-03', description: 'Aluguel Maio', amount: 950.00, type: 'expense', categoryId: 'moradia', account: 'Conta Corrente' },
  { id: 'smp_may_03', date: '2026-05-04', description: 'iFood - Pedido', amount: 65.00, type: 'expense', categoryId: 'alimentacao', account: 'Nubank' },
  { id: 'smp_may_04', date: '2026-05-05', description: 'Farmácia - Vitaminas', amount: 98.00, type: 'expense', categoryId: 'saude', account: 'Nubank' },
  { id: 'smp_may_05', date: '2026-05-06', description: 'Gasolina - Posto Shell', amount: 182.00, type: 'expense', categoryId: 'transporte', account: 'Nubank' },
  { id: 'smp_may_06', date: '2026-05-07', description: 'Globoplay', amount: 32.90, type: 'expense', categoryId: 'assinaturas', account: 'Nubank' },
  { id: 'smp_may_07', date: '2026-05-08', description: 'Restaurante Italiano', amount: 178.00, type: 'expense', categoryId: 'restaurante', account: 'Nubank' },
  { id: 'smp_may_08', date: '2026-05-09', description: 'Uber - Corrida', amount: 45.00, type: 'expense', categoryId: 'transporte', account: 'Nubank' },
  { id: 'smp_may_09', date: '2026-05-11', description: 'Riachuelo - Roupas', amount: 195.00, type: 'expense', categoryId: 'vestuario', account: 'Nubank' },
  { id: 'smp_may_10', date: '2026-05-13', description: 'Dentista Consulta', amount: 200.00, type: 'expense', categoryId: 'saude', account: 'Conta Corrente' },
  { id: 'smp_may_11', date: '2026-05-14', description: 'Supermercado Hortifruti', amount: 275.00, type: 'expense', categoryId: 'mercado', account: 'Nubank' },
  { id: 'smp_may_12', date: '2026-05-16', description: 'Netflix', amount: 45.90, type: 'expense', categoryId: 'assinaturas', account: 'Nubank' },
  { id: 'smp_may_13', date: '2026-05-17', description: 'Academia Smart Fit', amount: 99.90, type: 'expense', categoryId: 'saude', account: 'Conta Corrente' },
  { id: 'smp_may_14', date: '2026-05-19', description: 'Parque Temático', amount: 220.00, type: 'expense', categoryId: 'lazer', account: 'Nubank' },
  { id: 'smp_may_15', date: '2026-05-20', description: 'Livros - Universidade', amount: 165.00, type: 'expense', categoryId: 'educacao', account: 'Nubank' },
  { id: 'smp_may_16', date: '2026-05-21', description: 'Barbearia', amount: 55.00, type: 'expense', categoryId: 'beleza', account: 'Nubank' },
  { id: 'smp_may_17', date: '2026-05-22', description: 'Pet Shop - Ração e Acessórios', amount: 150.00, type: 'expense', categoryId: 'pets', account: 'Nubank' },
  { id: 'smp_may_18', date: '2026-05-24', description: 'Conta de Gás', amount: 87.00, type: 'expense', categoryId: 'moradia', account: 'Conta Corrente' },
  { id: 'smp_may_19', date: '2026-05-26', description: 'Hamburgueria', amount: 110.00, type: 'expense', categoryId: 'restaurante', account: 'Nubank' },
  { id: 'smp_may_20', date: '2026-05-29', description: 'Amazon - Compra', amount: 245.00, type: 'expense', categoryId: 'outros_despesa', account: 'Nubank' },
];

// Expense totals per month (for reference):
// Jan: R$3,733.10 | Feb: R$3,760.80 | Mar: R$3,741.20 | Apr: R$3,780.60 | May: R$3,783.70
// Total expenses: R$18,799.40

export function loadSampleData(existingTransactions, updateTransactions) {
  const existingIds = new Set(existingTransactions.map(t => t.id));
  const toAdd = SAMPLE_TRANSACTIONS_2026.filter(t => !existingIds.has(t.id));
  updateTransactions([...toAdd, ...existingTransactions]);
  return toAdd.length;
}

export function removeSampleData(existingTransactions, updateTransactions) {
  const filtered = existingTransactions.filter(t => !t.id.startsWith('smp_'));
  updateTransactions(filtered);
  return existingTransactions.length - filtered.length;
}
