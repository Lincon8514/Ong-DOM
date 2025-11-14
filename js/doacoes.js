/* ========== SISTEMA DE DOAÇÕES ========== */

class DonationSystem {
  constructor() {
    this.storageKey = 'doacoes'; // MUDEI AQUI - era 'dom_donations'
    this.init();
  }

  init() {
    if (!localStorage.getItem(this.storageKey)) {
      localStorage.setItem(this.storageKey, JSON.stringify([]));
    }
  }

  // Adicionar nova doação
  addDonation(donationData) {
    try {
      const donations = this.getAllDonations();
      
      // Validar dados
      if (!donationData.valor || donationData.valor <= 0) {
        console.error('❌ Valor inválido');
        return { success: false, message: 'Valor inválido' };
      }

      if (!donationData.metodoPagamento) {
        console.error('❌ Método de pagamento não selecionado');
        return { success: false, message: 'Selecione um método de pagamento' };
      }

      // Obter usuário logado
      const currentUser = window.authSystem?.getCurrentUser();
      
      if (!currentUser) {
        console.error('❌ Usuário não está logado');
        return { success: false, message: 'Você precisa estar logado para fazer uma doação' };
      }

      // Criar objeto da doação
      const donation = {
        id: 'DOA' + Date.now(),
        userId: currentUser.id,
        userName: currentUser.nome,
        userEmail: currentUser.email,
        valor: parseFloat(donationData.valor),
        metodoPagamento: donationData.metodoPagamento,
        mensagem: donationData.mensagem || '',
        data: new Date().toISOString(),
        timestamp: Date.now()
      };
      
      // Adicionar à lista
      donations.push(donation);
      
      // Salvar
      localStorage.setItem(this.storageKey, JSON.stringify(donations));
      
      console.log('✅ Doação salva:', donation);
      return { success: true, donation };
      
    } catch (error) {
      console.error('❌ Erro ao salvar doação:', error);
      return { success: false, message: 'Erro ao processar doação' };
    }
  }

  // Obter todas as doações
  getAllDonations() {
    try {
      const data = localStorage.getItem(this.storageKey);
      return data ? JSON.parse(data) : [];
    } catch (error) {
      console.error('Erro ao carregar doações:', error);
      return [];
    }
  }

  // Obter doações com mensagens (públicas)
  getPublicDonations() {
    const all = this.getAllDonations();
    return all
      .filter(d => d.mensagem && d.mensagem.trim() !== '')
      .sort((a, b) => b.timestamp - a.timestamp);
  }

  // Obter doações de um usuário
  getUserDonations(userId) {
    const all = this.getAllDonations();
    const userDonations = all.filter(d => d.userId === userId);
    console.log(`📊 Doações do usuário ${userId}:`, userDonations);
    return userDonations;
  }

  // Obter total arrecadado
  getTotalAmount() {
    const all = this.getAllDonations();
    return all.reduce((sum, d) => sum + parseFloat(d.valor || 0), 0);
  }

  // Obter número de doadores únicos
  getTotalDonors() {
    const all = this.getAllDonations();
    const uniqueDonors = new Set(all.map(d => d.userId).filter(Boolean));
    return uniqueDonors.size;
  }

  // Limpar todas as doações (apenas para testes)
  clearAll() {
    localStorage.setItem(this.storageKey, JSON.stringify([]));
    console.log('Todas as doações foram removidas');
  }
}

// Inicializar sistema global
window.donationSystem = new DonationSystem();

console.log('✅ Sistema de Doações carregado');