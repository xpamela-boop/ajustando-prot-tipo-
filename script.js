document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('actionForm');
  const input = document.getElementById('userInput');
  const activityList = document.getElementById('activityList');
  const clearBtn = document.getElementById('clearBtn');
  const toast = document.getElementById('toast');
  let toastTimer = null;

  // Carregar dados armazenados ao iniciar
  loadFromStorage();

  // 1. Processar envio do formulário
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const value = input.value.trim();

    if (!value) return;

    const time = new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' });
    const itemData = { id: Date.now(), text: value, time: time };

    renderItem(itemData);
    saveToStorage(itemData);

    input.value = '';
    showToast('Ação registrada com sucesso!');
  });

  // 2. Limpar toda a lista
  clearBtn.addEventListener('click', () => {
    localStorage.removeItem('tasks_prototype');
    renderEmptyState();
    showToast('Histórico limpo!');
  });

  // 3. Renderizar um item na tela
  function renderItem(item) {
    const emptyState = activityList.querySelector('.empty-state');
    if (emptyState) {
      emptyState.remove();
    }

    const li = document.createElement('li');
    li.className = 'activity-item';
    li.dataset.id = item.id;
    li.innerHTML = `
      <span>
        <strong>• ${escapeHTML(item.text)}</strong> 
        <span class="time">(${item.time})</span>
      </span>
      <button class="delete-btn" title="Remover item">&times;</button>
    `;

    // Evento de exclusão individual
    li.querySelector('.delete-btn').addEventListener('click', () => {
      li.remove();
      removeFromStorage(item.id);
      if (activityList.children.length === 0) {
        renderEmptyState();
      }
      showToast('Item removido!');
    });

    activityList.prepend(li);
  }

  // 4. Renderizar estado vazio
  function renderEmptyState() {
    activityList.innerHTML = '<li class="empty-state">Nenhuma atividade registrada ainda.</li>';
  }

  // 5. Exibir Toast
  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.remove('hidden');

    if (toastTimer) clearTimeout(toastTimer);

    toastTimer = setTimeout(() => {
      toast.classList.add('hidden');
    }, 2500);
  }

  // 6. Funções de LocalStorage
  function saveToStorage(item) {
    const items = JSON.parse(localStorage.getItem('tasks_prototype') || '[]');
    items.push(item);
    localStorage.setItem('tasks_prototype', JSON.stringify(items));
  }

  function loadFromStorage() {
    const items = JSON.parse(localStorage.getItem('tasks_prototype') || '[]');
    if (items.length > 0) {
      activityList.innerHTML = '';
      items.forEach(item => renderItem(item));
    }
  }

  function removeFromStorage(id) {
    let items = JSON.parse(localStorage.getItem('tasks_prototype') || '[]');
    items = items.filter(item => item.id !== id);
    localStorage.setItem('tasks_prototype', JSON.stringify(items));
  }

  // 7. Sanitização contra XSS
  function escapeHTML(str) {
    return str.replace(/[&<>'"]/g, tag => ({
      '&': '&amp;', '<': '&lt;', '>': '&gt;', "'": '&#39;', '"': '&quot;'
    }[tag] || tag));
  }
});
