/* ==========================================================
   Núcleo compartilhado entre o site (app.js) e o painel da
   equipe (equipe.js). Depende de config.js, carregado antes.

   Guarda o que as duas páginas precisam: utilidades de texto e
   moeda, leitura e gravação no localStorage, consultas ao
   catálogo e as regras da agenda.
   ========================================================== */

/* ---------- Utilidades ---------- */
const $=s=>document.querySelector(s);
const E=t=>String(t??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const brl=v=>'R$ '+Number(v).toFixed(2).replace('.',',');
const fd=d=>d.split('-').reverse().join('/');
const iso=d=>d.getFullYear()+'-'+String(d.getMonth()+1).padStart(2,'0')+'-'+String(d.getDate()).padStart(2,'0');
const waLink=t=>'https://wa.me/'+WHATS+'?text='+encodeURIComponent(t);

/* ---------- Armazenamento ---------- */
const KEY='salao_agendamentos';
let AG=[];try{AG=JSON.parse(localStorage.getItem(KEY)||'[]')}catch(e){}
const save=()=>{try{localStorage.setItem(KEY,JSON.stringify(AG))}catch(e){}};

/* ---------- Consultas ao catálogo ---------- */
const sv=id=>SV.find(x=>x.id==id), bb=id=>BB.find(x=>x.id==id);
/* nome e duração vêm do próprio registro: editar SV/BB depois
   não quebra agendamentos já feitos */
const nSv=a=>a.svn||sv(a.sv)?.n||'Serviço removido';
const nBb=a=>a.bn||bb(a.b)?.n||'Profissional removida';
const stCls=s=>'st st-'+s.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g,'');
const profs=s=>BB.filter(x=>!x.sv||x.sv.includes(Number(s)));

/* ---------- Agenda em blocos de 30 min (08:00 às 18:30) ---------- */
const SLOTS=[];for(let h=8;h<19;h++){const H=String(h).padStart(2,'0');SLOTS.push(H+':00',H+':30')}
const nS=id=>Math.ceil(sv(id).m/30);
const blocos=a=>Math.ceil((a.m||sv(a.sv)?.m||30)/30);
const ocupado=(b,d,t)=>{const i=SLOTS.indexOf(t);return AG.some(a=>{if(a.b!=b||a.d!==d||a.s==='Cancelado')return false;const j=SLOTS.indexOf(a.t);return i>=j&&i<j+blocos(a)})};
const livre=(b,d,t,s)=>{const i=SLOTS.indexOf(t),n=nS(s);if(i+n>SLOTS.length)return false;for(let k=0;k<n;k++)if(ocupado(b,d,SLOTS[i+k]))return false;return true};
