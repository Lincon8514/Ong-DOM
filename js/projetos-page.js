/* ========== JAVASCRIPT DA PÁGINA DE PROJETOS ========== */

document.addEventListener('DOMContentLoaded', () => {
  console.log('Página de projetos carregada');
  
  loadProjects();
  setupFilters();
  setupModals();
});

// Carregar e exibir projetos
function loadProjects(filtro = 'todos') {
  const container = document.getElementById('projetosContainer');
  
  if (!container) {
    console.error('Container de projetos não encontrado');
    return;
  }
  
  let projects = window.projectSystem?.getAllProjects() || [];
  const currentUser = window.authSystem?.getCurrentUser();
  
  // Filtrar projetos ativos
  projects = projects.filter(p => p.status === 'ativo');
  
  // Aplicar filtro de categoria
  if (filtro !== 'todos') {
    projects = projects.filter(p => p.categoria === filtro);
  }
  
  console.log(`Exibindo ${projects.length} projetos (filtro: ${filtro})`);
  
  if (projects.length === 0) {
    container.innerHTML = `
      <div class="empty-state">
        <p style="font-size: 2rem;">😔</p>
        <p><strong>Nenhum projeto encontrado</strong></p>
        <p style="font-size: 0.95rem;">Tente outro filtro ou volte mais tarde.</p>
      </div>
    `;
    return;
  }
  
  container.innerHTML = projects.map(projeto => {
    const vagasTotal = parseInt(projeto.vagasTotal) || parseInt(projeto.vagas) || 0;
    const vagasOcupadas = parseInt(projeto.vagasOcupadas) || parseInt(projeto.vagasPreenchidas) || 0;
    const vagasDisponiveis = vagasTotal - vagasOcupadas;
    const percentual = vagasTotal > 0 ? (vagasOcupadas / vagasTotal) * 100 : 0;
    
    // Verificar se usuário está inscrito
    const isEnrolled = currentUser ? window.projectSystem?.isUserEnrolled(projeto.id, currentUser.id) : false;
    
    return `
      <div class="project-card">
        <!-- Header -->
        <div class="project-card-header">
          <span class="project-status">✓ Ativo</span>
          <h2 class="project-title">${projeto.titulo}</h2>
          <span class="project-category">${projeto.categoria}</span>
        </div>
        
        <!-- Body -->
        <div class="project-card-body">
          <p class="project-description">${projeto.descricao}</p>
          
          <div class="project-info">
            <div class="project-info-item" data-icon="📅">
              Início: ${new Date(projeto.dataInicio).toLocaleDateString('pt-BR')}
            </div>
            <div class="project-info-item" data-icon="📍">
              ${projeto.local || 'Local não informado'}
            </div>
            ${projeto.dataFim ? `
              <div class="project-info-item" data-icon="⏰">
                Término: ${new Date(projeto.dataFim).toLocaleDateString('pt-BR')}
              </div>
            ` : ''}
          </div>
          
          <div class="vagas-info">
            <div class="vagas-progress">
              <span><strong>${vagasOcupadas}</strong> de <strong>${vagasTotal}</strong> vagas</span>
              <span class="vagas-percentage">${percentual.toFixed(0)}%</span>
            </div>
            <div class="vagas-bar">
              <div class="vagas-fill" style="width: ${percentual}%;"></div>
            </div>
            <div class="vagas-disponiveis">
              ${vagasDisponiveis} vaga${vagasDisponiveis !== 1 ? 's' : ''} disponível${vagasDisponiveis !== 1 ? 'is' : ''}
            </div>
          </div>
        </div>
        
        <!-- Footer -->
        <div class="project-card-footer">
          <div class="project-actions">
            <button class="btn btn-details" onclick="viewProjectDetails('${projeto.id}')">
              Ver Detalhes
            </button>
            ${isEnrolled 
              ? `<button class="btn btn-secondary" style="background:#f44336;color:#fff;" onclick="cancelEnrollment('${projeto.id}')">
                  ❌ Cancelar Inscrição
                </button>`
              : `<button class="btn btn-primary" onclick="enrollInProject('${projeto.id}')">
                  ✅ Inscrever-se
                </button>`
            }
          </div>
        </div>
      </div>
    `;
  }).join('');
}

