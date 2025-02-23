export interface User {
  id: number
  username: string
  nome: string
  cpf: string
  email: string
  telefone: string
  dataNascimento: string
  password?: string
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
  url?: string
}

export interface Person {
  id: number
  nome: string
  cpf: string
  endereco: Endereco
  foto?: Foto
}

export interface Contato {
  id: number
  pessoa: {
    id: number
    nome: string
    endereco?: {
      logradouro: string
      numero: string
      bairro: string
      cidade: string
      estado: string
      cep: string
      pais: string
    }
    foto?: {
      id: string
      name: string
      type: string
    }
  }
  tag: string
  email?: string
  telefone?: string
  tipoContato: 'CELULAR' | 'TELEFONE' | 'EMAIL'
  privado: boolean
  usuario: {
    id: number
    username: string
  }
  photoUrl?: string
}

export interface AuthResponse {
  accessToken: string
  tokenType: string
  id: number
  username: string
  tipos: string[]
}

export interface ApiResponse<T> {
  message: string
  object: T
}

export interface PersonsStore {
  searchTerm: string
  persons: Person[]
  loading: boolean
  fetchPersons: () => Promise<void>
  savePerson: (person: Partial<Person>) => Promise<void>
  deletePerson: (id: string) => Promise<void>
  uploadPhoto: (id: string, file: File) => Promise<void>
}

export interface FavoritoRequest {
  contatoId: number
  usuarioId: number
}
