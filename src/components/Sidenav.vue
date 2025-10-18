<template>
  <a-layout-sider collapsible v-model:collapsed="collapsed" theme="dark" breakpoint="lg" collapsed-width="0">
    <div class="logo">🎓 School Admin</div>

    <a-menu
      theme="dark"
      mode="inline"
      :selectedKeys="[selectedKey]"
      @click="onMenuClick"
    >
      <a-menu-item key="students">
        <template #icon>
          <UserOutlined />
        </template>
        Students
      </a-menu-item>

      <a-menu-item key="teachers">
        <template #icon>
          <TeamOutlined />
        </template>
        Teachers
      </a-menu-item>

      <a-menu-item key="classes">
        <template #icon>
          <BookOutlined />
        </template>
        Classes
      </a-menu-item>

      <a-menu-item key="logout">
        <template #icon>
          <LogoutOutlined />
        </template>
        Logout
      </a-menu-item>
    </a-menu>
  </a-layout-sider>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../store/auth'
import {
  UserOutlined,
  TeamOutlined,
  BookOutlined,
  LogoutOutlined,
} from '@ant-design/icons-vue'

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
    router.push({ name: info.key })
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
