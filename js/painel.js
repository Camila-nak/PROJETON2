(function () {
  const html = document.documentElement;
  const btnAbrir = document.getElementById('abrir');
  const painel = document.getElementById('painel');
  const CHAVE = 'pcd-acessibilidade';

  const modosDalt = [
    { classe: '',               texto: 'Modo daltônico: desligado' },
    { classe: 'dalt-protanopia',   texto: 'Modo daltônico: protanopia' },
    { classe: 'dalt-deuteranopia', texto: 'Modo daltônico: deuteranopia' },
    { classe: 'dalt-tritanopia',   texto: 'Modo daltônico: tritanopia' }
  ];

  // Estado salvo
  let estado = { fonte: 100, toggles: {}, dalt: 0 };
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE));
    if (salvo) estado = Object.assign(estado, salvo);
  } catch (e) {}

  function salvar() {
    try { localStorage.setItem(CHAVE, JSON.stringify(estado)); } catch (e) {}
  }

  function aplicar() {
    // Tamanho da fonte
    html.style.fontSize = estado.fonte + '%';

    // Toggles (alto-contraste, escala-cinza, etc.)
    document.querySelectorAll('[data-toggle]').forEach(btn => {
      const nome = btn.dataset.toggle;
      const ativo = !!estado.toggles[nome];
      html.classList.toggle(nome, ativo);
      btn.setAttribute('aria-pressed', ativo);
    });

    // Daltonismo
    modosDalt.forEach(m => m.classe && html.classList.remove(m.classe));
    const modo = modosDalt[estado.dalt];
    if (modo.classe) html.classList.add(modo.classe);
    const btnDalt = document.querySelector('[data-acao="daltonismo"]');
    if (btnDalt) {
      btnDalt.textContent = modo.texto;
      btnDalt.setAttribute('aria-pressed', estado.dalt !== 0);
    }
  }

  // Abrir / fechar painel
  btnAbrir.addEventListener('click', () => {
    const aberto = painel.hidden;
    painel.hidden = !aberto;
    btnAbrir.setAttribute('aria-expanded', aberto);
  });

  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && !painel.hidden) {
      painel.hidden = true;
      btnAbrir.setAttribute('aria-expanded', 'false');
      btnAbrir.focus();
    }
  });

  // Botões do painel
  painel.addEventListener('click', e => {
    const btn = e.target.closest('button');
    if (!btn) return;

    if (btn.dataset.toggle) {
      const nome = btn.dataset.toggle;
      estado.toggles[nome] = !estado.toggles[nome];
    }

    switch (btn.dataset.acao) {
      case 'fonte-mais':
        estado.fonte = Math.min(estado.fonte + 10, 150); break;
      case 'fonte-menos':
        estado.fonte = Math.max(estado.fonte - 10, 80); break;
      case 'daltonismo':
        estado.dalt = (estado.dalt + 1) % modosDalt.length; break;
      case 'reset':
        estado = { fonte: 100, toggles: {}, dalt: 0 }; break;
    }

    salvar();
    aplicar();
  });

  aplicar();
})();