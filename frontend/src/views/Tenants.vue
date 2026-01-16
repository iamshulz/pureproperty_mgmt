<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { getAllFamily, type FamilyResponse } from '@/api/family'
import { createTenant, getTenants, type TenantPayload, type TenantResponse } from '@/api/tenant'


const families = ref<FamilyResponse[]>([])
const isLoading = ref(false)
const message = ref({ text: '', isError: false })

const newTenant = ref<TenantPayload>({
  familyId: '',
  firstName: '',
  middleName: '',
  lastName: '',
})

const fetchData = async () => {
  try {
    const [familiesData] = await Promise.all([getAllFamily()])
    families.value = familiesData
    
  } catch (err) {
    console.error('Failed to load data', err)
  }
}

const handleCreateTenant = async () => {
  if (!newTenant.value.familyId || !newTenant.value.firstName || !newTenant.value.lastName) return

  isLoading.value = true
  message.value = { text: '', isError: false }

  try {
    await createTenant(newTenant.value)
    message.value = { text: 'Tenant registered successfully!', isError: false }
    // Reset form
    newTenant.value = { familyId: '', firstName: '', middleName: '', lastName: '' }
    await fetchData()
  } catch (err: any) {
    message.value = {
      text: err.response?.data?.message || 'Error creating tenant',
      isError: true,
    }
  } finally {
    isLoading.value = false
  }
}

onMounted(fetchData)
</script>

<template>
  <div class="p-6 space-y-8">
    <!-- Create Tenant Form -->
    <div class="bg-white rounded-xl shadow-sm border border-gray-100 p-8">
      <h3 class="text-lg font-bold text-gray-800 mb-6">Register New Tenant</h3>

      <form @submit.prevent="handleCreateTenant" class="space-y-5">
        <div
          v-if="message.text"
          :class="[
            'p-4 rounded-lg text-sm',
            message.isError ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-700',
          ]"
        >
          {{ message.text }}
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <!-- Family Selection -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">Assign to Family</label>
            <select
              v-model="newTenant.familyId"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white text-gray-900"
              required
            >
              <option value="" disabled>Select a family group</option>
              <option v-for="family in families" :key="family.id" :value="family.id">
                Family: {{ family.lastName }}
              </option>
            </select>
          </div>

          <!-- First Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">First Name</label>
            <input
              v-model="newTenant.firstName"
              type="text"
              placeholder="e.g. Jane"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>

          <!-- Middle Name -->
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-2">Middle Name</label>
            <input
              v-model="newTenant.middleName"
              type="text"
              placeholder="e.g. Marie"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <!-- Last Name -->
          <div class="md:col-span-2">
            <label class="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
            <input
              v-model="newTenant.lastName"
              type="text"
              placeholder="e.g. Watson"
              class="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
              required
            />
          </div>
        </div>

        <div class="flex justify-end pt-4">
          <button
            type="submit"
            :disabled="isLoading"
            class="bg-blue-600 text-white px-8 py-2.5 rounded-lg font-semibold hover:bg-blue-700 disabled:bg-blue-300 transition-colors shadow-md"
          >
            {{ isLoading ? 'Processing...' : 'Add Tenant' }}
          </button>
        </div>
      </form>
    </div>


  </div>
</template>
