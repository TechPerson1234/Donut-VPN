(function () {
  var doc = document;
  var root = doc.documentElement;

  var yearEl = doc.getElementById('year');
  if (yearEl) {
    yearEl.textContent = String(new Date().getFullYear());
  }

  var THEME_KEY = 'donutvpn_theme';
  var THEME_COLORS = { dark: '#130c11', light: '#fff7fb', magenta: '#180312' };
  var themeButtons = doc.querySelectorAll('[data-theme-set]');
  var themeColorMeta = doc.getElementById('themeColor');

  function applyTheme(name, persist) {
    if (name !== 'light' && name !== 'magenta') name = 'dark';
    root.setAttribute('data-theme', name);
    if (themeColorMeta) themeColorMeta.setAttribute('content', THEME_COLORS[name]);
    
    for (var i = 0; i < themeButtons.length; i++) {
      var active = themeButtons[i].getAttribute('data-theme-set') === name;
      themeButtons[i].setAttribute('aria-pressed', active ? 'true' : 'false');
    }
    
    if (persist) {
      try { localStorage.setItem(THEME_KEY, name); } catch (err) {}
    }
  }

  for (var t = 0; t < themeButtons.length; t++) {
    themeButtons[t].addEventListener('click', function () {
      applyTheme(this.getAttribute('data-theme-set'), true);
    });
  }

  var storedTheme = null;
  try { storedTheme = localStorage.getItem(THEME_KEY); } catch (err) {}
  applyTheme(storedTheme || root.getAttribute('data-theme') || 'dark', false);

  var navToggle = doc.getElementById('navToggle');
  var nav = doc.getElementById('primaryNav');

  if (navToggle && nav) {
    navToggle.addEventListener('click', function () {
      var open = nav.classList.toggle('open');
      navToggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    });

    nav.addEventListener('click', function (e) {
      if (e.target.tagName === 'A' && !e.target.hasAttribute('data-open-modal')) {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });

    doc.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && nav.classList.contains('open')) {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.focus();
      }
    });

    window.addEventListener('resize', function () {
      if (window.innerWidth > 980 && nav.classList.contains('open')) {
        nav.classList.remove('open');
        navToggle.setAttribute('aria-expanded', 'false');
      }
    });
  }

  var modal = doc.getElementById('downloadModal');
  var closeBtn = modal ? modal.querySelector('.modal-close') : null;
  var openTriggers = doc.querySelectorAll('[data-open-modal]');
  var modalTabs = doc.querySelectorAll('.modal-tab');
  var tabPanels = doc.querySelectorAll('.tab-panel');

  if (modal && closeBtn) {
    openTriggers.forEach(function (trigger) {
      trigger.addEventListener('click', function (e) {
        e.preventDefault();
        if (typeof modal.showModal === 'function') {
          modal.showModal();
        }
        if (nav && nav.classList.contains('open')) {
          nav.classList.remove('open');
          navToggle.setAttribute('aria-expanded', 'false');
        }
      });
    });

    closeBtn.addEventListener('click', function () {
      modal.close();
    });

    modal.addEventListener('click', function (e) {
      var rect = modal.getBoundingClientRect();
      var isInDialog = (
        rect.top <= e.clientY && e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX && e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        modal.close();
      }
    });

    modalTabs.forEach(function (tab) {
      tab.addEventListener('click', function () {
        modalTabs.forEach(function (t) {
          t.classList.remove('active');
          t.setAttribute('aria-selected', 'false');
        });
        tabPanels.forEach(function (p) {
          p.classList.remove('active');
        });

        this.classList.add('active');
        this.setAttribute('aria-selected', 'true');

        var targetId = this.getAttribute('data-target');
        var targetPanel = doc.getElementById(targetId);
        if (targetPanel) {
          targetPanel.classList.add('active');
        }
      });
    });
  }

  var accordionLinks = doc.querySelectorAll('a[data-acc]');
  accordionLinks.forEach(function (link) {
    link.addEventListener('click', function (e) {
      var targetId = this.getAttribute('data-acc');
      var target = doc.getElementById(targetId);
      
      if (!target) return;
      
      e.preventDefault();
      
      var group = target.parentNode;
      var others = group.querySelectorAll('details[open]');
      others.forEach(function (other) {
        if (other !== target) {
          other.open = false;
        }
      });
      
      target.open = true;
      
      var top = target.getBoundingClientRect().top + window.pageYOffset - 100;
      window.scrollTo({ top: top, behavior: 'smooth' });
    });
  });

  var revealEls = doc.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && revealEls.length) {
    var observer = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('in');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

    revealEls.forEach(function (el) {
      observer.observe(el);
    });
  } else {
    revealEls.forEach(function (el) {
      el.classList.add('in');
    });
  }

})();
