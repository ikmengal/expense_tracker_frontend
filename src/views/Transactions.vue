<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <div class="max-w-7xl mx-auto p-6 md:p-10 space-y-6 w-full flex-1">
      
      <div class="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 class="text-2xl font-bold text-gray-900">Manage Transactions</h1>
          <p class="text-sm text-gray-500 mt-1">Filter, edit, or delete all your income and expense entries from here.</p>
        </div>
        
        <div class="flex items-center space-x-3 self-start md:self-auto">
          <span class="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-sm font-semibold h-fit w-fit">
            Active Currency: {{ selectedCurrency }}
          </span>
          <span class="bg-indigo-50 text-indigo-700 px-4 py-2 rounded-xl text-sm font-semibold h-fit w-fit">
            Total Records: {{ filteredTransactions.length }}
          </span>
          <button @click="openAddModal" class="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold px-4 py-2 rounded-xl shadow-sm transition flex items-center space-x-1.5 text-sm">
            <span>+ Add Transaction</span>
          </button>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-4 grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div>
          <label class="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Search Description</label>
          <input v-model="searchQuery" type="text" placeholder="e.g. Petrol, Salary..." class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 text-sm" />
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Filter Type</label>
          <select v-model="selectedType" class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm">
            <option value="all">All Types (Sub)</option>
            <option value="income">Income Only</option>
            <option value="expense">Expense Only</option>
          </select>
        </div>

        <div>
          <label class="block text-xs font-medium text-gray-400 uppercase tracking-wider mb-1">Filter Category</label>
          <select v-model="selectedCategory" class="block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm">
            <option value="all">All Categories</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.icon || '📁' }} {{ cat.name }}
            </option>
          </select>
        </div>
      </div>

      <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
        <div v-if="loading" class="text-center py-6 text-gray-500 text-sm">
          Transactions load ho rahi hain...
        </div>

        <div v-else class="overflow-x-auto custom-scrollbar">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="border-b border-gray-200 text-gray-400 text-xs uppercase font-bold tracking-wider">
                <th class="py-3 pl-2">Description</th>
                <th class="py-3">Category</th>
                <th class="py-3">Date</th>
                <th class="py-3 text-right pr-4">Amount</th>
                <th class="py-3 text-center">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-100">
              <tr v-for="tx in filteredTransactions" :key="tx.id" class="text-gray-700 hover:bg-gray-50 transition">
                <td class="py-4 pl-2 font-medium text-gray-900">{{ tx.description || 'No description' }}</td>
                <td class="py-4">
                  <span class="px-2.5 py-1 rounded-full text-xs font-semibold" :class="tx.category?.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                    {{ tx.category?.icon || '📁' }} {{ tx.category?.name }}
                  </span>
                </td>
                <td class="py-4 text-sm text-gray-500">{{ tx.date }}</td>
                
                <td class="py-4 text-right pr-4 font-bold" :class="tx.category?.type === 'income' ? 'text-green-600' : 'text-red-600'">
                  {{ tx.category?.type === 'income' ? '+' : '-' }} 
                  <span>
                    {{ getCurrencySymbol(selectedCurrency) }} 
                    {{ Number(tx.amount).toFixed(2) }}
                  </span>
                </td>
                
                <td class="py-4 text-center">
                  <div class="flex justify-center space-x-1">
                    <button @click="openEditModal(tx)" class="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md transition" title="Edit">
                      ✏️
                    </button>
                    <button @click="handleDeleteTransaction(tx.id)" class="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition" title="Delete">
                      🗑️
                    </button>
                  </div>
                </td>
              </tr>
              <tr v-if="filteredTransactions.length === 0">
                <td colspan="5" class="text-center py-10 text-gray-400 text-sm">Koi transaction nahi mili.</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- <div class="max-w-7xl mx-auto px-6 md:px-10 w-full mb-6">
      <div class="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4">
        <label class="block text-xs font-bold text-indigo-800 uppercase tracking-wider mb-2">⚡ Quick AI Receipt Scanner</label>
        <div class="flex items-center space-x-3">
          <input type="file" ref="receiptInput" @change="uploadAndScanReceipt" accept="image/*" class="hidden" />
          <button type="button" @click="$refs.receiptInput.click()" :disabled="scanning" class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm transition disabled:opacity-50">
            {{ scanning ? 'Scanning Receipt...' : '📁 Upload & Scan Invoice' }}
          </button>
          <span v-if="scanning" class="text-xs text-indigo-600 font-medium animate-pulse">AI text extract kar raha hy...</span>
        </div>
      </div>
    </div> -->

    <div class="max-w-7xl mx-auto px-6 md:px-10 w-full mb-6">
  <div class="bg-indigo-50/50 border border-indigo-100 rounded-2xl p-4 md:p-5">
    <label class="block text-xs font-bold text-indigo-800 uppercase tracking-wider mb-2">⚡ Quick AI Receipt Scanner</label>
    
    <div class="flex flex-col md:flex-row md:items-center gap-3">
      <!-- 📁 Step 1: Category dropdown selection first -->
      <div class="w-full md:w-64">
        <select v-model="selectedScanCategory" class="block w-full px-3 py-2 border border-indigo-200 rounded-xl bg-white text-xs md:text-sm font-medium text-slate-700 shadow-2xs focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 cursor-pointer">
          <option value="" disabled>Select Category First</option>
          <option v-for="cat in categories" :key="cat.id" :value="cat.id">
            {{ cat.icon || '📁' }} {{ cat.name }}
          </option>
        </select>
      </div>

      <!-- 📸 Step 2: Upload trigger action -->
      <div class="flex items-center space-x-3">
            <input type="file" ref="receiptInput" @change="uploadAndScanReceipt" accept="image/*" class="hidden" />
            
            <button 
              type="button" 
              @click="$refs.receiptInput.click()" 
              :disabled="scanning" 
              class="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-semibold rounded-xl shadow-sm transition disabled:opacity-50 flex items-center gap-1.5"
            >
              {{ scanning ? 'Scanning Receipt...' : '📁 Upload & Scan Invoice' }}
            </button>
            
            <span v-if="scanning" class="text-xs text-indigo-600 font-medium animate-pulse">AI text extract kar raha hy...</span>
          </div>
        </div>
      </div>
    </div>

    <div v-if="showAddModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div class="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-gray-100">
        <div class="flex justify-between items-center border-b pb-3">
          <h3 class="text-lg font-bold text-gray-900">Add New Transaction</h3>
          <button @click="showAddModal = false" class="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        <form @submit.prevent="handleCreateTransaction" class="space-y-4" novalidate>
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Amount & Currency <span class="text-red-500 font-bold">*</span>
            </label>
            <div class="mt-1 flex rounded-lg shadow-sm">
              <input 
                v-model="addForm.amount" 
                type="number" 
                placeholder="0.00"
                class="block w-full px-3 py-2 border border-gray-300 rounded-l-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" 
              />
              <select 
                v-model="addForm.currency" 
                class="px-3 py-2 border-t border-b border-r border-gray-300 bg-gray-50 rounded-r-lg text-sm font-bold text-gray-600 focus:outline-none cursor-pointer"
              >
                <option value="PKR">PKR (Rs.)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="AED">AED (د.إ)</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Category <span class="text-red-500 font-bold">*</span>
            </label>
            <select v-model="addForm.category_id" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500">
              <option value="" disabled>Select Category</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.icon || '📁' }} {{ cat.name }} ({{ cat.type }})
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Description</label>
            <input v-model="addForm.description" type="text" placeholder="e.g. Office Lunch, Internet Bill" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Date <span class="text-red-500 font-bold">*</span>
            </label>
            <input v-model="addForm.date" type="date" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </div>

          <p v-if="addError" class="text-red-500 text-xs font-semibold bg-red-50 p-2 rounded-lg border border-red-100 shadow-sm">{{ addError }}</p>

          <div class="flex justify-end space-x-3 pt-2">
            <button type="button" @click="showAddModal = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition">Cancel</button>
            <button type="submit" :disabled="addLoading" class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition disabled:opacity-50">
              {{ addLoading ? 'Saving...' : 'Save Entry' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <div v-if="showEditModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50 backdrop-blur-sm">
      <div class="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl border border-gray-100">
        <div class="flex justify-between items-center border-b pb-3">
          <h3 class="text-lg font-bold text-gray-900">Edit Transaction</h3>
          <button @click="showEditModal = false" class="text-gray-400 hover:text-gray-600 text-xl">✕</button>
        </div>

        <form @submit.prevent="handleUpdateTransaction" class="space-y-4" novalidate>
          <div>
            <label class="block text-sm font-medium text-gray-700">
              Amount & Currency <span class="text-red-500 font-bold">*</span>
            </label>
            <div class="mt-1 flex rounded-lg shadow-sm">
              <input 
                v-model="editForm.amount" 
                type="number" 
                class="block w-full px-3 py-2 border border-gray-300 rounded-l-lg text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" 
              />
              <select 
                v-model="editForm.currency" 
                class="px-3 py-2 border-t border-b border-r border-gray-300 bg-gray-50 rounded-r-lg text-sm font-bold text-gray-600 focus:outline-none cursor-pointer"
              >
                <option value="PKR">PKR (Rs.)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
                <option value="AED">AED (د.إ)</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Category <span class="text-red-500 font-bold">*</span>
            </label>
            <select v-model="editForm.category_id" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500">
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.icon || '📁' }} {{ cat.name }} ({{ cat.type }})
              </option>
            </select>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">Description</label>
            <input v-model="editForm.description" type="text" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">
              Date <span class="text-red-500 font-bold">*</span>
            </label>
            <input v-model="editForm.date" type="date" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </div>

          <p v-if="editError" class="text-red-500 text-xs font-semibold bg-red-50 p-2 rounded-lg border border-red-100 shadow-sm">{{ editError }}</p>

          <div class="flex justify-end space-x-3 pt-2">
            <button type="button" @click="showEditModal = false" class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition">Cancel</button>
            <button type="submit" :disabled="editLoading" class="px-4 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition disabled:opacity-50">
              {{ editLoading ? 'Updating...' : 'Update Entry' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, computed } from 'vue';
  import api from '../services/api';
  import Swal from 'sweetalert2';

  const transactions = ref([]);
  const categories = ref([]);
  const loading = ref(true);

  // Filters State
  const searchQuery = ref('');
  const selectedType = ref('all');
  const selectedCategory = ref('all');

  // Dynamic Reactive Currency Source of Truth
  const selectedCurrency = ref('PKR');

  // Add Transaction State Setup
  const showAddModal = ref(false);
  const addLoading = ref(false);
  const addError = ref('');
  const addForm = ref({ amount: '', category_id: '', currency: 'PKR', description: '', date: '' });

  // Edit Modal State Model Configuration
  const showEditModal = ref(false);
  const editLoading = ref(false);
  const editError = ref('');
  const selectedTransactionId = ref(null);
  const editForm = ref({ amount: '', category_id: '', currency: 'PKR', description: '', date: '' });

  onMounted(() => {
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;
    if (user && user.default_currency) {
      selectedCurrency.value = user.default_currency;
      addForm.value.currency = user.default_currency;
    }

    fetchTransactions();
    fetchCategories();
  });

  const fetchTransactions = async () => {
    try {
      loading.value = true;
      const response = await api.get('/transactions', {
        params: { currency: selectedCurrency.value }
      });
      transactions.value = response.data;
    } catch (error) {
      console.error("Transactions loading error:", error);
    } finally {
      loading.value = false;
    }
  };

  const fetchCategories = async () => {
    try {
      const response = await api.get('/categories');
      categories.value = response.data;
    } catch (error) {
      console.error(error);
    }
  };

  const getCurrencySymbol = (code) => {
    const symbols = { 'PKR': 'Rs.', 'USD': '$', 'EUR': '€', 'AED': 'د.إ' };
    return symbols[code] || code;
  };

  const filteredTransactions = computed(() => {
    return transactions.value.filter(tx => {
      const matchesSearch = tx.description?.toLowerCase().includes(searchQuery.value.toLowerCase());
      const matchesType = selectedType.value === 'all' || tx.category?.type === selectedType.value;
      const matchesCategory = selectedCategory.value === 'all' || tx.category_id === selectedCategory.value;
      
      return matchesSearch && matchesType && matchesCategory;
    });
  });

  const openAddModal = () => {
    addForm.value = {
      amount: '',
      category_id: '',
      currency: selectedCurrency.value,
      description: '',
      date: new Date().toISOString().split('T')[0]
    };
    addError.value = '';
    showAddModal.value = true;
  };

  const handleCreateTransaction = async () => {
    addError.value = '';

    if (!addForm.value.amount || addForm.value.amount <= 0) {
      addError.value = '⚠️ Transaction amount is required and greater than 0.';
      return;
    }
    if (!addForm.value.category_id) {
      addError.value = '⚠️ Please select Category.';
      return;
    }
    if (!addForm.value.date) {
      addError.value = '⚠️ Select Transaction date.';
      return;
    }

    addLoading.value = true;
    try {
      await api.post('/transactions', addForm.value);
      showAddModal.value = false;
      Swal.fire({ title: 'Saved!', text: 'Transaction successfully created.', icon: 'success', timer: 1500, showConfirmButton: false });
      await fetchTransactions();
    } catch (error) {
      if (error.response?.data?.errors) {
        const apiErrors = Object.values(error.response.data.errors).flat();
        addError.value = `❌ API Error: ${apiErrors[0]}`;
      } else {
        addError.value = error.response?.data?.message || 'Failed to save transaction.';
      }
    } finally {
      addLoading.value = false;
    }
  };

  const openEditModal = (tx) => {
    selectedTransactionId.value = tx.id;
    
    // 🛠️ FIXED: Priority falls back to actual original amount for clean form inputs
    editForm.value.amount = tx.actual_amount || tx.amount;
    editForm.value.category_id = tx.category_id;
    editForm.value.currency = tx.currency ?? selectedCurrency.value;
    editForm.value.description = tx.description || '';
    editForm.value.date = tx.date ? tx.date.split(' ')[0] : '';
    
    editError.value = '';
    showEditModal.value = true;
  };

  const handleUpdateTransaction = async () => {
    editError.value = '';

    if (!editForm.value.amount || editForm.value.amount <= 0) {
      editError.value = '⚠️ Transaction amount is required.';
      return;
    }
    if (!editForm.value.category_id) {
      editError.value = '⚠️ Link the valid category.';
      return;
    }
    if (!editForm.value.date) {
      editError.value = '⚠️ Date field is required.';
      return;
    }

    editLoading.value = true;
    try {
      await api.put(`/transactions/${selectedTransactionId.value}`, editForm.value);
      showEditModal.value = false;
      Swal.fire({ title: 'Updated!', text: 'Transaction successfully updated.', icon: 'success', timer: 1500, showConfirmButton: false });
      await fetchTransactions(); 
    } catch (error) {
      if (error.response?.data?.errors) {
        const apiErrors = Object.values(error.response.data.errors).flat();
        editError.value = `❌ API Error: ${apiErrors[0]}`;
      } else {
        editError.value = error.response?.data?.message || 'Update failed.';
      }
    } finally {
      editLoading.value = false;
    }
  };

  const handleDeleteTransaction = async (id) => {
    Swal.fire({
      title: 'Are you sure?',
      text: "Are you sure you want to delete this transaction?",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      cancelButtonColor: '#ef4444',
      confirmButtonText: 'Yes, delete it!'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.delete(`/transactions/${id}`);
          await fetchTransactions();
          Swal.fire({ title: 'Deleted!', text: 'Transaction deleted.', icon: 'success', timer: 1500, showConfirmButton: false });
        } catch (error) {
          Swal.fire('Error', 'Transaction not deleted, something went wrong.', 'error');
        }
      }
    });
  };

  // const scanning = ref(false);
  // const receiptInput = ref(null);

  // const uploadAndScanReceipt = async (event) => {
  //   const file = event.target.files[0];
  //   if (!file) return;

  //   const formData = new FormData();
  //   formData.append('receipt', file);

  //   try {
  //     scanning.value = true;
  //     const response = await api.post('/transactions/scan', formData, {
  //       headers: { 'Content-Type': 'multipart/form-data' }
  //     });

  //     if (response.data.success) {
  //       addForm.value.amount = response.data.data.amount;
  //       addForm.value.date = response.data.data.date;
  //       addForm.value.description = response.data.data.description;
  //       addForm.value.currency = response.data.data.currency || selectedCurrency.value;
        
  //       showAddModal.value = true; 
  //       Swal.fire({ title: 'Scanned!', text: 'AI has successfully extracted the data. Please review and save.', icon: 'success', timer: 3000 });
  //     }
  //   } catch (error) {
  //     Swal.fire('Scan Failed', error.response?.data?.message || 'Unable to scan the receipt.', 'error');
  //   } finally {
  //     scanning.value = false;
  //     if (receiptInput.value) receiptInput.value.value = ''; 
  //   }
  // };

  // =========================================================
  // 🌟 AI Receipt Scanner Layer (With Default Currency & Category Guard)
  // =========================================================
  const scanning = ref(false);
  const receiptInput = ref(null);
  
  // Scanned layout local trackers
  const selectedScanCategory = ref('');
  const selectedScanCurrency = ref('PKR'); // Default Currency Set to PKR 🇵🇰

  // Sync default currency from local storage user profile if available
  onMounted(() => {
    const userData = localStorage.getItem('user');
    const user = userData ? JSON.parse(userData) : null;
    if (user && user.default_currency) {
      selectedScanCurrency.value = user.default_currency;
    }
  });

  const uploadAndScanReceipt = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    // 🛑 STAGE 1 GUARD: Check if user selected a category first
    if (!selectedScanCategory.value) {
      Swal.fire({
        icon: 'warning',
        title: 'Category Required',
        text: 'Kindly select a valid category from the dropdown first before uploading the receipt.',
      });
      if (receiptInput.value) receiptInput.value.value = '';
      return;
    }

    const formData = new FormData();
    formData.append('image', file);
    formData.append('category_id', selectedScanCategory.value);
    formData.append('currency', selectedScanCurrency.value); // Passing currency to backend

    try {
      scanning.value = true;

      Swal.fire({
        title: 'Processing AI Scan...',
        text: 'Extracting price details and transaction logs via Gemini AI...',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
      });

      const response = await api.post('/transactions/scan', formData, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data && (response.data.success || response.data.status === 'success')) {
        const parsedData = response.data.data || response.data.transaction;
        const extractedAmount = parseFloat(parsedData?.amount);

        // 🛑 STAGE 2 GUARD: Strict check for amount presence and validation
        if (!extractedAmount || extractedAmount <= 0 || isNaN(extractedAmount)) {
          Swal.fire({
            icon: 'error',
            title: 'Invalid Image or Receipt',
            text: 'AI could not detect any readable transaction amount or price metrics. Record injection blocked.',
          });
          return;
        }

        Swal.close();

        // Feed data maps directly onto the state reactive core object
        addForm.value.amount = extractedAmount;
        addForm.value.date = parsedData?.date || new Date().toISOString().split('T')[0];
        addForm.value.description = parsedData?.description || '';
        
        // Priority to backend currency, fallback to selected template currency
        addForm.value.currency = parsedData?.currency || selectedScanCurrency.value;
        addForm.value.category_id = selectedScanCategory.value;

        // Force open the structural editing preview modal layer
        showAddModal.value = true;

        Swal.fire({
          title: 'Scanned Successfully!',
          text: `Extracted: ${addForm.value.currency} ${extractedAmount}. Please review data structures before saving.`,
          icon: 'success',
          timer: 3500
        });
      }
    } catch (error) {
      console.error("Manage Page Upload Asset Crash:", error);
      Swal.fire(
        'Scan Failed', 
        error.response?.data?.message || 'Unable to filter or analyze structural contents from the uploaded invoice file.', 
        'error'
      );
    } finally {
      scanning.value = false;
      if (receiptInput.value) receiptInput.value.value = '';
    }
  };
</script>

<style scoped>
  .custom-scrollbar::-webkit-scrollbar { width: 5px; height: 5px; }
  .custom-scrollbar::-webkit-scrollbar-track { background: #f1f1f1; }
  .custom-scrollbar::-webkit-scrollbar-thumb { background: #cbd5e1; border-radius: 4px; }
</style>