/* ========== JAVASCRIPT DA PÁGINA INICIAL ========== */

document.addEventListener('DOMContentLoaded', () => {
  console.log('Página inicial carregada');
  loadFeaturedProjects();
});

// Carregar projetos em destaque (máximo 3)
function loadFeaturedProjects() {
  const container = document.getElementById('featuredProjects');
  
  if (!container) {
    console.warn('Container de projetos em destaque não encontrado');
    return;
  }
  
  let projects = window.projectSystem?.getAllProjects() || [];
  
  // Filtrar apenas ativos e pegar os 3 primeiros
  projects = projects.filter(p => p.status === 'ativo').slice(0, 3);
  
  if (projects.length === 0) {
    container.innerHTML = '<p style="text-align:center;grid-column:1/-1;">Nenhum projeto disponível no momento.</p>';
    return;
  }
  
  container.innerHTML = projects.map(projeto => {
    const vagasTotal = parseInt(projeto.vagasTotal) || parseInt(projeto.vagas) || 0;
    const vagasOcupadas = parseInt(projeto.vagasOcupadas) || parseInt(projeto.vagasPreenchidas) || 0;
    const vagasDisponiveis = vagasTotal - vagasOcupadas;
    const percentual = vagasTotal > 0 ? (vagasOcupadas / vagasTotal) * 100 : 0;
    
    return `
      <div class="project-card" style="background:var(--branco);border-radius:16px;padding:1.5rem;box-shadow:0 4px 12px rgba(0,0,0,0.08);">
        <h3 style="color:var(--rosa-escuro);margin-bottom:1rem;">${projeto.titulo}</h3>
        <span style="display:inline-block;background:var(--rosa-claro);color:var(--rosa-escuro);padding:0.35rem 0.85rem;border-radius:16px;font-size:0.85rem;margin-bottom:1rem;">
          ${projeto.categoria}
        </span>
        <p style="color:var(--cinza-escuro);line-height:1.6;margin:1rem 0;">${projeto.descricao}</p>
        <div style="margin:1rem 0;">
          <div style="display:flex;justify-content:space-between;margin-bottom:0.5rem;font-size:0.9rem;">
            <span>${vagasOcupadas}/${vagasTotal} vagas</span>
            <span style="color:${vagasDisponiveis > 0 ? '#4caf50' : '#f44336'};">${vagasDisponiveis} disponíveis</span>
          </div>
          <div style="background:#e0e0e0;height:10px;border-radius:10px;overflow:hidden;">
            <div style="background:var(--rosa-medio);height:100%;width:${percentual}%;transition:width 0.3s;"></div>
          </div>
        </div>
        <a href="projetos.html" class="btn btn-primary" style="display:block;text-align:center;margin-top:1rem;">Ver Detalhes</a>
      </div>
    `;
  }).join('');
}
/* ========== FIM DO JAVASCRIPT DA PÁGINA INICIAL ========== */