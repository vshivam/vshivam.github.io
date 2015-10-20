---
layout: page
title: Ambient Dynamix
subtitle: A plug and play Context - Aware Framework.
description: A lightweight software framework that transforms a user's mobile device into an adaptive smart gateway to the Internet of Things. It enables mobile apps and Web apps to fluidly interact with the physical world through advanced sensing, control and actuation plug-ins that can be installed into the user’s device on-demand.
---

###[What's Ambient Dynamix ?](http://ambientdynamix.org/)
Ambient Dynamix (Dynamix) is a lightweight software framework that transforms a user’s mobile device into an adaptive smart gateway to the Internet of Things. Dynamix enables mobile apps and Web apps to fluidly interact with the physical world through advanced sensing, control and actuation plug-ins that can be installed into the user’s device on-demand. A Dynamix-enabled device can also serve as a gateway between mutually incompatible smart devices that are situated in the user’s environment. Dynamix comes with a growing collection of ready-made plug-ins and provides open SDKs that enable 3rd party developers to create and share new plug-in types with the community.

### Plugins

[What are these plugins and how do they work ?](http://ambientdynamix.org/documentation/plug-in-development-guide#nav2)

* **NFC to Interact** - The NFC to Interact plugin, enables a Dynamix device to read a pairing code from an NFC chip and then update the Dynamix pairing server with the relevant details. The [DynamixPy Demo]({{site.url}}/projects/dynamix-py) uses this plugin to setup a secure communication channel with a Raspberry Pi. <br/> [[Source Code]](https://bitbucket.org/dynamixdevelopers/nfc-to-interact/)


* **Scan to Interact** - The Scan to Interact plugin behaves the same as the NFC to Interact plugin. However, the pairing code in this case is received by scanning a QR Code. The plugin is used by [Ambient Flow]({{site.url}}/projects/ambient-flow) to setup a secure communication channel between the Flow Designer and the Dynamix device. <br/> [[Source Code]](https://bitbucket.org/dynamixdevelopers/barcodepluginzbar/src/9debc4897c69d11d40a8800df6a2caaebaeb4e68?at=develop>)


* **Gesture Recognition** - Apps requiring support of gestures on a Samsung device can make use of this plugin. It can detect the TOP, BOTTOM, LEFT and RIGHT palm movement in front of the device.  The [DynamixPy Demo]({{site.url}}/projects/dynamix-py) uses this plugin to detect gestures to lock and unlock the Raspberry Pi. <br/>[[Source Code]](https://bitbucket.org/dynamixdevelopers/activityrecognition/)

* **Activity Recognition** - The Activity Recognition plugin makes use of the Google Activity Recognition APIs to provide information to the requesting application. Check out the [CustomActivityDetected](https://bitbucket.org/dynamixdevelopers/activityrecognition/src/1d0eaeb6af26dad9448b5411e2a7aa06af5a92b3/ActivityRecognition-Datatypes/src/main/java/org/ambientdynamix/contextplugins/activityrecognition/CustomDetectedActivity.java?at=develop&fileviewer=file-view-default) class for the list of supported activities. Every activity is associdated with a confidence level, an integer between 0 and 100. <br/> [[Source Code]](https://bitbucket.org/dynamixdevelopers/activityrecognition/src)

* **Dynamix Service Advertiser** - This plugin enables Dynamix to advertise it's service using the JmDNS library. [DynamixPy](https://bitbucket.org/dynamixdevelopers/dynamix-python-apis/src) has an experimental support for service discovery which enables it to reconnect to Dynamix devices as and when the device moves in and out of the network. <br/>[[Source Code]](https://bitbucket.org/vshivam/dynamix-service-advertiser/)