import { useState, useEffect } from 'react';
import { IFilme, ISala, ISessao, ICombo, IIngresso } from '../models';
import { filmeService, salaService, sessaoService, comboService, ingressoService } from '../services';

/**
 * AdminPage Component - CineMax Theme
 * Página de administração com CRUD completo e formulários intuitivos
 */
export default function AdminPage() {
  // Estados
  const [activeTab, setActiveTab] = useState<'filmes' | 'salas' | 'sessoes' | 'combos' | 'ingressos'>('filmes');
  
  // Filmes
  const [filmes, setFilmes] = useState<IFilme[]>([]);
  const [filmeForm, setFilmeForm] = useState<Partial<IFilme>>({});
  const [editingFilme, setEditingFilme] = useState<string | null>(null);
  const [showFilmeForm, setShowFilmeForm] = useState(false);

  // Salas
  const [salas, setSalas] = useState<ISala[]>([]);
  const [salaForm, setSalaForm] = useState<Partial<ISala>>({});
  const [editingSala, setEditingSala] = useState<string | null>(null);
  const [showSalaForm, setShowSalaForm] = useState(false);

  // Sessões
  const [sessoes, setSessoes] = useState<ISessao[]>([]);
  const [sessaoForm, setSessaoForm] = useState<Partial<ISessao>>({});
  const [editingSessao, setEditingSessao] = useState<string | null>(null);
  const [showSessaoForm, setShowSessaoForm] = useState(false);

  // Combos
  const [combos, setCombos] = useState<ICombo[]>([]);
  const [comboForm, setComboForm] = useState<Partial<ICombo>>({});
  const [editingCombo, setEditingCombo] = useState<string | null>(null);
  const [showComboForm, setShowComboForm] = useState(false);

  // Ingressos
  const [ingressos, setIngressos] = useState<IIngresso[]>([]);

  const [loading, setLoading] = useState(true);

  // Carrega dados iniciais
  useEffect(() => {
    carregarDados();
  }, []);

  const carregarDados = async () => {
    try {
      const [filmesData, salasData, sessoesData, combosData, ingressosData] = await Promise.all([
        filmeService.listar(),
        salaService.listar(),
        sessaoService.listar(),
        comboService.listar(),
        ingressoService.listar()
      ]);
      setFilmes(filmesData);
      setSalas(salasData);
      setSessoes(sessoesData);
      setCombos(combosData);
      setIngressos(ingressosData);
    } catch (error) {
      console.error('Erro ao carregar dados:', error);
    } finally {
      setLoading(false);
    }
  };

  // ===== FILME CRUD =====
  const salvarFilme = async () => {
    if (!filmeForm.titulo || !filmeForm.genero || !filmeForm.duracao) {
      alert('⚠️ Preencha todos os campos obrigatórios marcados com *');
      return;
    }
    try {
      if (editingFilme) {
        await filmeService.atualizar(editingFilme, filmeForm);
      } else {
        await filmeService.criar(filmeForm);
      }
      setFilmeForm({});
      setEditingFilme(null);
      setShowFilmeForm(false);
      carregarDados();
    } catch (error) {
      console.error('Erro ao salvar filme:', error);
    }
  };

  const editarFilme = (filme: IFilme) => {
    setFilmeForm(filme);
    setEditingFilme(filme.id || null);
    setShowFilmeForm(true);
  };

  const deletarFilme = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este filme?')) {
      try {
        await filmeService.deletar(id);
        carregarDados();
      } catch (error) {
        console.error('Erro ao deletar filme:', error);
      }
    }
  };

  const novoFilme = () => {
    setFilmeForm({});
    setEditingFilme(null);
    setShowFilmeForm(true);
  };

  // ===== SALA CRUD =====
  const salvarSala = async () => {
    if (!salaForm.nome || !salaForm.capacidade || !salaForm.tipo) {
      alert('⚠️ Preencha todos os campos obrigatórios marcados com *');
      return;
    }
    try {
      const capacidade = salaForm.capacidade || 80;
      const assentosPorFileira = 10;
      const fileiras = Math.ceil(capacidade / assentosPorFileira);
      
      const salaCompleta = {
        ...salaForm,
        fileiras,
        assentosPorFileira,
        capacidade: fileiras * assentosPorFileira
      };
      
      if (editingSala) {
        await salaService.atualizar(editingSala, salaCompleta);
      } else {
        await salaService.criar(salaCompleta);
      }
      setSalaForm({});
      setEditingSala(null);
      setShowSalaForm(false);
      carregarDados();
    } catch (error) {
      console.error('Erro ao salvar sala:', error);
    }
  };

  const editarSala = (sala: ISala) => {
    setSalaForm(sala);
    setEditingSala(sala.id || null);
    setShowSalaForm(true);
  };

  const deletarSala = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta sala?')) {
      try {
        await salaService.deletar(id);
        carregarDados();
      } catch (error) {
        console.error('Erro ao deletar sala:', error);
      }
    }
  };

  const novaSala = () => {
    setSalaForm({});
    setEditingSala(null);
    setShowSalaForm(true);
  };

  // ===== SESSAO CRUD =====
  const salvarSessao = async () => {
    if (!sessaoForm.filmeId || !sessaoForm.salaId || !sessaoForm.data || !sessaoForm.horario || !sessaoForm.preco) {
      alert('⚠️ Preencha todos os campos obrigatórios marcados com *');
      return;
    }
    try {
      const sessaoCompleta = {
        ...sessaoForm,
        assentosOcupados: sessaoForm.assentosOcupados || []
      };
      
      if (editingSessao) {
        await sessaoService.atualizar(editingSessao, sessaoCompleta);
      } else {
        await sessaoService.criar(sessaoCompleta);
      }
      setSessaoForm({});
      setEditingSessao(null);
      setShowSessaoForm(false);
      carregarDados();
    } catch (error) {
      console.error('Erro ao salvar sessão:', error);
    }
  };

  const editarSessao = (sessao: ISessao) => {
    setSessaoForm(sessao);
    setEditingSessao(sessao.id || null);
    setShowSessaoForm(true);
  };

  const deletarSessao = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta sessão?')) {
      try {
        await sessaoService.deletar(id);
        carregarDados();
      } catch (error) {
        console.error('Erro ao deletar sessão:', error);
      }
    }
  };

  const novaSessao = () => {
    setSessaoForm({});
    setEditingSessao(null);
    setShowSessaoForm(true);
  };

  // ===== COMBO CRUD =====
  const salvarCombo = async () => {
    if (!comboForm.nome || !comboForm.preco || !comboForm.categoria) {
      alert('⚠️ Preencha todos os campos obrigatórios marcados com *');
      return;
    }
    try {
      if (editingCombo) {
        await comboService.atualizar(editingCombo, comboForm);
      } else {
        await comboService.criar(comboForm);
      }
      setComboForm({});
      setEditingCombo(null);
      setShowComboForm(false);
      carregarDados();
    } catch (error) {
      console.error('Erro ao salvar combo:', error);
    }
  };

  const editarCombo = (combo: ICombo) => {
    setComboForm(combo);
    setEditingCombo(combo.id || null);
    setShowComboForm(true);
  };

  const deletarCombo = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir este combo?')) {
      try {
        await comboService.deletar(id);
        carregarDados();
      } catch (error) {
        console.error('Erro ao deletar combo:', error);
      }
    }
  };

  const novoCombo = () => {
    setComboForm({});
    setEditingCombo(null);
    setShowComboForm(true);
  };

  // Cancelar ingresso
  const cancelarIngresso = async (ingresso: IIngresso) => {
    if (confirm('Tem certeza que deseja cancelar este ingresso?')) {
      try {
        await ingressoService.atualizar(ingresso.id!, { ...ingresso, status: 'cancelado' });
        carregarDados();
      } catch (error) {
        console.error('Erro ao cancelar ingresso:', error);
      }
    }
  };

  // Buscar nome do filme/sala
  const getFilmeNome = (id: string) => filmes.find(f => f.id === id)?.titulo || 'N/A';
  const getSalaNome = (id: string) => salas.find(s => s.id === id)?.nome || 'N/A';

  // Estilos
  const inputStyle = {
    background: 'rgba(30, 30, 50, 0.8)',
    border: '1px solid rgba(229, 9, 20, 0.3)',
    color: '#fff',
    borderRadius: '10px',
    padding: '12px 15px'
  };

  const labelStyle = {
    color: '#e50914',
    fontWeight: 'bold' as const,
    marginBottom: '8px',
    display: 'block',
    fontSize: '0.95rem'
  };

  const helperStyle = {
    color: '#888',
    fontSize: '0.8rem',
    marginTop: '4px'
  };

  const btnPrimary = {
    background: 'linear-gradient(45deg, #e50914, #b81d24)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '12px 25px',
    fontWeight: 'bold' as const
  };

  const btnSecondary = {
    background: 'rgba(100, 100, 100, 0.3)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '12px 25px'
  };

  const btnSuccess = {
    background: 'linear-gradient(45deg, #4CAF50, #2E7D32)',
    color: '#fff',
    border: 'none',
    borderRadius: '10px',
    padding: '12px 25px',
    fontWeight: 'bold' as const
  };

  const cardStyle = {
    background: 'rgba(30, 30, 50, 0.9)',
    border: '1px solid rgba(229, 9, 20, 0.3)',
    borderRadius: '15px',
    padding: '25px'
  };

  if (loading) {
    return (
      <div className="container py-5 text-center">
        <div className="spinner-border" style={{ color: '#e50914' }} role="status">
          <span className="visually-hidden">Carregando...</span>
        </div>
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
          ⚙️ Painel Administrativo
        </h1>
        <p style={{ color: '#a0a0a0' }}>Gerencie filmes, salas, sessões e combos do cinema</p>
      </div>

      {/* Tabs */}
      <ul className="nav nav-pills justify-content-center mb-4 flex-wrap gap-2">
        {(['filmes', 'salas', 'sessoes', 'combos', 'ingressos'] as const).map((tab) => (
          <li className="nav-item" key={tab}>
            <button
              className="nav-link"
              onClick={() => setActiveTab(tab)}
              style={activeTab === tab ? btnPrimary : btnSecondary}
            >
              {tab === 'filmes' && '🎬 Filmes'}
              {tab === 'salas' && '🎭 Salas'}
              {tab === 'sessoes' && '📅 Sessões'}
              {tab === 'combos' && '🍿 Combos'}
              {tab === 'ingressos' && '🎟️ Vendas'}
            </button>
          </li>
        ))}
      </ul>

      {/* ===== TAB FILMES ===== */}
      {activeTab === 'filmes' && (
        <div>
          {/* Botão Novo */}
          {!showFilmeForm && (
            <div className="text-center mb-4">
              <button className="btn" onClick={novoFilme} style={btnSuccess}>
                ➕ Cadastrar Novo Filme
              </button>
            </div>
          )}

          {/* Formulário */}
          {showFilmeForm && (
            <div style={cardStyle} className="mb-4">
              <h4 style={{ color: '#fff', marginBottom: '25px', borderBottom: '2px solid #e50914', paddingBottom: '10px' }}>
                {editingFilme ? '✏️ Editar Filme' : '➕ Cadastrar Novo Filme'}
              </h4>
              
              <div className="row g-4">
                {/* Título */}
                <div className="col-md-6">
                  <label style={labelStyle}>📽️ Título do Filme *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Digite o nome completo do filme"
                    value={filmeForm.titulo || ''}
                    onChange={(e) => setFilmeForm({ ...filmeForm, titulo: e.target.value })}
                    style={inputStyle}
                  />
                  <small style={helperStyle}>Exemplo: Vingadores: Ultimato, Barbie, Oppenheimer</small>
                </div>

                {/* Gênero */}
                <div className="col-md-3">
                  <label style={labelStyle}>🎭 Gênero *</label>
                  <select
                    className="form-select"
                    value={filmeForm.genero || ''}
                    onChange={(e) => setFilmeForm({ ...filmeForm, genero: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="">-- Selecione --</option>
                    <option value="Ação">🔥 Ação</option>
                    <option value="Comédia">😂 Comédia</option>
                    <option value="Drama">🎭 Drama</option>
                    <option value="Terror">👻 Terror</option>
                    <option value="Ficção Científica">🚀 Ficção Científica</option>
                    <option value="Animação">🎨 Animação</option>
                    <option value="Romance">❤️ Romance</option>
                    <option value="Aventura">🗺️ Aventura</option>
                    <option value="Suspense">🔍 Suspense</option>
                    <option value="Documentário">📹 Documentário</option>
                  </select>
                  <small style={helperStyle}>Categoria principal do filme</small>
                </div>

                {/* Duração */}
                <div className="col-md-3">
                  <label style={labelStyle}>⏱️ Duração *</label>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="120"
                      min="1"
                      max="500"
                      value={filmeForm.duracao || ''}
                      onChange={(e) => setFilmeForm({ ...filmeForm, duracao: Number(e.target.value) })}
                      style={inputStyle}
                    />
                    <span className="input-group-text" style={{ background: 'rgba(229, 9, 20, 0.3)', color: '#fff', border: 'none' }}>min</span>
                  </div>
                  <small style={helperStyle}>Tempo total em minutos</small>
                </div>

                {/* Diretor */}
                <div className="col-md-4">
                  <label style={labelStyle}>🎬 Diretor</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Nome do diretor"
                    value={filmeForm.diretor || ''}
                    onChange={(e) => setFilmeForm({ ...filmeForm, diretor: e.target.value })}
                    style={inputStyle}
                  />
                  <small style={helperStyle}>Exemplo: Christopher Nolan, Greta Gerwig</small>
                </div>

                {/* Classificação */}
                <div className="col-md-4">
                  <label style={labelStyle}>🔞 Classificação Indicativa *</label>
                  <select
                    className="form-select"
                    value={filmeForm.classificacao || ''}
                    onChange={(e) => setFilmeForm({ ...filmeForm, classificacao: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="">-- Selecione --</option>
                    <option value="L">🟢 L - Livre para todas as idades</option>
                    <option value="10">🟡 10 - Não recomendado para menores de 10 anos</option>
                    <option value="12">🟠 12 - Não recomendado para menores de 12 anos</option>
                    <option value="14">🟠 14 - Não recomendado para menores de 14 anos</option>
                    <option value="16">🔴 16 - Não recomendado para menores de 16 anos</option>
                    <option value="18">⛔ 18 - Não recomendado para menores de 18 anos</option>
                  </select>
                  <small style={helperStyle}>Faixa etária permitida</small>
                </div>

                {/* URL da Imagem */}
                <div className="col-md-4">
                  <label style={labelStyle}>🖼️ Imagem do Poster</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="/posters/nome-do-filme.jpg"
                    value={filmeForm.imagem || ''}
                    onChange={(e) => setFilmeForm({ ...filmeForm, imagem: e.target.value })}
                    style={inputStyle}
                  />
                  <small style={helperStyle}>Caminho da imagem (ex: /posters/aquaman.jpg)</small>
                </div>

                {/* Sinopse */}
                <div className="col-12">
                  <label style={labelStyle}>📝 Sinopse do Filme</label>
                  <textarea
                    className="form-control"
                    placeholder="Escreva um resumo da história do filme..."
                    rows={3}
                    value={filmeForm.sinopse || ''}
                    onChange={(e) => setFilmeForm({ ...filmeForm, sinopse: e.target.value })}
                    style={inputStyle}
                  />
                  <small style={helperStyle}>Breve descrição do enredo para exibir aos clientes</small>
                </div>

                {/* Botões */}
                <div className="col-12">
                  <hr style={{ borderColor: 'rgba(229, 9, 20, 0.3)' }} />
                  <div className="d-flex gap-3">
                    <button className="btn" onClick={salvarFilme} style={btnPrimary}>
                      {editingFilme ? '💾 Salvar Alterações' : '✅ Cadastrar Filme'}
                    </button>
                    <button className="btn" onClick={() => { setShowFilmeForm(false); setFilmeForm({}); setEditingFilme(null); }} style={btnSecondary}>
                      ❌ Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Lista de Filmes */}
          <div style={cardStyle}>
            <h5 style={{ color: '#fff', marginBottom: '15px' }}>📋 Filmes Cadastrados ({filmes.length})</h5>
            {filmes.length === 0 ? (
              <p style={{ color: '#a0a0a0', textAlign: 'center', padding: '40px' }}>Nenhum filme cadastrado ainda. Clique em "Cadastrar Novo Filme" para começar!</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-dark table-hover mb-0">
                  <thead>
                    <tr style={{ borderColor: 'rgba(229, 9, 20, 0.3)' }}>
                      <th>Poster</th>
                      <th>Título</th>
                      <th>Gênero</th>
                      <th>Duração</th>
                      <th>Classif.</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filmes.map((filme) => (
                      <tr key={filme.id} style={{ borderColor: 'rgba(229, 9, 20, 0.2)' }}>
                        <td>
                          <img src={encodeURI(filme.imagem || '')} alt={filme.titulo} style={{ width: '40px', height: '55px', objectFit: 'cover', borderRadius: '5px' }} onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/40x55?text=🎬'} />
                        </td>
                        <td style={{ fontWeight: 'bold' }}>{filme.titulo}</td>
                        <td><span className="badge" style={{ background: '#e50914' }}>{filme.genero}</span></td>
                        <td>{filme.duracao} min</td>
                        <td><span className="badge" style={{ background: filme.classificacao === 'L' ? '#4CAF50' : filme.classificacao === '18' ? '#dc3545' : '#ffc107', color: '#000' }}>{filme.classificacao}</span></td>
                        <td>
                          <button className="btn btn-sm me-2" onClick={() => editarFilme(filme)} style={{ background: '#ffc107', color: '#000' }}>✏️</button>
                          <button className="btn btn-sm" onClick={() => deletarFilme(filme.id!)} style={{ background: '#dc3545', color: '#fff' }}>🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== TAB SALAS ===== */}
      {activeTab === 'salas' && (
        <div>
          {!showSalaForm && (
            <div className="text-center mb-4">
              <button className="btn" onClick={novaSala} style={btnSuccess}>
                ➕ Cadastrar Nova Sala
              </button>
            </div>
          )}

          {showSalaForm && (
            <div style={cardStyle} className="mb-4">
              <h4 style={{ color: '#fff', marginBottom: '25px', borderBottom: '2px solid #e50914', paddingBottom: '10px' }}>
                {editingSala ? '✏️ Editar Sala' : '➕ Cadastrar Nova Sala'}
              </h4>
              
              <div className="row g-4">
                {/* Nome da Sala */}
                <div className="col-md-6">
                  <label style={labelStyle}>🎭 Nome da Sala *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ex: Sala IMAX Premium"
                    value={salaForm.nome || ''}
                    onChange={(e) => setSalaForm({ ...salaForm, nome: e.target.value })}
                    style={inputStyle}
                  />
                  <small style={helperStyle}>Nome identificador único da sala (ex: Sala 1, Sala VIP, Sala IMAX)</small>
                </div>

                {/* Capacidade */}
                <div className="col-md-3">
                  <label style={labelStyle}>🪑 Capacidade *</label>
                  <div className="input-group">
                    <input
                      type="number"
                      className="form-control"
                      placeholder="100"
                      min="10"
                      max="500"
                      value={salaForm.capacidade || ''}
                      onChange={(e) => setSalaForm({ ...salaForm, capacidade: Number(e.target.value) })}
                      style={inputStyle}
                    />
                    <span className="input-group-text" style={{ background: 'rgba(229, 9, 20, 0.3)', color: '#fff', border: 'none' }}>lugares</span>
                  </div>
                  <small style={helperStyle}>Número total de assentos disponíveis</small>
                </div>

                {/* Tipo */}
                <div className="col-md-3">
                  <label style={labelStyle}>🎥 Tipo de Projeção *</label>
                  <select
                    className="form-select"
                    value={salaForm.tipo || ''}
                    onChange={(e) => setSalaForm({ ...salaForm, tipo: e.target.value as '2D' | '3D' })}
                    style={inputStyle}
                  >
                    <option value="">-- Selecione --</option>
                    <option value="2D">📽️ 2D - Projeção Normal</option>
                    <option value="3D">🎥 3D - Projeção Tridimensional</option>
                  </select>
                  <small style={helperStyle}>Tecnologia de exibição da sala</small>
                </div>

                {/* Descrição */}
                <div className="col-12">
                  <label style={labelStyle}>📝 Descrição da Sala</label>
                  <textarea
                    className="form-control"
                    placeholder="Descreva os diferenciais da sala..."
                    rows={2}
                    value={salaForm.descricao || ''}
                    onChange={(e) => setSalaForm({ ...salaForm, descricao: e.target.value })}
                    style={inputStyle}
                  />
                  <small style={helperStyle}>Exemplo: Tela gigante IMAX com som Dolby Atmos e poltronas reclináveis premium</small>
                </div>

                {/* Botões */}
                <div className="col-12">
                  <hr style={{ borderColor: 'rgba(229, 9, 20, 0.3)' }} />
                  <div className="d-flex gap-3">
                    <button className="btn" onClick={salvarSala} style={btnPrimary}>
                      {editingSala ? '💾 Salvar Alterações' : '✅ Cadastrar Sala'}
                    </button>
                    <button className="btn" onClick={() => { setShowSalaForm(false); setSalaForm({}); setEditingSala(null); }} style={btnSecondary}>
                      ❌ Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Lista */}
          <div style={cardStyle}>
            <h5 style={{ color: '#fff', marginBottom: '15px' }}>📋 Salas Cadastradas ({salas.length})</h5>
            {salas.length === 0 ? (
              <p style={{ color: '#a0a0a0', textAlign: 'center', padding: '40px' }}>Nenhuma sala cadastrada ainda. Clique em "Cadastrar Nova Sala" para começar!</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-dark table-hover mb-0">
                  <thead>
                    <tr style={{ borderColor: 'rgba(229, 9, 20, 0.3)' }}>
                      <th>Nome</th>
                      <th>Capacidade</th>
                      <th>Tipo</th>
                      <th>Descrição</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {salas.map((sala) => (
                      <tr key={sala.id} style={{ borderColor: 'rgba(229, 9, 20, 0.2)' }}>
                        <td style={{ fontWeight: 'bold' }}>🎭 {sala.nome}</td>
                        <td>🪑 {sala.capacidade} lugares</td>
                        <td><span className="badge" style={{ background: sala.tipo === '3D' ? '#00bfff' : '#666' }}>{sala.tipo === '3D' ? '🎥 3D' : '📽️ 2D'}</span></td>
                        <td style={{ maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{sala.descricao || '-'}</td>
                        <td>
                          <button className="btn btn-sm me-2" onClick={() => editarSala(sala)} style={{ background: '#ffc107', color: '#000' }}>✏️</button>
                          <button className="btn btn-sm" onClick={() => deletarSala(sala.id!)} style={{ background: '#dc3545', color: '#fff' }}>🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== TAB SESSÕES ===== */}
      {activeTab === 'sessoes' && (
        <div>
          {!showSessaoForm && (
            <div className="text-center mb-4">
              <button className="btn" onClick={novaSessao} style={btnSuccess}>
                ➕ Criar Nova Sessão
              </button>
            </div>
          )}

          {showSessaoForm && (
            <div style={cardStyle} className="mb-4">
              <h4 style={{ color: '#fff', marginBottom: '25px', borderBottom: '2px solid #e50914', paddingBottom: '10px' }}>
                {editingSessao ? '✏️ Editar Sessão' : '➕ Criar Nova Sessão'}
              </h4>
              
              <div className="row g-4">
                {/* Filme */}
                <div className="col-md-6">
                  <label style={labelStyle}>🎬 Selecione o Filme *</label>
                  <select
                    className="form-select"
                    value={sessaoForm.filmeId || ''}
                    onChange={(e) => setSessaoForm({ ...sessaoForm, filmeId: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="">-- Escolha um filme --</option>
                    {filmes.map(f => (
                      <option key={f.id} value={f.id}>🎬 {f.titulo} ({f.duracao}min - {f.genero})</option>
                    ))}
                  </select>
                  <small style={helperStyle}>Filme que será exibido nesta sessão</small>
                </div>

                {/* Sala */}
                <div className="col-md-6">
                  <label style={labelStyle}>🎭 Selecione a Sala *</label>
                  <select
                    className="form-select"
                    value={sessaoForm.salaId || ''}
                    onChange={(e) => setSessaoForm({ ...sessaoForm, salaId: e.target.value })}
                    style={inputStyle}
                  >
                    <option value="">-- Escolha uma sala --</option>
                    {salas.map(s => (
                      <option key={s.id} value={s.id}>🎭 {s.nome} ({s.capacidade} lugares - {s.tipo})</option>
                    ))}
                  </select>
                  <small style={helperStyle}>Sala onde o filme será exibido</small>
                </div>

                {/* Data */}
                <div className="col-md-4">
                  <label style={labelStyle}>📅 Data da Sessão *</label>
                  <input
                    type="date"
                    className="form-control"
                    value={sessaoForm.data || ''}
                    onChange={(e) => setSessaoForm({ ...sessaoForm, data: e.target.value })}
                    style={inputStyle}
                  />
                  <small style={helperStyle}>Data em que a sessão será exibida</small>
                </div>

                {/* Horário */}
                <div className="col-md-4">
                  <label style={labelStyle}>🕐 Horário de Início *</label>
                  <input
                    type="time"
                    className="form-control"
                    value={sessaoForm.horario || ''}
                    onChange={(e) => setSessaoForm({ ...sessaoForm, horario: e.target.value })}
                    style={inputStyle}
                  />
                  <small style={helperStyle}>Horário que o filme começa</small>
                </div>

                {/* Preço */}
                <div className="col-md-4">
                  <label style={labelStyle}>💰 Preço do Ingresso *</label>
                  <div className="input-group">
                    <span className="input-group-text" style={{ background: 'rgba(229, 9, 20, 0.3)', color: '#fff', border: 'none' }}>R$</span>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="35.00"
                      step="0.01"
                      min="0"
                      value={sessaoForm.preco || ''}
                      onChange={(e) => setSessaoForm({ ...sessaoForm, preco: Number(e.target.value) })}
                      style={inputStyle}
                    />
                  </div>
                  <small style={helperStyle}>Valor cobrado por cada ingresso</small>
                </div>

                {/* Botões */}
                <div className="col-12">
                  <hr style={{ borderColor: 'rgba(229, 9, 20, 0.3)' }} />
                  <div className="d-flex gap-3">
                    <button className="btn" onClick={salvarSessao} style={btnPrimary}>
                      {editingSessao ? '💾 Salvar Alterações' : '✅ Criar Sessão'}
                    </button>
                    <button className="btn" onClick={() => { setShowSessaoForm(false); setSessaoForm({}); setEditingSessao(null); }} style={btnSecondary}>
                      ❌ Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Lista */}
          <div style={cardStyle}>
            <h5 style={{ color: '#fff', marginBottom: '15px' }}>📋 Sessões Cadastradas ({sessoes.length})</h5>
            {sessoes.length === 0 ? (
              <p style={{ color: '#a0a0a0', textAlign: 'center', padding: '40px' }}>Nenhuma sessão cadastrada ainda. Cadastre filmes e salas primeiro, depois crie sessões!</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-dark table-hover mb-0">
                  <thead>
                    <tr style={{ borderColor: 'rgba(229, 9, 20, 0.3)' }}>
                      <th>Filme</th>
                      <th>Sala</th>
                      <th>Data</th>
                      <th>Horário</th>
                      <th>Preço</th>
                      <th>Ocupação</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {sessoes.map((sessao) => {
                      const sala = salas.find(s => s.id === sessao.salaId);
                      const ocupados = sessao.assentosOcupados?.length || 0;
                      const capacidade = sala?.capacidade || 0;
                      return (
                        <tr key={sessao.id} style={{ borderColor: 'rgba(229, 9, 20, 0.2)' }}>
                          <td style={{ fontWeight: 'bold' }}>🎬 {getFilmeNome(sessao.filmeId)}</td>
                          <td>🎭 {getSalaNome(sessao.salaId)}</td>
                          <td>📅 {sessao.data}</td>
                          <td>🕐 {sessao.horario}</td>
                          <td style={{ color: '#4CAF50', fontWeight: 'bold' }}>R$ {Number(sessao.preco).toFixed(2)}</td>
                          <td>
                            <span style={{ color: ocupados > capacidade * 0.8 ? '#dc3545' : '#4CAF50' }}>
                              {ocupados}/{capacidade}
                            </span>
                          </td>
                          <td>
                            <button className="btn btn-sm me-2" onClick={() => editarSessao(sessao)} style={{ background: '#ffc107', color: '#000' }}>✏️</button>
                            <button className="btn btn-sm" onClick={() => deletarSessao(sessao.id!)} style={{ background: '#dc3545', color: '#fff' }}>🗑️</button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== TAB COMBOS ===== */}
      {activeTab === 'combos' && (
        <div>
          {!showComboForm && (
            <div className="text-center mb-4">
              <button className="btn" onClick={novoCombo} style={btnSuccess}>
                ➕ Cadastrar Novo Produto
              </button>
            </div>
          )}

          {showComboForm && (
            <div style={cardStyle} className="mb-4">
              <h4 style={{ color: '#fff', marginBottom: '25px', borderBottom: '2px solid #e50914', paddingBottom: '10px' }}>
                {editingCombo ? '✏️ Editar Produto' : '➕ Cadastrar Novo Produto'}
              </h4>
              
              <div className="row g-4">
                {/* Nome */}
                <div className="col-md-6">
                  <label style={labelStyle}>🍿 Nome do Produto *</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Ex: Combo Família"
                    value={comboForm.nome || ''}
                    onChange={(e) => setComboForm({ ...comboForm, nome: e.target.value })}
                    style={inputStyle}
                  />
                  <small style={helperStyle}>Nome que será exibido no cardápio para os clientes</small>
                </div>

                {/* Categoria */}
                <div className="col-md-3">
                  <label style={labelStyle}>📦 Categoria *</label>
                  <select
                    className="form-select"
                    value={comboForm.categoria || ''}
                    onChange={(e) => setComboForm({ ...comboForm, categoria: e.target.value as 'combo' | 'pipoca' | 'bebida' | 'doce' })}
                    style={inputStyle}
                  >
                    <option value="">-- Selecione --</option>
                    <option value="combo">🎁 Combo (conjunto de produtos)</option>
                    <option value="pipoca">🍿 Pipoca</option>
                    <option value="bebida">🥤 Bebida</option>
                    <option value="doce">🍫 Doce/Snack</option>
                  </select>
                  <small style={helperStyle}>Tipo de produto para organização</small>
                </div>

                {/* Preço */}
                <div className="col-md-3">
                  <label style={labelStyle}>💰 Preço *</label>
                  <div className="input-group">
                    <span className="input-group-text" style={{ background: 'rgba(229, 9, 20, 0.3)', color: '#fff', border: 'none' }}>R$</span>
                    <input
                      type="number"
                      className="form-control"
                      placeholder="25.00"
                      step="0.01"
                      min="0"
                      value={comboForm.preco || ''}
                      onChange={(e) => setComboForm({ ...comboForm, preco: Number(e.target.value) })}
                      style={inputStyle}
                    />
                  </div>
                  <small style={helperStyle}>Valor de venda do produto</small>
                </div>

                {/* Descrição */}
                <div className="col-md-8">
                  <label style={labelStyle}>📝 Descrição do Produto</label>
                  <textarea
                    className="form-control"
                    placeholder="Descreva o que está incluído no produto..."
                    rows={2}
                    value={comboForm.descricao || ''}
                    onChange={(e) => setComboForm({ ...comboForm, descricao: e.target.value })}
                    style={inputStyle}
                  />
                  <small style={helperStyle}>Exemplo: Pipoca grande + 2 refrigerantes médios + chocolate</small>
                </div>

                {/* Imagem */}
                <div className="col-md-4">
                  <label style={labelStyle}>🖼️ Imagem do Produto</label>
                  <input
                    type="text"
                    className="form-control"
                    placeholder="/posters/combo.jpg"
                    value={comboForm.imagem || ''}
                    onChange={(e) => setComboForm({ ...comboForm, imagem: e.target.value })}
                    style={inputStyle}
                  />
                  <small style={helperStyle}>Caminho da foto do produto (opcional)</small>
                </div>

                {/* Botões */}
                <div className="col-12">
                  <hr style={{ borderColor: 'rgba(229, 9, 20, 0.3)' }} />
                  <div className="d-flex gap-3">
                    <button className="btn" onClick={salvarCombo} style={btnPrimary}>
                      {editingCombo ? '💾 Salvar Alterações' : '✅ Cadastrar Produto'}
                    </button>
                    <button className="btn" onClick={() => { setShowComboForm(false); setComboForm({}); setEditingCombo(null); }} style={btnSecondary}>
                      ❌ Cancelar
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Lista */}
          <div style={cardStyle}>
            <h5 style={{ color: '#fff', marginBottom: '15px' }}>📋 Produtos Cadastrados ({combos.length})</h5>
            {combos.length === 0 ? (
              <p style={{ color: '#a0a0a0', textAlign: 'center', padding: '40px' }}>Nenhum produto cadastrado ainda. Clique em "Cadastrar Novo Produto" para começar!</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-dark table-hover mb-0">
                  <thead>
                    <tr style={{ borderColor: 'rgba(229, 9, 20, 0.3)' }}>
                      <th>Imagem</th>
                      <th>Nome</th>
                      <th>Categoria</th>
                      <th>Descrição</th>
                      <th>Preço</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {combos.map((combo) => (
                      <tr key={combo.id} style={{ borderColor: 'rgba(229, 9, 20, 0.2)' }}>
                        <td>
                          <img src={encodeURI(combo.imagem || '')} alt={combo.nome} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: '8px' }} onError={(e) => e.currentTarget.src = 'https://via.placeholder.com/50?text=🍿'} />
                        </td>
                        <td style={{ fontWeight: 'bold' }}>{combo.nome}</td>
                        <td>
                          <span className="badge" style={{ 
                            background: combo.categoria === 'combo' ? '#e50914' : 
                                       combo.categoria === 'pipoca' ? '#ffc107' : 
                                       combo.categoria === 'bebida' ? '#00bfff' : '#4CAF50',
                            color: combo.categoria === 'pipoca' ? '#000' : '#fff'
                          }}>
                            {combo.categoria === 'combo' && '🎁 Combo'}
                            {combo.categoria === 'pipoca' && '🍿 Pipoca'}
                            {combo.categoria === 'bebida' && '🥤 Bebida'}
                            {combo.categoria === 'doce' && '🍫 Doce'}
                          </span>
                        </td>
                        <td style={{ maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{combo.descricao || '-'}</td>
                        <td style={{ color: '#4CAF50', fontWeight: 'bold' }}>R$ {combo.preco.toFixed(2)}</td>
                        <td>
                          <button className="btn btn-sm me-2" onClick={() => editarCombo(combo)} style={{ background: '#ffc107', color: '#000' }}>✏️</button>
                          <button className="btn btn-sm" onClick={() => deletarCombo(combo.id!)} style={{ background: '#dc3545', color: '#fff' }}>🗑️</button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ===== TAB INGRESSOS/VENDAS ===== */}
      {activeTab === 'ingressos' && (
        <div>
          <div style={cardStyle}>
            <div className="d-flex justify-content-between align-items-center flex-wrap gap-3 mb-4">
              <h5 style={{ color: '#fff', margin: 0 }}>🎟️ Vendas de Ingressos ({ingressos.length})</h5>
              <div className="d-flex gap-2">
                <span className="badge" style={{ background: '#4CAF50', padding: '10px 20px', fontSize: '1rem' }}>
                  💰 Total Vendido: R$ {ingressos.filter(i => i.status === 'confirmado').reduce((acc, i) => acc + i.total, 0).toFixed(2)}
                </span>
              </div>
            </div>
            
            {ingressos.length === 0 ? (
              <p style={{ color: '#a0a0a0', textAlign: 'center', padding: '40px' }}>Nenhum ingresso vendido ainda. As vendas aparecerão aqui automaticamente.</p>
            ) : (
              <div className="table-responsive">
                <table className="table table-dark table-hover mb-0">
                  <thead>
                    <tr style={{ borderColor: 'rgba(229, 9, 20, 0.3)' }}>
                      <th>Cliente</th>
                      <th>Email</th>
                      <th>Filme/Sessão</th>
                      <th>Assentos</th>
                      <th>Total</th>
                      <th>Status</th>
                      <th>Ações</th>
                    </tr>
                  </thead>
                  <tbody>
                    {ingressos.map((ingresso) => {
                      const sessao = sessoes.find(s => s.id === ingresso.sessaoId);
                      return (
                        <tr key={ingresso.id} style={{ borderColor: 'rgba(229, 9, 20, 0.2)' }}>
                          <td style={{ fontWeight: 'bold' }}>{ingresso.nomeCliente}</td>
                          <td style={{ fontSize: '0.85rem', color: '#a0a0a0' }}>{ingresso.emailCliente}</td>
                          <td>
                            <div>🎬 {sessao ? getFilmeNome(sessao.filmeId) : 'N/A'}</div>
                            <small style={{ color: '#a0a0a0' }}>📅 {sessao?.data} às {sessao?.horario}</small>
                          </td>
                          <td>
                            {ingresso.assentos.map(a => (
                              <span key={a} className="badge me-1" style={{ background: 'rgba(229, 9, 20, 0.3)', color: '#e50914' }}>{a}</span>
                            ))}
                          </td>
                          <td style={{ color: '#4CAF50', fontWeight: 'bold' }}>R$ {ingresso.total.toFixed(2)}</td>
                          <td>
                            <span className="badge" style={{ 
                              background: ingresso.status === 'confirmado' ? '#4CAF50' : 
                                         ingresso.status === 'cancelado' ? '#dc3545' : '#ffc107',
                              padding: '8px 12px'
                            }}>
                              {ingresso.status === 'confirmado' ? '✅ Confirmado' : 
                               ingresso.status === 'cancelado' ? '❌ Cancelado' : '⏳ Pendente'}
                            </span>
                          </td>
                          <td>
                            {ingresso.status === 'confirmado' && (
                              <button className="btn btn-sm" onClick={() => cancelarIngresso(ingresso)} style={{ background: '#dc3545', color: '#fff' }}>
                                ❌ Cancelar
                              </button>
                            )}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
