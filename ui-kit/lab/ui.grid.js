var uiGrid;
(function (uiGrid) {
    (function (SelectionMode) {
        SelectionMode[SelectionMode["None"] = 0] = "None";
        SelectionMode[SelectionMode["SingleRow"] = 1] = "SingleRow";
        SelectionMode[SelectionMode["MultiRow"] = 2] = "MultiRow";
        SelectionMode[SelectionMode["MultiRowWithKeyModifiers"] = 3] = "MultiRowWithKeyModifiers";
    })(uiGrid.SelectionMode || (uiGrid.SelectionMode = {}));
    var SelectionMode = uiGrid.SelectionMode;

    // it's important to assign all the default column options, so we can match them with the column attributes in the markup
    uiGrid.defaultColumnOptions = {
        cellWidth: null,
        cellHeight: null,
        displayAlign: null,
        displayFormat: null,
        displayName: null,
        filter: null,
        enableFiltering: null,
        enableSorting: null
    };

    uiGrid.translations = {};

    uiGrid.debugMode = false;

    var templatesConfigured = false;
    var tableDirective = "uiGrid";
    uiGrid.sortFilter = tableDirective + "SortFilter";
    uiGrid.dataPagingFilter = tableDirective + "DataPagingFilter";
    uiGrid.translateFilter = tableDirective + "TranslateFilter";
    uiGrid.translationDateFormat = tableDirective + "DateFormat";
    uiGrid.dataFormattingFilter = tableDirective + "DataFormatFilter";

    //var headerDirective="uiGridHeader";
    //var headerDirectiveAttribute = "ui-grid-header";
    var bodyDirective = "uiGridBody";
    var bodyDirectiveAttribute = "ui-grid-body";

    var uiGridDragMark="ui-grid-drag-mark";//拖拽参考线;
    var uiGridStartDrag="ui-grid-startdrag";//拖拽条件class

    var fieldNameAttribute = "field-name";
    var isCustomizedAttribute = "is-customized";

    var cellFooterDirective = "uiGridFooterCell";
    var cellFooterDirectiveAttribute = "ui-grid-footer-cell";
    var cellFooterTemplateDirective = "uiGridFooterCellTemplate";
    var cellFooterTemplateDirectiveAttribute = "ui-grid-footer-cell-template";
    uiGrid.cellFooterTemplateId = cellFooterTemplateDirective + ".html";

    var globalFilterDirective = "uiGridGlobalFilter";
    uiGrid.globalFilterDirectiveAttribute = "ui-grid-global-filter";
    uiGrid.footerGlobalFilterTemplateId = globalFilterDirective + ".html";

    var pagerDirective = "uiGridPager";
    uiGrid.pagerDirectiveAttribute = "ui-grid-pager";
    uiGrid.footerPagerTemplateId = pagerDirective + ".html";

    var cellHeaderDirective = "uiGridHeaderCell";
    var cellHeaderDirectiveAttribute = "ui-grid-header-cell";
    var cellHeaderTemplateDirective = "uiGridHeaderCellTemplate";
    var cellHeaderTemplateDirectiveAttribute = "ui-grid-header-cell-template";
    uiGrid.cellHeaderTemplateId = cellHeaderTemplateDirective + ".html";

    var cellBodyDirective = "uiGridBodyCell";
    var cellBodyDirectiveAttribute = "ui-grid-body-cell";
    var cellBodyTemplateDirective = "uiGridBodyCellTemplate";
    var cellBodyTemplateDirectiveAttribute = "ui-grid-body-cell-template";
    uiGrid.cellBodyTemplateId = cellBodyTemplateDirective + ".html";

    var columnSortDirective = "uiGridColumnSort";
    uiGrid.columnSortDirectiveAttribute = "ui-grid-column-sort";
    uiGrid.columnSortTemplateId = columnSortDirective + ".html";

    var columnFilterDirective = "uiGridColumnFilter";
    uiGrid.columnFilterDirectiveAttribute = "ui-grid-column-filter";
    uiGrid.columnFilterTemplateId = columnFilterDirective + ".html";

    var findChildByTagName = function (parent, childTag) {
        childTag = childTag.toUpperCase();
        var children = parent.children();
        for (var childIndex = 0; childIndex < children.length; childIndex++) {
            var childElement = children[childIndex];
            if (childElement.tagName == childTag) {
                return angular.element(childElement);
            }
        }

        return null;
    };
    var findChildrenByTagName = function (parent, childTag) {
        childTag = childTag.toUpperCase();
        var retChildren = [];
        var children = parent.children();
        for (var childIndex = 0; childIndex < children.length; childIndex++) {
            var childElement = children[childIndex];
            if (childElement.tagName == childTag) {
                retChildren.push(angular.element(childElement));
            }
        }

        return retChildren;
    };
    /**
     * Combines two sets of cell infos. The first set will take precedence in the checks but the combined items will contain items from the second set if they match.
     */
    var combineGridCellInfos = function (firstSet, secondSet, addExtraFieldItemsSecondSet, addExtraNonFieldItemsSecondSet) {
        var combinedSet = [];
        var secondTempSet = secondSet.slice(0);
        angular.forEach(firstSet, function (firstSetColumn) {
            // find a correspondence in the second set
            var foundSecondSetColumn = null;
            for (var secondSetColumnIndex = 0; !foundSecondSetColumn && secondSetColumnIndex < secondTempSet.length; secondSetColumnIndex++) {
                foundSecondSetColumn = secondTempSet[secondSetColumnIndex];
                if (foundSecondSetColumn.fieldName === firstSetColumn.fieldName) {
                    secondTempSet.splice(secondSetColumnIndex, 1);
                } else {
                    foundSecondSetColumn = null;
                }
            }

            if (foundSecondSetColumn) {
                combinedSet.push(foundSecondSetColumn);
            } else {
                combinedSet.push(firstSetColumn);
            }
        });

        // add the remaining items from the second set in the combined set
        if (addExtraFieldItemsSecondSet || addExtraNonFieldItemsSecondSet) {
            angular.forEach(secondTempSet, function (secondSetColumn) {
                if ((addExtraFieldItemsSecondSet && secondSetColumn.fieldName) || (addExtraNonFieldItemsSecondSet && !secondSetColumn.fieldName)) {
                    combinedSet.push(secondSetColumn);
                }
            });
        }

        return combinedSet;
    };
    var wrapTemplatedCell = function (templateElement, tAttrs, isCustomized, cellTemplateDirective) {
        if (isCustomized) {
            var childrenElements = templateElement.children();
            var firstChildElement = angular.element(childrenElements[0]);
            if (childrenElements.length !== 1 || !firstChildElement.attr(cellTemplateDirective)) {
                // wrap the children of the custom template cell
                templateElement.empty();
                var templateWrapElement = angular.element("<div></div>").attr(cellTemplateDirective, "");
                templateElement.append(templateWrapElement);
                angular.forEach(childrenElements, function (childElement) {
                    templateWrapElement.append(angular.element(childElement));
                });
            }
        } else {
            templateElement.empty();
            templateElement.append(angular.element("<div></div>").attr(cellTemplateDirective, ""));
        }
    };
    var TemplatedCell = (function () {
        function TemplatedCell(parent, cellElement) {
            this.parent = parent;
            this.cellElement = cellElement;
            this.fieldName = cellElement.attr(fieldNameAttribute);
            var customContent = cellElement.children();
            this.isStandardColumn = customContent.length === 0;
        }
        return TemplatedCell;
    })();
    var TemplatedSection = (function () {
        function TemplatedSection(sectionTagName, sectionDirectiveAttribute, rowDirectiveAttribute, cellTagName, cellDirectiveAttribute) {
            this.sectionTagName = sectionTagName;
            this.sectionDirectiveAttribute = sectionDirectiveAttribute;
            this.rowDirectiveAttribute = rowDirectiveAttribute;
            this.cellTagName = cellTagName;
            this.cellDirectiveAttribute = cellDirectiveAttribute;
            this.cellTagName = this.cellTagName.toUpperCase();
            this.cells = null;
        }
        TemplatedSection.prototype.configureSection = function (gridElement, columnDefs) {
            var _this = this;
            var sectionElement = this.getSectionElement(gridElement, true);
            sectionElement.empty();
            sectionElement.removeAttr("ng-non-bindable");

            // add the elements in order
            var rowElementDefinitions = combineGridCellInfos(columnDefs, this.cells, false, false);

            // grab the templated row
            var templatedRowElement = this.getTemplatedRowElement(sectionElement, true);

            angular.forEach(rowElementDefinitions, function (gridCell, index) {
                var gridCellElement;

                var templatedCell = gridCell;

                // it might not be a templated cell, beware
                if (templatedCell.parent === _this && templatedCell.cellElement) {
                    gridCellElement = templatedCell.cellElement.clone(true);
                } else {
                    gridCellElement = angular.element("<table><" + _this.cellTagName + "></" + _this.cellTagName + "></table>").find(_this.cellTagName);
                }

                // set it up
                if (_this.cellDirectiveAttribute) {
                    gridCellElement.attr(_this.cellDirectiveAttribute, index);
                }
                if (!gridCell.isStandardColumn) {
                    gridCellElement.attr(isCustomizedAttribute, "true");
                }

                if (gridCell.fieldName) {
                    gridCellElement.attr(fieldNameAttribute, gridCell.fieldName);
                }

                // gridCellElement.attr("ng-style", "{\'width\':columnOptions.cellWidth,\'height\':columnOptions.cellHeight}");

                // finally add it to the parent
                templatedRowElement.append(gridCellElement);
            });

            return sectionElement;
        };

        TemplatedSection.prototype.extractPartialColumnDefinitions = function () {
            return this.cells;
        };

        TemplatedSection.prototype.discoverCells = function (gridElement) {
            var _this = this;
            this.cells = [];

            var templatedRow = this.getTemplatedRowElement(this.getSectionElement(gridElement, false), false);
            if (templatedRow) {
                angular.forEach(templatedRow.children(), function (childElement, childIndex) {
                    childElement = angular.element(childElement);
                    if (childElement[0].tagName === _this.cellTagName.toUpperCase()) {
                        var templateElement = childElement.clone(true);
                        _this.cells.push(new TemplatedCell(_this, templateElement));
                    }
                });
            }
        };

        TemplatedSection.prototype.getSectionElement = function (gridElement, ensurePresent) {
            var sectionElement = null;
            if (gridElement) {
                sectionElement = findChildByTagName(gridElement, this.sectionTagName);
            }
            if (!sectionElement && ensurePresent) {
                // angular strikes again: https://groups.google.com/forum/#!topic/angular/7poFynsguNw
                sectionElement = angular.element("<table><" + this.sectionTagName + "></" + this.sectionTagName + "></table>").find(this.sectionTagName);
                if (gridElement) {
                    gridElement.append(sectionElement);
                }
            }

            if (ensurePresent && this.sectionDirectiveAttribute) {
                sectionElement.attr(this.sectionDirectiveAttribute, "");
            }
            return sectionElement;
        };

        TemplatedSection.prototype.getTemplatedRowElement = function (sectionElement, ensurePresent) {
            var rowElement = null;
            if (sectionElement) {
                rowElement = findChildByTagName(sectionElement, "tr");
            }
            if (!rowElement && ensurePresent) {
                rowElement = angular.element("<table><tr></tr></table>").find("tr");
                if (sectionElement) {
                    sectionElement.append(rowElement);
                }
            }

            if (ensurePresent && this.rowDirectiveAttribute) {
                rowElement.attr(this.rowDirectiveAttribute, "");
            }
            return rowElement;
        };
        return TemplatedSection;
    })();
    var GridController = (function () {
        function GridController($compile, $parse, $timeout, $templateCache) {
            this.$compile = $compile;
            this.$parse = $parse;
            this.$timeout = $timeout;
            if (!templatesConfigured) {
                configureTemplates($templateCache);
                templatesConfigured = true;
            }
        }
        GridController.prototype.setupScope = function ($isolatedScope, $gridElement, $attrs) {
            var _this = this;
            // create a scope, used just by our grid
            var gridScope = angular.element($gridElement).scope().$new();
            this._gridScope=gridScope;
            // initialise the options
            this.gridOptions = {
                immediateDataRetrieval: true,//立即获取数据
                items: [],
                fields: null,
                locale: "en",
                selectedItems: [],
                filterBy: null,
                filterByFields: {},
                orderBy: null,
                orderByReverse: false,
                pageItems: null,
                currentPage:$isolatedScope["currentPage"],
                hidePager:$isolatedScope["hidePager"],
                trackBy:$isolatedScope["trackBy"],
                totalItems: null,
                dragable:this.$parse($isolatedScope.dragable)($isolatedScope),
                onpageCleardata:this.$parse($isolatedScope.onpageCleardata)($isolatedScope),
                enableFiltering: false,
                enableSorting: true,
                pageItemsInput:false,//显示自定义当页显示数input
                selectionMode: SelectionMode[2 /* MultiRow */],
                onDataRequiredDelay: 1000,
                onDataRequired: $attrs["onDataRequired"] ? $isolatedScope["onDataRequired"] : null,
                gridColumnDefs: []
            };
            //link the outer scope with the internal one
            gridScope.gridOptions = this.gridOptions;
            gridScope.uiGrid = uiGrid;
            this.linkScope(gridScope, $isolatedScope, "gridOptions", $attrs);

            if(this.gridOptions.dragable){
                this.dragHandler($isolatedScope,$gridElement, $attrs);
            }

            //set up watchers for some of the special attributes we support
            if (this.gridOptions.onDataRequired) {
                var retrieveDataCallback = function () {
                    _this.dataRequestPromise = null;
                    _this.gridOptions.immediateDataRetrieval = false;

                    _this.gridOptions.onDataRequired(_this.gridOptions);
                    //调整表格宽度
                    _this.gridOptions.dragable&&_this.$timeout(function(){
                        _this.handlerResize();
                    },1000,false);
                };

                var scheduleDataRetrieval = function () {
                    if (_this.dataRequestPromise) {
                        _this.$timeout.cancel(_this.dataRequestPromise);
                        _this.dataRequestPromise = null;
                    }
                    if (_this.gridOptions.immediateDataRetrieval) {
                        retrieveDataCallback();
                    } else {
                        _this.dataRequestPromise = _this.$timeout(function () {
                            retrieveDataCallback();
                        }, _this.gridOptions.onDataRequiredDelay, true);
                    }
                };
                // gridScope.$watch("gridOptions.currentPage", function (newValue, oldValue) {
                //     var pageChanged = newValue !== oldValue;
                //     if (!angular.equals(newValue, oldValue) && !pageChanged) {
                //         // everything will reset the page index, with the exception of a page index change
                //         if (_this.gridOptions.currentPage !== 0) {
                //             _this.gridOptions.currentPage = 0;
                //             // the page index watch will activate, exit for now to avoid duplicate data requests
                //             return;
                //         }
                //     }
                //     scheduleDataRetrieval();
                //     // if (newValue !== oldValue) {
                //     //     scheduleDataRetrieval();
                //     // }
                // });
                // gridScope.$watchCollection("[" + "gridOptions.filterBy, " + "gridOptions.filterByFields, " + "gridOptions.orderBy, " + "gridOptions.orderByReverse, " + "gridOptions.pageItems, " + "]", function (newValues, oldValues) {
                // gridScope.$watch("gridOptions.pageItems", function (newValues, oldValues) {
                //     // everything will reset the page index, with the exception of a page index change
                //     // if (_this.gridOptions.currentPage !== 0) {
                //     //     _this.gridOptions.currentPage = 0;
                //     //     // the page index watch will activate, exit for now to avoid duplicate data requests
                //     //     return;
                //     // }
                //     if(newValues!==oldValues)
                //         scheduleDataRetrieval();
                // });
                scheduleDataRetrieval();//默认调用 数据接口
                gridScope.$watch("gridOptions.immediateDataRetrieval", function (newValue) {
                    if (newValue && _this.dataRequestPromise) {
                        _this.$timeout.cancel(_this.dataRequestPromise);
                        retrieveDataCallback();
                    }
                });
            }

            // the new settings
            // gridScope.$watch("gridOptions.selectionMode", function (newValue, oldValue) {
            //     if (newValue !== oldValue) {
            //         switch (newValue) {
            //             case SelectionMode[0 /* None */]:
            //                 _this.gridOptions.selectedItems.splice(0);
            //                 break;
            //             case SelectionMode[1 /* SingleRow */]:
            //                 if (_this.gridOptions.selectedItems.length > 1) {
            //                     _this.gridOptions.selectedItems.splice(1);
            //                 }
            //                 break;
            //         }
            //     }
            // });
            return gridScope;
        };
        GridController.prototype.speedUpAsyncDataRetrieval = function ($event) {
            // console.log(this.gridOptions.immediateDataRetrieval);
            if (!$event || $event.keyCode == 13) {
                this.gridOptions.immediateDataRetrieval = true;
            }
            // console.log(this.gridOptions.immediateDataRetrieval);
            //当分页是清空选择的数据和状态
            // console.log(this.gridOptions.selectedItems);
            // console.log(this.gridOptions);
            if(this.gridOptions.onpageCleardata&&this.gridOptions.selectedItems&&this.gridOptions.selectedItems.length)
                this.clearSelected();
        };
        GridController.prototype.clearSelected = function () {
            this.gridOptions.selectedItems.length=0;
            var input = this.headerElement.find('input');
            if(input.length){
                input.scope().areAllSelected=false;
            }
        };
        GridController.prototype.setColumnOptions = function (columnIndex, columnOptions) {
            var originalOptions = this.gridOptions.gridColumnDefs[columnIndex];
            if (!originalOptions) {
                throw "Invalid grid column options found for column index " + columnIndex + ". Please report this error.";
            }

            // copy a couple of options onto the incoming set of options
            columnOptions = angular.extend(columnOptions, originalOptions);

            // replace the original options
            this.gridOptions.gridColumnDefs[columnIndex] = columnOptions;
        };
        GridController.prototype.toggleSorting = function (propertyName) {
            if (this.gridOptions.orderBy != propertyName) {
                // the column has changed
                this.gridOptions.orderBy = propertyName;
            } else {
                // the sort direction has changed
                this.gridOptions.orderByReverse = !this.gridOptions.orderByReverse;
            }
            // console.log(this._gridScope);
            // this.speedUpAsyncDataRetrieval();
            this.computeFilteredItems(this._gridScope);
        };
        GridController.prototype.getFormattedFieldName = function (fieldName) {
            return fieldName.replace(/[\.\[\]]/g, "_");
        };
        GridController.prototype.setFilter = function (fieldName, filter) {
            if (!filter) {
                delete (this.gridOptions.filterByFields[fieldName]);
            } else {
                this.gridOptions.filterByFields[fieldName] = filter;
            }

            // in order for someone to successfully listen to changes made to this object, we need to replace it
            this.gridOptions.filterByFields = angular.extend({}, this.gridOptions.filterByFields);
        };
        GridController.prototype.toggleItemSelection = function (filteredItems, item, $event) {
            if (this.gridOptions.selectionMode === SelectionMode[0 /* None */])
                return;
            switch (this.gridOptions.selectionMode) {
                case SelectionMode[3 /* MultiRowWithKeyModifiers */]:
                    if (!$event.ctrlKey && !$event.shiftKey && !$event.metaKey) {
                        // if neither key modifiers are pressed, clear the selection and start fresh
                        var itemIndex = this.gridOptions.selectedItems.indexOf(item);
                        this.gridOptions.selectedItems.splice(0);
                        if (itemIndex < 0) {
                            this.gridOptions.selectedItems.push(item);
                        }
                    } else {
                        if ($event.ctrlKey || $event.metaKey) {
                            // the ctrl key deselects or selects the item
                            var itemIndex = this.gridOptions.selectedItems.indexOf(item);
                            if (itemIndex >= 0) {
                                this.gridOptions.selectedItems.splice(itemIndex, 1);
                            } else {
                                this.gridOptions.selectedItems.push(item);
                            }
                        } else if ($event.shiftKey) {
                            // clear undesired selections, if the styles are not applied
                            if (document.selection && document.selection.empty) {
                                document.selection.empty();
                            } else if (window.getSelection) {
                                var sel = window.getSelection();
                                sel.removeAllRanges();
                            }

                            // the shift key will always select items from the last selected item
                            var firstItemIndex;
                            var lastSelectedItem = this.gridOptions.selectedItems[this.gridOptions.selectedItems.length - 1];
                            for (firstItemIndex = 0; firstItemIndex < filteredItems.length && filteredItems[firstItemIndex].$$_gridItem !== lastSelectedItem; firstItemIndex++)
                                ;
                            if (firstItemIndex >= filteredItems.length) {
                                firstItemIndex = 0;
                            }

                            var lastItemIndex;
                            for (lastItemIndex = 0; lastItemIndex < filteredItems.length && filteredItems[lastItemIndex].$$_gridItem !== item; lastItemIndex++)
                                ;
                            if (lastItemIndex >= filteredItems.length) {
                                throw "Invalid selection on a key modifier selection mode";
                            }
                            if (lastItemIndex < firstItemIndex) {
                                var tempIndex = firstItemIndex;
                                firstItemIndex = lastItemIndex;
                                lastItemIndex = tempIndex;
                            }

                            for (var currentItemIndex = firstItemIndex; currentItemIndex <= lastItemIndex; currentItemIndex++) {
                                var currentItem = filteredItems[currentItemIndex].$$_gridItem;
                                if (this.gridOptions.selectedItems.indexOf(currentItem) < 0) {
                                    this.gridOptions.selectedItems.push(currentItem);
                                }
                            }
                        }
                    }
                    break;
                case SelectionMode[1 /* SingleRow */]:
                    var itemIndex = this.gridOptions.selectedItems.indexOf(item);
                    console.log(itemIndex);
                    // fix <=ie8   splice(0,length)
                    this.gridOptions.selectedItems.splice(0,this.gridOptions.selectedItems.length);
                    console.log(this.gridOptions.selectedItems);
                    if (itemIndex < 0) {
                        this.gridOptions.selectedItems.push(item);
                    }
                    break;
                case SelectionMode[2 /* MultiRow */]:
                    var itemIndex = this.gridOptions.selectedItems.indexOf(item);
                    if (itemIndex >= 0) {
                        this.gridOptions.selectedItems.splice(itemIndex, 1);
                    } else {
                        this.gridOptions.selectedItems.push(item);
                    }
                    break;
            }
        };
        GridController.prototype.discoverTemplates = function (gridElement) {
            this.templatedHeader = new TemplatedSection("thead", null, null, "th", cellHeaderDirectiveAttribute);
            this.templatedBody = new TemplatedSection("tbody", bodyDirectiveAttribute, null, "td", cellBodyDirectiveAttribute);
            this.templatedFooter = new TemplatedSection("tfoot", null, null, "td", cellFooterDirectiveAttribute);

            this.templatedHeader.discoverCells(gridElement);
            this.templatedFooter.discoverCells(gridElement);
            this.templatedBody.discoverCells(gridElement);
        };
        GridController.prototype.configureTableStructure = function (parentScope, gridElement, oldScope) {
            var _this = this;
            var scope = parentScope.$new();
            gridElement.empty();

            // make sure we're no longer watching for column defs
            if (this.columnDefsItemsWatcherDeregistration) {
                this.columnDefsItemsWatcherDeregistration();
                this.columnDefsItemsWatcherDeregistration = null;
            }
            if (this.columnDefsFieldsWatcherDeregistration) {
                this.columnDefsFieldsWatcherDeregistration();
                this.columnDefsFieldsWatcherDeregistration = null;
            }

            // watch for a change in field values
            // don't be tempted to use watchcollection, it always returns same values which can't be compared
            // https://github.com/angular/angular.js/issues/2621
            // which causes us the recompile even if we don't have to
            this.columnDefsFieldsWatcherDeregistration = scope.$watch("gridOptions.fields", function (newValue, oldValue) {
                if (!angular.equals(newValue, oldValue)) {
                    _this.configureTableStructure(parentScope, gridElement, scope);
                }
            }, true);

            // prepare a partial list of column definitions
            var templatedHeaderPartialGridColumnDefs = this.templatedHeader.extractPartialColumnDefinitions();
            var templatedBodyPartialGridColumnDefs = this.templatedBody.extractPartialColumnDefinitions();
            var templatedFooterPartialGridColumnDefs = this.templatedFooter.extractPartialColumnDefinitions();

            var finalPartialGridColumnDefs = [];
            var fieldsEnforced = this.gridOptions.fields;
            if (fieldsEnforced) {
                // the fields bound to the options will take precedence
                angular.forEach(this.gridOptions.fields, function (fieldName) {
                    if (fieldName) {
                        finalPartialGridColumnDefs.push({
                            isStandardColumn: true,
                            fieldName: fieldName
                        });
                    }
                });

                finalPartialGridColumnDefs = combineGridCellInfos(finalPartialGridColumnDefs, templatedHeaderPartialGridColumnDefs, false, true);
                finalPartialGridColumnDefs = combineGridCellInfos(finalPartialGridColumnDefs, templatedBodyPartialGridColumnDefs, false, true);
            } else {
                // check for the header markup
                if (templatedHeaderPartialGridColumnDefs.length > 0) {
                    // header and body will be used for fishing out the field names
                    finalPartialGridColumnDefs = combineGridCellInfos(templatedHeaderPartialGridColumnDefs, templatedBodyPartialGridColumnDefs, true, true);
                } else {
                    // the object itself will provide the field names
                    if (!this.gridOptions.items || this.gridOptions.items.length == 0) {
                        // register our interest for when we do have something to look at
                        this.columnDefsItemsWatcherDeregistration = scope.$watch("gridOptions.items.length", function (newValue, oldValue) {
                            if (newValue) {
                                _this.configureTableStructure(parentScope, gridElement, scope);
                            }
                        });
                        return;
                    }

                    for (var propName in this.gridOptions.items[0]) {
                        // exclude the library properties
                        if (!propName.match(/^[_\$]/g)) {
                            finalPartialGridColumnDefs.push({
                                isStandardColumn: true,
                                fieldName: propName
                            });
                        }
                    }

                    // combine with the body template
                    finalPartialGridColumnDefs = combineGridCellInfos(finalPartialGridColumnDefs, templatedBodyPartialGridColumnDefs, true, true);
                }
            }

            // it's time to make final tweaks to the instances and recompile
            if (templatedFooterPartialGridColumnDefs.length == 0) {
                templatedFooterPartialGridColumnDefs.push({ isStandardColumn: true });
            }

            // compute the formatted field names
            angular.forEach(finalPartialGridColumnDefs, function (columnDefs) {
                if (columnDefs.fieldName) {
                    columnDefs.displayFieldName = _this.getFormattedFieldName(columnDefs.fieldName);
                }
            });

            this.gridOptions.gridColumnDefs = finalPartialGridColumnDefs;
            var headerElement = this.templatedHeader.configureSection(gridElement, finalPartialGridColumnDefs);
            //var footerElement = this.templatedFooter.configureSection(gridElement, templatedFooterPartialGridColumnDefs);
            var footerElement = !scope.hidePager&&this.templatedFooter.configureSection(gridElement, templatedFooterPartialGridColumnDefs);
            var bodyElement = this.templatedBody.configureSection(gridElement, finalPartialGridColumnDefs);

            var templatedBodyRowElement = this.templatedBody.getTemplatedRowElement(bodyElement);
            var templatedHeaderRowElement = this.templatedHeader.getTemplatedRowElement(headerElement);

            bodyElement.attr(bodyDirectiveAttribute, "");
            templatedBodyRowElement.attr("ng-click", "toggleItemSelection(gridItem, $event)");

            // when server-side get is active (scope.gridOptions.onDataRequired), the filtering through the standard filters should be disabled
            /*if (this.gridOptions.onDataRequired) {
             templatedBodyRowElement.attr("ng-repeat", "gridItem in gridOptions.items");
             }
             else {
             templatedBodyRowElement.attr("ng-repeat", "gridItem in gridOptions.items | filter:gridOptions.filterBy | filter:gridOptions.filterByFields | orderBy:gridOptions.orderBy:gridOptions.orderByReverse | " + dataPagingFilter + ":gridOptions");
             }*/
            if(this.gridOptions.trackBy){
                templatedBodyRowElement.attr("ng-repeat", "gridDisplayItem in filteredItems track by gridDisplayItem."+this.gridOptions.trackBy);
            }else{
                templatedBodyRowElement.attr("ng-repeat", "gridDisplayItem in filteredItems");
            }
            templatedBodyRowElement.attr("ng-init", "gridItem=gridDisplayItem.$$_gridItem");
            // templatedBodyRowElement.attr("ng-class", "{'" + uiGrid.rowSelectedCssClass + "':gridOptions.selectedItems.indexOf(gridItem)>=0}");
            templatedBodyRowElement.attr("ng-class", "{'" + uiGrid.rowSelectedCssClass + "':dataCheck(gridOptions.selectedItems,gridItem)}");
            templatedBodyRowElement.attr("ng-class-even","'ui-grid-tr-even'");
            this.headerElement=headerElement.replaceWith(this.$compile(headerElement)(scope));
            footerElement&&footerElement.replaceWith(this.$compile(footerElement)(scope));
            bodyElement.replaceWith(this.$compile(bodyElement)(scope));

            if (oldScope) {
                // an Angular bug is preventing us to destroy a scope inside the digest cycle
                this.$timeout(function () {
                    return oldScope.$destroy();
                });
            }
        };
        //数据选中后的选中状态绑定操作
        GridController.prototype.dataCheck=function(a,b){
            var trackBy=this.gridOptions.trackBy;
            if(!a)return;
            if(trackBy){
                return !!_.filter(a,function(it){return it[trackBy]===b[trackBy]}).length;
            }else{
                return !!(a.indexOf(b)>=0)
            }
        };
        GridController.prototype.computeFormattedItems = function (scope) {
            var input = scope.gridOptions.items || [];
            uiGrid.debugMode && this.log("formatting items of length " + input.length);
            var formattedItems = scope.formattedItems = (scope.formattedItems || []);
            if (scope.gridOptions.onDataRequired) {
                scope.filteredItems = formattedItems;
            } else {
                scope.requiresReFilteringTrigger = !scope.requiresReFilteringTrigger;
            }
            var gridColumnDefs = scope.gridOptions.gridColumnDefs;

            for (var inputIndex = 0; inputIndex < input.length; inputIndex++) {
                var gridItem = input[inputIndex];
                var outputItem;

                // crate a temporary scope for holding a gridItem as we enumerate through the items
                var localEvalVars = { gridItem: gridItem };

                while (formattedItems.length > input.length && (outputItem = formattedItems[inputIndex]).$$_gridItem !== gridItem) {
                    formattedItems.splice(inputIndex, 1);
                }

                if (inputIndex < formattedItems.length) {
                    outputItem = formattedItems[inputIndex];
                    if (outputItem.$$_gridItem !== gridItem) {
                        outputItem = { $$_gridItem: gridItem };
                        formattedItems[inputIndex] = outputItem;
                    }
                } else {
                    outputItem = { $$_gridItem: gridItem };
                    formattedItems.push(outputItem);
                }
                for (var gridColumnDefIndex = 0; gridColumnDefIndex < gridColumnDefs.length; gridColumnDefIndex++) {
                    try  {
                        var gridColumnDef = gridColumnDefs[gridColumnDefIndex];
                        var fieldName = gridColumnDef.fieldName;
                        if (fieldName) {
                            var displayFormat = gridColumnDef.displayFormat;
                            if (displayFormat) {
                                if (displayFormat[0] != "." && displayFormat[0] != "|") {
                                    // angular filter
                                    displayFormat = " | " + displayFormat;
                                }

                                // apply the format
                                outputItem[gridColumnDef.displayFieldName] = scope.$eval("gridItem." + fieldName + displayFormat, localEvalVars);
                            } else {
                                outputItem[gridColumnDef.displayFieldName] = scope.$eval("gridItem." + fieldName, localEvalVars);
                            }
                        }
                    } catch (ex) {
                        uiGrid.debugMode && this.log("Field evaluation failed for <" + fieldName + "> with error " + ex);
                    }
                }
            }

            // remove any extra elements from the formatted list
            if (formattedItems.length > input.length) {
                formattedItems.splice(input.length, formattedItems.length - input.length);
            }
        };
        GridController.prototype.computeFilteredItems = function (scope) {
            scope.filterByDisplayFields = {};
            if (scope.gridOptions.filterByFields) {
                for (var fieldName in scope.gridOptions.filterByFields) {
                    scope.filterByDisplayFields[this.getFormattedFieldName(fieldName)] = scope.gridOptions.filterByFields[fieldName];
                }
            }
            uiGrid.debugMode && this.log("filtering items of length " + (scope.formattedItems ? scope.formattedItems.length : 0));
            scope.filteredItems = scope.$eval("formattedItems | filter:gridOptions.filterBy | filter:filterByDisplayFields | " + uiGrid.sortFilter + ":gridOptions");// | " + uiGrid.dataPagingFilter + ":gridOptions 取消在排序时 对分页的解析
            //debugger;
        };
        GridController.prototype.setupDisplayItemsArray = function (scope) {
            var _this = this;
            var watchExpression = "[gridOptions.items,gridOptions.gridColumnDefs.length";
            angular.forEach(scope.gridOptions.gridColumnDefs, function (gridColumnDef) {
                if (gridColumnDef.displayFormat && gridColumnDef.displayFormat[0] != '.') {
                    // watch the parameters
                    var displayfilters = gridColumnDef.displayFormat.split('|');
                    angular.forEach(displayfilters, function (displayFilter) {
                        var displayFilterParams = displayFilter.split(':');
                        if (displayFilterParams.length > 1) {
                            angular.forEach(displayFilterParams.slice(1), function (displayFilterParam) {
                                displayFilterParam = displayFilterParam.trim();
                                if (displayFilterParam && displayFilterParam !== "gridItem" && displayFilterParam !== "gridDisplayItem") {
                                    watchExpression += "," + displayFilterParam;
                                }
                            });
                        }
                    });
                }
            });

            watchExpression += "]";
            uiGrid.debugMode && this.log("re-formatting is set to watch for changes in " + watchExpression);
            scope.$watch(watchExpression, function () {
                return _this.computeFormattedItems(scope);
            }, true);

            if (!scope.gridOptions.onDataRequired) {
                watchExpression = "[" + "requiresReFilteringTrigger, gridOptions.filterBy, gridOptions.filterByFields, gridOptions.orderBy, gridOptions.orderByReverse, gridOptions.currentPage, gridOptions.pageItems" + "]";
                scope.$watch(watchExpression, function (newValue, oldValue) {
                    // console.log('computeFilteredItems');
                    _this.computeFilteredItems(scope);
                }, true);
            }
        };
        GridController.prototype.linkAttrs = function (tAttrs, localStorage) {
            var propSetter = function (propName, propValue) {
                if (typeof (propValue) === "undefined")
                    return;

                switch (propValue) {
                    case "true":
                        propValue = true;
                        break;
                    case "false":
                        propValue = false;
                        break;
                }
                localStorage[propName] = propValue;
            };

            for (var propName in localStorage) {
                propSetter(propName, tAttrs[propName]);

                // watch for changes
                (function (propName) {
                    tAttrs.$observe(propName, function (value) {
                        return propSetter(propName, value);
                    });
                })(propName);
            }
        };
        GridController.prototype.linkScope = function (internalScope, externalScope, scopeTargetIdentifier, attrs) {
            // this method shouldn't even be here
            // but it is because we want to allow people to either set attributes with either a constant or a watchable variable
            var _this = this;
            // watch for a resolution to issue #5951 on angular
            // https://github.com/angular/angular.js/issues/5951
            var target = internalScope[scopeTargetIdentifier];

            for (var propName in target) {
                var attributeExists = typeof (attrs[propName]) != "undefined" && attrs[propName] != null;

                if (attributeExists) {
                    var isArray = false;

                    // initialise from the scope first
                    if (typeof (externalScope[propName]) != "undefined" && externalScope[propName] != null) {
                        target[propName] = externalScope[propName];
                        isArray = target[propName] instanceof Array;
                    }

                    //allow arrays to be changed: if(!isArray){
                    var compiledAttrGetter = null;
                    try  {
                        compiledAttrGetter = this.$parse(attrs[propName]);
                    } catch (ex) {
                        // angular fails to parse literal bindings '@', thanks angular team
                    }
                    (function (propName, compiledAttrGetter) {
                        if (!compiledAttrGetter || !compiledAttrGetter.constant) {
                            // watch for a change in value and set it on our internal scope
                            externalScope.$watch(propName, function (newValue, oldValue) {
                                // debugMode && this.log("Property '" + propName + "' changed on the external scope from " + oldValue + " to " + newValue + ". Mirroring the parameter's value on the grid's internal scope.");
                                target[propName] = newValue;
                            });
                        }

                        var compiledAttrSetter = (compiledAttrGetter && compiledAttrGetter.assign) ? compiledAttrGetter.assign : null;
                        if (compiledAttrSetter) {
                            // a setter exists for the property, which means it's safe to mirror the internal prop on the external scope
                            internalScope.$watch(scopeTargetIdentifier + "." + propName, function (newValue, oldValue) {
                                try  {
                                    // debugMode && this.log("Property '" + propName + "' changed on the internal scope from " + oldValue + " to " + newValue + ". Mirroring the parameter's value on the external scope.");
                                    externalScope[propName] = newValue;
                                    // Update: Don't do this, as you'll never hit the real scope the property was defined on
                                    // compiledAttrSetter(externalScope, newValue);
                                } catch (ex) {
                                    if (uiGrid.debugMode) {
                                        _this.log("Mirroring the property on the external scope failed with " + ex);
                                        throw ex;
                                    }
                                }
                            });
                        }
                    })(propName, compiledAttrGetter);
                }
            }
            // console.log(internalScope.currentPage);
        };
        GridController.prototype.log = function (message){
            console.log(tableDirective + "(" + new Date().getTime() + "): " + message);
        };
        //宽度分配调用 和 拖拽事件绑定
        GridController.prototype.dragHandler=function(scope,elem,attr){
            var self=this;
            this.$timeout(function(){
                self._uiGridElem=elem;
                self._width=elem.width();
                elem.css('width',self._width+'px');
                self._thead=elem.find('thead');
                self._tbody=elem.find('tbody');
                self.addHook();
                self.initColsWidth();
                self._thead[0].onmousemove=self.getHeadMoveHandler();
                self._thead[0].onmousedown=self.getDragStartHandler();
                self.initResizeHandler();
            });
        };
        //获取单元格宽度
        GridController.prototype.getTHWidth=function(th){
            // if (this.width) return this.width;
            // var a, c = document.createElement("div");
            // this.main.parentNode.appendChild(c);
            // a = c.offsetWidth;
            // baidu.dom.remove(c);
            // return a

            var a=document.createElement('div');
            var b;
            th.appendChild(a);
            b=a.offsetWidth;
            th.removeChild(a);
            return b
        };
        GridController.prototype.getPaddingWidth=function(th){
            var children=th.children();
            var getPaddingWidth=function(el){
                var a=0;
                angular.forEach(['padding'],function(i){
                    angular.forEach(['left','right'],function(j){
                        a+=parseInt(el.css(i+'-'+j),10);
                    })
                });
                return a;
            };
            return getPaddingWidth(th)+getPaddingWidth(children);
        };
        //初始化宽度分配
        GridController.prototype.initColsWidth=function(){
            var self=this;
            var a=this._cols;
            var l=a.length;
            var i=0;
            var t;
            var _width;
            var innerWidth=this._width-l-2;
            var dragList=[];
            var dragLen;
            var dragAvg;
            var paddding;
            this.colsWidth=[];
            this.$timeout(function(){
                for(;i<l;i++){
                    t=a.eq(i);
                    // _width=parseInt(t.attr('width'),10)||self.getTHWidth(a[i]);
                    _width=self.getTHWidth(a[i]);
                    self.colsWidth.push(_width);
                    innerWidth-=_width;
                    t.attr('stable')||dragList.push(i);
                }

                dragLen=dragList.length;
                //修复拖动 -1情况
                dragAvg=Math.floor(innerWidth/dragLen)<0?0:Math.floor(innerWidth/dragLen);

                for(i=0;i<dragLen;i++){
                    t=(Math.abs(innerWidth)>Math.abs(dragAvg))?dragAvg:innerWidth;
                    innerWidth-=t;
                    self.colsWidth[dragList[i]]+=t;
                }
                for(i=0;i<l;i++){
                    a[i].style.width=(self.colsWidth[i])+'px';
                    a.eq(i).children()[0].style.width=(self.colsWidth[i])+'px';
                }
            });
        };
        //添加拖拽标记
        GridController.prototype.addHook=function(){
            var th=this._cols=this._thead.find('th');
            var i=0,l=th.length;
            var start;
            var end=l;
            for(;i<l;i++){
                if(th[i].getAttribute('dragable')){
                    start=i;
                    break
                }
            }
            for(i=l-1;i>=0;i--){
                if(th[i].getAttribute('dragable')){
                    end=i;
                    break
                }
            }
            for(i=0;i<l;i++){
                if(i>=start&&i<=end){
                    th[i].setAttribute('dragright',"1");
                }
                if(i<=end&&i>start){
                    th[i].setAttribute('dragleft',"1");
                }
            }
        };
        //表头鼠标move处理
        GridController.prototype.getHeadMoveHandler=function(){
            var self=this;
            var win=$(window);
            var target;
            var thOffset;
            var targetOffsetX;
            return function(evt){
                if(!self.isDraging){
                    evt=evt||window.event;
                    target=evt.srcElement||evt.target;
                    targetOffsetX=evt.pageX||evt.clientX+win.scrollLeft();
                    if(target=self.findDragCell(target)){
                        thOffset=target.offset();
                        if(target.attr('dragleft')&&targetOffsetX-thOffset.left<8){
                            self._thead.addClass(uiGridStartDrag);
                            self.dragPoint='left';
                            self.dragReady=1;
                        }else if(target.attr('dragright')&&thOffset.left+target[0].offsetWidth-targetOffsetX<8){
                            self._thead.addClass(uiGridStartDrag);
                            self.dragPoint='right';
                            self.dragReady=1;
                        }else{
                            self._thead.removeClass(uiGridStartDrag);
                            self.dragPoint='';
                            self.dragReady=0;
                        }
                    }
                }
            }
        };
        //处理拖动前的动作
        GridController.prototype.getDragStartHandler=function(){
            var self=this;
            var win=$(window);
            var target;
            return function(evt){
                if(self._thead.hasClass(uiGridStartDrag)){
                    evt=evt||window.event;
                    target=evt.target||evt.srcElement;
                    if(target=self.findDragCell(target)){
                        self.isDraging=true;
                        self.dragIndex=target.attr(cellHeaderDirectiveAttribute);
                        self.dragStart=evt.pageX||evt.clientX+win.scrollLeft();//拖拽开始偏移位置
                        self.dragStartWidth=target.width();
                        document.onmousemove=self.getDragingHandler();
                        document.onmouseup=self.getDragEndHandler();
                        self.showDragMark(self.dragStart);
                        self.preventDefault(evt);
                        return false;
                    }
                }
            }
        };
        //处理拖拽时的动作
        GridController.prototype.getDragingHandler=function(){
            var self=this;
            var win=$(window);
            return function(evt){
                evt=evt||window.evt;
                self.showDragMark(evt.pageX||evt.clientX+win.scrollLeft());
                self.preventDefault(evt);
                return false;
            }
        };
        //处理拖放后的动作
        GridController.prototype.getDragEndHandler=function(){
            var self=this;
            var win=$(window);
            return function(evt){
                evt=evt||window.event;
                var target=evt.srcElement||evt.target;
                var targetOffsetX=evt.pageX||evt.clientX+win.scrollLeft();//拖动结束偏移位置
                var dragIndex=parseInt(self.dragIndex,10);
                var plusTHWidth;
                var j;
                var dragIndexArr=[];//拖动索引集合
                var thWidth;
                var thWidthArr=[];//
                var thWidthTotal;
                var targetOffsetXTemp;
                var k,avg;
                var minWidth=0;
                var _dragIndex;

                self.dragPoint=='left' && dragIndex--;
                targetOffsetX=targetOffsetX-self.dragStart;//拖动的偏移量
                plusTHWidth=self.colsWidth[dragIndex]+targetOffsetX;//th原有宽度+偏移量
                if(plusTHWidth<40){
                    targetOffsetX+=40-plusTHWidth;
                    plusTHWidth=40;
                }
                //遍历需变化的th
                for(j=dragIndex+1;j<self._cols.length;j++){
                    if(!self._cols[j].getAttribute('stable')){
                        dragIndexArr.push(j);//暂存需变化的th索引
                        thWidth=self.colsWidth[j];//暂存th拖动前的宽度
                        thWidthArr.push(thWidth);
                        thWidthTotal+=thWidth;//累加需变化宽度的th宽度
                    }
                }
                targetOffsetXTemp=targetOffsetX;
                k=dragIndexArr.length;

                for(j=0;j<k;j++){
                    _dragIndex=dragIndexArr[j];
                    thWidth=thWidthArr[j];

                    avg=targetOffsetX*thWidth/thWidthTotal;
                    avg=targetOffsetXTemp>0?Math.ceil(avg):Math.floor(avg);
                    avg=Math.abs(avg)<Math.abs(targetOffsetXTemp)?avg:targetOffsetXTemp;
                    thWidth-=avg;
                    targetOffsetXTemp-=avg;
                    if(thWidth<40){
                        minWidth+=40-thWidth;
                        thWidth=40;
                    }
                    self.colsWidth[_dragIndex]=thWidth;
                }
                plusTHWidth-=minWidth;
                self.colsWidth[dragIndex]=plusTHWidth;

                self.resetColumns();//重置th宽度
                self.handlerResize();
                document.onmousemove=null;
                document.onmouseup=null;
                self.isDraging=false;
                self.hideDragMark();
                self.preventDefault(evt);
                return false;
            }
        };
        GridController.prototype.resetColumns=function(){
            var ths=this._cols;
            var thw=this.colsWidth;
            var l=ths.length;
            var tr=this._tbody.find('tr');
            var td,padding;
            if(!tr.length)return;
            td=tr.eq(0).find('td').eq(0);
            padding=this.getPaddingWidth(td);
            for(var i=0;i<l;i++){
                ths[i].style.width=thw[i]+'px';
                ths.eq(i).children()[0].style.width=(thw[i])+'px';
            }
            for(var j=0,l=tr.length;j<l;j++){
                td=tr.eq(j).find('td');
                for(var k=0;k<td.length;k++){
                    td[k].style.width=thw[k]+'px';
                    // td.eq(k).children().css('width',(thw[k])+'px');
                }
            }
        };
        GridController.prototype.initResizeHandler=function(){
            var self=this;
            var win=$(window);
            self.viewWidth=win.width();
            self.resizeHandler=function(){
                var viewWidth=win.width();
                if(self.viewWidth!==viewWidth){
                    self.viewWidth=viewWidth;
                    self.handlerResize();
                }
            };
            win.resize(self.resizeHandler);
        };
        GridController.prototype.handlerResize=function(){
            this._width=this.getTHWidth(this._uiGridElem[0].parentNode);
            this._uiGridElem.css('width',this._width+'px');
            this.initColsWidth();
            this.resetColumns();
        };
        //屏蔽默认事件
        GridController.prototype.preventDefault=function(evt){
            evt.preventDefault ? evt.preventDefault() : evt.returnValue =false
        };
        //获得表头当前拖拽单元格
        GridController.prototype.findDragCell=function(node){
            for(;node.nodeType===1;){
                if(node.tagName==='TH') return $(node);
                node=node.parentNode;
            }
            return null
        };
        //获得参考线
        GridController.prototype.getDragMark=function(){
            return document.getElementById(uiGridDragMark);
        };
        //显示参考线
        GridController.prototype.showDragMark=function(left){
            var mark=this.getDragMark();
            //if(!this.top)//防止头部变化导致异常
            this.top=this._thead.offset().top;
            mark||(mark=this.createDragMark());
            mark.style.top=this.top+'px';
            mark.style.left=left+'px';
            mark.style.height=this._uiGridElem.height()+'px';
        };
        //隐藏参考线
        GridController.prototype.hideDragMark=function(){
            var b=this.getDragMark();
            b.style.left="-10000px";
            b.style.top="-10000px";
        };
        //创建参考线
        GridController.prototype.createDragMark=function(){
            var b=document.createElement('div');
            b.id=uiGridDragMark;
            b.className=uiGridDragMark;
            b.style.left="-10000px";
            b.style.top="-10000px";
            document.body.appendChild(b);
            return b
        };
        return GridController;
    })();
    angular.module("ui.grid", [])
        .directive(tableDirective, [function () {
            return {
                restrict: 'A',
                scope: {
                    items: '=',//表格数据
                    selectedItems: '=?',//选中的数据
                    filterBy: '=?',
                    filterByFields: '=?',
                    orderBy: '=?',
                    orderByReverse: '=?',
                    pageItems: '=?',//每页显示条数
                    currentPage: '=?',//当前页索引从 0 开始
                    totalItems: '=?',//总页数
                    enableFiltering: '=?',//是否显示过滤
                    enableSorting: '=?',//是否排序
                    enableSelections: '=?',//是否开启行选择功能
                    enableMultiRowSelections: '=?',//是否开启多行选择功能
                    scopeCtrl:'=?',
                    selectionMode: '@',//选择行模式 None | SingleRow | MultiRow | MultiRowWithKeyModifiers
                    locale: '@',//提供本地化功能
                    trackBy:'@?',
                    hidePager:'@?',
                    pageItemsInput:'@',
                    dragable:'@?',
                    onDataRequired: '&',//调用服务端数据回调
                    onDataRequiredDelay: '=?',//回调数据延迟
                    fields: '=?'//表头数据 数组格式['a','b']
                },
                template: function (templateElement, tAttrs) {
                    templateElement.addClass(uiGrid.tableCssClass);

                    // at this stage, no elements can be bound
                    angular.forEach(templateElement.children(), function (childElement) {
                        childElement = angular.element(childElement);
                        childElement.attr("ng-non-bindable", "");
                    });
                },
                controller: ["$compile", "$parse", "$timeout", "$templateCache", GridController],
                compile: function (templateElement, tAttrs) {
                    return {
                        pre: function (isolatedScope, instanceElement, tAttrs, controller, transcludeFn) {
                            controller.discoverTemplates(instanceElement);
                        },
                        post: function (isolatedScope, instanceElement, tAttrs, controller, transcludeFn) {
                            var gridScope = controller.setupScope(isolatedScope, instanceElement, tAttrs);
                            isolatedScope.scopeCtrl=controller;

                            if(gridScope.gridOptions.hidePager==='true'){
                                gridScope.hidePager=true;
                            }

                            gridScope.speedUpAsyncDataRetrieval = function ($event) {
                                return controller.speedUpAsyncDataRetrieval($event);
                            };
                            gridScope.dataCheck=function(a,b){
                                return controller.dataCheck(a,b);
                            };
                            controller.configureTableStructure(gridScope, instanceElement);
                            controller.setupDisplayItemsArray(gridScope);
                        }
                    };
                }
            };
        }])
        .directive(cellHeaderDirective, ['$translate','$rootScope',function ($translate,$rootScope) {
            var setupColumnTitle = function (scope) {
                if (scope.columnOptions.displayName) {
                    scope.columnTitle = $translate.instant(scope.columnOptions.displayName);
                } else {
                    if (!scope.columnOptions.fieldName) {
                        scope.columnTitle = "[Invalid Field Name]";
                    } else {
                        // exclude nested notations
                        var splitFieldName = scope.columnOptions.fieldName.match(/^[^\.\[\]]*/);

                        // split by camel-casing
                        splitFieldName = splitFieldName[0].split(/(?=[A-Z])/);
                        if (splitFieldName.length && splitFieldName[0].length) {
                            splitFieldName[0] = splitFieldName[0][0].toLocaleUpperCase() + splitFieldName[0].substr(1);
                        }
                        scope.columnTitle = splitFieldName.join(" ");
                    }
                }
            };

            return {
                restrict: 'A',
                require: '^' + tableDirective,
                scope: true,
                compile: function (templateElement, tAttrs) {
                    var isCustomized = tAttrs['isCustomized'] == 'true';
                    wrapTemplatedCell(templateElement, tAttrs, isCustomized, cellHeaderTemplateDirectiveAttribute);

                    return {
                        // we receive a reference to a real element that will appear in the DOM, after the controller was created, but before binding setup
                        pre: function (scope, instanceElement, tAttrs, controller, $transclude) {
                            // we're not interested in creating an isolated scope just to parse the element attributes,
                            // so we're gonna have to do this manually
                            var columnIndex = parseInt(tAttrs[cellHeaderDirective]);

                            // create a clone of the default column options
                            var columnOptions = angular.extend(scope.gridOptions.gridColumnDefs[columnIndex], uiGrid.defaultColumnOptions);

                            // now match and observe the attributes
                            controller.linkAttrs(tAttrs, columnOptions);

                            // set up the new scope
                            scope.columnOptions = columnOptions;
                            scope.isCustomized = isCustomized;
                            scope.toggleSorting = function (propertyName) {
                                controller.toggleSorting(propertyName);
                            };

                            // set up the column title
                            setupColumnTitle(scope);

                            scope.$watch("columnOptions.filter", function (newValue, oldValue) {
                                if (newValue !== oldValue) {
                                    controller.setFilter(columnOptions.fieldName, newValue);
                                }
                            });
                            $rootScope.$on('$translateChangeSuccess', function () {
                                setupColumnTitle(scope);
                            });
                        }
                    };
                }
            };
        }])
        .directive(cellHeaderTemplateDirective, [function () {
            return {
                restrict: 'A',
                templateUrl: uiGrid.cellHeaderTemplateId,
                transclude: true,
                replace: true
            };
        }])
        .directive(bodyDirective, [function () {
            return {
                restrict: 'A',
                require: '^' + tableDirective,
                scope: true,
                compile: function (templateElement, tAttrs) {
                    return {
                        pre: function (scope, compiledInstanceElement, tAttrs, controller) {
                            scope.toggleItemSelection = function (item, $event) {
                                controller.toggleItemSelection(scope.filteredItems, item, $event);
                            };
                        }
                    };
                }
            };
        }])
        .directive(cellBodyDirective, [function () {
            return {
                restrict: 'A',
                require: '^' + tableDirective,
                scope: true,
                compile: function (templateElement, tAttrs) {
                    var isCustomized = tAttrs['isCustomized'] == 'true';
                    wrapTemplatedCell(templateElement, tAttrs, isCustomized, cellBodyTemplateDirectiveAttribute);

                    return {
                        pre: function (scope, instanceElement, tAttrs, controller, $transclude) {
                            scope.columnOptions = scope.gridOptions.gridColumnDefs[parseInt(tAttrs[cellBodyDirective])];
                            scope.gridItem = scope.gridDisplayItem.$$_gridItem;
                            scope.isCustomized = isCustomized;
                        }
                    };
                }
            };
        }])
        .directive(cellBodyTemplateDirective, [function () {
            return {
                restrict: 'A',
                templateUrl: uiGrid.cellBodyTemplateId,
                transclude: true,
                replace: true
            };
        }])
        .directive(cellFooterDirective, [function () {
            return {
                restrict: 'A',
                require: '^' + tableDirective,
                scope: true,
                compile: function (templateElement, tAttrs) {
                    var isCustomized = tAttrs['isCustomized'] == 'true';
                    wrapTemplatedCell(templateElement, tAttrs, isCustomized, cellFooterTemplateDirectiveAttribute);

                    return {
                        pre: function (scope, instanceElement, tAttrs, controller, $transclude) {
                            scope.isCustomized = isCustomized;
                            instanceElement.attr("colspan", scope.gridOptions.gridColumnDefs.length);
                        }
                    };
                }
            };
        }])
        .directive(cellFooterTemplateDirective, [function () {
            return {
                restrict: 'A',
                templateUrl: uiGrid.cellFooterTemplateId,
                transclude: true,
                replace: true
            };
        }])
        .directive(columnSortDirective, [function () {
            return {
                restrict: 'A',
                replace: true,
                templateUrl: uiGrid.columnSortTemplateId
            };
        }])
        .directive(columnFilterDirective, [function () {
            return {
                restrict: 'A',
                replace: true,
                templateUrl: uiGrid.columnFilterTemplateId
            };
        }])
        .directive(globalFilterDirective, [function () {
            return {
                restrict: 'A',
                scope: false,
                templateUrl: uiGrid.footerGlobalFilterTemplateId
            };
        }])
        .directive(pagerDirective, [function () {
            var setupScope = function (scope, controller) {
                scope.pageItemsInput=(controller.gridOptions.pageItemsInput==='true');
                // do not set scope.gridOptions.totalItems, it might be set from the outside
                scope.totalItemsCount = (typeof (scope.gridOptions.totalItems) != "undefined" && scope.gridOptions.totalItems != null) ?
                    scope.gridOptions.totalItems : (scope.gridOptions.items ? scope.gridOptions.items.length : 0);

                scope.isPaged = (!!scope.gridOptions.pageItems) && (scope.gridOptions.pageItems < scope.totalItemsCount);
                scope.extendedControlsActive = false;
                scope.lastPageIndex = (!scope.totalItemsCount || !scope.isPaged) ? 0 : (Math.floor(scope.totalItemsCount / scope.gridOptions.pageItems) + ((scope.totalItemsCount % scope.gridOptions.pageItems) ? 0 : -1));


                // console.log(scope.gridOptions.currentPage +':::'+scope.lastPageIndex);
                if (scope.gridOptions.currentPage > scope.lastPageIndex) {
                    // this will unfortunately trigger another query if in server side data query mode
                    // scope.gridOptions.currentPage = scope.lastPageIndex; 解决默认跳到第n页, 注释该行 则需要默认 调用 scheduleDataRetrieval();
                }
                scope.startItemIndex = scope.isPaged ? (scope.gridOptions.pageItems * scope.gridOptions.currentPage) : 0;
                scope.endItemIndex = scope.isPaged ? (scope.startItemIndex + scope.gridOptions.pageItems - 1) : scope.totalItemsCount - 1;
                if (scope.endItemIndex >= scope.totalItemsCount) {
                    scope.endItemIndex = scope.totalItemsCount - 1;
                }
                if (scope.endItemIndex < scope.startItemIndex) {
                    scope.endItemIndex = scope.startItemIndex;
                }

                scope.pageCanGoBack = scope.isPaged && scope.gridOptions.currentPage > 0;
                scope.pageCanGoForward = scope.isPaged && scope.gridOptions.currentPage < scope.lastPageIndex;

                //scope.pageIndexes = scope.pageIndexes || [];
                scope.pageIndexes=[];
                scope.pageIndexes.splice(0);
                if (scope.isPaged) {
                    if (scope.lastPageIndex + 1 > uiGrid.defaultPagerMinifiedPageCountThreshold) {
                        scope.extendedControlsActive = true;

                        var pageIndexHalfRange = Math.floor(uiGrid.defaultPagerMinifiedPageCountThreshold / 2);
                        var lowPageIndex = scope.gridOptions.currentPage - pageIndexHalfRange;
                        var highPageIndex = scope.gridOptions.currentPage + pageIndexHalfRange;

                        // compute the high and low
                        if (lowPageIndex < 0) {
                            highPageIndex += -lowPageIndex;
                            lowPageIndex = 0;
                        } else if (highPageIndex > scope.lastPageIndex) {
                            lowPageIndex -= highPageIndex - scope.lastPageIndex;
                            highPageIndex = scope.lastPageIndex;
                        }

                        // add the extra controls where needed
                        if (lowPageIndex > 0) {
                            scope.pageIndexes.push(null);
                            lowPageIndex++;
                        }
                        var highPageEllipsed = false;
                        if (highPageIndex < scope.lastPageIndex) {
                            highPageEllipsed = true;
                            highPageIndex--;
                        }

                        for (var pageIndex = lowPageIndex; pageIndex <= highPageIndex; pageIndex++) {
                            scope.pageIndexes.push(pageIndex);
                        }

                        if (highPageEllipsed) {
                            scope.pageIndexes.push(null);
                        }
                    } else {
                        scope.extendedControlsActive = false;

                        for (var pageIndex = 0; pageIndex <= scope.lastPageIndex; pageIndex++) {
                            scope.pageIndexes.push(pageIndex);
                        }
                    }
                }
                scope.pageSelectionActive = scope.pageIndexes.length > 1;

                scope.navigateToPage = function (pageIndex) {
                    // console.log(pageIndex);
                    scope.gridOptions.currentPage = pageIndex;
                    scope.gridOptions.onDataRequired(scope.gridOptions);
                    scope.speedUpAsyncDataRetrieval();
                    // console.log(scope.gridOptions.currentPage);
                    /*$event.preventDefault();
                     $event.stopPropagation();*/
                };

                scope.switchPageSelection = function ($event, pageSelectionActive) {
                    scope.pageSelectionActive = pageSelectionActive;
                    if ($event) {
                        $event.preventDefault();
                        $event.stopPropagation();
                    }
                };
            };
            var bindOthers=function(a,b,c){
                var num=b.find('.ui-grid-pager-num').children();
                num.eq(0).unbind('keyup').bind('keyup',function(e){
                    var val=this.value;
                    if(/^\d+$/.test(val)){
                        num.eq(1).show()
                    }else{
                        num.eq(1).hide();
                    }
                });
                num.eq(1).unbind('click').bind('click',function(){
                    c.gridOptions.pageItems=parseInt(num.eq(0).val());
                    // a.navigateToPage(0);
                    // if(!c.gridOptions.currentPage){
                    //     c.gridOptions.onDataRequired(c.gridOptions);
                    // }else{
                    //     c.gridOptions.currentPage=0;
                    // }
                    c.gridOptions.currentPage=0;
                    c.gridOptions.onDataRequired(c.gridOptions);
                    a.$apply();
                });
            };
            return {
                restrict: 'A',
                scope: true,
                require: '^' + tableDirective,
                templateUrl: uiGrid.footerPagerTemplateId,
                replace: true,
                compile: function (templateElement, tAttrs) {
                    return {
                        pre: function (scope, compiledInstanceElement, tAttrs, controller) {
                            setupScope(scope, controller);
                        },
                        post: function (scope, instanceElement, tAttrs, controller) {
                            scope.$watchCollection("[gridOptions.currentPage, gridOptions.items.length, gridOptions.totalItems, gridOptions.pageItems]", function (newValues, oldValues) {
                                setupScope(scope, controller);
                                if(scope.pageItemsInput){
                                    bindOthers(scope,instanceElement,controller);
                                }
                            });
                        }
                    };
                }
            };
        }])
        .filter(uiGrid.sortFilter, ["$filter", "$parse", function ($filter, $parse) {
            return function (input, gridOptions) {
                if (!gridOptions.orderBy || !gridOptions.gridColumnDefs) {
                    // not ready to sort, return the input array
                    return input;
                }
                // we'll need the column options
                var columnOptions = null;
                for (var columnOptionsIndex = 0; (columnOptionsIndex < gridOptions.gridColumnDefs.length) && ((columnOptions = gridOptions.gridColumnDefs[columnOptionsIndex]).fieldName !== gridOptions.orderBy); columnOptions = null, columnOptionsIndex++)
                    ;
                if (!columnOptions) {
                    // unable to find any info about the selected field
                    return input;
                }
                var sortedInput = $filter("orderBy")(input, function (item) {
                    var fieldValue = undefined;
                    try  {
                        // get the value associated with the original grid item
                        fieldValue = $parse("item.$$_gridItem." + columnOptions.fieldName)({ item: item });
                    } catch (ex) {}
                    if (fieldValue === undefined) {
                        try  {
                            // next try the field on the display item, in case of computed fields
                            fieldValue = $parse("item." + columnOptions.displayFieldName)({ item: item });
                        } catch (ex) {}
                    }
                    return fieldValue;
                }, gridOptions.orderByReverse);
                return sortedInput;
            };
        }])
        .filter(uiGrid.dataPagingFilter, function () {
            // when server-side logic is enabled, this directive should not be used!
            return function (input, gridOptions) {
                //currentPage?:number, pageItems?:number
                if (input)
                    gridOptions.totalItems = input.length;
                if (!gridOptions.pageItems || !input || input.length == 0)
                    return input;
                if (!gridOptions.currentPage) {
                    gridOptions.currentPage = 0;
                }
                var startIndex = gridOptions.currentPage * gridOptions.pageItems;
                if (startIndex >= input.length) {
                    gridOptions.currentPage = 0;
                    startIndex = 0;
                }
                var endIndex = gridOptions.currentPage * gridOptions.pageItems + gridOptions.pageItems;

                return input.slice(startIndex, endIndex);
            };
        })
        .filter(uiGrid.translateFilter, ["$filter", function ($filter) {
            return function (input, languageId) {
                var translatedText;
                // dates require special attention
                if (input instanceof Date) {
                    // we're dealing with a date object, see if we have a localized format for it
                    var dateFormat = $filter(uiGrid.translateFilter)(uiGrid.translationDateFormat, languageId);
                    if (dateFormat && dateFormat !== uiGrid.translationDateFormat) {
                        // call the date filter
                        translatedText = $filter("date")(input, dateFormat);
                        return translatedText;
                    }
                    return input;
                }
                if (!translatedText) {
                    var languageIdParts = languageId.split(/[-_]/);
                    for (var languageIdPartIndex = languageIdParts.length; (languageIdPartIndex > 0) && (!translatedText); languageIdPartIndex--) {
                        var subLanguageId = languageIdParts.slice(0, languageIdPartIndex).join("-");
                        var langTranslations = uiGrid.translations[subLanguageId];
                        if (langTranslations) {
                            translatedText = langTranslations[input];
                        }
                    }
                }
                if (!translatedText) {
                    try  {
                        var externalTranslationFilter = $filter("translate");
                        if (externalTranslationFilter) {
                            translatedText = externalTranslationFilter(input);
                        }
                    } catch (ex) {}
                }
                if (!translatedText) {
                    translatedText = input;
                }
                return translatedText;
            };
        }])
        .run(function () {
            uiGrid.tableCssClass = "ui-grid table table-bordered table-hover"; // at the time of coding, table-striped is not working properly with selection
            uiGrid.cellCssClass = "ui-grid-cell";
            uiGrid.headerCellCssClass = "ui-grid-column-header " + uiGrid.cellCssClass;
            uiGrid.bodyCellCssClass = uiGrid.cellCssClass;
            uiGrid.columnTitleCssClass = "ui-grid-title";
            uiGrid.columnSortCssClass = "ui-grid-sort";
            uiGrid.columnFilterCssClass = "ui-grid-column-filter";
            uiGrid.columnFilterInputWrapperCssClass = "";
            uiGrid.columnSortActiveCssClass = "ui-grid-sort-active text-info";
            uiGrid.columnSortInactiveCssClass = "ui-grid-sort-inactive text-muted glyphicon glyphicon-chevron-down";
            uiGrid.columnSortReverseOrderCssClass = "ui-grid-sort-order-reverse glyphicon glyphicon-chevron-down";
            uiGrid.columnSortNormalOrderCssClass = "ui-grid-sort-order-normal glyphicon glyphicon-chevron-up";
            uiGrid.rowSelectedCssClass = "active";
            uiGrid.footerCssClass = "ui-grid-footer form-inline";
        })
        .run(function () {
            uiGrid.defaultColumnOptions.displayAlign = 'left';
            uiGrid.defaultPagerMinifiedPageCountThreshold = 3;
        });
    function configureTemplates($templateCache) {
        if (!$templateCache.get(uiGrid.cellHeaderTemplateId)) {
            $templateCache.put(uiGrid.cellHeaderTemplateId,
                    '<div class="' + uiGrid.headerCellCssClass + ' text-{{columnOptions.displayAlign}}"><div ng-if="isCustomized" ng-transclude=""></div><div ng-if="!isCustomized">' +
                    '    <div class="' + uiGrid.columnTitleCssClass + '" title="{{columnTitle}}"><nobr>{{columnTitle}}</nobr>' +
                    '       <div ng-if="gridOptions.enableSorting&&columnOptions.enableSorting"' + uiGrid.columnSortDirectiveAttribute + '=""></div></div>' +
                    '    <div ' + uiGrid.columnFilterDirectiveAttribute + '=""></div></div></div>');
        }
        if (!$templateCache.get(uiGrid.cellBodyTemplateId)) {
            $templateCache.put(uiGrid.cellBodyTemplateId,
                    '<div class="' + uiGrid.bodyCellCssClass + ' text-{{columnOptions.displayAlign}}">' +
                    '  <div ng-if="isCustomized" ng-transclude=""></div>' +
                    '  <div ng-if="!isCustomized">{{gridDisplayItem[columnOptions.displayFieldName]}}</div></div>');
        }
        if (!$templateCache.get(uiGrid.columnFilterTemplateId)) {
            $templateCache.put(uiGrid.columnFilterTemplateId,
                    '<div ng-if="(gridOptions.enableFiltering&&columnOptions.enableFiltering!==false)||columnOptions.enableFiltering" class="' +
                    uiGrid.columnFilterCssClass + '">' + ' <div class="' + uiGrid.columnFilterInputWrapperCssClass + '">' +
                    '   <input class="form-control input-sm" type="text" ng-model="columnOptions.filter" ng-keypress="speedUpAsyncDataRetrieval($event)"/>' +
                    ' </div>' + '</div>');
        }
        // (gridOptions.enableSorting&&columnOptions.enableSorting!==false)||columnOptions.enableSorting
        if (!$templateCache.get(uiGrid.columnSortTemplateId)) {
            $templateCache.put(uiGrid.columnSortTemplateId, '<div ng-click="toggleSorting(columnOptions.fieldName)"' + ' class="' + uiGrid.columnSortCssClass + '" ></div>');
        }
        if (!$templateCache.put(uiGrid.cellFooterTemplateId)) {
            $templateCache.put(uiGrid.cellFooterTemplateId, '<div class="' + uiGrid.footerCssClass + '">' +
                '  <div ng-if="isCustomized" ng-transclude=""></div><div ng-if="!isCustomized">' +
                '    <span ' + uiGrid.globalFilterDirectiveAttribute + '=""></span>' +
                '    <span ' + uiGrid.pagerDirectiveAttribute + '=""></span></div></div>');
        }
        if (!$templateCache.get(uiGrid.footerGlobalFilterTemplateId)) {
            $templateCache.put(uiGrid.footerGlobalFilterTemplateId,
                    '<span ng-show="gridOptions.enableFiltering" class="pull-left form-group">' +
                    '  <input class="form-control" type="text" ng-model="gridOptions.filterBy" ng-keypress="speedUpAsyncDataRetrieval($event)" ' +
                    'ng-attr-placeholder="{{\'Search\'|' + uiGrid.translateFilter + ':gridOptions.locale}}"></input>' + '</span>');
        }
        if (!$templateCache.get(uiGrid.footerPagerTemplateId)) {
            $templateCache.put(uiGrid.footerPagerTemplateId, '<div class="ui-grid-pager"><div class="ui-grid-pager-add pull-left">' +
                '     <span class="pull-left" ng-hide="totalItemsCount">{{"NODATA"|translate}}</span>' +
                '     <span class="pull-left" ng-show="totalItemsCount">{{startItemIndex+1}}-{{endItemIndex+1}}<span>&nbsp; {{"OF"|translate}} &nbsp;&nbsp;{{totalItemsCount}} &nbsp;{{"RECORDS"|translate}}</span></span >'+
                '<div class="ui-grid-pager-num" ng-if="pageItemsInput">每页显示 <input type="text"/> 条<button class="btn btn-default">确定</button></div></div>' +
                '<ul class="ui-grid-pager-main pull-right">' +
                '   <li ng-class="{disabled:!pageCanGoBack}" ng-if="extendedControlsActive"><a href="" ng-click="pageCanGoBack&&navigateToPage(0)"><span>{{"FIRST"|translate}}</span></a></li>' +
                '<li class="pre-pager-btn pager-btn" ng-class="{disabled:!pageCanGoBack}" ng-if="extendedControlsActive"><a href="" ng-click="pageCanGoBack&&navigateToPage(gridOptions.currentPage - 1)"><span>{{"PREV"|translate}}</span></a></li>' +
                '   <li ng-if="pageSelectionActive" ng-repeat="pageIndex in pageIndexes track by $index" ' +
                'ng-class="{disabled:pageIndex===null, active:pageIndex===gridOptions.currentPage}">' +
                '      <strong ng-if="pageIndex===null">• • •</strong> <a href="" ng-click="navigateToPage(pageIndex)" ng-if="pageIndex!==null">{{pageIndex+1}}</a></li>' +
                '   <li class="pager-btn" ng-class="{disabled:!pageCanGoForward}" ng-if="extendedControlsActive">' +
                '     <a href="" ng-click="pageCanGoForward&&navigateToPage(gridOptions.currentPage + 1)"><span>{{"NEXT"|translate}}</span></a></li>' +
                '   <li class="pager-btn" ng-class="{disabled:!pageCanGoForward}" ng-if="extendedControlsActive">' +
                '     <a href="" ng-click="pageCanGoForward&&navigateToPage(lastPageIndex)"><span>{{"LAST"|translate}}</span></a></li>' +
                '</ul></div>');
        }
    }
})(uiGrid || (uiGrid = {}));
