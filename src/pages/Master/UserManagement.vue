<template>
  <div class="q-pa-md">
    <q-card class="tw-shadow-lg tw-rounded-lg tw-overflow-hidden">
      <q-card-section class="tw-bg-slate-500 tw-py-4">
        <div class="tw-flex tw-items-center tw-gap-3">
          <q-icon name="people" size="24px" class="tw-text-white" />
          <div>
            <div class="text-h6 tw-text-white tw-font-semibold tw-mb-1">User Management</div>
            <div class="tw-flex tw-items-center tw-gap-1 tw-text-white tw-text-xs tw-opacity-90">
              <q-icon name="home" size="12px"/>
              <q-icon name="chevron_right" size="12px"/>
              <span>Master</span>
              <q-icon name="chevron_right" size="12px"/>
              <span>Users</span>
            </div>
          </div>
        </div>
      </q-card-section>
      <q-separator />
      <q-card-section class="tw-bg-slate-50 tw-p-0">
        <q-table
          :rows="listUser"
          :columns="columns"
          row-key="id"
          v-model:pagination="pagination"
          :rows-per-page-options="[]"
          :loading="loading"
          :filter="pagination.filter"
          @request="onRequest"
          binary-state-sort
          flat
          class="tw-bg-white"
        >
          <template v-slot:header="props">
            <q-tr :props="props" class="tw-bg-slate-700">
                <q-th
                    v-for="col in props.cols"
                    :key="col.name"
                    :props="props"
                    :class="[
                      'tw-text-white tw-font-semibold tw-text-xs tw-uppercase tw-tracking-wider tw-py-3',
                      col.name === 'aksi' ? 'sticky-column-left-header' : ''
                    ]"
                    :style="{ backgroundColor: '#1e3a4c !important', borderBottom: 'none' }"
                >
                        {{ col.label }}
                </q-th>
            </q-tr>
          </template>
          
          <template v-slot:top-left>
            <div class="tw-flex tw-items-center tw-gap-2 tw-px-3 tw-py-2">
              <q-icon name="view_headline" color="slate-600" size="18px">
                <q-tooltip class="tw-bg-slate-800 tw-text-xs">Rows per page</q-tooltip>
              </q-icon>
              <q-select
                borderless
                dense
                v-model="pagination.rowsPerPage"
                :options="[10,25,50,100]"
                @update:modelValue="updateTable"
                class="tw-min-w-[70px]"
                :style="{ fontSize: '14px' }"
              />
            </div>
          </template>
          
          <template v-slot:top-right>
            <div class="tw-flex tw-gap-3 tw-items-center">
              <q-btn
                unelevated
                color="slate-700"
                label="ADD USER"
                icon="add"
                @click="openAddDialog"
                class="tw-font-semibold tw-px-5 tw-py-2 tw-text-xs tw-rounded-md hover:tw-brightness-110 tw-transition-all"
                :style="{ backgroundColor: '#1e3a4c' }"
              />
              <q-input
                outlined
                dense
                debounce="300"
                v-model="pagination.filter"
                placeholder="Search..."
                class="tw-bg-white tw-rounded-md tw-min-w-[250px]"
                :style="{ fontSize: '14px' }"
              >
                <template v-slot:prepend>
                  <q-icon name="search" color="slate-500" size="18px" />
                </template>
              </q-input>
            </div>
          </template>
          
          <template v-slot:body-cell="props">
            <q-td :props="props" class="tw-py-3 tw-text-slate-700 tw-text-sm">
              {{ props.value || '-' }}
            </q-td>
          </template>
          
          <template v-slot:body-cell-aksi="props">
            <q-td :props="props" class="tw-py-2 tw-text-center">
              <div class="tw-flex tw-gap-2 tw-justify-center">
                <q-btn
                  unelevated
                  dense
                  color="blue-6"
                  label="Edit"
                  size="sm"
                  @click="openEditDialog(props.row)"
                  class="tw-px-4 tw-font-semibold tw-text-xs tw-rounded hover:tw-brightness-110 tw-transition-all"
                />
                <q-btn
                  unelevated
                  dense
                  color="red-6"
                  label="Delete"
                  size="sm"
                  @click="deleteUserConfirm(props.row)"
                  class="tw-px-4 tw-font-semibold tw-text-xs tw-rounded hover:tw-brightness-110 tw-transition-all"
                />
              </div>
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>

    <!-- Add/Edit Dialog -->
    <q-dialog v-model="dialogForm" transition-show="scale" transition-hide="scale">
      <q-card class="tw-w-full tw-max-w-lg tw-rounded-lg tw-shadow-2xl">
        <q-card-section class="tw-py-4 tw-px-6" :style="{ backgroundColor: '#1e3a4c' }">
          <div class="tw-text-white tw-font-semibold tw-text-lg tw-flex tw-items-center tw-gap-3">
            <q-icon name="person_add" size="24px"/>
            {{ isEdit ? 'Edit' : 'Add' }} User
          </div>
        </q-card-section>
        <q-separator/>
        <q-card-section class="tw-p-6 tw-bg-white">
          <div class="tw-space-y-4">
            <q-input
              v-model="form.nik"
              outlined
              dense
              label="NIK"
              :readonly="isEdit"
              :rules="[val => !!val || 'NIK is required']"
              @blur="!isEdit && getHrisByNIK()"
              class="tw-rounded"
            >
              <template v-slot:prepend>
                <q-icon name="badge" color="blue-6" size="20px"/>
              </template>
              <template v-slot:label>
                NIK <span class="tw-text-red-600">*</span>
              </template>
            </q-input>
            
            <q-input
              v-model="form.bu_name"
              outlined
              dense
              label="Business Unit"
              readonly
              class="tw-rounded tw-bg-slate-50"
            >
              <template v-slot:prepend>
                <q-icon name="business" color="blue-6" size="20px"/>
              </template>
            </q-input>
            
            <q-input
              v-model="form.nama_div"
              outlined
              dense
              label="Division"
              readonly
              class="tw-rounded tw-bg-slate-50"
            >
              <template v-slot:prepend>
                <q-icon name="account_tree" color="blue-6" size="20px"/>
              </template>
            </q-input>
            
            <q-input
              v-model="form.nama_dept"
              outlined
              dense
              label="Department"
              readonly
              class="tw-rounded tw-bg-slate-50"
            >
              <template v-slot:prepend>
                <q-icon name="corporate_fare" color="blue-6" size="20px"/>
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
            
            <q-input
              v-model="form.first_name"
              outlined
              dense
              label="Nama"
              readonly
              class="tw-rounded tw-bg-slate-50"
            >
              <template v-slot:prepend>
                <q-icon name="person" color="blue-6" size="20px"/>
              </template>
            </q-input>
            
            <q-input
              v-model="form.email"
              outlined
              dense
              label="Email"
              type="email"
              readonly
              class="tw-rounded tw-bg-slate-50"
            >
              <template v-slot:prepend>
                <q-icon name="email" color="blue-6" size="20px"/>
              </template>
            </q-input>
            
            <div class="tw-relative">
              <q-select
                v-model="form.role_id"
                :options="filteredRoles"
                option-value="role_id"
                option-label="role_name"
                outlined
                label="Role"
                dense
                use-input
                input-debounce="300"
                @filter="filterRoles"
                :rules="[val => val !== null || 'Role is required']"
                class="tw-rounded"
              >
                <template v-slot:prepend>
                  <q-icon name="shield" color="blue-6" size="20px"/>
                </template>
                <template v-slot:label>
                  <span>Role <span style="color: #dc2626;">*</span></span>
                </template>
                <template v-slot:no-option>
                  <q-item>
                    <q-item-section class="text-grey tw-text-center tw-text-sm">
                      No results
                    </q-item-section>
                  </q-item>
                </template>
              </q-select>
            </div>
          </div>
        </q-card-section>
        <q-separator class="tw-bg-slate-200"/>
        <q-card-actions align="right" class="tw-p-4 tw-bg-slate-50">
          <q-btn
            unelevated
            label="CANCEL"
            color="red-6"
            icon="close"
            class="tw-px-6 tw-font-semibold tw-text-xs tw-rounded"
            v-close-popup
          />
          <q-btn
            unelevated
            label="SAVE"
            icon="save"
            class="tw-px-6 tw-font-semibold tw-text-xs tw-rounded tw-text-white"
            :style="{ backgroundColor: '#1e3a4c' }"
            @click="saveData"
          />
        </q-card-actions>
      </q-card>
    </q-dialog>

    <!-- Group Assignment Dialog -->
    <q-dialog v-model="dialogGroup" transition-show="scale" transition-hide="scale">
      <q-card class="tw-w-full tw-max-w-2xl tw-rounded-lg tw-shadow-2xl">
        <q-card-section class="tw-py-4 tw-px-6" :style="{ backgroundColor: '#1e3a4c' }">
          <div class="tw-text-white tw-font-semibold tw-text-lg tw-flex tw-items-center tw-gap-3">
            <q-icon name="admin_panel_settings" size="24px"/>
            Setup User Group
          </div>
          <div class="tw-text-white tw-text-xs tw-mt-2 tw-opacity-90">
            {{ selectedUser?.account_name }} ({{ selectedUser?.account_nik }})
          </div>
        </q-card-section>
        <q-separator/>
        <q-card-section class="tw-p-6 tw-bg-white">
          <div class="tw-space-y-4">
            <div class="tw-grid tw-grid-cols-2 tw-gap-4">
              <q-select
                v-model="groupForm.bu_id"
                :options="listBU"
                option-value="value"
                option-label="label"
                emit-value
                map-options
                outlined
                dense
                label="Business Unit"
                @update:model-value="loadUserGroups"
                class="tw-rounded"
              >
                <template v-slot:prepend>
                  <q-icon name="business" color="blue-6" size="20px"/>
                </template>
              </q-select>
              
              <q-select
                v-model="groupForm.group_id"
                :options="listGroups"
                option-value="grp_id"
                option-label="grp_name"
                emit-value
                map-options
                outlined
                dense
                label="Group"
                class="tw-rounded"
              >
                <template v-slot:prepend>
                  <q-icon name="group" color="blue-6" size="20px"/>
                </template>
              </q-select>
            </div>
            
            <div>
              <q-btn
                unelevated
                color="green-6"
                label="ADD GROUP"
                icon="add"
                @click="addUserGroup"
                class="tw-font-semibold tw-px-5 tw-text-xs tw-rounded"
              />
            </div>
            
            <q-separator class="tw-my-3"/>
            
            <div>
              <div class="tw-font-semibold tw-text-slate-700 tw-mb-3 tw-text-sm">Assigned Groups:</div>
              <q-list bordered class="tw-rounded tw-border-slate-200">
                <q-item v-for="ug in userGroups" :key="ug.ugrp_id" class="tw-py-2">
                  <q-item-section avatar>
                    <q-icon name="group" color="purple-6" size="20px"/>
                  </q-item-section>
                  <q-item-section>
                    <q-item-label class="tw-text-sm tw-font-medium">{{ ug.grp_name }}</q-item-label>
                    <q-item-label caption class="tw-text-xs">{{ ug.ugrp_bu_id }}</q-item-label>
                  </q-item-section>
                  <q-item-section side>
                    <q-btn
                      round
                      dense
                      flat
                      color="red-6"
                      icon="delete"
                      size="sm"
                      @click="removeUserGroup(ug)"
                    />
                  </q-item-section>
                </q-item>
                <q-item v-if="userGroups.length === 0" class="tw-py-4">
                  <q-item-section class="tw-text-center tw-text-slate-400 tw-text-sm">
                    No groups assigned yet
                  </q-item-section>
                </q-item>
              </q-list>
            </div>
          </div>
        </q-card-section>
        <q-separator class="tw-bg-slate-200"/>
        <q-card-actions align="right" class="tw-p-4 tw-bg-slate-50">
          <q-btn
            unelevated
            label="CLOSE"
            color="grey-7"
            icon="close"
            class="tw-px-6 tw-font-semibold tw-text-xs tw-rounded"
            v-close-popup
          />
        </q-card-actions>
      </q-card>
    </q-dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive, computed } from "vue";
