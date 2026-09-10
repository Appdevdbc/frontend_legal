// FILE: session.js
// Session facade — identitas user disimpan sebagai SATU blob AES-encrypted
// di localStorage["session"], token TIDAK disimpan di frontend (httpOnly cookie).
//
// Preferensi UI non-auth (dark, menu, header, table, card, warna) TIDAK disentuh
// modul ini — biarkan tetap di localStorage terpisah.

import { useEncrypt, useDecrypt } from "./utils.js";

const SESSION_KEY = "session";
const LOGGED_IN_KEY = "isLoggedIn";

/**
 * Enkripsi payload identitas & simpan ke localStorage["session"],
 * lalu set flag isLoggedIn = "1".
 * @param {Object} payload - objek identitas (empid, nama, nik, domain, dll.)
 */
export const setSession = (payload) => {
  try {
    const encrypted = useEncrypt(JSON.stringify(payload ?? {}));
    window.localStorage.setItem(SESSION_KEY, encrypted);
    window.localStorage.setItem(LOGGED_IN_KEY, "1");
  } catch (error) {
    console.error("setSession error:", error);
    throw error;
  }
};

/**
 * Dekripsi & kembalikan objek identitas dari localStorage["session"].
 * @returns {Object} objek identitas, atau {} bila kosong/gagal.
 */
export const getSession = () => {
  const raw = window.localStorage.getItem(SESSION_KEY);
  if (!raw) return {};
  try {
    const decrypted = useDecrypt(raw);
    if (!decrypted) return {};
    return JSON.parse(decrypted);
  } catch (error) {
    console.error("getSession error:", error);
    return {};
  }
};

/**
 * Hapus session + flag isLoggedIn.
 * TIDAK menghapus preferensi UI (dark, menu, dll.).
 */
export const clearSession = () => {
  window.localStorage.removeItem(SESSION_KEY);
  window.localStorage.removeItem(LOGGED_IN_KEY);
};

/**
 * @returns {boolean} true bila flag isLoggedIn === "1".
 */
export const isLoggedIn = () => {
  return window.localStorage.getItem(LOGGED_IN_KEY) === "1";
};

/**
 * Arahkan ke halaman login (env-aware).
 * - LOCAL  : ke rute /login internal (hash router).
 * - selain : replace ke portal DBC (VITE_APPDBC).
 */
export const redirectToLogin = () => {
  const environment = import.meta.env.VITE_ENV;
  if (environment === "LOCAL") {
    // Hash router: arahkan ke /login tanpa menggandakan instance router.
    window.location.hash = "#/login";
  } else {
    window.location.replace(import.meta.env.VITE_APPDBC);
  }
};
