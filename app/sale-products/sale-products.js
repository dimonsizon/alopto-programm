'use strict';

angular.module('app.saleProducts', ['ngRoute'])

.controller('SaleProductsCtrl', ['$scope', '$http', '$rootScope',
    function ($scope, $http, $rootScope) {
        $scope.modelList = [];
        $scope.currentSale = {};
        $scope.updateLoading = false;
        $scope.updateSalesTableLoading = false;
        $scope.isHasSaleInfo = false; //расчитана продажа или еще нет

        $scope.errorUpdateList = false;         //ошибка обновления наличия товара
        $scope.errorUpdateSalesTable = false;   //ошибка обновления таблицы продаж
        $scope.tryUpdateList = false;         //пытались обновить наличия товара или нет
        $scope.tryrUpdateSalesTable = false;   //пытались обновить таблицу продаж или нет

        $scope.saleModel = {
            'date': Date.now(),
            'allCaseCount': 0,
            'appleCaseCount': 0,
            'otherCaseCount': 0,
            'sum': 0,
            'persentWrapping': '',
            'ourProfit': 0
        }

        //получаем список моделей
        $http.get('https://script.google.com/macros/s/AKfycbx5xfsnqZ8ICQHQylIKKo1eABSvrVYIVMvZumVhGfvcJ02nfaus/exec').
            success(function (data, status) {
                $scope.modelList = data.list.reverse();
                for (var i = 0; i < $scope.modelList.length; i++) {
                    $scope.modelList[i].saleCount = 0;
                }
            }).finally(function () {
            });

        //подсчет всего по продаже
        $scope.currentSale = {
            getSaleInfo: function () {
                $scope.currentSale.getCount();          //считаем количество               
                $scope.currentSale.getPriceForEach();   //считаем цену для каждой позиции позиции
                $scope.currentSale.getSumForEach();     //считаем сумму (руб)
                $scope.isHasSaleInfo = true;            //продажа расчитана
            },
            getCount: function () {
                var saleModel = $scope.saleModel;
                for (var i = 0; i < $scope.modelList.length; i++) {

                    $scope.modelList[i].saleCount == undefined ? $scope.modelList[i].saleCount = 0 : ''; //for disabled input

                    //всего продали штук
                    saleModel.allCaseCount = saleModel.allCaseCount + $scope.modelList[i].saleCount;

                    //считаем сколько из них apple
                    if ($scope.modelList[i].isApple) {
                        saleModel.appleCaseCount = saleModel.appleCaseCount + $scope.modelList[i].saleCount;
                    } else {    //считаем сколько из них других моделей
                        saleModel.otherCaseCount = saleModel.otherCaseCount + $scope.modelList[i].saleCount;
                    }                    
                }
            },
            getPriceForEach: function () {
                var saleModel = $scope.saleModel;
                for (var i = 0; i < $scope.modelList.length; i++) {
                    var item = $scope.modelList[i];
                    switch (true) {
                        case (saleModel.allCaseCount < 100):
                            $scope.modelList[i].currentPrice = item.opt1; //текущая цена за единицу
                            break;
                        case (saleModel.allCaseCount >= 100 && saleModel.allCaseCount < 200):
                            $scope.modelList[i].currentPrice = item.opt2;
                            break;
                        case (saleModel.allCaseCount >= 200 && saleModel.allCaseCount < 500):
                            $scope.modelList[i].currentPrice = item.opt3;
                            break;
                        case (saleModel.allCaseCount >= 500 && saleModel.allCaseCount < 1000):
                            $scope.modelList[i].currentPrice = item.opt4;
                            break;
                        case (saleModel.allCaseCount >= 1000 && saleModel.allCaseCount < 2000):
                            $scope.modelList[i].currentPrice = item.opt5;
                            break;
                        case (saleModel.allCaseCount >= 2000 && saleModel.allCaseCount < 5000):
                            $scope.modelList[i].currentPrice = item.opt6;
                            break;
                        case (saleModel.allCaseCount >= 5000 && saleModel.allCaseCount < 10000):
                            $scope.modelList[i].currentPrice = item.opt7;
                            break;
                        case (saleModel.allCaseCount >= 10000):
                            $scope.modelList[i].currentPrice = item.opt8;
                            break;
                    }
                }                        
            },
            getSumForEach: function () {
                for (var i = 0; i < $scope.modelList.length; i++) {
                    //считаем сумму проданых
                    if ($scope.modelList[i].saleCount > 0) { 
                        $scope.saleModel.sum = $scope.saleModel.sum + ($scope.modelList[i].saleCount * $scope.modelList[i].currentPrice);

                        //считаем чистую прибыль
                        var ourProfit = ($scope.modelList[i].saleCount * $scope.modelList[i].currentPrice) - ($scope.modelList[i].saleCount * $scope.modelList[i].opt0); //продажа - закупка
                        $scope.saleModel.ourProfit = $scope.saleModel.ourProfit + ourProfit;
                    }
                }
            },
            backToEdit: function () {
                $scope.isHasSaleInfo = false;            //возврат к изменению продажи                
                $scope.currentSale.resetSaleModel();    //сброс модели расчетов по текущей продаже
            },
            resetSaleModel: function () {
                $scope.saleModel = {
                    'date': Date.now(),
                    'allCaseCount': 0,
                    'appleCaseCount': 0,
                    'otherCaseCount': 0,
                    'sum': 0,
                    'persentWrapping': '',
                    'ourProfit': 0
                }
            },
            addNewSale: function () {
                $scope.currentSale.resetSaleModel(); //сброс модели расчетов по текущей продаже
                $scope.isHasSaleInfo = false;        //снова показываем список моделей
                $scope.tryUpdateList = false;         //пытались обновить наличия товара или нет
                $scope.tryrUpdateSalesTable = false;   //пытались обновить таблицу продаж или нет
            }
        }

        //обновляем наличие товара
        $scope.updateList = function () {
            $scope.updateLoading = true;
            $scope.tryUpdateList = true; //пытались обновить наличия товара

            
            if ($scope.tryUpdateList) { //если пытаемся первый раз
                //считаем новые значения, которые будем заносить в наличие
                for (var i = 0; i < $scope.modelList.length; i++) {
                    if ($scope.modelList[i].rowType != 'title' && $scope.modelList[i].rowType != 'sub-title') {
                        $scope.modelList[i].count = $scope.modelList[i].count - $scope.modelList[i].saleCount;
                        $scope.modelList[i].saleCount = 0; //очищаем инпуты
                    }
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

                
                updateSalesTable(); //записать все в таблицу продаж

                $scope.updateLoading = false;
                //$scope.isHasSaleInfo = false;
            }).error(function () {
                //alert('Ошибка! Изменения не сохранены! =(');
                $scope.errorUpdateList = true;         //ошибка есть
                $scope.updateLoading = false;
            });
        }       

        function updateSalesTable() {           
            //запись в таблицу продаж
            $scope.updateSalesTableLoading = true;
            $scope.tryrUpdateSalesTable = true;   //пытались обновить таблицу продаж или нет

            $http({
                method: 'POST',
                url: "https://script.google.com/macros/s/AKfycbxrRFcJhgMnNYj51ELQldNdIHzv3YRTJoaA1Dl9qA/exec",
                data: JSON.stringify($scope.saleModel),
                headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
            }).success(function (data, status) {
                $scope.updateSalesTableLoading = false;
                $scope.errorUpdateSalesTable = false;   //ошибки нет
                //сброс модели расчетов по текущей продаже
                //$scope.currentSale.resetSaleModel();
            }).error(function () {
                $scope.updateSalesTableLoading = false;
                $scope.errorUpdateSalesTable = true;   //ошибка есть
            });
        };
    }]);