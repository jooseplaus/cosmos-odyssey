import React, { useEffect } from 'react';
import FlightSearch from './components/FlightSearch/flightSearch';
import { testConnection } from './api/client';
import HeaderFooter from './components/Header-Footer';
function App() {
  useEffect(() => {
    // Testib API ühendust kui app laaditakse
    testConnection();
  }, []);

  return (
    <div className="App" style={{display: 'flex', flexDirection: 'column', minHeight: '100vh', justifyContent: 'space-between'}}>
      <HeaderFooter />
      <FlightSearch />
      <HeaderFooter />
    </div>
  );
}

export default App;
