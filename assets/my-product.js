const plus = document.querySelector('.icon-plus'),
  minus = document.querySelector('.icon-minus');
console.log(plus);
console.log(minus);

let number = document.querySelector('.number').innerHTML;
console.log(number);
plus.addEventListener('click', () => {
  number++;
  document.querySelector('.number').innerHTML = number;
  if (number > 1) {
    minus.style.opacity = 1;
  }
  console.log(number);
});

minus.addEventListener('click', () => {
  number--;
  if (number <= 1) {
    number = 1;
    document.querySelector('.number').innerHTML = number;
    minus.style.opacity = 0.2;
  } else {
    document.querySelector('.number').innerHTML = number;
    minus.style.opacity = 1;
  }
  console.log(number);
});

// if (number == 1) {
//   minus.style.opacity = 0.2;
// } else {
//   minus.style.opacity = 1;
// }
// window.addEventListener('DOMContentLoaded', () => {
var galleryThumbs = new Swiper('.gallery-thumbs', {
  spaceBetween: 10,
  slidesPerView: 4,
  freeMode: true,
  watchSlidesVisibility: true,
  watchSlidesProgress: true,
});
var galleryTop = new Swiper('.gallery-top', {
  spaceBetween: 10,
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  thumbs: {
    swiper: galleryThumbs,
  },
  loop: true,
});
// });
