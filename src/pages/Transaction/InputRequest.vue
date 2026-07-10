<template>
  <div class="q-pa-md">
    <q-card class="tw-shadow-lg tw-rounded-lg tw-overflow-hidden">
      <!-- Header -->
      <q-card-section class="tw-py-4" style="background-color: #1e3a4c">
        <div class="tw-flex tw-items-center tw-gap-3">
          <q-icon name="request_page" size="24px" class="tw-text-white" />
          <div>
            <div class="text-h6 tw-text-white tw-font-semibold tw-mb-1">
              {{ isEditMode ? 'Edit Request Data' : 'Input Request Data' }}
            </div>
            <div class="tw-flex tw-items-center tw-gap-1 tw-text-white tw-text-xs tw-opacity-90">
              <q-icon name="home" size="12px"/>
              <q-icon name="chevron_right" size="12px"/>
              <span>Transaction</span>
              <q-icon name="chevron_right" size="12px"/>
              <span>{{ isEditMode ? 'Edit Request' : 'Input Request' }}</span>
            </div>
          </div>
        </div>
      </q-card-section>
      
      <q-separator />
      
      <!-- Form Section -->
      <q-card-section class="tw-bg-slate-50 tw-p-6">
        <q-form @submit="handleSubmit" ref="formRef">
          <div class="tw-bg-white tw-p-6 tw-rounded-lg tw-shadow-sm">
            <!-- Basic Info -->
            <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4 tw-mb-6">
              <!-- Left Column -->
              <div class="tw-space-y-4">
                <q-select
                  v-model="form.bu_id"
                  :options="listBU"
                  option-value="bu_id"
                  option-label="bu_name"
                  emit-value
                  map-options
                  outlined
                  dense
                  label="Business Unit"
                  :rules="[val => !!val || 'Business Unit is required']"
                  @update:model-value="onBUChange"
                  class="tw-rounded"
                  clearable
                >
                  <template v-slot:prepend>
                    <q-icon name="business" color="blue-6" size="20px"/>
                  </template>
                  <template v-slot:label>
                    Business Unit <span class="tw-text-red-600">*</span>
                  </template>
                </q-select>

                <q-select
                  v-model="form.requestee_ids"
                  :options="listEmployees"
                  option-value="employee_id"
                  option-label="employee_name"
                  emit-value
                  map-options
                  multiple
                  outlined
                  dense
                  label="Requestee"
                  :rules="[val => val && val.length > 0 || 'Requestee is required']"
                  lazy-rules
                  @update:model-value="onRequesteeChange"
                  class="tw-rounded"
                  use-chips
                >
                  <template v-slot:prepend>
                    <q-icon name="people" color="blue-6" size="20px"/>
                  </template>
                  <template v-slot:label>
                    Requestee <span class="tw-text-red-600">*</span>
                  </template>
                </q-select>

                <q-input
                  v-model="form.judul"
                  outlined
                  dense
                  label="Judul"
                  :rules="[val => !!val || 'Judul is required']"
                  class="tw-rounded"
                >
                  <template v-slot:prepend>
                    <q-icon name="title" color="blue-6" size="20px"/>
                  </template>
                  <template v-slot:label>
                    Judul <span class="tw-text-red-600">*</span>
                  </template>
                </q-input>
                
                <div class="tw-flex tw-gap-2">
                  <q-input
                    v-model="form.periode_awal"
                    outlined
                    dense
                    type="date"
                    label="Periode Awal"
                    :rules="[
                      val => !!val || 'Periode awal is required',
                      val => !form.periode_akhir || val <= form.periode_akhir || 'Periode awal tidak boleh lebih besar dari periode akhir'
                    ]"
                    lazy-rules
                    class="tw-flex-1 tw-rounded"
                  >
                    <template v-slot:prepend>
                      <q-icon name="event" color="blue-6" size="20px"/>
                    </template>
                    <template v-slot:label>
                      Periode Awal <span class="tw-text-red-600">*</span>
                    </template>
                  </q-input>
                  
                  <q-input
                    v-model="form.periode_akhir"
                    outlined
                    dense
                    type="date"
                    label="Periode Akhir"
                    :rules="[
                      val => !!val || 'Periode akhir is required',
                      val => !form.periode_awal || val >= form.periode_awal || 'Periode akhir tidak boleh lebih kecil dari periode awal'
                    ]"
                    lazy-rules
                    class="tw-flex-1 tw-rounded"
                  >
                    <template v-slot:label>
                      Periode Akhir <span class="tw-text-red-600">*</span>
                    </template>
                  </q-input>
                </div>
              </div>
              
              <!-- Right Column -->
              <div class="tw-space-y-4">
                <q-select
                  v-model="form.divisi"
                  :options="listDivisi"
                  option-value="div_id"
                  option-label="div_nama"
                  emit-value
                  map-options
                  outlined
                  dense
                  label="Divisi"
                  :rules="[val => !!val || 'Divisi is required']"
                  @update:model-value="onDivisiChange"
                  class="tw-rounded"
                >
                  <template v-slot:prepend>
                    <q-icon name="account_tree" color="blue-6" size="20px"/>
                  </template>
                  <template v-slot:label>
                    Divisi <span class="tw-text-red-600">*</span>
                  </template>
                </q-select>
                
                <q-input
                  v-model="form.requestee_emails"
                  outlined
                  dense
                  label="Email Requestee"
                  readonly
                  class="tw-rounded tw-bg-slate-50"
                >
                  <template v-slot:prepend>
                    <q-icon name="email" color="blue-6" size="20px"/>
                  </template>
                </q-input>
                
                <q-input
                  v-model="form.jabatan"
                  outlined
                  dense
                  label="Jabatan"
                  readonly
                  class="tw-rounded tw-bg-slate-50"
                >
                  <template v-slot:prepend>
                    <q-icon name="work" color="blue-6" size="20px"/>
                  </template>
                </q-input>
              </div>
            </div>
            
            <q-separator class="tw-my-6" />
            
            <!-- Points Table -->
            <div class="tw-mb-4">
              <div class="tw-flex tw-items-center tw-justify-between tw-mb-3">
                <h6 class="tw-text-lg tw-font-semibold tw-text-slate-700 tw-m-0">Request Details</h6>
                <!-- Hide add/delete buttons in edit mode -->
                <div v-if="!isEditMode" class="tw-space-x-2">
                  <q-btn
                    unelevated
                    color="teal-6"
                    label="Add Perihal"
                    icon="add"
                    size="sm"
                    @click="addPoint"
                    class="tw-font-semibold"
                  />
                  <q-btn
                    unelevated
                    color="red-6"
                    label="Delete Perihal"
                    icon="remove"
                    size="sm"
                    @click="deletePoint"
                    class="tw-font-semibold"
                    :disable="form.points.length === 0"
                  />
                </div>
              </div>
              
              <!-- Points List -->
              <div v-if="form.points.length === 0" class="tw-text-center tw-py-8 tw-text-slate-400">
                <q-icon name="info" size="48px" class="tw-mb-2"/>
                <p>Belum ada perihal request. Klik "Add Perihal" untuk menambahkan.</p>
              </div>
              
              <div v-for="(point, pointIndex) in form.points" :key="`point-${pointIndex}`" class="tw-mb-6 tw-border tw-border-slate-200 tw-rounded-lg tw-p-4 tw-bg-white">
                <!-- Point Header -->
                <div class="tw-flex tw-items-start tw-gap-3 tw-mb-3">
                  <div class="tw-flex-shrink-0 tw-w-8 tw-h-8 tw-bg-teal-600 tw-text-white tw-rounded-full tw-flex tw-items-center tw-justify-center tw-font-bold">
                    {{ pointIndex + 1 }}
                  </div>
                  <q-input
                    v-model="point.judul"
                    outlined
                    dense
                    type="textarea"
                    label="Perihal Request Data"
                    :rules="[val => !!val || 'Perihal is required']"
                    class="tw-flex-1"
                    rows="2"
                  />
                </div>
                
                <!-- Lines Table -->
                <div class="tw-ml-11">
                  <table class="tw-w-full tw-border-collapse tw-mb-3">
                    <thead>
                      <tr class="tw-bg-slate-100">
                        <!-- Hide checkbox column in edit mode -->
                        <th v-if="!isEditMode" class="tw-border tw-border-slate-300 tw-p-2 tw-w-8">
                          <q-checkbox v-model="point.selectAll" @update:model-value="toggleSelectAllLines(pointIndex)" dense />
                        </th>
                        <th class="tw-border tw-border-slate-300 tw-p-2 tw-text-left">Deskripsi</th>
                        <th class="tw-border tw-border-slate-300 tw-p-2 tw-w-32">Due Date</th>
                        <th class="tw-border tw-border-slate-300 tw-p-2 tw-w-48">Email Notifikasi</th>
                        <th class="tw-border tw-border-slate-300 tw-p-2 tw-w-32">Attachment</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr v-for="(line, lineIndex) in point.lines" :key="`line-${pointIndex}-${lineIndex}`">
                        <!-- Hide checkbox column in edit mode -->
                        <td v-if="!isEditMode" class="tw-border tw-border-slate-300 tw-p-2 tw-text-center">
                          <q-checkbox v-model="line.selected" dense />
                        </td>
                        <td class="tw-border tw-border-slate-300 tw-p-2">
                          <q-input
                            v-model="line.deskripsi"
                            outlined
                            dense
                            type="textarea"
                            :rules="[val => !!val || 'Deskripsi is required']"
                            rows="2"
                          />
                        </td>
                        <td class="tw-border tw-border-slate-300 tw-p-2">
                          <q-input
                            v-model="line.due_date"
                            outlined
                            dense
                            type="date"
                            :rules="[val => !!val || 'Due date is required']"
                          />
                        </td>
                        <td class="tw-border tw-border-slate-300 tw-p-2">
                          <q-input
                            v-model="line.email_notif"
                            outlined
                            dense
                            type="email"
                            placeholder="Optional"
                          />
                        </td>
                        <td class="tw-border tw-border-slate-300 tw-p-2 tw-max-w-xs">
                          <div class="tw-overflow-hidden">
                            <q-file
                              v-model="line.files"
                              outlined
                              dense
                              multiple
                              max-files="5"
                              accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.jpeg,.png,.zip,.rar"
                              counter
                              class="attachment-file-input"
                            >
                              <template v-slot:prepend>
                                <q-icon name="attach_file" />
                              </template>
                              <template v-slot:hint v-if="line.files && line.files.length > 0">
                                <div class="tw-text-xs">
                                  <div v-for="(file, idx) in line.files" :key="idx" class="tw-truncate" :title="file.name">
                                    {{ file.name }}
                                  </div>
                                </div>
                              </template>
                            </q-file>
                            <!-- Custom tooltip for selected files -->
                            <!-- <div v-if="line.files && line.files.length > 0" class="tw-mt-1">
                              <q-badge 
                                v-for="(file, idx) in line.files" 
                                :key="`badge-${idx}`"
                                color="blue-grey-5"
                                class="tw-mr-1 tw-mb-1 tw-max-w-[140px] tw-truncate tw-cursor-help"
                              >
                                <span class="tw-truncate">{{ file.name }}</span>
                                <q-tooltip class="tw-bg-slate-800 tw-text-xs" :offset="[0, 8]">
                                  {{ file.name }}
                                </q-tooltip>
                              </q-badge>
                            </div> -->
                          </div>
                          <!-- Show existing files in edit mode -->
                          <div v-if="isEditMode && line.existingFiles" class="tw-mt-2 tw-text-xs tw-text-slate-600">
                            <div class="tw-font-semibold">Existing files:</div>
                            <div v-for="(filename, idx) in line.existingFiles.split(',')" :key="idx" class="tw-ml-2 tw-truncate tw-cursor-help" :title="filename">
                              - {{ filename }}
                              <q-tooltip class="tw-bg-slate-800 tw-text-xs" :offset="[0, 8]">
                                {{ filename }}
                              </q-tooltip>
                            </div>
                            <div class="tw-text-amber-600 tw-mt-1">
                              <q-icon name="info" size="14px" />
                              Upload new files to replace existing
                            </div>
                          </div>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                  
                  <!-- Hide add/delete desc buttons in edit mode -->
                  <div v-if="!isEditMode" class="tw-space-x-2">
                    <q-btn
                      unelevated
                      color="teal-5"
                      label="Add Desc"
                      icon="add"
                      size="sm"
                      @click="addLine(pointIndex)"
                    />
                    <q-btn
                      unelevated
                      color="red-5"
                      label="Del Desc"
                      icon="remove"
                      size="sm"
                      @click="deleteSelectedLines(pointIndex)"
                      :disable="!hasSelectedLines(pointIndex)"
                    />
                  </div>
                </div>
              </div>
            </div>
            
            <q-separator class="tw-my-6" />
            
            <!-- Approval Chain -->
            <div class="tw-mb-6">
              <h6 class="tw-text-lg tw-font-semibold tw-text-slate-700 tw-mb-3">Request ini akan dieskalasikan ke:</h6>
              <table class="tw-w-full tw-border-collapse tw-max-w-3xl">
                <thead>
                  <tr class="tw-bg-slate-100">
                    <th class="tw-border tw-border-slate-300 tw-p-3 tw-w-16">No.</th>
                    <th class="tw-border tw-border-slate-300 tw-p-3 tw-text-left">Keterangan</th>
                    <th class="tw-border tw-border-slate-300 tw-p-3 tw-text-left">Nama</th>
                    <th class="tw-border tw-border-slate-300 tw-p-3 tw-text-left">Email</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td class="tw-border tw-border-slate-300 tw-p-3 tw-text-center">1</td>
                    <td class="tw-border tw-border-slate-300 tw-p-3">Div. Head Requestee</td>
                    <td class="tw-border tw-border-slate-300 tw-p-3">{{ approvalChain.divhead_name || '-' }}</td>
                    <td class="tw-border tw-border-slate-300 tw-p-3">{{ approvalChain.divhead_email || '-' }}</td>
                  </tr>
                  <tr>
                    <td class="tw-border tw-border-slate-300 tw-p-3 tw-text-center">2</td>
                    <td class="tw-border tw-border-slate-300 tw-p-3">Chief Requestee</td>
                    <td class="tw-border tw-border-slate-300 tw-p-3">{{ approvalChain.chief_name || '-' }}</td>
                    <td class="tw-border tw-border-slate-300 tw-p-3">{{ approvalChain.chief_email || '-' }}</td>
                  </tr>
                  <tr>
                    <td class="tw-border tw-border-slate-300 tw-p-3 tw-text-center">3</td>
                    <td class="tw-border tw-border-slate-300 tw-p-3">Direktur Requestee</td>
                    <td class="tw-border tw-border-slate-300 tw-p-3">{{ approvalChain.direktur_name || '-' }}</td>
                    <td class="tw-border tw-border-slate-300 tw-p-3">{{ approvalChain.direktur_email || '-' }}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <!-- Submit Button -->
            <div class="tw-flex tw-justify-end tw-mt-6">
              <q-btn
                unelevated
                type="submit"
                :label="isEditMode ? 'UPDATE REQUEST' : 'SEND REQUEST'"
                :icon="isEditMode ? 'save' : 'send'"
                size="md"
                :loading="loading"
                class="tw-px-8 tw-font-semibold tw-text-white"
                style="background-color: #EE3020"
              />
            </div>
          </div>
        </q-form>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, computed } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';
