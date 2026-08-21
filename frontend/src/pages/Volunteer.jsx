import { useState } from 'react';
import { ShieldCheck, Heart, User, Mail, Phone, Calendar, MapPin, Loader2, Sparkles } from 'lucide-react';
import api from '../services/api';

export default function Volunteer() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    age: '',
    city: '',
    skills: '',
    interests: [],
    availability: 'flexible',
    reason: '',
  });

  const [loading, setLoading] = useState(false);
  const [successData, setSuccessData] = useState(null);
  const [errorMsg, setErrorMsg] = useState('');

  const interestOptions = [
    'Education',
    'Food Distribution',
    'Healthcare',
    'Women Empowerment',
    'Environment',
    'Event Management',
    'Social Media',
    'Fundraising',
    'Technology',
  ];

  const handleCheckboxChange = (interest) => {
    const active = formData.interests.includes(interest)
      ? formData.interests.filter((i) => i !== interest)
      : [...formData.interests, interest];
    setFormData({ ...formData, interests: active });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    
    // Basic validations
    if (!formData.name || !formData.email || !formData.phone || !formData.age || !formData.city) {
      setErrorMsg('Please populate all required fields.');
      return;
    }
    if (parseInt(formData.age) < 15 || parseInt(formData.age) > 100) {
      setErrorMsg('Age must be between 15 and 100 to volunteer.');
      return;
    }
    if (formData.interests.length === 0) {
      setErrorMsg('Please select at least one area of interest.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/volunteers', formData);
      if (res.success && res.data) {
        setSuccessData(res.data);
      } else {
        setErrorMsg(res.message || 'Failed to submit registration.');
      }
    } catch (err) {
      setErrorMsg(err.message || 'A network error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (successData) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 text-center space-y-6">
        <div className="w-16 h-16 bg-brand-green-50 rounded-full flex items-center justify-center mx-auto text-brand-green-800 border border-brand-green-100">
          <ShieldCheck className="w-8 h-8 text-brand-gold-500 fill-current" />
        </div>
        
        <div className="space-y-2">
          <h1 className="text-3xl font-extrabold text-zinc-900">Registration Successful!</h1>
          <p className="text-stone-500 text-sm">
            Thank you for joining HUMHELP NGO. Your request has been queued in our database.
          </p>
        </div>

        <div className="bg-white border border-stone-100 rounded-lg p-6 shadow-sm text-left divide-y divide-stone-100 max-w-sm mx-auto">
          <div className="py-2.5 flex justify-between text-xs">
            <span className="font-semibold text-stone-400 uppercase tracking-wider">Volunteer ID</span>
            <strong className="text-brand-green-800 font-mono text-sm">{successData.volunteer_id}</strong>
          </div>
          <div className="py-2.5 flex justify-between text-xs">
            <span className="font-semibold text-stone-400 uppercase tracking-wider">Full Name</span>
            <span className="text-zinc-800 font-medium">{successData.name}</span>
          </div>
          <div className="py-2.5 flex justify-between text-xs">
            <span className="font-semibold text-stone-400 uppercase tracking-wider">Review Status</span>
            <span className="px-2 py-0.5 rounded bg-amber-50 text-amber-700 font-bold uppercase text-[9px] tracking-wider border border-amber-200">
              Pending Approval
            </span>
          </div>
        </div>

        <p className="text-xs text-stone-400 leading-relaxed max-w-xs mx-auto">
          Our team coordinates operations on a weekly basis. We will reach out to your registered email address with scheduled project schedules.
        </p>

        <button
          onClick={() => {
            setSuccessData(null);
            setFormData({
              name: '',
              email: '',
              phone: '',
              age: '',
              city: '',
              skills: '',
              interests: [],
              availability: 'flexible',
              reason: '',
            });
          }}
          className="inline-flex justify-center items-center px-6 py-2.5 rounded text-xs font-semibold text-stone-700 bg-stone-50 hover:bg-stone-100 border border-stone-200 transition"
        >
          Register Another Account
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12">
      {/* Title */}
      <div className="border-b border-stone-200 pb-8 text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl">Become a Volunteer</h1>
        <p className="text-stone-500 text-base">
          Make a direct contribution of your skills and hours. Lend a helping hand to build a stronger community.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left Side: Instructions */}
        <div className="lg:col-span-1 space-y-6 text-zinc-700">
          <div className="bg-white border border-stone-100 rounded-lg p-6 shadow-sm space-y-4">
            <h3 className="text-base font-bold text-zinc-800 flex items-center space-x-1.5">
              <Heart className="w-5 h-5 text-brand-gold-500 fill-current" />
              <span>Why Volunteer?</span>
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Volunteering lets you touch lives directly. Whether teaching rural kids, packing grain boxes, or designing websites, every drop fills the bucket.
            </p>
          </div>

          <div className="bg-white border border-stone-100 rounded-lg p-6 shadow-sm space-y-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-stone-400">Volunteering Tiers</h3>
            <ul className="space-y-2 text-xs leading-relaxed text-stone-500 list-disc list-inside">
              <li>Weekends field drives</li>
              <li>Remote technological aid</li>
              <li>Fundraiser communications</li>
              <li>Disaster emergency packing</li>
            </ul>
          </div>
        </div>

        {/* Right Side: Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white border border-stone-100 p-8 rounded-lg shadow-sm space-y-6">
          {errorMsg && (
            <div className="bg-red-50 text-red-800 text-xs px-4 py-2.5 rounded border border-red-200 font-medium">
              {errorMsg}
            </div>
          )}

          {/* Grid fields */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 block uppercase tracking-wide">Full Name *</label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
                  required
                  placeholder="John Doe"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="pl-9 pr-4 py-2 text-sm border border-stone-200 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-brand-green-800"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 block uppercase tracking-wide">Email Address *</label>
              <div className="relative">
                <Mail className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="email"
                  required
                  placeholder="john.doe@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-9 pr-4 py-2 text-sm border border-stone-200 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-brand-green-800"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 block uppercase tracking-wide">Mobile Number *</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  required
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="pl-9 pr-4 py-2 text-sm border border-stone-200 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-brand-green-800"
                />
              </div>
            </div>

            <div className="space-y-1">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 block uppercase tracking-wide">Age *</label>
                  <div className="relative">
                    <Calendar className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="number"
                      required
                      placeholder="24"
                      value={formData.age}
                      onChange={(e) => setFormData({ ...formData, age: e.target.value })}
                      className="pl-9 pr-4 py-2 text-sm border border-stone-200 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-brand-green-800"
                    />
                  </div>
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-700 block uppercase tracking-wide">City *</label>
                  <div className="relative">
                    <MapPin className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      required
                      placeholder="Mumbai"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="pl-9 pr-4 py-2 text-sm border border-stone-200 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-brand-green-800"
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Skills */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-700 block uppercase tracking-wide">Skills (Comma-separated)</label>
            <input
              type="text"
              placeholder="Teaching, Event Coordinating, Graphic Design, Web Coding"
              value={formData.skills}
              onChange={(e) => setFormData({ ...formData, skills: e.target.value })}
              className="px-4 py-2 text-sm border border-stone-200 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-brand-green-800"
            />
          </div>

          {/* Availability */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-zinc-700 block uppercase tracking-wide">Availability *</label>
            <div className="flex space-x-6 text-sm">
              {['flexible', 'weekends', 'weekdays'].map((av) => (
                <label key={av} className="flex items-center space-x-2 cursor-pointer select-none text-stone-600 font-medium capitalize">
                  <input
                    type="radio"
                    name="availability"
                    value={av}
                    checked={formData.availability === av}
                    onChange={() => setFormData({ ...formData, availability: av })}
                    className="w-4 h-4 text-brand-green-800 border-stone-300 focus:ring-brand-green-800"
                  />
                  <span>{av}</span>
                </label>
              ))}
            </div>
          </div>

          {/* Interests Checkboxes */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold text-zinc-700 block uppercase tracking-wide">Areas of Interest * (Select all that apply)</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {interestOptions.map((opt) => (
                <label key={opt} className="flex items-center space-x-2 text-xs font-semibold text-stone-600 cursor-pointer select-none bg-stone-50 border border-stone-100 p-2.5 rounded hover:bg-stone-100">
                  <input
                    type="checkbox"
                    checked={formData.interests.includes(opt)}
                    onChange={() => handleCheckboxChange(opt)}
                    className="w-3.5 h-3.5 rounded text-brand-green-800 border-stone-300 focus:ring-brand-green-800"
                  />
                  <span>{opt}</span>
                </label>
              ))}
            </div>
          </div>

          {/* TextArea Statement */}
          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-700 block uppercase tracking-wide">Why do you want to volunteer? *</label>
            <textarea
              rows={4}
              required
              placeholder="Describe your motivation and past experience (if any)..."
              value={formData.reason}
              onChange={(e) => setFormData({ ...formData, reason: e.target.value })}
              className="px-4 py-2.5 text-sm border border-stone-200 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-brand-green-800"
            ></textarea>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center py-3 rounded text-sm font-semibold text-white bg-brand-green-800 hover:bg-brand-green-900 shadow-sm transition"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span>Registering details...</span>
              </>
            ) : (
              <span>Submit Volunteer Application</span>
            )}
          </button>
        </form>
      </div>
    </div>
  );
}
