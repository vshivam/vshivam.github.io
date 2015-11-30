---
layout: page
title: Virtual Walks and Indoor Navigation [Under submission]
subtitle: Indoor navigation using a smartphone. 
description : In this project, we present the design of an Indoor Navigation System using the accelerometer and magnetometer sensors available in a smartphone supported by an easy to use application for the web which proposes a novel way of providing a set of Points of Interest(POI) at the user's current location. 
---

In this project, we developed an indoor navigation system with the help of a smartphone with minimal external infrastructure support. The proposed approach uses a web based architecture to generate an indoor map based on the links between panoramic images uploaded to the server with the help of our Map Generation application. 

An indoor location is represented by a connected graph, where the nodes represent a coordinate from where a panoramic image was captured and the edges represent the pathway from one key-location to another. For a given destination, the shortest path is calculated w.r.t the current position. 

![Shortest Path Screengrab]({{ site.url }}/assets/portfolio/shortestPath.png)

<center> 
	<strong>
		Indoor location map generated using panoramic image data
	</strong>
</center>

<br/>
The application uses the smartphone sensor data for a dead reckoning based localization technique to estimate user's current location given a known initial position. Visual feedback is provided for the user to navigate to the given destination. 

