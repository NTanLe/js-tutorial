import { formatMoney } from "./utils/money.js";
import dayjs from 'https://unpkg.com/dayjs@1.11.10/esm/index.js';
import { deliveryOptions } from "../data/deliveryOptions.js";
import { cart } from '../data/cart-oop.js'
import { products, loadProductsFetch, loadProducts } from "../data/products.js";
import { loadCart } from "../data/cart-oop.js";
import { addOrder } from "../data/order.js";
// import "../data/practice.js"

// loadProducts(() => {
//   loadCart(() => {
//     renderPayment();
//     renderOrderDelivery();
//   });

// })

// new Promise((resolve) => {
//   loadProducts(() => {
//     resolve();
//   })
// }).then(() => {
//   return new Promise((resolve) => {
//     loadCart(() => {
//       resolve();
//     })
//   })
// }).then(() => {
//   renderPayment();
//   renderOrderDelivery();
// })

// Promise.all([
//   loadProductsFetch(),
//   new Promise((resolve) => {
//     loadCart(() => {
//       resolve();
//     });
//   })
// ])
//   .then(() => {
//     renderPayment();
//     renderOrderDelivery();
//   })
//   .catch((error) => {
//     console.error("Error in loading products or cart:", error);
//   });
async function loadPage() {
  await loadProductsFetch()
  await new Promise((resolve) => {
    loadCart(() => {
      resolve()
    });
  });
  renderPayment();
  renderOrderDelivery();
}
loadPage();
function renderOrderDelivery() {
  let cartSummaryHTML = '';
  cart.cartItems.forEach((item) => {
    const productId = item.productId;

    let matchingProduct;
    products.forEach((product) => {
      if (productId === product.id) {
        matchingProduct = product;
      }
    });

    const deliveryOptionId = item.deliveryOptionId;
    let deliveryOption;
    let dateString;
    deliveryOptions.forEach((option) => {
      if (option.id === deliveryOptionId) {
        deliveryOption = option;
        const today = dayjs();
        const deliveryDate = today.add(
          deliveryOption.deliveryDays, 'days'
        );
        dateString = deliveryDate.format(
          'dddd, MMMM D'
        );
      }
    });

    cartSummaryHTML += `
            <div class="cart-item-container js-cart-item-container-${matchingProduct.id}">
                <div class="delivery-date">
                  Delivery date: ${dateString}
                </div>
    
                <div class="cart-item-details-grid">
                  <img class="product-image"
                    src="${matchingProduct.image}">
    
                  <div class="cart-item-details">
                    <div class="product-name">
                      ${matchingProduct.name}
                    </div>
                    <div class="product-price">
                      $${formatMoney(matchingProduct.priceCents)}
                    </div>
                    <div class="product-quantity">
                      <span>
                       Quantity: <span class="quantity-label js-quantity-label-${matchingProduct.id}">${item.quantity}</span>
                      </span>
                      <span class="update-quantity-link link-primary js-update-link" data-product-id="${matchingProduct.id}">
                        Update
                      </span>
                      <input class="quantity-input js-quantity-input-${matchingProduct.id}">
                      <span class="save-quantity-link link-primary js-save-link"
                          data-product-id="${matchingProduct.id}">
                          Save
                      </span>
                      <span class="delete-quantity-link link-primary js-delete-link" data-product-id="${matchingProduct.id}">
                        Delete
                      </span>
                    </div>
                  </div>
    
                  <div class="delivery-options">
                    <div class="delivery-options-title">
                      Choose a delivery option:
                    </div>
                    ${deliveryOptionsHTML(matchingProduct, item)}
                  </div>
                </div>
              </div>
        `;
  });

  function deliveryOptionsHTML(matchingProduct, item) {
    let html = '';
    deliveryOptions.forEach((deliveryOption) => {
      const today = dayjs();
      const deliveryDate = today.add(
        deliveryOption.deliveryDays, 'days'
      );
      const dateString = deliveryDate.format(
        'dddd, MMMM D'
      );
      const priceString = deliveryOption.priceCents === 0 ? 'FREE Shipping' : `$${formatMoney((deliveryOption.priceCents))} - `;
      const isChecked = deliveryOption.id === item.deliveryOptionId;
      html += `
                <div class="delivery-option js-delivery-option" data-product-id="${matchingProduct.id}"
                data-delivery-option-id="${deliveryOption.id}">
                  <input type="radio"
                  ${isChecked ? 'checked' : ''}
                    class="delivery-option-input"
                    name="delivery-option-${matchingProduct.id}">
                  <div>
                    <div class="delivery-option-date">
                      ${dateString}
                    </div>
                    <div class="delivery-option-price">
                      ${priceString} Shipping
                    </div>
                  </div> 
                </div>
            `;
    });
    return html;
  }

  document.querySelector('.js-order-summary').innerHTML = cartSummaryHTML;

  document.querySelectorAll('.js-delete-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      cart.removeFromCart(productId);

      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      container.remove();
      updateCart();
      renderPayment();
    });
  });

  function updateCart() {
    let cartQ = 0;

    cart.cartItems.forEach((cartItem) => {
      cartQ += 1;
    });
    document.querySelector('.js-return-to-home-link')
      .innerHTML = `${cartQ} items`;
  }

  updateCart();

  document.querySelectorAll('.js-update-link').forEach((link) => {
    link.addEventListener('click', () => {
      const productId = link.dataset.productId;
      const container = document.querySelector(
        `.js-cart-item-container-${productId}`
      );
      container.classList.add('is-editing-quantity');
    });
  });

  document.querySelectorAll('.js-save-link')
    .forEach((link) => {
      link.addEventListener('click', () => {
        const productId = link.dataset.productId;

        const container = document.querySelector(
          `.js-cart-item-container-${productId}`
        );
        container.classList.remove('is-editing-quantity');
        const quantityInput = document.querySelector(
          `.js-quantity-input-${productId}`
        );
        const newQuantity = Number(quantityInput.value);
        if (newQuantity <= 0 || newQuantity >= 1000) {
          alert('Quantity must be at least 1 and less than 1000');
          return;
        }

        cart.updateQuantity(productId, newQuantity);
        renderPayment();
        const quantityLabel = document.querySelector(
          `.js-quantity-label-${productId}`
        );
        quantityLabel.innerHTML = newQuantity;

        cart.updateCartQuantity();

        cart.saveToStorage();
      });
    });

  document.querySelectorAll('.js-delivery-option').forEach((element) => {
    element.addEventListener('click', () => {
      const productId = element.dataset.productId;
      const deliveryOptionId = element.dataset.deliveryOptionId;
      cart.updateDeliveryOption(productId, deliveryOptionId);
      cart.saveToStorage();
      renderOrderDelivery();
      renderPayment();
    });
  });
}

