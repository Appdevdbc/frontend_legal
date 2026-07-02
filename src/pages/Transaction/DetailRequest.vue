<template>
  <div class="q-pa-md">
    <q-card class="tw-shadow-lg tw-rounded-lg tw-overflow-hidden">
      <!-- Header -->
      <q-card-section class="tw-py-4" style="background-color: #1e3a4c">
        <div class="tw-flex tw-items-center tw-justify-between">
          <div class="tw-flex tw-items-center tw-gap-3">
            <q-icon name="description" size="24px" class="tw-text-white" />
            <div>
              <div class="text-h6 tw-text-white tw-font-semibold tw-mb-1">Request Detail</div>
              <div class="tw-flex tw-items-center tw-gap-1 tw-text-white tw-text-xs tw-opacity-90">
                <q-icon name="home" size="12px"/>
                <q-icon name="chevron_right" size="12px"/>
                <span>Transaction</span>
                <q-icon name="chevron_right" size="12px"/>
                <span>Detail Request</span>
              </div>
            </div>
          </div>
          <q-btn
            flat
            round
            icon="close"
            color="white"
            @click="goBack"
          />
        </div>
      </q-card-section>
      
      <q-separator />
      
      <!-- Loading State -->
      <div v-if="loading" class="tw-flex tw-justify-center tw-items-center tw-py-20">
        <q-spinner color="teal-6" size="50px" />
      </div>
      
      <!-- Content -->
      <q-card-section v-else class="tw-bg-slate-50 tw-p-6">
        <div class="tw-bg-white tw-p-6 tw-rounded-lg tw-shadow-sm">
          <!-- Request Info -->
          <div class="tw-mb-6">
            <h5 class="tw-text-xl tw-font-bold tw-text-slate-800 tw-mb-4">Request Information</h5>
            
            <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4">
              <div>
                <label class="tw-text-sm tw-font-semibold tw-text-slate-600">Request ID:</label>
                <p class="tw-text-base tw-text-slate-800">{{ temuan.temuan_id }}</p>
              </div>
              
              <div>
                <label class="tw-text-sm tw-font-semibold tw-text-slate-600">Status:</label>
                <q-badge
                  :color="temuan.temuan_status === '0' ? 'orange-5' : 'green-5'"
                  class="tw-ml-2"
                >
                  {{ temuan.temuan_status === '0' ? 'Open' : 'Closed' }}
                </q-badge>
              </div>
              
              <div>
                <label class="tw-text-sm tw-font-semibold tw-text-slate-600">Judul:</label>
                <p class="tw-text-base tw-text-slate-800">{{ temuan.temuan_judul }}</p>
              </div>
              
              <div>
                <label class="tw-text-sm tw-font-semibold tw-text-slate-600">Periode:</label>
                <p class="tw-text-base tw-text-slate-800">
                  {{ formatDate(temuan.temuan_tglawal) }} - {{ formatDate(temuan.temuan_tglakhir) }}
                </p>
              </div>
              
              <div>
                <label class="tw-text-sm tw-font-semibold tw-text-slate-600">Business Unit:</label>
                <p class="tw-text-base tw-text-slate-800">{{ temuan.temuan_bu }}</p>
              </div>
              
              <div>
                <label class="tw-text-sm tw-font-semibold tw-text-slate-600">Division:</label>
                <p class="tw-text-base tw-text-slate-800">{{ temuan.temuan_div }}</p>
              </div>
              
              <div class="md:tw-col-span-2">
                <label class="tw-text-sm tw-font-semibold tw-text-slate-600">Requestees:</label>
                <p class="tw-text-base tw-text-slate-800">{{ temuan.temuan_emailauditee }}</p>
              </div>
            </div>
          </div>
          
          <q-separator class="tw-my-6" />
          
          <!-- Request Details -->
          <div>
            <h5 class="tw-text-xl tw-font-bold tw-text-slate-800 tw-mb-4">Request Details</h5>
            
            <div v-for="(point, pIndex) in temuan.points" :key="point.list_id" class="tw-mb-6">
              <!-- Point Header -->
              <div class="tw-bg-teal-50 tw-p-4 tw-rounded-lg tw-mb-3">
                <div class="tw-flex tw-items-start tw-gap-3">
                  <div class="tw-flex-shrink-0 tw-w-8 tw-h-8 tw-bg-teal-600 tw-text-white tw-rounded-full tw-flex tw-items-center tw-justify-center tw-font-bold">
                    {{ pIndex + 1 }}
                  </div>
                  <div class="tw-flex-1">
                    <h6 class="tw-text-lg tw-font-semibold tw-text-slate-800">{{ point.list_judul }}</h6>
                    <p class="tw-text-sm tw-text-slate-600">
                      Status: 
                      <q-badge :color="point.list_status === '0' ? 'orange-5' : 'green-5'" class="tw-ml-1">
                        {{ point.list_status === '0' ? 'Open' : 'Closed' }}
                      </q-badge>
                    </p>
                  </div>
                </div>
              </div>
              
              <!-- Lines Table -->
              <div class="tw-ml-11">
                <table class="tw-w-full tw-border-collapse">
                  <thead>
                    <tr class="tw-bg-slate-100">
                      <th class="tw-border tw-border-slate-300 tw-p-3 tw-text-left" style="width: 5%">No</th>
                      <th class="tw-border tw-border-slate-300 tw-p-3 tw-text-left">Deskripsi</th>
                      <th class="tw-border tw-border-slate-300 tw-p-3 tw-text-left" style="width: 15%">Due Date</th>
                      <th class="tw-border tw-border-slate-300 tw-p-3 tw-text-left" style="width: 15%">Progress</th>
                      <th class="tw-border tw-border-slate-300 tw-p-3 tw-text-left" style="width: 10%">Status</th>
                      <th class="tw-border tw-border-slate-300 tw-p-3 tw-text-left" style="width: 15%">Attachment</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr v-for="(line, lIndex) in point.lines" :key="line.listdet_id">
                      <td class="tw-border tw-border-slate-300 tw-p-3 tw-text-center">
                        {{ pIndex + 1 }}.{{ lIndex + 1 }}
                      </td>
                      <td class="tw-border tw-border-slate-300 tw-p-3">
                        {{ line.listdet_isi }}
                        <div v-if="line.listdet_emailnotif" class="tw-text-xs tw-text-slate-500 tw-mt-1">
                          <q-icon name="email" size="12px" />
                          {{ line.listdet_emailnotif }}
                        </div>
                      </td>
                      <td class="tw-border tw-border-slate-300 tw-p-3">
                        {{ formatDate(line.listdet_duedate) }}
                      </td>
                      <td class="tw-border tw-border-slate-300 tw-p-3">
                        <q-linear-progress
                          :value="40"
                          color="teal-6"
                          class="tw-mb-1"
                        />
                        <span class="tw-text-xs">{{ 40 }}%</span>
                      </td>
                      <td class="tw-border tw-border-slate-300 tw-p-3 tw-text-center">
                        <q-badge
                          :color="getStatusColor(line.listdet_status)"
                          class="tw-text-xs"
                        >
                          {{ getStatusLabel(line.listdet_status) }}
                        </q-badge>
                      </td>
                      <td class="tw-border tw-border-slate-300 tw-p-3">
                        <div v-if="line.listdet_attach" class="tw-space-y-1">
                          <a
                            v-for="(file, fIndex) in line.listdet_attach.split(',')"
                            :key="fIndex"
                            :href="getFileURL(file)"
                            target="_blank"
                            class="tw-block tw-text-teal-600 hover:tw-underline tw-text-sm"
                          >
                            <q-icon name="attach_file" size="14px" />
                            {{ file }}
                          </a>
                        </div>
                        <span v-else class="tw-text-slate-400 tw-text-sm">-</span>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="tw-flex tw-justify-between tw-mt-6">
            <q-btn
              unelevated
              label="Back to List"
              icon="arrow_back"
              color="grey-7"
              @click="goBack"
            />
            
            <q-btn
              unelevated
              label="Print"
              icon="print"
              color="teal-6"
              @click="printDetail"
            />
          </div>
        </div>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useNotify } from '../../composables/useNotify';
