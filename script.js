// Product Data
const products = [
    {
        id: 1,
        name: "Segi Empat Paris",
        price: 18000,
        image: "gambar/hijab.jpg"
    },
    {
        id: 2,
        name: "Paket Bundling (3 pcs)",
        price: 50000,
        originalPrice: 55000,
        image: "gambar/hjb3.jpg",
        isBundling: true,
        badge: "Hemat Rp 5.000"
    },
];

// Cart State
let cart = [];

// DOM Elements
const productList = document.getElementById('product-list');
const cartBtn = document.getElementById('cart-btn');
const closeCartBtn = document.getElementById('close-cart');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartItemsContainer = document.getElementById('cart-items');
const cartCount = document.getElementById('cart-count');
const cartTotal = document.getElementById('cart-total');
const hamburgerBtn = document.getElementById('hamburger-btn');
const closeNavBtn = document.getElementById('close-nav-btn');
const navLinks = document.getElementById('nav-links');
const searchBtn = document.getElementById('search-btn');
const closeSearchBtn = document.getElementById('close-search');
const searchOverlay = document.getElementById('search-overlay');
const searchInput = document.getElementById('search-input');

// Format Currency
const formatRupiah = (number) => {
    return new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', minimumFractionDigits: 0 }).format(number);
};

// State for Modal
let currentSelectedProductId = null;
let currentSelectedColor = null;

const colorsList = [
    "Soft Milo",
    "Taupe",
    "Taro",
    "Soft Pink",
    "Nude Pink",
    "Pink",
    "Maroon",
    "Red Wine",
    "Burgundy",
    "Baby Blue",
    "Denim",
    "Ivory",
    "Sage",
    "Oat",
    "Biskuit",
    "Espresso",
    "Hitam",
    "Putih",
    "Abu-abu",
    "Coklat Pramuka",
    "Coksu",
    "Coklat Mahogany",
    "Blue Grey",
    "Navy",
    "Mauve"
];

// Render Products
function renderProducts(filteredProducts = products) {
    productList.innerHTML = ''; // Clear list before rendering
    filteredProducts.forEach((product, index) => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card reveal';
        productCard.style.transitionDelay = `${index * 0.15}s`; // Staggered reveal
        
        const clickAction = product.isBundling ? `addToCartDirectly(${product.id})` : `openColorModal(${product.id})`;
        const badgeHTML = product.badge ? `<div class="product-badge">${product.badge}</div>` : '';
        
        productCard.innerHTML = `
            ${badgeHTML}
            <img src="${product.image}" alt="${product.name}" class="product-img">
            <div class="product-info">
                <h3 class="product-title">${product.name}</h3>
                <div class="product-price-container">
                    ${product.originalPrice ? `<span class="product-price-original">${formatRupiah(product.originalPrice)}</span>` : ''}
                    <span class="product-price">${formatRupiah(product.price)}</span>
                </div>
                <button class="btn-add" onclick="${clickAction}">Tambah ke Keranjang</button>
            </div>
        `;
        productList.appendChild(productCard);
    });
    
    // Initialize reveal animations after products are added
    initRevealAnimations();
}

function initRevealAnimations() {
    const reveals = document.querySelectorAll('.reveal');
    const observerOptions = {
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                observer.unobserve(entry.target); // Animasi cuma sekali
            }
        });
    }, observerOptions);

    reveals.forEach(reveal => {
        observer.observe(reveal);
    });
}

function addToCartDirectly(productId) {
    const product = products.find(p => p.id === productId);
    const cartId = `${productId}-direct`;
    const existingItem = cart.find(item => item.cartId === cartId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            ...product,
            cartId: cartId,
            color: product.isBundling ? "Pilih warna di WA" : "Default",
            quantity: 1
        });
    }

    updateCartUI();

    // Add visual feedback
    cartBtn.style.transform = 'scale(1.2)';
    setTimeout(() => cartBtn.style.transform = 'scale(1)', 200);
}

// Cart Functions
function toggleCart() {
    cartSidebar.classList.toggle('active');
    cartOverlay.classList.toggle('active');
}

function toggleNav() {
    navLinks.classList.toggle('active');
}

function openColorModal(productId) {
    const product = products.find(p => p.id === productId);
    currentSelectedProductId = productId;
    currentSelectedColor = null; // Reset selection

    document.getElementById('color-modal-product-name').innerText = product.name;

    // Render color options
    const container = document.getElementById('color-options-container');
    container.innerHTML = '';

    colorsList.forEach(color => {
        const btn = document.createElement('button');
        btn.className = 'color-option-btn';
        btn.innerText = color;
        btn.onclick = () => selectColorOption(color, btn);
        container.appendChild(btn);
    });

    const confirmBtn = document.getElementById('btn-confirm-color');
    confirmBtn.disabled = true;
    confirmBtn.onclick = () => confirmAddToCart();

    document.getElementById('color-modal').classList.add('active');
}

function selectColorOption(color, btnElement) {
    currentSelectedColor = color;

    // update active classes
    const allBtns = document.getElementById('color-options-container').querySelectorAll('.color-option-btn');
    allBtns.forEach(b => b.classList.remove('selected'));
    btnElement.classList.add('selected');

    document.getElementById('btn-confirm-color').disabled = false;
}

function closeColorModal() {
    document.getElementById('color-modal').classList.remove('active');
    currentSelectedProductId = null;
    currentSelectedColor = null;
}

