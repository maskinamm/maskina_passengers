// ===== Инициализация =====
document.addEventListener('DOMContentLoaded', () => {
    // Создаём администратора, если его нет
    if (!localStorage.getItem('users')) {
        const users = [
            { 
                login: 'Admin26', 
                password: 'Demo20', 
                fullName: 'Администратор', 
                birthDate: '1990-01-01', 
                phone: '+70000000000', 
                email: 'admin@rf.ru', 
                role: 'admin' 
            },
            // ===== ДОБАВЛЕННЫЙ ПОЛЬЗОВАТЕЛЬ =====
            { 
                login: 'ivanov2026', 
                password: 'qwerty123', 
                fullName: 'Иванов Иван Иванович', 
                birthDate: '1985-05-15', 
                phone: '+79001234567', 
                email: 'ivanov@mail.ru', 
                role: 'user' 
            }
        ];
        localStorage.setItem('users', JSON.stringify(users));
    }
    if (!localStorage.getItem('applications')) {
        localStorage.setItem('applications', JSON.stringify([]));
    }

    // Текущий пользователь из sessionStorage
    const currentUser = JSON.parse(sessionStorage.getItem('currentUser') || 'null');

    // Обработчики для каждой страницы
    const page = window.location.pathname.split('/').pop();

    if (page === 'register.html') initRegister();
    else if (page === 'login.html') initLogin();
    else if (page === 'profile.html') initProfile(currentUser);
    else if (page === 'application.html') initApplication(currentUser);
    else if (page === 'admin.html') initAdmin(currentUser);
    else if (page === 'index.html') initIndex(currentUser);
});

// ===== Вспомогательные функции =====
function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
}

function setUsers(users) {
    localStorage.setItem('users', JSON.stringify(users));
}

function getApplications() {
    return JSON.parse(localStorage.getItem('applications')) || [];
}

function setApplications(apps) {
    localStorage.setItem('applications', JSON.stringify(apps));
}

function findUser(login) {
    return getUsers().find(u => u.login === login);
}

function saveCurrentUser(user) {
    sessionStorage.setItem('currentUser', JSON.stringify(user));
}

function getCurrentUser() {
    return JSON.parse(sessionStorage.getItem('currentUser') || 'null');
}

function logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

function generateId() {
    return Date.now() + Math.random().toString(36);
}

// Проверка на авторизацию
function requireAuth(redirect = 'login.html') {
    if (!getCurrentUser()) {
        window.location.href = redirect;
        return false;
    }
    return true;
}

// ===== Слайдер =====
function initSlider() {
    const slides = document.querySelectorAll('.slider-slide');
    const dots = document.querySelectorAll('.slider-dot');
    const prevBtn = document.querySelector('.slider-btn.prev');
    const nextBtn = document.querySelector('.slider-btn.next');
    let currentSlide = 0;
    let autoSlideInterval;

    if (slides.length === 0) return;

    function goToSlide(index) {
        if (index < 0) index = slides.length - 1;
        if (index >= slides.length) index = 0;
        currentSlide = index;
        
        const wrapper = document.querySelector('.slider-slides');
        wrapper.style.transform = `translateX(-${currentSlide * 100}%)`;
        
        dots.forEach((dot, i) => {
            dot.classList.toggle('active', i === currentSlide);
        });
    }

    function nextSlide() {
        goToSlide(currentSlide + 1);
    }

    function prevSlide() {
        goToSlide(currentSlide - 1);
    }

    function startAutoSlide() {
        stopAutoSlide();
        autoSlideInterval = setInterval(nextSlide, 3000);
    }

    function stopAutoSlide() {
        if (autoSlideInterval) {
            clearInterval(autoSlideInterval);
            autoSlideInterval = null;
        }
    }

    if (prevBtn) prevBtn.addEventListener('click', () => {
        prevSlide();
        startAutoSlide();
    });
    if (nextBtn) nextBtn.addEventListener('click', () => {
        nextSlide();
        startAutoSlide();
    });

    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            goToSlide(index);
            startAutoSlide();
        });
    });

    const container = document.querySelector('.slider-container');
    if (container) {
        container.addEventListener('mouseenter', stopAutoSlide);
        container.addEventListener('mouseleave', startAutoSlide);
        container.addEventListener('touchstart', stopAutoSlide);
        container.addEventListener('touchend', startAutoSlide);
    }

    goToSlide(0);
    startAutoSlide();
}

