window.document.addEventListener('DOMContentLoaded', () => {
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
        const variantImage = variant.featured_media.position;
        // console.log('Slide index:', variantImage);
        galleryTop.slideTo(variantImage - 1);
        // image.alt = variant.alt;
      }
    });
  });
  const addToCartForms = document.querySelectorAll('[data-product-form]');
  // console.log('addToCartForms', addToCartForms);

  addToCartForms.forEach((form) => {
    console.log('form: ', form);
    form.addEventListener('submit', async (event) => {
      // console.log('event', event);
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

      fetch('/cart/add', {
        method: 'post',
        body: new FormData(form),
      })
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.json();
        })
        .then((cart) => {
          // console.log('cart: ', cart);
        })
        .catch((error) => console.error('Error:', error));

      // Update cart count
      document.querySelectorAll('.cart-count').forEach((el) => {
        el.textContent = cart.item_count;
        // console.log('cart count: ', el.textContent);
      });

      // Display message
      const message = document.createElement('p');
      message.classList.add('added-to-cart');
      message.textContent = 'Added to cart! Redirecting...';
      form.appendChild(message);
      setTimeout(() => {
        message.remove();
      }, 3000);
      // let action = (event.submitter.formAction = '/cart');
      // console.log('action', action);
      // window.location.href = '/cart';
      // let fetchUrl = '/cart';
      // window.history.pushState(null, null, fetchUrl);
      // fetch(fetchUrl)
      //   .then((response) => {
      //     if (!response.ok) {
      //       throw new Error('Network response was not ok');
      //     }
      //     return response.text();
      //   })
      //   .then((data) => {
      //     window.location.href = data;
      //   })
      //   .catch((error) => console.error('Error:', error));
    });
  });
});

// addToCartForms.forEach((form) => {
//   form.addEventListener('submit', async (event) => {
//     // Prevent normal submission
//     event.preventDefault();

//     // Submit form with ajax
//     await fetch('/cart', {
//       method: 'post',
//       body: new FormData(form),
//     });

//     // Get new cart object
//     const res = await fetch('/cart.json');
//     const cart = await res.json();
// console.log(cart);

//     // Update cart count
//     document.querySelectorAll('.cart-count').forEach((el) => {
//       el.textContent = cart.item_count;
//     });

//     // Display message
//     const message = document.createElement('p');
//     message.classList.add('added-to-cart');
//     message.textContent = 'Added to cart!';
//     form.appendChild(message);
//   });
// });
// document.querySelector('.form_f_var').addEventListener('submit', function (event) {
//   event.preventDefault();
//   var form = event.target;
//   var formData = new FormData(form);
//   var xhr = new XMLHttpRequest();
//   xhr.open('POST', '/cart.json', true);
//   xhr.onreadystatechange = function () {
//     if (xhr.readyState === 4 && xhr.status === 200) {
//       var response = JSON.parse(xhr.responseText);
// console.log(response);
//       if (response.status === 'success') {
//         window.location.href = '/cart';
//       }
//     }
//   };
// console.log(formData);
//   xhr.send(formData);
// });

///----------------------if product doesn't go to cart then try this....
// fetch('/cart/add', {
//   method: 'post',
//   body: new FormData(form),
// })
//   .then((response) => {
//     if (!response.ok) {
//       throw new Error('Network response was not ok');
//     }
//     return response.json();
//   })
//   .then((cart) => {
//     // Get new cart object
//     return fetch('/cart.json');
//   })
//   .then((res) => res.json())
//   .then((cart) => {
// console.log('cart :', cart);
//     // Update cart count
//     document.querySelectorAll('.cart-count').forEach((el) => {
//       el.textContent = cart.item_count;
//     });
