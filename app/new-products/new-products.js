'use strict';

angular.module('app.newProducts', ['ngRoute'])

.controller('NewProductsCtrl', ['$scope', '$http', '$rootScope',
    function ($scope, $http, $rootScope) {
        $scope.modelList = [];
        $scope.modelListLoading = true;
        $scope.updateLoading = false;

        $http.get('https://script.google.com/macros/s/AKfycbx5xfsnqZ8ICQHQylIKKo1eABSvrVYIVMvZumVhGfvcJ02nfaus/exec').
            success(function (data, status) {
                $scope.modelList = data.list.reverse();
                for (var i = 0; i < $scope.modelList.length; i++) {
                    $scope.modelList[i].newCount = 0;
                }
                $scope.modelListLoading = false;
            }).finally(function () {
            });

        $scope.updateList = function () {                        

            for (var i = 0; i < $scope.modelList.length; i++) {
                if ($scope.modelList[i].rowType != 'title' && $scope.modelList[i].rowType != 'sub-title') {
                    $scope.modelList[i].count = $scope.modelList[i].count + $scope.modelList[i].newCount;
                    $scope.modelList[i].newCount = 0;
                }                
            }

            //$http.post('https://script.google.com/macros/s/AKfycbx5xfsnqZ8ICQHQylIKKo1eABSvrVYIVMvZumVhGfvcJ02nfaus/exec', JSON.stringify($scope.modelList)).
            //    success(function (data, status) {
            //        $scope.updateLoading = false;
             //   }).error(function () {
            //   });

            //$scope.updateLoading = true;
            $.ajax({
                url: 'https://script.google.com/macros/s/AKfycbx5xfsnqZ8ICQHQylIKKo1eABSvrVYIVMvZumVhGfvcJ02nfaus/exec',
                data: JSON.stringify($scope.modelList),
                dataType: "json",
                type: "POST",
                crossDomain: true,
                beforeSend: function () {
                    //$scope.updateLoading = false;
                },
                success: function (data) {
                    alert('Операция выполнена успешно');
                    //$scope.updateLoading = false;
                },
                error: function (data) {
                    alert('Ошибка! Изменения не сохранены! =(');
                    //$scope.updateLoading = false;
                }
            });
        }

        $scope.addNewItem = function () {
            var model = [
                {
                    //"num": '888',
                    "model": "test",
                    "type": "red",
                    "count": 100
                },
                {
                    //"num": '888',
                    "model": "test2",
                    "type": "green",
                    "count": 200
                }
            ];
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

        //удалить потом
        $scope.addNewItemOLD = function () {
            var model = {
                "model": $scope.new.model,
                "type": $scope.new.type,
                "count": $scope.new.count
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