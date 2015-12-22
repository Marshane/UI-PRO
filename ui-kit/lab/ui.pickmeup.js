angular.module("ui.pickmeup")
    .directive("ui.pickmeup", ["$parse", "Common", function($parse, Common) {
        var link = function(scope, element, attrs) {
                var fn = $parse(attrs.uiPickmeup)
                    , opts = scope.$eval(attrs.pickmeupOptions) || {}
                    , class_name = "pickmeup-" + (new Date).getTime()
                    , date = scope.$eval(attrs.ngModel);
                opts = angular.extend({
                    class_name: class_name,
                    format: "Y-m-d",
                    date: date,
                    change: function(date) {
                        Common.safeApply.call(scope, function() {
                            fn(scope, {
                                $date: date
                            })
                        })
                    }
                }, {}, opts),
                    element.pickmeup(opts),
                    scope.$watch(function() {
                        return scope.$eval(attrs.ngModel)
                    }, function(date) {
                        angular.isDefined(date) && element.pickmeup("set_date", date)
                    });
                var pickmeup = $(element).data("pickmeup");
                pickmeup && scope.$on("$destroy", function() {
                    pickmeup.remove()
                })
            }
            ;
        return {
            link: link
        }
    }]);