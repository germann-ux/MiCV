// Inicialización cuando se carga la página
document.addEventListener('DOMContentLoaded', function () {
    // Detecta cuando el usuario ha scrolleado
    window.addEventListener('scroll', function () {
        // Muestra u oculta el botón 'back to top'
        toggleBackToTopButton();

        // Detecta secciones visibles para animarlas
        fadeInVisibleSections();
    });

    // Aseguramos que la primera sección esté visible inmediatamente
    const sections = document.querySelectorAll('section');
    if (sections.length > 0) {
        sections[0].classList.add('visible');
    }

    // Iniciar la detección de secciones visibles
    fadeInVisibleSections();

    // Navegación suave para todos los enlaces internos
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();

            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                window.scrollTo({
                    top: targetElement.offsetTop - 70, // Ajuste para la barra de navegación
                    behavior: 'smooth'
                });
            }
        });
    });
});

// Función para mostrar u ocultar el botón 'back to top'
function toggleBackToTopButton() {
    const backToTopButton = document.getElementById('to-top');

    if (window.pageYOffset > 300) {
        backToTopButton.classList.add('visible');
    } else {
        backToTopButton.classList.remove('visible');
    }
}

// Función para detectar secciones visibles y aplicar la clase 'visible'
function fadeInVisibleSections() {
    const sections = document.querySelectorAll('section:not(.visible)');
    const windowHeight = window.innerHeight;

    sections.forEach(section => {
        const sectionTop = section.getBoundingClientRect().top;
        const sectionBottom = section.getBoundingClientRect().bottom;

        // Si la sección está parcialmente visible en la ventana
        if (sectionTop < windowHeight - 100 && sectionBottom > 0) {
            section.classList.add('visible');
        }
    });
}

// Datos de proyectos (i18n-ready)
const projects = [
    {
        id: 1,
        titleKey: "proj.acc.title",
        resumenKey: "proj.acc.summary",
        descKey: "proj.acc.desc",
        image: "Assets/Imgs/charp.webp",
        url: "./Projects/ACC/ACC.html"
    },
    {
        id: 2,
        titleKey: "proj.casandra.title",
        resumenKey: "proj.casandra.summary",
        descKey: "proj.casandra.desc",
        image: "Assets/Imgs/CasandraLogo.png",
        url: "./Projects/Casandra/Casandra.html"
    },
    {
        id: 3,
        titleKey: "proj.cabae.title",
        resumenKey: "proj.cabae.summary",
        descKey: "proj.cabae.desc",
        image: "Assets/Imgs/CABAE-LOGO.png",
        url: "./Projects/CABAE/CABAE.html"
    },
    {
        id: 4,
        titleKey: "proj.cv.title",
        resumenKey: "proj.cv.summary",
        descKey: "proj.cv.desc",
        image: "Assets/Imgs/CV-img.png",
        url: "./Projects/EsteCV/EsteCV.html"
    },
    {
        id: 5,
        titleKey: "proj.coming.title",
        resumenKey: "proj.coming.summary",
        descKey: "proj.coming.desc",
        image: "Assets/Imgs/Morao4K.png",
        url: "./Projects/ComingSoon/ComingSoon.html"
    },
    {
        id: 6,
        titleKey: "proj.term.title",
        resumenKey: "proj.term.summary",
        descKey: "proj.term.desc",
        image: "Assets/Imgs/muchoFlou.png",
        url: "./Projects/MisTerminales/MisTerminales.html"
    }
];

// ===== i18n helpers para contenido dinámico (carrusel) =====
const LANG_STORAGE = "lang";

function getLang() {
    return localStorage.getItem(LANG_STORAGE) || "es";
}

function getPack() {
    const lang = getLang();
    return (window.dict && (window.dict[lang] || window.dict.es)) || {};
}

// Traducción simple con fallback
function t(key, fallback = "") {
    const pack = getPack();
    return (key in pack) ? pack[key] : fallback;
}

// Variables globales
let activeIndex = 0;
let interval;
const autoplayTime = 7000; // 7 segundos entre cambios
const autoplayEnabled = true; // Set to false to disable autoplay

// Inicializar carrusel (cuando DOM esté listo)
document.addEventListener('DOMContentLoaded', initCarousel);

