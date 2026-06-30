/* FL Cleanup v3 — main.js */
(function(){
  'use strict';

  /* ── NAV TOGGLE ─────────────────────────────────── */
  const toggle = document.getElementById('nav-toggle');
  const mobileMenu = document.getElementById('mobile-menu');
  if(toggle && mobileMenu){
    toggle.addEventListener('click', function(){
      const open = mobileMenu.getAttribute('data-open') === 'true';
      mobileMenu.setAttribute('data-open', open ? 'false' : 'true');
      toggle.setAttribute('aria-expanded', open ? 'false' : 'true');
    });
    document.addEventListener('click', function(e){
      if(!toggle.contains(e.target) && !mobileMenu.contains(e.target)){
        mobileMenu.setAttribute('data-open','false');
        toggle.setAttribute('aria-expanded','false');
      }
    });
  }

  /* ── FAQ ACCORDION ───────────────────────────────── */
  document.querySelectorAll('.faq-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      const item = this.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(function(i){ i.classList.remove('open'); });
      if(!isOpen){ item.classList.add('open'); }
    });
  });

  /* ── CONSENT BANNER ──────────────────────────────── */
  const banner = document.getElementById('consent-banner');
  const KEY = 'flc_consent_v1';
  if(banner && !localStorage.getItem(KEY)){
    banner.classList.add('visible');
    document.getElementById('consent-accept').addEventListener('click', function(){
      localStorage.setItem(KEY,'accepted');
      banner.classList.remove('visible');
      loadTracking();
    });
    document.getElementById('consent-decline').addEventListener('click', function(){
      localStorage.setItem(KEY,'declined');
      banner.classList.remove('visible');
    });
  } else if(localStorage.getItem(KEY) === 'accepted'){
    loadTracking();
  }

  function loadTracking(){
    /* GTM — loads after consent */
    if(typeof window.dataLayer === 'undefined'){
      window.dataLayer = [];
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
      var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
      j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
      f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-WCM9C76Z');
    }
  }

  /* ── ADA PANEL ───────────────────────────────────── */
  const adaBtn = document.getElementById('ada-btn');
  const adaPanel = document.getElementById('ada-panel');
  if(adaBtn && adaPanel){
    adaBtn.addEventListener('click', function(){
      const isOpen = adaPanel.classList.contains('open');
      adaPanel.classList.toggle('open', !isOpen);
      adaBtn.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
    });
    document.addEventListener('click', function(e){
      if(!adaBtn.contains(e.target) && !adaPanel.contains(e.target)){
        adaPanel.classList.remove('open');
        adaBtn.setAttribute('aria-expanded','false');
      }
    });
    document.querySelectorAll('.ada-toggle').forEach(function(t){
      t.addEventListener('click', function(){
        this.classList.toggle('on');
        applyADA();
      });
    });
  }

  function applyADA(){
    const fontSize = document.getElementById('ada-font')?.classList.contains('on');
    const contrast = document.getElementById('ada-contrast')?.classList.contains('on');
    const spacing  = document.getElementById('ada-spacing')?.classList.contains('on');
    document.body.style.fontSize = fontSize ? '18px' : '';
    document.body.classList.toggle('high-contrast', !!contrast);
    document.body.style.letterSpacing = spacing ? '.5px' : '';
    document.body.style.lineHeight    = spacing ? '1.9'  : '';
  }

  /* ── SMOOTH SCROLL ANCHORS ───────────────────────── */
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      const id = this.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if(el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth', block:'start'}); }
    });
  });

})();
