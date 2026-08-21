import { useState, useEffect } from 'react';
import {
  LayoutDashboard,
  Gift,
  Users,
  Compass,
  BookOpen,
  Mail,
  Loader2,
  Plus,
  Trash2,
  Check,
  X,
  FileSpreadsheet,
  Printer
} from 'lucide-react';
import api from '../services/api';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('overview');
  
  // Dynamic statistics data
  const [stats, setStats] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  // Lists state
  const [donations, setDonations] = useState([]);
  const [volunteers, setVolunteers] = useState([]);
  const [causes, setCauses] = useState([]);
  const [stories, setStories] = useState([]);
  const [messages, setMessages] = useState([]);

  // Loadings
  const [listLoading, setListLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  // Modals / Editors state
  const [causeModal, setCauseModal] = useState({ open: false, isEdit: false, data: null });
  const [storyModal, setStoryModal] = useState({ open: false, isEdit: false, data: null });
  
  // Search / Filters state
  const [donationFilter, setDonationFilter] = useState({ search: '', category: '' });
  const [volunteerFilter, setVolunteerFilter] = useState({ search: '', status: '' });
  
  // Temp form states
  const [causeForm, setCauseForm] = useState({ title: '', category: 'Education', target_amount: '', raised_amount: '0', image: '', status: 'active', description: '' });
  const [storyForm, setStoryForm] = useState({ title: '', category: 'Education', image: '', status: 'published', description: '' });

  // Initial stats loader
  const loadStats = async () => {
    setStatsLoading(true);
    try {
      const res = await api.get('/admin/dashboard');
      if (res.success && res.data) {
        setStats(res.data);
      }
    } catch (err) {
      console.error(err);
      setErrorMsg(err.message || 'Failed to load dashboard metrics.');
    } finally {
      setStatsLoading(false);
    }
  };

  useEffect(() => {
    loadStats();
  }, []);

  // General tab loaders
  const loadTabList = async (tab) => {
    setListLoading(true);
    setErrorMsg('');
    try {
      if (tab === 'donations') {
        const res = await api.get('/donations?status=success');
        setDonations(res.data || []);
      } else if (tab === 'volunteers') {
        const res = await api.get('/volunteers');
        setVolunteers(res.data || []);
      } else if (tab === 'causes') {
        const res = await api.get('/causes?all=true');
        setCauses(res.data || []);
      } else if (tab === 'stories') {
        const res = await api.get('/stories?all=true');
        setStories(res.data || []);
      } else if (tab === 'messages') {
        const res = await api.get('/contact');
        setMessages(res.data || []);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Failed to load directory details.');
    } finally {
      setListLoading(false);
    }
  };

  useEffect(() => {
    if (activeTab !== 'overview') {
      loadTabList(activeTab);
    } else {
      loadStats();
    }
  }, [activeTab]);

  // VOLUNTEER Actions
  const handleVolunteerStatus = async (id, status) => {
    setActionLoading(true);
    try {
      await api.put(`/volunteers/${id}`, { status });
      loadTabList('volunteers');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update volunteer status.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleVolunteerDelete = async (id) => {
    if (!window.confirm('Delete this volunteer record?')) return;
    setActionLoading(true);
    try {
      await api.delete(`/volunteers/${id}`);
      loadTabList('volunteers');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to delete volunteer.');
    } finally {
      setActionLoading(false);
    }
  };

  // CAUSE Actions
  const handleCauseSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      if (causeModal.isEdit) {
        await api.put(`/causes/${causeModal.data.id}`, causeForm);
      } else {
        await api.post('/causes', causeForm);
      }
      setCauseModal({ open: false, isEdit: false, data: null });
      loadTabList('causes');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to write campaign record.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleCauseDelete = async (id) => {
    if (!window.confirm('Delete this campaign?')) return;
    setActionLoading(true);
    try {
      await api.delete(`/causes/${id}`);
      loadTabList('causes');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to delete cause.');
    } finally {
      setActionLoading(false);
    }
  };

  const openCauseEditor = (cause = null) => {
    setErrorMsg('');
    if (cause) {
      setCauseForm({
        title: cause.title,
        category: cause.category,
        target_amount: cause.target_amount.toString(),
        raised_amount: cause.raised_amount.toString(),
        image: cause.image,
        status: cause.status,
        description: cause.description,
      });
      setCauseModal({ open: true, isEdit: true, data: cause });
    } else {
      setCauseForm({ title: '', category: 'Education', target_amount: '', raised_amount: '0', image: '', status: 'active', description: '' });
      setCauseModal({ open: true, isEdit: false, data: null });
    }
  };

  // STORY Actions
  const handleStorySubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);
    try {
      if (storyModal.isEdit) {
        await api.put(`/stories/${storyModal.data.id}`, storyForm);
      } else {
        await api.post('/stories', storyForm);
      }
      setStoryModal({ open: false, isEdit: false, data: null });
      loadTabList('stories');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to save story.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleStoryDelete = async (id) => {
    if (!window.confirm('Delete this story?')) return;
    setActionLoading(true);
    try {
      await api.delete(`/stories/${id}`);
      loadTabList('stories');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to delete story.');
    } finally {
      setActionLoading(false);
    }
  };

  const openStoryEditor = (story = null) => {
    setErrorMsg('');
    if (story) {
      setStoryForm({
        title: story.title,
        category: story.category,
        image: story.image,
        status: story.status,
        description: story.description,
      });
      setStoryModal({ open: true, isEdit: true, data: story });
    } else {
      setStoryForm({ title: '', category: 'Education', image: '', status: 'published', description: '' });
      setStoryModal({ open: true, isEdit: false, data: null });
    }
  };

  // MESSAGE Actions
  const handleMessageStatus = async (id, status) => {
    setActionLoading(true);
    try {
      await api.put(`/contact/${id}`, { status });
      loadTabList('messages');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to update message status.');
    } finally {
      setActionLoading(false);
    }
  };

  const handleMessageDelete = async (id) => {
    if (!window.confirm('Delete this message?')) return;
    setActionLoading(true);
    try {
      await api.delete(`/contact/${id}`);
      loadTabList('messages');
    } catch (err) {
      setErrorMsg(err.message || 'Failed to delete message.');
    } finally {
      setActionLoading(false);
    }
  };

  // Export helper
  const handleExportCSV = (listName, dataList) => {
    if (dataList.length === 0) return;
    const headers = Object.keys(dataList[0]).join(',');
    const rows = dataList.map(row => 
      Object.values(row).map(val => `"${String(val).replace(/"/g, '""')}"`).join(',')
    );
    const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `${listName}_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Filters logic
  const filteredDonations = donations.filter(d => {
    const term = donationFilter.search.toLowerCase();
    const matchSearch = d.donation_id.toLowerCase().includes(term) ||
                        d.donor_name.toLowerCase().includes(term) ||
                        d.email.toLowerCase().includes(term) ||
                        d.payment_id.toLowerCase().includes(term);
    const matchCat = !donationFilter.category || d.category === donationFilter.category;
    return matchSearch && matchCat;
  });

  const filteredVolunteers = volunteers.filter(v => {
    const term = volunteerFilter.search.toLowerCase();
    const matchSearch = v.volunteer_id.toLowerCase().includes(term) ||
                        v.name.toLowerCase().includes(term) ||
                        v.email.toLowerCase().includes(term) ||
                        v.city.toLowerCase().includes(term);
    const matchStatus = !volunteerFilter.status || v.status === volunteerFilter.status;
    return matchSearch && matchStatus;
  });

  return (
    <div className="flex-grow flex flex-col md:flex-row overflow-hidden">
      {/* Sidebar Nav Tab Toggler */}
      <aside className="w-full md:w-64 bg-zinc-900 text-stone-300 flex-shrink-0 border-r border-zinc-800 flex flex-col justify-between py-6 md:h-[calc(100vh-64px)] sticky top-16 z-20">
        <div className="space-y-1.5 px-4">
          <span className="text-[10px] uppercase font-bold tracking-wider text-zinc-500 block px-3 mb-2">DIRECTORY</span>
          {[
            { id: 'overview', name: 'Overview', icon: <LayoutDashboard className="w-4 h-4" /> },
            { id: 'donations', name: 'Donations Log', icon: <Gift className="w-4 h-4" /> },
            { id: 'volunteers', name: 'Volunteers List', icon: <Users className="w-4 h-4" /> },
            { id: 'causes', name: 'Manage Campaigns', icon: <Compass className="w-4 h-4" /> },
            { id: 'stories', name: 'Success Stories', icon: <BookOpen className="w-4 h-4" /> },
            { id: 'messages', name: 'Message Inbox', icon: <Mail className="w-4 h-4" /> }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`w-full flex items-center space-x-2.5 px-3 py-2.5 rounded text-sm font-semibold transition-all ${
                activeTab === tab.id
                  ? 'bg-brand-green-800 text-white shadow'
                  : 'hover:bg-zinc-800 hover:text-white'
              }`}
            >
              {tab.icon}
              <span>{tab.name}</span>
            </button>
          ))}
        </div>

        <div className="px-7 text-[10px] text-zinc-600 leading-relaxed font-semibold">
          HUMHELP NGO ADMIN<br />
          Version 1.0.0 (Release-Build)<br />
          Host: Localhost:5000
        </div>
      </aside>

      {/* Main Workspace Dashboard Content */}
      <main className="flex-grow p-6 sm:p-8 overflow-y-auto bg-stone-50 md:h-[calc(100vh-64px)]">
        {errorMsg && (
          <div className="bg-red-50 text-red-800 text-xs px-4 py-2.5 rounded border border-red-200 font-medium mb-6">
            {errorMsg}
          </div>
        )}

        {/* ==================== 1. OVERVIEW TAB ==================== */}
        {activeTab === 'overview' && (
          <div className="space-y-8">
            <h2 className="text-xl font-bold tracking-tight text-zinc-900 border-b border-stone-200 pb-3">
              Operational Metrics Overview
            </h2>

            {statsLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-8 h-8 text-brand-green-800 animate-spin" />
              </div>
            ) : stats ? (
              <>
                {/* Stats cards Grid */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                  <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-sm">
                    <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wide block">Total Raised</span>
                    <strong className="text-2xl font-extrabold text-brand-green-800 block mt-1">
                      ₹{stats.overview.total_donation_amount.toLocaleString('en-IN')}
                    </strong>
                  </div>
                  <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-sm">
                    <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wide block">Donations Count</span>
                    <strong className="text-2xl font-extrabold text-zinc-800 block mt-1">
                      {stats.overview.total_donations_count}
                    </strong>
                  </div>
                  <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-sm">
                    <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wide block">Total Volunteers</span>
                    <strong className="text-2xl font-extrabold text-zinc-800 block mt-1">
                      {stats.overview.total_volunteers} <span className="text-xs text-stone-400 font-medium">({stats.overview.pending_volunteers} pending)</span>
                    </strong>
                  </div>
                  <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-sm">
                    <span className="text-[10px] uppercase font-bold text-stone-400 tracking-wide block">New Messages</span>
                    <strong className="text-2xl font-extrabold text-brand-gold-500 block mt-1">
                      {stats.overview.new_messages}
                    </strong>
                  </div>
                </div>

                {/* Aggregated Visual Lists */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 pt-4">
                  {/* Category aggregates */}
                  <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-zinc-800 border-b border-stone-100 pb-2">Donations by Category</h3>
                    {stats.charts.donations_by_category.length === 0 ? (
                      <p className="text-xs text-stone-400">No logs found.</p>
                    ) : (
                      <div className="space-y-3">
                        {stats.charts.donations_by_category.map((item, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold text-stone-600">
                              <span>{item.category} ({item.count} items)</span>
                              <span>₹{item.amount.toLocaleString('en-IN')}</span>
                            </div>
                            <div className="w-full h-2 bg-stone-100 rounded overflow-hidden">
                              <div
                                className="h-full bg-brand-green-800 rounded"
                                style={{
                                  width: `${Math.min(100, (item.amount / stats.overview.total_donation_amount) * 100)}%`
                                }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>

                  {/* Campaign Progress aggregates */}
                  <div className="bg-white border border-stone-200 rounded-lg p-6 shadow-sm space-y-4">
                    <h3 className="text-sm font-bold text-zinc-800 border-b border-stone-100 pb-2">Campaign funding status</h3>
                    {stats.charts.campaign_progress.length === 0 ? (
                      <p className="text-xs text-stone-400">No campaigns active.</p>
                    ) : (
                      <div className="space-y-3">
                        {stats.charts.campaign_progress.map((item, idx) => (
                          <div key={idx} className="space-y-1">
                            <div className="flex justify-between text-xs font-semibold text-stone-600">
                              <span className="truncate max-w-xs">{item.title}</span>
                              <span>{item.percentage}% ({Math.round(item.raised / 1000)}k/{Math.round(item.target / 1000)}k)</span>
                            </div>
                            <div className="w-full h-2 bg-stone-100 rounded overflow-hidden">
                              <div
                                className="h-full bg-brand-gold-500 rounded"
                                style={{ width: `${item.percentage}%` }}
                              ></div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </>
            ) : null}
          </div>
        )}

        {/* ==================== 2. DONATIONS TAB ==================== */}
        {activeTab === 'donations' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 border-b border-stone-200 pb-3">
              <h2 className="text-xl font-bold tracking-tight text-zinc-900">Donations Register</h2>
              <button
                onClick={() => handleExportCSV('donations', filteredDonations)}
                className="inline-flex items-center space-x-1 bg-white hover:bg-stone-50 text-stone-700 font-semibold px-3 py-1.5 rounded border border-stone-200 text-xs transition"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>

            {/* Filter toolbar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white border border-stone-100 p-4 rounded-lg shadow-sm">
              <input
                type="text"
                placeholder="Search Donation ID, donor name, email..."
                value={donationFilter.search}
                onChange={(e) => setDonationFilter({ ...donationFilter, search: e.target.value })}
                className="px-3 py-1.5 text-xs border border-stone-200 rounded focus:outline-none focus:ring-1 focus:ring-brand-green-800"
              />
              <select
                value={donationFilter.category}
                onChange={(e) => setDonationFilter({ ...donationFilter, category: e.target.value })}
                className="px-3 py-1.5 text-xs border border-stone-200 rounded bg-white focus:outline-none"
              >
                <option value="">All Categories</option>
                {['Education', 'Clean Water', 'Food & Hunger', 'Healthcare', 'Women Empowerment', 'Disaster Relief'].map(c => (
                  <option key={c} value={c}>{c}</option>
                ))}
              </select>
            </div>

            {listLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-brand-green-800" />
              </div>
            ) : filteredDonations.length === 0 ? (
              <p className="text-center text-xs text-stone-400 py-12">No success transaction records found.</p>
            ) : (
              <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-stone-50 border-b border-stone-200 text-stone-400 font-bold uppercase tracking-wider">
                        <th className="p-4">Donation ID</th>
                        <th className="p-4">Donor Details</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">Amount</th>
                        <th className="p-4">Receipt ID</th>
                        <th className="p-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredDonations.map((don) => (
                        <tr key={don.id} className="hover:bg-stone-50/50">
                          <td className="p-4 font-mono font-bold text-brand-green-800">{don.donation_id}</td>
                          <td className="p-4">
                            <span className="font-semibold text-zinc-900 block">{don.donor_name}</span>
                            <span className="text-[10px] text-stone-400 block">{don.donor_email}</span>
                          </td>
                          <td className="p-4 font-medium text-stone-600">{don.category}</td>
                          <td className="p-4 font-bold text-zinc-800">₹{don.amount.toLocaleString('en-IN')}</td>
                          <td className="p-4 font-mono text-[10px] text-stone-500">{don.payment_id}</td>
                          <td className="p-4">
                            <button
                              onClick={() => {
                                const receiptWindow = window.open(`/donate/receipt/${don.donation_id}`, '_blank');
                                if (receiptWindow) {
                                  receiptWindow.location.href = `/donate?causeId=&category=&verifyConfirm=true&receipt_preview=${don.donation_id}`;
                                }
                              }}
                              className="inline-flex items-center space-x-1 text-stone-600 hover:text-brand-green-800 font-semibold"
                            >
                              <Printer className="w-3.5 h-3.5" />
                              <span>View Receipt</span>
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== 3. VOLUNTEERS TAB ==================== */}
        {activeTab === 'volunteers' && (
          <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:justify-between items-start sm:items-center gap-4 border-b border-stone-200 pb-3">
              <h2 className="text-xl font-bold tracking-tight text-zinc-900">Volunteers Database</h2>
              <button
                onClick={() => handleExportCSV('volunteers', filteredVolunteers)}
                className="inline-flex items-center space-x-1 bg-white hover:bg-stone-50 text-stone-700 font-semibold px-3 py-1.5 rounded border border-stone-200 text-xs transition"
              >
                <FileSpreadsheet className="w-3.5 h-3.5" />
                <span>Export CSV</span>
              </button>
            </div>

            {/* Filter toolbar */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 bg-white border border-stone-100 p-4 rounded-lg shadow-sm">
              <input
                type="text"
                placeholder="Search Name, Email, Volunteer ID..."
                value={volunteerFilter.search}
                onChange={(e) => setVolunteerFilter({ ...volunteerFilter, search: e.target.value })}
                className="px-3 py-1.5 text-xs border border-stone-200 rounded focus:outline-none focus:ring-1 focus:ring-brand-green-800"
              />
              <select
                value={volunteerFilter.status}
                onChange={(e) => setVolunteerFilter({ ...volunteerFilter, status: e.target.value })}
                className="px-3 py-1.5 text-xs border border-stone-200 rounded bg-white focus:outline-none"
              >
                <option value="">All Statuses</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {listLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-brand-green-800" />
              </div>
            ) : filteredVolunteers.length === 0 ? (
              <p className="text-center text-xs text-stone-400 py-12">No volunteers found.</p>
            ) : (
              <div className="bg-white border border-stone-200 rounded-lg shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-stone-50 border-b border-stone-200 text-stone-400 font-bold uppercase tracking-wider">
                        <th className="p-4">Volunteer ID</th>
                        <th className="p-4">Contact Details</th>
                        <th className="p-4">Availability</th>
                        <th className="p-4">Interests &amp; Skills</th>
                        <th className="p-4">Motivation</th>
                        <th className="p-4">Status</th>
                        <th className="p-4 text-right">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-stone-100">
                      {filteredVolunteers.map((vol) => (
                        <tr key={vol.id} className="hover:bg-stone-50/50">
                          <td className="p-4 font-mono font-bold text-brand-green-800">{vol.volunteer_id}</td>
                          <td className="p-4 space-y-0.5">
                            <span className="font-semibold text-zinc-900 block">{vol.name} ({vol.age}y)</span>
                            <span className="text-[10px] text-stone-400 block">{vol.email}</span>
                            <span className="text-[10px] text-stone-400 block">{vol.phone} | {vol.city}</span>
                          </td>
                          <td className="p-4 capitalize text-stone-600 font-medium">{vol.availability}</td>
                          <td className="p-4 space-y-1">
                            <div className="flex flex-wrap gap-1">
                              {vol.interests.map(i => (
                                <span key={i} className="px-1.5 py-0.5 bg-stone-100 text-stone-600 rounded text-[9px] font-bold">{i}</span>
                              ))}
                            </div>
                            <span className="text-[10px] text-stone-400 italic block mt-1">Skills: {vol.skills.join(', ') || 'None'}</span>
                          </td>
                          <td className="p-4 text-stone-500 max-w-xs truncate" title={vol.reason}>{vol.reason}</td>
                          <td className="p-4">
                            <span className={`px-2 py-0.5 rounded text-[9px] uppercase tracking-wider font-bold border ${
                              vol.status === 'approved'
                                ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                                : vol.status === 'rejected'
                                ? 'bg-red-50 text-red-700 border-red-200'
                                : 'bg-amber-50 text-amber-700 border-amber-200'
                            }`}>
                              {vol.status}
                            </span>
                          </td>
                          <td className="p-4 text-right space-x-1 whitespace-nowrap">
                            {vol.status !== 'approved' && (
                              <button
                                onClick={() => handleVolunteerStatus(vol.id, 'approved')}
                                className="p-1 text-emerald-600 hover:bg-emerald-50 rounded"
                                title="Approve"
                                disabled={actionLoading}
                              >
                                <Check className="w-4 h-4" />
                              </button>
                            )}
                            {vol.status !== 'rejected' && (
                              <button
                                onClick={() => handleVolunteerStatus(vol.id, 'rejected')}
                                className="p-1 text-amber-600 hover:bg-amber-50 rounded"
                                title="Reject"
                                disabled={actionLoading}
                              >
                                <X className="w-4 h-4" />
                              </button>
                            )}
                            <button
                              onClick={() => handleVolunteerDelete(vol.id)}
                              className="p-1 text-red-600 hover:bg-red-50 rounded"
                              title="Delete"
                              disabled={actionLoading}
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}
          </div>
        )}

        {/* ==================== 4. CAMPAIGNS TAB ==================== */}
        {activeTab === 'causes' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-stone-200 pb-3">
              <h2 className="text-xl font-bold tracking-tight text-zinc-900 font-sans">Active NGO Campaigns</h2>
              <button
                onClick={() => openCauseEditor()}
                className="inline-flex items-center space-x-1 text-xs font-semibold bg-brand-green-800 hover:bg-brand-green-900 text-white px-3 py-1.5 rounded shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Campaign</span>
              </button>
            </div>

            {/* Editor Modal */}
            {causeModal.open && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                <form
                  onSubmit={handleCauseSubmit}
                  className="bg-white border border-stone-200 rounded-lg p-6 shadow-xl max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto"
                >
                  <h3 className="text-base font-bold text-zinc-900 border-b border-stone-100 pb-2">
                    {causeModal.isEdit ? 'Edit Campaign Details' : 'Create New NGO Campaign'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-zinc-600 block">Campaign Title *</label>
                      <input
                        type="text"
                        required
                        value={causeForm.title}
                        onChange={(e) => setCauseForm({ ...causeForm, title: e.target.value })}
                        className="px-3 py-1.5 text-xs border border-stone-200 rounded w-full"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-zinc-600 block">Category *</label>
                      <select
                        value={causeForm.category}
                        onChange={(e) => setCauseForm({ ...causeForm, category: e.target.value })}
                        className="px-3 py-1.5 text-xs border border-stone-200 bg-white rounded w-full"
                      >
                        {['Education', 'Clean Water', 'Food & Hunger', 'Healthcare', 'Women Empowerment', 'Disaster Relief'].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-zinc-600 block">Target Amount (INR) *</label>
                      <input
                        type="number"
                        required
                        value={causeForm.target_amount}
                        onChange={(e) => setCauseForm({ ...causeForm, target_amount: e.target.value })}
                        className="px-3 py-1.5 text-xs border border-stone-200 rounded w-full"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-zinc-600 block">Raised Amount (INR)</label>
                      <input
                        type="number"
                        value={causeForm.raised_amount}
                        onChange={(e) => setCauseForm({ ...causeForm, raised_amount: e.target.value })}
                        className="px-3 py-1.5 text-xs border border-stone-200 rounded w-full"
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[10px] uppercase font-bold text-zinc-600 block">Image Link URL</label>
                      <input
                        type="text"
                        value={causeForm.image}
                        onChange={(e) => setCauseForm({ ...causeForm, image: e.target.value })}
                        className="px-3 py-1.5 text-xs border border-stone-200 rounded w-full"
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[10px] uppercase font-bold text-zinc-600 block">Description *</label>
                      <textarea
                        rows={3}
                        required
                        value={causeForm.description}
                        onChange={(e) => setCauseForm({ ...causeForm, description: e.target.value })}
                        className="px-3 py-1.5 text-xs border border-stone-200 rounded w-full"
                      ></textarea>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-zinc-600 block">Status</label>
                      <select
                        value={causeForm.status}
                        onChange={(e) => setCauseForm({ ...causeForm, status: e.target.value })}
                        className="px-3 py-1.5 text-xs border border-stone-200 bg-white rounded w-full"
                      >
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end items-center space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setCauseModal({ open: false, isEdit: false, data: null })}
                      className="px-4 py-2 rounded text-xs font-semibold text-stone-700 hover:bg-stone-50 border border-stone-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="px-4 py-2 rounded text-xs font-semibold text-white bg-brand-green-800 hover:bg-brand-green-900"
                    >
                      {actionLoading ? 'Saving...' : 'Save Campaign'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {listLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-brand-green-800" />
              </div>
            ) : causes.length === 0 ? (
              <p className="text-center text-xs text-stone-400 py-12">No campaigns found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {causes.map((c) => (
                  <div key={c.id} className="bg-white border border-stone-200 rounded-lg p-5 shadow-sm space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="px-2 py-0.5 bg-brand-green-50 text-brand-green-800 font-bold rounded text-[9px] uppercase tracking-wider">{c.category}</span>
                      <span className={`px-1.5 py-0.5 border text-[9px] uppercase tracking-wider font-bold rounded ${
                        c.status === 'active' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-stone-100 text-stone-500 border-stone-200'
                      }`}>{c.status}</span>
                    </div>
                    <h3 className="font-bold text-zinc-900 text-sm truncate">{c.title}</h3>
                    <p className="text-stone-500 text-xs line-clamp-2 leading-relaxed">{c.description}</p>
                    <div className="text-xs space-y-1 font-semibold">
                      <div className="flex justify-between">
                        <span className="text-stone-400">Target</span>
                        <span>₹{c.target_amount.toLocaleString('en-IN')}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-stone-400">Raised</span>
                        <span className="text-brand-green-800">₹{c.raised_amount.toLocaleString('en-IN')}</span>
                      </div>
                    </div>
                    <div className="flex justify-end space-x-2 pt-2 border-t border-stone-50">
                      <button
                        onClick={() => openCauseEditor(c)}
                        className="px-2.5 py-1.5 rounded text-[10px] font-semibold border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleCauseDelete(c.id)}
                        className="px-2.5 py-1.5 rounded text-[10px] font-semibold border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== 5. STORIES TAB ==================== */}
        {activeTab === 'stories' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-stone-200 pb-3">
              <h2 className="text-xl font-bold tracking-tight text-zinc-900">Success Stories directory</h2>
              <button
                onClick={() => openStoryEditor()}
                className="inline-flex items-center space-x-1 text-xs font-semibold bg-brand-green-800 hover:bg-brand-green-900 text-white px-3 py-1.5 rounded shadow-sm"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Story</span>
              </button>
            </div>

            {/* Story Editor Modal */}
            {storyModal.open && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
                <form
                  onSubmit={handleStorySubmit}
                  className="bg-white border border-stone-200 rounded-lg p-6 shadow-xl max-w-lg w-full space-y-4 max-h-[90vh] overflow-y-auto"
                >
                  <h3 className="text-base font-bold text-zinc-900 border-b border-stone-100 pb-2">
                    {storyModal.isEdit ? 'Edit Success Story' : 'Create Success Story'}
                  </h3>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-zinc-600 block">Story Title *</label>
                      <input
                        type="text"
                        required
                        value={storyForm.title}
                        onChange={(e) => setStoryForm({ ...storyForm, title: e.target.value })}
                        className="px-3 py-1.5 text-xs border border-stone-200 rounded w-full"
                      />
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-zinc-600 block">Category *</label>
                      <select
                        value={storyForm.category}
                        onChange={(e) => setStoryForm({ ...storyForm, category: e.target.value })}
                        className="px-3 py-1.5 text-xs border border-stone-200 bg-white rounded w-full"
                      >
                        {['Education', 'Clean Water', 'Food & Hunger', 'Healthcare', 'Women Empowerment', 'Disaster Relief'].map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[10px] uppercase font-bold text-zinc-600 block">Image URL Link</label>
                      <input
                        type="text"
                        value={storyForm.image}
                        onChange={(e) => setStoryForm({ ...storyForm, image: e.target.value })}
                        className="px-3 py-1.5 text-xs border border-stone-200 rounded w-full"
                      />
                    </div>
                    <div className="space-y-1 sm:col-span-2">
                      <label className="text-[10px] uppercase font-bold text-zinc-600 block">Story Body / Description *</label>
                      <textarea
                        rows={4}
                        required
                        value={storyForm.description}
                        onChange={(e) => setStoryForm({ ...storyForm, description: e.target.value })}
                        className="px-3 py-1.5 text-xs border border-stone-200 rounded w-full"
                      ></textarea>
                    </div>
                    <div className="space-y-1">
                      <label className="text-[10px] uppercase font-bold text-zinc-600 block">Publish Status</label>
                      <select
                        value={storyForm.status}
                        onChange={(e) => setStoryForm({ ...storyForm, status: e.target.value })}
                        className="px-3 py-1.5 text-xs border border-stone-200 bg-white rounded w-full"
                      >
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                      </select>
                    </div>
                  </div>

                  <div className="flex justify-end items-center space-x-3 pt-2">
                    <button
                      type="button"
                      onClick={() => setStoryModal({ open: false, isEdit: false, data: null })}
                      className="px-4 py-2 rounded text-xs font-semibold text-stone-700 hover:bg-stone-50 border border-stone-200"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      disabled={actionLoading}
                      className="px-4 py-2 rounded text-xs font-semibold text-white bg-brand-green-800 hover:bg-brand-green-900"
                    >
                      {actionLoading ? 'Saving...' : 'Save Story'}
                    </button>
                  </div>
                </form>
              </div>
            )}

            {listLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-brand-green-800" />
              </div>
            ) : stories.length === 0 ? (
              <p className="text-center text-xs text-stone-400 py-12">No stories found.</p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {stories.map((s) => (
                  <div key={s.id} className="bg-white border border-stone-200 rounded-lg p-5 shadow-sm space-y-4">
                    <div className="flex justify-between items-center">
                      <span className="px-2 py-0.5 bg-brand-green-50 text-brand-green-800 font-bold rounded text-[9px] uppercase tracking-wider">{s.category}</span>
                      <span className={`px-1.5 py-0.5 border text-[9px] uppercase tracking-wider font-bold rounded ${
                        s.status === 'published' ? 'bg-emerald-50 text-emerald-700 border-emerald-200' : 'bg-stone-100 text-stone-500 border-stone-200'
                      }`}>{s.status}</span>
                    </div>
                    <h3 className="font-bold text-zinc-900 text-sm truncate">{s.title}</h3>
                    <p className="text-stone-500 text-xs line-clamp-3 leading-relaxed">{s.description}</p>
                    
                    <div className="flex justify-end space-x-2 pt-2 border-t border-stone-50">
                      <button
                        onClick={() => openStoryEditor(s)}
                        className="px-2.5 py-1.5 rounded text-[10px] font-semibold border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleStoryDelete(s.id)}
                        className="px-2.5 py-1.5 rounded text-[10px] font-semibold border border-red-200 bg-red-50 text-red-700 hover:bg-red-100"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ==================== 6. MESSAGES TAB ==================== */}
        {activeTab === 'messages' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center border-b border-stone-200 pb-3">
              <h2 className="text-xl font-bold tracking-tight text-zinc-900">Contact Inbox</h2>
            </div>

            {listLoading ? (
              <div className="flex justify-center items-center py-20">
                <Loader2 className="w-6 h-6 animate-spin text-brand-green-800" />
              </div>
            ) : messages.length === 0 ? (
              <p className="text-center text-xs text-stone-400 py-12">No contact queries in the database inbox.</p>
            ) : (
              <div className="space-y-4">
                {messages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`bg-white border border-stone-200 rounded-lg p-6 shadow-sm space-y-4 relative ${
                      msg.status === 'new' ? 'border-l-4 border-l-brand-gold-500' : ''
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <div className="space-y-0.5">
                        <strong className="text-sm font-bold text-zinc-900 block">{msg.subject}</strong>
                        <span className="text-[10px] text-stone-400 block font-medium">
                          From: {msg.name} ({msg.email}) {msg.phone ? `| ${msg.phone}` : ''}
                        </span>
                        <span className="text-[9px] text-stone-400 block">
                          Submitted: {new Date(msg.created_at).toLocaleString()}
                        </span>
                      </div>
                      
                      <div className="flex items-center space-x-1.5 flex-shrink-0">
                        <span className={`px-2 py-0.5 rounded text-[8px] uppercase tracking-wider font-extrabold border ${
                          msg.status === 'new'
                            ? 'bg-amber-50 text-amber-700 border-amber-200'
                            : msg.status === 'replied'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-stone-100 text-stone-500 border-stone-200'
                        }`}>
                          {msg.status}
                        </span>
                      </div>
                    </div>

                    <p className="text-xs text-stone-600 leading-relaxed bg-stone-50 p-4 border border-stone-100 rounded">
                      {msg.message}
                    </p>

                    <div className="flex justify-end space-x-2 pt-2 border-t border-stone-50 text-[10px] font-semibold">
                      {msg.status === 'new' && (
                        <button
                          onClick={() => handleMessageStatus(msg.id, 'read')}
                          className="px-2.5 py-1.5 rounded border border-stone-200 bg-stone-50 text-stone-700 hover:bg-stone-100"
                        >
                          Mark as Read
                        </button>
                      )}
                      {msg.status !== 'replied' && (
                        <button
                          onClick={() => handleMessageStatus(msg.id, 'replied')}
                          className="px-2.5 py-1.5 rounded border border-emerald-200 bg-emerald-50 text-emerald-700 hover:bg-emerald-100"
                        >
                          Mark as Replied
                        </button>
                      )}
                      <button
                        onClick={() => handleMessageDelete(msg.id)}
                        className="px-2.5 py-1.5 rounded border border-red-200 bg-red-50 text-red-700 hover:bg-red-100 flex items-center space-x-1"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                        <span>Delete</span>
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>
    </div>
  );
}
