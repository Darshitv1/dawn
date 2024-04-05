const slides = document.querySelector('.coll_xyz');
const data = slides.dataset.grid;
console.log(data);

var swiper = new Swiper('.mySwiper', {
  slidesPerView: data,
  centeredSlides: true,
  spaceBetween: 20,
  //   pagination: {
  //     el: '.swiper-pagination',
  //     // type: 'fraction',
  //   },
  //   autoplay: {
  //     delay: 4000,
  //     disableOnInteraction: false,
  //   },
  navigation: {
    nextEl: '.swiper-button-next',
    prevEl: '.swiper-button-prev',
  },
  loop: true,
  rewind: true,
  // cssMode: true,
  grabCursor: true,
});

window.addEventListener('resize', function () {
  // Get the current window width
  const width = window.innerWidth;

  // If the width is less than 768px, destroy the swiper
  if (width < 768) {
    swiper.destroy();
  }

  var mediaQuery = window.matchMedia('(max-width: 768px)');
  var xyzxyz = document.querySelector('#filter_div');
  var main = document.querySelector('.main_collection_card');

  if (mediaQuery) {
    xyzxyz.classList.add('xyzxyz');
    main.classList.add('products-3');
  }
});

document.addEventListener('DOMContentLoaded', function () {
  let filter_item, fetchUrl, sort_item;

  let sorting = document.querySelector('#sort_by');
  console.log(sorting);

  sorting.addEventListener('change', function () {
    sort_item = sorting.value;
    console.log(sort_item);
    if (sort_item && filter_item) {
      fetchUrl = `?${filter_item}&sort_by=${sort_item}`;
    } else {
      fetchUrl = `?sort_by=${sort_item}`;
    }
    updateList(fetchUrl);
  });

  const formfilter = document.querySelector('.collectionfilterform');
  formfilter.addEventListener('change', function (e) {
    const filter_x = new FormData(formfilter);
    filter_item = new URLSearchParams(filter_x).toString();
    // console.log('filter_item', filter_item);
    // filter_item.split('&').forEach((v) => {
    //   // console.log('v', v);
    //   // console.log('=', v.indexOf('='));
    //   let last = v.indexOf('=');
    //   if (last != v.length - 1) {
    //     console.log('no value in ', v);
    //     filter_item += v;
    //   }
    // });
    const appliedFilters = [];
    filter_item.split('&').forEach((v) => {
      let last = v.indexOf('=');
      if (last != v.length - 1) {
        appliedFilters.push(v);
        // console.log(appliedFilters);
      }
    });
    filter_item = appliedFilters.join('&');
    // console.log('filters:', filters);
    // console.log('length', filters.length);
    // filters.forEach((value) => {
    //   console.log('value', value);
    //   console.log('=', value.indexOf('=')));
    // });
    if (sort_item && filter_item) {
      fetchUrl = `?sort_by=${sort_item}&${filter_item}`;
    } else {
      fetchUrl = `?${filter_item}`;
    }
    e.preventDefault();
    updateList(fetchUrl);
  });

  function updateList() {
    console.log('Fetching data from:', fetchUrl);
    window.history.pushState(null, null, fetchUrl);
    fetch(fetchUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        let text = response.text();
        console.log(text);
        return text;
      })
      .then((data) => {
        console.log('Received data:', data);
        replaceData(data);
      })
      .catch((error) => console.error('Error:', error));
  }

  function replaceData(data) {
    console.log(data);
    let parser = new DOMParser();
    let newDoc = parser.parseFromString(data, 'text/html');
    let new_data = newDoc.querySelector('#filter_div');
    if (!new_data) {
      console.error('Error: #filter_div not found in new data');
      return;
    }
    console.log('new_data', new_data);

    let old_data = document.querySelector('#filter_div');
    if (!old_data) {
      console.error('Error: #filter_div not found in old data');
      return;
    }
    old_data.innerHTML = new_data.innerHTML;
    console.log('replaced', old_data);
  }

  const clear_btn = document.querySelector('.clear');
  clear_btn.addEventListener('click', () => {
    console.log('button clicked');
    const input_field = formfilter.querySelectorAll('input');
    input_field.forEach((field) => {
      if (field.type == 'checkbox') {
        field.checked = false;
      } else if (field.type == 'number') {
        field.value = '';
      }
    });
    filter_item = '';
    sort_item = '';
    sorting.selectedIndex = 0;
    fetchUrl = '';
    history.pushState({}, '', window.location.pathname);
    updateList(fetchUrl);
  });

  // var variantsData = JSON.parse(document.querySelector('.product-variants').dataset.variants);
  // variantsData.forEach(function (variant) {
  //   console.log('Variant ID:', variant.id);
  // });

  const addToCartForms = document.querySelectorAll('[data-product-form]');
  // console.log('addToCartForms', addToCartForms);

  addToCartForms.forEach((form) => {
    form.addEventListener('submit', async (event) => {
      console.log('event', event);
      event.preventDefault();

      let selectedVariant = event.submitter.closest('.coll_pro_add_to_cart').querySelector('#hidden_type');
      let selectedVariantValue = selectedVariant.dataset.id;
      console.log('value: ', selectedVariantValue);

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
          console.log('cart:', cart);
        })
        .catch((error) => console.error('Error:', error));

      const message = document.createElement('p');
      message.classList.add('added-to-cart');
      message.textContent = 'Added to cart!';
      form.appendChild(message);
      setTimeout(() => {
        message.remove();
      }, 3000);
      // window.location.href = '/cart';
    });
  });
});

document.addEventListener('DOMContentLoaded', function () {
  var endlessScroll = new Ajaxinate({
    container: '#Huratips-Loop',
    pagination: '#Huratips-Pagination',
  });

  // Listen for the 'ajaxinate:done' event
  document.addEventListener('ajaxinate:done', function (event) {
    // Check if there are more pages to load
    if (!event.detail.has_more) {
      // Add your logic to fetch and append new products here
      fetchAndAppendNewProducts();
    }
  });

  // Function to fetch and append new products
  function fetchAndAppendNewProducts() {
    // Fetch new products and append them to the container
    // For example:
    fetch('/api/new-products')
      .then((response) => response.text())
      .then((data) => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(data, 'text/html');
        const productGrid = doc.querySelector('#Huratips-Loop');

        document.getElementById('Huratips-Loop').appendChild(productGrid);
        // Reinitialize Ajaxinate to handle the new products
        endlessScroll.destroy();
        endlessScroll = new Ajaxinate({
          container: '#Huratips-Loop',
          pagination: '#Huratips-Pagination',
        });
      });
  }
});
