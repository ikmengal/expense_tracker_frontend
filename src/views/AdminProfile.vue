<template>
  <div class="max-w-5xl mx-auto p-4 sm:p-6 font-sans antialiased">
    
    <!-- PAGE TITLE HEADER -->
    <div class="border-b pb-4 border-gray-200/60 mb-6">
      <h3 class="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
        <span>👤</span> Admin Account Settings
      </h3>
      <p class="text-xs text-slate-400 mt-0.5">Manage your personal identification details and master security credentials separately.</p>
    </div>

    <!-- MAIN TWO-COLUMN FORM LAYOUT -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 items-start">
      
      <!-- CARD 1: PROFILE CONFIGURATION -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 space-y-5 flex flex-col justify-between min-h-[440px]">
        <div>
          <div class="border-b pb-3 border-slate-50 mb-4">
            <h4 class="text-sm font-black text-slate-800 tracking-tight flex items-center gap-1.5">
              Profile Information
            </h4>
            <p class="text-[11px] text-slate-400 mt-0.5">Update your account identity, display avatar and core system email address.</p>
          </div>

          <form @submit.prevent="saveProfile" class="space-y-4">
            <!-- AVATAR MANAGEMENT SYSTEM -->
            <div class="flex items-center space-x-4 bg-slate-50/70 p-4 rounded-xl border border-gray-100">
              <div class="relative flex-shrink-0">
                <img 
                  :src="avatarUrl" 
                  alt="Avatar" 
                  class="h-14 w-14 rounded-full object-cover ring-4 ring-indigo-50 border border-slate-200 shadow-sm bg-white transition duration-300"
                />
              </div>
              <div class="flex-1 min-w-0">
                <label class="block text-[10px] font-black text-slate-500 uppercase tracking-wider mb-1">Profile Avatar Source</label>
                <input 
                  type="file" 
                  @change="onAvatarSelected" 
                  accept="image/*" 
                  class="text-xs text-slate-500 file:mr-3 file:py-1.5 file:px-3 file:rounded-xl file:border-0 file:text-[10px] file:font-bold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 cursor-pointer w-full" 
                />
                <p v-if="profileErrors.avatar" class="text-[11px] text-rose-600 font-bold mt-1">⚠️ {{ profileErrors.avatar[0] }}</p>
              </div>
            </div>

            <!-- NAME INPUT -->
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wide">
                Full Handle Name <span class="text-rose-500">*</span>
              </label>
              <input 
                v-model="profileForm.name" 
                type="text" 
                class="w-full border rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-50/30 focus:bg-white focus:outline-none focus:ring-2 transition" 
                :class="profileErrors.name ? 'border-rose-500 focus:ring-rose-600/10 focus:border-rose-500 bg-rose-50/30' : 'border-gray-200 focus:ring-indigo-600/10 focus:border-indigo-600'"
              >
              <p v-if="profileErrors.name" class="text-[11px] text-rose-600 font-bold mt-1">⚠️ {{ profileErrors.name[0] }}</p>
            </div>
            
            <!-- EMAIL INPUT -->
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wide">
                Account Email Address <span class="text-rose-500">*</span>
              </label>
              <input 
                v-model="profileForm.email" 
                type="email" 
                class="w-full border rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-50/30 focus:bg-white focus:outline-none focus:ring-2 transition" 
                :class="profileErrors.email ? 'border-rose-500 focus:ring-rose-600/10 focus:border-rose-500 bg-rose-50/30' : 'border-gray-200 focus:ring-indigo-600/10 focus:border-indigo-600'"
              >
              <p v-if="profileErrors.email" class="text-[11px] text-rose-600 font-bold mt-1">⚠️ {{ profileErrors.email[0] }}</p>
            </div>

            <!-- ACTION FOOTER -->
            <div class="flex justify-end pt-3 border-t border-gray-50 mt-2">
              <button 
                type="submit" 
                :disabled="profileLoading" 
                class="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-black px-5 py-2.5 rounded-xl transition shadow-md shadow-indigo-600/10 flex items-center justify-center gap-1.5 disabled:bg-indigo-400"
              >
                <span v-if="profileLoading" class="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></span>
                <span>{{ profileLoading ? 'Syncing...' : 'Save Profile Details' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

      <!-- CARD 2: MASTER SECURITY CREDENTIALS -->
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-5 sm:p-6 space-y-5 flex flex-col justify-between min-h-[440px]">
        <div>
          <div class="border-b pb-3 border-slate-50 mb-4">
            <h4 class="text-sm font-black text-rose-700 tracking-tight flex items-center gap-1.5">
              <span>🔒</span> Security Authorization
            </h4>
            <p class="text-[11px] text-slate-400 mt-0.5">Ensure your account is using an isolated complex signature to shield metadata assets.</p>
          </div>

          <form @submit.prevent="savePassword" class="space-y-4">
            <!-- CURRENT SECURE KEY -->
            <div>
              <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wide">
                Current Password <span class="text-rose-500">*</span>
              </label>
              <input 
                v-model="passwordForm.old_password" 
                type="password" 
                placeholder="••••••••" 
                class="w-full border rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-50/30 focus:bg-white focus:outline-none focus:ring-2 transition" 
                :class="passwordErrors.old_password ? 'border-rose-500 focus:ring-rose-500/10 focus:border-rose-500 bg-rose-50/30' : 'border-gray-200 focus:ring-rose-500/10 focus:border-rose-500'"
              >
              <p v-if="passwordErrors.old_password" class="text-[11px] text-rose-600 font-bold mt-1">⚠️ {{ passwordErrors.old_password[0] }}</p>
            </div>
            
            <!-- NEW SECURE CONFIG KEY -->
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4 border-t pt-3 border-slate-50">
              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wide">
                  New Password <span class="text-rose-500">*</span>
                </label>
                <input 
                  v-model="passwordForm.password" 
                  type="password" 
                  placeholder="••••••••" 
                  class="w-full border rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-50/30 focus:bg-white focus:outline-none focus:ring-2 transition" 
                  :class="passwordErrors.password ? 'border-rose-500 focus:ring-rose-500/10 focus:border-rose-500 bg-rose-50/30' : 'border-gray-200 focus:ring-rose-500/10 focus:border-rose-500'"
                >
              </div>

              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wide">
                  Confirm Password <span class="text-rose-500">*</span>
                </label>
                <input 
                  v-model="passwordForm.password_confirmation" 
                  type="password" 
                  placeholder="••••••••" 
                  class="w-full border border-gray-200 rounded-xl px-3.5 py-2.5 text-xs font-semibold text-slate-700 bg-slate-50/30 focus:bg-white focus:outline-none focus:ring-2 focus:ring-rose-500/10 focus:border-rose-500 transition"
                >
              </div>
            </div>
            <p v-if="passwordErrors.password" class="text-[11px] text-rose-600 font-bold mt-1">⚠️ {{ passwordErrors.password[0] }}</p>

            <!-- ACTION FOOTER -->
            <div class="flex justify-end pt-3 border-t border-gray-50 mt-5">
              <button 
                type="submit" 
                :disabled="passwordLoading" 
                class="w-full sm:w-auto bg-slate-900 hover:bg-black text-white text-xs font-black px-5 py-2.5 rounded-xl transition shadow-md flex items-center justify-center gap-1.5 disabled:bg-slate-700"
              >
                <span v-if="passwordLoading" class="animate-spin rounded-full h-3 w-3 border-2 border-white border-t-transparent"></span>
                <span>{{ passwordLoading ? 'Overriding...' : 'Update Secret Key' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import api from '../services/api';
import Swal from 'sweetalert2';

const profileLoading = ref(false);
const passwordLoading = ref(false);
const currentAvatar = ref(null);
const selectedAvatarFile = ref(null);

const profileForm = ref({ name: '', email: '' });
const passwordForm = ref({ old_password: '', password: '', password_confirmation: '' });

// API Backend Validation Error States
const profileErrors = ref({});
const passwordErrors = ref({});

// Dynamic Absolute Image Path Resolver with Fallback UI Initial Avatar
const avatarUrl = computed(() => {
  if (currentAvatar.value) {
    if (currentAvatar.value.startsWith('http') || currentAvatar.value.startsWith('blob:')) {
      return currentAvatar.value;
    }
    return `http://localhost:8000/storage/${currentAvatar.value}`;
  }
  return `https://ui-avatars.com/api/?name=${profileForm.value.name || 'User'}&background=6366f1&color=fff`;
});

const onAvatarSelected = (e) => {
  const file = e.target.files[0];
  if (file) {
    selectedAvatarFile.value = file;
    currentAvatar.value = URL.createObjectURL(file); // Preview logic
  }
};

const loadProfile = async () => {
  try {
    const res = await api.get('/user');
    profileForm.value.name = res.data.name;
    profileForm.value.email = res.data.email;
    currentAvatar.value = res.data.avatar; // Map directly to DB column path
  } catch (e) { 
    console.error("Failed loading account metadata:", e); 
  }
};

// Form 1 handler: Profile Update
const saveProfile = async () => {
  profileLoading.value = true;
  profileErrors.value = {}; 
  
  const formData = new FormData();
  formData.append('name', profileForm.value.name || '');
  formData.append('email', profileForm.value.email || '');
  if (selectedAvatarFile.value) {
    formData.append('avatar', selectedAvatarFile.value);
  }

  try {
    await api.post('/admin/profile/update', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });
    Swal.fire({ icon: 'success', title: 'Profile Updated', text: 'Avatar and coordinates synced successfully.', showConfirmButton: false, timer: 1500 });
    window.location.reload(); 
  } catch (err) {
    if (err.response && err.response.status === 422) {
      profileErrors.value = err.response.data.errors; 
    } else {
      Swal.fire('Error', err.response?.data?.message || 'Failed to update profile.', 'error');
    }
  } finally { profileLoading.value = false; }
};

// Form 2 handler: Password Change
const savePassword = async () => {
  passwordErrors.value = {}; 

  if (!passwordForm.value.old_password || !passwordForm.value.password) {
    passwordErrors.value = {
      old_password: !passwordForm.value.old_password ? ['The current password field is required.'] : null,
      password: !passwordForm.value.password ? ['The new password field is required.'] : null
    };
    return;
  }

  if (passwordForm.value.password !== passwordForm.value.password_confirmation) {
    passwordErrors.value = { password: ['The new password confirmation does not match.'] };
    return;
  }

  passwordLoading.value = true;
  try {
    await api.post('/admin/profile/change-password', passwordForm.value);
    Swal.fire({ icon: 'success', title: 'Security Patched!', text: 'Your new password is now active.', showConfirmButton: false, timer: 1500 });
    
    // Clear forms inputs after success
    passwordForm.value.old_password = '';
    passwordForm.value.password = '';
    passwordForm.value.password_confirmation = '';
  } catch (err) {
    if (err.response && err.response.status === 422) {
      passwordErrors.value = err.response.data.errors;
    } else {
      Swal.fire('Error', err.response?.data?.message || 'Security override denied.', 'error');
    }
  } finally { passwordLoading.value = false; }
};

onMounted(loadProfile);
</script>