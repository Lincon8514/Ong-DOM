/* ========== PERFIL DO VOLUNTÁRIO - APENAS VISUALIZAÇÃO ========== */

document.addEventListener('DOMContentLoaded', () => {
  console.log('🔄 Carregando perfil do voluntário...');
  
  // Verificar autenticação
  checkAuth();
  
  // Carregar perfil
  loadUserProfile();
  
  // Configurar sistema de abas
  setupTabs();
  
  // Configurar logout
  setupLogout();
});

// ========== AUTENTICAÇÃO ==========

function checkAuth() {
  const user = window.authSystem?.getCurrentUser();
  
  if (!user) {
    console.log('❌ Usuário não autenticado, redirecionando...');
    window.location.href = 'login.html';
    return;
  }
  
  console.log('✅ Usuário autenticado:', user.email);
}

// ========== CARREGAR PERFIL ==========

function loadUserProfile() {
  const user = window.authSystem?.getCurrentUser();
  
  if (!user) return;
  
  console.log('📋 Carregando dados do usuário:', user);
  
  // Avatar (primeira letra do nome)
  const avatar = user.nome.charAt(0).toUpperCase();
  document.getElementById('userAvatar').textContent = avatar;
  
  // Header
  document.getElementById('userName').textContent = user.nome;
  document.getElementById('userEmail').textContent = user.email;
  
  // Dados Pessoais
  document.getElementById('viewNome').textContent = user.nome || '-';
  document.getElementById('viewEmail').textContent = user.email || '-';
  document.getElementById('viewCPF').textContent = user.cpf || '-';
  document.getElementById('viewTelefone').textContent = user.telefone || '-';
  document.getElementById('viewDataNascimento').textContent = formatarData(user.dataNascimento) || '-';
  document.getElementById('viewEndereco').textContent = user.endereco || '-';
  document.getElementById('viewCEP').textContent = user.cep || '-';
  document.getElementById('viewCidade').textContent = user.cidade || '-';
  document.getElementById('viewEstado').textContent = user.estado || '-';
  
  // Estatísticas
  loadUserStats(user);
  
  console.log('✅ Perfil carregado com sucesso');
}

function formatarData(data) {
  if (!data) return '-';
  const [ano, mes, dia] = data.split('-');
  return `${dia}/${mes}/${ano}`;
}

function loadUserStats(user) {
  // Buscar projetos do usuário usando projectSystem
  const userProjects = window.projectSystem?.getUserProjects(user.id) || [];
  
  document.getElementById('projectsCount').textContent = userProjects.length;
  
  // Doações
  const doacoes = JSON.parse(localStorage.getItem('doacoes') || '[]');
  const doacoesUsuario = doacoes.filter(d => d.userId === user.id);
  
  const totalDoado = doacoesUsuario.reduce((sum, d) => sum + parseFloat(d.valor || 0), 0);
  
  document.getElementById('totalDonated').textContent = totalDoado.toFixed(2);
  document.getElementById('donationsCount').textContent = doacoesUsuario.length;
  
  console.log('📊 Estatísticas:', {
    projetos: userProjects.length,
    doacoes: doacoesUsuario.length,
    totalDoado: totalDoado
  });
  
  // Listar projetos
  loadProjectsList(userProjects);
  
  // Listar doações
  loadDonationsList(doacoesUsuario);
}

function loadProjectsList(projetos) {
  const container = document.getElementById('userProjectsList');
  
  console.log('📋 Carregando lista de projetos:', projetos);
  
  if (!projetos || projetos.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">📋</div>
        <p>Você ainda não está inscrito em nenhum projeto</p>
        <a href="projetos.html" class="btn btn-primary">Ver Projetos Disponíveis</a>
      </div>
    `;
    return;
  }
  
  let html = '<div class="projects-grid">';
  
  projetos.forEach(projeto => {
    const vagasRestantes = (projeto.vagasTotal || 0) - (projeto.vagasOcupadas || 0);
    
    html += `
      <div class="project-card-mini">
        <div class="project-card-mini-header">
          <h3>${projeto.titulo}</h3>
          <span class="project-badge ${projeto.status || 'ativo'}">${projeto.status || 'Ativo'}</span>
        </div>
        <p class="project-description">${projeto.descricao || 'Sem descrição'}</p>
        <div class="project-meta">
          <span>📅 ${formatarData(projeto.dataInicio) || 'Data não informada'}</span>
          <span>📍 ${projeto.local || 'Local não informado'}</span>
          <span>👥 ${vagasRestantes} vagas restantes</span>
        </div>
      </div>
    `;
  });
  
  html += '</div>';
  container.innerHTML = html;
  
  console.log('✅ Projetos renderizados:', projetos.length);
}

function loadDonationsList(doacoes) {
  const container = document.getElementById('userDonationsList');
  
  console.log('💰 Carregando lista de doações:', doacoes);
  
  if (!doacoes || doacoes.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <div class="empty-icon">💰</div>
        <p>Você ainda não fez nenhuma doação</p>
        <a href="doacoes.html" class="btn btn-primary">Fazer uma Doação</a>
      </div>
    `;
    return;
  }
  
  // Ordenar por data (mais recente primeiro)
  doacoes.sort((a, b) => new Date(b.data) - new Date(a.data));
  
  let html = '<div class="donations-grid">';
  
  doacoes.forEach(doacao => {
    const valor = parseFloat(doacao.valor || 0);
    const data = doacao.data ? new Date(doacao.data).toLocaleDateString('pt-BR') : 'Data não informada';
    const metodo = doacao.metodoPagamento || 'Não informado';
    
    html += `
      <div class="donation-card-mini">
        <div class="donation-card-mini-header">
          <div class="donation-value">R$ ${valor.toFixed(2)}</div>
          <div class="donation-date">📅 ${data}</div>
        </div>
        <div class="donation-method">
          <span>💳 ${formatarMetodoPagamento(metodo)}</span>
        </div>
        ${doacao.mensagem ? `<div class="donation-message">💬 "${doacao.mensagem}"</div>` : ''}
      </div>
    `;
  });
  
  html += '</div>';
  container.innerHTML = html;
  
  console.log('✅ Doações renderizadas');
}

function formatarMetodoPagamento(metodo) {
  const metodos = {
    'pix': 'PIX',
    'credito': 'Cartão de Crédito',
    'debito': 'Cartão de Débito',
    'boleto': 'Boleto Bancário'
  };
  return metodos[metodo] || metodo;
}

// ========== SISTEMA DE ABAS ==========

function setupTabs() {
  const tabBtns = document.querySelectorAll('.tab-btn');
  
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.getAttribute('data-tab');
      
      // Remover active de todos os botões
      tabBtns.forEach(b => b.classList.remove('active'));
      
      // Adicionar active no botão clicado
      btn.classList.add('active');
      
      // Esconder todos os conteúdos
      document.querySelectorAll('.tab-content').forEach(content => {
        content.classList.remove('active');
      });
      
      // Mostrar conteúdo da aba selecionada
      const tabContent = document.getElementById(`tab-${tabName}`);
      if (tabContent) {
        tabContent.classList.add('active');
      }
      
      console.log('📂 Aba ativada:', tabName);
    });
  });
}

// ========== LOGOUT ==========

function setupLogout() {
  const btnLogout = document.getElementById('btnLogout');
  
  btnLogout.addEventListener('click', () => {
    if (confirm('Deseja realmente sair?')) {
      window.authSystem.logout();
    }
  });
}