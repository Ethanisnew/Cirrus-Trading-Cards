/*GLOBAL CONSTANTS & HELPERS */

const REG_KEY = "RegistrationData";
const ALL_PRODUCTS_KEY = "AllProducts";
const ALL_INVOICES_KEY = "AllInvoices";
const LOGGED_IN_KEY = "loggedInUser";

/** Get array of registered users */
function getRegistrationData() {
    return JSON.parse(localStorage.getItem(REG_KEY)) || [];
}

/** Save array of registered users */
function setRegistrationData(users) {
    localStorage.setItem(REG_KEY, JSON.stringify(users));
}

/** Get currently logged-in user object */
function getLoggedInUser() {
    return JSON.parse(localStorage.getItem(LOGGED_IN_KEY));
}

/** Save currently logged-in user (and sync into RegistrationData) */
function setLoggedInUser(user) {
    localStorage.setItem(LOGGED_IN_KEY, JSON.stringify(user));

    let users = getRegistrationData();
    let idx = users.findIndex(u => u.trn === user.trn);
    if (idx !== -1) {
        users[idx] = user;
        setRegistrationData(users);
    }
}

/** Get All Invoices array */
function getAllInvoices() {
    return JSON.parse(localStorage.getItem(ALL_INVOICES_KEY)) || [];
}

/** Save All Invoices array */
function setAllInvoices(invArr) {
    localStorage.setItem(ALL_INVOICES_KEY, JSON.stringify(invArr));
}

/** Utility: calculate age from yyyy-mm-dd */
function calculateAge(dobStr) {
    if (!dobStr) return 0;
    const today = new Date();
    const dob = new Date(dobStr);
    let age = today.getFullYear() - dob.getFullYear();
    const m = today.getMonth() - dob.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < dob.getDate())) {
        age--;
    }
    return age;
}

/** Utility: tax/discount calculation for ONE line item */
function calculateLine(price, qty) {
    let subTotal = price * qty;
    let discount = subTotal > 100 ? subTotal * 0.10 : 0;
    let tax = (subTotal - discount) * 0.15;
    let total = subTotal - discount + tax;
    return { subTotal, discount, tax, total };
}

/** Utility: full cart totals (from cart array) */
function calculateCartTotals(cart) {
    let subtotal = 0, discount = 0, tax = 0, total = 0;
    let itemsWithCalcs = cart.map(item => {
        const calc = calculateLine(item.price, item.qty);
        subtotal += calc.subTotal;
        discount += calc.discount;
        tax += calc.tax;
        total += calc.total;
        return { ...item, ...calc };
    });
    return { itemsWithCalcs, subtotal, discount, tax, total };
}

/** Update all cart count badges (nav, dashboard, etc.) */
function updateCartCounts() {
    const user = getLoggedInUser();
    let count = 0;
    if (user && Array.isArray(user.cart)) {
        count = user.cart.reduce((sum, item) => sum + Number(item.qty || 0), 0);
    }

    const navBadge = document.getElementById("cart-count");
    if (navBadge) navBadge.textContent = count;

    document.querySelectorAll(".cart-count").forEach(span => {
        span.textContent = count;
    });

    const dashCount = document.getElementById("dashCartCount");
    if (dashCount) dashCount.textContent = count;
}

/*  SECTION 1: LOGIN (index.html)*/

let loginAttempts = 3;

function initLogin() {
    const form = document.getElementById("loginForm");
    if (!form) return; // not on login page

    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const trnInput = document.getElementById("loginTRN");
        const passInput = document.getElementById("loginPassword");
        if (!trnInput || !passInput) return;

        const trn = trnInput.value.trim();
        const password = passInput.value.trim();

        const users = getRegistrationData();
        const foundUser = users.find(u => u.trn === trn && u.password === password);

        if (foundUser) {
            alert("Login successful!");
            localStorage.setItem(LOGGED_IN_KEY, JSON.stringify(foundUser));
            updateCartCounts();
            // Redirect to Product page or Home
            window.location.href = "products.html";
            return;
        }

        loginAttempts--;

        if (loginAttempts > 0) {
            alert(`Incorrect TRN or Password. Attempts remaining: ${loginAttempts}`);
        } else {
            alert("Your account is locked. Redirecting to locked page...");
            window.location.href = "account-locked.html";
        }
    });
}

