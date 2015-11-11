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

            return true;
        },
        setActiveClass: function (route) {
            
        }
    });

});