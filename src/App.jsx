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

const servicesEs = [
  ["Búsqueda especializada", "Encontramos perfiles profesionales y especializados en ingeniería, tecnología, producto, datos, diseño, marketing, comercial y otras funciones clave para el negocio."],
  ["Proceso a medida y sin atajos", "Diseñamos cada búsqueda desde el contexto, la cultura y los objetivos reales del negocio."],
  ["Búsquedas confidenciales", "Mapeo discreto de mercado y acercamiento directo a talento que no está buscando activamente."],
  ["Garantía de 3 meses", "Si la contratación no funciona, repetimos la búsqueda sin honorarios adicionales."],
];
const audiencesEs = [
  ["PyMEs y empresas en crecimiento", "Que necesitan sumar talento clave sin convertir cada vacante en un proceso improvisado."],
  ["Equipos que escalan", "Que buscan perfiles profesionales o especializados capaces de elevar al equipo y acelerar resultados."],
  ["Búsquedas críticas", "Posiciones estratégicas, confidenciales o difíciles de cubrir por canales tradicionales."],
];
const stepsEs = [
  ["Diagnóstico", "Entendemos el reto, el equipo, la cultura y el perfil ideal."],
  ["Búsqueda", "Mapeo de mercado, investigación y acercamiento directo."],
  ["Shortlist 3–5", "Evaluación profunda y presentación de candidatos relevantes."],
  ["Acompañamiento", "Entrevistas, cierre, integración y garantía de 3 meses."],
];
const faqsEs = [
  ["¿Qué tipo de posiciones cubren?", "En búsqueda especializada trabajamos perfiles profesionales y de liderazgo en ingeniería, tecnología, producto, datos, diseño, marketing, comercial y otras funciones clave. Para ayudantes generales, operadores, almacén y otros perfiles operativos contamos con una línea específica de reclutamiento operativo y de volumen."],
  ["¿Cuánto tarda una búsqueda?", "Depende de la complejidad; definimos expectativas y ritmo desde el diagnóstico inicial."],
  ["¿Cómo funciona la garantía?", "Si la persona contratada sale durante los primeros 3 meses, repetimos la búsqueda sin honorarios adicionales en los servicios donde la garantía forme parte del alcance acordado."],
  ["¿Trabajan con startups y PyMEs?", "Sí. Adaptamos el proceso a la etapa, estructura, volumen y urgencia de cada empresa."],
];

const servicesEn = [
  ["Specialized search", "We find professional and specialized talent across engineering, technology, product, data, design, marketing, sales, and other business-critical functions."],
  ["Tailored process, no shortcuts", "Every search is designed around the business context, culture, and real objectives."],
  ["Confidential searches", "Discreet market mapping and direct outreach to talent that is not actively looking."],
  ["3-month guarantee", "If the hire does not work out, we restart the search at no additional professional fee."],
];
const audiencesEn = [
  ["SMBs and growing companies", "Teams that need key talent without turning every opening into an improvised process."],
  ["Scaling teams", "Companies looking for specialized professionals who can strengthen the team and accelerate results."],
  ["Critical searches", "Strategic, confidential, or difficult-to-fill positions that traditional channels do not reach."],
];
const stepsEn = [
  ["Discovery", "We understand the challenge, team, culture, and ideal profile."],
  ["Search", "Market mapping, research, and direct outreach."],
  ["3–5 candidate shortlist", "In-depth assessment and presentation of relevant candidates."],
  ["Support", "Interviews, closing, onboarding, and a 3-month guarantee."],
];
const faqsEn = [
  ["What roles do you recruit for?", "Our specialized searches cover professional and leadership roles in engineering, technology, product, data, design, marketing, sales, and other key functions. We also have a dedicated solution for operational and high-volume hiring in Mexico."],
  ["How long does a search take?", "It depends on the complexity. We align on expectations and pace during the initial discovery."],
  ["How does the guarantee work?", "When included in the agreed scope, if the hired candidate leaves during the first three months, we restart the search without an additional professional fee."],
  ["Do you work with startups and SMBs?", "Yes. We adapt the process to each company’s stage, structure, hiring volume, and urgency."],
];

