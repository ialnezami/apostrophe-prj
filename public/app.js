const API_BASE_URL = window.location.origin;

let currentUser = null;
let authToken = null;

const state = {
    currentPage: 'login',
    users: [],
    isAdmin: false
};

function showPage(pageId) {
    document.querySelectorAll('.page').forEach(page => {
        page.classList.add('hidden');
        page.classList.remove('active');
    });
    const page = document.getElementById(pageId);
    if (page) {
        page.classList.remove('hidden');
        page.classList.add('active');
        state.currentPage = pageId;
    }
}

function showLoading(show = true) {
    const overlay = document.getElementById('loadingOverlay');
    if (show) {
        overlay.classList.remove('hidden');
    } else {
        overlay.classList.add('hidden');
    }
}

function showToast(message, type = 'success') {
    const container = document.getElementById('toastContainer');
    const toast = document.createElement('div');
    toast.className = `bg-white p-4 rounded-lg shadow-2xl min-w-[300px] border-l-4 ${
        type === 'success' ? 'border-green-500' : 'border-red-500'
    } animate-slide-in`;
    
    toast.innerHTML = `
        <div class="flex items-center gap-3">
            <span class="text-2xl">${type === 'success' ? '✅' : '❌'}</span>
            <p class="text-gray-800 font-medium">${message}</p>
        </div>
    `;
    
    container.appendChild(toast);
    
    setTimeout(() => {
        toast.style.animation = 'slide-out 0.3s ease-out';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

function showError(elementId, message) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
        errorEl.textContent = message;
        errorEl.classList.remove('hidden');
    }
}

function hideError(elementId) {
    const errorEl = document.getElementById(elementId);
    if (errorEl) {
        errorEl.classList.add('hidden');
    }
}

async function apiRequest(endpoint, options = {}) {
    const url = `${API_BASE_URL}${endpoint}`;
    const config = {
        headers: {
            'Content-Type': 'application/json',
            ...options.headers
        },
        ...options
    };

    if (authToken) {
        config.headers['Authorization'] = `Bearer ${authToken}`;
    }

    try {
        const response = await fetch(url, config);
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.message || data.errors?.[0]?.message || 'An error occurred');
        }
        
        return data;
    } catch (error) {
        throw error;
    }
}

document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError('loginError');
    showLoading(true);

    try {
        const email = document.getElementById('loginEmail').value;
        const password = document.getElementById('loginPassword').value;

        const response = await apiRequest('/api/users/login', {
            method: 'POST',
            body: JSON.stringify({ email, password })
        });

        authToken = response.data.token;
        currentUser = response.data.user;
        state.isAdmin = currentUser.role === 'admin';

        localStorage.setItem('authToken', authToken);
        localStorage.setItem('currentUser', JSON.stringify(currentUser));

        showToast('Login successful!', 'success');
        loadDashboard();
    } catch (error) {
        showError('loginError', error.message);
    } finally {
        showLoading(false);
    }
});

document.getElementById('signupForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError('signupError');
    showLoading(true);

    try {
        const name = document.getElementById('signupName').value;
        const email = document.getElementById('signupEmail').value;
        const password = document.getElementById('signupPassword').value;
        const confirmPassword = document.getElementById('signupConfirmPassword').value;

        if (password !== confirmPassword) {
            throw new Error('Passwords do not match');
        }

        const response = await apiRequest('/api/users/signup', {
            method: 'POST',
            body: JSON.stringify({ name, email, password, confirmPassword })
        });

        showToast('Account created successfully! Please login.', 'success');
        setTimeout(() => {
            document.getElementById('showLogin').click();
        }, 1500);
    } catch (error) {
        showError('signupError', error.message);
    } finally {
        showLoading(false);
    }
});

document.getElementById('showSignup').addEventListener('click', (e) => {
    e.preventDefault();
    showPage('signupPage');
    hideError('loginError');
});

document.getElementById('showLogin').addEventListener('click', (e) => {
    e.preventDefault();
    showPage('loginPage');
    hideError('signupError');
});

document.getElementById('logoutBtn').addEventListener('click', () => {
    authToken = null;
    currentUser = null;
    state.isAdmin = false;
    localStorage.removeItem('authToken');
    localStorage.removeItem('currentUser');
    showPage('loginPage');
    showToast('Logged out successfully', 'success');
});

async function loadUsers() {
    if (!state.isAdmin) return;
    
    showLoading(true);
    try {
        const response = await apiRequest('/api/users/list');
        state.users = response.data;
        renderUsers();
        document.getElementById('userCount').textContent = `${state.users.length} user${state.users.length !== 1 ? 's' : ''}`;
    } catch (error) {
        showToast('Failed to load users: ' + error.message, 'error');
    } finally {
        showLoading(false);
    }
}

