import { useState, useEffect, useRef } from "react";
import { motion, useInView, AnimatePresence } from "framer-motion";

// ── Paleta — Editorial boutique ───────────────────────────────────────────────
const CREAM   = "#FAF8F5";   // fondo base — casi blanco cálido
const CREAM2  = "#F2EDE6";   // beige muy sutil para secciones alternas
const INK     = "#1C1C1C";   // casi negro — texto principal y secciones oscuras
const INK2    = "#2E2E2E";   // gris muy oscuro — cards oscuras
const CRIMSON = "#C8102E";   // acento carmesí — único color de énfasis
const SAND    = "#A89880";   // gris arena — texto secundario sobre crema
const MIST    = "rgba(28,28,28,0.45)";  // texto tenue sobre crema
const WHITE   = "#FFFFFF";

// ── Helpers ───────────────────────────────────────────────────────────────────
function useFadeUp(delay=0) {
  const ref = useRef(null);
  const inView = useInView(ref, { once:true, margin:"-60px" });
  return { ref,
    initial:{ opacity:0, y:24 },
    animate: inView ? { opacity:1, y:0 } : { opacity:0, y:24 },
    transition:{ duration:0.75, ease:[0.22,1,0.36,1], delay }
  };
}

// Ciclo de palabras — display serif con transición suave
function TextCycle({ words, interval=2600, onWordChange }) {
  const [idx, setIdx] = useState(0);
  useEffect(()=>{
    const t=setInterval(()=>setIdx(i=>{
      const next=(i+1)%words.length;
      onWordChange && onWordChange(words[next]);
      return next;
    }),interval);
    return()=>clearInterval(t);
  },[]);
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.span key={idx}
        initial={{ opacity:0, y:16, filter:"blur(6px)" }}
        animate={{ opacity:1, y:0,  filter:"blur(0px)" }}
        exit={{    opacity:0, y:-16, filter:"blur(6px)" }}
        transition={{ duration:0.45, ease:[0.22,1,0.36,1] }}
        style={{ display:"inline-block", color:CRIMSON, fontStyle:"italic" }}>
        {words[idx]}
      </motion.span>
    </AnimatePresence>
  );
}

// Número de línea marginal — signature element tipográfico
const LineNo = ({ n, light=false }) => (
  <span style={{
    fontFamily:"'Courier New', monospace",
    fontSize:10, letterSpacing:"0.12em",
    color: light ? "rgba(255,255,255,0.2)" : "rgba(28,28,28,0.18)",
    userSelect:"none", display:"block",
    marginBottom:8,
  }}>
    {String(n).padStart(2,"0")} ——
  </span>
);

// Divider horizontal fino
const Rule = ({ light=false, style={} }) => (
  <div style={{ height:1, background: light ? "rgba(255,255,255,0.12)" : "rgba(28,28,28,0.12)", ...style }}/>
);

// Botón — dos variantes: primario (crimson sólido) y secundario (outline sobre crema/ink)
function Btn({ children, variant="primary", onClick, style={} }) {
  const [hov, setHov] = useState(false);
  const base = {
    display:"inline-flex", alignItems:"center", gap:12,
    fontFamily:"Inter, sans-serif", fontWeight:600, fontSize:12,
    letterSpacing:"0.12em", textTransform:"uppercase",
    cursor:"pointer", border:"none", transition:"all 0.22s ease",
    padding:"14px 32px", ...style,
  };
  if (variant==="primary") return (
    <button onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} onClick={onClick}
      style={{...base, background:hov?"#a00d24":CRIMSON, color:WHITE,
        boxShadow: hov?"0 6px 28px rgba(200,16,46,0.35)":"0 3px 16px rgba(200,16,46,0.2)"}}>
      {children}
      <span style={{fontSize:16,lineHeight:1}}>→</span>
    </button>
  );
  if (variant==="outline-dark") return (
    <button onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} onClick={onClick}
      style={{...base, background:hov?"rgba(240,235,225,0.08)":"transparent",
        color:CREAM, border:`1px solid rgba(240,235,225,${hov?"0.5":"0.22"})`}}>
      {children}
      <span style={{fontSize:16,lineHeight:1}}>→</span>
    </button>
  );
  return (
    <button onMouseEnter={()=>setHov(true)} onMouseLeave={()=>setHov(false)} onClick={onClick}
      style={{...base, background:"transparent",
        color: hov?CRIMSON:INK, border:`1px solid ${hov?CRIMSON:"rgba(28,28,28,0.28)"}`,
        boxShadow: hov?"inset 0 0 0 1px "+CRIMSON:"none"}}>
      {children}
      <span style={{fontSize:16,lineHeight:1}}>→</span>
    </button>
  );
}

// ── GeometricSphere — wireframe sphere con parallax de mouse + scroll ────────
// Port de 21st.dev "Geometric Sphere", paleta editorial crema/carmesí
// ── ProfileGallery — galería de perfiles 3D sincronizada con TextCycle ────────
const PROFILE_IMAGES = [
  { src:"/p1.jpg",  role:"CTO" },
  { src:"/p2.jpg",  role:"líder tech" },
  { src:"/p3.jpg",  role:"VP Engineering" },
  { src:"/p4.jpg",  role:"Head of Product" },
  { src:"/p5.jpg",  role:"arquitecto cloud" },
  { src:"/p6.jpg",  role:"líder de datos" },
  { src:"/p7.jpg",  role:"CTO" },
  { src:"/p8.jpg",  role:"líder tech" },
  { src:"/p9.jpg",  role:"VP Engineering" },
  { src:"/p10.jpg", role:"Head of Product" },
  { src:"/p11.jpg", role:"arquitecto cloud" },
  { src:"/p12.jpg", role:"líder de datos" },
];

function ProfileGallery({ activeRole }) {
  const [cards, setCards] = useState(() =>
    Array.from({ length: 6 }, (_, i) => ({
      id: i,
      imgIdx: i % PROFILE_IMAGES.length,
      z: -i * 200,
      x: [20, -30, 40, -20, 10, -40][i] || 0,
      y: [-10, 20, -30, 10, -20, 30][i] || 0,
    }))
  );
  const rafRef = useRef(null);
  const cardsRef = useRef(cards);
  cardsRef.current = cards;

  useEffect(() => {
    const SPEED = 0.8;
    const Z_RANGE = 1200;
    const tick = () => {
      setCards(prev => prev.map(c => {
        let newZ = c.z + SPEED;
        let imgIdx = c.imgIdx;
        if (newZ > 300) { newZ -= Z_RANGE; imgIdx = (imgIdx + 1) % PROFILE_IMAGES.length; }
        return { ...c, z: newZ, imgIdx };
      }));
      rafRef.current = requestAnimationFrame(tick);
    };
    rafRef.current = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafRef.current);
  }, []);

  return (
    <div className="hero-gallery" style={{
      position:"absolute", right:0, top:0, bottom:0, width:"55%",
      perspective:"900px", perspectiveOrigin:"50% 50%",
      overflow:"hidden", pointerEvents:"none", zIndex:1,
    }}>
      {/* Vignette izquierda para blend con el texto */}
      <div style={{
        position:"absolute", left:0, top:0, bottom:0, width:"40%",
        background:"linear-gradient(to right, rgba(28,28,28,1) 0%, transparent 100%)",
        zIndex:10, pointerEvents:"none",
      }}/>
      {/* Vignette top/bottom */}
      <div style={{
        position:"absolute", inset:0,
        background:"linear-gradient(to bottom, rgba(28,28,28,0.7) 0%, transparent 25%, transparent 75%, rgba(28,28,28,0.7) 100%)",
        zIndex:10, pointerEvents:"none",
      }}/>
      {cards.map(card => {
        const z = card.z;
        const rawT = (z + 1200) / 1400;
        const fadeIn  = Math.min(1, rawT * 3);
        const fadeOut = z > 100 ? Math.max(0, 1 - (z - 100) / 200) : 1;
        const opacity = Math.max(0, Math.min(0.9, fadeIn * fadeOut));
        const blur    = Math.max(0, (0.5 - rawT) * 12);
        const img     = PROFILE_IMAGES[card.imgIdx];
        const isActive = img.role === activeRole;
        return (
          <div key={card.id} style={{
            position:"absolute",
            left:"50%", top:"50%",
            width:180, height:220,
            transform:`translate(-50%,-50%) translate3d(${card.x}px,${card.y}px,${z}px)`,
            opacity,
            filter:`blur(${blur}px)`,
            outline: isActive ? `2px solid ${CRIMSON}` : "none",
            outlineOffset:2,
            overflow:"hidden",
            zIndex: Math.round(z + 1200),
          }}>
            <img src={img.src} alt={img.role} style={{
              width:"100%", height:"100%", objectFit:"cover", display:"block",
              filter: isActive ? "none" : "grayscale(0.5) brightness(0.7)",
              transition:"filter 0.5s ease",
            }} onError={e=>e.target.style.display="none"}/>
            <div style={{
              position:"absolute", bottom:0, left:0, right:0,
              background:"linear-gradient(to top, rgba(28,28,28,0.85), transparent)",
              padding:"24px 10px 8px",
            }}/>
            {isActive && (
              <span style={{
                position:"absolute", bottom:8, left:10,
                fontFamily:"Inter, sans-serif", fontSize:9, fontWeight:700,
                letterSpacing:"0.14em", textTransform:"uppercase",
                color:"rgba(255,255,255,0.9)",
              }}>{img.role}</span>
            )}
          </div>
        );
      })}
    </div>
  );
}

