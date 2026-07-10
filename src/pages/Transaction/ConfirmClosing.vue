<template>
  <div class="q-pa-md">
    <q-card class="tw-shadow-lg tw-rounded-lg tw-overflow-hidden">
      <!-- Header -->
      <q-card-section class="tw-py-4" style="background-color: #1e3a4c">
        <div class="tw-flex tw-items-center tw-gap-3">
          <q-icon name="check_circle" size="24px" class="tw-text-white" />
          <div>
            <div class="text-h6 tw-text-white tw-font-semibold tw-mb-1">Confirm Closing</div>
            <div class="tw-flex tw-items-center tw-gap-1 tw-text-white tw-text-xs tw-opacity-90">
              <q-icon name="home" size="12px"/>
              <q-icon name="chevron_right" size="12px"/>
              <span>Transaction</span>
              <q-icon name="chevron_right" size="12px"/>
              <span>Confirm Closing</span>
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
            <h6 class="tw-text-base tw-font-semibold tw-text-gray-700 tw-m-0">Filter Requests</h6>
          </div>
          
          <div class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4 tw-mb-4">
            <!-- Left Column -->
            <div class="tw-space-y-4">
              <q-select
                v-model="filters.bu_id"
                :options="businessUnits"
                option-value="bu_id"
                option-label="bu_name"
                emit-value
                map-options
                outlined
                dense
                label="Business Unit"
                :loading="loadingBusinessUnits"
                @update:model-value="onBUFilterChange"
                class="tw-rounded"
                clearable
              >
                <template v-slot:prepend>
                  <q-icon name="business" color="blue-6" size="20px"/>
                </template>
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      No business units available
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
              
              <q-input
                v-model="filters.judul"
                outlined
                dense
                label="Judul Request"
                placeholder="Search by title..."
                class="tw-rounded"
              >
                <template v-slot:prepend>
                  <q-icon name="title" color="blue-6" size="20px"/>
                </template>
              </q-input>
              
              <div class="tw-flex tw-gap-2">
                <q-input
                  v-model="filters.tglawal"
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
                  v-model="filters.tglakhir"
                  outlined
                  dense
                  type="date"
                  label="Periode Akhir"
                  class="tw-flex-1 tw-rounded"
                />
              </div>
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
                :loading="loadingDivisions"
                :disable="!filters.bu_id"
                class="tw-rounded"
              >
                <template v-slot:prepend>
                  <q-icon name="account_tree" color="blue-6" size="20px"/>
                </template>
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      {{ filters.bu_id ? 'No divisions available' : 'Select business unit first' }}
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
              
              <q-select
                v-model="filters.auditee"
                :options="employees"
                option-value="employee_id"
                option-label="employee_name"
                emit-value
                map-options
                outlined
                dense
                label="Requestee"
                :loading="loadingEmployees"
                :disable="!filters.div_id"
                class="tw-rounded"
              >
                <template v-slot:prepend>
                  <q-icon name="person" color="blue-6" size="20px"/>
                </template>
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey">
                      {{ filters.div_id ? 'No employees found' : 'Select division first' }}
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
          </div>
          
          <!-- Action Buttons -->
          <div class="tw-flex tw-gap-2 tw-justify-end">
            <q-btn
              outline
              color="grey-7"
              label="Reset"
              icon="refresh"
              :disable="loading"
              @click="resetFilters"
              class="tw-px-6"
            />
            <q-btn
              unelevated
              color="primary"
              label="Filter"
              icon="search"
              :loading="loading"
              @click="applyFilters"
              class="tw-px-6"
            />
          </div>
        </div>
        
        <!-- Results Table -->
        <div v-if="filtered" class="tw-bg-white tw-rounded-lg tw-shadow-sm tw-overflow-hidden">
          <div class="tw-flex tw-items-center tw-justify-between tw-p-4 tw-bg-gray-50 tw-border-b">
            <div class="tw-flex tw-items-center tw-gap-2">
              <q-icon name="list_alt" color="blue-6" size="20px"/>
              <h6 class="tw-text-base tw-font-semibold tw-text-gray-700 tw-m-0">Request List</h6>
            </div>
            <q-chip v-if="requests.length > 0" color="primary" text-color="white" size="sm">
              {{ requests.length }} {{ requests.length === 1 ? 'request' : 'requests' }}
            </q-chip>
          </div>
          
          <!-- Loading State -->
          <div v-if="loading" class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-py-16">
            <q-spinner color="primary" size="50px" />
            <p class="tw-mt-4 tw-text-gray-500">Loading requests...</p>
          </div>
          
          <!-- Empty State -->
          <div v-else-if="requests.length === 0" class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-py-16">
            <q-icon name="folder_open" size="64px" color="grey-4" />
            <p class="tw-mt-4 tw-text-gray-500">No requests found matching your filters</p>
          </div>
          
          <!-- Data Table -->
          <q-table
            v-else
            :rows="requests"
            :columns="columns"
            row-key="temuan_id"
            flat
            :pagination="{ rowsPerPage: 10 }"
            class="tw-w-full"
          >
            <template v-slot:body-cell-no="props">
              <q-td :props="props">
                {{ props.rowIndex + 1 }}
              </q-td>
            </template>
            
            <template v-slot:body-cell-temuan_tglawal="props">
              <q-td :props="props">
                {{ formatDate(props.row.temuan_tglawal) }}
              </q-td>
            </template>
            
            <template v-slot:body-cell-temuan_tglakhir="props">
              <q-td :props="props">
                {{ formatDate(props.row.temuan_tglakhir) }}
              </q-td>
            </template>
            
            <template v-slot:body-cell-status="props">
              <q-td :props="props">
                <q-badge
                  :color="props.row.temuan_status === '1' ? 'positive' : 'info'"
                  :label="props.row.status_text"
                />
              </q-td>
            </template>
            
            <template v-slot:body-cell-actions="props">
              <q-td :props="props">
                <div class="tw-flex tw-gap-1">
                  <!-- Progress Button -->
                  <q-btn
                    unelevated
                    dense
                    size="sm"
                    color="teal"
                    label="Progress"
                    @click="viewProgress(props.row.temuan_id)"
                    class="tw-text-xs"
                  />
                  
                  <!-- Lihat Button -->
                  <q-btn
                    unelevated
                    dense
                    size="sm"
                    color="teal"
                    label="Lihat"
                    @click="viewDetail(props.row.temuan_id)"
                    class="tw-text-xs"
                  />
                  
                  <!-- Edit Button (only for Open status) -->
                  <q-btn
                    v-if="props.row.temuan_status === '0'"
                    unelevated
                    dense
                    size="sm"
                    color="teal"
                    label="Edit"
                    @click="editRequest(props.row.temuan_id)"
                    class="tw-text-xs"
                  />
                  <span v-else class="tw-text-gray-400 tw-text-xs tw-px-2">-</span>
                  
                  <!-- Print Button -->
                  <q-btn
                    unelevated
                    dense
                    size="sm"
                    color="teal"
                    label="Print"
                    @click="printRequest(props.row.temuan_id)"
                    class="tw-text-xs"
                  />
                </div>
              </q-td>
            </template>
          </q-table>
        </div>
      </q-card-section>
    </q-card>
    
    <!-- Progress Modal -->
    <q-dialog v-model="showProgressModal" maximized>
      <q-card style="max-width: 1200px; width: 100%;">
        <!-- Header -->
        <q-card-section class="tw-py-3 tw-bg-gray-100 tw-border-b">
          <div class="tw-flex tw-items-center tw-justify-between">
            <div class="tw-flex tw-items-center tw-gap-2">
              <q-icon name="list_alt" size="20px" color="grey-7" />
              <span class="text-subtitle1 tw-font-semibold tw-text-gray-700">List Request</span>
            </div>
            <q-btn
              flat
              round
              dense
              icon="close"
              color="grey-7"
              @click="closeProgressModal"
            />
          </div>
        </q-card-section>
        
        <q-separator />
        
        <q-card-section v-if="loadingProgress" class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-py-16">
          <q-spinner color="primary" size="50px" />
          <p class="tw-mt-4 tw-text-gray-500">Loading progress...</p>
        </q-card-section>
        
        <q-card-section v-else class="tw-p-6 tw-bg-gray-50">
          <!-- Request Info Card -->
          <q-card flat bordered class="tw-mb-4 tw-bg-white">
            <q-card-section class="tw-p-4">
              <div class="tw-grid tw-grid-cols-2 tw-gap-x-8 tw-gap-y-3">
                <div class="tw-flex">
                  <span class="tw-text-sm tw-text-gray-600 tw-w-32">Judul</span>
                  <span class="tw-text-sm tw-font-semibold tw-text-gray-800">{{ progressData.request_info?.judul || '-' }}</span>
                </div>
                <div class="tw-flex">
                  <span class="tw-text-sm tw-text-gray-600 tw-w-32">Business Unit</span>
                  <span class="tw-text-sm tw-text-gray-800">{{ progressData.request_info?.bu_name || '-' }}</span>
                </div>
                <div class="tw-flex">
                  <span class="tw-text-sm tw-text-gray-600 tw-w-32">Periode</span>
                  <span class="tw-text-sm tw-text-gray-800">{{ progressData.request_info?.periode || '-' }}</span>
                </div>
                <div class="tw-flex">
                  <span class="tw-text-sm tw-text-gray-600 tw-w-32">Divisi</span>
                  <span class="tw-text-sm tw-text-gray-800">{{ progressData.request_info?.div_name || '-' }}</span>
                </div>
                <div class="tw-flex">
                  <span class="tw-text-sm tw-text-gray-600 tw-w-32">Status</span>
                  <q-badge :color="progressData.request_info?.status === 'Open' ? 'info' : 'positive'" :label="progressData.request_info?.status || 'Open'" />
                </div>
                <div class="tw-flex">
                  <span class="tw-text-sm tw-text-gray-600 tw-w-32">Requestee</span>
                  <span class="tw-text-sm tw-text-gray-800">{{ progressData.request_info?.requestee || '-' }}</span>
                </div>
              </div>
            </q-card-section>
          </q-card>
          
          <!-- Progress Table -->
          <q-card flat bordered class="tw-bg-white">
            <q-markup-table flat bordered>
              <thead>
                <tr class="tw-bg-gray-50">
                  <th class="text-left tw-text-xs tw-font-semibold tw-text-gray-700" style="width: 80px;">NO</th>
                  <th class="text-left tw-text-xs tw-font-semibold tw-text-gray-700">REQUEST</th>
                  <template v-if="progressData.isDetailView">
                    <th class="text-left tw-text-xs tw-font-semibold tw-text-gray-700" style="width: 200px;">NOTIFIKASI EMAIL</th>
                    <th class="text-center tw-text-xs tw-font-semibold tw-text-gray-700" style="width: 120px;">DUE DATE</th>
                    <th class="text-center tw-text-xs tw-font-semibold tw-text-gray-700" style="width: 150px;">ATTACHMENT</th>
                    <th class="text-center tw-text-xs tw-font-semibold tw-text-gray-700" style="width: 120px;">STATUS</th>
                    <th class="text-center tw-text-xs tw-font-semibold tw-text-gray-700" style="width: 150px;">FEEDBACK REQUEST</th>
                  </template>
                  <template v-else>
                    <th class="text-center tw-text-xs tw-font-semibold tw-text-gray-700" style="width: 200px;">PROGRESS UPDATE</th>
                  </template>
                </tr>
              </thead>
              <tbody>
                <template v-for="point in groupedItems" :key="`point-header-${point.list_order}`">
                  <!-- Point Header Row with Red Border -->
                  <tr class="tw-bg-blue-50" style="border-left: 3px solid #dc2626; border-top: 2px solid #dc2626; border-bottom: 2px solid #dc2626;">
                    <td class="tw-font-semibold tw-text-gray-800">{{ point.list_order }}</td>
                    <td :colspan="progressData.isDetailView ? 6 : 2" class="tw-font-semibold tw-text-gray-800">{{ point.list_judul }}</td>
                  </tr>
                  <!-- Detail Rows -->
                  <tr v-for="(item, iIndex) in point.details" :key="`detail-${point.list_order}-${item.listdet_id}`" :class="iIndex % 2 === 0 ? 'tw-bg-white' : 'tw-bg-gray-50'">
                    <td class="tw-text-gray-700">{{ item.listdet_order }}</td>
                    <td class="tw-text-gray-700 tw-text-sm">{{ item.listdet_isi }}</td>
                    <template v-if="progressData.isDetailView">
                      <!-- Detail View Columns -->
                      <td class="tw-text-gray-700 tw-text-xs">
                        <div v-if="item.listdet_emailnotif" class="tw-flex tw-flex-col tw-gap-1">
                          <span v-for="(email, eIdx) in item.listdet_emailnotif.split(',')" :key="eIdx">{{ email.trim() }}</span>
                        </div>
                        <span v-else class="tw-text-gray-400">-</span>
                      </td>
                      <td class="text-center tw-text-gray-700 tw-text-sm">
                        {{ item.listdet_duedate ? formatDate(item.listdet_duedate) : '-' }}
                      </td>
                      <td class="text-center">
                        <a v-if="item.listdet_attach" :href="getFileUrl(item.listdet_attach)" target="_blank" class="tw-text-blue-600 hover:tw-underline tw-text-xs">
                          <q-icon name="attach_file" size="14px" class="tw-mr-1" />
                          View File
                        </a>
                        <span v-else class="tw-text-gray-400">-</span>
                      </td>
                      <td class="text-center">
                        <q-badge
                          :color="item.listdet_status === '1' ? 'positive' : 'negative'"
                          :label="item.listdet_status === '1' ? 'Completed' : 'Open'"
                        />
                      </td>
                      <td class="text-center">
                        <!-- Always show feedback button regardless of status -->
                        <q-btn
                          unelevated
                          dense
                          size="sm"
                          color="teal"
                          label="Feedback"
                          @click="giveFeedback(item.listdet_id)"
                          class="tw-text-xs"
                        />
                      </td>
                    </template>
                    <template v-else>
                      <!-- Progress View Column -->
                      <td class="text-center">
                        <div v-if="item.listdet_status === '1'" class="tw-bg-green-500 tw-text-white tw-py-1 tw-px-3 tw-rounded tw-text-sm tw-font-semibold">
                          100%
                        </div>
                        <div v-else-if="item.listdet_progress && parseInt(item.listdet_progress) > 0" class="tw-bg-orange-500 tw-text-white tw-py-1 tw-px-3 tw-rounded tw-text-sm tw-font-semibold">
                          {{ parseInt(item.listdet_progress) }}%
                        </div>
                        <div v-else class="tw-bg-red-500 tw-text-white tw-py-1 tw-px-3 tw-rounded tw-text-sm tw-font-semibold tw-flex tw-items-center tw-justify-center tw-gap-1">
                          <q-icon name="close" size="16px" />
                          0%
                        </div>
                      </td>
                    </template>
                  </tr>
                </template>
              </tbody>
            </q-markup-table>
          </q-card>
        </q-card-section>
      </q-card>
    </q-dialog>
    
    <!-- Feedback Modal -->
    <q-dialog v-model="showFeedbackModal" maximized>
      <q-card style="max-width: 1000px; width: 100%;">
        <!-- Header -->
        <q-card-section class="tw-py-3 tw-bg-gray-100 tw-border-b">
          <div class="tw-flex tw-items-center tw-justify-between">
            <div class="tw-flex tw-items-center tw-gap-2">
              <q-icon name="feedback" size="20px" color="grey-7" />
              <span class="text-subtitle1 tw-font-semibold tw-text-gray-700">Feedback Request</span>
            </div>
            <q-btn
              flat
              round
              dense
              icon="close"
              color="grey-7"
              @click="closeFeedbackModal"
            />
          </div>
        </q-card-section>
        
        <q-separator />
        
        <q-card-section v-if="loadingFeedback" class="tw-flex tw-flex-col tw-items-center tw-justify-center tw-py-16">
          <q-spinner color="primary" size="50px" />
          <p class="tw-mt-4 tw-text-gray-500">Loading feedback data...</p>
        </q-card-section>
        
        <q-card-section v-else class="tw-p-6 tw-bg-gray-50">
          <!-- Request Info Card -->
          <q-card flat bordered class="tw-mb-4 tw-bg-white">
            <q-card-section class="tw-p-4">
              <div class="tw-space-y-3">
                <!-- Row 1: Judul Request and Due Date -->
                <div class="tw-grid tw-grid-cols-2 tw-gap-x-8">
                  <div class="tw-flex tw-gap-2">
                    <span class="tw-text-sm tw-text-gray-600 tw-w-28 tw-flex-shrink-0">Judul Request</span>
                    <span class="tw-text-sm tw-font-medium tw-text-gray-800">{{ feedbackData.detail_info?.temuan_judul || '-' }}</span>
                  </div>
                  <div class="tw-flex tw-gap-2">
                    <span class="tw-text-sm tw-text-gray-600 tw-w-24 tw-flex-shrink-0">Due Date</span>
                    <span class="tw-text-sm tw-text-gray-800">{{ feedbackData.detail_info?.listdet_duedate ? formatDate(feedbackData.detail_info.listdet_duedate) : '-' }}</span>
                  </div>
                </div>
                
                <!-- Row 2: Perihal and Status -->
                <div class="tw-grid tw-grid-cols-2 tw-gap-x-8">
                  <div class="tw-flex tw-gap-2">
                    <span class="tw-text-sm tw-text-gray-600 tw-w-28 tw-flex-shrink-0">Perihal</span>
                    <span class="tw-text-sm tw-text-gray-800 tw-break-words tw-flex-1">{{ feedbackData.detail_info?.list_judul || '-' }}</span>
                  </div>
                  <div class="tw-flex tw-gap-2">
                    <span class="tw-text-sm tw-text-gray-600 tw-w-24 tw-flex-shrink-0">Status</span>
                    <q-badge :color="feedbackData.detail_info?.listdet_status === '1' ? 'positive' : 'info'" :label="feedbackData.detail_info?.listdet_status === '1' ? 'Closed' : 'Open'" />
                  </div>
                </div>
                
                <!-- Row 3: Deskripsi (Full Width) -->
                <div class="tw-flex tw-gap-2">
                  <span class="tw-text-sm tw-text-gray-600 tw-w-28 tw-flex-shrink-0">Deskripsi</span>
                  <span class="tw-text-sm tw-text-gray-800 tw-break-words tw-flex-1">{{ feedbackData.detail_info?.listdet_isi || '-' }}</span>
                </div>
                
                <!-- Row 4: Attachment -->
                <div class="tw-flex tw-gap-2">
                  <span class="tw-text-sm tw-text-gray-600 tw-w-28 tw-flex-shrink-0">Attachment</span>
                  <div class="tw-flex tw-flex-col tw-gap-1">
                    <a v-if="feedbackData.detail_info?.listdet_attach" :href="getFileUrl(feedbackData.detail_info.listdet_attach)" target="_blank" class="tw-text-blue-600 hover:tw-underline tw-text-sm">
                      {{ feedbackData.detail_info.listdet_attach }}
                    </a>
                    <span v-else class="tw-text-gray-400 tw-text-sm">-</span>
                  </div>
                </div>
              </div>
            </q-card-section>
          </q-card>
          
          <!-- Feedback Form - Show for both Open and Completed status -->
          <q-card flat bordered class="tw-mb-4 tw-bg-white">
            <q-card-section class="tw-p-4">
              <div class="tw-mb-4">
                <label class="tw-block tw-text-sm tw-font-bold tw-text-gray-700 tw-mb-2 tw-uppercase">Feedback</label>
                <q-input
                  v-model="feedbackForm.message"
                  type="textarea"
                  outlined
                  placeholder="Enter your feedback here..."
                  rows="5"
                  class="tw-w-full"
                  :readonly="feedbackData.detail_info?.listdet_status === '1'"
                />
              </div>
              
              <!-- Only show file upload and progress for Open items -->
              <div v-if="feedbackData.detail_info?.listdet_status === '0'" class="tw-grid tw-grid-cols-1 md:tw-grid-cols-2 tw-gap-4 tw-mb-4">
                <div>
                  <q-file
                    v-model="feedbackForm.files"
                    outlined
                    dense
                    multiple
                    label="Choose Files"
                    accept="*/*"
                    counter
                  >
                    <template v-slot:prepend>
                      <q-icon name="attach_file" />
                    </template>
                  </q-file>
                </div>
                <div class="tw-flex tw-items-center tw-gap-2">
                  <label class="tw-text-sm tw-font-semibold tw-text-gray-700 tw-whitespace-nowrap">Progress:</label>
                  <q-input
                    v-model.number="feedbackForm.progress"
                    type="number"
                    outlined
                    dense
                    min="0"
                    max="99"
                    @keyup="validateProgress"
                    class="tw-w-20"
                    :rules="[val => val >= 0 && val <= 99 || 'Progress must be 0-99']"
                  />
                  <span class="tw-text-xs tw-text-gray-500 tw-whitespace-nowrap">% **maximum input: 99%</span>
                </div>
              </div>
              
              <!-- Show buttons only for Open status -->
              <div v-if="feedbackData.detail_info?.listdet_status === '0'" class="tw-flex tw-justify-end tw-gap-3">
                <q-btn
                  unelevated
                  label="CONFIRM CLOSING"
                  :loading="savingFeedback"
                  @click="confirmClosingItem"
                  class="tw-px-6 tw-text-white"
                  style="background-color: #EE3020"
                />
                <q-btn
                  unelevated
                  label="SEND"
                  :loading="savingFeedback"
                  @click="submitFeedback"
                  class="tw-px-10 tw-text-white"
                  style="background-color: #EE3020"
                />
              </div>
              
              <!-- Message for Completed items -->
              <div v-else class="tw-text-center tw-py-2">
                <q-badge color="positive" label="This item has been completed" />
                <p class="tw-text-sm tw-text-gray-500 tw-mt-2">You can still view feedback history below</p>
              </div>
            </q-card-section>
          </q-card>
          
          <!-- Feedback History -->
          <q-card flat bordered class="tw-bg-white">
            <q-card-section class="tw-p-4">
              <h6 class="tw-text-base tw-font-semibold tw-text-gray-700 tw-mb-4">History</h6>
              
              <div v-if="feedbackData.feedback_history && feedbackData.feedback_history.length > 0" class="tw-space-y-4">
                <div v-for="(feedback, idx) in feedbackData.feedback_history" :key="idx" class="tw-border-b tw-border-gray-200 tw-pb-4 last:tw-border-b-0">
                  <div class="tw-flex tw-items-start tw-gap-4">
                    <div class="tw-flex-shrink-0">
                      <q-avatar size="60px" color="grey-4">
                        <img v-if="feedback.employee_photo" :src="`http://arsip.djabesmen.net/photo/${feedback.map_bu_id}/${feedback.employee_photo}`" />
                        <q-icon v-else name="person" size="32px" color="grey-6" />
                      </q-avatar>
                    </div>
                    <div class="tw-flex-1">
                      <div class="tw-flex tw-items-center tw-justify-between tw-mb-2">
                        <span class="tw-font-semibold tw-text-gray-800">{{ feedback.employee_name }}</span>
                        <span class="tw-text-xs tw-text-gray-500">Posted On {{ formatDate(feedback.feedback_date) }}</span>
                      </div>
                      <p class="tw-text-sm tw-text-gray-700 tw-mb-2">{{ feedback.feedback_isi }}</p>
                      <div v-if="feedback.feedback_attach" class="tw-text-xs tw-text-gray-600">
                        <span class="tw-font-semibold">Attachment: </span>
                        <span v-for="(file, fIdx) in feedback.feedback_attach.split(',')" :key="fIdx">
                          <a :href="getFileUrl(file.trim())" target="_blank" class="tw-text-blue-600 hover:tw-underline">{{ file.trim() }}</a>
                          <span v-if="fIdx < feedback.feedback_attach.split(',').length - 1">, </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div v-else class="tw-text-center tw-py-8 tw-text-gray-500">
                No feedback history yet
              </div>
            </q-card-section>
          </q-card>
        </q-card-section>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
