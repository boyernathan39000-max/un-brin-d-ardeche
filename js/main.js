(function(){
  var L=window.LANGUE||{est:function(){return 'fr'},T:function(s){return s},MOIS:function(){return null},JOURS:function(){return null}},EN=function(){return L.est()==='en'};
  var $=function(s,r){return (r||document).querySelector(s)},$$=function(s,r){return Array.prototype.slice.call((r||document).querySelectorAll(s))};

  /* ---------- page d'ouverture : disparaît seule après 2 s ---------- */
  var intro=$('#intro'),racine=document.documentElement;
  function finIntro(){if(!racine.classList.contains('intro-actif'))return;racine.classList.add('intro-sortie','hero-entree');setTimeout(function(){racine.classList.remove('intro-actif','intro-sortie');if(intro)intro.remove();setTimeout(function(){racine.classList.remove('hero-entree')},1400)},900)}
  if(racine.classList.contains('intro-actif')){setTimeout(finIntro,2000);intro.addEventListener('click',finIntro);window.addEventListener('keydown',finIntro,{once:true})}else if(intro){intro.remove()}

  /* ---------- menu ---------- */
  var entete=$('#entete'),menu=$('#menu'),burger=$('#burger');
  var flot=$('.flottant');
  function maj(){entete.classList.toggle('est-plein',window.scrollY>60);if(flot)flot.classList.toggle('est-visible',window.scrollY>window.innerHeight*0.9)}
  window.addEventListener('scroll',maj,{passive:true});maj();
  burger.addEventListener('click',function(){var o=menu.classList.toggle('est-ouvert');burger.setAttribute('aria-expanded',o)});
  $$('#menu a').forEach(function(a){a.addEventListener('click',function(){menu.classList.remove('est-ouvert');burger.setAttribute('aria-expanded','false')})});

  /* ---------- héros : une photo toutes les 3 secondes ---------- */
  var fonds=$$('.hero__fond'),i=0;
  if(fonds.length>1&&!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    setInterval(function(){fonds[i].classList.remove('est-actif');i=(i+1)%fonds.length;fonds[i].classList.add('est-actif')},3000);
  }

  /* ---------- apparition ---------- */
  var els=$$('.apparait');
  if('IntersectionObserver' in window){
    var io=new IntersectionObserver(function(es){es.forEach(function(e){if(e.isIntersecting){e.target.classList.add('est-visible');io.unobserve(e.target)}})},{threshold:.12});
    els.forEach(function(e){io.observe(e)});
  }else{els.forEach(function(e){e.classList.add('est-visible')})}

  /* ---------- panneaux sauna / cabane / four / terrasse ---------- */
  var pans=$$('.panneau');
  function ouvrirPan(p){pans.forEach(function(x){x.classList.remove('est-ouvert')});p.classList.add('est-ouvert')}
  pans.forEach(function(p){
    p.addEventListener('click',function(){ouvrirPan(p)});
    p.addEventListener('mouseenter',function(){if(window.matchMedia('(hover:hover) and (min-width:901px)').matches)ouvrirPan(p)});
  });

  /* ---------- espaces communs : 4 cases visibles, flèches pour voir les suivantes ---------- */
  (function(){
    var zone=$('#cases-communs'),g=$('#cases-g'),d=$('#cases-d');if(!zone||!g||!d)return;
    var cs=$$('.case',zone),N=4,deb=0,large=window.matchMedia('(min-width:1101px)');
    function afficher(anim){
      var oui=large.matches&&cs.length>N;
      cs.forEach(function(c,i){c.classList.toggle('est-cache',oui&&(i<deb||i>=deb+N))});
      g.hidden=!oui||deb===0;d.hidden=!oui||deb+N>=cs.length;
      if(anim&&oui){zone.classList.remove('cases--glisse');void zone.offsetWidth;zone.classList.add('cases--glisse')}
    }
    g.addEventListener('click',function(){deb=Math.max(0,deb-1);afficher(true)});
    d.addEventListener('click',function(){deb=Math.min(cs.length-N,deb+1);afficher(true)});
    if(large.addEventListener)large.addEventListener('change',function(){afficher(false)});
    afficher(false);
  })();

  /* ---------- carrousel des chambres ---------- */
  (function(){
    var piste=$('#chcar-piste');if(!piste)return;
    var sl=$$('.chcar__slide',piste),pts=$('#chcar-points');
    sl.forEach(function(s,k){var b=document.createElement('button');b.type='button';b.setAttribute('aria-label',L.T('Aller à '+s.querySelector('.chcar__nom').textContent));b.addEventListener('click',function(){aller(k)});pts.appendChild(b)});
    function idx(){return Math.round(piste.scrollLeft/piste.clientWidth)}
    function maj2(){var i=idx();$$('button',pts).forEach(function(b,k){b.classList.toggle('est-actif',k===i)})}
    function aller(k){k=(k+sl.length)%sl.length;piste.scrollTo({left:k*piste.clientWidth,behavior:'smooth'})}
    $('#chcar-g').addEventListener('click',function(){aller(idx()-1)});
    $('#chcar-d').addEventListener('click',function(){aller(idx()+1)});
    piste.addEventListener('scroll',maj2,{passive:true});maj2();
  })();

  /* ---------- fenêtre des équipements ---------- */
  (function(){
    var m=$('#equip-modal'),o=$('#equip-ouvrir');if(!m||!o)return;
    function ouvrir(){m.hidden=false;document.body.classList.add('tiroir-ouvert');$('#equip-x').focus()}
    function fermer(){m.hidden=true;document.body.classList.remove('tiroir-ouvert');o.focus()}
    o.addEventListener('click',ouvrir);$('#equip-x').addEventListener('click',fermer);
    m.addEventListener('click',function(e){if(e.target===m)fermer()});
    document.addEventListener('keydown',function(e){if(e.key==='Escape'&&!m.hidden)fermer()});
  })();

  /* ---------- visionneuse d'album ---------- */
  var ALBUMS={
    ch1:{t:'Chambre 1',p:[['chb1-1','Chambre 1, lit double et mur bleu canard'],['chb1-2','Chambre 1, vue depuis la fenêtre']]},
    ch2:{t:'Chambre 2',p:[['chb2-1','Chambre 2, deux lits simples'],['chb2-2','Chambre 2, vue d\'ensemble'],['chb2-3','Chambre 2, table de chevet et lampe'],['chb2-5','Chambre 2, rideaux et fenêtres']]},
    ch3:{t:'Chambre 3',p:[['chb3-1','Chambre 3, lit double et tête de lit en planches éclairée'],['chb3-2','Chambre 3, vue depuis la porte']]},
    ch4:{t:'Chambre 4',p:[['chb4-1','Chambre 4, lit double et étagère en bois'],['chb4-2','Chambre 4, tête de lit en bois clair'],['chb4-3','Chambre 4, porte et portemanteau'],['chb4-4','Chambre 4, vue d\'ensemble']]},
    cabane:{t:'La cabane tonneau',p:[['cab-1','Intérieur de la cabane tonneau, lit double et fenêtre sur la nature'],['cab-3','La cabane tonneau et sa porte']]},
    sauna:{t:'Le sauna',p:[['sauna-interieur','Intérieur du sauna, poêle à bois et baie vitrée sur la forêt'],['sauna-ext','Le sauna en forme de tonneau']]},
    sejour:{t:'Le séjour',p:[['sejour','Séjour avec grande table à manger'],['sejour-large','Le séjour vu depuis l\'entrée'],['sejour-3','Le séjour et son coin salon'],['poele','Le poêle à bois du séjour']]},
    salon:{t:'Le salon',p:[['salon','Salon avec canapé et mur en bois'],['salon-2','Le salon et son éclairage'],['salon-3','Le salon et l\'escalier']]},
    cuisine:{t:'La cuisine',p:[['cuisine','Cuisine équipée'],['cuisine-bar','Cuisine avec bar et tabourets']]},
    sdb:{t:'La salle de bain',p:[['sdb','Salle de bain avec fenêtre de toit'],['sdb2','Salle de bain, vasque et WC']]},
    galerie:{t:'Galerie',p:[['tonneaux-haut','Vue du ciel sur la maison de pierre et sa terrasse'],['sejour-large','Le séjour et la cuisine'],['cabane-int','L\'intérieur de la cabane tonneau'],['jardin','Le jardin fleuri avec sa pergola bleue'],['salon','Le salon avec canapé et mur en bois'],['terrasse-soir','La terrasse couverte le soir, avec sa grande table'],['galerie-cabanes','Le sauna et la cabane tonneau dans leur clairière'],['chb3-1','Une chambre avec lit double'],['cuisine-bar','La cuisine avec son bar']]}
  };
  var vis=$('#vis'),visImg=$('#vis-img'),visMini=$('#vis-mini'),visTitre=$('#vis-titre'),visCpt=$('#vis-cpt'),cur=null,pos=0,dernier=null;
  function montrer(n){
    var p=cur.p;pos=(n+p.length)%p.length;
    visImg.src='images/'+p[pos][0]+'.jpg';visImg.alt=L.T(p[pos][1]);
    visCpt.textContent=p.length>1?(pos+1)+' / '+p.length:'';
    $$('img',visMini).forEach(function(m,k){m.classList.toggle('est-actif',k===pos)});
  }
  function ouvrirAlbum(cle,debut){
    cur=ALBUMS[cle];dernier=document.activeElement;visTitre.textContent=L.T(cur.t);
    visMini.innerHTML='';
    cur.p.forEach(function(ph,k){var m=document.createElement('img');m.src='images/'+ph[0]+'.jpg';m.alt='';m.addEventListener('click',function(){montrer(k)});visMini.appendChild(m)});
    var seul=cur.p.length<2;
    $$('.vis__f').forEach(function(b){b.style.display=seul?'none':''});visMini.style.display=seul?'none':'';
    vis.hidden=false;document.body.classList.add('tiroir-ouvert');montrer(debut||0);$('.vis__x').focus();
  }
  function fermerAlbum(){vis.hidden=true;document.body.classList.remove('tiroir-ouvert');if(dernier)dernier.focus()}
  $$('[data-album]').forEach(function(b){b.addEventListener('click',function(){ouvrirAlbum(b.getAttribute('data-album'),+b.getAttribute('data-i')||0)})});
  $('.vis__x').addEventListener('click',fermerAlbum);
  $('.vis__f--g').addEventListener('click',function(){montrer(pos-1)});
  $('.vis__f--d').addEventListener('click',function(){montrer(pos+1)});
  vis.addEventListener('click',function(e){if(e.target===vis)fermerAlbum()});

  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'&&!vis.hidden)fermerAlbum();
    if(!vis.hidden&&cur&&cur.p.length>1){if(e.key==='ArrowLeft')montrer(pos-1);if(e.key==='ArrowRight')montrer(pos+1)}
  });

  /* ---------- nombre de photos : toujours celui de l'album ouvert ---------- */
  function pastilles(){
    $$('[data-album]').forEach(function(b){
      var v=$('.voir',b),al=ALBUMS[b.getAttribute('data-album')];
      if(!v||!al||b.hasAttribute('data-i'))return;
      var n=al.p.length,ico=v.querySelector('svg');
      v.textContent='';if(ico)v.appendChild(ico);v.appendChild(document.createTextNode(n+(n>1?' photos':' photo')));
    });
  }
  pastilles();
  document.addEventListener('langue',function(){
    pastilles();
    if(!vis.hidden&&cur){visTitre.textContent=L.T(cur.t);montrer(pos)}
    $$('.chcar__points button').forEach(function(b,k){var s=$$('.chcar__slide')[k];b.setAttribute('aria-label',L.T('Aller à '+s.querySelector('.chcar__nom').textContent))});
  });

  /* ---------- formulaire de questions (mail à Lydie) ---------- */
  $('#question').addEventListener('submit',function(e){
    e.preventDefault();var f=e.target,v=function(n){return f.elements[n].value.trim()};
    if(!v('nom')||!v('mail')||!v('message')){f.elements[!v('nom')?'nom':!v('mail')?'mail':'message'].focus();return}
    var err=$('#accord-err');if(!f.elements.accord.checked){err.hidden=false;f.elements.accord.focus();return}err.hidden=true;
    window.location.href='mailto:lydmonnet05@gmail.com?subject='+encodeURIComponent(L.T('Question avant réservation'))+'&body='+encodeURIComponent((EN()?'Name: ':'Nom : ')+v('nom')+(EN()?'\nEmail: ':'\nCourriel : ')+v('mail')+'\n\n'+v('message'));
    $('#ok').style.display='block';
  });
})();

