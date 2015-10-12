---
layout: post
title: Generating compatible SHA512 Hash between Java and JavaScript using CryptoJS
---

While working on the development of a secure way for authenticating a remote web application with the Ambient Dynamix Framework, I needed to generate a SHA512 of a salt and token which the web application could transmit to the framework via a dynamically generated QR Code. The Dynamix instance running on the android device can then use this hash to verify the authenticity of any further HTTP requests.

-----

### Generating SHA512 Hash in JavaScript :
The [CryptoJS](https://code.google.com/p/crypto-js/) library provides a multitude of cryptography related features and what I needed to use was the SHA512 Hasher.

To be able to use the hasher, include:

{% highlight html %}
<script type="text/javascript" src="http://crypto-js.googlecode.com/svn/tags/3.1.2/build/components/core-min.js"></script>
<script type="text/javascript" src="http://crypto-js.googlecode.com/svn/tags/3.1.2/build/rollups/sha256.js"></script>
{% endhighlight %}

and then : 

{% highlight javascript %}
//replace saltedToken with the relevant data.
var hashWordArray = CryptoJS.SHA512('saltedToken');
{% endhighlight %}

This returns the SHA512 Hash in a word array which is an array of 32-bit words. Now, to be able to transfer the hash, I encoded the array into a Base64 String so that I could use the same encoding in Java to generate the hash. There are other options too such as encoding into a Hex String.

CryptoJS also provides the encoding feature. To use the encoding methods, include :
{% highlight html %}
<script src="http://crypto-js.googlecode.com/svn/tags/3.1.2/build/components/enc-base64-min.js" type="text/javascript">
{% endhighlight %}

and then :
{% highlight javascript %}
var base64HashString = hashWordArray.toString(CryptoJS.enc.Base64);
{% endhighlight %}

### Generating SHA512 Hash in Java :
Now, to be able to verify the authenticity in Java, for a given String, I should be able to generate the same SHA512 Hash and this can be done using the following code :
{% highlight java %}
MessageDigest md = null;
String saltedToken = "saltedToken";
try {
    md = MessageDigest.getInstance("SHA-512");
    md.update(saltedToken.getBytes());
    byte byteData[] = md.digest();
    String base64 = Base64.encodeToString(byteData, Base64.NO_WRAP);
} catch (NoSuchAlgorithmException e) {
    Log.w(TAG, "Could not load MessageDigest: SHA-512");
    return false;
}
{% endhighlight %}

The important thing to note here is the Base64.NO_WRAP flag which ensures that while encoding, the encoder should omit all line terminators which is exactly what the JS encoder does.

Cheers! :D


