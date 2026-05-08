// Cart utility functions
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCartStorage(productId, size) {
    let cart = getCart();
    cart.push({ productId: parseInt(productId), size });
    saveCart(cart);
}