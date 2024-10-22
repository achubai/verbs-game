/**
 * Created by achubai on 3/9/2016.
 */

define([
    'jquery',
    'underscore',
    '../utils/base-view'
], function ($, _, BaseView) {

    'use strict';

    return BaseView.extend({
        className: 'b-settings-container',
        template: _.template($('#settings-template').html()),
        events: {
            'change input[name=verbsNumber]': 'setSettings',
            'change input[name=verbsComplexity]': 'setSettings',
            'submit #user-settings-form': 'setSettings'
        },
        initialize: function () {
            this.beforeSendTimeout = null;
        },
        render: function () {
            this.userData = JSON.parse(localStorage.getItem('verbsUserData'));

            $('#user-settings').append(this.$el.html(
                this.template({
                    number: this.userData.settings.verbs.number,
                    complexity: this.userData.settings.verbs.complexity
                })
            ));
            this.isRendered = true;

            return this;

            return false;
        },
        setSettings: function () {
            var that = this,
                $form = this.$el.find('#user-settings-form');

            this.validateSettings();

            clearTimeout(that.beforeSendTimeout);

            this.beforeSendTimeout = setTimeout(function () {
                $.ajax({
                    method: 'PUT',
                    url: 'api/users/' + that.userId + '/settings',
                    data: $form.serialize(),
                    success: function (data) {

                        if (data.err) {
                            window.router.trigger('showAlert', {
                                type: 'danger',
                                text: data.message
                            });
                        } else {
                            that.userData.settings.verbs = data.verbs;
                            localStorage.setItem('verbsUserData', JSON.stringify(that.userData));

                            window.router.trigger('showAlert', {
                                type: 'success',
                                text: 'Your setting changed'
                            });
                        }
                    }
                });
            }, 1500);

            return false;
        },
        validateSettings: function () {
            var newVal = Math.round(this.$el.find('input[name="verbsNumber"]').val() / 3) * 3;

            this.$el.find('input[name="verbsNumber"]').val(newVal < 3 ? 3 : newVal);
        }
    });
});
