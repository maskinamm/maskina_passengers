// ===== ОСНОВНАЯ ВЕРСИЯ - С МИКРОАНИМАЦИЯМИ =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('Запуск...');
    
    // ===== СОЗДАЕМ ПОЛЬЗОВАТЕЛЕЙ =====
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
        { 
            login: 'ivanov2026', 
            password: 'qwerty123', 
            fullName: 'Иванов Иван Иванович', 
            birthDate: '1985-05-15', 
            phone: '+79001234567', 
            email: 'ivanov@mail.ru', 
            role: 'user' 
        },
        { 
            login: 'petrov2026', 
            password: 'password123', 
            fullName: 'Петров Петр Петрович', 
            birthDate: '1990-03-20', 
            phone: '+79007654321', 
            email: 'petrov@mail.ru', 
            role: 'user' 
        }
    ];
    localStorage.setItem('users', JSON.stringify(users));
    
    if (!localStorage.getItem('applications')) {
        localStorage.setItem('applications', JSON.stringify([]));
    }

    console.log('Пользователи созданы');
    
    // Определяем страницу
    const page = window.location.pathname.split('/').pop();
    console.log('Страница:', page);

    // Запускаем нужную функцию
    if (page === 'login.html' || page === '') {
        initLogin();
    } else if (page === 'register.html') {
        initRegister();
    } else if (page === 'profile.html') {
        initProfile();
    } else if (page === 'application.html') {
        initApplication();
    } else if (page === 'admin.html') {
        initAdmin();
    } else {
        initIndex();
    }
});

// ===== ВСПОМОГАТЕЛЬНЫЕ ФУНКЦИИ =====
function getUsers() {
    return JSON.parse(localStorage.getItem('users')) || [];
}

function getApplications() {
    return JSON.parse(localStorage.getItem('applications')) || [];
}

function setApplications(apps) {
    localStorage.setItem('applications', JSON.stringify(apps));
}

function findUser(login) {
    const users = getUsers();
    for (var i = 0; i < users.length; i++) {
        if (users[i].login === login) {
            return users[i];
        }
    }
    return null;
}

function saveUserToSession(user) {
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    console.log('Сохранен в сессии:', user);
}

function getSessionUser() {
    var user = JSON.parse(sessionStorage.getItem('currentUser') || 'null');
    console.log('Из сессии:', user);
    return user;
}

function logout() {
    sessionStorage.removeItem('currentUser');
    window.location.href = 'login.html';
}

function generateId() {
    return Date.now() + Math.random().toString(36).substring(2, 8);
}

// ===== СЛАЙДЕР =====
function initSlider() {
    var slidesWrapper = document.querySelector('.slider-slides');
    var slides = document.querySelectorAll('.slider-slide');
    var dots = document.querySelectorAll('.slider-dot');
    var prevBtn = document.querySelector('.slider-btn.prev');
    var nextBtn = document.querySelector('.slider-btn.next');
    var currentSlide = 0;
    var totalSlides = slides.length;
    var autoSlideInterval;

    if (!slidesWrapper || totalSlides === 0) return;

    function goToSlide(index) {
        if (index < 0) index = totalSlides - 1;
        if (index >= totalSlides) index = 0;
        currentSlide = index;
        
        slidesWrapper.style.transform = 'translateX(-' + (currentSlide * 100) + '%)';
        
        for (var i = 0; i < dots.length; i++) {
            if (i === currentSlide) {
                dots[i].classList.add('active');
            } else {
                dots[i].classList.remove('active');
            }
        }
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

    if (prevBtn) {
        prevBtn.addEventListener('click', function(e) {
            e.preventDefault();
            prevSlide();
            startAutoSlide();
        });
    }
    
    if (nextBtn) {
        nextBtn.addEventListener('click', function(e) {
            e.preventDefault();
            nextSlide();
            startAutoSlide();
        });
    }

    for (var i = 0; i < dots.length; i++) {
        (function(index) {
            dots[index].addEventListener('click', function() {
                goToSlide(index);
                startAutoSlide();
            });
        })(i);
    }

    var container = document.querySelector('.slider-container');
    if (container) {
        container.addEventListener('mouseenter', stopAutoSlide);
        container.addEventListener('mouseleave', startAutoSlide);
        container.addEventListener('touchstart', stopAutoSlide);
        container.addEventListener('touchend', startAutoSlide);
    }

    goToSlide(0);
    startAutoSlide();
}

// ===== СТРАНИЦА ВХОДА =====
function initLogin() {
    console.log('Страница входа');
    
    var form = document.getElementById('loginForm');
    var message = document.getElementById('loginMessage');
    
    if (!form) {
        console.log('Форма не найдена');
        return;
    }
    
    var loginInput = document.getElementById('login');
    var passwordInput = document.getElementById('password');
    if (loginInput) loginInput.value = '';
    if (passwordInput) passwordInput.value = '';
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        var login = document.getElementById('login').value.trim();
        var password = document.getElementById('password').value;
        
        console.log('Вход:', login);
        
        var user = findUser(login);
        
        if (!user) {
            message.innerHTML = '<div class="alert alert-danger fade-in-up">Пользователь с таким логином не найден.</div>';
            return;
        }
        
        if (user.password !== password) {
            message.innerHTML = '<div class="alert alert-danger fade-in-up">Неверный пароль.</div>';
            return;
        }
        
        saveUserToSession(user);
        message.innerHTML = '<div class="alert alert-success fade-in-up">Вход выполнен успешно!</div>';
        
        setTimeout(function() {
            if (user.role === 'admin') {
                window.location.href = 'admin.html';
            } else {
                window.location.href = 'profile.html';
            }
        }, 500);
    });
}

