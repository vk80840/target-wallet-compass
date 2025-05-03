
import React from 'react';
import { Target, useAppContext } from '../context/AppContext';
import { 
  formatAmount, 
  getDaysRemaining, 
  formatDate, 
  getProgressPercentage 
} from '../utils/formatters';

interface TargetCardProps {
  target: Target;
}

const TargetCard: React.FC<TargetCardProps> = ({ target }) => {
  const { currency, removeTarget, toggleAddFund, getTotalWalletBalance } = useAppContext();
  
  const daysLeft = getDaysRemaining(target.endDate);
  const walletBalance = getTotalWalletBalance();
  
  // Calculate collected amount (including wallet balance if addFund is true)
  const actualCollectedAmount = target.collectedAmount;
  const displayCollectedAmount = target.addFund 
    ? actualCollectedAmount + walletBalance 
    : actualCollectedAmount;
  
  // Calculate progress percentage
  const progress = getProgressPercentage(displayCollectedAmount, target.price);
  
  // Calculate price in current currency
  const targetPrice = currency === 'USD' 
    ? target.price 
    : target.price * 88;
  
  const collectedInCurrency = currency === 'USD' 
    ? displayCollectedAmount 
    : displayCollectedAmount * 88;
  
  return (
    <div className="wallet-card mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-display font-semibold">{target.name}</h3>
        <button 
          onClick={() => removeTarget(target.id)}
          className="text-xs px-2 py-1 bg-destructive text-destructive-foreground rounded-md"
        >
          Remove Target
        </button>
      </div>
      
      <div className="relative mb-4 rounded-xl overflow-hidden h-40">
        <img 
          src={target.imageUrl} 
          alt={target.name} 
          className="w-full h-full object-cover"
          onError={(e) => {
            (e.target as HTMLImageElement).src = "https://placehold.co/600x400/e2e8f0/64748b?text=Image+Not+Available";
          }}
        />
        
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex flex-col justify-end p-3">
          <div className="text-white flex justify-between">
            <span className="font-semibold">
              {daysLeft > 0 ? `${daysLeft} days left` : "Target date reached"}
            </span>
            <span className="font-bold">
              {`${Math.round(progress)}%`}
            </span>
          </div>
        </div>
      </div>
      
      <div className="progress-bar mb-4">
        <div 
          className="progress-bar-fill"
          style={{ 
            width: `${progress}%`, 
            backgroundColor: progress < 100 ? "#64B5F6" : "#4CAF50" 
          }}
        ></div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div className="border border-gray-200 rounded-lg p-2">
          <p className="text-gray-500">Price</p>
          <p className="font-medium">{formatAmount(targetPrice, currency)}</p>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-2">
          <p className="text-gray-500">Collected</p>
          <p className="font-medium">{formatAmount(collectedInCurrency, currency)}</p>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-2">
          <p className="text-gray-500">Target Date</p>
          <p className="font-medium">{formatDate(target.endDate)}</p>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-2">
          <p className="text-gray-500">Add Fund</p>
          <div className="flex items-center mt-1">
            <div
              className={`relative w-10 h-5 rounded-full cursor-pointer ${
                target.addFund ? 'bg-accent' : 'bg-gray-300'
              }`}
              onClick={() => toggleAddFund(target.id)}
            >
              <div
                className={`absolute top-0.5 left-0.5 w-4 h-4 bg-white rounded-full shadow-sm transform transition-transform ${
                  target.addFund ? 'translate-x-5' : ''
                }`}
              ></div>
            </div>
            <span className="ml-2">{target.addFund ? 'On' : 'Off'}</span>
          </div>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-3">
        <h4 className="text-sm font-medium mb-2">Last Transaction</h4>
        <div className="bg-gray-50 p-2 rounded-lg text-xs">
          <p>No transactions yet</p>
        </div>
      </div>
    </div>
  );
};

export default TargetCard;