/** Reset password – used by index.html */
function resetPassword() {
    const trn = prompt("Enter your TRN to reset your password:");
    if (!trn) return;

    const users = getRegistrationData();
    const user = users.find(u => u.trn === trn);

    if (!user) {
        alert("TRN not found.");
        return;
    }

    const newPass = prompt("Enter your NEW password (min 8 characters):");
    if (!newPass || newPass.length < 8) {
        alert("Password must be at least 8 characters.");
        return;
    }

    user.password = newPass;
    setRegistrationData(users);
    alert("Password updated successfully.");
}

/*  SECTION 2: REGISTRATION (Registration.html)*/

function initRegistration() {
    const regForm = document.getElementById("regForm");
    if (!regForm) return; // not on register page

    regForm.addEventListener("submit", function (e) {
        e.preventDefault();

        // Using DOM order to map fields
        const fields = regForm.querySelectorAll("input, select");
        if (fields.length < 8) {
            alert("Registration form has changed; JS mapping may need update.");
            return;
        }

        const firstName = fields[0].value.trim();
        const lastName = fields[1].value.trim();
        const dob = fields[2].value;
        const gender = fields[3].value;
        const phone = fields[4].value.trim();
        const email = fields[5].value.trim();
        const trn = fields[6].value.trim();
        const password = fields[7].value;

        // TRN format validation: 000-000-000
        const trnPattern = /^\d{3}-\d{3}-\d{3}$/;
        if (!trnPattern.test(trn)) {
            alert("TRN must be in format 000-000-000.");
            return;
        }

        // Age validation:
        const age = calculateAge(dob);
        if (age < 18) {
            alert("You must be at least 18 years old to register.");
            return;
        }

        // Password length already enforced with minlength, but double-check:
        if (password.length < 8) {
            alert("Password must be at least 8 characters long.");
            return;
        }

        // TRN uniqueness
        const users = getRegistrationData();
        const exists = users.some(u => u.trn === trn);
        if (exists) {
            alert("This TRN is already registered.");
            return;
        }

        // Build user object per assignment
        const newUser = {
            firstName,
            lastName,
            dob,
            gender,
            phone,
            email,
            trn,
            password,
            dateOfRegistration: new Date().toISOString(),
            cart: [],
            invoices: []
        };

        users.push(newUser);
        setRegistrationData(users);

        alert("Registration successful! Please log in.");
        regForm.reset();
        window.location.href = "index.html";
    });
}

/* SECTION 3: PRODUCT CATALOG (product.html)*/

