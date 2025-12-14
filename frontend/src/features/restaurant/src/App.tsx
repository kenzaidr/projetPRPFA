import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Ride from "./pages/Ride";
import LocationComponent from './components/maps/LocationComponent';
import Food from "./pages/food";

import "./App.css";
// ...existing code...

function App() {
  const handleSelectRestaurant = (restaurant: any) => {
    console.log("selected restaurant", restaurant);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ride" element={<Ride />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/location" element={<LocationComponent />} />
        <Route path="/food" element={<Food />} />
       
      </Routes>
    </BrowserRouter>
  );
}


export default App;