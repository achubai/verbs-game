/**
 * Created by achubai on 4/15/2016.
 */

define([
    'underscore',
    'backbone'
], function (_, Backbone) {
    'use strict';

    return Backbone.View.extend({
        isRendered: false,

        hide: function () {
            this.$el.hide();
        },
        show: function () {
            this.$el.show();
        }
    });
});
