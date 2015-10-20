---
layout: page
title: Portfolio
---

### Research Projects
{% for project in site.research %}

**[{{ project.title }}]({{ project.url }}) - {{project.subtitle}}** <br/>
{{ project.description}}

 ---

{% endfor %}

### Open Source Projects
{% for project in site.open_source %}

**[{{ project.title }}]({{ project.url }}) - {{project.subtitle}}** <br/>
{{ project.description}}

{% endfor %}