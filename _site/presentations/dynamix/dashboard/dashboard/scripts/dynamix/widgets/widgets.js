/**
When using any ids as an html id, we strip off spaces, periods and plus signs and replace them with an underscore.
**/

DynamixWidgets = {
    widgetsMap : {
        "org.ambientdynamix.contextplugins.hueplugin" : {
            template : 'hueplugin', 
            js : [],
            css: [],
            apply : function(deviceId){
                $('a.colorPicker[data-deviceid="' + deviceId+ '"]').colorPicker({
                    renderCallback: function($elm, toggled) {
                        // https://github.com/PitPik/tinyColorPicker#some-tips
                        if (toggled === true) { 
                            
                        } else if (toggled === false) {
                            
                        } else {
                            console.log($elm.data('deviceid'));
                            var colors = this.color.colors,
                            rgb = colors.RND.rgb;
                            console.log(rgb);
                            var bundle = {
                                TARGET_PLUGIN_ID : "org.ambientdynamix.contextplugins.hueplugin",
                                TARGET_DEVICE_ID : $elm.data('deviceid'),
                                CONNECTION_CONTROL : "CONTROL_COMMAND", 
                                COMMAND_TYPE : "DISPLAY_COLOR", 
                                RED : rgb.r, 
                                BLUE : rgb.b, 
                                GREEN : rgb.g
                            };
                            DynamixUtils.sendCommand(bundle);
                        }
                    }
                });

                $('a.colorPicker[data-deviceid="' + deviceId+  '"]').css({'margin' : 0});

                console.log('select.colorSwitch[data-deviceid="' + deviceId+  '"]');
                 
                $('select.colorSwitch[data-deviceid="' + deviceId+  '"]').on("change", function(e){
                    var bundle;
                    console.log($(this).val());
                    console.log($(this).data('deviceid'));
                    if($(this).val() === "on"){
                        console.log($(this).data('deviceid'));    
                        bundle = {
                            TARGET_PLUGIN_ID : "org.ambientdynamix.contextplugins.hueplugin",
                            TARGET_DEVICE_ID : $(this).data('deviceid'),
                            CONNECTION_CONTROL : "CONTROL_COMMAND", 
                            COMMAND_TYPE : "SWITCH", 
                            DOWN : true
                        };
                    } else {
                        bundle = {
                            TARGET_PLUGIN_ID : "org.ambientdynamix.contextplugins.hueplugin",
                            TARGET_DEVICE_ID : $(this).data('deviceid'),
                            CONNECTION_CONTROL : "CONTROL_COMMAND", 
                            COMMAND_TYPE : "SWITCH", 
                            DOWN : false
                        };
                    }
                    DynamixUtils.sendCommand(bundle);
                });
            },

            watchState : function(deviceId, listener){

                var state = [{
                    deviceId : deviceId, 
                    commandType : "DISPLAY_COLOR", 
                    extras : {
                        BLUE : "0", 
                        GREEN : "0", 
                        RED : "0"
                    }
                }, 
                {
                    deviceId :deviceId, 
                    commandType : "SWITCH", 
                    extras : {
                        DOWN : true
                    }
                }];


                $('a.colorPicker[data-deviceid="' + deviceId+ '"]').colorPicker({
                    renderCallback: function($elm, toggled) {
                        if (toggled === true) { 
                            
                        } else if (toggled === false) {
                            
                        } else {
                            console.log($elm.data('deviceid'));
                            var colors = this.color.colors;
                            var rgb = colors.RND.rgb;
                            state[0]["extras"]["BLUE"] = rgb.b;
                            state[0]["extras"]["GREEN"] = rgb.g;
                            state[0]["extras"]["RED"] = rgb.r;
                            console.log('updating state');
                            console.log(state);
                            listener("org.ambientdynamix.contextplugins.hueplugin", state);
                        }
                    }
                });

                $('select.colorSwitch[data-deviceid="' + deviceId+  '"]').on("change", function(e){
                    console.log($(this).val());
                    console.log($(this).data('deviceid'));
                    if($(this).val() === "on"){
                        state[1]["extras"]["DOWN"] = true;
                    } else {
                        state[1]["extras"]["DOWN"] = false;
                    }
                    listener("org.ambientdynamix.contextplugins.hueplugin", state);
                });

                $('a.colorPicker[data-deviceid="' + deviceId+  '"]').css({'margin' : 0});
            }
        },

        "org.ambientdynamix.contextplugins.ambientmedia" : {
            template : "ambientmedia", 
            js:[], 
            css:["https://maxcdn.bootstrapcdn.com/font-awesome/4.5.0/css/font-awesome.min.css"], 
            apply : function(deviceId){
                var bundle = {
                    TARGET_PLUGIN_ID : "org.ambientdynamix.contextplugins.ambientmedia",
                    TARGET_DEVICE_ID : "", //hack for Ambient Media plugin
                    CONNECTION_CONTROL : "CONTROL_COMMAND", 
                }
                $('div.backwardSeek').on("click", function(e){
                    bundle.COMMAND_TYPE = "PLAYBACK_BACKWARD_SEEK";
                    DynamixUtils.sendCommand(bundle);
                });

                $('div.playPause').on("click", function(e){
                    bundle.COMMAND_TYPE = "PLAYBACK_PLAY_PAUSE";
                    DynamixUtils.sendCommand(bundle);
                });
                console.log($('div.backwardSeek'));
                $('div.forwardSeek').on("click", function(e){
                    bundle.COMMAND_TYPE = "PLAYBACK_FORWARD_SEEK";
                    DynamixUtils.sendCommand(bundle);
                });

                $('div.youtubePlay').on("click", function(e){
                    bundle.COMMAND_TYPE = "DISPLAY_VIDEO";
                    bundle.URL = "http://192.168.1.110/Ode-to-Fire.mp4";
                    DynamixUtils.sendCommand(bundle);
                });

                DynamixUtils.sendCommand(bundle);
            }
        }, 

        "org.ambientdynamix.contextplugins.wemoplugin" : {
            template : "wemoplugin", 
            js:[], 
            css:[], 
            apply : function(deviceId){
                $('select.wemoSwitch[data-deviceid="' + deviceId+  '"]').on("change", function(e){
                    var bundle;
                    console.log($(this).val());
                    console.log($(this).data('deviceid'));
                    if($(this).val() === "on"){
                        console.log($(this).data('deviceid'));    
                        bundle = {
                            TARGET_PLUGIN_ID : "org.ambientdynamix.contextplugins.wemoplugin",
                            TARGET_DEVICE_ID : $(this).data('deviceid'),
                            CONNECTION_CONTROL : "CONTROL_COMMAND", 
                            COMMAND_TYPE : "SWITCH", 
                            DOWN : true
                        };
                    } else {
                        bundle = {
                            TARGET_PLUGIN_ID : "org.ambientdynamix.contextplugins.wemoplugin",
                            TARGET_DEVICE_ID : $(this).data('deviceid'),
                            CONNECTION_CONTROL : "CONTROL_COMMAND", 
                            COMMAND_TYPE : "SWITCH", 
                            DOWN : false
                        };
                    }
                    DynamixUtils.sendCommand(bundle);
                });
            }, 

            watchState : function(deviceId, listener){
                var state = [{
                    deviceId :deviceId, 
                    commandType : "SWITCH", 
                    extras : {
                        DOWN : true
                    }
                }];
                $('select.wemoSwitch[data-deviceid="' + deviceId+  '"]').on("change", function(e){
                    var bundle;
                    console.log($(this).val());
                    console.log($(this).data('deviceid'));
                    if($(this).val() === "on"){
                        state[0]["extras"]["DOWN"] = true;
                    } else {
                        state[0]["extras"]["DOWN"] = false;
                    }
                    listener("org.ambientdynamix.contextplugins.wemoplugin", state);
                });
            }
        }, 
    }
}

