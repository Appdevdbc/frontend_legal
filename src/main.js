// FILE: main.js

import { createApp } from "vue";
import { createPinia } from "pinia";
import { Dialog, Quasar, Loading, Notify } from "quasar";
import router from "./routes/router.js";
import CryptoJS from 'crypto-js';
import axios from "axios";
// Import icon libraries
import "@quasar/extras/material-icons/material-icons.css";

// Import Quasar css
import "quasar/src/css/index.sass";
import "./style.css";
import "./assets/custom.scss";
import "./assets/custom-q-date.scss";
import "./assets/styles/custom-loading.css";

axios.defaults.baseURL = import.meta.env.VITE_API;

// Auth via httpOnly cookie: kirim cookie otomatis pada setiap request.
axios.defaults.withCredentials = true;

// Assumes your root component is App.vue
// and placed in same folder as main.js
import App from "./App.vue";
import VueApexCharts from "vue3-apexcharts";
import HighchartsVue from "highcharts-vue";
import Highcharts from "highcharts";

// Suppress accessibility warning — we don't use the accessibility module
Highcharts.setOptions({
  accessibility: { enabled: false },
});

const myApp = createApp(App);
const pinia = createPinia();

myApp.config.globalProperties.$baseURL = import.meta.env.VITE_API;

myApp.use(Quasar, {
  plugins: {
    Dialog,
    Loading,
    Notify,
  },
});

myApp.use(pinia);
myApp.use(router);
myApp.use(VueApexCharts);
myApp.use(HighchartsVue);
myApp.mount("#app");
