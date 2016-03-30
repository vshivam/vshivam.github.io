---
layout: post
title: How to unfollow everyone on Quora, you ask ?
comments: True
---

Use this script I wrote while trying to clean up the mess my quora timeline had become.

{% highlight javascript %}
function unfollow(){
	var tag = $('a[action_click="UserUnfollow"]')[0];
	console.log(tag);
	if(typeof tag !== 'undefined') {
	      tag.click();
	} else {
	      clearInterval(counter);
	}
}

var counter = setInterval(unfollow, 2000);
{% endhighlight %}

<h2> How to use the script ?</h2>

1. Goto the page which shows the list of people you're following. Something like : https://www.quora.com/profile/your-username/following
2. Keep scrolling down, so that the complete list of people you follow is visible on the page. 
2. Right Click -> Inspect.
3. Open Console in the inspect panel.
4. Paste the script, wait, start your life over, fresh.

<h2> How does the script work ?</h2>

Every Un-Follow button on the page looks something like this : 
{% highlight html %}
<a class="Button TwoStateButton User pressed main_button user_follow_button" 
	href="#" 
	action_target="XXX" 
	action_click="UserUnfollow" 
	id="__w2_yA4BoJq_button">
	<span id="__w2_yA4BoJq_text">Unfollow</span>
	<span class="count" id="__w2_yA4BoJq_count">1.4k</span>
</a>
{% endhighlight %}

What's common among all the `<a>` tags is that the `action_click` attribute is set to `UserUnfollow`. So, the script uses jQuery to select the first anchor tag with this attribute and then simply calls the `click` method on the tag, imitating a user clicking that unfollow button. 

I did not want to bombard quora with super quick requests, lest they block me(?), so this process is repeated every 2000ms. 

PS : Releasing under the MIT License, so use it at your own risk ;)

PPS : Happy Quoraing

