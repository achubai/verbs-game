/**
 * Created by achubai on 11/10/2015.
 */

define([
    'backbone'
], function(Backbone){

    return Backbone.Model.extend({
        idAttribute: '_id',
        default: {
            username: '',
            password: ''
        }
    });

});