<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <div class="max-w-7xl mx-auto p-6 md:p-10 space-y-8 w-full flex-1">
      
      <!-- Top Title Branding Layer -->
      <div>
        <h1 class="text-2xl font-bold text-gray-900">Manage Categories (Full CRUD)</h1>
        <p class="text-sm text-gray-500 mt-1">Create, edit, or delete categories to group your expenses and income.</p>
      </div>

      <!-- Main Layout Grid Splitter -->
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        <!-- Left Column: Creation Form Block -->
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 h-fit">
          <h2 class="text-lg font-bold text-gray-800 mb-4">Add New Category</h2>
          
          <form @submit.prevent="handleSubmitCategory" class="space-y-4" novalidate>
            
            <!-- Category Name Input Field -->
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Category Name <span class="text-rose-500 font-bold">*</span>
              </label>
              <input 
                v-model="form.name" 
                type="text" 
                placeholder="e.g. Fuel, Rent, Salary" 
                class="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 text-sm transition-all duration-200" 
                :class="errors.name ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/10' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'"
              />
              <p v-if="errors.name" class="text-[11px] text-rose-600 font-semibold mt-1.5 flex items-center gap-1">
                <span>⚠️</span> {{ errors.name }}
              </p>
            </div>

            <!-- Category Flow Type Select Field -->
            <div>
              <label class="block text-sm font-medium text-gray-700">
                Type <span class="text-rose-500 font-bold">*</span>
              </label>
              <select 
                v-model="form.type" 
                class="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 text-sm transition-all duration-200"
                :class="errors.type ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'"
              >
                <option value="expense">Expense</option>
                <option value="income">Income</option>
              </select>
              <p v-if="errors.type" class="text-[11px] text-rose-600 font-semibold mt-1.5 flex items-center gap-1">
                <span>⚠️</span> {{ errors.type }}
              </p>
            </div>

            <!-- Conditional Budget Threshold Field -->
            <div v-if="form.type === 'expense'">
              <label class="block text-sm font-medium text-gray-700">Budget Limit (Rs.)</label>
              <input 
                v-model.number="form.budget_limit" 
                type="number" 
                min="0" 
                placeholder="e.g. 15000 (Optional)" 
                class="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 text-sm transition-all duration-200" 
                :class="errors.budget_limit ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/10' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'"
              />
              <p v-if="errors.budget_limit" class="text-[11px] text-rose-600 font-semibold mt-1.5 flex items-center gap-1">
                <span>⚠️</span> {{ errors.budget_limit }}
              </p>
            </div>

            <!-- Symbolic Asset/Emoji Input Field -->
            <div>
              <label class="block text-sm font-medium text-gray-700">Icon / Emoji (Optional)</label>
              <input 
                v-model="form.icon" 
                type="text" 
                placeholder="e.g. 🚗, 🍔, 💰" 
                class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm transition-all duration-200" 
              />
            </div>

            <!-- Global Action Status Messages -->
            <div v-if="globalFormError" class="flex items-center space-x-2 p-3 bg-red-50 rounded-xl text-xs text-red-600 font-semibold border border-red-100">
              <span>❌ {{ globalFormError }}</span>
            </div>
            <div v-if="formSuccess" class="flex items-center space-x-2 p-3 bg-emerald-50 rounded-xl text-xs text-emerald-600 font-semibold border border-emerald-100">
              <span>✅ Category has been created successfully.</span>
            </div>

            <!-- Creation Submission Trigger -->
            <button 
              type="submit" 
              :disabled="formLoading" 
              class="w-full flex justify-center py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400 transition duration-150"
            >
              {{ formLoading ? 'Saving changes...' : 'Save Category' }}
            </button>
          </form>
        </div>

        <!-- Right Column: Interactive Realtime Data Grid Feed -->
        <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
          <h2 class="text-lg font-bold text-gray-800 mb-4">Your Categories</h2>
          
          <!-- Async Component Collection Preloader -->
          <div v-if="loading" class="text-center py-12 text-sm text-gray-500">
            <div class="inline-block animate-spin rounded-full h-6 w-6 border-2 border-indigo-600 border-t-transparent mb-2"></div>
            <p>Fetching records from system databases...</p>
          </div>
          
          <!-- Dynamic Record Data Output Map -->
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="cat in categories" :key="cat.id" class="p-4 border border-gray-100 rounded-xl bg-gray-50 flex items-center justify-between transition hover:border-gray-200">
              <div class="flex items-center space-x-3">
                <span class="text-2xl">{{ cat.icon || '📁' }}</span>
                <div>
                  <h4 class="font-semibold text-gray-900">{{ cat.name }}</h4>
                  <div class="flex flex-wrap items-center gap-1.5 mt-1">
                    <span class="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full" :class="cat.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                      {{ cat.type }}
                    </span>
                    <span v-if="cat.type === 'expense' && cat.budget_limit" class="text-[10px] font-bold bg-amber-50 text-amber-700 border border-amber-200 px-2 py-0.5 rounded-full">
                      🎯 Limit: Rs. {{ cat.budget_limit }}
                    </span>
                  </div>
                </div>
              </div>
              
              <!-- Action Controls Row Layout -->
              <div class="flex space-x-1">
                <button @click="openEditModal(cat)" class="p-2 text-indigo-600 hover:bg-indigo-50 rounded-lg transition" title="Edit Category">
                  ✏️
                </button>
                <button @click="handleDeleteCategory(cat.id)" class="p-2 text-red-600 hover:bg-red-50 rounded-lg transition" title="Delete Category">
                  🗑️
                </button>
              </div>
            </div>
            
            <!-- Empty Log State Intercept View -->
            <div v-if="categories.length === 0" class="text-gray-400 text-sm col-span-2 text-center py-12">
              No categories found. Build layout tracking indices using the form.
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal Layer Block: Update Action Panel Workspace -->
    <div v-if="showEditModal" class="fixed inset-0 bg-slate-900/40 flex items-center justify-center p-4 z-50 backdrop-blur-sm animate-in fade-in duration-150">
      <div class="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-gray-50 scale-in duration-150">
        
        <div class="flex justify-between items-center border-b pb-3">
          <h3 class="text-lg font-bold text-gray-900">Edit Category</h3>
          <button @click="showEditModal = false" class="text-gray-400 hover:text-gray-600 text-sm focus:outline-none">✕</button>
        </div>

        <form @submit.prevent="handleUpdateCategory" class="space-y-4" novalidate>
          
          <!-- Edit: Name Input -->
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Category Name <span class="text-rose-500 font-bold">*</span>
            </label>
            <input 
              v-model="editForm.name" 
              type="text" 
              class="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 text-sm transition-all duration-200" 
              :class="editErrors.name ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/10' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'"
            />
            <p v-if="editErrors.name" class="text-[11px] text-rose-600 font-semibold mt-1.5 flex items-center gap-1">
              <span>⚠️</span> {{ editErrors.name }}
            </p>
          </div>

          <!-- Edit: Type Selector -->
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Type <span class="text-rose-500 font-bold">*</span>
            </label>
            <select 
              v-model="editForm.type" 
              class="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm bg-white focus:outline-none focus:ring-2 text-sm transition-all duration-200"
              :class="editErrors.type ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'"
            >
              <option value="expense">Expense</option>
              <option value="income">Income</option>
            </select>
            <p v-if="editErrors.type" class="text-[11px] text-rose-600 font-semibold mt-1.5 flex items-center gap-1">
              <span>⚠️</span> {{ editErrors.type }}
            </p>
          </div>

          <!-- Edit: Conditional Budget Metric -->
          <div v-if="editForm.type === 'expense'">
            <label class="block text-sm font-medium text-gray-700">Budget Limit (Rs.)</label>
            <input 
              v-model.number="editForm.budget_limit" 
              type="number" 
              min="0" 
              placeholder="e.g. 15000" 
              class="mt-1 block w-full px-3 py-2 border rounded-lg shadow-sm focus:outline-none focus:ring-2 text-sm transition-all duration-200" 
              :class="editErrors.budget_limit ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/10' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'"
            />
            <p v-if="editErrors.budget_limit" class="text-[11px] text-rose-600 font-semibold mt-1.5 flex items-center gap-1">
              <span>⚠️</span> {{ editErrors.budget_limit }}
            </p>
          </div>

          <!-- Edit: Icon Representation -->
          <div>
            <label class="block text-sm font-medium text-gray-700">Icon / Emoji</label>
            <input 
              v-model="editForm.icon" 
              type="text" 
              class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm" 
            />
          </div>

          <!-- Global Edit Level Error Banner -->
          <div v-if="globalEditError" class="flex items-center space-x-2 p-3 bg-red-50 rounded-xl text-xs text-red-600 font-semibold border border-red-100">
            <span>❌ {{ globalEditError }}</span>
          </div>

          <!-- Modal Footer Interactive Action Options Panel -->
          <div class="flex justify-end space-x-3 pt-2">
            <button type="button" @click="showEditModal = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition duration-150">
              Cancel
            </button>
            <button type="submit" :disabled="editLoading" class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg disabled:bg-indigo-400 transition duration-150">
              {{ editLoading ? 'Updating records...' : 'Update Category' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';
import Swal from 'sweetalert2';

const categories = ref([]);
const loading = ref(true);

// Pre-Validation Error State Repositories
const errors = ref({});
const editErrors = ref({});

// Global Operations Errors Refs Map
const globalFormError = ref('');
const globalEditError = ref('');

// Form Submission Actions Loading Monitors
const formLoading = ref(false);
const formSuccess = ref(false);
const form = ref({ name: '', type: 'expense', icon: '', budget_limit: '' });

// Dialog Modal State Variables Mapping Matrix Contexts
const showEditModal = ref(false);
const editLoading = ref(false);
const selectedCategoryId = ref(null);
const editForm = ref({ name: '', type: 'expense', icon: '', budget_limit: '' });

onMounted(() => { 
  fetchCategories(); 
});

const fetchCategories = async () => {
  try {
    loading.value = true;
    const response = await api.get('/categories');
    categories.value = response.data;
  } catch (error) { 
    console.error("Infrastructure log channel caught a category download system exception:", error); 
  } finally { 
    loading.value = false; 
  }
};

// JavaScript Client-Side Data Integrity Validation Engine (Creation Form)
const validateCreationFormInput = () => {
  errors.value = {};
  let isValidStatus = true;

  if (!form.value.name || !form.value.name.trim()) {
    errors.value.name = "The category name is required.";
    isValidStatus = false;
  }

  if (!form.value.type) {
    errors.value.type = "Please prioritize assigning a core systemic type variable index property.";
    isValidStatus = false;
  }

  if (form.value.type === 'expense' && form.value.budget_limit !== '' && form.value.budget_limit !== null) {
    if (Number(form.value.budget_limit) < 0) {
      errors.value.budget_limit = "Financial constraint metrics cannot accept negative numeric values.";
      isValidStatus = false;
    }
  }

  return isValidStatus;
};

// JavaScript Client-Side Data Integrity Validation Engine (Modification Form)
const validateModificationFormInput = () => {
  editErrors.value = {};
  let isValidStatus = true;

  if (!editForm.value.name || !editForm.value.name.trim()) {
    editErrors.value.name = "The updated category identifier name field cannot be blank.";
    isValidStatus = false;
  }

  if (!editForm.value.type) {
    editErrors.value.type = "A structural system assignment type categorizer is mandatory.";
    isValidStatus = false;
  }

  if (editForm.value.type === 'expense' && editForm.value.budget_limit !== '' && editForm.value.budget_limit !== null) {
    if (Number(editForm.value.budget_limit) < 0) {
      editErrors.value.budget_limit = "Financial allocation structures require positive absolute values.";
      isValidStatus = false;
    }
  }

  return isValidStatus;
};

// [CREATE] Submit Operational Endpoint Payload Request Channels
const handleSubmitCategory = async () => {
  globalFormError.value = '';
  formSuccess.value = false;
  errors.value = {};

  // Halt transaction flow tracking pipeline context routines if client validation registers issues
  if (!validateCreationFormInput()) return;

  formLoading.value = true;
  const payload = { ...form.value };
  if (payload.type === 'income') {
    payload.budget_limit = null;
  }

  try {
    await api.post('/categories', payload);
    formSuccess.value = true;
    
    // Clear Input Parameters Data Cache Objects Map
    form.value.name = '';
    form.value.icon = '';
    form.value.budget_limit = '';
    
    await fetchCategories();
  } catch (error) {
    console.error("Pipeline transactional state caught error routing submission parameters:", error);

    if (error.response && error.response.status === 422) {
      // Inline routing logic array mapping for backend-sourced validation parameters
      const backendValidationErrorResponse = error.response.data.errors;
      if (backendValidationErrorResponse.name) errors.value.name = backendValidationErrorResponse.name[0];
      if (backendValidationErrorResponse.type) errors.value.type = backendValidationErrorResponse.type[0];
      if (backendValidationErrorResponse.budget_limit) errors.value.budget_limit = backendValidationErrorResponse.budget_limit[0];
    } else {
      // Fallback global warning assignments
      globalFormError.value = error.response?.data?.message || 'The server encountered an exception saving category criteria.';
    }
  } finally { 
    formLoading.value = false; 
  }
};

const openEditModal = (category) => {
  selectedCategoryId.value = category.id;
  editForm.value.name = category.name;
  editForm.value.type = category.type;
  editForm.value.icon = category.icon;
  editForm.value.budget_limit = category.budget_limit || '';
  
  editErrors.value = {};
  globalEditError.value = '';
  showEditModal.value = true;
};

// [UPDATE] Save Modified State Target Payload
const handleUpdateCategory = async () => {
  globalEditError.value = '';
  editErrors.value = {};

  // Intercept process tracking actions loop pipeline if modification fields catch schema anomalies
  if (!validateModificationFormInput()) return;

  editLoading.value = true;
  const payload = { ...editForm.value };
  if (payload.type === 'income') {
    payload.budget_limit = null;
  }

  try {
    await api.put(`/categories/${selectedCategoryId.value}`, payload);
    showEditModal.value = false;
    
    await Swal.fire({ 
      title: 'Success!', 
      text: 'The category tracking definitions have been adjusted successfully.', 
      icon: 'success', 
      timer: 1800, 
      showConfirmButton: false,
      customClass: { popup: 'rounded-2xl' }
    });
    
    await fetchCategories();
  } catch (error) {
    console.error("Adjustment tracking operational flow received system level error payload mapping:", error);

    if (error.response && error.response.status === 422) {
      // Route server validation failures to contextual target arrays
      const backendValidationErrorResponse = error.response.data.errors;
      if (backendValidationErrorResponse.name) editErrors.value.name = backendValidationErrorResponse.name[0];
      if (backendValidationErrorResponse.type) editErrors.value.type = backendValidationErrorResponse.type[0];
      if (backendValidationErrorResponse.budget_limit) editErrors.value.budget_limit = backendValidationErrorResponse.budget_limit[0];
    } else {
      // General framework alert logging 
      globalEditError.value = error.response?.data?.message || 'Database transaction anomaly encountered updating category schema records.';
    }
  } finally {
    editLoading.value = false;
  }
};

// [DELETE] Purge Category Definition Block Data Record Target Links Context
const handleDeleteCategory = async (id) => {
  Swal.fire({
    title: 'Are you sure?',
    text: "Deleting this category configuration index might disrupt database dependencies of associated sub-ledger logs!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#4f46e5',
    cancelButtonColor: '#ef4444',
    confirmButtonText: 'Yes, confirm deletion',
    cancelButtonText: 'Cancel operation',
    customClass: { popup: 'rounded-2xl' }
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        await api.delete(`/categories/${id}`);
        await fetchCategories();
        
        Swal.fire({ 
          title: 'Purged!', 
          text: 'Selected category definition row has been detached completely from transaction registers.', 
          icon: 'success', 
          timer: 2000, 
          showConfirmButton: false,
          customClass: { popup: 'rounded-2xl' }
        });
      } catch (error) {
        Swal.fire({ 
          title: 'Operation Suspended', 
          text: error.response?.data?.message || "Destruction workflow mapping layer rejected tracking link purge command properties.", 
          icon: 'error',
          confirmButtonColor: '#4f46e5',
          customClass: { popup: 'rounded-2xl' }
        });
      }
    }
  });
};
</script>