const defaultProducts = [
    { 
        id: 'p1', 
        name: 'Pokémon TCG x Van Gogh Museum Pikachu with Grey Felt Hat (PSA or BGS Graded)', 
        price: 559.99, 
        image: 'Assets/image1.jpg',
        category: 'premium',
        description: 'Highly sought-after graded Pikachu card from the Van Gogh Museum collaboration.'
    },
    { 
        id: 'p2', 
        name: 'Pokémon Mega Evolution Mega Gardevoir Elite Trainer Box', 
        price: 69.99, 
        image: 'Assets/image2.jpg',
        category: 'trainer-box',
        description: 'Elite Trainer Box featuring Mega Gardevoir with exclusive accessories.'
    },
    { 
        id: 'p3', 
        name: '2025 Pokémon Mega Evolution Phantasmal Flames Elite Trainer Box', 
        price: 89.99, 
        image: 'Assets/image3.jpg',
        category: 'trainer-box',
        description: 'Latest Mega Evolution series Elite Trainer Box with Phantasmal Flames theme.'
    },
    { 
        id: 'p4', 
        name: '2025 Pokémon Mega Evolution Mega Brave & Mega Symphonia Premium Trainer Box', 
        price: 85.99, 
        image: 'Assets/image4.jpg',
        category: 'trainer-box',
        description: 'Premium Trainer Box featuring both Mega Brave and Mega Symphonia expansions.'
    },
    { 
        id: 'p5', 
        name: '2025 Pokémon Scarlet & Violet Destined Rivals Elite Trainer Box', 
        price: 91.99, 
        image: 'Assets/image5.jpg',
        category: 'trainer-box',
        description: 'Scarlet & Violet series Elite Trainer Box with Destined Rivals theme.'
    },
    { 
        id: 'p6', 
        name: 'Pokémon Mega Evolution Base Set Enhanced Booster Box (36 Boosters)', 
        price: 229.99, 
        image: 'Assets/image6.jpg',
        category: 'booster',
        description: 'Complete booster box with 36 Mega Evolution Base Set Enhanced booster packs.'
    },
    { 
        id: 'p7', 
        name: 'Pokémon Scarlet & Violet Glory of the Rocket Team Attache Case Set (With Booster Box)', 
        price: 139.99, 
        image: 'Assets/image7.jpg',
        category: 'special',
        description: 'Premium attache case set featuring Team Rocket theme with included booster box.'
    },
    { 
        id: 'p8', 
        name: '2025 Pokémon Team Rocket Moltres ex Ultra-Premium Collection', 
        price: 269.99, 
        image: 'Assets/image8.jpg',
        category: 'premium',
        description: 'Ultra-Premium Collection showcasing Team Rocket Moltres ex with exclusive items.'
    },
    { 
        id: 'p9', 
        name: '2025 Pokémon Team Rocket Prismatic Evolutions Lucario ex & Tyranitar ex Premium Collection', 
        price: 109.99, 
        image: 'Assets/image9.jpg',
        category: 'premium',
        description: 'Premium Collection featuring both Lucario ex and Tyranitar ex from Prismatic Evolutions.'
    },
    { 
        id: 'p10', 
        name: '2025 Pokémon Scarlet & Violet Prismatic Evolutions Elite Trainer Box', 
        price: 115.99, 
        image: 'Assets/image10.jpg',
        category: 'trainer-box',
        description: 'Elite Trainer Box from the Prismatic Evolutions series of Scarlet & Violet.'
    },
    { 
        id: 'p11', 
        name: '2025 Pokémon Mega Evolution Charizard X ex Ultra-Premium Collection', 
        price: 195.99, 
        image: 'Assets/image11.jpg',
        category: 'premium',
        description: 'Ultra-Premium Collection centered around the iconic Charizard X ex.'
    },
    { 
        id: 'p12', 
        name: 'Pokémon Scarlet & Violet Destined Rivals Pokemon Center Elite Trainer Box', 
        price: 339.99, 
        image: 'Assets/image12.jpg',
        category: 'trainer-box',
        description: 'Exclusive Pokemon Center edition Elite Trainer Box from the Destined Rivals series.'
    },
    { 
        id: 'p13', 
        name: 'Pokémon TCG Scarlet & Violet 151 6pk Booster Bundle', 
        price: 85.99, 
        image: 'Assets/image13.jpg',
        category: 'booster',
        description: 'Booster bundle containing 6 packs from the Scarlet & Violet 151 collection.'
    },
    { 
        id: 'p14', 
        name: 'Pokémon Scarlet & Violet Prismatic Evolutions Booster Bundle', 
        price: 52.99, 
        image: 'Assets/image14.jpg',
        category: 'booster',
        description: 'Booster bundle featuring packs from the Prismatic Evolutions series.'
    },
    { 
        id: 'p15', 
        name: '2025 Pokémon Scarlet & Violet Destined Rivals Booster Bundle', 
        price: 44.99, 
        image: 'Assets/image15.jpg',
        category: 'booster',
        description: 'Booster bundle from the latest Destined Rivals expansion.'
    },
    { 
        id: 'p16', 
        name: '2025 Pokémon Scarlet & Violet White Flare Booster Bundle', 
        price: 39.99, 
        image: 'Assets/image16.jpg',
        category: 'booster',
        description: 'Booster bundle featuring the White Flare expansion packs.'
    },
    { 
        id: 'p17', 
        name: 'Pokémon Scarlet & Violet Prismatic Evolutions', 
        price: 32.99, 
        image: 'Assets/image17.jpg',
        category: 'booster',
        description: 'Surprise Box'
    }
];

