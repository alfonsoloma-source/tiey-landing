import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

// ── Paleta — Cyberpunk dark ────────────────────────────────────────────────────
const DEEP    = "#05070C";   // fondo base, casi negro con tinte azul
const DARK    = "#0A0E16";   // secciones alternas
const CARD    = "#10151F";   // fondo de cards
const CYAN    = "#00F0FF";   // neón primario
const ORANGE  = "#FF7A29";   // acento secundario — naranja cálido
const TEXT    = "#EAF1FF";   // texto principal
const GRAY    = "#6E7891";   // texto secundario
const WHITE   = "#FFFFFF";
const MUTED   = "rgba(234,241,255,0.55)";

// Glows reutilizables
const glowCyan    = (op=0.35) => `0 0 24px rgba(0,240,255,${op})`;
const glowOrange  = (op=0.35) => `0 0 24px rgba(255,122,41,${op})`;

// ── Helpers ───────────────────────────────────────────────────────────────────
function useFadeUp(delay=0) {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-80px" });
  return { ref, initial:{opacity:0,y:32}, animate:inView?{opacity:1,y:0}:{opacity:0,y:32},
    transition:{duration:0.7, ease:[0.22,1,0.36,1], delay} };
}

// Texto que cicla entre palabras con animación de blur + slide + ancho dinámico
function AnimatedTextCycle({ words, interval=2500, style={} }) {
  const [idx, setIdx] = useState(0);
  const [width, setWidth] = useState("auto");
  const measureRef = useRef(null);

  useEffect(() => {
    if (measureRef.current) {
      const els = measureRef.current.children;
      if (els[idx]) setWidth(`${els[idx].getBoundingClientRect().width}px`);
    }
  }, [idx]);

  useEffect(() => {
    const t = setInterval(() => setIdx(i => (i+1) % words.length), interval);
    return () => clearInterval(t);
  }, [interval, words.length]);

  return (
    <>
      <span ref={measureRef} aria-hidden="true" style={{position:"absolute", visibility:"hidden", display:"flex", pointerEvents:"none"}}>
        {words.map((w,i)=><span key={i} style={{...style, whiteSpace:"nowrap"}}>{w}</span>)}
      </span>
      <motion.span style={{position:"relative", display:"inline-block", overflow:"hidden", verticalAlign:"bottom"}}
        animate={{ width }} transition={{ type:"spring", stiffness:160, damping:18 }}>
        <AnimatePresence mode="wait" initial={false}>
          <motion.span key={idx}
            initial={{ y:24, opacity:0, filter:"blur(8px)" }}
            animate={{ y:0, opacity:1, filter:"blur(0px)" }}
            exit={{ y:-24, opacity:0, filter:"blur(8px)" }}
            transition={{ duration:0.4, ease:[0.22,1,0.36,1] }}
            style={{display:"inline-block", whiteSpace:"nowrap", ...style}}>
            {words[idx]}
          </motion.span>
        </AnimatePresence>
      </motion.span>
    </>
  );
}


// Grid de fondo — patrón cyberpunk
const GridBG = ({ opacity=0.05 }) => (
  <div style={{
    position:"absolute", inset:0, pointerEvents:"none", zIndex:0,
    backgroundImage:`linear-gradient(rgba(0,240,255,${opacity}) 1px, transparent 1px), linear-gradient(90deg, rgba(0,240,255,${opacity}) 1px, transparent 1px)`,
    backgroundSize:"48px 48px",
    maskImage:"radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
    WebkitMaskImage:"radial-gradient(ellipse 80% 60% at 50% 0%, black 40%, transparent 100%)",
  }}/>
);

// Spark icon — diamante neón
const SparkIcon = ({ size=14, color=CYAN }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill={color} style={{filter:`drop-shadow(0 0 4px ${color})`}}>
    <path d="M12 0 L14.5 9.5 L24 12 L14.5 14.5 L12 24 L9.5 14.5 L0 12 L9.5 9.5 Z" />
  </svg>
);

// Pill button — glow neón en hover
function PillButton({ children, variant="dark", onClick, style={} }) {
  const [hov, setHov] = useState(false);
  const variants = {
    dark:    { bg: hov?"#161D2C":CARD, color:TEXT, border:`1px solid ${hov?"rgba(0,240,255,0.5)":"rgba(0,240,255,0.18)"}`, iconBg:`linear-gradient(135deg, ${CYAN}, ${ORANGE})`, shadow: hov?glowCyan(0.3):"none" },
    cyan:    { bg: hov?"#1AF5FF":CYAN, color:DEEP, border:"none", iconBg:"rgba(0,0,0,0.18)", shadow: hov?glowCyan(0.6):glowCyan(0.25) },
    orange: { bg: hov?"#FF9252":ORANGE, color:WHITE, border:"none", iconBg:"rgba(255,255,255,0.2)", shadow: hov?glowOrange(0.6):glowOrange(0.25) },
    outline: { bg: hov?"rgba(0,240,255,0.06)":"transparent", color:TEXT, border:`1px solid ${hov?CYAN:"rgba(234,241,255,0.2)"}`, iconBg:"rgba(255,255,255,0.08)", shadow: hov?glowCyan(0.25):"none" },
  }[variant];
  return (
    <button onClick={onClick}
      onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)}
      style={{
        display:"inline-flex", alignItems:"center", gap:14,
        background:variants.bg, color:variants.color, border:variants.border,
        borderRadius:9999, padding:"6px 24px 6px 6px",
        fontFamily:"Manrope, sans-serif", fontWeight:700, fontSize:14,
        cursor:"pointer", transition:"all 0.25s ease", boxShadow:variants.shadow,
        ...style,
      }}>
      <span style={{
        width:34, height:34, borderRadius:"50%", background:variants.iconBg,
        display:"flex", alignItems:"center", justifyContent:"center", flexShrink:0,
      }}>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke={variant==="cyan"?DEEP:variant==="dark"?CYAN:WHITE} strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M5 12h14M13 6l6 6-6 6"/>
        </svg>
      </span>
      {children}
    </button>
  );
}

