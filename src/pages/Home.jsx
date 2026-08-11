import React from "react";
import { Link } from "react-router-dom";
import { auth } from "../firebase";

// --- DATA CONSTANTS ---
// Extracting static data outside the component improves performance and readability.
const STATS = [
  { value: "10K+", label: "Active Students" },
  { value: "500+", label: "Hiring Partners" },
  { value: "95%", label: "ATS Success" },
  { value: "4.8/5", label: "User Rating" }
];

const STEPS = [
  { step: "01", title: "Build ATS Resume", desc: "Create a parsed, professional profile." },
  { step: "02", title: "Select Target Role", desc: "Choose your dream career path." },
  { step: "03", title: "Skill Gap Analysis", desc: "Identify what you're missing." },
  { step: "04", title: "Get Recommendations", desc: "Learn, upskill, and get hired." }
];

const FEATURES = [
  { icon: "📄", title: "ATS Resume Builder", color: "indigo", desc: "Generate high-converting, ATS-friendly resumes instantly." },
  { icon: "🔍", title: "Skill Gap Analysis", color: "purple", desc: "Compare your current skills against real-world job descriptions." },
  { icon: "🗺️", title: "Career Path Recs", color: "pink", desc: "AI-driven roadmaps tailored to your academic background." },
  { icon: "💼", title: "Internship Discovery", color: "emerald", desc: "Unlock exclusive opportunities that match your verified skills." },
  { icon: "🎯", title: "Academic Alignment", color: "blue", desc: "Sync university coursework with actionable industry demands." },
  { icon: "📥", title: "Resume PDF Export", color: "amber", desc: "Export pixel-perfect, beautifully designed PDFs in one click." }
];

const TESTIMONIALS = [
  { name: "Rahul S.", role: "Frontend Intern @ TechCorp", quote: "The skill gap analysis showed me exactly why I wasn't getting callbacks. After learning TypeScript as recommended, I landed an internship in 3 weeks." },
  { name: "Priya M.", role: "SDE I @ InnovateHQ", quote: "The ATS resume builder is magic. It formatted my academic projects perfectly and bypassed the automated filters I used to get stuck on." },
  { name: "Amit K.", role: "Final Year CS Student", quote: "CareerSync's roadmap gave me a clear path. It aligned my college coursework with what companies actually want to see." }
];

const FAQS = [
  { q: "What is an ATS score?", a: "An Applicant Tracking System (ATS) score determines how well your resume matches a job description. We format your resume to ensure it's easily readable by these bots." },
  { q: "How does the Skill Gap Analysis work?", a: "We parse your current resume and compare it against real-time industry requirements for your target role, highlighting missing languages, frameworks, or soft skills." },
  { q: "Is the resume builder completely free?", a: "Yes, students can build, customize, and export their ATS-friendly resumes to PDF at no cost." },
  { q: "Can CareerSync help me find internships?", a: "Absolutely. Once your profile is complete, our platform recommends internships that perfectly match your verified skill set." }
];

const NAV_LINKS = [
  { name: "Home", path: "/" },
  { name: "Internships", path: "/internship" },
  { name: "Resume Builder", path: "/resume-builder" },
  { name: "AI Analyzer", path: "/ai-resume-analyzer", highlight: true } // ADDED AI ANALYZER LINK
];