function LanguageSwitch({english=false}){
  const select=language=>{localStorage.setItem("tiey-language",language);window.location.assign(language==="en"?"/en":"/")};
  return <div className="language-switch" role="group" aria-label="Language selector"><button className={!english?"active":""} onClick={()=>select("es")} aria-pressed={!english}>ES</button><span>·</span><button className={english?"active":""} onClick={()=>select("en")} aria-pressed={english}>EN</button></div>;
}

function Header({english=false}) {
  return <header className="nav">
    <a href="#top" className="brand" aria-label="Tiey — inicio"><img className="brand-real" src="/tiey-logo-real.svg" alt="Tiey" /></a>
    <nav><a href="#servicios">{english?"Services":"Servicios"}</a><a href="#proceso">{english?"Process":"Proceso"}</a><a href="#diferencia">{english?"Why Tiey":"Por qué Tiey"}</a><a href="#faq">FAQ</a></nav>
    <div className="nav-actions"><LanguageSwitch english={english}/><a className="nav-cta" href="#contacto">{english?"Let’s talk":"Hablemos"}</a></div>
  </header>;
}

function Hero({ variant,english=false }) {
  const roles = english?["specialized leader.","engineering leader.","Head of Product.","commercial leader."]:["líder especializado.", "líder de ingeniería.", "Head of Product.", "líder comercial."];
  const profileImages = ["/p2.jpg", "/p1.jpg", "/p7.jpg", "/p10.jpg"];
  const [role,setRole] = useState(0);
  useEffect(()=>{
    if(variant!=="3") return;
    const timer=setInterval(()=>setRole(v=>(v+1)%roles.length),2400);
    return()=>clearInterval(timer);
  },[variant]);
  return <section id="top" className="hero">
    <motion.div className="hero-copy" initial={{opacity:0,y:28}} animate={{opacity:1,y:0}} transition={{duration:.8}}>
      <span className="eyebrow">{english?"NEARSHORE TALENT · MEXICO":"BÚSQUEDA DE TALENTO · MÉXICO"}</span>
      <h1>{english?"Find your next ":"Encuentra a tu próximo "}<em className="role-slot"><span key={role} className="role-cycle">{variant==="3"?roles[role]:roles[0]}</span></em></h1>
      {variant === "3" && <span className="hero-thesis">{english?"We find the person who changes the team.":"Encontramos a la persona que cambia el equipo."}</span>}
      <p>{english?<><strong>Boutique recruiting</strong> from Monterrey, Mexico, for U.S. companies building nearshore teams. Tailored searches, carefully selected candidates, and direct communication.</>:<>Somos una <strong>firma boutique</strong> de búsqueda de talento profesional y especializado. Trabajamos búsquedas a medida y contamos con una línea específica para reclutamiento operativo y de volumen.</>}</p>
      <div className="hero-actions"><a href="#contacto" className="primary">{english?"Tell us what you’re hiring for":"Cuéntanos tu búsqueda"} <span>→</span></a><a href="#proceso" className="text-link">{english?"See our process":"Conoce el proceso"}</a></div>
      <div className="proof"><div>{english?<>Specialized<br/>search</>:<>Búsqueda<br/>especializada</>}</div><div>{english?<>Tailored process<br/>without shortcuts</>:<>Proceso a medida<br/>y sin atajos</>}</div><div>{english?<>Up to<br/><strong>3-month guarantee*</strong></>:<>Garantía de<br/><strong>3 meses*</strong></>}</div></div>
    </motion.div>
    <motion.div className={`hero-visual ${variant === "3" ? "search-visual" : ""}`} initial={{opacity:0,scale:.96}} animate={{opacity:1,scale:1}} transition={{duration:1,delay:.2}}>
      {variant !== "3" ? <><div className="letter">T</div><img src="/p1.jpg" alt="Líder especializado" /></> : <>
        <div className="search-label"><span>{english?"ACTIVE SEARCH":"BÚSQUEDA ACTIVA"}</span><b>{roles[role].replace(".","")}</b></div>
        <div className="profile-stack">
          {profileImages.map((src,i)=><figure key={src} className="profile-preview" style={{"--slot":i}}><img src={src} alt="Perfil evaluado"/></figure>)}
          <figure className="selected"><div className="profile-fade">{profileImages.map((src,i)=><img key={src} className={i===role?"active":""} src={src} alt={i===role?roles[role]:""}/>)}</div><figcaption><span>{english?"SELECTED PROFILE":"PERFIL SELECCIONADO"}</span><b>{english?"Context match":"Match de contexto"}</b></figcaption></figure>
          <div className="scan-line" />
        </div>
        <div className="search-progress"><span /><small>{english?"Mapping · Assessment · Shortlist":"Mapeo · Evaluación · Shortlist"}</small></div>
      </>}
    </motion.div>
    {variant === "3" && <div className="roles"><div className="roles-track">{[0,1].map(copy=><div className="roles-set" key={copy} aria-hidden={copy===1}>{(english?["ENGINEERING","PRODUCT","DATA","DESIGN","MARKETING","SALES"]:["INGENIERÍA","PRODUCTO","DATOS","DISEÑO","MARKETING","COMERCIAL"]).map(label=><span key={`${copy}-${label}`}>{label}</span>)}</div>)}</div></div>}
  </section>;
}

