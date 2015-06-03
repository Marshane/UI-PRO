(function () {
    var __slice = [].slice,
        __bind = function (fn, me) {
            return function () {
                return fn.apply(me, arguments);
            };
        },
        __hasProp = {}.hasOwnProperty,
        __extends = function (child, parent) {
            for (var key in parent) {
                if (__hasProp.call(parent, key))
                    child[key] = parent[key];
            }
            function ctor() {
                this.constructor = child;
            }

            ctor.prototype = parent.prototype;
            child.prototype = new ctor();
            child.__super__ = parent.prototype;
            return child;
        },
        __indexOf = [].indexOf || function (item) {
            for (var i = 0, l = this.length; i < l; i++) {
                if (i in this && this[i] === item) return i;
            }
            return -1;
        };

    uiChart = window.uiChart || {};
    uiChart.EventEmitter = (function () {
        function EventEmitter() {
        }

        EventEmitter.prototype.on = function (name, handler) {
            if (this.handlers == null) {
                this.handlers = {};
            }
            if (this.handlers[name] == null) {
                this.handlers[name] = [];
            }
            this.handlers[name].push(handler);
            return this;
        };
        EventEmitter.prototype.fire = function () {
            var args, handler, name, _i, _len, _ref, _results;
            name = arguments[0], args = 2 <= arguments.length ? __slice.call(arguments, 1) : [];
            if ((this.handlers != null) && (this.handlers[name] != null)) {
                _ref = this.handlers[name];
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    handler = _ref[_i];
                    _results.push(handler.apply(null, args));
                }
                return _results;
            }
        };
        return EventEmitter;
    })();

    uiChart.commas = function (num) {
        var absnum, intnum, ret, strabsnum;
        if (num != null) {
            ret = num < 0 ? "-" : "";
            absnum = Math.abs(num);
            intnum = Math.floor(absnum).toFixed(0);
            ret += intnum.replace(/(?=(?:\d{3})+$)(?!^)/g, ',');
            strabsnum = absnum.toString();
            if (strabsnum.length > intnum.length) {
                ret += strabsnum.slice(intnum.length);
            }
            return ret;
        } else {
            return '-';
        }
    };

    uiChart.Donut = (function (_super) {
        __extends(Donut, _super);
        Donut.prototype.defaults = {
            colors: ['#ffff66', '#2255fc', '#00bae9', '#33cccc', '#d15252', '#0b70c5', '#558eff', '#3bfaef'],
            backgroundColor: '#FFFFFF',
            labelColor: '#000000',
            formatter: uiChart.commas,
            resize: false
        };
        function Donut(options) {
            this.resizeHandler = __bind(this.resizeHandler, this);
            this.select = __bind(this.select, this);
            this.click = __bind(this.click, this);
            this.hideTip = __bind(this.hideTip, this);
            var _this = this;
            if (!(this instanceof uiChart.Donut)) {
                return new uiChart.Donut(options);
            }
            this.options = $.extend({}, this.defaults, /*donutChartTheme||{},*/ options);
            if (typeof options.element === 'string') {
                this.el = $(document.getElementById(options.element));
            } else {
                this.el = $(options.element);
            }
            if (this.el === null || this.el.length === 0) {
                throw new Error("Graph placeholder not found.");
            }
            this.raphael = new Raphael(this.el[0]);
            if (this.options.resize) {
                $(window).bind('resize', function (evt) {
                    if (_this.timeoutId != null) {
                        window.clearTimeout(_this.timeoutId);
                    }
                    return _this.timeoutId = window.setTimeout(_this.resizeHandler, 100);
                });
            }
            this.setData(options.data);
        }

        Donut.prototype.redraw = function () {
            var C, cx, cy, i, idx, last, max_value, min, next, seg, total, value, w, _i, _j, _k, _len, _len1, _len2, _ref, _ref1, _ref2, _results;
            this.raphael.clear();
            cx = this.el.width() / 2;
            cy = this.el.height() / 2;

            w = (Math.min(cx, cy) - 20) / 3;
            total = 0;
            _ref = this.values;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                value = _ref[_i];
                total += value;
            }
            min = 5 / (2 * w);
            C = 1.9999 * Math.PI - min * this.data.length;
            last = 0;
            idx = 0;
            this.segments = [];
            this.percent = [];
            _ref1 = this.values;
            for (i = _j = 0, _len1 = _ref1.length; _j < _len1; i = ++_j) {
                value = _ref1[i];
                this.percent.push(value / total);
                next = last + min + C * (value / total);
                seg = new uiChart.DonutSegment(this.data[i][this.options.label]/*+'('+value+')'*/, cx, cy, w * 2, w, last, next, this.data[i].color || this.options.colors[idx % this.options.colors.length], this.options.backgroundColor, idx, this.raphael);
                seg.render();
                this.segments.push(seg);
                seg.on('hover', this.select);
                seg.on('click', this.click);
                seg.on('mousemove', this.select);
                seg.on('mouseout', this.hideTip);
                last = next;
                idx += 1;
            }
            this.text1 = this.drawEmptyDonutLabel(cx, cy - 10, this.options.labelColor, 20);
            this.text2 = this.drawEmptyDonutLabel(cx, cy + 10, this.options.labelColor, 14);
            max_value = Math.max.apply(Math, this.values);
            idx = 0;
            _ref2 = this.values;
            _results = [];
            for (_k = 0, _len2 = _ref2.length; _k < _len2; _k++) {
                value = _ref2[_k];
                if (value === max_value) {
                    this.select(idx);
                    break;
                }
                _results.push(idx += 1);
            }
            return _results;
        };
        Donut.prototype.setData = function (data) {
            var row;
            this.data = data;
            this.values = (function () {
                var _i, _len, _ref, _results;
                _ref = this.data;
                _results = [];
                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                    row = _ref[_i];
                    _results.push(Math.abs(parseFloat(row[this.options.value])));
                }
                return _results;
            }).call(this);
            return this.redraw();
        };
        Donut.prototype.click = function (idx) {
            return this.fire('click', idx, this.data[idx]);
        };
        Donut.prototype.select = function (idx, event) {
            var row, s, segment, _i, _len, _ref;
            _ref = this.segments;
            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                s = _ref[_i];
                s.deselect();
            }
            segment = this.segments[idx];
            segment.select();
            row = this.data[idx];

            if(event) {
                // 显示segment提示信息
                this.showTip(idx, event);
            }

            return this.setLabels(row[this.options.label], this.options.formatter(row[this.options.value], row, this.percent[idx]));
        };

        Donut.prototype.hideTip = function(idx) {
            this.tipElem.hide();
        }

        Donut.prototype.pos = function (p, x, y) {
            ew = this.el.width();
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
            // console.log('left'+ left+',top'+top);
            p.css({'left': left, 'top': top}).show();
        };

        Donut.prototype.showTip = function(idx, event) {
            var tipText = this.data[idx][this.options.label] + ': ' + this.options.formatter(this.data[idx][this.options.value], this.data[idx], this.percent[idx]);

            if(!this.tipElem) {
                this.tipElem = $('<div class="amchart-line-hover" style="position:absolute"><div>');
                this.el.append(this.tipElem);
            }

            this.tipElem.html(tipText);
            this.pos(this.tipElem, event.offsetX, event.offsetY);
        };

        Donut.prototype.setLabels = function (label1, label2) {
            var inner, maxHeightBottom, maxHeightTop, maxWidth, text1bbox, text1scale, text2bbox, text2scale;
            inner = (Math.min(this.el.width() / 2, this.el.height() / 2) - 10) * 2 / 3;
            maxWidth = 1.8 * inner;
            maxHeightTop = inner / 2;
            maxHeightBottom = inner / 3;
            this.text1.attr({
                text: label1,
                transform: ''
            });
            text1bbox = this.text1.getBBox();
            /*
             text1scale = Math.min(maxWidth / text1bbox.width, maxHeightTop / text1bbox.height);
             this.text1.attr({
             transform: "S" + text1scale + "," + text1scale + "," + (text1bbox.x + text1bbox.width / 2) + "," + (text1bbox.y + text1bbox.height)
             });
             */
            // label 过长时做截断
            if(text1bbox.width > maxWidth) {
                var size = Math.floor(label1.length * (maxWidth / text1bbox.width));
                this.text1.attr({
                    text: label1.substr(0, size) + "..."
                });
            }

            this.text2.attr({
                text: label2,
                transform: ''
            });
            text2bbox = this.text2.getBBox();
            text2scale = Math.min(maxWidth / text2bbox.width, maxHeightBottom / text2bbox.height);
            return this.text2.attr({
                transform: "S" + text2scale + "," + text2scale + "," + (text2bbox.x + text2bbox.width / 2) + "," + text2bbox.y
            });
        };
        Donut.prototype.drawEmptyDonutLabel = function (xPos, yPos, color, fontSize, fontWeight) {
            var text;
            text = this.raphael.text(xPos, yPos, '').attr('font-size', fontSize).attr('fill', color);
            if (fontWeight != null) {
                text.attr('font-weight', fontWeight);
            }
            return text;
        };
        Donut.prototype.resizeHandler = function () {
            this.timeoutId = null;
            this.raphael.setSize(this.el.width(), this.el.height());
            return this.redraw();
        };

        return Donut;
    })(uiChart.EventEmitter);

    uiChart.DonutSegment = (function (_super) {
        __extends(DonutSegment, _super);
        function DonutSegment(labelText, cx, cy, inner, outer, p0, p1, color, backgroundColor, index, raphael) {
            this.labelText = labelText;
            this.cx = cx;
            this.cy = cy;
            this.inner = inner;
            this.outer = outer;
            this.color = color;
            this.backgroundColor = backgroundColor;
            this.index = index;
            this.raphael = raphael;
            this.deselect = __bind(this.deselect, this);
            this.select = __bind(this.select, this);
            this.sin_p0 = Math.sin(p0);
            this.cos_p0 = Math.cos(p0);
            this.sin_p1 = Math.sin(p1);
            this.cos_p1 = Math.cos(p1);
            this.sin_p2 = Math.sin((p0 + p1) / 2);
            this.cos_p2 = Math.cos((p0 + p1) / 2);
            this.is_long = (p1 - p0) > Math.PI ? 1 : 0;
            this.path = this.calcSegment(this.inner + 3, this.inner + this.outer - 5);
            this.selectedPath = this.calcSegment(this.inner + 3, this.inner + this.outer);
            this.hilight = this.calcArc(this.inner);
        }

        DonutSegment.prototype.calcArcPoints = function (r) {
            return [this.cx + r * this.sin_p0, this.cy + r * this.cos_p0, this.cx + r * this.sin_p1, this.cy + r * this.cos_p1];
        };
        DonutSegment.prototype.calcSegment = function (r1, r2) {
            var ix0, ix1, iy0, iy1, ox0, ox1, oy0, oy1, _ref, _ref1;
            _ref = this.calcArcPoints(r1), ix0 = _ref[0], iy0 = _ref[1], ix1 = _ref[2], iy1 = _ref[3];
            _ref1 = this.calcArcPoints(r2), ox0 = _ref1[0], oy0 = _ref1[1], ox1 = _ref1[2], oy1 = _ref1[3];
            return ("M" + ix0 + "," + iy0) + ("A" + r1 + "," + r1 + ",0," + this.is_long + ",0," + ix1 + "," + iy1) + ("L" + ox1 + "," + oy1) + ("A" + r2 + "," + r2 + ",0," + this.is_long + ",1," + ox0 + "," + oy0) + "Z";
        };
        DonutSegment.prototype.calcArc = function (r) {
            var ix0, ix1, iy0, iy1, _ref;
            _ref = this.calcArcPoints(r), ix0 = _ref[0], iy0 = _ref[1], ix1 = _ref[2], iy1 = _ref[3];
            return ("M" + ix0 + "," + iy0) + ("A" + r + "," + r + ",0," + this.is_long + ",0," + ix1 + "," + iy1);
        };
        DonutSegment.prototype.render = function () {
            var _this = this;
            this.arc = this.drawDonutArc(this.hilight, this.color);
            this.seg = this.drawDonutSegment(this.path, this.color, this.backgroundColor, function (event) {
                return _this.fire('hover', _this.index, event);
            }, function (event) {
                return _this.fire('click', _this.index, event);
            });

            this.seg.mousemove(function(event) {
                return _this.fire('mousemove', _this.index, event);
            });
            this.seg.mouseout(function(event) {
                return _this.fire('mouseout', _this.index, event);
            });

//          this.drawDonutLable(this.labelText, this.color);
            return this.seg;
        };
        DonutSegment.prototype.drawDonutArc = function (path, color) {
            return this.raphael.path(path).attr({
                stroke: color,
                'stroke-width': 0,
                opacity: 0
            });
        };
        DonutSegment.prototype.drawDonutSegment = function (path, fillColor, strokeColor, hoverFunction, clickFunction) {
            return this.raphael.path(path).attr({
                fill: fillColor,
                stroke: strokeColor,
                'stroke-width': 2
            }).hover(hoverFunction).click(clickFunction);
        };

        DonutSegment.prototype.drawDonutLable = function (labelText, color) {
            // lableLine 起点 x,y
            var xPos1 = this.cx + (this.inner + this.outer - 5) * this.sin_p2;
            var yPos1 = this.cy + (this.inner + this.outer - 5) * this.cos_p2;
            // labelLine 中点 x,y
            var xPos2 = this.cx + (this.inner + this.outer + 15) * this.sin_p2;
            var yPos2 = this.cy + (this.inner + this.outer + 15) * this.cos_p2;
            // labelLine 终点 x,y
            var xPos3 = this.sin_p2 >=0 ? (xPos2 + 15) : (xPos2 - 15);
            var yPos3 = yPos2;
            // text 坐标
            var xPos4 = this.sin_p2 >=0 ? (xPos3 + 2) : (xPos3 - 2);
            var yPos4 = yPos2;

            this.raphael.path(("M" + xPos1 + "," + yPos1) + (" L" + xPos2 + "," + yPos2) + (" H" + xPos3)).attr('stroke', color);

            var text;
            text = this.raphael.text(xPos4, yPos4, labelText)/*.attr('font-size', fontSize)*/.attr('fill', color);
            if(this.sin_p2 >=0) {
                text.attr('text-anchor', 'start');
            }else {
                text.attr('text-anchor', 'end');
            }

//            if (fontWeight != null) {
//                text.attr('font-weight', fontWeight);
//            }
            return text;
        };


        DonutSegment.prototype.select = function () {
            if (!this.selected) {
                this.seg.animate({
                    path: this.selectedPath
                }, 150, '<>');
                this.arc.animate({
                    opacity: 1
                }, 150, '<>');
                return this.selected = true;
            }
        };
        DonutSegment.prototype.deselect = function () {
            if (this.selected) {
                this.seg.animate({
                    path: this.path
                }, 150, '<>');
                this.arc.animate({
                    opacity: 0
                }, 150, '<>');
                return this.selected = false;
            }
        };
        return DonutSegment;
    })(uiChart.EventEmitter);
}).call(this);
