<template>
  <div class="max-w-2xl bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-6 mx-auto mt-6">
    <div>
      <h3 class="text-base font-bold text-slate-900 flex items-center gap-2">🛠️ System Wide Branding</h3>
      <p class="text-xs text-slate-400 mt-0.5">Dynamically inject custom brand parameters into layouts.</p>
    </div>

    <form @submit.prevent="saveBranding" class="space-y-5">
      <div>
        <label class="block text-[11px] font-bold text-slate-500 uppercase mb-1">Application Brand Name</label>
        <input v-model="form.site_name" type="text" class="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500" required>
      </div>

      <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label class="block text-[11px] font-bold text-slate-500 uppercase mb-1">System Email Address</label>
          <input v-model="form.site_email" type="email" class="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500" required>
        </div>
        
        <div>
          <label class="block text-[11px] font-bold text-slate-500 uppercase mb-1">Currency Symbol</label>
          <input v-model="form.currency_symbol" type="text" class="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-indigo-500" required>
        </div>
      </div>

      <div>
        <label class="block text-[11px] font-bold text-slate-500 uppercase mb-1">Brand Logo Asset</label>
        <div class="mt-1 flex items-center gap-4 bg-slate-50/50 p-4 rounded-xl border border-dashed border-gray-200">
          <img v-if="currentLogo" :src="currentLogo" alt="App Logo" class="h-12 w-12 object-contain bg-white p-1 rounded-lg border" />
          <input type="file" @change="onFileSelected" accept="image/*" class="text-xs text-slate-500 file:mr-4 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-xs file:font-bold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 cursor-pointer" />
        </div>
      </div>

      <div class="flex justify-end pt-2 border-t border-gray-50">
        <button type="submit" :disabled="loading" class="bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm">
          {{ loading ? 'Applying Configuration...' : 'Apply Branding Globally' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';
import Swal from 'sweetalert2';

const loading = ref(false);
const currentLogo = ref(null);
const selectedFile = ref(null);

const form = ref({
  site_name: '',
  site_email: '',
  currency_symbol: ''
});

const onFileSelected = (e) => { selectedFile.value = e.target.files[0]; };

const loadBrandingData = async () => {
  try {
    const res = await api.get('/admin/settings');
    form.value.site_name = res.data.site_name;
    form.value.site_email = res.data.site_email;
    form.value.currency_symbol = res.data.currency_symbol;
    currentLogo.value = res.data.site_logo; // Mapping to site_logo
  } catch (e) { console.error(e); }
};

const saveBranding = async () => {
  loading.value = true;
  const formData = new FormData();
  formData.append('site_name', form.value.site_name);
  formData.append('site_email', form.value.site_email);
  formData.append('currency_symbol', form.value.currency_symbol);
  if (selectedFile.value) formData.append('site_logo', selectedFile.value);

  try {
    await api.post('/admin/settings/update', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    Swal.fire({ icon: 'success', title: 'Branding Applied!', text: 'Setting table matrices updated.', showConfirmButton: false, timer: 1500 });
    window.location.reload(); 
  } catch (err) {
    Swal.fire('Error', 'Failed to update settings parameters.', 'error');
  } finally { loading.value = false; }
};

onMounted(loadBrandingData);
</script>