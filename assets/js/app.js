/* ==========================================================
   Studio Bella — lógica da página
   Depende de config.js (SENHA, WHATS, ENDERECO, SV, BB,
   DEPOIMENTOS) e de icons.js (icone), carregados antes.

   Os dados ficam em localStorage, ou seja, no navegador de
   quem agendou. Para o salão e as clientes verem a mesma
   agenda é necessário um backend.
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
const profs=s=>BB.filter(x=>!x.sv||x.sv.includes(Number(s)));

/* ---------- Agenda em blocos de 30 min (08:00 às 18:30) ---------- */
const SLOTS=[];for(let h=8;h<19;h++){const H=String(h).padStart(2,'0');SLOTS.push(H+':00',H+':30')}
const nS=id=>Math.ceil(sv(id).m/30);
const blocos=a=>Math.ceil((a.m||sv(a.sv)?.m||30)/30);
const ocupado=(b,d,t)=>{const i=SLOTS.indexOf(t);return AG.some(a=>{if(a.b!=b||a.d!==d||a.s==='Cancelado')return false;const j=SLOTS.indexOf(a.t);return i>=j&&i<j+blocos(a)})};
const livre=(b,d,t,s)=>{const i=SLOTS.indexOf(t),n=nS(s);if(i+n>SLOTS.length)return false;for(let k=0;k<n;k++)if(ocupado(b,d,SLOTS[i+k]))return false;return true};

/* ---------- Conteúdo vindo da configuração ---------- */
/* Serviços: card com ícone, duração e preço */
$('#svList').innerHTML=SV.map(x=>`<article class="card svc">
  <span class="ico-wrap">${icone(x.ic)}</span>
  <h3>${E(x.n)}</h3>
  <p class="dur">${x.m} min</p>
  <p class="price">${brl(x.p)}</p>
</article>`).join('');

/* Equipe: foto quando houver, senão um círculo com a inicial.
   As etiquetas saem da lista sv de cada profissional. */
const avatar=x=>x.foto
  ? `<img class="avatar" src="${E(x.foto)}" alt="${E(x.n)}" loading="lazy" width="84" height="84">`
  : `<div class="avatar" data-i="${(x.id-1)%3}" aria-hidden="true">${E(x.n[0])}</div>`;
$('#bbList').innerHTML=BB.map(x=>`<article class="card pro">
  ${avatar(x)}
  <h3>${E(x.n)}</h3>
  <p class="espec">${E(x.e)}</p>
  <ul class="tags">${(x.sv||SV.map(y=>y.id)).map(id=>sv(id)?`<li>${E(sv(id).n)}</li>`:'').join('')}</ul>
</article>`).join('');

/* Depoimentos */
$('#dpList').innerHTML=DEPOIMENTOS.map(d=>`<article class="card dep">
  <p class="estrelas" aria-label="${d.s} de 5 estrelas">${'\u2605'.repeat(d.s)}${'\u2606'.repeat(5-d.s)}</p>
  <blockquote>${E(d.t)}</blockquote>
  <p class="autor">${E(d.n)}</p>
</article>`).join('');
$('#fab').href=waLink('Olá! Gostaria de informações sobre horários na Studio Bella.');
$('#mapa').href='https://www.google.com/maps/search/?api=1&query='+encodeURIComponent(ENDERECO);
$('#tel').href='tel:+'+WHATS;
$('#ano').textContent=new Date().getFullYear();

/* ==========================================================
   AGENDAMENTO EM 5 ETAPAS
   ========================================================== */
const TIT=['Escolha o serviço','Escolha a profissional','Escolha a data','Escolha o horário','Seus dados'];
let st=1,S={sv:0,bb:0,dt:'',tm:'',n:'',tel:'',em:''};
const opt=(k,v,inner)=>`<button class="opt ${S[k]==v?'on':''}" data-k="${k}" data-v="${v}" aria-pressed="${S[k]==v}">${inner}</button>`;
/* próximos 14 dias de atendimento, pulando domingo */
function days(){const out=[],d=new Date();while(out.length<14){if(d.getDay()!==0)out.push(new Date(d));d.setDate(d.getDate()+1)}return out}

