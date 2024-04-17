class Product {
  constructor(variantsArray) {
    this.variantsArray = variantsArray;
    this.checkedArray = [];
    this.number = document.querySelector('.quantity__input');
    this.priceElement = document.querySelector('.unit-price');
    this.plusButton = document.querySelector('.icon-plus');
    this.minusButton = document.querySelector('.icon-minus');
    this.addToCartForms = document.querySelectorAll('[data-product-form]');
    this.galleryThumbs = new Swiper('.gallery-thumbs', {
      spaceBetween: 10,
      slidesPerView: 4,
      watchSlidesVisibility: true,
      watchSlidesProgress: true,
    });
    this.galleryTop = new Swiper('.gallery-top', {
      spaceBetween: 10,
      navigation: {
        nextEl: '.swiper-button-next',
        prevEl: '.swiper-button-prev',
      },
      thumbs: {
        swiper: this.galleryThumbs,
      },
      loop: true,
    });
  }

  applyDiscount(discountCodeInput) {
    const discountCode = discountCodeInput.value;
    if (!discountCode) {
      console.log('No discount code applied');
      return;
    }

    const urlParams = new URLSearchParams(window.location.search);
    urlParams.set('discounts', discountCode);
    window.history.replaceState({}, '', `${window.location.pathname}?${urlParams}`);
    console.log('discount applied:', discountCode);
    fetch(`/discount/${discountCode}`)
      .then(() => {
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
      .catch((error) => {
        console.error('Error:', error);
      });
  }

  updatePrice() {
    for (let l = 0; l < this.variantsArray.length; l++) {
      if (JSON.stringify(this.checkedArray) == JSON.stringify(this.variantsArray[l].options)) {
        var priceString = this.variantsArray[l].price.toString();
        this.priceElement.textContent = `Rs. ${(priceString * this.number.value) / 100}`;
      }
    }
  }

  updateQuantity(change) {
    this.number.value = parseInt(this.number.value) + change;
    if (this.number.value < 1) {
      this.number.value = 1;
    }

    this.updatePrice();
  }

  init() {
    this.plusButton.addEventListener('click', () => {
      this.updateQuantity(1);
    });

    this.minusButton.addEventListener('click', () => {
      this.updateQuantity(-1);
    });

    this.addToCartForms.forEach((form) => {
      form.addEventListener('submit', async (event) => {
        event.preventDefault();
        let c = 0;
        const variants_dd = document.querySelector('#dropdown_variants');
        const v_dd = document.querySelectorAll('.options_cls');
        const v_arr = [];
        v_dd.forEach((v) => {
          v_arr.push(v.innerHTML);
          const variantOptions = v.innerHTML.split('/').map((option) => option.trim());
          const isMatch = variantOptions.every((option, index) => option === this.checkedArray[index]);
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

        const res = await fetch('/cart.js');
        const cart = await res.json();
        console.log('cart:', cart);
        const message = document.createElement('p');
        message.classList.add('added-to-cart');
        message.textContent = 'Added to cart! Redirecting...';
        form.appendChild(message);
        setTimeout(() => {
          message.remove();
        }, 3000);
      });
    });
  }
}

// Usage
document.addEventListener('DOMContentLoaded', () => {
  const variantsArray = JSON.parse(document.getElementById('variants').text);
  const product = new Product(variantsArray);
  product.init();

  const discountCodeInput = document.querySelector('.discount-code');
  discountCodeInput.addEventListener('click', () => {
    product.applyDiscount(discountCodeInput);
  });

  const radioArray = document.querySelectorAll('input[type="radio"]');
  radioArray.forEach((radio) => {
    radio.addEventListener('change', function () {
      const checkedValues = document.querySelectorAll('input[type="radio"]:checked');
      product.checkedArray = Array.from(checkedValues, (radio) => radio.value);
      const variant = product.variantsArray.find((variant) => JSON.stringify(variant.options) === JSON.stringify(product.checkedArray));
      if (variant) {
        radioArray.forEach((r) => {
          r.removeAttribute('checked');
        });
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

        var priceString = variant.price.toString();
        document.querySelector('.unit-price').textContent = `Rs. ${(priceString * product.number.value) / 100}`;

        if (variant.featured_media) {
          const variantImage = variant.featured_media.position;
          product.galleryTop.slideTo(variantImage - 1);
        }
      }
    });
  });
});
