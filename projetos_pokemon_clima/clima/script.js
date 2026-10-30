const form = document.getElementById('formBusca')
const input = document.getElementById('cidadeInput')
const resultado = document.getElementById('resultado')

const icones = {
  0: '☀️', 1: '🌤️', 2: '⛅', 3: '☁️',
  45: '🌫️', 48: '🌫️',
  51: '🌦️', 53: '🌦️', 55: '🌧️', 56: '🌧️', 57: '🌧️',
  61: '🌧️', 63: '🌧️', 65: '🌧️', 66: '🌧️', 67: '🌧️',
  71: '🌨️', 73: '🌨️', 75: '❄️', 77: '❄️',
  80: '🌦️', 81: '🌧️', 82: '⛈️',
  85: '🌨️', 86: '❄️', 95: '⛈️', 96: '⛈️', 99: '⛈️'
}

const descricoes = {
  0: 'Céu limpo', 1: 'Quase limpo', 2: 'Parcialmente nublado', 3: 'Nublado',
  45: 'Nevoeiro', 48: 'Nevoeiro com geada',
  51: 'Garoa leve', 53: 'Garoa moderada', 55: 'Garoa intensa',
  61: 'Chuva leve', 63: 'Chuva moderada', 65: 'Chuva forte',
  71: 'Neve leve', 73: 'Neve moderada', 75: 'Neve forte',
  80: 'Pancadas leves', 81: 'Pancadas moderadas', 82: 'Pancadas fortes',
  95: 'Trovoada', 96: 'Trovoada com granizo', 99: 'Trovoada forte'
}

function nomeDia(data) {
  return new Date(data + 'T12:00:00').toLocaleDateString('pt-BR', { weekday: 'short' }).replace('.', '')
}

async function buscarClima(event) {
  event.preventDefault()
  const cidade = input.value.trim()
  if (!cidade) return

  resultado.innerHTML = '<div class="inicio"><p>🌎 Buscando previsão...</p></div>'

  try {
    const geoResposta = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(cidade)}&count=1&language=pt&format=json`)
    const geo = await geoResposta.json()
    if (!geo.results || geo.results.length === 0) throw new Error('Cidade não encontrada')

    const local = geo.results[0]
    const climaResposta = await fetch(`https://api.open-meteo.com/v1/forecast?latitude=${local.latitude}&longitude=${local.longitude}&current=temperature_2m,weather_code&daily=weather_code,temperature_2m_max,temperature_2m_min&forecast_days=5&timezone=auto`)
    const clima = await climaResposta.json()

    const atualIcone = icones[clima.current.weather_code] || '🌡️'
    const atualDescricao = descricoes[clima.current.weather_code] || 'Condição do tempo'
    let dias = ''

    for (let i = 0; i < clima.daily.time.length; i++) {
      const codigo = clima.daily.weather_code[i]
      dias += `
        <article class="dia">
          <div class="nome">${i === 0 ? 'Hoje' : nomeDia(clima.daily.time[i])}</div>
          <div class="icone">${icones[codigo] || '🌡️'}</div>
          <div class="max">${Math.round(clima.daily.temperature_2m_max[i])}°</div>
          <div class="min">${Math.round(clima.daily.temperature_2m_min[i])}°</div>
        </article>`
    }

    resultado.innerHTML = `
      <section class="atual">
        <div>
          <div class="cidade">📍 ${local.name}${local.admin1 ? ', ' + local.admin1 : ''}</div>
          <h2>${Math.round(clima.current.temperature_2m)}°C</h2>
          <div class="descricao">${atualDescricao}</div>
        </div>
        <div class="icone-atual">${atualIcone}</div>
      </section>
      <h3 class="semana-titulo">Previsão para os próximos dias</h3>
      <section class="semana">${dias}</section>`
  } catch (erro) {
    resultado.innerHTML = '<div class="erro">Não conseguimos encontrar essa cidade. Verifique o nome e tente novamente.</div>'
  }
}

form.addEventListener('submit', buscarClima)
