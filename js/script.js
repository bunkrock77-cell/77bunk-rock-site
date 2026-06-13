// Global variables
let allProducts = [];
let cart = [];
let currentCategory = 'all';
let slidesState = {};
const ADMIN_PASSWORD = 'MakingCodesH112'; // change this to your secret (client-side fallback). When deploying the server set the server's ADMIN_PASSWORD env var to the same secret.
let slidesTimers = {};
let slidesPausedUntil = {};

function startAutoAdvance(id, length, interval = 4000) {
    stopAutoAdvance(id);
    slidesTimers[id] = setInterval(() => {
        const now = Date.now();
        if (slidesPausedUntil[id] && now < slidesPausedUntil[id]) return; // paused
        const current = slidesState[id] || 0;
        const next = (current + 1) % length;
        // find the correct container for either normal or modal slides
        const container = document.querySelector(`#slideshow-${id}`) || document.querySelector(`#modal-slideshow-${String(id).replace('modal-','')}`);
        if (!container) return;
        const slides = container.querySelectorAll('.slide');
        const dots = container.querySelectorAll('.dot');
        if (!slides.length) return;
        slides.forEach(sl => sl.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        const idx = next;
        if (slides[idx]) slides[idx].classList.add('active');
        if (dots[idx]) dots[idx].classList.add('active');
        slidesState[id] = idx;
    }, interval);
}

function stopAutoAdvance(id) {
    if (slidesTimers[id]) {
        clearInterval(slidesTimers[id]);
        delete slidesTimers[id];
    }
}

function pauseAutoAdvance(id, ms = 10000) {
    slidesPausedUntil[id] = Date.now() + ms;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', () => {
    loadProducts();
    setupCategoryFilters();
    setupCartButton();
    setupBundleButtons();
    loadCart();
    setupAboutLink();
});

