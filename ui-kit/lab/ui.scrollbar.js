((function ($) {
    var toFix = ['wheel', 'mousewheel', 'DOMMouseScroll', 'MozMousePixelScroll'];
    var toBind = 'onwheel' in document || document.documentMode >= 9 ? ['wheel'] :
        ['mousewheel', 'DomMouseScroll', 'MozMousePixelScroll'];
    var lowestDelta, lowestDeltaXY;
    if ($.event.fixHooks) {
        for (var i = toFix.length; i;) {
            $.event.fixHooks[ toFix[--i] ] = $.event.mouseHooks;
        }
    }
    $.event.special.mousewheel = {
        setup: function () {
            if (this.addEventListener) {
                for (var i = toBind.length; i;) {
                    this.addEventListener(toBind[--i], handler, false);
                }
            } else {
                this.onmousewheel = handler;
            }
        },
        teardown: function () {
            if (this.removeEventListener) {
                for (var i = toBind.length; i;) {
                    this.removeEventListener(toBind[--i], handler, false);
                }
            } else {
                this.onmousewheel = null;
            }
        }
    };
    $.fn.extend({
        mousewheel: function (fn) {
            return fn ? this.bind("mousewheel", fn) : this.trigger("mousewheel");
        },
        unmousewheel: function (fn) {
            return this.unbind("mousewheel", fn);
        }
    });
    function handler(event) {
        var orgEvent = event || window.event,
            args = [].slice.call(arguments, 1),
            delta = 0,
            deltaX = 0,
            deltaY = 0,
            absDelta = 0,
            absDeltaXY = 0,
            fn;
        event = $.event.fix(orgEvent);
        event.type = "mousewheel";

        // Old school scrollwheel delta
        if (orgEvent.wheelDelta) {
            delta = orgEvent.wheelDelta;
        }
        if (orgEvent.detail) {
            delta = orgEvent.detail * -1;
        }

        // New school wheel delta (wheel event)
        if (orgEvent.deltaY) {
            deltaY = orgEvent.deltaY * -1;
            delta = deltaY;
        }
        if (orgEvent.deltaX) {
            deltaX = orgEvent.deltaX;
            delta = deltaX * -1;
        }

        // Webkit
        if (orgEvent.wheelDeltaY !== undefined) {
            deltaY = orgEvent.wheelDeltaY;
        }
        if (orgEvent.wheelDeltaX !== undefined) {
            deltaX = orgEvent.wheelDeltaX * -1;
        }

        // Look for lowest delta to normalize the delta values
        absDelta = Math.abs(delta);
        if (!lowestDelta || absDelta < lowestDelta) {
            lowestDelta = absDelta;
        }
        absDeltaXY = Math.max(Math.abs(deltaY), Math.abs(deltaX));
        if (!lowestDeltaXY || absDeltaXY < lowestDeltaXY) {
            lowestDeltaXY = absDeltaXY;
        }

        // Get a whole value for the deltas
        fn = delta > 0 ? 'floor' : 'ceil';
        delta = Math[fn](delta / lowestDelta);
        deltaX = Math[fn](deltaX / lowestDeltaXY);
        deltaY = Math[fn](deltaY / lowestDeltaXY);

        // Add event and delta to the front of the arguments
        args.unshift(event, delta, deltaX, deltaY);

        return ($.event.dispatch || $.event.handle).apply(this, args);
    }
})(jQuery));
((function ($) {
    var defaultSettings = {
        wheelSpeed: 10,
        suppressScrollX:false,
        wheelPropagation: false
    };
    $.fn.uiScrollbar = function (suppliedSettings, option) {
        return this.each(function () {
            // Use the default settings
            var settings = $.extend(true, {}, defaultSettings);
            if (typeof suppliedSettings === "object") {
                // But over-ride any supplied
                $.extend(true, settings, suppliedSettings);
            } else {
                // If no settings were supplied, then the first param must be the option
                option = suppliedSettings;
            }
            if (option === 'update') {
                if ($(this).data('ui-scrollbar-update')) {
                    $(this).data('ui-scrollbar-update')();
                }
                return $(this);
            } else if (option === 'destroy') {
                if ($(this).data('ui-scrollbar-destroy')) {
                    $(this).data('ui-scrollbar-destroy')();
                }
                return $(this);
            }
            if ($(this).data('ui-scrollbar')) {
                // if there's already ui-scrollbar
                return $(this).data('ui-scrollbar');
            }
            var $this = $(this).addClass('ui-container'),
                onScrollBottom,
                $contentFChild = $this.children().eq(0),
                $content = $(this).children(),
                $scrollbarX = $("<div class='ui-scrollbar-x'></div>").appendTo($this),
                $scrollbarY = $("<div class='ui-scrollbar-y'></div>").appendTo($this),
                containerWidth,
                containerHeight,
                contentWidth,
                contentHeight,
                scrollbarXWidth,
                scrollbarXLeft,
                scrollbarXBottom = parseInt($scrollbarX.css('bottom'), 10),
                scrollbarYHeight,
                scrollbarYTop,
                scrollbarYRight = parseInt($scrollbarY.css('right'), 10);
            var updateContentScrollTop = function () {
                var scrollTop = parseInt(scrollbarYTop * contentHeight / containerHeight, 10);
                $this.scrollTop(scrollTop);
                $scrollbarX.css({bottom: scrollbarXBottom - scrollTop});
            };
            var updateContentScrollLeft = function () {
                var scrollLeft = parseInt(scrollbarXLeft * contentWidth / containerWidth, 10);
                $this.scrollLeft(scrollLeft);
                $scrollbarY.css({right: scrollbarYRight - scrollLeft});
            };
            var updateBarSizeAndPosition = function () {
                containerWidth = $this.width();
                containerHeight = $this.height();
                contentWidth = $content.outerWidth(false);
                contentHeight = $content.outerHeight(false);
                if (!settings.suppressScrollX&&containerWidth < contentWidth) {
                    scrollbarXWidth = parseInt(containerWidth * containerWidth / contentWidth, 10);
                    scrollbarXLeft = parseInt($this.scrollLeft() * containerWidth / contentWidth, 10);
                } else {
                    scrollbarXWidth = 0;
                    scrollbarXLeft = 0;
                    $this.scrollLeft(0);
                }
                if (containerHeight < contentHeight) {
                    scrollbarYHeight = parseInt(containerHeight * containerHeight / contentHeight, 10);
                    scrollbarYTop = parseInt($this.scrollTop() * containerHeight / contentHeight, 10);
                } else {
                    scrollbarYHeight = 0;
                    scrollbarYTop = 0;
                    $this.scrollTop(0);
                }
                if (scrollbarYTop >= containerHeight - scrollbarYHeight) {
                    scrollbarYTop = containerHeight - scrollbarYHeight;
                }
                if (scrollbarXLeft >= containerWidth - scrollbarXWidth) {
                    scrollbarXLeft = containerWidth - scrollbarXWidth;
                }
                //滑到底部时的回调
                if (onScrollBottom === scrollbarYHeight - scrollbarYTop && scrollbarYTop !== 0) {

                    if (settings.onScrollBottom) {
                        settings.onScrollBottom({self: $this});
                    }
                }
                onScrollBottom = scrollbarYHeight - scrollbarYTop;
                $scrollbarX.css({left: scrollbarXLeft + $this.scrollLeft(), bottom: scrollbarXBottom - $this.scrollTop(), width: scrollbarXWidth});
                $scrollbarY.css({top: scrollbarYTop + $this.scrollTop(), right: scrollbarYRight - $this.scrollLeft(), height: scrollbarYHeight});
            };
            var moveBarX = function (currentLeft, deltaX) {
                var newLeft = currentLeft + deltaX,
                    maxLeft = containerWidth - scrollbarXWidth;
                if (newLeft < 0) {
                    scrollbarXLeft = 0;
                }
                else if (newLeft > maxLeft) {
                    scrollbarXLeft = maxLeft;
                }
                else {
                    scrollbarXLeft = newLeft;
                }
                $scrollbarX.css({left: scrollbarXLeft + $this.scrollLeft()});
            };
            var moveBarY = function (currentTop, deltaY) {
                var newTop = currentTop + deltaY,
                    maxTop = containerHeight - scrollbarYHeight;
                if (newTop < 0) {
                    scrollbarYTop = 0;
                } else if (newTop > maxTop) {
                    scrollbarYTop = maxTop;
                } else {
                    scrollbarYTop = newTop;
                }
                $scrollbarY.css({top: scrollbarYTop + $this.scrollTop()});
            };
            var bindMouseScrollXHandler = function () {
                var currentLeft,
                    currentPageX;
                $scrollbarX.bind('mousedown.ui-scroll', function (e) {
                    currentPageX = e.pageX;
                    currentLeft = $scrollbarX.position().left;
                    $scrollbarX.addClass('in-scrolling');
                    e.stopPropagation();
                    e.preventDefault();
                });
                $(document).bind('mousemove.ui-scroll', function (e) {
                    if ($scrollbarX.hasClass('in-scrolling')) {
                        updateContentScrollLeft();
                        moveBarX(currentLeft, e.pageX - currentPageX);
                        e.stopPropagation();
                        e.preventDefault();
                    }
                });
                $(document).bind('mouseup.ui-scroll', function (e) {
                    if ($scrollbarX.hasClass('in-scrolling')) {
                        $scrollbarX.removeClass('in-scrolling');
                    }
                });
            };
            var bindMouseScrollYHandler = function () {
                var currentTop,
                    currentPageY;
                $scrollbarY.bind('mousedown.ui-scroll', function (e) {
                    currentPageY = e.pageY;
                    currentTop = $scrollbarY.position().top;
                    $scrollbarY.addClass('in-scrolling');
                    e.stopPropagation();
                    e.preventDefault();
                });
                $(document).bind('mousemove.ui-scroll', function (e) {
                    if ($scrollbarY.hasClass('in-scrolling')) {
                        updateContentScrollTop();
                        moveBarY(currentTop, e.pageY - currentPageY);
                        e.stopPropagation();
                        e.preventDefault();
                        if (settings.onScroll) {
                            settings.onScroll($this);
                        }
                    }
                });
                $(document).bind('mouseup.ui-scroll', function (e) {
                    if ($scrollbarY.hasClass('in-scrolling')) {
                        $scrollbarY.removeClass('in-scrolling');
                    }
                });
            };
            // bind handlers
            var bindMouseWheelHandler = function () {
                var shouldPreventDefault = function (deltaX, deltaY) {
                    var scrollTop = $this.scrollTop();
                    if (scrollTop === 0 && deltaY > 0 && deltaX === 0) {
                        return !settings.wheelPropagation;
                    } else if (scrollTop >= contentHeight - containerHeight && deltaY < 0 && deltaX === 0) {
                        return !settings.wheelPropagation;
                    }
                    var scrollLeft = $this.scrollLeft();
                    if (scrollLeft === 0 && deltaX < 0 && deltaY === 0) {
                        return !settings.wheelPropagation;
                    } else if (scrollLeft >= contentWidth - containerWidth && deltaX > 0 && deltaY === 0) {
                        return !settings.wheelPropagation;
                    }
                    return true;
                };
                var sTop, fHeight;
                $this.bind('mousewheel.ui-scroll', function (e, delta, deltaX, deltaY) {
                    sTop = $this.scrollTop() - (deltaY * settings.wheelSpeed);
                    fHeight = $contentFChild.height() - $this.height();
                    if (sTop > fHeight)sTop = fHeight;
                    $this.scrollTop(sTop);
                    $this.scrollLeft($this.scrollLeft() + (deltaX * settings.wheelSpeed));
                    // update bar position
                    updateBarSizeAndPosition();
                    if (shouldPreventDefault(deltaX, deltaY)) {
                        e.preventDefault();
                    }
                    if (settings.onScroll) {
                        settings.onScroll($this);
                    }
                });
            };

            var destroy = function () {
                $scrollbarX.remove();
                $scrollbarY.remove();
                $this.unbind('.ui-scroll');
                $(window).unbind('.ui-scroll');
                $this.data('ui-scrollbar', null);
                $this.data('ui-scrollbar-update', null);
                $this.data('ui-scrollbar-destroy', null);
            };
            var initialize = function () {
                updateBarSizeAndPosition();
                bindMouseScrollXHandler();
                bindMouseScrollYHandler();

                if ($this.mousewheel) {
                    bindMouseWheelHandler();
                }
                $this.data('ui-scrollbar', $this);
                $this.data('ui-scrollbar-update', updateBarSizeAndPosition);
                $this.data('ui-scrollbar-destroy', destroy);
            };
            initialize();
            return $this;
        });
    };
})(jQuery));
angular.module('ui.scrollbar',[])
    .directive('uiScrollbar', ['$parse', '$timeout', function ($parse, $timeout) {
        var _options = [
            'wheelSpeed', 'wheelPropagation', 'minScrollbarLength', 'useBothWheelAxes',
            'useKeyboard', 'suppressScrollX', 'suppressScrollY', 'scrollXMarginOffset',
            'scrollYMarginOffset', 'includePadding'
        ];
        return {
            restrict: 'EA',
            transclude: true,
            template: '<div><div class="ui-scrollbar-inner" ng-transclude></div></div>',
            replace: true,
            link: function (scope, elem, attr) {
                var options = {};
                for (var i = 0, l = _options.length; i < l; i++) {
                    var opt = _options[i];
                    if (attr[opt]) {
                        options[opt] = $parse(attr[opt])();
                    }
                }
                $timeout(function () {
                    if (scope.onScroll) {
                        options.onScroll = scope.onScroll;
                    }
                    if (scope.onScrollBottom) {
                        options.onScrollBottom = scope.onScrollBottom;
                    }
                    elem.uiScrollbar(options);
                });
                if (attr.refreshOnChange) {
                    scope.$watchCollection(attr.refreshOnChange, function () {
                        scope.$evalAsync(function () {
                            elem.uiScrollbar('update');
                        });
                    });
                }
                elem.bind('$destroy', function () {
                    elem.uiScrollbar('destroy');
                });
            }
        };
    }]);