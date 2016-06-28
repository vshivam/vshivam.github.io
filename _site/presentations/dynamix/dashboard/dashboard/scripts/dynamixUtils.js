DynamixUtils = {

    getContextHandler : function() {
        return this.contextHandler;
    }, 

    bindDynamix : function() {
        var that = this;
        var bindListener = function (status) {
            switch (status) {
                case Dynamix.Enums.BOUND :
                    console.log("Woohoo! We're bound!");
                    that.openDynamixSession();
                    break;
                case Dynamix.Enums.BIND_ERROR :
                    break;
                case Dynamix.Enums.UNBOUND :
                    break;
            }
        };
        Dynamix.bind(bindListener);
    }, 

    openDynamixSession : function() {
        var that = this;

        var openSessionCallback = function (status) {
            console.log("OpenSessionCallback : " + status);
            switch (status) {
                case Dynamix.Enums.SUCCESS :
                    that.createContextHandler();
                    break;
            }
        };     
        
        var sessionListener = function (status, result) {
            console.log("Session Listener : " + status);
            switch (status) {
                case Dynamix.Enums.SESSION_OPENED :
                    console.log(result);
                    break;
                case Dynamix.Enums.SESSION_CLOSED :
                    break;
                case Dynamix.Enums.PLUGIN_UNINSTALLED :
                    console.log(result);
                    break;
                case Dynamix.Enums.PLUGIN_INSTALLED :
                    console.log(result);
                    break;
                case Dynamix.Enums.PLUGIN_ENABLED :
                    console.log(result);
                    break;
                case Dynamix.Enums.PLUGIN_DISABLED :
                    console.log(result);
                    break;
                case Dynamix.Enums.PLUGIN_ERROR :
                    console.log("Error Message : " + result.message);
                    console.log("Plugin name : " + result.plugin.pluginName);
                    console.log("Error Code : " + result.errorCode);
                    break;
            }
        };   

        Dynamix.openDynamixSession({listener: sessionListener, callback: openSessionCallback});
    }, 

    createContextHandler : function () {
        var that = this;
        var createNewHandlerCallback = function (status, handler) {
            switch (status) {
                case Dynamix.Enums.SUCCESS :
                    that.contextHandler = handler;

                    var contextSupportCallback = function(status, result){
                        switch (status) {
                            case Dynamix.Enums.SUCCESS :
                                console.log("Context support approved for org.ambientdynamix.contextplugins.guigeneration");
                                var configuredContextRequestCallback = function(status, result) {
                                    console.log("configuredContextRequest result received");
                                    switch(status){
                                        case Dynamix.Enums.SUCCESS:
                                            Data = JSON.parse(result.ACCESS_PROFILES);
                                            ScopeUtils.loadDataIntoView();
                                        break;
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

                                var pairingCode = null;
                                if(PairingUtils.pairingCode != ""){
                                    pairingCode = PairingUtils.pairingCode;
                                }else {
                                    pairingCode = getUrlParameter('pairingCode');
                                }
                                handler.configuredContextRequest("GET", "org.ambientdynamix.contextplugins.guigeneration",  
                                    "org.ambientdynamix.contextplugins.guigeneration.accessprofiles", 
                                    {params : {ACCESS_TOKEN : pairingCode}, callback : configuredContextRequestCallback});
                                break;
                            case Dynamix.Enums.FAILURE:
                                console.log("Context support was not approved for org.ambientdynamix.contextplugins.guigeneration");
                                break;
                        }
                    };

                    handler.addContextSupport('org.ambientdynamix.contextplugins.guigeneration', 
                        'org.ambientdynamix.contextplugins.guigeneration.accessprofiles', 
                        {callback : contextSupportCallback});
                    break;
            }
        };
        Dynamix.createContextHandler(createNewHandlerCallback);
    }, 

    sendCommand : function(bundle){
        var handler = this.getContextHandler();
        var configuredContextRequestCallback = function(status, result) {
            switch(status){
                case Dynamix.Enums.SUCCESS:
                    console.log("command executed successfully");
                    console.log(result);
                break;
            }
        };

        var params = {
            ACCESS_TOKEN : PairingUtils.pairingCode, 
            OPERATION : "COMMAND"
        };

        for (var attrname in bundle) { 
            if(bundle.hasOwnProperty(attrname)){
                params[attrname] = bundle[attrname]; 
            }
        }

        console.log(params);

        handler.configuredContextRequest("POST", "org.ambientdynamix.contextplugins.guigeneration",  
            "org.ambientdynamix.contextplugins.guigeneration.accessprofiles", {
                params : params, 
                callback : configuredContextRequestCallback
            });        

    }, 

    loadScene : function(sceneName){
        var handler = this.getContextHandler();
        var configuredContextRequestCallback = function(status, result) {
            switch(status){
                case Dynamix.Enums.SUCCESS:
                    console.log("scene loaded successfully");
                    console.log(result);
                break;
            }
        };

        var params = {
            ACCESS_TOKEN : PairingUtils.pairingCode, 
            OPERATION : "SCENE", 
            SCENE : sceneName
        };

        console.log(params);

        handler.configuredContextRequest("POST", "org.ambientdynamix.contextplugins.guigeneration",  
            "org.ambientdynamix.contextplugins.guigeneration.accessprofiles", {
                params : params, 
                callback : configuredContextRequestCallback
            });        

    }, 

    scan : function(pluginId){
        var handler = this.getContextHandler();
        var params = {
            ACCESS_TOKEN : "ADMIN", 
            OPERATION : "SCAN", 
            TARGET_PLUGIN_ID : pluginId
        };

        function configuredContextRequestCallback(status, result){
            console.log(status);
            console.log(result);
        }

        handler.configuredContextRequest("GET", "org.ambientdynamix.contextplugins.guigeneration",  
            "org.ambientdynamix.contextplugins.guigeneration.accessprofiles", {
                params : params, 
                callback : configuredContextRequestCallback
        });   
    }
};
