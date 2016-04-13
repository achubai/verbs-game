/**
 * Created by achubai on 3/14/2016.
 */

define([
    'jquery',
    'underscore',
    'backbone',
    '../views/users-list-item'
], function ($, _, Backbone, UserItemView) {

    'use strict';

    return Backbone.View.extend({
        tagName: 'tbody',
        template: _.template($('#users-list-template').html()),
        events: {
        },
        initialize: function () {
            this.isRendered = false;
            this.collection = null;

            this.getUsersList();
        },
        render: function () {
            var that = this;

            if (!this.isRendered) {
                if (this.collection) {
                    $('.b-verbs-container').append(this.template());
                    _.each(this.collection, function (user) {
                        var item = new UserItemView({model: user});

                        that.$el.append(item.el);
                    });

                    $('.b-verbs-container').find('.b-users-table').append(this.$el);
                    this.$el.parents('.b-users').show();
                    this.isRendered = true;

                    return this;
                } else {
                    this.getUsersList(this.render);
                }
            }

            this.$el.parents('.b-users').show();

            return false;
        },
        getUsersList: function (callback) {

            var that = this;

            $.ajax({
                method: 'GET',
                url: '/api/users/',
                success: function (data) {
                    that.collection = data.users;

                    if (typeof callback === 'function') {
                        callback.call(that);
                    }
                }
            });

            return false;
        }
    });
});
