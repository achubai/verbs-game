/**
 * Created by achubai on 10/30/2015.
 */

define([
    'underscore',
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
], function (
    _,
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
    'use strict';

    var Router;

    Backbone.Router.prototype.before = function () {
        return true;
    };
    Backbone.Router.prototype.after = function () {};

    Backbone.Router.prototype.route = function (route, name, callback) {
        var that = this;

        if (!_.isRegExp(route)) {
            route = this._routeToRegExp(route);
        }
        if (_.isFunction(name)) {
            callback = name;
            name = '';
        }
        if (!callback) {
            callback = this[name];
        }

        Backbone.history.route(route, function (fragment) {
            var args = that._extractParameters(route, fragment);

            if (!that.before()) {
                return false;
            } else if (that.execute(callback, args, name) !== false) {
                that.trigger.apply(that, ['route:' + name].concat(args));
                that.trigger('route', name, args);
                that.after.apply(that, arguments);
                Backbone.history.trigger('route', that, name, args);
            }
        });
        return this;
    };
    
    
    Router = Backbone.Router.extend({
        previousRoute: null,
        currentRoute: null,
        currentPopup: null,
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
            this.ratingModeView = new RatingModeView({collection: this.collection});
            this.allVerbsView = new AllVerbsView({collection: this.collection});
            this.trainingModeView = new TrainingModeView({collection: this.collection});
            this.mainMenuView = new MainMenuView();

            Backbone.history.start();

            this.listenTo(this, 'route', this.getRout);
            this.listenTo(this, 'showAlert', this.alertRender, this);
            this.bindListenersOnLogin(this.mainMenuView);

            this.getRout();
        },

        // routers
        index: function () {
            this.changeView(this.trainingModeView);
        },
        allVerbs: function () {
            this.changeView(this.allVerbsView);
        },
        join: function () {
            if (typeof this.joinView === 'undefined') {
                this.joinView = new JoinView({model: new UserModel()});

                this.bindListenersOnLogin(this.joinView);
            }

            this.showPopup(this.joinView);
        },
        signin: function () {
            if (typeof this.signinView === 'undefined') {
                this.signinView = new SigninView();

                this.bindListenersOnLogin(this.signinView);
            }

            this.showPopup(this.signinView);
        },
        forgot: function () {
            if (typeof this.forgotView === 'undefined') {
                this.forgotView = new ForgotView();
            }

            this.showPopup(this.forgotView);
        },
        profile: function () {
            if (typeof this.profileView === 'undefined') {
                this.profileView = new ProfileModel();
            }

            this.changeView(this.profileView);
        },
        settings: function () {
            if (typeof this.profileView === 'undefined') {
                this.profileView = new ProfileModel();
            }
            if (this.profileView.isRendered) {
                this.profileView.activateTab();
                this.profileView.showSettings();
            } else {
                this.hideAllTabs();
                this.profileView.render(this.profileView.showSettings);
            }

        },
        statistics: function () {
            this.profile();
            this.profileView.showStatistics();
        },
        rating: function () {
            this.changeView(this.ratingModeView);
        },
        ratingList: function () {
            if (typeof this.ratingListView === 'undefined') {
                this.ratingListView = new RatingListView();
            }
            this.changeView(this.ratingListView);
        },

        // admin
        admin: function () {
            if (typeof this.adminView === 'undefined') {
                this.adminView = new AdminView();
            }

            this.changeView(this.adminView);
        },
        users: function () {
            if (typeof this.usersListView === 'undefined') {
                this.usersListView = new UsersListView();
            }
            this.changeView(this.usersListView);
        },
        editVerb: function () {
            var id = Backbone.history.fragment.replace(/^.*[\\\/]/, ''),
                model = this.allVerbsView.collection.findWhere({_id: id}),
                verbItemEditView;

            if (model) {
                verbItemEditView = new VerbItemEditView({model: model});
                verbItemEditView.render();
            } else {
                console.log('model not found');
            }
        },
        createVerb: function () {
            this.allVerbsView.createVerbView();
        },


        // helpers,
        bindListenersOnLogin: function (view) {
            this.listenTo(view, 'reRenderMenu', this.mainMenuReRender);
            this.listenTo(view, 'reRenderVerbsList', this.allVerbsReRender);
            this.listenTo(view, 'renderHomeView', this.index);
        },
        changeView: function (view) {
            if (this.currentView === view) {
                this.currentView.show();
            } else {

                if (typeof this.currentView !== 'undefined') {
                    this.currentView.hide();
                }

                this.currentView = view;

                if (this.currentView.isRendered) {
                    this.currentView.show();
                } else {
                    this.currentView.render();
                }
            }

            if (this.currentPopup) {
                this.closePopup();
            }

            this.ratingModeView.resetTest();
        },

        showPopup: function (view) {
            if (typeof this.currentView === 'undefined') {
                this.index();
            }
            this.currentPopup = view;
            view.render();
        },

        closePopup: function () {
            if (this.currentPopup) {
                this.currentPopup.$modal.modal('hide');
            }

            this.currentPopup = null;
        },
        goToPreviousRoute: function () {
            if (this.previousRoute) {
                window.router.navigate(this.previousRoute, {trigger: true});
            } else {
                window.router.navigate('', {trigger: true});
            }
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
        allVerbsReRender: function () {
            this.hideAllTabs();
            this.allVerbsView.reRender();
        },
        userProtected: function () {
            if (this.userInfo.permission !== 'user') {
                window.router.navigate('/signin', {trigger: true});
                return false;
            }

            return true;
        },
        adminProtected: function () {
            if (this.userInfo.permission !== 'admin') {
                window.router.navigate('/signin', {trigger: true});
                return false;
            }

            return true;
        },
        before: function () {

            var that = this,
                adminUrls,
                userUrls,
                url,
                isAdminProtected,
                isUserProtected,
                result;

            this.userInfo = {
                id: null,
                tokenValid: false,
                permission: ''
            };

            adminUrls = [
                'verbs/edit/',
                'verbs/create',
                'admin',
                'users'
            ];

            userUrls = [
                'profile',
                'profile/settings',
                'profile/statistics'
            ];

            if (this.currentRoute !== null) {
                this.previousRoute = this.currentRoute;
            }

            this.currentRoute = Backbone.history.getFragment();

            url = Backbone.history.getFragment();

            isAdminProtected = _.find(adminUrls, function (i) {
                return i === url;
            });

            isUserProtected = _.find(userUrls, function (i) {
                return i === url;
            });

            if (Boolean(isAdminProtected) || Boolean(isUserProtected)) {

                result = false;

                $.ajax({
                    method: 'post',
                    url: 'api/verifyUser',
                    async: false,
                    success: function (data) {
                        if (data.tokenValid) {
                            that.userInfo.id = data.id;
                            that.userInfo.tokenValid = data.tokenValid;
                            that.userInfo.permission = data.permission;

                            if (isUserProtected) {
                                result = that.userProtected();
                            }

                            if (isAdminProtected) {
                                result = that.adminProtected();
                            }
                        } else {
                            window.router.navigate('/signin', {trigger: true});
                            localStorage.removeItem('verbsUserData');
                            that.mainMenuReRender();

                            result = false;
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
        beforeSend: function (xhr) {
            var userData = localStorage.getItem('verbsUserData');

            if (userData) {
                xhr.setRequestHeader('x-access-user', userData);
            }
        }
    });

    window.router = new Router();
});
