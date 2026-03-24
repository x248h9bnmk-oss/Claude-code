import React, { useState, useEffect, useCallback } from 'react';
import { LayoutDashboard, ArrowUpDown, Tag, Upload, TrendingUp } from 'lucide-react';
import Dashboard from './pages/Dashboard';
import Transactions from './pages/Transactions';
import Categories from './pages/Categories';
import Import from './pages/Import';
import Reports from './pages/Reports';
import { DEFAULT_CATEGORIES } from './data/categories';
import { getTransactions, setTransactions, getCategories, setCategories } from './utils/storage';
import './App.css';

const NAV = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'transactions', label: 'Transações', icon: ArrowUpDown },
  { id: 'reports', label: 'Relatórios', icon: TrendingUp },
  { id: 'categories', label: 'Categorias', icon: Tag },
  { id: 'import', label: 'Importar Dados', icon: Upload },
];

const PAGE_TITLES = {
  dashboard: 'Dashboard',
  transactions: 'Transações',
  reports: 'Relatórios por Categoria',
  categories: 'Gerenciar Categorias',
  import: 'Importar Dados Open Finance',
};

export default function App() {
  const [page, setPage] = useState('dashboard');
  const [transactions, setTxLocal] = useState([]);
  const [categories, setCatsLocal] = useState([]);
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const stored = getTransactions();
    setTxLocal(stored);
    const cats = getCategories() || DEFAULT_CATEGORIES;
    setCatsLocal(cats);
  }, []);

  const addToast = useCallback((msg, type = 'success') => {
    const id = Date.now();
    setToasts(t => [...t, { id, msg, type }]);
    setTimeout(() => setToasts(t => t.filter(x => x.id !== id)), 3500);
  }, []);

  const updateTransactions = useCallback((txs) => {
    setTxLocal(txs);
    setTransactions(txs);
  }, []);

  const updateCategories = useCallback((cats) => {
    setCatsLocal(cats);
    setCategories(cats);
  }, []);

  const pageProps = { transactions, updateTransactions, categories, updateCategories, addToast, setPage };

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="sidebar-logo">
          <h1>Minhas Finanças</h1>
          <span>Open Finance BR</span>
        </div>
        <nav className="sidebar-nav">
          <div className="nav-section">
            <div className="nav-section-title">Menu</div>
            {NAV.map(({ id, label, icon: Icon }) => (
              <div
                key={id}
                className={`nav-item${page === id ? ' active' : ''}`}
                onClick={() => setPage(id)}
              >
                <Icon size={18} />
                {label}
              </div>
            ))}
          </div>
        </nav>
        <div className="sidebar-footer">
          Open Finance Brasil · 2024
        </div>
      </aside>

      <main className="main">
        <header className="topbar">
          <div className="topbar-title">{PAGE_TITLES[page]}</div>
          <div className="topbar-actions">
            <span style={{ fontSize: 13, color: 'var(--gray-500)' }}>
              {transactions.length} transações
            </span>
          </div>
        </header>

        <div className="page-content">
          {page === 'dashboard' && <Dashboard {...pageProps} />}
          {page === 'transactions' && <Transactions {...pageProps} />}
          {page === 'reports' && <Reports {...pageProps} />}
          {page === 'categories' && <Categories {...pageProps} />}
          {page === 'import' && <Import {...pageProps} />}
        </div>
      </main>

      <div className="toast-container">
        {toasts.map(t => (
          <div key={t.id} className={`toast ${t.type}`}>{t.msg}</div>
        ))}
      </div>
    </div>
  );
}
