<template>
  <div class="set-calendar">
    <a-page-header
      :title="tl('title')"
      :sub-title="tl('description')"
      @back="() => $router.go(-1)"
    />

    <!-- Create or Manage Academic Year -->
    <a-card class="mb-4">
      <a-form
        layout="inline"
        @finish="createAcademicYear"
      >
        <a-form-item
          :label="tl('academicYear.name')"
          required
        >
          <a-input
            v-model:value="yearForm.name"
            :placeholder="tl('academicYear.namePlaceholder')"
            :disabled="activeYearExists"
          />
        </a-form-item>

        <a-form-item
          :label="tl('academicYear.range')"
          required
        >
          <a-range-picker
            v-model:value="yearForm.range"
            format="YYYY-MM-DD"
            :disabled="activeYearExists"
          />
        </a-form-item>

        <a-button
          type="primary"
          html-type="submit"
          :disabled="activeYearExists"
        >
          {{ t('common.create') }}
        </a-button>

        <a-button
          v-if="activeYearExists"
          danger
          @click="closeAcademicYear"
        >
          {{ tl('academicYear.close') }}
        </a-button>
      </a-form>

      <a-divider />

      <a-select
        v-if="academicYears.length"
        v-model:value="selectedYearId"
        style="width: 250px"
        :placeholder="tl('academicYear.selectYear')"
      >
        <a-select-option
          v-for="year in academicYears"
          :key="year.id"
          :value="year.id"
        >
          {{ year.name }} — 
          <span :style="{ color: year.status === 'open' ? 'green' : 'gray' }">
            {{ year.status === 'open' ? tl('academicYear.open') : tl('academicYear.closed') }}
          </span>
        </a-select-option>
      </a-select>
    </a-card>

    <!-- Event Management -->
    <a-card
      v-if="selectedYear"
      class="mb-4"
      :title="`${tl('events.title')} — ${selectedYear.name}`"
    >
      <template v-if="selectedYear.status === 'open'">
        <a-form
          layout="inline"
          @finish="addEvent"
        >
          <a-form-item
            :label="tl('events.form.title')"
            required
          >
            <a-input
              v-model:value="eventForm.title"
              :placeholder="tl('events.form.titlePlaceholder')"
            />
          </a-form-item>

          <a-form-item
            :label="tl('events.form.type')"
            required
          >
            <a-select
              v-model:value="eventForm.type"
              :placeholder="tl('events.form.typePlaceholder')"
            >
              <a-select-option value="meeting">
                {{ tl('events.types.meeting') }}
              </a-select-option>
              <a-select-option value="exam">
                {{ tl('events.types.exam') }}
              </a-select-option>
              <a-select-option value="holiday">
                {{ tl('events.types.holiday') }}
              </a-select-option>
              <a-select-option value="activity">
                {{ tl('events.types.activity') }}
              </a-select-option>
            </a-select>
          </a-form-item>

          <a-form-item
            :label="tl('events.form.range')"
            required
          >
            <a-range-picker
              v-model:value="eventForm.range"
              format="YYYY-MM-DD"
            />
          </a-form-item>

          <a-button
            type="primary"
            html-type="submit"
          >
            {{ t('common.add') }}
          </a-button>
        </a-form>
      </template>

      <template v-else>
        <a-alert
          type="info"
          :message="tl('academicYear.closedInfo')"
          show-icon
        />
      </template>
    </a-card>

    <!-- Calendar View Switcher -->
    <a-segmented
      v-model:value="viewMode"
      :options="[
        { label: t('common.calendar.monthly'), value: 'month' },
        { label: t('common.calendar.weekly'), value: 'week' },
        { label: t('common.calendar.daily'), value: 'day' }
      ]"
      style="margin-bottom: 16px;"
    />

    <!-- Calendar -->
    <a-card v-if="selectedYear">
      <component
        :is="currentViewComponent"
        :events="selectedYear.events"
      />
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { message } from 'ant-design-vue'
import { useLocalI18n } from '@/helpers/useLocalI18n'
import CalendarMonthView from '@/components/Calendar/CalendarMonthView.vue'
import CalendarWeekView from '@/components/Calendar/CalendarWeekView.vue'
import CalendarDayView from '@/components/Calendar/CalendarDayView.vue'

const { t, tl } = useLocalI18n('operations.setCalendar')

// --- Reactive State ---
const yearForm = ref({ name: '', range: [] as [string, string] | [] })
const eventForm = ref({ title: '', type: '', range: [] as [string, string] | [] })

const academicYears = ref<any[]>([])
const selectedYearId = ref<number | null>(null)
const selectedYear = computed(() => academicYears.value.find(y => y.id === selectedYearId.value))
const activeYearExists = computed(() => academicYears.value.some(y => y.status === 'open'))

// --- View Mode Switcher ---
const viewMode = ref<'month' | 'week' | 'day'>('month')
const currentViewComponent = computed(() => {
  if (viewMode.value === 'week') return CalendarWeekView
  if (viewMode.value === 'day') return CalendarDayView
  return CalendarMonthView
})

// --- Mock API delay ---
const fakeApi = (action: string, data: any) => {
  console.log(`[Mock API] ${action}:`, data)
  return new Promise((resolve) => {
    setTimeout(() => resolve({ success: true }), 1000)
  })
}

// --- Actions ---

const createAcademicYear = async () => {
  if (activeYearExists.value) return message.warning(tl('academicYear.onlyOneActive'))
  if (!yearForm.value.name || yearForm.value.range.length < 2) {
    return message.error(t('common.validations.required'))
  }

  message.loading({ content: t('common.loading'), key: 'create' })
  const payload = {
    name: yearForm.value.name,
    startDate: yearForm.value.range[0],
    endDate: yearForm.value.range[1],
  }

  await fakeApi('createAcademicYear', payload)
  const newYear = {
    id: Date.now(),
    ...payload,
    status: 'open',
    events: [],
  }
  academicYears.value.push(newYear)
  selectedYearId.value = newYear.id
  yearForm.value = { name: '', range: [] }
  message.success({ content: t('common.success'), key: 'create' })
}

const closeAcademicYear = async () => {
  const active = academicYears.value.find(y => y.status === 'open')
  if (!active) return message.info(tl('academicYear.noActive'))

  message.loading({ content: t('common.loading'), key: 'close' })
  await fakeApi('closeAcademicYear', { id: active.id })
  active.status = 'closed'
  message.success({ content: tl('academicYear.closedSuccess'), key: 'close' })
}

const addEvent = async () => {
  if (!selectedYear.value || selectedYear.value.status !== 'open') {
    return message.error(tl('academicYear.closedNoAdd'))
  }
  if (!eventForm.value.title || !eventForm.value.type || eventForm.value.range.length < 2) {
    return message.error(t('common.validations.required'))
  }

  message.loading({ content: t('common.loading'), key: 'add' })
  const payload = {
    title: eventForm.value.title,
    type: eventForm.value.type,
    dateRange: eventForm.value.range,
  }

  await fakeApi('addEvent', payload)
  selectedYear.value.events.push({ id: Date.now(), ...payload })
  eventForm.value = { title: '', type: '', range: [] }
  message.success({ content: t('common.success'), key: 'add' })
}
</script>


<style scoped>
.set-calendar {
  max-width: 80vw;
  margin: auto;
  padding: 24px;
}
.mb-4 {
  margin-bottom: 16px;
}
</style>
