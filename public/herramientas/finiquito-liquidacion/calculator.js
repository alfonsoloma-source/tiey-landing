const $=id=>document.getElementById(id);const money=n=>new Intl.NumberFormat('es-MX',{style:'currency',currency:'MXN',maximumFractionDigits:0}).format(Math.max(0,n||0));
function vacDaysForYear(y){if(y<=1)return 12;if(y<=5)return 12+(y-1)*2;return 20+Math.floor((y-5)/5)*2}
function calc(){
 const scenario=$('scenario').value,salary=+$('salary').value||0,daily=salary/30,pendingDays=+$('pendingDays').value||0,calendarDays=Math.min(365,+$('calendarDays').value||0),years=Math.max(0,+$('years').value||0),serviceDays=Math.min(365,+$('serviceDays').value||0),bonusDays=+$('bonusDays').value||15,vacPremium=(+$('vacPremium').value||25)/100,minWage=+$('minWage').value||0,include20=$('include20').checked;
 const currentYear=Math.max(1,Math.floor(years)+1);const entitlement=vacDaysForYear(currentYear);
 const integrationFactor=1+(bonusDays/365)+(entitlement*vacPremium/365);const integratedDaily=daily*integrationFactor;
 const pending=daily*pendingDays;const bonus=daily*bonusDays*(calendarDays/365);const vacation=daily*entitlement*(serviceDays/365);const premium=vacation*vacPremium;const finiquito=pending+bonus+vacation+premium;
 let three=0,twenty=0,seniority=0;if(scenario==='dismissal'){three=integratedDaily*90;if(include20)twenty=integratedDaily*20*years;const seniorityDaily=Math.min(daily,minWage*2);seniority=seniorityDaily*12*years}
 $('pending').textContent=money(pending);$('bonus').textContent=money(bonus);$('vacation').textContent=money(vacation);$('premium').textContent=money(premium);$('threeMonths').textContent=money(three);$('twenty').textContent=money(twenty);$('seniority').textContent=money(seniority);$('total').textContent=money(finiquito+three+twenty+seniority);
 const show=scenario==='dismissal';['threeRow','twentyRow','seniorityRow','liqLabel','twentyWrap'].forEach(id=>$(id).style.display=show?'flex':'none');if(show)$('liqLabel').style.display='block'
}
['scenario','salary','pendingDays','calendarDays','years','serviceDays','bonusDays','vacPremium','minWage','include20'].forEach(id=>$(id).addEventListener('input',calc));calc();