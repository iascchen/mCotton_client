/**
 * Created by chenhao on 15/4/16.
 */

var http = require('http');

var my_app_kit_id = "27E79doSoAYRBEKSS";

var jsonObject = JSON.stringify({my_app_kit_id: my_app_kit_id,
    control_name: "Status", control_value: "false"});

var postheaders = {
    'Content-Type': 'application/json',
    'Content-Length': Buffer.byteLength(jsonObject, 'utf8')
};

var optionspost = {
    host: "localhost",
    port: 3000,
    path: '/api/v1.0/ce',
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