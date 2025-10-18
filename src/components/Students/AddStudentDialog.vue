<template>
  <a-modal
    v-model:visible="visible"
    :title="t('operations.addStudent')"
    ok-text="Save"
    cancel-text="Cancel"
    @ok="handleSubmit"
    @cancel="close"
    :confirm-loading="loading"
  >
    <a-form
      layout="vertical"
      :model="form"
      :rules="rules"
      ref="studentFormRef"
    >
      <!-- Student Info -->
      <a-form-item label="First Name" name="firstName" :rules="[ { required: true, message: 'Please enter first name' } ]">
        <a-input v-model:value="form.firstName" />
      </a-form-item>

      <a-form-item label="Last Name" name="lastName" :rules="[ { required: true, message: 'Please enter last name' } ]">
        <a-input v-model:value="form.lastName" />
      </a-form-item>

      <a-form-item label="Date of Birth" name="dateOfBirthday" :rules="[ { required: true, message: 'Please select date of birth' } ]">
        <a-date-picker v-model:value="form.dateOfBirthday" style="width: 100%" />
      </a-form-item>

      <a-form-item label="Gender" name="gender" :rules="[ { required: true, message: 'Please select gender' } ]">
        <a-select v-model:value="form.gender" placeholder="Select gender">
          <a-select-option value="Male">Male</a-select-option>
          <a-select-option value="Female">Female</a-select-option>
        </a-select>
      </a-form-item>

      <a-form-item label="Address" name="address">
        <a-input v-model:value="form.address" />
      </a-form-item>

      <!-- Guardian Info -->
      <a-divider>Guardian Information</a-divider>

      <a-form-item label="Guardian First Name" name="guardianFirstName" :rules="[ { required: true, message: 'Please enter guardian first name' } ]">
        <a-input v-model:value="form.guardianFirstName" />
      </a-form-item>

      <a-form-item label="Guardian Last Name" name="guardianLastName" :rules="[ { required: true, message: 'Please enter guardian last name' } ]">
        <a-input v-model:value="form.guardianLastName" />
      </a-form-item>

      <a-form-item label="Phone Number" name="guardianPhoneNumber" :rules="[ { required: true, message: 'Please enter phone number' } ]">
        <a-input-number v-model:value="form.guardianPhoneNumber" style="width: 100%" />
      </a-form-item>

      <a-form-item label="Guardian Address" name="guardianAddress">
        <a-input v-model:value="form.guardianAddress" />
      </a-form-item>

      <a-form-item label="Relation to Student" name="guardianRelation" :rules="[ { required: true, message: 'Please select relation' } ]">
        <a-select v-model:value="form.guardianRelation" placeholder="Select relation">
          <a-select-option value="Parent">Parent</a-select-option>
          <a-select-option value="Sibling">Sibling</a-select-option>
          <a-select-option value="Other">Other</a-select-option>
        </a-select>
      </a-form-item>
    </a-form>
  </a-modal>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue'
import { useI18n } from 'vue-i18n'
import { useDialogStore } from '@/stores/operationsDialog'

const { t } = useI18n()
const dialogStore = useDialogStore()

const visible = computed(() => dialogStore.activeDialog === 'addStudent')
const loading = ref(false)

const studentFormRef = ref()

const form = ref({
  firstName: '',
  lastName: '',
  dateOfBirthday: null as null | Date,
  gender: '',
  address: '',
  guardianFirstName: '',
  guardianLastName: '',
  guardianPhoneNumber: null as number | null,
  guardianAddress: '',
  guardianRelation: '',
})

const rules = {
  firstName: [{ required: true, message: 'Please enter first name', trigger: 'blur' }],
  lastName: [{ required: true, message: 'Please enter last name', trigger: 'blur' }],
  dateOfBirthday: [{ required: true, message: 'Please select date of birth', trigger: 'change' }],
  gender: [{ required: true, message: 'Please select gender', trigger: 'change' }],
  guardianFirstName: [{ required: true, message: 'Please enter guardian first name', trigger: 'blur' }],
  guardianLastName: [{ required: true, message: 'Please enter guardian last name', trigger: 'blur' }],
  guardianPhoneNumber: [{ required: true, message: 'Please enter phone number', trigger: 'blur' }],
  guardianRelation: [{ required: true, message: 'Please select relation', trigger: 'change' }],
}

const handleSubmit = async () => {
  if (!studentFormRef.value) return
  try {
    await studentFormRef.value.validate()
    loading.value = true

    // Construct payload based on your C# model
    const payload = {
      firstName: form.value.firstName,
      lastName: form.value.lastName,
      dateOfBirthday: form.value.dateOfBirthday,
      gender: form.value.gender,
      address: form.value.address,
      guardian: {
        firstName: form.value.guardianFirstName,
        lastName: form.value.guardianLastName,
        phoneNumber: form.value.guardianPhoneNumber,
        address: form.value.guardianAddress,
        relationToStudent: form.value.guardianRelation,
      },
    }

    console.log('Submitting Student:', payload)

    // TODO: call API to save student
    // await api.addStudent(payload)

    dialogStore.closeDialog()
  } catch (err) {
    console.error('Validation failed', err)
  } finally {
    loading.value = false
  }
}

const close = () => dialogStore.closeDialog()
</script>

<style scoped>
a-divider {
  margin: 16px 0;
}
</style>
