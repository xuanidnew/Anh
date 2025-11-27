import React from 'react';
import { DISCORD_LINK, APP_NAME, Icons } from '../constants';

const Header: React.FC<{ onReset: () => void }> = ({ onReset }) => {
  return (
    <nav className="w-full bg-gray-900/80 backdrop-blur-md border-b border-gray-800 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <div 
            className="flex items-center gap-2 cursor-pointer group" 
            onClick={onReset}
          >
            <div className="p-2 bg-indigo-600 rounded-lg group-hover:bg-indigo-500 transition-colors">
              <Icons.Terminal className="w-6 h-6 text-white" />
            </div>
            <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-cyan-400">
              {APP_NAME}
            </span>
          </div>

          <a 
            href={DISCORD_LINK} 
            target="_blank" 
            rel="noopener noreferrer"
            className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-300 bg-gray-800 hover:bg-[#5865F2] hover:text-white rounded-md transition-all duration-300 border border-gray-700 hover:border-[#5865F2]"
          >
            <Icons.Link className="w-4 h-4" />
            <span>Discord Info</span>
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Header;
