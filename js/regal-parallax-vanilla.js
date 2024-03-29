//regal-parallax
var RegalParallax = function(selector, options){
	var plugin = this;
	
	plugin.el = (typeof(selector) === 'object') ? selector : (selector.indexOf('#') >= 0) ? document.getElementById(selector.replace('#', '')) : document.querySelector(selector);
	
	if(plugin.el){
		var defaults = {
			end: (plugin.el.getAttribute('data-end') && plugin.el.getAttribute('data-end') !== '') ? plugin.el.getAttribute('data-end') : 2 ,
			start: (plugin.el.getAttribute('data-start') && plugin.el.getAttribute('data-start') !== '') ? plugin.el.getAttribute('data-start') : 0,
			x: (plugin.el.getAttribute('data-x') && plugin.el.getAttribute('data-x') !== '') ? plugin.el.getAttribute('data-x') : 0,
			y: (plugin.el.getAttribute('data-y') && plugin.el.getAttribute('data-y') !== '') ? plugin.el.getAttribute('data-y') : 0,
			rotate: (plugin.el.getAttribute('data-rotate') && plugin.el.getAttribute('data-rotate') !== '') ? plugin.el.getAttribute('data-rotate') : 0,
			scale: (plugin.el.getAttribute('data-scale') && plugin.el.getAttribute('data-scale') !== '') ? plugin.el.getAttribute('data-scale') : 0,
			scaleX: (plugin.el.getAttribute('data-scaleX') && plugin.el.getAttribute('data-scaleX') !== '') ? plugin.el.getAttribute('data-scaleX') : 0,
			scaleY: (plugin.el.getAttribute('data-scaleY') && plugin.el.getAttribute('data-scaleY') !== '') ? plugin.el.getAttribute('data-scaleY') : 0,
			o: (plugin.el.getAttribute('data-o') && plugin.el.getAttribute('data-o') !== '') ? plugin.el.getAttribute('data-o') : 0,
			sx: (plugin.el.getAttribute('data-skewX') && plugin.el.getAttribute('data-skewX') !== '') ? plugin.el.getAttribute('data-skewX') : 0,
			sy: (plugin.el.getAttribute('data-skewY') && plugin.el.getAttribute('data-skewY') !== '') ? plugin.el.getAttribute('data-skewY') : 0,
			xdepth: (plugin.el.getAttribute('data-x-depth') && plugin.el.getAttribute('data-x-depth') !== '') ? plugin.el.getAttribute('data-x-depth') : 0,
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
		g = d.getElementsByTagName('body')[0];
		var lastScroll,
			scrolled = window.pageYOffset,
			top = plugin.el.getBoundingClientRect().top + window.pageYOffset,
			h = parseInt(getComputedStyle(plugin.el).height),
			windowWidth = w.innerWidth||e.clientWidth||g.clientWidth,
			windowHeight = w.innerHeight||e.clientHeight||g.clientHeight,
			docHeight = document.body.clientHeight||document.documentElement.clientHeight||document.documentElement.scrollHeight;
		var isFixed = window.getComputedStyle(plugin.el).position === 'fixed';
    
		function deltaTransformPoint(matrix, point)  {
			var dx = point.x * matrix[0] + point.y * matrix[2] + 0;
			var dy = point.x * matrix[1] + point.y * matrix[3] + 0;
			return { x: dx, y: dy };
		}
		
		var getTransform = function(){
			var matrix = getComputedStyle(plugin.el).transform;
			var transform = {};
			if(matrix !== 'none'){
				var values = matrix.split('(')[1];
				values = values.split(')')[0];
				values = values.split(',');
				transform.translateX = parseFloat(values[4]);
				transform.translateY = parseFloat(values[5]);
				var a = values[0];
				var b = values[1];
				var c = values[2];
				var d = values[3];
        var scaleXcygne = parseFloat(a) < 0 ? -1 : 1;
        var scaleYcygne = parseFloat(d) < 0 ? -1 : 1;
				transform.scale = Math.sqrt(a*a + b*b).toFixed(2);
				transform.scaleX = Math.sqrt(a*a + b*b)*scaleXcygne.toFixed(2);
				transform.scaleY = Math.sqrt(c*c + d*d)*scaleYcygne.toFixed(2);
				transform.rotate = Math.round(Math.atan2(b, a) * (180/Math.PI));
				/*
				var denom = Math.pow(a, 2) + Math.pow(b, 2)
				transform.skewX = Math.round(Math.atan2(a * c + b * d, denom) * (180/Math.PI));
				transform.skewY = 0;//(180/Math.PI) * Math.atan2( ((0*c)+(1*c)),((0*a)-(1*b))) - 90;
				*/
				var px = deltaTransformPoint(values, { x: 0, y: 1 });
				var py = deltaTransformPoint(values, { x: 1, y: 0 });
				transform.skewX = Math.round(-((180 / Math.PI) * Math.atan2(px.y, px.x) - 90));
				transform.skewY = ((180 / Math.PI) * Math.atan2(py.y, py.x));
				/*if(plugin.el.classList.contains('trace')){
					console.log("transform.skewX: ", transform.skewX);
					console.log("transform.skewY: ", transform.skewY);
				}*/
			}
			else{
				transform = matrix;
			}
			return transform;
		}
		var getMatrixTransform = function(){
			var matrix = getComputedStyle(plugin.el).transform;
			return matrix;
		}
		
    var isInViewport = function(element) {
      var rect = element.getBoundingClientRect();
      return rect.top < (window.innerHeight || document.documentElement.clientHeight) && rect.bottom > 0;
    };
    
		var initWindowVars = function(){
			scrolled = window.pageYOffset,
			top = plugin.el.getBoundingClientRect().top + window.pageYOffset,
			h = parseInt(getComputedStyle(plugin.el).height),
			windowWidth = w.innerWidth||e.clientWidth||g.clientWidth,
			windowHeight = w.innerHeight||e.clientHeight||g.clientHeight;
			docHeight = document.documentElement.scrollHeight;
		}
		initWindowVars();
		
		var initMatrix = getMatrixTransform();
		var initTransForm;
		var initO;
		var initTranslateX;
		var initTranslateY;
    var translateX;
    var translateY;
    var initMatrixVars = function(){
      initMatrix = getMatrixTransform();
      initTransForm = getTransform();
      initO = parseFloat(getComputedStyle(plugin.el).opacity);
      initTranslateX = (initMatrix !== 'none') ? initTransForm.translateX : 0;
      initTranslateY = (initMatrix !== 'none') ? initTransForm.translateY : 0;
      translateX = initTranslateX;
      translateY = initTranslateY;
      /*if(plugin.el.classList.contains('traceme')){
        console.log("===== initMatrix: ", initMatrix);
      }*/
    }
    //initMatrixVars();
    
		var parallaxit = function(){
			scrolled = window.pageYOffset,
			top = plugin.el.getBoundingClientRect().top + scrolled;
			var distance = scrolled + windowHeight - top;
			var ratio = (distance / windowHeight * (100 * plugin.o.end)) - plugin.o.start;
			if(isFixed){
				ratio = ((scrolled + windowHeight) / docHeight) * (100 * plugin.o.end) - plugin.o.start;
			}
			if(plugin.o.end !== 1){
				ratio = (ratio <= 0) ? 0 : ratio;
				ratio = (ratio >= 100) ? 100 : ratio;
			}
			var cssparam = {};
			
			//translateX
			if(plugin.o.x){				
				var x0 = parseFloat(plugin.o.x.split('#')[0], 10);
				var x1 = parseFloat(plugin.o.x.split('#')[1], 10);
				var deltaX = x1 - x0;
				translateX = ((x0 + (ratio*deltaX/100)) + initTranslateX).toFixed(0) + 'px';
			}
			//translateY
			if(plugin.o.y){	
				var y0 = parseFloat(plugin.o.y.split('#')[0], 10);
				var y1 = parseFloat(plugin.o.y.split('#')[1], 10);
				var deltaY = y1 - y0;
				translateY = ((y0 + (ratio*deltaY/100)) + initTranslateY).toFixed(0) + 'px';
			}
			if(translateX !== 0 || translateY !== 0){
				if(cssparam.transform){
					cssparam.transform += 'translate3d(' + translateX + ', ' + translateY + ', 0) ';
				}
				else{
					cssparam.transform = 'translate3d(' + translateX + ', ' + translateY + ', 0) ';
				}
			}
			
			//scale
      /*
			var initS = (initMatrix !== 'none') ? parseFloat(initTransForm.scale) : 0;
			var scale = (initMatrix !== 'none') ? parseFloat(initTransForm.scale) : 1;
			if (plugin.o.scale && plugin.o.scale !== ''){0
				var scale0 = parseFloat(plugin.o.scale.split('#')[0], 10);
				var scale1 = parseFloat(plugin.o.scale.split('#')[1], 10);
				var deltaS = scale1 - scale0;
				scale = ((scale0 + (ratio*deltaS/100)) + initS).toFixed(2)
			}	
			if(cssparam.transform){
				cssparam.transform += 'scale('+ scale + ') ';
			}
			else{
				cssparam.transform = 'scale('+ scale + ') ';
			}
      */
			var scaleX;
			if (plugin.o.scaleX && plugin.o.scaleX !== ''){
				var scaleX0 = parseFloat(plugin.o.scaleX.split('#')[0], 10);
				var scaleX1 = (initMatrix !== 'none') ? parseFloat(initTransForm.scaleX) : parseFloat(plugin.o.scaleX.split('#')[1], 10);
				var deltaSX = scaleX1 - scaleX0;
				scaleX = ((scaleX0 + (ratio*deltaSX/100))).toFixed(2);
        if(cssparam.transform){
          cssparam.transform += 'scaleX('+ scaleX + ')';
        }
        else{
          cssparam.transform = 'scaleX('+ scaleX + ')';
        }
			}
      else if(initMatrix !== 'none' && parseFloat(initTransForm.scaleX) !== 1){
        if(cssparam.transform){
          cssparam.transform += 'scaleX('+ parseFloat(initTransForm.scaleX) + ')';
        }
        else{
          cssparam.transform = 'scaleX('+ parseFloat(initTransForm.scaleX) + ')';
        }
      }
			var scaleY;
      if (plugin.o.scaleY && plugin.o.scaleY !== ''){
				var scaleY0 = parseFloat(plugin.o.scaleY.split('#')[0], 10);
				var scaleY1 = (initMatrix !== 'none') ? parseFloat(initTransForm.scaleY) : parseFloat(plugin.o.scaleY.split('#')[1], 10);
				var deltaSY = scaleY1 - scaleY0;
				scaleY = ((scaleY0 + (ratio*deltaSY/100))).toFixed(2);
        if(cssparam.transform){
          cssparam.transform += 'scaleY('+ scaleY + ') ';
        }
        else{
          cssparam.transform = 'scaleY('+ scaleY + ') ';
        }
			}	
      else if(initMatrix !== 'none' && parseFloat(initTransForm.scaleY) !== 1){
        if(cssparam.transform){
          cssparam.transform += 'scaleY('+ parseFloat(initTransForm.scaleY) + ')';
        }
        else{
          cssparam.transform = 'scaleY('+ parseFloat(initTransForm.scaleY) + ')';
        }
      }
      
			//rotate
			var initR = (initMatrix !== 'none') ? initTransForm.rotate : 0;
			var rotate = 0;
			if (plugin.o.rotate && plugin.o.rotate !== ''){
				var rotate0 = parseInt(plugin.o.rotate.split('#')[0], 10);
				var rotate1 = parseInt(plugin.o.rotate.split('#')[1], 10);
				var deltaR = rotate1 - rotate0;
				var rotate = ((rotate0 +  (ratio*deltaR/100)) + initR).toFixed(0);
			}
			if(cssparam.transform){
				cssparam.transform += 'rotate('+ rotate + 'deg) ';
			}
			else{
				cssparam.transform = 'rotate('+ rotate + 'deg) ';
			}
			
			//skewX
			var initSx = (initMatrix !== 'none') ? initTransForm.skewX : 0;
			var sX = initSx;
			if (plugin.o.sx && plugin.o.sx !== ''){
				var skewX0 = parseInt(plugin.o.sx.split('#')[0], 10);
				var skewX1 = parseInt(plugin.o.sx.split('#')[1], 10);
				var deltaSkX = skewX1 - skewX0;
				sX = ((skewX0 +  (ratio*deltaSkX/100)) + initSx).toFixed(0);
			}
			if(rotate === 0){
				if(cssparam.transform){
					cssparam.transform += 'skewX(' + sX + 'deg) ';
				}
				else{
					cssparam.transform = 'skewX(' + sX + 'deg) ';
				}
			}
			
			var initSy = (initMatrix !== 'none') ? initTransForm.skewY : 0;
			var sY = initSy;
			if (plugin.o.sy && plugin.o.sy !== ''){
				var skewY0 = parseInt(plugin.o.sy.split('#')[0], 10);
				var skewY1 = parseInt(plugin.o.sy.split('#')[1], 10);
				var deltaSkY = skewY1 - skewY0;
				sY = ((skewY0 +  (ratio*deltaSkY/100)) + initSy).toFixed(0);
			}
			if(rotate === 0){
				if(cssparam.transform){
					cssparam.transform += 'skewY(' + sY + 'deg) ';
				}
				else{
					cssparam.transform = 'skewY(' + sY + 'deg) ';
				}
			}
			
			//opacity
			if (plugin.o.o && plugin.o.o !== ''){
				var o0 = parseFloat(plugin.o.o.split('#')[0], 10);
				var o1 = parseFloat(plugin.o.o.split('#')[1], 10);
				if(initO < 1){
					o1 = initO;
				}
				var deltaO = o1 - o0;
				var ratiopacity = (o0 + (ratio*deltaO))/100;
				ratiopacity = (ratiopacity >= 1) ? 1 : (ratiopacity <= 0) ? 0 : ratiopacity;
				cssparam.opacity = ratiopacity.toFixed(2);
				plugin.el.style.opacity = cssparam.opacity;
			}	
			
			//cssparam['-webkit-filter'] = cssparam.filter;
			cssparam['-webkit-transform'] = cssparam.transform;
      
			//apply only when on sight
      //if(isInViewport(plugin.el)){
        plugin.el.style.transform = cssparam.transform;
        plugin.el.style['-webkit-transform'] = cssparam['-webkit-transform'];
      //}
		};
		
		this.destroy = function(){
			cancelAnimationFrame(raf);
			plugin.el.style.transform = 'none';
			plugin.el.style['-webkit-transform'] = 'none';
			window.removeEventListener('scroll', playraf);
			window.removeEventListener('resize', initWindowVars);
		}
		
		//parallaxit();
		var raf;
		var playraf = function(){
      //console.log("playraf()");
			raf = requestAnimationFrame(parallaxit);
		};
		window.addEventListener('resize',  initWindowVars);
    document.addEventListener("DOMContentLoaded", function(){
      //
    });
    var initRegalParallax = this.initRegalParallax = function(){
      initWindowVars();
      initMatrixVars();
      window.addEventListener('scroll', playraf);
      parallaxit();
    }
		window.addEventListener('load', function(){
			setTimeout(function(){
				//to make sure everything is loaded, especially images
				initRegalParallax();
			}, 500);
		});
	}
	else{
		console.log("no element declared");
	}
};