// ===== Страница регистрации =====
function initRegister() {
    const form = document.getElementById('registerForm');
    const message = document.getElementById('registerMessage');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const login = document.getElementById('login').value.trim();
        const password = document.getElementById('password').value;
        const fullName = document.getElementById('fullName').value.trim();
        const birthDate = document.getElementById('birthDate').value;
        const phone = document.getElementById('phone').value.trim();
        const email = document.getElementById('email').value.trim();

        let errors = [];
        if (!login || login.length < 6 || !/^[A-Za-z0-9]+$/.test(login)) {
            errors.push('Логин должен содержать только латинские буквы и цифры, минимум 6 символов.');
        }
        if (findUser(login)) {
            errors.push('Пользователь с таким логином уже существует.');
        }
        if (!password || password.length < 8) {
            errors.push('Пароль должен быть не менее 8 символов.');
        }
        if (!fullName) errors.push('Введите ФИО.');
        if (!birthDate) errors.push('Введите дату рождения.');
        if (!phone) errors.push('Введите номер телефона.');
        if (!email) errors.push('Введите e-mail.');

        if (errors.length > 0) {
            message.innerHTML = `<div class="alert alert-danger">${errors.join('<br>')}</div>`;
            return;
        }

        const users = getUsers();
        users.push({ login, password, fullName, birthDate, phone, email, role: 'user' });
        setUsers(users);
        message.innerHTML = `<div class="alert alert-success">Регистрация успешна! Теперь вы можете <a href="login.html">войти</a>.</div>`;
        form.reset();
    });
}

// ===== Страница входа =====
function initLogin() {
    const form = document.getElementById('loginForm');
    const message = document.getElementById('loginMessage');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const login = document.getElementById('login').value.trim();
        const password = document.getElementById('password').value;

        const user = findUser(login);
        if (!user || user.password !== password) {
            message.innerHTML = `<div class="alert alert-danger">Неверный логин или пароль.</div>`;
            return;
        }

        saveCurrentUser(user);
        if (user.role === 'admin') {
            window.location.href = 'admin.html';
        } else {
            window.location.href = 'profile.html';
        }
    });
}

// ===== Страница личного кабинета =====
function initProfile(user) {
    if (!requireAuth()) return;

    initSlider();

    document.getElementById('userName').textContent = user.fullName;
    renderUserApplications(user.login);

    const feedbackModal = new bootstrap.Modal(document.getElementById('feedbackModal'));
    const feedbackBtn = document.getElementById('feedbackBtn');
    const feedbackSelect = document.getElementById('feedbackAppSelect');
    const feedbackText = document.getElementById('feedbackText');
    const saveFeedbackBtn = document.getElementById('saveFeedback');

    function updateFeedbackSelect() {
        const apps = getApplications().filter(a => a.userId === user.login && a.status === 'Обучение завершено' && !a.feedback);
        feedbackSelect.innerHTML = '<option value="">Выберите заявку</option>';
        apps.forEach(a => {
            const opt = document.createElement('option');
            opt.value = a.id;
            opt.textContent = `Заявка №${a.id.slice(-6)} (${a.transport})`;
            feedbackSelect.appendChild(opt);
        });
        if (apps.length === 0) {
            feedbackBtn.disabled = true;
            feedbackBtn.title = 'Нет завершённых заявок без отзыва';
        } else {
            feedbackBtn.disabled = false;
        }
    }
    updateFeedbackSelect();

    feedbackBtn.addEventListener('click', () => {
        if (feedbackSelect.options.length > 1) {
            feedbackModal.show();
        }
    });

    saveFeedbackBtn.addEventListener('click', () => {
        const appId = feedbackSelect.value;
        const text = feedbackText.value.trim();
        if (!appId || !text) {
            alert('Выберите заявку и введите текст отзыва.');
            return;
        }
        let apps = getApplications();
        const app = apps.find(a => a.id === appId);
        if (app) {
            app.feedback = text;
            setApplications(apps);
            feedbackModal.hide();
            renderUserApplications(user.login);
            updateFeedbackSelect();
            feedbackText.value = '';
            document.getElementById('feedbackMessage').innerHTML = '<div class="alert alert-success">Отзыв сохранён!</div>';
        }
    });
}

