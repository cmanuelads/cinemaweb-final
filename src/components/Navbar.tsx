import { Link, useLocation } from 'react-router-dom';

/**
 * Navbar Component - CineMax Theme
 * Barra de navegação com tema escuro premium (vermelho/preto)
 */
export default function Navbar() {
  const location = useLocation();

  // Verifica se o link está ativo
  const isActive = (path: string) => location.pathname === path;

  return (
    <nav className="navbar navbar-expand-lg navbar-dark sticky-top" style={{
      background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
      borderBottom: '2px solid #e50914',
      boxShadow: '0 4px 20px rgba(229, 9, 20, 0.3)'
    }}>
      <div className="container">
        {/* Logo */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <span style={{
            fontSize: '1.8rem',
            fontWeight: 'bold',
            background: 'linear-gradient(45deg, #e50914, #ff6b6b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            textShadow: '0 0 30px rgba(229, 9, 20, 0.5)'
          }}>
            🎬 CineMax
          </span>
        </Link>

        {/* Toggle Mobile */}
        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          style={{ borderColor: '#e50914' }}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        {/* Links */}
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/') ? 'active' : ''}`} 
                to="/"
                style={isActive('/') ? { color: '#e50914' } : {}}
              >
                🏠 Home
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/filmes') ? 'active' : ''}`} 
                to="/filmes"
                style={isActive('/filmes') ? { color: '#e50914' } : {}}
              >
                🎬 Filmes
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/salas') ? 'active' : ''}`} 
                to="/salas"
                style={isActive('/salas') ? { color: '#e50914' } : {}}
              >
                🎭 Salas
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/sessoes') ? 'active' : ''}`} 
                to="/sessoes"
                style={isActive('/sessoes') ? { color: '#e50914' } : {}}
              >
                📅 Sessões
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/historico') ? 'active' : ''}`} 
                to="/historico"
                style={isActive('/historico') ? { color: '#e50914' } : {}}
              >
                📋 Histórico
              </Link>
            </li>
            <li className="nav-item">
              <Link 
                className={`nav-link ${isActive('/admin') ? 'active' : ''}`} 
                to="/admin"
                style={isActive('/admin') ? { color: '#e50914' } : {}}
              >
                ⚙️ Admin
              </Link>
            </li>
          </ul>
        </div>
      </div>
    </nav>
  );
}
