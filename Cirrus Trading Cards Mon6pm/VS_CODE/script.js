/**
 * PRODUCT CATALOGUE IMPLEMENTATION
 * Requirements:
 * - Create array of product objects with name, price, description, image
 * - Store products in localStorage as "AllProducts"
 * - Display products dynamically
 * - Add "Add to Cart" functionality
 */

// Product data array based on provided PRODUCTS object
const PRODUCTS = [
    { 
        id: 'p1', 
        name: 'Pokémon TCG x Van Gogh Museum Pikachu with Grey Felt Hat (PSA or BGS Graded)', 
        price: 559.99, 
        img: 'Assets/image1.jpg',
        category: 'premium',
        description: 'Highly sought-after graded Pikachu card from the Van Gogh Museum collaboration.'
    },
    { 
        id: 'p2', 
        name: 'Pokémon Mega Evolution Mega Gardevoir Elite Trainer Box', 
        price: 69.99, 
        img: 'Assets/image2.jpg',
        category: 'trainer-box',
        description: 'Elite Trainer Box featuring Mega Gardevoir with exclusive accessories.'
    },
    { 
        id: 'p3', 
        name: '2025 Pokémon Mega Evolution Phantasmal Flames Elite Trainer Box', 
        price: 89.99, 
        img: 'Assets/image3.jpg',
        category: 'trainer-box',
        description: 'Latest Mega Evolution series Elite Trainer Box with Phantasmal Flames theme.'
    },
    { 
        id: 'p4', 
        name: '2025 Pokémon Mega Evolution Mega Brave & Mega Symphonia Premium Trainer Box', 
        price: 85.99, 
        img: 'Assets/image4.jpg',
        category: 'trainer-box',
        description: 'Premium Trainer Box featuring both Mega Brave and Mega Symphonia expansions.'
    },
    { 
        id: 'p5', 
        name: '2025 Pokémon Scarlet & Violet Destined Rivals Elite Trainer Box', 
        price: 91.99, 
        img: 'Assets/image5.jpg',
        category: 'trainer-box',
        description: 'Scarlet & Violet series Elite Trainer Box with Destined Rivals theme.'
    },
    { 
        id: 'p6', 
        name: 'Pokémon Mega Evolution Base Set Enhanced Booster Box (36 Boosters)', 
        price: 229.99, 
        img: 'Assets/image6.jpg',
        category: 'booster',
        description: 'Complete booster box with 36 Mega Evolution Base Set Enhanced booster packs.'
    },
    { 
        id: 'p7', 
        name: 'Pokémon Scarlet & Violet Glory of the Rocket Team Attache Case Set (With Booster Box)', 
        price: 139.99, 
        img: 'Assets/image7.jpg',
        category: 'special',
        description: 'Premium attache case set featuring Team Rocket theme with included booster box.'
    },
    { 
        id: 'p8', 
        name: '2025 Pokémon Team Rocket Moltres ex Ultra-Premium Collection', 
        price: 269.99, 
        img: 'Assets/image8.jpg',
        category: 'premium',
        description: 'Ultra-Premium Collection showcasing Team Rocket Moltres ex with exclusive items.'
    },
    { 
        id: 'p9', 
        name: '2025 Pokémon Team Rocket Prismatic Evolutions Lucario ex & Tyranitar ex Premium Collection', 
        price: 109.99, 
        img: 'Assets/image9.jpg',
        category: 'premium',
        description: 'Premium Collection featuring both Lucario ex and Tyranitar ex from Prismatic Evolutions.'
    },
    { 
        id: 'p10', 
        name: '2025 Pokémon Scarlet & Violet Prismatic Evolutions Elite Trainer Box', 
        price: 115.99, 
        img: 'Assets/image10.jpg',
        category: 'trainer-box',
        description: 'Elite Trainer Box from the Prismatic Evolutions series of Scarlet & Violet.'
    },
    { 
        id: 'p11', 
        name: '2025 Pokémon Mega Evolution Charizard X ex Ultra-Premium Collection', 
        price: 195.99, 
        img: 'Assets/image11.jpg',
        category: 'premium',
        description: 'Ultra-Premium Collection centered around the iconic Charizard X ex.'
    },
    { 
        id: 'p12', 
        name: 'Pokémon Scarlet & Violet Destined Rivals Pokemon Center Elite Trainer Box', 
        price: 339.99, 
        img: 'Assets/image12.jpg',
        category: 'trainer-box',
        description: 'Exclusive Pokemon Center edition Elite Trainer Box from Destined Rivals series.'
    },
    { 
        id: 'p13', 
        name: 'Pokémon TCG Scarlet & Violet 151 6pk Booster Bundle', 
        price: 85.99, 
        img: 'Assets/image13.jpg',
        category: 'booster',
        description: 'Booster bundle containing 6 packs from the Scarlet & Violet 151 collection.'
    },
    { 
        id: 'p14', 
        name: 'Pokémon Scarlet & Violet Prismatic Evolutions Booster Bundle', 
        price: 52.99, 
        img: 'Assets/image14.jpg',
        category: 'booster',
        description: 'Booster bundle featuring packs from the Prismatic Evolutions series.'
    },
    { 
        id: 'p15', 
        name: '2025 Pokémon Scarlet & Violet Destined Rivals Booster Bundle', 
        price: 44.99, 
        img: 'Assets/image15.jpg',
        category: 'booster',
        description: 'Booster bundle from the latest Destined Rivals expansion.'
    },
    { 
        id: 'p16', 
        name: '2025 Pokémon Scarlet & Violet White Flare Booster Bundle', 
        price: 39.99, 
        img: 'Assets/image16.jpg',
        category: 'booster',
        description: 'Booster bundle featuring the White Flare expansion packs.'
    },
    { 
        id: 'p17', 
        name: 'Pokémon Scarlet & Violet Prismatic Evolutions', 
        price: 32.99, 
        img: 'Assets/image17.jpg',
        category: 'booster',
        description: 'Surprise Box'
    }
];

