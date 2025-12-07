import { useEffect, useState } from 'react';
import { ICombo, ICompraCombo } from '../models';
import { comboService, compraComboService } from '../services';

/**
 * CombosPage Component - CineMax Theme
 * Página de listagem de combos com carrinho e compra
 */
export default function CombosPage() {
  const [combos, setCombos] = useState<ICombo[]>([]);
  const [carrinho, setCarrinho] = useState<{ combo: ICombo; quantidade: number }[]>([]);
  const [loading, setLoading] = useState(true);
  const [mostrarCheckout, setMostrarCheckout] = useState(false);
  const [nomeCliente, setNomeCliente] = useState('');
  const [emailCliente, setEmailCliente] = useState('');
  const [finalizando, setFinalizando] = useState(false);
  const [compraFinalizada, setCompraFinalizada] = useState(false);

  useEffect(() => {
    carregarCombos();
  }, []);

  const carregarCombos = async () => {
    try {
      const data = await comboService.listar();
      setCombos(data);
    } catch (error) {
      console.error('Erro ao carregar combos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Adiciona combo ao carrinho
  const adicionarAoCarrinho = (combo: ICombo) => {
    setCarrinho(prev => {
      const existe = prev.find(item => item.combo.id === combo.id);
      if (existe) {
        return prev.map(item =>
          item.combo.id === combo.id
            ? { ...item, quantidade: item.quantidade + 1 }
            : item
        );
      }
      return [...prev, { combo, quantidade: 1 }];
    });
  };

  // Remove combo do carrinho
  const removerDoCarrinho = (comboId: string) => {
    setCarrinho(prev => {
      const item = prev.find(i => i.combo.id === comboId);
      if (item && item.quantidade > 1) {
        return prev.map(i =>
          i.combo.id === comboId
            ? { ...i, quantidade: i.quantidade - 1 }
            : i
        );
      }
      return prev.filter(i => i.combo.id !== comboId);
    });
  };

  // Calcula total do carrinho
  const calcularTotal = () => {
    return carrinho.reduce((acc, item) => acc + item.combo.preco * item.quantidade, 0);
  };

  // Finaliza a compra
  const finalizarCompra = async () => {
    if (!nomeCliente || !emailCliente) {
      alert('Preencha todos os dados!');
      return;
    }

    setFinalizando(true);
    
    try {
      // Salva cada item do carrinho como uma compra separada
      for (const item of carrinho) {
        const novaCompra: Omit<ICompraCombo, 'id'> = {
          comboId: item.combo.id!,
          quantidade: item.quantidade,
          nomeCliente,
          emailCliente,
          total: item.combo.preco * item.quantidade,
          dataCompra: new Date().toISOString(),
          status: 'confirmado'
        };
        await compraComboService.criar(novaCompra);
      }
      
      setCompraFinalizada(true);
      setCarrinho([]);
      setNomeCliente('');
      setEmailCliente('');
      setMostrarCheckout(false);
    } catch (error) {
      console.error('Erro ao finalizar compra:', error);
      alert('Erro ao processar compra. Tente novamente.');
    } finally {
      setFinalizando(false);
    }
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" style={{ color: '#e50914' }} role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
        <p className="mt-3" style={{ color: '#a0a0a0' }}>Carregando combos...</p>
      </div>
    );
  }

  return (
    <div className="container py-5">
      <div className="row">
        {/* Lista de Combos */}
        <div className="col-lg-8">
          {/* Header */}
          <div className="text-center mb-5">
            <h1 style={{
              fontSize: '2.5rem',
              fontWeight: 'bold',
              background: 'linear-gradient(45deg, #e50914, #ff6b6b)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent'
            }}>
              🍿 Combos e Lanches
            </h1>
            <p style={{ color: '#a0a0a0' }}>Complete sua experiência cinematográfica</p>
          </div>

          {combos.length === 0 ? (
            <div className="text-center py-5">
              <div style={{ fontSize: '4rem', marginBottom: '1rem' }}>🍿</div>
              <h3 style={{ color: '#fff' }}>Nenhum combo disponível</h3>
              <p style={{ color: '#a0a0a0' }}>Em breve teremos novidades!</p>
            </div>
          ) : (
            <div className="row g-4">
              {combos.map((combo) => (
                <div key={combo.id} className="col-md-6">
                  <div className="card h-100" style={{
                    background: 'rgba(30, 30, 50, 0.8)',
                    border: '1px solid rgba(229, 9, 20, 0.3)',
                    borderRadius: '15px',
                    overflow: 'hidden',
                    transition: 'all 0.3s ease'
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 10px 30px rgba(229, 9, 20, 0.3)';
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'scale(1)';
                    e.currentTarget.style.boxShadow = 'none';
                  }}>
                    {/* Imagem */}
                    <div style={{
                      height: '200px',
                      background: `url(${combo.imagem}) center/cover no-repeat`,
                      position: 'relative'
                    }}>
                      <div style={{
                        position: 'absolute',
                        top: '10px',
                        right: '10px',
                        background: '#e50914',
                        color: '#fff',
                        padding: '5px 15px',
                        borderRadius: '20px',
                        fontWeight: 'bold'
                      }}>
                        R$ {combo.preco.toFixed(2)}
                      </div>
                    </div>

                    {/* Info */}
                    <div className="card-body">
                      <h5 className="card-title" style={{ color: '#fff', fontWeight: 'bold' }}>
                        {combo.nome}
                      </h5>
                      <p className="card-text" style={{ color: '#a0a0a0', fontSize: '0.9rem' }}>
                        {combo.descricao}
                      </p>
                    </div>

                    {/* Footer */}
                    <div className="card-footer" style={{
                      background: 'transparent',
                      borderTop: '1px solid rgba(229, 9, 20, 0.2)'
                    }}>
                      <button
                        className="btn w-100"
                        onClick={() => adicionarAoCarrinho(combo)}
                        style={{
                          background: 'linear-gradient(45deg, #e50914, #b81d24)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '20px',
                          fontWeight: 'bold'
                        }}
                      >
                        ➕ Adicionar ao Carrinho
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Carrinho */}
        <div className="col-lg-4">
          <div className="sticky-top" style={{ top: '100px' }}>
            <div className="card" style={{
              background: 'rgba(30, 30, 50, 0.9)',
              border: '1px solid rgba(229, 9, 20, 0.5)',
              borderRadius: '15px'
            }}>
              <div className="card-header" style={{
                background: 'linear-gradient(45deg, #e50914, #b81d24)',
                borderRadius: '15px 15px 0 0'
              }}>
                <h5 className="mb-0 text-center" style={{ color: '#fff' }}>
                  🛒 Carrinho
                </h5>
              </div>
              <div className="card-body">
                {carrinho.length === 0 ? (
                  <p className="text-center" style={{ color: '#a0a0a0' }}>
                    Seu carrinho está vazio
                  </p>
                ) : (
                  <>
                    {carrinho.map((item) => (
                      <div
                        key={item.combo.id}
                        className="d-flex justify-content-between align-items-center mb-3 p-2"
                        style={{
                          background: 'rgba(255, 255, 255, 0.05)',
                          borderRadius: '10px'
                        }}
                      >
                        <div>
                          <span style={{ color: '#fff', fontWeight: 'bold' }}>
                            {item.combo.nome}
                          </span>
                          <br />
                          <small style={{ color: '#a0a0a0' }}>
                            {item.quantidade}x R$ {item.combo.preco.toFixed(2)}
                          </small>
                        </div>
                        <div className="d-flex align-items-center gap-2">
                          <button
                            className="btn btn-sm"
                            onClick={() => removerDoCarrinho(item.combo.id)}
                            style={{
                              background: 'rgba(229, 9, 20, 0.2)',
                              color: '#e50914',
                              border: 'none'
                            }}
                          >
                            ➖
                          </button>
                          <span style={{ color: '#fff', fontWeight: 'bold' }}>
                            {item.quantidade}
                          </span>
                          <button
                            className="btn btn-sm"
                            onClick={() => adicionarAoCarrinho(item.combo)}
                            style={{
                              background: 'rgba(229, 9, 20, 0.2)',
                              color: '#e50914',
                              border: 'none'
                            }}
                          >
                            ➕
                          </button>
                        </div>
                      </div>
                    ))}

                    {/* Total */}
                    <hr style={{ borderColor: 'rgba(229, 9, 20, 0.3)' }} />
                    <div className="d-flex justify-content-between align-items-center">
                      <h5 style={{ color: '#fff' }}>Total:</h5>
                      <h4 style={{ color: '#4CAF50', fontWeight: 'bold' }}>
                        R$ {calcularTotal().toFixed(2)}
                      </h4>
                    </div>

                    {!mostrarCheckout ? (
                      <button
                        className="btn w-100 mt-3"
                        onClick={() => setMostrarCheckout(true)}
                        style={{
                          background: 'linear-gradient(45deg, #4CAF50, #2E7D32)',
                          color: '#fff',
                          border: 'none',
                          borderRadius: '20px',
                          fontWeight: 'bold',
                          padding: '12px'
                        }}
                      >
                        ✅ Finalizar Pedido
                      </button>
                    ) : (
                      <div className="mt-3">
                        <input
                          type="text"
                          className="form-control mb-2"
                          placeholder="Seu nome"
                          value={nomeCliente}
                          onChange={(e) => setNomeCliente(e.target.value)}
                          style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(229, 9, 20, 0.3)',
                            color: '#fff',
                            borderRadius: '10px'
                          }}
                        />
                        <input
                          type="email"
                          className="form-control mb-3"
                          placeholder="Seu email"
                          value={emailCliente}
                          onChange={(e) => setEmailCliente(e.target.value)}
                          style={{
                            background: 'rgba(255, 255, 255, 0.1)',
                            border: '1px solid rgba(229, 9, 20, 0.3)',
                            color: '#fff',
                            borderRadius: '10px'
                          }}
                        />
                        <div className="d-flex gap-2">
                          <button
                            className="btn flex-grow-1"
                            onClick={() => setMostrarCheckout(false)}
                            style={{
                              background: 'rgba(100, 100, 100, 0.5)',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '20px'
                            }}
                          >
                            Voltar
                          </button>
                          <button
                            className="btn flex-grow-1"
                            onClick={finalizarCompra}
                            disabled={finalizando}
                            style={{
                              background: 'linear-gradient(45deg, #4CAF50, #2E7D32)',
                              color: '#fff',
                              border: 'none',
                              borderRadius: '20px',
                              fontWeight: 'bold'
                            }}
                          >
                            {finalizando ? '⏳ Processando...' : '✅ Confirmar'}
                          </button>
                        </div>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            {/* Mensagem de Sucesso */}
            {compraFinalizada && (
              <div className="mt-3 p-3 text-center" style={{
                background: 'rgba(76, 175, 80, 0.2)',
                borderRadius: '15px',
                border: '1px solid rgba(76, 175, 80, 0.5)'
              }}>
                <h5 style={{ color: '#4CAF50' }}>🎉 Compra realizada!</h5>
                <p style={{ color: '#a0a0a0', margin: 0 }}>
                  Consulte o histórico para ver seus pedidos
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
