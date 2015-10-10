angular.module('ui',[
    'ui.buttons',
    'ui.dropdown',
    'ui.select',
    'ui.checkbox',
    'ui.scroll',
    'ui.collapse',
    'ui.carousel',
    'ui.datepicker',
    'ui.timepicker',
    'pascalprecht.translate',
    'ui.carousel',
    'ui.tooltip',
    'ui.scrollbar',
    'ui.utils',
    'ui.pager',
    'ui.slider',
    'ui.inputSelect',
    'ui.upload',
    'ui.inputTree',
    'ui.tree',
    'ui.grid',
    'ui.modal',
    'ui.dialogs',
    'ui.tabs',
    'ui.bindHtml',
    'xeditable']);

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
    .controller('uploadCtrl',['$scope',function ($scope) {
        $scope.uploadFinished=function(e,data){
            console.log('文件名：'+data.originalFiles[0].name);//得到文件名
        };
    }])
    .controller('sliderCtrl',['$scope',function ($scope) {
        $scope.p0={
            floor:0,
            value:0,
            ceil:1000
        };
        $scope.p1={
            floor:0,
            value:0,
            max:300,
            ceil:1000
        };
        $scope.translate=function(value){
            return value.toFixed(2)
        }
    }])
    .controller('inputTreeCtrl',['$scope','$timeout',function ($scope,$timeout) {
        var queryBillData={"data":[{"remark":"Ekstraordinær kreditering","children":[
            {"leaf":true,"expanded":false,"codeId":831001,"codeName":"KØBEKS","taxInclude":0,"approvalFlag":0,"baseItemFlag":0,"adjustFlag":1,"parentId":- 1,
                "remark":"Ekstraordinær kreditering"},
            {"leaf":true,"expanded":false,"codeId":831002,"codeName":"KØBABN","taxInclude":0,"approvalFlag":0,"baseItemFlag":1,"adjustFlag":-1,"parentId":- 1,
                "remark":"Abonnement"},{"leaf":true,"expanded":false,"codeId":831003,"codeName":"KØBFOR","taxInclude":0,"approvalFlag":0,"baseItemFlag":1,"adjustFlag":- 1,"parentId":-1,"remark":"Forbrug"},{"leaf":true,"expanded":false,"codeId":831004,"codeName":"KØBGEN","taxInclude":0,"approvalFlag":0,"baseItemFlag":1,"adjustFlag":- 1,"parentId":-1,"remark":"Genåbningsgebyr"}, {"leaf":true,"expanded":false,"codeId":831005,"codeName":"KØBPBS","taxInclude":0,"approvalFlag":0,"baseItemFlag":1,"adjustFlag":-1,"parentId":-1,"remark":"Regning  sendt på papir"},{"leaf":true,"expanded":false,"codeId":831006,"codeName":"KØBDAT","taxInclude":0,"approvalFlag":0,"baseItemFlag":1,"adjustFlag":-1,"parentId":- 1,"remark":"Data forbrug udland"},{"leaf":true,"expanded":false,"codeId":831007,"codeName":"KØBOPR","taxInclude":0,"approvalFlag":0,"baseItemFlag":1,"adjustFlag":- 1,"parentId":-1,"remark":"Oprettelsesgebyr"}, {"leaf":true,"expanded":false,"codeId":831008,"codeName":"KØBSIM","taxInclude":0,"approvalFlag":0,"baseItemFlag":1,"adjustFlag":-1,"parentId":-1,"remark":"Simkort"}, {"leaf":true,"expanded":false,"codeId":831009,"codeName":"KØBETM","taxInclude":0,"approvalFlag":0,"baseItemFlag":1,"adjustFlag":-1,"parentId":- 1,"remark":"Ekstraordinær regulering"}, {"leaf":true,"expanded":false,"codeId":831010,"codeName":"KØBROU","taxInclude":0,"approvalFlag":0,"baseItemFlag":1,"adjustFlag":-1,"parentId":-1,"remark":"Router"}, {"leaf":true,"expanded":false,"codeId":831033,"codeName":"KØBRYK","taxInclude":1,"approvalFlag":0,"baseItemFlag":1,"adjustFlag":-1,"parentId":- 1,"remark":"Rykkergebyr"},{"leaf":true,"expanded":false,"codeId":831034,"codeName":"KØBINS","taxInclude":1,"approvalFlag":0,"baseItemFlag":1,"adjustFlag":- 1,"parentId":-1,"remark":"Forsikring"}, {"leaf":true,"expanded":false,"codeId":831040,"codeName":"KØBEKS","taxInclude":0,"approvalFlag":0,"baseItemFlag":1,"adjustFlag":1,"parentId":-1,"remark":"Ekstraordinær  kreditering"},{"leaf":true,"expanded":false,"codeId":831041,"codeName":"KØBABN","taxInclude":0,"approvalFlag":0,"baseItemFlag":0,"adjustFlag":-1,"parentId":- 1,"remark":"Abonnement"},{"leaf":true,"expanded":false,"codeId":831042,"codeName":"KØBFOR","taxInclude":0,"approvalFlag":0,"baseItemFlag":0,"adjustFlag":- 1,"parentId":-1,"remark":"Forbrug"},{"leaf":true,"expanded":false,"codeId":831043,"codeName":"KØBGEN","taxInclude":0,"approvalFlag":0,"baseItemFlag":0,"adjustFlag":- 1,"parentId":-1,"remark":"Genåbningsgebyr"}, {"leaf":true,"expanded":false,"codeId":831044,"codeName":"KØBPBS","taxInclude":0,"approvalFlag":0,"baseItemFlag":0,"adjustFlag":-1,"parentId":-1,"remark":"Regning  sendt på papir"},{"leaf":true,"expanded":false,"codeId":831045,"codeName":"KØBDAT","taxInclude":0,"approvalFlag":0,"baseItemFlag":0,"adjustFlag":-1,"parentId":- 1,"remark":"Data forbrug udland"},{"leaf":true,"expanded":false,"codeId":831046,"codeName":"KØBOPR","taxInclude":0,"approvalFlag":0,"baseItemFlag":0,"adjustFlag":- 1,"parentId":-1,"remark":"Oprettelsesgebyr"}, {"leaf":true,"expanded":false,"codeId":831047,"codeName":"KØBSIM","taxInclude":0,"approvalFlag":0,"baseItemFlag":0,"adjustFlag":-1,"parentId":-1,"remark":"Simkort"}, {"leaf":true,"expanded":false,"codeId":831048,"codeName":"KØBETM","taxInclude":0,"approvalFlag":0,"baseItemFlag":0,"adjustFlag":-1,"parentId":- 1,"remark":"Ekstraordinær regulering"}, {"leaf":true,"expanded":false,"codeId":831049,"codeName":"KØBROU","taxInclude":0,"approvalFlag":0,"baseItemFlag":0,"adjustFlag":-1,"parentId":-1,"remark":"Router"}, {"leaf":true,"expanded":false,"codeId":831067,"codeName":"KØBRYK","taxInclude":1,"approvalFlag":0,"baseItemFlag":0,"adjustFlag":-1,"parentId":- 1,"remark":"Rykkergebyr"},{"leaf":true,"expanded":false,"codeId":831068,"codeName":"KØBINS","taxInclude":1,"approvalFlag":0,"baseItemFlag":0,"adjustFlag":- 1,"parentId":-1,"remark":"Forsikring"}],"leaf":false,"expanded":false,"codeId":-1,"codeName":"level  1","taxInclude":0,"approvalFlag":0,"baseItemFlag":0,"adjustFlag":1},{"children": [{"leaf":true,"expanded":false,"codeId":831011,"codeName":"BRUABN","taxInclude":0,"approvalFlag":0,"baseItemFlag":1,"adjustFlag":-1,"parentId":- 2,"remark":"Abonnement"},{"leaf":true,"expanded":false,"codeId":831012,"codeName":"BRUGEN","taxInclude":0,"approvalFlag":0,"baseItemFlag":1,"adjustFlag":- 1,"parentId":-2,"remark":"Genåbningsgebyr"}, {"leaf":true,"expanded":false,"codeId":831013,"codeName":"BRUFOR","taxInclude":0,"approvalFlag":0,"baseItemFlag":1,"adjustFlag":-1,"parentId":-2,"remark":"Forbrug"}, {"leaf":true,"expanded":false,"codeId":831014,"codeName":"BRUPBS","taxInclude":0,"approvalFlag":0,"baseItemFlag":1,"adjustFlag":-1,"parentId":-2,"remark":"Regning  sendt på papir"},{"leaf":true,"expanded":false,"codeId":831015,"codeName":"BRUDAT","taxInclude":0,"approvalFlag":0,"baseItemFlag":1,"adjustFlag":-1,"parentId":- 2,"remark":"Data forbrug udland"},{"leaf":true,"expanded":false,"codeId":831016,"codeName":"BRUOPR","taxInclude":0,"approvalFlag":0,"baseItemFlag":1,"adjustFlag":- 1,"parentId":-2,"remark":"Oprettelsesgebyr"}, {"leaf":true,"expanded":false,"codeId":831017,"codeName":"BRUSIM","taxInclude":0,"approvalFlag":0,"baseItemFlag":1,"adjustFlag":-1,"parentId":-2,"remark":"Simkort"}, {"leaf":true,"expanded":false,"codeId":831018,"codeName":"BRUETM","taxInclude":0,"approvalFlag":0,"baseItemFlag":1,"adjustFlag":-1,"parentId":- 2,"remark":"Ekstraordinær regulering"}, {"leaf":true,"expanded":false,"codeId":831019,"codeName":"BRUROU","taxInclude":0,"approvalFlag":0,"baseItemFlag":1,"adjustFlag":-1,"parentId":-2,"remark":"Router"}, {"leaf":true,"expanded":false,"codeId":831035,"codeName":"BRURYK","taxInclude":1,"approvalFlag":0,"baseItemFlag":1,"adjustFlag":-1,"parentId":- 2,"remark":"Rykkergebyr"},{"leaf":true,"expanded":false,"codeId":831036,"codeName":"BRUINS","taxInclude":1,"approvalFlag":0,"baseItemFlag":1,"adjustFlag":- 1,"parentId":-2,"remark":"Forsikring"}, {"leaf":true,"expanded":false,"codeId":831050,"codeName":"BRUABN","taxInclude":0,"approvalFlag":0,"baseItemFlag":0,"adjustFlag":-1,"parentId":- 2,"remark":"Abonnement"},{"leaf":true,"expanded":false,"codeId":831051,"codeName":"BRUGEN","taxInclude":0,"approvalFlag":0,"baseItemFlag":0,"adjustFlag":- 1,"parentId":-2,"remark":"Genåbningsgebyr"}, {"leaf":true,"expanded":false,"codeId":831052,"codeName":"BRUFOR","taxInclude":0,"approvalFlag":0,"baseItemFlag":0,"adjustFlag":-1,"parentId":-2,"remark":"Forbrug"}, {"leaf":true,"expanded":false,"codeId":831053,"codeName":"BRUPBS","taxInclude":0,"approvalFlag":0,"baseItemFlag":0,"adjustFlag":-1,"parentId":-2,"remark":"Regning  sendt på papir"},{"leaf":true,"expanded":false,"codeId":831054,"codeName":"BRUDAT","taxInclude":0,"approvalFlag":0,"baseItemFlag":0,"adjustFlag":-1,"parentId":- 2,"remark":"Data forbrug udland"},{"leaf":true,"expanded":false,"codeId":831055,"codeName":"BRUOPR","taxInclude":0,"approvalFlag":0,"baseItemFlag":0,"adjustFlag":- 1,"parentId":-2,"remark":"Oprettelsesgebyr"}, {"leaf":true,"expanded":false,"codeId":831056,"codeName":"BRUSIM","taxInclude":0,"approvalFlag":0,"baseItemFlag":0,"adjustFlag":-1,"parentId":-2,"remark":"Simkort"}, {"leaf":true,"expanded":false,"codeId":831057,"codeName":"BRUETM","taxInclude":0,"approvalFlag":0,"baseItemFlag":0,"adjustFlag":-1,"parentId":- 2,"remark":"Ekstraordinær regulering"}, {"leaf":true,"expanded":false,"codeId":831058,"codeName":"BRUROU","taxInclude":0,"approvalFlag":0,"baseItemFlag":0,"adjustFlag":-1,"parentId":-2,"remark":"Router"}, {"leaf":true,"expanded":false,"codeId":831069,"codeName":"BRURYK","taxInclude":1,"approvalFlag":0,"baseItemFlag":0,"adjustFlag":-1,"parentId":- 2,"remark":"Rykkergebyr"},{"leaf":true,"expanded":false,"codeId":831070,"codeName":"BRUINS","taxInclude":1,"approvalFlag":0,"baseItemFlag":0,"adjustFlag":- 1,"parentId":-2,"remark":"Forsikring"}],"leaf":false,"expanded":false,"codeId":-2,"codeName":"level 2","taxInclude":0,"approvalFlag":0,"baseItemFlag":1,"adjustFlag":- 1},{"children":[{"leaf":true,"expanded":false,"codeId":831020,"codeName":"ANNABN","taxInclude":0,"approvalFlag":0,"baseItemFlag":1,"adjustFlag":-1,"parentId":- 3,"remark":"Abonnement"},{"leaf":true,"expanded":false,"codeId":831021,"codeName":"ANNFOR","taxInclude":0,"approvalFlag":0,"baseItemFlag":1,"adjustFlag":- 1,"parentId":-3,"remark":"Forbrug"},{"leaf":true,"expanded":false,"codeId":831022,"codeName":"ANNGEN","taxInclude":0,"approvalFlag":0,"baseItemFlag":1,"adjustFlag":- 1,"parentId":-3,"remark":"Genåbningsgebyr"}, {"leaf":true,"expanded":false,"codeId":831023,"codeName":"ANNPBS","taxInclude":0,"approvalFlag":0,"baseItemFlag":1,"adjustFlag":-1,"parentId":-3,"remark":"Regning  sendt på papir"},{"leaf":true,"expanded":false,"codeId":831024,"codeName":"ANNOPR","taxInclude":0,"approvalFlag":0,"baseItemFlag":1,"adjustFlag":-1,"parentId":- 3,"remark":"Oprettelsesgebyr"},{"leaf":true,"expanded":false,"codeId":831025,"codeName":"ANNSIM","taxInclude":0,"approvalFlag":0,"baseItemFlag":1,"adjustFlag":- 1,"parentId":-3,"remark":"Simkort"},{"leaf":true,"expanded":false,"codeId":831026,"codeName":"ANNROU","taxInclude":0,"approvalFlag":0,"baseItemFlag":1,"adjustFlag":- 1,"parentId":-3,"remark":"Router"},{"leaf":true,"expanded":false,"codeId":831037,"codeName":"ANNRYK","taxInclude":1,"approvalFlag":0,"baseItemFlag":1,"adjustFlag":- 1,"parentId":-3,"remark":"Rykkergebyr"}, {"leaf":true,"expanded":false,"codeId":831038,"codeName":"ANNINS","taxInclude":1,"approvalFlag":0,"baseItemFlag":1,"adjustFlag":-1,"parentId":- 3,"remark":"Forsikring"},{"leaf":true,"expanded":false,"codeId":831039,"codeName":"ANNRAB","taxInclude":1,"approvalFlag":0,"baseItemFlag":1,"adjustFlag":- 1,"parentId":-3,"remark":"Regulering rabat"}, {"leaf":true,"expanded":false,"codeId":831059,"codeName":"ANNABN","taxInclude":0,"approvalFlag":0,"baseItemFlag":0,"adjustFlag":-1,"parentId":- 3,"remark":"Abonnement"},{"leaf":true,"expanded":false,"codeId":831060,"codeName":"ANNFOR","taxInclude":0,"approvalFlag":0,"baseItemFlag":0,"adjustFlag":- 1,"parentId":-3,"remark":"Forbrug"},{"leaf":true,"expanded":false,"codeId":831061,"codeName":"ANNGEN","taxInclude":0,"approvalFlag":0,"baseItemFlag":0,"adjustFlag":- 1,"parentId":-3,"remark":"Genåbningsgebyr"}, {"leaf":true,"expanded":false,"codeId":831062,"codeName":"ANNPBS","taxInclude":0,"approvalFlag":0,"baseItemFlag":0,"adjustFlag":-1,"parentId":-3,"remark":"Regning  sendt på papir"},{"leaf":true,"expanded":false,"codeId":831063,"codeName":"ANNOPR","taxInclude":0,"approvalFlag":0,"baseItemFlag":0,"adjustFlag":-1,"parentId":- 3,"remark":"Oprettelsesgebyr"},{"leaf":true,"expanded":false,"codeId":831064,"codeName":"ANNSIM","taxInclude":0,"approvalFlag":0,"baseItemFlag":0,"adjustFlag":- 1,"parentId":-3,"remark":"Simkort"},{"leaf":true,"expanded":false,"codeId":831065,"codeName":"ANNROU","taxInclude":0,"approvalFlag":0,"baseItemFlag":0,"adjustFlag":- 1,"parentId":-3,"remark":"Router"},{"leaf":true,"expanded":false,"codeId":831071,"codeName":"ANNRYK","taxInclude":1,"approvalFlag":0,"baseItemFlag":0,"adjustFlag":- 1,"parentId":-3,"remark":"Rykkergebyr"}, {"leaf":true,"expanded":false,"codeId":831072,"codeName":"ANNINS","taxInclude":1,"approvalFlag":0,"baseItemFlag":0,"adjustFlag":-1,"parentId":- 3,"remark":"Forsikring"},{"leaf":true,"expanded":false,"codeId":831073,"codeName":"ANNRAB","taxInclude":1,"approvalFlag":0,"baseItemFlag":0,"adjustFlag":- 1,"parentId":-3,"remark":"Regulering rabat"}],"leaf":false,"expanded":false,"codeId":-3,"codeName":"level  3","taxInclude":0,"approvalFlag":0,"baseItemFlag":1,"adjustFlag":-1},{"children": [{"leaf":true,"expanded":false,"codeId":831027,"codeName":"TABDEB","taxInclude":0,"approvalFlag":1,"baseItemFlag":0,"adjustFlag":-1,"parentId":-4,"remark":"Tab,  debitorer"},{"leaf":true,"expanded":false,"codeId":831028,"codeName":"TABSV1","taxInclude":0,"approvalFlag":1,"baseItemFlag":0,"adjustFlag":-1,"parentId":- 4,"remark":"Tab, svindel"},{"leaf":true,"expanded":false,"codeId":831029,"codeName":"FORÆL1","taxInclude":0,"approvalFlag":1,"baseItemFlag":0,"adjustFlag":- 1,"parentId":-4,"remark":"Forældet"},{"leaf":true,"expanded":false,"codeId":831030,"codeName":"CANCEL","taxInclude":0,"approvalFlag":1,"baseItemFlag":0,"adjustFlag":- 1,"parentId":-4,"remark":"Nulstilling balance"}, {"leaf":true,"expanded":false,"codeId":831074,"codeName":"INKOMK","taxInclude":1,"approvalFlag":1,"baseItemFlag":0,"adjustFlag":-1,"parentId":- 4,"remark":"Inkassoomkostninger"}],"leaf":false,"expanded":false,"codeId":-4,"codeName":"level 4","taxInclude":0,"approvalFlag":1,"baseItemFlag":0,"adjustFlag":-1}, {"children":[{"leaf":true,"expanded":false,"codeId":831031,"codeName":"PAYMPL","taxInclude":0,"approvalFlag":1,"baseItemFlag":0,"adjustFlag":-1,"parentId":- 5,"remark":"Betalingsaftale gebyr"},{"leaf":true,"expanded":false,"codeId":831032,"codeName":"UOPSIG","taxInclude":0,"approvalFlag":1,"baseItemFlag":1,"adjustFlag":- 1,"parentId":-5,"remark":"Ophør i uopsigelighedsperioden"}, {"leaf":true,"expanded":false,"codeId":831066,"codeName":"UOPSIG","taxInclude":0,"approvalFlag":0,"baseItemFlag":0,"adjustFlag":-1,"parentId":-5,"remark":"Ophør i  uopsigelighedsperioden"},{"leaf":true,"expanded":false,"codeId":831075,"codeName":"REGREN","taxInclude":1,"approvalFlag":0,"baseItemFlag":0,"adjustFlag":- 1,"parentId":-5,"remark":"Morarente"}],"leaf":false,"expanded":false,"codeId":-5,"codeName":"level 5","taxInclude":0,"approvalFlag":1,"baseItemFlag":0,"adjustFlag":- 1}],"success":true};

        $scope.data=queryBillData.data;
        $scope.onSelect=function(node){
            console.log(node);
        };
        $timeout(function(){
            $scope.id=831002;
//            $scope.selectNode={"leaf":true,"expanded":false,"codeId":831002,"codeName":"KØBABN","taxInclude":0,"approvalFlag":0,"baseItemFlag":1,"adjustFlag":-1,"parentId":- 1,
//                "remark":"Abonnement"};
        },1000);
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
        $scope.checkboxData2=[{text:'aa',value:9},{text:'bx',value:0},
            {text:'b',value:22},{text:'dd',value:4},{text:'e',value:5},{text:'f',value:6}];

        $scope.checkedID2=0;
        $scope.checkedID=[0,6];
        $timeout(function(){
            $scope.checkedID2=9;
            $scope.checkedID=[1,4];
        },4000);
    }])
    .controller('datepickerCtrl', ['$scope','$log',function ($scope, $log) {
        $scope.dateSelection22=1440864000000;
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
              $scope.data=[
                  {functionName:22434322243,algo:2,dealNum:3,errorNum:8},
                  {functionName:2343432,algo:2,dealNum:3,errorNum:8}
              ];
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
    .controller('treeCtrl',['$scope','$timeout',function ($scope,$timeout) {
        //全部展开
        $scope.openAll=function(){
            var ar=[];
            var op=function(d){
                for(var i= 0,l=d.length;i<l;i++){
                    if(d[i].children&&d[i].children.length){
                        ar.push(d[i]);
                        arguments.callee(d[i].children);
                    }
                }
                return ar
            };
            $scope.expandedData=op($scope.treedata1);
        };
        //全部关闭
        $scope.closeAll=function(){
            $scope.expandedData.length=0;
        };
        //添加节点
        $scope.add=function(){
            var data={ "name" : "mar"+Math.ceil(Math.random()*1E4), "age" : "29"};
            if($scope.selected){
                if($scope.selectedNode.children){
                    $scope.selectedNode.children.push(data);
                }else{
                    $scope.selectedNode.children=[data];
                }
            }else{
                $scope.treedata1.push(data);
            }
            $scope.expandedData.push($scope.selectedNode);//展开该节点
        };
        //数组枚举
        var emuArr=function(d,obj,id,fun){
            for(var i= 0,l= d.length;i<l;i++){
                if(!d[i])continue;
                if(d[i][id]===obj[id]){
                    if(fun) fun(d,i);
                    continue
                }
                if(d[i].children){
                    arguments.callee(d[i].children,obj,id,fun);
                }
            }
        };
        //删除选中节点
        $scope.del=function(){
            if($scope.selected){
                emuArr($scope.treedata1,$scope.selectedNode,'name',function(d,i){
                    d.splice(i,1);
                });
            }
        };
        //选择节点回调
        $scope.onSelection=function(node,selected){
            $scope.selected=selected;
        };
        //模拟数据
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
    .controller('suggestCtrl',['$scope','$timeout',function(scope,$timeout){
        function createSubTree(level, width, prefix) {
            if (level > 0) {
                var res = [];
                for (var i=1; i <= width; i++)
                    res.push({ "label" : "node" + prefix + i, "id" : "id"+prefix + i, "i": i,
                        "children": createSubTree(level-1, width, prefix + i +".") });
                return res;
            }
            else
                return [];
        }scope.data=createSubTree(1,300,'');
        scope.suggestSelect2='id20';
        $timeout(function(){
            var obj={ "label" : "node20","id" : "id30"};
//            scope.fixedData={label:'default',id:'0'};
            scope.suggestSelect2=obj['label'];

        },4000);
        scope.onSelect2=function(self){
            console.log(self);
        };
        scope.onblur=function(){
            if(scope.suggestSelect2==='id20'){
                scope.ctrl._ngModel.$setValidity('valid',true)
            }else{
                scope.ctrl._ngModel.$setValidity('valid',false)
            }
        }
        scope.post=function(){
            alert(scope.suggestSelect2);
        }
    }])
    .controller('uiPagerCtrl',['$scope','$timeout',function(scope,$timeout){
        $timeout(function(){
           scope.total=20;
        },1e3);
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
     .controller('sidebarSearchCtrl',['$scope','$timeout',function($scope,$timeout){
              $scope.functype=[{name:'业务A'},{name:'业务B'},{name:'业务C'},{name:'业务D'},{name:'业务E'},{name:'业务F'}];
     }])
     .controller('sideTabCtrl',['$scope','$timeout',function($scope,$timeout){
             //参数实体集合
        $scope.p={
          tab:0
        };
        $scope.tabsData=[{value:0,title:'基本信息配置'},{value:1,title:'任务源'},{value:2,title:'服务调用'},{value:3,title:'个性化配置'}];
     }]);






