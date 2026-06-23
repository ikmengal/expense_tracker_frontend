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