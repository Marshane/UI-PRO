angular.module('ui.checkbox', [])
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
                var attrArr=['key','asValue','multi','space'],type,model;
                var tmp=[];
                _.each(attrArr,function(it){
                    scope[it]=attrs[it];
                });
                scope.multi=(scope.multi==='0'?0:1);
                var watchAll,single,sec;
                var onchange=function(a){
                    if(_.isUndefined(a))return;
                    var _ind;
                    if(!scope.checkedData.length && !_.isUndefined(scope.ngModel) && !_.isNull(scope.ngModel)){
                        var _tmpObj={};
                        _tmpObj[scope.asValue]=scope.ngModel;
                        scope.checkedData.push(_tmpObj);
                    }
                    _.each(scope.data,function(i,index){
                        _ind=null;
                        _.each(scope.checkedData,function(j){
                            if(i[scope.asValue]===j[scope.asValue]){
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
                    // console.log(scope.data[0]);
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
                    //if(tmp){
                    var obj={},def;
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
                        return i[scope.asValue]===dif;
                    });
                    (scope.onChecked||angular.noop)(obj);
                    (scope.onChange||angular.noop)({data:a});
                    //}
                    if(!scope.multi&&!scope.checkedData.length){
                        scope.ngModel='';
                    }
                    tmp=_.clone(scope.ngModel);
                };
                if(_.isUndefined(scope.asValue))return;
                scope.data=scope.data||[];
                scope.checkedData=scope.checkedData||[];
                scope.ngModel=scope.ngModel||[];

                //处理单选情况
                scope._model={};
                if(!scope.multi){
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
                }
                watchAll=scope.$watch('data',oncheck,true);//处理异步数据
                if(scope.data.length){//处理静态数据
                    onchange(scope.data);
                    oncheck(scope.data);
                }
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
                <label ng-repeat="it in data | filter:filterText track by $index" class="btn col-sm-{{space?12/space:\'\'}}" ng-class="{active:it.__checked}" ng-model="it.__checked" btn-checkbox><i ng-class="{checked:it.__checked}"></i>{{it[key]}}</label>\
            </div>');
        $templateCache.put("ui-checkbox-single.html",
            '<div class="btn-group ui-checkbox">\
                <label ng-repeat="it in data  | filter:filterText track by $index" class="btn col-sm-{{space?12/space:\'\'}}" ng-class="{active:it.__checked}" ng-model="_model.ngModel" btn-checkbox btn-checkbox-true="{{it[asValue]}}"><i ng-class="{checked:it.__checked}" class=""></i>{{it[key]}}</label>\
            </div>');
    }]);