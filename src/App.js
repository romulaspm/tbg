 
import './App.css';
import React from 'react';
import { Routes, Route, Navigate } from "react-router-dom";
import TableBooking from './TableBooking';
import Home from './Home';
import View from './View';
function App() {
    
  return (
    <div>
    <Routes> 
      <Route path='/home'  element={<Home />} />
      <Route path= '/' element = {<TableBooking />} > 
      <Route path="/table-booking" element={<TableBooking />} /> 
     
     </Route>
     <Route path='/view' element={<View />} />
    </Routes>
    </div>
  );
}

export default App;
