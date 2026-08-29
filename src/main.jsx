import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import posthog from "posthog-js";
import App from "./App.jsx";
import "./client-proof.css";
import "./site-enhancements.css";
import "./signature-moments.css";
import { initSiteEnhancements } from "./site-enhancements.js";
import { initSignatureMoments } from "./signature-moments.js";

const posthogKey=import.meta.env.VITE_POSTHOG_KEY;
if(posthogKey){
  posthog.init(posthogKey,{
    api_host:import.meta.env.VITE_POSTHOG_HOST || "https://us.i.posthog.com",
    capture_pageview:true,
    capture_pageleave:true,
    autocapture:true,
    person_profiles:"identified_only"
  });
  window.tieyTrack=(event,properties={})=>posthog.capture(event,properties);
}

function Site(){
  useEffect(()=>{
    const track=window.tieyTrack;
    const clickHandler=e=>{
      const link=e.target.closest("a");
      if(!link||!track) return;
      const href=link.getAttribute("href")||"";
      if(href==="#contacto") track("contact_cta_clicked",{label:link.textContent?.trim(),path:window.location.pathname});
      if(href.startsWith("mailto:")) track("email_cta_clicked",{path:window.location.pathname});
      if(/wa\.me|whatsapp/i.test(href)) track("whatsapp_cta_clicked",{path:window.location.pathname});
      if(href.includes("/ia-recruiting")) track("service_interest",{service:"ia_recruiting",path:window.location.pathname});
      if(href.includes("/capacitacion")) track("service_interest",{service:"capacitacion",path:window.location.pathname});
      if(href.includes("/reclutamiento-operativo")) track("service_interest",{service:"reclutamiento_operativo",path:window.location.pathname});
    };
    document.addEventListener("click",clickHandler);

    if(window.location.pathname !== "/") return ()=>document.removeEventListener("click",clickHandler);
    const nav=document.querySelector("header.nav nav");
    if(nav && !nav.querySelector('[data-tiey-extra]')){
      const training=document.createElement("a");
      training.href="/capacitacion/"; training.textContent="Capacitación"; training.dataset.tieyExtra="true";
      const ai=document.createElement("a");
      ai.href="/ia-recruiting/"; ai.textContent="IA Recruiting"; ai.dataset.tieyExtra="true";
      const tools=document.createElement("a");
      tools.href="/herramientas/"; tools.textContent="Herramientas"; tools.dataset.tieyExtra="true";
      nav.append(training,ai,tools);
    }

    const results=document.querySelector(".results");
    if(results && !document.querySelector(".client-proof")){
      const proof=document.createElement("section");
      proof.className="client-proof";
      proof.setAttribute("aria-labelledby","client-proof-title");
      proof.innerHTML=`
        <div class="client-proof__head">
          <span class="eyebrow">CASO DE CLIENTE</span>
          <h2 id="client-proof-title">Una búsqueda no siempre es <em>un solo perfil.</em></h2>
        </div>
        <div class="client-proof__case">
          <div class="client-proof__brand client-proof__brand--type">
            <div>
              <small>CLIENTE</small>
              <a class="client-proof__wordmark" href="https://raidar.io/es" target="_blank" rel="noopener noreferrer" aria-label="Visitar sitio de Raidar">Raidar<span>↗</span></a>
            </div>
            <div><strong>03</strong><span>contrataciones</span></div>
          </div>
          <div class="client-proof__story">
            <h3>Distintas áreas, un mismo equipo.</h3>
            <p>Raidar confió en Tiey para sumar talento en diseño UX/UI, desarrollo mobile y administración.</p>
            <div class="client-proof__roles">
              <div><small>01 · DISEÑO</small><b>UX/UI Design</b></div>
              <div><small>02 · TECNOLOGÍA</small><b>Mobile Development</b></div>
              <div><small>03 · ADMINISTRACIÓN</small><b>Administración</b></div>
            </div>
          </div>
        </div>`;
      results.insertAdjacentElement("afterend",proof);
    }

    const cleanupEnhancements=initSiteEnhancements();
    const cleanupSignature=initSignatureMoments();
    return ()=>{ document.removeEventListener("click",clickHandler); cleanupSignature?.(); cleanupEnhancements?.(); };
  },[]);
  return <><App/><Analytics/></>;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode><Site/></React.StrictMode>
);
