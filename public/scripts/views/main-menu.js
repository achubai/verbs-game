/**
 * Created by achubai on 11/10/2015.
 */

define([
    'jquery',
    'underscore',
    'backbone'
], function($, _, Backbone) {

    return Backbone.View.extend({

        el: '.b-header.container',
        template: _.template($('#main-menu-template').html()),
        events: {
            'click .btn-logout': 'logout'
        },
        initialize: function () {
            this.render();
        },
        render: function () {
            this.userData = localStorage.getItem('verbsUserData');

            if (this.userData) {
                var data = JSON.parse(this.userData);

                if(data.permission === "admin") {
                    this.auth = true;
                    this.admin = true;
                } else {
                    this.auth = true;
                    this.admin = false;
                }
            } else {
                this.auth = false;
                this.admin = false;
            }

            this.$el.html(this.template({
                auth: this.auth,
                admin: this.admin
            }));

            this.$nav = this.$el.find('.nav');
            this.$join = this.$el.find('a[href=#join]');

            return true;
        },
        setActiveClass: function (route) {
            if (this.auth) {
                this.$nav.find('li').removeClass('active');

                if (route == '') {
                    this.$nav.find('a[href=#' + route + ']').parents('li').addClass('active');
                } else {
                    route = route.substring(0, route.indexOf('/'));
                    this.$nav.find('a[href=#' + route + ']').parents('li').addClass('active');
                }
            }
        },
        logout: function () {
            var that = this;

            $.ajax({
                method: 'POST',
                url: '/api/logout',
                success: function (data) {
                    localStorage.removeItem('verbsUserData');

                    that.trigger('reRenderMenu', that);
                    that.trigger('reRenderVerbsList', that);
                }

            })
        }
    });

});