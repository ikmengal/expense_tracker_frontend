<template>
  <div class="min-h-screen bg-slate-50/50 text-slate-800 font-sans flex antialiased">
    
    <!-- 1. COMPACT PREMIUM SIDEBAR -->
    <aside class="w-20 bg-white border-r border-slate-100 flex flex-col items-center py-6 justify-between shrink-0 sticky top-0 h-screen hidden sm:flex">
      <div class="flex flex-col items-center gap-8">
        <div class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white font-black shadow-md shadow-indigo-100">
          CC
        </div>
        <nav class="flex flex-col gap-4">
          <button @click="activeTab = 'users'" :class="activeTab === 'users' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'" class="p-3 rounded-xl transition duration-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" /></svg>
          </button>
          <button @click="activeTab = 'goals'" :class="activeTab === 'goals' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:text-slate-600'" class="p-3 rounded-xl transition duration-200">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 002 2h2a2 2 0 002-2" /></svg>
          </button>
        </nav>
      </div>
      <div class="w-9 h-9 bg-indigo-100 text-indigo-700 text-xs font-bold rounded-full flex items-center justify-center">AD</div>
    </aside>

    <!-- MAIN PRODUCTIVE ENVIRONMENT WORKSPACE -->
    <main class="flex-1 flex flex-col lg:flex-row min-w-0">
      
      <!-- CENTER CORE HOUSING LAYER (LEFT BLOCK) -->
      <section class="flex-1 p-4 md:p-8 overflow-y-auto space-y-6">
        
        <!-- SYSTEM NAVIGATION TOP HEADER -->
        <div class="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div>
            <h1 class="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              System Control Center
            </h1>
            <p class="text-xs text-slate-400 mt-1">Manage user operations, high-fidelity metrics, goals, and complaints.</p>
          </div>
          <span class="text-[10px] font-bold bg-indigo-50 text-indigo-600 px-3 py-1.5 rounded-xl border border-indigo-100 self-start sm:self-auto tracking-wider uppercase">
            🔒 Spatie Protected
          </span>
        </div>

        <!-- SAAS METRIC COUNTER TILES -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div @click="activeTab = 'users'" :class="activeTab === 'users' ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white text-slate-800 border-slate-100'" class="p-5 rounded-2xl border shadow-sm flex items-center justify-between cursor-pointer hover:-translate-y-0.5 transition duration-200">
            <div>
              <p :class="activeTab === 'users' ? 'text-indigo-200' : 'text-slate-400'" class="text-[10px] font-bold uppercase tracking-wider">Active Users</p>
              <h3 class="text-2xl font-black mt-1">{{ stats.total_users || 0 }}</h3>
            </div>
            <span :class="activeTab === 'users' ? 'bg-white/10 text-white' : 'bg-slate-50 text-slate-600'" class="w-10 h-10 rounded-xl flex items-center justify-center text-lg">👥</span>
          </div>

          <div @click="activeTab = 'goals'; goalFilter = 'all'" :class="activeTab === 'goals' && goalFilter === 'all' ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg shadow-indigo-100' : 'bg-white text-slate-800 border-slate-100'" class="p-5 rounded-2xl border shadow-sm flex items-center justify-between cursor-pointer hover:-translate-y-0.5 transition duration-200">
            <div>
              <p :class="activeTab === 'goals' && goalFilter === 'all' ? 'text-indigo-200' : 'text-slate-400'" class="text-[10px] font-bold uppercase tracking-wider">Total Goals</p>
              <h3 class="text-2xl font-black mt-1">{{ stats.total_goals || 0 }}</h3>
            </div>
            <span :class="activeTab === 'goals' && goalFilter === 'all' ? 'bg-white/10 text-white' : 'bg-slate-50 text-slate-600'" class="w-10 h-10 rounded-xl flex items-center justify-center text-lg">🎯</span>
          </div>

          <div @click="goToAchievedGoals()" :class="activeTab === 'goals' && goalFilter === 'achieved' ? 'bg-emerald-600 border-emerald-600 text-white shadow-lg shadow-emerald-100' : 'bg-white text-slate-800 border-slate-100'" class="p-5 rounded-2xl border shadow-sm flex items-center justify-between cursor-pointer hover:-translate-y-0.5 transition duration-200">
            <div>
              <p :class="activeTab === 'goals' && goalFilter === 'achieved' ? 'text-emerald-100' : 'text-slate-400'" class="text-[10px] font-bold uppercase tracking-wider">Goals Completed</p>
              <h3 :class="activeTab === 'goals' && goalFilter === 'achieved' ? 'text-white' : 'text-emerald-600'" class="text-2xl font-black mt-1">{{ stats.achieved_goals || 0 }}</h3>
            </div>
            <span :class="activeTab === 'goals' && goalFilter === 'achieved' ? 'bg-white/10 text-white' : 'bg-slate-50 text-slate-600'" class="w-10 h-10 rounded-xl flex items-center justify-center text-lg">✅</span>
          </div>

          <div @click="activeTab = 'tickets'" :class="activeTab === 'tickets' ? 'bg-rose-600 border-rose-600 text-white shadow-lg shadow-rose-100' : 'bg-white text-slate-800 border-slate-100'" class="p-5 rounded-2xl border shadow-sm flex items-center justify-between cursor-pointer hover:-translate-y-0.5 transition duration-200">
            <div>
              <p :class="activeTab === 'tickets' ? 'text-rose-200' : 'text-slate-400'" class="text-[10px] font-bold uppercase tracking-wider">Open Complaints</p>
              <h3 :class="activeTab === 'tickets' ? 'text-white' : 'text-rose-600'" class="text-2xl font-black mt-1">{{ stats.open_tickets || 0 }}</h3>
            </div>
            <!-- FIXED COMPILATION ERROR HERE -->
            <span 
              :class="[
                activeTab === 'tickets' ? 'bg-white/10 text-white' : 'bg-slate-50 text-slate-600',
                { 'animate-pulse': stats.open_tickets > 0 }
              ]" 
              class="w-10 h-10 rounded-xl flex items-center justify-center text-lg"
            >
              ⚠️
            </span>
          </div>
        </div>

        <!-- INTERFACE LAYER SEGMENTATION CONTENT -->
        <div v-if="loading" class="text-center py-20 bg-white rounded-2xl border border-slate-100 shadow-sm">
          <div class="inline-block animate-spin rounded-full h-7 w-7 border-2 border-indigo-600 border-t-transparent mb-2"></div>
          <p class="text-xs text-slate-400">Syncing workspace definitions logs...</p>
        </div>

        <div v-else class="space-y-6">
          
          <!-- TAB DATA 1: USER DIRECTORY -->
          <div v-if="activeTab === 'users'" class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
            <div class="overflow-x-auto">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-slate-50/70 text-[10px] font-bold text-slate-400 uppercase border-b border-slate-100 tracking-wider">
                    <th class="p-4">User Details</th>
                    <th class="p-4">Access Level</th>
                    <th class="p-4">Performance Metrics</th>
                    <th class="p-4 text-right">Actions Matrix</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-50 text-xs">
                  <tr v-for="user in users" :key="user.id" :class="selectedUserAnalytics?.id === user.id ? 'bg-indigo-50/40' : 'hover:bg-slate-50/50'" class="transition duration-150">
                    <td class="p-4">
                      <div class="flex items-center gap-3">
                        <div class="w-9 h-9 bg-slate-100 text-slate-700 font-bold rounded-xl flex items-center justify-center border shadow-sm shrink-0">
                          {{ user.name.charAt(0) }}
                        </div>
                        <div>
                          <p class="font-bold text-slate-800 text-sm">{{ user.name }}</p>
                          <p class="text-slate-400 text-[11px] mt-0.5">{{ user.email }}</p>
                        </div>
                      </div>
                    </td>
                    <td class="p-4">
                      <span v-if="user.roles?.length" :class="user.roles[0].name.toLowerCase() === 'admin' ? 'bg-indigo-50 text-indigo-700 border-indigo-100' : 'bg-slate-50 text-slate-600 border-slate-100'" class="px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wide border">
                        {{ user.roles[0].name }}
                      </span>
                      <span v-else class="text-[10px] text-slate-400 italic bg-slate-50 px-2 py-0.5 rounded-lg border">User</span>
                    </td>
                    <td class="p-4">
                      <div class="flex items-center gap-3 text-slate-500 font-semibold">
                        <span class="flex items-center gap-1">🎯 <strong class="text-slate-700">{{ user.goals_count || 0 }}</strong></span>
                        <span class="text-slate-200">|</span>
                        <span class="flex items-center gap-1">💸 <strong class="text-slate-700">{{ user.transactions_count || 0 }}</strong></span>
                      </div>
                    </td>
                    <td class="p-4 text-right space-x-2 whitespace-nowrap">
                      <button @click="loadUserDeepAnalytics(user)" class="bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold px-3 py-1.5 rounded-xl text-[11px] transition">
                        📊 Analyze
                      </button>
                      <button v-if="!user.roles || user.roles[0]?.name.toLowerCase() !== 'admin'" @click="impersonateUser(user)" class="bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-3 py-1.5 rounded-xl text-[11px] transition">
                        👁️ Portal
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- TAB DATA 2: SAVING GOALS -->
          <div v-if="activeTab === 'goals'" class="space-y-4">
            <div class="flex items-center space-x-1.5 bg-slate-100/80 p-1 rounded-xl w-fit text-[11px] font-bold">
              <button @click="goalFilter = 'all'" :class="goalFilter === 'all' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400'" class="px-3 py-1.5 rounded-lg transition">All Goals</button>
              <button @click="goalFilter = 'active'" :class="goalFilter === 'active' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400'" class="px-3 py-1.5 rounded-lg transition">Active</button>
              <button @click="goalFilter = 'achieved'" :class="goalFilter === 'achieved' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400'" class="px-3 py-1.5 rounded-lg transition">Achieved Only</button>
            </div>

            <div class="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden">
              <table class="w-full text-left border-collapse">
                <thead>
                  <tr class="bg-slate-50/70 text-[10px] font-bold text-slate-400 uppercase border-b border-slate-100 tracking-wider">
                    <th class="p-4">Account Owner</th>
                    <th class="p-4">Goal Blueprint</th>
                    <th class="p-4">Financial State</th>
                    <th class="p-4">Progress Matrix</th>
                  </tr>
                </thead>
                <tbody class="divide-y divide-slate-50 text-xs">
                  <tr v-for="goal in filteredGoals" :key="goal.id" class="hover:bg-slate-50/40 transition">
                    <td class="p-4">
                      <p class="font-bold text-slate-800">{{ goal.user?.name || 'Unknown User' }}</p>
                      <p class="text-[10px] text-slate-400 mt-0.5">{{ goal.user?.email }}</p>
                    </td>
                    <td class="p-4 font-semibold text-slate-700 text-sm">{{ goal.title }}</td>
                    <td class="p-4 font-mono font-bold text-slate-600">
                      <span class="text-indigo-600">{{ goal.target_amount }}</span> / <span class="text-slate-800">{{ goal.saved_amount }}</span>
                    </td>
                    <td class="p-4 w-1/4">
                      <div class="flex items-center space-x-3">
                        <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                          <div :class="goal.status === 'achieved' ? 'bg-emerald-500' : 'bg-indigo-500'" :style="{ width: calculateProgress(goal.saved_amount, goal.target_amount) + '%' }" class="h-full rounded-full transition-all duration-500"></div>
                        </div>
                        <span class="font-bold text-[10px] text-slate-500">{{ calculateProgress(goal.saved_amount, goal.target_amount) }}%</span>
                      </div>
                    </td>
                  </tr>
                  <tr v-if="filteredGoals.length === 0">
                    <td colspan="4" class="p-8 text-center text-slate-400 italic">No saving goals matching this criteria found.</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- TAB DATA 3: SUPPORT COMPLAINTS -->
          <div v-if="activeTab === 'tickets'" class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div v-for="ticket in tickets" :key="ticket.id" class="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm space-y-4 flex flex-col justify-between hover:shadow-md transition">
              <div class="space-y-3">
                <div class="flex justify-between items-start gap-2">
                  <div>
                    <h5 class="font-bold text-slate-800 text-sm">{{ ticket.user?.name }}</h5>
                    <p class="text-[10px] text-slate-400">{{ ticket.user?.email }}</p>
                  </div>
                  <span :class="ticket.status.toLowerCase() === 'open' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'" class="px-2.5 py-0.5 rounded-lg text-[9px] font-bold border uppercase tracking-wider">
                    {{ ticket.status }}
                  </span>
                </div>
                <p class="text-xs text-slate-500 bg-slate-50 p-3.5 rounded-xl border border-slate-100 leading-relaxed italic">
                  "{{ ticket.message }}"
                </p>
              </div>

              <div class="pt-2 border-t border-slate-50 flex justify-end">
                <button v-if="ticket.status.toLowerCase() === 'open'" @click="openGlobalReplyWindow(ticket)" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-4 py-2 rounded-xl text-xs shadow-sm shadow-indigo-100 transition">
                  💬 Reply & Resolve
                </button>
                <div v-else class="text-[11px] text-slate-400 bg-emerald-50/50 p-2.5 rounded-xl border border-emerald-100 w-full italic">
                  <strong class="text-emerald-700 not-italic">Resolution:</strong> "{{ ticket.admin_reply }}"
                </div>
              </div>
            </div>
            <div v-if="tickets.length === 0" class="col-span-full bg-white rounded-2xl border border-slate-100 p-12 text-center text-xs text-slate-400 font-medium shadow-sm">
              Sare problems resolved hain! No pending tickets found.
            </div>
          </div>

        </div>
      </section>

      <!-- PREMIUM RIGHT SIDEBAR CLOSURE DRAWER (THE INSIGHT SHEET) -->
      <section class="w-full lg:w-96 bg-white border-t lg:border-t-0 lg:border-l border-slate-100 p-6 space-y-6 shrink-0 sticky top-0 h-screen overflow-y-auto" :class="selectedUserAnalytics ? 'block' : 'hidden lg:flex flex-col items-center justify-center text-center text-slate-300'">
        
        <!-- Empty Selection View Block state -->
        <div v-if="!selectedUserAnalytics" class="space-y-3 py-20">
          <span class="text-4xl block">📊</span>
          <p class="text-xs font-bold text-slate-400 uppercase tracking-wider">Operational Insight Sheet</p>
          <p class="text-[11px] text-slate-400 max-w-[200px] mx-auto leading-normal">Select an account profile to compute deep live database diagnostics records.</p>
        </div>

        <!-- Populated State Layout Wrapper Matrix -->
        <div v-else class="w-full space-y-6">
          <div class="flex items-center justify-between pb-4 border-b border-slate-100">
            <div>
              <span class="text-[9px] bg-indigo-600 text-white font-extrabold uppercase px-2 py-0.5 rounded tracking-wide">Live Diagnosis Suite</span>
              <h4 class="font-bold text-slate-900 text-base mt-0.5 truncate max-w-[180px]">{{ selectedUserAnalytics.name }}</h4>
            </div>
            <button @click="selectedUserAnalytics = null" class="text-slate-400 hover:text-slate-600 text-xs font-bold bg-slate-50 px-2.5 py-1.5 rounded-xl border border-slate-100 transition">
              ✕ Dismiss
            </button>
          </div>

          <!-- WALLET METRIC STATE CARD -->
          <div class="bg-gradient-to-br from-slate-900 to-indigo-950 text-white p-5 rounded-2xl shadow-xl relative overflow-hidden space-y-5">
            <div class="flex justify-between items-start">
              <span class="text-[10px] text-slate-400 tracking-wider font-semibold uppercase">Net Reserve Assets</span>
              <span class="text-[9px] font-bold px-2 py-0.5 rounded bg-white/10 uppercase tracking-wide">PKR Ledger</span>
            </div>
            <div>
              <h2 class="text-2xl font-black tracking-tight">{{ targetUserStats.net_balance || 'PKR 0.00' }}</h2>
              <p class="text-[10px] text-slate-400 mt-1">Aggregated mathematical database value</p>
            </div>
            <div class="grid grid-cols-2 gap-2 pt-3 border-t border-white/10 text-[11px]">
              <div>
                <p class="text-slate-400 font-medium">Inflow Stream</p>
                <p class="font-bold text-emerald-400 mt-0.5">{{ targetUserStats.total_income || 'PKR 0.00' }}</p>
              </div>
              <div>
                <p class="text-slate-400 font-medium">Outflow Stream</p>
                <p class="font-bold text-rose-400 mt-0.5">{{ targetUserStats.total_expense || 'PKR 0.00' }}</p>
              </div>
            </div>
          </div>

          <!-- MINI GRAPH GRID INJECTOR CONTAINER -->
          <div class="space-y-4">
            <div class="border border-slate-100 rounded-xl p-3.5 bg-slate-50/50 h-48 flex flex-col justify-between">
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">📈 Multi-Month Trend</p>
              <div class="flex-1 min-h-0 pt-2">
                <Bar :data="adminBarChartData" :options="chartOptions" />
              </div>
            </div>
            <div class="border border-slate-100 rounded-xl p-3.5 bg-slate-50/50 h-48 flex flex-col justify-between">
              <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">🍕 Distribution Breakdown</p>
              <div class="flex-1 min-h-0 pt-2">
                <Doughnut :data="adminDoughnutChartData" :options="chartOptions" />
              </div>
            </div>
          </div>

          <!-- COMPACT RECENT LEDGER LIST -->
          <div class="space-y-2.5">
            <h5 class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Audit History Ledger</h5>
            <div class="bg-white rounded-xl border border-slate-100 overflow-hidden max-h-48 overflow-y-auto divide-y divide-slate-50 shadow-inner">
              <div v-for="tx in targetUserStats.recent_transactions" :key="tx.id" class="p-3 flex justify-between items-center text-[11px] hover:bg-slate-50/50 transition">
                <div class="min-w-0">
                  <p class="font-bold text-slate-800 truncate">{{ tx.description || 'System Entry Transaction' }}</p>
                  <p class="text-[10px] text-slate-400 mt-0.5">{{ tx.date }} • {{ tx.category?.name || 'General' }}</p>
                </div>
                <span :class="tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'" class="font-black text-xs shrink-0 pl-2">
                  {{ tx.type === 'income' ? '+' : '-' }}{{ tx.amount }}
                </span>
              </div>
              <div v-if="!targetUserStats.recent_transactions?.length" class="text-center p-4 text-slate-400 italic text-[11px]">
                No operations recorded yet.
              </div>
            </div>
          </div>

        </div>
      </section>
    </main>
    
  </div>
