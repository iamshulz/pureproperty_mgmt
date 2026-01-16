<script setup lang="ts">
import { ref, onMounted, watch } from 'vue'
import { getAllAgents, type AgentResponse } from '@/api/agent'
import { getProperties } from '@/api/property'
import { createNote, deleteNote, getNoteByEmail, updateNote } from '@/api/note'

const agents = ref<AgentResponse[]>([])
const properties = ref<any[]>([])
const notesList = ref<NoteResponse[]>([])
const selectedAgentEmail = ref<string>('all')

const newNote = ref<NotePayload>({
  description: '',
  email: '',
  propertyName: '',
})

const isLoading = ref(false)
const message = ref({ text: '', isError: false })
const editingId = ref<string | null>(null)
const editDescription = ref('')

const fetchData = async () => {
  try {
    const [agentsData, propsData] = await Promise.all([getAllAgents(), getProperties()])
    agents.value = agentsData
    properties.value = propsData
  } catch (err) {
    console.error('Failed to load data', err)
  }
}

const handleCreateNote = async () => {
  isLoading.value = true
  message.value = { text: '', isError: false }

  try {
    await createNote(newNote.value)
    message.value = { text: 'Note added successfully!', isError: false }
    newNote.value = { description: '', email: '', propertyName: '' }
    if (selectedAgentEmail.value !== 'all') {
      await loadNotes()
    }
  } catch (err: any) {
    message.value = {
      text: err.response?.data?.message || 'Error creating note',
      isError: true,
    }
  } finally {
    isLoading.value = false
  }
}

const loadNotes = async () => {
  if (selectedAgentEmail.value === 'all') {
    notesList.value = []
    return
  }
  try {
    notesList.value = await getNoteByEmail({ email: selectedAgentEmail.value })
  } catch (err) {
    console.error('Error loading notes', err)
  }
}

const handleDeleteNote = async (id: string) => {
  try {
    await deleteNote(id)
    await loadNotes()
    message.value = { text: 'Note deleted', isError: false }
  } catch (err) {
    console.error(err)
  }
}

const startEdit = (note: NoteResponse) => {
  editingId.value = note.id
  editDescription.value = note.description
}

const handleUpdateNote = async (id: string) => {
  try {
    await updateNote(id, { description: editDescription.value })
    editingId.value = null
    await loadNotes()
    message.value = { text: 'Note updated', isError: false }
  } catch (err) {
    console.error(err)
  }
}

watch(selectedAgentEmail, loadNotes)

onMounted(fetchData)
</script>

<template>
  <div class="p-6 space-y-8">
    <!-- Create Note Form -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <h3 class="text-lg font-bold text-gray-800 mb-6">Create Property Note</h3>

      <form @submit.prevent="handleCreateNote" class="space-y-5">
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
          <!-- Agent Dropdown -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Author (Agent Email)</label>
            <select
              v-model="newNote.email"
              required
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="" disabled>Select agent</option>
              <option v-for="agent in agents" :key="agent.id" :value="agent.email">
                {{ agent.email }}
              </option>
            </select>
          </div>

          <!-- Property Dropdown -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Related Property</label>
            <select
              v-model="newNote.propertyName"
              required
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 bg-white"
            >
              <option value="" disabled>Select property</option>
              <option v-for="prop in properties" :key="prop.id" :value="prop.title">
                {{ prop.title }}
              </option>
            </select>
          </div>
        </div>

        <!-- Description -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Note Description</label>
          <textarea
            v-model="newNote.description"
            rows="4"
            placeholder="Type your notes here..."
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          ></textarea>
        </div>

        <div class="flex justify-end">
          <button
            type="submit"
            :disabled="isLoading"
            class="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2.5 rounded-lg font-bold transition-all disabled:bg-blue-300"
          >
            {{ isLoading ? 'Saving...' : 'Save Note' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Notes Display Section -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="bg-gray-50 px-8 py-4 border-b border-gray-100 flex justify-between items-center">
        <h2 class="text-xl font-bold text-gray-800">Property Notes</h2>
        <div class="flex items-center gap-3">
          <label class="text-sm text-gray-500 font-medium">View notes for:</label>
          <select
            v-model="selectedAgentEmail"
            class="border rounded-lg px-3 py-1.5 text-sm bg-white outline-none"
          >
            <option value="all">Select an agent...</option>
            <option v-for="agent in agents" :key="agent.id" :value="agent.email">
              {{ agent.email }}
            </option>
          </select>
        </div>
      </div>

      <div class="p-8 space-y-4">
        <div v-if="notesList.length === 0" class="text-center text-gray-400 py-10 italic">
          No notes found for the selected agent.
        </div>

        <div
          v-for="note in notesList"
          :key="note.id"
          class="p-5 border rounded-xl hover:shadow-md transition-shadow relative group"
        >
          <!-- ✅ Actions Overlay (Visible on Hover) -->
          <div
            class="absolute bottom-4 right-4 flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity"
          >
            <button
              @click="startEdit(note)"
              class="p-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-blue-100 hover:text-blue-600 transition-colors"
              title="Edit Note"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                />
              </svg>
            </button>
            <button
              @click="handleDeleteNote(note.id)"
              class="p-1.5 bg-gray-100 text-gray-600 rounded-lg hover:bg-red-100 hover:text-red-600 transition-colors"
              title="Delete Note"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                class="h-4 w-4"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"
                />
              </svg>
            </button>
          </div>

          <div class="flex justify-between items-start mb-2">
            <span class="text-xs font-bold text-blue-600 uppercase tracking-widest">
              {{ properties.find((p) => p.id === note.propertyId)?.title || 'Property' }}
            </span>
            <span class="text-xs text-gray-400">{{
              new Date(note.createdAt).toLocaleString()
            }}</span>
          </div>

          <!-- ✅ Toggle between Text and Edit View -->
          <div v-if="editingId === note.id" class="mt-2 space-y-3">
            <textarea
              v-model="editDescription"
              class="w-full p-3 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              rows="3"
            ></textarea>
            <div class="flex gap-2">
              <button
                @click="handleUpdateNote(note.id)"
                class="px-3 py-1 bg-blue-600 text-white text-xs font-bold rounded hover:bg-blue-700"
              >
                Save
              </button>
              <button
                @click="editingId = null"
                class="px-3 py-1 bg-gray-200 text-gray-600 text-xs font-bold rounded hover:bg-gray-300"
              >
                Cancel
              </button>
            </div>
          </div>
          <p v-else class="text-gray-700 whitespace-pre-wrap pr-12">{{ note.description }}</p>
        </div>
      </div>
    </div>
  </div>
</template>
