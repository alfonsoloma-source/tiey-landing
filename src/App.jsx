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
  ["Búsqueda especializada", "Encontramos perfiles profesionales y especializados en ingeniería, tecnología, producto, datos, diseño, marketing, comercial y otras funciones clave para el negocio."],
  ["Proceso a medida y sin atajos", "Diseñamos cada búsqueda desde el contexto, la cultura y los objetivos reales del negocio."],
  ["Búsquedas confidenciales", "Mapeo discreto de mercado y acercamiento directo a talento que no está buscando activamente."],
  ["Garantía de 3 meses", "Si la contratación no funciona, repetimos la búsqueda sin honorarios adicionales."],
];
const audiences = [
  ["PyMEs y empresas en crecimiento", "Que necesitan sumar talento clave sin convertir cada vacante en un proceso improvisado."],
  ["Equipos que escalan", "Que buscan perfiles profesionales o especializados capaces de elevar al equipo y acelerar resultados."],
  ["Búsquedas críticas", "Posiciones estratégicas, confidenciales o difíciles de cubrir por canales tradicionales."],
];
const steps = [
  ["Diagnóstico", "Entendemos el reto, el equipo, la cultura y el perfil ideal."],
  ["Búsqueda", "Mapeo de mercado, investigación y acercamiento directo."],
  ["Shortlist 3–5", "Evaluación profunda y presentación de candidatos relevantes."],
  ["Acompañamiento", "Entrevistas, cierre, integración y garantía de 3 meses."],
];
const faqs = [
  ["¿Qué tipo de posiciones cubren?", "En búsqueda especializada trabajamos perfiles profesionales y de liderazgo en ingeniería, tecnología, producto, datos, diseño, marketing, comercial y otras funciones clave. Para ayudantes generales, operadores, almacén y otros perfiles operativos contamos con una línea específica de reclutamiento operativo y de volumen."],
  ["¿Cuánto tarda una búsqueda?", "Depende de la complejidad; definimos expectativas y ritmo desde el diagnóstico inicial."],
  ["¿Cómo funciona la garantía?", "Si la persona contratada sale durante los primeros 3 meses, repetimos la búsqueda sin honorarios adicionales en los servicios donde la garantía forme parte del alcance acordado."],
  ["¿Trabajan con startups y PyMEs?", "Sí. Adaptamos el proceso a la etapa, estructura, volumen y urgencia de cada empresa."],
];

function Header() {
  return <header className="nav">
    <a href="#top" className="brand" aria-label="Tiey — inicio"><img className="brand-real" src="/tiey-logo-real.svg" alt="Tiey" /></a>
    <nav><a href="#servicios">Servicios</a><a href="#proceso">Proceso</a><a href="#diferencia">Por qué Tiey</a><a href="#faq">FAQ</a></nav>
    <a className="nav-cta" href="#contacto">Hablemos</a>
  </header>;
}

function Hero({ variant }) {
  const roles = ["líder especializado.", "líder de ingeniería.", "Head of Product.", "líder comercial."];
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
      <p>Somos una <strong>firma boutique</strong> de búsqueda de talento profesional y especializado. Trabajamos búsquedas a medida y contamos con una línea específica para reclutamiento operativo y de volumen.</p>
      <div className="hero-actions"><a href="#contacto" className="primary">Cuéntanos tu búsqueda <span>→</span></a><a href="#proceso" className="text-link">Conoce el proceso</a></div>
      <div className="proof"><div>Búsqueda<br/>especializada</div><div>Proceso a medida<br/>y sin atajos</div><div>Garantía de<br/><strong>3 meses*</strong></div></div>
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
    {variant === "3" && <div className="roles"><div className="roles-track">{[0,1].map(copy=><div className="roles-set" key={copy} aria-hidden={copy===1}>{["INGENIERÍA","PRODUCTO","DATOS","DISEÑO","MARKETING","COMERCIAL"].map(label=><span key={`${copy}-${label}`}>{label}</span>)}</div>)}</div></div>}
  </section>;
}

