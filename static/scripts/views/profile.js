/**
 * Created by achubai on 1/28/2016.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    '../views/settings'
], function ($, _, Backbone, SettingsView) {

    return Backbone.View.extend({
        className: 'b-profile verbs-tab-block',
        template: _.template($('#profile-template').html()),
        settingsView: new SettingsView(),
        events: {
            'submit #change-password-form': 'changePassword'
        },
        initialize: function () {
            this.isRendered = false;
        },
        render: function (callback) {

            var localData = JSON.parse(localStorage.getItem('verbsUserData'));
            this.userId = localData ? localData.id : '';

            if (!this.isRendered) {
                if (!$('.b-profile').length) {
                    var that = this;
                    $.ajax({
                        method: 'GET',
                        url: '/api/users/' + that.userId,
                        success: function (data) {

                            $('.b-verbs-container').append(
                                that.$el.html(that.template({
                                    email: data.email,
                                    username: data.username
                                }))
                            );
                            that.isRendered = true;
                            that.activateTab();

                            if (typeof callback === 'function') {
                                callback.call(that);
                            }
                        }
                    });

                    return this;
                }
            }

            this.activateTab();
            this.$el.show();

        },
        changePassword: function (e) {
            var $form = $(e.currentTarget);

            if(!this.validatePassword()) {
                var that = this;

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
                if ($(el).val() == '') {

                    that.throwError($(el).attr('name'), 'Fill the area');
                    that.errors++;

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
        },
        activateTab: function () {
            var href = window.location.hash.replace('#', '');
            var $tab = this.$el.find('.b-profile-main > .nav > li a[href="#' + href + '"]');

            this.$el.find('.b-profile-main > .nav > li').removeClass('active');
            $tab.closest('li').addClass('active');

            this.$el.find('.b-profile-main .tab-pane').removeClass('active');
            $($tab.data('tab')).addClass('active');

        },
        showSettings: function () {
            this.settingsView.render();

        },
        showStatistics: function () {
            console.log('showStatistics');
        }
    })
});