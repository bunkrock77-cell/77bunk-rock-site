// Global variables
let allProducts = [];
let cart = [];
let currentCategory = 'all';

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    setupCategoryFilters();
    setupCartButton();
    setupBundleButtons();
    loadCart();
});

// Load products from JSON
function loadProducts() {
    fetch('data/products.json')
        .then(response => response.json())
        .then(products => {
            allProducts = products;
            displayProducts(allProducts);
        })
        .catch(error => console.error('Error loading products:', error));
}

// Display products
function displayProducts(products) {
    const container = document.getElementById('products-container');
    container.innerHTML = '';
    
    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.setAttribute('data-category', product.category);
        
        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}">
            <h4>${product.name}</h4>
            <p class="price">${product.price} RON / €${product.priceEur}</p>
            <p class="description">${product.description}</p>
            <button class="add-to-cart-btn" data-product-id="${product.id}" data-name="${product.name}" data-price="${product.price}">Add to Cart</button>
        `;
        
        container.appendChild(productCard);
    });
    
    // Attach event listeners to add to cart buttons
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            if (!btn.hasAttribute('data-price')) return; // Skip bundle buttons or invalid buttons
            const productId = btn.getAttribute('data-product-id');
            const name = btn.getAttribute('data-name');
            const price = parseFloat(btn.getAttribute('data-price'));
            addToCart(productId, name, price);
        });
    });
}

// Attach bundle button listeners
function setupBundleButtons() {
    document.querySelectorAll('.bundle-card .add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const productId = btn.getAttribute('data-product-id');
            const name = btn.getAttribute('data-name');
            const price = parseFloat(btn.getAttribute('data-price'));
            addToCart(productId, name, price);
        });
    });
}

// Setup category filters
function setupCategoryFilters() {
    document.querySelectorAll('.category-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            // Remove active class from all buttons
            document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
            // Add active class to clicked button
            btn.classList.add('active');
            
            currentCategory = btn.getAttribute('data-category');
            
            if (currentCategory === 'all') {
                displayProducts(allProducts);
            } else {
                const filtered = allProducts.filter(p => p.category === currentCategory);
                displayProducts(filtered);
            }
        });
    });
}

// Add to cart
function addToCart(productId, name, price) {
    // Check if product already in cart
    const existingItem = cart.find(item => item.productId === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            productId: productId,
            name: name,
            price: price,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartDisplay();
    updateCartCount();
    alert(name + ' added to cart!');
}

// Setup cart button
function setupCartButton() {
    document.getElementById('cart-btn').addEventListener('click', () => {
        document.getElementById('cart-sidebar').classList.toggle('open');
    });
    
    document.getElementById('close-cart').addEventListener('click', () => {
        document.getElementById('cart-sidebar').classList.remove('open');
    });
    
    document.getElementById('checkout-btn').addEventListener('click', () => {
        if (cart.length === 0) {
            alert('Your cart is empty!');
            return;
        }
        alert('Thank you for your purchase! Total: ' + calculateTotal().toFixed(2) + ' RON');
        cart = [];
        saveCart();
        updateCartDisplay();
        updateCartCount();
        document.getElementById('cart-sidebar').classList.remove('open');
    });
}

// Update cart display
function updateCartDisplay() {
    const container = document.getElementById('cart-items-container');
    container.innerHTML = '';
    
    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#999;">Your cart is empty</p>';
        return;
    }
    
    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-header">
                <div class="cart-item-name">${item.name}</div>
                <button class="cart-item-remove" data-index="${index}">Remove</button>
            </div>
            <div class="cart-item-price">${item.price} RON each</div>
            <div class="quantity-control">
                <button class="quantity-btn minus" data-index="${index}">−</button>
                <input type="number" class="quantity-input" value="${item.quantity}" data-index="${index}" min="1">
                <button class="quantity-btn plus" data-index="${index}">+</button>
            </div>
            <div style="margin-top: 8px; font-weight: bold;">Subtotal: ${(item.price * item.quantity).toFixed(2)} RON</div>
        `;
        
        container.appendChild(cartItem);
    });
    
    // Attach event listeners for quantity controls
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            if (cart[index].quantity > 1) {
                cart[index].quantity -= 1;
            } else {
                cart.splice(index, 1);
            }
            saveCart();
            updateCartDisplay();
            updateCartCount();
        });
    });
    
    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            cart[index].quantity += 1;
            saveCart();
            updateCartDisplay();
            updateCartCount();
        });
    });
    
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', (e) => {
            const index = e.target.getAttribute('data-index');
            const value = parseInt(e.target.value);
            if (value < 1) {
                cart.splice(index, 1);
            } else {
                cart[index].quantity = value;
            }
            saveCart();
            updateCartDisplay();
            updateCartCount();
        });
    });
    
    document.querySelectorAll('.cart-item-remove').forEach(btn => {
        btn.addEventListener('click', (e) => {
            const index = e.target.getAttribute('data-index');
            cart.splice(index, 1);
            saveCart();
            updateCartDisplay();
            updateCartCount();
        });
    });
    
    updateCartTotal();
}

// Update cart total
function updateCartTotal() {
    const total = calculateTotal();
    document.getElementById('cart-total-price').textContent = total.toFixed(2) + ' RON';
}

// Calculate cart total
function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Update cart count
function updateCartCount() {
    const count = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cart-count').textContent = count;
}

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Load cart from localStorage
function loadCart() {
    const saved = localStorage.getItem('cart');
    if (saved) {
        cart = JSON.parse(saved);
        updateCartCount();
    }
}
