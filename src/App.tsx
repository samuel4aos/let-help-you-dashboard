import React, { useState, useEffect, useRef } from 'react';
import { 
  Mic, MicOff, ChevronLeft, ChevronRight, Rocket, 
  Lightbulb, CheckCircle2, Trophy, ExternalLink, 
  Plus, Send, Brain, Cpu, Sparkles,
  Search, Users, BookOpen, HeartHandshake, GraduationCap,
  QrCode, Maximize2, Moon, Sun, Monitor, Minimize2,
  Zap, Target, Layers, Terminal, Briefcase, Laptop,
  School, User, Box
} from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';
import { toast, Toaster } from 'sonner';
import { 
  Card, CardFooter, CardHeader, CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { QRCodeSVG } from 'qrcode.react';

// --- Types ---
interface Project {
  id: string;
  name: string;
  title: string;
  tool: string;
  link: string;
  timestamp: number;
}

interface Mission {
  title: string;
  description: string;
  hint: string;
  icon: React.ReactNode;
}

type Theme = 'light' | 'dark' | 'projection';

interface SlideData {
  id: number;
  title: string;
  highlight: string;
  body: string[];
  example: string;
  icon: React.ElementType;
  accent: string;
}

// --- Constants ---
const HUB_URL = "https://829a6103.mydala.app"; 
const DALA_REFERRAL_LINK = "https://dala.gebeya.com/ref/adisa-samuel";

const MISSIONS: Mission[] = [
  {
    title: "Sunday School Attendance Tracker",
    description: "Build an app for teachers to mark attendance and track student progress weekly.",
    hint: "Use AI builder to create this",
    icon: <Users className="w-6 h-6" />
  },
  {
    title: "High School Result Portal Mockup",
    description: "Design a simple way for students to check their grades and download reports.",
    hint: "Use AI builder to create this",
    icon: <GraduationCap className="w-6 h-6" />
  },
  {
    title: "Youth Group Library & PDF Finder",
    description: "Create a digital shelf where members can find study materials and church PDFs.",
    hint: "Use AI builder to create this",
    icon: <BookOpen className="w-6 h-6" />
  },
  {
    title: "Church Welfare / Food Fund Request",
    description: "A simple form-based app for members to apply for assistance discreetly.",
    hint: "Use AI builder to create this",
    icon: <HeartHandshake className="w-6 h-6" />
  },
  {
    title: "Student Scholarship / Grant Finder",
    description: "A directory app listing available scholarships for university students.",
    hint: "Use AI builder to create this",
    icon: <Search className="w-6 h-6" />
  }
];

const SLIDES: SlideData[] = [
  {
    id: 1,
    title: "Welcome to AI Training Hub",
    highlight: "👉 You will build your own application today",
    body: [
      "AI is not just for tech experts",
      "Anyone can build tools with simple instructions",
      "Works for students, teachers, and professionals",
      "Focus: practical, not theory"
    ],
    example: "Build an app to track attendance or manage tasks",
    icon: Sparkles,
    accent: "text-amber-400"
  },
  {
    id: 2,
    title: "Your AI Tools",
    highlight: "👉 You describe, AI builds",
    body: [
      "Base44 → Fast app generation",
      "Dala → Beginner-friendly builder",
      "Replit → Advanced development"
    ],
    example: 'Type: "Build a student portal" → AI creates it',
    icon: Layers,
    accent: "text-emerald-400"
  },
  {
    id: 3,
    title: "The Brain Behind AI",
    highlight: "👉 Different models = different strengths",
    body: [
      "Llama 3 → Open & powerful",
      "Mistral → Fast & efficient",
      "GPT-4o mini → Balanced intelligence",
      "Claude Haiku → Best for writing"
    ],
    example: "Use Claude for text, Mistral for speed",
    icon: Brain,
    accent: "text-indigo-400"
  },
  {
    id: 4,
    title: "Your Project",
    highlight: "👉 Pick one and build it today",
    body: [
      "Attendance Tracker",
      "Student Result Portal",
      "Library & PDF Finder",
      "Support / Request App",
      "Scholarship Finder"
    ],
    example: "Pick a mission and start creating immediately",
    icon: Target,
    accent: "text-amber-500"
  },
  {
    id: 5,
    title: "Build in 5 Steps",
    highlight: "👉 Start before you feel ready",
    body: [
      "1. Copy prompt",
      "2. Use voice or type",
      "3. Generate app",
      "4. Test",
      "5. Improve"
    ],
    example: "Iteration is the key to a great application",
    icon: Rocket,
    accent: "text-red-400"
  },
  {
    id: 6,
    title: "Go Further",
    highlight: "👉 More control, more power",
    body: [
      "Antigravity → High-performance AI",
      "OpenCode / OpenCalawa → Custom frameworks",
      "Cursor → AI coding editor"
    ],
    example: "Master the advanced tools to build complex systems",
    icon: Terminal,
    accent: "text-blue-400"
  }
];

// --- Animation Components ---

const StaggeredText = ({ text, delay = 0 }: { text: string; delay?: number }) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay }}
      className="flex items-center gap-3 text-lg md:text-2xl text-white/80 font-medium justify-center"
    >
      <div className="w-2 h-2 rounded-full bg-amber-400 shrink-0" />
      {text}
    </motion.div>
  );
};