function Services() {
  const [open,setOpen] = useState(0);
  return <section id="servicios" className="section services"><div className="section-head"><span className="eyebrow">SERVICIOS</span><h2>Búsquedas que generan <em>impacto real.</em></h2><p>Nos integramos a tu contexto para encontrar a quien puede acelerar la siguiente etapa.</p></div>
    <div className="accordion">{services.map((s,i)=><button key={s[0]} onClick={()=>setOpen(i)} className={open===i?"open":""} aria-expanded={open===i}><span className="num">0{i+1}</span><span className="service-copy"><strong>{s[0]}</strong><AnimatePresence initial={false}>{open===i&&<motion.small initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}}>{s[1]}</motion.small>}</AnimatePresence></span><span className="plus">{open===i?"−":"+"}</span></button>)}</div>
  </section>;
}

function CommercialServices(){
  return <section id="soluciones-tiey" className="commercial-services" aria-labelledby="commercial-services-title">
    <div className="commercial-services__head">
      <span className="eyebrow">SOLUCIONES TIEY</span>
      <h2 id="commercial-services-title">Distintos retos de talento. <em>Una solución para cada contexto.</em></h2>
      <p>Desde posiciones especializadas hasta contratación operativa, capacitación y tecnología aplicada al reclutamiento.</p>
    </div>
    <div className="commercial-services__grid">
      <a href="/reclutamiento-especializado/"><small>01</small><strong>Reclutamiento especializado</strong><span>Búsqueda activa para posiciones profesionales, críticas y de liderazgo.</span><b>→</b></a>
      <a href="/reclutamiento-operativo/"><small>02</small><strong>Reclutamiento operativo y volumen</strong><span>Procesos para operadores, almacén, ayudantes y necesidades de contratación recurrente.</span><b>→</b></a>
      <a href="/ia-recruiting/"><small>03</small><strong>IA Recruiting</strong><span>Automatización y tecnología aplicada a procesos repetitivos de reclutamiento operativo.</span><b>→</b></a>
      <a href="/capacitacion/"><small>04</small><strong>Capacitación</strong><span>Formación práctica para fortalecer procesos, equipos y capacidades de talento.</span><b>→</b></a>
    </div>
  </section>;
}

function Audience() { return <section className="section audience"><div className="section-head"><span className="eyebrow">PARA QUIÉN TRABAJAMOS</span><h2>Cuando una contratación genérica <em>ya no es suficiente.</em></h2></div><div className="columns">{audiences.map((a,i)=><motion.article key={a[0]} whileHover={{y:-6}}><span>0{i+1}</span><h3>{a[0]}</h3><p>{a[1]}</p></motion.article>)}</div></section> }

function Process() { return <section id="proceso" className="section process"><div className="section-head"><span className="eyebrow">NUESTRO PROCESO</span><h2>Un proceso claro. <em>Resultados que se quedan.</em></h2></div><div className="timeline">{steps.map((s,i)=><motion.article key={s[0]} initial={{opacity:.45}} whileInView={{opacity:1}} whileHover={{y:-9}} transition={{duration:.3,ease:[.22,1,.36,1]}} viewport={{once:true,amount:.8}}><span>0{i+1}</span><h3>{s[0]}</h3><p>{s[1]}</p></motion.article>)}</div></section> }

function Results({variant}) { if(variant!=="3") return null; return <section className="section results"><div className="result-intro"><span className="eyebrow">LO QUE PUEDES ESPERAR</span><h2>Menos ruido.<br/><em>Mejores decisiones.</em></h2></div><div className="result-metrics"><article><strong>3–5</strong><span>perfiles relevantes en búsquedas especializadas</span></article><article><strong>1:1</strong><span>comunicación directa durante la búsqueda</span></article><article><strong>3 meses*</strong><span>de garantía cuando forme parte del servicio acordado</span></article></div></section> }

function Difference({ variant }) { return <section id="diferencia" className="section difference">{variant === "3" && <img src="/p7.jpg" alt="Líder en contexto de trabajo"/>}<div className="difference-copy"><span className="eyebrow">NUESTRA DIFERENCIA</span><h2>No enviamos currículums.<br/><em>Construimos la búsqueda correcta.</em></h2><div className="manifesto"><div><b>Proceso a medida</b><p>Cada búsqueda comienza desde cero.</p></div><div><b>Evaluación humana</b><p>Entrevistas y revisión de contexto según el tipo de búsqueda.</p></div><div><b>Comunicación directa</b><p>Hablas con quien conduce la búsqueda.</p></div><div><b>Garantía</b><p>Se define de acuerdo con el servicio y alcance contratado.</p></div></div></div></section> }

