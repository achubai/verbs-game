/**
 * Created by achubai on 10/30/2015.
 */
define([
    'jquery',
    'underscore',
    'backbone'

], function ($, _, Backbone) {

    return Backbone.View.extend({

        tagName: 'tr',
        template: _.template($('#verbs-item').html()),
        initialize: function () {
            this.render();
            this.listenTo(this.model, 'change', this.render);
        },
        events: {
            'click .remove': 'deleteModel'
        },
        render: function () {
            var admin = JSON.parse(localStorage.getItem('verbsUserData')) ? JSON.parse(localStorage.getItem('verbsUserData')).permission : 'user' ;

            this.$el.html(this.template(_.extend(this.model.toJSON(), {
                admin: admin
            })));

            return this;
        },
        deleteModel: function (e) {
            e.preventDefault();
            var that = this;

            this.model.destroy({
                success: function () {
                    console.log('model deletes');
                    that.remove();
                }
            });
        }

    });

});
