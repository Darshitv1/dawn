document.addEventListener('DOMContentLoaded', function () {
  const plusButtons = document.querySelectorAll('.icon-plus');
  const minusButtons = document.querySelectorAll('.icon-minus');
  const deleteBtn = document.querySelectorAll('.minus-vala-class');
  const priceElements = document.querySelectorAll('.price');
  const numberInputs = document.querySelectorAll('.quantity__input');
  let totalPriceElement = document.querySelector('.total_price');
  let p_id = document.querySelectorAll('.id_selector');
  let ids = [];
  p_id.forEach((e) => {
    ids.push(parseInt(e.dataset.p_id));
  });
  console.log('p_id', ids);

  let prices = Array.from(priceElements).map((priceElement) => parseFloat(priceElement.innerText.replace('Rs.', '')));

  // Initialize quantities from localStorage or default to 1
  let quantities = JSON.parse(localStorage.getItem('quantities')) || Array.from(numberInputs).map(() => 1);

  // Update quantity inputs with stored quantities
  numberInputs.forEach((input, index) => {
    input.value = quantities[index];
  });

  // Update prices based on stored quantities
  prices.forEach((price, index) => {
    updatePrice(index);
  });

  plusButtons.forEach((plus, index) => {
    plus.addEventListener('click', () => {
      deleteBtn[index].style.display = 'none';
      minusButtons[index].style.display = 'block';
      numberInputs[index].value++;
      numberInputs[index].setAttribute('value', numberInputs[index].value);
      minusButtons[index].style.cursor = 'pointer';
      minusButtons[index].removeAttribute('disabled');
      updatePrice(index);
      updateLocalStorage();
      // updateCartItem(plus);
    });
  });

  minusButtons.forEach((minus, index) => {
    minus.addEventListener('click', () => {
      if (numberInputs[index].value > 1) {
        numberInputs[index].value--;
        numberInputs[index].setAttribute('value', numberInputs[index].value);
        updatePrice(index);
        updateLocalStorage();
        // updateCartItem(minus);
      }
      if (numberInputs[index].value <= 1) {
        numberInputs[index].value = 1;
        deleteBtn[index].style.display = 'block';
        minus.style.display = 'none';
        minus.disabled = true;
        minus.style.cursor = 'not-allowed';
      }
    });
  });

  function updatePrice(index) {
    const quantity = parseInt(numberInputs[index].value);
    const totalPrice = prices[index] * quantity;
    console.log('total', totalPrice);
    priceElements[index].innerText = 'Rs.' + totalPrice.toFixed(2);
  }

  function updateLocalStorage() {
    quantities = Array.from(numberInputs).map((input) => parseInt(input.value));
    localStorage.setItem('totalPrice', JSON.stringify(totalPriceElement.innerText));
    localStorage.setItem('quantities', JSON.stringify(quantities));
    let cartData = {
      quantities: quantities,
      totalPrice: totalPriceElement.innerText,
    };
    localStorage.setItem('cartData', JSON.stringify(cartData));
    // updateCart();
  }

  let totalPriceee = JSON.parse(localStorage.getItem('totalPrice'));
  totalPriceElement.innerText = totalPriceee || 'Rs.0.00';
  var allPrice = document.querySelectorAll('.btnqty');
  allPrice.forEach((e) => {
    e.addEventListener('click', function () {
      console.log('e', e);
      let newPrice = document.querySelectorAll('.price');
      let prices = Array.from(newPrice).map((newPrice) => parseFloat(newPrice.innerText.replace('Rs.', '')));
      console.log('all prices', prices);
      let totalPrice = 0;
      for (let i = 0; i < prices.length; i++) {
        totalPrice += prices[i];
      }
      totalPriceElement.innerText = 'Rs.' + totalPrice.toFixed(2);
      updateLocalStorage();
      updateCartItem(e);
    });
  });

  const removeButtons = document.querySelectorAll('.my-delete-svg');

  removeButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      console.log('clicked', button);
      // debugger;
      const productId = button.getAttribute('data-product-id');

      if (!productId) {
        console.error('Product ID not found on button');
        return;
      }

      console.log('deleted', productId);
      const response = await fetch(`/cart/update.js`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates: { [productId]: 0 } }), // Set quantity to 0 to remove the item
      });

      if (response.ok) {
        // Remove the item from the UI
        button.closest('tr').remove();

        // Recalculate total price
        let newPrices = document.querySelectorAll('.price');
        let total = 0;
        newPrices.forEach((price) => {
          total += parseFloat(price.innerText.replace('Rs.', ''));
        });

        // Update total price in the UI
        totalPriceElement.innerText = 'Rs.' + total.toFixed(2);

        // Update localStorage
        updateLocalStorage();

        // Update the total price in localStorage
        localStorage.setItem('totalPrice', JSON.stringify(total.toFixed(2)));
      } else {
        // alert('Failed to remove item from cart. Please try again.');
      }
    });
  });

  const updateCartItem = async (button) => {
    var quantity_input = Array.from(document.querySelectorAll('.btnqty')).indexOf(button);
    // console.log(button.nextElementSibling);
    // debugger;
    if (quantity_input % 2 == 1) {
      quantity_input = button.previousElementSibling.value;
    } else {
      // index = button.nextElementSibling;
      quantity_input = button.nextElementSibling.value;
    }
    if (isNaN(quantity_input)) {
      quantity_input = 1;
    }
    // console.log('index', index);
    // debugger;
    // let input = index.closest('.btnqty').querySelector('.quantity__input')
    // const input = numberInputs[index];
    let product = parseInt(button.parentNode.dataset.pro);
    console.log('product', product);
    // debugger;
    const quantity = parseInt(quantity_input);
    console.log('quantity', quantity);

    // const lineItem = button.parentElement.parentElement.parentElement.parentElement.nextElementSibling;
    // console.log('button', lineItem);
    // debugger;
    // const lineItemProperties = lineItem.dataset.lineItemProperties;

    // updateCartItems(product, quantity);
    // let properties = {
    //   items: [
    //     {
    //       id: product,
    //       quantity: quantity,
    //     },
    //   ],
    // };

    try {
      const response = await fetch(`/cart/update.js`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates: { [product]: quantity } }),
      });

      const data = await response.json();
      console.log('response', data);

      // Update the UI or perform any other actions based on the response
    } catch (error) {
      alert('Something went wrong! Try again later.');
    }
  };
});
// function updateCartItems(productId, quantity) {
//   fetch('/cart/update.js', {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'X-Requested-With': 'XMLHttpRequest',
//     },
//     body: JSON.stringify({
//       updates: {
//         [productId]: quantity,
//       },
//     }),
//   })
//     .then((response) => response.json())
//     .then((data) => {
//       console.log('Cart items updated:', data);
//     })
//     .catch((error) => {
//       console.error('Error updating cart items:', error);
//     });
// }

// function updateCart() {
//   let newCartData = {
//     quantities: quantities,
//   };
//   console.log('cartData', newCartData);
//   // debugger;
//   fetch('/cart/update.json', {
//     method: 'post',
//     headers: {
//       'Content-Type': 'application/json',
//     },
//     body: JSON.stringify(newCartData),
//   })
//     .then((response) => {
//       if (!response.ok) {
//         throw new Error('Network response was not ok');
//       }
//       return response.json();
//     })
//     .catch((error) => console.error('Error:', error));
// }
