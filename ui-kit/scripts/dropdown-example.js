angular.module('ui',['ui.dropdown','ui.select','pascalprecht.translate','ui.checkbox','ui.inputSelect'
    ,'ui.buttons','ui.datepicker','ui.timepicker','ui.modal','dialogs.main','ui.tabs','ui.suggest',
    ,'ui.carousel','ui.grid','ui.bindHtml','ui.tooltip','ui.scrollbar','ui.tree','ui.collapse']);
angular.module('demo',['ui'])
    .controller('dropdownCtrl',['$scope','$log',function ($scope, $log) {
        $scope.items = [
            'The first choice!',
            'And another choice for you.',
            'but wait! A third!'
        ];

        $scope.status = {
            isopen: false
        };

        $scope.toggled = function(open) {
            $log.log('Dropdown is now: ', open);
        };

        $scope.toggleDropdown = function($event) {
            $event.preventDefault();
            $event.stopPropagation();
            $scope.status.isopen = !$scope.status.isopen;
        };
    }])
    .controller('selectCtrl', ['$scope','$log',function ($scope, $log) {

        $scope.selectData=[{text:'a',value:1},{text:'b',value:2},
            {text:'c',value:3},{text:'d',value:4},{text:'e',value:5},{text:'f',value:6}];


    }])
    .controller('checkboxCtrl', ['$scope','$log',function ($scope, $log) {

        $scope.checkboxData=[{text:'a',value:1},{text:'b',value:2},
          {text:'b',value:3},{text:'d',value:4},{text:'e',value:5},{text:'f',value:6}];

    }])
    .controller('datepickerCtrl', ['$scope','$log',function ($scope, $log) {
    }])
    .controller('timepickerCtrl', ['$scope','$log',function ($scope, $log) {

        $scope.mytime = new Date();

        $scope.hstep = 1;
        $scope.mstep = 15;

        $scope.ismeridian = true;
        $scope.toggleMode = function() {
            $scope.ismeridian = ! $scope.ismeridian;
        };

        $scope.update = function() {
            var d = new Date();
            d.setHours( 14 );
            d.setMinutes( 0 );
            $scope.mytime = d;
        };

        $scope.changed = function () {
            $log.log('Time changed to: ' + $scope.mytime);
        };

        $scope.clear = function() {
            $scope.mytime = null;
        };
    }])
    .controller('dialogsCtrl',['$scope','$rootScope','$timeout','dialogs',function($scope,$rootScope,$timeout,dialogs){


        $scope.error=function() {
            dialogs.error();
        }

        $scope.notify=function() {
            dialogs.notify();
        }

        $scope.confirm=function() {
            dialogs.confirm();
        }

        $scope.custom=function() {
            dialogs.create('tpl/dialogs/custom.html','customDialogCtrl',{},'lg');

        }

    }]) // end controller(dialogsServiceTest)
    .controller('customDialogCtrl',['$scope','$modalInstance',function($scope,$modalInstance){
        //-- Variables --//

        $scope.no = function(){
            $modalInstance.close();
        };

        $scope.confirm=function() {
            dialogs.confirm();
        }

        $scope.checkboxData=[{text:'a',value:1},{text:'b',value:2},
            {text:'c',value:3},{text:'d',value:4},{text:'e',value:5},{text:'f',value:6}];

    }])
    .controller('tabsCtrl', ['$scope','$log',function ($scope, $log) {

        $scope.ng={
            tab:1
        };

        $scope.tabsData=[{value:0,title:'Tab1',content:'this is tab1'},{value:1,title:'Tab2',content:'this is tab2'}];



    }]) // end controller(tabsCtrl)
    .controller('carouselCtrl',['$scope','$log',function ($scope, $log) {
         $scope.slides=[{},{},{}];

    }])
    .controller('tooltipCtrl', ['$scope','$log',function ($scope, $log) {

        $scope.dynamicTooltip = 'Hello,I am a example!';
//        $scope.dynamicTooltipText = 'dynamic';
    }])
     .controller('gridCtrl',['$scope','$log',function ($scope, $log) {
          $scope.gridData=[{functionName:22,algo:2,dealNum:3,errorNum:8},{functionName:22,algo:2,dealNum:3,errorNum:8}];    
          $scope.pagingOptions = {
                    pageSize: 1,
                    currentPage: 0
                }
    }])
    .controller('scrollbarCtrl', ['$scope','$log',function ($scope, $log) {

    }])
    .controller('treeCtrl',['$scope','$log',function ($scope, $log) {
        //equlity

        $scope.treedata1=[
            { "name" : "Joe", "age" : "21", "children" : [
                { "name" : "Smith", "age" : "42", "children" : [] },
                { "name" : "Joe", "age" : "21", "children" : [
                    { "name" : "Jenifer", "age" : "23", "children" : [
                        { "name" : "Dani", "age" : "32", "children" : [] },
                        { "name" : "Max", "age" : "34", "children" : [] }
                    ]}
                ]}
            ]},
            { "name" : "Albert", "age" : "33", "children" : [] },
            { "name" : "Ron", "age" : "29", "children" : [] }
        ];

        function createSubTree(level, width, prefix) {
            if (level > 0) {
                var res = [];
                for (var i=1; i <= width; i++)
                    res.push({ "label" : "Node " + prefix + i, "id" : "id"+prefix + i, "i": i,
                        "children": createSubTree(level-1, width, prefix + i +".") });
                return res;
            }
            else
                return [];
        }

        $scope.treedata=createSubTree(3,4,'');
        $scope.opts = {
            equality: function(node1, node2) {
                return node1 === node2;
            }
        };

        $scope.lastClicked = null;
        $scope.buttonClick = function($event, node) {
            $scope.lastClicked = node;
            $event.stopPropagation();
        }
        $scope.showSelected = function(node) {
            $scope.selectedNode = node;
        };
        $scope.addRoot = function() {
            $scope.treedata.push({label: "New Root", id:"11", children: []})
        };
        $scope.addChildToSecondRoot = function() {
            $scope.treedata[1].children.push({label: "I am a add Child", id:"1.4", children: []})
        };

        $scope.selected = $scope.treedata[2];
        $scope.selectNode = function(num) {
            $scope.selected = $scope.treedata[num];
        };
        $scope.clearSelected = function() {
            $scope.selected = undefined;
        }

        $scope.expandedNodes = [$scope.treedata[1],
            $scope.treedata[3],
            $scope.treedata[3].children[2],
            $scope.treedata[3].children[2].children[1]];
        $scope.setExpanded = function() {
            $scope.expandedNodes = [$scope.treedata[1],
                $scope.treedata[2],
                $scope.treedata[2].children[2]
            ];
        };


    }])
    .controller('collapseCtrl',['$scope','$log',function ($scope, $log) {
          $scope.isCollapsed = false;
    }])
     .controller('testCtrl',['$scope','$log',function ($scope, $log) {
           $scope.isCollapsed = false;
           $scope.btnCollapsedHandler = function (){
                    $scope.isCollapsed = !$scope.isCollapsed;
                }
    }])
     .controller('suggestCtrl',['$scope',function(scope){

        scope.data=[{'key':1},{'key':2}];
        scope.ngModelList=[{text:'aa',value:11},{text:'bb',value:22},{text:'csd',value:3432},{text:'asd',value:124634},
            {text:'aatr',value:121},{text:'wrewe',value:212},{text:'hjjh',value:34322},{text:'werw',value:12434}];
        scope.p={
            functionType:[3432,124634,12434]
        };
        scope.key='text';
     }]);






