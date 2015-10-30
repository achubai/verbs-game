/**
 * Created by achubai on 10/30/2015.
 */

define([
    'backbone',
    '../views/all-verbs-list'
],function (Backbone, allVerbsView) {
    var Router = Backbone.Router.extend({
        routes: {
            '': 'allVerbs',
            '/verbs': 'allVerbs'
        },
        index: function () {
            console.log('a');
        },
        allVerbs: function () {
            allVerbsView.render();
        }
    });

    var router = new Router();
    Backbone.history.start();

});
