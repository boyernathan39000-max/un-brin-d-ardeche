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

  /* ---------- carrousel des chambres ---------- */
  (function(){
    var piste=$('#chcar-piste');if(!piste)return;
    var sl=$$('.chcar__slide',piste),pts=$('#chcar-points');
    sl.forEach(function(s,k){var b=document.createElement('button');b.type='button';b.setAttribute('aria-label',L.T('Aller à ')+s.querySelector('.chcar__nom').textContent);b.addEventListener('click',function(){aller(k)});pts.appendChild(b)});
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
    ch1:{t:'Chambre 1',p:[['chb1-1','Chambre 1, lit double et mur bleu canard'],['chb1-2','Chambre 1, vue depuis la fenêtre'],['chambre-1','Chambre 1, tête de lit en planches'],['chambre-6','Chambre 1, vue d\'ensemble']]},
    ch2:{t:'Chambre 2',p:[['chb2-1','Chambre 2, deux lits simples'],['chb2-2','Chambre 2, vue d\'ensemble'],['chb2-3','Chambre 2, table de chevet et lampe'],['chb2-4','Chambre 2, les deux lits'],['chb2-5','Chambre 2, rideaux et fenêtres'],['chambre-8','Chambre 2, placard et fenêtres']]},
    ch3:{t:'Chambre 3',p:[['chb3-1','Chambre 3, lit double et tête de lit en planches éclairée'],['chb3-2','Chambre 3, vue depuis la porte'],['chambre-2','Chambre 3, couette turquoise']]},
    ch4:{t:'Chambre 4',p:[['chb4-1','Chambre 4, lit double et étagère en bois'],['chb4-2','Chambre 4, tête de lit en bois clair'],['chb4-3','Chambre 4, porte et portemanteau'],['chb4-4','Chambre 4, vue d\'ensemble'],['chb4-5','Chambre 4, commode verte'],['chambre-4','Chambre 4, lit double aux murs verts'],['chambre-5','Chambre 4, tête de lit']]},
    cabane:{t:'La cabane tonneau',p:[['cab-4','La cabane tonneau et le sauna dans le jardin'],['cab-1','La cabane tonneau, vue de l\'intérieur'],['cab-2','La cabane tonneau, la vue depuis le lit'],['cab-3','La cabane tonneau et sa porte']]},
    sejour:{t:'Le séjour',p:[['sejour','Séjour avec grande table à manger'],['sejour-large','Le séjour vu depuis l\'entrée'],['sejour-3','Le séjour et son coin salon'],['poele','Le poêle à bois du séjour']]},
    salon:{t:'Le salon',p:[['salon','Salon avec canapé et mur en bois'],['salon-2','Le salon et son éclairage'],['salon-3','Le salon et l\'escalier']]},
    cuisine:{t:'La cuisine',p:[['cuisine','Cuisine équipée'],['cuisine-bar','Cuisine avec bar et tabourets']]},
    sdb:{t:'La salle de bain',p:[['sdb','Salle de bain avec fenêtre de toit'],['sdb2','Salle de bain, vasque et WC']]},
    galerie:{t:'Galerie',p:[['tonneaux-haut','Vue du ciel sur la maison de pierre et sa terrasse'],['sejour-large','Le séjour et la cuisine'],['cabane-int','L\'intérieur de la cabane tonneau'],['jardin','Le jardin fleuri avec sa pergola bleue'],['salon','Le salon avec canapé et mur en bois'],['terrasse-facade','La terrasse couverte et le four à pizza'],['hero-tonneaux','Le sauna et la cabane tonneau au milieu des fleurs'],['chambre-2','Une chambre avec lit double'],['cuisine-bar','La cuisine avec son bar']]}
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
  function fermerAlbum(){vis.hidden=true;if(!$('#tiroir').classList.contains('est-ouvert'))document.body.classList.remove('tiroir-ouvert');if(dernier)dernier.focus()}
  $$('[data-album]').forEach(function(b){b.addEventListener('click',function(){ouvrirAlbum(b.getAttribute('data-album'),+b.getAttribute('data-i')||0)})});
  $('.vis__x').addEventListener('click',fermerAlbum);
  $('.vis__f--g').addEventListener('click',function(){montrer(pos-1)});
  $('.vis__f--d').addEventListener('click',function(){montrer(pos+1)});
  vis.addEventListener('click',function(e){if(e.target===vis)fermerAlbum()});

  /* ---------- panneau de réservation ---------- */
  var tiroir=$('#tiroir'),voile=$('#voile'),e1=$('#e1'),e2=$('#e2'),e3=$('#e3'),pied=$('#pied'),suite=$('#suite'),retour=$('#retour'),totalEl=$('#total'),etapes=$$('#etapes li'),etape=1;
  var MOIS=['janvier','février','mars','avril','mai','juin','juillet','août','septembre','octobre','novembre','décembre'];
  var JOURS=['dimanche','lundi','mardi','mercredi','jeudi','vendredi','samedi'];
  var auj=new Date();auj.setHours(0,0,0,0);
  var vue=new Date(auj.getFullYear(),auj.getMonth(),1),arr=null,dep=null,dernierBouton=null;
  var MIN_NUITS=2,P_NUIT=170,P_WE=400,P_SEM=900;

  function fmt(d){var J=L.JOURS()||JOURS,M=L.MOIS()||MOIS;return J[d.getDay()]+' '+d.getDate()+' '+M[d.getMonth()]+' '+d.getFullYear()}
  function euros(n){return EN()?'€'+n.toLocaleString('en-GB'):n.toLocaleString('fr-FR')+'\u00a0€'}
  function nuits(){return arr&&dep?Math.round((dep-arr)/864e5):0}

  /* tarifs affichés : à partir de 170 € la nuit, 400 € le week-end (vendredi et samedi), 900 € la semaine */
  function calcul(){
    var n=nuits(),lignes=[],total=0;if(n<MIN_NUITS)return null;
    var sem=Math.floor(n/7);
    if(sem){lignes.push([EN()?sem+(sem>1?' weeks':' week')+' (7 nights)':sem+(sem>1?' semaines':' semaine')+' (7 nuits)',sem*P_SEM]);total+=sem*P_SEM}
    var reste=n-sem*7,d=new Date(arr.getTime()+sem*7*864e5),we=0,simples=0,k=0;
    while(k<reste){
      var j=new Date(d.getTime()+k*864e5).getDay();
      if(j===5&&k+1<reste){we++;k+=2}else{simples++;k++}
    }
    if(we){lignes.push([EN()?we+(we>1?' weekends':' weekend')+' (Friday and Saturday)':we+(we>1?' week-ends':' week-end')+' (vendredi et samedi)',we*P_WE]);total+=we*P_WE}
    if(simples){lignes.push([EN()?simples+(simples>1?' nights':' night')+' at €'+P_NUIT:simples+(simples>1?' nuits':' nuit')+' à '+P_NUIT+'\u00a0€',simples*P_NUIT]);total+=simples*P_NUIT}
    return {lignes:lignes,total:total,n:n};
  }

  function dessinerCal(){
    var g=$('#cal-grille');g.innerHTML='';
    $('#cal-mois').textContent=(L.MOIS()||MOIS)[vue.getMonth()]+' '+vue.getFullYear();
    $('#cal-p').disabled=(vue.getFullYear()===auj.getFullYear()&&vue.getMonth()===auj.getMonth());
    var premier=(new Date(vue.getFullYear(),vue.getMonth(),1).getDay()+6)%7,nb=new Date(vue.getFullYear(),vue.getMonth()+1,0).getDate();
    for(var v=0;v<premier;v++)g.appendChild(document.createElement('span'));
    for(var j=1;j<=nb;j++){
      (function(j){
        var d=new Date(vue.getFullYear(),vue.getMonth(),j),b=document.createElement('button');
        b.type='button';b.textContent=j;b.setAttribute('aria-label',fmt(d));
        if(d<auj)b.disabled=true;
        if(arr&&+d===+arr||dep&&+d===+dep)b.classList.add('est-bord');
        else if(arr&&dep&&d>arr&&d<dep)b.classList.add('est-plage');
        b.addEventListener('click',function(){choisir(d)});
        g.appendChild(b);
      })(j);
    }
  }
  function choisir(d){
    if(!arr||dep||d<=arr){arr=d;dep=null}else{dep=d}
    dessinerCal();majResume();
  }
  function majResume(){
    var c=calcul(),aide=$('#cal-aide'),r=$('#recap1');
    if(!arr){aide.textContent=EN()?"Choose your arrival day, then your departure day.":"Choisissez votre jour d'arrivée, puis votre jour de départ.";}
    else if(!dep){aide.textContent=EN()?"Arrival on "+fmt(arr)+". Now choose your departure day.":"Arrivée le "+fmt(arr)+". Choisissez maintenant votre jour de départ.";}
    else if(nuits()<MIN_NUITS){aide.textContent=EN()?"The stay is at least "+MIN_NUITS+" nights.":"Le séjour dure au moins "+MIN_NUITS+" nuits.";}
    else{aide.textContent=EN()?nuits()+" nights from "+fmt(arr)+" to "+fmt(dep)+".":nuits()+" nuits du "+fmt(arr)+" au "+fmt(dep)+".";}
    if(c){
      r.innerHTML=c.lignes.map(function(l){return '<div class="l"><span>'+l[0]+'</span><span>'+euros(l[1])+'</span></div>'}).join('')+
        '<div class="l t"><span>'+L.T('Total estimé')+'</span><span>'+euros(c.total)+'</span></div>'+
        '<small>'+L.T("Tarif estimé d'après les prix affichés. Draps et serviettes en supplément. Lydie confirme le montant définitif.")+'</small>';
      totalEl.textContent=euros(c.total);suite.disabled=false;
    }else{
      r.innerHTML=EN()?'<small>Choose your dates: the price is calculated automatically. From €'+P_NUIT+' a night, €'+P_WE+' a weekend and €'+P_SEM+' a week.</small>':'<small>Choisissez vos dates\u00a0: le tarif se calcule automatiquement. À partir de '+P_NUIT+'\u00a0€ la nuit, '+P_WE+'\u00a0€ le week-end et '+P_SEM+'\u00a0€ la semaine.</small>';
      totalEl.textContent='-';suite.disabled=true;
    }
  }
  function recapCourt(){
    var c=calcul(),nbp=$('#nb').value;
    return '<div class="l"><span>'+L.T('Arrivée')+'</span><span>'+fmt(arr)+'</span></div><div class="l"><span>'+L.T('Départ')+'</span><span>'+fmt(dep)+'</span></div>'+
      '<div class="l"><span>'+(EN()?c.n+' nights · '+nbp+' guest'+(nbp>1?'s':''):c.n+' nuits · '+nbp+' personne'+(nbp>1?'s':''))+'</span><span></span></div><div class="l t"><span>'+L.T('Total estimé')+'</span><span>'+euros(c.total)+'</span></div>';
  }
  function allerEtape(n){
    etape=n;e1.hidden=n!==1;e2.hidden=n!==2;e3.hidden=n!==3;
    etapes.forEach(function(li,k){li.classList.toggle('est-actif',k<n)});
    retour.hidden=n!==2;pied.hidden=n===3;
    suite.textContent=n===1?L.T('Continuer'):L.T('Envoyer ma demande de réservation');
    suite.disabled=n===1?!calcul():false;
    if(n===2)$('#recap2').innerHTML=recapCourt();
    $('.tiroir__corps:not([hidden])',tiroir).scrollTop=0;
  }
  function ouvrir(){
    dernierBouton=document.activeElement;
    voile.hidden=false;tiroir.setAttribute('aria-hidden','false');
    requestAnimationFrame(function(){voile.classList.add('est-visible');tiroir.classList.add('est-ouvert')});
    document.body.classList.add('tiroir-ouvert');
    dessinerCal();majResume();allerEtape(1);
    setTimeout(function(){$('.tiroir__x').focus()},300);
  }
  function fermer(){
    voile.classList.remove('est-visible');tiroir.classList.remove('est-ouvert');tiroir.setAttribute('aria-hidden','true');
    document.body.classList.remove('tiroir-ouvert');
    setTimeout(function(){voile.hidden=true},300);
    if(dernierBouton)dernierBouton.focus();
  }
  $$('[data-reserver]').forEach(function(b){b.addEventListener('click',ouvrir)});
  $('.tiroir__x').addEventListener('click',fermer);voile.addEventListener('click',fermer);
  $('#merci-fermer').addEventListener('click',function(){arr=null;dep=null;e2.reset();fermer()});
  $('#cal-p').addEventListener('click',function(){vue=new Date(vue.getFullYear(),vue.getMonth()-1,1);dessinerCal()});
  $('#cal-s').addEventListener('click',function(){vue=new Date(vue.getFullYear(),vue.getMonth()+1,1);dessinerCal()});
  retour.addEventListener('click',function(){allerEtape(1)});
  suite.addEventListener('click',function(){
    if(etape===1){if(calcul())allerEtape(2);return}
    if(etape===2){
      var champs=['prenom','nom','mail','tel'],manque=null;
      champs.forEach(function(n){var f=e2.elements[n];f.style.borderColor='';if(!f.value.trim()||(n==='mail'&&f.value.indexOf('@')<1)){f.style.borderColor='#C0392B';if(!manque)manque=f}});
      if(manque){manque.focus();return}
      var c=calcul(),nbp=$('#nb').value;
      $('#merci-titre').textContent=EN()?'Thank you '+e2.elements.prenom.value.trim()+'!':'Merci '+e2.elements.prenom.value.trim()+' !';
      $('#merci-txt').textContent=L.T("Votre demande de réservation est bien enregistrée. Lydie vous recontactera pour confirmer les disponibilités et finaliser votre séjour.");
      $('#recap3').innerHTML=recapCourt();
      allerEtape(3);
    }
  });
  document.addEventListener('keydown',function(e){
    if(e.key==='Escape'){if(!vis.hidden)fermerAlbum();else if(tiroir.classList.contains('est-ouvert'))fermer()}
    if(!vis.hidden&&cur&&cur.p.length>1){if(e.key==='ArrowLeft')montrer(pos-1);if(e.key==='ArrowRight')montrer(pos+1)}
  });

  /* ---------- changement de langue : on redessine les textes calculés ---------- */
  document.addEventListener('langue',function(){
    dessinerCal();majResume();
    if(etape>1&&etape<3)allerEtape(etape);
    if(!vis.hidden&&cur){visTitre.textContent=L.T(cur.t);montrer(pos)}
    $$('.chcar__points button').forEach(function(b,k){var s=$$('.chcar__slide')[k];b.setAttribute('aria-label',L.T('Aller à ')+s.querySelector('.chcar__nom').textContent)});
  });

  /* ---------- formulaire de questions (mail à Lydie) ---------- */
  $('#question').addEventListener('submit',function(e){
    e.preventDefault();var f=e.target,v=function(n){return f.elements[n].value.trim()};
    if(!v('nom')||!v('mail')||!v('message')){f.elements[!v('nom')?'nom':!v('mail')?'mail':'message'].focus();return}
    window.location.href='mailto:lydmonnet05@gmail.com?subject='+encodeURIComponent(L.T('Question avant réservation'))+'&body='+encodeURIComponent((EN()?'Name: ':'Nom : ')+v('nom')+(EN()?'\nEmail: ':'\nCourriel : ')+v('mail')+'\n\n'+v('message'));
    $('#ok').style.display='block';
  });
})();