/**
 * Initialize product catalogue
 * Stores products in localStorage and displays them
 */
function initializeProductCatalogue() {
    // Store products in localStorage if not already present
    const storedProducts = localStorage.getItem('AllProducts');
    if (!storedProducts) {
        localStorage.setItem('AllProducts', JSON.stringify(PRODUCTS));
        console.log('Pokémon products stored in localStorage');
    }
    
    // Display products
    displayProducts();
    updateCartCount();
}

/**
 * Display all products in the products container
 * Creates product cards dynamically
 */
function displayProducts() {
    const productsContainer = document.getElementById('products-container');
    
    if (!productsContainer) {
        console.error('Products container not found');
        return;
    }
    
    // Clear existing content
    productsContainer.innerHTML = '';
    
    // Get products from localStorage
    const storedProducts = localStorage.getItem('AllProducts');
    const productList = storedProducts ? JSON.parse(storedProducts) : PRODUCTS;
    
    if (productList.length === 0) {
        productsContainer.innerHTML = '<p class="no-products">No Pokémon cards available at the moment.</p>';
        return;
    }
    
    // Create product cards
    productList.forEach(product => {
        const productCard = createProductCard(product);
        productsContainer.appendChild(productCard);
    });
}

/**
 * Create individual product card HTML element
 * @param {Object} product - Product object
 * @returns {HTMLElement} Product card element
 */
function createProductCard(product) {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-product-id', product.id);
    card.setAttribute('data-category', product.category);
    
    // Determine category label
    const categoryLabels = {
        'premium': 'Premium Collection',
        'trainer-box': 'Elite Trainer Box',
        'booster': 'Booster Bundle',
        'special': 'Special Edition'
    };
    
    card.innerHTML = `
        <img src="${product.img}" alt="${product.name}" class="product-image" 
             onerror="this.src='Assets/placeholder.jpg'">
        <h3 class="product-name">${product.name}</h3>
        <div class="product-category">${categoryLabels[product.category] || product.category}</div>
        <p class="product-price">USD $${product.price.toFixed(2)}</p>
        <button class="btn-add-cart" onclick="addToCart('${product.id}')">
            Add to Cart
        </button>
    `;
    
    return card;
}

/**
 * Add product to shopping cart
 * @param {string} productId - ID of product to add to cart
 */
function addToCart(productId) {
    // Get current cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || {};
    
    // Get product details
    const storedProducts = localStorage.getItem('AllProducts');
    const products = storedProducts ? JSON.parse(storedProducts) : PRODUCTS;
    const product = products.find(p => p.id === productId);
    
    if (!product) {
        alert('Pokémon card not found!');
        return;
    }
    
    // Add to cart or update quantity
    if (cart[productId]) {
        cart[productId].quantity += 1;
    } else {
        cart[productId] = {
            ...product,
            quantity: 1
        };
    }
    
    // Save updated cart
    localStorage.setItem('cart', JSON.stringify(cart));
    
    // Update cart count
    updateCartCount();
    
    // Visual feedback
    showAddToCartFeedback(productId);
}

/**
 * Show visual feedback when product is added to cart
 * @param {string} productId - ID of product added
 */
