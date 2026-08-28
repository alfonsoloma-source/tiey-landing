const $$=(s)=>[...document.querySelectorAll(s)];
const $=(id)=>document.getElementById(id);

const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let motionRunning=false;

async function playMotion(){
  if(motionRunning)return;
  motionRunning=true;
  const messages=$$('.msg');
  const fields=$$('.data');
  const times=$$('.timeline [data-time]');
  messages.forEach(x=>x.classList.remove('show'));
  fields.forEach(x=>x.classList.remove('done'));
  times.forEach(x=>x.classList.remove('done'));
  $('reviewCard').classList.remove('done');
  $('workspace').classList.remove('active');
  $('progressBar').style.width='0%';
  $('wsStatus').textContent='capturando información';
  $('typing').classList.remove('show');
  if(reduced){
    messages.forEach(x=>x.classList.add('show'));
    fields.forEach(x=>x.classList.add('done'));
    times.forEach(x=>x.classList.add('done'));
    $('workspace').classList.add('active');
    $('progressBar').style.width='100%';
    $('reviewCard').classList.add('done');
    $('wsStatus').textContent='listo para revisión';
    motionRunning=false;
    return;
  }
  await sleep(450);
  times[0]?.classList.add('done');
  $('workspace').classList.add('active');
  for(let i=0;i<messages.length;i++){
    $('typing').classList.add('show');
    await sleep(i===0?650:520);
    $('typing').classList.remove('show');
    messages[i].classList.add('show');
    if(i===0)times[1]?.classList.add('done');
    if(i===3){fields[0]?.classList.add('done');fields[1]?.classList.add('done');$('progressBar').style.width='48%'}
    if(i===5){fields[2]?.classList.add('done');$('progressBar').style.width='76%'}
    if(i===6){fields[3]?.classList.add('done');$('progressBar').style.width='100%';times[2]?.classList.add('done');await sleep(500);$('reviewCard').classList.add('done');$('wsStatus').textContent='listo para revisión';times[3]?.classList.add('done')}
    await sleep(i%2===0?750:520);
  }
  await sleep(2800);
  motionRunning=false;
  playMotion();
}

const stage=$('motionStage');
if(stage){
  const observer=new IntersectionObserver(entries=>{
    if(entries.some(e=>e.isIntersecting)){
      observer.disconnect();
      playMotion();
    }
  },{threshold:.25});
  observer.observe(stage);
}

const problems=$$('.problem input');
function diagnose(){
  const checked=problems.filter(x=>x.checked);
  const n=checked.length;
  $$('.problem').forEach(x=>x.classList.toggle('active',x.querySelector('input').checked));
  $('diagEmpty').hidden=!!n;
  $('diagResult').hidden=!n;
  if(!n)return;
  let title='Hay una oportunidad puntual para automatizar.';
  let detail='Un flujo pequeño puede quitar trabajo repetitivo sin cambiar tu proceso completo.';
  if(n>=3&&n<=4){title='Tu equipo ya tiene suficiente operación manual para justificar un workflow.';detail='Conviene mapear entrada de candidatos, conversación, seguimiento y agenda para priorizar las automatizaciones con mayor impacto.'}
  if(n>=5){title='Tu proceso tiene varios puntos claros de automatización.';detail='Aquí tendría sentido diseñar un flujo end-to-end por etapas, conservando revisión humana en filtros sensibles y decisiones de avance.'}
  $('diagText').textContent=title;
  $('diagDetail').textContent=detail;
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