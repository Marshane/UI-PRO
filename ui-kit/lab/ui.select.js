angular.module('ui.select',[])
    .directive('uiSelect', ['$filter','$window','$timeout','$translate','$compile','$templateCache', function ($filter,$window, $timeout,$translate,$compile,$templateCache) {
        return{
            restrict:'A',
            require:'^ngModel',
            replace: true,
            templateUrl:function(elem,attr){
                return +attr.color?'select-button-color.html':'select-button.html'
            },
            scope:{
                options:'=',
                ngModel:'=',
                title: '@',
                disabled: '=',
                onChange: '&?',
                onBeforeChange:'&?',
                onClose: '&?'
            },
            compile:function(){
                return{
                    pre:function(scope,elem,attr){
                        if (!scope.menu) {
                            scope.menu=$compile($templateCache.get(attr.color?'select-menu-color.html':'select-menu.html'))(scope);
                            $('body').append(scope.menu);
                        }
                    },
                    post: function (scope, element, attrs,ngModel) {
                        var _filter_;
                        var ngModelTemp;
                        scope._obj = {};
                        scope.key = attrs.key;
                        scope.filter = _filter_ = attrs.filter;
                        scope.asValue = attrs.asValue;
                        scope.width = attrs.width;
                        scope.max = +attrs.max || 10;
                        scope.multi = +attrs.multi || 0;
                        scope.lineHeight = +attrs.lineHeight || 32;
                        scope.isDropdown = +attrs.isDropdown || 0;
                        scope.position = function () {
                            var pos = attrs.position, sp;
                            if (pos) {
                                sp = pos.split('|');
                                if (sp.length > 1) {
                                    if (sp[1] === 'right')
                                        return sp;
                                    else [sp[0]]
                                }
                                return pos ? [pos] : ''
                            }
                        }();
                        scope.optionsFilter = function () {
                            var obj = {};
                            if (!_filter_) return scope.options;
                            obj[scope.key] = scope._filterText_;
                            return $filter('filter')(scope.options, obj);
                        };
                        scope['default'] = function () {
                            var obj = {};
                            if (attrs['default']) {
                                if (scope.asValue) {
                                    return attrs['default']
                                }
                                return obj[scope.key] = attrs['default'];
                            }
                            return ''
                        }();
                        scope.addDefault = function () {
                            var obj = {};
                            obj[scope.key] = scope['default'];
                            obj[scope.asValue || 'value'] =attrs.all?attrs.all:'';
                            return obj
                        };
                        if (!scope.key)return;
                        scope.isopen = +attrs.isOpened || false;

                        var setValue = function (obj) {
                            if (scope.multi) {
                                scope.ngModel=scope.ngModel||[];
                                if (_.where(scope.ngModel, obj).length) {
                                    scope.ngModel = _.filter(scope.ngModel, function (it) {
                                        return it[scope.key] != obj[scope.key]
                                    });
                                } else {
                                    scope.ngModel.push(obj);
                                }
                                scope._obj[attrs.ngModel] = scope.ngModel;
                            } else {
                                if (scope.asValue) {
                                    scope._ngModel = [obj];
                                    scope.ngModel = obj[scope.asValue];
                                } else {
                                    scope.ngModel = obj;
                                }
                                if (scope.isDropdown) {
                                    scope._onChange(_.object([
                                        [attrs.ngModel, scope.asValue ? obj[scope.asValue] : obj]
                                    ]));
                                } else {
                                    scope._obj[attrs.ngModel] = obj;
                                }
                                scope.isopen = 0;
                            }
                        };
                        scope.itemClick = function (evt, obj) {
                            if (evt.target.tagName !== 'INPUT')
                                evt.preventDefault();
                            evt.stopPropagation();
                            ngModelTemp = scope.ngModel;
                            if (attrs.onBeforeChange) {
                                scope.ngModel = obj;
                                $timeout(function () {
                                    if (!scope._onBeforeChange()) {
                                        scope.ngModel = ngModelTemp;
                                        scope.isopen = 0;
                                    } else {
                                        setValue(obj);
                                    }
                                });
                            } else {
                                setValue(obj);
                            }
                            if (scope.filter) {
                                scope._filterText_ = '';
                            }
                        };
                        scope.isChecked = function (item) {
                            delete item.$$hashKey;
                            return _.where(scope.ngModel, item).length;
                        };
                        scope.asValueHandler = function () {
                            var f;
                            if (scope.asValue && typeof scope.ngModel !== 'object') {
                                f = _.filter(scope.options || [], function (item) {
                                    if(item[scope.asValue]!=='')
                                        return item[scope.asValue] == scope.ngModel
                                });
                                if(f.length){
                                    return f
                                }else{//
                                    if(scope.default){
                                        if(attrs.all){
                                            return [attrs.all]
                                        }
                                        return ['']
                                    }else{
                                        return [scope.options[0]]
                                    }
                                }
                            }
                            return attrs.all?[attrs.all]:['']
                        };
                        scope.getNgModel = function () {
                            var a = scope._ngModel[0][scope.asValue],
                                b = scope['default'],
                                c = scope.options[0],
                                d = scope.ngModel;
                            if (scope.asValue) {
                                if (a) {
                                    return a
                                } else if (b) {
                                    scope._ngModel = [b];
                                    return b[scope.asValue] || ''
                                } else {
                                    return c[scope.asValue]
                                }
                            } else {
                                return d || b || c || {};
                            }
                        };
                        scope.setMenuStyle = function (len) {
                            scope.max=len||scope.max;
                            if (scope.options && scope.max && scope.options.length > scope.max) {
                                scope.menuStyle = {'height': scope.lineHeight * scope.max - scope.max, 'overflow-y': 'auto'}
                            }
                        };
                        if(_.isUndefined(scope.ngModel) || _.isNull(scope.ngModel)){
                            scope.ngModel=attrs.all||''
                        }
                        scope._ngModel = scope.asValueHandler();
                        if (!scope.multi) {
                            if (scope.options && scope.options.length) {
                                scope.ngModel = scope.getNgModel();
                                if (!scope._first && scope['default'] && scope.options[0][scope.asValue || 'value']) {
                                    scope.options.unshift(scope.addDefault());
                                    scope._first = 1;
                                }
                            }
                        } else {
                            scope.ngModel = scope._ngModel[0][scope.asValue]|| scope.ngModel || [];
                        }
                        scope.setMenuStyle();
                        scope._onChange = function (obj) {
                            if (scope.onChange) {
                                scope.onChange(obj || scope._obj);
                            }
                        };
                        scope._onBeforeChange = function (obj) {
                            return scope.onBeforeChange(obj || scope._obj);
                        };
                        var dw0=scope.$watch('ngModel', function (a, b) {
                            if (a != b) {
                                $timeout(function(){
                                    scope._ngModel = scope.asValueHandler();
                                });
                            }
                        }, true);
                        var dw1=scope.$watch('options', function (a, b) {
                            if (a != b) {
                                if (!a || a.length === 0){
                                    scope.setMenuStyle();
                                    scope.ngModel='';
                                    scope._obj[attrs.ngModel]='';
                                    return;
                                }
                                var opV=scope.options[0][scope.asValue || 'value'];
                                if (!scope.multi && scope['default'] && (attrs.all?(opV!=attrs.all):opV)) {
                                    scope.options.unshift(scope.addDefault());
                                }
                                if (!scope.multi) {
                                    scope._ngModel = scope.asValueHandler();
                                    scope.ngModel = scope.getNgModel();
                                }
                                scope.setMenuStyle(a.length);
                            }
                        }, true);
                        var dw2=scope.$watch('_obj', function (a, b) {
                            if (a != b) {
                                scope._onChange();
                            }
                        }, true);
                        var dw3=scope.$watch('isopen', function (a, b) {
                            if (a != b) {
                                if (!a && scope.onClose) {
                                    scope.onClose(scope._obj);
                                }
                            }
                            if(a){
                                scope.onOpen();
                            }
                        });
                        scope.onOpen=function(){
                            var os=element.offset();
                            $timeout(function(){
                                scope.menu.css({'left':os.left+'px','top':function(){
                                    if(os.top+element.height()+scope.menu.height()-5 > $window.scrollY+$window.innerHeight){
                                        return (os.top-scope.menu.height()-2)+'px'
                                    }
                                    return (os.top+element.height()-1)+'px'
                                }(),'width':element.width()+'px'});
                            });
                        };
                        scope.$on('$destroy',function (){
                            dw0();
                            dw1();
                            dw2();
                            dw3();
                            element.remove();
                            scope.menu.remove();
                        });
                    }
                }
            }
        }
    }])
    .run(["$templateCache", function ($templateCache) {
        $templateCache.put("select-button.html",
            "<div class=\"btn-group ui-select\" ng-class=\"{'dropup':position[0]}\" dropdown is-open=\"isopen\"  ng-style=\"{'display':width?'block':'','width':width}\">\
                <button type=\"button\" style=\"float:none;\" class=\"btn btn-primary dropdown-toggle\" dropdown-toggle ng-style=\"{'width':width}\" ng-disabled=\"disabled\">\
                   <span class=\"caret pull-right\" style=\"margin:8px 0 0 5px\"></span> \
                   <span class=\"ui-select-text\">{{(isDropdown?(title||''):(_ngModel[0][key]||ngModel[key]||options[0][key]))||(options.length&&default)||'NODATA'|translate}}</span>\
                </button>\
            </div>");
        $templateCache.put("select-button-color.html",
            "<div class=\"btn-group ui-select\" ng-class=\"{'dropup':position[0]}\" dropdown is-open=\"isopen\"  ng-style=\"{'display':width?'block':'','width':width}\">\
                <button type=\"button\" style=\"float:none;\" class=\"btn btn-primary dropdown-toggle\" ng-style=\"{'width':width,'background-color':_ngModel[0][key]||ngModel[key]||options[0][key]}\" ng-disabled=\"disabled\">\
                   <span class=\"caret pull-right\" style=\"margin:8px 0 0 5px\"></span> \
                   <span class=\"ui-select-text\">{{(isDropdown?(title||''):(_ngModel[0][key]||ngModel[key]||options[0][key]))||(options.length&&default)||'NODATA'|translate}}</span>\
                </button>\
            </div>");
        $templateCache.put("select-menu-color.html",
            "<ul class=\"dropdown-menu ui-select-menu ui-select-menu-color\" role=\"menu\" ng-show=\"options.length\" ng-class=\"{'pull-right':position[1],'ui-select-menu-visible':isopen}\"  ng-style=\"menuStyle\">\
                <li ng-class=\"{'active':!isDropdown && item[key]===(_ngModel[0][key]||ngModel[key])}\" ng-repeat=\"item in optionsFilter()\">\
                  <a href=\"#\" ng-click=\"itemClick($event,item)\" ng-style=\"{'background-color':item[key]}\">{{item[key]}}</a></li>\
            </ul>");
        $templateCache.put("select-menu.html",
            "<ul class=\"dropdown-menu ui-select-menu\" role=\"menu\" ng-show=\"options.length\" ng-class=\"{'pull-right':position[1],'ui-select-menu-visible':isopen}\"  ng-style=\"menuStyle\">\
                <li ng-if=\"filter\" ng-click=\"$event.stopPropagation()\"><input class=\"form-control ui-select-filter\" type=\"text\" ng-model=\"$parent._filterText_\"/><span class=\"glyphicon glyphicon-search\"></span></li>\
                <li ng-class=\"{'active':!isDropdown && item[key]===(_ngModel[0][key]||ngModel[key])}\" ng-repeat=\"item in optionsFilter()\">\
                  <a href=\"#\" ng-click=\"itemClick($event,item)\">\
                  <input ng-if=\"multi\"  type=\"checkbox\" ng-checked=\"isChecked(item)\"/> \
                  {{item[key]}}</a></li>\
            </ul>");
    }]);