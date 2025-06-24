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

    // Search results toggle
    const searchInput = document.getElementById("searchInput");
    const searchResults = document.getElementById("searchResults");

    searchInput.addEventListener("input", () => {
        searchResults.classList.toggle("active", searchInput.value.trim() !== "");
    });

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
});
