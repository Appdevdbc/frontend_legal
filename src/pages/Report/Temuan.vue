<template>
  <div class="q-pa-md">
    <q-card class="tw-shadow-lg tw-rounded-lg tw-overflow-hidden">
      <!-- Header -->
      <q-card-section class="tw-py-4" style="background-color: #1e3a4c">
        <div class="tw-flex tw-items-center tw-gap-3">
          <q-icon name="assessment" size="24px" class="tw-text-white" />
          <div>
            <div class="text-h6 tw-text-white tw-font-semibold tw-mb-1">Report Temuan</div>
            <div class="tw-flex tw-items-center tw-gap-1 tw-text-white tw-text-xs tw-opacity-90">
              <q-icon name="home" size="12px"/>
              <q-icon name="chevron_right" size="12px"/>
              <span>Report</span>
              <q-icon name="chevron_right" size="12px"/>
              <span>Temuan</span>
            </div>
          </div>
        </div>
      </q-card-section>
      
      <q-separator />
      
      <!-- Filter Section -->
      <q-card-section class="tw-bg-slate-50 tw-p-6">
        <div class="tw-bg-white tw-p-6 tw-rounded-lg tw-shadow-sm tw-mb-6">
          <div class="tw-flex tw-items-center tw-gap-2 tw-mb-4">
            <q-icon name="filter_alt" color="blue-6" size="20px"/>
            <h6 class="tw-text-base tw-font-semibold tw-text-gray-700 tw-m-0">Filter Report</h6>
          </div>
          
          <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4 tw-mb-4">
            <!-- Left Column -->
            <div class="tw-space-y-4">
              <!-- Show BU filter only for type 2,3,5 users -->
              <q-select
                v-if="userType !== '1'"
                v-model="filters.bu_id"
                :options="businessUnits"
                option-value="bu_id"
                option-label="bu_name"
                emit-value
                map-options
                outlined
                dense
                label="Business Unit"
                :loading="loadingBU"
                @update:model-value="onBUChange"
                class="tw-rounded"
                clearable
              >
                <template v-slot:prepend>
                  <q-icon name="business" color="blue-6" size="20px"/>
                </template>
              </q-select>
              
              <q-select
                v-model="filters.judul"
                :options="judulList"
                option-value="temuan_judul"
                option-label="temuan_judul"
                emit-value
                map-options
                outlined
                dense
                label="Judul Request"
                :loading="loadingJudul"
                class="tw-rounded"
                clearable
              >
                <template v-slot:prepend>
                  <q-icon name="title" color="blue-6" size="20px"/>
                </template>
              </q-select>
            </div>
            
            <!-- Right Column -->
            <div class="tw-space-y-4">
              <q-select
                v-model="filters.div_id"
                :options="divisions"
                option-value="div_id"
                option-label="div_nama"
                emit-value
                map-options
                outlined
                dense
                label="Division"
                :loading="loadingDiv"
                :disable="userType !== '1' && !filters.bu_id"
                class="tw-rounded"
                clearable
              >
                <template v-slot:prepend>
                  <q-icon name="account_tree" color="blue-6" size="20px"/>
                </template>
              </q-select>
              
              <div class="tw-flex tw-gap-2">
                <q-input
                  v-model="filters.tgl_awal"
                  outlined
                  dense
                  type="date"
                  label="Periode Awal"
                  class="tw-flex-1 tw-rounded"
                >
                  <template v-slot:prepend>
                    <q-icon name="event" color="blue-6" size="20px"/>
                  </template>
                </q-input>
                
                <q-input
                  v-model="filters.tgl_akhir"
                  outlined
                  dense
                  type="date"
                  label="Periode Akhir"
                  class="tw-flex-1 tw-rounded"
                />
              </div>
            </div>
          </div>
          
          <div class="tw-flex tw-justify-end">
            <q-btn
              unelevated
              label="FILTER"
              icon="search"
              class="tw-px-8 tw-text-white"
              style="background-color: #EE3020"
              @click="loadReport"
              :loading="loadingReport"
            />
          </div>
        </div>
        
        <!-- Report Table -->
        <div v-if="reportData.length > 0" class="tw-bg-white tw-p-6 tw-rounded-lg tw-shadow-sm tw-mb-6">
          <div class="tw-overflow-x-auto">
            <table class="tw-w-full tw-border-collapse tw-border tw-border-slate-300">
              <thead>
                <tr class="tw-bg-slate-100">
                  <th rowspan="2" class="tw-border tw-border-slate-300 tw-p-3 tw-text-left">No.</th>
                  <th rowspan="2" class="tw-border tw-border-slate-300 tw-p-3 tw-text-left">Business Unit</th>
                  <th rowspan="2" class="tw-border tw-border-slate-300 tw-p-3 tw-text-left">Divisi</th>
                  <th rowspan="2" class="tw-border tw-border-slate-300 tw-p-3 tw-text-left">Judul Request</th>
                  <th colspan="2" class="tw-border tw-border-slate-300 tw-p-3 tw-text-center">Periode Request</th>
                  <th rowspan="2" class="tw-border tw-border-slate-300 tw-p-3 tw-text-left">Requestee</th>
                  <th colspan="5" class="tw-border tw-border-slate-300 tw-p-3 tw-text-center">Jumlah Request</th>
                </tr>
                <tr class="tw-bg-slate-100">
                  <th class="tw-border tw-border-slate-300 tw-p-3 tw-text-left">Tgl Awal</th>
                  <th class="tw-border tw-border-slate-300 tw-p-3 tw-text-left">Tgl Akhir</th>
                  <th class="tw-border tw-border-slate-300 tw-p-3 tw-text-center">Total</th>
                  <th class="tw-border tw-border-slate-300 tw-p-3 tw-text-center">Closed Before Due Date</th>
                  <th class="tw-border tw-border-slate-300 tw-p-3 tw-text-center">Closed After Due Date</th>
                  <th class="tw-border tw-border-slate-300 tw-p-3 tw-text-center">Outstanding Before Due Date</th>
                  <th class="tw-border tw-border-slate-300 tw-p-3 tw-text-center">Outstanding After Due Date</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(row, index) in reportData" :key="row.temuan_id" class="hover:tw-bg-slate-50">
                  <td class="tw-border tw-border-slate-300 tw-p-3">{{ index + 1 }}</td>
                  <td class="tw-border tw-border-slate-300 tw-p-3">{{ row.bu_name }}</td>
                  <td class="tw-border tw-border-slate-300 tw-p-3">{{ row.div_nama }}</td>
                  <td class="tw-border tw-border-slate-300 tw-p-3">{{ row.temuan_judul }}</td>
                  <td class="tw-border tw-border-slate-300 tw-p-3">{{ formatDate(row.temuan_tglawal) }}</td>
                  <td class="tw-border tw-border-slate-300 tw-p-3">{{ formatDate(row.temuan_tglakhir) }}</td>
                  <td class="tw-border tw-border-slate-300 tw-p-3">
                    <div v-for="(name, idx) in row.auditee_names" :key="idx">{{ name }}</div>
                  </td>
                  <td class="tw-border tw-border-slate-300 tw-p-3 tw-text-center">{{ row.total }}</td>
                  <td class="tw-border tw-border-slate-300 tw-p-3 tw-text-center tw-bg-blue-50">{{ row.closed }}</td>
                  <td class="tw-border tw-border-slate-300 tw-p-3 tw-text-center tw-bg-yellow-50">{{ row.closedafter }}</td>
                  <td class="tw-border tw-border-slate-300 tw-p-3 tw-text-center tw-bg-green-50">{{ row.outstanding }}</td>
                  <td class="tw-border tw-border-slate-300 tw-p-3 tw-text-center tw-bg-red-50">{{ row.outstandingafter }}</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        
        <!-- Chart Section -->
        <div v-if="reportData.length > 0" class="tw-bg-white tw-p-6 tw-rounded-lg tw-shadow-sm">
          <h6 class="tw-text-base tw-font-semibold tw-text-gray-700 tw-mb-4">Request Status Chart</h6>
          <div class="tw-relative" style="height: 500px;">
            <canvas ref="chartCanvas"></canvas>
          </div>
        </div>
        
        <!-- Empty State -->
        <div v-if="!loadingReport && reportData.length === 0 && hasFiltered" class="tw-bg-white tw-p-12 tw-rounded-lg tw-shadow-sm tw-text-center">
          <q-icon name="info" size="64px" color="grey-5" class="tw-mb-4"/>
          <p class="tw-text-gray-500 tw-text-lg">No data found. Please adjust your filters and try again.</p>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, nextTick } from 'vue';
