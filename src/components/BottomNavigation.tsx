
import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Wallet } from 'lucide-react';

const BottomNavigation: React.FC = () => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-10">
      <div className="flex justify-around py-2">
        <NavLink
          to="/"
          className={({ isActive }) => `
            flex flex-col items-center w-1/2 py-2
            ${isActive ? 'text-accent' : 'text-gray-500'}
          `}
          end
        >
          {({ isActive }) => (
            <>
              <Home size={24} color={isActive ? '#64B5F6' : '#6B7280'} />
              <span className="text-xs mt-1">Home</span>
            </>
          )}
        </NavLink>
        
        <NavLink
          to="/wallet"
          className={({ isActive }) => `
            flex flex-col items-center w-1/2 py-2
            ${isActive ? 'text-accent' : 'text-gray-500'}
          `}
        >
          {({ isActive }) => (
            <>
              <Wallet size={24} color={isActive ? '#64B5F6' : '#6B7280'} />
              <span className="text-xs mt-1">Wallet</span>
            </>
          )}
        </NavLink>
      </div>
    </div>
  );
};

export default BottomNavigation;
