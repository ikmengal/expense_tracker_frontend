<template>
  <nav class="bg-white shadow-sm border-b border-gray-200 w-full transition-colors duration-200 sticky top-0 z-40">
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <div class="flex justify-between h-16">
        
        <div class="flex items-center space-x-6 lg:space-x-8">
          <router-link to="/dashboard" class="flex items-center space-x-2 group focus:outline-none flex-shrink-0">
            <!-- Dynamic Branding Logo with Hover Effects -->
            <img 
              v-if="siteSettings.site_logo" 
              :src="siteSettings.site_logo" 
              alt="Logo" 
              class="h-8 w-auto object-contain transition-transform group-hover:scale-105"
              style="width: 130px; height: inherit;"
            />
            <span v-else class="text-xl group-hover:scale-110 transition-transform">🏛️
              <!-- Dynamic Site Name structured like the Admin Header Layout -->
              <span class="text-lg font-black tracking-wider text-slate-900">
                {{ siteSettings.site_name || 'SpendSence' }}
              </span>
            </span>
          </router-link>

          <div class="hidden md:flex items-center space-x-2 lg:space-x-4">
            <router-link 
              to="/dashboard" 
              class="px-3 py-2 rounded-xl text-sm font-medium transition" 
              :class="route.path === '/dashboard' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-500 hover:text-indigo-600 hover:bg-gray-50'"
            >
              Dashboard
            </router-link>
            <router-link 
              to="/categories" 
              class="px-3 py-2 rounded-xl text-sm font-medium transition" 
              :class="route.path === '/categories' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-500 hover:text-indigo-600 hover:bg-gray-50'"
            >
              Manage Categories
            </router-link>
            <router-link 
              to="/transactions" 
              class="px-3 py-2 rounded-xl text-sm font-medium transition" 
              :class="route.path === '/transactions' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-500 hover:text-indigo-600 hover:bg-gray-50'"
            >
              Manage Transactions
            </router-link>
            <router-link 
              to="/support" 
              class="px-3 py-2 rounded-xl text-sm font-semibold text-slate-600 hover:text-slate-900 hover:bg-slate-50 transition" 
              active-class="bg-indigo-50 text-indigo-700 font-bold border border-indigo-100/50"
            >
              🎧 Support Help
            </router-link>
            <router-link 
              to="/goals" 
              class="px-3 py-2 rounded-xl text-sm font-medium transition"
              :class="route.path === '/goals' ? 'bg-indigo-50 text-indigo-700 font-semibold' : 'text-gray-500 hover:text-indigo-600 hover:bg-gray-50'"
            >
              🎯 Saving Goals
            </router-link>
          </div>
        </div>

        <div class="flex items-center space-x-2 md:space-x-4 relative">
          
          <div class="flex items-center">
            <NotificationBell />
          </div>

          <button @click="toggleDropdown" class="flex items-center space-x-1.5 md:space-x-2 focus:outline-none group py-1 px-2 rounded-xl hover:bg-gray-50 transition">
            <div class="relative flex-shrink-0">
              <img 
                :src="avatarUrl" 
                alt="User Profile" 
                class="w-8 h-8 md:w-9 md:h-9 rounded-full object-cover border border-gray-200 group-hover:border-indigo-400 transition"
              />
              <span class="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full"></span>
            </div>
            <span class="text-sm font-medium text-gray-700 group-hover:text-indigo-600 transition hidden sm:inline">
              Hi, {{ user.name || 'User' }}
            </span>
            <span class="text-xs text-gray-400 transition group-hover:text-indigo-600">▼</span>
          </button>

          <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="md:hidden p-2 rounded-xl text-gray-500 hover:text-indigo-600 hover:bg-indigo-50 focus:outline-none transition">
            <span v-if="!isMobileMenuOpen" class="text-xl font-bold block leading-none">☰</span>
            <span v-else class="text-xl font-bold block leading-none">✕</span>
          </button>

          <!-- Profile Dropdown -->
          <div 
            v-if="dropdownOpen" 
            class="absolute right-0 top-14 w-64 bg-white rounded-2xl border border-gray-100 shadow-xl py-2 z-50 transform origin-top-right transition-all text-gray-800"
          >
            <div class="px-4 py-3 border-b border-gray-50 flex items-center space-x-3">
              <img :src="avatarUrl" class="w-10 h-10 rounded-full object-cover" />
              <div class="overflow-hidden">
                <h4 class="text-sm font-bold text-gray-800 truncate">{{ user.name }}</h4>
                <p class="text-xs text-gray-400 truncate">{{ user.email }}</p>
              </div>
            </div>

            <div class="p-1 space-y-0.5">
              <router-link to="/profile" @click="dropdownOpen = false" class="flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium text-gray-600 hover:bg-indigo-50/50 hover:text-indigo-600 transition">
                <span class="text-base">👤</span>
                <span>My Profile</span>
              </router-link>
            </div>

            <div class="border-t border-gray-50 p-1 mt-1">
              <button @click="handleLogout" class="w-full flex items-center space-x-3 px-3 py-2 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition text-left">
                <span class="text-base">🚪</span>
                <span>Log Out</span>
              </button>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div v-if="isMobileMenuOpen" class="md:hidden border-t border-gray-100 bg-white shadow-xl absolute w-full left-0 z-30 animate-fade-in">
      <div class="px-3 pt-2 pb-4 space-y-1.5">
        <router-link 
          v-if="userRole === 'Admin'"
          to="/admin" 
          class="px-3 py-2 text-sm font-bold text-purple-600 bg-purple-50 hover:bg-purple-100 rounded-xl transition"
          active-class="bg-purple-600 text-white font-semibold"
        >
          👑 Admin Dashboard
        </router-link>
        <router-link @click="isMobileMenuOpen = false" to="/dashboard" class="block px-4 py-2.5 rounded-xl text-base font-medium" :class="route.path === '/dashboard' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-gray-600 hover:bg-gray-50'">
          Dashboard
        </router-link>
        <router-link @click="isMobileMenuOpen = false" to="/categories" class="block px-4 py-2.5 rounded-xl text-base font-medium" :class="route.path === '/categories' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-gray-600 hover:bg-gray-50'">
          Manage Categories
        </router-link>
        <router-link @click="isMobileMenuOpen = false" to="/transactions" class="block px-4 py-2.5 rounded-xl text-base font-medium" :class="route.path === '/transactions' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-gray-600 hover:bg-gray-50'">
          Manage Transactions
        </router-link>
        <router-link @click="isMobileMenuOpen = false" to="/goals" class="block px-4 py-2.5 rounded-xl text-base font-medium" :class="route.path === '/goals' ? 'bg-indigo-50 text-indigo-700 font-bold' : 'text-gray-600 hover:bg-gray-50'">
          🎯 Saving Goals
        </router-link>
      </div>
    </div>
  </nav>