function initProductCatalog() {
    const container = document.getElementById("products-container");
    if (!container) return; // not on product catalog page

    // Ensure AllProducts exists in localStorage
    let storedProducts = JSON.parse(localStorage.getItem(ALL_PRODUCTS_KEY));
    if (!storedProducts || !Array.isArray(storedProducts) || storedProducts.length === 0) {
        storedProducts = defaultProducts;
        localStorage.setItem(ALL_PRODUCTS_KEY, JSON.stringify(storedProducts));
    }

    const searchInput = document.getElementById("search-input");
    const categoryFilter = document.getElementById("category-filter");

    function renderProducts() {
        const products = JSON.parse(localStorage.getItem(ALL_PRODUCTS_KEY)) || [];
        const searchTerm = searchInput ? searchInput.value.toLowerCase() : "";
        const category = categoryFilter ? categoryFilter.value : "all";

        const filtered = products.filter(p => {
            const matchSearch =
                p.name.toLowerCase().includes(searchTerm) ||
                p.description.toLowerCase().includes(searchTerm);
            const matchCategory = category === "all" || p.category === category;
            return matchSearch && matchCategory;
        });

        container.innerHTML = "";
        if (filtered.length === 0) {
            container.innerHTML = "<p>No products found.</p>";
            return;
        }

        filtered.forEach(prod => {
            const card = document.createElement("div");
            card.className = "product-card";

            card.innerHTML = `
                <img src="${prod.image}" alt="${prod.name}">
                <h3>${prod.name}</h3>
                <p class="price">$${prod.price.toFixed(2)}</p>
                <p>${prod.description}</p>
                <button class="btn-primary" data-id="${prod.id}">Add to Cart</button>
            `;

            container.appendChild(card);
        });

        container.querySelectorAll("button[data-id]").forEach(btn => {
            btn.addEventListener("click", function () {
                const id = this.getAttribute("data-id");   // keep as string
                addToCart(id);
            });
        });
    }

    function addToCart(productId) {
        let user = getLoggedInUser();
        if (!user) {
            alert("You must be logged in to add items to cart.");
            window.location.href = "index.html";
            return;
        }

        const products = JSON.parse(localStorage.getItem(ALL_PRODUCTS_KEY)) || [];
        const product = products.find(p => p.id == productId); 
        if (!product) {
            alert("Product not found.");
            return;
        }

        if (!Array.isArray(user.cart)) user.cart = [];
        const existing = user.cart.find(item => item.name === product.name);

        if (existing) {
            existing.qty = Number(existing.qty) + 1;
        } else {
            user.cart.push({
                name: product.name,
                price: Number(product.price),
                qty: 1
            });
        }

        setLoggedInUser(user);
        updateCartCounts();
        alert("Added to cart.");
    }

    // Search and filter handlers
    if (searchInput) {
        searchInput.addEventListener("input", renderProducts);
    }
    if (categoryFilter) {
        categoryFilter.addEventListener("change", renderProducts);
    }

    renderProducts();
}

/*  SECTION 4: CART PAGE (cart.html)*/

