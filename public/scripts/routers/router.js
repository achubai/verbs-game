/**
 * Created by achubai on 10/30/2015.
 */

define([
    'backbone',
    '../collections/verbs',
    '../views/all-verbs-list',
    '../views/verb-item-edit',
    '../views/home',
    '../views/main-menu',
    '../views/join'
],function (
    Backbone,
    VerbsCollection,
    AllVerbsView,
    VerbItemEditView,
    HomeView,
    MainMenuView,
    JoinView

) {
    var Router = Backbone.Router.extend({
        routes: {
            '': 'index',
            'verbs': 'allVerbs',
            'verbs/edit/:id': 'editVerb',
            'verbs/create': 'createVerb',
            'join': 'join'
        },
        initialize: function () {
            this.collection = new VerbsCollection();

            this.listenToOnce(this.collection, 'verbsCollectionFetched', this.started);
        },
        started: function () {
            this.allVerbsView = new AllVerbsView({collection: this.collection});
            this.homeView = new HomeView({collection: this.collection});
            this.mainMenuView = new MainMenuView();
            this.joinView = new JoinView();

            Backbone.history.start();

            this.listenTo(this, 'route', this.getRout);
            this.getRout();
        },
        index: function () {
            this.hideAllTabs();
            this.homeView.render();
        },
        allVerbs: function () {
            this.hideAllTabs();
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
        },
        hideAllTabs: function () {
            $('.verbs-tab-block').hide();
        },
        getRout: function () {
            this.mainMenuView.setActiveClass(Backbone.history.getFragment());
        },
        join: function () {
            this.joinView.render();
        },
        login: function () {
            this.joinView.render();
        }
    });

    window.router = new Router();
});
