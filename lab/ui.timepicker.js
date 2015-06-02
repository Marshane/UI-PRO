angular.module('ui.timepicker', [])
    .constant('timepickerConfig', {
        hourStep: 1,
        minuteStep: 1,
        secondStep: 1,
        showMeridian: true,
        meridians: null,
        readonlyInput: false,
        mousewheel: true
    })
    .controller('TimepickerController', ['$scope', '$attrs', '$parse', '$log', '$locale', 'timepickerConfig',
        function ($scope, $attrs, $parse, $log, $locale, timepickerConfig) {
            var selected = new Date(),
                ngModelCtrl = { $setViewValue: angular.noop }, // nullModelCtrl
                meridians = angular.isDefined($attrs.meridians) ? $scope.$parent.$eval($attrs.meridians) : timepickerConfig.meridians || $locale.DATETIME_FORMATS.AMPMS;

            this.init = function (ngModelCtrl_, inputs) {
                ngModelCtrl = ngModelCtrl_;
                ngModelCtrl.$render = this.render;

                var hoursInputEl = inputs.eq(0),
                    minutesInputEl = inputs.eq(1),
                    secondsInputEl = inputs.eq(2);

                var mousewheel = angular.isDefined($attrs.mousewheel) ? $scope.$parent.$eval($attrs.mousewheel) : timepickerConfig.mousewheel;
                if (mousewheel) {
                    this.setupMousewheelEvents(hoursInputEl, minutesInputEl, secondsInputEl);
                }

                $scope.readonlyInput = angular.isDefined($attrs.readonlyInput) ? $scope.$parent.$eval($attrs.readonlyInput) : timepickerConfig.readonlyInput;
                this.setupInputEvents(hoursInputEl, minutesInputEl, secondsInputEl);
            };

            var hourStep = timepickerConfig.hourStep;
            if ($attrs.hourStep) {
                $scope.$parent.$watch($parse($attrs.hourStep), function (value) {
                    hourStep = parseInt(value, 10);
                });
            }

            var minuteStep = timepickerConfig.minuteStep;
            if ($attrs.minuteStep) {
                $scope.$parent.$watch($parse($attrs.minuteStep), function (value) {
                    minuteStep = parseInt(value, 10);
                });
            }

            var secondStep = timepickerConfig.secondStep;
            if ($attrs.secondStep) {
                $scope.$parent.$watch($parse($attrs.secondStep), function (value) {
                    secondStep = parseInt(value, 10);
                });
            }

            // 12H / 24H mode
            $scope.showMeridian = timepickerConfig.showMeridian;
            if ($attrs.showMeridian) {
                $scope.$parent.$watch($parse($attrs.showMeridian), function (value) {
                    $scope.showMeridian = !!value;

                    if (ngModelCtrl.$error.time) {
                        // Evaluate from template
                        var hours = getHoursFromTemplate(), minutes = getMinutesFromTemplate(), seconds = getSecondsFromTemplate();
                        if (angular.isDefined(hours) && angular.isDefined(minutes) && angular.isDefined(seconds)) {
                            selected.setHours(hours);
                            refresh();
                        }
                    } else {
                        updateTemplate();
                    }
                });
            }

            // Get $scope.hours in 24H mode if valid
            function getHoursFromTemplate() {
                var hours = parseInt($scope.hours, 10);
                var valid = ( $scope.showMeridian ) ? (hours > 0 && hours < 13) : (hours >= 0 && hours < 24);
                if (!valid) {
                    return undefined;
                }

                if ($scope.showMeridian) {
                    if (hours === 12) {
                        hours = 0;
                    }
                    if ($scope.meridian === meridians[1]) {
                        hours = hours + 12;
                    }
                }
                return hours;
            }

            function getMinutesFromTemplate() {
                var minutes = parseInt($scope.minutes, 10);
                return ( minutes >= 0 && minutes < 60 ) ? minutes : undefined;
            }

            function getSecondsFromTemplate() {
                var seconds = parseInt($scope.seconds, 10);
                return ( seconds >= 0 && seconds < 60 ) ? seconds : undefined;
            }

            function pad(value) {
                return ( angular.isDefined(value) && value.toString().length < 2 ) ? '0' + value : value;
            }

            // Respond on mousewheel spin
            this.setupMousewheelEvents = function (hoursInputEl, minutesInputEl, secondsInputEl) {
                var isScrollingUp = function (e) {
                    if (e.originalEvent) {
                        e = e.originalEvent;
                    }
                    //pick correct delta variable depending on event
                    var delta = (e.wheelDelta) ? e.wheelDelta : -e.deltaY;
                    return (e.detail || delta > 0);
                };

                hoursInputEl.bind('mousewheel wheel', function (e) {
                    $scope.$apply((isScrollingUp(e)) ? $scope.incrementHours() : $scope.decrementHours());
                    e.preventDefault();
                });

                minutesInputEl.bind('mousewheel wheel', function (e) {
                    $scope.$apply((isScrollingUp(e)) ? $scope.incrementMinutes() : $scope.decrementMinutes());
                    e.preventDefault();
                });

                secondsInputEl.bind('mousewheel wheel', function (e) {
                    $scope.$apply((isScrollingUp(e)) ? $scope.incrementSeconds() : $scope.decrementSeconds());
                    e.preventDefault();
                });

            };

            this.setupInputEvents = function (hoursInputEl, minutesInputEl, secondsInputEl) {
                if ($scope.readonlyInput) {
                    $scope.updateHours = angular.noop;
                    $scope.updateMinutes = angular.noop;
                    $scope.updateSeconds = angular.noop;
                    return;
                }

                var invalidate = function (invalidHours, invalidMinutes, invalidSeconds) {
                    ngModelCtrl.$setViewValue(null);
                    ngModelCtrl.$setValidity('time', false);
                    if (angular.isDefined(invalidHours)) {
                        $scope.invalidHours = invalidHours;
                    }
                    if (angular.isDefined(invalidMinutes)) {
                        $scope.invalidMinutes = invalidMinutes;
                    }
                    if (angular.isDefined(invalidSeconds)) {
                        $scope.invalidSeconds = invalidSeconds;
                    }
                };

                $scope.updateHours = function () {
                    var hours = getHoursFromTemplate();

                    if (angular.isDefined(hours)) {
                        selected.setHours(hours);
                        refresh('h');
                    } else {
                        invalidate(true);
                    }
                };

                hoursInputEl.bind('blur', function (e) {
                    if (!$scope.invalidHours && $scope.hours < 10) {
                        $scope.$apply(function () {
                            $scope.hours = pad($scope.hours);
                        });
                    }
                });

                $scope.updateMinutes = function () {
                    var minutes = getMinutesFromTemplate();

                    if (angular.isDefined(minutes)) {
                        selected.setMinutes(minutes);
                        refresh('m');
                    } else {
                        invalidate(undefined, true);
                    }
                };

                $scope.updateSeconds = function () {
                    var seconds = getSecondsFromTemplate();

                    if (angular.isDefined(seconds)) {
                        selected.setSeconds(seconds);
                        refresh('s');
                    } else {
                        invalidate(undefined, undefined, true);
                    }
                };

                minutesInputEl.bind('blur', function (e) {
                    if (!$scope.invalidMinutes && $scope.minutes < 10) {
                        $scope.$apply(function () {
                            $scope.minutes = pad($scope.minutes);
                        });
                    }
                });

                secondsInputEl.bind('blur', function (e) {
                    if (!$scope.invalidSeconds && $scope.seconds < 10) {
                        $scope.$apply(function () {
                            $scope.seconds = pad($scope.seconds);
                        });
                    }
                });

            };

            this.render = function () {
                var date = ngModelCtrl.$modelValue ? new Date(ngModelCtrl.$modelValue) : null;

                if (isNaN(date)) {
                    ngModelCtrl.$setValidity('time', false);
                    $log.error('Timepicker directive: "ng-model" value must be a Date object, a number of milliseconds since 01.01.1970 or a string representing an RFC2822 or ISO 8601 date.');
                } else {
                    if (date) {
                        selected = date;
                    }
                    makeValid();
                    updateTemplate();
                }
            };

            // Call internally when we know that model is valid.
            function refresh(keyboardChange) {
                makeValid();
                ngModelCtrl.$setViewValue(new Date(selected));
                updateTemplate(keyboardChange);
            }

            function makeValid() {
                ngModelCtrl.$setValidity('time', true);
                $scope.invalidHours = false;
                $scope.invalidMinutes = false;
                $scope.invalidSeconds = false;
            }

            function updateTemplate(keyboardChange) {
                var hours = selected.getHours(), minutes = selected.getMinutes(), seconds = selected.getSeconds();

                if ($scope.showMeridian) {
                    hours = ( hours === 0 || hours === 12 ) ? 12 : hours % 12; // Convert 24 to 12 hour system
                }

                $scope.hours = keyboardChange === 'h' ? hours : pad(hours);
                $scope.minutes = keyboardChange === 'm' ? minutes : pad(minutes);
                $scope.seconds = keyboardChange === 's' ? seconds : pad(seconds);
                $scope.meridian = selected.getHours() < 12 ? meridians[0] : meridians[1];
            }

            function addMinutes(minutes) {
                var dt = new Date(selected.getTime() + minutes * 60000);
                selected.setHours(dt.getHours(), dt.getMinutes());
                refresh();
            }

            function addSeconds(seconds) {
                var dt = new Date(selected.getTime() + seconds * 1000);
                selected.setHours(dt.getHours(), dt.getMinutes(), dt.getSeconds());
                refresh();
            }

            $scope.incrementHours = function () {
                addMinutes(hourStep * 60);
            };
            $scope.decrementHours = function () {
                addMinutes(-hourStep * 60);
            };
            $scope.incrementMinutes = function () {
                addMinutes(minuteStep);
            };
            $scope.decrementMinutes = function () {
                addMinutes(-minuteStep);
            };
            $scope.incrementSeconds = function () {
                addSeconds(secondStep);
            };
            $scope.decrementSeconds = function () {
                addSeconds(-secondStep);
            };

            $scope.toggleMeridian = function () {
                addMinutes(12 * 60 * (( selected.getHours() < 12 ) ? 1 : -1));
            };
        }])
    .directive('timepicker', function () {
        return {
            restrict: 'EA',
            require: ['timepicker', '?^ngModel'],
            controller: 'TimepickerController',
            replace: true,
            scope: {},
            templateUrl: 'template/timepicker/timepicker.html',
            link: function (scope, element, attrs, ctrls) {
                var timepickerCtrl = ctrls[0], ngModelCtrl = ctrls[1];

                if (ngModelCtrl) {
                    timepickerCtrl.init(ngModelCtrl, element.find('input'));
                }
                if (attrs.inDatepicker) {
                    scope.inDatepicker = attrs.inDatepicker;
                    scope.HH = scope.$parent.HH;
                    scope.mm = scope.$parent.mm;
                    scope.ss = scope.$parent.ss;
                }
            }
        };
    })
    .run(["$templateCache", function ($templateCache) {
        $templateCache.put("template/timepicker/timepicker.html",
                "<table>\n" +
                " <tbody>\n" +
                "   <tr>\n" +
                "     <td ng-hide=\"inDatepicker&&!HH\" style=\"width:65px;\" class=\"form-group\" ng-class=\"{'has-error': invalidHours}\">\n" +
                "       <input type=\"text\" ng-model=\"hours\" ng-change=\"updateHours()\" class=\"x-form-text x-form-field form-control text-center\" ng-mousewheel=\"incrementHours()\" ng-readonly=\"readonlyInput\" maxlength=\"2\" max=\"23\" min=\"00\">\n" +
                "     </td>\n" +
                "     <td ng-hide=\"inDatepicker&&!mm\">:</td>\n" +
                "     <td ng-hide=\"inDatepicker&&!mm\" style=\"width:65px;\" class=\"form-group\" ng-class=\"{'has-error': invalidMinutes}\">\n" +
                "       <input type=\"text\" ng-model=\"minutes\" ng-change=\"updateMinutes()\" class=\"x-form-text x-form-field form-control text-center\" ng-readonly=\"readonlyInput\" maxlength=\"2\" max=\"59\" min=\"00\">\n" +
                "     </td>\n" +
                "     <td ng-hide=\"inDatepicker&&!ss\">:</td>\n" +
                "     <td ng-hide=\"inDatepicker&&!ss\" style=\"width:65px;\" class=\"form-group\" ng-class=\"{'has-error': invalidSeconds}\">\n" +
                "       <input type=\"text\" ng-model=\"seconds\" ng-change=\"updateSeconds()\" class=\"x-form-text x-form-field form-control text-center\" ng-readonly=\"readonlyInput\" maxlength=\"2\" max=\"59\" min=\"00\">\n" +
                "     </td>\n" +"   </tr>\n" +
                " </tbody>\n" +
                "</table>\n" +
                "");
    }]);