
import React from 'react';
import { useAppContext, Currency } from '../context/AppContext';

const CurrencyToggle: React.FC = () => {
  const { currency, setCurrency } = useAppContext();
  
  const handleToggle = () => {
    setCurrency(currency === 'USD' ? 'INR' : 'USD');
  };
  
  return (
    <div className="flex items-center justify-center my-4">
      <span className={`mr-2 font-medium ${currency === 'USD' ? 'text-usd font-bold' : 'text-gray-500'}`}>
        USD ($)
      </span>
      <label className="currency-toggle">
        <input
          type="checkbox"
          className="sr-only"
          checked={currency === 'INR'}
          onChange={handleToggle}
        />
        <div className={`w-14 h-7 rounded-full shadow-inner flex items-center p-1 transition-colors ${
          currency === 'USD' ? 'bg-usd/20' : 'bg-inr/20'
        }`}>
          <div
            className={`rounded-full w-5 h-5 shadow-md transform transition-transform ${
              currency === 'USD' ? 'translate-x-0 bg-usd' : 'translate-x-7 bg-inr'
            }`}
          ></div>
        </div>
      </label>
      <span className={`ml-2 font-medium ${currency === 'INR' ? 'text-inr font-bold' : 'text-gray-500'}`}>
        INR (₹)
      </span>
    </div>
  );
};

export default CurrencyToggle;