import { useQuasar } from 'quasar';
import { useNotify } from '../../composables/useNotify';
import { useAuthStore } from '../../stores/auth';
import { encryptMessage, decryptMessage } from '../../utils';
import dayjs from 'dayjs';

const $q = useQuasar();
const route = useRoute();
const router = useRouter();
const { success, error } = useNotify();
const authStore = useAuthStore();
const formRef = ref(null);

const loading = ref(false);
const listBU = ref([]);
const listDivisi = ref([]);
const listEmployees = ref([]);

// Edit mode detection
const isEditMode = ref(false);
const originalTemuanId = ref('');

const form = reactive({
  bu_id: '',
  divisi: null,
  judul: '',
  periode_awal: '',
  periode_akhir: '',
  requestee_ids: [],
  requestee_emails: '',
  jabatan: '',
  auditor_nik: '',
  points: []
});

const approvalChain = reactive({
  divhead_id: null,
  divhead_name: null,
  divhead_email: null,
  chief_id: null,
  chief_name: null,
  chief_email: null,
  direktur_id: null,
  direktur_name: null,
  direktur_email: null
});

// Get BU from URL or user session
onMounted(async () => {
  // Load Business Units first
  await loadBusinessUnits();
  
  // Check if we're in edit mode (temuan_id in query params)
  const temuanIdParam = route.query.temuan_id;
  if (temuanIdParam) {
    isEditMode.value = true;
    await loadTemuanData(temuanIdParam);
  } else {
    // Get BU from URL parameter (jika ada)
    const buParam = route.query.bu;
    
    if (buParam) {
      form.bu_id = buParam;
      // Load divisions if BU from URL
      await loadDivisions();
    }
  }
  
  // Get NIK from auth store or localStorage
  form.auditor_nik = authStore.user?.nik || localStorage.getItem('nik') || '';
});

