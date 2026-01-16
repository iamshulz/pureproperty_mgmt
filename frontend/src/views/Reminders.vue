<script setup lang="ts">
import { ref, onMounted, watch, computed, watchEffect, toRef } from 'vue'
import { getAllAgents, type AgentResponse } from '@/api/agent'
import { getProperties, type PropertyPayload, type PropertyResponse } from '@/api/property'
import {
  createReminder,
  getRemindersByAgent,
  type ReminderPayload,
  updateReminder,
  type UpdateReminderPayload,
} from '@/api/reminder'

const agents = ref<AgentResponse[]>([])
const properties = ref<{ id: string; title: string; agentId: string }[]>([])

const filteredReminders = ref<any[]>([])
const agentMail = ref('all')

const isLoading = ref(false)
const message = ref({ text: '', isError: false })
const processingId = ref<string | null>(null)

const newReminder = ref<ReminderPayload>({
  email: '',
  propertyId: '',
  propertyName: '',
  title: '',
  eventDate: '',
})

const handleCreateReminder = async () => {
  isLoading.value = true
  message.value = { text: '', isError: false }

  try {
    await createReminder(newReminder.value)
    message.value = { text: 'Reminder set successfully!', isError: false }
    // Reset form
    newReminder.value = { email: '', propertyId: '', propertyName: '', title: '', eventDate: '' }
    await fetchData()
  } catch (err: any) {
    message.value = {
      text: err.response?.data?.message || 'Error creating reminder',
      isError: true,
    }
  } finally {
    isLoading.value = false
  }
}

const handleLoadReminders = async () => {
  if (agentMail.value === 'all') {
    filteredReminders.value = []
    return
  }

  try {
    isLoading.value = true
    const data = await getRemindersByAgent({ email: agentMail.value })
    filteredReminders.value = data
  } catch (err) {
    console.error('Error fetching reminders:', err)
  } finally {
    isLoading.value = false
  }
}

watch(agentMail, () => {
  handleLoadReminders()
})

const fetchData = async () => {
  try {
    const [agentsData, propsData] = await Promise.all([getAllAgents(), getProperties()])
    agents.value = agentsData
    properties.value = propsData

    // Optionally load for the first selected agent if not "all"
    if (agentMail.value !== 'all') {
      await handleLoadReminders()
    }
  } catch (err) {
    console.error('Failed to load data', err)
  }
}

const handleSetDone = async (id: string, rem: UpdateReminderPayload) => {
  try {
    const result = await updateReminder(id, rem)
    message.value = { text: 'Reminder updated successfully!', isError: false }
    processingId.value = id

    await handleLoadReminders()
  } catch (err) {
    console.error('Failed to update reminder', err)
    message.value = { text: 'Failed to update reminder', isError: true }
  }
}

onMounted(fetchData)
</script>

<template>
  <div class="p-6 space-y-8">
    <!-- Create Reminder Form -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <h3 class="text-lg font-bold text-gray-800 mb-6">Set New Reminder</h3>

      <form @submit.prevent="handleCreateReminder" class="space-y-6">
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
          <!-- Agent Selection (Email) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2"
              >Assign to Agent (Email)</label
            >
            <select
              v-model="newReminder.email"
              required
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="" disabled>Select agent by email</option>
              <option v-for="agent in agents" :key="agent.id" :value="agent.email">
                {{ agent.firstName }} ({{ agent.email }})
              </option>
            </select>
          </div>

          <!-- Property Selection (ID & Name) -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Related Property</label>
            <select
              v-model="newReminder.propertyId"
              required
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="" disabled>Select a property</option>
              <option v-for="prop in properties" :key="prop.id" :value="prop.id">
                {{ prop.title }}
              </option>
            </select>
          </div>

          <!-- Title -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">Reminder Title</label>
            <input
              v-model="newReminder.title"
              type="text"
              placeholder="e.g. Inspect Roof Leaks"
              required
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <!-- Event Date -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">Event Date & Time</label>
            <input
              v-model="newReminder.eventDate"
              type="datetime-local"
              required
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>
        </div>

        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="isLoading"
            class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg font-bold transition-all disabled:bg-blue-300 shadow-md"
          >
            {{ isLoading ? 'Saving...' : 'Create Reminder' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Simple Table to show Families -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="bg-gray-50 px-8 py-4 border-b border-gray-100 justify-between">
        <h2 class="text-xl font-bold text-gray-800">Reminders</h2>
        <div class="flex items-center gap-3">
          <label class="text-sm text-gray-500 font-medium">Filter by Agent:</label>
          <select
            v-model="agentMail"
            class="max-w-50 border rounded-lg px-3 py-1.5 text-sm bg-white focus:ring-2 focus:ring-blue-500 outline-none transition-all"
          >
            <option value="all">All Agents</option>
            <option v-for="agent in agents" :key="agent.id" :value="agent.email">
              {{ agent.firstName }} {{ agent.lastName }}
            </option>
          </select>
        </div>
      </div>

      <div class="overflow-x-auto">
        <table class="w-full text-left border-collapse">
          <thead>
            <tr class="bg-gray-50/50 text-gray-500 text-xs uppercase tracking-wider font-semibold">
              <th class="px-8 py-4">Title</th>
              <th class="px-8 py-4">Property</th>
              <th class="px-8 py-4">Due Date</th>
              <th class="px-8 py-4">Status</th>
              <th class="px-8 py-4">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="rem in filteredReminders"
              :key="rem.id"
              class="hover:bg-gray-50 transition-colors"
            >
              <td class="px-8 py-4 font-medium text-gray-900">{{ rem.title }}</td>
              <td class="px-8 py-4 text-gray-600 text-sm">
                {{ properties.find((p) => p.id === rem.propertyId)?.title || 'Unknown' }}
              </td>
              <td class="px-8 py-4 text-gray-500 text-sm">
                {{ new Date(rem.eventDate).toLocaleString() }}
              </td>
              <td class="px-8 py-4">
                <span
                  :class="[
                    'px-2 py-1 rounded text-xs font-bold uppercase',
                    rem.isCompleted
                      ? 'bg-green-100 text-green-700'
                      : 'bg-yellow-100 text-yellow-700',
                  ]"
                >
                  {{ rem.isCompleted ? 'Done' : 'Pending' }}
                </span>
              </td>
              <td class="px-8 py-4">
                <button
                  v-if="!rem.isCompleted"
                  type="button"
                  :disabled="processingId === rem.id"
                  class="px-4 py-2 rounded text-xs font-bold uppercase cursor-pointer bg-blue-600 text-white hover:bg-blue-700 disabled:bg-blue-300 transition-all flex items-center justify-center min-w-[100px]"
                  @click="handleSetDone(rem.id, rem)"
                >
                  {{ rem.isCompleted ? '' : 'Set as Done' }}
                </button>
              </td>
            </tr>

            <!-- Empty State for filtered results -->
            <tr v-if="filteredReminders.length === 0 || false">
              <td colspan="4" class="px-8 py-12 text-center text-gray-400 italic">
                No reminders found for this selection.
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>
