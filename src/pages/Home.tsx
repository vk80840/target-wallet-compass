
import React from 'react';
import { useAppContext } from '../context/AppContext';
import AddTargetForm from '../components/AddTargetForm';
import TargetCard from '../components/TargetCard';
import CurrencyToggle from '../components/CurrencyToggle';

const Home: React.FC = () => {
  const { targets } = useAppContext();
  
  return (
    <div className="p-4 pb-20">
      <div className="flex items-center justify-between mb-2">
        <h1 className="text-2xl font-display font-bold">My Targets</h1>
        <CurrencyToggle />
      </div>
      
      {targets.length === 0 ? (
        <AddTargetForm />
      ) : (
        <div>
          {targets.map((target) => (
            <TargetCard key={target.id} target={target} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Home;