// Configurar filtros
function setupFilters() {
  const filterButtons = document.querySelectorAll('.filter-btn');
  
  filterButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      filterButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filtro = btn.dataset.filter;
      loadProjects(filtro);
    });
  });
}

// Configurar modais
function setupModals() {
  const modal = document.getElementById('projectDetailsModal');
  const closeBtn = document.getElementById('closeDetailsModal');
  
  if (closeBtn) {
    closeBtn.onclick = () => modal.classList.remove('active');
  }
  
  // Fechar ao clicar fora
  window.onclick = (e) => {
    if (e.target === modal) {
      modal.classList.remove('active');
    }
  };
  
  // Fechar com ESC
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      modal.classList.remove('active');
    }
  });
}

// Ver detalhes do projeto - MODAL (CORRIGIDO - SEM PARSEINT)
function viewProjectDetails(projectId) {
  console.log('Tentando abrir detalhes do projeto');
  console.log('ID recebido:', projectId, 'Tipo:', typeof projectId);
  
  // Verificar se projectSystem existe
  if (!window.projectSystem) {
    console.error('projectSystem não está definido!');
    alert('Sistema de projetos não carregado. Recarregue a página.');
    return;
  }
  
  // Listar todos os projetos para debug
  const allProjects = window.projectSystem.getAllProjects();
  console.log('Projetos disponíveis:', allProjects);
  console.log('IDs dos projetos:', allProjects.map(p => ({ id: p.id, tipo: typeof p.id })));
  
  // Tentar buscar projeto SEM CONVERTER (manter string)
  const projeto = window.projectSystem.getProjectById(projectId);
  
  console.log('Projeto encontrado:', projeto);
  
  if (!projeto) {
    console.error('Projeto não encontrado com ID:', projectId);
    alert('Projeto não encontrado! ID: ' + projectId);
    return;
  }
  
  const currentUser = window.authSystem?.getCurrentUser();
  const isEnrolled = currentUser ? window.projectSystem?.isUserEnrolled(projectId, currentUser.id) : false;
  
  const vagasTotal = parseInt(projeto.vagasTotal) || parseInt(projeto.vagas) || 0;
  const vagasOcupadas = parseInt(projeto.vagasOcupadas) || parseInt(projeto.vagasPreenchidas) || 0;
  const vagasDisponiveis = vagasTotal - vagasOcupadas;
  const percentual = vagasTotal > 0 ? (vagasOcupadas / vagasTotal) * 100 : 0;
  
  // Preencher título
  document.getElementById('projectDetailsTitle').textContent = projeto.titulo;
  
  // Preencher conteúdo
  document.getElementById('projectDetailsContent').innerHTML = `
    <!-- Descrição Completa -->
    <div class="details-section">
      <h3>📋 Sobre o Projeto</h3>
      <div class="details-description">
        ${projeto.descricaoCompleta || projeto.descricao}
      </div>
    </div>
    
    <!-- Informações -->
    <div class="details-section">
      <h3>ℹ️ Informações</h3>
      <div class="details-info-grid">
        <div class="details-info-card">
          <strong>📍 Local</strong>
          <p>${projeto.local || 'Não informado'}</p>
        </div>
        <div class="details-info-card">
          <strong>🏷️ Categoria</strong>
          <p>${projeto.categoria}</p>
        </div>
        <div class="details-info-card">
          <strong>📅 Data de Início</strong>
          <p>${new Date(projeto.dataInicio).toLocaleDateString('pt-BR')}</p>
        </div>
        <div class="details-info-card">
          <strong>⏰ Data de Término</strong>
          <p>${projeto.dataFim ? new Date(projeto.dataFim).toLocaleDateString('pt-BR') : 'Não definida'}</p>
        </div>
        ${projeto.responsavel ? `
          <div class="details-info-card" style="grid-column: 1 / -1;">
            <strong>👤 Responsável</strong>
            <p>${projeto.responsavel}</p>
          </div>
        ` : ''}
      </div>
    </div>
    
    <!-- Vagas -->
    <div class="details-vagas">
      <h4>👥 Vagas do Projeto</h4>
      <div class="details-vagas-numbers">
        <div class="details-vagas-item">
          <strong>${vagasTotal}</strong>
          <span>Total</span>
        </div>
        <div class="details-vagas-item">
          <strong>${vagasOcupadas}</strong>
          <span>Ocupadas</span>
        </div>
        <div class="details-vagas-item">
          <strong>${vagasDisponiveis}</strong>
          <span>Disponíveis</span>
        </div>
      </div>
      <div class="details-vagas-bar">
        <div class="details-vagas-fill" style="width: ${percentual}%;"></div>
      </div>
    </div>
    
    <!-- Requisitos -->
    ${projeto.requisitos && projeto.requisitos.length > 0 ? `
      <div class="details-section">
        <h3>📝 Requisitos</h3>
        <div class="details-list">
          <ul>
            ${projeto.requisitos.map(req => `<li>${req}</li>`).join('')}
          </ul>
        </div>
      </div>
    ` : ''}
    
    <!-- Benefícios -->
    ${projeto.beneficios && projeto.beneficios.length > 0 ? `
      <div class="details-section">
        <h3>🎁 Benefícios</h3>
        <div class="details-list">
          <ul>
            ${projeto.beneficios.map(ben => `<li>${ben}</li>`).join('')}
          </ul>
        </div>
      </div>
    ` : ''}
    
    <!-- Ações -->
    <div class="details-actions">
      <button class="btn btn-share" onclick="shareProject('${projectId}')">
        🔗 Compartilhar
      </button>
      ${isEnrolled 
        ? `<button class="btn btn-secondary" style="background:#f44336;color:#fff;flex:1;" onclick="cancelEnrollment('${projectId}'); document.getElementById('projectDetailsModal').classList.remove('active');">
            ❌ Cancelar Inscrição
          </button>`
        : `<button class="btn btn-primary" style="flex:1;" onclick="enrollInProject('${projectId}'); document.getElementById('projectDetailsModal').classList.remove('active');">
            ✅ Inscrever-se Agora
          </button>`
      }
    </div>
  `;
  
  // Abrir modal
  document.getElementById('projectDetailsModal').classList.add('active');
}

