document.addEventListener('DOMContentLoaded', () => {
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('show');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    const hiddenElements = document.querySelectorAll('.hidden');
    hiddenElements.forEach((el) => observer.observe(el));

    // Smooth scroll for nav links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });
    // Auto-scroll and drag-to-scroll for screenshots carousel
    const carousel = document.getElementById('screenshot-carousel');
    let isDown = false;
    let startX;
    let scrollLeft;
    let autoScrollInterval;

    const startAutoScroll = () => {
        stopAutoScroll();
        autoScrollInterval = setInterval(() => {
            if (carousel) {
                if (Math.ceil(carousel.scrollLeft + carousel.clientWidth) >= carousel.scrollWidth) {
                    stopAutoScroll();
                } else {
                    carousel.scrollLeft += 1;
                }
            }
        }, 30);
    };

    const stopAutoScroll = () => {
        clearInterval(autoScrollInterval);
    };

    let isDragging = false;

    if (carousel) {
        startAutoScroll();

        carousel.addEventListener('mousedown', (e) => {
            isDown = true;
            isDragging = false;
            startX = e.pageX - carousel.offsetLeft;
            scrollLeft = carousel.scrollLeft;
            stopAutoScroll();
        });
        
        carousel.addEventListener('mouseleave', () => {
            isDown = false;
            startAutoScroll();
        });
        
        carousel.addEventListener('mouseup', () => {
            isDown = false;
            startAutoScroll();
        });
        
        carousel.addEventListener('mousemove', (e) => {
            if (!isDown) return;
            isDragging = true;
            e.preventDefault();
            const x = e.pageX - carousel.offsetLeft;
            const walk = (x - startX) * 2;
            carousel.scrollLeft = scrollLeft - walk;
        });

        carousel.addEventListener('touchstart', () => stopAutoScroll(), {passive: true});
        carousel.addEventListener('touchend', () => startAutoScroll(), {passive: true});
    }

    // Lightbox Functionality
    const lightbox = document.getElementById('lightbox');
    const lightboxImg = document.getElementById('lightbox-img');
    const closeBtn = document.querySelector('.close-btn');
    const prevBtn = document.getElementById('prev-btn');
    const nextBtn = document.getElementById('next-btn');
    const screenshots = document.querySelectorAll('.screenshot-img');
    
    let currentIndex = 0;
    const imagesArray = Array.from(screenshots);

    const showImage = (index) => {
        if (index < 0) index = imagesArray.length - 1;
        if (index >= imagesArray.length) index = 0;
        currentIndex = index;
        
        lightboxImg.style.opacity = '0.5';
        lightboxImg.style.transform = 'scale(0.95)';
        
        setTimeout(() => {
            lightboxImg.src = imagesArray[currentIndex].src;
            lightboxImg.style.opacity = '1';
            lightboxImg.style.transform = 'scale(1)';
        }, 150);
    };

    screenshots.forEach((img, index) => {
        img.addEventListener('click', (e) => {
            if (isDragging) {
                e.preventDefault();
                return;
            }
            lightbox.classList.add('active');
            showImage(index);
        });
    });

    closeBtn.addEventListener('click', () => {
        lightbox.classList.remove('active');
    });

    prevBtn.addEventListener('click', () => showImage(currentIndex - 1));
    nextBtn.addEventListener('click', () => showImage(currentIndex + 1));

    lightbox.addEventListener('click', (e) => {
        if (e.target === lightbox || e.target === document.querySelector('.lightbox-content')) {
            lightbox.classList.remove('active');
        }
    });

    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('active')) return;
        if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
        if (e.key === 'ArrowRight') showImage(currentIndex + 1);
        if (e.key === 'Escape') lightbox.classList.remove('active');
    });
});
