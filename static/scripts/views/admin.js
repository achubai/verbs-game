/**
 * Created by achubai on 3/11/2016.
 */

define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {

    'use strict';

    return Backbone.View.extend({
        className: 'b-admin verbs-tab-block',
        template: _.template($('#admin-template').html()),
        events: {
            'submit #change-password-form': 'changePassword'
        },
        initialize: function () {
            this.isRendered = false;
        },
        render: function () {
            if (!this.isRendered) {
                $('.b-verbs-container').append(this.$el.html(
                    this.template()
                ));
                this.isRendered = true;

                return this;
            }

            this.$el.show();

            return false;
        },
        changePassword: function (e) {
            var $form = $(e.currentTarget),
                that = this;

            if (!this.validatePassword()) {
                $.ajax({
                    method: 'PUT',
                    url: 'api/users/' + that.userId + '/password',
                    data: $form.serialize(),
                    success: function (data) {
                        if (data.err) {
                            that.throwError(data.err, data.message);
                        } else {
                            that.cleanForm();

                            window.router.trigger('showAlert', {
                                type: 'success',
                                text: data.message
                            });
                        }
                    }
                });
            }
            return false;
        },
        validatePassword: function () {
            var that = this;

            this.errors = 0;

            _.each(this.$el.find('#change-password-form .form-control'), function (el) {
                $(el).parents('.form-group').removeClass('has-error');
                $(el).parents('.form-group').find('.help-block').text('');
                if ($(el).val() === '') {

                    that.throwError($(el).attr('name'), 'Fill the area');
                    that.errors += 1;

                }
            });
            return this.errors;
        },
        throwError: function (err, message) {
            this.$el.find('input[name=' + err + ']').parents('.form-group').addClass('has-error');
            this.$el.find('input[name=' + err + ']').parents('.form-group').find('.help-block').text(message);
        },
        cleanForm: function () {
            _.each(this.$el.find('#change-password-form .form-group'), function (el) {
                $(el).removeClass('has-error').find('.help-block').text('');
                $(el).find('.form-control').val('');
            });
        }
    });

});
