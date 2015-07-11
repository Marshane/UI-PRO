//angular.module('ui.editable',[])
//    .run(["$templateCache", function ($templateCache) {
//        $templateCache.put("ui-edit-input.html",
//            '<input type="text" class="form-control ui-input {{inputClass}}" value="{{ngModel}}" {{max}}/>');
//        $templateCache.put("ui-edit-textarea.html",
//            '<textarea type="text" class="form-control ui-input {{inputClass}}" {{max}}>{{ngModel}}</textarea>');
//        $templateCache.put("ui-edit-select.html",
//            '<div ui-select ng-model="selectNgModel.ngModel"  default="{{\'CHOOSE\'|translate}}"  \
//                options="selectOptions"  as-value="{{selectAsValue}}"  key="{{selectKey}}" \
//                on-change="_selectOnChange(selectNgModel.ngModel)"></div>');
//    }]);
/*!
 angular-xeditable - 0.1.9
 Edit-in-place for angular.js
 Build date: 2015-03-26
 */
/**
 * Angular-xeditable module
 *
 */
angular.module('xeditable', [])


/**
 * Default options.
 *
 * @namespace editable-options
 */
//todo: maybe better have editableDefaults, not options...
    .value('editableOptions', {
        /**
         * Theme. Possible values `bs3`, `bs2`, `default`.
         *
         * @var {string} theme
         * @memberOf editable-options
         */
        theme: 'default',
        /**
         * Icon Set. Possible values `font-awesome`, `default`.
         *
         * @var {string} icon set
         * @memberOf editable-options
         */
        icon_set: 'default',
        /**
         * Whether to show buttons for single editalbe element.
         * Possible values `right` (default), `no`.
         *
         * @var {string} buttons
         * @memberOf editable-options
         */
        buttons: 'right',
        /**
         * Default value for `blur` attribute of single editable element.
         * Can be `cancel|submit|ignore`.
         *
         * @var {string} blurElem
         * @memberOf editable-options
         */
        blurElem: 'cancel',
        /**
         * Default value for `blur` attribute of editable form.
         * Can be `cancel|submit|ignore`.
         *
         * @var {string} blurForm
         * @memberOf editable-options
         */
        blurForm: 'ignore',
        /**
         * How input elements get activated. Possible values: `focus|select|none`.
         *
         * @var {string} activate
         * @memberOf editable-options
         */
        activate: 'focus',
        /**
         * Whether to disable x-editable. Can be overloaded on each element.
         *
         * @var {boolean} isDisabled
         * @memberOf editable-options
         */
        isDisabled: false,

        /**
         * Event, on which the edit mode gets activated.
         * Can be any event.
         *
         * @var {string} activationEvent
         * @memberOf editable-options
         */
        activationEvent: 'click'

    });
/*
 Input types: text|email|tel|number|url|search|color|date|datetime|time|month|week
 */

(function() {

    var types = 'text|password|email|tel|number|url|search|color|date|datetime|time|month|week|file'.split('|');

    //todo: datalist

    // generate directives
    angular.forEach(types, function(type) {
        var directiveName = 'editable'+type.charAt(0).toUpperCase() + type.slice(1);
        angular.module('xeditable').directive(directiveName, ['editableDirectiveFactory',
            function(editableDirectiveFactory) {
                return editableDirectiveFactory({
                    directiveName: directiveName,
                    inputTpl: '<input type="'+type+'">'
                });
            }]);
    });

}());


//select
angular.module('xeditable').directive('editableSelect', ['editableDirectiveFactory',
    function(editableDirectiveFactory) {
        return editableDirectiveFactory({
            directiveName: 'editableSelect',
            inputTpl: '<select></select>',
            autosubmit: function() {
                var self = this;
                self.inputEl.bind('change', function() {
                    self.scope.$apply(function() {
                        self.scope.$form.$submit();
                    });
                });
            }
        });
    }]);