</template>

<script setup>
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import api from '../services/api';
  import Swal from 'sweetalert2';

  // --- Chart.js Core Architecture Imports ---
  import { Bar, Doughnut } from 'vue-chartjs';
  import { 
    Chart as ChartJS, Title, Tooltip, Legend, BarElement, 
    CategoryScale, LinearScale, ArcElement 
  } from 'chart.js';

  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement);

  const activeTab = ref('users');
  const goalFilter = ref('all'); 
  const loading = ref(true);
  const stats = ref({});
  const users = ref([]);
  const tickets = ref([]);
  const goals = ref([]); 

  // --- Live Dynamic Profile View Analytics States ---
  const selectedUserAnalytics = ref(null);
  const targetUserStats = ref({
    total_income: 0,
    total_expense: 0,
    net_balance: 0,
    recent_transactions: [],
    monthly_cashflow: { labels: [], income: [], expense: [] },
    category_breakdown: { labels: [], data: [] }
  });

  // --- Fetch User Profiling Dataset Without Impersonation ---
  const loadUserDeepAnalytics = async (userInstance) => {
    Swal.fire({
      title: 'Compiling Analytical Logs...',
      text: `Gathering blueprints for ${userInstance.name}`,
      allowOutsideClick: false,
      didOpen: () => { Swal.showLoading(); }
    });

    try {
      const response = await api.get(`/admin/users/${userInstance.id}/analytics`);
      targetUserStats.value = response.data;
      selectedUserAnalytics.value = userInstance;
      Swal.close();
    } catch (error) {
      console.error("Failed loading direct tracking dashboard info:", error);
      Swal.fire('Fetch Failure', 'Backend parameters compile nahi kiye jaa sakay.', 'error');
    }
  };

  // --- Computed Advanced Charts Structures mappings ---
  const adminBarChartData = computed(() => ({
    labels: targetUserStats.value.monthly_cashflow?.labels || [],
    datasets: [
      { label: 'Income', backgroundColor: '#10b981', borderRadius: 4, data: targetUserStats.value.monthly_cashflow?.income || [] },
      { label: 'Expense', backgroundColor: '#ef4444', borderRadius: 4, data: targetUserStats.value.monthly_cashflow?.expense || [] }
    ]
  }));

  const adminDoughnutChartData = computed(() => ({
    labels: targetUserStats.value.category_breakdown?.labels || [],
    datasets: [{
      backgroundColor: ['#6366f1', '#3b82f6', '#ec4899', '#f59e0b', '#14b8a6', '#8b5cf6'],
      borderWidth: 2,
      borderColor: '#ffffff',
      data: targetUserStats.value.category_breakdown?.data || []
    }]
  }));

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { labels: { font: { size: 9, weight: '600' } } }
    }
  };

  const openGlobalReplyWindow = async (ticketInstance) => {
    const { value: text } = await Swal.fire({
      title: 'Reply & Resolve Ticket',
      input: 'textarea',
      inputLabel: `Replying to ${ticketInstance.user?.name || 'User'}`,
      inputPlaceholder: 'Type your resolution message here...',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5', 
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Send Reply & Resolve',
      inputValidator: (value) => {
        if (!value) { return 'Resolution message likhna zaroori hai!'; }
      }
    });

    if (text) {
      try {
        Swal.fire({
          title: 'Updating ticket...',
          allowOutsideClick: false,
          didOpen: () => { Swal.showLoading(); }
        });

        await api.post(`/admin/tickets/${ticketInstance.id}/reply`, { reply: text });
        Swal.fire('Success', 'Ticket resolve ho gayi hai!', 'success');

        const index = tickets.value.findIndex(t => t.id == ticketInstance.id);
        if (index !== -1) {
          tickets.value[index] = { ...tickets.value[index], status: 'resolved', admin_reply: text };
          if (stats.value && stats.value.open_tickets > 0) { stats.value.open_tickets -= 1; }
        }
      } catch (error) {
        console.error("Ticket resolution error:", error);
        Swal.fire('Error', 'Backend par ticket update nahi ho saki.', 'error');
      }
    }
  };

  const goToAchievedGoals = () => {
    activeTab.value = 'goals';
    goalFilter.value = 'achieved';
  };

  const calculateProgress = (current, target) => {
    if (!target || target <= 0) return 0;
    return Math.min(Math.round((current / target) * 100), 100);
  };

  const filteredGoals = computed(() => {
    if (goalFilter.value === 'active') { return goals.value.filter(g => g.status !== 'achieved'); }
    if (goalFilter.value === 'achieved') { return goals.value.filter(g => g.status === 'achieved'); }
    return goals.value;
  });

  const loadDashboardData = async () => {
    try {
      loading.value = true;
      const [resStats, resUsers, resTickets, resGoals] = await Promise.all([
        api.get('/admin/analytics'),
        api.get('/admin/users'),
        api.get('/admin/tickets'),
        api.get('/admin/goals') 
      ]);
      stats.value = resStats.data;
      users.value = resUsers.data;
      tickets.value = resTickets.data;
      goals.value = resGoals.data;
    } catch (error) {
      console.error("Dashboard error loading data logs:", error);
      if (error.response?.status === 403) {
        Swal.fire('Access Denied', 'Spatie restriction: Regular accounts allowed nahi hain.', 'error');
      }
    } finally { loading.value = false; }
  };

  const handleTicketResolvedInModal = (e) => {
    const ticketId = e.detail?.id || e.detail?.ticket_id;
    const ticketReply = e.detail?.reply || e.detail?.admin_reply || e.detail?.message;
    if (!ticketId) return;

    const index = tickets.value.findIndex(t => t.id == ticketId); 
    if (index !== -1) {
      tickets.value[index] = { ...tickets.value[index], status: 'resolved', admin_reply: ticketReply };
      if (stats.value && stats.value.open_tickets > 0) { stats.value.open_tickets -= 1; }
    }
  };

  onMounted(() => { 
    loadDashboardData(); 
    window.addEventListener('ticket-resolved', handleTicketResolvedInModal);
  });

  onUnmounted(() => {
    window.removeEventListener('ticket-resolved', handleTicketResolvedInModal);
  });

  const impersonateUser = async (userInstance) => {
    try {
      const confirmation = await Swal.fire({
        title: `View ${userInstance.name}'s Dashboard?`,
        text: "Aap is user ke environment portal me temporary login ho jayenge.",
        icon: 'question',
        showCancelButton: true,
        confirmButtonColor: '#4f46e5', 
        cancelButtonColor: '#94a3b8',
        confirmButtonText: 'Yes, Open View'
      });

      if (!confirmation.isConfirmed) return;

      Swal.fire({
        title: 'Generating Temporary Session Key...',
        allowOutsideClick: false,
        didOpen: () => { Swal.showLoading(); }
      });

      const response = await api.post(`/admin/users/${userInstance.id}/impersonate`);
      const data = response.data;
      Swal.close();
      
      const targetRoute = `${window.location.origin}${data.redirect_url}?impersonate_token=${encodeURIComponent(data.token)}`;
      window.open(targetRoute, '_blank');
    } catch (error) {
      console.error("Impersonation Error:", error);
      Swal.fire('Session Build Failure', error.response?.data?.message || 'Backend token pipeline failure.', 'error');
    }
  };
</script>