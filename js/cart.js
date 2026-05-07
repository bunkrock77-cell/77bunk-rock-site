function addToCart(productId, size) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    cart.push({ productId: parseInt(productId), size });
    localStorage.setItem('cart', JSON.stringify(cart));
}