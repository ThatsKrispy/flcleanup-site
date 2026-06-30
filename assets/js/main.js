/* FL Cleanup v5 — main.js
   Note: content visibility never depends on this file executing.
   No scroll-triggered opacity animation — that pattern caused
   sections to render invisible on certain viewports in an earlier
   build. Everything here is enhancement only. */
(function(){
  'use strict';

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
    /* Force-close if the viewport widens past the breakpoint where
       the desktop nav takes over — otherwise an open mobile menu
       stays open (e.g. after rotating a tablet or resizing a
       browser window) and overlaps the desktop nav, which is
       otherwise hidden purely by toggle state, not viewport width. */
    const closeIfDesktop = function(){
      if(window.innerWidth > 768 && mobileMenu.getAttribute('data-open') === 'true'){
        mobileMenu.setAttribute('data-open','false');
        toggle.setAttribute('aria-expanded','false');
      }
    };
    window.addEventListener('resize', closeIfDesktop);
    closeIfDesktop();
  }

  document.querySelectorAll('.faq-btn').forEach(function(btn){
    btn.addEventListener('click', function(){
      const item = this.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(function(i){ i.classList.remove('open'); });
      if(!isOpen){ item.classList.add('open'); }
    });
  });

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
    if(typeof window.dataLayer === 'undefined'){
      window.dataLayer = [];
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});
      var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';
      j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;
      f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','GTM-WCM9C76Z');
    }
  }

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

  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      const id = this.getAttribute('href').slice(1);
      const el = document.getElementById(id);
      if(el){ e.preventDefault(); el.scrollIntoView({behavior:'smooth', block:'start'}); }
    });
  });

  /* CONTACT FORM — client-side validation with inline error + success
     states. If a delivery endpoint is set via data-endpoint on the form
     (e.g. a Formspree / Web3Forms / Cloudflare URL), the request is POSTed
     there and the UI reflects the real response. With no endpoint set the
     form still validates and confirms, and prompts an emergency call. */
  const cform = document.getElementById('inspection-form');
  if(cform){
    const status = document.getElementById('form-status');

    function clearError(input){
      input.classList.remove('invalid');
      input.removeAttribute('aria-invalid');
      const next = input.parentNode.querySelector('.field-error');
      if(next){ next.remove(); }
    }
    function setError(input, msg){
      input.classList.add('invalid');
      input.setAttribute('aria-invalid','true');
      if(!input.parentNode.querySelector('.field-error')){
        const span = document.createElement('span');
        span.className = 'field-error';
        span.textContent = msg;
        input.parentNode.appendChild(span);
      }
    }
    function showStatus(type, msg){
      status.className = 'form-status show ' + type;
      status.textContent = msg;
    }

    const nameEl  = cform.querySelector('#cf-name');
    const phoneEl = cform.querySelector('#cf-phone');
    const emailEl = cform.querySelector('#cf-email');

    [nameEl, phoneEl, emailEl].forEach(function(el){
      if(el){ el.addEventListener('input', function(){ clearError(el); }); }
    });

    cform.addEventListener('submit', function(e){
      e.preventDefault();
      let firstInvalid = null;

      clearError(nameEl); clearError(phoneEl); if(emailEl){ clearError(emailEl); }

      if(!nameEl.value.trim()){
        setError(nameEl, 'Please enter your name.'); firstInvalid = firstInvalid || nameEl;
      }
      const digits = phoneEl.value.replace(/\D/g, '');
      if(digits.length < 10){
        setError(phoneEl, 'Please enter a valid phone number with area code.'); firstInvalid = firstInvalid || phoneEl;
      }
      if(emailEl && emailEl.value.trim() && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(emailEl.value.trim())){
        setError(emailEl, 'Please enter a valid email address.'); firstInvalid = firstInvalid || emailEl;
      }

      if(firstInvalid){
        showStatus('error', 'Please fix the highlighted fields and try again.');
        firstInvalid.focus();
        return;
      }

      const name = nameEl.value.trim().split(' ')[0];
      const endpoint = cform.getAttribute('data-endpoint');
      const btn = cform.querySelector('button[type="submit"]');

      if(endpoint){
        btn.disabled = true;
        btn.textContent = 'Sending…';
        fetch(endpoint, {
          method: 'POST',
          headers: {'Accept': 'application/json'},
          body: new FormData(cform)
        }).then(function(r){
          if(r.ok){
            showStatus('success', 'Thanks, ' + name + ' — your request has been sent. We’ll call you back shortly. For an emergency, call 877-224-2532 now — we answer 24/7.');
            cform.reset();
          } else { throw new Error('bad response'); }
        }).catch(function(){
          showStatus('error', 'Something went wrong sending your request. Please call us directly at 877-224-2532 — we’re available 24/7.');
        }).finally(function(){
          btn.disabled = false;
          btn.textContent = 'Send Request — We’ll Call Within 60 Min';
        });
      } else {
        showStatus('success', 'Thanks, ' + name + ' — your request is ready. For the fastest response, call 877-224-2532 now — we answer 24/7, including weekends and holidays.');
        cform.reset();
      }
    });
  }

})();
