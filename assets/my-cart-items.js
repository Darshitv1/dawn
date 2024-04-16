document.addEventListener('DOMContentLoaded', async function () {
  const plusButtons = document.querySelectorAll('.icon-plus');
  const minusButtons = document.querySelectorAll('.icon-minus');
  const deleteButtons = document.querySelectorAll('.minus-vala-class');
  const priceElements = document.querySelectorAll('.price');
  const numberInputs = document.querySelectorAll('.quantity__input');
  let totalPriceElement = document.querySelector('.total_price');
  let productIds = Array.from(document.querySelectorAll('.id_selector')).map((elem) => parseInt(elem.dataset.p_id));
  let prices = Array.from(priceElements).map((priceElement) => parseFloat(priceElement.innerText.replace('Rs.', '')));

  async function fetchCartData() {
    try {
      const response = await fetch('/cart.js');
      const cartData = await response.json();
      return cartData;
    } catch (error) {
      console.error('Error fetching cart data:', error);
      return null;
    }
  }
  const cartData = await fetchCartData();
  if (cartData) {
    // Initialize quantities based on the fetched cart data
    cartData.items.forEach((item) => {
      const quantityInput = document.querySelector(`.quantity__input[data-variant-id="${item.variant_id}"]`);
      if (quantityInput) {
        const index = Array.from(numberInputs).indexOf(quantityInput);
        quantityInput.value = item.quantity;
        numberInputs[index].setAttribute('value', item.quantity);
        updatePrice(index);

        if (item.quantity <= 1) {
          minusButtons[index].style.display = 'none';
          minusButtons[index].disabled = true;
          minusButtons[index].style.cursor = 'not-allowed';
          deleteButtons[index].style.display = 'block';
        } else {
          minusButtons[index].style.display = 'block';
          minusButtons[index].disabled = false;
          minusButtons[index].style.cursor = 'pointer';
          deleteButtons[index].style.display = 'none';
        }
      }
    });
  }

  // Update prices based on initial quantities
  prices.forEach((price, index) => {
    updatePrice(index);
  });

  plusButtons.forEach((plus, index) => {
    plus.addEventListener('click', () => {
      deleteButtons[index].style.display = 'none';
      minusButtons[index].style.display = 'block';
      numberInputs[index].value++;
      numberInputs[index].setAttribute('value', numberInputs[index].value);
      minusButtons[index].style.cursor = 'pointer';
      minusButtons[index].removeAttribute('disabled');
      updatePrice(index);
      updateCartItem(productIds[index], parseInt(numberInputs[index].value));
    });
  });

  minusButtons.forEach((minus, index) => {
    minus.addEventListener('click', () => {
      if (numberInputs[index].value > 1) {
        numberInputs[index].value--;
        numberInputs[index].setAttribute('value', numberInputs[index].value);
        updatePrice(index);
        updateCartItem(productIds[index], parseInt(numberInputs[index].value));
      }
      if (numberInputs[index].value <= 1) {
        numberInputs[index].value = 1;
        deleteButtons[index].style.display = 'block';
        minus.style.display = 'none';
        minus.disabled = true;
        minus.style.cursor = 'not-allowed';
      }
    });
  });

  function updatePrice(index) {
    const quantity = parseInt(numberInputs[index].value);
    const totalPrice = prices[index] * quantity;
    priceElements[index].innerText = 'Rs. ' + totalPrice.toFixed(2);
  }

  document.querySelectorAll('.btnqty').forEach((button) => {
    button.addEventListener('click', () => {
      let newPrices = document.querySelectorAll('.price');
      let totalPrice = Array.from(newPrices).reduce(
        (total, price) => total + parseFloat(price.innerText.replace('Rs.', '')),
        0
      );
      totalPriceElement.innerText = 'Rs. ' + totalPrice.toFixed(2);
    });
  });

  const removeButtons = document.querySelectorAll('.my-delete-svg');

  removeButtons.forEach((button) => {
    button.addEventListener('click', async () => {
      const productId = button.getAttribute('data-product-id');

      if (!productId) {
        console.error('Product ID not found on button');
        return;
      }

      try {
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
          let total = Array.from(newPrices).reduce(
            (sum, price) => sum + parseFloat(price.innerText.replace('Rs.', '')),
            0
          );

          // Update total price in the UI
          totalPriceElement.innerText = 'Rs. ' + total.toFixed(2);
        } else {
          alert('Failed to remove item from cart. Please try again.');
        }
      } catch (error) {
        alert('Something went wrong! Try again later.');
      }
    });
  });

  const updateCartItem = async (productId, quantity) => {
    try {
      const response = await fetch(`/cart/update.js`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ updates: { [productId]: quantity } }),
      });

      const data = await response.json();
      console.log('Cart items updated:', data);
      const totalPriceElement = document.querySelector('.total_price');
      const discountElement = document.querySelector('.total_discounts');
      // let total = parseFloat(totalPriceElement.innerText.replace(/[^\d.]/g, '')); // Remove non-numeric characters

      // console.log('total:', total);
      // const discount = (total * 10000) / 9; // Calculate discount based on total price
      // console.log('discount:', discount);
      totalPriceElement.innerText = 'Rs. ' + formatNumber(data.total_price);

      // Update total discount
      discountElement.innerText = 'Rs. ' + formatNumber(data.total_discount);

      function formatNumber(number) {
        return (number / 100).toFixed(2);
      }
    } catch (error) {
      //   alert('Something went wrong! Try again later2.');
    }
  };
});
