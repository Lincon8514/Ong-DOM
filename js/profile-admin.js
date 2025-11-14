/* ========== JAVASCRIPT EXCLUSIVO DO PERFIL DO ADMIN ========== */

let currentUser = null;

document.addEventListener('DOMContentLoaded', () => {
  console.log('Perfil Admin carregado');
  
  currentUser = window.authSystem?.getCurrentUser();
  
  if (!currentUser) {
    alert('Você precisa estar logado.');
    window.location.href = 'login.html';
    return;
  }
  
  if (currentUser.tipo !== 'admin') {
    alert('Acesso negado! Apenas administradores.');
    window.location.href = 'profileVoluntario.html';
    return;
  }
  
  setTimeout(() => {
    loadAdminProfile();
    loadAdminStats();
    loadAllUsers();
    loadAllProjects();
    loadAllDonations();
    loadAllMessages(); // CARREGA MENSAGENS
    setupAdminButtons();
    setupTabs();
    setupModals(); // CONFIGURA MODAIS
  }, 100);
});

// Carregar perfil do admin
function loadAdminProfile() {
  const nameEl = document.getElementById('adminName');
  const emailEl = document.getElementById('adminEmail');
  const avatarEl = document.getElementById('adminAvatar');
  
  if (nameEl) nameEl.textContent = currentUser.nome;
  if (emailEl) emailEl.textContent = currentUser.email;
  if (avatarEl) avatarEl.textContent = currentUser.nome.charAt(0).toUpperCase();
  
  console.log('Perfil admin carregado:', currentUser);
}

// Carregar estatísticas gerais
function loadAdminStats() {
  const users = window.authSystem?.getAllUsers() || [];
  const projects = window.projectSystem?.getAllProjects() || [];
  const donations = window.donationSystem?.getAllDonations() || [];
  const messages = JSON.parse(localStorage.getItem('dom_contatos')) || [];
  
  const totalUsers = users.length;
  const totalProjects = projects.filter(p => p.status === 'ativo').length;
  const totalDonations = donations.length;
  const totalAmount = donations.reduce((sum, d) => sum + parseFloat(d.valor || 0), 0);
  const pendingMessages = messages.filter(m => m.status === 'pendente').length; // ADICIONA CONTADOR
  
  const totalUsersEl = document.getElementById('totalUsers');
  const totalProjectsEl = document.getElementById('totalProjects');
  const totalDonationsEl = document.getElementById('totalDonations');
  const totalAmountEl = document.getElementById('totalAmount');
  const totalMessagesEl = document.getElementById('totalMessages'); // ADICIONA ELEMENTO
  
  if (totalUsersEl) totalUsersEl.textContent = totalUsers;
  if (totalProjectsEl) totalProjectsEl.textContent = totalProjects;
  if (totalDonationsEl) totalDonationsEl.textContent = totalDonations;
  if (totalAmountEl) totalAmountEl.textContent = totalAmount.toFixed(2);
  if (totalMessagesEl) totalMessagesEl.textContent = pendingMessages; // ADICIONA VALOR
  
  console.log('Estatísticas:', { totalUsers, totalProjects, totalDonations, totalAmount, pendingMessages });
}

// Carregar todos os usuários
function loadAllUsers() {
  const container = document.getElementById('usersList');
  if (!container) {
    console.error('Container usersList não encontrado');
    return;
  }
  
  const users = window.authSystem?.getAllUsers() || [];
  
  console.log('👥 Total de usuários:', users.length);
  
  if (users.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>Nenhum usuário cadastrado.</p></div>';
    return;
  }
  
  container.innerHTML = `
    <div class="users-table">
      <table>
        <thead>
          <tr>
            <th>Nome</th>
            <th>E-mail</th>
            <th>Tipo</th>
            <th>Data Cadastro</th>
            <th>Ações</th>
          </tr>
        </thead>
        <tbody>
          ${users.map(user => `
            <tr>
              <td>${user.nome}</td>
              <td>${user.email}</td>
              <td><span class="user-badge ${user.tipo}">${user.tipo === 'admin' ? 'Admin' : 'Voluntário'}</span></td>
              <td>${new Date(user.dataCriacao).toLocaleDateString('pt-BR')}</td>
              <td>
                ${user.id !== currentUser.id 
                  ? `<button class="btn btn-secondary" style="padding:0.5rem 1rem;font-size:0.85rem;background:#f44336;color:#fff;" onclick="deleteUser('${user.id}')">Excluir</button>`
                  : '<span style="color: var(--cinza-medio);">Você</span>'
                }
              </td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
  
  console.log('Lista de usuários renderizada');
}

