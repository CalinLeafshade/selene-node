var huhs = [ "Listen here, you little bother", "What?", "You trippin'?" ];

var regexp = /^(.+) is (.+)$/;

var huh = {
    priority : 99998,
    onMessage : function(selene,from, to, message,next)
    {
        var m = selene.isDirect(message);
        if (m)
        {
            m = m.trim();
            var match = regexp.exec(m);
            if (match && match.length > 2)
            {
                var key = match[1].trim();
                var val = match[2].trim();
                Factoid.findOne({key_lower:key.toLowerCase()}, function(err,doc) {
                    if (!doc)
                    {
                        var fact = new Factoid({key: key, key_lower: key.toLowerCase(), date: new Date(), by: from, value: val});
                        fact.save();
                        selene.say(to, "Ok, I've stored that.");
                    }
                    else
                    {
                        selene.say(to, "That's already in the dictionary.");
                    }
                });
                return;
            }
            else
            {
                Factoid.findOne({ key_lower: m.toLowerCase() }, function(err, doc)
                {
                    if (doc)
                    {
                        selene.say(to, doc.toString());                
                    }
                    else
                    {
                        next();
                    }
                });
            }
        }
    }
};

module.exports = function(sel)
{
    return huh;
};
