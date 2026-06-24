<template>
  <div class="max-w-7xl mx-auto p-4 sm:p-6 font-sans antialiased">
    
    <!-- HEADER -->
    <div class="border-b pb-4 border-gray-200/60 mb-6">
      <h3 class="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
        <span>🛠️</span> System Wide Branding
      </h3>
      <p class="text-xs text-slate-400 mt-0.5">Dynamically inject custom brand parameters and layout assets across your application ecosystem.</p>
    </div>

    <!-- MAIN CONTROL CENTER GRID -->
    <div class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
      
      <!-- LEFT SIDE: CONFIGURATION FORM -->
      <form @submit.prevent="saveBranding" class="lg:col-span-7 bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 space-y-5">
        
        <!-- SECTION 1: CORE IDENTITY -->
        <div class="space-y-4">
          <h4 class="text-[11px] font-black text-slate-400 uppercase tracking-wider border-b pb-1.5 border-slate-50">Core Brand Parameters</h4>
          
          <div>
            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wide">Application Brand Name</label>
            <input 
              v-model="form.site_name" 
              type="text" 
              class="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-50/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 transition" 
              required
            >
          </div>

          <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div class="sm:col-span-1">
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wide">Currency Symbol</label>
              <input 
                v-model="form.currency_symbol" 
                type="text" 
                placeholder="e.g. $, ₹, ৳" 
                class="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-700 bg-slate-50/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 transition" 
                required
              >
            </div>
            
            <div class="sm:col-span-2">
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wide">System Email Address</label>
              <input 
                v-model="form.site_email" 
                type="email" 
                class="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-50/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 transition" 
                required
              >
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wide">Website Target URL</label>
            <input 
              v-model="form.site_url" 
              type="url" 
              class="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-mono text-indigo-600 bg-slate-50/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 transition" 
              required
            >
          </div>
        </div>

        <!-- SECTION 2: METADATA & LOCATION -->
        <div class="space-y-4 pt-2">
          <h4 class="text-[11px] font-black text-slate-400 uppercase tracking-wider border-b pb-1.5 border-slate-50">Context & Localization</h4>
          
          <div>
            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wide">Office / Physical Address</label>
            <input 
              v-model="form.site_address" 
              type="text" 
              placeholder="123 Main Street, City, Country" 
              class="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-50/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 transition" 
              required
            >
          </div>

          <div>
            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wide">About Company / Website Description</label>
            <textarea 
              v-model="form.site_about" 
              rows="3" 
              placeholder="Write a short brief about your platform..." 
              class="w-full border border-gray-200 rounded-xl p-3.5 text-xs font-semibold text-slate-600 bg-slate-50/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 transition resize-none leading-relaxed" 
              required
            ></textarea>
          </div>
        </div>

        <!-- SECTION 3: MEDIA MANAGEMENT DRAG/DROP STYLES -->
        <div class="space-y-4 pt-2">
          <h4 class="text-[11px] font-black text-slate-400 uppercase tracking-wider border-b pb-1.5 border-slate-50">Static Graphics Assets</h4>
          
          <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <!-- LOGO FIELD -->
            <div class="bg-slate-50/60 border border-gray-200/70 p-4 rounded-xl flex flex-col justify-between space-y-3">
              <div>
                <span class="text-[10px] font-bold bg-white px-2 py-0.5 rounded-md text-slate-500 border shadow-sm">Asset: Logo</span>
                <p class="text-[10px] text-slate-400 mt-1">Rendered at main app bars.</p>
              </div>
              <input type="file" @change="onLogoSelected" accept="image/*" class="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 cursor-pointer" />
            </div>

            <!-- FAVICON FIELD -->
            <div class="bg-slate-50/60 border border-gray-200/70 p-4 rounded-xl flex flex-col justify-between space-y-3">
              <div>
                <span class="text-[10px] font-bold bg-white px-2 py-0.5 rounded-md text-slate-500 border shadow-sm">Asset: Favicon</span>
                <p class="text-[10px] text-slate-400 mt-1">Tab control index image.</p>
              </div>
              <input type="file" @change="onFaviconSelected" accept="image/*" class="w-full text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 cursor-pointer" />
            </div>
          </div>

          <!-- BANNER FIELD -->
          <div class="bg-slate-50/60 border border-gray-200/70 p-4 rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <span class="text-[10px] font-bold bg-white px-2 py-0.5 rounded-md text-slate-500 border shadow-sm">Asset: App Banner Landscape</span>
              <p class="text-[10px] text-slate-400 mt-1">High resolution hero background placement asset.</p>
            </div>
            <input type="file" @change="onBannerSelected" accept="image/*" class="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-[10px] file:font-bold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 cursor-pointer" />
          </div>
        </div>

        <!-- SUBMIT ACTUATOR -->
        <div class="flex justify-end pt-3 border-t border-gray-100">
          <button type="submit" :disabled="loading" class="w-full sm:w-auto bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-black px-5 py-3 rounded-xl transition shadow-md shadow-emerald-600/10 flex items-center justify-center gap-1.5">
            <span v-if="loading" class="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></span>
            <span>{{ loading ? 'Applying Brand Parameters...' : 'Apply Branding Globally' }}</span>
          </button>
        </div>
      </form>

      <!-- RIGHT SIDE: LIVE BRAND MOCKUP PREVIEW CONTAINER -->
      <div class="lg:col-span-5 bg-[#072440] rounded-3xl p-5 sm:p-6 border border-slate-800 flex flex-col justify-between relative overflow-hidden min-h-[460px] shadow-lg">
        <!-- Landscape Background Image Banner Asset Context -->
        <div class="absolute inset-0 w-full h-full flex items-center justify-center p-2">
          <img v-if="bannerPreview" :src="bannerPreview" alt="Live Mockup Hero Banner" class="w-full h-auto max-h-[95%] object-contain opacity-40 blur-[1px] transition duration-300" />
          <div v-else class="text-[10px] font-bold text-slate-600 tracking-widest uppercase bg-slate-900/40 px-4 py-2 rounded-xl border border-slate-800/60">No Live Banner Tracked</div>
        </div>
        
        <!-- Gradient Dark Mask Layer -->
        <div class="absolute inset-0 bg-gradient-to-t from-[#020e1a] via-[#072440]/40 to-[#072440]/20 z-10"></div>
        
        <!-- Mockup Context Top Action Strip -->
        <div class="relative z-20 flex justify-between items-center bg-black/40 backdrop-blur-md p-3 rounded-xl border border-white/5 shadow-sm">
          <div class="flex items-center space-x-2">
            <div class="h-6 w-6 bg-white/10 rounded-md flex items-center justify-center border border-white/10 overflow-hidden">
              <img v-if="faviconPreview" :src="faviconPreview" class="h-4 w-4 object-contain" />
              <span v-else class="text-[9px] text-slate-400">🌐</span>
            </div>
            <span class="text-[10px] text-slate-300 font-bold font-mono tracking-tight max-w-[120px] truncate">{{ form.site_url || 'app.domain.com' }}</span>
          </div>
          <span class="text-[9px] bg-indigo-600/90 font-black px-2 py-1 rounded-md text-white uppercase tracking-wider shadow-sm">Identity Live Preview</span>
        </div>

        <!-- Centered Core Grid Preview Layout Box -->
        <div class="relative z-20 bg-white p-5 rounded-2xl shadow-2xl border border-slate-100 max-w-sm mx-auto w-full mt-12 mb-6">
          <div class="flex items-center space-x-3 mb-3 border-b pb-3 border-slate-100">
            <div class="h-10 w-10 bg-slate-50 rounded-xl p-1.5 flex items-center justify-center border border-slate-100 overflow-hidden shadow-inner flex-shrink-0">
              <img v-if="logoPreview" :src="logoPreview" alt="App Logo" class="h-full w-full object-contain" />
              <span v-else class="text-lg">💼</span>
            </div>
            <div class="truncate">
              <h5 class="text-xs font-black text-slate-900 tracking-tight truncate">{{ form.site_name || 'Application Name' }}</h5>
              <p class="text-[9px] text-indigo-600 font-mono font-bold">{{ form.currency_symbol || '$' }} — Base Currency</p>
            </div>
          </div>
          
          <div class="space-y-2 text-[10px]">
            <p class="text-slate-500 leading-relaxed line-clamp-3 italic">
              "{{ form.site_about || 'No company profile statement loaded. Write a short description briefing your operational criteria.' }}"
            </p>
            <div class="pt-2 border-t border-slate-50 text-slate-400 flex flex-col space-y-1 font-medium">
              <span class="truncate">✉️ {{ form.site_email || 'admin-channel@system.com' }}</span>
              <span class="truncate">📍 {{ form.site_address || 'No office registry input configuration.' }}</span>
            </div>
          </div>
        </div>

        <!-- Safe Footprint Label Badge -->
        <div class="relative z-20 text-center bg-black/20 backdrop-blur-xs py-1.5 rounded-lg border border-white/5 text-[9px] text-slate-400 font-bold uppercase tracking-widest">
          🔒 Architecture Security Parameters Maintained
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';
import Swal from 'sweetalert2';

