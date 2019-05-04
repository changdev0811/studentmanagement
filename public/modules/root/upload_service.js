angular.module('iKita').service('uploadFileService', function ($http, $rootScope) {
  
  this.upload = function(file){
    var fd = new FormData();
    fd.append('myFile', file);
    return $http.post('/upload/' + $rootScope.decodedToken.username, fd, {
      transformRequest: angular.identity,
      headers: {'Content-Type' : undefined}    
    })
  }

  this.uploadAction = function(file, name){
    var fd = new FormData();
    fd.append('myFileAction', file);
    return $http.post('/uploadAction/' + name, fd, {
      transformRequest: angular.identity,
      headers: {'Content-Type' : undefined}    
    })
  }

  this.uploadKita = function(file){
    var fd = new FormData();
    fd.append('myFileKita', file);
    return $http.post('/uploadKita/' + $rootScope.decodedToken.kitaid, fd, {
      transformRequest: angular.identity,
      headers: {'Content-Type' : undefined}    
    })
  }

});