!function(factory) {
    "function" == typeof define && define.amd ? define(["jquery"], factory) : factory("object" == typeof exports ? require("jquery") : jQuery)
}(function($) {
    function encode(s) {
        return config.raw ? s : encodeURIComponent(s)
    }
    function decode(s) {
        return config.raw ? s : decodeURIComponent(s)
    }
    function stringifyCookieValue(value) {
        return encode(config.json ? JSON.stringify(value) : String(value))
    }
    function parseCookieValue(s) {
        0 === s.indexOf('"') && (s = s.slice(1, -1).replace(/\\"/g, '"').replace(/\\\\/g, "\\"));
        try {
            return s = decodeURIComponent(s.replace(pluses, " ")),
                config.json ? JSON.parse(s) : s
        } catch (e) {}
    }
    function read(s, converter) {
        var value = config.raw ? s : parseCookieValue(s);
        return $.isFunction(converter) ? converter(value) : value
    }
    var pluses = /\+/g
        , config = $.cookie = function(key, value, options) {
            if (void 0 !== value && !$.isFunction(value)) {
                if (options = $.extend({}, config.defaults, options),
                    "number" == typeof options.expires) {
                    var days = options.expires
                        , t = options.expires = new Date;
                    t.setTime(+t + 864e5 * days)
                }
                return document.cookie = [encode(key), "=", stringifyCookieValue(value), options.expires ? "; expires=" + options.expires.toUTCString() : "", options.path ? "; path=" + options.path : "", options.domain ? "; domain=" + options.domain : "", options.secure ? "; secure" : ""].join("")
            }
            for (var result = key ? void 0 : {}, cookies = document.cookie ? document.cookie.split("; ") : [], i = 0, l = cookies.length; l > i; i++) {
                var parts = cookies[i].split("=")
                    , name = decode(parts.shift())
                    , cookie = parts.join("=");
                if (key && key === name) {
                    result = read(cookie, value);
                    break
                }
                key || void 0 === (cookie = read(cookie)) || (result[name] = cookie)
            }
            return result
        }
        ;
    config.defaults = {},
        $.removeCookie = function(key, options) {
            return void 0 === $.cookie(key) ? !1 : ($.cookie(key, "", $.extend({}, options, {
                expires: -1
            })),
                !$.cookie(key))
        }
}),
    function(window, $) {
        var UA = navigator.userAgent.toLowerCase()
            , isCodingApp = /coding/i.test(UA);
        if (!isCodingApp) {
            var isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/i.test(UA)
                , showBanner = !$.cookie("hideAppBanner")
                , app_logo_png = "data:image/png;base64,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"
                , makeTemplate = function(platform) {
                    var tpl = ['<div class="smart-app-banner ' + platform + '">', '<a class="download-btn">', '<img src="' + app_logo_png + '" alt="Coding"/>', "</a>", '<div class="words">', '<div class="title">Coding 客户端</div>', '<div class="description">软件开发，云端协作！</div>', "</div>", '<a class="download download-btn">立即下载</a>', '<a class="close" href="javascript:void(0);"></a>', "</div>"].join("\n");
                    return tpl
                }
                ;
            if (isMobile) {
                var iOS = /iphone|ipad|ipod/i.test(UA)
                    , iPad = /ipad/i.test(UA)
                    , Android = /android/i.test(UA)
                    , template = ""
                    , downloadUrl = "";
                iOS ? (downloadUrl = iPad ? "https://itunes.apple.com/us/app/coding-hd/id1013704594" : "https://itunes.apple.com/us/app/id923676989",
                    template = makeTemplate("ios")) : Android && (downloadUrl = "https://coding.net/app/android",
                    template = makeTemplate("android"));
                var dom = $(template);
                showBanner && ($("body").append(dom),
                    dom.find("a.close").on("click", function() {
                        $.cookie("hideAppBanner", !0, {
                            expires: 1
                        }),
                            dom.remove()
                    }),
                    dom.find(".download-btn").on("click", function() {
                        location.href = downloadUrl
                    }))
            }
        }
    }(window, jQuery);