function renderPayment() {
  let productPriceCents = 0;
  let shippingPriceCents = 0;
  let cartQuantity = 0;

  cart.cartItems.forEach((cartItem) => {
    cartQuantity += cartItem.quantity;
  });

  cart.cartItems.forEach((item) => {
    const productId = item.productId;
    let matchingProduct;
    products.forEach((product) => {
      if (productId === product.id) {
        matchingProduct = product;
      }
    });

    productPriceCents += matchingProduct.priceCents * item.quantity;

    let deliveryOption;
    const deliveryOptionId = item.deliveryOptionId;
    deliveryOptions.forEach((option) => {
      if (option.id === deliveryOptionId) {
        deliveryOption = option;
      }
    });
    shippingPriceCents += deliveryOption.priceCents;
  });

  const totalPriceNotTax = productPriceCents + shippingPriceCents;
  const tax = totalPriceNotTax * 0.1;
  const totalCents = totalPriceNotTax + tax;

  const summaryPaymentHTML =
    `
         <div class="payment-summary-title">
            Order Summary
          </div>

          <div class="payment-summary-row">
            <div>Items (${cartQuantity}):</div>
            <div class="payment-summary-money">${formatMoney(productPriceCents)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Shipping &amp; handling:</div>
            <div class="payment-summary-money">${formatMoney(shippingPriceCents)}</div>
          </div>

          <div class="payment-summary-row subtotal-row">
            <div>Total before tax:</div>
            <div class="payment-summary-money">${formatMoney(totalPriceNotTax)}</div>
          </div>

          <div class="payment-summary-row">
            <div>Estimated tax (10%):</div>
            <div class="payment-summary-money">${formatMoney(tax)}</div>
          </div>

          <div class="payment-summary-row total-row">
            <div>Order total:</div>
            <div class="payment-summary-money">${formatMoney(totalCents)}</div>
          </div>

          <button class="place-order-button button-primary js-place-order">
            Place your order
          </button>
        </div>
        `;
  document.querySelector('.js-payment-summary').innerHTML = summaryPaymentHTML;

  document.querySelector('.js-place-order').addEventListener('click', async () => {
    const response = await fetch('https://supersimplebackend.dev/orders', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        cart: cart
      }),
    })
    const order = await response.json();
    addOrder(order);
    window.location.href = 'orders.html';
  });
}