// ── InteractiveDots — canvas de puntos reactivos al cursor (Nexus Hero port) ──
// Los puntos se iluminan y crecen cuando el mouse pasa cerca
function InteractiveDots() {
  const canvasRef = useRef(null);
  const dotsRef = useRef([]);
  const mouseRef = useRef({ x: null, y: null });
  const rafRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    const DOT_SPACING = 28;
    const BASE_R = 1.2;
    const INTERACTION_R = 130;
    const OPACITY_BASE_MIN = 0.18;
    const OPACITY_BASE_MAX = 0.32;

    const resize = () => {
      const parent = canvas.parentElement;
      canvas.width  = parent.clientWidth;
      canvas.height = parent.clientHeight;
      buildDots();
    };

    const buildDots = () => {
      const dots = [];
      const cols = Math.ceil(canvas.width  / DOT_SPACING);
      const rows = Math.ceil(canvas.height / DOT_SPACING);
      for (let i = 0; i < cols; i++) {
        for (let j = 0; j < rows; j++) {
          const base = OPACITY_BASE_MIN + Math.random() * (OPACITY_BASE_MAX - OPACITY_BASE_MIN);
          dots.push({
            x: i * DOT_SPACING + DOT_SPACING / 2,
            y: j * DOT_SPACING + DOT_SPACING / 2,
            opacity: base,
            target:  base,
            speed:   0.002 + Math.random() * 0.004,
            dir:     1,
          });
        }
      }
      dotsRef.current = dots;
    };

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      const { x: mx, y: my } = mouseRef.current;

      dotsRef.current.forEach(d => {
        // gentle breathing
        d.opacity += d.speed * d.dir;
        if (d.opacity >= d.target || d.opacity <= OPACITY_BASE_MIN) {
          d.dir *= -1;
          d.target = OPACITY_BASE_MIN + Math.random() * (OPACITY_BASE_MAX - OPACITY_BASE_MIN);
        }

        let factor = 0;
        let r = BASE_R;
        if (mx !== null) {
          const dx = d.x - mx, dy = d.y - my;
          const dist = Math.sqrt(dx*dx + dy*dy);
          if (dist < INTERACTION_R) {
            factor = Math.pow(1 - dist / INTERACTION_R, 2);
            r = BASE_R + factor * 3.5;
          }
        }

        const finalOpacity = Math.min(1, d.opacity + factor * 0.65);
        // Dots en crema/crimson según intensidad
        const cr = Math.round(200 * factor + 28 * (1 - factor));
        const cg = Math.round(16  * factor + 28 * (1 - factor));
        const cb = Math.round(46  * factor + 28 * (1 - factor));

        ctx.beginPath();
        ctx.fillStyle = `rgba(${cr},${cg},${cb},${finalOpacity.toFixed(3)})`;
        ctx.arc(d.x, d.y, r, 0, Math.PI * 2);
        ctx.fill();
      });

      rafRef.current = requestAnimationFrame(draw);
    };

    resize();
    window.addEventListener('resize', resize);
    rafRef.current = requestAnimationFrame(draw);

    const onMove = e => {
      const rect = canvas.getBoundingClientRect();
      mouseRef.current = { x: e.clientX - rect.left, y: e.clientY - rect.top };
    };
    const onLeave = () => { mouseRef.current = { x: null, y: null }; };
    document.addEventListener('mousemove', onMove, { passive: true });
    document.addEventListener('mouseleave', onLeave);

    return () => {
      window.removeEventListener('resize', resize);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseleave', onLeave);
      cancelAnimationFrame(rafRef.current);
    };
  }, []);

  return (
    <canvas ref={canvasRef} style={{
      position:"absolute", inset:0, width:"100%", height:"100%",
      pointerEvents:"none", zIndex:0,
    }}/>
  );
}


// ── WordReveal — stagger reveal por palabras al entrar en viewport ───────────
function WordReveal({ children, delay=0, style={} }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setVisible(true); obs.disconnect(); } },
      { threshold: 0.25 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  // Split children string into words, keep JSX nodes as-is
  const parts = typeof children === 'string'
    ? children.split(' ').map((w, i) => (
        <span key={i} style={{
          display:"inline-block",
          opacity: visible ? 1 : 0,
          transform: visible ? "translateY(0)" : "translateY(18px)",
          filter: visible ? "blur(0px)" : "blur(5px)",
          transition: visible
            ? `opacity 0.5s ease ${delay + i*0.08}s, transform 0.5s ease ${delay + i*0.08}s, filter 0.5s ease ${delay + i*0.08}s`
            : "none",
          marginRight:"0.28em",
        }}>{w}</span>
      ))
    : children;

  return (
    <span ref={ref} style={{display:"block", ...style}}>
      {parts}
    </span>
  );
}

