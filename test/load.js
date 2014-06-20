var slideshow;
function merp(){
	slideshow = new SlideShow({pre_load: true,width: "auto",height: "auto", match_window: true,transition: "slide", selector_nav: true, arrow_nav: true, easing: TWEEN.Easing.Bounce.EaseInOut, debug: true});
	slideshow.addSlide(
		{
			img:	'http://localhost/Serubin/picture/main/image-8.jpg',
			title:	'Main',
			link:	'/serunified/test/serubin.net/pictures/main',
			desc:	'These pictures are what are left of what I considered my \'Best\' pictures when I first started shooting. <br/> I\'ve since added several pictures...',
			invert: '#ffffff'
		},{
			img:	'http://localhost/Serubin/picture/boston/image-1.jpg',
			title:	'Boston',
			link:	'/serunified/test/serubin.net/pictures/boston',
			desc:	'These photos were taken in Boston Mass during a lesson a hands on lesson about patterns.<br/>The objective was to find natural patterns in the modern world...'
		},{
			img:	'http://localhost/Serubin/picture/great_falls/image-10.jpg',
			title:	'Great Falls',
			link:	'/serunified/test/serubin.net/pictures/great_falls',
			desc:	'These photos were taken in Great Falls Virginia on a trip to see my Aunt and Uncle. <br/>These were taken in my \'photographic youth\'...',
		},{
			img:	'http://localhost/Serubin/picture/cape_cod/image-1.jpg',
			title:	'Cape Cod',
			link:	'/serunified/test/serubin.net/pictures/cape_cod',
			desc:	'These photos were taken in Cape Cod. <br/> The focus of this set of photos was light...'
		},{
			img:	'http://localhost/Serubin/picture/dc_people/image-8.JPG',
			title:	'Dc People',
			link:	'/serunified/test/serubin.net/pictures/dc_people',
			desc:	'These photos were taken during a trip to DC. <br/>I focused on shooting on people, all candid shots...'
		},{
			img:	'../photos/cali.JPG',
			link:	'/serunified/test/serubin.net/pictures/dc_people',
			invert: '#ffffff'
		},{
			img:	'../photos/valve.JPG',
			title:	'Valves',
			link:	'/serunified/test/serubin.net/pictures/dc_people',
		}
	);
	
	slideshow.init();
}

window.onload = function(){merp()};