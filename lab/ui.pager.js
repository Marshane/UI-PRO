(function(){
    ui.Pager=ui.Class.create({
        init:function(option){
            this.tpl={
                pager_item:'<a class="ui-pager-item ui-pager-num" data="{0}" href="javascript:void(0)">{0}</a>',
                pager_cur:'<strong class="ui-pager-now" data="{0}">{0}</strong>',
                pager_dis:'<strong class="ui-pager-{0} ui-pager-dis">{1}</strong>',
                pager_text:'<a class="ui-pager-item ui-pager-{0}" data="{1}" href="javascript:void(0)">{2}</a>',
                pager_omiss:'<strong class="ui-page-omiss">&bull; &bull; &bull;</strong>',
                pager_num:''
            };
            var op=this.option=$.extend({
                el:null,
                previousText:'上一页',
                nextText:'下一页',
                firstText:'第一页',
                lastText:'最后页',
                totalText:'当前<span>{0}</span>&nbsp;&nbsp;&nbsp;&nbsp;共 {1} 条',
                current:1,//默认当前第1页
                type:1,//显示样式 1 精简  2 通用版
                angular:1,
                showTotal:0,//是否显示总数
                showNum:5,//显示分页个数 超出显示...
                showInputNum:0,//是否显示 输入页数框
                page:null,//总页数
                pageSize:null,//每页总条数
                count:null,//总条数
                onPager:null //点击回调
            },option||{});
            op.page=op.page||0;
            this._createHTML();
            if(op.page) this._refreshPager();
        },
        _createHTML:function(){
            if(!this.el){
                this.el=$('<div class="ui-pager"><div class="ui-pager-add"></div><div class="ui-pager-inner"></div>' +
                    '<div class="ui-pager-num">每页显示 <input type="text"/> 条<button class="btn btn-default">确定</button></div></div>');
                if(this.option.type===1){
                    this.el.addClass('ui-pager-simple')
                }
                this.inner=this.el.children();

                $(this.option.container||document.body).append(this.el);
                this._initListener();
            }
        },
        _initListener:function(){
            var self=this;
            var val;
            var op=this.option;
            if(op.angular){
                this.el.bind('click', ui.bind(function (e) {
                    var el = $(e.target);
                    if (el[0].tagName == "A" && el.hasClass('ui-pager-item')) {
                        var data = el.attr('data');
                        if (data) this._activePager(+data);
                    }
                }, this));
                if(op.showInputNum){
                    var num=this.inner.eq(2).children();
                    num.eq(1).hide();
                    num.eq(0).keyup(function(e){
                        val=this.value;
                        if(/^\d+$/.test(val)){
                            num.eq(1).show()
                        }else{
                            num.eq(1).hide();
                        }
                    });
                    num.eq(1).click(function(){
                        if(op.onNumChange){
                            op.onNumChange(val,this);
                            self._activePager(1);
                        }
                        num.eq(0).val('');
                        $(this).hide();
                    });
                }else{
                    this.inner.eq(2).remove();
                }
            }
        },
        addLoad:function(el){
            el=this.wrap=$(el);
            if(!el)throw 'not found element!';
            var w=el.width(),h=el.height();
            this.load=$('<div class="ui-pager-load" style="width:'+w+'px; height:'+h+'px;position:absolute;left:0px;top:0px;');
            el[0].style.cssText='position:relative;';
            el.append(this.load);
        },
        removeLoad:function(){
            this.wrap[0]&&(this.load.remove(),this.wrap[0].style.cssText='');
        },
        setPage:function(page){
            this._createHTML();
            this.option.page=page;
        },
        setCurrent:function(current){
            this.option.current=current;
            this._refreshPager();
        },
        active:function(num){
            if(num<1 || num>this.option.page) return;
            this._activePager(num);
        },
        _refreshPager:function(){
            var html=[],
                op=this.option,
                tpl=this.tpl,
                totalPage=Math.ceil(op.count/op.pageSize)||0;
            if(op.showTotal!==1){
                if(op.showTotalType===1){
                    if(totalPage<2){
                        this.inner[0].innerHTML='';
                    }else{
                        this.inner[0].innerHTML=['<span>',op.current,'/',totalPage,'</span>'].join('')
                    }
                }else{
                    if(op.count<1){
                        this.inner[0].innerHTML=['0 ',op.totalText.split(/\s/).slice(-1)].join('');
                    }else{
                        this.inner[0].innerHTML=ui.format(op.totalText,function(){
                            var a=(op.current-1)*op.pageSize+1,
                                b=function(){
                                    var _b=op.current*op.pageSize;
                                    return (_b<=op.count)?_b:(op.count%op.pageSize+(op.current-1)*op.pageSize)||0;
                                }();
                            return b>0?[a,'-',b].join(''):b;
                        }(),op.count||0);
                    }
                }
            }
            if(op.type>1){
                if(op.firstText&&op.current>1 && op.page>1){
                    html.push(ui.format(tpl.pager_text,'first','1',op.firstText));
                }else {
                    html.push(ui.format(tpl.pager_dis,'first',op.firstText));
                }
            }
            if(op.previousText&&op.current>1 && op.page>1)
                html.push(ui.format(tpl.pager_text,'prev',op.current-1,op.previousText));
            else html.push(ui.format(tpl.pager_dis,'prev',op.previousText));
            if(op.type===2){
                var l=this._getListPage();
                if(l.start>1)
                    html.push(tpl.pager_omiss);
                for(var i=l.start;i<=l.end;i++){
                    if(i==op.current){
                        html.push(ui.format(tpl.pager_cur,i));
                    }
                    else
                        html.push(ui.format(tpl.pager_item,i));
                }
                if(l.end<op.page) html.push(tpl.pager_omiss);
            }
            if(op.nextText&&op.current<op.page)
                html.push(ui.format(tpl.pager_text,'next',op.current+1,op.nextText));
            else html.push(ui.format(tpl.pager_dis,'next',op.nextText));
            if(op.type>1){
                if(op.lastText&&op.current<op.page){
                    html.push(ui.format(tpl.pager_text,'last',op.page,op.lastText));
                }else{
                    html.push(ui.format(tpl.pager_dis,'last',op.lastText));
                }
            }
            this.inner[1].innerHTML=op.page>1?html.join(''):'';
        },
        _getListPage:function(){
            var start= 0,
                end= 0,
                op=this.option
            if(op.page<=op.showNum){
                start=1;
                end=op.page;
            }else{
                start=op.current-Math.floor(op.showNum/2);
                if(start<1) start=1;
                end=start+op.showNum-1;
                if(end>op.page){
                    start-=end-op.page;
                    end=op.page;
                }
            }
            return{
                start:start,
                end:end
            }
        },
        _activePager:function(num){
            var op=this.option;
            if(op.current==num &&!op.showNum)return;
            op.current=num;
            this._refreshPager();
            if(op.onPager) op.onPager(num,this);
        },
        destroy:function(){
            this.el.unbind('click');
            this.el=null;
        }
    });

    angular.module('ui.pager',[])
        .directive('uiPager',['$timeout',function($timeout){
            return {
                restrict: 'A',
                scope:{
                    onPager:'&',//点击分页回调
                    ctrl:'=?',
                    totalItems:'=',//总页数
                    pageSize:'=',//每页显示数
                    ngModel:'='//当前页
                },
                link:function(scope, element, attrs){
                    var op={
                        container:element[0],
                        count:scope.totalItems||0,
                        pageSize:scope.pageSize||10,
                        type:+attrs.type||2,
                        previousText:attrs.previousText||'上一页',
                        nextText:attrs.nextText||'下一页',
                        firstText:attrs.firstText||'第一页',
                        lastText:attrs.lastText||'最后页',
                        onPager:function(num, _this){
                            scope.$apply(function(){
                                if(_.isFunction(scope.onPager)){
                                    var obj={};obj[attrs.ngModel]=num;
                                    obj.self=_this;
                                    scope.onPager(obj);
                                }
                                scope.ngModel=num;
                            });
                        }
                    };
                    op.page=Math.ceil(op.count/op.pageSize);
                    scope.pager = new ui.Pager(op);
                    if(angular.isDefined(attrs.ctrl))scope.ctrl=scope;
                    scope.$watch('totalItems',function(a){
                        scope.pager.option.count=a;
                        scope.pager.option.page=Math.ceil(a/scope.pager.option.pageSize);
                        scope.pager._refreshPager();
                    });
                    scope.ngModel=scope.ngModel||1;
                    scope.$watch('ngModel',function(a){
                        if(!a || a<=0){
                            a=1;
                        }
                        scope.pager.option.page=Math.ceil(scope.pager.option.count/scope.pager.option.pageSize);
                        scope.pager.setCurrent(a);
                    });
                }
            }
        }])
})();
