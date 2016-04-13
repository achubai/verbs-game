/**
 * Created by achubai on 11/10/2015.
 */

define([
    'backbone'
], function (Backbone) {
    'use strict';

    return Backbone.Model.extend({
        idAttribute: '_id',
        urlRoot: '/api/users',
        default: {
            email: '',
            username: '',
            password: ''
        },
        validate: function (attrs) {
            var errors = [];

            if (!attrs.email) {
                errors.push({name: 'email', message: 'Please fill email field.'});
                return '';
            }
            if (!attrs.username) {
                errors.push({name: 'username', message: 'Please fill username field.'});
            }
            if (!attrs.password) {
                errors.push({name: 'password', message: 'Please fill password field.'});
            }
            if (!attrs.confirmPassword || attrs.confirmPassword !== attrs.password) {
                errors.push({name: 'confirmPassword', message: 'Passwords do not match.'});
            }

            return errors.length > 0 ? errors : false;
        }});
});
