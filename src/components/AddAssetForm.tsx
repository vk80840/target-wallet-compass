
import React, { useState, useEffect } from 'react';
import { useAppContext, AssetType, Currency } from '../context/AppContext';

interface AddAssetFormProps {
  onClose: () => void;
}

const AddAssetForm: React.FC<AddAssetFormProps> = ({ onClose }) => {
  const { addAsset, currency: globalCurrency } = useAppContext();
  
  const [type, setType] = useState<AssetType>('Stock');
  const [name, setName] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [quantity, setQuantity] = useState('');
  const [price, setPrice] = useState('');
  const [currency, setCurrency] = useState<Currency>(globalCurrency);
  
  // Handle asset type change
  useEffect(() => {
    if (type === 'TETHER') {
      setName('TETHER');
      setLogoUrl('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQY77uuuyhY23VBCyL1-2s6yJDbXZLU9FXqNDXc_7BwZB67PzzNPz_4i9o&s=10');
      setPrice('1');
      setCurrency('USD');
    } else if (type === 'RUPPES') {
      setName('RUPPES');
      setLogoUrl('https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLSGnhYpPRBzex3h8X187TcOwim1EfF5vWAEcq8YsHuHv-Ur0c8PPs85w&s=10');
      setPrice('1');
      setCurrency('INR');
    } else {
      // Reset fields for other types
      setName('');
      setLogoUrl('');
      setPrice('');
      setCurrency(globalCurrency);
    }
  }, [type, globalCurrency]);
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!type || !name || !logoUrl || !quantity || !price) {
      return;
    }
    
    addAsset({
      type,
      name,
      logoUrl,
      quantity: parseFloat(quantity),
      price: parseFloat(price),
      currency
    });
    
    onClose();
  };
  
  return (
    <div className="wallet-card animate-slide-up">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-display font-semibold">Add New Asset</h2>
        <button 
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="type" className="block text-sm font-medium mb-1">
            Asset Type
          </label>
          <select
            id="type"
            value={type}
            onChange={(e) => setType(e.target.value as AssetType)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          >
            <option value="Stock">Stock</option>
            <option value="Crypto">Crypto</option>
            <option value="TETHER">TETHER</option>
            <option value="RUPPES">RUPPES</option>
          </select>
        </div>
        
        {(type === 'Stock' || type === 'Crypto') && (
          <>
            <div>
              <label htmlFor="name" className="block text-sm font-medium mb-1">
                Asset Name
              </label>
              <input
                type="text"
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder={`Enter ${type} name`}
                required
              />
            </div>
            
            <div>
              <label htmlFor="logoUrl" className="block text-sm font-medium mb-1">
                Logo URL
              </label>
              <input
                type="url"
                id="logoUrl"
                value={logoUrl}
                onChange={(e) => setLogoUrl(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="https://example.com/logo.png"
                required
              />
            </div>
          </>
        )}
        
        <div>
          <label htmlFor="quantity" className="block text-sm font-medium mb-1">
            Quantity
          </label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="0.00"
            min="0"
            step="any"
            required
          />
        </div>
        
        <div>
          <label htmlFor="price" className="block text-sm font-medium mb-1">
            Price per Unit
          </label>
          <div className="flex items-center">
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="flex-1 p-2 border border-gray-300 rounded-l-lg"
              placeholder="0.00"
              min="0"
              step="any"
              disabled={type === 'TETHER' || type === 'RUPPES'}
              required
            />
            
            {(type !== 'TETHER' && type !== 'RUPPES') && (
              <div 
                className="border border-l-0 border-gray-300 rounded-r-lg p-2 flex items-center cursor-pointer"
                onClick={() => setCurrency(currency === 'USD' ? 'INR' : 'USD')}
              >
                <span className={`font-medium ${currency === 'USD' ? 'text-usd' : 'text-inr'}`}>
                  {currency === 'USD' ? '$' : '₹'}
                </span>
              </div>
            )}
          </div>
        </div>
        
        <button
          type="submit"
          className="w-full py-2 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 transition-colors"
        >
          Add Asset
        </button>
      </form>
    </div>
  );
};

export default AddAssetForm;
