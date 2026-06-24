<template>
  <div class="min-h-screen bg-slate-50/50 flex flex-col antialiased font-sans transition-colors duration-200">
    <div class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 space-y-6 md:space-y-8 w-full">
      
      <!-- TOP DASHBOARD MASTER HEADER -->
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-gray-200/60 pb-5">
        <div>
          <h1 class="text-xl md:text-2xl font-black text-slate-900 text-center lg:text-left tracking-tight">
            Welcome back, {{ userName }}!
          </h1>
          <p class="text-xs text-slate-400 mt-0.5 text-center lg:text-left">
            Monitor micro-ledger items, log automatic receipts, and analyze metric analytics.
          </p>
        </div>
        
        <!-- DASHBOARD FILTER CONTROLS BAR -->
        <div class="bg-white p-3 rounded-2xl border border-gray-100 shadow-xs flex flex-col sm:flex-row items-center justify-center gap-3 w-full lg:w-auto">
          <!-- Currency Swapper Selection -->
          <div class="flex items-center space-x-2 w-full sm:w-auto justify-center bg-slate-50 px-2.5 py-1.5 rounded-xl border border-gray-100">
            <span class="text-[10px] font-black text-slate-400 uppercase tracking-wider whitespace-nowrap">View In:</span>
            <select 
              v-model="selectedDashboardCurrency" 
              @change="handleCurrencyChange"
              class="bg-transparent text-xs font-bold text-indigo-600 focus:outline-none cursor-pointer"
            >
              <option value="PKR">PKR (Rs.)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="AED">AED (د.إ)</option>
            </select>
          </div>

          <!-- Date Interval Matrix Inputs -->
          <div class="flex items-center space-x-1.5 w-full sm:w-auto justify-center">
            <input type="date" v-model="filter.start_date" class="w-full sm:w-auto px-2.5 py-1.5 border border-gray-200 rounded-xl text-xs font-semibold text-slate-600 focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 focus:outline-none transition" />
            <span class="text-slate-400 text-xs font-medium">to</span>
            <input type="date" v-model="filter.end_date" class="w-full sm:w-auto px-2.5 py-1.5 border border-gray-200 rounded-xl text-xs font-semibold text-slate-600 focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-600 focus:outline-none transition" />
          </div>

          <!-- Statement Export Triggers -->
          <div class="flex items-center space-x-2 w-full sm:w-auto justify-center border-t sm:border-t-0 pt-2 sm:pt-0 border-slate-100">
            <button @click="downloadReport('pdf')" :disabled="exportLoading" class="flex-1 sm:flex-none text-center bg-rose-50 hover:bg-rose-100 text-rose-600 px-3 py-1.5 rounded-xl text-xs font-bold transition disabled:opacity-50">
              {{ exportLoading ? '⏳ Wait...' : '📄 PDF Report' }}
            </button>
            <button @click="downloadReport('excel')" :disabled="exportLoading" class="flex-1 sm:flex-none text-center bg-emerald-50 hover:bg-emerald-100 text-emerald-600 px-3 py-1.5 rounded-xl text-xs font-bold transition disabled:opacity-50">
              {{ exportLoading ? '⏳ Wait...' : '📊 Excel Sheet' }}
            </button>
          </div>
        </div>
      </div>

      <!-- TEMPORAL NAVIGATION MATRIX -->
      <div class="flex items-center gap-2">
        <select 
          v-model="selectedMonth" 
          class="bg-white border border-gray-100 text-slate-700 text-xs rounded-xl px-3 py-1.5 font-bold focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-500 shadow-xs outline-none cursor-pointer"
        >
          <option v-for="m in monthsList" :key="m.value" :value="m.value">
            {{ m.label }}
          </option>
        </select>
        <select 
          v-model="selectedYear" 
          class="bg-white border border-gray-100 text-slate-700 text-xs rounded-xl px-3 py-1.5 font-bold focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-500 shadow-xs outline-none cursor-pointer"
        >
          <option v-for="y in yearsList" :key="y" :value="y">
            {{ y }}
          </option>
        </select>
      </div>

      <!-- MAIN LOADER STATE FRAME -->
      <div v-if="loading" class="text-center py-20 text-sm font-bold text-slate-400">
        <div class="animate-pulse space-y-3 flex flex-col items-center">
          <span class="text-2xl animate-spin block w-fit">🔄</span>
          <span>Syncing Global Rates & Core Math Engine Assets...</span>
        </div>
      </div>

      <!-- CONTENT HYDRATED GRID HOOKS -->
      <div v-else class="space-y-6 md:space-y-8">
        
        <!-- COUNTER METRICS STATISTICS ROW -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <!-- INCOME BLOCK -->
          <div class="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between hover:shadow-md transition duration-300">
            <div>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Income</p>
              <h3 class="text-xl md:text-2xl font-black text-emerald-600 tracking-tight mt-1">
                {{ getCurrencySymbol(selectedDashboardCurrency) }} {{ Number(stats.summary?.total_income || 0).toFixed(2) }}
              </h3>
            </div>
            <div class="w-11 h-11 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center font-bold text-lg">💵</div>
          </div>

          <!-- EXPENSE BLOCK -->
          <div class="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between hover:shadow-md transition duration-300">
            <div>
              <p class="text-[10px] font-black text-slate-400 uppercase tracking-wider">Total Expense</p>
              <h3 class="text-xl md:text-2xl font-black text-rose-600 tracking-tight mt-1">
                {{ getCurrencySymbol(selectedDashboardCurrency) }} {{ Number(stats.summary?.total_expense || 0).toFixed(2) }}
              </h3>
            </div>
            <div class="w-11 h-11 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center font-bold text-lg">📉</div>
          </div>

          <!-- BALANCED NET BLOCK -->
          <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex items-center justify-between relative overflow-hidden group hover:shadow-md transition duration-300 sm:col-span-2 lg:col-span-1">
            <div class="space-y-1 z-10">
              <span class="text-[10px] font-black text-slate-400 uppercase tracking-wider block">Net Balance Ledger</span>
              <!-- FIXED: Fixed currency binding hook alignment issue -->
              <h3 class="text-xl md:text-2xl font-black text-indigo-600 tracking-tight">
                {{ getCurrencySymbol(selectedDashboardCurrency) }} {{ stats.summary?.net_balance || '0.00' }}
              </h3>
              
              <!-- AI INSIGHT BADGE LINK -->
              <div v-if="aiInsights?.insight_text" class="flex items-center gap-1.5 mt-2 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg text-[10px] font-bold w-fit border border-emerald-100/50">
                <span>✨ {{ aiInsights.insight_text }}</span>
              </div>
            </div>
            <div class="p-3 bg-indigo-50/60 text-indigo-600 rounded-xl transition group-hover:bg-indigo-600 group-hover:text-white shadow-3xs">
              <span class="text-lg block leading-none">🏛️</span>
            </div>
          </div>
        </div>

        <!-- UPCOMING BILLS ALERT STRIP (TEMPORAL) -->
        <div v-if="upcoming_bills && upcoming_bills.length > 0" class="bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
          <div class="flex items-center space-x-2 border-b border-slate-50 pb-3 mb-3">
            <span class="text-sm">📅</span>
            <h3 class="text-xs font-black text-slate-800 uppercase tracking-wider">Upcoming Bills Pipeline (Next 7 Days)</h3>
          </div>

          <div class="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div v-for="bill in upcoming_bills" :key="bill.id" class="flex items-center justify-between p-3 bg-slate-50/70 rounded-xl border border-gray-100/50">
              <div class="flex items-center space-x-3">
                <span class="text-lg w-9 h-9 rounded-lg bg-white shadow-3xs flex items-center justify-center border border-slate-100">{{ bill.category_icon || '💼' }}</span>
                <div>
                  <h4 class="text-xs font-bold text-slate-800">{{ bill.name }}</h4>
                  <p class="text-[10px] text-rose-500 font-bold" v-if="bill.days_left === 0">🚨 Due Today!</p>
                  <p class="text-[10px] text-rose-600 font-bold" v-else-if="bill.days_left < 0">⚠️ Overdue by {{ Math.abs(bill.days_left) }} days</p>
                  <p class="text-[10px] text-amber-600 font-semibold" v-else>⏳ Due in {{ bill.days_left }} days ({{ bill.due_date }})</p>
                </div>
              </div>
              
              <div class="text-right flex flex-col items-end gap-0.5">
                <span class="text-xs font-black text-slate-800">{{ bill.amount }} {{ bill.currency }}</span>
                <button @click="markAsPaid(bill.id)" class="text-[10px] text-indigo-600 hover:text-indigo-800 hover:underline font-bold">Mark Paid</button>
              </div>
            </div>
          </div>
        </div>

        <!-- SAVINGS & STRATEGIC ALLOCATION TARGET INTERFACE -->
        <div class="bg-white rounded-2xl p-5 md:p-6 border border-gray-100 shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 transition duration-300 hover:shadow-md">
          <div class="space-y-1.5">
            <span class="text-[10px] font-black text-indigo-600 uppercase tracking-widest block">Savings & Financial Goals</span>
            <h2 class="text-base md:text-lg font-black text-slate-900 tracking-tight flex items-center gap-2">
              Capitalize Goals Milestone Configuration 
              <span class="text-[9px] bg-indigo-50 text-indigo-600 border border-indigo-100 font-black px-2 py-0.5 rounded-full uppercase tracking-wider">AI Automated</span>
            </h2>
            <p class="text-xs text-slate-500 max-w-xl font-medium leading-relaxed">
              {{ aiInsights?.goal_forecast || 'No structural forecast metrics calculated for this month loop.' }}
            </p>
            
            <router-link to="/goals" class="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 mt-2 group transition">
              <span>Manage Allocation Vaults</span> 
              <span class="transform transition group-hover:translate-x-1">➡️</span>
            </router-link>
          </div>

          <div class="flex items-center gap-3 self-start md:self-center flex-shrink-0">
            <button 
              v-if="aiInsights?.recommended_transfer_amount > 0"
              type="button"
              @click="triggerAiGoalSuggestion" 
              class="px-4 py-2.5 bg-slate-950 hover:bg-black text-white text-xs font-bold rounded-xl shadow-sm transition active:scale-95 flex items-center gap-1.5"
            >
              🤖 Smart Sync Allocation
            </button>
            <div v-else class="px-3 py-2 bg-emerald-50 text-emerald-700 border border-emerald-100 text-xs font-black rounded-xl flex items-center gap-1">
              ✅ Goals Fully Guarded
            </div>

            <div class="p-3.5 bg-indigo-600 text-white rounded-xl shadow-md shadow-indigo-600/20">
              <span class="text-xl block leading-none">🎯</span>
            </div>
          </div>
        </div>

        <!-- PLOTTED ANALYTICS SYSTEM MAPS -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <!-- BAR GRAPH CHART PORTAL -->
          <div class="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-xs lg:col-span-2 space-y-4">
            <div class="flex justify-between items-center border-b border-slate-50 pb-3">
              <h3 class="text-xs font-black text-slate-800 uppercase tracking-wider">Monthly Cashflow Vectors</h3>
              <span class="text-[10px] font-black text-indigo-600 uppercase bg-indigo-50 px-2 py-0.5 rounded-md">Scale: {{ selectedDashboardCurrency }}</span>
            </div>
            <div class="h-64 md:h-72 relative">
              <Bar :data="barChartData" :options="barChartOptions" />
            </div>
          </div>

          <!-- DOUGHNUT GRAPH DEVIATION MATRIX -->
          <div class="bg-white p-5 md:p-6 rounded-2xl border border-gray-100 shadow-xs space-y-4">
            <div class="flex justify-between items-center border-b border-slate-50 pb-3">
              <h3 class="text-xs font-black text-slate-800 uppercase tracking-wider">Expense Structural Weight</h3>
              <span class="text-[9px] font-bold text-slate-400 uppercase tracking-wider">By Category</span>
            </div>
            <div class="h-64 md:h-72 relative flex items-center justify-center">
              <Doughnut v-if="hasCategoryBreakdownData" :data="doughnutChartData" :options="doughnutChartOptions" />
              <div v-else class="text-xs font-medium text-slate-400 text-center py-20 flex flex-col items-center gap-2">
                <span>⚠️</span>
                <span>No categorical metadata entries detected.</span>
              </div>
            </div>
          </div>
        </div>

        <!-- TRANSACTION JOURNAL GRID CONTENT STRUCTURE -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 items-start">
          
          <!-- LEFT SIDE: RECENT DATA ENTRY LIST -->
          <div class="lg:col-span-2 bg-white rounded-2xl shadow-xs border border-gray-100 p-4 md:p-6 flex flex-col justify-between overflow-hidden">
            <div>
              <h2 class="text-sm font-black text-slate-800 uppercase tracking-wider mb-4 text-center sm:text-left">Recent Transaction Registry</h2>
              
              <!-- DESKTOP SCREEN INTERFACE TABLE -->
              <div class="hidden sm:block overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="border-b border-slate-100 text-slate-400 text-xs uppercase font-bold tracking-wide">
                      <th class="py-3 pr-2">Description</th>
                      <th class="py-3 px-2">Category</th>
                      <th class="py-3 px-2">Log Date</th>
                      <th class="py-3 px-2 text-right">Magnitude</th>
                      <th class="py-3 pl-2 text-center">Operations</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-slate-50 text-xs font-medium">
                    <tr v-for="tx in displayedTransactions" :key="tx.id" class="text-slate-700 hover:bg-slate-50/60 transition">
                      <td class="py-3.5 pr-2 font-semibold text-slate-900 truncate max-w-[140px]">{{ tx.description || 'No custom memo' }}</td>
                      <td class="py-3.5 px-2">
                        <span class="inline-block px-2.5 py-0.5 rounded-full text-[11px] font-bold whitespace-nowrap" :class="tx.category?.type === 'income' ? 'bg-emerald-50 text-emerald-700 border border-emerald-100/40' : 'bg-rose-50 text-rose-700 border border-rose-100/40'">
                          {{ tx.category?.icon || '📁' }} {{ tx.category?.name }}
                        </span>
                      </td>
                      <td class="py-3.5 px-2 text-slate-400 font-mono">{{ tx.date }}</td>
                      
                      <td class="py-3.5 px-2 text-right font-bold whitespace-nowrap" :class="tx.category?.type === 'income' ? 'text-emerald-600' : 'text-rose-600'">
                        {{ tx.category?.type === 'income' ? '+' : '-' }}
                        <span>
                          {{ getCurrencySymbol(selectedDashboardCurrency) }} {{ tx.converted_amount ?? tx.amount }}
                        </span>
                        <span v-if="tx.currency !== selectedDashboardCurrency" class="block text-[10px] text-slate-400 font-normal tracking-tight mt-0.5">
                          Orig: {{ tx.amount }} {{ tx.currency }}
                        </span>
                      </td>
                      
                      <td class="py-3.5 pl-2 text-center">
                        <div class="flex justify-center space-x-1">
                          <button @click="openEditModal(tx)" class="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-xl transition">✏️</button>
                          <button @click="handleDeleteTransaction(tx.id)" class="p-1.5 text-rose-600 hover:bg-rose-50 rounded-xl transition">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <!-- MOBILE CARDS RENDER SYSTEM -->
              <div class="block sm:hidden space-y-3">
                <div v-for="tx in displayedTransactions" :key="tx.id" class="bg-slate-50/60 p-4 rounded-xl border border-gray-100 space-y-2">
                  <div class="flex justify-between items-start">
                    <div>
                      <h4 class="font-bold text-slate-900 text-xs">{{ tx.description || 'No custom memo' }}</h4>
                      <p class="text-[10px] font-mono text-slate-400 mt-0.5">🗓️ {{ tx.date }}</p>
                    </div>
                    <span class="px-2.5 py-0.5 rounded-full text-[10px] font-bold" :class="tx.category?.type === 'income' ? 'bg-emerald-50 text-emerald-700' : 'bg-rose-50 text-rose-700'">
                      {{ tx.category?.icon || '📁' }} {{ tx.category?.name }}
                    </span>
                  </div>
                  <div class="flex justify-between items-center pt-2 border-t border-slate-200/50">
                    <span class="text-xs font-black flex flex-col" :class="tx.category?.type === 'income' ? 'text-emerald-600' : 'text-rose-600'">
                      <span>
                        {{ tx.category?.type === 'income' ? '+' : '-' }}
                        {{ getCurrencySymbol(selectedDashboardCurrency) }} {{ tx.converted_amount ?? tx.amount }}
                      </span>
                      <span v-if="tx.currency !== selectedDashboardCurrency" class="text-[10px] font-normal text-slate-400">
                        Orig: {{ tx.amount }} {{ tx.currency }}
                      </span>
                    </span>
                    <div class="flex space-x-1.5">
                      <button @click="openEditModal(tx)" class="bg-white px-2 py-1 border border-gray-200 rounded-lg text-[11px] font-bold shadow-2xs">✏️ Edit</button>
                      <button @click="handleDeleteTransaction(tx.id)" class="bg-rose-50 text-rose-600 px-2 py-1 rounded-lg text-[11px] font-bold">🗑️</button>
                    </div>
                  </div>
                </div>
              </div>

              <!-- EMPTY TRANS STATE WRAPPER -->
              <div v-if="!displayedTransactions || displayedTransactions.length === 0" class="py-12 text-center font-medium text-slate-400 text-xs">
                ⚠️ Is select timeline context me koi transaction logs available nahi hain.
              </div>
            </div>
            
            <div class="mt-4 pt-4 border-t border-slate-100 flex justify-center">
              <router-link to="/transactions" class="w-full text-center inline-flex items-center justify-center space-x-2 text-xs font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50/40 px-5 py-2.5 rounded-xl transition">
                <span>View Full Core Ledger Logs</span> <span>➡️</span>
              </router-link>
            </div>
          </div>

          <!-- RIGHT SIDE: INTERACTIVE TRANSACTION INPUT MANAGER -->
          <div class="space-y-6">
            <div class="bg-white rounded-2xl border border-gray-100 shadow-xs p-5 md:p-6 space-y-4">
              <h2 class="text-sm font-black text-slate-800 uppercase tracking-wider">Add Asset/Expense Entry</h2>
              <form @submit.prevent="handleSubmitTransaction" class="space-y-4" novalidate>
                <div>
                  <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">Amount & Currency System <span class="text-rose-500 font-bold">*</span></label>
                  <div class="mt-1 flex rounded-xl shadow-xs">
                    <input v-model="form.amount" type="number" placeholder="e.g. 1500" class="block w-full px-3.5 py-2.5 border border-gray-200 rounded-l-xl text-xs font-semibold text-slate-700 bg-slate-50/40 focus:bg-white focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-500 focus:outline-none transition" />
                    <select v-model="form.currency" class="px-3 border-t border-b border-r border-gray-200 bg-slate-50 rounded-r-xl text-xs font-black text-slate-600 focus:outline-none cursor-pointer">
                      <option value="PKR">PKR</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="AED">AED</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">Target Category Map <span class="text-rose-500 font-bold">*</span></label>
                  <select v-model="form.category_id" class="mt-1 block w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-slate-50/40 focus:bg-white text-xs font-semibold text-slate-700 transition focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-500 cursor-pointer">
                    <option value="" disabled>Select a target category</option>
                    <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                      {{ cat.icon || '📁' }} {{ cat.name }} ({{ cat.type }})
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">Description / Note Memo</label>
                  <input v-model="form.description" type="text" placeholder="e.g. Server renewal or utilities" class="mt-1 block w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-500 transition" />
                </div>

                <div>
                  <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">Calendar Date Log <span class="text-rose-500 font-bold">*</span></label>
                  <input v-model="form.date" type="date" class="mt-1 block w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-semibold text-slate-700 bg-slate-50/40 focus:bg-white focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-500 transition cursor-pointer" />
                </div>

                <!-- COGNITIVE SCANNING SUITE PIPELINE -->
                <div class="p-4 border border-dashed border-slate-200 bg-slate-50/50 rounded-2xl text-center space-y-4">
                  <div class="flex flex-col items-center justify-center">
                    <div @click="openLiveCamera" type="button" class="w-11 h-11 bg-indigo-50 text-indigo-600 rounded-full flex items-center justify-center text-lg shadow-3xs cursor-pointer hover:bg-indigo-100 transition">
                      📷
                    </div>
                    <span class="mt-1.5 text-[9px] uppercase tracking-wider bg-indigo-600 text-white font-black px-2 py-0.5 rounded-full scale-90 animate-pulse">
                      AI Optical Core
                    </span>
                    <h4 class="text-xs font-black text-slate-800 mt-2">Instant AI Scanner Terminal</h4>
                    <p class="text-[11px] text-slate-400 max-w-xs mt-0.5">Snap structural merchant invoices to auto extract metadata</p>
                  </div>

                  <div class="flex items-center justify-center">
                    <input 
                      type="file" 
                      ref="receiptInput" 
                      @change="handleReceiptScan" 
                      accept="image/*" 
                      class="hidden" 
                      id="receipt-direct-upload"
                    />
                    <label 
                      for="receipt-direct-upload" 
                      class="cursor-pointer bg-white border border-gray-200 hover:bg-slate-50 text-slate-700 font-bold px-3 py-2 rounded-xl text-xs transition shadow-3xs"
                    >
                      📁 Browse Receipt Asset File
                    </label>
                  </div>

                  <!-- AUDIO CORE STREAM DIVISION -->
                  <div class="relative flex py-1 items-center justify-center">
                    <div class="flex-grow border-t border-slate-200/50"></div>
                    <span class="flex-shrink mx-3 text-[9px] text-slate-400 font-black uppercase tracking-wider">Or Stream Audio Command</span>
                    <div class="flex-grow border-t border-slate-200/50"></div>
                  </div>

                  <div class="flex flex-col items-center justify-center">
                    <button 
                      @click="toggleVoiceListening" 
                      type="button"
                      :class="isListening ? 'bg-rose-600 hover:bg-rose-700 ring-4 ring-rose-100 animate-pulse' : 'bg-emerald-600 hover:bg-emerald-700 shadow-xs'"
                      class="text-white flex items-center gap-1.5 font-bold px-4 py-2 rounded-xl text-[11px] transition dynamic-active"
                    >
                      🎤 {{ isListening ? 'Processing Pipeline...' : 'Stream Ledger Audio' }}
                    </button>
                    
                    <p v-if="voiceTranscript" class="text-[10px] text-indigo-600 font-semibold italic mt-2 bg-white p-2 rounded-xl border border-indigo-50 w-full text-center shadow-3xs">
                      "{{ voiceTranscript }}"
                    </p>
                  </div>
                </div>

                <p v-if="addFormError" class="text-rose-600 text-xs font-bold bg-rose-50 p-2.5 rounded-xl border border-rose-100 transition animate-fade-in">
                  ⚠️ {{ addFormError }}
                </p>

                <button type="submit" :disabled="formLoading" class="w-full py-2.5 px-4 rounded-xl text-xs font-black text-white bg-indigo-600 hover:bg-indigo-700 transition shadow-sm disabled:opacity-50 active:scale-98">
                  {{ formLoading ? 'Syncing...' : 'Save Manual Record Asset' }}
                </button>
              </form>
            </div>

            <!-- LOWER BAR PROGRESSIVE BUDGET MONITOR -->
            <div v-if="budgetAlerts && budgetAlerts.length > 0" class="bg-white rounded-2xl border border-gray-100 p-5 md:p-6 space-y-4 shadow-xs">
              <h3 class="text-xs font-black text-slate-400 uppercase tracking-wider">Dynamic Budget Pipelines</h3>
              <div class="space-y-3.5">
                <div v-for="b in budgetAlerts" :key="b.category_id" class="space-y-1">
                  <div class="flex justify-between text-xs font-bold">
                    <span class="text-slate-700">{{ b.category_icon || '📁' }} {{ b.category_name }}</span>
                    <span class="text-slate-400 font-mono">Rs. {{ b.total_spent }} / {{ b.budget_limit }}</span>
                  </div>
                  <div class="w-full bg-slate-100 h-2 rounded-full overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-500" :class="b.percentage >= 100 ? 'bg-rose-500' : b.percentage >= 80 ? 'bg-amber-500' : 'bg-indigo-600'" :style="{ width: Math.min(b.percentage, 100) + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- FRAME MODAL: LIVE VIDEO STREAM CAPTURE LAYER -->
    <div v-if="showCameraModal" class="fixed inset-0 bg-slate-950/80 backdrop-blur-xs flex flex-col items-center justify-center z-50 p-4 animate-fade-in">
      <div class="bg-white rounded-2xl p-5 max-w-sm w-full flex flex-col items-center shadow-2xl border border-slate-100">
        <div class="w-full flex justify-between items-center mb-3">
          <h3 class="text-xs font-black text-slate-800 uppercase tracking-wide">Optical Capture Lens</h3>
          <span class="text-[9px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">Lens Active</span>
        </div>
        
        <video ref="videoStream" autoplay playsinline class="w-full bg-slate-900 rounded-xl mb-4 h-56 object-cover shadow-inner border border-slate-800"></video>
        
        <div class="flex gap-2 w-full">
          <button @click="closeLiveCamera" type="button" class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition">Cancel</button>
          <button @click="capturePhotoFromStream" type="button" class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs transition shadow-sm">📸 Capture Frame</button>
        </div>
      </div>
    </div>

    <!-- FRAME MODAL: RECENT EDIT TRANSACTION LOG OVERLAY -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 bg-slate-950/60 flex items-center justify-center p-4 backdrop-blur-xs">
      <div class="bg-white rounded-2xl max-w-sm w-full p-5 md:p-6 shadow-2xl border border-gray-100 space-y-4 animate-fade-in">
        <div class="flex items-center justify-between border-b border-slate-100 pb-3">
          <h3 class="text-sm font-black text-slate-900 uppercase tracking-wider">✏️ Edit Ledger Entry</h3>
          <button @click="closeEditModal" class="text-slate-400 hover:text-slate-600 font-bold text-xl focus:outline-none">&times;</button>
        </div>

        <form @submit.prevent="handleUpdateTransaction" class="space-y-4" novalidate>
          <div>
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">Amount & Currency System <span class="text-rose-500 font-bold">*</span></label>
            <div class="mt-1 flex rounded-xl shadow-3xs">
              <input v-model="editForm.amount" type="number" placeholder="0.00" class="block w-full px-3 py-2 border border-gray-200 rounded-l-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-500" />
              <select v-model="editForm.currency" class="px-2.5 py-2 border-t border-b border-r border-gray-200 bg-slate-50 rounded-r-xl text-xs font-black text-slate-600 focus:outline-none cursor-pointer">
                <option value="PKR">PKR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="AED">AED</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">Category Map <span class="text-rose-500 font-bold">*</span></label>
            <select v-model="editForm.category_id" class="mt-1 block w-full px-3.5 py-2.5 border border-gray-200 rounded-xl bg-white text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-500 cursor-pointer">
              <option value="" disabled>Select Category</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.icon || '📁' }} {{ cat.name }} ({{ cat.type }})
              </option>
            </select>
          </div>

          <div>
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">Description / Note Memo</label>
            <input v-model="editForm.description" type="text" class="mt-1 block w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-500" />
          </div>

          <div>
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wide">Calendar Date Log <span class="text-rose-500 font-bold">*</span></label>
            <input v-model="editForm.date" type="date" class="mt-1 block w-full px-3.5 py-2.5 border border-gray-200 rounded-xl text-xs font-semibold text-slate-700 focus:outline-none focus:ring-2 focus:ring-indigo-600/10 focus:border-indigo-500 cursor-pointer" />
          </div>

          <p v-if="editFormError" class="text-rose-600 text-xs font-bold bg-rose-50 p-2 rounded-xl border border-rose-100 transition animate-fade-in">
            ⚠️ {{ editFormError }}
          </p>

          <div class="flex items-center space-x-2 pt-2">
            <button type="button" @click="closeEditModal" class="w-1/2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2 px-4 rounded-xl text-xs transition">Cancel</button>
            <button type="submit" :disabled="editFormLoading" class="w-1/2 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded-xl text-xs transition disabled:opacity-50">
              {{ editFormLoading ? 'Updating...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<script setup>
  import { ref, onMounted, computed, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import api from '../services/api';
  import Swal from 'sweetalert2';
  
  // --- Chart.js Core Imports ---
  import { Bar, Doughnut } from 'vue-chartjs';
  import { 
    Chart as ChartJS, Title, Tooltip, Legend, BarElement, 
    CategoryScale, LinearScale, ArcElement 
  } from 'chart.js';

  ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale, ArcElement);

  const route = useRoute();
  const userName = ref('User');
  const loading = ref(true);
  const exportLoading = ref(false);
  const formLoading = ref(false);
  const editFormLoading = ref(false);
  const showEditModal = ref(false);
  
  const categories = ref([]);
  const budgetAlerts = ref([]);
  const upcoming_bills = ref([]);
  const currentEditingId = ref(null);
  const addFormError = ref('');
  const editFormError = ref('');
  const selectedDashboardCurrency = ref('PKR');

  // --- 📅 Month & Year Dynamic Filter States ---
  const currentPeriod = new Date();
  const selectedMonth = ref(currentPeriod.getMonth() + 1); // By default: Current Month (1-12)
  const selectedYear = ref(currentPeriod.getFullYear());  // By default: Current Year

  const monthsList = [
    { value: 1, label: 'January' }, { value: 2, label: 'February' },
    { value: 3, label: 'March' }, { value: 4, label: 'April' },
    { value: 5, label: 'May' }, { value: 6, label: 'June' },
    { value: 7, label: 'July' }, { value: 8, label: 'August' },
    { value: 9, label: 'September' }, { value: 10, label: 'October' },
    { value: 11, label: 'November' }, { value: 12, label: 'December' }
  ];

  const yearsList = computed(() => {
    const currentY = new Date().getFullYear();
    return [currentY - 1, currentY, currentY + 1]; // Previous Year, Current Year, Next Year
  });

  // --- UI Media DOM Inputs ---
  const receiptInput = ref(null);
  const videoStream = ref(null);
  const showCameraModal = ref(false);

  // --- Voice / Audio states ---
  const isListening = ref(false);
  const voiceTranscript = ref('');
  let recognition = null;
  let localMediaStream = null;

  // --- Core States & Fallbacks ---
  const stats = ref({ 
    summary: { total_income: 0, total_expense: 0, net_balance: 0 }, 
    recent_transactions: [],
    monthly_cashflow: { labels: [], income: [], expense: [] },
    category_breakdown: { labels: [], data: [] }
  });

  const aiInsights = ref({
    insight_text: 'Analyzing behaviors...',
    goal_forecast: 'Mapping targeted timeline schedules...',
    recommended_goal_id: null,
    recommended_transfer_amount: 0
  });

  const filter = ref({
    start_date: new Date(new Date().getFullYear(), new Date().getMonth(), 1).toISOString().split('T')[0],
    end_date: new Date().toISOString().split('T')[0]
  });

  const form = ref({ amount: '', category_id: '', currency: 'PKR', description: '', date: new Date().toISOString().split('T')[0] });
  const editForm = ref({ amount: '', category_id: '', currency: 'PKR', description: '', date: '' });

  // --- Computed Metrics ---
  const displayedTransactions = computed(() => stats.value.recent_transactions?.slice(0, 5) || []);
  const hasCategoryBreakdownData = computed(() => stats.value.category_breakdown?.data?.length > 0);

  const barChartData = computed(() => ({
    labels: stats.value.monthly_cashflow?.labels || [],
    datasets: [
      { label: 'Income', backgroundColor: '#10b981', borderRadius: 5, data: stats.value.monthly_cashflow?.income || [] },
      { label: 'Expense', backgroundColor: '#ef4444', borderRadius: 5, data: stats.value.monthly_cashflow?.expense || [] }
    ]
  }));

  const barChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'top', labels: { boxWidth: 12, font: { weight: '600', size: 11 } } },
      tooltip: { padding: 10, cornerRadius: 6 }
    },
    scales: {
      x: { grid: { display: false } },
      y: { ticks: { callback: (value) => value.toLocaleString() } }
    }
  };

  const doughnutChartData = computed(() => ({
    labels: stats.value.category_breakdown?.labels || [],
    datasets: [{
      backgroundColor: ['#6366f1', '#3b82f6', '#ec4899', '#f59e0b', '#14b8a6', '#8b5cf6', '#a855f7', '#64748b'],
      borderWidth: 2,
      borderColor: '#ffffff',
      data: stats.value.category_breakdown?.data || []
    }]
  }));

  const doughnutChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { position: 'bottom', labels: { padding: 12, boxWidth: 10, font: { size: 10, weight: '500' } } },
      tooltip: { padding: 10 }
    }
  };

  // ==========================================
  // 🔥 Core Engine Core Methods
  // ==========================================
  
  const fetchDashboardData = async () => {
    try {
      loading.value = true;
      const response = await api.get('/dashboard-stats', { 
        params: { 
          currency: selectedDashboardCurrency.value,
          month: selectedMonth.value,     // ⚡ Added dynamic month filter
          year: selectedYear.value        // ⚡ Added dynamic year filter
        } 
      });
      
      stats.value = {
        summary: response.data.summary || { total_income: 0, total_expense: 0, net_balance: 0 },
        recent_transactions: response.data.recent_transactions || [],
        monthly_cashflow: response.data.monthly_cashflow || { labels: [], income: [], expense: [] },
        category_breakdown: response.data.category_breakdown || { labels: [], data: [] }
      };

      upcoming_bills.value = response.data.upcoming_bills || [];
      if (response.data.ai_insights) aiInsights.value = response.data.ai_insights;
    } catch (e) {
      console.error("Error fetching dashboard stats:", e);
    } finally {
      loading.value = false;
    }
  };

  const fetchBudgetAlerts = async () => {
    try { 
      const res = await api.get('/reports/budget-alerts', {
        params: {
          month: selectedMonth.value,     // ⚡ Sync tracking metrics context
          year: selectedYear.value
        }
      }); 
      budgetAlerts.value = res.data; 
    } catch (e) { console.error(e); }
  };

  // --- 🕵️ Watcher for Filters ---
  watch([selectedMonth, selectedYear], () => {
    fetchDashboardData();
    fetchBudgetAlerts();
  });

  const sendImageToAiBackend = async (fileObject) => {
    addFormError.value = '';
    if (!form.value.category_id) {
      addFormError.value = '⚠️ Please select a Category from the dropdown first before scanning!';
      Swal.fire('Category Required', 'Kindly choose a valid category first.', 'warning');
      return;
    }

    Swal.fire({ title: 'Processing AI Scan...', text: 'Extracting details via Gemini AI...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

    const formData = new FormData();
    formData.append('image', fileObject);
    formData.append('category_id', form.value.category_id);
    formData.append('currency', form.value.currency || 'PKR');

    try {
      const response = await api.post('/transactions/scan', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

      if (response.data && response.data.status === 'success') {
        const parsedAmount = parseFloat(response.data.transaction?.amount || response.data.data?.amount);
        
        if (!parsedAmount || parsedAmount <= 0 || isNaN(parsedAmount)) {
          Swal.fire({ icon: 'error', title: 'Invalid Image / Receipt', text: 'AI could not detect any readable transaction amount.' });
          return;
        }

        await fetchDashboardData();
        await fetchBudgetAlerts();
        Swal.fire({ icon: 'success', title: 'AI Entry Saved!', text: `Amount: ${response.data.transaction?.currency || 'PKR'} ${parsedAmount}`, timer: 2500, showConfirmButton: false });
      }
    } catch (error) {
      Swal.fire('Scan Processing Failed', error.response?.data?.message || 'Could not verify financial content.', 'error');
    }
  };

  const handleReceiptScan = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    await sendImageToAiBackend(file);
    if (receiptInput.value) receiptInput.value.value = '';
  };

  // ==========================================
  // 📸 Media Stream Capture Framework
  // ==========================================
  const openLiveCamera = async () => {
    addFormError.value = '';
    if (!form.value.category_id) {
      addFormError.value = '⚠️ Please select a Category first!';
      Swal.fire('Category Required', 'Choose a category first.', 'warning');
      return;
    }
    
    showCameraModal.value = true;
    try {
      localMediaStream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' }, audio: false });
      setTimeout(() => { if (videoStream.value) videoStream.value.srcObject = localMediaStream; }, 200);
    } catch (err) {
      showCameraModal.value = false;
      Swal.fire('Camera Error', 'Could not fetch device media stream framework.', 'error');
    }
  };

  const closeLiveCamera = () => {
    if (localMediaStream) localMediaStream.getTracks().forEach(track => track.stop());
    showCameraModal.value = false;
  };

  const capturePhotoFromStream = () => {
    if (!videoStream.value) return;
    const canvas = document.createElement('canvas');
    canvas.width = videoStream.value.videoWidth || 640;
    canvas.height = videoStream.value.videoHeight || 480;
    
    canvas.getContext('2d').drawImage(videoStream.value, 0, 0, canvas.width, canvas.height);
    canvas.toBlob(async (blob) => {
      if (blob) {
        closeLiveCamera();
        await sendImageToAiBackend(new File([blob], "camera_snap.png", { type: "image/png" })); 
      }
    }, 'image/png');
  };

  // ==========================================
  // 🎤 Automated Voice Intent Module
  // ==========================================
  const toggleVoiceListening = () => {
    addFormError.value = '';
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    
    if (!SpeechRecognition) {
      Swal.fire('Not Supported', 'Please use Google Chrome for optimized speech interfaces.', 'error');
      return;
    }
    if (!form.value.category_id) {
      addFormError.value = '⚠️ Please select a Category first!';
      Swal.fire('Category Required', 'Choose a category first.', 'warning');
      return;
    }
    if (isListening.value) {
      if (recognition) recognition.stop();
      return;
    }

    recognition = new SpeechRecognition();
    recognition.lang = 'en-US'; // ⚡ Language updated from 'ur-PK' to 'en-US' for structured parsing
    recognition.interimResults = false;

    recognition.onstart = () => {
      isListening.value = true;
      voiceTranscript.value = "Listening...";
    };
    recognition.onerror = (e) => { 
      isListening.value = false; 
      Swal.fire('Audio Error', `Voice engine stopped: ${e.error}`, 'error');
    };
    recognition.onend = () => isListening.value = false;

    recognition.onresult = async (event) => {
      const speechText = event.results[0][0].transcript;
      voiceTranscript.value = speechText;

      Swal.fire({ title: 'Voice Processing...', text: `Sending: "${speechText}"`, allowOutsideClick: false, didOpen: () => Swal.showLoading() });

      try {
        const response = await api.post('/transactions/scan', {
          text_prompt: speechText,
          category_id: form.value.category_id,
          currency: form.value.currency || 'PKR'
        });

        if (response.data && response.data.status === 'success') {
          const parsedAmount = parseFloat(response.data.transaction?.amount || response.data.data?.amount);
          
          if (!parsedAmount || parsedAmount <= 0 || isNaN(parsedAmount)) {
            Swal.fire({ icon: 'error', title: 'No Amount Detected', text: `AI couldn't find a valid amount in: "${speechText}".` });
            return;
          }

          await fetchDashboardData();
          await fetchBudgetAlerts();
          Swal.fire({ icon: 'success', title: 'Audio Saved!', text: `Amount: ${parsedAmount}`, timer: 2500, showConfirmButton: false });
        }
      } catch (err) {
        Swal.fire('Backend Error', err.response?.data?.message || 'Could not reach server backend.', 'error');
      }
    };
    recognition.start();
  };

  // --- Core Lifecycle Hooks & Router Watching ---
  watch(() => route.path, (newPath) => {
    if (newPath === '/dashboard') {
      fetchDashboardData();
      fetchBudgetAlerts();
    }
  });

  onMounted(async () => {
    const impToken = route.query.impersonate_token;
    
    if (impToken) {
      sessionStorage.setItem('token', impToken);
      try {
        const userResponse = await api.get('/user'); 
        sessionStorage.setItem('user', JSON.stringify(userResponse.data));
        userName.value = userResponse.data.name;
        if (userResponse.data.default_currency) selectedDashboardCurrency.value = userResponse.data.default_currency;
      } catch (error) {
        console.error("Impersonated user validation failure:", error);
      }
      window.history.replaceState({}, document.title, window.location.pathname);
    } else {
      const userData = sessionStorage.getItem('user') || localStorage.getItem('user');
      const user = userData ? JSON.parse(userData) : null;
      if (user) {
        userName.value = user.name;
        if (user.default_currency) selectedDashboardCurrency.value = user.default_currency;
      }
    }

    await Promise.all([fetchDashboardData(), fetchCategories(), fetchBudgetAlerts()]);
  });

  // ==========================================
  // 💼 Standard Operations CRUD Handlers
  // ==========================================
  const markAsPaid = async (billId) => {
    try {
      const result = await Swal.fire({ title: 'Are you sure?', text: "Mark this bill as paid?", icon: 'question', showCancelButton: true, confirmButtonColor: '#4f46e5' });
      if (!result.isConfirmed) return;

      await api.post(`/recurring-bills/${billId}/pay`);
      upcoming_bills.value = upcoming_bills.value.filter(b => b.id !== billId);
      await fetchDashboardData();
      await fetchBudgetAlerts();

      Swal.fire({ title: 'Success', text: 'Bill synchronized successfully.', icon: 'success', timer: 1500, showConfirmButton: false });
    } catch (error) {
      Swal.fire({ title: 'Error', text: 'Failed to update bill payment.', icon: 'error' });
    }
  };

  const handleCurrencyChange = async () => {
    await fetchDashboardData();
    try {
      await api.post('/user/update-currency', { currency: selectedDashboardCurrency.value });
      const userData = JSON.parse(localStorage.getItem('user') || '{}');
      userData.default_currency = selectedDashboardCurrency.value;
      localStorage.setItem('user', JSON.stringify(userData));
    } catch (err) {
      console.error("Failed to save currency preference", err);
    }
  };

  const getCurrencySymbol = (code) => {
    const symbols = { 'PKR': 'Rs.', 'USD': '$', 'EUR': '€', 'AED': 'د.إ' };
    return symbols[code] || code;
  };

  const fetchCategories = async () => {
    try { const res = await api.get('/categories'); categories.value = res.data; } catch (e) { console.error(e); }
  };

  const handleSubmitTransaction = async () => {
    addFormError.value = '';
    if (!form.value.amount || form.value.amount < 1) { addFormError.value = '⚠️ Amount must be >= 1.'; return; }
    if (!form.value.category_id) { addFormError.value = '⚠️ Please select a category.'; return; }
    if (!form.value.date) { addFormError.value = '⚠️ Date is required.'; return; }

    formLoading.value = true;
    try {
      await api.post('/transactions', form.value);
      form.value = { amount: '', category_id: '', currency: 'PKR', description: '', date: new Date().toISOString().split('T')[0] };
      await fetchDashboardData();
      await fetchBudgetAlerts();
      Swal.fire({ title: 'Success', text: 'Transaction recorded.', icon: 'success', timer: 1500, showConfirmButton: false });
    } catch (error) {
      addFormError.value = error.response?.data?.errors ? `❌ ${Object.values(error.response.data.errors).flat()[0]}` : 'Something went wrong.';
    } finally { formLoading.value = false; }
  };

  const downloadReport = async (format) => {
    exportLoading.value = true;
    try {
      const res = await api.get(`/reports/export/${format}`, { params: filter.value, responseType: 'blob' });
      const link = document.createElement('a');
      link.href = window.URL.createObjectURL(new Blob([res.data]));
      link.download = `Expense-Report.${format === 'pdf' ? 'pdf' : 'xlsx'}`;
      link.click();
    } catch (e) {
      Swal.fire({ title: 'Export Failed', text: 'Unable to download report.', icon: 'error' });
    } finally { exportLoading.value = false; }
  };

  const openEditModal = (tx) => {
    currentEditingId.value = tx.id;
    editForm.value = { amount: tx.amount, category_id: tx.category_id, currency: tx.currency, description: tx.description, date: tx.date };
    showEditModal.value = true;
  };

  const closeEditModal = () => {
    showEditModal.value = false;
    currentEditingId.value = null;
    editFormError.value = '';
  };

  const handleUpdateTransaction = async () => {
    editFormError.value = '';
    editFormLoading.value = true;
    try {
      await api.put(`/transactions/${currentEditingId.value}`, editForm.value);
      closeEditModal();
      await fetchDashboardData();
      await fetchBudgetAlerts();
      Swal.fire({ title: 'Updated', text: 'Transaction updated successfully.', icon: 'success', timer: 1500, showConfirmButton: false });
    } catch (err) {
      editFormError.value = '❌ Failed to update transaction.';
    } finally { editFormLoading.value = false; }
  };

  const handleDeleteTransaction = async (id) => {
    try {
      const result = await Swal.fire({ title: 'Delete Entry?', text: "Permanently delete this record?", icon: 'warning', showCancelButton: true, confirmButtonColor: '#ef4444' });
      if (!result.isConfirmed) return;

      await api.delete(`/transactions/${id}`);
      await fetchDashboardData();
      await fetchBudgetAlerts();
      Swal.fire({ title: 'Deleted', text: 'Record removed.', icon: 'success', timer: 1200, showConfirmButton: false });
    } catch (e) {
      Swal.fire({ title: 'Error', text: 'Failed to delete execution.', icon: 'error' });
    }
  };

  const triggerAiGoalSuggestion = () => {
    if (!aiInsights.value.recommended_transfer_amount || aiInsights.value.recommended_transfer_amount <= 0) {
      Swal.fire({ title: 'Fully Synced', text: 'No active savings recommendation pending.', icon: 'info' });
      return;
    }

    Swal.fire({
      title: 'AI Savings Smart-Analysis',
      html: `AI recommends moving <b>${getCurrencySymbol(selectedDashboardCurrency.value)} ${aiInsights.value.recommended_transfer_amount}</b> to your active goal.`,
      icon: 'info',
      showCancelButton: true,
      confirmButtonColor: '#4f46e5',
      confirmButtonText: 'Yes, Transfer Now'
    }).then(async (result) => {
      if (result.isConfirmed) {
        try {
          await api.post(`/goals/${aiInsights.value.recommended_goal_id}/allocate`, { amount: aiInsights.value.recommended_transfer_amount });
          Swal.fire('Transferred!', `Successfully allocated target funds.`, 'success');
          await fetchDashboardData();
        } catch (error) {
          await Swal.fire('Error', 'Failed to allocate funds via API.', 'error');
        }
      }
    });
  };
</script>

<style scoped>
  .text-xxs { font-size: 0.65rem; }
  .animate-fade-in { animation: fadeIn 0.2s ease-out forwards; }
  @keyframes fadeIn {
    from { opacity: 0; transform: translateY(-5px); }
    to { opacity: 1; transform: translateY(0); }
  }
</style>