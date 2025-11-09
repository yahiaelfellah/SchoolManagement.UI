import { defineStore } from 'pinia'
import { ref } from 'vue'

interface Student {
  id: number
  firstName: string
  lastName: string
  className: string
  enrolledSince: string
  attendance: 'Present' | 'Absent' | 'Late'
}

export const useStudentStore = defineStore('students', () => {
  const students = ref<Student[]>([])
  const loading = ref(false)

  // Internal mocked API (kept inside the store)
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
        { id: 7, firstName: 'Fatima', lastName: 'Hassan', className: 'Grade 3', enrolledSince: '2024-02-01', attendance: 'Late' }
      ]
    } finally {
      loading.value = false
    }
  }

  function deleteStudent(id: number) {
    const idx = students.value.findIndex(s => s.id === id)
    if (idx !== -1) students.value.splice(idx, 1)
  }

  return {
    students,
    loading,
    fetchStudents,
    deleteStudent
  }
})
