// OLIVE FITNESS — shared interactions (no dependencies)
(function(){
  "use strict";
  // Mobile nav
  var t=document.querySelector('.nav-toggle'), m=document.querySelector('.mobile-nav');
  if(t&&m){t.addEventListener('click',function(){var o=m.classList.toggle('open');t.setAttribute('aria-expanded',o?'true':'false');});}
  // Footer year
  document.querySelectorAll('[data-year]').forEach(function(e){e.textContent=new Date().getFullYear();});
  // Reveal on scroll
  var io=('IntersectionObserver' in window)?new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('visible');io.unobserve(e.target);}});},{threshold:.12}):null;
  document.querySelectorAll('.reveal').forEach(function(e){if(io)io.observe(e);else e.classList.add('visible');});
  // Class filters (data-cat on rows/cards)
  document.querySelectorAll('[data-filter-group]').forEach(function(group){
    var btns=group.querySelectorAll('.filter-btn');
    var scope=group.getAttribute('data-filter-group');
    var items=document.querySelectorAll('[data-filter-scope="'+scope+'"] [data-cat]');
    btns.forEach(function(b){b.addEventListener('click',function(){
      btns.forEach(function(x){x.classList.remove('active');x.setAttribute('aria-selected','false');});
      b.classList.add('active');b.setAttribute('aria-selected','true');
      var v=b.getAttribute('data-filter');
      items.forEach(function(it){it.style.display=(v==='all'||it.getAttribute('data-cat')===v)?'':'none';});
    });});
  });
  // FAQ: allow only one open per group (progressive enhancement)
  document.querySelectorAll('details.faq').forEach(function(d){
    d.addEventListener('toggle',function(){if(!d.open)return;var g=d.closest('[data-faq-group]');if(!g)return;g.querySelectorAll('details.faq').forEach(function(o){if(o!==d)o.open=false;});});
  });
  // Forms: client-side validation + POST to backend with WhatsApp fallback
  function validPhone(v){return /^[+\d][\d\s-]{6,16}$/.test(v.trim());}
  document.querySelectorAll('form[data-enquiry]').forEach(function(f){
    f.addEventListener('submit',function(ev){
      ev.preventDefault();
      var name=f.querySelector('[name=name]'),phone=f.querySelector('[name=phone]'),type=f.querySelector('[name=type]'),msg=f.querySelector('[name=message]');
      var ok=true;
      function err(el,txt){var p=f.querySelector('[data-err-for="'+el.name+'"]');if(p)p.textContent=txt||'';if(txt)ok=false;}
      err(name,(!name.value.trim()||name.value.trim().length<2)?'Please enter your name.':'');
      err(phone,!validPhone(phone.value)?'Enter a valid phone number.':'');
      if(!ok)return;
      // honeypot
      var hp=f.querySelector('[name=company]');if(hp&&hp.value)return;
      var status=f.querySelector('.form-status');var btn=f.querySelector('[type=submit]');
      if(status){status.className='form-status';status.textContent='Sending…';status.style.display='block';}
      if(btn){btn.disabled=true;}
      var payload={type:f.getAttribute('data-enquiry')||(type&&type.value)||'general',name:name.value.trim(),phone:phone.value.trim(),email:(f.querySelector('[name=email]')||{}).value||'',plan:(f.querySelector('[name=plan]')||{}).value||'',classId:(f.querySelector('[name=classId]')||{}).value||'',message:(msg&&msg.value)||''};
      fetch('/api/enquiries',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify(payload)})
        .then(function(r){return r.json().then(function(j){return {ok:r.ok,j:j};});})
        .then(function(res){
          if(res.ok){if(status){status.className='form-status ok';status.textContent='Thank you, '+payload.name+'! We received your enquiry. We will call/WhatsApp you shortly.';}f.reset();}
          else{if(status){status.className='form-status err';status.textContent=(res.j&&res.j.error)||'Something went wrong. Please WhatsApp us instead.';}}
        })
        .catch(function(){
          // Fallback: open WhatsApp with prefilled text (placeholder number replaced via config)
          var wa=(window.OLIVE_CONFIG&&window.OLIVE_CONFIG.whatsapp)||'910000000000';
          var text=encodeURIComponent('Hi OLIVE FITNESS! I am '+payload.name+' ('+payload.phone+'). I want to enquire about '+payload.type+'.');
          window.open('https://wa.me/'+wa+'?text='+text,'_blank');
          if(status){status.className='form-status ok';status.textContent='Backend unreachable — opening WhatsApp instead. Your details were prepared for sending.';}
        })
        .finally(function(){if(btn)btn.disabled=false;});
    });
  });
  // Pre-select plan from URL (?plan=Yearly)
  var qp=new URLSearchParams(location.search);var plan=qp.get('plan');
  if(plan){document.querySelectorAll('select[name=plan]').forEach(function(s){for(var i=0;i<s.options.length;i++){if(s.options[i].value.toLowerCase()===plan.toLowerCase()){s.selectedIndex=i;}}});}
})();
