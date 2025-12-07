import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ISessao, IFilme, ISala } from '../models';
import { sessaoService, filmeService, salaService } from '../services';

/**
 * SessoesPage Component - CineMax Theme
 * Página de sessões com banners dos filmes (estilo igual FilmesPage)
 */
export default function SessoesPage() {
  const navigate = useNavigate();
  const [sessoes, setSessoes] = useState<ISessao[]>([]);
  const [filmes, setFilmes] = useState<IFilme[]>([]);
  const [salas, setSalas] = useState<ISala[]>([]);
  const [loading, setLoading] = useState(true);
  const [filtroData, setFiltroData] = useState<string>('');

  useEffect(() => {
    carregarDados();
    
    // Recarrega dados a cada 5 segundos para manter sincronizado
    const interval = setInterval(() => {
      carregarDadosSilencioso();
    }, 5000);
    
    return () => clearInterval(interval);
  }, []);

  const carregarDados = async () => {
    try {
      const [sessoesData, filmesData, salasData] = await Promise.all([
        sessaoService.listar(),
        filmeService.listar(),
        salaService.listar()
      ]);
      setSessoes(sessoesData);
      setFilmes(filmesData);
      setSalas(salasData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carrega dados sem mostrar loading (para refresh automático)
  const carregarDadosSilencioso = async () => {
    try {
      const [sessoesData, filmesData, salasData] = await Promise.all([
        sessaoService.listar(),
        filmeService.listar(),
        salaService.listar()
      ]);
      setSessoes(sessoesData);
      setFilmes(filmesData);
      setSalas(salasData);
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
    }
  };

  // Busca filme pelo ID
  const getFilme = (filmeId: string) => {
    return filmes.find(f => f.id === filmeId);
  };

  // Busca sala pelo ID
  const getSala = (salaId: string) => {
    return salas.find(s => s.id === salaId);
  };

  // Calcula assentos disponíveis
  const getAssentosDisponiveis = (sessao: ISessao) => {
    const sala = getSala(sessao.salaId);
    if (!sala) return 0;
    const ocupados = sessao.assentosOcupados?.length || 0;
    return sala.capacidade - ocupados;
  };

  // Datas únicas para filtro
  const datasUnicas = [...new Set(sessoes.map(s => s.data))].sort();

  // Sessões filtradas
  const sessoesFiltradas = filtroData 
    ? sessoes.filter(s => s.data === filtroData)
    : sessoes;

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" style={{ color: '#e50914' }} role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
        <p className="mt-3" style={{ color: '#a0a0a0' }}>Carregando sessões...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      {/* Header */}
      <div className="text-center mb-4">
        <h1 style={{
          fontSize: '2.5rem',
          fontWeight: 'bold',
          background: 'linear-gradient(45deg, #e50914, #ff6b6b)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          📅 Sessões Disponíveis
        </h1>
        <p style={{ color: '#a0a0a0' }}>Escolha seu filme e horário preferido</p>
      </div>

      {/* Filtro por Data */}
      <div className="d-flex justify-content-center gap-2 mb-5 flex-wrap">
        <button
          onClick={() => setFiltroData('')}
          className="btn"
          style={{
            background: filtroData === '' ? 'linear-gradient(45deg, #e50914, #b81d24)' : 'rgba(100, 100, 100, 0.3)',
            color: '#fff',
            border: 'none',
            borderRadius: '20px',
            padding: '8px 20px',
            fontWeight: filtroData === '' ? 'bold' : 'normal'
          }}
        >
          Todas
        </button>
        {datasUnicas.map(data => (
          <button
            key={data}
            onClick={() => setFiltroData(data)}
            className="btn"
            style={{
              background: filtroData === data ? 'linear-gradient(45deg, #e50914, #b81d24)' : 'rgba(100, 100, 100, 0.3)',
              color: '#fff',
              border: 'none',
              borderRadius: '20px',
              padding: '8px 20px',
              fontWeight: filtroData === data ? 'bold' : 'normal'
            }}
          >
            📆 {data}
          </button>
        ))}
      </div>

      {/* Lista de Sessões */}
      {sessoesFiltradas.length === 0 ? (
        <div className="text-center py-5">
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>📅</div>
          <h3 style={{ color: '#fff' }}>Nenhuma sessão disponível</h3>
          <p style={{ color: '#a0a0a0' }}>Em breve teremos novidades!</p>
        </div>
      ) : (
        <div className="row g-4">
          {sessoesFiltradas.map((sessao) => {
            const filme = getFilme(sessao.filmeId);
            const sala = getSala(sessao.salaId);
            const disponiveis = getAssentosDisponiveis(sessao);
            
            return (
              <div key={sessao.id} className="col-md-4 col-lg-3">
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
                  {/* Poster do Filme */}
                  <div style={{
                    height: '280px',
                    position: 'relative'
                  }}>
                    <img 
                      src={filme?.imagem || ''} 
                      alt={filme?.titulo || 'Filme'}
                      style={{
                        width: '100%',
                        height: '100%',
                        objectFit: 'cover'
                      }}
                      onError={(e) => {
                        e.currentTarget.src = 'https://via.placeholder.com/300x450?text=Sem+Imagem';
                      }}
                    />
                    {/* Overlay com Data/Hora */}
                    <div style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: 'rgba(0, 0, 0, 0.8)',
                      padding: '8px 12px',
                      borderRadius: '10px',
                      textAlign: 'center'
                    }}>
                      <div style={{ color: '#e50914', fontWeight: 'bold', fontSize: '0.9rem' }}>
                        {sessao.data}
                      </div>
                      <div style={{ color: '#fff', fontWeight: 'bold', fontSize: '1.2rem' }}>
                        {sessao.horario}
                      </div>
                    </div>

                    {/* Badges no Poster */}
                    <div style={{
                      position: 'absolute',
                      bottom: '0',
                      left: '0',
                      right: '0',
                      background: 'linear-gradient(transparent, rgba(0,0,0,0.95))',
                      padding: '30px 10px 10px'
                    }}>
                      <div className="d-flex gap-1 flex-wrap">
                        <span className="badge" style={{
                          background: '#e50914',
                          fontSize: '0.75rem'
                        }}>
                          {filme?.genero || 'Filme'}
                        </span>
                        <span className="badge" style={{
                          background: filme?.classificacao === 'L' ? '#4CAF50' : 
                                     filme?.classificacao === '10' ? '#8BC34A' :
                                     filme?.classificacao === '12' ? '#FFEB3B' :
                                     filme?.classificacao === '14' ? '#FF9800' :
                                     filme?.classificacao === '16' ? '#FF5722' : '#f44336',
                          fontSize: '0.75rem',
                          color: ['L', '10', '12'].includes(filme?.classificacao || '') ? '#000' : '#fff'
                        }}>
                          {filme?.classificacao || 'L'}
                        </span>
                        <span className="badge" style={{
                          background: sala?.tipo === '3D' ? 'rgba(0, 150, 255, 0.8)' : 'rgba(100, 100, 100, 0.8)',
                          fontSize: '0.75rem'
                        }}>
                          {sala?.tipo || '2D'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Info */}
                  <div className="card-body py-3">
                    <h5 className="card-title mb-2" style={{ 
                      color: '#fff', 
                      fontWeight: 'bold',
                      fontSize: '1rem',
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden'
                    }}>
                      {filme?.titulo || 'Filme'}
                    </h5>
                    
                    <div className="d-flex justify-content-between align-items-center mb-2">
                      <span style={{ color: '#a0a0a0', fontSize: '0.85rem' }}>
                        🎭 {sala?.nome || 'Sala'}
                      </span>
                      <span style={{ color: '#a0a0a0', fontSize: '0.85rem' }}>
                        ⏱️ {filme?.duracao || '?'} min
                      </span>
                    </div>

                    <div className="d-flex justify-content-between align-items-center">
                      <div>
                        <span style={{ 
                          color: disponiveis > 20 ? '#4CAF50' : disponiveis > 5 ? '#ffc107' : '#dc3545',
                          fontWeight: 'bold',
                          fontSize: '0.85rem'
                        }}>
                          🪑 {disponiveis} lugares
                        </span>
                      </div>
                      <div style={{ 
                        color: '#4CAF50', 
                        fontWeight: 'bold', 
                        fontSize: '1.1rem' 
                      }}>
                        R$ {Number(sessao.preco).toFixed(2)}
                      </div>
                    </div>
                  </div>

                  {/* Footer - Botão Comprar */}
                  <div className="card-footer p-2" style={{
                    background: 'transparent',
                    borderTop: '1px solid rgba(229, 9, 20, 0.2)'
                  }}>
                    <button 
                      className="btn w-100" 
                      onClick={() => navigate(`/comprar/${sessao.id}`)}
                      disabled={disponiveis === 0}
                      style={{
                        background: disponiveis === 0 
                          ? 'rgba(100, 100, 100, 0.5)' 
                          : 'linear-gradient(45deg, #e50914, #b81d24)',
                        color: '#fff',
                        border: 'none',
                        borderRadius: '20px',
                        fontWeight: 'bold',
                        padding: '10px'
                      }}>
                      {disponiveis === 0 ? '❌ Esgotado' : '🎟️ Comprar Ingresso'}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Legenda */}
      <div className="mt-5 p-4 text-center" style={{
        background: 'rgba(30, 30, 50, 0.5)',
        borderRadius: '15px',
        border: '1px solid rgba(229, 9, 20, 0.2)'
      }}>
        <h5 style={{ color: '#fff', marginBottom: '1rem' }}>🎬 Como Comprar</h5>
        <div className="d-flex justify-content-center gap-4 flex-wrap">
          <div style={{ color: '#a0a0a0' }}>
            <span style={{ fontSize: '1.5rem' }}>1️⃣</span> Escolha a sessão
          </div>
          <div style={{ color: '#a0a0a0' }}>
            <span style={{ fontSize: '1.5rem' }}>2️⃣</span> Selecione os assentos
          </div>
          <div style={{ color: '#a0a0a0' }}>
            <span style={{ fontSize: '1.5rem' }}>3️⃣</span> Preencha seus dados
          </div>
          <div style={{ color: '#a0a0a0' }}>
            <span style={{ fontSize: '1.5rem' }}>4️⃣</span> Confirme a compra
          </div>
        </div>
      </div>
    </div>
  );
}
