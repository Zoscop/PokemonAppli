const input = document.getElementById('input')
const button = document.getElementById('button')
const p = document.getElementById("p")
const img = document.getElementById("img")
const img2 = document.getElementById("back")
const infoButton = document.getElementById("infoButton")
const recommendedContainer = document.getElementById("recommendedContainer")
const recentContainer = document.getElementById("recentContainer")
const typeFilter = document.getElementById("typeFilter")
const genFilter = document.getElementById("genFilter")
const filterButton = document.getElementById("filterButton")
const favButton = document.getElementById("favoritesButton")

const url = "https://pokeapi.co/api/v2/"
let recentSearches = []
let currentPokemon = null // Pokémon sélectionné

const favoriteStar = document.getElementById("favoriteStar")
let favorites = JSON.parse(localStorage.getItem("favorites")) || []

// événement de recherche
button.addEventListener("click", () => fetchPokemon(input.value.toLowerCase()))


window.onload = async () => {
    await populateFilters() // Chargement des types pour le filtrage
    showRecommendedPokemons()  // Afficher les 5 pokémons recommandés
    
    // Vérifier si un pokémon est dans l'url
    const urlParams = new URLSearchParams(window.location.search)
    const pokemonName = urlParams.get("pokemon")

    if (pokemonName) {
        fetchPokemon(pokemonName) // Affichage des informations du pokémon
    }
    // Supprime le pokémon à la fin de l'url
    setTimeout(() => {
        window.history.replaceState({}, document.title, window.location.pathname)
    }, 1000) 
}


// Récupération des données sur un pokémon
async function fetchPokemon(pokemonName) {
    if (!pokemonName) return

    const response = await fetch(`${url}/pokemon/${pokemonName}`)
    if (!response.ok) {
        p.textContent = `Aucun Pokémon Trouvé`
        img.setAttribute("src", "")
        img2.setAttribute("src", "")
        infoButton.style.display = "none"
        favoriteStar.style.display = "none"
        return
    }

    const pokemon = await response.json()
    currentPokemon = pokemon
    let types = pokemon.types.map(t => t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)).join(", ")
    p.textContent = `Le nom du Pokémon est ${pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)} de type : ${types}`
    img.setAttribute("src", pokemon.sprites.front_default)
    img2.setAttribute("src", pokemon.sprites.back_default)
    updatePokemonCry(pokemon.id) // Appelle la fonction pour le crie
    updateRecentSearches(pokemon.name) //Appelle la fonction pour l'historique
    updateFavoriteStar()
    infoButton.style.display = "block"
    favoriteStar.style.display = "block"
}

// Vérifie si le Pokémon est en favori et met à jour l'étoile
function updateFavoriteStar() {
    if (!currentPokemon) return
    const isFavorite = favorites.includes(currentPokemon.name)
    favoriteStar.textContent = isFavorite ? "★" : "☆"
}

// Ajoute ou enlève un Pokémon des favoris
favoriteStar.addEventListener("click", () => {
    if (!currentPokemon) return

    const index = favorites.indexOf(currentPokemon.name)
    if (index === -1) {
        favorites.push(currentPokemon.name)
    } else {
        favorites.splice(index, 1)
    }

    localStorage.setItem("favorites", JSON.stringify(favorites))
    updateFavoriteStar()
})


// Mise à jour de l'historique des recherches
function updateRecentSearches(name) {
    if (recentSearches.includes(name)) {
        recentSearches = recentSearches.filter(n => n !== name)
    }
    recentSearches.unshift(name)
    if (recentSearches.length > 5) {
        recentSearches.pop()
    }

    recentContainer.innerHTML = ""
    recentSearches.forEach(pokemon => {
        const btn = document.createElement("button")
        btn.textContent = pokemon.charAt(0).toUpperCase() + pokemon.slice(1)
        btn.addEventListener("click", () => fetchPokemon(pokemon))
        recentContainer.appendChild(btn)
    })
}

