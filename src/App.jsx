import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { signOut } from "firebase/auth";
import { auth } from "./firebase";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Internship from "./pages/Internship";
import ResumeBuilder from "./pages/ResumeBuilder";
import ProtectedRoute from "./ProtectedRoute.jsx";
import ForgotPassword from "./pages/ForgotPassword";
import Admin from "./pages/Admin.jsx";
import { Navigate } from "react-router-dom";
import ResumeAnalyzer from "./pages/ResumeAnalyzer.jsx";


function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

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
      <div className="min-h-screen bg-slate-950 flex flex-col items-center justify-center gap-4">
        <div className="w-14 h-14 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>

        <h1 className="text-3xl font-bold text-white">
          Career<span className="text-blue-500">Sync</span>
        </h1>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <nav className="bg-slate-950 text-white px-10 py-4 flex justify-between items-center shadow-lg">

        <h1 className="text-4xl font-extrabold">
          Career<span className="text-blue-500">Sync</span>
        </h1>

        <div className="flex items-center gap-8">
          {user ? (
            <>
              <div className="flex items-center gap-3">
                {user.photoURL ? (
                  <img
                    src={user.photoURL}
                    alt="Profile"
                    className="w-10 h-10 rounded-full border-2 border-blue-500"
                  />
                ) : (
                  <div className="w-10 h-10 rounded-full bg-blue-600 flex items-center justify-center font-bold text-white">
                    {user.displayName?.charAt(0).toUpperCase()}
                  </div>
                )}

                <span className="font-semibold text-green-400">
                  {user.displayName}
                </span>
              </div>

              <button
                onClick={handleLogout}
                className="bg-red-600 px-5 py-2 rounded-xl hover:bg-red-700"
              >
                Logout
              </button>

            </>
          ) : (
            <>
              <Link to="/login" className="hover:text-blue-400">
                Login
              </Link>
              <Link
                to="/register"
                className="bg-blue-600 px-5 py-2 rounded-xl hover:bg-blue-700"
              >
                Register
              </Link>

            </>
          )}
        </div>

      </nav>

      <Routes>
        <Route path="/" element={<Home />} />

        <Route
          path="/internship"
          element={
            <ProtectedRoute>
              <Internship />
            </ProtectedRoute>
          }
        />

        <Route
          path="/admin"
          element={
            user?.email === "8298689524sroy@gmail.com"
              ? <Admin />
              : <Navigate to="/" />
          }
        />


        <Route
          path="/resume-builder"
          element={
            <ProtectedRoute>
              <ResumeBuilder />
            </ProtectedRoute>
          }
        />

        <Route
          path="/ai-resume-analyzer"
          element={
            <ProtectedRoute>
              <ResumeAnalyzer />
            </ProtectedRoute>
          }
        />


        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;