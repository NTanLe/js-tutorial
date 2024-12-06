// import { loadProductsFetch } from "./products"


// // const p = loadProductsFetch()
// // console.log(p)
// async function loadIM() {
//   await loadProductsFetch()

// }
// loadIM();
export const orders = (() => {
  try {
    return JSON.parse(localStorage.getItem('orders')) || [];
  } catch {
    return [];
  }
})();

export function addOrder(order) {
  orders.unshift(order);
  saveOrder();
}

function saveOrder() {
  localStorage.setItem('orders', JSON.stringify(orders));
}

console.log('Order saved to localStorage', orders);

function renderOrder(orders) {
  let orderHtml = '';
  orders.forEach((order) => {
    orderHtml += `
      <div class="order-container">
        <div class="order-header">
          <div class="order-header-left-section">
            <div class="order-date">
              <div class="order-header-label">Order Placed:</div>
              <div>${order.orderTime.split("T")[0]}</div>
            </div>
            <div class="order-total">
              <div class="order-header-label">Total:</div>
              <div>${order.totalCostCents}</div>
            </div>
          </div>
          <div class="order-header-right-section">
            <div class="order-header-label">Order ID:</div>
            <div>${order.id}</div>
          </div>
        </div>
        <div class="order-details-grid">
          ${order.products.map((product) => `
            <div class="product-image-container">
              <img src="images/products/${product.productId}.jpg" alt="Product Image">
            </div>
            <div class="product-details">
              <div class="product-name">
                Product ID: ${product.productId}
              </div>
              <div class="product-delivery-date">
                Arriving on: ${product.estimatedDeliveryTime.split("T")[0]}
              </div>
              <div class="product-quantity">
                Quantity: ${product.quantity}
              </div>
            </div>
          `).join('')}
        </div>
      </div>
    `;
  });

  document.querySelector('.js-orders-grid').innerHTML = orderHtml;
}

document.addEventListener('DOMContentLoaded', () => {
  console.log("aa")
  renderOrder(orders);
});