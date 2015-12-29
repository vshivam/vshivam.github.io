---
layout: post
title: Android, JavaScript and Python compatible RSA Encryption.
comments: True
---

It's somewhat complicated to implement RSA Encryption so that data encrypted on either of these platforms can be easily decrypted on the other platforms and even more so for someone like me who had almost zero knowledge of programming using encryption algorithms. 

While developing an initial pairing mechanism for Ambient Dynamix, I had already settled on the <a href="https://github.com/digitalbazaar/forge">forge</a> library for javascript because of the availability of symmetric, asymmetric encryption algorithms, password based key derivation functions and hashing algorithms. It also had a fair performance according to <a href="http://dominictarr.github.io/crypto-bench/">this</a> evaluation. 

The library also supported decryption using a private key using RSAES-OAEP/SHA-256/MGF1-SHA-256 which is compatible with Java's RSA/ECB/OAEPWithSHA-256AndMGF1Padding algorithm. Big thumbs up!

The idea was to pick up a public key generated on android and use it to encrypt content in javascript. Android should then be able to successfully decrypt the data using its private key. I also needed to support the whole process in reverse <em>i.e.</em> android encrypting the content using a public key generated on javascript and then javascript decrypting it. 

<h2> Encrypting content in javascript and decrypting in java. </h2>

Generating RSA KeyPair on Android: 
{% highlight java %}
public static KeyPair generateRsaKeyPair(int keySize) throws Exception {
    KeyPairGenerator kpg = KeyPairGenerator.getInstance("RSA");
    kpg.initialize(keySize);
    return kpg.generateKeyPair();
}
{% endhighlight %}

To retrieve the public key from the keypair object use the <code>getPublic();</code> method of the <code>KeyPair</code> class.

Once the keypair is generated, I convert the public key into a String which could be then be used by javascript for encrypting content. For my purpose, the public key is sent back as a response to a simple http request made by javascript. 

To convert public key to a String :
{% highlight java %}

private static String PUBLIC_KEY_HEADER = "-----BEGIN PUBLIC KEY-----";
private static String PUBLIC_KEY_FOOTER = "-----END PUBLIC KEY-----";

public static String createStringFromPublicKey(Key publicKey) throws Exception {
    X509EncodedKeySpec x509EncodedKeySpec = new X509EncodedKeySpec(publicKey.getEncoded());
    return PUBLIC_KEY_HEADER + new String(Base64.encode(x509EncodedKeySpec.getEncoded(), Base64.NO_WRAP), "UTF-8")
            + PUBLIC_KEY_FOOTER;
}
{% endhighlight %}

Importing a public key in javascript and encryption :
{% highlight js %}
function doRSA(stringToBeEncrypted, pubkey) {
    var publicKey = forge.pki.publicKeyFromPem(pubkey);
    var buffer = forge.util.createBuffer(stringToBeEncrypted, 'utf8');
    var binaryString = buffer.getBytes();
    var encrypted = publicKey.encrypt(binaryString, 'RSA-OAEP', {
        md: forge.md.sha256.create(),
        mgf1: {
            md: forge.md.sha256.create()
        }
    });
    return forge.util.encode64(encrypted);
}
{% endhighlight %}

<div id="explanation">
The important thing to note here is that I am using SHA-256 in the mask generation function (the mgf1 parameter). I could have very well used SHA-1 and everything would work. However, when implementing the same algorithm on python, it becomes an issue because the python library uses the same hashing mechanism for the message digest and the mask digest but only lets us specify the message digest algorithm. 
</div>

So, now, the base64 encoded encrypted string can safely be sent over a non - encrypted connection to java. 

Decrypting in java :

I'll use the private key generated in the first step to decrypt the content. To get the private key use the <code>getPrivate();</code> method of the <code>KeyPair</code> class. 

{% highlight java %}

private static String RSA_CONFIGURATION = "RSA/ECB/OAEPWithSHA-256AndMGF1Padding";
private static String RSA_PROVIDER = "BC";

public static String decryptRsa(Key key, String base64cypherText) throws Exception {
    Cipher c = Cipher.getInstance(RSA_CONFIGURATION, RSA_PROVIDER);
    c.init(Cipher.DECRYPT_MODE, key, new OAEPParameterSpec("SHA-256", "MGF1", MGF1ParameterSpec.SHA256,
            PSource.PSpecified.DEFAULT));
    byte[] decodedBytes = c.doFinal(Base64.decode(base64cypherText.getBytes("UTF-8"), Base64.DEFAULT));
    String clearText = new String(decodedBytes, "UTF-8");
    return clearText;
}
{% endhighlight %}

