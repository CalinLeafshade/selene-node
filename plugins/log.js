var log = {
    onMessage : function(selene,from, to, message,next)
    {
        var entry = new LogEntry( {date: new Date(), nick: from, text: message, channel: to, type: "message" } );
        entry.save();
        next();
    },
    onJoin : function(selene, channel, nick, message)
    {
        var entry = new LogEntry( {date: new Date(), nick: nick, text: "", channel: channel, type: "join" } );
        entry.save();
    },
    onQuit : function(selene, nick, reason, channels, message)
    {
        channels.forEach(function(channel)
        {
            var entry = new LogEntry( {date: new Date(), nick: nick, text: reason, channel: channel, type: "quit" } );
            entry.save();
        });
    }
};

module.exports = function(sel)
{
    return log
};
