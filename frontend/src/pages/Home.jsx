import { Link } from 'react-router-dom';
import { Heart, Sparkles, BookOpen, Droplets, ShieldCheck, Flame, ArrowRight, Award } from 'lucide-react';

export default function Home() {
  const pillars = [
    {
      icon: <BookOpen className="w-6 h-6 text-brand-green-800" />,
      title: "Primary Education",
      desc: "Providing textbooks, stationery, digital tabs, and uniforms to rural children, keeping them in schools."
    },
    {
      icon: <Droplets className="w-6 h-6 text-brand-green-800" />,
      title: "Clean Drinking Water",
      desc: "Setting up solar-powered filtration facilities in salinity-prone villages to eliminate waterborne sickness."
    },
    {
      icon: <Flame className="w-6 h-6 text-brand-green-800" />,
      title: "Food & Hunger Drives",
      desc: "Running community kitchens distributing daily packets and hot meals to marginalized labor families."
    },
    {
      icon: <Award className="w-6 h-6 text-brand-green-800" />,
      title: "Women Empowerment",
      desc: "Empowering rural women with handloom, sewing machine skills, and vocational business training."
    }
  ];

  return (
    <div className="font-sans">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden bg-brand-green-900 text-white py-20 lg:py-28 px-4 sm:px-6 lg:px-8 flex flex-col justify-center items-center text-center">
        {/* Subtle geometric background overlay */}
        <div className="absolute inset-0 bg-[radial-gradient(#2d6a4f_1px,transparent_1px)] [background-size:24px_24px] opacity-10"></div>
        
        <div className="relative max-w-4xl mx-auto z-10 space-y-6">
          <div className="inline-flex items-center space-x-1.5 bg-brand-green-800/60 border border-brand-green-700/50 rounded-full px-4 py-1 text-xs sm:text-sm font-medium tracking-wide text-brand-gold-100">
            <Sparkles className="w-3.5 h-3.5 text-brand-gold-500 fill-current" />
            <span>&ldquo;Small Help. Big Change.&rdquo;</span>
          </div>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold tracking-tight leading-tight">
            Together, We Can <span className="text-brand-gold-500 font-serif">Make a Difference</span>.
          </h1>

          <p className="max-w-2xl mx-auto text-base sm:text-lg md:text-xl text-stone-300 font-normal leading-relaxed">
            Your small contribution can help create better opportunities, cleaner communities, and a brighter future for children and families.
          </p>

          <div className="pt-4 flex flex-col sm:flex-row justify-center items-center gap-4">
            <Link
              to="/donate"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-md text-base font-semibold text-white bg-brand-gold-500 hover:bg-brand-gold-600 shadow shadow-brand-gold-500/10 hover:shadow-lg transition-all duration-200"
            >
              Donate Now
            </Link>
            <Link
              to="/volunteer"
              className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-3.5 rounded-md text-base font-semibold text-brand-green-900 bg-white hover:bg-stone-50 shadow hover:shadow-lg transition-all duration-200"
            >
              Become a Volunteer
            </Link>
          </div>
        </div>

        {/* Minimalist illustration mockup */}
        <div className="mt-16 w-full max-w-5xl bg-brand-green-950/40 p-4 rounded-xl border border-brand-green-800/30 shadow-2xl relative">
          <div className="aspect-[21/9] bg-[url('https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=1200')] bg-cover bg-center rounded-lg grayscale-[20%] contrast-[110%] relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-t from-brand-green-950/80 via-transparent to-transparent flex items-end p-6">
              <p className="text-stone-300 text-xs sm:text-sm font-medium tracking-wide">
                HUMHELP Initiative: Community food drive program
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Core Pillars / Focus Areas */}
      <section className="py-20 bg-stone-50 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl font-extrabold tracking-tight text-zinc-900 sm:text-4xl">
            Where We Focus Our Efforts
          </h2>
          <p className="text-stone-500 text-base leading-relaxed">
            By focusing on core pillars of community growth, we ensure sustainable development and measurable social impact.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((pillar, idx) => (
            <div
              key={idx}
              className="bg-white border border-stone-100 rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow duration-300 space-y-4"
            >
              <div className="w-12 h-12 rounded-lg bg-brand-green-50 flex items-center justify-center">
                {pillar.icon}
              </div>
              <h3 className="text-lg font-bold text-zinc-800">{pillar.title}</h3>
              <p className="text-sm text-stone-500 leading-relaxed">{pillar.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. Call to Action / Impact Quote */}
      <section className="bg-white border-y border-stone-100 py-16 px-4 sm:px-6 lg:px-8 text-center max-w-7xl mx-auto rounded-lg my-12">
        <div className="max-w-3xl mx-auto space-y-6">
          <ShieldCheck className="w-12 h-12 text-brand-green-800 mx-auto fill-brand-green-50" />
          <blockquote className="text-xl sm:text-2xl font-serif text-zinc-800 leading-relaxed italic">
            &ldquo;We cannot do great things on this Earth, only small things with great love.&rdquo;
          </blockquote>
          <cite className="text-xs uppercase tracking-widest text-stone-500 font-bold block not-italic">
            — Mother Teresa
          </cite>
          <div className="pt-4">
            <Link
              to="/about"
              className="inline-flex items-center text-brand-green-800 hover:text-brand-green-900 font-semibold space-x-1"
            >
              <span>Learn more about our transparent operational methodology</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
