
import React from 'react';
import { Asset, useAppContext } from '../context/AppContext';
import { formatAmount, convertUsdToInr } from '../utils/formatters';

interface AssetCardProps {
  asset: Asset;
}

const AssetCard: React.FC<AssetCardProps> = ({ asset }) => {
  const { currency } = useAppContext();
  
  // Calculate value based on asset's own currency
  const assetValue = asset.price * asset.quantity;
  
  // Convert to USD for display if needed
  const valueInUsd = asset.currency === 'USD' ? assetValue : assetValue / 88;
  
  // Convert to INR for display if needed
  const valueInInr = asset.currency === 'INR' ? assetValue : assetValue * 88;
  
  return (
    <div 
      className={`wallet-card mb-3 ${
        asset.currency === 'USD' ? 'border-l-4 border-l-usd' : 'border-l-4 border-l-inr'
      }`}
    >
      <div className="flex items-center">
        <div className="w-12 h-12 rounded-full overflow-hidden mr-3 border border-gray-200">
          <img 
            src={asset.logoUrl} 
            alt={asset.name}
            className="w-full h-full object-cover" 
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://placehold.co/100/e2e8f0/64748b?text=Logo";
            }}
          />
        </div>
        
        <div className="flex-1">
          <div className="flex justify-between items-start">
            <div>
              <h3 className="font-medium">{asset.name}</h3>
              <p className="text-xs text-gray-500">
                {asset.quantity} {asset.type === 'Stock' ? 'shares' : 'coins'}
              </p>
            </div>
            
            <div className="text-right">
              <p className="font-semibold">
                {formatAmount(currency === 'USD' ? valueInUsd : valueInInr, currency)}
              </p>
              <p className="text-xs text-gray-500">
                {currency === 'USD' 
                  ? `₹${valueInInr.toFixed(2)}` 
                  : `$${valueInUsd.toFixed(2)}`
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AssetCard;
