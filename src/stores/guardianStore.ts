import { defineStore } from 'pinia'

export const useGuardianStore = defineStore('guardian', () => {
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
    createGuardian,
  }
})
