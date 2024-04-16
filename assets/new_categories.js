document.addEventListener('DOMContentLoaded', function () {
  var swipers = document.querySelectorAll('.slideimage');
  console.log('swipers', swipers);

  swipers.forEach((swiperelement) => {
    console.log('swiperelement', swiperelement);
    var autoplayCheckbox = swiperelement.getAttribute('data-autoplay');
    console.log('autoplayCheckbox', autoplayCheckbox);
    const swiper = new Swiper(swiperelement, {
      loop: true,
      centeredSlides: true,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      autoplay: {
        enabled: autoplayCheckbox === 'true',
        delay: 3000,
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

    // Uncomment this block if you want to stop and start autoplay on checkbox change
    // var autoplayCheckboxElement = swiperelement.querySelector('.autoplay-checkbox');
    // if (autoplayCheckboxElement) {
    //   autoplayCheckboxElement.addEventListener('change', function () {
    //     swiper.autoplay.stop();
    //     swiper.autoplay.start();
    //   });
    // }
  });
});
