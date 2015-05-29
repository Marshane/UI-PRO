var isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
};
var isArray =function(obj) {
    return Object.prototype.toString.call(obj) === '[object Array]';
};
var isNumber =function(obj) {
    return Object.prototype.toString.call(obj) === '[object Number]';
};
var isFunction =function(obj) {
    return Object.prototype.toString.call(obj) === '[object Function]';
};
var isUndefined =function(obj) {
    return obj === void 0;
};
/**
 * json 转 字符串式json
 * @param b
 * @returns {*}
 */
var json2str=function(b){
    var c=[],
        f =isArray(b);
    if (isObject(b)){
        if (null === b) return "null";
        if (window.JSON && window.JSON.stringify) return JSON.stringify(b);
        for (var h in b) c.push((f ? "" :'"' + h + '":') + json2str(b[h]));
        c=c.join();
        return f ? "[" + c + "]" :"{" + c + "}"
    }
    return isNumber(b) ||isFunction(b) ? b.toString() :
        isUndefined(b) ? "undefined" :!b ? '""' :'"' + b + '"'
};
/**
 * string 转 json
 * @param b
 * @returns {{}}
 */
var json=function(b){
    var c={};
    try {
        c=eval("(" + b + ")")
    } catch (f){}
    return c
};