import axios from "axios";
import { domain, empid, spinnerBall, encrypt, decryptMessage } from "./../../utils";
import { useQuasar } from "quasar";
import { useNotify } from "./../../composables/useNotify";
import "./../../assets/styles/table.css";

const $q = useQuasar();
const { success, error } = useNotify();

// Computed property for role label with asterisk
const roleLabelHtml = computed(() => 'Role <span style="color: #dc2626;">*</span>');

const columns = [
  {
    name: "bu_name",
    required: true,
    label: "Business Unit",
    align: "left",
    field: "bu_name",
    sortable: true,
  },
  {
    name: "account_name",
    align: "left",
    label: "Nama",
    field: "account_name",
    sortable: true,
  },
  {
    name: "account_nik",
    required: true,
    label: "NIK",
    align: "left",
    field: "account_nik",
    sortable: true,
  },
  {
    name: "div_name",
    label: "Divisi",
    align: "left",
    field: "div_name",
    sortable: true,
  },
  {
    name: "role_name",
    label: "Role",
    align: "left",
    field: "role_name",
    sortable: true,
  },
  {
    name: "account_email",
    label: "Email",
    align: "left",
    field: "account_email",
    sortable: true,
  },
  {
    name: "aksi",
    required: true,
    label: "Action",
    align: "center",
    field: "aksi",
  },
];

