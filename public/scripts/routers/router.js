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
    '../views/join',
    '../views/signin',
    '../models/user'
],function (
    Backbone,
    VerbsCollection,
    AllVerbsView,
    VerbItemEditView,
    HomeView,
    MainMenuView,
    JoinView,
    SigninView,
    UserModel

) {
    var Router = Backbone.Router.extend({
        routes: {
            '': 'index',
            'verbs': 'allVerbs',
            'verbs/edit/:id': 'editVerb',
            'verbs/create': 'createVerb',
            'join': 'join',
            'signin': 'signin'
        },
        checkPermission: function() {
            var adminUrls = [
                'verbs/edit/',
                'verbs/create'
            ];
            var url = Backbone.history.getFragment();

            var isAdminProtected = _.find(adminUrls, function(i){
                return i === url;
            });
            var userPermission = 'view'

            if (isAdminProtected) {
                $.ajax({
                    method: 'post',
                    url: 'api/verifyUser',
                    async: false,
                    success: function(data) {
                        if (!data.tokenValid) {
                            console.log('token not valid');
                            if (localStorage.getItem('verbsUserData')) {
                                localStorage.removeItem('verbsUserData');
                            }
                        } else {
                            if (data.admin) {
                                userPermission = 'admin';
                            } else {
                                userPermission = 'user';
                            }
                        }
                    }
                });
            }

            return userPermission;
        },
        initialize: function () {
            this.collection = new VerbsCollection();

            this.listenToOnce(this.collection, 'verbsCollectionFetched', this.started);
        },
        started: function () {
            this.allVerbsView = new AllVerbsView({collection: this.collection});
            this.homeView = new HomeView({collection: this.collection});
            this.mainMenuView = new MainMenuView();
            this.joinView = new JoinView({model: new UserModel});
            this.signinView = new SigninView();

            Backbone.history.start();

            this.listenTo(this, 'route', this.getRout);
            this.getRout();

            this.listenTo(this.signinView, 'reRenderMenu', this.mainMenuReRender);
            this.listenTo(this.mainMenuView, 'reRenderMenu', this.mainMenuReRender);
        },

        // routers
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
            if (this.checkPermission() === 'admin') {
                this.allVerbsView.createVerbView();
            } else {
                console.log(this.checkPermission());
                window.router.navigate('/signin');
            }
        },
        join: function () {
            this.joinView.render();
        },
        signin: function () {
            console.log('a');
            this.signinView.render();
        },

        // helpers
        hideAllTabs: function () {
            $('.verbs-tab-block').hide();
        },
        getRout: function () {
            this.mainMenuView.setActiveClass(Backbone.history.getFragment());
        },
        mainMenuReRender: function () {
            this.mainMenuView.render();
        }
    });

    $.ajaxSetup({
        beforeSend: function(xhr) {
            var userData = localStorage.getItem('verbsUserData');

            if(userData) {
                xhr.setRequestHeader('x-access-user', userData);
            }
        },
        //complete: function(data) {
        //    console.log(data.responseJSON.tokenValid, !data.responseJSON.tokenValid);
        //    if (data.responseJSON.tokenValid) {
        //        if (!data.responseJSON.tokenValid) {
        //
        //        }
        //    }
        //}
    });



    window.router = new Router();
});
