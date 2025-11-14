/* ========== JAVASCRIPT EXCLUSIVO DA PÁGINA CADASTRO ========== */

document.addEventListener('DOMContentLoaded', () => {
  console.log('Página de cadastro carregada');
  
  // Verificar se já está logado
  const currentUser = window.authSystem?.getCurrentUser();
  if (currentUser) {
    redirectToProfile(currentUser);
    return;
  }
  
  setupCadastroForm();
  setupPasswordValidation();
  setupPasswordStrength();
  setupPhoneMask();
  setupCPFMask();
  setupCEPMask();
});

// Configurar formulário de cadastro
function setupCadastroForm() {
  const form = document.getElementById('cadastroForm');
  
  if (form) {
    form.addEventListener('submit', handleCadastro);
  }
}

// Máscara de CPF
function setupCPFMask() {
  const cpfInput = document.getElementById('cpf');
  
  if (!cpfInput) return;
  
  cpfInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.substring(0, 11);
    
    if (value.length <= 11) {
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d)/, '$1.$2');
      value = value.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    }
    
    e.target.value = value;
  });
}

// Máscara de CEP
function setupCEPMask() {
  const cepInput = document.getElementById('cep');
  
  if (!cepInput) return;
  
  cepInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.substring(0, 8);
    
    if (value.length <= 8) {
      value = value.replace(/(\d{5})(\d)/, '$1-$2');
    }
    
    e.target.value = value;
  });
}

// Máscara de telefone
function setupPhoneMask() {
  const telefoneInput = document.getElementById('telefone');
  
  if (!telefoneInput) return;
  
  telefoneInput.addEventListener('input', (e) => {
    let value = e.target.value.replace(/\D/g, '');
    value = value.substring(0, 11);
    
    if (value.length <= 10) {
      value = value.replace(/^(\d{2})(\d{4})(\d{0,4}).*/, '($1) $2-$3');
    } else {
      value = value.replace(/^(\d{2})(\d{5})(\d{0,4}).*/, '($1) $2-$3');
    }
    
    e.target.value = value;
  });
  
  telefoneInput.addEventListener('keydown', (e) => {
    const allowedKeys = [
      'Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 
      'Tab', 'Home', 'End'
    ];
    
    const isNumber = e.key >= '0' && e.key <= '9';
    const isAllowedKey = allowedKeys.includes(e.key);
    const isCtrlA = e.ctrlKey && e.key === 'a';
    const isCtrlC = e.ctrlKey && e.key === 'c';
    const isCtrlV = e.ctrlKey && e.key === 'v';
    
    if (!isNumber && !isAllowedKey && !isCtrlA && !isCtrlC && !isCtrlV) {
      e.preventDefault();
    }
  });
}

// Validação de senha em tempo real
function setupPasswordValidation() {
  const senha = document.getElementById('senha');
  const confirmarSenha = document.getElementById('confirmarSenha');
  
  if (confirmarSenha) {
    confirmarSenha.addEventListener('input', () => {
      if (senha.value && confirmarSenha.value) {
        if (senha.value !== confirmarSenha.value) {
          confirmarSenha.classList.add('error');
        } else {
          confirmarSenha.classList.remove('error');
        }
      }
    });
  }
}

// Validador de força da senha
function setupPasswordStrength() {
  const senhaInput = document.getElementById('senha');
  
  if (!senhaInput) return;
  
  senhaInput.addEventListener('focus', () => {
    const validator = document.getElementById('passwordValidator');
    if (validator) {
      validator.classList.add('show');
    }
  });
  
  senhaInput.addEventListener('input', (e) => {
    const senha = e.target.value;
    updatePasswordStrength(senha);
    updatePasswordRequirements(senha);
  });
  
  senhaInput.addEventListener('blur', () => {
    if (!senhaInput.value) {
      const validator = document.getElementById('passwordValidator');
      if (validator) {
        validator.classList.remove('show');
      }
    }
  });
}

