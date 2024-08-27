export let cart = JSON.parse(localStorage.getItem('cart'))
     if(!cart){
         cart=  [{
             productId : 'e43638ce-6aa0-4b85-b27f-e1d07eb678c6',
             quantity:2,
             deliveryOptionId: '1'
         }]
     }

export function saveToStorage(){
    localStorage.setItem('cart',JSON.stringify(cart))
}

export function addToCart(productId){

    let matchingItem;

    cart.forEach((item) => {
        if (productId === item.productId) {
            matchingItem = item;
        }
    });
    const quantitySelector = document.querySelector(`.js-quantity-selector-${productId}`);
    const quantity = Number(quantitySelector.value);
    if (matchingItem) {
        matchingItem.quantity += quantity;
    } else {
        cart.push({
            productId: productId,
            quantity: quantity,
            deliveryOptionId: '1'
        });
    }
    saveToStorage();
}
export function updateCartQuantity(){
    let cartQuantity = 0;
    cart.forEach((item) => {
        cartQuantity += 1;
    });

    document.querySelector('.js-cart-quantity')
        .innerHTML = cartQuantity;

}
 export  function removeFromCart(productId){
    const newCart = [];
    cart.forEach((item)=>{
        if (item.productId !== productId){
            newCart.push(item)
        }
    });
    cart = newCart;
    saveToStorage()
}
export function updateQuantity(productId, newQuantity) {
    let matchingItem;
    cart.forEach((cartItem) => {
        if (productId === cartItem.productId) {
            matchingItem = cartItem;
        }
    });

    matchingItem.quantity = newQuantity;
    if (matchingItem.quantity === 0){
        removeFromCart();
    }
    saveToStorage();
}