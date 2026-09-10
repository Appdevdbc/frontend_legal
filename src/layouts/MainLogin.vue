<template>
  <q-layout view="lHh Lpr lFf">
    <q-page-container>
      <q-page class="fit row wrap justify-center items-center content-center login-container">
        <div class="login-card">
          <!-- Logo Section -->
          <div class="logo-section">
            <q-img class="logo-image" src="logo.png" width="180px" />
            <h6 class="app-title">
              <span class="title-gradient">Legal Monitoring System</span>
            </h6>
            <p class="subtitle">Welcome back! Please sign in to continue</p>
          </div>

          <!-- Form Section -->
          <Form
            :initial-values="initialValues"
            :validation-schema="schema"
            @submit="onSubmit"
            class="login-form"
          >
            <div class="form-fields">
              <Field
                v-model="tmpData.nik"
                name="nik"
                v-slot="{ errorMessage, value, field }"
              >
                <div class="input-wrapper">
                  <q-input
                    class="custom-input"
                    label="NIK"
                    outlined
                    type="tel"
                    :model-value="value"
                    v-bind="field"
                    :error-message="errorMessage"
                    :error="!!errorMessage"
                  >
                    <template v-slot:prepend>
                      <q-icon name="person" class="input-icon" />
                    </template>
                  </q-input>
                </div>
              </Field>
              
              <Field
                v-model="tmpData.pass"
                name="password"
                v-slot="{ errorMessage, value, field }"
              >
                <div class="input-wrapper">
                  <q-input
                    class="custom-input"
                    :type="isPwd ? 'password' : 'text'"
                    :model-value="value"
                    label="Password"
                    outlined
                    v-bind="field"
                    :error-message="errorMessage"
                    :error="!!errorMessage"
                  >
                    <template v-slot:prepend>
                      <q-icon name="lock" class="input-icon" />
                    </template>
                    <template v-slot:append>
                      <q-icon
                        :name="isPwd ? 'visibility_off' : 'visibility'"
                        class="cursor-pointer toggle-password"
                        @click="isPwd = !isPwd"
                      />
                    </template>
                  </q-input>
                </div>
              </Field>
            </div>

            <q-btn
              unelevated
              class="login-btn"
              label="Sign In"
              type="submit"
              no-caps
            >
              <q-icon name="arrow_forward" class="q-ml-sm" />
            </q-btn>
          </Form>
        </div>
      </q-page>
    </q-page-container>

    <div class="waves">
    <svg xmlns='http://www.w3.org/2000/svg' width='100%' height='100%' viewBox='0 0 1600 800' preserveAspectRatio='none'><rect fill='#ffaa00' width='1600' height='800'/><g fill-opacity='1'><path fill='#ffb100'  d='M486 705.8c-109.3-21.8-223.4-32.2-335.3-19.4C99.5 692.1 49 703 0 719.8V800h843.8c-115.9-33.2-230.8-68.1-347.6-92.2C492.8 707.1 489.4 706.5 486 705.8z'/><path fill='#ffb800'  d='M1600 0H0v719.8c49-16.8 99.5-27.8 150.7-33.5c111.9-12.7 226-2.4 335.3 19.4c3.4 0.7 6.8 1.4 10.2 2c116.8 24 231.7 59 347.6 92.2H1600V0z'/><path fill='#ffbe00'  d='M478.4 581c3.2 0.8 6.4 1.7 9.5 2.5c196.2 52.5 388.7 133.5 593.5 176.6c174.2 36.6 349.5 29.2 518.6-10.2V0H0v574.9c52.3-17.6 106.5-27.7 161.1-30.9C268.4 537.4 375.7 554.2 478.4 581z'/><path fill='#ffc500'  d='M0 0v429.4c55.6-18.4 113.5-27.3 171.4-27.7c102.8-0.8 203.2 22.7 299.3 54.5c3 1 5.9 2 8.9 3c183.6 62 365.7 146.1 562.4 192.1c186.7 43.7 376.3 34.4 557.9-12.6V0H0z'/><path fill='#ffcc00'  d='M181.8 259.4c98.2 6 191.9 35.2 281.3 72.1c2.8 1.1 5.5 2.3 8.3 3.4c171 71.6 342.7 158.5 531.3 207.7c198.8 51.8 403.4 40.8 597.3-14.8V0H0v283.2C59 263.6 120.6 255.7 181.8 259.4z'/><path fill='#ffd914'  d='M1600 0H0v136.3c62.3-20.9 127.7-27.5 192.2-19.2c93.6 12.1 180.5 47.7 263.3 89.6c2.6 1.3 5.1 2.6 7.7 3.9c158.4 81.1 319.7 170.9 500.3 223.2c210.5 61 430.8 49 636.6-16.6V0z'/><path fill='#ffe529'  d='M454.9 86.3C600.7 177 751.6 269.3 924.1 325c208.6 67.4 431.3 60.8 637.9-5.3c12.8-4.1 25.4-8.4 38.1-12.9V0H288.1c56 21.3 108.7 50.6 159.7 82C450.2 83.4 452.5 84.9 454.9 86.3z'/><path fill='#ffef3d'  d='M1600 0H498c118.1 85.8 243.5 164.5 386.8 216.2c191.8 69.2 400 74.7 595 21.1c40.8-11.2 81.1-25.2 120.3-41.7V0z'/><path fill='#fff852'  d='M1397.5 154.8c47.2-10.6 93.6-25.3 138.6-43.8c21.7-8.9 43-18.8 63.9-29.5V0H643.4c62.9 41.7 129.7 78.2 202.1 107.4C1020.4 178.1 1214.2 196.1 1397.5 154.8z'/><path fill='#ffff66'  d='M1315.3 72.4c75.3-12.6 148.9-37.1 216.8-72.4h-723C966.8 71 1144.7 101 1315.3 72.4z'/></g></svg>
    </div>
  </q-layout>
