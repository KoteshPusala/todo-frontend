import api from './api';

export const authService = {
  setToken(token) {
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      delete api.defaults.headers.common['Authorization'];
    }
  },

  async register(username, email, password) {
    try {
      console.log('🔵 Registering user:', { username, email });
      const response = await api.post('/auth/register', { username, email, password });
      console.log('🟢 Registration successful');
      return response.data;
    } catch (error) {
      console.error('🔴 Registration error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error || error.message || 'Registration failed');
    }
  },

  async login(email, password) {
    try {
      console.log('🔵 Logging in user:', email);
      const response = await api.post('/auth/login', { email, password });
      console.log('🟢 Login successful');
      return response.data;
    } catch (error) {
      console.error('🔴 Login error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error || error.message || 'Login failed');
    }
  },

  async logout() {
    try {
      console.log('🔵 Logging out user');
      const response = await api.post('/auth/logout');
      console.log('🟢 Logout successful');
      return response.data;
    } catch (error) {
      console.error('🔴 Logout error:', error.response?.data || error.message);
      // Don't throw error for logout - it's not critical
      return { message: 'Local logout completed' };
    }
  },

  async updateDarkMode(darkMode) {
    try {
      console.log('🔵 Updating theme preference:', darkMode);
      const response = await api.put('/auth/theme', { darkMode });
      console.log('🟢 Theme updated successfully');
      return response.data;
    } catch (error) {
      console.error('🔴 Theme update error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error || error.message || 'Failed to update theme');
    }
  },

  async getCurrentUser() {
    try {
      console.log('🔵 Fetching current user');
      const response = await api.get('/auth/me');
      console.log('🟢 User data fetched successfully');
      return response.data;
    } catch (error) {
      console.error('🔴 Get user error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error || error.message || 'Failed to get user data');
    }
  },

  async getUserProfile() {
    try {
      console.log('🔵 Fetching user profile');
      const response = await api.get('/auth/profile');
      console.log('🟢 Profile fetched successfully');
      return response.data;
    } catch (error) {
      console.error('🔴 Get profile error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error || error.message || 'Failed to get profile');
    }
  },

  async sendVerificationCode(email) {
    try {
      console.log('🔵 Sending verification code to:', email);
      const response = await api.post('/auth/send-verification', { email });
      console.log('🟢 Verification code sent successfully');
      return response.data;
    } catch (error) {
      console.error('🔴 Send verification code error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error || error.message || 'Failed to send verification code');
    }
  },

  async verifyEmail(email, code, userId = null) {
    try {
      console.log('🔵 Verifying email:', { email, code, userId });
      const response = await api.post('/auth/verify-email', { email, code, userId });
      console.log('🟢 Email verified successfully');
      return response.data;
    } catch (error) {
      console.error('🔴 Verify email error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error || error.message || 'Failed to verify email');
    }
  },

  // UPDATED: Password reset functions with proper error handling
  async sendPasswordResetCode(email) {
    try {
      console.log('🔵 Sending password reset code to:', email);
      const response = await api.post('/auth/forgot-password', { email });
      console.log('🟢 Password reset code sent successfully');
      return response.data;
    } catch (error) {
      console.error('🔴 Send password reset code error:', {
        status: error.response?.status,
        data: error.response?.data,
        message: error.message
      });
      
      // Pass the exact error from backend to frontend
      const errorMessage = error.response?.data?.error || error.message || 'Failed to send reset code';
      throw new Error(errorMessage);
    }
  },

  async verifyResetCode(email, code) {
    try {
      console.log('🔵 Verifying reset code:', { email, code });
      const response = await api.post('/auth/verify-reset-code', { email, code });
      console.log('🟢 Reset code verified successfully');
      return response.data;
    } catch (error) {
      console.error('🔴 Verify reset code error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error || error.message || 'Failed to verify reset code');
    }
  },

  async resetPassword(email, code, newPassword) {
    try {
      console.log('🔵 Resetting password for:', email);
      const response = await api.post('/auth/reset-password', { email, code, newPassword });
      console.log('🟢 Password reset successfully');
      return response.data;
    } catch (error) {
      console.error('🔴 Reset password error:', error.response?.data || error.message);
      throw new Error(error.response?.data?.error || error.message || 'Failed to reset password');
    }
  }
};