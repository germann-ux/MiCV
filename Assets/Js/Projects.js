function checkVisibility() {
    const sections = document.querySelectorAll('section');
    const windowHeight = window.innerHeight;
    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        if (sectionTop < windowHeight * 0.75) {
            section.classList.add('visible');
        }
    });

    const toTopButton = document.getElementById('to-top');
    toTopButton.classList.toggle('visible', window.scrollY > 300);
}

document.addEventListener('DOMContentLoaded', checkVisibility);
window.addEventListener('scroll', checkVisibility);

document.getElementById('to-top').addEventListener('click', function (e) {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// --- Helpers i18n locales ---
function currentLang() {
    return localStorage.getItem("lang")
        || ((navigator.language || "").toLowerCase().startsWith("en") ? "en" : "es");
}
function pack(lang = currentLang()) {
    return (window.dict && window.dict[lang]) || {};
}
function i18nArray(key, lang = currentLang()) {
    const p = pack(lang);
    const val = p[key];
    return Array.isArray(val) ? val : [];
}
function i18nObject(key, lang = currentLang()) {
    const p = pack(lang);
    const val = p[key];
    return (val && typeof val === "object") ? val : {};
}

// --- Carga inicial de textos del botón "apúrate" ---
let hurryMessages = i18nArray("hurry.messages");
let hurryEggs = i18nObject("hurry.eggs");

// Si cambia el idioma (por el switch), refrescamos los textos
document.addEventListener("langchange", (e) => {
    const lang = e.detail?.lang || currentLang();
    hurryMessages = i18nArray("hurry.messages", lang);
    hurryEggs = i18nObject("hurry.eggs", lang);
});

// --- Handler del botón ---
let hurryClicks = 0;
document.getElementById('hurry-btn').addEventListener('click', function () {
    hurryClicks++;
    const lang = currentLang();
    const P = pack(lang);

    if (hurryEggs[hurryClicks]) {
        alert(hurryEggs[hurryClicks]);
    } else {
        // Easter egg aleatorio raro (2% de probabilidad)
        if (Math.random() < 0.02) {
            alert(P["hurry.alert.secret"] || "Secret mode!");
        } else {
            // Mensaje aleatorio desde el dict
            const msgs = (hurryMessages.length ? hurryMessages : ["..."]);
            const randomMessage = msgs[Math.floor(Math.random() * msgs.length)];
            alert(randomMessage);
        }
    }

    if (hurryClicks === 10) {
        this.textContent = P["hurry.btn.stop"] || "¡Ya déjalo en paz!";
    }

    if (hurryClicks === 100) {
        this.textContent = P["hurry.btn.100"] || "100 clics ✨";
        alert(P["hurry.alert.confettiFinal"] || "Confetti time!");

        // Confeti (igual que tu código)
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();
            if (timeLeft <= 0) clearInterval(interval);

            confetti({
                ...defaults,
                particleCount: 10,
                origin: { x: Math.random(), y: Math.random() - 0.2 }
            });
        }, 200);
    }
});




const lightbox = document.querySelector('.lightbox');
const lightboxImg = lightbox.querySelector('img');
const galleryItems = document.querySelectorAll('.gallery-item');
const lightboxClose = document.querySelector('.lightbox-close');
const lightboxPrev = document.querySelector('.lightbox-prev');
const lightboxNext = document.querySelector('.lightbox-next');
let currentImgIndex = 0;

galleryItems.forEach((item, index) => {
    item.addEventListener('click', () => {
        const img = item.querySelector('img');
        currentImgIndex = index;
        openLightbox(img.src, img.alt);
    });
});

function openLightbox(src, alt) {
    lightboxImg.src = src;
    lightboxImg.alt = alt;
    lightbox.classList.add('active');
    document.body.style.overflow = 'hidden';
}

function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = 'auto';
}

lightboxClose.addEventListener('click', closeLightbox);
lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
});

function navigateLightbox(offset) {
    currentImgIndex = (currentImgIndex + offset + galleryItems.length) % galleryItems.length;
    const img = galleryItems[currentImgIndex].querySelector('img');
    openLightbox(img.src, img.alt);
}

lightboxPrev.addEventListener('click', () => navigateLightbox(-1));
lightboxNext.addEventListener('click', () => navigateLightbox(1));

document.addEventListener('keydown', (e) => {
    if (!lightbox.classList.contains('active')) return;
    if (e.key === 'Escape') closeLightbox();
    if (e.key === 'ArrowLeft') navigateLightbox(-1);
    if (e.key === 'ArrowRight') navigateLightbox(1);
});

// ===== Re-traducir contenido dinámico cuando cambia el idioma =====
document.addEventListener("langchange", () => {
    // Re-traduce el summary grande
    updateProjectSummary(projects[activeIndex]);

    // Re-traduce cada card ya creada
    document.querySelectorAll(".card").forEach(card => {
        const idx = Number(card.dataset.index);
        if (!Number.isNaN(idx) && projects[idx]) {
            translateCard(card, projects[idx]);
        }
    });
});
