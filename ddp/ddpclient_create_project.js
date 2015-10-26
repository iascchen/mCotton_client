var DDPClient = require("ddp"),
    _ = require('underscore');

var ddpclient = new DDPClient({
    url: 'ws://192.168.199.240:3000/websocket'
    // url: 'ws://mcotton.microduino.cn/websocket'
    // url: 'ws://mcotton-01.chinacloudapp.cn/websocket'
});

var useremail = "iasc@163.com";
var pwd = "123456";

var user_id = null, token = null;

var project_test, device_weather_station, project_id;
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

                    /*
                     * Subscribe to a Meteor Collection
                     */
                    ddpclient.subscribe(
                        "projects",                  // name of Meteor Publish function to subscribe to
                        [],                       // any parameters used by the Publish function
                        function () {             // callback when the subscription is complete
                            // console.log("projects all ==> ", ddpclient.collections.projects);

                            //project_weather_station = _.findWhere(ddpclient.collections.projects, {name: 'Weather Station'});
                            //console.log("projects weather_station  ==> ", project_weather_station);
                            //console.log("projects weather_station id ==> ", project_weather_station._id);

                            project_test = _.filter(ddpclient.collections.projects,
                                function (project) {
                                    return (project.name == '1 Test Project') && ( project.status < 4);
                                });
                            console.log("project test  ==> ", project_test);

                            if (project_test.length > 0) {
                                project_id = project_test[0]._id;
                                console.log("device test id ==> ", project_id);
                            }
                            else {
                                //////////////////////////////
                                // create new project
                                //////////////////////////////

                                var project = ddpclient.call(
                                    'projectInsert',
                                    [{
                                        name: '1 Test Project',
                                        desc: "Smart Flower Pot with sensor and controler",
                                        show_chart: "LINE"
                                    }],
                                    function (err, result) {
                                        console.log('projectInsert, error: ' + err);
                                        console.log('projectInsert, result: ' + result._id);

                                        project_id = result._id;
                                    },
                                    function () {              // callback which fires when server has finished
                                        console.log('Inserted');  // sending any updated documents as a result of
                                        console.log(ddpclient.collections.projects);  // calling this method
                                    }
                                );
                            }
                            ;
                        }
                    );
                }
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
        }, 5000);

    }
);
