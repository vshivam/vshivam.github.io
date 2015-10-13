---
layout: post
title: Dynamically change jQuery Mobile colour swatch.
comments: True
---

There's no easy way to be able to switch the jQuery Mobile colour swatch dynamically for the whole page. A quick google search suggests <a href="http://stackoverflow.com/questions/7347664/change-jquery-mobile-color-swatch-dynamically" target="_blank">this</a> stackoverflow question where the accepted answer suggests removing and adding relevant classes for the required colour swatch.

For instance :

{% highlight js %}
$('.ui-body-' + currentTheme).each(function(){
    $(this).removeClass('ui-body-' + currentTheme).addClass('ui-body-' + selectedTheme);    
});
{% endhighlight %}

There are a bunch of other elements that you'll need to update as mentioned in the answer. It seems to work! But I am not too sure if this approach will cover all jQM supported elements. 

I found another (hacky?) way which works and should cover each and every jQM supported element.

The straightforward way to apply a particular colour swatch is to use the data-theme attribute. So, to apply the colour swatch 'a' to a page :

{% highlight html %}
<div data-role="page" data-theme="a">
...
</div>
{% endhighlight %}

Now, to be able to switch themes, another approach would be to have two css stylesheets for the same colour swatch 'a' and we could just switch the stylesheet using js whenever we needed to change the theme. This'll ensure that we do not need to update the class values for each element as mentioned in the stackoverflow answer since all properties for the theme 'a' are already applied to elements.

To generate these stylesheets we use the <a href="https://themeroller.jquerymobile.com/">themeroller</a>. In general, the themeroller is used to generate a stylesheet for different swatches (a, b, ..z) which could then be applied by setting the data-theme attribute. But in our case, we'll use it generate two different stylesheets by the name 'a'.

As an example, we'll use the default stylesheet provided by jQM to generate a light and a dark theme. Here's a short video tutorial about downloading the two stylesheets :

<p align="center">
    <iframe width="560" height="315" src="https://www.youtube.com/embed/f-aAeVrxc1I" frameborder="0" allowfullscreen></iframe>
</p>
Now, let's assume that we want to start with the light theme. So, we include the following in the head of the html page. 

{% highlight html %}
<link id="ui-stylesheet" rel="stylesheet" href="css/light/themes/light.min.css" />
<link id="icon-stylesheet" rel="stylesheet" href="css/light/themes/jquery.mobile.icons.min.css" />
<link rel="stylesheet" href="http://code.jquery.com/mobile/1.4.5/jquery.mobile.structure-1.4.5.min.css" /> 
{% endhighlight %}

with the data-theme attribute set to 'a' for the page element.

Now, whenever you need to update the colour swatch : 
{% highlight html %}
$('#ui-stylesheet').attr(href:"css/dark/themes/dark.min.css");
$('#icon-stylesheet').attr(href:"css/dark/themes/jquery.mobile.icons.min.css");
{% endhighlight %}

Updating based on radio button selection : 

{% highlight html %}
<form id="theme-switch">
    <fieldset data-role="controlgroup" data-type="horizontal" data-mini="true">
        <legend>Select a Theme:</legend>
        <input type="radio" name="theme-radio-btn" id="radio-choice-h-2a" value="light" checked="checked">
        <label for="radio-choice-h-2a">Light</label>
        <input type="radio" name="theme-radio-btn" id="radio-choice-h-2b" value="dark">
        <label for="radio-choice-h-2b">Dark</label>
    </fieldset>
</form>
{% endhighlight %}

{% highlight js %}
$("input:radio[name=theme-radio-btn]").click(function() {
	var theme_value = $(this).val();
    switch(theme_value){
        case "dark":
            console.log("Setting dark theme");
            $('#ui-stylesheet').attr(href:"css/dark/themes/dark.min.css");
            $('#icon-stylesheet').attr(href:"css/dark/themes/jquery.mobile.icons.min.css");
            break;
        case "light":
            console.log("Setting light theme");
            $('#ui-stylesheet').attr(href:"css/light/themes/light.min.css");
            $('#icon-stylesheet').attr(href:"css/light/themes/jquery.mobile.icons.min.css");   
            break;            
    }
});
{% endhighlight %}
Hope this helps!