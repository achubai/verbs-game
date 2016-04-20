/**
 * Created by achubai on 11/10/2015.
 */

define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {

    'use strict';

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
            var data;

            this.userData = localStorage.getItem('verbsUserData');

            if (this.userData) {
                data = JSON.parse(this.userData);

                if (data.permission === 'admin') {
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

            console.log(1);

            this.$nav = this.$el.find('.nav');
            this.$join = this.$el.find('a[href=#join]');

            return true;
        },
        setActiveClass: function (route) {

            this.$nav.find('li').removeClass('active');

            if (route === '') {
                this.$nav.find('a[href=#' + route + ']').parents('li').addClass('active');
            } else {
                route = route.indexOf('/') === -1 ? route : route.substring(0, route.indexOf('/'));
                this.$nav.find('a[href=#' + route + ']').parents('li').addClass('active');
            }

        },
        logout: function () {
            var that = this;

            $.ajax({
                method: 'POST',
                url: '/api/logout',
                success: function () {
                    localStorage.removeItem('verbsUserData');

                    that.trigger('reRenderMenu', that);
                    that.trigger('reRenderVerbsList', that);
                    that.trigger('renderHomeView', that);
                }

            });
        }
    });

});
