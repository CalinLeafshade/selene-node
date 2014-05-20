var getDates = function(cb)
{
    var o = {};
    o.map = function() {
        day = Date.UTC(this.date.getFullYear(), this.date.getMonth(), this.date.getDate());
        emit(day, 1);
    };
    o.reduce = function(k,v)
    {
        return v.length;
    };
    LogEntry.mapReduce(o, function(err,results)
            {
                cb(results);
            });

}

var urlRegex = /((ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?)/gi;
var url = new RegExp(urlRegex);

module.exports.controller = function(app)
{
    app.get('/log/:logDate', function (req,res)
    {
        var tzOffset = new Date().getTimezoneOffset() * 60 * 1000;
        var date = new Date(Number(req.params.logDate) + tzOffset);
        var nextDay = new Date(Number(req.params.logDate) + tzOffset);
        nextDay.setDate(nextDay.getDate() + 1);
        LogEntry.find().where('date').gt(date).lt(nextDay).sort('date').exec(function (err, docs)
            {
                docs.forEach(function(doc)
                    {
                        doc.formattedText = doc.text.replace(url, "<a href='$1'>$1</a>");
                    });
                res.render("log", {entries: docs});
            });
    });
    
    app.get('/logs', function(req,res)
    {
        getDates(function(dates)
        {
           res.render("logs", {dates: dates}); 
        });
    });

}
