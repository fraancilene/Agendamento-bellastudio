/* ==========================================================
   CONFIGURAÇÃO DO SALÃO
   Este é o único arquivo que precisa ser editado no dia a dia.
   Não é necessário mexer em app.js para trocar preços,
   serviços, profissionais, depoimentos ou contato.
   ========================================================== */

/* Senha da área da equipe.
   ATENÇÃO: ela fica visível para qualquer pessoa que abra o
   código-fonte da página. Serve como tranca de aparência, não
   como segurança de verdade. */
const SENHA = '123456';

/* WhatsApp do salão, no formato DDI + DDD + número (só dígitos). */
const WHATS = '5561999990000';

/* Endereço usado no link do Google Maps e no convite de calendário.
   Mantenha igual ao texto da seção Contato no index.html. */
const ENDERECO = 'Av. Principal, 1000 — Centro';

/* Serviços do catálogo.
   id = número único | n = nome | p = preço em reais | m = duração em minutos
   ic = ícone (chaves disponíveis em icons.js: tesoura, escova, tinta,
        mechas, gota, esmalte, flor, sobrancelha)
   A duração define quantos blocos de 30 min o serviço ocupa na agenda. */
const SV = [
  {id:1, n:'Corte feminino',        p:90,  m:60,  ic:'tesoura'},
  {id:2, n:'Escova',                p:60,  m:45,  ic:'escova'},
  {id:3, n:'Coloração',             p:180, m:120, ic:'tinta'},
  {id:4, n:'Mechas e luzes',        p:350, m:180, ic:'mechas'},
  {id:5, n:'Hidratação profunda',   p:90,  m:60,  ic:'gota'},
  {id:6, n:'Manicure',              p:40,  m:45,  ic:'esmalte'},
  {id:7, n:'Pedicure',              p:50,  m:60,  ic:'flor'},
  {id:8, n:'Design de sobrancelha', p:45,  m:30,  ic:'sobrancelha'}
];

/* Equipe.
   id = número único | n = nome | e = especialidade exibida no site
   sv = ids dos serviços que ela atende (sem essa lista, atende todos)
   foto = opcional. Sem foto, o site desenha um círculo com a inicial.
          Para usar foto real, salve o arquivo em assets/img/ e aponte aqui:
          foto:'assets/img/camila.jpg'  (quadrada, a partir de 200x200) */
const BB = [
  {id:1, n:'Camila',   e:'Cortes e escovas',     sv:[1,2,5]},
  {id:2, n:'Juliana',  e:'Coloração e mechas',   sv:[2,3,4,5]},
  {id:3, n:'Fernanda', e:'Unhas e sobrancelhas', sv:[6,7,8]}
];

/* Depoimentos exibidos na página.
   n = nome | t = texto | s = nota de 1 a 5 */
const DEPOIMENTOS = [
  {n:'Ana Paula',  s:5, t:'Marquei pelo site em dois minutos e fui atendida na hora exata. A Juliana acertou o tom que eu queria de primeira.'},
  {n:'Rafaela M.', s:5, t:'O que mais gosto é saber quanto tempo o serviço leva antes de marcar. Consigo encaixar no intervalo do trabalho sem susto.'},
  {n:'Beatriz L.', s:4, t:'Faço as unhas com a Fernanda há dois anos. Atendimento caprichado e sempre no horário combinado.'}
];
