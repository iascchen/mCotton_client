/**
 * Created by chenhao on 15/4/16.
 */

var http = require('http');

//var my_app_kit_id = "ad7JbTyk49qAkLuWR";
//var jsonObject = JSON.stringify({my_app_kit_id: my_app_kit_id,
//    Temperature: "16", Humidity: "50", Light:"100", "Air Pressure":"1000"});

var my_app_kit_id = "AThvaLLcWTxyHPLsT";
var jsonObject = JSON.stringify({
    my_app_kit_id: my_app_kit_id,
    session:"random",
    "Cell": {ID:"1991",T:"1",D:{E:"1995",W:"0",S:"0",N:"1992"}}});

var postheaders = {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(jsonObject, 'utf8')
};

var optionspost = {
    host: "localhost",
    port: 3000,
    path: '/api/v1.0/d',
    method : 'POST',
    headers : postheaders
};

// do the POST call
var reqPost = http.request(optionspost, function(res) {
    console.log("statusCode: ", res.statusCode);

    res.on('data', function(d) {
        console.info('POST result:\n');
        process.stdout.write(d);
        console.info('\n\nPOST completed');
    });
});

// write the json data
reqPost.write(jsonObject);
reqPost.end();

reqPost.on('error', function(e) {
    console.error(e);
});