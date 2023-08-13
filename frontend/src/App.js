import React, { useState, useEffect } from "react";
import AddPet from './AddPet';
import FilterPet from './FliterPet'
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import ViewPets from "./ViewPets";

function App() {


  // Enable Ethereum account on component mount
  useEffect(() => {
    if (window.ethereum) {
      window.ethereum.request({ method: 'eth_requestAccounts' });
    }
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/addpet" element={<AddPet />} />
        <Route path="/filter" element={<FilterPet />} />
        <Route path="/view" element={<ViewPets />} />

      </Routes>
    </Router>
  );
}

export default App;
