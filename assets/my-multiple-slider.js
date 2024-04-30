document.addEventListener('DOMContentLoaded', function () {
  var swipers = document.querySelectorAll('.slideimage');
  console.log('swipers', swipers);

  swipers.forEach((swiperelement) => {
    console.log('swiperelement', swiperelement);
    var autoplayCheckbox = swiperelement.getAttribute('data-autoplay');
    var delay = swiperelement.getAttribute('data-delay');
    console.log('autoplayCheckbox', autoplayCheckbox);
    const swiper = new Swiper(swiperelement, {
      loop: true,
      //   centeredSlides: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      autoplay: {
        enabled: autoplayCheckbox === 'true',
        delay: delay ? parseInt(delay) : 3000,
      },
      breakpoints: {
        768: {
          slidesPerView: 3,
          spaceBetween: 30,
        },
        1024: {
          slidesPerView: 4,
          spaceBetween: 40,
        },
        1280: {
          slidesPerView: 5,
          spaceBetween: 50,
        },
      },
    });
  });
});
