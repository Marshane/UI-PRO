angular.module('ui.loading',[])
    .directive('uiLoading',[function(){
        return function(scope,elem){
            scope.$on('ui_load_start',function(){
                elem.show()
            });
            scope.$on('ui_load_end',function(){
                elem.hide()
            });
        }
    }]);