angular.module('ui.tree', [])
    .directive('uiDateTree',['$timeout',function($timeout){
        return {
            restrict:'A',
            templateUrl: "templates/tree/date-tree.html",
            replace:true,
            scope:{
                data:'=',
                onSelect:'&'
            },
            link:function(scope,elem,attrs){
                var expand_level=+attrs.expandLevel;
                var for_each_branch = function(f) {
                        var do_f, root_branch, _i, _len, _ref, _results;
                        do_f = function(branch, level,index) {
                            var child, _i, _len, _ref, _results;
                            f(branch, level,index);
                            if (branch.children != null) {
                                _ref = branch.children;
                                _results = [];
                                for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                    child = _ref[_i];
                                    _results.push(do_f(child, level + 1,_i));
                                }
                                return _results;
                            }
                        };
                        _ref = scope.data;
                        _results = [];
                        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                            root_branch = _ref[_i];
                            _results.push(do_f(root_branch, 1,_i));
                        }
                        return _results;
                    },
                    selected_branch = null,
                    select_branch = function(branch,fir) {
                        if (!branch) {
                            if (selected_branch != null) {
                                selected_branch.selected = false;
                            }
                            selected_branch = null;
                            return;
                        }
                        if (branch !== selected_branch) {
                            if (selected_branch != null) {
                                selected_branch.selected = false;
                            }
                            branch.selected = true;
                            selected_branch = branch;
                            if (branch.onSelect != null) {
                                return $timeout(function() {
                                    return branch.onSelect(branch);
                                });
                            } else {
                                if (scope.onSelect != null) {
                                    if(fir)return function(){};
                                    return $timeout(function() {
                                        return scope.onSelect({
                                            branch: branch
                                        });
                                    });
                                }
                            }
                        }
                        for_each_branch(function(b, level,index) {
                            b.level = level;
                            if(level<3){//默认展开 第一级包括子集
                                return b.expanded = b.level < expand_level;
                            }
                        });
                    };
                scope.user_clicks_branch = function(branch,row) {
                    $timeout(function(){
                        angular.forEach(scope.tree_rows,function(item){
                            if(row.level===item.level){
                                if(item.label===row.label){
                                    row.branch.expanded=!row.branch.expanded;
                                }else{
                                    item.branch.expanded=0;
                                }
                            }
                        });
                    });
                    if (branch !== selected_branch) {
                        return select_branch(branch);
                    }

                };
                scope.tree_rows = [];
                var on_treeData_change = function() {
                    var add_branch_to_list, root_branch, _i, _len, _ref, _results;
                    scope.tree_rows = [];
                    for_each_branch(function(branch) {
                        var child, f;
                        if (branch.children) {
                            if (branch.children.length > 0) {
                                f = function(e) {
                                    if (typeof e === 'string') {
                                        return {
                                            label: e,
                                            children: []
                                        };
                                    } else {
                                        return e;
                                    }
                                };
                                return branch.children = (function() {
                                    var _i, _len, _ref, _results;
                                    _ref = branch.children;
                                    _results = [];
                                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                        child = _ref[_i];
                                        _results.push(f(child));
                                    }
                                    return _results;
                                })();
                            }
                        } else {
                            return branch.children = [];
                        }
                    });
                    var level1='',level2='',level3='';
                    var add_branch_to_list = function(level, branch, visible) {
                        var child, child_visible,
                            _i, _len, _ref, _results,obj;
                        if (branch.expanded == null) {
                            branch.expanded = false;
                        }

                        obj={
                            level: level,
                            branch: branch,
                            label: branch.label,
                            visible: visible
                        };
                        if(level==1){
                            level1=branch.label;
                            obj.date=branch.label;
                        }
                        if(level==2){
                            level2=branch.label;
                            obj.date=[level1,level2].join('-');
                        }
                        if(level==3){
                            level3=branch.label;
                            obj.date=[level1,level2,level3].join('-');
                        }
                        obj.branch.date=obj.date;

                        scope.tree_rows.push(obj);
                        if (branch.children != null) {
                            _ref = branch.children;
                            _results = [];
                            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                child = _ref[_i];
                                child_visible = visible && branch.expanded;
                                _results.push(add_branch_to_list(level + 1, child, child_visible));
                            }
                            return _results;
                        }
                    };
                    var _ref = scope.data;
                    var _results = [];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        root_branch = _ref[_i];
                        _results.push(add_branch_to_list(1, root_branch, true));
                    }
                    return _results;
                };
                var init=function(){
                    if(attrs.initialSelection != null) {
                        $timeout(function() {
                            for_each_branch(function(b) {
                                if (b.date === attrs.initialSelection) {

                                    return $timeout(function() {
                                        return select_branch(b,1);
                                    });
                                }
                            });
                        },100);
                    }
                    for_each_branch(function(b, level,index) {
                        b.level = level;
                        if(!index){//默认展开 第一级包括子集
                            return b.expanded = b.level < expand_level;
                        }
                        return b.expanded =0
                    });
                };
                var first=0;
                scope.$watch('data',function(a){
                    if(a){
                        if(!first){
                            init();
                            first++;
                        }
                        on_treeData_change();
                    }
                },true);

            }
        }
    }])
    .service('uiTreeService', ['$document', function ($document) {
        var _scope = null, _row, nodeValue,asLabel ;
        var onCloseEditHandler = function (evt) {
            if (evt.target.tagName === 'INPUT') {
                return;
            }
            _scope.$apply(function () {
                _row.branch.editing = false;
                _row.branch[asLabel] = _row.branch.nodeLabel + "[" + _row.branch.nodeValue + "]";
                _row.label = _row.branch[asLabel];
                _scope._onChange(_row);
            });
        };
        this.onEdit = function (scope, row,label) {
            asLabel  = label ;
            $document.unbind('click').bind('click', onCloseEditHandler);
            _scope = scope;
            _row = row;
            _row.branch.editing = true;
        };
    }])
    .directive('uiTree', ['$timeout', 'uiTreeService', function ($timeout, uiTreeService) {
        return {
            restrict: 'EA',
            templateUrl: "templates/tree/tree.html",
            replace: true,
            scope: {
                treeData: '=',
                onSelect: '&',
                onChange: '&',
                initialSelection: '@',
                treeControl: '='
            },
            link: function (scope, element, attrs) {
                var error, expand_all_parents, expand_level, for_all_ancestors, for_each_branch, getNodeXpath,
                    get_parent, n, on_treeData_change, select_branch,
                    selected_branch, tree, focus_newBranch, checked_branch, bindCheckEvent;
                error = function (s) {
                    return void 0;
                };
                var asLabel = attrs.asLabel || "label",
                    asId = attrs.asId || "id";
                if (attrs.iconExpand == null) {
                    attrs.iconExpand = 'icon-plus  glyphicon glyphicon-plus  fa fa-plus';
                }
                if (attrs.iconCollapse == null) {
                    attrs.iconCollapse = 'icon-minus glyphicon glyphicon-minus fa fa-minus';
                }
                if (attrs.iconLeaf == null) {
                    attrs.iconLeaf = 'icon-file  glyphicon glyphicon-file  fa fa-file';
                }
                if (attrs.expandLevel == null) {
                    attrs.expandLevel = '3';
                }
                scope.treeData = scope.treeData || [];
                expand_level = parseInt(attrs.expandLevel, 10);
                if (scope.treeData.length == null) {
                    if (scope.treeData.label != null) {
                        scope.treeData = [scope.treeData];
                    } else {
                        alert('treeData should be an array of root branches');
                        return;
                    }
                }
                for_each_branch = function (f) {
                    var do_f, root_branch, _i, _len, _ref, _results;
                    do_f = function (branch, level) {
                        var child, _i, _len, _ref, _results;
                        f(branch, level);
                        if (branch.children != null) {
                            _ref = branch.children;
                            _results = [];
                            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                child = _ref[_i];
                                _results.push(do_f(child, level + 1));
                            }
                            return _results;
                        }
                    };
                    _ref = scope.treeData;
                    _results = [];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        root_branch = _ref[_i];
                        _results.push(do_f(root_branch, 1));
                    }
                    return _results;
                };
                selected_branch = null;
                select_branch = function (branch) {
                    if (!branch) {
                        if (selected_branch != null) {
                            selected_branch.selected = false;
                        }
                        selected_branch = null;
                        return;
                    }
                    if (branch !== selected_branch) {
                        if (selected_branch != null) {
                            selected_branch.selected = false;
                        }
                        branch.selected = true;
                        selected_branch = branch;
                        expand_all_parents(branch);
                        if (branch.onSelect != null) {
                            return $timeout(function () {
                                return branch.onSelect(branch);
                            });
                        } else {
                            if (scope.onSelect != null) {
                                return $timeout(function () {
                                    return scope.onSelect({
                                        branch: branch
                                    });
                                });
                            }
                        }
                    }
                };
                focus_newBranch = function () {
                    element.find("input.editing")[0] && element.find("input.editing")[0].focus();
                };
                checked_branch = function (branch) {
                    if (!branch) {
                        return;
                    }
                    branch.checked = !branch.checked;
                };

                var timer = null;
                scope.user_clicks_branch = function (branch) {
                    $timeout.cancel(timer);
                    timer = $timeout(function () {
                        if (branch !== selected_branch) {
                            scope.treeControl.addBranchDisable = branch.isLeaf;
                            select_branch(branch);
                        }
                        if (attrs.checkable == "true" && branch.isLeaf) {
                            checked_branch(branch);
                        }
                    }, 300);
                };
                scope.user_edit_branch = function (row) {
                    $timeout.cancel(timer);
                    if (attrs.leafEditable == "false" || attrs.leafEditable == undefined) {
                        return;
                    }
                    uiTreeService.onEdit(scope, row,asLabel);
                };
                scope._onChange = function (row) {
                    if (row.label !== row.branch[asLabel] && scope.onChange) {
                        scope.onChange({row: row});
                    }
                };
                get_parent = function (child) {
                    var parent;
                    parent = void 0;
                    if (child.parent_uid) {
                        for_each_branch(function (b) {
                            if (b.uid === child.parent_uid) {
                                return parent = b;
                            }
                        });
                    }
                    return parent;
                };
                for_all_ancestors = function (child, fn) {
                    var parent;
                    parent = get_parent(child);
                    if (parent != null) {
                        fn(parent);
                        return for_all_ancestors(parent, fn);
                    }
                };
                expand_all_parents = function (child) {
                    return for_all_ancestors(child, function (b) {
                        return b.expanded = true;
                    });
                };
                getNodeXpath = function (child, current_path) {
                    var parent;
                    parent = get_parent(child);
                    if (parent != null) {
                        current_path = parent.label + "/" + current_path;
                        return getNodeXpath(parent, current_path);
                    }
                    return "/" + current_path;
                };
                var expandLevelHandler = function () {
                    for_each_branch(function (b, level) {
                        b.level = level;
                        return b.expanded = b.level < expand_level;
                    });
                };
                scope.tree_rows = [];
                var add_branch_to_list = function (level, branch, visible) {
                    var child, child_visible, tree_icon, _i, _len, _ref, _results, obj;
                    if (branch.expanded == null) {
                        branch.expanded = false;
                    }

                    if (!branch.children || branch.children.length === 0) {
                        tree_icon = attrs.iconLeaf;
                    } else {
                        if (branch.expanded) {
                            tree_icon = attrs.iconCollapse;
                        } else {
                            tree_icon = attrs.iconExpand;
                        }
                    }
                    obj = {
                        level: level,
                        editing: false,
                        branch: branch,
                        label:  branch[asLabel],
                        tree_icon: tree_icon,
                        visible: visible
                    };
                    if (branch.isEditing) {
                        obj.editing = true;
                        obj.branch.editing = true;
                        obj.branch.isEditing = false;
                        $timeout(function () {
                            uiTreeService.onEdit(scope, obj);
                        });
                    }
                    scope.tree_rows.push(obj);
                    if (branch.children != null) {
                        _ref = branch.children;
                        _results = [];
                        for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                            child = _ref[_i];
                            child_visible = visible && branch.expanded;
                            _results.push(add_branch_to_list(level + 1, child, child_visible));
                        }
                        return _results;
                    }
                };
                on_treeData_change = function () {
                    var root_branch, _i, _len, _ref, _results;
                    for_each_branch(function (b, level) {
                        if (!b.uid) {
                            b.uid = "" + Math.random();
                        }
                        if (!b.editing) {
                            b.editing = false;
                        }
                        if (!scope.first) {
                            b.level = level;
                            b.expanded = b.level < expand_level;
                            scope.first = 1;
                        }
                    });
                    for_each_branch(function (b) {
                        var child, _i, _len, _ref, _results;
                        if (angular.isArray(b.children)) {
                            _ref = b.children;
                            _results = [];
                            for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                child = _ref[_i];
                                _results.push(child.parent_uid = b.uid);
                            }
                            return _results;
                        }
                    });
                    scope.tree_rows = [];
                    for_each_branch(function (branch) {
                        var child, f;
                        if (branch.children) {
                            if (branch.children.length > 0) {
                                f = function (e) {
                                    if (typeof e === 'string') {
                                        return {
                                            label: e,
                                            children: []
                                        };
                                    } else {
                                        return e;
                                    }
                                };

                                branch.isLeaf = false;
                                return branch.children = (function () {
                                    var _i, _len, _ref, _results;
                                    _ref = branch.children;
                                    _results = [];
                                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                                        child = _ref[_i];
                                        _results.push(f(child));
                                    }
                                    return _results;
                                })();
                            }
                        } else {
                            branch.isLeaf = true;
                            branch[asLabel] = branch[asLabel] || "";
                            var reg = /([^\[]*)\[(.*)\]([^\]]*)/;
                            branch.nodeLabel = branch[asLabel].replace(reg, '$1');
                            branch.nodeValue = "";
                            if (branch[asLabel].indexOf("[") > 0) {
                                branch.nodeValue = branch[asLabel].replace(reg, '$2');
                            }
                            return branch.children = [];
                        }
                    });

                    _ref = scope.treeData;
                    _results = [];
                    for (_i = 0, _len = _ref.length; _i < _len; _i++) {
                        root_branch = _ref[_i];
                        _results.push(add_branch_to_list(1, root_branch, true));
                    }

                    return _results;
                };
                scope.$watch('treeData', on_treeData_change, true);
                if (attrs.initialSelection != null) {
                    for_each_branch(function (b) {
                        if (b[asLabel] === attrs.initialSelection) {
                            return $timeout(function () {
                                return select_branch(b);
                            });
                        }
                    });
                }
                n = scope.treeData.length;
                expandLevelHandler();

                scope.treeControl = scope.treeControl || {};


                if (scope.treeControl != null) {
                    if (angular.isObject(scope.treeControl)) {
                        tree = scope.treeControl;
                        tree.expand_all = function () {
                            return for_each_branch(function (b, level) {
                                return b.expanded = true;
                            });
                        };
                        tree.collapse_all = function () {
                            return for_each_branch(function (b, level) {
                                return b.expanded = false;
                            });
                        };
                        tree.get_first_branch = function () {
                            n = scope.treeData.length;
                            if (n > 0) {
                                return scope.treeData[0];
                            }
                        };
                        tree.select_first_branch = function () {
                            var b;
                            b = tree.get_first_branch();
                            return tree.select_branch(b);
                        };
                        tree.get_selected_branch = function () {
                            return selected_branch;
                        };
                        tree.get_parent_branch = function (b) {
                            return get_parent(b);
                        };
                        tree.select_branch = function (b) {
                            select_branch(b);
                            return b;
                        };
                        tree.get_children = function (b) {
                            return b.children;
                        };
                        tree.select_parent_branch = function (b) {
                            var p;
                            if (b == null) {
                                b = tree.get_selected_branch();
                            }
                            if (b != null) {
                                p = tree.get_parent_branch(b);
                                if (p != null) {
                                    tree.select_branch(p);
                                    return p;
                                }
                            }
                        };
                        tree.del_branch = function (branch, key) {
                            if (!branch)return;
                            function en(obj) {
                                var pro;
                                for (pro in obj) {
                                    if (obj.hasOwnProperty(pro)) {
                                        if (branch[key] == obj[pro][key]) {
                                            selected_branch = null;
                                            return obj.splice(pro, 1);
                                        }
                                        if (obj[pro].children && obj[pro].children.length) {
                                            en(obj[pro].children);
                                        }
                                    }
                                }
                            }

                            return en(scope.treeData);
                        };
                        tree.add_branch = function (parent, new_branch) {
                            new_branch.isEditing = true;
                            if (parent != null) {
                                parent.children.push(new_branch);
                                parent.expanded = true;
                            } else {
                                scope.treeData.push(new_branch);
                            }
                            var t = $timeout(function () {
                                focus_newBranch();
                                $timeout.cancel(t);
                            }, 300);
                            return new_branch;
                        };
                        tree.add_root_branch = function (new_branch) {
                            tree.add_branch(null, new_branch);
                            return new_branch;
                        };
                        tree.expand_branch = function (b) {
                            if (b == null) {
                                b = tree.get_selected_branch();
                            }
                            if (b != null) {
                                b.expanded = true;
                                return b;
                            }
                        };
                        tree.collapse_branch = function (b) {
                            if (b == null) {
                                b = selected_branch;
                            }
                            if (b != null) {
                                b.expanded = false;
                                return b;
                            }
                        };
                        tree.get_siblings = function (b) {
                            var p, siblings;
                            if (b == null) {
                                b = selected_branch;
                            }
                            if (b != null) {
                                p = tree.get_parent_branch(b);
                                if (p) {
                                    siblings = p.children;
                                } else {
                                    siblings = scope.treeData;
                                }
                                return siblings;
                            }
                        };
                        tree.get_next_sibling = function (b) {
                            var i, siblings;
                            if (b == null) {
                                b = selected_branch;
                            }
                            if (b != null) {
                                siblings = tree.get_siblings(b);
                                n = siblings.length;
                                i = siblings.indexOf(b);
                                if (i < n) {
                                    return siblings[i + 1];
                                }
                            }
                        };
                        tree.get_prev_sibling = function (b) {
                            var i, siblings;
                            if (b == null) {
                                b = selected_branch;
                            }
                            siblings = tree.get_siblings(b);
                            n = siblings.length;
                            i = siblings.indexOf(b);
                            if (i > 0) {
                                return siblings[i - 1];
                            }
                        };
                        tree.select_next_sibling = function (b) {
                            var next;
                            if (b == null) {
                                b = selected_branch;
                            }
                            if (b != null) {
                                next = tree.get_next_sibling(b);
                                if (next != null) {
                                    return tree.select_branch(next);
                                }
                            }
                        };
                        tree.select_prev_sibling = function (b) {
                            var prev;
                            if (b == null) {
                                b = selected_branch;
                            }
                            if (b != null) {
                                prev = tree.get_prev_sibling(b);
                                if (prev != null) {
                                    return tree.select_branch(prev);
                                }
                            }
                        };
                        tree.get_first_child = function (b) {
                            var _ref;
                            if (b == null) {
                                b = selected_branch;
                            }
                            if (b != null) {
                                if (((_ref = b.children) != null ? _ref.length : void 0) > 0) {
                                    return b.children[0];
                                }
                            }
                        };
                        tree.get_closest_ancestor_next_sibling = function (b) {
                            var next, parent;
                            next = tree.get_next_sibling(b);
                            if (next != null) {
                                return next;
                            } else {
                                parent = tree.get_parent_branch(b);
                                return tree.get_closest_ancestor_next_sibling(parent);
                            }
                        };
                        tree.get_next_branch = function (b) {
                            var next;
                            if (b == null) {
                                b = selected_branch;
                            }
                            if (b != null) {
                                next = tree.get_first_child(b);
                                if (next != null) {
                                    return next;
                                } else {
                                    next = tree.get_closest_ancestor_next_sibling(b);
                                    return next;
                                }
                            }
                        };
                        tree.select_next_branch = function (b) {
                            var next;
                            if (b == null) {
                                b = selected_branch;
                            }
                            if (b != null) {
                                next = tree.get_next_branch(b);
                                if (next != null) {
                                    tree.select_branch(next);
                                    return next;
                                }
                            }
                        };
                        tree.last_descendant = function (b) {
                            var last_child;
                            if (b == null) {
                            }
                            n = b.children.length;
                            if (n === 0) {
                                return b;
                            } else {
                                last_child = b.children[n - 1];
                                return tree.last_descendant(last_child);
                            }
                        };
                        tree.get_prev_branch = function (b) {
                            var parent, prev_sibling;
                            if (b == null) {
                                b = selected_branch;
                            }
                            if (b != null) {
                                prev_sibling = tree.get_prev_sibling(b);
                                if (prev_sibling != null) {
                                    return tree.last_descendant(prev_sibling);
                                } else {
                                    parent = tree.get_parent_branch(b);
                                    return parent;
                                }
                            }
                        };
                        tree.get_checkbox_models = function () {
                            var nodes = [];
                            for_each_branch(function (branch) {
                                if (branch.checked) {
                                    nodes.push({
                                        label: branch[asLabel],
                                        node: branch.nodeLabel,
                                        value: branch.nodeValue,
                                        id: branch[asId],
                                        xpath: getNodeXpath(branch, branch.nodeLabel)
                                    });
                                }
                            });
                            return nodes;
                        };
                        tree.set_checkbox_models = function (ids) {
                            for_each_branch(function (branch) {
                                if ($.inArray(branch[asId], ids) > -1) {
                                    branch.checked = true;
                                }
                            });
                        };
                        return tree.select_prev_branch = function (b) {
                            var prev;
                            if (b == null) {
                                b = selected_branch;
                            }
                            if (b != null) {
                                prev = tree.get_prev_branch(b);
                                if (prev != null) {
                                    tree.select_branch(prev);
                                    return prev;
                                }
                            }
                        };
                    }
                }
            }
        };
    }]);