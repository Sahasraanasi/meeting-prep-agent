/**
 * Authentication Guard & Session Management
 */

(function () {
    const protectedPages = [
        'index.html',
        'contacts.html',
        'meeting.html',
        'profile.html',
        'brief.html'
    ];

    const publicPages = [
        'login.html',
        'signup.html'
    ];

    // Determine current page filename
    const path = window.location.pathname;
    let page = path.substring(path.lastIndexOf('/') + 1).toLowerCase();
    if (!page || page === '') {
        page = 'index.html';
    }

    function isAuthenticated() {
        const user = localStorage.getItem('mpa_current_user');
        const token = localStorage.getItem('token');
        return Boolean(user || token);
    }

    function checkAccess() {
        const authed = isAuthenticated();
        const isProtected = protectedPages.includes(page);
        const isPublic = publicPages.includes(page);

        if (isProtected && !authed) {
            // Unauthenticated user attempting to access protected page
            window.location.replace('login.html');
        } else if (isPublic && authed) {
            // Authenticated user attempting to visit login/signup
            window.location.replace('index.html');
        }
    }

    // 1. Check access immediately upon script evaluation
    checkAccess();

    // 2. Prevent BFCache / Back button bypass
    window.addEventListener('pageshow', function (event) {
        if (event.persisted || (window.performance && window.performance.navigation && window.performance.navigation.type === 2)) {
            checkAccess();
        }
    });

    // 3. Global logout handler
    window.logout = function () {
        // Clear all session and authentication keys (keeping user profile intact)
        localStorage.removeItem('mpa_current_user');
        localStorage.removeItem('token');
        sessionStorage.clear();

        // Redirect to login and wipe current history entry to prevent back-button re-entry
        window.location.replace('login.html');
    };

    // 4. Bind click event to any existing logout button on the page (like index.html)
    document.addEventListener('DOMContentLoaded', () => {
        const logoutBtn = document.getElementById('logoutBtn');
        if (logoutBtn) {
            logoutBtn.addEventListener('click', (e) => {
                e.preventDefault();
                window.logout();
            });
        }
    });

})();