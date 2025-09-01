// ---------------- LOCAL STORAGE FUNCTIONS ----------------
        const DB = {
            get(key) {
                try {
                    return JSON.parse(localStorage.getItem(key) || 'null');
                } catch (e) {
                    return null;
                }
            },
            set(key, value) {
                localStorage.setItem(key, JSON.stringify(value));
            },
            push(key, item) {
                const arr = DB.get(key) || [];
                arr.push(item);
                DB.set(key, arr);
            }
        };
        

        function ensureSeed() {
            if (!DB.get('donations')) DB.set('donations', []);
            if (!DB.get('requests')) DB.set('requests', []);
            if (!DB.get('users')) DB.set('users', []);
            
            // Add sample data if empty
            if (DB.get('donations').length === 0) {
                DB.set('donations', [
                    {
                        itemName: "Math Textbooks",
                        itemType: "books",
                        quantity: 50,
                        condition: "like-new",
                        location: "San Francisco, CA",
                        description: "Gently used algebra and geometry textbooks from our recent curriculum update",
                        donor: "john.doe@example.com",
                        createdAt: new Date().toISOString()
                    },
                    {
                        itemName: "Laptops",
                        itemType: "electronics",
                        quantity: 10,
                        condition: "good",
                        location: "Austin, TX",
                        description: "Refurbished laptops suitable for student use",
                        donor: "sarah.williams@example.com",
                        createdAt: new Date(Date.now() - 86400000).toISOString()
                    }
                ]);
            }
            
            if (DB.get('requests').length === 0) {
                DB.set('requests', [
                    {
                        orgName: "Lincoln High School",
                        orgType: "school",
                        resourceType: "books",
                        quantity: 100,
                        location: "Chicago, IL",
                        description: "We need literature books for our 10th grade English classes",
                        requester: "michael.johnson@lincoln.edu",
                        createdAt: new Date().toISOString()
                    },
                    {
                        orgName: "Community Learning Center",
                        orgType: "community-center",
                        resourceType: "supplies",
                        quantity: 200,
                        location: "Detroit, MI",
                        description: "Art supplies for our after-school program for underserved youth",
                        requester: "maria.garcia@communitycenter.org",
                        createdAt: new Date(Date.now() - 172800000).toISOString()
                    }
                ]);
            }
        }

        // ---------------- DOM ELEMENTS ----------------
        const loginBtn = document.getElementById('login-btn');
        const registerBtn = document.getElementById('register-btn');
        const donateBtn = document.getElementById('donate-btn');
        const requestBtn = document.getElementById('request-btn');
        const getStartedBtn = document.getElementById('get-started-btn');
        const ctaDonateBtn = document.getElementById('cta-donate-btn');
        const ctaRequestBtn = document.getElementById('cta-request-btn');
        const viewCommunityBtn = document.getElementById('view-community-btn');
        const switchToRegister = document.getElementById('switch-to-register');
        const switchToLogin = document.getElementById('switch-to-login');
        
        const loginModal = document.getElementById('login-modal');
        const registerModal = document.getElementById('register-modal');
        const donateModal = document.getElementById('donate-modal');
        const requestModal = document.getElementById('request-modal');
        const fullImpactModal = document.getElementById('full-impact-modal');
        
        const closeModalButtons = document.querySelectorAll('.close-modal');
        const loginForm = document.getElementById('login-form');
        const registerForm = document.getElementById('register-form');
        const donateForm = document.getElementById('donate-form');
        const requestForm = document.getElementById('request-form');
        const newsletterForm = document.getElementById('newsletter-form');
        
        const notification = document.getElementById('notification');
        const notificationText = document.getElementById('notification-text');
        
        const tabBtns = document.querySelectorAll('.tab-btn');
        const tabContents = document.querySelectorAll('.tab-content');
        const communityTabBtns = document.querySelectorAll('.community-tab-btn');
        const communityTabContents = document.querySelectorAll('.community-tab-content');
        const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
        const navMenu = document.querySelector('.nav-menu');
        
        const impactSection = document.getElementById('impact');
        const communityPage = document.getElementById('community-page');

        // ---------------- MODAL FUNCTIONS ----------------
        function openModal(modal) {
            modal.style.display = 'flex';
            document.body.style.overflow = 'hidden';
        }
        
        function closeModal(modal) {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto';
        }
        
        function showNotification(message, type = 'success') {
            notificationText.textContent = message;
            notification.style.backgroundColor = type === 'success' ? 'var(--secondary)' : 'var(--accent)';
            notification.style.display = 'block';
            
            setTimeout(() => {
                notification.style.display = 'none';
            }, 3000);
        }

        // ---------------- PAGE NAVIGATION FUNCTIONS ----------------
        function showCommunityPage() {
            // Hide all main sections
            document.querySelectorAll('section:not(.community-page)').forEach(section => {
                section.style.display = 'none';
            });
            
            // Show community page
            communityPage.style.display = 'block';
            
            // Render community data
            renderCommunityPage();
            
            // Scroll to top
            window.scrollTo(0, 0);
        }
        
        function showImpactSection() {
            // Show all main sections
            document.querySelectorAll('section').forEach(section => {
                section.style.display = 'block';
            });
            
            // Hide community page
            communityPage.style.display = 'none';
            
            // Scroll to impact section
            document.getElementById('impact').scrollIntoView({ behavior: 'smooth' });
        }

        // ---------------- EVENT LISTENERS ----------------
        loginBtn.addEventListener('click', () => openModal(loginModal));
        registerBtn.addEventListener('click', () => openModal(registerModal));
        donateBtn.addEventListener('click', () => openModal(donateModal));
        requestBtn.addEventListener('click', () => openModal(requestModal));
        getStartedBtn.addEventListener('click', () => openModal(registerModal));
        ctaDonateBtn.addEventListener('click', () => openModal(donateModal));
        ctaRequestBtn.addEventListener('click', () => openModal(requestModal));
        viewCommunityBtn.addEventListener('click', (e) => {
            e.preventDefault();
            showCommunityPage();
        });

        switchToRegister.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal(loginModal);
            openModal(registerModal);
        });

        switchToLogin.addEventListener('click', (e) => {
            e.preventDefault();
            closeModal(registerModal);
            openModal(loginModal);
        });

        closeModalButtons.forEach(button => {
            button.addEventListener('click', () => {
                const modal = button.closest('.modal');
                closeModal(modal);
            });
        });

        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) closeModal(e.target);
        });

        // ---------------- AUTH FUNCTIONS ----------------
        loginForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const email = document.getElementById("email").value;
            const password = document.getElementById("password").value;
            const users = DB.get('users') || [];

            const user = users.find(u => u.email === email && u.password === password);
            if (user) {
                DB.set('currentUser', user);
                showNotification(`Welcome back, ${user.name || user.email}!`, "success");
                updateNavbar();
                setTimeout(() => closeModal(loginModal), 2000);
            } else {
                showNotification("Invalid email or password", "error");
            }
        });

        registerForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const name = document.getElementById("register-name").value;
            const email = document.getElementById("register-email").value;
            const password = document.getElementById("register-password").value;
            const userType = document.getElementById("user-type").value;
            
            const users = DB.get('users') || [];
            
            // Check if user already exists
            if (users.find(u => u.email === email)) {
                showNotification("User with this email already exists", "error");
                return;
            }
            
            const newUser = {
                name,
                email,
                password,
                userType,
                createdAt: new Date().toISOString()
            };
            
            users.push(newUser);
            DB.set('users', users);
            DB.set('currentUser', newUser);
            
            showNotification(`Account created! You are registered as a ${userType}.`, "success");
            updateNavbar();
            setTimeout(() => closeModal(registerModal), 2000);
        });

        // ---------------- DONATE FORM ----------------
        donateForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const currentUser = DB.get('currentUser');
            
            if (!currentUser) {
                showNotification("Please sign in first", "error");
                return;
            }
            
            DB.push('donations', {
                itemName: document.getElementById("item-name").value,
                itemType: document.getElementById("item-type").value,
                quantity: parseInt(document.getElementById("item-quantity").value),
                condition: document.getElementById("item-condition").value,
                location: document.getElementById("item-location").value,
                description: document.getElementById("item-description").value,
                donor: currentUser.email,
                createdAt: new Date().toISOString()
            });

            showNotification("✅ Donation submitted successfully!", "success");
            donateForm.reset();
            
            // Close the modal and show community page after a delay
            setTimeout(() => {
                closeModal(donateModal);
                showCommunityPage();
            }, 1500);
        });

        // ---------------- REQUEST FORM ----------------
        requestForm.addEventListener("submit", (e) => {
            e.preventDefault();
            const currentUser = DB.get('currentUser');
            
            DB.push('requests', {
                orgName: document.getElementById("org-name").value,
                orgType: document.getElementById("org-type").value,
                resourceType: document.getElementById("resource-type").value,
                quantity: parseInt(document.getElementById("resource-quantity").value),
                location: document.getElementById("org-location").value,
                description: document.getElementById("resource-description").value,
                requester: currentUser ? currentUser.email : "guest",
                createdAt: new Date().toISOString()
            });

            showNotification("✅ Request submitted successfully!", "success");
            requestForm.reset();
            
            // Close the modal and show community page after a delay
            setTimeout(() => {
                closeModal(requestModal);
                showCommunityPage();
            }, 1500);
        });

        // ---------------- NEWSLETTER ----------------
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const email = e.target.querySelector('input[type="email"]').value;
            showNotification(`Thank you for subscribing with ${email}!`, 'success');
            e.target.reset();
        });

        // ---------------- TABS ----------------
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                tabContents.forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                const tabId = btn.getAttribute('data-tab');
                document.getElementById(`${tabId}-content`).classList.add('active');
            });
        });
        
        communityTabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                communityTabBtns.forEach(b => b.classList.remove('active'));
                communityTabContents.forEach(c => c.classList.remove('active'));
                btn.classList.add('active');
                const tabId = btn.getAttribute('data-tab');
                document.getElementById(`${tabId}-content`).classList.add('active');
            });
        });

        // ---------------- MOBILE MENU ----------------
        mobileMenuBtn.addEventListener('click', () => {
            navMenu.style.display = navMenu.style.display === 'flex' ? 'none' : 'flex';
            navMenu.style.flexDirection = 'column';
            navMenu.style.position = 'absolute';
            navMenu.style.top = '80px';
            navMenu.style.left = '0';
            navMenu.style.right = '0';
            navMenu.style.backgroundColor = 'white';
            navMenu.style.padding = '20px';
            navMenu.style.gap = '15px';
            navMenu.style.boxShadow = '0 5px 10px rgba(0, 0, 0, 0.1)';
        });

        // ---------------- NAVBAR FUNCTIONS ----------------
        function updateNavbar() {
            const currentUser = DB.get('currentUser');
            const loginBtn = document.getElementById('login-btn');
            const registerBtn = document.getElementById('register-btn');
            const userMenu = document.getElementById('user-menu');
            const username = document.getElementById('username');

            if (currentUser) {
                loginBtn.style.display = 'none';
                registerBtn.style.display = 'none';
                userMenu.style.display = 'block';
                username.textContent = currentUser.name || currentUser.email.split('@')[0];
            } else {
                loginBtn.style.display = 'inline-block';
                registerBtn.style.display = 'inline-block';
                userMenu.style.display = 'none';
            }
        }

        function toggleDropdown() {
            const dropdown = document.getElementById('dropdown');
            dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
        }

        function signOut() {
            DB.set('currentUser', null);
            showNotification('Signed out successfully', 'success');
            updateNavbar();
            document.getElementById('dropdown').style.display = 'none';
        }

        // ---------------- COMMUNITY PAGE RENDER FUNCTIONS ----------------
        function renderCommunityPage() {
            const donorList = document.getElementById('communityDonorList');
            const requesterList = document.getElementById('communityRequesterList');
            
            // Clear existing content
            donorList.innerHTML = '';
            requesterList.innerHTML = '';
            
            // Get data from localStorage
            const donations = DB.get('donations') || [];
            const requests = DB.get('requests') || [];
            
            // Render donors
            if (donations.length === 0) {
                donorList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-hand-holding-heart"></i>
                        <h3>No Donations Yet</h3>
                        <p>Be the first to donate educational resources to those in need!</p>
                        <a href="#" class="btn btn-primary" onclick="openModal(donateModal)">Donate Resources</a>
                    </div>
                `;
            } else {
                donations.forEach(donation => {
                    const donorCard = document.createElement('div');
                    donorCard.className = 'community-resource-card';
                    donorCard.innerHTML = `
                        <div class="community-resource-content">
                            <h3 class="community-resource-title">${donation.itemName}</h3>
                            <p class="community-resource-details">Type: ${donation.itemType} | Qty: ${donation.quantity}</p>
                            <p class="community-resource-details">Condition: ${donation.condition} | Location: ${donation.location}</p>
                            <p class="community-resource-description">${donation.description}</p>
                            <div class="resource-status status-available">Available</div>
                            <p class="community-resource-contact">Donor: ${donation.donor}</p>
                        </div>
                    `;
                    donorList.appendChild(donorCard);
                });
            }
            
            // Render requesters
            if (requests.length === 0) {
                requesterList.innerHTML = `
                    <div class="empty-state">
                        <i class="fas fa-hands-helping"></i>
                        <h3>No Requests Yet</h3>
                        <p>Be the first to request educational resources for your organization!</p>
                        <a href="#" class="btn btn-primary" onclick="openModal(requestModal)">Request Resources</a>
                    </div>
                `;
            } else {
                requests.forEach(request => {
                    const requesterCard = document.createElement('div');
                    requesterCard.className = 'community-resource-card';
                    requesterCard.innerHTML = `
                        <div class="community-resource-content">
                            <h3 class="community-resource-title">${request.orgName}</h3>
                            <p class="community-resource-details">Type: ${request.orgType} | Need: ${request.resourceType}</p>
                            <p class="community-resource-details">Qty: ${request.quantity} | Location: ${request.location}</p>
                            <p class="community-resource-description">${request.description}</p>
                            <div class="resource-status status-matched">Needs Help</div>
                            <p class="community-resource-contact">Contact: ${request.requester}</p>
                        </div>
                    `;
                    requesterList.appendChild(requesterCard);
                });
            }
        }

        // ---------------- IMPACT REPORT FUNCTION ----------------
        function viewFullImpactReport() {
            openModal(fullImpactModal);
        }

        // Initialize the app
        document.addEventListener("DOMContentLoaded", () => {
            ensureSeed();
            updateNavbar();
        });