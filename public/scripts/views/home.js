/**
 * Created by achubai on 11/3/2015.
 */

define([
    'jquery',
    'underscore',
    'backbone',
    'collections/verbs',
    'bootstrap'
], function ($, _, Backbone, VerbsCollection) {

    return Backbone.View.extend({
        className: 'b-home verbs-tab-block',
        template: _.template($('#home-template').html()),
        events: {
            'keypress .form-control': 'checkVerb'
        },
        initialize: function () {
            this.gameLength = 15;
            this.gameAllRandom = true;
            this.time = 1;
            this.verbs  = this.randomVerbs();
            this.gameCount = 0;
            this.succcessCount = 0;

            this.$progress = $('.b-game-progress');
        },
        render: function () {
            var verb = this.gameAllRandom ? this.pseudoRandomVerb() : this.pseudoRandomVerb().toJSON();

            var model = _.extend(verb , {
                time: this.gameAllRandom ? 'a' : this.time
            });

            this.$el.show();

            $('.b-verbs-container').append(this.$el.html(this.template(model)));

            this.$title = this.$el.find('h1');
            this.$input = this.$el.find('.form-control');
            this.$counter = this.$el.find('.counter');

            this.$input.focus();

            return this;
        },
        randomVerbs: function () {
            var allRandomVerbs = [];
            var verb;
            var found = false;

            if(this.gameAllRandom) {
                while (allRandomVerbs.length < this.gameLength) {
                    verb = this.collection.models[_.random(this.collection.models.length - 1)];
                    found = false;
                    var verbForm = 'v' + _.random(1, 3);
                    var obj = {};
                    obj['_id'] = verb.get('_id');
                    obj[verbForm] = verb.get(verbForm);
                    obj['translate'] = verb.get('translate');

                    for (var i = 0; i < allRandomVerbs.length; i++){
                        if(_.isEqual(allRandomVerbs[i], obj)){
                            found = true;
                            break
                        }
                    }
                    if (!found) allRandomVerbs.push(obj);
                }
            } else {
                while (allRandomVerbs.length < (this.gameLength / 3)) {
                    verb = this.collection.models[_.random(this.collection.models.length - 1)];
                    found = false;

                    for (var j = 0; j < allRandomVerbs.length; j++){
                        if(allRandomVerbs[j]['attributes']['_id'] == verb['attributes']['_id']){
                            found = true;
                            break
                        }
                    }
                    if (!found) allRandomVerbs.push(verb);
                }
            }

            return allRandomVerbs;
        },
        pseudoRandomVerb: function (elem) {
            if(this.gameAllRandom) {
                if (elem) {
                    this.verbs = _.reject(this.verbs, function (el) {
                        return el == elem;
                    });
                }

                if (this.verbs.length != 0) {
                    this.verb = this.verbs[_.random(this.verbs.length - 1)];

                    return this.verb;
                } else {
                    this.endGame();

                    return false;
                }

            } else {
                if (elem) {
                    this.verbs = _.reject(this.verbs, function (el) {
                        return el == elem;
                    });
                }

                if (this.verbs.length != 0) {
                    this.verb = this.verbs[_.random(this.verbs.length - 1)];

                    return this.verb;
                } else {
                    this.endGame();

                    return false;
                }
            }
        },
        checkVerb: function (e) {
            if (e.keyCode == 13) {
                var value = this.$input.val().trim();

                if (value != '') {
                    this.gameProgress();

                    if (this.gameAllRandom) {
                        // ????????? ?????
                    } else {
                        if (value.toLowerCase() == this.verb.get('v' + this.time).toLowerCase()) {
                            this.succcessCount++;
                            this.successCounter('success');
                        } else {
                            console.log(this.verb.get('v' + this.time));
                            this.successCounter('error');
                        }

                        this.newVerb();
                    }
                }
            }
        },
        newVerb: function () {
            this.newTime();
            if (this.time == 1) {
                this.pseudoRandomVerb(this.verb)
                this.renderNew();
            } else {
                this.renderNew()
            }
        },
        newTime: function () {
            this.time = (this.time % 3);
            this.time++;
        },
        renderNew: function () {
            this.$title.text('V' + this.time + ' ' + this.verb.get('translate'));
            this.$input.val('').focus();
        },
        endGame: function () {
            alert('You have ' + this.getPercent((this.gameCount - this.succcessCount), this.gameCount) + '% errors');
        },
        gameProgress: function () {
            this.gameCount++;
            var progress = this.getPercent(this.gameCount, this.gameLength);

            this.$progress.find('.progress-bar').text(this.gameCount + ' / ' + this.gameLength).width(progress + '%');
        },
        successCounter: function (status) {
            var num = status == 'success' ? this.succcessCount : this.gameCount - this.succcessCount;

            this.$counter.find('.line-' + status).find('.value').text(num);
            this.$counter.find('.line-' + status).find('.glyphicon').addClass('bounce');

            that = this;

            setTimeout(function () {
                that.$counter.find('.line-' + status).find('.glyphicon').removeClass('bounce');
            },1500);
        },
        getPercent: function (y , x) {
            return (y / x) * 100;
        }

    });

});