<template>
  <div class="student-details">
    <a-page-header
      :title="student?.fullName || tl('title')"
      :sub-title="tl('description')"
      @back="() => $router.back()"
    />

    <!-- 🎓 Student + Guardian Info -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
      <!-- Student Info -->
      <a-card
        v-if="student"
        class="card"
        :title="tl('sections.basicInfo')"
      >
        <div class="flex gap-4 items-center">
          <a-avatar
            size="large"
            src="https://cdn-icons-png.flaticon.com/512/219/219970.png"
          />
          <div>
            <h3 class="font-semibold text-lg">
              {{ student.fullName }}
            </h3>
            <p class="text-gray-500">
              {{ student.currentClass }}
            </p>
            <a-tag :color="student.status === 'Active' ? 'green' : 'red'">
              {{ student.status }}
            </a-tag>
          </div>
        </div>

        <a-divider />

        <a-descriptions
          size="small"
          :column="1"
          bordered
        >
          <a-descriptions-item :label="tl('fields.gender')">
            {{ student.gender }}
          </a-descriptions-item>
          <a-descriptions-item :label="tl('fields.age')">
            {{ student.age }}
          </a-descriptions-item>
          <a-descriptions-item :label="tl('fields.enrolledSince')">
            {{ student.enrolledSince }}
          </a-descriptions-item>
          <a-descriptions-item :label="tl('fields.homeroomTeacher')">
            {{ student.homeroomTeacher }}
          </a-descriptions-item>
        </a-descriptions>
      </a-card>

      <!-- Guardian Info -->
      <a-card
        v-if="guardian"
        class="card"
        :title="tl('sections.guardian')"
      >
        <a-descriptions
          size="small"
          :column="1"
          bordered
        >
          <a-descriptions-item :label="tl('fields.guardianName')">
            {{ guardian.name }}
          </a-descriptions-item>
          <a-descriptions-item :label="tl('fields.relationship')">
            {{ guardian.relationship }}
          </a-descriptions-item>
          <a-descriptions-item :label="tl('fields.phone')">
            {{ guardian.phone }}
          </a-descriptions-item>
          <a-descriptions-item :label="tl('fields.email')">
            {{ guardian.email }}
          </a-descriptions-item>
        </a-descriptions>
      </a-card>
    </div>

    <!-- 🏫 Class History -->
    <a-card
      class="mt-4 card"
      :title="tl('sections.classInfo')"
    >
      <a-table
        :columns="classColumns"
        :data-source="classHistory"
        bordered
        size="small"
        row-key="id"
        :pagination="false"
      />
    </a-card>

    <!-- 💰 Payment History -->
    <a-card
      class="mt-4 card"
      :title="tl('sections.payments')"
    >
      <a-table
        :columns="paymentColumns"
        :data-source="payments"
        bordered
        row-key="id"
        :loading="loading"
        size="small"
        :pagination="{ pageSize: 5 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'status'">
            <a-tag :color="record.status === 'Paid' ? 'green' : 'red'">
              {{ record.status }}
            </a-tag>
          </template>
        </template>
      </a-table>
    </a-card>

    <!-- 📁 Student Documents -->
    <a-card
      class="mt-4 card"
      :title="tl('sections.documents')"
    >
      <a-table
        :columns="documentColumns"
        :data-source="documents"
        bordered
        row-key="id"
        :loading="docLoading"
        size="small"
        :pagination="{ pageSize: 5 }"
      >
        <template #bodyCell="{ column, record }">
          <template v-if="column.key === 'fileType'">
            <a-tag color="blue">
              {{ record.fileType.toUpperCase() }}
            </a-tag>
          </template>

          <template v-if="column.key === 'action'">
            <a-button
              type="link"
              size="small"
              @click="downloadFile(record)"
            >
              {{ t('common.download') }}
            </a-button>
          </template>
        </template>
      </a-table>
    </a-card>
  </div>