function wiz(foco){
  let h=`<p class="step">Etapa ${st} de 5</p><h3 id="wizT" tabindex="-1">${TIT[st-1]}</h3>`;
  if(st===1)h+=SV.map(x=>opt('sv',x.id,`<b>${E(x.n)}</b><span>${x.m} min · ${brl(x.p)}</span>`)).join('');
  if(st===2){
    const l=profs(S.sv);
    h+=l.length?l.map(x=>opt('bb',x.id,`<b>${E(x.n)}</b><span>${E(x.e)}</span>`)).join('')
      :'<p style="color:var(--mut)">Nenhuma profissional cadastrada para esse serviço. Fale com o salão pelo WhatsApp.</p>';
  }
  if(st===3)h+='<p style="color:var(--mut);margin-bottom:10px">Atendemos de segunda a sábado.</p><div class="slots">'+days().map(d=>opt('dt',iso(d),d.toLocaleDateString('pt-BR',{weekday:'short',day:'2-digit',month:'2-digit'}))).join('')+'</div>';
  if(st===4){
    const now=new Date(),hoje=iso(now)===S.dt,cur=String(now.getHours()).padStart(2,'0')+':'+String(now.getMinutes()).padStart(2,'0');
    h+='<p style="color:var(--mut);margin-bottom:10px">Horários riscados estão ocupados ou não comportam a duração do serviço.</p><div class="slots">'+SLOTS.map(t=>{
      const dis=!livre(S.bb,S.dt,t,S.sv)||(hoje&&t<=cur);
      return `<button class="opt ${S.tm==t?'on':''}" data-k="tm" data-v="${t}" aria-pressed="${S.tm==t}"${dis?` disabled aria-label="${t} indisponível"`:''}>${t}</button>`;
    }).join('')+'</div>';
  }
  if(st===5){
    const x=sv(S.sv);
    h+=`<label for="fn">Nome completo</label><input id="fn" data-f="n" value="${E(S.n)}" autocomplete="name">
    <label for="ft">Telefone (WhatsApp)</label><input id="ft" data-f="tel" type="tel" inputmode="tel" value="${E(S.tel)}" autocomplete="tel">
    <label for="fe">E-mail</label><input id="fe" data-f="em" type="email" value="${E(S.em)}" autocomplete="email">
    <div class="sum"><b>Resumo do agendamento</b><br>${E(x.n)} com ${E(bb(S.bb).n)}<br>${fd(S.dt)} às ${S.tm}<br>${brl(x.p)}</div>`;
  }
  h+=`<p class="msg" id="msg" role="alert"></p><div class="nav"><button class="btn alt" id="back" ${st===1?'disabled':''}>Voltar</button><button class="btn" id="next">${st===5?'Confirmar agendamento':'Continuar'}</button></div>`;
  $('#wiz').innerHTML=h;
  /* o wizard é reconstruído a cada etapa, então o foco do teclado
     precisa ser recolocado à mão */
  if(foco==='t')$('#wizT').focus();
  /* preventScroll: a opção já está onde a pessoa clicou, não deve puxar a página */
  else if(foco){const el=$(`#wiz [data-k="${foco.k}"][data-v="${foco.v}"]`);if(el)el.focus({preventScroll:true})}
}

$('#wiz').addEventListener('click',e=>{
  const o=e.target.closest('[data-k]');
  if(o){
    const k=o.dataset.k,v=o.dataset.v;
    S[k]=(k==='sv'||k==='bb')?Number(v):v;
    /* trocar de serviço pode invalidar a profissional já escolhida */
    if(k==='sv'&&S.bb&&!profs(S.sv).some(x=>x.id===S.bb)){S.bb=0;S.tm=''}
    if(k==='bb'||k==='dt')S.tm='';
    wiz({k,v});return;
  }
  if(e.target.id==='back'){st--;wiz('t')}
  if(e.target.id==='next')avancar();
});
$('#wiz').addEventListener('input',e=>{if(e.target.dataset.f)S[e.target.dataset.f]=e.target.value});

