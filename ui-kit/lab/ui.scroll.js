angular.module('ui.scroll', [])
    .directive('uiScrollTo', ['uiAnchorSmoothScroll', function(uiAnchorSmoothScroll){
        return {
            restrict : "A",
            compile : function(){
                return function(scope, element, attr) {
                    element.bind("click", function(event){
                        uiAnchorSmoothScroll.scrollTo(attr.uiScrollTo);
                    });
                };
            }
        };
    }])
    .service('uiAnchorSmoothScroll', function(){
        this.scrollTo = function(eID) {
            // This scrolling function
            // is from http://www.itnewb.com/tutorial/Creating-the-Smooth-Scroll-Effect-with-JavaScript
            var startY = currentYPosition();
            var stopY = elmYPosition(eID);
            var distance = stopY > startY ? stopY - startY : startY - stopY;
            if (distance < 100) {
                scrollTo(0, stopY); return;
            }
            var speed = Math.round(distance / 100);
            if (speed >= 20) speed = 20;
            var step = Math.round(distance / 25);
            var leapY = stopY > startY ? startY + step : startY - step;
            var timer = 0;
            if (stopY > startY) {
                for ( var i=startY; i<stopY; i+=step ) {
                    setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
                    leapY += step; if (leapY > stopY) leapY = stopY; timer++;
                } return;
            }
            for ( var i=startY; i>stopY; i-=step ) {
                setTimeout("window.scrollTo(0, "+leapY+")", timer * speed);
                leapY -= step; if (leapY < stopY) leapY = stopY; timer++;
            }
            function currentYPosition() {
                // Firefox, Chrome, Opera, Safari
                if (self.pageYOffset) return self.pageYOffset;
                // Internet Explorer 6 - standards mode
                if (document.documentElement && document.documentElement.scrollTop)
                    return document.documentElement.scrollTop;
                // Internet Explorer 6, 7 and 8
                if (document.body.scrollTop) return document.body.scrollTop;
                return 0;
            }
            function elmYPosition(eID) {
                var elm = document.getElementById(eID);
                var y = elm.offsetTop;
                var node = elm;
                while (node.offsetParent && node.offsetParent != document.body) {
                    node = node.offsetParent;
                    y += node.offsetTop;
                } return y;
            }
        };
    })
    .directive('uiScrollfix', ['$window', function ($window) {
        return {
            require: '^?uiScrollfixTarget',
            link: function (scope, elm, attrs, uiScrollfixTarget) {
                var top = elm[0].offsetTop,
                    $target = uiScrollfixTarget && uiScrollfixTarget.$element || angular.element($window);
                var className=attrs.name||'ui-scrollfix';

                if (!attrs.uiScrollfix) {
                    attrs.uiScrollfix = top;
                } else if (typeof(attrs.uiScrollfix) === 'string') {
                    // charAt is generally faster than indexOf: http://jsperf.com/indexof-vs-charat
                    if (attrs.uiScrollfix.charAt(0) === '-') {
                        attrs.uiScrollfix = top - parseFloat(attrs.uiScrollfix.substr(1));
                    } else if (attrs.uiScrollfix.charAt(0) === '+') {
                        attrs.uiScrollfix = top + parseFloat(attrs.uiScrollfix.substr(1));
                    }
                }
                function onScroll() {
                    // if pageYOffset is defined use it, otherwise use other crap for IE
                    var offset;
                    if (angular.isDefined($window.pageYOffset)) {
                        offset = $window.pageYOffset;
                    } else {
                        var iebody = (document.compatMode && document.compatMode !== 'BackCompat') ? document.documentElement : document.body;
                        offset = iebody.scrollTop;
                    }
                    if (!elm.hasClass(className) && offset > attrs.uiScrollfix) {
                        elm.addClass(className);
                    } else if (elm.hasClass(className) && offset < attrs.uiScrollfix) {
                        elm.removeClass(className);
                    }
                }
                $target.on('scroll', onScroll);
                // Unbind scroll event handler when directive is removed
                scope.$on('$destroy', function() {
                    $target.off('scroll', onScroll);
                });
            }
        };
    }])
    .directive('uiScrollfixTarget', [function () {
        return {
            controller: ['$element', function($element) {
                this.$element = $element;
            }]
        };
    }])