/* eslint-disable vue/no-v-for-template-key */
import { ref, reactive, onMounted, computed, watch } from 'vue';
import { useRouter } from 'vue-router';
import { useQuasar } from 'quasar';
import axios from 'axios';
import { useAuthStore } from '../../stores/auth';
import dayjs from 'dayjs';
import { encryptMessage } from '../../utils';

const router = useRouter();
const $q = useQuasar();
const authStore = useAuthStore();

// State
const loading = ref(false);
const loadingBusinessUnits = ref(false);
const loadingDivisions = ref(false);
const loadingEmployees = ref(false);
const loadingProgress = ref(false);
const loadingFeedback = ref(false);
const savingFeedback = ref(false);
const filtered = ref(false);
const showProgressModal = ref(false);
const showFeedbackModal = ref(false);

const requests = ref([]);
const businessUnits = ref([]);
const divisions = ref([]);
const employees = ref([]);
const progressData = ref({});
const feedbackData = ref({});
const currentListdetId = ref(null);

const filters = reactive({
  judul: '',
  tglawal: '',
  tglakhir: '',
  bu_id: '',
  div_id: '',
  auditee: ''
});

const feedbackForm = reactive({
  message: '',
  progress: 0,
  files: []
});

// Table columns
const columns = [
  {
    name: 'no',
    label: 'No',
    field: 'no',
    align: 'center',
    style: 'width: 60px'
  },
  {
    name: 'bu_name',
    label: 'Business Unit',
    field: 'bu_name',
    align: 'left',
    sortable: true
  },
  {
    name: 'div_nama',
    label: 'Division',
    field: 'div_nama',
    align: 'left',
    sortable: true
  },
  {
    name: 'temuan_judul',
    label: 'Judul Request',
    field: 'temuan_judul',
    align: 'left',
    sortable: true
  },
  {
    name: 'temuan_tglawal',
    label: 'Start Date',
    field: 'temuan_tglawal',
    align: 'center',
    sortable: true
  },
  {
    name: 'temuan_tglakhir',
    label: 'End Date',
    field: 'temuan_tglakhir',
    align: 'center',
    sortable: true
  },
  {
    name: 'requestee_names',
    label: 'Requestee',
    field: 'requestee_names',
    align: 'left'
  },
  {
    name: 'status',
    label: 'Status',
    field: 'status_text',
    align: 'center',
    sortable: true
  },
  {
    name: 'actions',
    label: 'Actions',
    field: 'actions',
    align: 'center',
    style: 'width: 320px'
  }
];