// Récupéreration de l'URL du cri d'un pokémon via l'API
async function fetchPokemonCry(pokemonId) {
    const apiUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemonId}`
    try {
        const response = await fetch(apiUrl)
        if (!response.ok) {
            throw new Error("Erreur lors de la récupération du cri du Pokémon.")
        }


        // Vérifier si un cri est disponible pour ce pokémon
        const cryUrl = `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${pokemonId}.ogg`
        return cryUrl
    } catch (error) {
        console.error("Erreur: ", error)
    }
}

// Mise à jour de la source du cri
async function updatePokemonCry(pokemonId) {
    const cryUrl = await fetchPokemonCry(pokemonId)
    if (cryUrl) {
        const audioElement = document.getElementById("cries")
        const sourceElement = document.getElementById("cries-source")
        sourceElement.src = cryUrl
        audioElement.load()
    }
}


// Affichage de "plus d'informations" dans une fenêtre modale
infoButton.addEventListener("click", () => {
    if (currentPokemon) {
        showModal(currentPokemon)
    }
});

// Ouvre la fenêtre modale avec les infos du pokémon
function showModal(pokemon) {
    let modal = document.createElement("div")
    modal.style.position = "fixed"
    modal.style.top = "50%"
    modal.style.left = "50%"
    modal.style.transform = "translate(-50%, -50%)"
    modal.style.padding = "20px"
    modal.style.background = "white"
    modal.style.boxShadow = "0px 0px 10px #000000"
    modal.style.zIndex = "1000"
    
    // Peut être fait à part
    modal.innerHTML = `
        <h3>${pokemon.name.toUpperCase()}</h3>
        <p>Type: ${pokemon.types.map(t => t.type.name.charAt(0).toUpperCase() + t.type.name.slice(1)).join(", ")}</p>
        <p>Poids: ${pokemon.weight / 10} kg</p>
        <p>Taille: ${pokemon.height / 10} m</p>
        <p>Talents : ${pokemon.abilities.map(t => t.ability.name.charAt(0).toUpperCase() + t.ability.name.slice(1)).join(", ")}</p>
        <p>Version Shiny:</p>
        <img id = shinyFront src = ${pokemon.sprites.front_shiny}></img><img id = shinyBack src = ${pokemon.sprites.back_shiny}></img>
    `
        
    // Bouton "Fermer" pour fermer la fenêtre modale
    const closeButton = document.createElement("button");
    closeButton.textContent = "Fermer"
    closeButton.style.marginTop = "10px"
    closeButton.addEventListener("click", () => modal.remove())
    modal.appendChild(closeButton)
    document.body.appendChild(modal)
}



// Affichage des 5 pokémons recommandés aléatoirement
async function showRecommendedPokemons() {
    recommendedContainer.innerHTML = ""
    const recommendedPokemons = await getRandomPokemons()
    recommendedPokemons.forEach(pokemon => {
        const btn = document.createElement("button")
        btn.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1)
        btn.addEventListener("click", () => fetchPokemon(pokemon.name))
        recommendedContainer.appendChild(btn)
    })
}

// Récupérartion des pokémons aléatoires
async function getRandomPokemons() {
    const randomPokemons = []
    
    while (randomPokemons.length < 5) {
        const randomId = Math.floor(Math.random() * 1000) + 1
        const response = await fetch(`${url}/pokemon/${randomId}`)
        if (response.ok) {
            const pokemon = await response.json()
            if (!randomPokemons.find(p => p.name === pokemon.name)) {
                randomPokemons.push(pokemon)
            }
        }
    }
    
    return randomPokemons
}

// Chargement des types dans le filtre
async function populateFilters() {
    const typesResponse = await fetch(`${url}/type`)
    const typesData = await typesResponse.json()
    typesData.results.forEach(type => {
        const option = document.createElement("option")
        option.value = type.name
        option.textContent = type.name.charAt(0).toUpperCase() + type.name.slice(1)
        typeFilter.appendChild(option)
    })

}

// événement de clic pour le bouton de filtrage
filterButton.addEventListener("click", () => {
    const selectedType = typeFilter.value

    // Vérification que le type est sélectionné
    if (selectedType) {
        // Construction de l'URL avec les paramètres
        const url = `filterPokémon.html?type=${selectedType}`
        window.location.href = url  // Redirection vers la page filtrée
    } 
})

favButton.addEventListener("click", () => {
    window.location.href = "favorisPokémon.html"; // Redirige vers la page des favoris
});
