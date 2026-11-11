(function () {
  const html = document.documentElement;
  const btnAbrir = document.getElementById('abrir');
  const painel = document.getElementById('painel');
  const sliderVel = document.getElementById('velocidade'); // pode ser null se o HTML novo não foi copiado
  const CHAVE = 'pcd-acessibilidade';

  const modosDalt = [
    { classe: '',                  texto: 'Modo daltônico: desligado' },
    { classe: 'dalt-protanopia',   texto: 'Modo daltônico: protanopia' },
    { classe: 'dalt-deuteranopia', texto: 'Modo daltônico: deuteranopia' },
    { classe: 'dalt-tritanopia',   texto: 'Modo daltônico: tritanopia' }
  ];

  let estado = { fonte: 100, toggles: {}, dalt: 0, velocidade: 1 };
  try {
    const salvo = JSON.parse(localStorage.getItem(CHAVE));
    if (salvo) estado = Object.assign(estado, salvo);
  } catch (e) {}

  function salvar() {
    try { localStorage.setItem(CHAVE, JSON.stringify(estado)); } catch (e) {}
  }

  /* =====================================================
     LEITURA EM VOZ ALTA (Web Speech API)
     ===================================================== */
  const suportaVoz = 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;
  const sintese = suportaVoz ? window.speechSynthesis : null;

  const IGNORAR = 'script,style,noscript,template,svg,iframe,#acesso';
  const SOLTOS  = 'a,button,img[alt],input:not([type=hidden]),textarea,select';
  const TEXTO   = 'h1,h2,h3,h4,h5,h6,p,li,blockquote,figcaption,td,th,dt,dd,label,summary';

  let fila = [];          // [{ el, texto }]
  let indice = 0;
  let lendo = false;
  let pausado = false;
  let sessao = 0;         // invalida leituras antigas ao parar/reiniciar
  let elAtual = null;
  let timerFoco = null;
  let falaAtual = null;   // mantém referência (o Chrome pode descartar a fala e travar a leitura)

  const limpar = s => (s || '').replace(/\s+/g, ' ').trim();

  function escolherVoz() {
    const vozes = sintese.getVoices();
    return vozes.find(v => v.lang === 'pt-BR')
        || vozes.find(v => v.lang && v.lang.toLowerCase().startsWith('pt'))
        || null;
  }

  function visivel(el) {
    return !!el.getClientRects().length && !el.closest('[aria-hidden="true"], [hidden]');
  }

  // Divide textos longos em pedaços (evita o corte automático do Chrome após ~15s)
  function dividir(texto) {
    const frases = texto.match(/[^.!?;:\n]+[.!?;:]*\s*/g) || [texto];
    const partes = [];
    let atual = '';
    frases.forEach(f => {
      if ((atual + f).length > 180 && atual) { partes.push(atual.trim()); atual = f; }
      else atual += f;
    });
    if (atual.trim()) partes.push(atual.trim());
    return partes;
  }

  function falarTexto(texto, aoTerminar, minhaSessao, aoIniciar) {
    const partes = dividir(texto);
    let i = 0;
    (function proxima() {
      if (minhaSessao !== sessao) return;
      if (i >= partes.length) { if (aoTerminar) aoTerminar(); return; }
      const u = new SpeechSynthesisUtterance(partes[i++]);
      u.lang = 'pt-BR';
      u.rate = estado.velocidade;
      const voz = escolherVoz();
      if (voz) u.voice = voz;
      if (aoIniciar && i === 1) u.onstart = aoIniciar;
      u.onend = proxima;
      u.onerror = e => {
        if (minhaSessao !== sessao) return;
        if (e.error === 'interrupted' || e.error === 'canceled') return;
        proxima();
      };
      falaAtual = u;
      sintese.speak(u);
    })();
  }

  // Texto de um elemento isolado (usado no modo "ler ao passar o mouse")
  function textoDe(el) {
    const rotulo = el.getAttribute('aria-label');
    if (el.matches('img')) return el.alt ? 'Imagem: ' + limpar(el.alt) : '';
    if (el.matches('input[type=submit], input[type=button]')) return 'Botão: ' + limpar(el.value);
    if (el.matches('input, textarea, select')) {
      const lab = el.id && document.querySelector('label[for="' + el.id + '"]');
      const nome = limpar(rotulo || (lab && lab.innerText) || el.placeholder || el.name);
      return 'Campo ' + (nome || 'de preenchimento');
    }
    if (el.matches('button')) return 'Botão: ' + limpar(rotulo || el.innerText);
    if (el.matches('a'))      return 'Link: '  + limpar(rotulo || el.innerText);
    if (el.matches(TEXTO))    return limpar(el.innerText);
    // outros elementos (div, span...): só o texto que está diretamente neles
    return limpar(Array.from(el.childNodes)
      .filter(n => n.nodeType === 3).map(n => n.textContent).join(' '));
  }

  // Blocos: sobe de elementos "inline" (span, strong, a...) até o bloco que os contém
  function blocoDe(no) {
    let el = no.parentElement;
    while (el && el !== document.body) {
      const d = getComputedStyle(el).display;
      if (d !== 'inline' && d !== 'contents') break;
      el = el.parentElement;
    }
    return el;
  }

  // Percorre a página inteira (qualquer tag) e monta a lista de itens a ler
  function coletarPagina() {
    const itens = [];
    const indiceDoBloco = new Map();
    const walker = document.createTreeWalker(
      document.body,
      NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT,
      {
        acceptNode(n) {
          if (n.nodeType === 1) {
            if (n.matches(IGNORAR) || n.hidden || n.getAttribute('aria-hidden') === 'true')
              return NodeFilter.FILTER_REJECT;
            return n.matches('img[alt], input:not([type=hidden]), textarea, select')
              ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_SKIP;
          }
          return n.textContent.trim() ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
        }
      }
    );

    let n;
    while ((n = walker.nextNode())) {
      if (n.nodeType === 1) {
        const t = textoDe(n);
        if (t && visivel(n)) itens.push({ el: n, texto: t });
        continue;
      }
      if (n.parentElement.closest('select, textarea, option')) continue;
      const bloco = blocoDe(n);
      if (!bloco || !visivel(bloco)) continue;
      const txt = limpar(n.textContent);
      if (!txt) continue;
      if (indiceDoBloco.has(bloco)) {
        itens[indiceDoBloco.get(bloco)].texto += ' ' + txt;
      } else {
        const prefixo = bloco.matches('button') ? 'Botão: ' : bloco.matches('a') ? 'Link: ' : '';
        indiceDoBloco.set(bloco, itens.length);
        itens.push({ el: bloco, texto: prefixo + txt });
      }
    }
    return itens;
  }

  function marcar(el) {
    if (elAtual) elAtual.classList.remove('lendo-agora');
    elAtual = el || null;
    if (el) {
      el.classList.add('lendo-agora');
      el.scrollIntoView({ block: 'center', behavior: 'smooth' });
    }
  }

  function falarProximo(minhaSessao) {
    if (minhaSessao !== sessao) return;
    if (indice >= fila.length) { parar(); return; }
    const item = fila[indice];
    marcar(item.el);
    falarTexto(item.texto, () => { indice++; falarProximo(minhaSessao); }, minhaSessao);
  }

  function atualizarBotaoPausa() {
    const b = painel.querySelector('[data-acao="pausar"]');
    if (!b) return;
    b.setAttribute('aria-pressed', pausado);
    b.textContent = pausado ? '▶ Continuar' : '⏸ Pausar';
    b.setAttribute('aria-label', pausado ? 'Continuar leitura' : 'Pausar leitura');
  }

  function parar() {
    if (!suportaVoz) return;
    sessao++;
    sintese.cancel();
    lendo = false; pausado = false; fila = []; indice = 0;
    marcar(null);
    atualizarBotaoPausa();
  }

  function avisoSemSuporte() {
    alert('Seu navegador não suporta leitura em voz alta. Tente Chrome, Edge, Safari ou Firefox atualizados.');
  }

  function avisoSemVoz() {
    parar();
    alert('A leitura não começou. Verifique se o volume está ligado e se o seu dispositivo tem uma voz em português instalada (Configurações do sistema > Voz / Acessibilidade).');
  }

  function lerPagina() {
    if (!suportaVoz) return avisoSemSuporte();
    parar();
    fila = coletarPagina();
    if (!fila.length) { alert('Não encontrei texto para ler nesta página.'); return; }
    lendo = true;
    const minhaSessao = ++sessao;
    let comecou = false;
    // pequeno atraso: o Chrome ignora speak() chamado logo após cancel()
    setTimeout(() => {
      if (minhaSessao !== sessao) return;
      falarTexto('Iniciando a leitura da página.', () => falarProximo(minhaSessao),
                 minhaSessao, () => { comecou = true; });
      setTimeout(() => { if (!comecou && minhaSessao === sessao) avisoSemVoz(); }, 2500);
    }, 150);
  }

  function lerSelecao() {
    if (!suportaVoz) return avisoSemSuporte();
    parar();
    const sel = limpar(window.getSelection().toString());
    const minhaSessao = ++sessao;
    setTimeout(() => {
      if (minhaSessao === sessao) falarTexto(sel || 'Nenhum texto selecionado.', null, minhaSessao);
    }, 150);
  }

  function pausarOuContinuar() {
    if (!suportaVoz || !lendo) return;
    if (pausado) { sintese.resume(); pausado = false; }
    else         { sintese.pause();  pausado = true;  }
    atualizarBotaoPausa();
  }

  // ----- Leitura ao passar o mouse / focar com o teclado -----
  function lerPorInteracao(e) {
    if (!suportaVoz || !estado.toggles['leitura-foco'] || lendo) return;
    if (!e.target.closest) return;
    const alvo = e.target.closest(SOLTOS + ',' + TEXTO) || e.target;
    if (alvo === document.body || alvo === html) return;
    const texto = textoDe(alvo);
    if (!texto) return;
    clearTimeout(timerFoco);
    timerFoco = setTimeout(() => {
      sessao++;
      sintese.cancel();
      const minhaSessao = sessao;
      marcar(alvo);
      setTimeout(() => {
        if (minhaSessao === sessao) falarTexto(texto, () => marcar(null), minhaSessao);
      }, 100);
    }, 250);
  }
  document.addEventListener('mouseover', lerPorInteracao);
  document.addEventListener('focusin', lerPorInteracao);

  // Atalho: Alt + L lê a página (de novo = parar)
  document.addEventListener('keydown', e => {
    if (e.altKey && (e.key === 'l' || e.key === 'L')) {
      e.preventDefault();
      lendo ? parar() : lerPagina();
    }
  });

  if (sliderVel) {
    sliderVel.addEventListener('input', () => {
      estado.velocidade = parseFloat(sliderVel.value);
      salvar();
    });
  }

  window.addEventListener('beforeunload', () => { if (suportaVoz) sintese.cancel(); });
  if (suportaVoz) sintese.onvoiceschanged = () => {};

  if (!suportaVoz) {
    const g = painel.querySelector('.grupo-leitura');
    if (g) g.hidden = true;
  }

  /* CÓDIGO ORIGINAL DO PAINEL*/
  function aplicar() {
    html.style.fontSize = estado.fonte + '%';

    document.querySelectorAll('[data-toggle]').forEach(btn => {
      const nome = btn.dataset.toggle;
      const ativo = !!estado.toggles[nome];
      html.classList.toggle(nome, ativo);
      btn.setAttribute('aria-pressed', ativo);
    });

    modosDalt.forEach(m => m.classe && html.classList.remove(m.classe));
    const modo = modosDalt[estado.dalt];
    if (modo.classe) html.classList.add(modo.classe);
    const btnDalt = document.querySelector('[data-acao="daltonismo"]');
    if (btnDalt) {
      btnDalt.textContent = modo.texto;
      btnDalt.setAttribute('aria-pressed', estado.dalt !== 0);
    }

    if (sliderVel) sliderVel.value = estado.velocidade;
  }

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
      case 'ler-pagina':   lerPagina(); break;
      case 'ler-selecao':  lerSelecao(); break;
      case 'pausar':       pausarOuContinuar(); break;
      case 'parar':        parar(); break;
      case 'reset':
        parar();
        estado = { fonte: 100, toggles: {}, dalt: 0, velocidade: 1 }; break;
    }

    salvar();
    aplicar();
  });

  aplicar();
})();