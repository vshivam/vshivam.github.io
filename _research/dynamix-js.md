---
layout: page
title: DynamixJS 2.x
subtitle : Giving browsers superpowers!
description : A drop-in JavaScript library that enables browsers to request support for Dynamix plug-ins to discover rich, high order contextual information, perform context-aware adaptations to influence the user's physical environment.
---
DynamixJS enables desktop and mobile browsers to leverage the power of the [Ambient Dynamix Framework](http://ambientdynamix.org) running on any Android device.  Depending on whether the web app is connecting to a remote or a local Dynamix instance, DynamixJS automatically handles remote pairing and data encryption.

When the web app is running on an Android device, any request can be made directly to the local Dynamix instance. On the other hand, when a web app wants to make use of a Dynamix instance running on a different device, it can use the _Pairing Plugin_ to talk to the remote client. The web app then shows a QR Code which the Dynamix device can scan and complete the pairing process.

All the encryption and pairing related code is handled by the library internally and the only thing that the developer needs to do to establish a connection with the Ambient Dynamix Framework is to make a call to the `Dynamix.bind()` method.

The [Ambient Flow]({{ site.url }}/projects/ambient_flow) prototype makes use of the DynamixJS library to deploy IoT designs to the Ambient Dynamix Framework.

<strong>Dependencies :</strong>

* [jQuery Mobile](http://jquerymobile.com/download/)
* [QR Code Generator](http://jeromeetienne.github.io/jquery-qrcode/)
* [Forge](https://github.com/digitalbazaar/forge) for pairing and encryption.

<strong>Related : </strong>

* [Dynamix JS How-To](http://ambientdynamix.org/documentation/dynamix-2-web-app-quickstart)
* [DynamixJS Source Code](https://bitbucket.org/dynamixdevelopers/dynamix-2.x-javascript-apis/src/)
* [Simple Web Example](https://bitbucket.org/ambientlabs/dynamix-2.x-simple-web-example)
* [Pairing Plugin](https://bitbucket.org/dynamixdevelopers/pairingplugin)
