<template>
  <div class="h-screen w-screen grid grid-cols-1 md:grid-cols-12 bg-gray-50 font-sans antialiased overflow-hidden select-none">
    
    <div class="hidden md:flex md:col-span-7 relative flex-col justify-between bg-[#072440] overflow-hidden h-full">
      <div class="absolute inset-0 w-full h-full flex items-center justify-center p-6">
        <img 
          v-if="appSettings.site_banner" 
          :src="appSettings.site_banner" 
          alt="Brand Banner" 
          class="w-full h-auto max-h-[85%] object-contain opacity-75 transition-all duration-300 transform scale-105"
          @error="appSettings.site_banner = null" 
        />
        <div v-else class="absolute inset-0 bg-gradient-to-br from-[#0a2e52] via-[#051829] to-[#113a61] opacity-90"></div>
      </div>
      
      <div class="absolute inset-0 bg-gradient-to-t from-[#030f1c] via-[#072440]/30 to-[#072440]/20 z-10"></div>
      
      <div class="absolute inset-0 flex flex-col justify-end p-12 z-20">
        <h1 class="text-white text-4xl font-black tracking-tight drop-shadow-md">
          {{ appSettings.site_name || 'SpendSence' }}
        </h1>
        <p class="text-slate-200 text-xs font-medium mt-3 leading-relaxed max-w-md drop-shadow">
          {{ appSettings.site_about || 'Smart expense tracking & category budgeting made effortless.' }}
        </p>
      </div>
    </div>

    <div class="flex md:col-span-5 h-full items-center justify-center bg-gradient-to-tr from-[#e3ede9] via-[#edf4f1] to-[#e8f0ed] p-4 sm:p-6">
      
      <div class="max-w-md w-full space-y-4 bg-gradient-to-b from-[#f3faf7] via-[#f9fdfc] to-[#ebf5f1] border border-emerald-900/10 p-6 sm:p-8 rounded-2xl shadow-[0_20px_50px_-12px_rgba(4,41,34,0.06)] z-10">
        
        <div class="flex flex-col items-center">
          <div class="flex items-center space-x-3">
            <div v-if="appSettings.site_logo" class="h-auto w-auto flex items-center justify-center">
              <img :src="appSettings.site_logo" alt="Application Logo" class="h-10 w-auto object-contain" />
            </div>
            <div v-else class="bg-emerald-600 text-white p-2 rounded-xl shadow-md flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div class="text-center">
          <h2 class="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Create Account</h2>
          <p class="mt-1 text-xs text-gray-500">
            Start managing your transactions and track your savings.
          </p>
        </div>
        
        <form class="space-y-3.5" @submit.prevent="handleRegister" novalidate>
          
          <div>
            <label class="block text-[10px] font-semibold uppercase tracking-wider text-gray-600 mb-1">
              Full Name <span class="text-rose-500 font-bold">*</span>
            </label>
            <div class="relative rounded-xl shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input 
                v-model="name" 
                type="text" 
                class="appearance-none rounded-xl relative block w-full pl-9 pr-3 py-2.5 border placeholder-gray-400 text-gray-900 bg-[#deeae5] focus:bg-white focus:outline-none focus:ring-2 text-sm transition-all duration-200" 
                :class="errors.name ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/10' : 'border-transparent focus:ring-emerald-500/20 focus:border-emerald-600'"
                placeholder="John Doe" 
              />
            </div>
            <p v-if="errors.name" class="text-[10px] text-rose-600 font-semibold mt-1 flex items-center gap-1">
              <span>⚠️</span> {{ errors.name }}
            </p>
          </div>

          <div>
            <label class="block text-[10px] font-semibold uppercase tracking-wider text-gray-600 mb-1">
              Email Address <span class="text-rose-500 font-bold">*</span>
            </label>
            <div class="relative rounded-xl shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
                </svg>
              </div>
              <input 
                v-model="email" 
                type="email" 
                class="appearance-none rounded-xl relative block w-full pl-9 pr-3 py-2.5 border placeholder-gray-400 text-gray-900 bg-[#deeae5] focus:bg-white focus:outline-none focus:ring-2 text-sm transition-all duration-200" 
                :class="errors.email ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/10' : 'border-transparent focus:ring-emerald-500/20 focus:border-emerald-600'"
                placeholder="name@example.com" 
              />
            </div>
            <p v-if="errors.email" class="text-[10px] text-rose-600 font-semibold mt-1 flex items-center gap-1">
              <span>⚠️</span> {{ errors.email }}
            </p>
          </div>

          <div>
            <label class="block text-[10px] font-semibold uppercase tracking-wider text-gray-600 mb-1">
              Password <span class="text-rose-500 font-bold">*</span>
            </label>
            <div class="relative rounded-xl shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input 
                v-model="password" 
                type="password" 
                class="appearance-none rounded-xl relative block w-full pl-9 pr-3 py-2.5 border placeholder-gray-400 text-gray-900 bg-[#deeae5] focus:bg-white focus:outline-none focus:ring-2 text-sm transition-all duration-200" 
                :class="errors.password ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/10' : 'border-transparent focus:ring-emerald-500/20 focus:border-emerald-600'"
                placeholder="••••••••" 
              />
            </div>
            <p v-if="errors.password" class="text-[10px] text-rose-600 font-semibold mt-1 flex items-center gap-1">
              <span>⚠️</span> {{ errors.password }}
            </p>
          </div>

          <div v-if="globalErrorMessage" class="flex items-center space-x-2 p-2.5 bg-red-50 rounded-xl text-[11px] text-red-600 font-semibold border border-red-100">
            <span>❌ {{ globalErrorMessage }}</span>
          </div>

          <div class="pt-1">
            <button 
              type="submit" 
              :disabled="loading" 
              class="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed shadow-md shadow-indigo-100"
            >
              <span v-if="loading" class="flex items-center space-x-2">
                <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Creating Account...</span>
              </span>
              <span v-else>Sign Up</span>
            </button>
          </div>
          
          <div class="relative my-3">
            <div class="absolute inset-0 flex items-center" aria-hidden="true">
              <div class="w-full border-t border-emerald-900/10"></div>
            </div>
            <div class="relative flex justify-center text-[11px] uppercase">
              <span class="bg-[#f9fdfc] px-2 text-gray-400 font-medium">Already have an account?</span>
            </div>
          </div>

          <div class="text-center">
            <router-link to="/" class="inline-flex items-center space-x-1 text-xs font-bold text-indigo-600 hover:text-indigo-500 hover:underline transition-all duration-150">
              <span>Sign In here</span>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
              </svg>
            </router-link>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import api from '../services/api';
