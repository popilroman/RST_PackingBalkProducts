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

    let rawMaterial = 1000;
    let packages = 100;
    let storage = 100;
    let fillProgress = 0;
    let packagedCount = 0;
    let isRunning = false;
    let interval;

    const addLog = (message) => {
        logDisplay.innerHTML += `${message}\n`;
        logDisplay.scrollTop = logDisplay.scrollHeight;
    };

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

    const resetFill = () => {
        fillProgress = 0;
        updateCharts();
    };

    const startFilling = () => {
        interval = setInterval(() => {
            if (storage <= 0) {
                addLog("Закончилось место на складе");
                stopFilling();
                return;
            }
            else if (rawMaterial < 10 || packages <= 0) {
                addLog("Недостаточно сырья или упаковок для продолжения.");
                stopFilling();
                return;
            }

            fillProgress += 1; // Увеличиваем заполнение на 1% каждые 0.2 секунды.
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

    const stopFilling = () => {
        clearInterval(interval);
        isRunning = false;
        statusDisplay.value = "Процесс остановлен.";
        addLog("Процесс фасовки остановлен.");
    };

    document.getElementById("start").addEventListener("click", () => {
        if (!isRunning) {
            isRunning = true;
            statusDisplay.value = "Процесс запущен...";
            addLog("Процесс фасовки запущен...");
            startFilling();
        }
    });

    document.getElementById("stop").addEventListener("click", stopFilling);

    document.getElementById("refill-raw").addEventListener("click", () => {
        rawMaterial = 1000;
        updateCharts();
        addLog("Сырье пополнено до 1000 кг.");
    });

    document.getElementById("refill-packages").addEventListener("click", () => {
        packages = 100;
        updateCharts();
        addLog("Фасовочные упаковки пополнены до 100 шт.");
    });

    document.getElementById("refill-storage").addEventListener("click", () => {
        storage = 100;
        updateCharts();
        addLog("Склад сгружен");
    });
});