// Progress table columns
const progressColumns = [
  {
    name: 'no',
    label: 'No',
    field: 'no',
    align: 'center',
    style: 'width: 80px'
  },
  {
    name: 'list_judul',
    label: 'Point',
    field: 'list_judul',
    align: 'left'
  },
  {
    name: 'listdet_deskripsi',
    label: 'Description',
    field: 'listdet_deskripsi',
    align: 'left'
  },
  {
    name: 'status',
    label: 'Status',
    field: 'listdet_status',
    align: 'center',
    style: 'width: 120px'
  }
];

// Get user's BU from localStorage
const userBU = computed(() => {
  return localStorage.getItem('domain') || authStore.user?.bu_id || '';
});

// Group items by list_id (points)
const groupedItems = computed(() => {
  if (!progressData.value.items || progressData.value.items.length === 0) {
    return [];
  }
  
  const groups = {};
  progressData.value.items.forEach(item => {
    if (!groups[item.list_order]) {
      groups[item.list_order] = {
        list_order: item.list_order,
        list_judul: item.list_judul,
        details: []
      };
    }
    groups[item.list_order].details.push(item);
  });
  
  return Object.values(groups);
});

// Methods
const formatDate = (date) => {
  if (!date) return '-';
  return dayjs(date).format('DD MMM YYYY');
};

