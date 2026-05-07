// Load products on homepage
if (window.location.pathname.endsWith('index.html') || window.location.pathname === '/') {
    let allProducts = [];
    let currentCategory = 'all';

    fetch('data/products.json')
    .then(response => response.json())
    .then(products => {
        allProducts = products;
        displayProducts(products);
        updateCartCount();
    });

    function displayProducts(products) {
        const productGrid = document.getElementById('product-grid');
        productGrid.innerHTML = '';
        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.className = 'product';
            productDiv.innerHTML = `
                <img src="${product.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjUwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjUwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2NjYyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmaWxsPSIjMDAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zNWVtIj5Qcm9kdWN0IEltYWdlPC90ZXh0Pjwvc3ZnPg=='}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>$${product.price}</p>
            `;
            productDiv.addEventListener('click', () => {
                window.location.href = `product.html?id=${product.id}`;
            });
            productGrid.appendChild(productDiv);
        });
    }

    // Category filtering
    document.querySelectorAll('.category').forEach(cat => {
        cat.addEventListener('click', () => {
            currentCategory = cat.dataset.category;
            const filtered = currentCategory === 'all' ? allProducts : allProducts.filter(p => p.category === currentCategory);
            displayProducts(filtered);
        });
    });

    // Search functionality
    document.querySelector('.search button').addEventListener('click', () => {
        const query = document.querySelector('.search input').value.toLowerCase();
        const filtered = allProducts.filter(p => p.name.toLowerCase().includes(query));
        displayProducts(filtered);
    });

    // Cart button
    document.getElementById('cart-btn').addEventListener('click', () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        alert(`Cart: ${cart.length} items.`);
    });
}

// Load product details on product page
if (window.location.pathname.endsWith('product.html')) {
    const urlParams = new URLSearchParams(window.location.search);
    const id = urlParams.get('id');
    if (id) {
        fetch('data/products.json')
        .then(response => response.json())
        .then(products => {
            const product = products.find(p => p.id == id);
            if (product) {
                const detailSection = document.getElementById('product-detail');
                detailSection.innerHTML = `
                    <img src="${product.image || 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iNDAwIiBoZWlnaHQ9IjQwMCIgZmlsbD0iI2NjYyIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmaWxsPSIjMDAwIiB0ZXh0LWFuY2hvcj0ibWlkZGxlIiBkeT0iMC4zNWVtIj5Qcm9kdWN0IEltYWdlPC90ZXh0Pjwvc3ZnPg=='}" alt="${product.name}">
                    <h2>${product.name}</h2>
                    <p>${product.description}</p>
                    <p>Price: $${product.price}</p>
                    <label for="size">Size:</label>
                    <select id="size">
                        ${product.sizes.map(size => `<option value="${size}">${size}</option>`).join('')}
                    </select>
                    <button id="add-to-cart">Add to Cart</button>
                    <h3>Reviews</h3>
                    <div id="comments">
                        ${product.comments.map(comment => `<p>${comment}</p>`).join('')}
                    </div>
                `;
                document.getElementById('add-to-cart').addEventListener('click', () => {
                    const size = document.getElementById('size').value;
                    addToCart(product.id, size);
                    updateCartCount();
                    alert('Added to cart!');
                });
            }
        });
    }

    // Cart button
    document.getElementById('cart-btn').addEventListener('click', () => {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        alert(`Cart: ${cart.length} items.`);
    });
}

// Update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    document.getElementById('cart-count').textContent = cart.length;
}