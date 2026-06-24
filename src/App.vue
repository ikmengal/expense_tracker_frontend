<!-- <template>
  <div class="min-h-screen w-full bg-gray-50 text-gray-900 transition-colors duration-300">
    
    <Navbar v-if="route.path !== '/' && route.path !== '/register' && route.path !== '/forgot-password' && route.path !== '/reset-password' && route.path !== '/contact-us'"  />
    
    <router-view v-slot="{ Component }">
      <transition name="fade" mode="out-in">
        <component :is="Component" :key="route.fullPath" />
      </transition>
    </router-view>

  </div>
</template>

<script setup>
import { useRoute } from 'vue-router';
import Navbar from './components/Navbar.vue';

const route = useRoute();
</script>

<style>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style> -->

<template>
  <router-view />
</template>

<script setup>
import { onMounted } from 'vue';
import api from './services/api'; // Apne api service ka sahi path check kar lein

const loadGlobalBranding = async () => {
  try {
    const res = await api.get('/admin/settings');
    
    if (res.data) {
      // 1. Browser Tab Title dynamically change karein
      if (res.data.site_name) {
        document.title = res.data.site_name;
      }
      
      // 2. Browser Favicon dynamically change karein
      if (res.data.site_favicon) {
        let link = document.querySelector("link[rel~='icon']");
        if (!link) {
          link = document.createElement('link');
          link.rel = 'icon';
          document.getElementsByTagName('head')[0].appendChild(link);
        }
        link.href = res.data.site_favicon;
      }
    }
  } catch (e) {
    console.error("Global branding loading failed:", e);
  }
};

// Application load hote hi trigger hoga
onMounted(loadGlobalBranding);
</script>