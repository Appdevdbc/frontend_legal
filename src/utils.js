import * as XLSX from "xlsx";
import { date } from "quasar";
import dayjs from "dayjs";
import axios from "axios";
import CryptoJS from 'crypto-js';
import {  Loading } from "quasar";
import customParseFormat from 'dayjs/plugin/customParseFormat.js';
import timezone from "dayjs/plugin/timezone.js";
import utc from "dayjs/plugin/utc.js";

dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(customParseFormat);

const keyValue  = 'dbcfa2025';
const ivKey  = 'dbcfa2024';  

// New encrypt function that matches backend format
export function encryptMessage(message) {
  try {
    const secretKey = 'nest0425'; // Should match backend ENCRYPTION_KEY
    
    // Convert message to string
    const str = message != null ? String(message) : '';
    if (!str) {
      throw new Error('Invalid message to encrypt');
    }
    
    // Generate random IV (16 bytes)
    const iv = CryptoJS.lib.WordArray.random(16);
    
    // Create key from secret (SHA256)
    const key = CryptoJS.SHA256(secretKey);
    
    // Encrypt the message
    const encrypted = CryptoJS.AES.encrypt(str, key, {
      iv: iv,
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7
    });
    
    // Create HMAC for authentication
    const hmacInput = CryptoJS.lib.WordArray.create()
      .concat(iv)
      .concat(encrypted.ciphertext);
    
    const hmac = CryptoJS.HmacSHA256(hmacInput, key);
    
    // Combine: HMAC (32 bytes) + IV (16 bytes) + encrypted data
    const combined = CryptoJS.lib.WordArray.create()
      .concat(hmac)
      .concat(iv)
      .concat(encrypted.ciphertext);
    
    // Convert to base64 and make URL-safe
    const base64 = CryptoJS.enc.Base64.stringify(combined);
    return encodeForUrl(base64);
    
  } catch (error) {
    console.error('Encryption error:', error);
    throw error;
  }
}

export function encodeForUrl(message) {
  return message.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/, '');
}

export function decrypt(data) {
  const key = CryptoJS.PBKDF2(keyValue, 'salt', { keySize: 256/32, iterations: 100 });
  const iv = CryptoJS.enc.Utf8.parse(ivKey);
  const decrypted = CryptoJS.AES.decrypt({ ciphertext: CryptoJS.enc.Hex.parse(data) }, key, { iv: iv, mode: CryptoJS.mode.CBC });
  return decrypted.toString(CryptoJS.enc.Utf8);
}

// Keep the old encrypt function for backward compatibility
export function encrypt(data) {
  const key = CryptoJS.PBKDF2(keyValue, 'salt', { keySize: 256/32, iterations: 100 });
  const iv = CryptoJS.enc.Utf8.parse(ivKey); // Convert string to WordArray
  const encrypted = CryptoJS.AES.encrypt(data, key, { iv: iv, mode: CryptoJS.mode.CBC });
  return encrypted.ciphertext.toString(CryptoJS.enc.Hex);
}

export function decryptMessage (ciphertext){
  try {
    const secretKey = CryptoJS.SHA256('nest0425').toString();
    const restoredCiphertext = decodeFromUrl(ciphertext);
    
    // Decode base64
    const combined = CryptoJS.enc.Base64.parse(restoredCiphertext);
    const combinedBytes = combined.toString(CryptoJS.enc.Latin1);
    
    // Extract tag (32 bytes), iv (16 bytes), and encrypted data
    const tagLength = 32;
    const ivLength = 16;
    
    const tag = combinedBytes.substring(0, tagLength);
    const iv = combinedBytes.substring(tagLength, tagLength + ivLength);
    const encrypted = combinedBytes.substring(tagLength + ivLength);
    
    // Convert to WordArray for decryption
    const ivWordArray = CryptoJS.enc.Latin1.parse(iv);
    const encryptedWordArray = CryptoJS.enc.Latin1.parse(encrypted);
    
    // Decrypt using AES
    const decrypted = CryptoJS.AES.decrypt(
      { ciphertext: encryptedWordArray },
      CryptoJS.enc.Hex.parse(secretKey),
      { iv: ivWordArray, mode: CryptoJS.mode.CBC, padding: CryptoJS.pad.Pkcs7 }
    );
    
    return decrypted.toString(CryptoJS.enc.Utf8);
  } catch (error) {
    console.error('Decryption error:', error);
    throw error;
  }
}

