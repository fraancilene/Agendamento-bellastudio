# Studio Bella — site de agendamento

Projeto acadêmico: página estática de agendamento para salão de beleza.
Sem build e sem dependências para instalar — basta abrir o `index.html`
no navegador, ou subir a pasta inteira em qualquer hospedagem de
arquivos estáticos (GitHub Pages, Netlify, Vercel).

## Estrutura

```
project-girls/
├── index.html              estrutura da página (só marcação)
├── README.md
└── assets/
    ├── css/
    │   └── style.css       toda a aparência, organizada por seção
    ├── img/
    │   └── hero.svg        ilustração do topo
    └── js/
        ├── config.js       ← edite aqui: serviços, equipe, depoimentos, contato
        ├── icons.js        desenhos SVG dos ícones de serviço
        └── app.js          lógica (agenda, wizard, área da equipe)
```

A ordem das tags `<script>` no fim do `index.html` precisa ser mantida:
`config.js` e `icons.js` são carregados antes de `app.js`.

## Como editar o dia a dia

Quase tudo está em `assets/js/config.js`:

- **Serviços, preços e duração** — lista `SV`. A duração em minutos (`m`)
  define quantos blocos de 30 minutos o serviço ocupa na agenda. O campo
  `ic` escolhe o ícone entre os desenhos de `icons.js`.
- **Equipe** — lista `BB`. O campo `sv` diz quais serviços cada
  profissional atende: ele filtra a etapa 2 do agendamento e monta as
  etiquetas do card dela.
- **Depoimentos** — lista `DEPOIMENTOS`, com nome, texto e nota de 1 a 5.
- **WhatsApp, endereço e senha** — constantes `WHATS`, `ENDERECO` e `SENHA`.

O texto visível do endereço e do telefone fica no `index.html` (seção
Contato); os links desses itens são montados a partir do `config.js`.

## Imagens

O site funciona sem nenhuma foto: o topo usa uma ilustração em SVG e as
profissionais aparecem num círculo com a inicial do nome. Para usar fotos
reais, sem mexer em código:

- **Topo** — salve a foto em `assets/img/` e troque a tag `<img>` do bloco
  `hero-img` no `index.html` (há um comentário no lugar indicando como).
- **Profissionais** — acrescente o campo `foto` à pessoa em `config.js`:
  `{id:1, n:'Camila', e:'...', sv:[1,2,5], foto:'assets/img/camila.jpg'}`.
  A imagem deve ser quadrada, a partir de 200×200. Sem o campo, o círculo
  com a inicial continua aparecendo.

## Paleta

Definida em tokens no topo de `style.css`, então trocar a cor do site é
mexer em cinco linhas:

| Token         | Cor       | Uso                                 |
|---------------|-----------|-------------------------------------|
| `--ink`       | `#2a1a2b` | ameixa escura: menu, rodapé, títulos |
| `--plum`      | `#703a5d` | ameixa média: gradientes            |
| `--red`       | `#a63d68` | framboesa: botões e preços          |
| `--gold`      | `#8a6434` | caramelo: rótulos de seção          |
| `--gold-soft` | `#d9b382` | caramelo claro: bordas e estrelas   |
| `--rose`      | `#f6e2e7` | rosa suave: fundos de destaque      |

## Área da equipe

Fica **oculta** na página. Para abrir, acrescente `#equipe` no fim da URL:

```
index.html#equipe
```

Dá acesso ao painel com indicadores, faturamento por profissional,
filtros, ações por agendamento e exportação em CSV.

## Limitações conhecidas

São intencionais no recorte deste trabalho, mas vale registrar:

1. **A senha não protege nada.** `SENHA` está em JavaScript, visível para
   qualquer pessoa que abra o código-fonte da página.
2. **Os dados ficam no `localStorage`**, ou seja, no navegador de quem
   agendou. O painel da equipe não vê os agendamentos feitos em outro
   dispositivo, e os horários "ocupados" só valem naquele navegador.
   Uma agenda compartilhada exigiria backend com banco de dados.
3. **Nada é enviado automaticamente.** O link de WhatsApp depende de a
   própria cliente clicar, e o e-mail coletado não é usado.
