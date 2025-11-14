/* ========== SISTEMA DE GERENCIAMENTO DE PROJETOS ========== */

class ProjectSystem {
  constructor() {
    this.storageKey = 'projetos'; // MUDEI AQUI - era 'dom_projetos'
    this.enrollmentKey = 'inscricoes'; // MUDEI AQUI - era 'dom_enrollments'
    this.init();
  }

  init() {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify([]));
    }
    if (!localStorage.getItem(this.enrollmentKey)) {
      localStorage.setItem(this.enrollmentKey, JSON.stringify([]));
    }
    this.createDefaultProjects();
  }

  createDefaultProjects() {
    const projetos = this.getAllProjects();
    if (projetos.length === 0) {
      const defaultProjects = [
        {
          id: 'PROJ001',
          titulo: 'Acolher',
          descricao: 'Oferecer apoio psicológico gratuito para mães doadoras e receptoras, promovendo saúde emocional durante o período de amamentação.',
          descricaoCompleta: 'Através de psicólogos voluntários, o projeto cria um espaço seguro de escuta, acolhimento e cuidado, ajudando mães a lidar com sentimentos como culpa, exaustão e insegurança.',
          categoria: 'Saúde',
          local: 'São Paulo - SP',
          vagasTotal: 20,
          vagasOcupadas: 0,
          dataInicio: '2025-11-14',
          dataFim: '2026-11-14',
          requisitos: ['Disponibilidade de 1:30h por semana', 'Maior de 18 anos', 'Comprometimento'],
          beneficios: ['Desenvolvimento de habilidades', 'Controle emocional', 'Socialização'],
          responsavel: 'Admin DOM',
          status: 'ativo'
        },
        {
          id: 'PROJ002',
          titulo: 'Mãe Apoia Mãe',
          descricao: 'Formar uma rede de apoio entre mães, incentivando o compartilhamento de experiências, dúvidas e conselhos sobre maternidade e amamentação.',
          descricaoCompleta: 'São realizados encontros presenciais e virtuais com rodas de conversa, oficinas e palestras conduzidas por profissionais de saúde e voluntárias experientes.',
          categoria: 'Saúde',
          local: 'São Paulo - SP',
          vagasTotal: 15,
          vagasOcupadas: 0,
          dataInicio: '2025-10-31',
          dataFim: '2026-10-31',
          requisitos: ['Mães em fase de amamentação', 'Mães doadoras', 'Gestantes'],
          beneficios: ['Experiência Social', 'Certificado de Participação', 'Networking'],
          responsavel: 'Admin DOM',
          status: 'ativo'
        },
        {
          id: 'PROJ003',
          titulo: 'Apoio a Mães Doadoras',
          descricao: 'Orientação e suporte para mães que desejam doar leite materno.',
          descricaoCompleta: 'Orientação e suporte para mães que desejam doar leite materno. Projeto de apoio psicológico e informativo.',
          categoria: 'Educação',
          local: 'São Paulo - SP',
          vagasTotal: 30,
          vagasOcupadas: 0,
          dataInicio: '2025-11-01',
          dataFim: '2026-11-01',
          requisitos: ['Empatia', 'Boa comunicação', 'Disponibilidade para encontros semanais'],
          beneficios: ['Experiência com pessoas', 'Certificado'],
          responsavel: 'Admin DOM',
          status: 'ativo'
        },
        {
          id: 'PROJ004',
          titulo: 'Primeiros Laços',
          descricao: 'Orientar mães sobre amamentação e cuidados iniciais com o bebê, fortalecendo o vínculo entre mãe e filho.',
          descricaoCompleta: 'Oficinas práticas com enfermeiras, nutricionistas e consultoras de amamentação ensinam técnicas de pega correta, armazenamento do leite e autocuidado pós-parto.',
          categoria: 'Educação',
          local: 'São Paulo - SP',
          vagasTotal: 30,
          vagasOcupadas: 0,
          dataInicio: '2025-11-01',
          dataFim: '2026-11-01',
          requisitos: ['Mães e Pais', 'Boa comunicação', 'Gestantes', 'Disponibilidade para encontros semanais'],
          beneficios: ['Experiência com pessoas', 'Certificado', 'Apoio contínuo'],
          responsavel: 'Admin DOM',
          status: 'ativo'
        },
        {
          id: 'PROJ005',
          titulo: 'Crescer com Amor',
          descricao: 'Apoiar famílias em vulnerabilidade social que dependem de doações de leite e cuidados materno-infantis.',
          descricaoCompleta: 'O projeto estabelece parcerias com bancos de leite e instituições de saúde para garantir que bebês em situação de risco recebam o alimento e cuidados necessários. Também realiza a entrega de kits de higiene, roupas e fraldas.',
          categoria: 'Assistência Social',
          local: 'São Paulo - SP',
          vagasTotal: 100,
          vagasOcupadas: 0,
          dataInicio: '2025-11-01',
          dataFim: '2030-11-01',
          requisitos: ['Familias carentes', 'Pessoas inscritas no Bolsa família'],
          beneficios: ['Apoio contínuo'],
          responsavel: 'Admin DOM',
          status: 'ativo'
        },
        {
          id: 'PROJ006',
          titulo: 'Mães Verdes',
          descricao: 'A cada litro de leite humano doado, uma muda de árvore é plantada, simbolizando que cada gota alimenta uma vida e cada árvore renova o futuro.',
          descricaoCompleta: 'O projeto promove ações de reflorestamento, jardinagem comunitária e educação ambiental, envolvendo doadoras, famílias beneficiadas e voluntários.',
          categoria: 'Meio Ambiente',
          local: 'São Paulo - SP',
          vagasTotal: 30,
          vagasOcupadas: 0,
          dataInicio: '2025-11-01',
          dataFim: '2030-11-01',
          requisitos: ['Ser uma voluntário(a)/doador(a)/beneficiário(a)', 'Interesse por meio ambiente e sustentabilidade'],
          beneficios: ['Sustentabilidade', 'Certificado de meio ambiente', 'Experiência com projetos ambientais'],
          responsavel: 'Admin DOM',
          status: 'ativo'
        }
      ];

      localStorage.setItem(this.storageKey, JSON.stringify(defaultProjects));
      console.log('✅ Projetos padrão criados');
    }
  }

  getAllProjects() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao carregar projetos:', error);
      return [];
    }
  }

  getAllEnrollments() {
    try {
      const data = localStorage.getItem(this.enrollmentKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao carregar inscrições:', error);
      return [];
    }
  }

  getProjectById(projectId) {
    const projects = this.getAllProjects();
    const project = projects.find(p => p.id === projectId || String(p.id) === String(projectId));
    
    console.log('🔍 Busca por projeto:', projectId, '→', project ? 'Encontrado' : 'Não encontrado');
    
    return project || null;
  }

  isUserEnrolled(projectId, userId) {
    const enrollments = this.getAllEnrollments();
    const isEnrolled = enrollments.some(e => 
      e.projectId === projectId && e.userId === userId
    );
    
    console.log('🔍 Verificando inscrição:', { projectId, userId, isEnrolled });
    
    return isEnrolled;
  }

  enrollInProject(projectId, userId) {
    console.log('📝 Tentando inscrever:', { projectId, userId });
    
    const projeto = this.getProjectById(projectId);
    
    if (!projeto) {
      console.error('❌ Projeto não encontrado:', projectId);
      return { success: false, message: 'Projeto não encontrado.' };
    }
    
    if (projeto.status !== 'ativo') {
      return { success: false, message: 'Este projeto não está mais ativo.' };
    }
    
    const vagasTotal = parseInt(projeto.vagasTotal) || 0;
    const vagasOcupadas = parseInt(projeto.vagasOcupadas) || 0;
    
    if (vagasOcupadas >= vagasTotal) {
      return { success: false, message: 'Não há mais vagas disponíveis neste projeto.' };
    }
    
    if (this.isUserEnrolled(projectId, userId)) {
      return { success: false, message: 'Você já está inscrito neste projeto.' };
    }
    
    // Criar inscrição
    const enrollment = {
      id: 'ENROLL' + Date.now(),
      projectId: projectId,
      userId: userId,
      userName: window.authSystem?.getCurrentUser()?.nome || 'Voluntário',
      dataInscricao: new Date().toISOString(),
      timestamp: Date.now()
    };
    
    // Salvar inscrição
    const enrollments = this.getAllEnrollments();
    enrollments.push(enrollment);
    localStorage.setItem(this.enrollmentKey, JSON.stringify(enrollments));
    
    // Atualizar vagas do projeto
    projeto.vagasOcupadas = vagasOcupadas + 1;
    
    const projects = this.getAllProjects();
    const index = projects.findIndex(p => p.id === projectId);
    
    if (index !== -1) {
      projects[index] = projeto;
      localStorage.setItem(this.storageKey, JSON.stringify(projects));
    }
    
    console.log('✅ Inscrição realizada:', enrollment);
    
    return { success: true, message: 'Inscrição realizada com sucesso!', enrollment };
  }

  cancelEnrollment(projectId, userId) {
    console.log('🗑️ Tentando cancelar inscrição:', { projectId, userId });
    
    const enrollments = this.getAllEnrollments();
    const enrollmentIndex = enrollments.findIndex(e => 
      e.projectId === projectId && e.userId === userId
    );
    
    if (enrollmentIndex === -1) {
      return { success: false, message: 'Inscrição não encontrada.' };
    }
    
    // Remover inscrição
    enrollments.splice(enrollmentIndex, 1);
    localStorage.setItem(this.enrollmentKey, JSON.stringify(enrollments));
    
    // Atualizar vagas
    const projeto = this.getProjectById(projectId);
    if (projeto) {
      const vagasOcupadas = parseInt(projeto.vagasOcupadas) || 0;
      projeto.vagasOcupadas = Math.max(0, vagasOcupadas - 1);
      
      const projects = this.getAllProjects();
      const index = projects.findIndex(p => p.id === projectId);
      
      if (index !== -1) {
        projects[index] = projeto;
        localStorage.setItem(this.storageKey, JSON.stringify(projects));
      }
    }
    
    console.log('✅ Inscrição cancelada');
    
    return { success: true, message: 'Inscrição cancelada com sucesso!' };
  }

  getUserEnrollments(userId) {
    const enrollments = this.getAllEnrollments();
    const userEnrollments = enrollments.filter(e => e.userId === userId);
    
    console.log(`📊 Inscrições do usuário ${userId}:`, userEnrollments);
    
    return userEnrollments;
  }

  getUserProjects(userId) {
    const enrollments = this.getUserEnrollments(userId);
    const projects = this.getAllProjects();
    
    const userProjects = enrollments
      .map(e => projects.find(p => p.id === e.projectId))
      .filter(p => p); // Remove undefined
    
    console.log(`📋 Projetos do usuário ${userId}:`, userProjects);
    
    return userProjects;
  }

  createProject(projectData) {
    try {
      const projetos = this.getAllProjects();
      
      const newProject = {
        id: 'PROJ' + Date.now(),
        titulo: projectData.titulo,
        descricao: projectData.descricao,
        descricaoCompleta: projectData.descricaoCompleta || projectData.descricao,
        categoria: projectData.categoria,
        local: projectData.local,
        vagasTotal: parseInt(projectData.vagasTotal) || 0,
        vagasOcupadas: 0,
        dataInicio: projectData.dataInicio,
        dataFim: projectData.dataFim,
        requisitos: projectData.requisitos || [],
        beneficios: projectData.beneficios || [],
        responsavel: projectData.responsavel || 'Admin DOM',
        status: projectData.status || 'ativo',
        dataCriacao: new Date().toISOString()
      };

      projetos.push(newProject);
      localStorage.setItem(this.storageKey, JSON.stringify(projetos));
      
      console.log('✅ Projeto criado:', newProject);
      return { success: true, project: newProject };
    } catch (error) {
      console.error('Erro ao criar projeto:', error);
      return { success: false, message: 'Erro ao criar projeto.' };
    }
  }

  updateProject(id, newData) {
    try {
      const projetos = this.getAllProjects();
      const index = projetos.findIndex(p => p.id === id);

      if (index === -1) {
        return { success: false, message: 'Projeto não encontrado.' };
      }

      projetos[index] = { ...projetos[index], ...newData };
      localStorage.setItem(this.storageKey, JSON.stringify(projetos));
      
      console.log('✅ Projeto atualizado:', id);
      return { success: true, project: projetos[index] };
    } catch (error) {
      console.error('Erro ao atualizar projeto:', error);
      return { success: false, message: 'Erro ao atualizar projeto.' };
    }
  }

  deleteProject(id) {
    try {
      const projetos = this.getAllProjects();
      const filtered = projetos.filter(p => p.id !== id);
      
      localStorage.setItem(this.storageKey, JSON.stringify(filtered));
      
      console.log('✅ Projeto deletado:', id);
      return { success: true };
    } catch (error) {
      console.error('Erro ao deletar projeto:', error);
      return { success: false, message: 'Erro ao deletar projeto.' };
    }
  }
}

window.projectSystem = new ProjectSystem();
console.log('✅ Sistema de Projetos carregado');