function avancar(){
  const m=t=>$('#msg').textContent=t;
  if(st===1&&!S.sv)return m('Escolha um serviço para continuar.');
  if(st===2&&!S.bb)return m('Escolha uma profissional para continuar.');
  if(st===2&&!profs(S.sv).some(x=>x.id===S.bb))return m('Essa profissional não atende o serviço escolhido.');
  if(st===3&&!S.dt)return m('Escolha uma data para continuar.');
  if(st===4&&!S.tm)return m('Escolha um horário para continuar.');
  if(st<5){st++;return wiz('t')}
  if(S.n.trim().length<3)return m('Digite seu nome completo.');
  if(S.tel.replace(/\D/g,'').length<10)return m('Digite um telefone com DDD.');
  if(!/^\S+@\S+\.\S+$/.test(S.em))return m('Digite um e-mail válido.');
  if(!livre(S.bb,S.dt,S.tm,S.sv)){st=4;wiz('t');return $('#msg').textContent='Esse horário acabou de ser ocupado. Escolha outro.'}
  const x=sv(S.sv),b=bb(S.bb);
  const a={id:Date.now(),n:S.n.trim(),tel:S.tel.replace(/\D/g,''),em:S.em.trim(),
           sv:x.id,svn:x.n,m:x.m,b:b.id,bn:b.n,d:S.dt,t:S.tm,p:x.p,s:'Agendado',pg:false};
  AG.push(a);save();confirmar(a);
}

function confirmar(a){
  const txt=`Olá! Meu agendamento na Studio Bella: ${nSv(a)} com ${nBb(a)} em ${fd(a.d)} às ${a.t}. Nome: ${a.n}.`;
  $('#okTxt').textContent=`${nSv(a)} com ${nBb(a)}, ${fd(a.d)} às ${a.t}.`;
  $('#wa').href=waLink(txt);
  const s=new Date(a.d+'T'+a.t+':00'),f=new Date(s.getTime()+(a.m||30)*60000);
  const g=d=>iso(d).replace(/-/g,'')+'T'+String(d.getHours()).padStart(2,'0')+String(d.getMinutes()).padStart(2,'0')+'00';
  $('#cal').href=`https://calendar.google.com/calendar/render?action=TEMPLATE&text=${encodeURIComponent('Studio Bella — '+nSv(a))}&dates=${g(s)}/${g(f)}&details=${encodeURIComponent('Profissional: '+nBb(a))}&location=${encodeURIComponent(ENDERECO)}`;
  $('#ok').showModal();
}
/* o reset roda no evento close, então fechar com Esc também limpa o formulário */
const novo=()=>{S={sv:0,bb:0,dt:'',tm:'',n:'',tel:'',em:''};st=1;wiz();renderAdmin()};
$('#okX').onclick=()=>$('#ok').close();
$('#ok').addEventListener('close',novo);

/* ==========================================================
   MEUS AGENDAMENTOS (busca por telefone)
   ========================================================== */
$('#myBtn').onclick=()=>$('#my').showModal();
$('#myX').onclick=()=>$('#my').close();
function meus(){
  const t=$('#myTel').value.replace(/\D/g,''),l=AG.filter(a=>t&&a.tel===t).sort((a,b)=>(a.d+a.t).localeCompare(b.d+b.t));
  $('#myList').innerHTML=l.length?l.map(a=>`<div class="sv"><div><b>${fd(a.d)} às ${a.t}</b><small>${E(nSv(a))} com ${E(nBb(a))} · ${a.s}</small></div>${a.s==='Agendado'?`<button class="btn alt" data-c="${a.id}">Cancelar</button>`:''}</div>`).join(''):'<p style="color:var(--mut)">Nenhum agendamento encontrado para esse telefone.</p>';
}
$('#myGo').onclick=meus;
$('#myList').addEventListener('click',e=>{const id=e.target.dataset.c;if(!id)return;const a=AG.find(x=>x.id==id);if(a&&confirm('Cancelar este agendamento?')){a.s='Cancelado';save();meus();renderAdmin();wiz()}});

/* ==========================================================
   ÁREA DA EQUIPE — oculta: abra com #equipe no fim da URL
   ========================================================== */
let logado=false;
$('#pwBtn').onclick=()=>{if($('#pw').value===SENHA){logado=true;$('#pw').value='';$('#pwMsg').textContent='';$('#login').hidden=true;$('#panel').hidden=false;renderAdmin()}else $('#pwMsg').textContent='Senha incorreta. Tente novamente.'};
$('#pw').addEventListener('keydown',e=>{if(e.key==='Enter')$('#pwBtn').click()});
$('#out').onclick=()=>{logado=false;$('#panel').hidden=true;$('#login').hidden=false};
$('#fB').innerHTML='<option value="">Todas as profissionais</option>'+BB.map(b=>`<option value="${b.id}">${E(b.n)}</option>`).join('');
$('#fB').onchange=$('#fS').onchange=()=>renderAdmin();

