
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { formatAmount } from '../utils/formatters';

interface RemoveAssetProps {
  onClose: () => void;
}

const RemoveAsset: React.FC<RemoveAssetProps> = ({ onClose }) => {
  const { assets, removeAsset, currency } = useAppContext();
  
  return (
    <div className="wallet-card animate-slide-up">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-display font-semibold">Remove Asset</h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      {assets.length === 0 ? (
        <p className="text-center text-gray-500 py-6">No assets to remove.</p>
      ) : (
        <div className="space-y-3">
          {assets.map((asset) => {
            const value = asset.price * asset.quantity;
            const displayValue = asset.currency === currency 
              ? value 
              : (asset.currency === 'USD' ? value * 88 : value / 88);
              
            return (
              <div 
                key={asset.id} 
                className="flex items-center justify-between p-3 border border-gray-200 rounded-lg"
              >
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full overflow-hidden mr-3 border border-gray-200">
                    <img 
                      src={asset.logoUrl} 
                      alt={asset.name}
                      className="w-full h-full object-cover" 
                    />
                  </div>
                  <div>
                    <p className="font-medium">{asset.name}</p>
                    <p className="text-xs text-gray-500">
                      {formatAmount(displayValue, currency)}
                    </p>
                  </div>
                </div>
                
                <button
                  onClick={() => removeAsset(asset.id)}
                  className="px-3 py-1 bg-destructive text-destructive-foreground text-sm rounded-md"
                >
                  Delete
                </button>
              </div>
            );
          })}
        </div>
      )}
      
      <div className="mt-4">
        <button
          onClick={onClose}
          className="w-full py-2 border border-gray-300 text-gray-700 font-medium rounded-lg hover:bg-gray-50 transition-colors"
        >
          Close
        </button>
      </div>
    </div>
  );
};

export default RemoveAsset;
