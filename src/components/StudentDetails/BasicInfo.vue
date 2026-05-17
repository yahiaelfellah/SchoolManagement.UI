<template>
  <a-card class="card">
    <a-skeleton
      :loading="loading"
      active
    >
      <div v-if="student">
        <a-avatar
          size="large"
          src="https://cdn-icons-png.flaticon.com/512/219/219970.png"
        />
        <div class="flex justify-between items-center w-full">
          <div>
            <h3 class="font-semibold text-lg">
              {{ student.fullName }}
            </h3>
            <p class="text-gray-500">
              {{ student.currentClass }}
            </p>
          </div>
          <a-badge
            :status="student.status === 'Active' ? 'processing' : 'red'"
            :text="student.status"
          />
        </div>
      </div>

      <a-divider />

      <a-list
        v-if="student"
        item-layout="horizontal"
        :data-source="infoList"
        class="info-list"
      >
        <template #renderItem="{ item }">
          <a-list-item>
            <a-list-item-meta
              :title="item.label"
            />
            <div class="text-gray-500">
              {{ item.value }}
            </div>
          </a-list-item>
        </template>
      </a-list>
    </a-skeleton>

    <div
      v-if="invalidId"
      class="text-red-500 text-center mt-2"
    >
      Invalid student ID
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { computed, onMounted, watch } from 'vue'
import { useStudentStore } from '@/stores/studentStore'

const props = defineProps<{ studentId?: string; title?: string }>()
const store = useStudentStore()

// 🧭 Lifecycle
onMounted(() => store.fetchStudent(props.studentId))
watch(() => props.studentId, (v) => store.fetchStudent(v))

// 🔄 Store state
const student = computed(() => store.student)
const loading = computed(() => store.loading)
const invalidId = computed(() => store.invalidId)

// 🧠 Computed info list for rendering
const infoList = computed(() => {
  if (!student.value) return []
  return [
    { label: 'Gender', value: student.value.gender },
    { label: 'Date of Birth', value: student.value.dateOfBirth },
    { label: 'Age', value: `${student.value.age} years` },
    { label: 'Enrolled Since', value: student.value.enrolledSince },
    { label: 'Homeroom Teacher', value: student.value.homeroomTeacher },
    { label: 'Address', value: student.value.address },
    {
      label: 'Special Needs',
      value: student.value.specialNeeds?.length
        ? student.value.specialNeeds.join(', ')
        : 'None'
    },
    {
      label: 'Emergency Contact',
      value: `${student.value.emergencyContact.name} (${student.value.emergencyContact.relationship}) — ${student.value.emergencyContact.phone}`
    },
    {
      label: 'Medical Conditions',
      value: student.value.medicalConditions?.length
        ? student.value.medicalConditions.join(', ')
        : 'No known conditions'
    }
  ]
})
</script>

<style scoped>
.card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
.text-gray-500 {
  color: #888;
}
.info-list :deep(.ant-list-item-meta-title) {
  font-weight: 600;
  color: #333;
}
.info-list :deep(.ant-list-item-meta-description) {
  color: #555;
}
</style>
