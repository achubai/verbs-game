/**
 * Created by achubai on 10/30/2015.
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'collections/verbs',
    'views/all-verbs-item',
    'views/verb-item-edit',
    'models/verb',
    'bootstrap'
], function ($, _, Backbone, VerbsCollection, AllVerbsItem, VerbItemEditView, VerbModel) {

    var AllVerbsView = Backbone.View.extend({
        tagName: 'table',
        className: 'b-verbs-table table',
        initialize: function () {
            this.listenTo(this.collection, 'add', this.renderOne, this);
        },
        render: function () {
            $('.b-verbs-container').append(this.$el);

            return this;
        },
        renderOne: function (el) {
            var item = new AllVerbsItem({model: el});
            this.$el.append(item.el);
        },
        addNew: function (model) {
            this.collection.create(model, {'silent': true});
            this.listenToOnce(this.collection, 'sync', this.fetchNewModel);
            this.destroyVerbView();
        },
        fetchNewModel: function (model, res) {
            model.set({_id: res.id });
            this.renderOne(model);
            console.log(this.collection);
        },
        createVerbView: function () {

            this.verbItemEditView = new VerbItemEditView({model : new VerbModel});
            this.verbItemEditView.render();

            this.listenToOnce(this.verbItemEditView, 'addNewModel', this.addNew);
            this.listenToOnce(this.verbItemEditView, 'removeNewModel', this.destroyVerbView);
        },
        destroyVerbView: function () {
            this.stopListening(this.verbItemEditView);
            this.verbItemEditView = undefined;
        }
    });

    return new AllVerbsView({collection: new VerbsCollection()});

});
