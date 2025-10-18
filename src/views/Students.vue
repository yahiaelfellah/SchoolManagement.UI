<template>
  <div>
    <h2>Students</h2>
    <a-table :data-source="students" :columns="columns" row-key="id" />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'

interface Student {
  id: number
  name: string
  grade: string
}

const students = ref<Student[]>([
  { id: 1, name: 'Alice', grade: 'A' },
  { id: 2, name: 'Bob', grade: 'B' },
])

const columns = [
  { title: 'Name', dataIndex: 'name' },
  { title: 'Grade', dataIndex: 'grade' },
]
</script>
