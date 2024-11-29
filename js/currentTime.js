document.addEventListener("DOMContentLoaded", () => {
    function updateTime() {
        const timeElement = document.getElementById('current-time');
        const now = new Date();
        const formattedTime = now.toLocaleTimeString('ru-RU', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        timeElement.textContent = formattedTime;
    }
    
    // Обновляем каждую секунду
    setInterval(updateTime, 1000);
    
    // Первоначальное обновление при загрузке страницы
    updateTime();

});
