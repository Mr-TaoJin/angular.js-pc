var IndexMainCtrl = ['$rootScope', '$scope','ngDialog','api','$location','Popup','$routeParams',
function ($rootScope, $scope,ngDialog,api,$location,Popup,$routeParams) {
    // 全局变量
    $rootScope.vip_deatails_id = '';//查询会员的id
    $rootScope.page_role_parameter = 0; //1 授权  0 为授权
    // $rootScope.vip_deatails_id = 'VIP20180615900386';//查询会员的id
    // $rootScope.vip_deatails_id = 'VIP20180615740385';
    // 查询会员的id  user_code=13761612240&shop_code=01I-000


    // 是否有权限访问
    $scope.page_role = function(){
        api.request('common/third_plugin/third_plugin_operate', {'method':'check_rights'}).then(function (result) {
            if(result.status == 1){
                $rootScope.page_role_parameter = 1;
                return true;
            }else if(result.status == -1){
                Popup.notice('对不起，您没有访问权限');
                ngDialog.close();
                $location.path('/token');
                return false;
            }
        });
    };

    //传给winform 会员卡信息
    $rootScope.pass_to_vip_msg = function(vip_msg){
        var msg = JSON.stringify(vip_msg)
        try{
            window.external.SetVipInfo(msg);
        }catch(err){
            // console.log('抛出错误：'+err)
        }
    }
    //传给winform 优惠券信息
    $rootScope.pass_to_coupons_msg = function(coupons_msg){
        var msg = JSON.stringify(coupons_msg);
        try{
            window.external.SetCouponInfo(msg);
        }catch(err){
            // console.log('抛出错误：'+err)
        }
    }
    //关闭winform框
    $rootScope.close_winform = function(){
        try{
            window.external.ToggleBorwser();
        }catch(err){
            // console.log('抛出错误：'+err)
        }
    }
}];

IndexMainCtrl.$injector = ['$rootScope', '$scope','ngDialog','api','$location','Popup','$routeParams'];