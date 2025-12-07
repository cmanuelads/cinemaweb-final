
# 🎬 CineMax — Sistema de Gestão de Cinema

Aplicação web desenvolvida em **React + Vite + TypeScript** para gerenciar filmes, salas, sessões e vendas de ingressos.  
Este projeto também utiliza **JSON Server** como backend fake para simular uma API REST completa.

---

## 🚀 Tecnologias Utilizadas

- **React + Vite** (Frontend)
- **TypeScript**
- **React Router DOM**
- **Bootstrap**
- **Bootstrap Icons**
- **Zod** (validação)
- **JSON Server** (simulação de API)
- **Axios** (consumo da API)

---

## 🛠️ Como Rodar o Projeto

### 1. Instalar dependências

```
npm install
```

### 2. Rodar o frontend

```
npm run dev
```

Acesse: http://localhost:5173

### 3. Rodar o backend JSON Server

```
npx json-server --watch db.json --port 3000
```

API disponível em: http://localhost:3000

Rotas:
- /filmes
- /salas
- /sessoes
- /combos
- /ingressos
- /historico

---

## 📌 Funcionalidades

### 🎞️ Filmes
- Cadastro
- Listagem
- Exclusão
- Validações com Zod

### 🏟️ Salas
- Cadastro de salas

### 🕒 Sessões
- Agendamento
- Seleção de Filme/Sala
- Validação de datas futuras

### 🍿 Combos
- Listagem e cadastro

### 🎟️ Venda de Ingressos
- Inteira / Meia
- Cálculo automático
- Registro no histórico

---

## 📜 Histórico
- Lista de ingressos vendidos

---

## 🧪 Validações com Zod

### Filmes
- Título obrigatório  
- Sinopse >= 10 caracteres  
- Duração > 0  

### Sessões
- Selecionar filme e sala  
- Data não pode ser retroativa  

---

## 👩‍💻 Sobre
Projeto desenvolvido para fins acadêmicos na disciplina de Desenvolvimento Web Frontend.
