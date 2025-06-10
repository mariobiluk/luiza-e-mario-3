document.addEventListener('DOMContentLoaded', function() {
    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Mobile menu toggle
    const menuToggle = document.querySelector('.navbar-toggle');
    const navMenu = document.querySelector('.navbar-nav');
    
    menuToggle.addEventListener('click', function() {
        navMenu.classList.toggle('active');
        menuToggle.innerHTML = navMenu.classList.contains('active') ? 
            '<i class="fas fa-times"></i>' : '<i class="fas fa-bars"></i>';
    });

    // Close menu when clicking on a nav item
    const navItems = document.querySelectorAll('.nav-item');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (navMenu.classList.contains('active')) {
                navMenu.classList.remove('active');
                menuToggle.innerHTML = '<i class="fas fa-bars"></i>';
            }
        });
    });

    // Carousel functionality
    const carouselSlides = document.querySelectorAll('.carousel-slide');
    const prevBtn = document.querySelector('.carousel-btn.prev');
    const nextBtn = document.querySelector('.carousel-btn.next');
    const dotsContainer = document.querySelector('.carousel-dots');
    let currentSlide = 0;

    // Create dots
    carouselSlides.forEach((_, index) => {
        const dot = document.createElement('div');
        dot.classList.add('dot');
        if (index === 0) dot.classList.add('active');
        dot.addEventListener('click', () => goToSlide(index));
        dotsContainer.appendChild(dot);
    });

    const dots = document.querySelectorAll('.dot');

    function showSlide(index) {
        carouselSlides.forEach(slide => slide.classList.remove('active'));
        dots.forEach(dot => dot.classList.remove('active'));
        
        carouselSlides[index].classList.add('active');
        dots[index].classList.add('active');
        currentSlide = index;
    }

    function goToSlide(index) {
        showSlide(index);
    }

    function nextSlide() {
        currentSlide = (currentSlide + 1) % carouselSlides.length;
        showSlide(currentSlide);
    }

    function prevSlide() {
        currentSlide = (currentSlide - 1 + carouselSlides.length) % carouselSlides.length;
        showSlide(currentSlide);
    }

    nextBtn.addEventListener('click', nextSlide);
    prevBtn.addEventListener('click', prevSlide);

    // Auto slide change
    let slideInterval = setInterval(nextSlide, 5000);

    // Pause on hover
    const carousel = document.querySelector('.carousel-container');
    carousel.addEventListener('mouseenter', () => clearInterval(slideInterval));
    carousel.addEventListener('mouseleave', () => slideInterval = setInterval(nextSlide, 5000));

    // Scroll to section
    const scrollDown = document.querySelector('.hero-scroll');
    scrollDown.addEventListener('click', () => {
        document.querySelector('.photo-carousel').scrollIntoView({ behavior: 'smooth' });
    });

    // Animate stats counter
    const statNumbers = document.querySelectorAll('.stat-number:not(.infinity)');
    
    function animateStats() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-count'));
            const duration = 2000;
            const step = target / (duration / 16);
            let current = 0;
            
            const counter = setInterval(() => {
                current += step;
                if (current >= target) {
                    stat.textContent = target;
                    clearInterval(counter);
                } else {
                    stat.textContent = Math.floor(current);
                }
            }, 16);
        });
    }

    // Intersection Observer for stats animation
    const statsSection = document.querySelector('.love-stats');
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateStats();
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    observer.observe(statsSection);

    // Smooth scroll for all links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
});

// Timeline Animation
function animateTimeline() {
    const timelineItems = document.querySelectorAll('.timeline-item');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 });

    timelineItems.forEach((item, index) => {
        item.style.opacity = '0';
        item.style.transform = 'translateY(20px)';
        item.style.transition = `all 0.5s ease ${index * 0.2}s`;
        observer.observe(item);
    });
}

