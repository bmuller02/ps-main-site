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
  const group = document.getElementById('wave-card-group');
  const left = document.getElementById('wave-arrow-left');
  const right = document.getElementById('wave-arrow-right');
  const cards = group ? group.children : [];
  let current = 0;
  const visible = 3;
  function update() {
    if (!group) return;
    const offset = -current * (cards[0]?.offsetWidth + 32 || 112);
    group.style.transform = `translateX(${offset}px)`;
    left.disabled = current === 0;
    right.disabled = current >= cards.length - visible;
  }
  if (left && right && group) {
    left.addEventListener('click', function() {
      if (current > 0) current--;
      update();
    });
    right.addEventListener('click', function() {
      if (current < cards.length - visible) current++;
      update();
    });
    update();
  }
});

// Footer year
document.getElementById('year').textContent = new Date().getFullYear();
