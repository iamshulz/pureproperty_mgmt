<script setup lang="ts">
import {
  createProperties,
  deleteProperty,
  getProperties,
  type PropertyPayload,
  type PropertyResponse,
  updateProperty,
} from '@/api/property.ts'
import { type AgentResponse, getAllAgents } from '@/api/agent.ts'
import { onMounted, ref } from 'vue'

const properties = ref([])
const agents = ref<AgentResponse[]>([])
const editingId = ref<string | null>(null)
const editForm = ref<Partial<PropertyResponse>>({})

const newProperty = ref<PropertyPayload>({
  agentId: '',
  title: '',
})

const isLoading = ref(false)
const message = ref({ text: '', isError: false })

const startEdit = (prop: PropertyResponse) => {
  editingId.value = prop.id
  editForm.value = { ...prop }
}

const cancelEdit = () => {
  editingId.value = null
  editForm.value = {}
}

const fetchData = async () => {
  try {
    const [agentsData, propsData] = await Promise.all([getAllAgents(), getProperties()])
    agents.value = agentsData
    properties.value = propsData
  } catch (err) {
    console.error('Failed to fetch data', err)
  }
}

const handleDeleteProperty = async (id: string) => {
  try {
    await deleteProperty(id)
    await fetchData()
  } catch (err) {
    console.error(err)
  }
}

const handleUpdate = async (id: string) => {
  isLoading.value = true
  try {
    await updateProperty(id, {
      title: editForm.value.title!,
    })
    editingId.value = null
    await fetchData()
    message.value = { text: 'Property updated!', isError: false }
  } catch (err) {
    message.value = { text: 'Update failed', isError: true }
  } finally {
    isLoading.value = false
  }
}

const handleCreateProperty = async () => {
  if (!newProperty.value.agentId || !newProperty.value.title) return

  isLoading.value = true
  try {
    await createProperties(newProperty.value)
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

onMounted(() => {
  fetchData()
})
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

    <!-- Properties Table -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="bg-gray-50 px-8 py-4 border-b border-gray-100">
        <h2 class="text-xl font-bold text-gray-800">Properties</h2>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="text-xs uppercase text-gray-500 bg-gray-50/50">
              <th class="px-8 py-4 font-semibold">Title</th>
              <th class="px-8 py-4 font-semibold">Assigned Agent</th>
              <th class="px-8 py-4 font-semibold">Created At</th>
              <th class="px-8 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="prop in properties"
              :key="prop.id"
              @dblclick="startEdit(prop)"
              class="hover:bg-gray-50 transition-colors group cursor-pointer"
            >
              <!-- Title Column -->
              <td class="px-8 py-4 font-medium text-gray-900">
                <input
                  v-if="editingId === prop.id"
                  v-model="editForm.title"
                  class="border rounded px-2 py-1 w-full focus:ring-2 focus:ring-blue-500 outline-none"
                />
                <span v-else>{{ prop.title }}</span>
              </td>

              <!-- Agent Dropdown Column -->
              <td class="px-8 py-4 text-gray-600">
                <span>
                  {{ agents.find((a) => a.id === prop.agentId)?.firstName || 'Unknown Agent' }}
                </span>
              </td>

              <td class="px-8 py-4 text-gray-500 text-sm">
                {{ new Date(prop.createdAt).toLocaleDateString() }}
              </td>

              <!-- Actions Column -->
              <td class="px-8 py-4 text-right">
                <div v-if="editingId === prop.id" class="flex justify-end gap-2">
                  <button
                    @click.stop="handleUpdate(prop.id)"
                    class="text-green-600 hover:text-green-800 font-bold text-xs uppercase tracking-wider"
                  >
                    Save
                  </button>
                  <button
                    @click.stop="cancelEdit"
                    class="text-gray-400 hover:text-gray-600 font-bold text-xs uppercase tracking-wider"
                  >
                    Cancel
                  </button>
                </div>
                <button
                  v-else
                  @click.stop="handleDeleteProperty(prop.id)"
                  class="text-red-500 hover:text-red-700 font-medium text-sm transition-colors opacity-0 group-hover:opacity-100"
                >
                  Delete
                </button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
