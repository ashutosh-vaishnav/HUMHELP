import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { Heart, CreditCard, ShieldCheck, Mail, Phone, User, MessageSquare, Loader2, Sparkles } from 'lucide-react';
import api from '../services/api';

export default function Donate() {
  const [searchParams] = useSearchParams();
  const initialCauseId = searchParams.get('causeId') || '';
  const initialCategory = searchParams.get('category') || 'Education';

  const [causes, setCauses] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    category: initialCategory,
    cause_id: initialCauseId,
    amount: '500',
    customAmount: '',
    message: '',
    anonymous: false,
  });

  const [loading, setLoading] = useState(false);
  const [checkoutOrder, setCheckoutOrder] = useState(null); // Holds created order info
  const [receiptData, setReceiptData] = useState(null); // Final receipt data
  const [errorMsg, setErrorMsg] = useState('');
  const [simulatedCheckoutOpen, setSimulatedCheckoutOpen] = useState(false);

  const categories = ['Education', 'Clean Water', 'Food & Hunger', 'Healthcare', 'Women Empowerment', 'Disaster Relief'];
  const presetAmounts = ['100', '250', '500', '1000', '2500'];

  useEffect(() => {
    // Load causes to populate the selector
    const loadCauses = async () => {
      try {
        const res = await api.get('/causes');
        setCauses(res.data || []);
      } catch (err) {
        console.error('Failed to load causes:', err);
      }
    };
    loadCauses();
  }, []);

  const handleAmountChange = (amt) => {
    setFormData({ ...formData, amount: amt, customAmount: '' });
  };

  const handleCustomAmountChange = (e) => {
    const val = e.target.value;
    setFormData({ ...formData, amount: 'custom', customAmount: val });
  };

  const getFinalAmount = () => {
    if (formData.amount === 'custom') {
      return parseFloat(formData.customAmount) || 0;
    }
    return parseFloat(formData.amount) || 0;
  };

  const handleProceed = async (e) => {
    e.preventDefault();
    setErrorMsg('');
    const amt = getFinalAmount();

    if (!formData.email) {
      setErrorMsg('Email address is required.');
      return;
    }
    if (amt <= 0) {
      setErrorMsg('Donation amount must be greater than zero.');
      return;
    }

    setLoading(true);
    try {
      // 1. Create order in Backend
      const orderRes = await api.post('/payment/create', { amount: amt });
      if (!orderRes.success || !orderRes.data) {
        throw new Error(orderRes.message || 'Failed to initialize payment gateway.');
      }
      
      const orderInfo = orderRes.data;
      setCheckoutOrder({
        ...orderInfo,
        is_mock: orderRes.is_mock,
      });

      // 2. Register pending donation in Backend linked to order reference
      const pendingDoc = {
        donor_name: formData.name,
        email: formData.email,
        phone: formData.phone,
        category: formData.category,
        amount: amt,
        anonymous: formData.anonymous,
        message: formData.message,
        order_id: orderInfo.order_id,
        cause_id: formData.cause_id || null,
      };

      await api.post('/donations', pendingDoc);

      // 3. Initiate payment interface
      if (orderRes.is_mock) {
        // Simulated Payment workflow
        setSimulatedCheckoutOpen(true);
        setLoading(false);
      } else {
        // Real Razorpay workflow using Razorpay checkout script
        const options = {
          key: orderInfo.key_id,
          amount: orderInfo.amount,
          currency: orderInfo.currency,
          name: "HUMHELP NGO",
          description: "Donation for " + formData.category,
          order_id: orderInfo.order_id,
          handler: async function (response) {
            setLoading(true);
            try {
              // Confirm verification
              const verifyRes = await api.post('/payment/verify', {
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
                is_mock: false
              });

              if (verifyRes.success) {
                // Confirm donation record
                const confirmRes = await api.post('/donations/confirm', {
                  order_id: response.razorpay_order_id,
                  payment_id: response.razorpay_payment_id,
                });
                setReceiptData(confirmRes.data);
              }
            } catch (err) {
              setErrorMsg(err.message || 'Verification failed.');
            } finally {
              setLoading(false);
            }
          },
          prefill: {
            name: formData.name,
            email: formData.email,
            contact: formData.phone
          },
          theme: {
            color: "#1b4332"
          }
        };
        const rzp = new window.Razorpay(options);
        rzp.open();
        setLoading(false);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Payment initiation failed. Try again.');
      setLoading(false);
    }
  };

  const handleSimulatedPayment = async (status) => {
    setSimulatedCheckoutOpen(false);
    if (status === 'fail') {
      setErrorMsg('Simulated transaction was declined by user.');
      return;
    }
    
    setLoading(true);
    try {
      // Call mock verification
      const verifyRes = await api.post('/payment/verify', {
        razorpay_order_id: checkoutOrder.order_id,
        razorpay_payment_id: `pay_mock_${Date.now()}`,
        is_mock: true
      });

      if (verifyRes.success) {
        // Confirm and finalize
        const confirmRes = await api.post('/donations/confirm', {
          order_id: checkoutOrder.order_id,
          payment_id: verifyRes.payment_id,
        });
        setReceiptData(confirmRes.data);
      }
    } catch (err) {
      setErrorMsg(err.message || 'Simulated payment processing failed.');
    } finally {
      setLoading(false);
    }
  };

  const handlePrint = () => {
    window.print();
  };

  // Receipt Layout
  if (receiptData) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 space-y-8 print:py-4">
        <div className="text-center space-y-2">
          <div className="w-12 h-12 bg-brand-green-50 rounded-full flex items-center justify-center mx-auto border border-brand-green-100 print:hidden">
            <ShieldCheck className="w-6 h-6 text-brand-gold-500 fill-current" />
          </div>
          <h1 className="text-3xl font-extrabold text-zinc-900">Donation Complete</h1>
          <p className="text-stone-500 text-sm print:hidden">
            Thank you for supporting HUMHELP NGO. Below is your official tax-exempt receipt.
          </p>
        </div>

        {/* Printable Card */}
        <div className="bg-white border border-stone-200 rounded-lg p-8 shadow-sm space-y-6 relative overflow-hidden print:border-none print:shadow-none">
          {/* Decorative stamp stamp */}
          <div className="absolute top-4 right-4 bg-brand-green-50 text-brand-green-800 text-[10px] font-bold tracking-wider px-2.5 py-1 rounded border border-brand-green-100 uppercase rotate-6">
            Verified Receipt
          </div>

          <div className="border-b border-stone-100 pb-4 space-y-1">
            <h2 className="text-lg font-bold text-brand-green-800">HUMHELP NGO</h2>
            <span className="text-[10px] font-semibold text-stone-400 uppercase tracking-widest block leading-none">
              Small Help. Big Change.
            </span>
          </div>

          <div className="grid grid-cols-2 gap-4 text-xs">
            <div>
              <span className="text-stone-400 uppercase tracking-wider block font-bold">Donation ID</span>
              <strong className="text-zinc-800 text-sm font-mono">{receiptData.donation_id}</strong>
            </div>
            <div>
              <span className="text-stone-400 uppercase tracking-wider block font-bold">Payment reference</span>
              <span className="text-zinc-700 font-mono text-sm">{receiptData.payment_id}</span>
            </div>
            <div>
              <span className="text-stone-400 uppercase tracking-wider block font-bold">Donor Name</span>
              <span className="text-zinc-800 font-medium text-sm">
                {receiptData.anonymous ? 'Anonymous' : receiptData.donor_name}
              </span>
            </div>
            <div>
              <span className="text-stone-400 uppercase tracking-wider block font-bold">Date</span>
              <span className="text-zinc-700 text-sm">
                {new Date(receiptData.created_at).toLocaleDateString('en-IN', {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </span>
            </div>
          </div>

          <div className="bg-stone-50 border border-stone-100 p-4 rounded flex justify-between items-center">
            <div>
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wide">Allocated Category</span>
              <span className="text-xs font-bold text-zinc-700">{receiptData.category}</span>
            </div>
            <div className="text-right">
              <span className="text-[10px] uppercase font-bold text-stone-400 block tracking-wide">Donated Amount</span>
              <span className="text-lg font-extrabold text-brand-green-800">₹{receiptData.amount.toLocaleString('en-IN')}</span>
            </div>
          </div>

          <div className="pt-4 border-t border-stone-100 text-[10px] text-stone-400 text-center leading-relaxed">
            HUMHELP NGO is certified under section 80G. Tax benefit claims are applicable against this transaction ID.
          </div>
        </div>

        {/* Action Panel */}
        <div className="flex justify-center items-center space-x-4 print:hidden">
          <button
            onClick={handlePrint}
            className="inline-flex items-center px-6 py-2.5 rounded text-xs font-semibold text-white bg-brand-green-800 hover:bg-brand-green-900 shadow-sm"
          >
            Print Receipt
          </button>
          <button
            onClick={() => setReceiptData(null)}
            className="inline-flex items-center px-6 py-2.5 rounded text-xs font-semibold text-stone-700 bg-stone-50 hover:bg-stone-100 border border-stone-200"
          >
            Donate Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-12 relative">
      {/* Title */}
      <div className="border-b border-stone-200 pb-8 text-center max-w-2xl mx-auto space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl">Support Our Initiatives</h1>
        <p className="text-stone-500 text-base">
          All financial transfers are logged securely. You will receive an instant 80G tax receipt.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Left instructions block */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white border border-stone-100 p-6 rounded-lg shadow-sm space-y-4">
            <h3 className="text-base font-bold text-zinc-800 flex items-center space-x-1.5">
              <Sparkles className="w-5 h-5 text-brand-gold-500 fill-current" />
              <span>Tax Exemption</span>
            </h3>
            <p className="text-xs text-stone-500 leading-relaxed">
              Donations are 100% tax exempt under Section 80G of the Income Tax Act. Save your generated Receipt IDs to claim tax offsets.
            </p>
          </div>
          <div className="bg-white border border-stone-100 p-6 rounded-lg shadow-sm space-y-2.5 text-xs text-stone-500">
            <span className="font-bold text-zinc-700 uppercase tracking-wider block">Security Commitment</span>
            <p>Payment tokens are encrypted through Razorpay secure gateway API standards. We never record card, UPI credentials or raw PINs on our servers.</p>
          </div>
        </div>

        {/* Checkout Form */}
        <form onSubmit={handleProceed} className="lg:col-span-2 bg-white border border-stone-100 p-8 rounded-lg shadow-sm space-y-6">
          {errorMsg && (
            <div className="bg-red-50 text-red-800 text-xs px-4 py-2.5 rounded border border-red-200 font-medium">
              {errorMsg}
            </div>
          )}

          {/* Amount selection */}
          <div className="space-y-3">
            <label className="text-xs font-bold text-zinc-700 block uppercase tracking-wide">Select Contribution Amount (INR)</label>
            <div className="grid grid-cols-3 sm:grid-cols-5 gap-3">
              {presetAmounts.map((preset) => (
                <button
                  type="button"
                  key={preset}
                  onClick={() => handleAmountChange(preset)}
                  className={`py-2 rounded font-bold text-sm transition-all border ${
                    formData.amount === preset
                      ? 'bg-brand-green-800 text-white border-brand-green-800 shadow-sm'
                      : 'bg-stone-50 text-stone-600 border-stone-100 hover:bg-stone-100'
                  }`}
                >
                  ₹{preset}
                </button>
              ))}
            </div>
            
            {/* Custom amount text input */}
            <div className="relative pt-1 max-w-sm">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm text-stone-400 font-bold">₹</span>
              <input
                type="number"
                placeholder="Enter custom amount"
                value={formData.amount === 'custom' ? formData.customAmount : ''}
                onChange={handleCustomAmountChange}
                onClick={() => setFormData({ ...formData, amount: 'custom' })}
                className="pl-8 pr-4 py-2 text-sm border border-stone-200 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-brand-green-800"
              />
            </div>
          </div>

          {/* Field Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 block uppercase tracking-wide">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="text"
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
                  placeholder="john@example.com"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="pl-9 pr-4 py-2 text-sm border border-stone-200 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-brand-green-800"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 block uppercase tracking-wide">Mobile Number</label>
              <div className="relative">
                <Phone className="w-4 h-4 text-stone-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <input
                  type="tel"
                  placeholder="9876543210"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="pl-9 pr-4 py-2 text-sm border border-stone-200 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-brand-green-800"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-bold text-zinc-700 block uppercase tracking-wide">Donate to Campaign</label>
              <select
                value={formData.cause_id}
                onChange={(e) => {
                  const val = e.target.value;
                  const matching = causes.find((c) => c.id === val);
                  setFormData({
                    ...formData,
                    cause_id: val,
                    category: matching ? matching.category : formData.category,
                  });
                }}
                className="px-4 py-2 text-sm border border-stone-200 rounded-md w-full bg-white focus:outline-none focus:ring-1 focus:ring-brand-green-800"
              >
                <option value="">General Support (By Category)</option>
                {causes.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.title} ({c.category})
                  </option>
                ))}
              </select>
            </div>

            {!formData.cause_id && (
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-700 block uppercase tracking-wide">Or choose Generic Category</label>
                <select
                  value={formData.category}
                  onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                  className="px-4 py-2 text-sm border border-stone-200 rounded-md w-full bg-white focus:outline-none focus:ring-1 focus:ring-brand-green-800"
                >
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>
                      {cat}
                    </option>
                  ))}
                </select>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <label className="text-xs font-bold text-zinc-700 block uppercase tracking-wide">Leave a Message (Optional)</label>
            <div className="relative">
              <MessageSquare className="w-4 h-4 text-stone-400 absolute left-3 top-3" />
              <textarea
                rows={3}
                placeholder="Share your encouragement..."
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                className="pl-9 pr-4 py-2 text-sm border border-stone-200 rounded-md w-full focus:outline-none focus:ring-1 focus:ring-brand-green-800"
              ></textarea>
            </div>
          </div>

          <label className="flex items-center space-x-2 text-xs font-semibold text-stone-600 cursor-pointer select-none bg-stone-50 p-3 rounded border border-stone-100">
            <input
              type="checkbox"
              checked={formData.anonymous}
              onChange={(e) => setFormData({ ...formData, anonymous: e.target.checked })}
              className="w-4 h-4 text-brand-green-800 rounded border-stone-300 focus:ring-brand-green-800"
            />
            <span>Donate Anonymously (Hides name from public summaries)</span>
          </label>

          <button
            type="submit"
            disabled={loading}
            className="w-full flex items-center justify-center py-3 rounded text-sm font-semibold text-white bg-brand-green-800 hover:bg-brand-green-900 shadow-sm transition"
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                <span>Redirecting to payment gateway...</span>
              </>
            ) : (
              <>
                <CreditCard className="w-4 h-4 mr-2" />
                <span>Proceed to Pay ₹{getFinalAmount().toLocaleString('en-IN')}</span>
              </>
            )}
          </button>
        </form>
      </div>

      {/* Simulated Payment Modal */}
      {simulatedCheckoutOpen && checkoutOrder && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="bg-white border border-stone-200 rounded-lg p-8 shadow-xl max-w-sm w-full space-y-6 text-center animate-in fade-in-50 duration-300">
            <div className="w-12 h-12 bg-amber-50 rounded-full flex items-center justify-center mx-auto text-amber-700 border border-amber-100">
              <CreditCard className="w-6 h-6 text-brand-gold-500" />
            </div>

            <div className="space-y-2">
              <h3 className="text-lg font-bold text-zinc-900">Simulated Payment Portal</h3>
              <p className="text-xs text-stone-500 leading-relaxed">
                Razorpay key is not configured. We are running inside a safe demo/test payment simulation.
              </p>
            </div>

            <div className="bg-stone-50 border border-stone-100 p-4 rounded text-xs text-left font-semibold text-stone-600 space-y-1.5">
              <div className="flex justify-between">
                <span>Simulated Order ID:</span>
                <span className="font-mono text-zinc-800">{checkoutOrder.order_id}</span>
              </div>
              <div className="flex justify-between">
                <span>Transaction Value:</span>
                <span className="text-brand-green-800">₹{(checkoutOrder.amount / 100).toLocaleString('en-IN')}</span>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                onClick={() => handleSimulatedPayment('success')}
                className="py-2 rounded text-xs font-semibold text-white bg-brand-green-800 hover:bg-brand-green-900 shadow-sm"
              >
                Authorize Payment
              </button>
              <button
                type="button"
                onClick={() => handleSimulatedPayment('fail')}
                className="py-2 rounded text-xs font-semibold text-stone-700 bg-stone-50 hover:bg-stone-100 border border-stone-200"
              >
                Decline
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