function setupAboutLink() {
    const about = document.getElementById('about-link');
    if (!about) return;
    about.addEventListener('click', (e) => {
        e.preventDefault();
        alert("About Us: We're two 14-year-old friends who dream of starting a kids' clothing brand — creating fun, comfy pieces that reflect our creativity and dreams.");
    });
}

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
    
    const rowOrder = [
        'T-Shirts',
        'Hoodies',
        'Short Pants',
        'Long Pants',
        'Accessories'
    ];
    
    const grouped = products.reduce((groups, product) => {
        const key = product.subCategory || 'Others';
        if (!groups[key]) groups[key] = [];
        groups[key].push(product);
        return groups;
    }, {});

    rowOrder.forEach(rowKey => {
        if (!grouped[rowKey] || grouped[rowKey].length === 0) return;

        const row = document.createElement('div');
        row.className = 'product-row';

        const label = document.createElement('div');
        label.className = 'row-label';
        label.textContent = rowKey;

        const rowCards = document.createElement('div');
        rowCards.className = 'row-cards';

        grouped[rowKey].forEach(product => {
            const productCard = document.createElement('div');
            productCard.className = 'product-card';

            // Build slideshow markup using product.images (fallback to single image)
            const images = Array.isArray(product.images) && product.images.length ? product.images : [(product.image || 'images/placeholder.png')];
            let slidesHtml = `<div class="slideshow-container" id="slideshow-${product.id}">`;
            images.forEach((src, idx) => {
                slidesHtml += `\n  <div class="slide" data-index="${idx}">\n    <img src="${src}" alt="${product.name} view ${idx+1}">\n  </div>`;
            });
            slidesHtml += `\n  <button class="slide-btn prev-btn" data-product="${product.id}">‹</button>`;
            slidesHtml += `\n  <button class="slide-btn next-btn" data-product="${product.id}">›</button>`;
            slidesHtml += `\n  <div class="slide-dots">`;
            images.forEach((_, idx) => {
                slidesHtml += `<div class="dot" data-product="${product.id}" data-index="${idx}"></div>`;
            });
            slidesHtml += `</div></div>`;

            productCard.innerHTML = `
                ${slidesHtml}
                <h4>${product.name}</h4>
                <p class="price">${product.price} RON / €${product.priceEur}</p>
                <p class="description">${product.description}</p>
                <label class="size-label" for="size-${product.id}">Size</label>
                <select class="size-select" id="size-${product.id}" data-product-id="${product.id}">
                    <option value="M">M</option>
                    <option value="L">L</option>
                    <option value="S">S</option>
                    <option value="XL">XL</option>
                    <option value="One Size">One Size</option>
                </select>
                <button class="add-to-cart-btn" data-product-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-price-eur="${product.priceEur}">Add to Cart</button>
            `;

            // initialize slideshow state
            slidesState[product.id] = 0;
            rowCards.appendChild(productCard);
            
                // Attach slideshow handlers
                const slideshow = productCard.querySelector(`#slideshow-${product.id}`);
                if (slideshow) {
                    const showSlide = (id, index) => {
                        const s = document.querySelectorAll(`#slideshow-${id} .slide`);
                        const dots = document.querySelectorAll(`#slideshow-${id} .dot`);
                        s.forEach(sl => sl.classList.remove('active'));
                        dots.forEach(d => d.classList.remove('active'));
                        if (s[index]) s[index].classList.add('active');
                        if (dots[index]) dots[index].classList.add('active');
                        slidesState[id] = index;
                    };

                    const prev = productCard.querySelector('.prev-btn');
                    const next = productCard.querySelector('.next-btn');
                    prev.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const id = prev.getAttribute('data-product');
                        const nextIndex = (slidesState[id] - 1 + images.length) % images.length;
                        showSlide(id, nextIndex);
                        pauseAutoAdvance(id);
                    });
                    next.addEventListener('click', (e) => {
                        e.stopPropagation();
                        const id = next.getAttribute('data-product');
                        const nextIndex = (slidesState[id] + 1) % images.length;
                        showSlide(id, nextIndex);
                        pauseAutoAdvance(id);
                    });

                    productCard.querySelectorAll('.dot').forEach(dot => {
                        dot.addEventListener('click', (e) => {
                            e.stopPropagation();
                            const id = dot.getAttribute('data-product');
                            const idx = parseInt(dot.getAttribute('data-index'));
                            showSlide(id, idx);
                            pauseAutoAdvance(id);
                        });
                    });

                    // show initial
                    showSlide(product.id, 0);
                    // add touch swipe support
                    let touchStartX = 0;
                    let touchEndX = 0;
                    slideshow.addEventListener('touchstart', (ev) => {
                        touchStartX = ev.changedTouches[0].screenX;
                        pauseAutoAdvance(product.id);
                    }, {passive:true});
                    slideshow.addEventListener('touchend', (ev) => {
                        touchEndX = ev.changedTouches[0].screenX;
                        const diff = touchStartX - touchEndX;
                        const threshold = 40; // px
                        if (Math.abs(diff) > threshold) {
                            if (diff > 0) { // swipe left -> next
                                const nextIndex = (slidesState[product.id] + 1) % images.length;
                                showSlide(product.id, nextIndex);
                            } else { // swipe right -> prev
                                const prevIndex = (slidesState[product.id] - 1 + images.length) % images.length;
                                showSlide(product.id, prevIndex);
                            }
                            pauseAutoAdvance(product.id);
                        }
                    }, {passive:true});
                    // start auto-advance
                    startAutoAdvance(product.id, images.length);
                }
        });

        row.appendChild(label);
        row.appendChild(rowCards);
        container.appendChild(row);
    });
    
    document.querySelectorAll('.product-card .add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            if (!btn.hasAttribute('data-price')) return;
            const productId = btn.getAttribute('data-product-id');
            const name = btn.getAttribute('data-name');
            const price = parseFloat(btn.getAttribute('data-price'));
            const priceEur = parseFloat(btn.getAttribute('data-price-eur')) || (price / 5);
            let size = 'One Size';

            const sizeSelect = document.querySelector(`.size-select[data-product-id="${productId}"]`);
            if (sizeSelect) {
                size = sizeSelect.value;
            }

            addToCart(productId, name, price, priceEur, size);
        });
    });
}

