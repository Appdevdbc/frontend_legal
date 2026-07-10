<template>
  <div class="q-pa-md">
    <q-card class="tw-shadow-2xl tw-rounded-2xl tw-overflow-hidden">
      <q-card-section :class="`side-${domain()}-1 tw-py-6`">
        <div class="tw-flex tw-items-center tw-gap-3">
          <q-icon name="domain" size="28px" class="tw-text-white"/>
          <div>
            <div class="text-h6 tw-text-white tw-font-bold">Master Bisnis Unit</div>
            <div class="tw-flex tw-items-center tw-gap-2 tw-text-blue-100 tw-text-xs">
              <q-icon name="home" size="14px"/>
              <q-icon name="chevron_right" size="14px"/>
              <span>Master Bisnis Unit</span>
            </div>
          </div>
        </div>
      </q-card-section>

      <q-card-section class="tw-p-6">
        <q-table
          :rows="listDomain"
          :columns="columns"
          row-key="id"
          v-model:pagination="pagination"
          :loading="loading"
          :filter="pagination.filter"
          :rows-per-page-options="[]"
          @request="onRequest"
          binary-state-sort
          flat
          class="tw-shadow-md tw-rounded-xl tw-overflow-hidden"
        >
          <template v-slot:header="props">
            <q-tr :props="props">
              <q-th
                v-for="col in props.cols"
                :key="col.name"
                :props="props"
                :class="[
                  `bg-${domain()} tw-text-white tw-font-bold tw-text-sm tw-uppercase tw-tracking-wide tw-py-4`,
                  col.name === 'bu_id' ? 'sticky-column-left-header' : ''
                ]"
              >
                {{ col.label }}
              </q-th>
            </q-tr>
          </template>
          <template v-slot:top-right>
            <div class="tw-flex tw-gap-3 tw-items-center">
              <q-input
                outlined
                dense
                debounce="300"
                v-model="pagination.filter"
                placeholder="Search business..."
                class="tw-bg-white tw-rounded-lg tw-shadow-sm tw-min-w-[300px]"
              >
                <template v-slot:prepend>
                  <q-icon name="search" color="blue-6" />
                </template>
              </q-input>
            </div>
          </template>
          <template v-slot:top-left>
            <div class="tw-flex tw-items-center tw-gap-2 tw-bg-white tw-px-4 tw-py-2 tw-rounded-lg tw-shadow-sm">
              <q-icon name="view_headline" color="blue-6" size="20px">
                <q-tooltip class="tw-bg-slate-800 tw-text-xs">Rows per page</q-tooltip>
              </q-icon>
              <q-select
                borderless
                dense
                v-model="pagination.rowsPerPage"
                :options="[5,10,25,50,100,200]"
                @update:modelValue="updateTable"
                class="tw-min-w-[80px]"
              />
            </div>
          </template>
          <template v-slot:body-cell="props">
            <q-td :props="props" class="tw-py-4 tw-text-slate-700">
              {{ props.value }}
            </q-td>
          </template>
        </q-table>
      </q-card-section>
    </q-card>
  </div>
</template>

<script setup>
import { ref, onMounted, reactive } from "vue";
import axios from "axios"
import { domain, 
role, 
admin,
decryptMessage,
empid,
spinnerBall,
formatDateDMYHM,} from "./../../utils";
import { useQuasar } from "quasar";
import * as yup from "yup";
import { useRouter, useRoute} from "vue-router";
import { useNotify } from "./../../composables/useNotify";
import "./../../assets/styles/table.css";

const router = useRouter();
const { success, error } = useNotify();
const columns = [
  {
    name: "bu_id",
    required: true,
    label: "Business Code",
    align: "center",
    field: "bu_id",
    sortable: true,
  },
  {
    name: "bu_name",
    required: true,
    label: "Business Name",
    align: "left",
    field: "bu_name",
    sortable: true,
  },
  {
    name: "bu_status",
    label: "Business Status",
    align: "center",
    field: "bu_status",
    sortable: true,
  },
];
const $q = useQuasar();
const listDomain = ref([]);
const loading = ref(false);
const updateForm = ref(false);
const dialogForm = ref(false);
const tableColor = ref(false);
const cardColor = ref(false);
const headerColor = ref(false);
const editAccess = ref(0);
const pagination = ref({
  sortBy: "desc",
  descending: false,
  page: 1,
  rowsPerPage: 10,
  rowsNumber: 10,
  filter: null,
  domain: domain(),
});
const tmpForm = reactive({
  fldid: null,
  fldcode: null,
  fldinitial: null,
  fldname: null,
  fldentity: null,
  creator:empid(),
});

const tmpPage = reactive({
  add:'0',
  edit:'0',
  delete:'0',
  view:'0',
  admin:'0',
});

const schema = yup.object({
  kode:yup.string().required("Kode Domain wajib diisi").nullable(),
  shortname: yup.string().required("Short Name wajib diisi").nullable(),
  longname:  yup.string().required("Long Name wajib diisi").nullable(),
  entity:  yup.number().required("Entity wajib diisi").nullable(),
});


const getDomain = async () => {
  try {
    loading.value = true;
     if (pagination.value.rowsPerPage == 'All')
     pagination.value.rowsPerPage = pagination.value.rowsNumber;
    const res = await axios.get(`${import.meta.env.VITE_API}domains`, {
      params: pagination.value,
      skipErrorInterceptor: true
    });
    // listDomain.value = res.data.data;
    if (typeof res.data.data === "undefined") {
      listDomain.value = res.data;
    } else {
      listDomain.value = res.data.data;
    }

    pagination.value.rowsNumber = res.data.pagination.total;
    loading.value = false;
  } catch (err) {
    loading.value = false;
    error(err?.response?.data?.message || err?.message || 'Gagal memuat data');
  }
  //tableColor.value = table();
  //cardColor.value = card();
  //headerColor.value = header();
};

const getPageAkses = async () => {
  try {
    spinnerBall()
    const res = await axios.get(`${import.meta.env.VITE_API}pageakses`, {
      params: {
        role:empid(),
        page:'/master/domain',
        domain:domain(),
      },
      skipErrorInterceptor: true
    });
    tmpPage.add = decryptMessage(res.data.add);
    tmpPage.edit =decryptMessage(res.data.edit);
    tmpPage.delete =decryptMessage(res.data.delete);
    tmpPage.view =decryptMessage(res.data.view);
    tmpPage.admin=decryptMessage(admin());
    $q.loading.hide()
  } catch (err) {
    $q.loading.hide()
    router.push('/404');
  }
};

const onRequest = (props) => {
  const { page, rowsPerPage, sortBy, descending, filter } = props.pagination;
  pagination.value.filter = filter;
  pagination.value.page = page;
  pagination.value.rowsPerPage = rowsPerPage;
  pagination.value.sortBy = sortBy;
  pagination.value.descending = descending;
  getDomain();
  
};

const updateTable = async () => {
  onRequest({
    pagination: pagination.value,
  });
};

onMounted(() => {
  getPageAkses();
  onRequest({
    pagination: pagination.value,
  });
});



</script>
