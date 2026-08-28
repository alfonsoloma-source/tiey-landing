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
        <div class="client-proof__head">
          <span class="eyebrow">TRABAJO REAL · CLIENTE REAL</span>
          <h2 id="client-proof-title">Talento para distintas áreas <em>de un mismo equipo.</em></h2>
        </div>
        <div class="client-proof__case">
          <div class="client-proof__brand">
            <div>
              <small>CASO 01 · RAIDAR</small>
              <a class="client-proof__logo-wrap" href="https://raidar.io/es" target="_blank" rel="noopener noreferrer" aria-label="Visitar sitio de Raidar">
                <img class="client-proof__logo" src="https://raidar.io/logos/raidar-full-dark.png" alt="Raidar" loading="lazy" />
              </a>
            </div>
            <div><strong>03</strong><span>posiciones cubiertas</span></div>
          </div>
          <div class="client-proof__story">
            <h3>Tres búsquedas. Tres necesidades diferentes.</h3>
            <p>Apoyamos a Raidar en la búsqueda y contratación de talento para diseño, tecnología y administración, cubriendo tres posiciones con perfiles y necesidades distintas.</p>
            <div class="client-proof__roles">
              <div><small>01 · DISEÑO</small><b>UX/UI Design</b></div>
              <div><small>02 · TECNOLOGÍA</small><b>Mobile Development</b></div>
              <div><small>03 · ADMINISTRACIÓN</small><b>Administración</b></div>
            </div>
            <small class="client-proof__note">Nombre y logotipo publicados con autorización del cliente.</small>
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
