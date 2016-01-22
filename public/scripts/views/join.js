/**
 * Created by achubai on 11/12/2015.
 */
define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {

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
            if(!this.isRendered) {
                this.$modal = $('#join-modal');
                this.$el.append(this.template());

                this.isRendered = true;
            }

            this.$modal.modal('show');

            return this;
        },
        close: function () {
            this.$modal.modal('hide');
            window.router.navigate('');
        },
        sendData: function (e) {
            if(this.validate()) {
                var $form = $(e.currentTarget);

                $.ajax({
                    method: "POST",
                    url: '/api/users',
                    data: $form.serialize(),

                    success: function(data) {
                        console.log('success');
                        console.log(JSON.stringify(data));
                    }
                });
            }
            return false;
        },
        validate: function () {
            var that = this;
            this.errors = 0;

            _.each(this.$el.find('.form-control'), function (el){
                $(el).parents('.form-group').removeClass('has-error');

                if($(el).attr('id') != 'join-confirm-pass') {
                    if ($(el).val() == '') {
                        $(el).parents('.form-group').addClass('has-error');

                        that.errors++;
                    }
                } else {
                    if($(el).val() != that.$el.find('#join-pass').val()) {
                        $(el).parents('.form-group').addClass('has-error');
                        that.errors++;
                    }
                }
            });

            return !this.errors;
        }

    });
});