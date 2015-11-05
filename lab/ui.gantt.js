angular.module('ui.gantt', [])//useBothWheelAxes(Default: false):::vertical or horizontal
    .filter('DateFormat', ['$translate', function ($translate) {
        return function (a) {
            if (!a)return '';
            var b = [],
                c = new Date(),
                e = c.Format('yyyy-MM-dd'),
                d = new Date(a),
                f = $translate.use(),
                g = e === a,
                m = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'],
                h = c.getFullYear() === d.getFullYear();
            if (g) {
                b.push('今天 ');
            }
            switch (f) {
                case 'zh_CN':
                {
                    if (!h) {
                        b.push(d.getFullYear() + '年')
                    }
                    b.push(d.getMonth() + 1 + '月');
                    b.push(d.getDate() + '日');
                    break;
                }
                case 'en':
                {
                    b.push(m[d.getMonth()] + ' ' + d.getDate());
                    if (!h) {
                        b.push(' , ' + d.getFullYear());
                    }
                    break;
                }
            }
            return b.join('');
        }
    }])
    .factory('DataFilter', [function () {
        var Filter = function () {
            this.hoursX = [];
            this.hoursY = [];
            this.dataLen = 0;
        };
        Filter.prototype = {
            filter: function () {
                var d = this.data, l = d.length, i = 0, hx = this.hoursX,
                    r, ed,
                    x = [];
                for (; i < l; i++) {
                    r = d[i];
                    if (r.jobTimeLimitLong) {
                        ed = Math.ceil(r.jobTimeLimitLong / 3600);
                    } else {
                        ed = (r.executeDuration ? r.executeDuration.split(':')[0] : 0) >> 0
                    }
                    x.push(ed);
                }
                if (hx.length) {
                    hx = hx.concat(x);
                    _.union(hx);
                } else {
                    hx = x;
                }
                this.hoursX = hx
            },
            first: true,
            getHoursX: function () {
                var arr = [];
                if (this.max) {
                    this.hoursX.push(this.max);
                }
                this.max = Math.ceil(_.max(this.hoursX)) + 1;
                for (var i = 0; i <= this.max; i++) {
                    arr.push({v:i});
                }
                // console.log(arr);
                return arr;
            },
            tempToday: null,
            getHoursY: function () {
                var self=this;
                var d = this.data,
                    x = 'yyyy-MM-dd',
                    h = this.hoursY,
                    dl = this.dataLen,
                    t = this.tempToday,
                    f = function (a, b) {
                        b = b || 'yyyy-MM-dd hh:mm';
                        return new Date(a.startDate).Format(b);
                    },
                    arr = [], yMd, yMdp, hm, hmp, temp, i, j, l, ll, obj = {}, index = [];
                if(d.length){
                    t = function () {
                        var b = f(d[0], x);
                        if(self.lastDate!==b){
                            obj.today = b;
                            arr.push(obj);
                        }
                        obj = {};
                        return b
                    }();
                }
                // console.log(t);
                for (i = 0, l = d.length; i < l; i++) {
                    if (index.indexOf(i) >= 0)continue;//当前这条数据被处理过 直接跳过 处理下条
                    obj = {};
                    hm = f(d[i]);
                    yMd = f(d[i], x);
                    // console.log(self.lastDate,yMd);
                    if (yMd != t) {//过滤日期
                        // if (yMd != t && self.lastDate!=yMd) {//过滤日期
                        t = obj.today = yMd;
                        arr.push(obj);
                        obj = {};
                    }

                    obj.time = hm.split(' ')[1];
                    obj.data = function () {
                        temp = [];
                        for (j = 0, ll = d.length; j < ll; j++) {
                            yMdp = f(d[j], x);
                            hmp = f(d[j]);
                            if (hmp == hm) {//处理年月日时分 相同情况
                                temp.push(d[j]);
                                index.push(j);
                            }
                        }
                        return temp;
                    }();

                    dl++;
                    arr.push(obj);
                }
                // console.log(arr);
                this.dataLen = dl;
                this.lastDate=yMd;
                //合并数据 先不考虑性能问题
                if (h.length) {
                    h = h.concat(arr);
                } else {
                    h = arr;
                }
                return this.hoursY = h
            },
            /**
             * {FAIL2:-2,FAIL : -1,READY : 0,START : 1,STOP : 2,PAUSE : 3,COMPLETE : 4,STARTING : 5,STOPPING : 6,PAUSING : 7, FORCESTOPPING : 8}
             * @param s
             * @returns {string}
             */
            getState: function (s) {
                var st;
                switch (s >> 0) {
                    case -2:
                    case -1:
                        st = 'b';
                        break;
                    case 0:
                    case 1:
                    case 3:
                        st = 'a';
                        break;
                    case 4:
                        st = 'e';
                        break;
                    case 2:
                        st = 'd';
                        break;
                    case 5:
                    case 6:
                    case 8:
                        st = 'f';
                        break;
                    case 7:
                        st = 'g';
                        break;
                }
                return st;
            },
            collapsed: function (evt, i) {
                var t = evt.target, pn = $(t.parentNode), p = pn.prev();
                if (!t.c) {
                    p.css('height', 'auto');
                    t.c = 1;
                } else {
                    p.css('height', i * 31 + 'px');
                    t.c = 0;
                }
                pn.toggleClass('collapsed');
            },
            setHoursXWidth:function(v,scope,attr){
                var w,ww=scope.hoursXWidthElem.width();
                if(!v)w=+attr.hoursXWidth;
                else w=Math.floor(ww/v-22/v);
                scope.hoursXWidth=w;
            },
            getHoursXWidth: function (w, item) {
                var sp = [0, 0],
                    jl = item.jobTimeLimitLong,
                    ed = item.executeDuration;
                if (jl) {
                    sp[0] = Math.floor(jl / 3600);
                    sp[1] = Math.floor(jl % 3600 / 60);
                } else {
                    ed && (sp = ed.split(':'));
                }
                return w * parseInt(sp[0]) + Math.ceil((parseInt(sp[1]) / 60) * w) + 'px'
            },
            render: function (op) {
                this.data = op.data || [];
                this.filter();
            },
            clear: function () {
                this.hoursX = [];
                this.hoursY = [];
                this.dataLen = 0;
            }
        };
        var ins;
        return function () {
            if (!ins) {
                ins = new Filter();
            }
            return ins
        }()
    }])
    .factory('$popup', ['$timeout', '$templateCache', '$compile', '$document', function ($timeout, $templateCache, $compile, $document) {
        var hidePopup = function () {
                self.scope.visible = false;
            },
            win=$(window),
            self = this,
            apos = ['lt', 'lb', 'rt', 'rb'],
            onPopup = function (context) {
                var _layer = self.elem,
                    pos = context.offset(),
                    l = pos.left,
                    t = pos.top,
                    setPos = function(){
                        var h = context.height(),
                            w = context.width(),
                            l_h = _layer.height(),
                            l_w = _layer.width(),
                            w_h = win.height()+win.scrollTop(),
                            w_w =win.width(),
                            o = Math.ceil(w / 2) + 11,
                            _o = Math.ceil(h / 2);
                        _layer[0].style.left = l + l_w + o > w_w ? l - l_w + o - 22 + 'px' : l + o + 'px';
                        _layer[0].style.top = t + l_h + _o > w_h ? t - l_h + _o + 'px' : t + h - _o + 'px';
                        _layer.removeClass(apos.join(' '));
                        if ((t + l_h + _o) > w_h) {
                            if ((l + l_w + o) > w_w) {
                                _layer.addClass(apos[3]);
                            } else {
                                _layer.addClass(apos[1]);
                            }
                        } else {
                            if ((l + l_w + o) > w_w) {
                                _layer.addClass(apos[2]);
                            } else {
                                _layer.addClass(apos[0]);
                            }
                        }
                    };
                if (self.op.callPromise) {
                    self.op.callPromise(setPos, context);
                }
                setPos();
            };
        this.op = {
            eventType: 'mouseover',
            className: '',
            scope: null
        };
        this.scope = null;
        this.clearOverTimeout = function () {
            if (self.overTimeout) {
                $timeout.cancel(self.overTimeout);
            }
        }
        this.clearOutTimeout = function () {
            if (self.outTimeout) {
                $timeout.cancel(self.outTimeout);
            }
        };
        this.hidePopup = function (event) {
            self.clearOverTimeout();
            if (self.op.eventType !== 'click') {
                if(event){
                    hidePopup();
                    return;
                }
                self.outTimeout = $timeout(hidePopup, 200);
            } else {
                hidePopup();
            }
        };
        this.showPopup = function (elem) {
            self.clearOutTimeout();
            if (!self.elem.length)return;
            if (self.op.eventType !== 'click') {
                self.overTimeout = $timeout(function () {
                    onPopup(elem)
                }, 400);
            } else {
                onPopup(elem);
            }
        };
        this.addEvent = function () {
            $document.bind('click', _.bind(function (event) {
                if (!$(event.target).parents('div.am-popup').length || $(event.target).hasClass('jp')) {
                    this.hidePopup(event);
                    this.scope.$apply();
                }
            }, this));
            this.scope.$on('$destroy', _.bind(function (event) {
                $document.unbind('click');
                this.elem.unbind('mouseover');
                this.elem.unbind('mouseout');
                this.elem.remove();
            }, this));
        };
        this.init = function (_op) {
            var op = this.op;
            $.extend(op, _op || {});
            this.scope = op.scope;
            op.scope.className = op.className;
            op.scope.getPopupTpl = function () {
                return op.tpl;
            };
            op.scope._show = 0;
            op.scope.isShow = function (i) {
                op.scope._show = i;
            };
            this.elem = $compile($templateCache.get('ui-popup.html'))(op.scope);
            if (op.eventType !== 'click') {
                this.elem.bind('mouseover',function(){
                    self.clearOutTimeout();
                });
                this.elem.bind('mouseout',function(){
                    self.hidePopup();
                });
            }
            op.scope.popUpClose = _.bind(this.hidePopup, this);
            document.body.appendChild(this.elem[0]);
            this.hidePopup();
            this.addEvent();
        }
        return this;
    }])
    .directive('uiPopup', ['$popup','$timeout', function ($popup,$timeout) {
        return {
            restrict: 'EA',
            scope: true,
            compile: function () {
                return {
                    post: function (scope, elem, attr) {
                        scope.loading = false;
                        if (attr.eventType === 'click') {
                            elem.bind('click',function (event) {
                                event.stopPropagation();
                                event.cancelBubble = !0
                                $popup.showPopup(elem);
                            });
                        }else{
                            elem.bind('mouseover',function(){
                                $popup.showPopup(elem);
                            });
                            elem.bind('mouseout',function(){
                                $popup.hidePopup();
                            });
                        }
                        scope.$on('destroy',function(){
                            if (attr.eventType === 'click'){
                                elem.unbind('click');
                            }else{
                                elem.unbind('mouseover');
                                elem.unbind('mouseout');
                            }
                        });
                    }
                }
            }
        };
    }])
    .directive('stateButton', ['$compile', function ($compile) {
        return {
            restrict: 'EA',
            scope: true,
            compile: function () {
                return {
                    post: function (scope, elem, attr) {
                        var arr = ['continueIns', 'pauseIns', 'stopIns', 'forceStopIns'],
                            tpl = ['<span class="glyphicon glyphicon-step-forward" title="运行" ng-click="_onStateIns(0)"></span>',
                                '<span class="glyphicon glyphicon-pause" title="暂停" ng-click="_onStateIns(1)"></span>',
                                '<span class="glyphicon glyphicon-stop" title="停止" ng-click="_onStateIns(2)"></span>',
                                '<span class="glyphicon glyphicon-ban-circle" title="强停" ng-click="_onStateIns(3)"></span>'],
                            params = eval('(' + attr.params + ')'),
                            fill = function (a) {
                                var tp = [], rol = [
                                    [-2, -1, 2],
                                    [1],
                                    [1, 3, 5],
                                    [-2, -1,1, 2, 3, 5, 6]
                                ];
                                for (var i = 0; i < rol.length; i++) {
                                    if (rol[i].indexOf(a) >= 0) {
                                        tp.push(tpl[i])
                                    }
                                }
                                elem.html($compile(tp.join(''))(scope));
                            };
                        fill(+attr.stat);
                        scope._onStateIns = function (i) {
                            scope.onStateIns($.extend(params, {'type': arr[i], callback: function (stat) {
                                fill(+stat);
                            }}));
                        };
                    }
                }
            }
        };
    }])
    .directive('uiGantt', ['DataFilter', '$popup', '$http', '$timeout', function (DataFilter, $popup, $http, $timeout) {
        return{
            restrict: 'EA',
            replace: true,
            templateUrl: '../resource/tpl/gantt/gantt.html',
            scope: {
                data: '=',
                startTime: '=',
                wheelSpeed: '@',
                hoursXWidth: '@',
                onScrollBottom: '&',
                onStateIns: '&'
            },
            compile: function () {
                return {
                    post: function (scope, elem, attr) {
                        var DF = DataFilter,
                            FR = function () {
                                DF.render({data: scope.data});
                                scope.hoursX = DF.getHoursX();
                                scope.hoursY = DF.getHoursY();
                            };
                        var scrollScope;
                        $timeout(function(){
                            scope._369Options=[{key:'3H',value:3},{key:'6H',value:6},{key:'9H',value:9}];
                            //scope.on369(3);
                        });
                        scope.getState = function (a) {
                            return DF.getState(a);
                        };
                        scope.collapsed = function (evt, i) {
                            DF.collapsed(evt, i);
                            scope.isCollapsed=!scope.isCollapsed;
                        };
                        scope.getHoursXWidth = function (item) {
                            return DF.getHoursXWidth(+scope.hoursXWidth, item)
                        };
                        scope.getPercent = function (item) {
                            return DF.getPercent(item);
                        };
                        scope.hoursXWidthElem=function(){
                            return elem.find('div.hour-x ul');
                        }();
                        scope.on369=function(item){
                            DF.max=item.value-1;
                            DF.setHoursXWidth(item.value,scope,attr);
                            scope.hoursX = DF.getHoursX(+scope.hoursXWidth);
                        };
                        //滚动时回调
                        scope.onScroll = function (self) {
                            scrollScope = self;
                            if (scope.visible) {
                                scope.$apply(function () {
                                    scope.visible = false;
                                });
                            }
                        };
                        var $watchCollection = scope.$watchCollection('data', function (a) {
                            if (a) {
                                scope.on369({value:3});
                                DF.max=2;
                                FR();
                                if (scrollScope) {
                                    $timeout(function () {
                                        if (DF.dataLen < 21) {
                                            scrollScope.scrollTop(0);
                                        }
                                        scrollScope.uiScrollbar('update');
                                    });
                                };
                            }
                        });
                        scope.$on('$destroy', function () {
                            $watchCollection();
                        });
                        $popup.init({
                            scope: scope,
                            tpl: attr.popupTpl,
                            className: attr.popupClassName,
                            eventType: attr.popupEventType,
                            callPromise: function (setPosFun, elem) {
                                elem = elem[0];
                                if (elem.data) {//来自缓存数据
                                    scope.$apply(function () {
                                        scope.popupData = elem.data;
                                        scope.visible = true;
                                        $timeout(function () {
                                            setPosFun()
                                        });
                                    })
                                } else {
                                    scope.visible = true;
                                    scope.loading = true;
                                    scope.params = eval('(' + elem.getAttribute("params") + ')');
                                    $http.post(attr.popUpUrl, scope.params).then(function (data) {
                                        data = function (d) {
                                            var arr = [], obj = {};
                                            for (var i in d) {
                                                if (d[i].list) {
                                                    obj = {total: d[i].totalCount, list: d[i].list, state: function (i) {
                                                        var s;
                                                        if (i == 1) {
                                                            s = 'Running'
                                                        } else if (i == -1) {
                                                            s = 'Error'
                                                        } else if (i == 4) {
                                                            s = 'Completed'
                                                        }
                                                        return s;
                                                    }(i)};
                                                    arr.push(obj)
                                                }
                                            }
                                            return arr;
                                        }(data.data);
                                        scope.loading = false;
                                        elem.data = data;
                                        scope.popupData = data;
                                        scope.popupData['name'] = scope.params.data.jobName;
                                        $timeout(function () {
                                            setPosFun()
                                        });
                                    });
                                }
                            }
                        });
                    }
                }
            }
        }
    }]);