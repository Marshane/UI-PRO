angular.module('ui.placeholder',[])
    .directive("ngPlaceholder", function($log, $timeout) {
        var txt;
        return {
            restrict: "A",
            scope:true,
            link: function(scope, elem, attrs) {
                scope.txt=attrs.ngPlaceholder;
                elem.on("focus", function() {
                    if(elem.val() === scope.txt) {
                        elem.val("");
                    }
                    scope.$apply()
                });
                elem.on("blur", function() {
                    if(elem.val() === "") {
                        elem.val(scope.txt);
                    }
                    scope.$apply()
                });
                $timeout(function() {
                    elem.val(scope.txt)
                    scope.$apply();
                })
            }
        }
    });