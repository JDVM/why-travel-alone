import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.scss';
import Header from './components/Header/Header';

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
      <Route to="/travelers"/>
      <Route to="/travelers/:id"/>
      <Route to="/trips"/>
      <Route to="/trips/:id"/>
      <Route to="/trips/:id/new"/>
      </Routes>
    </BrowserRouter>
  );
}

export default App;

