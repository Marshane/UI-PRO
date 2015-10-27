angular.module('ui.inputSelect', [])
    .directive('uiInputSelect', ['$templateCache', '$compile','$timeout', function ($templateCache, $compile,$timeout) {
        var popupCtrl=(function(){
            function popupCtrl(compile,templateCache,timeout){
                this.templateCache=templateCache;
                this.compile=compile;
                this.timeout=timeout;
            }
            popupCtrl.prototype={
                setupScope:function(scope,elem){
                    this.scope=scope;
                    this.elem=elem;
                    this.getTpl(this.scope);
                    this.addEvent(elem);
                },
                getTpl:function(scope){
                    var self=this;
                    if (!scope.tpl){
                        scope.tpl=self.compile(['<div class="ui-input-select-popup" ng-show="isOpen"><span class="ui-input-close" ng-click="onClose()">×</span>'
                            ,self.templateCache.get('templates/input-select-popup.html'),'</div>'].join(''))(self.scope);
                        if(scope.width){
                            scope.tpl.css({width:parseInt(scope.width,10)+'px'});
                        }
                        $('body').append(scope.tpl);
                        if(!scope.visible){
                            self.show();
                        }else{
                            self.hide();
                        }
                    }
                },
                addEvent:function(elem){
                    elem.on(this.scope.triggerType||'click',_.bind(this.onTriggerEvt,this));
                    $(document).on('click',_.bind(this.layerCtrl,this));
                },
                layerCtrl:function(c){
                    var elem=this.elem[0];
                    c = c || window.event;
                    for (var d = c.target || c.srcElement; d && d.nodeType === 1;) {
                        if ((d===elem)|| String(d.className).hasString('ui-input-select-popup')){
                            ui.evt(c).stop();
                            return
                        }
                        d = d.parentNode
                    }
                    this.hide();
                },
                onTriggerEvt:function(evt){
                    this.toggle(!!this.visible);
                },
                offset:function(){
                    var offset=this.elem.offset();
                    var height=this.elem[0].offsetHeight;
                    return {
                        left:offset.left+'px',
                        top:(offset.top+height)+'px'
                    }
                },
                toggle:function(visible){
                    visible?this.hide():this.show();
                },
                hide:function(){
                    this.scope.tpl.css({'left':'-9999em','top':'-9999em'});
                    this.visible=0;
                },
                show:function(){
                    var a=this.offset();
                    this.scope.tpl.css({'left':a.left,'top':a.top,'width':this.elem.outerWidth()});
                    this.visible=1;
                },
                destroy:function(){
                    $(document).off('click',_.bind(this.layerCtrl,this));
                }
            };
            return popupCtrl;
        })();
        var _opts=['key','asValue','width','isOpen','space'];
        return{
            restrict: 'A',
            scope: {
                data:'=',
                ngModel:'=',
                onChecked:'&'
            },
            controller:["$compile","$templateCache", "$timeout",popupCtrl],
            compile: function () {
                return{
                    pre: function (scope, elem,attr,ctrl) {
                        if (elem.children().length === 0) {
                            elem.append($compile($templateCache.get('templates/input-select.html'))(scope));
                        }
                        ctrl.setupScope(scope,elem);
                    },
                    post: function (scope, elem, attr,ctrl){
                        for (var i = 0, l = _opts.length; i < l; i++) {
                            var opt = _opts[i];
                            if (attr[opt]) {
                                scope[opt] =attr[opt];
                            }
                        }
                        (function(){
                            var input=elem.find('input');
                            elem.on('click',function(){
                                input.focus();
                                ctrl.show();
                                scope.isOpen=1;
                                scope.$apply();
                            });
                        })();
                        scope.onClose=function(){
                            ctrl.hide();
                        };
                        scope.onDel=function(value,evt){
                            _.each(scope.data,function(n){
                                if(n[scope.asValue]===value){
                                    n.__checked=false;
                                    return
                                }
                            });
                            ui.evt(evt).stop();
                        };
                        scope.onKeydown=function(evt){
                            //回车控制
                            if (evt.keyCode === 13) {
                                scope.onTextFilter();
                                //防止回车触发document click事件 导致浮动框关闭
                                ui.evt(evt).prevent();
                            }
                            //删除控制
                            if (evt.keyCode === 8 && _.trim(scope.filterText)==='') {
                                scope.onDel(scope.ngModel[scope.ngModel.length-1],window.event);
                            }
                        };
                        //以key来匹配 回车选中操作
                        scope.onTextFilter=function(){
                            var key=scope.filterText;
                            _.each(scope.data,function(n){
                                if(n[scope.key]===key){
                                    n.__checked=true;
                                    scope.filterText='';
                                }
                            });
                        };
                        //利用更新数据的回调来重新调整弹出框位置
                        scope.onChecked=function(){
                            if(ctrl.visible){
                                $timeout(function(){
                                    ctrl.show();
                                });
                            }
                        }
                    }
                }
            }
        }
    }])
    .run(["$templateCache", function ($templateCache) {
        $templateCache.put("templates/input-select.html",
            '<span class="ui-input-item" ng-repeat="item in checkedData">\
                <i class="ui-input-close" ng-click="onDel(item[asValue],$event)">&times;</i>{{item[key]}}\
            </span>\
            <input class="ui-input" type="text" ng-model="filterText" ng-keydown="onKeydown($event)" />\
            ');
        $templateCache.put("templates/input-select-popup.html",
            '<div ui-checkbox data="data" key="{{key}}" filter-text="filterText" as-value="{{asValue}}" checked-data="checkedData" on-checked="onChecked(checkedID)" multi="1" ng-model="ngModel" space="{{space}}"></div>');
    }]);


