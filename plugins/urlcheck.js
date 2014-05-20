
var http = require('http');
var url = require('url');
var Entities = require('html-entities').AllHtmlEntities;

var entities = new Entities();

var urlregexp = /((([A-Za-z]{3,9}:(?:\/\/)?)(?:[\-;:&=\+\$,\w]+@)?[A-Za-z0-9\.\-]+|(?:www\.|[\-;:&=\+\$,\w]+@)[A-Za-z0-9\.\-]+)((?:\/[\+~%\/\.\w\-_]*)?\??(?:[\-\+=&;%@\.\w_]*)#?(?:[\.\!\/\\\w]*))?)/;

var urlcheck =  {
    onMessage : function(selene,from, to, message,next)
    {
        var match = urlregexp.exec(message);
        if (match)
        {
            var u = url.parse(match[0]);
            console.log(u);
            var options = {method: 'HEAD', host: u.hostname, port: u.port || 80, path: u.path};
        
            var req = http.request(options, function(res) 
            {
                if (res.headers['content-type'] && res.headers['content-type'].match(/html/))
                {
                    options.method = "GET";
                    var reqq = http.request(options, function(res)
                    {
                        var data = "";
                        res.on("data", function(chunk)
                        {
                            data = data + chunk;
                        });
                        
                        res.on("error", function(err)
                        {
                            console.log(err);
                        });

                        res.on("end", function()
                        {
                            var titleRegExp = new RegExp("<title>(.+)</title>");
                            var match = titleRegExp.exec(data);
                            if (match)
                            {
                                var title = entities.decode(match[1]).substr(0,128);
                                selene.say(to, title);
                            }
                        });

                    });
                    reqq.on("error", function(err) { console.log(err);});
                    reqq.end();
                }
            });
            req.on("error", function(err) { console.log(err); });
            req.end();
        }
        next();
    }
};

module.exports = function(sel)
{
    return urlcheck;
};
