<template>
  <a-layout-sider
    :style="siderStyle"
  >
    <div class="logo">
      🎓 {{ t('dashboard.title') }}
    </div>

    <a-menu
      theme="dark"
      mode="inline"
      :selected-keys="[selectedKey]"
      @click="onMenuClick"
    >
      <a-menu-item key="operations">
        <template #icon>
          <UserOutlined />
        </template>
        {{ t('menu.operations') }}
      </a-menu-item>
      <a-menu-item key="students">
        <template #icon>
          <UserOutlined />
        </template>
        {{ t('menu.students') }}
      </a-menu-item>
      <a-menu-item key="teachers">
        <template #icon>
          <TeamOutlined />
        </template>
        {{ t('menu.teachers') }}
      </a-menu-item>
      <a-menu-item key="classes">
        <template #icon>
          <BookOutlined />
        </template>
        {{ t('menu.classes') }}
      </a-menu-item>
      <a-menu-item key="finance">
        <template #icon>
          <DollarOutlined />
        </template>
        {{ t('menu.finance') }}
      </a-menu-item>
      <a-menu-item key="systems">
        <template #icon>
          <SettingOutlined />
        </template>
        {{ t('menu.system') }}
      </a-menu-item>
      <a-menu-item key="logout">
        <template #icon>
          <LogoutOutlined />
        </template>
        {{ t('menu.logout') }}
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import {
  UserOutlined,
  TeamOutlined,
  BookOutlined,
  LogoutOutlined,
  SettingOutlined,
  DollarOutlined,
} from '@ant-design/icons-vue'

const { t, locale } = useI18n()
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const selectedKey = computed(() => route.name?.toString() || '')

// detect RTL: based on current locale or document direction
const isRtl = computed(() => {
  const docDir = document.documentElement.getAttribute('dir')
  const localeVal = locale?.value ? String(locale.value) : ''
  return docDir === 'rtl' || localeVal.startsWith('ar') || localeVal.startsWith('he') // basic RTL locale checks
})

// computed style for the sider to flip left/right in RTL
const siderStyle = computed(() => ({
  overflow: 'auto',
  height: '100vh',
  position: 'fixed',
  left: isRtl.value ? 'unset' : 0,
  right: isRtl.value ? 0 : 'unset',
  top: 0,
  bottom: 0,
}))

const onMenuClick = (info: any) => {
  if (info.key === 'logout') auth.logout()
  router.push({path:`/${info.key}`})

}
</script>

<style scoped>
.logo {
  height: 64px;
  margin: 16px;
  color: white;
  text-align: center;
  font-weight: bold;
  font-size: 18px;
}
</style>
