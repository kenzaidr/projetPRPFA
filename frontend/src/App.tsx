import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Home from './features/home/home'
import Ride from './features/ride/ride'
import './App.css'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/ride" element={<Ride />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
