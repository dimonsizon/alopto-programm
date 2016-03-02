'use strict';

angular.module('app.saleProducts', ['ngRoute'])

.controller('SaleProductsCtrl', ['$scope', '$http', '$rootScope',
    function ($scope, $http, $rootScope) {
        $scope.modelList = [];

        $http.get('https://script.google.com/macros/s/AKfycbx5xfsnqZ8ICQHQylIKKo1eABSvrVYIVMvZumVhGfvcJ02nfaus/exec').
            success(function (data, status) {
                $scope.modelList = data.list.reverse();
            }).finally(function () {
            });

        $scope.updateList = function () {
            $.ajax({
                url: 'https://script.google.com/macros/s/AKfycbx5xfsnqZ8ICQHQylIKKo1eABSvrVYIVMvZumVhGfvcJ02nfaus/exec',
                data: JSON.stringify($scope.modelList),
                dataType: "json",
                type: "POST",
                crossDomain: true,
                success: function (data) {
                    $scope.new.model = '';
                    $scope.new.type = '';
                    $scope.new.count = '';
                }
            });
        }

        $scope.addNewItem = function () {
            var model = {
                    //"num": '888',
                    "model": "test",
                    "type": "red",
                    "count": 100
                };
            $.ajax({
                url: 'https://script.google.com/macros/s/AKfycbx5xfsnqZ8ICQHQylIKKo1eABSvrVYIVMvZumVhGfvcJ02nfaus/exec',
                data: JSON.stringify(model),
                dataType: "json",
                type: "POST",
                crossDomain: true,
                success: function (data) {
                    $scope.new.model = '';
                    $scope.new.type = '';
                    $scope.new.count = '';
                }
            });
        }
    }]);