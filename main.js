/**
 * main.js
 * Common logic for all pages
 */

document.addEventListener('DOMContentLoaded', () => {
    updateAuthUI();
});

function updateAuthUI() {
    const user = DataManager.getCurrentUser();
    const navLinks = document.querySelector('.nav-links');

    // We can dynamically update the nav based on auth state
    // For this simple project, we might keep it static, or toggle "Login" to "Logout"

    // Example: If user is logged in, show "Logout" instead of "Register"
    // Ideally we would have a login page, but the requirement only asks for Registration.
    // We will assume Registration "logs you in" for the session.

    const loginLink = document.querySelector('a[href="register.html"]');
    if (user && loginLink) {
        loginLink.textContent = 'Logout';
        loginLink.href = '#';
        loginLink.addEventListener('click', (e) => {
            e.preventDefault();
            DataManager.logout();
            window.location.href = 'index.html';
        });

        // Add Delete Students link
        if (!document.getElementById('deleteStudentsLink')) {
            const footer = document.querySelector('footer'); // Assuming footer exists
            if (footer) {
                const deleteLink = document.createElement('a');
                deleteLink.id = 'deleteStudentsLink';
                deleteLink.href = '#';
                deleteLink.textContent = 'Delete All Students';
                deleteLink.style.display = 'block';
                deleteLink.style.marginTop = '0.5rem';
                deleteLink.style.color = 'var(--white)';
                deleteLink.style.opacity = '0.5';
                deleteLink.style.fontSize = '0.8rem';
                deleteLink.style.textDecoration = 'none';

                deleteLink.addEventListener('click', (e) => {
                    e.preventDefault();
                    if (confirm('Are you sure you want to delete ALL student accounts? This cannot be undone.')) {
                        const result = DataManager.deleteAllStudents();
                        alert(result.message);
                        window.location.reload();
                    }
                });

                footer.appendChild(deleteLink);
            }
        }

        // Add user name to nav?
        const profileLi = document.createElement('li');
        profileLi.textContent = `Hi, ${user.name}`;
        profileLi.style.color = 'var(--primary-color)';
        profileLi.style.fontWeight = 'bold';
        navLinks.prepend(profileLi);
    }
}
