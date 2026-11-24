/* ==========================================================
   Painel da equipe — usado só por equipe.html.
   Depende de config.js e core.js, carregados antes.
   ========================================================== */
$('#ano').textContent=new Date().getFullYear();

let logado=false;
$('#pwBtn').onclick=()=>{if($('#pw').value===SENHA){logado=true;$('#pw').value='';$('#pwMsg').textContent='';$('#login').hidden=true;$('#panel').hidden=false;renderAdmin()}else $('#pwMsg').textContent='Senha incorreta. Tente novamente.'};
$('#pw').addEventListener('keydown',e=>{if(e.key==='Enter')$('#pwBtn').click()});
$('#out').onclick=()=>{logado=false;$('#panel').hidden=true;$('#login').hidden=false};
$('#fB').innerHTML='<option value="">Todas as profissionais</option>'+BB.map(b=>`<option value="${b.id}">${E(b.n)}</option>`).join('');
$('#fB').onchange=$('#fS').onchange=()=>renderAdmin();


function renderAdmin(){
  if(!logado)return;
  const hoje=iso(new Date()),ativos=AG.filter(a=>a.s!=='Cancelado'),prev=ativos.reduce((s,a)=>s+a.p,0),rec=ativos.filter(a=>a.pg).reduce((s,a)=>s+a.p,0);
  $('#kp').innerHTML=[['Ativos',AG.filter(a=>a.s==='Agendado').length],['Hoje',ativos.filter(a=>a.d===hoje).length],['Previsto',brl(prev)],['Recebido',brl(rec)],['A receber',brl(prev-rec)]].map(k=>`<div><b>${k[1]}</b><span>${k[0]}</span></div>`).join('');
  $('#byB').innerHTML='<tr><th>Profissional</th><th>Atendimentos</th><th>Recebido</th><th>A receber</th></tr>'+BB.map(b=>{const l=ativos.filter(a=>a.b===b.id),r=l.filter(a=>a.pg).reduce((s,a)=>s+a.p,0);return`<tr><td data-r="Profissional">${E(b.n)}</td><td data-r="Atendimentos">${l.length}</td><td data-r="Recebido">${brl(r)}</td><td data-r="A receber">${brl(l.reduce((s,a)=>s+a.p,0)-r)}</td></tr>`}).join('');
  const fb=$('#fB').value,fs=$('#fS').value,l=AG.filter(a=>(!fb||a.b==fb)&&(!fs||a.s===fs)).sort((a,b)=>(a.d+a.t).localeCompare(b.d+b.t));
  /* data e hora na mesma coluna e ações que quebram em duas linhas:
     sem isso a tabela estoura a largura da página */
  $('#tb').innerHTML='<tr><th>Quando</th><th>Cliente</th><th>Serviço</th><th>Profissional</th><th>Valor</th><th>Status</th><th>Ações</th></tr>'+(l.length?l.map(a=>`<tr><td data-r="Quando"><b>${fd(a.d)}</b> <small>${a.t}</small></td><td data-r="Cliente"><span>${E(a.n)}<br><small>${E(a.tel)}</small></span></td><td data-r="Serviço">${E(nSv(a))}</td><td data-r="Profissional">${E(nBb(a))}</td><td data-r="Valor">${brl(a.p)}${a.pg?' ✓':''}</td><td data-r="Status"><span class="${stCls(a.s)}">${a.s}</span></td><td class="acoes" data-r="Ações"><button data-a="ok" data-i="${a.id}">Concluir</button><button data-a="pg" data-i="${a.id}">${a.pg?'Estornar':'Recebido'}</button><button data-a="no" data-i="${a.id}">Cancelar</button><button data-a="del" data-i="${a.id}">Excluir</button></td></tr>`).join(''):'<tr><td colspan="7">Nenhum agendamento ainda.</td></tr>');
}
$('#tb').addEventListener('click',e=>{
  const k=e.target.dataset.a;if(!k)return;const i=AG.findIndex(a=>a.id==e.target.dataset.i),a=AG[i];
  if(k==='ok')a.s='Concluído';
  if(k==='no')a.s='Cancelado';
  if(k==='pg')a.pg=!a.pg;
  if(k==='del'){if(!confirm('Excluir este agendamento?'))return;AG.splice(i,1)}
  save();renderAdmin();
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
