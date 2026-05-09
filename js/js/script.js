
[
  {
    "id": "tshirt-black",
    "name": "Black T-Shirt",
    "category": "shirts-hoodies",
    "subCategory": "T-Shirts",
    "price": 30,
    "priceEur": 6,
    "images": ["images/placeholder-tshirt-1-front.jpg", "images/placeholder-tshirt-1-back.jpg"],
    "description": "Classic black t-shirt",
    "hasBackView": true
  },
  {
    "id": "tshirt-white",
    "name": "White T-Shirt",
    "category": "shirts-hoodies",
    "subCategory": "T-Shirts",
    "price": 30,
    "priceEur": 6,
    "images": ["images/placeholder-tshirt-2-front.jpg", "images/placeholder-tshirt-2-back.jpg"],
    "description": "Classic white t-shirt",
    "hasBackView": true
  },
  {
    "id": "tshirt-limited",
    "name": "I Can Flirt (Limited Edition)",
    "category": "shirts-hoodies",
    "subCategory": "T-Shirts",
    "price": 40,
    "priceEur": 8,
    "images": ["images/placeholder-tshirt-3-front.jpg", "images/placeholder-tshirt-3-back.jpg"],
    "description": "Limited Edition T-Shirt - back text: 'i can flirt but im afraid of women'",
    "hasBackView": true
  },
  {
    "id": "hoodie-black",
    "name": "Black Hoodie",
    "category": "shirts-hoodies",
    "subCategory": "Hoodies",
    "price": 40,
    "priceEur": 8,
    "images": ["images/placeholder-hoodie-1-front.jpg", "images/placeholder-hoodie-1-back.jpg"],
    "description": "Classic black hoodie",
    "hasBackView": true
  },
  {
    "id": "hoodie-white",
    "name": "White Hoodie",
    "category": "shirts-hoodies",
    "subCategory": "Hoodies",
    "price": 40,
    "priceEur": 8,
    "images": ["images/placeholder-hoodie-2-front.jpg", "images/placeholder-hoodie-2-back.jpg"],
    "description": "Classic white hoodie",
    "hasBackView": true
  },
  {
    "id": "hoodie-limited",
    "name": "Flirt Master Hoodie (Limited Edition)",
    "category": "shirts-hoodies",
    "subCategory": "Hoodies",
    "price": 50,
    "priceEur": 10,
    "images": ["images/placeholder-hoodie-3-front.jpg", "images/placeholder-hoodie-3-back.jpg"],
    "description": "Limited Edition Hoodie - back text: 'i can flirt but im afraid of women'",
    "hasBackView": true
  },
  {
    "id": "shorts-1",
    "name": "Classic Shorts",
    "category": "pants",
    "subCategory": "Short Pants",
    "price": 35,
    "priceEur": 7,
    "images": ["images/placeholder-shorts-1.jpg"],
    "description": "Comfortable classic shorts",
    "hasBackView": false
  },
  {
    "id": "shorts-2",
    "name": "Cargo Shorts",
    "category": "pants",
    "subCategory": "Short Pants",
    "price": 35,
    "priceEur": 7,
    "images": ["images/placeholder-shorts-2.jpg"],
    "description": "Practical cargo shorts with pockets",
    "hasBackView": false
  },
  {
    "id": "shorts-custom",
    "name": "Custom Shorts (Limited)",
    "category": "pants",
    "subCategory": "Short Pants",
    "price": 45,
    "priceEur": 9,
    "images": ["images/placeholder-shorts-3.jpg"],
    "description": "Limited edition custom shorts",
    "hasBackView": false
  },
  {
    "id": "pants-casual",
    "name": "Casual Pants",
    "category": "pants",
    "subCategory": "Long Pants",
    "price": 35,
    "priceEur": 7,
    "images": ["images/placeholder-pants-1.jpg"],
    "description": "Comfortable casual pants",
    "hasBackView": false
  },
  {
    "id": "pants-slim",
    "name": "Slim Fit Pants",
    "category": "pants",
    "subCategory": "Long Pants",
    "price": 35,
    "priceEur": 7,
    "images": ["images/placeholder-pants-2.jpg"],
    "description": "Modern slim fit pants",
    "hasBackView": false
  },
  {
    "id": "pants-tapered",
    "name": "Tapered Pants",
    "category": "pants",
    "subCategory": "Long Pants",
    "price": 35,
    "priceEur": 7,
    "images": ["images/placeholder-pants-3.jpg"],
    "description": "Stylish tapered pants",
    "hasBackView": false
  },
  {
    "id": "ring-classic",
    "name": "Silver Ring",
    "category": "accessories",
    "subCategory": "Accessories",
    "price": 20,
    "priceEur": 4,
    "images": ["images/placeholder-accessory-1.jpg"],
    "description": "Classic silver ring",
    "hasBackView": false
  },
  {
    "id": "chain",
    "name": "Chain Accessory (Add to Pants)",
    "category": "accessories",
    "subCategory": "Accessories",
    "price": 25,
    "priceEur": 5,
    "images": ["images/placeholder-accessory-2.jpg"],
    "description": "Chain that attaches to pants side",
    "hasBackView": false
  },
  {
    "id": "chain-premium",
    "name": "Premium Chain (Add to Pants)",
    "category": "accessories",
    "subCategory": "Accessories",
    "price": 30,
    "priceEur": 6,
    "images": ["images/placeholder-accessory-3.jpg"],
    "description": "Premium quality chain for pants",
    "hasBackView": false
  }
]

