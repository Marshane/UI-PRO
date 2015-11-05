angular.module('ui.editable',[])
    // .factory('uiEditableDirFac',[function(){
    //  return function(op){
    //      return{
    //          restrict:'A',
    //          scope:true,
    //          require:[op.directiveName],
    //          controller:uiEditableCtrl,
    //          link:function(scope,elem,attr,ctrl){

    //          }
    //      }
    //  }
    // }])
    .factory('uiEditableCtrl',['$q',function($q){
        uiEditableCtrl.$inject=['$scope','$attrs','$element','$parse'];
        function uiEditableCtrl(scope,attr,elem,parse){
            var self=this;
            self.scope=scope;
            self.elem=elem;
            self.attr=attr;

        }
        return uiEditableCtrl
    }])
    .directive('uiEditableInput',['uiEditableCtrl',function(uiEditableCtrl){
        return{
            restrict:'A',
            scope:true,
            // require:'uiEditableInput',
            controller:uiEditableCtrl,
            link:function(scope,elem,attr,ctrl){
                console.log(ctrl);
            }
        }
    }])
