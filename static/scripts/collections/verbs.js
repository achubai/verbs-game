/**
 * Created by achubai on 10/30/2015.
 */

define([
    'underscore',
    'backbone',
    '../models/verb'
], function (_, Backbone, VerbModel) {

    'use strict';

    return Backbone.Collection.extend({
        model: VerbModel,
        url: '/api/verbs',
        initialize: function () {
            var that = this;

            this.fetch().done(function () {
                that.trigger('verbsCollectionFetched', that);
            });
        },
        getVerbsArray: function (allRandom, gameLength) {
            var verb,
                allRandomVerbs = [],
                found = false,
                verbTime,
                obj;

            if (gameLength === 'all') {
                gameLength = 90;
            }

            if (allRandom) {
                while (allRandomVerbs.length < gameLength) {

                    verb = this.models[_.random(this.models.length - 1)];
                    verbTime = _.random(1, 3);
                    obj = {
                        _id: verb.get('_id'),
                        translate: verb.get('translate'),
                        time: verbTime
                    };

                    obj['v' + verbTime] = verb.get('v' + verbTime);

                    found = _.findWhere(allRandomVerbs, obj);

                    if (!found) {
                        allRandomVerbs.push(obj);
                    }
                    found = false;
                }
            } else {
                while (allRandomVerbs.length < (gameLength / 3)) {
                    verb = this.toJSON()[_.random(this.models.length - 1)];
                    found = _.findWhere(allRandomVerbs, verb);

                    if (!found) {
                        allRandomVerbs.push(verb);
                    }
                    found = false;
                }
            }

            return allRandomVerbs;
        }
    });
});
