
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Users, Settings, BookOpen, Activity, Globe, Database, Tent, Droplets, Truck } from 'lucide-react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, Text, Box, Cylinder, Cone } from '@react-three/drei';

// --- EXPERIENCE TIMELINE ---
export const ExperienceTimeline: React.FC = () => {
  const events = [
    { 
      period: 'Jul 2018 – Present', 
      role: 'Technical Consultant, EMT Secretariat', 
      org: 'WHO Health Emergencies Programme (Geneva)', 
      desc: 'Mentoring national/international EMTs, designing WASH-LOG standards, facilitating workshops, and leading quality assurance efforts globally.',
      color: 'bg-coast-water'
    },
    { 
      period: 'Dec 2014 – Jul 2018', 
      role: 'WASH Advisor', 
      org: 'AECID OAH (Madrid)', 
      desc: 'Designed emergency WASH service packages, defined equipment lists, and led regional workshops. Deployed to Nepal and Ecuador.',
      color: 'bg-coast-sand'
    },
    { 
      period: 'Feb 2004 – Dec 2017', 
      role: 'WASH-DRM Consultant', 
      org: 'Action Against Hunger / IFRC / Red Cross', 
      desc: 'Multiple field deployments including Zimbabwe Cholera response (2010), Philippines Typhoon (2012), and complex emergencies in Mozambique/CAR.',
      color: 'bg-coast-rock'
    },
  ];

  return (
    <div className="relative pl-8 border-l-2 border-coast-slate/20 space-y-12">
        {events.map((evt, i) => (
            <div key={i} className="relative group">
                <div className={`absolute -left-[41px] top-0 w-5 h-5 rounded-full bg-white border-4 ${evt.color === 'bg-coast-water' ? 'border-coast-water' : evt.color === 'bg-coast-sand' ? 'border-coast-sand' : 'border-coast-rock'} group-hover:scale-125 transition-transform shadow-sm`}></div>
                <div className="flex flex-col sm:flex-row sm:items-baseline gap-2 mb-1">
                    <span className="text-sm font-bold tracking-widest text-coast-slate uppercase">{evt.period}</span>
                </div>
                <h3 className="text-xl font-serif font-bold text-coast-deep mb-1 group-hover:text-coast-water transition-colors">{evt.role}</h3>
                <div className="text-sm font-bold text-coast-sand mb-3">{evt.org}</div>
                <p className="text-coast-slate/80 max-w-xl leading-relaxed text-sm">{evt.desc}</p>
            </div>
        ))}
    </div>
  );
};

// --- CORE COMPETENCIES GRID ---
export const CoreCompetencies: React.FC = () => {
    const skills = [
        { icon: <BookOpen size={20}/>, title: "Policy & Guidelines", desc: "Drafting global policy documents (WHO, PAHO) and technical annexes." },
        { icon: <Droplets size={20}/>, title: "Emergency WASH & IPC", desc: "Design and QA of interventions in outbreak settings." },
        { icon: <Users size={20}/>, title: "EMT Mentorship", desc: "Global mentor for EMT Classification; design of operational standards." },
        { icon: <Activity size={20}/>, title: "Evaluation & Learning", desc: "Real-time and mid-term evaluations using mixed methods." },
        { icon: <Globe size={20}/>, title: "Stakeholder Engagement", desc: "Coordination with donors (ECHO, AECID) and technical facilitation." },
        { icon: <Database size={20}/>, title: "Info Management", desc: "Tools development (ODK, Kobo) and Dashboarding (PowerBI)." },
    ];

    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {skills.map((skill, idx) => (
                <motion.div 
                    key={idx}
                    whileHover={{ y: -5 }}
                    className="p-6 bg-white rounded-xl border border-coast-slate/10 shadow-sm hover:shadow-md hover:border-coast-water/30 transition-all"
                >
                    <div className="w-10 h-10 rounded-lg bg-coast-foam flex items-center justify-center text-coast-water mb-4">
                        {skill.icon}
                    </div>
                    <h4 className="font-bold text-coast-deep mb-2">{skill.title}</h4>
                    <p className="text-sm text-coast-slate leading-snug">{skill.desc}</p>
                </motion.div>
            ))}
        </div>
    )
}

// --- CAMP VISUALIZER (3D) ---
// Abstract representation of an Emergency Logistics setup (Tents, Water Tanks)
export const CampVisualizer: React.FC = () => {
    return (
      <Canvas camera={{ position: [8, 6, 8], fov: 45 }}>
          <color attach="background" args={['#334155']} />
          <ambientLight intensity={0.4} />
          <directionalLight position={[10, 10, 5]} intensity={1} castShadow />
          <pointLight position={[-5, 5, -5]} intensity={0.5} color="#0ea5e9" />
          <OrbitControls autoRotate autoRotateSpeed={1} enableZoom={false} minPolarAngle={Math.PI/4} maxPolarAngle={Math.PI/2.5} />

          {/* Ground */}
          <Box args={[10, 0.2, 10]} position={[0, -0.1, 0]}>
              <meshStandardMaterial color="#475569" />
          </Box>
          <gridHelper args={[10, 10, '#64748b', '#475569']} position={[0, 0.01, 0]} />

          {/* Medical Tent 1 */}
          <group position={[-2, 0, -1]}>
             <Box args={[2.5, 1.5, 4]} position={[0, 0.75, 0]}>
                 <meshStandardMaterial color="#f8fafc" roughness={0.9} />
             </Box>
             <Cone args={[2, 1, 4]} rotation={[0, Math.PI/4, 0]} position={[0, 2, 0]}>
                 <meshStandardMaterial color="#e2e8f0" />
             </Cone>
             <Text position={[0, 2.5, 0]} fontSize={0.3} color="#0f172a">Medical Unit</Text>
          </group>

          {/* Logistics Tent */}
          <group position={[2, 0, 2]}>
              <Cylinder args={[1.5, 1.5, 1.5, 3]} rotation={[0, Math.PI, 0]} position={[0, 0.75, 0]}>
                  <meshStandardMaterial color="#d97706" />
              </Cylinder>
              <Text position={[0, 2, 0]} fontSize={0.3} color="white">Logistics</Text>
          </group>

          {/* Water Bladders / Tanks */}
          <group position={[2.5, 0, -2]}>
              <Cylinder args={[0.8, 0.8, 1.2, 16]} position={[0, 0.6, 0]}>
                  <meshStandardMaterial color="#0ea5e9" transparent opacity={0.9} />
              </Cylinder>
              <Text position={[0, 1.6, 0]} fontSize={0.25} color="#0ea5e9">WASH</Text>
          </group>
          
          <group position={[3.5, 0, -1.5]}>
              <Cylinder args={[0.6, 0.6, 1, 16]} position={[0, 0.5, 0]}>
                  <meshStandardMaterial color="#0ea5e9" transparent opacity={0.9} />
              </Cylinder>
          </group>

          {/* Connection Pipes */}
          <Box args={[0.2, 0.1, 3]} position={[2.5, 0.1, -0.5]}>
               <meshStandardMaterial color="#94a3b8" />
          </Box>

      </Canvas>
    )
}
