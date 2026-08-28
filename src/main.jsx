import React, { useEffect } from "react";
import ReactDOM from "react-dom/client";
import { Analytics } from "@vercel/analytics/react";
import App from "./App.jsx";

function Site(){
  useEffect(()=>{
    if(window.location.pathname !== "/") return;
    const nav=document.querySelector("header.nav nav");
    if(!nav || nav.querySelector('[data-tiey-extra]')) return;
    const training=document.createElement("a");
    training.href="/capacitacion/"; training.textContent="Capacitación"; training.dataset.tieyExtra="true";
    const ai=document.createElement("a");
    ai.href="/ia-recruiting/"; ai.textContent="IA Recruiting"; ai.dataset.tieyExtra="true";
    const tools=document.createElement("a");
    tools.href="/herramientas/"; tools.textContent="Herramientas"; tools.dataset.tieyExtra="true";
    nav.append(training,ai,tools);
  },[]);
  return <><App/><Analytics/></>;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode><Site/></React.StrictMode>
);
