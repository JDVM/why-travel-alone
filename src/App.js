import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.scss';
import Header from './components/Header/Header';
import Travelers from './pages/Travelers/Traveler';
import Trips from './pages/Trips/Trips'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/Travelers" element={<Travelers />} />
        <Route path="/Travelers/:id" />
        <Route path="/Trips" element={<Trips />} />
        <Route path="/Trips/:id" />
        <Route path="/Trips/new" />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

