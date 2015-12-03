angular.module('ui.utils',[
    'ui.cut'
]);
angular.module('ui.cut',[])
    .filter('cut',[function(){
        return function(txt,num){
            return String(txt).cut(num);
        }
    }])
//    .directive('ring',[function(){
//        return{
//            restrict:'A',
//            scope:{
//                radius:'=',
//                color:'=',
//                value:'='
//            },
//            link:function(scope,elem,attrs){
//                scope.color=scope.color||['#fff','#ff0000'];
//                var zr=zrender.init(elem[0]);
//                var render=function(a){
//                    zr.addShape(new zrender.shape.ring({
//                        style :{
//                            x : 60,
//                            y : 60,
//                            r :60,
//                            r0 :50,
//                            color:scope.color[0]
//                        },
//                        hoverable:false
//                    }));
//                    zr.addShape(new zrender.shape.sector({
//                        style :{
//                            startAngle :90,
//                            endAngle : 0,
//                            x : 60,
//                            y : 60,
//                            r : 60,
//                            color:scope.color[1]
//                        },
//                        hoverable:false
//                    }));
//                    zr.addShape(new zrender.shape.circle({
//                        style :{
//                            x : 60,
//                            y : 60,
//                            r : 50,
//                            color:'#fff'
//                        },
//                        hoverable:false
//                    }));
//                };
//                var clear=function(){
//                    zr.clear();
//                };
//                scope.$watch('value',function(a){
//                    //clear();
//                    render(eval('('+a+')')||0);
//                });
//            }
//        }
//    }])
;