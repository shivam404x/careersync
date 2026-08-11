import React, { useState, useEffect, useRef } from "react";
import { toPng } from "html-to-image";
import jsPDF from "jspdf";

const TEMPLATES = [
  { id: "modern", name: "Modern Professional", icon: "✨" },
  { id: "minimal", name: "Minimal ATS", icon: "📄" },
  { id: "creative", name: "Creative Designer", icon: "🎨" },
  { id: "developer", name: "Tech Developer", icon: "💻" },
  { id: "executive", name: "Executive Corporate", icon: "👔" }
];

function PremiumResumeBuilder() {
  const [activeTab, setActiveTab] = useState("personal");
  const [score, setScore] = useState(0);
  const [scoreBreakdown, setScoreBreakdown] = useState({});
  const [template, setTemplate] = useState("modern");

  // NEW: Custom Design State (RGB Colors & Font)
  const [design, setDesign] = useState({
    primaryColor: "#6366f1", // Default Indigo
    fontColor: "#1f2937",    // Default Dark Gray
    fontFamily: "'Inter', sans-serif"
  });

  // PDF Export Ref & State
  const resumeRef = useRef(null);
  const [isExporting, setIsExporting] = useState(false);

  // Resume Data States
  const [personal, setPersonal] = useState({
    name: "Alex Jonathan",
    title: "Full Stack Developer",
    email: "alex.dev@example.com",
    phone: "+91 9876543210",
    address: "New Delhi, India",
    linkedin: "linkedin.com/in/alexdev",
    github: "github.com/alexcode",
    portfolio: "alex.dev",
    photo: null
  });

  const [summary, setSummary] = useState(
    "Innovative Full Stack Developer with 3+ years of experience in building scalable web applications. Proficient in React, Node.js, and modern UI/UX principles. Passionate about writing clean, maintainable code and solving complex technical challenges in agile environments."
  );

  const [skills, setSkills] = useState({
    languages: "JavaScript, TypeScript, Python, HTML5, CSS3",
    frontend: "React.js, Next.js, Tailwind CSS, Redux",
    backend: "Node.js, Express, MongoDB, PostgreSQL",
    tools: "Git, Docker, AWS, Figma, VS Code"
  });

  const [education, setEducation] = useState([
    { id: 1, degree: "B.Tech in Computer Science", institution: "K.R. Mangalam University", year: "2022 - 2026", gpa: "8.5 CGPA" }
  ]);

  const [experience, setExperience] = useState([
    { id: 1, company: "TechNova Solutions", role: "Frontend Developer Intern", duration: "Jan 2024 - Present", details: "Spearheaded the migration of legacy dashboard to React.js, improving page load speed by 40%. Collaborated with UX team to implement responsive design systems." }
  ]);

  const [projects, setProjects] = useState([
    { id: 1, name: "AI Smart Attendance System", stack: "Python, React, OpenCV", description: "Engineered an automated attendance tracker using facial recognition, reducing manual entry time by 90% across 5 departments.", github: "github.com/alexcode/ai-attendance", live: "ai-attendance.live" }
  ]);

  const [certifications, setCertifications] = useState([
    { id: 1, name: "Meta Advanced React", issuer: "Coursera", year: "2024" }
  ]);

  const [languages, setLanguages] = useState([
    { id: 1, language: "English", proficiency: "Fluent" },
    { id: 2, language: "Hindi", proficiency: "Native" }
  ]);

  // ATS SCORE ENGINE
  useEffect(() => {
    let breakdown = { personalInfo: 0, summary: 0, skills: 0, education: 0, experience: 0, projects: 0, certifications: 0, languages: 0 };

    let personalPoints = 0;
    if (personal.name && personal.email && personal.phone) personalPoints += 5;
    if (personal.photo) personalPoints += 5;
    if (personal.github || personal.linkedin || personal.portfolio) personalPoints += 5;
    breakdown.personalInfo = personalPoints;

    if (summary.trim().length > 50) breakdown.summary = 10;
    else if (summary.trim().length > 10) breakdown.summary = 5;

    if (skills.languages || skills.frontend || skills.backend || skills.tools) breakdown.skills = 15;
    if (education.length > 0 && education[0].degree) breakdown.education = 10;
    if (experience.length > 0 && experience[0].company) breakdown.experience = 15;
    if (projects.length > 0 && projects[0].name) breakdown.projects = 15;
    if (certifications.length > 0 && certifications[0].name) breakdown.certifications = 10;
    if (languages.length > 0 && languages[0].language) breakdown.languages = 10;

    setScoreBreakdown(breakdown);
    setScore(Object.values(breakdown).reduce((acc, val) => acc + val, 0));
  }, [personal, summary, skills, education, experience, projects, certifications, languages]);

  // STATE UPDATERS 
  const handleBlockAdd = (setter, template) => setter(prev => [...prev, { id: Date.now() + Math.random(), ...template }]);
  const handleBlockRemove = (setter, id) => setter(prev => prev.length > 1 ? prev.filter(item => item.id !== id) : prev);
  const handleBlockUpdate = (setter, id, key, val) => setter(prev => prev.map(item => item.id === id ? { ...item, [key]: val } : item));

  const getSkillBadges = (str) => str?.split(',').map(s => s.trim()).filter(Boolean) || [];

  // HIGH-QUALITY PDF EXPORT USING HTML-TO-IMAGE
  const handleDownloadPDF = async () => {
    const element = resumeRef.current;
    if (!element) return;
    setIsExporting(true);

    try {
      const imgData = await toPng(element, {
        quality: 1,
        pixelRatio: 2, 
        backgroundColor: '#ffffff',
        style: { transform: 'scale(1)', transformOrigin: 'top left' }
      });

      const pdf = new jsPDF("p", "mm", "a4");
      const pdfWidth = pdf.internal.pageSize.getWidth();
      const pdfHeight = pdf.internal.pageSize.getHeight();

      pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);

      let fileName = "Premium_Resume.pdf";
      if (personal.name && !personal.name.includes("Your Name")) {
        fileName = `${personal.name.trim().replace(/\s+/g, "_")}_Resume.pdf`;
      }
      
      pdf.save(fileName);
    } catch (error) {
      console.error("Error exporting PDF:", error);
      alert("Failed to generate PDF. Please try again.");
    } finally {
      setIsExporting(false);
    }
  };

  // ==========================================
  // TEMPLATE RENDERERS
  // ==========================================
  
  // Custom Dynamic Theme Generator
  const activeColors = {
    primary: design.primaryColor,
    dark: design.fontColor,
    light: design.primaryColor + "1A", // 10% opacity for soft backgrounds
  };

  const renderModernTemplate = () => (
    <div className="flex flex-row w-[210mm] min-h-[297mm] bg-white text-left" style={{ fontFamily: design.fontFamily, color: design.fontColor }}>
      <div className="w-[35%] p-8 flex flex-col gap-8" style={{ backgroundColor: activeColors.dark, color: "#ffffff" }}>
        <div className="w-32 h-32 mx-auto rounded-full border-4 overflow-hidden flex shrink-0 items-center justify-center bg-white/10" style={{ borderColor: activeColors.primary }}>
          {personal.photo ? <img src={personal.photo} className="w-full h-full object-cover object-[center_15%]" alt="Profile" /> : <span className="text-xs uppercase tracking-widest opacity-50">No Photo</span>}
        </div>
        
        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest border-b pb-2 mb-4" style={{ borderColor: "rgba(255,255,255,0.2)", color: activeColors.primary }}>Contact</h3>
          <div className="space-y-3 text-xs font-medium opacity-90">
            {personal.phone && <div>📱 {personal.phone}</div>}
            {personal.email && <div>✉️ {personal.email}</div>}
            {personal.address && <div>📍 {personal.address}</div>}
            {personal.linkedin && <div>🔗 {personal.linkedin.replace('https://', '')}</div>}
            {personal.github && <div>💻 {personal.github.replace('https://', '')}</div>}
            {personal.portfolio && <div>🌐 {personal.portfolio.replace('https://', '')}</div>}
          </div>
        </div>

        <div>
          <h3 className="text-xs font-bold uppercase tracking-widest border-b pb-2 mb-4" style={{ borderColor: "rgba(255,255,255,0.2)", color: activeColors.primary }}>Skills</h3>
          <div className="space-y-4 text-xs opacity-90">
            {Object.entries(skills).map(([category, items]) => items && (
              <div key={category}>
                <span className="font-bold block mb-1 capitalize text-white">{category}</span>
                <div className="flex flex-wrap gap-1.5">
                  {getSkillBadges(items).map((skill, i) => (
                    <span key={i} className="px-2 py-0.5 rounded-sm bg-white/10">{skill}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        {languages.length > 0 && languages[0].language && (
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest border-b pb-2 mb-4" style={{ borderColor: "rgba(255,255,255,0.2)", color: activeColors.primary }}>Languages</h3>
            <div className="space-y-2 text-xs">
              {languages.map((lang) => (
                <div key={lang.id} className="flex justify-between items-center">
                  <span className="font-bold text-white">{lang.language}</span>
                  <span className="opacity-70">{lang.proficiency}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <div className="w-[65%] p-10 flex flex-col gap-7">
        <div>
          <h1 className="text-4xl font-black uppercase tracking-tight leading-none mb-1" style={{ color: activeColors.dark }}>{personal.name || "Your Name"}</h1>
          <h2 className="text-lg font-bold uppercase tracking-widest" style={{ color: activeColors.primary }}>{personal.title || "Professional Title"}</h2>
        </div>

        {summary && (
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest border-b-2 pb-1 mb-3" style={{ borderColor: activeColors.light }}>Profile</h3>
            <p className="text-sm leading-relaxed text-justify" style={{ opacity: 0.8 }}>{summary}</p>
          </div>
        )}

        {experience.length > 0 && experience[0].company && (
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest border-b-2 pb-1 mb-4" style={{ borderColor: activeColors.light }}>Experience</h3>
            <div className="space-y-5">
              {experience.map((exp) => (
                <div key={exp.id} className="relative pl-4 border-l-2" style={{ borderColor: activeColors.light }}>
                  <div className="flex justify-between items-start mb-0.5">
                    <h4 className="text-sm font-bold">{exp.role}</h4>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: activeColors.light }}>{exp.duration}</span>
                  </div>
                  <p className="text-xs font-bold mb-2" style={{ opacity: 0.7 }}>{exp.company}</p>
                  <p className="text-xs leading-relaxed text-justify" style={{ opacity: 0.8 }}>{exp.details}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {projects.length > 0 && projects[0].name && (
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest border-b-2 pb-1 mb-4" style={{ borderColor: activeColors.light }}>Projects</h3>
            <div className="space-y-5">
              {projects.map((proj) => (
                <div key={proj.id}>
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h4 className="text-sm font-bold">{proj.name}</h4>
                  </div>
                  {proj.stack && <p className="text-[10px] font-bold mb-1" style={{ color: activeColors.primary }}>{proj.stack}</p>}
                  <p className="text-xs leading-relaxed text-justify" style={{ opacity: 0.8 }}>{proj.description}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {education.length > 0 && education[0].degree && (
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest border-b-2 pb-1 mb-4" style={{ borderColor: activeColors.light }}>Education</h3>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex justify-between items-start">
                    <h4 className="text-sm font-bold">{edu.degree}</h4>
                    <span className="text-[10px] font-bold" style={{ opacity: 0.7 }}>{edu.year}</span>
                  </div>
                  <div className="flex justify-between items-center mt-0.5 text-xs">
                    <p className="font-medium" style={{ opacity: 0.8 }}>{edu.institution}</p>
                    {edu.gpa && <span className="font-bold" style={{ opacity: 0.7 }}>GPA: {edu.gpa}</span>}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {certifications.length > 0 && certifications[0].name && (
          <div>
            <h3 className="text-sm font-black uppercase tracking-widest border-b-2 pb-1 mb-4" style={{ borderColor: activeColors.light }}>Certifications</h3>
            <div className="space-y-3">
              {certifications.map((cert) => (
                <div key={cert.id} className="flex justify-between items-start text-xs">
                  <div>
                    <span className="font-bold block">{cert.name}</span>
                    <span style={{ opacity: 0.7 }}>{cert.issuer}</span>
                  </div>
                  <span className="font-bold" style={{ opacity: 0.7 }}>{cert.year}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );

  const renderMinimalTemplate = () => (
    <div className="w-[210mm] min-h-[297mm] p-12 flex flex-col gap-6 bg-white text-left" style={{ fontFamily: design.fontFamily, color: design.fontColor }}>
      <div className="text-center border-b-2 pb-6" style={{ borderColor: activeColors.primary }}>
        <h1 className="text-4xl font-bold tracking-tight mb-2">{personal.name}</h1>
        <p className="text-lg font-medium mb-3" style={{ color: activeColors.primary }}>{personal.title}</p>
        <div className="flex flex-wrap justify-center gap-4 text-xs font-medium" style={{ opacity: 0.8 }}>
          {personal.email && <span>{personal.email}</span>}
          {personal.phone && <span>• {personal.phone}</span>}
          {personal.address && <span>• {personal.address}</span>}
          {personal.linkedin && <span>• {personal.linkedin}</span>}
        </div>
      </div>

      {summary && (
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest mb-2" style={{ color: activeColors.primary }}>Professional Summary</h3>
          <p className="text-sm leading-relaxed" style={{ opacity: 0.85 }}>{summary}</p>
        </div>
      )}

      {experience.length > 0 && experience[0].company && (
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest border-b pb-1 mb-3" style={{ color: activeColors.primary, borderColor: activeColors.light }}>Experience</h3>
          <div className="space-y-4">
            {experience.map((exp) => (
              <div key={exp.id}>
                <div className="flex justify-between font-bold text-sm">
                  <span>{exp.role}</span>
                  <span style={{ opacity: 0.8 }}>{exp.duration}</span>
                </div>
                <div className="text-xs font-semibold mb-1" style={{ opacity: 0.7 }}>{exp.company}</div>
                <p className="text-xs leading-relaxed" style={{ opacity: 0.85 }}>{exp.details}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="grid grid-cols-2 gap-8">
        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest border-b pb-1 mb-3" style={{ color: activeColors.primary, borderColor: activeColors.light }}>Projects</h3>
          <div className="space-y-4">
            {projects.map((proj) => (
              <div key={proj.id}>
                <div className="font-bold text-sm">{proj.name}</div>
                <div className="text-[10px] mb-1" style={{ opacity: 0.6 }}>{proj.stack}</div>
                <p className="text-xs" style={{ opacity: 0.85 }}>{proj.description}</p>
              </div>
            ))}
          </div>
        </div>
        
        <div className="space-y-6">
          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest border-b pb-1 mb-3" style={{ color: activeColors.primary, borderColor: activeColors.light }}>Skills</h3>
            <div className="text-xs space-y-1" style={{ opacity: 0.9 }}>
              {skills.languages && <div><strong>Languages:</strong> {skills.languages}</div>}
              {skills.frontend && <div><strong>Frontend:</strong> {skills.frontend}</div>}
              {skills.backend && <div><strong>Backend:</strong> {skills.backend}</div>}
              {skills.tools && <div><strong>Tools:</strong> {skills.tools}</div>}
            </div>
          </div>

          <div>
            <h3 className="text-sm font-bold uppercase tracking-widest border-b pb-1 mb-3" style={{ color: activeColors.primary, borderColor: activeColors.light }}>Education</h3>
            {education.map(edu => (
              <div key={edu.id} className="mb-2">
                <div className="font-bold text-sm">{edu.degree}</div>
                <div className="text-xs flex justify-between" style={{ opacity: 0.8 }}>
                  <span>{edu.institution}</span>
                  <span>{edu.year}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderCreativeTemplate = () => (
    <div className="w-[210mm] min-h-[297mm] bg-white text-left flex flex-col" style={{ fontFamily: design.fontFamily, color: design.fontColor }}>
      <div className="relative pt-12 pb-16 px-10 text-center" style={{ backgroundColor: activeColors.primary, color: "#fff" }}>
        <h1 className="text-5xl font-black tracking-tight mb-2">{personal.name}</h1>
        <h2 className="text-xl font-medium tracking-wide opacity-90">{personal.title}</h2>
        {personal.photo && (
          <div className="absolute -bottom-16 left-1/2 -translate-x-1/2 w-32 h-32 rounded-2xl border-4 border-white shadow-xl overflow-hidden bg-white">
            <img src={personal.photo} className="w-full h-full object-cover object-[center_15%]" alt="Profile" />
          </div>
        )}
      </div>

      <div className={`px-10 ${personal.photo ? 'pt-24' : 'pt-10'} pb-10 flex gap-8 flex-1`}>
        <div className="w-1/3 flex flex-col gap-6 border-r pr-8" style={{ borderColor: activeColors.light }}>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: activeColors.primary }}>Contact</h3>
            <div className="space-y-2 text-xs font-medium w-full wrap-break-word" style={{ opacity: 0.8 }}>
              {personal.phone && <div>{personal.phone}</div>}
              {personal.email && <div>{personal.email}</div>}
              {personal.address && <div>{personal.address}</div>}
              {personal.linkedin && <div>{personal.linkedin}</div>}
            </div>
          </div>
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: activeColors.primary }}>Tech Stack</h3>
            <div className="flex flex-wrap gap-1.5">
              {[...(getSkillBadges(skills.languages)), ...(getSkillBadges(skills.frontend))].map((s,i) => (
                <span key={i} className="text-[10px] px-2 py-1 rounded-md font-bold" style={{ backgroundColor: activeColors.light }}>{s}</span>
              ))}
            </div>
          </div>
          <div>
             <h3 className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: activeColors.primary }}>Education</h3>
             {education.map(edu => (
                <div key={edu.id} className="mb-4">
                  <p className="text-sm font-bold leading-tight">{edu.degree}</p>
                  <p className="text-xs mt-1" style={{ opacity: 0.7 }}>{edu.institution} <br/> {edu.year}</p>
                </div>
              ))}
          </div>
        </div>
        
        <div className="w-2/3 flex flex-col gap-6">
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-2" style={{ color: activeColors.primary }}>About Me</h3>
            <p className="text-sm leading-relaxed" style={{ opacity: 0.85 }}>{summary}</p>
          </div>
          
          <div>
            <h3 className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: activeColors.primary }}>Experience</h3>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id} className="p-4 rounded-xl border" style={{ borderColor: activeColors.light, backgroundColor: activeColors.light }}>
                  <div className="flex justify-between items-center mb-1">
                    <h4 className="font-bold text-sm">{exp.role}</h4>
                    <span className="text-[10px] font-bold" style={{ opacity: 0.7 }}>{exp.duration}</span>
                  </div>
                  <p className="text-xs font-bold mb-2" style={{ color: activeColors.primary }}>{exp.company}</p>
                  <p className="text-xs" style={{ opacity: 0.85 }}>{exp.details}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  const renderDeveloperTemplate = () => (
    <div className="w-[210mm] min-h-[297mm] p-10 text-left" style={{ fontFamily: design.fontFamily, backgroundColor: activeColors.dark, color: "#ffffff" }}>
      <div className="border-b-2 pb-6 mb-6" style={{ borderColor: activeColors.primary }}>
        <h1 className="text-4xl font-bold mb-2">{personal.name} <span style={{ color: activeColors.primary }}>{"/>"}</span></h1>
        <div className="text-sm mb-4" style={{ opacity: 0.7 }}>const title = "{personal.title}";</div>
        <div className="flex gap-4 text-xs" style={{ opacity: 0.8 }}>
          {personal.email && <span>{personal.email}</span>}
          {personal.github && <span>github: {personal.github.replace('https://', '')}</span>}
        </div>
      </div>

      <div className="flex gap-8">
        <div className="w-2/3 space-y-6">
          <div>
            <div className="text-xs font-bold mb-2" style={{ color: activeColors.primary }}>// EXPERIENCE</div>
            {experience.map(exp => (
              <div key={exp.id} className="mb-4">
                <div className="text-sm font-bold">{exp.role} <span className="font-normal" style={{ opacity: 0.7 }}>@ {exp.company}</span></div>
                <div className="text-[10px] mb-2" style={{ opacity: 0.6 }}>{exp.duration}</div>
                <p className="text-xs leading-relaxed" style={{ opacity: 0.85 }}>{exp.details}</p>
              </div>
            ))}
          </div>
          <div>
            <div className="text-xs font-bold mb-2" style={{ color: activeColors.primary }}>// PROJECTS</div>
            {projects.map(proj => (
              <div key={proj.id} className="mb-4 border p-3 rounded-md" style={{ borderColor: "rgba(255,255,255,0.1)" }}>
                <div className="text-sm font-bold mb-1">{proj.name}</div>
                <div className="text-[10px] mb-2" style={{ opacity: 0.7 }}>stack: [{proj.stack}]</div>
                <p className="text-xs leading-relaxed" style={{ opacity: 0.85 }}>{proj.description}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="w-1/3 space-y-6">
          <div>
            <div className="text-xs font-bold mb-2" style={{ color: activeColors.primary }}>// SKILLS</div>
            <div className="flex flex-wrap gap-2">
               {[...(getSkillBadges(skills.languages)), ...(getSkillBadges(skills.frontend)), ...(getSkillBadges(skills.backend))].map((s,i) => (
                <span key={i} className="text-[10px] px-1.5 py-0.5 border" style={{ borderColor: activeColors.primary, opacity: 0.9 }}>{s}</span>
              ))}
            </div>
          </div>
          <div>
            <div className="text-xs font-bold mb-2" style={{ color: activeColors.primary }}>// EDUCATION</div>
            {education.map(edu => (
              <div key={edu.id} className="mb-2">
                <div className="text-sm">{edu.degree}</div>
                <div className="text-xs" style={{ opacity: 0.7 }}>{edu.institution}</div>
                <div className="text-[10px]" style={{ opacity: 0.6 }}>{edu.year}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );

  const renderExecutiveTemplate = () => (
    <div className="w-[210mm] min-h-[297mm] p-12 bg-white text-left" style={{ fontFamily: design.fontFamily, color: design.fontColor }}>
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold uppercase tracking-widest mb-2">{personal.name}</h1>
        <p className="text-sm uppercase tracking-widest mb-4 font-bold" style={{ color: activeColors.primary }}>{personal.title}</p>
        <div className="flex justify-center items-center gap-3 text-xs font-sans" style={{ opacity: 0.8 }}>
          {personal.address && <span>{personal.address}</span>} |
          {personal.phone && <span>{personal.phone}</span>} |
          {personal.email && <span>{personal.email}</span>}
        </div>
      </div>

      <div className="space-y-6">
        {summary && (
          <div>
            <p className="text-sm leading-relaxed text-justify" style={{ opacity: 0.9 }}>{summary}</p>
          </div>
        )}

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest border-b-2 mb-4 pb-1" style={{ borderColor: activeColors.dark }}>Professional Experience</h3>
          <div className="space-y-5">
            {experience.map(exp => (
              <div key={exp.id}>
                <div className="flex justify-between font-bold text-sm">
                  <span>{exp.company}</span>
                  <span style={{ opacity: 0.8 }}>{exp.duration}</span>
                </div>
                <div className="text-sm italic mb-1" style={{ opacity: 0.8 }}>{exp.role}</div>
                <p className="text-xs leading-relaxed text-justify font-sans mt-2" style={{ opacity: 0.85 }}>{exp.details}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest border-b-2 mb-4 pb-1" style={{ borderColor: activeColors.dark }}>Education</h3>
          {education.map(edu => (
            <div key={edu.id} className="flex justify-between text-sm mb-2">
              <div>
                <span className="font-bold">{edu.institution}</span>
                <span className="italic" style={{ opacity: 0.8 }}> — {edu.degree}</span>
              </div>
              <span className="font-bold">{edu.year}</span>
            </div>
          ))}
        </div>

        <div>
          <h3 className="text-sm font-bold uppercase tracking-widest border-b-2 mb-4 pb-1" style={{ borderColor: activeColors.dark }}>Core Competencies</h3>
          <p className="text-sm font-sans leading-relaxed" style={{ opacity: 0.9 }}>
            <strong>Technical:</strong> {skills.languages}, {skills.frontend}, {skills.backend} <br/>
            <strong>Tools:</strong> {skills.tools}
          </p>
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-zinc-300 selection:bg-indigo-500/30 font-sans">
      
      {/* GLOW */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] rounded-full bg-indigo-900/20 blur-[120px]" />
      </div>

      {/* HEADER & TEMPLATE SELECTORS */}
      <header className="relative z-20 border-b border-white/5 bg-black/60 backdrop-blur-2xl px-6 py-4 flex flex-col md:flex-row justify-between items-center shadow-2xl gap-4">
        
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-10 h-10 rounded-xl bg-blue-600 p-px shrink-0">
            <div className="w-full h-full bg-black/80 rounded-xl flex items-center justify-center backdrop-blur-md">
              <span className="text-xl font-black text-cyan-400">C</span>
            </div>
          </div>
          <h1 className="text-lg font-bold text-white tracking-wide shrink-0">CareerSync<span className="text-white/40 font-normal">Builder</span></h1>
        </div>

        {/* CONTROLS: TEMPLATE SWITCHER */}
        <div className="flex flex-wrap items-center justify-center gap-4 w-full md:w-auto bg-white/5 p-1.5 rounded-2xl border border-white/10">
          <div className="flex items-center gap-1">
            {TEMPLATES.map(t => (
              <button 
                key={t.id} 
                onClick={() => setTemplate(t.id)}
                className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition-all ${template === t.id ? 'bg-white/10 text-white shadow-md' : 'text-zinc-500 hover:text-zinc-300'}`}
                title={t.name}
              >
                {t.icon} <span className="hidden xl:inline ml-1">{t.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* ATS & EXPORT */}
        <div className="flex items-center gap-4 w-full md:w-auto justify-end">
          <div className="hidden xl:flex items-center gap-3 bg-white/5 border border-white/10 px-4 py-2 rounded-full cursor-pointer hover:bg-white/10" onClick={() => setActiveTab("ats")}>
            <span className="text-xs font-semibold text-zinc-400 uppercase tracking-widest">
              {score < 50 ? "Weak Match" : score < 80 ? "Good Match" : "Strong Match"}
            </span>
            <div className="w-20 h-1.5 bg-black rounded-full overflow-hidden">
              <div 
                className={`h-full transition-all duration-700 ease-out ${
                  score < 50 ? "bg-linear-to-r from-rose-500 to-red-500" : score < 80 ? "bg-linear-to-r from-amber-400 to-orange-500" : "bg-linear-to-r from-emerald-400 to-teal-500"
                }`} 
                style={{ width: `${score}%` }} 
              />
            </div>
            <span className="text-xs font-bold text-white">{score}%</span>
          </div>

          <button
            onClick={handleDownloadPDF}
            disabled={isExporting}
            className={`group relative inline-flex items-center justify-center px-6 py-2.5 text-sm font-semibold text-white transition-all bg-indigo-600 rounded-full hover:bg-indigo-500 hover:scale-105 active:scale-95 shadow-lg shadow-indigo-500/20 ${isExporting ? "opacity-50 cursor-not-allowed" : ""}`}
          >
            {isExporting ? "Generating PDF..." : "Download PDF"}
          </button>
        </div>
      </header>

      {/* WORKSPACE */}
      <div className="relative z-10 flex flex-col xl:flex-row h-[calc(100vh-85px)] max-w-480 mx-auto">
        
        {/* LEFT PANEL - EDITOR */}
        <div className="w-full xl:w-[45%] flex flex-col border-r border-white/5 bg-black/20 backdrop-blur-sm">
          <div className="p-6 pb-0 overflow-x-auto hide-scrollbar">
            <div className="flex gap-2 p-1.5 bg-white/5 border border-white/10 rounded-2xl w-max">
              {[
                { id: "personal", icon: "👤", label: "Identity" },
                { id: "summary", icon: "✨", label: "Summary" },
                { id: "skills", icon: "⚡", label: "Skills" },
                { id: "experience", icon: "💼", label: "Experience" },
                { id: "projects", icon: "🚀", label: "Projects" },
                { id: "education", icon: "🎓", label: "Education" },
                { id: "certifications", icon: "📜", label: "Certs" },
                { id: "languages", icon: "🌐", label: "Languages" },
                { id: "design", icon: "🎨", label: "Design" }, // NEW DESIGN TAB
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 whitespace-nowrap ${activeTab === tab.id ? 'bg-white/10 text-white shadow-lg' : 'text-zinc-500 hover:text-zinc-300 hover:bg-white/5'}`}
                >
                  <span>{tab.icon}</span> {tab.label}
                </button>
              ))}
            </div>
          </div>

          <div className="flex-1 overflow-y-auto p-6 custom-scrollbar">
            <div className="max-w-2xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
              
              {/* --- NEW DESIGN SECTION --- */}
              {activeTab === "design" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-white tracking-tight">Resume Appearance</h2>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="flex flex-col gap-1.5 w-full bg-white/5 border border-white/10 p-5 rounded-2xl">
                      <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-1">Theme Accent Color</label>
                      <div className="flex items-center gap-4">
                        <input type="color" className="w-12 h-12 rounded-xl cursor-pointer bg-black/50 border border-white/10 outline-none" value={design.primaryColor} onChange={(e) => setDesign({...design, primaryColor: e.target.value})} />
                        <span className="text-sm font-mono font-bold text-white uppercase">{design.primaryColor}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 w-full bg-white/5 border border-white/10 p-5 rounded-2xl">
                      <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-1">Text & Header Color</label>
                      <div className="flex items-center gap-4">
                        <input type="color" className="w-12 h-12 rounded-xl cursor-pointer bg-black/50 border border-white/10 outline-none" value={design.fontColor} onChange={(e) => setDesign({...design, fontColor: e.target.value})} />
                        <span className="text-sm font-mono font-bold text-white uppercase">{design.fontColor}</span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-1.5 w-full md:col-span-2 bg-white/5 border border-white/10 p-5 rounded-2xl">
                      <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-1">Typography Style (Font)</label>
                      <select 
                        className="w-full bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-zinc-300 focus:outline-none focus:border-indigo-500 transition-all cursor-pointer"
                        value={design.fontFamily}
                        onChange={(e) => setDesign({...design, fontFamily: e.target.value})}
                      >
                        <option value="'Inter', sans-serif">Inter (Modern Sans-Serif)</option>
                        <option value="'Roboto', sans-serif">Roboto (Clean & Legible)</option>
                        <option value="'Helvetica Neue', Helvetica, Arial, sans-serif">Helvetica (Professional Corporate)</option>
                        <option value="'Georgia', serif">Georgia (Elegant Serif)</option>
                        <option value="'Times New Roman', Times, serif">Times New Roman (Classic Academic)</option>
                        <option value="'Courier New', Courier, monospace">Courier New (Monospace Developer)</option>
                        <option value="'Trebuchet MS', 'Lucida Sans Unicode', 'Lucida Grande', 'Lucida Sans', Arial, sans-serif">Trebuchet MS (Friendly & Open)</option>
                      </select>
                    </div>
                  </div>
                </div>
              )}

              {/* --- EDITOR SECTIONS --- */}
              {activeTab === "ats" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-white tracking-tight">ATS Score Breakdown</h2>
                  <div className="space-y-4">
                    <ScoreRow label="Personal Information" score={scoreBreakdown.personalInfo} total={15} />
                    <ScoreRow label="Professional Summary" score={scoreBreakdown.summary} total={10} />
                    <ScoreRow label="Technical Skills" score={scoreBreakdown.skills} total={15} />
                    <ScoreRow label="Work Experience" score={scoreBreakdown.experience} total={15} />
                    <ScoreRow label="Projects" score={scoreBreakdown.projects} total={15} />
                    <ScoreRow label="Education" score={scoreBreakdown.education} total={10} />
                    <ScoreRow label="Certifications" score={scoreBreakdown.certifications} total={10} />
                    <ScoreRow label="Languages" score={scoreBreakdown.languages} total={10} />
                  </div>
                </div>
              )}

              {activeTab === "personal" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-white tracking-tight">Personal Identity</h2>
                  <div className="flex items-center gap-6 mb-2">
                    <div className="group relative w-24 h-24 shrink-0 rounded-full bg-white/5 border-2 border-dashed border-white/20 flex items-center justify-center overflow-hidden hover:border-indigo-500 transition-all cursor-pointer">
                      {personal.photo ? (
                        <img src={personal.photo} alt="Preview" className="w-full h-full object-cover object-[center_15%]" />
                      ) : (
                        <div className="flex flex-col items-center"><span className="text-2xl mb-1">📷</span></div>
                      )}
                      <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer w-full h-full" onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) { const reader = new FileReader(); reader.onloadend = () => setPersonal({ ...personal, photo: reader.result }); reader.readAsDataURL(file); }
                        }}
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-5">
                    <InputField label="Full Name" value={personal.name} onChange={(v) => setPersonal({ ...personal, name: v })} />
                    <InputField label="Target Role" value={personal.title} onChange={(v) => setPersonal({ ...personal, title: v })} />
                    <InputField label="Email Address" type="email" value={personal.email} onChange={(v) => setPersonal({ ...personal, email: v })} />
                    <InputField label="Phone Number" value={personal.phone} onChange={(v) => setPersonal({ ...personal, phone: v })} />
                    <div className="col-span-2"><InputField label="Location (City, Country)" value={personal.address} onChange={(v) => setPersonal({ ...personal, address: v })} /></div>
                    <InputField label="GitHub Profile" value={personal.github} onChange={(v) => setPersonal({ ...personal, github: v })} />
                    <InputField label="LinkedIn Profile" value={personal.linkedin} onChange={(v) => setPersonal({ ...personal, linkedin: v })} />
                    <div className="col-span-2"><InputField label="Portfolio Website" value={personal.portfolio} onChange={(v) => setPersonal({ ...personal, portfolio: v })} /></div>
                  </div>
                </div>
              )}

              {activeTab === "summary" && (
                <div className="space-y-4">
                  <h2 className="text-2xl font-semibold text-white tracking-tight">Executive Summary</h2>
                  <textarea rows="6" className="w-full bg-black/50 border border-white/10 rounded-2xl p-4 text-zinc-300 focus:outline-none focus:border-indigo-500 transition-all resize-none" value={summary || ""} onChange={(e) => setSummary(e.target.value)} />
                </div>
              )}

              {activeTab === "skills" && (
                <div className="space-y-5">
                  <h2 className="text-2xl font-semibold text-white tracking-tight">Technical Arsenal</h2>
                  <InputField label="Core Languages" value={skills.languages} onChange={(v) => setSkills({ ...skills, languages: v })} />
                  <InputField label="Frontend Frameworks" value={skills.frontend} onChange={(v) => setSkills({ ...skills, frontend: v })} />
                  <InputField label="Backend & Databases" value={skills.backend} onChange={(v) => setSkills({ ...skills, backend: v })} />
                  <InputField label="Tools & Software" value={skills.tools} onChange={(v) => setSkills({ ...skills, tools: v })} />
                </div>
              )}

              {activeTab === "experience" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-white tracking-tight">Work Experience</h2>
                  {experience.map((exp) => (
                    <Card key={exp.id} onRemove={() => handleBlockRemove(setExperience, exp.id)}>
                      <InputField label="Company Name" value={exp.company} onChange={(v) => handleBlockUpdate(setExperience, exp.id, "company", v)} />
                      <InputField label="Job Title" value={exp.role} onChange={(v) => handleBlockUpdate(setExperience, exp.id, "role", v)} />
                      <InputField label="Duration" value={exp.duration} onChange={(v) => handleBlockUpdate(setExperience, exp.id, "duration", v)} />
                      <div className="mt-4">
                        <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-2 block">Responsibilities</label>
                        <textarea rows="3" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-zinc-300 focus:border-indigo-500 transition-all resize-none" value={exp.details || ""} onChange={(e) => handleBlockUpdate(setExperience, exp.id, "details", e.target.value)} />
                      </div>
                    </Card>
                  ))}
                  <AddButton onClick={() => handleBlockAdd(setExperience, { company: '', role: '', duration: '', details: '' })}>Add Experience</AddButton>
                </div>
              )}

              {activeTab === "projects" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-white tracking-tight">Key Projects</h2>
                  {projects.map((proj) => (
                    <Card key={proj.id} onRemove={() => handleBlockRemove(setProjects, proj.id)}>
                      <InputField label="Project Name" value={proj.name} onChange={(v) => handleBlockUpdate(setProjects, proj.id, "name", v)} />
                      <InputField label="Tech Stack" value={proj.stack} onChange={(v) => handleBlockUpdate(setProjects, proj.id, "stack", v)} />
                      <div className="mt-4">
                        <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest mb-2 block">Project Details</label>
                        <textarea rows="3" className="w-full bg-black/40 border border-white/10 rounded-xl p-3 text-sm text-zinc-300 focus:border-indigo-500 transition-all resize-none" value={proj.description || ""} onChange={(e) => handleBlockUpdate(setProjects, proj.id, "description", e.target.value)} />
                      </div>
                    </Card>
                  ))}
                  <AddButton onClick={() => handleBlockAdd(setProjects, { name: '', stack: '', description: '', github: '', live: '' })}>Add Project</AddButton>
                </div>
              )}

              {activeTab === "education" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-white tracking-tight">Education</h2>
                  {education.map((edu) => (
                    <Card key={edu.id} onRemove={() => handleBlockRemove(setEducation, edu.id)}>
                      <InputField label="Degree / Program" value={edu.degree} onChange={(v) => handleBlockUpdate(setEducation, edu.id, "degree", v)} />
                      <InputField label="University / Institution" value={edu.institution} onChange={(v) => handleBlockUpdate(setEducation, edu.id, "institution", v)} />
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <InputField label="Year" value={edu.year} onChange={(v) => handleBlockUpdate(setEducation, edu.id, "year", v)} />
                        <InputField label="GPA / Score" value={edu.gpa} onChange={(v) => handleBlockUpdate(setEducation, edu.id, "gpa", v)} />
                      </div>
                    </Card>
                  ))}
                  <AddButton onClick={() => handleBlockAdd(setEducation, { degree: '', institution: '', year: '', gpa: '' })}>Add Education</AddButton>
                </div>
              )}
              
              {activeTab === "certifications" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-white tracking-tight">Certifications</h2>
                  {certifications.map((cert) => (
                    <Card key={cert.id} onRemove={() => handleBlockRemove(setCertifications, cert.id)}>
                      <InputField label="Certification Name" value={cert.name} onChange={(v) => handleBlockUpdate(setCertifications, cert.id, "name", v)} />
                      <div className="grid grid-cols-2 gap-4 mt-4">
                        <InputField label="Issuer" value={cert.issuer} onChange={(v) => handleBlockUpdate(setCertifications, cert.id, "issuer", v)} />
                        <InputField label="Year" value={cert.year} onChange={(v) => handleBlockUpdate(setCertifications, cert.id, "year", v)} />
                      </div>
                    </Card>
                  ))}
                  <AddButton onClick={() => handleBlockAdd(setCertifications, { name: '', issuer: '', year: '' })}>Add Certification</AddButton>
                </div>
              )}

              {activeTab === "languages" && (
                <div className="space-y-6">
                  <h2 className="text-2xl font-semibold text-white tracking-tight">Languages</h2>
                  {languages.map((lang) => (
                    <Card key={lang.id} onRemove={() => handleBlockRemove(setLanguages, lang.id)}>
                      <div className="grid grid-cols-2 gap-4">
                        <InputField label="Language" value={lang.language} onChange={(v) => handleBlockUpdate(setLanguages, lang.id, "language", v)} />
                        <InputField label="Proficiency" value={lang.proficiency} onChange={(v) => handleBlockUpdate(setLanguages, lang.id, "proficiency", v)} />
                      </div>
                    </Card>
                  ))}
                  <AddButton onClick={() => handleBlockAdd(setLanguages, { language: '', proficiency: '' })}>Add Language</AddButton>
                </div>
              )}

            </div>
          </div>
        </div>

        {/* RIGHT PANEL - A4 PREVIEW */}
        <div className="w-full xl:w-[55%] flex justify-center overflow-y-auto p-4 lg:p-10 hide-scrollbar bg-zinc-900/50">
          <div style={{ boxShadow: "0 20px 50px rgba(0,0,0,0.5)" }}>
            <div ref={resumeRef} className="relative w-[210mm] min-h-[297mm] overflow-hidden" style={{ backgroundColor: template === 'developer' ? design.fontColor : "#ffffff" }}>
              {template === "modern" && renderModernTemplate()}
              {template === "minimal" && renderMinimalTemplate()}
              {template === "creative" && renderCreativeTemplate()}
              {template === "developer" && renderDeveloperTemplate()}
              {template === "executive" && renderExecutiveTemplate()}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

// UI Sub-components
const InputField = ({ label, type = "text", value, onChange }) => (
  <div className="flex flex-col gap-1.5 w-full">
    <label className="text-[11px] font-semibold text-zinc-500 uppercase tracking-widest">{label}</label>
    <input type={type} className="bg-black/50 border border-white/10 rounded-xl p-3 text-sm text-zinc-300 focus:outline-none focus:border-indigo-500 transition-all shadow-inner" value={value || ""} onChange={(e) => onChange(e.target.value)} />
  </div>
);

const Card = ({ children, onRemove }) => (
  <div className="relative group bg-white/5 border border-white/5 p-5 rounded-2xl hover:border-white/10 transition-colors">
    <button onClick={onRemove} className="absolute top-4 right-4 text-xs font-bold text-rose-500 opacity-0 group-hover:opacity-100 transition-opacity bg-rose-500/10 px-2 py-1 rounded-md z-10 cursor-pointer">Delete</button>
    {children}
  </div>
);

const AddButton = ({ onClick, children }) => (
  <button onClick={onClick} className="w-full py-3 border border-dashed border-white/20 rounded-xl text-sm font-semibold text-zinc-400 hover:text-white hover:border-white/40 hover:bg-white/5 transition-all cursor-pointer">+ {children}</button>
);

const ScoreRow = ({ label, score, total }) => (
  <div className="bg-white/5 border border-white/10 p-4 rounded-xl flex flex-col gap-3">
    <div className="flex justify-between items-center text-sm"><span className="font-medium text-zinc-300">{label}</span><span className="font-bold text-white">{score} <span className="text-zinc-500 font-normal">/ {total}</span></span></div>
    <div className="w-full h-2 bg-black/50 rounded-full overflow-hidden"><div className="h-full bg-indigo-500 transition-all duration-700" style={{ width: `${(score / total) * 100}%` }}/></div>
  </div>
);

export default PremiumResumeBuilder;