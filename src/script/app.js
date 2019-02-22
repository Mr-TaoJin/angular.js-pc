var myApp = angular.module('myApp', [
    'ngRoute',
    'ngDialog',
    // 'ngAnimate',
    // 'ngTouch',
    'myService',
    'myDirective',
    'myFilters',
    // 'ui.calendar',
    // 'color.picker',
    // 'textAngular',
    // 'ngFileUpload',
    // 'angular-echarts',
    'angular-popups',
    // 'draw2d',
    // 'ui.bootstrap',
])
    .controller('IndexMainCtrl', IndexMainCtrl)
    .config(['$routeProvider', '$httpProvider','$locationProvider', function ($routeProvider, $httpProvider,$locationProvider) {

        //路由设置 =================================================
        $routeProvider
            .when('/token', { templateUrl: __config_sys__.src_path + 'html/token/token.html', controller: TokenCtrl})
            .when('/vip', { templateUrl: __config_sys__.src_path + 'html/vip/vip.html', controller: VipCtrl})
            .when('/coupons', { templateUrl: __config_sys__.src_path + 'html/coupons/coupons.html', controller: CouponsCtrl})
            .when('/vip_details', { templateUrl: __config_sys__.src_path + 'html/vip_details/vip_details.html', controller: VipDetailsCtrl})
            .when('/vip_reg', { templateUrl: __config_sys__.src_path + 'html/vip_reg/vip_reg.html', controller: VipRegCtrl})

            .otherwise({ redirectTo: '/token' });

        //HTTP异步设置 =============================================
        $httpProvider.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded;charset=utf-8';
        /**
         * The workhorse; converts an object to x-www-form-urlencoded serialization.
         * @param {Object} obj
         * @return {String}
         */
        var param = function (obj) {
            var query = '', name, value, fullSubName, subName, subValue, innerObj, i;
            for (name in obj) {
                value = obj[name];
                if (value instanceof Array) {
                    for (i = 0; i < value.length; ++i) {
                        subValue = value[i];
                        fullSubName = name + '[' + i + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                }
                else if (value instanceof Object) {
                    for (subName in value) {
                        subValue = value[subName];
                        fullSubName = name + '[' + subName + ']';
                        innerObj = {};
                        innerObj[fullSubName] = subValue;
                        query += param(innerObj) + '&';
                    }
                }
                else if (value !== undefined && value !== null)
                    query += encodeURIComponent(name) + '=' + encodeURIComponent(value) + '&';
            }
            return query.length ? query.substr(0, query.length - 1) : query;
        };

        // Override $http service's default transformRequest
        $httpProvider.defaults.transformRequest = [function (data) {
            return angular.isObject(data) && String(data) !== '[object File]' ? param(data) : data;
        }];
    }
    ]);