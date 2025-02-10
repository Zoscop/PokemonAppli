document.addEventListener("DOMContentLoaded", () => {
    const favorites = JSON.parse(localStorage.getItem("favorites")) || []
    const favoritesList = document.getElementById("favoritesList")

    if (favorites.length === 0) {
        favoritesList.innerHTML = "<p>Aucun Pokémon en favori.</p>"
        return
    }

    favorites.forEach(name => {
        const btn = document.createElement("button")
        btn.textContent = name.charAt(0).toUpperCase() + name.slice(1)
        btn.addEventListener("click", () => {
            window.location.href = `indexPokémon.html?pokemon=${name}`
        })
        favoritesList.appendChild(btn)
    })
})