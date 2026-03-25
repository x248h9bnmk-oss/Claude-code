const KEYS = {
  TRANSACTIONS: 'bf_transactions',
  CATEGORIES: 'bf_categories',
  ACCOUNTS: 'bf_accounts',
};

export const storage = {
  get: (key, fallback = null) => {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : fallback;
    } catch {
      return fallback;
    }
  },
  set: (key, value) => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch (e) {
      console.error('Storage error:', e);
    }
  },
};

export const getTransactions = () => storage.get(KEYS.TRANSACTIONS, []);
export const setTransactions = (t) => storage.set(KEYS.TRANSACTIONS, t);

export const getCategories = () => storage.get(KEYS.CATEGORIES, null);
export const setCategories = (c) => storage.set(KEYS.CATEGORIES, c);

export const getAccounts = () => storage.get(KEYS.ACCOUNTS, []);
export const setAccounts = (a) => storage.set(KEYS.ACCOUNTS, a);
