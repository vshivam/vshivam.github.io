$(document).ready(function(){

	DynamixUtils.bindDynamix();

    $(document).on("pageshow","#controls-page",function(event){ 
        console.log("pageshow devices page");
        Controls.loadDataIntoView();
    });
	
});