<h2> Encrypting content in java and decrypting in javascript. </h2>

Generating RSA KeyPair in javascript: 
{% highlight js %}
function generateRSAKeyPair(keysize) {
    var rsa = forge.pki.rsa;
    var keypair = rsa.generateKeyPair({bits: keysize, e: 0x10001, workers: -1});
    return keypair;
}
{% endhighlight %}

To convert public key to a String :
{% highlight js %}
function getPubKeyPem(keypair) {
    return forge.pki.publicKeyToPem(keypair.publicKey);
}
{% endhighlight %}

The public key pem can easily be transferred over the network.  

Importing a public key in java and encryption:
{% highlight java %}
private static String RSA_CONFIGURATION = "RSA/ECB/OAEPWithSHA-256AndMGF1Padding";
private static String RSA_PROVIDER = "BC";

public static PublicKey createPublicKeyFromString(String publicKeyString) throws Exception {
    KeyFactory keyFactory = KeyFactory.getInstance("RSA");
    publicKeyString = publicKeyString.replace(PUBLIC_KEY_HEADER, "");
    publicKeyString = publicKeyString.replace(PUBLIC_KEY_FOOTER, "");
    return keyFactory.generatePublic(new X509EncodedKeySpec(Base64.decode(publicKeyString, Base64.NO_WRAP)));
}

public static String encryptRsa(Key key, String clearText) throws Exception {
    Cipher c = Cipher.getInstance(RSA_CONFIGURATION, RSA_PROVIDER);
    c.init(Cipher.ENCRYPT_MODE, key, new OAEPParameterSpec("SHA-256", "MGF1", MGF1ParameterSpec.SHA256,
            PSource.PSpecified.DEFAULT));
    byte[] encodedBytes = Base64.encode(c.doFinal(clearText.getBytes("UTF-8")), Base64.DEFAULT);
    String cipherText = new String(encodedBytes, "UTF-8");
    return cipherText;
}
{% endhighlight %}

Decrypting cipher text in javascript : 

The privateKey used in this step can be retrieved from the keypair generated in the first step. 
Use the <code>keypair.privateKey;</code> property. 
{% highlight java %}
   function decryptRSA(encryptedString, privateKey) {
        var decrypted = privateKey.decrypt(forge.util.decode64(encryptedString), 'RSA-OAEP', {
            md: forge.md.sha256.create(),
            mgf1: {
                md: forge.md.sha256.create()
            }
        });
        return decrypted;
    }
{% endhighlight %}

All the above mentioned code is compatible with the following python code and any of the platforms can be switched. For instance, content encrypted on python can be easily decrypted on java. 

For encryption and decryption in python, we'll use the <a href="https://github.com/dlitz/pycrypto">PyCrypto</a> library. 

Generating rsa keypair : 
{% highlight python %}
from Crypto.Protocol.KDF import PBKDF2
from Crypto.Hash import SHA256
from Crypto.PublicKey import RSA
from Crypto.Cipher import PKCS1_OAEP
from Crypto.Cipher import AES
import base64

@staticmethod
def generate_RSA(bits=keysize):
    new_key = RSA.generate(bits, e=65537)
    public_key = new_key.publickey().exportKey("PEM")
    private_key = new_key.exportKey("PEM")
    return private_key, public_key
{% endhighlight %}

Encrypting content :

When creating the cipher, we use SHA256 as the hash algo. Python automatically uses the same algorithm for the message digest and for the mask function digest as mentioned <a href="#explanation">before</a>. 
{% highlight python %}
@staticmethod
def doRSAFromBytes(key, plaintext):
    # Assuming that the public key is coming from java or javascript, 
    # strip off the headers.
    key = key.replace('-----BEGIN PUBLIC KEY-----', '')
    key = key.replace('-----END PUBLIC KEY-----', '');
    # Since it's coming from java/javascript, it's base 64 encoded. 
    # Decode before importing.
    pubkey = RSA.importKey(base64.b64decode(key))
    cipher = PKCS1_OAEP.new(pubkey, hashAlgo=SHA256)
    encrypted = cipher.encrypt(plaintext)
    return base64.b64encode(encrypted)
{% endhighlight %}

Decrypting content : 

The <code>importKey</code> method is used to import private keys from pem strings. I'll use the private_key generated in the first step. 
{% highlight python %}
@staticmethod
def decryptRSA(ciphertext, private_key):
    rsa_key = RSA.importKey(private_key)
    cipher = PKCS1_OAEP.new(rsa_key, hashAlgo=SHA256)
    decrypted = cipher.decrypt(base64.b64decode(ciphertext))
    return decrypted
{% endhighlight %}

Cheers!