import dayjs from 'dayjs';

const route = useRoute();
const router = useRouter();
const { error } = useNotify();

const loading = ref(true);
const temuan = ref({
  temuan_id: '',
  temuan_judul: '',
  temuan_tglawal: '',
  temuan_tglakhir: '',
  temuan_bu: '',
  temuan_div: '',
  temuan_emailauditee: '',
  temuan_status: '0',
  points: []
});

onMounted(async () => {
  await loadDetail();
});

const loadDetail = async () => {
  loading.value = true;
  
  try {
    const temuan_id = route.params.id;
    const res = await axios.get(`${import.meta.env.VITE_API}transaction/getTemuanDetail/${temuan_id}`);
    
    temuan.value = res.data;
    
  } catch (err) {
    error('Failed to load request detail');
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const formatDate = (date) => {
  return dayjs(date).format('DD MMM YYYY');
};

const getStatusColor = (status) => {
  switch (status) {
    case '0': return 'orange-5'; // Open
    case '1': return 'green-5';  // Closed
    case '2': return 'blue-5';   // In Progress
    default: return 'grey-5';
  }
};

const getStatusLabel = (status) => {
  switch (status) {
    case '0': return 'Open';
    case '1': return 'Closed';
    case '2': return 'In Progress';
    default: return 'Unknown';
  }
};

const getFileURL = (fileName) => {
  return `${import.meta.env.VITE_FTP_DOWNLOAD_URL}/${fileName}`;
};

const goBack = () => {
  router.push('/transaction/list-request');
};

const printDetail = () => {
  window.print();
};
</script>

<style scoped>
@media print {
  .q-btn {
    display: none !important;
  }
}
</style>
