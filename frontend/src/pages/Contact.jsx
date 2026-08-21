import { useState } from 'react';
import { Mail, Phone, MapPin, Send, HelpCircle, ChevronDown, ChevronUp, Loader2 } from 'lucide-react';
import api from '../services/api';

export default function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    subject: '',
    message: '',
  });

  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');
  const [errorMsg, setErrorMsg] = useState('');

  // FAQs
  const [faqOpen, setFaqOpen] = useState({});
  const faqs = [
    {
      q: "How can I donate?",
      a: "Click on the 'Donate Now' button, select a cause or category, fill out the donor information, choose/enter an amount, and process via cards, UPI, or net banking."
    },
    {
      q: "Can I donate anonymously?",
      a: "Yes. In the donation form, check the 'Donate Anonymously' option. We will hide your name from public dashboard logs, although details are encrypted for auditing."
    },
    {
      q: "How can I become a volunteer?",
      a: "Go to the 'Volunteer' page, complete the interest profile registration form. We will contact you on your registered email about scheduled drives."
    },
    {
      q: "Where does my donation go?",
      a: "100% of public donations purchase materials directly for causes (like uniforms, water filters, food kits). Operational fees are funded separately by trustees."
    },
    {
      q: "Can I donate for a specific cause?",
      a: "Yes, you can click 'Donate' on a specific card in the 'Causes' page. This will link your donation directly to that campaign's progress tracker."
    }
  ];

  const toggleFaq = (idx) => {
    setFaqOpen({ ...faqOpen, [idx]: !faqOpen[idx] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    
    if (!formData.name || !formData.email || !formData.subject || !formData.message) {
      setErrorMsg('Please populate all required fields.');
      return;
    }

    setLoading(true);
    try {
      const res = await api.post('/contact', formData);
      setSuccessMsg(res.message || 'Message sent successfully!');
      setFormData({ name: '', email: '', phone: '', subject: '', message: '' });
    } catch (err) {
      setErrorMsg(err.message || 'Failed to send message. Try again later.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
      {/* Title */}
      <div className="border-b border-stone-200 pb-8 text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl">Contact Us</h1>
        <p className="text-stone-500 text-base sm:text-lg">
          Have queries about donation transparency or volunteer camps? Write to our team directly.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left column: Contact Info & Map */}
        <div className="space-y-8 lg:col-span-1">
          <div className="bg-white border border-stone-100 p-6 rounded-lg shadow-sm space-y-6">
            <h3 className="text-base font-bold text-zinc-800 border-b border-stone-100 pb-3">Office Location</h3>
            
            <div className="space-y-4 text-xs sm:text-sm text-stone-600">
              <div className="flex items-start space-x-3">
                <MapPin className="w-5 h-5 text-brand-gold-500 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">102, Hope Foundation Tower, Sector V, Salt Lake City, Kolkata - 700091</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="w-5 h-5 text-brand-gold-500 flex-shrink-0" />
                <span>hello@humhelpngo.org</span>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="w-5 h-5 text-brand-gold-500 flex-shrink-0" />
                <span>+91 98765 43210</span>
              </div>
            </div>
          </div>
          
          <p className="text-[10px] text-stone-400 leading-relaxed italic bg-stone-50 p-4 border border-stone-100 rounded">
            *Operational timings are from 10:00 AM to 6:00 PM (Monday to Saturday). Visitors are welcome on appointment.
          </p>
        </div>

        {/* Right column: Form */}
        <form onSubmit={handleSubmit} className="lg:col-span-2 bg-white border border-stone-100 p-8 rounded-lg shadow-sm space-y-6">
          <h3 className="text-lg font-bold text-zinc-800 border-b border-stone-100 pb-3">Send a Message</h3>
          
          {errorMsg && (
            <div className="bg-red-50 text-red-800 text-xs px-4 py-2.5 rounded border border-red-200 font-medium">
              {errorMsg}
            </div>
          )}
          {successMsg && (
            <div className="bg-brand-green-50 text-brand-green-800 text-xs px-4 py-2.5 rounded border border-brand-green-100 font-medium">
              {successMsg}
            </div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 block uppercase tracking-wide">Full Name *</label>
              <input
                type="text"
                required
                placeholder="John Doe"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="px-4 py-2 text-sm border border-stone-200 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-brand-green-800"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 block uppercase tracking-wide">Email Address *</label>
              <input
                type="email"
                required
                placeholder="john@example.com"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="px-4 py-2 text-sm border border-stone-200 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-brand-green-800"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 block uppercase tracking-wide">Phone Number</label>
              <input
                type="tel"
                placeholder="9876543210"
                value={formData.phone}
                onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                className="px-4 py-2 text-sm border border-stone-200 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-brand-green-800"
              />
            </div>
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 block uppercase tracking-wide">Subject *</label>
              <input
                type="text"
                required
                placeholder="Donation details query, volunteer request..."
                value={formData.subject}
                onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                className="px-4 py-2 text-sm border border-stone-200 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-brand-green-800"
              />
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-700 block uppercase tracking-wide">Message *</label>
            <textarea
              rows={5}
              required
              placeholder="Write details of your message..."
              value={formData.message}
              onChange={(e) => setFormData({ ...formData, message: e.target.value })}
              className="px-4 py-2.5 text-sm border border-stone-200 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-brand-green-800"
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center py-3 rounded text-sm font-semibold text-white bg-brand-green-800 hover:bg-brand-green-900 shadow-sm transition"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span>Submitting request...</span>
              </>
            ) : (
              <>
                <Send className="w-4 h-4 mr-2" />
                <span>Submit Message</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* FAQ Section */}
      <div className="space-y-8 bg-stone-100/50 rounded-xl p-8 border border-stone-100">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900 flex items-center justify-center space-x-1.5">
            <HelpCircle className="w-6 h-6 text-brand-gold-500" />
            <span>Frequently Asked Questions</span>
          </h2>
          <p className="text-stone-500 text-sm">
            Everything you need to know about donations and logistics.
          </p>
        </div>

        <div className="max-w-3xl mx-auto space-y-4">
          {faqs.map((faq, idx) => (
            <div key={idx} className="bg-white border border-stone-100 rounded-md overflow-hidden shadow-sm">
              <button
                onClick={() => toggleFaq(idx)}
                className="w-full px-6 py-4 flex justify-between items-center hover:bg-stone-50/50 text-left"
              >
                <span className="font-semibold text-zinc-800 text-sm">{faq.q}</span>
                {faqOpen[idx] ? <ChevronUp className="w-4 h-4 text-stone-400" /> : <ChevronDown className="w-4 h-4 text-stone-400" />}
              </button>
              
              {faqOpen[idx] && (
                <div className="px-6 pb-4 text-xs sm:text-sm text-stone-500 border-t border-stone-50 pt-3 leading-relaxed">
                  {faq.a}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
