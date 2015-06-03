(function(w){
    'use strict';

    var Mix = {};
    Mix.util = {

        inherit: (function() {
            var F = function() {};
            return function(C, P) {
                F.prototype = P.prototype;
                C.prototype = new F();
                C.uber = P.prototype; // set a bridge to parent's prototype
                C.prototype.constructor = C;
            };
        })(),

        shim: { stroke: 'none', fill: '#000', 'fill-opacity': 0 }
    };

    w.Mix = Mix;

})(window);

/**
 * @description Grid 文件主要会用绘制图表的背景网格和xy轴等
 * NOTE： x/y轴分别指横轴和纵轴，不论是水平图表还是垂直图表
 */

//(function($, R) {
//    'use strict';
//
//    function Grid(options) {
//        var me = this,
//            opts;
//        opts = me.options = $.extend({}, me.gridDefaults, me.defaults, options);
//
//        // 设置me.el
//        if (typeof opts.element === 'string') {
//            me.el = $(document.getElementById(options.element));
//        } else {
//            me.el = $(opts.element);
//        }
//
//        if (me.el.css('position') === 'static') {
//            me.el.css('position', 'relative');
//        }
//        opts.width = opts.width || me.el.width();
//        opts.height = opts.height || me.el.height();
//        me.raphael = new R(me.el[0], opts.width, opts.height);
//
//        /**
//         * 滑块有两种情形：
//         * 1. 本地数据，如果是本地数据，则每次拖动滑块时，从数据中截取出相应的片段
//         * 2. 远程数据，如果是远程数据，则每次拖动滑块时都需要从远程服务器获取数据
//         */
//        if (opts.url) {
//            $.get(opts.url, opts.dataParameters, function(results) {
//                results = $.parseJSON(results);
//                me.setData(results);
//                me.draw();
//            });
//        }
//        else {
//            if (opts.slider) {
//                me.start = -opts.dataParameters.dataSize;
//                me.end = 0;
//            }
//            // 处理数据，获得转换后的xy值和最大最小值
//            me.setData(opts.slider ? me.sliceData() : opts.data);
//            // 计算长宽和x/y轴的分段大小
//            this.draw();
//        }
//    }
//
//    Grid.prototype = {
//        constructor: Grid,
//        gridDefaults: {
//            cartesian : false, // 笛卡尔坐标系
//
//            slider: false, // 是否启用滑动条
//            sliderHeight: 30, // 滑动条的高度
//            sliderTrackColor: '#333', // 滑动条的轨道颜色
//            sliderBlockColor: '#fff', // 滑动条上滑块的颜色
//
//            grid: true, // 坐标系网格
//            gridLineColor: '#08f', // 网格线的颜色
//            gridStrokeWidth: 0.5, // 网格线的线宽
//
//            labelYLine: true, // 是否显示y轴标签横线
//            labelYNumbers: 5, // y轴标签的数量（此处指的y轴式数据轴，而不是传统意义上的纵坐标）
//            labelFontColor: '#fff', // 标签的字体颜色
//            labelFontSize: 12, // 标签的字体大小
//            labelFontFamily: 'sans-serif', // 标签的字体族
//            labelFontWeight: 'normal', // 标签字体的粗细
//            labelAnchor: 'end', // 标签的对齐方式（start，middle，end）
//            xLabelLength: 5, // 横轴标签所允许的最大文本长度
//            yLabelLength: 5, // 纵轴标签所允许的最大文本长度
//            xLabelFormat: false, // 横轴标签的格式化函数
//
//            url: undefined, // 是否使用数据库数据，值为动态数据的url
//            dataParameters: {
//                dataSize: 8, // 当使用本地数据，并且启用滑动条时，当前视图显示的数据条数
//            },
//
//            padding: 20, // 画布边缘和图表之间的空隙
//            yLabelWidth: 20, // y轴上label的宽度
//            xLabelHeight: 20, // x轴上label的高度，宽度一般自动计算
//            ymax: 'auto', // 纵坐标的最大值
//            ymin: 'auto 0' // 纵坐标的最小值
//        },
//
//        /**
//         * 更新画布，进行数据更新，以及图形和label的更新，不涉及坐标的重新计算
//         * @return {[type]} [description]
//         */
//        update: function(data) {
//            var me = this;
//            me.setData(data);
//            me.raphael.clear();
//            me.draw();
//        },
//
//        draw: function() {
//            var me = this,
//                opts = me.options;
//            me.preCalc();
//            // 绘制笛卡尔坐标系
//            if (opts.cartesian) {
//                me.drawCartesian();
//            }
//            me.drawLabels();
//            // 绘制grid
//            // if (opts.grid) {
//            //     me.drawGrid();
//            // }
//
//            if (opts.slider) {
//                me.drawSlider();
//            }
//        },
//
//        /**
//         * 返回数据的片段
//         * @param  {[type]} start [数据在数组中的起始位置]
//         * @param  {[type]} end   [数据在数组中的结束为止]
//         * @return {[type]}       [被截取的数据]
//         */
//        sliceData: function() {
//            var me = this,
//                opts = me.options,
//                data;
//            data = me.end ? opts.data.slice(me.start, me.end) : opts.data.slice(me.start);
//            return data;
//        },
//
//        setData: function(data) {
//            var me = this,
//                opts = this.options,
//                ymin, ymax;
//
//            if (!data || data.length === 0) { // 容错处理，当参数没有传值，或传的是空值时
//                me.data = [];
//
//                // TODO: 删除图表相关内容
//                return;
//            }
//
//            me.data = (function() {
//                var i,
//                    len = data.length,
//                    results = [],
//                    row, ret;
//
//                for (i = len - 1; i >= 0; i--) {
//                    row = data[i];
//                    ret = {};
//
//                    ret.label = row[opts.xkey];
//                    if (opts.xLabelFormat && typeof opts.xLabelFormat === 'function') { // 格式化label
//                        ret.label = opts.xLabelFormat(ret.label);
//                    }
//                    var ykey = opts.ykey,
//                        j, len2 = ykey.length,
//                        _ykey, _yval;
//
//                    ret.x = i + 1;
//                    ret.y = [];
//
//                    for (j = len2 - 1; j >= 0; j--) {
//                        _ykey = ykey[j];
//                        _yval = row[_ykey];
//
//                        if (typeof _yval === 'string') {
//                            _yval = parseFloat(_yval);
//                        }
//
//                        if (ymax) {
//                            ymax = Math.max(_yval, ymax);
//                            ymin = Math.min(_yval, ymin);
//                        }
//                        else {
//                            ymax = ymin = _yval;
//                        }
//                        ret.y.unshift(_yval);
//                    }
//
//                    results.unshift(ret);
//                }
//                return results;
//            }).call(me);
//
//
//            // 获取x的最大最小值
//            me.xmin = me.data[0].x;
//            me.xmax = me.data[me.data.length - 1].x;
//            if (me.xmin === me.xmax) {
//                me.xmin -= 1;
//                me.xmax += 1;
//            }
//
//            // 根据一定的算法获取y轴最大最小值
//            me.ymin = me.yboundary('min', ymin);
//            me.ymax = me.yboundary('max', ymax);
//            if (me.ymin === me.ymax) {
//                if (ymin) {
//                    me.ymin -= 1;
//                }
//                me.ymax += 1;
//            }
//
//            // 当ymax和ymin为自动时
//            me.grid = me.calcYLabelGrid(me.ymin, me.ymax, opts.labelYNumbers);
//            me.ymin = Math.min(me.ymin, me.grid[0]);
//            me.ymax = Math.max(me.ymax, me.grid[me.grid.length - 1]);
//
//            // TODO: else...
//        },
//
//        // 计算y轴的边界
//        yboundary: function(boundaryType, currentValue) {
//            var boundaryOption,
//                suggestedValue;
//            boundaryOption = this.options['y' + boundaryType];
//            if (boundaryOption.slice(0, 4) === 'auto') {
//                if (boundaryOption.length > 5) {
//                    suggestedValue = parseInt(boundaryOption.slice(5), 10);
//                    if (!currentValue) {
//                        return suggestedValue;
//                    }
//                    return Math[boundaryType](currentValue, suggestedValue);
//                } else {
//                    if (currentValue) {
//                        return currentValue;
//                    } else {
//                        return 0;
//                    }
//                }
//            } else {
//                return parseInt(boundaryOption, 10);
//            }
//        },
//
//        // 根据ymin/ymax/labelYNumbers计算Y轴上的分割线
//        calcYLabelGrid: function(ymin, ymax, nlines) {
//            var gmax, gmin, grid, smag, span, step, unit, y, ymag;
//            span = ymax - ymin;
//            ymag = Math.floor(Math.log(span) / Math.log(10));
//            unit = Math.pow(10, ymag);
//            gmin = Math.floor(ymin / unit) * unit;
//            gmax = Math.ceil(ymax / unit) * unit;
//            step = (gmax - gmin) / (nlines - 1);
//            if (unit === 1 && step > 1 && Math.ceil(step) !== step) {
//                step = Math.ceil(step);
//                gmax = gmin + step * (nlines - 1);
//            }
//            if (gmin < 0 && gmax > 0) {
//                gmin = Math.floor(ymin / step) * step;
//                gmax = Math.ceil(ymax / step) * step;
//            }
//            if (step < 1) {
//                smag = Math.floor(Math.log(step) / Math.log(10));
//                grid = (function() {
//                    var _i, _results;
//                    _results = [];
//                    for (y = _i = gmin; step > 0 ? _i <= gmax : _i >= gmax; y = _i += step) {
//                        _results.push(parseFloat(y.toFixed(1 - smag)));
//                    }
//                    return _results;
//                })();
//            } else {
//                grid = (function() {
//                    var _i, _results;
//                    _results = [];
//                    for (y = _i = gmin; step > 0 ? _i <= gmax : _i >= gmax; y = _i += step) {
//                        _results.push(y);
//                    }
//                    return _results;
//                })();
//            }
//            return grid;
//        },
//
//        /**
//         * 计算画布上画图区域的位置，top/right/bottom/left,
//         * 以及画图区域的width/height
//         * @return {[undefined]} [description]
//         */
//        preCalc: function() {
//            var me = this,
//                opts = me.options,
//                w = opts.width,
//                h = opts.height;
//
//            // TODO: 考虑padding等
//            me.left = opts.padding + opts.yLabelWidth;
//            me.right = w - opts.padding;
//            me.top = opts.padding;
//            me.bottom = h - opts.padding - opts.xLabelHeight;
//            me.bottom = opts.slider ? me.bottom - opts.sliderHeight : me.bottom;
//            me.width = me.right - me.left;
//            me.height = me.bottom - me.top;
//            if (opts.direction === 'horizontal') {
//                me.dx = me.height / (me.xmax - me.xmin); // 每个像素宽度对应的值大小
//                me.dy = me.width / (me.ymax - me.ymin);
//            }
//            else {
//                me.dx = me.width / (me.xmax - me.xmin); // 每个像素宽度对应的值大小
//                me.dy = me.height / (me.ymax - me.ymin);
//            }
//
//            me.labelYs = me.calcYLabelGrid(me.ymin, me.ymax, opts.labelYNumbers);
//
//            // 调用子类的calc
//            if (me.calc) {
//                me.calc();
//            }
//
//            me.calcPointCoord();
//        },
//        /**
//         * 计算x轴，y轴的标签坐标
//         * @return {[type]} [description]
//         */
//        // calcCoords: function() {
//        //     var me = this,
//        //         data = me.data,
//        //         dataLen = data.length;
//
//
//
//        // },
//
//        calcPointCoord: function() {
//            var me = this,
//                data = me.data,
//                dataLen = data.length - 1,
//                row;
//            for (; dataLen >= 0; dataLen--) {
//                row = data[dataLen];
//
//                // _x 坐标
//                row._x = me.transXCood(row.x);
//
//                var ypoints = [],
//                    yval = row.y,
//                    y,
//                // j = 0,
//                    ylen = yval.length - 1;
//                for (; ylen >= 0; ylen--) {
//                    y = yval[ylen];
//
//                    if (y) {
//                        ypoints.push(me.transYCoord(y));
//                    } else {
//                        ypoints.push(y);
//                    }
//                }
//
//                // _y 坐标
//                row._y = ypoints;
//
//                // 这里的ymax实则坐标的最小值
//                // 估计使用max是因为这是该row的最高点
//                // 尚不知道有什么用，暂时先注释
//                /*
//                 row._ymax = Math.min.apply(Math,
//                 [this.bottom].concat(ypoints));
//                 */
//            }
//        },
//
//        transXCoordHorizontal: function(x) {
//            return this.left + (x - this.xmin) * this.dx;
//        },
//
//        transXCood: function() {
//
//        },
//
//        transYCoordHorizontal: function(y) {
//            return this.left + (y - this.ymin) * this.dy;
//        },
//
//        transYCoord: function(y) {
//            var me = this,
//                direction = me.options.direction;
//            if (direction === 'horizontal') {
//                return me.right - (y- me.ymin) * me.dy;
//            }
//            else {
//                return me.bottom - (y - me.ymin) * me.dy;
//            }
//        },
//
//        /**
//         * 绘制笛卡尔坐标系
//         * @return {[type]} [description]
//         */
//        drawCartesian: function() {
//
//        },
//
//        drawSlider: function() {
//            var me = this, opts = me.options,
//                track, slider, move = false, offsetLeft,
//                active = {
//                    'fill': '#009999',
//                    'stroke': '#009999',
//                    'cursor': 'move'
//                },
//                inactive = {
//                    'fill': '#115366',
//                    'stroke': '#115366',
//                    'corsor': 'auto'
//                };
//
//            track = me.raphael.rect(me.left, me.bottom + 4, me.width, opts.sliderHeight)
//                .attr(inactive);
//            slider = me.raphael.rect(me.left, me.bottom + 4, me.width, opts.sliderHeight)
//                .attr(inactive);
//            slider.hover(function() {
//                slider.attr(active);
//            }, function() {
//                if  (!move) {
//                    slider.attr(inactive);
//                }
//            });
//            slider.drag(function(dx) {
//                var x, w;
//                if (dx > 0) {
//                    x = me.left + dx;
//                    w = me.width - dx;
//                }
//                else {
//                    x = me.left;
//                    w = me.width + dx;
//                }
//
//                slider.attr({
//                    'x': x,
//                    'width': w
//                });
//                offsetLeft = dx;
//            }, function() {
//                move = true; // 标记拖动开始
//            }, function() {
//                var param = opts.dataParameters,
//                    scale = Math.round(Math.abs(offsetLeft) / me.dx); // 移动的点个数
//                move = false;
//                scale = isNaN(scale) ? 0 : scale; // 如果scale不是数字
//
//                if (opts.url) {
//                    if (offsetLeft > 0) {
//                        param.point_time -= param.timeinterval * scale;
//                    }
//                    else {
//                        param.point_time += param.timeinterval * scale;
//                    }
//                    $.get(opts.url, opts.dataParameters, function(results) {
//                        me.update($.parseJSON(results));
//                    });
//                }
//                else {
//                    if (offsetLeft > 0) {
//                        me.start = me.start + scale;
//                        me.end = me.end + scale;
//                        if (me.end >= 0) {
//                            me.start = -opts.dataParameters.dataSize;
//                            me.end = 0;
//                        }
//                    }
//                    else {
//                        me.start = me.start - scale;
//                        me.end = me.end - scale;
//                        // 如果到数据头
//                        if ( Math.abs(me.start) >= opts.data.length) {
//                            me.start = -opts.data.length;
//                            me.end = -opts.data.length + opts.dataParameters.dataSize;
//                        }
//                    }
//                }
//
//                me.update();
//            });
//
//            me.slider = me.raphael.set(track, slider);
//        },
//
//        /**
//         * 绘制x/y轴的label
//         * @return {[type]} [description]
//         */
//        drawLabels: function() {
//            var me = this,
//                opts = me.options,
//                data = me.data,
//                dataLen = data.length,
//                labelYs = me.labelYs,
//                labelLen = labelYs.length,
//                i, x, y, label;
//            me.labelOnX = me.raphael.set();
//            me.labelOnY = me.raphael.set();
//
//
//            if (opts.direction === 'horizontal') {
//                for (i = labelLen - 1; i >= 0; i--) { // x 轴
//                    label = labelYs[i];
//                    x = me.transYCoordHorizontal(labelYs[i]);
//                    y = me.bottom + 12 + (opts.slider ? opts.sliderHeight : 0);
//                    me.labelOnX.push(me.drawLabel(x, y, label, 'middle'));
//                    if (opts.labelYLine) { // 是否需要纵向的辅助线
//                        me.drawYLine('M'+ x +','+ me.top +'V'+ me.bottom );
//                    }
//                }
//                for (i = dataLen - 1; i >= 0; i--) {
//                    label = data[i].label;
//                    x = me.left - 4;
//                    y = data[i]._x; // TODO:
//                    // y = me.transYCoordHorizontal(data[i]._x); // TODO:
//                    me.labelOnY.push(me.drawLabel(x, y, label, 'end'));
//                }
//            }
//            else {
//                for (i = dataLen - 1; i >= 0; i--) { // x 轴
//                    label = data[i].label;
//                    x = data[i]._x;
//                    y = me.bottom + 12 + (opts.slider ? opts.sliderHeight : 0);
//                    me.labelOnX.push(me.drawLabel(x, y, label, 'middle'));
//                }
//                for (i = labelLen - 1; i >= 0; i--) {
//                    label = labelYs[i];
//                    x = me.left - 4;
//                    y = me.transYCoord(labelYs[i]);
//                    me.labelOnY.push(me.drawLabel(x, y, label, 'end'));
//                    if (opts.labelYLine) { // 是否需要横向的辅助线
//                        me.drawYLine('M'+ me.left +','+ y +'H'+ me.right );
//                    }
//                }
//            }
//        },
//
//        /**
//         * 实际绘制label的函数
//         * @param  {[type]} xPos   [description]
//         * @param  {[type]} yPos   [description]
//         * @param  {[type]} text   [description]
//         * @param  {[type]} anchor [description]
//         * @return {[type]}        [description]
//         */
//        drawLabel: function(xPos, yPos, text, anchor) {
//            var me = this,
//                opts = me.options,
//                txt, arr,
//                labelLen = opts.xLabelLength || 5;
//            if (typeof text === 'string') {
//                text = text.substr(0, labelLen);
//            }
//            else if (typeof text === 'number') {
//                arr = text.toString().split('.');
//                if (arr[0].length > labelLen) {
//                    text = (+arr[0] / 1000).toFixed(2) + 'K';
//                }
//                else if (arr.length > 1) {
//                    if (arr[0].length + 3 < labelLen) {
//                        text.toFixed(2);
//                    }
//                    else if (arr[0].length + 2 < labelLen) {
//                        text.toFixed(1);
//                    }
//                }
//                else {
//                    text = text;
//                }
//            }
//            txt = me.raphael.text(xPos, yPos, text).attr({
//                'font-size':    opts.labelFontSize,
//                'font-family':  opts.labelFontFamily,
//                'font-weight':  opts.labelFontWeight,
//                'fill':         opts.labelFontColor,
//                'text-anchor':  anchor || opts.labelAnchor
//            });
//
//            // refer to:
//            // rendered Paper.text() incorrectly y-positioned on hidden papers
//            // https://github.com/DmitryBaranovskiy/raphael/issues/491
//            // paper.text(x,y,text) creates <tspan> element with "doubled" dy value.
//            // https://github.com/DmitryBaranovskiy/raphael/issues/772
//            $('tspan', txt.node).attr('dy', 4);
//            return txt;
//        },
//
//        /**
//         * 绘制y轴的水平网格线，网格线和label对应
//         * @return {[type]} [description]
//         */
//        drawYLine: function(path) {
//            return this.raphael.path(path).attr({
//                'stroke': this.options.gridLineColor,
//                'stroke-width': this.options.gridStrokeWidth
//            });
//        },
//
//        /**
//         * 绘制坐标系网格
//         * @return {[type]} [description]
//         */
//        drawGrid: function() {
//            var me = this,
//                opts = this.options;
//
//            // return when grid is set to false
//            if (!opts.grid) { return; }
//
//            var grid = me.grid,
//                l = grid.length - 1,
//                lineY,
//                y,
//                results = [];
//            // 画y轴label和横向网格线
//            for (; l >= 0; l--) {
//                lineY = grid[l];
//                y = me.transYCoord(lineY);
//                me.drawLabel(me.left - opts.padding / 2, y, me.yLabelFormat(lineY), 'end');
//                results.push(me.drawGridLine('M' + me.left + ',' + y + 'H' + (me.left + me.width)));
//
//            }
//            // console.log('dfsfsdfs');
//            var data = me.data,
//                len = data.length -1,
//                coordinateY = me.bottom + opts.xLabelHeight * 3 / 4;
//            //画x轴label
//            for (; len >= 0; len--) {
//                me.drawLabel(data[len]._x, coordinateY, data[len].label.substr(0, opts.labelLength || 5), 'middle');
//            }
//
//            return results;
//        },
//
//        yLabelFormat: function(label) {
//            if (typeof this.options.yLabelFormat === 'function') {
//                return this.options.yLabelFormat(label);
//            } else {
//                return label;
//            }
//        },
//
//
//
//        // 绘制grid的网格
//        drawGridLine: function(path) {
//            return this.raphael.path(path).attr({
//                'stroke': this.options.gridLineColor,
//                'stroke-width': this.options.gridStrokeWidth
//            });
//        }
//    };
//
//    window.Mix.Grid = Grid;
//
//})(window.jQuery, window.Raphael);

