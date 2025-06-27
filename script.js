document.addEventListener('DOMContentLoaded', () => {
    // --- Elements ---
    const homeScreen = document.getElementById('home-screen');
    const resultScreen = document.getElementById('result-screen');
    const historyScreen = document.getElementById('history-screen');

    const categoryButtons = document.querySelectorAll('.category-buttons button');
    const catAnimation = document.getElementById('cat-animation'); // นี่คือ <video> element
    const catSpeechBubble = document.getElementById('cat-speech');
    const itemImage = document.getElementById('item-image');
    const itemMessage = document.getElementById('item-message');
    const playAgainBtn = document.getElementById('play-again-btn');
    const viewHistoryBtn = document.getElementById('view-history-btn');
    const historyList = document.getElementById('history-list');
    const backToHomeFromHistoryBtn = document.getElementById('back-to-home-from-history-btn');

    const resultArea = document.querySelector('.result-area');
    const animationArea = document.querySelector('.animation-area');

    // --- Elements for Freebie ---
    const freebieSection = document.querySelector('.freebie-section');
    const freebieImage = document.getElementById('freebie-image');
    const freebieMessage = document.getElementById('freebie-message');
    const freebieButton = document.getElementById('freebie-button');

    // --- Sound Elements ---
    const meowSound = document.getElementById('meow-sound');
    const dropSound = document.getElementById('drop-sound');
    const clickSound = document.getElementById('click-sound');

    // --- Item Data ---
    const items = {
        dessert: [
            { name: 'คุกกี้ช็อกโกแลตชิพ', msg: 'อร่อยเหาะ! ได้คุกกี้ช็อกโกแลตชิพอบใหม่ๆ เลยนะฮะ~ 🍪', img: 'assets/cookie.png' },
            { name: 'เค้กฟรุตตี้', msg: 'หวานฉ่ำ! ได้เค้กฟรุตตี้เนื้อนุ่ม~ 🍰', img: 'assets/cake.png' },
            { name: 'ไอศกรีมวานิลลา', msg: 'เย็นชื่นใจ! ได้ไอศกรีมวานิลลา~ 🍦', img: 'assets/icecream.png' }
        ],
        drink: [
            { name: 'ชานมไข่มุกเย็นๆ', msg: 'น่ารักจัง! ได้ชานมไข่มุกเย็นๆ~ 🧋', img: 'assets/bubble-tea.png' },
            { name: 'น้ำผลไม้รวม', msg: 'สดชื่นจัง! ได้น้ำผลไม้รวมเพื่อสุขภาพ~ 🍎🍊🍇', img: 'assets/fruit-juice.png' },
            { name: 'น้ำอัดลมซ่าๆ', msg: 'ซ่าถึงใจ! ได้น้ำอัดลมซ่าๆ~ 🥤', img: 'assets/soda.png' }
        ],
    };

    // --- Freebie Data ---
    const freebies = [
        {
            name: 'สติกเกอร์น้องเหมียว',
            desc: 'น่ารักใช่มั้ยฮะ? โหลดสติกเกอร์ไลน์น้องเหมียวฟรีเลย! 🐾',
            img: 'assets/freebies/freebie-sticker.png',
            link: 'https://line.me/S/sticker/YOUR_LINE_STICKER_ID' // **เปลี่ยนเป็นลิงก์จริงของคุณ!**
        },
        {
            name: 'วอลเปเปอร์เหมียวคิ้วท์',
            desc: 'เอาไว้ติดหน้าจอมือถือ/คอมพิวเตอร์นะฮะ! น่ารักมากๆ เลย~ 🖼️',
            img: 'assets/freebies/freebie-wallpaper.png',
            link: 'https://yourwebsite.com/wallpapers/your_wallpaper_file.zip' // **เปลี่ยนเป็นลิงก์จริงของคุณ!**
        },
        {
            name: 'ไอคอนแพ็คน้องเหมียว',
            desc: 'เปลี่ยนไอคอนแอปให้เป็นน้องเหมียวสุดคิ้วท์! ลองดูนะฮะ~ 🎨',
            img: 'assets/freebies/freebie-iconpack.png',
            link: 'https://yourwebsite.com/iconpacks/your_iconpack_file.zip' // **เปลี่ยนเป็นลิงก์จริงของคุณ!**
        }
        // เพิ่มของแถมอื่นๆ ได้ที่นี่
    ];


    // Cat speech phrases
    const catPhrases = [
        "เหมียวๆ! กำลังเลือกของให้อยู่นะฮะ~",
        "ตู้กดนี้มีแต่ของอร่อยนะเหมียว!",
        "อดใจรอหน่อยนะ... กำลังกดให้อยู่เหมียว!",
        "อุ๊ปส์! เกือบจะหล่นแล้วเหมียว~",
        "ทาด๊า! ใกล้จะออกมาแล้วฮะ!"
    ];

    let history = JSON.parse(localStorage.getItem('catGiftHistory')) || [];

    // --- Function to play sound ---
    function playSound(soundElement) {
        soundElement.currentTime = 0; // Rewind to start
        soundElement.play().catch(e => console.log("Sound play failed:", e)); // Handle autoplay policy
    }

    // --- Function to switch screens ---
    function showScreen(screenToShow) {
        document.querySelectorAll('.screen').forEach(screen => {
            screen.classList.remove('active');
        });
        screenToShow.classList.add('active');

        // Reset body background theme when not on result screen
        if (screenToShow !== resultScreen) {
            document.body.classList.remove('theme-dessert', 'theme-drink', 'theme-random');
        }
    }

    // --- Typewriter effect for cat speech ---
    function typeWriter(element, text, i = 0, callback = () => {}) {
        element.textContent = ''; // Clear existing text
        catSpeechBubble.classList.add('active');
        let currentText = '';
        const typingInterval = setInterval(() => {
            if (i < text.length) {
                currentText += text.charAt(i);
                element.textContent = currentText;
                i++;
            } else {
                clearInterval(typingInterval);
                callback();
            }
        }, 50); // Adjust typing speed
    }

    // --- Handle category selection ---
    categoryButtons.forEach(button => {
        button.addEventListener('click', () => {
            playSound(clickSound); // Play click sound
            const category = button.dataset.category;
            startGame(category);
        });
    });

    // --- Start Game Flow ---
    function startGame(selectedCategory) {
        showScreen(resultScreen);
        resultArea.classList.add('hidden'); // Hide result initially
        animationArea.classList.remove('hidden'); // Show animation area
        catSpeechBubble.classList.remove('active'); // Hide previous speech bubble
        catSpeechBubble.textContent = ''; // Clear speech bubble text
        freebieSection.classList.add('hidden'); // ซ่อนของแถมไว้ก่อน

        // Set dynamic background theme
        document.body.classList.remove('theme-dessert', 'theme-drink', 'theme-random');
        if (selectedCategory === 'dessert') {
            document.body.classList.add('theme-dessert');
        } else if (selectedCategory === 'drink') {
            document.body.classList.add('theme-drink');
        } else { // random
            document.body.classList.add('theme-random');
        }

        // Play cat run animation
        catAnimation.src = 'assets/cat-run.mp4';
        catAnimation.loop = true;
        catAnimation.play();
        playSound(meowSound); // Play meow sound when cat starts running

        // Randomly pick a cat phrase and type it
        const randomPhrase = catPhrases[Math.floor(Math.random() * catPhrases.length)];
        typeWriter(catSpeechBubble, randomPhrase);


        // Simulate machine working and item dropping
        setTimeout(() => {
            catAnimation.src = 'assets/cat-press.mp4'; // Change to press animation
            catAnimation.loop = false; // Play press animation once
            catAnimation.play();
            playSound(dropSound); // Play drop sound

            // After press animation finishes (or a short delay)
            // Use a Promise or specific event listener for cleaner video handling
            catAnimation.onended = () => {
                revealResultAndFreebie(selectedCategory);
                catAnimation.onended = null; // Clear the event listener after it fires
            };

            // Fallback for immediate display if video onended doesn't fire quickly
            setTimeout(() => {
                if (resultArea.classList.contains('hidden')) { // If result isn't shown yet
                    revealResultAndFreebie(selectedCategory);
                }
            }, 3000); // Max wait for press animation + reveal (adjust as needed based on your cat-press.mp4 duration)

        }, 2000); // After 2 seconds, cat starts pressing (adjust this duration based on cat-run.mp4 length)
    }

    // --- Function to reveal result and freebie ---
    function revealResultAndFreebie(selectedCategory) {
        const item = getRandomItem(selectedCategory);
        itemImage.src = item.img;
        itemMessage.textContent = item.msg;

        // --- สุ่มและแสดงของแถมฟรี ---
        const randomFreebie = freebies[Math.floor(Math.random() * freebies.length)];
        freebieImage.src = randomFreebie.img;
        freebieMessage.textContent = randomFreebie.desc;
        freebieButton.onclick = () => {
            window.open(randomFreebie.link, '_blank'); // เปิดลิงก์ในแท็บใหม่
            playSound(clickSound); // เล่นเสียงตอนกดปุ่มของแถม
        };
        freebieButton.setAttribute('data-link', randomFreebie.link); // เก็บ link ไว้ใน data attribute

        // Save to history
        history.push(item);
        localStorage.setItem('catGiftHistory', JSON.stringify(history));

        // Show result
        animationArea.classList.add('hidden');
        resultArea.classList.remove('hidden');
        freebieSection.classList.remove('hidden'); // แสดงส่วนของแถม
        catSpeechBubble.classList.remove('active'); // ซ่อน speech bubble
    }


    // --- Get a random item based on category ---
    function getRandomItem(category) {
        let availableItems = [];
        if (category === 'random') {
            // Flatten all items into one array for random selection
            for (const key in items) {
                availableItems = availableItems.concat(items[key]);
            }
        } else {
            availableItems = items[category];
        }

        const randomIndex = Math.floor(Math.random() * availableItems.length);
        return availableItems[randomIndex];
    }

    // --- Play Again button ---
    playAgainBtn.addEventListener('click', () => {
        playSound(clickSound);
        showScreen(homeScreen);
        // Reset cat animation to default for next play
        catAnimation.src = 'assets/cat-run.mp4'; // Ensure it's back to running
        catAnimation.loop = true;
        catAnimation.play();
        freebieSection.classList.add('hidden'); // ซ่อนของแถม
    });

    // --- View History button ---
    viewHistoryBtn.addEventListener('click', () => {
        playSound(clickSound);
        showScreen(historyScreen);
        renderHistory();
        freebieSection.classList.add('hidden'); // ซ่อนของแถม
    });

    // --- Render History List ---
    function renderHistory() {
        historyList.innerHTML = ''; // Clear current list
        if (history.length === 0) {
            historyList.innerHTML = '<p class="history-empty-text">ยังไม่มีของขวัญเลยนะฮะ! ลองเล่นดูก่อนสิ 🐾</p>';
            historyList.style.display = 'block'; // Make sure it's visible
        } else {
            historyList.style.display = 'grid'; // Ensure grid display for items
            // Show latest items first
            history.slice().reverse().forEach(item => { // .slice().reverse() เพื่อแสดงรายการล่าสุดก่อน
                const itemDiv = document.createElement('div');
                itemDiv.classList.add('history-item');
                itemDiv.innerHTML = `
                    <img src="${item.img}" alt="${item.name}">
                    <p>${item.name}</p>
                `;
                historyList.appendChild(itemDiv);
            });
        }
    }

    // --- Back to Home from History ---
    backToHomeFromHistoryBtn.addEventListener('click', () => {
        playSound(clickSound);
        showScreen(homeScreen);
        freebieSection.classList.add('hidden'); // ซ่อนของแถม
    });

    // Initialize: show home screen and set sound volumes
    showScreen(homeScreen);

    window.addEventListener('load', () => {
        meowSound.volume = 0.7; // ลดเสียงลงเล็กน้อย
        clickSound.volume = 0.5;
        dropSound.volume = 0.7;
    });
});