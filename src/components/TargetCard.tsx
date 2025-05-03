
import React, { useState, useEffect } from 'react';
import { Target, useAppContext } from '../context/AppContext';
import { 
  formatAmount, 
  getDaysRemaining, 
  formatDate, 
  getProgressPercentage 
} from '../utils/formatters';
import { Trash2, Calendar, Clock, ArrowUp, ArrowDown, Image, Plus } from 'lucide-react';
import { Progress } from './ui/progress';

interface TargetCardProps {
  target: Target;
}

const TargetCard: React.FC<TargetCardProps> = ({ target }) => {
  const { currency, removeTarget, getTotalWalletBalance, transactions } = useAppContext();
  const [showAddButton, setShowAddButton] = useState(false);
  const [showImageForm, setShowImageForm] = useState(false);
  const [images, setImages] = useState<string[]>([target.imageUrl]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [collageView, setCollageView] = useState(false);
  const [collageType, setCollageType] = useState<'grid' | 'masonry' | 'carousel'>('grid');
  
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
  
  // Handle image click to show add button temporarily
  const handleImageClick = () => {
    setShowAddButton(true);
    setTimeout(() => {
      setShowAddButton(false);
    }, 5000);
  };
  
  // Handle add image button click
  const handleAddImage = () => {
    setShowImageForm(true);
  };
  
  // Handle image form submission
  const handleImageSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    const imageUrl = formData.get('imageUrl') as string;
    
    if (imageUrl && imageUrl.trim() !== '') {
      setImages([...images, imageUrl]);
      setShowImageForm(false);
    }
  };
  
  // Handle collage type change
  const toggleCollageType = () => {
    const types: Array<'grid' | 'masonry' | 'carousel'> = ['grid', 'masonry', 'carousel'];
    const currentIndex = types.indexOf(collageType);
    const nextIndex = (currentIndex + 1) % types.length;
    setCollageType(types[nextIndex]);
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
        {showImageForm ? (
          <form onSubmit={handleImageSubmit} className="absolute inset-0 bg-white p-3 z-10">
            <div className="flex flex-col h-full">
              <input 
                type="text" 
                name="imageUrl" 
                placeholder="Enter image URL" 
                className="border border-gray-300 p-2 rounded mb-2"
              />
              <div className="flex justify-between mt-auto">
                <button 
                  type="button" 
                  onClick={() => setShowImageForm(false)} 
                  className="bg-gray-200 px-3 py-1 rounded"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="bg-accent text-white px-3 py-1 rounded"
                >
                  Add
                </button>
              </div>
            </div>
          </form>
        ) : collageView ? (
          <div className="w-full h-full" onClick={handleImageClick}>
            {collageType === 'grid' && (
              <div className="grid grid-cols-2 gap-1 h-full">
                {images.slice(0, 4).map((img, index) => (
                  <div key={index} className={`${index === 0 && images.length === 3 ? 'row-span-2' : ''}`}>
                    <img 
                      src={img} 
                      alt={`${target.name} ${index + 1}`} 
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/600x400/e2e8f0/64748b?text=Image+Not+Available";
                      }}
                    />
                  </div>
                ))}
                {images.length > 4 && (
                  <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-white text-2xl font-bold">
                    +{images.length - 4} more
                  </div>
                )}
              </div>
            )}
            
            {collageType === 'masonry' && (
              <div className="columns-2 gap-1 h-full">
                {images.slice(0, 6).map((img, index) => (
                  <div key={index} className="mb-1 break-inside-avoid">
                    <img 
                      src={img} 
                      alt={`${target.name} ${index + 1}`} 
                      className="w-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = "https://placehold.co/600x400/e2e8f0/64748b?text=Image+Not+Available";
                      }}
                    />
                  </div>
                ))}
              </div>
            )}
            
            {collageType === 'carousel' && (
              <div className="w-full h-full">
                <img 
                  src={images[activeImageIndex]} 
                  alt={target.name} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "https://placehold.co/600x400/e2e8f0/64748b?text=Image+Not+Available";
                  }}
                />
                
                <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1">
                  {images.map((_, index) => (
                    <button 
                      key={index} 
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveImageIndex(index);
                      }}
                      className={`w-2 h-2 rounded-full ${index === activeImageIndex ? 'bg-white' : 'bg-white/50'}`}
                    />
                  ))}
                </div>
              </div>
            )}
          </div>
        ) : (
          <img 
            src={images[0]} 
            alt={target.name} 
            className="w-full h-full object-cover"
            onClick={handleImageClick}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "https://placehold.co/600x400/e2e8f0/64748b?text=Image+Not+Available";
            }}
          />
        )}
        
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
        
        {showAddButton && (
          <div className="absolute top-2 right-2 flex gap-2">
            <button 
              onClick={(e) => {
                e.stopPropagation();
                handleAddImage();
              }}
              className="bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
              aria-label="Add Image"
            >
              <Plus size={18} />
            </button>
            {images.length > 1 && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  setCollageView(!collageView);
                }}
                className="bg-white/80 p-2 rounded-full hover:bg-white transition-colors"
                aria-label="Toggle Collage"
              >
                <Image size={18} />
              </button>
            )}
            {collageView && (
              <button 
                onClick={(e) => {
                  e.stopPropagation();
                  toggleCollageType();
                }}
                className="bg-white/80 p-2 rounded-full hover:bg-white transition-colors text-xs font-medium"
              >
                {collageType}
              </button>
            )}
          </div>
        )}
      </div>
      
      <div className="mb-4">
        <Progress value={progress} className="h-2 animate-pulse" />
      </div>
      
      {/* Countdown Display - Square boxes */}
      <div className="flex justify-center gap-3 mb-4">
        <div className="flex flex-col items-center">
          <div className="bg-accent/20 w-14 h-14 rounded-md flex items-center justify-center text-lg font-bold animate-pulse shadow-inner">
            {daysLeft}
          </div>
          <span className="text-xs mt-1">Days</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="bg-accent/20 w-14 h-14 rounded-md flex items-center justify-center text-lg font-bold animate-pulse shadow-inner">
            {hours}
          </div>
          <span className="text-xs mt-1">Hours</span>
        </div>
        
        <div className="flex flex-col items-center">
          <div className="bg-accent/20 w-14 h-14 rounded-md flex items-center justify-center text-lg font-bold animate-pulse shadow-inner">
            {minutes}
          </div>
          <span className="text-xs mt-1">Mins</span>
        </div>
      </div>
      
      <div className="grid grid-cols-2 gap-3 mb-4 text-sm">
        <div className="border border-gray-200 rounded-lg p-2 bg-gray-50/50 shadow-sm">
          <p className="text-gray-500">Price</p>
          <p className="font-medium">{formatAmount(targetPrice, currency)}</p>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-2 bg-gray-50/50 shadow-sm">
          <p className="text-gray-500">Collected</p>
          <p className="font-medium">{formatAmount(collectedInCurrency, currency)}</p>
        </div>
        
        <div className="border border-gray-200 rounded-lg p-2 col-span-2 bg-gray-50/50 shadow-sm">
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
            <div className="flex justify-between items-center mb-1">
              <p className="font-medium flex items-center">
                <span className="w-5 h-5 bg-gray-200 rounded-full flex items-center justify-center mr-1.5">
                  {getTransactionIcon(lastTransaction.type)}
                </span>
                {lastTransaction.type} {lastTransaction.assetName}
              </p>
              <span className="font-semibold">
                {formatAmount(lastTransaction.amount * lastTransaction.price, lastTransaction.currency)}
              </span>
            </div>
            <div className="text-gray-500 text-right">
              {formatDate(new Date(lastTransaction.timestamp).toISOString())}
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
