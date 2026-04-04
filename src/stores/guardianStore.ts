import { defineStore } from 'pinia'
import { ref } from 'vue'

function validStudentId(studentId?: string) {
  return typeof studentId === 'string' && studentId.trim().length > 0
}

export const useGuardianStore = defineStore('guardian', () => {
  const guardian = ref<unknown>(null)
  const guardians = ref<
    {
      id: number
      name: string
      relationship: string
      phone: string
      email: string
      address: { street: string; city: string; state: string; country: string }
    }[]
  >([])
  const invalidId = ref(false)
  const loading = ref(false)

  async function fetchGuardians(studentId?: string) {
    if (!validStudentId(studentId)) {
      invalidId.value = true
      guardians.value = []
      return
    }

    invalidId.value = false
    loading.value = true
    await new Promise(r => setTimeout(r, 600))

    guardians.value = [
      {
        id: 1,
        name: 'Ahmed Youssef',
        relationship: 'Father',
        phone: '+971 555 123 456',
        email: 'ahmed.youssef@example.com',
        address: {
          street: '123 Palm St',
          city: 'Dubai',
          state: 'Dubai',
          country: 'UAE',
        },
      },
      {
        id: 2,
        name: 'Mona Ali',
        relationship: 'Mother',
        phone: '+971 555 654 321',
        email: 'mona.ali@example.com',
        address: {
          street: '123 Palm St',
          city: 'Dubai',
          state: 'Dubai',
          country: 'UAE',
        },
      },
    ]

    loading.value = false
  }

  async function fetchGuardian(id?: number) {
    if (!id || Number.isNaN(id) || id <= 0) {
      invalidId.value = true
      guardian.value = null
      return
    }

    invalidId.value = false
    loading.value = true
    await new Promise(r => setTimeout(r, 300))

    guardian.value = {
      id: 101,
      name: 'Ahmed Youssef',
      relationship: 'Father',
      phone: '+971 555 123 456',
      email: 'ahmed.youssef@example.com',
      address: {
        street: 'Villa 24, Al Nahda St.',
        city: 'Dubai',
        state: 'Dubai',
        country: 'United Arab Emirates',
      },
    }

    loading.value = false
  }

  function createGuardian() {
    return {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      relation: '',
      address: '',
      isPrimary: false,
    }
  }

  return {
    guardian,
    guardians,
    loading,
    invalidId,
    fetchGuardian,
    fetchGuardians,
    createGuardian,
  }
})