// Inscrever-se no projeto
function enrollInProject(projectId) {
  console.log('Tentar inscrição no projeto:', projectId);
  
  const currentUser = window.authSystem?.getCurrentUser();
  
  if (!currentUser) {
    alert('Você precisa estar logado para se inscrever em um projeto.');
    window.location.href = 'login.html';
    return;
  }
  
  // REMOVER parseInt() aqui
  const result = window.projectSystem?.enrollInProject(projectId, currentUser.id);
  
  if (result?.success) {
    alert('Inscrição realizada com sucesso!');
    loadProjects();
  } else {
    alert(result?.message || 'Erro ao realizar inscrição.');
  }
}

// Cancelar inscrição no projeto
function cancelEnrollment(projectId) {
  console.log('Tentar cancelar inscrição no projeto:', projectId);
  
  const currentUser = window.authSystem?.getCurrentUser();
  
  if (!currentUser) {
    alert('Você precisa estar logado.');
    return;
  }
  
  if (!confirm('Deseja realmente cancelar sua inscrição neste projeto?')) {
    return;
  }
  
  // REMOVER parseInt() aqui
  const result = window.projectSystem?.cancelEnrollment(projectId, currentUser.id);
  
  if (result?.success) {
    alert('Inscrição cancelada com sucesso!');
    loadProjects();
  } else {
    alert(result?.message || '❌ Erro ao cancelar inscrição.');
  }
}

// Compartilhar projeto
function shareProject(projectId) {
  // REMOVER parseInt() aqui
  const projeto = window.projectSystem?.getProjectById(projectId);
  if (!projeto) return;
  
  const url = `${window.location.origin}/projetos.html`;
  const texto = `Confira o projeto "${projeto.titulo}" na ONG DOM!`;
  
  if (navigator.share) {
    navigator.share({
      title: projeto.titulo,
      text: texto,
      url: url
    }).then(() => {
      console.log('Compartilhado com sucesso');
    }).catch((error) => {
      console.log('Erro ao compartilhar:', error);
      copiarLink(url);
    });
  } else {
    copiarLink(url);
  }
}

// Copiar link
function copiarLink(url) {
  navigator.clipboard.writeText(url).then(() => {
    alert('Link copiado para a área de transferência!');
  }).catch(() => {
    alert('Link: ' + url);
  });
}