import React, { useState } from 'react';
import {
  ShieldAlert,
  Phone,
  Fingerprint,
  ScanFace,
  CheckCircle,
  KeyRound,
  Lock,
  ArrowRight,
  Info
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const LoginPage: React.FC<{ onLoginSuccess: () => void }> = ({ onLoginSuccess }) => {
  const { user, loginWithOTP, loginWithBiometrics, logout } = useAuth();

  const [phoneNumber, setPhoneNumber] = useState('+91-9849001122');
  const [otpCode, setOtpCode] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loginError, setLoginError] = useState('');
  const [biometricLoading, setBiometricLoading] = useState(false);

  const handleSendOTP = (e: React.FormEvent) => {
    e.preventDefault();
    setOtpSent(true);
    setLoginError('');
  };

  const handleVerifyOTP = async (e: React.FormEvent) => {
    e.preventDefault();
    const success = await loginWithOTP(phoneNumber, otpCode || '112233');
    if (success) {
      onLoginSuccess();
    } else {
      setLoginError("Invalid OTP. For demonstration, use OTP code: 112233");
    }
  };

  const handlePasskeyLogin = async () => {
    setBiometricLoading(true);
    setTimeout(async () => {
      await loginWithBiometrics();
      setBiometricLoading(false);
      onLoginSuccess();
    }, 800);
  };

  if (user) {
    return (
      <div className="max-w-md mx-auto bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-6 shadow-sm text-center space-y-4">
        <CheckCircle className="w-12 h-12 text-emerald-500 mx-auto" />
        <h3 className="font-extrabold text-lg text-slate-900 dark:text-white">
          Logged in as {user.name}
        </h3>
        <p className="text-xs text-slate-500">
          Phone: {user.phone} • Role: {user.role} • Household: {user.family_id}
        </p>
        <button
          onClick={logout}
          className="w-full py-2.5 bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-800 dark:text-white rounded-xl text-xs font-bold transition-colors"
        >
          Sign Out of Suraksha AI
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto space-y-6">
      
      {/* Login Card */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl p-8 shadow-xl space-y-6">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-red-600 text-white flex items-center justify-center mx-auto shadow-lg shadow-red-500/20">
            <ShieldAlert className="w-7 h-7" />
          </div>
          <h2 className="text-2xl font-black text-slate-900 dark:text-white">
            Citizen & Responder Login
          </h2>
          <p className="text-xs text-slate-500">
            Secure authentication via OTP or device biometric passkeys.
          </p>
        </div>

        {loginError && (
          <div className="p-3 bg-red-50 dark:bg-red-950/60 border border-red-200 text-red-700 dark:text-red-300 rounded-xl text-xs font-medium">
            {loginError}
          </div>
        )}

        {/* OTP Flow (DEFAULT METHOD - Section 8) */}
        {!otpSent ? (
          <form onSubmit={handleSendOTP} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Enter Mobile Number (Aadhaar / Ration Linked):
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  value={phoneNumber}
                  onChange={(e) => setPhoneNumber(e.target.value)}
                  placeholder="+91-XXXXXXXXXX"
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-xs sm:text-sm text-slate-900 dark:text-white focus:ring-2 focus:ring-red-500 focus:outline-none font-mono"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black text-xs shadow-md transition-all active:scale-95 flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>SEND VERIFICATION OTP</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        ) : (
          <form onSubmit={handleVerifyOTP} className="space-y-4">
            <div>
              <label className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-1">
                Enter 6-Digit OTP (Demo Code: 112233):
              </label>
              <div className="relative">
                <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  value={otpCode}
                  onChange={(e) => setOtpCode(e.target.value)}
                  placeholder="112233"
                  maxLength={6}
                  className="w-full bg-slate-50 dark:bg-slate-800 border border-slate-300 dark:border-slate-700 rounded-xl pl-10 pr-4 py-2.5 text-sm text-slate-900 dark:text-white tracking-widest font-mono text-center focus:ring-2 focus:ring-red-500 focus:outline-none"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 bg-red-600 hover:bg-red-700 text-white rounded-xl font-black text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              VERIFY & ACCESS PLATFORM
            </button>
          </form>
        )}

        {/* Biometric Passkey Divider */}
        <div className="relative flex items-center justify-center">
          <div className="border-t border-slate-200 dark:border-slate-800 w-full" />
          <span className="bg-white dark:bg-slate-900 px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
            Or Use Device Passkey
          </span>
        </div>

        {/* WebAuthn / Biometric Authentications */}
        <div className="grid grid-cols-2 gap-3">
          <button
            type="button"
            onClick={handlePasskeyLogin}
            disabled={biometricLoading}
            className="p-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 flex flex-col items-center gap-1.5 transition-colors cursor-pointer"
          >
            <Fingerprint className="w-6 h-6 text-blue-600" />
            <span>{biometricLoading ? "Verifying..." : "Fingerprint Passkey"}</span>
          </button>

          <button
            type="button"
            onClick={handlePasskeyLogin}
            disabled={biometricLoading}
            className="p-3 bg-slate-50 dark:bg-slate-800 hover:bg-slate-100 dark:hover:bg-slate-700 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 flex flex-col items-center gap-1.5 transition-colors cursor-pointer"
          >
            <ScanFace className="w-6 h-6 text-purple-600" />
            <span>{biometricLoading ? "Verifying..." : "Face Biometric"}</span>
          </button>
        </div>

        {/* Privacy notice (Section 8) */}
        <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/50 text-[10px] text-slate-500 leading-relaxed flex items-center gap-2">
          <Lock className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            <strong>BIOMETRIC PRIVACY:</strong> We authenticate locally using W3C WebAuthn passkeys. Raw fingerprint or facial biometric data is never transmitted or stored on Suraksha AI servers.
          </span>
        </div>

      </div>

    </div>
  );
};
