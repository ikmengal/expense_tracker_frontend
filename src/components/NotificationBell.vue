<template>
  <div class="relative" ref="bellDropdownRef">
    <button @click="showNotif = !showNotif" class="relative p-2 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition focus:outline-none">
      🔔
      <span v-if="notifications.length > 0" class="absolute top-1 right-1 bg-red-500 text-white font-bold text-[10px] w-4 h-4 rounded-full flex items-center justify-center animate-bounce">
        {{ notifications.length }}
      </span>
    </button>

    <div v-if="showNotif" class="absolute right-0 mt-2 w-80 bg-white rounded-2xl shadow-xl border border-gray-100 py-2 z-50 overflow-hidden">
      <div class="flex items-center justify-between px-4 py-2 border-b border-gray-50">
        <h4 class="font-bold text-sm text-gray-900">Notifications</h4>
        <button v-if="notifications.length > 0" @click="markAllAsRead" class="text-xs font-semibold text-indigo-600 hover:text-indigo-800">Clear All</button>
      </div>

      <div class="max-h-64 overflow-y-auto divide-y divide-gray-50 custom-scrollbar">
        <div v-for="notif in notifications" :key="notif.id" class="p-3.5 hover:bg-gray-50 transition space-y-1">
          <p class="text-xs text-gray-700 font-medium leading-normal">{{ notif.data.message }}</p>
          <span class="inline-block text-[10px] bg-red-50 text-red-700 font-bold px-2 py-0.5 rounded-md">
            {{ notif.data.percentage }}% Spent
          </span>
        </div>
        <div v-if="notifications.length === 0" class="text-center py-6 text-xs text-gray-400">Sare budgets control me hain!</div>
      </div>
    </div>
  </div>
</template>

<script setup>
// 🛠️ onUnmounted ko inject kiya lifecycle clean karne ke liye
import { ref, onMounted, onUnmounted } from 'vue';
import api from '../services/api';

const notifications = ref([]);
const showNotif = ref(false);

// 🎯 Template Reference Hook Variable
const bellDropdownRef = ref(null);

onMounted(() => {
  fetchNotifications();
  setInterval(fetchNotifications, 30000);

  // 📝 Global window click event listener bind kiya
  window.addEventListener('click', handleClickOutside);
});

// 🧹 Component destroy hote waqt memory leak bachane ke liye handler remove kiya
onUnmounted(() => {
  window.removeEventListener('click', handleClickOutside);
});

const fetchNotifications = async () => {
  try {
    const response = await api.get('/notifications');
    notifications.value = response.data;
  } catch (error) { console.error(error); }
};

const markAllAsRead = async () => {
  try {
    await api.post('/notifications/mark-read');
    notifications.value = [];
    showNotif.value = false;
  } catch (error) { console.error(error); }
};

// ❌ Click Outside Trigger Engine Logic
const handleClickOutside = (event) => {
  // Agar dropdown open hy, aur jo click hua hy wo is main div (bellDropdownRef) ke andar NAHI hua
  if (showNotif.value && bellDropdownRef.value && !bellDropdownRef.value.contains(event.target)) {
    showNotif.value = false; // To dropdown ko automatically close kar do
  }
};
</script>