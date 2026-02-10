// ==============================================
// HIỆU ỨNG BẦU TRỜI SAO - STARS BACKGROUND
// ==============================================
class StarsBackground {
    constructor() {
        this.canvas = document.getElementById('stars');
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.fps = 60;
        this.fpsInterval = 1000 / this.fps;
        this.then = Date.now();
        this.isMobile = window.innerWidth <= 768;
        
        if (this.canvas) this.init();
    }

    init() {
        this.resizeCanvas();
        this.createStars();
        this.animate();
        
        // Optimize for resize
        window.addEventListener('resize', () => {
            this.resizeCanvas();
            this.createStars();
        });
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    createStars() {
        // Tạo ít sao hơn trên mobile để tăng performance
        const starCount = this.isMobile ? 
            Math.floor((window.innerWidth * window.innerHeight) / 5000) :
            Math.floor((window.innerWidth * window.innerHeight) / 2000);
        
        this.stars = [];
        
        for (let i = 0; i < starCount; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                radius: Math.random() * 1.5 + 0.5,
                speed: Math.random() * 0.3 + 0.1, // Chậm hơn để tiết kiệm pin
                opacity: Math.random() * 0.5 + 0.3,
                twinkleSpeed: Math.random() * 0.03 + 0.01,
                twinkleDirection: Math.random() > 0.5 ? 1 : -1
            });
        }
    }

    drawStars() {
        // Clear canvas với màu nền tối
        this.ctx.fillStyle = '#0a0d17';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        // Vẽ các ngôi sao
        this.stars.forEach(star => {
            // Hiệu ứng nhấp nháy
            star.opacity += star.twinkleSpeed * star.twinkleDirection;
            if (star.opacity > 0.8 || star.opacity < 0.2) {
                star.twinkleDirection *= -1;
            }
            
            // Di chuyển sao (chậm để đỡ tốn CPU)
            star.y += star.speed;
            if (star.y > this.canvas.height) {
                star.y = -10;
                star.x = Math.random() * this.canvas.width;
            }
            
            // Vẽ sao
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.radius, 0, Math.PI * 2);
            this.ctx.fillStyle = `rgba(255, 255, 255, ${star.opacity})`;
            this.ctx.fill();
        });
    }

    animate() {
        requestAnimationFrame(() => this.animate());
        
        const now = Date.now();
        const elapsed = now - this.then;
        
        // Giới hạn FPS để tiết kiệm pin
        if (elapsed > this.fpsInterval) {
            this.then = now - (elapsed % this.fpsInterval);
            this.drawStars();
        }
    }
}

// ==============================================
// HIỆU ỨNG CÁNH HOA RƠI - PETALS ANIMATION
// ==============================================
class PetalsAnimation {
    constructor() {
        this.container = document.querySelector('.petals-container');
        this.petals = [];
        this.maxPetals = 10;
        this.isMobile = window.innerWidth <= 768;
        
        // Chỉ chạy trên desktop để tối ưu performance
        if (this.container && !this.isMobile) this.init();
    }

    init() {
        this.createPetals();
        
        // Thêm cánh hoa mới theo thời gian
        this.interval = setInterval(() => this.addPetals(), 3000);
        
        // Xử lý resize
        window.addEventListener('resize', () => {
            this.isMobile = window.innerWidth <= 768;
            if (this.isMobile) {
                this.removePetals();
                if (this.interval) clearInterval(this.interval);
            }
        });
    }

    createPetals() {
        // Tạo cánh hoa ban đầu
        for (let i = 0; i < 5; i++) {
            this.createPetal();
        }
    }

