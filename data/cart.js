export const cart = []
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
            quantity: quantity
        });
    }
}
export function updateCartQuantity(){
    let cartQuantity = 0;
    cart.forEach((item) => {
        cartQuantity += 1;
    });

    document.querySelector('.js-cart-quantity')
        .innerHTML = cartQuantity;

}