</template>

<script setup>
import { ref, reactive } from "vue";
import { Field, Form } from "vee-validate";
import * as yup from "yup";
import axios from "axios"
import { useRouter, useRoute } from "vue-router";
import { useQuasar } from "quasar";
import { useBrowserLocation } from '@vueuse/core'
import { ParseError } from "./../utils.js";
import { setSession, clearSession } from "./../session.js";
import { useNotify } from "./../composables/useNotify";

const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const location = useBrowserLocation();
const { success, error } = useNotify();
const isPwd = ref(true);
const tmpData = reactive({
  nik: "",
  pass: "",
  url:location.value.origin,
});
const schema = yup.object({
  nik: yup.string().required().label("NIK"),
  password: yup.string().required().label("Password"),
});
const initialValues = {
  terms: false,
  subscribed: false,
};
const onSubmit = async (values, actions) => {
  try {
    const environment =`${import.meta.env.VITE_ENV}`;
    // Bersihkan sesi lama (tanpa menghapus preferensi UI) sebelum login baru.
    clearSession();
     if (environment != 'LOCAL'){
        window.location.replace(`${import.meta.env.VITE_APPDBC}`);
    } 
    $q.loading.show();
    const res = await axios.post(`${import.meta.env.VITE_API}login`, tmpData, {
      skipErrorInterceptor: true
    });
    actions.resetForm();

    // Token TIDAK ada di body — sudah di-set sebagai httpOnly cookie oleh backend.
    // Simpan seluruh identitas sebagai satu blob terenkripsi di localStorage["session"].
    const d = res.data.data;
    setSession({
      empid: d.empid,
      nama: d.nama,
      nik: d.nik,
      domain: d.domain, // BU ID for styling
      unit: d.domain,   // Same as domain
      bu_id: d.bu_id,
      grade: d.grade,
      jabatan: d.jabatan,
      dept_id: d.dept_id,
      dept_name: d.dept_name,
      div_id: d.div_id,
      div_name: d.div_name,
      dir_id: d.dir_id,
      dir_name: d.dir_name,
      role: d.role,
      super: d.super,
      idle_time: d.idle,
    });

    success('Login berhasil');
    router.push("/"); 
    $q.loading.hide(); 
  } catch (err) {
    console.log(err);
    $q.loading.hide();
    error(err?.response?.data?.message || ParseError(err) || 'Login gagal. Silakan coba lagi.');
  }
};

// socket.on("barcode_inbound_status", (msg) => {
//   console.log("message: " + msg.barcode);
// });

// Saat halaman login dimuat, bersihkan sesi lama (tanpa menghapus preferensi UI).
clearSession();
</script>

<style lang="scss" scoped>
@import "../assets/styles/login.scss";
</style>


