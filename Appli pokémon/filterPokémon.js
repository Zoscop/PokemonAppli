const urlParams = new URLSearchParams(window.location.search)
const selectedType = urlParams.get("type")
const filteredPokemonsContainer = document.getElementById("filteredPokemonsContainer")
const apiUrl = "https://pokeapi.co/api/v2/"

if (!selectedType) {
    filteredPokemonsContainer.innerHTML = "<p>Veuillez sélectionner un type.</p>"
} else {
    fetchPokemonsByType()
}

//Récupération des pokémons en fonction du type séléctionné
async function fetchPokemonsByType() {
    try {
        filteredPokemonsContainer.innerHTML = "<p>Chargement des Pokémon...</p>"

        const response = await fetch(`${apiUrl}type/${selectedType}`)
        if (!response.ok) throw new Error("Erreur lors de la récupération des Pokémon du type.")
        const data = await response.json()

        if (data.pokemon.length === 0) {
            filteredPokemonsContainer.innerHTML = "<p>Aucun Pokémon trouvé pour ce type.</p>"
            return
        }

        
     // Affichage des pokémons du type sélectionné avec leur nom et une photo
    filteredPokemonsContainer.innerHTML = ""
    for (let i = 0; i < Math.min(200, data.pokemon.length); i++) { // Limite à 200 pokémons
        const pokemon = data.pokemon[i].pokemon
        const pokemonData = await fetch(`${apiUrl}pokemon/${pokemon.name}`).then(res => res.json())

     const pokemonDiv = document.createElement("div")
        pokemonDiv.innerHTML = `
            <p>${pokemonData.name.toUpperCase()}</p>
            <img src="${pokemonData.sprites.front_default}" alt="${pokemonData.name}" class="clickable-pokemon" data-name="${pokemonData.name}">
        `
        filteredPokemonsContainer.appendChild(pokemonDiv)
    }

    // Redirection vers la page principale avec le nom du pokémon filtré en paramètre
    document.querySelectorAll(".clickable-pokemon").forEach(img => {
        img.addEventListener("click", (e) => {
            const selectedPokemon = e.target.getAttribute("data-name")
            window.location.href = `indexPokémon.html?pokemon=${selectedPokemon}`
        })
    })
    }catch (error) {
        console.error(error)
        filteredPokemonsContainer.innerHTML = "<p>Une erreur est survenue lors du chargement.</p>"
}}


