---
layout: page
title: Portfolio
---

### Research Projects
{% for project in site.research %}

* [{{ project.title }} ]({{ project.url }}) - 
{{ project.description}}

 ---

{% endfor %}

### Open Source Contributions
{% for project in site.open_source %}

* [{{ project.title }} ]({{ project.url }}) -  {{ project.description }}

{% endfor %}