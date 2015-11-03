/**
 * Created by achubai on 10/30/2015.
 */

define([
    'backbone',
    '../collections/verbs',
    '../views/all-verbs-list',
    '../views/verb-item-edit',
    '../views/home'
],function (Backbone, VerbsCollection, AllVerbsView, VerbItemEditView, HomeView) {
    var Router = Backbone.Router.extend({
        routes: {
            '': 'index',
            'verbs': 'allVerbs',
            'verbs/edit/:id': 'editVerb',
            'verbs/create': 'createVerb'
        },
        initialize: function () {
            this.collection = new VerbsCollection();

            this.listenToOnce(this.collection, 'collectionFetched', this.started);
        },
        started: function () {
            this.allVerbsView = new AllVerbsView({collection: this.collection});
            this.homeView = new HomeView({collection: this.collection});
            Backbone.history.start();
        },
        index: function () {
            this.homeView.render();
        },
        allVerbs: function () {
            this.allVerbsView.render();
        },
        editVerb: function () {
            var id = Backbone.history.fragment.replace(/^.*[\\\/]/, '');
            var model = this.allVerbsView.collection.findWhere({_id: id});

            if (model) {
                var verbItemEditView = new VerbItemEditView({model: model});
                verbItemEditView.render();
            } else {
                console.log('model not found');
            }
        },
        createVerb: function () {
            this.allVerbsView.createVerbView();
        }
    });

    window.router = new Router();
});
