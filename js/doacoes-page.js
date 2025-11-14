/* ========== PÁGINA DE DOAÇÕES ========== */

document.addEventListener('DOMContentLoaded', () => {
  console.log('🔄 Carregando página de doações...');
  
  let valorSelecionado = 0;
  let metodoSelecionado = '';
  
  // Seleção de valores
  const valoresCards = document.querySelectorAll('.valor-card');
  const valorCustomInput = document.getElementById('valorCustom');
  
  valoresCards.forEach(card => {
    card.addEventListener('click', () => {
      // Remove seleção anterior
      valoresCards.forEach(c => c.classList.remove('selected'));
      
      // Adiciona seleção
      card.classList.add('selected');
      
      // Pega o valor
      valorSelecionado = parseFloat(card.dataset.valor);
      
      // Limpa input custom
      valorCustomInput.value = '';
      
      // Atualiza resumo
      atualizarResumo();
    });
  });
  
  // Valor customizado
  valorCustomInput.addEventListener('input', (e) => {
    valorSelecionado = parseFloat(e.target.value) || 0;
    
    // Remove seleção dos cards
    valoresCards.forEach(c => c.classList.remove('selected'));
    
    // Atualiza resumo
    atualizarResumo();
  });
  
  // Seleção de método de pagamento
  const metodosCards = document.querySelectorAll('.payment-method');
  
  metodosCards.forEach(card => {
    card.addEventListener('click', () => {
      // Remove seleção anterior
      metodosCards.forEach(c => c.classList.remove('selected'));
      
      // Adiciona seleção
      card.classList.add('selected');
      
      // Pega o método
      metodoSelecionado = card.dataset.method;
      
      // Atualiza resumo
      atualizarResumo();
    });
  });
  
  // Contador de caracteres da mensagem
  const mensagemInput = document.getElementById('mensagemDoacao');
  const charCount = document.getElementById('charCount');
  
  if (mensagemInput && charCount) {
    mensagemInput.addEventListener('input', () => {
      charCount.textContent = `${mensagemInput.value.length}/300`;
    });
  }
  
  // Atualizar resumo
  function atualizarResumo() {
    document.getElementById('resumoValor').textContent = `R$ ${valorSelecionado.toFixed(2)}`;
    document.getElementById('resumoMetodo').textContent = formatarMetodo(metodoSelecionado);
    document.getElementById('resumoTotal').textContent = `R$ ${valorSelecionado.toFixed(2)}`;
  }
  
  function formatarMetodo(metodo) {
    const metodos = {
      'pix': 'PIX',
      'credito': 'Cartão de Crédito',
      'debito': 'Cartão de Débito',
      'boleto': 'Boleto Bancário'
    };
    return metodos[metodo] || '-';
  }
  
  // Enviar doação
  const form = document.getElementById('donationForm');
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    
    // Validações
    if (valorSelecionado <= 0) {
      alert('Por favor, selecione ou digite um valor para doar');
      return;
    }
    
    if (!metodoSelecionado) {
      alert('Por favor, selecione um método de pagamento');
      return;
    }
    
    // Verificar se está logado
    const user = window.authSystem?.getCurrentUser();
    if (!user) {
      alert('Você precisa estar logado para fazer uma doação');
      window.location.href = 'login.html';
      return;
    }
    
    // Criar objeto de doação
    const donationData = {
      valor: valorSelecionado,
      metodoPagamento: metodoSelecionado,
      mensagem: mensagemInput ? mensagemInput.value.trim() : ''
    };
    
    console.log('📤 Enviando doação:', donationData);
    
    // Salvar doação
    const result = window.donationSystem.addDonation(donationData);
    
    if (result.success) {
      alert('✅ Doação realizada com sucesso! Obrigado por contribuir! 💖');
      
      // Resetar formulário
      valorSelecionado = 0;
      metodoSelecionado = '';
      valoresCards.forEach(c => c.classList.remove('selected'));
      metodosCards.forEach(c => c.classList.remove('selected'));
      if (valorCustomInput) valorCustomInput.value = '';
      if (mensagemInput) mensagemInput.value = '';
      
      atualizarResumo();
      carregarEstatisticas();
      carregarMural();
      carregarHistorico();
      
    } else {
      alert('❌ ' + (result.message || 'Erro ao processar doação. Tente novamente.'));
    }
  });
  
  // Carregar estatísticas
  function carregarEstatisticas() {
    const total = window.donationSystem.getTotalAmount();
    const doadores = window.donationSystem.getTotalDonors();
    const doacoes = window.donationSystem.getAllDonations().length;
    
    document.getElementById('totalArrecadado').textContent = total.toFixed(2);
    document.getElementById('totalDoadores').textContent = doadores;
    document.getElementById('totalDoacoes').textContent = doacoes;
  }
  
  // Carregar mural de mensagens
  function carregarMural() {
    const container = document.getElementById('muralMensagens');
    const mensagens = window.donationSystem.getPublicDonations();
    
    if (mensagens.length === 0) {
      container.innerHTML = '<p class="empty-message">Ainda não há mensagens públicas</p>';
      return;
    }
    
    let html = '';
    mensagens.slice(0, 10).forEach(doacao => {
      const data = new Date(doacao.data).toLocaleDateString('pt-BR');
      html += `
        <div class="mensagem-card">
          <div class="mensagem-header">
            <strong>${doacao.userName || 'Anônimo'}</strong>
            <span class="mensagem-data">${data}</span>
          </div>
          <p class="mensagem-texto">${doacao.mensagem}</p>
          <div class="mensagem-valor">Doou R$ ${parseFloat(doacao.valor).toFixed(2)}</div>
        </div>
      `;
    });
    
    container.innerHTML = html;
  }
  
  // Carregar histórico do usuário
  function carregarHistorico() {
    const container = document.getElementById('historicoLista');
    const user = window.authSystem?.getCurrentUser();
    
    if (!user) {
      container.innerHTML = '<p class="empty-message">Faça login para ver seu histórico</p>';
      return;
    }
    
    const historico = window.donationSystem.getUserDonations(user.id);
    
    if (historico.length === 0) {
      container.innerHTML = '<p class="empty-message">Você ainda não fez nenhuma doação</p>';
      return;
    }
    
    let html = '';
    historico.forEach(doacao => {
      const data = new Date(doacao.data).toLocaleDateString('pt-BR');
      html += `
        <div class="historico-card">
          <div class="historico-info">
            <strong>R$ ${parseFloat(doacao.valor).toFixed(2)}</strong>
            <span>${formatarMetodo(doacao.metodoPagamento)}</span>
            <span>${data}</span>
          </div>
        </div>
      `;
    });
    
    container.innerHTML = html;
  }
  
  // Carregar dados ao abrir página
  carregarEstatisticas();
  carregarMural();
  carregarHistorico();
});