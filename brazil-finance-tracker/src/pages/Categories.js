import React, { useState } from 'react';
import { Plus, Trash2, Edit2, Tag } from 'lucide-react';
import { CATEGORY_COLORS } from '../data/categories';

export default function Categories({ categories, updateCategories, transactions, addToast }) {
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: '', icon: '💰', color: '#3b82f6', type: 'expense' });
  const [tab, setTab] = useState('expense');

  const usageMap = {};
  transactions.forEach(t => {
    if (t.categoryId) usageMap[t.categoryId] = (usageMap[t.categoryId] || 0) + 1;
  });

  const openNew = () => {
    setEditing(null);
    setForm({ name: '', icon: '💰', color: '#3b82f6', type: tab });
    setShowModal(true);
  };

  const openEdit = (cat) => {
    setEditing(cat);
    setForm({ name: cat.name, icon: cat.icon, color: cat.color, type: cat.type });
    setShowModal(true);
  };

  const handleSave = () => {
    if (!form.name.trim()) { addToast('Nome obrigatório', 'error'); return; }
    if (editing) {
      updateCategories(categories.map(c => c.id === editing.id ? { ...c, ...form } : c));
      addToast('Categoria atualizada!');
    } else {
      const id = form.name.toLowerCase().replace(/\s+/g, '_').replace(/[^a-z0-9_]/g, '') + '_' + Date.now();
      updateCategories([...categories, { id, ...form }]);
      addToast('Categoria criada!');
    }
    setShowModal(false);
  };

  const handleDelete = (cat) => {
    const usage = usageMap[cat.id] || 0;
    if (usage > 0 && !window.confirm(`Esta categoria tem ${usage} transação(ões). Excluir mesmo assim?`)) return;
    updateCategories(categories.filter(c => c.id !== cat.id));
    addToast('Categoria removida.');
  };

  const displayCats = categories.filter(c => c.type === tab);

  const ICONS = ['💰','💳','🏠','🚗','🍽️','📱','🏥','📚','🎉','✈️','🛒','👗','🐾','💄','🎮','⚽','🏦','💼','📈','💸','🔧','🎵','📷','🎓','🌱','⚡','🏋️','☕'];

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 }}>
        <div className="period-tabs">
          <div className={`period-tab${tab === 'expense' ? ' active' : ''}`} onClick={() => setTab('expense')}>Despesas</div>
          <div className={`period-tab${tab === 'income' ? ' active' : ''}`} onClick={() => setTab('income')}>Receitas</div>
        </div>
        <button className="btn btn-primary" onClick={openNew}>
          <Plus size={16} /> Nova Categoria
        </button>
      </div>

      <div className="card">
        {displayCats.length === 0 ? (
          <div className="empty-state">
            <Tag size={40} />
            <h3>Nenhuma categoria</h3>
            <p>Crie categorias para organizar suas finanças</p>
          </div>
        ) : (
          <div className="category-list">
            {displayCats.map(cat => (
              <div key={cat.id} className="category-item">
                <div className="category-item-left">
                  <div style={{ width: 36, height: 36, borderRadius: 8, background: cat.color + '20', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 18 }}>
                    {cat.icon}
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: 14 }}>{cat.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--gray-400)' }}>
                      {usageMap[cat.id] || 0} transações
                    </div>
                  </div>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                  <div style={{ width: 12, height: 12, borderRadius: '50%', background: cat.color }} />
                  <span style={{ fontSize: 12, color: 'var(--gray-400)', marginRight: 8 }}>{cat.color}</span>
                  <button className="btn btn-ghost btn-icon" onClick={() => openEdit(cat)}><Edit2 size={14} /></button>
                  <button className="btn btn-ghost btn-icon" onClick={() => handleDelete(cat)} style={{ color: 'var(--danger)' }}><Trash2 size={14} /></button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal">
            <div className="modal-title">{editing ? 'Editar Categoria' : 'Nova Categoria'}</div>

            <div className="form-group">
              <label className="form-label">Nome</label>
              <input className="form-input" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} placeholder="Ex: Alimentação" />
            </div>

            <div className="form-group">
              <label className="form-label">Tipo</label>
              <select className="form-select" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))}>
                <option value="expense">Despesa</option>
                <option value="income">Receita</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Ícone</label>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 8 }}>
                {ICONS.map(ico => (
                  <button
                    key={ico}
                    onClick={() => setForm(f => ({ ...f, icon: ico }))}
                    style={{
                      width: 36, height: 36, borderRadius: 6, border: form.icon === ico ? '2px solid var(--primary)' : '1px solid var(--gray-200)',
                      background: form.icon === ico ? 'var(--primary-light)' : 'white',
                      fontSize: 18, cursor: 'pointer',
                    }}
                  >
                    {ico}
                  </button>
                ))}
              </div>
              <input className="form-input" value={form.icon} onChange={e => setForm(f => ({ ...f, icon: e.target.value }))} placeholder="Ou cole um emoji" style={{ width: 100 }} />
            </div>

            <div className="form-group">
              <label className="form-label">Cor</label>
              <div className="color-options" style={{ marginBottom: 8 }}>
                {CATEGORY_COLORS.map(c => (
                  <div
                    key={c}
                    className={`color-option${form.color === c ? ' selected' : ''}`}
                    style={{ background: c }}
                    onClick={() => setForm(f => ({ ...f, color: c }))}
                  />
                ))}
              </div>
              <input type="color" value={form.color} onChange={e => setForm(f => ({ ...f, color: e.target.value }))} style={{ width: 40, height: 32, border: 'none', cursor: 'pointer', borderRadius: 4 }} />
            </div>

            <div className="modal-footer">
              <button className="btn btn-outline" onClick={() => setShowModal(false)}>Cancelar</button>
              <button className="btn btn-primary" onClick={handleSave}>{editing ? 'Salvar' : 'Criar'}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
