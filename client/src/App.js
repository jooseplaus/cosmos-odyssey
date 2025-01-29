import React, { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import FlightSearch from './components/FlightSearch/flightSearch';
import { testConnection } from './api/client';
import HeaderFooter from './components/Header-Footer';
import Reservations from './components/Reservations/Reservations';

function App() {
  useEffect(() => {
    // Testib API ühendust kui app laaditakse
    testConnection();
  }, []);

  return (
    <Router>
      <div className="App" style={{display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'space-between'}}>
        <HeaderFooter />
        <Routes>
          <Route path="/" element={<FlightSearch />} />
          <Route path="/reservations" element={<Reservations />} />
        </Routes>
        <HeaderFooter />
      </div>
    </Router>
  );
}

export default App;
