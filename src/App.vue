<template>
  <a-config-provider
    :direction="direction"
    :theme="{
      token: {
        colorPrimary: '#1677ff',
        borderRadius: 8,
      },
    }"
  >
    <RouterView />
  </a-config-provider>
</template>

<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useSettingsStore } from './store/settings'

const settings = useSettingsStore()
const { direction } = storeToRefs(settings)
</script>

<style>
html, body, #app {
  height: 100%;
  margin: 0;
  background-color: #f0f2f5;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', sans-serif;
}
</style>
