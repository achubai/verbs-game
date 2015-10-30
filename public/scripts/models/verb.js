/**
 * Created by achubai on 10/30/2015.
 */

define([
    'backbone'
], function (Backbone) {

    return Backbone.Model.extend({
        idAttribute: '_id',
        default: {
            id: 1,
            v1 : 'begin',
            v2 : 'began',
            v3 : 'begun',
            ing : 'beginning',
            translate : '????????'
        }
    });

});