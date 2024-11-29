document.addEventListener("DOMContentLoaded", () => {
    const statusDisplay = document.getElementById("status-display");
    const logDisplay = document.getElementById("log-display");
    const fillPercentage = document.getElementById("fill-percentage");
    const rawRemaining = document.getElementById("raw-remaining");
    const packageRemaining = document.getElementById("package-remaining");
    const storageRemaining = document.getElementById("storage-remaining");
    const fillBar = document.getElementById("fill-bar");
    const rawBar = document.getElementById("raw-bar");
    const packageBar = document.getElementById("package-bar");
    const storageBar = document.getElementById("storage-bar");

    const MAX_RAW_MATERAIL = 1000;
    const MAX_PACKAGES = 100;
    const MAX_STORAGE = 100;

    let rawMaterial = 10;
    let packages = 5;
    let storage = 3;
    let fillProgress = 0;
    let packagedCount = 0;
    let isRunning = false;
    let interval;

    //Фукнция, добавляющая текст в системный журнал 
    const addLog = (message) => {
        logDisplay.innerHTML += `${message}\n`;
        logDisplay.scrollTop = logDisplay.scrollHeight;
    };

    //Функция, обновляющая значения в графиках
    const updateCharts = () => {
        //Перевод в единицы измерения
        let rawMaterialPercentage = (rawMaterial / MAX_RAW_MATERAIL) * 100;
        let packagePercentage = (packages / MAX_PACKAGES) * 100;
        let storagePercentage = (storage / MAX_STORAGE) * 100;

        fillPercentage.textContent = `${fillProgress}%`;
        fillBar.style.height = `${fillProgress}%`; // Устанавливаем высоту заполнения
        storageBar.style.height = `${storagePercentage}%`;  // Устанавливаем высоту заполнения
        rawBar.style.height = `${rawMaterialPercentage}%`;  // Устанавливаем высоту заполнения
        packageBar.style.height = `${packagePercentage}%`;
        rawRemaining.textContent = `${rawMaterial} кг`;
        packageRemaining.textContent = `${packages} шт`;
        storageRemaining.textContent = `${storage} шт`;
    };

    //Функция, сбрасывающая заполнение упаковки
    const resetFill = () => {
        fillProgress = 0;
        updateCharts();
    };

    //Функция, заполняющая упаковку
    const startFilling = () => {
        interval = setInterval(() => {
            if (storage <= 0) {
                addLog("Закончилось место на складе");
                handleEmergency("storage");
                return;
            }
            else if (rawMaterial < 10) {
                addLog("Недостаточно сырья для продолжения.");
                handleEmergency("raw");
                return;
            }
            else if (packages <= 0) {
                addLog("Недостаточно упаковок для продолжения");
                handleEmergency("packages");
                return;
            }

            fillProgress += 1; // Увеличиваем заполнение на 1% каждые 0.3 секунды.
            updateCharts();

            if (fillProgress >= 101) {
                packagedCount++;
                rawMaterial -= 10;
                packages--;
                storage--;

                addLog(`Упаковка завершена. Всего фасовано: ${packagedCount} шт.`);
                resetFill();
            }
        }, 30);
    };

    //Функция, останавливающая процесс заполнения
    const stopFilling = () => {
        clearInterval(interval);
        isRunning = false;
        statusDisplay.value = "Процесс остановлен.";
        addLog("Процесс фасовки остановлен.");
    };

    //Слушатель на кнопку ПУСК
    document.getElementById("start").addEventListener("click", () => {
        if (!isRunning) {
            isRunning = true;
            statusDisplay.value = "Процесс запущен...";
            addLog("Процесс фасовки запущен...");
            startFilling();
        }
    });

    //Слушатель на кнопку СТОП
    document.getElementById("stop").addEventListener("click", stopFilling);

    //Слушатель на кнопку ПОПОЛНИТЬ СЫРЬЕ
    document.getElementById("refill-raw").addEventListener("click", () => {
        rawMaterial = 1000;
        updateCharts();
        addLog("Сырье пополнено до 1000 кг.");
    });

    //Слушатель на кнопку ПОПОЛНИТЬ ФасУП
    document.getElementById("refill-packages").addEventListener("click", () => {
        packages = 100;
        updateCharts();
        addLog("Фасовочные упаковки пополнены до 100 шт.");
    });

    //Слушатель на кнопку ОСВОБОДИТЬ СКЛАД
    document.getElementById("refill-storage").addEventListener("click", () => {
        storage = 100;
        updateCharts();
        addLog("Склад сгружен");
    });

    // Элементы модального окна
    const emergencyModal = document.getElementById("emergency-modal");
    const emergencyMessage = document.getElementById("emergency-message");
    const closeButton = document.querySelector(".close-button");

    const showModal = (message) => {
        emergencyMessage.textContent = message;
        emergencyModal.style.display = "block"; // Показываем модальное окно
    };

    const hideModal = () => {
        emergencyModal.style.display = "none"; // Скрываем модальное окно
        emergencyModalFirst.style.display = "none";
        emergencyModalSecond.style.display = "none";
        emergencyModalThird.style.display = "none";
        emergencyModalForth.style.display = "none";
        
    };

    closeButton.addEventListener("click", hideModal);

    window.addEventListener("click", (event) => {
        if (event.target === emergencyModal) {
            hideModal(); // Закрываем окно при клике вне области содержимого
        }
    });

    //Функция, обрабатывающая автоматические аварийные ситуации
    const handleEmergency = (type) => {
        let message = "";
        switch (type) {
            case "raw":
                statusDisplay.value = "Авария: закончилось сырье!";
                addLog("АВАРИЙНАЯ СИТУАЦИЯ: сырье закончилось.");
                break;
            case "packages":
                statusDisplay.value = "Авария: закончились упаковки!";
                addLog("АВАРИЙНАЯ СИТУАЦИЯ: упаковки закончились.");
                break;
            case "storage":
                statusDisplay.value = "Авария: закончилось место на складе!";
                addLog("АВАРИЙНАЯ СИТУАЦИЯ: место на складе закончилось.");
                break;
            default:
                break;
        }
        statusDisplay.value = `Авария: ${message}`;
        showModal(message); // Показываем модальное окно с сообщением
        stopFilling(); // Останавливаем процесс фасовки
    };

    const emergencyModalFirst = document.getElementById("emergency-modal-first");
    

    const emergencyModalSecond = document.getElementById("emergency-modal-second");
    

    const emergencyModalThird = document.getElementById("emergency-modal-third");
    

    const emergencyModalForth = document.getElementById("emergency-modal-forth");
    

    document.getElementById("emergency1").addEventListener("click", () => {
        emergencyModalFirst.style.display = "block";
        fabricEmergency("equipment");
        
    });
    document.getElementById("emergency2").addEventListener("click", () => {
        emergencyModalSecond.style.display = "block";
        fabricEmergency("air");
    });
    document.getElementById("emergency3").addEventListener("click", () => {
        emergencyModalThird.style.display = "block";
        fabricEmergency("fire");
    });
    document.getElementById("emergency4").addEventListener("click", () => {
        emergencyModalForth.style.display = "block";
        fabricEmergency("conveyor");
    });

    const fabricEmergency = (type) => {
        switch (type) {
            case "equipment":
                statusDisplay.value = "Авария: проблемы с фасовочным оборудованием!";
                addLog("АВАРИЙНАЯ СИТУАЦИЯ: Неисправно фасовочное оборудование");
                break;
            case "air":
                statusDisplay.value = "Авария: воздух загрязнен!";
                addLog("АВАРИЙНАЯ СИТУАЦИЯ: Загрязнение воздуха превысило норму");
                break;
            case "fire":
                statusDisplay.value = "Авария: пожар!";
                addLog("АВАРИЙНАЯ СИТУАЦИЯ: Обнаружено возгрорание");
                break;
            case "conveyor":
                statusDisplay.value = "Авария: проблемы с конвеерной системой!";
                addLog("АВАРИЙНАЯ СИТУАЦИЯ: Неисправна конвеерная система");
                break
            default:
                break;
        }
        stopFilling(); // Останавливаем процесс фасовки
    };

    const fixEmergencyModal = document.getElementById("fixEmergency");
    const fixEmergencyPercentage = document.getElementById("fixEmergency-percentage");
    const fixEmergencyButton = document.getElementById("fixEmergency-button");
    const emergencyButton1 = document.getElementById("emergency-modal-button1");
    const emergencyButton2 = document.getElementById("emergency-modal-button2");
    const emergencyButton3 = document.getElementById("emergency-modal-button3");
    const emergencyButton4 = document.getElementById("emergency-modal-button4");

    let fixProgress = 0;

    const fixEmergency = () => {
        interval = setInterval(() => {
            fixProgress += 1;
            fixEmergencyPercentage.textContent = `${fixProgress}`;
            if (fixProgress >= 100) {
                fixEmergencyButton.disabled = false;
                clearInterval(interval);
                addLog("АВАРИЙНАЯ СИТУАЦИЯ УСТРАНЕНА");
            }
        }, 50);
        fixProgress = 0;
    };

    emergencyButton1.addEventListener("click", () => {
        fixEmergencyButton.disabled = true;
        emergencyModalFirst.style.display = "none";
        fixEmergencyModal.style.display = "block";
        fixEmergency();
    });

    emergencyButton2.addEventListener("click", () => {
        fixEmergencyButton.disabled = true;
        emergencyModalSecond.style.display = "none";
        fixEmergencyModal.style.display = "block";
        fixEmergency();
    });

    emergencyButton3.addEventListener("click", () => {
        fixEmergencyButton.disabled = true;
        emergencyModalThird.style.display = "none";
        fixEmergencyModal.style.display = "block";
        fixEmergency();
    });

    emergencyButton4.addEventListener("click", () => {
        fixEmergencyButton.disabled = true;
        emergencyModalForth.style.display = "none";
        fixEmergencyModal.style.display = "block";
        fixEmergency();
    });

    fixEmergencyButton.addEventListener ("click", () => {
        fixEmergencyModal.style.display = "none";
    });

});
