<?php
require_once "C:/xampp/htdocs/Serunified/static/template/template.php";
$pg = new pageTemplate("master.html","http://localhost/serunified/static/");
$pg->setContent("TITLE","Photos");
$pg->setContent("HEAD","<link rel='stylesheet' href='http://localhost/serunified/static/slideshow/slideshow.css' type='text/css' /><script src='http://localhost/serunified/static/slideshow/slideshow.js'></script>
<script>
SlideShow.pushData({
url:	'http://localhost/Serubin/picture/main/image-1.jpg',
title:	'Main',
link:	'./main',
desc:	'These pictures are what are left of what I considered my \'Best\' pictures when I first started shooting. <br/> I\'ve since added several pictures...'
},{
url:	'http://localhost/Serubin/picture/boston/image-1.jpg',
title:	'Boston',
link:	'./boston',
desc:	'These photos were taken in Boston Mass during a lesson a hands on lesson about patterns.<br/>The objective was to find natural patterns in the modern world...'
},{
url:	'http://localhost/Serubin/picture/great_falls/image-1.jpg',
title:	'Great Falls',
link:	'./great_falls',
desc:	'These photos were taken in Great Falls Virginia on a trip to see my Aunt and Uncle. <br/>These were taken in my \'photographic youth\'...'
},{
url:	'http://localhost/Serubin/picture/cape_cod/image-1.jpg',
title:	'Cape Cod',
link:	'./cape_cod',
desc:	'These photos were taken in Cape Cod. <br/> The focus of this set of photos was light...'
},{
url:	'http://localhost/Serubin/picture/fire_me/image-8.jpg',
title:	'Fire',
link:	'./fire',
desc:	'These pictures are of myself fire spinning in my back yard. <br/>I was spinning what is called poi.'
},{
url:	'http://localhost/Serubin/picture/dc_people/image-19.JPG',
title:	'Dc People',
link:	'./dc_people',
desc:	'These photos were taken during a trip to DC. <br/>I focused on shooting on people, all candid shots...'
});
onLoad.add('SlideShow.init({pre_load: true,width: 960,height: 550})');
</script>");
$pg->setContent("DESCRIPTION","See the world through my eyes");
$pg->setContent("MENU","");
$pg->setContent("CONTENT","
<div id='slideshow'>
</div>
");
$pg->setDomain("serubin.net", "../");
$pg->sendContent();
?>
