<template>
  <div class="min-h-screen flex flex-col items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    
    <!-- Dynamic Header Branding Layer -->
    <div class="mb-6 flex flex-col items-center">
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

    <!-- Password Selection Card Wrapper -->
    <div class="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      
      <div class="text-center">
        <h2 class="text-2xl font-bold text-gray-900 tracking-tight">Create New Password</h2>
        <p class="mt-1.5 text-sm text-gray-500">
          Please enter your new strong password credentials below.
        </p>
      </div>
      
      <form class="space-y-4" @submit.prevent="handleResetPassword" novalidate>
        
        <!-- New Password Field -->
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
            New Password <span class="text-rose-500 font-bold">*</span>
          </label>
          <div class="relative rounded-xl shadow-sm">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <input 
              v-model="form.password" 
              type="password" 
              class="appearance-none rounded-xl relative block w-full pl-10 pr-3 py-3 border placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 text-sm transition-all duration-200" 
              :class="errors.password ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/10' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'"
              placeholder="Minimum 8 characters" 
            />
          </div>
          <!-- Field Validation Feedback Link -->
          <p v-if="errors.password" class="text-[11px] text-rose-600 font-semibold mt-1.5 flex items-center gap-1">
            <span>⚠️</span> {{ errors.password }}
          </p>
        </div>

        <!-- Confirm Password Field -->
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
            Confirm Password <span class="text-rose-500 font-bold">*</span>
          </label>
          <div class="relative rounded-xl shadow-sm">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
              </svg>
            </div>
            <input 
              v-model="form.password_confirmation" 
              type="password" 
              class="appearance-none rounded-xl relative block w-full pl-10 pr-3 py-3 border placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 text-sm transition-all duration-200" 
              :class="errors.password_confirmation ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/10' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'"
              placeholder="Retype new password" 
            />
          </div>
          <!-- Field Validation Feedback Link -->
          <p v-if="errors.password_confirmation" class="text-[11px] text-rose-600 font-semibold mt-1.5 flex items-center gap-1">
            <span>⚠️</span> {{ errors.password_confirmation }}
          </p>
        </div>

        <!-- Global Action Route Level Errors Warnings -->
        <div v-if="globalErrorMessage" class="flex items-center space-x-2 p-3 bg-red-50 rounded-xl text-xs text-red-600 font-semibold border border-red-100 animate-in fade-in zoom-in-95 duration-150">
          <span>❌ {{ globalErrorMessage }}</span>
        </div>

        <!-- Processing Submission Button -->
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
              <span>Updating password...</span>
            </span>
            <span v-else>Update Password</span>
          </button>
        </div>
      </form>
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