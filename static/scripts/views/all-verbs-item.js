/**
 * Created by achubai on 10/30/2015.
 */
define([
    'jquery',
    'underscore',
    'backbone'

], function ($, _, Backbone) {

    'use strict';

    return Backbone.View.extend({
        tagName: 'tr',
        template: _.template($('#verbs-item').html()),
        initialize: function () {
            this.render();
            this.listenTo(this.model, 'change', this.render);
        },
        events: {
            'click .remove': 'deleteModel'
        },
        render: function () {
            var admin = JSON.parse(localStorage.getItem('verbsUserData')) ? JSON.parse(localStorage.getItem('verbsUserData')).permission : 'user';

            this.$el.html(this.template(_.extend(this.model.toJSON(), {
                admin: admin
            })));

            return this;
        },
        deleteModel: function (e) {
            var that = this;

            e.preventDefault();

            this.model.destroy({
                success: function () {
                    console.log('model deletes');
                    that.remove();
                }
            });
        },
        close: function () {
            this.unbind();
            this.off(); // Unbind all local event bindings
            this.stopListening();
            this.remove(); // Remove view from DOM
            delete this.$el; // Delete the jQuery wrapped object variable
            delete this.el; // Delete the variable reference to this node
        }

    });

});
