import React, { useState } from 'react';
import { auth, db } from '../firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { extractTextFromPDF } from '../utils/pdfParser';
import { analyzeResume } from '../services/gemini';
import { motion, AnimatePresence } from 'framer-motion';

const ResumeAnalyzer = () => {
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState(null);

  const handleUpload = async (e) => {
    const file = e.target.files[0];
    if (!file || file.type !== 'application/pdf') return alert("Please upload a valid PDF file.");
    if (!auth.currentUser) return alert("You must be logged in.");

    setLoading(true);
    try {
      const text = await extractTextFromPDF(file);
      const analysis = await analyzeResume(text);
      await addDoc(collection(db, "resumeAnalyses"), {
        userId: auth.currentUser.uid,
        analysis,
        createdAt: serverTimestamp()
      });
      setData(analysis);
    } catch (err) {
      alert("Failed to analyze. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] text-white p-6 md:p-12 font-sans selection:bg-blue-500/30">
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="max-w-7xl mx-auto">
        
        {/* Header section with gradient */}
        <div className="mb-16">
          <motion.h1 initial={{ y: -20 }} animate={{ y: 0 }} className="text-6xl md:text-7xl font-black mb-6 tracking-tighter">
            Resume <span className="text-transparent bg-clip-text bg-linear-to-r from-blue-500 to-cyan-400">Intelligence</span>
          </motion.h1>
          <p className="text-zinc-400 text-xl max-w-2xl">Upload your PDF resume and unlock AI-driven insights to beat the ATS and secure your dream internship.</p>
        </div>

        {/* Upload Bento Box */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
          <div className="md:col-span-1 bg-white/5 border border-white/10 rounded-3xl p-8 flex flex-col justify-center items-center backdrop-blur-xl">
             <input type="file" onChange={handleUpload} className="hidden" id="fileInput" />
             <label htmlFor="fileInput" className="cursor-pointer group flex flex-col items-center gap-4">
                <div className="w-20 h-20 rounded-full bg-blue-600/20 flex items-center justify-center text-4xl group-hover:bg-blue-600/40 transition-all">📄</div>
                <span className="font-bold text-lg">Click to Upload PDF</span>
                <span className="text-zinc-500 text-sm">Max size 5MB</span>
             </label>
          </div>
          
          <div className="md:col-span-2 bg-linear-to-br from-blue-900/20 to-black rounded-3xl p-8 border border-white/5 flex items-center">
            <p className="text-zinc-300 italic">"CareerSync's AI analyzer doesn't just read your resume; it understands your trajectory. Get deep analysis on skills, gaps, and industry alignment."</p>
          </div>
        </div>

        {/* Results Dashboard */}
        <AnimatePresence>
          {loading && (
            <div className="text-center py-20">
              <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-6"></div>
              <p className="text-blue-400 font-bold text-lg">Analyzing your career footprint...</p>
            </div>
          )}

          {data && (
            <motion.div initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <ResultCard title="ATS Score" value={`${data.atsScore}/100`} highlight />
              <ResultCard title="Summary" value={data.summary} className="md:col-span-2" />
              <ResultCard title="Technical Skills" value={data.technicalSkills?.join(', ')} />
              <ResultCard title="Soft Skills" value={data.softSkills?.join(', ')} />
              <ResultCard title="Missing Skills" value={data.missingSkills?.join(', ')} />
              <ResultCard title="Strengths" value={data.strengths?.join(', ')} />
              <ResultCard title="Improvement Suggestions" value={data.suggestions?.join('. ')} className="md:col-span-2" />
              <ResultCard title="Job Roles" value={data.jobRoles?.join(', ')} />
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

const ResultCard = ({ title, value, highlight, className = "" }) => {
  const score = parseInt(value) || 0;
  const getBatteryColor = (s) => (s < 40 ? "bg-red-500" : s < 70 ? "bg-yellow-500" : "bg-green-500");

  return (
    <motion.div 
      whileHover={{ scale: 1.02 }} 
      className={`p-8 rounded-3xl border ${highlight ? 'border-blue-500/30 bg-blue-900/10' : 'border-white/5 bg-white/5'} backdrop-blur-xl ${className}`}
    >
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-zinc-400 text-[11px] uppercase tracking-[0.3em] font-bold">{title}</h3>
        {highlight && (
          <div className="flex items-center gap-2">
            <span className="text-lg font-black">{score}%</span>
            <div className="w-16 h-6 border border-white/20 rounded-md p-0.5">
              <div className={`h-full rounded-xs ${getBatteryColor(score)}`} style={{ width: `${score}%` }} />
            </div>
          </div>
        )}
      </div>
      <p className="text-white leading-relaxed text-lg font-medium">{value || "No data"}</p>
    </motion.div>
  );
};

export default ResumeAnalyzer;