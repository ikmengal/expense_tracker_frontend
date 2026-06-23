<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <div class="max-w-5xl mx-auto p-6 md:p-10 space-y-6 w-full flex-1">
      
      <div class="flex space-x-2 border-b border-gray-200 pb-px">
        <button 
          @click="switchTab('personal')"
          :class="activeTab === 'personal' ? 'border-indigo-600 text-indigo-600 font-bold' : 'border-transparent text-gray-500 hover:text-gray-700'"
          class="pb-3 px-4 text-sm font-medium border-b-2 transition"
        >
          👤 Personal Profile
        </button>
      </div>

      <div v-if="activeTab === 'personal'" class="grid grid-cols-1 md:grid-cols-3 gap-8 pt-4">
        <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 flex flex-col items-center justify-center text-center h-fit">
          <div class="relative group">
            <img 
              :src="avatarPreview || finalAvatarUrl" 
              alt="Avatar" 
              class="w-32 h-32 rounded-full object-cover border-4 border-indigo-50 shadow-md"
            />
            <label class="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center text-white text-xs opacity-0 group-hover:opacity-100 cursor-pointer transition duration-200 font-medium">
              📸 Change Photo
              <input type="file" @change="onFileChange" accept="image/*" class="hidden" />
            </label>
          </div>
          <h2 class="text-lg font-bold text-gray-800 mt-4">{{ user.name }}</h2>
          <p class="text-xs text-gray-400 font-medium">{{ user.email }}</p>
        </div>

        <div class="md:col-span-2 space-y-6">
          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 class="text-md font-bold text-gray-800 border-b pb-3 mb-4">Personal Details</h3>
            <form @submit.prevent="handleUpdateProfile" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Full Name</label>
                <input v-model="profileForm.name" type="text" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-indigo-500 text-sm" />
              </div>
              <div class="flex justify-end">
                <button type="submit" :disabled="profileLoading" class="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition disabled:bg-indigo-400">
                  {{ profileLoading ? 'Saving Info...' : 'Save Profile Details' }}
                </button>
              </div>
            </form>
          </div>

          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
            <h3 class="text-md font-bold text-gray-800 border-b pb-3 mb-4">Change Password</h3>
            <form @submit.prevent="handleUpdatePassword" class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-gray-700">Current Password</label>
                <input v-model="passwordForm.current_password" type="password" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label class="block text-sm font-medium text-gray-700">New Password</label>
                  <input v-model="passwordForm.password" type="password" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
                <div>
                  <label class="block text-sm font-medium text-gray-700">Confirm Password</label>
                  <input v-model="passwordForm.password_confirmation" type="password" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
                </div>
              </div>
              <p v-if="passwordError" class="text-red-500 text-xs font-medium">{{ passwordError }}</p>
              <div class="flex justify-end">
                <button type="submit" :disabled="passwordLoading" class="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition">
                  {{ passwordLoading ? 'Changing...' : 'Update Password' }}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>

      <div v-if="activeTab === 'website'" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 pt-4 max-w-3xl">
        <div class="border-b pb-3 mb-4">
          <h3 class="text-md font-bold text-gray-800">Website Configuration</h3>
          <p class="text-xs text-gray-400 mt-0.5">Yahan se application ka logo, title aur system emails manage karein.</p>
        </div>

        <form @submit.prevent="handleUpdateWebsiteSettings" class="space-y-4">
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label class="block text-sm font-medium text-gray-700">Application Name</label>
              <input v-model="siteForm.site_name" type="text" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700">System Notification Email</label>
              <input v-model="siteForm.site_email" type="email" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-sm" />
            </div>
          </div>

          <div>
            <label class="block text-sm font-medium text-gray-700">System Logo</label>
            <div class="mt-1 flex items-center space-x-4">
              <img 
                :src="logoPreview || finalLogoUrl" 
                class="w-16 h-16 object-contain border rounded-xl bg-gray-50 p-1"
                alt="Logo Preview"
              />
              <input type="file" @change="onLogoChange" accept="image/*" class="text-xs text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-xl file:border-0 file:text-xs file:font-semibold file:bg-indigo-50 file:text-indigo-600 hover:file:bg-indigo-100" />
            </div>
          </div>

          <div class="flex justify-end pt-2">
            <button type="submit" :disabled="siteLoading" class="px-5 py-2 text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 rounded-lg transition shadow-sm">
              {{ siteLoading ? 'Updating System...' : 'Save Website Settings' }}
            </button>
          </div>
        </form>
      </div>

    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import api from '../services/api';
import Swal from 'sweetalert2';

const route = useRoute();
const router = useRouter();
const activeTab = ref('personal');

const user = ref({});
const avatarFile = ref(null);
const avatarPreview = ref(null);

const logoFile = ref(null);
const logoPreview = ref(null);