    createPetal() {
        const petal = document.createElement('div');
        petal.className = 'petal';
        
        // Random kích thước
        const size = Math.random() * 15 + 10;
        petal.style.width = `${size}px`;
        petal.style.height = `${size}px`;
        
        // Random màu sắc (vàng hoặc hồng)
        const isGold = Math.random() > 0.5;
        petal.style.background = isGold ? 
            `linear-gradient(135deg, var(--primary-gold), #d4b483)` :
            `linear-gradient(135deg, var(--accent-pink), #ffc0cb)`;
        
        // Random vị trí và animation
        petal.style.left = `${Math.random() * 100}%`;
        petal.style.animationDuration = `${Math.random() * 10 + 10}s`;
        petal.style.animationDelay = `${Math.random() * 5}s`;
        
        this.container.appendChild(petal);
        this.petals.push(petal);
        
        // Tự động xóa sau khi animation kết thúc
        setTimeout(() => {
            if (petal.parentNode) {
                petal.remove();
                this.petals = this.petals.filter(p => p !== petal);
            }
        }, 30000);
    }

    addPetals() {
        // Chỉ thêm nếu chưa đạt giới hạn
        if (this.petals.length < this.maxPetals) {
            this.createPetal();
        }
    }

    removePetals() {
        this.petals.forEach(petal => petal.remove());
        this.petals = [];
    }
}

// ==============================================
// PERFORMANCE UTILITIES
// ==============================================
const perf = {
    debounce: (func, wait) => {
        let timeout;
        return (...args) => {
            clearTimeout(timeout);
            timeout = setTimeout(() => func.apply(this, args), wait);
        };
    },

    throttle: (func, limit) => {
        let inThrottle;
        return (...args) => {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        };
    }
};

// ==============================================
// HERO SLIDESHOW
// ==============================================
class HeroSlideshow {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.dotsContainer = document.querySelector('.slide-dots');
        this.currentIndex = 0;
        this.interval = null;
        this.preloaded = new Set();
        
        if (this.slides.length > 0) this.init();
    }

    init() {
        this.createDots();
        this.preloadNextImage();
        this.setupControls();
        this.startAutoPlay();
    }

    preloadNextImage() {
        const nextIndex = (this.currentIndex + 1) % this.slides.length;
        const nextSlide = this.slides[nextIndex];
        const bg = nextSlide.dataset.bg;
        
        if (bg && !this.preloaded.has(bg)) {
            const img = new Image();
            img.src = bg;
            this.preloaded.add(bg);
        }
    }

    createDots() {
        if (!this.dotsContainer) return;
        this.slides.forEach((_, i) => {
            const dot = document.createElement('div');
            dot.className = `dot ${i === 0 ? 'active' : ''}`;
            dot.addEventListener('click', () => this.goToSlide(i));
            this.dotsContainer.appendChild(dot);
        });
    }

    setupControls() {
        document.querySelector('.prev-btn')?.addEventListener('click', () => this.prevSlide());
        document.querySelector('.next-btn')?.addEventListener('click', () => this.nextSlide());
        
        const slideshow = document.querySelector('.background-slideshow');
        if (slideshow) {
            slideshow.addEventListener('mouseenter', () => clearInterval(this.interval));
            slideshow.addEventListener('mouseleave', () => this.startAutoPlay());
        }
    }

    startAutoPlay() {
        if (this.interval) clearInterval(this.interval);
        this.interval = setInterval(() => this.nextSlide(), 5000);
    }

    goToSlide(index) {
        this.slides[this.currentIndex].classList.remove('active');
        this.updateDot(this.currentIndex, false);
        
        this.currentIndex = (index + this.slides.length) % this.slides.length;
        
        const slide = this.slides[this.currentIndex];
        const bg = slide.dataset.bg;
        
        if (bg && !slide.style.backgroundImage) {
            slide.style.backgroundImage = `url('${bg}')`;
        }
        
        slide.classList.add('active');
        this.updateDot(this.currentIndex, true);
        this.preloadNextImage();
    }

    prevSlide() {
        this.goToSlide(this.currentIndex - 1);
    }

    nextSlide() {
        this.goToSlide(this.currentIndex + 1);
    }

    updateDot(index, isActive) {
        const dots = document.querySelectorAll('.dot');
        if (dots[index]) dots[index].classList.toggle('active', isActive);
    }
}

// ==============================================
// GALLERY
// ==============================================
class Gallery {
    constructor() {
        this.mainImage = document.getElementById('mainGalleryImage');
        this.thumbnails = document.querySelectorAll('.thumbnail-item');
        this.currentIndex = 0;
        this.images = [];
        
        this.init();
    }

