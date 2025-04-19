document.addEventListener('DOMContentLoaded', () => {
    // --- DOM Element References ---
    const pokemonListContainer = document.getElementById('pokemon-list');
    const pokemonDetailContainer = document.getElementById('pokemon-detail');
    const detailContent = pokemonDetailContainer.querySelector('.detail-content'); // Keep reference if needed elsewhere, but not used directly in this version
    const closeDetailButton = document.getElementById('close-detail');
    const loadingIndicator = document.getElementById('loading');
    const detailImageElement = document.getElementById('detail-image');
    const detailNameElement = document.getElementById('detail-name');
    const detailIdElement = document.getElementById('detail-id');
    const detailTypesContainer = document.getElementById('detail-types');
    const detailHeightElement = document.getElementById('detail-height');
    const detailWeightElement = document.getElementById('detail-weight');
    const detailDescriptionElement = document.getElementById('detail-description');
    const statsChartCanvas = document.getElementById('stats-chart');

    // --- Constants and Variables ---
    const MAX_POKEMON = 50;
    const POKEAPI_BASE_URL = 'https://pokeapi.co/api/v2/';
    let statsChart = null; // To hold the Chart.js instance
    let pokemonCache = {}; // Simple cache to store fetched data

    // --- Data Fetching ---

    const fetchPokemonData = async (id) => {
        // Check cache first
        if (pokemonCache[id]) {
            // console.log(`Cache hit for Pokémon ${id}`);
            return pokemonCache[id];
        }
        // console.log(`Fetching data for Pokémon ${id}`);

        try {
            const [pokemonRes, speciesRes] = await Promise.all([
                fetch(`${POKEAPI_BASE_URL}pokemon/${id}`),
                fetch(`${POKEAPI_BASE_URL}pokemon-species/${id}`)
            ]);

            if (!pokemonRes.ok) {
                throw new Error(`Pokemon fetch failed! status: ${pokemonRes.status}`);
            }
            if (!speciesRes.ok) {
                 console.warn(`Species fetch failed for ${id} (status: ${speciesRes.status}), proceeding without species data.`);
                 // Still try to return basic pokemon data if species fails
                 const pokemonData = await pokemonRes.json();
                 pokemonCache[id] = { ...pokemonData, species: null }; // Mark species as null
                 return pokemonCache[id];
            }

            const pokemonData = await pokemonRes.json();
            const speciesData = await speciesRes.json();

            const combinedData = { ...pokemonData, species: speciesData }; // Combine data
            pokemonCache[id] = combinedData; // Store in cache
            return combinedData;

        } catch (error) {
            console.error(`Failed to fetch data for Pokémon ${id}:`, error);
            return null; // Return null on error
        }
    };

    const fetchAllPokemon = async () => {
        showLoading();
        pokemonListContainer.innerHTML = ''; // Clear previous potentially failed load
        const pokemonPromises = [];
        for (let i = 1; i <= MAX_POKEMON; i++) {
            pokemonPromises.push(fetchPokemonData(i)); // Fetch (or get from cache)
        }

        try {
            const allPokemonData = await Promise.all(pokemonPromises);
            const validPokemonData = allPokemonData.filter(p => p !== null); // Filter out any null results from failed fetches
            if (validPokemonData.length === 0 && MAX_POKEMON > 0) {
                 throw new Error("No Pokémon data could be loaded.");
            }
            displayPokemonList(validPokemonData);
        } catch (error) {
            console.error("Failed to fetch all Pokémon data:", error);
            pokemonListContainer.innerHTML = `<p class='error-message'>Could not load Pokémon list. Check console for details or try reloading.</p>`;
        } finally {
           hideLoading();
        }
    };

    // --- Display Logic ---

    const displayPokemonList = (pokemonDataArray) => {
        pokemonListContainer.innerHTML = ''; // Clear previous list
        pokemonDataArray.forEach(pokemon => {
            if (pokemon) { // Ensure pokemon data exists
                 const card = createPokemonCard(pokemon);
                 pokemonListContainer.appendChild(card);
            }
        });
    };

    const createPokemonCard = (pokemon) => {
        const card = document.createElement('div');
        card.classList.add('pokemon-card');
        card.dataset.id = pokemon.id; // Store id for easy fetching/display later

        const name = pokemon.name;
        const id = pokemon.id.toString().padStart(3, '0');

        // --- Image Prioritization Logic for Card ---
        const animatedGifUrl = pokemon.sprites?.versions?.['generation-v']?.['black-white']?.animated?.front_default;
        const officialArtworkUrl = pokemon.sprites?.other?.['official-artwork']?.front_default;
        const staticSpriteUrl = pokemon.sprites?.front_default;

        // Select the best available image URL
        let imageUrl = animatedGifUrl || officialArtworkUrl || staticSpriteUrl || '';

        // *** CORRECTED LINE BELOW: Removed the "{/* Fallback text */}" comment ***
        card.innerHTML = `
            <img src="${imageUrl}" alt="${name}" loading="lazy" class="pokemon-card-sprite" ${!imageUrl ? 'style="display:none;"' : ''}>
            ${!imageUrl ? '<span class="sprite-error">No Image</span>' : ''}
            <h3>${name}</h3>
            <span class="pokemon-id">#${id}</span>
        `;

        // Add error handling for the image itself
        const imgElement = card.querySelector('.pokemon-card-sprite');
        if (imgElement) {
            imgElement.onerror = () => {
                console.warn(`Card image failed for ${name} (URL: ${imgElement.src}). Falling back.`);
                // Try official artwork if the animated one failed or wasn't primary
                if (officialArtworkUrl && imgElement.src !== officialArtworkUrl) {
                    imgElement.src = officialArtworkUrl;
                // If official also fails (or was primary), try static sprite
                } else if (staticSpriteUrl && imgElement.src !== staticSpriteUrl) {
                     imgElement.src = staticSpriteUrl;
                // If all fallbacks fail
                } else {
                     imgElement.style.display = 'none'; // Hide broken image icon
                     const errorSpan = card.querySelector('.sprite-error');
                     // Ensure the error span exists before trying to display it
                     if (errorSpan) {
                          errorSpan.style.display = 'inline'; // Show error text
                     } else {
                         // If the span wasn't even created initially (because imageUrl was thought to be valid)
                         // we might need to add it now, or just rely on the hidden image.
                         // For simplicity, we'll just hide the image element.
                         console.error(`All card image sources failed for ${name}, hiding image element.`);
                     }
                }
            };
        }

        card.addEventListener('click', () => {
            // Pass the already fetched (and cached) data to avoid re-fetch unless necessary
            showPokemonDetail(pokemon.id);
        });

        return card;
    };

    const showPokemonDetail = async (id) => {
        showLoading();
        // Get data (likely from cache now, but fetch if needed)
        const pokemon = await fetchPokemonData(id);

        if (!pokemon) {
            alert("Could not load Pokémon details. The data might be missing or there was a network error.");
            hideLoading();
            return;
        }

        // --- Populate Detail View ---
        detailNameElement.textContent = pokemon.name;
        detailIdElement.textContent = `#${pokemon.id.toString().padStart(3, '0')}`;

        // --- Image Prioritization Logic for Detail ---
        const animatedGifUrl = pokemon.sprites?.versions?.['generation-v']?.['black-white']?.animated?.front_default;
        const officialArtworkUrl = pokemon.sprites?.other?.['official-artwork']?.front_default;
        const staticSpriteUrl = pokemon.sprites?.front_default;

        // Select the best available image URL
        let imageUrl = animatedGifUrl || officialArtworkUrl || staticSpriteUrl || '';

        detailImageElement.src = imageUrl;
        detailImageElement.alt = pokemon.name;
        detailImageElement.style.display = imageUrl ? 'block' : 'none'; // Hide if no URL

        // Error handling for the detail image
        detailImageElement.onerror = () => {
             console.warn(`Detail image failed for ${pokemon.name} (URL: ${detailImageElement.src}). Falling back.`);
             // Try official artwork first
             if (officialArtworkUrl && detailImageElement.src !== officialArtworkUrl) {
                 detailImageElement.src = officialArtworkUrl;
             // Then try static sprite
             } else if (staticSpriteUrl && detailImageElement.src !== staticSpriteUrl) {
                 detailImageElement.src = staticSpriteUrl;
             // If all fail
             } else {
                 detailImageElement.alt = `${pokemon.name} (Image unavailable)`;
                 detailImageElement.src = ''; // Clear broken source
                 detailImageElement.style.display = 'none'; // Hide element
                 console.error(`All image sources failed for ${pokemon.name}`);
             }
        };

        // --- Display Types ---
        detailTypesContainer.innerHTML = ''; // Clear previous types
        pokemon.types.forEach(typeInfo => {
            const typeSpan = document.createElement('span');
            typeSpan.textContent = typeInfo.type.name;
            typeSpan.classList.add('type-badge', `type-${typeInfo.type.name}`);
            detailTypesContainer.appendChild(typeSpan);
        });

        // --- Display Height/Weight ---
        detailHeightElement.textContent = pokemon.height ? (pokemon.height / 10).toFixed(1) : '?'; // Add check for existence
        detailWeightElement.textContent = pokemon.weight ? (pokemon.weight / 10).toFixed(1) : '?'; // Add check for existence

        // --- Display Description (Flavor Text) ---
        let description = 'No description available.';
        if (pokemon.species && pokemon.species.flavor_text_entries) {
             const flavorTextEntry = pokemon.species.flavor_text_entries.find(
                 entry => entry.language.name === 'en'
             );
             if (flavorTextEntry) {
                  description = flavorTextEntry.flavor_text.replace(/[\n\f]/g, ' '); // Clean up text
             }
        } else {
            console.warn(`No species data or flavor text found for ${pokemon.name}`);
        }
        detailDescriptionElement.textContent = description;


        // --- Display Stats Chart ---
        createStatsChart(pokemon.stats);

        // --- Show the detail container with animation ---
        pokemonDetailContainer.classList.remove('hidden');
        // Ensure content is visible before animation starts if needed (usually handled by CSS)
        // pokemonDetailContainer.style.visibility = 'visible';
        // pokemonDetailContainer.style.opacity = 1;
        // pokemonDetailContainer.style.transform = 'translate(-50%, -50%) scale(1)';

        hideLoading(); // Hide loading indicator after rendering
    };

    const hidePokemonDetail = () => {
        // Apply CSS classes/styles for hiding animation
        pokemonDetailContainer.classList.add('hidden');
        // pokemonDetailContainer.style.opacity = 0;
        // pokemonDetailContainer.style.transform = 'translate(-50%, -50%) scale(0.9)';
        // // Set visibility hidden after transition completes (handled by CSS transition delay)
        // setTimeout(() => {
        //      if (pokemonDetailContainer.classList.contains('hidden')) { // Check if still hidden
        //          pokemonDetailContainer.style.visibility = 'hidden';
        //      }
        // }, 400); // Match CSS transition duration

        // Destroy chart when closing to free resources
        if (statsChart) {
            statsChart.destroy();
            statsChart = null;
        }
    };

    // --- Charting ---

    const createStatsChart = (stats) => {
        const ctx = statsChartCanvas.getContext('2d');

        // Destroy previous chart instance if it exists
        if (statsChart) {
            statsChart.destroy();
            statsChart = null; // Ensure it's reset
        }

        if (!stats || stats.length === 0) {
            console.warn("No stats data available to create chart.");
            // Optionally display a message in the chart area
             ctx.clearRect(0, 0, statsChartCanvas.width, statsChartCanvas.height); // Clear previous drawings
             ctx.textAlign = 'center';
             ctx.fillText('Stats data unavailable', statsChartCanvas.width / 2, statsChartCanvas.height / 2);
            return; // Exit if no stats
        }


        const statNames = stats.map(statInfo => {
            const nameMap = { // Simple name mapping
                'hp': 'HP',
                'attack': 'Attack',
                'defense': 'Defense',
                'special-attack': 'Sp. Atk',
                'special-defense': 'Sp. Def',
                'speed': 'Speed'
            };
            return nameMap[statInfo.stat.name.toLowerCase()] || statInfo.stat.name; // Use lowercase for matching
        });
        const statValues = stats.map(statInfo => statInfo.base_stat);

        statsChart = new Chart(ctx, {
            type: 'bar',
            data: {
                labels: statNames,
                datasets: [{
                    label: 'Base Stats',
                    data: statValues,
                    backgroundColor: [ // Pokemon-themed colors
                        'rgba(255, 99, 132, 0.7)',  // HP (Red-ish)
                        'rgba(240, 128, 48, 0.7)',  // Attack (Orange-ish) - Adjusted from original example
                        'rgba(112, 168, 248, 0.7)', // Defense (Blue-ish) - Adjusted
                        'rgba(104, 144, 240, 0.7)', // Sp. Atk (Light Blue) - Adjusted
                        'rgba(120, 200, 80, 0.7)',  // Sp. Def (Green-ish) - Adjusted
                        'rgba(248, 208, 48, 0.7)'   // Speed (Yellow-ish) - Adjusted
                    ],
                    borderColor: [
                         'rgba(255, 99, 132, 1)',
                         'rgba(240, 128, 48, 1)',
                         'rgba(112, 168, 248, 1)',
                         'rgba(104, 144, 240, 1)',
                         'rgba(120, 200, 80, 1)',
                         'rgba(248, 208, 48, 1)'
                    ],
                    borderWidth: 1
                }]
            },
            options: {
                indexAxis: 'y', // Horizontal bars
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                    x: {
                        beginAtZero: true,
                        max: 200, // Reasonable max for Gen 1 stats
                         grid: {
                             color: 'rgba(0, 0, 0, 0.1)' // Lighter grid lines
                         }
                    },
                     y: {
                        ticks: {
                            font: {
                                size: 10
                            }
                        },
                         grid: {
                            display: false // Hide y-axis grid lines for cleaner look
                         }
                    }
                },
                plugins: {
                    legend: {
                        display: false // Hide legend
                    },
                    tooltip: {
                        backgroundColor: 'rgba(0, 0, 0, 0.7)', // Darker tooltip
                        titleFont: { weight: 'bold' },
                        bodyFont: { size: 12 },
                        displayColors: false, // Don't show color box in tooltip
                        callbacks: {
                            label: function(context) {
                                // Use the mapped label name (HP, Attack, etc.)
                                return `${context.label}: ${context.raw}`;
                            },
                             title: function() { // Don't show a title in tooltip
                                return null;
                            }
                        }
                    }
                },
                animation: {
                    duration: 800,
                    easing: 'easeOutQuart' // Slightly different easing
                }
            }
        });
    };

    // --- Utility Functions ---
    const showLoading = () => {
        loadingIndicator.classList.remove('hidden');
        loadingIndicator.style.visibility = 'visible'; // Ensure it's targetable by opacity transition
        loadingIndicator.style.opacity = 1;
    };

    const hideLoading = () => {
       loadingIndicator.style.opacity = 0;
       // Use setTimeout to match CSS transition before setting visibility to hidden
       setTimeout(() => {
            // Check if it should still be hidden (e.g., another load hasn't started)
            // This check is imperfect if loads happen very quickly, but helps prevent flicker.
            if (loadingIndicator.style.opacity === '0') {
                 loadingIndicator.classList.add('hidden');
                 loadingIndicator.style.visibility = 'hidden';
            }
       }, 300); // Match the transition duration in CSS (0.3s)
    };


    // --- Event Listeners ---
    closeDetailButton.addEventListener('click', hidePokemonDetail);

    // Optional: Close detail view if clicking the backdrop (outside the content)
    pokemonDetailContainer.addEventListener('click', (event) => {
        // Check if the direct click target is the container itself
        if (event.target === pokemonDetailContainer) {
            hidePokemonDetail();
        }
    });

    // Close detail view on 'Escape' key press
     document.addEventListener('keydown', (event) => {
        if (event.key === 'Escape' && !pokemonDetailContainer.classList.contains('hidden')) {
             hidePokemonDetail();
        }
     });


    // --- Initial Load ---
    fetchAllPokemon();

}); // End DOMContentLoaded