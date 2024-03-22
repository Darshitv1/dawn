const plus = document.querySelector('.icon-plus'),
  minus = document.querySelector('.icon-minus');
console.log(plus);
console.log(minus);

let number = document.querySelector('.quantity__input');
console.log(number.value);
plus.addEventListener('click', () => {
  number.value++;
  // document.querySelector('.quantity__input') = number.value;
  if (number.value > 1) {
    minus.style.opacity = 1;
  }
  console.log(number.value);
});

minus.addEventListener('click', () => {
  // console.log(minus);
  number.value--;
  if (number.value <= 1) {
    number.value = 1;
    // document.querySelector('.quantity__input') = number.value;
    minus.style.cursor = 'not-allowed';
  }
  // else {
  // document.querySelector('.quantity__input') = number.value;
  // minus.style.opacity = 1;
  // }
  console.log(number.value);
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