function Services({english=false}) {
  const [open,setOpen] = useState(0);
  const services=english?servicesEn:servicesEs;
  return <section id="servicios" className="section services"><div className="section-head"><span className="eyebrow">{english?"SERVICES":"SERVICIOS"}</span><h2>{english?<>Searches that create <em>real impact.</em></>:<>Búsquedas que generan <em>impacto real.</em></>}</h2><p>{english?"We work within your context to find the person who can accelerate what comes next.":"Nos integramos a tu contexto para encontrar a quien puede acelerar la siguiente etapa."}</p></div>
    <div className="accordion">{services.map((s,i)=><button key={s[0]} onClick={()=>setOpen(i)} className={open===i?"open":""} aria-expanded={open===i}><span className="num">0{i+1}</span><span className="service-copy"><strong>{s[0]}</strong><AnimatePresence initial={false}>{open===i&&<motion.small initial={{height:0,opacity:0}} animate={{height:"auto",opacity:1}} exit={{height:0,opacity:0}}>{s[1]}</motion.small>}</AnimatePresence></span><span className="plus">{open===i?"−":"+"}</span></button>)}</div>
  </section>;
}

function CommercialServices({english=false}){
  return <section id="soluciones-tiey" className="commercial-services" aria-labelledby="commercial-services-title">
    <div className="commercial-services__head">
      <span className="eyebrow">{english?"TIEY SOLUTIONS":"SOLUCIONES TIEY"}</span>
      <h2 id="commercial-services-title">{english?<>Different talent challenges. <em>A solution for every context.</em></>:<>Distintos retos de talento. <em>Una solución para cada contexto.</em></>}</h2>
      <p>{english?"From specialized positions and nearshore teams to operational hiring, training, and recruiting technology.":"Desde posiciones especializadas hasta contratación operativa, capacitación y tecnología aplicada al reclutamiento."}</p>
    </div>
    <div className="commercial-services__grid">
      <a href={english?"#contacto":"/reclutamiento-especializado/"}><small>01</small><strong>{english?"Specialized recruiting":"Reclutamiento especializado"}</strong><span>{english?"Active search for professional, critical, and leadership roles.":"Búsqueda activa para posiciones profesionales, críticas y de liderazgo."}</span><b>→</b></a>
      <a href={english?"#contacto":"/reclutamiento-operativo/"}><small>02</small><strong>{english?"Nearshore talent in Mexico":"Reclutamiento operativo y volumen"}</strong><span>{english?"Carefully selected professionals aligned with U.S. time zones and business needs.":"Procesos para operadores, almacén, ayudantes y necesidades de contratación recurrente."}</span><b>→</b></a>
      <a href={english?"#contacto":"/ia-recruiting/"}><small>03</small><strong>{english?"Recruiting technology":"IA Recruiting"}</strong><span>{english?"Automation and technology for repetitive recruiting workflows.":"Automatización y tecnología aplicada a procesos repetitivos de reclutamiento operativo."}</span><b>→</b></a>
      <a href={english?"#contacto":"/capacitacion/"}><small>04</small><strong>{english?"Operational and volume hiring":"Capacitación"}</strong><span>{english?"Structured processes for recurring and high-volume hiring needs in Mexico.":"Formación práctica para fortalecer procesos, equipos y capacidades de talento."}</span><b>→</b></a>
    </div>
  </section>;
}