const loading = ref(false);

// Previews reactive URLs
const logoPreview = ref(null);
const bannerPreview = ref(null);
const faviconPreview = ref(null);

// Selected Files data mapping
const selectedLogo = ref(null);
const selectedBanner = ref(null);
const selectedFavicon = ref(null);

const form = ref({
  site_name: '',
  site_email: '',
  site_url: '',
  currency_symbol: '',
  site_address: '',
  site_about: ''
});

// File Selected handlers with Live preview integration
const onLogoSelected = (e) => { 
  const file = e.target.files[0];
  if (file) { selectedLogo.value = file; logoPreview.value = URL.createObjectURL(file); }
};

const onBannerSelected = (e) => { 
  const file = e.target.files[0];
  if (file) { selectedBanner.value = file; bannerPreview.value = URL.createObjectURL(file); }
};

const onFaviconSelected = (e) => { 
  const file = e.target.files[0];
  if (file) { selectedFavicon.value = file; faviconPreview.value = URL.createObjectURL(file); }
};

const loadBrandingData = async () => {
  try {
    const res = await api.get('/admin/settings');
    console.log("Server Data:", res.data);
    
    form.value.site_name = res.data.site_name || '';
    form.value.site_email = res.data.site_email || '';
    form.value.site_url = res.data.site_url || '';
    form.value.currency_symbol = res.data.currency_symbol || '';
    form.value.site_address = res.data.site_address || '';
    form.value.site_about = res.data.site_about || '';
    
    const storageBaseUrl = 'http://localhost:8000/storage/';

    logoPreview.value = res.data.site_logo ? (res.data.site_logo.startsWith('http') ? res.data.site_logo : storageBaseUrl + res.data.site_logo) : null;
    bannerPreview.value = res.data.site_banner ? (res.data.site_banner.startsWith('http') ? res.data.site_banner : storageBaseUrl + res.data.site_banner) : null;
    faviconPreview.value = res.data.site_favicon ? (res.data.site_favicon.startsWith('http') ? res.data.site_favicon : storageBaseUrl + res.data.site_favicon) : null;

  } catch (e) { 
    console.error("Data load nahi hua:", e); 
  }
};

