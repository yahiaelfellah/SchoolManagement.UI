<template>
  <a-layout-sider
    v-model:collapsed="collapsed"
    collapsible
    theme="dark"
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
import { ref, computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'
import {
  UserOutlined,
  TeamOutlined,
  BookOutlined,
  LogoutOutlined,
} from '@ant-design/icons-vue'

const { t } = useI18n()
const collapsed = ref(false)
const route = useRoute()
const router = useRouter()
const auth = useAuthStore()

const selectedKey = computed(() => route.name?.toString() || '')

const onMenuClick = (info: any) => {
  if (info.key === 'logout') {
    auth.logout()
    router.push('/login')
  } else {
    router.push({path:`/${info.key}`})
  }
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
