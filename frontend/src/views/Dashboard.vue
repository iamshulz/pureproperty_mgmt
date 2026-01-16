<script setup lang="ts">
const stats = [
  { label: 'Agents', value: 12 },
  { label: 'Properties', value: 48 },
  { label: 'Tenants', value: 132 },
]
</script>

<template>
  <div class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div v-for="stat in stats" :key="stat.label" class="bg-white p-6 rounded-lg shadow">
        <p class="text-sm text-gray-500">{{ stat.label }}</p>
        <p class="text-2xl font-bold">{{ stat.value }}</p>
      </div>
    </div>

    <div class="bg-white p-6 rounded-lg shadow">
      <h2 class="text-lg font-semibold mb-4">Recent Activity</h2>
      <p class="text-gray-500 text-sm">No recent activity.</p>
    </div>
  </div>
</template>
