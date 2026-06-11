export const API_URL = '/api';

export function getToken() {
    return localStorage.getItem('token');
}

export function setToken(token) {
    localStorage.setItem('token', token);
}

export function clearToken() {
    localStorage.removeItem('token');
}

export async function checkAuth() {
    const token = getToken();
    const currentPath = window.location.pathname;
    const isPublicPage = currentPath === '/' || currentPath.endsWith('index.html') || currentPath.endsWith('login.html');

    if (!token && !isPublicPage) {
        window.location.href = '/login.html';
        return null;
    }

    if (token) {
        try {
            const res = await fetch(`${API_URL}/user/me`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            if (res.ok) {
                const data = await res.json();
                
                // If user is logged in and visits public page, redirect to feed
                if (isPublicPage) {
                    window.location.href = '/nearconnect-home-feed.html';
                }
                return data;
            } else {
                // Token invalid
                clearToken();
                if (!isPublicPage) {
                    window.location.href = '/login.html';
                }
            }
        } catch (e) {
            console.error("Auth check failed", e);
        }
    }
    return null;
}

export function logout() {
    clearToken();
    window.location.href = '/login.html';
}

// Auto-check auth on load if the script is imported
if (typeof window !== 'undefined') {
    document.addEventListener('DOMContentLoaded', checkAuth);
}