function initCartPage() {
    const cartTable = document.getElementById("cartTable");
    if (!cartTable) return; // not on cart page

    let user = getLoggedInUser();
    if (!user) {
        alert("You must be logged in to view your cart.");
        window.location.href = "index.html";
        return;
    }
    if (!Array.isArray(user.cart)) user.cart = [];

    // store in a local variable but always sync from user object:
    function getCart() {
        user = getLoggedInUser();
        if (!user) return [];
        if (!Array.isArray(user.cart)) user.cart = [];
        return user.cart;
    }

    function saveCart(cart) {
        user.cart = cart;
        setLoggedInUser(user);
        updateCartCounts();
    }

    function renderCart() {
        const tbody = cartTable.querySelector("tbody");
        const totalLabel = document.getElementById("grandTotal");
        const cart = getCart();

        tbody.innerHTML = "";

        let grandTotal = 0;

        cart.forEach((item, index) => {
            const calc = calculateLine(Number(item.price), Number(item.qty));
            grandTotal += calc.total;

            const row = document.createElement("tr");

            row.innerHTML = `
                <td>${item.name}</td>
                <td>${Number(item.price).toFixed(2)}</td>
                <td><input type="number" min="1" value="${item.qty}" data-index="${index}"></td>
                <td>${calc.subTotal.toFixed(2)}</td>
                <td>${calc.discount.toFixed(2)}</td>
                <td>${calc.tax.toFixed(2)}</td>
                <td>${calc.total.toFixed(2)}</td>
                <td><button data-remove="${index}">X</button></td>
            `;

            tbody.appendChild(row);
        });

        if (totalLabel) {
            totalLabel.textContent = "Grand Total: $" + grandTotal.toFixed(2);
        }

        // Event: quantity changes
        tbody.querySelectorAll("input[type='number']").forEach(inp => {
            inp.addEventListener("change", function () {
                const index = Number(this.getAttribute("data-index"));
                let newQty = Number(this.value);
                if (newQty < 1) newQty = 1;
                const cart = getCart();
                cart[index].qty = newQty;
                saveCart(cart);
                renderCart();
            });
        });

        // Event: remove item
        tbody.querySelectorAll("button[data-remove]").forEach(btn => {
            btn.addEventListener("click", function () {
                const index = Number(this.getAttribute("data-remove"));
                const cart = getCart();
                cart.splice(index, 1);
                saveCart(cart);
                renderCart();
            });
        });
    }

    // Make clearCart() available globally (for checkout)
    function clearCart() {
        const cart = [];
        saveCart(cart);
        renderCart();
    }
    // attach to window so inline onclick="clearCart()" works
    window.clearCart = clearCart;

    renderCart();
    updateCartCounts();
}

/* SECTION 5: CHECKOUT PAGE (checkout.html)*/

function initCheckoutPage() {
    const checkoutSummaryDiv = document.getElementById("checkout-summary");
    if (!checkoutSummaryDiv) return; // not on checkout page

    let user = getLoggedInUser();
    if (!user) {
        alert("You must be logged in to checkout.");
        window.location.href = "index.html";
        return;
    }
    if (!Array.isArray(user.cart) || user.cart.length === 0) {
        checkoutSummaryDiv.innerHTML = "<p>Your cart is empty.</p>";
        return;
    }

    const { itemsWithCalcs, subtotal, discount, tax, total } = calculateCartTotals(user.cart);

    // Build order summary list
    checkoutSummaryDiv.innerHTML = "";
    const list = document.createElement("ul");
    itemsWithCalcs.forEach(item => {
        const li = document.createElement("li");
        li.textContent = `${item.name} x${item.qty} - $${item.total.toFixed(2)}`;
        list.appendChild(li);
    });
    checkoutSummaryDiv.appendChild(list);

    // Set totals
    const elSub = document.getElementById("checkout-subtotal");
    const elTax = document.getElementById("checkout-tax");
    const elDisc = document.getElementById("checkout-discount");
    const elTotal = document.getElementById("totalAmount");

    if (elSub) elSub.textContent = `$${subtotal.toFixed(2)}`;
    if (elTax) elTax.textContent = `$${tax.toFixed(2)}`;
    if (elDisc) elDisc.textContent = `$${discount.toFixed(2)}`;
    if (elTotal) elTotal.textContent = `$${total.toFixed(2)}`;

    // Amount paid → calculate change
    const amountPaidInput = document.getElementById("amountPaid");
    const changeReturnedInput = document.getElementById("changeReturned");

    if (amountPaidInput && changeReturnedInput) {
        amountPaidInput.addEventListener("input", function () {
            const paid = Number(this.value) || 0;
            const change = paid - total;
            changeReturnedInput.value = change >= 0 ? change.toFixed(2) : "0.00";
        });
    }

    // Store totals in session storage for confirmOrder to use
    const checkoutTotals = { subtotal, discount, tax, total };
    sessionStorage.setItem("checkoutTotals", JSON.stringify(checkoutTotals));

    updateCartCounts();
}

