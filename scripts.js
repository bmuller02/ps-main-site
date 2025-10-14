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
    const container = document.querySelector('.wave-container');
    const group = document.querySelector('.wave-card-group');
    const left = document.querySelector('.wave-arrow.left');
    const right = document.querySelector('.wave-arrow.right');
    const cards = Array.from(document.querySelectorAll('.wave-card'));
    
    let currentPosition = 0;
    const visibleCards = 4;
    const totalCards = cards.length;

    function updateCarousel() {
        // Calculate the width of one card position (including margins)
        const cardWidth = container.offsetWidth / visibleCards;
        
        // Move the entire group (cards + wave)
        group.style.transform = `translateX(${-currentPosition * cardWidth}px)`;
        
        // Update arrow visibility
        left.style.opacity = currentPosition === 0 ? '0.5' : '1';
        right.style.opacity = currentPosition >= totalCards - visibleCards ? '0.5' : '1';
        
        // Enable/disable arrows
        left.disabled = currentPosition === 0;
        right.disabled = currentPosition >= totalCards - visibleCards;
    }

    // Add click handlers
    left.addEventListener('click', () => {
        if (currentPosition > 0) {
            currentPosition--;
            updateCarousel();
        }
    });

    right.addEventListener('click', () => {
        if (currentPosition < totalCards - visibleCards) {
            currentPosition++;
            updateCarousel();
        }
    });

    // Handle window resize
    window.addEventListener('resize', updateCarousel);

    // Initial setup
    updateCarousel();
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();
