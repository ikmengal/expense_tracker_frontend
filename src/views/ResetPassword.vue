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
          <h2 class="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Create New Password</h2>
          <p class="mt-1 text-xs text-gray-500">
            Please enter your new strong password credentials below.
          </p>
        </div>
        
        <form class="space-y-4" @submit.prevent="handleResetPassword" novalidate>
          
          <div>
            <label class="block text-[10px] font-semibold uppercase tracking-wider text-gray-600 mb-1">
              New Password <span class="text-rose-500 font-bold">*</span>
            </label>
            <div class="relative rounded-xl shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input 
                v-model="form.password" 
                type="password" 
                class="appearance-none rounded-xl relative block w-full pl-9 pr-3 py-2.5 border placeholder-gray-400 text-gray-900 bg-[#deeae5] focus:bg-white focus:outline-none focus:ring-2 text-sm transition-all duration-200" 
                :class="errors.password ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/10' : 'border-transparent focus:ring-emerald-500/20 focus:border-emerald-600'"
                placeholder="Minimum 8 characters" 
              />
            </div>
            <p v-if="errors.password" class="text-[10px] text-rose-600 font-semibold mt-1 flex items-center gap-1">
              <span>⚠️</span> {{ errors.password }}
            </p>
          </div>

          <div>
            <label class="block text-[10px] font-semibold uppercase tracking-wider text-gray-600 mb-1">
              Confirm Password <span class="text-rose-500 font-bold">*</span>
            </label>
            <div class="relative rounded-xl shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
                </svg>
              </div>
              <input 
                v-model="form.password_confirmation" 
                type="password" 
                class="appearance-none rounded-xl relative block w-full pl-9 pr-3 py-2.5 border placeholder-gray-400 text-gray-900 bg-[#deeae5] focus:bg-white focus:outline-none focus:ring-2 text-sm transition-all duration-200" 
                :class="errors.password_confirmation ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/10' : 'border-transparent focus:ring-emerald-500/20 focus:border-emerald-600'"
                placeholder="Retype new password" 
              />
            </div>
            <p v-if="errors.password_confirmation" class="text-[10px] text-rose-600 font-semibold mt-1 flex items-center gap-1">
              <span>⚠️</span> {{ errors.password_confirmation }}
            </p>
          </div>

          <div v-if="globalErrorMessage" class="flex items-center space-x-2 p-2.5 bg-red-50 rounded-xl text-[11px] text-red-600 font-semibold border border-red-100">
            <span>❌ {{ globalErrorMessage }}</span>
          </div>

          <div class="pt-1">
            <button 
              type="submit" 
              :disabled="loading" 
              class="group relative w-full flex justify-center py-2.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-150 disabled:opacity-60 shadow-md shadow-indigo-100"
            >
              <span v-if="loading" class="flex items-center space-x-2">
                <svg class="animate-spin h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Updating password...</span>
              </span>
              <span v-else>Update Password</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../services/api';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();

const loading = ref(false);
const globalErrorMessage = ref('');
const errors = ref({});

// Dynamic Application Identity Layout Options Ref Map
const appSettings = ref({ site_name: '', site_logo: null });

const form = ref({
  token: '',
  email: '',
  password: '',
  password_confirmation: ''
});

// Dynamic Asset Settings Metadata Retrieval Hook Route
const fetchAppMetaConfiguration = async () => {
  try {
    const res = await api.get('/global-settings');
    appSettings.value = res.data;
  } catch (err) {
    console.error("Configuration system branding identity trace resolve failed:", err);
  }
};

// Frontend Input Layout Evaluator
const validatePasswordFormInput = () => {
  errors.value = {};
  let isValidStatus = true;

  if (!form.value.password) {
    errors.value.password = "The new password field is required.";
    isValidStatus = false;
  } else if (form.value.password.length < 8) {
    errors.value.password = "The selection must consist of at least 8 strong tracking characters.";
    isValidStatus = false;
  }

  if (!form.value.password_confirmation) {
    errors.value.password_confirmation = "Please rewrite the choice to match confirmation indices.";
    isValidStatus = false;
  } else if (form.value.password !== form.value.password_confirmation) {
    errors.value.password_confirmation = "The validation keys provided do not match your confirmation parameters.";
    isValidStatus = false;
  }

  return isValidStatus;
};

onMounted(() => {
  // Pull parameters from application global setup configuration fetch tracking channels
  fetchAppMetaConfiguration();

  form.value.token = route.query.token || '';
  form.value.email = route.query.email || '';

  if (!form.value.token || !form.value.email) {
    Swal.fire({ 
      title: 'Invalid Link Coordinates', 
      text: 'This identity reset hyperlink configuration parameters are completely missing or broken.', 
      icon: 'error',
      confirmButtonColor: '#4f46e5',
      customClass: { popup: 'rounded-2xl' }
    });
    router.push('/');
  }
});

const handleResetPassword = async () => {
  globalErrorMessage.value = '';
  
  // Halt execution context stack tracing routines if structural format checks catch errors
  if (!validatePasswordFormInput()) return;

  loading.value = true;
  try {
    await api.post('/reset-password', form.value);
    
    await Swal.fire({
      title: 'Success!',
      text: 'Your password has been updated. You can now login with your new credentials.',
      icon: 'success',
      confirmButtonColor: '#4f46e5',
      customClass: { popup: 'rounded-2xl' }
    });
    router.push('/');
  } catch (error) {
    console.error("Pipeline trace engine transformation update error mapping logging:", error);

    if (error.response && error.response.status === 422) {
      // Direct intercept mapping logic for incoming validation fields array parameters
      const backendValidationErrorResponse = error.response.data.errors;
      if (backendValidationErrorResponse.password) errors.value.password = backendValidationErrorResponse.password[0];
      if (backendValidationErrorResponse.password_confirmation) errors.value.password_confirmation = backendValidationErrorResponse.password_confirmation[0];
    } else {
      // Map general global exception response messaging directly 
      globalErrorMessage.value = error.response?.data?.message || 'Failed to update password. Reset context lifetime token might be expired.';
      
      Swal.fire({ 
        title: 'Transaction Denied', 
        text: globalErrorMessage.value, 
        icon: 'error', 
        confirmButtonColor: '#4f46e5',
        customClass: { popup: 'rounded-2xl' }
      });
    }
  } finally {
    loading.value = false;
  }
};
</script>