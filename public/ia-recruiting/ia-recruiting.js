const $$=(s)=>[...document.querySelectorAll(s)];
const $=(id)=>document.getElementById(id);
const problems=$$('.problem input');
function diagnose(){
  const n=problems.filter(x=>x.checked).length;
  $$('.problem').forEach(x=>x.classList.toggle('active',x.querySelector('input').checked));
  const box=$('diagnosis');
  if(!n){box.style.display='none';return}
  box.style.display='block';
  $('diagText').textContent=n===1?'Detectamos 1 punto con potencial de automatización.':`Detectamos ${n} puntos con potencial de automatización.`;
  $('diagDetail').textContent=n<=2?'Un flujo puntual podría eliminar parte de la operación repetitiva sin modificar todo tu proceso.':n<=4?'Tu proceso parece tener suficiente operación manual para evaluar un agente o workflow conectado.':'Hay una oportunidad clara de mapear el proceso completo y priorizar automatizaciones por impacto.';
}
problems.forEach(x=>x.addEventListener('change',diagnose));
const calcIds=['vacancies','candidates','review','conversations','conversationMinutes'];
function calculate(){
  const v=+$('vacancies').value||0,c=+$('candidates').value||0,r=+$('review').value||0,conv=+$('conversations').value||0,cm=+$('conversationMinutes').value||0;
  const totalMinutes=v*c*r+v*conv*cm;
  const hours=totalMinutes/60;
  const recoverable=hours*.55;
  $('hours').textContent=`${hours.toLocaleString('es-MX',{maximumFractionDigits:1})} h`;
  $('recoverable').textContent=`${recoverable.toLocaleString('es-MX',{maximumFractionDigits:1})} h`;
  $('days').textContent=(recoverable/8).toLocaleString('es-MX',{maximumFractionDigits:1});
}
calcIds.forEach(id=>$(id).addEventListener('input',calculate));
calculate();