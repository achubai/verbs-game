/**
 * Created by achubai on 11/10/2015.
 */

define([
    'backbone',
    '../models/user',
], function (Backbone, UserModel) {

    return Backbone.Collection.extend({
        model: UserModel,
        url: '/api/users',
        initialize: function () {
            var that = this;

            this.fetch().done(function () {
                that.trigger('userCollectionFetched', that);
            });
        }
    })

});