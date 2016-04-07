angular.module('ui.loading', [])
.factory('httpInterceptor',['$q','$rootScope',function ($q,$rootScope){
    var loadingNum=0;
    return {
        request: function (config) {
            loadingNum++;
            $rootScope.$broadcast("load_start");
            return config || $q.when(config)
        },
        response:function(response) {
            if ((--loadingNum) === 0) {
                $rootScope.$broadcast("load_end");
            }
            return response || $q.when(response);
        },
        responseError: function (response) {
            if (!(--loadingNum)) {
                $rootScope.$broadcast("load_end");
            }
            return $q.reject(response);
        }
    }
}])
.directive('uiLoading',[function(){
        return function(scope,elem){
            scope.$on('load_start',function(){
                console.log('load_start')
                elem.show()
            });
            scope.$on('load_end',function(){
                console.log('load_end')
                elem.hide()
            });
        }
    }]);
