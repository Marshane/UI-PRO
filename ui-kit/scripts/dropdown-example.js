angular.module('ui',['ui.dropdown','ui.select','pascalprecht.translate','ui.checkbox','ui.inputSelect','xeditable','ui.scroll','ui.upload'
    ,'ui.buttons','ui.datepicker','ui.timepicker','ui.modal','ui.dialogs','ui.tabs','ui.suggest','ui.utils',
    ,'ui.carousel','ui.grid','ui.bindHtml','ui.tooltip','ui.scrollbar','ui.tree','ui.collapse']);
//angular.module('ui',['ui.checkbox','ui.dropdown','ui.buttons','pascalprecht.translate','ui.modal','dialogs.main','ui.bindHtml']);
angular.module('demo',['ui'])
    .directive('uiPrism',['$compile', function($compile) {
        return {
            restrict: 'A',
            transclude: true,
            scope: {
                source: '@'
            },
            link: function(scope, element, attrs, controller, transclude) {
                scope.$watch('source', function(v) {
                    element.find("code").html(v);

                    Prism.highlightElement(element.find("code")[0]);
                });

                transclude(function(clone) {
                    if (clone.html() !== undefined) {
                        element.find("code").html(clone.html());
                        $compile(element.contents())(scope.$parent);
                    }
                });
            },
            template: "<code></code>"
        };
    }])
    .controller('buttonCtrl',['$scope',function ($scope) {

    }])
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
    .controller('checkboxCtrl', ['$scope','$log','$timeout',function ($scope, $log,$timeout) {

        $scope.checkboxData=[{text:'a',value:1},{text:'bx',value:2},
          {text:'b',value:0},{text:'d',value:4},{text:'e',value:5},{text:'f',value:6}];
        $scope.checkboxData2=[{text:'aa',value:1},{text:'bx',value:9},
            {text:'b',value:0},{text:'dd',value:4},{text:'e',value:5},{text:'f',value:6}];

        $scope.checkedID2=1;
        $scope.checkedID=[0,6];
        $timeout(function(){
            $scope.checkedID2=0;
            $scope.checkedID=[1,4];
        },4000);
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
            dialogs.error().result.then(function(){
                console.log('fff');
            });
        }

        $scope.notify=function() {
            dialogs.notify().result.then(function(){

            });
        }

        $scope.confirm=function() {
            dialogs.confirm();
        }

        $scope.custom=function() {
            dialogs.create('tpl/dialogs/custom.html','customDialogCtrl',{a:1},{width:200})
            .result.then(function(data){
                    $scope.data = data;
                console.log(data);//{a:1}
            });
        }

    }])
    .controller('customDialogCtrl',['$scope','$modalInstance','data',function($scope,$modalInstance,data){
        console.log(data);//{a:1}
        $scope.no = function(){
            $modalInstance.close();
        };
        $scope.confirm=function() {
            $modalInstance.close(data);
        }

        $scope.checkboxData=[{text:'a',value:1},{text:'b',value:2},
            {text:'c',value:3},{text:'d',value:4},{text:'e',value:5},{text:'f',value:6}];

    }])
    .controller('tabsCtrl', ['$scope','$log',function ($scope, $log) {

        $scope.ng={
            tab:0
        };

        $scope.tabsData=[{value:0,title:'Markup',content:'this is tab1'},{value:1,title:'Javascript',content:'this is tab2'}];



    }]) // end controller(tabsCtrl)
    .controller('carouselCtrl',['$scope','$log',function ($scope, $log) {
         $scope.slides=[{},{},{}];

    }])
    .controller('tooltipCtrl', ['$scope','$log',function ($scope, $log) {

        $scope.dynamicTooltip = 'Hello,I am a example!';
//        $scope.dynamicTooltipText = 'dynamic';
    }])
    .controller('gridCtrl',['$scope','$log',function ($scope, $log) {

          (function(){
              $scope.gridData=[
                                {functionName:22434322243,algo:2,dealNum:3,errorNum:8},
                                {functionName:2343432,algo:2,dealNum:3,errorNum:8}
                              ];
              $scope.pagingOptions = {
                  pageSize: 1,
                  currentPage: 0
              };
          })();
          (function(){
              //表格分页配置
              $scope.pagingOptions2 = {
                  pageSize: 1,
                  currentPage: 0
              };
              //table 请求回调  页面载入或 分页时 自动调用
              $scope.onGridPager=function(start,limit){
                  $scope.gridData2=[
                                    {interfaceId:1,functionName:22434322243,algo:2,dealNum:3,errorNum:8},
                                    {interfaceId:2,functionName:2343432,algo:2,dealNum:3,errorNum:8},
                                    {interfaceId:3,functionName:22434322243,algo:2,dealNum:3,errorNum:8},
                                    {interfaceId:4,functionName:2343432,algo:2,dealNum:3,errorNum:8}
                                   ];
              };
              /*表格勾选*/
              $scope.gridSelectedItems = [];
              $scope.onGridSelected=function(areAllSelected){
                  $scope.gridSelectedItems.splice(0,$scope.gridSelectedItems.length);
                  !areAllSelected?$scope.gridSelectedItems.splice(0,$scope.gridSelectedItems.length):
                      $scope.gridSelectedItems.push.apply($scope.gridSelectedItems,$scope.gridData2);
              };
              $scope.onGridChecked=function(item){
                  var f=_.filter($scope.gridSelectedItems,function(it){return it.interfaceId===item.interfaceId});
                  return !!f.length;
              };
              $scope.onNgChange=function(item){
                  var _index;
                  _.each($scope.gridSelectedItems,function(it,index){
                      if(it.interfaceId===item.interfaceId){
                          _index=index;
                          return;
                      }
                  });
                  return _index;
              };
          })();
    }])
    .controller('scrollbarCtrl', ['$scope',function ($scope) {
        $scope.onScrollAc=function(self){
            console.log('on-scroll');
        };
        $scope.onScrollBottomAc=function(self){
            console.log('on-scroll-bottom');
        };
    }])
    .controller('treeCtrl',['$scope','$log',function ($scope, $log) {

        $scope.openAll=function(){
            var ar=[];
            var op=function(d){
                for(var i= 0,l=d.length;i<l;i++){
                    if(d[i].children&&d[i].children.length){
                        ar.push(d[i]);
                        arguments.callee(d[i].children);
                    }
                }
            };
            op($scope.treedata1);
            $scope.expandedData=ar;
        };
        $scope.closeAll=function(){
            $scope.expandedData.length=0;
        };
        $scope.add=function(){

        };
        $scope.del=function(){

        };

        $scope.treedata1=[
            { "name" : "Joe", "age" : "21", "children" : [
                { "name" : "Smith", "age" : "42", "children" : [] },
                { "name" : "Je1", "age" : "33", "children" : [
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
        $scope.noWrapSlides=2;
    }])
    .controller('testCtrl',['$scope','$log',function ($scope, $log) {
       $scope.isCollapsed = false;
       $scope.btnCollapsedHandler = function (){
                $scope.isCollapsed = !$scope.isCollapsed;
            }
    }])
    .controller('suggestCtrl',['$scope',function(scope){
        scope.data=[{'key':1,text:'aaa'},{'key':2,text:'bbb'}];
//        scope.key='text';
    }])
    .controller('inputSelectCtrl',['$scope','$timeout',function(scope,$timeout){
        scope.ngModelList=[{text:'aa',value:11},{text:'bb',value:22},{text:'csd',value:3432},{text:'asd',value:124634},
            {text:'aatr',value:121},{text:'wrewe',value:212},{text:'hjjh',value:34322},{text:'werw',value:12434}];
        scope.functionType=[11,22,3432];
    }])
    .controller('editableCtrl',['$scope','$timeout',function(scope,$timeout){

    }])
//    .run(function($httpBackend) {
//        $httpBackend.whenPOST(/\/suggest/).respond(function(method, url, data) {
//            data = angular.fromJson(data);
//            return [200,{success:true,data:[{'key':1},{'key':2}]}]
////            if(data.name === 'error') {
////                return [500, 'Error message'];
////            } else {
////                return [200, {status: 'ok'}];
////            }
//        });
//    });






