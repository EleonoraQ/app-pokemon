document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const pokemonInfo = document.getElementById('pokemon-info');

    searchButton.addEventListener('click', () => {
        const pokemonName = searchInput.value.toLowerCase().trim();
        if (pokemonName) {
            fetchPokemonData(pokemonName);
        }
    });

    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            searchButton.click();
        }
    });

    async function fetchPokemonData(name) {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
            if (!response.ok) {
                throw new Error('Pokémon non trovato');
            }
            const pokemon = await response.json();
            displayPokemonInfo(pokemon);
        } catch (error) {
            pokemonInfo.innerHTML = `<p>${error.message}</p>`;
        }
    }

    function displayPokemonInfo(pokemon) {
        pokemonInfo.innerHTML = `
            <div class="pokemon-card">
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
                <p><strong>Type:</strong> ${pokemon.types.map(type => type.type.name).join(', ')}</p>
                <p><strong>Ability:</strong> ${pokemon.abilities.map(ability => ability.ability.name).join(', ')}</p>
                <p><strong>Height:</strong> ${pokemon.height / 10} m</p>
                <p><strong>Weight:</strong> ${pokemon.weight / 10} kg</p>
            </div>
        `;
    }
});
