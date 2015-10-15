---
layout: page
title: DynamixPy
description : A fully functional version of DynamixPy for devices that support python. A python based app developer can easily drop-in this py library and use runtime installed Dynamix plug-ins to discover rich, high order contextual information, perform context-aware adaptations and influence the user's physical environment.
---

Developers are moving more and more towards mobile technologies due to the easy availabilty of a number of personalization techniques they can offer by being contextually aware.

This project aims to bring developers and users back to desktops by allowing them to personalize the desktop experience using contextually relevant data from a user's mobile device. 

We present a fully functional version of DynamixPy for devices that support python. A python based app developer can easily drop-in this py library and use runtime installed Dynamix plug-ins to discover rich, high order contextual information, perform context-aware adaptations and influence the user's physical environment.

While the api could be used without the need of any physical interaction between the desktop and the mobile by using service discovery, we developed two pairing mechanisms to setup a secure communication channel between the Ambient Dynamix instance  :

* NFC to Interact - We tested out the _NFC to interact_ pairing mechanism on Raspberry Pi 2 with an NFC chip. 
* Scan to Interact - The _scan to interact_ mechanism is based on a simple QR code mechanism and is currently used by DynamixJS to enable legacy websites to be contextually aware. 