const loadTemuanData = async (encryptedTemuanId) => {
  try {
    loading.value = true;
    
    const res = await axios.get(`${import.meta.env.VITE_API}transaction/getTemuanForEdit/${encryptedTemuanId}`);
    const { temuan, points, approval_chain } = res.data;
    
    // Store original temuan_id
    originalTemuanId.value = temuan.temuan_id;
    
    // Populate form with existing data
    form.bu_id = temuan.temuan_bu;
    form.divisi = temuan.temuan_div;
    form.judul = temuan.temuan_judul;
    form.periode_awal = dayjs(temuan.temuan_tglawal).format('YYYY-MM-DD');
    form.periode_akhir = dayjs(temuan.temuan_tglakhir).format('YYYY-MM-DD');
    form.requestee_ids = temuan.temuan_auditee.split(',');
    form.requestee_emails = temuan.temuan_emailauditee;
    
    // Load divisions and employees
    await loadDivisions();
    
    // Load employees for division
    const empRes = await axios.get(`${import.meta.env.VITE_API}transaction/getEmployeesByDivision`, {
      params: {
        bu_id: form.bu_id,
        div_id: form.divisi
      }
    });
    listEmployees.value = empRes.data;
    
    // Get employee data to populate jabatan
    const empDataRes = await axios.post(`${import.meta.env.VITE_API}transaction/getEmployeeData`, {
      employee_ids: form.requestee_ids
    });
    form.jabatan = empDataRes.data.jabatan;
    
    // Populate points and lines
    form.points = points.map((point, pIndex) => ({
      judul: point.list_judul,
      selectAll: false,
      lines: point.lines.map((line, lIndex) => ({
        deskripsi: line.listdet_isi,
        due_date: dayjs(line.listdet_duedate).format('YYYY-MM-DD'),
        email_notif: line.listdet_emailnotif || '',
        files: null, // Will be null for edit (show existing files separately)
        existingFiles: line.listdet_attach || '', // Store existing files
        selected: false
      }))
    }));
    
    // Populate approval chain
    if (approval_chain) {
      Object.assign(approvalChain, approval_chain);
    }
    
  } catch (err) {
    error('Failed to load request data for editing');
    console.error(err);
    // Redirect back to confirm closing if loading fails
    router.push('/transaction/confirm-closing');
  } finally {
    loading.value = false;
  }
};