const listUser = ref([]);
const listGroups = ref([]);
const listRoles = ref([]);
const filteredRoles = ref([]);
const listBU = ref([
  { value: 'WNR', label: 'WNR - Workshop' },
  { value: 'DFR', label: 'DFR - DBC Freight' },
  // Add more BUs as needed
]);
const userGroups = ref([]);
const loading = ref(false);
const dialogForm = ref(false);
const dialogGroup = ref(false);
const isEdit = ref(false);
const selectedUser = ref(null);

const pagination = ref({
  sortBy: "account_username",
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 0,
  filter: null,
});

const form = reactive({
  id: null,
  nik: null,
  first_name: null,
  email: null,
  emp_id: null,
  activated: true,
  role_id: null,
  bu_name: null,
  nama_div: null,
  nama_dept: null,
  jabatan: null,
});

const groupForm = reactive({
  bu_id: 'WNR',
  group_id: null,
});

const getData = async () => {
  try {
    loading.value = true;
    
    const res = await axios.get(`${import.meta.env.VITE_API}getUsers`, {
      params: pagination.value,
    });
    
    if (typeof res.data.data === "undefined") {
      listUser.value = res.data;
    } else {
      listUser.value = res.data.data;
      pagination.value.rowsNumber = res.data.pagination.total;
    }
    
    loading.value = false;
  } catch (err) {
    loading.value = false;
    error(err?.response?.data?.message || 'Failed to load data');
  }
};

