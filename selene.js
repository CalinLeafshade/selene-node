var irc = require('irc');
var fs = require('fs');

var client;

var selene = {};

var plugins = new Array();

fs.readdirSync('./plugins').forEach(function (file) {
    if(file.substr(-3) === '.js') {
        var p = require('./plugins/' + file);
        plugins.push(p(selene));
    }
});

plugins.sort(function(a,b) { return (a.priority || 0) - (b.priority || 0) });

selene.whoIs = function(who,cb)
{
    client.whois(who, cb);
}

selene.onMessage = function(from, to, text)
{
    (function(from, to, text)
    {
        run = function(from, to, text, idx)
        {
            var plugin = plugins[idx];
            if (!plugin) return;
            if (plugin.onMessage)
            {
                plugin.onMessage(selene, from, to, text, function() { run(from,to,text,idx + 1) });
            }
        }
        run(from,to,text,0);
    })(from, to, text);
};

selene.onJoin = function (channel, nick, message)
{
    plugins.forEach(function(p) {
        if (p.onJoin)
            p.onJoin(selene, channel, nick, message);
    });
};

selene.onQuit = function (nick, reason, channels, message)
{

    plugins.forEach(function(p) {
        if (p.onQuit)
            p.onQuit(selene, nick, reason, channels, message);
    });
};
selene.say = function(to, text)
{
    client.say(to,text);
};

selene.formatTime = function(totalMilliseconds)
{
    var t = totalMilliseconds / 1000;
    var days = Math.floor(t / 86400)
    t = t - days * 86400
    var hours = Math.floor(t / 3600)
    t = t - hours * 3600
    var minutes = Math.floor(t / 60)
    t = t - minutes * 60
    var seconds = Math.floor(t);
    var text = "";
    if (days > 0)
    {
        text = text + days + " days";
    }
    if (hours > 0)
    {
        if (text.length > 0)
            text = text + ", ";
        text = text + hours + " hours";
    }
    if (minutes > 0)
    {
        if (text.length > 0)
            text = text + ", ";
        text = text + minutes + " minutes";
    }
    if (seconds > 0)
    {
        if (text.length > 0)
            text = text + ", ";
        text = text + seconds + " seconds";
    }
    return text;
};

selene.isDirect = function(text)
{
    if (text.charAt(0) == "!")
        return text.substr(1);
    else if (text.toLowerCase().substr(0,3) == "sel")
        return text.substr(4);
    else if (text.toLowerCase().substr(0,6) == "selene")
        return text.substr(7);
    else
        return false;
};

selene.status = function()
{
    return "Online!";
};

selene.tick = function()
{
    plugins.forEach(function(p)
    {
        if (p.tick)
            p.tick(selene);
    });
};

selene.connect = function(server, nick, channels)
{
    client = new irc.Client(server, nick, { channels: channels });
    client.addListener('message', function(from, to, text) { selene.onMessage(from, to, text) });
    client.addListener('join', function(channel, nick, message) { selene.onJoin(channel, nick, message) });
    client.addListener('quit', function(nick, reason, channels, message) { selene.onQuit(nick,reason,channels, message) });
    client.addListener('error', function(err) { console.log(err); });
    setInterval(selene.tick, 1000);
};

selene.middleware = function(req,res,next)
{
    req.selene = selene;
    next();
}

module.exports = function(server, nick, channels)
{
    selene.connect(server, nick, channels);
    return selene;

};
