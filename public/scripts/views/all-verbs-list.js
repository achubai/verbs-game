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
        className: 'b-verbs-list verbs-tab-block',
        template: _.template($('#verbs-list-template').html()),
        verbsArray: [],
        events: {
            'keyup #search': 'renderList'
        },
        initialize: function () {
        },
        render: function () {
            var userData = localStorage.getItem('verbsUserData');

            this.admin = false;

            if (userData) {
                var data = JSON.parse(userData);

                if (data.permission === "admin") {
                    this.admin = true;
                }
            }

            if(!$('.b-verbs-list').length) {

                $('.b-verbs-container').append(this.$el.html(this.template({admin: this.admin})));

                this.$search = $('.b-verbs-container').find('#search');

                this.renderList();


                return this;
            } else {
                this.$el.parents('.b-verbs-list').show();
            }


        },
        renderList: function (e) {
            var that = this;

            while (this.verbsArray.length !== 0) {
                this.verbsArray.pop().close();
            }

            this.collection.models.filter(function (el) {
                return _.some(['v1', 'v2', 'v3', 'translate'], function (i) {
                    return el.get(i).indexOf(that.$search.val()) != -1
                });

            }).forEach(function (el) {
                var item = new AllVerbsItem({model: el});
                that.verbsArray.push(item);
                that.$el.find('tbody').append(item.el);
            });


        },
        renderOne: function (el) {
            var item = new AllVerbsItem({model: el});
            this.$el.append(item.el);
        },
        addNew: function (model) {
            console.log('addNew');
            this.collection.create(model, {'silent': true});
            this.listenToOnce(this.collection, 'sync', this.fetchNewModel);

        },
        fetchNewModel: function (model, res) {

            model.set({_id: res.id });
            this.renderOne(model);
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
        },
        reRender: function () {
            this.$el.parents('.b-verbs-container').html('');
            this.$el.html('');
            this.render();
        }
    });

});
