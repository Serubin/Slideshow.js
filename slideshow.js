/* 
 * Photo SlideShow
 * Author: Solomon Rubin, Serubin.net
 * Version: 2.0
 * 
 * Do not distribute.
 */
 
 
 // TODO change options during slideshow run
 // TODO add backward compatibility
 // TODO add arrow listeners
 
function SlideShow(initObject){
	/* Functions Vars */
	
	var init;
	var addSlide;
	var start;
	var next;
	var previous;
	var pause;
	var resume;
	
	/* User Vars (Defaults); */
	var startOnLoad = true; // Start once SlideShow has loaded
	var pre_load = false; // Pre-load images
	var random = false; // Progress through slides randomly
	var defaultInterval = 10000; // Default in MS (10 seconds);
	var hoverPause = true; // Pause when hovered over image
	var transition = "fade"; // default transition
	var easing = TWEEN.Easing.Quadratic.InOut; // Default easings
	var selectorNav = false; // Selector navigation option
	var arrowNav = false; // Arrow navigation option
	var hoverPreview = true; // Image preview on selector dots
	var hoverText = "Click for more!"; // Text displayed when hovered over slide
	var height = 550; // Default frame size
	var autoH = false;
	var width = 925; // Default frame size
	var autoW = false;
	var matchWindow = false;
	var mobileOverride = false; // Keep from adding viewport to mobile device
	var debugM = false; // debug messages are false by default
	var slideOnload = undefined;
	
	/* Script Vars */
	var initiated = false;
	var slides = new Array();
	var selectors = new Array();
	var slidesLoaded = false;
	var isMobile = false;
	var curSlide = undefined; // Current Slide;
	var previousSlide = undefined; // Previous slide
	var curTimer;
	var slideHistory = new Array();
	var descOffset;
	var css3 = false; // CSS3 Support
	
	/* Element Vars */
	var slideShowEl; // SlideShow Element Object
	var linkEl;
	var imageWrapperEl;
	var imageEl;
	var completeEl;
	var titleEl;
	var descEl;
	var selectEl = undefined;
	var navArrowEls = undefined;
	var slideBarEl;
	
	/* Private Functions */
	function initiate(options){
		// Collects init data from anonymous object
		if(typeof options.element != "undefined"){
			slideShowEl = document.getElementById(options.element);
		} else {
			slideShowEl = document.getElementById("slideshow");
		}
		
		debug("Loading SlideShow element: " + slideShowEl.id);
		if(typeof options.pre_load != "undefined"){
			pre_load = options.pre_load;
			debug("Preload: " + pre_load);
		}
		if(typeof options.random != "undefined"){
			random = options.random;
			debug("Random: " + random);
		}
		if(typeof options.interval != "undefined"){
			defaultInterval = options.interval;
			debug("Default slide interval is: " + defaultInterval);
		}
		if(typeof options.hover_pause != "undefined"){
			hoverPause = options.hover_pause;
			debug("Hover pause: " + hoverPause);
		}
		if(typeof options.transition != "undefined"){
			transition = options.transition;
			debug("Trasition mode is: " + transition);
		}
		if(typeof options.selector_nav != "undefined"){
			selectorNav = options.selector_nav;
			debug("Selector nav: " + selectorNav);
		}
		if(typeof options.arrow_nav != "undefined"){
			arrowNav = options.arrow_nav;
			debug("Arrow nav: " + arrowNav);
		}
		if(typeof options.hover_preview != "undefined"){
			hoverPreview = options.hover_preview;
			debug("Hover preview: " + hoverPreview);
		}
		if(typeof options.hover_text != "undefined"){
			hoverText = options.hover_text;
			debug("Hover text: " + hoverText);
		}
		if(typeof options.height != "undefined"){
			if(options.height == "auto"){
				height = getWindowSize().y;
				autoH = true;
			} else {
				height = options.height;
			}
		}
		if(typeof options.width != "undefined"){
			if(options.width == "auto"){
				width = getWindowSize().x;
				autoW = true;
			} else {
				width = options.width;
			}
		}
		if(typeof options.match_window != "undefined"){
			matchWindow = options.match_window;
		}
		if(typeof options.startOnLoad != "undefined"){
			startOnLoad = options.startOnLoad;
		}
		if(typeof options.debug != "undefined"){
			debugM = options.debug;
		}
		if(typeof options.onload != "undefined"){
			slideOnload = options.onload;
		}
		if(typeof options.easing != "undefined"){
			easing = options.easing;
		}
		
		
		// Process for mobile devices
		if(!mobileOverride){
			var useragent = navigator.userAgent || navigator.vendor || window.opera;
			if (/(android|bb\d+|meego).+mobile|avantgo|bada\/|blackberry|blazer|compal|elaine|fennec|hiptop|iemobile|ip(hone|od)|iris|kindle|lge |maemo|midp|mmp|mobile.+firefox|netfront|opera m(ob|in)i|palm( os)?|phone|p(ixi|re)\/|plucker|pocket|psp|series(4|6)0|symbian|treo|up\.(browser|link)|vodafone|wap|windows (ce|phone)|xda|xiino/i.test(useragent) || /1207|6310|6590|3gso|4thp|50[1-6]i|770s|802s|a wa|abac|ac(er|oo|s\-)|ai(ko|rn)|al(av|ca|co)|amoi|an(ex|ny|yw)|aptu|ar(ch|go)|as(te|us)|attw|au(di|\-m|r |s )|avan|be(ck|ll|nq)|bi(lb|rd)|bl(ac|az)|br(e|v)w|bumb|bw\-(n|u)|c55\/|capi|ccwa|cdm\-|cell|chtm|cldc|cmd\-|co(mp|nd)|craw|da(it|ll|ng)|dbte|dc\-s|devi|dica|dmob|do(c|p)o|ds(12|\-d)|el(49|ai)|em(l2|ul)|er(ic|k0)|esl8|ez([4-7]0|os|wa|ze)|fetc|fly(\-|_)|g1 u|g560|gene|gf\-5|g\-mo|go(\.w|od)|gr(ad|un)|haie|hcit|hd\-(m|p|t)|hei\-|hi(pt|ta)|hp( i|ip)|hs\-c|ht(c(\-| |_|a|g|p|s|t)|tp)|hu(aw|tc)|i\-(20|go|ma)|i230|iac( |\-|\/)|ibro|idea|ig01|ikom|im1k|inno|ipaq|iris|ja(t|v)a|jbro|jemu|jigs|kddi|keji|kgt( |\/)|klon|kpt |kwc\-|kyo(c|k)|le(no|xi)|lg( g|\/(k|l|u)|50|54|\-[a-w])|libw|lynx|m1\-w|m3ga|m50\/|ma(te|ui|xo)|mc(01|21|ca)|m\-cr|me(rc|ri)|mi(o8|oa|ts)|mmef|mo(01|02|bi|de|do|t(\-| |o|v)|zz)|mt(50|p1|v )|mwbp|mywa|n10[0-2]|n20[2-3]|n30(0|2)|n50(0|2|5)|n7(0(0|1)|10)|ne((c|m)\-|on|tf|wf|wg|wt)|nok(6|i)|nzph|o2im|op(ti|wv)|oran|owg1|p800|pan(a|d|t)|pdxg|pg(13|\-([1-8]|c))|phil|pire|pl(ay|uc)|pn\-2|po(ck|rt|se)|prox|psio|pt\-g|qa\-a|qc(07|12|21|32|60|\-[2-7]|i\-)|qtek|r380|r600|raks|rim9|ro(ve|zo)|s55\/|sa(ge|ma|mm|ms|ny|va)|sc(01|h\-|oo|p\-)|sdk\/|se(c(\-|0|1)|47|mc|nd|ri)|sgh\-|shar|sie(\-|m)|sk\-0|sl(45|id)|sm(al|ar|b3|it|t5)|so(ft|ny)|sp(01|h\-|v\-|v )|sy(01|mb)|t2(18|50)|t6(00|10|18)|ta(gt|lk)|tcl\-|tdg\-|tel(i|m)|tim\-|t\-mo|to(pl|sh)|ts(70|m\-|m3|m5)|tx\-9|up(\.b|g1|si)|utst|v400|v750|veri|vi(rg|te)|vk(40|5[0-3]|\-v)|vm40|voda|vulc|vx(52|53|60|61|70|80|81|83|85|98)|w3c(\-| )|webc|whit|wi(g |nc|nw)|wmlb|wonu|x700|yas\-|your|zeto|zte\-/i.test(useragent.substr(0, 4))){
				isMobile = true;
				// Adds viewport meta tag to head
				var mobileMeta = document.createElement("meta");
					mobileMeta.name = "viewport";
					mobileMeta.content = "width=device-width, user-scalable=no";
				document.getElementsByTagName("head")[0].appendChild(mobileMeta);
			}
		}
		
		// Check css3
		if ('WebkitTransform' in document.body.style 
		|| 'MozTransform' in document.body.style 
		|| 'OTransform' in document.body.style 
		|| 'transform' in document.body.style){
			var css3 = true;
		}


		// Inject CSS

		var css = " \
			/* Container */
			.slide-container{overflow:hidden;width:100%;height:100%}
			.slide-container a{overflow:hidden;border:0px solid #fff;}


			#slide-bar{background:rgba(0,0,0,0.6);height:60px;width:90%;position:relative;top:-80px;font:14px Tahoma,Arial,Helvetica,sans-serif;}
			#slide-title{color:#fff;font-size:24px;font-family:Tahoma,Arial,Helvetica,sans-serif;position:relative;padding:2px 15px;float:left}
			#slide-desc{color:#fff;text-align:right;padding:5px 15px;position:relative;float:right;}
			#slide-complete{background:#fff;height:5px;opacity:.40;}
			#slide-select{position:relative;top:-95px;left:-40px;}
			#slide-select li{display:block;list-style:none;padding:0 5px 0 5px;margin-top:-1px;}
			#slide-image-wrapper{position:relative;overflow: hidden;}

			.slide-image{position:absolute;top:auto;left:auto;}

			.select-hover-wrap{width:150px;height:84px;overflow:hidden;}
			.select-hover{position:absolute;width:150px;height:84px;top:-100px;background:rgba(255,255,255, 0.6);padding:4px;}

			.photo-button{background:url(./images/photo-bullet.png) top left;width:15px;height:15px;margin:2px;float:left;}
			.photo-button:hover{background-position:0 50%;}
			.photo-button-active{background-position:0 100% !important;} 

			.slide-arrow{position:relative;top:-200px;color:#fff;text-decoration:none;padding:5px;background:rgba(255, 255, 255, 0.3);text-align:center;}
			#arrow-left{float:left;margin: auto 0 auto 0;border-radius:0 5px 5px 0;width:5em;}
			#arrow-right{float:right;margin: auto 0 auto 0;border-radius:5px 0 0 5px;width:5em;}

			.transition{opacity:100;transition-property:opacity 0.5s;-moz-transition:opacity 0.5s;-webkit-transition:opacity 0.5s;-o-transition:opacity 0.5s;}
			.transitionSlide{margin-top:0px;transition-property:opacity 0.5s;-moz-transition:margin 0.5s;-webkit-transition:margin 0.5s;-o-transition:margin 0.5s;}

			.load{position:fixed;margin:47% 47%;width:43px;box-shadow:none;}
			";

		
		var styleBlock = document.createElement("style");
		styleBlock.innerHTML = css;

		document.getElementsByTagName('body')[0].appendChild(styleBlock);


		// Created early for slide loading
		imageWrapperEl = document.createElement("div");
			imageWrapperEl.id = "slide-image-wrapper";
			imageWrapperEl.style.width = width;
			imageWrapperEl.style.height = height;
		
		initiated = true;
		debug("Initiated");
	}
	
	function resize(){
		// Resets height and width
		if(autoW)
			width = getWindowSize().x;
		if(autoH)
			height = getWindowSize().y;
		// Sets element height and width to new height and width
		slideShowEl.style.width = width + "px";
		slideShowEl.style.height = height + "px";
		imageWrapperEl.style.width = width + "px";
		imageWrapperEl.style.height = height + "px";
		// Hides description if there is no room
		if((slideBarEl.offsetWidth - titleEl.offsetWidth) - descOffset < 50)
			descEl.style.display = "none";
		else
			descEl.style.display = "";
		// Changes arrow position
		if(typeof navArrowEls != "undefined"){
			for(var i = 0;navArrowEls.length > i;i++){
				navArrowEls[i].style.top = "-" + ((height/2) + 100) + "px";
			}
		}
		// Recenters image
		centerImage(slides[curSlide]);
	}
	
	function create(){
		// Error checking for empty slides
		debug("Total " + total);
		for(var i = 0;total > i;i++){
			if(!slides[i].loaded) {
				setTimeout(create, 5);
				return 0;
			}
		}
		debug("Creating elements");
		if(slides.length < 1){
			error("function create: no slides loaded, cannot create slideshow DOM objects");
			return 0;
		}
		
		slideShowEl.className = "slide-container";
		slideShowEl.style.width = width + "px";
		slideShowEl.style.height = height + "px";
		
		linkEl = document.createElement("a");
			linkEl.id = "slide-link";
			linkEl.title = hoverText;
		// Hoverpause listeners if enabled
		if(hoverPause){
			addEvent(linkEl, "mousemove", function(e){
				if(typeof curTimer != "undefined")
					curTimer.stop();
			});
			addEvent(linkEl, "mouseout", function(e){
				if(typeof curTimer != "undefined")
					curTimer.start();
			});
		}
		
		linkEl.appendChild(imageWrapperEl); // Previously created in init
		
		// Creates "meta" bar
		slideBarEl = document.createElement("div");
			slideBarEl.id = "slide-bar";
		completeEl = document.createElement("div");
			completeEl.id = "slide-complete";
		slideBarEl.appendChild(completeEl);
		
		titleEl = document.createElement("div");
			titleEl.id = "slide-title";
		slideBarEl.appendChild(titleEl);
		
		descEl = document.createElement("div");
			descEl.id = "slide-desc";
		slideBarEl.appendChild(descEl);
		
		slideShowEl.appendChild(linkEl);
		slideShowEl.appendChild(slideBarEl);
		
		if(arrowNav){
			var arrowLeft = document.createElement("a"); 
				arrowLeft.className = "slide-arrow";
				arrowLeft.id = "arrow-left";
				arrowLeft.href = "javascript:void(0);";
				arrowLeft.innerHTML = "Previous";
				addEvent(arrowLeft, "click", function(e){
					switchPreviousSlide();
					e.preventDefault();
				});
			var arrowRight = document.createElement("a"); 
				arrowRight.className = "slide-arrow";
				arrowRight.id = "arrow-right";
				arrowRight.href = "javascript:void(0);";
				arrowRight.innerHTML = "Next";
				addEvent(arrowRight, "click", function(e){
					switchNextSlide();
					e.preventDefault();
				});
			console.log(arrowRight);
			slideShowEl.appendChild(arrowLeft);
			slideShowEl.appendChild(arrowRight);
			navArrowEls = document.getElementsByClassName("slide-arrow");
		}
		// Creates selectors
		if(selectorNav){
			var select = document.createElement("ul");
				select.id = "slide-select";
			
			for(var i = 0;total > i;i++){
				var li = document.createElement("li");
					li.className = "slide-li-photo-" + i;
				var a = document.createElement("a");
					a.href = "javascript:void(0);";
					a.className = "photo-button"
					a.id = "slide-photo-" + i;
					a.dataId = i;
					a.title = slides[i].title;
					addEvent(a, "click", function(e){
						debug("Selector switch: " + this.dataId);
						switchSlide(slides[this.dataId]);
						e.preventDefault();
					});
				li.appendChild(a);
				selectors.push({"id":i,"element":li});
				// Hover preview stuff
				if(hoverPreview){
					//TODO add hover preview stuff
					var span = document.createElement("span");
						span.className = "select-hover";
						span.style.display = "none";
						
					var div = document.createElement("div");
						div.className = "select-hover-wrap";
						
					var img = document.createElement("img");
						img.src = slides[i].img;
						
					
					centerImage(img, 150, 84);
					div.appendChild(img);
					span.appendChild(div);
					li.appendChild(span);
					
					// Event listeners for mouse in and out
					addEvent(a, "mouseover", function(){
						this.nextSibling.style.display = "";
					});
					addEvent(a, "mouseout", function(){
						this.nextSibling.style.display = "none";
					});
				}
				select.appendChild(li);
			}
			slideShowEl.appendChild(select);
		}
		
		// Resize event listener to resize image and recenter on change
		addEvent(window, 'resize', function(e){
			resize();
		});
		
		// Handles Arrow keys
		addEvent(window, 'keydown', function(e){
			// Left key
			if(e.keyCode == 37){ 
				switchPreviousSlide();
				e.preventDefault();
				return false;
			}
			// Right key
			if(e.keyCode == 39){
				switchNextSlide();
				e.preventDefault();
				return false;
			}
			
		});
		
		if(startOnLoad){
			startShow();
		}
	}
	
	function addEvent(object,listener, callback){
		if(object.addEventListener){
			object.addEventListener(listener, callback);
		} else {
			object.attachEvent("on" + listener, callback);
		}
	}
	// Inverts color of bar
	function invertBar(color){
		var icolor;
		color = color.substring(1);
		icolor = parseInt(color, 16);
		icolor = 0xFFFFFF ^ icolor; 
		icolor = icolor.toString(16);
		icolor = ("000000" + icolor).slice(-6)
		color = "#" + color;
		icolor = "#" + icolor;
		
		var els = Array(slideBarEl, titleEl, descEl);
		for(var i = 0;els.length > i; i++){
			var style = els[i].style;
			style.webkitTransitionDuration =
			style.MozTransitionDuration =
			style.msTransitionDuration =
			style.OTransitionDuration =
			style.transitionDuration = '500ms';

			style.webkitTranstion =
			style.msTranstion =
			style.MozTranstion =
			style.OTranstion = 'color 0.5s, background 0.5s';
		}
		slideBarEl.style.background = rgb(color, 0.6);
		completeEl.style.background = icolor;
		titleEl.style.color = icolor;
		descEl.style.color = icolor;
		
		if(typeof navArrowEls != "undefined"){
			for(var i = 0;navArrowEls.length > i;i++){
				navArrowEls[i].style.background = rgb(color, 0.6);
			}
		}
		
		
		function rgb(hex, alpha){
			var r = parseInt(hex.substring(1, 3), 16);
			var g = parseInt(hex.substring(3, 5), 16);
			var b = parseInt(hex.substring(5, 7), 16);
			return "rgba(" + r + ", " + g + ", " + b + ", " + alpha + ")";
		}
	}
	
	// Starts slideshow after init
	//TODO add check if initated
	function startShow(){
		if(typeof slideOnload != "undefined") slideOnload();
		//resize();
		switchNextSlide();
		updateComplete();
	}
	
	// Switches to next slide
	function switchNextSlide(){
		switchSlide(getNextSlide());
	}
	
	// Gets next slide object
	function getNextSlide(){
		if(!random)
			return slides[(curSlide+1) % total];
		else {
			var id = Math.floor(Math.random()*total);
			slideHistory.push(id);
			return slides[id];
		}
	}
	
	// Switches to previous slide
	function switchPreviousSlide(){
		switchSlide(getPreviousSlide());
	}
	
	// Gets previous slide object
	function getPreviousSlide(){
		if(random){
			var next = slideHistory[slideHistory.length - 1];
			if(typeof next != "undefined")
				return slides[next];
			else
				return getNextSlide();
		}
		if(curSlide == 0)
			return slides[total - 1];
		else
			return slides[(curSlide-1) % total];
	}
	
	// Switches image based on ID
	function switchSlide(slide){
		if(typeof slide == "undefined"){
			error("No slide found");
		}
		debug("Image: " + slide.id);
		debug("Previous Image: " + curSlide);
		previousSlide = curSlide; // Sets previous slide id
		curSlide = slide.id; // Sets new slide id
		
		// Handles slide animation with direction
		if(transition.indexOf("slide") != -1){
			var distance = curSlide - previousSlide;
			debug("slide");
			// going from max to zero
			if(Math.abs(distance) == slides.length - 1){
				if(distance > 0){
					transition = "slide-left";
				} else {
					transition = "slide-right";
				}
			} else {			
				if(distance < 0){
					transition = "slide-left";
				} else {
					transition = "slide-right";
				}
			}
		}
		
		if(selectorNav){
			selectors[previousSlide].element.firstChild.className = "photo-button"; // Resets old slide selector button
			selectors[curSlide].element.firstChild.className += " photo-button-active"; // Sets new selector button
		}
		animate(transition,slide, function(){
			invertBar(slide.invert);
			switchText(slide);			
			// Sets descEl offsetWidth for "hide on small" event
			var descBChange = descEl.style.display; // Before we change display, get content
			descEl.style.display = "";
			descOffset = descEl.offsetWidth;
			descEl.style.display = descBChange; // Reset previous content
		});
	}
	
	// Switches text based on ID
	function switchText(slide){
		linkEl.href = slide.link;
		if(typeof slide.title == "undefined")
			slide.title = "";
		if(typeof slide.desc == "undefined")
			slide.desc = "";
	
		titleEl.innerHTML = slide.title;
		descEl.innerHTML = slide.desc;
	}
	
	// Holds different transitions
	function animate(mode, slide, callback){
		var speed = 1000; // default animation speed;
		var previous = slides[previousSlide].style;
		var style = slide.style;
		style.display = "";
		console.log(easing);
		TWEEN.removeAll();
		if(typeof curTimer != "undefined") curTimer.stop();
		curTimer = new Timer(switchNextSlide, defaultInterval);
		if(typeof callback != "undefined") callback();
		resize();
			
		switch(mode){
			case "fade":
				style.opacity = 0; // Next image opacity
				style.zIndex = 0;
				console.log("TWEEN START");
				var tween = new TWEEN.Tween({x: 0})
					.to( {x: 100}, speed) 
					.easing( easing )
					.onUpdate(function(){
						style.opacity = this.x/100;
					})
					.onComplete(function(){
						hideAllSlides(slide.id);
						style.zIndex = -5;
						console.log("TWEEN END");
					})
					.start();
			
				animateTween();
			break;
			case "slide-right":
				style.zIndex = 0;
				
				// dirty hack for placing images off screen (2*)
				var margin = (2 * (width + (width - ((width / slide.width) * slide.style.zoom))) * -1);
				style.marginLeft = margin + "px";
				
				console.log("TWEEN START");
				var tween = new TWEEN.Tween({x: margin})
					.to( {x: 0}, speed) 
					.easing( easing )
					.onUpdate(function(){
						style.marginLeft = this.x + "px";
					})
					.onComplete(function(){
						hideAllSlides(slide.id);
						style.zIndex = -5;
						console.log("TWEEN END");
					})
					.start();
			
				animateTween();
				
			break;
			case "slide-left":
				style.zIndex = 0;
				
				// dirty hack for placing images off screen (2*)
				var margin = (2 * (width + (width - ((width / slide.width) * slide.style.zoom))));
				style.marginLeft = margin + "px";
				
				console.log("TWEEN START");
				var tween = new TWEEN.Tween({x: margin})
					.to( {x: 0}, speed) 
					.easing( TWEEN.Easing.Quadratic.InOut )
					.onUpdate(function(){
						style.marginLeft = this.x + "px";
					})
					.onComplete(function(){
						hideAllSlides(slide.id);
						style.zIndex = -5;
						console.log("TWEEN END");
					})
					.start();
			
				animateTween();
				
			break;
			default:
				error("No transition found");
			break;
		}
		
		function animateTween(){
			requestAnimFrame(animateTween);
			TWEEN.update();
		}
	}
	
	// Centers/zooms image with aspect ratio
	function centerImage(slide){
		var slide;
		var iheight = height;
		var iwidth = width;
		
		if(typeof arguments[0] != "undefined")
			slide = arguments[0];
		if(typeof arguments[1] != "undefined")
			iwidth = arguments[1];
		if(typeof arguments[2] != "undefined")
			iheight = arguments[2];
			
		var style = slide.style;
		var widthRatio = slide.width / iwidth;
		var heightRatio = slide.height / iheight;
		var zoom = 0;
		var top = 0;
		var left = 0;
		if(widthRatio > heightRatio) {
			zoom = (iheight / slide.height);
			
		} else {
			zoom = (iwidth / slide.width);
		}
		top = (iheight - zoom * slide.height)/2;
		left = (iwidth - zoom * slide.width)/2;
		
		if(!css3){
			style.zoom = zoom;
		} else {
			
			// css3 zoom
			style.transform
			= style.OTransform
			= style.webkitTransform
			= style.MozTransform = "scale(" + zoom + ")";
			
			style.transformOrigin
			= style.OTransformOrigin
			= style.webkitTransformOrigin
			= style.MozTransformOrigin = "0 0";
		}
		
		style.top = top + "px";
		style.left = left + "px";
		debug("Resize {Zoom: " + zoom + ", Left: " + left + ", Top: " + top + "}");
	}
	
	function hideAllSlides(exclude){
		if(typeof exclude == "undefined"){
			exclude = "nope";
		}
		for(var i = 0;total > i;i++){
			if(i != exclude){
				slides[i].style.display = "none";
			}
		}
	}
	
	// updates complete object
	function updateComplete(){
		if(typeof curTimer != "undefined")
			completeEl.style.width = curTimer.getRemainingTime()/(defaultInterval/slideBarEl.offsetWidth) + "px";
		setTimeout(updateComplete, 5);
	}
	
	function getWindowSize(){
		var w, d, e, g;
		
		if(!matchWindow){
			w = slideShowEl.parentNode,
			d = slideShowEl.parentNode, 
			e = slideShowEl.parentNode,
			g = slideShowEl.parentNode;
		} else {
			w = window,
			d = document,
			e = d.documentElement,
			g = d.getElementsByTagName('body')[0];
		}	

		x = w.innerWidth || e.clientWidth || g.clientWidth,
		y = w.innerHeight|| e.clientHeight|| g.clientHeight;
		return {"x": x, "y": y};
	}
	
	function error(text){
		throw "SlideShow: " + text;
	}
	
	function debug(text){
		if(debugM){
			console.log("DEBUG SlideShow: "+ text);
		}
	}
	
	/* Public Functions */
	
	this.addSlide = function(){
		if(arguments.length < 0){
			error("No slides to add");
			return 0;
		}
		total = arguments.length;
		if(typeof curSlide == "undefined") {
			curSlide = total - 1;
			previousSlide = total - 1;
		}
		
		for(var i = 0;arguments.length > i;i++){
			// slide bar inversion processing
			var invert = "#000000";
			if(typeof arguments[i].invert != "undefined") invert = arguments[i].invert;
			slides.push(new Slide(i, arguments[i].img, arguments[i].title, arguments[i].link, arguments[i].desc, invert));
		}
	}
	
	this.start = function(){
		startShow();
	}
	
	this.next = function(){
		switchNextSlide();
	}
	
	this.previous = function(){
		switchPreviousSlide();
	}
	
	this.pause = function(){
		debug("pause");
		curTimer.stop();
	}
	
	this.resume = function(){
		debug("resume");
		curTimer.start();
	}
	
	this.init = function(){
		initiate(initObject);
		create();
	}
	
	/* Internal Objects */
	
	// Holds Slide Data
	function Slide(id, img, title, link, desc, invert){
		debug("Adding " + id + " to slides");
		/* Slide Variables */
		var width = 0; // Image width
		var height = 0; // Image height
		var style;
		var loaded = false;
		var obj = document.createElement("img"); // Image Object
			obj.className = "slide-image";
			obj.id = "slide-" + id;
			obj.onload = function(){
				slides[id].height = this.height;
				slides[id].width = this.width;
				slides[id].style = this.style;
				imageWrapperEl.appendChild(obj);
				debug("Image " + this.src + " loaded");
				slides[id].loaded = true
			}
			obj.src = img;
			obj.style.display = "none";
		
		/*  Public Slide Function variables */
		var removeAnimations;
		
		/* Public Slide Variables */
		this.id = id
		this.img = img;
		this.title = title;
		this.link = link;
		this.desc = desc;
		this.invert = invert;
		this.width = width;
		this.height = height;
		this.loaded = loaded;
		this.style = style;
		this.obj = obj;
		
		/* Public Slide Functions */
		
	}
	
	function Timer(call, interval){
		/* Timer Public Function Vars */
		var start;
		var stop;
		var pause;
		var getRemainingTime;
		
		/* Timer Vals */
		var startTime;
		var timerId;
		var isStopped = true;
		
		// Starts timer		
		function startTimer(){
			debug("Timer interval: " + interval);
			startTime = (new Date()).getTime();
			timerId = setTimeout(call, interval);
			isStopped = false;
		}
		
		// Stops timer
		function stopTimer(){
			if(!isStopped){
				interval = getTime();
				clearTimeout(timerId);
				isStopped = true;
			}
		}
		
		function getTime(){
			if(isStopped) return interval;
			return (interval-((new Date()).getTime()-startTime))
		}
		
		/* Public Timer Functions */
		this.start = function(){
			startTimer();
		}
		
		this.stop = function(){
			stopTimer();
		}
		
		this.getRemainingTime = function(){
			return getTime();
		}
		
		// Starts
		startTimer();
	}
}

/* TWEEN */

/**
 * @author sole / http://soledadpenades.com
 * @author mrdoob / http://mrdoob.com
 * @author Robert Eisele / http://www.xarg.org
 * @author Philippe / http://philippe.elsass.me
 * @author Robert Penner / http://www.robertpenner.com/easing_terms_of_use.html
 * @author Paul Lewis / http://www.aerotwist.com/
 * @author lechecacharro
 * @author Josh Faul / http://jocafa.com/
 * @author egraether / http://egraether.com/
 * @author endel / http://endel.me
 * @author Ben Delarre / http://delarre.net
 */

// Date.now shim for (ahem) Internet Explo(d|r)er
if ( Date.now === undefined ) {
	Date.now = function (){
		return new Date().valueOf();
	};
}

var TWEEN = TWEEN || ( function () {
	var _tweens = [];
	return {
		REVISION: '12',
		getAll: function () {
			return _tweens;
		},
		removeAll: function () {
			_tweens = [];
		},
		add: function ( tween ) {
			_tweens.push( tween );
		},
		remove: function ( tween ) {
			var i = _tweens.indexOf( tween );
			if ( i !== -1 ) {
				_tweens.splice( i, 1 );
			}
		},
		update: function ( time ) {
			if ( _tweens.length === 0 ) return false;
			var i = 0;
			time = time !== undefined ? time : ( typeof window !== 'undefined' && window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now() );
			while ( i < _tweens.length ) {
				if ( _tweens[ i ].update( time ) ) {
					i++;
				} else {
					_tweens.splice( i, 1 );
				}
			}
			return true;
		}
	};
} )();

TWEEN.Tween = function ( object ) {
	var _object = object;
	var _valuesStart = {};
	var _valuesEnd = {};
	var _valuesStartRepeat = {};
	var _duration = 1000;
	var _repeat = 0;
	var _yoyo = false;
	var _isPlaying = false;
	var _reversed = false;
	var _delayTime = 0;
	var _startTime = null;
	var _easingFunction = TWEEN.Easing.Linear.None;
	var _interpolationFunction = TWEEN.Interpolation.Linear;
	var _chainedTweens = [];
	var _onStartCallback = null;
	var _onStartCallbackFired = false;
	var _onUpdateCallback = null;
	var _onCompleteCallback = null;

	// Set all starting values present on the target object
	for ( var field in object ) {
		_valuesStart[ field ] = parseFloat(object[field], 10);
	}
	
	this.to = function ( properties, duration ) {
		if ( duration !== undefined ) {
			_duration = duration;
		}
		_valuesEnd = properties;
		return this;
	};
	
	this.start = function ( time ) {
		TWEEN.add( this );
		_isPlaying = true;
		_onStartCallbackFired = false;
		_startTime = time !== undefined ? time : ( typeof window !== 'undefined' && window.performance !== undefined && window.performance.now !== undefined ? window.performance.now() : Date.now() );
		_startTime += _delayTime;
		for ( var property in _valuesEnd ) {
			// check if an Array was provided as property value
			if ( _valuesEnd[ property ] instanceof Array ) {
				if ( _valuesEnd[ property ].length === 0 ) {
					continue;
				}
				// create a local copy of the Array with the start value at the front
				_valuesEnd[ property ] = [ _object[ property ] ].concat( _valuesEnd[ property ] );
			}
			_valuesStart[ property ] = _object[ property ];
			if( ( _valuesStart[ property ] instanceof Array ) === false ) {
				_valuesStart[ property ] *= 1.0; // Ensures we're using numbers, not strings
			}
			_valuesStartRepeat[ property ] = _valuesStart[ property ] || 0;
		}
		return this;
	};

	this.stop = function () {
		if ( !_isPlaying ) {
			return this;
		}
		TWEEN.remove( this );
		_isPlaying = false;
		this.stopChainedTweens();
		return this;
	};

	this.stopChainedTweens = function () {
		for ( var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++ ) {
			_chainedTweens[ i ].stop();
		}
	};

	this.delay = function ( amount ) {
		_delayTime = amount;
		return this;
	};

	this.repeat = function ( times ) {
		_repeat = times;
		return this;
	};

	this.yoyo = function( yoyo ) {
		_yoyo = yoyo;
		return this;
	};

	this.easing = function ( easing ) {
		_easingFunction = easing;
		return this;
	};
	
	this.interpolation = function ( interpolation ) {
		_interpolationFunction = interpolation;
		return this;
	};

	this.chain = function () {
		_chainedTweens = arguments;
		return this;
	};

	this.onStart = function ( callback ) {
		_onStartCallback = callback;
		return this;
	};

	this.onUpdate = function ( callback ) {
		_onUpdateCallback = callback;
		return this;
	};

	this.onComplete = function ( callback ) {
		_onCompleteCallback = callback;
		return this;
	};

	this.update = function ( time ) {
		var property;
		if ( time < _startTime ) {
			return true;
		}
		if ( _onStartCallbackFired === false ) {
			if ( _onStartCallback !== null ) {
				_onStartCallback.call( _object );
			}
			_onStartCallbackFired = true;
		}
		var elapsed = ( time - _startTime ) / _duration;
		elapsed = elapsed > 1 ? 1 : elapsed;
		var value = _easingFunction( elapsed );
		for ( property in _valuesEnd ) {
			var start = _valuesStart[ property ] || 0;
			var end = _valuesEnd[ property ];
			if ( end instanceof Array ) {
				_object[ property ] = _interpolationFunction( end, value );
			} else {
                // Parses relative end values with start as base (e.g.: +10, -3)
				if ( typeof(end) === "string" ) {
					end = start + parseFloat(end, 10);
				}
				// protect against non numeric properties.
                if ( typeof(end) === "number" ) {
					_object[ property ] = start + ( end - start ) * value;
				}
			}
		}
		if ( _onUpdateCallback !== null ) {
			_onUpdateCallback.call( _object, value );
		}
		if ( elapsed == 1 ) {
			if ( _repeat > 0 ) {
				if( isFinite( _repeat ) ) {
					_repeat--;
				}
				// reassign starting values, restart by making startTime = now
				for( property in _valuesStartRepeat ) {
					if ( typeof( _valuesEnd[ property ] ) === "string" ) {
						_valuesStartRepeat[ property ] = _valuesStartRepeat[ property ] + parseFloat(_valuesEnd[ property ], 10);
					}
					if (_yoyo) {
						var tmp = _valuesStartRepeat[ property ];
						_valuesStartRepeat[ property ] = _valuesEnd[ property ];
						_valuesEnd[ property ] = tmp;
						_reversed = !_reversed;
					}
					_valuesStart[ property ] = _valuesStartRepeat[ property ];
				}
				_startTime = time + _delayTime;
				return true;
			} else {
				if ( _onCompleteCallback !== null ) {
					_onCompleteCallback.call( _object );
				}
				for ( var i = 0, numChainedTweens = _chainedTweens.length; i < numChainedTweens; i++ ) {
					_chainedTweens[ i ].start( time );
				}
				return false;
			}
		}
		return true;
	};
};

TWEEN.Easing = {
	Linear: {
		None: function ( k ) {
			return k;
		}
	},
	
	Quadratic: {
		In: function ( k ) {
			return k * k;
		},
		Out: function ( k ) {
			return k * ( 2 - k );
		},
		InOut: function ( k ) {
			if ( ( k *= 2 ) < 1 ) return 0.5 * k * k;
			return - 0.5 * ( --k * ( k - 2 ) - 1 );
		}
	},
	
	Cubic: {
		In: function ( k ) {
			return k * k * k;
		},
		Out: function ( k ) {
			return --k * k * k + 1;
		},
		InOut: function ( k ) {
			if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k;
			return 0.5 * ( ( k -= 2 ) * k * k + 2 );
		}
	},
	
	Quartic: {
		In: function ( k ) {
			return k * k * k * k;
		},
		Out: function ( k ) {
			return 1 - ( --k * k * k * k );
		},
		InOut: function ( k ) {
			if ( ( k *= 2 ) < 1) return 0.5 * k * k * k * k;
			return - 0.5 * ( ( k -= 2 ) * k * k * k - 2 );
		}
	},
	
	Quintic: {
		In: function ( k ) {
			return k * k * k * k * k;
		},
		Out: function ( k ) {
			return --k * k * k * k * k + 1;
		},
		InOut: function ( k ) {
			if ( ( k *= 2 ) < 1 ) return 0.5 * k * k * k * k * k;
			return 0.5 * ( ( k -= 2 ) * k * k * k * k + 2 );
		}
	},

	Sinusoidal: {
		In: function ( k ) {
			return 1 - Math.cos( k * Math.PI / 2 );
		},
		Out: function ( k ) {
			return Math.sin( k * Math.PI / 2 );
		},
		InOut: function ( k ) {
			return 0.5 * ( 1 - Math.cos( Math.PI * k ) );
		}
	},

	Exponential: {
		In: function ( k ) {
			return k === 0 ? 0 : Math.pow( 1024, k - 1 );
		},
		Out: function ( k ) {
			return k === 1 ? 1 : 1 - Math.pow( 2, - 10 * k );
		},
		InOut: function ( k ) {
			if ( k === 0 ) return 0;
			if ( k === 1 ) return 1;
			if ( ( k *= 2 ) < 1 ) return 0.5 * Math.pow( 1024, k - 1 );
			return 0.5 * ( - Math.pow( 2, - 10 * ( k - 1 ) ) + 2 );
		}
	},

	Circular: {
		In: function ( k ) {
			return 1 - Math.sqrt( 1 - k * k );
		},
		Out: function ( k ) {
			return Math.sqrt( 1 - ( --k * k ) );
		},
		InOut: function ( k ) {
			if ( ( k *= 2 ) < 1) return - 0.5 * ( Math.sqrt( 1 - k * k) - 1);
			return 0.5 * ( Math.sqrt( 1 - ( k -= 2) * k) + 1);
		}
	},

	Elastic: {
		In: function ( k ) {
			var s, a = 0.1, p = 0.4;
			if ( k === 0 ) return 0;
			if ( k === 1 ) return 1;
			if ( !a || a < 1 ) { a = 1; s = p / 4; }
			else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
			return - ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
		},
		Out: function ( k ) {
			var s, a = 0.1, p = 0.4;
			if ( k === 0 ) return 0;
			if ( k === 1 ) return 1;
			if ( !a || a < 1 ) { a = 1; s = p / 4; }
			else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
			return ( a * Math.pow( 2, - 10 * k) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) + 1 );
		},
		InOut: function ( k ) {
			var s, a = 0.1, p = 0.4;
			if ( k === 0 ) return 0;
			if ( k === 1 ) return 1;
			if ( !a || a < 1 ) { a = 1; s = p / 4; }
			else s = p * Math.asin( 1 / a ) / ( 2 * Math.PI );
			if ( ( k *= 2 ) < 1 ) return - 0.5 * ( a * Math.pow( 2, 10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) );
			return a * Math.pow( 2, -10 * ( k -= 1 ) ) * Math.sin( ( k - s ) * ( 2 * Math.PI ) / p ) * 0.5 + 1;
		}
	},

	Back: {
		In: function ( k ) {
			var s = 1.70158;
			return k * k * ( ( s + 1 ) * k - s );
		},
		Out: function ( k ) {
			var s = 1.70158;
			return --k * k * ( ( s + 1 ) * k + s ) + 1;
		},
		InOut: function ( k ) {
			var s = 1.70158 * 1.525;
			if ( ( k *= 2 ) < 1 ) return 0.5 * ( k * k * ( ( s + 1 ) * k - s ) );
			return 0.5 * ( ( k -= 2 ) * k * ( ( s + 1 ) * k + s ) + 2 );
		}
	},

	Bounce: {
		In: function ( k ) {
			return 1 - TWEEN.Easing.Bounce.Out( 1 - k );
		},
		Out: function ( k ) {
			if ( k < ( 1 / 2.75 ) ) {
				return 7.5625 * k * k;
			} else if ( k < ( 2 / 2.75 ) ) {
				return 7.5625 * ( k -= ( 1.5 / 2.75 ) ) * k + 0.75;
			} else if ( k < ( 2.5 / 2.75 ) ) {
				return 7.5625 * ( k -= ( 2.25 / 2.75 ) ) * k + 0.9375;
			} else {
				return 7.5625 * ( k -= ( 2.625 / 2.75 ) ) * k + 0.984375;
			}
		},
		InOut: function ( k ) {
			if ( k < 0.5 ) return TWEEN.Easing.Bounce.In( k * 2 ) * 0.5;
			return TWEEN.Easing.Bounce.Out( k * 2 - 1 ) * 0.5 + 0.5;
		}
	}
};

TWEEN.Interpolation = {
	Linear: function ( v, k ) {
		var m = v.length - 1, f = m * k, i = Math.floor( f ), fn = TWEEN.Interpolation.Utils.Linear;
		if ( k < 0 ) return fn( v[ 0 ], v[ 1 ], f );
		if ( k > 1 ) return fn( v[ m ], v[ m - 1 ], m - f );
		return fn( v[ i ], v[ i + 1 > m ? m : i + 1 ], f - i );
	},
	Bezier: function ( v, k ) {
		var b = 0, n = v.length - 1, pw = Math.pow, bn = TWEEN.Interpolation.Utils.Bernstein, i;
		for ( i = 0; i <= n; i++ ) {
			b += pw( 1 - k, n - i ) * pw( k, i ) * v[ i ] * bn( n, i );
		}
		return b;
	},
	CatmullRom: function ( v, k ) {
		var m = v.length - 1, f = m * k, i = Math.floor( f ), fn = TWEEN.Interpolation.Utils.CatmullRom;
		if ( v[ 0 ] === v[ m ] ) {
			if ( k < 0 ) i = Math.floor( f = m * ( 1 + k ) );
			return fn( v[ ( i - 1 + m ) % m ], v[ i ], v[ ( i + 1 ) % m ], v[ ( i + 2 ) % m ], f - i );
		} else {
			if ( k < 0 ) return v[ 0 ] - ( fn( v[ 0 ], v[ 0 ], v[ 1 ], v[ 1 ], -f ) - v[ 0 ] );
			if ( k > 1 ) return v[ m ] - ( fn( v[ m ], v[ m ], v[ m - 1 ], v[ m - 1 ], f - m ) - v[ m ] );
			return fn( v[ i ? i - 1 : 0 ], v[ i ], v[ m < i + 1 ? m : i + 1 ], v[ m < i + 2 ? m : i + 2 ], f - i );
		}
	},
	Utils: {
		Linear: function ( p0, p1, t ) {
			return ( p1 - p0 ) * t + p0;
		},
		Bernstein: function ( n , i ) {
			var fc = TWEEN.Interpolation.Utils.Factorial;
			return fc( n ) / fc( i ) / fc( n - i );
		},
		Factorial: ( function () {
			var a = [ 1 ];
			return function ( n ) {
				var s = 1, i;
				if ( a[ n ] ) return a[ n ];
				for ( i = n; i > 1; i-- ) s *= i;
				return a[ n ] = s;
			};
		} )(),
		CatmullRom: function ( p0, p1, p2, p3, t ) {
			var v0 = ( p2 - p0 ) * 0.5, v1 = ( p3 - p1 ) * 0.5, t2 = t * t, t3 = t * t2;
			return ( 2 * p1 - 2 * p2 + v0 + v1 ) * t3 + ( - 3 * p1 + 3 * p2 - 2 * v0 - v1 ) * t2 + v0 * t + p1;
		}
	}
};

window.requestAnimFrame = (function(){
	return  window.requestAnimationFrame	||
	window.webkitRequestAnimationFrame 		||
	window.mozRequestAnimationFrame    		||
	function( callback ){
		window.setTimeout(callback, 1000 / 60);
	};
})();