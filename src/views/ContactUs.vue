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

    <!-- Feedback Form Card Wrapper -->
    <div class="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
      
      <div class="text-center">
        <h2 class="text-2xl font-bold text-gray-900 tracking-tight">Contact Support & Suggestions</h2>
        <p class="mt-1.5 text-sm text-gray-500">
          Facing an issue or want to give a suggestion? We'd love to hear from you.
        </p>
      </div>
      
      <form class="space-y-4" @submit.prevent="handleSubmitContact" novalidate>
        
        <!-- Name Input Field -->
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
            Your Name <span class="text-rose-500 font-bold">*</span>
          </label>
          <div class="relative rounded-xl shadow-sm">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
              </svg>
            </div>
            <input 
              v-model="form.name" 
              type="text" 
              class="appearance-none rounded-xl relative block w-full pl-10 pr-3 py-3 border placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 text-sm transition-all duration-200" 
              :class="errors.name ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/10' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'"
              placeholder="John Doe" 
            />
          </div>
          <!-- Field Validation Alert -->
          <p v-if="errors.name" class="text-[11px] text-rose-600 font-semibold mt-1.5 flex items-center gap-1">
            <span>⚠️</span> {{ errors.name }}
          </p>
        </div>

        <!-- Email Address Input Field -->
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
              v-model="form.email" 
              type="email" 
              class="appearance-none rounded-xl relative block w-full pl-10 pr-3 py-3 border placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 text-sm transition-all duration-200" 
              :class="errors.email ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/10' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'"
              placeholder="name@example.com" 
            />
          </div>
          <!-- Field Validation Alert -->
          <p v-if="errors.email" class="text-[11px] text-rose-600 font-semibold mt-1.5 flex items-center gap-1">
            <span>⚠️</span> {{ errors.email }}
          </p>
        </div>

        <!-- Feedback Dropdown Menu Select Field -->
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
            Feedback Type <span class="text-rose-500 font-bold">*</span>
          </label>
          <div class="relative rounded-xl shadow-sm">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <select 
              v-model="form.type" 
              class="appearance-none rounded-xl relative block w-full pl-10 pr-10 py-3 border bg-white text-gray-900 focus:outline-none focus:ring-2 text-sm transition-all duration-200"
              :class="errors.type ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'"
            >
              <option value="problem">Problem / Bug Report ⚠️</option>
              <option value="suggestion">Feature Suggestion 💡</option>
            </select>
            <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
              </svg>
            </div>
          </div>
          <!-- Field Validation Alert -->
          <p v-if="errors.type" class="text-[11px] text-rose-600 font-semibold mt-1.5 flex items-center gap-1">
            <span>⚠️</span> {{ errors.type }}
          </p>
        </div>

        <!-- Detailed Message Field -->
        <div>
          <label class="block text-xs font-semibold uppercase tracking-wider text-gray-600 mb-1.5">
            Your Message <span class="text-rose-500 font-bold">*</span>
          </label>
          <div class="relative rounded-xl shadow-sm">
            <textarea 
              v-model="form.message" 
              rows="4" 
              class="appearance-none rounded-xl relative block w-full px-4 py-3 border placeholder-gray-400 text-gray-900 focus:outline-none focus:ring-2 text-sm transition-all duration-200 resize-none" 
              :class="errors.message ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/10' : 'border-gray-300 focus:ring-indigo-500 focus:border-indigo-500'"
              placeholder="Describe your issue or suggestion in detail..."
            ></textarea>
          </div>
          <!-- Field Validation Alert -->
          <p v-if="errors.message" class="text-[11px] text-rose-600 font-semibold mt-1.5 flex items-center gap-1">
            <span>⚠️</span> {{ errors.message }}
          </p>
        </div>

        <!-- General Core Execution Warnings Banner -->
        <div v-if="errorMessage" class="flex items-center space-x-2 p-3 bg-red-50 rounded-xl text-xs text-red-600 font-semibold border border-red-100 animate-in fade-in zoom-in-95 duration-150">
          <span>❌ {{ errorMessage }}</span>
        </div>

        <!-- Submit Button Element Layout -->
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
              <span>Sending message...</span>
            </span>
            <span v-else>Submit Message</span>
          </button>
        </div>

        <!-- Safe Exit Return Navigation Link -->
        <div class="text-center pt-2">
          <router-link to="/dashboard" class="inline-flex items-center space-x-1 text-xs font-bold text-gray-500 hover:text-indigo-600 hover:underline transition-all duration-150">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span>Back to Dashboard</span>
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
const loading = ref(false);
const errorMessage = ref('');

