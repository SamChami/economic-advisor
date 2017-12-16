(($) => {

    $.fn.risk = function (options) {
        const $this = this;
        let $current = null;
        let colorCode = 0;
        let colorRGB = '';
        let riskMeter = "";
        let right = 0;
        let pastX = 0;

        $this.addClass("risk").mousedown(function (event) {
            $current = $(this);
            pastX = event.screenX - ($current.data('mousePosition') || 0);
        });

        // Other mouse events go at the level of the document because
        // they might leave the element's bounding box.
        $(document).mousemove(event => {
            right = $('#slider-rectangle-right-bound').position().left;
            if ($current) {
                colorCode = 255 * $current.data('mousePosition') / (right - 10);
                colorRGB = `rgba(${Math.round(colorCode)}, ${Math.round(Math.abs(255 - colorCode))}, 0, 0.5)`;
                riskMeter = colorCode > 170 ? "High Risk" : colorCode > 85 ? "Medium Risk" : "Low Risk";
                $current.css({
                    'opacity': '0.5',
                    'transform': 'translateX(' + $current.data('mousePosition') + 'px)',
                    'background-color': colorRGB
                }).data({
                    'mousePosition': event.screenX - pastX
                });

                if ($current.data('mousePosition') < 0) {
                    $current.data({'mousePosition': 0});
                } else if ($current.data('mousePosition') >= right - 18) {
                    $current.data({'mousePosition': right - 18});
                }

                if ($.isPlainObject(options) && $.isFunction(options.change)) {
                    options.change.call($current, colorRGB, riskMeter);
                }
            }
        }).mouseup(() => {
            $current.css({'opacity': '1'});
            $current = null;
        });

        return $this;


    };
})(jQuery);