// Atualizar requisitos da senha
function updatePasswordRequirements(senha) {
  const requirements = {
    length: senha.length >= 8,
    uppercase: /[A-Z]/.test(senha),
    lowercase: /[a-z]/.test(senha),
    number: /[0-9]/.test(senha),
    special: /[!@#$%^&*(),.?":{}|<>]/.test(senha)
  };
  
  // Atualizar cada requisito
  Object.keys(requirements).forEach(key => {
    const element = document.getElementById(`req-${key}`);
    if (element) {
      const icon = element.querySelector('.requirement-icon');
      
      if (requirements[key]) {
        // Válido
        element.classList.remove('invalid');
        element.classList.add('valid');
        if (icon) icon.textContent = '✓';
      } else {
        // Inválido
        element.classList.remove('valid');
        element.classList.add('invalid');
        if (icon) icon.textContent = '✗';
      }
    }
  });
  
  return requirements;
}

// Atualizar indicador de força
function updatePasswordStrength(senha) {
  const strengthText = document.getElementById('strengthText');
  const strengthFill = document.getElementById('strengthFill');
  
  if (!strengthText || !strengthFill) return;
  
  const requirements = updatePasswordRequirements(senha);
  const metRequirements = Object.values(requirements).filter(Boolean).length;
  
  strengthText.classList.remove('weak', 'medium', 'strong');
  strengthFill.classList.remove('weak', 'medium', 'strong');
  
  if (senha.length === 0) {
    strengthText.textContent = '';
    strengthFill.style.width = '0%';
    return;
  }
  
  if (metRequirements <= 2) {
    strengthText.textContent = 'Fraca';
    strengthText.classList.add('weak');
    strengthFill.classList.add('weak');
    strengthFill.style.width = '33%';
  } else if (metRequirements <= 4) {
    strengthText.textContent = 'Média';
    strengthText.classList.add('medium');
    strengthFill.classList.add('medium');
    strengthFill.style.width = '66%';
  } else {
    strengthText.textContent = 'Forte';
    strengthText.classList.add('strong');
    strengthFill.classList.add('strong');
    strengthFill.style.width = '100%';
  }
}

// Validar CPF
function validarCPF(cpf) {
  cpf = cpf.replace(/\D/g, '');
  
  if (cpf.length !== 11 || /^(\d)\1+$/.test(cpf)) {
    return false;
  }
  
  let soma = 0;
  for (let i = 0; i < 9; i++) {
    soma += parseInt(cpf.charAt(i)) * (10 - i);
  }
  let resto = 11 - (soma % 11);
  let digito1 = resto >= 10 ? 0 : resto;
  
  soma = 0;
  for (let i = 0; i < 10; i++) {
    soma += parseInt(cpf.charAt(i)) * (11 - i);
  }
  resto = 11 - (soma % 11);
  let digito2 = resto >= 10 ? 0 : resto;
  
  return parseInt(cpf.charAt(9)) === digito1 && parseInt(cpf.charAt(10)) === digito2;
}

// Processar cadastro
async function handleCadastro(e) {
  e.preventDefault();
  
  // Coletar TODOS os dados
  const formData = {
    nome: document.getElementById('nome').value.trim(),
    email: document.getElementById('email').value.trim(),
    cpf: document.getElementById('cpf').value.trim(),
    telefone: document.getElementById('telefone').value.trim(),
    dataNascimento: document.getElementById('dataNascimento').value,
    endereco: document.getElementById('endereco').value.trim(),
    cep: document.getElementById('cep').value.trim(),
    cidade: document.getElementById('cidade').value.trim(),
    estado: document.getElementById('estado').value,
    senha: document.getElementById('senha').value,
    confirmarSenha: document.getElementById('confirmarSenha').value,
    tipo: 'voluntario',
    termos: document.getElementById('termos').checked
  };
  
  console.log('Dados do cadastro:', formData);
  
  // Validações
  const validation = validateCadastro(formData);
  
  if (!validation.valid) {
    showAlert(validation.message, 'error');
    return;
  }
  
  const btn = document.getElementById('btnCadastro');
  
  btn.classList.add('loading');
  btn.disabled = true;
  const textoOriginal = btn.textContent;
  btn.textContent = 'Cadastrando...';
  
  await new Promise(resolve => setTimeout(resolve, 800));
  
  const result = window.authSystem.register(formData);
  
  btn.classList.remove('loading');
  btn.disabled = false;
  btn.textContent = textoOriginal;
  
  if (result.success) {
    showAlert('✅ Cadastro realizado com sucesso! Redirecionando...', 'success');
    
    setTimeout(() => {
      window.location.href = 'login.html';
    }, 2000);
  } else {
    showAlert(result.message || '❌ Erro ao realizar cadastro.', 'error');
  }
}

// Validar dados do cadastro
function validateCadastro(data) {
  if (!data.nome || data.nome.length < 3) {
    return { valid: false, message: '❌ Nome deve ter pelo menos 3 caracteres.' };
  }
  
  if (!isValidEmail(data.email)) {
    return { valid: false, message: '❌ Por favor, insira um e-mail válido.' };
  }
  
  if (!validarCPF(data.cpf)) {
    return { valid: false, message: '❌ CPF inválido!' };
  }
  
  const telefoneNumeros = data.telefone.replace(/\D/g, '');
  if (telefoneNumeros.length < 10 || telefoneNumeros.length > 11) {
    return { valid: false, message: '❌ Telefone inválido. Use DDD + número.' };
  }
  
  if (!data.dataNascimento) {
    return { valid: false, message: '❌ Data de nascimento é obrigatória.' };
  }
  
  if (!data.endereco || data.endereco.length < 5) {
    return { valid: false, message: '❌ Endereço deve ser completo.' };
  }
  
  const cepNumeros = data.cep.replace(/\D/g, '');
  if (cepNumeros.length !== 8) {
    return { valid: false, message: '❌ CEP inválido!' };
  }
  
  if (!data.cidade || data.cidade.length < 3) {
    return { valid: false, message: '❌ Cidade inválida.' };
  }
  
  if (!data.estado) {
    return { valid: false, message: '❌ Selecione um estado.' };
  }
  
  const senhaValidation = validatePassword(data.senha);
  if (!senhaValidation.valid) {
    return { valid: false, message: senhaValidation.message };
  }
  
  if (data.senha !== data.confirmarSenha) {
    return { valid: false, message: '❌ As senhas não coincidem.' };
  }
  
  if (!data.termos) {
    return { valid: false, message: '❌ Você deve aceitar os termos de uso.' };
  }
  
  return { valid: true };
}

// Validar senha
function validatePassword(senha) {
  if (!senha || senha.length < 8) {
    return { 
      valid: false, 
      message: '❌ A senha deve ter no mínimo 8 caracteres.' 
    };
  }
  
  if (!/[A-Z]/.test(senha)) {
    return { 
      valid: false, 
      message: '❌ A senha deve conter pelo menos uma letra maiúscula.' 
    };
  }
  
  if (!/[a-z]/.test(senha)) {
    return { 
      valid: false, 
      message: '❌ A senha deve conter pelo menos uma letra minúscula.' 
    };
  }
  
  if (!/[0-9]/.test(senha)) {
    return { 
      valid: false, 
      message: '❌ A senha deve conter pelo menos um número.' 
    };
  }
  
  if (!/[!@#$%^&*(),.?":{}|<>]/.test(senha)) {
    return { 
      valid: false, 
      message: '❌ A senha deve conter pelo menos um caractere especial (!@#$%^&*...).' 
    };
  }
  
  return { valid: true };
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
  
  setTimeout(() => {
    container.innerHTML = '';
  }, 5000);
}

// Validar email
function isValidEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email);
}