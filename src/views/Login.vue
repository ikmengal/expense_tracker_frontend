<template>
  <div class="min-h-screen grid grid-cols-1 md:grid-cols-12 bg-gray-50">
    
    <div class="hidden md:flex md:col-span-7 relative flex-col justify-between bg-[#072440] overflow-hidden">
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

    <div class="flex md:col-span-5 items-center justify-center bg-gradient-to-tr from-[#e3ede9] via-[#edf4f1] to-[#e8f0ed] p-4 sm:p-6 lg:p-8">
      <div class="max-w-md w-full space-y-6 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
        
        <div class="mb-6 flex flex-col items-center">
          <div class="flex items-center space-x-3">
            <div v-if="appSettings.site_logo" class="h-auto w-auto flex items-center justify-center">
              <img :src="appSettings.site_logo" alt="Application Logo" class="h-12 w-auto object-contain" />
            </div>
            <div v-else class="bg-indigo-600 text-white p-2.5 rounded-xl shadow-md shadow-indigo-200 flex items-center justify-center">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
            </div>
          </div>
        </div>
        
        <div class="text-center">
          <h2 class="text-2xl font-bold text-gray-900 tracking-tight">Welcome to {{ appSettings.site_name || 'SpendSence' }}</h2>
          <p class="mt-1.5 text-sm text-gray-500">
            Sign in to secure your account and monitor your dashboard.
          </p>
        </div>
        
        <form class="space-y-5" @submit.prevent="handleLogin" novalidate>
          
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
            <p v-if="errors.email" class="text-[11px] text-rose-600 font-semibold mt-1.5 flex items-center gap-1">
              <span>⚠️</span> {{ errors.email }}
            </p>
          </div>

          <div>
            <div class="flex justify-between items-center mb-1.5">
              <label class="block text-xs font-semibold uppercase tracking-wider text-gray-600">
                Password <span class="text-rose-500 font-bold">*</span>
              </label>
              <router-link 
                to="/forgot-password" 
                class="text-xs font-bold text-indigo-600 hover:text-indigo-500 hover:underline transition-all duration-150"
              >
                Forgot Password?
              </router-link>
            </div>
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
            <p v-if="errors.password" class="text-[11px] text-rose-600 font-semibold mt-1.5 flex items-center gap-1">
              <span>⚠️</span> {{ errors.password }}
            </p>
          </div>

          <div v-if="globalErrorMessage" class="flex items-center space-x-2 p-3 bg-red-50 rounded-xl text-xs text-red-600 font-semibold border border-red-100 animate-in fade-in zoom-in-95 duration-150">
            <span>❌ {{ globalErrorMessage }}</span>
          </div>

          <div class="pt-2">
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
                <span>Authenticating profile...</span>
              </span>
              <span v-else>Sign In</span>
            </button>
          </div>
          
          <div class="relative my-4">
            <div class="absolute inset-0 flex items-center" aria-hidden="true">
              <div class="w-full border-t border-gray-200"></div>
            </div>
            <div class="relative flex justify-center text-xs uppercase">
              <span class="bg-white px-2 text-gray-400 font-medium">New to our platform?</span>
            </div>
          </div>

          <div class="space-y-3 text-center">
            <div>
              <router-link 
                to="/register" 
                class="inline-flex items-center space-x-1 text-xs font-bold text-indigo-600 hover:text-indigo-500 hover:underline transition-all duration-150"
              >
                <span>Create a Free Account</span>
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                </svg>
              </router-link>
            </div>

            <div class="pt-1 border-t border-gray-100/60">
              <router-link 
                to="/contact-us" 
                class="inline-flex items-center space-x-1 text-xs font-medium text-gray-500 hover:text-indigo-600 transition-all duration-150"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M18.364 5.636l-3.536 3.536m0 5.656l3.536 3.536M9.172 9.172L5.636 5.636m3.536 9.192l-3.536 3.536M21 12a9 9 0 11-18 0 9 9 0 0111-18z" />
                </svg>
                <span>Need help or have suggestions? <strong class="text-indigo-600 hover:underline font-semibold">Contact Us</strong></span>
              </router-link>
            </div>
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

  // Input Data Values Mapping Coordinates
  const email = ref('');
  const password = ref('');
  const loading = ref(false);

  // Localized Error Track Objects Mapping Variables
  const globalErrorMessage = ref('');
  const errors = ref({});

  // Dynamic Remote Structural Content Settings State (Added site_banner and site_about)
  const appSettings = ref({ site_name: '', site_logo: null, site_banner: null, site_about: '' });

  // Fetch Dynamic App Meta Settings Object Tracking State on Mount Engine Context
  const fetchAppMetaConfiguration = async () => {
    try {
      // AAPKA ORIGINAL LINK: jise humne wahi rakha hai
      const res = await api.get('/global-settings');
      appSettings.value = res.data;

      // 🔥 REALTIME WINDOW BROWSER TAB TITLE CONTROL INJECTION
      if (res.data.site_name) {
        document.title = res.data.site_name;
      }

      // 🔥 DYNAMIC FAVICON LINK ELEMENT CONTEXT UPDATE 
      if (res.data.site_favicon) {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.getElementsByTagName('head')[0].appendChild(link);
        }
        link.href = res.data.site_favicon;
      }
    } catch (err) {
      console.error("Branding retrieval metrics trace operational error:", err);
    }
  };

  // JavaScript Client-side Pre-Validation Core Engine Check
  const validateFormInputStructures = () => {
    errors.value = {};
    let statusResultFlag = true;

    const emailValidationRegexPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!email.value.trim()) {
      errors.value.email = "The email address field is required.";
      statusResultFlag = false;
    } else if (!emailValidationRegexPattern.test(email.value)) {
      errors.value.email = "Please enter a valid structural email address address verification layout.";
      statusResultFlag = false;
    }

    if (!password.value) {
      errors.value.password = "The password input credential sequence field is required.";
      statusResultFlag = false;
    } else if (password.value.length < 6) {
      errors.value.password = "The security password credentials must measure at least 6 structural characters length.";
      statusResultFlag = false;
    }

    return statusResultFlag;
  };

  // Form submission handler pipeline tracking connection sequence link array mapping
  const handleLogin = async () => {
    globalErrorMessage.value = '';
    
    if (!validateFormInputStructures()) return;

    loading.value = true;
    
    try {
      const response = await api.post('/login', {
        email: email.value,
        password: password.value
      });

      localStorage.setItem('token', response.data.access_token);
      localStorage.setItem('user', JSON.stringify(response.data.user));
      localStorage.setItem('user_role', response.data.user.role);

      Swal.fire({
        title: 'Authenticated!',
        text: 'Your secure configuration layer log in execution tracking session has initialized.',
        icon: 'success',
        timer: 1500,
        showConfirmButton: false
      });

      if (response.data.user.role === 'Admin') {
        router.push('/admin');
      } else {
        router.push('/dashboard');
      }

    } catch (error) {
      console.error("Authentication Exception Trace Entry Capture Logging Trace:", error);
      
      if (error.response && error.response.status === 422) {
        const apiValidationPayloadErrors = error.response.data.errors;
        if (apiValidationPayloadErrors.email) errors.value.email = apiValidationPayloadErrors.email[0];
        if (apiValidationPayloadErrors.password) errors.value.password = apiValidationPayloadErrors.password[0];
      } else {
        globalErrorMessage.value = error.response?.data?.message || 'Authentication error. Please recheck security validation markers.';
      }
    } finally {
      loading.value = false;
    }
  };

  // Standard hook setup tracking array configurations parameters updates rules
  onMounted(() => {
    fetchAppMetaConfiguration();
  });
</script>