/**
 *
 * @authors Wangfei (wangfei.f2e@gmail.com; QQ: 941721234)
 * @date    2014-03-13 13:29:23
 * @version 1.0.0
 *
 * 这个对象主要用来初始化数据，以及计算坐标网格（x轴和y轴）
 */

(function($, R){
    'use strict';
    var graphOpts = {
        // element: 'id', // 作为画布的容器，可以传入元素的id，也可以传入dom
        charts: 'line', //['line', 'bar'], // 图表需要的类型，可以有如下配置方式 'line', ['line', ...], [{type: 'line'}, ...],
        padding: 20, // 画布边缘和图表之间的空隙
        ymax: 'auto', // 纵坐标的最大值
        ymin: 'auto 0', // 纵坐标的最小值
        hasbar: false, // 是否存在柱形图
        horizontal: false, // 是否水平图表，目前不支持折线图
        gutter: 20, // 柱形图，俩柱子间的距离
        gap: 4, // 多维柱形图，同一标签为止，柱子间距离
        ylabels: 5, // 纵轴label数量
        /**
         * 用来配置tiptool的显示内容
         * @param  {[DOM]} el   [用来显示信息的容器（div元素）]
         * @param  {[Object]} data [包含该店的数据对象]
         * @return {[type]}      [description]
         */
        tip: function(el, data) {

        },
        data: { // 用来对数据相关的属性进行配置
            // url: 'testdata.php', // 如果使用远程数据，需要配置url
            // data: 'testdata', // 使用本地静态数据， 当配置url时，data自动被忽略
            xkey: 'x', // xkey的值对应数据中的属性名，并用这一项的值作为横轴的坐标
            ykey: 'y', // ykey的值作为图表的值
            callback: false
            /**
             * 改接口用于slider工具，滑动的时候获取数据
             * @param  {[Object]}   this   [图表实例]
             * @param  {[Number]}   scale  [滑块移过的格数，负左正右]
             * @param  {[Number]}   offset [滑块滑过的像数值，负左正右]
             * @return {[null]}        [description]
             */
            // callback: function(this, scale, offset) {
            //   // some code for data
            //   // this.update(data)
            // },
        },
        axis: { // 用来配置坐标系相关的属性
            orthogonal: { // 是否显示x轴和y轴，如果配置为false则不显示，默认不显示，orthogonal属性的值会直接作为x轴和y轴的attr
                'stroke': '#08f',
                'stroke-width': 1,
                'arrow-end': 'block-wide-long'
            },
            grid: { // 用来配置网格线
                latitude: false, // 水平线 默认false
                longitude: false, // 竖直线 默认false
                attr: { // 水平线和竖直线的属性
                    'stroke-width': 0.5,
                    'stroke': '#08f'
                }
            },
            slider: { // 是否具有滑块
                use: false, // 是否启用
                height: 30, //滑块的高度
                trackColor: '#115366', // 滑块轨道颜色
                blockColor: '#009999' // 滑块的颜色
            },
            segment: {
                use: false,
                height: 50,
                data: '',
                trackColor: '#115366',
                handleColor: '#099',
                handlerColor: '#f60',
                arrowColor: '#009999',
                trackHeight: 10,
                trackLimit: [0, 15],
                limit: [6, 12],
                callback: false,
                /**
                 * 滑块拖动后用于获取数据，刷新图表的接口
                 * @param  {[Object]}   graph [图表实例索引]
                 * @param  {[Array]}   limit [刷新后的seg.limit配置项]
                 * @return {Function}       [description]
                 */
                // callback: function(graph, limit) {
                //   var data = [data25[0].slice(limit[0], limit[1])];
                //   graph.update(data);
                // },
                /**
                 * 格式化滑块下方的标签格式
                 * @param  {[type]} text [description]
                 * @return {[type]}      [description]
                 */
                labelFormat: function(text) {
                    return text;
                }
            },
            islabel:true,
            label: { // x轴和y轴上坐标点文字相关配置项
                x: true, // 横轴上是否显示label 默认true
                y: true, // 纵轴上是否显示label 默认true
                xHeight: 10, // 给x轴下方预留的高度 （会和padding累加）
                yWidth: 20, // 给y轴左边预留的宽度 （会和padding累加）
                xLabelFormat: false, // x轴label格式化函数 默认false
                yLabelFormat: false, // y轴label格式化函数 默认false
                // urlBase: 'http://www.baidu.com',
                urlkey: '',
                attr: { // 坐标点文字的属性
                    'fill': '#fff',
                    'font-family': 'serif',
                    'font-size': 12,
                    'font-weight': 'normal',
                    'title': '' // values: string
                }
            }
        }
    };
    function init() {
        var me = this;
        charts(me);
        clacBox(me);
        calcExtremum(me);
        calcGap(me);
        me.draw();
    }
    /**
     * 处理charts配置项，对相应的type进行初始化，
     * 实际处理过程通过调用_charts()来完成
     * @param  {[Object]} scope [this]
     * @return {[Object]}       [this]
     */
    function charts(scope) {
        var me = scope, opts = me.opts;
        me.charts = [];
        // 初始化charts配置项
        _charts(me, opts.charts);

        return me;
    }
    function _charts(scope, chart) {
        var me = scope, opts = me.opts, type;
        if (typeof chart === 'string') {
            if (chart === 'bar') {
                me.hasbar = true;
            }
            me.charts.push(Mix[chart](opts));
        }
        else if (Object.prototype.toString.call(chart).slice(8,14) === 'Object') {
            type = chart.type;
            if (type === 'bar') {
                me.hasbar = true;
            }
            delete chart.type;
            if (type) {
                me.charts.push(Mix[type](chart));
            }
        }
        else if (Object.prototype.toString.call(chart).slice(8,13) === 'Array') {
            for (var i = 0, len = opts.charts.length; i < len; i++) {
                _charts(me, chart[i]);
            }
        }
    }
    /**
     * 计算画布上坐标轴占据的坐标信息，放在me.box
     * @param  {[Object]} scope [this]
     * @return {[Object]}       [this]
     */
    function clacBox(scope) {
        var me = scope, opts = me.opts,
            w = opts.width,
            h = opts.height,
            pd = opts.padding,
            label = opts.axis.label,
            ext = me.extremum,
            axis = opts.axis,
            box = me.box = {};

        box.top = pd;
        box.top = (axis.yAxis && axis.yAxis.name) ? box.top + 20 : box.top;
        box.right = w - pd;
        if(axis.xAxis && axis.xAxis.name) {
        	var xName = me.paper.text(0, 0, axis.xAxis.name)
        					.attr({
				        		'font-size': 14,
				        		'fill': '#fff',
				        		'text-anchor': 'start'
				        	});
        	box.right = box.right - xName.getBBox().width;
        	xName.remove();
        }
        box.bottom = h - pd - label.xHeight;
        box.bottom = axis.slider.use ? box.bottom - axis.slider.height : box.bottom;
        box.bottom = axis.segment.use ? box.bottom - axis.segment.height : box.bottom;
        box.left = pd + label.yWidth;
        box.width = box.right - box.left;
        box.height = box.bottom - box.top;

        return me;
    }
    /**
     * 根据data计算出了包含横轴和纵轴坐标的grid，
     * 以及包含xmin，xmax，ymin，ymax的extremum
     * grid和extremum都赋值在this上
     * @param {[Array]} data  [数据数组]
     * @return {[Object]} [返回this]
     */
    function calcExtremum(scope) {
        var me = scope, opts = me.opts,
            data = opts.data.data, ymin, ymax;
        if (!data || data.length === 0) {
            data = [];
            return;
        }

        var
            len = data.length,
            len2, j, len3, len4,
            i = len -1,
            ykey = opts.data.ykey,
            xkey = opts.data.xkey,
            yval;
        function plus(a, b) {
            return a + b;
        }
        for (; i >= 0; i--){
            len2 = data[i].length;
            if (len3) {
                if (len3 < len2) {
                    len3 = len2;
                    // me.opts.data.labels = data[i];
                    // me.opts.data.labels=[];
                }
            }
            else {
                len3 = len2;
                // me.opts.data.labels = data[i];
                // me.opts.data.labels=[];
            }
            j = len2 - 1;
            for (; j >= 0; j--) {
                yval = data[i][j][ykey];
                if (R.is(yval, 'array')) {
                    yval = yval.reduce(plus);
                }
                if (!R.is(yval, 'number')) {
                    console.log('请制定正确的ykey');
                }

                if (ymax) {
                    ymax = Math.max(yval, ymax);
                    ymin = Math.min(yval, ymin);
                }
                else {
                    ymax = ymin = yval;
                }
            }
        }
        opts.step=Math.ceil(opts.element.offsetWidth/55);
        me.opts.data.labels=function(){//计算 x轴的 所有显示数据
            var d=[];
            for(var i=0;i<len;i++){
                d=d.concat(_.pluck(data[i],xkey));
            }
            
            if(!me.hasbar) { // 线图，对x轴做了排序
            	return _.uniq(d).sort();
            }
            
            return _.uniq(d);
        }();

        if(opts.step<opts.data.labels.length){
            //me.opts.data.labels.length=0;
        }
        // console.log('----------------------------');
        // console.log(data);
        // console.log(me.opts.data.labels);
        // console.log('----------------------------');
        me.data = data;

        var ext = me.extremum = {};
        ext.xmin = 1;
        ext.xmax = len3;

        ext.ymin = calcBoundary(opts.ymin, 'min', ymin);
        ext.ymax = calcBoundary(opts.ymax, 'max', ymax);
        calcGrid(me, len3);

        ext.ymin = Math.min(ext.ymin, me.grid.y[0]);
        ext.ymax = Math.max(ext.ymax, me.grid.y[me.grid.y.length - 1]);

        return me;
    }
    /**
     * 计算纵轴的边界值，即最大值活最小值
     * @param  {[type]} opts  [配置对象中ymin，ymax的值]
     * @param  {[type]} type  [求值类型：min || max]
     * @param  {[type]} value [传入的值，会和求出的值进行比较]
     * @return {[type]}       [最大或最小值]
     */
    function calcBoundary(boundaray, type, value) {
        var suggestValue;
        if (boundaray.slice(0, 4) === 'auto') {
            if (boundaray.length > 5) {
                suggestValue = parseInt(boundaray.slice(5), 10);
                if (!value) {
                    return suggestValue;
                }
                return Math[type](value, suggestValue);
            }
            else {
                if (value) {
                    return value;
                }
                else {
                    return 0;
                }
            }
        }
        else {
            return parseInt(boundaray, 10);
        }
    }
    function calcGrid(scope, xlables) {
        var me = scope,
            opts = me.opts,
            ext = me.extremum,
            xgrid = [], ygrid,
            gutter, barwidth, bar;



        gutter = opts.gutter;
        barwidth = (opts.horizontal ? me.box.height : me.box.width) / xlables - gutter;
        bar = gutter + barwidth;
        for (var j = 0; j < xlables; j++) {
            xgrid.push((1/2 + j) * bar);
        }
        me.box.barwidth = barwidth;
		// 柱子宽度不超过整个轴宽度的十分之一
	    var maxWidth = (opts.horizontal ? me.box.height : me.box.width) / 10;
        if(barwidth > maxWidth * me.data.length) {
	    	me.box.barwidth = (maxWidth-5) * me.data.length;
	    }

        ygrid = _calcGrid(ext.ymin, ext.ymax, opts.ylabels);

        me.grid = {
            x: xgrid,
            y: ygrid
        };
    }
    /**
     * 根据最大最小值，以及需要分割的分数，计算均分网格
     * @param  {[Number]} min      [最小值]
     * @param  {[Number]} max      [最大值]
     * @param  {[Number]} quantity [均分份数]
     * @return {[Arrauy]}          [网格数组]
     */
    function _calcGrid(min, max, quantity) {
        var gmax, gmin, grid, smag, span, step, unit, y, ymag;
        
        if(max == 0) 
        	return [0];
        
        span = max - min;
        ymag = Math.floor(Math.log(span) / Math.log(10));
        unit = Math.pow(10, ymag);
        gmin = Math.floor(min / unit) * unit;
        gmax = Math.ceil(max / unit) * unit;
        step = (gmax - gmin) / (quantity - 1);
        // console.log('step:'+step);
        if (unit === 1 && step > 1 && Math.ceil(step) !== step) {
            step = Math.ceil(step);
            gmax = gmin + step * (quantity - 1);
        }
        if (gmin < 0 && gmax > 0) {
            gmin = Math.floor(min / step) * step;
            gmax = Math.ceil(max / step) * step;
        }
        if (step < 1) {
            smag = Math.floor(Math.log(step) / Math.log(10));
            grid = (function() {
                var _i, _results;
                _results = [];
                for (y = _i = gmin; step > 0 ? _i <= gmax : _i >= gmax; y = _i += step) {
                    _results.push(parseFloat(y.toFixed(1 - smag)));
                }
                return _results;
            })();
        } else {
            grid = (function() {
                var _i, _results;
                _results = [];
                for (y = _i = gmin; step > 0 ? _i <= gmax : _i >= gmax; y = _i += step) {
                    _results.push(y);
                }
                return _results;
            })();
        }
        return grid;
    }
    /**
     * 计算每个数据点对应的像素值
     * @param  {[Object]} scope [this]
     * @return {[Object]}       [this]
     */
    function calcGap(scope) {
        var me = scope, opts = me.opts, box = me.box, ext = me.extremum;
        if (opts.horizontal) {
            box.dx = box.height / (ext.xmax - ext.xmin); // 每个间隔对应的宽度
            box.dy = box.width / (ext.ymax - ext.ymin);
        }
        else {
            box.dx = box.width / (ext.xmax - ext.xmin);
            box.dy = box.height / (ext.ymax - ext.ymin);
        }
        return me;
    }
    function draw() {
        var me = this, opts = me.opts, axis = opts.axis;
        if (axis.orthogonal) {
            drawAxis(me);
        }

        if (axis.islabel) {
            drawLabels(me);
        }

        if (axis.grid.longitude) {
            drawLongitude(me);
        }

        if (axis.grid.latitude) {
            drawLatitude(me);
        }

        var charts = me.charts, chartLen = charts.length;
        for (--chartLen; chartLen >= 0; chartLen--) {
            charts[chartLen].draw(me);
        }
        if (me.graphs.lines) {
            me.graphs.lines.toFront();
            me.graphs.dots.toFront();
        }

        if (axis.slider.use) {
            drawSlider(me);
        }

        if (axis.segment.use && axis.segment.data.length) {
            drawSegment(me);
        }
    }
    function update(data,segData,len,temp){
        // console.log('--------------');
        var me = this;
        if(len){
            me.opts.axis.segment.trackLimit=[0,len];
            me.opts.axis.segment.limit=temp||[0,len-1];
            //          console.log(me.opts.axis.segment);
        }
        var opts = me.opts, axis = opts.axis;
        if (!R.is(data[0], 'array')) {
            data = [data];
        }
        opts.data.data = data;
        if(opts.axis.segment){
            opts.axis.segment.data=segData||opts.axis.segment.data;
        }
        var xkey=opts.data.xkey;
        //      opts.step=Math.ceil(opts.element.offsetWidth/55);
        //    opts.data.labels =function(){//计算 x轴的 所有显示数据
        //      var d=[];
        //      for(var i=0;i<data.length;i++){
        //        d=d.concat(_.pluck(data[i],xkey));
        //      }
        //      return _.uniq(d);
        //    }();
        //    if(opts.step<opts.data.labels.length){
        //        me.opts.data.labels.length=0;
        //    }

        me.graphs = {};
        me.paper.clear();
        calcExtremum(me);
        //      console.log(me.opts.data.labels);
        calcGap(me);
        me.draw();
    }
    function setOption(opts) {
    	var me = this;
    	me.opts = $.extend(true, me.opts||{}, graphOpts, opts || {});
    }
    /**
     * 绘制横轴和纵轴
     * @param  {[Object]} scope [this]
     * @return {[Object]}       [this]
     */
    function drawAxis(scope) {
        var me = scope, opts = me.opts, box = me.box, axis = opts.axis,
            pathV = [
                'M', box.left, ',', box.bottom,
                'V', box.top - opts.padding / 2
            ].join(''),
            pathH = [
                'M', box.left, ',', box.bottom,
                'H', box.right + opts.padding / 2
            ].join('');

        me.axis = me.paper.set(me.paper.path(pathV), me.paper.path(pathH));
        me.axis.attr(axis.orthogonal);

        if(axis.yAxis && axis.yAxis.name) {
        	var yName = me.paper.text(box.left, (box.top - opts.padding / 2 - 15), axis.yAxis.name);
        	yName.attr({
        		'font-size': 14,
        		'fill': '#fff'
        	});
        }
        if(axis.xAxis && axis.xAxis.name) {
			me.paper.text((box.right + opts.padding / 2 + 10), box.bottom, axis.xAxis.name)
		        	.attr({
		        		'font-size': 14,
		        		'fill': '#fff',
		        		'text-anchor': 'start'
		        	});
        }
        
        return me;
    }
    function drawLabels(scope) {
        var me = scope, opts = me.opts, label = opts.axis.label,
            labelX = me.paper.set(),
            labelY = me.paper.set(),
            labels = opts.data.labels,
            len = labels.length, // x label's count
            ygrid = me.grid.y,
            len2 = ygrid.length, // y label's count
            xgrid = me.grid.x,
            len3 = xgrid.length, theLabel,
            i, x, y, text,_text,_offset; // me.hasbar = true,
        /*if(opts.step<len){
            len=0;
        }else{
           // len=opts.step;
        }*/
        // console.log(opts.data);
        if(xgrid.length>1) _offset=parseInt(xgrid[1]-xgrid[0]);
        me.graphs.labelX = labelX;
        me.graphs.labelY = labelY;
        if (label.x) { // x axis
            if (opts.horizontal) {
                if (me.hasbar) {
                    for (i = 0; i < len3; i++) {
                        x = me.box.left - 5;
                        y =  xgrid[i] + me.box.top;
                        text = label.xLabelFormat ? label.xLabelFormat(labels[i]) : labels[i];
                        _text=text;
                        text=function(){
                            text=text.toString();
                            if(text){
                                var len=text.len(),off=Math.abs(x||0-len*12);
                                return text.cut(Math.ceil(off/9));
                            }
                            return '';
                        }();
                        theLabel = drawLabel(me, x, y, text, 'end',_text);
                        if (label.urlBase) {
                            theLabel.attr({
                                'href': label.urlFormat?label.urlFormat(me.data[0][i],label.urlBase):label.urlBase
                            });
                        }
                        labelX.push(theLabel);
                    }
                }else {
                    for (i = 0; i < len; i++) {
                        x = me.box.left - 5;
                        if(len==1)
                            y=me.box.top;
                        else
                            y =  me.box.height / (len - 1) * i + me.box.top;
                        text = label.xLabelFormat ? label.xLabelFormat(labels[i]) : labels[i];
                        theLabel = drawLabel(me, x, y, text, 'end');
                        if (label.urlBase) {
                            theLabel.attr({
                                'href': label.urlFormat?label.urlFormat(me.data[0][i],label.urlBase):label.urlBase
                            });
                        }
                        labelX.push(theLabel);
                    }
                }
            }else {
                if (me.hasbar) {

                    for (i = 0; i < len3; i++) {
                        x = xgrid[i] + me.box.left;
                        y = me.box.bottom + 12 + (opts.axis.slider.use ? opts.axis.slider.height : 0);
                        // console.log(labels);
                        text = label.xLabelFormat ? label.xLabelFormat(labels[i]) : labels[i];
                        _text=text;
                        text=function(){
                            text=text.toString();
                            if(text){
                                var len=text.len(),off=Math.abs(_offset||0-len*12);
                                return text.cut(Math.ceil(off/9));
                            }
                            return '';
                        }();
                        theLabel = drawLabel(me, x, y, text, 'middle',_text);
                        if (label.urlBase) {
                            theLabel.attr({
                                'href': label.urlFormat?label.urlFormat(me.data[0][i],label.urlBase):label.urlBase
                            });
                        }
                        labelX.push(theLabel);
                    }
                }
                else {

                    for (i = 0; i < len; i++) {
                        if(len==1)
                            x=me.box.left;
                        else
                            x = me.box.width/(len - 1) * i + me.box.left;
                        y = me.box.bottom + 12 + (opts.axis.slider.use ? opts.axis.slider.height : 0);
                        text = label.xLabelFormat ? label.xLabelFormat(labels[i]) : labels[i];

                        theLabel = drawLabel(me, x, y, text, 'middle');
                        if (label.urlBase) {
                            theLabel.attr({
                                'href': label.urlFormat?label.urlFormat(me.data[0][i],label.urlBase):label.urlBase
                            });
                        }

                        labelX.push(theLabel);
                        
                        // 处理第一个、最后一个label显示不全
                        if(i == 0 && theLabel.getBBox().x < me.box.left) {
                        	theLabel.attr({'x':10, 'text-anchor':'start'});
                        }else if(i == len-1 && theLabel.getBBox().x2 > me.box.right) {
                        	theLabel.attr({'x':opts.width-10, 'text-anchor':'end'});
                        }
                    }
                    
	                // x轴数据过多时，部分显示
	                var lastshow;
	                var lastLabel = labelX.pop();
	                labelX.forEach(function(label) {
	                	if(!lastshow) {
	                		lastshow = label;
	                	}else {
	                		if(lastshow.getBBox().x2 + 30 > label.getBBox().x || label.getBBox().x2 + 30 > lastLabel.getBBox().x) {
	                			label.hide();
	                		}else {
	                			lastshow = label;
	                		}
	                	}
	                	return true;
	                });
	                labelX.push(lastLabel);
                }
            }
        }
        if (label.y) {
            if (opts.horizontal) {
                for (i = 0; i < len2; i++) {
                    if(len2==1)
                        x=me.box.left;
                    else
                        x = me.box.left + me.box.width / (len2 - 1) * i;
                    y = me.box.bottom + 12 + (opts.axis.slider.use ? opts.axis.slider.height : 0);

                    text = label.yLabelFormat ? label.yLabelFormat(ygrid[i]) : ygrid[i];
                    labelY.push(drawLabel(me, x, y, text, 'middle'));
                }
            }
            else {
                for (i = 0; i < len2; i++) {
                    x = me.box.left - 5;
                    if(len2==1)
                        y=me.box.bottom;
                    else
                        y = me.box.bottom - me.box.height / (len2 - 1) * i;
                    text = label.yLabelFormat ? label.yLabelFormat(ygrid[i]) : ygrid[i];

                    labelY.push(drawLabel(me, x, y, text, 'end'));
                }
            }
        }
    }
    function drawLabel(scope, x, y, text, anchor,_text) {
        var me = scope, opts = me.opts, txt;
        txt = me.paper.text(x, y, text).attr($.extend({}, opts.axis.label.attr, {'text-anchor': anchor,'title':_text||text}));
		
//		txt.data('isShow', true);
//        var l = scope.graphs.labelX.pop();
//        if(l && l.data('isShow')) {
//	        scope.graphs.labelX.push(l);
//	        if(l.getBBox().x2 + 30 > txt.getBBox().x) {
//	        	txt.hide();
//	        	txt.data('isShow', false);
//	        }
//        }
        
        // refer to:
        // rendered Paper.text() incorrectly y-positioned on hidden papers
        // https://github.com/DmitryBaranovskiy/raphael/issues/491
        // paper.text(x,y,text) creates <tspan> element with "doubled" dy value.
        // https://github.com/DmitryBaranovskiy/raphael/issues/772
        $('tspan', txt.node).attr('dy', 4);
        return txt;
    }
    function drawLatitude(scope) {
        var me = scope,  opts = me.opts,
            num = opts.axis.grid.latitude,
            i = num,
            path;
        me.latitudes = me.paper.set();
        for (; i >= 0; i--) {
            path = ['M', me.box.left, ',', me.box.bottom - me.box.height / num * i, 'H', me.box.right].join();
            me.latitudes.push(me.paper.path(path).attr(opts.axis.grid.attr));
        }
        return me;
    }
    function drawLongitude(scope) {
        var me = scope,  opts = me.opts,
            num = opts.axis.grid.longitude,
            i = num-1,
            path;

        me.longitudes = me.paper.set();
        for (; i >=0; i--) {
            path = ['M', me.box.left + (me.box.width / num * (i+1)), me.box.top, 'V', me.box.bottom].join();
            me.longitudes.push(me.paper.path(path).attr(opts.axis.grid.attr));
        }

        return me;
    }
    function drawSlider(scope) {
        var me = scope, opts = me.opts, box = me.box, axis = opts.axis,
            track, slider, move = false, offsetLeft,
            active = {
                'fill': axis.slider.blockColor,
                'stroke-width': 0,
                'cursor': 'move'
            },
            inactive = {
                'fill': axis.slider.trackColor,
                'stroke-width': 0,
                'corsor': 'auto'
            };

        track = me.paper.rect(box.left, box.bottom + 4, box.width, axis.slider.height)
            .attr(inactive);
        slider = me.paper.rect(box.left, box.bottom + 4, box.width, axis.slider.height)
            .attr(inactive);
        slider.hover(function() {
            slider.attr(active);
        }, function() {
            if  (!move) {
                slider.attr(inactive);
            }
        });
        slider.drag(function(dx) {
            var x, w;
            if (dx > 0) {
                x = box.left + dx;
                w = box.width - dx;
                w = w >= 0 ? w : 0;
            }
            else {
                x = box.left;
                w = box.width + dx;
                w = w >= 0 ? w : 0;
            }

            slider.attr({
                'x': x,
                'width': w
            });
            offsetLeft = dx;
        }, function() {
            move = true; // 标记拖动开始
        }, function() {
            var data = opts.data, i, len,
                scale = Math.round(Math.abs(offsetLeft) / me.box.dx); // 移动的点个数
            move = false;
            scale = isNaN(scale) ? 0 : scale;
            scale = offsetLeft > 0 ? scale : -scale;

            data.callback(me, scale, offsetLeft);
        });
    }
    function drawSegment(scope) {
        var me = scope, opts = me.opts, box = me.box, axis = opts.axis,
            seg = axis.segment, track, handleLeft, handleRight, handler,
            arrowLeft, arrowRight, x1, y1, x2, y2, x, y, text, path,
            len = seg.trackLimit[1] - seg.trackLimit[0], move = false,
            slider = me.paper.set(),
            unitW = (box.width - 50) / (Math.abs(len - 1) || 0.1);

        if(opts.step<len){
            len=0;
        //  unitW=(box.width - 50)/opts.step;
        }else{
            len=opts.step;
        }

        x1 = box.left + (seg.limit[0] - seg.trackLimit[0]) * unitW + 25;
        y1 = box.bottom + axis.label.xHeight + 15;
        x2 = box.left + (seg.limit[1] - seg.trackLimit[0]) * unitW + 25;
        y2 = y1 - 5;

        track = me.paper.rect(box.left + 25, y1, box.width - 50, seg.trackHeight)
            .attr({'fill': seg.trackColor, 'stroke-width': 0});
        handler = me.paper.rect(x1, y1, x2 - x1, seg.trackHeight).attr({
            'fill': seg.handlerColor,
            'stroke-width': 0
        });
        handleLeft = me.paper.rect(x1 - 8, y2, 16, 20).attr({
            'fill': seg.handleColor,
            'stroke-width': 0
        });
        handleRight = me.paper.rect(x2 - 8, y2, 16, 20).attr({
            'fill': seg.handleColor,
            'stroke-width': 0
        });

        slider.push(handler, handleLeft, handleRight);

        var hlX = handleLeft.attrs.x,
            hX = handler.attrs.x, hW = handler.attrs.width,
            hrX = handleRight.attrs.x,
            scale, offset;

        handleLeft.drag(function(dx) {
            var el = this, x, w;
            scale = Math.round(Math.abs(dx) / unitW);
            offset = dx;

            if (scale > 0) {
                scale = dx > 0 ? scale : -scale;
                x = hlX + scale * unitW;
                w = hW - scale * unitW;
                if (x <= box.left + 17) {
                    x = box.left + 17;
                    w = hW  + hlX - x;
                    scale = -Math.round((hlX - x) / unitW);
                }
                if (hrX - x <= unitW) {
                    x = hrX - unitW;
                    w = unitW;
                    scale = Math.round((x - hlX) / unitW);
                }
                el.attr({
                    'x': x
                });
                handler.attr({
                    'x': x,
                    'width': w
                });
            }
        }, function() {
            move = true;
            scale = 0;
            offset = 0;
            hlX = handleLeft.attrs.x;
            hW = handler.attrs.width;
        }, function(event) {
            var el = this;
            move = false;
            seg.limit[0] = seg.limit[0] + scale;
            seg.callback(me, [seg.limit[0], seg.limit[1] + 1]);
        });

        handleRight.drag(function(dx) {
            var el = this, x, w;
            scale = Math.round(Math.abs(dx) / unitW);
            offset = dx;

            if (scale > 0) {
                scale = dx > 0 ? scale : -scale;
                x = hrX + scale * unitW;
                w = hW + scale * unitW;
                if (x >= box.right - 33) {
                    x = box.right - 33;
                    w = hW  + x - hrX;
                    scale = Math.round((x - hrX) / unitW);
                }
                if (x - hlX <= unitW) {
                    x = hlX + unitW;
                    w = unitW;
                    scale = -Math.round((hrX - x) / unitW);
                }
                el.attr({
                    'x': x
                });
                handler.attr({
                    'width': w
                });
            }
        }, function() {
            move = true;
            scale = 0;
            offset = 0;
            hrX = handleRight.attrs.x;
            hW = handler.attrs.width;
        }, function(event) {
            var el = this;
            move = false;
            seg.limit[1] = seg.limit[1] + scale;
            seg.callback(me, [seg.limit[0], seg.limit[1] + 1]);
        });
        //Element.drag(onmove, onstart, onend, [mcontext], [scontext], [econtext])
        handler.drag(function(dx) {
            var el = this, x1, x2;
            scale = Math.round(Math.abs(dx) / unitW);
            if (scale > 0) {
                scale = dx > 0 ? scale : -scale;
                x1 = hX + scale * unitW;
                x2 = x1 + hW;
                if (x1 <= box.left + 25) {
                    x1 = box.left + 25;
                    x2 = x1 + hW;
                    scale = -Math.round((hX - x1) / unitW);
                }
                if (x2 >= box.right - 25) {
                    x2 = box.right - 25;
                    x1 = x2 - hW;
                    scale = Math.round((x1 - hX) / unitW);
                }
                el.attr({'x': x1});
                handleLeft.attr({'x': x1 - 8});
                handleRight.attr({'x': x2 - 8});
            }
        }, function() {
            move = true;
            scale = 0;
            offset = 0;
            hX = handler.attrs.x;
            hW = handler.attrs.width;
        }, function(event) {
            move = false;
            seg.limit[0] = seg.limit[0] + scale;
            seg.limit[1] = seg.limit[1] + scale;
            seg.callback(me, [seg.limit[0], seg.limit[1] + 1]);
        });

        var segLabels = me.paper.set();
        y = y1 + 28;
        // console.log(len);
        for (var i = 0; i < len; i++) {
            x = box.left + i * unitW + 25;
            text = seg.labelFormat(seg.data[seg.trackLimit[0] + i]);
            segLabels.push(drawLabel(me, x, y, text, 'middle'));
            me.paper.circle(x, y - 10, 2).attr({fill: '#fff'});
        }

        x = box.left;
        y -= 15;
        path = [
            'M', x, ',', y,
            'L', x + 20 /2, ',', y - 20 / 2,
            'L', x + 30 /2, ',', y - 10 / 2,
            'L', x + 10 /2, ',', y + 10 / 2,
            'L', x + 30 /2, ',', y + 30 / 2,
            'L', x + 20 /2, ',', y + 40 / 2,
            'L', x - 10 /2, ',', y + 10 / 2,
            'L', x, ',', y
        ].join('');
        arrowLeft = me.paper.path(path).attr({
            'fill': seg.arrowColor,
            'stroke-width': 0,
            'opacity':0,
            'cursor': 'pointer'
        });

        x = box.right;
        y += 10;
        path = [
            'M', x, ',', y,
            'L', x - 20 /2, ',', y + 20 / 2,
            'L', x - 30 /2, ',', y + 10 / 2,
            'L', x - 10 /2, ',', y - 10 / 2,
            'L', x - 30 /2, ',', y - 30 / 2,
            'L', x - 20 /2, ',', y - 40 / 2,
            'L', x + 10 /2, ',', y - 10 / 2,
            'L', x, ',', y
        ];
        arrowRight = me.paper.path(path).attr({
            'fill': seg.arrowColor,
            'stroke-width': 0,
            'opacity':0,
            'cursor': 'pointer'
        });

        arrowLeft.click(function() {
            var x, y, text;
            if (seg.trackLimit[0] > 0) {
                seg.trackLimit[0] -= 1;
                seg.trackLimit[1] -= 1;

                seg.limit[0] -= 1;
                seg.limit[1] -= 1;
            }
            segLabels.remove();
            segLabels = me.paper.set();
            for (var i = 0; i < len; i++) {
                x = box.left + i * unitW + 25;
                y = y1 + 28;
                text = seg.labelFormat(seg.data[seg.trackLimit[0] + i]);
                segLabels.push(drawLabel(me, x, y, text, 'middle'));
            }
            seg.callback(me, [seg.limit[0], seg.limit[1] + 1]);
        });

        arrowRight.click(function() {
            var x, y, text;
            if (seg.trackLimit[1] < seg.data.length) {
                seg.trackLimit[0] += 1;
                seg.trackLimit[1] += 1;

                seg.limit[0] += 1;
                seg.limit[1] += 1;
            }
            segLabels.remove();
            segLabels = me.paper.set();

            for (var i = 0; i < len; i++) {
                x = box.left + i * unitW + 25;
                y = y1 + 28;
                text = seg.labelFormat(seg.data[seg.trackLimit[0] + i]);
                segLabels.push(drawLabel(me, x, y, text, 'middle'));
            }

            seg.callback(me, [seg.limit[0], seg.limit[1] + 1]);
        });
    }
    function Graph(opts) {
        var me = this;
        opts = me.opts = $.extend(true, {}, graphOpts, opts || {});

        // 通过id或者dom 生成jQuery对象
        me.el = typeof opts.element === 'string' ? $('#'+ opts.element) : $(opts.element);

        opts.width = opts.width || me.el.width()-24;
        opts.height = opts.height || me.el.height();
        me.paper = new R(me.el[0], opts.width, opts.height);

        me.graphs = {}; // 用来存放所有图表的索引，例如：lines, bars

        if (!R.is(opts.data.data[0], 'array')) {
            opts.data.data = [opts.data.data];
        }
        me.init();
    }
    Graph.prototype = {
        constructor: Graph,
        init: init,
        draw: draw,
        setOption:setOption,
        update: update
    };
    Mix.Graph = Graph;
})(jQuery, Raphael);

