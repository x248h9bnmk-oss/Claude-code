import React, { useMemo, useState } from 'react';
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend } from 'recharts';
import { TrendingUp, TrendingDown, Wallet, ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { formatBRL, formatMonth } from '../utils/format';
import TransactionModal from '../components/TransactionModal';

const RADIAN = Math.PI / 180;
const renderLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
  if (percent < 0.05) return null;
  const r = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + r * Math.cos(-midAngle * RADIAN);
  const y = cy + r * Math.sin(-midAngle * RADIAN);
  return <text x={x} y={y} fill="white" textAnchor="middle" dominantBaseline="central" fontSize={12} fontWeight={600}>{(percent * 100).toFixed(0)}%</text>;
};

export default function Dashboard({ transactions, updateTransactions, categories, addToast, setPage }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [showModal, setShowModal] = useState(false);

  const prevMonth = () => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
  };
  const nextMonth = () => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
  };

  const monthTxs = useMemo(() =>
    transactions.filter(t => {
      const d = new Date(t.date + 'T00:00:00');
      return d.getFullYear() === year && d.getMonth() === month;
    }), [transactions, year, month]);

  const totalIncome = useMemo(() => monthTxs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0), [monthTxs]);
  const totalExpense = useMemo(() => monthTxs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0), [monthTxs]);
  const balance = totalIncome - totalExpense;

  const catMap = useMemo(() => Object.fromEntries(categories.map(c => [c.id, c])), [categories]);

  const expenseByCategory = useMemo(() => {
    const map = {};
    monthTxs.filter(t => t.type === 'expense').forEach(t => {
      const cid = t.categoryId || 'outros_despesa';
      map[cid] = (map[cid] || 0) + t.amount;
    });
    return Object.entries(map)
      .map(([id, total]) => ({ id, name: catMap[id]?.name || 'Outros', total, color: catMap[id]?.color || '#94a3b8' }))
      .sort((a, b) => b.total - a.total);
  }, [monthTxs, catMap]);

  // Last 6 months bar chart
  const barData = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      let m = month - (5 - i);
      let y = year;
      while (m < 0) { m += 12; y--; }
      const txs = transactions.filter(t => {
        const d = new Date(t.date + 'T00:00:00');
        return d.getFullYear() === y && d.getMonth() === m;
      });
      const income = txs.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
      const expense = txs.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);
      const label = new Date(y, m, 1).toLocaleDateString('pt-BR', { month: 'short' });
      return { label, Receitas: income, Despesas: expense };
    });
  }, [transactions, year, month]);

  const recentTxs = useMemo(() =>
    [...monthTxs].sort((a, b) => b.date.localeCompare(a.date)).slice(0, 8),
    [monthTxs]);

  const savingsRate = totalIncome > 0 ? Math.max(0, (balance / totalIncome) * 100) : 0;

  return (
    <div>
      {/* Month nav */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div className="month-nav">
          <button className="btn btn-outline btn-icon" onClick={prevMonth}><ChevronLeft size={16} /></button>
          <span>{formatMonth(year, month)}</span>
          <button className="btn btn-outline btn-icon" onClick={nextMonth}><ChevronRight size={16} /></button>
        </div>
        <button className="btn btn-primary" onClick={() => setShowModal(true)}>
          <Plus size={16} /> Nova Transação
        </button>
      </div>

      {/* Stats */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--success-light)' }}>
            <TrendingUp size={20} color="var(--success)" />
          </div>
          <div className="stat-label">Receitas</div>
          <div className="stat-value income">{formatBRL(totalIncome)}</div>
          <div className="stat-sub">{monthTxs.filter(t => t.type === 'income').length} transações</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: 'var(--danger-light)' }}>
            <TrendingDown size={20} color="var(--danger)" />
          </div>
          <div className="stat-label">Despesas</div>
          <div className="stat-value expense">{formatBRL(totalExpense)}</div>
          <div className="stat-sub">{monthTxs.filter(t => t.type === 'expense').length} transações</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: balance >= 0 ? 'var(--primary-light)' : 'var(--danger-light)' }}>
            <Wallet size={20} color={balance >= 0 ? 'var(--primary)' : 'var(--danger)'} />
          </div>
          <div className="stat-label">Saldo do Mês</div>
          <div className="stat-value balance" style={{ color: balance >= 0 ? 'var(--success)' : 'var(--danger)' }}>
            {formatBRL(balance)}
          </div>
          <div className="stat-sub">{balance >= 0 ? '✓ No azul' : '⚠ No vermelho'}</div>
        </div>
        <div className="stat-card">
          <div className="stat-icon" style={{ background: '#f0fdf4' }}>
            <span style={{ fontSize: 20 }}>💰</span>
          </div>
          <div className="stat-label">Taxa de Poupança</div>
          <div className="stat-value" style={{ color: savingsRate > 20 ? 'var(--success)' : savingsRate > 0 ? 'var(--warning)' : 'var(--danger)' }}>
            {savingsRate.toFixed(1)}%
          </div>
          <div className="stat-sub">da receita economizada</div>
        </div>
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="card">
          <div className="card-header">
            <div className="card-title">Despesas por Categoria</div>
          </div>
          {expenseByCategory.length === 0 ? (
            <div className="empty-state" style={{ padding: 32 }}>
              <p>Sem despesas neste mês</p>
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={expenseByCategory} dataKey="total" nameKey="name" cx="50%" cy="50%" outerRadius={100} labelLine={false} label={renderLabel}>
                  {expenseByCategory.map((e) => <Cell key={e.id} fill={e.color} />)}
                </Pie>
                <Tooltip formatter={(v) => formatBRL(v)} />
                <Legend formatter={(v) => <span style={{ fontSize: 12 }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Receitas vs Despesas (6 meses)</div>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={barData} barGap={4}>
              <XAxis dataKey="label" tick={{ fontSize: 12 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => formatBRL(v)} />
              <Legend formatter={(v) => <span style={{ fontSize: 12 }}>{v}</span>} />
              <Bar dataKey="Receitas" fill="#16a34a" radius={[4,4,0,0]} />
              <Bar dataKey="Despesas" fill="#dc2626" radius={[4,4,0,0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Top categories + recent */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <div className="card">
          <div className="card-header">
            <div className="card-title">Top Categorias</div>
            <button className="btn btn-ghost btn-sm" onClick={() => setPage('reports')}>Ver tudo</button>
          </div>
          {expenseByCategory.slice(0, 6).map(cat => (
            <div key={cat.id} className="category-summary-row">
              <div className="category-dot" style={{ background: cat.color, width: 12, height: 12, borderRadius: '50%', flexShrink: 0 }} />
              <div className="category-summary-info">
                <div className="category-summary-name">{cat.name}</div>
                <div className="progress-bar" style={{ marginTop: 6 }}>
                  <div className="progress-fill" style={{ width: `${(cat.total / totalExpense * 100).toFixed(0)}%`, background: cat.color }} />
                </div>
              </div>
              <div className="category-summary-amount" style={{ color: cat.color }}>{formatBRL(cat.total)}</div>
            </div>
          ))}
          {expenseByCategory.length === 0 && <div className="empty-state" style={{ padding: 20 }}><p>Sem dados</p></div>}
        </div>

        <div className="card">
          <div className="card-header">
            <div className="card-title">Transações Recentes</div>
            <button className="btn btn-ghost btn-sm" onClick={() => setPage('transactions')}>Ver tudo</button>
          </div>
          {recentTxs.length === 0 ? (
            <div className="empty-state" style={{ padding: 20 }}>
              <p>Sem transações este mês</p>
            </div>
          ) : (
            <div>
              {recentTxs.map(tx => {
                const cat = catMap[tx.categoryId];
                return (
                  <div key={tx.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '10px 0', borderBottom: '1px solid var(--gray-100)' }}>
                    <span style={{ fontSize: 20, lineHeight: 1 }}>{cat?.icon || '💸'}</span>
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <div style={{ fontSize: 13, fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{tx.description}</div>
                      <div style={{ fontSize: 11, color: 'var(--gray-400)' }}>{new Date(tx.date + 'T00:00:00').toLocaleDateString('pt-BR')}</div>
                    </div>
                    <div className={tx.type === 'income' ? 'amount-positive' : 'amount-negative'} style={{ fontSize: 13, whiteSpace: 'nowrap' }}>
                      {tx.type === 'income' ? '+' : '-'}{formatBRL(tx.amount)}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>

      {showModal && (
        <TransactionModal
          categories={categories}
          onSave={(tx) => {
            updateTransactions([tx, ...transactions]);
            addToast('Transação adicionada!');
            setShowModal(false);
          }}
          onClose={() => setShowModal(false)}
        />
      )}
    </div>
  );
}
