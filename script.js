// ===== OPTIMIZED PERFORMANCE =====

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

// ===== OPTIMIZED GALLERY =====
class OptimizedGallery {
    constructor() {
        this.mainImage = document.getElementById('mainGalleryImage');
        this.mainTitle = document.getElementById('mainImageTitle');
        this.mainDesc = document.getElementById('mainImageDesc');
        this.thumbnails = document.querySelectorAll('.thumbnail-item');
        this.currentImage = document.getElementById('currentImage');
        this.totalImages = document.getElementById('totalImages');
        this.prevThumbBtn = document.querySelector('.prev-thumb');
        this.nextThumbBtn = document.querySelector('.next-thumb');
        this.thumbnailList = document.querySelector('.thumbnail-list');
        this.scrollContainer = document.querySelector('.thumbnail-scroll-container');
        this.images = [];
        this.currentIndex = 0;
        
        this.init();
    }

    init() {
        console.log('📸 Initializing Optimized Gallery...');
        this.loadImages();
        this.setupEventListeners();
        this.updateCounter();
        this.updateThumbNavButtons();
    }

    loadImages() {
        this.thumbnails.forEach((thumb, index) => {
            const src = thumb.getAttribute('data-src');
            const title = thumb.getAttribute('data-title');
            const desc = thumb.getAttribute('data-desc');
            
            this.images.push({ src, title, desc });
            
            if (index === 0) {
                thumb.classList.add('active');
                this.updateMainImage(src, title, desc);
            }
        });
        
        this.totalImages.textContent = this.images.length;
    }

