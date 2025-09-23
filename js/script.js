// Estado global de la aplicación
let cartCount = 0;
let cartItems = [];
let currentUser = null;

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    loadCartFromStorage();
    setupEventListeners();
    updateCartUI();
    initializeCartModal();
}

// Cargar carrito desde localStorage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cartItems');
    const savedCount = localStorage.getItem('cartCount');
    
    if (savedCart) {
        cartItems = JSON.parse(savedCart);
    }
    
    if (savedCount) {
        cartCount = parseInt(savedCount);
    } else {
        // Si no hay count guardado, calcularlo desde los items
        cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    }
}

// Guardar carrito en localStorage
function saveCartToStorage() {
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    localStorage.setItem('cartCount', cartCount.toString());
}

// Inicializar modal del carrito en el DOM
function initializeCartModal() {
    // Crear modal del carrito si no existe
    if (!document.getElementById('cartModal')) {
        const cartModal = document.createElement('div');
        cartModal.id = 'cartModal';
        cartModal.className = 'cart-modal';
        cartModal.innerHTML = `
            <div class="cart-modal-content">
                <div class="cart-header">
                    <h2>🛒 Tu Carrito de Compras</h2>
                    <button class="close-cart">&times;</button>
                </div>
                <div class="cart-items" id="cartItemsContainer">
                    <!-- Los items del carrito se cargarán aquí -->
                </div>
                <div class="cart-footer" id="cartFooter">
                    <!-- El footer del carrito se cargará aquí -->
                </div>
            </div>
        `;
        document.body.appendChild(cartModal);
        
        // Event listeners para el modal
        cartModal.querySelector('.close-cart').addEventListener('click', hideCartModal);
        cartModal.addEventListener('click', function(e) {
            if (e.target === cartModal) {
                hideCartModal();
            }
        });
    }
}

// Configurar event listeners
function setupEventListeners() {
    // Botones de agregar al carrito
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            addToCart(this);
        });
    });

    // Icono del carrito
    const cartIcons = document.querySelectorAll('.cart-icon');
    cartIcons.forEach(icon => {
        icon.addEventListener('click', showCartModal);
    });

    // Formularios
    const loginForm = document.getElementById('loginForm');
    const registerForm = document.getElementById('registerForm');
    const contactForm = document.getElementById('contactForm');

    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            validateLoginForm();
        });
    }

    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            validateRegisterForm();
        });
    }

    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            validateContactForm();
        });
    }

    // Filtros de productos
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');

    if (categoryFilter) {
        categoryFilter.addEventListener('change', filterProducts);
    }

    if (priceFilter) {
        priceFilter.addEventListener('change', filterProducts);
    }
}

// Funcionalidad del carrito
function addToCart(button) {
    const productCard = button.closest('.product-card');
    const productName = productCard.querySelector('.product-title').textContent;
    const productPrice = parseInt(productCard.querySelector('.product-price').textContent.replace(/[$.]/g, ''));
    const productImage = productCard.querySelector('.product-image').src;
    const productId = generateProductId(productName);
    
    // Verificar si el producto ya está en el carrito
    const existingItemIndex = cartItems.findIndex(item => item.id === productId);
    
    if (existingItemIndex !== -1) {
        // Si ya existe, aumentar la cantidad
        cartItems[existingItemIndex].quantity++;
    } else {
        // Si no existe, agregar nuevo item
        cartItems.push({
            id: productId,
            name: productName,
            price: productPrice,
            image: productImage,
            quantity: 1
        });
    }
    
    // Actualizar contador
    cartCount = cartItems.reduce((total, item) => total + item.quantity, 0);
    
    // Guardar y actualizar UI
    saveCartToStorage();
    updateCartUI();
    
    // Feedback visual
    showAddToCartFeedback(button);
}

function generateProductId(productName) {
    return productName.toLowerCase().replace(/\s+/g, '-').replace(/[^\w-]/g, '');
}

