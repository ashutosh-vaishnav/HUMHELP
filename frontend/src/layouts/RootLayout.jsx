import { useState } from 'react';
import { Outlet, Link, NavLink } from 'react-router-dom';
import { Menu, X, Heart, Mail, Phone, MapPin, Send, ArrowRight } from 'lucide-react';
import api from '../services/api';

export default function RootLayout() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterMsg, setNewsletterMsg] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleNewsletter = async (e) => {
    e.preventDefault();
    if (!newsletterEmail) return;
    setSubmitting(true);
    setNewsletterMsg('');
    try {
      const res = await api.post('/contact/newsletter', { email: newsletterEmail });
      setNewsletterMsg(res.message || 'Successfully subscribed!');
      setNewsletterEmail('');
    } catch (err) {
      setNewsletterMsg(err.message || 'Subscription failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const navLinks = [
    { name: 'Home', to: '/' },
    { name: 'About', to: '/about' },
    { name: 'Causes', to: '/causes' },
    { name: 'Impact', to: '/impact' },
    { name: 'Stories', to: '/stories' },
    { name: 'Volunteer', to: '/volunteer' },
    { name: 'Contact', to: '/contact' },
  ];

  return (
    <div className="flex flex-col min-h-screen bg-stone-50 text-zinc-800">
      {/* Top Utility Bar */}
      <div className="bg-brand-green-900 text-stone-200 text-xs py-2 px-4 sm:px-6 lg:px-8 flex justify-between items-center border-b border-brand-green-800">
        <div className="flex items-center space-x-4">
          <span className="flex items-center space-x-1">
            <Mail className="w-3.5 h-3.5" />
            <span>hello@humhelpngo.org</span>
          </span>
          <span className="hidden sm:flex items-center space-x-1">
            <Phone className="w-3.5 h-3.5" />
            <span>+91 98765 43210</span>
          </span>
        </div>
        <div>
          <span className="text-[10px] tracking-wide uppercase bg-brand-gold-500/20 text-brand-gold-100 px-2 py-0.5 rounded">
            Demo Environment
          </span>
        </div>
      </div>

      {/* Main Navbar */}
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur border-b border-stone-100 shadow-sm">
        <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-20 flex justify-between items-center">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 group">
            <div className="w-10 h-10 rounded-lg bg-brand-green-800 flex items-center justify-center text-white shadow-md shadow-brand-green-800/10 group-hover:scale-105 transition-transform duration-300">
              <Heart className="w-5.5 h-5.5 fill-current text-brand-gold-500" />
            </div>
            <div>
              <span className="text-xl font-bold tracking-tight text-brand-green-900">HUMHELP</span>
              <span className="text-xs block text-stone-400 font-medium leading-none tracking-wider uppercase">NGO</span>
            </div>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden md:flex items-center space-x-1 lg:space-x-2">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `px-3.5 py-2 rounded-md text-[14.5px] font-medium transition-colors duration-200 ${
                    isActive
                      ? 'text-brand-green-800 bg-brand-green-50'
                      : 'text-stone-600 hover:text-brand-green-800 hover:bg-stone-50'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
          </div>

          {/* Donate CTA button */}
          <div className="hidden md:block">
            <Link
              to="/donate"
              className="inline-flex items-center justify-center px-5 py-2.5 rounded-md text-sm font-semibold text-white bg-brand-green-800 hover:bg-brand-green-900 shadow-md shadow-brand-green-800/10 hover:shadow-lg transition-all duration-200"
            >
              Donate Now
            </Link>
          </div>

          {/* Mobile Hamburguer */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="md:hidden p-2 rounded-md text-stone-500 hover:text-brand-green-800 hover:bg-stone-50 focus:outline-none"
            aria-label="Toggle navigation menu"
          >
            {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </nav>

        {/* Mobile Dropdown */}
        {mobileOpen && (
          <div className="md:hidden bg-white border-b border-stone-200 px-4 pt-2 pb-6 space-y-1">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                onClick={() => setMobileOpen(false)}
                className={({ isActive }) =>
                  `block px-4 py-3 rounded-md text-base font-medium ${
                    isActive
                      ? 'text-brand-green-800 bg-brand-green-50'
                      : 'text-stone-600 hover:text-brand-green-800 hover:bg-stone-50'
                  }`
                }
              >
                {link.name}
              </NavLink>
            ))}
            <div className="pt-4 px-4">
              <Link
                to="/donate"
                onClick={() => setMobileOpen(false)}
                className="w-full text-center block px-5 py-3 rounded-md text-base font-semibold text-white bg-brand-green-800 hover:bg-brand-green-900 shadow"
              >
                Donate Now
              </Link>
            </div>
          </div>
        )}
      </header>

      {/* Main Pages Content */}
      <main className="flex-grow">
        <Outlet />
      </main>

      {/* Unified Footer */}
      <footer className="bg-brand-green-900 text-stone-300 border-t border-brand-green-800 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-8 lg:gap-12">
            {/* Logo and Tagline */}
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded bg-brand-green-800 flex items-center justify-center text-white">
                  <Heart className="w-4.5 h-4.5 fill-current text-brand-gold-500" />
                </div>
                <span className="text-lg font-bold tracking-tight text-white">HUMHELP NGO</span>
              </div>
              <p className="text-sm text-stone-400">
                &ldquo;Small Help. Big Change.&rdquo;
              </p>
              <p className="text-xs text-stone-500 leading-relaxed">
                HUMHELP NGO is registered as a non-profit organization under section 88G of the Income Tax Act. We strive for children&apos;s education, health, clean drinking water, and overall community growth.
              </p>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-sm font-semibold tracking-wider text-white uppercase mb-4">Quick Links</h3>
              <ul className="space-y-2.5 text-sm">
                <li>
                  <Link to="/about" className="hover:text-white transition-colors">About Us</Link>
                </li>
                <li>
                  <Link to="/causes" className="hover:text-white transition-colors">Our Causes</Link>
                </li>
                <li>
                  <Link to="/volunteer" className="hover:text-white transition-colors">Become a Volunteer</Link>
                </li>
                <li>
                  <Link to="/impact" className="hover:text-white transition-colors">Impact &amp; Transparency</Link>
                </li>
                <li>
                  <Link to="/stories" className="hover:text-white transition-colors">Success Stories</Link>
                </li>
              </ul>
            </div>

            {/* Contacts & Support */}
            <div>
              <h3 className="text-sm font-semibold tracking-wider text-white uppercase mb-4">Contact Info</h3>
              <ul className="space-y-3 text-sm text-stone-400">
                <li className="flex items-start space-x-2.5">
                  <MapPin className="w-4 h-4 text-brand-gold-500 flex-shrink-0 mt-0.5" />
                  <span>102, Hope Foundation Tower, Sector V, Salt Lake City, Kolkata - 700091</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Mail className="w-4 h-4 text-brand-gold-500 flex-shrink-0" />
                  <span>hello@humhelpngo.org</span>
                </li>
                <li className="flex items-center space-x-2.5">
                  <Phone className="w-4 h-4 text-brand-gold-500 flex-shrink-0" />
                  <span>+91 98765 43210</span>
                </li>
              </ul>
            </div>

            {/* Newsletter */}
            <div>
              <h3 className="text-sm font-semibold tracking-wider text-white uppercase mb-4">Newsletter</h3>
              <p className="text-xs text-stone-400 mb-3 leading-relaxed">
                Subscribe to our email news updates and keep track of successful campaign milestones.
              </p>
              <form onSubmit={handleNewsletter} className="flex">
                <input
                  type="email"
                  required
                  placeholder="Enter email address"
                  value={newsletterEmail}
                  onChange={(e) => setNewsletterEmail(e.target.value)}
                  className="bg-brand-green-800 text-stone-100 placeholder-stone-500 text-sm px-3 py-2 rounded-l-md w-full focus:outline-none focus:ring-1 focus:ring-brand-gold-500 border-none"
                />
                <button
                  type="submit"
                  disabled={submitting}
                  className="bg-brand-gold-500 hover:bg-brand-gold-600 text-brand-green-900 font-semibold px-4 rounded-r-md transition-colors"
                  aria-label="Subscribe"
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
              {newsletterMsg && (
                <p className="text-xs mt-2 text-brand-gold-100 font-medium">
                  {newsletterMsg}
                </p>
              )}
            </div>
          </div>

          <div className="border-t border-brand-green-800 mt-12 pt-8 flex flex-col sm:flex-row justify-between items-center text-xs text-stone-500">
            <p>&copy; {new Date().getFullYear()} HUMHELP NGO. All rights reserved. Designed for academic demonstration.</p>
            <div className="flex space-x-4 mt-4 sm:mt-0">
              <span className="hover:text-stone-400 cursor-pointer">Privacy Policy</span>
              <span>&bull;</span>
              <span className="hover:text-stone-400 cursor-pointer">Terms &amp; Conditions</span>
              <span>&bull;</span>
              <Link to="/admin/login" className="hover:text-stone-400">Admin Login</Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
