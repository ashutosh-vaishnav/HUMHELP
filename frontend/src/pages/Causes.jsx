import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Loader2, AlertCircle, Compass } from 'lucide-react';
import api from '../services/api';

export default function Causes() {
  const [causes, setCauses] = useState([]);
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const categories = ['All', 'Education', 'Clean Water', 'Food & Hunger', 'Healthcare', 'Women Empowerment', 'Disaster Relief'];

  useEffect(() => {
    const loadCauses = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/causes');
        setCauses(res.data || []);
      } catch (err) {
        setError(err.message || 'Failed to retrieve active causes.');
      } finally {
        setLoading(false);
      }
    };
    loadCauses();
  }, []);

  // Filter logic
  const filteredCauses = causes.filter((c) => {
    const matchesSearch = c.title.toLowerCase().includes(search.toLowerCase()) || 
                          c.description.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = activeCategory === 'All' || c.category === activeCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
      {/* Header */}
      <div className="border-b border-stone-200 pb-8 text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl">Ongoing Campaigns</h1>
        <p className="text-stone-500 text-base sm:text-lg">
          Support verified initiatives directly. All donation amounts are updated in real-time on these progress bars.
        </p>
      </div>

      {/* Filters & Search Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white border border-stone-100 p-4 rounded-lg shadow-sm">
        {/* Search */}
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search campaigns..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-stone-200 rounded-md w-full text-sm focus:outline-none focus:ring-1 focus:ring-brand-green-800"
          />
        </div>

        {/* Category Pill Filters */}
        <div className="flex items-center space-x-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-thin">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-md text-xs font-semibold whitespace-nowrap transition-colors ${
                activeCategory === cat
                  ? 'bg-brand-green-800 text-white shadow-sm'
                  : 'bg-stone-50 text-stone-600 hover:bg-stone-100 hover:text-brand-green-800'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Main Campaign Grid */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-3">
          <Loader2 className="w-8 h-8 text-brand-green-800 animate-spin" />
          <span className="text-sm text-stone-500 font-medium">Retrieving active campaigns...</span>
        </div>
      ) : error ? (
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-lg mx-auto flex items-start space-x-3 text-red-800 shadow-sm">
          <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-bold text-sm">Failed to Load</h3>
            <p className="text-xs text-red-700 mt-1">{error}</p>
            <button onClick={() => window.location.reload()} className="text-xs underline font-bold mt-2 hover:text-red-950">
              Try Again
            </button>
          </div>
        </div>
      ) : filteredCauses.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg border border-stone-100 shadow-sm space-y-4">
          <Compass className="w-12 h-12 text-stone-300 mx-auto" />
          <div className="max-w-xs mx-auto space-y-1">
            <h3 className="font-bold text-base text-zinc-800">No campaigns found</h3>
            <p className="text-xs text-stone-500">
              There are no active causes matching your selected filters at this moment.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredCauses.map((cause) => {
            const pct = Math.min(100, Math.round((cause.raised_amount / cause.target_amount) * 100));
            return (
              <div
                key={cause.id}
                className="bg-white border border-stone-100 rounded-lg shadow-sm hover:shadow-md hover:scale-[1.01] transition-all duration-300 overflow-hidden flex flex-col h-full"
              >
                {/* Cause Image */}
                <div
                  className="h-48 w-full bg-cover bg-center bg-stone-100 flex-shrink-0"
                  style={{ backgroundImage: `url('${cause.image}')` }}
                ></div>

                {/* Content */}
                <div className="p-6 flex-grow flex flex-col space-y-4">
                  <span className="inline-block self-start px-2 py-0.5 bg-brand-green-50 text-brand-green-800 rounded text-[11px] font-bold uppercase tracking-wider">
                    {cause.category}
                  </span>

                  <h3 className="text-lg font-bold text-zinc-900 line-clamp-1">{cause.title}</h3>
                  <p className="text-xs sm:text-sm text-stone-500 leading-relaxed line-clamp-3 flex-grow">
                    {cause.description}
                  </p>

                  {/* Progress panel */}
                  <div className="space-y-2 pt-2 border-t border-stone-100 flex-shrink-0">
                    <div className="flex justify-between items-center text-xs font-semibold">
                      <span className="text-zinc-800">₹{cause.raised_amount.toLocaleString('en-IN')} raised</span>
                      <span className="text-stone-400">target: ₹{cause.target_amount.toLocaleString('en-IN')}</span>
                    </div>

                    {/* Progress bar line */}
                    <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                      <div
                        className="h-full bg-brand-green-800 rounded-full transition-all duration-500"
                        style={{ width: `${pct}%` }}
                      ></div>
                    </div>

                    <span className="text-[10px] uppercase font-bold tracking-wider text-brand-green-800 block text-right">
                      {pct}% funded
                    </span>
                  </div>

                  {/* CTA Buttons */}
                  <div className="grid grid-cols-2 gap-3 pt-2 flex-shrink-0">
                    <Link
                      to={`/donate?causeId=${cause.id}&category=${encodeURIComponent(cause.category)}`}
                      className="inline-flex justify-center items-center py-2.5 rounded text-xs font-semibold text-white bg-brand-green-800 hover:bg-brand-green-900 shadow-sm transition"
                    >
                      Donate
                    </Link>
                    <Link
                      to={`/donate?causeId=${cause.id}&category=${encodeURIComponent(cause.category)}`}
                      className="inline-flex justify-center items-center py-2.5 rounded text-xs font-semibold text-stone-700 bg-stone-50 hover:bg-stone-100 border border-stone-200 transition"
                    >
                      Learn More
                    </Link>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
