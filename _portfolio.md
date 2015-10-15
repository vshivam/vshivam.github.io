---
layout: page
title: Portfolio
---

### Ambient Flow
The number of networked “smart devices” available in everyday environments is rapidly increasing; however, most adopt mutually incompatible networks, protocols, and application programming interfaces. 

Ambient Flow provides a set of novel smart space design tools, which enable non-programmers to visually “remix” their ambient environments in new, playful and potentially unforeseen ways using an intuitive flow-graph model.

![User Study]({{ site.url }}/assets/portfolio/userStudyPhoto.jpg)

![Web User Interface]({{ site.url }}/assets/portfolio/webUi.png)

<center> 
	<strong>
		A user study participant controls the light bulb using the sphero robotic ball
	</strong>
</center>
<br/>

Publications : 

* D. Carlson, M. Mogerle, M. Pagel, <strong>S. Verma</strong>, and D. S. Rosenblum, “Ambient flow: A
visual approach for remixing the internet of things” in <strong>5th International
Conference on the Internet of Things (IoT 2015) </strong> <br/> [[Full Paper]]({{site.url}}/assets/portfolio/papers/Ambient_Flow.pdf)

* D. Carlson, M. Mogerle, M. Pagel, <strong>S. Verma</strong>, and D. S. Rosenblum, "A Visual Design Toolset for Drag-and-drop Smart Space Configuration" 
in <strong>5th International Conference on the Internet of Things (IoT 2015) </strong> <br/> [[Demo Paper]]({{site.url}}/assets/portfolio/papers/Demo_Ambient_Flow.pdf)

---

### Dengue Mapper
An application on the Android platform for tracking the movement patterns of a hundred
dengue patients along with a hundred control users in Singapore. The application aims to be highly non-intrusive, 
using a set of sensible defaults and only requiring user interaction after the completion of the study, prompting the user with an uninstall message.

<!--

<p align="center">
  <img src="{{ site.url }}/assets/portfolio/dengueMapper.png" alt="Dengue Mapper"/>
</p>

-->
<p align="center">
	<iframe src="https://player.vimeo.com/video/142143184?color=ff9933" width="500" height="319" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe> 
</p>
The study is currently underway and a part of the Dengue Fever study from the NUS Saw Swee School of Public Health and NUS School of Computing in collaboration with the Tan Tock Seng Hospital in Singapore. The study aims to identify the types of places and location where they may be high incidences of mosquito breeding and dengue infection. 

It could then guide vector control measures which could be carried out to reduce the incidences of mosquito breeding and dengue infection in those locations. 

<strong> More about Dengue Mapper </strong>

* [Play Store URL](https://play.google.com/store/apps/details?id=sg.nus.comp.fci.denguemapper&hl=en)
* [Featured on Ambient Dynamix Webpage !](http://ambientdynamix.org/news/dynamix-joins-the-fight-against-dengue-fever)

---

### DynamixPy
Developers are moving more and more towards mobile technologies due to the easy availabilty of a number of personalization techniques they can offer by being contextually aware.

This project aims to bring developers and users back to desktops by allowing them to personalize the desktop experience using contextually relevant data from a user's mobile device. 

We present a fully functional version of DynamixPy for devices that support python. A python based app developer can easily drop-in this py library and use runtime installed Dynamix plug-ins to discover rich, high order contextual information, perform context-aware adaptations and influence the user's physical environment.

While the api could be used without the need of any physical interaction between the desktop and the mobile by using service discovery, we developed two pairing mechanisms to setup a secure communication channel between the Ambient Dynamix instance  :

* NFC to Interact - We tested out the _NFC to interact_ pairing mechanism on Raspberry Pi 2 with an NFC chip. 
* Scan to Interact - The _scan to interact_ mechanism is based on a simple QR code mechanism and is currently used by DynamixJS to enable legacy websites to be contextually aware. 

<p align="center">

	<iframe src="https://player.vimeo.com/video/142366448?color=ff9933" width="500" height="258" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
	<br/>
</p>

The screencast shows the setup process of requesting support from the activity recognition plugin. Similarly, the app can request support for user's heart rate, ble-beacons, media players, lighting plugins, light sensor plugin and a variety of other plugins. 

<strong>Related Links :</strong>

* [Supported Plugins](http://ambientdynamix.org/category/plugins)
* [DynamixPy Source Code](https://bitbucket.org/dynamixdevelopers/dynamix-python-apis/)
* [DynamixJS Source Code](https://bitbucket.org/dynamixdevelopers/dynamix-2.x-javascript-apis/commits/all)

---

### Privly

Privly is an open source project built by contributors from around the world, that helps you protect your content in the wild. It gives you more than privacy, it gives you security and enables you to protect your content from being exposed in the long run. 

Over the past two years I have been actively involved with the development of the mobile versions of Privly. 
In the [latest commit](https://github.com/privly/privly-android/tree/21351ed05eba07ed433a8dd1a57cdbebae79aece), the application allows us to seamlessly create new Privly content using the Plainpost and Zerobin applications and view the history of all our created content. It also has an experimental support for reading Privly content from gmail, facebook and twitter and I'm currently working on making the reading experience better. 


<p align="center">
	<iframe src="https://player.vimeo.com/video/142352454?color=ff9933" width="250" height="445" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
	<br>
	Sharing protected content using Privly - Android
</p>

<strong>More about Privly : </strong>

* [Privly featured on the Google Open Source Blog !!](http://google-opensource.blogspot.sg/2014/12/google-summer-of-code-wrap-up-privly.html)
* More details about the Privly ecosystem :  <https://priv.ly/> 
* Privly Source Code : <https://github.com/privly>




