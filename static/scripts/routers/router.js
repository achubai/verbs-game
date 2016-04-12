/**
 * Created by achubai on 10/30/2015.
 */

define([
    'backbone',
    '../collections/verbs',
    '../views/all-verbs-list',
    '../views/verb-item-edit',
    '../views/training-mode',
    '../views/main-menu',
    '../views/join',
    '../views/signin',
    '../models/user',
    '../views/profile',
    '../views/alert',
    '../views/admin',
    '../views/users-list',
    '../views/forgot',
    '../views/rating-mode',
    '../views/rating-list'
],function (
    Backbone,
    VerbsCollection,
    AllVerbsView,
    VerbItemEditView,
    TrainingModeView,
    MainMenuView,
    JoinView,
    SigninView,
    UserModel,
    ProfileModel,
    AlertView,
    AdminView,
    UsersListView,
    ForgotView,
    RatingModeView,
    RatingListView
) {
    Backbone.Router.prototype.before = function () {
        return true;
    };
    Backbone.Router.prototype.after = function () {};

    Backbone.Router.prototype.route = function (route, name, callback) {
        if (!_.isRegExp(route)) route = this._routeToRegExp(route);
        if (_.isFunction(name)) {
            callback = name;
            name = '';
        }
        if (!callback) callback = this[name];

        var router = this;

        Backbone.history.route(route, function(fragment) {
            var args = router._extractParameters(route, fragment);

            if(!router.before()) {
                return false;
            } else if (router.execute(callback, args, name) !== false) {
                router.trigger.apply(router, ['route:' + name].concat(args));
                router.trigger('route', name, args);
                router.after.apply(router, arguments);
                Backbone.history.trigger('route', router, name, args);
            }
        });
        return this;
    };
    
    
    Router = Backbone.Router.extend({
        routes: {
            '': 'index',
            'verbs': 'allVerbs',
            'verbs/edit/:id': 'editVerb',
            'verbs/create': 'createVerb',
            'join': 'join',
            'signin': 'signin',
            'profile': 'profile',
            'profile/settings': 'settings',
            'profile/statistics': 'statistics',
            'admin': 'admin',
            'users': 'users',
            'forgot': 'forgot',
            'rating': 'rating',
            'rating-list': 'ratingList'
        },

        initialize: function () {
            this.collection = new VerbsCollection();

            this.listenToOnce(this.collection, 'verbsCollectionFetched', this.started);
        },
        started: function () {
            this.allVerbsView = new AllVerbsView({collection: this.collection});
            this.trainingModeView = new TrainingModeView({collection: this.collection});
            this.mainMenuView = new MainMenuView();
            this.joinView = new JoinView({model: new UserModel});
            this.signinView = new SigninView();
            this.profileView = new ProfileModel();
            this.forgotView = new ForgotView();
            this.adminView = new AdminView();
            this.usersListView = new UsersListView();
            this.ratingModeView = new RatingModeView({collection: this.collection});
            this.ratingListView = new RatingListView();

            Backbone.history.start();

            this.listenTo(this, 'route', this.getRout);
            this.getRout();

            this.listenTo(this, 'showAlert', this.alertRender, this);

            this.listenTo(this.signinView, 'reRenderMenu', this.mainMenuReRender);
            this.listenTo(this.signinView, 'reRenderVerbsList', this.allVerbsRender);
            this.listenTo(this.signinView, 'renderHoneView', this.index); //TODO: hone....

            this.listenTo(this.joinView, 'reRenderMenu', this.mainMenuReRender);
            this.listenTo(this.joinView, 'reRenderVerbsList', this.allVerbsRender);
            this.listenTo(this.joinView, 'renderHoneView', this.index);

            this.listenTo(this.mainMenuView, 'reRenderMenu', this.mainMenuReRender);
            this.listenTo(this.mainMenuView, 'reRenderVerbsList', this.allVerbsRender);
            this.listenTo(this.mainMenuView, 'renderHoneView', this.index);
        },


        // routers
        index: function () {
            this.resetTest();
            this.hideAllTabs();
            this.trainingModeView.render();
        },
        allVerbs: function () {
            this.resetTest();
            this.hideAllTabs();
            this.allVerbsView.render();
        },
        join: function () {
            this.resetTest();
            this.joinView.render();
        },
        signin: function () {
            this.resetTest();
            this.signinView.render();
        },
        forgot: function () {
            this.resetTest();
            this.forgotView.render();
        },
        profile: function () {
            this.resetTest();
            this.hideAllTabs();
            this.profileView.render();
        },
        settings: function () {
            this.resetTest();

            if (this.profileView.isRendered) {
                this.profileView.activateTab();
                this.profileView.showSettings();
            } else {
                this.hideAllTabs();
                this.profileView.render(this.profileView.showSettings);
            }

        },
        statistics: function () {
            this.resetTest();
            this.profile();
            this.profileView.showStatistics();
        },
        rating: function () {
            this.resetTest();
            this.hideAllTabs();
            this.ratingModeView.render();
        },
        ratingList: function () {
            this.resetTest();
            this.hideAllTabs();
            this.ratingListView.render();
        },

        // admin
        admin: function () {
            this.hideAllTabs();
            this.adminView.render();
        },
        users: function () {
            this.hideAllTabs();
            this.usersListView.render();
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


        // helpers
        resetTest: function () {
            this.ratingModeView.resetTest();
        },
        hideAllTabs: function () {
            $('.verbs-tab-block').hide();
        },
        getRout: function () {
            this.mainMenuView.setActiveClass(Backbone.history.getFragment());
        },
        mainMenuReRender: function () {
            this.mainMenuView.render();
        },
        alertRender: function (data) {
            this.alertView = new AlertView();

            this.alertView.render(data);
        },
        allVerbsRender: function () {
            this.hideAllTabs();
            this.allVerbsView.reRender();
        },
        userProtected: function () {
            if (this.userInfo.permission !== 'user') {
                window.router.navigate('/signin', {trigger: true});
                return false;
            } else {
                return true;
            }
        },
        adminProtected: function () {
            if (this.userInfo.permission !== 'admin') {
                window.router.navigate('/signin', {trigger: true});
                return false;
            } else {
                return true;
            }
        },
        before: function() {
            this.userInfo = {
                id: null,
                tokenValid: false,
                permission: ''
            };

            var adminUrls = [
                'verbs/edit/',
                'verbs/create',
                'admin',
                'users'
            ];
            var userUrls = [
                'profile',
                'profile/settings',
                'profile/statistics'
            ];
            var url = Backbone.history.getFragment();

            var isAdminProtected = _.find(adminUrls, function(i){
                return i === url;
            });

            var isUserProtected = _.find(userUrls, function(i){
                return i === url;
            });

            if (!!isAdminProtected || !!isUserProtected) {

                var that = this;

                var result = false;

                $.ajax({
                    method: 'post',
                    url: 'api/verifyUser',
                    async: false,
                    success: function(data) {
                        if (!data.tokenValid) {

                            window.router.navigate('/signin', {trigger: true});
                            localStorage.removeItem('verbsUserData');
                            that.mainMenuReRender();

                            result = false;
                        } else {
                            that.userInfo.id = data.id;
                            that.userInfo.tokenValid = data.tokenValid;
                            that.userInfo.permission = data.permission;

                            if (isUserProtected) {
                                result = that.userProtected();
                            }

                            if (isAdminProtected) {
                                result = that.adminProtected();
                            }
                        }
                    }
                });
            } else {
                result = true;
            }

            return result;
        }
    });

    

    $.ajaxSetup({
        beforeSend: function(xhr) {
            var userData = localStorage.getItem('verbsUserData');

            if(userData) {
                xhr.setRequestHeader('x-access-user', userData);
            }
        }
    });



    window.router = new Router();
});