// ── Nav ───────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(null);
  useEffect(()=>{ const fn=()=>setScrolled(window.scrollY>40); window.addEventListener("scroll",fn); return()=>window.removeEventListener("scroll",fn); },[]);

  const links = [
    {label:"Servicios",id:"servicios"},
    {label:"Proceso",id:"metodología"},
    {label:"Casos",id:"casos"},
    {label:"FAQ",id:"faq"},
    {label:"Nosotros",id:"sobre"},
  ];
  const go = id => {
    setActive(id);
    document.getElementById(id)?.scrollIntoView({behavior:"smooth"});
    setOpen(false);
  };

  return (
    <nav style={{
      position:"fixed", top:0, left:0, right:0, zIndex:200, height:64,
      background: scrolled ? "rgba(250,248,245,0.96)" : "transparent",
      backdropFilter: scrolled ? "blur(12px)" : "none",
      borderBottom: scrolled ? `1px solid rgba(28,28,28,0.08)` : "none",
      transition:"all 0.3s ease",
      display:"flex", alignItems:"center", justifyContent:"space-between",
      padding:"0 5%",
    }}>
      <button onClick={()=>window.scrollTo({top:0,behavior:"smooth"})}
        style={{background:"none",border:"none",cursor:"pointer",padding:0}}>
        <span style={{fontFamily:"'Playfair Display', serif",fontSize:22,fontWeight:700,
          color: scrolled ? INK : CREAM,
          letterSpacing:"0.02em", transition:"color 0.3s ease"}}>
          Tiey<span style={{color:CRIMSON}}>.</span>
        </span>
      </button>

      <div style={{display:"flex",gap:4,alignItems:"center"}} className="desk-nav">
        {links.map(({label,id})=>{
          const isActive = active === id;
          return (
            <button key={id} onClick={()=>go(id)}
              style={{
                position:"relative",
                background:"none", border:"none",
                color: isActive ? (scrolled ? INK : CREAM) : (scrolled ? SAND : 'rgba(250,248,245,0.6)'),
                fontSize:11,
                fontFamily:"Inter, sans-serif", fontWeight:600,
                letterSpacing:"0.1em", textTransform:"uppercase",
                cursor:"pointer", transition:"color 0.2s",
                padding:"8px 14px", borderRadius:9999,
              }}
              onMouseEnter={e=>{ if(!isActive) e.currentTarget.style.color=CRIMSON; }}
              onMouseLeave={e=>{ if(!isActive) e.currentTarget.style.color=SAND; }}
            >
              {label}

              {/* Tubelight effect — solo en el item activo */}
              {isActive && (
                <motion.div
                  layoutId="tubelight"
                  style={{
                    position:"absolute", inset:0, borderRadius:9999,
                    background:"rgba(28,28,28,0.06)",
                    zIndex:-1,
                  }}
                  initial={false}
                  transition={{ type:"spring", stiffness:300, damping:30 }}
                >
                  {/* Barra de luz superior */}
                  <div style={{
                    position:"absolute",
                    top:-1, left:"50%", transform:"translateX(-50%)",
                    width:32, height:3,
                    background:CRIMSON,
                    borderRadius:"0 0 4px 4px",
                  }}>
                    {/* Bloom exterior */}
                    <div style={{
                      position:"absolute",
                      width:52, height:14,
                      background:`rgba(200,16,46,0.2)`,
                      borderRadius:"50%", filter:"blur(6px)",
                      top:-4, left:-10, pointerEvents:"none",
                    }}/>
                    {/* Bloom medio */}
                    <div style={{
                      position:"absolute",
                      width:32, height:10,
                      background:`rgba(200,16,46,0.25)`,
                      borderRadius:"50%", filter:"blur(4px)",
                      top:-2, left:0, pointerEvents:"none",
                    }}/>
                    {/* Hot spot */}
                    <div style={{
                      position:"absolute",
                      width:14, height:6,
                      background:`rgba(200,16,46,0.45)`,
                      borderRadius:"50%", filter:"blur(2px)",
                      top:0, left:9, pointerEvents:"none",
                    }}/>
                  </div>
                </motion.div>
              )}
            </button>
          );
        })}
        <Btn variant="primary" onClick={()=>go("contacto")} style={{padding:"10px 24px",fontSize:11}}>
          Contacto
        </Btn>
      </div>

      <button onClick={()=>setOpen(!open)} className="burger-btn"
        style={{display:"none",background:"none",border:`1px solid rgba(28,28,28,0.2)`,
          width:40,height:40,cursor:"pointer",alignItems:"center",justifyContent:"center",
          flexDirection:"column",gap:5,padding:8}}>
        {[0,1,2].map(i=><span key={i} style={{display:"block",width:18,height:1.5,background:INK}}/>)}
      </button>

      <AnimatePresence>
        {open && (
          <motion.div initial={{opacity:0,y:-8}} animate={{opacity:1,y:0}} exit={{opacity:0,y:-8}}
            style={{position:"absolute",top:64,left:0,right:0,background:"rgba(250,248,245,0.98)",
              backdropFilter:"blur(12px)",padding:"20px 5% 28px",display:"flex",flexDirection:"column",
              gap:4,borderBottom:`1px solid rgba(28,28,28,0.08)`}}>
            {links.map(({label,id})=>(
              <button key={id} onClick={()=>go(id)} style={{background:"none",border:"none",
                color:INK,fontSize:16,fontWeight:500,fontFamily:"Inter, sans-serif",
                cursor:"pointer",textAlign:"left",padding:"12px 0",borderBottom:`1px solid rgba(28,28,28,0.06)`}}>
                {label}
              </button>
            ))}
            <div style={{marginTop:16}}>
              <Btn variant="primary" onClick={()=>go("contacto")}>Contacto</Btn>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

// ── Hero — oscuro, headline tipo manifesto ────────────────────────────────────
function Hero() {
  const [activeRole, setActiveRole] = useState("CTO");
  return (
    <section id="hero" style={{
      background:INK, minHeight:"100vh", position:"relative",
      display:"flex", flexDirection:"column", justifyContent:"flex-end",
      padding:"0 5% 72px", overflow:"hidden",
    }}>
      <ProfileGallery activeRole={activeRole} />
      <InteractiveDots />
      {/* Textura de fondo — gradiente sutil */}
      <div style={{
        position:"absolute", inset:0,
        background:`radial-gradient(ellipse 80% 60% at 20% 70%, rgba(200,16,46,0.07) 0%, transparent 60%),
                   radial-gradient(ellipse 60% 50% at 80% 30%, rgba(200,16,46,0.04) 0%, transparent 60%)`,
        pointerEvents:"none",
      }}/>

      {/* Número de línea vertical — signature element */}
      <div style={{
        position:"absolute", left:"5%", top:"50%", transform:"translateY(-50%) rotate(-90deg)",
        transformOrigin:"center center",
        fontFamily:"'Courier New', monospace", fontSize:9, letterSpacing:"0.25em",
        color:"rgba(255,255,255,0.12)", whiteSpace:"nowrap", pointerEvents:"none",
      }}>
        TIEY · BÚSQUEDA DE TALENTO TECH & DIGITAL · MONTERREY, N.L.
      </div>

      <div style={{maxWidth:1280,margin:"0 auto",width:"100%",position:"relative",zIndex:1}}>
        <Rule light style={{marginBottom:48}}/>

        <motion.h1 initial={{opacity:0,y:32}} animate={{opacity:1,y:0}} transition={{duration:0.8,ease:[0.22,1,0.36,1]}}
          style={{
            fontFamily:"'Playfair Display', serif",
            fontWeight:700,
            fontSize:"clamp(44px, 7.5vw, 108px)",
            lineHeight:0.95, letterSpacing:"-0.02em",
            color:WHITE, margin:"0 0 48px",
            maxWidth:"90%",
          }}>
          Encuentra tu<br/>
          próximo{" "}
          <TextCycle words={["CTO","líder tech","VP Engineering","Head of Product","arquitecto cloud","líder de datos"]} onWordChange={setActiveRole}/>
        </motion.h1>

        <Rule light style={{marginBottom:48}}/>

        <div style={{display:"grid",gridTemplateColumns:"1fr 1fr",gap:40,alignItems:"end"}} className="hero-bottom">
          <motion.p initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.8,delay:0.5}}
            style={{fontFamily:"Inter, sans-serif",fontSize:16,lineHeight:1.8,color:"rgba(255,255,255,0.55)",margin:0,maxWidth:460}}>
            Somos una firma boutique de búsqueda de talento tech y digital.
            Proceso a medida, sin atajos, con garantía de 3 meses.
          </motion.p>
          <motion.div initial={{opacity:0}} animate={{opacity:1}} transition={{duration:0.8,delay:0.7}}
            style={{display:"flex",gap:16,justifyContent:"flex-end",flexWrap:"wrap"}}>
            <Btn variant="primary" onClick={()=>document.getElementById("contacto")?.scrollIntoView({behavior:"smooth"})}>
              Cuéntanos tu búsqueda
            </Btn>
            <Btn variant="outline-dark" onClick={()=>document.getElementById("servicios")?.scrollIntoView({behavior:"smooth"})}>
              Cómo trabajamos
            </Btn>
          </motion.div>
        </div>


      </div>
    </section>
  );
}

// ── Servicios ─────────────────────────────────────────────────────────────────
const SERVICES = [
  { n:1, title:"Perfiles tech y digitales", desc:"Product Managers, Engineers, Diseñadores UX/UI, Data Engineers, DevOps. Talento que entiende negocio y tecnología a la vez." },
  { n:2, title:"Mandos medios multisector", desc:"Finance Managers, Operaciones, Ventas, HR y Marketing. Los perfiles de mando medio más demandados, dentro y fuera del mundo tech." },
  { n:3, title:"Employer branding", desc:"Te ayudamos a articular por qué un gran perfil debería elegirte. Propuesta de valor honesta y diferenciada para atraer talento." },
  { n:4, title:"IA Recruiting", desc:"Agentes de IA para procesos de contratación operativa de alto volumen — filtrado, agenda y seguimiento automatizado.", soon:true },
];

function Servicios() {
  const fade = useFadeUp();
  const [activeIdx, setActiveIdx] = useState(0);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 900);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  return (
    <section id="servicios" style={{background:CREAM, padding:"112px 5%"}}>
      <div style={{maxWidth:1280, margin:"0 auto"}}>

        {/* Heading */}
        <motion.div {...fade} style={{
          display:"grid", gridTemplateColumns:"1fr 2fr", gap:64,
          alignItems:"start", marginBottom:56,
        }} className="sobre-grid">
          <div>
            <LineNo n={1}/>
            <h2 style={{fontFamily:"'Playfair Display', serif", fontWeight:700,
              fontSize:"clamp(32px,3.5vw,52px)", color:INK, margin:0,
              lineHeight:1.15, letterSpacing:"-0.01em"}}>
              <WordReveal>Donde marcamos</WordReveal>
              <WordReveal delay={0.15}>la diferencia</WordReveal>
            </h2>
          </div>
          <p style={{fontFamily:"Inter, sans-serif", fontSize:15, lineHeight:1.85,
            color:MIST, margin:0, alignSelf:"end"}}>
            No somos generalistas. Nos especializamos en Tech, Digital y mandos
            medios con criterio — para que cada búsqueda cuente.
          </p>
        </motion.div>

        {/* Desktop: accordion horizontal */}
        {!isMobile && (
          <div style={{display:"flex", flexDirection:"row", gap:10, height:420, overflow:"hidden"}}>
            {SERVICES.map((s,i) => {
              const isActive = i === activeIdx;
              return (
                <div key={s.n} onMouseEnter={()=>setActiveIdx(i)}
                  style={{
                    position:"relative", height:"100%", overflow:"hidden",
                    cursor:"pointer", flexShrink:0,
                    width: isActive ? "55%" : "56px",
                    transition:"width 0.65s cubic-bezier(0.22,1,0.36,1)",
                    background:INK, border:"none", minHeight:64,
                  }}>
                  <div style={{
                    position:"absolute", inset:0,
                    background: isActive
                      ? "linear-gradient(160deg, rgba(200,16,46,0.08) 0%, rgba(28,28,28,0) 60%)"
                      : "transparent",
                    transition:"background 0.5s ease",
                  }}/>
                  <span style={{
                    position:"absolute", top:20, left:20,
                    fontFamily:"'Courier New', monospace", fontSize:10,
                    letterSpacing:"0.15em",
                    color: isActive ? CRIMSON : "rgba(255,255,255,0.2)",
                    transition:"color 0.4s ease",
                  }}>0{s.n}</span>
                  <div style={{
                    position:"absolute", left:0, top:0, bottom:0,
                    width: isActive ? 3 : 0, background:CRIMSON,
                    transition:"width 0.4s ease",
                  }}/>
                  <div style={{
                    position:"absolute", bottom:24, left:0, right:0,
                    display:"flex", flexDirection:"column",
                    alignItems: isActive ? "flex-start" : "center",
                    justifyContent:"center",
                    padding: isActive ? "0 24px" : "0",
                    transition:"padding 0.4s ease",
                  }}>
                    <h3 style={{
                      fontFamily:"'Playfair Display', serif", fontWeight:700,
                      fontSize: isActive ? "clamp(17px,1.8vw,22px)" : 13,
                      color:WHITE, margin:"0 0 8px", lineHeight:1.2,
                      whiteSpace: isActive ? "normal" : "nowrap",
                      writingMode: isActive ? "horizontal-tb" : "vertical-rl",
                      transform: isActive ? "none" : "rotate(180deg)",
                      transition:"all 0.4s ease",
                      opacity: isActive ? 1 : 0.7,
                    }}>
                      {s.title}
                      {s.soon && isActive && (
                        <span style={{display:"inline-block", marginLeft:10,
                          fontFamily:"Inter, sans-serif", fontSize:9, fontWeight:700,
                          letterSpacing:"0.14em", textTransform:"uppercase",
                          color:CRIMSON, verticalAlign:"middle",
                          border:`1px solid ${CRIMSON}`, padding:"2px 7px"}}>
                          Próximamente
                        </span>
                      )}
                    </h3>
                    <div style={{
                      overflow:"hidden",
                      maxHeight: isActive ? 80 : 0,
                      opacity: isActive ? 1 : 0,
                      transition:"max-height 0.5s ease, opacity 0.4s ease",
                    }}>
                      <p style={{fontFamily:"Inter, sans-serif", fontSize:13,
                        lineHeight:1.7, color:"rgba(255,255,255,0.55)", margin:0}}>
                        {s.desc}
                      </p>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Mobile: lista simple limpia */}
        {isMobile && (
          <div style={{display:"flex", flexDirection:"column", gap:0}}>
            <Rule/>
            {SERVICES.map((s,i) => (
              <div key={s.n}>
                <div style={{
                  display:"grid", gridTemplateColumns:"40px 1fr",
                  gap:16, padding:"24px 0", alignItems:"start",
                }}>
                  <span style={{fontFamily:"'Courier New', monospace",
                    fontSize:10, color:"rgba(28,28,28,0.25)",
                    letterSpacing:"0.1em", paddingTop:4}}>
                    0{s.n}
                  </span>
                  <div>
                    <h3 style={{fontFamily:"'Playfair Display', serif",
                      fontWeight:700, fontSize:"clamp(18px,5vw,24px)",
                      color:INK, margin:"0 0 8px", lineHeight:1.2}}>
                      {s.title}
                      {s.soon && (
                        <span style={{display:"inline-block", marginLeft:8,
                          fontFamily:"Inter, sans-serif", fontSize:9,
                          fontWeight:700, letterSpacing:"0.12em",
                          textTransform:"uppercase", color:CRIMSON,
                          verticalAlign:"middle", border:`1px solid ${CRIMSON}`,
                          padding:"2px 6px"}}>
                          Próximamente
                        </span>
                      )}
                    </h3>
                    <p style={{fontFamily:"Inter, sans-serif", fontSize:13,
                      lineHeight:1.75, color:MIST, margin:0}}>
                      {s.desc}
                    </p>
                  </div>
                </div>
                <Rule/>
              </div>
            ))}
          </div>
        )}

      </div>
    </section>
  );
}
// ── Metodología ───────────────────────────────────────────────────────────────
const STEPS = [
  { n:"01", tag:"Semana 1",   title:"Briefing profundo",     desc:"Sesión a fondo para entender el rol, el equipo y la cultura — qué hace que alguien encaje de verdad, más allá del puesto." },
  { n:"02", tag:"Sem. 1–2",   title:"Mapa de talento",       desc:"Activamos nuestra red y mapeamos el mercado pasivo: perfiles que no buscan activamente pero cambiarían por la oportunidad correcta." },
  { n:"03", tag:"Sem. 2–3",   title:"Entrevistas",           desc:"Entrevistas estructuradas para validar experiencia técnica, soft skills y fit cultural. Filtramos antes de mostrarte nada." },
  { n:"04", tag:"Sem. 3–4",   title:"Shortlist",             desc:"3 a 5 perfiles con resumen claro de fortalezas, motivaciones y por qué encajan en tu contexto específico." },
  { n:"05", tag:"Sem. 4–6",   title:"Acompañamiento",        desc:"Coordinamos entrevistas, damos feedback y acompañamos la negociación hasta firmar. No paramos hasta que el candidato empieza." },
  { n:"06", tag:"Garantía",   title:"3 meses de cobertura",  desc:"Si algo no funciona en los primeros 3 meses por causas del proceso, repetimos la búsqueda sin coste adicional." },
];

function Metodologia() {
  const fade = useFadeUp();
  return (
    <section id="metodología" style={{background:INK,padding:"112px 5%",position:"relative",overflow:"hidden"}}>
      <div style={{maxWidth:1280,margin:"0 auto",position:"relative",zIndex:1}}>
        <motion.div {...fade} style={{marginBottom:64}}>
          <LineNo n={2} light/>
          <h2 style={{fontFamily:"'Playfair Display', serif",fontWeight:700,fontSize:"clamp(32px,4vw,52px)",color:WHITE,margin:0,lineHeight:1.15,letterSpacing:"-0.01em"}}>
            <WordReveal style={{color:WHITE}}>Cómo trabajamos</WordReveal>
            <WordReveal delay={0.2} style={{color:CRIMSON, fontStyle:"italic"}}>por dentro</WordReveal>
          </h2>
        </motion.div>

        <Rule light/>

        <div style={{display:"grid",gridTemplateColumns:"repeat(auto-fit,minmax(280px,1fr))",gap:0}}>
          {STEPS.map((s,i)=>(
              <div key={s.n} style={{
                padding:"36px 28px",
                borderRight: i%3!==2 ? "1px solid rgba(255,255,255,0.07)" : "none",
                borderBottom:"1px solid rgba(255,255,255,0.07)",
              }}>
                <div style={{display:"flex",justifyContent:"space-between",alignItems:"flex-start",marginBottom:20}}>
                  <span style={{fontFamily:"'Courier New', monospace",fontSize:10,color:"rgba(255,255,255,0.25)",letterSpacing:"0.15em"}}>{s.n}</span>
                  <span style={{fontFamily:"Inter, sans-serif",fontSize:9,fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase",
                    color:i===1||i===5?CRIMSON:"rgba(255,255,255,0.25)",
                    border: i===1||i===5?`1px solid ${CRIMSON}`:"1px solid rgba(255,255,255,0.15)",
                    padding:"3px 8px"}}>{s.tag}</span>
                </div>
                <h3 style={{fontFamily:"'Playfair Display', serif",fontWeight:700,fontSize:20,color:WHITE,margin:"0 0 12px",lineHeight:1.2}}>{s.title}</h3>
                <p style={{fontFamily:"Inter, sans-serif",fontSize:13,lineHeight:1.75,color:"rgba(255,255,255,0.45)",margin:0}}>{s.desc}</p>
              </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── Casos / Testimonios ───────────────────────────────────────────────────────
const TESTIMONIALS = [
  { name:"Marta G.", role:"CTO · Fintech B2B", quote:"Nos ayudaron a encontrar a alguien que nadie hubiera encontrado en un portal. Entendieron perfectamente lo que necesitábamos.", colors:["#8B3A3A","#3A1A1A"] },
  { name:"Diego T.", role:"CEO · E-commerce Moda", quote:"Tres candidatos en el shortlist, los tres valían. Contratamos al primero y sigue con nosotros tres años después.", colors:["#5A3A2A","#2A1A0A"] },
  { name:"Lucía F.", role:"Head of People · SaaS HR", quote:"Hablas con quien va a hacer el trabajo, no con un comercial que delega. Eso se nota en el resultado.", colors:["#3A3A5A","#1A1A3A"] },
  { name:"Javier R.", role:"Director · Agencia Digital", quote:"Nos costaba mucho encontrar talento de diseño. Lo encontraron en tres semanas.", colors:["#3A5A3A","#1A3A1A"] },
  { name:"Sara M.", role:"VP Engineering · Insurtech", quote:"En seis semanas teníamos a nuestro Head of Data incorporado. Garantía cumplida.", colors:["#5A3A4A","#2A1A2A"] },
];
const getInitials = n => n.split(" ").map(w=>w[0]).join("").slice(0,2).toUpperCase();

function Casos() {
  const fade = useFadeUp();
  const [active, setActive] = useState(0);
  return (
    <section id="casos" style={{background:CREAM2,padding:"112px 5%"}}>
      <div style={{maxWidth:1280,margin:"0 auto"}}>
        <motion.div {...fade} style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:64,alignItems:"start",marginBottom:72}} className="sobre-grid">
          <div>
            <LineNo n={3}/>
            <h2 style={{fontFamily:"'Playfair Display', serif",fontWeight:700,fontSize:"clamp(32px,4vw,52px)",color:INK,margin:0,lineHeight:1.15,letterSpacing:"-0.01em"}}>
              <WordReveal>Empresas que</WordReveal>
              <WordReveal delay={0.15}>confían en nosotros</WordReveal>
            </h2>
          </div>
          <div style={{alignSelf:"end"}}>
            {/* Quote */}
            <div style={{position:"relative",minHeight:100,marginBottom:32}}>
              <AnimatePresence mode="wait">
                <motion.p key={active}
                  initial={{opacity:0,y:10,filter:"blur(4px)"}}
                  animate={{opacity:1,y:0,filter:"blur(0px)"}}
                  exit={{opacity:0,y:-10,filter:"blur(4px)"}}
                  transition={{duration:0.4,ease:[0.22,1,0.36,1]}}
                  style={{fontFamily:"'Playfair Display', serif",fontSize:"clamp(18px,2.4vw,28px)",lineHeight:1.5,color:INK,margin:0,fontStyle:"italic"}}>
                  "{TESTIMONIALS[active].quote}"
                </motion.p>
              </AnimatePresence>
            </div>
            {/* Avatars + info */}
            <div style={{display:"flex",alignItems:"center",gap:20,flexWrap:"wrap"}}>
              <div style={{display:"flex"}}>
                {TESTIMONIALS.map((t,i)=>(
                  <button key={i} onClick={()=>setActive(i)} style={{
                    width:40,height:40,borderRadius:"50%",border:"none",cursor:"pointer",
                    padding:0,marginLeft:i===0?0:-10,
                    zIndex:active===i?10:1,position:"relative",
                    transform:active===i?"scale(1.15)":"scale(1)",
                    outline:active===i?`2px solid ${CRIMSON}`:`2px solid ${CREAM2}`,
                    outlineOffset:0,
                    filter:active===i?"none":"grayscale(1) opacity(0.6)",
                    transition:"all 0.3s ease",
                    background:`linear-gradient(135deg,${t.colors[0]},${t.colors[1]})`,
                    display:"flex",alignItems:"center",justifyContent:"center",
                    fontFamily:"'Playfair Display', serif",fontWeight:700,fontSize:11,color:WHITE,
                  }}>
                    {getInitials(t.name)}
                  </button>
                ))}
              </div>
              <div style={{width:1,height:28,background:"rgba(28,28,28,0.15)"}} className="testi-divider"/>
              <div style={{position:"relative",minHeight:36,flex:1}}>
                <AnimatePresence mode="wait">
                  <motion.div key={active}
                    initial={{opacity:0,x:-8}} animate={{opacity:1,x:0}} exit={{opacity:0,x:8}}
                    transition={{duration:0.3}}>
                    <div style={{fontFamily:"'Playfair Display', serif",fontWeight:700,fontSize:15,color:INK}}>{TESTIMONIALS[active].name}</div>
                    <div style={{fontFamily:"Inter, sans-serif",fontSize:11,color:CRIMSON,marginTop:2,letterSpacing:"0.04em"}}>{TESTIMONIALS[active].role}</div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
const FAQS = [
  { q:"¿Cuánto cuesta el servicio?", a:"Nuestro fee es de 1 mes de sueldo bruto + IVA, pagado únicamente al contratar. Sin retainer, sin pagos parciales." },
  { q:"¿Cuánto tarda el proceso?", a:"Normalmente entre 4 y 6 semanas desde el briefing hasta la incorporación, con comunicación constante." },
  { q:"¿Qué pasa si el candidato no funciona?", a:"Garantía de 3 meses. Si la persona no encaja por causas del proceso, repetimos la búsqueda sin coste adicional." },
  { q:"¿Solo trabajáis con empresas tech?", a:"Nos especializamos en Tech y Digital, pero también cubrimos mandos medios en Finance, Ops, HR y Ventas." },
  { q:"¿Trabajáis solo en Monterrey?", a:"Monterrey es nuestra base, pero trabajamos con empresas en toda Latinoamérica y España. La mayoría de los procesos son remotos." },
  { q:"¿Cómo empezamos?", a:"Completa el formulario o escríbenos a hola@tiey.cc. En menos de 24h te decimos si podemos ayudarte." },
];

function FAQ() {
  const fade = useFadeUp();
  const [open, setOpen] = useState(null);
  return (
    <section id="faq" style={{background:CREAM,padding:"112px 5%"}}>
      <div style={{maxWidth:1280,margin:"0 auto"}}>
        <motion.div {...fade} style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:64,marginBottom:64}} className="sobre-grid">
          <div>
            <LineNo n={4}/>
            <h2 style={{fontFamily:"'Playfair Display', serif",fontWeight:700,fontSize:"clamp(32px,4vw,52px)",color:INK,margin:0,lineHeight:1.15}}>
              <WordReveal>Preguntas</WordReveal>
              <WordReveal delay={0.15} style={{color:CRIMSON, fontStyle:"italic"}}>frecuentes</WordReveal>
            </h2>
          </div>
        </motion.div>
        <div>
          {FAQS.map((f,i)=>{
            const isOpen = open===i;
            return (
              <div key={i}>
                <Rule/>
                <button onClick={()=>setOpen(isOpen?null:i)}
                  style={{width:"100%",display:"grid",gridTemplateColumns:"80px 1fr auto",gap:32,
                    padding:"28px 0",background:"none",border:"none",cursor:"pointer",alignItems:"center",textAlign:"left"}}
                  className="faq-row">
                  <span className="faq-num" style={{fontFamily:"'Courier New', monospace",fontSize:10,color:"rgba(28,28,28,0.22)",letterSpacing:"0.1em"}}>0{i+1}</span>
                  <span style={{fontFamily:"'Playfair Display', serif",fontWeight:600,fontSize:"clamp(16px,2vw,22px)",color:INK,lineHeight:1.3}}>{f.q}</span>
                  <span style={{color:isOpen?CRIMSON:SAND,fontSize:20,transition:"transform 0.3s,color 0.2s",
                    transform:isOpen?"rotate(45deg)":"none"}}>+</span>
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}}
                      transition={{duration:0.3,ease:[0.22,1,0.36,1]}}>
                      <p className="faq-answer" style={{fontFamily:"Inter, sans-serif",fontSize:14,lineHeight:1.85,color:MIST,
                        margin:0,padding:"0 0 28px 0",maxWidth:"calc(100% - 80px - 32px)",marginLeft:"calc(80px + 32px)"}}>{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
          <Rule/>
        </div>
      </div>
    </section>
  );
}

// ── Sobre ─────────────────────────────────────────────────────────────────────
function Sobre() {
  const f1=useFadeUp(), f2=useFadeUp(0.15);
  const stats=[
    {label:"Especialización", value:"Tech, Digital, Mandos Medios e IA Recruiting", desc:"Perfiles técnicos, gerencias multisector e IA donde aporta valor real."},
    {label:"Tipo de empresa", value:"PYMES, Startups y Scale-ups", desc:"Organizaciones que crecen rápido y necesitan acertar a la primera."},
    {label:"Fee", value:"1 mes de sueldo bruto + IVA", desc:"Pago único al incorporar — sin retainers ni cuotas por adelantado."},
    {label:"Garantía", value:"3 meses de reposición", desc:"Si algo falla por causas del proceso, repetimos sin coste extra."},
  ];
  return (
    <section id="sobre" style={{background:INK,padding:"112px 5%",position:"relative",overflow:"hidden"}}>
      <div style={{maxWidth:1280,margin:"0 auto",position:"relative",zIndex:1}}>
        <motion.div {...f1} style={{marginBottom:64}}>
          <LineNo n={5} light/>
          <h2 style={{fontFamily:"'Playfair Display', serif",fontWeight:700,fontSize:"clamp(32px,4vw,52px)",color:WHITE,margin:0,lineHeight:1.15,maxWidth:700}}>
            <WordReveal style={{color:WHITE}}>Una firma boutique.</WordReveal>
            <WordReveal delay={0.2} style={{color:CRIMSON, fontStyle:"italic"}}>Un estándar.</WordReveal>
          </h2>
        </motion.div>

        <Rule light style={{marginBottom:64}}/>

        <div style={{display:"grid",gridTemplateColumns:"1.3fr 1fr",gap:48,alignItems:"start"}} className="sobre-grid">
          <motion.div {...f1}>
            {["Tiey nació de una convicción: el mercado de talento tech tiene demasiadas empresas que prometen mucho y entregan poco. Volumen de CVs sin criterio, procesos de semanas sin feedback.",
              "Operamos de otra manera. Pocos clientes, atención total. Cada búsqueda tiene un único responsable desde el briefing hasta la incorporación.",
              "Si buscas una firma que entienda que contratar al CTO equivocado puede costarte dos años — y que trate tu proceso con esa responsabilidad — somos tu partner."
            ].map((p,i)=>(
              <p key={i} style={{fontFamily:"Inter, sans-serif",fontSize:15,lineHeight:1.9,color:"rgba(255,255,255,0.55)",marginBottom:20}}>{p}</p>
            ))}
            <blockquote style={{
              borderLeft:`3px solid ${CRIMSON}`, paddingLeft:24, margin:"40px 0 0",
            }}>
              <p style={{fontFamily:"'Playfair Display', serif",fontStyle:"italic",fontSize:"clamp(18px,2.2vw,26px)",color:WHITE,lineHeight:1.5,margin:0}}>
                "El talento excepcional no espera. Nosotros tampoco."
              </p>
            </blockquote>
          </motion.div>

          <motion.div {...f2} style={{display:"flex",flexDirection:"column",gap:0}}>
            {stats.map((s,i)=>(
              <div key={s.label} style={{padding:"24px 0",borderBottom:"1px solid rgba(255,255,255,0.08)"}}>
                <span style={{fontFamily:"Inter, sans-serif",fontSize:10,fontWeight:700,letterSpacing:"0.14em",textTransform:"uppercase",color:CRIMSON,display:"block",marginBottom:8}}>{s.label}</span>
                <span style={{fontFamily:"'Playfair Display', serif",fontWeight:700,fontSize:17,color:WHITE,display:"block",lineHeight:1.3,marginBottom:6}}>{s.value}</span>
                <span style={{fontFamily:"Inter, sans-serif",fontSize:12,color:"rgba(255,255,255,0.4)",lineHeight:1.6}}>{s.desc}</span>
              </div>
            ))}
          </motion.div>
        </div>
      </div>
    </section>
  );
}

// ── Precios ───────────────────────────────────────────────────────────────────
function Precios() {
  const fade = useFadeUp();
  return (
    <section id="precios" style={{background:CREAM,padding:"112px 5%"}}>
      <div style={{maxWidth:1280,margin:"0 auto"}}>
        <motion.div {...fade} style={{display:"grid",gridTemplateColumns:"1fr 2fr",gap:64,alignItems:"start",marginBottom:64}} className="sobre-grid">
          <div>
            <LineNo n={6}/>
            <h2 style={{fontFamily:"'Playfair Display', serif",fontWeight:700,fontSize:"clamp(32px,4vw,52px)",color:INK,margin:0,lineHeight:1.15}}>
              <WordReveal>Un modelo</WordReveal>
              <WordReveal delay={0.15} style={{color:CRIMSON, fontStyle:"italic"}}>transparente</WordReveal>
            </h2>
          </div>
        </motion.div>

        <div style={{background:INK2,padding:"56px 48px",position:"relative",overflow:"hidden"}}>
          <div style={{position:"absolute",top:0,left:0,right:0,height:3,background:`linear-gradient(90deg,${CRIMSON},transparent)`}}/>
          <div style={{display:"grid",gridTemplateColumns:"1fr auto",gap:48,alignItems:"center"}} className="precio-inner">
            <div>
              <span style={{fontFamily:"Inter, sans-serif",fontSize:10,fontWeight:700,letterSpacing:"0.18em",textTransform:"uppercase",color:CRIMSON}}>Fee de éxito — único modelo</span>
              <h3 style={{fontFamily:"'Playfair Display', serif",fontWeight:700,fontSize:"clamp(40px,6vw,72px)",color:WHITE,margin:"16px 0 8px",lineHeight:1}}>
                1 mes
              </h3>
              <p style={{fontFamily:"Inter, sans-serif",fontSize:15,color:"rgba(255,255,255,0.45)",margin:"0 0 32px"}}>
                de sueldo bruto + IVA — solo si hay incorporación
              </p>
              <div style={{display:"flex",flexDirection:"column",gap:12}}>
                {["Búsqueda activa en mercado pasivo","Shortlist de 3 a 5 perfiles con informe","Acompañamiento hasta la incorporación","Garantía de 3 meses sin coste adicional"].map(item=>(
                  <div key={item} style={{display:"flex",gap:14,alignItems:"flex-start"}}>
                    <span style={{color:CRIMSON,fontSize:14,marginTop:1,flexShrink:0}}>—</span>
                    <span style={{fontFamily:"Inter, sans-serif",fontSize:13,color:"rgba(255,255,255,0.5)",lineHeight:1.6}}>{item}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="precio-cta">
              <Btn variant="primary" onClick={()=>document.getElementById("contacto")?.scrollIntoView({behavior:"smooth"})}>
                Solicitar propuesta
              </Btn>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── Contacto ──────────────────────────────────────────────────────────────────
const WEB3FORMS_ACCESS_KEY = "9662f6a0-70d8-4c87-81ec-c56e48d02987";

function Contacto() {
  const [form, setForm] = useState({nombre:"",empresa:"",email:"",mensaje:""});
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");
  const handleChange = e => setForm(f=>({...f,[e.target.name]:e.target.value}));
  const handleSubmit = async () => {
    if(!form.nombre||!form.email||!form.mensaje){ setError("Completa nombre, email y mensaje."); return; }
    setError(""); setSending(true);
    try {
      const res = await fetch("https://api.web3forms.com/submit",{
        method:"POST", headers:{"Content-Type":"application/json",Accept:"application/json"},
        body:JSON.stringify({ access_key:WEB3FORMS_ACCESS_KEY, subject:`Nuevo contacto desde tiey.cc — ${form.nombre}`,
          from_name:"Tiey — Formulario web", ...form }),
      });
      const data = await res.json();
      if(data.success) window.location.href="/gracias";
      else setError("No se pudo enviar. Escríbenos a hola@tiey.cc.");
    } catch { setError("No se pudo enviar. Escríbenos a hola@tiey.cc."); }
    finally { setSending(false); }
  };
  const inputStyle = {
    width:"100%", background:"transparent",
    border:"none", borderBottom:`1px solid rgba(28,28,28,0.2)`,
    color:INK, fontFamily:"Inter, sans-serif", fontSize:15,
    padding:"14px 0", outline:"none", transition:"border-color 0.2s",
    boxSizing:"border-box",
  };
  return (
    <section id="contacto" style={{background:CREAM2,padding:"112px 5%"}}>
      <div style={{maxWidth:1280,margin:"0 auto",display:"grid",gridTemplateColumns:"1fr 1.2fr",gap:80,alignItems:"start"}} className="contacto-grid">
        <motion.div {...useFadeUp()}>
          <LineNo n={7}/>
          <h2 style={{fontFamily:"'Playfair Display', serif",fontWeight:700,fontSize:"clamp(32px,4vw,52px)",color:INK,margin:"0 0 24px",lineHeight:1.1}}>
            <WordReveal>¿Listo para</WordReveal>
            <WordReveal delay={0.1}>encontrar a tu</WordReveal>
            <WordReveal delay={0.2} style={{color:CRIMSON, fontStyle:"italic"}}>próximo líder?</WordReveal>
          </h2>
          <Rule style={{marginBottom:24}}/>
          <p style={{fontFamily:"Inter, sans-serif",fontSize:14,lineHeight:1.85,color:MIST,marginBottom:40,maxWidth:360}}>
            Cuéntanos qué necesitas y en 24h te decimos si podemos ayudarte y cómo.
          </p>
          {[{icon:"✉",label:"Email",value:"hola@tiey.cc"},{icon:"◎",label:"Ubicación",value:"Monterrey, N.L. México"}].map(({icon,label,value})=>(
            <div key={label} style={{display:"flex",gap:14,marginBottom:20,alignItems:"flex-start"}}>
              <span style={{fontSize:16,color:CRIMSON,lineHeight:1,marginTop:2}}>{icon}</span>
              <div>
                <span style={{fontFamily:"Inter, sans-serif",fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:SAND,display:"block",marginBottom:2}}>{label}</span>
                <span style={{fontFamily:"Inter, sans-serif",fontSize:14,color:INK}}>{value}</span>
              </div>
            </div>
          ))}
        </motion.div>

        <motion.div {...useFadeUp(0.15)}>
          <div style={{display:"flex",flexDirection:"column",gap:8}}>
            {[{name:"nombre",label:"Tu nombre *",type:"text",ph:"Ana García"},{name:"empresa",label:"Empresa",type:"text",ph:"StartupXYZ"},{name:"email",label:"Email *",type:"email",ph:"ana@empresa.com"}].map(({name,label,type,ph})=>(
              <div key={name} style={{marginBottom:8}}>
                <label style={{fontFamily:"Inter, sans-serif",fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:SAND,display:"block",marginBottom:4}}>{label}</label>
                <input name={name} type={type} value={form[name]} onChange={handleChange} placeholder={ph}
                  style={inputStyle} onFocus={e=>e.target.style.borderBottomColor=CRIMSON} onBlur={e=>e.target.style.borderBottomColor="rgba(28,28,28,0.2)"}/>
              </div>
            ))}
            <div style={{marginBottom:16}}>
              <label style={{fontFamily:"Inter, sans-serif",fontSize:10,letterSpacing:"0.12em",textTransform:"uppercase",color:SAND,display:"block",marginBottom:4}}>Cuéntanos más *</label>
              <textarea name="mensaje" value={form.mensaje} onChange={handleChange} rows={4}
                placeholder="¿Qué rol buscas? ¿Para cuándo lo necesitas?"
                style={{...inputStyle,resize:"vertical"}}
                onFocus={e=>e.target.style.borderBottomColor=CRIMSON} onBlur={e=>e.target.style.borderBottomColor="rgba(28,28,28,0.2)"}/>
            </div>
            {error && <p style={{fontFamily:"Inter, sans-serif",fontSize:12,color:CRIMSON,margin:"0 0 8px"}}>{error}</p>}
            <Btn variant="primary" onClick={handleSubmit} style={{opacity:sending?0.7:1}}>
              {sending?"Enviando...":"Enviar mensaje"}
            </Btn>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

// ── Footer ────────────────────────────────────────────────────────────────────
function Footer() {
  const go = id => document.getElementById(id)?.scrollIntoView({behavior:"smooth"});
  return (
    <footer style={{background:INK,padding:"72px 5% 40px",borderTop:`3px solid ${CRIMSON}`}}>
      <div style={{maxWidth:1280,margin:"0 auto"}}>
        <div style={{display:"flex",flexWrap:"wrap",gap:48,justifyContent:"space-between",marginBottom:64}} className="footer-cols">
          <div style={{maxWidth:340}}>
            <h3 style={{fontFamily:"'Playfair Display', serif",fontWeight:700,fontSize:"clamp(24px,3vw,36px)",color:WHITE,margin:"0 0 24px",lineHeight:1.2}}>
              Será un placer<br/>trabajar contigo.
            </h3>
            <Btn variant="outline-dark" onClick={()=>go("contacto")}>Contactar ahora</Btn>
          </div>
          <div style={{display:"flex",gap:64,flexWrap:"wrap"}}>
            <div>
              <h4 style={{fontFamily:"Inter, sans-serif",fontWeight:700,fontSize:10,letterSpacing:"0.14em",textTransform:"uppercase",color:CRIMSON,margin:"0 0 18px"}}>Ubicación</h4>
              <p style={{fontFamily:"Inter, sans-serif",fontSize:13,color:"rgba(255,255,255,0.4)",lineHeight:1.8,margin:0}}>Monterrey, N.L. México</p>
              <h4 style={{fontFamily:"Inter, sans-serif",fontWeight:700,fontSize:10,letterSpacing:"0.14em",textTransform:"uppercase",color:CRIMSON,margin:"32px 0 18px"}}>Social</h4>
              {["LinkedIn","X / Twitter"].map(s=>(
                <a key={s} href="#" style={{display:"block",fontFamily:"Inter, sans-serif",fontSize:13,color:"rgba(255,255,255,0.4)",textDecoration:"none",marginBottom:8,transition:"color 0.2s"}}
                  onMouseEnter={e=>e.target.style.color=WHITE} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.4)"}>{s}</a>
              ))}
            </div>
            <div>
              <h4 style={{fontFamily:"Inter, sans-serif",fontWeight:700,fontSize:10,letterSpacing:"0.14em",textTransform:"uppercase",color:CRIMSON,margin:"0 0 18px"}}>Contacto</h4>
              <p style={{fontFamily:"Inter, sans-serif",fontSize:13,color:"rgba(255,255,255,0.4)",lineHeight:1.9,margin:0}}>hola@tiey.cc</p>
              <h4 style={{fontFamily:"Inter, sans-serif",fontWeight:700,fontSize:10,letterSpacing:"0.14em",textTransform:"uppercase",color:CRIMSON,margin:"32px 0 18px"}}>Enlaces</h4>
              {[{label:"Servicios",id:"servicios"},{label:"Proceso",id:"metodología"},{label:"Casos",id:"casos"},{label:"Nosotros",id:"sobre"}].map(({label,id})=>(
                <button key={id} onClick={()=>go(id)} style={{display:"block",background:"none",border:"none",fontFamily:"Inter, sans-serif",fontSize:13,color:"rgba(255,255,255,0.4)",cursor:"pointer",padding:"0 0 8px",textAlign:"left",transition:"color 0.2s"}}
                  onMouseEnter={e=>e.target.style.color=WHITE} onMouseLeave={e=>e.target.style.color="rgba(255,255,255,0.4)"}>{label}</button>
              ))}
            </div>
          </div>
        </div>
        <Rule light/>
        <div style={{display:"flex",justifyContent:"space-between",alignItems:"center",paddingTop:24,flexWrap:"wrap",gap:12}}>
          <span style={{fontFamily:"'Playfair Display', serif",fontSize:20,fontWeight:700,color:WHITE}}>Tiey<span style={{color:CRIMSON}}>.</span></span>
          <span style={{fontFamily:"Inter, sans-serif",fontSize:11,color:"rgba(255,255,255,0.25)"}}>© 2025 Tiey — Búsqueda de talento tech &amp; digital</span>
        </div>
      </div>
    </footer>
  );
}

// ── Gracias ───────────────────────────────────────────────────────────────────
function Gracias() {
  return (
    <section style={{background:INK,minHeight:"100vh",display:"flex",alignItems:"center",justifyContent:"center",padding:"5%"}}>
      <div style={{textAlign:"center",maxWidth:520}}>
        <div style={{fontSize:48,marginBottom:24,color:CRIMSON}}>✓</div>
        <h1 style={{fontFamily:"'Playfair Display', serif",fontWeight:700,fontSize:"clamp(32px,5vw,52px)",color:WHITE,margin:"0 0 16px"}}>Mensaje recibido</h1>
        <p style={{fontFamily:"Inter, sans-serif",fontSize:16,lineHeight:1.8,color:"rgba(255,255,255,0.5)",marginBottom:40}}>
          Te respondemos en menos de 24 horas — normalmente mucho antes.
        </p>
        <Btn variant="primary" onClick={()=>window.location.href="/"}>Volver al inicio</Btn>
      </div>
    </section>
  );
}

// ── CookieBanner — cumple con Google Ads + GDPR básico ──────────────────────
function CookieBanner() {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const accepted = localStorage.getItem("tiey_cookies");
    if (!accepted) setVisible(true);
  }, []);
  const accept = () => { localStorage.setItem("tiey_cookies","1"); setVisible(false); };
  const decline = () => { localStorage.setItem("tiey_cookies","0"); setVisible(false); };
  if (!visible) return null;
  return (
    <motion.div initial={{y:80,opacity:0}} animate={{y:0,opacity:1}} transition={{duration:0.5,ease:[0.22,1,0.36,1]}}
      style={{
        position:"fixed", bottom:24, left:"50%", transform:"translateX(-50%)", zIndex:300,
        width:"min(680px, 92vw)",
        background:INK, border:`1px solid rgba(200,16,46,0.2)`,
        borderRadius:16, padding:"20px 28px",
        display:"flex", alignItems:"center", justifyContent:"space-between",
        gap:20, flexWrap:"wrap",
        boxShadow:"0 8px 40px rgba(0,0,0,0.35)",
      }}>
      <p style={{fontFamily:"Inter, sans-serif",fontSize:13,color:"rgba(255,255,255,0.6)",margin:0,lineHeight:1.6,flex:1,minWidth:200}}>
        Usamos cookies para mejorar tu experiencia y medir el rendimiento de nuestras campañas.{" "}
        <a href="#" style={{color:CRIMSON,textDecoration:"none"}}>Política de privacidad</a>
      </p>
      <div style={{display:"flex",gap:10,flexShrink:0}}>
        <button onClick={decline} style={{
          background:"transparent", border:"1px solid rgba(255,255,255,0.2)", color:"rgba(255,255,255,0.55)",
          fontFamily:"Inter, sans-serif",fontSize:11,fontWeight:600,letterSpacing:"0.1em",
          textTransform:"uppercase",padding:"9px 18px",borderRadius:8,cursor:"pointer",
        }}>Rechazar</button>
        <button onClick={accept} style={{
          background:CRIMSON, border:"none", color:WHITE,
          fontFamily:"Inter, sans-serif",fontSize:11,fontWeight:600,letterSpacing:"0.1em",
          textTransform:"uppercase",padding:"9px 18px",borderRadius:8,cursor:"pointer",
          boxShadow:"0 2px 12px rgba(200,16,46,0.35)",
        }}>Aceptar</button>
      </div>
    </motion.div>
  );
}

// ── App ───────────────────────────────────────────────────────────────────────
export default function App() {
  const isGracias = window.location.pathname === "/gracias";
  if (isGracias) return <Gracias />;

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;1,400;1,700&family=Inter:wght@400;500;600;700&display=swap');
        * { margin:0; padding:0; box-sizing:border-box; }
        body { background:${CREAM}; }
        ::selection { background:${CRIMSON}; color:${WHITE}; }

        @media (max-width:1100px) {
          .desk-nav { display:none !important; }
          .burger-btn { display:flex !important; }
        }
        @media (max-width:900px) {
          .hero-bottom { grid-template-columns:1fr !important; gap:32px !important; }
          .hero-bottom > div:last-child { justify-content:flex-start !important; }
          .sobre-grid { grid-template-columns:1fr !important; gap:32px !important; }
          .contacto-grid { grid-template-columns:1fr !important; gap:48px !important; }
          .precio-inner { grid-template-columns:1fr !important; gap:32px !important; }
          .precio-cta { margin-top:16px; }
          .footer-cols { flex-direction:column !important; gap:48px !important; }
          .service-row { grid-template-columns:40px 1fr !important; gap:16px !important; }
          .service-row > *:last-child { grid-column:2; }
          .testi-divider { display:none !important; }
          /* Accordion en tablet: apilado vertical */
          .services-accordion { flex-direction:column !important; height:auto !important; }
          .services-accordion > div { width:100% !important; min-height:60px !important; max-height:60px !important; overflow:hidden !important; }
          .services-accordion > div.accordion-active { max-height:300px !important; }
        }
        @media (max-width:560px) {
          section { padding-top:72px !important; padding-bottom:72px !important; padding-left:5% !important; padding-right:5% !important; }
          /* FAQ */
          .faq-row { grid-template-columns:1fr auto !important; gap:12px !important; }
          .faq-num { display:none !important; }
          .faq-answer { margin-left:0 !important; max-width:100% !important; }
          /* Galería hero — ocultar en móvil para no tapar el texto */
          .hero-gallery { display:none !important; }
          /* Accordion mobile — altura fija para colapsados */
          .services-accordion { gap:6px !important; }
          .services-accordion > div { min-height:52px !important; max-height:52px !important; }
          /* El activo puede crecer */
          .services-accordion > div.accordion-active { max-height:280px !important; }
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
        <FAQ />
        <Sobre />
        <Precios />
        <Contacto />
      </main>
      <Footer />
      <CookieBanner />
    </>
  );
}
