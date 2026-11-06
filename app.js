import { createClient } from 'https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm';
import { SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY } from './config.js';

const hasSupabaseConfig = Boolean(SUPABASE_URL && SUPABASE_PUBLISHABLE_KEY);
const supabase = hasSupabaseConfig ? createClient(SUPABASE_URL, SUPABASE_PUBLISHABLE_KEY) : null;
const LOCAL_RESPONSES_KEY = 'formlab_demo_responses_v1';
const SUBMITTED_KEY = hasSupabaseConfig
  ? 'formlab_survey_submitted_live_v1'
  : 'formlab_survey_submitted_demo_v1';

const form = document.querySelector('#survey-form');
const submitButton = document.querySelector('#submit-button');
const formStatus = document.querySelector('#form-status');
const totalResponses = document.querySelector('#total-responses');
const resultsContent = document.querySelector('#results-content');
const resultsDescription = document.querySelector('#results-description');
const resultsFootnote = document.querySelector('#results-footnote');

const labels = {
  products: {
    protein_gummies: 'Gomas de proteína',
    creatine_gummies: 'Gomas de creatina',
    ashwagandha: 'Ashwagandha',
    daily_gummies: 'Gomas daily',
    other: 'Outro conceito'
  },
  formats: { gummies: 'Gomas', powder: 'Pó', capsules: 'Cápsulas', drink: 'Bebida' },
  prices: {
    under_15: 'Menos de 15 €',
    '15_20': '15 € – 20 €',
    '21_25': '21 € – 25 €',
    '26_30': '26 € – 30 €',
    over_30: 'Mais de 30 €'
  }
};

function getLocalResponses() {
  try {
    return JSON.parse(localStorage.getItem(LOCAL_RESPONSES_KEY) || '[]');
  } catch (error) {
    console.warn('Não foi possível ler as respostas locais:', error);
    return [];
  }
}

function countValues(responses, field) {
  const counts = {};
  for (const response of responses) {
    const value = response[field];
    if (value) counts[value] = (counts[value] || 0) + 1;
  }
  return Object.entries(counts)
    .map(([label, count]) => ({ label, count }))
    .sort((a, b) => b.count - a.count);
}

function getLocalResults() {
  const responses = getLocalResponses();
  return {
    total: responses.length,
    products: countValues(responses, 'product_interest'),
    formats: countValues(responses, 'preferred_format'),
    prices: countValues(responses, 'price_range')
  };
}

function createResultCard(title, rows, labelMap, total) {
  const card = document.createElement('article');
  card.className = 'result-card';

  const heading = document.createElement('h3');
  heading.textContent = title;
  card.appendChild(heading);

  if (!rows || rows.length === 0) {
    const empty = document.createElement('p');
    empty.className = 'empty-chart-copy';
    empty.textContent = 'Ainda sem respostas.';
    card.appendChild(empty);
    return card;
  }

  for (const row of rows) {
    const item = document.createElement('div');
    item.className = 'result-row';

    const label = document.createElement('span');
    label.className = 'result-label';
    label.textContent = labelMap[row.label] || row.label;

    const track = document.createElement('span');
    track.className = 'result-track';
    track.setAttribute('aria-label', `${row.count} respostas`);

    const fill = document.createElement('span');
    fill.className = 'result-fill';
    fill.style.display = 'block';
    fill.style.width = `${total > 0 ? (row.count / total) * 100 : 0}%`;
    track.appendChild(fill);

    const count = document.createElement('span');
    count.className = 'result-count';
    count.textContent = String(row.count);

    item.append(label, track, count);
    card.appendChild(item);
  }

  return card;
}

