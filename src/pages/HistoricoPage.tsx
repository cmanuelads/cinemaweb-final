import { useEffect, useState } from 'react';
import { IIngresso, ICompraCombo, ISessao, IFilme, ISala, ICombo } from '../models';
import { ingressoService, compraComboService, sessaoService, filmeService, salaService, comboService } from '../services';

/**
 * HistoricoPage Component - CineMax Theme
 * Página de histórico de compras de ingressos e combos
 */
export default function HistoricoPage() {
  const [ingressos, setIngressos] = useState<IIngresso[]>([]);
  const [comprasCombos, setComprasCombos] = useState<ICompraCombo[]>([]);
  const [sessoes, setSessoes] = useState<ISessao[]>([]);
  const [filmes, setFilmes] = useState<IFilme[]>([]);
  const [salas, setSalas] = useState<ISala[]>([]);
  const [combos, setCombos] = useState<ICombo[]>([]);
  const [loading, setLoading] = useState(true);
  const [abaAtiva, setAbaAtiva] = useState<'ingressos' | 'combos'>('ingressos');
  const [filtroEmail, setFiltroEmail] = useState('');

  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [ingressosData, combosComprasData, sessoesData, filmesData, salasData, combosData] = await Promise.all([
        ingressoService.listar(),
        compraComboService.listar().catch(() => []),
        sessaoService.listar(),
        filmeService.listar(),
        salaService.listar(),
        comboService.listar()
      ]);
      setIngressos(ingressosData);
      setComprasCombos(combosComprasData);
      setSessoes(sessoesData);
      setFilmes(filmesData);
      setSalas(salasData);
      setCombos(combosData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  // Busca informações do filme pela sessão
  const getFilmeDaSessao = (sessaoId: string) => {
    const sessao = sessoes.find(s => s.id === sessaoId);
    if (!sessao) return null;
    return filmes.find(f => f.id === sessao.filmeId);
  };

  // Busca informações da sessão
  const getSessao = (sessaoId: string) => {
    return sessoes.find(s => s.id === sessaoId);
  };

  // Busca informações da sala pela sessão
  const getSalaDaSessao = (sessaoId: string) => {
    const sessao = sessoes.find(s => s.id === sessaoId);
    if (!sessao) return null;
    return salas.find(s => s.id === sessao.salaId);
  };

  // Busca informações do combo
  const getCombo = (comboId: string) => {
    return combos.find(c => c.id === comboId);
  };

  // Formata data
  const formatarData = (dataISO: string) => {
    const data = new Date(dataISO);
    return data.toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filtra ingressos por email
  const ingressosFiltrados = filtroEmail 
    ? ingressos.filter(i => i.emailCliente.toLowerCase().includes(filtroEmail.toLowerCase()))
    : ingressos;

  // Filtra compras de combos por email
  const combosFiltrados = filtroEmail 
    ? comprasCombos.filter(c => c.emailCliente.toLowerCase().includes(filtroEmail.toLowerCase()))
    : comprasCombos;

  // Calcula totais
  const totalIngressos = ingressos.reduce((acc, i) => acc + (i.status === 'confirmado' ? i.total : 0), 0);
  const totalCombos = comprasCombos.reduce((acc, c) => acc + (c.status === 'confirmado' ? c.total : 0), 0);

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" style={{ color: '#e50914' }} role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
        <p className="mt-3" style={{ color: '#a0a0a0' }}>Carregando histórico...</p>
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
          📋 Histórico de Compras
        </h1>
        <p style={{ color: '#a0a0a0' }}>Consulte suas compras de ingressos e combos</p>
      </div>

      {/* Resumo */}
      <div className="row g-3 mb-4">
        <div className="col-md-4">
          <div className="p-3 text-center" style={{
            background: 'rgba(229, 9, 20, 0.1)',
            borderRadius: '15px',
            border: '1px solid rgba(229, 9, 20, 0.3)'
          }}>
            <h3 style={{ color: '#e50914', margin: 0 }}>{ingressos.length}</h3>
            <small style={{ color: '#a0a0a0' }}>🎟️ Ingressos Comprados</small>
          </div>
        </div>
        <div className="col-md-4">
          <div className="p-3 text-center" style={{
            background: 'rgba(76, 175, 80, 0.1)',
            borderRadius: '15px',
            border: '1px solid rgba(76, 175, 80, 0.3)'
          }}>
            <h3 style={{ color: '#4CAF50', margin: 0 }}>{comprasCombos.length}</h3>
            <small style={{ color: '#a0a0a0' }}>🍿 Combos Comprados</small>
          </div>
        </div>
        <div className="col-md-4">
          <div className="p-3 text-center" style={{
            background: 'rgba(255, 193, 7, 0.1)',
            borderRadius: '15px',
            border: '1px solid rgba(255, 193, 7, 0.3)'
          }}>
            <h3 style={{ color: '#ffc107', margin: 0 }}>R$ {(totalIngressos + totalCombos).toFixed(2)}</h3>
            <small style={{ color: '#a0a0a0' }}>💰 Total Gasto</small>
          </div>
        </div>
      </div>

      {/* Filtro por Email */}
      <div className="mb-4">
        <div className="input-group" style={{ maxWidth: '400px', margin: '0 auto' }}>
          <span className="input-group-text" style={{
            background: 'rgba(30, 30, 50, 0.8)',
            border: '1px solid rgba(229, 9, 20, 0.3)',
            color: '#e50914'
          }}>
            🔍
          </span>
          <input
            type="email"
            className="form-control"
            placeholder="Filtrar por email..."
            value={filtroEmail}
            onChange={(e) => setFiltroEmail(e.target.value)}
            style={{
              background: 'rgba(30, 30, 50, 0.8)',
              border: '1px solid rgba(229, 9, 20, 0.3)',
              color: '#fff'
            }}
          />
        </div>
      </div>

      {/* Abas */}
      <div className="d-flex justify-content-center gap-2 mb-4">
        <button
          onClick={() => setAbaAtiva('ingressos')}
          className="btn"
          style={{
            background: abaAtiva === 'ingressos' ? 'linear-gradient(45deg, #e50914, #b81d24)' : 'rgba(100, 100, 100, 0.3)',
            color: '#fff',
            border: 'none',
            borderRadius: '20px',
            padding: '10px 30px',
            fontWeight: abaAtiva === 'ingressos' ? 'bold' : 'normal'
          }}
        >
          🎟️ Ingressos ({ingressosFiltrados.length})
        </button>
        <button
          onClick={() => setAbaAtiva('combos')}
          className="btn"
          style={{
            background: abaAtiva === 'combos' ? 'linear-gradient(45deg, #e50914, #b81d24)' : 'rgba(100, 100, 100, 0.3)',
            color: '#fff',
            border: 'none',
            borderRadius: '20px',
            padding: '10px 30px',
            fontWeight: abaAtiva === 'combos' ? 'bold' : 'normal'
          }}
        >
          🍿 Combos ({combosFiltrados.length})
        </button>
      </div>

      {/* Lista de Ingressos */}
      {abaAtiva === 'ingressos' && (
        <div>
          {ingressosFiltrados.length === 0 ? (
            <div className="text-center py-5">
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🎟️</div>
              <h3 style={{ color: '#fff' }}>Nenhum ingresso encontrado</h3>
              <p style={{ color: '#a0a0a0' }}>
                {filtroEmail ? 'Tente outro email' : 'Você ainda não comprou nenhum ingresso'}
              </p>
            </div>
          ) : (
            <div className="row g-4">
              {ingressosFiltrados.map((ingresso) => {
                const filme = getFilmeDaSessao(ingresso.sessaoId);
                const sessao = getSessao(ingresso.sessaoId);
                const sala = getSalaDaSessao(ingresso.sessaoId);
                
                return (
                  <div key={ingresso.id} className="col-md-6 col-lg-4">
                    <div className="card h-100" style={{
                      background: 'rgba(30, 30, 50, 0.8)',
                      border: `1px solid ${ingresso.status === 'confirmado' ? 'rgba(76, 175, 80, 0.5)' : 
                               ingresso.status === 'cancelado' ? 'rgba(244, 67, 54, 0.5)' : 'rgba(255, 193, 7, 0.5)'}`,
                      borderRadius: '15px',
                      overflow: 'hidden'
                    }}>
                      {/* Header com poster */}
                      <div style={{
                        height: '120px',
                        position: 'relative',
                        background: `linear-gradient(rgba(0,0,0,0.7), rgba(0,0,0,0.9)), url(${filme?.imagem || ''})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}>
                        <div className="p-3">
                          <h5 className="mb-1" style={{ color: '#fff', fontWeight: 'bold' }}>
                            🎬 {filme?.titulo || 'Filme'}
                          </h5>
                          <small style={{ color: '#a0a0a0' }}>
                            {sessao?.data} às {sessao?.horario}
                          </small>
                        </div>
                        <span className="badge position-absolute" style={{
                          top: '10px',
                          right: '10px',
                          background: ingresso.status === 'confirmado' ? '#4CAF50' : 
                                     ingresso.status === 'cancelado' ? '#f44336' : '#ffc107',
                          color: '#fff'
                        }}>
                          {ingresso.status === 'confirmado' ? '✅ Confirmado' : 
                           ingresso.status === 'cancelado' ? '❌ Cancelado' : '⏳ Pendente'}
                        </span>
                      </div>

                      {/* Body */}
                      <div className="card-body">
                        <div className="mb-2">
                          <small style={{ color: '#a0a0a0' }}>🎭 Sala:</small>
                          <span style={{ color: '#fff', marginLeft: '5px' }}>{sala?.nome || 'N/A'}</span>
                        </div>
                        <div className="mb-2">
                          <small style={{ color: '#a0a0a0' }}>🪑 Assentos:</small>
                          <div className="d-flex flex-wrap gap-1 mt-1">
                            {ingresso.assentos.map(assento => (
                              <span key={assento} className="badge" style={{
                                background: 'rgba(229, 9, 20, 0.3)',
                                color: '#e50914'
                              }}>
                                {assento}
                              </span>
                            ))}
                          </div>
                        </div>
                        <div className="mb-2">
                          <small style={{ color: '#a0a0a0' }}>👤 Cliente:</small>
                          <span style={{ color: '#fff', marginLeft: '5px' }}>{ingresso.nomeCliente}</span>
                        </div>
                        <div className="mb-2">
                          <small style={{ color: '#a0a0a0' }}>📧 Email:</small>
                          <span style={{ color: '#fff', marginLeft: '5px', fontSize: '0.85rem' }}>{ingresso.emailCliente}</span>
                        </div>
                        <div className="mb-2">
                          <small style={{ color: '#a0a0a0' }}>📅 Compra:</small>
                          <span style={{ color: '#fff', marginLeft: '5px', fontSize: '0.85rem' }}>{formatarData(ingresso.dataCompra)}</span>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="card-footer d-flex justify-content-between align-items-center" style={{
                        background: 'transparent',
                        borderTop: '1px solid rgba(229, 9, 20, 0.2)'
                      }}>
                        <span style={{ color: '#a0a0a0' }}>
                          {ingresso.assentos.length} ingresso(s)
                        </span>
                        <span style={{ color: '#4CAF50', fontWeight: 'bold', fontSize: '1.2rem' }}>
                          R$ {ingresso.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Lista de Combos */}
      {abaAtiva === 'combos' && (
        <div>
          {combosFiltrados.length === 0 ? (
            <div className="text-center py-5">
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🍿</div>
              <h3 style={{ color: '#fff' }}>Nenhuma compra de combo encontrada</h3>
              <p style={{ color: '#a0a0a0' }}>
                {filtroEmail ? 'Tente outro email' : 'Você ainda não comprou nenhum combo'}
              </p>
            </div>
          ) : (
            <div className="row g-4">
              {combosFiltrados.map((compra) => {
                const combo = getCombo(compra.comboId);
                
                return (
                  <div key={compra.id} className="col-md-6 col-lg-4">
                    <div className="card h-100" style={{
                      background: 'rgba(30, 30, 50, 0.8)',
                      border: `1px solid ${compra.status === 'confirmado' ? 'rgba(76, 175, 80, 0.5)' : 
                               compra.status === 'cancelado' ? 'rgba(244, 67, 54, 0.5)' : 'rgba(255, 193, 7, 0.5)'}`,
                      borderRadius: '15px',
                      overflow: 'hidden'
                    }}>
                      {/* Header com imagem */}
                      <div style={{
                        height: '100px',
                        position: 'relative',
                        background: `linear-gradient(rgba(0,0,0,0.5), rgba(0,0,0,0.8)), url(${combo?.imagem || ''})`,
                        backgroundSize: 'cover',
                        backgroundPosition: 'center'
                      }}>
                        <div className="p-3">
                          <h5 className="mb-0" style={{ color: '#fff', fontWeight: 'bold' }}>
                            🍿 {combo?.nome || 'Combo'}
                          </h5>
                        </div>
                        <span className="badge position-absolute" style={{
                          top: '10px',
                          right: '10px',
                          background: compra.status === 'confirmado' ? '#4CAF50' : 
                                     compra.status === 'cancelado' ? '#f44336' : '#ffc107',
                          color: '#fff'
                        }}>
                          {compra.status === 'confirmado' ? '✅ Confirmado' : 
                           compra.status === 'cancelado' ? '❌ Cancelado' : '⏳ Pendente'}
                        </span>
                      </div>

                      {/* Body */}
                      <div className="card-body">
                        <div className="mb-2">
                          <small style={{ color: '#a0a0a0' }}>📦 Quantidade:</small>
                          <span style={{ color: '#fff', marginLeft: '5px' }}>{compra.quantidade}x</span>
                        </div>
                        <div className="mb-2">
                          <small style={{ color: '#a0a0a0' }}>👤 Cliente:</small>
                          <span style={{ color: '#fff', marginLeft: '5px' }}>{compra.nomeCliente}</span>
                        </div>
                        <div className="mb-2">
                          <small style={{ color: '#a0a0a0' }}>📧 Email:</small>
                          <span style={{ color: '#fff', marginLeft: '5px', fontSize: '0.85rem' }}>{compra.emailCliente}</span>
                        </div>
                        <div className="mb-2">
                          <small style={{ color: '#a0a0a0' }}>📅 Compra:</small>
                          <span style={{ color: '#fff', marginLeft: '5px', fontSize: '0.85rem' }}>{formatarData(compra.dataCompra)}</span>
                        </div>
                      </div>

                      {/* Footer */}
                      <div className="card-footer d-flex justify-content-between align-items-center" style={{
                        background: 'transparent',
                        borderTop: '1px solid rgba(229, 9, 20, 0.2)'
                      }}>
                        <span style={{ color: '#a0a0a0' }}>
                          Preço unitário: R$ {combo?.preco?.toFixed(2) || '0.00'}
                        </span>
                        <span style={{ color: '#4CAF50', fontWeight: 'bold', fontSize: '1.2rem' }}>
                          R$ {compra.total.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
