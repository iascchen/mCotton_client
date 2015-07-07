var DDPClient = require("ddp");

var ddpclient = new DDPClient({
    url: 'ws://192.168.199.240:3000/websocket'
});

var my_app_kit_id = "kHu75PXky6azzFyjL";

/*
 * Connect to the Meteor Server
 */
ddpclient.connect(function (error, wasReconnect) {
    // If autoReconnect is true, this callback will be invoked each time
    // a server connection is re-established

    if (error) {
        console.log("DDP connection error!");
        return;
    }

    if (wasReconnect) {
        console.log("Reestablishment of a connection.");
    }

    console.log("connected!");

    /*
     * Subscribe to a Meteor Collection
     */
    ddpclient.subscribe(
        "datamessages",                  // name of Meteor Publish function to subscribe to
         [],                       // any parameters used by the Publish function
        function () {             // callback when the subscription is complete
            console.log("datamessages complete:");
            console.log(ddpclient.collections.datamessages);
        }
    );

    /*
     * Observe a collection.
     */
    var observer = ddpclient.observe("datamessages");

    observer.added = function (id) {
        console.log("[ADDED] to " + observer.data_message + ":  " + id);
    };
    observer.changed = function (id, oldFields, clearedFields) {
        console.log("[CHANGED] in " + observer.data_message + ":  " + id);
        console.log("[CHANGED] old field values: ", oldFields);
        console.log("[CHANGED] cleared fields: ", clearedFields);
    };
    observer.removed = function (id, oldValue) {
        console.log("[REMOVED] in " + observer.data_message + ":  " + id);
        console.log("[REMOVED] previous value: ", oldValue);
    };

    // CRUD

    var message = ddpclient.call(
        'dataMessageInsert',
        [{my_app_kit_id: my_app_kit_id, tem: "16", hum:"50"}],
        function (err, result) {
            // console.log('dataEventInsert, error: ' + error);
            console.log('dataMessageInsert, result: ' + result._id);
        }
    );

    //Debug information

    ddpclient.on('message', function (msg) {
        console.log("ddp message: " + msg);
    });

    /*
     ddpclient.on('socket-close', function (code, message) {
     console.log("Close: %s %s", code, message);
     });

     ddpclient.on('socket-error', function (error) {
     console.log("Error: %j", error);
     });
     */

    // close

    setTimeout(function () {
        // observer.stop();
        ddpclient.close();
    }, 1000);

});
