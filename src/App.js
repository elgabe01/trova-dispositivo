import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Invio } from './pages/invio-dati';
import { Mappa } from './pages/mappa';
import { HomePage } from './pages/home-page';
function App() {

  return (
    <div className="App">
      <Router>

        <Routes>
          <Route path="/" element={<HomePage />}></Route>
          <Route path="/Invio-dati" element={<Invio />}></Route>
          { <Route path="/Mappa" element={<Mappa />}></Route> }
        </Routes>
      </Router>

    </div>
  );
      

}

export default App;
