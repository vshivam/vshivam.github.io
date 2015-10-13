---
layout: post
title: Using JmDNS for service advertisement and discovery on android.
comments: True
---

While working on the Ambient Dynamix project, I needed to search for android devices running the Dynamix framework from a python based application running on the desktop. Starting API 16, android provides the <a href="http://developer.android.com/reference/android/net/nsd/NsdManager.html">NSDManager</a> class to advertise and search for services. However, to be able to support pre android 16 devices, I used the <a href="http://mvnrepository.com/artifact/com.github.rickyclarkson/jmdns/3.4.2-r353-1">JmDNS</a> library. (The one on the soureforge page is an older version)

To get an idea of what DNS Service discovery is and how it works, check out <a href="http://www.dns-sd.org/">this</a> and <a href="http://www.multicastdns.org/">this</a>.

Here's the sample code with comments for explanation. 
{% highlight java %}
public class DnssdDiscovery extends Activity {
	android.net.wifi.WifiManager.MulticastLock lock;
	android.os.Handler handler = new android.os.Handler();
	private String LOGTAG = getClass().getSimpleName();

	@Override
	public void onCreate(Bundle savedInstanceState) {
		super.onCreate(savedInstanceState);
		setContentView(R.layout.main);
	}

	@Override
	protected void onStart() {
		super.onStart();
		setUp();
	}

	private String type = "_dynamix._tcp.local.";
	private JmDNS jmdns = null;
	private ServiceListener listener = null;
	private ServiceInfo serviceInfo;

	private void setUp() {

		new Thread(new Runnable() {

			@Override
			public void run() {
				android.net.wifi.WifiManager wifi = (android.net.wifi.WifiManager) getSystemService(android.content.Context.WIFI_SERVICE);
				
				/*Allows an application to receive 
				Wifi Multicast packets. Normally the Wifi stack 
				filters out packets not explicitly addressed to 
				this device. Acquiring a MulticastLock will cause 
				the stack to receive packets addressed to multicast
				addresses. Processing these extra packets can 
				cause a noticable battery drain and should be 
				disabled when not needed. */
				lock = wifi.createMulticastLock(getClass().getSimpleName());
				
				/*Controls whether this is a reference-counted or 
				non-reference- counted MulticastLock. 
				Reference-counted MulticastLocks keep track of the 
				number of calls to acquire() and release(), and 
				only stop the reception of multicast packets when 
				every call to acquire() has been balanced with a 
				call to release(). Non-reference- counted 
				MulticastLocks allow the reception of multicast 
				packets whenever acquire() is called and stop 
				accepting multicast packets whenever release() is 
				called.*/
				lock.setReferenceCounted(false);
				
				try {
					InetAddress addr = getLocalIpAddress();
					String hostname = addr.getHostName();
					lock.acquire();
					Log.d(LOGTAG, "Addr : " + addr);
					Log.d(LOGTAG, "Hostname : " + hostname);
					jmdns = JmDNS.create(addr, hostname);
					listener = new ServiceListener() {

						/*
						 * Note:This event is only the service added event. The
						 * service info associated with this event does not
						 * include resolution information.
						 */
						@Override
						public void serviceAdded(ServiceEvent event) {
							/*
							 * Request service information.
                                                         * The information about the service is requested and the
							 * ServiceListener.resolveService method is called
							 * as soon as it is available.
							 */
							jmdns.requestServiceInfo(event.getType(),
							event.getName(), 1000);
						}

						/*
						 * A service has been resolved. Its details are now
						 * available in the ServiceInfo record.
						 */
						@Override
						public void serviceResolved(ServiceEvent ev) {
							Log.d(LOGTAG, "Service resolved: " + ev.getInfo().getQualifiedName() + " port:" + ev.getInfo().getPort());
							Log.d(LOGTAG, "Service Type : " + ev.getInfo().getType());
						}

						@Override
						public void serviceRemoved(ServiceEvent ev) {
							Log.d(LOGTAG, "Service removed: " + ev.getName());
						}

					};
					jmdns.addServiceListener(type, listener);

					/*
					 * Advertising a JmDNS Service 

                                         * Construct a service description for registering with JmDNS. 
					 * Parameters: 
					 * type : fully qualified service type name, such as _dynamix._tcp.local
					 * name : unqualified service instance name, such as DynamixInstance 
					 * port : the local port on which the service runs text string describing the service
					 * text : text describing the service
					 */
					serviceInfo = ServiceInfo.create(type,
						"DynamixInstance", 7433,
						"Service Advertisement for Ambient Dynamix");

					/*A Key value map that can be advertised with the service*/
					serviceInfo.setText(getDeviceDetailsMap());
					jmdns.registerService(serviceInfo);
					Log.d(LOGTAG, "Service Type : " + serviceInfo.getType());
					Log.d(LOGTAG, "Service Registration thread complete");
				} catch (IOException e) {
					e.printStackTrace();
					return;
				}
			}
		}).start();

	}

	@Override
	protected void onStop() {
		super.onStop();
		//Unregister services
		if (jmdns != null) {
			if (listener != null) {
				jmdns.removeServiceListener(type, listener);
				listener = null;
			}
			jmdns.unregisterAllServices();
			try {
				jmdns.close();
			} catch (IOException e) {
				e.printStackTrace();
			}
			jmdns = null;
		}
		//Release the lock
		lock.release();
	}

	private InetAddress getLocalIpAddress() {
		WifiManager wifiManager = (WifiManager) getSystemService(Context.WIFI_SERVICE);
		WifiInfo wifiInfo = wifiManager.getConnectionInfo();
		int ipAddress = wifiInfo.getIpAddress();
		InetAddress address = null;
		try {
			address = InetAddress.getByName(String.format(Locale.ENGLISH,
				"%d.%d.%d.%d", (ipAddress & 0xff), (ipAddress >> 8 & 0xff), (ipAddress >> 16 & 0xff), (ipAddress >> 24 & 0xff)));
		} catch (UnknownHostException e) {
			e.printStackTrace();
		}
		return address;
	}

	private Map <String, String> getDeviceDetailsMap() {
		Map <String, String> info = new HashMap <String, String> ();
		info.put("device_name", "my_device_name");
		return info;
	}
}
{% endhighlight %}

Don't forget to include the following permissions in the Android Manifest.
{% highlight xml %}
<uses-permission android:name="android.permission.INTERNET" />
<uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
<uses-permission android:name="android.permission.CHANGE_WIFI_MULTICAST_STATE" />
{% endhighlight %}

Will follow up with a post on how to discover these services from your desktop using python. Cheers!