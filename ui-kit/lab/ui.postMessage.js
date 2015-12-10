angular.module('ui.postMessage',[])
    .run(['$window', '$postMessage', '$rootScope', '$log', function($window, $postMessage, $rootScope, $log) {
            $rootScope.$on('send', function(event, message, domain) {
                var sender;
                if (domain == null) {
                    domain = "*";
                }
                sender = $rootScope.sender || $window.parent;
                return sender.postMessage(message, domain);
            });

            angular.element($window).bind('message', function(event) {
                var error, response;
                event = event.originalEvent || event;
                if (event && event.data) {
                    response = null;
                    $rootScope.sender = event.source;
                    try {
                        response = _.isObject(event.data)? angular.fromJson(event.data):event.data;
                    } catch (_error) {
                        error = _error;
                        $log.error('ahem', error);
                        response = event.data;
                    }
                    response.origin = event.origin;
                    $rootScope.$root.$broadcast('$receive', response);
                    return $postMessage.messages(response);
                }
            });
        }
    ])
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
                return $rootScope.$broadcast('send', msg, domain);
            }
        }
    }]);