
import React, { useState, useEffect } from 'react';
import { CoastalHeroScene } from './components/QuantumScene';
import { ExperienceTimeline, CoreCompetencies, CampVisualizer } from './components/Diagrams';
import { ArrowDown, Menu, X, Globe, User, Briefcase, BookOpen, Mail, Phone, FileText, MapPin, Layers, Award } from 'lucide-react';

const App: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (id: string) => (e: React.MouseEvent) => {
    e.preventDefault();
    setMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const headerOffset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
    }
  };

  return (
    <div className="min-h-screen bg-coast-foam text-coast-deep selection:bg-coast-water selection:text-white font-sans">
      
      {/* Navigation */}
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? 'bg-white/95 backdrop-blur-md border-b border-coast-slate/20 py-3 shadow-sm' : 'bg-transparent py-6'}`}>
        <div className="container mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-3 cursor-pointer" onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}>
            <div className="w-10 h-10 bg-coast-deep rounded-sm flex items-center justify-center text-white font-serif font-bold text-xl shadow-sm">
              JD
            </div>
            <div className="flex flex-col">
                <span className={`font-serif font-bold text-lg tracking-tight leading-none transition-opacity ${scrolled ? 'opacity-100' : 'opacity-0 md:opacity-100 text-coast-deep'}`}>
                JORGE DURAND
                </span>
                <span className="text-[10px] font-bold tracking-wider uppercase text-coast-slate leading-none mt-1">Humanitarian Consultant</span>
            </div>
          </div>
          
          <div className="hidden md:flex items-center gap-8 text-sm font-medium tracking-wide text-coast-slate">
            <a href="#profile" onClick={scrollToSection('profile')} className="hover:text-coast-water transition-colors cursor-pointer">Profile</a>
            <a href="#experience" onClick={scrollToSection('experience')} className="hover:text-coast-water transition-colors cursor-pointer">Experience</a>
            <a href="#skills" onClick={scrollToSection('skills')} className="hover:text-coast-water transition-colors cursor-pointer">Skills</a>
            <a href="#publications" onClick={scrollToSection('publications')} className="hover:text-coast-water transition-colors cursor-pointer">Publications</a>
            <span className="px-4 py-1.5 bg-coast-deep text-white text-xs font-bold uppercase tracking-wider rounded-full">
              WASH / EMT
            </span>
          </div>

          <button className="md:hidden text-coast-deep p-2" onClick={() => setMenuOpen(!menuOpen)}>
            {menuOpen ? <X /> : <Menu />}
          </button>
        </div>
      </nav>

      {/* Mobile Menu */}
      {menuOpen && (
        <div className="fixed inset-0 z-40 bg-white flex flex-col items-center justify-center gap-8 text-xl font-medium animate-fade-in">
            <a href="#profile" onClick={scrollToSection('profile')} className="hover:text-coast-water transition-colors cursor-pointer">Profile</a>
            <a href="#experience" onClick={scrollToSection('experience')} className="hover:text-coast-water transition-colors cursor-pointer">Experience</a>
            <a href="#skills" onClick={scrollToSection('skills')} className="hover:text-coast-water transition-colors cursor-pointer">Skills</a>
            <a href="#publications" onClick={scrollToSection('publications')} className="hover:text-coast-water transition-colors cursor-pointer">Publications</a>
        </div>
      )}

      {/* Hero Section */}
      <header className="relative h-screen flex items-center justify-center overflow-hidden bg-coast-foam">
        <CoastalHeroScene />
        
        <div className="absolute inset-0 z-0 pointer-events-none bg-[radial-gradient(circle_at_center,transparent_0%,rgba(248,250,252,0.8)_100%)]" />

        <div className="relative z-10 container mx-auto px-6 text-center">
          <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full bg-white/80 backdrop-blur text-coast-deep text-xs tracking-widest uppercase font-bold shadow-lg animate-fade-in-up border border-coast-slate/10">
            <Globe size={14} className="text-coast-water" /> Geneva • Madrid • Global
          </div>
          <h1 className="font-serif font-bold text-5xl md:text-7xl lg:text-8xl leading-tight mb-6 text-coast-deep tracking-tight animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
            Jorge Durand<br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-coast-water to-coast-deep">Zurdo</span>
          </h1>
          <p className="max-w-2xl mx-auto text-lg md:text-xl text-coast-slate font-light leading-relaxed mb-6 animate-fade-in-up" style={{ animationDelay: '0.2s' }}>
            Humanitarian Consultant | WASH/IPC Specialist | EMT Mentor
          </p>
          <p className="max-w-lg mx-auto text-sm md:text-base text-coast-slate/80 mb-12 animate-fade-in-up" style={{ animationDelay: '0.25s' }}>
            20+ years leading global health standards, emergency logistics, and technical guideline development for WHO, PAHO, and ACF.
          </p>
          
          <div className="flex flex-col md:flex-row gap-4 justify-center animate-fade-in-up" style={{ animationDelay: '0.3s' }}>
             <a href="#profile" onClick={scrollToSection('profile')} className="group px-8 py-3 bg-coast-deep text-white rounded-full font-bold tracking-wide hover:bg-coast-water transition-colors shadow-lg flex items-center justify-center gap-2">
                <User size={18} /> VIEW PROFILE
             </a>
             <a href="mailto:joduzu@gmail.com" className="group px-8 py-3 bg-white text-coast-deep border border-coast-slate/20 rounded-full font-bold tracking-wide hover:border-coast-water transition-colors shadow-lg flex items-center justify-center gap-2">
                <Mail size={18} /> CONTACT ME
             </a>
          </div>
        </div>
      </header>

      <main>
        {/* Profile & Competencies */}
        <section id="profile" className="py-24 bg-white">
          <div className="container mx-auto px-6 md:px-12">
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 items-start">
                
                {/* Summary Text */}
                <div className="lg:col-span-5 sticky top-32">
                    <div className="inline-flex items-center gap-2 mb-4 text-xs font-bold tracking-widest text-coast-sand uppercase">
                        <FileText size={16} /> Professional Summary
                    </div>
                    <h2 className="text-4xl font-serif font-bold mb-8 leading-tight text-coast-deep">Strategic leadership in humanitarian emergencies.</h2>
                    
                    <div className="prose prose-lg text-coast-slate text-justify mb-8 leading-relaxed">
                        <p>
                            Seasoned humanitarian consultant with 20+ years of experience in <strong>WASH/IPC</strong>, emergency logistics, and technical standards development for global health actors.
                        </p>
                        <p>
                            Proven track record leading policy guideline development with <strong>WHO, PAHO, and ACF</strong>. Extensive experience mentoring <strong>Emergency Medical Teams (EMT)</strong> and shaping global standards under the WHO EMT Secretariat.
                        </p>
                        <p>
                            Strong background working with donors (DG ECHO, AECID, IFRC) and aligning guidance documents with sector coordination platforms.
                        </p>
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-coast-foam rounded-lg border border-coast-slate/10">
                            <div className="text-2xl font-bold text-coast-water mb-1">20+</div>
                            <div className="text-xs uppercase tracking-wide text-coast-slate font-bold">Years Experience</div>
                        </div>
                        <div className="p-4 bg-coast-foam rounded-lg border border-coast-slate/10">
                            <div className="text-2xl font-bold text-coast-sand mb-1">Global</div>
                            <div className="text-xs uppercase tracking-wide text-coast-slate font-bold">Deployments</div>
                        </div>
                    </div>
                </div>

                {/* Competencies Grid */}
                <div className="lg:col-span-7">
                    <div className="mb-8 flex items-center justify-between">
                        <h3 className="text-2xl font-serif font-bold text-coast-deep">Core Competencies</h3>
                        <div className="h-px bg-coast-slate/20 flex-1 ml-6"></div>
                    </div>
                    <CoreCompetencies />
                </div>
             </div>
          </div>
        </section>

        {/* Experience Timeline */}
        <section id="experience" className="py-24 bg-coast-foam border-y border-coast-slate/10">
            <div className="container mx-auto px-6 md:px-12">
                <div className="text-center max-w-3xl mx-auto mb-16">
                    <div className="inline-flex items-center gap-2 px-3 py-1 bg-coast-deep/5 text-coast-deep text-xs font-bold tracking-widest uppercase rounded-full mb-4">
                        <Briefcase size={14} /> Career Path
                    </div>
                    <h2 className="text-4xl font-serif font-bold mb-6 text-coast-deep">Professional Experience</h2>
                    <p className="text-lg text-coast-slate">
                        From field deployments in complex emergencies to strategic policy making at WHO Headquarters.
                    </p>
                </div>
                
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
                    <div className="lg:col-span-8">
                        <ExperienceTimeline />
                    </div>
                    <div className="lg:col-span-4">
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-coast-slate/10 sticky top-32">
                            <h3 className="font-bold text-coast-deep mb-4 text-lg flex items-center gap-2"><Award size={18} className="text-coast-sand"/> Education</h3>
                            <ul className="space-y-6">
                                <li className="relative pl-6 border-l-2 border-coast-slate/20">
                                    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-coast-water"></div>
                                    <div className="font-bold text-coast-deep">MA, Public Policy & Program Evaluation</div>
                                    <div className="text-sm text-coast-slate">Univ. Complutense Madrid (2015)</div>
                                </li>
                                <li className="relative pl-6 border-l-2 border-coast-slate/20">
                                    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-coast-slate"></div>
                                    <div className="font-bold text-coast-deep">MSc, Hydrogeology</div>
                                    <div className="text-sm text-coast-slate">Univ. Politécnica Cataluña (2005)</div>
                                </li>
                                <li className="relative pl-6 border-l-2 border-coast-slate/20">
                                    <div className="absolute -left-[5px] top-1.5 w-2.5 h-2.5 rounded-full bg-coast-slate"></div>
                                    <div className="font-bold text-coast-deep">BSc, Geological Sciences</div>
                                    <div className="text-sm text-coast-slate">Univ. Complutense Madrid (2004)</div>
                                </li>
                            </ul>
                        </div>
                    </div>
                </div>
            </div>
        </section>

        {/* Skills & 3D Visualization */}
        <section id="skills" className="py-24 bg-coast-deep text-white overflow-hidden relative">
            <div className="absolute inset-0 opacity-5 pointer-events-none">
                 <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
            </div>

            <div className="container mx-auto px-6 relative z-10">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
                     <div className="order-1">
                        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/10 text-coast-sand text-xs font-bold tracking-widest uppercase rounded-full mb-6 border border-white/10">
                            <Layers size={14} /> Technical Expertise
                        </div>
                        <h2 className="text-4xl font-serif font-bold mb-6 text-white">Emergency Logistics & Data</h2>
                        <p className="text-lg text-coast-slate mb-8 leading-relaxed text-slate-300">
                            Combining geological science with advanced data tools to optimize emergency response and WASH interventions.
                        </p>
                        
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                             <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                                <h4 className="font-bold text-coast-water mb-3 flex items-center gap-2"><MapPin size={16}/> Software & GIS</h4>
                                <div className="flex flex-wrap gap-2">
                                    {['ArcGIS', 'QGIS', 'ILWIS', 'MySQL', 'PostGIS'].map(s => (
                                        <span key={s} className="px-2 py-1 bg-white/10 rounded text-xs text-slate-300">{s}</span>
                                    ))}
                                </div>
                            </div>
                            <div className="p-4 bg-white/5 rounded-lg border border-white/10">
                                <h4 className="font-bold text-coast-sand mb-3 flex items-center gap-2"><Layers size={16}/> Data & Viz</h4>
                                <div className="flex flex-wrap gap-2">
                                    {['ODK', 'Kobo', 'Tableau', 'PowerBI', 'SPSS'].map(s => (
                                        <span key={s} className="px-2 py-1 bg-white/10 rounded text-xs text-slate-300">{s}</span>
                                    ))}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-4">
                             <h4 className="font-bold text-white text-sm uppercase tracking-widest">Languages</h4>
                             <div className="space-y-3">
                                 <div>
                                     <div className="flex justify-between text-xs mb-1 text-slate-400"><span>Spanish</span><span>Native</span></div>
                                     <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-coast-water w-[100%]"></div></div>
                                 </div>
                                 <div>
                                     <div className="flex justify-between text-xs mb-1 text-slate-400"><span>English</span><span>Fluent (C2)</span></div>
                                     <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-coast-water w-[95%]"></div></div>
                                 </div>
                                 <div>
                                     <div className="flex justify-between text-xs mb-1 text-slate-400"><span>French</span><span>Intermediate (B1)</span></div>
                                     <div className="h-1.5 w-full bg-white/10 rounded-full overflow-hidden"><div className="h-full bg-coast-sand w-[60%]"></div></div>
                                 </div>
                             </div>
                        </div>
                     </div>
                     
                     <div className="order-2 h-[400px] md:h-[500px] bg-coast-rock rounded-xl overflow-hidden shadow-2xl border border-white/10 relative">
                        <div className="absolute top-4 left-4 z-10 bg-black/30 backdrop-blur px-3 py-1 rounded text-xs text-white/70 font-mono">
                           Interactive Camp Model
                        </div>
                        <CampVisualizer />
                     </div>
                </div>
            </div>
        </section>

        {/* Publications */}
        <section id="publications" className="py-24 bg-white">
            <div className="container mx-auto px-6">
                 <div className="inline-flex items-center gap-2 mb-4 text-xs font-bold tracking-widest text-coast-water uppercase">
                     <BookOpen size={16} /> Selected Works
                 </div>
                 <h2 className="text-4xl font-serif font-bold mb-12 text-coast-deep">Publications & Guidelines</h2>
                 
                 <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                     {[
                         {
                             title: "Medical evacuation in emergencies",
                             org: "WHO",
                             year: "2025",
                             desc: "Led development and validation of global guidelines for Medical evacuation.",
                             role: "Steering Group"
                         },
                         {
                             title: "Spinal Cord Injury Management Standards",
                             org: "WHO",
                             year: "2025",
                             desc: "Led development of global guidelines for spinal cord injury care in emergencies.",
                             role: "Steering Group"
                         },
                         {
                             title: "Rapid Response Mobile Laboratories",
                             org: "WHO",
                             year: "2025",
                             desc: "Foundational guidelines for mobile lab deployment and QC measures.",
                             role: "Peer Reviewer"
                         },
                         {
                             title: "Highly Infectious Diseases Response",
                             org: "WHO",
                             year: "2024",
                             desc: "Principal contributor to technical requirements for HID outbreak preparedness.",
                             role: "Contributor"
                         },
                         {
                             title: "WASH PRESS",
                             org: "PAHO",
                             year: "2021",
                             desc: "IPC measures for WASH Preparedness in Health Facilities in Emergencies.",
                             role: "Editorial Team"
                         },
                         {
                             title: "EMT Bluebook",
                             org: "WHO",
                             year: "2021",
                             desc: "Subject-matter expert for WASH-LOG benchmarks and operational protocols.",
                             role: "Core Team"
                         }
                     ].map((pub, i) => (
                         <div key={i} className="group p-6 rounded-xl border border-coast-slate/10 hover:border-coast-water/30 hover:shadow-lg transition-all bg-coast-foam/30 hover:bg-white">
                             <div className="flex justify-between items-start mb-4">
                                 <span className="px-2 py-1 bg-coast-deep text-white text-[10px] font-bold uppercase rounded">{pub.org}</span>
                                 <span className="text-coast-slate font-mono text-sm">{pub.year}</span>
                             </div>
                             <h3 className="font-bold text-lg text-coast-deep mb-3 group-hover:text-coast-water transition-colors line-clamp-2">{pub.title}</h3>
                             <p className="text-sm text-coast-slate mb-4 line-clamp-3">{pub.desc}</p>
                             <div className="flex items-center gap-2 text-xs font-bold text-coast-sand">
                                 <User size={12} /> {pub.role}
                             </div>
                         </div>
                     ))}
                 </div>
            </div>
        </section>

        <footer className="bg-coast-deep text-slate-400 py-12 border-t border-slate-800">
            <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-8">
                <div className="text-left">
                    <div className="text-white font-serif font-bold text-2xl mb-2">Jorge Durand Zurdo</div>
                    <div className="text-sm mb-4">Humanitarian Consultant & WASH Specialist</div>
                    <div className="flex gap-6">
                        <a href="mailto:joduzu@gmail.com" className="flex items-center gap-2 text-xs hover:text-white transition-colors">
                            <Mail size={14} /> joduzu@gmail.com
                        </a>
                        <a href="tel:+34665376257" className="flex items-center gap-2 text-xs hover:text-white transition-colors">
                            <Phone size={14} /> +34 665 376 257
                        </a>
                    </div>
                </div>
                <div className="flex flex-col items-end text-right">
                    <span className="text-xs tracking-widest uppercase mb-2 text-coast-sand">Memberships</span>
                    <span className="text-xs text-slate-500 block">WHO EMT Mentoring Roster</span>
                    <span className="text-xs text-slate-500 block">EMT Coordination Roster (EMTCC)</span>
                    <span className="text-xs text-slate-500 block">Spanish Red Cross ERU</span>
                </div>
            </div>
      </footer>
    </div>
  );
};

export default App;
