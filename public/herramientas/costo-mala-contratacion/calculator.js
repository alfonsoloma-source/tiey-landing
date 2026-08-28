const ids=['salary','months','recruit','onboarding','hours','hourValue','productivity','replaceMonths','vacancyFactor'];
const $=id=>document.getElementById(id);
const money=n=>new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN',maximumFractionDigits:0}).format(Math.max(0,n||0));
function calc(){
  const s=+$('salary').value||0,m=+$('months').value||0,r=+$('recruit').value||0,o=+$('onboarding').value||0,h=+$('hours').value||0,hv=+$('hourValue').value||0,p=+$('productivity').value||0,rm=+$('replaceMonths').value||0,vf=+$('vacancyFactor').value||0;
  const direct=r+o;
  const team=h*hv;
  const lost=s*m*(1-p);
  const replacement=r+(s*rm*vf);
  const total=direct+team+lost+replacement;
  const low=total*.8,high=total*1.25;
  $('direct').textContent=money(direct);$('team').textContent=money(team);$('lost').textContent=money(lost);$('replacement').textContent=money(replacement);$('total').textContent=money(total);$('range').textContent='Rango de sensibilidad: '+money(low)+' – '+money(high)+' MXN';
  const ratio=s?total/s:0;
  if(ratio>=6){$('riskTitle').textContent='Impacto muy alto';$('riskText').textContent='El impacto estimado equivale a más de seis meses de sueldo del puesto. Vale la pena revisar definición de perfil, evaluación y proceso de selección.'}else if(ratio>=3){$('riskTitle').textContent='Impacto relevante';$('riskText').textContent='El costo estimado representa varios meses de sueldo. Mejorar filtros, entrevistas y búsqueda puede reducir el riesgo de repetir el proceso.'}else{$('riskTitle').textContent='Impacto moderado';$('riskText').textContent='Incluso con un impacto moderado, existen costos de tiempo y productividad que normalmente no aparecen en el costo visible de contratación.'}
}
ids.forEach(id=>$(id).addEventListener('input',calc));calc();