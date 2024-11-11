import React from 'react';
import { Link } from 'react-router-dom';
import { BarChart2 } from 'lucide-react';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-gray-800 border-b border-gray-700 z-50">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        <Link to="/" className="flex items-center space-x-2 text-xl font-bold">
          <BarChart2 className="h-6 w-6" />
          <span>Trading Dashboard</span>
        </Link>
        <div id="connect-btn">
          <radix-connect-button />
        </div>
      </div>
    </header>
  );
}