function FAQ() { const [open,setOpen]=useState(null); return <section id="faq" className="section faq"><div className="section-head"><span className="eyebrow">PREGUNTAS FRECUENTES</span><h2>Resolvemos tus dudas.</h2></div><div>{faqs.map((f,i)=><button key={f[0]} onClick={()=>setOpen(open===i?null:i)} aria-expanded={open===i}><span>{f[0]}</span><b>{open===i?"−":"+"}</b>{open===i&&<motion.p initial={{opacity:0}} animate={{opacity:1}}>{f[1]}</motion.p>}</button>)}</div></section> }

function Contact() {
  const [status,setStatus]=useState("idle");
  const [message,setMessage]=useState("");
  const submit=async e=>{
    e.preventDefault();
    if(!e.currentTarget.reportValidity()) return;
    setStatus("sending"); setMessage("");
    const form=new FormData(e.currentTarget);
    const payload=Object.fromEntries(form.entries());

    if(payload.website){window.location.assign("/gracias");return;}
    const accessKey=import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
    if(!accessKey){setStatus("error");setMessage("No pudimos enviar el formulario. Escríbenos a hola@tiey.cc.");return;}
    try{
      const response=await fetch("https://api.web3forms.com/submit",{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify({access_key:accessKey,subject:`Nueva solicitud desde tiey.cc — ${payload.empresa || "Contacto"}`,from_name:"Tiey — Formulario web",name:payload.nombre,email:payload.email,empresa:payload.empresa,telefono:payload.telefono || "",puesto:payload.puesto,message:payload.mensaje || "Sin mensaje adicional",privacy_consent:payload.privacy_consent})});
      const data=await response.json();
      if(!response.ok||!data.success) throw new Error("submit");
      window.va?.("event",{name:"contact_form_success"});window.location.assign("/gracias");
    }catch{setStatus("error");setMessage("No pudimos enviar el formulario. Escríbenos a hola@tiey.cc.");}
  };
  return <section id="contacto" className="section contact"><div><span className="eyebrow">HABLEMOS</span><h2>Hablemos de lo que <em>necesitas resolver.</em></h2><p>Cuéntanos sobre la vacante, volumen, capacitación o proceso que quieres mejorar y responderemos en menos de 24 horas.</p><a href="mailto:hola@tiey.cc">hola@tiey.cc</a><a href="https://tiey.cc">tiey.cc</a></div><form onSubmit={submit}><div><label>Nombre completo<input name="nombre" autoComplete="name" required maxLength="100"/></label><label>Correo corporativo<input name="email" type="email" autoComplete="email" required maxLength="160"/></label></div><div><label>Empresa<input name="empresa" autoComplete="organization" required maxLength="120"/></label><label>Teléfono <small>(opcional)</small><input name="telefono" type="tel" autoComplete="tel" maxLength="30"/></label></div><label>Vacante o servicio que necesitas<input name="puesto" required maxLength="140" placeholder="Ej. Ingeniero de calidad, 20 operadores, capacitación..."/></label><label>Cuéntanos sobre el reto<textarea name="mensaje" placeholder="Contexto, ubicación, volumen o necesidad" maxLength="2000"/></label><label className="hp-field" aria-hidden="true">Sitio web<input name="website" tabIndex="-1" autoComplete="off"/></label><label className="consent"><input name="privacy_consent" type="checkbox" value="accepted" required/><span>He leído y acepto el <a href="/privacidad">aviso de privacidad</a>.</span></label><button className="primary" disabled={status==="sending"}>{status==="sending"?"Enviando…":"Enviar solicitud"} <span>→</span></button>{message&&<p className={`form-status ${status}`} role="status">{message}</p>}</form></section>
}

