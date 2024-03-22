// function PredictiveSearch() {
//   var input = document.querySelector('input[type="search"]');
//   var predictiveSearchResults = document.querySelector('#predictive-search');
// api : '/search/suggest.json?q=' +
// searchTerm +
// '&resources[type]&resources[options][unformatted]=false&resources[options][skip_html]=false&resources[options][json]=true'
//   input.addEventListener('input', debounce(function(event) {
//     onChange(event);
//   }, 300));

//   function onChange() {
//     var searchTerm = input.value.trim();

//     if (!searchTerm.length) {
//       close();
//       return;
//     }

//     getSearchResults(searchTerm);
//   }

//   function getSearchResults(searchTerm) {
//     fetch('/search/suggest?q=' + searchTerm + '&section_id=predictive-search')
//       .then(function(response) {
//         if (!response.ok) {
//           var error = new Error(response.status);
//           close();
//           throw error;
//         }

//         return response.text();
//       })
//       .then(function(text) {
//         var resultsMarkup = new DOMParser()
//           .parseFromString(text, 'text/html')
//           .querySelector('#shopify-section-predictive-search').innerHTML;
//         predictiveSearchResults.innerHTML = resultsMarkup;
//         open();
//       })
//       .catch(function(error) {
//         close();
//         throw error;
//       });
//   }

//   function open() {
//     predictiveSearchResults.style.display = 'block';
//   }

//   function close() {
//     predictiveSearchResults.style.display = 'none';
//   }

//   function debounce(fn, wait) {
//     var timeout;
//     return function() {
//       clearTimeout(timeout);
//       timeout = setTimeout(function() {
//         fn.apply(null, arguments);
//       }, wait);
//     };
//   }

//   return {
//     onChange: onChange,
//     getSearchResults: getSearchResults,
//     open: open,
//     close: close
//   };
// }

// var predictiveSearch = PredictiveSearch();
// JavaScript to handle predictive search
document.addEventListener('DOMContentLoaded', function () {
  var searchInput = document.querySelector('input[type="search"]');
  var predictiveSearchResults = document.getElementById('predictive-search');

  searchInput.addEventListener('input', function () {
    var searchTerm = this.value;
    // let tag = searchTerm;
    if (searchTerm == '') {
      resultsHtml = '';
      predictiveSearchResults.innerHTML = resultsHtml;
    } else {
      fetch(
        '/search/suggest.json?q=' +
          searchTerm +
          '&resources[type]&resources[options][unformatted]=false&resources[options][skip_html]=false&resources[options][json]=true',
        {
          method: 'GET',
        }
      )
        .then((response) => response.json())
        .then((data) => {
          let suggestions = data.resources.results;
          // console.log(searchTerm);
          // searchInput.addEventListener('input', function () {
          //   suggestions.products.forEach((tag) => {
          //     console.log('inside');
          //     let arr = tag.tags;
          //     console.log(arr);
          //     for (let i = 0; i < arr.length; i++) {
          //       arr[i] = arr[i].toLowerCase();
          //       // console.log(arr[i]);
          //       if (arr[i].includes(searchTerm.toLowerCase())) {
          //         resultsHtml += '<li>';
          //         resultsHtml += '<a href="/products/' + tag.handle + '">';
          //         resultsHtml += '<img class="image_through_js" src="' + tag.image + '" alt="' + tag.title + '">';
          //         resultsHtml += '<div class="product-info">';
          //         resultsHtml += '<p class="product-title">' + tag.title + '</p>';
          //         resultsHtml += '<p class="product-price"> ₹ ' + tag.price + '</p>';
          //         resultsHtml += '</div>';
          //         resultsHtml += '</a>';
          //         resultsHtml += '</li>';
          //       }
          //     }
          //   });
          // });

          // console.log(suggestions);
          // let suggestions_array = [];
          // suggestions.queries.forEach((element) => {
          //   suggestions_array.push(element.text);
          // });
          // searchInput.placeholder = suggestions_array.join(' ');
          var resultsHtml = '';
          resultsHtml += '<div class="predictive-search-result">';
          resultsHtml += '<div class="suggestion_query">';
          resultsHtml += '<p style="font-weight: bold;"> Suggestions </p>';
          if (suggestions.queries.length > 0) {
            resultsHtml += '<ul class="suggestion_query_ul">';
            suggestions.queries.forEach(function (section) {
              resultsHtml += '<li>' + section.text + '</li>';
            });
            resultsHtml += '</ul>';
          } else {
            resultsHtml += 'Nothing here..';
          }
          resultsHtml += '</div>';
          resultsHtml += '<div class="suggestion_product">';
          resultsHtml += '<p style="font-weight: bold;"> Products </p>';
          if (suggestions.products.length > 0) {
            resultsHtml += '<ul class="suggestion_product_ul">';
            suggestions.products.forEach(function (product) {
              resultsHtml += '<li>';
              resultsHtml += '<a href="/products/' + product.handle + '">';
              resultsHtml += '<img class="image_through_js" src="' + product.image + '" alt="' + product.title + '">';
              resultsHtml += '<div class="product-info">';
              resultsHtml += '<p class="product-title">' + product.title + '</p>';
              resultsHtml += '<p class="product-price"> ₹ ' + product.price + '</p>';
              resultsHtml += '</div>';
              resultsHtml += '</a>';
              resultsHtml += '</li>';
            });
            resultsHtml += '</ul>';
          } else {
            resultsHtml += 'Nothing here..';
          }
          resultsHtml += '</div>';
          resultsHtml += '<div class="suggestion_collection">';
          resultsHtml += '<p style="font-weight: bold;"> Collections </p>';
          if (suggestions.collections.length > 0) {
            resultsHtml += '<ul class="suggestion_collection_ul">';
            suggestions.collections.forEach(function (collection) {
              resultsHtml += '<a href="/collections/' + collection.handle + '">';
              resultsHtml += '<li>';
              resultsHtml +=
                '<img class="image_through_js_coll" src="' +
                collection.featured_image.url +
                '" alt="' +
                collection.title +
                '">';
              resultsHtml += collection.title;
              resultsHtml += '</li>';
              resultsHtml += '</a>';
            });
            resultsHtml += '</ul>';
          } else {
            resultsHtml += 'Nothing here..';
          }
          resultsHtml += '</div>';
          resultsHtml += '<div class="suggestion_page">';
          resultsHtml += '<p style="font-weight: bold;"> Pages </p>';
          if (suggestions.pages.length > 0) {
            resultsHtml += '<ul class="suggestion_page_ul">';
            suggestions.pages.forEach(function (page) {
              resultsHtml += '<a href="' + page.handle + '">';
              resultsHtml += '<li>' + page.title + '</li>';
              resultsHtml += '</a>';
            });
            resultsHtml += '</ul>';
          } else {
            resultsHtml += 'Nothing here..';
          }
          resultsHtml += '</div>';
          resultsHtml += '</div>';
          predictiveSearchResults.innerHTML = resultsHtml;
        })
        .catch((error) => {
          console.error('Error:', error);
        });
    }
  });
});
