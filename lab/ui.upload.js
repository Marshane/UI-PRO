angular.module('ui.upload', [])
    .directive('uiFileUpload', function () {
        return{
            restrict: 'A',
            scope: {
                done: '&',
                formData:'=?',
                process: '&'
            },
            link: function (scope, elem, attr) {
                var op = {
                    dataType: 'json'
                }, _watch,_watch2;
                if (scope.done){
                    op.done = function (e, data) {
                        scope.$apply(function () {
                            scope.done({e: e, data: data});
                        });
                    }
                }
                if (scope.process) {
                    op.process = function (e, data) {
                        scope.$apply(function () {
                            scope.process({e: e, data: data});
                        })
                    }
                }
                scope.url = attr.url;
                scope.formatDate = attr.formatDate;
                scope.formatAttr = attr.formatAttr;
                scope.insteadAttr = attr.insteadAttr;

                _watch = scope.$watch('url', function (a) {
                    if (a) {
                        elem.fileupload(op);
                        _watch();
                    }
                });
                _watch2 = scope.$watch('formData', function (a) {
                    if (a){
                        if(typeof scope.formatDate !=='undefined'&& typeof scope.formatAttr !=='undefined'&& typeof scope.insteadAttr !== 'undefined'){
                            var formatDate = a[scope.formatAttr].Format(scope.formatDate);
                            a[scope.insteadAttr]=formatDate;
                        }
                        op.formData=a;
                        elem.fileupload(op);
                    }
                },true);
                scope.$on('$destroy',function(){
                    _watch();
                    _watch2();
                })
            }
        }
    });