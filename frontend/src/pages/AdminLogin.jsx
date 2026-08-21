import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, Mail, Lock, Loader2, ArrowLeft } from 'lucide-react';
import api from '../services/api';

export default function AdminLogin() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // If already logged in, redirect to dashboard
  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (token) {
      navigate('/admin/dashboard', { replace: true });
    }
  }, [navigate]);

  const handleLogin = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    if (!email || !password) {
      setErrorMsg('Please enter both email and password.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.success && res.data) {
        localStorage.setItem('adminToken', res.data.token);
        localStorage.setItem('adminName', res.data.admin.name);
        localStorage.setItem('adminEmail', res.data.admin.email);
        navigate('/admin/dashboard', { replace: true });
      } else {
        setErrorMsg(res.message || 'Login failed.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'Invalid credentials or database connection failed.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col justify-center items-center px-4 sm:px-6 font-sans">
      <Link
        to="/"
        className="inline-flex items-center space-x-1 text-xs text-stone-500 hover:text-brand-green-800 transition mb-6"
      >
        <ArrowLeft className="w-3.5 h-3.5" />
        <span>Return to Main Website</span>
      </Link>

      <div className="bg-white border border-stone-200 shadow-md rounded-lg max-w-sm w-full p-8 space-y-6">
        {/* Title */}
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-brand-green-50 rounded-full flex items-center justify-center mx-auto text-brand-green-800 border border-brand-green-100">
            <ShieldCheck className="w-6 h-6 text-brand-gold-500 fill-current" />
          </div>
          <div>
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 leading-none">Admin Portal</h2>
            <span className="text-[10px] uppercase font-semibold text-stone-400 tracking-wider mt-1 block">
              Authorized Personnel Only
            </span>
          </div>
        </div>

        {errorMsg && (
          <div className="bg-red-50 text-red-800 text-xs px-4 py-2.5 rounded border border-red-200 font-medium">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-700 block uppercase tracking-wide">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="email"
                required
                placeholder="admin@humhelpngo.org"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-stone-200 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-brand-green-800"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-700 block uppercase tracking-wide">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-9 pr-4 py-2 text-sm border border-stone-200 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-brand-green-800"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center py-2.5 rounded text-sm font-semibold text-white bg-brand-green-800 hover:bg-brand-green-900 shadow-sm transition"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span>Authenticating session...</span>
              </>
            ) : (
              <span>Sign In</span>
            )}
          </button>
        </form>

        <div className="text-[10px] text-stone-400 leading-relaxed text-center border-t border-stone-100 pt-4">
          To register a new admin credentials locally, run the CLI utility:<br />
          <code className="bg-stone-50 text-zinc-600 px-1 py-0.5 rounded select-all font-mono font-bold block mt-1">
            python create_admin.py
          </code>
        </div>
      </div>
    </div>
  );
}
