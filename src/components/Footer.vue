<template>
    <a-layout-footer style="text-align: center;">
        {{ t('footer.text', { year: new Date().getFullYear() }) }}
    </a-layout-footer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<style scoped>
a-layout-footer {
    background: #f0f2f5;
    padding: 16px 0;
    color: rgba(0, 0, 0, 0.45);
}
</style>
