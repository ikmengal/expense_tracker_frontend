<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    
    <!-- Dynamic Header Branding Layer -->
    
    <!-- Registration Card Wrapper -->
    <div class="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      <div class="mb-6 flex flex-col items-center">
        <div class="flex items-center space-x-3">
          <!-- Site Logo (Dynamic Backend Render with Fallback App Icon) -->
          <div v-if="appSettings.site_logo" class="h-10 w-auto flex items-center justify-center">
            <img :src="appSettings.site_logo" alt="Application Logo" class="h-9 w-auto object-contain" style="width: 300px; height: 120px;" />
          </div>
          <div v-else class="bg-indigo-600 text-white p-2.5 rounded-xl shadow-md shadow-indigo-200 flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          
          <!-- Site Name (Dynamic Backend Render with Fallback String) -->
          <!-- <span class="text-2xl font-black tracking-tight text-gray-900">
            {{ appSettings.site_name || 'SpendSence' }} <span v-if="!appSettings.site_name" class="text-indigo-600 lowercase font-bold">App</span>
          </span> -->
        </div>
      </div>
      
      <div class="text-center">
        <h2 class="text-2xl font-bold text-gray-900 tracking-tight">Create Account</h2>
        <p class="mt-1.5 text-sm text-gray-500">
          Start managing your transactions and track your savings.
        </p>
      </div>
      
      <form class="space-y-4" @submit.prevent="handleRegister" novalidate>
        
        <!-- Full Name Input Block -->
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
            Full Name <span class="text-rose-500 font-bold">*</span>
          </label>
          <div class="relative rounded-xl shadow-sm">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input 
              v-model="name" 
              type="text" 
              class="appearance-none rounded-xl relative block w-full pl-10 pr-3 py-3 border placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 text-sm transition-all duration-200" 
              :class="errors.name ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/10' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'"
              placeholder="John Doe" 
            />
          </div>
          <!-- Inline Validation Feedback -->
          <p v-if="errors.name" class="text-[11px] text-rose-600 font-semibold mt-1.5 flex items-center gap-1">
            <span>⚠️</span> {{ errors.name }}
          </p>
        </div>

        <!-- Email Address Input Block -->
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
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
              type="email" 
              class="appearance-none rounded-xl relative block w-full pl-10 pr-3 py-3 border placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 text-sm transition-all duration-200" 
              :class="errors.email ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/10' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'"
              placeholder="name@example.com" 
            />
          </div>
          <!-- Inline Validation Feedback -->
          <p v-if="errors.email" class="text-[11px] text-rose-600 font-semibold mt-1.5 flex items-center gap-1">
            <span>⚠️</span> {{ errors.email }}
          </p>
        </div>

        <!-- Password Input Block -->
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
            Password <span class="text-rose-500 font-bold">*</span>
          </label>
          <div class="relative rounded-xl shadow-sm">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input 
              v-model="password" 
              type="password" 
              class="appearance-none rounded-xl relative block w-full pl-10 pr-3 py-3 border placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 text-sm transition-all duration-200" 
              :class="errors.password ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/10' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'"
              placeholder="••••••••" 
            />
          </div>
          <!-- Inline Validation Feedback -->
          <p v-if="errors.password" class="text-[11px] text-rose-600 font-semibold mt-1.5 flex items-center gap-1">
            <span>⚠️</span> {{ errors.password }}
          </p>
        </div>

        <!-- Global Middleware System Alert -->
        <div v-if="globalErrorMessage" class="flex items-center space-x-2 p-3 bg-red-50 rounded-xl text-xs text-red-600 font-semibold border border-red-100 animate-in fade-in zoom-in-95 duration-150">
          <span>❌ {{ globalErrorMessage }}</span>
        </div>

        <!-- Form Submission Trigger Button -->
        <div class="pt-2">
          <button 
            type="submit" 
            :disabled="loading" 
            class="group relative w-full flex justify-center py-3.5 px-4 border border-transparent text-sm font-semibold rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-150 disabled:opacity-60 shadow-lg shadow-indigo-100"
          >
            <span v-if="loading" class="flex items-center space-x-2">
              <svg class="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              <span>Creating Account...</span>
            </span>
            <span v-else>Sign Up</span>
          </button>
        </div>
        
        <!-- Bottom Layout Divider Link -->
        <div class="relative my-4">
          <div class="absolute inset-0 flex items-center" aria-hidden="true">
            <div class="w-full border-t border-gray-200"></div>
          </div>
          <div class="relative flex justify-center text-xs uppercase">
            <span class="bg-white px-2 text-gray-400 font-medium">Already have an account?</span>
          </div>
        </div>

        <!-- Navigation Shortcut to Login -->
        <div class="text-center">
          <router-link to="/" class="inline-flex items-center space-x-1 text-xs font-bold text-indigo-600 hover:text-indigo-500 hover:underline transition-all duration-150">
            <span>Sign In here</span>
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
            </svg>
          </router-link>
        </div>
      </form>
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