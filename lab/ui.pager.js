(function(){
    ui.Pager=ui.Class.create({
        init:function(option){
            this.tpl={
                pager_item:'<a class="pager_item pagerNum" data="{0}" href="javascript:void(0)">{0}</a>',
                pager_cur:'<strong class="pagerNow" data="{0}">{0}</strong>',
                pager_dis:'<strong class="pager{0} pagerDis">{1}</strong>',
                pager_text:'<a class="pager_item pager{0}" data="{1}" href="javascript:void(0)">{2}</a>',
                pager_omiss:'<strong class="pageOmiss">&bull; &bull; &bull;</strong>',
                pager_num:''
            };
            this.i18n={
                'zh_CN':{
                    first:'\u7b2c\u4e00\u9875',
                    prev:'\u4e0a\u4e00\u9875',
                    next:'\u4e0b\u4e00\u9875',
                    last:'\u6700\u540e\u9875',
                    total:'当前<span style="margin-right:10px;">{0}</span>  共 {1} 条'
                },
                'en':{
                    first:'First',
                    prev:'Pre',
                    next:'Next',
                    last:'Last',
                    total:'<span>{0}</span> of {1} services'
                }
            };

            var op=this.option=$.extend({
                el:null,
                current:1,//默认当前第1页
                type:1,//显示样式 1 精简  2 通用版
                i18n:'zh_CN',
                angular:1,
                showTotal:0,//是否显示总数
                showNum:0,
                page:null,//总页数
                pageSize:null,//每页总条数
                count:null,//总条数
                onPager:null //点击回调
            },option||{});
            op.page=op.page||0;
            // if(op.page<1)return;
            this._config(op.i18n);
            this._createHTML();
//            console.log(op.page);
            if(op.page) this._refreshPager();
        },
        _config:function(a){
            this.config={
                pager_text:this.i18n[a],
                pager_total:this.i18n[a].total,
                pager_selector:'a.pager_item',
                show_num:5
            };
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
            var timeout,val;
            if(this.option.angular) {
                this.el.bind('click', ui.bind(function (e) {
                    var el = $(e.target);
                    if (el[0].tagName == "A" && el.hasClass('pager_item')) {
                        var data = el.attr('data');
                        if (data) this._activePager(data >> 0);
                    }
                }, this));
                if(this.option.showNum){
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
                        if(self.option.onNumChange){
                            self.option.onNumChange(val,this);
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
            var txt=this.config.pager_text;
            this._config(op.i18n);
            if(op.showTotal!==1){
                if(op.showTotalType===1){
                    if(totalPage<2){
                        this.inner[0].innerHTML='';
                    }else{
                        this.inner[0].innerHTML=['<span>',op.current,'/',totalPage,'</span>'].join('')
                    }
                }else{
                    if(op.count<1){
                        this.inner[0].innerHTML=['0 ',this.config.pager_total.split(/\s/).slice(-1)].join('');
                    }else{
                        this.inner[0].innerHTML=ui.format(this.config.pager_total,function(){
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
                if(txt.first&&op.current>1 && op.page>1){
                    html.push(ui.format(tpl.pager_text,'First','1',txt.first));
                }else {
                    html.push(ui.format(tpl.pager_dis,'First',txt.first));
                }
            }
            if(txt.prev&&op.current>1 && op.page>1)
                html.push(ui.format(tpl.pager_text,'Prev',op.current-1,txt.prev));
            else html.push(ui.format(tpl.pager_dis,'Prev',txt.prev));
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
            if(txt.next&&op.current<op.page)
                html.push(ui.format(tpl.pager_text,'Next',op.current+1,txt.next));
            else html.push(ui.format(tpl.pager_dis,'Next',txt.next));
            if(op.type>1){
                if(txt.last&&op.current<op.page){
                    html.push(ui.format(tpl.pager_text,'Last',op.page,txt.last));
                }else{
                    html.push(ui.format(tpl.pager_dis,'Last',txt.last));
                }
            }
            this.inner[1].innerHTML=op.page>1?html.join(''):'';
        },
        _getListPage:function(){
            var start= 0,
                end= 0,
                op=this.option,
                conf=this.config;
            if(op.page<=conf.show_num){
                start=1;
                end=op.page;
            }else{
                start=op.current-Math.floor(conf.show_num/2);
                if(start<1) start=1;
                end=start+conf.show_num-1;
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
            console.log(op.showNum);
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
//                replace:true,
                scope:{
                    onPager:'&',
                    ctrl:'=?',
                    ngModel:'='
                },
                link:function(scope, element, attrs){
                    scope.pager = new ui.Pager({
                        container:element[0],
                        count:attrs.total||0,
                        onPager:function(num, _this){
                            if(_.isFunction(scope.onPager)){
                                scope.onPager({count:num,self:_this});
                            }
                            scope.ngModel=num;
                        }
                    });
                    if(angular.isDefined(attrs.ctrl))scope.ctrl=scope;
                    attrs.$observe('total',function(a){
                        scope.pager.option.count=a;
                        scope.pager._refreshPager();
                    });
                }
            }
        }])
})();
