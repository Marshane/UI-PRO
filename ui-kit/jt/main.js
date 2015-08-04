angular.module('account.mix', ['account'])
    .controller('indexCtrl', ['$scope','CS','$stateParams','$translate','dialogs',
        function ($scope,CS,$stateParams,$translate,dialogs){

    }])
    //模块级数据接口工厂
    .factory('CS', ['$http', '$q', function ($http, $q) {
        var _post = function (url, p) {
            var _defer = $q.defer();
            $http.post(url, p).then(_defer.resolve, _defer.reject);
            return _defer.promise;
        };
        //获取数据专用
        //url:接口地址
        //p  :参数 对象格式 eg:  {key:value}
        var _get = function (url, p) {
            var _defer = $q.defer();
            $http.get(AM.util.url(url, p)).then(_defer.resolve, _defer.reject);
            return _defer.promise;
        };
        //存储 模块级所有请求接口
        var _url = {
            services_platform: contextPath + '/resource/ResourceAction/query.go'
        };
        return {
            queryRes: function (p) {
                return _get(_url.services_platform, p);
            }
        }
    }]);