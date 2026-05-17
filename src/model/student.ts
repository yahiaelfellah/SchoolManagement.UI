/** Mirrors `Student` JSON from the API (camelCase). */
export interface StudentDto {
  id: string
  firstName?: string
  lastName?: string
  dateOfBirthday: string
  gender: 'Male' | 'Female'
  address?: string
  createdAt?: string
  updatedAt?: string
}

/** Legacy shape used by enrollment UI until it is wired to the API. */
export default interface Student {
  id: number
  firstName: string
  lastName: string
  dateofBirth?: string
  gender?: string
  address?: string
}
