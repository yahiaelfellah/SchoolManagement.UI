// filepath: src/stores/studentStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export interface StudentSummary {
  id: number
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

export const useStudentStore = defineStore('students', () => {
  const students = ref<StudentSummary[]>([])
  const student = ref<StudentDetail | null>(null)
  const invalidId = ref(false)
  const loading = ref(false)

  // 🧠 Mock API - list of students
  async function fetchStudents() {
    loading.value = true
    try {
      await new Promise(r => setTimeout(r, 700))
      students.value = [
        { id: 1, firstName: 'Ali', lastName: 'Ahmed', className: 'Grade 1', enrolledSince: '2023-09-01', attendance: 'Present' },
        { id: 2, firstName: 'Sara', lastName: 'Mohamed', className: 'Grade 2', enrolledSince: '2022-09-01', attendance: 'Absent' },
        { id: 3, firstName: 'Omar', lastName: 'Hassan', className: 'Grade 1', enrolledSince: '2023-02-15', attendance: 'Late' },
        { id: 4, firstName: 'Layla', lastName: 'Khaled', className: 'Math Advanced', enrolledSince: '2024-01-10', attendance: 'Present' },
        { id: 5, firstName: 'Hassan', lastName: 'Ali', className: 'Science', enrolledSince: '2022-06-01', attendance: 'Present' },
        { id: 6, firstName: 'Noura', lastName: 'Yassin', className: 'Grade 2', enrolledSince: '2023-04-20', attendance: 'Absent' },
        { id: 7, firstName: 'Fatima', lastName: 'Hassan', className: 'Grade 3', enrolledSince: '2024-02-01', attendance: 'Late' },
      ]
    } finally {
      loading.value = false
    }
  }

  // 🧠 Mock API - single student detail
  async function fetchStudent(id?: number) {
    if (!id || Number.isNaN(id) || id <= 0) {
      invalidId.value = true
      student.value = null
      return
    }

    invalidId.value = false
    loading.value = true
    await new Promise(r => setTimeout(r, 500))

    student.value = {
      id,
      firstName: 'Ali',
      lastName: 'Ahmed',
      fullName: 'Ali Ahmed',
      gender: 'Male',
      dateOfBirth: '2010-04-15',
      age: 14,
      enrolledSince: '2022-09-01',
      status: 'Active',
      className: 'Grade 2',
      currentClass: 'Grade 2',
      homeroomTeacher: 'Mr. Saleh',
      specialNeeds: ['Dyslexia'],
      emergencyContact: {
        name: 'Ahmed Youssef',
        relationship: 'Father',
        phone: '+971 555 123 456',
      },
      medicalConditions: ['Asthma'],
      address: 'Dubai, UAE',
      attendance: 'Present',
    }

    loading.value = false
  }

  function deleteStudent(id: number) {
    const idx = students.value.findIndex(s => s.id === id)
    if (idx !== -1) students.value.splice(idx, 1)
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
