class ProductFilter {
  constructor() {
    this.sorting = document.querySelector('#sort_by');
    this.filterForm = document.querySelector('.collectionfilterform');
    this.appendTarget = document.querySelector('#wantToAppend');
    this.nextPageUrl = document.querySelector('#Huratips-Loop').getAttribute('data-nextpage');
    this.isLoading = false;
    this.currentPage = 2;

    this.handleScroll = this.handleScroll.bind(this);
  }

  debouncedUpdateList = debounce((fetchUrl) => {
    this.updateList(fetchUrl);
  }, 300);

  debouncedHandleSortChange = debounce(() => {
    const sortItem = this.sorting.value;
    const filterItem = this.getFilterData();
    const fetchUrl = this.buildFetchUrl(sortItem, filterItem);
    this.debouncedUpdateList(fetchUrl);
  }, 300);

  debouncedHandleFilterChange = debounce(() => {
    const sortItem = this.sorting.value;
    const filterItem = this.getFilterData();
    const fetchUrl = this.buildFetchUrl(sortItem, filterItem);
    this.debouncedUpdateList(fetchUrl);
  }, 300);

  init() {
    this.sorting.addEventListener('change', this.debouncedHandleSortChange);
    this.filterForm.addEventListener('change', this.debouncedHandleFilterChange);
    window.addEventListener('scroll', this.handleScroll);
    this.quickView();
    const clearButton = document.querySelector('.clear');
    clearButton.addEventListener('click', () => {
      this.clearFiltersAndFetchInitialData();
      this.fetchNextPage();
    });

    // const radioButtons = document.querySelectorAll('.selection');
    // radioButtons.forEach((radioButton) => {
    //   radioButton.addEventListener('change', this.handleRadioButtonChange.bind(this));
    //   console.log('clicked', radioButton);
    // });
    const swatch = document.querySelectorAll('.color-switch'); //colorswitch
    // console.log('color',swatch);
    swatch.forEach((swatchs) => {
      swatchs.addEventListener('click', this.handleRadioButtonChange.bind(swatchs));
    });
    // Initial fetch for the first page of products
    // this.fetchNextPage();
  }

  handleRadioButtonChange(swatchs) {
    const productContainer = swatchs.target.closest('.main_collection_card'); //main product div
    // console.log('productContainer', productContainer);
    const currentColor = swatchs.target.dataset.color;
    console.log('currentColor', currentColor);
    const currentImage = productContainer.querySelector('.changes_ke_liye');
    const allInputs = productContainer.querySelectorAll('#match-image-input');
    const formData = productContainer.querySelector('#hidden_type');
    const quickViewModal = productContainer.querySelector('.changes_ke_liye_dusra');
    const quickCart = productContainer.querySelector('.isme_bhi_changes_hai');
    let ids = [];
    allInputs.forEach((input) => {
      const variantTitle = input.getAttribute('variant-title');
      console.log('variantTitle', variantTitle);
      const variantColor = variantTitle.split(' / ')[2].trim();
      // console.log('variantColor', variantColor);
      if (variantColor.toLowerCase() === currentColor.toLowerCase()) {
        const variantImage = input.getAttribute('variant-image');
        console.log('variantImage', variantImage);
        const variantId = input.getAttribute('variant-id');
        ids.push(variantId);
        console.log('variantId', variantId);
        formData.dataset.id = ids[0];
        formData.value = ids[0];
        quickCart.value = ids[0];
        currentImage.src = variantImage;
        quickViewModal.src = variantImage;
      }
    });
  }
  // Method to clear filters and fetch initial data
  clearFiltersAndFetchInitialData() {
    // Clear all filter inputs
    const filterInputs = this.filterForm.querySelectorAll('input, select');
    filterInputs.forEach((input) => {
      if (input.type === 'checkbox' || input.type === 'radio') {
        input.checked = false;
      } else {
        input.value = '';
      }
    });

    // Fetch initial data
    const initialFetchUrl = window.location.origin + window.location.pathname;
    window.history.pushState(null, null, initialFetchUrl);
    this.sorting.selectedIndex = 0;
    this.updateList(initialFetchUrl);
    this.fetchNextPage();
  }

