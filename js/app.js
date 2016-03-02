'use strict';

/* App Module */

angular.module('app', [
  'ngRoute',
  'app.home',
  'app.newProducts',
  'app.saleProducts'
]).config(['$routeProvider', '$httpProvider',
    function ($routeProvider, $httpProvider) {
        //$httpProvider.defaults.withCredentials = true;

        $routeProvider.
            when('/home', {
                templateUrl: '/app/home/home.html',
                controller: 'AppCtrl'
            }).
            when('/new-products', {
                templateUrl: '/app/new-products/new-products.html',
                controller: 'NewProductsCtrl'
            }).
            when('/sale-products', {
                templateUrl: '/app/sale-products/sale-products.html',
                controller: 'SaleProductsCtrl'
            }).
            otherwise({
                redirectTo: '/home'
            });
        }])
        .run(['$rootScope', '$location',
            function ($rootScope, $location) {
                $rootScope.setActive = function (localPath) {
                    return $location.path() === localPath;
                }
            }
        ]);