// ===== РЕГИСТРАЦИЯ =====
function initRegister() {
    console.log('Страница регистрации');
    
    var form = document.getElementById('registerForm');
    var message = document.getElementById('registerMessage');
    
    if (!form) return;
    
    var loginInput = document.getElementById('login');
    var passwordInput = document.getElementById('password');
    var fullNameInput = document.getElementById('fullName');
    var birthDateInput = document.getElementById('birthDate');
    var phoneInput = document.getElementById('phone');
    var emailInput = document.getElementById('email');
    
    if (loginInput) loginInput.value = '';
    if (passwordInput) passwordInput.value = '';
    if (fullNameInput) fullNameInput.value = '';
    if (birthDateInput) birthDateInput.value = '';
    if (phoneInput) phoneInput.value = '';
    if (emailInput) emailInput.value = '';
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        var login = document.getElementById('login').value.trim();
        var password = document.getElementById('password').value;
        var fullName = document.getElementById('fullName').value.trim();
        var birthDate = document.getElementById('birthDate').value;
        var phone = document.getElementById('phone').value.trim();
        var email = document.getElementById('email').value.trim();
        
        var errors = [];
        
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
            message.innerHTML = '<div class="alert alert-danger fade-in-up">' + errors.join('<br>') + '</div>';
            return;
        }
        
        var users = getUsers();
        users.push({ 
            login: login, 
            password: password, 
            fullName: fullName, 
            birthDate: birthDate, 
            phone: phone, 
            email: email, 
            role: 'user' 
        });
        localStorage.setItem('users', JSON.stringify(users));
        
        message.innerHTML = '<div class="alert alert-success fade-in-up">Регистрация успешна! Теперь вы можете <a href="login.html">войти</a>.</div>';
        form.reset();
    });
}

// ===== ПРОФИЛЬ =====
function initProfile() {
    console.log('Страница профиля');
    
    var user = getSessionUser();
    
    if (!user) {
        console.log('Нет пользователя, перенаправление на логин');
        window.location.href = 'login.html';
        return;
    }
    
    if (user.role === 'admin') {
        console.log('Админ пытается зайти в профиль, перенаправляем в админку');
        window.location.href = 'admin.html';
        return;
    }
    
    console.log('Пользователь найден:', user.fullName);
    
    initSlider();
    
    var nameElement = document.getElementById('userName');
    if (nameElement) {
        nameElement.textContent = user.fullName;
        console.log('Имя отображено');
    }
    
    showApplications(user.login);
    
    var feedbackBtn = document.getElementById('feedbackBtn');
    var feedbackSelect = document.getElementById('feedbackAppSelect');
    var feedbackText = document.getElementById('feedbackText');
    var saveFeedbackBtn = document.getElementById('saveFeedback');
    var feedbackModalElement = document.getElementById('feedbackModal');
    
    if (feedbackModalElement) {
        var feedbackModal = new bootstrap.Modal(feedbackModalElement);
        
        function updateFeedbackSelect() {
            var allApps = getApplications();
            console.log('Все заявки:', allApps);
            
            var apps = allApps.filter(function(a) {
                return a.userId === user.login && a.status === 'Обучение завершено' && !a.feedback;
            });
            
            console.log('Доступно для отзыва:', apps);
            
            feedbackSelect.innerHTML = '<option value="">Выберите заявку</option>';
            
            for (var i = 0; i < apps.length; i++) {
                var opt = document.createElement('option');
                opt.value = apps[i].id;
                opt.textContent = 'Заявка ' + apps[i].id.slice(-6) + ' (' + apps[i].transport + ')';
                feedbackSelect.appendChild(opt);
            }
            
            if (apps.length === 0) {
                feedbackBtn.disabled = true;
                feedbackBtn.title = 'Нет завершённых заявок без отзыва';
                console.log('Кнопка отзыва ОТКЛЮЧЕНА');
            } else {
                feedbackBtn.disabled = false;
                console.log('Кнопка отзыва ВКЛЮЧЕНА');
            }
        }
        
        updateFeedbackSelect();
        
        feedbackBtn.addEventListener('click', function() {
            console.log('Кнопка отзыва нажата');
            if (feedbackSelect.options.length > 1) {
                feedbackModal.show();
            } else {
                alert('Нет доступных заявок для отзыва.');
            }
        });
        
        saveFeedbackBtn.addEventListener('click', function() {
            var appId = feedbackSelect.value;
            var text = feedbackText.value.trim();
            
            console.log('Сохранение отзыва. appId:', appId, 'text:', text);
            
            if (!appId || !text) {
                alert('Выберите заявку и введите текст отзыва.');
                return;
            }
            
            var apps = getApplications();
            var app = null;
            for (var i = 0; i < apps.length; i++) {
                if (apps[i].id === appId) {
                    app = apps[i];
                    break;
                }
            }
            
            if (app) {
                app.feedback = text;
                setApplications(apps);
                feedbackModal.hide();
                showApplications(user.login);
                updateFeedbackSelect();
                feedbackText.value = '';
                var msg = document.getElementById('feedbackMessage');
                if (msg) msg.innerHTML = '<div class="alert alert-success fade-in-up">Отзыв сохранён!</div>';
                console.log('Отзыв сохранён!');
            } else {
                alert('Ошибка: заявка не найдена.');
            }
        });
    } else {
        console.log('Модальное окно feedbackModal не найдено!');
    }
}

