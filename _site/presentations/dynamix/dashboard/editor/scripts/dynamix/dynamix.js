/**
 * Copyright (C) The Ambient Dynamix Project
 * Licensed under the Apache License, Version 2.0 (the "License").
 * You may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */
/**
 * @fileoverview
 * The Dynamix object allows web applications to control a local Dynamix
 * Framework instance that is running on the device.
 ===============================================================<br/>
 Supported Browsers<br/>
 ===============================================================<br/>
 <ul>
 <li> Standard Android Browser </li>
 <li> Chrome for Android </li>
 <li> Firefox for Android </li>
 <li> Dolphin Browser HD for Android </li>
 <li> Dolphin Browser Mini for Android </li>
 <li> Boat Browser </li>
 <li> Boat Browser Mini </li>
 <li> Maxthon Android Web Browser </li>
 <li> SkyFire Browser </li>
 </ul>
 ===============================================================
 **/
if (typeof Dynamix === 'undefined') {
    /**
     * @namespace Dynamix
     **/
    var Dynamix = {
        // ===============================================================
        // Dynamix Configuration Data (!!USED INTERNALLY - DO NOT MODIFY!!)
        // ===============================================================
        /*
         * Base URL for the Dynamix Web Connector. Note that we need to use
         * '127.0.0.1' and not 'localhost', since on some devices, 'localhost' is
         * problematic.
         */
        dashboard_base_url : "http://shivamverma.info/presentations/dynamix/dashboard/dashboard/?pairingCode=",
        pairing_server_address: "http://pairing.ambientdynamix.org/securePairing/",
        ip_address: "127.0.0.1",
        // List of possible Dynamix ports
        port_list: [18087, 5633, 5634, 5635, 5636, 5637, 6130, 6131,
            6132, 6133, 6134, 8223, 8224, 8225, 8226, 8227, 10026, 10027,
            10028, 10029, 10030, 12224, 12225, 12226, 12227, 12228, 16001,
            16002, 16003, 16004, 16005, 19316, 19317, 19318, 19319],

        // ===============================================================
        // Dynamix Private Data (!!USED INTERNALLY - DO NOT MODIFY!!)
        // ===============================================================
        port: 0,
        binding: false,
        bound: false,
        httpToken: null,
        instance_id: null,
        token_cookie: "DynamixTokenCookie",
        port_cookie: "DynamixPortCookie",
        call_timeout: 1000,
        bind_call_timeout: 5000,
        SUCCESS: 0,
        JAVASCRIPT_ERROR: 100,
        BIND_ERROR: 101,
        HTTP_ERROR: 102,
        JSON_ERROR: 103,

        Callbacks: {},
        Listeners: {},
        Handlers: {},

        EncryptionParams: {
    	    disablePassword: true,
            defaultPassword: 'defaultPassword',
    	    encrypt: true,
            adf_pubkey: null,
            web_agent_pub_key: null,
            web_agent_private_key: null,
            master_key: null, // Key bytes
            initKey: null
        },


        /**
         @readonly
         @enum
         @property {String} Dynamix.Enums.SESSION_OPENED SESSION_OPENED
         @property {String} Dynamix.Enums.SESSION_CLOSED SESSION_CLOSED
         @property {String} Dynamix.Enums.SUCCESS SUCCESS
         @property {String} Dynamix.Enums.WARNING WARNING
         @property {String} Dynamix.Enums.FAILURE FAILURE
         @property {String} Dynamix.Enums.PLUGIN_ENABLED PLUGIN_ENABLED
         @property {String} Dynamix.Enums.PLUGIN_DISABLED PLUGIN_DISABLED
         @property {String} Dynamix.Enums.PLUGIN_INSTALLED PLUGIN_INSTALLED
         @property {String} Dynamix.Enums.PLUGIN_UNINSTALLED PLUGIN_UNINSTALLED
         @property {String} Dynamix.Enums.PLUGIN_ERROR PLUGIN_ERROR
         @property {String} Dynamix.Enums.INSTALL_PROGRESS INSTALL_PROGRESS
         @property {String} Dynamix.Enums.BOUND BOUND
         @property {String} Dynamix.Enums.UNBOUND UNBOUND
         @property {String} Dynamix.Enums.BIND_ERROR BIND_ERROR
         @property {String} Dynamix.Enums.PLUGIN_DISCOVERY_STARTED PLUGIN_DISCOVERY_STARTED
         @property {String} Dynamix.Enums.PLUGIN_DISCOVERY_FINISHED PLUGIN_DISCOVERY_FINISHED
         **/

        Enums: Object.freeze({
            SESSION_OPENED: "SESSION_OPENED",
            SESSION_CLOSED: "SESSION_CLOSED",
            SUCCESS: "SUCCESS",
            WARNING: "WARNING",
            FAILURE: "FAILURE",
            CONTEXT_RESULT: "CONTEXT_RESULT",
            PLUGIN_ENABLED: "PLUGIN_DISABLED",
            PLUGIN_DISABLED: "PLUGIN_DISABLED",
            PLUGIN_INSTALLED: "PLUGIN_INSTALLED",
            PLUGIN_UNINSTALLED: "PLUGIN_UNINSTALLED",
            PLUGIN_INSTALL_FAILED: "PLUGIN_INSTALL_FAILED",
            PLUGIN_ERROR: "PLUGIN_ERROR",
            INSTALL_PROGRESS: "INSTALL_PROGRESS",
            BOUND: "BOUND",
            UNBOUND: "UNBOUND",
            BIND_ERROR: "BIND_ERROR",
            PLUGIN_DISCOVERY_STARTED: "PLUGIN_DISCOVERY_STARTED",
            PLUGIN_DISCOVERY_FINISHED: "PLUGIN_DISCOVERY_FINISHED",
            DYNAMIX_FRAMEWORK_ACTIVE: "DYNAMIX_FRAMEWORK_ACTIVE",
            DYNAMIX_FRAMEWORK_INACTIVE: "DYNAMIX_FRAMEWORK_INACTIVE",
            CONTEXT_LISTENER_REMOVED: "CONTEXT_LISTENER_REMOVED",
            CONTEXT_SUPPORT_REMOVED: "CONTEXT_SUPPORT_REMOVED"
        }),

        amILocal: function (callback, index) {
            try {
                var xmlhttp = Dynamix.getXmlHttpRequest();
                xmlhttp.open("GET", "http://127.0.0.1" + ":" + Dynamix.port_list[index] + "/hello", true);
                console.log("Trying on Port : " + Dynamix.port_list[index]);
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == 4) {
                        console.log("Ready State : 4");
                        if (xmlhttp.status == 200) {
                            console.log("xmlhttp status : 200");
                            Dynamix.port = Dynamix.port_list[index];
                            if(Dynamix.EncryptionParams.encrypt){
                                var decodedResponse = decodeURIComponent(xmlhttp.responseText);
                                var plusSignRemoved = decodedResponse.replace("-----BEGIN+PUBLIC+KEY-----", "-----BEGIN PUBLIC KEY-----");
                                plusSignRemoved = plusSignRemoved.replace("-----END+PUBLIC+KEY-----", "-----END PUBLIC KEY-----");
                                var responseObject = JSON.parse(plusSignRemoved);
                                console.log(responseObject);
                                Dynamix.EncryptionParams.adf_pubkey = responseObject.instancePublicKey;
                                PairingUtils.setCookie("adf_pubkey", responseObject.instancePublicKey, 2);
                                console.log(Dynamix.EncryptionParams.adf_pubkey);
                                PairingUtils.pairingWithLocal = true;
                            }
                            callback(true);
                        } else {
                            console.log("xmlhttp status code : " + xmlhttp.status);
                            if (index == Dynamix.port_list.length - 1) {
                                PairingUtils.pairingWithLocal = false;
                                callback(false);
                            } else {
                                Dynamix.amILocal(callback, index + 1);
                            }
                        }
                    } else {
                        console.log("Ready State : " + xmlhttp.readyState);
                        if (index == Dynamix.port_list.length - 1) {
                            PairingUtils.pairingWithLocal = false;
                            callback(false);
                        }
                    }
                };
                xmlhttp.ontimeout = function () {
                    if (index == Dynamix.port_list.length - 1) {
                        PairingUtils.pairingWithLocal = false;
                        callback(false);
                    }
                };
                xmlhttp.send();
            } catch (err) {
                console.log("Error : ", err);
                callback(false);
            }

        },

        /**
         Binds to the Dynamix Framework.
         @param {function} bindListener The web client should provide a listener which would listen to changes in the bind state.
         @example
         var bindListener = function(status) {
            switch(status) {
                case Dynamix.Enums.BOUND :
                    openDynamixSession();
                    break;
                case Dynamix.Enums.BIND_ERROR :
                    Dynamix.bind(bindListener)
                    break;
                case Dynamix.Enums.UNBOUND :
                    break;
            }
        }
         Dynamix.bind(bindListener);
         */
        bind: function (listener) {
            if(typeof listener!== 'undefined'){
                Dynamix.Listeners['bind-state-listener'] = listener;
            }

            if (!Dynamix.binding) {
                if (!Dynamix.bound) {
                    Dynamix.binding = true;
                    if(!Dynamix.EncryptionParams.encrypt){
                        console.log('Encrypt param set to false, looking for a local dynamix instance');
                         Dynamix.amILocal(function (val) {
                            console.log("amILocal :" + val);
                            if (val) {
                                var httpToken = Dynamix.getCookie("httpToken");
                                if(httpToken !== 'undefined') {
                                    console.log("Found an http token in cookie but encryption is turned off. Making an unpair request");
                                    // This part of the code will clear any pairings from the dynamix instance. 
                                    // We need to make this call when moving from a previously paired connection to an unpaired one. 
                                    var xmlhttp = Dynamix.getXmlHttpRequest();
                                    xmlhttp.open("GET", "http://" + Dynamix.ip_address + ":" + Dynamix.port +"/unpair", false);
                                    xmlhttp.setRequestHeader("httpToken", httpToken);
                                    xmlhttp.onreadystatechange = function () {
                                        if (xmlhttp.readyState == 4) {
                                            if (xmlhttp.status == 200) {    
                                                Dynamix.clearAllCookies();                                            
                                                Dynamix.bindHelper();
                                            } else {
                                                console.log("Unpair request did not succeed. Not trying to bind anymore");
                                                DynamixListener.onDynamixFrameworkBindError("Unpair request did not succeed. Not trying to bind anymore.");
                                                Dynamix.binding = false;
                                            }
                                        }
                                    }
                                    xmlhttp.send();
                                } else {
                                   Dynamix.bindHelper(); 
                                }
                            } else {
                                DynamixListener.onDynamixFrameworkBindError("Could not find a local dynamix instance. Turn on encryption for remote pairing");
                                console.log("Could not find a local dynamix instance. You need to turn on encryption if you need remote pairing");
                            }
                        }, 0);               
                    } else {
                        if (PairingUtils.isPairingCookieAvailable()) {
                            console.log("Pairing cookie is available");
                            if (PairingUtils.isPairingCookieEncrypted()) {
                                console.log("Requesting for user password");

                                var executeMethodOnPassword = function (userPassword) {
                                    console.log("User Password : ", userPassword);
                                    var saltFromCookie = PairingUtils.getCookie("salt");
                                    console.log("Loading salt from cookie : " + saltFromCookie);
                                    var encodedKey = forge.util.encode64(forge.pkcs5.pbkdf2(userPassword, forge.util.decode64(saltFromCookie), 16, 16));
                                    console.log("Base 64 encoded derived key : " + encodedKey);
                                    var derivedKey = forge.pkcs5.pbkdf2(userPassword, forge.util.decode64(saltFromCookie), 16, 16);
                                    console.log("Decrypted Stuff : ");
                                    Dynamix.instance_id = EncryptionUtils.decryptAESFromHex(PairingUtils.getCookie('dynamixInstanceId'), derivedKey, derivedKey);
                                    console.log("Decrypted Instance Id : " + Dynamix.instance_id);
                                    Dynamix.EncryptionParams.initKey = EncryptionUtils.decryptAESFromHex(PairingUtils.getCookie('initKey'), derivedKey, derivedKey);
                                    console.log("Decrypted Init Key : " + Dynamix.EncryptionParams.initKey);
                                    Dynamix.httpToken = EncryptionUtils.decryptAESFromHex(PairingUtils.getCookie('httpToken'), derivedKey, derivedKey);
                                    console.log("Decrypted HTTP Token " + Dynamix.httpToken);
                                    PairingUtils.pairingCode = EncryptionUtils.decryptAESFromHex(PairingUtils.getCookie('pairingCode'), derivedKey, derivedKey);

                                    var numOfTries = 60;
                                    var getInstanceFromId = function (){
                                        try{
                                            var xmlhttp = Dynamix.getXmlHttpRequest();
                                            xmlhttp.open("GET", Dynamix.pairing_server_address + "getInstanceFromId.php?instanceId=" + Dynamix.instance_id);
                                            xmlhttp.onreadystatechange = function () {
                                                if (xmlhttp.readyState == 4) {
                                                    if (xmlhttp.status == 200) {
                                                        var responseObject = JSON.parse(xmlhttp.responseText);
                                                        if("error" in responseObject) {
                                                            DynamixListener.onDynamixFrameworkBindError("Could not retrieve the dynamix instance details from the server");
                                                            PairingUtils.showPasswordDialogConfirmUser(executeMethodOnPassword);
                                                        } else {
                                                            console.log(responseObject);
                                                            Dynamix.ip_address = responseObject.instanceIp;
                                                            Dynamix.port = responseObject.instancePort;
                                                            Dynamix.EncryptionParams.adf_pubkey = responseObject.instancePublicKey;
                                                            EncryptionUtils.generateWebAgentKeyPair();
                                                            Dynamix.bindHelper();
                                                        }
                                                    } else {
                                                        if(numOfTries > 0) {
                                                            numOfTries = numOfTries - 1;
                                                            getInstanceFromId();
                                                        } else {
                                                            DynamixListener.onDynamixFrameworkBindError("Could not retrieve the dynamix instance details from the server");
                                                        }
                                                    }
                                                }
                                            }
                                            xmlhttp.send();
                                        } catch(e){
                                            if(numOfTries > 0){
                                                numOfTries = numOfTries - 1;
                                                getInstanceFromId();
                                            } else {
                                                DynamixListener.onDynamixFrameworkBindError("Could not retrieve the dynamix instance details from the server");
                                            }
                                        }
                                    };

                                    getInstanceFromId();
                                    /*

                                    var xmlhttp = Dynamix.getXmlHttpRequest();
                                    xmlhttp.open("GET", Dynamix.pairing_server_address + "getInstanceFromId.php?instanceId=" + Dynamix.instance_id);
                                    xmlhttp.onreadystatechange = function () {
                                        if (xmlhttp.readyState == 4) {
                                            if (xmlhttp.status == 200) {
                                                var responseObject = JSON.parse(xmlhttp.responseText);
                                                if("error" in responseObject) {
                                                    DynamixListener.onDynamixFrameworkBindError("Could not retrieve the dynamix instance details from the server. Make sure that the password was correct");
                                                    PairingUtils.showPasswordDialogConfirmUser(executeMethodOnPassword);
                                                } else {
                                                    console.log(responseObject);
                                                    Dynamix.ip_address = responseObject.instanceIp;
                                                    Dynamix.port = responseObject.instancePort;
                                                    Dynamix.EncryptionParams.adf_pubkey = responseObject.instancePublicKey;
                                                    EncryptionUtils.generateWebAgentKeyPair();
                                                    Dynamix.bindHelper();
                                                }
                                            }
                                        }
                                    }
                                    xmlhttp.send();
                                    */
                                };
                                PairingUtils.showPasswordDialogConfirmUser(executeMethodOnPassword);
                            } else {
                                console.log("Pairing cookie is not encrypted");
                                Dynamix.instance_id = PairingUtils.getCookie('dynamixInstanceId');
                                Dynamix.EncryptionParams.initKey = PairingUtils.getCookie('initKey');
                                Dynamix.httpToken = PairingUtils.getCookie('httpToken');
                                if(Dynamix.port == 0){
                                    console.log("starting key pair generation");
                                    EncryptionUtils.generateWebAgentKeyPair();
                                    console.log("ending key pair generation");
                                    Dynamix.port = PairingUtils.getCookie(Dynamix.port_cookie);
                                    Dynamix.EncryptionParams.adf_pubkey = PairingUtils.getCookie("adf_pubkey");
                                }
                                console.log(Dynamix.port);
                                console.log(Dynamix.EncryptionParams.adf_pubkey);
                                Dynamix.bindHelper();
                            }
                        } else {
                            console.log("Pairing cookie is unavailable");
                            Dynamix.amILocal(function (val) {
                                console.log("amILocal :" + val);
                                Dynamix.binding = false;
                                if (val) {
                                    PairingUtils.confirmPairWithLocalDialog(function callback(bool){
                                        if(bool){
                                           var pairingCode = getUrlParameter('pairingCode');
                                            if(pairingCode !== 'undefined'){
                                                PairingUtils.initPreapprovedToken(pairingCode);    
                                            } else {
                                                PairingUtils.initiateNewLocalPairing();
                                            }
                                        } else {
                                            PairingUtils.showPairingBarCode();
                                        }
                                    });
                                   
                                } else {
                                    var pairingCode = getUrlParameter('pairingCode');
                                    if(typeof pairingCode !== 'undefined'){
                                        PairingUtils.initPreapprovedToken(pairingCode);
                                    } else {
                                        PairingUtils.showPairingBarCode();
                                    }
                                }
                            }, 0);
                        }                
                    }
                } else {
                    console.log("Dynamix Already Bound!");
                    DynamixListener.onDynamixFrameworkBound();
                }
            } else {
                DynamixListener.onDynamixFrameworkBindError("Dynamix is already binding");
                console.log("Dynamix Already Binding!");
            }
        },

        /**
         * Helper method that is used by Dynamix.bind to attempt to bind on a
         * specific port. This is recursively called with an index into the
         * Dynamix.port_list.
         */
        bindHelper: function () {
            var listener = Dynamix.Listeners['bind-state-listener'];
            // Make sure we're binding
            if (Dynamix.binding) {
                var xmlhttp = Dynamix.getXmlHttpRequest();
                // Set a short timeout
                xmlhttp.timeout = Dynamix.bind_call_timeout;
                if (!Dynamix.EncryptionParams.encrypt) {
                    xmlhttp.open("GET", "http://" + Dynamix.ip_address + ":" + Dynamix.port + "/dynamixbind", true);
                    xmlhttp.onreadystatechange = function () {
                        console.log(xmlhttp.readyState + " " + xmlhttp.status);
                        if (xmlhttp.readyState == 4) {
                            if (xmlhttp.status == 200) {
                                Dynamix.httpToken = xmlhttp.responseText;
                                console.log("Received new http token : " + Dynamix.httpToken);
                                setTimeout(Dynamix.eventLoop, 10);
                                Dynamix.binding = false;
                                Dynamix.bound = true;
                                DynamixListener.onDynamixFrameworkBound();
                                return;
                            } else if (xmlhttp.status == 400) {
                                // We found Dynamix, but there was an error with the
                                // request
                                var r = Dynamix.parameterizeResult(xmlhttp);
                                console.log("Dynamix error during bind on port: " + Dynamix.port+ " " + r.resultMessage);
                                // Set not binding
                                Dynamix.binding = false;
                                DynamixListener.onDynamixFrameworkBindError(r);
                                return;
                            } else if (xmlhttp.status == 403) {
                                // We found Dynamix, but we are not authorized
                                var r = Dynamix.parameterizeResult(xmlhttp);
                                console.log("Authorization error during bind on port: " + Dynamix.port + " " + r.resultMessage);
                                // Set not binding
                                Dynamix.binding = false;
                                DynamixListener.onDynamixFrameworkBindError(r);
                                return;
                            } else {
                                // Failed to bind on port
                                DynamixListener.onDynamixFrameworkBindError("Failed to bind to Dynamix on port: " + Dynamix.port);
                                console.log("Failed to bind to Dynamix on port: " + Dynamix.port);
                            }
                        }
                    };                      
                } else if (Dynamix.EncryptionParams.encrypt) {
                    try{
                        var rnc = PairingUtils.generateRandomInt(100000000000, 999999999999);
                        var md = forge.md.sha256.create();
                        md.update(Dynamix.EncryptionParams.initKey + rnc.toString());
                        var signature = md.digest().toHex();
                        signature = "signature=" + signature + "&rnc=" + rnc;
                        var rsaEncodedString = EncryptionUtils.doRSA(signature, Dynamix.EncryptionParams.adf_pubkey);
                        console.log("Bind URL : " + "http://" + Dynamix.ip_address + ":" + Dynamix.port + "/dynamixBind?data= " + encodeURIComponent(rsaEncodedString) + "&tempClientPublicKey=" + encodeURIComponent(Dynamix.EncryptionParams.web_agent_pub_key));
                        xmlhttp.open("GET",
                            "http://" + Dynamix.ip_address + ":" +
                            Dynamix.port + "/dynamixBind?data=" + encodeURIComponent(rsaEncodedString) +
                            "&tempClientPublicKey=" + encodeURIComponent(Dynamix.EncryptionParams.web_agent_pub_key)
                            , true);
                        xmlhttp.setRequestHeader("httpToken", Dynamix.httpToken);
                        xmlhttp.timeout = 20000;
                        xmlhttp.onreadystatechange = function () {
                            console.log(xmlhttp.readyState + " " + xmlhttp.status);
                            if (xmlhttp.readyState == 4) {
                                if (xmlhttp.status == 200) {
                                    console.log("starting to decrypt");
                                    var decryptedResponse = EncryptionUtils.decryptRSA(xmlhttp.responseText, Dynamix.EncryptionParams.web_agent_private_key);
                                    console.log("ending decryption");
                                    console.log("Decrypted Response : " + decryptedResponse);
                                    console.log("Decode URI Component : " + decodeURIComponent(decryptedResponse));
                                    var bindResponse = JSON.parse(decodeURIComponent(decryptedResponse));
                                    if (Dynamix.EncryptionParams.encrypt) {
                                        if (bindResponse.rnc == rnc) {
                                            console.log(bindResponse.masterKey);
                                            Dynamix.EncryptionParams.master_key = forge.util.decode64(bindResponse.masterKey);
                                            Dynamix.setCookie(Dynamix.token_cookie, Dynamix.httpToken, 1);
                                    Dynamix.setCookie(Dynamix.port_cookie, Dynamix.port, 1);
                                            console.log("Looks like we're bound!");
                                            Dynamix.bound = true;
                                            Dynamix.binding = false;
                                        } else {
                                            console.log("rnc doesnt match, possible hack");
                                        }
                                    }
                                    setTimeout(Dynamix.eventLoop, 10);
                                    DynamixListener.onDynamixFrameworkBound();
                                } else if (xmlhttp.status == 400 || xmlhttp.status == 401 || xmlhttp.status == 403) {
                                    // We found Dynamix, but there was an error with the
                                    // request
                                    var r = Dynamix.parameterizeResult(xmlhttp);
                                    console.log("Dynamix error during bind on port: " + Dynamix.port+ " " + r.resultMessage);
                                    // Set not binding
                                    Dynamix.binding = false;
				    console.log('There is a possibilty that the application was removed from Dynamix. Clearing Cookies and Trying Again');
				    PairingUtils.clearAllCookies();
				    Dynamix.bind();
                                } else {
                                    console.log("Failed to bind on Port :" + Dynamix.port);
                                    // Set not binding
                                    Dynamix.binding = false;
                                    DynamixListener.onDynamixFrameworkBindError(r);
                                    return;
                                }
                            }
                        };
                    } catch(err) {
                        DynamixListener.onDynamixFrameworkBindError(err.message);
                    }
                }
                xmlhttp.send();
            } else {
                console.log("Can only be called when binding!");
            }
        },

        /**
         Unbind dynamix. This'll completely clear all communication with the Dynamix Framework.
         The web client will need to call bind() and start fresh.
         **/
        unbind: function () {
            try {
                var base_url = "http://" + Dynamix.ip_address + ":" + Dynamix.port + "/";
                var endpointParamsString = "dynamixunbind";
                if (Dynamix.EncryptionParams.encrypt) {
                    endpointParamsString = EncryptionUtils.doAES(endpointParamsString, Dynamix.EncryptionParams.master_key, Dynamix.EncryptionParams.master_key);
                }
                var xmlhttp = Dynamix.getXmlHttpRequest();
                xmlhttp.open("GET", base_url + endpointParamsString, false);
                xmlhttp.setRequestHeader("httpToken", Dynamix.httpToken);
                xmlhttp.send();
                if (xmlhttp.status == 503) {
                    console.log("Unbind request status : " + xmlhttp.status);
                    console.log("Unbind call succeeded in Dynamix");
                    Dynamix.onDynamixUnbind();
                } else {
                    Dynamix.onDynamixUnbind();
                }
            } catch (e) {
                console.log("Error unbinding Dynamix: " + e);
                // Notify locally
                Dynamix.onDynamixUnbind();
            }
        },

        /**
         Open a new Dynamix Session. A session can be opened only after the bind call was successful.
         @param {Object} optParams Optional callback and listener
         @example
         var openSessionCallback = function(status) {
            switch(status) {
                case Dynamix.Enums.SUCCESS :
                    createContextHandler();
                    break;
                case Dynamix.Enums.FAILURE : 
                    break;
            }
        };
         //The session listener gets updates when
         //1. Session state changes.
         //2. Plugin state changes.
         var sessionListener = function(status, result) {
            switch(status) {
                case Dynamix.Enums.SESSION_OPENED :
                    break;
                case Dynamix.Enums.SESSION_CLOSED : 
                    break;
                case Dynamix.Enums.PLUGIN_UNINSTALLED :
                    break;
                case Dynamix.Enums.PLUGIN_INSTALLED :
                    break;
                case Dynamix.Enums.PLUGIN_ENABLED :
                    break;
                case Dynamix.Enums.PLUGIN_DISABLED :
                    break;
                case Dynamix.Enums.PLUGIN_ERROR :
                    break;
                case Dynamix.Enums.DYNAMIX_FRAMEWORK_ACTIVE:
                	break;
            	case DYNAMIX_FRAMEWORK_INACTIVE:
            		break;
            }
        };
         Dynamix.openDynamixSession({listener:sessionListener, callback:openSessionCallback});
         **/
        openDynamixSession: function (optParams) {
            var base_url = "http://" + Dynamix.ip_address + ":" + Dynamix.port + "/";
            var endpointParamsString = "opendynamixsession?timestamp=" + Date.now();
            try {
                if (typeof optParams !== 'undefined' && typeof optParams.listener !== 'undefined') {
                    var listenerId = Dynamix.generateGuid();
                    Dynamix.Listeners[listenerId] = optParams.listener;
                    endpointParamsString = endpointParamsString + "&sessionListenerId=" + listenerId;
                }
                if (typeof optParams !== 'undefined' && typeof optParams.callback !== 'undefined') {
                    var callbackId = Dynamix.generateGuid();
                    Dynamix.Callbacks[callbackId] = optParams.callback;
                    endpointParamsString = endpointParamsString + "&callbackId=" + callbackId;
                    console.log(callbackId);
                    console.log(Dynamix.Callbacks[callbackId]);
                }

                if (Dynamix.EncryptionParams.encrypt) {
                    endpointParamsString = EncryptionUtils.doAES(endpointParamsString, Dynamix.EncryptionParams.master_key, Dynamix.EncryptionParams.master_key);
                }
                var xmlhttp = Dynamix.getXmlHttpRequest();
                xmlhttp.open("GET", base_url + endpointParamsString, true);
                xmlhttp.setRequestHeader("httpToken", Dynamix.httpToken);
                xmlhttp.send();
            } catch (e) {
                console.log("Error opening new session:" + e);
            }
        },

        /**
         Creates a new {@link Dynamix.handler context handler}.
         @params {function} callback The callback will receive a newly created context handler on success. The web client will then be able to make requests using this handler object.

         @example
         var createNewHandlerCallback = function(status, handler) {
            switch(status) {
                case Dynamix.Enums.SUCCESS :
                dynamixContextHandler = handler;
                break;
            }
        };
         Dynamix.createContextHandler(createNewHandlerCallback);
         **/
        createContextHandler: function (callback) {
            var callbackId = Dynamix.generateGuid();
            Dynamix.Callbacks[callbackId] = callback;
            var base_url = "http://" + Dynamix.ip_address + ":" + Dynamix.port + "/";
            var endpointParamsString = "createcontexthandler?callbackId=" + callbackId;
            if (Dynamix.EncryptionParams.encrypt) {
                endpointParamsString = EncryptionUtils.doAES(endpointParamsString, Dynamix.EncryptionParams.master_key, Dynamix.EncryptionParams.master_key);
            }
            var xmlhttp = Dynamix.getXmlHttpRequest();
            xmlhttp.open("GET", base_url + endpointParamsString, true);
            xmlhttp.setRequestHeader("httpToken", Dynamix.httpToken);
            xmlhttp.send();
        },

        /**
         * Represents a Context Handler.
         * @constructor
         **/
        handler: function handler(id) {
            this.id = id;
            /**
             Add a new context support to the context handler.
             @param {String} pluginId Plugin Id
             @param {String} contextType Context Type
             @param {object} optParams Optional callback and listener
             @example
             var batteryLevelCallback = function(status, result) {
                switch(status) {
                    case Dynamix.Enums.SUCCESS :
                        break;
                    case Dynamix.Enums.FAILURE :
                        break;
                    case Dynamix.Enums.INSTALL_PROGRESS :
                        break;
                    case Dynamix.Enums.WARNING :
                        break;
                }
            };
             var batteryLevelListener = function(status, result) {
                switch(status) {
                    case Dynamix.Enums.CONTEXT_RESULT :
                        batteryLevel = parseInt(result.batteryLevel);
                        console.log(result.batteryLevel);
                        break;
                }
            };

             dynamixContextHandler.addContextSupport( "org.ambientdynamix.contextplugins.batterylevel",
             "org.ambientdynamix.contextplugins.batterylevel", {callback : batteryLevelCallback , listener : batteryLevelListener, pluginVersion : '2.0.0.1'});
             **/
            this.addContextSupport = function (pluginId, contextType, optParams) {
                try {
                    var base_url = "http://" + Dynamix.ip_address + ":" + Dynamix.port + "/";
                    var endpointParamsString = "addContextSupport?contextHandlerId=" + id +
                        "&contextType=" + contextType + "&pluginId=" + pluginId;
                    if (typeof optParams !== 'undefined') {
                        if (typeof optParams.callback !== 'undefined') {
                            var callbackId = Dynamix.generateGuid();
                            Dynamix.Callbacks[callbackId] = optParams.callback;
                            endpointParamsString = endpointParamsString + "&callbackId=" + callbackId;
                        }
                        if (typeof optParams.listener !== 'undefined') {
                            var listenerId = Dynamix.generateGuid();
                            Dynamix.Listeners[listenerId] = optParams.listener;
                            endpointParamsString = endpointParamsString + "&contextListenerId=" + listenerId;
                        }
                        if (typeof optParams.pluginVersion !== 'undefined') {
                            endpointParamsString = endpointParamsString + "&pluginVersion=" + optParams.pluginVersion
                        }
                    }
                    if (Dynamix.EncryptionParams.encrypt) {
                        endpointParamsString = EncryptionUtils.doAES(endpointParamsString, Dynamix.EncryptionParams.master_key, Dynamix.EncryptionParams.master_key);
                    }
                    var xmlhttp = Dynamix.getXmlHttpRequest();
                    xmlhttp.open("GET", base_url + endpointParamsString, true);
                    xmlhttp.setRequestHeader("httpToken", Dynamix.httpToken);
                    xmlhttp.send();
                } catch (e) {
                    console.log("Add context support failed : " + e);
                }
            };

            /**
             Make a new context request. A context request can only be made if the
             context support request has been made successfully.
             @param {String} pluginId Id of the plugin.
             @param {String} contextType Context type for the context request.
             @param {function} callback a function to which Dynamix would return the context request result object.
             @param {Object} optParams Optional parameters for the request.
             @example
             var voiceControlContextRequestCallback = function(status, result) {
                switch(status) {
                    case Dynamix.Enums.SUCCESS:
                        doSomethingWithResult(result);
                        break;
                }
            };
             dynamixContextHandler.contextRequest("org.ambientdynamix.contextplugins.speechtotext",
             "org.ambientdynamix.contextplugins.speechtotext.voiceresults", voiceControlContextRequestCallback, {pluginVersion : "2.0.1.2"} );
             **/
            this.contextRequest = function (pluginId, contextType, callback, optParams) {
                try {
                    var callbackId = Dynamix.generateGuid();
                    Dynamix.Callbacks[callbackId] = callback;
                    var base_url = "http://" + Dynamix.ip_address + ":" + Dynamix.port + "/";
                    var endpointParamsString = "contextrequest?contextHandlerId=" + id +
                        "&contextType=" + contextType + "&pluginId=" + pluginId +
                        "&callbackId=" + callbackId;
                    if (typeof optParams !== 'undefined' && typeof optParams.pluginVersion !== 'undefined') {
                        endpointParamsString = endpointParamsString + "&pluginVersion=" + optParams.pluginVersion;
                    }
                    if (Dynamix.EncryptionParams.encrypt) {
                        endpointParamsString = EncryptionUtils.doAES(endpointParamsString, Dynamix.EncryptionParams.master_key, Dynamix.EncryptionParams.master_key);
                    }
                    var xmlhttp = Dynamix.getXmlHttpRequest();
                    xmlhttp.open("GET", base_url + endpointParamsString, true);
                    xmlhttp.setRequestHeader("httpToken", Dynamix.httpToken);
                    xmlhttp.send();
                } catch (e) {
                    console.log("Context request failed : " + e);
                }
            };

            /**
             Make a configured request to the Dynamix Framework.
             Since, the request to be made is similar for addConfiguredContextSupport() and configuredContextRequest()
             we pass on the parameters from these methods to makeConfiguredRequest() which makes the relevant REST Request.

             NOTE : This method is used internally and the web client does not need to use this method.
             The client should make use of addConfiguredContextSupport() and configuredContextRequest() as required.
             @private
             */
            makeConfiguredRequest = function (endpoint, method, pluginId, contextType, optParams) {

                /**
                 Converts an object to a string of paramaters which can be appended to a GET URL.
                 */
                var getParamStringFromObject = function (obj) {
                    var str = [];
                    for (var p in obj) {
                        if (obj.hasOwnProperty(p)) {
                            str.push(encodeURIComponent(p) + "=" + encodeURIComponent(obj[p]));
                        }
                    }
                    return str.join("&");
                };

                var xmlhttp = Dynamix.getXmlHttpRequest();
                var method = method.toUpperCase();
                var base_url = "http://" + Dynamix.ip_address + ":" + Dynamix.port + "/";
                var endpointParamsString = endpoint + "?contextHandlerId=" + id +
                    "&contextType=" + contextType + "&pluginId=" + pluginId;

                if (typeof optParams !== 'undefined') {
                    if (typeof optParams.callback !== 'undefined') {
                        var callbackId = Dynamix.generateGuid();
                        Dynamix.Callbacks[callbackId] = optParams.callback;
                        endpointParamsString = endpointParamsString + "&callbackId=" + callbackId;
                    }
                    if (typeof optParams.listener !== 'undefined') {
                        var listenerId = Dynamix.generateGuid();
                        Dynamix.Listeners[listenerId] = optParams.listener;
                        endpointParamsString = endpointParamsString + "&contextListenerId=" + listenerId;
                    }
                    if (typeof optParams.pluginVersion !== 'undefined') {
                        endpointParamsString = endpointParamsString + "&pluginVersion=" + optParams.pluginVersion;
                    }
                }

                if (method == "GET" || method == "POST" || method == "PUT" || method == "DELETE") {
                    //Since this is a GET Request, we'll append every parameter to the URL
                    endpointParamsString = endpointParamsString + "&" + getParamStringFromObject(optParams.params);
                    if (Dynamix.EncryptionParams.encrypt) {
                        endpointParamsString = EncryptionUtils.doAES(endpointParamsString, Dynamix.EncryptionParams.master_key, Dynamix.EncryptionParams.master_key);
                    }
                    xmlhttp.open(method, base_url + endpointParamsString, true);
                    xmlhttp.setRequestHeader("httpToken", Dynamix.httpToken);
                    if (typeof optParams !== 'undefined' && typeof optParams.headers !== 'undefined') {
                        for (var key in optParams.headers) {
                            xmlhttp.setRequestHeader(key, optParams.headers.key);
                        }
                    }
                    xmlhttp.send();
                } else {
                    console.log("Unsupported REST Method");
                }
            };

            /**
             Allows the web clients to make configured context requests. These requests
             can only be made if a context support has been successfully requested.
             @param {String} method The Dynamix Framework supports GET, PUT, POST and DELETE Methods.
             @param {String} pluginId The id of the plugin
             @param {String} contextType The context type.
             @param {Object} optParams The optional parameters.
             @example
             var paramsObject = {color : "red", lux : 22};
             var headerObject = {"Content-type" : "application/x-www-form-urlencoded"};
             dynamixContextHandler.addConfiguredContextSupport("PUT", "org.ambientdynamix.contextplugins.samplepluginid, "org.ambientdynamix.contextplugins.samplecontexttype",
             {pluginVersion : '2.0.0.1', callback : configuredRequestCallback, params : params, headers : headerObject});
             **/
            this.configuredContextRequest = function (method, pluginId, contextType, optParams) {
                makeConfiguredRequest("configuredcontextrequest", method, pluginId, contextType, optParams);
            };

            /**
             Allows the web clients to add configured context support.

             @param {String} method The Dynamix Framework supports GET, PUT, POST and DELETE Methods.
             @param {String} pluginId The id of the plugin
             @param {String} contextType The context type.
             @param {Object} optParams The optional parameters.
             @example
             var paramsObject = {color : "red", lux : 22};
             var headerObject = {"Content-type" : "application/x-www-form-urlencoded"};
             dynamixContextHandler.addConfiguredContextSupport("PUT", "org.ambientdynamix.contextplugins.samplepluginid", "org.ambientdynamix.contextplugins.samplecontexttype",
             {pluginVersion : '2.0.0.1', callback : configuredRequestCallback, listener : configuredRequestListener, params : paramsObject, headers : headerObject});
             **/
            this.addConfiguredContextSupport = function (method, pluginId, contextType, optParams) {
                makeConfiguredRequest("addconfiguredcontextsupport", method, pluginId, contextType, optParams);
            };


            /**
             Get the context support information currently associated with this handler.
             @example
             dynamixContextHandler.getContextSupportInfo();
             */
            this.getContextSupportInfo = function (callback) {
                var callbackId = Dynamix.generateGuid();
                Dynamix.Callbacks[callbackId] = callback;
                var base_url = "http://" + Dynamix.ip_address + ":" + Dynamix.port + "/";
                var endpointParamsString = "getcontextsupport?contextHandlerId=" + this.id + "&callbackId=" + callbackId;
                if (Dynamix.EncryptionParams.encrypt) {
                    endpointParamsString = EncryptionUtils.doAES(endpointParamsString, Dynamix.EncryptionParams.master_key, Dynamix.EncryptionParams.master_key);
                }
                var xmlhttp = Dynamix.getXmlHttpRequest();
                xmlhttp.open("GET", base_url + endpointParamsString, true);
                xmlhttp.setRequestHeader("httpToken", Dynamix.httpToken);
                xmlhttp.send();
            }


            /**
             Remove context support for the given context type.
             @param {String} contextType The contextType for which the support should be removed.
             @param {Object} optParams The optional parameters. The web client can provide an optional callback.
             @example
             var disableVoiceControlPluginCallback = function(status, result) {
                switch(status) {
                    case Dynamix.Enums.FAILURE :
                        break;
                    case Dynamix.Enums.SUCCESS :
                        break;
                }
            };
             dynamixContextHandler.removeContextSupportForContextType("org.ambientdynamix.contextplugins.speechtotext.voiceresults",
             {callback : disableVoiceControlPluginCallback });
             **/
            this.removeContextSupportForContextType = function (contextType, optParams) {
                try {
                    var base_url = "http://" + Dynamix.ip_address + ":" + Dynamix.port + "/";
                    var endpointParamsString = "removecontextsupportforcontexttype?contextHandlerId=" + this.id + "&contextType=" + contextType;
                    if (typeof optParams !== 'undefined' && typeof optParams.callback !== 'undefined') {
                        var callbackId = Dynamix.generateGuid();
                        Dynamix.Callbacks[callbackId] = optParams.callback;
                        endpointParamsString = endpointParamsString + "&callbackId=" + callbackId;
                    }
                    if (Dynamix.EncryptionParams.encrypt) {
                        endpointParamsString = EncryptionUtils.doAES(endpointParamsString, Dynamix.EncryptionParams.master_key, Dynamix.EncryptionParams.master_key);
                    }
                    var xmlhttp = Dynamix.getXmlHttpRequest();
                    xmlhttp.open("GET", base_url + endpointParamsString, true);
                    xmlhttp.setRequestHeader("httpToken", Dynamix.httpToken);
                    xmlhttp.send();
                } catch (e) {
                    console.log("Error removing context support for type : " + contextType + " : " + e);
                }
            };

            /**
             Remove context support for the given context type.
             @param {String} supportId The supportId for which the support should be removed.
             @param {Object} optParams The optional parameters. The web client can provide an optional callback.
             @example
             var removeVoiceControlSupportCallback = function(status, result) {
                switch(status) {
                    case Dynamix.Enums.FAILURE :
                        break;
                    case Dynamix.Enums.SUCCESS :
                        break;
                }
            };
             dynamixContextHandler.removeContextSupportForSupportId("org.ambientdynamix.contextplugins.speechtotext",
             {callback : removeVoiceControlSupportCallback });
             **/
            this.removeContextSupportForSupportId = function (supportId, optParams) {
                try {
                    var base_url = "http://" + Dynamix.ip_address + ":" + Dynamix.port + "/";
                    var endpointParamsString = "removecontextsupportforsupportid?contextHandlerId=" + this.id + "&supportId=" + supportId;
                    if (typeof optParams !== 'undefined' && typeof optParams.callback !== 'undefined') {
                        var callbackId = Dynamix.generateGuid();
                        Dynamix.Callbacks[callbackId] = optParams.callback;
                        endpointParamsString = endpointParamsString + "&callbackId=" + callbackId;
                    }
                    if (Dynamix.EncryptionParams.encrypt) {
                        endpointParamsString = EncryptionUtils.doAES(endpointParamsString, Dynamix.EncryptionParams.master_key, Dynamix.EncryptionParams.master_key);
                    }
                    var xmlhttp = Dynamix.getXmlHttpRequest();
                    xmlhttp.open("GET", base_url + endpointParamsString, true);
                    xmlhttp.setRequestHeader("httpToken", Dynamix.httpToken);
                    xmlhttp.send();
                } catch (e) {
                    console.log("Error removing context support for type : " + contextType + " : " + e);
                }
            };

            /**
             Remove all context support from the given context handler.
             @param {Object} callback
             */
            this.removeAllContextSupport = function (optParams) {
                try {
                    var base_url = "http://" + Dynamix.ip_address + ":" + Dynamix.port + "/";
                    var endpointParamsString = "removeallcontextsupport?contextHandlerId=" + this.id;
                    if (typeof optParams !== 'undefined' && typeof optParams.callback !== 'undefined') {
                        var callbackId = Dynamix.generateGuid();
                        Dynamix.Callbacks[callbackId] = optParams.callback;
                        endpointParamsString = endpointParamsString + "&callbackId=" + callbackId;
                    }
                    if (Dynamix.EncryptionParams.encrypt) {
                        endpointParamsString = EncryptionUtils.doAES(endpointParamsString, Dynamix.EncryptionParams.master_key, Dynamix.EncryptionParams.master_key);
                    }
                    var xmlhttp = Dynamix.getXmlHttpRequest();
                    xmlhttp.open("GET", base_url + endpointParamsString, true);
                    xmlhttp.setRequestHeader("httpToken", Dynamix.httpToken);
                    xmlhttp.send();
                } catch (e) {
                    console.log("Error removing all context support : " + e.message);
                }
            };

            /**
             Open the configuration view defined by the plugin.
             @params {String} pluginId
             @params {Object} optParams optional Paramaters for the request.
             @example
             dynamixContextHandler.openContextPluginConfigurationView('org.ambientdynamix.contextplugins.batterylevel',
             {callback:callback, pluginVersion:'2.0.0.1'});
             */
            this.openContextPluginConfigurationView = function (pluginId, optParams) {
                try {
                    var base_url = "http://" + Dynamix.ip_address + ":" + Dynamix.port + "/";
                    var endpointParamsString = "opencontextpluginconfigurationview?pluginId=" + pluginId;
                    if (typeof optParams !== 'undefined') {
                        if (typeof optParams.callback !== 'undefined') {
                            var callbackId = Dynamix.generateGuid();
                            Dynamix.Callbacks["callbackId"] = optParams.callback;
                            endpointParamsString = endpointParamsString + "&callbackId=" + callbackId;
                        }
                        if (typeof optParams.pluginVersion !== 'undefined') {
                            endpointParamsString = endpointParamsString + "&pluginVersion=" + optParams.pluginVersion;
                        }
                    }
                    if (Dynamix.EncryptionParams.encrypt) {
                        endpointParamsString = EncryptionUtils.doAES(endpointParamsString, Dynamix.EncryptionParams.master_key, Dynamix.EncryptionParams.master_key);
                    }
                    var xmlhttp = Dynamix.getXmlHttpRequest();
                    xmlhttp.open("GET", base_url + endpointParamsString, true);
                    xmlhttp.setRequestHeader("httpToken", Dynamix.httpToken);
                    xmlhttp.send();
                }
                catch (e) {
                    console.log("Error opening context plugin configuration view for plugin Id : " + pluginId);
                }
            }
            ;

            /**
             Open the default configuration view defined by the plugin.
             @params {String} pluginId
             @params {Object} optParams optional parameters for the request.
             @example
             dynamixContextHandler.openDefaultContextPluginConfigurationView('org.ambientdynamix.contextplugins.batterylevel',
             {callback:callback, pluginVersion:'2.0.0.1'});
             */
            this.openDefaultContextPluginConfigurationView = function (pluginId, optParams) {
                try {
                    var base_url = "http://" + Dynamix.ip_address + ":" + Dynamix.port + "/";
                    var endpointParamsString = "opendefaultcontextpluginconfigurationview?pluginId=" + pluginId;
                    if (typeof optParams !== 'undefined') {
                        if (typeof optParams.callback !== 'undefined') {
                            var callbackId = Dynamix.generateGuid();
                            Dynamix.Callbacks["callbackId"] = optParams.callback;
                            endpointParamsString = endpointParamsString + "&callbackId=" + callbackId;
                        }
                        if (typeof optParams.pluginVersion !== 'undefined') {
                            endpointParamsString = endpointParamsString + "&pluginVersion=" + optParams.pluginVersion;
                        }
                    }
                    if (Dynamix.EncryptionParams.encrypt) {
                        endpointParamsString = EncryptionUtils.doAES(endpointParamsString, Dynamix.EncryptionParams.master_key, Dynamix.EncryptionParams.master_key);
                    }
                    var xmlhttp = Dynamix.getXmlHttpRequest();
                    xmlhttp.open("GET", base_url + endpointParamsString, true);
                    xmlhttp.setRequestHeader("httpToken", Dynamix.httpToken);
                    xmlhttp.send();
                } catch (e) {
                    console.log("Error opening default context plugin configuration view for plugin Id : " + pluginId);
                }
            };
        },


        /**
         Retrieve the version of the Ambient Dynamix Framework.
         */
        getDynamixVersion: function () {
            try {
                var base_url = "http://" + Dynamix.ip_address + ":" + Dynamix.port + "/";
                var endpointParamsString = "dynamixVersion"
                if (Dynamix.EncryptionParams.encrypt) {
                    endpointParamsString = EncryptionUtils.doAES(endpointParamsString, Dynamix.EncryptionParams.master_key, Dynamix.EncryptionParams.master_key);
                }
                var xmlhttp = Dynamix.getXmlHttpRequest();
                xmlhttp.open("GET", base_url + endpointParamsString, false);
                xmlhttp.setRequestHeader("httpToken", Dynamix.httpToken);
                xmlhttp.send();
                var response = xmlhttp.responseText;
                if (Dynamix.EncryptionParams.encrypt) {
                    response = EncryptionUtils.decryptAESFromHex(response, Dynamix.EncryptionParams.master_key, Dynamix.EncryptionParams.master_key);
                }
                return {
                    version: response
                };
            } catch (e) {
                console.log("Error getting dynamix version : " + e.message);
            }
        },

        /**
         Set a listener for session changes.
         @param {function} listener
         @param {object} optParams
         @example
         Dynamix.setDynamixSessionListener(listener, {callback:callback});
         */
        setDynamixSessionListener: function (listener, optParams) {
            try {
                var listenerId = Dynamix.generateGuid();
                Dynamix.Listeners[listenerId] = listener;
                var base_url = "http://" + Dynamix.ip_address + ":" + Dynamix.port + "/";
                var endpointParamsString = "setdynamixsessionlistener?sessionListenerId=" + listenerId;
                if (typeof optParams !== 'undefined' && typeof optParams.callback !== 'undefined') {
                    var callbackId = Dynamix.generateGuid();
                    Dynamix.Callbacks[callbackId] = optParams.callback;
                    endpointParamsString = endpointParamsString + "&callbackId=" + callbackId
                }
                if (Dynamix.EncryptionParams.encrypt) {
                    endpointParamsString = EncryptionUtils.doAES(endpointParamsString, Dynamix.EncryptionParams.master_key, Dynamix.EncryptionParams.master_key);
                }
                var xmlhttp = Dynamix.getXmlHttpRequest();
                xmlhttp.open("GET", base_url + endpointParamsString, true);
                xmlhttp.setRequestHeader("httpToken", Dynamix.httpToken);
                xmlhttp.send();
            } catch (e) {
                console.log("Error setting session listener" + e.message);
            }
        },

        /**
         Remove a context handler.
         NOTE : This'll also remove any context support that was added to the context handler and
         the web client will have to request a new handler to make any further context support requests.
         @param {Object} handler The handler object which should be removed.
         @param {Object} optParams The web client can provide an optional callback
         which'll be provided the success or failure state of the request.
         **/
        removeContextHandler: function (handler, optParams) {
            try {
                var base_url = "http://" + Dynamix.ip_address + ":" + Dynamix.port + "/";
                var endpointParamsString = "removecontexthandler?contextHandlerId=" + handler.id;
                if (typeof optParams !== 'undefined' && typeof optParams.callback !== 'undefined') {
                    var callbackId = Dynamix.generateGuid();
                    Dynamix.Callbacks[callbackId] = optParams.callback;
                    endpointParamsString = endpointParamsString + "&callbackId=" + callbackId
                }
                var xmlhttp = Dynamix.getXmlHttpRequest();
                if (Dynamix.EncryptionParams.encrypt) {
                    endpointParamsString = EncryptionUtils.doAES(endpointParamsString, Dynamix.EncryptionParams.master_key, Dynamix.EncryptionParams.master_key);
                }
                xmlhttp.open("GET", base_url + endpointParamsString, true);
                xmlhttp.setRequestHeader("httpToken", Dynamix.httpToken);
                xmlhttp.send();
            } catch (e) {
                console.log("Error removing context handler : " + e);
            }
        },

        /**
         Close the current dynamix session.
         NOTE : This'll also remove any context support that was added by the web client. The client
         will have to open a new session before making any further requests to Dynamix.
         The client will still be bound to Dynamix.

         @param {Object} optParams The web client can provide an optional callback
         which'll be provided the success or failure state of the request.
         **/
        closeDynamixSession: function (optParams) {
            try {
                var base_url = "http://" + Dynamix.ip_address + ":" + Dynamix.port + "/";
                var endpointParamsString = "closedynamixsession?timestamp=" + Date.now();
                if (typeof optParams !== 'undefined' && typeof optParams.callback !== 'undefined') {
                    var callbackId = Dynamix.generateGuid();
                    Dynamix.Callbacks[callbackId] = optParams.callback;
                    endpointParamsString = endpointParamsString + "&callbackId=" + callbackId;

                }
                if (Dynamix.EncryptionParams.encrypt) {
                    endpointParamsString = EncryptionUtils.doAES(endpointParamsString, Dynamix.EncryptionParams.master_key, Dynamix.EncryptionParams.master_key);
                }
                var xmlhttp = Dynamix.getXmlHttpRequest();
                xmlhttp.open("GET", base_url + endpointParamsString, true);
                xmlhttp.setRequestHeader("httpToken", Dynamix.httpToken);
                xmlhttp.send();
            } catch (e) {
                console.log("Error closing dynamix session : " + e);
            }
        },

        /**
         Get information about all the context plugins.
         @params {function} callback method
         @example
         Dynamix.getAllContextPluginInformation();
         **/
        getAllContextPluginInformation: function (callback) {
            try {
                var callbackId = Dynamix.generateGuid();
                Dynamix.Callbacks[callbackId] = callback;
                var base_url = "http://" + Dynamix.ip_address + ":" + Dynamix.port + "/";
                var endpointParamsString = "getallcontextplugininformation" + "?callbackId=" + callbackId;
                if (Dynamix.EncryptionParams.encrypt) {
                    endpointParamsString = EncryptionUtils.doAES(endpointParamsString, Dynamix.EncryptionParams.master_key, Dynamix.EncryptionParams.master_key);
                }
                var xmlhttp = Dynamix.getXmlHttpRequest();
                xmlhttp.open("GET", base_url + endpointParamsString, true);
                xmlhttp.setRequestHeader("httpToken", Dynamix.httpToken);
                xmlhttp.send();
            } catch (e) {
                console.log("Error getting all context plugin information : " + e);
            }
        },

        /**
         Get information about all the context plugins of the given type.
         @param {String} contextType The context type for which the context
         plugins information should be fetched.
         @example
         Dynamix.getAllContextPluginsForType('org.ambientdynamix.contextplugins.batterylevel', callback);
         **/
        getAllContextPluginsForType: function (contextType, callback) {
            try {
                var callbackId = Dynamix.generateGuid();
                Dynamix.Callbacks[callbackId] = callback;
                var base_url = "http://" + Dynamix.ip_address + ":" + Dynamix.port + "/";
                var endpointParamsString = "getallcontextplugininformationfortype?contextType=" + contextType + "&callbackId=" + callbackId;
                if (Dynamix.EncryptionParams.encrypt) {
                    endpointParamsString = EncryptionUtils.doAES(endpointParamsString, Dynamix.EncryptionParams.master_key, Dynamix.EncryptionParams.master_key);
                }
                var xmlhttp = Dynamix.getXmlHttpRequest();
                xmlhttp.open("GET", base_url + endpointParamsString, true);
                xmlhttp.setRequestHeader("httpToken", Dynamix.httpToken);
                xmlhttp.send();
            } catch (e) {
                console.log("Error getting context plugins for the type " + contextType + " : " + e);
            }
        },

        /**
         Get information about all the currently installed context plugins.
         @example
         Dynamix.getInstalledContextPlugins(callback);
         **/
        getInstalledContextPlugins: function (callback) {
            try {
                var callbackId = Dynamix.generateGuid();
                Dynamix.Callbacks[callbackId] = callback;
                var base_url = "http://" + Dynamix.ip_address + ":" + Dynamix.port + "/";
                var endpointParamsString = "getinstalledcontextplugininformation?callbackId=" + callbackId;
                if (Dynamix.EncryptionParams.encrypt) {
                    endpointParamsString = EncryptionUtils.doAES(endpointParamsString, Dynamix.EncryptionParams.master_key, Dynamix.EncryptionParams.master_key);
                }
                var xmlhttp = Dynamix.getXmlHttpRequest();
                xmlhttp.open("GET", base_url + endpointParamsString, true);
                xmlhttp.setRequestHeader("httpToken", Dynamix.httpToken);
                xmlhttp.send();
            } catch (e) {
                console.log("Error getting context plugins for the type " + contextType + " : " + e);
            }
        },

        /**
         Get information about a particular plugin.
         @param {String} pluginId The plugin id for which the information should be fetched.
         @example
         Dynamix.getContextPluginInformation('org.ambientdynamix.contextplugins.batterylevel', callback);
         **/
        getContextPluginInformation: function (pluginId, callback) {
            try {
                var callbackId = Dynamix.generateGuid();
                Dynamix.Callbacks[callbackId] = callback;
                var base_url = "http://" + Dynamix.ip_address + ":" + Dynamix.port + "/";
                var endpointParamsString = "getcontextplugininformation?pluginId=" + pluginId + "&callbackId=" + callbackId;
                if (Dynamix.EncryptionParams.encrypt) {
                    endpointParamsString = EncryptionUtils.doAES(endpointParamsString, Dynamix.EncryptionParams.master_key, Dynamix.EncryptionParams.master_key);
                }
                var xmlhttp = Dynamix.getXmlHttpRequest();
                xmlhttp.open("GET", base_url + endpointParamsString, true);
                xmlhttp.setRequestHeader("httpToken", Dynamix.httpToken);
                xmlhttp.send();
            } catch (e) {
                console.log("Error getting plugin information for the pluginId " + pluginId + " : " + e);
            }
        },

        /**
         * Indicates if a Dynamix request call was accepted for processing. Note
         * that results are sent via DynamixListener events.
         @private
         */
        Result: function (success, resultCode, resultMessage) {
            // True if successful; false otherwise.
            this.success = success;
            // The result code
            this.resultCode = resultCode;
            // The result message
            this.resultMessage = decodeURIComponent(resultMessage);
            // We return 'this' so that eval-based object creation works
            return this;
        },

        /**
         * Used to test browser security by setting illegal request header values.
         @private
         */
        testSecurity: function () {
            var xmlhttp = Dynamix.getXmlHttpRequest();
            try {
                xmlhttp.open("GET", Dynamix.ip_address + ":" + Dynamix.port + "/isDynamixActive", false);
                xmlhttp.setRequestHeader('Referer', 'http://www.fakereferer.com/');
                xmlhttp.setRequestHeader('Origin', 'http://www.fakeorigin.com/');
                xmlhttp.send();
                return Dynamix.getBooleanFromResponse(xmlhttp);
            } catch (e) {
                console.log("Error connecting to Dynamix: " + e);
                return false;
            }
        },


        /**
         * Returns true if Dynamix is active; false otherwise.
         NOTE : The Dynamix Framework becomes inactive when the device screen turns off
         and active again when the screen is turned on.
         */
        isDynamixActive: function () {
            try {
                var base_url = "http://" + Dynamix.ip_address + ":" + Dynamix.port + "/";
                var endpointParamsString = "isdynamixactive";
                if (Dynamix.EncryptionParams.encrypt) {
                    endpointParamsString = EncryptionUtils.doAES(endpointParamsString, Dynamix.EncryptionParams.master_key, Dynamix.EncryptionParams.master_key);
                }
                var xmlhttp = Dynamix.getXmlHttpRequest();
                xmlhttp.open("GET", base_url + endpointParamsString, false);
                xmlhttp.setRequestHeader("httpToken", Dynamix.httpToken);
                xmlhttp.send();
                return Dynamix.getBooleanFromResponse(xmlhttp);
            } catch (e) {
                console.log("Error connecting to Dynamix: " + e);
                return false;
            }
        },


        /**
         * Returns true if the specified token is valid (i.e. registered by
         * Dynamix); false otherwise.
         @private
         */
        isTokenValid: function (token) {
            try {
                var base_url = "http://" + Dynamix.ip_address + ":" + Dynamix.port + "/";
                var endpointParamsString = "isDynamixTokenValid";
                if (Dynamix.EncryptionParams.encrypt) {
                    endpointParamsString = EncryptionUtils.doAES(endpointParamsString, Dynamix.EncryptionParams.master_key, Dynamix.EncryptionParams.master_key);
                }
                var xmlhttp = Dynamix.getXmlHttpRequest();
                xmlhttp.open("GET", base_url + endpointParamsString, false);
                xmlhttp.setRequestHeader("httpToken", Dynamix.httpToken);
                xmlhttp.send();
                return Dynamix.getBooleanFromResponse(xmlhttp);
            } catch (e) {
                console.log("Error connecting to Dynamix: " + e);
                return false;
            }
        },

        /**
         Returns true if the web client's session is open; false otherwise.
         @example
         Dynamix.isSessionOpen();
         */
        isSessionOpen: function () {
            try {
                var base_url = "http://" + Dynamix.ip_address + ":" + Dynamix.port + "/";
                var endpointParamsString = "isdynamixsessionopen";
                if (Dynamix.EncryptionParams.encrypt) {
                    endpointParamsString = EncryptionUtils.doAES(endpointParamsString, Dynamix.EncryptionParams.master_key, Dynamix.EncryptionParams.master_key);
                }
                var xmlhttp = Dynamix.getXmlHttpRequest();
                xmlhttp.open("GET", base_url + endpointParamsString, false);
                xmlhttp.setRequestHeader("httpToken", Dynamix.httpToken);
                xmlhttp.send();
                return Dynamix.getBooleanFromResponse(xmlhttp);
            } catch (e) {
                console.log("Error connecting to Dynamix: " + e);
                return false;
            }
        },

        // ===============================================================
        // Dynamix Event Handlers (used internally only)
        // ===============================================================

        // onDynamixUnbind
        onDynamixUnbind: function () {
            // Set not bound
            Dynamix.bound = false;
            Dynamix.binding = false;
            Dynamix.bind_index = 0;
            // Remove our token
            Dynamix.httpToken = null;
            // Notify listener
            DynamixListener.onDynamixFrameworkUnbound();
        },

        // getXmlHttpRequest
        getXmlHttpRequest: function () {
            /*
             * Cross platform link:
             * http://stackoverflow.com/questions/1203074/firefox-extension-multiple-xmlhttprequest-calls-per-page
             */
            var xmlhttp = false;
            if (window.XMLHttpRequest) { // Mozilla, Safari,...
                xmlhttp = new XMLHttpRequest();
                if (xmlhttp.overrideMimeType) {
                    /*
                     * Override Mime type to prevent some browsers from trying to
                     * parse responses as XML (e.g., Firefox).
                     */
                    xmlhttp.overrideMimeType('text/plain');
                    /* Can't use timeouts in some browsers for sync calls */
                    // xmlhttp.timeout = Dynamix.call_timeout;
                }
            } else if (window.ActiveXObject) { // IE
                try {
                    xmlhttp = new ActiveXObject("Msxml2.XMLHTTP");

                    /*
                     * Override Mime type to prevent some browsers from trying to
                     * parse responses as XML (e.g., Firefox).
                     */
                    xmlhttp.overrideMimeType('text/plain');
                    /* Can't use timeouts in some browsers for sync calls */
                    // xmlhttp.timeout = Dynamix.call_timeout;
                } catch (e) {
                    try {
                        xmlhttp = new ActiveXObject("Microsoft.XMLHTTP");
                        /*
                         * Override Mime type to prevent some browsers from trying
                         * to parse responses as XML (e.g., Firefox).
                         */
                        xmlhttp.overrideMimeType('text/plain');
                        /* Can't use timeouts in some browsers for sync calls */
                        // xmlhttp.timeout = Dynamix.call_timeout;
                    } catch (e) {
                    }
                }
            }
            return xmlhttp;
        },

        // eventLoop
        eventLoop: function () {
            if (Dynamix.bound) {
                // Create the xmlHttp request
                var xmlhttp = Dynamix.getXmlHttpRequest();
                // Set 12 second timeout
                xmlhttp.timeout = 12000;
                // Handle state changes
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == 4) {
                        if (!Dynamix.bound) {
                            console.log("Dynamix.eventLoop: Dynamix Not Bound.... exiting event loop");
                            return;
                        }
                        // If eventLoop has JavaScript statement to execute
                        if (xmlhttp.status == 200) {
                            // URI decode the response
                            var response = xmlhttp.responseText;
                            if (Dynamix.EncryptionParams.encrypt) {
                                response = EncryptionUtils.decryptAESFromHex(response, Dynamix.EncryptionParams.master_key, Dynamix.EncryptionParams.master_key);
                                console.log("DecryptedResponse : " + response);
                            }
                            var msg = decodeURIComponent(response);
                            msg = msg.replace(/\+/g,' ')
                            console.log(msg);
                            var msgObj;
                            try {
                                msgObj = JSON.parse(msg);
                            } catch (e) {
                                console.log(e.message);
                            }

                            if (msgObj.callbackId !== 'undefined' && msgObj.method !== 'undefined' && msgObj.params !== 'undefined') {
                                setTimeout(
                                    function () {
                                            if(msgObj.params == null){
                                                msgObj.params = {};
                                            }
                                            window["DynamixListener"][msgObj.method](msgObj.callbackId, msgObj.params);
                                    }, 1);
                                setTimeout(Dynamix.eventLoop, 1);
                            } else {
                                Dynamix.unbind();
                                console.log("Dynamix.eventLoop Security Error: Detected non-Dynamix JavaScript call.  Stopping eventLoops.");
                                return;
                            }

                        }

                        /*
                         * If there are no events to send, Dynamix will send us HTTP
                         * 404 (to prevent XHR from timing out).
                         */
                        else if (xmlhttp.status == 404) {
                            setTimeout(Dynamix.eventLoop, 10);
                        }

                        // Handle security error
                        else if (xmlhttp.status == 403) {
                            console.log("Dynamix.eventLoop Error: Invalid token. ");
                            if (!Dynamix.bound) {
                                Dynamix.unbind();
                                return;
                            }
                        }

                        // Handle server is stopping
                        else if (xmlhttp.status == 503) {
                            console.log("Dynamix.eventLoop Error: Service unavailable.");
                            if (!Dynamix.bound) {
                                Dynamix.unbind();
                                return;
                            }
                        }

                        // Handle bad request
                        else if (xmlhttp.status == 400) {
                            console.log("Dynamix.eventLoop Error: Bad request..");
                            if (!Dynamix.bound) {
                                Dynamix.unbind();
                                return;
                            }
                        }

                        // Finally, handle error
                        else {
                            console.log("Http Request status : " + xmlhttp.status);
                            console.log("Dynamix.eventLoop Error: Request failed.");
                            /*
                             * Don't unbind here, since we may be unloading the
                             * page, and we want to keep our token valid for
                             * subsequent Dynamix-enabled pages.
                             */
                        }
                    }
                };

                // Connect to the Dynamix event callback
                var endpointParamsString = "eventcallback";
                if (Dynamix.EncryptionParams.encrypt) {
                    endpointParamsString = EncryptionUtils.doAES(endpointParamsString, Dynamix.EncryptionParams.master_key, Dynamix.EncryptionParams.master_key);
                }
                xmlhttp.open("GET", "http://" + Dynamix.ip_address + ":" + Dynamix.port + "/" + endpointParamsString, true);
                xmlhttp.setRequestHeader("httpToken", Dynamix.httpToken);
                xmlhttp.send();
            } else {
                console.log("Dynamix.eventLoop: Dynamix Not Bound.... exiting event loop");
            }
        },

        // setCookie
        setCookie: function (c_name, value, exdays) {
            var exdate = new Date();
            exdate.setDate(exdate.getDate() + exdays);
            var c_value = encodeURI(value) + ((exdays == null) ? "" : "; expires=" + exdate.toUTCString());
            document.cookie = c_name + "=" + c_value;
        },

        // getCookie
        getCookie: function (c_name) {
            var i, x, y, ARRcookies = document.cookie.split(";");
            for (i = 0; i < ARRcookies.length; i++) {
                x = ARRcookies[i].substr(0, ARRcookies[i].indexOf("="));
                y = ARRcookies[i].substr(ARRcookies[i].indexOf("=") + 1);
                x = x.replace(/^\s+|\s+$/g, "");
                if (x == c_name) {
                    return decodeURI(y);
                }
            }

            return 'undefined';
        },

        clearAllCookies: function () {

            if(typeof CookiesInterface !== 'undefined'){
                CookiesInterface.clearAllCookies();
            } else {
                var d = new Date();
                var cookies = document.cookie.split(";");
                for (var i = 0; i < cookies.length; i++) {
                    var cookie = cookies[i];
                    var eqPos = cookie.indexOf("=");
                    var name = eqPos > -1 ? cookie.substr(0, eqPos) : cookie;
                    document.cookie = name + "=;expires=Thu, 01 Jan 1970 00:00:00 GMT";
                }
            }
        },

        // getBooleanFromResponse
        getBooleanFromResponse: function (xmlhttp) {
            if (xmlhttp.status == 200) {
                var string;
                if (Dynamix.EncryptionParams.encrypt) {
                    string = EncryptionUtils.decryptAESFromHex(xmlhttp.responseText, Dynamix.EncryptionParams.master_key, Dynamix.EncryptionParams.master_key);
                } else {
                    string = xmlhttp.responseText;
                }
                // Convert 'true' or 'false' strings from the response text
                switch (string.toLowerCase()) {
                    case "true":
                        return true;
                    case "yes":
                        return true;
                    case "1":
                        return true;
                    case "false":
                        return false;
                    case "no":
                        return false;
                    case "0":
                        return false;
                    case null:
                        return false;
                    default:
                        return Boolean(string);
                }
            } else return false;
        },

        /**
         Used by bindHelper
         @private
         */
        parameterizeResult: function (xmlhttp) {
            var nvPairs = decodeURIComponent(xmlhttp.responseText).split(",");
            if (xmlhttp.status == 200) {
                if (nvPairs[0] == Dynamix.SUCCESS) {
                    return new Dynamix.Result(true, nvPairs[0], nvPairs[1]);
                } else {
                    return new Dynamix.Result(false, nvPairs[0], nvPairs[1]);
                }
            } else {
                console.log("HTTP Error: " + xmlhttp.status);
                return new Dynamix.Result(false, Dynamix.HTTP_ERROR, "HTTP Error: " + xmlhttp.status);
            }

        },

        /**
         * Generates random guids for the callbacks, listeners and handlers to map to.
         @private
         **/
        generateGuid: function () {
            function _p8(s) {
                var p = (Math.random().toString(16) + "000000000").substr(2, 8);
                return s ? "-" + p.substr(0, 4) + "-" + p.substr(4, 4) : p;
            }

            return _p8() + _p8(true) + _p8(true) + _p8();
        }
    };

    function getUrlParameter(paramName) {
        var sPageURL = window.location.search.substring(1);
        if(sPageURL.slice(-1) == '/'){
            sPageURL = sPageURL.slice(0, -1);
        }
        var sURLVariables = sPageURL.split('&');
        for (var i = 0; i < sURLVariables.length; i++) {
            var sParameterName = sURLVariables[i].split('=');
            if (sParameterName[0] == paramName) {
                return sParameterName[1];
            }
        }
    }  
}

