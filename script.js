// Mubarak Mustapha - Professional Portfolio & Digital CV Logic

document.addEventListener('DOMContentLoaded', () => {
  
  // ==========================================
  // 1. Theme Management (Dark/Light Mode)
  // ==========================================
  const themeBtn = document.getElementById('theme-btn');
  const themeIcon = themeBtn.querySelector('i');
  
  // Check local storage or system preference
  const savedTheme = localStorage.getItem('portfolio-theme') || 'dark';
  document.documentElement.setAttribute('data-theme', savedTheme);
  updateThemeIcon(savedTheme);

  themeBtn.addEventListener('click', () => {
    const currentTheme = document.documentElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('portfolio-theme', newTheme);
    updateThemeIcon(newTheme);
  });

  function updateThemeIcon(theme) {
    if (theme === 'light') {
      themeIcon.className = 'fa-solid fa-sun';
    } else {
      themeIcon.className = 'fa-solid fa-moon';
    }
  }

  // ==========================================
  // 2. Mobile Menu Toggle
  // ==========================================
  const menuBtn = document.getElementById('menu-btn');
  const navLinks = document.getElementById('main-nav');
  const menuIcon = menuBtn.querySelector('i');

  menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    
    // Toggle menu icon
    if (navLinks.classList.contains('active')) {
      menuIcon.className = 'fa-solid fa-xmark';
    } else {
      menuIcon.className = 'fa-solid fa-bars';
    }
  });

  // Close mobile menu when a link is clicked
  const navLinksArray = navLinks.querySelectorAll('a');
  navLinksArray.forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      menuIcon.className = 'fa-solid fa-bars';
    });
  });

  // ==========================================
  // 3. Typing Effect (Hero Subtitle)
  // ==========================================
  const words = ["Cybersecurity Analyst", "Climate Action Organizer", "SDG Advocate", "Computer Science Educator"];
  const typingElement = document.querySelector('.typed-text');
  let wordIndex = 0;
  let charIndex = 0;
  let isDeleting = false;
  let typeSpeed = 100;

  function typeEffect() {
    const currentWord = words[wordIndex];
    
    if (isDeleting) {
      typingElement.textContent = currentWord.substring(0, charIndex - 1);
      charIndex--;
      typeSpeed = 50; // Faster deleting
    } else {
      typingElement.textContent = currentWord.substring(0, charIndex + 1);
      charIndex++;
      typeSpeed = 120; // Normal typing
    }

    if (!isDeleting && charIndex === currentWord.length) {
      typeSpeed = 2000; // Pause at end of word
      isDeleting = true;
    } else if (isDeleting && charIndex === 0) {
      isDeleting = false;
      wordIndex = (wordIndex + 1) % words.length;
      typeSpeed = 500; // Pause before next word
    }

    setTimeout(typeEffect, typeSpeed);
  }
  
  if (typingElement) {
    typeEffect();
  }

  // ==========================================
  // 4. Scroll Reveal Animations & Navigation Highlight
  // ==========================================
  const reveals = document.querySelectorAll('.reveal');
  const sections = document.querySelectorAll('section');
  
  const revealOnScroll = () => {
    const scrollPos = window.scrollY + window.innerHeight * 0.8;
    
    // Reveal elements
    reveals.forEach(el => {
      if (el.offsetTop < scrollPos) {
        el.classList.add('active');
      }
    });

    // Update active nav link
    let currentSectionId = 'home';
    sections.forEach(sec => {
      const top = sec.offsetTop - 100;
      const height = sec.offsetHeight;
      if (window.scrollY >= top && window.scrollY < top + height) {
        currentSectionId = sec.getAttribute('id');
      }
    });

    navLinksArray.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${currentSectionId}`) {
        link.classList.add('active');
      }
    });
  };

  window.addEventListener('scroll', revealOnScroll);
  // Initial check
  setTimeout(revealOnScroll, 100);

  // ==========================================
  // 5. Certifications Search & Filter
  // ==========================================
  const filterBtns = document.querySelectorAll('.filter-btn');
  const certCards = document.querySelectorAll('.cert-card');
  const searchInput = document.getElementById('cert-search');

  function filterCertificates() {
    const activeFilterBtn = document.querySelector('.filter-btn.active');
    const filterValue = activeFilterBtn ? activeFilterBtn.getAttribute('data-filter') : 'all';
    const searchQuery = searchInput.value.toLowerCase().trim();

    certCards.forEach(card => {
      const category = card.getAttribute('data-category');
      const title = card.getAttribute('data-title').toLowerCase();
      const issuer = card.getAttribute('data-issuer').toLowerCase();
      const desc = card.getAttribute('data-desc').toLowerCase();
      
      const matchesFilter = filterValue === 'all' || category === filterValue;
      const matchesSearch = title.includes(searchQuery) || 
                            issuer.includes(searchQuery) || 
                            desc.includes(searchQuery);

      if (matchesFilter && matchesSearch) {
        card.style.display = 'flex';
        // Add reveal animations to filtered cards
        card.classList.add('active');
      } else {
        card.style.display = 'none';
      }
    });
  }

  // Filter Button Clicks
  filterBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      filterBtns.forEach(b => b.classList.remove('active'));
      e.target.classList.add('active');
      filterCertificates();
    });
  });

  // Search Input Keyups
  if (searchInput) {
    searchInput.addEventListener('input', filterCertificates);
  }

  // ==========================================
  // 6. Certificate Viewer Modal
  // ==========================================
  const modal = document.getElementById('cert-modal');
  const modalClose = document.getElementById('modal-close-btn');
  const modalImg = document.getElementById('modal-img');
  const modalTitle = document.getElementById('modal-title');
  const modalIssuer = document.getElementById('modal-issuer');
  const modalDate = document.getElementById('modal-date');
  const modalDesc = document.getElementById('modal-desc');
  const modalVerifyBtn = document.getElementById('modal-verify-btn');
  const modalInfoPane = document.getElementById('modal-info');

  certCards.forEach(card => {
    card.addEventListener('click', (e) => {
      // If user clicked verify link directly, let it open normally
      if (e.target.closest('.cert-verify-link')) {
        const verifyUrl = card.getAttribute('data-verify');
        if (verifyUrl && verifyUrl !== '#') {
          return; // Open external verify link
        }
      }

      const imgPath = card.getAttribute('data-image');
      const title = card.getAttribute('data-title');
      const issuer = card.getAttribute('data-issuer');
      const date = card.getAttribute('data-date');
      const desc = card.getAttribute('data-desc');
      const verifyUrl = card.getAttribute('data-verify');
      const category = card.getAttribute('data-category');

      // Populate Modal
      modalImg.src = imgPath;
      modalImg.alt = title;
      modalTitle.textContent = title;
      modalIssuer.textContent = issuer;
      modalDate.textContent = date;
      modalDesc.textContent = desc;

      // Handle Verification Button
      if (verifyUrl && verifyUrl !== '#' && verifyUrl !== '') {
        modalVerifyBtn.href = verifyUrl;
        modalVerifyBtn.style.display = 'inline-flex';
      } else {
        modalVerifyBtn.style.display = 'none';
      }

      // Handle Themes inside modal
      if (category === 'eco') {
        modalInfoPane.classList.add('eco-theme');
      } else {
        modalInfoPane.classList.remove('eco-theme');
      }

      // Open Modal
      modal.classList.add('active');
      document.body.style.overflow = 'hidden'; // Lock background scroll
    });
  });

  // Close modal click triggers
  const closeModal = () => {
    modal.classList.remove('active');
    document.body.style.overflow = ''; // Unlock background scroll
  };

  if (modalClose) {
    modalClose.addEventListener('click', closeModal);
  }

  // Close by clicking overlay (outside content wrapper)
  modal.addEventListener('click', (e) => {
    if (e.target === modal) {
      closeModal();
    }
  });

  // Close on Escape key press
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal.classList.contains('active')) {
      closeModal();
    }
  });
  
});