// --- Sub-components ---

const FixedQRCode = ({ url, theme }: { url: string, theme: Theme }) => (
  <div className="fixed top-6 right-6 z-[100] hidden md:block">
    <Dialog>
      <DialogTrigger asChild>
        <motion.button 
          initial={{ x: 100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className={`backdrop-blur-xl border p-3 rounded-2xl flex items-center gap-4 group cursor-pointer shadow-2xl transition-all ${
            theme === 'projection' 
              ? 'bg-black border-yellow-400 text-yellow-400' 
              : theme === 'dark'
                ? 'bg-slate-900/80 border-slate-700 text-white'
                : 'bg-white/80 border-emerald-100 text-slate-800'
          }`}
        >
          <div className="bg-white p-1 rounded-lg shadow-inner group-hover:rotate-3 transition-transform">
            <QRCodeSVG value={url} size={40} level="M" />
          </div>
          <div className="text-left pr-2">
            <p className={`text-[10px] font-bold uppercase tracking-wider leading-none mb-1 ${
              theme === 'projection' ? 'text-yellow-200' : theme === 'dark' ? 'text-emerald-400' : 'text-emerald-600'
            }`}>Scan to Access Our</p>
            <p className={`text-xs font-black uppercase tracking-tight leading-none ${
              theme === 'projection' ? 'text-yellow-400' : theme === 'dark' ? 'text-amber-400' : 'text-amber-600'
            }`}>Project Lab 2026</p>
          </div>
        </motion.button>
      </DialogTrigger>
      <DialogContent className={`sm:max-w-xl rounded-[3rem] border-none p-8 md:p-12 shadow-2xl ${
        theme === 'projection' ? 'bg-black text-yellow-400' : 'bg-white text-slate-900'
      }`}>
        <DialogHeader>
          <DialogTitle className={`text-3xl font-black text-center mb-2 ${
            theme === 'projection' ? 'text-yellow-400' : 'text-emerald-900'
          }`}>Project Lab 2026</DialogTitle>
          <p className="text-center font-medium mb-8 uppercase tracking-widest text-sm opacity-60">Scan with your phone to follow along</p>
        </DialogHeader>
        <div className="flex flex-col items-center justify-center gap-8">
          <div className={`relative group p-10 rounded-[3rem] shadow-2xl border-4 ${
            theme === 'projection' ? 'bg-black border-yellow-400' : 'bg-white border-emerald-800'
          }`}>
            <QRCodeSVG 
              value={url} 
              size={320} 
              level="H" 
              bgColor={theme === 'projection' ? "#000000" : "#FFFFFF"}
              fgColor={theme === 'projection' ? "#FACC15" : "#065F46"}
              includeMargin={false}
              className="relative z-10"
            />
          </div>
          <div className="text-center space-y-4 max-w-sm">
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-full font-bold text-sm ${
              theme === 'projection' ? 'bg-yellow-400 text-black' : 'bg-emerald-100 text-emerald-800'
            }`}>
              <QrCode className="w-4 h-4" /> {url.replace("https://", "")}
            </div>
            <p className="text-lg leading-relaxed opacity-80">
              Perfect for projecting on large screens. Everyone in the room can scan and join the digital transformation!
            </p>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  </div>
);

const PremiumPresentation = ({ theme: globalTheme }: { theme: Theme }) => {
  const [current, setCurrent] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  // Interaction states
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [activeTool, setActiveTool] = useState<string | null>(null);
  const [activeModel, setActiveModel] = useState<string | null>(null);
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      containerRef.current?.requestFullscreen().catch(err => {
        toast.error(`Error: ${err.message}`);
      });
    } else {
      document.exitFullscreen();
    }
  };

  useEffect(() => {
    const handleFsChange = () => setIsFullscreen(!!document.fullscreenElement);
    document.addEventListener('fullscreenchange', handleFsChange);
    return () => document.removeEventListener('fullscreenchange', handleFsChange);
  }, []);

  const scrollToSlide = (index: number) => {
    if (scrollContainerRef.current) {
      const slideHeight = scrollContainerRef.current.clientHeight;
      scrollContainerRef.current.scrollTo({
        top: index * slideHeight,
        behavior: 'smooth'
      });
    }
  };

  const next = () => {
    const nextIdx = (current + 1) % SLIDES.length;
    setCurrent(nextIdx);
    scrollToSlide(nextIdx);
  };
  
  const prev = () => {
    const prevIdx = (current - 1 + SLIDES.length) % SLIDES.length;
    setCurrent(prevIdx);
    scrollToSlide(prevIdx);
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowRight' || e.key === ' ') {
        e.preventDefault();
        next();
      }
      if (e.key === 'ArrowLeft') {
        e.preventDefault();
        prev();
      }
    };
    window.addEventListener('keydown', handleKey);
    return () => window.removeEventListener('keydown', handleKey);
  }, [current]);

  const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
    const container = e.currentTarget;
    const slideHeight = container.clientHeight;
    if (slideHeight === 0) return;
    const newIdx = Math.round(container.scrollTop / slideHeight);
    if (newIdx !== current && newIdx >= 0 && newIdx < SLIDES.length) {
      setCurrent(newIdx);
    }
  };

  const renderInteraction = (slideId: number) => {
    switch (slideId) {
      case 1:
        return (
          <div className="mt-8 flex flex-col items-center gap-6">
            <Button 
              className="bg-amber-400 text-black hover:bg-amber-300 font-black py-6 px-8 rounded-2xl text-lg shadow-[0_0_20px_rgba(251,191,36,0.3)]"
              onClick={() => setActiveCategory(activeCategory ? null : 'active')}
            >
              WHAT DO YOU WANT TO BUILD?
            </Button>
            <AnimatePresence>
              {activeCategory && (
                <motion.div 
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  className="flex flex-wrap justify-center gap-4"
                >
                  {[
                    { label: 'School', icon: School, color: 'text-emerald-400' },
                    { label: 'Personal', icon: User, color: 'text-amber-400' },
                    { label: 'Business', icon: Briefcase, color: 'text-blue-400' }
                  ].map((cat) => (
                    <div key={cat.label} className="bg-white/10 p-4 rounded-2xl flex flex-col items-center gap-2 border border-white/20 min-w-[100px]">
                      <cat.icon className={`w-8 h-8 ${cat.color}`} />
                      <span className="text-white font-bold">{cat.label}</span>
                    </div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      case 2:
        return (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 w-full max-w-3xl">
            {[
              { name: 'Base44', best: 'Best for beginners', use: 'Fast app generation' },
              { name: 'Dala', best: 'Use this if...', use: 'Visual builder focus' },
              { name: 'Replit', best: 'Advanced', use: 'Full coding control' }
            ].map((tool, i) => (
              <motion.div
                key={tool.name}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.2 + i * 0.1 }}
                whileHover={{ scale: 1.02 }}
                onClick={() => setActiveTool(tool.name === activeTool ? null : tool.name)}
                className={`p-6 rounded-3xl border-2 cursor-pointer transition-all ${
                  activeTool === tool.name ? 'bg-emerald-500/20 border-emerald-500 shadow-[0_0_20px_rgba(16,185,129,0.3)]' : 'bg-white/5 border-white/10 hover:border-white/30'
                }`}
              >
                <h4 className="font-black text-xl mb-2 text-white">{tool.name}</h4>
                <AnimatePresence mode="wait">
                  {activeTool === tool.name ? (
                    <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-sm">
                      <p className="font-bold text-emerald-400 uppercase tracking-tighter mb-1">{tool.best}</p>
                      <p className="text-white/70">{tool.use}</p>
                    </motion.div>
                  ) : (
                    <p className="text-xs text-white/30 italic">Tap to reveal info</p>
                  )}
                </AnimatePresence>
              </motion.div>
            ))}
          </div>
        );
      case 3:
        return (
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            {[
              { name: 'Llama 3', use: 'Complex reasoning & open-source' },
              { name: 'Mistral', use: 'Speed and short-form tasks' },
              { name: 'GPT-4o mini', use: 'Balanced intelligence & logic' },
              { name: 'Claude Haiku', use: 'Creative writing & summaries' }
            ].map((model) => (
              <motion.button
                key={model.name}
                whileTap={{ scale: 0.95 }}
                onClick={() => setActiveModel(model.name === activeModel ? null : model.name)}
                className={`px-4 py-2 rounded-full font-bold text-sm border-2 transition-all ${
                  activeModel === model.name ? 'bg-indigo-500 border-indigo-500 text-white' : 'bg-white/5 border-white/10 text-white/70'
                }`}
              >
                {model.name}
              </motion.button>
            ))}
            <AnimatePresence>
              {activeModel && (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="w-full mt-4 p-4 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 text-center"
                >
                  <p className="text-indigo-200 font-bold">Best use case: <span className="text-white">
                    {activeModel === 'Llama 3' && 'Open-weights high performance'}
                    {activeModel === 'Mistral' && 'Low latency specialized tasks'}
                    {activeModel === 'GPT-4o mini' && 'Daily automation and logic'}
                    {activeModel === 'Claude Haiku' && 'Polished text and summaries'}
                  </span></p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      case 4:
        return (
          <div className="mt-8 space-y-6 w-full max-w-xl">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {SLIDES[3].body.map((proj, idx) => (
                <motion.div
                  key={proj}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={() => setSelectedProject(idx)}
                  className={`p-4 rounded-2xl border-2 cursor-pointer transition-all ${
                    selectedProject === idx ? 'bg-amber-500/20 border-amber-500 text-amber-500' : 'bg-white/5 border-white/10 text-white/70'
                  }`}
                >
                  <p className="font-bold flex items-center gap-2">
                    {selectedProject === idx ? <CheckCircle2 className="w-4 h-4" /> : <Box className="w-4 h-4 opacity-30" />}
                    {proj}
                  </p>
                </motion.div>
              ))}
            </div>
            <Button 
              className="w-full bg-amber-500 hover:bg-amber-600 text-black font-black py-8 rounded-[2rem] text-xl"
              onClick={() => {
                const random = Math.floor(Math.random() * SLIDES[3].body.length);
                setSelectedProject(random);
                toast.success(`Mission: ${SLIDES[3].body[random]}`);
              }}
            >
              PICK RANDOM PROJECT
            </Button>
          </div>
        );
      case 5:
        return (
          <div className="mt-8 w-full max-w-md">
            <div className="relative h-4 bg-white/10 rounded-full overflow-hidden mb-6">
              <motion.div 
                className="absolute inset-y-0 left-0 bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]"
                initial={{ width: "0%" }}
                animate={{ width: "100%" }}
                transition={{ duration: 5, repeat: Infinity, ease: "linear" }}
              />
            </div>
            <Button 
              onClick={() => toast.info("Voice Input simulation active...")}
              className="w-full bg-red-500 hover:bg-red-600 text-white font-black py-8 rounded-[2rem] text-xl flex items-center justify-center gap-3"
            >
              <Mic className="w-6 h-6" /> TRY VOICE INPUT
            </Button>
          </div>
        );
      case 6:
        return (
          <div className="mt-8 w-full max-w-md">
            <Button 
              onClick={() => window.open('https://base44.ai', '_blank')}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-black py-8 rounded-[2rem] text-xl flex items-center justify-center gap-3 shadow-[0_10px_30px_rgba(37,99,235,0.3)]"
            >
              EXPLORE TOOLS <ExternalLink className="w-6 h-6" />
            </Button>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div 
      ref={containerRef}
      className={`relative w-full transition-all duration-700 shadow-[0_50px_100px_rgba(0,0,0,0.5)] flex flex-col ${
        isFullscreen ? 'h-screen w-screen rounded-none fixed inset-0 z-[200]' : 'aspect-video min-h-[600px] md:min-h-[700px] rounded-[3rem] overflow-hidden'
      } bg-gradient-to-br from-black via-[#041a0d] to-black border-2 border-white/10`}
    >
      {/* Background Decor */}
      <div className="absolute inset-0 pointer-events-none opacity-20 overflow-hidden">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] rounded-full bg-emerald-500/20 blur-[120px]" />
        <div className="absolute bottom-[-10%] left-[-10%] w-[50%] h-[50%] rounded-full bg-amber-500/10 blur-[120px]" />
      </div>

      {/* Header bar */}
      <div className="relative z-10 px-8 py-6 flex justify-between items-center border-b border-white/5 backdrop-blur-md">
        <div className="flex items-center gap-4">
          <motion.div 
            animate={{ rotate: [0, 10, -10, 0] }}
            transition={{ repeat: Infinity, duration: 4 }}
            className={`p-2 rounded-xl bg-white/10 border border-white/10 ${SLIDES[current].accent}`}
          >
            <BookOpen className="w-5 h-5" />
          </motion.div>
          <div className="text-left">
            <h2 className="text-white font-black text-lg md:text-xl tracking-tight leading-none">AI Training Hub</h2>
            <p className="text-[10px] font-bold text-white/30 uppercase tracking-[0.2em] mt-1">Presentation Mode</p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          <Badge className="bg-amber-400 text-black font-black border-none px-4 py-1.5 rounded-full">
            Slide {current + 1} of {SLIDES.length}
          </Badge>
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={toggleFullscreen}
            className="text-white/50 hover:text-white hover:bg-white/10 rounded-full h-10 w-10"
          >
            {isFullscreen ? <Minimize2 className="w-5 h-5" /> : <Maximize2 className="w-5 h-5" />}
          </Button>
        </div>
      </div>

      {/* Slide Area - Scroll Snapping Container */}
      <div 
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex-1 overflow-y-auto scroll-smooth no-scrollbar"
        style={{ scrollSnapType: 'y mandatory', WebkitOverflowScrolling: 'touch' }}
      >
        {SLIDES.map((slide, idx) => (
          <section 
            key={slide.id}
            className="w-full flex flex-col items-center justify-center p-6 md:p-12 relative shrink-0"
            style={{ scrollSnapAlign: 'start', height: '100%' }}
          >
            <div className="w-full max-w-5xl flex flex-col items-center justify-center gap-8 text-center">
              {/* Title Fade-in */}
              <motion.h3 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-5xl md:text-8xl font-black text-white leading-none tracking-tighter"
              >
                {slide.title}
              </motion.h3>

              {/* Highlight Glow */}
              <motion.p 
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="text-xl md:text-3xl font-bold bg-amber-400 text-black px-8 py-3 rounded-2xl inline-block shadow-[0_0_40px_rgba(251,191,36,0.2)]"
              >
                {slide.highlight}
              </motion.p>

              {/* Visual Icon Animation */}
              <motion.div 
                initial={{ scale: 0, rotate: -30 }}
                whileInView={{ scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ type: "spring", damping: 10, stiffness: 80 }}
                className={`p-8 rounded-full bg-white/5 border border-white/10 shadow-2xl mb-4 ${slide.accent}`}
              >
                <motion.div
                  animate={{ y: [0, -10, 0] }}
                  transition={{ repeat: Infinity, duration: 3, ease: "easeInOut" }}
                >
                  <slide.icon size={80} className="md:w-24 md:h-24" />
                </motion.div>
              </motion.div>

              {/* Body Staggered Reveal */}
              <div className="space-y-4 max-w-2xl w-full">
                {slide.body.map((line, i) => (
                  <StaggeredText key={i} text={line} delay={0.2 + i * 0.1} />
                ))}
              </div>

              {/* Example Box */}
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: 0.5 }}
                className="mt-4 p-6 rounded-3xl bg-white/5 border border-white/10 flex items-center gap-4 text-left max-w-md group"
              >
                <div className="w-12 h-12 rounded-2xl bg-amber-400/20 flex items-center justify-center shrink-0">
                  <Lightbulb className="w-6 h-6 text-amber-400" />
                </div>
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-amber-400/60 mb-1">EXAMPLE</p>
                  <p className="text-white/90 font-medium leading-tight">{slide.example}</p>
                </div>
              </motion.div>

              {/* Interaction Layer */}
              <div className="w-full">
                {renderInteraction(slide.id)}
              </div>
            </div>
          </section>
        ))}
      </div>

      {/* Nav Controls */}
      <div className="absolute inset-x-0 bottom-12 flex justify-between px-12 z-20 pointer-events-none">
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={(e) => { e.stopPropagation(); prev(); }}
          className="w-14 h-14 rounded-full bg-white/5 hover:bg-white/10 text-white border border-white/10 pointer-events-auto"
        >
          <ChevronLeft className="w-8 h-8" />
        </Button>
        <div className="flex gap-2 items-center pointer-events-auto">
          {SLIDES.map((_, i) => (
            <button 
              key={i} 
              onClick={() => scrollToSlide(i)}
              className={`h-2 rounded-full transition-all duration-500 ${i === current ? 'w-10 bg-amber-400' : 'w-2 bg-white/20'}`} 
            />
          ))}
        </div>
        <Button 
          variant="ghost" 
          size="icon" 
          onClick={(e) => { e.stopPropagation(); next(); }}
          className="w-14 h-14 rounded-full bg-amber-400 hover:bg-amber-300 text-black shadow-lg pointer-events-auto"
        >
          <ChevronRight className="w-8 h-8" />
        </Button>
      </div>
    </div>
  );
};

