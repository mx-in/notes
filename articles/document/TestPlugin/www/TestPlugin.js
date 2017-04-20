var exec = require('cordova/exec');

exports.test = function(arg0, success, error) {
    exec(success, error, "TestPlugin", "test", [arg0]);
};
