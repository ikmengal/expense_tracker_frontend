<template>
  <div class="min-h-screen bg-gray-50 flex flex-col transition-colors duration-200">
    <div class="flex-1 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 md:py-10 space-y-6 md:space-y-8 w-full">
      
      <div class="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 border-b border-gray-100 pb-4 lg:pb-6">
        <div>
          <h1 class="text-2xl md:text-3xl font-bold text-gray-900 text-center lg:text-left">Welcome, {{ userName }}!</h1>
          <p class="text-xs md:text-sm text-gray-500 mt-1 text-center lg:text-left">Here you can maintain your daily expenses and savings.</p>
        </div>
        
        <div class="bg-white p-3 md:p-4 rounded-2xl shadow-sm border border-gray-100 flex flex-col sm:flex-row items-center justify-center gap-3 w-full lg:w-auto">
          <div class="flex items-center space-x-2 w-full sm:w-auto justify-center">
            <span class="text-xs font-bold text-gray-400 uppercase tracking-wider whitespace-nowrap">View In:</span>
            <select 
              v-model="selectedDashboardCurrency" 
              @change="handleCurrencyChange"
              class="w-full sm:w-auto px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs font-bold text-indigo-600 bg-indigo-50 focus:ring-1 focus:ring-indigo-500 focus:outline-none cursor-pointer"
            >
              <option value="PKR">PKR (Rs.)</option>
              <option value="USD">USD ($)</option>
              <option value="EUR">EUR (€)</option>
              <option value="AED">AED (د.إ)</option>
            </select>
          </div>

          <div class="flex items-center space-x-2 w-full sm:w-auto justify-center">
            <input type="date" v-model="filter.start_date" class="w-full sm:w-auto px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none" />
            <span class="text-gray-400 text-xs">to</span>
            <input type="date" v-model="filter.end_date" class="w-full sm:w-auto px-2.5 py-1.5 border border-gray-200 rounded-lg text-xs focus:ring-1 focus:ring-indigo-500 focus:outline-none" />
          </div>

          <div class="flex items-center space-x-2 w-full sm:w-auto justify-center">
            <button @click="downloadReport('pdf')" :disabled="exportLoading" class="flex-1 sm:flex-none text-center bg-red-50 hover:bg-red-100 text-red-600 px-3 py-1.5 rounded-lg text-xs font-bold transition disabled:opacity-50">
              {{ exportLoading ? '⏳ Wait...' : '📄 PDF Report' }}
            </button>
            <button @click="downloadReport('excel')" :disabled="exportLoading" class="flex-1 sm:flex-none text-center bg-green-50 hover:bg-green-100 text-green-600 px-3 py-1.5 rounded-lg text-xs font-bold transition disabled:opacity-50">
              {{ exportLoading ? '⏳ Wait...' : '📊 Excel Sheet' }}
            </button>
          </div>
        </div>
      </div>

      <div>
        <select 
          v-model="selectedMonth" 
          class="bg-white border-0 text-slate-700 text-xs rounded-lg px-2.5 py-1.5 font-semibold focus:ring-2 focus:ring-indigo-500 shadow-sm outline-none cursor-pointer"
        >
          <option v-for="m in monthsList" :key="m.value" :value="m.value">
            {{ m.label }}
          </option>
        </select>
        <select 
          v-model="selectedYear" 
          class="bg-white border-0 text-slate-700 text-xs rounded-lg px-2.5 py-1.5 font-semibold focus:ring-2 focus:ring-indigo-500 shadow-sm outline-none cursor-pointer"
        >
          <option v-for="y in yearsList" :key="y" :value="y">
            {{ y }}
          </option>
        </select>
      </div>

      <div v-if="loading" class="text-center py-20 text-xl font-medium text-gray-500">
        <div class="animate-pulse space-y-2">
          <span>🔄 Loading Live Rates & Calculations...</span>
        </div>
      </div>

      <div v-else class="space-y-6 md:space-y-8">
        
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          <div class="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition">
            <div>
              <p class="text-xs md:text-sm font-medium text-gray-400 uppercase tracking-wider">Total Income</p>
              <h3 class="text-2xl md:text-3xl font-bold text-green-600 mt-1">
                {{ getCurrencySymbol(selectedDashboardCurrency) }} {{ Number(stats.summary?.total_income || 0).toFixed(2) }}
              </h3>
            </div>
            <div class="w-12 h-12 rounded-xl bg-green-50 text-green-600 flex items-center justify-center font-bold text-lg md:text-xl">💵</div>
          </div>

          <div class="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 flex items-center justify-between hover:shadow-md transition">
            <div>
              <p class="text-xs md:text-sm font-medium text-gray-400 uppercase tracking-wider">Total Expense</p>
              <h3 class="text-2xl md:text-3xl font-bold text-red-600 mt-1">
                {{ getCurrencySymbol(selectedDashboardCurrency) }} {{ Number(stats.summary?.total_expense || 0).toFixed(2) }}
              </h3>
            </div>
            <div class="w-12 h-12 rounded-xl bg-red-50 text-red-600 flex items-center justify-center font-bold text-lg md:text-xl">📉</div>
          </div>

          <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 flex items-center justify-between relative overflow-hidden group hover:shadow-md transition duration-300">
            <div class="space-y-1 z-10">
              <span class="text-xs font-bold text-gray-400 uppercase tracking-wider block">Net Balance</span>
              <!-- 💥 Real Dynamic Net Balance Number Main Head line -->
              <h3 class="text-2xl md:text-3xl font-black text-indigo-600 tracking-tight">
                {{ getCurrencySymbol(selectedCurrency) }} {{ stats.summary.net_balance }}
              </h3>
              
              <!-- ✨ Real Dynamic AI Insight Micro-text Badge -->
              <div class="flex items-center gap-1.5 mt-2 bg-emerald-50 text-emerald-700 px-2.5 py-1 rounded-lg text-[10px] font-bold w-fit border border-emerald-100/50">
                <span>{{ aiInsights.insight_text }}</span>
              </div>
            </div>

            <div class="p-3.5 bg-indigo-50/60 text-indigo-600 rounded-xl transition group-hover:bg-indigo-600 group-hover:text-white shadow-2xs">
              <span class="text-xl block leading-none">🏛️</span>
            </div>
          </div>

        </div>

        <div v-if="upcoming_bills.length > 0" class="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 mt-6">
          <div class="flex justify-between items-center mb-4">
            <div class="flex items-center space-x-2">
              <span class="text-base">📅</span>
              <h3 class="text-sm font-bold text-gray-800">Upcoming Bills (Next 7 Days)</h3>
            </div>
          </div>

          <div class="space-y-3">
            <div v-for="bill in upcoming_bills" :key="bill.id" class="flex items-center justify-between p-3 bg-gray-50 rounded-xl">
              <div class="flex items-center space-x-3">
                <span class="text-lg">{{ bill.category_icon }}</span>
                <div>
                  <h4 class="text-xs font-semibold text-gray-800">{{ bill.name }}</h4>
                  
                  <p class="text-[10px] text-red-500 font-semibold" v-if="bill.days_left === 0">🚨 Due Today!</p>
                  <p class="text-[10px] text-red-600 font-semibold" v-else-if="bill.days_left < 0">⚠️ Overdue by {{ Math.abs(bill.days_left) }} days</p>
                  <p class="text-[10px] text-amber-600 font-medium" v-else>⏳ Due in {{ bill.days_left }} days ({{ bill.due_date }})</p>
                </div>
              </div>
              
              <div class="text-right">
                <span class="text-xs font-bold text-gray-800 block">{{ bill.amount }} {{ bill.currency }}</span>
                <button @click="markAsPaid(bill.id)" class="text-[10px] text-indigo-600 hover:underline font-semibold">Mark Paid</button>
              </div>
            </div>
          </div>
        </div>

        <!-- 1. Savings & Financial Goals Card -->
        <div class="bg-white rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 flex flex-col md:flex-row md:items-center justify-between gap-4 transition duration-300 hover:shadow-md">
          <div class="space-y-1.5">
            <span class="text-[10px] font-extrabold text-indigo-600 uppercase tracking-widest block">Savings & Financial Goals</span>
            <h2 class="text-lg md:text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
              Make Your Dreams Come True 
              <span class="text-xs bg-indigo-50 text-indigo-600 border border-indigo-100 font-bold px-2 py-0.5 rounded-full">AI Automated</span>
            </h2>
            
            <!-- Dynamic AI Forecast Text -->
            <p class="text-xs text-slate-600 max-w-xl font-medium">
              {{ aiInsights.goal_forecast }}
            </p>
            
            <router-link to="/goals" class="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 hover:text-indigo-700 mt-2 group transition">
              Manage Goals 
              <span class="transform transition group-hover:translate-x-1">➡️</span>
            </router-link>
          </div>

          <div class="flex items-center gap-3 self-start md:self-center">
            <!-- ✨ v-if lagaya: Button sirf tab dikhega jab transfer amount 0 se zyada ho -->
            <button 
              v-if="aiInsights.recommended_transfer_amount > 0"
              type="button"
              @click="triggerAiGoalSuggestion" 
              class="px-3.5 py-2 bg-slate-50 hover:bg-indigo-50 text-indigo-600 border border-gray-200 text-xs font-bold rounded-xl shadow-xs transition active:scale-95 flex items-center gap-1.5"
            >
              🤖 Smart Save
            </button>

            <!-- ✨ v-else: Agar allocation ho chuki hai to success state show hogi -->
            <div v-else class="px-3 py-1.5 bg-emerald-50 text-emerald-700 border border-emerald-100 text-[11px] font-bold rounded-xl flex items-center gap-1">
              ✅ Fully Saved
            </div>

            <!-- Asli Orange/Red Target Icon Frame -->
            <div class="p-4 bg-indigo-600 text-white rounded-2xl shadow-lg shadow-indigo-600/20">
              <span class="text-2xl block leading-none">🎯</span>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          <div class="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 lg:col-span-2 space-y-4">
            <div class="flex justify-between items-center border-b border-gray-50 pb-2">
              <h3 class="text-base font-bold text-gray-800">Monthly Cashflow (Current Year)</h3>
              <span class="text-xs font-bold text-indigo-600 uppercase bg-indigo-50 px-2 py-0.5 rounded-md scale-95">Scale: {{ selectedDashboardCurrency }}</span>
            </div>
            <div class="h-64 md:h-72 relative">
              <Bar :data="barChartData" :options="barChartOptions" />
            </div>
          </div>

          <div class="bg-white p-5 md:p-6 rounded-2xl shadow-sm border border-gray-100 space-y-4">
            <div class="flex justify-between items-center border-b border-gray-50 pb-2">
              <h3 class="text-base font-bold text-gray-800">Expense Breakdown</h3>
              <span class="text-xxs font-semibold text-gray-400 uppercase tracking-wider">By Category</span>
            </div>
            <div class="h-64 md:h-72 relative flex items-center justify-center">
              <Doughnut v-if="hasCategoryBreakdownData" :data="doughnutChartData" :options="doughnutChartOptions" />
              <div v-else class="text-xs text-gray-400 text-center py-20">
                ⚠️ No category logs found for analytics distribution.
              </div>
            </div>
          </div>
        </div>

        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8">
          
          <div class="lg:col-span-2 bg-white rounded-2xl shadow-sm border border-gray-100 p-4 md:p-6 flex flex-col justify-between overflow-hidden">
            <div>
              <h2 class="text-lg md:text-xl font-bold text-gray-800 mb-4 text-center sm:text-left">Recent Transactions (Current Month)</h2>
              
              <div class="hidden sm:block overflow-x-auto">
                <table class="w-full text-left border-collapse">
                  <thead>
                    <tr class="border-b border-gray-200 text-gray-400 text-xs md:text-sm uppercase font-semibold">
                      <th class="py-3 pr-2">Description</th>
                      <th class="py-3 px-2">Category</th>
                      <th class="py-3 px-2">Date</th>
                      <th class="py-3 px-2 text-right">Amount</th>
                      <th class="py-3 pl-2 text-center">Actions</th>
                    </tr>
                  </thead>
                  <tbody class="divide-y divide-gray-100">
                    <tr v-for="tx in displayedTransactions" :key="tx.id" class="text-gray-700 hover:bg-gray-50 transition">
                      <td class="py-4 pr-2 font-medium text-gray-900 truncate max-w-[150px]">{{ tx.description || 'No description' }}</td>
                      <td class="py-4 px-2">
                        <span class="inline-block px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap" :class="tx.category?.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                          {{ tx.category?.icon || '📁' }} {{ tx.category?.name }}
                        </span>
                      </td>
                      <td class="py-4 px-2 text-sm text-gray-500 whitespace-nowrap">{{ tx.date }}</td>
                      
                      <td class="py-4 px-2 text-right font-bold whitespace-nowrap" :class="tx.category?.type === 'income' ? 'text-green-600' : 'text-red-600'">
                        {{ tx.category?.type === 'income' ? '+' : '-' }}
                        <span>
                          {{ getCurrencySymbol(selectedDashboardCurrency) }} {{ tx.converted_amount ?? tx.amount }}
                        </span>
                        <span v-if="tx.currency !== selectedDashboardCurrency" class="block text-xxs text-gray-400 font-normal tracking-tight mt-0.5">
                          Orig: {{ tx.amount }} {{ tx.currency }}
                        </span>
                      </td>
                      
                      <td class="py-4 pl-2 text-center">
                        <div class="flex justify-center space-x-1">
                          <button @click="openEditModal(tx)" class="p-1.5 text-indigo-600 hover:bg-indigo-50 rounded-md transition">✏️</button>
                          <button @click="handleDeleteTransaction(tx.id)" class="p-1.5 text-red-600 hover:bg-red-50 rounded-md transition">🗑️</button>
                        </div>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div class="block sm:hidden space-y-3">
                <div v-for="tx in displayedTransactions" :key="tx.id" class="bg-gray-50 p-4 rounded-xl border border-gray-100 space-y-2">
                  <div class="flex justify-between items-start">
                    <div>
                      <h4 class="font-bold text-gray-900 text-sm">{{ tx.description || 'No description' }}</h4>
                      <p class="text-xxs text-gray-400 mt-0.5">🗓️ {{ tx.date }}</p>
                    </div>
                    <span class="px-2 py-0.5 rounded-full text-xxs font-bold whitespace-nowrap" :class="tx.category?.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'">
                      {{ tx.category?.icon || '📁' }} {{ tx.category?.name }}
                    </span>
                  </div>
                  <div class="flex justify-between items-center pt-1 border-t border-gray-200/60">
                    <span class="text-sm font-extrabold flex flex-col" :class="tx.category?.type === 'income' ? 'text-green-600' : 'text-red-600'">
                      <span>
                        {{ tx.category?.type === 'income' ? '+' : '-' }}
                        {{ getCurrencySymbol(selectedDashboardCurrency) }} {{ tx.converted_amount ?? tx.amount }}
                      </span>
                      <span v-if="tx.currency !== selectedDashboardCurrency" class="text-xxs text-gray-400 font-normal">
                        Orig: {{ tx.amount }} {{ tx.currency }}
                      </span>
                    </span>
                    <div class="flex space-x-2">
                      <button @click="openEditModal(tx)" class="bg-white px-2 py-1 border border-gray-200 rounded-lg text-xs shadow-xs">✏️ Edit</button>
                      <button @click="handleDeleteTransaction(tx.id)" class="bg-red-50 text-red-600 px-2 py-1 rounded-lg text-xs font-semibold">🗑️</button>
                    </div>
                  </div>
                </div>
              </div>

              <div v-if="displayedTransactions.length === 0" class="py-12 text-center text-gray-400 text-sm">
                ⚠️ Koi transactions records nahi hain is month.
              </div>
            </div>
            
            <div class="mt-4 pt-4 border-t border-gray-100 flex justify-center">
              <router-link to="/transactions" class="w-full text-center inline-flex items-center justify-center space-x-2 text-xs md:text-sm font-semibold text-indigo-600 hover:text-indigo-800 bg-indigo-50/50 px-5 py-2.5 rounded-xl transition">
                <span>View All Transactions</span> <span>➡️</span>
              </router-link>
            </div>
          </div>

          <div class="space-y-6">
            <div class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6 space-y-5">
              <h2 class="text-lg md:text-xl font-bold text-gray-800 tracking-tight">Add New Entry</h2>
              <form @submit.prevent="handleSubmitTransaction" class="space-y-4" novalidate>
                <div>
                  <label class="block text-xs md:text-sm font-medium text-gray-700">Amount & Currency <span class="text-red-500 font-bold">*</span></label>
                  <div class="mt-1 flex rounded-xl shadow-sm">
                    <input v-model="form.amount" type="number" placeholder="e.g. 100" class="block w-full px-3 py-2 border border-gray-300 rounded-l-xl text-xs md:text-sm focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 focus:outline-none transition" />
                    <select v-model="form.currency" class="px-2 md:px-3 py-2 border-t border-b border-r border-gray-300 bg-gray-50 rounded-r-xl text-xs md:text-sm font-bold text-gray-600 focus:outline-none cursor-pointer">
                      <option value="PKR">PKR</option>
                      <option value="USD">USD</option>
                      <option value="EUR">EUR</option>
                      <option value="AED">AED</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label class="block text-xs md:text-sm font-semibold text-gray-700">Category <span class="text-red-500 font-bold">*</span></label>
                  <select v-model="form.category_id" class="mt-1.5 block w-full px-3 py-2.5 border border-gray-300 rounded-xl bg-white text-xs md:text-sm shadow-sm transition focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 cursor-pointer">
                    <option value="" disabled>Select a target category</option>
                    <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                      {{ cat.icon || '📁' }} {{ cat.name }} ({{ cat.type }})
                    </option>
                  </select>
                </div>

                <div>
                  <label class="block text-xs md:text-sm font-medium text-gray-700">Description</label>
                  <input v-model="form.description" type="text" placeholder="e.g. Petrol" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition" />
                </div>

                <div>
                  <label class="block text-xs md:text-sm font-medium text-gray-700">Date <span class="text-red-500 font-bold">*</span></label>
                  <input v-model="form.date" type="date" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-xl text-xs md:text-sm focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition cursor-pointer" />
                </div>

                <div class="p-5 border border-dashed border-indigo-200 bg-indigo-50/20 rounded-2xl transition duration-300 hover:border-indigo-400 mt-6">
                  <div class="flex flex-col items-center text-center justify-center relative">
                    
                    <div class="flex flex-col items-center mb-2"
                      type="button"
                      @click="openLiveCamera">
                      <div class="w-12 h-12 bg-indigo-100 text-indigo-600 rounded-full flex items-center justify-center text-xl shadow-xs">
                        📷
                      </div>
                      <span class="mt-1.5 text-[9px] uppercase tracking-wider bg-indigo-600 text-white font-black px-2 py-0.5 rounded-full shadow-xs animate-pulse">
                        AI Powered
                      </span>
                    </div>

                    <h4 class="text-sm font-bold text-slate-800 mt-1">Instant AI Transaction Scanner</h4>
                    <p class="text-[11px] text-slate-500 max-w-xs mb-4">Snap live receipt framing or stream audio logs mapped to your chosen category</p>
                    
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
                      class="cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white font-bold px-3 py-2 rounded-lg text-xs transition-all shadow-sm"
                    >
                      📁 Choose Receipt Image
                    </label>
                  </div>

                  <div class="relative flex py-2 items-center justify-center">
                    <div class="flex-grow border-t border-slate-200/60"></div>
                    <span class="flex-shrink mx-3 text-[9px] text-slate-400 font-bold uppercase tracking-wider">Or Use Voice Command</span>
                    <div class="flex-grow border-t border-slate-200/60"></div>
                  </div>

                  <div class="flex flex-col items-center justify-center mt-2">
                    <button 
                      @click="toggleVoiceListening" 
                      type="button"
                      :class="isListening ? 'bg-red-600 hover:bg-red-700 ring-4 ring-red-100 animate-pulse' : 'bg-emerald-600 hover:bg-emerald-700 shadow-emerald-100'"
                      class="text-white flex items-center gap-2 font-bold px-5 py-2.5 rounded-xl text-[11px] transition duration-200 active:scale-95 shadow-md"
                    >
                      🎤 {{ isListening ? '🛑 Stop & Process...' : 'Speak Ledger Details' }}
                    </button>
                    
                    <p v-if="voiceTranscript" class="text-[11px] text-indigo-600 font-medium italic mt-2.5 bg-white p-2 rounded-xl border border-indigo-100 w-full text-center max-w-xs shadow-2xs animate-fade-in">
                      "{{ voiceTranscript }}"
                    </p>
                  </div>
                </div>

                <p v-if="addFormError" class="text-red-500 text-xxs md:text-xs font-semibold bg-red-50 p-2.5 rounded-xl border border-red-100 transition shadow-xs animate-fade-in">
                  {{ addFormError }}
                </p>

                <button type="submit" :disabled="formLoading" class="w-full py-2.5 px-4 rounded-xl text-xs md:text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-700 transition disabled:opacity-50 shadow-md shadow-indigo-100 active:scale-98">
                  {{ formLoading ? 'Saving...' : 'Save Transaction Manual' }}
                </button>
              </form>
            </div>

            <div v-if="showCameraModal" class="fixed inset-0 bg-slate-900/80 backdrop-blur-xs flex flex-col items-center justify-center z-50 p-4 animate-fade-in">
              <div class="bg-white rounded-2xl p-5 max-w-md w-full flex flex-col items-center shadow-2xl border border-slate-100">
                <div class="w-full flex justify-between items-center mb-3">
                  <h3 class="text-xs font-bold text-slate-800 uppercase tracking-wide">Live Capture Lens</h3>
                  <span class="text-[9px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">Lens Ready</span>
                </div>
                
                <video ref="videoStream" autoplay playsinline class="w-full bg-slate-950 rounded-xl transform scale-x-100 mb-4 h-60 object-cover shadow-inner border border-slate-800"></video>
                
                <div class="flex gap-3 w-full">
                  <button @click="closeLiveCamera" type="button" class="flex-1 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold py-2.5 rounded-xl text-xs transition-all">Cancel</button>
                  <button @click="capturePhotoFromStream" type="button" class="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 rounded-xl text-xs shadow-md shadow-indigo-100 transition-all">📸 Take Snippet</button>
                </div>
              </div>
            </div>

            <div v-if="budgetAlerts.length > 0" class="bg-white rounded-2xl shadow-sm border border-gray-100 p-5 md:p-6 space-y-4">
              <h3 class="text-xs font-bold text-gray-500 uppercase tracking-wider">Monthly Budget Track</h3>
              <div class="space-y-3.5">
                <div v-for="b in budgetAlerts" :key="b.category_id" class="space-y-1">
                  <div class="flex justify-between text-xxs sm:text-xs font-semibold">
                    <span class="text-gray-700">{{ b.category_icon || '📁' }} {{ b.category_name }}</span>
                    <span class="text-gray-400">Rs. {{ b.total_spent }} / {{ b.budget_limit }}</span>
                  </div>
                  <div class="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
                    <div class="h-full rounded-full transition-all duration-500" :class="b.percentage >= 100 ? 'bg-red-500' : b.percentage >= 80 ? 'bg-orange-500' : 'bg-indigo-600'" :style="{ width: Math.min(b.percentage, 100) + '%' }"></div>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>

    <div v-if="showEditModal" class="fixed inset-0 z-50 overflow-y-auto bg-black/40 flex items-center justify-center p-4 backdrop-blur-xs">
      <div class="bg-white rounded-2xl max-w-md w-full p-5 md:p-6 shadow-2xl border border-gray-100 transform transition-all space-y-4 animate-fade-in">
        <div class="flex items-center justify-between border-b border-gray-100 pb-3">
          <h3 class="text-base md:text-lg font-bold text-gray-900">✏️ Edit Transaction</h3>
          <button @click="closeEditModal" class="text-gray-400 hover:text-gray-600 font-bold text-xl focus:outline-none">&times;</button>
        </div>

        <form @submit.prevent="handleUpdateTransaction" class="space-y-4" novalidate>
          <div>
            <label class="block text-xs md:text-sm font-medium text-gray-700">Amount & Currency <span class="text-red-500 font-bold">*</span></label>
            <div class="mt-1 flex rounded-lg shadow-sm">
              <input v-model="editForm.amount" type="number" placeholder="0.00" class="block w-full px-3 py-2 border border-gray-300 rounded-l-lg text-xs md:text-sm focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none" />
              <select v-model="editForm.currency" class="px-2 md:px-3 py-2 border-t border-b border-r border-gray-300 bg-gray-50 rounded-r-lg text-xs md:text-sm font-bold text-gray-600 focus:outline-none cursor-pointer">
                <option value="PKR">PKR</option>
                <option value="USD">USD</option>
                <option value="EUR">EUR</option>
                <option value="AED">AED</option>
              </select>
            </div>
          </div>

          <div>
            <label class="block text-xs md:text-sm font-medium text-gray-700">Category <span class="text-red-500 font-bold">*</span></label>
            <select v-model="editForm.category_id" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg bg-white text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500">
              <option value="" disabled>Select Category</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">
                {{ cat.icon || '📁' }} {{ cat.name }} ({{ cat.type }})
              </option>
            </select>
          </div>

          <div>
            <label class="block text-xs md:text-sm font-medium text-gray-700">Description</label>
            <input v-model="editForm.description" type="text" placeholder="Optional description" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </div>

          <div>
            <label class="block text-xs md:text-sm font-medium text-gray-700">Date <span class="text-red-500 font-bold">*</span></label>
            <input v-model="editForm.date" type="date" class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-lg text-xs md:text-sm focus:outline-none focus:ring-1 focus:ring-indigo-500" />
          </div>

          <p v-if="editFormError" class="text-red-500 text-xxs md:text-xs font-semibold bg-red-50 p-2 rounded-lg border border-red-100 transition shadow-sm animate-fade-in">
            {{ editFormError }}
          </p>

          <div class="flex items-center space-x-3 pt-2">
            <button type="button" @click="closeEditModal" class="w-1/2 py-2 px-4 bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium rounded-lg text-xs md:text-sm transition">Cancel</button>
            <button type="submit" :disabled="editFormLoading" class="w-1/2 py-2 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-lg text-xs md:text-sm transition disabled:opacity-50">
              {{ editFormLoading ? 'Updating...' : 'Save Changes' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </div>
</template>

<!-- <script setup>
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
  // Month ya Year change hote hi automatic API hit ho jayegi
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
  // 🎤 Automated Urdu/English Voice Intent Module
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
    recognition.lang = 'ur-PK'; 
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
          Swal.fire('Error', 'Failed to allocate funds via API.', 'error');
        }
      }
    });
  };
</script> -->

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