// Элементы
const timerElement = document.querySelector('.timer');
const startButton = document.querySelector('.start');
const stopButton = document.querySelector('.stop');
const resetButton = document.querySelector('.reset');
const randomImgButton = document.querySelector('.random');
const customTimer = document.querySelector('.custom_timer_content');
const modalContainer = document.getElementById('custom_timer_container')
const openBtn = document.getElementById('custom')
const closeBtn = document.querySelectorAll('.close_modal')
const btnOk = document.querySelector('.btn_ok');
const btnCancel = document.querySelector('.btn_cancel');
const focusButton = document.querySelector('.btn_focus');
const shortBreakButton = document.querySelector('.btn_short_break');
const longBreakButton = document.querySelector('.btn_long_break');
const mainImg = document.querySelector('.main_img');

// Поля ввода для кастомного времени
const focusMinutesInput = document.querySelector('.focus-minutes');
const shortBreakMinutesInput = document.querySelector('.short-break-minutes');
const longBreakMinutesInput = document.querySelector('.long-break-minutes');

// Аудио
const focusSound = document.querySelector('#focus_sound');
const shortBreakSound = document.querySelector('#short_break_sound');
const longBreakSound = document.querySelector('#long_break_sound');

// Обработка ошибок загрузки звуков
focusSound.onerror = () => console.error('Ошибка загрузки звука focus_end.mp3');
shortBreakSound.onerror = () => console.error('Ошибка загрузки звука short_break_sound.mp3');
longBreakSound.onerror = () => console.error('Ошибка загрузки звука long_break_end.mp3');

// Переменные для таймера
let focusTime = 25 * 60; // 25 минут по умолчанию (в секундах)
let shortBreakTime = 5 * 60; // 5 минут по умолчанию (в секундах)
let longBreakTime = 15 * 60; // 15 минут по умолчанию (в секундах)
let currentTime = focusTime; // Текущее время (начинаем с Focus)
let isRunning = false; // Состояние таймера (запущен/остановлен)
let timerInterval; // Интервал для таймера
let currentMode = 'focus'; // Текущий режим: 'focus', 'shortBreak', 'longBreak'
let cycleCount = 0; // Счетчик циклов Focus → Short Break

