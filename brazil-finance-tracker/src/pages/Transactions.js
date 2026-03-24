import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Edit2, Search, Filter } from 'lucide-react';
import { formatBRL, formatDate } from '../utils/format';
import TransactionModal from '../components/TransactionModal';

export default function Transactions({ transactions, updateTransactions, categories, addToast }) {
  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [filterCat, setFilterCat] = useState('all');
  const [filterMonth, setFilterMonth] = useState('all');
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [selected, setSelected] = useState(new Set());

  const catMap = useMemo(() => Object.fromEntries(categories.map(c => [c.id, c])), [categories]);

  const months = useMemo(() => {
    const s = new Set(transactions.map(t => t.date.slice(0, 7)));
    return [...s].sort().reverse();
  }, [transactions]);

  const filtered = useMemo(() => {
    return transactions.filter(t => {
      if (filterType !== 'all' && t.type !== filterType) return false;
      if (filterCat !== 'all' && t.categoryId !== filterCat) return false;
      if (filterMonth !== 'all' && !t.date.startsWith(filterMonth)) return false;
      if (search && !t.description.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    }).sort((a, b) => b.date.localeCompare(a.date));
  }, [transactions, filterType, filterCat, filterMonth, search]);

  const totalFiltered = useMemo(() =>
    filtered.reduce((s, t) => t.type === 'expense' ? s - t.amount : s + t.amount, 0),
    [filtered]);

  const handleDelete = (id) => {
    updateTransactions(transactions.filter(t => t.id !== id));
    addToast('Transação removida.', 'success');
  };

  const handleDeleteSelected = () => {
    updateTransactions(transactions.filter(t => !selected.has(t.id)));
    addToast(`${selected.size} transações removidas.`);
    setSelected(new Set());
  };

  const toggleSelect = (id) => {
    setSelected(s => {
      const n = new Set(s);
      n.has(id) ? n.delete(id) : n.add(id);
      return n;
    });
  };

  const toggleSelectAll = () => {
    if (selected.size === filtered.length) setSelected(new Set());
    else setSelected(new Set(filtered.map(t => t.id)));
  };

  const handleSave = (tx) => {
    if (editing) {
      updateTransactions(transactions.map(t => t.id === tx.id ? tx : t));
      addToast('Transação atualizada!');
    } else {
      updateTransactions([tx, ...transactions]);
      addToast('Transação adicionada!');
    }
    setShowModal(false);
    setEditing(null);
  };

  return (
    <div>
      {/* Toolbar */}
      <div style={{ display: 'flex', gap: 8, alignItems: 'center', marginBottom: 20, flexWrap: 'wrap' }}>
        <div style={{ position: 'relative', flex: '1 1 200px' }}>
          <Search size={14} style={{ position: 'absolute', left: 10, top: '50%', transform: 'translateY(-50%)', color: 'var(--gray-400)' }} />
          <input
            className="form-input"
            style={{ paddingLeft: 32 }}
            placeholder="Buscar transações..."
            value={search}
            onChange={e => setSearch(e.target.value)}
          />
        </div>
        <select className="form-select" style={{ width: 'auto' }} value={filterType} onChange={e => setFilterType(e.target.value)}>
          <option value="all">Todos os tipos</option>
          <option value="income">Receitas</option>
          <option value="expense">Despesas</option>
        </select>
        <select className="form-select" style={{ width: 'auto' }} value={filterCat} onChange={e => setFilterCat(e.target.value)}>
          <option value="all">Todas as categorias</option>
          {categories.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
        </select>
        <select className="form-select" style={{ width: 'auto' }} value={filterMonth} onChange={e => setFilterMonth(e.target.value)}>
          <option value="all">Todos os meses</option>
          {months.map(m => {
            const [y, mo] = m.split('-');
            const label = new Date(+y, +mo - 1, 1).toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
            return <option key={m} value={m}>{label}</option>;
          })}
        </select>
        {selected.size > 0 && (
          <button className="btn btn-danger btn-sm" onClick={handleDeleteSelected}>
            <Trash2 size={14} /> Excluir {selected.size}
          </button>
        )}
        <button className="btn btn-primary" onClick={() => { setEditing(null); setShowModal(true); }}>
          <Plus size={16} /> Nova
        </button>
      </div>

      {/* Summary */}
      <div style={{ marginBottom: 16, padding: '10px 16px', background: 'white', borderRadius: 8, border: '1px solid var(--gray-200)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 13, color: 'var(--gray-500)' }}>{filtered.length} transações exibidas</span>
        <span style={{ fontSize: 14, fontWeight: 600, color: totalFiltered >= 0 ? 'var(--success)' : 'var(--danger)' }}>
          Saldo filtrado: {formatBRL(totalFiltered)}
        </span>
      </div>

      {/* Table */}
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        {filtered.length === 0 ? (
          <div className="empty-state">
            <Filter size={40} />
            <h3>Nenhuma transação encontrada</h3>
            <p>Ajuste os filtros ou adicione uma nova transação</p>
          </div>
        ) : (
          <table className="transactions-table">
            <thead>
              <tr>
                <th style={{ width: 40 }}>
                  <input type="checkbox" checked={selected.size === filtered.length && filtered.length > 0} onChange={toggleSelectAll} />
                </th>
                <th>Data</th>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Conta</th>
                <th style={{ textAlign: 'right' }}>Valor</th>
                <th style={{ width: 80 }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filtered.map(tx => {
                const cat = catMap[tx.categoryId];
                return (
                  <tr key={tx.id}>
                    <td>
                      <input type="checkbox" checked={selected.has(tx.id)} onChange={() => toggleSelect(tx.id)} />
                    </td>
                    <td style={{ whiteSpace: 'nowrap', color: 'var(--gray-500)', fontSize: 13 }}>{formatDate(tx.date)}</td>
                    <td>
                      <div style={{ fontWeight: 500 }}>{tx.description}</div>
                      {tx.imported && <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>importado</div>}
                    </td>
                    <td>
                      {cat ? (
                        <span className="category-badge" style={{ background: cat.color + '20', color: cat.color }}>
                          {cat.icon} {cat.name}
                        </span>
                      ) : (
                        <span className="category-badge" style={{ background: 'var(--gray-100)', color: 'var(--gray-500)' }}>
                          Sem categoria
                        </span>
                      )}
                    </td>
                    <td style={{ fontSize: 13, color: 'var(--gray-500)' }}>{tx.account || '—'}</td>
                    <td style={{ textAlign: 'right' }}>
                      <span className={tx.type === 'income' ? 'amount-positive' : 'amount-negative'}>
                        {tx.type === 'income' ? '+' : '-'}{formatBRL(tx.amount)}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', gap: 4 }}>
                        <button className="btn btn-ghost btn-icon" onClick={() => { setEditing(tx); setShowModal(true); }} title="Editar">
                          <Edit2 size={14} />
                        </button>
                        <button className="btn btn-ghost btn-icon" onClick={() => handleDelete(tx.id)} title="Excluir" style={{ color: 'var(--danger)' }}>
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <TransactionModal
          categories={categories}
          transaction={editing}
          onSave={handleSave}
          onClose={() => { setShowModal(false); setEditing(null); }}
        />
      )}
    </div>
  );
}
