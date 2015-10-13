---
layout: post
title: Multicast DNS Service discovery in python.
comments: True
---

As discussed in the last post, I use the JmDNS library for service advertisement on the local area network. You can refer to it [here]({{ site.url }}/2015/02/15/jmdns-service-discovery/). In this post, I'll discuss how I used the <a href="https://github.com/wmcbrine/pyzeroconf">pyZeroconf</a> library to search for the service advertised by the android device. There do exist other libraries but the ones that I came across are dependent on <a href="http://en.wikipedia.org/wiki/Avahi_%28software%29">avahi</a> or <a href="http://en.wikipedia.org/wiki/Bonjour_%28software%29">bonjour</a> and need them to be pre installed on the system and since I was working on py based api, I preferred not to have the extra baggage.

Here goes the sample code :

{% highlight python %}
from zeroconf import *
import socket
import time

class ServiceListener(object):
    def __init__(self):
        self.r = Zeroconf()

    def removeService(self, zeroconf, type, name):
        print
        print "Service", name, "removed"

    def addService(self, zeroconf, type, name):
        print
        print "Service", name, "added"
        print "  Type is", type
        info = self.r.getServiceInfo(type, name)
        if info:
            print "  Address is %s:%d" % (socket.inet_ntoa(info.getAddress()),
                                          info.getPort())
            print "  Weight is %d, Priority is %d" % (info.getWeight(),
                                                      info.getPriority())
            print "  Server is", info.getServer()
            prop = info.getProperties()
            if prop:
                print "  Properties are"
                for key, value in prop.items():
                    print "    %s: %s" % (key, value)

if __name__ == '__main__':
    r = Zeroconf()
    type = "_dynamix._tcp.local."
    listener = ServiceListener()
    browser = ServiceBrowser(r, type, listener)
    # Search for devices for 40 seconds. 
    time.sleep(40)
    r.close()
{% endhighlight %}


We could also use pyBonjour to search for devices from the browser by a simple hack, since the browsers generally have no native support for service discovery. The following code is just a proof of concept and uses an always running Simple HTTP Server to serve the results to a request from the browser. 

{% highlight python %}
import SocketServer
import SimpleHTTPServer
from zeroconf import *
import socket
import time

PORT = 7679
devices = [];

class ServiceListener(object):
    def __init__(self):
        self.r = Zeroconf()

    def removeService(self, zeroconf, type, name):
        print
        print "Service", name, "removed"

    def addService(self, zeroconf, type, name):
        print
        print "Service", name, "added"
        print "  Type is", type
        info = self.r.getServiceInfo(type, name)
        if info:
            #Currently only saving the ip address.
            devices.append(socket.inet_ntoa(info.getAddress()))
            print "  Address is %s:%d" % (socket.inet_ntoa(info.getAddress()),
                                          info.getPort())
            print "  Weight is %d, Priority is %d" % (info.getWeight(),
                                                      info.getPriority())
            print "  Server is", info.getServer()
            prop = info.getProperties()
            if prop:
                print "  Properties are"
                for key, value in prop.items():
                    print "    %s: %s" % (key, value)

def searchForDynamixServices():
    del devices[:] # Clear list.
    r = Zeroconf()
    type = "_dynamix._tcp.local."
    listener = ServiceListener()
    browser = ServiceBrowser(r, type, listener)
    #Will only be searching for 5 seconds. 
    time.sleep(5)
    r.close()
    return devices[0]

# This class hosts a Simple HTTP Server at 127.0.0.1:7679.
# To search for devices, http://127.0.0.1:7679/search

class CustomHandler(SimpleHTTPServer.SimpleHTTPRequestHandler):
    def do_GET(self):
        if self.path=='/search':
            #This URL will trigger our sample function and send what it returns back to the browser
            self.send_response(200)
            self.send_header('Content-type','text/html')
            self.end_headers()
            # write the list of ip address as a response. 
            self.wfile.write(searchForDynamixServices())
            return
        else:
            #serve files, and directory listings by following self.path from
            #current working directory
            SimpleHTTPServer.SimpleHTTPRequestHandler.do_GET(self)

httpd = SocketServer.ThreadingTCPServer(('localhost', PORT),CustomHandler)
print "serving at port", PORT
httpd.serve_forever()
{% endhighlight %}

Now, if you make an HTTP Request to http://127.0.0.1:7679/search (better if async) , it starts a zeroconf search for the services of the type '_dynamix._tcp.local.' and provides the ip list as the response. 

This can be made much more efficient (browsers might even have a persistent connection?), provide more useful data as the response but as a proof of concept, definitely works! Tested on Ubuntu 14.04 and Windows 7 :)