const profileLoading = ref(false);
const passwordLoading = ref(false);
const siteLoading = ref(false);
const passwordError = ref('');

const profileForm = ref({ name: '' });
const passwordForm = ref({ current_password: '', password: '', password_confirmation: '' });
const siteForm = ref({ site_name: '', site_email: '', site_logo: '' });

const checkTabRoute = () => {
  if (route.path === '/settings/system') {
    activeTab.value = 'website';
  } else {
    activeTab.value = 'personal';
  }
};

const switchTab = (tab) => {
  activeTab.value = tab;
  if (tab === 'website') {
    router.push('/settings/system');
  } else {
    router.push('/profile');
  }
};

onMounted(() => {
  checkTabRoute();
  const localUser = localStorage.getItem('user');
  if (localUser && localUser !== "undefined") {
    user.value = JSON.parse(localUser);
    profileForm.value.name = user.value.name;
  }
  fetchLatestUserData();
  fetchWebsiteSettings();
});

const fetchLatestUserData = async () => {
  try {
    const response = await api.get('/user/profile');
    user.value = response.data;
    profileForm.value.name = response.data.name;
    localStorage.setItem('user', JSON.stringify(response.data));
    window.dispatchEvent(new CustomEvent('profile-updated')); // Instant navbar sync trigger
  } catch (e) {
    console.error(e);
  }
};

const fetchWebsiteSettings = async () => {
  try {
    const response = await api.get('/system/settings');
    if (response.data) {
      siteForm.value = response.data;
    }
  } catch (e) {
    console.error(e);
  }
};

const finalAvatarUrl = computed(() => {
  if (user.value && user.value.avatar) {
    if (user.value.avatar.startsWith('http')) return user.value.avatar;
    return `http://localhost:8000/storage/${user.value.avatar}`;
  }
  return `https://ui-avatars.com/api/?name=${user.value.name || 'User'}&background=eeffff&color=4f46e5`;
});

const finalLogoUrl = computed(() => {
  if (siteForm.value && siteForm.value.site_logo) {
    return `http://localhost:8000/storage/${siteForm.value.site_logo}`;
  }
  return 'https://via.placeholder.com/150?text=No+Logo';
});

const onFileChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  avatarFile.value = file;
  avatarPreview.value = URL.createObjectURL(file);
};

const onLogoChange = (e) => {
  const file = e.target.files[0];
  if (!file) return;
  logoFile.value = file;
  logoPreview.value = URL.createObjectURL(file);
};

const handleUpdateProfile = async () => {
  profileLoading.value = true;
  try {
    const formData = new FormData();
    formData.append('name', profileForm.value.name);
    if (avatarFile.value) formData.append('avatar', avatarFile.value);

    const response = await api.post('/user/update-profile', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    Swal.fire({ title: 'Success!', text: 'Profile update ho gayi.', icon: 'success', timer: 1500, showConfirmButton: false });
    localStorage.setItem('user', JSON.stringify(response.data.user));
    user.value = response.data.user;
    avatarPreview.value = null;
    window.dispatchEvent(new CustomEvent('profile-updated')); // Broadcaster trigger
  } catch (error) {
    Swal.fire({ title: 'Error', text: error.response?.data?.message || 'Update failed.', icon: 'error' });
  } finally {
    profileLoading.value = false;
  }
};

const handleUpdatePassword = async () => {
  passwordLoading.value = true;
  passwordError.value = '';
  try {
    await api.put('/user/update-password', passwordForm.value);
    Swal.fire({ title: 'Password Secure!', text: 'Password badal diya gaya hy.', icon: 'success', timer: 2000, showConfirmButton: false });
    passwordForm.value = { current_password: '', password: '', password_confirmation: '' };
  } catch (error) {
    passwordError.value = error.response?.data?.message || 'Error occurred.';
  } finally {
    passwordLoading.value = false;
  }
};

const handleUpdateWebsiteSettings = async () => {
  siteLoading.value = true;
  try {
    const formData = new FormData();
    formData.append('site_name', siteForm.value.site_name);
    formData.append('site_email', siteForm.value.site_email);
    if (logoFile.value) formData.append('site_logo', logoFile.value);

    const response = await api.post('/system/settings', formData, {
      headers: { 'Content-Type': 'multipart/form-data' }
    });

    Swal.fire({ title: 'System Updated', text: 'Website settings save ho gayi hain.', icon: 'success', timer: 1500, showConfirmButton: false });
    
    siteForm.value = response.data.settings;
    logoPreview.value = null;

    // 💡 LIVE SYNC TRIGGER: Is line se Navbar ka content foran change hoga
    window.dispatchEvent(new CustomEvent('website-settings-updated'));
    
  } catch (e) {
    Swal.fire({ title: 'Error', text: 'Settings update failed.', icon: 'error' });
  } finally {
    siteLoading.value = false;
  }
};
</script>