//textarea
angular.module('xeditable').directive('editableTextarea', ['editableDirectiveFactory',
    function(editableDirectiveFactory) {
        return editableDirectiveFactory({
            directiveName: 'editableTextarea',
            inputTpl: '<textarea></textarea>',
            addListeners: function() {
                var self = this;
                self.parent.addListeners.call(self);
                // submit textarea by ctrl+enter even with buttons
                if (self.single && self.buttons !== 'no') {
                    self.autosubmit();
                }
            },
            autosubmit: function() {
                var self = this;
                self.inputEl.bind('keydown', function(e) {
                    if ((e.ctrlKey || e.metaKey) && (e.keyCode === 13)) {
                        self.scope.$apply(function() {
                            self.scope.$form.$submit();
                        });
                    }
                });
            }
        });
    }]);

/**
 * EditableController class.
 * Attached to element with `editable-xxx` directive.
 *
 * @namespace editable-element
 */
/*
 TODO: this file should be refactored to work more clear without closures!
 */
angular.module('xeditable').factory('editableController',
    ['$q', 'editableUtils',function($q, editableUtils) {
            //EditableController function
            EditableController.$inject = ['$scope', '$attrs', '$element', '$parse', 'editableThemes', 'editableIcons', 'editableOptions', '$rootScope', '$compile', '$q'];
            function EditableController($scope, $attrs, $element, $parse, editableThemes, editableIcons, editableOptions, $rootScope, $compile, $q) {
                var valueGetter;

                //if control is disabled - it does not participate in waiting process
                var inWaiting;

                var self = this;

                self.scope = $scope;
                self.elem = $element;
                self.attrs = $attrs;
                self.inputEl = null;
                self.editorEl = null;
                self.single = true;
                self.error = '';
                self.theme =  editableThemes[editableOptions.theme] || editableThemes['default'];
                self.parent = {};

                //will be undefined if icon_set is default and theme is default
                self.icon_set = editableOptions.icon_set === 'default' ? editableIcons.default[editableOptions.theme] : editableIcons.external[editableOptions.icon_set];

                //to be overwritten by directive
                self.inputTpl = '';
                self.directiveName = '';

                // with majority of controls copy is not needed, but..
                // copy MUST NOT be used for `select-multiple` with objects as items
                // copy MUST be used for `checklist`
                self.useCopy = false;

                //runtime (defaults)
                self.single = null;

                /**
                 * Attributes defined with `e-*` prefix automatically transfered from original element to
                 * control.
                 * For example, if you set `<span editable-text="user.name" e-style="width: 100px"`>
                 * then input will appear as `<input style="width: 100px">`.
                 * See [demo](#text-customize).
                 *
                 * @var {any|attribute} e-*
                 * @memberOf editable-element
                 */

                /**
                 * Whether to show ok/cancel buttons. Values: `right|no`.
                 * If set to `no` control automatically submitted when value changed.
                 * If control is part of form buttons will never be shown.
                 *
                 * @var {string|attribute} buttons
                 * @memberOf editable-element
                 */
                self.buttons = 'right';
                /**
                 * Action when control losses focus. Values: `cancel|submit|ignore`.
                 * Has sense only for single editable element.
                 * Otherwise, if control is part of form - you should set `blur` of form, not of individual element.
                 *
                 * @var {string|attribute} blur
                 * @memberOf editable-element
                 */
                    // no real `blur` property as it is transfered to editable form

                    //init
                self.init = function(single) {
                    self.single = single;

                    self.name = $attrs.eName || $attrs[self.directiveName];
                    /*
                     if(!$attrs[directiveName] && !$attrs.eNgModel && ($attrs.eValue === undefined)) {
                     throw 'You should provide value for `'+directiveName+'` or `e-value` in editable element!';
                     }
                     */
                    if($attrs[self.directiveName]) {
                        valueGetter = $parse($attrs[self.directiveName]);
                    } else {
                        throw 'You should provide value for `'+self.directiveName+'` in editable element!';
                    }

                    // settings for single and non-single
                    if (!self.single) {
                        // hide buttons for non-single
                        self.buttons = 'no';
                    } else {
                        self.buttons = self.attrs.buttons || editableOptions.buttons;
                    }

                    //if name defined --> watch changes and update $data in form
                    if($attrs.eName) {
                        self.scope.$watch('$data', function(newVal){
                            self.scope.$form.$data[$attrs.eName] = newVal;
                        });
                    }

                    /**
                     * Called when control is shown.
                     * See [demo](#select-remote).
                     *
                     * @var {method|attribute} onshow
                     * @memberOf editable-element
                     */
                    if($attrs.onshow) {
                        self.onshow = function() {
                            return self.catchError($parse($attrs.onshow)($scope));
                        };
                    }

                    /**
                     * Called when control is hidden after both save or cancel.
                     *
                     * @var {method|attribute} onhide
                     * @memberOf editable-element
                     */
                    if($attrs.onhide) {
                        self.onhide = function() {
                            return $parse($attrs.onhide)($scope);
                        };
                    }

                    /**
                     * Called when control is cancelled.
                     *
                     * @var {method|attribute} oncancel
                     * @memberOf editable-element
                     */
                    if($attrs.oncancel) {
                        self.oncancel = function() {
                            return $parse($attrs.oncancel)($scope);
                        };
                    }

                    /**
                     * Called during submit before value is saved to model.
                     * See [demo](#onbeforesave).
                     *
                     * @var {method|attribute} onbeforesave
                     * @memberOf editable-element
                     */
                    if ($attrs.onbeforesave) {
                        self.onbeforesave = function() {
                            return self.catchError($parse($attrs.onbeforesave)($scope));
                        };
                    }

                    /**
                     * Called during submit after value is saved to model.
                     * See [demo](#onaftersave).
                     *
                     * @var {method|attribute} onaftersave
                     * @memberOf editable-element
                     */
                    if ($attrs.onaftersave) {
                        self.onaftersave = function() {
                            return self.catchError($parse($attrs.onaftersave)($scope));
                        };
                    }

                    // watch change of model to update editable element
                    // now only add/remove `editable-empty` class.
                    // Initially this method called with newVal = undefined, oldVal = undefined
                    // so no need initially call handleEmpty() explicitly
                    $scope.$parent.$watch($attrs[self.directiveName], function(newVal, oldVal) {
                        self.setLocalValue();
                        self.handleEmpty();
                    });
                };

                self.render = function() {
                    var theme = self.theme;

                    //build input
                    self.inputEl = angular.element(self.inputTpl);

                    //build controls
                    self.controlsEl = angular.element(theme.controlsTpl);
                    self.controlsEl.append(self.inputEl);

                    //build buttons
                    if(self.buttons !== 'no') {
                        self.buttonsEl = angular.element(theme.buttonsTpl);
                        self.submitEl = angular.element(theme.submitTpl);
                        self.cancelEl = angular.element(theme.cancelTpl);
                        if(self.icon_set) {
                            self.submitEl.find('span').addClass(self.icon_set.ok);
                            self.cancelEl.find('span').addClass(self.icon_set.cancel);
                        }
                        self.buttonsEl.append(self.submitEl).append(self.cancelEl);
                        self.controlsEl.append(self.buttonsEl);

                        self.inputEl.addClass('editable-has-buttons');
                    }

                    //build error
                    self.errorEl = angular.element(theme.errorTpl);
                    self.controlsEl.append(self.errorEl);

                    //build editor
                    self.editorEl = angular.element(self.single ? theme.formTpl : theme.noformTpl);
                    self.editorEl.append(self.controlsEl);

                    // transfer `e-*|data-e-*|x-e-*` attributes
                    for(var k in $attrs.$attr) {
                        if(k.length <= 1) {
                            continue;
                        }
                        var transferAttr = false;
                        var nextLetter = k.substring(1, 2);

                        // if starts with `e` + uppercase letter
                        if(k.substring(0, 1) === 'e' && nextLetter === nextLetter.toUpperCase()) {
                            transferAttr = k.substring(1); // cut `e`
                        } else {
                            continue;
                        }

                        // exclude `form` and `ng-submit`,
                        if(transferAttr === 'Form' || transferAttr === 'NgSubmit') {
                            continue;
                        }

                        // convert back to lowercase style
                        transferAttr = transferAttr.substring(0, 1).toLowerCase() + editableUtils.camelToDash(transferAttr.substring(1));

                        // workaround for attributes without value (e.g. `multiple = "multiple"`)
                        // except for 'e-value'
                        var attrValue = (transferAttr !== 'value' && $attrs[k] === '') ? transferAttr : $attrs[k];

                        // set attributes to input
                        self.inputEl.attr(transferAttr, attrValue);
                    }

                    self.inputEl.addClass('editable-input');
                    self.inputEl.attr('ng-model', '$data');

                    // add directiveName class to editor, e.g. `editable-text`
                    self.editorEl.addClass(editableUtils.camelToDash(self.directiveName));

                    if(self.single) {
                        self.editorEl.attr('editable-form', '$form');
                        // transfer `blur` to form
                        self.editorEl.attr('blur', self.attrs.blur || (self.buttons === 'no' ? 'cancel' : editableOptions.blurElem));
                    }

                    //apply `postrender` method of theme
                    if(angular.isFunction(theme.postrender)) {
                        theme.postrender.call(self);
                    }

                };

                // with majority of controls copy is not needed, but..
                // copy MUST NOT be used for `select-multiple` with objects as items
                // copy MUST be used for `checklist`
                self.setLocalValue = function() {
                    self.scope.$data = self.useCopy ?
                        angular.copy(valueGetter($scope.$parent)) :
                        valueGetter($scope.$parent);
                };

                //show
                self.show = function() {
                    // set value of scope.$data
                    self.setLocalValue();

                    /*
                     Originally render() was inside init() method, but some directives polluting editorEl,
                     so it is broken on second openning.
                     Cloning is not a solution as jqLite can not clone with event handler's.
                     */
                    self.render();

                    // insert into DOM
                    $element.after(self.editorEl);

                    // compile (needed to attach ng-* events from markup)
                    $compile(self.editorEl)($scope);

                    // attach listeners (`escape`, autosubmit, etc)
                    self.addListeners();

                    // hide element
                    $element.addClass('editable-hide');

                    // onshow
                    return self.onshow();
                };

                //hide
                self.hide = function() {

                    self.editorEl.remove();
                    $element.removeClass('editable-hide');

                    // onhide
                    return self.onhide();
                };

                // cancel
                self.cancel = function() {
                    // oncancel
                    self.oncancel();
                    // don't call hide() here as it called in form's code
                };

                /*
                 Called after show to attach listeners
                 */
                self.addListeners = function() {
                    // bind keyup for `escape`
                    self.inputEl.bind('keyup', function(e) {
                        if(!self.single) {
                            return;
                        }

                        // todo: move this to editable-form!
                        switch(e.keyCode) {
                            // hide on `escape` press
                            case 27:
                                self.scope.$apply(function() {
                                    self.scope.$form.$cancel();
                                });
                                break;
                        }
                    });

                    // autosubmit when `no buttons`
                    if (self.single && self.buttons === 'no') {
                        self.autosubmit();
                    }

                    // click - mark element as clicked to exclude in document click handler
                    self.editorEl.bind('click', function(e) {
                        // ignore right/middle button click
                        if (e.which && e.which !== 1) {
                            return;
                        }

                        if (self.scope.$form.$visible) {
                            self.scope.$form._clicked = true;
                        }
                    });
                };

                // setWaiting
                self.setWaiting = function(value) {
                    if (value) {
                        // participate in waiting only if not disabled
                        inWaiting = !self.inputEl.attr('disabled') &&
                            !self.inputEl.attr('ng-disabled') &&
                            !self.inputEl.attr('ng-enabled');
                        if (inWaiting) {
                            self.inputEl.attr('disabled', 'disabled');
                            if(self.buttonsEl) {
                                self.buttonsEl.find('button').attr('disabled', 'disabled');
                            }
                        }
                    } else {
                        if (inWaiting) {
                            self.inputEl.removeAttr('disabled');
                            if (self.buttonsEl) {
                                self.buttonsEl.find('button').removeAttr('disabled');
                            }
                        }
                    }
                };

                self.activate = function(start, end) {
                    setTimeout(function() {
                        var el = self.inputEl[0];
                        if (editableOptions.activate === 'focus' && el.focus) {
                            if(start){
                                end = end || start;
                                el.onfocus = function(){
                                    var that = this;
                                    setTimeout(function(){
                                        that.setSelectionRange(start,end);
                                    });
                                };
                            }
                            el.focus();
                        }
                        if (editableOptions.activate === 'select' && el.select) {
                            el.select();
                        }
                    }, 0);
                };

                self.setError = function(msg) {
                    if(!angular.isObject(msg)) {
                        $scope.$error = msg;
                        self.error = msg;
                    }
                };

                /*
                 Checks that result is string or promise returned string and shows it as error message
                 Applied to onshow, onbeforesave, onaftersave
                 */
                self.catchError = function(result, noPromise) {
                    if (angular.isObject(result) && noPromise !== true) {
                        $q.when(result).then(
                            //success and fail handlers are equal
                            angular.bind(this, function(r) {
                                this.catchError(r, true);
                            }),
                            angular.bind(this, function(r) {
                                this.catchError(r, true);
                            })
                        );
                        //check $http error
                    } else if (noPromise && angular.isObject(result) && result.status &&
                        (result.status !== 200) && result.data && angular.isString(result.data)) {
                        this.setError(result.data);
                        //set result to string: to let form know that there was error
                        result = result.data;
                    } else if (angular.isString(result)) {
                        this.setError(result);
                    }
                    return result;
                };

                self.save = function() {
                    valueGetter.assign($scope.$parent,
                        self.useCopy ? angular.copy(self.scope.$data) : self.scope.$data);

                    // no need to call handleEmpty here as we are watching change of model value
                    // self.handleEmpty();
                };

                /*
                 attach/detach `editable-empty` class to element
                 */
                self.handleEmpty = function() {
                    var val = valueGetter($scope.$parent);
                    var isEmpty = val === null || val === undefined || val === "" || (angular.isArray(val) && val.length === 0);
                    $element.toggleClass('editable-empty', isEmpty);
                };

                /*
                 Called when `buttons = "no"` to submit automatically
                 */
                self.autosubmit = angular.noop;

                self.onshow = angular.noop;
                self.onhide = angular.noop;
                self.oncancel = angular.noop;
                self.onbeforesave = angular.noop;
                self.onaftersave = angular.noop;
            }

            return EditableController;
        }]);

