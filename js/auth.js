// SVG inline como data URL para não precisar de arquivo externo
function getDefaultAvatar() {
  return 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMTAwIiBoZWlnaHQ9IjEwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48Y2lyY2xlIGN4PSI1MCIgY3k9IjUwIiByPSI1MCIgZmlsbD0iI2ZmYjNkMCIvPjxjaXJjbGUgY3g9IjUwIiBjeT0iNDAiIHI9IjE1IiBmaWxsPSIjZmZmIi8+PHBhdGggZD0iTTI1IDcwIFE1MCA4NSA3NSA3MCIgc3Ryb2tlPSIjZmZmIiBzdHJva2Utd2lkdGg9IjgiIGZpbGw9Im5vbmUiIHN0cm9rZS1saW5lY2FwPSJyb3VuZCIvPjwvc3ZnPg==';
}

/* ========== SISTEMA DE AUTENTICAÇÃO ========== */

class AuthSystem {
  constructor() {
    this.storageKey = 'dom_users';
    this.currentUserKey = 'dom_current_user';
    this.init();
  }

  init() {
    // Criar storage se não existir
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify([]));
    }

    // Criar usuário admin padrão se não existir
    this.createDefaultAdmin();
  }

  // Criar admin padrão
  createDefaultAdmin() {
    const users = this.getAllUsers();
    const adminExists = users.some(u => u.email === 'admin@dom.com');

    if (!adminExists) {
      const defaultAdmin = {
        id: 'ADMIN001',
        nome: 'Administrador',
        email: 'admin@dom.com',
        senha: 'admin123', // Em produção, usar hash
        telefone: '(11) 99999-9999',
        tipo: 'admin',
        dataCadastro: new Date().toISOString()
      };

      users.push(defaultAdmin);
      localStorage.setItem(this.storageKey, JSON.stringify(users));
      console.log('Admin padrão criado: admin@dom.com / admin123');
    }
  }

  // Registrar novo usuário
  register(userData) {
    try {
      const users = this.getAllUsers();

      // Validações
      if (!userData.email || !userData.senha || !userData.nome || !userData.cpf) {
        return { success: false, message: 'Preencha todos os campos obrigatórios.' };
      }

      // Verificar se email já existe
      const emailExists = users.some(u => u.email.toLowerCase() === userData.email.toLowerCase());
      if (emailExists) {
        return { success: false, message: 'Este e-mail já está cadastrado.' };
      }

      // Verificar se CPF já existe
      const cpfExists = users.some(u => u.cpf === userData.cpf);
      if (cpfExists) {
        return { success: false, message: 'Este CPF já está cadastrado.' };
      }

      // IMPORTANTE: Não permitir cadastro de admin
      if (userData.tipo === 'admin') {
        return { success: false, message: 'Não é possível criar contas de administrador.' };
      }

      // Criar novo usuário COM TODOS OS CAMPOS
      const newUser = {
        id: 'USER' + Date.now(),
        nome: userData.nome,
        email: userData.email.toLowerCase(),
        cpf: userData.cpf,
        telefone: userData.telefone || '',
        dataNascimento: userData.dataNascimento || '',
        endereco: userData.endereco || '',
        cep: userData.cep || '',
        cidade: userData.cidade || '',
        estado: userData.estado || '',
        senha: userData.senha,
        tipo: 'voluntario',
        dataCadastro: new Date().toISOString(),
        projetosInscritos: []
      };

      users.push(newUser);
      localStorage.setItem(this.storageKey, JSON.stringify(users));

      console.log('Usuário cadastrado:', newUser.email);
      return { success: true, user: newUser };

    } catch (error) {
      console.error('Erro ao registrar:', error);
      return { success: false, message: 'Erro ao cadastrar usuário.' };
    }
  }

  // Login
  login(email, senha) {
    try {
      const users = this.getAllUsers();
      
      // Buscar usuário
      const user = users.find(u => 
        u.email.toLowerCase() === email.toLowerCase() && 
        u.senha === senha
      );

      if (!user) {
        return { success: false, message: 'E-mail ou senha incorretos.' };
      }

      // Salvar usuário logado
      localStorage.setItem(this.currentUserKey, JSON.stringify(user));
      
      console.log('Login realizado:', user.email);
      return { success: true, user };

    } catch (error) {
      console.error('Erro ao fazer login:', error);
      return { success: false, message: 'Erro ao fazer login.' };
    }
  }

  // Logout
  logout() {
    localStorage.removeItem(this.currentUserKey);
    console.log('Logout realizado');
    window.location.href = 'index.html';
  }

  // Obter usuário atual
  getCurrentUser() {
    try {
      const userData = localStorage.getItem(this.currentUserKey);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Erro ao obter usuário atual:', error);
      return null;
    }
  }

  // Obter todos os usuários
  getAllUsers() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao carregar usuários:', error);
      return [];
    }
  }

  // Atualizar dados do usuário
  updateUser(updatedData) {
    try {
      const users = this.getAllUsers();
      const currentUser = this.getCurrentUser();

      if (!currentUser) {
        console.error('❌ Nenhum usuário logado');
        return { success: false, message: 'Usuário não está logado.' };
      }

      console.log('🔍 Procurando usuário ID:', currentUser.id);
      console.log('👥 Total de usuários:', users.length);

      // Encontrar índice do usuário
      const userIndex = users.findIndex(u => u.id === currentUser.id);

      if (userIndex === -1) {
        console.error('❌ Usuário não encontrado no array');
        return { success: false, message: 'Usuário não encontrado.' };
      }

      console.log('✅ Usuário encontrado no índice:', userIndex);

      // Atualizar apenas campos editáveis (mantém email, cpf, senha, tipo, id)
      const updatedUser = {
        ...users[userIndex],
        nome: updatedData.nome,
        telefone: updatedData.telefone,
        dataNascimento: updatedData.dataNascimento,
        endereco: updatedData.endereco,
        cep: updatedData.cep,
        cidade: updatedData.cidade,
        estado: updatedData.estado
      };

      console.log('📝 Dados atualizados:', updatedUser);

      // Atualizar no array
      users[userIndex] = updatedUser;

      // Salvar no localStorage
      localStorage.setItem(this.storageKey, JSON.stringify(users));
      console.log('💾 Dados salvos no localStorage');

      // Atualizar currentUser
      localStorage.setItem('currentUser', JSON.stringify(updatedUser));
      console.log('💾 CurrentUser atualizado');

      console.log('✅ Usuário atualizado com sucesso:', updatedUser.email);

      return { success: true, user: updatedUser };

    } catch (error) {
      console.error('❌ Erro ao atualizar usuário:', error);
      return { success: false, message: 'Erro ao atualizar perfil.' };
    }
  }

  // Verificar se está logado
  isLoggedIn() {
    return this.getCurrentUser() !== null;
  }

  // Verificar se é admin
  isAdmin() {
    const user = this.getCurrentUser();
    return user && user.tipo === 'admin';
  }

  // Limpar todos os dados (apenas para testes)
  clearAll() {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.currentUserKey);
    this.init();
    console.log('Todos os dados de autenticação foram removidos');
  }
}

// Inicializar sistema global
window.authSystem = new AuthSystem();
console.log('Sistema de autenticação carregado');

// CRIAR ADMIN PADRÃO AUTOMATICAMENTE
(function createDefaultAdmin() {
  const users = JSON.parse(localStorage.getItem('dom_usuarios')) || [];
  
  const adminExists = users.some(u => u.email === 'admin@dom.com');
  
  if (!adminExists) {
    const adminUser = {
      id: 'ADM' + Date.now(),
      nome: 'Administrador DOM',
      email: 'admin@dom.com',
      senha: 'admin123',
      telefone: '(11) 98765-4321',
      tipo: 'admin',
      dataCriacao: new Date().toISOString()
    };
    
    users.push(adminUser);
    localStorage.setItem('dom_usuarios', JSON.stringify(users));
    
    console.log('ADMIN CRIADO AUTOMATICAMENTE!');
    console.log('Email: admin@dom.com');
    console.log('Senha: admin123');
  } else {
    console.log('Admin já existe no sistema');
  }
})();