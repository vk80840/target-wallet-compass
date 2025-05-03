
import { Currency } from '../context/AppContext';

// Format amount based on the selected currency
export const formatAmount = (amount: number, currency: Currency): string => {
  if (currency === 'USD') {
    return `$${amount.toFixed(2)}`;
  } else {
    return `₹${amount.toFixed(2)}`;
  }
};

// Convert USD to INR (1 USD = 88 INR)
export const convertUsdToInr = (amount: number): number => {
  return amount * 88;
};

// Convert INR to USD
export const convertInrToUsd = (amount: number): number => {
  return amount / 88;
};

// Format date for display
export const formatDate = (dateString: string): string => {
  const options: Intl.DateTimeFormatOptions = { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  };
  return new Date(dateString).toLocaleDateString(undefined, options);
};

// Calculate days remaining until a target date
export const getDaysRemaining = (dateString: string): number => {
  const targetDate = new Date(dateString).getTime();
  const today = new Date().getTime();
  const differenceMs = targetDate - today;
  
  if (differenceMs <= 0) return 0;
  
  return Math.ceil(differenceMs / (1000 * 60 * 60 * 24));
};

// Format timestamp to readable date time
export const formatTimestamp = (timestamp: number): string => {
  const date = new Date(timestamp);
  return date.toLocaleString();
};

// Get progress percentage
export const getProgressPercentage = (collected: number, target: number): number => {
  if (target <= 0) return 0;
  const percentage = (collected / target) * 100;
  return Math.min(percentage, 100);
};
