/**
 * Created by chenhao on 15/4/16.
 */

var request = require('request'),
    _ = require('underscore');

var host = "localhost", port = 3000;
var useremail = "iasc@163.com", pwd = "123456";

var API = "http://" + host + ":" + port + "/api";
var LOGIN = API + "/login";

var API_VER = API + "/v1.0";
var APP_KITS = API_VER + "/appkits";
var MY_APP_KITS = API_VER + "/myappkits";

var CITY_DATA_EVENTS = API_VER + "/de_city";
var CITY_DATA_VISUAL = API_VER + "/vis_city";

var user_id = null, x_token = null;

var appkit_city, myappkit_city, my_app_kit_id;
var data_observer, control_observer;
var appkit_city_id;

var login = function (useremail, pwd) {
    var jsonData = {user: useremail, password: pwd};

    request({
        method: 'POST', uri: LOGIN,
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    }).on('data', function (data) {
        console.log('Response Data: ' + data);

        // decompressed data as it is received
        var ret = JSON.parse(data);

        user_id = ret.data.userId;
        x_token = ret.data.authToken;

        if (x_token) {
            console.log("Logined!", user_id, x_token);

            getAppKits();
        }
    });
};

var getAppKits = function () {
    request({
        method: 'GET', uri: APP_KITS,
    }).on('data', function (data) {
        console.log('Response AppKits: ' + data);
        var ret = JSON.parse(data);

        for (var i in ret) {
            console.log('Response AppKit: ' + JSON.stringify(ret[i]));
        }

        appkit_city = _(ret).findWhere({name: 'Smart City'});
        console.log('Response AppKit: ' + JSON.stringify(appkit_city));

        appkit_city_id = appkit_city._id;

        // Create new MyAppKit
        if (x_token) {
           getMyAppKits();
        }
    });
};

var getMyAppKits = function () {
    return request({
        method: 'GET', uri: MY_APP_KITS,
        headers: {
            "X-Auth-Token": x_token,
            "X-User-Id": user_id
        },
    }).on('data', function (data) {
        // console.log('Response MyAppKits: ' + data);
        var ret = JSON.parse(data);

        for (var i in ret) {
            var my_app_kit_id = ret[i]._id;

            if(ret[i].app_kit_id == appkit_city_id){
                console.log('Response MyAppKit: ' + JSON.stringify(ret[i]));

                getCityDataEvents(my_app_kit_id);
                getCityVisualization(my_app_kit_id);
            }
        }
    });
};

var getCityDataEvents = function (my_app_kit_id) {
    //console.log('Response getCityDataEvents: ' + my_app_kit_id);

    return request({
        method: 'GET', uri: CITY_DATA_EVENTS + "/" + my_app_kit_id,
        headers: {
            "X-Auth-Token": x_token,
            "X-User-Id": user_id
        },
    }).on('data', function (data) {
        console.log('Response Data: ' + my_app_kit_id + " => " + data);
    });
};

/**
 * @param my_app_kit_id
 * @returns {*}
 */
var getCityVisualization = function (my_app_kit_id) {
    //console.log('Response getCityVisualization: ' + my_app_kit_id);

    return request({
        method: 'GET', uri: CITY_DATA_VISUAL + "/" + my_app_kit_id,
        headers: {
            "X-Auth-Token": x_token,
            "X-User-Id": user_id
        },
    }).on('data', function (data) {
        console.log('Response City Visualization: ' + my_app_kit_id + " => " + data);
    });
};

login(useremail, pwd);