/** Confirm Order – used by checkout.html onclick */
function confirmOrder() {
    const checkoutForm = document.getElementById("checkoutForm");
    if (!checkoutForm) return;

    let user = getLoggedInUser();
    if (!user) {
        alert("You must be logged in.");
        window.location.href = "index.html";
        return;
    }

    if (!Array.isArray(user.cart) || user.cart.length === 0) {
        alert("Your cart is empty.");
        return;
    }

    // Retrieve form values (using element ids from your HTML)
    const fullName = document.getElementById("fullName")?.value.trim();
    const trn = document.getElementById("trn")?.value.trim();
    const email = document.getElementById("email")?.value.trim();
    const address = document.getElementById("address")?.value.trim();
    const city = document.getElementById("city")?.value.trim();
    const zipCode = document.getElementById("zipCode")?.value.trim();
    const amountPaid = Number(document.getElementById("amountPaid")?.value || 0);
    const changeReturned = Number(document.getElementById("changeReturned")?.value || 0);

    if (!fullName || !trn || !email || !address || !city || !zipCode) {
        alert("Please fill in all shipping information.");
        return;
    }

    const totals = JSON.parse(sessionStorage.getItem("checkoutTotals"));
    if (!totals) {
        alert("Checkout totals missing; please refresh the page.");
        return;
    }

    const { itemsWithCalcs, subtotal, discount, tax, total } = calculateCartTotals(user.cart);

    if (amountPaid < total) {
        const proceed = confirm("Amount paid is less than total amount due. Continue?");
        if (!proceed) return;
    }

    // Build invoice object
    const invoiceNumber = "INV-" + Date.now();
    const invoiceDate = new Date().toISOString().split("T")[0];

    const invoice = {
        companyName: "Cirrus Trading Cards",
        invoiceNumber,
        invoiceDate,
        trn,
        shipping: {
            fullName,
            email,
            address,
            city,
            zipCode
        },
        items: itemsWithCalcs.map(i => ({
            name: i.name,
            qty: i.qty,
            price: i.price,
            discount: i.discount,
            tax: i.tax,
            lineTotal: i.total
        })),
        subtotal,
        discount,
        tax,
        total,
        amountPaid,
        changeReturned
    };

    // Save invoice to user.invoices and AllInvoices
    if (!Array.isArray(user.invoices)) user.invoices = [];
    user.invoices.push(invoice);
    setLoggedInUser(user);

    let allInv = getAllInvoices();
    allInv.push(invoice);
    setAllInvoices(allInv);

    // Save last invoice for display on invoice.html
    localStorage.setItem("lastInvoice", JSON.stringify(invoice));

    // Clear cart
    user.cart = [];
    setLoggedInUser(user);
    updateCartCounts();

    alert("Order confirmed! Generating invoice...");
    window.location.href = "invoice.html";
}

/*  SECTION 6: INVOICE PAGE (invoice.html)*/

