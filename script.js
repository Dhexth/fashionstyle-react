// Estado global de la aplicación
let cartCount = 0;
let currentUser = null;

// Inicializar la aplicación
document.addEventListener('DOMContentLoaded', function() {
    initializeApp();
});

function initializeApp() {
    loadCartFromStorage();
    setupEventListeners();
    updateCartUI();
}

// Cargar carrito desde localStorage
function loadCartFromStorage() {
    const savedCart = localStorage.getItem('cartCount');
    if (savedCart) {
        cartCount = parseInt(savedCart);
    }
}

// Guardar carrito en localStorage
function saveCartToStorage() {
    localStorage.setItem('cartCount', cartCount.toString());
}

// Configurar event listeners
function setupEventListeners() {
    // Botones de agregar al carrito
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function() {
            addToCart();
        });
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
function addToCart() {
    cartCount++;
    saveCartToStorage();
    updateCartUI();
    
    // Efecto visual de feedback
    const button = event.target;
    const originalText = button.textContent;
    button.textContent = '¡Agregado!';
    button.style.backgroundColor = '#28a745';
    
    setTimeout(() => {
        button.textContent = originalText;
        button.style.backgroundColor = '';
    }, 1500);
}

function updateCartUI() {
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = cartCount;
    });
}

// Validación de formularios
function validateLoginForm() {
    const email = document.getElementById('email');
    const password = document.getElementById('password');
    const emailError = document.getElementById('emailError');
    const passwordError = document.getElementById('passwordError');
    
    let isValid = true;
    
    // Reset errors
    if (emailError) emailError.textContent = '';
    if (passwordError) passwordError.textContent = '';
    
    // Validate email
    if (!email.value) {
        if (emailError) emailError.textContent = 'El correo electrónico es requerido';
        isValid = false;
    } else if (!isValidEmail(email.value)) {
        if (emailError) emailError.textContent = 'Ingresa un correo electrónico válido';
        isValid = false;
    }
    
    // Validate password
    if (!password.value) {
        if (passwordError) passwordError.textContent = 'La contraseña es requerida';
        isValid = false;
    } else if (password.value.length < 4 || password.value.length > 10) {
        if (passwordError) passwordError.textContent = 'La contraseña debe tener entre 4 y 10 caracteres';
        isValid = false;
    }
    
    if (isValid) {
        // Simular login exitoso
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
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
    });
    
    // Validate name
    if (!name.value) {
        showError('nameError', 'El nombre es requerido');
        isValid = false;
    } else if (name.value.length > 100) {
        showError('nameError', 'El nombre no puede exceder 100 caracteres');
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
    } else if (password.value.length < 4 || password.value.length > 10) {
        showError('passwordError', 'La contraseña debe tener entre 4 y 10 caracteres');
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
        // Simular registro exitoso
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
    document.querySelectorAll('.error-message').forEach(el => {
        el.textContent = '';
    });
    
    // Validate name
    if (!name.value) {
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
    if (!message.value) {
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
    }
}

// Filtrado de productos
function filterProducts() {
    const categoryFilter = document.getElementById('categoryFilter');
    const priceFilter = document.getElementById('priceFilter');
    const productCards = document.querySelectorAll('.product-card');
    
    const selectedCategory = categoryFilter.value;
    const selectedPrice = priceFilter.value;
    
    productCards.forEach(card => {
        const category = card.getAttribute('data-category');
        const price = parseInt(card.getAttribute('data-price'));
        
        let show = true;
        
        // Filtrar por categoría
        if (selectedCategory && category !== selectedCategory) {
            show = false;
        }
        
        // Filtrar por precio
        if (selectedPrice === 'asc') {
            // Mostrar de menor a mayor precio
            card.style.order = price;
        } else if (selectedPrice === 'desc') {
            // Mostrar de mayor a menor precio
            card.style.order = -price;
        }
        
        card.style.display = show ? 'block' : 'none';
    });
}