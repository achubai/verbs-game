/**
 * Created by achubai on 11/3/2015.
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'collections/verbs',
    'bootstrap'
], function ($, _, Backbone, VerbsCollection) {

    return Backbone.View.extend({
        className: 'b-home',
        template: _.template($('#home-template').html()),
        initialize: function () {

        },
        render: function () {
            var el = this.collection.models[_.random(this.collection.length - 1)];

            $('.b-verbs-container').append(this.$el.append(this.template(el.toJSON())));

            return this;
        }

    });

});