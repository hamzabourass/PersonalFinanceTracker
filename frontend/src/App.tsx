import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Categories from './pages/Categories';

// Placeholder components for other routes
const Dashboard = () => (
  <div className="text-center py-12">
    <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
    <p className="text-gray-500">Coming soon...</p>
  </div>
);

const Transactions = () => (
  <div className="text-center py-12">
    <h1 className="text-2xl font-bold text-gray-900">Transactions</h1>
    <p className="text-gray-500">Coming soon...</p>
  </div>
);

const Reports = () => (
  <div className="text-center py-12">
    <h1 className="text-2xl font-bold text-gray-900">Reports</h1>
    <p className="text-gray-500">Coming soon...</p>
  </div>
);

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/categories" element={<Categories />} />
        <Route path="/transactions" element={<Transactions />} />
        <Route path="/reports" element={<Reports />} />
      </Routes>
    </Router>
  );
}

export default App;