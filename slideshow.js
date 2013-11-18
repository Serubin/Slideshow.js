/* 
 * Photo SlideShow
 * Author: Solomon Rubin, Serubin.net
 * Version: 2.0
 * 
 * Do not distribute.
 */
 
function SlideShow(){
	/* Functions Vars */
	
	var addSlide;
	
	/* User Vars (Defaults); */
	var startOnLoad = true; // Start once SlideShow has loaded
	var pre_load = false; // Pre-load images
	var random = false; // Progress through slides randomly
	var defaultInterval = 10000; // Default in MS (10 seconds);
	var hoverPuase = true; // Pause when hovered over image
	var transition = "normal"; // TODO create different transitions
	var hoverPreview = true; // Image preview on selector dots
	var hoverText = "Click for more!"; // Text displayed when hovered over slide
	var height = 550; // Default frame size
	var width = 925; // Default frame size
	var debugM = false; // debug messages are false by default
	var onload;
	
	/* Script Vars */
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
	
	/* Private Functions */
	function initiate(arguments){
		// Collects init data from anonymous object
		if(typeof arguments[0].element != "undefined"){
			slideShowEl = document.getElementById(arguments[0].element);
		} else {
			slideShowEl = document.getElementById("slideshow");
		}
		if(typeof arguments[0].pre_load != "undefined"){
			pre_load = arguments[0].pre_load;
		}
		if(typeof arguments[0].random != "undefined"){
			random = arguments[0].random;
		}
		if(typeof arguments[0].interval != "undefined"){
			defaultInterval = arguments[0].interval;
		}
		if(typeof arguments[0].hover_pause != "undefined"){
			hoverPause = arguments[0].hover_pause;
		}
		if(typeof arguments[0].transition != "undefined"){
			transition = arguments[0].transition;
		}
		if(typeof arguments[0].hover_preview != "undefined"){
			hoverPreview = arguments[0].hover_preview;
		}
		if(typeof arguments[0].hover_text != "undefined"){
			hoverText = arguments[0].hover_text;
		}
		if(typeof arguments[0].height != "undefined"){
			height = arguments[0].height;
		}
		if(typeof arguments[0].width != "undefined"){
			width = arguments[0].width;
		}
		if(typeof arguments[0].startOnLoad != "undefined"){
			startOnLoad = arguments[0].startOnLoad;
		}
		if(typeof arguments[0].debug != "undefined"){
			debugM = arguments[0].debug;
		}
		if(typeof arguments[0].onload != "undefined"){
			onload = arguments[0].onload;
		}
		debug("init");
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
		imageEl = document.createElement("img");
			imageEl.id = "slide-image";
			imageEl.width = width;
			imageEl.height = height;
		linkEl.appendChild(imageEl);
		
		// Creates "meta" bar
		var bar = document.createElement("div");
			bar.id = "slide-bar";
		completeEl = document.createElement("div");
			completeEl.id = "slide-complete";
		bar.appendChild(completeEl);
		
		titleEl = document.createElement("div");
			titleEl.id = "slide-title";
		bar.appendChild(titleEl);
		
		descEl = document.createElement("div");
			descEl.id = "slide-desc";
		bar.appendChild(descEl);
		
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
		slideShowEl.appendChild(bar);
		if(startOnLoad){
			this.start();
		}
	}
	
	function preLoadImages(){
		for(var i = 0;total > i;i++){
			var preLoadImg = new Image();
			preLoadImg.onload = function(){
				debug("Image " + i + "was preloaded.");
			}
			preLoadImg.src = slides[i].img;
		}
	}
	
	function nextImage(){
		if(!random){
			switchImage((imageNum+1) % total);
		} else {
			switchImage(Math.floor(Math.random()*total));
		}
	}
	
	function prevImage(){
	
	}
	
	// Switches image based on ID
	function switchImage(id){
		if(id > slides.length){
			error("No slide found");
		}
		var next = slides[id];
		curSlide = id;
		
	}
	
	// Switches text based on ID
	function switchText(id){
		var next = slides[id];
		linkEl.href = next.link;
		titleEl.innerHTML = next.title;
		descEl.innerHMLT = next.desc;
	}
	
	// Holds different transitions
	function animate(mode, id, callback){
		switch(mode){
			case "fade":
			imageEl.className += " transitionFade";
			imageEl.style.opacity = 0;
			setTimeout(function(){
				imageEl.src = slides[id].img;
				imageEl.style.opacity = 100;
				
				curTimer.stop();
				curTimer = new Timer(nextImage(), defaultInterval);
				imageEl.className.replace(" transitionFade", "");
			}, 500);
			break;
			case "slide":
			
			break;
			default:
				error("No transition found");
			break;
		}
		callback();
	}
	
	// Sets new and old selectors to active and non active respectively
	function setActiveSelector(newId, curId){
		selectors[newId].element.firstChild.className += "photo-button-active";
		selectors[curId].element.firstChild.className = "photo-button";
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
			slides.push(new Slide(i, arguments[i].img, arguments[i].title, arguments[i].link, arguments[i].desc));
		}
		total = slides.length;
		create();
	}
	
	this.start = function(){
		onload();
		nextImage();
	}
	
	/* Internal Objects */
	
	// Holds Slide Data
	function Slide(id, img, title, link, desc){
		this.id = id
		this.img = img;
		this.title = title;
		this.link = link;
		this.desc = desc;
	}
	
	function Timer(call, interval){
		/* Timer Public Function Vars */
		var start;
		var stop;
		var pause;
		var getTime;
		
		/* Timer Vals */
		var startTime;
		var timerId;
		
		// Starts timer		
		function startTimer(){
			startTime = (new Date()).getTime();
			timerID = setTimeout(call, interval);
		}
		
		// Stops timer
		function stopTimer(){
			interval = this.getTime();
			clearTimeout(timerId);
		}
		
		/* Public Timer Functions */
		this.start = function(){
			startTimer();
		}
		
		this.stop = function(){
			stopTimer();
		}
		
		this.getTime = function(){
			return(interval-((new Date()).getTime()-startTime));
		}
		
		// Starts
		startTimer();
	}
	
	initiate(arguments);
}