    init() {
        this.loadImages();
        this.setupEventListeners();
        this.updateCounter();
    }

    loadImages() {
        this.thumbnails.forEach((thumb, i) => {
            this.images.push({
                src: thumb.dataset.src,
                title: thumb.dataset.title,
                desc: thumb.dataset.desc
            });
            
            if (i === 0) {
                thumb.classList.add('active');
                this.updateMainImage(this.images[0]);
            }
        });
        
        document.getElementById('totalImages').textContent = this.images.length;
    }

    setupEventListeners() {
        this.thumbnails.forEach((thumb, i) => {
            thumb.addEventListener('click', () => this.selectImage(i));
        });

        document.querySelector('.prev-thumb')?.addEventListener('click', 
            perf.throttle(() => this.scrollThumbs('prev'), 300)
        );
        
        document.querySelector('.next-thumb')?.addEventListener('click',
            perf.throttle(() => this.scrollThumbs('next'), 300)
        );

        this.mainImage?.addEventListener('click', () => this.showZoomModal());

        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.navigate(-1);
            if (e.key === 'ArrowRight') this.navigate(1);
            if (e.key === 'Escape') this.closeZoomModal();
        });
    }

    selectImage(index) {
        if (index === this.currentIndex) return;
        
        this.thumbnails.forEach(t => t.classList.remove('active'));
        this.thumbnails[index].classList.add('active');
        
        this.currentIndex = index;
        this.updateMainImage(this.images[index]);
        this.updateCounter();
        this.scrollToThumb(index);
    }

    updateMainImage(imgData) {
        if (this.mainImage) {
            const tempImg = new Image();
            tempImg.onload = () => {
                this.mainImage.src = imgData.src;
                this.mainImage.alt = imgData.title;
            };
            tempImg.src = imgData.src;
        }
    }

    scrollToThumb(index) {
        const container = document.querySelector('.thumbnail-scroll-container');
        const thumb = this.thumbnails[index];
        if (!container || !thumb) return;
        
        const scrollLeft = thumb.offsetLeft - (container.clientWidth / 2) + (thumb.clientWidth / 2);
        container.scrollLeft = scrollLeft;
    }

    scrollThumbs(direction) {
        const container = document.querySelector('.thumbnail-scroll-container');
        if (!container) return;
        
        const scrollAmount = 150;
        container.scrollLeft += direction === 'prev' ? -scrollAmount : scrollAmount;
    }

    navigate(direction) {
        const newIndex = this.currentIndex + direction;
        if (newIndex >= 0 && newIndex < this.images.length) {
            this.selectImage(newIndex);
        }
    }

    updateCounter() {
        document.getElementById('currentImage').textContent = this.currentIndex + 1;
    }

    showZoomModal() {
        const modal = document.createElement('div');
        modal.className = 'modal-zoom show';
        modal.innerHTML = `
            <div class="modal-zoom-content">
                <button class="zoom-close-btn"><i class="fas fa-times"></i></button>
                <button class="zoom-nav-btn zoom-prev-btn"><i class="fas fa-chevron-left"></i></button>
                <img class="modal-zoom-image" src="${this.images[this.currentIndex].src}" alt="${this.images[this.currentIndex].title}">
                <button class="zoom-nav-btn zoom-next-btn"><i class="fas fa-chevron-right"></i></button>
            </div>
        `;
        
        document.body.appendChild(modal);
        document.body.style.overflow = 'hidden';
        
        modal.querySelector('.zoom-close-btn').addEventListener('click', () => this.closeZoomModal());
        modal.querySelector('.zoom-prev-btn').addEventListener('click', () => {
            this.navigate(-1);
            modal.querySelector('.modal-zoom-image').src = this.images[this.currentIndex].src;
        });
        modal.querySelector('.zoom-next-btn').addEventListener('click', () => {
            this.navigate(1);
            modal.querySelector('.modal-zoom-image').src = this.images[this.currentIndex].src;
        });
        
        modal.addEventListener('click', (e) => {
            if (e.target === modal) this.closeZoomModal();
        });
    }

    closeZoomModal() {
        const modal = document.querySelector('.modal-zoom');
        if (modal) {
            modal.remove();
            document.body.style.overflow = 'auto';
        }
    }
}

