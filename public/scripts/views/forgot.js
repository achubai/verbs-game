/**
 * Created by achubai on 3/16/2016.
 */

define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {

    return Backbone.View.extend({

        el: '#forgot-modal .modal-content',
        template: _.template($('#forgot-template').html()),
        initialize: function () {
            this.isRendered = false;
        },
        events: {
            'click .close': 'close',
            'submit #forgot-form': 'sendData'
        },
        render: function () {
            if(!this.isRendered) {
                this.$modal = $('#forgot-modal');
                this.$el.append(this.template());

                this.isRendered = true;
            }

            this.$modal.modal('show');

            return this;
        },
        close: function () {
            this.$modal.modal('hide');
            window.router.navigate('', true);
        },
        sendData: function (e) {
            var that = this;
            var $form = $(e.currentTarget);

            $.ajax({
                method: 'POST',
                url: 'api/restore/password',
                data: $form.serialize(),
                success: function (data) {
                    if (data.err) {
                        that.throwError(data.err, data.message)
                    } else {
                        that.clearForm();
                        that.close();
                        window.router.trigger('showAlert', {
                            type: 'success',
                            text: data.message
                        })
                    }
                }
            });

            return false;
        },
        throwError: function (err, message) {
            this.$el.find('input[name=' + err + ']').parents('.form-group').addClass('has-error');
            this.$el.find('input[name=' + err + ']').parents('.form-group').find('.help-block').text(message);
        },
        clearForm: function () {
            this.$el.find('.form-group').removeClass('has-error');
            this.$el.find('#forgot-password').val('');
        }

    });

});