function initInvoicePage() {
    const invoiceItemsTbody = document.getElementById("invoice-items");
    if (!invoiceItemsTbody) return; // not on invoice page

    let invoice = JSON.parse(localStorage.getItem("lastInvoice"));
    if (!invoice) {
        const allInv = getAllInvoices();
        invoice = allInv[allInv.length - 1];
    }
    if (!invoice) {
        invoiceItemsTbody.innerHTML = "<tr><td colspan='4'>No invoice found.</td></tr>";
        return;
    }

    // Fill header info
    const invNum = document.getElementById("invoice-number");
    const invDate = document.getElementById("invoice-date");
    const invTrn = document.getElementById("invoice-trn");
    if (invNum) invNum.textContent = invoice.invoiceNumber;
    if (invDate) invDate.textContent = invoice.invoiceDate;
    if (invTrn) invTrn.textContent = invoice.trn;

    // Shipping info
    const cName = document.getElementById("customer-name");
    const cEmail = document.getElementById("customer-email");
    const cAddress = document.getElementById("customer-address");
    const cCity = document.getElementById("customer-city");

    if (cName) cName.textContent = invoice.shipping.fullName;
    if (cEmail) cEmail.textContent = invoice.shipping.email;
    if (cAddress) cAddress.textContent = invoice.shipping.address;
    if (cCity) cCity.textContent = `${invoice.shipping.city} ${invoice.shipping.zipCode}`;

    // Items table
    invoiceItemsTbody.innerHTML = "";
    invoice.items.forEach(item => {
        const row = document.createElement("tr");
        row.innerHTML = `
            <td>${item.name}</td>
            <td>${item.qty}</td>
            <td>$${Number(item.price).toFixed(2)}</td>
            <td>$${Number(item.lineTotal).toFixed(2)}</td>
        `;
        invoiceItemsTbody.appendChild(row);
    });

    // Totals
    const invSub = document.getElementById("invoice-subtotal");
    const invDisc = document.getElementById("invoice-discount");
    const invTax = document.getElementById("invoice-tax");
    const invTotal = document.getElementById("invoice-total");
    const invPaid = document.getElementById("invoice-amount-paid");
    const invChange = document.getElementById("invoice-change-returned");

    if (invSub) invSub.textContent = `$${invoice.subtotal.toFixed(2)}`;
    if (invDisc) invDisc.textContent = `$${invoice.discount.toFixed(2)}`;
    if (invTax) invTax.textContent = `$${invoice.tax.toFixed(2)}`;
    if (invTotal) invTotal.textContent = `$${invoice.total.toFixed(2)}`;
    if (invPaid) invPaid.textContent = `$${invoice.amountPaid.toFixed(2)}`;
    if (invChange) invChange.textContent = `$${invoice.changeReturned.toFixed(2)}`;
}

/*  SECTION 7: DASHBOARD + USER STATS (dashboard.html)*/

function loadDashboard() {
    const user = getLoggedInUser();
    const welcomeMsg = document.getElementById("welcomeMsg");
    const profileName = document.getElementById("profileName");
    const profileEmail = document.getElementById("profileEmail");

    if (user && welcomeMsg) {
        welcomeMsg.textContent = `Welcome, ${user.firstName || ""} ${user.lastName || ""}`.trim();
    }
    if (profileName && user) {
        profileName.textContent = `${user.firstName} ${user.lastName}`;
    }
    if (profileEmail && user) {
        profileEmail.textContent = user.email || "Not set";
    }

    updateCartCounts();
}

/** Logout user – used in dashboard nav */
function logoutUser() {
    localStorage.removeItem(LOGGED_IN_KEY);
    updateCartCounts();
    window.location.href = "index.html";
}

