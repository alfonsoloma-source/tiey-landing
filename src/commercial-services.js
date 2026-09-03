function mountCommercialServices(){
  if(window.location.pathname!=="/" || document.querySelector("#soluciones-tiey")) return;
  const services=document.querySelector("#servicios");
  if(!services) return;
  const section=document.createElement("section");
  section.id="soluciones-tiey";
  section.className="commercial-services";
  section.setAttribute("aria-labelledby","commercial-services-title");
  section.innerHTML=`
    <div class="commercial-services__head">
      <span class="eyebrow">SOLUCIONES TIEY</span>
      <h2 id="commercial-services-title">Distintos retos de talento. <em>Una solución para cada contexto.</em></h2>
      <p>Desde posiciones especializadas hasta contratación operativa, capacitación y tecnología aplicada al reclutamiento.</p>
    </div>
    <div class="commercial-services__grid">
      <a href="/reclutamiento-especializado/"><small>01</small><strong>Reclutamiento especializado</strong><span>Búsqueda activa para posiciones profesionales, críticas y de liderazgo.</span><b>→</b></a>
      <a href="/reclutamiento-operativo/"><small>02</small><strong>Reclutamiento operativo y volumen</strong><span>Procesos para operadores, almacén, ayudantes y necesidades de contratación recurrente.</span><b>→</b></a>
      <a href="/ia-recruiting/"><small>03</small><strong>IA Recruiting</strong><span>Automatización y tecnología aplicada a procesos repetitivos de reclutamiento operativo.</span><b>→</b></a>
      <a href="/capacitacion/"><small>04</small><strong>Capacitación</strong><span>Formación práctica para fortalecer procesos, equipos y capacidades de talento.</span><b>→</b></a>
    </div>`;
  services.insertAdjacentElement("afterend",section);
}

if(document.readyState==="loading") document.addEventListener("DOMContentLoaded",()=>setTimeout(mountCommercialServices,0));
else setTimeout(mountCommercialServices,0);