// Load products and render
let cart = [];
let products = [];

// Load products from JSON
fetch('products.json')
  .then(response => response.json())
  .then(data => {
    products = data;
    renderProducts('all');
  });

// Category filtering
document.querySelectorAll('.category-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.category-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    const category = btn.getAttribute('data-category');
    renderProducts(category);
  });
});

// Render products with slideshow
function renderProducts(category) {
  const container = document.getElementById('products-container');
  container.innerHTML = '';

  const filteredProducts = category === 'all'
    ? products
    : products.filter(p => p.category === category);

  // Group by subcategory
  const grouped = {};
  filteredProducts.forEach(product => {
    if (!grouped[product.subCategory]) {
      grouped[product.subCategory] = [];
    }
    grouped[product.subCategory].push(product);
  });

  // Render each group
  Object.keys(grouped).forEach(subCategory => {
    const row = document.createElement('div');
    row.className = 'product-row';

    row.innerHTML = `
      <div class="row-label">${subCategory}</div>
      <div class="row-cards">
        ${grouped[subCategory].map(product => createProductCard(product)).join('')}
      </div>
    `;

    container.appendChild(row);
  });

  // Add event listeners for add to cart buttons
  document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const productId = e.target.getAttribute('data-product-id');
      const sizeSelect = e.target.parentElement.querySelector('.size-select');
      const size = sizeSelect ? sizeSelect.value : null;
      addToCart(productId, size);
    });
  });
}

// Create product card HTML with slideshow
function createProductCard(product) {
  const needsSize = product.category === 'shirts-hoodies' || product.category === 'pants';
  const hasMultipleImages = product.images.length > 1;

  return `
    <div class="product-card">
      <div class="slideshow-container" data-product-id="${product.id}">
        ${product.images.map((img, index) => `
          <div class="slide ${index === 0 ? 'active' : ''}" data-slide-index="${index}">
            <img src="${img}" alt="${product.name}">
          </div>
        `).join('')}

        ${hasMultipleImages ? `
          <button class="slide-btn prev-btn" onclick="changeSlide('${product.id}', -1)">‹</button>
          <button class="slide-btn next-btn" onclick="changeSlide('${product.id}', 1)">›</button>

          <div class="slide-dots">
            ${product.images.map((_, index) => `
              <span class="dot ${index === 0 ? 'active' : ''}" onclick="goToSlide('${product.id}', ${index})"></span>
            `).join('')}
          </div>

          ${product.hasBackView ? `
            <div class="view-badge">FRONT</div>
          ` : ''}
        ` : ''}
      </div>

      <h4>${product.name}</h4>
      <p class="price">${product.price} RON / €${product.priceEur}</p>
      <p class="description">${product.description}</p>

      ${needsSize ? `
        <label class="size-label">Select Size:</label>
        <select class="size-select">
          <option value="XS">XS</option>
          <option value="S">S</option>
          <option value="M" selected>M</option>
          <option value="L">L</option>
          <option value="XL">XL</option>
          <option value="XXL">XXL</option>
        </select>
      ` : ''}

      <button class="add-to-cart-btn" data-product-id="${product.id}" data-price="${product.price}" data-price-eur="${product.priceEur}" data-name="${product.name}">
        Add to Cart
      </button>
    </div>
  `;
}

