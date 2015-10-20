---
layout: page
title: DynamixPy
subtitle : Making desktops Context - Aware. 
description : A fully functional version of DynamixPy for devices that support python. Any Python app developer can easily drop-in this py library and use runtime installed Dynamix plug-ins to discover rich, high order contextual information, perform context-aware adaptations to influence the user's physical environment.
---

Developers are moving more and more towards mobile technologies due to the easy availabilty of a number of personalization techniques they can offer by being contextually aware.

This project aims to bring developers and users back to desktops by allowing them to personalize the desktop experience using contextually relevant data from a user's mobile device. 

We present a fully functional version of DynamixPy for devices that support python. A python based app developer can easily drop-in this py library and use runtime installed Dynamix plug-ins to discover rich, high order contextual information, perform context-aware adaptations and influence the user's physical environment.

While the api could be used without the need of any physical interaction between the desktop and the mobile by using service discovery, we developed two pairing mechanisms to setup a secure communication channel between the Ambient Dynamix instance  :

* NFC to Interact - We tested out the _NFC to interact_ pairing mechanism on Raspberry Pi 2 with an NFC chip. 
* Scan to Interact - The _scan to interact_ mechanism is based on a simple QR code mechanism and is currently used by DynamixJS to enable legacy websites to be contextually aware. 

The following video shows a demo of how a python script running on a raspberry pi uses DynamixPy to listen to gestures on the user's android device. As you'll see in the video, once the listener is setup, python logger uses the bottom to top gesture to lock the raspberry pi and the opposite gesture to popup the unlock dialog. 

<p align="center">
	<iframe src="https://www.youtube.com//embed/-UOnOUpoehg" width="500" height="281" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen></iframe>

	DynamixPy Demo
</p>

Detailed explanation of how to use DynamixPy in your own python app can be found in the [DynamixPy source code repository](https://bitbucket.org/dynamixdevelopers/dynamix-python-apis/src/ecb83df9ddc712626818f5261fadf2f722c9249d?at=master). 


<strong>Related : </strong>

* [DynamixPy Logger](https://bitbucket.org/dynamixdevelopers/dynamix-python-apis/src/1124d0c71776ba7116ec2d1f90b968079efbc29d?at=master)
* [Gesture Recognition Plugin](https://bitbucket.org/dynamixdevelopers/gesture-recognition-samsung)
* [NFC to Interact Plugin](https://bitbucket.org/dynamixdevelopers/nfc-to-interact/src)
* [DynamixJS](https://bitbucket.org/dynamixdevelopers/dynamix-2.x-javascript-apis/)