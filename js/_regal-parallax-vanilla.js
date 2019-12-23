var RegalParallax = function(selector, options, mainHeader){
	var plugin = this;
	
	plugin.el = (typeof(selector) === 'object') ? selector : (selector.indexOf('#') >= 0) ? document.getElementById(selector.replace('#', '')) : document.querySelector(selector);
	
	var defaults = {
		end: (plugin.el.getAttribute('data-end') && plugin.el.getAttribute('data-end') !== '') ? plugin.el.getAttribute('data-end') : 2 
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
	g = d.getElementsByTagName('body')[0]
	var lastScroll,
		scrolled = window.pageYOffset,
		top = plugin.el.getBoundingClientRect().top + window.pageYOffset,
		h = parseInt(getComputedStyle(plugin.el).height),
		windowWidth = w.innerWidth||e.clientWidth||g.clientWidth,
		windowHeight = w.innerHeight||e.clientHeight||g.clientHeight;
		
	//IE version
	var isIE = function() {
		var myNav = navigator.userAgent.toLowerCase();
		return (myNav.indexOf('msie') !== -1) ? parseInt(myNav.split('msie')[1]) : false;
	};

	var initVars = function(){
		//console.log("*********** initVars()");
		scrolled = window.pageYOffset,
		top = plugin.el.getBoundingClientRect().top + window.pageYOffset,
		h = parseInt(getComputedStyle(plugin.el).height),
		windowWidth = w.innerWidth||e.clientWidth||g.clientWidth,
		windowHeight = w.innerHeight||e.clientHeight||g.clientHeight;
	}
	initVars();
	
	var parallaxit = function(){
		scrolled = window.pageYOffset,
		top = plugin.el.getBoundingClientRect().top + window.pageYOffset;
		
		var distance = scrolled + windowHeight - top;
		
		var ratio = (distance / ((windowHeight + h) / (100 * plugin.o.end)));
		ratio = (ratio <= 0) ? 0 : ratio;
		ratio = (ratio >= 100) ? 100 : ratio;
		
		var cssparam = {};
		
		var translateX = 0;
		if(plugin.el.getAttribute('data-x')){				
			var x0 = parseFloat(plugin.el.getAttribute('data-x').split('#')[0], 10);
			var x1 = parseFloat(plugin.el.getAttribute('data-x').split('#')[1], 10);
			var deltaX = x1 - x0;
			translateX = (x0 + (ratio*deltaX/100)).toFixed(0) + 'px';
		}
		var translateY = 0;
		if(plugin.el.getAttribute('data-y')){				
			var y0 = parseFloat(plugin.el.getAttribute('data-y').split('#')[0], 10);
			var y1 = parseFloat(plugin.el.getAttribute('data-y').split('#')[1], 10);
			var deltaY = y1 - y0;
			translateY = (y0 + (ratio*deltaY/100)).toFixed(0) + 'px';
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
		
		if (plugin.el.getAttribute('data-scale') && plugin.el.getAttribute('data-scale') !== ''){
			var scale0 = parseFloat(plugin.el.getAttribute('data-scale').split('#')[0], 10);
			var scale1 = parseFloat(plugin.el.getAttribute('data-scale').split('#')[1], 10);
			var deltaS = scale1 - scale0;
			if(cssparam.transform){
				cssparam.transform += 'scale('+ (scale0 + (ratio*deltaS/100)).toFixed(2) + ') ';
			}
			else{
				cssparam.transform = 'scale('+ (scale0 + (ratio*deltaS/100)).toFixed(2) + ') ';
			}
		}	
		
		if (plugin.el.getAttribute('data-rotate') && plugin.el.getAttribute('data-rotate') !== ''){
			var rotate0 = parseInt(plugin.el.getAttribute('data-rotate').split('#')[0], 10);
			var rotate1 = parseInt(plugin.el.getAttribute('data-rotate').split('#')[1], 10);
			var deltaR = rotate1 - rotate0;
			if(cssparam.transform){
				cssparam.transform += 'rotate('+ (rotate0 +  (ratio*deltaR/100)).toFixed(0) + 'deg) ';
			}
			else{
				cssparam.transform = 'rotate('+ (rotate0 +  (ratio*deltaR/100)).toFixed(0) + 'deg) ';
			}
		}
		
		if (plugin.el.getAttribute('data-skewX') && plugin.el.getAttribute('data-skewX') !== ''){
			var skewX0 = parseInt(plugin.el.getAttribute('data-skewX').split('#')[0], 10);
			var skewX1 = parseInt(plugin.el.getAttribute('data-skewX').split('#')[1], 10);
			var deltaSkX = skewX1 - skewX0;
			if(cssparam.transform){
				cssparam.transform += 'skewX('+(skewX0 +  (ratio*deltaSkX/100)).toFixed(0) + 'deg) ';
			}
			else{
				cssparam.transform = 'skewX('+(skewX0 +  (ratio*deltaSkX/100)).toFixed(0) + 'deg) ';
			}
		}
		
		if (plugin.el.getAttribute('data-skewY') && plugin.el.getAttribute('data-skewY') !== ''){
			var skewY0 = parseInt(plugin.el.getAttribute('data-skewY').split('#')[0], 10);
			var skewY1 = parseInt(plugin.el.getAttribute('data-skewY').split('#')[1], 10);
			var deltaSkY = skewY1 - skewY0;
			if(cssparam.transform){
				cssparam.transform += 'skewY('+(skewY0 +  (ratio*deltaSkY/100)).toFixed(0) + 'deg) ';
			}
			else{
				cssparam.transform = 'skewY('+(skewY0 +  (ratio*deltaSkY/100)).toFixed(0) + 'deg) ';
			}
		}				
		
		if (plugin.el.getAttribute('data-o') && plugin.el.getAttribute('data-o') !== ''){
			var o0 = parseFloat(plugin.el.getAttribute('data-o').split('#')[0], 10);
			var o1 = parseFloat(plugin.el.getAttribute('data-o').split('#')[1], 10);
			var deltaO = o1 - o0;
			var ratiopacity = (o0 + (ratio*deltaO))/100;
			ratiopacity = (ratiopacity >= 1) ? 1 : (ratiopacity <= 0) ? 0 : ratiopacity;
			cssparam.opacity = ratiopacity.toFixed(2);
			plugin.el.style.opacity = cssparam.opacity;
		}	
		
		//cssparam['-webkit-filter'] = cssparam.filter;
		cssparam['-webkit-transform'] = cssparam.transform;
		
		plugin.el.style.transform = cssparam.transform;
		plugin.el.style['-webkit-transform'] = cssparam['-webkit-transform'];
	};
	
	parallaxit();
	window.addEventListener('scroll', function(){
		requestAnimationFrame(parallaxit);
	});
	window.addEventListener('resize', function(){
		initVars();
	});
	window.addEventListener('load', function(){
		setTimeout(function(){
			//to make sure everything is loaded, especially images
			initVars();
		}, 500);
	});
}