const loadBusinessUnits = async () => {
  loadingBusinessUnits.value = true;
  try {
    const response = await axios.get(`${import.meta.env.VITE_API}transaction/getBusinessUnits`);
    businessUnits.value = response.data;
  } catch (error) {
    console.error('Error loading business units:', error);
    $q.notify({
      type: 'negative',
      message: 'Failed to load business units',
      position: 'top'
    });
  } finally {
    loadingBusinessUnits.value = false;
  }
};

const onBUFilterChange = async () => {
  // Clear dependent fields when BU changes
  filters.div_id = '';
  filters.auditee = '';
  divisions.value = [];
  employees.value = [];
  
  if (!filters.bu_id) return;
  
  await loadDivisions();
};

const loadDivisions = async () => {
  if (!filters.bu_id) return;
  
  loadingDivisions.value = true;
  try {
    const response = await axios.get(`${import.meta.env.VITE_API}transaction/getDivisionsByBU`, {
      params: { bu_id: filters.bu_id }
    });
    divisions.value = response.data;
  } catch (error) {
    console.error('Error loading divisions:', error);
    $q.notify({
      type: 'negative',
      message: 'Failed to load divisions',
      position: 'top'
    });
  } finally {
    loadingDivisions.value = false;
  }
};

const loadEmployees = async () => {
  if (!filters.bu_id || !filters.div_id) return;
  
  loadingEmployees.value = true;
  try {
    const response = await axios.get(`${import.meta.env.VITE_API}transaction/getEmployeesByDivision`, {
      params: {
        bu_id: filters.bu_id,
        div_id: filters.div_id
      }
    });
    employees.value = response.data;
  } catch (error) {
    console.error('Error loading employees:', error);
    $q.notify({
      type: 'negative',
      message: 'Failed to load employees',
      position: 'top'
    });
  } finally {
    loadingEmployees.value = false;
  }
};

