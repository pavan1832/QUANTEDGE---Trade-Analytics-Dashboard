import React from 'react';
import Navbar from './components/Navbar';
import Dashboard from './pages/Dashboard';
import './App.css';

const App = () => {
  return (
    <div className="app">
      <Navbar />
      <main className="app__main">
        <Dashboard />
      </main>
    </div>
  );
};

export default App;
