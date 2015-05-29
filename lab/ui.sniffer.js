(function(){
    String.prototype.hasString=function(source){
        if(this.indexOf(source) != -1) return !0;
    };
    var B=function () {
        var b = {},
            c = navigator.userAgent;
        b.ie6 = c.hasString("MSIE 6") && !c.hasString("MSIE 7") && !c.hasString("MSIE 8");
        b.ie7 = c.hasString("MSIE 7") && !c.hasString("MSIE 6") && !c.hasString("MSIE 8");
        b.ie8 = c.hasString("MSIE 8");
        return b
    }();
    if(B.ie6||B.ie7||B.ie8){
        location.href=contextPath+'/app/old.jsp';
    }
})();