function showApplications(userLogin) {
    var container = document.getElementById('applicationsList');
    if (!container) return;
    
    var apps = getApplications().filter(function(a) { return a.userId === userLogin; });
    
    if (apps.length === 0) {
        container.innerHTML = 
            '<div class="text-center py-4 fade-in-up">' +
                '<p class="text-muted">У вас пока нет заявок.</p>' +
                '<a href="application.html" class="btn btn-primary">Подать заявку</a>' +
            '</div>';
        return;
    }
    
    var html = '<div class="table-responsive"><table class="table table-striped table-row-hover"><thead><tr>' +
        '<th>Транспорт</th>' +
        '<th>Дата</th>' +
        '<th>Оплата</th>' +
        '<th>Статус</th>' +
        '<th>Отзыв</th>' +
        '</tr></thead><tbody>';
    
    for (var i = 0; i < apps.length; i++) {
        var a = apps[i];
        var statusClass = a.status === 'Новая' ? 'secondary' : a.status === 'Идет обучение' ? 'warning' : 'success';
        var feedbackText = a.feedback || '—';
        html += '<tr class="fade-in-up-delay-' + ((i % 4) + 1) + '">' +
            '<td><strong>' + a.transport + '</strong></td>' +
            '<td>' + a.date + '</td>' +
            '<td>' + a.payment + '</td>' +
            '<td><span class="badge bg-' + statusClass + '">' + a.status + '</span></td>' +
            '<td>' + feedbackText + '</td>' +
            '</tr>';
    }
    
    html += '</tbody></table></div>';
    container.innerHTML = html;
}

