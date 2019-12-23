# vanilla-regal-parallax
Simple Vanilla Parallax
Parallax Vanilla
Mieux que mieux !

En modifiant uniquement les éléments transform et opacity des objets parallaxés, on gagne en performance par rapports aux parallax qui modifient les margin, padding, top, left, etc. Alors, c'est mieux.
Et comme c'est un constructeur vanilla, pas besoin de jQuery. Alors, c'est encore mieux.
Nouveauté mai 2019 !

Maintenant, on peut appliquer des transform et une opacité aux objets parallaxés via CSS sans que ceux-ci ne soient écrasés par le script grace au getComputedStyle(plugin.el).transform et quelques génuflexions neuronales !

Cependant, skew, scale et rotate ne font pas bon ménage.
La matrix retournée par getComputedStyle(plugin.el).transform est trop compliquée à décortiquer.
Il faut éviter d'appliquer simultanément skew/scale ou skew/rotate (CSS et/ou data)...
En fait, le mieux est de ne pas utiliser de skew !
Utilisation du plugin
Inclure le plugin à sa page

<script type="text/javascript" src="js/regal-parallax-vanilla.js"></script>
ou
<script type="text/javascript" src="js/regal-parallax-vanilla.min.js"></script>
Déclarer les objets :
var regalParallax = document.querySelectorAll('.js-regaloeb-parallax');
for(var i=0; i<regalParallax.length; i++){
    new RegalParallax( regalParallax[i]);
}

On détermine les propriétés à animer avec des attributs "data-XXX".
L'attribut data-x="INITIAL#FINAL" indique que le translateX sera modifiée via la propriété translate3d.
L'attribut data-y="INITIAL#FINAL" indique que la translateY sera modifiée via la propriété translate3d.
L'attribut data-scale="INITIAL#FINAL" indique que la scale sera modifiée, INITIAL: scale initiale, FINAL: scale finale.
L'attribut data-rotate="INITIAL#FINAL" indique que la rotation sera modifiée, INITIAL: rotate initiale, FINAL: rotate finale.
L'attribut data-skewX="INITIAL#FINAL" indique que le skewX sera modifiée, INITIAL: skewX initiale, FINAL: skewX finale.
L'attribut data-skewY="INITIAL#FINAL" indique que le skewY sera modifiée, INITIAL: skewY initiale, FINAL: skewY finale.
L'attribut data-o="INITIAL#FINAL" indique que l'opacité sera modifiée.
L'attribut data-end="NUM" indique à quel endroit du viewport l'objet atteint ses valeurs finales : 2 = au milieu, 3 = au 2/3, 1 au scroll 0. Valeur par défaut: 2.

Lorsque l'élément arrive dans le viewport, la propriété prend la valeur INITIAL
À l'endroit du viewport déterminé par data-end (au milieu par défaut), la propriété prend la valeur FINAL.

Petit truc : en rajoutant une transition sur le transform et l'opacity, l'objet continue à "bouger" à la fin du scroll (plus ou moins longtemps selon la durée de la transition - ici : 0.3s).

On peut aussi déterminer les propriétés à animer en javascript :
var monParallax = new RegalParallax( document.querySelector('.element'), {'y':'110#0', 'x':'-30#0', 'end':'4'});
Les noms des paramètres sont les mêmes qu'en version HTML sans "data-".
Les propriétés déclarées en javascript écrasent les valeurs déclarées en HTML. 

Démo: http://www.regaloeb.com/pages/regal-parallax-vanilla/
