/** Mirrors `Teacher` (+ base `User`) JSON from the API. */
export interface TeacherDto {
  id: string
  username?: string
  firstName?: string
  lastName?: string
  phoneNumber?: string
  address?: string
  salary?: number
  gender: 'Male' | 'Female'
  createdAt?: string
  updatedAt?: string
}
