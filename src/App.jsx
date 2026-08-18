import React, { useEffect, useState } from "react";
import "./concepts.css";
import "./concepts-enhanced.css";

const AnimatedTag = (tag) => function AnimatedElement({ children, initial, animate, exit, transition, whileHover, whileInView, viewport, ...props }) {
  return React.createElement(tag, props, children);
};
const motion = new Proxy({}, { get: (_, tag) => AnimatedTag(tag) });
const AnimatePresence = ({ children }) => children;

const concepts = {
  "1": { name: "Editorial recruitment journal", className: "journal" },
  "2": { name: "Bold typographic dossier", className: "dossier" },
  "3": { name: "Human boutique narrative", className: "human" },
};

const services = [
  ["Búsqueda especializada", "Encontramos perfiles clave en tecnología, producto, datos, diseño y marketing digital."],
  ["Proceso a medida y sin atajos", "Diseñamos cada búsqueda desde el contexto, la cultura y los objetivos reales del negocio."],
  ["Búsquedas confidenciales", "Mapeo discreto de mercado y acercamiento directo a talento que no está buscando activamente."],
  ["Garantía de 3 meses", "Si la contratación no funciona, repetimos la búsqueda sin honorarios adicionales."],
];
const audiences = [
  ["Startups en crecimiento", "Que necesitan sumar liderazgo sin margen para una mala contratación."],
  ["Equipos que escalan", "Que buscan talento senior capaz de elevar al equipo y acelerar resultados."],
  ["Búsquedas críticas", "Posiciones estratégicas, confidenciales o difíciles de cubrir por canales tradicionales."],
];
const steps = [
  ["Diagnóstico", "Entendemos el reto, el equipo, la cultura y el perfil ideal."],
  ["Búsqueda", "Mapeo de mercado, investigación y acercamiento directo."],
  ["Shortlist 3–5", "Evaluación profunda y presentación de candidatos relevantes."],
  ["Acompañamiento", "Entrevistas, cierre, integración y garantía de 3 meses."],
];
const faqs = [
  ["¿Qué tipo de posiciones cubren?", "Roles especializados y de liderazgo en tecnología, producto, datos, diseño y marketing digital."],
  ["¿Cuánto tarda una búsqueda?", "Depende de la complejidad; definimos expectativas y ritmo desde el diagnóstico inicial."],
  ["¿Cómo funciona la garantía?", "Si la persona contratada sale durante los primeros 3 meses, repetimos la búsqueda sin honorarios adicionales."],
  ["¿Trabajan con startups y PyMEs?", "Sí. Adaptamos el proceso a la etapa, estructura y urgencia de cada empresa."],
];

function Header() {
  return <header className="nav">
    <a href="#top" className="brand"><img src="/tiey-logo.png" alt="Tiey" /></a>
    <nav><a href="#servicios">Servicios</a><a href="#proceso">Proceso</a><a href="#diferencia">Por qué Tiey</a><a href="#faq">FAQ</a></nav>
    <a className="nav-cta" href="#contacto">Hablemos</a>
  </header>;
}

