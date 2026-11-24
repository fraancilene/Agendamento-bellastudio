/* ==========================================================
   Site público — serviços, equipe, depoimentos e o assistente
   de agendamento em 5 etapas.
   Depende de config.js, icons.js e core.js, carregados antes.
   O painel da equipe vive em equipe.html / equipe.js.
   ========================================================== */

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
const novo=()=>{S={sv:0,bb:0,dt:'',tm:'',n:'',tel:'',em:''};st=1;wiz()};
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
$('#myList').addEventListener('click',e=>{const id=e.target.dataset.c;if(!id)return;const a=AG.find(x=>x.id==id);if(a&&confirm('Cancelar este agendamento?')){a.s='Cancelado';save();meus();wiz()}});

/* ---------- Primeira renderização ---------- */
wiz();
