var RegalMouseParallax = function(selector, options){
	var plugin = this;
	
	plugin.el = (typeof(selector) === 'object') ? selector : (selector.indexOf('#') >= 0) ? document.getElementById(selector.replace('#', '')) : document.querySelector(selector);
	
	if(plugin.el){
		var defaults = {
			x: (plugin.el.getAttribute('data-x') && plugin.el.getAttribute('data-x') !== '') ? plugin.el.getAttribute('data-x') : 0,
			y: (plugin.el.getAttribute('data-y') && plugin.el.getAttribute('data-y') !== '') ? plugin.el.getAttribute('data-y') : 0,
			rotate: (plugin.el.getAttribute('data-rotate') && plugin.el.getAttribute('data-rotate') !== '') ? plugin.el.getAttribute('data-rotate') : 0,
			scale: (plugin.el.getAttribute('data-scale') && plugin.el.getAttribute('data-scale') !== '') ? plugin.el.getAttribute('data-scale') : 0,
			o: (plugin.el.getAttribute('data-o') && plugin.el.getAttribute('data-o') !== '') ? plugin.el.getAttribute('data-o') : 0,
			sx: (plugin.el.getAttribute('data-skewX') && plugin.el.getAttribute('data-skewX') !== '') ? plugin.el.getAttribute('data-skewX') : 0,
			sy: (plugin.el.getAttribute('data-skewY') && plugin.el.getAttribute('data-skewY') !== '') ? plugin.el.getAttribute('data-skewY') : 0,
			doc: (plugin.el.getAttribute('data-doc')) ? plugin.el.getAttribute('data-doc') : 0,
		};
		
		if (typeof Object.assign != 'function') {
		  Object.assign = function(target, varArgs) { // .length of function is 2
			'use strict';
			if (target == null) { // TypeError if undefined or null
			  throw new TypeError('Cannot convert undefined or null to object');
			}
			var to = Object(target);
			for (var index = 1; index < arguments.length; index++) {
			  var nextSource = arguments[index];
			  if (nextSource != null) { // Skip over if undefined or null
				for (var nextKey in nextSource) {
				  // Avoid bugs when hasOwnProperty is shadowed
				  if (Object.prototype.hasOwnProperty.call(nextSource, nextKey)) {
					to[nextKey] = nextSource[nextKey];
				  }
				}
			  }
			}
			return to;
		  };
		}
		plugin.o = Object.assign({}, defaults, options);
		
		var w = window,
		d = document,
		e = d.documentElement,
		g = d.getElementsByTagName('body')[0],
		h,
		w,
		x,
		y;
		//IE version
		var isIE = function() {
			var myNav = navigator.userAgent.toLowerCase();
			return (myNav.indexOf('msie') !== -1) ? parseInt(myNav.split('msie')[1]) : false;
		};
		var initVars = function(){
			scrolled = window.pageYOffset,
			top = plugin.el.getBoundingClientRect().top + window.pageYOffset,
			h = parseInt(getComputedStyle(plugin.el).height),
			windowWidth = w.innerWidth||e.clientWidth||g.clientWidth,
			windowHeight = w.innerHeight||e.clientHeight||g.clientHeight;
			docHeight = document.documentElement.scrollHeight;
			w = plugin.o.doc ? window.innerWidth/2 : plugin.el.getBoundingClientRect().width/2;
			h = plugin.o.doc ? window.innerHeight/2 : plugin.el.getBoundingClientRect().height/2;
			x = parseFloat(plugin.o.x);
			y = parseFloat(plugin.o.y);
		}
		initVars();
		
		var doc = plugin.o.doc ? window : plugin.el;
		var parallaxit = function (e) {
			var iks = e.pageX || e.clientX;
			var igrec = e.pageY || e.clientY;
			var pox = ((w - iks) * x);
			var poy = ((h - igrec) * y);
			
			var cssparam = {};
			
			var translateX = 0;
			if(plugin.o.x){				
				translateX = pox + 'px';
			}
			var translateY = 0;
			if(plugin.o.y){	
				translateY = poy + 'px';
			}
			
			if(translateX !== 0 || translateY !== 0){
				if(cssparam.transform){
					if(isIE() && isIE() <= 9){
						cssparam.transform += 'translate(' + translateX + ', ' + translateY + ') ';
					}
					else{
						cssparam.transform += 'translate3d(' + translateX + ', ' + translateY + ', 0) ';
					}
				}
				else{
					if(isIE() && isIE() <= 9){
						cssparam.transform = 'translate(' + translateX + ', ' + translateY + ') ';
					}
					else{
						cssparam.transform = 'translate3d(' + translateX + ', ' + translateY + ', 0) ';
					}
				}
			}
			
			if (plugin.o.scale && plugin.o.scale !== ''){
				var scale = parseFloat(plugin.o.scale) * pox;
				if(cssparam.transform){
					cssparam.transform += 'scale('+ scale.toFixed(2) + ') ';
				}
				else{
					cssparam.transform = 'scale('+ scale.toFixed(2) + ') ';
				}
			}	
			
			if (plugin.o.rotate && plugin.o.rotate !== ''){
				var rotate = parseInt(plugin.o.rotate, 10);
				if(cssparam.transform){
					cssparam.transform += 'rotate('+ (rotate + pox).toFixed(0) + 'deg) ';
				}
				else{
					cssparam.transform = 'rotate('+ (rotate + pox).toFixed(0) + 'deg) ';
				}
			}
			
			if (plugin.o.sx && plugin.o.sx !== ''){
				var skewX = parseInt(plugin.o.sx, 10);
				if(cssparam.transform){
					cssparam.transform += 'skewX(' + (skewX + pox).toFixed(0) + 'deg) ';
				}
				else{
					cssparam.transform = 'skewX(' + (skewX + pox).toFixed(0) + 'deg) ';
				}
			}
			
			if (plugin.o.sy && plugin.o.sy !== ''){
				var skewY = parseInt(plugin.o.sy, 10);
				if(cssparam.transform){
					cssparam.transform += 'skewY(' + (skewY + poy).toFixed(0) + 'deg) ';
				}
				else{
					cssparam.transform = 'skewY(' + (skewY + poy).toFixed(0) + 'deg) ';
				}
			}				
			
			if (plugin.o.o && plugin.o.o !== ''){
				var o = parseFloat(plugin.o.o, 10);
				var ratiopacity = o + pox;
				ratiopacity = (ratiopacity >= 1) ? 1 : (ratiopacity <= 0) ? 0 : ratiopacity;
				cssparam.opacity = ratiopacity.toFixed(2);
				plugin.el.style.opacity = cssparam.opacity;
			}	
			
			//cssparam['-webkit-filter'] = cssparam.filter;
			cssparam['-webkit-transform'] = cssparam.transform;
			
			plugin.el.style.transform = cssparam.transform;
			plugin.el.style['-webkit-transform'] = cssparam['-webkit-transform'];
		};
		
		var destroy = function(){
			cancelAnimationFrame(raf);
			plugin.el.style.transform = 'none';
			plugin.el.style['-webkit-transform'] = 'none';
			window.removeEventListener('mousemove', playraf);
		}
		
		var raf;
		var playraf = function(){
			raf = requestAnimationFrame(parallaxit);
		};
		
		doc.addEventListener('mousemove', parallaxit);
		doc.addEventListener('mouseleave', destroy);

	}
	else{
		console.log("no element declared");
	}
}