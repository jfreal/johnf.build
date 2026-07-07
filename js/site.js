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

// 90/90/90 theory: live compounding calculator (only on that page)
const qualityEl = document.getElementById('quality');
if (qualityEl) {
    const stepsEl = document.getElementById('steps');
    const qualityOut = document.getElementById('qualityOut');
    const stepsOut = document.getElementById('stepsOut');
    const finalOut = document.getElementById('finalOut');
    const barsEl = document.getElementById('bars');
    const compareRow = document.getElementById('compareRow');

    const pct = (v) => Math.round(v * 100) + '%';
    // teal when it's holding up, amber in the middle, coral once it's really bleeding
    const fillColor = (v) => (v >= 0.85 ? 'var(--teal)' : v >= 0.7 ? '#d98a2b' : 'var(--coral)');

    const barRow = (label, v) => `
        <div class="bar-row">
            <span class="bar-label">${label}</span>
            <span class="bar-track"><span class="bar-fill" style="width:${v * 100}%;background:${fillColor(v)}"></span></span>
            <span class="bar-val">${pct(v)}</span>
        </div>`;

    const render = () => {
        const quality = +qualityEl.value / 100;
        const n = +stepsEl.value;
        qualityOut.textContent = qualityEl.value + '%';
        stepsOut.textContent = n;

        let running = 1;
        let rows = barRow('The brief', running);
        for (let i = 1; i <= n; i++) {
            running *= quality;
            rows += barRow('Handoff ' + i, running);
        }
        barsEl.innerHTML = rows;
        finalOut.textContent = pct(running);

        compareRow.innerHTML = [0.90, 0.95, 0.99].map((c) => {
            const v = Math.pow(c, n);
            return `<div class="compare-item">
                <p class="compare-q">${Math.round(c * 100)}% each</p>
                <div class="compare-track"><div class="compare-fill" style="width:${v * 100}%;background:${fillColor(v)}"></div></div>
                <p class="compare-val">${pct(v)}</p>
            </div>`;
        }).join('');
    };

    qualityEl.addEventListener('input', render);
    stepsEl.addEventListener('input', render);
    render();
}
