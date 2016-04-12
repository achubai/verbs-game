/**
 * Created by achubai on 3/21/2016.
 */

define([
    'underscore'
],function (_) {

    function getRandomVerb (collection, elem) {
        var verb;

        if (elem) {
            collection = _.reject(collection, function (el) {
                return el == elem;
            });
        }

        if (collection.length != 0) {
            verb = collection[_.random(collection.length - 1)];
        } else {
            verb = false;
        }

        return {
            verbs: collection,
            verb: verb
        }
    }
    function checkVerb (insertedVerb, originalVerb) {
        var isCorrect;
        insertedVerb.toLowerCase() === originalVerb.toLowerCase() ? isCorrect = true : isCorrect = false;

        return isCorrect;
    }

    return {
        getRandomVerb: getRandomVerb,
        checkVerb: checkVerb
    }

});