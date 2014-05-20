var seen = {
    onMessage : function(selene,from, to, message,next)
    {
        SeenEntry.findOne({who: from.toLowerCase()}, function(err,doc)
        {
            if (!doc)
            {
                doc = new SeenEntry( {date: new Date(), who: from.toLowerCase()} ); 
                doc.save(function(err) {
                    console.log(err);   
                });
            }
            else
            {   
                doc.date = new Date();
                doc.save();
            }
        });
        var m = selene.isDirect(message);
        if (m && m.toLowerCase().substr(0,4) === "seen")
        {
            var who = m.substr(5).trim();
            SeenEntry.findOne( { 'who': who.toLowerCase() }, function(err, doc)
            {
                if (err)
                    console.log(err);
                if (doc)
                {
                    var when = doc.date.valueOf();
                    var now = new Date().valueOf();
                    var timeString = selene.formatTime(now - when);
                    selene.say(to, "I last saw " + who + " " + timeString + " ago.");
                }
                else
                {
                    selene.say(to, "I haven't seen " + who + ".");
                }
            });
        }
        else
        {
            next();
        }
    }
};
module.exports = function(sel)
{
    return seen;
};
