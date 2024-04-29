document.addEventListener('DOMContentLoaded', function () {
  let focalPointDivs = document.querySelectorAll('.focal-point-block');

  focalPointDivs.forEach(function (focalPointDiv) {
    let cardBlock = focalPointDiv.querySelector('.card-container');
    let windowBlock = focalPointDiv.querySelector('.modal-window');

    focalPointDiv.addEventListener('mouseenter', function () {
      cardBlock.classList.remove('card-container-remove');
      windowBlock.classList.remove('modal-window-remove');
      cardBlock.classList.add('card-container-apply');
      windowBlock.classList.add('modal-window-apply');
    });

    focalPointDiv.addEventListener('mouseleave', function () {
      cardBlock.classList.remove('card-container-apply');
      windowBlock.classList.remove('modal-window-apply');
      cardBlock.classList.add('card-container-remove');
      windowBlock.classList.add('modal-window-remove');
    });
  });
});
