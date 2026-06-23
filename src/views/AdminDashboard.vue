<template>
  <div class="min-h-screen bg-gray-50/30 p-4 md:p-10 max-w-7xl mx-auto space-y-8 w-full">
    
    <!-- SYSTEM HEADER -->
    <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-5 border-gray-200/60">
      <div>
        <h1 class="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
          <span>⚙️</span> System Control Center
        </h1>
        <p class="text-xs text-slate-400 mt-0.5">Manage user operations, system analytics, goals tracking, and incoming support tickets.</p>
      </div>
      <div class="text-[11px] font-bold bg-indigo-50/60 text-indigo-600 px-3 py-1.5 rounded-xl border border-indigo-100 self-start sm:self-auto uppercase tracking-wider">
        🔒 Spatie Protected
      </div>
    </div>

    <!-- MAIN METRIC COUNTERS -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      <div 
        @click="activeTab = 'users'"
        :class="activeTab === 'users' ? 'ring-2 ring-indigo-600 bg-indigo-50/10' : 'bg-white'"
        class="p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition duration-200"
      >
        <div>
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Active Users</p>
          <h3 class="text-2xl font-black text-slate-800 mt-1">{{ stats.total_users || 0 }}</h3>
        </div>
        <span class="p-3 bg-blue-50/60 text-blue-600 rounded-xl text-xl">👥</span>
      </div>

      <div 
        @click="activeTab = 'goals'"
        :class="activeTab === 'goals' ? 'ring-2 ring-indigo-600 bg-indigo-50/10' : 'bg-white'"
        class="p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition duration-200"
      >
        <div>
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">System Saving Goals</p>
          <h3 class="text-2xl font-black text-slate-800 mt-1">{{ stats.total_goals || 0 }}</h3>
        </div>
        <span class="p-3 bg-indigo-50/60 text-indigo-600 rounded-xl text-xl">🎯</span>
      </div>

      <div 
        @click="goToAchievedGoals()"
        :class="activeTab === 'goals' && goalFilter === 'achieved' ? 'ring-2 ring-emerald-600 bg-emerald-50/10' : 'bg-white'"
        class="p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition duration-200"
      >
        <div>
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Goals Achieved</p>
          <h3 class="text-2xl font-black text-emerald-600 mt-1">{{ stats.achieved_goals || 0 }}</h3>
        </div>
        <span class="p-3 bg-emerald-50/60 text-emerald-600 rounded-xl text-xl">✅</span>
      </div>

      <div 
        @click="activeTab = 'tickets'"
        :class="activeTab === 'tickets' ? 'ring-2 ring-rose-600 bg-rose-50/10' : 'bg-white'"
        class="p-5 rounded-2xl border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition duration-200"
      >
        <div>
          <p class="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Open Complaints</p>
          <h3 class="text-2xl font-black text-rose-600 mt-1">{{ stats.open_tickets || 0 }}</h3>
        </div>
        <span class="p-3 bg-rose-50/60 text-rose-600 rounded-xl text-xl" :class="{'animate-pulse': stats.open_tickets > 0}">⚠️</span>
      </div>
    </div>

    <!-- TABS NAVIGATION -->
    <div class="flex border-b border-gray-200 space-x-1">
      <button 
        @click="activeTab = 'users'" 
        :class="activeTab === 'users' ? 'border-indigo-600 text-indigo-600 font-bold bg-indigo-50/30' : 'border-transparent text-slate-400 hover:text-slate-600'" 
        class="py-2.5 px-4 border-b-2 text-xs font-semibold rounded-t-xl transition focus:outline-none"
      >
        👤 User Accounts
      </button>

      <button 
        @click="activeTab = 'goals'" 
        :class="activeTab === 'goals' ? 'border-indigo-600 text-indigo-600 font-bold bg-indigo-50/30' : 'border-transparent text-slate-400 hover:text-slate-600'" 
        class="py-2.5 px-4 border-b-2 text-xs font-semibold rounded-t-xl transition focus:outline-none flex items-center space-x-1.5"
      >
        🎯 Saving Goals Directory
      </button>

      <button 
        @click="activeTab = 'tickets'" 
        :class="activeTab === 'tickets' ? 'border-indigo-600 text-indigo-600 font-bold bg-indigo-50/30' : 'border-transparent text-slate-400 hover:text-slate-600'" 
        class="py-2.5 px-4 border-b-2 text-xs font-semibold rounded-t-xl transition focus:outline-none flex items-center space-x-1.5"
      >
        <span>📩 Support Tickets</span>
        <span v-if="stats.open_tickets > 0" class="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
          {{ stats.open_tickets }}
        </span>
      </button>
    </div>

    <!-- CORE WORKSPACE INTERFACE -->
    <div v-if="loading" class="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
      <div class="inline-block animate-spin rounded-full h-7 w-7 border-3 border-indigo-600 border-t-transparent mb-2"></div>
      <p class="text-xs text-slate-400">Syncing secure analytical middleware...</p>
    </div>

    <div v-else>
      <!-- USER ACCOUNTS TAB -->
      <div v-if="activeTab === 'users'" class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div class="overflow-x-auto">
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-gray-50/70 text-[11px] font-bold text-slate-400 uppercase border-b border-gray-100 tracking-wider">
                <th class="p-4">Name</th>
                <th class="p-4">Email</th>
                <th class="p-4">Role Permission</th>
                <th class="p-4">Performance Metrics</th>
                <th class="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50 text-xs text-slate-600">
              <tr v-for="user in users" :key="user.id" class="hover:bg-slate-50/50 transition">
                <td class="p-4 font-semibold text-slate-800 text-sm">{{ user.name }}</td>
                <td class="p-4 text-slate-400 text-sm">{{ user.email }}</td>
                <td class="p-4">
                  <span 
                    v-if="user.roles && user.roles.length > 0"
                    :class="user.roles[0].name.toLowerCase() === 'admin' ? 'bg-indigo-50 text-indigo-700 border border-indigo-100' : 'bg-slate-50 text-slate-600 border border-slate-100'" 
                    class="px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wide"
                  >
                    {{ user.roles[0].name }}
                  </span>
                  <span v-else class="text-[10px] text-slate-400 italic bg-slate-50 px-2 py-0.5 rounded-lg border border-slate-100">User</span>
                </td>
                <td class="p-4">
                  <div class="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-3 font-semibold text-slate-500">
                    <span>🎯 <span class="text-slate-800 font-bold">{{ user.goals_count || 0 }}</span> Goals</span>
                    <span class="hidden sm:inline text-slate-300">|</span>
                    <span>💸 <span class="text-slate-800 font-bold">{{ user.transactions_count || 0 }}</span> Transactions</span>
                  </div>
                </td>
                <td class="p-4 text-right space-x-1.5 whitespace-nowrap">
                  <button 
                    @click="loadUserDeepAnalytics(user)"
                    class="inline-flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold px-2.5 py-1.5 rounded-xl text-[11px] transition duration-150"
                  >
                    📊 View Profile Insight
                  </button>
                  <button 
                    v-if="!user.roles || user.roles[0]?.name.toLowerCase() !== 'admin'"
                    @click="impersonateUser(user)"
                    title="Impersonate Dashboard"
                    class="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-2.5 py-1.5 rounded-xl text-[11px] transition duration-150"
                  >
                    <span>👁️</span> Impersonate
                  </button>
                  <span v-else class="text-[10px] text-slate-300 italic pr-2">Admin Account</span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- SAVING GOALS TAB -->
      <div v-if="activeTab === 'goals'" class="space-y-4">
        <div class="flex items-center space-x-2 bg-gray-100/80 p-1 rounded-xl w-fit text-[11px] font-bold">
          <button @click="goalFilter = 'all'" :class="goalFilter === 'all' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400'" class="px-3 py-1.5 rounded-lg transition">All Goals</button>
          <button @click="goalFilter = 'active'" :class="goalFilter === 'active' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400'" class="px-3 py-1.5 rounded-lg transition">Active Only</button>
          <button @click="goalFilter = 'achieved'" :class="goalFilter === 'achieved' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400'" class="px-3 py-1.5 rounded-lg transition">Achieved Only</button>
        </div>

        <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-gray-50/70 text-[11px] font-bold text-slate-400 uppercase border-b border-gray-100 tracking-wider">
                  <th class="p-4">Owner Profile</th>
                  <th class="p-4">Goal Title</th>
                  <th class="p-4">Target vs Current</th>
                  <th class="p-4">Progress Tracker</th>
                  <th class="p-4">Status</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-gray-50 text-xs text-slate-600">
                <tr v-for="goal in filteredGoals" :key="goal.id" class="hover:bg-slate-50/50 transition">
                  <td class="p-4">
                    <div class="font-bold text-slate-800">{{ goal.user?.name || 'Unknown User' }}</div>
                    <div class="text-[10px] text-slate-400">{{ goal.user?.email }}</div>
                  </td>
                  <td class="p-4 font-semibold text-slate-700 text-sm">{{ goal.title }}</td>
                  <td class="p-4 font-mono text-slate-600">
                    <span class="text-indigo-600 font-bold">{{ goal.target_amount }}</span> / <span class="font-bold text-slate-800">{{ goal.saved_amount }}</span>
                  </td>
                  <td class="p-4 w-1/4">
                    <div class="flex items-center space-x-2">
                      <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                        <div 
                          class="h-full rounded-full transition-all duration-500" 
                          :class="goal.status === 'achieved' ? 'bg-emerald-500' : 'bg-indigo-500'" 
                          :style="{ width: calculateProgress(goal.saved_amount, goal.target_amount) + '%' }"
                        ></div>
                      </div>
                      <span class="font-bold text-[10px] text-slate-500">{{ calculateProgress(goal.saved_amount, goal.target_amount) }}%</span>
                    </div>
                  </td>
                  <td class="p-4">
                    <span 
                      :class="goal.status === 'achieved' ? 'bg-emerald-50 text-emerald-700 border-emerald-100' : 'bg-amber-50 text-amber-700 border-amber-100'" 
                      class="px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase tracking-wide border"
                    >
                      {{ goal.status }}
                    </span>
                  </td>
                </tr>
                <tr v-if="filteredGoals.length === 0">
                  <td colspan="5" class="p-8 text-center text-slate-400 italic">No saving goals matching this criteria found.</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <!-- SUPPORT TICKETS TAB -->
      <div v-if="activeTab === 'tickets'" class="space-y-4">
        <div v-for="ticket in tickets" :key="ticket.id" class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4 hover:border-gray-200 transition">
          <div class="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-2">
            <div>
              <div class="text-[11px] font-semibold text-slate-400">
                👤 User Profile: <span class="text-slate-700 font-medium">{{ ticket.user?.name }}</span> ({{ ticket.user?.email }})
              </div>
            </div>
            <div class="flex items-center gap-2 flex-wrap sm:flex-nowrap">
              <span 
                v-if="ticket.type"
                :class="ticket.type.toLowerCase() === 'problem' ? 'bg-rose-50 text-rose-600 border-rose-100/70' : 'bg-sky-50 text-sky-600 border-sky-100/70'" 
                class="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase border tracking-wide flex items-center gap-1"
              >
                <span>{{ ticket.type.toLowerCase() === 'problem' ? '⚠️' : '💡' }}</span>
                {{ ticket.type }}
              </span>
              <span 
                :class="ticket.status.toLowerCase() === 'open' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'" 
                class="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase border tracking-wide"
              >
                {{ ticket.status }}
              </span>
            </div>
          </div>

          <p class="text-xs text-slate-600 bg-slate-50 p-3.5 rounded-xl border border-gray-200/60 leading-relaxed italic">
            "{{ ticket.message }}"
          </p>

          <div v-if="ticket.status.toLowerCase() === 'open'" class="pt-1 flex justify-end">
            <button 
              @click="openGlobalReplyWindow(ticket)"
              class="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm shadow-indigo-100 px-4 py-2 rounded-xl text-xs font-bold transition flex items-center space-x-1.5"
            >
              <span>💬 Reply & Resolve</span>
            </button>
          </div>
            
          <div v-if="ticket.status.toLowerCase() !== 'open'" class="text-[11px] bg-emerald-50/30 text-slate-500 p-3 rounded-xl border border-emerald-100/60 flex items-start gap-2">
            <span class="text-emerald-700 font-bold flex-shrink-0">✔️ Resolution Sent:</span>
            <span class="italic text-slate-600">"{{ ticket.admin_reply }}"</span>
          </div>
        </div>

        <div v-if="tickets.length === 0" class="bg-white rounded-2xl border border-gray-100 p-12 text-center text-xs text-slate-400 font-medium shadow-sm">
          Sare problems resolved hain! No pending tickets found.
        </div>
      </div>
    </div>

    <!-- LIVE USER ANALYTICS INSIGHT DRAWER -->
    <div v-if="selectedUserAnalytics" class="mt-8 bg-white rounded-2xl shadow-md border border-indigo-100 p-6 space-y-6 transition-all duration-300">
      <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-4 gap-3">
        <div>
          <span class="text-[9px] bg-indigo-600 text-white font-extrabold uppercase px-2 py-0.5 rounded tracking-wider">Live Diagnostic Profile</span>
          <h3 class="text-xl font-black text-slate-900 mt-0.5">Financial Snapshot: {{ selectedUserAnalytics.name }}</h3>
        </div>
        <button @click="selectedUserAnalytics = null" class="text-slate-400 hover:text-slate-600 text-xs font-bold bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition">
          ✕ Close Profile Insight
        </button>
      </div>

      <!-- Realtime Aggregated Financial Blocks -->
      <div class="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div class="p-4 rounded-xl bg-emerald-50/60 border border-emerald-100">
          <p class="text-[10px] font-bold text-emerald-600 uppercase tracking-wider">Total Income Generated</p>
          <p class="text-xl font-black text-emerald-800 mt-0.5">{{ targetUserStats.total_income || 0 }}</p>
        </div>
        <div class="p-4 rounded-xl bg-rose-50/60 border border-rose-100">
          <p class="text-[10px] font-bold text-rose-600 uppercase tracking-wider">Total Expenses Tracked</p>
          <p class="text-xl font-black text-rose-800 mt-0.5">{{ targetUserStats.total_expense || 0 }}</p>
        </div>
        <div class="p-4 rounded-xl bg-slate-50 border border-slate-200">
          <p class="text-[10px] font-bold text-slate-500 uppercase tracking-wider">Net Balance Reserve</p>
          <p class="text-xl font-black text-slate-800 mt-0.5">{{ targetUserStats.net_balance || 0 }}</p>
        </div>
      </div>

      <!-- GRAPH INTEGRATION GRID -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div class="border border-slate-100 rounded-2xl p-4 bg-slate-50/40 h-64 flex flex-col">
          <p class="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">📊 User Cashflow Trend</p>
          <div class="flex-1 min-h-0">
            <Bar :data="adminBarChartData" :options="chartOptions" />
          </div>
        </div>
        <div class="border border-slate-100 rounded-2xl p-4 bg-slate-50/40 h-64 flex flex-col">
          <p class="text-xs font-bold text-slate-500 mb-3 uppercase tracking-wider">🍕 Category Distribution Patterns</p>
          <div class="flex-1 min-h-0">
            <Doughnut :data="adminDoughnutChartData" :options="chartOptions" />
          </div>
        </div>
      </div>

      <!-- AUDIT LEDGER RECENT HISTORY -->
      <div>
        <p class="text-xs font-bold text-slate-700 mb-2.5 uppercase tracking-wider">📝 Recent Activity Audit Ledger</p>
        <div class="bg-white rounded-xl border border-slate-100 shadow-sm overflow-hidden text-xs">
          <div v-for="tx in targetUserStats.recent_transactions" :key="tx.id" class="flex justify-between items-center p-3 border-b border-slate-50 last:border-none hover:bg-slate-50/50">
            <div>
              <p class="font-bold text-slate-800">{{ tx.description || 'System Entry Description' }}</p>
              <span class="text-[10px] text-slate-400 font-medium">{{ tx.date }} • {{ tx.category?.name || 'General' }}</span>
            </div>
            <span :class="tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'" class="font-black text-sm">
              {{ tx.type === 'income' ? '+' : '-' }} {{ tx.currency || 'PKR' }} {{ tx.amount }}
            </span>
          </div>
          <div v-if="!targetUserStats.recent_transactions?.length" class="text-center p-6 text-slate-400 italic">
            Profile par koi current transaction records mapped nahi hain.
          </div>
        </div>
      </div>
    </div>

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
      // API endpoint fetching custom stats config payload
      const response = await api.get(`/admin/users/${userInstance.id}/analytics`);
      targetUserStats.value = response.data;
      selectedUserAnalytics.value = userInstance;
      Swal.close();
      
      // Auto-scroll target smooth movement
      setTimeout(() => {
        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
      }, 100);
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
      legend: { labels: { font: { size: 10, weight: '600' } } }
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

