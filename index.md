---
layout: page
title: Blog
---

{% for post in site.posts %}
   {{ post.date | date_to_string }} [ {{ post.title }} ]({{ post.url }}) <br/>
  	<!--{{ post.content | strip_html | truncatewords: 30 }} -->
{% endfor %}