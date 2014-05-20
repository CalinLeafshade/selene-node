var huhs = [ "Listen here, you little bother", "What?", "You trippin'?" ];

var huh = {
    priority : 99999,
    onMessage : function(selene,from, to, message,next)
    {
        if (selene.isDirect(message))
        {
            var item = huhs[Math.floor(Math.random()*huhs.length)];
            selene.say(to, item);
        }
    }
};

module.exports = function(sel)
{
    return huh;
};
