<script setup lang="ts">
import { createFamily, type FamilyPayload, getAllFamily, deleteFamily } from '@/api/family.ts'
import { onMounted, ref } from 'vue'
import { deleteProperty, getProperties } from '@/api/property.ts'

const isLoading = ref(false)
const message = ref({ text: '', isError: false })

const newFamily = ref<FamilyPayload>({
  propertyId: '',
  lastName: '',
})
const properties = ref([])
const families = ref<FamilyPayload[]>([])

const fetchData = async () => {
  try {
    const [propsData, familiesData] = await Promise.all([getProperties(), getAllFamily()])
    properties.value = propsData
    families.value = familiesData
  } catch (err) {
    console.error('Failed to load data', err)
  }
}

const handleDeleteFamily = async (id: string) => {
  try {
    await deleteFamily(id)
    await fetchData()
  } catch (err) {
    console.error(err)
  }
}

const handleCreateFamily = async () => {
  if (!newFamily.value.propertyId || !newFamily.value.lastName) return

  isLoading.value = true
  message.value = { text: '', isError: false }

  try {
    await createFamily(newFamily.value)
    message.value = { text: 'Family created successfully!', isError: false }
    newFamily.value = { propertyId: '', lastName: '' }
    await fetchData()
  } catch (err: any) {
    message.value = {
      text: err.response?.data?.message || 'Error creating family',
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
    <!-- Create Family Form -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <h3 class="text-lg font-bold text-gray-800 mb-6">Register New Family/Landlord</h3>

      <form @submit.prevent="handleCreateFamily" class="space-y-5">
        <div
          v-if="message.text"
          :class="[
            'p-4 rounded-lg text-sm',
            message.isError ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700',
          ]"
        >
          {{ message.text }}
        </div>

        <!-- Property Dropdown -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2">Assign to Property</label>
          <select
            v-model="newFamily.propertyId"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
            required
          >
            <option value="" disabled>Select a property</option>
            <option v-for="prop in properties" :key="prop.id" :value="prop.id">
              {{ prop.title }}
            </option>
          </select>
        </div>

        <!-- Last Name Input -->
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-2"
            >Family/Landlord Last Name</label
          >
          <input
            v-model="newFamily.lastName"
            type="text"
            placeholder="e.g. Smith"
            class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            required
          />
        </div>

        <div class="flex justify-end pt-2">
          <button
            type="submit"
            :disabled="isLoading"
            class="bg-blue-600 text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300 transition-colors"
          >
            {{ isLoading ? 'Processing...' : 'Register Family' }}
          </button>
        </div>
      </form>
    </div>

    <!-- Simple Table to show Families -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div class="bg-gray-50 px-8 py-4 border-b border-gray-100">
        <h2 class="text-xl font-bold text-gray-800">Families</h2>
      </div>
      <div class="overflow-x-auto">
        <table class="w-full text-left">
          <thead>
            <tr class="text-xs uppercase text-gray-500 bg-gray-50/50">
              <th class="px-8 py-4 font-semibold">Last Name</th>
              <th class="px-8 py-4 font-semibold">Property</th>
              <th class="px-8 py-4 font-semibold">Actions</th>
            </tr>
          </thead>
          <tbody class="divide-y divide-gray-100">
            <tr
              v-for="family in families"
              :key="family.id"
              class="hover:bg-gray-50 transition-colors group cursor-pointer"
            >
              <td class="px-8 py-4 font-medium text-gray-900">{{ family.lastName }}</td>
              <td class="px-8 py-4 text-gray-600">
                {{
                  properties.find((p) => p.id === family.propertyId)?.title || 'Unknown Property'
                }}
              </td>
              <td class="px-8 py-4">
                <button
                  @click.stop="handleDeleteFamily(family.id)"
                  class="text-red-500 hover:text-red-700 font-medium text-sm transition-colors cursor-pointer opacity-0 group-hover:opacity-100"
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