function Footer(){ return <footer><a href="/" aria-label="Tiey — inicio"><img className="brand-real footer-logo" src="/tiey-logo-real.svg" alt="Tiey" /></a><p>Reclutamiento especializado, operativo y soluciones para equipos de talento.</p><div><a href="/#servicios">Servicios</a><a href="/reclutamiento-operativo/">Operativo</a><a href="/ia-recruiting/">IA Recruiting</a><a href="/capacitacion/">Capacitación</a><a href="/#contacto">Contacto</a><a href="/privacidad">Privacidad</a><a href="/terminos">Términos</a></div><small>© 2026 Tiey. Todos los derechos reservados.</small></footer> }
function SetPageMeta({title,description,robots="index,follow"}){useEffect(()=>{document.title=title;document.querySelector('meta[name="description"]')?.setAttribute("content",description);document.querySelector('meta[name="robots"]')?.setAttribute("content",robots);window.scrollTo(0,0)},[title,description,robots]);return null}
function InnerHeader(){return <header className="nav"><a href="/" className="brand" aria-label="Tiey — inicio"><img className="brand-real" src="/tiey-logo-real.svg" alt="Tiey"/></a><a className="nav-cta" href="/#contacto">Hablemos</a></header>}
function LegalPage({type}){const privacy=type==="privacy";return <main className="concept human"><SetPageMeta title={`${privacy?"Aviso de privacidad":"Términos de uso"} — Tiey`} description={`${privacy?"Aviso de privacidad":"Términos de uso"} del sitio web de Tiey.`}/><InnerHeader/><article className="legal"><span className="eyebrow">INFORMACIÓN LEGAL</span><h1>{privacy?"Aviso de privacidad":"Términos de uso"}</h1>{privacy?<><p>Tiey, persona física con domicilio en Apodaca, Nuevo León, México, es responsable del tratamiento de los datos personales que recibimos mediante este sitio.</p><h2>Datos y finalidad</h2><p>Podemos tratar nombre, correo, teléfono, empresa, puesto y la información que compartas para responder tu solicitud, evaluar la búsqueda de talento y mantener comunicación relacionada con nuestros servicios.</p><h2>Transferencias y conservación</h2><p>Utilizamos proveedores tecnológicos necesarios para recibir y alojar la información. Conservaremos tus datos sólo durante el tiempo razonablemente necesario para atender la solicitud y cumplir obligaciones aplicables.</p><h2>Tus derechos</h2><p>Puedes solicitar acceso, rectificación, cancelación u oposición, así como revocar tu consentimiento, escribiendo a <a href="mailto:hola@tiey.cc">hola@tiey.cc</a>. Indicaremos cualquier actualización material de este aviso en esta página.</p></>:<><p>Al navegar en tiey.cc aceptas usar el sitio únicamente con fines lícitos. La información publicada es general y no constituye una oferta contractual.</p><h2>Servicios y contenidos</h2><p>El alcance, honorarios, tiempos, garantías y condiciones de cada servicio se establecerán por escrito con cada cliente. Las marcas, textos y elementos visuales del sitio pertenecen a Tiey o se utilizan con autorización.</p><h2>Disponibilidad y contacto</h2><p>Podemos actualizar o suspender contenidos del sitio. Para preguntas sobre estos términos, escribe a <a href="mailto:hola@tiey.cc">hola@tiey.cc</a>.</p></>}</article><Footer/></main>}
function Thanks(){return <main className="concept human"><SetPageMeta title="Solicitud recibida — Tiey" description="Confirmación de solicitud enviada a Tiey." robots="noindex,nofollow"/><InnerHeader/><section className="status-page"><span className="eyebrow">SOLICITUD RECIBIDA</span><h1>Gracias por contarnos lo que necesitas.</h1><p>Revisaremos el contexto y te contactaremos en menos de 24 horas.</p><a className="primary" href="/">Volver al inicio <span>→</span></a></section><Footer/></main>}
function NotFound(){return <main className="concept human"><SetPageMeta title="Página no encontrada — Tiey" description="La página solicitada no existe." robots="noindex,nofollow"/><InnerHeader/><section className="status-page"><span className="eyebrow">ERROR 404</span><h1>Esta página no existe.</h1><p>Regresa al inicio o cuéntanos qué necesitas resolver.</p><a className="primary" href="/">Volver al inicio <span>→</span></a></section><Footer/></main>}

export default function App(){
  const n="3";
  const path=window.location.pathname.replace(/\/$/,"")||"/";
  if(path==="/privacidad") return <LegalPage type="privacy"/>;
  if(path==="/terminos") return <LegalPage type="terms"/>;
  if(path==="/gracias") return <Thanks/>;
  if(path!=="/") return <NotFound/>;
  useEffect(()=>{
    const sections=[...document.querySelectorAll(".section")];
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target)}}),{threshold:.13,rootMargin:"0px 0px -40px"});
    sections.forEach(section=>observer.observe(section));return()=>observer.disconnect();
  },[]);
  const c=concepts[n];
  return <main className={`concept ${c.className}`}><Header/><Hero variant={n}/><Services/><CommercialServices/><Audience/><Process/><Results variant={n}/><Difference variant={n}/><FAQ/><Contact/><Footer/></main>
}
