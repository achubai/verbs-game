/**
 * Created by achubai on 3/21/2016.
 */

define([
    'underscore'
],function (_) {

    'use strict';

    /**
     * get random verb from collection and reject previous verb if u need
     * @param {Array} collection - verbs collection
     * @param {Object} elem - verb which be removed from collection
     * @return {Object} obj
     * obj.verbs - collection without {elem}
     * obj.verb - random verb from collection
     * */
    function getRandomVerb (collection, elem) {
        var verb;

        if (elem) {
            collection = _.reject(collection, function (el) {
                return el == elem;
            });
        }

        if (collection.length === 0) {
            verb = false;
        } else {
            verb = collection[_.random(collection.length - 1)];
        }

        return {
            verbs: collection,
            verb: verb
        };
    }

    /**
     * compare two string
     * @param {String} insertedVerb - verb which user insert in the field
     * @param {String} originalVerb - verb from collection
     * @return {Boolean} first param === second param
     * */
    function checkVerb (insertedVerb, originalVerb) {
        var isCorrect;

        insertedVerb.toLowerCase() === originalVerb.toLowerCase() ? isCorrect = true : isCorrect = false;

        return isCorrect;
    }

    return {
        getRandomVerb: getRandomVerb,
        checkVerb: checkVerb
    };
});
