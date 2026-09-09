// ==============================================
// СВАДЕБНЫЙ САЙТ - ДАНИЛ & ЯНА
// Интеграция с Google Sheets
// ==============================================

document.addEventListener('DOMContentLoaded', function() {
    
    // ========== ПЛАВНАЯ ПРОКРУТКА ==========
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const invitationMessage = document.querySelector('.invitation-message');
            if (invitationMessage) {
                invitationMessage.scrollIntoView({ 
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    }
    
    // ========== ИНИЦИАЛИЗАЦИЯ ФОРМЫ ==========
    initRSVPForm();
    
    function initRSVPForm() {
        const form = document.getElementById('rsvpForm');
        if (!form) {
            console.error('❌ Форма с id="rsvpForm" не найдена!');
            return;
        }
        
        console.log('✅ Форма найдена, инициализация...');
        
        const nameInput = document.getElementById('name');
        const attendanceSelect = document.getElementById('attendance');
        const messageInput = document.getElementById('message');
        const submitBtn = form.querySelector('.submit-btn');
        const formMessage = document.getElementById('formMessage');
        
        // Убираем старый обработчик, если был
        form.onsubmit = null;
        
        form.addEventListener('submit', async function(e) {
            e.preventDefault();
            
            if (window.isSubmitting) return;
            
            // Получаем значения
            const name = nameInput ? nameInput.value.trim() : '';
            const attendance = attendanceSelect ? attendanceSelect.value : '';
            const message = messageInput ? messageInput.value.trim() : '';
            
            console.log('📝 Имя:', name);
            console.log('📝 Присутствие:', attendance);
            
            // Валидация
            if (!name) {
                showModal('Ошибка', 'Пожалуйста, введите ваше имя', true);
                if (nameInput) {
                    nameInput.focus();
                    nameInput.style.borderColor = '#c62828';
                    setTimeout(() => {
                        nameInput.style.borderColor = '';
                    }, 2000);
                }
                return;
            }
            
            if (!attendance) {
                showModal('Ошибка', 'Пожалуйста, выберите вариант присутствия', true);
                if (attendanceSelect) {
                    attendanceSelect.style.borderColor = '#c62828';
                    setTimeout(() => {
                        attendanceSelect.style.borderColor = '';
                    }, 2000);
                }
                return;
            }
            
            // Блокируем кнопку
            window.isSubmitting = true;
            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Отправка...';
            }
            
            showLoading();
            
            try {
                const formData = { 
                    name: name, 
                    attendance: attendance,
                    message: message
                };
                
                const result = await sendToGoogleSheets(formData);
                
                hideLoading();
                
                if (result.result === 'success') {
                    let responseMessage = '';
                    if (attendance === 'yes' || attendance === 'plusone' || attendance === 'family') {
                        responseMessage = `Спасибо, ${name}! Будем ждать вас на нашей свадьбе 17 октября 2026 года! 🎉`;
                    } else {
                        responseMessage = `Спасибо за ответ, ${name}! Очень жаль, что вы не сможете быть с нами.`;
                    }
                    
                    showModal('Ответ отправлен!', responseMessage, false);
                    
                    // Очищаем форму
                    if (nameInput) nameInput.value = '';
                    if (attendanceSelect) attendanceSelect.value = '';
                    if (messageInput) messageInput.value = '';
                    
                    if (formMessage) {
                        formMessage.style.display = 'none';
                    }
                    
                    if (navigator.vibrate) navigator.vibrate([50, 30, 50]);
                } else {
                    throw new Error(result.message || 'Ошибка отправки');
                }
            } catch (error) {
                hideLoading();
                showModal('Ошибка', error.message || 'Произошла ошибка при отправке. Пожалуйста, попробуйте ещё раз.', true);
            } finally {
                window.isSubmitting = false;
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = '<i class="far fa-paper-plane"></i> Отправить ответ';
                }
            }
        });
    }
    
    // ========== МОДАЛЬНЫЕ ОКНА ==========
    function showModal(title, message, isError = false) {
        const modal = document.getElementById('customModal');
        const titleEl = document.getElementById('modalTitle');
        const msgEl = document.getElementById('modalMessage');
        const iconEl = document.getElementById('modalIcon');
        const borderEl = modal ? modal.querySelector('div:first-child') : null;
        
        if (!modal || !titleEl || !msgEl || !iconEl) return;
        
        titleEl.textContent = title;
        msgEl.textContent = message;
        
        if (isError) {
            iconEl.textContent = '✕';
            iconEl.style.color = '#c62828';
            iconEl.parentElement.style.background = '#ffebee';
            borderEl.style.borderTopColor = '#c62828';
        } else {
            iconEl.textContent = '✓';
            iconEl.style.color = '#2e7d32';
            iconEl.parentElement.style.background = '#e8f5e9';
            borderEl.style.borderTopColor = '#2e7d32';
        }
        
        modal.style.display = 'flex';
        
        if (!isError) {
            setTimeout(function() {
                closeModal();
            }, 4000);
        }
    }
    
    window.closeModal = function() {
        const modal = document.getElementById('customModal');
        if (modal) modal.style.display = 'none';
    };
    
    function showLoading() {
        const modal = document.getElementById('loadingModal');
        if (modal) modal.style.display = 'flex';
    }
    
    function hideLoading() {
        const modal = document.getElementById('loadingModal');
        if (modal) modal.style.display = 'none';
    }
    
    // ========== ОТПРАВКА В GOOGLE SHEETS ==========
    async function sendToGoogleSheets(formData) {
        // ⚠️ ЗАМЕНИТЕ ЭТОТ URL НА ВАШ URL ИЗ APPS SCRIPT ⚠️
        const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbxNwvuXxSLnT2D5XO1dWkzjeXuNPJe78xvcxH5heHNREK_nh9TO1ATY2ptJX2gT28n3yg/exec';
        
        const formBody = new URLSearchParams();
        formBody.append('name', formData.name);
        formBody.append('attendance', formData.attendance);
        if (formData.message) formBody.append('message', formData.message);
        
        const response = await fetch(SCRIPT_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
            body: formBody.toString()
        });
        
        const result = await response.json();
        return result;
    }
});
