<template>
  <a-card class="card">
    <a-skeleton
      :loading="loading"
      active
    >
      <div
        v-if="student"
        class="flex gap-4 items-center"
      >
        <a-avatar
          size="large"
          src="https://cdn-icons-png.flaticon.com/512/219/219970.png"
        />
        <div
          style="  display: flex;
                                justify-content: space-between;
    align-items: center;"
        >
          <div>
            <h3 class="font-semibold text-lg">
              {{ student.fullName }}
            </h3>
            <p class="text-gray-500">
              {{ student.currentClass }}
            </p>
          </div>

          <a-tag :color="student.status === 'Active' ? 'green' : 'red'">
            {{ student.status }}
          </a-tag>
        </div>
      </div>

      <a-divider />

      <a-descriptions
        v-if="student"
        size="small"
        :column="1"
        bordered
      >
        <a-descriptions-item label="Gender">
          {{ student.gender }}
        </a-descriptions-item>
        <a-descriptions-item label="Age">
          {{ student.age }}
        </a-descriptions-item>
        <a-descriptions-item label="Enrolled Since">
          {{ student.enrolledSince }}
        </a-descriptions-item>
        <a-descriptions-item label="Homeroom Teacher">
          {{ student.homeroomTeacher }}
        </a-descriptions-item>
      </a-descriptions>
    </a-skeleton>
    <div
      v-if="invalidId"
      class="text-red-500"
    >
      Invalid student id
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'

const props = defineProps<{ studentId?: number, title?: string }>();
const student = ref<any | null>(null);
const loading = ref(false);
const invalidId = ref(false);

// mock fetch for student details (local to component)
async function fetchStudent(id?: number) {
    if (!id || Number.isNaN(id) || id <= 0) {
        invalidId.value = true
        student.value = null
        return
    }
    invalidId.value = false
    loading.value = true
    // simulate network delay
    await new Promise(r => setTimeout(r, 500))
    student.value = {
        id,
        fullName: 'Ali Ahmed',
        gender: 'Male',
        age: 14,
        enrolledSince: '2022-09-01',
        status: 'Active',
        currentClass: 'Grade 2',
        homeroomTeacher: 'Mr. Saleh'
    }
    loading.value = false
}

onMounted(() => fetchStudent(props.studentId))
watch(() => props.studentId, (v) => fetchStudent(v))
</script>

<style scoped>
.card {
    border-radius: 12px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}

.text-gray-500 {
    color: #888;
}
</style>