const loadBusinessUnits = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API}transaction/getBusinessUnits`);
    listBU.value = res.data;
  } catch (err) {
    error('Failed to load business units');
    console.error(err);
  }
};

const onBUChange = async () => {
  // Clear dependent fields
  form.divisi = null;
  form.requestee_ids = [];
  form.requestee_emails = '';
  form.jabatan = '';
  listDivisi.value = [];
  listEmployees.value = [];
  resetApprovalChain();
  
  if (!form.bu_id) return;
  
  await loadDivisions();
};

const loadDivisions = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API}transaction/getDivisionsByBU`, {
      params: { bu_id: form.bu_id }
    });
    listDivisi.value = res.data;
  } catch (err) {
    error('Failed to load divisions');
    console.error(err);
  }
};

const onDivisiChange = async () => {
  // Clear dependent fields
  form.requestee_ids = [];
  form.requestee_emails = '';
  form.jabatan = '';
  listEmployees.value = [];
  resetApprovalChain();
  
  if (!form.divisi) return;
  
  // Load employees
  try {
    const res = await axios.get(`${import.meta.env.VITE_API}transaction/getEmployeesByDivision`, {
      params: {
        bu_id: form.bu_id,
        div_id: form.divisi
      }
    });
    listEmployees.value = res.data;
  } catch (err) {
    error('Failed to load employees');
    console.error(err);
  }
  
  // Load approval chain
  try {
    const res = await axios.get(`${import.meta.env.VITE_API}transaction/getApprovalChain`, {
      params: { div_id: form.divisi }
    });
    Object.assign(approvalChain, res.data);
  } catch (err) {
    error('Failed to load approval chain');
    console.error(err);
  }
};

