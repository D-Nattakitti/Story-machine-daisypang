document.addEventListener('DOMContentLoaded', () => {
    const VIDEO_DURATION_MS = 15 * 1000; // 15 วินาที

    // กำหนดข้อมูลเครื่องดื่ม (รูปภาพและชื่อ)
    const DRINKS_DATA = {
        coke: { name: "โค้ก", image: "images/coke_result.png" },
        sprite: { name: "สไปรท์", image: "images/sprite_result.png" },
        fanta: { name: "แฟนต้า", image: "images/fanta_result.png" },
        // เพิ่มเครื่องดื่มอื่นๆ ที่นี่
    };

    // อ้างอิง DOM Elements
    const videoScreen = document.getElementById('video-screen');
    const introVideo = document.getElementById('intro-video'); // กลับมาอ้างอิงถึงแท็ก <video>

    const vendingMachineScreen = document.getElementById('vending-machine-screen');
    const drinksContainer = document.querySelector('.drinks-container');
    const confirmSelectionBtn = document.getElementById('confirm-selection-btn');
    const selectionMessage = document.getElementById('selection-message');

    const dispenseScreen = document.getElementById('dispense-screen');
    const canFallAnimation = document.getElementById('can-fall-animation');

    const resultPopup = document.getElementById('result-popup');
    const popupTitle = document.getElementById('popup-title');
    const popupImage = document.getElementById('popup-image');
    const closePopupButton = document.querySelector('.popup .close-button');

    let selectedDrinkId = null;

    // --- ฟังก์ชันสำหรับจัดการการแสดงหน้าจอ ---
    function showScreen(screenId) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        document.getElementById(screenId).classList.add('active');
    }

    // --- เริ่มต้น: เล่นวิดีโอเมื่อโหลดหน้า `video.html` ---
    introVideo.addEventListener('loadeddata', () => {
        introVideo.play().catch(error => {
            console.warn('การเล่นวิดีโออัตโนมัติถูกบล็อก (อาจต้องมีเสียง):', error);
            // หากเล่นไม่ได้อัตโนมัติ ให้ข้ามไปหน้าตู้กดน้ำเลย (เพื่อไม่ให้ผู้ใช้ต้องรอนาน)
            switchToVendingMachine();
        });
    });

    // ใช้ setTimeout เพื่อเปลี่ยนไปหน้าตู้กดน้ำหลังจาก 15 วินาที
    let videoTimeout = setTimeout(() => {
        switchToVendingMachine();
    }, VIDEO_DURATION_MS);

    // หากวิดีโอเล่นจบก่อน 15 วินาที (เช่น วิดีโอสั้นกว่า) ก็เปลี่ยนหน้าเลย
    introVideo.addEventListener('ended', () => {
        clearTimeout(videoTimeout); // เคลียร์ timeout เพื่อไม่ให้ทำงานซ้ำ
        switchToVendingMachine();
    });

    function switchToVendingMachine() {
        showScreen('vending-machine-screen');
        introVideo.pause(); // หยุดวิดีโอ
        introVideo.currentTime = 0; // รีเซ็ตวิดีโอไปที่จุดเริ่มต้น
        videoScreen.classList.remove('active'); // ซ่อนหน้าวิดีโอ
    }


    // --- หน้าเลือกเครื่องดื่ม ---
    drinksContainer.addEventListener('click', (event) => {
        const drinkItem = event.target.closest('.drink-item');
        if (drinkItem) {
            document.querySelectorAll('.drink-item').forEach(item => {
                item.classList.remove('selected');
            });
            drinkItem.classList.add('selected');
            selectedDrinkId = drinkItem.dataset.drinkId;
            selectionMessage.textContent = `คุณเลือก: ${DRINKS_DATA[selectedDrinkId].name}`;
            confirmSelectionBtn.disabled = false;
        }
    });

    confirmSelectionBtn.addEventListener('click', () => {
        if (selectedDrinkId) {
            showScreen('dispense-screen');
            canFallAnimation.style.display = 'block';

            setTimeout(() => {
                showResultPopup(selectedDrinkId);
                canFallAnimation.style.display = 'none';
            }, 2000); // ระยะเวลาแอนิเมชันกระป๋องตก
        } else {
            selectionMessage.textContent = 'กรุณาเลือกเครื่องดื่มก่อน';
        }
    });

    // --- Pop-up แสดงรูปสินค้าที่เลือก ---
    function showResultPopup(drinkId) {
        const drink = DRINKS_DATA[drinkId];
        if (drink) {
            popupTitle.textContent = `คุณได้รับ: ${drink.name}!`;
            popupImage.src = drink.image;
            resultPopup.style.display = 'flex';
        }
    }

    closePopupButton.addEventListener('click', () => {
        resultPopup.style.display = 'none';
        selectedDrinkId = null;
        confirmSelectionBtn.disabled = true;
        document.querySelectorAll('.drink-item').forEach(item => {
            item.classList.remove('selected');
        });
        // เมื่อปิด Pop-up ให้กลับไปหน้าแรก (index.html)
        window.location.href = 'index.html';
    });

    // เมื่อคลิกนอก Pop-up ให้ปิดและกลับหน้าแรก
    window.addEventListener('click', (event) => {
        if (event.target === resultPopup) {
            resultPopup.style.display = 'none';
            selectedDrinkId = null;
            confirmSelectionBtn.disabled = true;
            document.querySelectorAll('.drink-item').forEach(item => {
                item.classList.remove('selected');
            });
            window.location.href = 'index.html';
        }
    });

    // การจัดการกรณีวิดีโอมีปัญหา
    introVideo.addEventListener('error', () => {
        console.error('เกิดข้อผิดพลาดในการโหลดหรือเล่นวิดีโอ');
        clearTimeout(videoTimeout); // เคลียร์ timeout
        switchToVendingMachine(); // ข้ามไปหน้าตู้กดน้ำเลย
    });
});