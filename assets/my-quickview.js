window.addEventListener('DOMContentLoaded', () => {
  function attachQuickViewListeners() {
    const quickViewBtns = document.querySelectorAll('.quick-view-btn');
    const body = document.querySelector('body');

    quickViewBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const productId = btn.dataset.productId;
        const modalId = `quick-view-modal-${productId}`;
        const modal = document.getElementById(modalId);
        if (modal) {
          body.classList.add('overflow-hidden');
          modal.setAttribute('aria-hidden', 'false');
        }
      });
    });

    const close_btn = document.querySelectorAll('.quick-view-modal__close');
    close_btn.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const modal = btn.closest('.quick-view-modal');
        modal.setAttribute('aria-hidden', 'true');
        body.classList.remove('overflow-hidden');
      });
    });

    // Close the modal when clicking outside the modal content
    document.addEventListener('click', (e) => {
      const modal = e.target.closest('.quick-view-modal');
      if (!modal) return;
      const modalContent = modal.querySelector('.quick-view-modal__content');
      if (!modalContent.contains(e.target)) {
        modal.setAttribute('aria-hidden', 'true');
        body.classList.remove('overflow-hidden');
      }
    });
  }

  // Call the function when the page loads initially
  attachQuickViewListeners();
});
