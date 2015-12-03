angular.module('ui.postMessage',[])
.factory("$postMessage", ['$rootScope',function($rootScope) {
    var $messages=[];
    return {
        messages: function(msg) {
            if (msg) {
                $messages.push(msg);
                $rootScope.$digest();
            }
            return $messages;
        },
        lastMessage: function() {
            return $messages[$messages.length - 1];
        },
        post: function(msg, domain) {
            if (!domain) {
                domain = "*";
            }
            return $rootScope.$broadcast('$messageOutgoing', msg, domain);
        }
    }
}]);