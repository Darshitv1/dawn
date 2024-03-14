document.addEventListener('DOMContentLoaded', function () {
  const video = document.querySelector('.main_video video');
  console.log(video);
  const playbtn = document.querySelector('.play_button svg');
  const autoplayCheck = document.querySelector('.main_video');
  const btn = document.querySelector('._button');

  function toggleAutoplay() {
    video.autoplay = autoplayCheck.dataset.autoplay == 'true';
    if (video.autoplay) {
      btn.classList.add('d_none');
    }
    console.log(video);
  }
  toggleAutoplay();

  // autoplayCheck.addEventListener('click', function () {
  //   console.log('x');
  //   toggleAutoplay();
  // });

  video.addEventListener('click', () => {
    if (video.paused) {
      btn.classList.add('d_none');
      video.play();
    } else {
      btn.classList.remove('d_none');
      video.pause();
    }
    video.onended = () => {
      console.log('endd');
      video.play();
    };
  });

  playbtn.addEventListener('click', () => {
    if (video.paused) {
      btn.classList.add('d_none');
      video.play();
    } else {
      btn.classList.remove('d_none');
      video.pause();
    }
  });
});
