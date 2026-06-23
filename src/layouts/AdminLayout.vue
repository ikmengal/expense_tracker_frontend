<template>
  <div class="min-h-screen bg-slate-100 flex flex-col">
    <AdminNavbar />

    <main class="flex-1 p-6 lg:p-8">
      <div class="max-w-7xl mx-auto">
        <router-view />
      </div>
    </main>
  </div>
</template>

<script setup>
import AdminNavbar from '../components/AdminNavbar.vue';
</script>