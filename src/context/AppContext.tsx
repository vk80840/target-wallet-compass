
import React, { createContext, useState, useContext, useEffect, ReactNode } from 'react';

// Types
export type Currency = 'USD' | 'INR';

export interface Target {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  endDate: string;
  collectedAmount: number;
  addFund: boolean;
}

export type AssetType = 'Stock' | 'Crypto' | 'TETHER' | 'RUPPES';

export interface Asset {
  id: string;
  type: AssetType;
  name: string;
  logoUrl: string;
  quantity: number;
  price: number;
  currency: Currency;
  timestamp: number;
}

export interface Transaction {
  id: string;
  type: 'Buy' | 'Sell' | 'Add' | 'Remove';
  assetName: string;
  amount: number;
  price: number;
  currency: Currency;
  timestamp: number;
}

interface AppContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  targets: Target[];
  addTarget: (target: Omit<Target, 'id' | 'collectedAmount' | 'addFund'>) => void;
  removeTarget: (id: string) => void;
  toggleAddFund: (id: string) => void;
  assets: Asset[];
  addAsset: (asset: Omit<Asset, 'id' | 'timestamp'>) => void;
  removeAsset: (id: string) => void;
  transactions: Transaction[];
  addTransaction: (transaction: Omit<Transaction, 'id' | 'timestamp'>) => void;
  getTotalWalletBalance: () => number;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useAppContext must be used within an AppProvider');
  }
  return context;
};

interface AppProviderProps {
  children: ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
  // Local storage keys
  const TARGETS_KEY = 'wallet_app_targets';
  const ASSETS_KEY = 'wallet_app_assets';
  const TRANSACTIONS_KEY = 'wallet_app_transactions';
  const CURRENCY_KEY = 'wallet_app_currency';

  // State
  const [currency, setCurrency] = useState<Currency>(() => {
    const saved = localStorage.getItem(CURRENCY_KEY);
    return saved ? (saved as Currency) : 'USD';
  });
  
  const [targets, setTargets] = useState<Target[]>(() => {
    const saved = localStorage.getItem(TARGETS_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [assets, setAssets] = useState<Asset[]>(() => {
    const saved = localStorage.getItem(ASSETS_KEY);
    return saved ? JSON.parse(saved) : [];
  });
  
  const [transactions, setTransactions] = useState<Transaction[]>(() => {
    const saved = localStorage.getItem(TRANSACTIONS_KEY);
    return saved ? JSON.parse(saved) : [];
  });

  // Save to localStorage whenever state changes
  useEffect(() => {
    localStorage.setItem(TARGETS_KEY, JSON.stringify(targets));
  }, [targets]);

  useEffect(() => {
    localStorage.setItem(ASSETS_KEY, JSON.stringify(assets));
  }, [assets]);

  useEffect(() => {
    localStorage.setItem(TRANSACTIONS_KEY, JSON.stringify(transactions));
  }, [transactions]);

  useEffect(() => {
    localStorage.setItem(CURRENCY_KEY, currency);
  }, [currency]);

  // Helper function to generate unique IDs
  const generateId = () => Math.random().toString(36).substring(2, 9);

  // Target functions
  const addTarget = (target: Omit<Target, 'id' | 'collectedAmount' | 'addFund'>) => {
    const newTarget: Target = {
      ...target,
      id: generateId(),
      collectedAmount: 0,
      addFund: false
    };
    setTargets(prev => [...prev, newTarget]);
  };

  const removeTarget = (id: string) => {
    setTargets(prev => prev.filter(target => target.id !== id));
  };

  const toggleAddFund = (id: string) => {
    setTargets(prev =>
      prev.map(target =>
        target.id === id
          ? { ...target, addFund: !target.addFund }
          : target
      )
    );
  };

  // Asset functions
  const addAsset = (asset: Omit<Asset, 'id' | 'timestamp'>) => {
    const newAsset: Asset = {
      ...asset,
      id: generateId(),
      timestamp: Date.now()
    };
    
    setAssets(prev => [...prev, newAsset]);
    
    // Add transaction record
    addTransaction({
      type: 'Buy',
      assetName: asset.name,
      amount: asset.quantity,
      price: asset.price,
      currency: asset.currency
    });
  };

  const removeAsset = (id: string) => {
    const asset = assets.find(a => a.id === id);
    if (asset) {
      addTransaction({
        type: 'Remove',
        assetName: asset.name,
        amount: asset.quantity,
        price: asset.price,
        currency: asset.currency
      });
    }
    setAssets(prev => prev.filter(asset => asset.id !== id));
  };

  // Transaction functions
  const addTransaction = (transaction: Omit<Transaction, 'id' | 'timestamp'>) => {
    const newTransaction: Transaction = {
      ...transaction,
      id: generateId(),
      timestamp: Date.now()
    };
    setTransactions(prev => [newTransaction, ...prev]);
  };

  // Helper to calculate total wallet balance
  const getTotalWalletBalance = () => {
    return assets.reduce((total, asset) => {
      let valueInUSD = 0;
      
      if (asset.currency === 'USD') {
        valueInUSD = asset.price * asset.quantity;
      } else if (asset.currency === 'INR') {
        valueInUSD = (asset.price / 88) * asset.quantity;
      }
      
      return total + valueInUSD;
    }, 0);
  };

  const value = {
    currency,
    setCurrency,
    targets,
    addTarget,
    removeTarget,
    toggleAddFund,
    assets,
    addAsset,
    removeAsset,
    transactions,
    addTransaction,
    getTotalWalletBalance
  };

  return (
    <AppContext.Provider value={value}>
      {children}
    </AppContext.Provider>
  );
};
