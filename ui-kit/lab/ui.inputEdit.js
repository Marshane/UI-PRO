angular.module('ui.inputEdit',[])
    .factory('ete',[function(){
        var addBlur=function(elem,callback,scope){
            elem.on('blur',function(e){
                scope.$apply(function(){
                    callback();
                })
            });
            elem.on('keyup',function(e){
                if(AM.util.evt(e).key===13){
                    scope.$apply(function(){
                        elem.val(elem.val()+'\n');
                    })
                }
            });
        };
        var addSelectBlur=function(doc,callback,scope){
                doc.on('click',function(e){
                    AM.util.evt(e).stop();
                    scope.$apply(function(){
                        callback();
                    })
                });
            },
            selectText=function (a,f,j){
                try{
                    a.focus();
                    if (document.createRange) a.setSelectionRange(f,j);
                    else {
                        a = a.createTextRange();
                        a.collapse(1);
                        a.moveStart("character", f);
                        a.moveEnd("character", j - f);
                        a.select();
                    }
                } catch (b) {}
            },
            tempSelect=[],
            removeSelectBlur=function(doc){
                doc.off('click');
            },
            removeBlur=function(elem){
                elem.off('blur');
            };
        return{
            addBlurEvt:addBlur,
            addSelectEvt:addSelectBlur,
            selectTextEvt:selectText,
            removeBlurEvt:removeBlur,
            tempSelect:tempSelect,
            removeSelectBlur:removeSelectBlur
        }
    }])
    .directive('uiInputEdit',['$compile','$templateCache','ete','$timeout','$document',function($compile,$templateCache,ete,$timeout,$document){
        return{
            restrict:'EA',
            require:'?ngModel',
            replace:true,
            template:'<div class="ui-edit-wrap"><span class="ui-edit-text" ng-hide="isHideText" bind-html-unsafe="text"></span></div>',
            scope:{
                ngModel:'=',
                editText:'=?',
                type:'@',
                onFinish:'&',
                selectOptions:'=?',//select数据
                selectOnChange:'&'//select回调
            },
            compile: function() {
                return {
                    post:function(scope,elem,attrs){
                        var ops=['readonly','max','inputClass',
                                'hasEdit','hasDel',
                                'selectAsValue','selectKey','selectPosition','selectWidth'],
                            editing=0,
                            input,
                            reg=/#([\s\S]+?)#/g,
                            timeout,
                            clickTimeout,
                            tmpScope,
                            type=scope.type,
                            isSelect=type==='select',
                            typeArr=['input','textarea','select'],
                            onFinish=function(){//结束编辑 通知回调
                                clearInput();
                                if(scope.ngModel&&elem.temp!==scope.ngModel){//避免空值或重复值 触发
                                    scope.onFinish({value:scope.ngModel,scope:scope});
                                }
                            },
                            handler=function(evt){//点击处理
                                if(isSelect&&ete.tempSelect.length<2 && (ete.tempSelect[0]===input)){//单独对select作处理
                                    evt.stopPropagation();
                                }
                                if(editing)return;
                                clickTimeout=$timeout(function(){
                                    editing=1;
                                    renderInput();
                                },0);
                            },
                            renderInput=function(f){//渲染input和开启相关状态和事件的绑定
                                var val=scope.ngModel||'';
                                //转换
                                scope.isHideText=true;
                                if(!input){
                                    tmpScope=scope.$new();
                                    input=$compile($templateCache.get('ui-edit-'+type+'.html'))(tmpScope);
                                    elem.append(input);
                                    if(isSelect){
                                        ete.tempSelect.push(input);
                                    }
                                }
                                editing=1;
                                if(!isSelect){
                                    ete.addBlurEvt(input,onFinish,scope);
                                }else{
                                    ete.addSelectEvt($document,onFinish,scope);
                                }
                                if(f || isSelect)return;//避免初次加载就获得焦点
                                timeout=$timeout(function(){
                                    !isSelect&&(scope.ngModel =val);
                                    ete.selectTextEvt(input[0],0,val.length);
                                });
                            },
                            clearInput=function(a){//赋值和关闭状态和解绑事件
                                if(!input||!editing)return;
                                if(!isSelect){
                                    var val=input.val().trim();
                                    if(val===''){
                                        return;
                                    }
                                    ete.removeBlurEvt(input);
                                    $timeout.cancel(timeout);
                                    scope.ngModel =val;
                                }else{
                                    ete.removeSelectBlur($document);
                                    ete.tempSelect.length=0;
                                }
                                $timeout.cancel(clickTimeout);
                                scope.isHideText=false;
                                editing=0;
                                tmpScope.$destroy();
                                input.remove();
                                input=null;
                            },
                            getObjByValue=function(value){
                                var obj={};
                                obj[scope.selectAsValue]=value;
                                return _.where(scope.selectOptions,obj)[0];
                            },
                            toH=function(a){
                                return String(a).replace(/</g,'&lt;').replace(/>/g,'&gt;').split('\n').join('<br>')
                            },
                            fillInput=function(a){//切换到文本状态
                                if(isSelect){
                                    if(scope.selectAsValue){
                                        scope.text=getObjByValue(a)[scope.selectKey];
                                    }else{
                                        scope.text=a[scope.selectKey];
                                    }
                                    scope.selectNgModel.ngModel=a;
                                }else{
                                    if(attrs.extraValue){
                                        a=a+attrs.extraValue;
                                    }
                                    scope.text=toH(a);

                                }
                                elem.temp=a;
                                clearInput();
                            },
                            onchange=function(a,b){//检测每次编辑完成之后 并处理相应动作
                                if(a===undefined || (!isSelect&&a.trim()==='')){
                                    renderInput(1);
                                }else{
                                    fillInput(a);
                                }
                            };
                        if(type&&typeArr.indexOf(type)<0){//检查传入的类型
                            console.log('type not found!');
                            return;
                        }
                        type=type||typeArr[0];//默认为input类型
                        for(var i in attrs){//统一把设置的数据挂载到scope上
                            if(ops.indexOf(i)>=0){
                                scope[i]=attrs[i];
                            }
                        }
                        if(scope.max){//input textarea字符限制
                            scope.max='maxlength="'+scope.max+'"';
                        }
                        if(!scope.readonly){//只读 不绑定相关事件 与普通文本效果一样
                            elem.on('click',function(e){
                                handler(e);
                            });
                        }
                        if(attrs.editText){//对父级公开方法
                            scope.editText=scope;
                            scope.handler=handler;
                        }
                        if(attrs.focus){//自动获得焦点
                            handler(window.event);
                        }
                        var dw0=scope.$watch('ngModel',onchange),dw1;
                        if(isSelect){
                            scope.selectNgModel={};
                            dw1=scope.$watch(function(scope){
                                return scope.selectNgModel.ngModel
                            },function(a){
                                if(a!==undefined){
                                    scope.ngModel=a;
                                }
                            });
                            scope._selectOnChange=function(value){
                                var obj={};
                                scope.selectOnChange(scope.ngModel);
                            }
                        }
                        scope.$on('$destroy',function (){
                            elem.off('click keyup');
                            $document.off('click');
                            dw0();
                            if(dw1)dw1();
                        });
                    }
                }
            }
        }
    }])
    .run(["$templateCache", function ($templateCache) {
        $templateCache.put("ui-edit-input.html",
            '<input type="text" class="form-control ui-input {{inputClass}}" value="{{ngModel}}" {{max}}/>');
        $templateCache.put("ui-edit-textarea.html",
            '<textarea type="text" class="form-control ui-input {{inputClass}}" {{max}}>{{ngModel}}</textarea>');
        $templateCache.put("ui-edit-select.html",
            '<div ui-select ng-model="selectNgModel.ngModel"  default="{{\'CHOOSE\'|translate}}"  \
                options="selectOptions"  as-value="{{selectAsValue}}"  key="{{selectKey}}" \
                on-change="_selectOnChange(selectNgModel.ngModel)"></div>');
    }]);