function Home() {
  const user = auth.currentUser;

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-zinc-300 font-sans selection:bg-indigo-500/30 overflow-hidden">
      {/* BACKGROUND GLOW EFFECTS (Premium Vibe) */}
      <div className="absolute top-[-20%] left-[10%] w-[50%] h-[50%] rounded-full bg-indigo-600/20 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[150px] pointer-events-none" />
      <div className="absolute top-[40%] right-[10%] w-[30%] h-[30%] rounded-full bg-pink-600/10 blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] pointer-events-none" />

      {/* NAVBAR */}
      <nav className="relative z-10 w-full border-b border-white/5 bg-black/40 backdrop-blur-md top-0">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-wrap justify-between items-center gap-4">
          <div className="flex items-center gap-3">
            <Link to="/" className="text-white font-bold text-xl tracking-wide">
              Career<span className="text-indigo-500">Sync</span>
            </Link>
          </div>
          
          <div className="flex flex-wrap items-center gap-4 md:gap-8 justify-end">
            {NAV_LINKS.map((link, idx) => (
              <Link 
                key={idx} 
                to={link.path} 
                className={`text-sm md:text-base font-semibold transition-colors ${
                  link.highlight ? 'text-indigo-400 hover:text-indigo-300' : 'hover:text-indigo-400'
                }`}
              >
                {link.name}
              </Link>
            ))}

            {/* ADMIN PANEL LINK */}
            {user?.email === "8298689524sroy@gmail.com" && (
              <Link to="/admin" className="text-sm md:text-base font-bold text-amber-500 hover:text-amber-400 transition-colors">
                Admin Panel
              </Link>
            )}
          </div>
        </div>
      </nav>

      <div className="w-full flex flex-col items-center text-center">
        {/* HERO SECTION */}
        <div className="flex flex-col items-center text-center animate-in fade-in slide-in-from-bottom-8 duration-1000 px-4">
          {/* Glowing Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-sm font-semibold mb-8 mt-10 backdrop-blur-md hover:bg-indigo-500/20 transition-colors cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-500"></span>
            </span>
            Resume & Skill Gap Alignment Platform
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-white mb-6 leading-tight">
            Align Your Skills. <br />
            <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 via-purple-400 to-pink-400">
              Accelerate Career.
            </span>
          </h1>

          <p className="text-lg md:text-xl text-zinc-400 max-w-3xl mb-12 leading-relaxed">
            Bridge the gap between your academic journey and industry demands. Build ATS-optimized resumes, discover critical skill gaps, and secure elite internships.
          </p>

          {/* CALL TO ACTION BUTTONS */}
          <div className="flex flex-col sm:flex-row gap-5 justify-center mb-24 w-full sm:w-auto px-4">
            <Link
              to="/resume-builder"
              className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-indigo-600 rounded-2xl hover:bg-indigo-500 focus:outline-none shadow-[0_0_40px_rgba(79,70,229,0.3)] hover:shadow-[0_0_60px_rgba(79,70,229,0.5)] hover:-translate-y-1"
            >
              📄 Build Pro Resume
            </Link>

            {/* ADDED AI RESUME ANALYZER BUTTON */}
            <Link
              to="/ai-resume-analyzer"
              className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-purple-600/20 border border-purple-500/30 rounded-2xl hover:bg-purple-600/40 hover:-translate-y-1 backdrop-blur-sm"
            >
              🤖 AI Resume Analyzer
            </Link>

            <Link
              to="/internship"
              className="group relative inline-flex items-center justify-center px-8 py-4 font-bold text-white transition-all duration-200 bg-white/5 border border-white/10 rounded-2xl hover:bg-white/10 hover:-translate-y-1 backdrop-blur-sm"
            >
              Explore Internships
              <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 7l5 5m0 0l-5 5m5-5H6"></path>
              </svg>
            </Link>
          </div>
        </div>

        {/* STATISTICS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 w-full max-w-7xl pb-20 border-b border-white/5 mx-auto">
          {STATS.map((stat, i) => (
            <div key={i} className={`flex flex-col items-center justify-center p-6 text-center ${i !== 0 ? 'border-l border-white/5' : ''} ${i > 1 ? 'border-t md:border-t-0 border-white/5' : ''}`}>
              <h2 className="text-4xl font-black text-transparent bg-clip-text bg-linear-to-r from-white to-zinc-500 mb-2">
                {stat.value}
              </h2>
              <p className="text-xs font-bold text-zinc-500 uppercase tracking-widest">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      {/* 1. HOW CAREERSYNC WORKS */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-b border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">How CareerSync Works</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">A streamlined 4-step process to align your academic progress with your dream tech career.</p>
        </div>
        <div className="grid md:grid-cols-4 gap-8 relative">
          {/* Connecting Line for Desktop */}
          <div className="hidden md:block absolute top-1/2 left-0 w-full h-px bg-linear-to-r from-transparent via-white/10 to-transparent -translate-y-1/2 z-0" />

          {STEPS.map((item, i) => (
            <div key={i} className="relative z-10 flex flex-col items-center text-center p-6 bg-[#0a0a0a] border border-white/10 rounded-3xl hover:border-indigo-500/50 transition-all group">
              <div className="w-14 h-14 bg-white/5 border border-white/10 rounded-full flex items-center justify-center text-xl font-bold text-indigo-400 mb-6 group-hover:bg-indigo-500/20 group-hover:scale-110 transition-all">
                {item.step}
              </div>
              <h3 className="text-xl font-bold text-white mb-2">{item.title}</h3>
              <p className="text-sm text-zinc-500">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 2. KEY FEATURES */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-b border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Powerful Features</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">Everything you need to map out your career trajectory in one platform.</p>
        </div>
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map((feature, i) => (
            <div key={i} className={`group bg-white/5 border border-white/5 hover:border-${feature.color}-500/50 p-8 rounded-3xl transition-all duration-300 hover:bg-white/10 relative overflow-hidden`}>
              <div className={`w-12 h-12 bg-white/5 rounded-2xl flex items-center justify-center text-2xl mb-6 border border-white/10 group-hover:bg-${feature.color}-500/20 transition-colors`}>
                {feature.icon}
              </div>
              <h3 className="text-xl font-bold text-white mb-3">{feature.title}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{feature.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 3. CAREER ROADMAP & 4. WHY CAREERSYNC */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-b border-white/5">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Why CareerSync? */}
          <div>
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-6">Why CareerSync?</h2>
            <p className="text-lg text-zinc-400 mb-8 leading-relaxed">
              Most students graduate with a degree but lack the specific skills employers are actively searching for. CareerSync eliminates this disconnect by analyzing your resume, pinpointing exactly what you're missing for your target role, and guiding your growth.
            </p>
            <ul className="space-y-4">
              {["Stop guessing what skills to learn next.", "Ensure your resume actually passes ATS filters.", "Connect academic theory to practical application."].map((point, i) => (
                <li key={i} className="flex items-center gap-3 text-zinc-300">
                  <div className="w-6 h-6 rounded-full bg-indigo-500/20 text-indigo-400 flex items-center justify-center text-sm">✓</div>
                  {point}
                </li>
              ))}
            </ul>
          </div>

          {/* Career Roadmap Timeline */}
          <div className="bg-white/5 border border-white/10 p-8 rounded-3xl">
            <h3 className="text-2xl font-bold text-white mb-8">Your Growth Roadmap</h3>
            <div className="space-y-8 relative before:absolute before:inset-0 before:ml-5 before:-translate-x-px md:before:mx-auto md:before:translate-x-0 before:h-full before:w-0.5 before:bg-linear-to-b before:from-transparent before:via-white/10 before:to-transparent">
              
              {[
                { num: "1", color: "indigo", title: "Beginner", desc: "Profile creation & Academic mapping" },
                { num: "2", color: "purple", title: "Intermediate", desc: "Skill gap analysis & Targeted upskilling" },
                { num: "3", color: "pink", title: "Industry Ready", desc: "ATS matched & Internship placement" }
              ].map((stage, i) => (
                <div key={i} className="relative flex items-center justify-between md:justify-normal md:odd:flex-row-reverse group is-active">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full border border-white/10 bg-${stage.color}-500 text-white shadow shrink-0 md:order-1 md:group-odd:-translate-x-1/2 md:group-even:translate-x-1/2 z-10`}>
                    {stage.num}
                  </div>
                  <div className="w-[calc(100%-4rem)] md:w-[calc(50%-2.5rem)] p-4 rounded-xl bg-white/5 border border-white/10">
                    <h4 className="font-bold text-white">{stage.title}</h4>
                    <p className="text-sm text-zinc-400">{stage.desc}</p>
                  </div>
                </div>
              ))}

            </div>
          </div>
        </div>
      </section>

      {/* 5. TESTIMONIALS */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 border-b border-white/5">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Student Success Stories</h2>
          <p className="text-zinc-400 max-w-2xl mx-auto">See how CareerSync is helping developers bridge the gap and land their dream roles.</p>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((testimonial, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-8 rounded-3xl hover:bg-white/10 transition-all">
              <div className="flex text-indigo-400 mb-4">★★★★★</div>
              <p className="text-zinc-300 mb-6 italic">"{testimonial.quote}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-linear-to-br from-indigo-500 to-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                  {testimonial.name[0]}
                </div>
                <div>
                  <h4 className="text-white font-bold">{testimonial.name}</h4>
                  <p className="text-xs text-zinc-500">{testimonial.role}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* 6. FAQ SECTION */}
      <section className="relative z-10 max-w-3xl mx-auto px-6 py-24 border-b border-white/5">
        <div className="text-center mb-12">
          <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">Frequently Asked Questions</h2>
        </div>
        <div className="space-y-4">
          {FAQS.map((faq, i) => (
            <div key={i} className="bg-white/5 border border-white/10 p-6 rounded-2xl">
              <h3 className="text-lg font-bold text-white mb-2">{faq.q}</h3>
              <p className="text-zinc-400 text-sm leading-relaxed">{faq.a}</p>
            </div>
          ))}
        </div>
      </section>

      {/* 7. FINAL CALL TO ACTION */}
      <section className="relative z-10 max-w-7xl mx-auto px-6 py-24 md:py-32">
        <div className="bg-linear-to-br from-indigo-900/40 via-[#0a0a0a] to-purple-900/40 border border-white/10 rounded-[3rem] p-12 md:p-20 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none" />
          
          <h2 className="text-4xl md:text-6xl font-black text-white mb-6 relative z-10">
            Start Building Your <br className="hidden md:block" /> Career Today.
          </h2>
          <p className="text-lg text-zinc-400 max-w-2xl mx-auto mb-10 relative z-10">
            Join thousands of students who have aligned their academic goals with real-world industry demands. Your dream tech role is just a sync away.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center relative z-10">
            <Link
              to="/resume-builder"
              className="px-8 py-4 font-bold text-white transition-all duration-200 bg-indigo-600 rounded-2xl hover:bg-indigo-500 shadow-[0_0_40px_rgba(79,70,229,0.4)] hover:-translate-y-1"
            >
              Build Resume Now
            </Link>
            
            <Link
              to="/internship"
              className="px-8 py-4 font-bold text-white transition-all duration-200 bg-white/10 border border-white/20 rounded-2xl hover:bg-white/20 backdrop-blur-md hover:-translate-y-1"
            >
              Explore Internships
            </Link>
          </div>
        </div>
      </section>

      {/* Footer minimal */}
      <footer className="relative z-10 text-center py-8 text-sm text-zinc-600 border-t border-white/5">
        <p>© {new Date().getFullYear()} ❤️ CareerSync. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default Home;