'use strict';

angular.module('app.saleProducts', ['ngRoute'])

.controller('SaleProductsCtrl', ['$scope', '$http', '$rootScope',
    function ($scope, $http, $rootScope) {
        $scope.modelList = [];
        var saleModel = {
            'date': Date.now(),
            'allCaseCount': 0,
            'appleCaseCount': 0,
            'otherCaseCount': 0,
            'sum': 0,
            'persentWrapping': '70, 95',
            'ourProfit': 0
        }


        $http.get('https://script.google.com/macros/s/AKfycbx5xfsnqZ8ICQHQylIKKo1eABSvrVYIVMvZumVhGfvcJ02nfaus/exec').
            success(function (data, status) {
                $scope.modelList = data.list.reverse();
                for (var i = 0; i < $scope.modelList.length; i++) {
                    $scope.modelList[i].saleCount = 0;
                }
            }).finally(function () {
            });

        $scope.updateList = function () {
            for (var i = 0; i < $scope.modelList.length; i++) {
                
                //всего продали штук
                saleModel.allCaseCount = saleModel.allCaseCount + $scope.modelList[i].saleCount; 

                //считаем сколько из них apple
                if ($scope.modelList[i].isApple) {  
                    saleModel.appleCaseCount = saleModel.appleCaseCount + $scope.modelList[i].saleCount;
                } else {    //считаем сколько из них других моделей
                    saleModel.otherCaseCount = saleModel.otherCaseCount + $scope.modelList[i].saleCount;
                }
                //считаем сумму, на которую продали
                //не готово еше =(



                if ($scope.modelList[i].rowType != 'title' && $scope.modelList[i].rowType != 'sub-title') {
                    $scope.modelList[i].count = $scope.modelList[i].count - $scope.modelList[i].saleCount;
                    $scope.modelList[i].saleCount = 0;
                }
                

            }
            calAllSaleData();
            $.ajax({
                url: 'https://script.google.com/macros/s/AKfycbx5xfsnqZ8ICQHQylIKKo1eABSvrVYIVMvZumVhGfvcJ02nfaus/exec',
                data: JSON.stringify($scope.modelList),
                dataType: "json",
                type: "POST",
                crossDomain: true,
                success: function (data) {
                    alert('Операция выполнена успешно');
                },
                error: function (data) {
                    alert('Ошибка! Изменения не сохранены! =(');
                }
            });
        }

        function calAllSaleData() {
            
            

            $.ajax({
                url: 'https://script.google.com/macros/s/AKfycbxrRFcJhgMnNYj51ELQldNdIHzv3YRTJoaA1Dl9qA/exec',
                data: JSON.stringify(saleModel),
                dataType: "json",
                type: "POST",
                crossDomain: true,
                success: function (data) {
                    //alert('Операция выполнена успешно');
                },
                error: function (data) {
                    alert('Ошибка! Изменения не сохранены! =(');
                }
            });
        };


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