// Initialize timeline animation when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Keep existing navbar and other functionality
    // ... (código anterior permanece o mesmo)

    // Initialize timeline animation
    animateTimeline();
    
    // Smooth scroll for timeline header
    const scrollDown = document.querySelector('.header-scroll');
    if (scrollDown) {
        scrollDown.addEventListener('click', () => {
            document.querySelector('.timeline-container').scrollIntoView({ behavior: 'smooth' });
        });
    }
});

// Gallery Functionality
function initGallery() {
    // Filter functionality
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.grid-item');
    
    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');
            
            const filterValue = button.getAttribute('data-filter');
            
            galleryItems.forEach(item => {
                if (filterValue === 'all' || item.getAttribute('data-category') === filterValue) {
                    item.style.display = 'block';
                    setTimeout(() => {
                        item.style.opacity = '1';
                    }, 50);
                } else {
                    item.style.opacity = '0';
                    setTimeout(() => {
                        item.style.display = 'none';
                    }, 300);
                }
            });
        });
    });
    
    // Lightbox functionality
    const lightbox = document.querySelector('.lightbox');
    const lightboxImg = document.querySelector('.lightbox-image');
    const lightboxCaption = document.querySelector('.lightbox-caption');
    const lightboxClose = document.querySelector('.lightbox-close');
    const lightboxPrev = document.querySelector('.lightbox-prev');
    const lightboxNext = document.querySelector('.lightbox-next');
    
    let currentImageIndex = 0;
    const images = Array.from(document.querySelectorAll('.grid-item img'));
    const captions = Array.from(document.querySelectorAll('.overlay-content'));
    
    // Open lightbox
    galleryItems.forEach((item, index) => {
        item.addEventListener('click', () => {
            currentImageIndex = index;
            updateLightbox();
            lightbox.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    });
    
    // Close lightbox
    lightboxClose.addEventListener('click', () => {
        lightbox.classList.remove('show');
        document.body.style.overflow = 'auto';
    });
    
    // Navigation
    lightboxPrev.addEventListener('click', showPrevImage);
    lightboxNext.addEventListener('click', showNextImage);
    
    // Keyboard navigation
    document.addEventListener('keydown', (e) => {
        if (!lightbox.classList.contains('show')) return;
        
        if (e.key === 'Escape') {
            lightbox.classList.remove('show');
            document.body.style.overflow = 'auto';
        } else if (e.key === 'ArrowLeft') {
            showPrevImage();
        } else if (e.key === 'ArrowRight') {
            showNextImage();
        }
    });
    
    function updateLightbox() {
        const imgSrc = images[currentImageIndex].getAttribute('src');
        const caption = captions[currentImageIndex].innerHTML;
        
        lightboxImg.setAttribute('src', imgSrc);
        lightboxImg.setAttribute('alt', images[currentImageIndex].getAttribute('alt'));
        lightboxCaption.innerHTML = caption;
    }
    
    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + images.length) % images.length;
        updateLightbox();
    }
    
    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % images.length;
        updateLightbox();
    }
    
    // Load more functionality
    const loadMoreBtn = document.getElementById('loadMore');
    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            // Simulate loading more items
            const hiddenItems = document.querySelectorAll('.grid-item[style*="display: none"]');
            const itemsToShow = Math.min(3, hiddenItems.length);
            
            for (let i = 0; i < itemsToShow; i++) {
                hiddenItems[i].style.display = 'block';
                setTimeout(() => {
                    hiddenItems[i].style.opacity = '1';
                }, 50);
            }
            
            // Hide button if no more items
            if (itemsToShow < 3) {
                loadMoreBtn.style.display = 'none';
            }
        });
    }
}

// Initialize gallery when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Keep existing navbar and other functionality
    // ... (código anterior permanece o mesmo)

    // Initialize gallery
    initGallery();
    
    // Smooth scroll for gallery header
    const scrollDown = document.querySelector('.gallery-header .header-scroll');
    if (scrollDown) {
        scrollDown.addEventListener('click', () => {
            document.querySelector('.gallery-container').scrollIntoView({ behavior: 'smooth' });
        });
    }
});

