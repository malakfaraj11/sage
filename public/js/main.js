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

// Run on page load
document.addEventListener('DOMContentLoaded', updateAuthUI);
