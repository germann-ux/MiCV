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

// Datos de proyectos (simulados)
const projects = [
    {
        id: 1,
        title: "ACC",
        image: "Assets/Imgs/charp.webp",
        description: "Aprendiendo C# con Charp(ACC) Es un Entorno Multiplataforma para aprender c# de forma progresiva y interactiva, mi proyecto mas ambicioso en su momento originalmente pensado para participar en una competencia de prototipos(spoiler: no gane).",
        resumen: "Entorno multiplataforma para aprender C#",
        url: "Projects/ACC/ACC.html"
    },
    {
        id: 2,
        title: "Casandra",
        image: "Assets/Imgs/CasandraLogo.png",
        description: "Mi propio sistema de analisis criminal echo pensando en la seguridad y el apoyo que puedo dar yo a mi estado natal(Guanajuato, Mexico).",
        resumen: "Sistema de análisis criminal para Guanajuato.",
        url: "Projects/Casandra/Casandra.html"
    },
    {
        id: 3,
        title: "CABAE",
        image: "Assets/Imgs/CABAE-LOGO.png",
        description: "Mi proyecto mas ambicioso, mezclando 2 de mis pasiones, la programacion y la mecanica cuantica en este proyecto de cifrado cuantico, donde se explora el potencial de la computación cuántica para mejorar la seguridad de los sistemas de cifrado.",
        resumen: "Proyecto de cifrado cuantico explorando el potencial de la computación cuántica.",
        url: "Projects/CABAE/CABAE.html"
    },
    {
        id: 4,
        title: "Este CV",
        image: "Assets/Imgs/CV-img.png",
        description: "Explora el desarrollo de este mismo curriculum que estas viendo! Incluye un carrusel de proyectos, navegación suave y un diseño responsivo que se adapta a cualquier dispositivo.",
        resumen: "Mira como es que hice este curriculum que estas viendo!",
        url: "Projects/EsteCV/EsteCV.html"
    },
    {
        id: 5,
        title: "Coming soon",
        image: "Assets/Imgs/Morao4K.png",
        description: "Mis proyectos aun en concepto, ideas que pueden o no llegar al desarrollo. Aquí podrás ver un poco de lo que me inspira y motiva.",
        resumen: "ideas y conceptos de proyectos futuros.",
        url: "Projects/ComingSoon/ComingSoon.html"
    },
    {
        id: 6,
        title: "Mis Terminales",
        image: "Assets/Imgs/muchoFlou.png",
        description: "Un proyecto personal mio donde personalize mis terminales que suelo usar (CMD y PowerShell)",
        resumen: "Personalización de mis terminales que mas uso (CMD y PowerShell).",
        url: "Projects/MisTerminales/MisTerminales.html"
    }
];

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

    projects.forEach((project, index) => {
        const card = document.createElement('div');
        card.className = getCardClass(index);
        card.dataset.index = index;

        card.innerHTML = `
        <img src=${project.image} alt="${project.title}">
            <h3>${project.title}</h3>
            <p>${project.resumen}</p>
            <button aria-label="Ver detalles del proyecto ${project.title}">
                Ver Proyecto <i class="fas fa-arrow-right"></i>
            </button>
            `;

        card.addEventListener('click', () => {
            if (card.classList.contains('active')) {
                window.open(project.url, '_blank');
            } else {
                goToSlide(index);
            }
        });

        card.querySelector('button').addEventListener('click', (e) => {
            e.stopPropagation();
            window.open(project.url, '_blank');
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

function updateProjectSummary(project) {
    const projectSummary = document.querySelector('.project-summary');
    projectSummary.innerHTML = `
            <h2>${project.title}</h2>
            <p>${project.description}</p>
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