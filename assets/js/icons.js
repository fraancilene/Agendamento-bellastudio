/* ==========================================================
   Ícones dos serviços — desenhos SVG de 24x24, traço simples.
   Cada serviço no config.js aponta para uma chave daqui pelo
   campo "ic". Chave inexistente cai no ícone "padrao".
   ========================================================== */
const ICONES = {
  tesoura:'<circle cx="6" cy="18" r="2.6"/><circle cx="18" cy="18" r="2.6"/><path d="M8.2 16.2 19 4M15.8 16.2 5 4"/>',
  escova:'<circle cx="10" cy="10" r="5.5"/><path d="M14 14l5.6 5.6M10 2.3v2.2M10 15.5v2.2M2.3 10h2.2M15.5 10h2.2M4.6 4.6l1.6 1.6M13.8 13.8l1.6 1.6M15.4 4.6l-1.6 1.6M6.2 13.8l-1.6 1.6"/>',
  tinta:'<path d="M3.5 10.5h14v.5a7 7 0 0 1-7 7h0a7 7 0 0 1-7-7z"/><path d="M14.5 10.5 20.5 4"/><path d="M6.5 14h8"/>',
  mechas:'<path d="M6 3c0 4-2 5-2 9s2 5 2 9M11 3c0 4-2 5-2 9s2 5 2 9"/><path d="M17.5 4.5c0 3 1.5 4.5 4.5 4.5-3 0-4.5 1.5-4.5 4.5 0-3-1.5-4.5-4.5-4.5 3 0 4.5-1.5 4.5-4.5Z"/>',
  gota:'<path d="M12 2.6S5.6 9.4 5.6 13.9a6.4 6.4 0 0 0 12.8 0C18.4 9.4 12 2.6 12 2.6Z"/><path d="M9 14.2a3 3 0 0 0 3 3"/>',
  esmalte:'<rect x="9.6" y="2" width="4.8" height="3.6" rx="1"/><rect x="7.4" y="6.6" width="9.2" height="15" rx="2.6"/><path d="M7.4 11h9.2"/>',
  flor:'<ellipse cx="12" cy="6.6" rx="2.6" ry="4.4"/><ellipse cx="12" cy="17.4" rx="2.6" ry="4.4"/><ellipse cx="6.6" cy="12" rx="4.4" ry="2.6"/><ellipse cx="17.4" cy="12" rx="4.4" ry="2.6"/><circle cx="12" cy="12" r="1.9"/>',
  sobrancelha:'<path d="M4 8.6c3.2-3.4 12.8-3.4 16 0"/><path d="M3.6 15.4c3.4-4 13.4-4 16.8 0-3.4 4-13.4 4-16.8 0Z"/><circle cx="12" cy="15.4" r="2"/>',
  padrao:'<path d="M12 3c0 5 4 9 9 9-5 0-9 4-9 9 0-5-4-9-9-9 5 0 9-4 9-9Z"/>'
};

/* Monta a tag <svg> pronta para ser inserida no HTML. */
const icone = k => `<svg class="ico" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${ICONES[k]||ICONES.padrao}</svg>`;
