<template>
  <div class="p-6 max-w-6xl mx-auto space-y-6">
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-900">🎯 Savings & Financial Goals</h2>
        <p class="text-sm mx-5 px-5 text-gray-500">Set your targets and track your savings.</p>
      </div>
      <button @click="showModal = true" class="px-4 py-2 bg-indigo-600 text-white font-semibold text-sm rounded-xl hover:bg-indigo-700 transition shadow-sm">
        + New Goal
      </button>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div v-for="goal in goals" :key="goal.id" class="bg-white rounded-2xl p-5 border border-gray-100 shadow-sm space-y-4">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="font-bold text-gray-900 text-lg">{{ goal.name }}</h3>
            <p class="text-xs text-gray-400">Deadline: {{ goal.deadline || 'No limit' }}</p>
          </div>
          <span :class="goal.status === 'achieved' ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'" class="px-2.5 py-0.5 rounded-full text-xs font-semibold uppercase">
            {{ goal.status }}
          </span>
        </div>

        <div class="space-y-1">
          <div class="flex justify-between text-xs font-medium text-gray-500">
            <span>Progress ({{ calculatePercentage(goal.saved_amount, goal.target_amount) }}%)</span>
            <span class="font-bold text-gray-900">{{ goal.currency }} {{ goal.saved_amount }} / {{ goal.target_amount }}</span>
          </div>
          <div class="w-full bg-gray-100 rounded-full h-3 overflow-hidden">
            <div class="bg-indigo-600 h-3 rounded-full transition-all duration-500" :style="{ width: calculatePercentage(goal.saved_amount, goal.target_amount) + '%' }"></div>
          </div>
        </div>

        <div class="flex items-center space-x-2 pt-2">
          <input type="number" v-model="savingsInput[goal.id]" placeholder="Amount" class="px-3 py-1.5 border border-gray-200 rounded-lg text-sm w-32 focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          <button @click="allocateSavings(goal.id)" class="px-3 py-1.5 bg-gray-900 hover:bg-gray-800 text-white rounded-lg text-xs font-bold transition">
            💰 Save Money
          </button>
          <button @click="deleteGoal(goal.id)" class="text-red-500 hover:bg-red-50 p-1.5 rounded-lg ml-auto transition">🗑️</button>
        </div>
      </div>
    </div>

    <div v-if="showModal" class="fixed inset-0 bg-black/50 flex items-center justify-center p-4 z-50">
      <div class="bg-white rounded-2xl max-w-md w-full p-6 space-y-4 shadow-xl">
        <h3 class="text-lg font-bold text-gray-900 border-b pb-2">Create Financial Goal</h3>
        <form @submit.prevent="createGoal" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700">Goal Target Title</label>
            <input v-model="form.name" type="text" required placeholder="e.g. New Laptop" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm" />
          </div>
          <div class="grid grid-cols-2 gap-2">
            <div>
              <label class="block text-sm font-medium text-gray-700">Target Amount</label>
              <input v-model="form.target_amount" type="number" required min="1" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">Currency</label>
              <select v-model="form.currency" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm bg-white text-sm">
                <option value="PKR">PKR (Rs.)</option>
                <option value="USD">USD ($)</option>
                <option value="EUR">EUR (€)</option>
              </select>
            </div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700">Deadline (Optional)</label>
            <input v-model="form.deadline" type="date" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm text-sm" />
          </div>
          <div class="flex justify-end space-x-2 pt-2">
            <button type="button" @click="showModal = false" class="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-medium hover:bg-gray-200">Cancel</button>
            <button type="submit" class="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm font-medium hover:bg-indigo-700">Create</button>
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

const goals = ref([]);
const showModal = ref(false);
const savingsInput = ref({});
const form = ref({ name: '', target_amount: '', currency: 'PKR', deadline: '' });

onMounted(() => { fetchGoals(); });

const fetchGoals = async () => {
  try {
    const response = await api.get('/goals');
    goals.value = response.data;
  } catch (error) {
    console.error("Goals fetch error:", error);
  }
};

const createGoal = async () => {
  try {
    await api.post('/goals', form.value);
    showModal.value = false;
    form.value = { name: '', target_amount: '', currency: 'PKR', deadline: '' };
    await fetchGoals();
    Swal.fire('Success', 'Goal created successfully!', 'success');
  } catch (error) { 
    Swal.fire('Error', 'Goal not created some thing wrong.', 'error');
  }
};

const allocateSavings = async (id) => {
  const amt = savingsInput.value[id];
  if (!amt || amt <= 0) return;
  try {
    await api.post(`/goals/${id}/add-savings`, { amount: amt });
    savingsInput.value[id] = '';
    await fetchGoals();
    Swal.fire('Saved!', 'Amount added in the target.', 'success');
  } catch (error) { console.error(error); }
};

const deleteGoal = async (id) => {
  Swal.fire({
    title: 'Are you sure?',
    text: "Deleting this financial goal will permanently erase your saved progress data!",
    icon: 'warning',
    showCancelButton: true,
    confirmButtonColor: '#4f46e5', // Red button for delete
    cancelButtonColor: '#ef4444',
    confirmButtonText: 'Yes, delete it!',
    cancelButtonText: 'Cancel'
  }).then(async (result) => {
    if (result.isConfirmed) {
      try {
        // Backend API par delete hit karein
        await api.delete(`/goals/${id}`);
        
        // List ko update karlein
        await fetchGoals();
        
        Swal.fire('Deleted!', 'Target successfully removed.', 'success');
      } catch (error) {
        console.error("Delete failed:", error);
        Swal.fire('Error', 'Goal han not been deleted some thing wrong.', 'error');
      }
    }
  });
};

const calculatePercentage = (saved, target) => {
  if (!target || target <= 0) return 0;
  const percentage = (saved / target) * 100;
  return Math.min(Math.round(percentage), 100);
};
</script>