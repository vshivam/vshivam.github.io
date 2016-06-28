if (typeof PairingUtils === 'undefined') {
    var PairingUtils = {
        pairingCode: null,
        pairingWithLocal: false,
        isPairingCookieAvailable: function () {
            if (PairingUtils.getCookie("dynamixInstanceId") != '' && PairingUtils.getCookie("initKey") != '' && PairingUtils.getCookie("httpToken") != '') {
                return true;
            } else {
                return false;
            }
        },

        isPairingCookieEncrypted: function () {
            if (PairingUtils.getCookie("cookieEncrypted") === "true") {
                return true;
            } else {
                return false;
            }
        },

        getCookie: function (cookie_name) {
            if(typeof CookiesInterface !== 'undefined'){
                return CookiesInterface.getCookie(cookie_name);
            } else {
                var name = cookie_name + "=";
                var ca = document.cookie.split(';');
                for (var i = 0; i < ca.length; i++) {
                    var c = ca[i];
                    while (c.charAt(0) == ' ') c = c.substring(1);
                    if (c.indexOf(name) == 0) return c.substring(name.length, c.length);
                }
                return '';
            }           
        },

        setCookie: function setCookie(cname, cvalue, exdays) {
            if(typeof CookiesInterface !== 'undefined'){
                CookiesInterface.setCookie(cname, cvalue);
            } else {
                var d = new Date();
                d.setTime(d.getTime() + (exdays * 24 * 60 * 60 * 1000));
                var expires = "expires=" + d.toUTCString();
                document.cookie = cname + "=" + cvalue + "; " + expires;
            }
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

        showPasswordDialogConfirmUser: function (callback) {
            if(Dynamix.EncryptionParams.disablePassword) {
                console.log('User password has been disabled. Using default password.');
                PairingUtils.userPassword = Dynamix.EncryptionParams.defaultPassword;
            }
            if(typeof PairingUtils.userPassword !== 'undefined') {
                callback(PairingUtils.userPassword);
            } else {
                console.log('Displaying password confirm popup');
                var popup = '<div data-role="popup" id="confirmUserPasswordPopup" data-transition="pop" style="padding:10px;" data-theme="b">' +
                                '<a href="#" data-rel="back" class="ui-btn ui-corner-all ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right"> Close </a>' +
                                '<h3> Enter password to connect </h3> '+
                                '<form id="returningUserPassword">'+
                                    '<input type="password" id="dynamixUserPassword"/>'+
                                    '<a id="forgotPassword" class="ui-btn ui-corner-all ui-shadow ui-btn-icon-left ui-icon-delete"> Forgot Password </a>' +
                                    '<button type="submit" id="saveNewUser" class="ui-btn ui-corner-all ui-shadow ui-btn-icon-left ui-icon-check"> Connect </button>' +
                                '</form>'+
                            '</div>';

                $.mobile.pageContainer.pagecontainer("getActivePage").find(".ui-content").append(popup);
                // $.mobile.pageContainer.pagecontainer("getActivePage").trigger("create");
                $('#confirmUserPasswordPopup').enhanceWithin();
                $('#confirmUserPasswordPopup').popup({
                        afteropen: function(event, ui){
                            console.log("Password confirm popup opened");
                            $('#dynamixUserPassword').focus();
                        }, 
                        afterclose: function(event, ui) {
                            console.log("Password confirm popup closed");
                            $(this).remove();
                        }, 
                        history : false
                    });

                setTimeout(function(){
                    $('#confirmUserPasswordPopup').popup("open");
                }, 1500);

                $('#confirmUserPasswordPopup').one('submit', function(e){
                    console.log('Submitting confirmUserPasswordPopup form');
                    e.preventDefault();
                    var password = $('#dynamixUserPassword').val();
                    callback($('#dynamixUserPassword').val());
                    $('#confirmUserPasswordPopup').popup("close");
                });

                $('button#forgotPassword').one('click', function(e){
                    console.log('Forgot password');
                    e.preventDefault();
                    $('#confirmUserPasswordPopup').popup("close");
                    Dynamix.binding = false;
                    Dynamix.bound = false;
                    PairingUtils.clearAllCookies();
                    Dynamix.bind();
                });
            }
        },

        showPasswordDialogNewUser: function () {
                var encryptUserDataAndSaveToCookies = function(password){
                PairingUtils.userPassword = password;
                var salt = forge.random.getBytesSync(128);
                var derivedKey = forge.pkcs5.pbkdf2(password, salt, 16, 16);
                var encryptedPairingCode = EncryptionUtils.doAES(PairingUtils.pairingCode, derivedKey, derivedKey);
                var encryptedHttpToken = EncryptionUtils.doAES(Dynamix.httpToken, derivedKey, derivedKey);
                var encryptedDynamixInstanceId = EncryptionUtils.doAES(Dynamix.instance_id, derivedKey, derivedKey);
                var encryptedInitKey = EncryptionUtils.doAES(Dynamix.EncryptionParams.initKey, derivedKey, derivedKey);
                //Save the pairing code because the roles are associated to this pairing code
                PairingUtils.setCookie("pairingCode", encryptedPairingCode, 2);
                PairingUtils.setCookie("httpToken", encryptedHttpToken, 2);
                PairingUtils.setCookie("dynamixInstanceId", encryptedDynamixInstanceId, 2);
                PairingUtils.setCookie("initKey", encryptedInitKey, 2);
                PairingUtils.setCookie("cookieEncrypted", "true", 2);
                PairingUtils.setCookie("salt", forge.util.encode64(salt), 2);
                console.log("User Password : " + password);
                console.log("Base 64 encoded Salt : " + forge.util.encode64(salt));
                console.log("Derived Key : " + derivedKey);
                console.log("Encrypted HTTP Token in Hex : " + encryptedHttpToken);
                console.log("Encrypted Dynamix Instance ID in Hex : " + encryptedDynamixInstanceId);
                console.log("Encrypted Init Key in Hex : " + encryptedInitKey);
                $('#newUserPasswordDialog').popup("close");
                Dynamix.bind();
            };

            if(Dynamix.EncryptionParams.disablePassword){
                console.log('User password has been disabled. Using default password.');
                Dynamix.EncryptionParams.defaultPassword;
                encryptUserDataAndSaveToCookies(Dynamix.EncryptionParams.defaultPassword);
            } else {
                var popup = '<div data-role="popup" id="newUserPasswordDialog" data-transition="pop" style="padding:10px;" data-theme="b" data-dismissible="false">' +
                            '<a href="#" data-rel="back" class="ui-btn ui-corner-all ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right"> Close </a>' +
                            '<h3> Create new Password </h3> '+
                            '<form id="newUserPasswordForm">'+
                                '<input type="password" id="dynamixUserPassword"/>'+
                                '<button type="submit" id="saveNewUser" class="ui-btn ui-corner-all ui-shadow ui-btn-icon-left ui-icon-check"> Save </button>' +
                            '</form>'+
                        '</div>';

                $.mobile.pageContainer.pagecontainer("getActivePage").find(".ui-content").append(popup);
                $('#newUserPasswordDialog').enhanceWithin();
                $('#newUserPasswordDialog').popup({
                    afteropen : function(e, ui){
                        $('#dynamixUserPassword').focus();
                    }, 
                    afterclose: function(event, ui) {
                        $(this).remove();
                    }, 
                    history: false
                });
                $('#newUserPasswordDialog').popup("open");
                $('#newUserPasswordForm').one('submit', function(e){
                    e.preventDefault();
                    var password = $('#dynamixUserPassword').val();
                    encryptUserDataAndSaveToCookies(password);
                });
            }
        },

        showPairingBarCode: function () {
            var popup = '<div data-role="popup" id="qrcodePopup" data-transition="pop" style="padding:10px;" data-theme="a" data-dismissible="false">' +
                            '<a href="#" data-rel="back" class="ui-btn ui-corner-all ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right"> Close </a>' +
                            '<h3> Scan the QR Code </h3> '+
                            '<div id="dynamixPairingQrCode" >'+
                               
                            '</div>'+
                        '</div>';

            $.mobile.pageContainer.pagecontainer("getActivePage").find(".ui-content").append(popup);
            $('#qrcodePopup').enhanceWithin();
            $('#qrcodePopup').popup({
                afterclose: function(event, ui) {
                    console.log('Removing QR Code popup from Dom');
                    $('#qrcodePopup').remove();
                }, 
                history: false
            });

            PairingUtils.pairingCode = (PairingUtils.generateRandomInt(100000000000, 999999999999)).toString();
            console.log("PairingUtils.pairingCode : " + PairingUtils.pairingCode);
            var barCodeDataObject = {"type": "pairing", "pairCode": PairingUtils.pairingCode};
            $('#dynamixPairingQrCode').qrcode(JSON.stringify(barCodeDataObject));

            var instanceListener = function(status) {
                switch(status){
                    case "SUCCESS" :
                        $('#qrcodePopup').popup("close");                                 
                        PairingUtils.addNewUser();
                        break;
                    case "FAILURE" :
                        console.log("Could not retrieve the dynamix instance details from the server");    
                        $('#qrcodePopup').popup("close"); 
                        $('#qrcodePopup').remove();            
                        DynamixListener.onDynamixFrameworkBindError("Could not retrieve the dynamix instance details from the server");  
                        break;
                }
            };    
            var md = forge.md.sha256.create();
            md.update(PairingUtils.pairingCode);
            var hashCodeinHex = md.digest().toHex();
            console.log("Getting instance details for : " + hashCodeinHex);
            PairingUtils.getInstanceDetails(hashCodeinHex, instanceListener);

            /*** If this popup is being shown after confirmPairWithLocal popup, 
            we need to use the timeout. Otherwise, the popup won't show up ***/

            setTimeout(function(){
                console.log("showing pairing qr code popup");
                $('#qrcodePopup').popup("open");
            }, 1500)
        },

        showRoleSharingBarcode : function(roleTokenString) {
            var popup = '<div data-role="popup" id="roleQrcodePopup" data-transition="pop" style="padding:10px;" data-theme="a" data-dismissible="false">' +
                            '<a href="#" data-rel="back" class="ui-btn ui-corner-all ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right"> Close </a>' +
                            '<h3> Scan the QR code to <br/> access your Dashboard!! </h3> <br/>'+
                            '<center><a href="' + Dynamix.dashboard_base_url + roleTokenString + '"> Or click here to debug</a></center><br/>' +
                            '<div id="roleQrCode" >'+
                               
                            '</div>'+
                        '</div>';

            $.mobile.pageContainer.pagecontainer("getActivePage").find(".ui-content").append(popup);
            // $.mobile.pageContainer.pagecontainer("getActivePage").trigger("create");
            $('#roleQrcodePopup').enhanceWithin();
            $('#roleQrcodePopup').popup({
                afterclose: function(event, ui) {
                    console.log('Removing QR Code popup from Dom');
                    $('#roleQrcodePopup').remove();
                }, 
                history: false
            });
            $('#roleQrCode').qrcode(Dynamix.dashboard_base_url + roleTokenString);
            $('#roleQrcodePopup').popup("open"); 
        },

        initPreapprovedToken : function(pairingCode) {
            PairingUtils.pairingCode = pairingCode;
            var instanceListener = function(status) {
                switch(status){
                    case "SUCCESS":
                        PairingUtils.addNewUser();
                        break;
                    case "FAILURE":
                        console.log("Could not retrieve the dynamix instance details from the server");                
                        DynamixListener.onDynamixFrameworkBindError("Could not retrieve the dynamix instance details from the server");  
                        break;
                }
            };
            var md = forge.md.sha256.create();
            md.update(pairingCode);
            var hashCodeinHex = md.digest().toHex();
            PairingUtils.getInstanceDetails(hashCodeinHex, instanceListener);
        },

        getInstanceDetails : function(hashCodeinHex, listener) {
            console.log("Trying to retrieve instance details from the server");
            /** appending date to prevent caching ***/
            var url = Dynamix.pairing_server_address + "getDynamixInstance.php?hash=" + hashCodeinHex + "&date="+encodeURIComponent(new Date().toLocaleString());
            console.log("GET :" + url);
            
            var numOfTries = 60;
            var retrieve = function() {
                var xmlhttp = Dynamix.getXmlHttpRequest();
                xmlhttp.open("GET", url);
                xmlhttp.onreadystatechange = function () {
                    if (xmlhttp.readyState == 4) {
                        if (xmlhttp.status == 200) {
                            var responseObject = JSON.parse(xmlhttp.responseText);
                            if( "error" in responseObject) {
                                console.log("no pairing data found on server for the given hash code");
                                if(numOfTries > 0) {
                                    numOfTries = numOfTries - 1;
                                    setTimeout(retrieve, 1000);
                                } else {
                                    listener("FAILURE");
                                }
                            } else {
                                Dynamix.ip_address = responseObject.instanceIp;
                                Dynamix.port = responseObject.instancePort;
                                Dynamix.instance_id = responseObject.instanceId;
                                Dynamix.EncryptionParams.adf_pubkey = responseObject.instancePublicKey;
                                listener("SUCCESS");
                            }
                        } else {
                            numOfTries = numOfTries - 1;
                            setTimeout(retrieve, 1000);
                            console.log('Error occured while retrieving instance details');
                        }
                    }
                }
                xmlhttp.send();
            };

            retrieve();

        },

        addNewUser : function(){
            EncryptionUtils.generateWebAgentKeyPair();
            var nonce = (PairingUtils.generateRandomInt(100000000000, 999999999999)).toString();
            var signatureString = "pairingCode=" + PairingUtils.pairingCode + "&rnc=" + nonce;
            var pubKeyURLParam = "&tempClientPublicKey=" + encodeURIComponent(Dynamix.EncryptionParams.web_agent_pub_key);
            var pairXmlHttpRequest = Dynamix.getXmlHttpRequest();
            var url = "http://" + Dynamix.ip_address + ":" + Dynamix.port + "/pair?signature=" + encodeURIComponent(EncryptionUtils.doRSA(signatureString, Dynamix.EncryptionParams.adf_pubkey)) + pubKeyURLParam;
            console.log("Pair URL : " + url);
            pairXmlHttpRequest.open("GET", url);
            pairXmlHttpRequest.onreadystatechange = function () {
                if (pairXmlHttpRequest.readyState == 4) {
                    if (pairXmlHttpRequest.status == 200) {
                        var pairResponseDecrypted = EncryptionUtils.decryptRSA(pairXmlHttpRequest.responseText, Dynamix.EncryptionParams.web_agent_private_key);
                        var pairResponse = decodeURIComponent(pairResponseDecrypted);
                        console.log("Response Text : ", pairResponse);
                        var pairResponseObject = JSON.parse(pairResponse);
                        if (pairResponseObject.rnc == nonce) {
                            console.log("nonce matches");
                            Dynamix.EncryptionParams.initKey = pairResponseObject.initKey;
                            Dynamix.httpToken = pairResponseObject.httpToken;
                            console.log("Instance Id : " + Dynamix.instance_id);
                            console.log("HttpToken : " + Dynamix.httpToken);
                            console.log("Init Key : " + Dynamix.EncryptionParams.initKey);
                            PairingUtils.showPasswordDialogNewUser();
                        } else {
                            console.log("nonce doesn't match. possible hack");
                            DynamixListener.onDynamixFrameworkBindError("Could not successfully pair with dynamix.");
                        }
                    } else {
                        DynamixListener.onDynamixFrameworkBindError("Could not successfully pair with dynamix.");
                    }
                }
            }
            pairXmlHttpRequest.send();
        },

        confirmPairWithLocalDialog: function (callback) {
            Dynamix.binding = false;
            var popup = 
                '<div data-role="popup" id="confirmPairWithLocalPopup" data-transition="pop" style="padding:10px;" data-theme="a" data-dismissible="false">' +
                    '<a href="#" data-rel="back" class="ui-btn ui-corner-all ui-btn-a ui-icon-delete ui-btn-icon-notext ui-btn-right"> Close </a>' +
                    '<div>'+
                        'We found a Dynamix instance running on your phone. Do you want to connect ?'+
                        '<a href="#" id="btn-pairWithLocal" class="ui-btn ui-corner-all ui-icon-check">Yes</a>'+
                        '<a href="#" id="btn-dontPairWithLocal" class="ui-btn ui-corner-all ui-icon-delete">No</a>'+
                    '</div>'+
                '</div>';

            $.mobile.pageContainer.pagecontainer("getActivePage").find(".ui-content").append(popup);
            // $.mobile.pageContainer.pagecontainer("getActivePage").trigger("create");
            $('#confirmPairWithLocalPopup').enhanceWithin();
            $('#confirmPairWithLocalPopup').popup({
                afterclose: function(event, ui) {
                    $('#confirmPairWithLocalPopup').remove();
                }, 
                history: false
            });
            $('#confirmPairWithLocalPopup').popup("open"); 

            $('#btn-pairWithLocal').on('click', function(e){
                PairingUtils.pairingWithLocal = true;
                $('#confirmPairWithLocalPopup').popup("close");
                callback(true);
            });

            $('#btn-dontPairWithLocal').on('click', function(e){
                PairingUtils.pairingWithLocal = false;
                $('#confirmPairWithLocalPopup').popup("close");
                callback(false);
            });
        },

        initiateNewLocalPairing : function(){
            PairingUtils.pairingCode = (PairingUtils.generateRandomInt(100000000000, 999999999999)).toString();
            var xmlhttp = Dynamix.getXmlHttpRequest();
            EncryptionUtils.generateWebAgentKeyPair();
            var nonce = (PairingUtils.generateRandomInt(100000000000, 999999999999)).toString();
            var signatureString = "pairingCode=" + PairingUtils.pairingCode + "&rnc=" + nonce;
            var pubKeyURLParam = "&tempClientPublicKey=" + encodeURIComponent(Dynamix.EncryptionParams.web_agent_pub_key);
            console.log(Dynamix.ip_address);
            console.log(Dynamix.port);
            var url ="http://" + Dynamix.ip_address + ":" + Dynamix.port + "/pair?signature=" + encodeURIComponent(EncryptionUtils.doRSA(signatureString, Dynamix.EncryptionParams.adf_pubkey)) + pubKeyURLParam;
            console.log(signatureString);
            console.log(url);
            xmlhttp.open("GET", url);
            xmlhttp.onreadystatechange = function () {
                console.log("initiateNewLocalPairing, onreadystatechange :" + xmlhttp.readyState);
                console.log("initiateNewLocalPairing, status :" + xmlhttp.status);
                if (xmlhttp.readyState == 4) {
                    if (xmlhttp.status == 200) {
                        console.log(xmlhttp.responseText);
                        var decryptedResponse = decodeURIComponent(EncryptionUtils.decryptRSA(xmlhttp.responseText, Dynamix.EncryptionParams.web_agent_private_key));
                        console.log(decryptedResponse);
                        var responseObject = JSON.parse(decryptedResponse);
                        Dynamix.EncryptionParams.initKey = responseObject.initKey;
                        Dynamix.httpToken = responseObject.httpToken;
                        PairingUtils.setCookie("httpToken", Dynamix.httpToken, 2);
                        PairingUtils.setCookie("dynamixInstanceId", "localhost", 2);
                        PairingUtils.setCookie("initKey", Dynamix.EncryptionParams.initKey, 2);
                        console.log(Dynamix.EncryptionParams.initKey);
                        Dynamix.bind();
                    }
                }
            };
            xmlhttp.send();
        },

        generateRandomInt: function (min, max) {
            return Math.floor(Math.random() * (max - min + 1)) + min;
        },
    }
}

if (typeof EncryptionUtils === 'undefined') {
    var EncryptionUtils = {

        generateWebAgentKeyPair: function () {
            var web_agent_keyPair = EncryptionUtils.generateRSAKeyPair();
            Dynamix.EncryptionParams.web_agent_private_key = forge.pki.privateKeyToPem(web_agent_keyPair.privateKey);
            Dynamix.EncryptionParams.web_agent_pub_key = forge.pki.publicKeyToPem(web_agent_keyPair.publicKey);
        },

        generateRSAKeyPair: function () {
            var rsa = forge.pki.rsa;
            var keypair = rsa.generateKeyPair({bits: 2048, e: 0x10001, workers: -1});
            return keypair;
        },

        doRSA: function (stringToBeEncrypted, pubkey) {
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
        },

        decryptRSA: function (encryptedString, privateKey) {
            var privateKey = forge.pki.privateKeyFromPem(privateKey);
            var decrypted = privateKey.decrypt(forge.util.decode64(encryptedString), 'RSA-OAEP', {
                md: forge.md.sha256.create(),
                mgf1: {
                    md: forge.md.sha256.create()
                }
            });
            return decrypted;
        },

        doAES: function (stringToBeEncrypted, key, iv) {
            var input = forge.util.createBuffer(stringToBeEncrypted, 'utf8');
            var cipher = forge.cipher.createCipher('AES-CBC', key);
            cipher.start({iv: iv});
            cipher.update(input);
            cipher.finish();
            return cipher.output.toHex();
        },

        decryptAES: function (encryptedString, key, iv) {
            var decodedString = forge.util.decode64(encryptedString);
            var decipher = forge.cipher.createDecipher('AES-CBC', key);
            decipher.start({iv: iv});
            decipher.update(forge.util.createBuffer(decodedString, 'raw'));
            decipher.finish();
            return decipher.output;
        },

        decryptAESFromHex: function (encryptedHexString, key, iv) {
            var decodedString = forge.util.hexToBytes(encryptedHexString);
            var decipher = forge.cipher.createDecipher('AES-CBC', key);
            decipher.start({iv: iv});
            decipher.update(forge.util.createBuffer(decodedString, 'raw'));
            decipher.finish();
            return decipher.output.data;
        }
    }
}