function initCarousel() {
    const handElement = document.querySelector('.hand');
    const projectSummary = document.querySelector('.project-summary');
    const dotsContainer = document.querySelector('.dots');
    const prevBtn = document.querySelector('.control-btn.prev');
    const nextBtn = document.querySelector('.control-btn.next');

    updateProjectSummary(projects[activeIndex]);

    // projects.forEach((project, index) => {
    //     const card = document.createElement('div');
    //     card.className = getCardClass(index);
    //     card.dataset.index = index;

    //     card.innerHTML = `
    //     <img src=${project.image} alt="${project.title}">
    //         <h3>${project.title}</h3>
    //         <p>${project.resumen}</p>
    //         <button aria-label="Ver detalles del proyecto ${project.title}">
    //             Ver Proyecto <i class="fas fa-arrow-right"></i>
    //         </button>
    //         `;

    //     card.addEventListener('click', () => {
    //         if (card.classList.contains('active')) {
    //             window.open(project.url, '_self');
    //         } else {
    //             goToSlide(index);
    //         }
    //     });

    //     card.querySelector('button').addEventListener('click', (e) => {
    //         e.stopPropagation();
    //         window.open(project.url, '_self');
    //     });

    //     handElement.appendChild(card);
    // });

    projects.forEach((project, index) => {
        const card = document.createElement('div');
        card.className = getCardClass(index);
        card.dataset.index = index;

        // Estructura neutra (sin textos hardcodeados)
        card.innerHTML = `
        <img src="${project.image}" alt="">
        <h3 data-role="title"></h3>
        <p data-role="summary"></p>
        <button data-role="cta"></button>
    `;

        // Traducción inicial de la card
        translateCard(card, project);

        card.addEventListener('click', () => {
            if (card.classList.contains('active')) {
                window.open(project.url, '_self');
            } else {
                goToSlide(index);
            }
        });

        card.querySelector('[data-role="cta"]').addEventListener('click', (e) => {
            e.stopPropagation();
            window.open(project.url, '_self');
        });

        handElement.appendChild(card);
    });


    projects.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.className = `dot ${index === activeIndex ? 'active' : ''}`;
        dot.dataset.index = index;
        dot.addEventListener('click', () => {
            goToSlide(index);
        });
        dotsContainer.appendChild(dot);
    });

    prevBtn.addEventListener('click', () => {
        goToSlide(activeIndex - 1);
    });

    nextBtn.addEventListener('click', () => {
        goToSlide(activeIndex + 1);
    });

    if (autoplayEnabled) {
        startAutoplay();
    }
}

function getCardClass(index) {
    const diff = index - activeIndex;
    if (diff === 0) return 'card active';
    if (diff === 1 || (diff === -projects.length + 1)) return 'card next';
    if (diff === -1 || (diff === projects.length - 1)) return 'card prev';
    return 'card hidden';
}

function translateCard(card, project) {
    const title = t(project.titleKey, project.titleKey);
    const resumen = t(project.resumenKey, "");
    const ctaText = t("projects.card.cta", "Ver Proyecto");
    const ariaTpl = t("projects.card.cta.aria", "Ver detalles del proyecto {title}");
    const aria = ariaTpl.replace("{title}", title);

    // Alt
    const img = card.querySelector("img");
    if (img) img.setAttribute("alt", title);

    // Textos
    const h3 = card.querySelector('[data-role="title"]');
    if (h3) h3.textContent = title;

    const p = card.querySelector('[data-role="summary"]');
    if (p) p.textContent = resumen;

    // Botón
    const btn = card.querySelector('[data-role="cta"]');
    if (btn) {
        btn.setAttribute("aria-label", aria);
        btn.innerHTML = `${ctaText} <i class="fas fa-arrow-right" aria-hidden="true"></i>`;
    }
}

// function updateProjectSummary(project) {
//     const projectSummary = document.querySelector('.project-summary');
//     projectSummary.innerHTML = `
//             <h2>${project.title}</h2>
//             <p>${project.description}</p>
//             `;
// }

function updateProjectSummary(project) {
    const projectSummary = document.querySelector('.project-summary');
    if (!projectSummary) return;

    const title = t(project.titleKey, "");
    const desc = t(project.descKey, "");

    projectSummary.innerHTML = `
        <h2>${title}</h2>
        <p>${desc}</p>
    `;
}

function goToSlide(index) {
    const handElement = document.querySelector('.hand');
    const dotsContainer = document.querySelector('.dots');

    if (index < 0) index = projects.length - 1;
    else if (index >= projects.length) index = 0;

    activeIndex = index;
    updateProjectSummary(projects[activeIndex]);

    document.querySelectorAll('.card').forEach((card, i) => {
        card.className = getCardClass(i);
    });

    document.querySelectorAll('.dot').forEach((dot, i) => {
        dot.classList.toggle('active', i === activeIndex);
    });

    if (autoplayEnabled) {
        clearInterval(interval);
        startAutoplay();
    }
}

function startAutoplay() {
    interval = setInterval(() => {
        goToSlide(activeIndex + 1);
    }, autoplayTime);
}