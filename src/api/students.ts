import type { StudentDto } from '@/model/student'
import { del, getJson } from './client'

export function fetchStudents() {
  return getJson<StudentDto[]>('/api/Student')
}

export function fetchStudentById(id: string) {
  return getJson<StudentDto>(`/api/Student/${encodeURIComponent(id)}`)
}

export function deleteStudent(id: string) {
  return del(`/api/Student/${encodeURIComponent(id)}`)
}
