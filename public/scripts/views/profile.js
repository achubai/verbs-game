/**
 * Created by achubai on 1/28/2016.
 */
define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {

    return Backbone.View.extend({
        className: 'b-profile verbs-tab-block',
        template: _.template($('#profile-template').html()),
        events: {

        },
        initialize: function () {


        },
        render: function () {
            var localData = JSON.parse(localStorage.getItem('verbsUserData'));
            var id = localData ? localData.id : '';

            if(!$('.b-profile').length) {
                var that = this;
                $.ajax({
                    method: 'GET',
                    url: '/api/users/' + id,
                    success: function (data) {

                        $('.b-verbs-container').append(
                            that.$el.html(that.template({
                                email: data.email,
                                username: data.username
                            }))
                        );
                    }
                });

                return this;
            }

            this.$el.show();
        }
    })
});