const applyFilters = async () => {
  loading.value = true;
  filtered.value = true;
  
  try {
    const params = {
      ...filters
    };
    
    // Remove empty filters
    Object.keys(params).forEach(key => {
      if (params[key] === '') delete params[key];
    });
    
    const response = await axios.get(`${import.meta.env.VITE_API}transaction/getFilteredRequests`, {
      params
    });
    
    requests.value = response.data;
    
    $q.notify({
      type: 'positive',
      message: `Found ${response.data.length} request(s)`,
      position: 'top'
    });
  } catch (error) {
    console.error('Error loading requests:', error);
    $q.notify({
      type: 'negative',
      message: 'Failed to load requests',
      position: 'top'
    });
  } finally {
    loading.value = false;
  }
};

const resetFilters = () => {
  filters.judul = '';
  filters.tglawal = '';
  filters.tglakhir = '';
  filters.bu_id = ''; // Reset to empty (not user's BU)
  filters.div_id = '';
  filters.auditee = '';
  requests.value = [];
  filtered.value = false;
  divisions.value = [];
  employees.value = [];
};

const viewProgress = async (temuanId) => {
  showProgressModal.value = true;
  loadingProgress.value = true;
  
  try {
    // Find the request in current list
    const currentRequest = requests.value.find(r => r.temuan_id === temuanId);
    
    // Encrypt temuan_id before sending to API
    const encryptedTemuanId = encryptMessage(temuanId);
    const response = await axios.get(`${import.meta.env.VITE_API}transaction/getRequestProgress/${encryptedTemuanId}`);
    
    // Add request info to progress data
    progressData.value = {
      ...response.data,
      request_info: currentRequest ? {
        judul: currentRequest.temuan_judul,
        periode: `${formatDate(currentRequest.temuan_tglawal)} s/d ${formatDate(currentRequest.temuan_tglakhir)}`,
        bu_name: currentRequest.bu_name,
        div_name: currentRequest.div_nama,
        status: currentRequest.status_text,
        requestee: currentRequest.requestee_names
      } : {}
    };
  } catch (error) {
    console.error('Error loading progress:', error);
    $q.notify({
      type: 'negative',
      message: 'Failed to load request progress',
      position: 'top'
    });
  } finally {
    loadingProgress.value = false;
  }
};

const closeProgressModal = () => {
  showProgressModal.value = false;
  progressData.value = {};
};

