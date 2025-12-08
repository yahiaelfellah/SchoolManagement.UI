<template>
  <a-card
    :title="title"
    class="card"
  >
    <a-skeleton
      :loading="loading"
      active
    >
      <template v-if="guardians && guardians.length">
        <div
          v-for="guardian in guardians"
          :key="guardian.id"
          class="guardian-item  shadow-sm"
        >
          <!-- 🧍 Guardian Header -->
          <div class="flex justify-between items-center mb-3">
            <div class="flex items-center gap-3">
              <div>
                <h3 class="font-semibold text-lg">
                  {{ guardian.name }}
                </h3>
                <p class="text-gray-500">
                  {{ guardian.relationship }}
                </p>
              </div>
            </div>
          </div>

          <!-- 📋 Guardian Details -->
          <a-descriptions
            size="small"
            :column="1"
            bordered
            class="guardian-details"
          >
            <a-descriptions-item label="Phone">
              {{ guardian.phone }}
            </a-descriptions-item>

            <a-descriptions-item label="Email">
              {{ guardian.email }}
            </a-descriptions-item>

            <a-descriptions-item label="Address">
              {{ guardian.address.street }},
              {{ guardian.address.city }},
              {{ guardian.address.state }},
              {{ guardian.address.country }}
            </a-descriptions-item>
          </a-descriptions>
          <a-divider />
        </div>
      </template>

      <!-- 🕳️ Empty State -->
      <div
        v-else-if="!loading"
        class="text-gray-500 text-center py-4"
      >
        No guardians found for this student.
      </div>
    </a-skeleton>

    <!-- ⚠️ Invalid ID -->
    <div
      v-if="invalidId"
      class="text-red-500 text-center mt-2"
    >
      Invalid student ID
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { onMounted, watch, computed } from 'vue'
import { useGuardianStore } from '@/stores/guardianStore'

const store = useGuardianStore()
const props = defineProps<{ studentId?: number; title?: string }>()

// 🧭 Lifecycle: Fetch guardians when mounted or when ID changes
onMounted(() => store.fetchGuardians(props.studentId))
watch(() => props.studentId, (v) => store.fetchGuardians(v))

// 🧠 Computed State
const guardians = computed(() => store.guardians)
const loading = computed(() => store.loading)
const invalidId = computed(() => store.invalidId)
</script>

<style scoped>
.card {
  border-radius: 12px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.08);
}
.guardian-item {
  background: #fff;
  transition: all 0.3s;
  padding: 2%;
}
.guardian-item:hover {
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.08);
}
.text-gray-500 {
  color: #888;
}
.text-red-500 {
  color: #e74c3c;
}
.guardian-details :deep(.ant-descriptions-item-label) {
  font-weight: 600;
}
</style>