function Hero({ variant }) {
  const roles = ["líder especializado.", "CTO.", "Head of Product.", "líder de datos."];
  const profileImages = ["/p2.jpg", "/p1.jpg", "/p7.jpg", "/p10.jpg"];
  const [role,setRole] = useState(0);
  useEffect(()=>{
    if(variant!=="3") return;
    const timer=setInterval(()=>setRole(v=>(v+1)%roles.length),2400);
    return()=>clearInterval(timer);
  },[variant]);
  return <section id="top" className="hero">
    <motion.div className="hero-copy" initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{duration:.8}}>
      <span className="eyebrow">BÚSQUEDA DE TALENTO · MÉXICO</span>
      <h1>Encuentra a tu próximo <em className="role-slot"><span key={role} className="role-cycle">{variant==="3"?roles[role]:roles[0]}</span></em></h1>
      {variant === "3" && <span className="hero-thesis">Encontramos a la persona que cambia el equipo.</span>}
      <p>Somos una <strong>firma boutique</strong> de búsqueda de talento tech y digital. Proceso a medida, sin atajos, con garantía de <strong>3 meses.</strong></p>
      <div className="hero-actions"><a href="#contacto" className="primary">Cuéntanos tu búsqueda <span>→</span></a><a href="#proceso" className="text-link">Conoce el proceso</a></div>
      <div className="proof"><div>Búsqueda<br/>especializada</div><div>Proceso a medida<br/>y sin atajos</div><div>Garantía de<br/><strong>3 meses</strong></div></div>
    </motion.div>
    <motion.div className={`hero-visual ${variant === "3" ? "search-visual" : ""}`} initial={{opacity:0,scale:.96}} animate={{opacity:1,scale:1}} transition={{duration:1,delay:.2}}>
      {variant !== "3" ? <><div className="letter">T</div><img src="/p1.jpg" alt="Líder especializado" /></> : <>
        <div className="search-label"><span>BÚSQUEDA ACTIVA</span><b>{roles[role].replace(".","")}</b></div>
        <div className="profile-stack">
          {profileImages.map((src,i)=><figure key={src} className="profile-preview" style={{"--slot":i}}><img src={src} alt="Perfil evaluado"/></figure>)}
          <figure className="selected"><div className="profile-fade">{profileImages.map((src,i)=><img key={src} className={i===role?"active":""} src={src} alt={i===role?roles[role]:""}/>)}</div><figcaption><span>PERFIL SELECCIONADO</span><b>Match de contexto</b></figcaption></figure>
          <div className="scan-line" />
        </div>
        <div className="search-progress"><span /><small>Mapeo · Evaluación · Shortlist</small></div>
      </>}
    </motion.div>
    {variant === "3" && <div className="roles"><div className="roles-track">{[0,1].map(copy=><div className="roles-set" key={copy} aria-hidden={copy===1}>{["PRODUCT MANAGER","DATA SCIENTIST","SOFTWARE ENGINEER","UX/UI DESIGNER","GROWTH LEAD"].map(label=><span key={`${copy}-${label}`}>{label}</span>)}</div>)}</div></div>}
  </section>;
}

function Services() {
  const [open,setOpen] = useState(0);
  return <section id="servicios" className="section services"><div className="section-head"><span className="eyebrow">SERVICIOS</span><h2>Búsquedas que generan <em>impacto real.</em></h2><p>Nos integramos a tu contexto para encontrar a quien puede acelerar la siguiente etapa.</p></div>
    <div className="accordion">{services.map((s,i)=><button key={s[0]} onClick={()=>setOpen(i)} className={open===i?"open":""}><span className="num">0{i+1}</span><span className="service-copy"><strong>{s[0]}</strong><AnimatePresence initial={false}>{open===i&&<motion.small initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}}>{s[1]}</motion.small>}</AnimatePresence></span><span className="plus">{open===i?"−":"+"}</span></button>)}</div>
  </section>;
}

function Audience() { return <section className="section audience"><div className="section-head"><span className="eyebrow">PARA QUIÉN TRABAJAMOS</span><h2>Cuando una contratación genérica <em>ya no es suficiente.</em></h2></div><div className="columns">{audiences.map((a,i)=><motion.article key={a[0]} whileHover={{y:-6}}><span>0{i+1}</span><h3>{a[0]}</h3><p>{a[1]}</p></motion.article>)}</div></section> }

function Process() { return <section id="proceso" className="section process"><div className="section-head"><span className="eyebrow">NUESTRO PROCESO</span><h2>Un proceso claro. <em>Resultados que se quedan.</em></h2></div><div className="timeline">{steps.map((s,i)=><motion.article key={s[0]} initial={{opacity:.45}} whileInView={{opacity:1}} whileHover={{y:-9}} transition={{duration:.3,ease:[.22,1,.36,1]}} viewport={{once:true,amount:.8}}><span>0{i+1}</span><h3>{s[0]}</h3><p>{s[1]}</p></motion.article>)}</div></section> }

function Results({variant}) { if(variant!=="3") return null; return <section className="section results"><div className="result-intro"><span className="eyebrow">LO QUE PUEDES ESPERAR</span><h2>Menos ruido.<br/><em>Mejores decisiones.</em></h2></div><div className="result-metrics"><article><strong>3–5</strong><span>perfiles relevantes en la shortlist final</span></article><article><strong>1:1</strong><span>comunicación directa durante la búsqueda</span></article><article><strong>3 meses</strong><span>de garantía sobre la contratación</span></article></div></section> }

function Difference({ variant }) { return <section id="diferencia" className="section difference">{variant === "3" && <img src="/p7.jpg" alt="Líder en contexto de trabajo"/>}<div className="difference-copy"><span className="eyebrow">NUESTRA DIFERENCIA</span><h2>No enviamos currículums.<br/><em>Construimos la búsqueda correcta.</em></h2><div className="manifesto"><div><b>Proceso a medida</b><p>Cada búsqueda comienza desde cero.</p></div><div><b>Evaluación humana</b><p>Entrevistas profundas y referencias reales.</p></div><div><b>Comunicación directa</b><p>Hablas con quien conduce la búsqueda.</p></div><div><b>Garantía 3 meses</b><p>Tu tranquilidad forma parte del servicio.</p></div></div></div></section> }