function confirmAddToCart() {
    if (!currentSelectedProductId || !currentSelectedColor) return;

    const productId = currentSelectedProductId;
    const selectedColor = currentSelectedColor;

    const cartId = `${productId}-${selectedColor}`;
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.cartId === cartId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...product, cartId: cartId, color: selectedColor, quantity: 1 });
    }

    updateCartUI();
    closeColorModal();

    // Add visual feedback
    cartBtn.style.transform = 'scale(1.2)';
    setTimeout(() => cartBtn.style.transform = 'scale(1)', 200);
}

function removeFromCart(cartId) {
    cart = cart.filter(item => item.cartId !== cartId);
    updateCartUI();
}

function updateQuantity(cartId, change) {
    const item = cart.find(item => item.cartId === cartId);
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            removeFromCart(cartId);
        } else {
            updateCartUI();
        }
    }
}

function updateCartUI() {
    // Update count
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.innerText = totalItems;

    // Update items list
    cartItemsContainer.innerHTML = '';

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p style="text-align:center; color: #6b7280; margin-top: 2rem;">Keranjang Anda masih kosong</p>';
    } else {
        cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <img src="${item.image}" alt="${item.name}" class="cart-item-img">
                <div class="cart-item-info">
                    <h4 class="cart-item-title">${item.name}</h4>
                    <p style="font-size: 0.85rem; color: var(--primary); margin-bottom: 0.2rem;">Warna: ${item.color}</p>
                    <p class="cart-item-price">${formatRupiah(item.price)}</p>
                    <div class="cart-item-quantity">
                        <button class="qty-btn" onclick="updateQuantity('${item.cartId}', -1)">-</button>
                        <span>${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity('${item.cartId}', 1)">+</button>
                    </div>
                </div>
                <!-- Trash SVG inline for remove -->
                <button class="cart-item-remove" onclick="removeFromCart('${item.cartId}')">
                    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                      <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                </button>
            `;
            cartItemsContainer.appendChild(cartItem);
        });
    }

    // Update total
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotal.innerText = formatRupiah(total);
}

function checkout() {
    if (cart.length === 0) {
        alert("Keranjang masih kosong. Silakan pilih produk terlebih dahulu.");
        return;
    }

    // Hitung total dan tampilkan di modal
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    document.getElementById('modal-total').innerText = formatRupiah(total);

    // Tutup cart sidebar dulu
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');

    // Tampilkan modal
    document.getElementById('payment-modal').classList.add('active');
}

function confirmViaWhatsApp() {
    let message = "Halo Admin Hijea, saya sudah melakukan pembayaran untuk tagihan pesanan berikut:\n\n";
    let total = 0;

    cart.forEach(item => {
        message += `- ${item.name} (${item.color})\n  ${item.quantity} pcs x ${formatRupiah(item.price)} = ${formatRupiah(item.price * item.quantity)}\n`;
        total += item.price * item.quantity;
    });

    message += `\nTotal Belanja: *${formatRupiah(total)}*\n\n`;
    message += "Mohon segera diproses ya. Berikut saya lampirkan juga bukti pembayarannya. Terima kasih!";

    const waNumber = "6283870981901"; // Ganti dengan nomor WhatsApp admin yang sebenarnya
    const waUrl = `https://wa.me/${waNumber}?text=${encodeURIComponent(message)}`;

    window.open(waUrl, '_blank');
}

function closePaymentModal() {
    document.getElementById('payment-modal').classList.remove('active');
}

// Event Listeners
cartBtn.addEventListener('click', toggleCart);
closeCartBtn.addEventListener('click', toggleCart);

if (hamburgerBtn) {
    hamburgerBtn.addEventListener('click', toggleNav);
}
if (closeNavBtn) {
    closeNavBtn.addEventListener('click', toggleNav);
}

cartOverlay.addEventListener('click', () => {
    cartSidebar.classList.remove('active');
    cartOverlay.classList.remove('active');
});

// Close nav when clicking outside
document.addEventListener('click', (e) => {
    if (navLinks && navLinks.classList.contains('active')) {
        if (!navLinks.contains(e.target) && hamburgerBtn && !hamburgerBtn.contains(e.target)) {
            navLinks.classList.remove('active');
        }
    }
});

// Close nav when clicking a link
if (navLinks) {
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            if (navLinks.classList.contains('active')) {
                toggleNav();
            }
        });
    });
}

// Search Functions
function toggleSearch() {
    searchOverlay.classList.toggle('active');
    if (searchOverlay.classList.contains('active')) {
        setTimeout(() => searchInput.focus(), 300);
    } else {
        searchInput.value = '';
        renderProducts(products); // Reset if closed
    }
}

function handleSearch(e) {
    const searchTerm = e.target.value.toLowerCase();
    const filtered = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm)
    );
    renderProducts(filtered);
}

// Event Listeners
if (searchBtn) searchBtn.addEventListener('click', toggleSearch);
if (closeSearchBtn) closeSearchBtn.addEventListener('click', toggleSearch);
if (searchInput) searchInput.addEventListener('input', handleSearch);

// Close search on Esc key
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && searchOverlay.classList.contains('active')) {
        toggleSearch();
    }
});

document.getElementById('close-payment').addEventListener('click', closePaymentModal);
document.getElementById('payment-modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('payment-modal')) {
        closePaymentModal();
    }
});
document.getElementById('close-color-modal').addEventListener('click', closeColorModal);
document.getElementById('color-modal').addEventListener('click', (e) => {
    if (e.target === document.getElementById('color-modal')) {
        closeColorModal();
    }
});

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    renderProducts();
    updateCartUI();
});