function renderUsers() {
    const container = document.getElementById('usersList');
    if (state.users.length === 0) {
        container.innerHTML = '<p class="text-gray-500 col-span-full text-center py-8">No users found</p>';
        return;
    }

    container.innerHTML = state.users.map(user => `
        <div class="bg-gray-50 border-2 border-gray-200 rounded-xl p-5 hover:border-indigo-500 hover:shadow-xl transition-all cursor-pointer transform hover:-translate-y-1" onclick="openUserModal('${user._id}')">
            <div class="flex justify-between items-start mb-3">
                <h4 class="text-xl font-semibold text-gray-800">${user.name}</h4>
                <span class="px-3 py-1 rounded-full text-xs font-bold uppercase ${
                    user.role === 'admin' 
                        ? 'bg-yellow-100 text-yellow-800' 
                        : 'bg-blue-100 text-blue-800'
                }">${user.role}</span>
            </div>
            <p class="text-gray-600 text-sm mb-2">${user.email}</p>
            <p class="text-gray-400 text-xs">Created: ${new Date(user.createdAt).toLocaleDateString()}</p>
        </div>
    `).join('');
}

function openUserModal(userId) {
    const user = state.users.find(u => u._id === userId);
    if (!user) return;

    document.getElementById('modalUserId').value = user._id;
    document.getElementById('modalName').value = user.name;
    document.getElementById('modalEmail').value = user.email;
    document.getElementById('modalRole').value = user.role;
    document.getElementById('modalPassword').value = '';
    document.getElementById('modalConfirmPassword').value = '';
    
    const deleteBtn = document.getElementById('deleteUserBtn');
    if (state.isAdmin && user._id !== currentUser._id) {
        deleteBtn.classList.remove('hidden');
    } else {
        deleteBtn.classList.add('hidden');
    }

    const roleSelect = document.getElementById('modalRole');
    if (!state.isAdmin) {
        roleSelect.disabled = true;
    } else {
        roleSelect.disabled = false;
    }

    document.getElementById('userModal').classList.remove('hidden');
    hideError('modalError');
}

document.getElementById('closeModal').addEventListener('click', () => {
    document.getElementById('userModal').classList.add('hidden');
});

document.getElementById('cancelModal').addEventListener('click', () => {
    document.getElementById('userModal').classList.add('hidden');
});

document.getElementById('userForm').addEventListener('submit', async (e) => {
    e.preventDefault();
    hideError('modalError');
    showLoading(true);

    try {
        const userId = document.getElementById('modalUserId').value;
        const updateData = {
            name: document.getElementById('modalName').value,
            email: document.getElementById('modalEmail').value
        };

        if (state.isAdmin) {
            updateData.role = document.getElementById('modalRole').value;
        }

        const password = document.getElementById('modalPassword').value;
        const confirmPassword = document.getElementById('modalConfirmPassword').value;

        if (password) {
            if (password !== confirmPassword) {
                throw new Error('Passwords do not match');
            }
            updateData.password = password;
            updateData.confirmPassword = confirmPassword;
        }

        await apiRequest(`/api/users/${userId}`, {
            method: 'PUT',
            body: JSON.stringify(updateData)
        });

        showToast('User updated successfully!', 'success');
        document.getElementById('userModal').classList.add('hidden');
        await loadUsers();
    } catch (error) {
        showError('modalError', error.message);
    } finally {
        showLoading(false);
    }
});

document.getElementById('deleteUserBtn').addEventListener('click', async () => {
    if (!confirm('Are you sure you want to delete this user?')) return;

    showLoading(true);
    try {
        const userId = document.getElementById('modalUserId').value;
        await apiRequest(`/api/users/${userId}`, {
            method: 'DELETE'
        });

        showToast('User deleted successfully!', 'success');
        document.getElementById('userModal').classList.add('hidden');
        await loadUsers();
    } catch (error) {
        showError('modalError', error.message);
    } finally {
        showLoading(false);
    }
});

document.getElementById('refreshBtn').addEventListener('click', loadUsers);

function loadDashboard() {
    if (!authToken || !currentUser) {
        showPage('loginPage');
        return;
    }

    state.isAdmin = currentUser.role === 'admin';
    
    const userInfo = document.getElementById('userInfo');
    userInfo.textContent = `${currentUser.name} (${currentUser.role})`;
    
    const logoutBtn = document.getElementById('logoutBtn');
    logoutBtn.classList.remove('hidden');

    const adminActions = document.getElementById('adminActions');
    if (state.isAdmin) {
        adminActions.classList.remove('hidden');
        loadUsers();
    } else {
        adminActions.classList.add('hidden');
    }

    showPage('dashboardPage');
}

function checkAuth() {
    const savedToken = localStorage.getItem('authToken');
    const savedUser = localStorage.getItem('currentUser');

    if (savedToken && savedUser) {
        authToken = savedToken;
        currentUser = JSON.parse(savedUser);
        loadDashboard();
    } else {
        showPage('loginPage');
    }
}

window.openUserModal = openUserModal;

checkAuth();