function showAddToCartFeedback(button) {
    const originalText = button.textContent;
    const originalBgColor = button.style.backgroundColor;
    
    button.textContent = '✓ Agregado';
    button.style.backgroundColor = '#28a745';
    button.disabled = true;
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = originalBgColor;
        button.disabled = false;
    }, 2000);
}

function updateCartUI() {
    // Actualizar contador en el icono del carrito
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = cartCount;
    });
}

// Modal del carrito
function showCartModal() {
    const cartModal = document.getElementById('cartModal');
    const cartItemsContainer = document.getElementById('cartItemsContainer');
    const cartFooter = document.getElementById('cartFooter');
    
    if (cartItems.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Tu carrito está vacío</p>';
        cartFooter.innerHTML = '';
    } else {
        // Renderizar items del carrito
        cartItemsContainer.innerHTML = cartItems.map(item => `
            <div class="cart-item" data-id="${item.id}">
                <img src="${item.image}" alt="${item.name}">
                <div class="item-details">
                    <h3>${item.name}</h3>
                    <p class="item-price">$${(item.price * item.quantity).toLocaleString()}</p>
                    <div class="quantity-controls">
                        <button class="decrease-quantity" onclick="decreaseQuantity('${item.id}')">-</button>
                        <span>${item.quantity}</span>
                        <button class="increase-quantity" onclick="increaseQuantity('${item.id}')">+</button>
                    </div>
                </div>
                <button class="remove-item" onclick="removeFromCart('${item.id}')">Eliminar</button>
            </div>
        `).join('');
        
        // Calcular total
        const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        
        // Renderizar footer
        cartFooter.innerHTML = `
            <div class="cart-summary">
                <span>Subtotal:</span>
                <span>$${total.toLocaleString()}</span>
            </div>
            <div class="cart-summary">
                <span>Envío:</span>
                <span>Gratis</span>
            </div>
            <div class="cart-summary">
                <strong class="cart-total">Total: $${total.toLocaleString()}</strong>
            </div>
            <button class="btn checkout-btn" onclick="checkout()">Proceder al Pago</button>
        `;
    }
    
    cartModal.classList.add('active');
}

function hideCartModal() {
    const cartModal = document.getElementById('cartModal');
    cartModal.classList.remove('active');
}

// Funciones del carrito (globales para los onclick)
function increaseQuantity(productId) {
    const item = cartItems.find(item => item.id === productId);
    if (item) {
        item.quantity++;
        cartCount++;
        saveCartToStorage();
        updateCartUI();
        showCartModal(); // Recargar modal
    }
}

function decreaseQuantity(productId) {
    const item = cartItems.find(item => item.id === productId);
    if (item && item.quantity > 1) {
        item.quantity--;
        cartCount--;
        saveCartToStorage();
        updateCartUI();
        showCartModal(); // Recargar modal
    }
}

function removeFromCart(productId) {
    const itemIndex = cartItems.findIndex(item => item.id === productId);
    if (itemIndex !== -1) {
        cartCount -= cartItems[itemIndex].quantity;
        cartItems.splice(itemIndex, 1);
        saveCartToStorage();
        updateCartUI();
        showCartModal(); // Recargar modal
    }
}