function renderUserApplications(userLogin) {
    const container = document.getElementById('applicationsList');
    const apps = getApplications().filter(a => a.userId === userLogin);
    if (apps.length === 0) {
        container.innerHTML = `
            <div class="text-center py-4">
                <p class="text-muted">У вас пока нет заявок.</p>
                <a href="application.html" class="btn btn-primary">Подать заявку</a>
            </div>
        `;
        return;
    }
    let html = `<div class="table-responsive">
        <table class="table table-striped">
            <thead>
                <tr>
                    <th>Вид транспорта</th>
                    <th>Дата начала</th>
                    <th>Способ оплаты</th>
                    <th>Статус</th>
                    <th>Отзыв</th>
                </tr>
            </thead>
            <tbody>`;
    apps.forEach(a => {
        const feedback = a.feedback || '<span class="text-muted">—</span>';
        const statusClass = a.status === 'Новая' ? 'secondary' : a.status === 'Идет обучение' ? 'warning' : 'success';
        html += `<tr>
            <td><strong>${a.transport}</strong></td>
            <td>${a.date}</td>
            <td>${a.payment}</td>
            <td><span class="badge bg-${statusClass}">${a.status}</span></td>
            <td>${feedback}</td>
        </tr>`;
    });
    html += '</tbody></table></div>';
    container.innerHTML = html;
}

// ===== Страница подачи заявки =====
function initApplication(user) {
    if (!requireAuth()) return;

    const form = document.getElementById('applicationForm');
    const message = document.getElementById('applicationMessage');

    form.addEventListener('submit', (e) => {
        e.preventDefault();
        const transport = document.getElementById('transport').value;
        const date = document.getElementById('date').value;
        const payment = document.getElementById('payment').value;

        if (!transport || !date || !payment) {
            message.innerHTML = '<div class="alert alert-danger">Заполните все поля.</div>';
            return;
        }

        const dateParts = date.split('.');
        if (dateParts.length !== 3 || isNaN(dateParts[0]) || isNaN(dateParts[1]) || isNaN(dateParts[2])) {
            message.innerHTML = '<div class="alert alert-danger">Дата должна быть в формате ДД.ММ.ГГГГ.</div>';
            return;
        }

        const apps = getApplications();
        const newApp = {
            id: generateId(),
            userId: user.login,
            transport: transport,
            date: date,
            payment: payment,
            status: 'Новая',
            feedback: ''
        };
        apps.push(newApp);
        setApplications(apps);

        message.innerHTML = `<div class="alert alert-success">Заявка отправлена! Статус: Новая. Ожидайте подтверждения администратора.</div>`;
        form.reset();
    });
}

