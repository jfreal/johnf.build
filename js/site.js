// johnf.build. Tiny vanilla helpers. No framework.

const yearEl = document.getElementById('year');
if (yearEl) yearEl.textContent = new Date().getFullYear();

// Reveal sections on scroll
const reveal = (entries, observer) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            observer.unobserve(entry.target);
        }
    });
};

if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(reveal, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });
    document.querySelectorAll('section, .polaroid, .product-card, .quote').forEach((el) => {
        el.classList.add('reveal');
        io.observe(el);
    });
}
