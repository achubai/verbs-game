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
            this.fetch();
        }
    });

    return VerbsCollection;
})