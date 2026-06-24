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
          <h2 class="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Forgot Password?</h2>
          <p class="mt-1 text-xs text-gray-500 leading-relaxed">
            Enter your registered email address below and we'll send you a secure validation link to reset your credentials.
          </p>
        </div>
        
        <form class="space-y-4" @submit.prevent="handleForgotPassword" novalidate>
          
          <div>
            <label for="email-address" class="block text-[10px] font-semibold uppercase tracking-wider text-gray-600 mb-1">
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
                id="email-address" 
                name="email" 
                type="email" 
                class="appearance-none rounded-xl relative block w-full pl-9 pr-3 py-2.5 border placeholder-gray-400 text-gray-900 bg-[#deeae5] focus:bg-white focus:outline-none focus:ring-2 text-sm transition-all duration-200" 
                :class="errors.email ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/10' : 'border-transparent focus:ring-emerald-500/20 focus:border-emerald-600'"
                placeholder="name@example.com" 
              />
            </div>
            <p v-if="errors.email" class="text-[10px] text-rose-600 font-semibold mt-1 flex items-center gap-1 animate-in fade-in duration-100">
              <span>⚠️</span> {{ errors.email }}
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
                <span>Sending verification link...</span>
              </span>
              <span v-else>Send Reset Link</span>
            </button>
          </div>
          
          <div class="relative my-3">
            <div class="absolute inset-0 flex items-center" aria-hidden="true">
              <div class="w-full border-t border-emerald-900/10"></div>
            </div>
            <div class="relative flex justify-center text-[11px] uppercase">
              <span class="bg-[#f9fdfc] px-2 text-gray-400 font-medium">Or</span>
            </div>
          </div>

          <div class="text-center">
            <router-link 
              to="/" 
              class="inline-flex items-center space-x-1 text-xs font-bold text-indigo-600 hover:text-indigo-500 hover:underline transition-all duration-150"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Login Screen</span>
            </router-link>
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

// Dynamic Recovery Input Form States 
const email = ref('');
const loading = ref(false);

// Structural Client Response Errors Layout Maps
const globalErrorMessage = ref('');
const errors = ref({});

// Application Branding Metadata State
const appSettings = ref({ site_name: '', site_logo: null });

// Fetch Dynamic Application Meta Config Parameters via Core Settings Channel
const fetchAppMetaConfiguration = async () => {
  try {
    const res = await api.get('/global-settings');
    appSettings.value = res.data;
  } catch (err) {
    console.error("Branding initialization metadata request exception trace:", err);
  }
};

// JavaScript Client-Side Form Structural Validator Engine
const validateRecoveryFormInput = () => {
  errors.value = {};
  let isValidStatus = true;

  // Regular expression pattern validation mapping for formatting layout confirmations
  const emailRegexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!email.value.trim()) {
    errors.value.email = "The email address field is required.";
    isValidStatus = false;
  } else if (!emailRegexPattern.test(email.value)) {
    errors.value.email = "Please specify a valid structural email address format verification parameters.";
    isValidStatus = false;
  }

  return isValidStatus;
};

// Action Trigger Post Dispatch System execution context tracking link workflow
const handleForgotPassword = async () => {
  globalErrorMessage.value = '';
  
  // Exit runtime processing engine stack early if local format checks fail validation patterns
  if (!validateRecoveryFormInput()) return;

  loading.value = true;
  
  try {
    // Dispatched using unified client application api setup schema configuration framework
    await api.post('/forgot-password', { email: email.value });
    
    // Dynamic feedback notification template configured strictly inside elegant modern SweetAlert components
    Swal.fire({
      title: 'Check Your Email 📩',
      text: 'A secure validation password reset link has been dispatched successfully to your email account index.',
      icon: 'success',
      confirmButtonColor: '#4f46e5',
      customClass: {
        popup: 'rounded-2xl'
      }
    });
    
    email.value = '';
  } catch (error) {
    console.error("Password Recovery System Trace Context Exception Operational Log:", error);

    if (error.response && error.response.status === 422) {
      // Intercept framework engine localized server field tracking errors arrays mapping array traces directly
      const apiValidationErrors = error.response.data.errors;
      if (apiValidationErrors.email) errors.value.email = apiValidationErrors.email[0];
    } else {
      // Map global tracking error messages output string to alert system panels dynamically
      globalErrorMessage.value = error.response?.data?.message || 'We could not process this recovery email request. Please try again.';
      
      Swal.fire({ 
        title: 'Request Denied', 
        text: globalErrorMessage.value, 
        icon: 'error',
        confirmButtonColor: '#4f46e5',
        customClass: {
          popup: 'rounded-2xl'
        }
      });
    }
  } finally {
    loading.value = false;
  }
};

// Standard lifetime setup triggers hook logic flow trace parameters mappings
onMounted(() => {
  fetchAppMetaConfiguration();
});
</script>