</template>

<script setup>
  import { ref, onMounted, computed, watch } from 'vue';
  import { useRouter, useRoute } from 'vue-router';
  import api from '../services/api';
  import NotificationBell from './NotificationBell.vue';

  const router = useRouter();
  const route = useRoute();

  const dropdownOpen = ref(false);
  const isMobileMenuOpen = ref(false);
  const isDarkMode = ref(false);
  const user = ref({ name: '', avatar: '', email: '' });
  const siteSettings = ref({ site_name: '', site_logo: '' });

  // ✅ Auto-close menus on route change (fixes tabs not working)
  watch(() => route.path, () => {
    isMobileMenuOpen.value = false;
    dropdownOpen.value = false;
  });

  const loadUserData = () => {
    const localUser = localStorage.getItem('user');
    if (localUser && localUser !== "undefined") {
      user.value = JSON.parse(localUser);
    }
  };

  const loadWebsiteSettings = async () => {
    try {
      const response = await api.get('/system/settings');
      if (response.data) {
        siteSettings.value = response.data;
      }
    } catch (e) {
      console.error("Error loading settings:", e);
    }
  };

  const checkInitialTheme = () => {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme === 'dark' || (!savedTheme && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
      isDarkMode.value = true;
      document.documentElement.classList.add('dark');
    } else {
      isDarkMode.value = false;
      document.documentElement.classList.remove('dark');
    }
  };

  onMounted(() => {
    loadUserData();
    loadWebsiteSettings();
    checkInitialTheme();
    window.addEventListener('profile-updated', loadUserData);
    window.addEventListener('website-settings-updated', loadWebsiteSettings);
  });

  const avatarUrl = computed(() => {
    if (user.value && user.value.avatar) {
      if (user.value.avatar.startsWith('http')) return user.value.avatar;
      return `http://localhost:8000/storage/${user.value.avatar}`;
    }
    return `https://ui-avatars.com/api/?name=${user.value.name || 'User'}&background=eeffff&color=4f46e5`;
  });

  const toggleDropdown = () => {
    dropdownOpen.value = !dropdownOpen.value;
  };

  // const handleLogout = async () => {
  //   try {
  //     await api.post('/logout');
  //   } catch (e) {
  //     console.error(e);
  //   } finally {
  //     localStorage.removeItem('token');
  //     localStorage.removeItem('user');
  //     dropdownOpen.value = false;
  //     isMobileMenuOpen.value = false;
  //     router.push('/');
  //   }
  // };

  const handleLogout = () => {
    // 1. Agar sessionStorage mein token hai (Matlab yeh impersonated tab khula hua hai)
    if (sessionStorage.getItem('token')) {
      sessionStorage.removeItem('token');
      sessionStorage.removeItem('user');
      
      // Naya tab khud hi close ho jayega aur aap wapas original Admin tab par active milenge!
      window.close(); 
      return;
    }

    // 2. Normal flow (Admin ya aam user jab khud directly logout karein)
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    
    if (router) {
      router.push('/');
    } else {
      window.location.href = '/';
    }
  };
</script>

<style scoped>
  .animate-fade-in {
    animation: fadeIn 0.2s ease-out forwards;
  }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>