// ===== АДМИНКА =====
function initAdmin() {
    console.log('Страница администратора');
    
    var user = getSessionUser();
    
    if (!user) {
        console.log('Нет пользователя');
        window.location.href = 'login.html';
        return;
    }
    
    if (user.role !== 'admin') {
        alert('У вас нет прав доступа к этой странице.');
        window.location.href = 'profile.html';
        return;
    }
    
    console.log('Администратор:', user.fullName);
    
    var container = document.getElementById('adminAppsContainer');
    if (!container) return;
    
    var apps = getApplications();
    
    if (apps.length === 0) {
        container.innerHTML = '<p class="text-muted fade-in-up">Нет заявок</p>';
        return;
    }
    
    var html = '<div class="table-responsive"><table class="table table-striped table-row-hover"><thead><tr>' +
        '<th>Пользователь</th>' +
        '<th>Транспорт</th>' +
        '<th>Дата</th>' +
        '<th>Оплата</th>' +
        '<th>Статус</th>' +
        '<th>Действие</th>' +
        '</tr></thead><tbody>';
    
    for (var i = 0; i < apps.length; i++) {
        var a = apps[i];
        var userFound = findUser(a.userId);
        var userName = userFound ? userFound.fullName : a.userId;
        var statusClass = a.status === 'Новая' ? 'secondary' : a.status === 'Идет обучение' ? 'warning' : 'success';
        
        html += '<tr class="fade-in-up-delay-' + ((i % 4) + 1) + '">' +
            '<td><strong>' + userName + '</strong></td>' +
            '<td>' + a.transport + '</td>' +
            '<td>' + a.date + '</td>' +
            '<td>' + a.payment + '</td>' +
            '<td><span class="badge bg-' + statusClass + '">' + a.status + '</span></td>' +
            '<td>' +
                '<select class="form-select form-select-sm status-change" data-id="' + a.id + '">' +
                    '<option value="Новая"' + (a.status === 'Новая' ? ' selected' : '') + '>Новая</option>' +
                    '<option value="Идет обучение"' + (a.status === 'Идет обучение' ? ' selected' : '') + '>Идет обучение</option>' +
                    '<option value="Обучение завершено"' + (a.status === 'Обучение завершено' ? ' selected' : '') + '>Обучение завершено</option>' +
                '</select>' +
            '</td>' +
            '</tr>';
    }
    
    html += '</tbody></table></div>';
    container.innerHTML = html;
    
    var selects = document.querySelectorAll('.status-change');
    for (var i = 0; i < selects.length; i++) {
        selects[i].addEventListener('change', function(e) {
            var id = this.getAttribute('data-id');
            var newStatus = this.value;
            var appsAll = getApplications();
            var app = null;
            for (var j = 0; j < appsAll.length; j++) {
                if (appsAll[j].id === id) {
                    app = appsAll[j];
                    break;
                }
            }
            if (app) {
                app.status = newStatus;
                setApplications(appsAll);
                showNotification('Статус заявки изменён на "' + newStatus + '"');
                initAdmin();
            }
        });
    }
    
    var adminLogout = document.getElementById('adminLogout');
    if (adminLogout) {
        adminLogout.addEventListener('click', logout);
    }
}

// ===== УВЕДОМЛЕНИЯ С МИКРОАНИМАЦИЕЙ =====
function showNotification(message) {
    var alertDiv = document.createElement('div');
    alertDiv.className = 'alert alert-success alert-dismissible fade show notification-slide position-fixed top-0 end-0 m-3';
    alertDiv.style.zIndex = 1050;
    alertDiv.style.borderRadius = '12px';
    alertDiv.style.boxShadow = '0 4px 20px rgba(0,0,0,0.15)';
    alertDiv.style.maxWidth = '400px';
    alertDiv.innerHTML = message + ' <button type="button" class="btn-close" data-bs-dismiss="alert"></button>';
    document.body.appendChild(alertDiv);
    
    setTimeout(function() {
        alertDiv.remove();
    }, 3000);
}

// ===== ЗАЯВКА =====
function initApplication() {
    console.log('Страница заявки');
    
    var user = getSessionUser();
    
    if (!user) {
        window.location.href = 'login.html';
        return;
    }
    
    if (user.role === 'admin') {
        console.log('Админ пытается подать заявку, перенаправляем в админку');
        window.location.href = 'admin.html';
        return;
    }
    
    var form = document.getElementById('applicationForm');
    var message = document.getElementById('applicationMessage');
    
    if (!form) return;
    
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        var transport = document.getElementById('transport').value;
        var date = document.getElementById('date').value;
        var payment = document.getElementById('payment').value;
        
        if (!transport || !date || !payment) {
            message.innerHTML = '<div class="alert alert-danger fade-in-up">Заполните все поля.</div>';
            return;
        }
        
        var apps = getApplications();
        apps.push({
            id: generateId(),
            userId: user.login,
            transport: transport,
            date: date,
            payment: payment,
            status: 'Новая',
            feedback: ''
        });
        setApplications(apps);
        
        message.innerHTML = '<div class="alert alert-success fade-in-up">Заявка успешно отправлена!</div>';
        form.reset();
    });
}

// ===== ГЛАВНАЯ =====
function initIndex() {
    console.log('Главная страница');
    
    var user = getSessionUser();
    var welcome = document.getElementById('welcomeMessage');
    
    if (!welcome) return;
    
    if (user) {
        var buttonUrl = (user.role === 'admin') ? 'admin.html' : 'profile.html';
        var buttonText = (user.role === 'admin') ? 'Перейти в админку' : 'Перейти в профиль';
        
        welcome.innerHTML = 
            '<div class="alert alert-success fade-in-up">' +
                'Добро пожаловать, ' + user.fullName + '! ' +
                '<a href="' + buttonUrl + '" class="btn btn-primary btn-sm ms-2">' + buttonText + '</a>' +
            '</div>';
    } else {
        welcome.innerHTML = 
            '<div class="alert alert-info fade-in-up">' +
                'Добро пожаловать на портал "Пассажирам.РФ". ' +
                '<a href="login.html" class="btn btn-primary btn-sm ms-2">Войти</a>' +
                '<a href="register.html" class="btn btn-outline-primary btn-sm ms-2">Зарегистрироваться</a>' +
            '</div>';
    }
}