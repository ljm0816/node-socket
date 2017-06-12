/**
 * Created by DRAGON on 2017/4/30.
 */

/**
 * 异常捕捉
 * @param app
 */
exports.exceptionInit = function(app,config) {

    // catch 404 and forward to error handler
    app.use(function(req, res, next) {
        console.log(app.get('env') );
        var err = new Error('Not Found');
        err.status = 404;
        next(err);
    });

// error handlers

// development error handler
// will print stacktrace
    if (app.get('env') === 'development') {
        app.use(function(err, req, res, next) {
            console.log("dev错误");
            res.status(err.status || 500);
            res.render('error', {
                message: err.message,
                error: err
            });
        });
    }

// production error handler
// no stacktraces leaked to user
    app.use(function(err, req, res, next) {
        console.log("product错误");
        res.status(err.status || 500);
        res.render('error', {
            message: err.message,
            error: {}
        });
    });


}







