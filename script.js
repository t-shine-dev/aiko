 // ============================================================
        // CONFIGURATION
        // ============================================================
        const CONFIG = {
            password: '3027',
            birthday: '2026-08-01T00:00:00',
            galleryImages: [
                'image/image1.jpeg',
                'image/image2.jpeg',
                'image/image3.jpeg',
                'image/image4.jpeg',
                'image/image5.jpeg',
                'image/image6.jpeg',
                'image/image7.jpeg',
                'image/image8.jpeg',
            ],
            reasons: [
                "❤️ Your smile makes my day.",

                "😂 Your laugh is my favorite sound.",

                "💜 You have the kindest heart.",

                "😍 Your eyes are honestly mesmerizing.",

                "😂 I love the way you can be stubborn and still somehow make me smile.",

                "🥰 You make everything more fun, even our random little conversations.",

                "✨ You're incredibly smart, and I admire how hardworking you are.",

                "😂 I love the way you say 'Eseh sir'.",

                "❤️ You make ordinary moments feel special.",

                "💪 Your strength amazes me, especially when things get stressful.",

                "💜 You're beautiful inside and out.",

                "🥰 Your presence has a way of calming me.",

                "❤️ You're my favorite person to gist with.",

                "👨‍❤️‍💋‍👨 Your hugs make everything feel better.",

                "✨ You inspire me to become better.",

                "❤️ You believe in me, even when I don't believe in myself.",

                "💜 You're my safe place.",

                "🥰 You're not just someone I love, you're also one of my best friends.",

                "❤️ I'm grateful for every moment I get to share with you.",

                "💝 And most importantly, you're simply Aiko."
            ]
        };

        // ============================================================
        // STATE
        // ============================================================
        let currentScreen = 'screen-welcome';
        let passwordAttempt = '';
        let galleryIndex = 0;
        let reasonIndex = 0;
        let reasonAutoTimer = null;
        let isGiftOpen = false;
        let musicPlaying = false;
        let audioContext = null;

        // ============================================================
        // STARS
        // ============================================================
        function createStars() {
            const container = document.getElementById('stars');
            for (let i = 0; i < 120; i++) {
                const star = document.createElement('div');
                star.className = 'star';
                const size = Math.random() * 3 + 1;
                star.style.width = size + 'px';
                star.style.height = size + 'px';
                star.style.left = Math.random() * 100 + '%';
                star.style.top = Math.random() * 100 + '%';
                star.style.setProperty('--duration', (Math.random() * 3 + 2) + 's');
                star.style.animationDelay = (Math.random() * 5) + 's';
                container.appendChild(star);
            }
        }
        createStars();

        // ============================================================
        // FLOATING HEARTS
        // ============================================================
        function spawnHeart() {
            const heart = document.createElement('div');
            heart.className = 'heart-float';
            heart.innerHTML = ['❤️', '💕', '💗', '💖', '💘'][Math.floor(Math.random() * 5)];
            heart.style.left = Math.random() * 100 + '%';
            heart.style.fontSize = (Math.random() * 20 + 14) + 'px';
            heart.style.animationDuration = (Math.random() * 8 + 6) + 's';
            heart.style.animationDelay = Math.random() * 2 + 's';
            document.body.appendChild(heart);
            setTimeout(() => heart.remove(), 12000);
        }
        setInterval(spawnHeart, 3000);
        for (let i = 0; i < 5; i++) setTimeout(spawnHeart, i * 800);

        // ============================================================
        // HEART TRAIL
        // ============================================================
        document.addEventListener('mousemove', (e) => {
            if (Math.random() > 0.7) createTrailHeart(e.clientX, e.clientY);
        });
        document.addEventListener('touchmove', (e) => {
            const touch = e.touches[0];
            if (touch && Math.random() > 0.7) createTrailHeart(touch.clientX, touch.clientY);
        });

        function createTrailHeart(x, y) {
            const el = document.createElement('div');
            el.className = 'trail-heart';
            el.innerHTML = ['❤️', '💕', '💗', '💖'][Math.floor(Math.random() * 4)];
            el.style.left = (x - 10) + 'px';
            el.style.top = (y - 10) + 'px';
            el.style.fontSize = (Math.random() * 12 + 10) + 'px';
            document.body.appendChild(el);
            setTimeout(() => el.remove(), 1000);
        }

        // ============================================================
        // SCREEN NAVIGATION
        // ============================================================
        function goToScreen(id) {
            const old = document.getElementById(currentScreen);
            const next = document.getElementById(id);
            if (!next || old === next) return;
            if (id === 'screen-birthday') triggerBirthdayCelebration();
            old.classList.remove('active');
            old.classList.add('exit');
            setTimeout(() => old.classList.remove('exit'), 800);
            next.classList.remove('exit');
            next.classList.add('active');
            currentScreen = id;
            if (id === 'screen-password') setTimeout(() => document.getElementById('passwordInput').focus(), 400);
            if (id !== 'screen-password') document.getElementById('passwordError').classList.add('hidden');
        }

        // ============================================================
        // PASSWORD
        // ============================================================
        const passwordInput = document.getElementById('passwordInput');
        const passwordDots = document.querySelectorAll('.password-dot');

        passwordInput.addEventListener('input', (e) => {
            const val = e.target.value;
            passwordAttempt = val.slice(0, 4);
            updateDots();
            document.getElementById('passwordError').classList.add('hidden');
            if (passwordAttempt.length === 4) checkPassword();
        });

        document.querySelectorAll('.num-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const num = btn.dataset.num;
                if (num === 'clear') {
                    passwordAttempt = passwordAttempt.slice(0, -1);
                } else if (num === 'enter') {
                    checkPassword();
                    return;
                } else if (passwordAttempt.length < 4) {
                    passwordAttempt += num;
                }
                updateDots();
                passwordInput.value = passwordAttempt;
                document.getElementById('passwordError').classList.add('hidden');
                if (passwordAttempt.length === 4) checkPassword();
            });
        });

        function updateDots() {
            passwordDots.forEach((dot, i) => {
                dot.className = 'password-dot' + (i < passwordAttempt.length ? '' : ' empty');
            });
        }

        function checkPassword() {
    if (passwordAttempt === CONFIG.password) {

        // Password is correct
        passwordUnlocked = true;

        document.getElementById('passwordError').classList.add('hidden');

        createUnlockEffect();

        setTimeout(() => {

            // Check whether birthday has arrived
            if (Date.now() >= birthdayDate) {

                // Birthday has passed or is today
                goToScreen('screen-birthday');

            } else {

                // Birthday hasn't arrived yet
                goToScreen('screen-countdown');

                // Start countdown only after password is correct
                updateCountdown();

                countdownInterval = setInterval(updateCountdown, 1000);
            }

            // Reset password
            passwordAttempt = '';
            passwordInput.value = '';
            updateDots();

        }, 600);

    } else if (passwordAttempt.length === 4) {

        document.getElementById('passwordError').classList.remove('hidden');

        document.getElementById('screen-password')
            .querySelector('.glass')
            .classList.add('shake');

        setTimeout(() => {
            document.getElementById('screen-password')
                .querySelector('.glass')
                .classList.remove('shake');
        }, 500);

        passwordAttempt = '';
        passwordInput.value = '';
        updateDots();
    }
}

        function createUnlockEffect() {
            for (let i = 0; i < 20; i++) {
                setTimeout(() => {
                    const heart = document.createElement('div');
                    heart.className = 'heart-float';
                    heart.innerHTML = '❤️';
                    heart.style.left = (30 + Math.random() * 40) + '%';
                    heart.style.top = (30 + Math.random() * 40) + '%';
                    heart.style.fontSize = (Math.random() * 30 + 20) + 'px';
                    heart.style.animationDuration = (Math.random() * 2 + 1) + 's';
                    heart.style.animationName = 'floatUp';
                    document.body.appendChild(heart);
                    setTimeout(() => heart.remove(), 3000);
                }, i * 80);
            }
            try {
                const ctx = new(window.AudioContext || window.webkitAudioContext)();
                const osc = ctx.createOscillator();
                const gain = ctx.createGain();
                osc.connect(gain);
                gain.connect(ctx.destination);
                osc.frequency.value = 880;
                osc.type = 'sine';
                gain.gain.setValueAtTime(0.3, ctx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.3);
                osc.start(ctx.currentTime);
                osc.stop(ctx.currentTime + 0.3);
                setTimeout(() => {
                    const osc2 = ctx.createOscillator();
                    const gain2 = ctx.createGain();
                    osc2.connect(gain2);
                    gain2.connect(ctx.destination);
                    osc2.frequency.value = 1100;
                    osc2.type = 'sine';
                    gain2.gain.setValueAtTime(0.2, ctx.currentTime);
                    gain2.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + 0.4);
                    osc2.start(ctx.currentTime + 0.15);
                    osc2.stop(ctx.currentTime + 0.55);
                }, 150);
            } catch (e) {}
        }

        // ============================================================
        // COUNTDOWN
        // ============================================================
        const birthdayDate = new Date(CONFIG.birthday).getTime();
        let countdownInterval = setInterval(updateCountdown, 1000);

        function updateCountdown() {
        const now = new Date().getTime();
        let diff = birthdayDate - now;

        if (diff <= 0) {
            clearInterval(countdownInterval);
            return;
        }

        const days = Math.floor(diff / (1000 * 60 * 60 * 24));
        const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((diff % (1000 * 60)) / 1000);

        document.getElementById('cd-days').textContent = String(days).padStart(2, '0');
        document.getElementById('cd-hours').textContent = String(hours).padStart(2, '0');
        document.getElementById('cd-minutes').textContent = String(minutes).padStart(2, '0');
        document.getElementById('cd-seconds').textContent = String(seconds).padStart(2, '0');
       }

        // ============================================================
        // CELEBRATIONS
        // ============================================================
        function triggerBirthdayCelebration() {
            launchConfetti(150);
            launchBalloons(20);
            launchFireworks(8);
            setTimeout(() => launchConfetti(100), 2000);
            setTimeout(() => launchConfetti(120), 4000);
            setTimeout(() => launchBalloons(15), 3000);
        }

        function launchConfetti(count = 80) {
            const container = document.getElementById('confettiContainer');
            const colors = ['#EC4899', '#8B5CF6', '#F472B6', '#A78BFA', '#FCD34D', '#34D399', '#60A5FA', '#FB923C'];
            for (let i = 0; i < count; i++) {
                const piece = document.createElement('div');
                piece.className = 'confetti-piece';
                const size = Math.random() * 8 + 4;
                piece.style.width = size + 'px';
                piece.style.height = size * (0.4 + Math.random() * 0.6) + 'px';
                piece.style.background = colors[Math.floor(Math.random() * colors.length)];
                piece.style.left = Math.random() * 100 + '%';
                piece.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
                piece.style.animationDuration = (Math.random() * 2 + 2) + 's';
                piece.style.animationDelay = (Math.random() * 1.5) + 's';
                piece.style.transform = `rotate(${Math.random() * 360}deg)`;
                container.appendChild(piece);
                setTimeout(() => piece.remove(), 4000);
            }
        }

        function launchBalloons(count = 15) {
            const container = document.getElementById('balloonContainer');
            const emojis = ['🎈', '🎈', '🎈', '🎈', '❤️', '💕', '💗'];
            for (let i = 0; i < count; i++) {
                const balloon = document.createElement('div');
                balloon.className = 'balloon';
                balloon.textContent = emojis[Math.floor(Math.random() * emojis.length)];
                balloon.style.left = (5 + Math.random() * 90) + '%';
                balloon.style.fontSize = (Math.random() * 30 + 30) + 'px';
                balloon.style.animationDuration = (Math.random() * 6 + 4) + 's';
                balloon.style.animationDelay = (Math.random() * 3) + 's';
                container.appendChild(balloon);
                setTimeout(() => balloon.remove(), 10000);
            }
        }

        function launchFireworks(count = 6) {
            const container = document.getElementById('fireworkContainer');
            const colors = ['#EC4899', '#8B5CF6', '#F472B6', '#A78BFA', '#FCD34D', '#34D399', '#60A5FA', '#FB923C', '#FF6B6B', '#FFD93D'];
            for (let f = 0; f < count; f++) {
                setTimeout(() => {
                    const cx = 10 + Math.random() * 80;
                    const cy = 10 + Math.random() * 60;
                    const numParticles = 30 + Math.floor(Math.random() * 30);
                    const color = colors[Math.floor(Math.random() * colors.length)];
                    for (let i = 0; i < numParticles; i++) {
                        const particle = document.createElement('div');
                        particle.className = 'firework-particle';
                        const angle = Math.random() * 2 * Math.PI;
                        const dist = 50 + Math.random() * 150;
                        const tx = Math.cos(angle) * dist;
                        const ty = Math.sin(angle) * dist - 80;
                        particle.style.setProperty('--tx', tx + 'px');
                        particle.style.setProperty('--ty', ty + 'px');
                        particle.style.left = cx + '%';
                        particle.style.top = cy + '%';
                        particle.style.width = (3 + Math.random() * 5) + 'px';
                        particle.style.height = (3 + Math.random() * 5) + 'px';
                        particle.style.background = color;
                        particle.style.borderRadius = Math.random() > 0.5 ? '50%' : '2px';
                        particle.style.animationDuration = (0.8 + Math.random() * 0.6) + 's';
                        particle.style.animationDelay = (Math.random() * 0.3) + 's';
                        container.appendChild(particle);
                        setTimeout(() => particle.remove(), 2000);
                    }
                }, f * 400);
            }
        }

        // ============================================================
        // GALLERY
        // ============================================================
        function initGallery() {
            const track = document.getElementById('galleryTrack');
            CONFIG.galleryImages.forEach((url, i) => {
                const slide = document.createElement('div');
                slide.className = 'gallery-slide';
                const img = document.createElement('img');
                img.src = url;
                img.alt = `Memory ${i+1}`;
                img.loading = 'lazy';
                img.addEventListener('click', () => toggleFullscreen(img));
                slide.appendChild(img);
                track.appendChild(slide);
            });
            updateGallery();
        }
        initGallery();

        function updateGallery() {
            const track = document.getElementById('galleryTrack');
            track.style.transform = `translateX(-${galleryIndex * 100}%)`;
            document.getElementById('galleryIndex').textContent = `${galleryIndex + 1} / ${CONFIG.galleryImages.length}`;
        }

        function galleryNext() {
            if (galleryIndex < CONFIG.galleryImages.length - 1) { galleryIndex++; updateGallery(); }
        }
        function galleryPrev() {
            if (galleryIndex > 0) { galleryIndex--; updateGallery(); }
        }

        let touchStartX = 0, touchEndX = 0;
        document.getElementById('screen-gallery').addEventListener('touchstart', (e) => {
            touchStartX = e.changedTouches[0].screenX;
        });
        document.getElementById('screen-gallery').addEventListener('touchend', (e) => {
            touchEndX = e.changedTouches[0].screenX;
            const diff = touchStartX - touchEndX;
            if (Math.abs(diff) > 50) diff > 0 ? galleryNext() : galleryPrev();
        });

        function toggleFullscreen(img) {
            img.classList.toggle('fullscreen');
            document.body.style.overflow = img.classList.contains('fullscreen') ? 'hidden' : '';
        }

        // ============================================================
        // REASONS
        // ============================================================
        function updateReason() {
            document.getElementById('reasonText').textContent = CONFIG.reasons[reasonIndex];
            document.getElementById('reasonIndex').textContent = `${reasonIndex + 1} / ${CONFIG.reasons.length}`;
        }
        function reasonNext() {
            if (reasonIndex < CONFIG.reasons.length - 1) { reasonIndex++; updateReason(); }
        }
        function reasonPrev() {
            if (reasonIndex > 0) { reasonIndex--; updateReason(); }
        }
        function reasonAutoPlay() {
            if (reasonAutoTimer) {
                clearInterval(reasonAutoTimer);
                reasonAutoTimer = null;
                document.getElementById('reasonAutoBtn').textContent = '▶ Auto-play';
                return;
            }
            document.getElementById('reasonAutoBtn').textContent = '⏸ Pause';
            reasonAutoTimer = setInterval(() => {
                reasonIndex = (reasonIndex + 1) % CONFIG.reasons.length;
                updateReason();
            }, 2500);
        }
        updateReason();

        // ============================================================
        // GIFT BOX
        // ============================================================
        function openGift() {
            if (isGiftOpen) return;
            isGiftOpen = true;
            document.getElementById('giftBox').classList.add('open');
            const msg = document.getElementById('giftMessage');
            msg.classList.remove('hidden');
            msg.classList.add('fade-in-up');
            launchConfetti(100);
            launchFireworks(10);
            try {
                const ctx = new(window.AudioContext || window.webkitAudioContext)();
                const notes = [523, 659, 784, 1047];
                notes.forEach((freq, i) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.frequency.value = freq;
                    osc.type = 'sine';
                    gain.gain.setValueAtTime(0.15, ctx.currentTime + i * 0.12);
                    gain.gain.exponentialRampToValueAtTime(0.01, ctx.currentTime + i * 0.12 + 0.2);
                    osc.start(ctx.currentTime + i * 0.12);
                    osc.stop(ctx.currentTime + i * 0.12 + 0.2);
                });
            } catch (e) {}
        }

        // ============================================================
        // MUSIC
        // ============================================================
        function toggleMusic() {
            const btn = document.getElementById('musicBtn');
            if (musicPlaying) {
                stopMusic();
                btn.innerHTML = '<i class="fas fa-music"></i>';
                btn.classList.remove('pulsing');
            } else {
                startMusic();
                btn.innerHTML = '<i class="fas fa-stop"></i>';
                btn.classList.add('pulsing');
            }
            musicPlaying = !musicPlaying;
        }

        function startMusic() {
            try {
                audioContext = new(window.AudioContext || window.webkitAudioContext)();
                playMelody();
            } catch (e) {}
        }

        function playMelody() {
            if (!audioContext) return;
            const notes = [
                [523, 0.3], [587, 0.3], [659, 0.3], [784, 0.4],
                [659, 0.3], [784, 0.4], [880, 0.5], [784, 0.3],
                [659, 0.3], [587, 0.3], [523, 0.5]
            ];
            let time = 0.1;
            notes.forEach(([freq, dur]) => {
                const osc = audioContext.createOscillator();
                const gain = audioContext.createGain();
                osc.connect(gain);
                gain.connect(audioContext.destination);
                osc.frequency.value = freq;
                osc.type = 'sine';
                gain.gain.setValueAtTime(0.08, audioContext.currentTime + time);
                gain.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + time + dur);
                osc.start(audioContext.currentTime + time);
                osc.stop(audioContext.currentTime + time + dur);
                time += dur + 0.05;
            });
            setTimeout(() => { if (musicPlaying) playMelody(); }, time * 1000 + 500);
        }

        function stopMusic() {
            if (audioContext) { audioContext.close().catch(() => {}); audioContext = null; }
        }

        // ============================================================
        // WELCOME TIME
        // ============================================================
        function updateWelcomeTime() {
            const now = new Date();
            document.getElementById('welcome-time').textContent = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
        }
        updateWelcomeTime();
        setInterval(updateWelcomeTime, 30000);

        // ============================================================
        // KEYBOARD SHORTCUTS
        // ============================================================
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' && currentScreen === 'screen-password') checkPassword();
            if (currentScreen === 'screen-gallery') {
                if (e.key === 'ArrowRight') galleryNext();
                if (e.key === 'ArrowLeft') galleryPrev();
            }
            if (currentScreen === 'screen-reasons') {
                if (e.key === 'ArrowRight') reasonNext();
                if (e.key === 'ArrowLeft') reasonPrev();
            }
        });

        // ============================================================
        // AUTO-PLAY REASONS
        // ============================================================
        const reasonsScreen = document.getElementById('screen-reasons');
        const observer = new MutationObserver(() => {
            if (reasonsScreen.classList.contains('active') && !reasonAutoTimer) {
                setTimeout(() => {
                    if (currentScreen === 'screen-reasons' && !reasonAutoTimer) reasonAutoPlay();
                }, 1000);
            }
        });
        observer.observe(reasonsScreen, { attributes: true, attributeFilter: ['class'] });

        // ============================================================
        // INIT
        // ============================================================
        document.getElementById('screen-welcome').classList.add('active');
        console.log('🎂 Aiko\'s Birthday Surprise loaded! ❤️');