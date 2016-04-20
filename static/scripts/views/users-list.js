/**
 * Created by achubai on 3/14/2016.
 */

define([
    'jquery',
    'underscore',
    '../utils/base-view',
    '../views/users-list-item'
], function ($, _, BaseView, UserItemView) {

    'use strict';

    return BaseView.extend({
        className: 'b-users verbs-tab-block',
        template: _.template($('#users-list-template').html()),
        events: {
        },
        getUsersList: function () {
            return $.ajax({
                method: 'GET',
                url: '/api/users/'
            });
        },
        render: function () {
            var that = this,
                list = [];

            this.getUsersList().done(function (data) {
                $('.b-verbs-container').append(that.$el.html(that.template()));

                _.each(data.users, function (user) {
                    var item = new UserItemView({model: user});

                    list.push(item.el);
                });

                that.$el.find('tbody').append(list);
            });

            this.isRendered = true;

            this.$el.show();

            return false;
        },
        show: function () {
            this.render();
        }
    });
});
