'use strict';

angular.module('app.newProducts', ['ngRoute'])

.controller('NewProductsCtrl', ['$scope', '$http', '$rootScope',
    function ($scope, $http, $rootScope) {
        $scope.modelList = [];
        $scope.modelListLoading = true;
        $scope.updateLoading = false;
        $scope.isHasNewProductsInfo = false;

        $scope.errorUpdateList = false;         //ошибка обновления наличия товара
        $scope.tryUpdateList = false;           //пытались обновить наличия товара или нет

        $scope.saleModel = {
            'date': Date.now(),
            'allCaseCount': 0,
            'appleCaseCount': 0,
            'otherCaseCount': 0
        }

        $http.get('https://script.google.com/macros/s/AKfycbx5xfsnqZ8ICQHQylIKKo1eABSvrVYIVMvZumVhGfvcJ02nfaus/exec').
            success(function (data, status) {
                $scope.modelList = data.list.reverse();
                for (var i = 0; i < $scope.modelList.length; i++) {
                    $scope.modelList[i].newCount = 0;
                }
                $scope.modelListLoading = false;
            }).finally(function () {
            });

        $scope.newProducts = {
            getListInfo: function () {
                $scope.isHasNewProductsInfo = true;         //открыта таблица нового поступления
                $scope.newProducts.getNewProductsCount();   //считаем количество нового поступления
            },
            getNewProductsCount: function () {
                var saleModel = $scope.saleModel;
                for (var i = 0; i < $scope.modelList.length; i++) {

                    //$scope.modelList[i].newCount == undefined ? $scope.modelList[i].newCount = 0 : ''; //for disabled input

                    //всего поступило штук
                    saleModel.allCaseCount = saleModel.allCaseCount + $scope.modelList[i].newCount;

                    //считаем сколько из них apple
                    if ($scope.modelList[i].isApple) {
                        saleModel.appleCaseCount = saleModel.appleCaseCount + $scope.modelList[i].newCount;
                    } else {    //считаем сколько из них других моделей
                        saleModel.otherCaseCount = saleModel.otherCaseCount + $scope.modelList[i].newCount;
                    }
                }
            },
            backToEdit: function () {
                $scope.isHasNewProductsInfo = false;    //возврат к изменению поступления                
            }
        }

        $scope.updateList = function () {                        
            $scope.updateLoading = true;
            $scope.tryUpdateList = true; //пытались обновить наличия товара

            for (var i = 0; i < $scope.modelList.length; i++) {
                if ($scope.modelList[i].rowType != 'title' && $scope.modelList[i].rowType != 'sub-title') {
                    $scope.modelList[i].count = $scope.modelList[i].count + $scope.modelList[i].newCount;
                    $scope.modelList[i].newCount = 0;
                }                
            }

            $http({
                method: 'POST',
                url: "https://script.google.com/macros/s/AKfycbx5xfsnqZ8ICQHQylIKKo1eABSvrVYIVMvZumVhGfvcJ02nfaus/exec",
                data: JSON.stringify($scope.modelList),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function (data, status) {
                alert('Операция выполнена успешно');
                $scope.errorUpdateList = false;         //ошибки нет
                $scope.updateLoading = false;
            }).error(function () {
                alert('Ошибка! Изменения не сохранены! =(');
                $scope.errorUpdateList = true;         //ошибка есть
                $scope.updateLoading = false;
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

    }]);