// ===== Панель администратора =====
function initAdmin(user) {
    if (!requireAuth()) return;
    if (!user || user.role !== 'admin') {
        alert('У вас нет прав доступа к этой странице.');
        window.location.href = 'profile.html';
        return;
    }

    let currentFilter = 'all';
    let currentSort = 'date';
    let currentPage = 1;
    const perPage = 5;

    const container = document.getElementById('adminAppsContainer');
    const filterSelect = document.getElementById('filterStatus');
    const sortSelect = document.getElementById('sortBy');
    const prevPageBtn = document.getElementById('prevPage');
    const nextPageBtn = document.getElementById('nextPage');
    const pageInfo = document.getElementById('pageInfo');

    function render() {
        let apps = getApplications();

        if (currentFilter !== 'all') {
            apps = apps.filter(a => a.status === currentFilter);
        }

        if (currentSort === 'date') {
            apps.sort((a, b) => a.date.localeCompare(b.date));
        } else if (currentSort === 'status') {
            apps.sort((a, b) => a.status.localeCompare(b.status));
        }

        const total = apps.length;
        const totalPages = Math.ceil(total / perPage) || 1;
        if (currentPage > totalPages) currentPage = totalPages;
        if (currentPage < 1) currentPage = 1;

        const start = (currentPage - 1) * perPage;
        const end = Math.min(start + perPage, total);
        const pageApps = apps.slice(start, end);

        // Обновляем счетчик
        const totalCount = document.getElementById('totalCount');
        if (totalCount) totalCount.textContent = total;

        if (pageApps.length === 0) {
            container.innerHTML = `
                <div class="text-center py-4">
                    <p class="text-muted">Нет заявок, соответствующих фильтру.</p>
                </div>
            `;
        } else {
            let html = `<div class="table-responsive">
                <table class="table table-striped">
                    <thead>
                        <tr>
                            <th>Пользователь</th>
                            <th>Транспорт</th>
                            <th>Дата</th>
                            <th>Оплата</th>
                            <th>Статус</th>
                            <th>Действие</th>
                        </tr>
                    </thead>
                    <tbody>`;
            pageApps.forEach(a => {
                const user = findUser(a.userId);
                const userName = user ? user.fullName : a.userId;
                const statusClass = a.status === 'Новая' ? 'secondary' : a.status === 'Идет обучение' ? 'warning' : 'success';
                html += `<tr>
                    <td><strong>${userName}</strong></td>
                    <td>${a.transport}</td>
                    <td>${a.date}</td>
                    <td>${a.payment}</td>
                    <td><span class="badge bg-${statusClass}">${a.status}</span></td>
                    <td>
                        <select class="form-select form-select-sm status-change" data-id="${a.id}" style="min-width:140px;">
                            <option value="Новая" ${a.status === 'Новая' ? 'selected' : ''}>Новая</option>
                            <option value="Идет обучение" ${a.status === 'Идет обучение' ? 'selected' : ''}>Идет обучение</option>
                            <option value="Обучение завершено" ${a.status === 'Обучение завершено' ? 'selected' : ''}>Обучение завершено</option>
                        </select>
                    </td>
                </tr>`;
            });
            html += '</tbody></table></div>';
            container.innerHTML = html;

            document.querySelectorAll('.status-change').forEach(select => {
                select.addEventListener('change', (e) => {
                    const id = e.target.dataset.id;
                    const newStatus = e.target.value;
                    let appsAll = getApplications();
                    const app = appsAll.find(a => a.id === id);
                    if (app) {
                        app.status = newStatus;
                        setApplications(appsAll);
                        showNotification(`Статус заявки изменён на "${newStatus}"`);
                        render();
                    }
                });
            });
        }

        pageInfo.textContent = `Страница ${currentPage} из ${totalPages}`;
        prevPageBtn.disabled = currentPage === 1;
        nextPageBtn.disabled = currentPage === totalPages;
    }

    filterSelect.addEventListener('change', (e) => {
        currentFilter = e.target.value;
        currentPage = 1;
        render();
    });
    sortSelect.addEventListener('change', (e) => {
        currentSort = e.target.value;
        render();
    });
    prevPageBtn.addEventListener('click', () => {
        if (currentPage > 1) { currentPage--; render(); }
    });
    nextPageBtn.addEventListener('click', () => {
        currentPage++;
        render();
    });

    render();
    document.getElementById('adminLogout').addEventListener('click', logout);
}

// ===== Уведомления =====
function showNotification(message, type = 'success') {
    const alertDiv = document.createElement('div');
    alertDiv.className = `alert alert-${type} alert-dismissible fade show position-fixed top-0 end-0 m-3`;
    alertDiv.style.zIndex = 1050;
    alertDiv.style.borderRadius = '12px';
    alertDiv.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
    alertDiv.style.maxWidth = '400px';
    alertDiv.innerHTML = `${message} <button type="button" class="btn-close" data-bs-dismiss="alert"></button>`;
    document.body.appendChild(alertDiv);
    setTimeout(() => {
        alertDiv.remove();
    }, 3000);
}

// ===== Главная страница =====
function initIndex(user) {
    const welcome = document.getElementById('welcomeMessage');
    if (user) {
        welcome.innerHTML = `
            <div class="alert alert-success">
                Добро пожаловать, <strong>${user.fullName}</strong>! 
                <a href="profile.html" class="btn btn-primary btn-sm ms-2">Перейти в личный кабинет</a>
            </div>
        `;
    } else {
        welcome.innerHTML = `
            <div class="alert alert-info">
                Добро пожаловать на портал «Пассажирам.РФ». 
                <a href="login.html" class="btn btn-primary btn-sm ms-2">Войти</a>
                <a href="register.html" class="btn btn-outline-primary btn-sm ms-2">Зарегистрироваться</a>
            </div>
        `;
    }
}