/**
 * Created by achubai on 3/14/2016.
 */

define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {

    return Backbone.View.extend({
        tagName: 'tr',
        template: _.template($('#users-list-item-template').html()),
        initialize: function () {
            this.render();
        },
        render: function () {
            var model = {
                username: this.model.username || 'Name',
                email: this.model.email || 'Email',
                permission: this.model.permission || 'Permission',
                date: this.model.startDate || 'Date'
            };

            this.$el.html(this.template(model));

            return this;
        }
    })

});