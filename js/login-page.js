/* ========== JAVASCRIPT EXCLUSIVO DA PÁGINA LOGIN ========== */

document.addEventListener('DOMContentLoaded', () => {
  console.log('Página de login carregada');
  
  // Verificar se já está logado
  const currentUser = window.authSystem?.getCurrentUser();
  if (currentUser) {
    redirectToProfile(currentUser);
    return;
  }
  
  setupLoginForm();
});

// Configurar formulário de login
function setupLoginForm() {
  const form = document.getElementById('loginForm');
  
  if (form) {
    form.addEventListener('submit', handleLogin);
  }
}

// Processar login
async function handleLogin(e) {
  e.preventDefault();
  
  const email = document.getElementById('email').value.trim();
  const senha = document.getElementById('senha').value;
  const btn = document.getElementById('btnLogin');
  
  // Validações básicas
  if (!email || !senha) {
    showAlert('Por favor, preencha todos os campos.', 'error');
    return;
  }
  
  // Validar email
  if (!isValidEmail(email)) {
    showAlert('Por favor, insira um e-mail válido.', 'error');
    return;
  }
  
  // Mostrar loading
  btn.classList.add('loading');
  btn.disabled = true;
  
  // Simular delay de rede (opcional)
  await new Promise(resolve => setTimeout(resolve, 500));
  
  // Tentar fazer login
  const result = window.authSystem?.login(email, senha);
  
  btn.classList.remove('loading');
  btn.disabled = false;
  
  if (result.success) {
    showAlert('Login realizado com sucesso! Redirecionando...', 'success');
    
    // Redirecionar após 1 segundo
    setTimeout(() => {
      redirectToProfile(result.user);
    }, 1000);
  } else {
    showAlert(result.message || 'Erro ao fazer login. Verifique suas credenciais.', 'error');
  }
}

// Redirecionar para perfil
function redirectToProfile(user) {
  if (user.tipo === 'admin') {
    window.location.href = 'profileAdm.html';
  } else {
    window.location.href = 'profileVoluntario.html';
  }
}

// Mostrar alerta
function showAlert(message, type = 'info') {
  const container = document.getElementById('alertContainer');
  if (!container) return;
  
  container.innerHTML = `
    <div class="alert alert-${type}">
      ${message}
    </div>
  `;
  
  // Remover após 5 segundos
  setTimeout(() => {
    container.innerHTML = '';
  }, 5000);
}

// Validar email
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}