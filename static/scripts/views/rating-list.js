/**
 * Created by achubai on 3/23/2016.
 */
define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Bacbone) {

    'use strict';

    return Bacbone.View.extend({
        className: 'b-rating-list verbs-tab-block',
        template: _.template($('#rating-list-template').html()),
        initialize: function () {
            this.isRendered = false;
        },
        render: function () {
            var that = this;

            if (!this.isRendered) {

                $.ajax({
                    method: 'GET',
                    url: 'api/rating',
                    success: function (data) {
                        if (data.err) {
                            window.router.trigger('showAlert', {
                                type: 'danger',
                                text: data.err
                            });
                        } else {
                            _.each(data, function (el) {
                                that.$el.append(that.template({
                                    username: el.user.username,
                                    score: el.score
                                }));
                            });

                            $('.b-verbs-container').append(that.$el);

                            that.isRendered = true;
                        }
                    }
                });

                return false;
            }

            this.$el.show();

            return this;
        }
    });

});