// ── Nav — pill flotante, links compactos para que quepan ─────────────────────
function Nav() {
  const [open, setOpen] = useState(false);
  const links = [
    {label:"Inicio", id:"hero"},
    {label:"Servicios", id:"servicios"},
    {label:"Método", id:"metodología"},
    {label:"Casos", id:"casos"},
    {label:"Nosotros", id:"sobre"},
  ];
  const go = id => { document.getElementById(id)?.scrollIntoView({behavior:"smooth"}); setOpen(false); };
  return (
    <motion.nav initial={{y:-40,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:0.6,ease:[0.22,1,0.36,1]}}
      style={{ position:"fixed", top:16, left:"50%", transform:"translateX(-50%)", zIndex:200,
        width:"min(1240px, 94%)", display:"flex", alignItems:"center", justifyContent:"space-between",
        background:"rgba(10,14,22,0.65)", backdropFilter:"blur(16px)", WebkitBackdropFilter:"blur(16px)",
        border:"1px solid rgba(0,240,255,0.15)", borderRadius:9999, padding:"8px 8px 8px 18px",
        boxShadow:"0 8px 32px rgba(0,0,0,0.5)", gap:8 }}>

      {/* Logo */}
      <button onClick={()=>go("hero")} style={{background:"none",border:"none",cursor:"pointer",padding:0,display:"flex",alignItems:"center",gap:8,flexShrink:0}}>
        <span style={{
          width:32, height:32, borderRadius:9, background:`linear-gradient(135deg, ${CYAN}, ${ORANGE})`,
          display:"flex", alignItems:"center", justifyContent:"center", boxShadow:glowCyan(0.4),
        }}>
          <span style={{fontFamily:"Manrope, sans-serif", fontWeight:800, fontSize:16, color:DEEP}}>T</span>
        </span>
        <span style={{fontFamily:"Manrope, sans-serif", fontSize:17, fontWeight:800, color:TEXT, letterSpacing:"-0.02em"}}>tiey</span>
      </button>

      {/* Links — desktop, compactos */}
      <div style={{display:"flex",gap:1,alignItems:"center",flexShrink:1,minWidth:0}} className="desk-nav">
        {links.map(({label,id})=>(
          <button key={id} onClick={()=>go(id)} style={{
            background:"none", border:"none", color:"rgba(234,241,255,0.6)", fontSize:12.5,
            fontFamily:"Inter, sans-serif", fontWeight:600, cursor:"pointer", whiteSpace:"nowrap",
            padding:"8px 10px", borderRadius:9999, transition:"background 0.2s, color 0.2s, text-shadow 0.2s",
            flexShrink:0,
          }}
          onMouseEnter={e=>{e.target.style.background="rgba(0,240,255,0.08)"; e.target.style.color=CYAN; e.target.style.textShadow=`0 0 8px rgba(0,240,255,0.6)`;}}
          onMouseLeave={e=>{e.target.style.background="none"; e.target.style.color="rgba(234,241,255,0.6)"; e.target.style.textShadow="none";}}
          >{label}</button>
        ))}
      </div>

      {/* CTA desktop */}
      <div className="desk-cta" style={{flexShrink:0}}>
        <PillButton variant="cyan" onClick={()=>go("contacto")}>Contacto</PillButton>
      </div>

      {/* Burger mobile */}
      <button onClick={()=>setOpen(!open)} className="burger-btn"
        style={{display:"none",background:CARD,border:`1px solid rgba(0,240,255,0.2)`,borderRadius:9999,width:42,height:42,cursor:"pointer",alignItems:"center",justifyContent:"center",flexDirection:"column",gap:4,flexShrink:0}}>
        {[0,1,2].map(i=><span key={i} style={{display:"block",width:16,height:2,background:CYAN,borderRadius:2}}/>)}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}
            style={{position:"absolute",top:60,left:0,right:0,background:"rgba(10,14,22,0.97)",border:`1px solid rgba(0,240,255,0.15)`,borderRadius:24,padding:"16px",
              display:"flex",flexDirection:"column",gap:4, boxShadow:"0 12px 40px rgba(0,0,0,0.5)", backdropFilter:"blur(16px)"}}>
            {links.map(({label,id})=>(
              <button key={id} onClick={()=>go(id)} style={{background:"none",border:"none",color:TEXT,fontSize:15,fontWeight:600,fontFamily:"Inter, sans-serif",cursor:"pointer",textAlign:"left",padding:"12px 16px",borderRadius:12}}>{label}</button>
            ))}
            <div style={{padding:8}}>
              <PillButton variant="cyan" onClick={()=>go("contacto")} style={{width:"100%",justifyContent:"center"}}>Contacto</PillButton>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}

// ── RotatingGlobe — proyección ortográfica autocontenida (sin fetch / sin d3) ──
// Genera "continentes" como nubes de puntos deterministas + graticule + rotación.
function seededRandom(seed) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => (s = (s * 16807) % 2147483647) / 2147483647;
}

// Centros aproximados de masas continentales (lat, lon en grados) + radio + densidad
const CONTINENTS = [
  { lat: 50,  lon: 10,   rx: 22, ry: 14, n: 90  }, // Europa
  { lat: 30,  lon: 20,   rx: 28, ry: 34, n: 130 }, // África
  { lat: 50,  lon: 90,   rx: 45, ry: 24, n: 200 }, // Asia
  { lat: 45,  lon: -100, rx: 28, ry: 26, n: 140 }, // Norteamérica
  { lat: -15, lon: -60,  rx: 22, ry: 32, n: 110 }, // Sudamérica
  { lat: -25, lon: 135,  rx: 22, ry: 16, n: 60  }, // Oceanía
];

function generateGlobeDots() {
  const rand = seededRandom(42);
  const dots = [];
  CONTINENTS.forEach(c => {
    for (let i = 0; i < c.n; i++) {
      // Distribución gaussiana aproximada (suma de uniformes)
      const g1 = (rand()+rand()+rand()-1.5)/1.5;
      const g2 = (rand()+rand()+rand()-1.5)/1.5;
      dots.push({
        lat: Math.max(-85, Math.min(85, c.lat + g1*c.ry)),
        lon: c.lon + g2*c.rx,
      });
    }
  });
  return dots;
}

const GLOBE_DOTS = generateGlobeDots();

