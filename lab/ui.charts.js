angular.module('ui.charts', [])
    // 柱状图
    .directive('barChart', [function () {
        return {
            scope: {
                data: '=',
                option: '='
            },
            link: function (scope, element, attrs) {
                var chart;
                var ew;
                var eh = element.height();
                var format = ui.format;
                var pos = function (p, x, y) {
                    ew = element.width();
                    var pw = p.width();
                    var ph = p.height();
                    var left, top;
                    left = function () {
                        var f = pw / 2 + 8;
                        var m = x - f;
                        if (m < 0) m = 0;
                        if ((x + f) > ew) m = ew - f * 2;
                        return m;
                    }();
                    top = function () {
                        var f = y - ph - 27;
                        var m = f;
                        if (f < 0)m = y + 13;
                        return m;
                    }();
                    p.css({'left': left, 'top': top}).show();
                };
                var opts = {
                    element: element[0],
                    charts: ['bar'],
                    width: element.width()-22,
                    height: element.parent().height(),
                    data: {
                        data: [],
                        xkey: ['statName'],
                        ykey: ['statVal']
                    },
                    axis: {
                        grid: {
                            latitude: 5
                        },
                        label: {
                            xLabelFormat: function (a) {
                                return a;
                            },
                            yLabelFormat: function (a) {
                                return a >= 1e4 ? (a / 1E4 + 'w') : a;
                            }
                        }
                    },
                    tipFormat: function(barData) {
                        var xval = barData[opts.data.xkey];
                        var yval = barData[opts.data.ykey];
                        var val = 0;

                        if(angular.isArray(yval)) {
                            for(var i=0; i<yval.length; i++) {
                                val += yval[i];
                            }
                        }else {
                            val = yval;
                        }

                        if(opts.axis && opts.axis.label && opts.axis.label.xLabelFormat) {
                            xval = opts.axis.label.xLabelFormat(xval);
                        }

                        return xval + '<br>' + val;
                    },

                    tip: function (el, barData, x, y) {
                        el.html(opts.tipFormat(barData));
                        pos(el, x, y);
                    }
                };

                function onWatch() {
                    var d,_w,_h;
                    if (chart instanceof Mix.Graph) {
                        chart.update(scope.data);
                    } else {
                        opts = $.extend(opts, scope.option || {});
                        if(opts.width<=0 || opts.height<=0){
                            d=element[0];
                            while(d.nodeType === 1) {
                                _w=d.offsetWidth;
                                _h=d.offsetHeight;
                                if (_w>0  && _h>0){
                                    opts.width=_w;
                                    opts.height=_h;
                                    chart = new Mix.Graph(opts);
                                    chart.update(scope.data);
                                    return
                                }
                                d = d.parentNode
                            }
                        }else{
                            chart = new Mix.Graph(opts);
                            chart.update(scope.data);
                        }
                    }
                }

                var dW=scope.$watch('data', function (a, b) {
                    if (a) {
                        onWatch();
                    }
                }, true);
                scope.$on('$destroy',function() {
                    dW();
                });
            }
        };
    }])

    // 折线图
    .directive('lineChart', [function () {
        return {
            scope: {
                data: '=',
                segData: '=',
                option: '='
            },
            link: function ($scope, element, attrs) {
                var chart, tpl = ['<div class="ui-chart-line-label">{0}</div>', '<div class="ui-chart-line-point">{0}</div>'];
                var ew;
                var eh = element.height();
                var format = ui.format;
                var label = attrs.label && attrs.label.split(',');
                var pos = function (p, x, y) {
                    ew = element.width();
                    var pw = p.width();
                    var ph = p.height();
                    var left, top;
                    left = function () {
                        var f = pw / 2 + 8;
                        var m = x - f;
                        if (m < 0) m = 0;
                        if ((x + f) > ew) m = ew - f * 2;
                        return m
                    }();
                    top = function () {
                        var f = y - ph - 27;
                        var m = f;
                        if (f < 0)m = y + 13;
                        return m;
                    }();
                    p.css({'left': left, 'top': top}).show();
                };
                var destroyWatch,destroyWatchSeg, destroyOptWatch;
                var opt = {
                    element: element[0],
                    charts: ['line'],
                    tipFormat: function (data) {
                        return new Date(data[opt.data.xkey[0]]).dateFormat('yyyy-MM-dd hh:mm:ss');
                    },
                    tip: function (el, data, x, y) {
                        var _tpl = [], ykey = opt.data.ykey;
                        _tpl.push(format(tpl[0], opt.tipFormat(data)));
                        if (label) {
                            for (var i = 0; i < label.length; i++) {
                                _tpl.push(format(tpl[1], label[i] + '：' + data[ykey[i]]))
                            }
                        } else {
                            _tpl.push(format(tpl[1], data[ykey[0]]));
                        }
                        el.html(_tpl.join(''));
                        pos(el, x, y);
                    },
                    data: {
                        data: $scope.data || [],
                        ykey: ['statVal'],
                        xkey: ['statTime']
                    },
                    axis: {
                        grid: {
                            latitude: 9
                        },
                        label: {
                            xLabelFormat: function (a) {
                                return new Date(a).dateFormat('hh:mm');
                            },
                            yLabelFormat: function (a) {
                                return a >= 1e4 ? (a / 1E4 + 'w') : a;
                            }
                        }
                    }
                };

                function onWatch() {

                    if (chart instanceof Mix.Graph) {
                        if ($scope.option && $scope.option.axis && $scope.option.axis.segment) {
                            if (!$scope.option.graph) {
                                chart.update($scope.data, $scope.segData);
                            }
                        } else {
                            chart.update($scope.data);
                        }
                    }
                    else {
                        opt = $.extend(opt, $scope.option || {});
                        chart = new Mix.Graph(opt);
                        if ($scope.option && $scope.option.axis && $scope.option.axis.segment) {
                            $scope.option.graph = chart;//提供实例到option供外部使用
                        }
                    }
                }

                onWatch();
                destroyWatch=$scope.$watchCollection('data', function (a, b) {
                    if (a) {
                        onWatch();
                    }
                });
                if ($scope.option && $scope.option.axis && $scope.option.axis.segment) {
                    destroyWatchSeg=$scope.$watchCollection('segData', function (a, b) {
                        if (a) {
                            onWatch();
                        }
                    });

                }
                destroyOptWatch=$scope.$watchCollection('option', function (a, b) {
                    if (a && chart) {
                        $scope.option.graph = chart;
                        opt = $.extend(opt, $scope.option || {});
                        chart.setOption(opt);
                    }
                });
                $scope.$on('$destroy',function(){
                    destroyWatch();
                    if(destroyWatchSeg)destroyWatchSeg();
                    if(destroyOptWatch) destroyOptWatch();
                })
            }
        }
    }])

    // 甜甜圈
    .directive('amchartDonut', ['$timeout',function ($timeout) {
        return{
            restrict: 'EA',
            scope: {
                data: '=',
                option: '@',
                onEvent: '&'
            },
            replace: true,
            link: function (scope, elem, attr) {
                var chart,
                    percent = +attr.percent,
                    event = attr.event,
                    delay = +attr.delay || 0 ,
                    timeoutId ,
                    ops = $.extend({
                        element: elem,
                        data: [],
                        label: attr.label || 'x',
                        value: attr.value || 'y',
                        backgroundColor: attr.backgroundColor/* || '#18222b'*/,
                        labelColor: attr.labelColor/* || '#ffffff'*/,
                        formatter: function (a, b, c) {
                            if (percent === 0) {
                                return a;
                            }else {
                                var perData = parseInt(c * 1E6) / 1E4 || 0;
                                if(!/^([0-9]*[.0-9])$/.exec(perData)) { // 如果有小数位，则保留两位
                                    perData = perData.toFixed(2);
                                }
                                return perData + "%"
                            }
                        }
                    }, scope.option || {}),
                    render = function () {
                        timeoutId = $timeout(function(){
                            if (chart) {
                                chart.setData(scope.data);
                            } else {
                                chart = uiChart.Donut(ops);
                                if (event && scope.onEvent) {
                                    chart.on(event, function (i, row) {
                                        scope.onEvent({row: row, index: i});
                                    })
                                }
                            }
                        },delay);
                    };
                render();
                var dW=scope.$watch('data', function (a, b) {
                    if (a)
                        render();
                }, true);
                scope.$on("$destroy",function() {
                    dW();
                    $timeout.cancel(timeoutId);
                });
            }
        }
    }])

    // 仪表盘
    .directive('helfCircle', [
        function () {
            return {
                restrict: 'EA',
                link: function (scope, element, attrs) {
                    var radius = +attrs.radius || 50,
                        diameter = +radius * 2,
                        padding = +attrs.padding || 40,
                        value = +attrs.value,
                        over = +attrs.over,
                        overlap = +attrs.overlap || 10,
                        strokeWidth = +attrs.strokeWidth /*|| helfCircleTheme.strokeWidth*/ || 10,
                        color = eval('(' + attrs.color + ')') /*|| helfCircleTheme.color*/ || ['#162b3c', '#25333e', '#5fa10b', '#921e21', '#446f0a'],
                        labelAttr = /*helfCircleTheme.labelAttr ||*/ {
                            "font-size": 12,
                            "fill": "#000"
                        },
                        percentAttr = /*helfCircleTheme.percentAttr ||*/ {
                            "font-size": 20,
                            'font-weight': 'bold',
                            "fill": "#000"
                        },
                        c = Raphael(element[0], diameter + padding, (diameter + padding) - 10),
                        isover,
                        percent,
                        over_xy,
                        value_xy,
                        isMax,
                        maxValue,
                        conver,
                        timer,
                        polarToCartesian = function (centerX, centerY, r, angleInDegrees) {
                            var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
                            return {
                                x: centerX + (r * Math.cos(angleInRadians)),
                                y: centerY + (r * Math.sin(angleInRadians))
                            };
                        },
                        build = function () {
                            if (timer) clearTimeout(timer);
                            timer = setTimeout(function () {
                                c.clear();
                                if (!value && !over)return;
                                isover = value <= over;
                                maxValue = function () {
                                    var max = String(Math.max(value, over)), len = max.length, fis = max.slice(0, 1) >> 0, num;
                                    if (fis > 8 || len < 3) {
                                        num = '1' + Array(len + 1).join('0')
                                    } else if (!((+max) % 100)) {
                                        num = max;
                                        isMax = 1;
                                    } else {
                                        num = (fis + 1) + Array(len).join('0')
                                    }
                                    return num >> 0
                                }(),
                                    conver = function () {
                                        var helf = maxValue / 2,
                                            b = function (d) {
                                                var a;
                                                if (helf >= d) {
                                                    a = -135 - (d * -135) / helf;
                                                } else {
                                                    a = (d - helf) * 135 / helf;
                                                }
                                                return a
                                            };
                                        return [b(value), b(over)]
                                    }(),
                                    c.circle(radius + padding / 2, radius + padding / 2, radius - strokeWidth).attr({stroke: "none", fill: color[0]});
                                c.path().attr({stroke: color[1], "stroke-width": strokeWidth, arc: [radius + padding / 2, radius + padding / 2, radius - strokeWidth / 2, -135, 135]});
                                c.text(padding / 2 + 5, padding / 2 + radius * 2 - 5, 0).attr(/*{
                                 "font-size": 12,
                                 "fill": "#FFF"
                                 }*/labelAttr);
                                over_xy = polarToCartesian(radius + padding / 2, radius + padding / 2, radius + strokeWidth + 5, conver[1]);
                                if (!isover) {
                                    c.path().attr({stroke: color[4], "stroke-width": strokeWidth,
                                        arc: [radius + padding / 2, radius + padding / 2, radius - strokeWidth / 2,
                                            -135, conver[0]]});
                                }
                                c.path().attr({stroke: isover ? color[3] : color[2], "stroke-width": strokeWidth, arc: [radius + padding / 2, radius + padding / 2, radius - strokeWidth / 2, -135, conver[1]]});
                                //!isMax&&
                                c.text(over_xy.x, over_xy.y, over).attr(/*{fill: "#FFF", "font-size": 12}*/labelAttr);
                                if (isover) {
                                    c.path().attr({stroke: color[2], "stroke-width": strokeWidth,
                                        arc: [radius + padding / 2, radius + padding / 2, radius - strokeWidth / 2,
                                            -135, conver[0]]});
                                }
                                value_xy = polarToCartesian(radius + padding / 2, radius + padding / 2, radius + strokeWidth + 5, conver[0]);
                                if (!(Math.abs(value_xy.y - over_xy.y) < overlap && Math.abs(value_xy.x - over_xy.x) < overlap) && value) {
                                    c.text(value_xy.x, value_xy.y, value).attr(/*{fill: "#FFF", "font-size": 12}*/labelAttr);
                                }
                                (function () {
                                    var max_xy = polarToCartesian(radius + padding / 2, radius + padding / 2, radius + strokeWidth + 5, 135);
                                    if (!((Math.abs(max_xy.x - value_xy.x) < overlap && Math.abs(max_xy.y - value_xy.y) < overlap) || (Math.abs(max_xy.x - over_xy.x) < overlap && Math.abs(max_xy.y - over_xy.y) < overlap))) {
                                        c.text(max_xy.x, max_xy.y, maxValue).attr(/*{
                                         "font-size": 12,
                                         "fill": "#FFF"
                                         }*/labelAttr);
                                    }
                                })();
                                if (value && over) {
                                    percent = Math.ceil(over / value * 100);
                                    c.text(radius + padding / 2, radius + padding / 2, percent).attr({
                                        'title': percent
                                    }).attr(percentAttr);
                                }
                            }, 200);
                        };
                    c.customAttributes.arc = function (x, y, r, startAngle, endAngle) {
                        var start = polarToCartesian(x, y, r, endAngle);
                        var end = polarToCartesian(x, y, r, startAngle);
                        var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";
                        if (isNaN(start.x) || isNaN(start.y)) {
                            return {
                                path: ['M 0 0']
                            }
                        }
                        return {path: [
                            ["M", start.x, start.y],
                            ["A", r, r, 0, arcSweep, 0, end.x, end.y]
                        ]};
                    };
                    var oO=function (a) {
                            over = a >> 0;
                            build();
                        },
                        oV=function (a) {
                            value = a >> 0;
                            build();
                        },
                        dO0=attrs.$observe('over',oO),
                        dO1=attrs.$observe('value',oV);
                    scope.$on("$destroy",function() {
                        if(dO0&&dO0!=oO){
                            dO0();
                            dO0=null;
                        }else{
                            delete attrs.$$observers['over'];
                        }
                        if(dO1&&dO1!=oV){
                            dO1();
                            dO1=null;
                        }else{
                            delete attrs.$$observers['value'];
                        }
                    });
                }
            }
        }
    ])

    // 圆圈进度
    .directive('rscircle', [
        function () {
            return {
                restrict: 'A',
                link: function (scope, element, attrs) {
                    var radius = +attrs.radius || 55;
                    var strokeWidth = +attrs.strokeWidth /*|| rscircleTheme.strokeWidth*/ || 12;
                    var stoke = attrs.stroke || "#00afff";
                    var cool = radius + strokeWidth;
                    var area = radius * 2 + strokeWidth * 2;
                    var circle0 = Raphael(element[0], area, area);
                    circle0.customAttributes.arc = function (xloc, yloc, value, total, R) {
                        var alpha = 360 / total * value,
                            a = (90 - alpha) * Math.PI / 180,
                            x = xloc + R * Math.cos(a),
                            y = yloc - R * Math.sin(a),
                            path;
                        if (total == value) {
                            path = [
                                ["M", xloc, yloc - R],
                                ["A", R, R, 0, 1, 1, xloc - 0.01, yloc - R]
                            ];
                        } else {
                            path = [
                                ["M", xloc, yloc - R],
                                ["A", R, R, 0, +(alpha > 180), 1, x, y]
                            ];
                        }


                        return {
                            path: path
                        };
                    };
                    var circle1_arc = circle0.path().attr({
                        "stroke": stoke,
                        "stroke-width": strokeWidth,
                        arc: [cool, cool, 0, 100, radius]
                    });
                    var oV=function (a) {
                            if (a) {
                                var valTxt = circle0.text(cool, cool, a)
                                    .attr({
                                        "font-size": "32px",
                                        "font-family": "Tahoma"
                                    });
                                var box = valTxt.getBBox();

                                circle0.text(box.x2 + 3, cool + 5)
                                    .attr({
                                        "text": "%",
                                        "font-size": "14px",
                                        "fill": "#666",
                                        "font-family": "Tahoma",
                                        "text-anchor": "start"
                                    }).insertAfter(valTxt);

                                circle1_arc.animate({
                                    arc: [cool, cool, a, 100, radius]
                                }, 2000);
                            }
                        },
                        dO=attrs.$observe('value',oV);
                    scope.$on("$destroy",function(){
                        if(dO&&dO!=oV){//angular <=1.2 returns callback, not deregister fn
                            dO();
                            dO=null;
                        }else{
                            delete attrs.$$observers['value'];
                        }
                    });
                }
            };
        }
    ])

    // ?????????????????????
    .directive('pieeChart', [function() {
        return {
            restrict: 'EA',
            scope: {
                data: '=',
                option: '='
            },

            link: function($scope, element, attrs) {
                var chart;
                var size = Math.min(element.parent().width(), element.parent().height());
                function onWatch() {
                    if (chart instanceof Mix.Pie) {
                        chart.update($scope.data);
                    }else {
                        chart = new Mix.Pie($.extend({
                            element: element[0],
                            data: $scope.data||[],
                            padding: 20,
                            xkey: 'x',
                            ykey: 'y',
                            width:size,
                            height:size,
                            titleFont: {
                                'font-size': 25,
                                'stroke': '#fff',
                                'fill': '#fff'
                            },
                            stepColors: ['#558eff', '#9141ba', '#d15252', '#1a7f4f', '#ffcc00'],
                            strokeWidth: 30,
                            titleFn: function(el, data) {
                                var title = data['x'], val = data['y'], per = data.per*100;
                                var html = '<div style="display:table-cell; vertical-align:middle;"><span style="display: block; font-size: 20px; color: #f60">'+ title +'</span><span style="display: block; color: #0cf; font-size: 30px;">'+ parseInt(per) +'%</span></div>';
                                el.html(html);
                            }
                        },$scope.option||{}));
                    }
                }
                $scope.$watch('data',
                    function(a,b){
                        if(a!=b){
                            onWatch();
                        }
                    },
                    true
                );
            }
        };
    }])
    // ?????????????????????
    .directive('circleChart', function () {
        return {
            restrict: 'EA',
            scope: {
                option: '='
            },
            link: function (scope, element, attrs) {
                var radius = +attrs.radius || 50; // 半径
                var strokeWidth = +attrs.strokeWidth || 12; // 弧线宽度
                var area = radius * 2 + strokeWidth * 2;

                var total = 0;

                var circle = Raphael(element[0], area, area);
                var colors = ['#5fa10b', '#25333e', '#d15252', '#1a7f4f', '#ffcc00'];


                var data = [{
                    name: "Avaliable disk",
                    value: 49
                }, {
                    name: "Used Disk",
                    value: 30
                }];


                var x0 = strokeWidth + radius,
                    y0 = strokeWidth;

                var draw = function() {

                    for(var i=0; i<data.length; i++) {
                        total += data[i].value;
                    }

                    var start = 90;
                    for(var i=0; i<data.length; i++) {
                        start = drawArc(data[i].value, start, colors[i]);
                    }
                }

                var drawArc = function(value, start, color) {
                    var alpha = 360 / total * value,
                        a = (start - alpha) * Math.PI / 180,
                        x = (strokeWidth + radius) + radius * Math.cos(a),
                        y = (strokeWidth + radius) - radius * Math.sin(a),
                        path;

                    circle.path([
                        ["M", x0, y0],
                        ["A", radius, radius, 0, +(alpha > 180), 1, x, y]
                    ]).attr({
                        "stroke-width": strokeWidth,
                        "stroke": color
                    });

                    x0 = x;
                    y0 = y;

                    return (start - alpha);
                }



                var dO = attrs.$observe('value', draw);

            }
        }
    })
    // ?????????????????????
    .directive('wrongChart', function () {
        return {
            restrict: 'EA',
            scope: {
                option: '='
            },
            template: '<div class="row" ng-repeat="item in data">\
                    <div class="col-md-2"><div>{{item[key]}}</div></div>\
                    <div class="col-md-10">\
                      <div class="col-md-9">\
                      <div progressbar ng-class="{active:{{item[value]>item[max]}}}" value="item[value]" max="maxColl[value]"></div>\
                      </div>\
                      <div class="col-md-3"><div>{{item[value]}}</div></div>\
                    </div>\
                  </div>',
            link: function (scope, element, attrs) {
                var init = function () {
                    var option = scope.option;
                    scope.key = option.key;
                    scope.value = option.value;
                    scope.data = option.data;
                    scope.max = option.max;
                    scope.maxColl = _.max(scope.data, function (item) {
                        return item[scope.value];
                    });
                };
                var dW=scope.$watch('option.data', function (a, b) {
                    if (a != b) {
                        init();
                    }
                }, true);
                scope.$on("$destroy",function() {
                    dW();
                });
            }
        }
    })

    // 扇形图
    .directive('sectorChart', function () {
        return {
            restrict: 'EA',
            scope: {
                option: '='
            },
            link: function (scope, element, attrs) {
                var radius = +attrs.radius || 100,
                    diameter = +radius * 2,
                    padding = +attrs.padding || 40,
                    value = +attrs.value,
                    over = +attrs.over || 100,
                    overlap = +attrs.overlap || 10,
                    strokeWidth = +attrs.strokeWidth || 40,
                    color = eval('(' + attrs.color + ')') || ['#162b3c', '#25333e', '#5fa10b', '#921e21', '#446f0a'],
                    c = Raphael(element[0], diameter + padding, radius + padding),
                    isover,
                    percent,
                    over_xy,
                    value_xy,
                    isMax,
                    maxValue,
                    conver,
                    timer,
                    polarToCartesian = function (centerX, centerY, r, angleInDegrees) {
                        var angleInRadians = (angleInDegrees - 90) * Math.PI / 180.0;
                        return {
                            x: centerX + (r * Math.cos(angleInRadians)),
                            y: centerY + (r * Math.sin(angleInRadians))
                        };
                    },
                    build = function () {
                        if (timer) clearTimeout(timer);
                        timer = setTimeout(function () {
                            c.clear();
                            if (!value && !over)return;
                            isover = value <= over;
                            maxValue = function () {
                                var max = String(Math.max(value, over)), len = max.length, fis = max.slice(0, 1) >> 0, num;
                                if (fis > 8 || len < 3) {
                                    num = '1' + Array(len + 1).join('0')
                                } else if (!((+max) % 100)) {
                                    num = max;
                                    isMax = 1;
                                } else {
                                    num = (fis + 1) + Array(len).join('0')
                                }
                                return num >> 0
                            }(),
                                conver = function () {
                                    var helf = maxValue / 2,
                                        b = function (d) {
                                            var a;
                                            if (helf >= d) {
                                                a = -70 - (d * -70) / helf;
                                            } else {
                                                a = (d - helf) * 70 / helf;
                                            }
                                            return a
                                        };
                                    return [b(value), b(over)]
                                }(),
                                c.path().attr({stroke: color[1], "stroke-width": strokeWidth, arc: [radius + padding / 2, radius + padding / 2, radius - strokeWidth / 2, -70, 70]});

                            // 左侧起点 数字

                            over_xy = polarToCartesian(radius + padding / 2, radius + padding / 2, radius + strokeWidth, conver[1]);
                            if (!isover) {
                                c.path().attr({stroke: color[4], "stroke-width": strokeWidth,
                                    arc: [radius + padding / 2, radius + padding / 2, radius - strokeWidth / 2,
                                        -135, conver[0]]});
                            }
                            //!isMax&&
                            // 右侧数字

                            if (isover) {
                                c.path().attr({stroke: color[2], "stroke-width": strokeWidth,
                                    arc: [radius + padding / 2, radius + padding / 2, radius - strokeWidth / 2,
                                        -70, conver[0]]});
                            }
                            value_xy = polarToCartesian(radius + padding / 2, radius + padding / 2, radius + strokeWidth, conver[0]);
                            if (!(Math.abs(value_xy.y - over_xy.y) < overlap && Math.abs(value_xy.x - over_xy.x) < overlap) && value) {
                                //c.text(value_xy.x, value_xy.y, value).attr({fill: "#FFF", "font-size": 12});
                            }
                            (function () {
                                var max_xy = polarToCartesian(radius + padding / 2, radius + padding / 2, radius + strokeWidth, 135);
                                if (!((Math.abs(max_xy.x - value_xy.x) < overlap && Math.abs(max_xy.y - value_xy.y) < overlap) || (Math.abs(max_xy.x - over_xy.x) < overlap && Math.abs(max_xy.y - over_xy.y) < overlap))) {
                                }
                            })();
                            percent = Math.ceil(value / over * 100);
                            c.text(radius + padding / 2, radius + padding / 3, percent + '%').attr({
                                "font-size": 20,
                                'title': percent,
                                'font-weight': 'bold',
                                "fill": "#000"
                            });
                        }, 200);
                    };
                c.customAttributes.arc = function (x, y, r, startAngle, endAngle) {
                    var start = polarToCartesian(x, y, r, endAngle);
                    var end = polarToCartesian(x, y, r, startAngle);
                    var arcSweep = endAngle - startAngle <= 180 ? "0" : "1";
                    if (isNaN(start.x) || isNaN(start.y)) {
                        return {
                            path: ['M 0 0']
                        }
                    }
                    return {path: [
                        ["M", start.x, start.y],
                        ["A", r, r, 0, arcSweep, 0, end.x, end.y]
                    ]};
                };
                var oO=function (a) {
                        if(a) {
                            over = a >> 0;
                            build();
                        }
                    },
                    oV=function (a) {
                        if(a) {
                            value = a >> 0;
                            build();
                        }
                    },
                // dO0=attrs.$observe('over',oO),
                    dO1=attrs.$observe('value',oV);
                scope.$on("$destroy",function() {
                    if(dO0&&dO0!=oO){
                        dO0();
                        dO0=null;
                    }else{
                        delete attrs.$$observers['over'];
                    }
                    if(dO1&&dO1!=oV){
                        dO1();
                        dO1=null;
                    }else{
                        delete attrs.$$observers['value'];
                    }
                });
            }
        }
    })

    .directive('chartfilter', [function () {
        return{
            restrict: 'A',
            scope: {
                data: '=',
                filter: '&',
                noFilter: '='
            },
            template: '<div ng-repeat="a in data" class="checkbox checkbox-inline checked" kpiid="{{a.kpiId}}">\
                        <label class="bgcolor{{(type===\'bar\')?\'1\':($index+1)}}" title="{{a.name}}"><input type="checkbox" checked>{{a.name | cut:20}}</label>\
                    </div>',
            link: function (scope, element, attrs) {
                scope.type = attrs.type;
                element.on('click', function (e) {
                    ui.evt(e).prevent();//阻止默认事件 防止执行2次
                    var kpi = [], t = $(e.target).parents('.checkbox');
                    if (t.length && scope.filter && !scope.noFilter) {
                        t.toggleClass('checked');
                        element.find('.checkbox').each(function () {
                            if ($(this).hasClass('checked')) {
                                kpi.push(this.getAttribute('kpiid'));
                            } else {
                                kpi.push('');
                            }
                        });
                        scope.$apply(function () {
                            scope.filter({kpi: kpi});
                        });
                    }
                });
                scope.$on("$destroy",function() {
                    element.off('click');
                });
            }
        };
    }]);