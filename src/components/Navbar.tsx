import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const Navbar: React.FC = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path ? 'bg-gray-900 text-white' : 'text-gray-300 hover:bg-gray-700 hover:text-white';
  };

  return (
    <nav className="bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <div className="flex-shrink-0">
              <span className="text-white font-bold text-lg">API数据仪表板</span>
            </div>
            <div className="hidden md:block">
              <div className="ml-10 flex items-baseline space-x-4">
                <Link to="/header" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/header')}`}>
                  Header数据
                </Link>
                <Link to="/peer" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/peer')}`}>
                  Peer数据
                </Link>
                <Link to="/webhooks" className={`px-3 py-2 rounded-md text-sm font-medium ${isActive('/webhooks')}`}>
                  Webhooks管理
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;