document.addEventListener('DOMContentLoaded', function() {
    // Плавная прокрутка при клике на индикатор
    const scrollIndicator = document.querySelector('.scroll-indicator');
    if (scrollIndicator) {
        scrollIndicator.addEventListener('click', function() {
            const invitationMessage = document.querySelector('.invitation-message');
            invitationMessage.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        });
    }
    
    // Обработка формы RSVP
    const rsvpForm = document.getElementById('rsvpForm');
    const formMessage = document.getElementById('formMessage');
    
    if (rsvpForm) {
        rsvpForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Получаем значения формы
            const name = document.getElementById('name').value;
            const attendance = document.getElementById('attendance').value;
            
            // Простая имитация отправки
            formMessage.textContent = `Благодарим вас, ${name}! Ваш ответ принят. Мы свяжемся с вами для уточнения деталей.`;
            formMessage.style.display = 'block';
            formMessage.style.backgroundColor = 'rgba(180, 189, 170, 0.3)';
            formMessage.style.color = '#4a5345';
            formMessage.style.border = '1px solid rgba(162, 172, 148, 0.5)';
            
            // Сбрасываем форму
            rsvpForm.reset();
            
            // Плавная прокрутка к сообщению
            formMessage.scrollIntoView({ 
                behavior: 'smooth',
                block: 'center'
            });
            
            // Скрываем сообщение через 6 секунд
            setTimeout(() => {
                formMessage.style.display = 'none';
            }, 6000);
        });
    }
});