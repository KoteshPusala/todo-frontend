import React, { useState, useEffect } from 'react';
import { useAuth } from '../contexts/AuthContext';
import OTPInput from './OTPInput.jsx';
import { X, Mail } from 'lucide-react';

const EmailVerification = ({ email, onVerified, onBack, isOverlay = false }) => {
  const [code, setCode] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const { verifyEmail, sendVerificationCode } = useAuth();
  
  useEffect(() => {
    const storedUserId = localStorage.getItem('tempUserId') || sessionStorage.getItem('tempUserId');
  }, []);

  const handleComplete = (enteredCode) => {
    setCode(enteredCode);
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    
    if (code.length !== 4) {
      setError('Please enter the 4-digit code');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const userId = localStorage.getItem('tempUserId');
      await verifyEmail(email, code, userId);
      setMessage('Email verified successfully! You can now login.');
      
      localStorage.removeItem('tempUserId');
      
      setTimeout(() => {
        if (onVerified) {
          onVerified();
        }
      }, 1500);
      
    } catch (error) {
      setError(error.message || 'Failed to verify email');
    } finally {
      setLoading(false);
    }
  };

  const handleResendCode = async () => {
    setLoading(true);
    setError('');
    setMessage('');

    try {
      await sendVerificationCode(email);
      setMessage('New verification code sent to your email!');
    } catch (error) {
      setError(error.message || 'Failed to send verification code');
    } finally {
      setLoading(false);
    }
  };

  // Overlay version - appears on top of existing page
  if (isOverlay) {
    return (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-2xl shadow-xl border border-gray-200 p-8 max-w-md w-full">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-r from-emerald-500 to-teal-600 rounded-xl flex items-center justify-center">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-bold text-gray-900">Verify Your Email</h2>
                <p className="text-sm text-gray-600">{email}</p>
              </div>
            </div>
            <button
              onClick={onBack}
              className="text-gray-500 hover:text-gray-700 transition-colors"
            >
              <X className="h-6 w-6" />
            </button>
          </div>

          <form onSubmit={handleVerify} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-4 text-center">
                Enter the 4-digit code sent to your email:
              </label>
              <OTPInput length={4} onComplete={handleComplete} />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            {message && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-lg text-sm">
                {message}
              </div>
            )}

            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading || code.length !== 4}
                className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-600 hover:to-teal-700 disabled:from-gray-400 disabled:to-gray-500 text-white py-3 px-4 rounded-xl transition-all duration-200 font-medium"
              >
                {loading ? 'Verifying...' : 'Verify Email'}
              </button>

              <button
                type="button"
                onClick={handleResendCode}
                disabled={loading}
                className="flex-1 bg-gray-100 hover:bg-gray-200 disabled:bg-gray-300 text-gray-700 py-3 px-4 rounded-xl transition-colors duration-200 font-medium"
              >
                Resend Code
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  // Full page version (original)
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 flex items-center justify-center p-4">
      {/* ... your original full-page JSX */}
    </div>
  );
};

export default EmailVerification;