/*
 editableFactory is used to generate editable directives (see `/directives` folder)
 Inside it does several things:
 - detect form for editable element. Form may be one of three types:
 1. autogenerated form (for single editable elements)
 2. wrapper form (element wrapped by <form> tag)
 3. linked form (element has `e-form` attribute pointing to existing form)

 - attach editableController to element

 Depends on: editableController, editableFormFactory
 */
angular.module('xeditable').factory('editableDirectiveFactory',
    ['$parse', '$compile', 'editableThemes', '$rootScope', '$document', 'editableController', 'editableFormController', 'editableOptions',
        function($parse, $compile, editableThemes, $rootScope, $document, editableController, editableFormController, editableOptions) {

            //directive object
            return function(overwrites) {
                return {
                    restrict: 'A',
                    scope: true,
                    require: [overwrites.directiveName, '?^form'],
                    controller: editableController,
                    link: function(scope, elem, attrs, ctrl) {
                        // editable controller
                        var eCtrl = ctrl[0];

                        // store original props to `parent` before merge
                        angular.forEach(overwrites, function(v, k) {
                            if(eCtrl[k] !== undefined) {
                                eCtrl.parent[k] = eCtrl[k];
                            }
                        });

                        // merge overwrites to base editable controller
                        angular.extend(eCtrl, overwrites);

                        // x-editable can be disabled using editableOption or edit-disabled attribute
                        var disabled = angular.isDefined(attrs.editDisabled) ?
                            scope.$eval(attrs.editDisabled) :
                            editableOptions.isDisabled;

                        if (disabled) {
                            return;
                        }

                        // init editable ctrl
                        eCtrl.init(!hasForm);

                        // publich editable controller as `$editable` to be referenced in html
                        scope.$editable = eCtrl;

                        // add `editable` class to element
                        elem.addClass('editable');

                        // hasForm
                        if(hasForm) {
                            if(eFormCtrl) {
                                scope.$form = eFormCtrl;
                                if(!scope.$form.$addEditable) {
                                    throw 'Form with editable elements should have `editable-form` attribute.';
                                }
                                scope.$form.$addEditable(eCtrl);
                            } else {
                                // future form (below): add editable controller to buffer and add to form later
                                $rootScope.$$editableBuffer = $rootScope.$$editableBuffer || {};
                                $rootScope.$$editableBuffer[attrs.eForm] = $rootScope.$$editableBuffer[attrs.eForm] || [];
                                $rootScope.$$editableBuffer[attrs.eForm].push(eCtrl);
                                scope.$form = null; //will be re-assigned later
                            }
                            // !hasForm
                        } else {
                            // create editableform controller
                            scope.$form = editableFormController();
                            // add self to editable controller
                            scope.$form.$addEditable(eCtrl);

                            // if `e-form` provided, publish local $form in scope
                            if(attrs.eForm) {
                                scope.$parent[attrs.eForm] = scope.$form;
                            }

                            // bind click - if no external form defined
                            if(!attrs.eForm || attrs.eClickable) {
                                elem.addClass('editable-click');
                                elem.bind(editableOptions.activationEvent, function(e) {
                                    e.preventDefault();
                                    e.editable = eCtrl;
                                    scope.$apply(function(){
                                        scope.$form.$show();
                                    });
                                });
                            }
                        }

                    }
                };
            };
        }]);

