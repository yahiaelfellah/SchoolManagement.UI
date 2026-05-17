import { defineStore } from 'pinia'
import { ref } from 'vue'
import * as teachersApi from '@/api/teachers'
import type { TeacherDto } from '@/model/teacher'

export interface TeacherRow {
  id: string
  firstName: string
  lastName: string
  subject: string
  classAssigned: string
  hiredSince: string
  status: 'Active' | 'On Leave' | 'Inactive'
}

function mapTeacher(t: TeacherDto): TeacherRow {
  const hired =
    t.createdAt?.split('T')[0] ??
    t.updatedAt?.split('T')[0] ??
    '—'
  return {
    id: t.id,
    firstName: t.firstName ?? '',
    lastName: t.lastName ?? '',
    subject: '—',
    classAssigned: '—',
    hiredSince: hired,
    status: 'Active',
  }
}

export const useTeacherStore = defineStore('teachers', () => {
  const teachers = ref<TeacherRow[]>([])
  const loading = ref(false)

  async function fetchTeachers() {
    loading.value = true
    try {
      const rows = await teachersApi.fetchTeachers()
      teachers.value = rows.map(mapTeacher)
    } finally {
      loading.value = false
    }
  }

  async function deleteTeacher(id: string) {
    await teachersApi.deleteTeacher(id)
    teachers.value = teachers.value.filter(t => t.id !== id)
  }

  return {
    teachers,
    loading,
    fetchTeachers,
    deleteTeacher,
  }
})
