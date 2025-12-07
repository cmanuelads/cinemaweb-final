import { z } from 'zod';

export interface IFilme {
  id?: string;
  titulo: string;
  genero: string;
  duracao: number;
  classificacao: string;
  sinopse: string;
  imagem: string;
  diretor: string;
}

export const filmeSchema = z.object({
  titulo: z.string().min(1, 'Título obrigatório'),
  genero: z.string().min(1, 'Gênero obrigatório'),
  duracao: z.number().min(1, 'Duração deve ser maior que 0'),
  classificacao: z.string().min(1, 'Classificação obrigatória'),
  sinopse: z.string().min(5, 'Sinopse deve ter pelo menos 5 caracteres'),
  imagem: z.string().min(1, 'Imagem obrigatória'),
  diretor: z.string().min(1, 'Diretor obrigatório'),
});

export interface ISala {
  id?: string;
  nome: string;
  capacidade: number;
  tipo: '2D' | '3D';
  fileiras: number;
  assentosPorFileira: number;
  descricao: string;
}

export interface ISessao {
  id?: string;
  filmeId: string;
  salaId: string;
  horario: string;
  data: string;
  preco: number;
  assentosOcupados: string[];
}

export interface ICombo {
  id?: string;
  nome: string;
  descricao: string;
  preco: number;
  imagem: string;
  categoria: 'pipoca' | 'bebida' | 'doce' | 'combo';
}

export interface IIngresso {
  id?: string;
  sessaoId: string;
  assentos: string[];
  nomeCliente: string;
  emailCliente: string;
  total: number;
  dataCompra: string;
  status: 'confirmado' | 'cancelado' | 'pendente';
}

export interface ICompraCombo {
  id?: string;
  comboId: string;
  quantidade: number;
  nomeCliente: string;
  emailCliente: string;
  total: number;
  dataCompra: string;
  status: 'confirmado' | 'cancelado' | 'pendente';
}

export interface IUsuario {
  id?: string;
  nome: string;
  email: string;
  senha: string;
}
