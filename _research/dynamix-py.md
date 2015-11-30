---
layout: page
title: DynamixPy 1.x
subtitle : Making desktops context-aware. 
description : A fully functional version of DynamixPy for devices that support python. Any Python app developer can easily drop-in this py library and use runtime installed Dynamix plug-ins to discover rich, high order contextual information.
---

More and more developers are moving towards mobile technologies due to the easy availabilty of a number of personalization techniques they can offer by being contextually aware.

This project aims to bring developers and users back to desktops by allowing them to personalize the desktop experience using contextually relevant data from a user's mobile device. 

We present a fully functional version of DynamixPy for devices that support python. A python app developer can easily drop-in this py library and use runtime installed Dynamix plug-ins to discover rich, high order contextual information, perform context-aware adaptations and influence the user's physical environment.

While the api could be used without the need of any physical interaction between the desktop and the mobile by using service discovery, the library also provides the _NFC to Interact_ pairing mechanism to support encryption. We tested this pairing mechanism on a Raspberry Pi 2 with an NFC chip. 

The following video shows a demo of how a python script running on a raspberry pi uses DynamixPy to listen to gestures on the user's android device. As you'll see in the video, once the listener is setup, python logger uses the bottom to top gesture to lock the raspberry pi and the opposite gesture to popup the unlock dialog. 

<p align="center">
	<iframe src="https://player.vimeo.com/video/147292614?color=ff9933" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>
	DynamixPy Demo
</p>

Detailed explanation of how to use DynamixPy in your own python app can be found in the [DynamixPy source code repository](https://bitbucket.org/dynamixdevelopers/dynamix-python-apis/src/ecb83df9ddc712626818f5261fadf2f722c9249d?at=master). 


<strong>Related : </strong>

* [DynamixPy Logger](https://bitbucket.org/dynamixdevelopers/dynamix-python-apis/src/1124d0c71776ba7116ec2d1f90b968079efbc29d?at=master)
* [Gesture Recognition Plugin](https://bitbucket.org/dynamixdevelopers/gesture-recognition-samsung)
* [NFC to Interact Plugin](https://bitbucket.org/dynamixdevelopers/nfc-to-interact/src)