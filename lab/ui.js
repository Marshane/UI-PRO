/**
 * by Marshane
 * 2015-05
 * ui工具库
 */

/**
 * fix ie
 * @type {Console}
 */
window.console=window.console||function(){
    return {log:function(){}}
}();
/**
 * 判断是否包含该字符
 * @param source
 * @returns {boolean}
 */
String.prototype.hasString=function(source){
    if(typeof source == 'object'){
        for(var i= 0,j=source.length;i<j;i++)
            if(!this.hasString(source[i])) return !1;
        return !0;
    }
    if(this.indexOf(source) != -1) return !0;
};
/**
 * 计算字符长度，全角和中文算2个
 * @returns {number}
 */
String.prototype.len = function () {
    var a = (this || "").match(/[^\x00-\x80]/g);
    return this.length + (a ? a.length : 0)
};
/**
 * 字符串截取..
 * @param k
 * @returns {string}
 */
String.prototype.cut = function (k) {
    var g = "..",
        d = [],
        l = "";
    if (!k) {
        return this.trim()
    }
    if (this.len() > k) {
        for (var e = this.split(""), l = 0, i = e.length; l < i; l++) {
            if (0 < k) {
                d.push(e[l]), k -= e[l].len()
            } else {
                break
            }
        }
        l = d.join("") + g
    } else {
        l = this.trim()
    }
    return l
};
/**
 * 对目标字符串进行格式化 通过占位符 逐个替换字符 {0} {1} {2} ...
 * @returns {*}
 */
String.prototype.format=function(){
    if(1==arguments.length) return this;
    var arr=Array.prototype.slice.call(arguments,1);
    return this.replace(/\{(\d+)\}/g,function(a,b){
        return arr[b]
    })
};
/**
 * 日期的格式化
 * @param fmt
 * @returns {*}
 * @constructor
 */
Date.prototype.dateFormat = function(fmt){
  var o = {   
    "M+" : this.getMonth()+1,                 //月份   
    "d+" : this.getDate(),                    //日   
    "h+" : this.getHours(),                   //小时   
    "m+" : this.getMinutes(),                 //分   
    "s+" : this.getSeconds(),                 //秒   
    "q+" : Math.floor((this.getMonth()+3)/3), //季度   
    "S"  : this.getMilliseconds()             //毫秒   
  };   
  if(/(y+)/.test(fmt))   
    fmt=fmt.replace(RegExp.$1, (this.getFullYear()+"").substr(4 - RegExp.$1.length));   
  for(var k in o)   
    if(new RegExp("("+ k +")").test(fmt))   
  fmt = fmt.replace(RegExp.$1, (RegExp.$1.length==1) ? (o[k]) : (("00"+ o[k]).substr((""+ o[k]).length)));   
  return fmt;   
};

var ui=window.ui||{};
/**
 * 依赖 underscore
 */
ui= _.extend(ui,{
    /**
     * create a class, and setup constructor
     */
    Class:{
        create: function() {
            var f = function() {
                this.init.apply(this, arguments);
            };
            for (var i = 0, il = arguments.length, it; i<il; i++) {
                it = arguments[i];
                if (it == null) continue;
                _.extend(f.prototype, it);
            }
            return f;
        }
    },
    /**
     * 浏览器判断
     */
    b:function(){
        var b = {},
            c = navigator.userAgent;
        b.win = c.hasString("Windows") || c.hasString("Win32");
        b.ie = c.hasString("MSIE");
        b.ie6 = c.hasString("MSIE 6") && !c.hasString("MSIE 7") && !c.hasString("MSIE 8");
        b.ie7 = c.hasString("MSIE 7") && !c.hasString("MSIE 8");
        b.ie8 = c.hasString("MSIE 8");
        b.ie9 = c.hasString("MSIE 9");
        b.ie10 = c.hasString("MSIE 10");
        b.opera = window.opera || c.hasString("Opera");
        b.safari = c.hasString("WebKit");
        b.chrome = c.hasString("Chrome");
        b.firefox = c.hasString("Firefox");
        return b
    }(),
    /**
     * 有些习惯这样调用
     * @param str
     */
    format:function(str){
        return String(str).format(String,Array.prototype.slice.call(arguments,1));
    },
    /**
     * 输入框选中字符
     * @param a
     * @param f
     * @param j
     */
    selectText:function (a,f,j){
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
    /**
     * 域绑定
     * @param fn
     * @param scope
     * @returns {Function}
     */
    bind:function(fn,scope){
        var _args=arguments.length>2?[].slice.call(arguments,2):null;
        return function(){
            var args=_args?_args.concat([].slice.call(arguments,0)):arguments;
            return fn.apply(scope||fn,args)
        }
    },
    /**
     * string 转 json
     * @param b
     * @returns {{}}
     */
    json:function(b){
        var c={};
        try {
            c=eval("(" + b + ")")
        } catch (f){}
        return c
    },
    /**
     * url参数化
     * @param a
     * @param b
     * @param c
     * @returns {string}
     */
    url:function(a,b,c){
        return [a,(a.hasString("?") ? "&": "?"),b?this.toParm(b):'',c?'':'&_r='+new Date().getTime()].join('')
    },
    /**
     * 对象 转 参数化形式
     * @param a
     * @returns {*}
     */
    toParm:function(a){
        if(_.isObject(a)){
            var b=[];
            for (var c in a) b.push(c+'='+a[c]);
            return b.join('&');
        }
        return a;
    },
    /**
     * json 转 字符串式json
     * @param b
     * @returns {*}
     */
    json2str:function(b){
        var c=[],
            f =_.isArray(b);
        if (_.isObject(b)){
            if (null === b) return "null";
            if (window.JSON && window.JSON.stringify) return JSON.stringify(b);
            for (var h in b) c.push((f ? "" :'"' + h + '":') + this.json2str(b[h]));
            c=c.join();
            return f ? "[" + c + "]" :"{" + c + "}"
        }
        return _.isNumber(b) ||_.isFunction(b) ? b.toString() :
            _.isUndefined(b) ? "undefined" :!b ? '""' :'"' + b + '"'
    },
    /**
     * 事件相关处理
     * @param b
     * @returns {{stop: stop, prevent: prevent, target: (EventTarget|Object), x: Number, y: Number, button: boolean, key: Number, shift: boolean, alt: boolean, ctrl: boolean, type: string, wheel: number}}
     */
    evt:function(b){
        b = window.event || b || {};
        return {
            stop: function () {
                b && b.stopPropagation ? b.stopPropagation() : b.cancelBubble = !0
            },
            prevent: function () {
                b && b.preventDefault ? b.preventDefault() : b.returnValue = !1
            },
            target: b.target || b.srcElement,
            x: b.clientX || b.pageX,
            y: b.clientY || b.pageY,
            button: b.button,
            key: b.keyCode,
            shift: b.shiftKey,
            alt: b.altKey,
            ctrl: b.ctrlKey,
            type: b.type,
            wheel: b.wheelDelta / 120 || -b.detail / 3
        }
    }
});