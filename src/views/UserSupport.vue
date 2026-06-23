<template>
  <div class="min-h-screen bg-gray-50/30 p-4 md:p-10 max-w-5xl mx-auto space-y-8 w-full">
    
    <!-- Header Layer Section -->
    <div class="border-b pb-5 border-gray-200/60">
      <h1 class="text-2xl font-black text-slate-900 tracking-tight flex items-center gap-2">
        <span>🎧</span> Help & Support Center
      </h1>
      <p class="text-xs text-slate-400 mt-0.5">Submit your complaints or queries. Our system admin will notify you via email upon resolution.</p>
    </div>

    <!-- Responsive Layout Splitter Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
      
      <!-- Left Column: Creation Form Block -->
      <div class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-4 lg:col-span-1">
        <h3 class="text-sm font-bold text-slate-800 flex items-center gap-1.5 border-b pb-2 border-gray-50">
          <span>📝</span> New Complaint
        </h3>
        
        <form @submit.prevent="handleCreateTicket" class="space-y-4" novalidate>
          
          <!-- Subject Input Field -->
          <div>
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Subject / Issue Title <span class="text-rose-500 font-bold">*</span>
            </label>
            <input 
              type="text" 
              v-model="form.subject"
              placeholder="e.g., Savings goal not updating"
              class="w-full text-xs p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition text-slate-800"
              :class="errors.subject ? 'border-rose-400 bg-rose-50/10 focus:ring-rose-500 focus:border-rose-500' : 'border-gray-200 bg-slate-50/50'"
            />
            <!-- Field Level Realtime Verification Banner -->
            <p v-if="errors.subject" class="text-[10px] text-rose-600 font-semibold mt-1.5 flex items-center gap-1">
              <span>⚠️</span> {{ errors.subject }}
            </p>
          </div>

          <!-- Message Textarea Field -->
          <div>
            <label class="block text-[11px] font-bold text-slate-500 uppercase tracking-wider mb-1">
              Detailed Message <span class="text-rose-500 font-bold">*</span>
            </label>
            <textarea 
              v-model="form.message"
              rows="5"
              placeholder="Describe your issue properly so administration can patch or guide you smoothly..."
              class="w-full text-xs p-3 border rounded-xl focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 focus:outline-none transition text-slate-800 leading-relaxed"
              :class="errors.message ? 'border-rose-400 bg-rose-50/10 focus:ring-rose-500 focus:border-rose-500' : 'border-gray-200 bg-slate-50/50'"
            ></textarea>
            <!-- Field Level Realtime Verification Banner -->
            <p v-if="errors.message" class="text-[10px] text-rose-600 font-semibold mt-1.5 flex items-center gap-1">
              <span>⚠️</span> {{ errors.message }}
            </p>
          </div>

          <!-- Submission Button Element Layer -->
          <button 
            type="submit" 
            :disabled="submitting"
            class="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-xs rounded-xl transition shadow-sm flex items-center justify-center space-x-1.5"
          >
            <span>🚀</span>
            <span>{{ submitting ? 'Logging Complaint...' : 'Submit Complaint' }}</span>
          </button>
        </form>
      </div>

      <!-- Right Column: Interactive History Logs Feed -->
      <div class="lg:col-span-2 space-y-4">
        <h3 class="text-sm font-bold text-slate-800 flex items-center gap-1.5 pl-1">
          <span>📜</span> Your Complaint History
        </h3>

        <!-- Async Collection Progress Loader -->
        <div v-if="loading" class="text-center py-12 bg-white rounded-2xl border border-gray-100 shadow-sm">
          <div class="inline-block animate-spin rounded-full h-6 w-6 border-2 border-indigo-600 border-t-transparent mb-1"></div>
          <p class="text-xs text-slate-400">Fetching your ticket history...</p>
        </div>

        <!-- Render Container Context -->
        <div v-else class="space-y-4">
          <div v-for="ticket in tickets" :key="ticket.id" class="bg-white p-5 rounded-2xl border border-gray-100 shadow-sm space-y-3 transition hover:border-gray-200">
            
            <div class="flex items-start justify-between gap-4">
              <div>
                <span class="text-[10px] text-slate-400 font-mono">Ticket #{{ ticket.id }} • {{ formatDate(ticket.created_at) }}</span>
                <h4 class="text-sm font-bold text-slate-800 mt-0.5">{{ ticket.subject }}</h4>
              </div>
              <span 
                :class="ticket.status === 'open' ? 'bg-amber-50 text-amber-700 border-amber-100' : 'bg-emerald-50 text-emerald-700 border-emerald-100'" 
                class="px-2 py-0.5 rounded-lg text-[10px] font-black uppercase border tracking-wide flex-shrink-0"
              >
                {{ ticket.status }}
              </span>
            </div>

            <p class="text-xs text-slate-600 bg-slate-50 p-3 rounded-xl border border-gray-100/60 leading-relaxed italic">
              "{{ ticket.message }}"
            </p>

            <!-- Conditional Admin Response Output Blocks -->
            <div v-if="ticket.status === 'Resolved' || ticket.admin_reply" class="bg-indigo-50/40 border border-indigo-100/70 p-3.5 rounded-xl space-y-1 text-xs animate-fade-in">
              <div class="text-indigo-700 font-bold flex items-center gap-1 text-[11px]">
                <span>👑</span> Official Admin Response:
              </div>
              <p class="text-slate-700 font-medium leading-relaxed whitespace-pre-line">
                {{ ticket.admin_reply || 'This issue has been evaluated and marked as resolved by system administration.' }}
              </p>
            </div>
            <div v-else class="text-[11px] text-slate-400 italic pl-1 flex items-center gap-1">
              <span>⏳</span> Awaiting administrator technical review...
            </div>

          </div>

          <!-- Empty Logging Metrics View Fallback -->
          <div v-if="tickets.length === 0" class="bg-white rounded-2xl border border-gray-100 p-12 text-center text-xs text-slate-400 font-medium shadow-sm">
            No complaints found. Your account is fully optimized and smooth!
          </div>
        </div>

      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import api from '../services/api';
