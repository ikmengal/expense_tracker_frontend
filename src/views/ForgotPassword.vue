<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    
    <!-- Dynamic Header Branding Layer -->
    <div class="mb-8 flex flex-col items-center">
      <div class="flex items-center space-x-3">
        <!-- Site Logo (Dynamic Backend Render with Fallback App Icon) -->
        <div v-if="appSettings.site_logo" class="h-10 w-auto flex items-center justify-center">
          <img :src="appSettings.site_logo" alt="Application Logo" class="h-9 w-auto object-contain" />
        </div>
        <div v-else class="bg-indigo-600 text-white p-2.5 rounded-xl shadow-md shadow-indigo-200 flex items-center justify-center">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
            <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
          </svg>
        </div>
        
        <!-- Site Name (Dynamic Backend Render with Fallback String) -->
        <span class="text-2xl font-black tracking-tight text-gray-900 uppercase">
          {{ appSettings.site_name || 'CashFlow' }} <span v-if="!appSettings.site_name" class="text-indigo-600 lowercase font-bold">App</span>
        </span>
      </div>
    </div>

    <!-- Password Recovery Card Wrapper -->
    <div class="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      
      <div class="text-center">
        <h2 class="text-2xl font-bold text-gray-900 tracking-tight">Forgot Password?</h2>
        <p class="mt-2 text-sm text-gray-500 leading-relaxed">
          Enter your registered email address below and we'll send you a secure validation link to reset your credentials.
        </p>
      </div>
      
      <form class="mt-6 space-y-5" @submit.prevent="handleForgotPassword" novalidate>
        
        <!-- Email Input Block Area -->
        <div>
          <label for="email-address" class="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-2">
            Email Address <span class="text-rose-500 font-bold">*</span>
          </label>
          <div class="relative rounded-xl shadow-sm">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.206" />
              </svg>
            </div>
            <input 
              v-model="email" 
              id="email-address" 
              name="email" 
              type="email" 
              class="appearance-none rounded-xl relative block w-full pl-10 pr-3 py-3 border placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 text-sm transition-all duration-200" 
              :class="errors.email ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/10' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'"
              placeholder="name@example.com" 
            />
          </div>
          <!-- Inline Validation Error Messaging Response -->
          <p v-if="errors.email" class="text-[11px] text-rose-600 font-semibold mt-1.5 flex items-center gap-1 animate-in fade-in duration-100">
            <span>⚠️</span> {{ errors.email }}
          </p>
        </div>

        <!-- Global Server / Middleware Exception Warning Block -->
        <div v-if="globalErrorMessage" class="flex items-center space-x-2 p-3 bg-red-50 rounded-xl text-xs text-red-600 font-semibold border border-red-100 animate-in fade-in zoom-in-95 duration-150">
          <span>❌ {{ globalErrorMessage }}</span>
        </div>

        <!-- Action Trigger Submission Control -->
        <div>
          <button 
            type="submit" 
            :disabled="loading" 
            class="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-150 disabled:opacity-60 disabled:cursor-not-allowed shadow-lg shadow-indigo-100"
          >
            <span v-if="loading" class="flex items-center space-x-2">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Sending verification link...</span>
            </span>
            <span v-else>Send Reset Link</span>
          </button>
        </div>
        
        <!-- Layout Splitter Element -->
        <div class="relative my-4">
          <div class="absolute inset-0 flex items-center" aria-hidden="true">
            <div class="w-full border-t border-gray-200"></div>
          </div>
          <div class="relative flex justify-center text-xs uppercase">
            <span class="bg-white px-2 text-gray-400 font-medium">Or</span>
          </div>
        </div>

        <!-- Route Back Navigation Link Anchor -->
        <div class="text-center">
          <router-link 
            to="/" 
            class="inline-flex items-center space-x-1 text-xs font-bold text-indigo-600 hover:text-indigo-500 hover:underline transition-all duration-150"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Login Screen</span>
          </router-link>
        </div>
      </form>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api'; // Switched to use consistency api layout wrapper service instance
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