const onRequesteeChange = async () => {
  if (form.requestee_ids.length === 0) {
    form.requestee_emails = '';
    form.jabatan = '';
    return;
  }
  
  try {
    const res = await axios.post(`${import.meta.env.VITE_API}transaction/getEmployeeData`, {
      employee_ids: form.requestee_ids
    });
    form.requestee_emails = res.data.email;
    form.jabatan = res.data.jabatan;
  } catch (err) {
    error('Failed to load employee data');
    console.error(err);
  }
};

const addPoint = () => {
  form.points.push({
    judul: '',
    selectAll: false,
    lines: [
      {
        deskripsi: '',
        due_date: '',
        email_notif: '',
        files: null,
        existingFiles: '',
        selected: false
      }
    ]
  });
};

const deletePoint = () => {
  if (form.points.length > 0) {
    form.points.pop();
  }
};

const addLine = (pointIndex) => {
  form.points[pointIndex].lines.push({
    deskripsi: '',
    due_date: '',
    email_notif: '',
    files: null,
    existingFiles: '',
    selected: false
  });
};

const deleteSelectedLines = (pointIndex) => {
  form.points[pointIndex].lines = form.points[pointIndex].lines.filter(line => !line.selected);
  form.points[pointIndex].selectAll = false;
  
  // Ensure at least one line remains
  if (form.points[pointIndex].lines.length === 0) {
    addLine(pointIndex);
  }
};

