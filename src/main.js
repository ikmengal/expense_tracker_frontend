import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import './assets/main.css' // Ya aapki tailwind css wali file

createApp(App).use(router).mount('#app')