<template>
  <a-badge-ribbon
    v-if="op.newFeature"
    :text="t('operations.new')"
    color="red"
  >
    <a-card
      class="operation-card"
      :class="{ disabled: op.disabled }"
      hoverable
      @click="!op.disabled && emit('click', op.key)"
    >
      <div class="card-content">
        <div class="icon-wrapper">
          <component
            :is="op.icon"
            class="card-icon"
          />
        </div>
        <span class="card-title">{{ t(op.title) }}</span>
        <p
          v-if="op.description"
          class="card-description"
        >
          {{ t(op.description) }}
        </p>
      </div>
    </a-card>
  </a-badge-ribbon>
  <a-card
    v-else
    class="operation-card"
    :class="{ disabled: op.disabled }"
    hoverable
    @click="!op.disabled && emit('click', op.key)"
  >
    <div class="card-content">
      <div class="icon-wrapper">
        <component
          :is="op.icon"
          class="card-icon"
        />
      </div>
      <span class="card-title">{{ t(op.title) }}</span>
      <p
        v-if="op.description"
        class="card-description"
      >
        {{ t(op.description) }}
      </p>
    </div>
  </a-card>
</template>

<script setup lang="ts">
import { useI18n } from 'vue-i18n'
import { defineProps, defineEmits } from 'vue'

const { t } = useI18n()

const props = defineProps({
    op: {
        type: Object,
        required: true,
    },
})

const emit = defineEmits(['click'])
</script>

<style scoped>
.operation-card {
    text-align: center;
    border-radius: 12px;
    transition: all 0.3s ease;
    cursor: pointer;
    position: relative;
}

.operation-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 6px 12px rgba(0, 0, 0, 0.1);
}

.operation-card.disabled {
    opacity: 0.5;
    pointer-events: none;
}

.card-content {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 28px 0;
}

.icon-wrapper {
    position: relative;
}

.card-icon {
    font-size: 34px;
    color: var(--ant-primary-color, #1677ff);
    margin-bottom: 10px;
}

.card-title {
    font-size: 15px;
    font-weight: 500;
}

.card-description {
    font-size: 13px;
    color: #666;
    margin-top: 6px;
}

.new-tag {
    position: absolute;
    top: -6px;
    right: -12px;
    font-size: 10px;
}

.operation-card.disabled {
    background-color: #f5f5f5;
    color: #999;
    border: 1px solid #ddd;
}
</style>