// Функция для форматирования времени
function formatTime(seconds) {
     const minutes = Math.floor(seconds / 60);
     const secs = seconds % 60;
     return `${String(minutes).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
}

// Обновление отображения времени
function updateTimer() {
     timerElement.textContent = formatTime(currentTime);

     if (currentTime > 0 && isRunning) {
          currentTime--;
     } else if (currentTime === 0 && isRunning) {
          // Время вышло, переключаем режим
          if (currentMode === 'focus') {
               focusSound.play(); // Звук окончания Focus
               cycleCount++; // Увеличиваем счетчик циклов
               if (cycleCount % 4 === 0) {
                    // После 4 циклов Focus → Short Break переходим в Long Break
                    currentMode = 'longBreak';
                    currentTime = longBreakTime;
                    focusButton.classList.remove('active');
                    shortBreakButton.classList.remove('active');
                    longBreakButton.classList.add('active');
               } else {
                    // Иначе переходим в Short Break
                    currentMode = 'shortBreak';
                    currentTime = shortBreakTime;
                    focusButton.classList.remove('active');
                    shortBreakButton.classList.add('active');
                    longBreakButton.classList.remove('active');
               }
          } else if (currentMode === 'shortBreak') {
               shortBreakSound.play(); // Звук окончания Short Break
               currentMode = 'focus';
               currentTime = focusTime;
               focusButton.classList.add('active');
               shortBreakButton.classList.remove('active');
               longBreakButton.classList.remove('active');
          } else if (currentMode === 'longBreak') {
               longBreakSound.play(); // Звук окончания Long Break
               currentMode = 'focus';
               currentTime = focusTime;
               focusButton.classList.add('active');
               shortBreakButton.classList.remove('active');
               longBreakButton.classList.remove('active');
          }
          timerElement.textContent = formatTime(currentTime);
     }
}

// Запуск таймера
startButton.addEventListener('click', () => {
     if (!isRunning) {
          isRunning = true;
          startButton.classList.add('active');
          stopButton.classList.remove('active');
          timerInterval = setInterval(updateTimer, 1000);
     }
});

// Остановка таймера
stopButton.addEventListener('click', () => {
     if (isRunning) {
          isRunning = false;
          startButton.classList.remove('active');
          stopButton.classList.add('active');
          clearInterval(timerInterval);
     }
});

// Сброс таймера
resetButton.addEventListener('click', () => {
     isRunning = false;
     clearInterval(timerInterval);
     startButton.classList.add('active');
     stopButton.classList.remove('active');
     cycleCount = 0; // Сбрасываем счетчик циклов
     if (currentMode === 'focus') {
          currentTime = focusTime;
     } else if (currentMode === 'shortBreak') {
          currentTime = shortBreakTime;
     } else if (currentMode === 'longBreak') {
          currentTime = longBreakTime;
     }
     timerElement.textContent = formatTime(currentTime);
});

// Смена изображения
randomImgButton.addEventListener('click', () => {
     let random = Math.floor(Math.random() * 22) + 1;
     mainImg.src = `./img/${random}.jpg`;
});

/*=============== SHOW MODAL ===============*/
function showModal() {
     if(openBtn && modalContainer){
          openBtn.addEventListener('click', ()=>{
               modalContainer.classList.add('show_modal')
          })
     }
}
showModal()

/*=============== CLOSE MODAL ===============*/
function closeModal(){
    modalContainer.classList.remove('show_modal')
}
closeBtn.forEach(c => c.addEventListener('click', closeModal))

// Подтверждение кастомного времени
btnOk.addEventListener('click', () => {
     const focusMinutes = parseFloat(focusMinutesInput.value) || 0;
     const shortBreakMinutes = parseFloat(shortBreakMinutesInput.value) || 0;
     const longBreakMinutes = parseFloat(longBreakMinutesInput.value) || 0;

     // Устанавливаем минимум 1 секунду, если время 0
     focusTime = Math.max(focusMinutes * 60, 1);
     shortBreakTime = Math.max(shortBreakMinutes * 60, 1);
     longBreakTime = Math.max(longBreakMinutes * 60, 1);

     // Обновляем текущее время в зависимости от режима
     if (currentMode === 'focus') {
          currentTime = focusTime;
     } else if (currentMode === 'shortBreak') {
          currentTime = shortBreakTime;
     } else if (currentMode === 'longBreak') {
          currentTime = longBreakTime;
     }

     timerElement.textContent = formatTime(currentTime);
     modalContainer.classList.remove('show_modal')
});

// Отмена кастомного времени
btnCancel.addEventListener('click', () => {
     focusMinutesInput.value = '25';
     shortBreakMinutesInput.value = '5';
     longBreakMinutesInput.value = '15';
     focusTime = 25 * 60; // Сбрасываем время
     shortBreakTime = 5 * 60;
     longBreakTime = 15 * 60;
     if (currentMode === 'focus') {
          currentTime = focusTime;
     } else if (currentMode === 'shortBreak') {
          currentTime = shortBreakTime;
     } else if (currentMode === 'longBreak') {
          currentTime = longBreakTime;
     }
     timerElement.textContent = formatTime(currentTime);
     modalContainer.classList.remove('show_modal');
});

// Переключение на режим Focus
focusButton.addEventListener('click', () => {
     if (currentMode !== 'focus') {
          currentMode = 'focus';
          currentTime = focusTime;
          timerElement.textContent = formatTime(currentTime);
          focusButton.classList.add('active');
          shortBreakButton.classList.remove('active');
          longBreakButton.classList.remove('active');
          if (isRunning) {
               clearInterval(timerInterval);
               timerInterval = setInterval(updateTimer, 1000);
          }
     }
});

// Переключение на режим Short Break
shortBreakButton.addEventListener('click', () => {
     if (currentMode !== 'shortBreak') {
          currentMode = 'shortBreak';
          currentTime = shortBreakTime;
          timerElement.textContent = formatTime(currentTime);
          focusButton.classList.remove('active');
          shortBreakButton.classList.add('active');
          longBreakButton.classList.remove('active');
          if (isRunning) {
               clearInterval(timerInterval);
               timerInterval = setInterval(updateTimer, 1000);
          }
     }
});

// Переключение на режим Long Break
longBreakButton.addEventListener('click', () => {
     if (currentMode !== 'longBreak') {
          currentMode = 'longBreak';
          currentTime = longBreakTime;
          timerElement.textContent = formatTime(currentTime);
          focusButton.classList.remove('active');
          shortBreakButton.classList.remove('active');
          longBreakButton.classList.add('active');
          if (isRunning) {
               clearInterval(timerInterval);
               timerInterval = setInterval(updateTimer, 1000);
          }
     }
});

// Инициализация
timerElement.textContent = formatTime(currentTime);