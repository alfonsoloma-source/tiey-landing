const $$=(s)=>[...document.querySelectorAll(s)];
const $=(id)=>document.getElementById(id);
const sleep=(ms)=>new Promise(r=>setTimeout(r,ms));
const reduced=window.matchMedia('(prefers-reduced-motion: reduce)').matches;
let motionRunning=false;

// Static-page commercial CTAs should always lead to the working Tiey form.
$$('a[href^="mailto:"]').forEach(a=>a.setAttribute('href','/#contacto'));

async function playMotion(){
 if(motionRunning)return; motionRunning=true;
 const messages=$$('.msg'),fields=$$('.data'),times=$$('.timeline [data-time]');
 messages.forEach(x=>x.classList.remove('show'));fields.forEach(x=>x.classList.remove('done'));times.forEach(x=>x.classList.remove('done'));
 $('reviewCard')?.classList.remove('done');$('workspace')?.classList.remove('active');$('typing')?.classList.remove('show');
 if($('progressBar'))$('progressBar').style.width='0%'; if($('wsStatus'))$('wsStatus').textContent='validando requisitos';
 const finish=()=>{messages.forEach(x=>x.classList.add('show'));fields.forEach(x=>x.classList.add('done'));times.forEach(x=>x.classList.add('done'));$('workspace')?.classList.add('active');if($('progressBar'))$('progressBar').style.width='100%';$('reviewCard')?.classList.add('done');if($('wsStatus'))$('wsStatus').textContent='entrevista confirmada'};
 if(reduced){finish();motionRunning=false;return}
 await sleep(400);times[0]?.classList.add('done');$('workspace')?.classList.add('active');
 for(let i=0;i<messages.length;i++){
   $('typing')?.classList.add('show');await sleep(i===0?650:390);$('typing')?.classList.remove('show');messages[i].classList.add('show');
   if(i===0)times[1]?.classList.add('done');
   if(i===1){fields[0]?.classList.add('done');if($('progressBar'))$('progressBar').style.width='18%'}
   if(i===3){fields[1]?.classList.add('done');if($('progressBar'))$('progressBar').style.width='34%'}
   if(i===5){fields[2]?.classList.add('done');if($('progressBar'))$('progressBar').style.width='52%'}
   if(i===7){fields[3]?.classList.add('done');times[2]?.classList.add('done');if($('progressBar'))$('progressBar').style.width='70%'}
   if(i===9){fields[4]?.classList.add('done');if($('progressBar'))$('progressBar').style.width='88%'}
   if(i===10){fields[5]?.classList.add('done');if($('progressBar'))$('progressBar').style.width='100%';$('reviewCard')?.classList.add('done');if($('wsStatus'))$('wsStatus').textContent='entrevista confirmada';times[3]?.classList.add('done')}
   await sleep(i%2===0?560:350);
 }
 await sleep(3000);motionRunning=false;playMotion();
}
const stage=$('motionStage');if(stage){const observer=new IntersectionObserver(entries=>{if(entries.some(e=>e.isIntersecting)){observer.disconnect();playMotion()}},{threshold:.2});observer.observe(stage)}
const problems=$$('.problem input');
function diagnose(){const n=problems.filter(x=>x.checked).length;$$('.problem').forEach(x=>x.classList.toggle('active',x.querySelector('input').checked));$('diagEmpty').hidden=!!n;$('diagResult').hidden=!n;if(!n)return;let title='Hay una oportunidad puntual para automatizar.',detail='Un flujo pequeño puede quitar seguimiento repetitivo sin cambiar toda tu operación.';if(n>=3&&n<=4){title='El volumen ya está generando suficiente trabajo manual para justificar automatización.';detail='Conviene conectar atención, prefiltro y agenda para que el equipo deje de repetir tareas y se concentre en entrevistas y contratación.'}if(n>=5){title='Tu operación tiene varios cuellos de botella automatizables.';detail='Aquí hace sentido diseñar un flujo de captación a entrevista, incluyendo seguimiento y recordatorios para reducir abandono y no-shows.'}$('diagText').textContent=title;$('diagDetail').textContent=detail}problems.forEach(x=>x.addEventListener('change',diagnose));
const calcIds=['vacancies','candidates','review','conversations','conversationMinutes'];function calculate(){const v=+$('vacancies').value||0,c=+$('candidates').value||0,r=+$('review').value||0,conv=+$('conversations').value||0,cm=+$('conversationMinutes').value||0;const hours=(v*c*r+v*conv*cm)/60,recoverable=hours*.55;$('hours').textContent=`${hours.toLocaleString('es-MX',{maximumFractionDigits:1})} h`;$('recoverable').textContent=`${recoverable.toLocaleString('es-MX',{maximumFractionDigits:1})} h`;$('days').textContent=(recoverable/8).toLocaleString('es-MX',{maximumFractionDigits:1})}calcIds.forEach(id=>$(id)?.addEventListener('input',calculate));calculate();