</template>

    <script setup lang="ts">
    import { ref, onMounted } from 'vue'
    import { useRoute } from 'vue-router'
    import { message } from 'ant-design-vue'
    import { useLocalI18n } from '@/helpers/useLocalI18n'

    const route = useRoute()
    const { t, tl } = useLocalI18n('operations.students.details')

    const student = ref<any>(null)
    const guardian = ref<any>(null)
    const classHistory = ref<any[]>([])
    const payments = ref<any[]>([])
    const documents = ref<any[]>([])
    const loading = ref(false)
    const docLoading = ref(false)

    // Mock API
    const mockApi = {
    async getStudentDetails(id: number) {
        await new Promise(r => setTimeout(r, 500))
        return {
        id,
        fullName: 'Ali Ahmed',
        gender: 'Male',
        age: 14,
        enrolledSince: '2022-09-01',
        status: 'Active',
        currentClass: 'Grade 2',
        homeroomTeacher: 'Mr. Saleh'
        }
    },
    async getGuardianInfo() {
        await new Promise(r => setTimeout(r, 300))
        return {
        id: 101,
        name: 'Ahmed Youssef',
        relationship: 'Father',
        phone: '+971 555 123 456',
        email: 'ahmed.youssef@example.com'
        }
    },
    async getClassHistory() {
        await new Promise(r => setTimeout(r, 400))
        return [
        { id: 1, className: 'Grade 1', year: '2022-2023', teacher: 'Ms. Layla' },
        { id: 2, className: 'Math Basics', year: '2023-2024', teacher: 'Mr. Omar' }
        ]
    },
    async getPaymentHistory() {
        await new Promise(r => setTimeout(r, 400))
        return [
        { id: 1, date: '2024-01-05', amount: 1200, method: 'Card', status: 'Paid' },
        { id: 2, date: '2024-05-05', amount: 1200, method: 'Cash', status: 'Paid' },
        { id: 3, date: '2024-09-05', amount: 1200, method: 'Card', status: 'Pending' }
        ]
    },
    async getDocuments() {
        await new Promise(r => setTimeout(r, 500))
        return [
        { id: 1, name: 'Report Card - Term 1', fileType: 'pdf', uploadedAt: '2024-06-10' },
        { id: 2, name: 'Student ID Copy', fileType: 'jpg', uploadedAt: '2024-07-15' },
        { id: 3, name: 'Medical Certificate', fileType: 'pdf', uploadedAt: '2024-08-20' }
        ]
    }
    }

    onMounted(async () => {
    const id = Number(route.params.id)
    if (!id) return message.error(t('common.invalidId'))

    loading.value = true
    docLoading.value = true
    try {
        student.value = await mockApi.getStudentDetails(id)
        guardian.value = await mockApi.getGuardianInfo()
        classHistory.value = await mockApi.getClassHistory()
        payments.value = await mockApi.getPaymentHistory()
        documents.value = await mockApi.getDocuments()
    } catch (err) {
        console.error(err)
        message.error(t('common.error'))
    } finally {
        loading.value = false
        docLoading.value = false
    }
    })

    // Columns
    const classColumns = [
    { title: 'Class Name', dataIndex: 'className', key: 'className' },
    { title: 'Year', dataIndex: 'year', key: 'year' },
    { title: 'Teacher', dataIndex: 'teacher', key: 'teacher' }
    ]

    const paymentColumns = [
    { title: 'Date', dataIndex: 'date', key: 'date' },
    { title: 'Amount (AED)', dataIndex: 'amount', key: 'amount' },
    { title: 'Method', dataIndex: 'method', key: 'method' },
    { title: 'Status', dataIndex: 'status', key: 'status' }
    ]

    const documentColumns = [
    { title: 'Document Name', dataIndex: 'name', key: 'name' },
    { title: 'File Type', dataIndex: 'fileType', key: 'fileType' },
    { title: 'Uploaded At', dataIndex: 'uploadedAt', key: 'uploadedAt' },
    { title: 'Action', key: 'action' }
    ]

    // Mock Download
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