const toggleSelectAllLines = (pointIndex) => {
  const selectAll = form.points[pointIndex].selectAll;
  form.points[pointIndex].lines.forEach(line => {
    line.selected = selectAll;
  });
};

const hasSelectedLines = (pointIndex) => {
  return form.points[pointIndex].lines.some(line => line.selected);
};

const resetApprovalChain = () => {
  approvalChain.divhead_id = null;
  approvalChain.divhead_name = null;
  approvalChain.divhead_email = null;
  approvalChain.chief_id = null;
  approvalChain.chief_name = null;
  approvalChain.chief_email = null;
  approvalChain.direktur_id = null;
  approvalChain.direktur_name = null;
  approvalChain.direktur_email = null;
};

const handleSubmit = async () => {
  // Validate form
  const isValid = await formRef.value.validate();
  if (!isValid) {
    error('Mohon lengkapi semua field yang required');
    return;
  }
  
  if (form.points.length === 0) {
    error('Mohon tambahkan minimal 1 perihal request');
    return;
  }
  
  // Confirm before submit
  const action = isEditMode.value ? 'update' : 'mengirim';
  $q.dialog({
    title: 'Konfirmasi',
    message: `Apakah Anda yakin ingin ${action} request ini?`,
    ok: {
      push: true,
      label: 'Ya, ' + (isEditMode.value ? 'Update' : 'Kirim'),
      color: 'teal-6'
    },
    cancel: {
      push: true,
      label: 'Batal',
      color: 'grey-7'
    },
    persistent: true
  }).onOk(async () => {
    await submitForm();
  });
};