function Audience({english=false}) { const audiences=english?audiencesEn:audiencesEs; return <section className="section audience"><div className="section-head"><span className="eyebrow">{english?"WHO WE WORK WITH":"PARA QUIÉN TRABAJAMOS"}</span><h2>{english?<>When generic recruiting <em>is no longer enough.</em></>:<>Cuando una contratación genérica <em>ya no es suficiente.</em></>}</h2></div><div className="columns">{audiences.map((a,i)=><motion.article key={a[0]} whileHover={{y:-6}}><span>0{i+1}</span><h3>{a[0]}</h3><p>{a[1]}</p></motion.article>)}</div></section> }

function Process({english=false}) { const steps=english?stepsEn:stepsEs; return <section id="proceso" className="section process"><div className="section-head"><span className="eyebrow">{english?"OUR PROCESS":"NUESTRO PROCESO"}</span><h2>{english?<>A clear process. <em>Lasting results.</em></>:<>Un proceso claro. <em>Resultados que se quedan.</em></>}</h2></div><div className="timeline">{steps.map((s,i)=><motion.article key={s[0]} initial={{opacity:.45}} whileInView={{opacity:1}} whileHover={{y:-9}} transition={{duration:.3,ease:[.22,1,.36,1]}} viewport={{once:true,amount:.8}}><span>0{i+1}</span><h3>{s[0]}</h3><p>{s[1]}</p></motion.article>)}</div></section> }

function Results({variant,english=false}) { if(variant!=="3") return null; return <section className="section results"><div className="result-intro"><span className="eyebrow">{english?"WHAT TO EXPECT":"LO QUE PUEDES ESPERAR"}</span><h2>{english?<>Less noise.<br/><em>Better decisions.</em></>:<>Menos ruido.<br/><em>Mejores decisiones.</em></>}</h2></div><div className="result-metrics"><article><strong>3–5</strong><span>{english?"relevant candidates in specialized searches":"perfiles relevantes en búsquedas especializadas"}</span></article><article><strong>1:1</strong><span>{english?"direct communication throughout the search":"comunicación directa durante la búsqueda"}</span></article><article><strong>{english?"3 months*":"3 meses*"}</strong><span>{english?"guarantee when included in the agreed service":"de garantía cuando forme parte del servicio acordado"}</span></article></div></section> }

function Difference({ variant,english=false }) { return <section id="diferencia" className="section difference">{variant === "3" && <img src="/p7.jpg" alt={english?"Business leader at work":"Líder en contexto de trabajo"}/>}<div className="difference-copy"><span className="eyebrow">{english?"WHY TIEY":"NUESTRA DIFERENCIA"}</span><h2>{english?<>We do not send résumés.<br/><em>We build the right search.</em></>:<>No enviamos currículums.<br/><em>Construimos la búsqueda correcta.</em></>}</h2><div className="manifesto"><div><b>{english?"Tailored process":"Proceso a medida"}</b><p>{english?"Every search starts from the business context.":"Cada búsqueda comienza desde cero."}</p></div><div><b>{english?"Human assessment":"Evaluación humana"}</b><p>{english?"Interviews and contextual evaluation for every candidate.":"Entrevistas y revisión de contexto según el tipo de búsqueda."}</p></div><div><b>{english?"Direct communication":"Comunicación directa"}</b><p>{english?"You speak directly with the person leading the search.":"Hablas con quien conduce la búsqueda."}</p></div><div><b>{english?"Guarantee":"Garantía"}</b><p>{english?"Defined according to the agreed service and scope.":"Se define de acuerdo con el servicio y alcance contratado."}</p></div></div></div></section> }

