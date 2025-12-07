import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ISessao, IFilme, ISala, IIngresso } from '../models';
import { sessaoService, filmeService, salaService, ingressoService } from '../services';

/**
 * CompraIngressoPage - Página de compra de ingressos com seleção de assentos
 */
export default function CompraIngressoPage() {
  const { sessaoId } = useParams<{ sessaoId: string }>();
  const navigate = useNavigate();

  const [sessao, setSessao] = useState<ISessao | null>(null);
  const [filme, setFilme] = useState<IFilme | null>(null);
  const [sala, setSala] = useState<ISala | null>(null);
  const [loading, setLoading] = useState(true);
  const [assentosSelecionados, setAssentosSelecionados] = useState<string[]>([]);
  const [nomeCliente, setNomeCliente] = useState('');
  const [emailCliente, setEmailCliente] = useState('');
  const [etapa, setEtapa] = useState<'assentos' | 'dados' | 'confirmacao'>('assentos');
  const [comprando, setComprando] = useState(false);
  const [ingressoComprado, setIngressoComprado] = useState<IIngresso | null>(null);

  useEffect(() => {
    carregarDados();
  }, [sessaoId]);

  const carregarDados = async () => {
    try {
      const sessoes = await sessaoService.listar();
      const sessaoEncontrada = sessoes.find((s: ISessao) => s.id === sessaoId);
      
      if (sessaoEncontrada) {
        setSessao(sessaoEncontrada);
        
        const [filmesData, salasData] = await Promise.all([
          filmeService.listar(),
          salaService.listar()
        ]);
        
        const filmeEncontrado = filmesData.find((f: IFilme) => f.id === sessaoEncontrada.filmeId);
        const salaEncontrada = salasData.find((s: ISala) => s.id === sessaoEncontrada.salaId);
        
        setFilme(filmeEncontrado);
        setSala(salaEncontrada);
      }
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  // Gera matriz de assentos baseado na sala
  const gerarAssentos = () => {
    if (!sala) return [];
    
    const fileiras = sala.fileiras || 8;
    const assentosPorFileira = sala.assentosPorFileira || 10;
    const assentos: string[][] = [];
    
    for (let i = 0; i < fileiras; i++) {
      const fileira: string[] = [];
      const letra = String.fromCharCode(65 + i); // A, B, C, ...
      for (let j = 1; j <= assentosPorFileira; j++) {
        fileira.push(`${letra}${j}`);
      }
      assentos.push(fileira);
    }
    
    return assentos;
  };

  const toggleAssento = (assento: string) => {
    if (sessao?.assentosOcupados?.includes(assento)) return;
    
    setAssentosSelecionados(prev => 
      prev.includes(assento)
        ? prev.filter(a => a !== assento)
        : [...prev, assento]
    );
  };

  const getAssentoStatus = (assento: string) => {
    if (sessao?.assentosOcupados?.includes(assento)) return 'ocupado';
    if (assentosSelecionados.includes(assento)) return 'selecionado';
    return 'disponivel';
  };

  const calcularTotal = () => {
    return assentosSelecionados.length * (sessao?.preco || 0);
  };

  const finalizarCompra = async () => {
    if (!sessao || !nomeCliente || !emailCliente || assentosSelecionados.length === 0) {
      alert('Preencha todos os dados!');
      return;
    }

    setComprando(true);
    
    try {
      // Criar ingresso
      const novoIngresso: Omit<IIngresso, 'id'> = {
        sessaoId: sessao.id!,
        assentos: assentosSelecionados,
        nomeCliente,
        emailCliente,
        total: calcularTotal(),
        dataCompra: new Date().toISOString(),
        status: 'confirmado'
      };
      
      const ingressoCriado = await ingressoService.criar(novoIngresso);
      
      // Atualizar assentos ocupados na sessão
      const novosAssentosOcupados = [...(sessao.assentosOcupados || []), ...assentosSelecionados];
      await sessaoService.atualizar(sessao.id!, {
        ...sessao,
        assentosOcupados: novosAssentosOcupados
      });
      
      setIngressoComprado(ingressoCriado);
      setEtapa('confirmacao');
    } catch (error) {
      console.error('Erro ao finalizar compra:', error);
      alert('Erro ao processar compra. Tente novamente.');
    } finally {
      setComprando(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" style={{ color: '#e50914' }} role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
        <p className="mt-3" style={{ color: '#a0a0a0' }}>Carregando sessão...</p>
      </div>
    );
  }

  if (!sessao || !filme || !sala) {
    return (
      <div className="container py-5 text-center">
        <h2 style={{ color: '#fff' }}>Sessão não encontrada</h2>
        <button className="btn mt-3" onClick={() => navigate('/sessoes')} style={{
          background: 'linear-gradient(45deg, #e50914, #b81d24)',
          color: '#fff',
          border: 'none',
          borderRadius: '20px'
        }}>
          Voltar às Sessões
        </button>
      </div>
    );
  }

  const assentos = gerarAssentos();

  return (
    <div className="container py-5">
      {/* Header com info do filme */}
      <div className="row mb-4">
        <div className="col-md-3">
          <img 
            src={filme.imagem} 
            alt={filme.titulo}
            className="img-fluid rounded"
            style={{ maxHeight: '200px', objectFit: 'cover' }}
          />
        </div>
        <div className="col-md-9">
          <h2 style={{
            background: 'linear-gradient(45deg, #e50914, #ff6b6b)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            fontWeight: 'bold'
          }}>
            🎬 {filme.titulo}
          </h2>
          <div className="d-flex flex-wrap gap-3 mt-3" style={{ color: '#a0a0a0' }}>
            <span><strong style={{ color: '#e50914' }}>🎭 Sala:</strong> {sala.nome}</span>
            <span><strong style={{ color: '#e50914' }}>📅 Data:</strong> {sessao.data}</span>
            <span><strong style={{ color: '#e50914' }}>🕐 Horário:</strong> {sessao.horario}</span>
            <span><strong style={{ color: '#e50914' }}>💰 Preço:</strong> R$ {sessao.preco.toFixed(2)}</span>
          </div>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="d-flex justify-content-center mb-4">
        <div className="d-flex align-items-center">
          <div className={`rounded-circle d-flex align-items-center justify-content-center`}
            style={{
              width: '40px',
              height: '40px',
              background: etapa === 'assentos' ? '#e50914' : 'rgba(229, 9, 20, 0.3)',
              color: '#fff',
              fontWeight: 'bold'
            }}>1</div>
          <span className="mx-2" style={{ color: '#a0a0a0' }}>Assentos</span>
          <div style={{ width: '50px', height: '2px', background: 'rgba(229, 9, 20, 0.3)' }}></div>
          <div className={`rounded-circle d-flex align-items-center justify-content-center`}
            style={{
              width: '40px',
              height: '40px',
              background: etapa === 'dados' ? '#e50914' : 'rgba(229, 9, 20, 0.3)',
              color: '#fff',
              fontWeight: 'bold'
            }}>2</div>
          <span className="mx-2" style={{ color: '#a0a0a0' }}>Dados</span>
          <div style={{ width: '50px', height: '2px', background: 'rgba(229, 9, 20, 0.3)' }}></div>
          <div className={`rounded-circle d-flex align-items-center justify-content-center`}
            style={{
              width: '40px',
              height: '40px',
              background: etapa === 'confirmacao' ? '#4CAF50' : 'rgba(229, 9, 20, 0.3)',
              color: '#fff',
              fontWeight: 'bold'
            }}>3</div>
          <span className="mx-2" style={{ color: '#a0a0a0' }}>Confirmação</span>
        </div>
      </div>

      {/* Etapa 1: Seleção de Assentos */}
      {etapa === 'assentos' && (
        <div className="card" style={{
          background: 'rgba(30, 30, 50, 0.8)',
          border: '1px solid rgba(229, 9, 20, 0.3)',
          borderRadius: '15px'
        }}>
          <div className="card-body">
            {/* Tela */}
            <div className="text-center mb-4">
              <div style={{
                background: 'linear-gradient(90deg, transparent, #e50914, transparent)',
                height: '5px',
                width: '80%',
                margin: '0 auto 10px',
                borderRadius: '5px'
              }}></div>
              <span style={{ color: '#a0a0a0', fontSize: '0.9rem' }}>📺 TELA</span>
            </div>

            {/* Legenda */}
            <div className="d-flex justify-content-center gap-4 mb-4">
              <div className="d-flex align-items-center gap-2">
                <div style={{
                  width: '25px',
                  height: '25px',
                  background: 'rgba(100, 100, 100, 0.5)',
                  borderRadius: '5px',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}></div>
                <span style={{ color: '#a0a0a0', fontSize: '0.85rem' }}>Disponível</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <div style={{
                  width: '25px',
                  height: '25px',
                  background: '#e50914',
                  borderRadius: '5px'
                }}></div>
                <span style={{ color: '#a0a0a0', fontSize: '0.85rem' }}>Selecionado</span>
              </div>
              <div className="d-flex align-items-center gap-2">
                <div style={{
                  width: '25px',
                  height: '25px',
                  background: '#333',
                  borderRadius: '5px',
                  border: '1px solid #555'
                }}></div>
                <span style={{ color: '#a0a0a0', fontSize: '0.85rem' }}>Ocupado</span>
              </div>
            </div>

            {/* Grid de Assentos */}
            <div className="d-flex flex-column align-items-center gap-2">
              {assentos.map((fileira, idx) => (
                <div key={idx} className="d-flex align-items-center gap-2">
                  <span style={{ color: '#e50914', fontWeight: 'bold', width: '25px' }}>
                    {String.fromCharCode(65 + idx)}
                  </span>
                  <div className="d-flex gap-1">
                    {fileira.map((assento) => {
                      const status = getAssentoStatus(assento);
                      return (
                        <button
                          key={assento}
                          onClick={() => toggleAssento(assento)}
                          disabled={status === 'ocupado'}
                          title={assento}
                          style={{
                            width: '32px',
                            height: '32px',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: status === 'ocupado' ? 'not-allowed' : 'pointer',
                            background: status === 'ocupado' 
                              ? '#333' 
                              : status === 'selecionado' 
                                ? '#e50914' 
                                : 'rgba(100, 100, 100, 0.5)',
                            color: '#fff',
                            fontSize: '0.7rem',
                            fontWeight: 'bold',
                            transition: 'all 0.2s',
                            transform: status === 'selecionado' ? 'scale(1.1)' : 'scale(1)'
                          }}
                          onMouseEnter={(e) => {
                            if (status !== 'ocupado') {
                              e.currentTarget.style.background = status === 'selecionado' ? '#b81d24' : 'rgba(229, 9, 20, 0.5)';
                            }
                          }}
                          onMouseLeave={(e) => {
                            if (status !== 'ocupado') {
                              e.currentTarget.style.background = status === 'selecionado' ? '#e50914' : 'rgba(100, 100, 100, 0.5)';
                            }
                          }}
                        >
                          {assento.slice(1)}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>

            {/* Resumo */}
            <div className="mt-4 p-3" style={{
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '10px',
              border: '1px solid rgba(229, 9, 20, 0.2)'
            }}>
              <div className="d-flex justify-content-between align-items-center">
                <div>
                  <strong style={{ color: '#fff' }}>Assentos selecionados:</strong>
                  <span style={{ color: '#e50914', marginLeft: '10px' }}>
                    {assentosSelecionados.length > 0 ? assentosSelecionados.join(', ') : 'Nenhum'}
                  </span>
                </div>
                <div>
                  <strong style={{ color: '#fff' }}>Total:</strong>
                  <span style={{ color: '#4CAF50', marginLeft: '10px', fontSize: '1.3rem', fontWeight: 'bold' }}>
                    R$ {calcularTotal().toFixed(2)}
                  </span>
                </div>
              </div>
            </div>

            {/* Botões */}
            <div className="d-flex justify-content-between mt-4">
              <button 
                className="btn"
                onClick={() => navigate('/sessoes')}
                style={{
                  background: 'rgba(100, 100, 100, 0.3)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '10px 30px'
                }}
              >
                ← Voltar
              </button>
              <button 
                className="btn"
                onClick={() => setEtapa('dados')}
                disabled={assentosSelecionados.length === 0}
                style={{
                  background: assentosSelecionados.length === 0 
                    ? 'rgba(100, 100, 100, 0.3)' 
                    : 'linear-gradient(45deg, #e50914, #b81d24)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '10px 30px',
                  fontWeight: 'bold'
                }}
              >
                Continuar →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Etapa 2: Dados do Cliente */}
      {etapa === 'dados' && (
        <div className="card" style={{
          background: 'rgba(30, 30, 50, 0.8)',
          border: '1px solid rgba(229, 9, 20, 0.3)',
          borderRadius: '15px'
        }}>
          <div className="card-body">
            <h4 className="text-center mb-4" style={{ color: '#fff' }}>📝 Dados para o Ingresso</h4>
            
            <div className="row justify-content-center">
              <div className="col-md-6">
                <div className="mb-3">
                  <label style={{ color: '#a0a0a0' }}>Nome Completo</label>
                  <input
                    type="text"
                    className="form-control"
                    value={nomeCliente}
                    onChange={(e) => setNomeCliente(e.target.value)}
                    placeholder="Digite seu nome"
                    style={{
                      background: 'rgba(30, 30, 50, 0.8)',
                      border: '1px solid rgba(229, 9, 20, 0.3)',
                      color: '#fff',
                      borderRadius: '10px'
                    }}
                  />
                </div>
                <div className="mb-3">
                  <label style={{ color: '#a0a0a0' }}>E-mail</label>
                  <input
                    type="email"
                    className="form-control"
                    value={emailCliente}
                    onChange={(e) => setEmailCliente(e.target.value)}
                    placeholder="Digite seu e-mail"
                    style={{
                      background: 'rgba(30, 30, 50, 0.8)',
                      border: '1px solid rgba(229, 9, 20, 0.3)',
                      color: '#fff',
                      borderRadius: '10px'
                    }}
                  />
                </div>
              </div>
            </div>

            {/* Resumo da compra */}
            <div className="mt-4 p-3" style={{
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '10px',
              border: '1px solid rgba(229, 9, 20, 0.2)'
            }}>
              <h5 style={{ color: '#fff' }}>🎟️ Resumo da Compra</h5>
              <hr style={{ borderColor: 'rgba(229, 9, 20, 0.3)' }} />
              <div style={{ color: '#a0a0a0' }}>
                <p><strong>Filme:</strong> {filme.titulo}</p>
                <p><strong>Sessão:</strong> {sessao.data} às {sessao.horario}</p>
                <p><strong>Sala:</strong> {sala.nome}</p>
                <p><strong>Assentos:</strong> {assentosSelecionados.join(', ')}</p>
                <p><strong>Quantidade:</strong> {assentosSelecionados.length} ingresso(s)</p>
                <hr style={{ borderColor: 'rgba(229, 9, 20, 0.3)' }} />
                <p style={{ fontSize: '1.3rem' }}>
                  <strong>Total:</strong> 
                  <span style={{ color: '#4CAF50', marginLeft: '10px', fontWeight: 'bold' }}>
                    R$ {calcularTotal().toFixed(2)}
                  </span>
                </p>
              </div>
            </div>

            {/* Botões */}
            <div className="d-flex justify-content-between mt-4">
              <button 
                className="btn"
                onClick={() => setEtapa('assentos')}
                style={{
                  background: 'rgba(100, 100, 100, 0.3)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '10px 30px'
                }}
              >
                ← Voltar
              </button>
              <button 
                className="btn"
                onClick={finalizarCompra}
                disabled={!nomeCliente || !emailCliente || comprando}
                style={{
                  background: (!nomeCliente || !emailCliente) 
                    ? 'rgba(100, 100, 100, 0.3)' 
                    : 'linear-gradient(45deg, #4CAF50, #45a049)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '10px 30px',
                  fontWeight: 'bold'
                }}
              >
                {comprando ? '⏳ Processando...' : '✅ Finalizar Compra'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Etapa 3: Confirmação */}
      {etapa === 'confirmacao' && ingressoComprado && (
        <div className="card text-center" style={{
          background: 'rgba(30, 30, 50, 0.8)',
          border: '1px solid rgba(76, 175, 80, 0.5)',
          borderRadius: '15px'
        }}>
          <div className="card-body py-5">
            <div style={{ fontSize: '5rem', marginBottom: '1rem' }}>🎉</div>
            <h2 style={{ color: '#4CAF50' }}>Compra Realizada com Sucesso!</h2>
            <p style={{ color: '#a0a0a0' }}>Seus ingressos foram confirmados</p>

            <div className="mt-4 p-4 mx-auto" style={{
              background: 'rgba(0, 0, 0, 0.3)',
              borderRadius: '15px',
              border: '2px dashed rgba(229, 9, 20, 0.5)',
              maxWidth: '400px'
            }}>
              <h4 style={{ color: '#e50914' }}>🎟️ INGRESSO</h4>
              <hr style={{ borderColor: 'rgba(229, 9, 20, 0.3)' }} />
              <div style={{ color: '#fff', textAlign: 'left' }}>
                <p><strong>Código:</strong> #{ingressoComprado.id}</p>
                <p><strong>Filme:</strong> {filme.titulo}</p>
                <p><strong>Data:</strong> {sessao.data}</p>
                <p><strong>Horário:</strong> {sessao.horario}</p>
                <p><strong>Sala:</strong> {sala.nome}</p>
                <p><strong>Assentos:</strong> {assentosSelecionados.join(', ')}</p>
                <p><strong>Cliente:</strong> {nomeCliente}</p>
                <hr style={{ borderColor: 'rgba(229, 9, 20, 0.3)' }} />
                <p style={{ fontSize: '1.2rem', textAlign: 'center' }}>
                  <strong>Total Pago:</strong> 
                  <span style={{ color: '#4CAF50', marginLeft: '10px' }}>
                    R$ {calcularTotal().toFixed(2)}
                  </span>
                </p>
              </div>
            </div>

            <p className="mt-4" style={{ color: '#a0a0a0' }}>
              📧 Um e-mail de confirmação foi enviado para <strong>{emailCliente}</strong>
            </p>

            <div className="mt-4">
              <button 
                className="btn me-3"
                onClick={() => navigate('/')}
                style={{
                  background: 'linear-gradient(45deg, #e50914, #b81d24)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '10px 30px'
                }}
              >
                🏠 Voltar ao Início
              </button>
              <button 
                className="btn"
                onClick={() => navigate('/sessoes')}
                style={{
                  background: 'rgba(100, 100, 100, 0.3)',
                  color: '#fff',
                  border: 'none',
                  borderRadius: '20px',
                  padding: '10px 30px'
                }}
              >
                🎬 Ver Outras Sessões
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
