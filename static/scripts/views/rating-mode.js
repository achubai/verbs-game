/**
 * Created by achubai on 3/17/2016.
 */
define([
    'jquery',
    'underscore',
    'backbone',
    '../utils/verbs',
    '../utils/stats'
], function ($, _, Backbone, verbsUtils, statsUtils) {

    'use strict';

    return Backbone.View.extend({

        className: 'b-rating verbs-tab-block',
        template: _.template($('#rating-template').html()),
        events: {
            'click .b-start-container .btn': 'beforeStartTest',
            'keypress .form-control': 'checkVerb'
        },
        initialize: function () {
            this.listenTo(this, 'beforeTimerIsOut', this.startTest);
        },
        render: function () {
            var model;

            this.resetTest();

            this.userData = JSON.parse(localStorage.getItem('verbsUserData'));

            this.userId = this.userData ? this.userData.id : null;

            // this.verbs = [
            //    {
            //        id:"56fbddc39fe007cc6dbb79da",
            //        time:2,
            //        translate:"??????????",
            //        v2:"split"
            //    },
            //    {
            //        id:"56fbddc39fe007cc6dbb79da",
            //        time:2,
            //        translate:"??????????",
            //        v2:"split"
            //    },{
            //        id:"56fbddc39fe007cc6dbb79da",
            //        time:2,
            //        translate:"??????????",
            //        v2:"split"
            //    },
            //    {
            //        id:"56fbddc39fe007cc6dbb79da",
            //        time:2,
            //        translate:"??????????",
            //        v2:"split"
            //    },{
            //        id:"56fbddc39fe007cc6dbb79da",
            //        time:2,
            //        translate:"??????????",
            //        v2:"split"
            //    },
            //    {
            //        id:"56fbddc39fe007cc6dbb79da",
            //        time:2,
            //        translate:"??????????",
            //        v2:"split"
            //    },{
            //        id:"56fbddc39fe007cc6dbb79da",
            //        time:2,
            //        translate:"??????????",
            //        v2:"split"
            //    },
            //    {
            //        id:"56fbddc39fe007cc6dbb79da",
            //        time:2,
            //        translate:"??????????",
            //        v2:"split"
            //    },{
            //        id:"56fbddc39fe007cc6dbb79da",
            //        time:2,
            //        translate:"??????????",
            //        v2:"split"
            //    },
            //    {
            //        id:"56fbddc39fe007cc6dbb79da",
            //        time:2,
            //        translate:"??????????",
            //        v2:"split"
            //    },{
            //        id:"56fbddc39fe007cc6dbb79da",
            //        time:2,
            //        translate:"??????????",
            //        v2:"split"
            //    },
            //    {
            //        id:"56fbddc39fe007cc6dbb79da",
            //        time:2,
            //        translate:"??????????",
            //        v2:"split"
            //    }
            //
            // ];

            this.verbs = this.collection.getVerbsArray(true, 'all');
            this.verb = verbsUtils.getRandomVerb(this.verbs).verb;

            model = _.extend(this.verb, {
                user: this.userId
            });

            $('.b-verbs-container').append(this.$el.html(this.template(model)));

            this.$el.show();

            return this;
        },
        beforeStartTest: function () {
            var that = this;

            this.$startTestContainer = $('.b-start-container');
            this.$timeLine = $('.b-game-progress ');
            this.$beforeStartTimer = $('.b-before-start-timer');
            this.$testCounter = $('.test-counter');
            this.$testBlock = $('.b-test-block');
            this.$audioGong = $('#gong').get(0);
            this.$audioCorrect = $('#correct').get(0);
            this.$audioIncorrect = $('#incorrect').get(0);
            this.$audioShowResult = $('#show-result').get(0);
            this.$audioStartTick = $('#start-tick').get(0);
            this.$audioBonus = $('#bonus').get(0);
            this.$title = this.$el.find('h1');
            this.$input = this.$el.find('.form-control');
            this.$correctCounter = this.$el.find('.correct-counter');

            this.beforeStartTimerCounter = 3;
            this.mainCounter = 0;
            this.inSuccessionMainCounter = 0;
            this.inSuccessionCounter = 0;
            this.points = 10;
            this.pointsBonus = 0;
            this.timerCount = 60;
            this.statsList = [];
            this.successVerb = null;

            this.$testCounter.text(this.mainCounter);
            this.$startTestContainer.addClass('bounceOut animated');

            this.beforeStartTimer = setTimeout(function () {
                that.$startTestContainer.hide();
                that.$beforeStartTimer.show().text(that.beforeStartTimerCounter);

                that.beforeStartTimerInterval = setInterval(function () {
                    that.beforeStartTimerCounter -= 1;

                    if (that.beforeStartTimerCounter < 0) {
                        clearInterval(that.beforeStartTimerInterval);
                        that.$beforeStartTimer.hide();
                        that.$testCounter.show();
                        that.$testBlock.show();
                        that.playAudio(that.$audioGong);
                        that.trigger('beforeTimerIsOut');
                        that.$input.focus();
                    } else {
                        that.playAudio(that.$audioStartTick);
                        that.$beforeStartTimer.show().text(that.beforeStartTimerCounter);
                    }

                }, 1000);
            }, 1000);

            this.$timeLine.find('.progress-bar').width('100%').text(this.timerCount);

        },
        startTest: function () {
            this.$input.focus();
            this.startTimer();
        },
        playAudio: function (el) {
            el.pause();
            el.currentTime = 0;
            el.play();
        },
        startTimer: function () {
            var that = this;

            this.timer = setInterval(function () {
                that.timerCount -= 1;

                if (that.timerCount < 0) {
                    that.endTest();
                    clearInterval(that.timer);
                } else {
                    that.$timeLine.find('.progress-bar').width(100 / 60 * that.timerCount + '%').text(that.timerCount);
                }

            }, 1000);
        },
        endTest: function () {
            this.$testBlock.hide();
            this.playAudio(this.$audioShowResult);
            this.$startTestContainer.removeClass('bounceOut').addClass('bounceIn');
            this.$startTestContainer.show();
            this.$testCounter.text('Your score ' + this.mainCounter);

            this.sendResult();
        },
        checkVerb: function (e) {
            if (e.keyCode === 13) {
                if (this.$input.val().trim() !== '') {
                    if (verbsUtils.checkVerb(this.$input.val().trim(), this.verb['v' + this.verb.time])) {
                        this.isCorrect();
                    } else {
                        // this.isCorrect();
                        this.isIncorrect();
                    }

                    this.catchStats(this.successVerb);
                    this.getNewVerb();
                }
            }
        },
        isCorrect: function () {
            this.playAudio(this.$audioCorrect);
            this.inSuccessionMainCounter += 1;
            this.inSuccessionCounter += 1;
            this.successVerb = true;
            this.updateInSuccessionCounter();
            this.updateMainCounter();
            this.updateBonusText();
        },
        isIncorrect: function () {
            this.playAudio(this.$audioIncorrect);
            this.inSuccessionMainCounter = 0;
            this.inSuccessionCounter = 0;
            this.pointsBonus = 0;
            this.successVerb = false;
            this.updateInSuccessionCounter();
            this.updateBonusText();
        },
        updateInSuccessionCounter: function () {
            var that = this,
                icon;

            this.$correctCounter.find('.correct-item').each(function (i, el) {
                icon = i + 1 <= that.inSuccessionCounter ? 'glyphicon-ok-sign' : 'glyphicon-empty';

                $(el).find('.glyphicon').removeClass('glyphicon-empty glyphicon-ok-sign').addClass(icon);
            });
        },
        updateMainCounter: function () {
            this.countBonus();

            this.mainCounter += this.points + this.pointsBonus;
            this.$testCounter.text(this.mainCounter);

        },
        countBonus: function () {
            var bonus = Math.floor(this.inSuccessionMainCounter / 4);

            if (bonus && bonus * 20 !== this.pointsBonus) {
                this.inSuccessionCounter = 0;
                this.pointsBonus = bonus * 20;
                this.playAudio(this.$audioBonus);
                this.updateInSuccessionCounter();
            }
        },
        updateBonusText: function () {
            if (this.pointsBonus) {
                this.$correctCounter.find('.counter-text').text('+ ' + this.pointsBonus + ' points for the word');
            } else {
                this.$correctCounter.find('.counter-text').text('');
            }
        },
        getNewVerb: function () {
            var newData = verbsUtils.getRandomVerb(this.verbs, this.verb);

            this.verb = newData.verb;
            this.verbs = newData.verbs;
            this.successVerb = null;

            this.renderNew();
        },
        renderNew: function () {
            this.$title.find('.text').text('V' + this.verb.time + ' ' + this.verb['translate']);

            this.$input.focus().val('');
        },
        catchStats: function (success) {
            var verbStats = {};

            verbStats.userId = this.userId;
            verbStats.verbId = this.verb._id;
            verbStats.verbForm = this.verb.time;
            verbStats.usedHint = false;
            verbStats.success = success;
            console.log(this.statsList);
            this.statsList.push(verbStats);
        },
        sendResult: function () {
            var that = this;

            if (this.userId) {
                $.ajax({
                    method: 'POST',
                    url: 'api/rating',
                    data: {
                        userId: that.userId,
                        score: that.mainCounter,
                        statsList: that.statsList
                    },
                    success: function (data) {
                        if (data.err) {
                            console.log(data.err);
                            window.router.trigger('showAlert', {
                                type: 'danger',
                                text: data.err
                            });
                        } else {
                            window.router.trigger('showAlert', {
                                type: 'success',
                                text: 'Your data was saved'
                            });
                        }
                    }
                });

                return false;
            } else {
                statsUtils.sendStats(this.statsList);
            }
        },
        resetTest: function () {
            if (this.timer) {
                clearInterval(this.timer);
                this.$timeLine.find('.progress-bar').width('0%').text('');
            }

            if (this.beforeStartTimer) {
                clearTimeout(this.beforeStartTimer);
                this.$timeLine.find('.progress-bar').width('0%').text('');
            }

            if (this.beforeStartTimerInterval) {
                clearInterval(this.beforeStartTimerInterval);
                this.$timeLine.find('.progress-bar').width('0%').text('');
            }
        }


    });
});
