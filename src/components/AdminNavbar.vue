<template>
  <nav class="bg-white text-slate-800 shadow-sm border-b border-gray-100 sticky top-0 z-50">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16 items-center">
        
        <div class="flex items-center space-x-6">
          <router-link to="/admin" class="flex items-center space-x-2 group">
            <img v-if="appSettings.site_logo" :src="appSettings.site_logo" alt="Logo" class="h-8 w-auto object-contain transition-transform group-hover:scale-105" />
            <span v-else class="text-xl group-hover:scale-110 transition-transform">👑
              <span class="text-lg font-black tracking-wider text-slate-900">
                {{ appSettings.site_name || 'SpendSence' }}
              </span>
            </span>
          </router-link>

          <div class="hidden md:flex items-center space-x-2">
            <router-link to="/admin" exact-active-class="bg-indigo-50 text-indigo-700 font-bold border border-indigo-100/50" class="px-3 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition">
              Dashboard
            </router-link>
          </div>
        </div>

        <div class="flex items-center space-x-4 relative dropdown-container">
          
          <button 
            @click="toggleDropdown" 
            class="flex items-center space-x-1.5 md:space-x-2 focus:outline-none group py-1 px-2 rounded-xl hover:bg-gray-50 transition"
          >
            <div class="relative flex-shrink-0">
              <img 
                :src="avatarUrl" 
                alt="User Profile" 
                class="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover border border-gray-200 group-hover:border-indigo-400 transition"
              />
              <span class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            
            <span class="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition hidden sm:inline">
              Hi, {{ adminUser.name || 'Admin' }}
            </span>
            <span class="text-xs text-gray-400 transition group-hover:text-indigo-600" :class="{'rotate-180': dropdownOpen}">▼</span>
          </button>

          <div 
            v-if="dropdownOpen" 
            class="origin-top-right absolute right-0 top-12 mt-2 w-52 rounded-2xl shadow-xl bg-white ring-1 ring-black ring-opacity-5 divide-y divide-gray-100 z-50 overflow-hidden border border-gray-100 animate-in fade-in zoom-in-95 duration-150"
          >
            <div class="p-3 bg-slate-50/80 flex items-center space-x-3">
              <div class="relative flex-shrink-0">
                <img 
                  :src="avatarUrl" 
                  alt="Avatar" 
                  class="h-9 w-9 rounded-full object-cover bg-white border border-gray-200 shadow-sm"
                />
                <span class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-slate-50 rounded-full"></span>
              </div>
              <div class="overflow-hidden">
                <p class="text-xs font-bold text-gray-800 truncate leading-tight">{{ adminUser.name || 'Admin' }}</p>
                <p class="text-[10px] text-indigo-600 font-bold uppercase tracking-wider mt-0.5">Admin Center</p>
              </div>
            </div>

            <div class="p-1.5 space-y-0.5">
              <router-link 
                to="/admin/profile" 
                @click="dropdownOpen = false"
                class="flex w-full items-center px-3 py-2.5 rounded-xl text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-bold gap-2.5 transition"
              >
                <span>👤</span> My Account Profile
              </router-link>
              
              <router-link 
                to="/admin/settings" 
                @click="dropdownOpen = false"
                class="flex w-full items-center px-3 py-2.5 rounded-xl text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50 font-bold gap-2.5 transition"
              >
                <span>🛠️</span> Core System Settings
              </router-link>
            </div>

            <div class="p-1.5">
              <button 
                @click="handleLogout" 
                class="flex w-full items-center px-3 py-2.5 rounded-xl text-xs text-rose-600 hover:bg-rose-50/60 font-black gap-2.5 transition"
              >
                <span>🚪</span> Secure Log Out
              </button>
            </div>
          </div>

        </div>

      </div>
    </div>
  </nav>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';

const router = useRouter();
const dropdownOpen = ref(false);
const adminUser = ref({ name: 'Admin' });
const appSettings = ref({ app_name: 'SpendSence', app_logo: null });

// Toggle Handler
const toggleDropdown = () => {
  dropdownOpen.value = !dropdownOpen.value;
};

// Outside Click Closer
const closeDropdownOutside = (e) => {
  if (!e.target.closest('.dropdown-container')) {
    dropdownOpen.value = false;
  }
};

// Computed Avatar URL Logic
const avatarUrl = computed(() => {
  if (adminUser.value && adminUser.value.avatar) {
    if (adminUser.value.avatar.startsWith('http')) return adminUser.value.avatar;
    return `http://localhost:8000/storage/${adminUser.value.avatar}`;
  }
  return `https://ui-avatars.com/api/?name=${adminUser.value.name || 'User'}&background=eeffff&color=4f46e5`;
});

const handleLogout = async () => {
  try { await api.post('/logout'); } catch (e) { console.error(e); } 
  finally { localStorage.clear(); router.push('/'); }
};

const fetchAdminMeta = async () => {
  try {
    const [resSettings, resProfile] = await Promise.all([
      api.get('/global-settings'),
      api.get('/user') // Naya controller endpoint to get logged admin details
    ]);
    appSettings.value = resSettings.data;
    adminUser.value = resProfile.data;
  } catch (err) {
    console.error("Failed to load layout credentials:", err);
  }
};

onMounted(() => {
  fetchAdminMeta();
  window.addEventListener('click', closeDropdownOutside);
});

onUnmounted(() => {
  window.removeEventListener('click', closeDropdownOutside);
});
</script>