function FAQ({english=false}) { const [open,setOpen]=useState(null); const faqs=english?faqsEn:faqsEs; return <section id="faq" className="section faq"><div className="section-head"><span className="eyebrow">{english?"FREQUENTLY ASKED QUESTIONS":"PREGUNTAS FRECUENTES"}</span><h2>{english?"The details, clearly explained.":"Resolvemos tus dudas."}</h2></div><div>{faqs.map((f,i)=><button key={f[0]} onClick={()=>setOpen(open===i?null:i)} aria-expanded={open===i}><span>{f[0]}</span><b>{open===i?"−":"+"}</b>{open===i&&<motion.p initial={{opacity:0}} animate={{opacity:1}}>{f[1]}</motion.p>}</button>)}</div></section> }

function Contact({english=false}) {
  const [status,setStatus]=useState("idle");
  const [message,setMessage]=useState("");
  const submit=async e=>{
    e.preventDefault();
    if(!e.currentTarget.reportValidity()) return;
    setStatus("sending"); setMessage("");
    const form=new FormData(e.currentTarget);
    const payload=Object.fromEntries(form.entries());

    if(payload.website){window.location.assign(english?"/en/thanks":"/gracias");return;}
    const accessKey=import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
    if(!accessKey){setStatus("error");setMessage(english?"We couldn’t send the form. Email us at hola@tiey.cc.":"No pudimos enviar el formulario. Escríbenos a hola@tiey.cc.");return;}
    try{
      const response=await fetch("https://api.web3forms.com/submit",{method:"POST",headers:{"Content-Type":"application/json","Accept":"application/json"},body:JSON.stringify({access_key:accessKey,subject:`Nueva solicitud desde tiey.cc — ${payload.empresa || "Contacto"}`,from_name:"Tiey — Formulario web",name:payload.nombre,email:payload.email,empresa:payload.empresa,telefono:payload.telefono || "",puesto:payload.puesto,message:payload.mensaje || "Sin mensaje adicional",privacy_consent:payload.privacy_consent})});
      const data=await response.json();
      if(!response.ok||!data.success) throw new Error("submit");
      window.va?.("event",{name:"contact_form_success"});window.location.assign(english?"/en/thanks":"/gracias");
    }catch{setStatus("error");setMessage(english?"We couldn’t send the form. Email us at hola@tiey.cc.":"No pudimos enviar el formulario. Escríbenos a hola@tiey.cc.");}
  };
  return <section id="contacto" className="section contact"><div><span className="eyebrow">{english?"LET’S TALK":"HABLEMOS"}</span><h2>{english?<>Tell us what you <em>need to solve.</em></>:<>Hablemos de lo que <em>necesitas resolver.</em></>}</h2><p>{english?"Tell us about the role, team, or hiring challenge. We’ll get back to you within one business day.":"Cuéntanos sobre la vacante, volumen, capacitación o proceso que quieres mejorar y responderemos en menos de 24 horas."}</p><a href="mailto:hola@tiey.cc">hola@tiey.cc</a><a href="https://tiey.cc">tiey.cc</a></div><form onSubmit={submit}><div><label>{english?"Full name":"Nombre completo"}<input name="nombre" autoComplete="name" required maxLength="100"/></label><label>{english?"Work email":"Correo corporativo"}<input name="email" type="email" autoComplete="email" required maxLength="160"/></label></div><div><label>{english?"Company":"Empresa"}<input name="empresa" autoComplete="organization" required maxLength="120"/></label><label>{english?"Phone":"Teléfono"} <small>({english?"optional":"opcional"})</small><input name="telefono" type="tel" autoComplete="tel" maxLength="30"/></label></div><label>{english?"Role or service you need":"Vacante o servicio que necesitas"}<input name="puesto" required maxLength="140" placeholder={english?"e.g. Product Engineer, design team, nearshore hiring...":"Ej. Ingeniero de calidad, 20 operadores, capacitación..."}/></label><label>{english?"Tell us about the challenge":"Cuéntanos sobre el reto"}<textarea name="mensaje" placeholder={english?"Context, location, team, or hiring need":"Contexto, ubicación, volumen o necesidad"} maxLength="2000"/></label><label className="hp-field" aria-hidden="true">Website<input name="website" tabIndex="-1" autoComplete="off"/></label><label className="consent"><input name="privacy_consent" type="checkbox" value="accepted" required/><span>{english?"I have read and accept the ":"He leído y acepto el "}<a href="/privacidad">{english?"privacy notice":"aviso de privacidad"}</a>.</span></label><button className="primary" disabled={status==="sending"}>{status==="sending"?(english?"Sending…":"Enviando…"):(english?"Send inquiry":"Enviar solicitud")} <span>→</span></button>{message&&<p className={`form-status ${status}`} role="status">{message}</p>}</form></section>
}

