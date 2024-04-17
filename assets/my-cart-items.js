class CartManager {
  constructor() {
    this.initializeElements();
    this.fetchCartData();
    this.initRemoveButtons();
  }

  initializeElements() {
    this.plusButtons = document.querySelectorAll('.icon-plus');
    this.minusButtons = document.querySelectorAll('.icon-minus');
    this.deleteButtons = document.querySelectorAll('.minus-vala-class');
    this.priceElements = document.querySelectorAll('.price');
    this.numberInputs = document.querySelectorAll('.quantity__input');
    this.totalPriceElement = document.querySelector('.total_price');
    this.productIds = Array.from(document.querySelectorAll('.id_selector')).map((elem) => parseInt(elem.dataset.p_id));
    this.prices = Array.from(this.priceElements).map((priceElement) => this.extractPrice(priceElement.innerText));
    this.loader = document.querySelector('.loader');
    this.loader2 = document.querySelector('.discount_loader');
    this.discountElement = document.querySelector('.total_discounts');
  }

  extractPrice(priceString) {
    return parseFloat(priceString.replace('Rs.', ''));
  }

  async fetchCartData() {
    try {
      const response = await fetch('/cart.js');
      const cartData = await response.json();
      if (cartData) {
        this.updateCartItems(cartData.items);
      }
    } catch (error) {
      console.error('Error fetching cart data:', error);
    }
  }

  async updateCartItem(productId, quantity) {
    try {
      this.showLoader();
      const data = await this.sendCartUpdateRequest(productId, quantity);
      this.hideLoader();
      if (data) {
        this.updateCartDisplay(data);
        console.log('Cart item updated:', data);
      }
    } catch (error) {
      console.error('Error updating cart item:', error);
    }
  }

  showLoader() {
    this.loader.style.display = 'block';
    this.totalPriceElement.style.display = 'none';
    if (this.loader2) {
      this.loader2.style.display = 'block';
    }
    if (this.discountElement) {
      this.discountElement.style.display = 'none';
    }
  }

  hideLoader() {
    this.loader.style.display = 'none';
    this.totalPriceElement.style.display = 'block';
    if (this.loader2) {
      this.loader2.style.display = 'none';
    }
    if (this.discountElement) {
      this.discountElement.style.display = 'block';
    }
  }

  async sendCartUpdateRequest(productId, quantity) {
    const response = await fetch(`/cart/update.js`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ updates: { [productId]: quantity } }),
    });
    return await response.json();
  }

  updateCartDisplay(data) {
    this.totalPriceElement.innerText = 'Rs. ' + (data.total_price / 100).toFixed(2);

    if (this.discountElement) {
      this.discountElement.innerText = 'Rs. ' + (data.total_discount / 100).toFixed(2);
    } else {
      console.warn('Discount element not found in the DOM.');
    }
  }

  updateCartItems(items) {
    items.forEach((item) => {
      const index = this.productIds.indexOf(item.variant_id);
      if (index !== -1) {
        this.updateQuantityDisplay(index, item.quantity);
        this.updatePriceDisplay(index, item.original_price);
        this.updateButtonDisplay(index, item.quantity);
      }
    });
  }

  updateQuantityDisplay(index, quantity) {
    this.numberInputs[index].value = quantity;
    this.numberInputs[index].setAttribute('value', quantity);
  }

  updatePriceDisplay(index, price) {
    let ogPrice = parseFloat(price / 100);
    this.priceElements[index].innerText = 'Rs. ' + ogPrice.toFixed(2);
  }

  updateButtonDisplay(index, quantity) {
    if (quantity <= 1) {
      this.minusButtons[index].style.display = 'none';
      this.minusButtons[index].disabled = true;
      this.minusButtons[index].style.cursor = 'not-allowed';
      this.deleteButtons[index].style.display = 'flex';
      this.deleteButtons[index].style.alignItems = 'center';
    }
  }

  init() {
    this.plusButtons.forEach((plus, index) => {
      plus.addEventListener('click', () => {
        this.onPlusButtonClick(index);
      });
    });

    this.minusButtons.forEach((minus, index) => {
      minus.addEventListener('click', () => {
        this.onMinusButtonClick(index);
      });
    });

    const checkoutButton = document.getElementById('checkout');
    if (checkoutButton) {
      checkoutButton.addEventListener('click', () => {
        if (!checkoutButton.hasAttribute('disabled')) {
          window.location.href = '/checkout'; // Replace '/checkout' with the appropriate Shopify checkout URL
        }
      });
    }
  }

  initRemoveButtons() {
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
          const data = await response.json();
          console.log('Cart item deleted:', data);

          if (response.ok) {
            button.closest('tr').remove(); // Remove the item from the UI

            let total = parseFloat(data.total_price / 100);
            let discount = parseFloat(data.total_discount / 100);

            // Update total price in the UI

            if (this.discountElement) {
              this.discountElement.innerText = 'Rs. ' + discount.toFixed(2);
            }
            this.totalPriceElement.innerText = 'Rs. ' + total.toFixed(2);
            if (data.items.length === 0) {
              location.reload(); // Reload the page if the cart is empty
            }
          } else {
            alert('Failed to remove item from cart. Please try again.');
          }
        } catch (error) {
          alert('Something went wrong! Try again later.');
        }
      });
    });
  }

  onPlusButtonClick(index) {
    this.deleteButtons[index].style.display = 'none';
    this.numberInputs[index].value++;
    this.numberInputs[index].setAttribute('value', this.numberInputs[index].value);
    this.updateCartItem(this.productIds[index], parseInt(this.numberInputs[index].value));

    // Display the minus button when the quantity is greater than 1
    if (this.numberInputs[index].value > 1) {
      this.minusButtons[index].style.display = 'block';
      this.minusButtons[index].disabled = false;
      this.minusButtons[index].style.cursor = 'pointer';
    }
  }

  onMinusButtonClick(index) {
    if (this.numberInputs[index].value > 1) {
      this.numberInputs[index].value--;
      this.numberInputs[index].setAttribute('value', this.numberInputs[index].value);
      this.updateCartItem(this.productIds[index], parseInt(this.numberInputs[index].value));
    }
    if (this.numberInputs[index].value <= 1) {
      this.numberInputs[index].value = 1;
      this.deleteButtons[index].style.display = 'flex';
      this.deleteButtons[index].style.alignItems = 'center';
      this.minusButtons[index].style.display = 'none';
      this.minusButtons[index].disabled = true;
      this.minusButtons[index].style.cursor = 'not-allowed';
    }
  }
}

document.addEventListener('DOMContentLoaded', async function () {
  const cartManager = new CartManager();
  cartManager.init();
});
