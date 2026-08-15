import React, { useState, useEffect } from "react";
import { auth, db } from "../firebase"; 
import { collection, onSnapshot, updateDoc, deleteDoc, doc } from "firebase/firestore";
import { signOut } from "firebase/auth";
import { PieChart, Pie, Cell, BarChart, Bar, XAxis, Tooltip, ResponsiveContainer } from "recharts";
import { 
  LayoutDashboard, Users, Briefcase, FileText, BarChart3, MessageSquare, 
  Settings, LogOut, CheckCircle, XCircle, Trash2, Edit, Plus, Search, Bell,
  Mail, Building2, Calendar, Clock, User as UserIcon, Menu, X
} from "lucide-react";

// --- THEME COLORS FOR CHARTS ---
const COLORS = ['#10b981', '#f43f5e', '#f59e0b', '#6366f1', '#8b5cf6'];

export default function Admin() {
  const [activeView, setActiveView] = useState("dashboard");
  const [toast, setToast] = useState({ show: false, message: "", type: "success" });
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); // Mobile sidebar state

  // Global Data States
  const [users, setUsers] = useState([]);
  const [internships, setInternships] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // --- FETCH ALL DATA IN REAL-TIME (FIXED SYNTAX) ---
  useEffect(() => {
    const unsubs = [];
    
    // 1. Fetch Users
    const usersUnsub = onSnapshot(collection(db, "users"), (snap) => {
      setUsers(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    unsubs.push(usersUnsub);

    // 2. Fetch Internships
    const internshipsUnsub = onSnapshot(collection(db, "internships"), (snap) => {
      setInternships(snap.docs.map(doc => ({ id: doc.id, ...doc.data() })));
    });
    unsubs.push(internshipsUnsub);

    // 3. Fetch Applications
    const appsUnsub = onSnapshot(
      collection(db, "applications"), 
      (snap) => {
        const appsData = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        appsData.sort((a, b) => (b.appliedAt?.toMillis() || 0) - (a.appliedAt?.toMillis() || 0));
        setApplications(appsData);
        setLoading(false);
      }, 
      (error) => {
        console.error("Error fetching applications: ", error);
        setLoading(false);
      }
    );
    unsubs.push(appsUnsub);

    // Cleanup listeners
    return () => {
      unsubs.forEach(unsub => unsub());
    };
  }, []);

  const showToast = (message, type = "success") => {
    setToast({ show: true, message, type });
    setTimeout(() => setToast({ show: false, message: "", type: "success" }), 3000);
  };

  const handleLogout = () => signOut(auth);

  return (
    <div className="flex h-screen bg-[#0a0a0a] text-zinc-300 font-sans overflow-hidden selection:bg-indigo-500/30 w-full">
      
      {/* MOBILE OVERLAY */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-black/80 z-40 md:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* --- SIDEBAR --- */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-black/95 md:bg-black/50 border-r border-white/5 flex flex-col backdrop-blur-xl shrink-0 transition-transform duration-300 ease-in-out md:relative md:translate-x-0 ${isSidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 border-b border-white/5 flex justify-between items-center">
          <h1 className="text-2xl font-black text-white tracking-tight">
            Career<span className="text-indigo-500">Sync</span> <span className="text-[10px] uppercase tracking-widest text-zinc-500 font-bold ml-1 border border-white/10 px-1.5 py-0.5 rounded">Admin</span>
          </h1>
          <button className="md:hidden text-zinc-400 hover:text-white" onClick={() => setIsSidebarOpen(false)}>
            <X size={20} />
          </button>
        </div>
        
        <nav className="flex-1 p-4 space-y-1 overflow-y-auto custom-scrollbar">
          {[
            { id: "dashboard", icon: LayoutDashboard, label: "Dashboard" },
            { id: "users", icon: Users, label: "Users" },
            { id: "internships", icon: Briefcase, label: "Internships" },
            { id: "applications", icon: FileText, label: "Applications" },
            { id: "analytics", icon: BarChart3, label: "Analytics" },
            { id: "messages", icon: MessageSquare, label: "Messages" },
            { id: "settings", icon: Settings, label: "Settings" }
          ].map((item) => (
            <button
              key={item.id}
              onClick={() => {
                setActiveView(item.id);
                setIsSidebarOpen(false);
              }}
              className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                activeView === item.id 
                  ? "bg-indigo-500/10 text-indigo-400 border border-indigo-500/20" 
                  : "text-zinc-500 hover:bg-white/5 hover:text-zinc-300"
              }`}
            >
              <item.icon size={18} /> {item.label}
            </button>
          ))}
        </nav>

        <div className="p-4 border-t border-white/5">
          <button onClick={handleLogout} className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-bold bg-white/5 text-zinc-400 hover:bg-rose-500/10 hover:text-rose-500 hover:border-rose-500/20 border border-transparent transition-colors">
            <LogOut size={16} /> Sign Out
          </button>
        </div>
      </aside>

      {/* --- MAIN CONTENT --- */}
      <main className="flex-1 flex flex-col relative overflow-hidden min-w-0 w-full">
        {/* Glow Effects */}
        <div className="absolute top-[-10%] right-[-5%] w-[40%] h-[40%] rounded-full bg-indigo-600/10 blur-[150px] pointer-events-none" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[30%] h-[30%] rounded-full bg-purple-600/10 blur-[150px] pointer-events-none" />

        {/* TOP NAVBAR */}
        <header className="h-18.25 shrink-0 bg-black/40 border-b border-white/5 flex items-center justify-between px-4 md:px-8 backdrop-blur-md z-10">
          <div className="flex items-center gap-3">
            <button className="md:hidden text-zinc-400 hover:text-white" onClick={() => setIsSidebarOpen(true)}>
              <Menu size={24} />
            </button>
            <h2 className="text-xl font-bold text-white capitalize">{activeView}</h2>
          </div>
          <div className="flex items-center gap-6">
            <div className="relative hidden md:block">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" size={16} />
              <input type="text" placeholder="Quick search..." className="bg-white/5 border border-white/10 rounded-full pl-10 pr-4 py-2 text-sm text-white focus:outline-none focus:border-indigo-500 transition-colors w-64" />
            </div>
            <button className="relative text-zinc-400 hover:text-white transition-colors">
              <Bell size={20} />
              <span className="absolute -top-1 -right-1 w-2 h-2 bg-rose-500 rounded-full"></span>
            </button>
            <div className="w-9 h-9 rounded-full bg-linear-to-tr from-indigo-500 to-purple-500 border border-white/10 flex items-center justify-center text-white font-bold text-sm shrink-0">
              A
            </div>
          </div>
        </header>

        {/* SCROLLABLE VIEW AREA */}
        <div className="flex-1 overflow-y-auto p-4 md:p-6 lg:p-10 z-10 custom-scrollbar w-full">
          {loading && activeView === "dashboard" ? (
            <div className="flex items-center justify-center h-full">
              <div className="w-10 h-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin"></div>
            </div>
          ) : (
            <>
              {activeView === "dashboard" && <DashboardView users={users} internships={internships} applications={applications} />}
              {activeView === "applications" && <ApplicationsView applications={applications} showToast={showToast} />}
              {activeView === "internships" && <InternshipsView internships={internships} showToast={showToast} />}
              {activeView === "users" && <UsersView users={users} showToast={showToast} />}
              {activeView === "analytics" && <AnalyticsView applications={applications} />}
              {(activeView === "messages" || activeView === "settings") && (
                <div className="flex flex-col items-center justify-center h-[60vh] text-zinc-500">
                  <Settings size={48} className="mb-4 animate-spin-slow opacity-20" />
                  <h3 className="text-xl font-bold text-white mb-2">Module Under Construction</h3>
                  <p>This section is being developed for Phase 2.</p>
                </div>
              )}
            </>
          )}
        </div>
      </main>

      {/* TOAST NOTIFICATION */}
      {toast.show && (
        <div className="fixed bottom-6 right-6 z-100 animate-in slide-in-from-bottom-5 fade-in duration-300">
          <div className={`flex items-center gap-3 px-6 py-4 rounded-2xl shadow-2xl border backdrop-blur-xl ${toast.type === 'success' ? 'bg-emerald-950/80 border-emerald-500/30 text-emerald-400' : 'bg-rose-950/80 border-rose-500/30 text-rose-400'}`}>
            {toast.type === 'success' ? <CheckCircle size={20} /> : <XCircle size={20} />}
            <p className="font-semibold text-sm">{toast.message}</p>
          </div>
        </div>
      )}
    </div>
  );
}

// ==========================================
// VIEW COMPONENTS
// ==========================================

function DashboardView({ users, internships, applications }) {
  const approved = applications.filter(a => a.status === "Accepted").length;
  const rejected = applications.filter(a => a.status === "Rejected").length;
  const pending = applications.filter(a => a.status === "Pending" || !a.status).length;

  const stats = [
    { label: "Total Users", value: users.length, color: "text-blue-400", border: "border-blue-500/20" },
    { label: "Internships", value: internships.length, color: "text-purple-400", border: "border-purple-500/20" },
    { label: "Total Applications", value: applications.length, color: "text-indigo-400", border: "border-indigo-500/20" },
    { label: "Approved Apps", value: approved, color: "text-emerald-400", border: "border-emerald-500/20" },
    { label: "Rejected Apps", value: rejected, color: "text-rose-400", border: "border-rose-500/20" },
    { label: "Pending Apps", value: pending, color: "text-amber-400", border: "border-amber-500/20" },
  ];

  return (
    <div className="space-y-6 md:space-y-8 animate-in fade-in w-full">
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-4">
        {stats.map((s, i) => (
          <div key={i} className={`bg-white/5 border border-white/5 rounded-2xl p-5 hover:border-white/20 hover:bg-white/10 transition-colors ${s.border}`}>
            <h3 className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest mb-2 line-clamp-1">{s.label}</h3>
            <div className={`text-2xl md:text-3xl font-black ${s.color}`}>{s.value}</div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 md:gap-8 w-full">
        <div className="lg:col-span-2 bg-white/5 border border-white/10 rounded-3xl p-6">
          <h3 className="text-lg font-bold text-white mb-6">Application Analytics</h3>
          <div className="h-64 border border-dashed border-white/5 rounded-xl p-4">
             <AnalyticsView applications={applications} mini />
          </div>
        </div>
        <div className="bg-white/5 border border-white/10 rounded-3xl p-6 flex flex-col">
          <h3 className="text-lg font-bold text-white mb-6">Recent Applications</h3>
          <div className="space-y-4 overflow-y-auto pr-2 custom-scrollbar flex-1">
            {applications.slice(0, 6).map((app, i) => (
              <div key={i} className="flex flex-wrap sm:flex-nowrap items-start sm:items-center justify-between pb-4 border-b border-white/5 last:border-0 last:pb-0 gap-2">
                <div className="pr-4 w-full sm:w-auto">
                  <p className="text-sm font-bold text-white line-clamp-1">{app.name}</p>
                  <p className="text-[11px] text-zinc-500 line-clamp-1">{app.internshipTitle}</p>
                </div>
                <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-md shrink-0 ${app.status === 'Accepted' ? 'bg-emerald-500/10 text-emerald-400' : app.status === 'Rejected' ? 'bg-rose-500/10 text-rose-400' : 'bg-amber-500/10 text-amber-400'}`}>
                  {app.status || "Pending"}
                </span>
              </div>
            ))}
            {applications.length === 0 && <p className="text-sm text-zinc-500 text-center py-10">No recent applications</p>}
          </div>
        </div>
      </div>
    </div>
  );
}

function ApplicationsView({ applications, showToast }) {
  const [search, setSearch] = useState("");

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      await updateDoc(doc(db, "applications", id), { status: newStatus });
      showToast(`Application marked as ${newStatus}`, "success");
    } catch (error) {
      console.error("Error updating status:", error);
      showToast("Failed to update status", "error");
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Delete this application permanently?")) {
      try {
        await deleteDoc(doc(db, "applications", id));
        showToast("Application deleted", "success");
      } catch (error) {
        console.error("Error deleting application:", error);
        showToast("Failed to delete application", "error");
      }
    }
  };

  const formatDate = (timestamp) => {
    if (!timestamp) return "Just now";
    const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
    return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const StatusBadge = ({ status }) => {
    const currentStatus = status || "Pending";
    if (currentStatus === "Accepted") return <span className="bg-emerald-500/10 text-emerald-400 border border-emerald-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 w-max"><CheckCircle size={12} /> Accepted</span>;
    if (currentStatus === "Rejected") return <span className="bg-rose-500/10 text-rose-400 border border-rose-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 w-max"><XCircle size={12} /> Rejected</span>;
    return <span className="bg-amber-500/10 text-amber-400 border border-amber-500/20 px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest flex items-center gap-1.5 w-max"><Clock size={12} /> Pending</span>;
  };

  const filtered = applications.filter(a => a.name?.toLowerCase().includes(search.toLowerCase()) || a.internshipTitle?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="animate-in fade-in space-y-6 w-full">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4 w-full">
        <input type="text" placeholder="Search applicant or role..." value={search} onChange={e=>setSearch(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white w-full md:w-80 focus:border-indigo-500 focus:outline-none transition-colors" />
        <span className="text-sm font-semibold text-zinc-400">Showing {filtered.length} applications</span>
      </div>
      
      {filtered.length === 0 ? (
        <div className="text-center py-20 bg-white/5 border border-white/10 rounded-3xl">
          <p className="text-zinc-500">No applications match your search.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6 w-full">
          {filtered.map((app) => (
            <div key={app.id} className="group relative bg-white/5 border border-white/10 hover:border-indigo-500/40 rounded-3xl p-6 transition-all duration-300 hover:bg-white/10 flex flex-col h-full backdrop-blur-md">
              <div className="flex justify-between items-start mb-6">
                <StatusBadge status={app.status} />
                <button onClick={() => handleDelete(app.id)} className="p-2 bg-rose-500/10 text-rose-400 rounded-lg hover:bg-rose-500 hover:text-white transition-colors" title="Delete Application"><Trash2 size={16} /></button>
              </div>

              <div className="mb-6 pb-6 border-b border-white/10">
                <h2 className="text-xl font-bold text-white mb-3 flex items-center gap-2">
                  <UserIcon size={18} className="text-indigo-400 shrink-0" />
                  <span className="truncate">{app.name}</span>
                </h2>
                <div className="space-y-2 text-sm text-zinc-400">
                  <p className="flex items-center gap-2"><Mail size={14} className="text-zinc-500 shrink-0" /><a href={`mailto:${app.email}`} className="hover:text-indigo-400 transition-colors break-all line-clamp-1">{app.email}</a></p>
                  <p className="flex items-center gap-2"><Calendar size={14} className="text-zinc-500 shrink-0" />{formatDate(app.appliedAt)}</p>
                </div>
              </div>

              <div className="grow mb-8">
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Role Applied</span>
                    <p className="font-semibold text-zinc-200 flex items-start gap-2"><Briefcase size={14} className="text-indigo-400 shrink-0 mt-0.5" /> <span className="line-clamp-2">{app.internshipTitle}</span></p>
                  </div>
                  <div>
                    <span className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-1">Company</span>
                    <p className="font-semibold text-zinc-200 flex items-center gap-2"><Building2 size={14} className="text-indigo-400 shrink-0" /> <span className="truncate">{app.company}</span></p>
                  </div>
                  {app.resumeLink && (
                    <div className="pt-2">
                      <a href={app.resumeLink} target="_blank" rel="noreferrer" className="text-xs font-bold text-indigo-400 hover:text-indigo-300 underline underline-offset-2">View Resume / Portfolio ↗</a>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3 mt-auto pt-4 border-t border-white/5">
                <button onClick={() => handleUpdateStatus(app.id, "Accepted")} disabled={app.status === "Accepted"} className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${app.status === "Accepted" ? "bg-emerald-500/20 text-emerald-500/50 cursor-not-allowed border border-emerald-500/10" : "bg-white/5 text-emerald-400 border border-white/10 hover:bg-emerald-500/20 hover:border-emerald-500/50"}`}>
                  <CheckCircle size={16} /> Accept
                </button>
                <button onClick={() => handleUpdateStatus(app.id, "Rejected")} disabled={app.status === "Rejected"} className={`flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all ${app.status === "Rejected" ? "bg-rose-500/20 text-rose-500/50 cursor-not-allowed border border-rose-500/10" : "bg-white/5 text-rose-400 border border-white/10 hover:bg-rose-500/20 hover:border-rose-500/50"}`}>
                  <XCircle size={16} /> Reject
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

function InternshipsView({ internships, showToast }) {
  const [search, setSearch] = useState("");

  const handleDelete = async (id) => {
    if(window.confirm("Delete this internship? This action cannot be undone.")) {
      await deleteDoc(doc(db, "internships", id));
      showToast("Internship deleted", "success");
    }
  }

  const filtered = internships.filter(i => i.title?.toLowerCase().includes(search.toLowerCase()) || i.company?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="animate-in fade-in space-y-6 w-full">
      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <input type="text" placeholder="Search internships or companies..." value={search} onChange={e=>setSearch(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white w-full sm:w-80 focus:border-indigo-500 focus:outline-none" />
        <button className="bg-indigo-600 text-white px-5 py-2.5 rounded-xl text-sm font-bold hover:bg-indigo-500 flex items-center gap-2 w-full sm:w-auto justify-center transition-all shadow-lg shadow-indigo-500/20">
          <Plus size={16} /> Add Internship
        </button>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden overflow-x-auto w-full">
        <table className="w-full text-left text-sm min-w-200">
          <thead className="bg-black/40 border-b border-white/10 text-zinc-500 uppercase tracking-widest text-[10px]">
            <tr>
              <th className="p-4 pl-6">Role & Company</th>
              <th className="p-4">Location</th>
              <th className="p-4">Stipend</th>
              <th className="p-4">Type</th>
              <th className="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.length === 0 ? (
              <tr><td colSpan="5" className="p-8 text-center text-zinc-500">No internships found.</td></tr>
            ) : filtered.map(job => (
              <tr key={job.id} className="hover:bg-white/5 transition-colors group">
                <td className="p-4 pl-6">
                  <div className="font-bold text-white group-hover:text-indigo-400 transition-colors">{job.title}</div>
                  <div className="text-xs text-zinc-500">{job.company}</div>
                </td>
                <td className="p-4 text-zinc-400">{job.location}</td>
                <td className="p-4 text-emerald-400 font-medium">{job.stipend}</td>
                <td className="p-4"><span className="bg-white/10 px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest text-zinc-300">{job.type}</span></td>
                <td className="p-4 pr-6 flex justify-end gap-2">
                  <button className="p-2 bg-white/5 text-zinc-400 rounded-lg hover:bg-indigo-500 hover:text-white transition-colors" title="Edit"><Edit size={16}/></button>
                  <button onClick={() => handleDelete(job.id)} className="p-2 bg-white/5 text-zinc-400 rounded-lg hover:bg-rose-500 hover:text-white transition-colors" title="Delete"><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function UsersView({ users, showToast }) {
  const [search, setSearch] = useState("");

  const handleRoleChange = async (id, currentRole) => {
    const newRole = currentRole === "admin" ? "user" : "admin";
    if(window.confirm(`Change user role to ${newRole.toUpperCase()}?`)) {
      await updateDoc(doc(db, "users", id), { role: newRole });
      showToast(`User role updated to ${newRole}`, "success");
    }
  }

  const handleDelete = async (id) => {
    if(window.confirm("Permanently delete this user record?")) {
      await deleteDoc(doc(db, "users", id));
      showToast("User deleted", "success");
    }
  }

  const filtered = users.filter(u => u.name?.toLowerCase().includes(search.toLowerCase()) || u.email?.toLowerCase().includes(search.toLowerCase()));

  return (
    <div className="animate-in fade-in space-y-6 w-full">
      <input type="text" placeholder="Search by name or email..." value={search} onChange={e=>setSearch(e.target.value)} className="bg-white/5 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white w-full sm:w-80 focus:border-indigo-500 focus:outline-none" />
      
      <div className="bg-white/5 border border-white/10 rounded-2xl overflow-hidden overflow-x-auto w-full">
        <table className="w-full text-left text-sm min-w-175">
          <thead className="bg-black/40 border-b border-white/10 text-zinc-500 uppercase tracking-widest text-[10px]">
            <tr>
              <th className="p-4 pl-6">User Details</th>
              <th className="p-4">Contact</th>
              <th className="p-4">Role</th>
              <th className="p-4 pr-6 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5">
            {filtered.length === 0 ? (
              <tr><td colSpan="4" className="p-8 text-center text-zinc-500">No users found.</td></tr>
            ) : filtered.map(user => (
              <tr key={user.id} className="hover:bg-white/5 transition-colors">
                <td className="p-4 pl-6 flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center text-white font-bold shrink-0">
                    {user.name ? user.name.charAt(0).toUpperCase() : <UserIcon size={16} />}
                  </div>
                  <div>
                    <div className="font-bold text-white">{user.name || "Anonymous User"}</div>
                    <div className="text-xs text-zinc-500">ID: {user.id.substring(0,8)}...</div>
                  </div>
                </td>
                <td className="p-4 text-zinc-400">{user.email}</td>
                <td className="p-4">
                  <span className={`px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest ${user.role === 'admin' ? 'bg-purple-500/10 text-purple-400 border border-purple-500/20' : 'bg-zinc-500/10 text-zinc-400 border border-zinc-500/20'}`}>
                    {user.role || "user"}
                  </span>
                </td>
                <td className="p-4 pr-6 flex justify-end gap-2 items-center h-full pt-6">
                  <button onClick={() => handleRoleChange(user.id, user.role)} className="px-3 py-1.5 text-xs font-bold bg-white/5 text-zinc-300 rounded hover:bg-white/10 transition-colors">
                    {user.role === 'admin' ? "Remove Admin" : "Make Admin"}
                  </button>
                  <button onClick={() => handleDelete(user.id)} className="p-1.5 bg-rose-500/10 text-rose-400 rounded hover:bg-rose-500 hover:text-white transition-colors" title="Delete User"><Trash2 size={16}/></button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

function AnalyticsView({ applications, mini = false }) {
  const statusData = [
    { name: 'Accepted', value: applications.filter(a => a.status === 'Accepted').length },
    { name: 'Rejected', value: applications.filter(a => a.status === 'Rejected').length },
    { name: 'Pending', value: applications.filter(a => a.status === 'Pending' || !a.status).length },
  ];

  // Logic to group applications by company
  const companyCounts = {};
  applications.forEach(app => {
    if(app.company) companyCounts[app.company] = (companyCounts[app.company] || 0) + 1;
  });
  const barData = Object.keys(companyCounts).map(key => ({ company: key, count: companyCounts[key] })).slice(0, 6); // Top 6

  if(mini) {
    return (
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={barData}>
          <Tooltip cursor={{fill: '#ffffff10'}} contentStyle={{backgroundColor: '#0a0a0a', borderColor: '#ffffff20', color: '#fff'}} itemStyle={{color: '#fff'}} />
          <Bar dataKey="count" fill="#6366f1" radius={[4, 4, 0, 0]} />
        </BarChart>
      </ResponsiveContainer>
    );
  }

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 animate-in fade-in w-full">
      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 h-96 flex flex-col">
        <h3 className="text-lg font-bold text-white mb-6">Application Status</h3>
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={statusData} cx="50%" cy="50%" innerRadius={80} outerRadius={110} paddingAngle={5} dataKey="value">
                {statusData.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
              </Pie>
              <Tooltip contentStyle={{backgroundColor: '#0a0a0a', borderColor: '#ffffff20', borderRadius: '8px', color: '#fff'}} itemStyle={{color: '#fff'}} />
            </PieChart>
          </ResponsiveContainer>
        </div>
        <div className="flex justify-center gap-6 mt-4">
          {statusData.map((d, i) => (
            <div key={d.name} className="flex items-center gap-2 text-xs font-semibold text-zinc-400">
              <span className="w-3 h-3 rounded-full" style={{ backgroundColor: COLORS[i] }}></span> {d.name}
            </div>
          ))}
        </div>
      </div>

      <div className="bg-white/5 border border-white/10 rounded-3xl p-6 h-96 flex flex-col">
        <h3 className="text-lg font-bold text-white mb-6">Top Companies Applied</h3>
        <div className="flex-1">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={barData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
              <XAxis dataKey="company" stroke="#71717a" fontSize={10} tickLine={false} axisLine={false} />
              <Tooltip cursor={{fill: '#ffffff10'}} contentStyle={{backgroundColor: '#0a0a0a', borderColor: '#ffffff20', borderRadius: '8px', color: '#fff'}} itemStyle={{color: '#6366f1'}} />
              <Bar dataKey="count" fill="#8b5cf6" radius={[4, 4, 0, 0]} barSize={40} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  );
}