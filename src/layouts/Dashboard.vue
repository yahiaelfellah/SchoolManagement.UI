<template>
  <a-layout style="min-height: 100vh">
    <!-- 🧭 Side Navigation -->
    <SideNav />

    <!-- 📋 Main Layout -->
    <a-layout>
      <!-- Header -->
      <a-layout-header
        style="background: #fff; padding: 0 16px; display: flex; justify-content: space-between; align-items: center;"
      >
        <div style="font-weight: 600;">Dashboard</div>
        <div><strong>{{ auth.user?.name }}</strong></div>
      </a-layout-header>

      <!-- Page Content -->
      <a-layout-content style="margin: 16px; background: #fff; padding: 24px;">
        <RouterView />
      </a-layout-content>

      <!-- 📍 Footer -->
      <FooterBar />
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import SideNav from '@/components/Sidenav.vue'
import FooterBar from '@/components/Footer.vue'
import { useAuthStore } from '../store/auth'

const auth = useAuthStore()
</script>
