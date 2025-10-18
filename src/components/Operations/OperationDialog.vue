<template>
  <a-modal
    v-model:visible="isOpen"
    :title="dialogTitle"
    @ok="close"
    @cancel="close"
  >
    <component :is="currentComponent" v-bind="dialogStore.dialogProps" />
  </a-modal>
</template>

<script setup lang="ts">
import { useDialogStore } from '@/store/operationsDialog'
import AddStudentDialog from '@/components/Students/AddStudentDialog.vue'
import { computed } from 'vue'

const dialogStore = useDialogStore()

const isOpen = computed(() => dialogStore.activeDialog !== null)

// Map operation key → component
const dialogMap: Record<string, any> = {
    addStudent: AddStudentDialog,
}

const currentComponent = computed(() => {
  if (!dialogStore.activeDialog) return null
  return dialogMap[dialogStore.activeDialog] || null
})

const dialogTitle = computed(() => dialogStore.activeDialog ?? '')

const close = () => dialogStore.closeDialog()
</script>