/**
 * Setup cross-platform unload handling that removes the Dynamix listener
 * automatically when the user navigates away from the page. See:
 * http://stackoverflow.com/questions/8508987/webkit-chrome-or-safary-way-doing-ajax-safely-on-onunload-onbeforeunload
 * @private
 */
// Browser detection
var Browser = {
    IE: !!(window.attachEvent && !window.opera),
    Opera: !!window.opera,
    WebKit: navigator.userAgent.indexOf('AppleWebKit/') > -1,
    Gecko: navigator.userAgent.indexOf('Gecko') > -1 && navigator.userAgent.indexOf('KHTML') == -1,
    MobileSafari: !!navigator.userAgent.match(/Apple.*Mobile.*Safari/)
};

/**
 * Sets up an unload function for all browsers to work (onunload or
 * onbeforeunload)
 * @private
 */
function onUnload(func) {
    if (Browser.WebKit) {
        window.onbeforeunload = func;
    } else {
        window.onunload = func;
    }
}

/**
 * Handle unload.
 * @private
 */
function unload() {
    if (true) {
        console.log("Page Unload. Dynamix unbind requested");
        Dynamix.unbind();
    }
}

/**
 * Handle unload.
 * @private
 */
window.onload = function () {
    console.log("setting unload function");
    onUnload(function () {
        unload();
    });
}

