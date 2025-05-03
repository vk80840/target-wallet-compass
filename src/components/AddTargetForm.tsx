
import React, { useState } from 'react';
import { useAppContext } from '../context/AppContext';

const AddTargetForm: React.FC = () => {
  const { addTarget } = useAppContext();
  
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [endDate, setEndDate] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!name || !price || !imageUrl || !endDate) {
      return;
    }
    
    addTarget({
      name,
      price: parseFloat(price),
      imageUrl,
      endDate
    });
    
    // Reset form
    setName('');
    setPrice('');
    setImageUrl('');
    setEndDate('');
  };
  
  return (
    <div className="wallet-card animate-slide-up">
      <h2 className="text-xl font-display font-semibold mb-4 text-center">Add a New Target</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="name" className="block text-sm font-medium mb-1">
            Product Name
          </label>
          <input
            type="text"
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="e.g. New Laptop"
            required
          />
        </div>
        
        <div>
          <label htmlFor="price" className="block text-sm font-medium mb-1">
            Product Price
          </label>
          <input
            type="number"
            id="price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="0.00"
            min="0"
            step="0.01"
            required
          />
        </div>
        
        <div>
          <label htmlFor="imageUrl" className="block text-sm font-medium mb-1">
            Image URL
          </label>
          <input
            type="url"
            id="imageUrl"
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            placeholder="https://example.com/image.jpg"
            required
          />
        </div>
        
        <div>
          <label htmlFor="endDate" className="block text-sm font-medium mb-1">
            Target End Date
          </label>
          <input
            type="date"
            id="endDate"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded-lg"
            required
          />
        </div>
        
        <button
          type="submit"
          className="w-full py-2 bg-accent text-white font-medium rounded-lg hover:bg-accent/90 transition-colors"
        >
          Add Target
        </button>
      </form>
    </div>
  );
};

export default AddTargetForm;
