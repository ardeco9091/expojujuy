(() => {
  /* ---------- Formulario de contacto ---------- */
  const contactForm = document.querySelector('#contactForm');
  if (contactForm) {
    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!contactForm.reportValidity()) return;
      const data = new FormData(contactForm);
      const nombre = (data.get('nombre') || '').toString().trim();
      if (typeof showToast === 'function') {
        showToast(`Gracias ${nombre.split(' ')[0] || ''}, esta es una demostración: no se envió tu mensaje.`.trim());
      }
      contactForm.reset();
    });
  }

  /* ---------- CTA "Quiero ser sponsor" -> precarga el motivo del formulario ---------- */
  document.querySelectorAll('[data-motivo]').forEach((link) => {
    link.addEventListener('click', () => {
      const select = document.querySelector('#contactMotivo');
      if (select) select.value = link.dataset.motivo;
    });
  });

  /* ---------- Íconos de redes sociales (demostrativos) ---------- */
  document.querySelectorAll('.social-icon[data-demo]').forEach((link) => {
    link.addEventListener('click', (event) => {
      event.preventDefault();
      if (typeof showToast === 'function') showToast('Red social demostrativa: enlace a definir por la organización.');
    });
  });
})();