const confirmClose = async (temuanId) => {
  // First check progress
  try {
    // Encrypt temuan_id before sending to API
    const encryptedTemuanId = encryptMessage(temuanId);
    const progressResponse = await axios.get(`${import.meta.env.VITE_API}/transaction/getRequestProgress/${encryptedTemuanId}`);
    
    if (!progressResponse.data.can_close) {
      $q.notify({
        type: 'warning',
        message: `Cannot close this request. Only ${progressResponse.data.completed_items} of ${progressResponse.data.total_items} items are completed.`,
        position: 'top',
        timeout: 3000
      });
      return;
    }
    
    $q.dialog({
      title: 'Confirm Close',
      message: 'Are you sure you want to close this request? This action marks the request as completed.',
      cancel: true,
      persistent: true
    }).onOk(async () => {
      try {
        await axios.post(`${import.meta.env.VITE_API}/transaction/confirmClosingRequest/${encryptedTemuanId}`);
        
        $q.notify({
          type: 'positive',
          message: 'Request closed successfully!',
          position: 'top'
        });
        
        // Refresh the list
        applyFilters();
      } catch (error) {
        console.error('Error closing request:', error);
        $q.notify({
          type: 'negative',
          message: error.response?.data?.message || 'Failed to close request',
          position: 'top'
        });
      }
    });
  } catch (error) {
    console.error('Error checking progress:', error);
    $q.notify({
      type: 'negative',
      message: 'Failed to check request progress',
      position: 'top'
    });
  }
};

const reopenRequest = async (temuanId) => {
  $q.dialog({
    title: 'Confirm Reopen',
    message: 'Are you sure you want to reopen this request?',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    try {
      // Encrypt temuan_id before sending to API
      const encryptedTemuanId = encryptMessage(temuanId);
      await axios.post(`${import.meta.env.VITE_API}/transaction/reopenRequest/${encryptedTemuanId}`);
      
      $q.notify({
        type: 'positive',
        message: 'Request reopened successfully!',
        position: 'top'
      });
      
      // Refresh the list
      applyFilters();
    } catch (error) {
      console.error('Error reopening request:', error);
      $q.notify({
        type: 'negative',
        message: error.response?.data?.message || 'Failed to reopen request',
        position: 'top'
      });
    }
  });
};

const viewDetail = async (temuanId) => {
  // Reuse the same modal as progress but with different data
  showProgressModal.value = true;
  loadingProgress.value = true;
  
  try {
    // Find the request in current list
    const currentRequest = requests.value.find(r => r.temuan_id === temuanId);
    
    // Encrypt temuan_id before sending to API
    const encryptedTemuanId = encryptMessage(temuanId);
    const response = await axios.get(`${import.meta.env.VITE_API}transaction/getRequestProgress/${encryptedTemuanId}`);
    
    // Add request info and mark as detail view
    progressData.value = {
      ...response.data,
      isDetailView: true, // Flag to show additional columns
      request_info: currentRequest ? {
        judul: currentRequest.temuan_judul,
        periode: `${formatDate(currentRequest.temuan_tglawal)} s/d ${formatDate(currentRequest.temuan_tglakhir)}`,
        bu_name: currentRequest.bu_name,
        div_name: currentRequest.div_nama,
        status: currentRequest.status_text,
        requestee: currentRequest.requestee_names
      } : {}
    };
  } catch (error) {
    console.error('Error loading detail:', error);
    $q.notify({
      type: 'negative',
      message: 'Failed to load request detail',
      position: 'top'
    });
  } finally {
    loadingProgress.value = false;
  }
};

const editRequest = (temuanId) => {
  // Encrypt temuan_id before passing to edit page
  const encryptedId = encryptMessage(temuanId);
  // Navigate to input-request page with temuan_id query parameter
  router.push({ name: 'InputRequest', query: { temuan_id: encryptedId } });
};

const printRequest = async (temuanId) => {
  try {
    $q.loading.show({
      message: 'Preparing print document...'
    });
    
    // Load request detail data with feedback history
    const encryptedTemuanId = encryptMessage(temuanId);
    const response = await axios.get(`${import.meta.env.VITE_API}transaction/getRequestProgress/${encryptedTemuanId}`);
    
    // Load all feedback history for this request (includes division head name)
    const feedbackResponse = await axios.get(`${import.meta.env.VITE_API}transaction/getAllFeedbackByRequest/${encryptedTemuanId}`);
    
    // Find the request in current list for basic info
    const currentRequest = requests.value.find(r => r.temuan_id === temuanId);
    
    if (!currentRequest) {
      $q.loading.hide();
      $q.notify({
        type: 'warning',
        message: 'Request data not found',
        position: 'top'
      });
      return;
    }
    
    // Merge feedback data
    const printData = {
      ...response.data,
      all_feedback: feedbackResponse.data.feedback || feedbackResponse.data || [],
      division_head_name: feedbackResponse.data.division_head_name || 'LIE POH AN'
    };
    
    // Generate print HTML
    const printContent = generatePrintHTML(currentRequest, printData);
    
    $q.loading.hide();
    
    // Open print window
    const printWindow = window.open('', '_blank', 'width=800,height=600');
    printWindow.document.write(printContent);
    printWindow.document.close();
    
    // Trigger print dialog after content loads
    printWindow.onload = () => {
      printWindow.print();
    };
    
  } catch (error) {
    $q.loading.hide();
    console.error('Error preparing print:', error);
    $q.notify({
      type: 'negative',
      message: 'Failed to prepare print document',
      position: 'top'
    });
  }
};

