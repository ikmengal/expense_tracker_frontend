<template>
  <div class="min-h-screen bg-gray-50 flex flex-col">
    <UserNavbar />

    <main class="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import UserNavbar from '../components/UserNavbar.vue';
</script>