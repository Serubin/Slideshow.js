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
	var transition = "fade"; // TODO create different transitions
	var selectorNav = false; // Selector navigation option
	var arrowNav = false; // Arrow navigation option
	var hoverPreview = true; // Image preview on selector dots
	var hoverText = "Click for more!"; // Text displayed when hovered over slide
	var height = 550; // Default frame size
	var autoH = false;
	var width = 925; // Default frame size
	var autoW = false;
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
		if(typeof options.startOnLoad != "undefined"){
			startOnLoad = options.startOnLoad;
		}
		if(typeof options.debug != "undefined"){
			debugM = options.debug;
		}
		if(typeof options.onload != "undefined"){
			slideOnload = options.onload;
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
			linkEl.addEventListener("mousemove", function(e){
				if(typeof curTimer != "undefined")
					curTimer.stop();
			});
			linkEl.addEventListener("mouseout", function(e){
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
				arrowLeft.addEventListener("click", function(e){
					switchPreviousSlide();
					e.preventDefault();
				});
			var arrowRight = document.createElement("a"); 
				arrowRight.className = "slide-arrow";
				arrowRight.id = "arrow-right";
				arrowRight.href = "javascript:void(0);";
				arrowRight.innerHTML = "Next";
				arrowRight.addEventListener("click", function(e){
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
					a.addEventListener("click", function(e){
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
					var img = document.createElement("img");
						img.src = slides[i].img;
						img.width = "200";
						img.height = "100";
					span.appendChild(img);
					li.appendChild(span);
					
					// Event listeners for mouse in and out
					a.addEventListener("mouseover", function(){
						this.nextSibling.style.display = "";
					});
					a.addEventListener("mouseout", function(){
						this.nextSibling.style.display = "none";
					});
				}
				select.appendChild(li);
			}
			slideShowEl.appendChild(select);
		}
		
		// Resize event listener to resize image and recenter on change
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
		titleEl.innerHTML = slide.title;
		descEl.innerHTML = slide.desc;
	}
	
	// Holds different transitions
	function animate(mode, slide, callback){
		var speed = 500; // default animation speed;
		var previous = slides[previousSlide].style;
		var style = slide.style;
		style.display = "";
		switch(mode){
			case "fade":
				style.opacity = 0; // Next image opacity
				// Animations for next image
				style.webkitTransitionDuration =
				style.MozTransitionDuration =
				style.msTransitionDuration =
				style.OTransitionDuration =
				style.transitionDuration = speed + 'ms';

				style.webkitTranstion =
				style.msTranstion =
				style.MozTranstion =
				style.OTranstion = 
				style.transition = 'opacity ' + (speed/1000)  +'s';

				previous.opacity = 0;
				
				animateFinish = function(){
					style.opacity = 100;
					// change for all otherslides
					hideAllSlides(slide.id);
				}
			break;
			case "slide":
				style.marginLeft = ((width + (width - ((height / slide.width) * slide.width))) * -1);
				
				style.webkitTransitionDuration =
				style.MozTransitionDuration =
				style.msTransitionDuration =
				style.OTransitionDuration =
				style.transitionDuration = speed + 'ms';

				style.webkitTranstion =
				style.msTranstion =
				style.MozTranstion =
				style.OTranstion = 
				style.transition = 'margin-left ' + (speed/1000)  +'s';
				
				//previous.marginLeft = width;
				animateFinish = function(){
					style.marginLeft = 0;
					hideAllSlides(slide.id);
				}
			break;
			default:
				error("No transition found");
			break;
		}
		setTimeout(function(){
			if(typeof animateFinish != "undefined") animateFinish();
			if(typeof curTimer != "undefined") curTimer.stop();
			curTimer = new Timer(switchNextSlide, defaultInterval);
			if(typeof callback != "undefined") callback();
			resize();
		}, (speed));
	}
	
	// Centers/zooms image with aspect ratio
	function centerImage(slide){
		var style = slide.style;
		var widthRatio = slide.width / width;
		var heightRatio = slide.height / height;
		var zoom = 0;
		var top = 0;
		var left = 0;
		if(widthRatio > heightRatio) {
			zoom = (height / slide.height);
			
		} else {
			zoom = (width / slide.width);
		}
		top = (height - zoom * slide.height)/2;
		left = (width - zoom * slide.width)/2;
		
		style.zoom = zoom;
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
		/* Public Slide Functions */
		this.removeAnimations = function() {
			var style = obj.style;
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