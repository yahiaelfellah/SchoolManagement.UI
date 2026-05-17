import { postJson } from './client'

export interface LoginResponse {
  token: string
  user: {
    id: string
    username: string
    name: string
    role: string
  }
}

export function loginRequest(username: string, password: string) {
  return postJson<LoginResponse>('/api/Auth/login', { username, password })
}