function Footer({english=false}){ return <footer><a href={english?"/en":"/"} aria-label="Tiey — home"><img className="brand-real footer-logo" src="/tiey-logo-real.svg" alt="Tiey" /></a><p>{english?"Specialized recruiting and nearshore talent solutions from Mexico.":"Reclutamiento especializado, operativo y soluciones para equipos de talento."}</p><div><a href={english?"/en#servicios":"/#servicios"}>{english?"Services":"Servicios"}</a><a href={english?"/en#proceso":"/reclutamiento-operativo/"}>{english?"Process":"Operativo"}</a><a href={english?"/en#diferencia":"/ia-recruiting/"}>{english?"Why Tiey":"IA Recruiting"}</a><a href={english?"/en#contacto":"/capacitacion/"}>{english?"Contact":"Capacitación"}</a><a href="/privacidad">{english?"Privacy":"Privacidad"}</a><a href="/terminos">{english?"Terms":"Términos"}</a></div><small>© 2026 Tiey. {english?"All rights reserved.":"Todos los derechos reservados."}</small></footer> }
function SetPageMeta({title,description,robots="index,follow",language="es",canonical}){useEffect(()=>{document.title=title;document.documentElement.lang=language==="en"?"en-US":"es-MX";document.querySelector('meta[name="description"]')?.setAttribute("content",description);document.querySelector('meta[name="robots"]')?.setAttribute("content",robots);document.querySelector('link[rel="canonical"]')?.setAttribute("href",canonical||"https://www.tiey.cc/");window.scrollTo(0,0)},[title,description,robots,language,canonical]);return null}
function InnerHeader(){return <header className="nav"><a href="/" className="brand" aria-label="Tiey — inicio"><img className="brand-real" src="/tiey-logo-real.svg" alt="Tiey"/></a><a className="nav-cta" href="/#contacto">Hablemos</a></header>}
function LegalPage({type}){const privacy=type==="privacy";return <main className="concept human"><SetPageMeta title={`${privacy?"Aviso de privacidad":"Términos de uso"} — Tiey`} description={`${privacy?"Aviso de privacidad":"Términos de uso"} del sitio web de Tiey.`}/><InnerHeader/><article className="legal"><span className="eyebrow">INFORMACIÓN LEGAL</span><h1>{privacy?"Aviso de privacidad":"Términos de uso"}</h1>{privacy?<><p>Tiey, persona física con domicilio en Apodaca, Nuevo León, México, es responsable del tratamiento de los datos personales que recibimos mediante este sitio.</p><h2>Datos y finalidad</h2><p>Podemos tratar nombre, correo, teléfono, empresa, puesto y la información que compartas para responder tu solicitud, evaluar la búsqueda de talento y mantener comunicación relacionada con nuestros servicios.</p><h2>Transferencias y conservación</h2><p>Utilizamos proveedores tecnológicos necesarios para recibir y alojar la información. Conservaremos tus datos sólo durante el tiempo razonablemente necesario para atender la solicitud y cumplir obligaciones aplicables.</p><h2>Tus derechos</h2><p>Puedes solicitar acceso, rectificación, cancelación u oposición, así como revocar tu consentimiento, escribiendo a <a href="mailto:hola@tiey.cc">hola@tiey.cc</a>. Indicaremos cualquier actualización material de este aviso en esta página.</p></>:<><p>Al navegar en tiey.cc aceptas usar el sitio únicamente con fines lícitos. La información publicada es general y no constituye una oferta contractual.</p><h2>Servicios y contenidos</h2><p>El alcance, honorarios, tiempos, garantías y condiciones de cada servicio se establecerán por escrito con cada cliente. Las marcas, textos y elementos visuales del sitio pertenecen a Tiey o se utilizan con autorización.</p><h2>Disponibilidad y contacto</h2><p>Podemos actualizar o suspender contenidos del sitio. Para preguntas sobre estos términos, escribe a <a href="mailto:hola@tiey.cc">hola@tiey.cc</a>.</p></>}</article><Footer/></main>}
function Thanks({english=false}){return <main className="concept human"><SetPageMeta title={english?"Inquiry received — Tiey":"Solicitud recibida — Tiey"} description={english?"Confirmation that your inquiry was sent to Tiey.":"Confirmación de solicitud enviada a Tiey."} robots="noindex,nofollow" language={english?"en":"es"}/><InnerHeader/><section className="status-page"><span className="eyebrow">{english?"INQUIRY RECEIVED":"SOLICITUD RECIBIDA"}</span><h1>{english?"Thank you for telling us what you need.":"Gracias por contarnos lo que necesitas."}</h1><p>{english?"We’ll review the context and contact you within one business day.":"Revisaremos el contexto y te contactaremos en menos de 24 horas."}</p><a className="primary" href={english?"/en":"/"}>{english?"Back to home":"Volver al inicio"} <span>→</span></a></section><Footer english={english}/></main>}
function NotFound(){return <main className="concept human"><SetPageMeta title="Página no encontrada — Tiey" description="La página solicitada no existe." robots="noindex,nofollow"/><InnerHeader/><section className="status-page"><span className="eyebrow">ERROR 404</span><h1>Esta página no existe.</h1><p>Regresa al inicio o cuéntanos qué necesitas resolver.</p><a className="primary" href="/">Volver al inicio <span>→</span></a></section><Footer/></main>}

