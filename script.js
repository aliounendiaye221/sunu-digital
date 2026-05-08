document.addEventListener('DOMContentLoaded', () => {

    // Navbar scroll effect
    const nav = document.getElementById('navbar');
    if (nav) {
        window.addEventListener('scroll', () => {
            nav.classList.toggle('scrolled', window.scrollY > 50);
        }, { passive: true });
    }

    // Intersection Observer for scroll animations (.reveal)
    const revealElements = document.querySelectorAll('.reveal');
    if (revealElements.length > 0 && 'IntersectionObserver' in window) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('active');
                    observer.unobserve(entry.target); // Stop observing once visible
                }
            });
        }, {
            threshold: 0.15,
            rootMargin: '0px 0px -50px 0px'
        });
        revealElements.forEach(el => observer.observe(el));
    } else {
        // Fallback: show all elements if IntersectionObserver not supported
        revealElements.forEach(el => el.classList.add('active'));
    }

    // FAQ Accordion — accessible with aria-expanded
    const faqBtns = document.querySelectorAll('.faq-q');
    faqBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const item = btn.parentElement;
            const isOpen = item.classList.contains('open');

            // Close all
            document.querySelectorAll('.faq-item').forEach(f => {
                f.classList.remove('open');
                f.querySelector('.faq-q')?.setAttribute('aria-expanded', 'false');
            });

            // Open clicked if it was closed
            if (!isOpen) {
                item.classList.add('open');
                btn.setAttribute('aria-expanded', 'true');
            }
        });
    });

    // --- PERSISTENT COUNTDOWN TIMER ---
    // The countdown persists across page reloads using localStorage.
    // Duration: 4 hours from first visit.
    const COUNTDOWN_DURATION_SECONDS = 4 * 3600; // 4 hours
    const STORAGE_KEY = 'sunu_digital_countdown_end';

    const countdownEl = document.getElementById('countdown');
    if (countdownEl) {
        let endTimestamp = parseInt(localStorage.getItem(STORAGE_KEY), 10);

        // If no stored value, or it's expired, reset the timer
        if (!endTimestamp || Date.now() >= endTimestamp) {
            endTimestamp = Date.now() + COUNTDOWN_DURATION_SECONDS * 1000;
            localStorage.setItem(STORAGE_KEY, endTimestamp);
        }

        const updateCountdown = () => {
            const remaining = Math.max(0, Math.floor((endTimestamp - Date.now()) / 1000));

            if (remaining <= 0) {
                countdownEl.textContent = '00:00:00';
                // Optional: hide the banner or show "expired" message
                return;
            }

            const h = Math.floor(remaining / 3600).toString().padStart(2, '0');
            const m = Math.floor((remaining % 3600) / 60).toString().padStart(2, '0');
            const s = (remaining % 60).toString().padStart(2, '0');
            countdownEl.textContent = `${h}:${m}:${s}`;
        };

        updateCountdown(); // Run immediately to avoid initial flicker
        setInterval(updateCountdown, 1000);
    }

    // Sticky CTA logic — appears after hero section scrolls out of view
    const stickyCta = document.getElementById('sticky-cta');
    const heroSection = document.getElementById('hero');

    if (stickyCta && heroSection) {
        const handleScroll = () => {
            const heroBottom = heroSection.getBoundingClientRect().bottom;
            stickyCta.classList.toggle('visible', heroBottom < 0);
        };
        window.addEventListener('scroll', handleScroll, { passive: true });
    }

    // --- LIGHTBOX SYSTEM ---
    const modal = document.createElement('div');
    modal.className = 'lightbox-modal';
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <img src="" alt="Full view" id="modal-img">
        </div>
    `;
    document.body.appendChild(modal);

    const modalImg = document.getElementById('modal-img');
    
    document.querySelectorAll('.screenshot-img').forEach(img => {
        img.addEventListener('click', () => {
            modal.classList.add('open');
            modalImg.src = img.src;
            document.body.style.overflow = 'hidden';
        });
    });

    modal.addEventListener('click', (e) => {
        if (e.target.classList.contains('lightbox-modal') || e.target.classList.contains('close-modal')) {
            modal.classList.remove('open');
            document.body.style.overflow = 'auto';
        }
    });

    // --- COUNTER ANIMATION ---
    const animateCounter = (el) => {
        const text = el.innerText;
        const match = text.match(/([\d\s]+)(.*)/);
        if (!match) return;
        
        const target = parseInt(match[1].replace(/\s/g, ''), 10);
        const suffix = match[2] || '';
        if (isNaN(target)) return;
        
        let count = 0;
        const duration = 2000;
        const increment = target / (duration / 16);
        
        const updateCount = () => {
            count += increment;
            if (count < target) {
                el.innerText = Math.floor(count).toLocaleString() + suffix;
                requestAnimationFrame(updateCount);
            } else {
                el.innerText = target.toLocaleString() + suffix;
            }
        };
        updateCount();
    };

    const counterElements = document.querySelectorAll('.stat-number, .sales-amount');
    if ('IntersectionObserver' in window) {
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    counterObserver.unobserve(entry.target);
                }
            });
        }, { threshold: 0.5 });
        counterElements.forEach(el => counterObserver.observe(el));
    }

    // --- VIDEO NAVIGATION ---
    const videoGrid = document.getElementById('videoGrid');
    const prevBtn = document.getElementById('prevVideo');
    const nextBtn = document.getElementById('nextVideo');

    if (videoGrid && prevBtn && nextBtn) {
        const scrollAmount = 350; // Approximative width of a video card + gap

        nextBtn.addEventListener('click', () => {
            videoGrid.scrollBy({ left: scrollAmount, behavior: 'smooth' });
        });

        prevBtn.addEventListener('click', () => {
            videoGrid.scrollBy({ left: -scrollAmount, behavior: 'smooth' });
        });

        // Hide/show buttons based on scroll position (optional but nice)
        const toggleBtns = () => {
            prevBtn.style.opacity = videoGrid.scrollLeft <= 10 ? '0.3' : '1';
            nextBtn.style.opacity = videoGrid.scrollLeft + videoGrid.clientWidth >= videoGrid.scrollWidth - 10 ? '0.3' : '1';
        };

        videoGrid.addEventListener('scroll', toggleBtns);
        window.addEventListener('resize', toggleBtns);
        toggleBtns();
    }
});
