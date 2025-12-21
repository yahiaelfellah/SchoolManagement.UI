<template>
  <a-layout-footer class="app-footer">
    <div class="footer-bottom">
      {{ t('footer.text', { year: new Date().getFullYear() }) }}
    </div>
  </a-layout-footer>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
const { t } = useI18n()
</script>

<style scoped>
.app-footer {
  background: #f0f2f5;
  color: rgba(0, 0, 0, 0.65);
  font-size: 14px;
}

.footer-section {
  margin-bottom: 16px;
}

.footer-logo {
  font-size: 20px;
  font-weight: bold;
  color: #1677ff;
  margin-bottom: 8px;
}

.footer-section h4 {
  font-size: 16px;
  margin-bottom: 8px;
  color: rgba(0, 0, 0, 0.85);
}

.footer-section ul {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-section ul li {
  margin-bottom: 4px;
}

.footer-section ul li a {
  color: rgba(0, 0, 0, 0.65);
  text-decoration: none;
  transition: color 0.3s;
}

.footer-section ul li a:hover {
  color: #1677ff;
}

.social-icons a {
  margin-right: 10px;
  color: rgba(0, 0, 0, 0.65);
  font-size: 18px;
  transition: color 0.3s;
}

.social-icons a:hover {
  color: #1677ff;
}

.footer-bottom {
  text-align: center;
  margin-top: 16px;
  color: rgba(0, 0, 0, 0.45);
}
</style>
