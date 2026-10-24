import React, { useEffect, useState } from 'react';
import {
  Fingerprint,
  Landmark,
  LockKeyhole,
  Mail,
  ShieldCheck,
  Smartphone,
  UserRound
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const createOtp = () => String(Math.floor(100000 + Math.random() * 900000));

export default function AuthModal({ mode = 'login', onClose, forceOpen = false }) {
  const { login, signup, socialSignup, biometricLogin } = useAuth();
  const [isSignup, setIsSignup] = useState(mode === 'signup');
  const [step, setStep] = useState('form');
  const [form, setForm] = useState({ name: '', email: '', phone: '', password: '', otp: '' });
  const [sentOtp, setSentOtp] = useState('');
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => setIsSignup(mode === 'signup'), [mode]);

  const update = (event) =>
    setForm((current) => ({ ...current, [event.target.name]: event.target.value }));

  const submit = (event) => {
    event.preventDefault();
    setError('');
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(form.email.trim())) {
      return setError('Enter a valid email address, such as name@example.com.');
    }
    if (isSignup && step === 'form') {
      if (form.password.length < 6) return setError('Password must be at least 6 characters.');
      const otp = createOtp();
      setSentOtp(otp);
      setStep('otp');
      setNotice(
        `Demo OTP: ${otp}. In production, this code must be sent by a secure SMS/email service.`
      );
      return;
    }
    if (isSignup) {
      if (form.otp !== sentOtp) return setError('The OTP is incorrect or expired.');
      const result = signup(form);
      if (!result.ok) return setError(result.error);
      return;
    }
    const result = login(form);
    if (!result.ok) setError(result.error);
  };

  const useBiometric = async () => {
    setError('');
    const result = await biometricLogin();
    if (!result.ok) setError(result.error);
  };

  const useSocialSignup = (provider) => {
    setError('');
    const result = socialSignup(provider, form);
    if (result.ok) {
      setNotice(
        provider === 'Google'
          ? 'Google verified Gmail connected. Production OAuth will use the signed-in Google account email.'
          : `${provider} connected in demo mode. Add the provider OAuth credentials for production.`
      );
    } else {
      setError(result.error);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-slate-950/70 p-4 backdrop-blur-sm">
      <div className="w-full max-w-md overflow-hidden rounded-3xl border border-white/10 bg-white shadow-2xl dark:bg-slate-900">
        <div className="bg-gradient-to-br from-gov-navy via-blue-900 to-emerald-800 px-6 py-7 text-white">
          <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-white/15 ring-1 ring-white/20">
            <ShieldCheck className="h-7 w-7" />
          </div>
          <p className="text-xs font-bold uppercase tracking-[0.2em] text-emerald-200">
            Bharat Sathi AI
          </p>
          <h1 className="mt-2 text-2xl font-extrabold">
            {isSignup ? 'Create your secure account' : 'Welcome back'}
          </h1>
          <p className="mt-2 text-sm text-blue-100">
            Your citizen vault stays protected on this device.
          </p>
        </div>

        <div className="p-6">
          <div className="space-y-2">
            <button
              type="button"
              onClick={() => useSocialSignup('Google')}
              className="flex w-full items-center justify-center gap-3 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-bold text-slate-700 shadow-sm transition hover:bg-slate-50 dark:border-slate-700 dark:bg-slate-800 dark:text-slate-100 dark:hover:bg-slate-700"
            >
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white text-sm font-black text-blue-600">
                G
              </span>
              Continue with Google
            </button>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => useSocialSignup('DigiLocker')}
                className="flex items-center justify-center gap-2 rounded-xl border border-blue-200 bg-blue-50 px-3 py-2.5 text-xs font-bold text-blue-800 transition hover:bg-blue-100 dark:border-blue-800 dark:bg-blue-950/30 dark:text-blue-200"
              >
                <Landmark className="h-4 w-4" /> DigiLocker
              </button>
              <button
                type="button"
                onClick={() => useSocialSignup('Aadhaar eKYC')}
                className="flex items-center justify-center gap-2 rounded-xl border border-orange-200 bg-orange-50 px-3 py-2.5 text-xs font-bold text-orange-800 transition hover:bg-orange-100 dark:border-orange-800 dark:bg-orange-950/30 dark:text-orange-200"
              >
                <ShieldCheck className="h-4 w-4" /> Aadhaar eKYC
              </button>
            </div>
            <div className="flex items-center gap-3 py-2 text-[10px] font-bold uppercase tracking-wider text-slate-400">
              <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" /> or use email{' '}
              <span className="h-px flex-1 bg-slate-200 dark:bg-slate-700" />
            </div>
          </div>
          <form onSubmit={submit} className="space-y-4">
            {isSignup && step === 'form' && (
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Full name
                <div className="relative mt-1.5">
                  <UserRound className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                  <input
                    name="name"
                    value={form.name}
                    onChange={update}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800"
                    placeholder="Your name"
                  />
                </div>
              </label>
            )}
            {step === 'form' && (
              <>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Email address
                  <div className="relative mt-1.5">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      name="email"
                      type="email"
                      pattern="^[^\s@]+@[^\s@]+\.[^\s@]{2,}$"
                      value={form.email}
                      onChange={update}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800"
                      placeholder="you@example.com"
                    />
                  </div>
                </label>
                {isSignup && (
                  <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                    Mobile number
                    <div className="relative mt-1.5">
                      <Smartphone className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                      <input
                        name="phone"
                        type="tel"
                        value={form.phone}
                        onChange={update}
                        required
                        className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800"
                        placeholder="10-digit mobile number"
                      />
                    </div>
                  </label>
                )}
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                  Password
                  <div className="relative mt-1.5">
                    <LockKeyhole className="absolute left-3 top-3 h-4 w-4 text-slate-400" />
                    <input
                      name="password"
                      type="password"
                      value={form.password}
                      onChange={update}
                      required
                      className="w-full rounded-xl border border-slate-200 bg-slate-50 py-2.5 pl-10 pr-3 outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800"
                      placeholder="Minimum 6 characters"
                    />
                  </div>
                </label>
              </>
            )}
            {isSignup && step === 'otp' && (
              <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200">
                Enter OTP
                <div className="mt-1.5">
                  <input
                    name="otp"
                    inputMode="numeric"
                    value={form.otp}
                    onChange={update}
                    required
                    className="w-full rounded-xl border border-slate-200 bg-slate-50 px-3 py-2.5 text-center text-xl tracking-[0.4em] outline-none focus:border-blue-500 dark:border-slate-700 dark:bg-slate-800"
                    placeholder="000000"
                  />
                </div>
              </label>
            )}
            {notice && (
              <p className="rounded-xl bg-amber-50 px-3 py-2 text-xs font-medium text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
                {notice}
              </p>
            )}
            {error && (
              <p className="rounded-xl bg-red-50 px-3 py-2 text-xs font-medium text-red-700 dark:bg-red-950/40 dark:text-red-200">
                {error}
              </p>
            )}
            <button
              type="submit"
              className="w-full rounded-xl bg-gov-blue px-4 py-3 text-sm font-bold text-white shadow-lg shadow-blue-500/20 transition hover:bg-blue-700"
            >
              {isSignup
                ? step === 'form'
                  ? 'Verify mobile & continue'
                  : 'Create account'
                : 'Sign in securely'}
            </button>
          </form>

          {!isSignup && (
            <button
              onClick={useBiometric}
              className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-bold text-emerald-800 transition hover:bg-emerald-100 dark:border-emerald-800 dark:bg-emerald-950/30 dark:text-emerald-300"
            >
              <Fingerprint className="h-4 w-4" /> Use device biometrics
            </button>
          )}
          <button
            onClick={() => {
              setIsSignup(!isSignup);
              setStep('form');
              setError('');
              setNotice('');
            }}
            className="mt-5 w-full text-center text-sm font-semibold text-gov-blue hover:underline dark:text-blue-400"
          >
            {isSignup ? 'Already have an account? Sign in' : 'New citizen? Create an account'}
          </button>
          {!forceOpen && (
            <button
              onClick={onClose}
              className="mt-3 w-full text-center text-xs text-slate-500 hover:text-slate-700 dark:text-slate-400"
            >
              Continue as guest
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
