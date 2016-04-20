/**
 * Created by achubai on 11/12/2015.
 */
define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {

    'use strict';

    return Backbone.View.extend({

        el: '#join-modal .modal-content',
        template: _.template($('#join-template').html()),
        initialize: function () {
            this.isRendered = false;
        },
        events: {
            'click .close': 'close',
            'submit #join-form': 'sendData'
        },
        render: function () {
            if (!this.isRendered) {
                this.$modal = $('#join-modal');
                this.$el.append(this.template());

                this.isRendered = true;
            }

            this.$modal.modal('show');

            return this;
        },
        close: function () {
            window.router.goToPreviousRoute();
        },
        sendData: function (e) {
            var that = this,
                $form = $(e.currentTarget);

            if (this.validate()) {

                $.ajax({
                    method: 'POST',
                    url: '/api/users',
                    data: $form.serialize(),

                    success: function (data) {
                        if (data.err) {
                            that.validate(data.err, data.message);
                        } else {
                            that.close();
                            that.saveUser(data);

                            that.trigger('reRenderMenu', that);
                            that.trigger('reRenderVerbsList', that);
                            that.trigger('renderHomeView', that);
                        }
                    }
                });
            }
            return false;
        },
        validate: function (err, message) {
            var that = this,
                $formLine;

            this.errors = 0;

            if (err) {

                if (err === 'user') {
                    $formLine = this.$el.find('#join-name').parents('.form-group');

                    $formLine.addClass('has-error');
                    $formLine.find('.help-block').text(message);
                } else {
                    $formLine = this.$el.find('#join-email').parents('.form-group');

                    $formLine.addClass('has-error');
                    $formLine.find('.help-block').text(message);
                }
            } else {
                _.each(this.$el.find('.form-control'), function (el) {
                    $(el).parents('.form-group').removeClass('has-error');

                    if ($(el).attr('id') !== 'join-confirm-pass') {
                        if ($(el).val() === '') {
                            $(el).parents('.form-group').addClass('has-error');

                            that.errors += 1;
                        }
                    } else {
                        if ($(el).val() !== that.$el.find('#join-pass').val()) {
                            $(el).parents('.form-group').addClass('has-error');
                            that.errors += 1;
                        }
                    }
                });
            }

            return !this.errors;
        },
        saveUser: function (data) {
            localStorage.setItem('verbsUserData', JSON.stringify(data));
        }

    });
});
