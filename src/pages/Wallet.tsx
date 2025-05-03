
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';
import AssetCard from '../components/AssetCard';
import AddAssetForm from '../components/AddAssetForm';
import RemoveAsset from '../components/RemoveAsset';
import TransactionHistory from '../components/TransactionHistory';
import CurrencyToggle from '../components/CurrencyToggle';
import { formatAmount } from '../utils/formatters';
import { Plus, Minus, History } from 'lucide-react';

type ActiveView = 'main' | 'add' | 'remove' | 'history';

const Wallet: React.FC = () => {
  const { assets, currency, getTotalWalletBalance } = useAppContext();
  const [activeView, setActiveView] = useState<ActiveView>('main');
  
  const totalBalance = getTotalWalletBalance();
  const totalBalanceInCurrency = currency === 'USD' ? totalBalance : totalBalance * 88;
  
  // Handler for opening asset form for additional purchase
  const handleAddMoreToAsset = (assetId: string) => {
    // For now just open the add form. In a real app, we'd pre-fill the form with the asset details.
    setActiveView('add');
  };
  
  return (
    <div className="p-4 pb-20">
      {activeView === 'main' && (
        <>
          <h1 className="text-2xl font-display font-bold mb-2 text-center">My Wallet</h1>
          
          <CurrencyToggle />
          
          <div className="wallet-card mb-6">
            <h2 className="text-gray-500 text-sm mb-1">Total Balance</h2>
            <div className="text-2xl font-bold mb-1">
              {formatAmount(totalBalanceInCurrency, currency)}
            </div>
            <div className="text-sm text-gray-500">
              {currency === 'USD' 
                ? `₹${(totalBalance * 88).toFixed(2)}` 
                : `$${totalBalance.toFixed(2)}`}
            </div>
          </div>
          
          <div className="mb-6">
            <h2 className="font-display font-semibold mb-3">My Assets</h2>
            {assets.length === 0 ? (
              <div className="bg-gray-50 p-6 rounded-lg text-center text-gray-500">
                No assets added yet. Click the Add button below to add your first asset.
              </div>
            ) : (
              <div>
                {assets.map((asset) => (
                  <AssetCard 
                    key={asset.id} 
                    asset={asset} 
                    onAddMore={() => handleAddMoreToAsset(asset.id)} 
                  />
                ))}
              </div>
            )}
          </div>
          
          <div className="wallet-card flex justify-around">
            <button
              onClick={() => setActiveView('add')}
              className="flex flex-col items-center p-3 text-accent-foreground"
            >
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center mb-1">
                <Plus size={20} color="#fff" />
              </div>
              <span className="text-sm font-medium">Add</span>
            </button>
            
            <button
              onClick={() => setActiveView('remove')}
              className="flex flex-col items-center p-3 text-accent-foreground"
            >
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center mb-1">
                <Minus size={20} color="#fff" />
              </div>
              <span className="text-sm font-medium">Remove</span>
            </button>
            
            <button
              onClick={() => setActiveView('history')}
              className="flex flex-col items-center p-3 text-accent-foreground"
            >
              <div className="w-10 h-10 bg-accent rounded-full flex items-center justify-center mb-1">
                <History size={20} color="#fff" />
              </div>
              <span className="text-sm font-medium">History</span>
            </button>
          </div>
        </>
      )}
      
      {activeView === 'add' && (
        <AddAssetForm onClose={() => setActiveView('main')} />
      )}
      
      {activeView === 'remove' && (
        <RemoveAsset onClose={() => setActiveView('main')} />
      )}
      
      {activeView === 'history' && (
        <TransactionHistory onClose={() => setActiveView('main')} />
      )}
    </div>
  );
};

export default Wallet;
