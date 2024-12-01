export const cart = {
  cartItems: undefined,
  loadFromStorage() {
    const storedItems = JSON.parse(localStorage.getItem('cart-oop'));
    // console.log(storedItems)
    this.cartItems = storedItems || [{
      productId: 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
      quantity: 2,
      deliveryOptionId: '1'
    }];
  }
  ,
  saveToStorage() {
    localStorage.setItem('cart-oop', JSON.stringify(this.cartItems))
  },
  addToCart(productId) {
    let matchingItem;

    this.cartItems.forEach((item) => {
      if (productId === item.productId) {
        matchingItem = item;
      }
    });
    const quantitySelector = document.querySelector(`.js-quantity-selector-${productId}`);
    const quantity = Number(quantitySelector.value);
    if (matchingItem) {
      matchingItem.quantity += quantity;
    } else {
      this.cartItems.push({
        productId: productId,
        quantity: quantity,
        deliveryOptionId: '1'
      });
    }
    this.saveToStorage();
    console.log(cart)
  },

  updateCartQuantity() {
    let cartQuantity = 0;
    this.cartItems.forEach((item) => {
      cartQuantity += 1;
    });

    document.querySelector('.js-cart-quantity')
      .innerHTML = cartQuantity;

  },
  removeFromCart(productId) {
    const newCart = [];
    this.cartItems.forEach((item) => {
      if (item.productId !== productId) {
        newCart.push(item)
      }
    });
    this.cartItems = newCart;
    this.saveToStorage();
  },
  updateQuantity(productId, newQuantity) {
    let matchingItem;
    this.cartItems.forEach((cartItem) => {
      if (productId === cartItem.productId) {
        matchingItem = cartItem;
      }
    });

    matchingItem.quantity = newQuantity;
    if (matchingItem.quantity === 0) {
      this.removeFromCart(productId);
    }
    this.saveToStorage();
  },
  updateDeliveryOption(productId, deliveryOptionId) {
    let matchingItem;
    this.cartItems.forEach((cartItem) => {
      if (productId === cartItem.productId) {
        matchingItem = cartItem;
      }
    });
    matchingItem.deliveryOptionId = deliveryOptionId;
    this.saveToStorage();
  }
}
cart.loadFromStorage()


export function loadCart(fun) {
  const xhr = new XMLHttpRequest();
  xhr.addEventListener("load", () => {
    console.log(xhr.response);
    fun()
  });
  xhr.open('GET', 'https://supersimplebackend.dev/cart');
  xhr.send();

}
