/* ========== SISTEMA DE CAROUSEL (BANNER ROTATIVO) ========== */

let currentSlideIndex = 0;
let autoSlideInterval;

// Inicializar carousel
document.addEventListener('DOMContentLoaded', () => {
  startAutoSlide();
  console.log(' Carousel iniciado');
});

// Mover slide
function moveSlide(direction) {
  const slides = document.querySelectorAll('.carousel-slide');
  const indicators = document.querySelectorAll('.indicator');
  
  // Remover classe active do slide atual
  slides[currentSlideIndex].classList.remove('active');
  indicators[currentSlideIndex].classList.remove('active');
  
  // Calcular novo índice
  currentSlideIndex += direction;
  
  // Loop infinito
  if (currentSlideIndex >= slides.length) {
    currentSlideIndex = 0;
  } else if (currentSlideIndex < 0) {
    currentSlideIndex = slides.length - 1;
  }
  
  // Adicionar classe active ao novo slide
  slides[currentSlideIndex].classList.add('active');
  indicators[currentSlideIndex].classList.add('active');
  
  // Resetar auto slide
  resetAutoSlide();
}

// Ir para slide específico
function currentSlide(index) {
  const slides = document.querySelectorAll('.carousel-slide');
  const indicators = document.querySelectorAll('.indicator');
  
  // Remover classe active
  slides[currentSlideIndex].classList.remove('active');
  indicators[currentSlideIndex].classList.remove('active');
  
  // Atualizar índice
  currentSlideIndex = index;
  
  // Adicionar classe active
  slides[currentSlideIndex].classList.add('active');
  indicators[currentSlideIndex].classList.add('active');
  
  // Resetar auto slide
  resetAutoSlide();
}

// Auto slide (a cada 5 segundos)
function startAutoSlide() {
  autoSlideInterval = setInterval(() => {
    moveSlide(1);
  }, 5000);
}

// Resetar auto slide
function resetAutoSlide() {
  clearInterval(autoSlideInterval);
  startAutoSlide();
}

// Pausar auto slide ao passar o mouse
document.addEventListener('DOMContentLoaded', () => {
  const carousel = document.querySelector('.hero-carousel');
  
  if (carousel) {
    carousel.addEventListener('mouseenter', () => {
      clearInterval(autoSlideInterval);
    });
    
    carousel.addEventListener('mouseleave', () => {
      startAutoSlide();
    });
  }
});