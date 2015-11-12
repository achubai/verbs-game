/**
 * Created by achubai on 11/12/2015.
 */
define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {

    return Backbone.View.extend({

        el: '#auth-modal .modal-content',
        template: _.template($('#join-template').html()),
        initialize: function () {},
        events: {
            'click .close': 'close',
        },
        render: function () {
            this.$modal = $('#auth-modal');

            this.$el.append(this.template());

            this.$modal.modal('show');

            return this;
        },
        close: function () {

        }

    });
});