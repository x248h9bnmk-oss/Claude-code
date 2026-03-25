import React, { useState, useMemo } from 'react';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend, LineChart, Line, CartesianGrid } from 'recharts';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { formatBRL, formatMonth } from '../utils/format';

export default function Reports({ transactions, categories }) {
  const today = new Date();
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth());
  const [tab, setTab] = useState('expenses');

  const prevMonth = () => { if (month === 0) { setMonth(11); setYear(y => y - 1); } else setMonth(m => m - 1); };
  const nextMonth = () => { if (month === 11) { setMonth(0); setYear(y => y + 1); } else setMonth(m => m + 1); };

  const catMap = useMemo(() => Object.fromEntries(categories.map(c => [c.id, c])), [categories]);

  const monthTxs = useMemo(() =>
    transactions.filter(t => {
      const d = new Date(t.date + 'T00:00:00');
      return d.getFullYear() === year && d.getMonth() === month;
    }), [transactions, year, month]);

  // By category
  const expenseByCat = useMemo(() => {
    const map = {};
    monthTxs.filter(t => t.type === 'expense').forEach(t => {
      const cid = t.categoryId || 'outros_despesa';
      if (!map[cid]) map[cid] = { total: 0, count: 0, txs: [] };
      map[cid].total += t.amount;
      map[cid].count++;
      map[cid].txs.push(t);
    });
    return Object.entries(map).map(([id, data]) => ({
      id,
      name: catMap[id]?.name || 'Outros',
      icon: catMap[id]?.icon || '💸',
      color: catMap[id]?.color || '#94a3b8',
      ...data,
    })).sort((a, b) => b.total - a.total);
  }, [monthTxs, catMap]);

  const incomeByCat = useMemo(() => {
    const map = {};
    monthTxs.filter(t => t.type === 'income').forEach(t => {
      const cid = t.categoryId || 'outros_receita';
      if (!map[cid]) map[cid] = { total: 0, count: 0 };
      map[cid].total += t.amount;
      map[cid].count++;
    });
    return Object.entries(map).map(([id, data]) => ({
      id,
      name: catMap[id]?.name || 'Outros',
      icon: catMap[id]?.icon || '💰',
      color: catMap[id]?.color || '#16a34a',
      ...data,
    })).sort((a, b) => b.total - a.total);
  }, [monthTxs, catMap]);

  const totalExpense = expenseByCat.reduce((s, c) => s + c.total, 0);
  const totalIncome = incomeByCat.reduce((s, c) => s + c.total, 0);

  // Daily spending
  const dailyData = useMemo(() => {
    const map = {};
    monthTxs.filter(t => t.type === 'expense').forEach(t => {
      const day = t.date.slice(8, 10);
      map[day] = (map[day] || 0) + t.amount;
    });
    return Object.entries(map).sort(([a], [b]) => a.localeCompare(b)).map(([day, total]) => ({
      day: parseInt(day, 10),
      total,
    }));
  }, [monthTxs]);

  // Monthly trend
  const monthlyTrend = useMemo(() => {
    return Array.from({ length: 6 }, (_, i) => {
      let m = month - (5 - i);
      let y = year;
      while (m < 0) { m += 12; y--; }
      const label = new Date(y, m, 1).toLocaleDateString('pt-BR', { month: 'short' });
      const total = transactions
        .filter(t => {
          const d = new Date(t.date + 'T00:00:00');
          return d.getFullYear() === y && d.getMonth() === m && t.type === 'expense';
        })
        .reduce((s, t) => s + t.amount, 0);
      const income = transactions
        .filter(t => {
          const d = new Date(t.date + 'T00:00:00');
          return d.getFullYear() === y && d.getMonth() === m && t.type === 'income';
        })
        .reduce((s, t) => s + t.amount, 0);
      return { label, Despesas: total, Receitas: income };
    });
  }, [transactions, year, month]);

  const cats = tab === 'expenses' ? expenseByCat : incomeByCat;
  const catTotal = tab === 'expenses' ? totalExpense : totalIncome;

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 24 }}>
        <div className="month-nav">
          <button className="btn btn-outline btn-icon" onClick={prevMonth}><ChevronLeft size={16} /></button>
          <span>{formatMonth(year, month)}</span>
          <button className="btn btn-outline btn-icon" onClick={nextMonth}><ChevronRight size={16} /></button>
        </div>
        <div className="period-tabs">
          <div className={`period-tab${tab === 'expenses' ? ' active' : ''}`} onClick={() => setTab('expenses')}>Despesas</div>
          <div className={`period-tab${tab === 'income' ? ' active' : ''}`} onClick={() => setTab('income')}>Receitas</div>
        </div>
      </div>

      {/* Summary total */}
      <div style={{ marginBottom: 24, padding: 20, background: 'white', borderRadius: 'var(--radius)', boxShadow: 'var(--shadow)', textAlign: 'center' }}>
        <div style={{ fontSize: 13, color: 'var(--gray-500)', marginBottom: 4 }}>Total de {tab === 'expenses' ? 'Despesas' : 'Receitas'} em {formatMonth(year, month)}</div>
        <div style={{ fontSize: 36, fontWeight: 800, color: tab === 'expenses' ? 'var(--danger)' : 'var(--success)' }}>
          {formatBRL(catTotal)}
        </div>
        <div style={{ fontSize: 13, color: 'var(--gray-400)', marginTop: 4 }}>{cats.length} categorias · {cats.reduce((s, c) => s + c.count, 0)} transações</div>
      </div>

      <div className="charts-grid">
        {/* Pie */}
        <div className="card">
          <div className="card-header"><div className="card-title">Distribuição por Categoria</div></div>
          {cats.length === 0 ? (
            <div className="empty-state" style={{ padding: 32 }}><p>Sem dados neste período</p></div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie data={cats} dataKey="total" nameKey="name" cx="50%" cy="50%" outerRadius={110} innerRadius={50}>
                  {cats.map(c => <Cell key={c.id} fill={c.color} />)}
                </Pie>
                <Tooltip formatter={(v) => formatBRL(v)} />
                <Legend formatter={(v) => <span style={{ fontSize: 12 }}>{v}</span>} />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        {/* Bar by category */}
        <div className="card">
          <div className="card-header"><div className="card-title">Valor por Categoria</div></div>
          {cats.length === 0 ? (
            <div className="empty-state" style={{ padding: 32 }}><p>Sem dados neste período</p></div>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={cats} layout="vertical" margin={{ left: 80 }}>
                <XAxis type="number" tick={{ fontSize: 11 }} tickFormatter={(v) => `R$${(v/1000).toFixed(1)}k`} />
                <YAxis type="category" dataKey="name" tick={{ fontSize: 11 }} width={80} />
                <Tooltip formatter={(v) => formatBRL(v)} />
                <Bar dataKey="total" radius={[0,4,4,0]}>
                  {cats.map(c => <Cell key={c.id} fill={c.color} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      {/* Daily + monthly trend */}
      <div className="charts-grid" style={{ marginTop: 0 }}>
        <div className="card">
          <div className="card-header"><div className="card-title">Gastos Diários (Despesas)</div></div>
          {dailyData.length === 0 ? (
            <div className="empty-state" style={{ padding: 32 }}><p>Sem dados neste período</p></div>
          ) : (
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={dailyData}>
                <XAxis dataKey="day" tick={{ fontSize: 11 }} />
                <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `R$${(v/1000).toFixed(1)}k`} />
                <Tooltip formatter={(v) => formatBRL(v)} labelFormatter={(l) => `Dia ${l}`} />
                <Bar dataKey="total" fill="#dc2626" radius={[3,3,0,0]} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="card">
          <div className="card-header"><div className="card-title">Tendência (6 meses)</div></div>
          <ResponsiveContainer width="100%" height={200}>
            <LineChart data={monthlyTrend}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--gray-100)" />
              <XAxis dataKey="label" tick={{ fontSize: 11 }} />
              <YAxis tick={{ fontSize: 11 }} tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} />
              <Tooltip formatter={(v) => formatBRL(v)} />
              <Legend formatter={(v) => <span style={{ fontSize: 12 }}>{v}</span>} />
              <Line type="monotone" dataKey="Receitas" stroke="#16a34a" strokeWidth={2} dot={{ r: 3 }} />
              <Line type="monotone" dataKey="Despesas" stroke="#dc2626" strokeWidth={2} dot={{ r: 3 }} />
            </LineChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Detail table */}
      <div className="card" style={{ marginTop: 0 }}>
        <div className="card-header">
          <div className="card-title">Detalhamento por Categoria</div>
        </div>
        {cats.length === 0 ? (
          <div className="empty-state"><p>Sem dados para exibir</p></div>
        ) : (
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Categoria</th>
                <th style={{ textAlign: 'center' }}>Transações</th>
                <th style={{ textAlign: 'right' }}>Total</th>
                <th style={{ textAlign: 'right' }}>% do Total</th>
                <th>Participação</th>
              </tr>
            </thead>
            <tbody>
              {cats.map(cat => {
                const pct = catTotal > 0 ? (cat.total / catTotal * 100) : 0;
                return (
                  <tr key={cat.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                        <span style={{ fontSize: 18 }}>{cat.icon}</span>
                        <span style={{ fontWeight: 500 }}>{cat.name}</span>
                      </div>
                    </td>
                    <td style={{ textAlign: 'center', color: 'var(--gray-500)' }}>{cat.count}</td>
                    <td style={{ textAlign: 'right', fontWeight: 700, color: tab === 'expenses' ? 'var(--danger)' : 'var(--success)' }}>
                      {formatBRL(cat.total)}
                    </td>
                    <td style={{ textAlign: 'right', color: 'var(--gray-600)', fontWeight: 600 }}>
                      {pct.toFixed(1)}%
                    </td>
                    <td style={{ width: 160 }}>
                      <div className="progress-bar">
                        <div className="progress-fill" style={{ width: `${pct}%`, background: cat.color }} />
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr style={{ background: 'var(--gray-50)' }}>
                <td style={{ fontWeight: 700, padding: '12px 16px' }}>Total</td>
                <td style={{ textAlign: 'center', fontWeight: 600, padding: '12px 16px' }}>{cats.reduce((s, c) => s + c.count, 0)}</td>
                <td style={{ textAlign: 'right', fontWeight: 800, padding: '12px 16px', color: tab === 'expenses' ? 'var(--danger)' : 'var(--success)' }}>
                  {formatBRL(catTotal)}
                </td>
                <td style={{ padding: '12px 16px' }}>100%</td>
                <td />
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
}
