import { defineStore } from 'pinia';
import axios from 'axios';
import { useNotify } from '../composables/useNotify';
import { setSession, getSession, clearSession, isLoggedIn as sessionIsLoggedIn } from '../session.js';

// CATATAN: Store ini adalah jalur scaffold (tidak dipakai jalur login aktif MainLogin.vue).
// Diselaraskan agar tidak menyimpan token di localStorage — auth via httpOnly cookie.
export const useAuthStore = defineStore('auth', {
  state: () => ({
    user: null,
    isAuthenticated: false,
    loading: false
  }),

  getters: {
    currentUser: (state) => state.user,
    userNik: (state) => state.user?.nik,
    userName: (state) => state.user?.name,
    userEmail: (state) => state.user?.email,
    userEmpId: (state) => state.user?.empid || state.user?.id || getSession().empid,
    isLoggedIn: (state) => state.isAuthenticated && sessionIsLoggedIn()
  },

  actions: {
    /**
     * Login with username and password
     */
    async login(username, password) {
      const { success, error } = useNotify();
      this.loading = true;
      
      try {
        const response = await axios.post('/wjs/auth/login', {
          username,
          password
        });

        if (response.data.success) {
          const { user } = response.data.data;

          this.user = user;
          this.isAuthenticated = true;

          // Token via httpOnly cookie (tidak disimpan di FE).
          // Simpan identitas sebagai blob terenkripsi via session facade.
          setSession({ ...user, empid: user.id, nik: user.nik });

          success('Login berhasil');
          return { success: true };
        } else {
          error(response.data.message || 'Login gagal');
          return {
            success: false,
            message: response.data.message || 'Login gagal'
          };
        }
      } catch (err) {
        console.error('Login error:', err);
        const message = err.response?.data?.message || 'Login gagal. Silakan coba lagi.';
        error(message);
        return {
          success: false,
          message
        };
      } finally {
        this.loading = false;
      }
    },

    /**
     * Logout user
     */
    async logout() {
      const { success } = useNotify();
      
      try {
        await axios.post('/wjs/auth/logout');
        success('Logout berhasil');
      } catch (err) {
        console.error('Logout error:', err);
      } finally {
        this.clearAuth();
      }
    },

    /**
     * Verify token validity
     */
    async verifyToken() {
      try {
        const response = await axios.get('/wjs/auth/verify');
        return response.data.success;
      } catch (err) {
        this.clearAuth();
        return false;
      }
    },

    /**
     * Get current user data
     */
    async getCurrentUser() {
      try {
        const response = await axios.get('/wjs/auth/me');
        
        if (response.data.success) {
          this.user = response.data.data;
          this.isAuthenticated = true;

          // Simpan identitas ke session blob (bukan key terpisah).
          setSession(response.data.data);
          
          return true;
        }
        
        return false;
      } catch (err) {
        console.error('Get current user error:', err);
        this.clearAuth();
        return false;
      }
    },

    /**
     * Refresh token — backend men-set cookie baru; tidak ada token di body.
     */
    async refreshToken() {
      try {
        const response = await axios.post('/wjs/auth/refresh');
        return response.data.success === true;
      } catch (err) {
        console.error('Refresh token error:', err);
        return false;
      }
    },

    /**
     * Clear authentication data (session blob + flag, tanpa preferensi UI)
     */
    clearAuth() {
      this.user = null;
      this.isAuthenticated = false;
      clearSession();
    },

    /**
     * Initialize auth from session facade
     */
    initFromStorage() {
      if (sessionIsLoggedIn()) {
        try {
          this.user = getSession();
          this.isAuthenticated = true;
        } catch (err) {
          console.error('Error reading session:', err);
          this.clearAuth();
        }
      }
    },

    /**
     * Set user data
     */
    setUser(user) {
      this.user = user;
      this.isAuthenticated = true;
      setSession(user);
    }
  }
});