function RotatingGlobe({ size = 460 }) {
  const canvasRef = useRef(null);
  const rotationRef = useRef({ lon: -20, lat: -15 });
  const draggingRef = useRef(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const dpr = window.devicePixelRatio || 1;
    canvas.width = size * dpr;
    canvas.height = size * dpr;
    canvas.style.width = `${size}px`;
    canvas.style.height = `${size}px`;
    ctx.scale(dpr, dpr);

    const cx = size/2, cy = size/2, R = size*0.42;
    const D2R = Math.PI/180;

    // Proyección ortográfica: devuelve {x,y,visible}
    function project(latDeg, lonDeg) {
      const { lon: rotLon, lat: rotLat } = rotationRef.current;
      const lat = latDeg*D2R, lon = (lonDeg - rotLon)*D2R;
      const rotLatRad = rotLat*D2R;

      const x = Math.cos(lat) * Math.sin(lon);
      const y = Math.cos(rotLatRad)*Math.sin(lat) - Math.sin(rotLatRad)*Math.cos(lat)*Math.cos(lon);
      const z = Math.sin(rotLatRad)*Math.sin(lat) + Math.cos(rotLatRad)*Math.cos(lat)*Math.cos(lon);

      return { x: cx + R*x, y: cy - R*y, visible: z > 0, z };
    }

    function render() {
      ctx.clearRect(0,0,size,size);

      // Esfera de fondo
      ctx.beginPath();
      ctx.arc(cx, cy, R, 0, Math.PI*2);
      ctx.fillStyle = DEEP;
      ctx.fill();
      ctx.lineWidth = 1.5;
      ctx.strokeStyle = "rgba(0,240,255,0.4)";
      ctx.shadowColor = "rgba(0,240,255,0.6)";
      ctx.shadowBlur = 14;
      ctx.stroke();
      ctx.shadowBlur = 0;

      // Graticule — meridianos y paralelos cada 30°
      ctx.lineWidth = 0.6;
      ctx.strokeStyle = "rgba(0,240,255,0.14)";
      for (let lon=-180; lon<180; lon+=30) {
        ctx.beginPath();
        let started = false;
        for (let lat=-90; lat<=90; lat+=2) {
          const p = project(lat, lon);
          if (p.visible) {
            if (!started) { ctx.moveTo(p.x,p.y); started=true; } else ctx.lineTo(p.x,p.y);
          } else started = false;
        }
        ctx.stroke();
      }
      for (let lat=-60; lat<=60; lat+=30) {
        ctx.beginPath();
        let started = false;
        for (let lon=-180; lon<=180; lon+=2) {
          const p = project(lat, lon);
          if (p.visible) {
            if (!started) { ctx.moveTo(p.x,p.y); started=true; } else ctx.lineTo(p.x,p.y);
          } else started = false;
        }
        ctx.stroke();
      }

      // Puntos de "continentes"
      GLOBE_DOTS.forEach(({lat,lon}) => {
        const p = project(lat, lon);
        if (p.visible) {
          ctx.beginPath();
          ctx.arc(p.x, p.y, 1.4, 0, Math.PI*2);
          ctx.fillStyle = `rgba(255,122,41,${0.4 + 0.4*p.z})`;
          ctx.fill();
        }
      });

      // Punto de origen — Monterrey, N.L. México (aprox: 25.7°N, -100.3°E)
      const origin = project(25.7, -100.3);
      if (origin.visible) {
        ctx.beginPath();
        ctx.arc(origin.x, origin.y, 4, 0, Math.PI*2);
        ctx.fillStyle = CYAN;
        ctx.shadowColor = CYAN;
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.shadowBlur = 0;
      }
    }

    let raf;
    function loop() {
      if (!draggingRef.current) rotationRef.current.lon += 0.18;
      render();
      raf = requestAnimationFrame(loop);
    }
    loop();

    // Drag para rotar manualmente
    const onDown = (e) => {
      draggingRef.current = true;
      const startX = e.clientX, startY = e.clientY;
      const start = { ...rotationRef.current };
      canvas.style.cursor = "grabbing";
      const onMove = (me) => {
        rotationRef.current.lon = start.lon + (me.clientX-startX)*0.4;
        rotationRef.current.lat = Math.max(-80, Math.min(80, start.lat - (me.clientY-startY)*0.4));
      };
      const onUp = () => {
        draggingRef.current = false;
        canvas.style.cursor = "grab";
        window.removeEventListener("mousemove", onMove);
        window.removeEventListener("mouseup", onUp);
      };
      window.addEventListener("mousemove", onMove);
      window.addEventListener("mouseup", onUp);
    };
    canvas.addEventListener("mousedown", onDown);

    return () => {
      cancelAnimationFrame(raf);
      canvas.removeEventListener("mousedown", onDown);
    };
  }, [size]);

  return (
    <div style={{ position:"relative", width:size, height:size, maxWidth:"100%" }}>
      <canvas ref={canvasRef} style={{ width:"100%", height:"auto", display:"block", cursor:"grab" }} />
    </div>
  );
}

function Hero() {
  return (
    <section id="hero" style={{position:"relative", background:DEEP, padding:"140px 5% 0", overflow:"hidden", minHeight:"100vh"}}>
      <GridBG opacity={0.05}/>
      <div style={{position:"absolute",top:"5%",right:"5%",width:420,height:420,borderRadius:"50%",background:`radial-gradient(circle, rgba(0,240,255,0.12), transparent 70%)`,pointerEvents:"none"}}/>
      <div style={{position:"absolute",top:"30%",left:"-5%",width:380,height:380,borderRadius:"50%",background:`radial-gradient(circle, rgba(255,122,41,0.1), transparent 70%)`,pointerEvents:"none"}}/>

      <div style={{maxWidth:1280, margin:"0 auto", position:"relative", zIndex:1, display:"grid", gridTemplateColumns:"1.1fr 1fr", gap:40, alignItems:"center", minHeight:"calc(100vh - 140px)"}} className="hero-grid">

        {/* Columna izquierda: copy */}
        <div>
          <motion.h1 initial={{opacity:0,y:24}} animate={{opacity:1,y:0}} transition={{duration:0.7,delay:0.15}}
            style={{fontFamily:"Manrope, sans-serif", fontWeight:800, fontSize:"clamp(40px, 5.2vw, 76px)", lineHeight:1.05, letterSpacing:"-0.03em", margin:"0 0 24px", maxWidth:680}}>
            <span style={{color:TEXT, display:"block"}}>Encuentra tu</span>
            <span style={{display:"block", color:TEXT}}>
              próximo{" "}
              <AnimatedTextCycle
                words={["líder tech","CTO","VP Engineering","Head of Product","arquitecto cloud","líder de datos"]}
                interval={2400}
                style={{
                  background:`linear-gradient(90deg, ${CYAN}, ${ORANGE})`,
                  WebkitBackgroundClip:"text", backgroundClip:"text", color:"transparent",
                  filter:"drop-shadow(0 0 18px rgba(0,240,255,0.25))",
                  fontWeight:800,
                }}
              />
            </span>
          </motion.h1>

          <motion.p initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.7,delay:0.3}}
            style={{fontFamily:"Inter, sans-serif", fontSize:15, lineHeight:1.7, color:MUTED, maxWidth:380, marginBottom:36}}>
            Somos una firma boutique que conecta empresas tech con el talento que necesitan, a través de un proceso a medida y sin atajos.
          </motion.p>

          <motion.div initial={{opacity:0,y:16}} animate={{opacity:1,y:0}} transition={{duration:0.7,delay:0.45}}>
            <PillButton variant="cyan" onClick={()=>document.getElementById("contacto")?.scrollIntoView({behavior:"smooth"})}>Empezar ahora</PillButton>
          </motion.div>
        </div>

        {/* Columna derecha: globo */}
        <motion.div initial={{opacity:0,scale:0.95}} animate={{opacity:1,scale:1}} transition={{duration:1,delay:0.25}}
          style={{ position:"relative", display:"flex", justifyContent:"center", alignItems:"center" }} className="hero-globe-col">

          <div style={{position:"absolute", width:"110%", height:"110%", borderRadius:"50%", background:`radial-gradient(circle, rgba(0,240,255,0.15), transparent 65%)`, pointerEvents:"none"}}/>

          <RotatingGlobe size={460} />
        </motion.div>
      </div>

      {/* Oversized wordmark */}
      <div style={{
        position:"relative", marginTop:-40, textAlign:"center", overflow:"hidden",
        pointerEvents:"none", lineHeight:0.8, zIndex:1,
      }}>
        <span style={{
          fontFamily:"Manrope, sans-serif", fontWeight:800,
          fontSize:"clamp(120px, 22vw, 320px)", letterSpacing:"-0.04em",
          color:"transparent",
          WebkitTextStroke: `1px rgba(0,240,255,0.15)`,
        }}>tiey</span>
      </div>
    </section>
  );
}