/**
 * editablePromiseCollection
 *
 * Collect results of function calls. Shows waiting if there are promises.
 * Finally, applies callbacks if:
 * - onTrue(): all results are true and all promises resolved to true
 * - onFalse(): at least one result is false or promise resolved to false
 * - onString(): at least one result is string or promise rejected or promise resolved to string
 */

angular.module('xeditable').factory('editablePromiseCollection', ['$q', function($q) {

    function promiseCollection() {
        return {
            promises: [],
            hasFalse: false,
            hasString: false,
            when: function(result, noPromise) {
                if (result === false) {
                    this.hasFalse = true;
                } else if (!noPromise && angular.isObject(result)) {
                    this.promises.push($q.when(result));
                } else if (angular.isString(result)){
                    this.hasString = true;
                } else { //result === true || result === undefined || result === null
                    return;
                }
            },
            //callbacks: onTrue, onFalse, onString
            then: function(callbacks) {
                callbacks = callbacks || {};
                var onTrue = callbacks.onTrue || angular.noop;
                var onFalse = callbacks.onFalse || angular.noop;
                var onString = callbacks.onString || angular.noop;
                var onWait = callbacks.onWait || angular.noop;

                var self = this;

                if (this.promises.length) {
                    onWait(true);
                    $q.all(this.promises).then(
                        //all resolved
                        function(results) {
                            onWait(false);
                            //check all results via same `when` method (without checking promises)
                            angular.forEach(results, function(result) {
                                self.when(result, true);
                            });
                            applyCallback();
                        },
                        //some rejected
                        function(error) {
                            onWait(false);
                            onString();
                        }
                    );
                } else {
                    applyCallback();
                }

                function applyCallback() {
                    if (!self.hasString && !self.hasFalse) {
                        onTrue();
                    } else if (!self.hasString && self.hasFalse) {
                        onFalse();
                    } else {
                        onString();
                    }
                }

            }
        };
    }

    return promiseCollection;

}]);

