document.addEventListener("DOMContentLoaded", () => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || []
    const favPokemonContainer = document.getElementById("favPokemonContainer")
    const apiUrl = "https://pokeapi.co/api/v2/"

    if (favorites.length === 0) {
        favPokemonContainer.innerHTML = "<p>Aucun Pokémon en favori.</p>"
        return
    } else {
        pokemonFav(favorites.name)
    }

    async function pokemonFav() {
        favPokemonContainer.innerHTML = ""

        for (let i = 0; i < favorites.length; i++){
            const response = await fetch(`${apiUrl}/pokemon/${favorites[i]}`)
            const pokemon = await response.json()
            const pokemonDiv = document.createElement("div")
            pokemonDiv.innerHTML = `
                <p>${pokemon.name.toUpperCase()}</p>
             <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}" class="clickable-pokemon" data-name="${pokemon.name}">
        `
            favPokemonContainer.appendChild(pokemonDiv)
        }   
        
        document.querySelectorAll(".clickable-pokemon").forEach(img => {
            img.addEventListener("click", (e) => {
                const selectedPokemon = e.target.getAttribute("data-name")
                window.location.href = `indexPokémon.html?pokemon=${selectedPokemon}`
            })
        })
    }
        
})

