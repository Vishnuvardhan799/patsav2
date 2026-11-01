(function(){
  /* mobile menu */
  var burger=document.querySelector('.burger'), nav=document.getElementById('nav');
  burger.addEventListener('click',function(){
    var open=nav.classList.toggle('open');
    burger.setAttribute('aria-expanded',open);
  });
  var dd=document.querySelector('.dd'), ddBtn=document.querySelector('.dd-btn');
  ddBtn.addEventListener('click',function(){
    var open=dd.classList.toggle('open'); ddBtn.setAttribute('aria-expanded',open);
  });
  document.addEventListener('click',function(e){ if(!dd.contains(e.target)){dd.classList.remove('open');ddBtn.setAttribute('aria-expanded','false');} });

  /* hero strings */
  var strings=document.querySelector('.strings');
  if(strings){
    var n=window.innerWidth<600?22:44;
    for(var i=0;i<n;i++){
      var s=document.createElement('i');
      var mid=1-Math.abs(i-n/2)/(n/2);
      s.style.setProperty('--h',(18+mid*62+Math.random()*14)+'%');
      s.style.setProperty('--d',(0.9+Math.random()*1.8).toFixed(2)+'s');
      s.style.animationDelay=(-Math.random()*2).toFixed(2)+'s';
      strings.appendChild(s);
    }
  }

  /* hero slider */
  var slides=[].slice.call(document.querySelectorAll('.slide')), dots=document.querySelector('.dots'), idx=0, timer;
  if(slides.length){
    slides.forEach(function(_,i){
      var b=document.createElement('button'); b.setAttribute('role','tab'); b.setAttribute('aria-label','Slide '+(i+1));
      b.addEventListener('click',function(){go(i);restart();}); dots.appendChild(b);
    });
    function go(i){
      idx=(i+slides.length)%slides.length;
      slides.forEach(function(s,k){s.classList.toggle('on',k===idx);s.setAttribute('aria-hidden',k!==idx);});
      [].forEach.call(dots.children,function(d,k){d.setAttribute('aria-selected',k===idx);});
    }
    function restart(){clearInterval(timer); if(!matchMedia('(prefers-reduced-motion: reduce)').matches) timer=setInterval(function(){go(idx+1)},6500);}
    document.querySelector('.prev').addEventListener('click',function(){go(idx-1);restart();});
    document.querySelector('.next').addEventListener('click',function(){go(idx+1);restart();});
    go(0); restart();
  }

  /* course carousel */
  var car=document.querySelector('.carousel');
  if(car){
    var step=function(){return car.querySelector('.card').offsetWidth+19;};
    document.querySelector('.cprev').addEventListener('click',function(){car.scrollBy({left:-step(),behavior:'smooth'});});
    document.querySelector('.cnext').addEventListener('click',function(){car.scrollBy({left:step(),behavior:'smooth'});});
  }

  /* form validation */
  [].forEach.call(document.querySelectorAll('form.form'),function(f){
    f.addEventListener('submit',function(e){
      var bad=false;
      [].forEach.call(f.querySelectorAll('[required]'),function(el){
        var ok=el.value.trim()!=='' && (el.type!=='email'||/^\S+@\S+\.\S+$/.test(el.value)) && (el.type!=='tel'||/^[0-9+\-\s()]{7,20}$/.test(el.value));
        el.classList.toggle('invalid',!ok); if(!ok) bad=true;
      });
      if(bad){e.preventDefault(); f.querySelector('.invalid').focus();}
    });
  });
})();

/* play one video at a time */
(function(){
  var vids=[].slice.call(document.querySelectorAll('video'));
  vids.forEach(function(v){v.addEventListener('play',function(){vids.forEach(function(o){if(o!==v)o.pause();});});});
})();

/* motion layer */
(function(){
  var rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
  [].forEach.call(document.querySelectorAll('.sec .head,.card,.steps li,.ticks li,.vgrid figure,.formbox'),function(e,i){e.classList.add('reveal');e.style.transitionDelay=(i%4)*90+'ms';});
  var io=new IntersectionObserver(function(es){es.forEach(function(x){if(x.isIntersecting){x.target.classList.add('in');io.unobserve(x.target);
    var b=x.target.querySelector&&x.target.querySelector('[data-n]');if(b)count(b);}});},{threshold:.15});
  [].forEach.call(document.querySelectorAll('.reveal'),function(e){io.observe(e);});
  function count(b){var t=+b.dataset.n,s=performance.now();(function f(n){var p=Math.min((n-s)/1600,1);b.textContent=Math.round(t*(1-Math.pow(1-p,3)))+(t<100?'+':'');if(p<1)requestAnimationFrame(f);})(s);}
  var bar=document.querySelector('.progress');
  addEventListener('scroll',function(){var h=document.documentElement;bar.style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight)*100)+'%';var hero=document.querySelector('.strings');if(hero&&!rm)hero.style.transform='translateY('+h.scrollTop*.25+'px)';},{passive:true});
  var g=document.querySelector('.glow');
  if(g&&!rm)addEventListener('mousemove',function(e){g.style.left=e.clientX+'px';g.style.top=e.clientY+'px';});
  if(!rm&&matchMedia('(hover:hover)').matches)[].forEach.call(document.querySelectorAll('.card,.ph'),function(c){
    c.addEventListener('mousemove',function(e){var r=c.getBoundingClientRect(),x=(e.clientX-r.left)/r.width-.5,y=(e.clientY-r.top)/r.height-.5;c.style.transform='perspective(800px) rotateY('+x*10+'deg) rotateX('+-y*10+'deg) translateY(-4px)';});
    c.addEventListener('mouseleave',function(){c.style.transform='';});});
  [].forEach.call(document.querySelectorAll('.ph img'),function(im){im.parentNode.addEventListener('click',function(){var l=document.createElement('div');l.className='lb';l.innerHTML='<img src="'+im.src+'" alt="'+im.alt+'">';l.onclick=function(){l.remove();};document.body.appendChild(l);});});
})();

