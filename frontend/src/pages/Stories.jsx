import { useEffect, useState } from 'react';
import { Search, Loader2, AlertCircle, Sparkles, BookOpen } from 'lucide-react';
import api from '../services/api';

export default function Stories() {
  const [stories, setStories] = useState([]);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadStories = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get('/stories');
        setStories(res.data || []);
      } catch (err) {
        setError(err.message || 'Failed to retrieve success stories.');
      } finally {
        setLoading(false);
      }
    };
    loadStories();
  }, []);

  const filteredStories = stories.filter((s) => {
    return s.title.toLowerCase().includes(search.toLowerCase()) || 
           s.description.toLowerCase().includes(search.toLowerCase()) ||
           s.category.toLowerCase().includes(search.toLowerCase());
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
      {/* Title */}
      <div className="border-b border-stone-200 pb-8 text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl">Success Stories</h1>
        <p className="text-stone-500 text-base sm:text-lg">
          Read inspiring reports on how community donations changed real lives on the ground.
        </p>
      </div>

      {/* Search Toolbar */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 bg-white border border-stone-100 p-4 rounded-lg shadow-sm">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 text-stone-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search stories..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 pr-4 py-2 border border-stone-200 rounded-md w-full text-sm focus:outline-none focus:ring-1 focus:ring-brand-green-800"
          />
        </div>
        <div className="text-xs text-stone-400 font-medium">
          Showing {filteredStories.length} completed reports
        </div>
      </div>

      {/* Grid List */}
      {loading ? (
        <div className="flex flex-col items-center justify-center py-24 space-y-3">
          <Loader2 className="w-8 h-8 text-brand-green-800 animate-spin" />
          <span className="text-sm text-stone-500">Retrieving success logs...</span>
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
      ) : filteredStories.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-lg border border-stone-100 shadow-sm space-y-4">
          <BookOpen className="w-12 h-12 text-stone-300 mx-auto" />
          <div className="max-w-xs mx-auto space-y-1">
            <h3 className="font-bold text-base text-zinc-800">No stories found</h3>
            <p className="text-xs text-stone-500">
              There are no published reports matching your search parameters.
            </p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {filteredStories.map((story) => (
            <div
              key={story.id}
              className="bg-white border border-stone-100 rounded-lg shadow-sm hover:shadow-md transition-shadow overflow-hidden flex flex-col h-full"
            >
              {/* Image */}
              <div
                className="h-48 w-full bg-cover bg-center bg-stone-100 flex-shrink-0"
                style={{ backgroundImage: `url('${story.image}')` }}
              ></div>

              {/* Content */}
              <div className="p-6 flex-grow flex flex-col space-y-4">
                <div className="flex justify-between items-center flex-shrink-0">
                  <span className="inline-block px-2 py-0.5 bg-brand-green-50 text-brand-green-800 rounded text-[10px] font-bold uppercase tracking-wider">
                    {story.category}
                  </span>
                  <span className="text-[10px] text-stone-400 font-semibold">
                    {new Date(story.created_at).toLocaleDateString('en-US', {
                      year: 'numeric',
                      month: 'short',
                      day: 'numeric',
                    })}
                  </span>
                </div>

                <h3 className="text-base font-bold text-zinc-900 line-clamp-1">{story.title}</h3>
                <p className="text-xs sm:text-sm text-stone-500 leading-relaxed line-clamp-5 flex-grow">
                  {story.description}
                </p>
                
                <div className="pt-3 border-t border-stone-100 flex items-center space-x-1.5 text-xs text-brand-green-800 font-bold uppercase tracking-wider flex-shrink-0">
                  <Sparkles className="w-3.5 h-3.5 fill-current text-brand-gold-500" />
                  <span>Audited Initiative</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
