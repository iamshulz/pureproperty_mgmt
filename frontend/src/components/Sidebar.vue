<script setup lang="ts"></script>
<template>
  <aside class="w-64 bg-gray-900 text-gray-100 flex flex-col">
    <div class="p-6 text-xl font-bold border-b border-gray-700">
      <router-link
        to="/"
        class="block px-4 py-2 rounded "
      >
        Dashboard
      </router-link>
    </div>

    <nav class="flex-1 p-4 space-y-2">
      <router-link
        to="/agents"
        class="block px-4 py-2 rounded hover:bg-gray-700"
        active-class="bg-gray-700"
      >
        Agents
      </router-link>

      <router-link
        to="/properties"
        class="ml-2 block px-4 py-2 rounded hover:bg-gray-700"
        active-class="bg-gray-700"
      >
        Properties
      </router-link>

      <router-link
        to="/families"
        class="ml-4 block px-4 py-2 rounded hover:bg-gray-700"
        active-class="bg-gray-700"
      >
        Families
      </router-link>

      <router-link
        to="/tenants"
        class="ml-6 block px-4 py-2 rounded hover:bg-gray-700"
        active-class="bg-gray-700"
      >
        Tenants
      </router-link>

      <router-link
        to="/reminders"
        class="ml-2 block px-4 py-2 rounded hover:bg-gray-700"
        active-class="bg-gray-700"
      >
        Reminders
      </router-link>

      <router-link
        to="/notes"
        class="ml-2 block px-4 py-2 rounded hover:bg-gray-700"
        active-class="bg-gray-700"
      >
        Notes
      </router-link>
    </nav>
  </aside>
</template>
