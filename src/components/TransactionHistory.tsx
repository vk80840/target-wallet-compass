
import React from 'react';
import { useAppContext } from '../context/AppContext';
import { formatAmount, formatTimestamp } from '../utils/formatters';

interface TransactionHistoryProps {
  onClose: () => void;
}

const TransactionHistory: React.FC<TransactionHistoryProps> = ({ onClose }) => {
  const { transactions, currency } = useAppContext();
  
  // Function to render transaction type with color
  const renderTransactionType = (type: string) => {
    switch (type) {
      case 'Buy':
        return <span className="text-usd font-medium">Buy</span>;
      case 'Sell':
        return <span className="text-blue-500 font-medium">Sell</span>;
      case 'Add':
        return <span className="text-purple-500 font-medium">Add</span>;
      case 'Remove':
        return <span className="text-destructive font-medium">Remove</span>;
      default:
        return <span>{type}</span>;
    }
  };
  
  return (
    <div className="wallet-card animate-slide-up">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-display font-semibold">Transaction History</h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      {transactions.length === 0 ? (
        <p className="text-center text-gray-500 py-12">No transaction history yet.</p>
      ) : (
        <div className="space-y-3 max-h-[60vh] overflow-y-auto pr-2">
          {transactions.map((transaction) => {
            // Display amount in the current currency
            const displayAmount = transaction.currency === currency 
              ? transaction.amount * transaction.price
              : transaction.currency === 'USD' 
                ? transaction.amount * transaction.price * 88
                : transaction.amount * transaction.price / 88;
              
            return (
              <div
                key={transaction.id}
                className="border border-gray-200 rounded-lg p-3"
              >
                <div className="flex justify-between mb-1">
                  <div className="font-medium">{transaction.assetName}</div>
                  <div>{renderTransactionType(transaction.type)}</div>
                </div>
                
                <div className="flex justify-between text-sm">
                  <div className="text-gray-500">{formatTimestamp(transaction.timestamp)}</div>
                  <div className="font-semibold">
                    {formatAmount(displayAmount, currency)}
                  </div>
                </div>
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

export default TransactionHistory;
