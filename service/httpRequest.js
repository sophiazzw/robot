var path = require('path'),
    http = require('http'),
    _ = require('../lib/util.js'),
    Log = require('../lib/log.js');

var ContentType = {
    'html' : 'text/html',
    'json' : 'application/json'
};

exports.send = function(ajaxUrl,type){
    var options = {
        hostname : 'localhost',
        port : 6060,
        path : ajaxUrl,
        method : 'get',
    };
    var result ;
    
    var req = http.request(options, function(res){
        var statusCode = res.statusCode,
            contentType = res.headers['content-type'],
            typeReg = new RegExp('^' + ContentType[type]),
            error;

        if(statusCode !== 200){
            error = new Error('Request failed.\n'   + 'StatusCode ：' + statusCode);
        }else if(!typeReg.test(contentType)){
            error = new Error('Invalid content-type.\n Expect' + ContentType[type] + ' ,but get ' + 
                contentType);
        }

        if(error){
            Log.error(error.message);
            res.resume()
            return;
        }

        res.setEncoding('utf-8');
        var rawData = '';
        res.on('data', function(chunk){
            rawData += chunk;
        });
        res.on('end', function(){
            try{
                var parsedData = rawData;
                result = parsedData;
                console.log(parsedData);
            } catch(e){
                Log.error(e.message);
            }
        });
    });
    req.on('error', function(e){
        Log.error('Error：' + e.message);
    });
    //req.write(postData);
    req.end();
    return result;
}