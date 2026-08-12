document.addEventListener('DOMContentLoaded', () => {
  const form = document.getElementById('actionForm');
  const input = document.getElementById('userInput');
  const activityList = document.getElementById('activityList');
  const toast = document.getElementById('toast');

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const textValue = input.value.trim();
    if (!textValue) return;

    // Remove estado vazio se existir
    const emptyState = activityList.querySelector('.empty-state');
    if (emptyState) {
      emptyState.remove();
    }

    // Adiciona novo item à lista
    const li = document.createElement('li');
    li.textContent = `• ${textValue} (${new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })})`;
    activityList.prepend(li);

    // Limpa o campo de entrada
    input.value = '';

    // Dispara o feedback visual (Toast) aprendida no teste de usabilidade
    showToast('Ação concluída com sucesso!');
  });

  function showToast(message) {
    toast.textContent = message;
    toast.classList.remove('hidden');

    setTimeout(() => {
      toast.classList.add('hidden');
    }, 3000);
  }
});
