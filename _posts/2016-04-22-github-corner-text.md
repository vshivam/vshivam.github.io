---
layout: post
title: An even fresher 'Fork me on GitHub' callout !
comments: True
---

If you're looking for a 'Fork me on Github' solution for your blog, I am sure you've come across the [GitHub Corners](https://github.com/tholman/github-corners) or the [Github Ribbons](https://github.com/blog/273-github-ribbons) project. <br> So did I.

I had used a Github Ribbon for one of my earlier blogs and was looking for something new this time around and that's when I came across Github Corners. An SVG based solution with an animated Octocat! Definitely cooler.

So I went ahead, added the relevant code to the layout but I missed having an explicit 'Fork me on GitHub' label with the svg. A little bit of googling about how to add a rotated text to SVG followed by some hacking and here's the final result.

<div data-align="left">
	<div style="float: left;">
		<a target="_blank" href="https://github.com/vshivam" class="github-corner">
			<svg width="100" height="100" viewBox="0 0 250 250" style="fill:#151513; color:#fff; top: 0; border: 0; left: 0; transform: scale(-1, 1);">
				<path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
				<path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,
				78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,
				87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path>
				<path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,
				101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,
				58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,
				40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,
				65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,
				93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,
				128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,
				136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path>
				<text text-anchor="middle" x="-175" y="25" transform="scale(-1, 1)rotate(-45)" 
				font-size="30" font-weight="bold" class="github-corner-text">Fork me on Github!</text>
			</svg>
		</a>
	</div>

	<div>
	<center>
		<textarea style="border: 2px solid #eee; outline: 0px; height: 150px; width: 60%; font-family: monospace; font-size: 10px;" onClick="this.select();">
			<a target="_blank" href="https://github.com/vshivam" class="github-corner"><svg width="100" height="100" viewBox="0 0 250 250" style="fill:#151513; color:#fff; position: absolute; top: 0; border: 0; left: 0; transform: scale(-1, 1);"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path><text text-anchor="middle" x="-175" y="25" transform="scale(-1, 1)rotate(-45)" font-size="30" font-weight="bold" class="github-corner-text">Fork me on Github</text></svg></a><style>.github-corner:hover .octo-arm{animation: octocat-wave 560ms ease-in-out}@keyframes octocat-wave{0%, 100%{transform: rotate(0)}20%, 60%{transform: rotate(-25deg)}40%, 80%{transform: rotate(10deg)}}@media (max-width: 500px){.github-corner:hover .octo-arm{animation: none}.github-corner .octo-arm{animation: octocat-wave 560ms ease-in-out}.github-corner-text{display: none;}.github-corner svg{height: 50px; width: 50px;}}</style>
		</textarea>
		</center>
	</div>
</div>

<div data-align="right">
	<div style="float: left;">
		<a class="github-corner" target="_blank" href="https://github.com/vshivam">
			<svg width="100" height="100" viewBox="0 0 250 250" style="fill:#151513; color:#fff; top: 0; border: 0; right: 0;">
				<path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path>
				<path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path>
				<path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path>

				<text class="github-corner-text" text-anchor="middle" x ="175" y="25" transform="rotate(45)" font-size="30" font-weight="bold">Fork me on Github!</text>
			</svg>
		</a>
	</div>

	<div>
	<center>
		<textarea style="border: 2px solid #eee; outline: 0px; height: 150px; width: 60%; font-family: monospace; font-size: 10px;" onClick="this.select();">
			<a class="github-corner" target="_blank" href="https://github.com/vshivam"><svg width="100" height="100" viewBox="0 0 250 250" style="fill:#151513; color:#fff; position: absolute; top: 0; border: 0; right: 0;"><path d="M0,0 L115,115 L130,115 L142,142 L250,250 L250,0 Z"></path><path d="M128.3,109.0 C113.8,99.7 119.0,89.6 119.0,89.6 C122.0,82.7 120.5,78.6 120.5,78.6 C119.2,72.0 123.4,76.3 123.4,76.3 C127.3,80.9 125.5,87.3 125.5,87.3 C122.9,97.6 130.6,101.9 134.4,103.2" fill="currentColor" style="transform-origin: 130px 106px;" class="octo-arm"></path><path d="M115.0,115.0 C114.9,115.1 118.7,116.5 119.8,115.4 L133.7,101.6 C136.9,99.2 139.9,98.4 142.2,98.6 C133.8,88.0 127.5,74.4 143.8,58.0 C148.5,53.4 154.0,51.2 159.7,51.0 C160.3,49.4 163.2,43.6 171.4,40.1 C171.4,40.1 176.1,42.5 178.8,56.2 C183.1,58.6 187.2,61.8 190.9,65.4 C194.5,69.0 197.7,73.2 200.1,77.6 C213.8,80.2 216.3,84.9 216.3,84.9 C212.7,93.1 206.9,96.0 205.4,96.6 C205.1,102.4 203.0,107.8 198.3,112.5 C181.9,128.9 168.3,122.5 157.7,114.1 C157.9,116.9 156.7,120.9 152.7,124.9 L141.0,136.5 C139.8,137.7 141.6,141.9 141.8,141.8 Z" fill="currentColor" class="octo-body"></path><text class="github-corner-text" text-anchor="middle" x="175" y="25" transform="rotate(45)" font-size="30" font-weight="bold">Fork me on Github</text></svg></a><style>.github-corner:hover .octo-arm{animation: octocat-wave 560ms ease-in-out}@keyframes octocat-wave{0%, 100%{transform: rotate(0)}20%, 60%{transform: rotate(-25deg)}40%, 80%{transform: rotate(10deg)}}@media (max-width: 500px){.github-corner:hover .octo-arm{animation: none}.github-corner .octo-arm{animation: octocat-wave 560ms ease-in-out}.github-corner-text{display: none;}.github-corner svg{height: 50px; width: 50px;}}</style>
			</textarea>
		</center>
	</div>
</div>
<center><h4> (Click on the code to select all) </h4></center>

<br>
<h4> What happens on smaller screens ? </h4>

* If you are checking out this post on a smaller screen, you're probably not seeing the text label at all and wondering what the fuss is all about. This code snippet supports this behaviour by default. For all screens where the width is less than 500px, the text is hidden automatically.
* The height and width of the logo is also reduced to half of the original size on smaller screens. 

<h4> But I need the text on smaller screns! </h4> 

* No worries. Just open the [non-minified](https://github.com/vshivam/github-corners-text/tree/master/non-minified) version of the code you're using and remove the line `.github-corner-text{display: none;}` from the css. The text will be visible on smaller screens as well.

<h4> Can I change the text ? </h4>

* The `<svg>` uses the `<text>` element to display the text. You simply need to replace 'Fork me on Github' in the snippet with your text.

<h4> How do I change the colours ? </h4>

* Play around with the fill and color css properties of the `<svg>` element. 

<h4>Project Repository </h4>
[https://github.com/vshivam/github-corners-text](https://github.com/vshivam/github-corners-text)

This project is a fork of the original [Github Corners](http://tholman.com/github-corners/) project. Thanks to Tim Holman
for creating Github Corners!
