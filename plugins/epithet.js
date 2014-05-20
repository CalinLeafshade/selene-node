
var epithet =  {
    onMessage : function(selene,from, to, message,next)
    {
        var m = selene.isDirect(message);
        if (m)
        {
            var split = m.split(" ");
            if (split.length > 1 && split[0].toLowerCase() === "epithet")
            {
                selene.whoIs(from, function(obj)
                {  
                    var isOp = false;
                    obj.channels.forEach(function (c)
                        {
                            if (c.charAt(0) === "&" || c.charAt(0) === "@")
                            {
                                isOp = true;
                            }
                        });
                    if (isOp)
                    {
                        var epi = new Epithet( { date: new Date(), by: from, value: split[1].toLowerCase() } );
                        epi.save();
                        selene.say(to, "Yep, done that.");
                        return;
                    }
                    else
                    {
                        selene.say(to, "You dont have permission for that");
                        return;
                    }
                });
            }
            else
            {
                next();
            }   
        }
        else
        {
            var split = message.split(" ");
            var cb = function(val)
            {
                if (!val) 
                {
                    return;
                }
                Epithet.findOne({value: val.toLowerCase()}, function (err, doc)
                {
                    if (doc) 
                    {
                        selene.say(to, "OMG such a racist, " + from);
                    }
                    else
                    {
                        return cb(split.pop());
                    }
                });
            };
            cb(split.pop());
            next();
        }
    }
};

module.exports = function(sel)
{
    return epithet;
};
