import type { TeacherDto } from '@/model/teacher'
import { del, getJson } from './client'

export function fetchTeachers() {
  return getJson<TeacherDto[]>('/api/teacher')
}

export function deleteTeacher(id: string) {
  return del(`/api/teacher/${encodeURIComponent(id)}`)
}
