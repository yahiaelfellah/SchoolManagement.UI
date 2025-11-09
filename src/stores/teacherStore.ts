import { defineStore } from 'pinia'
import { ref } from 'vue'

interface Teacher {
  id: number
  firstName: string
  lastName: string
  subject: string
  classAssigned: string
  hiredSince: string
  status: 'Active' | 'On Leave' | 'Inactive'
}

export const useTeacherStore = defineStore('teachers', () => {
  const teachers = ref<Teacher[]>([])
  const loading = ref(false)

  // ---------- Mocked API ----------
  async function fetchTeachers() {
    loading.value = true
    try {
      await new Promise(r => setTimeout(r, 700))
      teachers.value = [
        { id: 1, firstName: 'Ahmed', lastName: 'Saleh', subject: 'Mathematics', classAssigned: 'Grade 1', hiredSince: '2019-08-01', status: 'Active' },
        { id: 2, firstName: 'Lina', lastName: 'Hassan', subject: 'Science', classAssigned: 'Grade 2', hiredSince: '2021-02-10', status: 'Active' },
        { id: 3, firstName: 'Mohamed', lastName: 'Ali', subject: 'History', classAssigned: 'Grade 3', hiredSince: '2020-05-15', status: 'On Leave' },
        { id: 4, firstName: 'Noura', lastName: 'Youssef', subject: 'English', classAssigned: 'Grade 1', hiredSince: '2022-09-01', status: 'Active' },
        { id: 5, firstName: 'Omar', lastName: 'Fahmy', subject: 'Physical Education', classAssigned: 'All Grades', hiredSince: '2018-01-20', status: 'Inactive' },
        { id: 6, firstName: 'Fatima', lastName: 'Adel', subject: 'Art', classAssigned: 'Grade 2', hiredSince: '2023-03-10', status: 'Active' },
        { id: 7, firstName: 'Khaled', lastName: 'Mahmoud', subject: 'Computer Science', classAssigned: 'Grade 3', hiredSince: '2020-11-25', status: 'On Leave' }
      ]
    } finally {
      loading.value = false
    }
  }

  // ---------- Actions ----------
  function deleteTeacher(id: number) {
    const idx = teachers.value.findIndex(t => t.id === id)
    if (idx !== -1) teachers.value.splice(idx, 1)
  }

  return {
    teachers,
    loading,
    fetchTeachers,
    deleteTeacher
  }
})
