/* FORM / LAB — V8 | Um só index.html; vista animada, 8 escolhas, envio Supabase RPC. */
(() => {
  'use strict';

  // Os valores têm correspondência exata com as validações de supabase-setup.sql.
  const steps = [
    { key: 'product_interest', kicker: 'PRIMEIRO, A GRANDE ESCOLHA',
      title: 'Qual destes <em>suplementos</em> gostavas de experimentar?',
      description: 'Escolhe o conceito que te desperta mais interesse. Não há respostas certas.',
      options: [
        { value:'creatine', label:'Creatina', detail:'Uma nova forma de incluir creatina na tua rotina.', image:'creatine.svg', tone:'creatine', article:'a creatina' },
        { value:'protein', label:'Proteína', detail:'Mais possibilidades para a tua proteína do dia a dia.', image:'protein.svg', tone:'protein', article:'a proteína' },
        { value:'magnesium', label:'Magnésio', detail:'Um mineral essencial, num formato mais prático.', image:'magnesium.svg', tone:'magnesium', article:'o magnésio' },
        { value:'ashwagandha', label:'Ashwagandha', detail:'Um conceito de suplemento botânico.', image:'ashwagandha.svg', tone:'ashwagandha', article:'a ashwagandha' }
      ] },
    { key:'preferred_format', kicker:'SEGUNDO, A FORMA',
      title:'Como gostavas de <em>consumi-lo?</em>',
      description:'O mesmo conceito pode ganhar muitas formas. Qual escolherias?',
      options:[
        { value:'gummies', label:'Gomas', detail:'Mastigáveis e fáceis de transportar.', image:'format-gummies.svg', tone:'creatine' },
        { value:'capsules', label:'Cápsulas', detail:'O formato clássico, simples e familiar.', image:'format-capsules.svg', tone:'protein' },
        { value:'powder', label:'Pó', detail:'Para misturar com a tua bebida favorita.', image:'format-powder.svg', tone:'magnesium' },
        { value:'shot', label:'Shot líquido', detail:'Pequeno, rápido e pronto a beber.', image:'format-shot.svg', tone:'ashwagandha' }
      ] },
    { key:'flavor', kicker:'UMA QUESTÃO DE SABOR',
      title:'Se tivesse sabor, qual seria <em>o teu?</em>',
      description:'Imagina a versão ideal do formato que escolheste.',
      options:[
        { value:'fruit', label:'Fruta tropical', detail:'Solar, exótica e vibrante.', image:'flavor-fruit.svg', tone:'creatine' },
        { value:'berries', label:'Frutos vermelhos', detail:'Doce e ligeiramente ácido.', image:'flavor-berries.svg', tone:'ashwagandha' },
        { value:'citrus', label:'Citrinos', detail:'Fresco, leve e intenso.', image:'flavor-citrus.svg', tone:'protein' },
        { value:'no_preference', label:'Sem preferência', detail:'O sabor não é decisivo para mim.', image:'flavor-no_preference.svg', tone:'magnesium' }
      ] },
    { key:'purchase_frequency', kicker:'OS TEUS HÁBITOS',
      title:'Com que frequência compras <em>suplementos?</em>',
      description:'Não importa se já consomes ou se estás só a explorar.',
      options:[
        { value:'monthly', label:'Todos os meses', detail:'Faz parte da minha rotina.', image:'frequency-monthly.svg', tone:'creatine' },
        { value:'every_2_3_months', label:'A cada 2–3 meses', detail:'Compro com alguma regularidade.', image:'frequency-every_2_3_months.svg', tone:'protein' },
        { value:'when_needed', label:'Quando preciso', detail:'Depende do momento e da necessidade.', image:'frequency-when_needed.svg', tone:'magnesium' },
        { value:'not_yet', label:'Ainda não compro', detail:'Tenho curiosidade, mas ainda não comecei.', image:'frequency-not_yet.svg', tone:'ashwagandha' }
      ] },
    { key:'training_frequency', kicker:'O TEU RITMO',
      title:'E com que frequência <em>treinas?</em>',
      description:'Só queremos perceber um pouco melhor o teu dia a dia.',
      options:[
        { value:'4_plus', label:'4+ vezes por semana', detail:'O movimento é uma prioridade.', image:'training-4_plus.svg', tone:'creatine' },
        { value:'2_3', label:'2–3 vezes por semana', detail:'Gosto de uma rotina equilibrada.', image:'training-2_3.svg', tone:'protein' },
        { value:'once', label:'Uma vez por semana', detail:'Quando consigo encaixar o treino.', image:'training-once.svg', tone:'magnesium' },
        { value:'rarely_none', label:'Raramente ou nunca', detail:'Tenho outros ritmos e hábitos.', image:'training-rarely_none.svg', tone:'ashwagandha' }
      ] },
    { key:'age_range', kicker:'UM POUCO SOBRE TI',
      title:'Qual é a tua <em>faixa etária?</em>',
      description:'Ajuda-nos a perceber quem está a dar forma à ideia.',
      options:[
        { value:'18_24', label:'18–24 anos', detail:'', image:'age-18_24.svg', tone:'creatine' },
        { value:'25_34', label:'25–34 anos', detail:'', image:'age-25_34.svg', tone:'protein' },
        { value:'35_44', label:'35–44 anos', detail:'', image:'age-35_44.svg', tone:'ashwagandha' },
        { value:'45_plus', label:'45+ anos', detail:'', image:'age-45_plus.svg', tone:'magnesium' }
      ] },
    { key:'decision_factor', kicker:'O QUE MAIS VALORIZAS',
      title:'O que é <em>decisivo</em> para ti?',
      description:'Se só pudesses escolher um fator, qual seria?',
      options:[
        { value:'ingredients', label:'Ingredientes', detail:'Composição clara e qualidade.', image:'factor-ingredients.svg', tone:'magnesium' },
        { value:'price', label:'Preço', detail:'Um valor que faça sentido.', image:'factor-price.svg', tone:'creatine' },
        { value:'taste', label:'Sabor', detail:'Uma experiência agradável.', image:'factor-taste.svg', tone:'ashwagandha' },
        { value:'convenience', label:'Praticidade', detail:'Fácil de usar todos os dias.', image:'factor-convenience.svg', tone:'protein' }
      ] },
    { key:'price_range', kicker:'A ÚLTIMA ESCOLHA',
      title:'Quanto estarias disposto a <em>pagar?</em>',
      description:'Pensa no preço de um mês (30 dias) do suplemento que imaginaste.',
      options:[
        { value:'under_15', label:'Menos de 15 €', detail:'O mais acessível possível.', image:'price-under_15.svg', tone:'magnesium' },
        { value:'15_20', label:'15 € – 20 €', detail:'Um preço equilibrado.', image:'price-15_20.svg', tone:'protein' },
        { value:'21_30', label:'21 € – 30 €', detail:'Pagaria mais por qualidade.', image:'price-21_30.svg', tone:'creatine' },
        { value:'over_30', label:'Mais de 30 €', detail:'Se o produto fosse especial.', image:'price-over_30.svg', tone:'ashwagandha' }
      ] }
  ];

  const experience = document.querySelector('#experience');
  const scene = document.querySelector('#scene');
  const progressFill = document.querySelector('#progress-fill');
  const progressTrack = document.querySelector('.progress-track');
  const counter = document.querySelector('#step-counter');
  const percentage = document.querySelector('#step-percentage');
  const back = document.querySelector('#previous-button');
  const bottomNote = document.querySelector('#quiz-footer-note');
  const closeButton = document.querySelector('#close-experience');
  const reducedMotion = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const storageKey = 'form-lab-v8-session';
  let currentStep = 0;
  let answers = {};
  let submissionId = makeSubmissionId();
  let busy = false;
  let open = false;
  let submitted = false;
  let previousFocus = null;
  let closingTimer = null;
  const wait = ms => new Promise(resolve => setTimeout(resolve, ms));
  const escapeHtml = value => String(value).replace(/[&<>"']/g, x => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[x]));

  function makeSubmissionId() {
    if (window.crypto?.randomUUID) return window.crypto.randomUUID();
    // UUID v4 para origens sem secure context (apenas desenvolvimento local).
    if (window.crypto?.getRandomValues) {
      const b = crypto.getRandomValues(new Uint8Array(16));
      b[6] = (b[6] & 15) | 64; b[8] = (b[8] & 63) | 128;
      const h = [...b].map(v => v.toString(16).padStart(2,'0')).join('');
      return `${h.slice(0,8)}-${h.slice(8,12)}-${h.slice(12,16)}-${h.slice(16,20)}-${h.slice(20)}`;
    }
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, c => {
      const r = Math.floor(Math.random()*16); return (c==='x'?r:(r&3|8)).toString(16);
    });
  }
  function persist() {
    try { sessionStorage.setItem(storageKey, JSON.stringify({ currentStep, answers, submissionId, submitted })); } catch (_) {}
  }
  function restore() {
    try {
      const state = JSON.parse(sessionStorage.getItem(storageKey) || '{}');
      if (state?.answers && typeof state.answers === 'object') {
        steps.forEach(step => {
          if (step.options.some(o => o.value === state.answers[step.key])) answers[step.key] = state.answers[step.key];
        });
      }
      if (typeof state?.submissionId === 'string' && /^[0-9a-f-]{36}$/i.test(state.submissionId)) submissionId = state.submissionId;
      if (state?.submitted === true && steps.every(s=>answers[s.key])) submitted = true;
      if (Number.isInteger(state?.currentStep)) currentStep = Math.min(Math.max(state.currentStep, 0), steps.length);
      // Nunca abrir uma etapa que não tenha sido precedida das respostas necessárias.
      for (let i=0; i<currentStep; i++) if (!answers[steps[i].key]) { currentStep=i; break; }
    } catch (_) {}
  }
  restore();

  function selectedProduct() { return steps[0].options.find(o => o.value === answers.product_interest); }
  function getTitle(step) {
    if (step.key === 'preferred_format' && selectedProduct()) return `Que <em>formato</em> escolherias para ${escapeHtml(selectedProduct().article)}?`;
    return step.title;
  }
  function contextLine(step) {
    if (step.key === 'product_interest' || !selectedProduct()) return '';
    const name = selectedProduct().label;
    return `<div class="context-chip"><span class="context-dot"></span> A explorar: <strong>${escapeHtml(name)}</strong></div>`;
  }
  function renderStep() {
    const review = currentStep === steps.length;
    const pct = review ? 100 : Math.round((currentStep+1)*100/steps.length);
    counter.textContent = review ? 'A TUA SELEÇÃO' : `ESCOLHA ${String(currentStep+1).padStart(2,'0')} / ${String(steps.length).padStart(2,'0')}`;
    percentage.textContent = `${pct}%`;
    progressFill.style.width = `${pct}%`;
    progressTrack.setAttribute('aria-valuenow', String(pct));
    back.hidden = currentStep === 0 || submitted;
    bottomNote.textContent = review ? 'REVÊ E CONFIRMA AS TUAS ESCOLHAS' : 'ESCOLHE UM CARTÃO PARA CONTINUAR ↗';
    if (review) return renderReview();
    const step = steps[currentStep];
    const options = step.options.map((choice, index) => {
      const cls = currentStep === 0 ? 'product-option' : 'illustrated-option';
      return `<button type="button" class="option ${cls} tone-${choice.tone}${answers[step.key] === choice.value ? ' is-previous-choice' : ''}" data-choice="${escapeHtml(choice.value)}" style="--i:${index}" aria-label="Escolher ${escapeHtml(choice.label)}">
        <span class="option-orbit" aria-hidden="true"></span>
        <img class="option-art" src="./assets/${choice.image}" alt="" loading="eager" decoding="async">
        <span class="option-copy"><span class="card-index">${currentStep === 0 ? 'CONCEPT' : 'OPÇÃO'} / ${String(index+1).padStart(2,'0')}</span>
        <strong class="card-name">${escapeHtml(choice.label)}</strong>
        ${choice.detail ? `<span class="card-desc">${escapeHtml(choice.detail)}</span>` : ''}
        </span><span class="option-arrow" aria-hidden="true">↗</span>
      </button>`;
    }).join('');
    scene.innerHTML = `<div class="step-head"><p class="step-kicker"><span class="kicker-icon" aria-hidden="true">✳</span> ${escapeHtml(step.kicker)}</p>
      <h2 class="step-title">${getTitle(step)}</h2><p class="step-desc">${escapeHtml(step.description)}</p>${contextLine(step)}</div>
      <div class="options-grid">${options}</div>`;
  }
  function renderReview() {
    const rows = steps.map((step, i) => {
      const answer = step.options.find(c=>c.value===answers[step.key]);
      return `<div class="review-item"><span class="review-index">${String(i+1).padStart(2,'0')}</span><div class="review-detail"><span>${escapeHtml(step.kicker)}</span><strong>${escapeHtml(answer?.label || '—')}</strong></div>
        ${!submitted ? `<button class="review-edit" type="button" data-edit-step="${i}" aria-label="Alterar resposta ${i+1}">Alterar ↗</button>` : ''}</div>`;
    }).join('');
    scene.innerHTML = `<div class="step-head"><p class="step-kicker"><span class="kicker-icon" aria-hidden="true">✳</span>${submitted ? 'ESCOLHAS GUARDADAS' : 'TUDO PRONTO'}</p>
      <h2 class="step-title">${submitted ? 'Obrigado por <em>participares.</em>' : 'As tuas escolhas. <em>A nossa inspiração.</em>'}</h2>
      <p class="step-desc">${submitted ? 'A tua opinião já faz parte do nosso estudo. Obrigado por ajudares a construir a FORM / LAB.' : 'Revê as escolhas antes de as enviar. Não recolhemos nomes nem emails.'}</p></div>
      <div class="review-panel"><div class="review-grid">${rows}</div>
        ${submitted ? '<div class="submitted-mark"><span aria-hidden="true">✓</span> Respostas guardadas no Supabase</div><button class="retry-button" type="button" id="restart-quiz">Fazer de novo ↗</button>' : '<button class="submit-button" type="button" id="submit-answers">Enviar as minhas escolhas <span aria-hidden="true">↗</span></button>'}
        <p id="submit-message" class="notice" role="status" aria-live="polite">${submitted ? 'Podes fechar a experiência ou fazer um novo questionário.' : 'Os dados só são enviados quando clicares em Enviar.'}</p>
      </div>`;
  }

  async function switchStep(next) {
    if (busy || submitted) return;
    busy = true;
    const goingBack = next < currentStep;
    if (!reducedMotion && scene.animate) {
      const animation = scene.animate([
        { opacity:1, transform:'translate3d(0,0,0) scale(1)', filter:'blur(0)' },
        { opacity:0, transform:`translate3d(${goingBack?24:-24}px,-5px,0) scale(.987)`, filter:'blur(5px)' }
      ], { duration:235, easing:'cubic-bezier(.4,0,.9,1)', fill:'forwards' });
      await animation.finished.catch(()=>{});
      animation.cancel();
    }
    currentStep = Math.max(0,Math.min(next,steps.length));
    persist();
    renderStep();
    experience.scrollTo({top:0,behavior:'instant'});
    if (!reducedMotion && scene.animate) {
      const animation = scene.animate([
        { opacity:0, transform:`translate3d(${goingBack?-32:32}px,18px,0) scale(.987)`, filter:'blur(5px)' },
        { opacity:1, transform:'translate3d(0,0,0) scale(1)', filter:'blur(0)' }
      ], {duration:410, easing:'cubic-bezier(.16,1,.3,1)'});
      await animation.finished.catch(()=>{});
    }
    busy = false;
    scene.setAttribute('tabindex','-1');
    scene.focus({preventScroll:true});
  }
  async function choose(button) {
    if (busy || submitted) return;
    busy=true;
    button.classList.add('is-picked');
    answers[steps[currentStep].key] = button.dataset.choice;
    // Ao rever e alterar uma escolha, todas as outras respostas mantêm-se.
    persist();
    if (!reducedMotion) await wait(180);
    busy=false;
    await switchStep(currentStep+1);
  }

  async function sendAnswers() {
    if (busy || submitted || steps.some(step=>!answers[step.key])) return;
    const btn = scene.querySelector('#submit-answers');
    const message = scene.querySelector('#submit-message');
    btn.disabled = true;
    btn.innerHTML = '<span class="loading-spinner" aria-hidden="true"></span> A guardar as escolhas…';
    message.className = 'notice';
    message.textContent = 'A estabelecer ligação segura…';
    try {
      const cfg = window.FORM_LAB_CONFIG || {};
      const url = String(cfg.SUPABASE_URL||'').trim().replace(/\/+$/,'');
      const key = String(cfg.SUPABASE_PUBLISHABLE_KEY||'').trim();
      if (!/^https:\/\/[a-z0-9-]+\.supabase\.co$/i.test(url) || !/^sb_publishable_[a-zA-Z0-9_-]{8,}$/.test(key) || url.includes('COLOCA') || key.includes('COLOCA')) {
        throw new Error('Configuração em falta: abre config.js e coloca o Project URL e a publishable key do teu Supabase.');
      }
      const payload = { p_submission_id:submissionId };
      steps.forEach(step => payload[`p_${step.key}`] = answers[step.key]);
      // Este endpoint é criado por supabase-setup.sql. Não é uma Edge Function.
      const result = await fetch(`${url}/rest/v1/rpc/submit_form_lab_response`, {
        method:'POST',
        headers: { 'Content-Type':'application/json', 'Accept':'application/json', apikey:key },
        body: JSON.stringify(payload)
      });
      if (!result.ok) {
        const data = await result.json().catch(()=>null);
        const code = data?.code ? ` (${data.code})` : '';
        throw new Error(`Supabase HTTP ${result.status}${code}: ${data?.message || 'O servidor recusou o envio.'}`);
      }
      submitted=true;
      persist();
      back.hidden = true;
      bottomNote.textContent = 'OBRIGADO POR PARTICIPARES ✳';
      renderReview();
      scene.focus({preventScroll:true});
    } catch (error) {
      console.error('FORM / LAB — erro de envio ao Supabase',error);
      message.className='notice is-error';
      message.textContent= error instanceof TypeError
        ? 'Erro de rede/CORS: verifica a ligação à Internet, o URL do projeto e as permissões do Supabase.'
        : `Não foi possível guardar: ${error.message}`;
      btn.disabled=false;
      btn.textContent='Tentar enviar novamente ↗';
    }
  }

  function openExperience(event, hashAlreadySet=false) {
    if (open) return;
    clearTimeout(closingTimer);
    previousFocus = document.activeElement;
    open=true;
    const source=event?.currentTarget || document.querySelector('#start-button');
    const r=source?.getBoundingClientRect();
    experience.style.setProperty('--open-x',`${r ? r.left+r.width/2 : innerWidth/2}px`);
    experience.style.setProperty('--open-y',`${r ? r.top+r.height/2 : innerHeight/2}px`);
    experience.hidden=false;
    experience.setAttribute('aria-hidden','false');
    document.querySelector('#homepage').setAttribute('inert','');
    document.body.classList.add('quiz-open');
    experience.scrollTop=0;
    renderStep();
    if (!hashAlreadySet && location.hash !== '#quiz') history.pushState({formlabQuiz:true},'', '#quiz');
    requestAnimationFrame(()=>requestAnimationFrame(()=>experience.classList.add('is-visible')));
    closeButton.focus({preventScroll:true});
  }
  function closeExperience(updateUrl=true) {
    if (!open) return;
    open=false;
    busy=false;
    experience.classList.remove('is-visible','can-hover');
    experience.setAttribute('aria-hidden','true');
    document.body.classList.remove('quiz-open');
    document.querySelector('#homepage').removeAttribute('inert');
    if (updateUrl && location.hash==='#quiz') history.replaceState(null,'', location.pathname+location.search);
    closingTimer = setTimeout(()=>{if (!open) experience.hidden=true;},reducedMotion?0:960);
    if (previousFocus?.focus) previousFocus.focus({preventScroll:true});
  }
  function restart() {
    answers={}; currentStep=0;submitted=false; submissionId=makeSubmissionId(); persist();
    renderStep(); experience.scrollTo({top:0,behavior:'smooth'});
  }
  document.querySelectorAll('[data-start]').forEach(button=>button.addEventListener('click',event=>openExperience(event)));
  closeButton.addEventListener('click',()=>closeExperience());
  back.addEventListener('click',()=>switchStep(currentStep-1));
  experience.addEventListener('pointermove',event=>{
    if (event.pointerType==='touch') return;
    experience.classList.add('can-hover');
    const card=event.target.closest('.option');
    if (!card) return;
    const r=card.getBoundingClientRect();
    card.style.setProperty('--mx',`${((event.clientX-r.left)/r.width*100).toFixed(1)}%`);
    card.style.setProperty('--my',`${((event.clientY-r.top)/r.height*100).toFixed(1)}%`);
    card.style.setProperty('--px',`${((event.clientX-r.left)/r.width-.5)*9}px`);
    card.style.setProperty('--py',`${((event.clientY-r.top)/r.height-.5)*7}px`);
  },{passive:true});
  scene.addEventListener('click',event=>{
    const choice=event.target.closest('[data-choice]');
    const edit=event.target.closest('[data-edit-step]');
    if (choice) return choose(choice);
    if (edit) return switchStep(Number(edit.dataset.editStep));
    if (event.target.closest('#submit-answers')) return sendAnswers();
    if (event.target.closest('#restart-quiz')) return restart();
  });
  document.addEventListener('keydown',event=>{if (event.key==='Escape' && open) closeExperience();});
  window.addEventListener('popstate',()=>{
    if (location.hash==='#quiz' && !open) openExperience(null,true);
    if (location.hash!=='#quiz' && open) closeExperience(false);
  });
  if (location.hash==='#quiz') openExperience(null,true);
})();