/* Frise des marchés : un point par jour et un trait ondulé qui se dessine au défilement */
(function(){
  var ch=document.getElementById('marches-chemin');if(!ch)return;
  var svg=ch.querySelector('svg'),fond=ch.querySelector('.marches__fond'),av=ch.querySelector('.marches__avance');
  var items=[].slice.call(ch.querySelectorAll('li')),pts=items.map(function(li){return li.querySelector('.marches__pt')});
  var reduit=window.matchMedia&&window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var len=0,ys=[],attente=false;
  var PLACES=[0.30,0.63,0.38,0.70,0.33,0.66,0.40],COTE=['g','d','g','d','g','d','g'];
  function construire(){
    var W=ch.clientWidth,mob=window.innerWidth<=700,xs=[],ptsXY=[];ys=[];
    ch.classList.toggle('marches__chemin--libre',!mob);
    if(mob){
      ch.style.height='';
      items.forEach(function(li,i){li.style.cssText='';li.classList.remove('marches__li--g');xs[i]=14+(i%2?-6:6);ys[i]=li.offsetTop+16;pts[i].style.left=xs[i]+'px';pts[i].style.top=ys[i]+'px'});
    }else{
      var lw=Math.min(300,W*0.3),fin=0,prec=-110,bord={g:-24,d:-24};
      items.forEach(function(li,i){
        var g=COTE[i]==='g',x=W*PLACES[i];
        x=g?Math.max(x,lw+30):Math.min(x,W-lw-30);xs[i]=x;
        li.classList.toggle('marches__li--g',g);li.style.width=lw+'px';li.style.left=(g?x-30-lw:x+30)+'px';
        pts[i].style.left=(g?lw+30:-30)+'px';pts[i].style.top='16px';
      });
      items.forEach(function(li,i){
        var h=li.offsetHeight,top=Math.max(prec+110,bord[COTE[i]]+24);
        li.style.top=top+'px';ys[i]=top+16;prec=top;bord[COTE[i]]=top+h;fin=Math.max(fin,top+h);
      });
      ch.style.height=fin+'px';
    }
    var H=ch.clientHeight;
    svg.setAttribute('viewBox','0 0 '+W+' '+H);
    var P=items.map(function(li,i){return [xs[i],ys[i]]});
    var d='M'+P[0][0]+' 0 L'+P[0][0]+' '+P[0][1];
    for(var i=1;i<P.length;i++){
      var p0=P[i-1],p1=P[i],pm=P[i-2]||[p0[0],p0[1]-40],pp=P[i+1]||[p1[0],p1[1]+40];
      d+=' C'+(p0[0]+(p1[0]-pm[0])/6)+' '+(p0[1]+(p1[1]-pm[1])/6)+' '+(p1[0]-(pp[0]-p0[0])/6)+' '+(p1[1]-(pp[1]-p0[1])/6)+' '+p1[0]+' '+p1[1];
    }
    var u=P[P.length-1];d+=' L'+u[0]+' '+Math.max(H,u[1]+1);
    fond.setAttribute('d',d);av.setAttribute('d',d);
    len=av.getTotalLength();av.style.strokeDasharray=len+' '+len;
    maj();
  }
  function longueurA(y){
    var a=0,b=len;
    for(var k=0;k<20;k++){var c=(a+b)/2;if(av.getPointAtLength(c).y<y)a=c;else b=c}
    return b;
  }
  function maj(){
    attente=false;
    if(!len)return;
    var r=ch.getBoundingClientRect(),p=reduit?r.height:Math.max(0,Math.min(r.height,window.innerHeight*0.62-r.top));
    av.style.strokeDashoffset=len-(p>=r.height?len:longueurA(p));
    items.forEach(function(li,i){var on=ys[i]<=p+6;li.classList.toggle('est-actif',on);pts[i].classList.toggle('est-actif',on)});
  }
  function demander(){if(!attente){attente=true;window.requestAnimationFrame(maj)}}
  window.addEventListener('scroll',demander,{passive:true});
  window.addEventListener('resize',construire);
  window.addEventListener('load',construire);
  window.addEventListener('langue',function(){window.setTimeout(construire,60)});
  if(window.ResizeObserver)new ResizeObserver(construire).observe(ch);
  construire();
})();