function checkout() {
    if (cartItems.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    const total = cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    alert(`¡Gracias por tu compra! Total: $${total.toLocaleString()}\n\nEsta es una demostración. En una tienda real, aquí irías al proceso de pago.`);
    
    // Limpiar carrito después de compra
    cartItems = [];
    cartCount = 0;
    saveCartToStorage();
    updateCartUI();
    hideCartModal();
}

// Validación de formularios
function validateLoginForm() {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    let isValid = true;
    
    // Reset errors
    clearErrors();
    
    // Validate email
    if (!email.value) {
        showError('emailError', 'El correo electrónico es requerido');
        isValid = false;
    } else if (!isValidEmail(email.value)) {
        showError('emailError', 'Ingresa un correo electrónico válido');
        isValid = false;
    }
    
    // Validate password
    if (!password.value) {
        showError('passwordError', 'La contraseña es requerida');
        isValid = false;
    }
    
    if (isValid) {
        alert('¡Inicio de sesión exitoso!');
        window.location.href = 'index.html';
    }
}

function validateRegisterForm() {
    const name = document.getElementById('name');
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const confirmPassword = document.getElementById('confirmPassword');
    
    let isValid = true;
    
    // Reset errors
    clearErrors();
    
    // Validate name
    if (!name.value.trim()) {
        showError('nameError', 'El nombre es requerido');
        isValid = false;
    }
    
    // Validate email
    if (!email.value) {
        showError('emailError', 'El correo electrónico es requerido');
        isValid = false;
    } else if (!isValidEmail(email.value)) {
        showError('emailError', 'Ingresa un correo electrónico válido');
        isValid = false;
    }
    
    // Validate password
    if (!password.value) {
        showError('passwordError', 'La contraseña es requerida');
        isValid = false;
    } else if (password.value.length < 6) {
        showError('passwordError', 'La contraseña debe tener al menos 6 caracteres');
        isValid = false;
    }
    
    // Validate confirm password
    if (!confirmPassword.value) {
        showError('confirmPasswordError', 'Confirma tu contraseña');
        isValid = false;
    } else if (password.value !== confirmPassword.value) {
        showError('confirmPasswordError', 'Las contraseñas no coinciden');
        isValid = false;
    }
    
    if (isValid) {
        alert('¡Registro exitoso! Bienvenido/a ' + name.value);
        window.location.href = 'index.html';
    }
}

function validateContactForm() {
    const name = document.getElementById('contactName');
    const email = document.getElementById('contactEmail');
    const message = document.getElementById('contactMessage');
    
    let isValid = true;
    
    // Reset errors
    clearErrors();
    
    // Validate name
    if (!name.value.trim()) {
        showError('nameError', 'El nombre es requerido');
        isValid = false;
    }
    
    // Validate email
    if (!email.value) {
        showError('emailError', 'El correo electrónico es requerido');
        isValid = false;
    } else if (!isValidEmail(email.value)) {
        showError('emailError', 'Ingresa un correo electrónico válido');
        isValid = false;
    }
    
    // Validate message
    if (!message.value.trim()) {
        showError('messageError', 'El mensaje es requerido');
        isValid = false;
    }
    
    if (isValid) {
        alert('¡Mensaje enviado con éxito! Te contactaremos pronto.');
        document.getElementById('contactForm').reset();
    }
}

// Helper functions
function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(elementId, message) {
    const errorElement = document.getElementById(elementId);
    if (errorElement) {
        errorElement.textContent = message;
        errorElement.style.display = 'block';
    }
}

function clearErrors() {
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
        el.style.display = 'none';
    });
}

// Filtrado de productos
function filterProducts() {
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    const productCards = document.querySelectorAll('.product-card');
    
    const selectedCategory = categoryFilter.value;
    const selectedPrice = priceFilter.value;
    
    let visibleProducts = [];
    
    productCards.forEach(card => {
        const category = card.getAttribute('data-category');
        const price = parseInt(card.getAttribute('data-price'));
        let show = true;
        
        // Filtrar por categoría
        if (selectedCategory && category !== selectedCategory) {
            show = false;
        }
        
        if (show) {
            visibleProducts.push({card: card, price: price});
            card.style.display = 'block';
        } else {
            card.style.display = 'none';
        }
    });
    
    // Ordenar por precio si es necesario
    if (selectedPrice === 'asc') {
        visibleProducts.sort((a, b) => a.price - b.price);
    } else if (selectedPrice === 'desc') {
        visibleProducts.sort((a, b) => b.price - a.price);
    }
    
    // Reordenar en el DOM
    if (selectedPrice) {
        const productsGrid = document.querySelector('.products-grid');
        visibleProducts.forEach(item => {
            productsGrid.appendChild(item.card);
        });
    }
}