// Layout Pre-Validation Parameters Tracker Ref Mapping
const errors = ref({});

// Dynamic Layout Variables Trace Store Mapping 
const appSettings = ref({ site_name: '', site_logo: null });

const form = ref({
  name: '',
  email: '',
  type: 'problem',
  message: ''
});

// Dynamic Branding Resolution Hook Pipeline
const fetchAppMetaConfiguration = async () => {
  try {
    const res = await api.get('/global-settings');
    appSettings.value = res.data;
  } catch (err) {
    console.error("Layout global setup identification system failed trace:", err);
  }
};

// JavaScript Pre-Validation Check Engine Loop
const validateContactFormInput = () => {
  errors.value = {};
  let isValidStatus = true;

  const emailPatternRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

  if (!form.value.name.trim()) {
    errors.value.name = "Your identification contact profile name is required.";
    isValidStatus = false;
  }

  if (!form.value.email.trim()) {
    errors.value.email = "The submission email path locator parameter is required.";
    isValidStatus = false;
  } else if (!emailPatternRegex.test(form.value.email)) {
    errors.value.email = "Please apply a correct email string formation configuration.";
    isValidStatus = false;
  }

  if (!form.value.type) {
    errors.value.type = "Please select a categorized classification feedback index option.";
    isValidStatus = false;
  }

  if (!form.value.message.trim()) {
    errors.value.message = "The descriptive communication feedback context is required.";
    isValidStatus = false;
  } else if (form.value.message.trim().length < 10) {
    errors.value.message = "Please include additional criteria detail. The text block must exceed 10 characters.";
    isValidStatus = false;
  }

  return isValidStatus;
};

onMounted(() => {
  // Pull configuration layouts from endpoints pipeline layers
  fetchAppMetaConfiguration();

  // Handle cached state configurations logic cleanly
  const userData = localStorage.getItem('user');
  if (userData) {
    const user = JSON.parse(userData);
    form.value.name = user.name || '';
    form.value.email = user.email || '';
  }
});

const handleSubmitContact = async () => {
  errorMessage.value = '';
  errors.value = {};
  
  // Halt post pipeline handling context if local validation identifies data issues
  if (!validateContactFormInput()) return;

  loading.value = true;
  try {
    // API Post request to Laravel Backend
    await api.post('/contact-support', form.value);
    
    await Swal.fire({
      title: 'Thank You! 🙏',
      text: 'Your feedback has been saved successfully. Our team will look into it.',
      icon: 'success',
      confirmButtonColor: '#4f46e5',
      customClass: { popup: 'rounded-2xl' }
    });
    
    form.value.message = ''; // Reset message view parameters context gracefully
    router.push('/dashboard');
  } catch (error) {
    console.error("Communication channel post request crash diagnostics:", error);

    if (error.response && error.response.status === 422) {
      // Inline routing logic array mapping for standard framework validation failures
      const serverValidationPayloadErrors = error.response.data.errors;
      if (serverValidationPayloadErrors.name) errors.value.name = serverValidationPayloadErrors.name[0];
      if (serverValidationPayloadErrors.email) errors.value.email = serverValidationPayloadErrors.email[0];
      if (serverValidationPayloadErrors.type) errors.value.type = serverValidationPayloadErrors.type[0];
      if (serverValidationPayloadErrors.message) errors.value.message = serverValidationPayloadErrors.message[0];
    } else {
      // General fallthrough fallback framework logging system assignments
      errorMessage.value = error.response?.data?.message || 'Failed to submit contact request. Please evaluate structure parameter properties and try again.';
    }
  } finally {
    loading.value = false;
  }
};
</script>