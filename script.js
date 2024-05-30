document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.getElementById('search-input');
    const searchButton = document.getElementById('search-button');
    const toggleButton = document.getElementById('toggle-button');
    const pokemonInfo = document.getElementById('pokemon-info');

    // Aggiunge un listener al bottone per cambiare modalità giorno/notte
    toggleButton.addEventListener('click', () => {
        document.body.classList.toggle('night-mode');
        toggleButton.classList.toggle('night-mode');
        // Cambia il testo del bottone in base alla modalità attuale
        if (document.body.classList.contains('night-mode')) {
            toggleButton.textContent = 'Day Mode';
        } else {
            toggleButton.textContent = 'Night Mode';
        }
    });

    // Aggiunge un listener al bottone di ricerca per cercare il Pokémon
    searchButton.addEventListener('click', () => {
        const pokemonName = searchInput.value.toLowerCase().trim();
        if (pokemonName) {
            fetchPokemonData(pokemonName);
        }
    });

    // Permette di cercare il Pokémon premendo il tasto Enter
    searchInput.addEventListener('keyup', (event) => {
        if (event.key === 'Enter') {
            searchButton.click();
        }
    });

    // Funzione per fetchare i dati del Pokémon dalla PokeAPI
    async function fetchPokemonData(name) {
        try {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`);
            if (!response.ok) {
                throw new Error('Pokémon non trovato');
            }
            const pokemon = await response.json();

            // Fetch delle informazioni sulla specie del Pokémon
            const speciesResponse = await fetch(pokemon.species.url);
            if (!speciesResponse.ok) {
                throw new Error('Informazioni sulla specie non trovate');
            }
            const species = await speciesResponse.json();

            displayPokemonInfo(pokemon, species);
        } catch (error) {
            // Mostra un messaggio di errore se il Pokémon non è trovato
            pokemonInfo.innerHTML = `<p>${error.message}</p>`;
        }
    }

    // Funzione per mostrare le informazioni del Pokémon
    function displayPokemonInfo(pokemon, species) {
        // Costruisce le statistiche del Pokémon come stringhe HTML
        const stats = pokemon.stats.map(stat => `<p><strong>${stat.stat.name.toUpperCase()}:</strong> ${stat.base_stat}</p>`).join('');

        // Altri dettagli del Pokémon
        const types = pokemon.types.map(type => type.type.name).join(', ');
        const abilities = pokemon.abilities.map(ability => ability.ability.name).join(', ');
        const descriptions = species.flavor_text_entries.filter(entry => entry.language.name === 'en').map(entry => entry.flavor_text).join(' ');

        // Inserisce le informazioni del Pokémon nel div pokemon-info
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
                <p>${descriptions}</p>
            </div>
        `;
    }
});

