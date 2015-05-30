angular.module('ui.dateFormat',[])
    .factory('dateFormat',['$translate',function($translate){
        var use=$translate.use();
        var format= {
            'en': {
                's': 'MM/dd/yy',
                'm': 'MM/dd/yyyy',
                'l': 'MM/dd/yyyy hh:mm:ss',
                'hm':'hh:mm',
                'hms':'hh:mm:ss'
            },
            'zh_CN': {
                's': 'yy-MM-dd',
                'm': 'yyyy-MM-dd',
                'l': 'yyyy-MM-dd hh:mm:ss',
                'hm':'hh:mm',
                'hms':'hh:mm:ss'
            }
        };
        return function(inp,type){
            if(!inp)return '';
            if(!_.isDate(inp)){
                inp=new Date(inp);
            }
            return inp.dateFormat(format[use][type]);
        }
    }])
    .filter('dateFormat',['dateFormat',function(dateFormat){
        return function(inp,type){
            return dateFormat(inp,type);
        }
    }]);