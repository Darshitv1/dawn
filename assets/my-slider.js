const slides = document.querySelector('.xyz');
const data = slides.dataset.grid;
console.log(data);

// const mobile_slides = document.querySelector('.xyz');
// const mobile_data = mobile_slides.dataset.mobile;
// console.log(mobile_data);

var swiper = new Swiper('.mySwiper', {
  slidesPerView: data,
  centeredSlides: true,
  // spaceBetween: 20,
  pagination: {
    el: '.swiper-pagination',
    // type: 'fraction',
  },
  autoplay: {
    delay: 4000,
    disableOnInteraction: false,
  },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  loop: true,
  // rewind: true,
  // cssMode: true,
  grabCursor: true,
});