export function decodeFromUrl (ciphertext) {
   // Add padding '=' characters back, if required
   return ciphertext.replace(/-/g, '+').replace(/_/g, '/').padEnd(ciphertext.length + (4 - (ciphertext.length % 4)) % 4, '=');
}

// --- Session facade helpers (blob terenkripsi di localStorage["session"]) ---
// Dibaca langsung di sini (bukan import dari session.js) untuk menghindari
// circular import, karena session.js meng-import useEncrypt/useDecrypt dari file ini.
const readSession = () => {
  const raw = window.localStorage.getItem("session");
  if (!raw) return {};
  try {
    const decrypted = useDecrypt(raw);
    return decrypted ? JSON.parse(decrypted) : {};
  } catch (e) {
    return {};
  }
};

export const nik = () => {
  return readSession().nik ?? null;
};

export const terbilang = (angka) => {
  var bilne=["","satu","dua","tiga","empat","lima","enam","tujuh","delapan","sembilan","sepuluh","sebelas"];
  if(angka < 12){
    return bilne[angka];
  }else if(angka < 20){
    return terbilang(angka-10)+" belas";
  }else if(angka < 100){
    return terbilang(Math.floor(parseInt(angka)/10))+" puluh "+terbilang(parseInt(angka)%10);
  }else if(angka < 200){
    return "seratus "+terbilang(parseInt(angka)-100);
  }else if(angka < 1000){
    return terbilang(Math.floor(parseInt(angka)/100))+" ratus "+terbilang(parseInt(angka)%100);
  }else if(angka < 2000){
    return "seribu "+terbilang(parseInt(angka)-1000);
  }else if(angka < 1000000){
    return terbilang(Math.floor(parseInt(angka)/1000))+" ribu "+terbilang(parseInt(angka)%1000);
  }else if(angka < 1000000000){
    return terbilang(Math.floor(parseInt(angka)/1000000))+" juta "+terbilang(parseInt(angka)%1000000);
  }else if(angka < 1000000000000){
    return terbilang(Math.floor(parseInt(angka)/1000000000))+" milyar "+terbilang(parseInt(angka)%1000000000);
  }else if(angka < 1000000000000000){
    return terbilang(Math.floor(parseInt(angka)/1000000000000))+" trilyun "+terbilang(parseInt(angka)%1000000000000);
  }
}

export const empid = () => {
  return readSession().empid ?? null;
};

export const nama = () => {
  return readSession().nama ?? null;
};

export const role = () => {
  return readSession().role ?? null;
};

export const admin = () => {
  return readSession().super ?? null;
};

export const domain = () => {
  return readSession().domain ?? null;
};

export const site= () => {
  return readSession().site ?? null;
};

export const ListSite = () => {
  return readSession().ListSite ?? null;
};

export const idleTime = () => {
  return readSession().idle_time ?? null;
};

export const unit = () => {
  return readSession().unit ?? null;
};

// Token tidak lagi disimpan di frontend (httpOnly cookie). Deprecated.
export const token = () => {
  return null;
};

// Bersihkan sesi (blob + flag) tanpa menghapus preferensi UI, lalu redirect ke login.
// Inline di sini untuk menghindari circular import dengan session.js.
const clearSessionAndRedirect = () => {
  window.localStorage.removeItem("session");
  window.localStorage.removeItem("isLoggedIn");
  const environment = import.meta.env.VITE_ENV;
  if (environment === "LOCAL") {
    window.location.hash = "#/login";
  } else {
    window.location.replace(import.meta.env.VITE_APPDBC);
  }
};

export const ParseError = (error) => {
  if (error.response) {  
    switch (error.response.status) {  
      case 406:  
      case 400:  
        return error.response.data.message;  
      case 401:  
      case 402:  
        clearSessionAndRedirect();
        return error.response.data?.message || 'Sesi Anda telah berakhir. Silakan login kembali.';
      case 413:
        return "Data terlalu besar untuk dikirim. Silakan kurangi jumlah data atau hubungi admin.";  
      case 500:  
        return "Telah terjadi kesalahan pada saat proses data, silahkan kontak team IT";  
      default:  
        return error.response.data.message || error.message;  
    }  
  } else {  
    return error.message;  
  }  
};

