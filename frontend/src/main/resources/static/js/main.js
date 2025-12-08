// Smooth scroll for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar scroll effect
let lastScroll = 0;
const navbar = document.querySelector('nav');

window.addEventListener('scroll', () => {
    const currentScroll = window.pageYOffset;
    
    if (currentScroll <= 0) {
        navbar.classList.remove('shadow-lg');
    } else {
        navbar.classList.add('shadow-lg');
    }
    
    lastScroll = currentScroll;
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fade-in');
        }
    });
}, observerOptions);

// Observe all sections
document.querySelectorAll('section').forEach(section => {
    observer.observe(section);
});

// Mobile menu toggle
const mobileMenuButton = document.querySelector('.md\\:hidden button');
const mobileMenu = document.createElement('div');
mobileMenu.className = 'hidden md:hidden absolute top-20 left-0 right-0 bg-white shadow-lg p-6';
mobileMenu.innerHTML = `
    <div class="flex flex-col gap-4 text-right">
        <a href="#services" class="text-gray-700 hover:text-morocco-red transition-colors font-medium py-2" data-i18n="nav.services">الخدمات</a>
        <a href="#how-it-works" class="text-gray-700 hover:text-morocco-red transition-colors font-medium py-2" data-i18n="nav.howItWorks">كيف يعمل</a>
        <a href="#safety" class="text-gray-700 hover:text-morocco-red transition-colors font-medium py-2" data-i18n="nav.safety">الأمان</a>
        <a href="#partner" class="text-gray-700 hover:text-morocco-red transition-colors font-medium py-2" data-i18n="nav.partner">كن شريكاً</a>
        <button class="w-full px-6 py-2.5 text-morocco-red font-semibold hover:bg-morocco-red/5 rounded-lg transition-all" data-i18n="nav.login">
            تسجيل الدخول
        </button>
    </div>
`;

if (mobileMenuButton) {
    navbar.appendChild(mobileMenu);
    
    mobileMenuButton.addEventListener('click', () => {
        mobileMenu.classList.toggle('hidden');
    });
    
    // Apply translations to mobile menu after it's created
    if (typeof applyTranslations === 'function') {
        setTimeout(() => {
            mobileMenu.querySelectorAll('[data-i18n]').forEach(element => {
                const key = element.getAttribute('data-i18n');
                if (typeof t === 'function') {
                    element.textContent = t(key);
                }
            });
        }, 100);
    }
}

// Counter animation for statistics
const animateCounter = (element, target, duration = 2000) => {
    let start = 0;
    const increment = target / (duration / 16);
    
    const timer = setInterval(() => {
        start += increment;
        if (start >= target) {
            element.textContent = target.toLocaleString('ar-MA');
            clearInterval(timer);
        } else {
            element.textContent = Math.floor(start).toLocaleString('ar-MA');
        }
    }, 16);
};

// Trigger counter animation when hero section is visible
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const counters = entry.target.querySelectorAll('.text-3xl');
            counters.forEach(counter => {
                const text = counter.textContent;
                const number = parseInt(text.replace(/[^0-9]/g, ''));
                if (number) {
                    animateCounter(counter, number);
                }
            });
            heroObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroSection = document.querySelector('section');
if (heroSection) {
    heroObserver.observe(heroSection);
}

// Add ripple effect to buttons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function(e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => {
            ripple.remove();
        }, 600);
    });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.relative img');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Add fade-in animation class
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeIn {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .animate-fade-in {
        animation: fadeIn 0.8s ease-out forwards;
    }
    
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
        pointer-events: none;
    }
    
    @keyframes ripple-animation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

// Language Switcher Functionality
document.addEventListener('DOMContentLoaded', () => {
    const languageButton = document.getElementById('languageButton');
    const languageDropdown = document.getElementById('languageDropdown');
    const currentLangSpan = document.getElementById('currentLang');
    const languageButtons = document.querySelectorAll('[data-lang]');
    
    // Get current language
    const currentLang = getCurrentLanguage();
    if (currentLangSpan) {
        currentLangSpan.textContent = currentLang.toUpperCase();
    }
    
    // Toggle dropdown
    languageButton?.addEventListener('click', (e) => {
        e.stopPropagation();
        languageDropdown?.classList.toggle('hidden');
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!languageButton?.contains(e.target) && !languageDropdown?.contains(e.target)) {
            languageDropdown?.classList.add('hidden');
        }
    });
    
    // Language selection
    languageButtons.forEach(button => {
        button.addEventListener('click', () => {
            const lang = button.getAttribute('data-lang');
            if (lang && typeof setLanguage === 'function') {
                setLanguage(lang);
                if (currentLangSpan) {
                    currentLangSpan.textContent = lang.toUpperCase();
                }
                languageDropdown?.classList.add('hidden');
            }
        });
        
        // Highlight current language
        if (button.getAttribute('data-lang') === currentLang) {
            button.classList.add('bg-morocco-red/10', 'text-morocco-red');
        }
    });
    
    console.log('Language switcher initialized. Current language:', currentLang);
});

console.log('Grab Morocco - Website loaded successfully! 🇲🇦');