// ── Servicios — grid asimétrico con neón ──────────────────────────────────────
const SERVICES = [
  {
    tag:"Especialistas",
    title:"Perfiles digitales",
    desc:"Product, Diseño, Data, DevOps. Talento que entiende negocio y tecnología a la vez.",
    bg: `linear-gradient(135deg, #1a0a2e, ${ORANGE} 130%)`, border:"none", accent:WHITE, glow:glowOrange(0.3),
  },
  {
    tag:"Crecimiento",
    title:"Empresas en crecimiento",
    desc:"Proceso ágil, shortlist cualificada y visibilidad total — para equipos que escalan rápido.",
    bg: `linear-gradient(135deg, #0a1f2e, ${CYAN} 140%)`, border:"none", accent:WHITE, glow:glowCyan(0.3),
  },
  {
    tag:"Marca",
    title:"Employer branding",
    desc:"Te ayudamos a articular por qué un gran perfil debería elegirte sobre una gran tech.",
    bg: CARD, border:`1px solid rgba(255,122,41,0.18)`, accent:ORANGE, glow:glowOrange(0.12),
  },
  {
    tag:"Multisector",
    title:"Mandos medios y gerencias",
    desc:"Finance Managers, responsables de Operaciones, Ventas, HR y Marketing — los perfiles de mando medio más solicitados, también fuera del mundo tech y digital.",
    bg: CARD, border:`1px solid rgba(255,122,41,0.18)`, accent:ORANGE, glow:glowOrange(0.12),
  },
  {
    tag:"Innovación",
    title:"Agentes IA para reclutamiento operativo",
    desc:"Asistentes de IA que filtran candidaturas, agendan entrevistas y dan seguimiento en procesos de contratación operativa de alto volumen.",
    bg: `linear-gradient(135deg, #0a1622, ${CYAN}1f 140%)`, border:`1px dashed rgba(0,240,255,0.35)`, accent:CYAN, glow:glowCyan(0.1),
    note:"* Próximamente",
  },
];

