// Wave Carousel Logic
let currentCardGroup = 0;
const cardGroups = document.querySelectorAll('.wave-card-group');
const totalGroups = cardGroups.length;

function updateCarousel() {
    const translateX = -currentCardGroup * 100;
    document.querySelector('.wave-card-container').style.transform = `translateX(${translateX}%)`;
    
    // Update visibility and z-index of cards
    cardGroups.forEach((group, index) => {
        if (index === currentCardGroup) {
            group.style.opacity = '1';
            group.style.zIndex = '1';
        } else {
            group.style.opacity = '0';
            group.style.zIndex = '0';
        }
    });
}

function nextGroup() {
    if (currentCardGroup < totalGroups - 1) {
        currentCardGroup++;
        updateCarousel();
    }
}

function prevGroup() {
    if (currentCardGroup > 0) {
        currentCardGroup--;
        updateCarousel();
    }
}

// Add click handlers to navigation arrows
document.addEventListener('DOMContentLoaded', () => {
    document.querySelector('.wave-nav-prev').addEventListener('click', prevGroup);
    document.querySelector('.wave-nav-next').addEventListener('click', nextGroup);
});