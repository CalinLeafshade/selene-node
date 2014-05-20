module.exports.controller = function(app)
{
    app.get("/status", function(req,res)
    {
        res.send(req.selene.status());        
    });
}
