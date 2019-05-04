angular.module('iKita').directive("fileModel", function ($parse) {

    return {
        restrict : 'A',
        link: function (scope, element, attrs) {
            var parsedFile = $parse(attrs.fileModel);
            var parsedFileSetter = parsedFile.assign;

            element.bind('change', function (event) {
               scope.$apply(function(){
                   parsedFileSetter(scope, element[0].files[0]);
               })
            });
        }
    }
});