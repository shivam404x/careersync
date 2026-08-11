import React, { useState, useEffect } from "react";
import { X, CheckCircle, AlertCircle, Building2, MapPin, DollarSign, Briefcase, Calendar, Clock } from "lucide-react";
import { auth, db } from "../firebase"; // Ensure this path is correct
import { onAuthStateChanged } from "firebase/auth";
import { collection, addDoc, query, where, getDocs, serverTimestamp } from "firebase/firestore";

function Internship() {
  const [activeTab, setActiveTab] = useState("available"); // 'available' | 'applications'
  const [search, setSearch] = useState("");
  
  // Firebase & Application States
  const [user, setUser] = useState(null);
  const [myApplications, setMyApplications] = useState([]); // Stores full application docs
  const [appliedInternships, setAppliedInternships] = useState([]); // Stores just titles for quick checks
  
  const [selectedInternship, setSelectedInternship] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    college: "",
    resumeLink: "",
    coverLetter: ""
  });

  // Dummy Data with Tags
  const internships = [
    {
      title: "Frontend Developer Intern",
      company: "TechNova Solutions",
      location: "Gurugram",
      type: "In-Office",
      stipend: "Unpaid",
      tags: ["React.js", "HTML/CSS", "JavaScript"],
    },
    {
      title: "Python Backend Intern",
      company: "DataSphere AI",
      location: "Delhi",
      type: "In-Office",
      stipend: "₹15,000/month",
      tags: ["Python", "Django", "API"],
    },
    {
      title: "Web Development Intern",
      company: "WebCraft Studios",
      location: "Gurugram",
      type: "In-Office",
      stipend: "₹10,000/month",
      tags: ["Frontend", "Responsive Design"],
    },
    {
      title: "UI/UX Designer Intern",
      company: "Creative Minds",
      location: "Delhi",
      type: "In-Office",
      stipend: "Unpaid",
      tags: ["Figma", "Wireframing", "Prototyping"],
    },
    {
      title: "Software Engineering Intern",
      company: "CloudSync",
      location: "Noida",
      type: "Hybrid",
      stipend: "₹20,000/month",
      tags: ["JavaScript", "Node.js"],
    },
    {
      title: "React Native Developer",
      company: "AppFlow Inc.",
      location: "Remote",
      type: "Remote",
      stipend: "₹25,000/month",
      tags: ["React", "Mobile App"],
    },
  ];

  const filteredInternships = internships.filter(
    (job) =>
      job.title.toLowerCase().includes(search.toLowerCase()) ||
      job.company.toLowerCase().includes(search.toLowerCase()) ||
      job.location.toLowerCase().includes(search.toLowerCase())
  );

  // --- FIREBASE AUTH & FETCH APPLICATIONS ---
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        setFormData((prev) => ({ ...prev, email: currentUser.email || "" }));
        
        try {
          const q = query(collection(db, "applications"), where("userId", "==", currentUser.uid));
          const querySnapshot = await getDocs(q);
          
          const apps = [];
          const appliedTitles = [];
          
          querySnapshot.forEach((doc) => {
            const data = doc.data();
            appliedTitles.push(data.internshipTitle);
            apps.push({ id: doc.id, ...data });
          });

          // Sort apps by newest first locally
          apps.sort((a, b) => {
            const dateA = a.appliedAt?.toMillis() || 0;
            const dateB = b.appliedAt?.toMillis() || 0;
            return dateB - dateA;
          });

          setAppliedInternships(appliedTitles);
          setMyApplications(apps);
        } catch (error) {
          console.error("Error fetching applications:", error);
        }
      } else {
        setAppliedInternships([]);
        setMyApplications([]);
      }
    });

    return () => unsubscribe();
  }, []);

  // --- HANDLERS ---
  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 4000);
  };

  const handleApplyClick = (job) => {
    if (!user) {
      showToast("Please log in to apply for internships.", "error");
      return;
    }
    setSelectedInternship(job);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedInternship(null);
    setFormData({ ...formData, name: "", phone: "", college: "", resumeLink: "", coverLetter: "" });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!user || !selectedInternship) return;

    if (appliedInternships.includes(selectedInternship.title)) {
      showToast("You have already applied for this internship.", "error");
      return;
    }

    setLoading(true);
    try {
      const newApplication = {
        userId: user.uid,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        college: formData.college,
        resumeLink: formData.resumeLink,
        internshipTitle: selectedInternship.title,
        company: selectedInternship.company,
        coverLetter: formData.coverLetter || "",
        status: "Pending", // Default status
        appliedAt: serverTimestamp()
      };

      const docRef = await addDoc(collection(db, "applications"), newApplication);

      showToast("Application submitted successfully!", "success");
      
      // Update local state instantly so UI updates without refresh
      setAppliedInternships((prev) => [...prev, selectedInternship.title]);
      setMyApplications((prev) => [
        { id: docRef.id, ...newApplication, appliedAt: { toDate: () => new Date() } },
        ...prev
      ]);
      
      closeModal();
    } catch (error) {
      console.error("Application Error:", error);
      showToast("Failed to submit application. Try again.", "error");
    } finally {
      setLoading(false);
    }
  };

  // Helper for formatting Firestore Timestamps
  const formatDate = (timestamp) => {
    if (!timestamp) return "Just now";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  // Status Badge Component
  const StatusBadge = ({ status }) => {
    const finalStatus = status || "Pending";
    switch(finalStatus) {
      case "Accepted":
        return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"><CheckCircle size={12}/> Accepted</span>;
      case "Rejected":
        return <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"><X size={12}/> Rejected</span>;
      default:
        return <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1"><Clock size={12}/> Pending</span>;
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-zinc-300 font-sans selection:bg-indigo-500/30 overflow-hidden py-16 px-6 md:px-10">
      
      {/* BACKGROUND GLOW EFFECTS */}
      <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[-10%] w-[30%] h-[30%] rounded-full bg-purple-600/20 blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] pointer-events-none" />

      <div className="relative z-10 max-w-7xl mx-auto">
        
        {/* HEADER SECTION */}
        <div className="text-center mb-10 animate-in fade-in slide-in-from-bottom-6 duration-700">
          <h1 className="text-5xl md:text-6xl font-black tracking-tighter text-white mb-4">
            Career <span className="text-transparent bg-clip-text bg-linear-to-r from-indigo-400 to-purple-400">Launchpad.</span>
          </h1>
          <p className="text-zinc-400 text-lg max-w-2xl mx-auto">
            Browse through handpicked internships or track your existing applications.
          </p>
        </div>

        {/* TABS CONTROLS */}
        <div className="flex justify-center gap-4 mb-12 animate-in fade-in duration-1000">
          <button 
            onClick={() => setActiveTab("available")}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 ${
              activeTab === "available" 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25" 
                : "bg-white/5 text-zinc-400 hover:bg-white/10 border border-white/5"
            }`}
          >
            Available Internships
          </button>
          <button 
            onClick={() => setActiveTab("applications")}
            className={`px-6 py-2.5 rounded-full text-sm font-bold transition-all duration-300 flex items-center gap-2 ${
              activeTab === "applications" 
                ? "bg-indigo-600 text-white shadow-lg shadow-indigo-500/25" 
                : "bg-white/5 text-zinc-400 hover:bg-white/10 border border-white/5"
            }`}
          >
            My Applications
            {myApplications.length > 0 && (
              <span className="bg-white/20 px-2 py-0.5 rounded-full text-xs">{myApplications.length}</span>
            )}
          </button>
        </div>

        {/* TAB 1: AVAILABLE INTERNSHIPS */}
        {activeTab === "available" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {/* SEARCH BAR */}
            <div className="relative max-w-2xl mx-auto mb-16 group">
              <div className="absolute inset-0 bg-linear-to-r from-indigo-500 to-purple-500 rounded-2xl blur opacity-25 group-hover:opacity-40 transition duration-500"></div>
              <div className="relative flex items-center bg-white/5 border border-white/10 rounded-2xl p-2 backdrop-blur-md transition-all focus-within:border-indigo-500/50 focus-within:bg-white/10">
                <span className="pl-4 text-xl text-zinc-500">🔍</span>
                <input
                  type="text"
                  placeholder="Search roles, companies, or locations..."
                  className="w-full bg-transparent border-none text-white px-4 py-3 focus:outline-none placeholder-zinc-500"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                />
              </div>
            </div>

            {/* INTERNSHIP GRID */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredInternships.length > 0 ? (
                filteredInternships.map((job, index) => {
                  const hasApplied = appliedInternships.includes(job.title);
                  
                  return (
                    <div key={index} className="group relative bg-white/5 border border-white/10 hover:border-indigo-500/50 rounded-3xl p-6 transition-all duration-300 hover:bg-white/10 hover:-translate-y-1 flex flex-col h-full backdrop-blur-sm">
                      <div className="absolute top-6 right-6">
                        <span className={`text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full ${job.type === 'In-Office' ? 'bg-indigo-500/10 text-indigo-400 border border-indigo-500/20' : job.type === 'Remote' ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20' : 'bg-purple-500/10 text-purple-400 border border-purple-500/20'}`}>
                          {job.type}
                        </span>
                      </div>

                      <div className="mb-4 pr-20">
                        <h2 className="text-xl font-bold text-white mb-1 group-hover:text-indigo-300 transition-colors">{job.title}</h2>
                        <p className="text-zinc-400 text-sm font-medium">{job.company}</p>
                      </div>

                      <div className="flex items-center gap-4 text-xs text-zinc-400 font-medium mb-6">
                        <span className="flex items-center gap-1.5"><MapPin size={14}/> {job.location}</span>
                        <span className="flex items-center gap-1.5">
                          <DollarSign size={14} className={job.stipend === "Unpaid" ? "text-rose-400" : "text-emerald-400"}/> 
                          <span className={job.stipend === "Unpaid" ? "text-rose-400" : "text-emerald-400"}>{job.stipend}</span>
                        </span>
                      </div>

                      <div className="flex flex-wrap gap-2 mb-8">
                        {job.tags.map((tag, i) => (
                          <span key={i} className="text-[10px] font-semibold text-zinc-400 bg-black/30 border border-white/5 px-2.5 py-1 rounded-lg">{tag}</span>
                        ))}
                      </div>

                      <div className="mt-auto pt-4 border-t border-white/5">
                        <button
                          onClick={() => handleApplyClick(job)}
                          disabled={hasApplied}
                          className={`w-full relative inline-flex items-center justify-center px-6 py-3 text-sm font-bold transition-all duration-200 border rounded-xl focus:outline-none 
                            ${hasApplied ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/20 cursor-not-allowed" : "bg-white/5 text-white border-white/10 hover:bg-indigo-600 hover:border-indigo-500"}`}
                        >
                          {hasApplied ? <><CheckCircle size={16} className="mr-2"/> Applied</> : "Apply Now"}
                          {!hasApplied && <svg className="w-4 h-4 ml-2 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M14 5l7 7m0 0l-7 7m7-7H3"></path></svg>}
                        </button>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="col-span-full text-center py-20">
                  <span className="text-4xl mb-4 block">🛸</span>
                  <h3 className="text-xl font-bold text-white mb-2">No internships found</h3>
                  <p className="text-zinc-500">Try adjusting your search criteria.</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* TAB 2: MY APPLICATIONS */}
        {activeTab === "applications" && (
          <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
            {!user ? (
              <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm max-w-3xl mx-auto">
                <AlertCircle size={48} className="mx-auto text-zinc-500 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">Authentication Required</h3>
                <p className="text-zinc-400">Please log in to view and track your internship applications.</p>
              </div>
            ) : myApplications.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {myApplications.map((app) => (
                  <div key={app.id} className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors backdrop-blur-sm relative">
                    <div className="absolute top-6 right-6">
                      <StatusBadge status={app.status} />
                    </div>
                    
                    <div className="pr-24">
                      <h3 className="text-xl font-bold text-white mb-1">{app.internshipTitle}</h3>
                      <p className="text-indigo-400 font-semibold text-sm flex items-center gap-1.5 mb-6">
                        <Building2 size={16} /> {app.company}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-white/10 flex flex-col sm:flex-row gap-4 sm:gap-8">
                      <div className="flex flex-col">
                        <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-1">Applied Date</span>
                        <span className="text-sm text-zinc-300 font-medium flex items-center gap-2"><Calendar size={14} className="text-indigo-400"/> {formatDate(app.appliedAt)}</span>
                      </div>
                      <div className="flex flex-col">
                        <span className="text-[10px] font-semibold text-zinc-500 uppercase tracking-widest mb-1">Applicant Email</span>
                        <span className="text-sm text-zinc-300 font-medium break-all">{app.email}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl backdrop-blur-sm max-w-3xl mx-auto">
                <Briefcase size={48} className="mx-auto text-zinc-500 mb-4" />
                <h3 className="text-2xl font-bold text-white mb-2">No Applications Yet</h3>
                <p className="text-zinc-400 mb-6">You haven't applied to any internships. Head over to the Available Internships tab to get started!</p>
                <button 
                  onClick={() => setActiveTab("available")}
                  className="px-6 py-2.5 rounded-xl text-sm font-bold bg-indigo-600 text-white hover:bg-indigo-500 transition-colors"
                >
                  Explore Internships
                </button>
              </div>
            )}
          </div>
        )}

      </div>

      {/* --- APPLICATION MODAL --- */}
      {isModalOpen && selectedInternship && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4 backdrop-blur-md bg-black/60 animate-in fade-in duration-200">
          <div className="bg-[#0a0a0a] border border-white/10 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl shadow-indigo-500/10">
            <div className="flex justify-between items-center p-6 border-b border-white/5 sticky top-0 bg-[#0a0a0a]/95 backdrop-blur z-10">
              <div>
                <h2 className="text-xl font-bold text-white">Application Form</h2>
                <p className="text-sm text-indigo-400 mt-1">{selectedInternship.title} <span className="text-zinc-500">@ {selectedInternship.company}</span></p>
              </div>
              <button onClick={closeModal} className="text-zinc-400 hover:text-white transition-colors bg-white/5 p-2 rounded-full hover:bg-white/10">
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-5">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">Full Name</label>
                  <input required type="text" name="name" value={formData.name} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all placeholder-zinc-600" placeholder="John Doe" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">Email Address</label>
                  <input required type="email" name="email" value={formData.email} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all placeholder-zinc-600" placeholder="john@example.com" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">Phone Number</label>
                  <input required type="tel" name="phone" value={formData.phone} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all placeholder-zinc-600" placeholder="+91 9876543210" />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">College/University</label>
                  <input required type="text" name="college" value={formData.college} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all placeholder-zinc-600" placeholder="e.g. Delhi University" />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">Resume Link (Drive/Portfolio)</label>
                <input required type="url" name="resumeLink" value={formData.resumeLink} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all placeholder-zinc-600" placeholder="https://docs.google.com/..." />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest flex justify-between">
                  <span>Cover Letter</span>
                  <span className="text-zinc-600 normal-case tracking-normal">(Optional)</span>
                </label>
                <textarea name="coverLetter" rows="4" value={formData.coverLetter} onChange={handleInputChange} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white focus:outline-none focus:border-indigo-500 transition-all resize-none placeholder-zinc-600" placeholder="Why are you a good fit for this role?"></textarea>
              </div>

              <div className="pt-4 flex gap-4">
                <button type="button" onClick={closeModal} className="flex-1 py-3 rounded-xl font-bold bg-white/5 hover:bg-white/10 text-white transition-colors border border-white/10">
                  Cancel
                </button>
                <button type="submit" disabled={loading} className={`flex-1 py-3 rounded-xl font-bold flex items-center justify-center gap-2 text-white transition-all ${loading ? 'bg-indigo-600/50 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-500'}`}>
                  {loading ? 'Submitting...' : 'Submit Application'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- TOAST NOTIFICATION --- */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-100 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl ${toast.type === 'success' ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-400' : 'bg-rose-950/80 border-rose-500/30 text-rose-400'}`}>
            {toast.type === 'success' ? <CheckCircle size={20} /> : <AlertCircle size={20} />}
            <p className="font-semibold text-sm">{toast.message}</p>
          </div>
        </div>
      )}

    </div>
  );
}

export default Internship;