/**
 * editableUtils
 */
angular.module('xeditable').factory('editableUtils', [function() {
    return {
        indexOf: function (array, obj) {
            if (array.indexOf) return array.indexOf(obj);

            for ( var i = 0; i < array.length; i++) {
                if (obj === array[i]) return i;
            }
            return -1;
        },

        arrayRemove: function (array, value) {
            var index = this.indexOf(array, value);
            if (index >= 0) {
                array.splice(index, 1);
            }
            return value;
        },

        // copy from https://github.com/angular/angular.js/blob/master/src/Angular.js
        camelToDash: function(str) {
            var SNAKE_CASE_REGEXP = /[A-Z]/g;
            return str.replace(SNAKE_CASE_REGEXP, function(letter, pos) {
                return (pos ? '-' : '') + letter.toLowerCase();
            });
        },

        dashToCamel: function(str) {
            var SPECIAL_CHARS_REGEXP = /([\:\-\_]+(.))/g;
            var MOZ_HACK_REGEXP = /^moz([A-Z])/;
            return str.
                replace(SPECIAL_CHARS_REGEXP, function(_, separator, letter, offset) {
                    return offset ? letter.toUpperCase() : letter;
                }).
                replace(MOZ_HACK_REGEXP, 'Moz$1');
        }
    };
}]);

