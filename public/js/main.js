// Base URL for API
const API_URL = '/api/auth';

// Utility: Check if user is logged in
function isLoggedIn() {
    return !!localStorage.getItem('token');
}

// Utility: Get user data
function getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
}

// Update UI based on auth state
function updateAuthUI() {
    const navActions = document.querySelector('.nav-actions');
    if (!navActions) return;

    if (isLoggedIn()) {
        const user = getUser();
        navActions.innerHTML = `
            <span style="font-weight: 500; margin-right: 1rem;">Bonjour, ${user.name}</span>
            <button id="logout-btn" class="btn btn-outline">Déconnexion</button>
        `;

        document.getElementById('logout-btn').addEventListener('click', () => {
            localStorage.removeItem('token');
            localStorage.removeItem('user');
            window.location.href = 'index.html';
        });
    } else {
        // Original buttons are already there, but ensuring they persist or reset if needed
        // This part is tricky if we fully replace HTML, but simpler to just reload or keep static if not logged in
        // A full SPA approach would be better, but for this task, we assume page reloads or simple state
    }
}

// Login Form Handler
const loginForm = document.getElementById('login-form');
if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const errorDiv = document.getElementById('error-message');

        try {
            const res = await fetch(`${API_URL}/login`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password })
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data));

                if (data.role === 'senior') {
                    window.location.href = 'senior-dashboard.html';
                } else {
                    window.location.href = 'index.html';
                }
            } else {
                errorDiv.textContent = data.message || 'Erreur de connexion';
                errorDiv.style.display = 'block';
            }
        } catch (err) {
            errorDiv.textContent = 'Erreur serveur';
            errorDiv.style.display = 'block';
        }
    });
}

// Register Form Handler
const registerForm = document.getElementById('register-form');
if (registerForm) {
    registerForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const name = document.getElementById('name').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const role = document.getElementById('role').value;
        const errorDiv = document.getElementById('error-message');

        try {
            const res = await fetch(`${API_URL}/register`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name, email, password, role })
            });

            const data = await res.json();

            if (res.ok) {
                localStorage.setItem('token', data.token);
                localStorage.setItem('user', JSON.stringify(data));
                if (data.role === 'senior') {
                    window.location.href = 'senior-dashboard.html';
                } else {
                    window.location.href = 'index.html';
                }
            } else {
                errorDiv.textContent = data.message || "Erreur d'inscription";
                errorDiv.style.display = 'block';
            }
        } catch (err) {
            console.error(err);
            errorDiv.textContent = `Erreur: ${err.message}. Le serveur est-il démarré ?`;
            errorDiv.style.display = 'block';
        }
    });
}

/**
 * Modern Dark Tech - Parallax Micro-interactions
 * Subtle tilt effect for cards and images
 */
class ParallaxEffect {
    constructor() {
        this.elements = document.querySelectorAll('.hero-image, .step-card, .skill-card, .testimonial-card');
        this.init();
    }
    
    init() {
        this.elements.forEach(el => {
            el.addEventListener('mousemove', (e) => {
                const rect = el.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;
                
                const centerX = rect.width / 2;
                const centerY = rect.height / 2;
                
                const rotateX = (y - centerY) / 10;
                const rotateY = (centerX - x) / 10;
                
                el.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;
            });
            
            el.addEventListener('mouseleave', () => {
                el.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
            });
        });
    }
}

// Update Global Navbar Unread Badge
async function updateGlobalUnreadBadge() {
    const user = getUser();
    if (!user || !user._id) return;

    try {
        const res = await fetch(`/api/messages/unread-count?currentUserId=${user._id}`);
        const unreadMap = await res.json();
        
        let totalCount = 0;
        Object.values(unreadMap).forEach(count => {
            totalCount += count;
        });

        // Find the "Messagerie" link in ALL nav clones (mobile, desktop...)
        const chatLinks = document.querySelectorAll('a[href="chat.html"]');
        chatLinks.forEach(link => {
            let badge = link.querySelector('.nav-badge');
            
            if (totalCount > 0) {
                if (!badge) {
                    badge = document.createElement('span');
                    badge.className = 'nav-badge';
                    link.appendChild(badge);
                }
                badge.textContent = totalCount;
            } else if (badge) {
                badge.remove();
            }
        });
    } catch (err) {
        console.error('Error updating global unread badge:', err);
    }
}

// Make it globally accessible for chat.js
window.updateGlobalUnreadBadge = updateGlobalUnreadBadge;

// Run on page load
document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
    updateGlobalUnreadBadge();
    new ParallaxEffect();
    
    // Auto-update every 30 seconds if NOT on chat page (since chat page updates in realtime)
    if (!window.location.pathname.includes('chat.html')) {
        setInterval(updateGlobalUnreadBadge, 30000);
    }
});
