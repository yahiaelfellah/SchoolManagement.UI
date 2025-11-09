<template>
  <div
    class="login-container"
    :dir="direction"
  >
    <a-card
      class="login-card"
      :title="t('login.title')"
    >
      <a-form
        layout="vertical"
        @finish="onFinish"
      >
        <a-form-item
          :label="t('login.username')"
          name="username"
          :rules="[{ required: true, message: t('login.username') }]"
        >
          <a-input v-model:value="form.username" />
        </a-form-item>

        <a-form-item
          :label="t('login.password')"
          name="password"
          :rules="[{ required: true, message: t('login.password') }]"
        >
          <a-input-password v-model:value="form.password" />
        </a-form-item>

        <a-form-item>
          <a-button
            type="primary"
            html-type="submit"
            block
          >
            {{ t('login.button') }}
          </a-button>
        </a-form-item>
      </a-form>

      <div class="lang-switch">
        <a-select
          v-model:value="locale"
          style="width: 100px"
          @change="setLocale"
        >
          <a-select-option value="en">
            English
          </a-select-option>
          <a-select-option value="ar">
            العربية
          </a-select-option>
        </a-select>
      </div>
    </a-card>
  </div>
</template>

<script setup lang="ts">
import { reactive } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '../stores/settings'
import { message } from 'ant-design-vue'

const auth = useAuthStore()
const router = useRouter()
const { t } = useI18n()
const settings = useSettingsStore()
const { locale, direction } = storeToRefs(settings)
const setLocale = settings.setLocale

const form = reactive({
  username: '',
  password: '',
})

const onFinish = async () => {
  const success = await auth.login(form.username, form.password)
  if (success) {
    router.push('/')
  } else {
    message.error(t('login.error'))
  }
}
</script>

<style scoped>
.login-container {
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background-color: #f0f2f5;
  transition: all 0.3s ease;
}

.login-card {
  width: 350px;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
}

.lang-switch {
  margin-top: 16px;
  text-align: center;
}
</style>
