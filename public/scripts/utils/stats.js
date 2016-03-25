/**
 * Created by achubai on 3/23/2016.
 */
define([
    'jquery'
], function ($) {

    function sendStats (statsList) {

        $.ajax({
            method: 'POST',
            url: 'api/stats',
            data: {
                statsList: statsList
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
    }

    return {
        sendStats : sendStats
    }
});