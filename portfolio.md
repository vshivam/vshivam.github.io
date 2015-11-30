---
layout: page
title: Portfolio
---

<!--
<center> <h2 style="text-decoration: underline"> Research Projects </h2> </center> -->
{% for project in site.research %}

* **[{{ project.title }}]({{ project.url }}) - {{project.subtitle}}** <br/> 
{{ project.description}}
<br/>

 ---

{% endfor %}

<!--
<center> <h2 style="text-decoration: underline"> Open Source Projects </h2> </center> -->
{% for project in site.open_source %}

* **[{{ project.title }}]({{ project.url }}) - {{project.subtitle}}** <br/> 
{{ project.description}}

---

{% endfor %}