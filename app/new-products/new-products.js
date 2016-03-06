'use strict';

angular.module('app.newProducts', ['ngRoute'])

.controller('NewProductsCtrl', ['$scope', '$http', '$rootScope',
    function ($scope, $http, $rootScope) {
        $scope.modelList = [];
        $scope.modelListLoading = true;
        $scope.updateLoading = false;
        $scope.updateComingTableLoading = false;
        $scope.isHasNewProductsInfo = false;

        $scope.errorUpdateList = false;         //ошибка обновления наличия товара
        $scope.errorUpdateComingTable = false;  //ошибка обновления послупления товара
        $scope.tryUpdateList = false;           //пытались обновить наличия товара или нет
        $scope.tryUpdateComingTable = false;    //пытались обновить поступление товара или нет

        $scope.comingModel = {
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
                var comingModel = $scope.comingModel;
                for (var i = 0; i < $scope.modelList.length; i++) {

                    //$scope.modelList[i].newCount == undefined ? $scope.modelList[i].newCount = 0 : ''; //for disabled input

                    //всего поступило штук
                    comingModel.allCaseCount = comingModel.allCaseCount + $scope.modelList[i].newCount;

                    //считаем сколько из них apple
                    if ($scope.modelList[i].isApple) {
                        comingModel.appleCaseCount = comingModel.appleCaseCount + $scope.modelList[i].newCount;
                    } else {    //считаем сколько из них других моделей
                        comingModel.otherCaseCount = comingModel.otherCaseCount + $scope.modelList[i].newCount;
                    }
                }
            },
            backToEdit: function () {
                $scope.isHasNewProductsInfo = false;    //возврат к изменению поступления
                $scope.newProducts.resetComingModel();  //сброс информации по приходу
            },
            resetComingModel: function () {
                $scope.comingModel = {
                    'date': Date.now(),
                    'allCaseCount': 0,
                    'appleCaseCount': 0,
                    'otherCaseCount': 0
                }
            },
            addNewComing: function () {
                $scope.newProducts.resetComingModel();  //сброс информации по приходу
                $scope.isHasNewProductsInfo = false;    //снова показываем список моделей
                $scope.tryUpdateList = false;           //пытались обновить наличия товара или нет
                $scope.tryUpdateComingTable = false;    //пытались обновить таблицу поступления или нет               
            }
        }

        $scope.updateList = function () {                        
            $scope.updateLoading = true;
            $scope.tryUpdateList = true; //пытались обновить наличия товара

            if ($scope.tryUpdateList) { //если пытаемся первый раз
                //считаем новые значения, которые будем заносить в наличие
                for (var i = 0; i < $scope.modelList.length; i++) {
                    if ($scope.modelList[i].rowType != 'title' && $scope.modelList[i].rowType != 'sub-title') {
                        $scope.modelList[i].count = $scope.modelList[i].count + $scope.modelList[i].newCount;
                        $scope.modelList[i].newCount = 0;
                    }                
                }
            }            

            $http({
                method: 'POST',
                url: "https://script.google.com/macros/s/AKfycbx5xfsnqZ8ICQHQylIKKo1eABSvrVYIVMvZumVhGfvcJ02nfaus/exec",
                data: JSON.stringify($scope.modelList),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function (data, status) {
                $scope.errorUpdateList = false;         //ошибки нет
                $scope.updateLoading = false;           //стоп лоадинг
                updateComingTable();                    //запись информации о поступлении в таблицу постепления                   
            }).error(function () {
                $scope.errorUpdateList = true;         //ошибка есть
                $scope.updateLoading = false;
            });            
        }

        function updateComingTable() {
            //запись в таблицу поступления
            $scope.updateComingTableLoading = true;
            $scope.tryUpdateComingTable = true;   //пытались обновить таблицу поступления или нет

            $http({
                method: 'POST',
                url: "https://script.google.com/macros/s/AKfycbxYVeEnuGLQM-QxXeWF3emj_9JlpsZ5S_2g_uWWQ6snh0RHUrJD/exec",
                data: JSON.stringify($scope.comingModel),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function (data, status) {
                $scope.updateComingTableLoading = false;
                $scope.errorUpdateComingTable = false;   //ошибки нет
            }).error(function () {
                $scope.updateComingTableLoading = false;
                $scope.errorUpdateComingTable = true;   //ошибка есть
            });
        };

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