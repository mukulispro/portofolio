document.addEventListener('DOMContentLoaded', () => {
    // ==========================================================================
    // THEME TOGGLING & CORE INITIALIZATION
    // ==========================================================================
    const themeToggleBtn = document.getElementById('theme-toggle');
    const htmlElement = document.documentElement;

    // Load theme from localStorage or system preference
    const savedTheme = localStorage.getItem('theme');
    const systemPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;

    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else {
        const initialTheme = systemPrefersDark ? 'dark' : 'light';
        htmlElement.setAttribute('data-theme', initialTheme);
        localStorage.setItem('theme', initialTheme);
    }

    // Toggle click handler
    themeToggleBtn.addEventListener('click', () => {
        const currentTheme = htmlElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';

        htmlElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);

        // Minor micro-animation scale effect on button
        themeToggleBtn.style.transform = 'scale(0.9)';
        setTimeout(() => {
            themeToggleBtn.style.transform = '';
        }, 150);
    });

    // Shrinking Navbar on Scroll
    const navbar = document.getElementById('main-nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }
    });

    // Active Navigation Link on Scroll
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (window.scrollY >= (sectionTop - sectionHeight / 3)) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href').substring(1) === currentSection) {
                link.classList.add('active');
            }
        });
    });

    // ==========================================================================
    // MOBILE NAVIGATION
    // ==========================================================================
    const mobileToggleBtn = document.getElementById('mobile-toggle');
    const navLinksMenu = document.getElementById('nav-links');

    mobileToggleBtn.addEventListener('click', () => {
        navLinksMenu.classList.toggle('mobile-open');
        const isMenuOpen = navLinksMenu.classList.contains('mobile-open');
        mobileToggleBtn.innerHTML = isMenuOpen ? '<i class="fa-solid fa-xmark"></i>' : '<i class="fa-solid fa-bars"></i>';
    });

    // Close menu when clicking nav links
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navLinksMenu.classList.remove('mobile-open');
            mobileToggleBtn.innerHTML = '<i class="fa-solid fa-bars"></i>';
        });
    });

    // ==========================================================================
    // DYNAMIC TYPING SIMULATION
    // ==========================================================================
    const typedTextSpan = document.getElementById('typed-text');
    const words = ["Full Stack Developer", "Creative Engineer", "UI Designer", "Problem Solver"];
    const typingDelay = 100;
    const erasingDelay = 50;
    const newWordDelay = 2000;

    let wordIndex = 0;
    let charIndex = 0;

    function type() {
        if (charIndex < words[wordIndex].length) {
            typedTextSpan.textContent += words[wordIndex].charAt(charIndex);
            charIndex++;
            setTimeout(type, typingDelay);
        } else {
            setTimeout(erase, newWordDelay);
        }
    }

    function erase() {
        if (charIndex > 0) {
            typedTextSpan.textContent = words[wordIndex].substring(0, charIndex - 1);
            charIndex--;
            setTimeout(erase, erasingDelay);
        } else {
            wordIndex++;
            if (wordIndex >= words.length) wordIndex = 0;
            setTimeout(type, typingDelay + 300);
        }
    }

    // Start Typing Animation
    if (words.length) setTimeout(type, newWordDelay);

    // ==========================================================================
    // SCROLL REVEAL & SKILLS PROGRESS ANIMATION
    // ==========================================================================
    const revealElements = document.querySelectorAll('.scroll-reveal');

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal-visible');
                // Optional: Unobserve if you only want the animation to run once
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    revealElements.forEach(element => {
        revealObserver.observe(element);
    });

    // ==========================================================================
    // PROJECTS CATEGORY FILTER
    // ==========================================================================
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Update active state on button
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');

                // Add minor exit scaling animation
                card.style.transform = 'scale(0.9)';
                card.style.opacity = '0';

                setTimeout(() => {
                    if (filterValue === 'all' || category === filterValue) {
                        card.classList.remove('hide');
                        setTimeout(() => {
                            card.style.transform = 'scale(1)';
                            card.style.opacity = '1';
                        }, 50);
                    } else {
                        card.classList.add('hide');
                    }
                }, 200);
            });
        });
    });

    // ==========================================================================
    // CONTACT FORM INTERACTIVE VALIDATION
    // ==========================================================================
    const form = document.getElementById('contact-form');
    const nameInput = document.getElementById('form-name');
    const emailInput = document.getElementById('form-email');
    const subjectInput = document.getElementById('form-subject');
    const messageInput = document.getElementById('form-message');

    const toast = document.getElementById('toast');
    const toastCloseBtn = document.getElementById('toast-close');
    let toastTimeout;

    // Helper validation functions
    function validateEmail(email) {
        const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return re.test(String(email).toLowerCase());
    }

    function checkField(input, errorElementId, validationFn, defaultMsg) {
        const group = input.closest('.form-group');
        const errorSpan = document.getElementById(errorElementId);

        let isValid = false;
        if (validationFn) {
            isValid = validationFn(input.value.trim());
        } else {
            isValid = input.value.trim().length > 0;
        }

        if (isValid) {
            group.classList.remove('error');
            group.classList.add('success');
            return true;
        } else {
            group.classList.remove('success');
            group.classList.add('error');
            return false;
        }
    }

    // Live validation feedback on typing / blurring
    nameInput.addEventListener('input', () => checkField(nameInput, 'name-error'));
    subjectInput.addEventListener('input', () => checkField(subjectInput, 'subject-error'));
    messageInput.addEventListener('input', () => checkField(messageInput, 'message-error'));
    emailInput.addEventListener('input', () => {
        checkField(emailInput, 'email-error', (val) => validateEmail(val));
    });

    // Toast Control
    function showToast() {
        clearTimeout(toastTimeout);
        toast.classList.add('show');

        // Auto hide after 5 seconds
        toastTimeout = setTimeout(() => {
            hideToast();
        }, 5000);
    }

    function hideToast() {
        toast.classList.remove('show');
    }

    toastCloseBtn.addEventListener('click', hideToast);

    // Form Submit Handler
    form.addEventListener('submit', (e) => {
        e.preventDefault();

        // Check all fields
        const isNameValid = checkField(nameInput, 'name-error');
        const isEmailValid = checkField(emailInput, 'email-error', (val) => validateEmail(val));
        const isSubjectValid = checkField(subjectInput, 'subject-error');
        const isMessageValid = checkField(messageInput, 'message-error');

        if (isNameValid && isEmailValid && isSubjectValid && isMessageValid) {
            // Visual success indicator
            const submitBtn = form.querySelector('.btn-submit');
            const originalBtnHtml = submitBtn.innerHTML;

            submitBtn.innerHTML = 'Sending... <i class="fa-solid fa-circle-notch fa-spin"></i>';
            submitBtn.disabled = true;

            // Simulate server network latency
            setTimeout(() => {
                showToast();

                // Reset inputs and classes
                form.reset();
                const formGroups = form.querySelectorAll('.form-group');
                formGroups.forEach(g => {
                    g.classList.remove('success');
                    g.classList.remove('error');
                });

                submitBtn.innerHTML = originalBtnHtml;
                submitBtn.disabled = false;
            }, 1200);
        }
    });
});
