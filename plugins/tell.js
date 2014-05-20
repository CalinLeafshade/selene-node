var seen = {
    onMessage : function(selene,from, to, message,next)
    {
        var cont = false;
        Tell.find( { to: from.toLowerCase(), told: false }, function(err, docs)
        {
            if (err)
                console.log(err);
            else if (docs)
            {
                docs.forEach(function(doc)
                {
                    var timeString = selene.formatTime(new Date().valueOf() - doc.date.valueOf());
                    selene.say(to, from + ", " + doc.from + " left this message for you, " + timeString + " ago: " + doc.message);
                    doc.told = true;
                    doc.save();
                });
            }
        });
        var m = selene.isDirect(message);
        if (m)
        {
            var mSplit = m.split(" ");
            if (mSplit.length > 2)
            {
                if (mSplit.shift().toLowerCase() === "tell")
                {
                    var who = mSplit.shift();
                    var messageText = mSplit.join(" ");
                    var doc = new Tell({date: new Date(), from: from, to: who.toLowerCase(), told: false, message: messageText});
                    selene.say(to, "Ok, I'll tell them that.");
                    doc.save();
                    return;
                }
            }
        }
        next();
    }
};
module.exports = function(sel)
{
    return seen;
};
