document.addEventListener('DOMContentLoaded', () => {
  // Elementos do DOM
  const form = document.getElementById('actionForm');
  const input = document.getElementById('userInput');
  const inputError = document.getElementById('inputError');
  const activityList = document.getElementById('activityList');
  const clearAllBtn = document.getElementById('clearAllBtn');
  const toast = document.getElementById('toast');

  let toastTimer = null;

  // Carregar dados salvos ao iniciar
  loadActivities();

  // Manipulador do envio do formulário
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const textValue = input.value.trim();

    // Validação
    if (!textValue) {
      showError('Por favor, digite uma descrição para a tarefa.');
      return;
    }

    clearError();
    addActivity(textValue);
    
    // Limpar input
    input.value = '';
    input.focus();

    // Feedback ao usuário
    showToast('Task registrada com sucesso!');
  });

  // Limpar erro ao digitar
  input.addEventListener('input', () => {
    if (input.value.trim()) {
      clearError();
    }
  });

  // Botão Limpar Tudo
  clearAllBtn.addEventListener('click', () => {
    if (confirm('Tem certeza que deseja apagar todo o histórico?')) {
      localStorage.removeItem('prototype_activities');
      renderEmptyState();
      showToast('Histórico limpo com sucesso.');
    }
  });

  // Função para adicionar atividade na lista
  function addActivity(text) {
    const emptyState = activityList.querySelector('.empty-state');
    if (emptyState) {
      emptyState.remove();
    }

    const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    
    const itemData = { id: Date.now(), text, time };
    
    createItemElement(itemData);
    saveActivityToStorage(itemData);
  }

  // Criar o elemento HTML da atividade
  function createItemElement(item) {
    const li = document.createElement('li');
    li.className = 'activity-item';
    li.dataset.id = item.id;

    li.innerHTML = `
      <span>
        <strong>• ${escapeHTML(item.text)}</strong> 
        <span class="time">(${item.time})</span>
      </span>
      <button class="delete-btn" aria-label="Excluir tarefa">&times;</button>
    `;

    // Evento de exclusão individual
    li.querySelector('.delete-btn').addEventListener('click', () => {
      li.remove();
      removeActivityFromStorage(item.id);
      
      if (activityList.children.length === 0) {
        renderEmptyState();
      }
      showToast('Tarefa removida.');
    });

    activityList.prepend(li);
  }

  // Renderizar o estado vazio
  function renderEmptyState() {
    activityList.innerHTML = '<li class="empty-state">Nenhuma atividade registrada ainda.</li>';
  }

  // Validação Visual
  function showError(message) {
    input.classList.add('invalid');
    inputError.textContent = message;
  }

  function clearError() {
    input.classList.remove('invalid');
    inputError.textContent = '';
  }

  // Exibir Notificação (Toast)
  function showToast(message) {
    toast.textContent = message;
    toast.classList.remove('hidden');

    if (toastTimer) clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.add('hidden');
    }, 3000);
  }

  // Métodos de Persistência (LocalStorage)
  function saveActivityToStorage(item) {
    const activities = JSON.parse(localStorage.getItem('prototype_activities') || '[]');
    activities.push(item);
    localStorage.setItem('prototype_activities', JSON.stringify(activities));
  }

  function loadActivities() {
    const activities = JSON.parse(localStorage.getItem('prototype_activities') || '[]');
    
    if (activities.length > 0) {
      activityList.innerHTML = '';
      activities.forEach(item => createItemElement(item));
    }
  }

  function removeActivityFromStorage(id) {
    let activities = JSON.parse(localStorage.getItem('prototype_activities') || '[]');
    activities = activities.filter(item => item.id !== id);
    localStorage.setItem('prototype_activities', JSON.stringify(activities));
  }

  // Utilitário para evitar ataques XSS
  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, 
      tag => ({
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        "'": '&#39;',
        '"': '&quot;'
      }[tag] || tag)
    );
  }
});