export const excelDownload = (data, name) => {
  let wb1 = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, wb1, name);
  return XLSX.writeFile(
    wb,
    `${name}-${date.formatDate(Date.now(), "YYYY-MM-DD-HH:mm:ss")}.xlsx`
  );
};

export const formatDateTime = (datetime) => {
  return dayjs(datetime).format("DD-MMM-YYYY HH:mm:ss");
};

export const formatDate = (datetime) => {
  return dayjs(datetime).format("DD-MMM-YYYY");
};

export const formatDateStandar = (datetime) => {
  return dayjs(datetime).format("YYYY-MM-DD");
};

export const dateTime = () => {
  return dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
};

export const dateOnly = () => {
  return dayjs(new Date()).format("YYYY-MM-DD");
};

export const hasDuplicate = async(array) => {
  return new Set(array).size !== array.length;
};

export const table = () => {
  return window.localStorage.getItem("table");
};

export const card = () => {
  return window.localStorage.getItem("card");
};

export const header = () => {
  return window.localStorage.getItem("header");
};


export const formatRupiah = (value) => {
  if (value) {
    return new Intl.NumberFormat("de-ID").format(parseFloat(value));
  } else {
    return 0;
  }
};

export const formatRupiahWithFixed = (value) => {
  if (value) {
    let fixedValue = parseFloat(value).toFixed(0);
    if (fixedValue == -0) fixedValue = 0;
    return new Intl.NumberFormat("de-ID").format(fixedValue);
  } else {
    return 0;
  }
};

export const formatRupiahFixedCustom = (value,fixed) => {
  if (value) {
    return new Intl.NumberFormat("en-US").format(parseFloat(value).toFixed(fixed));
  } else {
    return 0;
  }
};

export const formatDateOnly = (value) => {
  if (value) { 
    return dayjs(value).format("DD-MMM-YYYY");
  } else {
    return '';
  }
};

export const formatHourMinuteOnly = (value) => {
  if (value) { 
    return dayjs(value).format("HH:mm");
  } else {
    return '';
  }
};

export const getPageAccess = async (value) => {
  try {
    
    const res = await axios.get(`${import.meta.env.VITE_API}getPageAccess`, {
      params: value
    });

    return res.data.access;
  
  } catch (error) { 
    //console.log(error);
    return 0;
  }
};

export const NumberDotOnly = (evt) => {
  evt = (evt) ? evt : window.event;
  var charCode = (evt.which) ? evt.which : evt.keyCode;

  if ((charCode > 31 && (charCode < 48 || charCode > 57)) && (charCode !== 46 || evt.target.value.indexOf('.') != -1)) {
      evt.preventDefault();
  } else {
      return true;
  }
}

export const useEncrypt = (text) => {
  const secretKey = import.meta.env.VITE_SC;
  const iv = import.meta.env.VITE_IV;

  if (!secretKey || !iv) {
    throw new Error("Secret key or IV is not defined in environment variables.");
  }

  const key = CryptoJS.enc.Utf8.parse(secretKey);
  const ivWordArray = CryptoJS.enc.Utf8.parse(iv);
  const encrypted = CryptoJS.AES.encrypt(text, key, { iv: ivWordArray });
  return encrypted.toString();
};

export const useDecrypt = (encryptedData) => {
  const secretKey = import.meta.env.VITE_SC;
  const iv = import.meta.env.VITE_IV;

  if (!secretKey || !iv) {
    throw new Error("Secret key or IV is not defined in environment variables.");
  }

  const key = CryptoJS.enc.Utf8.parse(secretKey);
  const ivWordArray = CryptoJS.enc.Utf8.parse(iv);
  const bytes = CryptoJS.AES.decrypt(encryptedData, key, { iv: ivWordArray });
  const decryptedText = bytes.toString(CryptoJS.enc.Utf8);
  return decryptedText;
};

