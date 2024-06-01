document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const refreshButton = document.getElementById('refresh-button'); 
    const toggleButton = document.getElementById('toggle-button');
    const pokemonInfo = document.getElementById('pokemon-info');

    toggleButton.addEventListener('click', () => {
        document.body.classList.toggle('night-mode');
        toggleButton.classList.toggle('night-mode');
        toggleButton.textContent = document.body.classList.contains('night-mode') ? 'Day Mode' : 'Night Mode';
    });

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

    refreshButton.addEventListener('click', () => {
        resetSearch();
    });

    async function fetchPokemonData(name) {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
            if (!response.ok) {
                throw new Error('Pokémon not found');
            }
            const pokemon = await response.json();
            const speciesResponse = await fetch(pokemon.species.url);
            if (!speciesResponse.ok) {
                throw new Error('Species information not found');
            }
            const species = await speciesResponse.json();
            displayPokemonInfo(pokemon, species);
        } catch (error) {
            pokemonInfo.innerHTML = `<p>${error.message}</p>`;
        }
    }

    function displayPokemonInfo(pokemon, species) {
        const stats = pokemon.stats.map(stat => `<p><strong>${stat.stat.name.toUpperCase()}:</strong> ${stat.base_stat}</p>`).join('');
        const types = pokemon.types.map(type => type.type.name).join(', ');
        const abilities = pokemon.abilities.map(ability => ability.ability.name).join(', ');

        // Filtra le descrizioni duplicate e limita il numero di righe a 6
        const uniqueDescriptions = [];
        const descriptions = species.flavor_text_entries
            .filter(entry => entry.language.name === 'en')
            .map(entry => entry.flavor_text.replace(/\s+/g, ' ').trim())
            .filter(description => {
                if (uniqueDescriptions.includes(description)) {
                    return false;
                } else {
                    uniqueDescriptions.push(description);
                    return true;
                }
            });

        // Limita le descrizioni a 6 righe
        let limitedDescriptions = '';
        let lineCount = 0;
        for (const description of descriptions) {
            const lines = description.split('.').map(line => line.trim()).filter(line => line.length > 0);
            for (const line of lines) {
                if (lineCount + Math.ceil(line.length / 80) <= 6) { // Assuming ~80 characters per line
                    limitedDescriptions += (limitedDescriptions ? '. ' : '') + line;
                    lineCount += Math.ceil(line.length / 80);
                } else {
                    break;
                }
            }
            if (lineCount >= 6) {
                break;
            }
        }
        limitedDescriptions += '.';

        pokemonInfo.innerHTML = `
            <div class="pokemon-card">
                <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
                <h3>${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)}</h3>
                <p><strong>Type:</strong> ${types}</p>
                <p><strong>Ability:</strong> ${abilities}</p>
                <p><strong>Height:</strong> ${pokemon.height / 10} m</p>
                <p><strong>Weight:</strong> ${pokemon.weight / 10} kg</p>
                ${stats}
                <p><strong>Habitat:</strong> ${species.habitat ? species.habitat.name : 'Unknown'}</p>
            </div>
            <div class="pokedex-descriptions">
                <h4>Pokédex Descriptions:</h4>
                <a href="description.html?name=${encodeURIComponent(pokemon.name)}&description=${encodeURIComponent(limitedDescriptions)}">Read the description</a>
            </div>
        `;
    }

    function resetSearch() {
        searchInput.value = '';
        pokemonInfo.innerHTML = '';
        searchInput.focus();
    }
});







