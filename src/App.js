import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.scss';
import Header from './components/Header/Header';
import Travelers from './pages/Travelers/Traveler';
import Trips from './pages/Trips/Trips'
import AddTrip from './components/AddTrip/AddTrip';
import TripDetails from './components/TripDetails/TripDetails'

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/Travelers" element={<Travelers />} />
        <Route path="/Travelers/:id" element={<Travelers/>} />
        <Route path="/Trips" element={<Trips />} />
        <Route path="/Trips/:id" element={<Trips />}/>
        <Route path="/Trips/new" element={<Trips />}/>
        <Route path='/*' element={<Travelers />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;