const getGroups = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API}getGroups`);
    listGroups.value = res.data;
  } catch (err) {
    error('Failed to load groups');
  }
};

const getRoles = async () => {
  try {
    const res = await axios.get(`${import.meta.env.VITE_API}getRoles`);
    listRoles.value = res.data;
    filteredRoles.value = res.data; // Initialize filtered list
  } catch (err) {
    error('Failed to load roles');
  }
};

const filterRoles = (val, update) => {
  if (val === '') {
    update(() => {
      filteredRoles.value = listRoles.value;
    });
    return;
  }

  update(() => {
    const needle = val.toLowerCase();
    filteredRoles.value = listRoles.value.filter(
      role => role.role_name.toLowerCase().indexOf(needle) > -1
    );
  });
};

const getHrisByNIK = async () => {
  if (!form.nik) return;
  
  try {
    spinnerBall();
    const res = await axios.get(`${import.meta.env.VITE_API}getHrisByNIK`, {
      params: { nik: form.nik }
    });

    form.first_name = res.data.name;
    form.email = res.data.email;
    form.emp_id = decryptMessage(res.data.empid);
    form.bu_name = res.data.bu_name;
    form.nama_div = res.data.nama_div;
    form.nama_dept = res.data.nama_dept;
    form.jabatan = res.data.jabatan;
    $q.loading.hide();
  } catch (err) {
    $q.loading.hide();
    error(err?.response?.data?.message || 'User not found in HRIS');
  }
};

const openAddDialog = async () => {
  isEdit.value = false;
  resetForm();
  await getRoles();
  dialogForm.value = true;
};

const openEditDialog = async (row) => {
  isEdit.value = true;
  form.id = row.id;
  form.nik = row.account_nik;
  form.first_name = row.account_name;
  form.email = row.account_email;
  form.emp_id = row.emp_id;
  form.activated = row.account_active === 'Active';
  
  // Store account_type (this is the role_id from backend)
  const accountType = row.account_type;
  
  // Load roles first and wait for it to complete
  await getRoles();
  
  // Convert to number to ensure type matching
  const accountTypeNum = Number(accountType);
  
  // Find the role object to get the role name for display
  const selectedRole = listRoles.value.find(r => Number(r.role_id) === accountTypeNum);
  
  console.log('DEBUG - Edit Dialog:');
  console.log('Account Type (from row):', accountType, 'Type:', typeof accountType);
  console.log('Account Type Num:', accountTypeNum);
  console.log('listRoles count:', listRoles.value.length);
  console.log('Available Roles:', listRoles.value.map(r => ({ role_id: r.role_id, role_name: r.role_name })));
  console.log('Selected Role:', selectedRole);
  
  // Set role_id as the OBJECT (because q-select WITHOUT emit-value expects object)
  form.role_id = selectedRole || null;
  
  // Fetch organizational data from HRIS
  try {
    spinnerBall();
    const res = await axios.get(`${import.meta.env.VITE_API}getHrisByNIK`, {
      params: { empid: row.emp_id }
    });
    
    form.bu_name = res.data.bu_name;
    form.nama_div = res.data.nama_div;
    form.nama_dept = res.data.nama_dept;
    form.jabatan = res.data.jabatan;
    $q.loading.hide();
  } catch (err) {
    $q.loading.hide();
    console.error('Failed to fetch organizational data:', err);
    // Continue anyway, organizational fields will be empty
  }
  
  dialogForm.value = true;
};

const saveData = async () => {
  try {
    spinnerBall();
    
    const payload = {
      ...form,
      role_id: form.role_id?.role_id || form.role_id, // Extract role_id if object
      creator: empid(),
    };
    
    await axios.post(`${import.meta.env.VITE_API}saveUserData`, payload);
    
    dialogForm.value = false;
    success(isEdit.value ? 'User updated successfully' : 'User added successfully');
    onRequest({
      pagination: pagination.value,
    });
    $q.loading.hide();
  } catch (err) {
    $q.loading.hide();
    error(err?.response?.data?.message || 'Failed to save user');
  }
};

const toggleActivation = async (row) => {
  const isActive = row.account_active === 'Active';
  
  $q.dialog({
    title: "Confirm",
    message: `Are you sure you want to ${isActive ? 'deactivate' : 'activate'} user <strong>${row.account_name}</strong>?`,
    html: true,
    class: `side-${domain()} tw-rounded-2xl`,
    ok: {
      push: true,
      color: isActive ? "red-7" : "green-6",
      label: isActive ? "Deactivate" : "Activate",
      icon: isActive ? "block" : "check_circle",
      class: "tw-font-semibold tw-px-6 tw-rounded-lg"
    },
    cancel: {
      push: true,
      color: 'grey-7',
      label: "Cancel",
      icon: "cancel",
      class: "tw-font-semibold tw-px-6 tw-rounded-lg"
    },
    persistent: true,
  }).onOk(async () => {
    try {
      spinnerBall();
      await axios.post(`${import.meta.env.VITE_API}toggleUserActivation`, {
        nik: row.account_nik,
        account_active: isActive ? 'Inactive' : 'Active',
        creator: empid(),
      });
      success(`User ${isActive ? 'deactivated' : 'activated'} successfully`);
      onRequest({
        pagination: pagination.value,
      });
      $q.loading.hide();
    } catch (err) {
      $q.loading.hide();
      error(err?.response?.data?.message || 'Failed to update user status');
    }
  });
};

const openGroupDialog = async (row) => {
  selectedUser.value = row;
  groupForm.bu_id = 'WNR';
  groupForm.group_id = null;
  await getGroups();
  await loadUserGroups();
  dialogGroup.value = true;
};

const loadUserGroups = async () => {
  if (!selectedUser.value) return;
  
  try {
    const res = await axios.get(`${import.meta.env.VITE_API}getUserGroupsByUser`, {
      params: {
        user_id: selectedUser.value.emp_id,
        bu_id: groupForm.bu_id,
      }
    });
    userGroups.value = res.data;
  } catch (err) {
    error('Failed to load user groups');
  }
};

const addUserGroup = async () => {
  if (!groupForm.group_id) {
    error('Please select a group');
    return;
  }
  
  try {
    spinnerBall();
    await axios.post(`${import.meta.env.VITE_API}saveUserGroup`, {
      user_id: selectedUser.value.emp_id,
      group_id: groupForm.group_id,
      bu_id: groupForm.bu_id,
      creator: empid(),
    });
    
    success('Group assigned successfully');
    groupForm.group_id = null;
    await loadUserGroups();
    $q.loading.hide();
  } catch (err) {
    $q.loading.hide();
    error(err?.response?.data?.message || 'Failed to assign group');
  }
};

const removeUserGroup = async (ug) => {
  $q.dialog({
    title: "Confirm Delete",
    message: `Remove group <strong>${ug.grp_name}</strong> from this user?`,
    html: true,
    class: `side-${domain()} tw-rounded-2xl`,
    ok: {
      push: true,
      color: "red-7",
      label: "Remove",
      icon: "delete",
      class: "tw-font-semibold tw-px-6 tw-rounded-lg"
    },
    cancel: {
      push: true,
      color: 'grey-7',
      label: "Cancel",
      icon: "cancel",
      class: "tw-font-semibold tw-px-6 tw-rounded-lg"
    },
    persistent: true,
  }).onOk(async () => {
    try {
      spinnerBall();
      await axios.post(`${import.meta.env.VITE_API}deleteUserGroup`, {
        id: ug.ugrp_id,
        creator: empid(),
      });
      success('Group removed successfully');
      await loadUserGroups();
      $q.loading.hide();
    } catch (err) {
      $q.loading.hide();
      error(err?.response?.data?.message || 'Failed to remove group');
    }
  });
};

const resetForm = () => {
  form.id = null;
  form.nik = null;
  form.first_name = null;
  form.email = null;
  form.emp_id = null;
  form.activated = true;
  form.role_id = null;
  form.bu_name = null;
  form.nama_div = null;
  form.nama_dept = null;
  form.jabatan = null;
};

const deleteUserConfirm = async (row) => {
  $q.dialog({
    title: "Confirm Delete",
    message: `Are you sure you want to delete user <strong>${row.account_name}</strong> (NIK: ${row.account_nik})?<br><br>This action cannot be undone.`,
    html: true,
    class: `side-${domain()} tw-rounded-2xl`,
    ok: {
      push: true,
      color: "red-7",
      label: "Delete",
      icon: "delete",
      class: "tw-font-semibold tw-px-6 tw-rounded-lg"
    },
    cancel: {
      push: true,
      color: 'grey-7',
      label: "Cancel",
      icon: "cancel",
      class: "tw-font-semibold tw-px-6 tw-rounded-lg"
    },
    persistent: true,
  }).onOk(async () => {
    try {
      spinnerBall();
      // emp_id from API response is plain text, encrypt it for backend
      // DO NOT use row.emp_id directly - it needs encryption
      const encryptedEmpid = encrypt(row.emp_id);
      const empid = localStorage.getItem('empid');
      
      await axios.post(`${import.meta.env.VITE_API}deleteusers`, {
        // empid: encryptedEmpid,
        empid: row.emp_id,
        creator: empid, // already encrypted from localStorage
      });
      success('User deleted successfully');
      onRequest({
        pagination: pagination.value,
      });
      $q.loading.hide();
    } catch (err) {
      $q.loading.hide();
      error(err?.response?.data?.message || 'Failed to delete user');
    }
  });
};

const onRequest = (props) => {
  const { page, rowsPerPage, sortBy, descending, filter } = props.pagination;
  pagination.value.filter = filter;
  pagination.value.page = page;
  pagination.value.rowsPerPage = rowsPerPage;
  pagination.value.sortBy = sortBy;
  pagination.value.descending = descending;
  getData();
};

const updateTable = async () => {
  onRequest({
    pagination: pagination.value,
  });
};

onMounted(() => {
  onRequest({
    pagination: pagination.value,
  });
});
</script>

