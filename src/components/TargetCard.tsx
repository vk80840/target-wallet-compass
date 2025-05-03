
import React from 'react';
import { Target, useAppContext } from '../context/AppContext';
import { 
  formatAmount, 
  getDaysRemaining, 
  formatDate, 
  getProgressPercentage 
} from '../utils/formatters';
import { Trash2, Calendar, Clock, ArrowUp, ArrowDown } from 'lucide-react';
import { Progress } from './ui/progress';

interface TargetCardProps {
  target: Target;
}

const TargetCard: React.FC<TargetCardProps> = ({ target }) => {
  const { currency, removeTarget, getTotalWalletBalance, transactions } = useAppContext();
  
  const daysLeft = getDaysRemaining(target.endDate);
  const walletBalance = getTotalWalletBalance();
  
  // Use wallet balance as collected amount for display
  const displayCollectedAmount = walletBalance;
  
  // Calculate progress percentage
  const progress = getProgressPercentage(displayCollectedAmount, target.price);
  
  // Calculate price in current currency
  const targetPrice = currency === 'USD' 
    ? target.price 
    : target.price * 88;
  
  const collectedInCurrency = currency === 'USD' 
    ? displayCollectedAmount 
    : displayCollectedAmount * 88;

  // Get last transaction if available
  const lastTransaction = transactions && transactions.length > 0 ? transactions[0] : null;
  
  // Function to calculate remaining hours and minutes
  const getRemainingTime = () => {
    const targetDate = new Date(target.endDate).getTime();
    const now = new Date().getTime();
    const difference = targetDate - now;
    
    if (difference <= 0) return { hours: 0, minutes: 0 };
    
    // Calculate remaining hours and minutes
    const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
    
    return { hours, minutes };
  };
  
  const { hours, minutes } = getRemainingTime();
  
  // Get transaction type icon
  const getTransactionIcon = (type: string) => {
    switch (type) {
      case 'Buy':
      case 'Add':
        return <ArrowUp size={16} className="text-usd" />;
      case 'Sell':
      case 'Remove':
        return <ArrowDown size={16} className="text-destructive" />;
      default:
        return null;
    }
  };
  
  return (
    <div className="wallet-card mb-4">
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-lg font-display font-semibold">{target.name}</h3>
        <button 
          onClick={() => removeTarget(target.id)}
          className="p-2 text-destructive rounded-full hover:bg-destructive/10 transition-colors"
          aria-label="Remove Target"
        >
          <Trash2 size={18} />
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
            <span className="font-semibold flex items-center">
              <Clock size={16} className="mr-1" />
              {daysLeft > 0 ? `${daysLeft} days left` : "Target date reached"}
            </span>
            <span className="font-bold">
              {`${Math.round(progress)}%`}
            </span>
          </div>
        </div>
      </div>
      
      <div className="mb-4">
        <Progress value={progress} className="h-2 animate-pulse" />
      </div>
      
      {/* Countdown Display */}
      <div className="flex justify-center gap-3 mb-4">
        <div className="flex flex-col items-center">
          <div className="bg-accent/20 w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold animate-pulse">
            {daysLeft}
          </div>
          <span className="text-xs mt-1">Days</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="bg-accent/20 w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold animate-pulse">
            {hours}
          </div>
          <span className="text-xs mt-1">Hours</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="bg-accent/20 w-14 h-14 rounded-full flex items-center justify-center text-lg font-bold animate-pulse">
            {minutes}
          </div>
          <span className="text-xs mt-1">Mins</span>
        </div>
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
        
        <div className="border border-gray-200 rounded-lg p-2 col-span-2">
          <p className="text-gray-500 flex items-center">
            <Calendar size={16} className="mr-1" /> Target Date
          </p>
          <p className="font-medium">{formatDate(target.endDate)}</p>
        </div>
      </div>
      
      <div className="border-t border-gray-200 pt-3">
        <h4 className="text-sm font-medium mb-2">Last Transaction</h4>
        {lastTransaction ? (
          <div className="bg-gray-50 p-2 rounded-lg text-xs">
            <p className="font-medium flex items-center">
              <span className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center mr-1.5">
                {getTransactionIcon(lastTransaction.type)}
              </span>
              {lastTransaction.type} {lastTransaction.assetName}
            </p>
            <div className="flex justify-between">
              <span>{formatAmount(lastTransaction.amount * lastTransaction.price, lastTransaction.currency)}</span>
              <span className="text-gray-500">{formatDate(new Date(lastTransaction.timestamp).toISOString())}</span>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 p-2 rounded-lg text-xs">
            <p>No transactions yet</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TargetCard;
