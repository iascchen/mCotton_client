//TODO

var DDPClient = require("ddp"),
    Cylon = require('cylon');
    _ = require('underscore');

var ddpclient = new DDPClient({
    url: 'ws://192.168.199.240:3000/websocket'
    // url: 'ws://mcotton.microduino.cn/websocket'
    // url: 'ws://mcotton-01.chinacloudapp.cn/websocket'
});

var useremail = "iasc@163.com";
var pwd = "123456";

var user_id = null, token = null;

var appkit_weather_station, myappkit_weather_station, device_id;
var data_observer, control_observer;

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

    ddpclient.call("login", [
        {user: {email: useremail}, password: pwd}
    ], function (err, result) {
        console.log(result);
        user_id = result.id;
        token = result.token;

        if (token) {
            console.log("Logined!", user_id, token);

            //var observer = ddpclient.observe("devices");

            /*
             * Subscribe to a Meteor Collection
             */
            ddpclient.subscribe(
                "devices",                  // name of Meteor Publish function to subscribe to
                [],                       // any parameters used by the Publish function
                function () {             // callback when the subscription is complete
                    console.log("devices all ==> ", ddpclient.collections.appkits);

                    appkit_weather_station = _(ddpclient.collections.appkits).findWhere({name: 'Weather Station'});
                    console.log("devices weather_station  ==> ", appkit_weather_station);
                    console.log("devices weather_station id ==> ", appkit_weather_station._id);

                    // Create myAppKit

                    var myAppKit = ddpclient.call(
                        'myAppKitInsert',
                        [{
                            name: 'My Weather Station',
                            app_kit_id: appkit_weather_station._id
                        }],
                        function (err, result) {
                            console.log('myAppKitInsert, error: ' + error);
                            console.log('myAppKitInsert, result: ' + result._id);

                            device_id = result._id;

                            /*
                             * Subscribe to a Meteor Collection
                             */
                            ddpclient.subscribe(
                                "myappkits",                  // name of Meteor Publish function to subscribe to
                                [user_id],          // any parameters used by the Publish function
                                function () {             // callback when the subscription is complete
                                    console.log("myappkits all ==> ", ddpclient.collections.myappkits);

                                    console.log("project_weather_station id ==> ", appkit_weather_station._id);

                                    myappkit_weather_station = _(ddpclient.collections.myappkits).filter({_id: device_id});
                                    console.log("myappkits weather_station  ==> ", myappkit_weather_station);
                                }
                            );

                            ddpclient.subscribe(
                                "dataevents",                  // name of Meteor Publish function to subscribe to
                                [user_id],          // any parameters used by the Publish function
                                function () {             // callback when the subscription is complete
                                    console.log("dataevents all ==> ", ddpclient.collections.dataevents);
                                }
                            );

                            ddpclient.subscribe(
                                "controlevents",                  // name of Meteor Publish function to subscribe to
                                [user_id],          // any parameters used by the Publish function
                                function () {             // callback when the subscription is complete
                                    console.log("controlevents all ==> ", ddpclient.collections.controlevents);
                                }
                            );

                            /*
                             * observe DataEvents
                             */
                            data_observer = ddpclient.observe("dataevents");

                            data_observer.added = function (id) {
                                console.log("[ADDED] to " + data_observer.name + ":  " + id);

                                var event = _(ddpclient.collections.dataevents).findWhere({_id: id});
                                console.log("[ADDED] dataevents ", event)
                            };

                            /*
                             * observe ControlEvents
                             */
                            control_observer = ddpclient.observe("controlevents");

                            control_observer.added = function (id) {
                                console.log("[ADDED] to " + control_observer.name + ":  " + id);

                                var event = _(ddpclient.collections.controlevents).findWhere({_id: id});
                                console.log("[ADDED] controlevents ", event)
                            };

                            /*
                             * Send new Control Event to Server
                             * */
                            var newControlEvent = ddpclient.call(
                                'controlEventInsert',
                                [{
                                    device_id: device_id,
                                    control_name: "Status",
                                    control_value: "true"
                                }],
                                function (err, result) {
                                    console.log('controlEventInsert, error: ' + error);
                                    console.log('controlEventInsert, result: ' + result._id);
                                });
                        }
                    );
                }
            );
        }
    });

    ////Debug information
    //
    //ddpclient.on('message', function (msg) {
    //    console.log("ddp message: " + msg);
    //});

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
    }, 5000);

});

Cylon.robot({
    connections: {
        arduino: {adaptor: 'firmata', port: '/dev/ttyATH0'}
    },

    devices: {
        led: {driver: 'led', pin: 12},
        sensor: { driver: 'light-sensor', pin: 0, lowerLimit: 100, upperLimit: 900 }
    },

    work: function(my) {
        var analogValue = 0;

        every((1).second(), function() {
            analogValue = my.sensor.analogRead();
            console.log('Analog value => ', analogValue);

            my.led.toggle();
        });

        my.sensor.on('lowerLimit', function(val) {
            console.log("Lower limit reached!");
            console.log('Analog value => ', val);
        });

        my.sensor.on('upperLimit', function(val) {
            console.log("Upper limit reached!");
            console.log('Analog value => ', val);
        });
    }
}).start();