const generatePrintHTML = (request, progressData) => {
  const reportDate = dayjs().format('DD-MM-YYYY');
  const reportNumber = request.temuan_id || '-';
  
  // Group items by list_order (points)
  const groups = {};
  if (progressData.items) {
    progressData.items.forEach(item => {
      if (!groups[item.list_order]) {
        groups[item.list_order] = {
          list_order: item.list_order,
          list_judul: item.list_judul,
          details: []
        };
      }
      groups[item.list_order].details.push(item);
    });
  }
  
  const groupedItems = Object.values(groups);
  
  // Generate table rows
  let tableRows = '';
  groupedItems.forEach((point, idx) => {
    const pointNumber = idx + 1;
    
    // Combine all details and feedback for this point
    let combinedFeedback = '';
    
    point.details.forEach((detail) => {
      // Add detail description
      combinedFeedback += `<div style="margin-bottom: 10px; padding: 5px; background: #f9f9f9; border-left: 3px solid #2e5cb8;">
        <strong style="color: #2e5cb8; font-size: 10px;">${detail.listdet_order}. ${detail.listdet_isi}</strong>
      </div>`;
      
      // Get feedback for this specific detail
      if (progressData.all_feedback && progressData.all_feedback.length > 0) {
        const detailFeedback = progressData.all_feedback.filter(f => f.feedback_listdetid === detail.listdet_id);
        
        if (detailFeedback.length > 0) {
          detailFeedback.forEach(feedback => {
            combinedFeedback += `
              <div style="margin-bottom: 8px; padding: 5px; border-bottom: 1px solid #ddd;">
                <div style="font-size: 9px; color: #666; margin-bottom: 3px;">
                  <strong>${feedback.employee_name || 'Unknown'}</strong> - Posted On ${dayjs(feedback.feedback_date).format('DD MMM YYYY HH:mm:ss')}
                </div>
                <div style="font-size: 10px; color: #333; margin-bottom: 3px;">
                  ${feedback.feedback_isi || ''}
                </div>
                ${feedback.feedback_attach ? `
                  <div style="font-size: 9px; color: #0066cc;">
                    📎 Attachment: ${feedback.feedback_attach}
                  </div>
                ` : ''}
              </div>
            `;
          });
        }
      }
      
      // Add correspondence
      if (detail.listdet_emailnotif) {
        combinedFeedback += `<div style="font-size: 9px; color: #666; margin-top: 8px; font-style: italic;">
          Correspondence: ${detail.listdet_emailnotif}
        </div>`;
      }
    });
    
    // Get status from first detail (all should be same for the point)
    const firstDetail = point.details[0];
    const statusText = firstDetail.listdet_status === '1' ? 'Closed' : 'Open';
    const dueDateText = dayjs(firstDetail.listdet_duedate).format('DD MMM YYYY');
    
    tableRows += `
      <tr style="border: 1px solid #000;">
        <td style="border: 1px solid #000; padding: 5px; text-align: center; vertical-align: top; font-weight: bold; width: 35px; font-size: 10px;">
          ${pointNumber}
        </td>
        <td style="border: 1px solid #000; padding: 5px; vertical-align: top; width: 160px; font-size: 10px;">
          <strong>${point.list_judul}</strong>
        </td>
        <td style="border: 1px solid #000; padding: 5px; vertical-align: top; font-size: 10px;">
          ${combinedFeedback || '<span style="color: #999;">No feedback yet</span>'}
        </td>
        <td style="border: 1px solid #000; padding: 5px; text-align: center; vertical-align: top; font-size: 10px; width: 100px;">
          <div style="margin-bottom: 6px;">
            <strong>Due Date:</strong><br>${dueDateText}
          </div>
          <div>
            <strong>Status:</strong><br>
            <span style="color: ${statusText === 'Closed' ? '#059669' : '#dc2626'}; font-weight: bold;">
              ${statusText}
            </span>
          </div>
        </td>
      </tr>
    `;
  });
  
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="UTF-8">
      <title>Print Request - ${request.temuan_id}</title>
      <style>
        @media print {
          @page {
            size: A4;
            margin: 10mm 12mm;
          }
          body {
            margin: 0;
            padding: 0;
          }
          .no-print {
            display: none !important;
          }
        }
        
        body {
          font-family: Arial, sans-serif;
          font-size: 11px;
          line-height: 1.3;
          color: #000;
          padding: 15px;
          background: #fff;
        }
        
        .header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 12px;
        }
        
        .logo {
          max-width: 120px;
        }
        
        .logo img {
          max-width: 100%;
          height: auto;
          display: block;
        }
        
        .report-info {
          text-align: right;
          border: 2px solid #000;
          padding: 6px 10px;
          background: #f9f9f9;
        }
        
        .report-info div {
          margin: 2px 0;
          font-size: 10px;
        }
        
        .company-info {
          margin-bottom: 12px;
        }
        
        .company-info table {
          width: 100%;
          border-collapse: collapse;
        }
        
        .company-info td {
          padding: 3px 6px;
          vertical-align: top;
          font-size: 10px;
        }
        
        .company-info td:first-child {
          width: 140px;
          font-weight: normal;
        }
        
        .company-info td:nth-child(2) {
          width: 8px;
        }
        
        .main-table {
          width: 100%;
          border-collapse: collapse;
          border: 2px solid #000;
          margin-bottom: 15px;
        }
        
        .main-table th {
          background-color: #e0e0e0;
          border: 1px solid #000;
          padding: 6px 5px;
          text-align: center;
          font-weight: bold;
          font-size: 10px;
        }
        
        .main-table td {
          border: 1px solid #000;
          padding: 5px;
          vertical-align: top;
          font-size: 10px;
        }
        
        .signature-section {
          display: flex;
          justify-content: space-between;
          margin-top: 20px;
          page-break-inside: avoid;
        }
        
        .signature-box {
          width: 45%;
          text-align: center;
        }
        
        .signature-box div {
          margin: 3px 0;
          font-size: 10px;
        }
        
        .signature-name {
          margin-top: 40px;
          font-weight: bold;
          font-size: 10px;
        }
        
        .print-button {
          position: fixed;
          top: 10px;
          right: 10px;
          padding: 10px 20px;
          background: #2e5cb8;
          color: white;
          border: none;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          z-index: 1000;
        }
        
        .print-button:hover {
          background: #1e4a8a;
        }
      </style>
    </head>
    <body>
      <button class="print-button no-print" onclick="window.print()">🖨️ Print</button>
      
      <!-- Header -->
      <div class="header">
        <div class="logo">
          <img src="/logo.png" alt="DBC Logo" style="max-width: 150px; height: auto;" />
        </div>
        <div class="report-info">
          <div><strong>Report Number</strong> : ${reportNumber}</div>
          <div><strong>Report Date</strong> : ${reportDate}</div>
        </div>
      </div>
      
      <!-- Company Info -->
      <div class="company-info">
        <table>
          <tr>
            <td>Nama Perusahaan</td>
            <td>:</td>
            <td><strong>${request.bu_name || '-'}</strong></td>
          </tr>
          <tr>
            <td>Divisi/Department</td>
            <td>:</td>
            <td><strong>${request.div_nama || '-'}</strong></td>
          </tr>
          <tr>
            <td>Requestee</td>
            <td>:</td>
            <td><strong>${request.requestee_names || '-'}</strong></td>
          </tr>
          <tr>
            <td>Pemeriksaan</td>
            <td>:</td>
            <td><strong>${request.temuan_judul || '-'}</strong></td>
          </tr>
          <tr>
            <td>Periode</td>
            <td>:</td>
            <td><strong>${dayjs(request.temuan_tglawal).format('DD MMM YYYY')} s/d ${dayjs(request.temuan_tglakhir).format('DD MMM YYYY')}</strong></td>
          </tr>
        </table>
      </div>
      
      <!-- Main Table -->
      <table class="main-table">
        <thead>
          <tr>
            <th style="width: 40px;">No</th>
            <th style="width: 180px;">Permintaan/Temuan<br>Permasalahan Hukum</th>
            <th>Pembahasan dan Penyelesaian</th>
            <th style="width: 120px;">Status</th>
          </tr>
        </thead>
        <tbody>
          ${tableRows}
        </tbody>
      </table>
      
      <!-- Signature Section -->
      <div class="signature-section">
        <div class="signature-box">
          <div><strong>Requestee</strong></div>
          <div>Division Head</div>
          <div>&nbsp;</div>
          <div class="signature-name">(${progressData.division_head_name ? progressData.division_head_name.toUpperCase() : 'LIE POH AN'})</div>
        </div>
        <div class="signature-box">
          <div><strong>Requestor</strong></div>
          <div>Corporate Legal Division</div>
          <div>&nbsp;</div>
          <div class="signature-name">(NINONG SW)</div>
        </div>
      </div>
    </body>
    </html>
  `;
};

const getFileUrl = (filename) => {
  if (!filename) return '';
  // Construct file download URL - adjust base URL as needed
  return `${import.meta.env.VITE_FTP}${import.meta.env.VITE_FTP_DIR}${filename}`;
};

const giveFeedback = async (listdetId) => {
  // Load feedback data and open feedback modal
  await loadFeedbackData(listdetId);
  showFeedbackModal.value = true;
};

const loadFeedbackData = async (listdetId) => {
  loadingFeedback.value = true;
  currentListdetId.value = listdetId;
  
  try {
    const encryptedListdetId = encryptMessage(listdetId);
    const response = await axios.get(`${import.meta.env.VITE_API}transaction/getFeedbackData/${encryptedListdetId}`);
    feedbackData.value = response.data;
  } catch (error) {
    console.error('Error loading feedback data:', error);
    $q.notify({
      type: 'negative',
      message: 'Failed to load feedback data',
      position: 'top'
    });
  } finally {
    loadingFeedback.value = false;
  }
};

const closeFeedbackModal = () => {
  showFeedbackModal.value = false;
  feedbackForm.message = '';
  feedbackForm.progress = 0;
  feedbackForm.files = [];
  currentListdetId.value = null;
  feedbackData.value = {};
};

const submitFeedback = async () => {
  if (!feedbackForm.message.trim()) {
    $q.notify({
      type: 'warning',
      message: 'Please enter your feedback message',
      position: 'top'
    });
    return;
  }
  
  if (feedbackForm.progress < 0 || feedbackForm.progress > 99) {
    $q.notify({
      type: 'warning',
      message: 'Progress must be between 0-99%',
      position: 'top'
    });
    return;
  }
  
  savingFeedback.value = true;
  
  try {
    const empid = authStore.userEmpId || localStorage.getItem('empid') || '';

    const formData = new FormData();
    formData.append('listdet_id', currentListdetId.value);
    formData.append('message', feedbackForm.message);
    formData.append('progress', feedbackForm.progress);
    formData.append('temuan_id', feedbackData.value.detail_info?.temuan_id);
    formData.append('bu_id', feedbackData.value.detail_info?.temuan_bu);
    formData.append('div_id', feedbackData.value.detail_info?.temuan_div);
    formData.append('user', empid);
    
    // Add files
    if (feedbackForm.files && feedbackForm.files.length > 0) {
      for (let i = 0; i < feedbackForm.files.length; i++) {
        formData.append('files', feedbackForm.files[i]);
      }
    }
    
    await axios.post(`${import.meta.env.VITE_API}transaction/submitFeedback`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    $q.notify({
      type: 'positive',
      message: 'Feedback submitted successfully!',
      position: 'top'
    });
    
    closeFeedbackModal();
    
    // Reload progress data if modal is open
    if (showProgressModal.value && progressData.value.isDetailView) {
      const currentTemuanId = progressData.value.request_info?.temuan_id;
      if (currentTemuanId) {
        viewDetail(currentTemuanId);
      }
    }
  } catch (error) {
    console.error('Error submitting feedback:', error);
    $q.notify({
      type: 'negative',
      message: error.response?.data?.message || 'Failed to submit feedback',
      position: 'top'
    });
  } finally {
    savingFeedback.value = false;
  }
};

const validateProgress = (value) => {
  if (value < 0) {
    feedbackForm.progress = 0;
  } else if (value > 99) {
    feedbackForm.progress = 99;
  }
};

const confirmClosingItem = async () => {
  if (!feedbackForm.message.trim()) {
    $q.notify({
      type: 'warning',
      message: 'Please enter your feedback message',
      position: 'top'
    });
    return;
  }
  
  $q.dialog({
    title: 'Confirm Closing',
    message: 'Are you sure you want to close this item? This action will mark the item as completed.',
    cancel: true,
    persistent: true
  }).onOk(async () => {
    savingFeedback.value = true;
    
    try {
      const empid = authStore.userEmpId || localStorage.getItem('empid') || '';

      const formData = new FormData();
      formData.append('listdet_id', currentListdetId.value);
      formData.append('message', feedbackForm.message);
      formData.append('temuan_id', feedbackData.value.detail_info?.temuan_id);
      formData.append('bu_id', feedbackData.value.detail_info?.temuan_bu);
      formData.append('div_id', feedbackData.value.detail_info?.temuan_div);
      formData.append('div_id', feedbackData.value.detail_info?.temuan_div);
      formData.append('user', empid);
      
      // Add files
      if (feedbackForm.files && feedbackForm.files.length > 0) {
        for (let i = 0; i < feedbackForm.files.length; i++) {
          formData.append('files', feedbackForm.files[i]);
        }
      }
      
      await axios.post(`${import.meta.env.VITE_API}transaction/confirmClosingItem`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });
      
      $q.notify({
        type: 'positive',
        message: 'Item closed successfully!',
        position: 'top'
      });
      
      closeFeedbackModal();
      
      // Reload progress data if modal is open
      if (showProgressModal.value && progressData.value.isDetailView) {
        const currentTemuanId = progressData.value.request_info?.temuan_id;
        if (currentTemuanId) {
          viewDetail(currentTemuanId);
        }
      }
    } catch (error) {
      console.error('Error closing item:', error);
      $q.notify({
        type: 'negative',
        message: error.response?.data?.message || 'Failed to close item',
        position: 'top'
      });
    } finally {
      savingFeedback.value = false;
    }
  });
};

// Watch for division changes
watch(() => filters.div_id, (newVal) => {
  if (newVal) {
    loadEmployees();
  } else {
    employees.value = [];
    filters.auditee = '';
  }
});

// Lifecycle
onMounted(async () => {
  // Load business units first
  await loadBusinessUnits();
  
  // Leave BU filter empty by default (don't set to user's BU)
  // filters.bu_id remains '' (empty)
});
</script>

<style scoped>
/* Custom styles using Quasar and Tailwind */
</style>
