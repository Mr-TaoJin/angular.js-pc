var myApp = angular.module('myApp', [
    'ngRoute',
    'ngDialog',
    'myService',
    'myDirective',
    'myFilters',
    'angular-popups',
])
    // 全局控制器
    .controller('IndexMainCtrl', IndexMainCtrl)
    // 导航控制器
    .controller('NavComponentCtrl', NavComponentCtrl)
    .config(['$routeProvider', '$locationProvider', function ($routeProvider) {

        //路由设置 =================================
        $routeProvider
            // 登录
            .when('/login', { templateUrl: __config_sys__.src_path + 'html/login/login.html', controller: LoginCtrl })
            // 首页(订单管理)
            .when('/home', { templateUrl: __config_sys__.src_path + 'html/home/home.html', controller: HomeCtrl })
            // 待开奖详情
            .when('/toTheLotteryDetail/:id', { templateUrl: __config_sys__.src_path + 'html/detail/toTheLotteryDetail.html', controller: toTheLotteryDetailCtrl })
            // 已撤单详情
            .when('/revokeDetail/:id', { templateUrl: __config_sys__.src_path + 'html/detail/revokeDetail.html', controller: revokeDetailCtrl })
            // 已中奖详情
            .when('/winningDetail/:id', { templateUrl: __config_sys__.src_path + 'html/detail/winningDetail.html', controller: winningDetailCtrl })
            // 已中奖详情
            .when('/noWinningDetail/:id', { templateUrl: __config_sys__.src_path + 'html/detail/noWinningDetail.html', controller: noWinningDetailCtrl })
            // 竞足/竞篮详情
            .when('/footballDetaill/:id', { templateUrl: __config_sys__.src_path + 'html/detail/footballDetail.html', controller: footballDetailCtrl })
            //胜负彩详情
            .when('/outcomeDetail/:id', { templateUrl: __config_sys__.src_path + 'html/detail/outcomeDetail.html', controller: outcomeDetailCtrl })
            //任选九详情
            .when('/optionalDetail/:id', { templateUrl: __config_sys__.src_path + 'html/detail/optionalDetail.html', controller: optionalDetailCtrl })
            //大乐透详情
            .when('/superLottoDetail/:id', { templateUrl: __config_sys__.src_path + 'html/detail/superLottoDetail.html', controller: superLottoDetailCtrl })
            //七星彩详情
            .when('/sevenColorDetail/:id', { templateUrl: __config_sys__.src_path + 'html/detail/sevenColorDetail.html', controller: sevenColorDetailCtrl })
            //排列三详情
            .when('/threeArrayDetail/:id', { templateUrl: __config_sys__.src_path + 'html/detail/threeArrayDetail.html', controller: threeArrayDetailCtrl })
            //排列五详情
            .when('/fiveArrayDetail/:id', { templateUrl: __config_sys__.src_path + 'html/detail/fiveArrayDetail.html', controller: fiveArrayDetailCtrl })
            // 预存管理
            .when('/prestore', { templateUrl: __config_sys__.src_path + 'html/prestore/prestore.html', controller: prestoreCtrl })
            .when('/prestoreDetail/:id', { templateUrl: __config_sys__.src_path + 'html/prestore/prestoreDetail.html', controller: prestoreDetailCtrl })
            // 清账管理
            .when('/account', { templateUrl: __config_sys__.src_path + 'html/account/account.html', controller: accountCtrl })
            .when('/accountDetail/:id', { templateUrl: __config_sys__.src_path + 'html/account/accountDetail.html', controller: accountDetailCtrl })
            // 客户管理
            .when('/customer', { templateUrl: __config_sys__.src_path + 'html/customer/customer.html', controller: customerCtrl })
            .when('/customerDetail/:id', { templateUrl: __config_sys__.src_path + 'html/customer/customerDetail.html', controller: customerDetailCtrl })
            // 个人中心
            .when('/center', { templateUrl: __config_sys__.src_path + 'html/center/center.html', controller: centerCtrl })
            // 待开奖详情
            .otherwise({ redirectTo: '/home' });
    }
    ]);