import Swal from 'sweetalert2';

const loading = ref(true);
const submitting = ref(false);
const tickets = ref([]);

// Validation Track Mapping Ref State Objects
const errors = ref({});
const form = ref({ subject: '', message: '' });

// Fetch Dynamic Records Grid Collection Route
const fetchUserTickets = async () => {
  try {
    loading.value = true;
    const response = await api.get('/user/tickets');
    tickets.value = response.data;
  } catch (error) {
    console.error("Failed loading tickets log array payload:", error);
  } finally {
    loading.value = false;
  }
};

// JavaScript Pre-Validation Framework Execution Loop
const validateComplaintFormInput = () => {
  errors.value = {};
  let isValidStatus = true;

  if (!form.value.subject.trim()) {
    errors.value.subject = "The issue subject or heading label parameter is required.";
    isValidStatus = false;
  }

  if (!form.value.message.trim()) {
    errors.value.message = "The detailed message description tracking data block is required.";
    isValidStatus = false;
  } else if (form.value.message.trim().length < 10) {
    errors.value.message = "Please extend your descriptions; minimum required message depth is 10 characters.";
    isValidStatus = false;
  }

  return isValidStatus;
};

// Core Pipeline Execution Stack Flow Link
const handleCreateTicket = async () => {
  errors.value = {};

  // Halt creation framework routing if local state evaluates to failures
  if (!validateComplaintFormInput()) return;

  try {
    submitting.value = true;
    const response = await api.post('/user/tickets', form.value);
    
    await Swal.fire({ 
      title: 'Submitted Successfully! 🚀', 
      text: response.data.message || 'Your complaint parameter payload has been registered tracking index files context.', 
      icon: 'success', 
      timer: 2000, 
      showConfirmButton: false,
      customClass: { popup: 'rounded-2xl' }
    });
    
    // Clear functional model input fields 
    form.value.subject = '';
    form.value.message = '';
    
    // Trigger localized dynamic state refresh context loop pipelines
    await fetchUserTickets();
  } catch (error) {
    console.error("Pipeline trace framework ticket processing crash details:", error);

    if (error.response && error.response.status === 422) {
      // Map server response tracking array variables if present onto correct fields
      const serverValidationPayloadErrors = error.response.data.errors;
      if (serverValidationPayloadErrors.subject) errors.value.subject = serverValidationPayloadErrors.subject[0];
      if (serverValidationPayloadErrors.message) errors.value.message = serverValidationPayloadErrors.message[0];
    } else {
      // General fallthrough fallback layout alerts pipeline channel mappings
      Swal.fire({ 
        title: 'Submission Halted', 
        text: error.response?.data?.message || 'Failed to successfully route complaint parameters onto backend engines. Try again.', 
        icon: 'error', 
        confirmButtonColor: '#4f46e5',
        customClass: { popup: 'rounded-2xl' }
      });
    }
  } finally {
    submitting.value = false;
  }
};

// Helper Utility: Clean Data Presentation Context
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
};

// Application Life Tracking Execution Target Hook
onMounted(() => {
  fetchUserTickets();
});
</script>