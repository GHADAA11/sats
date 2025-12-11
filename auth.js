/**
 * auth.js
 * Handle registration and form submission
 */

document.addEventListener('DOMContentLoaded', () => {
    const registerForm = document.getElementById('registerForm');
    const loginForm = document.getElementById('loginForm');
    const messageDiv = document.getElementById('message');

    if (registerForm) {
        registerForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('name').value;
            const studentId = document.getElementById('studentId').value;
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            // Simple validation
            if (!name || !studentId || !email || !password) {
                showMessage('Please fill in all fields.', 'error');
                return;
            }

            const newUser = {
                name,
                studentId,
                email,
                password, // In a real app, hash this!
                registeredAt: new Date().toISOString()
            };

            const result = DataManager.saveUser(newUser);

            if (result.success) {
                // Auto login after registration
                DataManager.loginUser(email, password);
                showMessage('Registration successful! Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1500);
            } else {
                showMessage(result.message, 'error');
            }
        });
    }

    if (loginForm) {
        loginForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;

            if (!email || !password) {
                showMessage('Please fill in all fields.', 'error');
                return;
            }

            const result = DataManager.loginUser(email, password);

            if (result.success) {
                showMessage('Login successful! Redirecting...', 'success');
                setTimeout(() => {
                    window.location.href = 'index.html';
                }, 1000);
            } else {
                showMessage(result.message, 'error');
            }
        });
    }

    function showMessage(text, type) {
        messageDiv.textContent = text;
        messageDiv.className = type === 'error' ? 'mb-1 text-center text-danger' : 'mb-1 text-center text-success';
    }
});
