/**
 * Created by achubai on 11/12/2015.
 */
define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {

    return Backbone.View.extend({

        el: '#signin-modal .modal-content',
        template: _.template($('#signin-template').html()),
        initialize: function () {
            this.isRendered = false;
        },
        events: {
            'click .close': 'close',
            'submit #signin-form': 'sendData',
            'click a[href="#forgot"]': 'close'
        },
        render: function () {
            if(!this.isRendered) {
                this.$modal = $('#signin-modal');
                this.$el.append(this.template());

                this.isRendered = true;
            }

            this.$modal.modal('show');

            return this;
        },
        close: function () {
            this.$modal.modal('hide');
            window.router.navigate('', {trigger: true});
        },
        sendData: function (e) {
            if(this.validate()) {
                var that = this;
                var $form = $(e.currentTarget);

                $.ajax({
                    method: "POST",
                    url: '/api/signin',
                    data: $form.serialize(),
                    success: function(data) {
                        if (data.err) {
                            that.validate(data.err, data.message);
                        } else {
                            that.saveUser(data);
                            that.close();

                            that.trigger('reRenderMenu', that);
                            that.trigger('reRenderVerbsList', that);
                            that.trigger('renderHoneView', that);
                        }
                    }
                });
            }
            return false;
        },
        validate: function (err, message) {

            var that = this;
            this.errors = 0;
            if (err) {
                var $formLine;

                if (err === 'user') {
                    $formLine = this.$el.find('#signin-name').parents('.form-group');

                    $formLine.addClass('has-error');
                    $formLine.find('.help-block').text(message);
                } else {
                    $formLine = this.$el.find('#signin-pass').parents('.form-group');

                    $formLine.addClass('has-error');
                    $formLine.find('.help-block').text(message);
                }
            } else {
                _.each(this.$el.find('.form-control'), function (el) {
                    $(el).parents('.form-group').removeClass('has-error');
                    if ($(el).val() == '') {
                        $(el).parents('.form-group').addClass('has-error');

                        that.errors++;
                    }
                });

                return !this.errors;
            }
        },
        saveUser: function (data) {
            localStorage.setItem('verbsUserData', JSON.stringify(data));
        }
    });
});