// PRODUCT MODAL: open when clicking a product card
document.addEventListener('click', (e) => {
    const card = e.target.closest('.product-card');
    if (!card) return;
    // ignore clicks on buttons/inputs inside the card
    if (e.target.closest('button') || e.target.closest('select') || e.target.closest('.slide-btn') ) return;
    // find product id from size-select or add-to-cart-btn data
    const sizeSelect = card.querySelector('.size-select');
    const pid = sizeSelect ? sizeSelect.getAttribute('data-product-id') : null;
    if (pid) openProductModal(pid);
});

function openProductModal(productId) {
    const product = allProducts.find(p => String(p.id) === String(productId));
    if (!product) return;
    const modal = document.getElementById('product-modal');
    const body = document.getElementById('product-modal-body');
    const images = Array.isArray(product.images) && product.images.length ? product.images : [(product.image || 'images/placeholder.png')];
    let html = `
        <div style="display:flex; gap:18px; flex-wrap:wrap; align-items:flex-start;">
            <div style="flex:1; min-width:320px;">
                <div class="slideshow-container" id="modal-slideshow-${product.id}">`;
    images.forEach((src, idx) => {
        html += `\n  <div class="slide" data-index="${idx}">\n    <img src="${src}" alt="${product.name} view ${idx+1}">\n  </div>`;
    });
    html += `\n  <button class="slide-btn prev-btn" data-product="modal-${product.id}">‹</button>`;
    html += `\n  <button class="slide-btn next-btn" data-product="modal-${product.id}">›</button>`;
    html += `\n  <div class="slide-dots">`;
    images.forEach((_, idx) => { html += `<div class="dot" data-product="modal-${product.id}" data-index="${idx}"></div>`; });
    html += `</div></div>`;

    html += `</div>
            <div style="flex:1; min-width:260px;">
                <h2>${product.name}</h2>
                <p class="price">${product.price} RON / €${product.priceEur}</p>
                <p>${product.description}</p>
                <div>
                    <label class="size-label">Size</label>
                    <select class="size-select" id="modal-size-${product.id}">
                        <option>M</option><option>L</option><option>S</option><option>XL</option><option>One Size</option>
                    </select>
                </div>
                <button class="add-to-cart-btn" id="modal-add-${product.id}" data-product-id="${product.id}" data-name="${product.name}" data-price="${product.price}" data-price-eur="${product.priceEur}">Add to Cart</button>
                <hr>
                <h3>Comments</h3>
                <div id="comments-${product.id}" class="comments-list"></div>
                <form id="comment-form-${product.id}">
                    <textarea id="comment-text-${product.id}" placeholder="Write your comment" required></textarea>
                    <button type="submit" class="add-to-cart-btn">Post Comment</button>
                </form>
            </div>
        </div>`;

    body.innerHTML = html;

    // show modal
    modal.classList.add('open');

    // init modal slideshow
    const modalSlideshow = document.getElementById(`modal-slideshow-${product.id}`);
    slidesState[`modal-${product.id}`] = 0;
    const showModalSlide = (id, index) => {
        const s = document.querySelectorAll(`#modal-slideshow-${product.id} .slide`);
        const dots = document.querySelectorAll(`#modal-slideshow-${product.id} .dot`);
        s.forEach(sl => sl.classList.remove('active'));
        dots.forEach(d => d.classList.remove('active'));
        if (s[index]) s[index].classList.add('active');
        if (dots[index]) dots[index].classList.add('active');
        slidesState[id] = index;
    };
    showModalSlide(`modal-${product.id}`, 0);
    modalSlideshow.querySelector('.prev-btn').addEventListener('click', (e) => { e.stopPropagation(); const id = `modal-${product.id}`; const prevIndex = (slidesState[id] - 1 + images.length) % images.length; showModalSlide(id, prevIndex); pauseAutoAdvance(id); });
    modalSlideshow.querySelector('.next-btn').addEventListener('click', (e) => { e.stopPropagation(); const id = `modal-${product.id}`; const nextIndex = (slidesState[id] + 1) % images.length; showModalSlide(id, nextIndex); pauseAutoAdvance(id); });
    modalSlideshow.querySelectorAll('.dot').forEach(dot => dot.addEventListener('click', (e) => { e.stopPropagation(); const idx = parseInt(dot.getAttribute('data-index')); showModalSlide(`modal-${product.id}`, idx); pauseAutoAdvance(`modal-${product.id}`); }));
    // touch swipe for modal slideshow
    let tStart=0, tEnd=0;
    modalSlideshow.addEventListener('touchstart', (ev)=> { tStart = ev.changedTouches[0].screenX; pauseAutoAdvance(`modal-${product.id}`); }, {passive:true});
    modalSlideshow.addEventListener('touchend', (ev)=> { tEnd = ev.changedTouches[0].screenX; const diff = tStart - tEnd; if (Math.abs(diff) > 40) { if (diff>0) { const id = `modal-${product.id}`; const nextIndex=(slidesState[id]+1)%images.length; showModalSlide(id,nextIndex); } else { const id=`modal-${product.id}`; const prevIndex=(slidesState[id]-1+images.length)%images.length; showModalSlide(id,prevIndex); } pauseAutoAdvance(`modal-${product.id}`); } }, {passive:true});
    // start modal auto-advance
    startAutoAdvance(`modal-${product.id}`, images.length);

    // comments load (name omitted by design)
    const commentsContainer = document.getElementById(`comments-${product.id}`);
    function loadComments() {
        const all = JSON.parse(localStorage.getItem('product_comments')||'{}');
        const list = all[product.id]||[];
        commentsContainer.innerHTML = list.map(c => {
            const when = c.ts ? ` <time>${new Date(c.ts).toLocaleString()}</time>` : '';
            return `<div class="comment"><p>${escapeHtml(c.text)}</p>${when}</div>`;
        }).join('') || '<p style="color:#666">No comments yet</p>';
    }
    loadComments();
    // comment form (no name field)
    const commentForm = document.getElementById(`comment-form-${product.id}`);
    commentForm.addEventListener('submit', (ev)=>{ ev.preventDefault(); ev.stopPropagation(); const text = document.getElementById(`comment-text-${product.id}`).value.trim(); if (!text) return; const all = JSON.parse(localStorage.getItem('product_comments')||'{}'); all[product.id] = all[product.id]||[]; all[product.id].push({text,ts:Date.now()}); localStorage.setItem('product_comments', JSON.stringify(all)); commentForm.reset(); loadComments(); });

    // add-to-cart in modal
    const modalAdd = document.getElementById(`modal-add-${product.id}`);
    modalAdd.addEventListener('click', (ev)=>{ ev.stopPropagation(); const size = document.getElementById(`modal-size-${product.id}`).value; addToCart(product.id, product.name, product.price, product.priceEur, size); alert('Added to cart'); });

    // keyboard navigation and cleanup
    const keyHandler = (ev) => {
        if (ev.key === 'Escape') {
            modal.classList.remove('open');
        } else if (ev.key === 'ArrowLeft') {
            const id = `modal-${product.id}`;
            const prevIndex = (slidesState[id] - 1 + images.length) % images.length;
            showModalSlide(id, prevIndex);
            pauseAutoAdvance(id);
        } else if (ev.key === 'ArrowRight') {
            const id = `modal-${product.id}`;
            const nextIndex = (slidesState[id] + 1) % images.length;
            showModalSlide(id, nextIndex);
            pauseAutoAdvance(id);
        }
    };
    document.addEventListener('keydown', keyHandler);

    // close handlers with cleanup
    const closeModal = ()=>{
        modal.classList.remove('open');
        document.removeEventListener('keydown', keyHandler);
        stopAutoAdvance(`modal-${product.id}`);
    };
    document.getElementById('product-modal-close').addEventListener('click', closeModal);
    modal.addEventListener('click', (ev)=>{ if (ev.target === modal) closeModal(); });
}

