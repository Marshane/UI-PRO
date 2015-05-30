angular.module('ui.select',[])
    .directive('uiSelect', ['$filter','$timeout','$translate','$compile','$templateCache', function ($filter, $timeout,$translate,$compile,$templateCache) {
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
                onOpen:'&?',
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
                        scope.lineHeight = +attrs.lineHeight || 24.3;
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
                                return f.length ? f : (attrs.all?[attrs.all]:['']);
                            }
                            return attrs.all?[attrs.all]:[''];
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
                                scope.menuStyle = {'height': scope.lineHeight * scope.max - scope.max + 1, 'overflow-y': 'auto'}
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
                                scope._obj[attrs.ngModel]=a;
                            }
                        }, true);
                        var dw1=scope.$watch('options', function (a, b) {
                            if (a != b) {
                                if (!a || a.length === 0){
                                    scope.ngModel='';
                                    scope._obj[attrs.ngModel]='';
                                    scope.setMenuStyle();
                                    return;//(attrs.all?(scope.options[0][scope.asValue || 'value']!=attrs.all):scope.options[0][scope.asValue || 'value']))
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
                        });
                        scope.onOpen=function(){
                            var os=element.offset();
                            scope.menu.css({'left':(-element.width()+10)+'px','top':(os.top+element.height()-3)+'px','width':element.width()+'px'});
                            $timeout(function(){
                                os=element.offset();
                                scope.menu.css({'left':os.left+'px'});
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