export default function App(){
  const n="3";
  const path=window.location.pathname.replace(/\/$/,"")||"/";
  if(path==="/privacidad") return <LegalPage type="privacy"/>;
  if(path==="/terminos") return <LegalPage type="terms"/>;
  if(path==="/gracias") return <Thanks/>;
  if(path==="/en/thanks") return <Thanks english/>;
  if(path!=="/"&&path!=="/en") return <NotFound/>;
  const english=path==="/en";
  useEffect(()=>{
    const sections=[...document.querySelectorAll(".section")];
    const observer=new IntersectionObserver(entries=>entries.forEach(entry=>{if(entry.isIntersecting){entry.target.classList.add("is-visible");observer.unobserve(entry.target)}}),{threshold:.13,rootMargin:"0px 0px -40px"});
    sections.forEach(section=>observer.observe(section));return()=>observer.disconnect();
  },[]);
  const c=concepts[n];
  return <main className={`concept ${c.className}`}><SetPageMeta language={english?"en":"es"} canonical={english?"https://www.tiey.cc/en":"https://www.tiey.cc/"} title={english?"Nearshore Recruiting and Specialized Talent in Mexico | Tiey":"Reclutamiento Especializado y Headhunting en México | Tiey"} description={english?"Boutique nearshore recruiting firm in Mexico for U.S. companies hiring technology, engineering, product, design, data, and marketing talent.":"Firma boutique de reclutamiento especializado y headhunting en México. Búsqueda activa para tecnología, ingeniería, producto, UX/UI, diseño y marketing."}/><Header english={english}/><Hero variant={n} english={english}/><Services english={english}/><CommercialServices english={english}/><Audience english={english}/><Process english={english}/><Results variant={n} english={english}/><Difference variant={n} english={english}/><FAQ english={english}/><Contact english={english}/><Footer english={english}/></main>
}
