// src/stores/useDialogStore.ts
import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useDialogStore = defineStore('dialog', () => {
  const activeDialog = ref<string | null>(null) // stores the key of the currently open dialog
  const dialogProps = ref<Record<string, any>>({}) // optional props to pass to dialog

  const openDialog = (key: string, props: Record<string, any> = {}) => {
    activeDialog.value = key
    dialogProps.value = props
  }

  const closeDialog = () => {
    activeDialog.value = null
    dialogProps.value = {}
  }

  return { activeDialog, dialogProps, openDialog, closeDialog }
})
