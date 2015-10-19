---
layout: post
title: Week 2.5 - androidJsBridge. 
comments: True
---

Its been almost two and a half weeks since the GSoC coding period started and it has been nothing less than interesting. Finally, after quite a few hours of coding I've been able to successfully integrate the <a href="https://github.com/vshivam/privly-applications/tree/posting-applications">Posting-Applications</a>, PlainPost and Zerobin, with the Privly Android Application.

The Posting applications being in Javascript created a really interesting problem of integration with the Native Android Code. Something I had never really worked with before.  The solution was however pretty simple. A Js interface is added to the WebView which enables the Js to talk to Java and then depending on the user selection, the Js code for either of the Posting Applications is loaded in the WebView.

{% highlight java %}
WebView w = (WebView)findViewById(R.id.webview_1);
w.getSettings().setJavaScriptEnabled(true);
w.addJavascriptInterface(new JsObject(this), "androidJsBridge");
{% endhighlight %}
The <code>JsObject Class</code> defines the functions that are accessible to Js.

Like,

{% highlight java %}
public class JsObject{

    Context c;

    JsObject(Context callingContext){
        c = callingContext;
    }

    @JavascriptInterface
    public String getDeviceVersion(){
        String deviceVersion= Build.VERSION.RELEASE;
        Log.d("androidJSBridge Version Request",deviceVersion);
        return deviceVersion;
    }
}
{% endhighlight %}

And the Js Code of the Posting-Applications can access these functions by using the androidJsBridge.
For example -

{% highlight js %}
var android_version = androidJsBridge.getDeviceVersion();
{% endhighlight %}

I also pushed some Android specific Js code to the Posting-Applications branch and now, the Android Application is now able to generate PlainPost and ZeroBin Links and allows the user to share the new Privly Urls.

Latest Code for the Android App -- <https://github.com/vshivam/privly-android>