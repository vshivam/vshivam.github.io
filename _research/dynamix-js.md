---
layout: page
title: DynamixJS 2.x
subtitle : Giving browsers superpowers!
description : A drop-in JavaScript library that enables browsers to request support for Dynamix plug-ins to discover rich, high order contextual information, perform context-aware adaptations to influence the user's physical environment.
---
DynamixJS enables desktop and mobile browsers to leverage the power of the Ambient Dynamix Framework running on any Android device.  By setting a simple <code>encryption</code> flag to <code>true</code> in the dynamix.js script, developers can enable encryption and pairing services provided by the library.

When the web app is running on an Android device, any request can be made directly to the local Dynamix instance with encryption support. On the other hand, when a web app wants to make use of a Dynamix instance running on a different device, it can use the _Scan To Interact_ pairing mechanism. The web app then shows a QR Code which the Dynamix device can scan and complete the pairing process.

All the encryption, pairing related code is handled by the library internally and the only thing that the developer needs to do is specify if the connection should be encrypted.

The [Ambient Flow]({{ site.url }}/projects/ambient_flow) prototype makes use of the DynamixJS library to deploy IoT designs in the real world.

<strong>Related : </strong>

* [DynamixJS Source Code](https://bitbucket.org/dynamixdevelopers/dynamix-2.x-javascript-apis/src/)
* [Simple Web Example](https://bitbucket.org/ambientlabs/dynamix-2.x-simple-web-example)
* [Scan to Interact Plugin](https://bitbucket.org/dynamixdevelopers/barcodepluginzbar/src/9debc4897c69d11d40a8800df6a2caaebaeb4e68?at=develop)
