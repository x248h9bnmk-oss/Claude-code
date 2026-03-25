import React, { useState, useRef } from 'react';
import { Upload, CheckCircle, AlertCircle, Sparkles, Download } from 'lucide-react';
import { importCSV, importOFX, generateDemoData } from '../utils/importers';
import { formatBRL, formatDate } from '../utils/format';

export default function Import({ transactions, updateTransactions, categories, addToast, setPage }) {
  const [dragover, setDragover] = useState(false);
  const [preview, setPreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [catAssignments, setCatAssignments] = useState({});
  const fileRef = useRef();

  const processFile = async (file) => {
    setError('');
    setLoading(true);
    setPreview(null);
    try {
      let imported = [];
      const ext = file.name.split('.').pop().toLowerCase();
      if (ext === 'csv' || ext === 'txt') {
        imported = await importCSV(file);
      } else if (ext === 'ofx' || ext === 'ofc') {
        const text = await file.text();
        imported = importOFX(text);
      } else {
        throw new Error('Formato não suportado. Use CSV ou OFX.');
      }
      if (imported.length === 0) throw new Error('Nenhuma transação encontrada no arquivo.');
      setPreview(imported);
      setCatAssignments({});
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragover(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) processFile(file);
    e.target.value = '';
  };

  const handleConfirmImport = () => {
    if (!preview) return;
    const withCats = preview.map(tx => ({
      ...tx,
      categoryId: catAssignments[tx.id] ?? tx.categoryId ?? '',
    }));
    // Deduplicate by id
    const existing = new Set(transactions.map(t => t.id));
    const newTxs = withCats.filter(t => !existing.has(t.id));
    updateTransactions([...newTxs, ...transactions]);
    addToast(`${newTxs.length} transações importadas com sucesso!`);
    setPreview(null);
    setPage('transactions');
  };

  const handleDemo = () => {
    const demo = generateDemoData();
    updateTransactions(demo);
    addToast('Dados de demonstração carregados! 🎉');
    setPage('dashboard');
  };

  const downloadSampleCSV = () => {
    const csv = `Data,Descricao,Valor,Tipo
01/01/2024,Salario,5500.00,credito
05/01/2024,Supermercado,-287.50,debito
10/01/2024,Netflix,-39.90,debito
15/01/2024,Uber,-24.70,debito
20/01/2024,Conta de Luz,-220.00,debito`;
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'exemplo_open_finance.csv';
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div style={{ maxWidth: 800, margin: '0 auto' }}>
      {/* Info */}
      <div style={{ background: '#eff6ff', border: '1px solid #bfdbfe', borderRadius: 'var(--radius)', padding: 16, marginBottom: 24, fontSize: 14, color: '#1d4ed8' }}>
        <strong>Open Finance Brasil:</strong> Importe extratos bancários em formato CSV (Nubank, Inter, Bradesco, Itaú, Santander) ou OFX (padrão bancário).
        Seus dados ficam armazenados apenas no seu navegador.
      </div>

      {!preview && (
        <>
          {/* Upload zone */}
          <div
            className={`upload-zone${dragover ? ' dragover' : ''}`}
            onDragOver={(e) => { e.preventDefault(); setDragover(true); }}
            onDragLeave={() => setDragover(false)}
            onDrop={handleDrop}
            onClick={() => fileRef.current?.click()}
          >
            <div className="upload-zone-icon">
              <Upload size={48} />
            </div>
            <h3>Arraste um arquivo ou clique para selecionar</h3>
            <p>Suporta CSV, TXT e OFX · Formatos dos principais bancos brasileiros</p>
            <input ref={fileRef} type="file" accept=".csv,.txt,.ofx,.ofc" style={{ display: 'none' }} onChange={handleFileChange} />
          </div>

          {error && (
            <div style={{ display: 'flex', gap: 8, alignItems: 'flex-start', padding: 16, background: 'var(--danger-light)', borderRadius: 8, marginTop: 16, color: 'var(--danger)' }}>
              <AlertCircle size={18} style={{ flexShrink: 0, marginTop: 1 }} />
              <div>
                <div style={{ fontWeight: 600, marginBottom: 4 }}>Erro ao importar</div>
                <div style={{ fontSize: 13 }}>{error}</div>
              </div>
            </div>
          )}

          {loading && (
            <div style={{ textAlign: 'center', padding: 24, color: 'var(--gray-500)' }}>
              <div style={{ fontSize: 24, marginBottom: 8 }}>⏳</div>
              Processando arquivo...
            </div>
          )}

          {/* Options */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginTop: 24 }}>
            <div className="card" style={{ cursor: 'pointer' }} onClick={handleDemo}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div style={{ fontSize: 32 }}><Sparkles size={32} color="#8b5cf6" /></div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>Carregar Dados de Demonstração</div>
                  <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>
                    Preenche o app com dados fictícios para explorar as funcionalidades
                  </div>
                </div>
              </div>
            </div>

            <div className="card" style={{ cursor: 'pointer' }} onClick={downloadSampleCSV}>
              <div style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                <div><Download size={32} color="#16a34a" /></div>
                <div>
                  <div style={{ fontWeight: 600, marginBottom: 4 }}>Baixar CSV de Exemplo</div>
                  <div style={{ fontSize: 13, color: 'var(--gray-500)' }}>
                    Modelo de CSV compatível para testar a importação
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Format guide */}
          <div className="card" style={{ marginTop: 16 }}>
            <div className="card-title" style={{ marginBottom: 16 }}>Bancos Compatíveis</div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12 }}>
              {[
                { name: 'Nubank', format: 'CSV', icon: '💜' },
                { name: 'Inter', format: 'CSV/OFX', icon: '🟠' },
                { name: 'Itaú', format: 'OFX', icon: '🔵' },
                { name: 'Bradesco', format: 'OFX', icon: '🔴' },
                { name: 'Santander', format: 'OFX/CSV', icon: '🔴' },
                { name: 'C6 Bank', format: 'CSV', icon: '⚫' },
                { name: 'PicPay', format: 'CSV', icon: '🟢' },
                { name: 'Caixa', format: 'OFX', icon: '🔵' },
                { name: 'BB', format: 'OFX', icon: '🟡' },
              ].map(b => (
                <div key={b.name} style={{ display: 'flex', alignItems: 'center', gap: 8, padding: '8px 12px', background: 'var(--gray-50)', borderRadius: 8 }}>
                  <span>{b.icon}</span>
                  <div>
                    <div style={{ fontSize: 13, fontWeight: 500 }}>{b.name}</div>
                    <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>{b.format}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      {/* Preview */}
      {preview && (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 20, padding: 16, background: 'var(--success-light)', borderRadius: 8, color: 'var(--success)' }}>
            <CheckCircle size={20} />
            <div>
              <strong>{preview.length} transações</strong> encontradas. Revise e categorize antes de importar.
            </div>
          </div>

          {/* Quick categorize */}
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="card-header">
              <div className="card-title">Pré-visualização das Transações</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <button className="btn btn-outline" onClick={() => { setPreview(null); setError(''); }}>Cancelar</button>
                <button className="btn btn-success" onClick={handleConfirmImport}>
                  <CheckCircle size={16} /> Confirmar Importação
                </button>
              </div>
            </div>
            <div style={{ maxHeight: 500, overflowY: 'auto' }}>
              <table className="transactions-table">
                <thead>
                  <tr>
                    <th>Data</th>
                    <th>Descrição</th>
                    <th>Tipo</th>
                    <th style={{ textAlign: 'right' }}>Valor</th>
                    <th>Categoria</th>
                  </tr>
                </thead>
                <tbody>
                  {preview.map(tx => (
                    <tr key={tx.id}>
                      <td style={{ whiteSpace: 'nowrap', fontSize: 13 }}>{formatDate(tx.date)}</td>
                      <td style={{ maxWidth: 200 }}>
                        <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.description}</div>
                      </td>
                      <td>
                        <span style={{
                          fontSize: 11, fontWeight: 600, padding: '2px 8px', borderRadius: 99,
                          background: tx.type === 'income' ? 'var(--success-light)' : 'var(--danger-light)',
                          color: tx.type === 'income' ? 'var(--success)' : 'var(--danger)',
                        }}>
                          {tx.type === 'income' ? 'Receita' : 'Despesa'}
                        </span>
                      </td>
                      <td style={{ textAlign: 'right' }}>
                        <span className={tx.type === 'income' ? 'amount-positive' : 'amount-negative'}>
                          {tx.type === 'income' ? '+' : '-'}{formatBRL(tx.amount)}
                        </span>
                      </td>
                      <td>
                        <select
                          className="form-select"
                          style={{ fontSize: 12, padding: '4px 8px' }}
                          value={catAssignments[tx.id] ?? tx.categoryId ?? ''}
                          onChange={e => setCatAssignments(a => ({ ...a, [tx.id]: e.target.value }))}
                        >
                          <option value="">Sem categoria</option>
                          {categories.filter(c => c.type === tx.type).map(c => (
                            <option key={c.id} value={c.id}>{c.icon} {c.name}</option>
                          ))}
                        </select>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button className="btn btn-outline" onClick={() => { setPreview(null); setError(''); }}>Cancelar</button>
            <button className="btn btn-success" onClick={handleConfirmImport}>
              <CheckCircle size={16} /> Confirmar {preview.length} Transações
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