// ==============================================
// RSVP FORM
// ==============================================
class RSVPForm {
    constructor() {
        this.SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz3j7iYQ5ur_TMHNIMiGdhb0ejLSWKmV4yIMysSL8-5mxV2VLkxbGg9KmKC6lkL-83nlg/exec';
        this.init();
    }

    init() {
        this.setupForm();
        this.setupCounter();
        this.setupLocationOptions();
    }

    setupForm() {
        const form = document.getElementById('rsvpForm');
        if (!form) return;
        
        form.addEventListener('submit', (e) => this.handleSubmit(e));
        document.getElementById('newResponseBtn')?.addEventListener('click', () => this.showForm());
        
        form.querySelectorAll('input[name="attendance"]').forEach(radio => {
            radio.addEventListener('change', () => this.toggleLocationOptions());
        });
    }

    setupCounter() {
        const guestCount = document.getElementById('guestCount');
        const minusBtn = document.querySelector('.counter-btn.minus');
        const plusBtn = document.querySelector('.counter-btn.plus');
        
        if (!guestCount || !minusBtn || !plusBtn) return;
        
        minusBtn.addEventListener('click', () => {
            let value = parseInt(guestCount.value);
            if (value > 1) guestCount.value = value - 1;
        });
        
        plusBtn.addEventListener('click', () => {
            let value = parseInt(guestCount.value);
            if (value < 10) guestCount.value = value + 1;
        });
    }

    setupLocationOptions() {
        document.querySelectorAll('input[name="location"]').forEach(checkbox => {
            checkbox.addEventListener('change', () => {
                const attendance = document.querySelector('input[name="attendance"]:checked');
                if (attendance?.value === 'Có') {
                    const checked = document.querySelectorAll('input[name="location"]:checked');
                    if (checked.length === 0) checkbox.checked = true;
                }
            });
        });
    }

    toggleLocationOptions() {
        const attendance = document.querySelector('input[name="attendance"]:checked');
        const locationGroup = document.getElementById('locationGroup');
        
        if (attendance?.value === 'Có') {
            locationGroup.style.display = 'block';
        } else {
            locationGroup.style.display = 'none';
        }
    }

    async handleSubmit(e) {
        e.preventDefault();
        
        const form = e.target;
        const submitBtn = form.querySelector('.submit-btn');
        const originalText = submitBtn.innerHTML;
        
        try {
            submitBtn.disabled = true;
            submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i><span>Đang gửi...</span>';
            
            const formData = new FormData(form);
            const data = {
                name: formData.get('name'),
                relationship: formData.get('relationship'),
                attendance: formData.get('attendance'),
                guestCount: formData.get('guestCount'),
                locations: Array.from(document.querySelectorAll('input[name="location"]:checked')).map(cb => cb.value),
                message: formData.get('message'),
                timestamp: new Date().toLocaleString('vi-VN')
            };
            
            await this.sendToGoogleSheets(data);
            this.showConfirmation(data);
            form.reset();
            
        } catch (error) {
            console.error('Error:', error);
            this.showError('Có lỗi xảy ra khi gửi xác nhận');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    }

    async sendToGoogleSheets(data) {
        await fetch(this.SCRIPT_URL, {
            method: 'POST',
            mode: 'no-cors',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data)
        });
    }

    showConfirmation(data) {
        const form = document.getElementById('rsvpForm');
        const message = document.getElementById('confirmationMessage');
        const details = document.getElementById('confirmationDetails');
        
        if (!form || !message) return;
        
        form.style.display = 'none';
        message.style.display = 'block';
        
        if (details) {
            details.innerHTML = `
                <h4>Thông tin xác nhận:</h4>
                <ul>
                    <li><i class="fas fa-user"></i> <strong>Họ tên:</strong> ${data.name}</li>
                    <li><i class="fas fa-users"></i> <strong>Số người:</strong> ${data.guestCount}</li>
                    <li><i class="fas fa-handshake"></i> <strong>Mối quan hệ:</strong> ${data.relationship}</li>
                    ${data.attendance === 'Có' && data.locations.length > 0 ? 
                        `<li><i class="fas fa-map-marker-alt"></i> <strong>Địa điểm:</strong> ${data.locations.join(', ')}</li>` : ''}
                    ${data.message ? `<li><i class="fas fa-comment"></i> <strong>Lời nhắn:</strong> ${data.message}</li>` : ''}
                </ul>
            `;
        }
    }

