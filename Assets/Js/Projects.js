
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

document.getElementById('hurry-btn').addEventListener('click', function () {
    const messages = [
        "¡German! ¡Necesitamos esto para ayer!",
        "German dice que está trabajando a toda velocidad...",
        "German ha prometido terminar pronto... otra vez.",
        "German pregunta si puedes esperar un poco más...",
        "¡German está programando con 8 tazas de café encima!"
    ];
    alert(messages[Math.floor(Math.random() * messages.length)]);
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
