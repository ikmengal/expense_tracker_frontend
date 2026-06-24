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

    <div class="flex md:col-span-5 h-full items-center justify-center bg-gradient-to-tr from-[#e3ede9] via-[#edf4f1] to-[#e8f0ed] p-4 sm:p-6 overflow-y-auto">
      
      <div class="max-w-md w-full my-auto space-y-4 bg-gradient-to-b from-[#f3faf7] via-[#f9fdfc] to-[#ebf5f1] border border-emerald-900/10 p-6 sm:p-8 rounded-2xl shadow-[0_20px_50px_-12px_rgba(4,41,34,0.06)] z-10">
        
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
          <h2 class="text-xl sm:text-2xl font-bold text-gray-900 tracking-tight">Contact Support & Suggestions</h2>
          <p class="mt-1 text-xs text-gray-500">
            Facing an issue or want to give a suggestion? We'd love to hear from you.
          </p>
        </div>
        
        <form class="space-y-3.5" @submit.prevent="handleSubmitContact" novalidate>
          
          <div>
            <label class="block text-[10px] font-semibold uppercase tracking-wider text-gray-600 mb-1">
              Your Name <span class="text-rose-500 font-bold">*</span>
            </label>
            <div class="relative rounded-xl shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
              </div>
              <input 
                v-model="form.name" 
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
                v-model="form.email" 
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
              Feedback Type <span class="text-rose-500 font-bold">*</span>
            </label>
            <div class="relative rounded-xl shadow-sm">
              <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <select 
                v-model="form.type" 
                class="appearance-none rounded-xl relative block w-full pl-9 pr-10 py-2.5 border text-gray-900 bg-[#deeae5] focus:bg-white focus:outline-none focus:ring-2 text-sm transition-all duration-200"
                :class="errors.type ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500' : 'border-transparent focus:ring-emerald-500/20 focus:border-emerald-600'"
              >
                <option value="problem">Problem / Bug Report ⚠️</option>
                <option value="suggestion">Feature Suggestion 💡</option>
              </select>
              <div class="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none text-gray-400">
                <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </div>
            </div>
            <p v-if="errors.type" class="text-[10px] text-rose-600 font-semibold mt-1 flex items-center gap-1">
              <span>⚠️</span> {{ errors.type }}
            </p>
          </div>

          <div>
            <label class="block text-[10px] font-semibold uppercase tracking-wider text-gray-600 mb-1">
              Your Message <span class="text-rose-500 font-bold">*</span>
            </label>
            <div class="relative rounded-xl shadow-sm">
              <textarea 
                v-model="form.message" 
                rows="3" 
                class="appearance-none rounded-xl relative block w-full px-4 py-2.5 border placeholder-gray-400 text-gray-900 bg-[#deeae5] focus:bg-white focus:outline-none focus:ring-2 text-sm transition-all duration-200 resize-none" 
                :class="errors.message ? 'border-rose-400 focus:ring-rose-500 focus:border-rose-500 bg-rose-50/10' : 'border-transparent focus:ring-emerald-500/20 focus:border-emerald-600'"
                placeholder="Describe your issue or suggestion in detail..."
              ></textarea>
            </div>
            <p v-if="errors.message" class="text-[10px] text-rose-600 font-semibold mt-1 flex items-center gap-1">
              <span>⚠️</span> {{ errors.message }}
            </p>
          </div>

          <div v-if="errorMessage" class="flex items-center space-x-2 p-2.5 bg-red-50 rounded-xl text-[11px] text-red-600 font-semibold border border-red-100">
            <span>❌ {{ errorMessage }}</span>
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
                <span>Sending message...</span>
              </span>
              <span v-else>Submit Message</span>
            </button>
          </div>

          <div class="text-center pt-1">
            <router-link to="/dashboard" class="inline-flex items-center space-x-1 text-xs font-bold text-gray-500 hover:text-indigo-600 hover:underline transition-all duration-150">
              <svg xmlns="http://www.w3.org/2000/xl" class="h-3.5 w-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
              </svg>
              <span>Back to Dashboard</span>
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