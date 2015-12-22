!function($, window, document, undefined) {
    $.fn.accordion = function(parameters) {
        var returnedValue, $allModules = $(this), time = (new Date).getTime(), performance = [], query = arguments[0], methodInvoked = "string" == typeof query, queryArguments = [].slice.call(arguments, 1);
        return $allModules.each(function() {
            var module, settings = $.isPlainObject(parameters) ? $.extend(!0, {}, $.fn.accordion.settings, parameters) : $.extend({}, $.fn.accordion.settings), className = settings.className, namespace = settings.namespace, selector = settings.selector, eventNamespace = (settings.error,
            "." + namespace), moduleNamespace = "module-" + namespace, moduleSelector = $allModules.selector || "", $module = $(this), $title = $module.find(selector.title), $content = $module.find(selector.content), element = this, instance = $module.data(moduleNamespace);
            module = {
                initialize: function() {
                    module.debug("Initializing accordion with bound events", $module),
                        $title.on("click" + eventNamespace, module.event.click),
                        module.instantiate()
                },
                instantiate: function() {
                    instance = module,
                        $module.data(moduleNamespace, module)
                },
                destroy: function() {
                    module.debug("Destroying previous accordion for", $module),
                        $module.removeData(moduleNamespace),
                        $title.off(eventNamespace)
                },
                event: {
                    click: function() {
                        module.verbose("Title clicked", this);
                        var $activeTitle = $(this)
                            , index = $title.index($activeTitle);
                        module.toggle(index)
                    },
                    resetDisplay: function() {
                        $(this).css("display", ""),
                        "" == $(this).attr("style") && $(this).attr("style", "").removeAttr("style")
                    },
                    resetOpacity: function() {
                        $(this).css("opacity", ""),
                        "" == $(this).attr("style") && $(this).attr("style", "").removeAttr("style")
                    }
                },
                toggle: function(index) {
                    module.debug("Toggling content content at index", index);
                    var $activeTitle = $title.eq(index)
                        , $activeContent = $activeTitle.next($content)
                        , contentIsOpen = $activeContent.is(":visible");
                    contentIsOpen ? settings.collapsible ? module.close(index) : module.debug("Cannot close accordion content collapsing is disabled") : module.open(index)
                },
                open: function(index) {
                    var $activeTitle = $title.eq(index)
                        , $activeContent = $activeTitle.next($content)
                        , $otherSections = module.is.menu() ? $activeTitle.parent().siblings(selector.item).find(selector.title) : $activeTitle.siblings(selector.title)
                        , $previousTitle = $otherSections.filter("." + className.active)
                        , $previousContent = $previousTitle.next($title)
                        , contentIsOpen = $previousTitle.size() > 0;
                    $activeContent.is(":animated") || (module.debug("Opening accordion content", $activeTitle),
                    settings.exclusive && contentIsOpen && ($previousTitle.removeClass(className.active),
                        $previousContent.stop().children().stop().animate({
                            opacity: 0
                        }, settings.duration, module.event.resetOpacity).end().slideUp(settings.duration, settings.easing, function() {
                            $previousContent.removeClass(className.active).children(),
                                $.proxy(module.event.resetDisplay, this)()
                        })),
                        $activeTitle.addClass(className.active),
                        $activeContent.stop().children().stop().animate({
                            opacity: 1
                        }, settings.duration).end().slideDown(settings.duration, settings.easing, function() {
                            $activeContent.addClass(className.active),
                                $.proxy(module.event.resetDisplay, this)(),
                                $.proxy(settings.onOpen, $activeContent)(),
                                $.proxy(settings.onChange, $activeContent)()
                        }))
                },
                close: function(index) {
                    var $activeTitle = $title.eq(index)
                        , $activeContent = $activeTitle.next($content);
                    module.debug("Closing accordion content", $activeContent),
                        $activeTitle.removeClass(className.active),
                        $activeContent.removeClass(className.active).show().stop().children().stop().animate({
                            opacity: 0
                        }, settings.duration, module.event.resetOpacity).end().slideUp(settings.duration, settings.easing, function() {
                            $.proxy(module.event.resetDisplay, this)(),
                                $.proxy(settings.onClose, $activeContent)(),
                                $.proxy(settings.onChange, $activeContent)()
                        })
                },
                is: {
                    menu: function() {
                        return $module.hasClass(className.menu)
                    }
                },
                setting: function(name, value) {
                    if ($.isPlainObject(name))
                        $.extend(!0, settings, name);
                    else {
                        if (value === undefined)
                            return settings[name];
                        settings[name] = value
                    }
                },
                internal: function(name, value) {
                    return module.debug("Changing internal", name, value),
                        value === undefined ? module[name] : void ($.isPlainObject(name) ? $.extend(!0, module, name) : module[name] = value)
                },
                debug: function() {
                    settings.debug && (settings.performance ? module.performance.log(arguments) : (module.debug = Function.prototype.bind.call(console.info, console, settings.name + ":"),
                        module.debug.apply(console, arguments)))
                },
                verbose: function() {
                    settings.verbose && settings.debug && (settings.performance ? module.performance.log(arguments) : (module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ":"),
                        module.verbose.apply(console, arguments)))
                },
                error: function() {
                    module.error = Function.prototype.bind.call(console.error, console, settings.name + ":"),
                        module.error.apply(console, arguments)
                },
                performance: {
                    log: function(message) {
                        var currentTime, executionTime, previousTime;
                        settings.performance && (currentTime = (new Date).getTime(),
                            previousTime = time || currentTime,
                            executionTime = currentTime - previousTime,
                            time = currentTime,
                            performance.push({
                                Element: element,
                                Name: message[0],
                                Arguments: [].slice.call(message, 1) || "",
                                "Execution Time": executionTime
                            })),
                            clearTimeout(module.performance.timer),
                            module.performance.timer = setTimeout(module.performance.display, 100)
                    },
                    display: function() {
                        var title = settings.name + ":"
                            , totalTime = 0;
                        time = !1,
                            clearTimeout(module.performance.timer),
                            $.each(performance, function(index, data) {
                                totalTime += data["Execution Time"]
                            }),
                            title += " " + totalTime + "ms",
                        moduleSelector && (title += " '" + moduleSelector + "'"),
                        (console.group !== undefined || console.table !== undefined) && performance.length > 0 && (console.groupCollapsed(title),
                            console.table ? console.table(performance) : $.each(performance, function(index, data) {
                                console.log(data.Name + ": " + data["Execution Time"] + "ms")
                            }),
                            console.groupEnd()),
                            performance = []
                    }
                },
                invoke: function(query, passedArguments, context) {
                    var maxDepth, found, response, object = instance;
                    return passedArguments = passedArguments || queryArguments,
                        context = element || context,
                    "string" == typeof query && object !== undefined && (query = query.split(/[\. ]/),
                        maxDepth = query.length - 1,
                        $.each(query, function(depth, value) {
                            var camelCaseValue = depth != maxDepth ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1) : query;
                            if ($.isPlainObject(object[camelCaseValue]) && depth != maxDepth)
                                object = object[camelCaseValue];
                            else {
                                if (object[camelCaseValue] !== undefined)
                                    return found = object[camelCaseValue],
                                        !1;
                                if (!$.isPlainObject(object[value]) || depth == maxDepth)
                                    return object[value] !== undefined ? (found = object[value],
                                        !1) : !1;
                                object = object[value]
                            }
                        })),
                        $.isFunction(found) ? response = found.apply(context, passedArguments) : found !== undefined && (response = found),
                        $.isArray(returnedValue) ? returnedValue.push(response) : returnedValue !== undefined ? returnedValue = [returnedValue, response] : response !== undefined && (returnedValue = response),
                        found
                }
            },
                methodInvoked ? (instance === undefined && module.initialize(),
                    module.invoke(query)) : (instance !== undefined && module.destroy(),
                    module.initialize())
        }),
            returnedValue !== undefined ? returnedValue : this
    }
        ,
        $.fn.accordion.settings = {
            name: "Accordion",
            namespace: "accordion",
            debug: !1,
            verbose: !0,
            performance: !0,
            exclusive: !0,
            collapsible: !0,
            duration: 500,
            easing: "easeInOutQuint",
            onOpen: function() {},
            onClose: function() {},
            onChange: function() {},
            error: {
                method: "The method you called is not defined"
            },
            className: {
                active: "active",
                menu: "menu"
            },
            selector: {
                title: ".title",
                content: ".content",
                menu: ".menu",
                item: ".item"
            }
        },
        $.extend($.easing, {
            easeInOutQuint: function(x, t, b, c, d) {
                return (t /= d / 2) < 1 ? c / 2 * t * t * t * t * t + b : c / 2 * ((t -= 2) * t * t * t * t + 2) + b
            }
        })
}(jQuery, window, document),
    function($, window, document, undefined) {
        $.api = $.fn.api = function(parameters) {
            var module, returnedValue, settings = $.extend(!0, {}, $.api.settings, parameters), context = "function" != typeof this ? this : $("<div/>"), $context = $(settings.stateContext ? settings.stateContext : context), $module = "object" == typeof this ? $(context) : $context, element = this, time = (new Date).getTime(), performance = [], moduleSelector = $module.selector || "", moduleNamespace = settings.namespace + "-module", className = settings.className, metadata = settings.metadata, error = settings.error, instance = $module.data(moduleNamespace), query = arguments[0], methodInvoked = instance !== undefined && "string" == typeof query, queryArguments = [].slice.call(arguments, 1);
            return module = {
                initialize: function() {
                    var runSettings, loadingDelay, promise, url, data, xhr, loadingTimer = (new Date).getTime(), formData = {}, ajaxSettings = {};
                    return settings.serializeForm && $(this).toJSON() !== undefined && (formData = module.get.formData(),
                        module.debug("Adding form data to API Request", formData),
                        $.extend(!0, settings.data, formData)),
                        runSettings = $.proxy(settings.beforeSend, $module)(settings),
                        runSettings === undefined || runSettings ? (url = module.get.url(module.get.templateURL())) ? (promise = $.Deferred().always(function() {
                            settings.stateContext && $context.removeClass(className.loading),
                                $.proxy(settings.complete, $module)()
                        }).done(function(response) {
                            module.debug("API request successful"),
                                "json" == settings.dataType ? response.error !== undefined ? $.proxy(settings.failure, $context)(response.error, settings, $module) : $.isArray(response.errors) ? $.proxy(settings.failure, $context)(response.errors[0], settings, $module) : $.proxy(settings.success, $context)(response, settings, $module) : $.proxy(settings.success, $context)(response, settings, $module)
                        }).fail(function(xhr, status, httpMessage) {
                            var response, errorMessage = settings.error[status] !== undefined ? settings.error[status] : httpMessage;
                            if (xhr !== undefined)
                                if (xhr.readyState !== undefined && 4 == xhr.readyState) {
                                    if (200 != xhr.status && httpMessage !== undefined && "" !== httpMessage)
                                        module.error(error.statusMessage + httpMessage);
                                    else if ("error" == status && "json" == settings.dataType)
                                        try {
                                            response = $.parseJSON(xhr.responseText),
                                            response && response.error !== undefined && (errorMessage = response.error)
                                        } catch (error) {
                                            module.error(error.JSONParse)
                                        }
                                    $context.removeClass(className.loading).addClass(className.error),
                                    settings.errorLength > 0 && setTimeout(function() {
                                        $context.removeClass(className.error)
                                    }, settings.errorLength),
                                        module.debug("API Request error:", errorMessage),
                                        $.proxy(settings.failure, $context)(errorMessage, settings, this)
                                } else
                                    module.debug("Request Aborted (Most likely caused by page change)")
                        }),
                            $.extend(!0, ajaxSettings, settings, {
                                success: function() {},
                                failure: function() {},
                                complete: function() {},
                                type: settings.method || settings.type,
                                data: data,
                                url: url,
                                beforeSend: settings.beforeXHR
                            }),
                        settings.stateContext && $context.addClass(className.loading),
                        settings.progress && (module.verbose("Adding progress events"),
                            $.extend(!0, ajaxSettings, {
                                xhr: function() {
                                    var xhr = new window.XMLHttpRequest;
                                    return xhr.upload.addEventListener("progress", function(event) {
                                        var percentComplete;
                                        event.lengthComputable && (percentComplete = Math.round(event.loaded / event.total * 1e4) / 100 + "%",
                                            $.proxy(settings.progress, $context)(percentComplete, event))
                                    }, !1),
                                        xhr.addEventListener("progress", function(event) {
                                            var percentComplete;
                                            event.lengthComputable && (percentComplete = Math.round(event.loaded / event.total * 1e4) / 100 + "%",
                                                $.proxy(settings.progress, $context)(percentComplete, event))
                                        }, !1),
                                        xhr
                                }
                            })),
                            module.verbose("Creating AJAX request with settings: ", ajaxSettings),
                            xhr = $.ajax(ajaxSettings).always(function() {
                                loadingDelay = settings.loadingLength - ((new Date).getTime() - loadingTimer),
                                    settings.loadingDelay = 0 > loadingDelay ? 0 : loadingDelay
                            }).done(function(response) {
                                var context = this;
                                setTimeout(function() {
                                    promise.resolveWith(context, [response])
                                }, settings.loadingDelay)
                            }).fail(function(xhr, status, httpMessage) {
                                var context = this;
                                "abort" != status ? setTimeout(function() {
                                    promise.rejectWith(context, [xhr, status, httpMessage])
                                }, settings.loadingDelay) : $context.removeClass(className.error).removeClass(className.loading)
                            }),
                            void (settings.stateContext && $module.data(metadata.promise, promise).data(metadata.xhr, xhr))) : (module.error(error.missingURL),
                            void module.reset()) : (module.error(error.beforeSend),
                            void module.reset())
                },
                get: {
                    formData: function() {
                        return $module.closest("form").toJSON()
                    },
                    templateURL: function() {
                        var url, action = $module.data(settings.metadata.action) || settings.action || !1;
                        return action && (module.debug("Creating url for: ", action),
                            settings.api[action] !== undefined ? url = settings.api[action] : module.error(error.missingAction)),
                        settings.url && (url = settings.url,
                            module.debug("Getting url", url)),
                            url
                    },
                    url: function(url, urlData) {
                        var urlVariables;
                        return url && (urlVariables = url.match(settings.regExpTemplate),
                            urlData = urlData || settings.urlData,
                        urlVariables && (module.debug("Looking for URL variables", urlVariables),
                            $.each(urlVariables, function(index, templateValue) {
                                var term = templateValue.substr(2, templateValue.length - 3)
                                    , termValue = $.isPlainObject(urlData) && urlData[term] !== undefined ? urlData[term] : $module.data(term) !== undefined ? $module.data(term) : urlData[term];
                                if (module.verbose("Looking for variable", term, $module, $module.data(term), urlData[term]),
                                    termValue === !1)
                                    module.debug("Removing variable from URL", urlVariables),
                                        url = url.replace("/" + templateValue, "");
                                else {
                                    if (termValue === undefined || !termValue)
                                        return module.error(error.missingParameter + term),
                                            url = !1,
                                            !1;
                                    url = url.replace(templateValue, termValue)
                                }
                            }))),
                            url
                    }
                },
                reset: function() {
                    $module.data(metadata.promise, !1).data(metadata.xhr, !1),
                        $context.removeClass(className.error).removeClass(className.loading)
                },
                setting: function(name, value) {
                    if ($.isPlainObject(name))
                        $.extend(!0, settings, name);
                    else {
                        if (value === undefined)
                            return settings[name];
                        settings[name] = value
                    }
                },
                internal: function(name, value) {
                    if ($.isPlainObject(name))
                        $.extend(!0, module, name);
                    else {
                        if (value === undefined)
                            return module[name];
                        module[name] = value
                    }
                },
                debug: function() {
                    settings.debug && (settings.performance ? module.performance.log(arguments) : (module.debug = Function.prototype.bind.call(console.info, console, settings.name + ":"),
                        module.debug.apply(console, arguments)))
                },
                verbose: function() {
                    settings.verbose && settings.debug && (settings.performance ? module.performance.log(arguments) : (module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ":"),
                        module.verbose.apply(console, arguments)))
                },
                error: function() {
                    module.error = Function.prototype.bind.call(console.error, console, settings.name + ":"),
                        module.error.apply(console, arguments)
                },
                performance: {
                    log: function(message) {
                        var currentTime, executionTime, previousTime;
                        settings.performance && (currentTime = (new Date).getTime(),
                            previousTime = time || currentTime,
                            executionTime = currentTime - previousTime,
                            time = currentTime,
                            performance.push({
                                Element: element,
                                Name: message[0],
                                Arguments: [].slice.call(message, 1) || "",
                                "Execution Time": executionTime
                            })),
                            clearTimeout(module.performance.timer),
                            module.performance.timer = setTimeout(module.performance.display, 100)
                    },
                    display: function() {
                        var title = settings.name + ":"
                            , totalTime = 0;
                        time = !1,
                            clearTimeout(module.performance.timer),
                            $.each(performance, function(index, data) {
                                totalTime += data["Execution Time"]
                            }),
                            title += " " + totalTime + "ms",
                        moduleSelector && (title += " '" + moduleSelector + "'"),
                        (console.group !== undefined || console.table !== undefined) && performance.length > 0 && (console.groupCollapsed(title),
                            console.table ? console.table(performance) : $.each(performance, function(index, data) {
                                console.log(data.Name + ": " + data["Execution Time"] + "ms")
                            }),
                            console.groupEnd()),
                            performance = []
                    }
                },
                invoke: function(query, passedArguments, context) {
                    var maxDepth, found, response, object = instance;
                    return passedArguments = passedArguments || queryArguments,
                        context = element || context,
                    "string" == typeof query && object !== undefined && (query = query.split(/[\. ]/),
                        maxDepth = query.length - 1,
                        $.each(query, function(depth, value) {
                            var camelCaseValue = depth != maxDepth ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1) : query;
                            if ($.isPlainObject(object[camelCaseValue]) && depth != maxDepth)
                                object = object[camelCaseValue];
                            else {
                                if (object[camelCaseValue] !== undefined)
                                    return found = object[camelCaseValue],
                                        !1;
                                if (!$.isPlainObject(object[value]) || depth == maxDepth)
                                    return object[value] !== undefined ? (found = object[value],
                                        !1) : !1;
                                object = object[value]
                            }
                        })),
                        $.isFunction(found) ? response = found.apply(context, passedArguments) : found !== undefined && (response = found),
                        $.isArray(returnedValue) ? returnedValue.push(response) : returnedValue !== undefined ? returnedValue = [returnedValue, response] : response !== undefined && (returnedValue = response),
                        found
                }
            },
                methodInvoked ? (instance === undefined && module.initialize(),
                    module.invoke(query)) : (instance !== undefined && module.destroy(),
                    module.initialize()),
                returnedValue !== undefined ? returnedValue : this
        }
            ,
            $.fn.apiButton = function(parameters) {
                return $(this).each(function() {
                    var module, $module = $(this), selector = $(this).selector || "", settings = $.isFunction(parameters) ? $.extend(!0, {}, $.api.settings, $.fn.apiButton.settings, {
                        stateContext: this,
                        success: parameters
                    }) : $.extend(!0, {}, $.api.settings, $.fn.apiButton.settings, {
                        stateContext: this
                    }, parameters);
                    module = {
                        initialize: function() {
                            settings.context && "" !== selector ? $(settings.context).on(selector, "click." + settings.namespace, module.click) : $module.on("click." + settings.namespace, module.click)
                        },
                        click: function() {
                            settings.filter && 0 !== $(this).filter(settings.filter).size() || $.proxy($.api, this)(settings)
                        }
                    },
                        module.initialize()
                }),
                    this
            }
            ,
            $.api.settings = {
                name: "API",
                namespace: "api",
                debug: !0,
                verbose: !0,
                performance: !0,
                api: {},
                beforeSend: function(settings) {
                    return settings
                },
                beforeXHR: function(xhr) {},
                success: function(response) {},
                complete: function(response) {},
                failure: function(errorCode) {},
                progress: !1,
                error: {
                    missingAction: "API action used but no url was defined",
                    missingURL: "URL not specified for the API action",
                    missingParameter: "Missing an essential URL parameter: ",
                    timeout: "Your request timed out",
                    error: "There was an error with your request",
                    parseError: "There was an error parsing your request",
                    JSONParse: "JSON could not be parsed during error handling",
                    statusMessage: "Server gave an error: ",
                    beforeSend: "The before send function has aborted the request",
                    exitConditions: "API Request Aborted. Exit conditions met"
                },
                className: {
                    loading: "loading",
                    error: "error"
                },
                metadata: {
                    action: "action",
                    promise: "promise",
                    xhr: "xhr"
                },
                regExpTemplate: /\{\$([A-z]+)\}/g,
                action: !1,
                url: !1,
                urlData: !1,
                serializeForm: !1,
                stateContext: !1,
                method: "get",
                data: {},
                dataType: "json",
                cache: !0,
                loadingLength: 200,
                errorLength: 2e3
            },
            $.fn.apiButton.settings = {
                filter: ".disabled, .loading",
                context: !1,
                stateContext: !1
            }
    }(jQuery, window, document),
    function($, window, document, undefined) {
        $.fn.colorize = function(parameters) {
            var settings = $.extend(!0, {}, $.fn.colorize.settings, parameters)
                , moduleArguments = arguments || !1;
            return $(this).each(function(instanceIndex) {
                var mainContext, imageContext, overlayContext, image, imageName, width, height, module, $module = $(this), mainCanvas = $("<canvas />")[0], imageCanvas = $("<canvas />")[0], overlayCanvas = $("<canvas />")[0], backgroundImage = new Image, colors = settings.colors, namespace = (settings.paths,
                    settings.namespace), error = settings.error, instance = $module.data("module-" + namespace);
                return module = {
                    checkPreconditions: function() {
                        return module.debug("Checking pre-conditions"),
                            !$.isPlainObject(colors) || $.isEmptyObject(colors) ? (module.error(error.undefinedColors),
                                !1) : !0
                    },
                    async: function(callback) {
                        settings.async ? setTimeout(callback, 0) : callback()
                    },
                    getMetadata: function() {
                        module.debug("Grabbing metadata"),
                            image = $module.data("image") || settings.image || undefined,
                            imageName = $module.data("name") || settings.name || instanceIndex,
                            width = settings.width || $module.width(),
                            height = settings.height || $module.height(),
                        (0 === width || 0 === height) && module.error(error.undefinedSize)
                    },
                    initialize: function() {
                        module.debug("Initializing with colors", colors),
                        module.checkPreconditions() && module.async(function() {
                            module.getMetadata(),
                                module.canvas.create(),
                                module.draw.image(function() {
                                    module.draw.colors(),
                                        module.canvas.merge()
                                }),
                                $module.data("module-" + namespace, module)
                        })
                    },
                    redraw: function() {
                        module.debug("Redrawing image"),
                            module.async(function() {
                                module.canvas.clear(),
                                    module.draw.colors(),
                                    module.canvas.merge()
                            })
                    },
                    change: {
                        color: function(colorName, color) {
                            return module.debug("Changing color", colorName),
                                colors[colorName] === undefined ? (module.error(error.missingColor),
                                    !1) : (colors[colorName] = color,
                                    void module.redraw())
                        }
                    },
                    canvas: {
                        create: function() {
                            module.debug("Creating canvases"),
                                mainCanvas.width = width,
                                mainCanvas.height = height,
                                imageCanvas.width = width,
                                imageCanvas.height = height,
                                overlayCanvas.width = width,
                                overlayCanvas.height = height,
                                mainContext = mainCanvas.getContext("2d"),
                                imageContext = imageCanvas.getContext("2d"),
                                overlayContext = overlayCanvas.getContext("2d"),
                                $module.append(mainCanvas),
                                mainContext = $module.children("canvas")[0].getContext("2d")
                        },
                        clear: function(context) {
                            module.debug("Clearing canvas"),
                                overlayContext.fillStyle = "#FFFFFF",
                                overlayContext.fillRect(0, 0, width, height)
                        },
                        merge: function() {
                            return $.isFunction(mainContext.blendOnto) ? (mainContext.putImageData(imageContext.getImageData(0, 0, width, height), 0, 0),
                                void overlayContext.blendOnto(mainContext, "multiply")) : void module.error(error.missingPlugin)
                        }
                    },
                    draw: {
                        image: function(callback) {
                            module.debug("Drawing image"),
                                callback = callback || function() {}
                                ,
                                image ? (backgroundImage.src = image,
                                        backgroundImage.onload = function() {
                                            imageContext.drawImage(backgroundImage, 0, 0),
                                                callback()
                                        }
                                ) : (module.error(error.noImage),
                                    callback())
                        },
                        colors: function() {
                            module.debug("Drawing color overlays", colors),
                                $.each(colors, function(colorName, color) {
                                    settings.onDraw(overlayContext, imageName, colorName, color)
                                })
                        }
                    },
                    debug: function(message, variableName) {
                        settings.debug && (variableName !== undefined ? console.info(settings.name + ": " + message, variableName) : console.info(settings.name + ": " + message))
                    },
                    error: function(errorMessage) {
                        console.warn(settings.name + ": " + errorMessage)
                    },
                    invoke: function(methodName, context, methodArguments) {
                        var method;
                        return methodArguments = methodArguments || Array.prototype.slice.call(arguments, 2),
                        "string" == typeof methodName && instance !== undefined && (methodName = methodName.split("."),
                            $.each(methodName, function(index, name) {
                                return $.isPlainObject(instance[name]) ? (instance = instance[name],
                                    !0) : $.isFunction(instance[name]) ? (method = instance[name],
                                    !0) : (module.error(settings.error.method),
                                    !1)
                            })),
                            $.isFunction(method) ? method.apply(context, methodArguments) : !1
                    }
                },
                    instance !== undefined && moduleArguments ? ("invoke" == moduleArguments[0] && (moduleArguments = Array.prototype.slice.call(moduleArguments, 1)),
                        module.invoke(moduleArguments[0], this, Array.prototype.slice.call(moduleArguments, 1))) : void module.initialize()
            }),
                this
        }
            ,
            $.fn.colorize.settings = {
                name: "Image Colorizer",
                debug: !0,
                namespace: "colorize",
                onDraw: function(overlayContext, imageName, colorName, color) {},
                async: !0,
                colors: {},
                metadata: {
                    image: "image",
                    name: "name"
                },
                error: {
                    noImage: "No tracing image specified",
                    undefinedColors: "No default colors specified.",
                    missingColor: "Attempted to change color that does not exist",
                    missingPlugin: "Blend onto plug-in must be included",
                    undefinedHeight: "The width or height of image canvas could not be automatically determined. Please specify a height."
                }
            }
    }(jQuery, window, document),
    function($, window, document, undefined) {
        $.fn.form = function(fields, parameters) {
            var returnedValue, $allModules = $(this), settings = $.extend(!0, {}, $.fn.form.settings, parameters), validation = $.extend({}, $.fn.form.settings.defaults, fields), namespace = settings.namespace, metadata = settings.metadata, selector = settings.selector, className = settings.className, eventNamespace = (settings.error,
            "." + namespace), moduleNamespace = "module-" + namespace, moduleSelector = $allModules.selector || "", time = (new Date).getTime(), performance = [], query = arguments[0], methodInvoked = "string" == typeof query, queryArguments = [].slice.call(arguments, 1);
            return $allModules.each(function() {
                var module, $module = $(this), $field = $(this).find(selector.field), $group = $(this).find(selector.group), $message = $(this).find(selector.message), $submit = ($(this).find(selector.prompt),
                    $(this).find(selector.submit)), formErrors = [], element = this, instance = $module.data(moduleNamespace);
                module = {
                    initialize: function() {
                        module.verbose("Initializing form validation", $module, validation, settings),
                            module.bindEvents(),
                            module.instantiate()
                    },
                    instantiate: function() {
                        module.verbose("Storing instance of module", module),
                            instance = module,
                            $module.data(moduleNamespace, module)
                    },
                    destroy: function() {
                        module.verbose("Destroying previous module", instance),
                            module.removeEvents(),
                            $module.removeData(moduleNamespace)
                    },
                    refresh: function() {
                        module.verbose("Refreshing selector cache"),
                            $field = $module.find(selector.field)
                    },
                    submit: function() {
                        module.verbose("Submitting form", $module),
                            $module.submit()
                    },
                    bindEvents: function() {
                        settings.keyboardShortcuts && $field.on("keydown" + eventNamespace, module.event.field.keydown),
                            $module.on("submit" + eventNamespace, module.validate.form),
                            $field.on("blur" + eventNamespace, module.event.field.blur),
                            $submit.on("click" + eventNamespace, module.submit),
                            $field.each(function() {
                                var type = $(this).prop("type")
                                    , inputEvent = module.get.changeEvent(type);
                                $(this).on(inputEvent + eventNamespace, module.event.field.change)
                            })
                    },
                    removeEvents: function() {
                        $module.off(eventNamespace),
                            $field.off(eventNamespace),
                            $submit.off(eventNamespace),
                            $field.off(eventNamespace)
                    },
                    event: {
                        field: {
                            keydown: function(event) {
                                var $field = $(this)
                                    , key = event.which
                                    , keyCode = {
                                    enter: 13,
                                    escape: 27
                                };
                                return key == keyCode.escape && (module.verbose("Escape key pressed blurring field"),
                                    $field.blur()),
                                    !event.ctrlKey && key == keyCode.enter && $field.is(selector.input) ? (module.debug("Enter key pressed, submitting form"),
                                        $submit.addClass(className.down),
                                        $field.one("keyup" + eventNamespace, module.event.field.keyup),
                                        event.preventDefault(),
                                        !1) : void 0
                            },
                            keyup: function() {
                                module.verbose("Doing keyboard shortcut form submit"),
                                    $submit.removeClass(className.down),
                                    module.submit()
                            },
                            blur: function() {
                                var $field = $(this)
                                    , $fieldGroup = $field.closest($group);
                                $fieldGroup.hasClass(className.error) ? (module.debug("Revalidating field", $field, module.get.validation($field)),
                                    module.validate.field(module.get.validation($field))) : ("blur" == settings.on || "change" == settings.on) && module.validate.field(module.get.validation($field))
                            },
                            change: function() {
                                var $field = $(this)
                                    , $fieldGroup = $field.closest($group);
                                ("change" == settings.on || $fieldGroup.hasClass(className.error) && settings.revalidate) && (clearTimeout(module.timer),
                                    module.timer = setTimeout(function() {
                                        module.debug("Revalidating field", $field, module.get.validation($field)),
                                            module.validate.field(module.get.validation($field))
                                    }, settings.delay))
                            }
                        }
                    },
                    get: {
                        changeEvent: function(type) {
                            return "checkbox" == type || "radio" == type || "hidden" == type ? "change" : document.createElement("input").oninput !== undefined ? "input" : document.createElement("input").onpropertychange !== undefined ? "propertychange" : "keyup"
                        },
                        field: function(identifier) {
                            return module.verbose("Finding field with identifier", identifier),
                                $field.filter("#" + identifier).size() > 0 ? $field.filter("#" + identifier) : $field.filter('[name="' + identifier + '"]').size() > 0 ? $field.filter('[name="' + identifier + '"]') : $field.filter("[data-" + metadata.validate + '="' + identifier + '"]').size() > 0 ? $field.filter("[data-" + metadata.validate + '="' + identifier + '"]') : $("<input/>")
                        },
                        validation: function($field) {
                            var rules;
                            return $.each(validation, function(fieldName, field) {
                                module.get.field(field.identifier).get(0) == $field.get(0) && (rules = field)
                            }),
                            rules || !1
                        }
                    },
                    has: {
                        field: function(identifier) {
                            return module.verbose("Checking for existence of a field with identifier", identifier),
                                $field.filter("#" + identifier).size() > 0 ? !0 : $field.filter('[name="' + identifier + '"]').size() > 0 ? !0 : $field.filter("[data-" + metadata.validate + '="' + identifier + '"]').size() > 0 ? !0 : !1
                        }
                    },
                    add: {
                        prompt: function(identifier, errors) {
                            var $field = module.get.field(identifier)
                                , $fieldGroup = $field.closest($group)
                                , $prompt = $fieldGroup.find(selector.prompt)
                                , promptExists = 0 !== $prompt.size();
                            errors = "string" == typeof errors ? [errors] : errors,
                                module.verbose("Adding field error state", identifier),
                                $fieldGroup.addClass(className.error),
                            settings.inline && (promptExists || ($prompt = settings.templates.prompt(errors),
                                $prompt.appendTo($fieldGroup)),
                                $prompt.html(errors[0]),
                                promptExists ? module.verbose("Inline errors are disabled, no inline error added", identifier) : settings.transition && $.fn.transition !== undefined && $module.transition("is supported") ? (module.verbose("Displaying error with css transition", settings.transition),
                                    $prompt.transition(settings.transition + " in", settings.duration)) : (module.verbose("Displaying error with fallback javascript animation"),
                                    $prompt.fadeIn(settings.duration)))
                        },
                        errors: function(errors) {
                            module.debug("Adding form error messages", errors),
                                $message.html(settings.templates.error(errors))
                        }
                    },
                    remove: {
                        prompt: function(field) {
                            var $field = module.get.field(field.identifier)
                                , $fieldGroup = $field.closest($group)
                                , $prompt = $fieldGroup.find(selector.prompt);
                            $fieldGroup.removeClass(className.error),
                            settings.inline && $prompt.is(":visible") && (module.verbose("Removing prompt for field", field),
                                settings.transition && $.fn.transition !== undefined && $module.transition("is supported") ? $prompt.transition(settings.transition + " out", settings.duration, function() {
                                    $prompt.remove()
                                }) : $prompt.fadeOut(settings.duration, function() {
                                    $prompt.remove()
                                }))
                        }
                    },
                    validate: {
                        form: function(event) {
                            var allValid = !0;
                            return formErrors = [],
                                $.each(validation, function(fieldName, field) {
                                    module.validate.field(field) || (allValid = !1)
                                }),
                                allValid ? (module.debug("Form has no validation errors, submitting"),
                                    $module.removeClass(className.error).addClass(className.success),
                                    $.proxy(settings.onSuccess, this)(event)) : (module.debug("Form has errors"),
                                    $module.addClass(className.error),
                                settings.inline || module.add.errors(formErrors),
                                    $.proxy(settings.onFailure, this)(formErrors))
                        },
                        field: function(field) {
                            var $field = module.get.field(field.identifier)
                                , fieldValid = !0
                                , fieldErrors = [];
                            return field.rules !== undefined && $.each(field.rules, function(index, rule) {
                                module.has.field(field.identifier) && !module.validate.rule(field, rule) && (module.debug("Field is invalid", field.identifier, rule.type),
                                    fieldErrors.push(rule.prompt),
                                    fieldValid = !1)
                            }),
                                fieldValid ? (module.remove.prompt(field, fieldErrors),
                                    $.proxy(settings.onValid, $field)(),
                                    !0) : (formErrors = formErrors.concat(fieldErrors),
                                    module.add.prompt(field.identifier, fieldErrors),
                                    $.proxy(settings.onInvalid, $field)(fieldErrors),
                                    !1)
                        },
                        rule: function(field, validation) {
                            var ancillary, functionType, $field = module.get.field(field.identifier), type = validation.type, value = $.trim($field.val() + ""), bracketRegExp = /\[(.*)\]/i, bracket = bracketRegExp.exec(type), isValid = !0;
                            return bracket !== undefined && null  !== bracket ? (ancillary = "" + bracket[1],
                                functionType = type.replace(bracket[0], ""),
                                isValid = $.proxy(settings.rules[functionType], $module)(value, ancillary)) : isValid = $.proxy(settings.rules[type], $field)(value),
                                isValid
                        }
                    },
                    setting: function(name, value) {
                        if ($.isPlainObject(name))
                            $.extend(!0, settings, name);
                        else {
                            if (value === undefined)
                                return settings[name];
                            settings[name] = value
                        }
                    },
                    internal: function(name, value) {
                        if ($.isPlainObject(name))
                            $.extend(!0, module, name);
                        else {
                            if (value === undefined)
                                return module[name];
                            module[name] = value
                        }
                    },
                    debug: function() {
                        settings.debug && (settings.performance ? module.performance.log(arguments) : (module.debug = Function.prototype.bind.call(console.info, console, settings.name + ":"),
                            module.debug.apply(console, arguments)))
                    },
                    verbose: function() {
                        settings.verbose && settings.debug && (settings.performance ? module.performance.log(arguments) : (module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ":"),
                            module.verbose.apply(console, arguments)))
                    },
                    error: function() {
                        module.error = Function.prototype.bind.call(console.error, console, settings.name + ":"),
                            module.error.apply(console, arguments)
                    },
                    performance: {
                        log: function(message) {
                            var currentTime, executionTime, previousTime;
                            settings.performance && (currentTime = (new Date).getTime(),
                                previousTime = time || currentTime,
                                executionTime = currentTime - previousTime,
                                time = currentTime,
                                performance.push({
                                    Element: element,
                                    Name: message[0],
                                    Arguments: [].slice.call(message, 1) || "",
                                    "Execution Time": executionTime
                                })),
                                clearTimeout(module.performance.timer),
                                module.performance.timer = setTimeout(module.performance.display, 100)
                        },
                        display: function() {
                            var title = settings.name + ":"
                                , totalTime = 0;
                            time = !1,
                                clearTimeout(module.performance.timer),
                                $.each(performance, function(index, data) {
                                    totalTime += data["Execution Time"]
                                }),
                                title += " " + totalTime + "ms",
                            moduleSelector && (title += " '" + moduleSelector + "'"),
                            $allModules.size() > 1 && (title += " (" + $allModules.size() + ")"),
                            (console.group !== undefined || console.table !== undefined) && performance.length > 0 && (console.groupCollapsed(title),
                                console.table ? console.table(performance) : $.each(performance, function(index, data) {
                                    console.log(data.Name + ": " + data["Execution Time"] + "ms")
                                }),
                                console.groupEnd()),
                                performance = []
                        }
                    },
                    invoke: function(query, passedArguments, context) {
                        var maxDepth, found, response, object = instance;
                        return passedArguments = passedArguments || queryArguments,
                            context = element || context,
                        "string" == typeof query && object !== undefined && (query = query.split(/[\. ]/),
                            maxDepth = query.length - 1,
                            $.each(query, function(depth, value) {
                                var camelCaseValue = depth != maxDepth ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1) : query;
                                if ($.isPlainObject(object[camelCaseValue]) && depth != maxDepth)
                                    object = object[camelCaseValue];
                                else {
                                    if (object[camelCaseValue] !== undefined)
                                        return found = object[camelCaseValue],
                                            !1;
                                    if (!$.isPlainObject(object[value]) || depth == maxDepth)
                                        return object[value] !== undefined ? (found = object[value],
                                            !1) : !1;
                                    object = object[value]
                                }
                            })),
                            $.isFunction(found) ? response = found.apply(context, passedArguments) : found !== undefined && (response = found),
                            $.isArray(returnedValue) ? returnedValue.push(response) : returnedValue !== undefined ? returnedValue = [returnedValue, response] : response !== undefined && (returnedValue = response),
                            found
                    }
                },
                    methodInvoked ? (instance === undefined && module.initialize(),
                        module.invoke(query)) : (instance !== undefined && module.destroy(),
                        module.initialize())
            }),
                returnedValue !== undefined ? returnedValue : this
        }
            ,
            $.fn.form.settings = {
                name: "Form",
                namespace: "form",
                debug: !0,
                verbose: !0,
                performance: !0,
                keyboardShortcuts: !0,
                on: "submit",
                inline: !1,
                delay: 200,
                revalidate: !0,
                transition: "scale",
                duration: 150,
                onValid: function() {},
                onInvalid: function() {},
                onSuccess: function() {
                    return !0
                },
                onFailure: function() {
                    return !1
                },
                metadata: {
                    validate: "validate"
                },
                selector: {
                    message: ".error.message",
                    field: "input, textarea, select",
                    group: ".field",
                    input: "input",
                    prompt: ".prompt",
                    submit: '.submit:not([type="submit"])'
                },
                className: {
                    error: "error",
                    success: "success",
                    down: "down",
                    label: "ui label prompt"
                },
                error: {
                    method: "The method you called is not defined."
                },
                templates: {
                    error: function(errors) {
                        var html = '<ul class="list">';
                        return $.each(errors, function(index, value) {
                            html += "<li>" + value + "</li>"
                        }),
                            html += "</ul>",
                            $(html)
                    },
                    prompt: function(errors) {
                        return $("<div/>").addClass("ui red pointing prompt label").html(errors[0])
                    }
                },
                rules: {
                    checked: function() {
                        return $(this).filter(":checked").size() > 0
                    },
                    empty: function(value) {
                        return !(value === undefined || "" === value)
                    },
                    email: function(value) {
                        var emailRegExp = new RegExp("[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?","i");
                        return emailRegExp.test(value)
                    },
                    length: function(value, requiredLength) {
                        return value !== undefined ? value.length >= requiredLength : !1
                    },
                    not: function(value, notValue) {
                        return value != notValue
                    },
                    contains: function(value, text) {
                        return text = text.replace(/[\-\[\]\/\{\}\(\)\*\+\?\.\\\^\$\|]/g, "\\$&"),
                        -1 !== value.search(text)
                    },
                    is: function(value, text) {
                        return value == text
                    },
                    maxLength: function(value, maxLength) {
                        return value !== undefined ? value.length <= maxLength : !1
                    },
                    match: function(value, fieldIdentifier) {
                        var matchingValue, $form = $(this);
                        return $form.find("#" + fieldIdentifier).size() > 0 ? matchingValue = $form.find("#" + fieldIdentifier).val() : $form.find("[name=" + fieldIdentifier + "]").size() > 0 ? matchingValue = $form.find("[name=" + fieldIdentifier + "]").val() : $form.find('[data-validate="' + fieldIdentifier + '"]').size() > 0 && (matchingValue = $form.find('[data-validate="' + fieldIdentifier + '"]').val()),
                            matchingValue !== undefined ? value.toString() == matchingValue.toString() : !1
                    },
                    url: function(value) {
                        var urlRegExp = /(ftp|http|https):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
                        return urlRegExp.test(value)
                    }
                }
            }
    }(jQuery, window, document),
    function($, window, document, undefined) {
        $.fn.state = function(parameters) {
            var returnedValue, $allModules = $(this), settings = $.extend(!0, {}, $.fn.state.settings, parameters), moduleSelector = $allModules.selector || "", time = (new Date).getTime(), performance = [], query = arguments[0], methodInvoked = "string" == typeof query, queryArguments = [].slice.call(arguments, 1), metadata = (settings.error,
                settings.metadata), className = settings.className, namespace = settings.namespace, states = settings.states, text = settings.text, eventNamespace = "." + namespace, moduleNamespace = namespace + "-module";
            return $allModules.each(function() {
                var module, $module = $(this), element = this, instance = $module.data(moduleNamespace);
                module = {
                    initialize: function() {
                        module.verbose("Initializing module"),
                        settings.automatic && module.add.defaults(),
                            settings.context && "" !== moduleSelector ? (module.allows("hover") && $(element, settings.context).on(moduleSelector, "mouseenter" + eventNamespace, module.enable.hover).on(moduleSelector, "mouseleave" + eventNamespace, module.disable.hover),
                            module.allows("down") && $(element, settings.context).on(moduleSelector, "mousedown" + eventNamespace, module.enable.down).on(moduleSelector, "mouseup" + eventNamespace, module.disable.down),
                            module.allows("focus") && $(element, settings.context).on(moduleSelector, "focus" + eventNamespace, module.enable.focus).on(moduleSelector, "blur" + eventNamespace, module.disable.focus),
                                $(settings.context).on(moduleSelector, "mouseenter" + eventNamespace, module.change.text).on(moduleSelector, "mouseleave" + eventNamespace, module.reset.text).on(moduleSelector, "click" + eventNamespace, module.toggle.state)) : (module.allows("hover") && $module.on("mouseenter" + eventNamespace, module.enable.hover).on("mouseleave" + eventNamespace, module.disable.hover),
                            module.allows("down") && $module.on("mousedown" + eventNamespace, module.enable.down).on("mouseup" + eventNamespace, module.disable.down),
                            module.allows("focus") && $module.on("focus" + eventNamespace, module.enable.focus).on("blur" + eventNamespace, module.disable.focus),
                                $module.on("mouseenter" + eventNamespace, module.change.text).on("mouseleave" + eventNamespace, module.reset.text).on("click" + eventNamespace, module.toggle.state)),
                            module.instantiate()
                    },
                    instantiate: function() {
                        module.verbose("Storing instance of module", module),
                            instance = module,
                            $module.data(moduleNamespace, module)
                    },
                    destroy: function() {
                        module.verbose("Destroying previous module", instance),
                            $module.off(eventNamespace).removeData(moduleNamespace)
                    },
                    refresh: function() {
                        module.verbose("Refreshing selector cache"),
                            $module = $(element)
                    },
                    add: {
                        defaults: function() {
                            var userStates = parameters && $.isPlainObject(parameters.states) ? parameters.states : {};
                            $.each(settings.defaults, function(type, typeStates) {
                                module.is[type] !== undefined && module.is[type]() && (module.verbose("Adding default states", type, element),
                                    $.extend(settings.states, typeStates, userStates))
                            })
                        }
                    },
                    is: {
                        active: function() {
                            return $module.hasClass(className.active)
                        },
                        loading: function() {
                            return $module.hasClass(className.loading)
                        },
                        inactive: function() {
                            return !$module.hasClass(className.active)
                        },
                        enabled: function() {
                            return !$module.is(settings.filter.active)
                        },
                        disabled: function() {
                            return $module.is(settings.filter.active)
                        },
                        textEnabled: function() {
                            return !$module.is(settings.filter.text)
                        },
                        button: function() {
                            return $module.is(".button:not(a, .submit)")
                        },
                        input: function() {
                            return $module.is("input")
                        }
                    },
                    allow: function(state) {
                        module.debug("Now allowing state", state),
                            states[state] = !0
                    },
                    disallow: function(state) {
                        module.debug("No longer allowing", state),
                            states[state] = !1
                    },
                    allows: function(state) {
                        return states[state] || !1
                    },
                    enable: {
                        state: function(state) {
                            module.allows(state) && $module.addClass(className[state])
                        },
                        focus: function() {
                            $module.addClass(className.focus)
                        },
                        hover: function() {
                            $module.addClass(className.hover)
                        },
                        down: function() {
                            $module.addClass(className.down)
                        }
                    },
                    disable: {
                        state: function(state) {
                            module.allows(state) && $module.removeClass(className[state])
                        },
                        focus: function() {
                            $module.removeClass(className.focus)
                        },
                        hover: function() {
                            $module.removeClass(className.hover)
                        },
                        down: function() {
                            $module.removeClass(className.down)
                        }
                    },
                    toggle: {
                        state: function() {
                            var apiRequest = $module.data(metadata.promise);
                            module.allows("active") && module.is.enabled() && (module.refresh(),
                                apiRequest !== undefined ? module.listenTo(apiRequest) : module.change.state())
                        }
                    },
                    listenTo: function(apiRequest) {
                        module.debug("API request detected, waiting for state signal", apiRequest),
                            apiRequest ? (text.loading && module.update.text(text.loading),
                                $.when(apiRequest).then(function() {
                                    "resolved" == apiRequest.state() ? (module.debug("API request succeeded"),
                                            settings.activateTest = function() {
                                                return !0
                                            }
                                            ,
                                            settings.deactivateTest = function() {
                                                return !0
                                            }
                                    ) : (module.debug("API request failed"),
                                            settings.activateTest = function() {
                                                return !1
                                            }
                                            ,
                                            settings.deactivateTest = function() {
                                                return !1
                                            }
                                    ),
                                        module.change.state()
                                })) : (settings.activateTest = function() {
                                    return !1
                                }
                                    ,
                                    settings.deactivateTest = function() {
                                        return !1
                                    }
                            )
                    },
                    change: {
                        state: function() {
                            module.debug("Determining state change direction"),
                                module.is.inactive() ? module.activate() : module.deactivate(),
                            settings.sync && module.sync(),
                                $.proxy(settings.onChange, element)()
                        },
                        text: function() {
                            module.is.textEnabled() && (module.is.active() ? text.hover ? (module.verbose("Changing text to hover text", text.hover),
                                module.update.text(text.hover)) : text.disable && (module.verbose("Changing text to disable text", text.disable),
                                module.update.text(text.disable)) : text.hover ? (module.verbose("Changing text to hover text", text.disable),
                                module.update.text(text.hover)) : text.enable && (module.verbose("Changing text to enable text", text.enable),
                                module.update.text(text.enable)))
                        }
                    },
                    activate: function() {
                        $.proxy(settings.activateTest, element)() && (module.debug("Setting state to active"),
                            $module.addClass(className.active),
                            module.update.text(text.active)),
                            $.proxy(settings.onActivate, element)()
                    },
                    deactivate: function() {
                        $.proxy(settings.deactivateTest, element)() && (module.debug("Setting state to inactive"),
                            $module.removeClass(className.active),
                            module.update.text(text.inactive)),
                            $.proxy(settings.onDeactivate, element)()
                    },
                    sync: function() {
                        module.verbose("Syncing other buttons to current state"),
                            module.is.active() ? $allModules.not($module).state("activate") : $allModules.not($module).state("deactivate")
                    },
                    get: {
                        text: function() {
                            return settings.selector.text ? $module.find(settings.selector.text).text() : $module.html()
                        },
                        textFor: function(state) {
                            return text[state] || !1
                        }
                    },
                    flash: {
                        text: function(text, duration) {
                            var previousText = module.get.text();
                            module.debug("Flashing text message", text, duration),
                                text = text || settings.text.flash,
                                duration = duration || settings.flashDuration,
                                module.update.text(text),
                                setTimeout(function() {
                                    module.update.text(previousText)
                                }, duration)
                        }
                    },
                    reset: {
                        text: function() {
                            var activeText = text.active || $module.data(metadata.storedText)
                                , inactiveText = text.inactive || $module.data(metadata.storedText);
                            module.is.textEnabled() && (module.is.active() && activeText ? (module.verbose("Resetting active text", activeText),
                                module.update.text(activeText)) : inactiveText && (module.verbose("Resetting inactive text", activeText),
                                module.update.text(inactiveText)))
                        }
                    },
                    update: {
                        text: function(text) {
                            var currentText = module.get.text();
                            text && text !== currentText ? (module.debug("Updating text", text),
                                settings.selector.text ? $module.data(metadata.storedText, text).find(settings.selector.text).text(text) : $module.data(metadata.storedText, text).html(text)) : module.debug("Text is already sane, ignoring update", text)
                        }
                    },
                    setting: function(name, value) {
                        return module.debug("Changing setting", name, value),
                            value === undefined ? settings[name] : void ($.isPlainObject(name) ? $.extend(!0, settings, name) : settings[name] = value)
                    },
                    internal: function(name, value) {
                        return module.debug("Changing internal", name, value),
                            value === undefined ? module[name] : void ($.isPlainObject(name) ? $.extend(!0, module, name) : module[name] = value)
                    },
                    debug: function() {
                        settings.debug && (settings.performance ? module.performance.log(arguments) : (module.debug = Function.prototype.bind.call(console.info, console, settings.name + ":"),
                            module.debug.apply(console, arguments)))
                    },
                    verbose: function() {
                        settings.verbose && settings.debug && (settings.performance ? module.performance.log(arguments) : (module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ":"),
                            module.verbose.apply(console, arguments)))
                    },
                    error: function() {
                        module.error = Function.prototype.bind.call(console.error, console, settings.name + ":"),
                            module.error.apply(console, arguments)
                    },
                    performance: {
                        log: function(message) {
                            var currentTime, executionTime, previousTime;
                            settings.performance && (currentTime = (new Date).getTime(),
                                previousTime = time || currentTime,
                                executionTime = currentTime - previousTime,
                                time = currentTime,
                                performance.push({
                                    Element: element,
                                    Name: message[0],
                                    Arguments: [].slice.call(message, 1) || "",
                                    "Execution Time": executionTime
                                })),
                                clearTimeout(module.performance.timer),
                                module.performance.timer = setTimeout(module.performance.display, 100)
                        },
                        display: function() {
                            var title = settings.name + ":"
                                , totalTime = 0;
                            time = !1,
                                clearTimeout(module.performance.timer),
                                $.each(performance, function(index, data) {
                                    totalTime += data["Execution Time"]
                                }),
                                title += " " + totalTime + "ms",
                            moduleSelector && (title += " '" + moduleSelector + "'"),
                            $allModules.size() > 1 && (title += " (" + $allModules.size() + ")"),
                            (console.group !== undefined || console.table !== undefined) && performance.length > 0 && (console.groupCollapsed(title),
                                console.table ? console.table(performance) : $.each(performance, function(index, data) {
                                    console.log(data.Name + ": " + data["Execution Time"] + "ms")
                                }),
                                console.groupEnd()),
                                performance = []
                        }
                    },
                    invoke: function(query, passedArguments, context) {
                        var maxDepth, found, response, object = instance;
                        return passedArguments = passedArguments || queryArguments,
                            context = element || context,
                        "string" == typeof query && object !== undefined && (query = query.split(/[\. ]/),
                            maxDepth = query.length - 1,
                            $.each(query, function(depth, value) {
                                var camelCaseValue = depth != maxDepth ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1) : query;
                                if ($.isPlainObject(object[camelCaseValue]) && depth != maxDepth)
                                    object = object[camelCaseValue];
                                else {
                                    if (object[camelCaseValue] !== undefined)
                                        return found = object[camelCaseValue],
                                            !1;
                                    if (!$.isPlainObject(object[value]) || depth == maxDepth)
                                        return object[value] !== undefined ? (found = object[value],
                                            !1) : !1;
                                    object = object[value]
                                }
                            })),
                            $.isFunction(found) ? response = found.apply(context, passedArguments) : found !== undefined && (response = found),
                            $.isArray(returnedValue) ? returnedValue.push(response) : returnedValue !== undefined ? returnedValue = [returnedValue, response] : response !== undefined && (returnedValue = response),
                            found
                    }
                },
                    methodInvoked ? (instance === undefined && module.initialize(),
                        module.invoke(query)) : (instance !== undefined && module.destroy(),
                        module.initialize())
            }),
                returnedValue !== undefined ? returnedValue : this
        }
            ,
            $.fn.state.settings = {
                name: "State",
                debug: !0,
                verbose: !0,
                namespace: "state",
                performance: !0,
                onActivate: function() {},
                onDeactivate: function() {},
                onChange: function() {},
                activateTest: function() {
                    return !0
                },
                deactivateTest: function() {
                    return !0
                },
                automatic: !0,
                sync: !1,
                flashDuration: 3e3,
                filter: {
                    text: ".loading, .disabled",
                    active: ".disabled"
                },
                context: !1,
                error: {
                    method: "The method you called is not defined."
                },
                metadata: {
                    promise: "promise",
                    storedText: "stored-text"
                },
                className: {
                    focus: "focus",
                    hover: "hover",
                    down: "down",
                    active: "active",
                    loading: "loading"
                },
                selector: {
                    text: !1
                },
                defaults: {
                    input: {
                        hover: !0,
                        focus: !0,
                        down: !0,
                        loading: !1,
                        active: !1
                    },
                    button: {
                        hover: !0,
                        focus: !1,
                        down: !0,
                        active: !0,
                        loading: !0
                    }
                },
                states: {
                    hover: !0,
                    focus: !0,
                    down: !0,
                    loading: !1,
                    active: !1
                },
                text: {
                    flash: !1,
                    hover: !1,
                    active: !1,
                    inactive: !1,
                    enable: !1,
                    disable: !1
                }
            }
    }(jQuery, window, document),
    function($, window, document, undefined) {
        $.fn.chatroom = function(parameters) {
            var returnedValue, $allModules = $(this), moduleSelector = $allModules.selector || "", time = (new Date).getTime(), performance = [], query = arguments[0], methodInvoked = "string" == typeof query, queryArguments = [].slice.call(arguments, 1);
            return $(this).each(function() {
                var channel, loggedInUser, message, count, height, pusher, module, settings = $.extend(!0, {}, $.fn.chatroom.settings, parameters), className = settings.className, namespace = settings.namespace, selector = settings.selector, error = settings.error, $module = $(this), $expandButton = $module.find(selector.expandButton), $userListButton = $module.find(selector.userListButton), $userList = $module.find(selector.userList), $userCount = ($module.find(selector.room),
                    $module.find(selector.userCount)), $log = $module.find(selector.log), $messageInput = ($module.find(selector.message),
                    $module.find(selector.messageInput)), $messageButton = $module.find(selector.messageButton), instance = $module.data("module"), element = this, html = "", users = {};
                module = {
                    width: {
                        log: $log.width(),
                        userList: $userList.outerWidth()
                    },
                    initialize: function() {
                        return Pusher === undefined && module.error(error.pusher),
                            settings.key === undefined || settings.channelName === undefined ? (module.error(error.key),
                                !1) : settings.endpoint.message || settings.endpoint.authentication ? (pusher = new Pusher(settings.key),
                                Pusher.channel_auth_endpoint = settings.endpoint.authentication,
                                channel = pusher.subscribe(settings.channelName),
                                channel.bind("pusher:subscription_succeeded", module.user.list.create),
                                channel.bind("pusher:subscription_error", module.error),
                                channel.bind("pusher:member_added", module.user.joined),
                                channel.bind("pusher:member_removed", module.user.left),
                                channel.bind("update_messages", module.message.receive),
                                $.each(settings.customEvents, function(label, value) {
                                    channel.bind(label, value)
                                }),
                                $userListButton.on("click." + namespace, module.event.toggleUserList),
                                $expandButton.on("click." + namespace, module.event.toggleExpand),
                                $messageInput.on("keydown." + namespace, module.event.input.keydown).on("keyup." + namespace, module.event.input.keyup),
                                $messageButton.on("mouseenter." + namespace, module.event.hover).on("mouseleave." + namespace, module.event.hover).on("click." + namespace, module.event.submit),
                                $log.animate({
                                    scrollTop: $log.prop("scrollHeight")
                                }, 400),
                                void $module.data("module", module).addClass(className.loading)) : (module.error(error.endpoint),
                                !1)
                    },
                    refresh: function() {
                        $userListButton.removeClass(className.active),
                            module.width = {
                                log: $log.width(),
                                userList: $userList.outerWidth()
                            },
                        $userListButton.hasClass(className.active) && module.user.list.hide(),
                            $module.data("module", module)
                    },
                    user: {
                        updateCount: function() {
                            settings.userCount && (users = $module.data("users"),
                                count = 0,
                                $.each(users, function() {
                                    count++
                                }),
                                $userCount.html(settings.templates.userCount(count)))
                        },
                        joined: function(member) {
                            users = $module.data("users"),
                            "anonymous" != member.id && users[member.id] === undefined && (users[member.id] = member.info,
                            settings.randomColor && member.info.color === undefined && (member.info.color = settings.templates.color(member.id)),
                                html = settings.templates.userList(member.info),
                                member.info.isAdmin ? $(html).prependTo($userList) : $(html).appendTo($userList),
                            settings.partingMessages && ($log.append(settings.templates.joined(member.info)),
                                module.message.scroll.test()),
                                module.user.updateCount())
                        },
                        left: function(member) {
                            users = $module.data("users"),
                            member !== undefined && "anonymous" !== member.id && (delete users[member.id],
                                $module.data("users", users),
                                $userList.find("[data-id=" + member.id + "]").remove(),
                            settings.partingMessages && ($log.append(settings.templates.left(member.info)),
                                module.message.scroll.test()),
                                module.user.updateCount())
                        },
                        list: {
                            create: function(members) {
                                users = {},
                                    members.each(function(member) {
                                        "anonymous" !== member.id && "undefined" !== member.id && (settings.randomColor && member.info.color === undefined && (member.info.color = settings.templates.color(member.id)),
                                            html = member.info.isAdmin ? settings.templates.userList(member.info) + html : html + settings.templates.userList(member.info),
                                            users[member.id] = member.info)
                                    }),
                                    $module.data("users", users).data("user", users[members.me.id]).removeClass(className.loading),
                                    $userList.html(html),
                                    module.user.updateCount(),
                                    $.proxy(settings.onJoin, $userList.children())()
                            },
                            show: function() {
                                $log.animate({
                                    width: module.width.log - module.width.userList
                                }, {
                                    duration: settings.speed,
                                    easing: settings.easing,
                                    complete: module.message.scroll.move
                                })
                            },
                            hide: function() {
                                $log.stop().animate({
                                    width: module.width.log
                                }, {
                                    duration: settings.speed,
                                    easing: settings.easing,
                                    complete: module.message.scroll.move
                                })
                            }
                        }
                    },
                    message: {
                        scroll: {
                            test: function() {
                                height = $log.prop("scrollHeight") - $log.height(),
                                Math.abs($log.scrollTop() - height) < settings.scrollArea && module.message.scroll.move()
                            },
                            move: function() {
                                height = $log.prop("scrollHeight") - $log.height(),
                                    $log.scrollTop(height)
                            }
                        },
                        send: function(message) {
                            module.utils.emptyString(message) || $.api({
                                url: settings.endpoint.message,
                                method: "POST",
                                data: {
                                    message: {
                                        content: message,
                                        timestamp: (new Date).getTime()
                                    }
                                }
                            })
                        },
                        receive: function(response) {
                            message = response.data,
                                users = $module.data("users"),
                                loggedInUser = $module.data("user"),
                            users[message.userID] !== undefined && (loggedInUser === undefined || loggedInUser.id != message.userID) && (message.user = users[message.userID],
                                module.message.display(message))
                        },
                        display: function(message) {
                            $log.append(settings.templates.message(message)),
                                module.message.scroll.test(),
                                $.proxy(settings.onMessage, $log.children().last())()
                        }
                    },
                    expand: function() {
                        $module.addClass(className.expand),
                            $.proxy(settings.onExpand, $module)(),
                            module.refresh()
                    },
                    contract: function() {
                        $module.removeClass(className.expand),
                            $.proxy(settings.onContract, $module)(),
                            module.refresh()
                    },
                    event: {
                        input: {
                            keydown: function(event) {
                                13 == event.which && $messageButton.addClass(className.down)
                            },
                            keyup: function(event) {
                                13 == event.which && ($messageButton.removeClass(className.down),
                                    module.event.submit())
                            }
                        },
                        submit: function() {
                            var message = $messageInput.val()
                                , loggedInUser = $module.data("user");
                            loggedInUser === undefined || module.utils.emptyString(message) || (module.message.send(message),
                                module.message.display({
                                    user: loggedInUser,
                                    text: message
                                }),
                                module.message.scroll.move(),
                                $messageInput.val(""))
                        },
                        toggleExpand: function() {
                            $module.hasClass(className.expand) ? ($expandButton.removeClass(className.active),
                                module.contract()) : ($expandButton.addClass(className.active),
                                module.expand())
                        },
                        toggleUserList: function() {
                            $log.is(":animated") || ($userListButton.hasClass(className.active) ? ($userListButton.removeClass("active"),
                                module.user.list.hide()) : ($userListButton.addClass(className.active),
                                module.user.list.show()))
                        }
                    },
                    utils: {
                        emptyString: function(string) {
                            return "string" == typeof string ? -1 == string.search(/\S/) : !1
                        }
                    },
                    setting: function(name, value) {
                        return value === undefined ? settings[name] : void ($.isPlainObject(name) ? $.extend(!0, settings, name) : settings[name] = value)
                    },
                    internal: function(name, value) {
                        if ($.isPlainObject(name))
                            $.extend(!0, module, name);
                        else {
                            if (value === undefined)
                                return module[name];
                            module[name] = value
                        }
                    },
                    debug: function() {
                        settings.debug && (settings.performance ? module.performance.log(arguments) : (module.debug = Function.prototype.bind.call(console.info, console, settings.name + ":"),
                            module.debug.apply(console, arguments)))
                    },
                    verbose: function() {
                        settings.verbose && settings.debug && (settings.performance ? module.performance.log(arguments) : (module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ":"),
                            module.verbose.apply(console, arguments)))
                    },
                    error: function() {
                        module.error = Function.prototype.bind.call(console.error, console, settings.name + ":"),
                            module.error.apply(console, arguments)
                    },
                    performance: {
                        log: function(message) {
                            var currentTime, executionTime, previousTime;
                            settings.performance && (currentTime = (new Date).getTime(),
                                previousTime = time || currentTime,
                                executionTime = currentTime - previousTime,
                                time = currentTime,
                                performance.push({
                                    Element: element,
                                    Name: message[0],
                                    Arguments: [].slice.call(message, 1) || "",
                                    "Execution Time": executionTime
                                })),
                                clearTimeout(module.performance.timer),
                                module.performance.timer = setTimeout(module.performance.display, 100)
                        },
                        display: function() {
                            var title = settings.name + ":"
                                , totalTime = 0;
                            time = !1,
                                clearTimeout(module.performance.timer),
                                $.each(performance, function(index, data) {
                                    totalTime += data["Execution Time"]
                                }),
                                title += " " + totalTime + "ms",
                            moduleSelector && (title += " '" + moduleSelector + "'"),
                            (console.group !== undefined || console.table !== undefined) && performance.length > 0 && (console.groupCollapsed(title),
                                console.table ? console.table(performance) : $.each(performance, function(index, data) {
                                    console.log(data.Name + ": " + data["Execution Time"] + "ms")
                                }),
                                console.groupEnd()),
                                performance = []
                        }
                    },
                    invoke: function(query, passedArguments, context) {
                        var maxDepth, found;
                        return passedArguments = passedArguments || queryArguments,
                            context = element || context,
                        "string" == typeof query && instance !== undefined && (query = query.split(/[\. ]/),
                            maxDepth = query.length - 1,
                            $.each(query, function(depth, value) {
                                $.isPlainObject(instance[value]) && depth != maxDepth ? instance = instance[value] : instance[value] !== undefined ? found = instance[value] : module.error(error.method, query)
                            })),
                            $.isFunction(found) ? found.apply(context, passedArguments) : found || !1
                    }
                },
                    methodInvoked ? (instance === undefined && module.initialize(),
                        module.invoke(query)) : (instance !== undefined && module.destroy(),
                        module.initialize())
            }),
                returnedValue !== undefined ? returnedValue : this
        }
            ,
            $.fn.chatroom.settings = {
                name: "Chat",
                debug: !1,
                namespace: "chat",
                channel: "present-chat",
                onJoin: function() {},
                onMessage: function() {},
                onExpand: function() {},
                onContract: function() {},
                customEvents: {},
                partingMessages: !1,
                userCount: !0,
                randomColor: !0,
                speed: 300,
                easing: "easeOutQuint",
                scrollArea: 9999,
                endpoint: {
                    message: !1,
                    authentication: !1
                },
                error: {
                    method: "The method you called is not defined",
                    endpoint: "Please define a message and authentication endpoint.",
                    key: "You must specify a pusher key and channel.",
                    pusher: "You must include the Pusher library."
                },
                className: {
                    expand: "expand",
                    active: "active",
                    hover: "hover",
                    down: "down",
                    loading: "loading"
                },
                selector: {
                    userCount: ".actions .message",
                    userListButton: ".actions .list.button",
                    expandButton: ".actions .expand.button",
                    room: ".room",
                    userList: ".room .list",
                    log: ".room .log",
                    message: ".room .log .message",
                    author: ".room log .message .author",
                    messageInput: ".talk input",
                    messageButton: ".talk .send.button"
                },
                templates: {
                    userCount: function(number) {
                        return number + " users in chat"
                    },
                    color: function(userID) {
                        var colors = ["#000000", "#333333", "#666666", "#999999", "#CC9999", "#CC6666", "#CC3333", "#993333", "#663333", "#CC6633", "#CC9966", "#CC9933", "#999966", "#CCCC66", "#99CC66", "#669933", "#669966", "#33A3CC", "#336633", "#33CCCC", "#339999", "#336666", "#336699", "#6666CC", "#9966CC", "#333399", "#663366", "#996699", "#993366", "#CC6699"];
                        return colors[Math.floor(Math.random() * colors.length)]
                    },
                    message: function(message) {
                        var html = "";
                        return message.user.isAdmin ? (message.user.color = "#55356A",
                            html += '<div class="admin message">',
                            html += '<span class="quirky ui flag team"></span>') : html += '<div class="message">',
                            html += "<p>",
                            html += message.user.color !== undefined ? '<span class="author" style="color: ' + message.user.color + ';">' + message.user.name + "</span>: " : '<span class="author">' + message.user.name + "</span>: ",
                            html += "" + message.text + " </p></div>"
                    },
                    joined: function(member) {
                        return typeof member.name !== undefined ? '<div class="status">' + member.name + " has joined the chat.</div>" : !1
                    },
                    left: function(member) {
                        return typeof member.name !== undefined ? '<div class="status">' + member.name + " has left the chat.</div>" : !1
                    },
                    userList: function(member) {
                        var html = "";
                        return member.isAdmin && (member.color = "#55356A"),
                            html += '<div class="user" data-id="' + member.id + '"> <div class="image">   <img src="' + member.avatarURL + '"> </div>',
                            html += member.color !== undefined ? ' <p><a href="/users/' + member.id + '" target="_blank" style="color: ' + member.color + ';">' + member.name + "</a></p>" : ' <p><a href="/users/' + member.id + '" target="_blank">' + member.name + "</a></p>",
                            html += "</div>"
                    }
                }
            }
    }(jQuery, window, document),
    function($, window, document, undefined) {
        $.fn.checkbox = function(parameters) {
            var returnedValue, $allModules = $(this), moduleSelector = $allModules.selector || "", time = (new Date).getTime(), performance = [], query = arguments[0], methodInvoked = "string" == typeof query, queryArguments = [].slice.call(arguments, 1);
            return $allModules.each(function() {
                var module, settings = $.extend(!0, {}, $.fn.checkbox.settings, parameters), className = settings.className, namespace = settings.namespace, eventNamespace = (settings.error,
                "." + namespace), moduleNamespace = "module-" + namespace, $module = $(this), $label = $(this).next(settings.selector.label).first(), $input = $(this).find(settings.selector.input), selector = $module.selector || "", instance = $module.data(moduleNamespace), element = this;
                module = {
                    initialize: function() {
                        module.verbose("Initializing checkbox", settings),
                            settings.context && "" !== selector ? (module.verbose("Adding delegated events"),
                                $(element, settings.context).on(selector, "click" + eventNamespace, module.toggle).on(selector + " + " + settings.selector.label, "click" + eventNamespace, module.toggle)) : ($module.on("click" + eventNamespace, module.toggle).data(moduleNamespace, module),
                                $label.on("click" + eventNamespace, module.toggle)),
                            module.instantiate()
                    },
                    instantiate: function() {
                        module.verbose("Storing instance of module", module),
                            instance = module,
                            $module.data(moduleNamespace, module)
                    },
                    destroy: function() {
                        module.verbose("Destroying previous module"),
                            $module.off(eventNamespace).removeData(moduleNamespace)
                    },
                    is: {
                        radio: function() {
                            return $module.hasClass(className.radio)
                        },
                        enabled: function() {
                            return $input.prop("checked") !== undefined && $input.prop("checked")
                        },
                        disabled: function() {
                            return !module.is.enabled()
                        }
                    },
                    can: {
                        disable: function() {
                            return "boolean" == typeof settings.required ? settings.required : !module.is.radio()
                        }
                    },
                    enable: function() {
                        module.debug("Enabling checkbox", $input),
                            $input.prop("checked", !0).trigger("change"),
                            $.proxy(settings.onChange, $input.get())(),
                            $.proxy(settings.onEnable, $input.get())()
                    },
                    disable: function() {
                        module.debug("Disabling checkbox"),
                            $input.prop("checked", !1).trigger("change"),
                            $.proxy(settings.onChange, $input.get())(),
                            $.proxy(settings.onDisable, $input.get())()
                    },
                    toggle: function(event) {
                        module.verbose("Determining new checkbox state"),
                        $input.prop("disabled") || (module.is.disabled() ? module.enable() : module.is.enabled() && module.can.disable() && module.disable())
                    },
                    setting: function(name, value) {
                        if ($.isPlainObject(name))
                            $.extend(!0, settings, name);
                        else {
                            if (value === undefined)
                                return settings[name];
                            settings[name] = value
                        }
                    },
                    internal: function(name, value) {
                        if ($.isPlainObject(name))
                            $.extend(!0, module, name);
                        else {
                            if (value === undefined)
                                return module[name];
                            module[name] = value
                        }
                    },
                    debug: function() {
                        settings.debug && (settings.performance ? module.performance.log(arguments) : (module.debug = Function.prototype.bind.call(console.info, console, settings.name + ":"),
                            module.debug.apply(console, arguments)))
                    },
                    verbose: function() {
                        settings.verbose && settings.debug && (settings.performance ? module.performance.log(arguments) : (module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ":"),
                            module.verbose.apply(console, arguments)))
                    },
                    error: function() {
                        module.error = Function.prototype.bind.call(console.error, console, settings.name + ":"),
                            module.error.apply(console, arguments)
                    },
                    performance: {
                        log: function(message) {
                            var currentTime, executionTime, previousTime;
                            settings.performance && (currentTime = (new Date).getTime(),
                                previousTime = time || currentTime,
                                executionTime = currentTime - previousTime,
                                time = currentTime,
                                performance.push({
                                    Element: element,
                                    Name: message[0],
                                    Arguments: [].slice.call(message, 1) || "",
                                    "Execution Time": executionTime
                                })),
                                clearTimeout(module.performance.timer),
                                module.performance.timer = setTimeout(module.performance.display, 100)
                        },
                        display: function() {
                            var title = settings.name + ":"
                                , totalTime = 0;
                            time = !1,
                                clearTimeout(module.performance.timer),
                                $.each(performance, function(index, data) {
                                    totalTime += data["Execution Time"]
                                }),
                                title += " " + totalTime + "ms",
                            moduleSelector && (title += " '" + moduleSelector + "'"),
                            (console.group !== undefined || console.table !== undefined) && performance.length > 0 && (console.groupCollapsed(title),
                                console.table ? console.table(performance) : $.each(performance, function(index, data) {
                                    console.log(data.Name + ": " + data["Execution Time"] + "ms")
                                }),
                                console.groupEnd()),
                                performance = []
                        }
                    },
                    invoke: function(query, passedArguments, context) {
                        var maxDepth, found, response, object = instance;
                        return passedArguments = passedArguments || queryArguments,
                            context = element || context,
                        "string" == typeof query && object !== undefined && (query = query.split(/[\. ]/),
                            maxDepth = query.length - 1,
                            $.each(query, function(depth, value) {
                                var camelCaseValue = depth != maxDepth ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1) : query;
                                if ($.isPlainObject(object[camelCaseValue]) && depth != maxDepth)
                                    object = object[camelCaseValue];
                                else {
                                    if (object[camelCaseValue] !== undefined)
                                        return found = object[camelCaseValue],
                                            !1;
                                    if (!$.isPlainObject(object[value]) || depth == maxDepth)
                                        return object[value] !== undefined ? (found = object[value],
                                            !1) : !1;
                                    object = object[value]
                                }
                            })),
                            $.isFunction(found) ? response = found.apply(context, passedArguments) : found !== undefined && (response = found),
                            $.isArray(returnedValue) ? returnedValue.push(response) : returnedValue !== undefined ? returnedValue = [returnedValue, response] : response !== undefined && (returnedValue = response),
                            found
                    }
                },
                    methodInvoked ? (instance === undefined && module.initialize(),
                        module.invoke(query)) : (instance !== undefined && module.destroy(),
                        module.initialize())
            }),
                returnedValue !== undefined ? returnedValue : this
        }
            ,
            $.fn.checkbox.settings = {
                name: "Checkbox",
                namespace: "checkbox",
                debug: !1,
                verbose: !0,
                performance: !0,
                context: !1,
                required: "auto",
                onChange: function() {},
                onEnable: function() {},
                onDisable: function() {},
                error: {
                    method: "The method you called is not defined."
                },
                selector: {
                    input: "input[type=checkbox], input[type=radio]",
                    label: "label"
                },
                className: {
                    radio: "radio"
                }
            }
    }(jQuery, window, document),
    function($, window, document, undefined) {
        $.fn.dimmer = function(parameters) {
            var returnedValue, $allModules = $(this), time = (new Date).getTime(), performance = [], query = arguments[0], methodInvoked = "string" == typeof query, queryArguments = [].slice.call(arguments, 1);
            return $allModules.each(function() {
                var $dimmer, $dimmable, module, settings = $.isPlainObject(parameters) ? $.extend(!0, {}, $.fn.dimmer.settings, parameters) : $.extend({}, $.fn.dimmer.settings), selector = settings.selector, namespace = settings.namespace, className = settings.className, eventNamespace = (settings.error,
                "." + namespace), moduleNamespace = "module-" + namespace, moduleSelector = $allModules.selector || "", clickEvent = "ontouchstart" in document.documentElement ? "touchstart" : "click", $module = $(this), element = this, instance = $module.data(moduleNamespace);
                module = {
                    preinitialize: function() {
                        module.is.dimmer() ? ($dimmable = $module.parent(),
                            $dimmer = $module) : ($dimmable = $module,
                            $dimmer = module.has.dimmer() ? $dimmable.children(selector.dimmer).first() : module.create())
                    },
                    initialize: function() {
                        module.debug("Initializing dimmer", settings),
                            "hover" == settings.on ? $dimmable.on("mouseenter" + eventNamespace, module.show).on("mouseleave" + eventNamespace, module.hide) : "click" == settings.on && $dimmable.on(clickEvent + eventNamespace, module.toggle),
                        module.is.page() && (module.debug("Setting as a page dimmer", $dimmable),
                            module.set.pageDimmer()),
                        settings.closable && (module.verbose("Adding dimmer close event", $dimmer),
                            $dimmer.on(clickEvent + eventNamespace, module.event.click)),
                            module.set.dimmable(),
                            module.instantiate()
                    },
                    instantiate: function() {
                        module.verbose("Storing instance of module", module),
                            instance = module,
                            $module.data(moduleNamespace, instance)
                    },
                    destroy: function() {
                        module.verbose("Destroying previous module", $dimmer),
                            $module.removeData(moduleNamespace),
                            $dimmable.off(eventNamespace),
                            $dimmer.off(eventNamespace)
                    },
                    event: {
                        click: function(event) {
                            module.verbose("Determining if event occured on dimmer", event),
                            (0 === $dimmer.find(event.target).size() || $(event.target).is(selector.content)) && (module.hide(),
                                event.stopImmediatePropagation())
                        }
                    },
                    addContent: function(element) {
                        var $content = $(element);
                        module.debug("Add content to dimmer", $content),
                        $content.parent()[0] !== $dimmer[0] && $content.detach().appendTo($dimmer)
                    },
                    create: function() {
                        return $(settings.template.dimmer()).appendTo($dimmable)
                    },
                    animate: {
                        show: function(callback) {
                            callback = $.isFunction(callback) ? callback : function() {}
                                ,
                                module.set.dimmed(),
                                "hover" != settings.on && settings.useCSS && $.fn.transition !== undefined && $dimmer.transition("is supported") ? $dimmer.transition({
                                    animation: settings.transition + " in",
                                    queue: !0,
                                    duration: module.get.duration(),
                                    complete: function() {
                                        module.set.active(),
                                            callback()
                                    }
                                }) : (module.verbose("Showing dimmer animation with javascript"),
                                    $dimmer.stop().css({
                                        opacity: 0,
                                        width: "100%",
                                        height: "100%"
                                    }).fadeTo(module.get.duration(), 1, function() {
                                        $dimmer.removeAttr("style"),
                                            module.set.active(),
                                            callback()
                                    }))
                        },
                        hide: function(callback) {
                            callback = $.isFunction(callback) ? callback : function() {}
                                ,
                                "hover" != settings.on && settings.useCSS && $.fn.transition !== undefined && $dimmer.transition("is supported") ? (module.verbose("Hiding dimmer with css"),
                                    $dimmer.transition({
                                        animation: settings.transition + " out",
                                        duration: module.get.duration(),
                                        queue: !0,
                                        complete: function() {
                                            module.remove.dimmed(),
                                                module.remove.active(),
                                                callback()
                                        }
                                    })) : (module.verbose("Hiding dimmer with javascript"),
                                    $dimmer.stop().fadeOut(module.get.duration(), function() {
                                        $dimmer.removeAttr("style"),
                                            module.remove.dimmed(),
                                            module.remove.active(),
                                            callback()
                                    }))
                        }
                    },
                    get: {
                        dimmer: function() {
                            return $dimmer
                        },
                        duration: function() {
                            return "object" == typeof settings.duration ? module.is.active() ? settings.duration.hide : settings.duration.show : settings.duration
                        }
                    },
                    has: {
                        dimmer: function() {
                            return $module.children(selector.dimmer).size() > 0
                        }
                    },
                    is: {
                        active: function() {
                            return $dimmer.hasClass(className.active)
                        },
                        animating: function() {
                            return $dimmer.is(":animated") || $dimmer.hasClass(className.transition)
                        },
                        dimmer: function() {
                            return $module.is(selector.dimmer)
                        },
                        dimmable: function() {
                            return $module.is(selector.dimmable)
                        },
                        dimmed: function() {
                            return $dimmable.hasClass(className.dimmed)
                        },
                        disabled: function() {
                            return $dimmable.hasClass(className.disabled)
                        },
                        enabled: function() {
                            return !module.is.disabled()
                        },
                        page: function() {
                            return $dimmable.is("body")
                        },
                        pageDimmer: function() {
                            return $dimmer.hasClass(className.pageDimmer)
                        }
                    },
                    can: {
                        show: function() {
                            return !$dimmer.hasClass(className.disabled)
                        }
                    },
                    set: {
                        active: function() {
                            module.set.dimmed(),
                                $dimmer.removeClass(className.transition).addClass(className.active)
                        },
                        dimmable: function() {
                            $dimmable.addClass(className.dimmable)
                        },
                        dimmed: function() {
                            $dimmable.addClass(className.dimmed)
                        },
                        pageDimmer: function() {
                            $dimmer.addClass(className.pageDimmer)
                        },
                        disabled: function() {
                            $dimmer.addClass(className.disabled)
                        }
                    },
                    remove: {
                        active: function() {
                            $dimmer.removeClass(className.transition).removeClass(className.active)
                        },
                        dimmed: function() {
                            $dimmable.removeClass(className.dimmed)
                        },
                        disabled: function() {
                            $dimmer.removeClass(className.disabled)
                        }
                    },
                    show: function(callback) {
                        callback = $.isFunction(callback) ? callback : function() {}
                            ,
                            module.debug("Showing dimmer", $dimmer, settings),
                            !module.is.active() && module.is.enabled() ? (module.animate.show(callback),
                                $.proxy(settings.onShow, element)(),
                                $.proxy(settings.onChange, element)()) : module.debug("Dimmer is already shown or disabled")
                    },
                    hide: function(callback) {
                        callback = $.isFunction(callback) ? callback : function() {}
                            ,
                            module.is.active() || module.is.animating() ? (module.debug("Hiding dimmer", $dimmer),
                                module.animate.hide(callback),
                                $.proxy(settings.onHide, element)(),
                                $.proxy(settings.onChange, element)()) : module.debug("Dimmer is not visible")
                    },
                    toggle: function() {
                        module.verbose("Toggling dimmer visibility", $dimmer),
                            module.is.dimmed() ? module.hide() : module.show()
                    },
                    setting: function(name, value) {
                        if ($.isPlainObject(name))
                            $.extend(!0, settings, name);
                        else {
                            if (value === undefined)
                                return settings[name];
                            settings[name] = value
                        }
                    },
                    internal: function(name, value) {
                        if ($.isPlainObject(name))
                            $.extend(!0, module, name);
                        else {
                            if (value === undefined)
                                return module[name];
                            module[name] = value
                        }
                    },
                    debug: function() {
                        settings.debug && (settings.performance ? module.performance.log(arguments) : (module.debug = Function.prototype.bind.call(console.info, console, settings.name + ":"),
                            module.debug.apply(console, arguments)))
                    },
                    verbose: function() {
                        settings.verbose && settings.debug && (settings.performance ? module.performance.log(arguments) : (module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ":"),
                            module.verbose.apply(console, arguments)))
                    },
                    error: function() {
                        module.error = Function.prototype.bind.call(console.error, console, settings.name + ":"),
                            module.error.apply(console, arguments)
                    },
                    performance: {
                        log: function(message) {
                            var currentTime, executionTime, previousTime;
                            settings.performance && (currentTime = (new Date).getTime(),
                                previousTime = time || currentTime,
                                executionTime = currentTime - previousTime,
                                time = currentTime,
                                performance.push({
                                    Element: element,
                                    Name: message[0],
                                    Arguments: [].slice.call(message, 1) || "",
                                    "Execution Time": executionTime
                                })),
                                clearTimeout(module.performance.timer),
                                module.performance.timer = setTimeout(module.performance.display, 100)
                        },
                        display: function() {
                            var title = settings.name + ":"
                                , totalTime = 0;
                            time = !1,
                                clearTimeout(module.performance.timer),
                                $.each(performance, function(index, data) {
                                    totalTime += data["Execution Time"]
                                }),
                                title += " " + totalTime + "ms",
                            moduleSelector && (title += " '" + moduleSelector + "'"),
                            $allModules.size() > 1 && (title += " (" + $allModules.size() + ")"),
                            (console.group !== undefined || console.table !== undefined) && performance.length > 0 && (console.groupCollapsed(title),
                                console.table ? console.table(performance) : $.each(performance, function(index, data) {
                                    console.log(data.Name + ": " + data["Execution Time"] + "ms")
                                }),
                                console.groupEnd()),
                                performance = []
                        }
                    },
                    invoke: function(query, passedArguments, context) {
                        var maxDepth, found, response, object = instance;
                        return passedArguments = passedArguments || queryArguments,
                            context = element || context,
                        "string" == typeof query && object !== undefined && (query = query.split(/[\. ]/),
                            maxDepth = query.length - 1,
                            $.each(query, function(depth, value) {
                                var camelCaseValue = depth != maxDepth ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1) : query;
                                if ($.isPlainObject(object[camelCaseValue]) && depth != maxDepth)
                                    object = object[camelCaseValue];
                                else {
                                    if (object[camelCaseValue] !== undefined)
                                        return found = object[camelCaseValue],
                                            !1;
                                    if (!$.isPlainObject(object[value]) || depth == maxDepth)
                                        return object[value] !== undefined ? (found = object[value],
                                            !1) : !1;
                                    object = object[value]
                                }
                            })),
                            $.isFunction(found) ? response = found.apply(context, passedArguments) : found !== undefined && (response = found),
                            $.isArray(returnedValue) ? returnedValue.push(response) : returnedValue !== undefined ? returnedValue = [returnedValue, response] : response !== undefined && (returnedValue = response),
                            found
                    }
                },
                    module.preinitialize(),
                    methodInvoked ? (instance === undefined && module.initialize(),
                        module.invoke(query)) : (instance !== undefined && module.destroy(),
                        module.initialize())
            }),
                returnedValue !== undefined ? returnedValue : this
        }
            ,
            $.fn.dimmer.settings = {
                name: "Dimmer",
                namespace: "dimmer",
                debug: !1,
                verbose: !0,
                performance: !0,
                transition: "fade",
                useCSS: !0,
                on: !1,
                closable: !0,
                duration: {
                    show: 500,
                    hide: 500
                },
                onChange: function() {},
                onShow: function() {},
                onHide: function() {},
                error: {
                    method: "The method you called is not defined."
                },
                selector: {
                    dimmable: ".ui.dimmable",
                    dimmer: ".ui.dimmer",
                    content: ".ui.dimmer > .content, .ui.dimmer > .content > .center"
                },
                template: {
                    dimmer: function() {
                        return $("<div />").attr("class", "ui dimmer")
                    }
                },
                className: {
                    active: "active",
                    dimmable: "ui dimmable",
                    dimmed: "dimmed",
                    disabled: "disabled",
                    pageDimmer: "page",
                    hide: "hide",
                    show: "show",
                    transition: "transition"
                }
            }
    }(jQuery, window, document),
    function($, window, document, undefined) {
        $.fn.dropdown = function(parameters) {
            var returnedValue, $allModules = $(this), $document = $(document), moduleSelector = $allModules.selector || "", hasTouch = "ontouchstart" in document.documentElement, time = (new Date).getTime(), performance = [], query = arguments[0], methodInvoked = "string" == typeof query, queryArguments = [].slice.call(arguments, 1);
            return $allModules.each(function() {
                var module, settings = $.isPlainObject(parameters) ? $.extend(!0, {}, $.fn.dropdown.settings, parameters) : $.extend({}, $.fn.dropdown.settings), className = settings.className, metadata = settings.metadata, namespace = settings.namespace, selector = settings.selector, error = settings.error, eventNamespace = "." + namespace, moduleNamespace = "module-" + namespace, $module = $(this), $item = $module.find(selector.item), $text = $module.find(selector.text), $input = $module.find(selector.input), $menu = $module.children(selector.menu), element = this, instance = $module.data(moduleNamespace);
                module = {
                    initialize: function() {
                        module.debug("Initializing dropdown", settings),
                            module.save.defaults(),
                            module.set.selected(),
                        hasTouch && module.bind.touchEvents(),
                            module.bind.mouseEvents(),
                            module.bind.keyboardEvents(),
                            module.instantiate()
                    },
                    instantiate: function() {
                        module.verbose("Storing instance of dropdown", module),
                            instance = module,
                            $module.data(moduleNamespace, module)
                    },
                    destroy: function() {
                        module.verbose("Destroying previous dropdown for", $module),
                            $item.off(eventNamespace),
                            $module.off(eventNamespace).removeData(moduleNamespace)
                    },
                    bind: {
                        keyboardEvents: function() {
                            module.debug("Binding keyboard events"),
                                $module.on("keydown" + eventNamespace, module.handleKeyboard),
                                $module.on("focus" + eventNamespace, module.show)
                        },
                        touchEvents: function() {
                            module.debug("Touch device detected binding touch events"),
                                $module.on("touchstart" + eventNamespace, module.event.test.toggle),
                                $item.on("touchstart" + eventNamespace, module.event.item.mouseenter).on("touchstart" + eventNamespace, module.event.item.click)
                        },
                        mouseEvents: function() {
                            module.verbose("Mouse detected binding mouse events"),
                                "click" == settings.on ? $module.on("click" + eventNamespace, module.event.test.toggle) : "hover" == settings.on ? $module.on("mouseenter" + eventNamespace, module.delay.show).on("mouseleave" + eventNamespace, module.delay.hide) : $module.on(settings.on + eventNamespace, module.toggle),
                                $item.on("mouseenter" + eventNamespace, module.event.item.mouseenter).on("mouseleave" + eventNamespace, module.event.item.mouseleave).on("click" + eventNamespace, module.event.item.click)
                        },
                        intent: function() {
                            module.verbose("Binding hide intent event to document"),
                            hasTouch && $document.on("touchstart" + eventNamespace, module.event.test.touch).on("touchmove" + eventNamespace, module.event.test.touch),
                                $document.on("click" + eventNamespace, module.event.test.hide)
                        }
                    },
                    unbind: {
                        intent: function() {
                            module.verbose("Removing hide intent event from document"),
                            hasTouch && $document.off("touchstart" + eventNamespace).off("touchmove" + eventNamespace),
                                $document.off("click" + eventNamespace)
                        }
                    },
                    handleKeyboard: function(event) {
                        var newIndex, $selectedItem = $item.filter("." + className.selected), pressedKey = event.which, keys = {
                            enter: 13,
                            escape: 27,
                            upArrow: 38,
                            downArrow: 40
                        }, selectedClass = className.selected, currentIndex = $item.index($selectedItem), hasSelectedItem = $selectedItem.size() > 0, resultSize = $item.size();
                        if (pressedKey == keys.escape && (module.verbose("Escape key pressed, closing dropdown"),
                                module.hide()),
                                module.is.visible()) {
                            if (pressedKey == keys.enter && hasSelectedItem)
                                return module.verbose("Enter key pressed, choosing selected item"),
                                    $.proxy(module.event.item.click, $item.filter("." + selectedClass))(event),
                                    event.preventDefault(),
                                    !1;
                            pressedKey == keys.upArrow ? (module.verbose("Up key pressed, changing active item"),
                                newIndex = 0 > currentIndex - 1 ? currentIndex : currentIndex - 1,
                                $item.removeClass(selectedClass).eq(newIndex).addClass(selectedClass),
                                event.preventDefault()) : pressedKey == keys.downArrow && (module.verbose("Down key pressed, changing active item"),
                                newIndex = currentIndex + 1 >= resultSize ? currentIndex : currentIndex + 1,
                                $item.removeClass(selectedClass).eq(newIndex).addClass(selectedClass),
                                event.preventDefault())
                        } else
                            pressedKey == keys.enter && module.show()
                    },
                    event: {
                        test: {
                            toggle: function(event) {
                                module.determine.intent(event, module.toggle) && event.preventDefault()
                            },
                            touch: function(event) {
                                module.determine.intent(event, function() {
                                    "touchstart" == event.type ? module.timer = setTimeout(module.hide, settings.delay.touch) : "touchmove" == event.type && clearTimeout(module.timer)
                                }),
                                    event.stopPropagation()
                            },
                            hide: function(event) {
                                module.determine.intent(event, module.hide)
                            }
                        },
                        item: {
                            mouseenter: function(event) {
                                var $currentMenu = $(this).find(selector.submenu)
                                    , $otherMenus = $(this).siblings(selector.item).children(selector.menu);
                                ($currentMenu.length > 0 || $otherMenus.length > 0) && (clearTimeout(module.itemTimer),
                                    module.itemTimer = setTimeout(function() {
                                        $otherMenus.length > 0 && module.animate.hide(!1, $otherMenus.filter(":visible")),
                                        $currentMenu.length > 0 && (module.verbose("Showing sub-menu", $currentMenu),
                                            module.animate.show(!1, $currentMenu))
                                    }, 2 * settings.delay.show),
                                    event.preventDefault(),
                                    event.stopPropagation())
                            },
                            mouseleave: function(event) {
                                var $currentMenu = $(this).find(selector.menu);
                                $currentMenu.size() > 0 && (clearTimeout(module.itemTimer),
                                    module.itemTimer = setTimeout(function() {
                                        module.verbose("Hiding sub-menu", $currentMenu),
                                            module.animate.hide(!1, $currentMenu)
                                    }, settings.delay.hide))
                            },
                            click: function(event) {
                                var $choice = $(this)
                                    , text = $choice.data(metadata.text) !== undefined ? $choice.data(metadata.text) : $choice.text()
                                    , value = $choice.data(metadata.value) !== undefined ? $choice.data(metadata.value) : "string" == typeof text ? text.toLowerCase() : text
                                    , callback = function() {
                                        module.determine.selectAction(text, value),
                                            $.proxy(settings.onChange, element)(value, text)
                                    }
                                    ;
                                0 === $choice.find(selector.menu).size() && ("touchstart" == event.type ? $choice.one("click", callback) : callback())
                            }
                        },
                        resetStyle: function() {
                            $(this).removeAttr("style")
                        }
                    },
                    determine: {
                        selectAction: function(text, value) {
                            module.verbose("Determining action", settings.action),
                                $.isFunction(module.action[settings.action]) ? (module.verbose("Triggering preset action", settings.action, text, value),
                                    module.action[settings.action](text, value)) : $.isFunction(settings.action) ? (module.verbose("Triggering user action", settings.action, text, value),
                                    settings.action(text, value)) : module.error(error.action, settings.action)
                        },
                        intent: function(event, callback) {
                            return module.debug("Determining whether event occurred in dropdown", event.target),
                                callback = callback || function() {}
                                ,
                                0 === $(event.target).closest($menu).size() ? (module.verbose("Triggering event", callback),
                                    callback(),
                                    !0) : (module.verbose("Event occurred in dropdown, canceling callback"),
                                    !1)
                        }
                    },
                    action: {
                        nothing: function() {},
                        hide: function() {
                            module.hide()
                        },
                        activate: function(text, value) {
                            value = value !== undefined ? value : text,
                                module.set.selected(value),
                                module.set.value(value),
                                module.hide()
                        },
                        auto: function(text, value) {
                            value = value !== undefined ? value : text,
                                module.set.selected(value),
                                module.set.value(value),
                                module.hide()
                        },
                        changeText: function(text, value) {
                            value = value !== undefined ? value : text,
                                module.set.selected(value),
                                module.hide()
                        },
                        updateForm: function(text, value) {
                            value = value !== undefined ? value : text,
                                module.set.selected(value),
                                module.set.value(value),
                                module.hide()
                        }
                    },
                    get: {
                        text: function() {
                            return $text.text()
                        },
                        value: function() {
                            return $input.size() > 0 ? $input.val() : $module.data(metadata.value)
                        },
                        item: function(value, strict) {
                            var $selectedItem = !1;
                            return value = value !== undefined ? value : module.get.value() !== undefined ? module.get.value() : module.get.text(),
                                strict === undefined && "" === value ? (module.debug("Ambiguous dropdown value using strict type check", value),
                                    strict = !0) : strict = strict || !1,
                                value !== undefined ? $item.each(function() {
                                    var $choice = $(this)
                                        , optionText = $choice.data(metadata.text) !== undefined ? $choice.data(metadata.text) : $choice.text()
                                        , optionValue = $choice.data(metadata.value) !== undefined ? $choice.data(metadata.value) : "string" == typeof optionText ? optionText.toLowerCase() : optionText;
                                    strict ? optionValue === value ? $selectedItem = $(this) : $selectedItem || optionText !== value || ($selectedItem = $(this)) : optionValue == value ? $selectedItem = $(this) : $selectedItem || optionText != value || ($selectedItem = $(this))
                                }) : value = module.get.text(),
                            $selectedItem || !1
                        }
                    },
                    restore: {
                        defaults: function() {
                            module.restore.defaultText(),
                                module.restore.defaultValue()
                        },
                        defaultText: function() {
                            var defaultText = $module.data(metadata.defaultText);
                            module.debug("Restoring default text", defaultText),
                                module.set.text(defaultText)
                        },
                        defaultValue: function() {
                            var defaultValue = $module.data(metadata.defaultValue);
                            defaultValue !== undefined && (module.debug("Restoring default value", defaultValue),
                                module.set.selected(defaultValue),
                                module.set.value(defaultValue))
                        }
                    },
                    save: {
                        defaults: function() {
                            module.save.defaultText(),
                                module.save.defaultValue()
                        },
                        defaultValue: function() {
                            $module.data(metadata.defaultValue, module.get.value())
                        },
                        defaultText: function() {
                            $module.data(metadata.defaultText, $text.text())
                        }
                    },
                    set: {
                        text: function(text) {
                            module.debug("Changing text", text, $text),
                                $text.removeClass(className.placeholder),
                                $text.text(text)
                        },
                        value: function(value) {
                            module.debug("Adding selected value to hidden input", value, $input),
                                $input.size() > 0 ? $input.val(value).trigger("change") : $module.data(metadata.value, value)
                        },
                        active: function() {
                            $module.addClass(className.active)
                        },
                        visible: function() {
                            $module.addClass(className.visible)
                        },
                        selected: function(value) {
                            var selectedText, $selectedItem = module.get.item(value);
                            $selectedItem && (module.debug("Setting selected menu item to", $selectedItem),
                                selectedText = $selectedItem.data(metadata.text) !== undefined ? $selectedItem.data(metadata.text) : $selectedItem.text(),
                                $item.removeClass(className.active),
                                $selectedItem.addClass(className.active),
                                module.set.text(selectedText))
                        }
                    },
                    remove: {
                        active: function() {
                            $module.removeClass(className.active)
                        },
                        visible: function() {
                            $module.removeClass(className.visible)
                        }
                    },
                    is: {
                        selection: function() {
                            return $module.hasClass(className.selection)
                        },
                        animated: function($subMenu) {
                            return $subMenu ? $subMenu.is(":animated") || $subMenu.transition && $subMenu.transition("is animating") : $menu.is(":animated") || $menu.transition && $menu.transition("is animating")
                        },
                        visible: function($subMenu) {
                            return $subMenu ? $subMenu.is(":visible") : $menu.is(":visible")
                        },
                        hidden: function($subMenu) {
                            return $subMenu ? $subMenu.is(":not(:visible)") : $menu.is(":not(:visible)")
                        }
                    },
                    can: {
                        click: function() {
                            return hasTouch || "click" == settings.on
                        },
                        show: function() {
                            return !$module.hasClass(className.disabled)
                        }
                    },
                    animate: {
                        show: function(callback, $subMenu) {
                            var $currentMenu = $subMenu || $menu;
                            callback = callback || function() {}
                                ,
                            module.is.hidden($currentMenu) && (module.verbose("Doing menu show animation", $currentMenu),
                                "none" == settings.transition ? callback() : $.fn.transition !== undefined && $module.transition("is supported") ? $currentMenu.transition({
                                    animation: settings.transition + " in",
                                    duration: settings.duration,
                                    complete: callback,
                                    queue: !1
                                }) : "slide down" == settings.transition ? $currentMenu.hide().clearQueue().children().clearQueue().css("opacity", 0).delay(50).animate({
                                    opacity: 1
                                }, settings.duration, "easeOutQuad", module.event.resetStyle).end().slideDown(100, "easeOutQuad", function() {
                                    $.proxy(module.event.resetStyle, this)(),
                                        callback()
                                }) : "fade" == settings.transition ? $currentMenu.hide().clearQueue().fadeIn(settings.duration, function() {
                                    $.proxy(module.event.resetStyle, this)(),
                                        callback()
                                }) : module.error(error.transition, settings.transition))
                        },
                        hide: function(callback, $subMenu) {
                            var $currentMenu = $subMenu || $menu;
                            callback = callback || function() {}
                                ,
                            module.is.visible($currentMenu) && (module.verbose("Doing menu hide animation", $currentMenu),
                                $.fn.transition !== undefined && $module.transition("is supported") ? $currentMenu.transition({
                                    animation: settings.transition + " out",
                                    duration: settings.duration,
                                    complete: callback,
                                    queue: !1
                                }) : "none" == settings.transition ? callback() : "slide down" == settings.transition ? $currentMenu.show().clearQueue().children().clearQueue().css("opacity", 1).animate({
                                    opacity: 0
                                }, 100, "easeOutQuad", module.event.resetStyle).end().delay(50).slideUp(100, "easeOutQuad", function() {
                                    $.proxy(module.event.resetStyle, this)(),
                                        callback()
                                }) : "fade" == settings.transition ? $currentMenu.show().clearQueue().fadeOut(150, function() {
                                    $.proxy(module.event.resetStyle, this)(),
                                        callback()
                                }) : module.error(error.transition))
                        }
                    },
                    show: function() {
                        module.debug("Checking if dropdown can show"),
                        module.is.hidden() && (module.hideOthers(),
                            module.set.active(),
                            module.animate.show(function() {
                                module.can.click() && module.bind.intent(),
                                    module.set.visible()
                            }),
                            $.proxy(settings.onShow, element)())
                    },
                    hide: function() {
                        !module.is.animated() && module.is.visible() && (module.debug("Hiding dropdown"),
                        module.can.click() && module.unbind.intent(),
                            module.remove.active(),
                            module.animate.hide(module.remove.visible),
                            $.proxy(settings.onHide, element)())
                    },
                    delay: {
                        show: function() {
                            module.verbose("Delaying show event to ensure user intent"),
                                clearTimeout(module.timer),
                                module.timer = setTimeout(module.show, settings.delay.show)
                        },
                        hide: function() {
                            module.verbose("Delaying hide event to ensure user intent"),
                                clearTimeout(module.timer),
                                module.timer = setTimeout(module.hide, settings.delay.hide)
                        }
                    },
                    hideOthers: function() {
                        module.verbose("Finding other dropdowns to hide"),
                            $allModules.not($module).has(selector.menu + ":visible").dropdown("hide")
                    },
                    toggle: function() {
                        module.verbose("Toggling menu visibility"),
                            module.is.hidden() ? module.show() : module.hide()
                    },
                    setting: function(name, value) {
                        if ($.isPlainObject(name))
                            $.extend(!0, settings, name);
                        else {
                            if (value === undefined)
                                return settings[name];
                            settings[name] = value
                        }
                    },
                    internal: function(name, value) {
                        if ($.isPlainObject(name))
                            $.extend(!0, module, name);
                        else {
                            if (value === undefined)
                                return module[name];
                            module[name] = value
                        }
                    },
                    debug: function() {
                        settings.debug && (settings.performance ? module.performance.log(arguments) : (module.debug = Function.prototype.bind.call(console.info, console, settings.name + ":"),
                            module.debug.apply(console, arguments)))
                    },
                    verbose: function() {
                        settings.verbose && settings.debug && (settings.performance ? module.performance.log(arguments) : (module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ":"),
                            module.verbose.apply(console, arguments)))
                    },
                    error: function() {
                        module.error = Function.prototype.bind.call(console.error, console, settings.name + ":"),
                            module.error.apply(console, arguments)
                    },
                    performance: {
                        log: function(message) {
                            var currentTime, executionTime, previousTime;
                            settings.performance && (currentTime = (new Date).getTime(),
                                previousTime = time || currentTime,
                                executionTime = currentTime - previousTime,
                                time = currentTime,
                                performance.push({
                                    Element: element,
                                    Name: message[0],
                                    Arguments: [].slice.call(message, 1) || "",
                                    "Execution Time": executionTime
                                })),
                                clearTimeout(module.performance.timer),
                                module.performance.timer = setTimeout(module.performance.display, 100)
                        },
                        display: function() {
                            var title = settings.name + ":"
                                , totalTime = 0;
                            time = !1,
                                clearTimeout(module.performance.timer),
                                $.each(performance, function(index, data) {
                                    totalTime += data["Execution Time"]
                                }),
                                title += " " + totalTime + "ms",
                            moduleSelector && (title += " '" + moduleSelector + "'"),
                            (console.group !== undefined || console.table !== undefined) && performance.length > 0 && (console.groupCollapsed(title),
                                console.table ? console.table(performance) : $.each(performance, function(index, data) {
                                    console.log(data.Name + ": " + data["Execution Time"] + "ms")
                                }),
                                console.groupEnd()),
                                performance = []
                        }
                    },
                    invoke: function(query, passedArguments, context) {
                        var maxDepth, found, response, object = instance;
                        return passedArguments = passedArguments || queryArguments,
                            context = element || context,
                        "string" == typeof query && object !== undefined && (query = query.split(/[\. ]/),
                            maxDepth = query.length - 1,
                            $.each(query, function(depth, value) {
                                var camelCaseValue = depth != maxDepth ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1) : query;
                                if ($.isPlainObject(object[camelCaseValue]) && depth != maxDepth)
                                    object = object[camelCaseValue];
                                else {
                                    if (object[camelCaseValue] !== undefined)
                                        return found = object[camelCaseValue],
                                            !1;
                                    if (!$.isPlainObject(object[value]) || depth == maxDepth)
                                        return object[value] !== undefined ? (found = object[value],
                                            !1) : (module.error(error.method, query),
                                            !1);
                                    object = object[value]
                                }
                            })),
                            $.isFunction(found) ? response = found.apply(context, passedArguments) : found !== undefined && (response = found),
                            $.isArray(returnedValue) ? returnedValue.push(response) : returnedValue !== undefined ? returnedValue = [returnedValue, response] : response !== undefined && (returnedValue = response),
                            found
                    }
                },
                    methodInvoked ? (instance === undefined && module.initialize(),
                        module.invoke(query)) : (instance !== undefined && module.destroy(),
                        module.initialize())
            }),
                returnedValue !== undefined ? returnedValue : this
        }
            ,
            $.fn.dropdown.settings = {
                name: "Dropdown",
                namespace: "dropdown",
                debug: !1,
                verbose: !0,
                performance: !0,
                on: "click",
                action: "activate",
                delay: {
                    show: 200,
                    hide: 300,
                    touch: 50
                },
                transition: "slide down",
                duration: 250,
                onChange: function(value, text) {},
                onShow: function() {},
                onHide: function() {},
                error: {
                    action: "You called a dropdown action that was not defined",
                    method: "The method you called is not defined.",
                    transition: "The requested transition was not found"
                },
                metadata: {
                    defaultText: "defaultText",
                    defaultValue: "defaultValue",
                    text: "text",
                    value: "value"
                },
                selector: {
                    menu: ".menu",
                    submenu: "> .menu",
                    item: ".menu > .item",
                    text: "> .text",
                    input: '> input[type="hidden"]'
                },
                className: {
                    active: "active",
                    placeholder: "default",
                    disabled: "disabled",
                    visible: "visible",
                    selected: "selected",
                    selection: "selection"
                }
            },
            $.extend($.easing, {
                easeOutQuad: function(x, t, b, c, d) {
                    return -c * (t /= d) * (t - 2) + b
                }
            })
    }(jQuery, window, document),
    function($, window, document, undefined) {
        $.fn.modal = function(parameters) {
            var returnedValue, $allModules = $(this), $window = $(window), $document = $(document), $body = $("body"), time = (new Date).getTime(), performance = [], query = arguments[0], methodInvoked = "string" == typeof query, queryArguments = [].slice.call(arguments, 1), requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
                        setTimeout(callback, 0)
                    }
                ;
            return $allModules.each(function() {
                var $allModals, $otherModals, $focusedElement, $dimmable, $dimmer, module, settings = $.isPlainObject(parameters) ? $.extend(!0, {}, $.fn.modal.settings, parameters) : $.extend({}, $.fn.modal.settings), selector = settings.selector, className = settings.className, namespace = settings.namespace, error = settings.error, eventNamespace = "." + namespace, moduleNamespace = "module-" + namespace, moduleSelector = $allModules.selector || "", $module = $(this), $context = $(settings.context), $close = $module.find(selector.close), element = this, instance = $module.data(moduleNamespace);
                module = {
                    initialize: function() {
                        return module.verbose("Initializing dimmer", $context),
                            $.fn.dimmer === undefined ? void module.error(error.dimmer) : ($dimmable = $context.dimmer({
                                closable: !1,
                                useCSS: !0,
                                duration: {
                                    show: .9 * settings.duration,
                                    hide: 1.1 * settings.duration
                                }
                            }),
                            settings.detachable && $dimmable.dimmer("add content", $module),
                                $dimmer = $dimmable.dimmer("get dimmer"),
                                module.refreshSelectors(),
                                module.verbose("Attaching close events", $close),
                                $close.on("click" + eventNamespace, module.event.close),
                                $window.on("resize" + eventNamespace, module.event.resize),
                                void module.instantiate())
                    },
                    instantiate: function() {
                        module.verbose("Storing instance of modal"),
                            instance = module,
                            $module.data(moduleNamespace, instance)
                    },
                    destroy: function() {
                        module.verbose("Destroying previous modal"),
                            $module.removeData(moduleNamespace).off(eventNamespace),
                            $close.off(eventNamespace),
                            $context.dimmer("destroy")
                    },
                    refresh: function() {
                        module.remove.scrolling(),
                            module.cacheSizes(),
                            module.set.screenHeight(),
                            module.set.type(),
                            module.set.position()
                    },
                    refreshSelectors: function() {
                        $otherModals = $module.siblings(selector.modal),
                            $allModals = $otherModals.add($module)
                    },
                    attachEvents: function(selector, event) {
                        var $toggle = $(selector);
                        event = $.isFunction(module[event]) ? module[event] : module.toggle,
                            $toggle.size() > 0 ? (module.debug("Attaching modal events to element", selector, event),
                                $toggle.off(eventNamespace).on("click" + eventNamespace, event)) : module.error(error.notFound)
                    },
                    event: {
                        close: function() {
                            module.verbose("Closing element pressed"),
                                $(this).is(selector.approve) ? $.proxy(settings.onApprove, element)() !== !1 ? module.hide() : module.verbose("Approve callback returned false cancelling hide") : $(this).is(selector.deny) ? $.proxy(settings.onDeny, element)() !== !1 ? module.hide() : module.verbose("Deny callback returned false cancelling hide") : module.hide()
                        },
                        click: function(event) {
                            0 === $(event.target).closest(selector.modal).size() && (module.debug("Dimmer clicked, hiding all modals"),
                                settings.allowMultiple ? module.hide() : module.hideAll(),
                                event.stopImmediatePropagation())
                        },
                        debounce: function(method, delay) {
                            clearTimeout(module.timer),
                                module.timer = setTimeout(method, delay)
                        },
                        keyboard: function(event) {
                            var keyCode = event.which
                                , escapeKey = 27;
                            keyCode == escapeKey && (settings.closable ? (module.debug("Escape key pressed hiding modal"),
                                module.hide()) : module.debug("Escape key pressed, but closable is set to false"),
                                event.preventDefault())
                        },
                        resize: function() {
                            $dimmable.dimmer("is active") && requestAnimationFrame(module.refresh)
                        }
                    },
                    toggle: function() {
                        module.is.active() ? module.hide() : module.show()
                    },
                    show: function(callback) {
                        callback = $.isFunction(callback) ? callback : function() {}
                            ,
                            module.showDimmer(),
                            module.showModal(callback)
                    },
                    onlyVisible: function() {
                        return module.refreshSelectors(),
                        module.is.active() && 0 === $otherModals.filter(":visible").size()
                    },
                    othersVisible: function() {
                        return module.refreshSelectors(),
                        $otherModals.filter(":visible").size() > 0
                    },
                    showModal: function(callback) {
                        if (module.is.active())
                            return void module.debug("Modal is already visible");
                        if (callback = $.isFunction(callback) ? callback : function() {}
                                ,
                                module.save.focus(),
                                module.add.keyboardShortcuts(),
                            module.cache === undefined && module.cacheSizes(),
                                module.set.position(),
                                module.set.screenHeight(),
                                module.set.type(),
                            module.othersVisible() && !settings.allowMultiple)
                            module.debug("Other modals visible, queueing show animation"),
                                module.hideOthers(module.showModal);
                        else {
                            $.proxy(settings.onShow, element)();
                            var transitionCallback = function() {
                                    module.set.active(),
                                        $.proxy(settings.onVisible, element)(),
                                        callback()
                                }
                                ;
                            settings.transition && $.fn.transition !== undefined && $module.transition("is supported") ? (module.debug("Showing modal with css animations"),
                                $module.transition(settings.transition + " in", settings.duration, transitionCallback)) : (module.debug("Showing modal with javascript"),
                                $module.fadeIn(settings.duration, settings.easing, transitionCallback))
                        }
                    },
                    showDimmer: function() {
                        $dimmable.dimmer("is active") ? module.debug("Dimmer is already visible") : (module.debug("Showing dimmer"),
                            $dimmable.dimmer("show"))
                    },
                    hide: function(callback) {
                        callback = $.isFunction(callback) ? callback : function() {}
                            ,
                            module.refreshSelectors(),
                        module.onlyVisible() && module.hideDimmer(),
                            module.hideModal(callback)
                    },
                    hideDimmer: function() {
                        return module.is.active() ? (module.debug("Hiding dimmer"),
                        settings.closable && $dimmer.off("click" + eventNamespace),
                            void $dimmable.dimmer("hide", function() {
                                settings.transition && $.fn.transition !== undefined && $module.transition("is supported") && ($module.transition("reset"),
                                    module.remove.screenHeight()),
                                    module.remove.active()
                            })) : void module.debug("Dimmer is already hidden")
                    },
                    hideModal: function(callback) {
                        if (!module.is.active())
                            return void module.debug("Modal is already hidden");
                        callback = $.isFunction(callback) ? callback : function() {}
                            ,
                            module.restore.focus(),
                            module.remove.keyboardShortcuts(),
                            $.proxy(settings.onHide, element)();
                        var transitionCallback = function() {
                                module.remove.active(),
                                    $.proxy(settings.onHidden, element)(),
                                    callback()
                            }
                            ;
                        settings.transition && $.fn.transition !== undefined && $module.transition("is supported") ? (module.debug("Hiding modal with css animations"),
                            $module.transition(settings.transition + " out", settings.duration, transitionCallback)) : (module.debug("Hiding modal with javascript"),
                            $module.fadeOut(settings.duration, settings.easing, transitionCallback))
                    },
                    hideAll: function(callback) {
                        callback = $.isFunction(callback) ? callback : function() {}
                            ,
                        ($module.is(":visible") || module.othersVisible()) && (module.debug("Hiding all visible modals"),
                            module.hideDimmer(),
                            $allModals.filter(":visible").modal("hide modal", callback))
                    },
                    hideOthers: function(callback) {
                        callback = $.isFunction(callback) ? callback : function() {}
                            ,
                        module.othersVisible() && (module.debug("Hiding other modals"),
                            $otherModals.filter(":visible").modal("hide modal", callback))
                    },
                    add: {
                        keyboardShortcuts: function() {
                            module.verbose("Adding keyboard shortcuts"),
                                $document.on("keyup" + eventNamespace, module.event.keyboard)
                        }
                    },
                    save: {
                        focus: function() {
                            $focusedElement = $(document.activeElement).blur()
                        }
                    },
                    restore: {
                        focus: function() {
                            $focusedElement && $focusedElement.size() > 0 && $focusedElement.focus()
                        }
                    },
                    remove: {
                        active: function() {
                            $module.removeClass(className.active)
                        },
                        screenHeight: function() {
                            module.cache.height > module.cache.pageHeight && (module.debug("Removing page height"),
                                $body.css("height", ""))
                        },
                        keyboardShortcuts: function() {
                            module.verbose("Removing keyboard shortcuts"),
                                $document.off("keyup" + eventNamespace)
                        },
                        scrolling: function() {
                            $dimmable.removeClass(className.scrolling),
                                $module.removeClass(className.scrolling)
                        }
                    },
                    cacheSizes: function() {
                        var modalHeight = $module.outerHeight();
                        0 !== modalHeight && (module.cache = {
                            pageHeight: $(document).outerHeight(),
                            height: modalHeight + settings.offset,
                            contextHeight: "body" == settings.context ? $(window).height() : $dimmable.height()
                        },
                            module.debug("Caching modal and container sizes", module.cache))
                    },
                    can: {
                        fit: function() {
                            return module.cache.height < module.cache.contextHeight
                        }
                    },
                    is: {
                        active: function() {
                            return $module.hasClass(className.active)
                        },
                        modernBrowser: function() {
                            return !(window.ActiveXObject || "ActiveXObject" in window)
                        }
                    },
                    set: {
                        screenHeight: function() {
                            module.cache.height > module.cache.pageHeight && (module.debug("Modal is taller than page content, resizing page height"),
                                $body.css("height", module.cache.height + settings.padding))
                        },
                        active: function() {
                            if ($module.addClass(className.active),
                                settings.closable && $dimmer.off("click" + eventNamespace).on("click" + eventNamespace, module.event.click),
                                    settings.autofocus) {
                                var $inputs = $module.find(":input:visible")
                                    , $autofocus = $inputs.filter("[autofocus]")
                                    , $input = $autofocus.length ? $autofocus : $inputs;
                                $input.first().focus()
                            }
                        },
                        scrolling: function() {
                            $dimmable.addClass(className.scrolling),
                                $module.addClass(className.scrolling)
                        },
                        type: function() {
                            module.can.fit() ? (module.verbose("Modal fits on screen"),
                                module.remove.scrolling()) : (module.verbose("Modal cannot fit on screen setting to scrolling"),
                                module.set.scrolling())
                        },
                        position: function() {
                            module.verbose("Centering modal on page", module.cache),
                                module.can.fit() ? $module.css({
                                    top: "",
                                    marginTop: -(module.cache.height / 2)
                                }) : $module.css({
                                    marginTop: "1em",
                                    top: $document.scrollTop()
                                })
                        }
                    },
                    setting: function(name, value) {
                        if (module.debug("Changing setting", name, value),
                                $.isPlainObject(name))
                            $.extend(!0, settings, name);
                        else {
                            if (value === undefined)
                                return settings[name];
                            settings[name] = value
                        }
                    },
                    internal: function(name, value) {
                        if ($.isPlainObject(name))
                            $.extend(!0, module, name);
                        else {
                            if (value === undefined)
                                return module[name];
                            module[name] = value
                        }
                    },
                    debug: function() {
                        settings.debug && (settings.performance ? module.performance.log(arguments) : (module.debug = Function.prototype.bind.call(console.info, console, settings.name + ":"),
                            module.debug.apply(console, arguments)))
                    },
                    verbose: function() {
                        settings.verbose && settings.debug && (settings.performance ? module.performance.log(arguments) : (module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ":"),
                            module.verbose.apply(console, arguments)))
                    },
                    error: function() {
                        module.error = Function.prototype.bind.call(console.error, console, settings.name + ":"),
                            module.error.apply(console, arguments)
                    },
                    performance: {
                        log: function(message) {
                            var currentTime, executionTime, previousTime;
                            settings.performance && (currentTime = (new Date).getTime(),
                                previousTime = time || currentTime,
                                executionTime = currentTime - previousTime,
                                time = currentTime,
                                performance.push({
                                    Element: element,
                                    Name: message[0],
                                    Arguments: [].slice.call(message, 1) || "",
                                    "Execution Time": executionTime
                                })),
                                clearTimeout(module.performance.timer),
                                module.performance.timer = setTimeout(module.performance.display, 100)
                        },
                        display: function() {
                            var title = settings.name + ":"
                                , totalTime = 0;
                            time = !1,
                                clearTimeout(module.performance.timer),
                                $.each(performance, function(index, data) {
                                    totalTime += data["Execution Time"]
                                }),
                                title += " " + totalTime + "ms",
                            moduleSelector && (title += " '" + moduleSelector + "'"),
                            (console.group !== undefined || console.table !== undefined) && performance.length > 0 && (console.groupCollapsed(title),
                                console.table ? console.table(performance) : $.each(performance, function(index, data) {
                                    console.log(data.Name + ": " + data["Execution Time"] + "ms")
                                }),
                                console.groupEnd()),
                                performance = []
                        }
                    },
                    invoke: function(query, passedArguments, context) {
                        var maxDepth, found, response, object = instance;
                        return passedArguments = passedArguments || queryArguments,
                            context = element || context,
                        "string" == typeof query && object !== undefined && (query = query.split(/[\. ]/),
                            maxDepth = query.length - 1,
                            $.each(query, function(depth, value) {
                                var camelCaseValue = depth != maxDepth ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1) : query;
                                if ($.isPlainObject(object[camelCaseValue]) && depth != maxDepth)
                                    object = object[camelCaseValue];
                                else {
                                    if (object[camelCaseValue] !== undefined)
                                        return found = object[camelCaseValue],
                                            !1;
                                    if (!$.isPlainObject(object[value]) || depth == maxDepth)
                                        return object[value] !== undefined ? (found = object[value],
                                            !1) : !1;
                                    object = object[value]
                                }
                            })),
                            $.isFunction(found) ? response = found.apply(context, passedArguments) : found !== undefined && (response = found),
                            $.isArray(returnedValue) ? returnedValue.push(response) : returnedValue !== undefined ? returnedValue = [returnedValue, response] : response !== undefined && (returnedValue = response),
                            found
                    }
                },
                    methodInvoked ? (instance === undefined && module.initialize(),
                        module.invoke(query)) : (instance !== undefined && module.destroy(),
                        module.initialize())
            }),
                returnedValue !== undefined ? returnedValue : this
        }
            ,
            $.fn.modal.settings = {
                name: "Modal",
                namespace: "modal",
                debug: !1,
                verbose: !0,
                performance: !0,
                allowMultiple: !0,
                detachable: !0,
                closable: !0,
                autofocus: !0,
                context: "body",
                duration: 500,
                easing: "easeOutQuad",
                offset: 0,
                transition: "scale",
                padding: 30,
                onShow: function() {},
                onHide: function() {},
                onVisible: function() {},
                onHidden: function() {},
                onApprove: function() {
                    return !0
                },
                onDeny: function() {
                    return !0
                },
                selector: {
                    close: ".close, .actions .button",
                    approve: ".actions .positive, .actions .approve, .actions .ok",
                    deny: ".actions .negative, .actions .deny, .actions .cancel",
                    modal: ".ui.modal"
                },
                error: {
                    dimmer: "UI Dimmer, a required component is not included in this page",
                    method: "The method you called is not defined."
                },
                className: {
                    active: "active",
                    scrolling: "scrolling"
                }
            },
            $.extend($.easing, {
                easeOutQuad: function(x, t, b, c, d) {
                    return -c * (t /= d) * (t - 2) + b
                }
            })
    }(jQuery, window, document),
    function($, window, document, undefined) {
        $.fn.nag = function(parameters) {
            var returnedValue, $allModules = $(this), moduleSelector = $allModules.selector || "", time = (new Date).getTime(), performance = [], query = arguments[0], methodInvoked = "string" == typeof query, queryArguments = [].slice.call(arguments, 1);
            return $(this).each(function() {
                var moduleOffset, moduleHeight, contextWidth, contextHeight, contextOffset, yOffset, yPosition, timer, module, settings = $.extend(!0, {}, $.fn.nag.settings, parameters), className = settings.className, selector = settings.selector, error = settings.error, namespace = settings.namespace, eventNamespace = "." + namespace, moduleNamespace = namespace + "-module", $module = $(this), $close = $module.find(selector.close), $context = $(settings.context), element = this, instance = $module.data(moduleNamespace), requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
                            setTimeout(callback, 0)
                        }
                    ;
                module = {
                    initialize: function() {
                        module.verbose("Initializing element"),
                            moduleOffset = $module.offset(),
                            moduleHeight = $module.outerHeight(),
                            contextWidth = $context.outerWidth(),
                            contextHeight = $context.outerHeight(),
                            contextOffset = $context.offset(),
                            $module.data(moduleNamespace, module),
                            $close.on("click" + eventNamespace, module.dismiss),
                        settings.context == window && "fixed" == settings.position && $module.addClass(className.fixed),
                        settings.sticky && (module.verbose("Adding scroll events"),
                            "absolute" == settings.position ? $context.on("scroll" + eventNamespace, module.event.scroll).on("resize" + eventNamespace, module.event.scroll) : $(window).on("scroll" + eventNamespace, module.event.scroll).on("resize" + eventNamespace, module.event.scroll),
                            $.proxy(module.event.scroll, this)()),
                        settings.displayTime > 0 && setTimeout(module.hide, settings.displayTime),
                            module.should.show() ? $module.is(":visible") || module.show() : module.hide()
                    },
                    destroy: function() {
                        module.verbose("Destroying instance"),
                            $module.removeData(moduleNamespace).off(eventNamespace),
                        settings.sticky && $context.off(eventNamespace)
                    },
                    refresh: function() {
                        module.debug("Refreshing cached calculations"),
                            moduleOffset = $module.offset(),
                            moduleHeight = $module.outerHeight(),
                            contextWidth = $context.outerWidth(),
                            contextHeight = $context.outerHeight(),
                            contextOffset = $context.offset()
                    },
                    show: function() {
                        module.debug("Showing nag", settings.animation.show),
                            "fade" == settings.animation.show ? $module.fadeIn(settings.duration, settings.easing) : $module.slideDown(settings.duration, settings.easing)
                    },
                    hide: function() {
                        module.debug("Showing nag", settings.animation.hide),
                            "fade" == settings.animation.show ? $module.fadeIn(settings.duration, settings.easing) : $module.slideUp(settings.duration, settings.easing)
                    },
                    onHide: function() {
                        module.debug("Removing nag", settings.animation.hide),
                            $module.remove(),
                        settings.onHide && settings.onHide()
                    },
                    stick: function() {
                        if (module.refresh(),
                            "fixed" == settings.position) {
                            var windowScroll = $(window).prop("pageYOffset") || $(window).scrollTop()
                                , fixedOffset = $module.hasClass(className.bottom) ? contextOffset.top + (contextHeight - moduleHeight) - windowScroll : contextOffset.top - windowScroll;
                            $module.css({
                                position: "fixed",
                                top: fixedOffset,
                                left: contextOffset.left,
                                width: contextWidth - settings.scrollBarWidth
                            })
                        } else
                            $module.css({
                                top: yPosition
                            })
                    },
                    unStick: function() {
                        $module.css({
                            top: ""
                        })
                    },
                    dismiss: function(event) {
                        settings.storageMethod && module.storage.set(settings.storedKey, settings.storedValue),
                            module.hide(),
                            event.stopImmediatePropagation(),
                            event.preventDefault()
                    },
                    should: {
                        show: function() {
                            return settings.persist ? (module.debug("Persistent nag is set, can show nag"),
                                !0) : module.storage.get(settings.storedKey) != settings.storedValue ? (module.debug("Stored value is not set, can show nag", module.storage.get(settings.storedKey)),
                                !0) : (module.debug("Stored value is set, cannot show nag", module.storage.get(settings.storedKey)),
                                !1)
                        },
                        stick: function() {
                            return yOffset = $context.prop("pageYOffset") || $context.scrollTop(),
                                yPosition = $module.hasClass(className.bottom) ? contextHeight - $module.outerHeight() + yOffset : yOffset,
                                yPosition > moduleOffset.top ? !0 : "fixed" == settings.position ? !0 : !1
                        }
                    },
                    storage: {
                        set: function(key, value) {
                            module.debug("Setting stored value", key, value, settings.storageMethod),
                                "local" == settings.storageMethod && window.store !== undefined ? window.store.set(key, value) : $.cookie !== undefined ? $.cookie(key, value) : module.error(error.noStorage)
                        },
                        get: function(key) {
                            return module.debug("Getting stored value", key, settings.storageMethod),
                                "local" == settings.storageMethod && window.store !== undefined ? window.store.get(key) : $.cookie !== undefined ? $.cookie(key) : void module.error(error.noStorage)
                        }
                    },
                    event: {
                        scroll: function() {
                            timer !== undefined && clearTimeout(timer),
                                timer = setTimeout(function() {
                                    module.should.stick() ? requestAnimationFrame(module.stick) : module.unStick()
                                }, settings.lag)
                        }
                    },
                    setting: function(name, value) {
                        if ($.isPlainObject(name))
                            $.extend(!0, settings, name);
                        else {
                            if (value === undefined)
                                return settings[name];
                            settings[name] = value
                        }
                    },
                    internal: function(name, value) {
                        return module.debug("Changing internal", name, value),
                            value === undefined ? module[name] : void ($.isPlainObject(name) ? $.extend(!0, module, name) : module[name] = value)
                    },
                    debug: function() {
                        settings.debug && (settings.performance ? module.performance.log(arguments) : (module.debug = Function.prototype.bind.call(console.info, console, settings.name + ":"),
                            module.debug.apply(console, arguments)))
                    },
                    verbose: function() {
                        settings.verbose && settings.debug && (settings.performance ? module.performance.log(arguments) : (module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ":"),
                            module.verbose.apply(console, arguments)))
                    },
                    error: function() {
                        module.error = Function.prototype.bind.call(console.error, console, settings.name + ":"),
                            module.error.apply(console, arguments)
                    },
                    performance: {
                        log: function(message) {
                            var currentTime, executionTime, previousTime;
                            settings.performance && (currentTime = (new Date).getTime(),
                                previousTime = time || currentTime,
                                executionTime = currentTime - previousTime,
                                time = currentTime,
                                performance.push({
                                    Element: element,
                                    Name: message[0],
                                    Arguments: [].slice.call(message, 1) || "",
                                    "Execution Time": executionTime
                                })),
                                clearTimeout(module.performance.timer),
                                module.performance.timer = setTimeout(module.performance.display, 100)
                        },
                        display: function() {
                            var title = settings.name + ":"
                                , totalTime = 0;
                            time = !1,
                                clearTimeout(module.performance.timer),
                                $.each(performance, function(index, data) {
                                    totalTime += data["Execution Time"]
                                }),
                                title += " " + totalTime + "ms",
                            moduleSelector && (title += " '" + moduleSelector + "'"),
                            $allModules.size() > 1 && (title += " (" + $allModules.size() + ")"),
                            (console.group !== undefined || console.table !== undefined) && performance.length > 0 && (console.groupCollapsed(title),
                                console.table ? console.table(performance) : $.each(performance, function(index, data) {
                                    console.log(data.Name + ": " + data["Execution Time"] + "ms")
                                }),
                                console.groupEnd()),
                                performance = []
                        }
                    },
                    invoke: function(query, passedArguments, context) {
                        var maxDepth, found, response, object = instance;
                        return passedArguments = passedArguments || queryArguments,
                            context = element || context,
                        "string" == typeof query && object !== undefined && (query = query.split(/[\. ]/),
                            maxDepth = query.length - 1,
                            $.each(query, function(depth, value) {
                                var camelCaseValue = depth != maxDepth ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1) : query;
                                if ($.isPlainObject(object[camelCaseValue]) && depth != maxDepth)
                                    object = object[camelCaseValue];
                                else {
                                    if (object[camelCaseValue] !== undefined)
                                        return found = object[camelCaseValue],
                                            !1;
                                    if (!$.isPlainObject(object[value]) || depth == maxDepth)
                                        return object[value] !== undefined ? (found = object[value],
                                            !1) : !1;
                                    object = object[value]
                                }
                            })),
                            $.isFunction(found) ? response = found.apply(context, passedArguments) : found !== undefined && (response = found),
                            $.isArray(returnedValue) ? returnedValue.push(response) : returnedValue !== undefined ? returnedValue = [returnedValue, response] : response !== undefined && (returnedValue = response),
                            found
                    }
                },
                    methodInvoked ? (instance === undefined && module.initialize(),
                        module.invoke(query)) : (instance !== undefined && module.destroy(),
                        module.initialize())
            }),
                returnedValue !== undefined ? returnedValue : this
        }
            ,
            $.fn.nag.settings = {
                name: "Nag",
                debug: !1,
                verbose: !0,
                performance: !0,
                namespace: "Nag",
                persist: !1,
                displayTime: 0,
                animation: {
                    show: "slide",
                    hide: "slide"
                },
                position: "fixed",
                scrollBarWidth: 18,
                storageMethod: "cookie",
                storedKey: "nag",
                storedValue: "dismiss",
                sticky: !1,
                lag: 0,
                context: window,
                error: {
                    noStorage: "Neither $.cookie or store is defined. A storage solution is required for storing state",
                    method: "The method you called is not defined."
                },
                className: {
                    bottom: "bottom",
                    fixed: "fixed"
                },
                selector: {
                    close: ".icon.close"
                },
                speed: 500,
                easing: "easeOutQuad",
                onHide: function() {}
            }
    }(jQuery, window, document),
    function($, window, document, undefined) {
        $.fn.popup = function(parameters) {
            var returnedValue, $allModules = $(this), $document = $(document), moduleSelector = $allModules.selector || "", time = (new Date).getTime(), performance = [], query = arguments[0], methodInvoked = "string" == typeof query, queryArguments = [].slice.call(arguments, 1);
            return $allModules.each(function() {
                var module, settings = $.isPlainObject(parameters) ? $.extend(!0, {}, $.fn.popup.settings, parameters) : $.extend({}, $.fn.popup.settings), selector = settings.selector, className = settings.className, error = settings.error, metadata = settings.metadata, namespace = settings.namespace, eventNamespace = "." + settings.namespace, moduleNamespace = "module-" + namespace, $module = $(this), $context = $(settings.context), $target = settings.target ? $(settings.target) : $module, $window = $(window), $offsetParent = settings.inline ? $target.offsetParent() : $window, $popup = settings.inline ? $target.next(settings.selector.popup) : $window.children(settings.selector.popup).last(), searchDepth = 0, element = this, instance = $module.data(moduleNamespace);
                module = {
                    initialize: function() {
                        module.debug("Initializing module", $module),
                            "click" == settings.on ? $module.on("click", module.toggle) : $module.on(module.get.startEvent() + eventNamespace, module.event.start).on(module.get.endEvent() + eventNamespace, module.event.end),
                        settings.target && module.debug("Target set to element", $target),
                            $window.on("resize" + eventNamespace, module.event.resize),
                            module.instantiate()
                    },
                    instantiate: function() {
                        module.verbose("Storing instance of module", module),
                            instance = module,
                            $module.data(moduleNamespace, instance)
                    },
                    refresh: function() {
                        settings.inline ? ($popup = $target.next(selector.popup),
                            $offsetParent = $target.offsetParent()) : $popup = $window.children(selector.popup).last()
                    },
                    destroy: function() {
                        module.debug("Destroying previous module"),
                            $window.off(eventNamespace),
                            $popup.remove(),
                            $module.off(eventNamespace).removeData(moduleNamespace)
                    },
                    event: {
                        start: function(event) {
                            module.timer = setTimeout(function() {
                                module.is.hidden() && module.show()
                            }, settings.delay)
                        },
                        end: function() {
                            clearTimeout(module.timer),
                            module.is.visible() && module.hide()
                        },
                        resize: function() {
                            module.is.visible() && module.set.position()
                        }
                    },
                    create: function() {
                        module.debug("Creating pop-up html");
                        var html = $module.data(metadata.html) || settings.html
                            , variation = $module.data(metadata.variation) || settings.variation
                            , title = $module.data(metadata.title) || settings.title
                            , content = $module.data(metadata.content) || $module.attr("title") || settings.content;
                        html || content || title ? (html || (html = settings.template({
                            title: title,
                            content: content
                        })),
                            $popup = $("<div/>").addClass(className.popup).addClass(variation).html(html),
                            settings.inline ? (module.verbose("Inserting popup element inline", $popup),
                                $popup.data(moduleNamespace, instance).insertAfter($module)) : (module.verbose("Appending popup element to body", $popup),
                                $popup.data(moduleNamespace, instance).appendTo($context)),
                            $.proxy(settings.onCreate, $popup)()) : module.error(error.content)
                    },
                    toggle: function() {
                        module.debug("Toggling pop-up"),
                            module.is.hidden() ? (module.debug("Popup is hidden, showing pop-up"),
                                module.unbind.close(),
                                module.hideAll(),
                                module.show()) : (module.debug("Popup is visible, hiding pop-up"),
                                module.hide())
                    },
                    show: function(callback) {
                        callback = callback || function() {}
                            ,
                            module.debug("Showing pop-up", settings.transition),
                        settings.preserve || module.refresh(),
                        module.exists() || module.create(),
                            module.save.conditions(),
                            module.set.position(),
                            module.animate.show(callback)
                    },
                    hide: function(callback) {
                        callback = callback || function() {}
                            ,
                            $module.removeClass(className.visible),
                            module.restore.conditions(),
                            module.unbind.close(),
                        module.is.visible() && module.animate.hide(callback)
                    },
                    hideAll: function() {
                        $(selector.popup).filter(":visible").popup("hide")
                    },
                    hideGracefully: function(event) {
                        event && 0 === $(event.target).closest(selector.popup).size() ? (module.debug("Click occurred outside popup hiding popup"),
                            module.hide()) : module.debug("Click was inside popup, keeping popup open")
                    },
                    exists: function() {
                        return settings.inline ? 0 !== $popup.size() : $popup.parent($context).size()
                    },
                    remove: function() {
                        module.debug("Removing popup"),
                            $popup.remove(),
                            $.proxy(settings.onRemove, $popup)()
                    },
                    save: {
                        conditions: function() {
                            module.cache = {
                                title: $module.attr("title")
                            },
                            module.cache.title && $module.removeAttr("title"),
                                module.verbose("Saving original attributes", module.cache.title)
                        }
                    },
                    restore: {
                        conditions: function() {
                            return module.cache && module.cache.title && ($module.attr("title", module.cache.title),
                                module.verbose("Restoring original attributes", module.cache.title)),
                                !0
                        }
                    },
                    animate: {
                        show: function(callback) {
                            callback = callback || function() {}
                                ,
                                $module.addClass(className.visible),
                                settings.transition && $.fn.transition !== undefined && $module.transition("is supported") ? $popup.transition(settings.transition + " in", settings.duration, function() {
                                    module.bind.close(),
                                        $.proxy(callback, element)()
                                }) : $popup.stop().fadeIn(settings.duration, settings.easing, function() {
                                    module.bind.close(),
                                        $.proxy(callback, element)()
                                }),
                                $.proxy(settings.onShow, element)()
                        },
                        hide: function(callback) {
                            callback = callback || function() {}
                                ,
                                module.debug("Hiding pop-up"),
                                settings.transition && $.fn.transition !== undefined && $module.transition("is supported") ? $popup.transition(settings.transition + " out", settings.duration, function() {
                                    module.reset(),
                                        callback()
                                }) : $popup.stop().fadeOut(settings.duration, settings.easing, function() {
                                    module.reset(),
                                        callback()
                                }),
                                $.proxy(settings.onHide, element)()
                        }
                    },
                    get: {
                        startEvent: function() {
                            return "hover" == settings.on ? "mouseenter" : "focus" == settings.on ? "focus" : void 0
                        },
                        endEvent: function() {
                            return "hover" == settings.on ? "mouseleave" : "focus" == settings.on ? "blur" : void 0
                        },
                        offstagePosition: function() {
                            var boundary = {
                                top: $(window).scrollTop(),
                                bottom: $(window).scrollTop() + $(window).height(),
                                left: 0,
                                right: $(window).width()
                            }
                                , popup = {
                                width: $popup.width(),
                                height: $popup.outerHeight(),
                                position: $popup.offset()
                            }
                                , offstage = {}
                                , offstagePositions = [];
                            return popup.position && (offstage = {
                                top: popup.position.top < boundary.top,
                                bottom: popup.position.top + popup.height > boundary.bottom,
                                right: popup.position.left + popup.width > boundary.right,
                                left: popup.position.left < boundary.left
                            }),
                                module.verbose("Checking if outside viewable area", popup.position),
                                $.each(offstage, function(direction, isOffstage) {
                                    isOffstage && offstagePositions.push(direction)
                                }),
                                offstagePositions.length > 0 ? offstagePositions.join(" ") : !1
                        },
                        nextPosition: function(position) {
                            switch (position) {
                                case "top left":
                                    position = "bottom left";
                                    break;
                                case "bottom left":
                                    position = "top right";
                                    break;
                                case "top right":
                                    position = "bottom right";
                                    break;
                                case "bottom right":
                                    position = "top center";
                                    break;
                                case "top center":
                                    position = "bottom center";
                                    break;
                                case "bottom center":
                                    position = "right center";
                                    break;
                                case "right center":
                                    position = "left center";
                                    break;
                                case "left center":
                                    position = "top center"
                            }
                            return position
                        }
                    },
                    set: {
                        position: function(position, arrowOffset) {
                            var positioning, offstagePosition, width = ($(window).width(),
                                $(window).height(),
                                $target.outerWidth()), height = $target.outerHeight(), popupWidth = $popup.width(), popupHeight = $popup.outerHeight(), parentWidth = $offsetParent.outerWidth(), parentHeight = $offsetParent.outerHeight(), distanceAway = settings.distanceAway, offset = settings.inline ? $target.position() : $target.offset();
                            switch (position = position || $module.data(metadata.position) || settings.position,
                                arrowOffset = arrowOffset || $module.data(metadata.offset) || settings.offset,
                            settings.inline && ("left center" == position || "right center" == position ? (arrowOffset += parseInt(window.getComputedStyle(element).getPropertyValue("margin-top"), 10),
                                distanceAway += -parseInt(window.getComputedStyle(element).getPropertyValue("margin-left"), 10)) : (arrowOffset += parseInt(window.getComputedStyle(element).getPropertyValue("margin-left"), 10),
                                distanceAway += parseInt(window.getComputedStyle(element).getPropertyValue("margin-top"), 10))),
                                module.debug("Calculating offset for position", position),
                                position) {
                                case "top left":
                                    positioning = {
                                        bottom: parentHeight - offset.top + distanceAway,
                                        right: parentWidth - offset.left - arrowOffset,
                                        top: "auto",
                                        left: "auto"
                                    };
                                    break;
                                case "top center":
                                    positioning = {
                                        bottom: parentHeight - offset.top + distanceAway,
                                        left: offset.left + width / 2 - popupWidth / 2 + arrowOffset,
                                        top: "auto",
                                        right: "auto"
                                    };
                                    break;
                                case "top right":
                                    positioning = {
                                        top: "auto",
                                        bottom: parentHeight - offset.top + distanceAway,
                                        left: offset.left + width + arrowOffset,
                                        right: "auto"
                                    };
                                    break;
                                case "left center":
                                    positioning = {
                                        top: offset.top + height / 2 - popupHeight / 2 + arrowOffset,
                                        right: parentWidth - offset.left + distanceAway,
                                        left: "auto",
                                        bottom: "auto"
                                    };
                                    break;
                                case "right center":
                                    positioning = {
                                        top: offset.top + height / 2 - popupHeight / 2 + arrowOffset,
                                        left: offset.left + width + distanceAway,
                                        bottom: "auto",
                                        right: "auto"
                                    };
                                    break;
                                case "bottom left":
                                    positioning = {
                                        top: offset.top + height + distanceAway,
                                        right: parentWidth - offset.left - arrowOffset,
                                        left: "auto",
                                        bottom: "auto"
                                    };
                                    break;
                                case "bottom center":
                                    positioning = {
                                        top: offset.top + height + distanceAway,
                                        left: offset.left + width / 2 - popupWidth / 2 + arrowOffset,
                                        bottom: "auto",
                                        right: "auto"
                                    };
                                    break;
                                case "bottom right":
                                    positioning = {
                                        top: offset.top + height + distanceAway,
                                        left: offset.left + width + arrowOffset,
                                        bottom: "auto",
                                        right: "auto"
                                    }
                            }
                            return $popup.css(positioning).removeClass(className.position).addClass(position).addClass(className.loading),
                                offstagePosition = module.get.offstagePosition(),
                                offstagePosition ? (module.debug("Element is outside boundaries", offstagePosition),
                                    searchDepth < settings.maxSearchDepth ? (position = module.get.nextPosition(position),
                                        searchDepth++,
                                        module.debug("Trying new position", position),
                                        module.set.position(position)) : (module.error(error.recursion),
                                        searchDepth = 0,
                                        module.reset(),
                                        $popup.removeClass(className.loading),
                                        !1)) : (module.debug("Position is on stage", position),
                                    searchDepth = 0,
                                    $popup.removeClass(className.loading),
                                    !0)
                        }
                    },
                    bind: {
                        close: function() {
                            "click" == settings.on && settings.closable && (module.verbose("Binding popup close event to document"),
                                $document.on("click" + eventNamespace, function(event) {
                                    module.verbose("Pop-up clickaway intent detected"),
                                        $.proxy(module.hideGracefully, this)(event)
                                }))
                        }
                    },
                    unbind: {
                        close: function() {
                            "click" == settings.on && settings.closable && (module.verbose("Removing close event from document"),
                                $document.off("click" + eventNamespace))
                        }
                    },
                    is: {
                        animating: function() {
                            return $popup.is(":animated") || $popup.hasClass(className.animating)
                        },
                        visible: function() {
                            return $popup.is(":visible")
                        },
                        hidden: function() {
                            return !module.is.visible()
                        }
                    },
                    reset: function() {
                        $popup.attr("style", "").removeAttr("style"),
                        settings.preserve || module.remove()
                    },
                    setting: function(name, value) {
                        if ($.isPlainObject(name))
                            $.extend(!0, settings, name);
                        else {
                            if (value === undefined)
                                return settings[name];
                            settings[name] = value
                        }
                    },
                    internal: function(name, value) {
                        if ($.isPlainObject(name))
                            $.extend(!0, module, name);
                        else {
                            if (value === undefined)
                                return module[name];
                            module[name] = value
                        }
                    },
                    debug: function() {
                        settings.debug && (settings.performance ? module.performance.log(arguments) : (module.debug = Function.prototype.bind.call(console.info, console, settings.name + ":"),
                            module.debug.apply(console, arguments)))
                    },
                    verbose: function() {
                        settings.verbose && settings.debug && (settings.performance ? module.performance.log(arguments) : (module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ":"),
                            module.verbose.apply(console, arguments)))
                    },
                    error: function() {
                        module.error = Function.prototype.bind.call(console.error, console, settings.name + ":"),
                            module.error.apply(console, arguments)
                    },
                    performance: {
                        log: function(message) {
                            var currentTime, executionTime, previousTime;
                            settings.performance && (currentTime = (new Date).getTime(),
                                previousTime = time || currentTime,
                                executionTime = currentTime - previousTime,
                                time = currentTime,
                                performance.push({
                                    Element: element,
                                    Name: message[0],
                                    Arguments: [].slice.call(message, 1) || "",
                                    "Execution Time": executionTime
                                })),
                                clearTimeout(module.performance.timer),
                                module.performance.timer = setTimeout(module.performance.display, 100)
                        },
                        display: function() {
                            var title = settings.name + ":"
                                , totalTime = 0;
                            time = !1,
                                clearTimeout(module.performance.timer),
                                $.each(performance, function(index, data) {
                                    totalTime += data["Execution Time"]
                                }),
                                title += " " + totalTime + "ms",
                            moduleSelector && (title += " '" + moduleSelector + "'"),
                            (console.group !== undefined || console.table !== undefined) && performance.length > 0 && (console.groupCollapsed(title),
                                console.table ? console.table(performance) : $.each(performance, function(index, data) {
                                    console.log(data.Name + ": " + data["Execution Time"] + "ms")
                                }),
                                console.groupEnd()),
                                performance = []
                        }
                    },
                    invoke: function(query, passedArguments, context) {
                        var maxDepth, found, response, object = instance;
                        return passedArguments = passedArguments || queryArguments,
                            context = element || context,
                        "string" == typeof query && object !== undefined && (query = query.split(/[\. ]/),
                            maxDepth = query.length - 1,
                            $.each(query, function(depth, value) {
                                var camelCaseValue = depth != maxDepth ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1) : query;
                                if ($.isPlainObject(object[camelCaseValue]) && depth != maxDepth)
                                    object = object[camelCaseValue];
                                else {
                                    if (object[camelCaseValue] !== undefined)
                                        return found = object[camelCaseValue],
                                            !1;
                                    if (!$.isPlainObject(object[value]) || depth == maxDepth)
                                        return object[value] !== undefined ? (found = object[value],
                                            !1) : !1;
                                    object = object[value]
                                }
                            })),
                            $.isFunction(found) ? response = found.apply(context, passedArguments) : found !== undefined && (response = found),
                            $.isArray(returnedValue) ? returnedValue.push(response) : returnedValue !== undefined ? returnedValue = [returnedValue, response] : response !== undefined && (returnedValue = response),
                            found
                    }
                },
                    methodInvoked ? (instance === undefined && module.initialize(),
                        module.invoke(query)) : (instance !== undefined && module.destroy(),
                        module.initialize())
            }),
                returnedValue !== undefined ? returnedValue : this
        }
            ,
            $.fn.popup.settings = {
                name: "Popup",
                debug: !1,
                verbose: !0,
                performance: !0,
                namespace: "popup",
                onCreate: function() {},
                onRemove: function() {},
                onShow: function() {},
                onHide: function() {},
                variation: "",
                content: !1,
                html: !1,
                title: !1,
                on: "hover",
                target: !1,
                closable: !0,
                context: "body",
                position: "top center",
                delay: 150,
                inline: !1,
                preserve: !1,
                duration: 250,
                easing: "easeOutQuad",
                transition: "scale",
                distanceAway: 0,
                offset: 0,
                maxSearchDepth: 10,
                error: {
                    content: "Your popup has no content specified",
                    method: "The method you called is not defined.",
                    recursion: "Popup attempted to reposition element to fit, but could not find an adequate position."
                },
                metadata: {
                    content: "content",
                    html: "html",
                    offset: "offset",
                    position: "position",
                    title: "title",
                    variation: "variation"
                },
                className: {
                    animating: "animating",
                    loading: "loading",
                    popup: "ui popup",
                    position: "top left center bottom right",
                    visible: "visible"
                },
                selector: {
                    popup: ".ui.popup"
                },
                template: function(text) {
                    var html = "";
                    return typeof text !== undefined && (typeof text.title !== undefined && text.title && (html += '<div class="header">' + text.title + "</div>"),
                    typeof text.content !== undefined && text.content && (html += '<div class="content">' + text.content + "</div>")),
                        html
                }
            },
            $.extend($.easing, {
                easeOutQuad: function(x, t, b, c, d) {
                    return -c * (t /= d) * (t - 2) + b
                }
            })
    }(jQuery, window, document),
    function($, window, document, undefined) {
        $.fn.rating = function(parameters) {
            var returnedValue, $allModules = $(this), moduleSelector = $allModules.selector || "", time = (new Date).getTime(), performance = [], query = arguments[0], methodInvoked = "string" == typeof query, queryArguments = [].slice.call(arguments, 1);
            return $allModules.each(function() {
                var module, settings = $.isPlainObject(parameters) ? $.extend(!0, {}, $.fn.rating.settings, parameters) : $.extend({}, $.fn.rating.settings), namespace = settings.namespace, className = settings.className, metadata = settings.metadata, selector = settings.selector, eventNamespace = (settings.error,
                "." + namespace), moduleNamespace = "module-" + namespace, element = this, instance = $(this).data(moduleNamespace), $module = $(this), $icon = $module.find(selector.icon);
                module = {
                    initialize: function() {
                        module.verbose("Initializing rating module", settings),
                            settings.interactive ? module.enable() : module.disable(),
                        settings.initialRating && (module.debug("Setting initial rating"),
                            module.setRating(settings.initialRating)),
                        $module.data(metadata.rating) && (module.debug("Rating found in metadata"),
                            module.setRating($module.data(metadata.rating))),
                            module.instantiate()
                    },
                    instantiate: function() {
                        module.verbose("Instantiating module", settings),
                            instance = module,
                            $module.data(moduleNamespace, module)
                    },
                    destroy: function() {
                        module.verbose("Destroying previous instance", instance),
                            $module.removeData(moduleNamespace),
                            $icon.off(eventNamespace)
                    },
                    event: {
                        mouseenter: function() {
                            var $activeIcon = $(this);
                            $activeIcon.nextAll().removeClass(className.hover),
                                $module.addClass(className.hover),
                                $activeIcon.addClass(className.hover).prevAll().addClass(className.hover)
                        },
                        mouseleave: function() {
                            $module.removeClass(className.hover),
                                $icon.removeClass(className.hover)
                        },
                        click: function() {
                            var $activeIcon = $(this)
                                , currentRating = module.getRating()
                                , rating = $icon.index($activeIcon) + 1;
                            settings.clearable && currentRating == rating ? module.clearRating() : module.setRating(rating)
                        }
                    },
                    clearRating: function() {
                        module.debug("Clearing current rating"),
                            module.setRating(0)
                    },
                    getRating: function() {
                        var currentRating = $icon.filter("." + className.active).size();
                        return module.verbose("Current rating retrieved", currentRating),
                            currentRating
                    },
                    enable: function() {
                        module.debug("Setting rating to interactive mode"),
                            $icon.on("mouseenter" + eventNamespace, module.event.mouseenter).on("mouseleave" + eventNamespace, module.event.mouseleave).on("click" + eventNamespace, module.event.click),
                            $module.removeClass(className.disabled)
                    },
                    disable: function() {
                        module.debug("Setting rating to read-only mode"),
                            $icon.off(eventNamespace),
                            $module.addClass(className.disabled)
                    },
                    setRating: function(rating) {
                        var ratingIndex = rating - 1 >= 0 ? rating - 1 : 0
                            , $activeIcon = $icon.eq(ratingIndex);
                        $module.removeClass(className.hover),
                            $icon.removeClass(className.hover).removeClass(className.active),
                        rating > 0 && (module.verbose("Setting current rating to", rating),
                            $activeIcon.addClass(className.active).prevAll().addClass(className.active)),
                            $.proxy(settings.onRate, element)(rating)
                    },
                    setting: function(name, value) {
                        if ($.isPlainObject(name))
                            $.extend(!0, settings, name);
                        else {
                            if (value === undefined)
                                return settings[name];
                            settings[name] = value
                        }
                    },
                    internal: function(name, value) {
                        if ($.isPlainObject(name))
                            $.extend(!0, module, name);
                        else {
                            if (value === undefined)
                                return module[name];
                            module[name] = value
                        }
                    },
                    debug: function() {
                        settings.debug && (settings.performance ? module.performance.log(arguments) : (module.debug = Function.prototype.bind.call(console.info, console, settings.name + ":"),
                            module.debug.apply(console, arguments)))
                    },
                    verbose: function() {
                        settings.verbose && settings.debug && (settings.performance ? module.performance.log(arguments) : (module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ":"),
                            module.verbose.apply(console, arguments)))
                    },
                    error: function() {
                        module.error = Function.prototype.bind.call(console.error, console, settings.name + ":"),
                            module.error.apply(console, arguments)
                    },
                    performance: {
                        log: function(message) {
                            var currentTime, executionTime, previousTime;
                            settings.performance && (currentTime = (new Date).getTime(),
                                previousTime = time || currentTime,
                                executionTime = currentTime - previousTime,
                                time = currentTime,
                                performance.push({
                                    Element: element,
                                    Name: message[0],
                                    Arguments: [].slice.call(message, 1) || "",
                                    "Execution Time": executionTime
                                })),
                                clearTimeout(module.performance.timer),
                                module.performance.timer = setTimeout(module.performance.display, 100)
                        },
                        display: function() {
                            var title = settings.name + ":"
                                , totalTime = 0;
                            time = !1,
                                clearTimeout(module.performance.timer),
                                $.each(performance, function(index, data) {
                                    totalTime += data["Execution Time"]
                                }),
                                title += " " + totalTime + "ms",
                            moduleSelector && (title += " '" + moduleSelector + "'"),
                            $allModules.size() > 1 && (title += " (" + $allModules.size() + ")"),
                            (console.group !== undefined || console.table !== undefined) && performance.length > 0 && (console.groupCollapsed(title),
                                console.table ? console.table(performance) : $.each(performance, function(index, data) {
                                    console.log(data.Name + ": " + data["Execution Time"] + "ms")
                                }),
                                console.groupEnd()),
                                performance = []
                        }
                    },
                    invoke: function(query, passedArguments, context) {
                        var maxDepth, found, response, object = instance;
                        return passedArguments = passedArguments || queryArguments,
                            context = element || context,
                        "string" == typeof query && object !== undefined && (query = query.split(/[\. ]/),
                            maxDepth = query.length - 1,
                            $.each(query, function(depth, value) {
                                var camelCaseValue = depth != maxDepth ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1) : query;
                                if ($.isPlainObject(object[camelCaseValue]) && depth != maxDepth)
                                    object = object[camelCaseValue];
                                else {
                                    if (object[camelCaseValue] !== undefined)
                                        return found = object[camelCaseValue],
                                            !1;
                                    if (!$.isPlainObject(object[value]) || depth == maxDepth)
                                        return object[value] !== undefined ? (found = object[value],
                                            !1) : !1;
                                    object = object[value]
                                }
                            })),
                            $.isFunction(found) ? response = found.apply(context, passedArguments) : found !== undefined && (response = found),
                            $.isArray(returnedValue) ? returnedValue.push(response) : returnedValue !== undefined ? returnedValue = [returnedValue, response] : response !== undefined && (returnedValue = response),
                            found
                    }
                },
                    methodInvoked ? (instance === undefined && module.initialize(),
                        module.invoke(query)) : (instance !== undefined && module.destroy(),
                        module.initialize())
            }),
                returnedValue !== undefined ? returnedValue : this
        }
            ,
            $.fn.rating.settings = {
                name: "Rating",
                namespace: "rating",
                verbose: !0,
                debug: !1,
                performance: !0,
                initialRating: 0,
                interactive: !0,
                clearable: !1,
                onRate: function(rating) {},
                error: {
                    method: "The method you called is not defined"
                },
                metadata: {
                    rating: "rating"
                },
                className: {
                    active: "active",
                    disabled: "disabled",
                    hover: "hover",
                    loading: "loading"
                },
                selector: {
                    icon: ".icon"
                }
            }
    }(jQuery, window, document),
    function($, window, document, undefined) {
        $.fn.search = function(source, parameters) {
            var returnedValue, $allModules = $(this), moduleSelector = $allModules.selector || "", time = (new Date).getTime(), performance = [], query = arguments[0], methodInvoked = "string" == typeof query, queryArguments = [].slice.call(arguments, 1);
            return $(this).each(function() {
                var module, settings = $.extend(!0, {}, $.fn.search.settings, parameters), className = settings.className, selector = settings.selector, error = settings.error, namespace = settings.namespace, eventNamespace = "." + namespace, moduleNamespace = namespace + "-module", $module = $(this), $prompt = $module.find(selector.prompt), $searchButton = $module.find(selector.searchButton), $results = $module.find(selector.results), element = ($module.find(selector.result),
                    $module.find(selector.category),
                    this), instance = $module.data(moduleNamespace);
                module = {
                    initialize: function() {
                        module.verbose("Initializing module");
                        var prompt = $prompt[0]
                            , inputEvent = prompt.oninput !== undefined ? "input" : prompt.onpropertychange !== undefined ? "propertychange" : "keyup";
                        $prompt.on("focus" + eventNamespace, module.event.focus).on("blur" + eventNamespace, module.event.blur).on("keydown" + eventNamespace, module.handleKeyboard),
                        settings.automatic && $prompt.on(inputEvent + eventNamespace, module.search.throttle),
                            $searchButton.on("click" + eventNamespace, module.search.query),
                            $results.on("click" + eventNamespace, selector.result, module.results.select),
                            module.instantiate()
                    },
                    instantiate: function() {
                        module.verbose("Storing instance of module", module),
                            instance = module,
                            $module.data(moduleNamespace, module)
                    },
                    destroy: function() {
                        module.verbose("Destroying instance"),
                            $module.removeData(moduleNamespace)
                    },
                    event: {
                        focus: function() {
                            $module.addClass(className.focus),
                                module.results.show()
                        },
                        blur: function() {
                            module.search.cancel(),
                                $module.removeClass(className.focus),
                                module.results.hide()
                        }
                    },
                    handleKeyboard: function(event) {
                        var newIndex, $result = $module.find(selector.result), $category = $module.find(selector.category), keyCode = event.which, keys = {
                            backspace: 8,
                            enter: 13,
                            escape: 27,
                            upArrow: 38,
                            downArrow: 40
                        }, activeClass = className.active, currentIndex = $result.index($result.filter("." + activeClass)), resultSize = $result.size();
                        if (keyCode == keys.escape && (module.verbose("Escape key pressed, blurring search field"),
                                $prompt.trigger("blur")),
                            $results.filter(":visible").size() > 0)
                            if (keyCode == keys.enter) {
                                if (module.verbose("Enter key pressed, selecting active result"),
                                    $result.filter("." + activeClass).size() > 0)
                                    return $.proxy(module.results.select, $result.filter("." + activeClass))(),
                                        event.preventDefault(),
                                        !1
                            } else
                                keyCode == keys.upArrow ? (module.verbose("Up key pressed, changing active result"),
                                    newIndex = 0 > currentIndex - 1 ? currentIndex : currentIndex - 1,
                                    $category.removeClass(activeClass),
                                    $result.removeClass(activeClass).eq(newIndex).addClass(activeClass).closest($category).addClass(activeClass),
                                    event.preventDefault()) : keyCode == keys.downArrow && (module.verbose("Down key pressed, changing active result"),
                                    newIndex = currentIndex + 1 >= resultSize ? currentIndex : currentIndex + 1,
                                    $category.removeClass(activeClass),
                                    $result.removeClass(activeClass).eq(newIndex).addClass(activeClass).closest($category).addClass(activeClass),
                                    event.preventDefault());
                        else
                            keyCode == keys.enter && (module.verbose("Enter key pressed, executing query"),
                                module.search.query(),
                                $searchButton.addClass(className.down),
                                $prompt.one("keyup", function() {
                                    $searchButton.removeClass(className.down)
                                }))
                    },
                    search: {
                        cancel: function() {
                            var xhr = $module.data("xhr") || !1;
                            xhr && "resolved" != xhr.state() && (module.debug("Cancelling last search"),
                                xhr.abort())
                        },
                        throttle: function() {
                            var searchTerm = $prompt.val()
                                , numCharacters = searchTerm.length;
                            clearTimeout(module.timer),
                                numCharacters >= settings.minCharacters ? module.timer = setTimeout(module.search.query, settings.searchThrottle) : module.results.hide()
                        },
                        query: function() {
                            var searchTerm = $prompt.val()
                                , cachedHTML = module.search.cache.read(searchTerm);
                            cachedHTML ? (module.debug("Reading result for '" + searchTerm + "' from cache"),
                                module.results.add(cachedHTML)) : (module.debug("Querying for '" + searchTerm + "'"),
                                "object" == typeof source ? module.search.local(searchTerm) : module.search.remote(searchTerm),
                                $.proxy(settings.onSearchQuery, $module)(searchTerm))
                        },
                        local: function(searchTerm) {
                            var searchHTML, results = [], fullTextResults = [], searchFields = $.isArray(settings.searchFields) ? settings.searchFields : [settings.searchFields], searchRegExp = new RegExp("(?:s|^)" + searchTerm,"i"), fullTextRegExp = new RegExp(searchTerm,"i");
                            $module.addClass(className.loading),
                                $.each(searchFields, function(index, field) {
                                    $.each(source, function(label, thing) {
                                        "string" == typeof thing[field] && -1 == $.inArray(thing, results) && -1 == $.inArray(thing, fullTextResults) && (searchRegExp.test(thing[field]) ? results.push(thing) : fullTextRegExp.test(thing[field]) && fullTextResults.push(thing))
                                    })
                                }),
                                searchHTML = module.results.generate({
                                    results: $.merge(results, fullTextResults)
                                }),
                                $module.removeClass(className.loading),
                                module.search.cache.write(searchTerm, searchHTML),
                                module.results.add(searchHTML)
                        },
                        remote: function(searchTerm) {
                            var searchHTML, apiSettings = {
                                stateContext: $module,
                                url: source,
                                urlData: {
                                    query: searchTerm
                                },
                                success: function(response) {
                                    searchHTML = module.results.generate(response),
                                        module.search.cache.write(searchTerm, searchHTML),
                                        module.results.add(searchHTML)
                                },
                                failure: module.error
                            };
                            module.search.cancel(),
                                module.debug("Executing search"),
                                $.extend(!0, apiSettings, settings.apiSettings),
                                $.api(apiSettings)
                        },
                        cache: {
                            read: function(name) {
                                var cache = $module.data("cache");
                                return settings.cache && "object" == typeof cache && cache[name] !== undefined ? cache[name] : !1
                            },
                            write: function(name, value) {
                                var cache = $module.data("cache") !== undefined ? $module.data("cache") : {};
                                cache[name] = value,
                                    $module.data("cache", cache)
                            }
                        }
                    },
                    results: {
                        generate: function(response) {
                            module.debug("Generating html from response", response);
                            var template = settings.templates[settings.type]
                                , html = "";
                            return $.isPlainObject(response.results) && !$.isEmptyObject(response.results) || $.isArray(response.results) && response.results.length > 0 ? (settings.maxResults > 0 && (response.results = $.makeArray(response.results).slice(0, settings.maxResults)),
                            response.results.length > 0 && ($.isFunction(template) ? html = template(response) : module.error(error.noTemplate, !1))) : html = module.message(error.noResults, "empty"),
                                $.proxy(settings.onResults, $module)(response),
                                html
                        },
                        add: function(html) {
                            ("default" == settings.onResultsAdd || "default" == $.proxy(settings.onResultsAdd, $results)(html)) && $results.html(html),
                                module.results.show()
                        },
                        show: function() {
                            0 === $results.filter(":visible").size() && $prompt.filter(":focus").size() > 0 && "" !== $results.html() && ($results.stop().fadeIn(200),
                                $.proxy(settings.onResultsOpen, $results)())
                        },
                        hide: function() {
                            $results.filter(":visible").size() > 0 && ($results.stop().fadeOut(200),
                                $.proxy(settings.onResultsClose, $results)())
                        },
                        select: function(event) {
                            module.debug("Search result selected");
                            var $result = $(this)
                                , $title = $result.find(".title")
                                , title = $title.html();
                            if ("default" == settings.onSelect || "default" == $.proxy(settings.onSelect, this)(event)) {
                                var $link = $result.find("a[href]").eq(0)
                                    , href = $link.attr("href") || !1
                                    , target = $link.attr("target") || !1;
                                module.results.hide(),
                                    $prompt.val(title),
                                href && ("_blank" == target || event.ctrlKey ? window.open(href) : window.location.href = href)
                            }
                        }
                    },
                    setting: function(name, value) {
                        if ($.isPlainObject(name))
                            $.extend(!0, settings, name);
                        else {
                            if (value === undefined)
                                return settings[name];
                            settings[name] = value
                        }
                    },
                    internal: function(name, value) {
                        if ($.isPlainObject(name))
                            $.extend(!0, module, name);
                        else {
                            if (value === undefined)
                                return module[name];
                            module[name] = value
                        }
                    },
                    debug: function() {
                        settings.debug && (settings.performance ? module.performance.log(arguments) : (module.debug = Function.prototype.bind.call(console.info, console, settings.name + ":"),
                            module.debug.apply(console, arguments)))
                    },
                    verbose: function() {
                        settings.verbose && settings.debug && (settings.performance ? module.performance.log(arguments) : (module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ":"),
                            module.verbose.apply(console, arguments)))
                    },
                    error: function() {
                        module.error = Function.prototype.bind.call(console.error, console, settings.name + ":"),
                            module.error.apply(console, arguments)
                    },
                    performance: {
                        log: function(message) {
                            var currentTime, executionTime, previousTime;
                            settings.performance && (currentTime = (new Date).getTime(),
                                previousTime = time || currentTime,
                                executionTime = currentTime - previousTime,
                                time = currentTime,
                                performance.push({
                                    Element: element,
                                    Name: message[0],
                                    Arguments: [].slice.call(message, 1) || "",
                                    "Execution Time": executionTime
                                })),
                                clearTimeout(module.performance.timer),
                                module.performance.timer = setTimeout(module.performance.display, 100)
                        },
                        display: function() {
                            var title = settings.name + ":"
                                , totalTime = 0;
                            time = !1,
                                clearTimeout(module.performance.timer),
                                $.each(performance, function(index, data) {
                                    totalTime += data["Execution Time"]
                                }),
                                title += " " + totalTime + "ms",
                            moduleSelector && (title += " '" + moduleSelector + "'"),
                            $allModules.size() > 1 && (title += " (" + $allModules.size() + ")"),
                            (console.group !== undefined || console.table !== undefined) && performance.length > 0 && (console.groupCollapsed(title),
                                console.table ? console.table(performance) : $.each(performance, function(index, data) {
                                    console.log(data.Name + ": " + data["Execution Time"] + "ms")
                                }),
                                console.groupEnd()),
                                performance = []
                        }
                    },
                    invoke: function(query, passedArguments, context) {
                        var maxDepth, found, response, object = instance;
                        return passedArguments = passedArguments || queryArguments,
                            context = element || context,
                        "string" == typeof query && object !== undefined && (query = query.split(/[\. ]/),
                            maxDepth = query.length - 1,
                            $.each(query, function(depth, value) {
                                var camelCaseValue = depth != maxDepth ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1) : query;
                                if ($.isPlainObject(object[camelCaseValue]) && depth != maxDepth)
                                    object = object[camelCaseValue];
                                else {
                                    if (object[camelCaseValue] !== undefined)
                                        return found = object[camelCaseValue],
                                            !1;
                                    if (!$.isPlainObject(object[value]) || depth == maxDepth)
                                        return object[value] !== undefined ? (found = object[value],
                                            !1) : !1;
                                    object = object[value]
                                }
                            })),
                            $.isFunction(found) ? response = found.apply(context, passedArguments) : found !== undefined && (response = found),
                            $.isArray(returnedValue) ? returnedValue.push(response) : returnedValue !== undefined ? returnedValue = [returnedValue, response] : response !== undefined && (returnedValue = response),
                            found
                    }
                },
                    methodInvoked ? (instance === undefined && module.initialize(),
                        module.invoke(query)) : (instance !== undefined && module.destroy(),
                        module.initialize())
            }),
                returnedValue !== undefined ? returnedValue : this
        }
            ,
            $.fn.search.settings = {
                name: "Search Module",
                namespace: "search",
                debug: !1,
                verbose: !0,
                performance: !0,
                onSelect: "default",
                onResultsAdd: "default",
                onSearchQuery: function() {},
                onResults: function(response) {},
                onResultsOpen: function() {},
                onResultsClose: function() {},
                automatic: "true",
                type: "simple",
                minCharacters: 3,
                searchThrottle: 300,
                maxResults: 7,
                cache: !0,
                searchFields: ["title", "description"],
                apiSettings: {},
                className: {
                    active: "active",
                    down: "down",
                    focus: "focus",
                    empty: "empty",
                    loading: "loading"
                },
                error: {
                    noResults: "Your search returned no results",
                    logging: "Error in debug logging, exiting.",
                    noTemplate: "A valid template name was not specified.",
                    serverError: "There was an issue with querying the server.",
                    method: "The method you called is not defined."
                },
                selector: {
                    prompt: ".prompt",
                    searchButton: ".search.button",
                    results: ".results",
                    category: ".category",
                    result: ".result"
                },
                templates: {
                    message: function(message, type) {
                        var html = "";
                        return message !== undefined && type !== undefined && (html += '<div class="message ' + type + '">',
                            html += "empty" == type ? '<div class="header">No Results</div class="header"><div class="description">' + message + '</div class="description">' : ' <div class="description">' + message + "</div>",
                            html += "</div>"),
                            html
                    },
                    categories: function(response) {
                        var html = "";
                        return response.results !== undefined ? ($.each(response.results, function(index, category) {
                            category.results !== undefined && category.results.length > 0 && (html += '<div class="category"><div class="name">' + category.name + "</div>",
                                $.each(category.results, function(index, result) {
                                    html += '<div class="result">',
                                        html += '<a href="' + result.url + '"></a>',
                                    result.image !== undefined && (html += '<div class="image"> <img src="' + result.image + '"></div>'),
                                        html += '<div class="info">',
                                    result.price !== undefined && (html += '<div class="price">' + result.price + "</div>"),
                                    result.title !== undefined && (html += '<div class="title">' + result.title + "</div>"),
                                    result.description !== undefined && (html += '<div class="description">' + result.description + "</div>"),
                                        html += "</div></div>"
                                }),
                                html += "</div>")
                        }),
                        response.resultPage && (html += '<a href="' + response.resultPage.url + '" class="all">' + response.resultPage.text + "</a>"),
                            html) : !1
                    },
                    simple: function(response) {
                        var html = "";
                        return response.results !== undefined ? ($.each(response.results, function(index, result) {
                            html += '<a class="result" href="' + result.url + '">',
                            result.image !== undefined && (html += '<div class="image"> <img src="' + result.image + '"></div>'),
                                html += '<div class="info">',
                            result.price !== undefined && (html += '<div class="price">' + result.price + "</div>"),
                            result.title !== undefined && (html += '<div class="title">' + result.title + "</div>"),
                            result.description !== undefined && (html += '<div class="description">' + result.description + "</div>"),
                                html += "</div></a>"
                        }),
                        response.resultPage && (html += '<a href="' + response.resultPage.url + '" class="all">' + response.resultPage.text + "</a>"),
                            html) : !1
                    }
                }
            }
    }(jQuery, window, document),
    function($, window, document, undefined) {
        $.fn.shape = function(parameters) {
            var returnedValue, $allModules = $(this), $body = $("body"), time = (new Date).getTime(), performance = [], query = arguments[0], methodInvoked = "string" == typeof query, queryArguments = [].slice.call(arguments, 1);
            return $allModules.each(function() {
                var $activeSide, $nextSide, module, moduleSelector = $allModules.selector || "", settings = $.extend(!0, {}, $.fn.shape.settings, parameters), namespace = settings.namespace, selector = settings.selector, error = settings.error, className = settings.className, eventNamespace = "." + namespace, moduleNamespace = "module-" + namespace, $module = $(this), $sides = $module.find(selector.sides), $side = $module.find(selector.side), nextSelector = !1, element = this, instance = $module.data(moduleNamespace);
                module = {
                    initialize: function() {
                        module.verbose("Initializing module for", element),
                            module.set.defaultSide(),
                            module.instantiate()
                    },
                    instantiate: function() {
                        module.verbose("Storing instance of module", module),
                            instance = module,
                            $module.data(moduleNamespace, instance)
                    },
                    destroy: function() {
                        module.verbose("Destroying previous module for", element),
                            $module.removeData(moduleNamespace).off(eventNamespace)
                    },
                    refresh: function() {
                        module.verbose("Refreshing selector cache for", element),
                            $module = $(element),
                            $sides = $(this).find(selector.shape),
                            $side = $(this).find(selector.side)
                    },
                    repaint: function() {
                        module.verbose("Forcing repaint event");
                        var shape = $sides.get(0) || document.createElement("div");
                        shape.offsetWidth
                    },
                    animate: function(propertyObject, callback) {
                        module.verbose("Animating box with properties", propertyObject),
                            callback = callback || function(event) {
                                    module.verbose("Executing animation callback"),
                                    event !== undefined && event.stopPropagation(),
                                        module.reset(),
                                        module.set.active()
                                }
                            ,
                            $.proxy(settings.beforeChange, $nextSide[0])(),
                            module.get.transitionEvent() ? (module.verbose("Starting CSS animation"),
                                $module.addClass(className.animating),
                                module.repaint(),
                                $module.addClass(className.animating),
                                $activeSide.addClass(className.hidden),
                                $sides.css(propertyObject).one(module.get.transitionEvent(), callback),
                                module.set.duration(settings.duration)) : callback()
                    },
                    queue: function(method) {
                        module.debug("Queueing animation of", method),
                            $sides.one(module.get.transitionEvent(), function() {
                                module.debug("Executing queued animation"),
                                    setTimeout(function() {
                                        $module.shape(method)
                                    }, 0)
                            })
                    },
                    reset: function() {
                        module.verbose("Animating states reset"),
                            $module.removeClass(className.animating).attr("style", "").removeAttr("style"),
                            $sides.attr("style", "").removeAttr("style"),
                            $side.attr("style", "").removeAttr("style").removeClass(className.hidden),
                            $nextSide.removeClass(className.animating).attr("style", "").removeAttr("style")
                    },
                    is: {
                        animating: function() {
                            return $module.hasClass(className.animating)
                        }
                    },
                    set: {
                        defaultSide: function() {
                            $activeSide = $module.find("." + settings.className.active),
                                $nextSide = $activeSide.next(selector.side).size() > 0 ? $activeSide.next(selector.side) : $module.find(selector.side).first(),
                                nextSelector = !1,
                                module.verbose("Active side set to", $activeSide),
                                module.verbose("Next side set to", $nextSide)
                        },
                        duration: function(duration) {
                            duration = duration || settings.duration,
                                duration = "number" == typeof duration ? duration + "ms" : duration,
                                module.verbose("Setting animation duration", duration),
                                $sides.add($side).css({
                                    "-webkit-transition-duration": duration,
                                    "-moz-transition-duration": duration,
                                    "-ms-transition-duration": duration,
                                    "-o-transition-duration": duration,
                                    "transition-duration": duration
                                })
                        },
                        stageSize: function() {
                            var $clone = $module.clone().addClass(className.loading)
                                , $activeSide = $clone.find("." + settings.className.active)
                                , $nextSide = nextSelector ? $clone.find(nextSelector) : $activeSide.next(selector.side).size() > 0 ? $activeSide.next(selector.side) : $clone.find(selector.side).first()
                                , newSize = {};
                            $activeSide.removeClass(className.active),
                                $nextSide.addClass(className.active),
                                $clone.prependTo($body),
                                newSize = {
                                    width: $nextSide.outerWidth(),
                                    height: $nextSide.outerHeight()
                                },
                                $clone.remove(),
                                $module.css(newSize),
                                module.verbose("Resizing stage to fit new content", newSize)
                        },
                        nextSide: function(selector) {
                            nextSelector = selector,
                                $nextSide = $module.find(selector),
                            0 === $nextSide.size() && module.error(error.side),
                                module.verbose("Next side manually set to", $nextSide)
                        },
                        active: function() {
                            module.verbose("Setting new side to active", $nextSide),
                                $side.removeClass(className.active),
                                $nextSide.addClass(className.active),
                                $.proxy(settings.onChange, $nextSide[0])(),
                                module.set.defaultSide()
                        }
                    },
                    flip: {
                        up: function() {
                            module.debug("Flipping up", $nextSide),
                                module.is.animating() ? module.queue("flip up") : (module.set.stageSize(),
                                    module.stage.above(),
                                    module.animate(module.get.transform.up()))
                        },
                        down: function() {
                            module.debug("Flipping down", $nextSide),
                                module.is.animating() ? module.queue("flip down") : (module.set.stageSize(),
                                    module.stage.below(),
                                    module.animate(module.get.transform.down()))
                        },
                        left: function() {
                            module.debug("Flipping left", $nextSide),
                                module.is.animating() ? module.queue("flip left") : (module.set.stageSize(),
                                    module.stage.left(),
                                    module.animate(module.get.transform.left()))
                        },
                        right: function() {
                            module.debug("Flipping right", $nextSide),
                                module.is.animating() ? module.queue("flip right") : (module.set.stageSize(),
                                    module.stage.right(),
                                    module.animate(module.get.transform.right()))
                        },
                        over: function() {
                            module.debug("Flipping over", $nextSide),
                                module.is.animating() ? module.queue("flip over") : (module.set.stageSize(),
                                    module.stage.behind(),
                                    module.animate(module.get.transform.over()))
                        },
                        back: function() {
                            module.debug("Flipping back", $nextSide),
                                module.is.animating() ? module.queue("flip back") : (module.set.stageSize(),
                                    module.stage.behind(),
                                    module.animate(module.get.transform.back()))
                        }
                    },
                    get: {
                        transform: {
                            up: function() {
                                var translate = {
                                    y: -(($activeSide.outerHeight() - $nextSide.outerHeight()) / 2),
                                    z: -($activeSide.outerHeight() / 2)
                                };
                                return {
                                    transform: "translateY(" + translate.y + "px) translateZ(" + translate.z + "px) rotateX(-90deg)"
                                }
                            },
                            down: function() {
                                var translate = {
                                    y: -(($activeSide.outerHeight() - $nextSide.outerHeight()) / 2),
                                    z: -($activeSide.outerHeight() / 2)
                                };
                                return {
                                    transform: "translateY(" + translate.y + "px) translateZ(" + translate.z + "px) rotateX(90deg)"
                                }
                            },
                            left: function() {
                                var translate = {
                                    x: -(($activeSide.outerWidth() - $nextSide.outerWidth()) / 2),
                                    z: -($activeSide.outerWidth() / 2)
                                };
                                return {
                                    transform: "translateX(" + translate.x + "px) translateZ(" + translate.z + "px) rotateY(90deg)"
                                }
                            },
                            right: function() {
                                var translate = {
                                    x: -(($activeSide.outerWidth() - $nextSide.outerWidth()) / 2),
                                    z: -($activeSide.outerWidth() / 2)
                                };
                                return {
                                    transform: "translateX(" + translate.x + "px) translateZ(" + translate.z + "px) rotateY(-90deg)"
                                }
                            },
                            over: function() {
                                var translate = {
                                    x: -(($activeSide.outerWidth() - $nextSide.outerWidth()) / 2)
                                };
                                return {
                                    transform: "translateX(" + translate.x + "px) rotateY(180deg)"
                                }
                            },
                            back: function() {
                                var translate = {
                                    x: -(($activeSide.outerWidth() - $nextSide.outerWidth()) / 2)
                                };
                                return {
                                    transform: "translateX(" + translate.x + "px) rotateY(-180deg)"
                                }
                            }
                        },
                        transitionEvent: function() {
                            var transition, element = document.createElement("element"), transitions = {
                                transition: "transitionend",
                                OTransition: "oTransitionEnd",
                                MozTransition: "transitionend",
                                WebkitTransition: "webkitTransitionEnd"
                            };
                            for (transition in transitions)
                                if (element.style[transition] !== undefined)
                                    return transitions[transition]
                        },
                        nextSide: function() {
                            return $activeSide.next(selector.side).size() > 0 ? $activeSide.next(selector.side) : $module.find(selector.side).first()
                        }
                    },
                    stage: {
                        above: function() {
                            var box = {
                                origin: ($activeSide.outerHeight() - $nextSide.outerHeight()) / 2,
                                depth: {
                                    active: $nextSide.outerHeight() / 2,
                                    next: $activeSide.outerHeight() / 2
                                }
                            };
                            module.verbose("Setting the initial animation position as above", $nextSide, box),
                                $activeSide.css({
                                    transform: "rotateY(0deg) translateZ(" + box.depth.active + "px)"
                                }),
                                $nextSide.addClass(className.animating).css({
                                    display: "block",
                                    top: box.origin + "px",
                                    transform: "rotateX(90deg) translateZ(" + box.depth.next + "px)"
                                })
                        },
                        below: function() {
                            var box = {
                                origin: ($activeSide.outerHeight() - $nextSide.outerHeight()) / 2,
                                depth: {
                                    active: $nextSide.outerHeight() / 2,
                                    next: $activeSide.outerHeight() / 2
                                }
                            };
                            module.verbose("Setting the initial animation position as below", $nextSide, box),
                                $activeSide.css({
                                    transform: "rotateY(0deg) translateZ(" + box.depth.active + "px)"
                                }),
                                $nextSide.addClass(className.animating).css({
                                    display: "block",
                                    top: box.origin + "px",
                                    transform: "rotateX(-90deg) translateZ(" + box.depth.next + "px)"
                                })
                        },
                        left: function() {
                            var box = {
                                origin: ($activeSide.outerWidth() - $nextSide.outerWidth()) / 2,
                                depth: {
                                    active: $nextSide.outerWidth() / 2,
                                    next: $activeSide.outerWidth() / 2
                                }
                            };
                            module.verbose("Setting the initial animation position as left", $nextSide, box),
                                $activeSide.css({
                                    transform: "rotateY(0deg) translateZ(" + box.depth.active + "px)"
                                }),
                                $nextSide.addClass(className.animating).css({
                                    display: "block",
                                    left: box.origin + "px",
                                    transform: "rotateY(-90deg) translateZ(" + box.depth.next + "px)"
                                })
                        },
                        right: function() {
                            var box = {
                                origin: ($activeSide.outerWidth() - $nextSide.outerWidth()) / 2,
                                depth: {
                                    active: $nextSide.outerWidth() / 2,
                                    next: $activeSide.outerWidth() / 2
                                }
                            };
                            module.verbose("Setting the initial animation position as left", $nextSide, box),
                                $activeSide.css({
                                    transform: "rotateY(0deg) translateZ(" + box.depth.active + "px)"
                                }),
                                $nextSide.addClass(className.animating).css({
                                    display: "block",
                                    left: box.origin + "px",
                                    transform: "rotateY(90deg) translateZ(" + box.depth.next + "px)"
                                })
                        },
                        behind: function() {
                            var box = {
                                origin: ($activeSide.outerWidth() - $nextSide.outerWidth()) / 2,
                                depth: {
                                    active: $nextSide.outerWidth() / 2,
                                    next: $activeSide.outerWidth() / 2
                                }
                            };
                            module.verbose("Setting the initial animation position as behind", $nextSide, box),
                                $activeSide.css({
                                    transform: "rotateY(0deg)"
                                }),
                                $nextSide.addClass(className.animating).css({
                                    display: "block",
                                    left: box.origin + "px",
                                    transform: "rotateY(-180deg)"
                                })
                        }
                    },
                    setting: function(name, value) {
                        if ($.isPlainObject(name))
                            $.extend(!0, settings, name);
                        else {
                            if (value === undefined)
                                return settings[name];
                            settings[name] = value
                        }
                    },
                    internal: function(name, value) {
                        if ($.isPlainObject(name))
                            $.extend(!0, module, name);
                        else {
                            if (value === undefined)
                                return module[name];
                            module[name] = value
                        }
                    },
                    debug: function() {
                        settings.debug && (settings.performance ? module.performance.log(arguments) : (module.debug = Function.prototype.bind.call(console.info, console, settings.name + ":"),
                            module.debug.apply(console, arguments)))
                    },
                    verbose: function() {
                        settings.verbose && settings.debug && (settings.performance ? module.performance.log(arguments) : (module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ":"),
                            module.verbose.apply(console, arguments)))
                    },
                    error: function() {
                        module.error = Function.prototype.bind.call(console.error, console, settings.name + ":"),
                            module.error.apply(console, arguments)
                    },
                    performance: {
                        log: function(message) {
                            var currentTime, executionTime, previousTime;
                            settings.performance && (currentTime = (new Date).getTime(),
                                previousTime = time || currentTime,
                                executionTime = currentTime - previousTime,
                                time = currentTime,
                                performance.push({
                                    Element: element,
                                    Name: message[0],
                                    Arguments: [].slice.call(message, 1) || "",
                                    "Execution Time": executionTime
                                })),
                                clearTimeout(module.performance.timer),
                                module.performance.timer = setTimeout(module.performance.display, 100)
                        },
                        display: function() {
                            var title = settings.name + ":"
                                , totalTime = 0;
                            time = !1,
                                clearTimeout(module.performance.timer),
                                $.each(performance, function(index, data) {
                                    totalTime += data["Execution Time"]
                                }),
                                title += " " + totalTime + "ms",
                            moduleSelector && (title += " '" + moduleSelector + "'"),
                            $allModules.size() > 1 && (title += " (" + $allModules.size() + ")"),
                            (console.group !== undefined || console.table !== undefined) && performance.length > 0 && (console.groupCollapsed(title),
                                console.table ? console.table(performance) : $.each(performance, function(index, data) {
                                    console.log(data.Name + ": " + data["Execution Time"] + "ms")
                                }),
                                console.groupEnd()),
                                performance = []
                        }
                    },
                    invoke: function(query, passedArguments, context) {
                        var maxDepth, found, response, object = instance;
                        return passedArguments = passedArguments || queryArguments,
                            context = element || context,
                        "string" == typeof query && object !== undefined && (query = query.split(/[\. ]/),
                            maxDepth = query.length - 1,
                            $.each(query, function(depth, value) {
                                var camelCaseValue = depth != maxDepth ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1) : query;
                                if ($.isPlainObject(object[camelCaseValue]) && depth != maxDepth)
                                    object = object[camelCaseValue];
                                else {
                                    if (object[camelCaseValue] !== undefined)
                                        return found = object[camelCaseValue],
                                            !1;
                                    if (!$.isPlainObject(object[value]) || depth == maxDepth)
                                        return object[value] !== undefined ? (found = object[value],
                                            !1) : !1;
                                    object = object[value]
                                }
                            })),
                            $.isFunction(found) ? response = found.apply(context, passedArguments) : found !== undefined && (response = found),
                            $.isArray(returnedValue) ? returnedValue.push(response) : returnedValue !== undefined ? returnedValue = [returnedValue, response] : response !== undefined && (returnedValue = response),
                            found
                    }
                },
                    methodInvoked ? (instance === undefined && module.initialize(),
                        module.invoke(query)) : (instance !== undefined && module.destroy(),
                        module.initialize())
            }),
                returnedValue !== undefined ? returnedValue : this
        }
            ,
            $.fn.shape.settings = {
                name: "Shape",
                debug: !1,
                verbose: !0,
                performance: !0,
                namespace: "shape",
                beforeChange: function() {},
                onChange: function() {},
                duration: 700,
                error: {
                    side: "You tried to switch to a side that does not exist.",
                    method: "The method you called is not defined"
                },
                className: {
                    animating: "animating",
                    hidden: "hidden",
                    loading: "loading",
                    active: "active"
                },
                selector: {
                    sides: ".sides",
                    side: ".side"
                }
            }
    }(jQuery, window, document),
    function($, window, document, undefined) {
        $.fn.sidebar = function(parameters) {
            var returnedValue, $allModules = $(this), $body = $("body"), $head = $("head"), moduleSelector = $allModules.selector || "", time = (new Date).getTime(), performance = [], query = arguments[0], methodInvoked = "string" == typeof query, queryArguments = [].slice.call(arguments, 1);
            return $allModules.each(function() {
                var module, settings = $.isPlainObject(parameters) ? $.extend(!0, {}, $.fn.sidebar.settings, parameters) : $.extend({}, $.fn.sidebar.settings), selector = settings.selector, className = settings.className, namespace = settings.namespace, error = settings.error, eventNamespace = "." + namespace, moduleNamespace = "module-" + namespace, $module = $(this), $style = $("style[title=" + namespace + "]"), element = this, instance = $module.data(moduleNamespace);
                module = {
                    initialize: function() {
                        module.debug("Initializing sidebar", $module),
                            module.instantiate()
                    },
                    instantiate: function() {
                        module.verbose("Storing instance of module", module),
                            instance = module,
                            $module.data(moduleNamespace, module)
                    },
                    destroy: function() {
                        module.verbose("Destroying previous module for", $module),
                            $module.off(eventNamespace).removeData(moduleNamespace)
                    },
                    refresh: function() {
                        module.verbose("Refreshing selector cache"),
                            $style = $("style[title=" + namespace + "]")
                    },
                    attachEvents: function(selector, event) {
                        var $toggle = $(selector);
                        event = $.isFunction(module[event]) ? module[event] : module.toggle,
                            $toggle.size() > 0 ? (module.debug("Attaching sidebar events to element", selector, event),
                                $toggle.off(eventNamespace).on("click" + eventNamespace, event)) : module.error(error.notFound)
                    },
                    show: function(callback) {
                        callback = $.isFunction(callback) ? callback : function() {}
                            ,
                            module.debug("Showing sidebar", callback),
                            module.is.closed() ? (settings.overlay || (settings.exclusive && module.hideAll(),
                                module.pushPage()),
                                module.set.active(),
                                callback(),
                                $.proxy(settings.onChange, element)(),
                                $.proxy(settings.onShow, element)()) : module.debug("Sidebar is already visible")
                    },
                    hide: function(callback) {
                        callback = $.isFunction(callback) ? callback : function() {}
                            ,
                            module.debug("Hiding sidebar", callback),
                        module.is.open() && (settings.overlay || (module.pullPage(),
                            module.remove.pushed()),
                            module.remove.active(),
                            callback(),
                            $.proxy(settings.onChange, element)(),
                            $.proxy(settings.onHide, element)())
                    },
                    hideAll: function() {
                        $(selector.sidebar).filter(":visible").sidebar("hide")
                    },
                    toggle: function() {
                        module.is.closed() ? module.show() : module.hide()
                    },
                    pushPage: function() {
                        var direction = module.get.direction()
                            , distance = module.is.vertical() ? $module.outerHeight() : $module.outerWidth();
                        settings.useCSS ? (module.debug("Using CSS to animate body"),
                            module.add.bodyCSS(direction, distance),
                            module.set.pushed()) : module.animatePage(direction, distance, module.set.pushed)
                    },
                    pullPage: function() {
                        var direction = module.get.direction();
                        settings.useCSS ? (module.debug("Resetting body position css"),
                            module.remove.bodyCSS()) : (module.debug("Resetting body position using javascript"),
                            module.animatePage(direction, 0)),
                            module.remove.pushed()
                    },
                    animatePage: function(direction, distance) {
                        var animateSettings = {};
                        animateSettings["padding-" + direction] = distance,
                            module.debug("Using javascript to animate body", animateSettings),
                            $body.animate(animateSettings, settings.duration, module.set.pushed)
                    },
                    add: {
                        bodyCSS: function(direction, distance) {
                            var style;
                            direction !== className.bottom && (style = '<style title="' + namespace + '">body.pushed {  margin-' + direction + ": " + distance + "px !important;}</style>"),
                                $head.append(style),
                                module.debug("Adding body css to head", $style)
                        }
                    },
                    remove: {
                        bodyCSS: function() {
                            module.debug("Removing body css styles", $style),
                                module.refresh(),
                                $style.remove()
                        },
                        active: function() {
                            $module.removeClass(className.active)
                        },
                        pushed: function() {
                            module.verbose("Removing body push state", module.get.direction()),
                                $body.removeClass(className[module.get.direction()]).removeClass(className.pushed)
                        }
                    },
                    set: {
                        active: function() {
                            $module.addClass(className.active)
                        },
                        pushed: function() {
                            module.verbose("Adding body push state", module.get.direction()),
                                $body.addClass(className[module.get.direction()]).addClass(className.pushed)
                        }
                    },
                    get: {
                        direction: function() {
                            return $module.hasClass(className.top) ? className.top : $module.hasClass(className.right) ? className.right : $module.hasClass(className.bottom) ? className.bottom : className.left
                        },
                        transitionEvent: function() {
                            var transition, element = document.createElement("element"), transitions = {
                                transition: "transitionend",
                                OTransition: "oTransitionEnd",
                                MozTransition: "transitionend",
                                WebkitTransition: "webkitTransitionEnd"
                            };
                            for (transition in transitions)
                                if (element.style[transition] !== undefined)
                                    return transitions[transition]
                        }
                    },
                    is: {
                        open: function() {
                            return $module.is(":animated") || $module.hasClass(className.active)
                        },
                        closed: function() {
                            return !module.is.open()
                        },
                        vertical: function() {
                            return $module.hasClass(className.top)
                        }
                    },
                    setting: function(name, value) {
                        if ($.isPlainObject(name))
                            $.extend(!0, settings, name);
                        else {
                            if (value === undefined)
                                return settings[name];
                            settings[name] = value
                        }
                    },
                    internal: function(name, value) {
                        if ($.isPlainObject(name))
                            $.extend(!0, module, name);
                        else {
                            if (value === undefined)
                                return module[name];
                            module[name] = value
                        }
                    },
                    debug: function() {
                        settings.debug && (settings.performance ? module.performance.log(arguments) : (module.debug = Function.prototype.bind.call(console.info, console, settings.name + ":"),
                            module.debug.apply(console, arguments)))
                    },
                    verbose: function() {
                        settings.verbose && settings.debug && (settings.performance ? module.performance.log(arguments) : (module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ":"),
                            module.verbose.apply(console, arguments)))
                    },
                    error: function() {
                        module.error = Function.prototype.bind.call(console.error, console, settings.name + ":"),
                            module.error.apply(console, arguments)
                    },
                    performance: {
                        log: function(message) {
                            var currentTime, executionTime, previousTime;
                            settings.performance && (currentTime = (new Date).getTime(),
                                previousTime = time || currentTime,
                                executionTime = currentTime - previousTime,
                                time = currentTime,
                                performance.push({
                                    Element: element,
                                    Name: message[0],
                                    Arguments: [].slice.call(message, 1) || "",
                                    "Execution Time": executionTime
                                })),
                                clearTimeout(module.performance.timer),
                                module.performance.timer = setTimeout(module.performance.display, 100)
                        },
                        display: function() {
                            var title = settings.name + ":"
                                , totalTime = 0;
                            time = !1,
                                clearTimeout(module.performance.timer),
                                $.each(performance, function(index, data) {
                                    totalTime += data["Execution Time"]
                                }),
                                title += " " + totalTime + "ms",
                            moduleSelector && (title += " '" + moduleSelector + "'"),
                            $allModules.size() > 1 && (title += " (" + $allModules.size() + ")"),
                            (console.group !== undefined || console.table !== undefined) && performance.length > 0 && (console.groupCollapsed(title),
                                console.table ? console.table(performance) : $.each(performance, function(index, data) {
                                    console.log(data.Name + ": " + data["Execution Time"] + "ms")
                                }),
                                console.groupEnd()),
                                performance = []
                        }
                    },
                    invoke: function(query, passedArguments, context) {
                        var maxDepth, found, response, object = instance;
                        return passedArguments = passedArguments || queryArguments,
                            context = element || context,
                        "string" == typeof query && object !== undefined && (query = query.split(/[\. ]/),
                            maxDepth = query.length - 1,
                            $.each(query, function(depth, value) {
                                var camelCaseValue = depth != maxDepth ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1) : query;
                                if ($.isPlainObject(object[camelCaseValue]) && depth != maxDepth)
                                    object = object[camelCaseValue];
                                else {
                                    if (object[camelCaseValue] !== undefined)
                                        return found = object[camelCaseValue],
                                            !1;
                                    if (!$.isPlainObject(object[value]) || depth == maxDepth)
                                        return object[value] !== undefined ? (found = object[value],
                                            !1) : !1;
                                    object = object[value]
                                }
                            })),
                            $.isFunction(found) ? response = found.apply(context, passedArguments) : found !== undefined && (response = found),
                            $.isArray(returnedValue) ? returnedValue.push(response) : returnedValue !== undefined ? returnedValue = [returnedValue, response] : response !== undefined && (returnedValue = response),
                            found
                    }
                },
                    methodInvoked ? (instance === undefined && module.initialize(),
                        module.invoke(query)) : (instance !== undefined && module.destroy(),
                        module.initialize())
            }),
                returnedValue !== undefined ? returnedValue : this
        }
            ,
            $.fn.sidebar.settings = {
                name: "Sidebar",
                namespace: "sidebar",
                debug: !1,
                verbose: !0,
                performance: !0,
                useCSS: !0,
                exclusive: !0,
                overlay: !1,
                duration: 300,
                onChange: function() {},
                onShow: function() {},
                onHide: function() {},
                className: {
                    active: "active",
                    pushed: "pushed",
                    top: "top",
                    left: "left",
                    right: "right",
                    bottom: "bottom"
                },
                selector: {
                    sidebar: ".ui.sidebar"
                },
                error: {
                    method: "The method you called is not defined.",
                    notFound: "There were no elements that matched the specified selector"
                }
            }
    }(jQuery, window, document),
    function($, window, document, undefined) {
        $.fn.tab = function(parameters) {
            var activeTabPath, parameterArray, historyEvent, module, returnedValue, settings = $.extend(!0, {}, $.fn.tab.settings, parameters), $module = $(this), $tabs = $(settings.context).find(settings.selector.tabs), moduleSelector = $module.selector || "", cache = {}, firstLoad = !0, recursionDepth = 0, element = this, time = (new Date).getTime(), performance = [], className = settings.className, metadata = settings.metadata, error = settings.error, eventNamespace = "." + settings.namespace, moduleNamespace = "module-" + settings.namespace, instance = $module.data(moduleNamespace), query = arguments[0], methodInvoked = instance !== undefined && "string" == typeof query, queryArguments = [].slice.call(arguments, 1);
            return module = {
                initialize: function() {
                    if (module.debug("Initializing Tabs", $module),
                        settings.auto && (module.verbose("Setting up automatic tab retrieval from server"),
                            settings.apiSettings = {
                                url: settings.path + "/{$tab}"
                            }),
                            settings.history) {
                        if (module.debug("Initializing page state"),
                            $.address === undefined)
                            return module.error(error.state),
                                !1;
                        if ("hash" == settings.historyType && module.debug("Using hash state change to manage state"),
                            "html5" == settings.historyType) {
                            if (module.debug("Using HTML5 to manage state"),
                                settings.path === !1)
                                return module.error(error.path),
                                    !1;
                            $.address.history(!0).state(settings.path)
                        }
                        $.address.unbind("change").bind("change", module.event.history.change)
                    }
                    $.isWindow(element) || (module.debug("Attaching tab activation events to element", $module),
                        $module.on("click" + eventNamespace, module.event.click)),
                        module.instantiate()
                },
                instantiate: function() {
                    module.verbose("Storing instance of module", module),
                        $module.data(moduleNamespace, module)
                },
                destroy: function() {
                    module.debug("Destroying tabs", $module),
                        $module.removeData(moduleNamespace).off(eventNamespace)
                },
                event: {
                    click: function(event) {
                        var tabPath = $(this).data(metadata.tab);
                        tabPath !== undefined ? (settings.history ? (module.verbose("Updating page state", event),
                            $.address.value(tabPath)) : (module.verbose("Changing tab without state management", event),
                            module.changeTab(tabPath)),
                            event.preventDefault()) : module.debug("No tab specified")
                    },
                    history: {
                        change: function(event) {
                            var tabPath = event.pathNames.join("/") || module.get.initialPath()
                                , pageTitle = settings.templates.determineTitle(tabPath) || !1;
                            module.debug("History change event", tabPath, event),
                                historyEvent = event,
                            tabPath !== undefined && module.changeTab(tabPath),
                            pageTitle && $.address.title(pageTitle)
                        }
                    }
                },
                refresh: function() {
                    activeTabPath && (module.debug("Refreshing tab", activeTabPath),
                        module.changeTab(activeTabPath))
                },
                cache: {
                    read: function(cacheKey) {
                        return cacheKey !== undefined ? cache[cacheKey] : !1
                    },
                    add: function(cacheKey, content) {
                        cacheKey = cacheKey || activeTabPath,
                            module.debug("Adding cached content for", cacheKey),
                            cache[cacheKey] = content
                    },
                    remove: function(cacheKey) {
                        cacheKey = cacheKey || activeTabPath,
                            module.debug("Removing cached content for", cacheKey),
                            delete cache[cacheKey]
                    }
                },
                set: {
                    state: function(url) {
                        $.address.value(url)
                    }
                },
                changeTab: function(tabPath) {
                    var pushStateAvailable = window.history && window.history.pushState
                        , shouldIgnoreLoad = pushStateAvailable && settings.ignoreFirstLoad && firstLoad
                        , remoteContent = settings.auto || $.isPlainObject(settings.apiSettings)
                        , pathArray = remoteContent && !shouldIgnoreLoad ? module.utilities.pathToArray(tabPath) : module.get.defaultPathArray(tabPath);
                    tabPath = module.utilities.arrayToPath(pathArray),
                        module.deactivate.all(),
                        $.each(pathArray, function(index, tab) {
                            var nextPathArray, nextPath, isLastTab, currentPathArray = pathArray.slice(0, index + 1), currentPath = module.utilities.arrayToPath(currentPathArray), isTab = module.is.tab(currentPath), isLastIndex = index + 1 == pathArray.length, $tab = module.get.tabElement(currentPath);
                            return module.verbose("Looking for tab", tab),
                                isTab ? (module.verbose("Tab was found", tab),
                                    activeTabPath = currentPath,
                                    parameterArray = module.utilities.filterArray(pathArray, currentPathArray),
                                    isLastIndex ? isLastTab = !0 : (nextPathArray = pathArray.slice(0, index + 2),
                                        nextPath = module.utilities.arrayToPath(nextPathArray),
                                        isLastTab = !module.is.tab(nextPath),
                                    isLastTab && module.verbose("Tab parameters found", nextPathArray)),
                                    isLastTab && remoteContent ? (shouldIgnoreLoad ? (module.debug("Ignoring remote content on first tab load", currentPath),
                                        firstLoad = !1,
                                        module.cache.add(tabPath, $tab.html()),
                                        module.activate.all(currentPath),
                                        $.proxy(settings.onTabInit, $tab)(currentPath, parameterArray, historyEvent),
                                        $.proxy(settings.onTabLoad, $tab)(currentPath, parameterArray, historyEvent)) : (module.activate.navigation(currentPath),
                                        module.content.fetch(currentPath, tabPath)),
                                        !1) : (module.debug("Opened local tab", currentPath),
                                        module.activate.all(currentPath),
                                    module.cache.read(currentPath) || (module.cache.add(currentPath, !0),
                                        module.debug("First time tab loaded calling tab init"),
                                        $.proxy(settings.onTabInit, $tab)(currentPath, parameterArray, historyEvent)),
                                        $.proxy(settings.onTabLoad, $tab)(currentPath, parameterArray, historyEvent),
                                        void 0)) : (module.error(error.missingTab, tab),
                                    !1)
                        })
                },
                content: {
                    fetch: function(tabPath, fullTabPath) {
                        var requestSettings, cachedContent, $tab = module.get.tabElement(tabPath), apiSettings = {
                            dataType: "html",
                            stateContext: $tab,
                            success: function(response) {
                                module.cache.add(fullTabPath, response),
                                    module.content.update(tabPath, response),
                                    tabPath == activeTabPath ? (module.debug("Content loaded", tabPath),
                                        module.activate.tab(tabPath)) : module.debug("Content loaded in background", tabPath),
                                    $.proxy(settings.onTabInit, $tab)(tabPath, parameterArray, historyEvent),
                                    $.proxy(settings.onTabLoad, $tab)(tabPath, parameterArray, historyEvent)
                            },
                            urlData: {
                                tab: fullTabPath
                            }
                        }, request = $tab.data(metadata.promise) || !1, existingRequest = request && "pending" === request.state();
                        fullTabPath = fullTabPath || tabPath,
                            cachedContent = module.cache.read(fullTabPath),
                            settings.cache && cachedContent ? (module.debug("Showing existing content", fullTabPath),
                                module.content.update(tabPath, cachedContent),
                                module.activate.tab(tabPath),
                                $.proxy(settings.onTabLoad, $tab)(tabPath, parameterArray, historyEvent)) : existingRequest ? (module.debug("Content is already loading", fullTabPath),
                                $tab.addClass(className.loading)) : $.api !== undefined ? (console.log(settings.apiSettings),
                                requestSettings = $.extend(!0, {
                                    headers: {
                                        "X-Remote": !0
                                    }
                                }, settings.apiSettings, apiSettings),
                                module.debug("Retrieving remote content", fullTabPath, requestSettings),
                                $.api(requestSettings)) : module.error(error.api)
                    },
                    update: function(tabPath, html) {
                        module.debug("Updating html for", tabPath);
                        var $tab = module.get.tabElement(tabPath);
                        $tab.html(html)
                    }
                },
                activate: {
                    all: function(tabPath) {
                        module.activate.tab(tabPath),
                            module.activate.navigation(tabPath)
                    },
                    tab: function(tabPath) {
                        var $tab = module.get.tabElement(tabPath);
                        module.verbose("Showing tab content for", $tab),
                            $tab.addClass(className.active)
                    },
                    navigation: function(tabPath) {
                        var $navigation = module.get.navElement(tabPath);
                        module.verbose("Activating tab navigation for", $navigation, tabPath),
                            $navigation.addClass(className.active)
                    }
                },
                deactivate: {
                    all: function() {
                        module.deactivate.navigation(),
                            module.deactivate.tabs()
                    },
                    navigation: function() {
                        $module.removeClass(className.active)
                    },
                    tabs: function() {
                        $tabs.removeClass(className.active + " " + className.loading)
                    }
                },
                is: {
                    tab: function(tabName) {
                        return tabName !== undefined ? module.get.tabElement(tabName).size() > 0 : !1
                    }
                },
                get: {
                    initialPath: function() {
                        return $module.eq(0).data(metadata.tab) || $tabs.eq(0).data(metadata.tab)
                    },
                    path: function() {
                        return $.address.value()
                    },
                    defaultPathArray: function(tabPath) {
                        return module.utilities.pathToArray(module.get.defaultPath(tabPath))
                    },
                    defaultPath: function(tabPath) {
                        var $defaultNav = $module.filter("[data-" + metadata.tab + '^="' + tabPath + '/"]').eq(0)
                            , defaultTab = $defaultNav.data(metadata.tab) || !1;
                        if (defaultTab) {
                            if (module.debug("Found default tab", defaultTab),
                                recursionDepth < settings.maxDepth)
                                return recursionDepth++,
                                    module.get.defaultPath(defaultTab);
                            module.error(error.recursion)
                        } else
                            module.debug("No default tabs found for", tabPath, $tabs);
                        return recursionDepth = 0,
                            tabPath
                    },
                    navElement: function(tabPath) {
                        return tabPath = tabPath || activeTabPath,
                            $module.filter("[data-" + metadata.tab + '="' + tabPath + '"]')
                    },
                    tabElement: function(tabPath) {
                        var $fullPathTab, $simplePathTab, tabPathArray, lastTab;
                        return tabPath = tabPath || activeTabPath,
                            tabPathArray = module.utilities.pathToArray(tabPath),
                            lastTab = module.utilities.last(tabPathArray),
                            $fullPathTab = $tabs.filter("[data-" + metadata.tab + '="' + lastTab + '"]'),
                            $simplePathTab = $tabs.filter("[data-" + metadata.tab + '="' + tabPath + '"]'),
                            $fullPathTab.size() > 0 ? $fullPathTab : $simplePathTab
                    },
                    tab: function() {
                        return activeTabPath
                    }
                },
                utilities: {
                    filterArray: function(keepArray, removeArray) {
                        return $.grep(keepArray, function(keepValue) {
                            return -1 == $.inArray(keepValue, removeArray)
                        })
                    },
                    last: function(array) {
                        return $.isArray(array) ? array[array.length - 1] : !1
                    },
                    pathToArray: function(pathName) {
                        return pathName === undefined && (pathName = activeTabPath),
                            "string" == typeof pathName ? pathName.split("/") : [pathName]
                    },
                    arrayToPath: function(pathArray) {
                        return $.isArray(pathArray) ? pathArray.join("/") : !1
                    }
                },
                setting: function(name, value) {
                    if ($.isPlainObject(name))
                        $.extend(!0, settings, name);
                    else {
                        if (value === undefined)
                            return settings[name];
                        settings[name] = value
                    }
                },
                internal: function(name, value) {
                    if ($.isPlainObject(name))
                        $.extend(!0, module, name);
                    else {
                        if (value === undefined)
                            return module[name];
                        module[name] = value
                    }
                },
                debug: function() {
                    settings.debug && (settings.performance ? module.performance.log(arguments) : (module.debug = Function.prototype.bind.call(console.info, console, settings.name + ":"),
                        module.debug.apply(console, arguments)))
                },
                verbose: function() {
                    settings.verbose && settings.debug && (settings.performance ? module.performance.log(arguments) : (module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ":"),
                        module.verbose.apply(console, arguments)))
                },
                error: function() {
                    module.error = Function.prototype.bind.call(console.error, console, settings.name + ":"),
                        module.error.apply(console, arguments)
                },
                performance: {
                    log: function(message) {
                        var currentTime, executionTime, previousTime;
                        settings.performance && (currentTime = (new Date).getTime(),
                            previousTime = time || currentTime,
                            executionTime = currentTime - previousTime,
                            time = currentTime,
                            performance.push({
                                Element: element,
                                Name: message[0],
                                Arguments: [].slice.call(message, 1) || "",
                                "Execution Time": executionTime
                            })),
                            clearTimeout(module.performance.timer),
                            module.performance.timer = setTimeout(module.performance.display, 100)
                    },
                    display: function() {
                        var title = settings.name + ":"
                            , totalTime = 0;
                        time = !1,
                            clearTimeout(module.performance.timer),
                            $.each(performance, function(index, data) {
                                totalTime += data["Execution Time"]
                            }),
                            title += " " + totalTime + "ms",
                        moduleSelector && (title += " '" + moduleSelector + "'"),
                        (console.group !== undefined || console.table !== undefined) && performance.length > 0 && (console.groupCollapsed(title),
                            console.table ? console.table(performance) : $.each(performance, function(index, data) {
                                console.log(data.Name + ": " + data["Execution Time"] + "ms")
                            }),
                            console.groupEnd()),
                            performance = []
                    }
                },
                invoke: function(query, passedArguments, context) {
                    var maxDepth, found, response, object = instance;
                    return passedArguments = passedArguments || queryArguments,
                        context = element || context,
                    "string" == typeof query && object !== undefined && (query = query.split(/[\. ]/),
                        maxDepth = query.length - 1,
                        $.each(query, function(depth, value) {
                            var camelCaseValue = depth != maxDepth ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1) : query;
                            if ($.isPlainObject(object[camelCaseValue]) && depth != maxDepth)
                                object = object[camelCaseValue];
                            else {
                                if (object[camelCaseValue] !== undefined)
                                    return found = object[camelCaseValue],
                                        !1;
                                if (!$.isPlainObject(object[value]) || depth == maxDepth)
                                    return object[value] !== undefined ? (found = object[value],
                                        !1) : !1;
                                object = object[value]
                            }
                        })),
                        $.isFunction(found) ? response = found.apply(context, passedArguments) : found !== undefined && (response = found),
                        $.isArray(returnedValue) ? returnedValue.push(response) : returnedValue !== undefined ? returnedValue = [returnedValue, response] : response !== undefined && (returnedValue = response),
                        found
                }
            },
                methodInvoked ? (instance === undefined && module.initialize(),
                    module.invoke(query)) : (instance !== undefined && module.destroy(),
                    module.initialize()),
                returnedValue !== undefined ? returnedValue : this
        }
            ,
            $.tab = function(settings) {
                $(window).tab(settings)
            }
            ,
            $.fn.tab.settings = {
                name: "Tab",
                debug: !1,
                verbose: !0,
                performance: !0,
                namespace: "tab",
                onTabInit: function(tabPath, parameterArray, historyEvent) {},
                onTabLoad: function(tabPath, parameterArray, historyEvent) {},
                templates: {
                    determineTitle: function(tabArray) {}
                },
                auto: !1,
                history: !0,
                historyType: "hash",
                path: !1,
                context: "body",
                maxDepth: 25,
                ignoreFirstLoad: !1,
                alwaysRefresh: !1,
                cache: !0,
                apiSettings: !1,
                error: {
                    api: "You attempted to load content without API module",
                    method: "The method you called is not defined",
                    missingTab: "Tab cannot be found",
                    noContent: "The tab you specified is missing a content url.",
                    path: "History enabled, but no path was specified",
                    recursion: "Max recursive depth reached",
                    state: "The state library has not been initialized"
                },
                metadata: {
                    tab: "tab",
                    loaded: "loaded",
                    promise: "promise"
                },
                className: {
                    loading: "loading",
                    active: "active"
                },
                selector: {
                    tabs: ".ui.tab"
                }
            }
    }(jQuery, window, document),
    function($, window, document, undefined) {
        $.fn.transition = function() {
            var returnedValue, $allModules = $(this), moduleSelector = $allModules.selector || "", time = (new Date).getTime(), performance = [], moduleArguments = arguments, query = moduleArguments[0], queryArguments = [].slice.call(arguments, 1), methodInvoked = "string" == typeof query;
            window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame || function(callback) {
                setTimeout(callback, 0)
            }
            ;
            return $allModules.each(function() {
                var settings, instance, error, className, metadata, animationEnd, animationName, namespace, moduleNamespace, module, $module = $(this), element = this;
                module = {
                    initialize: function() {
                        settings = module.get.settings.apply(element, moduleArguments),
                            module.verbose("Converted arguments into settings object", settings),
                            error = settings.error,
                            className = settings.className,
                            namespace = settings.namespace,
                            metadata = settings.metadata,
                            moduleNamespace = "module-" + namespace,
                            animationEnd = module.get.animationEvent(),
                            animationName = module.get.animationName(),
                            instance = $module.data(moduleNamespace) || module,
                        methodInvoked && (methodInvoked = module.invoke(query)),
                        methodInvoked === !1 && module.animate(),
                            module.instantiate()
                    },
                    instantiate: function() {
                        module.verbose("Storing instance of module", module),
                            $module.data(moduleNamespace, instance)
                    },
                    destroy: function() {
                        module.verbose("Destroying previous module for", element),
                            $module.removeData(moduleNamespace)
                    },
                    refresh: function() {
                        module.verbose("Refreshing display type on next animation"),
                            delete instance.displayType
                    },
                    forceRepaint: function() {
                        module.verbose("Forcing element repaint");
                        var $parentElement = $module.parent()
                            , $nextElement = $module.next();
                        0 === $nextElement.size() ? $module.detach().appendTo($parentElement) : $module.detach().insertBefore($nextElement)
                    },
                    repaint: function() {
                        module.verbose("Repainting element");
                        element.offsetWidth
                    },
                    animate: function(overrideSettings) {
                        return settings = overrideSettings || settings,
                            module.is.supported() ? (module.debug("Preparing animation", settings.animation),
                                module.is.animating() && settings.queue ? (!settings.allowRepeats && module.has.direction() && module.is.occuring() && instance.queuing !== !0 ? module.error(error.repeated) : module.queue(settings.animation),
                                    !1) : void (module.can.animate ? module.set.animating(settings.animation) : module.error(error.noAnimation, settings.animation))) : (module.error(error.support),
                                !1)
                    },
                    reset: function() {
                        module.debug("Resetting animation to beginning conditions"),
                            $module.off(animationEnd),
                            module.restore.conditions(),
                            module.hide(),
                            module.remove.animating()
                    },
                    queue: function(animation) {
                        module.debug("Queueing animation of", animation),
                            instance.queuing = !0,
                            $module.one(animationEnd, function() {
                                instance.queuing = !1,
                                    module.repaint(),
                                    module.animate.apply(this, settings)
                            })
                    },
                    complete: function() {
                        module.verbose("CSS animation complete", settings.animation),
                        module.is.looping() || (module.is.outward() ? (module.verbose("Animation is outward, hiding element"),
                            module.restore.conditions(),
                            module.remove.display(),
                            module.hide(),
                            $.proxy(settings.onHide, this)()) : module.is.inward() ? (module.verbose("Animation is outward, showing element"),
                            module.restore.conditions(),
                            module.show(),
                            $.proxy(settings.onShow, this)()) : module.restore.conditions(),
                            module.remove.duration(),
                            module.remove.animating()),
                            $.proxy(settings.complete, this)()
                    },
                    has: {
                        direction: function(animation) {
                            return animation = animation || settings.animation,
                                -1 !== animation.search(className.inward) || -1 !== animation.search(className.outward) ? (module.debug("Direction already set in animation"),
                                    !0) : !1
                        }
                    },
                    set: {
                        animating: function(animation) {
                            animation = animation || settings.animation,
                                module.save.conditions(),
                            module.can.transition() && !module.has.direction() && module.set.direction(),
                                module.remove.hidden(),
                                module.set.display(),
                                $module.addClass(className.animating).addClass(className.transition).addClass(animation).one(animationEnd, module.complete),
                                module.set.duration(settings.duration),
                                module.debug("Starting tween", settings.animation, $module.attr("class"))
                        },
                        display: function() {
                            var displayType = module.get.displayType();
                            "block" !== displayType && "none" !== displayType && (module.verbose("Setting final visibility to", displayType),
                                $module.css({
                                    display: displayType
                                }))
                        },
                        direction: function() {
                            $module.is(":visible") ? (module.debug("Automatically determining the direction of animation", "Outward"),
                                $module.removeClass(className.inward).addClass(className.outward)) : (module.debug("Automatically determining the direction of animation", "Inward"),
                                $module.removeClass(className.outward).addClass(className.inward))
                        },
                        looping: function() {
                            module.debug("Transition set to loop"),
                                $module.addClass(className.looping)
                        },
                        duration: function(duration) {
                            duration = duration || settings.duration,
                                duration = "number" == typeof duration ? duration + "ms" : duration,
                                module.verbose("Setting animation duration", duration),
                                $module.css({
                                    "-webkit-animation-duration": duration,
                                    "-moz-animation-duration": duration,
                                    "-ms-animation-duration": duration,
                                    "-o-animation-duration": duration,
                                    "animation-duration": duration
                                })
                        },
                        hidden: function() {
                            $module.addClass(className.transition).addClass(className.hidden)
                        },
                        visible: function() {
                            $module.addClass(className.transition).addClass(className.visible)
                        }
                    },
                    save: {
                        displayType: function(displayType) {
                            instance.displayType = displayType
                        },
                        transitionExists: function(animation, exists) {
                            $.fn.transition.exists[animation] = exists,
                                module.verbose("Saving existence of transition", animation, exists)
                        },
                        conditions: function() {
                            instance.cache = {
                                className: $module.attr("class"),
                                style: $module.attr("style")
                            },
                                module.verbose("Saving original attributes", instance.cache)
                        }
                    },
                    restore: {
                        conditions: function() {
                            return instance.cache === undefined ? !1 : (instance.cache.className ? $module.attr("class", instance.cache.className) : $module.removeAttr("class"),
                                instance.cache.style ? $module.attr("style", instance.cache.style) : "block" === module.get.displayType() && $module.removeAttr("style"),
                            module.is.looping() && module.remove.looping(),
                                void module.verbose("Restoring original attributes", instance.cache))
                        }
                    },
                    remove: {
                        animating: function() {
                            $module.removeClass(className.animating)
                        },
                        display: function() {
                            instance.displayType !== undefined && $module.css("display", "")
                        },
                        duration: function() {
                            $module.css({
                                "-webkit-animation-duration": "",
                                "-moz-animation-duration": "",
                                "-ms-animation-duration": "",
                                "-o-animation-duration": "",
                                "animation-duration": ""
                            })
                        },
                        hidden: function() {
                            $module.removeClass(className.hidden)
                        },
                        visible: function() {
                            $module.removeClass(className.visible)
                        },
                        looping: function() {
                            module.debug("Transitions are no longer looping"),
                                $module.removeClass(className.looping),
                                module.forceRepaint()
                        }
                    },
                    get: {
                        settings: function(animation, duration, complete) {
                            return "object" == typeof animation ? $.extend(!0, {}, $.fn.transition.settings, animation) : "function" == typeof complete ? $.extend({}, $.fn.transition.settings, {
                                animation: animation,
                                complete: complete,
                                duration: duration
                            }) : "string" == typeof duration || "number" == typeof duration ? $.extend({}, $.fn.transition.settings, {
                                animation: animation,
                                duration: duration
                            }) : "object" == typeof duration ? $.extend({}, $.fn.transition.settings, duration, {
                                animation: animation
                            }) : "function" == typeof duration ? $.extend({}, $.fn.transition.settings, {
                                animation: animation,
                                complete: duration
                            }) : $.extend({}, $.fn.transition.settings, {
                                animation: animation
                            })
                        },
                        displayType: function() {
                            return instance.displayType === undefined && module.can.transition(),
                                instance.displayType
                        },
                        transitionExists: function(animation) {
                            return $.fn.transition.exists[animation]
                        },
                        animationName: function() {
                            var animation, element = document.createElement("div"), animations = {
                                animation: "animationName",
                                OAnimation: "oAnimationName",
                                MozAnimation: "mozAnimationName",
                                WebkitAnimation: "webkitAnimationName"
                            };
                            for (animation in animations)
                                if (element.style[animation] !== undefined)
                                    return module.verbose("Determined animation vendor name property", animations[animation]),
                                        animations[animation];
                            return !1
                        },
                        animationEvent: function() {
                            var animation, element = document.createElement("div"), animations = {
                                animation: "animationend",
                                OAnimation: "oAnimationEnd",
                                MozAnimation: "animationend",
                                WebkitAnimation: "webkitAnimationEnd"
                            };
                            for (animation in animations)
                                if (element.style[animation] !== undefined)
                                    return module.verbose("Determined animation vendor end event", animations[animation]),
                                        animations[animation];
                            return !1
                        }
                    },
                    can: {
                        animate: function() {
                            return "none" !== $module.css(settings.animation) ? (module.debug("CSS definition found", $module.css(settings.animation)),
                                !0) : (module.debug("Unable to find css definition", $module.attr("class")),
                                !1)
                        },
                        transition: function() {
                            var $clone, currentAnimation, inAnimation, displayType, elementClass = $module.attr("class"), animation = settings.animation, transitionExists = module.get.transitionExists(settings.animation);
                            return (transitionExists === undefined || instance.displayType === undefined) && (module.verbose("Determining whether animation exists"),
                                $clone = $("<div>").addClass(elementClass).appendTo($("body")),
                                currentAnimation = $clone.removeClass(className.inward).removeClass(className.outward).addClass(className.animating).addClass(className.transition).addClass(animation).css(animationName),
                                inAnimation = $clone.addClass(className.inward).css(animationName),
                                displayType = $clone.attr("class", elementClass).show().css("display"),
                                module.verbose("Determining final display state", displayType),
                                currentAnimation != inAnimation ? (module.debug("Transition exists for animation", animation),
                                    transitionExists = !0) : (module.debug("Static animation found", animation, displayType),
                                    transitionExists = !1),
                                $clone.remove(),
                                module.save.displayType(displayType),
                                module.save.transitionExists(animation, transitionExists)),
                                transitionExists
                        }
                    },
                    is: {
                        animating: function() {
                            return $module.hasClass(className.animating)
                        },
                        inward: function() {
                            return $module.hasClass(className.inward)
                        },
                        outward: function() {
                            return $module.hasClass(className.outward)
                        },
                        looping: function() {
                            return $module.hasClass(className.looping)
                        },
                        occuring: function(animation) {
                            return animation = animation || settings.animation,
                                $module.hasClass(animation)
                        },
                        visible: function() {
                            return $module.is(":visible")
                        },
                        supported: function() {
                            return animationName !== !1 && animationEnd !== !1
                        }
                    },
                    hide: function() {
                        module.verbose("Hiding element"),
                            module.remove.visible(),
                            module.set.hidden(),
                            module.repaint()
                    },
                    show: function(display) {
                        module.verbose("Showing element", display),
                            module.remove.hidden(),
                            module.set.visible(),
                            module.repaint()
                    },
                    start: function() {
                        module.verbose("Starting animation"),
                            $module.removeClass(className.disabled)
                    },
                    stop: function() {
                        module.debug("Stopping animation"),
                            $module.addClass(className.disabled)
                    },
                    toggle: function() {
                        module.debug("Toggling play status"),
                            $module.toggleClass(className.disabled)
                    },
                    setting: function(name, value) {
                        if ($.isPlainObject(name))
                            $.extend(!0, settings, name);
                        else {
                            if (value === undefined)
                                return settings[name];
                            settings[name] = value
                        }
                    },
                    internal: function(name, value) {
                        if ($.isPlainObject(name))
                            $.extend(!0, module, name);
                        else {
                            if (value === undefined)
                                return module[name];
                            module[name] = value
                        }
                    },
                    debug: function() {
                        settings.debug && (settings.performance ? module.performance.log(arguments) : (module.debug = Function.prototype.bind.call(console.info, console, settings.name + ":"),
                            module.debug.apply(console, arguments)))
                    },
                    verbose: function() {
                        settings.verbose && settings.debug && (settings.performance ? module.performance.log(arguments) : (module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ":"),
                            module.verbose.apply(console, arguments)))
                    },
                    error: function() {
                        module.error = Function.prototype.bind.call(console.error, console, settings.name + ":"),
                            module.error.apply(console, arguments)
                    },
                    performance: {
                        log: function(message) {
                            var currentTime, executionTime, previousTime;
                            settings.performance && (currentTime = (new Date).getTime(),
                                previousTime = time || currentTime,
                                executionTime = currentTime - previousTime,
                                time = currentTime,
                                performance.push({
                                    Element: element,
                                    Name: message[0],
                                    Arguments: [].slice.call(message, 1) || "",
                                    "Execution Time": executionTime
                                })),
                                clearTimeout(module.performance.timer),
                                module.performance.timer = setTimeout(module.performance.display, 100)
                        },
                        display: function() {
                            var title = settings.name + ":"
                                , totalTime = 0;
                            time = !1,
                                clearTimeout(module.performance.timer),
                                $.each(performance, function(index, data) {
                                    totalTime += data["Execution Time"];
                                }),
                                title += " " + totalTime + "ms",
                            moduleSelector && (title += " '" + moduleSelector + "'"),
                            $allModules.size() > 1 && (title += " (" + $allModules.size() + ")"),
                            (console.group !== undefined || console.table !== undefined) && performance.length > 0 && (console.groupCollapsed(title),
                                console.table ? console.table(performance) : $.each(performance, function(index, data) {
                                    console.log(data.Name + ": " + data["Execution Time"] + "ms")
                                }),
                                console.groupEnd()),
                                performance = []
                        }
                    },
                    invoke: function(query, passedArguments, context) {
                        var maxDepth, found, response, object = instance;
                        return passedArguments = passedArguments || queryArguments,
                            context = element || context,
                        "string" == typeof query && object !== undefined && (query = query.split(/[\. ]/),
                            maxDepth = query.length - 1,
                            $.each(query, function(depth, value) {
                                var camelCaseValue = depth != maxDepth ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1) : query;
                                if ($.isPlainObject(object[camelCaseValue]) && depth != maxDepth)
                                    object = object[camelCaseValue];
                                else {
                                    if (object[camelCaseValue] !== undefined)
                                        return found = object[camelCaseValue],
                                            !1;
                                    if (!$.isPlainObject(object[value]) || depth == maxDepth)
                                        return object[value] !== undefined ? (found = object[value],
                                            !1) : !1;
                                    object = object[value]
                                }
                            })),
                            $.isFunction(found) ? response = found.apply(context, passedArguments) : found !== undefined && (response = found),
                            $.isArray(returnedValue) ? returnedValue.push(response) : returnedValue !== undefined ? returnedValue = [returnedValue, response] : response !== undefined && (returnedValue = response),
                        found || !1
                    }
                },
                    module.initialize()
            }),
                returnedValue !== undefined ? returnedValue : this
        }
            ,
            $.fn.transition.exists = {},
            $.fn.transition.settings = {
                name: "Transition",
                debug: !1,
                verbose: !0,
                performance: !0,
                namespace: "transition",
                complete: function() {},
                onShow: function() {},
                onHide: function() {},
                allowRepeats: !1,
                animation: "fade",
                duration: "700ms",
                queue: !0,
                className: {
                    animating: "animating",
                    disabled: "disabled",
                    hidden: "hidden",
                    inward: "in",
                    loading: "loading",
                    looping: "looping",
                    outward: "out",
                    transition: "ui transition",
                    visible: "visible"
                },
                error: {
                    noAnimation: "There is no css animation matching the one you specified.",
                    repeated: "That animation is already occurring, cancelling repeated animation",
                    method: "The method you called is not defined",
                    support: "This browser does not support CSS animations"
                }
            }
    }(jQuery, window, document),
    function($, window, document, undefined) {
        $.fn.video = function(parameters) {
            var returnedValue, $allModules = $(this), moduleSelector = $allModules.selector || "", time = (new Date).getTime(), performance = [], query = arguments[0], methodInvoked = "string" == typeof query, queryArguments = [].slice.call(arguments, 1);
            return $allModules.each(function() {
                var module, settings = $.isPlainObject(parameters) ? $.extend(!0, {}, $.fn.video.settings, parameters) : $.extend({}, $.fn.video.settings), selector = settings.selector, className = settings.className, error = settings.error, metadata = settings.metadata, namespace = settings.namespace, eventNamespace = "." + namespace, moduleNamespace = "module-" + namespace, $module = $(this), $placeholder = $module.find(selector.placeholder), $playButton = $module.find(selector.playButton), $embed = $module.find(selector.embed), element = this, instance = $module.data(moduleNamespace);
                module = {
                    initialize: function() {
                        module.debug("Initializing video"),
                            $placeholder.on("click" + eventNamespace, module.play),
                            $playButton.on("click" + eventNamespace, module.play),
                            module.instantiate()
                    },
                    instantiate: function() {
                        module.verbose("Storing instance of module", module),
                            instance = module,
                            $module.data(moduleNamespace, module)
                    },
                    destroy: function() {
                        module.verbose("Destroying previous instance of video"),
                            $module.removeData(moduleNamespace).off(eventNamespace),
                            $placeholder.off(eventNamespace),
                            $playButton.off(eventNamespace)
                    },
                    change: function(source, id, url) {
                        module.debug("Changing video to ", source, id, url),
                            $module.data(metadata.source, source).data(metadata.id, id).data(metadata.url, url),
                            settings.onChange()
                    },
                    reset: function() {
                        module.debug("Clearing video embed and showing placeholder"),
                            $module.removeClass(className.active),
                            $embed.html(" "),
                            $placeholder.show(),
                            settings.onReset()
                    },
                    play: function() {
                        module.debug("Playing video");
                        var source = $module.data(metadata.source) || !1
                            , url = $module.data(metadata.url) || !1
                            , id = $module.data(metadata.id) || !1;
                        $embed.html(module.generate.html(source, id, url)),
                            $module.addClass(className.active),
                            settings.onPlay()
                    },
                    generate: {
                        html: function(source, id, url) {
                            module.debug("Generating embed html");
                            var html, width = "auto" == settings.width ? $module.width() : settings.width, height = "auto" == settings.height ? $module.height() : settings.height;
                            return source && id ? "vimeo" == source ? html = '<iframe src="http://player.vimeo.com/video/' + id + "?=" + module.generate.url(source) + '" width="' + width + '" height="' + height + '" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>' : "youtube" == source && (html = '<iframe src="http://www.youtube.com/embed/' + id + "?=" + module.generate.url(source) + '" width="' + width + '" height="' + height + '" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>') : url ? html = '<iframe src="' + url + '" width="' + width + '" height="' + height + '" frameborder="0" webkitAllowFullScreen mozallowfullscreen allowFullScreen></iframe>' : module.error(error.noVideo),
                                html
                        },
                        url: function(source) {
                            var api = settings.api ? 1 : 0
                                , autoplay = settings.autoplay ? 1 : 0
                                , hd = settings.hd ? 1 : 0
                                , showUI = settings.showUI ? 1 : 0
                                , hideUI = settings.showUI ? 0 : 1
                                , url = "";
                            return "vimeo" == source && (url = "api=" + api + "&amp;title=" + showUI + "&amp;byline=" + showUI + "&amp;portrait=" + showUI + "&amp;autoplay=" + autoplay,
                            settings.color && (url += "&amp;color=" + settings.color)),
                                "ustream" == source ? (url = "autoplay=" + autoplay,
                                settings.color && (url += "&amp;color=" + settings.color)) : "youtube" == source && (url = "enablejsapi=" + api + "&amp;autoplay=" + autoplay + "&amp;autohide=" + hideUI + "&amp;hq=" + hd + "&amp;modestbranding=1",
                                settings.color && (url += "&amp;color=" + settings.color)),
                                url
                        }
                    },
                    setting: function(name, value) {
                        if ($.isPlainObject(name))
                            $.extend(!0, settings, name);
                        else {
                            if (value === undefined)
                                return settings[name];
                            settings[name] = value
                        }
                    },
                    internal: function(name, value) {
                        if ($.isPlainObject(name))
                            $.extend(!0, module, name);
                        else {
                            if (value === undefined)
                                return module[name];
                            module[name] = value
                        }
                    },
                    debug: function() {
                        settings.debug && (settings.performance ? module.performance.log(arguments) : (module.debug = Function.prototype.bind.call(console.info, console, settings.name + ":"),
                            module.debug.apply(console, arguments)))
                    },
                    verbose: function() {
                        settings.verbose && settings.debug && (settings.performance ? module.performance.log(arguments) : (module.verbose = Function.prototype.bind.call(console.info, console, settings.name + ":"),
                            module.verbose.apply(console, arguments)))
                    },
                    error: function() {
                        module.error = Function.prototype.bind.call(console.error, console, settings.name + ":"),
                            module.error.apply(console, arguments)
                    },
                    performance: {
                        log: function(message) {
                            var currentTime, executionTime, previousTime;
                            settings.performance && (currentTime = (new Date).getTime(),
                                previousTime = time || currentTime,
                                executionTime = currentTime - previousTime,
                                time = currentTime,
                                performance.push({
                                    Element: element,
                                    Name: message[0],
                                    Arguments: [].slice.call(message, 1) || "",
                                    "Execution Time": executionTime
                                })),
                                clearTimeout(module.performance.timer),
                                module.performance.timer = setTimeout(module.performance.display, 100)
                        },
                        display: function() {
                            var title = settings.name + ":"
                                , totalTime = 0;
                            time = !1,
                                clearTimeout(module.performance.timer),
                                $.each(performance, function(index, data) {
                                    totalTime += data["Execution Time"]
                                }),
                                title += " " + totalTime + "ms",
                            moduleSelector && (title += " '" + moduleSelector + "'"),
                            $allModules.size() > 1 && (title += " (" + $allModules.size() + ")"),
                            (console.group !== undefined || console.table !== undefined) && performance.length > 0 && (console.groupCollapsed(title),
                                console.table ? console.table(performance) : $.each(performance, function(index, data) {
                                    console.log(data.Name + ": " + data["Execution Time"] + "ms")
                                }),
                                console.groupEnd()),
                                performance = []
                        }
                    },
                    invoke: function(query, passedArguments, context) {
                        var maxDepth, found, response, object = instance;
                        return passedArguments = passedArguments || queryArguments,
                            context = element || context,
                        "string" == typeof query && object !== undefined && (query = query.split(/[\. ]/),
                            maxDepth = query.length - 1,
                            $.each(query, function(depth, value) {
                                var camelCaseValue = depth != maxDepth ? value + query[depth + 1].charAt(0).toUpperCase() + query[depth + 1].slice(1) : query;
                                if ($.isPlainObject(object[camelCaseValue]) && depth != maxDepth)
                                    object = object[camelCaseValue];
                                else {
                                    if (object[camelCaseValue] !== undefined)
                                        return found = object[camelCaseValue],
                                            !1;
                                    if (!$.isPlainObject(object[value]) || depth == maxDepth)
                                        return object[value] !== undefined ? (found = object[value],
                                            !1) : !1;
                                    object = object[value]
                                }
                            })),
                            $.isFunction(found) ? response = found.apply(context, passedArguments) : found !== undefined && (response = found),
                            $.isArray(returnedValue) ? returnedValue.push(response) : returnedValue !== undefined ? returnedValue = [returnedValue, response] : response !== undefined && (returnedValue = response),
                            found
                    }
                },
                    methodInvoked ? (instance === undefined && module.initialize(),
                        module.invoke(query)) : (instance !== undefined && module.destroy(),
                        module.initialize())
            }),
                returnedValue !== undefined ? returnedValue : this
        }
            ,
            $.fn.video.settings = {
                name: "Video",
                namespace: "video",
                debug: !1,
                verbose: !0,
                performance: !0,
                metadata: {
                    source: "source",
                    id: "id",
                    url: "url"
                },
                onPlay: function() {},
                onReset: function() {},
                onChange: function() {},
                onPause: function() {},
                onStop: function() {},
                width: "auto",
                height: "auto",
                autoplay: !1,
                color: "#442359",
                hd: !0,
                showUI: !1,
                api: !0,
                error: {
                    noVideo: "No video specified",
                    method: "The method you called is not defined"
                },
                className: {
                    active: "active"
                },
                selector: {
                    embed: ".embed",
                    placeholder: ".placeholder",
                    playButton: ".play"
                }
            }
    }(jQuery, window, document);
