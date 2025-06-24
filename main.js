// main.js
document.addEventListener("DOMContentLoaded", () => {
    // Hamburger menu toggle
    const hamburger = document.getElementById("hamburger");
    const navLinks = document.querySelector(".nav-links");

    hamburger.addEventListener("click", () => {
        const isExpanded = hamburger.classList.toggle("active");
        navLinks.classList.toggle("active");
        hamburger.setAttribute("aria-expanded", isExpanded);
    });

    hamburger.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            hamburger.click();
        }
    });

    navLinks.querySelectorAll("a").forEach((link) => {
        link.addEventListener("click", () => {
            hamburger.classList.remove("active");
            navLinks.classList.remove("active");
            hamburger.setAttribute("aria-expanded", "false");
            navLinks.querySelectorAll("a").forEach((a) => a.classList.remove("active"));
            link.classList.add("active");
        });
    });

    // Debounce function for search
    const debounce = (func, delay) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), delay);
        };
    };

    // Fetch games from games.json
    let allGames = [];

    async function loadGames() {
        try {
            const response = await fetch("games.json", { priority: "high" });
            allGames = await response.json();
            renderHomepageGames();
            renderGameDetails();
        } catch (error) {
            console.error("Error loading games:", error);
        }
    }

    // Create game card element
    function createGameCard(game) {
        const card = document.createElement("a");
        card.href = game.url;
        card.className = "game-card";
        card.dataset.name = game.name.toLowerCase();
        card.dataset.category = game.category;
        if (game.featured) card.dataset.featured = "true";
        if (game.isPopular) card.dataset.popular = "true";

        const img = document.createElement("img");
        img.src = game.image;
        img.alt = `${game.name} ${game.category}`;
        img.loading = "lazy";
        img.decoding = "async";
        img.width = game.featured ? 300 : (game.isPopular ? 200 : 150);
        img.height = game.featured ? 300 : (game.isPopular ? 200 : 150);

        const title = document.createElement("h3");
        title.textContent = game.name;

        card.appendChild(img);
        card.appendChild(title);
        return card;
    }

    // Render homepage games
    function renderHomepageGames() {
        const gameGrid = document.getElementById("zon_games");
        gameGrid.innerHTML = "";
        const fragment = document.createDocumentFragment();
        allGames.filter((game) => game.onHomepage).forEach((game) => {
            const card = createGameCard(game);
            fragment.appendChild(card);
        });
        gameGrid.appendChild(fragment);
    }

    // Render game details for gameplay section
    function renderGameDetails() {
        const game = allGames.find((g) => g.id === 1); // Default to first game
        if (game) {
            document.getElementById("gameIframe").src = game.embedUrl;
            document.getElementById("gameIframe").title = `${game.name} Gameplay`;
            document.getElementById("gameImage").src = game.image.replace("300", "60").replace("200", "60").replace("150", "60");
            document.getElementById("gameImage").alt = game.name;
            document.getElementById("gameTitle").textContent = game.name;
            document.getElementById("gameDescription").textContent = game.description;
        }
    }

    // Search functionality
    const searchInput = document.getElementById("searchInput");
    const searchResults = document.getElementById("searchResults");
    const searchGrid = document.getElementById("searchGrid");

    searchInput.addEventListener("input", debounce(() => {
        const query = searchInput.value.trim().toLowerCase();
        searchGrid.innerHTML = "";
        let hasResults = false;

        if (query === "") {
            searchResults.classList.remove("active");
        } else {
            searchResults.classList.add("active");
            const fragment = document.createDocumentFragment();
            allGames.forEach((game) => {
                if (game.name.toLowerCase().includes(query)) {
                    hasResults = true;
                    const card = createGameCard(game);
                    fragment.appendChild(card);
                }
            });
            searchGrid.appendChild(fragment);
            if (!hasResults) {
                const noResults = document.createElement("p");
                noResults.textContent = "No results found";
                noResults.style.color = "#f8fafc";
                noResults.style.textAlign = "center";
                searchGrid.appendChild(noResults);
            }
        }
    }, 300));

    // Fullscreen toggle for game iframe
    const iframe = document.getElementById("gameIframe");
    const fullscreenBtn = document.getElementById("fullscreenBtn");

    fullscreenBtn.addEventListener("click", () => {
        if (!document.fullscreenElement) {
            iframe.requestFullscreen?.();
            fullscreenBtn.textContent = "Exit Fullscreen";
        } else {
            document.exitFullscreen?.();
            fullscreenBtn.textContent = "Fullscreen";
        }
    });

    document.addEventListener("keydown", (e) => {
        if (e.key === "Escape" && document.fullscreenElement) {
            document.exitFullscreen?.();
            fullscreenBtn.textContent = "Fullscreen";
        }
    });

    // Load games on page load
    window.addEventListener("load", loadGames);
});
