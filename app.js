/**
 * IDYLLE FORMATION - INTERACTIVE APPLICATION LOGIC
 * Dynamic UI interactions, stat counters, modal control, & legal policy tab switching.
 */

document.addEventListener('DOMContentLoaded', () => {
    // --- 1. NAVBAR SCROLL EFFECT & ACTIVE LINK HIGHLIGHTING ---
    const navbar = document.getElementById('navbar');
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('section[id]');

    function handleScroll() {
        if (window.scrollY > 40) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Active Section Highlight
        let currentSection = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop - 120;
            const sectionHeight = section.offsetHeight;
            if (window.scrollY >= sectionTop && window.scrollY < sectionTop + sectionHeight) {
                currentSection = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${currentSection}`) {
                link.classList.add('active');
            }
        });
    }

    window.addEventListener('scroll', handleScroll);

    // --- 2. MOBILE MENU DRAWER ---
    const mobileToggle = document.getElementById('mobileToggle');
    const navMenu = document.getElementById('navMenu');

    if (mobileToggle && navMenu) {
        mobileToggle.addEventListener('click', () => {
            const isExpanded = mobileToggle.getAttribute('aria-expanded') === 'true';
            mobileToggle.setAttribute('aria-expanded', !isExpanded);
            navMenu.classList.toggle('active');
        });

        // Close menu when clicking a link
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                navMenu.classList.remove('active');
                mobileToggle.setAttribute('aria-expanded', 'false');
            });
        });
    }

    // --- 3. ANIMATED METRICS COUNTERS ---
    const statValues = document.querySelectorAll('.stat-value[data-counter]');

    function animateCounter(el) {
        const target = parseFloat(el.getAttribute('data-counter'));
        const prefix = el.getAttribute('data-prefix') || '';
        const suffix = el.getAttribute('data-suffix') || '';
        const decimals = parseInt(el.getAttribute('data-decimals') || '0', 10);
        
        const duration = 2000; // ms
        const startTime = performance.now();

        function update(currentTime) {
            const elapsed = currentTime - startTime;
            const progress = Math.min(elapsed / duration, 1);
            
            // Easing function (easeOutExpo)
            const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
            const currentVal = target * easeProgress;

            let formattedVal;
            if (decimals > 0) {
                formattedVal = currentVal.toFixed(decimals);
            } else {
                formattedVal = Math.floor(currentVal).toLocaleString('en-US');
            }

            el.textContent = `${prefix}${formattedVal}${suffix}`;

            if (progress < 1) {
                requestAnimationFrame(update);
            }
        }

        requestAnimationFrame(update);
    }

    // IntersectionObserver for trigger when scrolled into view
    const observerOptions = {
        threshold: 0.3
    };

    const counterObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounter(entry.target);
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    statValues.forEach(el => counterObserver.observe(el));

    // --- 4. PROPOSAL MODAL CONTROL ---
    const proposalModal = document.getElementById('proposalModal');
    const openProposalBtns = document.querySelectorAll('.open-proposal-modal');
    const closeProposalModalBtn = document.getElementById('closeProposalModal');
    const proposalForm = document.getElementById('proposalForm');
    const pModelSelect = document.getElementById('pModel');

    function openProposalModal(modelChoice) {
        if (modelChoice && pModelSelect) {
            if (modelChoice.includes('Agency')) {
                pModelSelect.value = 'Agency Retainer';
            } else if (modelChoice.includes('Performance')) {
                pModelSelect.value = 'Performance Partnership';
            }
        }
        proposalModal.classList.add('active');
        proposalModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
    }

    function closeProposalModal() {
        proposalModal.classList.remove('active');
        proposalModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    openProposalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const modelChoice = btn.getAttribute('data-model');
            openProposalModal(modelChoice);
        });
    });

    if (closeProposalModalBtn) {
        closeProposalModalBtn.addEventListener('click', closeProposalModal);
    }

    // --- 5. LEGAL & STRIPE COMPLIANCE MODAL WITH TABS ---
    const legalModal = document.getElementById('legalModal');
    const openLegalBtns = document.querySelectorAll('.open-legal-modal');
    const closeLegalModalBtn = document.getElementById('closeLegalModal');
    const tabBtns = document.querySelectorAll('.tab-btn');
    const tabContents = document.querySelectorAll('.tab-content');
    const legalBodyScroll = document.getElementById('legalBodyScroll');

    function openLegalModal(targetTab) {
        legalModal.classList.add('active');
        legalModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';

        if (targetTab) {
            switchTab(targetTab);
        }
    }

    function closeLegalModal() {
        legalModal.classList.remove('active');
        legalModal.setAttribute('aria-hidden', 'true');
        document.body.style.overflow = '';
    }

    function switchTab(tabId) {
        tabBtns.forEach(btn => {
            if (btn.getAttribute('data-tab-target') === tabId) {
                btn.classList.add('active');
            } else {
                btn.classList.remove('active');
            }
        });

        tabContents.forEach(content => {
            if (content.id === `tab-${tabId}`) {
                content.classList.add('active');
            } else {
                content.classList.remove('active');
            }
        });

        if (legalBodyScroll) {
            legalBodyScroll.scrollTop = 0;
        }
    }

    openLegalBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab');
            openLegalModal(targetTab);
        });
    });

    if (closeLegalModalBtn) {
        closeLegalModalBtn.addEventListener('click', closeLegalModal);
    }

    tabBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const targetTab = btn.getAttribute('data-tab-target');
            switchTab(targetTab);
        });
    });

    // Close Modals on ESC Key or Backdrop Click
    window.addEventListener('click', (e) => {
        if (e.target === proposalModal) closeProposalModal();
        if (e.target === legalModal) closeLegalModal();
    });

    window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            closeProposalModal();
            closeLegalModal();
        }
    });

    // --- 6. FORM HANDLING & TOAST NOTIFICATIONS ---
    const toast = document.getElementById('toastNotification');
    const toastMessage = document.getElementById('toastMessage');

    function showToast(message) {
        if (toastMessage) toastMessage.textContent = message;
        toast.classList.add('active');

        setTimeout(() => {
            toast.classList.remove('active');
        }, 4000);
    }

    if (proposalForm) {
        proposalForm.addEventListener('submit', (e) => {
            e.preventDefault();
            closeProposalModal();
            proposalForm.reset();
            showToast('Proposal request submitted! Our B2B compliance team will review and contact you within 24 hours.');
        });
    }

    const directContactForm = document.getElementById('directContactForm');
    if (directContactForm) {
        directContactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            directContactForm.reset();
            showToast('Thank you for reaching out. Your commercial inquiry has been routed to our officer team.');
        });
    }
});
