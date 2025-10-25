<template>
  <a-layout style="min-height: 100vh">
    <SideNav />

    <a-layout>
      <!-- Header -->
      <a-layout-header
        style="background: #fff; padding: 0 16px; display: flex; justify-content: space-between; align-items: center;"
      >
        <div style="display: flex; align-items: center; gap: 12px;">
          <strong>{{ t('dashboard.title') }}</strong>
        </div>

        <div style="display: flex; align-items: center; gap: 16px;">
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
          <strong>{{ auth.user?.name }}</strong>
        </div>
      </a-layout-header>

      <!-- Page Content -->
      <a-layout-content style="margin: 16px; background: #fff; padding: 24px;">
        <RouterView />
      </a-layout-content>

      <FooterBar />
    </a-layout>
  </a-layout>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useSettingsStore } from '../store/settings'
import { useAuthStore } from '../store/auth'
import SideNav from '@/components/Sidenav.vue'
import FooterBar from '@/components/Footer.vue'

const { t } = useI18n()
const auth = useAuthStore()
const settings = useSettingsStore()
const { locale } = storeToRefs(settings)
const setLocale = settings.setLocale
</script>