// Carregar todos os projetos
function loadAllProjects() {
  const container = document.getElementById('projectsList');
  if (!container) {
    console.error('Container projectsList não encontrado');
    return;
  }
  
  const projects = window.projectSystem?.getAllProjects() || [];
  
  console.log('Total de projetos:', projects.length);
  
  if (projects.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>Nenhum projeto cadastrado.</p></div>';
    return;
  }
  
  container.innerHTML = projects.map(p => {
    const vagasTotal = parseInt(p.vagasTotal) || parseInt(p.vagas) || 0;
    const vagasOcupadas = parseInt(p.vagasOcupadas) || parseInt(p.vagasPreenchidas) || 0;
    const vagasDisponiveis = vagasTotal - vagasOcupadas;
    const percentual = vagasTotal > 0 ? (vagasOcupadas / vagasTotal) * 100 : 0;
    const statusColor = p.status === 'ativo' ? '#4caf50' : '#f44336';
    
    return `
      <div class="project-item" style="background: var(--branco); padding: 1.5rem; border-radius: 12px; margin-bottom: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1);">
        <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
          <div style="flex: 1;">
            <h3 style="margin: 0 0 0.5rem 0; color: var(--rosa-escuro);">${p.titulo}</h3>
            <div style="display: flex; gap: 0.5rem; flex-wrap: wrap;">
              <span style="background: var(--rosa-claro); color: var(--rosa-escuro); padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.85rem;">
                ${p.categoria}
              </span>
              <span style="background: ${statusColor}; color: white; padding: 0.25rem 0.75rem; border-radius: 12px; font-size: 0.85rem;">
                ${p.status === 'ativo' ? '✅ Ativo' : '❌ Inativo'}
              </span>
            </div>
          </div>
        </div>
        
        <p style="margin: 1rem 0; color: var(--cinza-escuro);">${p.descricao}</p>
        
        <div style="margin: 1rem 0;">
          <div style="display: flex; justify-content: space-between; margin-bottom: 0.5rem; font-size: 0.9rem;">
            <span><strong>Vagas:</strong> ${vagasOcupadas}/${vagasTotal}</span>
            <span style="color: ${vagasDisponiveis > 0 ? '#4caf50' : '#f44336'};">
              ${vagasDisponiveis} disponíveis
            </span>
          </div>
          <div style="background: #e0e0e0; height: 10px; border-radius: 10px; overflow: hidden;">
            <div style="background: var(--rosa_medio); height: 100%; width: ${percentual}%; transition: width 0.3s ease;"></div>
          </div>
        </div>
        
        <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 1rem; margin: 1rem 0; font-size: 0.9rem;">
          <div>📍 ${p.local}</div>
          <div>📅 ${new Date(p.dataInicio).toLocaleDateString('pt-BR')}</div>
        </div>
        
        <div style="display: flex; gap: 0.75rem; flex-wrap: wrap;">
          <button class="btn btn-secondary" style="padding:0.5rem 1rem;font-size:0.85rem;" onclick="editProjectComplete('${p.id}')">✏️ Editar</button>
          <button class="btn btn-secondary" style="padding:0.5rem 1rem;font-size:0.85rem;background:#f44336;color:#fff;" onclick="deleteProject('${p.id}')">🗑️ Excluir</button>
          <button class="btn btn-secondary" style="padding:0.5rem 1rem;font-size:0.85rem;" onclick="toggleProjectStatus('${p.id}')">${p.status === 'ativo' ? '❌ Desativar' : '✅ Ativar'}</button>
          <button class="btn btn-secondary" style="padding:0.5rem 1rem;font-size:0.85rem;flex:1;" onclick="viewProjectEnrollments('${p.id}')">👥 Ver Inscritos (${vagasOcupadas})</button>
        </div>
      </div>
    `;
  }).join('');
  
  console.log('Lista de projetos renderizada');
}