/*
 Editable icons:
 - default
 - font-awesome

 */
angular.module('xeditable').factory('editableIcons', function() {

    var icons = {
        //Icon-set to use, defaults to bootstrap icons
        default: {
            'bs2': {
                ok: 'icon-ok icon-white',
                cancel: 'icon-remove'
            },
            'bs3': {
                ok: 'glyphicon glyphicon-ok',
                cancel: 'glyphicon glyphicon-remove'
            }
        },
        external: {
            'font-awesome': {
                ok: 'fa fa-check',
                cancel: 'fa fa-times'
            }
        }
    };

    return icons;
});

/*
 Editable themes:
 - default
 - bootstrap 2
 - bootstrap 3

 Note: in postrender() `this` is instance of editableController
 */
angular.module('xeditable').factory('editableThemes', function() {
    var themes = {
        //default
        'default': {
            formTpl:      '<form class="editable-wrap"></form>',
            noformTpl:    '<span class="editable-wrap"></span>',
            controlsTpl:  '<span class="editable-controls"></span>',
            inputTpl:     '',
            errorTpl:     '<div class="editable-error" ng-show="$error" ng-bind="$error"></div>',
            buttonsTpl:   '<span class="editable-buttons"></span>',
            submitTpl:    '<button type="submit">save</button>',
            cancelTpl:    '<button type="button" ng-click="$form.$cancel()">cancel</button>'
        },

        //bs2
        'bs2': {
            formTpl:     '<form class="form-inline editable-wrap" role="form"></form>',
            noformTpl:   '<span class="editable-wrap"></span>',
            controlsTpl: '<div class="editable-controls controls control-group" ng-class="{\'error\': $error}"></div>',
            inputTpl:    '',
            errorTpl:    '<div class="editable-error help-block" ng-show="$error" ng-bind="$error"></div>',
            buttonsTpl:  '<span class="editable-buttons"></span>',
            submitTpl:   '<button type="submit" class="btn btn-primary"><span></span></button>',
            cancelTpl:   '<button type="button" class="btn" ng-click="$form.$cancel()">'+
                '<span></span>'+
                '</button>'

        },

        //bs3
        'bs3': {
            formTpl:     '<form class="form-inline editable-wrap" role="form"></form>',
            noformTpl:   '<span class="editable-wrap"></span>',
            controlsTpl: '<div class="editable-controls form-group" ng-class="{\'has-error\': $error}"></div>',
            inputTpl:    '',
            errorTpl:    '<div class="editable-error help-block" ng-show="$error" ng-bind="$error"></div>',
            buttonsTpl:  '<span class="editable-buttons"></span>',
            submitTpl:   '<button type="submit" class="btn btn-primary"><span></span></button>',
            cancelTpl:   '<button type="button" class="btn btn-default" ng-click="$form.$cancel()">'+
                '<span></span>'+
                '</button>',

            //bs3 specific prop to change buttons class: btn-sm, btn-lg
            buttonsClass: '',
            //bs3 specific prop to change standard inputs class: input-sm, input-lg
            inputClass: '',
            postrender: function() {
                //apply `form-control` class to std inputs
                switch(this.directiveName) {
                    case 'editableText':
                    case 'editableSelect':
                    case 'editableTextarea':
                    case 'editableEmail':
                    case 'editableTel':
                    case 'editableNumber':
                    case 'editableUrl':
                    case 'editableSearch':
                    case 'editableDate':
                    case 'editableDatetime':
                    case 'editableBsdate':
                    case 'editableTime':
                    case 'editableMonth':
                    case 'editableWeek':
                        this.inputEl.addClass('form-control');
                        if(this.theme.inputClass) {
                            // don`t apply `input-sm` and `input-lg` to select multiple
                            // should be fixed in bs itself!
                            if(this.inputEl.attr('multiple') &&
                                (this.theme.inputClass === 'input-sm' || this.theme.inputClass === 'input-lg')) {
                                break;
                            }
                            this.inputEl.addClass(this.theme.inputClass);
                        }
                        break;
                    case 'editableCheckbox':
                        this.editorEl.addClass('checkbox');
                }

                //apply buttonsClass (bs3 specific!)
                if(this.buttonsEl && this.theme.buttonsClass) {
                    this.buttonsEl.find('button').addClass(this.theme.buttonsClass);
                }
            }
        }
    };

    return themes;
});
