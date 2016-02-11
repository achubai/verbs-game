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
    '../models/user',
    '../views/profile'
],function (
    Backbone,
    VerbsCollection,
    AllVerbsView,
    VerbItemEditView,
    HomeView,
    MainMenuView,
    JoinView,
    SigninView,
    UserModel,
    ProfileModel

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
            var beforeResult = router.before();

            if(beforeResult === false) { // sometimes beforeResult is undefined, that why so stupid if
                return false;
            }

            if (router.execute(callback, args, name) !== false) {
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
            'profile': 'profile'
        },
        before: function() {
            this.userInfo = {
                id: null,
                tokenValid: false,
                permission: ''
            };

            var adminUrls = [
                'verbs/edit/',
                'verbs/create'
            ];
            var userUrls = [
                'profile'
            ];
            var url = Backbone.history.getFragment();
            var isAdminProtected = _.find(adminUrls, function(i){
                return i === url;
            });
            var isUserProtected = _.find(userUrls, function(i){
                return i === url;
            });

            console.log(isAdminProtected, isUserProtected, url);

            if (isAdminProtected || isUserProtected) {
                var that = this;

                $.ajax({
                    method: 'post',
                    url: 'api/verifyUser',
                    async: false,
                    success: function(data) {
                        if (!data.tokenValid) {
                            console.log('token not valid');
                            window.router.navigate('/signin', {trigger: true});

                            return false;
                        } else {
                            that.userInfo.id = data.id;
                            that.userInfo.tokenValid = data.tokenValid;
                            that.userInfo.permission = data.permission;

                            if (isUserProtected) {
                                if (that.userInfo.permission !== 'user') {
                                    window.router.navigate('/signin', {trigger: true});
                                    console.log(1)
                                    return false;
                                } else {
                                    console.log(2)
                                    return true;
                                }
                            }

                            if (isAdminProtected) {
                                if (that.userInfo.permission !== 'admin') {
                                    window.router.navigate('/signin', {trigger: true});
                                    console.log(3)
                                    return false;
                                } else {
                                    console.log(4)
                                    return true;
                                }
                            }

                            console.log(5)
                            return false;
                        }
                    }
                });
            } else {
                return true;
            }

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
            this.profileView = new ProfileModel();

            Backbone.history.start();

            this.listenTo(this, 'route', this.getRout);
            this.getRout();

            this.listenTo(this.signinView, 'reRenderMenu', this.mainMenuReRender);
            this.listenTo(this.signinView, 'reRenderVerbsList', this.allVerbsRender);
            this.listenTo(this.signinView, 'renderHoneView', this.index);

            this.listenTo(this.joinView, 'reRenderMenu', this.mainMenuReRender);
            this.listenTo(this.joinView, 'reRenderVerbsList', this.allVerbsRender);
            this.listenTo(this.joinView, 'renderHoneView', this.index);

            this.listenTo(this.mainMenuView, 'reRenderMenu', this.mainMenuReRender);
            this.listenTo(this.mainMenuView, 'reRenderVerbsList', this.allVerbsRender);
            this.listenTo(this.mainMenuView, 'renderHoneView', this.index);
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
            console.log('createVerb render');
            this.allVerbsView.createVerbView();

        },
        join: function () {
            this.joinView.render();
        },
        signin: function () {
            this.signinView.render();
        },
        profile: function () {
            this.hideAllTabs();
            this.profileView.render();
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
        },
        allVerbsRender: function () {
            this.hideAllTabs();
            this.allVerbsView.reRender();
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
