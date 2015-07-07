/**
 * Created by chenhao on 15/4/16.
 */

var request = require('request'),
    _ = require('underscore');

// var host = "192.168.199.240", port = 3000;
// var host = "localhost", port = 3000;
var host = "mcotton-01.chinacloudapp.cn", port = 80;

var API = "http://" + host + ":" + port + "/api";
var LOGIN = API + "/login";

var API_VER = API + "/v1.0";

// Arduino Client API
var REG_DEVICE_ID = API_VER + "/regDevId";
var GEN_DEVICE_ID = API_VER + "/genDevId";

var CLIENT_IP = API_VER + "/clientIp";

// Mobile App API
var WAIT_DEVICE_ID = API_VER + "/waitDevId";

var useremail = "iasc@163.com", pwd = "123456";
var user_id = null, x_token = null;

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

            // clientIp();
            regDeviceId();
        }
    });
};

var regDeviceId = function () {
    var jsonData = {mac_adr: "12345678", app_kit_name:"Weather Station", name:"My Weather Station"};
    request({
        method: 'POST', uri: REG_DEVICE_ID,
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    }).on('data', function (data) {
        console.log('Response regDeviceId: ' + data);
        // var ret = JSON.parse(data);

        waitDeviceId();
    });
};

var clientIp = function () {
    request({
        method: 'GET', uri: CLIENT_IP
    }).on('data', function (data) {
        console.log('Response clientIp: ' + data);
        // var ret = JSON.parse(data);

        // waitDeviceId();
    });
};

var waitDeviceId = function () {
    var jsonData = {mac_adr: "12345678"};
    request({
        method: 'POST', uri: WAIT_DEVICE_ID,
        headers: {
            "X-Auth-Token": x_token,
            "X-User-Id": user_id,
            'content-type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    }).on('data', function (data) {
        console.log('Response waitDeviceId: ' + data);
        // var ret = JSON.parse(data);

        genDeviceId();
    });
};

var genDeviceId = function () {
    var jsonData = {mac_adr: "12345678", app_kit_name:"Weather Station"};
    request({
        method: 'POST', uri: GEN_DEVICE_ID,
        headers: {
            'content-type': 'application/json'
        },
        body: JSON.stringify(jsonData)
    }).on('data', function (data) {
        console.log('Response genDeviceId: ' + data);
    });
};

login(useremail, pwd);