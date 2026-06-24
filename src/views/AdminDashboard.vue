<template>
  <!-- Cleaned Layout Wrapper - Fits naturally inside your existing Master Layout -->
  <div class="w-full bg-gray-50/30 p-4 sm:p-6 font-sans antialiased">
    <div class="max-w-7xl mx-auto w-full flex flex-col space-y-6">
      
      <!-- SYSTEM CONTROL CENTER HEADER -->
      <div class="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b pb-4 border-gray-200/60">
        <div class="flex items-center space-x-3">
          <div v-if="appSettings.site_logo" class="h-9 w-auto flex items-center justify-center">
            <img :src="appSettings.site_logo" alt="Application Logo" class="h-8 w-auto object-contain" />
          </div>
          <div v-else class="bg-indigo-600 text-white p-2 rounded-xl shadow-md flex items-center justify-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
              <path stroke-linecap="round" stroke-linejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
            </svg>
          </div>
          <div>
            <h1 class="text-xl font-black text-slate-900 tracking-tight flex items-center gap-1.5">
              <span>{{ appSettings.site_name || 'SpendSence' }}</span> Control Center
            </h1>
            <p class="text-[11px] text-slate-400 mt-0.5">Manage metrics, global configurations, banners, and incoming support tickets.</p>
          </div>
        </div>
        <div class="text-[10px] font-bold bg-indigo-50/60 text-indigo-600 px-3 py-1.5 rounded-xl border border-indigo-100 self-start sm:self-auto uppercase tracking-wider">
          🔒 Spatie Protected
        </div>
      </div>

      <!-- MAIN METRIC COUNTERS -->
      <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div 
          @click="activeTab = 'users'"
          :class="activeTab === 'users' ? 'ring-2 ring-indigo-600 bg-indigo-50/10' : 'bg-white'"
          class="p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition duration-200"
        >
          <div>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Total Active Users</p>
            <h3 class="text-xl font-black text-slate-800 mt-1">{{ stats.total_users || 0 }}</h3>
          </div>
          <span class="p-2.5 bg-blue-50/60 text-blue-600 rounded-xl text-lg">👥</span>
        </div>

        <div 
          @click="activeTab = 'goals'"
          :class="activeTab === 'goals' ? 'ring-2 ring-indigo-600 bg-indigo-50/10' : 'bg-white'"
          class="p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition duration-200"
        >
          <div>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">System Saving Goals</p>
            <h3 class="text-xl font-black text-slate-800 mt-1">{{ stats.total_goals || 0 }}</h3>
          </div>
          <span class="p-2.5 bg-indigo-50/60 text-indigo-600 rounded-xl text-lg">🎯</span>
        </div>

        <div 
          @click="goToAchievedGoals()"
          :class="activeTab === 'goals' && goalFilter === 'achieved' ? 'ring-2 ring-emerald-600 bg-emerald-50/10' : 'bg-white'"
          class="p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition duration-200"
        >
          <div>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Goals Achieved</p>
            <h3 class="text-xl font-black text-emerald-600 mt-1">{{ stats.achieved_goals || 0 }}</h3>
          </div>
          <span class="p-2.5 bg-emerald-50/60 text-emerald-600 rounded-xl text-lg">✅</span>
        </div>

        <div 
          @click="activeTab = 'tickets'"
          :class="activeTab === 'tickets' ? 'ring-2 ring-rose-600 bg-rose-50/10' : 'bg-white'"
          class="p-4 rounded-xl border border-gray-100 shadow-sm flex items-center justify-between cursor-pointer hover:shadow-md transition duration-200"
        >
          <div>
            <p class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Open Complaints</p>
            <h3 class="text-xl font-black text-rose-600 mt-1">{{ stats.open_tickets || 0 }}</h3>
          </div>
          <span class="p-2.5 bg-rose-50/60 text-rose-600 rounded-xl text-lg" :class="{'animate-pulse': stats.open_tickets > 0}">⚠️</span>
        </div>
      </div>

      <!-- TABS NAVIGATION -->
      <div class="flex border-b border-gray-200 space-x-1 overflow-x-auto whitespace-nowrap scrollbar-none">
        <button 
          @click="activeTab = 'users'" 
          :class="activeTab === 'users' ? 'border-indigo-600 text-indigo-600 font-bold bg-indigo-50/30' : 'border-transparent text-slate-400 hover:text-slate-600'" 
          class="py-2 px-3 border-b-2 text-xs font-semibold rounded-t-xl transition focus:outline-none"
        >
          👤 User Accounts
        </button>

        <button 
          @click="activeTab = 'goals'" 
          :class="activeTab === 'goals' ? 'border-indigo-600 text-indigo-600 font-bold bg-indigo-50/30' : 'border-transparent text-slate-400 hover:text-slate-600'" 
          class="py-2 px-3 border-b-2 text-xs font-semibold rounded-t-xl transition focus:outline-none"
        >
          🎯 Saving Goals Directory
        </button>

        <button 
          @click="activeTab = 'tickets'" 
          :class="activeTab === 'tickets' ? 'border-indigo-600 text-indigo-600 font-bold bg-indigo-50/30' : 'border-transparent text-slate-400 hover:text-slate-600'" 
          class="py-2 px-3 border-b-2 text-xs font-semibold rounded-t-xl transition focus:outline-none flex items-center space-x-1.5"
        >
          <span>📩 Support Tickets</span>
          <span v-if="stats.open_tickets > 0" class="bg-rose-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">
            {{ stats.open_tickets }}
          </span>
        </button>

        <button 
          @click="activeTab = 'branding'" 
          :class="activeTab === 'branding' ? 'border-emerald-600 text-emerald-600 font-bold bg-emerald-50/30' : 'border-transparent text-slate-400 hover:text-slate-600'" 
          class="py-2 px-3 border-b-2 text-xs font-semibold rounded-t-xl transition focus:outline-none"
        >
          🎨 App Theme & Banner
        </button>
      </div>

      <!-- WORKSPACE AREA -->
      <div class="w-full">
        
        <div v-if="loading" class="text-center py-20 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div class="inline-block animate-spin rounded-full h-7 w-7 border-3 border-indigo-600 border-t-transparent mb-2"></div>
          <p class="text-xs text-slate-400">Syncing analytical middleware...</p>
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
                    <th class="p-4">Metrics</th>
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
                        class="px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase"
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
                        class="inline-flex items-center gap-1 bg-indigo-50 hover:bg-indigo-100 text-indigo-600 font-bold px-2.5 py-1.5 rounded-xl text-[11px] transition"
                      >
                        📊 Insights
                      </button>
                      <button 
                        v-if="!user.roles || user.roles[0]?.name.toLowerCase() !== 'admin'"
                        @click="impersonateUser(user)"
                        class="inline-flex items-center gap-1 bg-slate-100 hover:bg-slate-200 text-slate-600 font-bold px-2.5 py-1.5 rounded-xl text-[11px] transition"
                      >
                        👁️ Impersonate
                      </button>
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <!-- SAVING GOALS TAB -->
          <div v-if="activeTab === 'goals'" class="space-y-4">
            <div class="flex items-center space-x-2 bg-gray-100/80 p-1 rounded-xl w-fit text-[11px] font-bold">
              <button @click="goalFilter = 'all'" :class="goalFilter === 'all' ? 'bg-white shadow-sm text-slate-800' : 'text-slate-400'" class="px-3 py-1.5 rounded-lg transition">All</button>
              <button @click="goalFilter = 'active'" :class="goalFilter === 'active' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-400'" class="px-3 py-1.5 rounded-lg transition">Active</button>
              <button @click="goalFilter = 'achieved'" :class="goalFilter === 'achieved' ? 'bg-emerald-600 text-white shadow-sm' : 'text-slate-400'" class="px-3 py-1.5 rounded-lg transition">Achieved</button>
            </div>

            <div class="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
              <div class="overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="bg-gray-50/70 text-[11px] font-bold text-slate-400 uppercase border-b border-gray-100 tracking-wider">
                      <th class="p-4">Owner Profile</th>
                      <th class="p-4">Goal Title</th>
                      <th class="p-4">Target vs Current</th>
                      <th class="p-4">Progress</th>
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
                          class="px-2.5 py-0.5 rounded-lg text-[10px] font-bold uppercase border"
                        >
                          {{ goal.status }}
                        </span>
                      </td>
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
                    👤 User: <span class="text-slate-700 font-medium">{{ ticket.user?.name }}</span> ({{ ticket.user?.email }})
                  </div>
                </div>
                <div class="flex items-center gap-2">
                  <span 
                    v-if="ticket.type"
                    :class="ticket.type.toLowerCase() === 'problem' ? 'bg-rose-50 text-rose-600 border-rose-100/70' : 'bg-sky-50 text-sky-600 border-sky-100/70'" 
                    class="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase border tracking-wide"
                  >
                    {{ ticket.type }}
                  </span>
                  <span 
                    :class="ticket.status.toLowerCase() === 'open' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'" 
                    class="px-2 py-0.5 rounded-lg text-[10px] font-bold uppercase border"
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
                  class="bg-indigo-600 hover:bg-indigo-700 text-white shadow-md px-4 py-2 rounded-xl text-xs font-bold transition"
                >
                  💬 Reply & Resolve
                </button>
              </div>
                
              <div v-if="ticket.status.toLowerCase() !== 'open'" class="text-[11px] bg-emerald-50/30 text-slate-500 p-3 rounded-xl border border-emerald-100/60 flex items-start gap-2">
                <span class="text-emerald-700 font-bold flex-shrink-0">✔️ Resolution:</span>
                <span class="italic text-slate-600">"{{ ticket.admin_reply }}"</span>
              </div>
            </div>
          </div>

          <!-- BRANDING CONFIGURATION TAB -->
          <div v-if="activeTab === 'branding'" class="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
            <form @submit.prevent="updateBrandingSettings" class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm space-y-4 lg:col-span-5">
              <h3 class="text-sm font-black text-slate-800 uppercase tracking-wider border-b pb-2">Modify Identity Assets</h3>
              
              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Site Title</label>
                <input v-model="appSettings.site_name" type="text" class="w-full text-xs font-semibold px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-emerald-600 transition" />
              </div>

              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Site About</label>
                <textarea v-model="appSettings.site_about" rows="2" class="w-full text-xs font-medium p-3 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-emerald-600 transition"></textarea>
              </div>

              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Logo URL</label>
                <input v-model="appSettings.site_logo" type="text" class="w-full text-xs font-mono px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-emerald-600 transition" />
              </div>

              <div>
                <label class="block text-[10px] font-bold text-slate-500 uppercase mb-1">Banner URL</label>
                <input v-model="appSettings.site_banner" type="text" class="w-full text-xs font-mono px-3 py-2 bg-gray-50 border border-gray-200 rounded-xl outline-none focus:bg-white focus:border-emerald-600 transition" />
              </div>

              <button type="submit" :disabled="savingMeta" class="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-xs shadow-md transition">
                💾 Save Branding Setup
              </button>
            </form>

            <div class="lg:col-span-7 bg-[#072440] p-6 rounded-2xl border border-slate-800 flex flex-col justify-between relative overflow-hidden min-h-[320px]">
              <div class="absolute inset-0 w-full h-full flex items-center justify-center p-4">
                <img v-if="appSettings.site_banner" :src="appSettings.site_banner" alt="Live Preview Banner" class="w-full h-auto max-h-[90%] object-contain opacity-65" />
                <div v-else class="text-[11px] font-bold text-slate-500 tracking-wider uppercase bg-slate-900/40 px-4 py-2 rounded-xl border border-slate-800">No Banner Asset URL</div>
              </div>
              <div class="absolute inset-0 bg-gradient-to-t from-[#030f1c] via-[#072440]/20 to-[#072440]/10 z-10"></div>
              
              <div class="relative z-20 flex justify-between items-center bg-black/30 backdrop-blur-sm p-2 rounded-xl border border-white/5">
                <span class="text-[9px] bg-emerald-500 font-extrabold px-2 py-0.5 rounded text-white uppercase">Live Brand Mockup</span>
                <img v-if="appSettings.site_logo" :src="appSettings.site_logo" class="h-4 w-auto object-contain" />
              </div>

              <div class="relative z-20 pt-20">
                <h4 class="text-white text-2xl font-black tracking-tight">{{ appSettings.site_name || 'SpendSence' }}</h4>
                <p class="text-slate-300 text-[11px] mt-1.5 max-w-sm font-medium">{{ appSettings.site_about || 'Smart expense tracking & category budgeting.' }}</p>
              </div>
            </div>
          </div>

        </div>
      </div>

      <!-- USER ANALYTICS INSIGHT DRAWER -->
      <div v-if="selectedUserAnalytics" class="bg-white rounded-2xl shadow-md border border-indigo-100 p-5 space-y-5 transition-all duration-300">
        <div class="flex flex-col sm:flex-row items-start sm:items-center justify-between border-b border-slate-100 pb-3 gap-3">
          <div>
            <span class="text-[9px] bg-indigo-600 text-white font-extrabold uppercase px-2 py-0.5 rounded">Diagnostic View</span>
            <h3 class="text-lg font-black text-slate-900 mt-0.5">Snapshot: {{ selectedUserAnalytics.name }}</h3>
          </div>
          <button @click="selectedUserAnalytics = null" class="text-slate-400 hover:text-slate-600 text-xs font-bold bg-slate-100 hover:bg-slate-200 px-3 py-1.5 rounded-xl transition">
            ✕ Close
          </button>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <div class="p-3 rounded-xl bg-emerald-50/60 border border-emerald-100">
            <p class="text-[9px] font-bold text-emerald-600 uppercase tracking-wider">Total Income</p>
            <p class="text-lg font-black text-emerald-800 mt-0.5">{{ targetUserStats.total_income || 0 }}</p>
          </div>
          <div class="p-3 rounded-xl bg-rose-50/60 border border-rose-100">
            <p class="text-[9px] font-bold text-rose-600 uppercase tracking-wider">Total Expenses</p>
            <p class="text-lg font-black text-rose-800 mt-0.5">{{ targetUserStats.total_expense || 0 }}</p>
          </div>
          <div class="p-3 rounded-xl bg-slate-50 border border-slate-200">
            <p class="text-[9px] font-bold text-slate-500 uppercase tracking-wider">Net Reserve</p>
            <p class="text-lg font-black text-slate-800 mt-0.5">{{ targetUserStats.net_balance || 0 }}</p>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div class="border border-slate-100 rounded-xl p-3 bg-slate-50/40 h-44">
            <Bar :data="adminBarChartData" :options="chartOptions" />
          </div>
          <div class="border border-slate-100 rounded-xl p-3 bg-slate-50/40 h-44">
            <Doughnut :data="adminDoughnutChartData" :options="chartOptions" />
          </div>
        </div>

        <!-- 📝 RECENT ACTIVITY AUDIT LEDGER SECTION -->
        <div class="border border-slate-100 rounded-xl overflow-hidden bg-white shadow-sm mt-2">
          <div class="bg-slate-50 px-4 py-3 border-b border-slate-100 flex items-center justify-between">
            <h4 class="text-xs font-bold text-slate-700 uppercase tracking-wider flex items-center gap-1.5">
              <span>📝</span> Recent Activity Audit Ledger
            </h4>
            <span class="text-[10px] font-bold bg-slate-200/70 text-slate-600 px-2 py-0.5 rounded-lg font-mono">
              {{ targetUserStats.recent_transactions?.length || 0 }} Logged Entries
            </span>
          </div>
          <div class="overflow-x-auto">
            <table class="w-full text-left border-collapse">
              <thead>
                <tr class="bg-slate-50/40 text-[10px] font-bold text-slate-400 uppercase border-b border-slate-100 tracking-wider">
                  <th class="p-3">Reference ID</th>
                  <th class="p-3">Category Type</th>
                  <th class="p-3">Description Context</th>
                  <th class="p-3">Amount Weight</th>
                  <th class="p-3">Timestamp</th>
                </tr>
              </thead>
              <tbody class="divide-y divide-slate-50 text-[11px] text-slate-600">
                <tr v-for="tx in targetUserStats.recent_transactions" :key="tx.id" class="hover:bg-slate-50/40 transition">
                  <td class="p-3 font-mono text-slate-400">{{ tx.id }}</td>
                  <td class="p-3">
                    <span 
                      :class="tx.type === 'income' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'" 
                      class="px-2 py-0.5 rounded-md font-bold uppercase text-[9px]"
                    >
                      {{ tx.category?.name || 'General' }}
                    </span>
                  </td>
                  <td class="p-3 font-medium text-slate-700">{{ tx.description || 'N/A' }}</td>
                  <td class="p-3 font-mono font-bold" :class="tx.type === 'income' ? 'text-emerald-600' : 'text-rose-600'">
                    {{ tx.type === 'income' ? '+' : '-' }}{{ tx.amount }}
                  </td>
                  <td class="p-3 text-slate-400 whitespace-nowrap">{{ new Date(tx.created_at).toLocaleString() }}</td>
                </tr>
                <tr v-if="!targetUserStats.recent_transactions || targetUserStats.recent_transactions.length === 0">
                  <td colspan="5" class="p-6 text-center text-slate-400 italic">Is profile account par koi activity logs record nahi mile.</td>
                </tr>
              </tbody>
            </table>
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
  const savingMeta = ref(false);
  const stats = ref({});
  const users = ref([]);
  const tickets = ref([]);
  const goals = ref([]); 

  // Global Dynamic Branding Mapping Ref Form Architecture
  const appSettings = ref({ site_name: '', site_about: '', site_logo: '', site_banner: '' });

  const targetUserStats = ref({
    total_income: 0,
    total_expense: 0,
    net_balance: 0,
    recent_transactions: [],
    monthly_cashflow: { labels: [], income: [], expense: [] },
    category_breakdown: { labels: [], data: [] }
  });
  const selectedUserAnalytics = ref(null);

  const fetchGlobalApplicationMeta = async () => {
    try {
      const res = await api.get('/global-settings');
      appSettings.value = res.data || { site_name: '', site_about: '', site_logo: '', site_banner: '' };
    } catch (err) {
      console.error("Failed fetching settings inside system panel routing module:", err);
    }
  };

  const updateBrandingSettings = async () => {
    savingMeta.value = true;
    try {
      await api.post('/admin/global-settings', appSettings.value);
      Swal.fire({
        title: 'Assets Synced!',
        text: 'Global UI layout metadata updated successfully.',
        icon: 'success',
        confirmButtonColor: '#059669',
        customClass: { popup: 'rounded-2xl' }
      });
    } catch (err) {
      console.error("Failed persisting layout options modifications configuration:", err);
      Swal.fire('Sync Interrupted', 'Database metadata structure not adjusted.', 'error');
    } finally {
      savingMeta.value = false;
    }
  };

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
        Swal.fire({ title: 'Updating ticket...', allowOutsideClick: false, didOpen: () => { Swal.showLoading(); } });
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

  const goToAchievedGoals = () => { activeTab.value = 'goals'; goalFilter.value = 'achieved'; };
  const calculateProgress = (current, target) => { if (!target || target <= 0) return 0; return Math.min(Math.round((current / target) * 100), 100); };

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
    } finally { loading.value = false; }
  };

  onMounted(() => { 
    fetchGlobalApplicationMeta();
    loadDashboardData(); 
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
      Swal.fire({ title: 'Generating Temporary Session Key...', allowOutsideClick: false, didOpen: () => { Swal.showLoading(); } });

      const response = await api.post(`/admin/users/${userInstance.id}/impersonate`);
      const data = response.data;
      Swal.close();
      
      const targetRoute = `${window.location.origin}${data.redirect_url}?impersonate_token=${encodeURIComponent(data.token)}`;
      window.open(targetRoute, '_blank');
    } catch (error) {
      console.error("Impersonation Error:", error);
    }
  };
</script>