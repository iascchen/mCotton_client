/**
 * Created by chenhao on 15/4/16.
 */

var http = require('http');

var my_app_kit_id_weather = "erHPDhqSWuBPjq4b4";
var my_app_kit_id_city = "xvau4cJse7K7D8icT";
var my_app_kit_id_camera = "TxixbkyteKthfYT5v";

var now = new Date().getTime();

var jsonObject_citys = [
    {sid: now, Cell: {"N": "0", "ID": "1991", "T": "1", "D": {"e": "1995", "w": "0", "s": "0", "n": "1992"}}},
    {sid: now, Cell: {"N": "1", "ID": "1995", "T": "5", "D": {"e": "0", "w": "1991", "s": "0", "n": "1996"}}},
    {sid: now, Cell: {"N": "2", "ID": "1992", "T": "2", "D": {"e": "1991", "w": "0", "s": "0", "n": "1996"}}},
    {sid: now, Cell: {"N": "3", "ID": "1996", "T": "6", "D": {"e": "1993", "w": "1992", "s": "1995", "n": "0"}}},
    {sid: now, Cell: {"N": "4", "ID": "1993", "T": "3", "D": {"e": "0", "w": "0", "s": "1996", "n": "0"}}},
];

var jsonObject_weather = [
    {Temperature: "22", Humidity: "50", Light: "1000", "Air Pressure": "100.00",
        "PM 2.5": "5.00", "Air Pollution": "3.00"},
    {Temperature: "21", Humidity: "51", Light: "1002", "Air Pressure": "99.00"},
    {Temperature: "20", Humidity: "52", Light: "1004", "Air Pressure": "98.00"},
    {Temperature: "19", Humidity: "53", Light: "1006", "Air Pressure": "97.00"},
    {Temperature: "18", Humidity: "54", Light: "1008", "Air Pressure": "96.00"},
    {Temperature: "17", Humidity: "55", Light: "1010", "Air Pressure": "95.00"},
    {Temperature: "16", Humidity: "56", Light: "1012", "Air Pressure": "94.00"},
];

postData = function (myAppKitId, jsonData) {
    jsonData.my_app_kit_id = myAppKitId;

    var jsonObject = JSON.stringify(jsonData);

    var postheaders = {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(jsonObject, 'utf8')
    };

    var optionspost = {
        //host: "localhost",
        //port: 3000,

        host: "mcotton-01.chinacloudapp.cn",
        port: 80,

        path: '/api/v1.0/d',
        method: 'POST',
        headers: postheaders
    };

    // do the POST call
    var reqPost = http.request(optionspost, function (res) {
        console.log("statusCode: ", res.statusCode);

        res.on('data', function (d) {
            console.info('POST result:\n');
            process.stdout.write(d);
            console.info('\n\nPOST completed');
        });
    });

// write the json data
    reqPost.write(jsonObject);
    reqPost.end();

    reqPost.on('error', function (e) {
        console.error(e);
    });
};


for (var i = 0; i < jsonObject_weather.length; i++) {
    postData(my_app_kit_id_weather, jsonObject_weather[i]);
}

for (var j = 0; j < jsonObject_citys.length; j++) {
    postData(my_app_kit_id_city, jsonObject_citys[j]);
}