import { BrowserRouter, Routes, Route, Link, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "./firebase";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Internship from "./pages/Internship";
import ResumeBuilder from "./pages/ResumeBuilder";
import ProtectedRoute from "./ProtectedRoute.jsx";
import ForgotPassword from "./pages/ForgotPassword";
import Admin from "./pages/Admin.jsx";
import ResumeAnalyzer from "./pages/ResumeAnalyzer.jsx";

function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // Mobile Menu State

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      alert("Logged out successfully!");
      window.location.href = "/login";
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4 w-full max-w-[100vw] overflow-x-hidden">
        <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
        <h1 className="text-3xl font-bold text-white">
          Career<span className="text-blue-500">Sync</span>
        </h1>
      </div>
    );
  }

  return (
    <BrowserRouter>
      {/* RESPONSIVE NAVBAR */}
      <nav className="bg-slate-950 text-white px-4 md:px-10 py-3 md:py-4 shadow-lg sticky top-0 z-50 w-full max-w-[100vw] overflow-x-hidden border-b border-white/5">
        <div className="flex justify-between items-center max-w-7xl mx-auto">
          
          {/* Logo */}
          <Link to="/" className="text-2xl md:text-3xl font-extrabold tracking-tight shrink-0">
            Career<span className="text-blue-500">Sync</span>
          </Link>

          {/* Desktop Menu (Hidden on Mobile) */}
          <div className="hidden lg:flex items-center gap-6">
            <Link to="/" className="hover:text-blue-400 font-semibold transition">Home</Link>
            <Link to="/internship" className="hover:text-blue-400 font-semibold transition">Internships</Link>
            <Link to="/resume-builder" className="hover:text-blue-400 font-semibold transition">Resume Builder</Link>
            <Link to="/ai-resume-analyzer" className="text-indigo-400 hover:text-indigo-300 font-bold transition">AI Analyzer</Link>
            {user?.email === "8298689524sroy@gmail.com" && (
              <Link to="/admin" className="text-amber-500 hover:text-amber-400 font-bold transition">Admin</Link>
            )}
          </div>

          {/* Auth Buttons & Hamburger */}
          <div className="flex items-center gap-3">
            {user ? (
              <>
                <div className="hidden sm:flex items-center gap-2">
                  {user.photoURL ? (
                    <img src={user.photoURL} alt="Profile" className="w-8 h-8 rounded-full border-2 border-blue-500 object-cover" />
                  ) : (
                    <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white text-sm">
                      {user.displayName?.charAt(0).toUpperCase()}
                    </div>
                  )}
                  <span className="font-semibold text-green-400 text-sm hidden md:block">
                    {user.displayName}
                  </span>
                </div>
                <button onClick={handleLogout} className="hidden sm:block bg-red-600 px-4 py-2 text-sm rounded-xl hover:bg-red-700 transition">
                  Logout
                </button>
              </>
            ) : (
              <div className="hidden sm:flex items-center gap-3">
                <Link to="/login" className="hover:text-blue-400 text-sm font-medium">Login</Link>
                <Link to="/register" className="bg-blue-600 px-4 py-2 text-sm rounded-xl hover:bg-blue-700 font-medium transition">Register</Link>
              </div>
            )}

            {/* HAMBURGER ICON FOR MOBILE */}
            <button className="lg:hidden p-2" onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
              <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                {isMobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                )}
              </svg>
            </button>
          </div>
        </div>

        {/* MOBILE DROPDOWN MENU */}
        {isMobileMenuOpen && (
          <div className="lg:hidden mt-4 flex flex-col gap-4 pb-4 border-t border-slate-800 pt-4 px-2 animate-in slide-in-from-top-2">
            <Link to="/" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-400 font-semibold block py-2">Home</Link>
            <Link to="/internship" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-400 font-semibold block py-2">Internships</Link>
            <Link to="/resume-builder" onClick={() => setIsMobileMenuOpen(false)} className="hover:text-blue-400 font-semibold block py-2">Resume Builder</Link>
            <Link to="/ai-resume-analyzer" onClick={() => setIsMobileMenuOpen(false)} className="text-indigo-400 font-bold block py-2">AI Analyzer</Link>
            {user?.email === "8298689524sroy@gmail.com" && (
              <Link to="/admin" onClick={() => setIsMobileMenuOpen(false)} className="text-amber-500 font-bold block py-2">Admin Panel</Link>
            )}
            
            {/* Mobile Auth Actions */}
            <div className="border-t border-slate-800 pt-4 mt-2 sm:hidden flex flex-col gap-3">
              {user ? (
                <button onClick={handleLogout} className="bg-red-600 w-full py-3 rounded-xl hover:bg-red-700 transition font-bold">Logout</button>
              ) : (
                <>
                  <Link to="/login" onClick={() => setIsMobileMenuOpen(false)} className="text-center w-full py-3 border border-white/20 rounded-xl hover:bg-white/5 transition font-bold">Login</Link>
                  <Link to="/register" onClick={() => setIsMobileMenuOpen(false)} className="bg-blue-600 text-center w-full py-3 rounded-xl hover:bg-blue-700 transition font-bold">Register</Link>
                </>
              )}
            </div>
          </div>
        )}
      </nav>

      <main className="w-full max-w-[100vw] overflow-x-hidden">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/internship" element={<ProtectedRoute><Internship /></ProtectedRoute>} />
          <Route path="/admin" element={user?.email === "8298689524sroy@gmail.com" ? <Admin /> : <Navigate to="/" />} />
          <Route path="/resume-builder" element={<ProtectedRoute><ResumeBuilder /></ProtectedRoute>} />
          <Route path="/ai-resume-analyzer" element={<ProtectedRoute><ResumeAnalyzer /></ProtectedRoute>} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;