    setupEventListeners() {
        // Thumbnail click
        this.thumbnails.forEach((thumb, index) => {
            thumb.addEventListener('click', () => this.selectImage(index));
        });

        // Navigation buttons
        if (this.prevThumbBtn) {
            this.prevThumbBtn.addEventListener('click', () => this.scrollThumbs('prev'));
        }
        
        if (this.nextThumbBtn) {
            this.nextThumbBtn.addEventListener('click', () => this.scrollThumbs('next'));
        }

        // Main image click for zoom
        if (this.mainImage) {
            this.mainImage.addEventListener('click', () => this.showZoomModal());
        }

        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') this.navigate(-1);
            if (e.key === 'ArrowRight') this.navigate(1);
        });
    }

    selectImage(index) {
        if (index < 0 || index >= this.images.length || index === this.currentIndex) return;
        
        // Update active thumbnail
        this.thumbnails.forEach(thumb => thumb.classList.remove('active'));
        this.thumbnails[index].classList.add('active');
        
        // Scroll thumbnail into view
        this.scrollToThumb(index);
        
        // Update main image with fade effect
        this.fadeTransition(() => {
            this.currentIndex = index;
            const img = this.images[index];
            this.updateMainImage(img.src, img.title, img.desc);
            this.updateCounter();
        });
    }

    fadeTransition(callback) {
        if (!this.mainImage) return callback();
        
        this.mainImage.style.opacity = '0';
        setTimeout(() => {
            callback();
            setTimeout(() => {
                this.mainImage.style.opacity = '1';
            }, 50);
        }, 300);
    }

    updateMainImage(src, title, desc) {
        if (this.mainImage) {
            // Preload image
            const tempImg = new Image();
            tempImg.onload = () => {
                this.mainImage.src = src;
                this.mainImage.style.opacity = '1';
            };
            tempImg.src = src;
        }
        
        if (this.mainTitle) this.mainTitle.textContent = title;
        if (this.mainDesc) this.mainDesc.textContent = desc;
    }

    scrollToThumb(index) {
        if (!this.thumbnailList || !this.scrollContainer) return;
        
        const thumb = this.thumbnails[index];
        const containerWidth = this.scrollContainer.clientWidth;
        const thumbOffset = thumb.offsetLeft;
        const thumbWidth = thumb.offsetWidth;
        
        // Center the thumbnail
        const scrollTo = thumbOffset - (containerWidth / 2) + (thumbWidth / 2);
        
        this.thumbnailList.style.transform = `translateX(-${scrollTo}px)`;
        this.thumbnailList.style.transition = 'transform 0.3s ease';
    }

    scrollThumbs(direction) {
        if (!this.thumbnailList) return;
        
        const scrollAmount = 150;
        const currentTransform = this.getCurrentTransform();
        let newTransform;
        
        if (direction === 'prev') {
            newTransform = Math.max(0, currentTransform - scrollAmount);
        } else {
            const maxScroll = this.thumbnailList.scrollWidth - this.scrollContainer.clientWidth;
            newTransform = Math.min(maxScroll, currentTransform + scrollAmount);
        }
        
        this.thumbnailList.style.transform = `translateX(-${newTransform}px)`;
        this.updateThumbNavButtons();
    }

    getCurrentTransform() {
        if (!this.thumbnailList) return 0;
        const transform = this.thumbnailList.style.transform;
        if (!transform || transform === 'none') return 0;
        
        const match = transform.match(/translateX\(-(\d+)px\)/);
        return match ? parseInt(match[1]) : 0;
    }

    updateThumbNavButtons() {
        if (!this.prevThumbBtn || !this.nextThumbBtn || !this.scrollContainer) return;
        
        const currentTransform = this.getCurrentTransform();
        const maxScroll = this.thumbnailList.scrollWidth - this.scrollContainer.clientWidth;
        
        this.prevThumbBtn.disabled = currentTransform <= 0;
        this.nextThumbBtn.disabled = currentTransform >= maxScroll;
    }

    navigate(direction) {
        const newIndex = this.currentIndex + direction;
        if (newIndex >= 0 && newIndex < this.images.length) {
            this.selectImage(newIndex);
        }
    }

    updateCounter() {
        this.currentImage.textContent = this.currentIndex + 1;
    }

    showZoomModal() {
        // Create zoom modal if it doesn't exist
        let modal = document.getElementById('galleryZoomModal');
        
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'galleryZoomModal';
            modal.className = 'modal-zoom';
            modal.innerHTML = `
                <div class="modal-zoom-content">
                    <button class="zoom-close-btn" aria-label="Đóng">
                        <i class="fas fa-times"></i>
                    </button>
                    <button class="zoom-nav-btn zoom-prev-btn" aria-label="Ảnh trước">
                        <i class="fas fa-chevron-left"></i>
                    </button>
                    <img class="modal-zoom-image" src="" alt="">
                    <button class="zoom-nav-btn zoom-next-btn" aria-label="Ảnh tiếp">
                        <i class="fas fa-chevron-right"></i>
                    </button>
                </div>
            `;
            document.body.appendChild(modal);
            
            // Setup modal events
            const closeBtn = modal.querySelector('.zoom-close-btn');
            const prevBtn = modal.querySelector('.zoom-prev-btn');
            const nextBtn = modal.querySelector('.zoom-next-btn');
            const modalImage = modal.querySelector('.modal-zoom-image');
            
            closeBtn.addEventListener('click', () => this.closeZoomModal(modal));
            prevBtn.addEventListener('click', () => {
                this.navigate(-1);
                this.updateZoomModalImage(modalImage);
            });
            nextBtn.addEventListener('click', () => {
                this.navigate(1);
                this.updateZoomModalImage(modalImage);
            });
            
            // Close on background click
            modal.addEventListener('click', (e) => {
                if (e.target === modal) this.closeZoomModal(modal);
            });
            
            // Keyboard navigation in modal
            const handleKeyDown = (e) => {
                if (modal.classList.contains('show')) {
                    if (e.key === 'Escape') {
                        this.closeZoomModal(modal);
                    }
                    if (e.key === 'ArrowLeft') {
                        this.navigate(-1);
                        this.updateZoomModalImage(modalImage);
                    }
                    if (e.key === 'ArrowRight') {
                        this.navigate(1);
                        this.updateZoomModalImage(modalImage);
                    }
                }
            };
            
            document.addEventListener('keydown', handleKeyDown);
            
            // Store event handler for cleanup
            modal._keydownHandler = handleKeyDown;
        }
        
        // Show current image in modal
        const modalImage = modal.querySelector('.modal-zoom-image');
        this.updateZoomModalImage(modalImage);
        
        modal.classList.add('show');
        document.body.style.overflow = 'hidden';
    }

    updateZoomModalImage(modalImage) {
        const img = this.images[this.currentIndex];
        modalImage.src = img.src;
        modalImage.alt = img.title;
    }

    closeZoomModal(modal) {
        modal.classList.remove('show');
        document.body.style.overflow = 'auto';
        // Clean up event listener
        document.removeEventListener('keydown', modal._keydownHandler);
    }
}

// ===== RSVP MANAGER =====
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
        
        this.slideshow = new OptimizedHeroSlideshow();
        this.rsvpManager = new RSVPManager();
        this.gallery = new OptimizedGallery();
        
        this.setupOptimizedEventListeners();
        this.setupScrollAnimations();
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
                    this.music.play().then(() => this.musicBtn.classList.add('playing'))
                        .catch(err => console.log('Music play failed:', err));
                } else {
                    this.music.pause();
                    this.musicBtn.classList.remove('playing');
                }
            });
            
            const playMusic = () => {
                if (this.music.paused) {
                    this.music.play().then(() => this.musicBtn.classList.add('playing'))
                        .catch(err => console.log('Music play failed:', err));
                }
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

    setupScrollAnimations() {
        const observer = new IntersectionObserver(entries => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                }
            });
        }, { 
            threshold: 0.1, 
            rootMargin: '100px 0px'
        });
        
        document.querySelectorAll('.timeline-item').forEach(el => {
            observer.observe(el);
        });
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