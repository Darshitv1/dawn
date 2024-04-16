window.document.addEventListener('DOMContentLoaded', () => {
  const discountCodeInput = document.querySelector('.discount-code');
  var originalPrice = document.querySelector('.unit-price').innerHTML.replace('Rs. ', '');
  console.log('originalPrice:', originalPrice);
  discountCodeInput.addEventListener('click', applyDiscount);

  function applyDiscount() {
    const discountCode = discountCodeInput.value;
    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('discounts', discountCode); 
    window.history.replaceState({}, '', `${window.location.pathname}?${urlParams}`);
    console.log('discount applied:', discountCode);
    fetch(`/discount/${discountCode}`)
      .then(function () {
        return fetch('/cart/update.js', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            updates: {},
          }),
        });
      })
      .then(() => {
        console.log('Discount updated');
      })
      .catch(function (error) {
        console.error('Error:', error);
      });
  }

  const plus = document.querySelector('.icon-plus'),
    minus = document.querySelector('.icon-minus');
  // console.log(plus);
  // console.log(minus);

  let number = document.querySelector('.quantity__input');
  // console.log(number.value);
  plus.addEventListener('click', () => {
    number.value++;
    for (let l = 0; l < variantsArray.length; l++) {
      //if the variant selection matches the json variant options then update the price
      if (JSON.stringify(checkedArray) == JSON.stringify(variantsArray[l].options)) {
        //formatting the price manually (need to fix later)
        var priceString = variantsArray[l].price.toString();
        document.querySelector('.unit-price').textContent = `Rs. ${(priceString * number.value) / 100}`;
      }
    }
    // document.querySelector('.quantity__input') = number.value;
    if (number.value > 1) {
      minus.style.cursor = 'pointer';
    }
    // console.log(number.value);
  });

  minus.addEventListener('click', () => {
    console.log(minus);
    number.value--;
    for (let l = 0; l < variantsArray.length; l++) {
      //if the variant selection matches the json variant options then update the price
      if (JSON.stringify(checkedArray) == JSON.stringify(variantsArray[l].options)) {
        //formatting the price manually (need to fix later)
        var priceString = variantsArray[l].price.toString();
        document.querySelector('.unit-price').textContent = `Rs. ${(priceString * number.value) / 100}`;
      }
    }
    if (number.value <= 1) {
      number.value = 1;
      for (let l = 0; l < variantsArray.length; l++) {
        //if the variant selection matches the json variant options then update the price
        if (JSON.stringify(checkedArray) == JSON.stringify(variantsArray[l].options)) {
          //formatting the price manually (need to fix later)
          var priceString = variantsArray[l].price.toString();
          document.querySelector('.unit-price').textContent = `Rs. ${(priceString * number.value) / 100}`;
        }
      }
      // document.querySelector('.quantity__input') = number.value;
      minus.disabled = true;
      minus.style.cursor = 'not-allowed';
      // minus.style.opacity = 0.2;
    }
    // else {
    //   minus.style.opacity = 1;
    // }
    // console.log(number.value);
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

  var variantsArray = JSON.parse(document.getElementById('variants').text);
  // console.log('variantsArray: ', variantsArray);
  var radioArray = document.querySelectorAll('input[type="radio"]');
  var checkedArray = [];
  radioArray.forEach((radio) => {
    radio.addEventListener('change', function (e) {
      var checkedValues = document.querySelectorAll('input[type="radio"]:checked');
      checkedArray = Array.from(checkedValues, (radio) => radio.value);
      // console.log('Radio button clicked');
      const variant = variantsArray.find((variant) => JSON.stringify(variant.options) === JSON.stringify(checkedArray));
      if (variant) {
        radioArray.forEach((r) => {
          r.removeAttribute('checked');
        });

        // Set the 'checked' attribute on the selected radio button
        this.setAttribute('checked', 'True');
        console.log('Found variant:', variant);
        console.log('avaibility', variant.available);
        const addToCartButton = document.getElementById('add');
        const quant_btn = document.querySelector('.quantity_button');
        const price_update = document.querySelector('.unit-price');
        if (variant.available == false) {
          quant_btn.style.display = 'none';
          price_update.style.textDecoration = 'line-through';
          addToCartButton.value = 'Sold Out';
          addToCartButton.disabled = true;
        } else {
          quant_btn.style.display = 'block';
          price_update.style.textDecoration = 'none';
          addToCartButton.value = 'Add to Cart';
          addToCartButton.disabled = false;
        }

        // Update the price
        var priceString = variant.price.toString();
        document.querySelector('.unit-price').textContent = `Rs. ${(priceString * number.value) / 100}`;
        // const image = document.querySelector('.product-image');
        if (variant.featured_media) {
          const variantImage = variant.featured_media.position;
          // console.log('Slide index:', variantImage);
          galleryTop.slideTo(variantImage - 1);
        }
        // image.alt = variant.alt;
      }
    });
  });
  const addToCartForms = document.querySelectorAll('[data-product-form]');
  // console.log('addToCartForms', addToCartForms);

  addToCartForms.forEach((form) => {
    form.addEventListener('submit', async (event) => {
      event.preventDefault();

      let c = 0;

      // console.log(checkedArray);
      const variants_dd = document.querySelector('#dropdown_variants');
      const v_dd = document.querySelectorAll('.options_cls');
      const v_arr = [];
      v_dd.forEach((v) => {
        v_arr.push(v.innerHTML);
        const variantOptions = v.innerHTML.split('/').map((option) => option.trim());
        const isMatch = variantOptions.every((option, index) => option === checkedArray[index]);
        if (isMatch) {
          variants_dd.selectedIndex = c;
          c = 0;
        } else {
          c++;
        }
      });
      await fetch('/cart/add', {
        method: 'post',
        body: new FormData(form),
      });

      // Get cart count
      const res = await fetch('/cart.js');
      const cart = await res.json();
      console.log('cart:', cart);
      // fetch('/cart/add', {
      //   method: 'POST',
      //   body: new FormData(form),
      //   headers: {
      //     Accept: 'application/json',
      //   },
      // })
      //   .then(async (response) => {
      //     if (!response.ok) {
      //       if (response.headers.get('Content-Type').includes('text/html')) {
      //         const html = await response.text();
      //         throw new Error(`Server responded with HTML: ${html}`);
      //       } else {
      //         throw new Error('Network response was not ok');
      //       }
      //     }
      //     return response.json();
      //   })
      //   .then((cart) => {
      //     console.log('cart: ', cart);
      //   })
      //   .catch((error) => {
      //     console.error('Error:', error);
      //   });
      const message = document.createElement('p');
      message.classList.add('added-to-cart');
      message.textContent = 'Added to cart! Redirecting...';
      form.appendChild(message);
      setTimeout(() => {
        message.remove();
      }, 3000);
    });
  });
});
