import { Link } from 'react-router-dom';

/**
 * HomePage Component - CineMax Theme
 * Página inicial com cards de navegação
 */
export default function HomePage() {
  return (
    <div className="container py-5">
      {/* Header */}
      <div className="text-center mb-5">
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #e50914, #ff6b6b)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          marginBottom: '1rem'
        }}>
          🎬 Bem-vindo ao CineMax
        </h1>
        <p className="lead" style={{ color: '#a0a0a0' }}>
          A melhor experiência cinematográfica da cidade
        </p>
      </div>

      {/* Cards de Navegação */}
      <div className="row g-4">
        {/* Card Filmes */}
        <div className="col-md-3">
          <Link to="/filmes" className="text-decoration-none">
            <div className="card h-100" style={{
              background: 'rgba(30, 30, 50, 0.8)',
              border: '1px solid rgba(229, 9, 20, 0.3)',
              borderRadius: '15px',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.borderColor = '#e50914';
              e.currentTarget.style.boxShadow = '0 10px 40px rgba(229, 9, 20, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(229, 9, 20, 0.3)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div className="card-body text-center py-5">
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎬</div>
                <h3 className="card-title" style={{ color: '#fff' }}>Filmes</h3>
                <p className="card-text" style={{ color: '#a0a0a0' }}>
                  Confira nosso catálogo de filmes em cartaz
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Card Salas */}
        <div className="col-md-3">
          <Link to="/salas" className="text-decoration-none">
            <div className="card h-100" style={{
              background: 'rgba(30, 30, 50, 0.8)',
              border: '1px solid rgba(229, 9, 20, 0.3)',
              borderRadius: '15px',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.borderColor = '#e50914';
              e.currentTarget.style.boxShadow = '0 10px 40px rgba(229, 9, 20, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(229, 9, 20, 0.3)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div className="card-body text-center py-5">
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎭</div>
                <h3 className="card-title" style={{ color: '#fff' }}>Salas</h3>
                <p className="card-text" style={{ color: '#a0a0a0' }}>
                  Conheça nossas salas de cinema
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Card Sessões */}
        <div className="col-md-3">
          <Link to="/sessoes" className="text-decoration-none">
            <div className="card h-100" style={{
              background: 'rgba(30, 30, 50, 0.8)',
              border: '1px solid rgba(229, 9, 20, 0.3)',
              borderRadius: '15px',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.borderColor = '#e50914';
              e.currentTarget.style.boxShadow = '0 10px 40px rgba(229, 9, 20, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(229, 9, 20, 0.3)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div className="card-body text-center py-5">
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📅</div>
                <h3 className="card-title" style={{ color: '#fff' }}>Sessões</h3>
                <p className="card-text" style={{ color: '#a0a0a0' }}>
                  Veja os horários disponíveis
                </p>
              </div>
            </div>
          </Link>
        </div>

        {/* Card Combos */}
        <div className="col-md-3">
          <Link to="/combos" className="text-decoration-none">
            <div className="card h-100" style={{
              background: 'rgba(30, 30, 50, 0.8)',
              border: '1px solid rgba(229, 9, 20, 0.3)',
              borderRadius: '15px',
              transition: 'all 0.3s ease',
              cursor: 'pointer'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.transform = 'translateY(-10px)';
              e.currentTarget.style.borderColor = '#e50914';
              e.currentTarget.style.boxShadow = '0 10px 40px rgba(229, 9, 20, 0.3)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.borderColor = 'rgba(229, 9, 20, 0.3)';
              e.currentTarget.style.boxShadow = 'none';
            }}>
              <div className="card-body text-center py-5">
                <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🍿</div>
                <h3 className="card-title" style={{ color: '#fff' }}>Combos</h3>
                <p className="card-text" style={{ color: '#a0a0a0' }}>
                  Pipoca, refrigerante e muito mais
                </p>
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}