import axios from 'axios';
import { useNotify } from '../../composables/useNotify';
import { useAuthStore } from '../../stores/auth';
import { Chart, registerables } from 'chart.js';
import dayjs from 'dayjs';

Chart.register(...registerables);

const { error } = useNotify();
const authStore = useAuthStore();

const loadingBU = ref(false);
const loadingDiv = ref(false);
const loadingJudul = ref(false);
const loadingReport = ref(false);
const hasFiltered = ref(false);

const businessUnits = ref([]);
const divisions = ref([]);
const judulList = ref([]);
const reportData = ref([]);

const userType = ref('');
const userDiv = ref('');
const userEmpId = ref('');

const chartCanvas = ref(null);
let chartInstance = null;

const filters = reactive({
  bu_id: '',
  div_id: '',
  judul: '',
  tgl_awal: '',
  tgl_akhir: ''
});

onMounted(async () => {
  // Get user info from auth store
  userType.value = authStore.user?.user_type || localStorage.getItem('user_type') || '';
  userDiv.value = authStore.user?.div_id || localStorage.getItem('div_id') || '';
  userEmpId.value = authStore.user?.empid || localStorage.getItem('empid') || '';
  
  // Load initial data
  if (userType.value !== '1') {
    await loadBusinessUnits();
  } else {
    // For type 1 users, load divisions for their div
    await loadDivisions();
  }
  
  await loadJudulList();
  
  // Auto load report on mount
  await loadReport();
});