    showForm() {
        const form = document.getElementById('rsvpForm');
        const message = document.getElementById('confirmationMessage');
        
        if (form && message) {
            message.style.display = 'none';
            form.style.display = 'block';
        }
    }

    showError(message) {
        const toast = document.createElement('div');
        toast.className = 'error-toast';
        toast.textContent = message;
        document.body.appendChild(toast);
        
        setTimeout(() => toast.remove(), 3000);
    }
}

// ==============================================
// MAIN WEDDING APP
// ==============================================
class WeddingApp {
    constructor() {
        this.music = document.getElementById('weddingMusic');
        this.musicBtn = document.getElementById('musicToggle');
        this.loadingScreen = document.getElementById('loadingScreen');
        
        this.init();
    }

    init() {
        this.setupMusic();
        this.setupScrollAnimations();
        this.setupEventListeners();
        this.hideLoadingScreen();
        
        // Khởi tạo các module với delay để tối ưu performance
        setTimeout(() => {
            new HeroSlideshow();
            new Gallery();
            new RSVPForm();
            
            // Kiểm tra thiết bị trước khi khởi tạo hiệu ứng
            if (this.shouldRunEffects()) {
                new StarsBackground();
                new PetalsAnimation();
            }
        }, 500);
    }

    shouldRunEffects() {
        // Kiểm tra nếu là mobile low-end thì tắt hiệu ứng
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
        const isLowMemory = navigator.deviceMemory && navigator.deviceMemory < 4;
        const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
        
        return !isMobile || (!isLowMemory && !prefersReducedMotion);
    }

    setupMusic() {
        if (this.music && this.musicBtn) {
            this.music.volume = 0.4;
            this.musicBtn.addEventListener('click', () => {
                if (this.music.paused) {
                    this.music.play().then(() => this.musicBtn.classList.add('playing'))
                        .catch(() => console.log('Music play failed'));
                } else {
                    this.music.pause();
                    this.musicBtn.classList.remove('playing');
                }
            });
            
            // Auto play on first interaction
            const playMusic = () => {
                if (this.music.paused) {
                    this.music.play().then(() => this.musicBtn.classList.add('playing'))
                        .catch(() => console.log('Music play failed'));
                }
                document.removeEventListener('click', playMusic);
                document.removeEventListener('touchstart', playMusic);
            };
            
            document.addEventListener('click', playMusic, { once: true });
            document.addEventListener('touchstart', playMusic, { once: true });
        }
    }

    setupScrollAnimations() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.timeline-item').forEach(el => observer.observe(el));
    }

    setupEventListeners() {
        // Smooth scroll
        document.querySelector('.btn-scroll')?.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('#story')?.scrollIntoView({ behavior: 'smooth' });
        });

        // Throttle scroll events
        window.addEventListener('scroll', perf.throttle(() => {
            // Có thể thêm hiệu ứng parallax ở đây nếu cần
        }, 100));
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

// ==============================================
// INITIALIZATION
// ==============================================
document.addEventListener('DOMContentLoaded', () => {
    // Preload critical resources
    const preload = () => {
        const images = ['assets/images/60x90sua.jpg', 'assets/images/0L5A8270.JPG'];
        images.forEach(src => {
            const img = new Image();
            img.src = src;
        });
    };
    
    preload();
    
    // Initialize app với delay nhẹ
    setTimeout(() => {
        try {
            window.weddingApp = new WeddingApp();
            console.log('🎉 Wedding App đã khởi động thành công!');
            console.log('✨ Hiệu ứng sao và cánh hoa đã được kích hoạt');
        } catch (error) {
            console.error('❌ Lỗi khởi động app:', error);
        }
    }, 100);
});