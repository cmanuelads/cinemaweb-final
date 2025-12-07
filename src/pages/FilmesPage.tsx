import { useEffect, useState } from 'react';
import { IFilme } from '../models';
import { filmeService } from '../services';

/**
 * FilmesPage Component - CineMax Theme
 * Página de listagem de filmes em cartaz (apenas exibição)
 */
export default function FilmesPage() {
  const [filmes, setFilmes] = useState<IFilme[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    carregarFilmes();
  }, []);

  const carregarFilmes = async () => {
    try {
      const filmesData = await filmeService.listar();
      setFilmes(filmesData);
    } catch (error) {
      console.error('Erro ao carregar filmes:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" style={{ color: '#e50914' }} role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
        <p className="mt-3" style={{ color: '#a0a0a0' }}>Carregando filmes...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="text-center mb-5">
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #e50914, #ff6b6b)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          🎬 Filmes em Cartaz
        </h1>
        <p style={{ color: '#a0a0a0' }}>Confira os melhores filmes da temporada</p>
      </div>

      {/* Lista de Filmes */}
      {filmes.length === 0 ? (
        <div className="text-center py-5">
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎬</div>
          <h3 style={{ color: '#fff' }}>Nenhum filme cadastrado</h3>
          <p style={{ color: '#a0a0a0' }}>Em breve teremos novidades!</p>
        </div>
      ) : (
        <div className="row g-4">
          {filmes.map((filme) => (
            <div key={filme.id} className="col-md-4 col-lg-3">
              <div className="card h-100" style={{
                background: 'rgba(30, 30, 50, 0.8)',
                border: '1px solid rgba(229, 9, 20, 0.3)',
                borderRadius: '15px',
                overflow: 'hidden',
                transition: 'all 0.3s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-10px)';
                e.currentTarget.style.boxShadow = '0 15px 40px rgba(229, 9, 20, 0.3)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}>
                {/* Poster */}
                <div style={{
                  height: '320px',
                  position: 'relative'
                }}>
                  <img 
                    src={filme.imagem} 
                    alt={filme.titulo}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover'
                    }}
                    onError={(e) => {
                      e.currentTarget.src = 'https://via.placeholder.com/300x450?text=Sem+Imagem';
                    }}
                  />
                  <div style={{
                    position: 'absolute',
                    bottom: '0',
                    left: '0',
                    right: '0',
                    background: 'linear-gradient(transparent, rgba(0,0,0,0.9))',
                    padding: '20px 10px 10px'
                  }}>
                    <span className="badge me-1" style={{
                      background: '#e50914',
                      fontSize: '0.8rem'
                    }}>
                      {filme.genero}
                    </span>
                    <span className="badge" style={{
                      background: filme.classificacao === 'L' ? '#4CAF50' : 
                                 filme.classificacao === '10' ? '#8BC34A' :
                                 filme.classificacao === '12' ? '#FFEB3B' :
                                 filme.classificacao === '14' ? '#FF9800' :
                                 filme.classificacao === '16' ? '#FF5722' : '#f44336',
                      fontSize: '0.8rem',
                      color: ['L', '10', '12'].includes(filme.classificacao || '') ? '#000' : '#fff'
                    }}>
                      {filme.classificacao || 'L'}
                    </span>
                  </div>
                </div>

                {/* Info */}
                <div className="card-body">
                  <h5 className="card-title" style={{ color: '#fff', fontWeight: 'bold' }}>
                    {filme.titulo}
                  </h5>
                  
                  <div className="mb-2">
                    <span className="me-3" style={{ color: '#a0a0a0', fontSize: '0.85rem' }}>
                      ⏱️ {filme.duracao} min
                    </span>
                  </div>

                  {filme.diretor && (
                    <p className="card-text small mb-2" style={{ color: '#a0a0a0' }}>
                      <strong style={{ color: '#e50914' }}>Diretor:</strong> {filme.diretor}
                    </p>
                  )}
                  
                  <p className="card-text small" style={{ 
                    color: '#a0a0a0',
                    display: '-webkit-box',
                    WebkitLineClamp: 3,
                    WebkitBoxOrient: 'vertical',
                    overflow: 'hidden'
                  }}>
                    {filme.sinopse}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Info */}
      <div className="mt-5 p-4 text-center" style={{
        background: 'rgba(30, 30, 50, 0.5)',
        borderRadius: '15px',
        border: '1px solid rgba(229, 9, 20, 0.2)'
      }}>
        <h5 style={{ color: '#fff' }}>🎟️ Quer comprar ingressos?</h5>
        <p style={{ color: '#a0a0a0', marginBottom: '0' }}>
          Acesse a página de <strong style={{ color: '#e50914' }}>Sessões</strong> para ver horários e comprar seus ingressos!
        </p>
      </div>
    </div>
  );
}