// Favorites Functionality
function initFavorites() {
    // Smooth scroll for favorites header
    const scrollDown = document.querySelector('.favorites-header .header-scroll');
    if (scrollDown) {
        scrollDown.addEventListener('click', () => {
            document.querySelector('.favorites-container').scrollIntoView({ behavior: 'smooth' });
        });
    }

    // Add new quote functionality
    const addQuoteBtn = document.querySelector('.btn-add');
    if (addQuoteBtn) {
        addQuoteBtn.addEventListener('click', function() {
            const textarea = this.previousElementSibling;
            const quoteText = textarea.value.trim();
            
            if (quoteText) {
                const quotesGrid = document.querySelector('.quotes-grid');
                const newQuoteItem = document.createElement('div');
                newQuoteItem.className = 'quote-item';
                
                newQuoteItem.innerHTML = `
                    <blockquote>
                        <p>"${quoteText}"</p>
                        <footer>- Luiza & Mário</footer>
                    </blockquote>
                    <p class="memory">"Adicionado em ${new Date().toLocaleDateString('pt-BR')}"</p>
                `;
                
                // Insert before the last item (which is the add new quote form)
                quotesGrid.insertBefore(newQuoteItem, quotesGrid.lastElementChild);
                textarea.value = '';
                
                // Show confirmation
                const originalText = this.textContent;
                this.textContent = 'Adicionado!';
                setTimeout(() => {
                    this.textContent = originalText;
                }, 2000);
            }
        });
    }

    // Play music preview on hover (simulated)
    const musicItems = document.querySelectorAll('.favorites-grid .favorite-item');
    musicItems.forEach(item => {
        const spotifyLink = item.querySelector('.favorite-link[href*="spotify"]');
        if (spotifyLink) {
            item.addEventListener('mouseenter', () => {
                // In a real implementation, you might use the Spotify API to play a preview
                console.log('Playing preview for: ' + item.querySelector('h3').textContent);
            });
        }
    });
}

// Initialize favorites when page loads
document.addEventListener('DOMContentLoaded', function() {
    // Initialize mobile menu toggle (if not already initialized)
    const toggle = document.querySelector('.navbar-toggle');
    const menu = document.querySelector('.navbar-nav');
    
    if (toggle && menu) {
        toggle.addEventListener('click', function() {
            menu.classList.toggle('active');
            this.querySelector('i').classList.toggle('fa-times');
        });
    }

    // Initialize favorites page
    if (document.querySelector('.favorites-container')) {
        initFavorites();
    }
});

// Future Page Functionality
function initFuturePage() {
    // Smooth scroll for future header
    const scrollDown = document.querySelector('.future-header .header-scroll');
    if (scrollDown) {
        scrollDown.addEventListener('click', () => {
            document.querySelector('.future-container').scrollIntoView({ behavior: 'smooth' });
        });
    }
    
    // Initialize lightbox for future images
    const zoomableImages = document.querySelectorAll('.zoomable');
    if (zoomableImages.length > 0) {
        zoomableImages.forEach((img, index) => {
            img.addEventListener('click', () => {
                const lightbox = document.querySelector('.lightbox');
                const lightboxImg = document.querySelector('.lightbox-image');
                const lightboxCaption = document.querySelector('.lightbox-caption');
                
                lightboxImg.src = img.src;
                lightboxCaption.textContent = img.nextElementSibling.textContent;
                lightbox.classList.add('show');
                document.body.style.overflow = 'hidden';
            });
        });
    }
    
    // Animate timeline items on scroll
    const timelineItems = document.querySelectorAll('.timeline-item');
    if (timelineItems.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });
        
        timelineItems.forEach(item => {
            item.style.opacity = '0';
            item.style.transform = 'translateY(20px)';
            item.style.transition = 'all 0.5s ease';
            observer.observe(item);
        });
    }
}

// Initialize future page when loaded
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the future page
    if (document.querySelector('.future-container')) {
        initFuturePage();
    }
    
    // Keep existing functionality for other pages
    if (document.querySelector('.photo-grid')) {
        initGallery();
    }
});