  updateList(fetchUrl) {
    console.log('Fetching data from:', fetchUrl);
    window.history.pushState(null, null, fetchUrl);
    fetch(fetchUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then((data) => {
        this.replaceData(data);
      })
      .catch((error) => console.error('Error:', error));
  }

  replaceData(data) {
    const parser = new DOMParser();
    const newDoc = parser.parseFromString(data, 'text/html');
    const newData = newDoc.querySelector('#wantToAppend');
    if (!newData) {
      console.error('Error: #wantToAppend not found in new data');
      return;
    }

    const oldData = document.querySelector('#wantToAppend');
    if (!oldData) {
      console.error('Error: #wantToAppend not found in old data');
      return;
    }

    oldData.innerHTML = newData.innerHTML;
    console.log('replaced', oldData);
  }

  fetchNextPage() {
    const loader = document.querySelector('.loader');
    loader.style.display = 'block';
    if (this.nextPageUrl && !this.isLoading) {
      this.isLoading = true;
      fetch(this.nextPageUrl)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.text();
        })
        .then((data) => {
          this.debounce((loader.style.display = 'none'), 1000);
          this.debounce(this.appendFetchedData(data), 1000);
          this.getFilterData();
        })
        .catch((error) => {
          console.error('Error:', error);
        })
        .finally(() => {
          this.isLoading = false;
          this.quickView();
        });
    } else {
      this.debounce((loader.style.display = 'none'), 1000);
    }
  }

  appendFetchedData(data) {
    const parser = new DOMParser();
    const doc = parser.parseFromString(data, 'text/html');
    const productGrid = doc.querySelectorAll('#abcd');

    productGrid.forEach((item) => {
      this.appendTarget.appendChild(item);
    });

    const pagination = doc.querySelector('#Huratips-Loop');
    const nextPageLink = pagination ? pagination.getAttribute('data-nextpage') : null;

    if (nextPageLink) {
      this.currentPage++;
      this.nextPageUrl = new URL(nextPageLink, window.location.href);
      this.nextPageUrl.searchParams.set('page', this.currentPage);
    } else {
      this.nextPageUrl = null;
      window.removeEventListener('scroll', this.handleScroll);
    }
  }

  quickView() {
    const quickViewBtns = document.querySelectorAll('.quick-view-btn');
    const body = document.querySelector('body');

    quickViewBtns.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const productId = btn.dataset.productId;
        const modalId = `quick-view-modal-${productId}`;
        const modal = document.getElementById(modalId);
        if (modal) {
          body.classList.add('overflow-hidden');
          modal.setAttribute('aria-hidden', 'false');
        }
      });
    });

    const close_btn = document.querySelectorAll('.quick-view-modal__close');
    close_btn.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const modal = btn.closest('.quick-view-modal');
        modal.setAttribute('aria-hidden', 'true');
        body.classList.remove('overflow-hidden');
      });
    });

    document.addEventListener('click', (e) => {
      const modal = e.target.closest('.quick-view-modal');
      if (!modal) return;
      const modalContent = modal.querySelector('.quick-view-modal__content');
      if (!modalContent.contains(e.target)) {
        modal.setAttribute('aria-hidden', 'true');
        body.classList.remove('overflow-hidden');
      }
    });
  }

  handleScroll() {
    const lastProductItem = this.appendTarget.lastElementChild;

    if (lastProductItem) {
      const lastProductItemPosition = lastProductItem.getBoundingClientRect().bottom;
      if (lastProductItemPosition <= window.innerHeight && !this.isLoading) {
        console.log('fetching...');
        this.fetchNextPage();
      }
    }
  }

  getFilterData() {
    const filterData = new FormData(this.filterForm);
    let filterParams = [];
    for (const [key, value] of filterData.entries()) {
      if (value !== '') {
        filterParams.push(`${key}=${value}`);
      }
    }
    return filterParams.join('&');
  }

  buildFetchUrl(sortItem, filterItem) {
    let fetchUrl = '';
    if (sortItem) {
      fetchUrl += `?sort_by=${sortItem}`;
    }
    if (filterItem) {
      fetchUrl += fetchUrl ? `&${filterItem}` : `?${filterItem}`;
    }
    return fetchUrl;
  }

  // Debounce function
  debounce(func, wait, immediate) {
    let timeout;
    return function executedFunction() {
      const context = this;
      const args = arguments;
      const later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const productFilter = new ProductFilter();
  productFilter.init();
});
