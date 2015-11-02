/**
 * Created by achubai on 11/2/2015.
 */
define([
    'jquery',
    'underscore',
    'backbone'
], function ($, _, Backbone) {

    return Backbone.View.extend({

        el: '#verb-edit-modal .modal-content',
        template: _.template($('#verbs-item-edit').html()),
        initialize: function () {

        },
        events: {
            'click .close': 'close',
            'click .btn-default[data-dismiss]': 'close',
            'click .btn-primary[type=submit]': 'saveModel'
        },
        render: function () {
            this.$modal = $('#verb-edit-modal');
            this.$el.html('');

            if (this.model.isNew()) {
                this.$el.append(this.template());
            } else {
                this.$el.append(this.template(this.model.toJSON()));
            }
            this.$modal.modal('show');

            return this;
        },
        close: function () {
            console.log(this.model.isNew());
            if(this.model.isNew()) {
                this.model.destroy();
            }

            window.router.navigate('/verbs');
        },
        saveModel: function () {
            this.model.set({
                v1: this.$el.find('#v1').val(),
                v2: this.$el.find('#v2').val(),
                v3: this.$el.find('#v3').val(),
                ing: this.$el.find('#ing').val(),
                translate: this.$el.find('#translate').val()
            });

            if (this.model.isNew()) {
                this.trigger('addNewModel', this.model);
            } else {
                this.model.save({error: function(){
                    console.log('can not be saved');
                }});
                console.log(this.model.url());
            }
        }

    });
});