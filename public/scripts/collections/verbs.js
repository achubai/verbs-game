/**
 * Created by achubai on 10/30/2015.
 */

define([
    'backbone',
    '../models/verb'
], function (Backbone, VerbModel) {

    var VerbsCollection = Backbone.Collection.extend({
        model: VerbModel,
        url: '/api/verbs',
        initialize: function () {
            var that = this;

            this.fetch().done(function () {
                that.trigger('collectionFetched', that);
            });
        }
    });

    return VerbsCollection;
})