<script setup lang="ts">
import { ref, onMounted } from 'vue'
import {
  type AgentPayload,
  type AgentResponse,
  createAgent,
  deleteAgent,
  getAllAgents,
  updateAgent,
} from '../api/agent'

const agent = ref<AgentPayload>({
  firstName: '',
  lastName: '',
  email: '',
  mobileNumber: '',
})

const agentsList = ref<AgentResponse[]>([])
const message = ref({ text: '', isError: false })
const isLoading = ref(false)

const editForm = ref<Partial<AgentResponse>>({})
const editingId = ref<string | null>(null)

const handleCreateAgent = async () => {
  isLoading.value = true
  message.value = { text: '', isError: false }

  try {
    await createAgent(agent.value)
    message.value = { text: 'Agent created successfully!', isError: false }
    // Reset form
    agent.value = { firstName: '', lastName: '', email: '', mobileNumber: '' }
  } catch (error: any) {
    message.value = {
      text: error.response?.data?.message || 'Failed to create agent',
      isError: true,
    }
  } finally {
    isLoading.value = false
    await handleLoadAgents()
  }
}

const startEdit = (agent: AgentResponse) => {
  editingId.value = agent.id
  editForm.value = { ...agent }
}

const cancelEdit = () => {
  editingId.value = null
  editForm.value = {}
}

const handleUpdate = async (id: string) => {
  isLoading.value = true
  try {
    await updateAgent(id, editForm.value as AgentPayload)
    editingId.value = null
    editForm.value = {}
    await handleLoadAgents()

    message.value = { text: 'Agent updated successfully!', isError: false }
  } catch (error) {
    console.log('Error updating agent')
  }
  isLoading.value = false
}

const handleLoadAgents = async () => {
  try {
    agentsList.value = await getAllAgents()
  } catch (error) {
    console.error('Failed to load agents:', error)
  }
}

const handleDeleteAgent = async (id: string) => {
  try {
    await deleteAgent(id)
  } catch (error) {
    console.error('Failed to delete agent:', error)
  }

  await handleLoadAgents()
}

onMounted(() => {
  handleLoadAgents()
})
</script>

<template>
  <div class="space-y-4">
    <div class="mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <!-- Form Header -->
      <div class="bg-gray-50 px-8 py-4 border-b border-gray-100">
        <h2 class="text-xl font-bold text-gray-800">Add New Agent</h2>
      </div>

      <form @submit.prevent="handleCreateAgent" class="p-8 space-y-6">
        <!-- Status Messages -->
        <div
          v-if="message.text"
          :class="[
            'p-4 rounded-lg text-sm font-medium',
            message.isError ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700',
          ]"
        >
          {{ message.text }}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- First Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <input
              v-model="agent.firstName"
              type="text"
              required
              placeholder="e.g. Michael"
              class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>

          <!-- Last Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <input
              v-model="agent.lastName"
              type="text"
              required
              placeholder="e.g. Scott"
              class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
            />
          </div>
        </div>

        <!-- Email Address -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
          <input
            v-model="agent.email"
            type="email"
            required
            placeholder="michael@dundermifflin.com"
            class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        <!-- Mobile Number -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Mobile Number (Optional)</label
          >
          <input
            v-model="agent.mobileNumber"
            type="tel"
            placeholder="+1 (555) 000-0000"
            class="w-full px-4 py-2.5 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
          />
        </div>

        <!-- Submit -->
        <div class="flex justify-end pt-4">
          <button
            type="submit"
            :disabled="isLoading"
            class="px-8 py-3 bg-blue-600 hover:bg-blue-700 disabled:bg-blue-300 text-white font-semibold rounded-lg shadow-md transition-colors duration-200 flex items-center gap-2"
          >
            <span v-if="isLoading">Processing...</span>
            <span v-else>Create Agent</span>
          </button>
        </div>
      </form>
    </div>

    <div class="mx-auto bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <!-- Agent Table -->
      <div class="bg-gray-50 px-8 py-4 border-b border-gray-100">
        <h2 class="text-xl font-bold text-gray-800">Agents</h2>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider">
              <th class="px-8 py-4 font-semibold">Name</th>
              <th class="px-8 py-4 font-semibold">Email</th>
              <th class="px-8 py-4 font-semibold">Mobile</th>
              <th class="px-8 py-4 font-semibold text-right">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="agent in agentsList"
              :key="agent.id"
              @dblclick="startEdit(agent)"
              class="hover:bg-gray-50 transition-colors cursor-pointer group"
              title="Double click to edit"
            >
              <!-- Name Column -->
              <td class="px-8 py-4">
                <div v-if="editingId === agent.id" class="flex gap-2">
                  <input
                    v-model="editForm.firstName"
                    class="border rounded px-2 py-1 w-24 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                  <input
                    v-model="editForm.lastName"
                    class="border rounded px-2 py-1 w-24 text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                  />
                </div>
                <div v-else class="font-medium text-gray-900">
                  {{ agent.firstName }} {{ agent.lastName }}
                </div>
              </td>

              <!-- Email Column -->
              <td class="px-8 py-4 text-gray-600 text-sm">

                <span>{{ agent.email }}</span>
              </td>

              <!-- Mobile Column -->
              <td class="px-8 py-4 text-gray-600 text-sm">
                <input
                  v-if="editingId === agent.id"
                  v-model="editForm.mobileNumber"
                  class="border rounded px-2 py-1 w-full text-sm focus:ring-1 focus:ring-blue-500 outline-none"
                />
                <span v-else>{{ agent.mobileNumber || 'N/A' }}</span>
              </td>

              <!-- Actions Column -->
              <td class="px-8 py-4 text-right">
                <div v-if="editingId === agent.id" class="flex justify-end gap-2">
                  <button
                    @click.stop="handleUpdate(agent.id)"
                    class="text-green-600 hover:text-green-800 font-bold text-xs uppercase tracking-wider"
                  >
                    Update
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
                  @click.stop="handleDeleteAgent(agent.id)"
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
