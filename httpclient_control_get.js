/**
 * Created by chenhao on 15/4/16.
 */

var http = require('http');

var my_app_kit_id = "27E79doSoAYRBEKSS";

var options = {
    host: "localhost",
    port: 3000,
    path: '/api/v1.0/ce/' + my_app_kit_id ,
    method : 'GET'
};

var req = http.request(options, function(res)
{
    var output = '';
    // console.log(options.host + ':' + res.statusCode);
    res.setEncoding('utf8');

    res.on('data', function (chunk) {
        output += chunk;
    });

    res.on('end', function() {
        var obj = JSON.parse(output);
        console.info('GET result: ' + res.statusCode, obj);
    });
});

req.end();

req.on('error', function(err) {
    console.error(err);
});

