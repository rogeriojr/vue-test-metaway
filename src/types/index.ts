export interface User {
  id: number
  username: string
  nome: string
  cpf: string
  email: string
  telefone: string
  dataNascimento: string
  password: string
  tipos: string[]
}

export interface Endereco {
  id?: number
  cep: string
  logradouro: string
  numero: number
  bairro: string
  cidade: string
  estado: string
  pais: string
}

export interface Foto {
  id: string
  name: string
  type: string
  url: string
}

export interface Person {
  id: number
  nome: string
  cpf: string
  endereco: Endereco
  foto?: Foto
}

export interface Contato {
  id?: number
  telefone?: string
  nome?: string
  email?: string
  tipoContato?: 'CELULAR' | 'EMAIL' | 'OUTRO'
  tag?: string
  privado?: boolean
  pessoa?: Person
  usuario?: User
  favorito?: boolean
}

export interface AuthResponse {
  accessToken: string
  tokenType: string
  id: number
  username: string
  tipos: string[]
}