export const convertMonthToString = (month) => {
  const months = [
      "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
      "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  if (month < 1 || month > 12) return "Invalid month";

  return months[month - 1]; 
}

export const formatMoney = (value) => {
  const sanitizedValue = value.replace(/[^0-9.]/g, '');
  const parts = sanitizedValue.split('.');
  
  if (parts[1] && parts[1].length > 2) {
    parts[1] = parts[1].substring(0, 2);
  }
  
  return parts.join('.');
}

export const formatPrice = (value) => {
  const numberValue = parseFloat(value);  

  if (isNaN(numberValue)) {  
      throw new Error("Invalid input: not a number");  
  }  

  return numberValue.toLocaleString('en-US', {  
      minimumFractionDigits: 2,  
      maximumFractionDigits: 2  
  });  
}  

export function spinnerBall() {
  Loading.show({
    message: `
      <div class="custom-loading-container">
        <div class="logo-static">
          <img src="/favicon.png" />
        </div>
        <div class="loading-dots">
          <div class="dot"></div>
          <div class="dot"></div>
          <div class="dot"></div>
        </div>
      </div>
    `,
    html: true,
    backgroundColor: 'rgb(255, 255, 255)'
  });
}

export const formatDateDMY = (datetime) => {
  if (datetime != null){
    return dayjs(datetime).format("DD-MM-YYYY");
  }else{
    return null;
  }
};

export const formatDateDMYHM = (datetime) => {
  if (datetime != null){
    return dayjs(datetime).tz("UTC").format("DD-MM-YYYY HH:mm");
  }else{
    return null;
  }
};

export const DMYtoYMD = (value) => {
  if (value){
    const data= value.split('-');
    return dayjs(`${data[2]}-${data[1]}-${data[0]}`).format('YYYY-MM-DD');
  }else {
    return null
  }
};

export const formatRupiah2 = (value) => {
  if (value) {
    return new Intl.NumberFormat("en-US").format(parseFloat(value).toFixed(2));
  } else {
    return 0;
  }
};

export const formatRupiahText = (value) => {
  if (!isNaN(value) && isFinite(value)) {
    return new Intl.NumberFormat("en-US").format(parseFloat(value).toFixed(2));
  } else {
    return value;
  }
};

export const lightenColor= (rgb, percent) => {
  const [r, g, b] = rgb.match(/\d+/g).map(Number);
  const rL = Math.min(255, Math.round(r + (255 - r) * (percent / 100)));
  const gL = Math.min(255, Math.round(g + (255 - g) * (percent / 100)));
  const bL = Math.min(255, Math.round(b + (255 - b) * (percent / 100)));
  return `rgb(${rL},${gL},${bL})`;
}

export const darkenColor= (rgb, percent) => {
  const [r, g, b] = rgb.match(/\d+/g).map(Number);
  const rD = Math.max(0, Math.round(r - r * (percent / 100)));
  const gD = Math.max(0, Math.round(g - g * (percent / 100)));
  const bD = Math.max(0, Math.round(b - b * (percent / 100)));
  return `rgb(${rD},${gD},${bD})`;
}

export const invertColor=(hex)=> {
  const r = 255 - parseInt(hex.slice(1, 3), 16);
  const g = 255 - parseInt(hex.slice(3, 5), 16);
  const b = 255 - parseInt(hex.slice(5, 7), 16);
  return `rgb(${r},${g},${b})`;
}

// Helper untuk chunking data besar
export const chunkArray = (array, chunkSize = 50) => {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
};

// Helper untuk mengirim data dalam batch
export const sendDataInChunks = async (data, apiEndpoint, chunkSize = 50) => {
  const chunks = chunkArray(data, chunkSize);
  const results = [];
  
  for (let i = 0; i < chunks.length; i++) {
    try {
      const response = await axios.post(apiEndpoint, {
        chunk: chunks[i],
        chunkIndex: i,
        totalChunks: chunks.length
      });
      results.push(response.data);
    } catch (error) {
      throw new Error(`Chunk ${i + 1} failed: ${error.message}`);
    }
  }
  
  return results;
};

// Optimasi calculate untuk data besar
export const calculateOptimized = async (data, endpoint) => {
  // Hanya kirim data yang diperlukan untuk kalkulasi
  const essentialData = data.map(item => ({
    id: item.id,
    alloc_qty: item.alloc_qty,
    kubikasi: item.kubikasi,
    tonase: item.tonase
  }));
  
  if (essentialData.length > 100) {
    return await sendDataInChunks(essentialData, endpoint, 50);
  }
  
  return await axios.post(endpoint, { data: essentialData });
};

export const formatNumber = (value) => {
  if (!value) return '';
  return value.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
