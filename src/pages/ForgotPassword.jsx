import { useState } from "react";
import { Link } from "react-router-dom";

function ForgotPassword() {
  // Steps: 1 = Email Input, 2 = OTP & New Password Input, 3 = Success
  const [step, setStep] = useState(1);
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Step 1: Send OTP to Email
  const handleSendOTP = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Yahan backend API call aayega: e.g., axios.post('/api/send-otp', { email })
    setTimeout(() => {
      setIsLoading(false);
      setStep(2); // Move to OTP verification step
    }, 1500); // Simulating network request
  };

  // Step 2: Verify OTP and Reset Password
  const handleResetPassword = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Yahan backend API call aayega: e.g., axios.post('/api/reset-password', { email, otp, newPassword })
    setTimeout(() => {
      setIsLoading(false);
      setStep(3); // Move to Success step
    }, 1500); // Simulating network request
  };

  return (
    <div className="relative min-h-screen bg-[#0a0a0a] text-zinc-300 font-sans selection:bg-indigo-500/30 flex items-center justify-center overflow-hidden px-4">
      
      {/* BACKGROUND GLOW EFFECTS */}
      <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] rounded-full bg-purple-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.15] pointer-events-none" />

      {/* CARD CONTAINER */}
      <div className="relative z-10 w-full max-w-md animate-in fade-in slide-in-from-bottom-4 duration-700">
        
        {/* Brand Name */}
        <div className="text-center mb-8">
          <Link to="/" className="text-white font-bold text-3xl tracking-wide">
            Career<span className="text-indigo-500">Sync</span>
          </Link>
        </div>

        <div className="bg-white/5 border border-white/10 backdrop-blur-xl p-8 rounded-3xl shadow-2xl relative overflow-hidden">
          
          {/* Loading Overlay */}
          {isLoading && (
            <div className="absolute inset-0 z-20 bg-[#0a0a0a]/80 backdrop-blur-sm flex items-center justify-center">
              <div className="w-8 h-8 border-4 border-indigo-500/30 border-t-indigo-500 rounded-full animate-spin"></div>
            </div>
          )}

          {/* STEP 1: ENTER EMAIL */}
          {step === 1 && (
            <div className="animate-in fade-in zoom-in-95 duration-500">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Reset Password</h2>
                <p className="text-sm text-zinc-400">
                  Enter your email address and we'll send you a 6-digit OTP to reset your password.
                </p>
              </div>

              <form onSubmit={handleSendOTP} className="space-y-6">
                <div className="space-y-2">
                  <label htmlFor="email" className="block text-sm font-medium text-zinc-300">
                    Email Address
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                      </svg>
                    </div>
                    <input
                      id="email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      placeholder="student@university.edu"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-[#0a0a0a] transition-all shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] active:scale-[0.98]"
                >
                  Get OTP
                </button>
              </form>
            </div>
          )}

          {/* STEP 2: VERIFY OTP & SET NEW PASSWORD */}
          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-8 duration-500">
              <div className="text-center mb-8">
                <h2 className="text-2xl font-bold text-white mb-2">Check Your Email</h2>
                <p className="text-sm text-zinc-400">
                  We've sent a 6-digit OTP to <br/>
                  <span className="text-indigo-400 font-medium">{email}</span>
                </p>
              </div>

              <form onSubmit={handleResetPassword} className="space-y-6">
                
                {/* OTP Input */}
                <div className="space-y-2">
                  <label htmlFor="otp" className="block text-sm font-medium text-zinc-300">
                    6-Digit OTP
                  </label>
                  <input
                    id="otp"
                    type="text"
                    required
                    maxLength="6"
                    value={otp}
                    onChange={(e) => setOtp(e.target.value.replace(/\D/g, ''))} // Only allow numbers
                    className="w-full bg-black/40 border border-white/10 rounded-xl py-3 px-4 text-center text-2xl tracking-[1em] font-mono text-white placeholder-zinc-700 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                    placeholder="------"
                  />
                </div>

                {/* New Password Input */}
                <div className="space-y-2">
                  <label htmlFor="newPassword" className="block text-sm font-medium text-zinc-300">
                    New Password
                  </label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <svg className="h-5 w-5 text-zinc-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                      </svg>
                    </div>
                    <input
                      id="newPassword"
                      type="password"
                      required
                      minLength="8"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full bg-black/40 border border-white/10 rounded-xl py-3 pl-11 pr-4 text-white placeholder-zinc-500 focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all"
                      placeholder="••••••••"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={otp.length < 6}
                  className="w-full flex justify-center py-3.5 px-4 border border-transparent rounded-xl text-sm font-bold text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 focus:ring-offset-[#0a0a0a] transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-[0_0_20px_rgba(79,70,229,0.3)] hover:shadow-[0_0_30px_rgba(79,70,229,0.5)] active:scale-[0.98]"
                >
                  Verify & Reset Password
                </button>
              </form>

              <div className="mt-6 flex items-center justify-between text-sm">
                <button 
                  onClick={() => setStep(1)}
                  className="text-zinc-500 hover:text-zinc-300 transition-colors"
                >
                  Change Email
                </button>
                <button 
                  onClick={handleSendOTP}
                  className="text-indigo-400 hover:text-indigo-300 transition-colors"
                >
                  Resend OTP
                </button>
              </div>
            </div>
          )}

          {/* STEP 3: SUCCESS STATE */}
          {step === 3 && (
            <div className="text-center animate-in zoom-in duration-500 py-6">
              <div className="w-20 h-20 bg-emerald-500/20 border border-emerald-500/30 rounded-full flex items-center justify-center mx-auto mb-6 text-emerald-400">
                <svg className="w-10 h-10 animate-[ping_1s_ease-out_1]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7"></path>
                </svg>
              </div>
              <h3 className="text-2xl font-bold text-white mb-2">Password Reset!</h3>
              <p className="text-sm text-zinc-400 mb-8">
                Your password has been changed successfully. You can now log in with your new password.
              </p>
              
              <Link
                to="/login"
                className="w-full flex justify-center py-3.5 px-4 border  rounded-xl text-sm font-bold text-white bg-white/10 hover:bg-white/20 border-white/10 backdrop-blur-md transition-all hover:-translate-y-1"
              >
                Go to Login
              </Link>
            </div>
          )}

          {/* Back to Login Link (Only show in Step 1) */}
          {step === 1 && (
            <div className="mt-8 text-center border-t border-white/5 pt-6">
              <Link
                to="/login"
                className="text-sm font-medium text-zinc-400 hover:text-white transition-colors flex items-center justify-center gap-2"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path>
                </svg>
                Back to Login
              </Link>
            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default ForgotPassword;