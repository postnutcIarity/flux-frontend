import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import Markets from './pages/Markets';
import TradingPage from './pages/TradingPage';

function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-900 text-white">
        <Header />
        <main className="pt-16">
          <Routes>
            <Route path="/" element={<Markets />} />
            <Route path="/trade/:marketId" element={<TradingPage />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}

export default App;