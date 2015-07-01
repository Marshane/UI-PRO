angular.module('ui.bindHtml', [])
    .directive('bindHtmlUnsafe', ['$compile', function ($compile) {
        return function (scope, element, attr) {
            element.addClass('ng-binding').data('$binding', attr.bindHtmlUnsafe);
            scope.$watch(attr.bindHtmlUnsafe, function bindHtmlUnsafeWatchAction(value) {
                element.html(value || '');
                $compile(element.contents())(scope);
            });
        };
    }]);