import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import FilmesPage from './pages/FilmesPage';
import SalasPage from './pages/SalasPage';
import SessoesPage from './pages/SessoesPage';
import CombosPage from './pages/CombosPage';
import AdminPage from './pages/AdminPage';
import CompraIngressoPage from './pages/CompraIngressoPage';
import HistoricoPage from './pages/HistoricoPage';

function App() {
  return (
    <div className="min-vh-100" style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
      minHeight: '100vh'
    }}>
      <Navbar />
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/filmes" element={<FilmesPage />} />
        <Route path="/salas" element={<SalasPage />} />
        <Route path="/sessoes" element={<SessoesPage />} />
        <Route path="/combos" element={<CombosPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/comprar/:sessaoId" element={<CompraIngressoPage />} />
        <Route path="/historico" element={<HistoricoPage />} />
      </Routes>
    </div>
  );
}

export default App;
