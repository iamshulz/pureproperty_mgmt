<script setup lang="ts">
import { ref } from 'vue'
import {  createAgent } from '../api/agent'

const agent = ref({
  firstName: '',
  lastName: '',
  email: '',
  mobileNumber: '',
})

const submitForm = async () => {
  await createAgent(agent.value)
}
</script>

<template>
  <div class="min-h-screen bg-gray-50 flex items-center justify-center p-6">
    <div class="bg-white p-8 rounded-2xl shadow-xl w-full max-w-md border border-gray-100">
      <!-- Header -->
      <div class="text-center mb-8">
        <h2 class="text-3xl font-extrabold text-gray-900">Create Agent</h2>
        <p class="text-gray-500 mt-2">Enter the details to register a new property agent.</p>
      </div>

      <form @submit.prevent="submitForm" class="space-y-5">
        <!-- Name Group -->
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">First Name</label>
            <input
              v-model="agent.firstName"
              type="text"
              placeholder="John"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
            />
          </div>
          <div>
            <label class="block text-sm font-semibold text-gray-700 mb-1">Last Name</label>
            <input
              v-model="agent.lastName"
              type="text"
              placeholder="Doe"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
            />
          </div>
        </div>

        <!-- Email -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
          <input
            v-model="agent.email"
            type="email"
            placeholder="john.doe@example.com"
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <!-- Mobile -->
        <div>
          <label class="block text-sm font-semibold text-gray-700 mb-1">Mobile Number</label>
          <input
            v-model="agent.mobileNumber"
            type="tel"
            placeholder="+1 (555) 000-0000"
            class="w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
          />
        </div>

        <!-- Submit Button -->
        <button
          type="submit"
          class="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-4 rounded-lg shadow-lg transform active:scale-95 transition-all duration-150 mt-4"
        >
          Register Agent
        </button>
      </form>
    </div>
  </div>
</template>

<style scoped>
/* Optional: specific brand color if not using standard Tailwind colors */
.green-text {
  color: #42b883;
}
</style>