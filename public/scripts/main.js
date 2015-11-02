/**
 * Created by achubai on 10/30/2015.
 */

require.config({
    baseUrl: 'scripts',
    paths: {
        jquery: 'libs/jquery-2.1.4.min',
        underscore: 'libs/underscore',
        backbone: 'libs/backbone',
        bootstrap: '../../bower_components/bootstrap/js/bootstrap'
    },
    shim: {
        "jquery.bootstrap": {
            deps: ["jquery"]
        }
    }
});

require(['routers/router']);