// --- Main Application ---

export default function App() {
  const [theme, setTheme] = useState<Theme>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('app-theme');
      if (saved) return saved as Theme;
      if (window.matchMedia('(prefers-color-scheme: dark)').matches) return 'dark';
    }
    return 'light';
  });
  
  const [mission, setMission] = useState<Mission | null>(null);
  const [submissions, setSubmissions] = useState<Project[]>([]);
  const [isRecording, setIsRecording] = useState(false);
  const [voiceText, setVoiceText] = useState("");
  const [form, setForm] = useState({ name: "", title: "", tool: "", link: "" });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('project-lab-submissions');
    if (saved) {
      try {
        setSubmissions(JSON.parse(saved));
      } catch (e) {
        console.error(e);
      }
    }
  }, []);

  useEffect(() => {
    const root = document.documentElement;
    root.classList.remove('light', 'dark', 'projection');
    root.classList.add(theme);
    localStorage.setItem('app-theme', theme);

    // Apply specific CSS variables requested with smooth transitions
    // We update the root variables which are used in the style tag below
    if (theme === 'projection') {
      root.style.setProperty('--primary-color', '#facc15');
      root.style.setProperty('--background-color', '#000000');
      root.style.setProperty('--text-color', '#facc15');
    } else if (theme === 'dark') {
      root.style.setProperty('--primary-color', 'oklch(0.922 0 0)');
      root.style.setProperty('--background-color', 'oklch(0.145 0 0)');
      root.style.setProperty('--text-color', 'oklch(0.985 0 0)');
    } else {
      root.style.setProperty('--primary-color', 'oklch(0.205 0 0)');
      root.style.setProperty('--background-color', 'oklch(1 0 0)');
      root.style.setProperty('--text-color', 'oklch(0.145 0 0)');
    }
  }, [theme]);

  const startSpeechToText = () => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      toast.error("Voice input not available");
      return;
    }
    const recognition = new SpeechRecognition();
    recognition.lang = 'en-US';
    recognition.onstart = () => setIsRecording(true);
    recognition.onend = () => setIsRecording(false);
    recognition.onresult = (event: any) => {
      setVoiceText(event.results[0][0].transcript);
      toast.success("Voice captured!");
    };
    recognition.start();
  };

  const generateMission = () => {
    const next = MISSIONS[Math.floor(Math.random() * MISSIONS.length)];
    setMission(next);
    toast("New Mission Assigned!", { description: next.title });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!form.name || !form.title || !form.link || !form.tool) {
      toast.error("All fields required");
      return;
    }
    setLoading(true);
    setTimeout(() => {
      const updated = [{ ...form, id: Date.now().toString(), timestamp: Date.now() }, ...submissions];
      setSubmissions(updated);
      localStorage.setItem('project-lab-submissions', JSON.stringify(updated));
      setForm({ name: "", title: "", tool: "", link: "" });
      setLoading(false);
      toast.success("Project submitted successfully!");
    }, 800);
  };

  return (
    <div className={`min-h-screen font-sans pb-16 transition-colors duration-500 selection:bg-amber-200 selection:text-amber-900 ${
      theme === 'projection' ? 'bg-black text-white' : theme === 'dark' ? 'bg-slate-950 text-slate-100' : 'bg-[#FDFDFD] text-slate-900'
    }`}>
      <style>{`
        :root {
          --primary-color: oklch(0.205 0 0);
          --background-color: oklch(1 0 0);
          --text-color: oklch(0.145 0 0);
        }
        html, body {
          background-color: var(--background-color) !important;
          color: var(--text-color) !important;
          transition: background-color 0.5s ease, color 0.5s ease, border-color 0.5s ease;
        }
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
      <Toaster position="top-center" richColors />
      <FixedQRCode url={HUB_URL} theme={theme} />
      
      {/* Header */}
      <header className={`pt-12 pb-24 px-4 rounded-b-[2.5rem] md:rounded-b-[4rem] relative overflow-hidden transition-all duration-500 ${
        theme === 'projection' ? 'bg-black border-b-4 border-yellow-400' : theme === 'dark' ? 'bg-slate-900' : 'bg-emerald-800 text-white'
      }`}>
        <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
          <div className="mb-8 flex bg-white/10 backdrop-blur-md p-1.5 rounded-2xl border border-white/20 gap-2">
            {[
              { id: 'light', icon: <Sun className="w-4 h-4" />, label: 'Light' },
              { id: 'dark', icon: <Moon className="w-4 h-4" />, label: 'Dark' },
              { id: 'projection', icon: <Monitor className="w-4 h-4" />, label: 'Projection' }
            ].map((t) => (
              <button
                key={t.id}
                onClick={() => setTheme(t.id as Theme)}
                className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all ${
                  theme === t.id ? 'bg-amber-400 text-emerald-900 shadow-lg' : 'text-white/60 hover:text-white hover:bg-white/10'
                }`}
              >
                {t.icon} <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>

          <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="flex items-center justify-center gap-3 mb-3">
            <div className={`p-2 rounded-xl shadow-lg rotate-3 ${theme === 'projection' ? 'bg-yellow-400 text-black' : 'bg-amber-400 text-emerald-900'}`}>
              <Sparkles className="w-6 h-6 md:w-8 md:h-8" />
            </div>
            <h1 className={`text-3xl md:text-5xl lg:text-7xl font-black tracking-tight ${theme === 'projection' ? 'text-yellow-400' : 'text-white'}`}>
              Project Lab <span className={theme === 'projection' ? 'text-white underline decoration-yellow-400' : 'text-amber-400'}>2026</span>
            </h1>
          </motion.div>
          <p className="text-lg md:text-2xl font-medium mb-10 opacity-90 max-w-2xl mx-auto text-emerald-100/80">
            Learn. Build. Share. <span className="mx-2 opacity-30">|</span> Empowering the church through intelligence.
          </p>

          <div className="relative max-w-xl mx-auto w-full">
            <Input 
              placeholder="Describe the app you want to build..." 
              value={voiceText}
              onChange={(e) => setVoiceText(e.target.value)}
              className={`pl-14 pr-14 py-8 backdrop-blur-md rounded-2xl text-lg shadow-inner border-2 ${
                theme === 'projection' ? 'bg-black border-yellow-400 text-yellow-400 placeholder:text-yellow-400/50' : 'bg-white/10 border-white/20 text-white placeholder:text-emerald-200'
              }`}
            />
            <Search className={`absolute left-5 top-1/2 -translate-y-1/2 w-6 h-6 ${theme === 'projection' ? 'text-yellow-400' : 'text-emerald-300'}`} />
            <button 
              onClick={startSpeechToText}
              className={`absolute right-4 top-1/2 -translate-y-1/2 p-2.5 rounded-xl ${isRecording ? 'bg-red-500 animate-pulse' : 'bg-amber-400 text-emerald-900'}`}
            >
              {isRecording ? <MicOff className="w-5 h-5" /> : <Mic className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-4 md:px-6 -mt-16 space-y-16 relative z-20">
        
        {/* Presentation Section */}
        <section id="training-manual">
          <PremiumPresentation theme={theme} />
        </section>

        {/* Practical Launchpad */}
        <section className="space-y-6">
          <div className="flex items-center gap-4 px-2">
            <h2 className={`text-2xl font-black tracking-tight ${theme === 'projection' ? 'text-yellow-400 uppercase' : 'text-slate-800'}`}>Practical Launchpad</h2>
            <div className={`h-1 flex-1 rounded-full ${theme === 'projection' ? 'bg-yellow-400' : 'bg-slate-200'}`}></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Dala", desc: "Beginner Friendly", color: "bg-emerald-600", url: DALA_REFERRAL_LINK, icon: <Layers /> },
              { name: "Base44", desc: "Fast App Builder", color: "bg-emerald-700", url: "https://base44.ai", icon: <Zap /> },
              { name: "Replit", desc: "Advanced Users", color: "bg-emerald-800", url: "https://replit.com", icon: <Cpu /> }
            ].map((tool) => (
              <motion.a key={tool.name} href={tool.url} target="_blank" whileHover={{ y: -5 }} className="block group">
                <div className={`p-8 rounded-[2rem] shadow-xl border-2 transition-all flex items-center justify-between ${
                  theme === 'projection' ? 'bg-black border-yellow-400 text-yellow-400' : 'bg-white border-transparent'
                }`}>
                  <div className="flex items-center gap-5">
                    <div className={`${tool.color} w-16 h-16 rounded-2xl flex items-center justify-center text-white shadow-lg`}>
                      {tool.icon}
                    </div>
                    <div>
                      <h4 className="font-black text-2xl">{tool.name}</h4>
                      <p className="text-sm font-bold opacity-60 uppercase tracking-widest">{tool.desc}</p>
                    </div>
                  </div>
                  <ExternalLink className="w-6 h-6 opacity-30" />
                </div>
              </motion.a>
            ))}
          </div>
        </section>

        {/* Mission & Form */}
        <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-stretch">
          <div className={`rounded-[3rem] p-1 shadow-2xl overflow-hidden ${theme === 'projection' ? 'bg-yellow-400' : 'bg-amber-400'}`}>
            <div className={`h-full rounded-[2.8rem] p-10 flex flex-col ${theme === 'projection' ? 'bg-black text-yellow-400' : 'bg-[#FFF9EA]'}`}>
              <div className="flex items-start justify-between mb-8">
                <div className="space-y-2">
                  <Badge className="bg-amber-500 text-white border-none px-4 py-1.5 rounded-full font-bold">ACTIVE MISSION</Badge>
                  <h2 className="text-3xl font-black">Project Inspiration</h2>
                </div>
                <Trophy className="w-12 h-12 text-amber-500" />
              </div>
              <div className={`flex-1 flex flex-col items-center justify-center text-center py-10 px-4 rounded-[2.5rem] border-2 shadow-inner mb-8 min-h-[220px] ${
                theme === 'projection' ? 'bg-black border-yellow-400/30' : 'bg-white/50 border-white'
              }`}>
                {mission ? (
                  <motion.div initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} className="space-y-4">
                    <div className="w-16 h-16 rounded-2xl bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">{mission.icon}</div>
                    <h3 className="text-2xl font-black">{mission.title}</h3>
                    <p className="opacity-80 font-medium">{mission.description}</p>
                  </motion.div>
                ) : (
                  <p className="text-xl font-black opacity-20 uppercase">Generate a mission</p>
                )}
              </div>
              <Button onClick={generateMission} className="w-full font-black py-8 rounded-[2rem] text-xl bg-amber-500 hover:bg-amber-600 text-amber-950">
                {mission ? "GET ANOTHER MISSION" : "GIVE ME A MISSION"}
              </Button>
            </div>
          </div>

          <Card className={`border-none shadow-2xl rounded-[3rem] p-10 ${theme === 'projection' ? 'bg-black border-2 border-yellow-400 text-yellow-400' : 'bg-white'}`}>
            <div className="flex items-center gap-5 mb-10">
              <Plus className="w-10 h-10 text-emerald-600" />
              <CardTitle className="text-3xl font-black">Submit Project</CardTitle>
            </div>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <Input placeholder="Full Name" className="rounded-xl h-14" value={form.name} onChange={e => setForm({...form, name: e.target.value})} />
                <Input placeholder="Project Title" className="rounded-xl h-14" value={form.title} onChange={e => setForm({...form, title: e.target.value})} />
              </div>
              <Select value={form.tool} onValueChange={val => setForm({...form, tool: val})}>
                <SelectTrigger className="h-14 rounded-xl">
                  <SelectValue placeholder="Which tool did you use?" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Dala">Dala</SelectItem>
                  <SelectItem value="Base44">Base44</SelectItem>
                  <SelectItem value="Replit">Replit</SelectItem>
                </SelectContent>
              </Select>
              <Input placeholder="Public Link" className="rounded-xl h-14" value={form.link} onChange={e => setForm({...form, link: e.target.value})} />
              <Button type="submit" disabled={loading} className="w-full h-16 rounded-[1.5rem] bg-emerald-800 hover:bg-emerald-900 text-white font-black text-lg">
                {loading ? "SUBMITTING..." : "SUBMIT PROJECT"}
              </Button>
            </form>
          </Card>
        </section>

        {/* Wall of Fame */}
        <section className="space-y-8 pb-20">
          <div className="flex items-center gap-4 px-2">
            <Trophy className="w-8 h-8 text-amber-500" />
            <h2 className={`text-4xl font-black tracking-tight ${theme === 'projection' ? 'text-yellow-400 uppercase' : 'text-slate-800'}`}>Wall of Fame</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {submissions.map((p) => (
              <Card key={p.id} className="rounded-[2.5rem] overflow-hidden border-none shadow-xl">
                <div className="h-2 w-full bg-emerald-600"></div>
                <CardHeader className="p-8">
                  <Badge className="w-fit mb-4">{p.tool}</Badge>
                  <CardTitle className="text-2xl font-black">{p.title}</CardTitle>
                  <p className="opacity-60">by <span className="font-bold">{p.name}</span></p>
                </CardHeader>
                <CardFooter className="p-8 pt-0">
                  <Button variant="outline" className="w-full rounded-xl font-bold" onClick={() => window.open(p.link, '_blank')}>
                    LAUNCH APP <ExternalLink className="ml-2 w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
            {submissions.length === 0 && (
              <div className="col-span-full py-20 text-center opacity-30">
                <Rocket className="w-16 h-16 mx-auto mb-4" />
                <p className="text-2xl font-black">Be the first to build!</p>
              </div>
            )}
          </div>
        </section>
      </main>

      <footer className="mt-20 pb-20 text-center">
        <div className="max-w-4xl mx-auto space-y-6">
          <div className="h-px w-full bg-slate-200"></div>
          <p className="font-black tracking-[0.3em] text-sm uppercase opacity-40">Project Lab 2026</p>
        </div>
      </footer>
    </div>
  );
}