const loadBusinessUnits = async () => {
  try {
    loadingBU.value = true;
    const res = await axios.get(`${import.meta.env.VITE_API}getBusinessUnitsReport`);
    businessUnits.value = res.data;
  } catch (err) {
    error('Failed to load business units');
    console.error(err);
  } finally {
    loadingBU.value = false;
  }
};

const loadDivisions = async () => {
  try {
    loadingDiv.value = true;
    
    if (userType.value !== '1' && !filters.bu_id) {
      divisions.value = [];
      return;
    }
    
    const bu = userType.value === '1' ? userDiv.value : filters.bu_id;
    
    const res = await axios.get(`${import.meta.env.VITE_API}getDivisionsByBUReport`, {
      params: { bu_id: bu }
    });
    divisions.value = res.data;
  } catch (err) {
    error('Failed to load divisions');
    console.error(err);
  } finally {
    loadingDiv.value = false;
  }
};

const loadJudulList = async () => {
  try {
    loadingJudul.value = true;
    const res = await axios.get(`${import.meta.env.VITE_API}getJudulTemuan`, {
      params: {
        bu_id: filters.bu_id || '',
        user_type: userType.value,
        user_div: userDiv.value
      }
    });
    judulList.value = res.data;
  } catch (err) {
    error('Failed to load judul list');
    console.error(err);
  } finally {
    loadingJudul.value = false;
  }
};

const onBUChange = async () => {
  filters.div_id = '';
  divisions.value = [];
  
  if (filters.bu_id) {
    await loadDivisions();
    await loadJudulList();
  }
};

const loadReport = async () => {
  try {
    loadingReport.value = true;
    hasFiltered.value = true;
    
    const res = await axios.get(`${import.meta.env.VITE_API}getTemuanReport`, {
      params: {
        bu_id: filters.bu_id || '',
        div_id: filters.div_id || '',
        judul: filters.judul || '',
        tgl_awal: filters.tgl_awal || '',
        tgl_akhir: filters.tgl_akhir || '',
        user_type: userType.value,
        user_div: userDiv.value,
        user_empid: userEmpId.value
      }
    });
    
    reportData.value = res.data;
    
    // Render chart after data is loaded
    if (reportData.value.length > 0) {
      await nextTick();
      renderChart();
    }
  } catch (err) {
    error('Failed to load report data');
    console.error(err);
  } finally {
    loadingReport.value = false;
  }
};

const renderChart = () => {
  if (!chartCanvas.value) return;
  
  // Destroy existing chart if it exists
  if (chartInstance) {
    chartInstance.destroy();
  }
  
  const ctx = chartCanvas.value.getContext('2d');
  
  // Prepare chart data
  const labels = reportData.value.map(row => [row.temuan_judul, row.div_nama, row.bu_name]);
  const closedData = reportData.value.map(row => row.closed);
  const closedAfterData = reportData.value.map(row => row.closedafter);
  const outstandingData = reportData.value.map(row => row.outstanding);
  const outstandingAfterData = reportData.value.map(row => row.outstandingafter);
  
  chartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Closed Before Due Date',
          data: closedData,
          backgroundColor: 'rgba(54, 162, 235, 0.8)',
          borderColor: 'rgba(54, 162, 235, 1)',
          borderWidth: 1
        },
        {
          label: 'Closed After Due Date',
          data: closedAfterData,
          backgroundColor: 'rgba(255, 206, 86, 0.8)',
          borderColor: 'rgba(255, 206, 86, 1)',
          borderWidth: 1
        },
        {
          label: 'Outstanding Before Due Date',
          data: outstandingData,
          backgroundColor: 'rgba(75, 192, 192, 0.8)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 1
        },
        {
          label: 'Outstanding After Due Date',
          data: outstandingAfterData,
          backgroundColor: 'rgba(255, 99, 132, 0.8)',
          borderColor: 'rgba(255, 99, 132, 1)',
          borderWidth: 1
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      scales: {
        x: {
          stacked: true,
          ticks: {
            autoSkip: false,
            maxRotation: 45,
            minRotation: 45
          }
        },
        y: {
          stacked: true,
          beginAtZero: true,
          ticks: {
            precision: 0
          }
        }
      },
      plugins: {
        legend: {
          position: 'top',
        },
        tooltip: {
          mode: 'index',
          intersect: false
        }
      }
    }
  });
};

const formatDate = (date) => {
  if (!date) return '-';
  return dayjs(date).format('DD MMM YYYY');
};
</script>

<style scoped>
/* Add any custom styles if needed */
</style>
