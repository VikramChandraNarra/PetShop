import React, { useState, useEffect } from "react";
import AddPet from './AddPet';
import FilterPet from './FliterPet';
import { BrowserRouter as Router, Routes, Route, Link, Navigate } from 'react-router-dom';
import ViewPets from "./ViewPets";
import NavbarUser from "./NavbarUser";
import NavbarOwner from "./NavbarOwner"
import SimpleCard from "./Authentication";
import Donate from "./Donate";
import Analytics from "./Analytics"
import OwnerAnalytics from "./OwnerAnalytics";

function App() {
  const [isOwner, setIsOwner] = useState(false)
  // Enable Ethereum account on component mount
  useEffect(() => {
    localStorage.setItem("owner", "0xF52ba71b232bD3e3E0F9Df549328206631CdbA4d") // Change this to your owner's address.
  }, []);



  return (
    <Router>
      {/* Wrap your routes using the Routes component */}
      <Routes>

        <Route path="/authentication" element={<SimpleCard setOwner={setIsOwner}/>} />
        <Route path="/addpet" element={<>{isOwner ? <NavbarOwner /> : <NavbarUser />}<AddPet /></>} />
        <Route path="/donate" element={<>{isOwner ? <NavbarOwner /> : <NavbarUser />}<Donate /></>} />
        <Route path="/analytics" element={<>{isOwner ? <NavbarOwner /> : <NavbarUser />}<Analytics /></>} />
        <Route path="/owneranalytics" element={<><NavbarOwner /><OwnerAnalytics /></>} />


        <Route path="/filter" element={<>{isOwner ? <NavbarOwner /> : <NavbarUser />}<FilterPet /></>} />
        <Route path="/view" element={<>{isOwner ? <NavbarOwner /> : <NavbarUser />}<ViewPets /></>} />
        <Route path="*" element={<Navigate to="/authentication" />} />

      </Routes>
    </Router>
  );
}

export default App;