function Testimonial() { return <section className="section testimonial"><span className="eyebrow">LO QUE DICEN NUESTROS CLIENTES</span><blockquote>“Tiey entendió el reto desde el inicio y presentó candidatos que realmente encajaban. Cerramos la posición en tiempo récord.”</blockquote><div className="quote-person"><img src="/p10.jpg" alt="Cliente"/><span><b>Cliente Tiey</b><small>Líder de People · Empresa de tecnología</small></span><span className="pager">← &nbsp; 01 / 03 &nbsp; →</span></div></section> }

function FAQ() { const [open,setOpen]=useState(null); return <section id="faq" className="section faq"><div className="section-head"><span className="eyebrow">PREGUNTAS FRECUENTES</span><h2>Resolvemos tus dudas.</h2></div><div>{faqs.map((f,i)=><button key={f[0]} onClick={()=>setOpen(open===i?null:i)}><span>{f[0]}</span><b>{open===i?"−":"+"}</b>{open===i&&<motion.p initial={{opacity:0}} animate={{opacity:1}}>{f[1]}</motion.p>}</button>)}</div></section> }

const WEB3FORMS_ACCESS_KEY = "9662f6a0-70d8-4c87-81ec-c56e48d02987";
function Contact() {
  const [status,setStatus]=useState("idle");
  const [message,setMessage]=useState("");
  const submit=async e=>{
    e.preventDefault(); setStatus("sending"); setMessage("");
    const form=new FormData(e.currentTarget);
    form.append("access_key",WEB3FORMS_ACCESS_KEY);
    form.append("subject",`Nueva búsqueda desde tiey.cc — ${form.get("empresa")||form.get("nombre")}`);
    form.append("from_name","Tiey — Formulario web");
    try{
      const response=await fetch("https://api.web3forms.com/submit",{method:"POST",body:form});
      const data=await response.json();
      if(!data.success) throw new Error("submit");
      e.currentTarget.reset(); setStatus("success"); setMessage("Gracias. Recibimos tu búsqueda y te contactaremos en menos de 24 horas.");
    }catch{setStatus("error");setMessage("No pudimos enviar el formulario. Escríbenos a hola@tiey.cc.");}
  };
  return <section id="contacto" className="section contact"><div><span className="eyebrow">HABLEMOS</span><h2>Hablemos de la posición que <em>necesitas cubrir.</em></h2><p>Cuéntanos sobre tu búsqueda y responderemos en menos de 24 horas.</p><a href="mailto:hola@tiey.cc">hola@tiey.cc</a><a href="https://tiey.cc">tiey.cc</a></div><form onSubmit={submit}><div><input name="nombre" placeholder="Nombre completo" required/><input name="email" type="email" placeholder="Correo corporativo" required/></div><div><input name="empresa" placeholder="Empresa" required/><input name="telefono" type="tel" placeholder="Teléfono (opcional)"/></div><input name="puesto" placeholder="Puesto que necesitas cubrir" required/><textarea name="mensaje" placeholder="Cuéntanos más sobre el reto, el equipo y el perfil ideal" required/><button className="primary" disabled={status==="sending"}>{status==="sending"?"Enviando…":"Enviar solicitud"} <span>→</span></button>{message&&<p className={`form-status ${status}`} role="status">{message}</p>}</form></section>
}

function Footer(){ return <footer><img src="/tiey-logo.png" alt="Tiey"/><p>Firma boutique de búsqueda de talento tech y digital.</p><div><a href="#servicios">Servicios</a><a href="#proceso">Proceso</a><a href="#faq">FAQ</a><a href="#contacto">Contacto</a></div><small>© 2026 Tiey. Todos los derechos reservados.</small></footer> }

export default function App(){
  const n="3";
  useEffect(()=>{
    const sections=[...document.querySelectorAll(".section")];
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{
      if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target)}
    }),{threshold:.13,rootMargin:"0px 0px -40px"});
    sections.forEach(section=>observer.observe(section));
    return()=>observer.disconnect();
  },[]);
  const c=concepts[n];
  return <main className={`concept ${c.className}`}><Header/><Hero variant={n}/><Services/><Audience/><Process/><Results variant={n}/><Difference variant={n}/><Testimonial/><FAQ/><Contact/><Footer/></main>
}
