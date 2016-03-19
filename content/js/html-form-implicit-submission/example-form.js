$(function() {
    $('.example-form').on('submit', (function () {
        var inProgress = false;

        return function () {
            var $indicator = $(this).find('.submit-indicator');

            if (inProgress)
                return false;
            inProgress = true;

            $indicator.addClass('submit-indicator-active');
            setTimeout(function () {
                $indicator.removeClass('submit-indicator-active');
                inProgress = false;
            }, 1000);

            return false;
        }
    })())
});