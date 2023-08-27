import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.scss';
import Header from './components/Header/Header';
import Travelers from './pages/Travelers/Traveler';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
      <Route to="/travelers" element={<Travelers />}/>
      <Route to="/travelers/:id"/>
      <Route to="/trips"/>
      <Route to="/trips/:id"/>
      <Route to="/trips/new"/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

