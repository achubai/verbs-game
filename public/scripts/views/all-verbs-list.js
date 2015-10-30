/**
 * Created by achubai on 10/30/2015.
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'collections/verbs',
    'views/all-verbs-item'
], function ($, _, Backbone, verbsCollection, AllVerbsItem) {

    var AllVerbsView = Backbone.View.extend({
        tagName: 'table',
        className: 'b-verbs-table table',
        initialize: function () {
          this.listenTo(this.collection, 'add', this.renderOne, this);
        },
        render: function () {
            $('.layout .container').append(this.$el);

            return this;
        },
        renderOne: function (el) {
            var item = new AllVerbsItem({model: el});
            this.$el.append(item.el);
        }
    });

    return new AllVerbsView({collection: verbsCollection});

});
