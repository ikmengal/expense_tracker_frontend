<template>
  <div class="max-w-4xl mx-auto mt-6 space-y-6">
    
    <div>
      <h3 class="text-lg font-black text-slate-900 flex items-center gap-2">👤 Admin Account Settings</h3>
      <p class="text-xs text-slate-400 mt-0.5">Manage your personal identification details and master security credentials separately.</p>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4 h-fit">
        <div>
          <h4 class="text-sm font-bold text-slate-800">Profile Information</h4>
          <p class="text-[11px] text-slate-400">Update your account name and contact email address.</p>
        </div>

        <form @submit.prevent="saveProfile" class="space-y-4">
          <div class="flex items-center space-x-4 bg-slate-50 p-3 rounded-xl border border-gray-100">
            <div class="relative">
              <img 
                :src="avatarUrl" 
                alt="Avatar" 
                class="h-14 w-14 rounded-xl object-cover border-2 border-white shadow-md bg-white"
              />
            </div>
            <div class="flex-1">
              <label class="block text-[10px] font-bold text-slate-500 uppercase tracking-wider mb-1">Profile Photo</label>
              <input type="file" @change="onAvatarSelected" accept="image/*" class="text-xs text-slate-500 file:mr-3 file:py-1 file:px-2.5 file:rounded-lg file:border-0 file:text-[11px] file:font-bold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100 cursor-pointer w-full" />
              <p v-if="profileErrors.avatar" class="text-[11px] text-rose-600 font-semibold mt-1">{{ profileErrors.avatar[0] }}</p>
            </div>
          </div>

          <div>
            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">
              Full Name <span class="text-rose-500">*</span>
            </label>
            <input v-model="profileForm.name" type="text" class="w-full border rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none" :class="profileErrors.name ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20' : 'border-gray-200 focus:border-indigo-500'">
            <p v-if="profileErrors.name" class="text-[11px] text-rose-600 font-semibold mt-1">{{ profileErrors.name[0] }}</p>
          </div>
          
          <div>
            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">
              Email Address <span class="text-rose-500">*</span>
            </label>
            <input v-model="profileForm.email" type="text" class="w-full border rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none" :class="profileErrors.email ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20' : 'border-gray-200 focus:border-indigo-500'">
            <p v-if="profileErrors.email" class="text-[11px] text-rose-600 font-semibold mt-1">{{ profileErrors.email[0] }}</p>
          </div>

          <div class="flex justify-end pt-2 border-t border-gray-50">
            <button type="submit" :disabled="profileLoading" class="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm disabled:bg-indigo-400">
              {{ profileLoading ? 'Updating...' : 'Save Profile Details' }}
            </button>
          </div>
        </form>
      </div>

      <div class="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 space-y-4 h-fit">
        <div>
          <h4 class="text-sm font-bold text-slate-800 text-rose-700 flex items-center gap-1.5">🔒 Change Password</h4>
          <p class="text-[11px] text-slate-400">Ensure your account is using a long, random password to stay secure.</p>
        </div>

        <form @submit.prevent="savePassword" class="space-y-4">
          <div>
            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">
              Current Password <span class="text-rose-500">*</span>
            </label>
            <input v-model="passwordForm.old_password" type="password" placeholder="••••••••" class="w-full border rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none" :class="passwordErrors.old_password ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20' : 'border-gray-200 focus:border-rose-500'">
            <p v-if="passwordErrors.old_password" class="text-[11px] text-rose-600 font-semibold mt-1">{{ passwordErrors.old_password[0] }}</p>
          </div>
          
          <div class="border-t pt-3 border-gray-50">
            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">
              New Password <span class="text-rose-500">*</span>
            </label>
            <input v-model="passwordForm.password" type="password" placeholder="••••••••" class="w-full border rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none" :class="passwordErrors.password ? 'border-rose-400 focus:border-rose-500 bg-rose-50/20' : 'border-gray-200 focus:border-rose-500'">
            <p v-if="passwordErrors.password" class="text-[11px] text-rose-600 font-semibold mt-1">{{ passwordErrors.password[0] }}</p>
          </div>

          <div>
            <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1 tracking-wider">
              Confirm New Password <span class="text-rose-500">*</span>
            </label>
            <input v-model="passwordForm.password_confirmation" type="password" placeholder="••••••••" class="w-full border border-gray-200 rounded-xl px-3 py-2 text-xs font-semibold text-slate-700 focus:outline-none focus:border-rose-500">
          </div>

          <div class="flex justify-end pt-2 border-t border-gray-50">
            <button type="submit" :disabled="passwordLoading" class="bg-slate-900 hover:bg-black text-white text-xs font-bold px-4 py-2 rounded-xl transition shadow-sm disabled:bg-slate-700">
              {{ passwordLoading ? 'Changing...' : 'Update Secret Key' }}
            </button>
          </div>
        </form>
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