/**
 * @private
 * The DynamixListener methods are called internally by the Dynamix Framework,
 * these methods then fire the relevant callback and listener methods that were
 * provided by the web client. The web client does not need to use the
 * DynamixListener methods directly.
 **/
if (typeof DynamixListener === "undefined") {

    /**
     @namespace DynamixListener
     @private
     **/
    var DynamixListener = {

        /**
         * Called after the web client successfully binds itself with the Dynamix Framework.
         * This is turn raises the listener provided by the web client while making a bind request.
         * The web client after this can successfully open a session with Dynamix.
         */
        onDynamixFrameworkBound: function () {
            Dynamix.Listeners['bind-state-listener'](Dynamix.Enums.BOUND);
        },

        /**
         * Called after the web client loses connection to Dynamix. Raised in
         * response to 'Dynamix.unbind()' or Dynamix Framework initiated unbinds.
         * This is turn raises the listener provided by the web client while making a bind request.
         * The web client can no more open sessions with Dynamix before binding again.
         **/
        onDynamixFrameworkUnbound: function () {
            console.log("onDynamixFrameworkUnbound");
            Dynamix.Listeners['bind-state-listener'](Dynamix.Enums.UNBOUND);
        },

        /**
         * Called if no connection can be established to Dynamix. Note that it is
         * NOT possible to interact with Dynamix if this event is raised.
         */
        onDynamixFrameworkBindError: function (result) {
            console.log("onDynamixFrameworkBindError");
            Dynamix.Listeners['bind-state-listener'](Dynamix.Enums.BIND_ERROR);
        },

        /**
         * Called when the web client's session has opened.
         * This in turn calls the listener provided by the web client when opening a session.
         * The web client needs to open a session after it is successfully
         * bound with Dynamix. The client can then create a handler using
         * which it can make context requests to the Dynamix Framework.
         **/
        onSessionOpened: function (listenerId, result) {
            console.log("onSessionOpened");
            if (Dynamix.EncryptionParams.encrypt) {
            }
            Dynamix.Listeners[listenerId](
                Dynamix.Enums.SESSION_OPENED);
        },

        /**
         * Called when the web client's Dynamix session has closed. This in turn will
         * raise the session listener provided by the web client when opening a new Session.
         *
         * After this event the web client cannot make requests to the Dynamix Framework except
         * apart from unbinding or opening new sessions.
         **/
        onSessionClosed: function (listenerId) {
            console.log("onSessionClosed");
            Dynamix.Listeners[listenerId](
                Dynamix.Enums.SESSION_CLOSED);
        },

        /**
         * Called when the session is successfully opened and raises
         * the callback provided by the web client when opening a Session.
         **/
        onSessionCallbackSuccess: function (callbackId) {
            console.log("onSessionCallbackSuccess");
            console.log(Dynamix.Callbacks[callbackId]);
            Dynamix.Callbacks[callbackId](
                Dynamix.Enums.SUCCESS);
        },

        /**
         * Called when the Dynamix Framework becomes active.
         **/
        onDynamixFrameworkActive: function (listenerId) {
            console.log("onDynamixFrameworkActive");
            Dynamix.Listeners[listenerId](Dynamix.Enums.DYNAMIX_FRAMEWORK_ACTIVE);
        },

        /**
         * Called when the Dynamix Framework becomes inactive.
         */
        onDynamixFrameworkInactive: function (listenerId) {
            console.log("onDynamixFrameworkInactive");
            Dynamix.Listeners[listenerId](Dynamix.Enums.DYNAMIX_FRAMEWORK_INACTIVE);
        },

        /**
         * Raised when a handler is successfully created and in turn
         * provides a new handler object to the callback provided by the web client
         * when creating a new context handler.
         **/
        onContextHandlerCallbackSuccess: function (callbackId, result) {
            try {
                var contextHandlerId = result.handlerId;
                var handler = new Dynamix.handler(
                    contextHandlerId);
                Dynamix.Handlers[contextHandlerId] = handler;
                Dynamix.Callbacks[callbackId](
                    Dynamix.Enums.SUCCESS, handler);
            } catch (e) {
                console.log(" Couldnt pass newly created handler to callback :" + e);
            }
        },

        /**
         * The following onContextSupportCallback* methods in turn raise the callback that
         * was provided while adding the context support.
         **/

        /**
         * Called when the context support requested by the web client was added successfully.
         **/
        onContextSupportCallbackSuccess: function (callbackId, result) {
            Dynamix.Callbacks[callbackId](
                Dynamix.Enums.SUCCESS, result.supportInfo);
        },

        /**
         * Called when the context support requested by the web client was added successfully.
         **/
        onContextSupportCallbackWarning: function (callbackId, result) {
            Dynamix.Callbacks[callbackId](
                Dynamix.Enums.WARNING, result);
        },

        /**
         * Called when the context support requested by the web client failed.
         **/
        onContextSupportCallbackFailure: function (callbackId, result) {
            Dynamix.Callbacks[callbackId](
                Dynamix.Enums.FAILURE, result);
        },

        /**
         * Called when a plugin installation is in progress with the %age progress.
         **/
        onContextSupportCallbackProgress: function (callbackId, result) {
            Dynamix.Callbacks[callbackId](
                Dynamix.Enums.INSTALL_PROGRESS, progress);
        },

        onCallbackFailure: function (callbackId, result) {
            Dynamix.Callbacks[callbackId](
                Dynamix.Enums.FAILURE, result);
        },

        onCallbackSuccess: function (callbackId) {
            console.log("CallbackId : " + callbackId);
            console.log(Dynamix.Callbacks[callbackId]);
            Dynamix.Callbacks[callbackId](Dynamix.Enums.SUCCESS);
        },

        /**
         * Called when a new context result is received from the Dynamix Framework.
         * The result is passed to the listener that was provided by the web client
         * while adding the context support.
         **/
        onContextResult: function (listenerId, result) {
            Dynamix.Listeners[listenerId](
                Dynamix.Enums.CONTEXT_RESULT, result);
        },

        onContextListenerRemoved: function (listenerId, result) {
            Dynamix.Listeners[listenerId](Dynamix.Enums.CONTEXT_LISTENER_REMOVED);
        },

        onContextSupportRemoved: function (listenerId, result) {
            Dynamix.Listeners[listenerId](Dynamix.Enums.CONTEXT_SUPPORT_REMOVED, result);
        },

        /**
         * Called when a plugin is enabled. The result
         * is passed on to the listener that was provided by the web client while
         * opening a new session with Dynamix.
         **/
        onContextPluginEnabled: function (listenerId, result) {
            Dynamix.Listeners[listenerId](
                Dynamix.Enums.PLUGIN_ENABLED, result.plugin);
        },

        /**
         * Called when a plugin is disabled. The result
         * is passed on to the listener that was provided by the web client while
         * opening a new session with Dynamix.
         **/
        onContextPluginDisabled: function (listenerId, result) {
            Dynamix.Listeners[listenerId](
                Dynamix.Enums.PLUGIN_DISABLED, result.plugin);
        },

        /**
         * Called when a plugin installation requested by the web client fails.
         **/
        onContextPluginInstallFailed: function (listenerId, result) {
            Dynamix.Listeners[listenerId](Dynamix.Enums.PLUGIN_INSTALL_FAILED, result.plugin);
        },

        /**
         * Called when a plugin is successfully installed. This in turn sends the details of the
         * installed plugin to the listener provided by the web client
         * while opening a new session with Dynamix
         **/
        onContextPluginInstalled: function (listenerId, result) {
            Dynamix.Listeners[listenerId](
                Dynamix.Enums.PLUGIN_INSTALLED, result.plugin);
        },

        /**
         * Called when a plugin is successfully uninstalled. This in turn sends the details of the
         * uninstalled plugin to the listener provided by the web client
         * while opening a new Dynamix Session.
         **/
        onContextPluginUninstalled: function (listenerId, result) {
            Dynamix.Listeners[listenerId](
                Dynamix.Enums.PLUGIN_UNINSTALLED, result.plugin);
        },

        /**
         * Called when an error occurs with the plugin. This in turn sends the details of the
         * error to the listener provided by the web client
         * while opening a new Dynamix Session.
         **/
        onContextPluginError: function (callbackId, result) {
            Dynamix.Listeners[callbackId](
                Dynamix.Enums.PLUGIN_ERROR, result);
        },

        /**
         * Called when a context request made by the web client is successful. Raises the callback
         * that was provided while making the context request with the relevant result.
         **/
        onContextRequestCallbackSuccess: function (callbackId, result) {
            Dynamix.Callbacks[callbackId](Dynamix.Enums.SUCCESS, result);
        },

        /**
         * Called when a context request made by the web client is unsuccessful. Raises the callback
         * that was provided while making the context request with the relevant error message.
         **/
        onContextRequestCallbackFailure: function (callbackId, result) {
            Dynamix.Callbacks[callbackId](
                Dynamix.Enums.FAILURE, result);
        },

        /**
         * Called when the Dynamix Framework starts discovering plugins.
         **/
        onContextPluginDiscoveryStarted: function (listenerId) {
            Dynamix.Listeners[listenerId](Dynamix.Enums.PLUGIN_DISCOVERY_STARTED);
        },

        /**
         * Called when the Dynamix Framework finishes discovering plugins.
         **/
        onContextPluginDiscoveryFinished: function (listenerId, result) {
            Dynamix.Listeners[listenerId](Dynamix.Enums.PLUGIN_DISCOVERY_FINISHED,
                result);
        },

        /**
         * Called when the handler.getContextSupport() method is successful.
         * @param callbackId
         * @param result
         */
        onContextSupportQuerySuccess: function (callbackId, result) {
            Dynamix.Callbacks[callbackId](Dynamix.Enums.SUCCESS, result.supportList);
        },

        /**
         * Called when the handler.getContextSupport() method is unsuccessful.
         * @param callbackId
         * @param result
         */
        onContextSupportQueryFailure: function (callbackId, result) {
            Dynamix.Callbacks[callbackId](Dynamix.Enums.FAILURE, result);
        },

        /**
         * called when GET_CONTEXT_PLUG_IN, GET_ALL_CONTEXT_PLUG_INS, GET_INSTALLED_CONTEXT_PLUG_INS,
         * GET_ALL_CONTEXT_PLUG_INS_FOR_TYPE calls are successful
         * @param callbackId
         * @param result
         */
        onContextPluginQuerySuccess: function (callbackId, result) {
            Dynamix.Callbacks[callbackId](Dynamix.Enums.SUCCESS, result.supportList);
        },

        /**
         * called when GET_CONTEXT_PLUG_IN, GET_ALL_CONTEXT_PLUG_INS, GET_INSTALLED_CONTEXT_PLUG_INS,
         * GET_ALL_CONTEXT_PLUG_INS_FOR_TYPE calls are unsuccessful
         * @param callbackId
         * @param result
         */
        onContextPluginQueryFailure: function (callbackId, result) {
            Dynamix.Callbacks[callbackId](Dynamix.Enums.FAILURE, result);
        }
    };
}
