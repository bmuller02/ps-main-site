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

    function getCardWidth() {
        const card = cards[0];
        const style = window.getComputedStyle(card);
        return card.offsetWidth + 
               parseInt(style.marginLeft) + 
               parseInt(style.marginRight);
    }

    function updateCarousel() {
        const cardWidth = getCardWidth();
        const moveAmount = -currentPosition * cardWidth;
        
        // Move the entire group (cards + wave)
        group.style.transform = `translateX(${moveAmount}px)`;
        
        // Update arrow states
        left.style.opacity = currentPosition === 0 ? '0.5' : '1';
        right.style.opacity = currentPosition >= totalCards - visibleCards ? '0.5' : '1';
        left.disabled = currentPosition === 0;
        right.disabled = currentPosition >= totalCards - visibleCards;

        // Update card visibility
        cards.forEach((card, index) => {
            if (index >= currentPosition && index < currentPosition + visibleCards) {
                card.style.opacity = '1';
                card.style.pointerEvents = 'auto';
            } else {
                card.style.opacity = '0';
                card.style.pointerEvents = 'none';
            }
        });
    }

    // Add click handlers
    left.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPosition > 0) {
            currentPosition--;
            updateCarousel();
        }
    });

    right.addEventListener('click', (e) => {
        e.preventDefault();
        if (currentPosition < totalCards - visibleCards) {
            currentPosition++;
            updateCarousel();
        }
    });

    // Handle window resize
    let resizeTimer;
    window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(updateCarousel, 100);
    });

    // Initial setup
    updateCarousel();
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();
