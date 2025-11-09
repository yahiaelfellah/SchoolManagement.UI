<template>
  <div class="student-details">
    <a-page-header
      :title="studentTitle"
      :sub-title="tl('description')"
      @back="() => $router.back()"
    />

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <!-- Student Info -->
      <BasicInfo
        :student-id="id"
        :title="tl('sections.basicInfo')"
      />

      <!-- Guardian Info -->
      <GuardianCard
        :student-id="id"
        :title="tl('sections.guardian')"
      />
    </div>

    <!-- Class History -->
    <ClassHistory
      :student-id="id"
      :title="tl('sections.classInfo')"
      class="mt-4 card"
    />

    <!-- Payments -->
    <PaymentsTable
      :student-id="id"
      :title="tl('sections.payments')"
      class="mt-4 card"
    />

    <!-- Documents -->
    <DocumentsTable
      :student-id="id"
      :title="tl('sections.documents')"
      class="mt-4 card"
      @download="downloadFile"
    />
  </div>
</template>

<script setup lang="ts">
// filepath: d:\Project\SchoolManagementSystem\schoolmanagementsystem.client\src\views\StudentDetails.vue
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { message } from 'ant-design-vue'
import { useLocalI18n } from '@/helpers/useLocalI18n'

import BasicInfo from '@/components/StudentDetails/BasicInfo.vue'
import GuardianCard from '@/components/StudentDetails/GuardianCard.vue'
import ClassHistory from '@/components/StudentDetails/ClassHistory.vue'
import PaymentsTable from '@/components/StudentDetails/PaymentsTable.vue'
import DocumentsTable from '@/components/StudentDetails/DocumentsTable.vue'

const route = useRoute()
const { t, tl } = useLocalI18n('operations.students.details')

// determine id once and validate
const id = Number(route.params.id)
const studentTitle = computed(() =>
  Number.isNaN(id) || id <= 0 ? tl('title') : `${tl('title')} #${id}`
)

if (Number.isNaN(id) || id <= 0) {
  // show user-friendly error but still render page (components will handle invalid id)
  message.error(t('common.invalidId'))
}

// Mock Download handler (triggered by DocumentsTable)
const downloadFile = (record: any) => {
  message.success(`Downloading ${record.name}...`)
}
</script>

<style scoped>
.student-details {
  max-width: 85vw;
  margin: auto;
  padding: 24px;
}
.card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
.text-gray-500 {
  color: #888;
}
.mt-4 {
  margin-top: 16px;
}
</style>