/* hero background follows slide */
(function(){var sl=[].slice.call(document.querySelectorAll('.slide')),bg=[].slice.call(document.querySelectorAll('.hbgs div'));if(!bg.length)return;
var mo=new MutationObserver(function(){sl.forEach(function(s,i){if(s.classList.contains('on'))bg.forEach(function(b,k){b.classList.toggle('on',k===i);});});});
sl.forEach(function(s){mo.observe(s,{attributes:true,attributeFilter:['class']});});})();

/* cinematic showcase */
[].forEach.call(document.querySelectorAll('[data-show]'),function(st){
  var sl=[].slice.call(st.querySelectorAll('.sl')),bar=st.querySelector('.sbar'),th=st.querySelector('.sth'),i=0,tm,T=6000,rm=matchMedia('(prefers-reduced-motion: reduce)').matches;
  sl.forEach(function(s,k){var b=document.createElement('button');b.setAttribute('aria-label','Image '+(k+1));b.style.backgroundImage='url('+s.querySelector('img').getAttribute('src')+')';b.onclick=function(){go(k);};th.appendChild(b);});
  function go(n){var o=sl[i];n=(n+sl.length)%sl.length;if(n===i&&o.classList.contains('on')){mark();return;}
    sl.forEach(function(s){s.classList.remove('out');});o.classList.remove('on');o.classList.add('out');i=n;sl[i].classList.add('on');
    [].forEach.call(th.children,function(b,k){b.classList.toggle('on',k===i);});mark();}
  function mark(){clearTimeout(tm);bar.classList.remove('run');void bar.offsetWidth;if(sl.length<2||rm)return;bar.style.setProperty('--t',T+'ms');bar.classList.add('run');tm=setTimeout(function(){go(i+1);},T);}
  st.querySelector('.sp').onclick=function(){go(i-1);};st.querySelector('.sn').onclick=function(){go(i+1);};
  var x0;st.addEventListener('touchstart',function(e){x0=e.touches[0].clientX;},{passive:true});st.addEventListener('touchend',function(e){var d=e.changedTouches[0].clientX-x0;if(Math.abs(d)>40)go(i+(d<0?1:-1));});
  th.children[0].classList.add('on');mark();
});

/* polish: header, to-top, magnetic buttons, gold dust */
(function(){
  var rm=matchMedia('(prefers-reduced-motion: reduce)').matches,hd=document.querySelector('.site-header'),nav=document.getElementById('nav'),last=0;
  var t=document.createElement('button');t.className='totop';t.setAttribute('aria-label','Back to top');t.innerHTML='&#8593;';t.onclick=function(){scrollTo({top:0,behavior:'smooth'});};document.body.appendChild(t);
  addEventListener('scroll',function(){var y=scrollY;hd.classList.toggle('solid',y>20);
    hd.classList.toggle('hide',y>last&&y>260&&!(nav&&nav.classList.contains('open')));last=y;t.classList.toggle('show',y>700);},{passive:true});
  if(!rm&&matchMedia('(hover:hover)').matches)[].forEach.call(document.querySelectorAll('.btn-gold,.btn-line'),function(b){
    b.addEventListener('mousemove',function(e){var r=b.getBoundingClientRect();b.style.transform='translate('+(e.clientX-r.left-r.width/2)*.2+'px,'+(e.clientY-r.top-r.height/2)*.3+'px)';});
    b.addEventListener('mouseleave',function(){b.style.transform='';});});
  var hero=document.querySelector('.hero');if(!hero||rm)return;
  var c=document.createElement('canvas');c.className='dust';hero.insertBefore(c,hero.firstChild.nextSibling);
  var x=c.getContext('2d'),P=[],run=true,w,h,n=innerWidth<700?26:60,dpr=Math.min(devicePixelRatio||1,2);
  function size(){w=c.width=hero.offsetWidth*dpr;h=c.height=hero.offsetHeight*dpr;}
  size();addEventListener('resize',size);
  for(var i=0;i<n;i++)P.push({x:Math.random(),y:Math.random(),r:(Math.random()*2+.6),s:Math.random()*.0007+.0002,p:Math.random()*6.28});
  new IntersectionObserver(function(e){run=e[0].isIntersecting;if(run)loop();}).observe(hero);
  function loop(){if(!run)return;x.clearRect(0,0,w,h);P.forEach(function(q){q.y-=q.s;q.p+=.02;if(q.y<-.02){q.y=1.02;q.x=Math.random();}
    var a=.35+.45*Math.sin(q.p*1.5),px=(q.x+Math.sin(q.p)*.012)*w,py=q.y*h,g=x.createRadialGradient(px,py,0,px,py,q.r*dpr*4);
    g.addColorStop(0,'rgba(246,221,138,'+a+')');g.addColorStop(1,'rgba(212,160,23,0)');x.fillStyle=g;x.beginPath();x.arc(px,py,q.r*dpr*4,0,6.28);x.fill();});requestAnimationFrame(loop);}
  loop();
})();
