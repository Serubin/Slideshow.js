<?php
require_once "C:/xampp/htdocs/Serunified/static/template/template.php";
$pg = new pageTemplate("master.html","http://localhost/serunified/static/");
$pg->setContent("TITLE","Photos");
$pg->setContent("HEAD","<link rel='stylesheet' href='../slideshow.css' type='text/css' /><script src='../slideshow.js'></script><script src='./load.js'></script>");
$pg->setContent("DESCRIPTION","See the world through my eyes");
$pg->setContent("MENU","");
$pg->setContent("CONTENT","
<div id='slideshow'>
</div>
");
$pg->setDomain("serubin.net", "../");
$pg->sendContent();
?>
