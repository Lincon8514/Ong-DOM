/* ========== JAVASCRIPT GLOBAL (todas as páginas) ========== */

document.addEventListener('DOMContentLoaded', () => {
  console.log('Sistema global carregado');
  
  setupThemeToggle();
  setupMobileMenu();
  updateNavigationMenu(); // NOVA FUNÇÃO
});

// Configurar tema claro/escuro
function setupThemeToggle() {
  const themeBtn = document.getElementById('theme-toggle');
  if (!themeBtn) return;
  
  const currentTheme = localStorage.getItem('dom_theme') || 'light';
  document.body.setAttribute('data-theme', currentTheme);
  themeBtn.textContent = currentTheme === 'dark' ? '☀️' : '🌙';
  
  themeBtn.addEventListener('click', () => {
    const newTheme = document.body.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    document.body.setAttribute('data-theme', newTheme);
    localStorage.setItem('dom_theme', newTheme);
    themeBtn.textContent = newTheme === 'dark' ? '☀️' : '🌙';
    
    console.log('Tema alterado para:', newTheme);
  });
  
  console.log('Tema carregado:', currentTheme);
}

// Configurar menu mobile
function setupMobileMenu() {
  const menuBtn = document.getElementById('menu-btn');
  const nav = document.querySelector('header nav');
  
  if (!menuBtn || !nav) return;
  
  menuBtn.addEventListener('click', () => {
    const isExpanded = menuBtn.getAttribute('aria-expanded') === 'true';
    menuBtn.setAttribute('aria-expanded', !isExpanded);
    nav.classList.toggle('active');
  });
  
  document.addEventListener('click', (e) => {
    if (!menuBtn.contains(e.target) && !nav.contains(e.target)) {
      menuBtn.setAttribute('aria-expanded', 'false');
      nav.classList.remove('active');
    }
  });
}

// NOVA FUNÇÃO: Atualizar menu de navegação dinamicamente
function updateNavigationMenu() {
  const nav = document.querySelector('header nav ul');
  
  if (!nav) {
    console.warn('Menu de navegação não encontrado');
    return;
  }
  
  const currentUser = window.authSystem?.getCurrentUser();
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  
  // Itens do menu base
  const menuItems = [
    { text: 'Início', href: 'index.html'},
    { text: 'Projetos', href: 'projetos.html'},
    { text: 'Doar', href: 'doacoes.html'},
    { text: 'Contato', href: 'contato.html'}
  ];
  
  // Adicionar item baseado no status de login
  if (currentUser) {
    if (currentUser.tipo === 'admin') {
      menuItems.push({ text: 'Painel Admin', href: 'profileAdm.html'});
    } else {
      menuItems.push({ text: 'Meu Perfil', href: 'profileVoluntario.html'});
    }
  } else {
    menuItems.push({ text: 'Login', href: 'login.html'});
  }
  
  // Construir HTML do menu
  nav.innerHTML = menuItems.map(item => {
    const isActive = item.href === currentPage ? 'class="active"' : '';
    return `<li><a href="${item.href}" ${isActive}>${item.text}</a></li>`;
  }).join('');
  
  console.log('Menu atualizado para:', currentUser?.tipo || 'visitante');
}