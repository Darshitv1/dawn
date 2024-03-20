document.addEventListener('DOMContentLoaded', function () {
  let fetchUrl;
  let selectedSortBy;
  let filterParams;

  const collectionsortby = document.querySelector('#sortby');
  collectionsortby.addEventListener('change', function () {
    selectedSortBy = collectionsortby.value;
    if (selectedSortBy && filterParams) {
      fetchUrl = `?${filterParams}&sort_by=${selectedSortBy}`;
    } else {
      fetchUrl = `?sort_by=${selectedSortBy}`;
    }
    console.log(fetchUrl);
    updateproducts(fetchUrl);
  });
  const form = document.querySelector('.collectionfilterjs');
  form.addEventListener('change', function (event) {
    const formData = new FormData(form);
    filterParams = new URLSearchParams(formData).toString();
    if (selectedSortBy && filterParams) {
      fetchUrl = `?sort_by=${selectedSortBy}&${filterParams}`;
    } else {
      fetchUrl = `?${filterParams}`;
    }
    console.log(fetchUrl);
    event.preventDefault();
    updateproducts(fetchUrl);
  });

  function updateproducts() {
    window.history.pushState(null, null, fetchUrl);
    fetch(fetchUrl)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.text();
      })
      .then((data) => {
        updateProductList(data);
      })
      .catch((error) => {
        console.error('There was a problem with the fetch operation:', error);
      });
  }

  function updateProductList(data) {
    const parser = new DOMParser();
    const productdoc = parser.parseFromString(data, 'text/html');
    const newcollectionFilter = productdoc.querySelector('#collectionfilter');
    const existingCollectionFilter = document.querySelector('#collectionfilter');
    existingCollectionFilter.innerHTML = newcollectionFilter.innerHTML;
  }

  const clearalldata = document.querySelector('.clear_all_filter');
  clearalldata.addEventListener('click', function () {
    const allFilterInputs = form.querySelectorAll('input');
    allFilterInputs.forEach((input) => {
      if (input.type === 'text' || input.type === 'number') {
        input.value = '';
      } else if (input.type === 'checkbox' || input.type === 'radio') {
        input.checked = false;
      }
    });
    updateproducts();
  });
});
