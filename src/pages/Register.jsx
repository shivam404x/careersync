import { useState } from "react";
import { Link } from "react-router-dom";
import { auth, db } from "../firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { doc, setDoc } from "firebase/firestore";
import { useNavigate } from "react-router-dom";


function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate

  const handleRegister = async (e) => {
    e.preventDefault();

    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );

      const user = userCredential.user;

      await updateProfile(user, {
        displayName: name,
      });

      await setDoc(doc(db, "users", user.uid), {
        uid: user.uid,
        name: name,
        email: email,
        photoURL: user.photoURL || "",
      });

      alert("Account created successfully!");

      navigate("/");

    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-zinc-300 font-sans selection:bg-indigo-500/30 overflow-hidden flex items-center justify-center p-6">

      {/* BACKGROUND GLOW EFFECTS */}
      <div className="absolute top-[10%] right-[20%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[10%] left-[20%] w-[30%] h-[30%] rounded-full bg-indigo-600/20 blur-[150px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] pointer-events-none" />

      {/* REGISTER CARD */}
      <div className="relative z-10 w-full max-w-md">

        {/* Logo/Brand Indicator */}
        <div className="flex justify-center mb-8 animate-in fade-in slide-in-from-top-4 duration-700">
          <div className="w-12 h-12 rounded-xl bg-linear-to-br from-indigo-500 to-purple-600 flex items-center justify-center font-black text-white text-2xl shadow-[0_0_30px_rgba(99,102,241,0.4)]">
            C
          </div>
        </div>

        <div className="bg-white/2 border border-white/5 p-8 sm:p-10 rounded-3xl backdrop-blur-xl shadow-2xl animate-in fade-in slide-in-from-bottom-6 duration-1000 relative overflow-hidden">

          {/* Subtle top linear line */}
          <div className="absolute top-0 left-0 w-full h-1 bg-linear-to-r from-transparent via-purple-500 to-transparent opacity-50" />

          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-white tracking-tight mb-2">
              Create Account
            </h1>
            <p className="text-sm text-zinc-500">
              Join CareerSync and accelerate your tech journey.
            </p>
          </div>

          <form onSubmit={handleRegister} className="space-y-5">
            {/* Full Name Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest pl-1">
                Full Name
              </label>
              <input
                type="text"
                placeholder="John Doe"
                className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest pl-1">
                Email Address
              </label>
              <input
                type="email"
                placeholder="developer@example.com"
                className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="text-[11px] font-bold text-zinc-500 uppercase tracking-widest pl-1">
                Password
              </label>
              <input
                type="password"
                placeholder="Create a strong password"
                className="w-full bg-black/50 border border-white/10 rounded-xl p-3.5 text-sm text-white placeholder-zinc-600 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all shadow-inner"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full relative inline-flex items-center justify-center mt-4 px-6 py-3.5 text-sm font-bold text-white transition-all duration-200 bg-indigo-600 rounded-xl hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-600 focus:ring-offset-[#0a0a0a] shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] active:scale-[0.98]"
            >
              Sign Up
            </button>
          </form>

          {/* Divider */}
          <div className="my-8 flex items-center justify-center gap-3">
            <div className="h-px w-full bg-white/5"></div>
            <span className="text-xs font-semibold text-zinc-600 uppercase tracking-widest whitespace-nowrap">Or sign up with</span>
            <div className="h-px w-full bg-white/5"></div>
          </div>

          {/* Social Logins */}
          <div className="grid grid-cols-2 gap-4">
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/3 border border-white/5 rounded-xl hover:bg-white/8 transition-colors text-sm font-semibold text-zinc-300">
              <svg className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
              </svg>
              Google
            </button>
            <button className="flex items-center justify-center gap-2 px-4 py-2.5 bg-white/3 border border-white/5 rounded-xl hover:bg-white/8 transition-colors text-sm font-semibold text-zinc-300">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path fillRule="evenodd" clipRule="evenodd" d="M12 2C6.477 2 2 6.477 2 12c0 4.42 2.865 8.166 6.839 9.489.5.092.682-.217.682-.482 0-.237-.008-.866-.013-1.7-2.782.603-3.369-1.34-3.369-1.34-.454-1.156-1.11-1.462-1.11-1.462-.908-.62.069-.608.069-.608 1.003.07 1.531 1.03 1.531 1.03.892 1.529 2.341 1.087 2.91.831.092-.646.35-1.086.636-1.336-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.025A9.578 9.578 0 0112 6.836c.85.004 1.705.114 2.504.336 1.909-1.294 2.747-1.025 2.747-1.025.546 1.377.203 2.394.1 2.647.64.699 1.028 1.592 1.028 2.683 0 3.842-2.339 4.687-4.566 4.935.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48C19.138 20.161 22 16.416 22 12c0-5.523-4.477-10-10-10z" />
              </svg>
              GitHub
            </button>
          </div>

          <p className="text-center text-xs text-zinc-500 mt-8 font-medium">
            Already have an account?{" "}
            <Link to="/login" className="text-indigo-400 hover:text-indigo-300 font-bold transition-colors">
              Log in here
            </Link>
          </p>

        </div>
      </div>
    </div>
  );
}

export default Register;