function escapeHtml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }

// Feedback form behavior
document.getElementById('feedback-float').addEventListener('click', ()=>{ document.getElementById('feedback-modal').classList.add('open'); });
document.getElementById('feedback-modal-close').addEventListener('click', ()=>{ document.getElementById('feedback-modal').classList.remove('open'); });
document.getElementById('feedback-form').addEventListener('submit', async (ev)=>{
    ev.preventDefault();
    const name = document.getElementById('fb-name').value.trim();
    const email = document.getElementById('fb-email').value.trim();
    const message = document.getElementById('fb-message').value.trim();
    if (!name||!message) return;
    const payload = { name, email, message };
    // try sending to server API first
    try {
        const controller = new AbortController();
        const timeout = setTimeout(()=>controller.abort(), 4000);
        const res = await fetch('/api/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: controller.signal });
        clearTimeout(timeout);
        if (res.ok) {
            document.getElementById('feedback-form').reset();
            alert('Thanks for the feedback!');
            document.getElementById('feedback-modal').classList.remove('open');
            return;
        }
    } catch (err) {
        // server not available or timed out; fallback to localStorage
    }
    const arr = JSON.parse(localStorage.getItem('feedbacks')||'[]'); arr.push({name,email,message,ts:Date.now()}); localStorage.setItem('feedbacks', JSON.stringify(arr)); document.getElementById('feedback-form').reset(); alert('Thanks for the feedback! (saved locally)'); document.getElementById('feedback-modal').classList.remove('open');
});

// Admin feedback view (very simple local-password protected)
document.getElementById('admin-feedback-link').addEventListener('click', async (ev)=>{ 
    ev.preventDefault(); 
    const pw = prompt('Enter admin password to view feedbacks'); 
    if (!pw) return;
    const modal = document.getElementById('feedback-modal');
    // try server first
    try {
        const controller = new AbortController();
        const timeout = setTimeout(()=>controller.abort(), 3000);
        const res = await fetch('/api/admin/feedbacks?pw=' + encodeURIComponent(pw), { signal: controller.signal });
        clearTimeout(timeout);
        if (res.ok) {
            const data = await res.json();
            const arr = data.feedbacks || [];
            const out = arr.map((f,i)=>`${i+1}. ${f.name} (${f.email||'no email'})\n${f.message}\n---`).join('\n\n') || 'No feedbacks yet';
            document.getElementById('feedback-modal-body').innerHTML = `<h3>Feedbacks (server)</h3><pre style="white-space:pre-wrap">${escapeHtml(out)}</pre><button id="feedback-back" class="add-to-cart-btn">Back</button>`;
            modal.classList.add('open');
            document.getElementById('feedback-back').addEventListener('click', ()=>{ modal.classList.remove('open'); resetFeedbackModal(); });
            return;
        }
    } catch (err) {
        // server not available or unauthorized; continue to local check
    }
    // fallback: check localStorage if password matches client ADMIN_PASSWORD
    if (pw !== ADMIN_PASSWORD) { alert('Incorrect password'); return; }
    const arr = JSON.parse(localStorage.getItem('feedbacks')||'[]'); const out = arr.map((f,i)=>`${i+1}. ${f.name} (${f.email||'no email'})\n${f.message}\n---`).join('\n\n') || 'No feedbacks yet';
    document.getElementById('feedback-modal-body').innerHTML = `<h3>Feedbacks (local)</h3><pre style="white-space:pre-wrap">${escapeHtml(out)}</pre><button id="feedback-back" class="add-to-cart-btn">Back</button>`;
    modal.classList.add('open');
    document.getElementById('feedback-back').addEventListener('click', ()=>{ modal.classList.remove('open'); resetFeedbackModal(); });
});

function resetFeedbackModal(){
    document.getElementById('feedback-modal-body').innerHTML = `
                <h3>Send Feedback</h3>
                <form id="feedback-form">
                    <input type="text" id="fb-name" placeholder="Your name" required>
                    <input type="email" id="fb-email" placeholder="Your email (optional)">
                    <textarea id="fb-message" placeholder="Your message" required></textarea>
                    <button type="submit" class="add-to-cart-btn">Send</button>
                </form>
            `;
    // reattach submit handler
    document.getElementById('feedback-form').addEventListener('submit', async (ev)=>{
        ev.preventDefault();
        const name = document.getElementById('fb-name').value.trim();
        const email = document.getElementById('fb-email').value.trim();
        const message = document.getElementById('fb-message').value.trim();
        if (!name||!message) return;
        const payload = { name, email, message };
        try {
            const controller = new AbortController();
            const timeout = setTimeout(()=>controller.abort(), 4000);
            const res = await fetch('/api/feedback', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload), signal: controller.signal });
            clearTimeout(timeout);
            if (res.ok) {
                document.getElementById('feedback-form').reset();
                alert('Thanks for the feedback!');
                document.getElementById('feedback-modal').classList.remove('open');
                return;
            }
        } catch (err) {}
        const arr = JSON.parse(localStorage.getItem('feedbacks')||'[]'); arr.push({name,email,message,ts:Date.now()}); localStorage.setItem('feedbacks', JSON.stringify(arr)); document.getElementById('feedback-form').reset(); alert('Thanks for the feedback! (saved locally)'); document.getElementById('feedback-modal').classList.remove('open');
    });
}

