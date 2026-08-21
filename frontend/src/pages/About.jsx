import { Heart, Compass, ShieldAlert, Award, Star } from 'lucide-react';

export default function About() {
  const values = [
    {
      icon: <Star className="w-5 h-5 text-brand-green-800" />,
      title: "Radical Transparency",
      desc: "Every single rupee raised is audited and reported publicly. We link donations directly to dynamic campaigns."
    },
    {
      icon: <Heart className="w-5 h-5 text-brand-green-800" />,
      title: "Direct Social Impact",
      desc: "Our operations cut middle-agents, ensuring funds directly purchase materials or sponsor verified programs."
    },
    {
      icon: <Compass className="w-5 h-5 text-brand-green-800" />,
      title: "Community Autonomy",
      desc: "We build community-owned assets like water filters and skill tailoring clusters, ensuring long-term self-sustenance."
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 lg:py-16 space-y-16">
      {/* Page Title Header */}
      <div className="border-b border-stone-200 pb-8 text-center max-w-3xl mx-auto space-y-3">
        <h1 className="text-4xl font-extrabold tracking-tight text-zinc-900 sm:text-5xl">About HUMHELP NGO</h1>
        <p className="text-stone-500 text-lg">
          Connecting compassion with action since 2024. Providing transparent, verified, and community-centric charity.
        </p>
      </div>

      {/* Grid: Mission, Vision, Values */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        <div className="space-y-6">
          <div className="bg-white border border-stone-100 rounded-lg p-6 shadow-sm space-y-3">
            <div className="inline-flex items-center space-x-2 bg-brand-green-50 text-brand-green-800 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider">
              <Compass className="w-4 h-4" />
              <span>Our Mission</span>
            </div>
            <p className="text-stone-600 text-[15px] leading-relaxed">
              To alleviate rural poverty, support primary school education, provide basic healthcare, and secure clean drinking water for distressed communities through direct, audited, and transparent public funding.
            </p>
          </div>

          <div className="bg-white border border-stone-100 rounded-lg p-6 shadow-sm space-y-3">
            <div className="inline-flex items-center space-x-2 bg-brand-green-50 text-brand-green-800 px-3 py-1 rounded-md text-xs font-semibold uppercase tracking-wider">
              <Award className="w-4 h-4" />
              <span>Our Vision</span>
            </div>
            <p className="text-stone-600 text-[15px] leading-relaxed">
              We envision a nation where rural children never drop out of school due to lack of books, where waterborne diseases are eradicated through safe filtration units, and where women hold vocational skills to uplift their households.
            </p>
          </div>
        </div>

        {/* Decorative illustration */}
        <div className="relative rounded-xl overflow-hidden shadow-lg border border-stone-100 aspect-[4/3] bg-[url('https://images.unsplash.com/photo-1548858860-822852dec49b?w=800')] bg-cover bg-center">
          <div className="absolute inset-0 bg-brand-green-900/10"></div>
        </div>
      </div>

      {/* Core Values Section */}
      <div className="space-y-8 bg-stone-100/50 rounded-xl p-8 border border-stone-100">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">Our Core Pillars of Conduct</h2>
          <p className="text-stone-500 text-sm">
            We adhere to strict operational codes to deserve and maintain our donors&apos; trust.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {values.map((val, idx) => (
            <div key={idx} className="bg-white rounded-lg p-6 border border-stone-100 shadow-sm space-y-3">
              <div className="w-10 h-10 rounded bg-brand-green-50 flex items-center justify-center">
                {val.icon}
              </div>
              <h3 className="text-base font-bold text-zinc-800">{val.title}</h3>
              <p className="text-stone-500 text-xs sm:text-sm leading-relaxed">{val.desc}</p>
            </div>
          ))}
        </div>
      </div>

      {/* How We Operate Workflow */}
      <div className="space-y-8">
        <div className="text-center max-w-xl mx-auto space-y-2">
          <h2 className="text-2xl font-bold tracking-tight text-zinc-900">How We Operate</h2>
          <p className="text-stone-500 text-sm">
            From discovering a critical issue to publishing audited results—we ensure structured action.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 relative">
          {[
            { step: "01", name: "Ground Research", desc: "Identify villages and communities in urgent need of clean water, health camps, or learning kits." },
            { step: "02", name: "Create Campaign", desc: "List audited target requirements on our Causes page. No hidden fees or administrative cuts." },
            { step: "03", name: "Raise Funding", desc: "Donations are recorded dynamically via secure gateways. Receipts are generated instantly." },
            { step: "04", name: "Deliver & Audit", desc: "Deliver materials, record execution, and publish audited success stories to our donors." }
          ].map((op, idx) => (
            <div key={idx} className="bg-white border border-stone-100 p-6 rounded-lg relative space-y-2.5 shadow-sm">
              <span className="text-3xl font-extrabold text-brand-green-100 block font-serif leading-none">{op.step}</span>
              <h3 className="text-sm font-bold text-zinc-800">{op.name}</h3>
              <p className="text-xs text-stone-500 leading-relaxed">{op.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
