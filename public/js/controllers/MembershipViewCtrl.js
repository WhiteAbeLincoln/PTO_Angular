/**
 * Created by 31160 on 4/16/2015.
 */
angular.module('myApp.controllers')
    .controller('MembershipViewCtrl', ['$scope', function($scope){
        $scope.applications = [
            {firstName:'Abe', lastName:'White', address:'169 Bradstreet Rd'},
            {firstName:'John', lastName:'Snow', address:'169 Bradstreet Rd'},
            {firstName:'Alfred', lastName:'Taylor', address:'169 Bradstreet Rd'},
            {firstName:'Joseph', lastName:'Israel', address:'169 Bradstreet Rd'},
            {firstName:'Brad', lastName:'White', address:'169 Bradstreet Rd'},
            {firstName:'Black', lastName:'White', address:'169 Bradstreet Rd'}
        ]
    }]);