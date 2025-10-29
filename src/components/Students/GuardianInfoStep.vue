<template>
  <div>
    <div
      v-for="(guardian, index) in form.guardians"
      :key="index"
      class="guardian-card"
    >
      <a-card
        size="small"
        :title="tf('guardianTitle', { number: index + 1 })"
        class="mb-4"
      >
        <template #extra>
          <a-button
            v-if="form.guardians.length > 1"
            type="text"
            danger
            @click="removeGuardian(index)"
          >
            {{ t('common.remove') }}
          </a-button>
        </template>

        <a-form-item
          :label="tf('guardianFirstName')"
          :name="['guardians', index, 'firstName']"
          :rules="[{ required: true, message: t('validations.required') }]"
        >
          <a-input v-model:value="guardian.firstName" />
        </a-form-item>

        <a-form-item
          :label="tf('guardianLastName')"
          :name="['guardians', index, 'lastName']"
          :rules="[{ required: true, message: t('validations.required') }]"
        >
          <a-input v-model:value="guardian.lastName" />
        </a-form-item>

        <a-form-item
          :label="tf('guardianPhoneNumber')"
          :name="['guardians', index, 'phoneNumber']"
          :rules="[{ required: true, message: t('validations.required') }]"
        >
          <a-input v-model:value="guardian.phoneNumber" />
        </a-form-item>

        <a-form-item
          :label="tf('guardianRelation')"
          :name="['guardians', index, 'relation']"
        >
          <a-select
            v-model:value="guardian.relation"
            :placeholder="t('common.select')"
          >
            <a-select-option value="Parent">
              {{ t('relations.parent') }}
            </a-select-option>
            <a-select-option value="Sibling">
              {{ t('relations.sibling') }}
            </a-select-option>
            <a-select-option value="Other">
              {{ t('relations.other') }}
            </a-select-option>
          </a-select>
        </a-form-item>

        <a-form-item
          :label="tf('guardianAddress')"
          :name="['guardians', index, 'address']"
        >
          <a-input v-model:value="guardian.address" />
        </a-form-item>

        <a-form-item>
          <a-checkbox
            v-model:checked="guardian.isPrimary"
            @change="setPrimary(index)"
          >
            {{ tf('guardianPrimary') }}
          </a-checkbox>
        </a-form-item>
      </a-card>
    </div>

    <!-- Add Guardian Button -->
    <a-button
      type="dashed"
      block
      @click="addGuardian"
    >
      {{ tf('guardianAddGuardian') }}
    </a-button>
  </div>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const tf = (key: string, params?: Record<string, any>) => 
  params ? t(`operations.students.add.form.${key}`, params) 
         : t(`operations.students.add.form.${key}`)


const props = defineProps<{ form: any }>()

// Add new guardian
const addGuardian = () => {
  props.form.guardians.push({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    relation: '',
    address: '',
    isPrimary: false,
  })
}

// Remove guardian
const removeGuardian = (index: number) => {
  props.form.guardians.splice(index, 1)
  // Ensure one guardian remains primary
  if (!props.form.guardians.some((g: any) => g.isPrimary) && props.form.guardians.length) {
    props.form.guardians[0].isPrimary = true
  }
}

// Set primary guardian
const setPrimary = (index: number) => {
  props.form.guardians.forEach((g: any, i: number) => {
    g.isPrimary = i === index
  })
}
</script>

<style scoped>
.guardian-card {
  border-radius: 8px;
}
.mb-4 {
  margin-bottom: 1rem;
}
</style>
