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
	var pause;
	var resume;
	
	/* User Vars (Defaults); */
	var startOnLoad = true; // Start once SlideShow has loaded
	var pre_load = false; // Pre-load images
	var random = false; // Progress through slides randomly
	var defaultInterval = 10000; // Default in MS (10 seconds);
	var hoverPuase = true; // Pause when hovered over image
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
	var slidesLoaded = "";
	var curSlide = 0; // Current Slide;
	var curTimer;
	
	/* Element Vars */
	var slideShowEl; // SlideShow Element Object
	var linkEl;
	var imageEl;
	var completeEl;
	var titleEl;
	var descEl;
	var selectEl;
	var slideBarEl;
	
	/* Private Functions */
	function initiate(arguments){
		console.log(arguments);
		if(initiated){
			return 0;
		}
		// Collects init data from anonymous object
		if(typeof arguments.element != "undefined"){
			slideShowEl = document.getElementById(arguments.element);
		} else {
			slideShowEl = document.getElementById("slideshow");
		}
		if(typeof arguments.pre_load != "undefined"){
			pre_load = arguments.pre_load;
		}
		if(typeof arguments.random != "undefined"){
			random = arguments.random;
		}
		if(typeof arguments.interval != "undefined"){
			defaultInterval = arguments.interval;
		}
		if(typeof arguments.hover_pause != "undefined"){
			hoverPause = arguments.hover_pause;
		}
		if(typeof arguments.transition != "undefined"){
			transition = arguments.transition;
		}
		if(typeof arguments.hover_preview != "undefined"){
			hoverPreview = arguments.hover_preview;
		}
		if(typeof arguments.hover_text != "undefined"){
			hoverText = arguments.hover_text;
		}
		if(typeof arguments.height != "undefined"){
			height = arguments.height;
		}
		if(typeof arguments.width != "undefined"){
			width = arguments.width;
		}
		if(typeof arguments.startOnLoad != "undefined"){
			startOnLoad = arguments.startOnLoad;
		}
		if(typeof arguments.debug != "undefined"){
			debugM = arguments.debug;
		}
		if(typeof arguments.onload != "undefined"){
			slideOnload = arguments.onload;
		}
		debug("init");
		initiated = false;
	}
	
	function create(){
		// Error checking for empty slides
		if(slides.length < 1){
			error("function create: no slides loaded, cannot create slideshow DOM objects");
			return 0;
		}
		
		slideShowEl.className = "slide-container";
		
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
		
		imageEl = document.createElement("img");
			imageEl.id = "slide-image";
			imageEl.width = width;
			imageEl.height = height;
		linkEl.appendChild(imageEl);
		
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
		if(startOnLoad){
			this.start();
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
		
		style.webkitTransitionDuration =
		style.MozTransitionDuration =
		style.msTransitionDuration =
		style.OTransitionDuration =
		style.transitionDuration = '500ms';

		style.webkitTranstion =
		style.msTranstion =
		style.MozTranstion =
		style.OTranstion = 'color 0.5s, background 0.5s';
		
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
	
	function preLoadImages(){
		if(!pre_load){
			return 0;
		}
		for(var i = 0;total > i;i++){
			var preLoadImg = new Image();
			preLoadImg.onload = function(){
				debug("Image " + this.src + " was preloaded.");
			}
			preLoadImg.src = slides[i].img;
		}
	}
	
	function nextImage(){
		if(!random){
			switchImage((curSlide+1) % total);
		} else {
			switchImage(Math.floor(Math.random()*total));
		}
	}
	
	function prevImage(){
	
	}
	
	// Switches image based on ID
	function switchImage(id){
		debug("Image: " + id);
		if(id > slides.length){
			error("No slide found");
		}
		var next = slides[id];
		curSlide = id;
		invertBar(next.invert);
		switchText(id);
		animate(transition, id, undefined);
		
	}
	
	// Switches text based on ID
	function switchText(id){
		var next = slides[id];
		linkEl.href = next.link;
		titleEl.innerHTML = next.title;
		descEl.innerHTML = next.desc;
	}
	
	// Holds different transitions
	function animate(mode, id, callback){
		var speed = 500; // default animation speed
		switch(mode){
			case "fade":
				//imageEl.className += " transitionFade";
				style = imageEl.style;
				style.opacity = 0;
				style.webkitTransitionDuration =
				style.MozTransitionDuration =
				style.msTransitionDuration =
				style.OTransitionDuration =
				style.transitionDuration = speed + 'ms';

				style.webkitTranstion =
				style.msTranstion =
				style.MozTranstion =
				style.OTranstion = 'opacity 0.5s';
				animateFinish = function(){
					imageEl.style.opacity = 100;
				}
			break;
			case "slide":
			
			break;
			default:
				error("No transition found");
			break;
		}
		setTimeout(function(){
			imageEl.src = slides[id].img;	
			if(typeof curTimer != "undefined") curTimer.stop();
			curTimer = new Timer(nextImage, defaultInterval);
			if(typeof animateFinish != "undefined") animateFinish();
		}, speed);
		//callback();
	}
	
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
		for(var i = 0;arguments.length > i;i++){
			var invert = "#000000";
			if(typeof arguments[i].invert != "undefined") invert = arguments[i].invert;
			slides.push(new Slide(i, arguments[i].img, arguments[i].title, arguments[i].link, arguments[i].desc, invert));
		}
		total = slides.length;
		preLoadImages();
	}
	
	this.start = function(){
		if(typeof slideOnload != "undefined") slideOnload();
		switchImage(curSlide);
		updateComplete();
	}
	
	this.next = function(){
		nextImage();
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
	function Slide(id, img, title, link, desc, invert){
		this.id = id
		this.img = img;
		this.title = title;
		this.link = link;
		this.desc = desc;
		this.invert = invert;
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