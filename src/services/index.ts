const API_URL = 'http://localhost:4001';

// ===== FILME SERVICE =====
export const filmeService = {
  async listar() {
    const res = await fetch(`${API_URL}/filmes`);
    return res.json();
  },
  async criar(filme: any) {
    const res = await fetch(`${API_URL}/filmes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filme),
    });
    return res.json();
  },
  async atualizar(id: string, filme: any) {
    const res = await fetch(`${API_URL}/filmes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(filme),
    });
    return res.json();
  },
  async deletar(id: string) {
    await fetch(`${API_URL}/filmes/${id}`, { method: 'DELETE' });
  },
};

// ===== SALA SERVICE =====
export const salaService = {
  async listar() {
    const res = await fetch(`${API_URL}/salas`);
    return res.json();
  },
  async criar(sala: any) {
    const res = await fetch(`${API_URL}/salas`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sala),
    });
    return res.json();
  },
  async atualizar(id: string, sala: any) {
    const res = await fetch(`${API_URL}/salas/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sala),
    });
    return res.json();
  },
  async deletar(id: string) {
    await fetch(`${API_URL}/salas/${id}`, { method: 'DELETE' });
  },
};

// ===== SESSAO SERVICE =====
export const sessaoService = {
  async listar() {
    const res = await fetch(`${API_URL}/sessoes`);
    return res.json();
  },
  async criar(sessao: any) {
    const res = await fetch(`${API_URL}/sessoes`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sessao),
    });
    return res.json();
  },
  async atualizar(id: string, sessao: any) {
    const res = await fetch(`${API_URL}/sessoes/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(sessao),
    });
    return res.json();
  },
  async deletar(id: string) {
    await fetch(`${API_URL}/sessoes/${id}`, { method: 'DELETE' });
  },
};

// ===== COMBO SERVICE =====
export const comboService = {
  async listar() {
    const res = await fetch(`${API_URL}/combos`);
    return res.json();
  },
  async criar(combo: any) {
    const res = await fetch(`${API_URL}/combos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(combo),
    });
    return res.json();
  },
  async atualizar(id: string, combo: any) {
    const res = await fetch(`${API_URL}/combos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(combo),
    });
    return res.json();
  },
  async deletar(id: string) {
    await fetch(`${API_URL}/combos/${id}`, { method: 'DELETE' });
  },
};

// ===== INGRESSO SERVICE =====
export const ingressoService = {
  async listar() {
    const res = await fetch(`${API_URL}/ingressos`);
    return res.json();
  },
  async buscarPorId(id: string) {
    const res = await fetch(`${API_URL}/ingressos/${id}`);
    return res.json();
  },
  async criar(ingresso: any) {
    const res = await fetch(`${API_URL}/ingressos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ingresso),
    });
    return res.json();
  },
  async atualizar(id: string, ingresso: any) {
    const res = await fetch(`${API_URL}/ingressos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(ingresso),
    });
    return res.json();
  },
  async deletar(id: string) {
    await fetch(`${API_URL}/ingressos/${id}`, { method: 'DELETE' });
  },
};

// ===== COMPRA COMBO SERVICE =====
export const compraComboService = {
  async listar() {
    const res = await fetch(`${API_URL}/comprasCombos`);
    return res.json();
  },
  async buscarPorId(id: string) {
    const res = await fetch(`${API_URL}/comprasCombos/${id}`);
    return res.json();
  },
  async criar(compra: any) {
    const res = await fetch(`${API_URL}/comprasCombos`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(compra),
    });
    return res.json();
  },
  async atualizar(id: string, compra: any) {
    const res = await fetch(`${API_URL}/comprasCombos/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(compra),
    });
    return res.json();
  },
  async deletar(id: string) {
    await fetch(`${API_URL}/comprasCombos/${id}`, { method: 'DELETE' });
  },
};