// Attach bundle button listeners
function setupBundleButtons() {
    document.querySelectorAll('.bundle-card .add-to-cart-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = btn.getAttribute('data-product-id');
            const name = btn.getAttribute('data-name');
            const price = parseFloat(btn.getAttribute('data-price'));
            const priceEur = parseFloat(btn.getAttribute('data-price-eur')) || (price / 5);
            addToCart(productId, name, price, priceEur, 'One Size');
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
function addToCart(productId, name, price, priceEur, size) {
    const existingItem = cart.find(item => item.productId === productId && item.size === size);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            productId: productId,
            name: name,
            price: price,
            priceEur: priceEur,
            size: size,
            quantity: 1
        });
    }
    
    saveCart();
    updateCartDisplay();
    updateCartCount();
}

// Setup cart button
function setupCartButton() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartBtn = document.getElementById('cart-btn');

    cartBtn.addEventListener('click', () => {
        cartSidebar.classList.toggle('open');
    });
    
    document.getElementById('close-cart').addEventListener('click', () => {
        cartSidebar.classList.remove('open');
    });
    
    document.addEventListener('click', (event) => {
        if (!cartSidebar.classList.contains('open')) return;
        if (cartSidebar.contains(event.target) || cartBtn.contains(event.target)) return;
        cartSidebar.classList.remove('open');
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
        cartSidebar.classList.remove('open');
    });
}

