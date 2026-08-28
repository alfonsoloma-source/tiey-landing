const tarifa=[
[0.01,844.59,0,0.0192],[844.60,7168.51,16.22,0.064],[7168.52,12598.02,420.95,0.1088],[12598.03,14644.64,1011.68,0.16],[14644.65,17533.64,1339.14,0.1792],[17533.65,35362.83,1856.84,0.2136],[35362.84,55736.68,5665.16,0.2352],[55736.69,106410.50,10457.09,0.30],[106410.51,141880.66,25659.23,0.32],[141880.67,425641.99,37009.69,0.34],[425642,Infinity,133488.54,0.35]];
const UMA_D=117.31, UMA_M=3566.22, SUB_LIM=11492.66, SUB_M=536.22;
const $=id=>document.getElementById(id);const money=n=>new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN',maximumFractionDigits:0}).format(Math.max(0,n||0));
function isr(g){const b=tarifa.find(x=>g>=x[0]&&g<=x[1])||tarifa[tarifa.length-1];return b[2]+(g-b[0])*b[3]}
function imss(g){const daily=Math.min(g/30,UMA_D*25);const base=daily*30;const ordinary=base*0.02375;const excess=Math.max(0,daily-UMA_D*3)*30*0.004;return ordinary+excess}
function subsidy(g){return g<=SUB_LIM?SUB_M:0}
function fromGross(g){const i=isr(g),m=imss(g),s=subsidy(g);return{gross:g,isr:i,imss:m,subsidy:s,net:g-i-m+s}}
function grossForNet(target){let lo=0,hi=Math.max(target*2,20000);while(fromGross(hi).net<target&&hi<2000000)hi*=1.5;for(let k=0;k<60;k++){const mid=(lo+hi)/2;if(fromGross(mid).net<target)lo=mid;else hi=mid}return fromGross(hi)}
function render(){const mode=$('mode').value,a=+$('amount').value||0;const r=mode==='gross'?fromGross(a):grossForNet(a);$('amountLabel').textContent=mode==='gross'?'Sueldo bruto mensual':'Sueldo neto mensual objetivo';$('headline').textContent=money(mode==='gross'?r.net:r.gross);$('gross').textContent=money(r.gross);$('isr').textContent='− '+money(r.isr);$('imss').textContent='− '+money(r.imss);$('subsidy').textContent='+ '+money(r.subsidy);$('net').textContent=money(r.net)}
['mode','amount'].forEach(id=>$(id).addEventListener('input',render));render();