(function($, R) {

  var lineOpts = {
    stroke: ['#558eff','#9141ba','#d15252','#1a7f4f','#ffcc00'], // 折线图折线的颜色
    strokeWidth: 2 // 折线的线宽
  };

  var line = function(opts) {
    var me = this;
    if (!(me instanceof Mix.line)) {
      return new Mix.line(opts);
    }
    opts = me.opts = $.extend(true, {}, lineOpts, opts || {});
  };
  line.prototype = {
    constructor: line,
    draw: function(g) {
      var me = this, gOpts = g.opts, data = g.data, dataLen = data.length, xgrid = g.grid.x,
        path, i,labels=gOpts.data.labels||[], j, x, y, line, dot, d,
        subbarWidth = (g.box.barwidth - g.opts.gap * (dataLen - 1)) / dataLen;

      g.graphs.lines = g.paper.set();
      g.graphs.dots = g.paper.set();
      // console.log('-------------------------------');
      // console.log(data);
      var _index,
          color,
          xkey=gOpts.data.xkey,
          ykey=gOpts.data.ykey,
          _labels=function(){//计算 x轴的 所有显示数据
            var d=[];
            for(var i=0;i<dataLen;i++){
              d=d.concat(_.pluck(data[i],xkey));
            }
            return _.uniq(d).sort();
          }(),
          l=_labels.length,
          unitW=g.box.width / (l - 1);//计算x轴之间的跨度
        //       console.log('dataLen:'+dataLen);
        //       console.log(_labels);
      for (j=0;j<dataLen;j++) {
        color=(typeof me.opts.stroke ==='string' ? me.opts.stroke : me.opts.stroke[j] || me.opts.stroke[0]);
        path = [];

        for (i = 0; i < l; i++){
          d = data[j][i];
          if (!d) continue;
          _index=_.indexOf(_labels,d[xkey]);

          x = g.hasbar ? xgrid[i] + g.box.left - g.box.barwidth / 2 
              + subbarWidth / 2  + (subbarWidth + g.opts.gap) * j : x = _index * unitW + g.box.left;
          x=x||g.box.left;//修改于2014-4-15 by Marshane

          y = g.box.bottom - ((d[ykey] * g.box.dy)||0);
          path.push(i ? 'L' : 'M', x, ',', y);
          
          dot = me.drawDot(g.paper, x ,y,color);

          g.graphs.dots.push(dot);
          if (gOpts.tip) {
            dot.hover(function(dot) {
              var dd = data[j][i];
              return function() {
                  dot.animate(Raphael.animation({r: 8}, 25, 'linear'));
        //                  dot.toFront();
                if(!me.tipElem){
                  me.tipElem=$('<div class="amchart-line-hover"><div>');
                  g.el.append(me.tipElem);
                }
                gOpts.tip(me.tipElem, dd,dot.attr('cx'),dot.attr('cy'));
              };
            }(dot), function(dot) {
                return function(){
                    if(me.tipElem){
                        me.tipElem.hide();
                    }
                    dot.animate(Raphael.animation({
                        r:4
                    }, 25, 'linear'));
                }
            }(dot));
          }
        }
        line = g.paper.path(path.join('')).attr({
          'stroke': color,
          'stroke-width': me.opts.strokeWidth
        });
        g.graphs.lines.push(line);
      }
    },

    drawDot: function(paper, x, y,color) {
      var me = this;
      return paper.circle(x, y, 4).attr({
        'fill':color,
        'stroke':'#fff',
        'stroke-width':1
      });
    }
  };

  Mix.line = line;

  var barOpts = {
    // 柱形图柱子的颜色
    //      stepColors:['#558eff','#9141ba','#d15252','#1a7f4f','#ffcc00']

    stepColors: ['#085bc1','#33cccc','#205ca5','#00bae9','#3bfaef','#d15252','#067cf5',
        '#558eff','#6dabde','#108178','#0ca99c','#1cc3b6']
  };

  var bar = function(opts) {
    var me = this;

    if (!(me instanceof Mix.bar)) {
      return new Mix.bar(opts);
    }
    opts = me.opts = $.extend(true, {}, barOpts, opts || {});
  };

  bar.prototype = {
    constructor: bar,

    draw: function(g) {
      var me = this, gOpts = g.opts, data = g.data, dataLen = data.length,
      xgrid = g.grid.x,
      rect, i, l = gOpts.data.labels.length, j, x, y, w, h, bar, bars, yval, k, xPos, yPos, totalVal, barData
      subbarWidth = (g.box.barwidth - g.opts.gap * (dataLen - 1)) / dataLen;

      g.graphs.bars = g.paper.set();
      for (j = dataLen - 1; j >= 0; j--) {
        for (i = 0; i < l; i++) {
          totalVal = 0;
          if (gOpts.horizontal) {
            if (!data[j][i]) continue;
            yval = data[j][i][gOpts.data.ykey];
            barData = data[j][i];

            if (R.is(yval, 'array')) {
              xPos = 0;
              y = xgrid[i] + g.box.top - g.box.barwidth / 2  + (subbarWidth + g.opts.gap) * j;
              h = subbarWidth;

              for (k = 0; k < yval.length; k++) {
              	totalVal += yval[k];
                w = yval[k] * g.box.dy;
                xPos += w;
                x = g.box.left + xPos - w;
                bar = g.paper.rect(x, y, w, h).attr({
                  'fill': me.opts.stepColors[k],
                  'stroke-width': 0 
                });
                
                bar.data('yval', yval);
                bar.data('barData', barData);
                g.graphs.bars.push(bar);
              }
//              if(totalVal > 0) {
//              	g.paper.text(x+w+5, y+h/2, totalVal).attr('fill', '#fff').attr('text-anchor', 'start');
//              }
            }
            else {
              x = g.box.left;
              y = xgrid[i] + g.box.top - g.box.barwidth / 2  + (subbarWidth + g.opts.gap) * j;
              w = yval * g.box.dy;
              h = subbarWidth;
              bar = g.paper.rect(x, y, w, h).attr({
                'fill': me.opts.stepColors[dataLen === 1 ? i : j],
                'stroke-width': 0 
              });
              
//              if(yval > 0) {
//              	g.paper.text(x+w, y, yval).attr('fill', '#fff').attr('text-anchor', 'start');
//              }
              
              bar.data('yval', yval);
              bar.data('barData', barData);
              g.graphs.bars.push(bar);
            }
          }
          else {
            if (!data[j][i]) continue;
            yval = data[j][i][gOpts.data.ykey];
            barData = data[j][i];

            if (R.is(yval, 'array')) {
              yPos = 0;
              x = xgrid[i] + g.box.left - g.box.barwidth / 2 + (subbarWidth + g.opts.gap) * j;
              w = subbarWidth;
              for (k = 0; k < yval.length; k++) {
              	totalVal += yval[k];
                yPos += yval[k] * g.box.dy;
                y = g.box.bottom - yPos;
                h = Math.ceil(yval[k] * g.box.dy);
                if(gOpts.abreast){
                    
                    bar = g.paper.rect(x, y, w, h).attr({
                      'fill': me.opts.stepColors[j],
                      'stroke-width': 0,
                      'stroke': me.opts.stepColors[j]
                    });
                }else{
                    bar = g.paper.rect(x, y, w, h).attr({
                      'fill': me.opts.stepColors[k],
                      'stroke-width': 0,
                      'stroke': me.opts.stepColors[k]
                    });
                }
                
                
                bar.data('yval', yval);
                bar.data('barData', barData);
                g.graphs.bars.push(bar);
              }
//              if(totalVal > 0) {
//              	g.paper.text(x+w/2, y-10, totalVal).attr('fill', '#fff');;
//              }
            }
            else {
              x = xgrid[i] + g.box.left - g.box.barwidth / 2 + (subbarWidth + g.opts.gap) * j;
              y = g.box.bottom - yval * g.box.dy;
              w = subbarWidth;
              h = g.box.bottom - y;
              if(gOpts.abreast){
                  bar = g.paper.rect(x, y, w, h).attr({
                    'fill': me.opts.stepColors[(dataLen === 1 ? 0 : j) % me.opts.stepColors.length],
                    'stroke-width': 0 
                  });
              }else{
                  bar = g.paper.rect(x, y, w, h).attr({
                    'fill': me.opts.stepColors[(dataLen === 1 ? i : j) % me.opts.stepColors.length],
                    'stroke-width': 0 
                  });
              }
              
//              if(yval > 0) {
//	              g.paper.text(x+w/2, y-10, yval).attr('fill', '#fff');;
//              }
              
			  bar.data('yval', yval);
			  bar.data('barData', barData);
              g.graphs.bars.push(bar);
            }
          }
        }
      }
      
      if(gOpts.tip) {
	      for(var i=0; i<g.graphs.bars.length; i++) {
	      	var bar = g.graphs.bars[i];
	      	bar.hover(function(barData) {
	      		return function(event) {
		      		if(!me.tipElem) {
			      		me.tipElem = $('<div class="amchart-line-hover"><div>');
			      		g.el.append(me.tipElem);
		      		}
			      	gOpts.tip(me.tipElem, barData, event.offsetX, event.offsetY);
	      		}
	      	}(bar.data('barData')), function() {
	      		if(me.tipElem) {
	      			me.tipElem.hide();
	      		}
	      	});
	      	
	      	bar.mousemove(function(event) {
	      		if(me.tipElem) {
		      		var x = event.offsetX;
		      		var y = event.offsetY;
		      		var ew = g.el.width();
	                var pw = me.tipElem.width();
	                var ph = me.tipElem.height();
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
	                
	                me.tipElem.css({'left': left, 'top': top}).show();
	      		}
	      	});
	      }
      }
    }

  };

  Mix.bar = bar;
  
  
  
	var rad = Math.PI / 180;
	function sector(paper, cx, cy, r, startAngle, endAngle, params) {
		var x1 = cx + r * Math.cos(-startAngle * rad),
			x2 = cx + r * Math.cos(-endAngle * rad),
			y1 = cy + r * Math.sin(-startAngle * rad),
			y2 = cy + r * Math.sin(-endAngle * rad);
		return paper.path(["M",cx, cy ,"L", x1, y1, "A", r, r, 0, +(endAngle - startAngle > 180), 0, x2, y2, "L", cx, cy]).attr(params);
	}
    
    var pieOpts ={
  	
  	};
  	
	function Pie(opts) {
		var me = this;

    	if (!(me instanceof Pie)) {
      		return new Mix.Pie(opts);
    	}
    	opts = me.opts = $.extend(true, {}, barOpts, opts || {});

	    // 通过id或者dom 生成jQuery对象
	    me.el = typeof opts.element === 'string' ? $('#'+ opts.element) : $(opts.element);
	    me.el.css('position', 'relative');
	
	    opts.width = opts.width || me.el.width();
	    opts.height = opts.height || me.el.height();
	    me.paper = new R(me.el[0], opts.width, opts.height);

    	me.init();
  	}
	Pie.prototype = {
    	constructor: Pie,
    	init: function() {
			var me = this, opts = me.opts;
	      
			me.calcBox();
			me.setData();
		
			me.draw();
		},
	    update: function(data) {
			var me = this;
			me.paper.clear();
			me.opts.data=data;
			me.setData();
			me.draw();
	    },
	    calcBox: function() {
			var me = this, opts = me.opts, box = {},
	        pd = opts.padding;
	
	      	box.top = pd;
	      	box.right = opts.width - pd;
	      	box.bottom = opts.height - pd;
	      	box.left = pd;
		      
			box.width = box.right - box.left;
			box.height = box.bottom - box.top;
		
			box.cx = box.width / 2 + box.left;
			box.cy = box.height / 2 + box.top;
			box.r = Math.min(box.cx, box.cy) - opts.strokeWidth;
	
			me.box = box;
	    },

	    setData: function() {
	      var me = this, opts = me.opts, data = opts.data,
	        i, len = data.length, total = 0, j = 0, max = 0, yval;
	
	        for (i = len - 1; i >= 0; i--) {
	          total += data[i][opts.ykey];
	        }
	
	        for (i = len - 1; i >= 0; i--) {
	          yval = data[i];
	          yval.per = parseFloat((yval[opts.ykey] / total).toFixed(2));
	          // yval.max = 0; // 给每个数据对象都添加一个max = 0的属性，并且后面设置最大的那个数据max属性值为1
	          if (max < yval.per) {
	            max = yval.per;
	            j = i;
	          }
	        }
	        data[j].max = true;
	    },

	    draw: function() {
	      var me = this, opts = me.opts, data = opts.data, box = me.box,
	        i, len = data.length, startAngle = 0, endAngle = 0,
	        donut, donuts = me.paper.set(), item,
	        w = (box.r * 2 - opts.strokeWidth) / Math.sqrt(2);
	      var pWid,wid;
	      if(!me.fixedEle){
	        me.fixedEle=$('<div style="position: absolute; display:table"></div>');
	        me.el.append(me.fixedEle);
	        pWid=$(me.paper.canvas).parent().width()/2;
	        wid=$(me.paper.canvas).width()/2;
	
	        me.fixedEle.css({
	          'left':parseInt(box.cx - w/2+pWid-wid),
	          'top':parseInt(box.cy - w/2),
	          'width':parseInt(w),
	          'height':parseInt(w),
	          'text-align': 'center',
	          'overflow':'hidden'
	        });
	      }
	      for (i = len - 1; i >= 0 ; i--) {
	        item = data[i];
	        startAngle = endAngle + 1;
	        endAngle = startAngle + item.per * 360 - 1;
	
	        donut = me.drawSector(box.cx, box.cy, box.r, startAngle, endAngle, {
	//          'stroke': opts.stepColors[i],
	//          'stroke-width': opts.strokeWidth
	        	'fill': opts.stepColors[i]
	        });
	        
	        me.drawLabel(data[i][opts.ykey], me.paper, box.cx, box.cy, box.r, startAngle, endAngle, opts.stepColors[i]);
	        
	        donut.data('data', item);
	        donuts.push(donut);
	      }
	    },

	    drawSector: function(x, y, r, startAngle, endAngle, attrs) {
	      	var me = this, opts = me.opts, donut;
	        donut = sector(me.paper, x, y, r, startAngle, endAngle, attrs);
	
	      	return donut;
	    },
    
		drawLabel: function(labelTxt, paper, cx, cy, r, startAngle, endAngle, color) {
			 var x1 = cx + r * Math.cos(-(startAngle+endAngle)/2 * rad),
			      y1 = cy + r * Math.sin(-(startAngle+endAngle)/2 * rad),
			      x2 = cx + (r+15) * Math.cos(-(startAngle+endAngle)/2 * rad),
			      y2 = cy + (r+15) * Math.sin(-(startAngle+endAngle)/2 * rad),
			      x3, y3;
			      
			if((startAngle+endAngle) / 2 > 90 && (startAngle+endAngle) / 2 < 270) {
				x3 = x2 - 15
				y3 = y2;
				paper.path(["M", x1, y1, "L", x2, y2, "L", x3, y3]).attr({
					stroke: color
				});
				var t = paper.text(x3, y3, labelTxt).attr({
					'fill': color,
					'text-anchor': 'end'
				});
			}else {
				x3 = x2 + 15
				y3 = y2;
				paper.path(["M", x1, y1, "L", x2, y2, "L", x3, y3]).attr({
					stroke: color
				});
				paper.text(x3, y3, labelTxt).attr({
					'fill': color,
					'text-anchor': 'start'
				});
			}
		}
  	};

  	Mix.Pie = Pie;
})(jQuery, Raphael);
