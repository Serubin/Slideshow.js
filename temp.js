/* 
 * Photo SlideShow
 * Author: Solomon Rubin, Serubin.net
 * Version: 2.0
 * 
 * Do not distribute.
 */
 
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
	var transition = "fade"; // TODO create different transitions
	var hoverPreview = true; // Image preview on selector dots
	var hoverText = "Click for more!"; // Text displayed when hovered over slide
	var height = 550; // Default frame size
	var width = 925; // Default frame size
	var debugM = false; // debug messages are false by default
	var slideOnload = undefined;
	
	/* Script Vars */
	var initiated = false;
	var slides = new Array();
	var selectors = new Array();
	var slidesLoaded = false;
	var curSlide = 0; // Current Slide;
	var curTimer;
	var slideHistory = new Array();
	
	/* Element Vars */
	var slideShowEl; // SlideShow Element Object
	var linkEl;
	var imageEl;
	var completeEl;
	var titleEl;
	var descEl;
	var selectEl;
	var slideBarEl;
	var imageWrapperEl;
	
	// Created early for slide loading
	imageWrapperEl = document.createElement("div");
		imageWrapperEl.id = "slide-image-wrapper";
		imageWrapperEl.style.width = width;
		imageWrapperEl.style.height = height;
	
	/* Private Functions */
	function initiate(options){
		console.log(options);
		// Collects init data from anonymous object
		if(typeof options.element != "undefined"){
			slideShowEl = document.getElementById(options.element);
		} else {
			slideShowEl = document.getElementById("slideshow");
		}
		if(typeof options.pre_load != "undefined"){
			pre_load = options.pre_load;
		}
		if(typeof options.random != "undefined"){
			random = options.random;
		}
		if(typeof options.interval != "undefined"){
			defaultInterval = options.interval;
		}
		if(typeof options.hover_pause != "undefined"){
			hoverPause = options.hover_pause;
		}
		if(typeof options.transition != "undefined"){
			transition = options.transition;
		}
		if(typeof options.hover_preview != "undefined"){
			hoverPreview = options.hover_preview;
		}
		if(typeof options.hover_text != "undefined"){
			hoverText = options.hover_text;
		}
		if(typeof options.height != "undefined"){
			if(options.height == "auto"){
				height = getWindowSize().y;
			} else {
				height = options.height;
			}
		}
		if(typeof options.width != "undefined"){
			if(options.width == "auto"){
				width = getWindowSize().x;
			} else {
				width = options.width;
			}
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
		initiated = true;
		debug("Initiated");
	}
	
	function resize(){
		width = getWindowSize().x;
		height = getWindowSize().y;
		slideShowEl.style.width = width + "px";
		slideShowEl.style.height = height + "px";
		imageWrapperEl.style.width = width + "px";
		imageWrapperEl.style.height = height + "px";
		centerImage(slides[curSlide]);
	}
	
	function create(){
		// Error checking for empty slides
		for(var i = 0;total > i;i++){
			if(typeof slides[i] == "undefined") {
				setTimeout(create, 5);
				return 0;
			}
		}
		console.log(slides);
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
		
		linkEl.addEventListener("mousemove", function(e){
			if(typeof curTimer != "undefined")
				curTimer.stop();
		});
		linkEl.addEventListener("mouseout", function(e){
			if(typeof curTimer != "undefined")
				curTimer.start();
		});
		
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
		
		// Creates selectors
		var select = document.createElement("ul");
			select.id = "select";
		
		for(var i = 0;total > i;i++){
			var li = document.createElement("li");
				li.className = "slide-li-photo-" + i;
			var a = document.createElement("a");
				a.href = "javascript:void(0);";
				a.className = "photo-button"
				a.id = "slide-photo-" + i;
				a.title = slides[i].title;
				a.addEventListener("click", function(){
					switchImage(this.id.parseInt());
				});
			li.appendChild(a);
			selectors.push({"id":i,"element":li});
			// Hover preview stuff
			if(hoverPreview){
				//TODO add hover preview stuff
				var span = document.createElement("span");
					span.className = "select-hover";
					span.style.display = "none";
				var img = document.createElement("img");
					img.src = slides[i].img;
					img.width = "200";
					img.height = "100";
				span.appendChild(img);
				li.appendChild(span);
				
				// Event listeners for mouse in and out
				span.addEventListener("mouseover", function(){
					this.style.display = "";
				});
				span.addEventListener("mouseout", function(){
					this.style.display = "none";
				});
			}
		}
		
		slideShowEl.appendChild(linkEl);
		slideShowEl.appendChild(slideBarEl);
		
		window.addEventListener('resize', function(e){
			resize();
		});
		if(startOnLoad){
			startShow();
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
		console.log(slides[0]);
		if(typeof slideOnload != "undefined") slideOnload();
		switchImage(curSlide);
		updateComplete();
	}
	
	// Switches to next slide
	function switchNextSlide(){
		switchImage(getNextSlide());
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
	function switchPreviousImage(){
		switchImage(getPreviousSlide());
	}
	
	// Gets previous slide object
	function getPrevousSlide(){
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
	function switchImage(slide){
		if(typeof slide == "undefined"){
			error("No slide found");
		}
		debug("Image: " + slide.id);
		curSlide = slide.id;
		invertBar(slide.invert);
		switchText(slide);
		animate(transition, slide, undefined);
		
	}
	
	// Switches text based on ID
	function switchText(slide){
		linkEl.href = slide.link;
		titleEl.innerHTML = slide.title;
		descEl.innerHTML = slide.desc;
	}
	
	// Holds different transitions
	function animate(mode, direction,slide, callback){
		var speed = 250; // default animation speed
		style = slide.style(); // imageEl Style
		switch(mode){
			case "fade":
				if(direction > 1)
					style.opacity = 0;
				else
					style.opacity = 100;
				style.webkitTransitionDuration =
				style.MozTransitionDuration =
				style.msTransitionDuration =
				style.OTransitionDuration =
				style.transitionDuration = speed + 'ms';

				style.webkitTranstion =
				style.msTranstion =
				style.MozTranstion =
				style.OTranstion = 'opacity' + (speed/1000)  +'s';
				animateFinish = function(){
					if(direction > 1)
						style.opacity = 100;
					else
						style.opacity = 0;
				}
			break;
			case "slide":
			
			break;
			default:
				error("No transition found");
			break;
		}
		setTimeout(function(){
			if(direction > 1) {
				centerImage(slide);
			}
			if(typeof curTimer != "undefined") curTimer.stop();
			curTimer = new Timer(nextImage, defaultInterval);
			if(typeof animateFinish != "undefined") animateFinish();
		}, speed);
	}
	
	// Centers/zooms image with aspect ratio
	function centerImage(slide){
		slide.removeAnimations();
		var style = slide.style();
		var widthRatio = slide.width / width;
		var heightRatio = slide.height / height;
		var zoom = 0;
		var top = 0;
		var left = 0;
		console.log(widthRatio > heightRatio);
		if(widthRatio > heightRatio) {
			zoom = (height / slide.height);
			
		} else {
			zoom = (width / slide.width);
		}
		debug("Zoom: " + zoom);
		debug("Visible picture: height - " + zoom * slide.height + " width - " + zoom * slide.width);
		top = (height - zoom * slides.height)/2;
		left = (width - zoom * slides.width)/2;
		style.zoom = zoom;
		style.top = top + "px";
	}
	
	// Remove image Animations
	
		
	// Sets new and old selectors to active and non active respectively
	function setActiveSelector(newId, curId){
		selectors[newId].element.firstChild.className += "photo-button-active";
		selectors[curId].element.firstChild.className = "photo-button";
	}
	
	// updates complete object
	function updateComplete(){
		if(typeof curTimer != "undefined")
			completeEl.style.width = curTimer.getRemainingTime()/(defaultInterval/slideBarEl.offsetWidth) + "px";
		setTimeout(updateComplete, 5);
	}
	
	function getWindowSize(){
		var w = window,
			d = document,
			e = d.documentElement,
			g = d.getElementsByTagName('body')[0],
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
		for(var i = 0;arguments.length > i;i++){
			// slide bar inversion processing
			var invert = "#000000";
			if(typeof arguments[i].invert != "undefined") invert = arguments[i].invert;
			console.log(i);
			new Slide(i, arguments[i].img, arguments[i].title, arguments[i].link, arguments[i].desc, invert,function(id){
				console.log(id);
				slides[id] = slide;
				console.log(slides[id]);
			});
		}
	}
	
	this.start = function(){
		startShow();
	}
	
	this.next = function(){
		switchNextImage();
	}
	
	this.previous = function(){
		switchPreviousImage();
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
		console.log(initObject);
		initiate(initObject);
		create();
	}
	
	/* Internal Objects */
	
	// Holds Slide Data
	function Slide(id, img, title, link, desc, invert, complete){
		console.log("Adding " + id + " to slides");
		/* Slide Variables */
		var width = 0; // Image width
		var height = 0; // Image height
		var loaded = false;
		var obj = document.createElement("img"); // Image Object
			obj.className = "slide-image";
			obj.id = "slide-" + id;
			obj.onload = function(){
				height =this. height;
				width = this.width;
				debug("Image " + this.src + " loaded");
				complete(id);
				loaded = true;
			}
		obj.src = img;
		imageWrapperEl.appendChild(obj);
		
		/*  Public Slide Function variables */
		var style;
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
		
		/* Public Slide Functions */
		this.style = function(){
			return obj.style;
		}
		this.removeAnimations = function() {
			// Transition Durations
			style.webkitTransitionDuration =
				style.MozTransitionDuration =
				style.msTransitionDuration =
				style.OTransitionDuration =
				style.transitionDuration = '';
			// Transform Duration
			style.webkitTransformDuration =
				style.MozTransformDuration =
				style.msTransformDuration =
				style.OTransformDuration =
				style.transformDuration = '';
			// Animation Duration
			style.webkitAnimationDuration =
				style.MozAnimationDuration =
				style.msAnimationDuration =
				style.OAnimationDuration =
				style.animationDuration = '';
			// Transitions
			style.webkitTranstion =
				style.msTranstion =
				style.MozTranstion =
				style.OTranstion = 
				style.transition = '';
			// Transforms
			style.webkitTransform =
				style.msTransform =
				style.MozTransform =
				style.OTransform = 
				style.transform = '';
			// Animations
			style.webkitAnimation =
				style.msAnimation =
				style.MozAnimation =
				style.OAnimation = 
				style.animation = '';
		}
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