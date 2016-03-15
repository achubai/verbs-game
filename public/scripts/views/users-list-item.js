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
                date: {
                    day: this.model.startDate ? this.model.startDate.day : 'Day',
                    month: this.model.startDate ? this.model.startDate.month : 'Month',
                    year: this.model.startDate ? this.model.startDate.year : 'Year'
                }
            };

            this.$el.html(this.template(model));

            return this;
        }
    })

});