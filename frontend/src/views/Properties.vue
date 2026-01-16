<script setup lang="ts">
import { getProperties, type PropertyPayload } from '@/api/property.ts'
import { type AgentResponse, getAllAgents } from '@/api/agent.ts'
import { ref } from 'vue'

const properties = ref([])
const agents = ref<AgentResponse[]>([])
const newProperty = ref<PropertyPayload>({
  agentId: '',
  title: '',
})

const isLoading = ref(false)
const message = ref({ text: '', isError: false })

const fetchData = async () => {
  try {
    const [agentsData, propsData] = await Promise.all([getAllAgents(), getProperties()])
    agents.value = agentsData
    properties.value = propsData
  } catch (err) {
    console.error('Failed to fetch data', err)
  }
}

const handleCreateProperty = async () => {
  if (!newProperty.value.agentId || !newProperty.value.title) return

  isLoading.value = true
  try {
    await createProperty(newProperty.value)
    message.value = { text: 'Property created successfully!', isError: false }
    newProperty.value = { agentId: '', title: '' }
    await fetchData()
  } catch (err: any) {
    message.value = {
      text: err.response?.data?.message || 'Error creating property',
      isError: true,
    }
  } finally {
    isLoading.value = false
  }
}
</script>

<template>
  <div class="p-6 space-y-8">
    <!-- Create Property Form -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <h3 class="text-lg font-bold text-gray-800 mb-6">Add New Property</h3>

      <form @submit.prevent="handleCreateProperty" class="space-y-5">
        <div
          v-if="message.text"
          :class="[
            'p-4 rounded-lg text-sm',
            message.isError ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700',
          ]"
        >
          {{ message.text }}
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Property Title</label>
          <input
            v-model="newProperty.title"
            type="text"
            placeholder="e.g. Sunset Heights Apartment"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Assign Agent</label>
          <select
            v-model="newProperty.agentId"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            required
          >
            <option value="" disabled>Select an agent</option>
            <option v-for="agent in agents" :key="agent.id" :value="agent.id">
              {{ agent.firstName }} {{ agent.lastName }} ({{ agent.email }})
            </option>
          </select>
        </div>

        <div class="flex justify-end pt-2">
          <button
            type="submit"
            :disabled="isLoading"
            class="bg-blue-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
          >
            {{ isLoading ? 'Creating...' : 'Create Property' }}
          </button>
        </div>
      </form>
    </div>
  </div>
</template>
