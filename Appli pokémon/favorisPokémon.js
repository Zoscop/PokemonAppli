document.addEventListener("DOMContentLoaded", () => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || []
    const favPokemonContainer = document.getElementById("favPokemonContainer")
    const apiUrl = "https://pokeapi.co/api/v2/"

    // Recherche de favoris dans le local storage, si oui, appel de la fonction
    if (favorites.length === 0) {
        favPokemonContainer.innerHTML = "<p>Aucun Pokémon en favori.</p>"
        return
    } else {
        pokemonFav(favorites.name)
    }

    // Fonction pour afficher les pokémons en favoris
    async function pokemonFav() {
        favPokemonContainer.innerHTML = ""

        // Parcours du tableau local storage
        for (let i = 0; i < favorites.length; i++){
            const response = await fetch(`${apiUrl}/pokemon/${favorites[i]}`)
            const pokemon = await response.json()
            
            // Création des div dans le container
            const pokemonDiv = document.createElement("div")
            pokemonDiv.innerHTML = `
                <p>${pokemon.name.toUpperCase()}</p>
             <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" class="clickable-pokemon" data-name="${pokemon.name}">
        `
            favPokemonContainer.appendChild(pokemonDiv)
        }   

        // Redirection vers la page principale
        document.querySelectorAll(".clickable-pokemon").forEach(img => {
            img.addEventListener("click", (e) => {
                const selectedPokemon = e.target.getAttribute("data-name")
                window.location.href = `indexPokémon.html?pokemon=${selectedPokemon}`
            })
        })
    }
        
})

