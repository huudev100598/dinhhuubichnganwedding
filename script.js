// ===== UTILITY CLASSES =====
class ImagePreloader {
    constructor() {
        this.images = [
            'assets/images/0L5A8396.JPG',
            'assets/images/0L5A8270.JPG',
            'assets/images/0L5A8480.JPG',
            'assets/images/0L5A8607.JPG',
            'assets/images/60x90sua.JPG',
            'assets/images/CM3786.JPG',
            'assets/images/CM1605.JPG',
            'assets/images/CM0013.JPG',
            'assets/images/0L5A8527.JPG',
            'assets/images/0L5A8593.JPG'
        ];
    }

    preload() {
        this.images.forEach(src => {
            const img = new Image();
            img.src = src;
            img.crossOrigin = 'anonymous'; // Giảm warning preload credentials mode
            console.log('[Preload] Bắt đầu tải:', src.split('/').pop());
        });
    }
}

class StarsBackground {
    constructor() {
        this.canvas = document.getElementById('stars');
        if (!this.canvas) return;
        
        this.ctx = this.canvas.getContext('2d');
        this.stars = [];
        this.init();
    }

    init() {
        this.resize();
        this.createStars();
        this.animate();
        
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
        this.createStars();
    }

    createStars() {
        const count = Math.min(150, Math.floor((window.innerWidth * window.innerHeight) / 5000));
        this.stars = [];
        
        for (let i = 0; i < count; i++) {
            this.stars.push({
                x: Math.random() * this.canvas.width,
                y: Math.random() * this.canvas.height,
                size: Math.random() * 2 + 0.5,
                speed: Math.random() * 0.5 + 0.2,
                opacity: Math.random() * 0.5 + 0.3
            });
        }
    }

    animate() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        
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
        
        requestAnimationFrame(() => this.animate());
    }
}

class HeroSlideshow {
    constructor() {
        this.slides = document.querySelectorAll('.slide');
        this.dotsContainer = document.querySelector('.slide-dots');
        this.prevBtn = document.querySelector('.prev-btn');
        this.nextBtn = document.querySelector('.next-btn');
        this.currentIndex = 0;
        this.interval = null;
        
        if (this.slides.length > 0) {
            this.init();
        }
    }

    init() {
        this.slides.forEach(slide => {
            const bg = slide.getAttribute('data-bg');
            if (bg) {
                slide.style.backgroundImage = `url('${bg}')`;
            }
        });

        this.createDots();
        this.setupControls();
        this.startAutoPlay();
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
        if (this.prevBtn) {
            this.prevBtn.addEventListener('click', () => this.prevSlide());
        }
        
        if (this.nextBtn) {
            this.nextBtn.addEventListener('click', () => this.nextSlide());
        }
    }

    startAutoPlay() {
        this.interval = setInterval(() => this.nextSlide(), 5000);
        
        const slideshow = document.querySelector('.background-slideshow');
        if (slideshow) {
            slideshow.addEventListener('mouseenter', () => clearInterval(this.interval));
            slideshow.addEventListener('mouseleave', () => {
                this.interval = setInterval(() => this.nextSlide(), 5000);
            });
        }
    }

    goToSlide(index) {
        this.slides[this.currentIndex].classList.remove('active');
        this.updateDot(this.currentIndex, false);
        
        this.currentIndex = (index + this.slides.length) % this.slides.length;
        
        this.slides[this.currentIndex].classList.add('active');
        this.updateDot(this.currentIndex, true);
    }

    prevSlide() {
        this.goToSlide(this.currentIndex - 1);
    }

    nextSlide() {
        this.goToSlide(this.currentIndex + 1);
    }

    updateDot(index, isActive) {
        const dots = document.querySelectorAll('.dot');
        if (dots[index]) {
            dots[index].classList.toggle('active', isActive);
        }
    }
}

// ===== RSVP MANAGER =====
class RSVPManager {
    constructor() {
        // THAY URL NÀY BẰNG URL WEB APP MỚI NHẤT (từ deployment "Bất kỳ ai")
        this.SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbz3j7iYQ5ur_TMHNIMiGdhb0ejLSWKmV4yIMysSL8-5mxV2VLkxbGg9KmKC6lkL-83nlg/exec';
        
        this.stats = {
            totalGuests: 0,
            attendingGuests: 0,
            confirmedGroups: 0,
            locations: {
                groom: 0,
                bride: 0,
                party: 0
            }
        };
        
        this.init();
    }

    init() {
        console.log('📋 Initializing RSVP Manager...');
        this.setupForm();
        this.setupCounter();
        this.setupLocationOptions();
        this.loadStats();
        this.updateStatsDisplay();
        
        setInterval(() => this.loadStats(), 300000);
    }

