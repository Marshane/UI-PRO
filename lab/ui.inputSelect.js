angular.module('ui.inputSelect', [])
	.directive('inputSelect', ['$templateCache', '$compile', function ($templateCache, $compile) {
        return{
            restrict: 'EA',
            require: '?^ngModel',
            replace: true,
            scope: {
                popData: '=',
                ngModel: '='
            },
            compile: function () {
                return{
                    pre: function (scope, elem) {
                        if (elem.children().length === 0) {
                            elem.append($compile($templateCache.get('templates/dropdown/input-select.html'))(scope));
                        }
                    },
                    post: function (scope, elem, attr) {
                        scope.key = attr.key;
                        scope.isopen = +attr.isOpen;
                        scope.value = attr.value;
                        scope.popStyle = attr.popStyle;
                        scope.width = attr.width;
                        scope.ngModel=scope.ngModel||'';
                        scope.gap = function () {
                            if (attr.gap) return 'width:' + attr.gap
                        }();
                        var filter = function (data) {
                            var arr = data.split(',');
                            var obj = [], wh;
                            angular.forEach(arr, function (item) {
                                wh = _.filter(scope.popData, function (_item) {
                                    return _item[scope.value] == item
                                });
                                if (wh.length > 0) {
                                    obj = obj.concat(wh);
                                }
                            });
                            return obj;
                        };
                        var onTextFilter = function () {
                            var a = {}, b, c;
                            a[scope.key] = scope.text;
                            b = _.where(scope.popData, a);
                            if (b.length > 0) {
                                c = scope.ngModel.length ? scope.ngModel.split(',') : [];
                                angular.forEach(b, function (item) {
                                    if (_.indexOf(c, item[scope.value]) < 0) {
                                        c.push(item[scope.value]);
                                    }
                                });
                                scope.ngModel = c.join(',');
                                scope.defaultChecked = scope.ngModel;
                                scope.text = '';
                            }
                        },
                        html,
                        stopPro = function (evt) {
                            evt.stopPropagation();
                        };
                        scope.text = '';
                        if (scope.isopen) {
                            html = $('html');
                            html.bind('click', stopPro);
                        }
                        scope.ngModelList = function () {
                            if (scope.ngModel) {
                                return filter(scope.ngModel);
                            }
                            return [];
                        }();
                        scope.contain = function (a) {
                            return _.where(scope.ngModelList, a).length > 0
                        };

                        scope.onTextKeyUp = function (evt) {
                            if (evt.keyCode === 13) {
                                onTextFilter();
                            }
                        };
                        scope.onDel = function (a) {
                            scope.ngModelList = _.filter(scope.ngModelList, function (item) {
                                return item[scope.value] != a;
                            });
                            scope.ngModel = _.filter(scope.ngModel.split(','), function (item) {
                                return item != a
                            }).join(',');
                            scope.defaultChecked = scope.ngModel;
                        };
                        scope.onSelectMenu = function (evt) {
                            evt.stopPropagation();
                        };
                        scope.onInputSelected = function (evt) {
                            evt.stopPropagation();
                            scope.isopen = 1;
                            elem.find('input').focus();
                        };
                        var modelList = function (a) {
                            if (a) {
                                scope.ngModelList = filter(a);
                            } else if (a == '' && !a.length) {
                                scope.ngModelList = [];
                            }
                        };
                        var dW0=scope.$watch('ngModel', modelList);
                        scope._ngModel = scope.ngModel;
                        //解决搜索后点击情况做处理
                        var dW1=scope.$watch('_ngModel', function (a) {
                            console.log(a);
                            if (scope.text) {
                                scope.ngModel = scope.ngModel.split(',').concat(a.split(',')).join(',');
                            } else {
                                scope.ngModel = scope._ngModel;
                            }
                            modelList(scope.ngModel);
                            scope.text = '';
                        });
                        scope.$on("$destroy",function() {
                            dW0();
                            dW1();
                            if (html) {
                                html.unbind('click');
                            }
                        });
                    }
                }
            }
        }
    }])
    .run(["$templateCache", function ($templateCache) {
        $templateCache.put("templates/dropdown/input-select.html",
            "<div class=\"am-input-select btn-group\" dropdown is-open=\"isopen\" ng-style=\"{'width':width}\" ng-class=\"{'open':isopen}\">\
            <div class=\"am-input-selected\" ng-click=\"onInputSelected($event)\" ng-style=\"{'width':width}\">\
              <div ng-repeat=\"item in ngModelList\"><span class=\"close\" ng-click=\"onDel(item[value])\">&times;</span>{{item[key]}}</div>\
              <input class=\"am-input\" type=\"text\" ng-model=\"text\" ng-keyup=\"onTextKeyUp($event)\" />\
            </div>\
              <ul class=\"dropdown-menu am-select-menu\" ng-click=\"onSelectMenu($event)\" style=\"{{popStyle}}\"\
               ng-click=\"inputClick2($event)\"  ng-icheck multi=\"1\" filter-name=\"_ngModel\" default-checked=\"defaultChecked\">\
                  <li ng-repeat=\"item in popData | filter:text  track by $index\" style=\"{{gap}}\"><span class=\"rs-square rs-square-1\" \
                  ng-class=\"{'glyphicon-ok':contain(item)}\" value=\"{{item[value]}}\"></span>\
                  <span class=\"rs-text\">{{item[key]}}</span></li><span class=\"close close-input-select\" ng-click=\"isopen=!isopen\">×</span>\
              </ul>\
          </div>");
    }]);


