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
        initialize: function () {
            this.auth = true;
            this.admin = true;

            this.render();
        },
        render: function () {
            var model =  {
                auth: this.auth,
                admin: this.admin
            };

            this.$el.html(this.template(model));

            this.$nav = this.$el.find('.nav');

            return true;
        },
        setActiveClass: function (route) {
            if (this.auth) {
                this.$nav.find('li').removeClass('active');

                if (route == '') {
                    console.log('aa');
                    this.$nav.find('a[href=#' + route + ']').parents('li').addClass('active');
                } else {
                    route = route.substring(0, route.indexOf('/'));
                    this.$nav.find('a[href*=\"#' + route + '\"]').parents('li').addClass('active');
                }
            }
        }
    });

});