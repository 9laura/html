const input = document.getElementById('pokemonInput')
const buscarBtn = document.getElementById('buscarBtn')
const resultado = document.getElementById('resultado')

const coresTipos = {
  fire: '#f08030', water: '#6890f0', grass: '#78c850', electric: '#f8d030',
  psychic: '#f85888', ice: '#98d8d8', dragon: '#7038f8', dark: '#705848',
  fairy: '#ee99ac', normal: '#a8a878', fighting: '#c03028', flying: '#a890f0',
  poison: '#a040a0', ground: '#e0c068', rock: '#b8a038', bug: '#a8b820',
  ghost: '#705898', steel: '#b8b8d0'
}

async function buscarPokemon() {
  const nome = input.value.trim().toLowerCase()
  if (!nome) {
    resultado.innerHTML = '<div class="erro">Digite o nome ou número de um Pokémon.</div>'
    return
  }

  resultado.innerHTML = '<div class="placeholder"><p>🔎 Procurando Pokémon...</p></div>'

  try {
    const resposta = await fetch(`https://pokeapi.co/api/v2/pokemon/${nome}`)
    if (!resposta.ok) throw new Error('Pokémon não encontrado')
    const pokemon = await resposta.json()

    const tipos = pokemon.types.map(item => {
      const tipo = item.type.name
      return `<span class="tipo" style="background:${coresTipos[tipo] || '#7b8b9a'}">${tipo}</span>`
    }).join('')

    resultado.innerHTML = `
      <article class="pokemon-card">
        <div class="art">
          <img src="${pokemon.sprites.other['official-artwork'].front_default || pokemon.sprites.front_default}" alt="${pokemon.name}">
        </div>
        <div class="info">
          <span class="numero">Nº ${String(pokemon.id).padStart(3, '0')}</span>
          <h2>${pokemon.name}</h2>
          <div class="tipos">${tipos}</div>
          <div class="stats">
            <div class="stat"><small>Altura</small><strong>${pokemon.height / 10} m</strong></div>
            <div class="stat"><small>Peso</small><strong>${pokemon.weight / 10} kg</strong></div>
            <div class="stat"><small>Experiência base</small><strong>${pokemon.base_experience ?? '—'}</strong></div>
            <div class="stat"><small>Habilidade</small><strong>${pokemon.abilities[0].ability.name}</strong></div>
          </div>
        </div>
      </article>`
  } catch (erro) {
    resultado.innerHTML = '<div class="erro">Não encontramos esse Pokémon. Confira o nome ou número e tente novamente!</div>'
  }
}

buscarBtn.addEventListener('click', buscarPokemon)
input.addEventListener('keydown', event => {
  if (event.key === 'Enter') buscarPokemon()
})
