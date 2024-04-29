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
  // breakPoints: {
  //   320: {
  //     slidesPerView: 1,
  //     spaceBetween: 20,
  //   },
  //   480: {
  //     slidesPerView: 2,
  //     spaceBetween: 20,
  //   },
  //   640: {
  //     slidesPerView: 3,
  //     spaceBetween: 20,
  //   },
  //   768: {
  //     slidesPerView: mobile,
  //     spaceBetween: 20,
  //   },
  //   1024: {
  //     slidesPerView: 5,
  //     spaceBetween: 20,
  //   },
  // },
});