// Carregar todas as doações
function loadAllDonations() {
  const container = document.getElementById('donationsList');
  if (!container) {
    console.error('Container donationsList não encontrado');
    return;
  }
  
  const donations = window.donationSystem?.getAllDonations() || [];
  
  console.log('Total de doações:', donations.length);
  
  if (donations.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>Nenhuma doação registrada.</p></div>';
    return;
  }
  
  const sorted = donations.sort((a, b) => b.timestamp - a.timestamp);
  
  container.innerHTML = `
    <div class="users-table">
      <table>
        <thead>
          <tr>
            <th>Data</th>
            <th>Doador</th>
            <th>E-mail</th>
            <th>Valor</th>
            <th>Método</th>
            <th>Mensagem</th>
          </tr>
        </thead>
        <tbody>
          ${sorted.map(d => `
            <tr>
              <td>${new Date(d.data).toLocaleDateString('pt-BR')}</td>
              <td>${d.nome}</td>
              <td>${d.email}</td>
              <td style="font-weight:600;color:var(--rosa-medio);">R$ ${parseFloat(d.valor).toFixed(2)}</td>
              <td>${d.metodo}</td>
              <td>${d.mensagem || '-'}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
    </div>
  `;
  
  console.log('Lista de doações renderizada');
}

// NOVA FUNÇÃO: Carregar todas as mensagens
function loadAllMessages(filtro = 'todos') {
  const container = document.getElementById('messagesList');
  if (!container) {
    console.error('Container messagesList não encontrado');
    return;
  }
  
  let messages = JSON.parse(localStorage.getItem('dom_contatos')) || [];
  
  // Aplicar filtro
  if (filtro !== 'todos') {
    messages = messages.filter(m => m.status === filtro);
  }
  
  console.log('Total de mensagens:', messages.length, 'Filtro:', filtro);
  
  if (messages.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>Nenhuma mensagem encontrada.</p></div>';
    return;
  }
  
  // Ordenar por data (mais recentes primeiro)
  const sorted = messages.sort((a, b) => new Date(b.data) - new Date(a.data));
  
  container.innerHTML = sorted.map(msg => `
    <div class="message-card" style="background: var(--branco); padding: 1.5rem; border-radius: 12px; margin-bottom: 1rem; box-shadow: 0 2px 8px rgba(0,0,0,0.1); border-left: 4px solid ${msg.status === 'pendente' ? 'var(--rosa-medio)' : '#4caf50'};">
      <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 1rem;">
        <div>
          <h3 style="margin: 0 0 0.25rem 0; color: var(--rosa-escuro);">${msg.nome}</h3>
          <p style="margin: 0; color: var(--cinza-medio); font-size: 0.9rem;">${msg.email}${msg.telefone ? ` • ${msg.telefone}` : ''}</p>
        </div>
        <span class="user-badge ${msg.status}" style="flex-shrink: 0;">${msg.status}</span>
      </div>
      
      <div style="margin-bottom: 1rem;">
        <strong style="color: var(--cinza-escuro);">Assunto:</strong> 
        <span style="color: var(--cinza-medio);">${getAssuntoLabel(msg.assunto)}</span>
      </div>
      
      <div style="background: var(--cinza-claro); padding: 1rem; border-radius: 8px; margin-bottom: 1rem;">
        <p style="margin: 0; white-space: pre-wrap; color: var(--cinza-escuro);">${msg.mensagem}</p>
      </div>
      
      <div style="display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 0.5rem;">
        <small style="color: var(--cinza-medio);">
          Recebida em: ${new Date(msg.data).toLocaleString('pt-BR')}
        </small>
        <div style="display: flex; gap: 0.75rem;">
          ${msg.status === 'pendente' 
            ? `<button class="btn btn-secondary" style="padding:0.5rem 1rem;font-size:0.85rem;" onclick="markAsResponded('${msg.id}')">Marcar como Respondida</button>`
            : `<button class="btn btn-secondary" style="padding:0.5rem 1rem;font-size:0.85rem;" onclick="markAsPending('${msg.id}')">Marcar como Pendente</button>`
          }
          <button class="btn btn-secondary" style="padding:0.5rem 1rem;font-size:0.85rem;background:#f44336;color:#fff;" onclick="deleteMessage('${msg.id}')">Excluir</button>
        </div>
      </div>
    </div>
  `).join('');
  
  console.log('Lista de mensagens renderizada');
}

// NOVA FUNÇÃO: Obter label do assunto
function getAssuntoLabel(assunto) {
  const labels = {
    'duvida': 'Dúvida',
    'voluntario': 'Quero ser voluntário',
    'doacao': 'Doações',
    'parceria': 'Parceria',
    'outro': 'Outro'
  };
  return labels[assunto] || assunto;
}

// NOVA FUNÇÃO: Filtrar mensagens
function filterMessages(status) {
  console.log('Filtrando mensagens:', status);
  loadAllMessages(status);
}

// NOVA FUNÇÃO: Marcar como respondida
function markAsResponded(messageId) {
  console.log('Marcando mensagem como respondida:', messageId);
  
  const messages = JSON.parse(localStorage.getItem('dom_contatos')) || [];
  const updated = messages.map(m => 
    m.id === messageId ? { ...m, status: 'respondida', dataResposta: new Date().toISOString() } : m
  );
  
  localStorage.setItem('dom_contatos', JSON.stringify(updated));
  
  alert('Mensagem marcada como respondida!');
  loadAllMessages();
  loadAdminStats();
}

// NOVA FUNÇÃO: Marcar como pendente
function markAsPending(messageId) {
  console.log('Marcando mensagem como pendente:', messageId);
  
  const messages = JSON.parse(localStorage.getItem('dom_contatos')) || [];
  const updated = messages.map(m => 
    m.id === messageId ? { ...m, status: 'pendente' } : m
  );
  
  localStorage.setItem('dom_contatos', JSON.stringify(updated));
  
  alert('Mensagem marcada como pendente!');
  loadAllMessages();
  loadAdminStats();
}

// NOVA FUNÇÃO: Deletar mensagem
function deleteMessage(messageId) {
  if (!confirm('Deseja realmente excluir esta mensagem?')) return;
  
  console.log('Deletando mensagem:', messageId);
  
  const messages = JSON.parse(localStorage.getItem('dom_contatos')) || [];
  const filtered = messages.filter(m => m.id !== messageId);
  
  localStorage.setItem('dom_contatos', JSON.stringify(filtered));
  
  alert('Mensagem excluída!');
  loadAllMessages();
  loadAdminStats();
}

// Configurar botões do admin
function setupAdminButtons() {
  const btnLogout = document.getElementById('btnLogout');
  if (btnLogout) {
    btnLogout.onclick = () => {
      if (confirm('Deseja sair?')) {
        window.authSystem?.logout();
      }
    };
  }
  
  const btnNewProject = document.getElementById('btnNewProject');
  if (btnNewProject) {
    btnNewProject.onclick = openNewProjectModal;
  }
  
  console.log('Botões configurados');
}

// Configurar sistema de abas
function setupTabs() {
  const tabButtons = document.querySelectorAll('.tab-btn');
  const tabContents = document.querySelectorAll('.tab-content');
  
  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      const tabName = btn.dataset.tab;
      
      console.log('Mudando para aba:', tabName);
      
      tabButtons.forEach(b => b.classList.remove('active'));
      tabContents.forEach(c => c.classList.remove('active'));
      
      btn.classList.add('active');
      document.getElementById(`tab-${tabName}`).classList.add('active');
    });
  });
  
  console.log('Sistema de abas configurado');
}

// ========== MODAIS ==========

function setupModals() {
  console.log('🔧 Configurando modais...');
  
  // ===== MODAL EDITAR PERFIL =====
  const btnEditProfile = document.getElementById('btnEditProfile');
  const editModal = document.getElementById('editModal');
  const closeModal = document.getElementById('closeModal');
  const btnCancel = document.getElementById('btnCancel');
  const editProfileForm = document.getElementById('editProfileForm');
  
  if (btnEditProfile && editModal) {
    btnEditProfile.addEventListener('click', () => {
      console.log('📝 Abrindo modal de edição de perfil');
      const user = window.authSystem?.getCurrentUser();
      if (user) {
        document.getElementById('editNome').value = user.nome || '';
        document.getElementById('editEmail').value = user.email || '';
        document.getElementById('editTelefone').value = user.telefone || '';
        editModal.classList.add('show');
      }
    });
  }
  
  if (closeModal && editModal) {
    closeModal.addEventListener('click', () => {
      console.log('❌ Fechando modal de edição');
      editModal.classList.remove('show');
    });
  }
  
  if (btnCancel && editModal) {
    btnCancel.addEventListener('click', () => {
      console.log('❌ Cancelando edição');
      editModal.classList.remove('show');
    });
  }
  
  if (editProfileForm) {
    editProfileForm.addEventListener('submit', (e) => {
      e.preventDefault();
      console.log('💾 Salvando perfil admin');
      saveAdminProfile();
    });
  }
  
  // ===== MODAL NOVO PROJETO =====
  const btnNewProject = document.getElementById('btnNewProject');
  const projectModal = document.getElementById('newProjectModal');
  const closeProjectModal = document.getElementById('closeProjectModal');
  const btnCancelProject = document.getElementById('btnCancelProject');
  const newProjectForm = document.getElementById('newProjectForm');
  
  if (btnNewProject && projectModal) {
    btnNewProject.addEventListener('click', () => {
      console.log('➕ Abrindo modal de novo projeto');
      document.getElementById('projectModalTitle').textContent = 'Novo Projeto';
      newProjectForm.reset();
      document.getElementById('projectId').value = '';
      document.getElementById('btnCreateProject').textContent = 'Criar Projeto';
      document.getElementById('projectResponsavel').value = 'Admin DOM';
      projectModal.classList.add('show');
    });
  }
  
  if (closeProjectModal && projectModal) {
    closeProjectModal.addEventListener('click', () => {
      console.log('❌ Fechando modal de projeto');
      projectModal.classList.remove('show');
    });
  }
  
  if (btnCancelProject && projectModal) {
    btnCancelProject.addEventListener('click', () => {
      console.log('❌ Cancelando criação de projeto');
      projectModal.classList.remove('show');
    });
  }
  
  if (newProjectForm) {
    newProjectForm.addEventListener('submit', (e) => {
      e.preventDefault();
      console.log('💾 Salvando projeto');
      saveProject();
    });
  }
  
  // ===== MODAL INSCRITOS =====
  const enrollmentsModal = document.getElementById('viewEnrollmentsModal');
  const closeEnrollmentsModal = document.getElementById('closeEnrollmentsModal');
  
  if (closeEnrollmentsModal && enrollmentsModal) {
    closeEnrollmentsModal.addEventListener('click', () => {
      console.log('❌ Fechando modal de inscritos');
      enrollmentsModal.classList.remove('show');
    });
  }
  
  // ===== FECHAR MODAL CLICANDO FORA =====
  window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
      e.target.classList.remove('show');
      console.log('❌ Modal fechado ao clicar fora');
    }
  });
  
  console.log('✅ Modais configurados');
}

// Deletar usuário
function deleteUser(userId) {
  console.log('Deletando usuário:', userId);
  
  if (!confirm('Deseja realmente excluir este usuário?')) return;
  
  const users = window.authSystem?.getAllUsers() || [];
  const filtered = users.filter(u => u.id !== userId);
  
  localStorage.setItem('dom_usuarios', JSON.stringify(filtered));
  
  alert('Usuário excluído com sucesso!');
  loadAllUsers();
  loadAdminStats();
}

// Deletar projeto
function deleteProject(projectId) {
  console.log('Deletando projeto:', projectId);
  
  if (!confirm('Deseja realmente excluir este projeto?')) return;
  
  const result = window.projectSystem?.deleteProject(projectId);
  
  if (result.success) {
    alert('Projeto excluído com sucesso!');
    loadAllProjects();
    loadAdminStats();
  } else {
    alert(result.message || 'Erro ao excluir projeto.');
  }
}

// Alternar status do projeto
function toggleProjectStatus(projectId) {
  console.log('Alternando status do projeto:', projectId);
  
  const projeto = window.projectSystem?.getProjectById(projectId);
  if (!projeto) return;
  
  const novoStatus = projeto.status === 'ativo' ? 'inativo' : 'ativo';
  
  const result = window.projectSystem?.updateProject(projectId, { status: novoStatus });
  
  if (result.success) {
    alert(`Projeto ${novoStatus === 'ativo' ? 'ativado' : 'desativado'} com sucesso!`);
    loadAllProjects();
    loadAdminStats();
  }
}

// Editar projeto
function editProject(projectId) {
  console.log('Editando projeto:', projectId);
  
  const projeto = window.projectSystem?.getProjectById(projectId);
  if (!projeto) return;
  
  const novoTitulo = prompt('Novo título:', projeto.titulo);
  if (!novoTitulo) return;
  
  const novaDescricao = prompt('Nova descrição:', projeto.descricao);
  if (!novaDescricao) return;
  
  const result = window.projectSystem?.updateProject(projectId, {
    titulo: novoTitulo,
    descricao: novaDescricao
  });
  
  if (result.success) {
    alert('Projeto atualizado com sucesso!');
    loadAllProjects();
  } else {
    alert(result.message || 'Erro ao atualizar projeto.');
  }
}

// Abrir modal de novo projeto
function openNewProjectModal() {
  console.log('Abrindo modal de novo projeto');
  
  const modal = document.getElementById('newProjectModal');
  if (!modal) {
    alert('Modal não encontrado.');
    return;
  }
  
  // Limpar formulário
  document.getElementById('newProjectForm').reset();
  document.getElementById('projectId').value = '';
  document.getElementById('projectModalTitle').textContent = 'Novo Projeto';
  document.getElementById('btnCreateProject').textContent = '➕ Criar Projeto';
  
  modal.classList.add('active');
  
  const closeBtn = document.getElementById('closeProjectModal');
  const cancelBtn = document.getElementById('btnCancelProject');
  
  if (closeBtn) closeBtn.onclick = () => modal.classList.remove('active');
  if (cancelBtn) cancelBtn.onclick = () => modal.classList.remove('active');
  
  const form = document.getElementById('newProjectForm');
  if (form) {
    form.onsubmit = async (e) => {
      e.preventDefault();
      
      const projectId = document.getElementById('projectId').value;
      const isEdit = !!projectId;
      
      const formData = {
        titulo: document.getElementById('projectTitulo').value,
        descricao: document.getElementById('projectDescricao').value,
        descricaoCompleta: document.getElementById('projectDescricaoCompleta').value,
        categoria: document.getElementById('projectCategoria').value,
        local: document.getElementById('projectLocal').value,
        vagasTotal: parseInt(document.getElementById('projectVagas').value),
        vagas: parseInt(document.getElementById('projectVagas').value),
        status: document.getElementById('projectStatus').value,
        dataInicio: document.getElementById('projectDataInicio').value,
        dataFim: document.getElementById('projectDataFim').value,
        requisitos: document.getElementById('projectRequisitos').value.split('\n').filter(r => r.trim()),
        beneficios: document.getElementById('projectBeneficios').value.split('\n').filter(b => b.trim()),
        responsavel: document.getElementById('projectResponsavel').value
      };
      
      console.log(isEdit ? ' Atualizando projeto:' : ' Criando projeto:', formData);
      
      let result;
      if (isEdit) {
        const projeto = window.projectSystem?.getProjectById(projectId);
        formData.vagasOcupadas = projeto.vagasOcupadas || projeto.vagasPreenchidas || 0;
        formData.vagasPreenchidas = projeto.vagasOcupadas || projeto.vagasPreenchidas || 0;
        result = window.projectSystem?.updateProject(projectId, formData);
      } else {
        result = window.projectSystem?.createProject(formData);
      }
      
      if (result.success || result) {
        alert(isEdit ? 'Projeto atualizado com sucesso!' : 'Projeto criado com sucesso!');
        modal.classList.remove('active');
        form.reset();
        loadAllProjects();
        loadAdminStats();
      } else {
        alert(result.message || 'Erro ao salvar projeto.');
      }
    };
  }
}

// Abrir modal de editar perfil
function openEditModal() {
  console.log('Abrindo modal de edição de perfil');
  
  const modal = document.getElementById('editModal');
  if (!modal) return;
  
  document.getElementById('editNome').value = currentUser.nome;
  document.getElementById('editEmail').value = currentUser.email;
  document.getElementById('editTelefone').value = currentUser.telefone || '';
  
  modal.classList.add('active');
  
  document.getElementById('closeModal').onclick = () => modal.classList.remove('active');
  document.getElementById('btnCancel').onclick = () => modal.classList.remove('active');
  
  document.getElementById('editProfileForm').onsubmit = async (e) => {
    e.preventDefault();
    
    const result = window.authSystem?.updateUser(currentUser.id, {
      nome: document.getElementById('editNome').value,
      email: document.getElementById('editEmail').value,
      telefone: document.getElementById('editTelefone').value
    });
    
    if (result.success) {
      currentUser = result.user;
      loadAdminProfile();
      modal.classList.remove('active');
      alert('Perfil atualizado com sucesso!');
    } else {
      alert(result.message || 'Erro ao atualizar perfil.');
    }
  };
}

// Editar projeto completo (com todos os campos)
function editProjectComplete(projectId) {
  console.log('Editando projeto completo:', projectId);
  
  const projeto = window.projectSystem?.getProjectById(projectId);
  if (!projeto) {
    alert('Projeto não encontrado!');
    return;
  }
  
  // Preencher formulário
  document.getElementById('projectId').value = projeto.id;
  document.getElementById('projectTitulo').value = projeto.titulo;
  document.getElementById('projectCategoria').value = projeto.categoria;
  document.getElementById('projectDescricao').value = projeto.descricao;
  document.getElementById('projectDescricaoCompleta').value = projeto.descricaoCompleta || projeto.descricao;
  document.getElementById('projectLocal').value = projeto.local || '';
  document.getElementById('projectVagas').value = projeto.vagasTotal || projeto.vagas || 0;
  document.getElementById('projectStatus').value = projeto.status || 'ativo';
  document.getElementById('projectDataInicio').value = projeto.dataInicio;
  document.getElementById('projectDataFim').value = projeto.dataFim || '';
  document.getElementById('projectRequisitos').value = (projeto.requisitos || []).join('\n');
  document.getElementById('projectBeneficios').value = (projeto.beneficios || []).join('\n');
  document.getElementById('projectResponsavel').value = projeto.responsavel || 'Admin DOM';
  
  // Mudar título do modal
  document.getElementById('projectModalTitle').textContent = 'Editar Projeto';
  document.getElementById('btnCreateProject').textContent = '💾 Salvar Alterações';
  
  // Abrir modal
  document.getElementById('newProjectModal').classList.add('active');
}

// Visualizar inscritos do projeto
function viewProjectEnrollments(projectId) {
  console.log('Visualizando inscritos do projeto:', projectId);
  
  const projeto = window.projectSystem?.getProjectById(projectId);
  if (!projeto) return;
  
  const allEnrollments = window.projectSystem?.getAllEnrollments() || [];
  const enrollments = allEnrollments.filter(e => e.projectId === parseInt(projectId));
  
  document.getElementById('enrollmentsModalTitle').textContent = `Inscritos em "${projeto.titulo}"`;
  
  const container = document.getElementById('enrollmentsList');
  
  if (enrollments.length === 0) {
    container.innerHTML = '<div class="empty-state"><p>Ainda não há inscritos neste projeto.</p></div>';
  } else {
    container.innerHTML = `
      <p style="margin-bottom: 1rem;"><strong>${enrollments.length}</strong> voluntário(s) inscrito(s)</p>
      <div style="max-height: 400px; overflow-y: auto;">
        ${enrollments.map(enrollment => {
          const dataInscricao = new Date(enrollment.dataInscricao).toLocaleDateString('pt-BR');
          const horaInscricao = new Date(enrollment.dataInscricao).toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
          
          return `
            <div style="border-bottom: 1px solid var(--cinza-claro); padding: 1rem 0; display: flex; justify-content: space-between; align-items: center;">
              <div>
                <strong style="color: var(--rosa-escuro);">${enrollment.userName}</strong>
                <br>
                <small style="color: var(--cinza-medio);">📅 ${dataInscricao} às ${horaInscricao}</small>
              </div>
              <button class="btn btn-secondary" style="padding:0.5rem 1rem;font-size:0.85rem;background:#f44336;color:#fff;" onclick="removeEnrollment('${enrollment.id}', '${projectId}')">
                Remover
              </button>
            </div>
          `;
        }).join('')}
      </div>
    `;
  }
  
  // Abrir modal
  document.getElementById('viewEnrollmentsModal').classList.add('active');
  
  // Configurar fechamento
  document.getElementById('closeEnrollmentsModal').onclick = () => {
    document.getElementById('viewEnrollmentsModal').classList.remove('active');
  };
}

// Remover inscrito
function removeEnrollment(enrollmentId, projectId) {
  if (!confirm('Deseja remover este voluntário do projeto?')) return;
  
  console.log('Removendo inscrito:', enrollmentId);
  
  const enrollments = window.projectSystem?.getAllEnrollments() || [];
  const enrollment = enrollments.find(e => e.id === enrollmentId);
  
  if (enrollment) {
    window.projectSystem?.cancelEnrollment(parseInt(projectId), enrollment.userId);
    alert('Voluntário removido com sucesso!');
    document.getElementById('viewEnrollmentsModal').classList.remove('active');
    loadAllProjects();
    loadAdminStats();
  }
}