const submitForm = async () => {
  loading.value = true;
  
  try {
    // Get empid from auth store (with fallback to localStorage)
    const empid = authStore.userEmpId || localStorage.getItem('empid') || '';
    
    // Prepare FormData for file upload
    const formData = new FormData();
    
    // Add basic fields
    if (isEditMode.value) {
      formData.append('temuan_id', originalTemuanId.value);
    }
    
    formData.append('bu_id', form.bu_id);
    formData.append('div_id', form.divisi);
    formData.append('judul', form.judul);
    formData.append('periode_awal', form.periode_awal);
    formData.append('periode_akhir', form.periode_akhir);
    formData.append('requestee_ids', JSON.stringify(form.requestee_ids));
    formData.append('requestee_emails', form.requestee_emails);
    formData.append('auditor_nik', form.auditor_nik);
    formData.append('creator', encryptMessage(empid));
    
    if (!isEditMode.value) {
      formData.append('approval_chain', JSON.stringify(approvalChain));
    }
    
    // Add points with files
    formData.append('points', JSON.stringify(form.points.map(point => ({
      judul: point.judul,
      lines: point.lines.map(line => ({
        deskripsi: line.deskripsi,
        due_date: line.due_date,
        email_notif: line.email_notif,
        filesCount: line.files ? line.files.length : 0
      }))
    }))));
    
    // Add files
    form.points.forEach((point, pIndex) => {
      point.lines.forEach((line, lIndex) => {
        if (line.files && line.files.length > 0) {
          line.files.forEach((file, fIndex) => {
            formData.append(`file_${pIndex}_${lIndex}_${fIndex}`, file);
          });
        }
      });
    });
    
    const endpoint = isEditMode.value ? 'updateTemuan' : 'createTemuan';
    const res = await axios.post(
      `${import.meta.env.VITE_API}transaction/${endpoint}`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      }
    );
    
    const message = isEditMode.value 
      ? 'Request berhasil diupdate' 
      : `Request berhasil dibuat dengan ID: ${res.data.temuan_id}`;
    
    success(message);
    
    // Redirect to confirm closing page
    router.push('/transaction/confirm-closing');
    
  } catch (err) {
    error(err?.response?.data?.message || `Failed to ${isEditMode.value ? 'update' : 'create'} request`);
    console.error(err);
  } finally {
    loading.value = false;
  }
};

const resetForm = () => {
  form.divisi = null;
  form.judul = '';
  form.periode_awal = '';
  form.periode_akhir = '';
  form.requestee_ids = [];
  form.requestee_emails = '';
  form.jabatan = '';
  form.points = [];
  listEmployees.value = [];
  resetApprovalChain();
  
  if (formRef.value) {
    formRef.value.resetValidation();
  }
};
</script>

<style scoped>
/* Prevent long filename from wrapping and overflowing */
:deep(.attachment-file-input) {
  max-width: 100%;
  width: 100%;
}

:deep(.attachment-file-input .q-field__control) {
  max-width: 100%;
  min-width: 0; /* Allow flex shrink */
}

:deep(.attachment-file-input .q-field__native) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: 100%;
}

:deep(.attachment-file-input .q-field__control-container) {
  max-width: 100%;
  min-width: 0;
}

:deep(.attachment-file-input .q-field__inner) {
  max-width: 100%;
}

/* Style for file chips to prevent overflow */
:deep(.attachment-file-input .q-chip) {
  max-width: 150px;
  overflow: hidden;
}

:deep(.attachment-file-input .q-chip__content) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  display: block;
}

/* Force text content inside q-file to truncate */
:deep(.attachment-file-input .q-field__label) {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Custom badge styling for file names */
.q-badge {
  display: inline-flex;
  max-width: 140px;
}

.q-badge span {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
</style>