/** ShowUserFrequency() – gender & age groups */
function ShowUserFrequency() {
    const users = getRegistrationData();

    const genderCounts = { Male: 0, Female: 0, Other: 0 };
    const ageGroups = { "18-25": 0, "26-35": 0, "36-50": 0, "50+": 0 };

    users.forEach(u => {
        // Gender
        const g = (u.gender || "").toLowerCase();
        if (g === "male") genderCounts.Male++;
        else if (g === "female") genderCounts.Female++;
        else genderCounts.Other++;

        // Age group
        const age = calculateAge(u.dob);
        if (age >= 18 && age <= 25) ageGroups["18-25"]++;
        else if (age <= 35) ageGroups["26-35"]++;
        else if (age <= 50) ageGroups["36-50"]++;
        else if (age > 50) ageGroups["50+"]++;
    });

    console.log("Gender Frequency:", genderCounts);
    console.log("Age Group Frequency:", ageGroups);
    // Display as simple bar charts
    const genderDiv = document.getElementById("genderChart");
    const ageDiv = document.getElementById("ageChart");

    function createBarRow(label, value) {
        const row = document.createElement("div");
        row.className = "freq-row";
        row.innerHTML = `
            <span class="freq-label">${label}</span>
            <span class="freq-bar" style="display:inline-block; height:16px; width:${value * 20}px; background:#f90; margin-left:8px;"></span>
            <span class="freq-value"> ${value}</span>
        `;
        return row;
    }

    if (genderDiv) {
        genderDiv.innerHTML = "";
        Object.entries(genderCounts).forEach(([label, value]) => {
            genderDiv.appendChild(createBarRow(label, value));
        });
    }

    if (ageDiv) {
        ageDiv.innerHTML = "";
        Object.entries(ageGroups).forEach(([label, value]) => {
            ageDiv.appendChild(createBarRow(label, value));
        });
    }
}

/** ShowInvoices() – all invoices + TRN search via console.log */
function ShowInvoices() {
    const allInv = getAllInvoices();
    console.log("All Invoices:", allInv);

    const trn = prompt("Enter TRN to search invoices (or Cancel to see all only):");
    if (trn) {
        const filtered = allInv.filter(inv => inv.trn === trn);
        console.log(`Invoices for TRN ${trn}:`, filtered);
    }

    const listDiv = document.getElementById("invoiceList");
    if (listDiv) {
        listDiv.innerHTML = "";
        allInv.forEach(inv => {
            const p = document.createElement("p");
            p.textContent = `${inv.invoiceNumber} | ${inv.invoiceDate} | TRN: ${inv.trn} | Total: $${inv.total.toFixed(2)}`;
            listDiv.appendChild(p);
        });
    }
}

/** GetUserInvoices() – shows invoices for one TRN (from RegistrationData) */
function GetUserInvoices() {
    const trn = prompt("Enter TRN to get user invoices:");
    if (!trn) return;

    const users = getRegistrationData();
    const user = users.find(u => u.trn === trn);

    if (!user) {
        console.log("No user found for TRN:", trn);
        alert("No user found for that TRN.");
        return;
    }

    console.log(`Invoices for ${user.firstName} ${user.lastName} (${trn}):`, user.invoices || []);

    const userInvDiv = document.getElementById("userInvoiceList");
    if (userInvDiv) {
        userInvDiv.innerHTML = "";
        (user.invoices || []).forEach(inv => {
            const p = document.createElement("p");
            p.textContent = `${inv.invoiceNumber} | ${inv.invoiceDate} | Total: $${inv.total.toFixed(2)}`;
            userInvDiv.appendChild(p);
        });
    }
}

function showDashboardLink() {
    const user = getLoggedInUser();
    const dashLink = document.getElementById("dashboardLink");

    if (dashLink) {
        dashLink.style.display = user ? "inline-block" : "none";
    }
}


/*  INITIALISER – runs on every page */

document.addEventListener("DOMContentLoaded", function () {
    initLogin();
    initRegistration();
    initProductCatalog();
    initCartPage();
    initCheckoutPage();
    initInvoicePage();
    updateCartCounts();
    showDashboardLink();
});

// Make certain functions available globally for inline HTML onclicks
window.resetPassword = resetPassword;
window.confirmOrder = confirmOrder;
window.loadDashboard = loadDashboard;
window.logoutUser = logoutUser;
window.ShowUserFrequency = ShowUserFrequency;
window.ShowInvoices = ShowInvoices;
window.GetUserInvoices = GetUserInvoices;
// clearCart is attached in initCartPage as window.clearCart
