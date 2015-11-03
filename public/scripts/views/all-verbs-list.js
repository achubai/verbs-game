/**
 * Created by achubai on 10/30/2015.
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'views/all-verbs-item',
    'views/verb-item-edit',
    'models/verb',
    'bootstrap'
], function ($, _, Backbone, AllVerbsItem, VerbItemEditView, VerbModel) {

    return Backbone.View.extend({
        tagName: 'table',
        className: 'b-verbs-table table',
        initialize: function () {

        },
        render: function () {
            this.$el.html('');

            var that = this;
            this.collection.each(function (el) {
                var item = new AllVerbsItem({model: el});

                that.$el.append(item.el);
            });

            $('.b-verbs-container').html('').append(this.$el);
            console.log('render');
            return this;
        },
        renderOne: function (el) {
            var item = new AllVerbsItem({model: el});
            this.$el.append(item.el);
            console.log('renderOne');
        },
        addNew: function (model) {
            console.log('addNew');
            this.collection.create(model, {'silent': true});
            this.listenToOnce(this.collection, 'sync', this.fetchNewModel);
            this.destroyVerbView();
        },
        fetchNewModel: function (model, res) {
            console.log('fetchNewModel');
            model.set({_id: res.id });
            this.renderOne(model);
        },
        createVerbView: function () {
            console.log('createVerbView');
            this.verbItemEditView = new VerbItemEditView({model : new VerbModel});
            this.verbItemEditView.render();

            this.listenToOnce(this.verbItemEditView, 'addNewModel', this.addNew);
            this.listenToOnce(this.verbItemEditView, 'removeNewModel', this.destroyVerbView);
        },
        destroyVerbView: function () {
            console.log('destroyVerbView');
            this.stopListening(this.verbItemEditView);
            this.verbItemEditView = undefined;
        }
    });

});
