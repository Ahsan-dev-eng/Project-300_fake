// Wait for the entire HTML document to be loaded and parsed
document.addEventListener("DOMContentLoaded", () => {

    // ==========================================================
    // == GLOBAL FUNCTIONALITY (Runs on every page)
    // ==========================================================

    // --- Mobile menu functionality ---
    const menuOpenButton = document.querySelector("#menu-open-button");
    const menuCloseButton = document.querySelector("#menu-close-button");

    if (menuOpenButton && menuCloseButton) {
        menuOpenButton.addEventListener("click", () => {
            document.body.classList.toggle("show-mobile-menu");
        });
        menuCloseButton.addEventListener("click", () => {
            document.body.classList.remove("show-mobile-menu");
        });
    }

    // --- Active class for current page nav link ---
    const currentPage = window.location.pathname.split("/").pop() || "index.html";
    const navLinks = document.querySelectorAll(".nav-link");
    navLinks.forEach(link => {
        const linkHref = link.getAttribute("href");
        if (linkHref === currentPage) {
            link.classList.add("active");
        }
    });

    // --- Dark/Light Mode Toggle ---
    const themeToggle = document.querySelector("#themeToggle");
    if (themeToggle) {
        const html = document.documentElement;
        // Function to update the icon based on the theme
        function updateThemeIcon(theme) {
            const icon = themeToggle.querySelector("i");
            if (icon) {
                icon.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon";
            }
        }

        // Set initial theme on page load
        const currentTheme = localStorage.getItem("theme") || "light";
        html.setAttribute("data-theme", currentTheme);
        updateThemeIcon(currentTheme);

        // Add click listener to toggle theme
        themeToggle.addEventListener("click", () => {
            const newTheme = html.getAttribute("data-theme") === "light" ? "dark" : "light";
            html.setAttribute("data-theme", newTheme);
            localStorage.setItem("theme", newTheme);
            updateThemeIcon(newTheme);
        });
    }

    // --- Shopping Cart & Live Chat Toggles ---
    const cartBtn = document.querySelector("#cartBtn");
    const cartSidebar = document.querySelector("#cartSidebar");
    const cartClose = document.querySelector("#cartClose");
    if (cartBtn && cartSidebar && cartClose) {
        cartBtn.addEventListener("click", async () => {
            cartSidebar.classList.add("open");
            await showCartItems(); // Fetch and display cart items
        });
        cartClose.addEventListener("click", () => cartSidebar.classList.remove("open"));
    }

    const chatToggle = document.querySelector("#chatToggle");
    const chatContainer = document.querySelector("#chatContainer");
    const chatCloseBtn = document.querySelector("#chatClose"); // Make sure your chat close button has a unique ID if needed
    if (chatToggle && chatContainer && chatCloseBtn) {
        chatToggle.addEventListener("click", () => chatContainer.classList.toggle("open"));
        chatCloseBtn.addEventListener("click", () => chatContainer.classList.remove("open"));
    }


    // ==========================================================
    // == PAGE-SPECIFIC FUNCTIONALITY (Only runs if elements exist)
    // ==========================================================

    // --- Forms (Newsletter, Contact, Reservation) ---
    const newsletterForm = document.querySelector("#newsletterForm");
    if (newsletterForm) {
        newsletterForm.addEventListener("submit", (e) => {
            e.preventDefault();
            alert(`Thank you for subscribing!`);
            newsletterForm.reset();
        });
    }
    const contactForm = document.querySelector("#contactForm");
    if (contactForm) {
        contactForm.addEventListener("submit", (e) => {
            e.preventDefault();
            alert("Thank you for your message!");
            contactForm.reset();
        });
    }
    const reservationForm = document.querySelector("#reservationForm");
    if (reservationForm) {
        reservationForm.addEventListener("submit", (e) => {
            e.preventDefault();
            alert("Thank you for your reservation request!");
            reservationForm.reset();
        });
    }

    // --- Interactive FAQ Accordion ---
    const faqItems = document.querySelectorAll('.faq-item');
    if (faqItems.length > 0) {
        faqItems.forEach(item => {
            const question = item.querySelector('.faq-question');
            question.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                faqItems.forEach(otherItem => otherItem.classList.remove('active'));
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        });
    }

    // --- Filtering for Menu, Gallery, Events, Blog ---
    const grid = document.querySelector('.filterable-grid');
    if (grid) {
        const filterButtons = document.querySelectorAll('.filter-btn, .category-btn');
        const items = Array.from(grid.children);
        
        items.forEach(item => item.classList.add('filterable-item'));

        filterButtons.forEach(button => {
            button.addEventListener('click', () => {
                filterButtons.forEach(btn => btn.classList.remove('active'));
                button.classList.add('active');
                const filter = button.dataset.filter || button.dataset.category;

                items.forEach(item => {
                    const itemCategory = item.dataset.filter || item.dataset.category;
                    const matches = (filter === 'all' || filter === itemCategory);

                    if (matches) {
                        item.style.display = ''; // Use default display (e.g., 'grid' or 'block')
                        item.classList.remove('hide');
                    } else {
                        item.classList.add('hide');
                        setTimeout(() => {
                            item.style.display = 'none';
                        }, 400); // Must match CSS transition duration
                    }
                });
            });
        });
    }

    // --- Calendar Functionality ---
    const calendarGrid = document.getElementById("calendarGrid");
    if (calendarGrid) {
        const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
        let currentDate = new Date();

        function generateCalendar(date) {
            const year = date.getFullYear();
            const month = date.getMonth();
            const currentMonthEl = document.getElementById("currentMonth");
            if(currentMonthEl) {
                currentMonthEl.textContent = `${monthNames[month]} ${year}`;
            }
            calendarGrid.innerHTML = '';
            const firstDay = new Date(year, month, 1).getDay();
            const lastDate = new Date(year, month + 1, 0).getDate();

            for (let i = 0; i < firstDay; i++) {
                calendarGrid.innerHTML += `<div></div>`;
            }
            for (let day = 1; day <= lastDate; day++) {
                let classes = '';
                if (day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear()) {
                    classes += ' today';
                }
                if ([15, 18, 22].includes(day)) {
                    classes += ' has-event';
                }
                calendarGrid.innerHTML += `<div class="${classes}">${day}</div>`;
            }
        }
        generateCalendar(currentDate);

        const prevMonthBtn = document.getElementById("prevMonth");
        const nextMonthBtn = document.getElementById("nextMonth");
        if(prevMonthBtn) {
            prevMonthBtn.addEventListener("click", () => {
                currentDate.setMonth(currentDate.getMonth() - 1);
                generateCalendar(currentDate);
            });
        }
        if(nextMonthBtn) {
            nextMonthBtn.addEventListener("click", () => {
                currentDate.setMonth(currentDate.getMonth() + 1);
                generateCalendar(currentDate);
            });
        }
    }

    // Sign In/Sign Out toggle
    const navMenu = document.querySelector('.nav-menu');
    if (navMenu) {
        const userEmail = localStorage.getItem('userEmail');
        const signInItem = navMenu.querySelector('.login-btn');
        if (userEmail && signInItem) {
            signInItem.textContent = 'Sign Out';
            signInItem.href = '#';
            signInItem.addEventListener('click', function(e) {
                e.preventDefault();
                localStorage.removeItem('userEmail');
                alert('Signed out!');
                window.location.reload();
            });
        }
    }

    // Add to Cart functionality
    const addToCartButtons = document.querySelectorAll('.add-to-cart, .quick-add-btn');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', async () => {
            const userEmail = localStorage.getItem('userEmail');
            if (!userEmail) {
                alert('Please sign in to add items to your cart.');
                window.location.href = 'login.html';
                return;
            }
            const itemName = button.dataset.item || button.closest('.menu-item, .quick-order-item').querySelector('h3').textContent;
            const itemPrice = parseFloat(button.dataset.price) || parseFloat(button.closest('.menu-item, .quick-order-item').querySelector('.price-tag, .price').textContent.replace('$', ''));
            const item = { name: itemName, price: itemPrice, quantity: 1 };

            try {
                const res = await fetch('http://localhost:3001/api/cart/add', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: userEmail, item })
                });
                const data = await res.json();
                if (data.success) {
                    updateCartCount(data.cart.items);
                } else {
                    alert('Failed to add to cart');
                }
            } catch (err) {
                alert('Error connecting to server');
            }
        });
    });

    // Update cart count
    async function updateCartCount(items) {
        const cartCount = document.querySelector('.cart-count');
        if (cartCount) {
            if (items) {
                const total = items.reduce((sum, item) => sum + item.quantity, 0);
                cartCount.textContent = total;
            } else {
                // Fetch from backend
                const userEmail = localStorage.getItem('userEmail');
                if (!userEmail) {
                    cartCount.textContent = '0';
                    return;
                }
                try {
                    const res = await fetch(`http://localhost:3001/api/cart?email=${userEmail}`);
                    const data = await res.json();
                    if (data.success) {
                        const total = data.cart.reduce((sum, item) => sum + item.quantity, 0);
                        cartCount.textContent = total;
                    } else {
                        cartCount.textContent = '0';
                    }
                } catch {
                    cartCount.textContent = '0';
                }
            }
        }
    }

    // Initial cart count update
    updateCartCount();

    // Checkout button functionality
    const checkoutBtn = document.getElementById('checkoutBtn');
    if (checkoutBtn) {
        checkoutBtn.addEventListener('click', async () => {
            const userEmail = localStorage.getItem('userEmail');
            if (!userEmail) {
                alert('Please sign in to checkout.');
                return;
            }
            // Send request to clear cart in backend
            try {
                const res = await fetch('http://localhost:3001/api/cart/clear', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email: userEmail })
                });
                const data = await res.json();
                if (data.success) {
                    alert('Thank you for your order! Your cart has been cleared.');
                    // Clear cart UI
                    document.getElementById('cartItems').innerHTML = '<p>Your cart is empty.</p>';
                    document.getElementById('cartTotal').textContent = '$0.00';
                    const cartCount = document.querySelector('.cart-count');
                    if (cartCount) cartCount.textContent = '0';
                } else {
                    alert('Could not clear cart. Please try again.');
                }
            } catch (err) {
                alert('Error connecting to server.');
            }
        });
    }
});


