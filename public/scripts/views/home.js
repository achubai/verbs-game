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
            this.time = 1;
            this.verbs  = this.collection.models;
            this.gameCount = 0;
            this.succcessCount = 0;

            this.$progress = $('.b-game-progress');
        },
        render: function () {
            console.log(this.verbs);
            var model = _.extend(this.pseudoRandomVerb().toJSON(), {
                time: this.time
            });

            this.$el.show();

            $('.b-verbs-container').append(this.$el.html(this.template(model)));

            this.$title = this.$el.find('h1');
            this.$input = this.$el.find('.form-control');
            this.$counter = this.$el.find('.counter');

            this.$input.focus();

            return this;
        },
        pseudoRandomVerb: function (elem) {
            if (elem) {
                this.verbs = _.reject(this.verbs, function(el){
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
        },
        checkVerb: function (e) {
            if (e.keyCode == 13) {

                var value = this.$input.val().trim();

                if (value != '') {
                    this.gameProgress();

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
            var progress = this.getPercent(this.gameCount, (this.collection.length * 3));

            this.$progress.find('.progress-bar').text(this.gameCount + ' / ' + this.collection.length * 3).width(progress + '%');
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