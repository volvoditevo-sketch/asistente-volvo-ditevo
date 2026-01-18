
import React from 'react';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
      <div className="flex items-center gap-4">
        <div className="flex flex-col">
          <h1 className="text-xl font-bold text-[#003057] tracking-tight">VOLVO</h1>
          <span className="text-xs font-semibold text-gray-500 uppercase tracking-widest">Ditevo Barcelona</span>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <span className="flex h-2 w-2 rounded-full bg-green-500"></span>
        <span className="text-sm font-medium text-gray-600">Asesor Online</span>
      </div>
    </header>
  );
};

export default Header;