import Swal from 'sweetalert2';

const router = useRouter();

// Input Reactive Bindings Mapping 
const name = ref('');
const email = ref('');
const password = ref('');
const loading = ref(false);

// Localized Error Trace Objects Mapping
const globalErrorMessage = ref('');
const errors = ref({});

// Dynamic Application Settings Parameters
const appSettings = ref({ site_name: '', site_logo: null });

// Fetch configuration parameters dynamically from backend
const fetchAppMetaConfiguration = async () => {
  try {
    const res = await api.get('/global-settings');
    appSettings.value = res.data;
  } catch (err) {
    console.error("Branding asset trace resolution failed:", err);
  }
};

// Frontend JavaScript Pre-Validation Check Logic Engine
const validateRegistrationForm = () => {
  errors.value = {};
  let isValidStatus = true;

  const emailPatternRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!name.value.trim()) {
    errors.value.name = "The profile full name field is required.";
    isValidStatus = false;
  }

  if (!email.value.trim()) {
    errors.value.email = "The email address field is required.";
    isValidStatus = false;
  } else if (!emailPatternRegex.test(email.value)) {
    errors.value.email = "Please specify a valid operational email format parameters.";
    isValidStatus = false;
  }

  if (!password.value) {
    errors.value.password = "The secure dashboard password field is required.";
    isValidStatus = false;
  } else if (password.value.length < 8) {
    errors.value.password = "Your security password choice must measure at least 8 characters long.";
    isValidStatus = false;
  }

  return isValidStatus;
};

// Form Post Request Pipeline Tracking Link Execution Context
const handleRegister = async () => {
  globalErrorMessage.value = '';
  
  // Halt registration execution flow context early if local checks identify failures
  if (!validateRegistrationForm()) return;

  loading.value = true;
  
  try {
    await api.post('/register', {
      name: name.value,
      email: email.value,
      password: password.value
    });
    
    // Fire persistent modern notification alerts on success tracking routes
    await Swal.fire({
      title: 'Registration Successful! 🎉',
      text: 'Your account is active. Please login with your credentials.',
      icon: 'success',
      confirmButtonColor: '#4f46e5',
      customClass: { popup: 'rounded-2xl' }
    });
    
    router.push('/'); 
  } catch (error) {
    console.error("Pipeline trace framework registration exception log entry:", error);

    if (error.response && error.response.status === 422) {
      // Direct field-by-field array intercept mapping logic for validation arrays
      const serverValidationPayloadErrors = error.response.data.errors;
      if (serverValidationPayloadErrors.name) errors.value.name = serverValidationPayloadErrors.name[0];
      if (serverValidationPayloadErrors.email) errors.value.email = serverValidationPayloadErrors.email[0];
      if (serverValidationPayloadErrors.password) errors.value.password = serverValidationPayloadErrors.password[0];
    } else {
      // Apply backend message response or custom fallback explicitly onto the global message card view
      globalErrorMessage.value = error.response?.data?.message || 'Registration failed. Please evaluate input structures and try again.';
    }
  } finally {
    loading.value = false;
  }
};

// Hook life tracking runtime initialize setup parameters mapping execution
onMounted(() => {
  fetchAppMetaConfiguration();
});
</script>