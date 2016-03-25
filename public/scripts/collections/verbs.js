/**
 * Created by achubai on 10/30/2015.
 */

define([
    'backbone',
    '../models/verb'
], function (Backbone, VerbModel) {

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
            var allRandomVerbs = [];
            var verb;
            var found = false;

            if (gameLength === 'all') {
                gameLength = this.length * 3;
            }

            if(allRandom) {
                while (allRandomVerbs.length < gameLength) {
                    verb = this.models[_.random(this.models.length - 1)];
                    var verbTime = _.random(1, 3);
                    var obj = {
                        _id:   verb.get('_id'),
                        translate: verb.get('translate'),
                        time: verbTime
                    };

                    obj['v' + verbTime] = verb.get('v' + verbTime);

                    found = _.find(allRandomVerbs, function (el) {
                        return _.isEqual(el, obj);
                    });

                    if (!found) allRandomVerbs.push(obj);
                    found = false;
                }
            } else {
                while (allRandomVerbs.length < (gameLength / 3)) {
                    verb = this.toJSON()[_.random(this.models.length - 1)];
                    found = _.find(allRandomVerbs, function (el) {
                        return _.isEqual(el, verb);
                    });

                    if (!found) allRandomVerbs.push(verb);
                    found = false;
                }
            }

            return allRandomVerbs;
        }
    });

});