angular.module('ui.checkbox', ['ui.buttons'])
    .directive('uiCheckbox',[function(){
        return{
            restrict:'A',
            scope:{
                data:"=",
                checkedData:'=?',
                onChecked:'&?',
                onChange:'&?',
                ngModel:'=',
                filterText:'=?'
            },
            replace:true,
            templateUrl:function(elem,attrs){
                return attrs.multi==='0'?'ui-checkbox-single.html':'ui-checkbox.html'
            },
            link:function(scope,elem,attrs){
                var attrArr=['key','asValue','multi','space','modelSplit'];
                var tmp=[];
                _.each(attrArr,function(it){
                    scope[it]=attrs[it];
                });
                scope.modelSplit=scope.modelSplit||',';
//                scope.multi=(scope.multi==='0'?0:1);
                if(scope.multi==='0'){
                    scope.multi=0;
                    elem.addClass('ui-checkbox-single');
                }else{
                    scope.multi=1;
                }
                var watchAll,single,dif;
                var onchange=function(a){
                    if(_.isUndefined(a))return;
                    var _ind;
                    var _checked=[];
                    if(!scope.checkedData.length && !_.isUndefined(scope.ngModel) && !_.isNull(scope.ngModel)){
                        if(!_.isArray(scope.ngModel)){
                            scope.ngModel=String(scope.ngModel).split(scope.modelSplit);
                        }
                        _.each(scope.ngModel,function(n){
                            var _tmpObj={};
                            _tmpObj[scope.asValue]=n;
                            _checked.push(_tmpObj);
                        });
                    }


                    _.each(scope.data,function(i,index){
                        _ind=null;
                        _.each(_checked,function(j){
                            if(i[scope.asValue]==j[scope.asValue]){
                                scope.data[index].__checked=true;
                                _ind=index;
                            }
                        });
                        if(_.isNull(_ind)){
                            scope.data[index].__checked=false;
                        }
                    });
                };
                var oncheck=function(a){
                    if(a.length&&_.isUndefined(a[0].__checked))onchange(a);
                    if(scope.multi){
                        scope.ngModel=[];
                    }
                    scope.checkedData.length=0;
                    _.each(a,function(i){
                        if(i.__checked){
                            scope.checkedData.push(i);
                            if(scope.multi){//多选情况
                                scope.ngModel.push(i[scope.asValue]);
                            }else{
                                scope.ngModel=i[scope.asValue];
                            }
                        }
                    });
                    var obj={};
                    if(_.isArray(tmp)){
                        dif=function(){
                            if(scope.ngModel.length>=tmp.length)
                                return _.difference(scope.ngModel,tmp)[0];
                            else
                                return _.difference(tmp,scope.ngModel)[0];
                        }();
                    }else{
                        dif=scope.ngModel;
                    }
                    obj[attrs.ngModel]=_.filter(a,function(i){
                        return i[scope.asValue]==dif;
                    });
                    (scope.onChecked||angular.noop)(obj);
                    (scope.onChange||angular.noop)({data:a});

                    if(!scope.multi&&!scope.checkedData.length){
                        scope.ngModel='';
                    }
                    tmp=_.clone(scope.ngModel);
                };
                if(_.isUndefined(scope.asValue))return;
                scope.data=scope.data||[];
                scope.checkedData=scope.checkedData||[];
                if(+scope.ngModel===0){
                    scope.ngModel=[scope.ngModel];
                }
                scope.ngModel=scope.ngModel||[];
                if(!_.isArray(scope.ngModel)){
                    scope.ngModel=String(scope.ngModel).split(scope.modelSplit);
                }
                //处理单选情况
                scope._model={};
                var singleHandler=function(){
                    var __t=_.clone(scope.ngModel);
                    if(scope.checkedData.length){
                        __t=scope.checkedData[0][scope.asValue];
                    }
                    single=scope.$watch(function(scope){
                        return scope._model.ngModel
                    },function(a){
                        if(!_.isNull(__t) && !_.isUndefined(__t)){
                            a=__t;
                        }
                        _.each(scope.data,function(i,index){
                            if(i[scope.asValue]===a){
                                i.__checked=true;
                            }else{
                                i.__checked=false;
                            }
                        });
                        __t=null;
                    });
                };
                if(!scope.multi){
                    singleHandler()
                }
                var watchNgModel=scope.$watch('ngModel',function(a){
                    if(scope.multi) {
                        var _checked = [];
                        _.each(a, function (n) {
                            var _tmpObj = {};
                            _tmpObj[scope.asValue] = n;
                            _checked.push(_tmpObj);
                        });
                        _.each(scope.data, function (i, index) {
                            scope.data[index].__checked=false;
                            _.each(_checked, function (j) {
                                if (i[scope.asValue] == j[scope.asValue]) {
                                    scope.data[index].__checked = true;
                                }
                            });
                        });
                    }else{
                        _.each(scope.data,function(i,index){
                            if(i[scope.asValue]==a){
                                i.__checked=true;
                            }else{
                                i.__checked=false;
                            }
                        });
                    }
                },true);
                watchAll=scope.$watch('data',function(a){
                    oncheck(a);
                },true);
                scope.$on('$destroy',function(){
                    watchAll();
                    single&&single();
                })
            }
        }
    }])
    .run(["$templateCache", function ($templateCache) {
        $templateCache.put("ui-checkbox.html",
            '<div class="btn-group ui-checkbox">\
                <label ng-repeat="it in data | filter:filterText track by $index" class="btn col-xs-{{space?12/space:\'\'}}" \
                ng-class="{active:it.__checked}" ng-model="it.__checked" btn-checkbox>\
                <i ng-class="{checked:it.__checked}"></i>{{it[key]}}</label>\
            </div>');
        $templateCache.put("ui-checkbox-single.html",
            '<div class="btn-group ui-checkbox">\
                <label ng-repeat="it in data  | filter:filterText track by $index" class="btn col-xs-{{space?12/space:\'\'}}" ng-class="{active:it.__checked}" \
                 ng-model="_model.ngModel" btn-radio="{{it[asValue]}}"><i ng-class="{checked:it.__checked}" class=""><s ng-if="it.__checked"></s></i>{{it[key]}}</label>\
            </div>');
    }]);