function showAddToCartFeedback(productId) {
    const button = document.querySelector(`[data-product-id="${productId}"] .btn-add-cart`);
    if (button) {
        const originalText = button.textContent;
        button.textContent = 'Added to Cart!';
        button.disabled = true;
        
        setTimeout(() => {
            button.textContent = originalText;
            button.disabled = false;
        }, 1500);
    }
}

/**
 * Update cart count in navigation
 */
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || {};
    const totalItems = Object.values(cart).reduce((total, item) => total + item.quantity, 0);
    
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

/**
 * Get all products from localStorage
 * @returns {Array} Array of product objects
 */
function getAllProducts() {
    const storedProducts = localStorage.getItem('AllProducts');
    return storedProducts ? JSON.parse(storedProducts) : PRODUCTS;
}

/**
 * Filter products by category
 * @param {string} category - Category to filter by
 */
function filterProductsByCategory(category) {
    const products = getAllProducts();
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(product => product.category === category);
    
    const productsContainer = document.getElementById('products-container');
    productsContainer.innerHTML = '';
    
    if (filteredProducts.length === 0) {
        productsContainer.innerHTML = '<p class="no-products">No Pokémon cards found in this category.</p>';
        return;
    }
    
    filteredProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsContainer.appendChild(productCard);
    });
}

/**
 * Search products by name
 * @param {string} searchTerm - Search term
 */
function searchProducts(searchTerm) {
    const products = getAllProducts();
    const searchedProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category.toLowerCase().includes(searchTerm.toLowerCase())
    );
    
    const productsContainer = document.getElementById('products-container');
    productsContainer.innerHTML = '';
    
    if (searchedProducts.length === 0) {
        productsContainer.innerHTML = '<p class="no-products">No Pokémon cards found matching "' + searchTerm + '".</p>';
        return;
    }
    
    searchedProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsContainer.appendChild(productCard);
    });
}

/**
 * Sort products by price
 * @param {string} sortOrder - 'asc' for ascending, 'desc' for descending
 */
function sortProductsByPrice(sortOrder) {
    const products = getAllProducts();
    const sortedProducts = [...products].sort((a, b) => {
        return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
    });
    
    const productsContainer = document.getElementById('products-container');
    productsContainer.innerHTML = '';
    
    sortedProducts.forEach(product => {
        const productCard = createProductCard(product);
        productsContainer.appendChild(productCard);
    });
}

// Initialize product catalogue when page loads
document.addEventListener('DOMContentLoaded', function() {
    initializeProductCatalogue();
    
    // Add search functionality
    const searchInput = document.getElementById('search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function(e) {
            searchProducts(e.target.value);
        });
    }
    
    // Add category filter functionality
    const categoryFilter = document.getElementById('category-filter');
    if (categoryFilter) {
        categoryFilter.addEventListener('change', function(e) {
            filterProductsByCategory(e.target.value);
        });
    }
});

// Make functions available globally for HTML onclick attributes
window.addToCart = addToCart;
window.filterProductsByCategory = filterProductsByCategory;
window.searchProducts = searchProducts;
window.sortProductsByPrice = sortProductsByPrice;


// Dashboard Script         
function loadDashboard() {
    const username = localStorage.getItem("username");
    const cart = JSON.parse(localStorage.getItem("cart")) || [];
        let profile = JSON.parse(localStorage.getItem("userProfile"));

        // Redirect if not logged in
        if (!username) return window.location.href = "login.html";

        // Init profile if none exists
        if (!profile) {
            profile = {
                username: username,
                email: "",
                favorites: [],
                purchases: []
            };
            localStorage.setItem("userProfile", JSON.stringify(profile));
        }

        document.getElementById("welcomeMsg").textContent = `Welcome, ${username}!`;
        document.getElementById("profileName").textContent = profile.username;
        document.getElementById("profileEmail").textContent = profile.email || "Not set";

        document.getElementById("cartCount").textContent = cart.length;
        document.getElementById("dashCartCount").textContent = cart.length;

        loadList("favoriteList", profile.favorites, "No favorites yet");
        loadList("purchaseList", profile.purchases, "No purchases recorded");
    }

    function loadList(id, items, defaultMsg) {
        const list = document.getElementById(id);
        list.innerHTML = items.length
            ? items.map(i => `<li>${i}</li>`).join("")
            : `<li>${defaultMsg}</li>`;
    }

    function logoutUser() {
        localStorage.removeItem("username");
        localStorage.removeItem("userProfile");
        window.location.href = "login.html";
    }
