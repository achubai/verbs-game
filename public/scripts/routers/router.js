/**
 * Created by achubai on 10/30/2015.
 */

define([
    'backbone',
    '../views/all-verbs-list',
    '../views/verb-item-edit',
    '../models/verb'
],function (Backbone, allVerbsView, VerbItemEditView, VerbModel) {
    var Router = Backbone.Router.extend({
        routes: {
            '': 'index',
            'verbs': 'allVerbs',
            'verbs/edit/:id': 'editVerb',
            'verbs/create': 'createVerb'
        },
        index: function () {
            console.log('index route');
        },
        allVerbs: function () {
            if (allVerbsView.collection.length) {
                allVerbsView.render();
            } else {
                window.router.navigate('/');
            }
        },
        editVerb: function () {
            var id = Backbone.history.fragment.replace(/^.*[\\\/]/, '');
            var model = allVerbsView.collection.findWhere({_id: id});

            if (allVerbsView.collection.length) {
                if (model) {
                    var verbItemEditView = new VerbItemEditView({model: model});
                    verbItemEditView.render();
                } else {
                    console.log('model not found');
                }
            } else {
                window.router.navigate('/');
            }
        },
        createVerb: function () {
            if (allVerbsView.collection.length) {
                allVerbsView.createNewView();

            } else {
                window.router.navigate('/');
            }
        }
    });

    window.router = new Router();
    Backbone.history.start();

});
