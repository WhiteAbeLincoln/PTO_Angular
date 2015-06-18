(function(angular) {
    angular.module('myApp')
        .factory('ChangeArray', function() {
            return function(num, array, object){
                var oldLen = array.length;
                if (num > oldLen){
                    for (var i =0; i < (num - oldLen); i++){
                        array.push(angular.copy(object));
                    }
                } else {
                    for (var i = 0; i < (oldLen - num); i++){
                        array.pop();
                    }
                }
            };
        })
})(window.angular);