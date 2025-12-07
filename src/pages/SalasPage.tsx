import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ISala, ISessao, IFilme } from '../models';
import { salaService, sessaoService, filmeService } from '../services';

/**
 * SalasPage Component - CineMax Theme
 * Página de listagem de salas com visualização de assentos
 */
export default function SalasPage() {
  const navigate = useNavigate();
  const [salas, setSalas] = useState<ISala[]>([]);
  const [sessoes, setSessoes] = useState<ISessao[]>([]);
  const [filmes, setFilmes] = useState<IFilme[]>([]);
  const [loading, setLoading] = useState(true);
  const [salaExpandida, setSalaExpandida] = useState<string | null>(null);
  const [sessaoSelecionada, setSessaoSelecionada] = useState<string | null>(null);

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
      const [salasData, sessoesData, filmesData] = await Promise.all([
        salaService.listar(),
        sessaoService.listar(),
        filmeService.listar()
      ]);
      setSalas(salasData);
      setSessoes(sessoesData);
      setFilmes(filmesData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  // Carrega dados sem mostrar loading (para refresh automático)
  const carregarDadosSilencioso = async () => {
    try {
      const [salasData, sessoesData, filmesData] = await Promise.all([
        salaService.listar(),
        sessaoService.listar(),
        filmeService.listar()
      ]);
      setSalas(salasData);
      setSessoes(sessoesData);
      setFilmes(filmesData);
    } catch (error) {
      console.error('Erro ao atualizar dados:', error);
    }
  };

  // Busca sessões de uma sala
  const getSessoesDaSala = (salaId: string) => {
    return sessoes.filter(s => s.salaId === salaId);
  };

  // Busca filme pelo ID
  const getFilme = (filmeId: string) => {
    return filmes.find(f => f.id === filmeId);
  };

  // Gera matriz de assentos baseado na sala
  const gerarAssentos = (sala: ISala) => {
    const fileiras = sala.fileiras || 8;
    const assentosPorFileira = sala.assentosPorFileira || 10;
    const assentos: string[][] = [];
    
    for (let i = 0; i < fileiras; i++) {
      const fileira: string[] = [];
      const letra = String.fromCharCode(65 + i);
      for (let j = 1; j <= assentosPorFileira; j++) {
        fileira.push(`${letra}${j}`);
      }
      assentos.push(fileira);
    }
    
    return assentos;
  };

  // Verifica se assento está ocupado na sessão selecionada
  const isAssentoOcupado = (assento: string) => {
    if (!sessaoSelecionada) return false;
    const sessao = sessoes.find(s => s.id === sessaoSelecionada);
    return sessao?.assentosOcupados?.includes(assento) || false;
  };

  // Conta assentos ocupados na sessão
  const contarOcupados = (sessaoId: string) => {
    const sessao = sessoes.find(s => s.id === sessaoId);
    return sessao?.assentosOcupados?.length || 0;
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" style={{ color: '#e50914' }} role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
        <p className="mt-3" style={{ color: '#a0a0a0' }}>Carregando salas...</p>
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
          🎭 Nossas Salas
        </h1>
        <p style={{ color: '#a0a0a0' }}>Clique em uma sala para ver os assentos disponíveis</p>
      </div>

      {/* Lista de Salas */}
      {salas.length === 0 ? (
        <div className="text-center py-5">
          <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎭</div>
          <h3 style={{ color: '#fff' }}>Nenhuma sala cadastrada</h3>
          <p style={{ color: '#a0a0a0' }}>Em breve teremos novidades!</p>
        </div>
      ) : (
        <div className="row g-4">
          {salas.map((sala) => {
            const sessoesDaSala = getSessoesDaSala(sala.id!);
            const isExpandida = salaExpandida === sala.id;
            
            return (
              <div key={sala.id} className="col-12">
                <div className="card" style={{
                  background: 'rgba(30, 30, 50, 0.8)',
                  border: isExpandida ? '2px solid #e50914' : '1px solid rgba(229, 9, 20, 0.3)',
                  borderRadius: '15px',
                  overflow: 'hidden',
                  transition: 'all 0.3s ease'
                }}>
                  {/* Header da Sala - Clicável */}
                  <div 
                    className="card-header d-flex justify-content-between align-items-center"
                    onClick={() => {
                      setSalaExpandida(isExpandida ? null : sala.id!);
                      setSessaoSelecionada(null);
                    }}
                    style={{
                      background: isExpandida ? 'rgba(229, 9, 20, 0.2)' : 'transparent',
                      borderBottom: '1px solid rgba(229, 9, 20, 0.2)',
                      cursor: 'pointer',
                      padding: '1rem 1.5rem'
                    }}
                  >
                    <div className="d-flex align-items-center gap-3">
                      <div style={{
                        width: '50px',
                        height: '50px',
                        borderRadius: '50%',
                        background: 'linear-gradient(45deg, #e50914, #b81d24)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        fontSize: '1.5rem'
                      }}>
                        🎭
                      </div>
                      <div>
                        <h5 className="mb-0" style={{ color: '#fff', fontWeight: 'bold' }}>
                          {sala.nome}
                        </h5>
                        <small style={{ color: '#a0a0a0' }}>{sala.descricao}</small>
                      </div>
                    </div>
                    
                    <div className="d-flex align-items-center gap-3">
                      <span className="badge" style={{
                        background: 'rgba(229, 9, 20, 0.2)',
                        color: '#e50914',
                        padding: '8px 15px'
                      }}>
                        🪑 {sala.capacidade} lugares
                      </span>
                      <span className="badge" style={{
                        background: sala.tipo === '3D' ? 'rgba(0, 150, 255, 0.2)' : 'rgba(100, 100, 100, 0.2)',
                        color: sala.tipo === '3D' ? '#00bfff' : '#a0a0a0',
                        padding: '8px 15px'
                      }}>
                        {sala.tipo === '3D' ? '🎥 3D' : '📽️ 2D'}
                      </span>
                      <span style={{ color: '#e50914', fontSize: '1.5rem' }}>
                        {isExpandida ? '▲' : '▼'}
                      </span>
                    </div>
                  </div>

                  {/* Conteúdo Expandido */}
                  {isExpandida && (
                    <div className="card-body">
                      {/* Sessões da Sala */}
                      {sessoesDaSala.length > 0 ? (
                        <>
                          <h6 style={{ color: '#fff', marginBottom: '1rem' }}>
                            📅 Selecione uma sessão para ver os assentos:
                          </h6>
                          <div className="d-flex flex-wrap gap-2 mb-4">
                            {sessoesDaSala.map((sessao) => {
                              const filme = getFilme(sessao.filmeId);
                              const ocupados = contarOcupados(sessao.id!);
                              const disponiveis = sala.capacidade - ocupados;
                              const isSelected = sessaoSelecionada === sessao.id;
                              
                              return (
                                <button
                                  key={sessao.id}
                                  onClick={() => setSessaoSelecionada(isSelected ? null : sessao.id!)}
                                  className="btn"
                                  style={{
                                    background: isSelected 
                                      ? 'linear-gradient(45deg, #e50914, #b81d24)' 
                                      : 'rgba(100, 100, 100, 0.3)',
                                    color: '#fff',
                                    border: isSelected ? 'none' : '1px solid rgba(229, 9, 20, 0.3)',
                                    borderRadius: '10px',
                                    padding: '10px 15px',
                                    textAlign: 'left'
                                  }}
                                >
                                  <div><strong>{filme?.titulo || 'Filme'}</strong></div>
                                  <small>{sessao.data} às {sessao.horario}</small>
                                  <div>
                                    <span style={{ 
                                      color: disponiveis > 20 ? '#4CAF50' : disponiveis > 5 ? '#ffc107' : '#dc3545',
                                      fontSize: '0.8rem'
                                    }}>
                                      {disponiveis} disponíveis
                                    </span>
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        </>
                      ) : (
                        <p style={{ color: '#a0a0a0', textAlign: 'center' }}>
                          Nenhuma sessão programada para esta sala
                        </p>
                      )}

                      {/* Mapa de Assentos */}
                      {sessaoSelecionada && (
                        <div className="mt-3 p-3" style={{
                          background: 'rgba(0, 0, 0, 0.3)',
                          borderRadius: '15px',
                          border: '1px solid rgba(229, 9, 20, 0.2)'
                        }}>
                          {/* Tela */}
                          <div className="text-center mb-3">
                            <div style={{
                              background: 'linear-gradient(90deg, transparent, #e50914, transparent)',
                              height: '5px',
                              width: '60%',
                              margin: '0 auto 10px',
                              borderRadius: '5px'
                            }}></div>
                            <span style={{ color: '#a0a0a0', fontSize: '0.85rem' }}>📺 TELA</span>
                          </div>

                          {/* Legenda */}
                          <div className="d-flex justify-content-center gap-4 mb-3">
                            <div className="d-flex align-items-center gap-2">
                              <div style={{
                                width: '20px',
                                height: '20px',
                                background: '#4CAF50',
                                borderRadius: '4px'
                              }}></div>
                              <span style={{ color: '#a0a0a0', fontSize: '0.8rem' }}>Disponível</span>
                            </div>
                            <div className="d-flex align-items-center gap-2">
                              <div style={{
                                width: '20px',
                                height: '20px',
                                background: '#dc3545',
                                borderRadius: '4px'
                              }}></div>
                              <span style={{ color: '#a0a0a0', fontSize: '0.8rem' }}>Ocupado</span>
                            </div>
                          </div>

                          {/* Grid de Assentos */}
                          <div className="d-flex flex-column align-items-center gap-1">
                            {gerarAssentos(sala).map((fileira, idx) => (
                              <div key={idx} className="d-flex align-items-center gap-1">
                                <span style={{ 
                                  color: '#e50914', 
                                  fontWeight: 'bold', 
                                  width: '20px',
                                  fontSize: '0.8rem'
                                }}>
                                  {String.fromCharCode(65 + idx)}
                                </span>
                                <div className="d-flex gap-1">
                                  {fileira.map((assento) => {
                                    const ocupado = isAssentoOcupado(assento);
                                    return (
                                      <div
                                        key={assento}
                                        title={`${assento} - ${ocupado ? 'Ocupado' : 'Disponível'}`}
                                        style={{
                                          width: '24px',
                                          height: '24px',
                                          borderRadius: '4px',
                                          background: ocupado ? '#dc3545' : '#4CAF50',
                                          display: 'flex',
                                          alignItems: 'center',
                                          justifyContent: 'center',
                                          fontSize: '0.6rem',
                                          color: '#fff',
                                          fontWeight: 'bold',
                                          cursor: 'default'
                                        }}
                                      >
                                        {assento.slice(1)}
                                      </div>
                                    );
                                  })}
                                </div>
                              </div>
                            ))}
                          </div>

                          {/* Resumo e Botão Comprar */}
                          <div className="mt-4 d-flex justify-content-between align-items-center">
                            <div style={{ color: '#a0a0a0' }}>
                              <span style={{ color: '#4CAF50', fontWeight: 'bold' }}>
                                {sala.capacidade - contarOcupados(sessaoSelecionada)}
                              </span> disponíveis / 
                              <span style={{ color: '#dc3545', fontWeight: 'bold', marginLeft: '5px' }}>
                                {contarOcupados(sessaoSelecionada)}
                              </span> ocupados
                            </div>
                            <button
                              className="btn"
                              onClick={() => navigate(`/comprar/${sessaoSelecionada}`)}
                              style={{
                                background: 'linear-gradient(45deg, #e50914, #b81d24)',
                                color: '#fff',
                                border: 'none',
                                borderRadius: '20px',
                                padding: '10px 25px',
                                fontWeight: 'bold'
                              }}
                            >
                              🎟️ Comprar Ingressos
                            </button>
                          </div>
                        </div>
                      )}
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Info */}
      <div className="mt-5 p-4 text-center" style={{
        background: 'rgba(30, 30, 50, 0.5)',
        borderRadius: '15px',
        border: '1px solid rgba(229, 9, 20, 0.2)'
      }}>
        <h5 style={{ color: '#fff' }}>✨ Tecnologia de Ponta</h5>
        <p style={{ color: '#a0a0a0' }}>
          Todas as nossas salas contam com som Dolby Atmos e poltronas reclináveis
        </p>
      </div>
    </div>
  );
}
