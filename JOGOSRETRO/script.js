document.addEventListener('DOMContentLoaded', () => {
    // --- SOUND EFFECTS (Web Audio API Synthesizer) ---
    let isMuted = true;
    const audioCtx = new (window.AudioContext || window.webkitAudioContext)();
    
    const soundToggleBtn = document.getElementById('sound-toggle-btn');
    
    // Toggle mute state
    soundToggleBtn.addEventListener('click', () => {
        isMuted = !isMuted;
        if (isMuted) {
            soundToggleBtn.classList.remove('btn-primary');
            soundToggleBtn.innerHTML = '<i class="fas fa-volume-mute"></i> <span>MUDO</span>';
        } else {
            soundToggleBtn.classList.add('btn-primary');
            soundToggleBtn.innerHTML = '<i class="fas fa-volume-up"></i> <span>SOM ON</span>';
            // Resume Audio Context if suspended (browser security)
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            playCoinSound();
        }
    });
    // Helper: Play retro 8-bit sound (Square Wave)
    function playBeep(freq, duration, type = 'square', volume = 0.1) {
        if (isMuted) return;
        
        try {
            if (audioCtx.state === 'suspended') {
                audioCtx.resume();
            }
            
            const osc = audioCtx.createOscillator();
            const gainNode = audioCtx.createGain();
            
            osc.type = type;
            osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
            
            // Gain envelope for smooth decay
            gainNode.gain.setValueAtTime(volume, audioCtx.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + duration);
            
            osc.connect(gainNode);
            gainNode.connect(audioCtx.destination);
            
            osc.start();
            osc.stop(audioCtx.currentTime + duration);
        } catch (error) {
            console.warn("Audio Context error:", error);
        }
    }
    // Audio SFX 1: Simple Button Click (Short Beep)
    function playClickSound() {
        playBeep(600, 0.08, 'square', 0.05);
    }
    // Audio SFX 2: Mario Coin Sound
    function playCoinSound() {
        if (isMuted) return;
        try {
            if (audioCtx.state === 'suspended') audioCtx.resume();
            
            // Note 1 (B5 - 987.77 Hz)
            const osc1 = audioCtx.createOscillator();
            const gain1 = audioCtx.createGain();
            osc1.type = 'square';
            osc1.frequency.setValueAtTime(988, audioCtx.currentTime);
            gain1.gain.setValueAtTime(0.08, audioCtx.currentTime);
            osc1.connect(gain1);
            gain1.connect(audioCtx.destination);
            osc1.start();
            osc1.stop(audioCtx.currentTime + 0.08);
            // Note 2 (E6 - 1318.51 Hz) after a short delay
            setTimeout(() => {
                if (isMuted) return;
                const osc2 = audioCtx.createOscillator();
                const gain2 = audioCtx.createGain();
                osc2.type = 'square';
                osc2.frequency.setValueAtTime(1319, audioCtx.currentTime);
                gain2.gain.setValueAtTime(0.08, audioCtx.currentTime);
                gain2.gain.exponentialRampToValueAtTime(0.00001, audioCtx.currentTime + 0.25);
                osc2.connect(gain2);
                gain2.connect(audioCtx.destination);
                osc2.start();
                osc2.stop(audioCtx.currentTime + 0.25);
            }, 80);
        } catch (e) {
            console.warn(e);
        }
    }
    // Audio SFX 3: Typing Sound
    function playTypeSound() {
        playBeep(Math.random() * 400 + 400, 0.03, 'triangle', 0.03);
    }
    // Audio SFX 4: Win/Success Fanfare
    function playWinSound() {
        if (isMuted) return;
        const notes = [523.25, 659.25, 783.99, 1046.50]; // C5, E5, G5, C6
        notes.forEach((freq, idx) => {
            setTimeout(() => {
                playBeep(freq, 0.15, 'square', 0.08);
            }, idx * 120);
        });
    }
    // --- GAME DATA DATABASE ---
    const gamesData = [
        {
            id: 0,
            name: "Super Mario World",
            platform: "SNES",
            year: "1990",
            desc: "A maior aventura de Mario na Terra dos Dinossauros! Explore 74 mundos cheios de segredos, apresentando o adorável Yoshi pela primeira vez. Um clássico insuperável de plataforma.",
            img: "mario.png"
        },
        {
            id: 1,
            name: "Street Fighter II",
            platform: "ARCADE",
            year: "1991",
            desc: "O jogo que definiu o gênero de luta competitiva. Escolha seu lutador favorito de diferentes partes do mundo, domine os golpes especiais como o Hadouken e derrote M. Bison!",
            img: "street_fighter.png"
        },
        {
            id: 2,
            name: "Tetris",
            platform: "GAME BOY",
            year: "1989",
            desc: "O quebra-cabeça viciante que conquistou o mundo! Organize os blocos geométricos descendentes para limpar linhas completas. A trilha sonora marcante e a jogabilidade são eternas.",
            img: "tetris.png"
        },
        {
            id: 3,
            name: "Sonic the Hedgehog",
            platform: "MEGA DRIVE",
            year: "1991",
            desc: "O mascote azul mais veloz dos games. Atravesse a Green Hill Zone em alta velocidade acumulando anéis dourados e impeça os planos malignos do Dr. Robotnik para salvar os animais.",
            img: "sonic.png"
        }
    ];
    // --- CAROUSEL HIGHLIGHTS MECHANISM ---
    const slides = document.querySelectorAll('.carousel-slide');
    const coinIndicators = document.querySelectorAll('.coin-indicator');
    const prevBtn = document.getElementById('carousel-prev');
    const nextBtn = document.getElementById('carousel-next');
    let currentSlide = 0;
    let carouselInterval;
    function showSlide(index) {
        // Wrap around bounds
        if (index >= slides.length) {
            currentSlide = 0;
        } else if (index < 0) {
            currentSlide = slides.length - 1;
        } else {
            currentSlide = index;
        }
        // Deactivate active items
        slides.forEach(slide => slide.classList.remove('active'));
        coinIndicators.forEach(coin => coin.classList.remove('active'));
        // Activate target items
        slides[currentSlide].classList.add('active');
        coinIndicators[currentSlide].classList.add('active');
    }
    function nextSlide() {
        showSlide(currentSlide + 1);
    }
    function prevSlide() {
        showSlide(currentSlide - 1);
    }
    // Auto-slide functionality
    function startAutoSlide() {
        stopAutoSlide();
        carouselInterval = setInterval(nextSlide, 6000);
    }
    function stopAutoSlide() {
        if (carouselInterval) {
            clearInterval(carouselInterval);
        }
    }
    // Carousel Listeners
    nextBtn.addEventListener('click', () => {
        playClickSound();
        nextSlide();
        startAutoSlide(); // Reset timer on click
    });
    prevBtn.addEventListener('click', () => {
        playClickSound();
        prevSlide();
        startAutoSlide(); // Reset timer on click
    });
    coinIndicators.forEach((coin, idx) => {
        coin.addEventListener('click', () => {
            playCoinSound();
            showSlide(idx);
            startAutoSlide(); // Reset timer
        });
    });
    // Start auto slide initially
    startAutoSlide();
    // --- DYNAMIC SEARCH BAR ---
    const searchInput = document.getElementById('game-search');
    const searchBtn = document.getElementById('search-btn');
    const searchResultsDropdown = document.getElementById('search-results');
    // Handle input Typing
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        if (query === '') {
            searchResultsDropdown.classList.add('hidden');
            return;
        }
        
        playTypeSound();
        // Filter games
        const matchedGames = gamesData.filter(game => 
            game.name.toLowerCase().includes(query) || 
            game.platform.toLowerCase().includes(query) ||
            game.desc.toLowerCase().includes(query)
        );
        displaySearchResults(matchedGames);
    });
    // Display list elements in dropdown
    function displaySearchResults(results) {
        searchResultsDropdown.innerHTML = '';
        
        if (results.length === 0) {
            searchResultsDropdown.innerHTML = '<div class="search-no-results">NENHUM JOGO ENCONTRADO</div>';
            searchResultsDropdown.classList.remove('hidden');
            return;
        }
        results.forEach(game => {
            const resultItem = document.createElement('div');
            resultItem.className = 'search-result-item';
            resultItem.innerHTML = `
                <img src="${game.img}" alt="${game.name}" class="search-result-img">
                <div class="search-result-info">
                    <h4>${game.name}</h4>
                    <p>${game.platform} (${game.year})</p>
                </div>
            `;
            // When user clicks a search result
            resultItem.addEventListener('click', () => {
                playCoinSound();
                // Navigate carousel to selected game
                showSlide(game.id);
                // Scroll to Carousel section
                document.getElementById('destaques').scrollIntoView({ behavior: 'smooth' });
                // Clean input and hide dropdown
                searchInput.value = '';
                searchResultsDropdown.classList.add('hidden');
            });
            searchResultsDropdown.appendChild(resultItem);
        });
        searchResultsDropdown.classList.remove('hidden');
    }
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !searchResultsDropdown.contains(e.target)) {
            searchResultsDropdown.classList.add('hidden');
        }
    });
    // Clicking search icon buttons focus the search input
    searchBtn.addEventListener('click', () => {
        playClickSound();
        searchInput.focus();
    });
    // --- CRT SWITCH INTERACTIVE TOGGLE ---
    const crtToggleBtn = document.getElementById('crt-toggle-btn');
    const crtEffectScreen = document.getElementById('crt-scanlines-effect');
    
    // Toggle CRT scanlines on/off
    crtToggleBtn.addEventListener('click', () => {
        playBeep(250, 0.15, 'sine', 0.1);
        crtToggleBtn.classList.toggle('on');
        crtEffectScreen.classList.toggle('hidden');
    });
    // Rotary Dial Interaction
    const chDial = document.querySelector('.dial-channel');
    const volDial = document.querySelector('.dial-volume');
    let dialRotationCh = 45;
    let dialRotationVol = 120;
    chDial.addEventListener('click', () => {
        dialRotationCh = (dialRotationCh + 45) % 360;
        chDial.querySelector('.dial-inner').style.transform = `translate(-50%, -100%) rotate(${dialRotationCh}deg)`;
        playClickSound();
        nextSlide();
    });
    volDial.addEventListener('click', () => {
        dialRotationVol = (dialRotationVol + 30) % 360;
        volDial.querySelector('.dial-inner').style.transform = `translate(-50%, -100%) rotate(${dialRotationVol}deg)`;
        playBeep(440 + (dialRotationVol / 360) * 440, 0.08, 'sawtooth', 0.05);
    });
    // --- MOBILE HAMBURGER MENU ---
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileNav = document.getElementById('mobile-nav');
    mobileMenuBtn.addEventListener('click', () => {
        playClickSound();
        mobileNav.classList.toggle('hidden');
        const icon = mobileMenuBtn.querySelector('i');
        if (mobileNav.classList.contains('hidden')) {
            icon.className = 'fas fa-bars';
        } else {
            icon.className = 'fas fa-times';
        }
    });
    // Close menu when clicking link
    document.querySelectorAll('.mobile-link').forEach(link => {
        link.addEventListener('click', () => {
            mobileNav.classList.add('hidden');
            mobileMenuBtn.querySelector('i').className = 'fas fa-bars';
        });
    });
    // --- FAQ ACCORDION MECHANISM ---
    const faqQuestions = document.querySelectorAll('.faq-question-btn');
    faqQuestions.forEach(btn => {
        btn.addEventListener('click', () => {
            playClickSound();
            const item = btn.parentElement;
            const answer = item.querySelector('.faq-answer');
            const isExpanded = btn.getAttribute('aria-expanded') === 'true';
            // Close other items
            document.querySelectorAll('.faq-item').forEach(otherItem => {
                if (otherItem !== item) {
                    otherItem.classList.remove('active');
                    otherItem.querySelector('.faq-question-btn').setAttribute('aria-expanded', 'false');
                    otherItem.querySelector('.faq-answer').setAttribute('hidden', '');
                }
            });
            // Toggle current item
            item.classList.toggle('active');
            btn.setAttribute('aria-expanded', !isExpanded);
            
            if (isExpanded) {
                answer.setAttribute('hidden', '');
            } else {
                answer.removeAttribute('hidden');
            }
        });
    });
    // --- RAFFLE FORM INPUT PHONE MASK & VALIDATION ---
    const raffleForm = document.getElementById('raffle-form');
    const phoneInput = document.getElementById('user-phone');
    const nameInput = document.getElementById('user-name');
    const emailInput = document.getElementById('user-email');
    // Auto-masking celular: (XX) XXXXX-XXXX
    phoneInput.addEventListener('input', (e) => {
        let val = e.target.value.replace(/\D/g, ""); // Remove non-digits
        
        if (val.length > 11) {
            val = val.substring(0, 11);
        }
        
        let formattedVal = "";
        
        if (val.length > 0) {
            formattedVal += "(" + val.substring(0, 2);
        }
        if (val.length > 2) {
            formattedVal += ") " + val.substring(2, 7);
        }
        if (val.length > 7) {
            formattedVal += "-" + val.substring(7, 11);
        }
        
        e.target.value = formattedVal;
    });
    // Simple Form Validation
    function validateForm() {
        let isValid = true;
        
        // Name validation
        const nameVal = nameInput.value.trim();
        const nameError = document.getElementById('name-error');
        if (nameVal.length < 3) {
            nameError.textContent = "Nome deve conter pelo menos 3 caracteres.";
            nameError.style.display = "block";
            nameInput.parentElement.style.borderColor = "var(--accent-orange)";
            isValid = false;
        } else {
            nameError.style.display = "none";
            nameInput.parentElement.style.borderColor = "var(--border-color)";
        }
        // Email validation
        const emailVal = emailInput.value.trim();
        const emailError = document.getElementById('email-error');
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailVal)) {
            emailError.textContent = "Insira um e-mail válido.";
            emailError.style.display = "block";
            emailInput.parentElement.style.borderColor = "var(--accent-orange)";
            isValid = false;
        } else {
            emailError.style.display = "none";
            emailInput.parentElement.style.borderColor = "var(--border-color)";
        }
        // Phone validation (exactly 11 digits parsed: 2 DDD + 9 phone)
        const phoneDigits = phoneInput.value.replace(/\D/g, "");
        const phoneError = document.getElementById('phone-error');
        if (phoneDigits.length < 11) {
            phoneError.textContent = "Celular completo com DDD requerido (11 dígitos).";
            phoneError.style.display = "block";
            phoneInput.parentElement.style.borderColor = "var(--accent-orange)";
            isValid = false;
        } else {
            phoneError.style.display = "none";
            phoneInput.parentElement.style.borderColor = "var(--border-color)";
        }
        return isValid;
    }
    // Form submission
    raffleForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        if (!validateForm()) {
            playBeep(180, 0.25, 'sawtooth', 0.1);
            return;
        }
        // Generate dynamic success ticket
        const name = nameInput.value.trim();
        const suffixes = ['SF', 'MA', 'TE', 'SO', 'DK', 'ZE'];
        const randomSuffix = suffixes[Math.floor(Math.random() * suffixes.length)];
        const luckyNum = "#" + Math.floor(10000 + Math.random() * 90000) + "-" + randomSuffix;
        // Fill modal details
        document.getElementById('modal-user-name').textContent = name;
        document.getElementById('modal-lucky-number').textContent = luckyNum;
        // Open Modal
        const successModal = document.getElementById('success-modal');
        successModal.classList.remove('hidden');
        
        playWinSound();
        // Clear Form fields
        raffleForm.reset();
    });
    // --- MODAL CLOSE LISTENERS ---
    const successModal = document.getElementById('success-modal');
    const closeModalBtn = document.getElementById('close-modal-btn');
    const closeModalConfirm = document.getElementById('close-modal-confirm');
    function closeModal() {
        playClickSound();
        successModal.classList.add('hidden');
    }
    closeModalBtn.addEventListener('click', closeModal);
    closeModalConfirm.addEventListener('click', closeModal);
    
    // Close modal clicking overlay
    successModal.addEventListener('click', (e) => {
        if (e.target === successModal) {
            closeModal();
        }
    });
});
