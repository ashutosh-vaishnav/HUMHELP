import { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link } from 'react-router-dom';
import { ShieldCheck, LogOut, ArrowLeft } from 'lucide-react';

export default function AdminLayout() {
  const navigate = useNavigate();
  const [token, setToken] = useState(localStorage.getItem('adminToken'));
  const [adminName, setAdminName] = useState(localStorage.getItem('adminName') || 'Admin');

  useEffect(() => {
    if (!token) {
      navigate('/admin/login', { replace: true });
    }
  }, [token, navigate]);

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminName');
    localStorage.removeItem('adminEmail');
    setToken(null);
    navigate('/admin/login', { replace: true });
  };

  if (!token) return null;

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans">
      {/* Admin header */}
      <header className="bg-brand-green-900 text-stone-100 h-16 px-4 sm:px-6 flex justify-between items-center shadow border-b border-brand-green-800 sticky top-0 z-30">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded bg-brand-green-800 flex items-center justify-center text-white border border-brand-green-700">
            <ShieldCheck className="w-5 h-5 text-brand-gold-500 fill-current" />
          </div>
          <div>
            <h1 className="text-base font-bold tracking-tight text-white leading-none">HUMHELP NGO</h1>
            <span className="text-[10px] uppercase font-bold tracking-wider text-brand-gold-100 mt-1 block">Administration Panel</span>
          </div>
        </div>
        
        <div className="flex items-center space-x-4">
          <Link
            to="/"
            className="hidden sm:inline-flex items-center space-x-1.5 text-xs text-stone-300 hover:text-white transition"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>View Website</span>
          </Link>
          <span className="text-xs text-stone-300 hidden md:inline">
            Active: <strong className="text-white">{adminName}</strong>
          </span>
          <button
            onClick={handleLogout}
            className="flex items-center space-x-1.5 bg-brand-green-800 hover:bg-brand-green-950 text-stone-200 hover:text-white px-3 py-1.5 rounded text-xs transition duration-200 border border-brand-green-700/50"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Logout</span>
          </button>
        </div>
      </header>

      {/* Main Admin Workspace Container */}
      <div className="flex-grow flex flex-col">
        <Outlet />
      </div>
    </div>
  );
}
