import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import App from "./App.jsx";
import "./client-proof.css";

function Site(){
  useEffect(()=>{
    if(window.location.pathname !== "/") return;
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
        <div class="client-proof__intro">
          <span class="eyebrow">CLIENTES</span>
          <h2 id="client-proof-title">Empresas que han confiado <em>en Tiey.</em></h2>
        </div>
        <div class="client-proof__case">
          <div class="client-proof__identity">
            <a class="client-proof__logo-wrap" href="https://raidar.io/es" target="_blank" rel="noopener noreferrer" aria-label="Visitar sitio de Raidar">
              <img class="client-proof__logo" src="https://raidar.io/_next/image?q=75&url=%2Flogos%2Fraidar-full-dark.png&w=384" alt="Raidar" loading="lazy" />
            </a>
            <div class="client-proof__count"><strong>3</strong><span>contrataciones</span></div>
          </div>
          <div class="client-proof__detail">
            <p>Para Raidar cubrimos posiciones en tres áreas distintas:</p>
            <div class="client-proof__roles">
              <span>UX/UI Design</span>
              <span>Mobile Development</span>
              <span>Administración</span>
            </div>
          </div>
        </div>`;
      results.insertAdjacentElement("afterend",proof);
    }
  },[]);
  return <><App/><Analytics/></>;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode><Site/></React.StrictMode>
);
