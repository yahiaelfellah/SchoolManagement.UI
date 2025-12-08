<template>
  <div class="student-details">
    <!-- Header -->
    <a-page-header
      :title="studentTitle"
      :sub-title="tl('description')"
      @back="() => $router.back()"
    />

    <!-- 🧍 Student & 👨‍👩‍👧 Guardian Info -->
    <div class="info-grid">
      <BasicInfo
        :student-id="id"
        :title="tl('sections.basicInfo')"
      />

      <GuardianCard
        :student-id="id"
        :title="tl('sections.guardian')"
      />
    </div>

    <!-- 📚 Academic Info Section -->
    <div class="section mt-6">
      <h3 class="section-title">
        {{ tl('sections.academicInfo') }}
      </h3>
      <div class="academic-grid">
        <ClassHistory
          :student-id="id"
          :title="tl('sections.classInfo')"
        />

        <PaymentsTable
          :student-id="id"
          :title="tl('sections.payments')"
        />

        <DocumentsTable
          :student-id="id"
          :title="tl('sections.documents')"
          @download="downloadFile"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
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

const id = Number(route.params.id)
const studentTitle = computed(() =>
  Number.isNaN(id) || id <= 0 ? tl('title') : `${tl('title')} #${id}`
)

if (Number.isNaN(id) || id <= 0) {
  message.error(t('common.invalidId'))
}

// Mock document download
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

.info-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(380px, 1fr));
  gap: 24px;
  margin-top: 16px;
}

.section {
  margin-top: 32px;
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  margin-bottom: 16px;
  color: #333;
}

.academic-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(420px, 1fr));
  gap: 24px;
}

.card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
  background: #fff;
}

.mt-6 {
  margin-top: 24px;
}
</style>
