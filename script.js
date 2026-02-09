// ===== OPTIMIZED PERFORMANCE =====

class OptimizedStarsBackground {
    constructor() {
        this.canvas = document.getElementById('stars');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.animationFrame = null;
        this.lastTime = 0;
        this.frameInterval = 1000 / 30;
        this.isAnimating = true;
        
        this.init();
    }

    init() {
        this.resize();
        this.createStars();
        this.startAnimation();
        
        let resizeTimeout;
        window.addEventListener('resize', () => {
            clearTimeout(resizeTimeout);
            resizeTimeout = setTimeout(() => this.resize(), 100);
        });
        
        document.addEventListener('visibilitychange', () => {
            this.isAnimating = !document.hidden;
            if (this.isAnimating && !this.animationFrame) this.startAnimation();
            else if (!this.isAnimating && this.animationFrame) {
                cancelAnimationFrame(this.animationFrame);
                this.animationFrame = null;
            }
        });
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        const count = window.innerWidth <= 768 ? 50 : 100;
        this.createStars(count);
    }

    createStars(count = 100) {
        this.stars = [];
        for (let i = 0; i < count; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 1.5 + 0.5,
                speed: Math.random() * 0.3 + 0.1,
                opacity: Math.random() * 0.4 + 0.2
            });
        }
    }

    animate(timestamp) {
        if (!this.isAnimating) return;
        if (timestamp - this.lastTime < this.frameInterval) {
            this.animationFrame = requestAnimationFrame(t => this.animate(t));
            return;
        }
        this.lastTime = timestamp;
        
        this.ctx.fillStyle = 'rgba(15, 18, 32, 0.1)';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        this.stars.forEach(star => {
            star.y += star.speed;
            if (star.y > this.canvas.height) {
                star.y = 0;
                star.x = Math.random() * this.canvas.width;
            }
            this.ctx.beginPath();
            this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        this.animationFrame = requestAnimationFrame(t => this.animate(t));
    }

    startAnimation() {
        if (this.animationFrame) cancelAnimationFrame(this.animationFrame);
        this.animationFrame = requestAnimationFrame(t => this.animate(t));
    }

    stopAnimation() {
        this.isAnimating = false;
        if (this.animationFrame) {
            cancelAnimationFrame(this.animationFrame);
            this.animationFrame = null;
        }
    }
}

class OptimizedPetals {
    constructor() {
        this.container = document.querySelector('.petals-container');
        this.petals = [];
        this.maxPetals = 6;
        this.isMobile = window.innerWidth <= 768;
        
        if (this.container && !this.isMobile) this.init();
    }

    init() {
        for (let i = 0; i < this.maxPetals; i++) setTimeout(() => this.createPetal(), i * 800);
        document.addEventListener('visibilitychange', () => this.toggleAnimations(!document.hidden));
    }

    createPetal() {
        if (this.petals.length >= this.maxPetals) return;
        const petal = document.createElement('div');
        petal.className = 'petal';
        const size = Math.random() * 10 + 4;
        const left = Math.random() * 100;
        const duration = Math.random() * 10 + 8;
        petal.style.cssText = `width:${size}px;height:${size}px;left:${left}vw;animation:fall ${duration}s linear infinite;will-change:transform;`;
        this.container.appendChild(petal);
        this.petals.push(petal);
        setTimeout(() => {
            if (petal.parentNode) {
                petal.remove();
                this.petals = this.petals.filter(p => p !== petal);
                setTimeout(() => this.createPetal(), 1000);
            }
        }, duration * 1000);
    }

    toggleAnimations(isVisible) {
        this.petals.forEach(petal => {
            petal.style.animationPlayState = isVisible ? 'running' : 'paused';
        });
    }
}

class OptimizedHeroSlideshow {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.dotsContainer = document.querySelector('.slide-dots');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.currentIndex = 0;
        this.interval = null;
        this.isTransitioning = false;
        if (this.slides.length > 0) this.init();
    }

    init() {
        const firstSlide = this.slides[0];
        const bg = firstSlide.getAttribute('data-bg');
        if (bg) this.preloadImage(bg).then(() => firstSlide.style.backgroundImage = `url('${bg}')`);
        this.createDots();
        this.setupControls();
        this.startAutoPlay();
    }

    async preloadImage(url) {
        return new Promise(resolve => {
            const img = new Image();
            img.src = url;
            img.onload = resolve;
            img.onerror = resolve;
        });
    }

    createDots() {
        if (!this.dotsContainer) return;
        this.slides.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.className = `dot ${index === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => this.goToSlide(index));
            this.dotsContainer.appendChild(dot);
        });
    }

    setupControls() {
        if (this.prevBtn) this.prevBtn.addEventListener('click', () => this.prevSlide());
        if (this.nextBtn) this.nextBtn.addEventListener('click', () => this.nextSlide());
        
        const slideshow = document.querySelector('.background-slideshow');
        if (slideshow) {
            slideshow.addEventListener('mouseenter', () => clearInterval(this.interval));
            slideshow.addEventListener('mouseleave', () => this.interval = setInterval(() => this.nextSlide(), 6000));
        }
    }

    startAutoPlay() {
        this.interval = setInterval(() => this.nextSlide(), 6000);
    }

    goToSlide(index) {
        if (this.isTransitioning) return;
        this.isTransitioning = true;
        
        this.slides[this.currentIndex].classList.remove('active');
        this.updateDot(this.currentIndex, false);
        
        this.currentIndex = (index + this.slides.length) % this.slides.length;
        
        const nextSlide = this.slides[this.currentIndex];
        const bg = nextSlide.getAttribute('data-bg');
        
        if (bg && !nextSlide.style.backgroundImage) {
            this.preloadImage(bg).then(() => {
                nextSlide.style.backgroundImage = `url('${bg}')`;
                this.showSlide(nextSlide);
            });
        } else {
            this.showSlide(nextSlide);
        }
    }

    showSlide(slide) {
        slide.classList.add('active');
        this.updateDot(this.currentIndex, true);
        setTimeout(() => this.isTransitioning = false, 1500);
    }

    prevSlide() {
        this.goToSlide(this.currentIndex - 1);
    }

    nextSlide() {
        if (!this.isTransitioning) this.goToSlide(this.currentIndex + 1);
    }

    updateDot(index, isActive) {
        const dots = document.querySelectorAll('.dot');
        if (dots[index]) dots[index].classList.toggle('active', isActive);
    }
}

// ===== RSVP MANAGER (CHỈ FORM + SUBMIT) =====
class RSVPManager {
    constructor() {
        this.SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz3j7iYQ5ur_TMHNIMiGdhb0ejLSWKmV4yIMysSL8-5mxV2VLkxbGg9KmKC6lkL-83nlg/exec';
        this.init();
    }

    init() {
        console.log('📋 Initializing RSVP Manager...');
        this.setupForm();
        this.setupCounter();
        this.setupLocationOptions();
    }

    setupForm() {
        this.form = document.getElementById('rsvpForm');
        this.confirmationMessage = document.getElementById('confirmationMessage');
        this.confirmationDetails = document.getElementById('confirmationDetails');
        this.newResponseBtn = document.getElementById('newResponseBtn');
        
        if (!this.form) return console.error('❌ Form not found');
        
        this.form.addEventListener('submit', e => this.handleSubmit(e));
        if (this.newResponseBtn) this.newResponseBtn.addEventListener('click', () => this.showForm());
        
        this.form.querySelectorAll('input[name="attendance"]').forEach(radio => {
            radio.addEventListener('change', () => this.toggleLocationOptions());
        });
        
        this.toggleLocationOptions();
    }

    setupCounter() {
        const guestCount = document.getElementById('guestCount');
        const minusBtn = document.querySelector('.counter-btn.minus');
        const plusBtn = document.querySelector('.counter-btn.plus');
        
        if (!guestCount || !minusBtn || !plusBtn) return;
        
        minusBtn.addEventListener('click', () => {
            let value = parseInt(guestCount.value);
            if (value > 1) {
                guestCount.value = value - 1;
                this.updateCounterButtons(value - 1);
            }
        });
        
        plusBtn.addEventListener('click', () => {
            let value = parseInt(guestCount.value);
            if (value < 10) {
                guestCount.value = value + 1;
                this.updateCounterButtons(value + 1);
            }
        });
        
        this.updateCounterButtons(1);
    }

    setupLocationOptions() {
        document.querySelectorAll('input[name="location"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const attendance = document.querySelector('input[name="attendance"]:checked');
                if (attendance?.value === 'Có') {
                    const checked = document.querySelectorAll('input[name="location"]:checked');
                    if (checked.length === 0) {
                        this.showError('Vui lòng chọn ít nhất một địa điểm tham dự');
                        checkbox.checked = true;
                    }
                }
            });
        });
    }

    toggleLocationOptions() {
        const attendance = document.querySelector('input[name="attendance"]:checked');
        const locationGroup = document.getElementById('locationGroup');
        const locationCheckboxes = document.querySelectorAll('input[name="location"]');
        
        if (attendance?.value === 'Có') {
            locationGroup.style.display = 'block';
            locationCheckboxes.forEach(cb => cb.disabled = false);
            if (!document.querySelector('input[name="location"]:checked')) locationCheckboxes[0].checked = true;
        } else {
            locationGroup.style.display = 'none';
            locationCheckboxes.forEach(cb => {
                cb.disabled = true;
                cb.checked = false;
            });
        }
    }

    updateCounterButtons(value) {
        const minusBtn = document.querySelector('.counter-btn.minus');
        const plusBtn = document.querySelector('.counter-btn.plus');
        if (minusBtn) minusBtn.disabled = value <= 1;
        if (plusBtn) plusBtn.disabled = value >= 10;
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const submitBtn = this.form.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Đang gửi...</span>';
            
            const formData = new FormData(this.form);
            const selectedLocations = Array.from(document.querySelectorAll('input[name="location"]:checked'))
                .map(cb => cb.value);
            
            const data = {
                name: formData.get('name'),
                relationship: formData.get('relationship'),
                attendance: formData.get('attendance'),
                guestCount: parseInt(formData.get('guestCount')),
                locations: selectedLocations,
                message: formData.get('message'),
                timestamp: new Date().toLocaleString('vi-VN'),
                date: new Date().toISOString().split('T')[0]
            };
            
            this.validateData(data);
            await this.sendToGoogleSheets(data);
            
            this.showConfirmation(data);
            this.form.reset();
            this.updateCounterButtons(1);
            this.toggleLocationOptions();
            
        } catch (error) {
            console.error('❌ Submit error:', error);
            this.showError(error.message || 'Có lỗi xảy ra khi gửi xác nhận');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    }

    validateData(data) {
        if (!data.name || data.name.trim().length < 2) throw new Error('Vui lòng nhập họ tên hợp lệ (ít nhất 2 ký tự)');
        if (!data.relationship) throw new Error('Vui lòng chọn mối quan hệ');
        if (!data.attendance) throw new Error('Vui lòng chọn tình trạng tham dự');
        if (!data.guestCount || data.guestCount < 1 || data.guestCount > 10) throw new Error('Số lượng khách phải từ 1 đến 10 người');
        if (data.attendance === 'Có' && (!data.locations || data.locations.length === 0)) throw new Error('Vui lòng chọn ít nhất một địa điểm tham dự');
    }

    async sendToGoogleSheets(data) {
        const maxRetries = 2;
        let attempt = 0;

        while (attempt <= maxRetries) {
            try {
                await fetch(this.SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(data)
                });
                console.log('✅ POST request đã được gửi');
                return;
            } catch (error) {
                attempt++;
                if (attempt > maxRetries) throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
    }

    showConfirmation(data) {
        if (!this.form || !this.confirmationMessage) return;
        
        this.form.style.display = 'none';
        this.confirmationMessage.style.display = 'block';
        
        if (this.confirmationDetails) {
            let html = '<h4>Thông tin xác nhận:</h4><ul>';
            html += `<li><i class="fas fa-user"></i> <strong>Họ tên:</strong> ${data.name}</li>`;
            html += `<li><i class="fas fa-users"></i> <strong>Số người:</strong> ${data.guestCount} người</li>`;
            html += `<li><i class="fas fa-handshake"></i> <strong>Mối quan hệ:</strong> ${data.relationship}</li>`;
            html += `<li><i class="fas fa-calendar-check"></i> <strong>Tham dự:</strong> ${data.attendance}</li>`;
            
            if (data.attendance === 'Có' && data.locations.length > 0) {
                html += `<li><i class="fas fa-map-marker-alt"></i> <strong>Địa điểm:</strong> ${data.locations.join(', ')}</li>`;
                
                if (data.locations.includes('Nhà trai')) {
                    html += `<li><i class="fas fa-calendar-day"></i> Nhà trai (Hà Tĩnh): 30/03/2026</li>`;
                }
                if (data.locations.includes('Nhà gái')) {
                    html += `<li><i class="fas fa-calendar-day"></i> Nhà gái (Lâm Đồng): 22/03/2026</li>`;
                }
                if (data.locations.includes('Báo hỷ')) {
                    html += `<li><i class="fas fa-calendar-day"></i> Tiệc báo hỷ (TP.HCM): 19/04/2026</li>`;
                }
            }
            
            if (data.message) {
                html += `<li><i class="fas fa-comment"></i> <strong>Lời nhắn:</strong> "${data.message}"</li>`;
            }
            html += '</ul>';
            this.confirmationDetails.innerHTML = html;
        }
        
        setTimeout(() => this.confirmationMessage.scrollIntoView({ behavior: 'smooth', block: 'center' }), 300);
    }

    showForm() {
        if (!this.form || !this.confirmationMessage) return;
        this.confirmationMessage.style.display = 'none';
        this.form.style.display = 'block';
        this.form.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    showError(message) {
        const toast = document.createElement('div');
        toast.className = 'error-toast show';
        toast.innerHTML = `<i class="fas fa-exclamation-circle"></i><span>${message}</span>`;
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => toast.remove(), 300);
        }, 5000);
    }
}

// ===== OPTIMIZED WEDDING INVITATION =====
class OptimizedWeddingInvitation {
    constructor() {
        this.music = document.getElementById('weddingMusic');
        this.musicBtn = document.getElementById('musicToggle');
        this.loadingScreen = document.getElementById('loadingScreen');
        this.isMobile = window.innerWidth <= 768;
        this.isLowEnd = this.detectLowEndDevice();
        
        this.init();
    }

    detectLowEndDevice() {
        const isAndroid = /android/i.test(navigator.userAgent);
        const isIOS = /iphone|ipod/i.test(navigator.userAgent);
        const memory = navigator.deviceMemory || 4;
        return (isAndroid || isIOS) && memory < 4;
    }

    init() {
        console.log('🚀 Optimized Wedding Invitation initializing...');
        this.preloadCriticalImages();
        
        // this.starsBackground = new OptimizedStarsBackground();
        // this.petals = new OptimizedPetals();
        this.slideshow = new OptimizedHeroSlideshow();
        this.rsvpManager = new RSVPManager();
        
        this.setupOptimizedEventListeners();
        this.setupScrollAnimations();
        this.setupGalleryAnimations();
        this.hideLoadingScreen();
        
        console.log('✅ Optimized initialization complete!');
    }

    preloadCriticalImages() {
        const criticalImages = ['assets/images/60x90sua.jpg', 'assets/images/0L5A8270.JPG'];
        criticalImages.forEach(src => {
            const img = new Image();
            img.src = src;
            img.loading = 'eager';
        });
    }

    setupOptimizedEventListeners() {
        if (this.music && this.musicBtn) {
            this.music.volume = 0.4;
            this.musicBtn.addEventListener('click', e => {
                e.stopPropagation();
                if (this.music.paused) {
                    this.music.play().then(() => this.musicBtn.classList.add('playing'));
                } else {
                    this.music.pause();
                    this.musicBtn.classList.remove('playing');
                }
            });
            
            const playMusic = () => {
                if (this.music.paused) this.music.play().then(() => this.musicBtn.classList.add('playing'));
                document.removeEventListener('click', playMusic);
                document.removeEventListener('touchstart', playMusic);
            };
            document.addEventListener('click', playMusic, { once: true });
            document.addEventListener('touchstart', playMusic, { once: true });
        }

        document.querySelector('.btn-scroll')?.addEventListener('click', e => {
            e.preventDefault();
            document.querySelector('#story')?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        });

        document.getElementById('closeImageModal')?.addEventListener('click', () => {
            document.getElementById('imageModal').style.display = 'none';
            document.body.style.overflow = 'auto';
        });

        document.addEventListener('keydown', e => {
            if (e.key === 'Escape') {
                document.getElementById('imageModal').style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    setupGalleryAnimations() {
        document.querySelectorAll('.gallery-img-container').forEach(container => {
            container.addEventListener('click', () => {
                const img = container.querySelector('img');
                if (img) {
                    document.getElementById('modalImage').src = img.src;
                    document.getElementById('imageModal').style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                }
            });
        });
    }

    setupScrollAnimations() {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { 
            threshold: 0.1, 
            rootMargin: '100px 0px' // Tăng margin để trigger sớm hơn
        });
        
        // Observe tất cả items
        document.querySelectorAll('.timeline-item, .gallery-item').forEach(el => {
            observer.observe(el);
        });
        
        // Tự động thêm class 'visible' cho 3 items cuối sau 2 giây
        setTimeout(() => {
            const galleryItems = document.querySelectorAll('.gallery-item');
            const lastThree = Array.from(galleryItems).slice(-3);
            lastThree.forEach(item => {
                if (!item.classList.contains('visible')) {
                    item.classList.add('visible');
                }
            });
        }, 2000);
    }

    hideLoadingScreen() {
        if (this.loadingScreen) {
            setTimeout(() => {
                this.loadingScreen.classList.add('hidden');
                setTimeout(() => {
                    this.loadingScreen.style.display = 'none';
                    document.body.classList.remove('loading');
                }, 500);
            }, 800);
        }
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        try {
            window.weddingApp = new OptimizedWeddingInvitation();
            console.log('🎉 Ứng dụng đã khởi động!');
        } catch (err) {
            console.error('❌ Application failed:', err);
            document.body.classList.remove('loading');
            const loadingScreen = document.getElementById('loadingScreen');
            if (loadingScreen) loadingScreen.style.display = 'none';
        }
    }, 100);
});