import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.scss';
import Header from './components/Header/Header';
import Travelers from './pages/Travelers/Traveler';
import Trips from './pages/Trips/Trips'
import AddTrip from './components/AddTrip/AddTrip';
import TripDetails from './components/TripDetails/TripDetails'
import TravelerDetails from './components/TravelerDetails/TravelerDetails';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route path="/Travelers" element={<Travelers />} />
        <Route path="/Travelers/:id" element={<TravelerDetails/>} />
        <Route path="/Trips" element={<Trips />} />
        <Route path="/Trips/:id" element={<TripDetails/>}/>
        <Route path="/Trips/new" element={<AddTrip />}/>
        <Route  path='/*' element={<Navigate to="/Travelers"/>}/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