const loginForm = document.getElementById('loginForm');
if (loginForm) {
    loginForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;

        try {
            const res = await fetch('http://localhost:3001/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (data.success) {
                alert('Login successful!');
                localStorage.setItem('userEmail', email); // Store login state
                window.location.href = 'index.html';
            } else {
                alert(data.message || 'Login failed');
            }
        } catch (err) {
            alert('Error connecting to server');
        }
    });
}

// Register form functionality
const registerForm = document.getElementById('registerForm');
if (registerForm) {
    registerForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        const email = document.getElementById('email').value;
        console.log(email);
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        if (password !== confirmPassword) {
            alert('Passwords do not match!');
            return;
        }

        try {
            const res = await fetch('http://localhost:3001/api/register', { // <-- FIXED ENDPOINT
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });
            const data = await res.json();
            if (data.success) {
                alert('Registration successful! You can now log in.');
                window.location.href = 'index.html';
            } else {
                alert(data.message || 'Registration failed');
            }
        } catch (err) {
            alert('Error connecting to server');
        }
    });
}

// Show all cart items in the sidebar
async function showCartItems() {
    const cartItemsContainer = document.getElementById('cartItems');
    const cartTotalSpan = document.getElementById('cartTotal');
    const userEmail = localStorage.getItem('userEmail');
    cartItemsContainer.innerHTML = ''; // Clear previous items

    if (!userEmail) {
        cartItemsContainer.innerHTML = '<p>Please sign in to view your cart.</p>';
        cartTotalSpan.textContent = '$0.00';
        return;
    }

    try {
        const res = await fetch(`http://localhost:3001/api/cart?email=${userEmail}`);
        const data = await res.json();
        if (data.success && data.cart.length > 0) {
            let total = 0;
            data.cart.forEach(item => {
                total += item.price * item.quantity;
                cartItemsContainer.innerHTML += `
                    <div class="cart-item">
                        <span class="cart-item-name">${item.name}</span>
                        <span class="cart-item-qty">x${item.quantity}</span>
                        <span class="cart-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
                    </div>
                `;
            });
            cartTotalSpan.textContent = `$${total.toFixed(2)}`;
        } else {
            cartItemsContainer.innerHTML = '<p>Your cart is empty.</p>';
            cartTotalSpan.textContent = '$0.00';
        }
    } catch (err) {
        cartItemsContainer.innerHTML = '<p>Error loading cart.</p>';
        cartTotalSpan.textContent = '$0.00';
    }
}