function Servicios() {
  const fade = useFadeUp();
  return (
    <section id="servicios" style={{position:"relative",background:DARK,padding:"100px 5% 120px",overflow:"hidden"}}>
      <GridBG opacity={0.04}/>
      <div style={{maxWidth:1280,margin:"0 auto",position:"relative",zIndex:1}}>

        <motion.div {...fade} style={{textAlign:"center", maxWidth:760, margin:"0 auto 56px"}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:18}}>
            <SparkIcon/>
            <span style={{fontFamily:"'Courier New', monospace",fontSize:12,fontWeight:700,color:CYAN,textTransform:"uppercase",letterSpacing:"0.18em",textShadow:`0 0 8px rgba(0,240,255,0.5)`}}>Servicios</span>
          </div>
          <h2 style={{fontFamily:"Manrope, sans-serif",fontWeight:800,fontSize:"clamp(28px,4vw,46px)",letterSpacing:"-0.02em",lineHeight:1.2,margin:0}}>
            <span style={{color:TEXT}}>Donde marcamos</span>{" "}
            <span style={{color:GRAY}}>la diferencia para tu empresa</span>
          </h2>
        </motion.div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(240px, 1fr))",gap:18,alignItems:"stretch"}} className="servicios-grid">
          {SERVICES.map((s,i)=>{
            const f = useFadeUp(i*0.1);
            return (
              <motion.div key={s.title} {...f}
                style={{
                  position:"relative", borderRadius:28, padding:28,
                  background:s.bg, border:s.border, minHeight:340,
                  display:"flex", flexDirection:"column", justifyContent:"space-between",
                  overflow:"hidden", boxShadow:s.glow,
                }}
                whileHover={{ y:-6 }} transition={{duration:0.3}}
              >
                <span style={{
                  alignSelf:"flex-start", fontFamily:"'Courier New', monospace", fontSize:11, fontWeight:600,
                  color: s.accent===WHITE ? "rgba(255,255,255,0.9)" : s.accent,
                  background: s.accent===WHITE ? "rgba(255,255,255,0.12)" : "rgba(255,255,255,0.04)",
                  border: s.accent===WHITE ? "none" : `1px solid ${s.accent}33`,
                  borderRadius:9999, padding:"5px 14px", letterSpacing:"0.05em",
                }}>{s.tag}</span>

                <div>
                  <SparkIcon color={s.accent===WHITE?WHITE:s.accent}/>
                  <h3 style={{fontFamily:"Manrope, sans-serif", fontWeight:800, fontSize:21, color: s.accent===WHITE?WHITE:TEXT, margin:"10px 0 8px", lineHeight:1.2}}>{s.title}</h3>
                  <p style={{fontFamily:"Inter, sans-serif", fontSize:13.5, lineHeight:1.6, color: s.accent===WHITE?"rgba(255,255,255,0.85)":MUTED, margin:0}}>{s.desc}</p>
                  {s.note && (
                    <span style={{display:"inline-block", marginTop:14, fontFamily:"'Courier New', monospace", fontSize:10.5, fontWeight:600, color:CYAN, letterSpacing:"0.05em"}}>{s.note}</span>
                  )}
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Metodología ────────────────────────────────────────────────────────────────
const METODO_STEPS = [
  { tag:"01 · Semana 1",  title:"Briefing profundo",       neon:false,
    desc:"Sesión a fondo para entender el rol, el equipo y la cultura — qué hace que alguien encaje de verdad, más allá del puesto en el papel." },
  { tag:"02 · Semana 1–2",title:"Mapa de talento",          neon:"cyan",
    desc:"Activamos nuestra red y mapeamos el mercado pasivo: perfiles que no buscan activamente pero cambiarían por la oportunidad correcta." },
  { tag:"03 · Semana 2–3",title:"Entrevistas",              neon:false,
    desc:"Entrevistas estructuradas para validar experiencia técnica, soft skills y fit cultural — filtramos antes de mostrarte nada." },
  { tag:"04 · Semana 3–4",title:"Shortlist",                neon:false,
    desc:"Recibes 3 a 5 perfiles con un resumen claro de fortalezas, motivaciones y por qué encajan en tu contexto específico." },
  { tag:"05 · Semana 4–6",title:"Acompañamiento",           neon:false,
    desc:"Coordinamos entrevistas, damos feedback a ambas partes y te acompañamos en la negociación de la oferta hasta firmar." },
  { tag:"06 · Garantía",  title:"3 meses de cobertura",     neon:"orange",
    desc:"Si algo no funciona en los primeros 3 meses por causas del proceso, repetimos la búsqueda sin coste adicional." },
];

function Metodologia() {
  const fade = useFadeUp();
  return (
    <section id="metodología" style={{position:"relative",background:DEEP,padding:"40px 5% 120px",overflow:"hidden"}}>
      <GridBG opacity={0.04}/>
      <div style={{maxWidth:1280,margin:"0 auto",position:"relative",zIndex:1}}>
        <motion.div {...fade} style={{textAlign:"center", marginBottom:48}}>
          <div style={{display:"flex",justifyContent:"center",marginBottom:24}}>
            <span style={{
              width:48,height:48,borderRadius:"50%",background:CARD, border:`1px solid rgba(0,240,255,0.3)`,
              display:"flex",alignItems:"center",justifyContent:"center", boxShadow:glowCyan(0.2),
            }}><SparkIcon size={20} color={CYAN}/></span>
          </div>
          <h2 style={{fontFamily:"Manrope, sans-serif",fontWeight:800,fontSize:"clamp(34px,6vw,68px)",letterSpacing:"-0.03em",lineHeight:1.08,margin:"0 0 24px"}}>
            <span style={{color:TEXT}}>Cómo trabaja</span><br/>
            <span style={{color:GRAY}}>nuestro proceso</span>
          </h2>
          <div style={{display:"flex",justifyContent:"center",gap:48,flexWrap:"wrap",maxWidth:760,margin:"0 auto"}}>
            <p style={{fontFamily:"Inter, sans-serif",fontSize:13,lineHeight:1.7,color:GRAY,maxWidth:260,margin:0,textAlign:"left"}}>
              Un proceso de seis pasos, sin atajos, diseñado para encontrar a la persona correcta — no solo a alguien disponible.
            </p>
            <p style={{fontFamily:"Inter, sans-serif",fontSize:13,lineHeight:1.7,color:GRAY,maxWidth:260,margin:0,textAlign:"left"}}>
              Cada búsqueda lleva nuestro sello: criterio, seguimiento real y una garantía de tres meses sin letra pequeña.
            </p>
          </div>
        </motion.div>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit, minmax(150px, 1fr))",gap:14}} className="metodo-grid">
          {METODO_STEPS.map((s,i)=>{
            const f = useFadeUp(i*0.06);
            const neonColor = s.neon==="cyan"?CYAN : s.neon==="orange"?ORANGE : null;
            return (
              <motion.div key={s.title} {...f}
                style={{
                  borderRadius:24, padding:20, minHeight:215,
                  background: neonColor ? `linear-gradient(135deg, #0a0e16, ${neonColor}22 130%)` : CARD,
                  border: neonColor ? `1px solid ${neonColor}55` : `1px solid rgba(255,255,255,0.06)`,
                  boxShadow: neonColor ? (neonColor===CYAN?glowCyan(0.18):glowOrange(0.18)) : "none",
                  display:"flex", flexDirection:"column", justifyContent:"space-between",
                  position:"relative", overflow:"hidden",
                }}
                whileHover={{ y:-4 }} transition={{duration:0.25}}
              >
                <span style={{
                  alignSelf:"flex-start", fontFamily:"'Courier New', monospace", fontSize:10.5, fontWeight:600,
                  color: neonColor || GRAY,
                  background: "rgba(255,255,255,0.04)",
                  border: `1px solid ${neonColor ? neonColor+"55" : "rgba(255,255,255,0.08)"}`,
                  borderRadius:9999, padding:"4px 12px",
                }}>{s.tag}</span>
                <div>
                  <h4 style={{fontFamily:"Manrope, sans-serif", fontWeight:800, fontSize:15.5, lineHeight:1.3,
                    color: TEXT, margin:"0 0 8px"}}>{s.title}</h4>
                  <p style={{fontFamily:"Inter, sans-serif", fontSize:12, lineHeight:1.6,
                    color: MUTED, margin:0}}>{s.desc}</p>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

// ── Casos / Testimonios — carrusel horizontal ─────────────────────────────────
const TESTIMONIALS = [
  { name:"Marta Gómez",  role:"CTO · Fintech B2B",      quote:"Nos ayudaron a encontrar a alguien que nadie hubiera encontrado en un portal.", colors:[CYAN, "#0A4D55"] },
  { name:"Diego Torres", role:"CEO · E-commerce Moda",  quote:"Tres candidatos, los tres valían. Contratamos al primero y sigue tres años después.", colors:[ORANGE, "#5A2A0A"] },
  { name:"Lucía Fernández", role:"Head of People · SaaS HR", quote:"Con Tiey hablas con quien va a hacer el trabajo, no con un comercial que delega.", colors:["#7C5CFF", "#2A1A5A"] },
  { name:"Javier Ruiz",  role:"Director · Agencia Digital", quote:"Costaba mucho encontrar talento de diseño. Tiey lo encontró en tres semanas.", colors:[CYAN, ORANGE] },
  { name:"Sara Molina",  role:"VP Engineering · Insurtech", quote:"En seis semanas teníamos a nuestro Head of Data incorporado. Garantía cumplida.", colors:["#3FE0A5", "#0A4D3A"] },
];

const getInitials = (name) => name.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();

// ── Casos — minimal-testimonial port (21st.dev), recolor cyberpunk ───────────
function Casos() {
  const fade = useFadeUp();
  const [active, setActive] = useState(0);

  return (
    <section id="casos" style={{position:"relative",background:DARK,padding:"100px 5%",overflow:"hidden"}}>
      <GridBG opacity={0.04}/>
      <div style={{maxWidth:1280,margin:"0 auto",position:"relative",zIndex:1}}>
        <motion.div {...fade} style={{textAlign:"center",marginBottom:64}}>
          <h2 style={{fontFamily:"Manrope, sans-serif",fontWeight:800,fontSize:"clamp(28px,4.5vw,52px)",letterSpacing:"-0.02em",color:TEXT,margin:"0 0 12px",lineHeight:1.2}}>
            Empresas que ya<br/>confían en nosotros
          </h2>
          <p style={{fontFamily:"Inter, sans-serif",fontSize:13,color:MUTED,maxWidth:480,margin:"0 auto",lineHeight:1.7}}>
            De fintechs en serie B a agencias digitales — historias reales de equipos que encontraron a la persona correcta.
          </p>
        </motion.div>

        <motion.div {...useFadeUp(0.15)} style={{
          maxWidth:620, margin:"0 auto", borderRadius:28, padding:"48px 40px",
          background:CARD, border:`1px solid rgba(0,240,255,0.15)`,
        }}>
          {/* Quote — cross-fade */}
          <div style={{position:"relative", minHeight:120, marginBottom:40}}>
            <AnimatePresence mode="wait">
              <motion.p key={active}
                initial={{ opacity:0, y:12, filter:"blur(6px)" }}
                animate={{ opacity:1, y:0, filter:"blur(0px)" }}
                exit={{ opacity:0, y:-12, filter:"blur(6px)" }}
                transition={{ duration:0.45, ease:[0.22,1,0.36,1] }}
                style={{
                  fontFamily:"Manrope, sans-serif", fontWeight:500, fontSize:"clamp(19px,2.6vw,26px)",
                  lineHeight:1.5, color:TEXT, margin:0,
                }}>
                "{TESTIMONIALS[active].quote}"
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Author row */}
          <div style={{display:"flex", alignItems:"center", gap:24, flexWrap:"wrap"}}>
            {/* Avatar stack */}
            <div style={{display:"flex"}}>
              {TESTIMONIALS.map((t,i) => (
                <button key={t.name} onClick={()=>setActive(i)}
                  style={{
                    position:"relative", width:44, height:44, borderRadius:"50%",
                    overflow:"hidden", border:"none", cursor:"pointer", padding:0,
                    marginLeft: i===0?0:-12,
                    zIndex: active===i ? 10 : 1,
                    transform: active===i ? "scale(1.12)" : "scale(1)",
                    boxShadow: active===i ? glowCyan(0.5) : "none",
                    outline: active===i ? `2px solid ${CYAN}` : `2px solid ${DARK}`,
                    outlineOffset: 0,
                    filter: active===i ? "none" : "grayscale(1)",
                    transition:"transform 0.3s ease, filter 0.3s ease, box-shadow 0.3s ease",
                  }}>
                  <div style={{
                    width:"100%", height:"100%", display:"flex", alignItems:"center", justifyContent:"center",
                    background:`linear-gradient(135deg, ${t.colors[0]}, ${t.colors[1]})`,
                    fontFamily:"Manrope, sans-serif", fontWeight:800, fontSize:13, color:WHITE, textShadow:"0 1px 4px rgba(0,0,0,0.4)",
                  }}>{getInitials(t.name)}</div>
                </button>
              ))}
            </div>

            {/* Divider */}
            <div style={{height:32, width:1, background:"rgba(255,255,255,0.1)"}} className="testi-divider"/>

            {/* Active author info — cross-fade */}
            <div style={{position:"relative", flex:1, minHeight:40}}>
              <AnimatePresence mode="wait">
                <motion.div key={active}
                  initial={{ opacity:0, x:-8 }}
                  animate={{ opacity:1, x:0 }}
                  exit={{ opacity:0, x:8 }}
                  transition={{ duration:0.35, ease:[0.22,1,0.36,1] }}
                  style={{ display:"flex", flexDirection:"column", justifyContent:"center" }}>
                  <span style={{fontFamily:"Manrope, sans-serif", fontWeight:800, fontSize:14, color:TEXT}}>{TESTIMONIALS[active].name}</span>
                  <span style={{fontFamily:"'Courier New', monospace", fontSize:11.5, color:CYAN, marginTop:2}}>{TESTIMONIALS[active].role}</span>
                </motion.div>
              </AnimatePresence>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Sobre Tiey ──────────────────────────────────────────────────────────────────
function Sobre() {
  const f1 = useFadeUp(), f2 = useFadeUp(0.15);
  const stats = [
    {label:"Especialización", value:"Tech, Digital, Mandos Medios e IA Recruiting",
      desc:"Desde perfiles técnicos hasta gerencias multisector, integrando IA donde aporta valor real."},
    {label:"Tipo de empresa", value:"PYMES, Startups y Scale-ups",
      desc:"Trabajamos principalmente con organizaciones que crecen rápido y necesitan acertar a la primera."},
    {label:"Fee", value:"1 mes de sueldo bruto + IVA",
      desc:"Pago único al incorporar — sin retainers ni cuotas mensuales por adelantado."},
    {label:"Garantía", value:"3 meses de reposición sin coste",
      desc:"Si la persona no funciona por causas del proceso, repetimos la búsqueda sin cargo extra."},
  ];
  return (
    <section id="sobre" style={{position:"relative",background:DEEP,padding:"100px 5%",overflow:"hidden"}}>
      <GridBG opacity={0.04}/>
      <div style={{maxWidth:1280,margin:"0 auto",position:"relative",zIndex:1}}>

        <motion.div {...f1} style={{display:"flex",alignItems:"flex-start",gap:16,marginBottom:32,flexWrap:"wrap"}}>
          <SparkIcon size={26}/>
          <h2 style={{fontFamily:"Manrope, sans-serif",fontWeight:800,fontSize:"clamp(26px,4vw,44px)",letterSpacing:"-0.02em",lineHeight:1.35,color:TEXT,margin:0,maxWidth:880}}>
            Somos una firma boutique de búsqueda de talento que entrega el rigor de{" "}
            una consultora grande con la cercanía y rapidez de un{" "}
            <span style={{color:GRAY}}>equipo pequeño que entiende tu negocio.</span>
          </h2>
        </motion.div>

        <motion.p {...useFadeUp(0.1)} style={{fontFamily:"Inter, sans-serif",fontSize:12.5,lineHeight:1.8,color:MUTED,maxWidth:420,marginBottom:64}}>
          Pocos clientes, atención total. Cada búsqueda tiene un único responsable desde el briefing hasta la incorporación.
        </motion.p>

        <div style={{display:"grid",gridTemplateColumns:"1.3fr 1fr",gap:18}} className="sobre-grid">
          <motion.div {...f2} style={{
            borderRadius:28, padding:36, background:`linear-gradient(135deg, #1a0a2e, ${ORANGE}33 140%)`,
            border:`1px solid ${ORANGE}55`, boxShadow:glowOrange(0.2),
            display:"flex", flexDirection:"column", justifyContent:"space-between", minHeight:260,
          }}>
            <SparkIcon color={ORANGE} size={20}/>
            <p style={{fontFamily:"Manrope, sans-serif", fontWeight:700, fontSize:"clamp(18px,2.4vw,28px)", color:WHITE, lineHeight:1.4, margin:"20px 0 0"}}>
              "El talento excepcional no espera. Nosotros tampoco."
            </p>
          </motion.div>

          <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:18}} className="sobre-stats">
            {stats.map((s,i)=>{
              const f = useFadeUp(0.2+i*0.05);
              return (
                <motion.div key={s.label} {...f} style={{
                  borderRadius:24, padding:22, background:CARD, border:`1px solid rgba(0,240,255,0.15)`,
                  display:"flex", flexDirection:"column", justifyContent:"flex-start", minHeight:160,
                }}>
                  <span style={{fontFamily:"'Courier New', monospace",fontSize:10.5,fontWeight:600,color:CYAN,textTransform:"uppercase",letterSpacing:"0.1em"}}>{s.label}</span>
                  <span style={{fontFamily:"Manrope, sans-serif",fontWeight:800,fontSize:15,color:TEXT,lineHeight:1.3,marginTop:10}}>{s.value}</span>
                  <span style={{fontFamily:"Inter, sans-serif",fontSize:11.5,color:MUTED,lineHeight:1.55,marginTop:8}}>{s.desc}</span>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Precios ────────────────────────────────────────────────────────────────────
function Precios() {
  const fade = useFadeUp();
  return (
    <section id="precios" style={{position:"relative",background:DARK,padding:"100px 5%",overflow:"hidden"}}>
      <GridBG opacity={0.04}/>
      <div style={{maxWidth:900,margin:"0 auto",position:"relative",zIndex:1}}>
        <motion.div {...fade} style={{textAlign:"center",marginBottom:40}}>
          <div style={{display:"flex",alignItems:"center",justifyContent:"center",gap:8,marginBottom:18}}>
            <SparkIcon/>
            <span style={{fontFamily:"'Courier New', monospace",fontSize:12,fontWeight:700,color:CYAN,textTransform:"uppercase",letterSpacing:"0.18em",textShadow:`0 0 8px rgba(0,240,255,0.5)`}}>Precios</span>
          </div>
          <h2 style={{fontFamily:"Manrope, sans-serif",fontWeight:800,fontSize:"clamp(28px,4vw,48px)",letterSpacing:"-0.02em",margin:0}}>
            <span style={{color:TEXT}}>Un modelo</span>{" "}
            <span style={{background:`linear-gradient(90deg, ${CYAN}, ${ORANGE})`,WebkitBackgroundClip:"text",backgroundClip:"text",color:"transparent"}}>transparente</span>
          </h2>
        </motion.div>

        <motion.div {...useFadeUp(0.15)} style={{
          borderRadius:32, padding:"48px 40px", background:CARD,
          border:`1px solid rgba(0,240,255,0.18)`, boxShadow:glowCyan(0.1),
          position:"relative", overflow:"hidden",
        }}>
          <div style={{position:"absolute",top:-100,right:-100,width:300,height:300,borderRadius:"50%",background:`radial-gradient(circle, rgba(0,240,255,0.12), transparent 70%)`}}/>
          <div style={{position:"relative",display:"grid",gridTemplateColumns:"1fr auto",gap:40,alignItems:"center"}} className="precio-inner">
            <div>
              <span style={{fontFamily:"'Courier New', monospace",fontSize:11,fontWeight:600,color:CYAN,textTransform:"uppercase",letterSpacing:"0.12em"}}>Fee de éxito — único modelo</span>
              <h3 style={{
                fontFamily:"Manrope, sans-serif",fontWeight:800,fontSize:"clamp(34px,5vw,56px)",margin:"14px 0 8px",lineHeight:1,
                background:`linear-gradient(90deg, ${CYAN}, ${ORANGE})`,WebkitBackgroundClip:"text",backgroundClip:"text",color:"transparent",
              }}>1 mes</h3>
              <p style={{fontFamily:"Inter, sans-serif",fontSize:14,color:MUTED,margin:"0 0 24px"}}>de sueldo bruto + IVA — solo si hay incorporación</p>
              <div style={{display:"flex",flexDirection:"column",gap:10}}>
                {["Búsqueda activa en mercado pasivo","Shortlist de 3 a 5 perfiles con informe","Acompañamiento hasta la incorporación","Garantía de 3 meses sin coste adicional"].map(item=>(
                  <div key={item} style={{display:"flex",gap:10,alignItems:"flex-start"}}>
                    <span style={{color:CYAN,fontSize:13,marginTop:2}}>✓</span>
                    <span style={{fontFamily:"Inter, sans-serif",fontSize:13,color:MUTED,lineHeight:1.5}}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="precio-cta">
              <PillButton variant="cyan" onClick={()=>document.getElementById("contacto")?.scrollIntoView({behavior:"smooth"})}>Solicitar propuesta</PillButton>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Contacto ──────────────────────────────────────────────────────────────────
// Para recibir los mensajes en tu correo (hola@tiey.cc), genera una Access Key
// gratis en https://web3forms.com (solo pides email, no requiere cuenta) y
// pégala aquí abajo. Sin esto el formulario no enviará nada.
const WEB3FORMS_ACCESS_KEY = "9662f6a0-70d8-4c87-81ec-c56e48d02987";

function Contacto() {
  const [form, setForm] = useState({nombre:"",empresa:"",email:"",mensaje:""});
  const [sent, setSent] = useState(false);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const handleChange = e => setForm(f=>({...f,[e.target.name]:e.target.value}));
  const handleSubmit = async () => {
    if(!form.nombre||!form.email||!form.mensaje) {
      setError("Completa al menos nombre, email y mensaje.");
      return;
    }
    setError("");
    setSending(true);
    try {
      const res = await fetch("https://api.web3forms.com/submit", {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify({
          access_key: WEB3FORMS_ACCESS_KEY,
          subject: `Nuevo contacto desde tiey.cc — ${form.nombre}`,
          from_name: "Tiey — Formulario web",
          name: form.nombre,
          email: form.email,
          empresa: form.empresa,
          mensaje: form.mensaje,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setSent(true);
      } else {
        setError("No se pudo enviar. Intenta de nuevo o escríbenos a hola@tiey.cc.");
      }
    } catch {
      setError("No se pudo enviar. Intenta de nuevo o escríbenos a hola@tiey.cc.");
    } finally {
      setSending(false);
    }
  };
  const inputStyle = {
    width:"100%", background:"rgba(0,240,255,0.04)", border:"1px solid rgba(0,240,255,0.18)",
    borderRadius:14, color:TEXT, fontFamily:"Inter, sans-serif", fontSize:14,
    padding:"14px 18px", outline:"none", boxSizing:"border-box", transition:"border-color 0.2s, box-shadow 0.2s",
  };
  return (
    <section id="contacto" style={{position:"relative",background:DEEP,padding:"60px 5% 0",overflow:"hidden"}}>
      <GridBG opacity={0.05}/>
      <div style={{maxWidth:1280,margin:"0 auto",position:"relative",minHeight:520,zIndex:1,
        display:"grid", gridTemplateColumns:"1fr 1fr", gap:40, alignItems:"center"}} className="contacto-grid">

        <motion.div {...useFadeUp()} style={{maxWidth:420}}>
          <h2 style={{fontFamily:"Manrope, sans-serif",fontWeight:800,fontSize:"clamp(30px,4.5vw,52px)",letterSpacing:"-0.02em",lineHeight:1.15,color:TEXT,margin:"0 0 16px"}}>
            ¿Listo para encontrar a tu próximo líder?
          </h2>
          <p style={{fontFamily:"Inter, sans-serif",fontSize:13.5,color:GRAY,lineHeight:1.7,margin:0}}>
            No es solo dar resultados — los creamos. Cuéntanos qué necesitas y en 24h te decimos cómo podemos ayudarte.
          </p>
        </motion.div>

        <motion.div {...useFadeUp(0.15)} style={{
          maxWidth:420, width:"100%", marginLeft:"auto",
          background:CARD, border:`1px solid rgba(0,240,255,0.18)`, borderRadius:28, padding:32,
          boxShadow:`0 20px 60px rgba(0,0,0,0.5), ${glowCyan(0.1)}`, position:"relative", zIndex:2,
        }} className="contacto-card">
          <AnimatePresence mode="wait">
            {sent ? (
              <motion.div key="ok" initial={{opacity:0}} animate={{opacity:1}} style={{textAlign:"center",padding:"24px 0"}}>
                <span style={{fontSize:36,display:"block",marginBottom:12,color:CYAN,filter:`drop-shadow(0 0 8px ${CYAN})`}}>✓</span>
                <h3 style={{fontFamily:"Manrope, sans-serif",fontWeight:800,fontSize:20,color:TEXT,margin:"0 0 8px"}}>Mensaje recibido</h3>
                <p style={{fontFamily:"Inter, sans-serif",fontSize:13,color:GRAY,lineHeight:1.6}}>Te respondemos en menos de 24 horas.</p>
              </motion.div>
            ) : (
              <motion.div key="form" style={{display:"flex",flexDirection:"column",gap:12}}>
                <h3 style={{fontFamily:"Manrope, sans-serif",fontWeight:800,fontSize:20,margin:"0 0 4px",color:TEXT}}>
                  <span style={{color:CYAN,textShadow:`0 0 8px rgba(0,240,255,0.5)`}}>Construyamos</span> algo bueno
                </h3>
                {[
                  {name:"nombre",ph:"Tu nombre",type:"text"},
                  {name:"empresa",ph:"Empresa",type:"text"},
                  {name:"email",ph:"Email de contacto",type:"email"},
                ].map(({name,ph,type})=>(
                  <input key={name} name={name} type={type} value={form[name]} onChange={handleChange} placeholder={ph} style={inputStyle}
                    onFocus={e=>{e.target.style.borderColor=CYAN; e.target.style.boxShadow=glowCyan(0.2);}} onBlur={e=>{e.target.style.borderColor="rgba(0,240,255,0.18)"; e.target.style.boxShadow="none";}} />
                ))}
                <textarea name="mensaje" rows={3} value={form.mensaje} onChange={handleChange} placeholder="¿Qué rol buscas?"
                  style={{...inputStyle,resize:"vertical"}}
                  onFocus={e=>{e.target.style.borderColor=CYAN; e.target.style.boxShadow=glowCyan(0.2);}} onBlur={e=>{e.target.style.borderColor="rgba(0,240,255,0.18)"; e.target.style.boxShadow="none";}} />
                {error && (
                  <p style={{fontFamily:"Inter, sans-serif",fontSize:12,color:ORANGE,margin:0}}>{error}</p>
                )}
                <PillButton variant="cyan" onClick={handleSubmit} style={{justifyContent:"center", width:"100%", marginTop:4, opacity:sending?0.7:1}}>
                  {sending?"Enviando...":"Empezar ahora"}
                </PillButton>
              </motion.div>
            )}
          </AnimatePresence>
        </motion.div>

        {/* Oversized wordmark behind */}
        <div style={{
          position:"absolute", bottom:-60, left:0, right:0, textAlign:"center",
          pointerEvents:"none", zIndex:0, lineHeight:0.8,
        }} className="contacto-wordmark">
          <span style={{
            fontFamily:"Manrope, sans-serif", fontWeight:800,
            fontSize:"clamp(100px, 18vw, 260px)", letterSpacing:"-0.04em",
            color:"transparent", WebkitTextStroke:`1px rgba(0,240,255,0.1)`,
          }}>tiey</span>
        </div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer style={{position:"relative",background:DEEP,padding:"60px 5% 40px",borderTop:`1px solid rgba(0,240,255,0.12)`,overflow:"hidden"}}>
      <GridBG opacity={0.03}/>
      <div style={{maxWidth:1280,margin:"0 auto",display:"flex",flexWrap:"wrap",gap:40,justifyContent:"space-between",position:"relative",zIndex:1}}>
        <div style={{maxWidth:340}}>
          <h3 style={{fontFamily:"Manrope, sans-serif",fontWeight:800,fontSize:"clamp(24px,3vw,34px)",letterSpacing:"-0.02em",margin:"0 0 20px",color:TEXT,lineHeight:1.2}}>
            Será un placer trabajar contigo.
          </h3>
          <PillButton variant="outline" onClick={()=>document.getElementById("contacto")?.scrollIntoView({behavior:"smooth"})}>Empezar ahora</PillButton>
        </div>

        <div>
          <h4 style={{fontFamily:"Manrope, sans-serif",fontWeight:800,fontSize:14,margin:"0 0 14px",color:TEXT}}>Ubicación</h4>
          <p style={{fontFamily:"Inter, sans-serif",fontSize:13,color:GRAY,lineHeight:1.7,margin:0}}>Monterrey, N.L. México —<br/>trabajamos en remoto</p>
          <h4 style={{fontFamily:"Manrope, sans-serif",fontWeight:800,fontSize:14,margin:"24px 0 14px",color:TEXT}}>Social</h4>
          <div style={{display:"flex",flexDirection:"column",gap:6}}>
            {["LinkedIn","X / Twitter"].map(s=>(
              <a key={s} href="#" style={{fontFamily:"Inter, sans-serif",fontSize:13,color:GRAY,textDecoration:"none",transition:"color 0.2s"}}
                onMouseEnter={e=>e.target.style.color=CYAN} onMouseLeave={e=>e.target.style.color=GRAY}>{s}</a>
            ))}
          </div>
        </div>

        <div>
          <h4 style={{fontFamily:"Manrope, sans-serif",fontWeight:800,fontSize:14,margin:"0 0 14px",color:TEXT}}>Contacto</h4>
          <p style={{fontFamily:"Inter, sans-serif",fontSize:13,color:GRAY,lineHeight:1.9,margin:0}}>
            hola@tiey.cc
          </p>
          <h4 style={{fontFamily:"Manrope, sans-serif",fontWeight:800,fontSize:14,margin:"24px 0 14px",color:TEXT}}>Enlaces</h4>
          <div style={{display:"flex",gap:24}}>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {[{label:"Servicios",id:"servicios"},{label:"Metodología",id:"metodología"}].map(({label,id})=>(
                <button key={id} onClick={()=>document.getElementById(id)?.scrollIntoView({behavior:"smooth"})}
                  style={{fontFamily:"Inter, sans-serif",fontSize:13,color:GRAY,background:"none",border:"none",padding:0,cursor:"pointer",textAlign:"left",transition:"color 0.2s"}}
                  onMouseEnter={e=>e.target.style.color=CYAN} onMouseLeave={e=>e.target.style.color=GRAY}>{label}</button>
              ))}
            </div>
            <div style={{display:"flex",flexDirection:"column",gap:6}}>
              {[{label:"Casos",id:"casos"},{label:"Nosotros",id:"sobre"}].map(({label,id})=>(
                <button key={id} onClick={()=>document.getElementById(id)?.scrollIntoView({behavior:"smooth"})}
                  style={{fontFamily:"Inter, sans-serif",fontSize:13,color:GRAY,background:"none",border:"none",padding:0,cursor:"pointer",textAlign:"left",transition:"color 0.2s"}}
                  onMouseEnter={e=>e.target.style.color=CYAN} onMouseLeave={e=>e.target.style.color=GRAY}>{label}</button>
              ))}
            </div>
          </div>
        </div>
      </div>
      <div style={{maxWidth:1280,margin:"40px auto 0",fontFamily:"'Courier New', monospace",fontSize:12,color:"rgba(234,241,255,0.3)",position:"relative",zIndex:1}}>
        © 2025 Tiey — Búsqueda de talento tech &amp; digital
      </div>
    </footer>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  // SEO (title, meta tags, OG, JSON-LD) vive en index.html — server-side,
  // visible para crawlers sin esperar a que cargue React.

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Manrope:wght@500;700;800&family=Inter:wght@400;500;600;700&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background:${DEEP}; }
        ::selection { background:${CYAN}; color:${DEEP}; }
        @media (max-width:1100px) {
          .desk-nav, .desk-cta { display:none !important; }
          .burger-btn { display:flex !important; }
        }
        @media (max-width:900px) {
          .hero-grid { grid-template-columns:1fr !important; min-height:auto !important; padding-top:20px; gap:60px !important; }
          .hero-globe-col { order:-1; }
          .sobre-grid, .sobre-stats { grid-template-columns:1fr !important; }
          .contacto-grid { grid-template-columns:1fr !important; }
          .precio-inner { grid-template-columns:1fr !important; text-align:center; }
          .precio-cta { display:flex; justify-content:center; margin-top:16px; }
          .contacto-card { margin:32px auto 0 !important; }
          .contacto-wordmark { display:none; }
          .servicios-grid { grid-template-columns:1fr 1fr !important; }
          .metodo-grid { grid-template-columns:1fr 1fr !important; }
        }
        @media (max-width:560px) {
          .servicios-grid { grid-template-columns:1fr !important; }
          .metodo-grid { grid-template-columns:1fr !important; }
          .hero-globe-col canvas { width:100% !important; height:auto !important; }
          .testi-divider { display:none !important; }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration:0.01ms !important; transition-duration:0.01ms !important; }
        }
      `}</style>
      <Nav />
      <main>
        <Hero />
        <Servicios />
        <Metodologia />
        <Casos />
        <Sobre />
        <Precios />
        <Contacto />
      </main>
      <Footer />
    </>
  );
}
