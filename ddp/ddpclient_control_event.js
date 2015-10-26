var DDPClient = require("ddp");

var ddpclient = new DDPClient({
    url: 'ws://192.168.199.240:3000/websocket'
    // url: 'ws://mcotton.microduino.cn/websocket'
});

var device_id = "32rN2SMg4j5oHcyey";

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
        "controlevents",                  // name of Meteor Publish function to subscribe to
        [],                       // any parameters used by the Publish function
        function () {             // callback when the subscription is complete
            console.log("controlevents complete:");
            console.log(ddpclient.collections.controlevents);
        }
    );

    /*
     * Observe a collection.
     */
    var observer = ddpclient.observe("controlevents");

    observer.added = function (id) {
        console.log("[ADDED] to " + observer.name + ":  " + id);
    };
    observer.changed = function (id, oldFields, clearedFields) {
        console.log("[CHANGED] in " + observer.name + ":  " + id);
        console.log("[CHANGED] old field values: ", oldFields);
        console.log("[CHANGED] cleared fields: ", clearedFields);
    };
    observer.removed = function (id, oldValue) {
        console.log("[REMOVED] in " + observer.name + ":  " + id);
        console.log("[REMOVED] previous value: ", oldValue);
    };

    // CRUD

    ddpclient.call(
        'controlEventInsert',
        [{
            device_id: device_id,
            control_name: "Status",
            control_value: "true"
        }],
        function (err, result) {
            console.log('controlEventInsert, error: ' + err);
            console.log('controlEventInsert, result: ' + result._id);
        },
        function () {              // callback which fires when server has finished
            console.log('Inserted');  // sending any updated documents as a result of
            console.log(ddpclient.collections.controlevents);  // calling this method

            ddpclient.call(
                'controlEventsQuery',
                [{
                    device_id: device_id
                }],
                function (err, result) {
                    console.log('controlEventsQuery, error: ' + err);
                    console.log('controlEventsQuery, result: ' + JSON.stringify(result));
                },
                function () {              // callback which fires when server has finished
                    console.log('Queried');  // sending any updated documents as a result of
                    //console.log(ddpclient.collections.controlevents);  // calling this method
                }
            );

            ddpclient.call(
                'controlEventsQuerySmall',
                [{
                    device_id: device_id
                }],
                function (err, result) {
                    console.log('controlEventsQuerySmall, error: ' + err);
                    console.log('controlEventsQuerySmall, result: ' + JSON.stringify(result));
                },
                function () {              // callback which fires when server has finished
                    console.log('Queried Small');  // sending any updated documents as a result of
                    //console.log(ddpclient.collections.controlevents);  // calling this method
                }
            );
        }
    );

    //Debug information
    /*
     ddpclient.on('message', function (msg) {
     console.log("ddp message: " + msg);
     });

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