// Change slide
function changeSlide(productId, direction) {
  const container = document.querySelector(`.slideshow-container[data-product-id="${productId}"]`);
  const slides = container.querySelectorAll('.slide');
  const dots = container.querySelectorAll('.dot');
  const badge = container.querySelector('.view-badge');

  let currentIndex = 0;
  slides.forEach((slide, index) => {
    if (slide.classList.contains('active')) {
      currentIndex = index;
    }
  });

  // Remove active class
  slides[currentIndex].classList.remove('active');
  dots[currentIndex].classList.remove('active');

  // Calculate new index
  let newIndex = currentIndex + direction;
  if (newIndex >= slides.length) newIndex = 0;
  if (newIndex < 0) newIndex = slides.length - 1;

  // Add active class
  slides[newIndex].classList.add('active');
  dots[newIndex].classList.add('active');

  // Update badge
  if (badge) {
    badge.textContent = newIndex === 0 ? 'FRONT' : 'BACK';
  }
}

// Go to specific slide
function goToSlide(productId, slideIndex) {
  const container = document.querySelector(`.slideshow-container[data-product-id="${productId}"]`);
  const slides = container.querySelectorAll('.slide');
  const dots = container.querySelectorAll('.dot');
  const badge = container.querySelector('.view-badge');

  // Remove all active classes
  slides.forEach(slide => slide.classList.remove('active'));
  dots.forEach(dot => dot.classList.remove('active'));

  // Add active to selected
  slides[slideIndex].classList.add('active');
  dots[slideIndex].classList.add('active');

  // Update badge
  if (badge) {
    badge.textContent = slideIndex === 0 ? 'FRONT' : 'BACK';
  }
}

// Cart functionality
function addToCart(productId, size) {
  const product = products.find(p => p.id === productId);

  // Handle bundles
  if (productId.startsWith('bundle-')) {
    const bundleBtn = document.querySelector(`[data-product-id="${productId}"]`);
    const name = bundleBtn.getAttribute('data-name');
    const price = parseFloat(bundleBtn.getAttribute('data-price'));
    const priceEur = parseFloat(bundleBtn.getAttribute('data-price-eur'));

    const existingItem = cart.find(item => item.id === productId);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ id: productId, name, price, priceEur, quantity: 1 });
    }
  } else if (product) {
    const existingItem = cart.find(item => item.id === productId && item.size === size);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({
        id: productId,
        name: product.name,
        price: product.price,
        priceEur: product.priceEur,
        quantity: 1,
        size: size
      });
    }
  }

  updateCart();
}

function removeFromCart(index) {
  cart.splice(index, 1);
  updateCart();
}

function updateQuantity(index, newQuantity) {
  if (newQuantity < 1) return;
  cart[index].quantity = newQuantity;
  updateCart();
}

function updateCart() {
  const cartCount = document.getElementById('cart-count');
  const cartItemsContainer = document.getElementById('cart-items-container');
  const cartTotalPrice = document.getElementById('cart-total-price');
  const cartTotalPriceEur = document.getElementById('cart-total-price-eur');

  // Update count
  const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCount.textContent = totalItems;

  // Update items
  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p style="color: #b8c1dd; text-align: center; margin-top: 20px;">Your cart is empty</p>';
  } else {
    cartItemsContainer.innerHTML = cart.map((item, index) => `
      <div class="cart-item">
        <div class="cart-item-header">
          <strong style="color: #fff;">${item.name}</strong>
          <button class="cart-item-remove" onclick="removeFromCart(${index})">Remove</button>
        </div>
        ${item.size ? `<div class="cart-item-meta">Size: ${item.size}</div>` : ''}
        <div class="cart-item-price">${item.price} RON / €${item.priceEur}</div>
        <div class="quantity-control">
          <button class="quantity-btn" onclick="updateQuantity(${index}, ${item.quantity - 1})">-</button>
          <input type="number" class="quantity-input" value="${item.quantity}" onchange="updateQuantity(${index}, parseInt(this.value) || 1)">
          <button class="quantity-btn" onclick="updateQuantity(${index}, ${item.quantity + 1})">+</button>
        </div>
        <div class="cart-item-subtotal">Subtotal: ${item.price * item.quantity} RON / €${item.priceEur * item.quantity}</div>
      </div>
    `).join('');
  }

  // Update total
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  const totalEur = cart.reduce((sum, item) => sum + (item.priceEur * item.quantity), 0);
  cartTotalPrice.textContent = `${total.toFixed(2)} RON`;
  cartTotalPriceEur.textContent = `€${totalEur.toFixed(2)}`;
}

// Cart sidebar toggle
document.getElementById('cart-btn').addEventListener('click', () => {
  document.getElementById('cart-sidebar').classList.add('open');
});

document.getElementById('close-cart').addEventListener('click', () => {
  document.getElementById('cart-sidebar').classList.remove('open');
});

// Checkout button
document.getElementById('checkout-btn').addEventListener('click', () => {
  if (cart.length === 0) {
    alert('Your cart is empty!');
    return;
  }
  alert('Checkout functionality coming soon!');
});