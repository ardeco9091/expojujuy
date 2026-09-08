(() => {
  /* ---------- Entradas / Acreditación ---------- */
  const ticketsDialog = document.querySelector('#ticketsDialog');
  const ticketForm = document.querySelector('#ticketForm');
  const stepSelect = document.querySelector('#ticketsStepSelect');
  const stepConfirm = document.querySelector('#ticketsStepConfirm');

  function resetTickets() {
    stepSelect.hidden = false;
    stepConfirm.hidden = true;
    ticketForm.reset();
    document.querySelectorAll('.ticket-option').forEach((option, index) => {
      option.classList.toggle('active', index === 0);
    });
  }

  document.querySelectorAll('[data-open-tickets]').forEach((button) => {
    button.addEventListener('click', () => ticketsDialog.showModal());
  });

  document.querySelectorAll('input[name="ticketCategory"]').forEach((radio) => {
    radio.addEventListener('change', () => {
      document.querySelectorAll('.ticket-option').forEach((option) => {
        option.classList.toggle('active', option.querySelector('input').checked);
      });
    });
  });

  ticketForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const data = new FormData(ticketForm);
    const checked = document.querySelector('input[name="ticketCategory"]:checked');
    const categoryLabel = checked.closest('.ticket-option').querySelector('strong').textContent;
    document.querySelector('#badgeCategory').textContent = categoryLabel;
    document.querySelector('#badgeName').textContent = data.get('fullname');
    document.querySelector('#badgeEmail').textContent = data.get('email');
    document.querySelector('#badgeCode').textContent = `EXJ-${Math.floor(1000 + Math.random() * 9000)}`;
    stepSelect.hidden = true;
    stepConfirm.hidden = false;
    if (typeof showToast === 'function') showToast('Acreditación demostrativa generada');
  });

  document.querySelector('#ticketsAnother').addEventListener('click', resetTickets);
  document.querySelector('#ticketsDone').addEventListener('click', () => ticketsDialog.close());
  ticketsDialog.addEventListener('click', (event) => {
    if (event.target === ticketsDialog) ticketsDialog.close();
  });
  ticketsDialog.addEventListener('close', resetTickets);

  /* ---------- Asistente flotante (JujuyBot) ---------- */
  const assistantDialog = document.querySelector('#assistantDialog');
  document.querySelectorAll('[data-open-assistant]').forEach((button) => {
    button.addEventListener('click', () => assistantDialog.showModal());
  });

  /* ---------- Mapa: auditorios y espacios de actividad ---------- */
  const venueData = {
    auditorio: { name: 'Auditorio Central', activity: 'IA aplicada a la producción regional', time: '10:30' },
    salanorte: { name: 'Sala Norte', activity: 'El futuro de la energía en la región', time: '12:00' },
    conecta: { name: 'Espacio Conecta', activity: 'Ronda de vinculación empresarial', time: '14:15' }
  };
  document.querySelectorAll('.venue-marker').forEach((button) => {
    button.addEventListener('click', () => {
      const venue = venueData[button.dataset.venue];
      if (!venue || typeof showToast !== 'function') return;
      showToast(`${venue.name} · ${venue.time} · ${venue.activity}`);
    });
  });
})();
