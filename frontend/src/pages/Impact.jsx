import { useEffect, useState } from 'react';
import { ShieldCheck, BarChart3, Users, Gift, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function Impact() {
  const [stats, setStats] = useState({
    total_donation_amount: 0,
    total_donations_count: 0,
    total_volunteers: 0,
    active_causes_count: 0,
    people_supported: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      try {
        const res = await api.get('/donations/stats/public');
        if (res.success && res.data) {
          setStats(res.data);
        }
      } catch (err) {
        console.error('Error fetching public stats:', err);
      } finally {
        setLoading(false);
      }
    };
    loadStats();
  }, []);

  const allocation = [
    { category: 'Education', percent: 30, color: 'bg-emerald-800' },
    { category: 'Healthcare', percent: 20, color: 'bg-emerald-600' },
    { category: 'Food & Hunger Relief', percent: 20, color: 'bg-amber-600' },
    { category: 'Clean Drinking Water', percent: 15, color: 'bg-blue-600' },
    { category: 'Women Empowerment', percent: 10, color: 'bg-indigo-600' },
    { category: 'Emergency Relief', percent: 5, color: 'bg-red-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
      {/* Title */}
      <div className="border-b border-stone-200 pb-8 text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl">Impact &amp; Transparency</h1>
        <p className="text-stone-500 text-base sm:text-lg">
          We believe in complete transparency. See how your donations translate to real impact on the ground.
        </p>
      </div>

      {/* Dynamic Key Statistics Grid */}
      {loading ? (
        <div className="flex justify-center items-center py-12">
          <Loader2 className="w-6 h-6 text-brand-green-800 animate-spin" />
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="bg-white border border-stone-100 p-6 rounded-lg shadow-sm text-center">
            <Gift className="w-6 h-6 text-brand-gold-500 mx-auto mb-2" />
            <span className="text-2xl font-extrabold text-brand-green-800 block">
              ₹{stats.total_donation_amount.toLocaleString('en-IN')}
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mt-1">Total Raised</span>
          </div>

          <div className="bg-white border border-stone-100 p-6 rounded-lg shadow-sm text-center">
            <BarChart3 className="w-6 h-6 text-brand-gold-500 mx-auto mb-2" />
            <span className="text-2xl font-extrabold text-brand-green-800 block">
              {stats.total_donations_count}
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mt-1">Donations Received</span>
          </div>

          <div className="bg-white border border-stone-100 p-6 rounded-lg shadow-sm text-center">
            <Users className="w-6 h-6 text-brand-gold-500 mx-auto mb-2" />
            <span className="text-2xl font-extrabold text-brand-green-800 block">
              {stats.total_volunteers}
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mt-1">Active Volunteers</span>
          </div>

          <div className="bg-white border border-stone-100 p-6 rounded-lg shadow-sm text-center">
            <ShieldCheck className="w-6 h-6 text-brand-gold-500 mx-auto mb-2" />
            <span className="text-2xl font-extrabold text-brand-green-800 block">
              {stats.people_supported}+
            </span>
            <span className="text-[11px] font-bold uppercase tracking-wider text-stone-400 block mt-1">People Supported</span>
          </div>
        </div>
      )}

      {/* Allocation breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="space-y-2">
            <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Where Your Donation Goes</h2>
            <p className="text-stone-500 text-sm leading-relaxed">
              To assure financial safety, we allocate funds to specific cause silos. These percentages represent our target framework, audited under Section 80G guidelines.
            </p>
          </div>

          <div className="space-y-4">
            {allocation.map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between items-center text-xs font-semibold text-zinc-700">
                  <span>{item.category}</span>
                  <span>{item.percent}%</span>
                </div>
                <div className="w-full h-3 bg-stone-100 rounded overflow-hidden">
                  <div className={`h-full ${item.color} rounded`} style={{ width: `${item.percent}%` }}></div>
                </div>
              </div>
            ))}
          </div>
          
          <p className="text-[10px] text-stone-400 italic">
            *Percentages shown represent targeted operational distributions based on current active initiatives.
          </p>
        </div>

        {/* Detailed text explanation card */}
        <div className="bg-white border border-stone-100 p-8 rounded-xl shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-zinc-900 border-b border-stone-100 pb-3">Transparency Commitment</h3>
          
          <div className="space-y-4 text-xs sm:text-sm text-stone-600 leading-relaxed">
            <p>
              <strong>No Administrative Cuts:</strong> We are funded separately by trustees for our operating/administrative costs. This means 100% of your public donations are directed strictly to purchasing community relief goods.
            </p>
            <p>
              <strong>Verified Delivery Reports:</strong> For every project completed (like installing an RO filter or distributing text modules), we upload delivery signatures and photos directly to our Success Stories section.
            </p>
            <p>
              <strong>Receipts &amp; Auditing:</strong> Every payment yields an instant downloadable transaction receipt detailing tax-exempt NGO certification credentials.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
