/**
 * Created by achubai on 1/28/2016.
 */
define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {

    return Backbone.View.extend({
        el: '.b-profile-container',
        template: _.template($('#profile-template').html()),
        events: {

        },
        initialize: function () {
            this.render();
        },
        render: function () {
            if(!this.isRendered) {
                this.$el.html(this.template());
            }
        }
    })
});