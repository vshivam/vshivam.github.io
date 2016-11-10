---
layout: page
title: Ambient Dynamix
subtitle: A plug and play context-aware Framework.
description: A lightweight software framework that transforms a user's mobile device into an adaptive smart gateway to the Internet of Things. It enables mobile apps and Web apps to fluidly interact with the physical world through advanced sensing, control and actuation plug-ins that can be installed into the user’s device on-demand.
---

### What's [Ambient Dynamix ?](http://ambientdynamix.org/)
Ambient Dynamix (Dynamix) is a lightweight software framework that transforms a user’s mobile device into an adaptive smart gateway to the Internet of Things. Dynamix enables mobile apps and Web apps to fluidly interact with the physical world through advanced sensing, control and actuation plug-ins that can be installed into the user’s device on-demand. 

A Dynamix-enabled device can also serve as a gateway between mutually incompatible smart devices that are situated in the user’s environment. Dynamix comes with a growing collection of ready-made plug-ins and provides open SDKs that enable 3rd party developers to create and share new plug-in types with the community.

### Plugins

[What are these plugins and how do they work ?](http://ambientdynamix.org/documentation/plug-in-development-guide#nav2)

* **NFC to Interact** - The NFC to Interact plugin enables a Dynamix device to read a pairing code from an NFC Tag. [[Source Code]](https://bitbucket.org/dynamixdevelopers/nfc-to-interact/)


* **Barcode Plugin** - This plugin allows web or mobile apps to scan bar codes from various sources, such as video streams, image files and raw intensity sensors. It supports EAN-13/UPC-A, UPC-E, EAN-8, Code 128, Code 93, Code 39, Codabar, Interleaved 2 of 5, QR Code and DataBar. [[Source Code]](https://bitbucket.org/dynamixdevelopers/barcodepluginzbar)

* **Pairing Plugin** -  It allows users to initiate new remote pairings with the Dynamix Framework. 
The plugin supports three pairing mechanisms which can be initiated using the Features fragment of the Dynamix Framework : <br/> 
1. `Scan To Interact` : Scan a QR Code using the camera to read pairing data. Used by the [Ambient Flow Prototype]({{site.url}}/projects/ambient_flow/).
2. `Generate Pairing Code` : This feature displays a pre-authorized pairing code which can then be used by apps to initiate remote pairing.
3. `NFC To Interact` : Scan an NFC Tag to receive pairing data. This method is currently used by the [DynamixPy Demo]({{site.url}}/projects/dynamix-py) running on a Raspberry Pi. [[SourceCode]](https://bitbucket.org/dynamixdevelopers/pairingplugin/src)

* **Gesture Recognition** - Apps requiring support of gestures on a Samsung device can make use of this plugin. It can detect the TOP, BOTTOM, LEFT and RIGHT palm movement in front of the device.  The [DynamixPy Demo]({{site.url}}/projects/dynamix-py) uses this plugin to detect gestures to lock and unlock the Raspberry Pi. [[Source Code]](https://bitbucket.org/dynamixdevelopers/activityrecognition/)

* **Activity Recognition** - The Activity Recognition plugin makes use of the Google Activity Recognition APIs to provide information to the requesting application. Check out the [CustomActivityDetected](https://bitbucket.org/dynamixdevelopers/activityrecognition/src/1d0eaeb6af26dad9448b5411e2a7aa06af5a92b3/ActivityRecognition-Datatypes/src/main/java/org/ambientdynamix/contextplugins/activityrecognition/CustomDetectedActivity.java?at=develop&fileviewer=file-view-default) class for the list of supported activities. Every activity is associated with a confidence level, an integer between 0 and 100. [[Source Code]](https://bitbucket.org/dynamixdevelopers/activityrecognition/src)

* **Dynamix Service Advertiser** - This plugin enables Dynamix to advertise it's service using the JmDNS library. [DynamixPy](https://bitbucket.org/dynamixdevelopers/dynamix-python-apis/src) has an experimental support for service discovery which enables it to reconnect to Dynamix devices as and when the device moves in and out of the network. [[Source Code]](https://bitbucket.org/dynamixdevelopers/dynamix-service-advertiser/src)

* **Proximity Plugin** - This plugin allows apps to determine how far away a physical object is from the face of the handset device. Most proximity sensors in smartphones return the absolute distance, in cm, but some return only near and far values. [[Source Code]](https://bitbucket.org/dynamixdevelopers/proximity-plugin/src)
