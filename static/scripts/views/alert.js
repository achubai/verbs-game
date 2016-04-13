/**
 * Created by achubai on 3/8/2016.
 */
define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {

    'use strict';

    return Backbone.View.extend({
        className: 'alert',
        template: _.template($('#alert-template').html()),
        events: {
            
        },
        initialize: function () {
            this.container = $('.b-alerts-container .container');
        },
        render: function (option) {
            var that = this;

            if (option) {
                this.alertType = option.type || 'danger';
                this.alertText = option.text || '';
            }

            this.$el.addClass('alert-' + this.alertType);
            console.log(this.$el);

            if (this.container.find('.alert').length) {
                this.container.find('.alert').each(function (i, el) {
                    $(el).addClass('move-down');

                    setTimeout(function () {
                        $(el).removeClass('move-down');
                    }, 40);

                });
            }

            this.container.prepend(
                this.$el.html(
                    this.template({
                        text: this.alertText
                    })
                )
            );

            setTimeout(function () {
                that.$el.addClass('in');
            }, 0);
            
            setTimeout(function () {
                that.$el.remove();
            }, 3000);

            return this;
        }
    });

});
