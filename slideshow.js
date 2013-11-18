/* 
 * Serubin.net - Photo SlideShow
 * Author: Solomon Rubin
 * Version: 1.0
 * 
 * Do not distribute.
 */
//TODO add custom css. Custom image size. Custom interval. Custom HTML? Add other transitions!
 
//User set variables
var SlideShow = function(){
	var ssEl;
	var loadOnStart = true;
	var pre_load = false; 
	var random = false;
	var defaultInterval = 10000;
	var hoverPause = true;
	var preview = true;
	var transition = "normal";
	var onload;

	var initiated = false;
	var IE = false;
	var imageNum = 0;
	var images = new Array();
	var hovers = new Array();
	var total;
	var active = 0;
	var fadeCBT = 500;
	var width = 925;
	var height = 550;

	//Check IE
	if(navigator.appName.indexOf("Internet Explorer")!=-1){
		IE = true;
	}
	//End Check IE

	// Timer variables
	var interval;
	var timerID;
	var startTimeMS;
	var paused = false;
	/*
	 * Data Arrays, Processing, and Setup
	 */
	var dataLoad = false;
	return{
		pushData:function(){
			for(var i = 0;arguments.length > i;i++){
				images.push(new image(i, arguments[i].url, arguments[i].title, arguments[i].link, arguments[i].desc));
			}
			total = images.length;
			dataLoad = true;
		},
		init:function(){
			if(typeof arguments[0].element != "undefined"){
				ssEl = document.getElementById(arguments[0].element);
			} else {
				ssEl = document.getElementById("slideshow");
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
			if(typeof arguments[0].preview != "undefined"){
				preview = arguments[0].preview;
				console.log(arguments[0].preview);
			}
			if(typeof arguments[0].height != "undefined"){
				height = arguments[0].height;
			}
			if(typeof arguments[0].width != "undefined"){
				width = arguments[0].width;
			}
			if(typeof arguments[0].onload != "undefined"){
				onload = arguments[0].onload;
			}
			if(dataLoad){
				initiated = true;
				loadData();
				start();
			}
		},
		image:function(i){
			clearTimer();
			selectImage(i);
		},
		next:function(){
			switchImage(1)
		},
		prev:function(){
			switchImage(-1);
		},
		rand:function(){
			switchImage(1, images[(Math.floor(Math.random()*total))]);
		},
		pause:function(){
			pauseTimer();
		},
		resume:function(){
			resumeTimer();
		},
		isPaused:function(){
			return paused;
		}
	}
	
	function loadData(){
		total = images.length;
		imageNum = (total - 1);
		ssEl.innerHTML = "<a id='slide-link' title='Click for album!' href=''><img id='slideImg' src='" + images[0].url + "' width='" + width + "px' height='" + height + "px'/></a><div id='meta'><div id='complete' style='width:900px;'></div><div id='photo-title'></div><div id='photo-desc'></div><ul id='select'></ul></div>";
		displaySelect();
		return true;
	}

	// Pre-load images
	function preLoadImages(){
		
		var el = document.createElement("div");
		el.setAttribute("id", "preLoad");
		ssEl.appendChild(el);
		el = document.getElementById("preLoad");
		var img = "";
		for(var i = 0;total > i;i++){
			img += "<img src='"+images[i].url+"' style='display:none;'/> "
		}
		el.innerHTML = img;
	}

	// Creates button for display
	function displaySelect(){
		var string = "";
		for(var i = 0;total > i;i++){
			// Create dot selectors
			string += "<li id='li-photo-"+i+"'><a href='#"+i+"' title='"+images[i].title+"' class='photo-button' id='photo-"+i+"'onClick='javascript:SlideShow.image("+i+");'></a><span class='select-hover' style='display:none;'><img src='"+images[i].url+"' width='200' height='100'/></span></li>     ";
			hovers.push("li-photo-"+i+":"+i);
		}
		document.getElementById("select").innerHTML = string;
	}
	function selectHover(object, image){
		console.log("Creating new hover event");
		object.onmousemove = function(){openHover()};
		object.onmouseout = function(){closeHover()};
		function openHover(){
			console.log("Open hover called");
			object.getElementsByTagName("span")[0].style.display = "";
		}
		function closeHover(){
			console.log("Close hover called");
			object.getElementsByTagName("span")[0].style.display = "none";
		}
	}
	function checkIE(){
		if(!IE){
			document.getElementById("slideImg").className = "transition";
		} else {
			fadeCBT = 1;
		}
	}
	/*
	* End Data Arrays, Processing and Setup
	*/
 
	function image(id, url, title, link, desc){
		this.id = id
		this.url = url;
		this.title = title;
		this.link = link;
		this.desc = desc;
	}

	// Gets next image
	function getNextImage(){
		if(!random){
			imageNum = (imageNum+1) % total;
		} else {
			imageNum = Math.floor(Math.random()*total);
		}
		var new_image = images[imageNum];
		return new_image;
	}

	// Get prev image
	function getPrevImage(){
		if(imageNum == 0){
			imageNum = (total-1);
		} else {
			imageNum = (imageNum-1) % total;
		}
		var new_image = images[imageNum];
		return new_image;
	}

	function selectImage(image){
		imageNum = image;
		return switchImage(1, images[image]);
	}

	// Switches image on screen (with fade)
	function switchImage(dir){
		if(!dir){
			dir = 1;
		}
		var object = document.getElementById("slideImg");
		var next;
		if(arguments.length == 2){
			next = arguments[1];
		} else {
			if(dir < 1){
				next = getPrevImage();
			} else {
				next = getNextImage();
			}
		}
		console.log("Loading image " + next.title);
		object.style.opacity = 0; 
		setTimeout(function(){	
			object.src = next.url;
			document.getElementById("photo-title").innerHTML = next.title;
			document.getElementById("photo-desc").innerHTML = next.desc;
			document.getElementById("slide-link").href = next.link;
			object.style.opacity = 100;
			interval = defaultInterval
			var recur_call = switchImage;
			clearTimer();
			startTimer(recur_call, interval);
			setActive(next.id);
		}, fadeCBT);
	}

	function setActive(id){
		document.getElementById("photo-"+active).className = "photo-button";
		document.getElementById("photo-"+id).className += " photo-button-active";
		active = id;
	}
   /*
	* TIMER FUNCTIONS
	*/
	//TODO rewrite to use both timer ids and to be a variable function - object thingy
	// Starts timer
	function startTimer(recur_call, interval){
		startTimeMS = (new Date()).getTime();
		timerID = setTimeout(recur_call, interval);
	}
	// Pauses timer
	function pauseTimer(){
		if(!paused){
			interval = getRemainingTime();
			clearTimer();
			paused = true;
		}
	}

	// Resumes timer from pause location
	function resumeTimer(recur_call){
			startTimer(recur_call, interval);
			paused = false;
	}
	// Clears timer
	function clearTimer(){
		clearTimeout(timerID);
	}

	// Get remaining time on defualt timer
	function getRemainingTime(){
		return(interval-((new Date()).getTime()-startTimeMS));
	}

	// Displays time in a visual format
	function displayTime(){
		var timeR = getRemainingTime();
		if(!paused){
			document.getElementById("complete").style.width = (timeR/(defaultInterval/900) + "px");
		}
		setTimeout(displayTime, 10);
	}
	/*
	* SCRIPT START
	*/
	function start(){
		checkIE();
		if(!ssEl){
			console.error("SlideShow element specified, not found!");
		}
		if(initiated){
			if(pre_load){
				preLoadImages();
			}
			console.log(preview);
			if(preview){
				for(var i = 0;total > i;i++){
					var temp = hovers[i].split(":");
					hovers.push(new selectHover(document.getElementById(temp[0]),temp[1]));
				}
			}
			interval = defaultInterval;
			switchImage(1);
			displayTime();
			console.log("Page loaded and setup!");
			if(hoverPause){
				document.getElementById("slideImg").onmousemove = function(){pauseTimer();};
				document.getElementById("slideImg").onmouseout = function(){resumeTimer(switchImage);};
			}
			onload();
		}
	}
}();