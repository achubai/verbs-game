/**
 * Created by achubai on 10/30/2015.
 */

define([
    'backbone'
], function (Backbone) {

    'use strict';

    return Backbone.Model.extend({
        idAttribute: '_id',
        default: {
            v1: '',
            v2: '',
            v3: '',
            ing: '',
            translate: ''
        }
    });
});