    setupForm() {
        this.form = document.getElementById('rsvpForm');
        this.confirmationMessage = document.getElementById('confirmationMessage');
        this.confirmationDetails = document.getElementById('confirmationDetails');
        this.newResponseBtn = document.getElementById('newResponseBtn');
        
        if (!this.form) {
            console.error('❌ RSVP form not found');
            return;
        }
        
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
        
        if (this.newResponseBtn) {
            this.newResponseBtn.addEventListener('click', () => this.showForm());
        }
        
        const attendanceRadios = this.form.querySelectorAll('input[name="attendance"]');
        attendanceRadios.forEach(radio => {
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
        const locationCheckboxes = document.querySelectorAll('input[name="location"]');
        locationCheckboxes.forEach(checkbox => {
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
            
            const checked = document.querySelectorAll('input[name="location"]:checked');
            if (checked.length === 0) {
                locationCheckboxes[0].checked = true;
            }
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
            
            console.log('📤 Preparing to send RSVP data:', data);
            
            this.validateData(data);
            
            const response = await this.sendToGoogleSheets(data);
            
            console.log('📨 Server response status:', response);
            
            this.showConfirmation(data);
            this.form.reset();
            this.updateCounterButtons(1);
            this.toggleLocationOptions();
            
            if (data.attendance === 'Có') {
                this.stats.totalGuests += data.guestCount;
                this.stats.attendingGuests += data.guestCount;
                this.stats.confirmedGroups += 1;
                
                data.locations.forEach(loc => {
                    if (loc === 'Nhà trai') this.stats.locations.groom += data.guestCount;
                    if (loc === 'Nhà gái') this.stats.locations.bride += data.guestCount;
                    if (loc === 'Báo hỷ') this.stats.locations.party += data.guestCount;
                });
                
                this.updateStatsDisplay();
                localStorage.setItem('weddingRSVPStats', JSON.stringify(this.stats));
            }
            
            setTimeout(() => this.loadStats(), 3000);
            
        } catch (error) {
            console.error('❌ Submit error:', error);
            this.showError(error.message || 'Có lỗi xảy ra khi gửi xác nhận');
        } finally {
            submitBtn.disabled = false;
            submitBtn.innerHTML = originalText;
        }
    }

    validateData(data) {
        if (!data.name || data.name.trim().length < 2) {
            throw new Error('Vui lòng nhập họ tên hợp lệ (ít nhất 2 ký tự)');
        }
        if (!data.relationship) throw new Error('Vui lòng chọn mối quan hệ');
        if (!data.attendance) throw new Error('Vui lòng chọn tình trạng tham dự');
        if (!data.guestCount || data.guestCount < 1 || data.guestCount > 10) {
            throw new Error('Số lượng khách phải từ 1 đến 10 người');
        }
        if (data.attendance === 'Có' && (!data.locations || data.locations.length === 0)) {
            throw new Error('Vui lòng chọn ít nhất một địa điểm tham dự');
        }
    }

    async sendToGoogleSheets(data) {
        const maxRetries = 2;
        let attempt = 0;

        while (attempt <= maxRetries) {
            try {
                console.log(`[SEND] Thử gửi POST lần ${attempt + 1} đến:`, this.SCRIPT_URL);
                console.log('[SEND] Payload:', JSON.stringify(data, null, 2));
                
                const response = await fetch(this.SCRIPT_URL, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(data)
                });
                
                console.log('✅ POST request đã được gửi (no-cors mode) - lần', attempt + 1);
                return { result: 'success' };
                
            } catch (error) {
                attempt++;
                console.warn('[SEND] Lỗi lần', attempt, ':', error.message);
                if (attempt > maxRetries) {
                    console.error('🌐 Network error sau', maxRetries, 'lần thử:', error);
                    throw new Error('Không thể kết nối đến server. Vui lòng thử lại sau.');
                }
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
    }

    async loadStats() {
        try {
            const saved = localStorage.getItem('weddingRSVPStats');
            if (saved) {
                this.stats = JSON.parse(saved);
                this.updateStatsDisplay();
                console.log('📊 Loaded stats from localStorage:', this.stats);
            }
        } catch (err) {
            console.warn('Không load được stats:', err);
        }
    }

    updateStatsDisplay() {
        const totalEl = document.getElementById('totalGuests');
        const attendingEl = document.getElementById('attendingGuests');
        const groupsEl = document.getElementById('confirmedGroups');
        
        if (totalEl) this.animateCounter(totalEl, this.stats.totalGuests);
        if (attendingEl) this.animateCounter(attendingEl, this.stats.attendingGuests);
        if (groupsEl) this.animateCounter(groupsEl, this.stats.confirmedGroups);
        
        this.updateLocationStats();
    }

    updateLocationStats() {
        let container = document.querySelector('.location-stats');
        
        if (!container) {
            container = document.createElement('div');
            container.className = 'location-stats';
            container.innerHTML = `
                <div class="location-stat">
                    <i class="fas fa-home"></i>
                    <span class="stat-number" id="groomLocationCount">0</span>
                    <span class="stat-label">Nhà trai</span>
                </div>
                <div class="location-stat">
                    <i class="fas fa-heart"></i>
                    <span class="stat-number" id="brideLocationCount">0</span>
                    <span class="stat-label">Nhà gái</span>
                </div>
                <div class="location-stat">
                    <i class="fas fa-champagne-glasses"></i>
                    <span class="stat-number" id="partyLocationCount">0</span>
                    <span class="stat-label">Báo hỷ</span>
                </div>
            `;
            const rsvpStats = document.querySelector('.rsvp-stats');
            if (rsvpStats && rsvpStats.parentNode) {
                rsvpStats.parentNode.insertBefore(container, rsvpStats.nextSibling);
            }
        }
        
        const groomEl = document.getElementById('groomLocationCount');
        const brideEl = document.getElementById('brideLocationCount');
        const partyEl = document.getElementById('partyLocationCount');
        
        if (groomEl) this.animateCounter(groomEl, this.stats.locations.groom);
        if (brideEl) this.animateCounter(brideEl, this.stats.locations.bride);
        if (partyEl) this.animateCounter(partyEl, this.stats.locations.party);
    }

    animateCounter(element, target) {
        if (!element) return;
        const current = parseInt(element.textContent) || 0;
        if (current === target) return;
        
        const diff = Math.abs(target - current);
        const increment = target > current ? 1 : -1;
        const stepTime = Math.max(30, Math.floor(800 / diff));
        
        let value = current;
        const timer = setInterval(() => {
            value += increment;
            element.textContent = value;
            if (value === target) clearInterval(timer);
        }, stepTime);
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
        
        setTimeout(() => {
            this.confirmationMessage.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }, 300);
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

// ===== MAIN APPLICATION =====
class WeddingInvitation {
    constructor() {
        this.music = document.getElementById('weddingMusic');
        this.musicBtn = document.getElementById('musicToggle');
        this.loadingScreen = document.getElementById('loadingScreen');
        this.isMobile = window.innerWidth <= 768;
        
        this.init();
    }

    init() {
        console.log('💒 Wedding Invitation initializing...');
        
        new ImagePreloader().preload();
        new StarsBackground();
        new HeroSlideshow();
        new RSVPManager();
        
        this.setupMusic();
        this.setupEventListeners();
        this.createPetals();
        this.setupScrollAnimations();
        this.setupGalleryAnimations();
        this.hideLoadingScreen();
        
        if (this.isMobile) {
            document.querySelectorAll('.petal').forEach(p => p.style.display = 'none');
        }
        
        console.log('✅ Initialization complete!');
    }

    hideLoadingScreen() {
        if (this.loadingScreen) {
            setTimeout(() => {
                this.loadingScreen.classList.add('hidden');
                setTimeout(() => this.loadingScreen.style.display = 'none', 500);
            }, 800);
        }
    }

    setupMusic() {
        if (!this.music || !this.musicBtn) return;
        
        this.music.volume = 0.4;
        
        this.musicBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            if (this.music.paused) {
                this.music.play().then(() => this.musicBtn.classList.add('playing'));
            } else {
                this.music.pause();
                this.musicBtn.classList.remove('playing');
            }
        });
        
        document.addEventListener('click', () => {
            if (this.music.paused) {
                this.music.play().then(() => this.musicBtn.classList.add('playing'));
            }
        }, { once: true });
    }

    setupEventListeners() {
        document.querySelector('.btn-scroll')?.addEventListener('click', (e) => {
            e.preventDefault();
            document.querySelector('#story')?.scrollIntoView({ behavior: 'smooth' });
        });

        document.getElementById('closeImageModal')?.addEventListener('click', () => {
            document.getElementById('imageModal').style.display = 'none';
            document.body.style.overflow = 'auto';
        });

        document.addEventListener('keydown', (e) => {
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
                    const modal = document.getElementById('imageModal');
                    const modalImg = document.getElementById('modalImage');
                    modalImg.src = img.src;
                    modal.style.display = 'flex';
                    document.body.style.overflow = 'hidden';
                }
            });
        });
    }

    createPetals() {
        if (this.isMobile) return;
        const container = document.querySelector('.petals-container');
        if (!container) return;
        
        for (let i = 0; i < 8; i++) {
            setTimeout(() => this.createSinglePetal(container), i * 400);
        }
    }

    createSinglePetal(container) {
        const petal = document.createElement('div');
        petal.className = 'petal';
        
        const size = Math.random() * 12 + 6;
        const left = Math.random() * 100;
        const duration = Math.random() * 8 + 6;
        
        petal.style.cssText = `
            width: ${size}px; height: ${size}px;
            left: ${left}vw;
            animation: fall ${duration}s linear infinite;
        `;
        
        container.appendChild(petal);
        
        setTimeout(() => {
            petal.remove();
            this.createSinglePetal(container);
        }, duration * 1000);
    }

    setupScrollAnimations() {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { threshold: 0.1 });
        
        document.querySelectorAll('.timeline-item, .gallery-item, .detail-card, .rsvp-section')
            .forEach(el => observer.observe(el));
    }
}

// Khởi chạy ứng dụng
document.addEventListener('DOMContentLoaded', () => {
    try {
        window.weddingApp = new WeddingInvitation();
        console.log('💒 Ứng dụng đã khởi động thành công!');
    } catch (err) {
        console.error('❌ Application failed to start:', err);
    }
});