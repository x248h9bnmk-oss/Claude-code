import React, { useState } from 'react';
import { X } from 'lucide-react';

export default function TransactionModal({ transaction, categories, onSave, onClose }) {
  const today = new Date().toISOString().slice(0, 10);
  const [form, setForm] = useState({
    date: transaction?.date || today,
    description: transaction?.description || '',
    amount: transaction?.amount ? String(transaction.amount) : '',
    type: transaction?.type || 'expense',
    categoryId: transaction?.categoryId || '',
    account: transaction?.account || '',
  });
  const [errors, setErrors] = useState({});

  const set = (k, v) => setForm(f => ({ ...f, [k]: v }));

  const validate = () => {
    const e = {};
    if (!form.description.trim()) e.description = 'Obrigatório';
    if (!form.amount || isNaN(parseFloat(form.amount.replace(',', '.'))) || parseFloat(form.amount.replace(',', '.')) <= 0) e.amount = 'Valor inválido';
    if (!form.date) e.date = 'Obrigatório';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const amountNum = parseFloat(form.amount.replace(',', '.'));
    onSave({
      id: transaction?.id || `tx_${Date.now()}`,
      ...form,
      amount: amountNum,
    });
  };

  const filteredCats = categories.filter(c => c.type === form.type);

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
          <div className="modal-title" style={{ marginBottom: 0 }}>
            {transaction ? 'Editar Transação' : 'Nova Transação'}
          </div>
          <button className="btn btn-ghost btn-icon" onClick={onClose}><X size={18} /></button>
        </div>

        {/* Type toggle */}
        <div className="form-group">
          <div style={{ display: 'flex', gap: 0, borderRadius: 8, overflow: 'hidden', border: '1px solid var(--gray-200)' }}>
            <button
              style={{ flex: 1, padding: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14, transition: 'all 0.15s',
                background: form.type === 'expense' ? 'var(--danger)' : 'white',
                color: form.type === 'expense' ? 'white' : 'var(--gray-500)' }}
              onClick={() => { set('type', 'expense'); set('categoryId', ''); }}
            >
              Despesa
            </button>
            <button
              style={{ flex: 1, padding: '8px', border: 'none', cursor: 'pointer', fontWeight: 600, fontSize: 14, transition: 'all 0.15s',
                background: form.type === 'income' ? 'var(--success)' : 'white',
                color: form.type === 'income' ? 'white' : 'var(--gray-500)' }}
              onClick={() => { set('type', 'income'); set('categoryId', ''); }}
            >
              Receita
            </button>
          </div>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Data *</label>
            <input className="form-input" type="date" value={form.date} onChange={e => set('date', e.target.value)} />
            {errors.date && <div style={{ fontSize: 12, color: 'var(--danger)', marginTop: 2 }}>{errors.date}</div>}
          </div>
          <div className="form-group" style={{ marginBottom: 0 }}>
            <label className="form-label">Valor (R$) *</label>
            <input
              className="form-input"
              placeholder="0,00"
              value={form.amount}
              onChange={e => set('amount', e.target.value)}
              style={{ borderColor: errors.amount ? 'var(--danger)' : '' }}
            />
            {errors.amount && <div style={{ fontSize: 12, color: 'var(--danger)', marginTop: 2 }}>{errors.amount}</div>}
          </div>
        </div>

        <div className="form-group" style={{ marginTop: 12 }}>
          <label className="form-label">Descrição *</label>
          <input
            className="form-input"
            placeholder="Ex: Supermercado, Salário, etc."
            value={form.description}
            onChange={e => set('description', e.target.value)}
            style={{ borderColor: errors.description ? 'var(--danger)' : '' }}
          />
          {errors.description && <div style={{ fontSize: 12, color: 'var(--danger)', marginTop: 2 }}>{errors.description}</div>}
        </div>

        <div className="form-group">
          <label className="form-label">Categoria</label>
          <select className="form-select" value={form.categoryId} onChange={e => set('categoryId', e.target.value)}>
            <option value="">Sem categoria</option>
            {filteredCats.map(c => <option key={c.id} value={c.id}>{c.icon} {c.name}</option>)}
          </select>
        </div>

        <div className="form-group">
          <label className="form-label">Conta / Cartão</label>
          <input
            className="form-input"
            placeholder="Ex: Nubank, Itaú, Cartão Bradesco..."
            value={form.account}
            onChange={e => set('account', e.target.value)}
          />
        </div>

        <div className="modal-footer">
          <button className="btn btn-outline" onClick={onClose}>Cancelar</button>
          <button className="btn btn-primary" onClick={handleSave}>
            {transaction ? 'Salvar' : 'Adicionar'}
          </button>
        </div>
      </div>
    </div>
  );
}
