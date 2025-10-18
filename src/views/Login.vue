<template>
  <div class="login-container">
    <a-card title="School Dashboard Login" class="login-card">
      <a-form
        layout="vertical"
        @submit.prevent="handleLogin"
      >
        <a-form-item label="Username">
          <a-input v-model:value="username" placeholder="Enter username" />
        </a-form-item>

        <a-form-item label="Password">
          <a-input-password v-model:value="password" placeholder="Enter password" />
        </a-form-item>

        <a-form-item>
          <a-button type="primary" block @click="handleLogin" :loading="loading">
            Login
          </a-button>
        </a-form-item>

        <p v-if="error" class="text-red-500">{{ error }}</p>
      </a-form>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../store/auth'
import { useRouter } from 'vue-router'
import { message } from 'ant-design-vue'

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)
const auth = useAuthStore()
const router = useRouter()

const handleLogin = async () => {
  loading.value = true
  const success = await auth.login(username.value, password.value)
  loading.value = false
  if (success) {
    message.success('Welcome back!')
    router.push('/')
  } else {
    error.value = 'Invalid username or password'
  }
}
</script>

<style scoped>
.login-container {
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #f0f2f5;
}
.login-card {
  width: 360px;
}
</style>