function mostrarEquipe(){
  if(location.hash!=='#equipe')return;
  $('#admin').hidden=false;
  $('#admin').scrollIntoView({behavior:'smooth'});
  if(!logado)$('#pw').focus();
}
addEventListener('hashchange',mostrarEquipe);
mostrarEquipe();

function renderAdmin(){
  if(!logado)return;
  const hoje=iso(new Date()),ativos=AG.filter(a=>a.s!=='Cancelado'),prev=ativos.reduce((s,a)=>s+a.p,0),rec=ativos.filter(a=>a.pg).reduce((s,a)=>s+a.p,0);
  $('#kp').innerHTML=[['Ativos',AG.filter(a=>a.s==='Agendado').length],['Hoje',ativos.filter(a=>a.d===hoje).length],['Previsto',brl(prev)],['Recebido',brl(rec)],['A receber',brl(prev-rec)]].map(k=>`<div><b>${k[1]}</b><span>${k[0]}</span></div>`).join('');
  $('#byB').innerHTML='<tr><th>Profissional</th><th>Atendimentos</th><th>Recebido</th><th>A receber</th></tr>'+BB.map(b=>{const l=ativos.filter(a=>a.b===b.id),r=l.filter(a=>a.pg).reduce((s,a)=>s+a.p,0);return`<tr><td>${E(b.n)}</td><td>${l.length}</td><td>${brl(r)}</td><td>${brl(l.reduce((s,a)=>s+a.p,0)-r)}</td></tr>`}).join('');
  const fb=$('#fB').value,fs=$('#fS').value,l=AG.filter(a=>(!fb||a.b==fb)&&(!fs||a.s===fs)).sort((a,b)=>(a.d+a.t).localeCompare(b.d+b.t));
  $('#tb').innerHTML='<tr><th>Data</th><th>Hora</th><th>Cliente</th><th>Serviço</th><th>Profissional</th><th>Valor</th><th>Status</th><th>Ações</th></tr>'+(l.length?l.map(a=>`<tr><td>${fd(a.d)}</td><td>${a.t}</td><td>${E(a.n)}<br><small>${E(a.tel)}</small></td><td>${E(nSv(a))}</td><td>${E(nBb(a))}</td><td>${brl(a.p)}${a.pg?' ✓':''}</td><td>${a.s}</td><td><button data-a="ok" data-i="${a.id}">Concluir</button><button data-a="pg" data-i="${a.id}">${a.pg?'Estornar':'Recebido'}</button><button data-a="no" data-i="${a.id}">Cancelar</button><button data-a="del" data-i="${a.id}">Excluir</button></td></tr>`).join(''):'<tr><td colspan="8">Nenhum agendamento ainda.</td></tr>');
}
$('#tb').addEventListener('click',e=>{
  const k=e.target.dataset.a;if(!k)return;const i=AG.findIndex(a=>a.id==e.target.dataset.i),a=AG[i];
  if(k==='ok')a.s='Concluído';
  if(k==='no')a.s='Cancelado';
  if(k==='pg')a.pg=!a.pg;
  if(k==='del'){if(!confirm('Excluir este agendamento?'))return;AG.splice(i,1)}
  save();renderAdmin();wiz();
});

$('#csv').onclick=async()=>{
  const q=v=>'"'+String(v).replace(/"/g,'""')+'"';
  const rows=[['Data','Hora','Cliente','Telefone','E-mail','Serviço','Profissional','Valor','Status','Pago']]
    .concat(AG.map(a=>[fd(a.d),a.t,a.n,a.tel,a.em,nSv(a),nBb(a),a.p,a.s,a.pg?'Sim':'Não']));
  const blob=new Blob(['﻿'+rows.map(r=>r.map(q).join(';')).join('\n')],{type:'text/csv;charset=utf-8'});
  /* dentro do runtime de artifacts do Claude usa a API de downloads;
     fora dele, baixa pelo próprio navegador */
  try{if(typeof claude!=='undefined'&&claude.use){const d=await claude.use('downloads');if(d){await d.save({filename:'agendamentos.csv',data:blob});return}}}catch(e){}
  const u=URL.createObjectURL(blob),a=document.createElement('a');
  a.href=u;a.download='agendamentos.csv';a.click();setTimeout(()=>URL.revokeObjectURL(u),1000);
};

/* ---------- Primeira renderização ---------- */
wiz();
