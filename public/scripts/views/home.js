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
        errorsListItemTemplate: _.template($('#game-errors-list-item').html()),
        events: {
            'keypress .form-control': 'checkVerb',
            'click .btn-play-again': 'gameReset',
            'click .take-hint': 'takeHint'
        },
        initialize: function () {
            this.gameLength = 1 * 3; // *3 because verb have 3 times;
            this.gameAllRandom = true;
            this.verbs = this.collection.getVerbsArray(this.gameAllRandom, this.gameLength);
            this.verb = this.getRandomVerb();
            this.time = this.gameAllRandom ? this.verb['time'] : 1;
            this.gameCount = 0;
            this.succcessCount = 0;
            this.errorsList = [];

            this.$progress = $('.b-game-progress');
        },
        render: function () {
            var model = _.extend(this.verb, {
                time: this.time,
                verb: this.verb['v' + this.time]
            });

            this.$el.show();
            console.log(model);
            $('.b-verbs-container').append(this.$el.html(this.template(model)));

            this.$title = this.$el.find('h1');
            this.$input = this.$el.find('.form-control');
            this.$counter = this.$el.find('.counter');
            this.$bntPlayAgain = this.$el.find('.btn-play-again');
            this.$errorsList = this.$el.find('.errors-list');

            this.$input.focus();

            return this;
        },
        getRandomVerb: function (elem) {

            if (elem) {
                this.verbs = _.reject(this.verbs, function (el) {
                    return el == elem;
                });
            }

            if (this.verbs.length != 0) {
                this.verb = this.verbs[_.random(this.verbs.length - 1)];
                return this.verb;
            } else {
                this.verb = false;
                this.endGame();
            }
        },
        checkVerb: function (e) {
            if (e.keyCode == 13) {
                var value = this.$input.val().trim();

                if (value != '') {
                    this.gameProgress();

                    if (value.toLowerCase() == this.verb['v' + this.time].toLowerCase()) {
                        this.succcessCount++;
                        this.successCounter('success');
                    } else {
                        console.log(this.verb);
                        this.successCounter('error');

                        this.errorsList.push({
                            time: this.time,
                            translation: this.verb.translate,
                            answer: this.verb['v' + this.time].toLowerCase(),
                            user: value.toLowerCase()
                        })
                    }

                    this.newVerb();
                }
            }
        },
        newVerb: function () {
            if (this.gameAllRandom) {
                this.getRandomVerb(this.verb);
                this.newTime();
            } else {
                this.newTime();
                if (this.time == 1) {
                    this.getRandomVerb(this.verb);
                }
            }

            if (this.verb) {
                this.renderNew();
            }
        },
        newTime: function () {
            if(this.gameAllRandom) {
                this.time = this.verb['time'];
            } else {
                this.time = (this.time % 3);
                this.time++;
            }
        },
        renderNew: function () {
            var verb = this.verb['v' + this.time];

            this.$title.find('.text').text('V' + this.time + ' ' + this.verb['translate']);
            this.$title.find('.take-hint').attr('data-content', verb).data('bs.popover');
            this.$input.val('').focus();
        },
        endGame: function () {
            this.$title.html('You have ' + Math.round(this.getPercent((this.gameCount - this.succcessCount), this.gameCount)) + '% errors');
            this.$input.hide();
            this.$bntPlayAgain.show().focus();
            console.log(this.errorsList);

            var that = this;

            _.each(this.errorsList, function (model) {
                that.$errorsList.append(that.errorsListItemTemplate(model))
            });
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

            var that = this;

            setTimeout(function () {
                that.$counter.find('.line-' + status).find('.glyphicon').removeClass('bounce');
            },1500);
        },
        getPercent: function (y , x) {
            return (y / x) * 100;
        },
        gameReset: function () {
            this.verbs = this.collection.getVerbsArray(this.gameAllRandom, this.gameLength);
            this.verb = this.getRandomVerb();
            this.time = this.gameAllRandom ? this.verb['time'] : 1;
            this.gameCount = 0;
            this.succcessCount = 0;
            this.errorsList = [];

            this.render();
            this.$progress.find('.progress-bar').text('').width(0);
            $(document).off('keypress');
        },
        takeHint: function () {
            this.$el.find('.take-hint').popover('show');
        }

    });

});