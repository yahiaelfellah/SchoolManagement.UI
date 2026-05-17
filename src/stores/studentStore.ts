import { defineStore } from 'pinia'
import { ref } from 'vue'
import type { StudentDto } from '@/model/student'
import * as studentsApi from '@/api/students'
import { ApiError } from '@/api/client'

export interface StudentSummary {
  id: string
  firstName: string
  lastName: string
  className: string
  enrolledSince: string
  attendance: 'Present' | 'Absent' | 'Late'
}

export interface StudentDetail extends StudentSummary {
  fullName: string
  gender: string
  dateOfBirth: string
  age: number
  status: 'Active' | 'Inactive'
  currentClass: string
  homeroomTeacher: string
  specialNeeds: string[]
  emergencyContact: {
    name: string
    relationship: string
    phone: string
  }
  medicalConditions: string[]
  address: string
}

function yearsFromDateOnly(iso: string): number {
  const parts = iso.split('-').map(Number)
  if (parts.length < 3) return 0
  const [y, m, d] = parts
  const birth = new Date(y, m - 1, d)
  const today = new Date()
  let age = today.getFullYear() - birth.getFullYear()
  const md = today.getMonth() - birth.getMonth()
  if (md < 0 || (md === 0 && today.getDate() < birth.getDate())) {
    age -= 1
  }
  return Math.max(0, age)
}

function mapListItem(s: StudentDto): StudentSummary {
  const enrolled =
    s.createdAt?.split('T')[0] ??
    s.updatedAt?.split('T')[0] ??
    '—'
  return {
    id: s.id,
    firstName: s.firstName ?? '',
    lastName: s.lastName ?? '',
    className: '—',
    enrolledSince: enrolled,
    attendance: 'Present',
  }
}

function mapDetail(s: StudentDto): StudentDetail {
  const first = s.firstName ?? ''
  const last = s.lastName ?? ''
  const full = `${first} ${last}`.trim() || '—'
  const dob = s.dateOfBirthday?.split('T')[0] ?? '—'
  return {
    ...mapListItem(s),
    fullName: full,
    gender: s.gender ?? '—',
    dateOfBirth: dob,
    age: yearsFromDateOnly(s.dateOfBirthday),
    status: 'Active',
    currentClass: '—',
    homeroomTeacher: '—',
    specialNeeds: [],
    emergencyContact: { name: '—', relationship: '—', phone: '—' },
    medicalConditions: [],
    address: s.address ?? '—',
  }
}

export const useStudentStore = defineStore('students', () => {
  const students = ref<StudentSummary[]>([])
  const student = ref<StudentDetail | null>(null)
  const invalidId = ref(false)
  const loading = ref(false)

  async function fetchStudents() {
    loading.value = true
    try {
      const rows = await studentsApi.fetchStudents()
      students.value = rows.map(mapListItem)
    } finally {
      loading.value = false
    }
  }

  async function fetchStudent(id?: string) {
    if (!id?.trim()) {
      invalidId.value = true
      student.value = null
      return
    }

    invalidId.value = false
    loading.value = true
    try {
      const s = await studentsApi.fetchStudentById(id)
      student.value = mapDetail(s)
    } catch (e) {
      if (e instanceof ApiError && e.status === 404) {
        invalidId.value = true
        student.value = null
      } else {
        throw e
      }
    } finally {
      loading.value = false
    }
  }

  async function deleteStudent(id: string) {
    await studentsApi.deleteStudent(id)
    students.value = students.value.filter(s => s.id !== id)
  }

  return {
    students,
    student,
    loading,
    invalidId,
    fetchStudents,
    fetchStudent,
    deleteStudent,
  }
})
