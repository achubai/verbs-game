/**
 * Created by achubai on 3/23/2016.
 */
define([
    'jquery',
    'underscore',
    '../utils/base-view'
], function ($, _, BaseView) {

    'use strict';

    return BaseView.extend({
        className: 'b-rating-list verbs-tab-block',
        template: _.template($('#rating-list-template').html()),
        getData: function () {
            return $.ajax({
                method: 'GET',
                url: 'api/rating',
                success: function (data) {
                    if (data.err) {
                        window.router.trigger('showAlert', {
                            type: 'danger',
                            text: data.err
                        });
                    }
                }
            });
        },
        render: function () {
            var that = this;

            this.$el.html('');

            this.getData().done(function (data) {
                _.each(data, function (el) {
                    that.$el.append(that.template({
                        username: el.user.username,
                        score: el.score
                    }));
                });

                $('.b-verbs-container').append(that.$el);
            });

            this.isRendered = true;

            this.$el.show();

            return this;
        },
        show: function () {
            this.render();
        }
    });

});