// Update cart display
function updateCartDisplay() {
    const container = document.getElementById('cart-items-container');
    container.innerHTML = '';
    
    if (cart.length === 0) {
        container.innerHTML = '<p style="text-align:center; color:#999;">Your cart is empty</p>';
        updateCartTotal();
        return;
    }
    
    cart.forEach((item, index) => {
        const itemSubtotal = item.price * item.quantity;
        const itemSubtotalEur = (item.priceEur || item.price / 5) * item.quantity;
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-header">
                <div>
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-meta">Size: ${item.size} • €${item.priceEur.toFixed(2)} each</div>
                </div>
                <button class="cart-item-remove" data-index="${index}">Remove</button>
            </div>
            <div class="cart-item-price">${item.price.toFixed(2)} RON each / €${item.priceEur.toFixed(2)} each</div>
            <div class="quantity-control">
                <button class="quantity-btn minus" data-index="${index}">−</button>
                <input type="number" class="quantity-input" value="${item.quantity}" data-index="${index}" min="1">
                <button class="quantity-btn plus" data-index="${index}">+</button>
            </div>
            <div class="cart-item-subtotal">Subtotal: ${itemSubtotal.toFixed(2)} RON / €${itemSubtotalEur.toFixed(2)}</div>
        `;
        
        container.appendChild(cartItem);
    });
    
    // Attach event listeners for quantity controls
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
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
            e.stopPropagation();
            const index = e.target.getAttribute('data-index');
            cart[index].quantity += 1;
            saveCart();
            updateCartDisplay();
            updateCartCount();
        });
    });
    
    document.querySelectorAll('.quantity-input').forEach(input => {
        input.addEventListener('change', (e) => {
            e.stopPropagation();
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
            e.stopPropagation();
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
    const totalEur = calculateTotalEur();
    document.getElementById('cart-total-price').textContent = total.toFixed(2) + ' RON';
    document.getElementById('cart-total-price-eur').textContent = '€' + totalEur.toFixed(2);
}

// Calculate cart total
function calculateTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Calculate cart total in euros
function calculateTotalEur() {
    return cart.reduce((total, item) => total + ((item.priceEur || item.price / 5) * item.quantity), 0);
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
