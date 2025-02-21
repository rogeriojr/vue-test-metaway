export interface User {
  id: number
  nome: string
  login: string
  senha: string
  tipo: 'ADMIN' | 'USER'
}

export interface Person {
  id: number
  nome: string
  cpf: string
  dataNascimento: Date
  foto: string
}

export interface Contact {
  id: number
  nome: string
  telefone: string
  email: string
  favorito: boolean
  pessoaId: number
}
