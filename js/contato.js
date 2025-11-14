/* ========== JAVASCRIPT DA PÁGINA DE CONTATO ========== */

document.addEventListener('DOMContentLoaded', () => {
  console.log('Página de contato carregada');
  
  setupContactForm();
  setupPhoneMask();
});

// Configurar formulário de contato
function setupContactForm() {
  const form = document.getElementById('contactForm');
  
  if (!form) return;
  
  form.addEventListener('submit', handleContactSubmit);
}

// Processar envio do formulário
async function handleContactSubmit(e) {
  e.preventDefault();
  
  const formData = {
    nome: document.getElementById('nome').value.trim(),
    email: document.getElementById('email').value.trim(),
    telefone: document.getElementById('telefone').value.trim(),
    assunto: document.getElementById('assunto').value,
    mensagem: document.getElementById('mensagem').value.trim(),
    data: new Date().toISOString()
  };
  
  console.log('Enviando mensagem:', formData);
  
  // Validações
  if (!formData.nome || formData.nome.length < 3) {
    alert('Nome deve ter pelo menos 3 caracteres.');
    return;
  }
  
  if (!isValidEmail(formData.email)) {
    alert('E-mail inválido.');
    return;
  }
  
  if (!formData.assunto) {
    alert('Selecione um assunto.');
    return;
  }
  
  if (!formData.mensagem || formData.mensagem.length < 10) {
    alert('Mensagem deve ter pelo menos 10 caracteres.');
    return;
  }
  
  const btn = e.target.querySelector('button[type="submit"]');
  btn.disabled = true;
  btn.textContent = 'Enviando...';
  
  // Simular envio
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  // Salvar no localStorage
  saveContactMessage(formData);
  
  btn.disabled = false;
  btn.textContent = 'Enviar Mensagem';
  
  alert('Mensagem enviada com sucesso! Entraremos em contato em breve.');
  
  // Limpar formulário
  document.getElementById('contactForm').reset();
}

// Salvar mensagem no localStorage
function saveContactMessage(data) {
  const messages = JSON.parse(localStorage.getItem('dom_contatos')) || [];
  messages.push({
    id: 'MSG' + Date.now(),
    ...data,
    status: 'pendente'
  });
  localStorage.setItem('dom_contatos', JSON.stringify(messages));
  console.log('Mensagem salva:', data);
}

// Validar email
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}

// Máscara de telefone
function setupPhoneMask() {
  const telefone = document.getElementById('telefone');
  
  if (!telefone) return;
  
  telefone.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.substring(0, 11);
    
    if (value.length <= 10) {
      value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    } else {
      value = value.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
    }
    
    e.target.value = value;
  });
}