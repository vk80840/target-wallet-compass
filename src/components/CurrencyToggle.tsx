
import React from 'react';
import { useAppContext, Currency } from '../context/AppContext';
import { DollarSign, IndianRupee } from 'lucide-react';

const CurrencyToggle: React.FC = () => {
  const { currency, setCurrency } = useAppContext();
  
  const handleToggle = () => {
    setCurrency(currency === 'USD' ? 'INR' : 'USD');
  };
  
  return (
    <button
      onClick={handleToggle}
      className={`w-10 h-10 rounded-full flex items-center justify-center transition-all duration-300 transform hover:scale-110 ${
        currency === 'USD' ? 'bg-usd/20' : 'bg-inr/20'
      }`}
      style={{
        transform: currency === 'USD' ? 'rotate(0deg)' : 'rotate(180deg)',
        transition: 'transform 0.5s ease-in-out'
      }}
    >
      {currency === 'USD' ? (
        <DollarSign size={20} className="text-usd" />
      ) : (
        <IndianRupee size={20} className="text-inr" />
      )}
    </button>
  );
};

export default CurrencyToggle;
