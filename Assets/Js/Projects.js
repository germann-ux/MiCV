
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

const messages = [
    "¡German! ¡Necesitamos esto para ayer!",
    "German dice que está trabajando a toda velocidad...",
    "German ha prometido terminar pronto... otra vez.",
    "German pregunta si puedes esperar un poco más...",
    "‘Solo un commit más’, dijo Germán hace media hora.",
    "Está en una batalla épica contra un bug de 1 línea.",
    "Mientras esperas, puedes hacer un café... o dos.",
    "Dicen que si presionas este botón muchas veces, Germán se acelera."
];

const easterEggs = {
    5: "¿¡5 clics ya!?",
    13: "¿13 clics? Parece que estás buscando bugs a propósito...",
    20: "10+10 = el número de clics que llevas....",
    27: "Quizás eres muy persistente... quizás.",
    34: "‘Don't forget...’ que Germán es humano también.",
    42: "La respuesta al sentido de la vida es... seguir presionando este botón.",
    66: "Tienes mucho tiempo libre ehh.",
    69: "69 clics, Nice.",
    72: "Cliquear este botón tanto te llena de determinación.",
    99: "Ya casi... Quizás si le das 1 clic más, te llevas una sorpresa."
};

let hurryClicks = 99;

document.getElementById('hurry-btn').addEventListener('click', function () {
    hurryClicks++;

    if (easterEggs[hurryClicks]) {
        alert(easterEggs[hurryClicks]);
    } else {
        // Easter egg aleatorio raro (2% de probabilidad)
        if (Math.random() < 0.02) {
            alert("🎉 ¡Has desbloqueado el 'Modo Secreto', ¿qué te da esto? Nada en absoluto. Pero ¿a poco no está cool?");
        } else {
            const randomMessage = messages[Math.floor(Math.random() * messages.length)];
            alert(randomMessage);
        }
    }

    if (hurryClicks === 10) {
        this.textContent = "¡Ya déjalo en paz!";
    }

    if (hurryClicks === 100) {
        this.textContent = "Germán ascendió. ✨";
        alert("💥 ¡Felicidades! Has desbloqueado el final secreto: Modo Confeti Infinito 🥳");

        // Confeti
        const duration = 3 * 1000;
        const animationEnd = Date.now() + duration;
        const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 1000 };

        const interval = setInterval(function () {
            const timeLeft = animationEnd - Date.now();

            if (timeLeft <= 0) {
                clearInterval(interval);
            }

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