const saveBranding = async () => {
  loading.value = true;
  const formData = new FormData();
  formData.append('site_name', form.value.site_name);
  formData.append('site_email', form.value.site_email);
  formData.append('site_url', form.value.site_url);
  formData.append('currency_symbol', form.value.currency_symbol);
  formData.append('site_address', form.value.site_address);
  formData.append('site_about', form.value.site_about);
  
  if (selectedLogo.value) formData.append('site_logo', selectedLogo.value);
  if (selectedBanner.value) formData.append('site_banner', selectedBanner.value);
  if (selectedFavicon.value) formData.append('site_favicon', selectedFavicon.value);

  try {
    await api.post('/admin/settings/update', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    Swal.fire({ icon: 'success', title: 'Branding Applied!', text: 'Settings updated successfully.', showConfirmButton: false, timer: 1500 });
    
    selectedLogo.value = null;
    selectedBanner.value = null;
    selectedFavicon.value = null;

    loadBrandingData(); 
    if (form.value.site_name) {
      document.title = form.value.site_name;
    }
    if (faviconPreview.value) {
      let link = document.querySelector("link[rel~='icon']");
      if (link) link.href = faviconPreview.value;
    }
  } catch (err) {
    Swal.fire('Error', 'Failed to update settings parameters.', 'error');
  } finally { loading.value = false; }
};

onMounted(loadBrandingData);
</script>