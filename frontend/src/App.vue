<script setup lang="ts">
import { RouterLink, RouterView } from 'vue-router'
import Topbar from '@/components/Topbar.vue'
import Sidebar from '@/components/Sidebar.vue'
</script>

<template>
  <div class="flex h-screen bg-gray-100">
    <Sidebar />

    <div class="flex flex-col flex-1">
      <Topbar />

      <main class="p-6 overflow-y-auto">
        <RouterView />
      </main>
    </div>
  </div>
</template>

<style scoped></style>
