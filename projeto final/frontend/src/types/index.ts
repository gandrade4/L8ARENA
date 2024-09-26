export type User = {
  id: number
  name: string
  username: string
  password: string
  email: string
  role: Role
}

export type Quadra = {
  id: number
  modalidade: string
}

export type Role = {
  id: number
  name: string
}

export interface ApplicationError {
  name: string,
  message: string,
}

