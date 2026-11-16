(() => {
    const field = document.getElementById("star-field");

    if (!field) {
        return;
    }

    const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const mobile = window.matchMedia("(max-width: 600px)").matches;
    const starCount = mobile ? 16 : 28;
    const colors = ["#d9c2ff", "#ffc9e5", "#ffffff", "#ffe9a8"];
    const stars = [];

    for (let index = 0; index < starCount; index += 1) {
        const star = document.createElement("span");
        const color = colors[Math.floor(Math.random() * colors.length)];

        star.className = "star";
        if (index % 3 === 0) {
            star.classList.add("star--twinkle");
        }
        if (index % 5 === 0) {
            star.classList.add("star--reactive");
        }

        star.style.setProperty("--star-x", `${Math.random() * 100}%`);
        star.style.setProperty("--star-y", `${Math.random() * 100}%`);
        star.style.setProperty("--star-size", `${3 + Math.random() * 3}px`);
        star.style.setProperty("--star-color", color);
        star.style.setProperty("--drift-x", `${Math.random() * 18 - 9}px`);
        star.style.setProperty("--drift-y", `${Math.random() * 18 - 9}px`);
        star.style.setProperty("--float-duration", `${8 + Math.random() * 8}s`);
        star.style.setProperty("--float-delay", `${-Math.random() * 12}s`);
        star.style.setProperty("--twinkle-duration", `${3 + Math.random() * 4}s`);
        star.style.setProperty("--twinkle-delay", `${-Math.random() * 5}s`);

        field.appendChild(star);
        stars.push({ element: star, color });
    }

    if (reducedMotion.matches) {
        return;
    }

    let hoveredStar = null;
    let pointerPosition = null;
    let pointerFrame = 0;

    const nearestStar = (x, y, maxDistance) => {
        let nearest = null;
        let nearestDistance = maxDistance;

        stars.forEach((star) => {
            const rect = star.element.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            const distance = Math.hypot(x - centerX, y - centerY);

            if (distance < nearestDistance) {
                nearest = star;
                nearestDistance = distance;
            }
        });

        return nearest;
    };

    const updatePointerEffects = () => {
        pointerFrame = 0;
        if (!pointerPosition) {
            return;
        }

        const nextHoveredStar = nearestStar(pointerPosition.x, pointerPosition.y, 22);
        if (hoveredStar !== nextHoveredStar) {
            if (hoveredStar) {
                hoveredStar.element.classList.remove("is-hovered");
            }
            hoveredStar = nextHoveredStar;
            if (hoveredStar) {
                hoveredStar.element.classList.add("is-hovered");
            }
        }

        stars.forEach((star) => {
            if (!star.element.classList.contains("star--reactive")) {
                return;
            }

            const rect = star.element.getBoundingClientRect();
            const offsetX = Math.max(-7, Math.min(7, (pointerPosition.x - rect.left) * 0.025));
            const offsetY = Math.max(-7, Math.min(7, (pointerPosition.y - rect.top) * 0.025));
            star.element.style.setProperty("--mouse-x", `${offsetX}px`);
            star.element.style.setProperty("--mouse-y", `${offsetY}px`);
        });
    };

    document.addEventListener("pointermove", (event) => {
        if (event.pointerType === "touch") {
            return;
        }

        pointerPosition = { x: event.clientX, y: event.clientY };
        if (!pointerFrame) {
            pointerFrame = window.requestAnimationFrame(updatePointerEffects);
        }
    }, { passive: true });

    document.addEventListener("pointerleave", () => {
        pointerPosition = null;
        if (hoveredStar) {
            hoveredStar.element.classList.remove("is-hovered");
            hoveredStar = null;
        }
    });

    document.addEventListener("click", (event) => {
        const star = nearestStar(event.clientX, event.clientY, 24);
        if (!star) {
            return;
        }

        const rect = star.element.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const particleCount = 6;

        for (let index = 0; index < particleCount; index += 1) {
            const angle = (Math.PI * 2 * index) / particleCount;
            const distance = 14 + Math.random() * 12;
            const particle = document.createElement("span");

            particle.className = "star-particle";
            particle.style.setProperty("--star-color", star.color);
            particle.style.setProperty("--particle-x-start", `${centerX}px`);
            particle.style.setProperty("--particle-y-start", `${centerY}px`);
            particle.style.setProperty("--particle-x", `${Math.cos(angle) * distance}px`);
            particle.style.setProperty("--particle-y", `${Math.sin(angle) * distance}px`);
            field.appendChild(particle);
            window.setTimeout(() => particle.remove(), 700);
        }
    });
})();