function renderResults(data) {
  const total = Number(data?.total || 0);
  totalResponses.textContent = String(total);
  resultsContent.replaceChildren();

  if (total === 0) {
    const empty = document.createElement('div');
    empty.className = 'empty-results';
    const symbol = document.createElement('span');
    symbol.textContent = '✳';
    const title = document.createElement('p');
    title.textContent = 'Os primeiros resultados vão aparecer aqui.';
    const note = document.createElement('small');
    note.textContent = hasSupabaseConfig
      ? 'Ainda não existem respostas. Sê uma das primeiras pessoas a participar.'
      : 'Esta é uma pré-visualização. Liga o Supabase para recolher respostas de várias pessoas.';
    empty.append(symbol, title, note);
    resultsContent.appendChild(empty);
    return;
  }

  resultsContent.append(
    createResultCard('Conceitos mais interessantes', data.products, labels.products, total),
    createResultCard('Formato preferido', data.formats, labels.formats, total),
    createResultCard('Preço para cerca de 30 dias', data.prices, labels.prices, total)
  );
}

async function refreshResults() {
  if (!hasSupabaseConfig) {
    renderResults(getLocalResults());
    return;
  }

  const { data, error } = await supabase.rpc('get_survey_results');
  if (error) {
    console.error('Erro ao carregar resultados:', error);
    resultsDescription.textContent = 'Não foi possível carregar os resultados. Confirma a configuração do Supabase.';
    renderResults({ total: 0 });
    return;
  }

  renderResults(data);
}

function setAlreadySubmittedState() {
  const hasSubmitted = localStorage.getItem(SUBMITTED_KEY) === 'yes';
  if (!hasSubmitted) return;

  submitButton.disabled = true;
  submitButton.textContent = 'Resposta já submetida';
  formStatus.textContent = 'Obrigado! Este navegador já submeteu uma resposta neste estudo.';
  form.querySelectorAll('input').forEach((input) => { input.disabled = true; });
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();

  if (localStorage.getItem(SUBMITTED_KEY) === 'yes') {
    formStatus.textContent = 'Este navegador já submeteu uma resposta. Obrigado pela participação!';
    return;
  }

  if (!form.reportValidity()) return;

  const formData = new FormData(form);
  const response = {
    product_interest: formData.get('product_interest'),
    preferred_format: formData.get('preferred_format'),
    price_range: formData.get('price_range'),
    purchase_frequency: formData.get('purchase_frequency'),
    training_frequency: formData.get('training_frequency'),
    age_range: formData.get('age_range'),
    flavor: formData.get('flavor'),
    decision_factor: formData.get('decision_factor')
  };

  submitButton.disabled = true;
  submitButton.textContent = 'A enviar…';
  formStatus.textContent = '';

  try {
    if (hasSupabaseConfig) {
      const { error } = await supabase.rpc('submit_survey_response', {
        p_product_interest: response.product_interest,
        p_preferred_format: response.preferred_format,
        p_price_range: response.price_range,
        p_purchase_frequency: response.purchase_frequency,
        p_training_frequency: response.training_frequency,
        p_age_range: response.age_range,
        p_flavor: response.flavor,
        p_decision_factor: response.decision_factor
      });

      if (error) throw error;
    } else {
      const responses = getLocalResponses();
      responses.push(response);
      localStorage.setItem(LOCAL_RESPONSES_KEY, JSON.stringify(responses));
    }

    localStorage.setItem(SUBMITTED_KEY, 'yes');
    formStatus.textContent = 'Obrigado! A tua resposta foi registada.';
    submitButton.textContent = 'Resposta submetida ✓';
    form.querySelectorAll('input').forEach((input) => { input.disabled = true; });
    await refreshResults();
  } catch (error) {
    console.error('Erro ao submeter resposta:', error);
    formStatus.textContent = 'Não foi possível enviar. Verifica a ligação e tenta novamente.';
    submitButton.disabled = false;
    submitButton.textContent = 'Tentar novamente ↗';
  }
});

if (hasSupabaseConfig) {
  resultsDescription.textContent = 'Resultados agregados das respostas submetidas neste estudo.';
  resultsFootnote.textContent = 'Os resultados são apresentados de forma agregada. O estudo não recolhe nome ou email.';
} else {
  resultsDescription.textContent = 'Estás a ver uma pré-visualização. Neste modo, as respostas ficam apenas guardadas neste navegador e não são partilhadas com outras pessoas.';
  resultsFootnote.textContent = 'Para recolher respostas reais de várias pessoas, configura o Supabase seguindo o README.';
}

setAlreadySubmittedState();
refreshResults();
