// Smooth scroll for in-page anchors
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href');
    if (id.length > 1) {
      e.preventDefault();
      document.querySelector(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.pushState(null, '', id);
    }
  });
});

// Active nav link on scroll
const sections = [...document.querySelectorAll('main section[id]')];
const links = [...document.querySelectorAll('.nav__link')];
const byId = id => links.find(l => l.getAttribute('href') === `#${id}`);

function setActive(id){
  links.forEach(l => l.classList.remove('active'));
  const link = byId(id);
  if(link) link.classList.add('active');
}
const obs = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) setActive(entry.target.id);
  });
}, { rootMargin: "-40% 0px -55% 0px", threshold: [0, 0.25, 0.5, 1] });
sections.forEach(sec => obs.observe(sec));

// Usage Statistics Wave Carousel
document.addEventListener('DOMContentLoaded', function() {
    const carousel = {
        container: document.querySelector('.wave-container'),
        group: document.querySelector('.wave-card-group'),
        prevBtn: document.querySelector('.wave-arrow.left'),
        nextBtn: document.querySelector('.wave-arrow.right'),
        cards: Array.from(document.querySelectorAll('.wave-card')),
        position: 0,
        visibleCards: 4
    };

    function moveCarousel(direction) {
        const totalCards = carousel.cards.length;
        const cardWidth = carousel.cards[0].offsetWidth + 80; // width + margins
        const maxPosition = totalCards - carousel.visibleCards;

        // Update position
        carousel.position = Math.max(0, Math.min(maxPosition, carousel.position + direction));

        // Calculate movement
        const moveX = -carousel.position * cardWidth;
        
        // Apply transform
        carousel.group.style.transform = `translateX(${moveX}px)`;

        // Update button states
        carousel.prevBtn.disabled = carousel.position === 0;
        carousel.nextBtn.disabled = carousel.position === maxPosition;
        
        // Update button styles
        carousel.prevBtn.style.opacity = carousel.position === 0 ? '0.5' : '1';
        carousel.nextBtn.style.opacity = carousel.position === maxPosition ? '0.5' : '1';
    }

    // Event Listeners
    carousel.prevBtn.addEventListener('click', () => moveCarousel(-1));
    carousel.nextBtn.addEventListener('click', () => moveCarousel(1));

    // Initial setup
    moveCarousel(0);
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();
