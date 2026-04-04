import type { TeacherDto } from '@/model/teacher'
import { del, getJson } from './client'

export function fetchTeachers() {
  return getJson<TeacherDto[]>('/api/Teacher')
}

export function deleteTeacher(id: string) {
  return del(`/api/Teacher/${encodeURIComponent(id)}`)
}
