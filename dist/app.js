var CouponsCtrl = ['$rootScope', '$scope','ngDialog','Popup',
    function ($rootScope, $scope,ngDialog,Popup) {
        $scope.page_role();

        // 优惠券查询
        var open_coupons_query_window_id = 0;
        $scope.open_coupons_query_window=function(){
            open_coupons_query_window_id = ngDialog.open({
                overlay: true,
                disableAnimation: false,
                showClose: false,
                closeByDocument:false,
                width: '430px',
                template: __config_sys__.src_path+'html/coupons/coupons_query_window.html',
                scope: $scope,
                controller: ['$scope','api','Popup','valid', function ($scope,api,Popup,valid) {
                    var data = {
                        'search_data':{}
                    }
                    $scope.data = data;


                    $scope.check_coupons = function(){
                        var ret = {};//验证的字段
                        var check_data = [];
                        if(!$scope.data.search_data.tel && !$scope.data.search_data.coupon_code){
                            check_data.push(
                                {'key': 'tel', 'valid': 'check_required', 'data': $scope.data.search_data.tel, 'tip': '两者选一必填'},
                                {'key': 'coupon_code', 'valid': 'check_required', 'data': $scope.data.search_data.coupon_code, 'tip': '两者选一必填'}
                            )
                        }
                        if($scope.data.search_data.tel){
                            if(!valid.check_mobile($scope.data.search_data.tel)){
                                Popup.notice('请输入合法的手机号')
                                return;
                            }
                        }
                        ret = valid.check(check_data);
                        $scope.valid = ret.data;
                        if (!ret.status) {return;}

                        $scope.data.search_data.is_use = 0;
                        $scope.data.search_data.is_cancel = 0;
                        api.request('common/third_plugin/third_plugin_operate', {'method':'get_coupon_list','search_data':$scope.data.search_data}).then(function (result) {
                            if(result.status == 1){
                                if(result.data.data.length == 0 || result.data.data == []){
                                    $scope.open_coupons_query_msg_window();
                                }else if(Object.keys(result.data.data).length>0){
                                    $scope.open_coupons_query_usable_window(result.data);
                                }
                                ngDialog.close(open_coupons_query_window_id.id);
                            }
                        });
                    };
                    //判断回车键查询
                    $scope.key_press = function(e){
                        if (typeof e != 'undefined' && e.keyCode != 13) {
                            return;
                        } else {
                            $scope.check_coupons();
                        }
                    };
                    // 关闭弹框
                    $scope.ngDialog_close = function(){
                        ngDialog.close(open_coupons_query_window_id.id)
                        $rootScope.close_winform();
                    }
                }]
            });
        }
        $scope.open_coupons_query_window();

        // 优惠券查询-可用
        var open_coupons_query_usable_window_id = 0;
        $scope.open_coupons_query_usable_window=function(v){
        open_coupons_query_usable_window_id = ngDialog.open({
            overlay: true,
            disableAnimation: false,
            showClose: false,
            closeByDocument:false,
            width: '720px',
            template: __config_sys__.src_path+'html/coupons/coupons_query_usable_window.html',
            scope: $scope,
            controller: ['$scope','api', function ($scope,api) {
                var data = {
                    'form_data':{
                        'list_data':[],
                        'page_data':{}
                    },
                    'vip_data':[]
                }
                $scope.data = data;
                $scope.data.form_data.list_data = v.data;
                $scope.selected = [];
                $scope.data.form_data.list_data.forEach(function(v){
                    v.selected = '';
                });
                //选中
                var coupons_msg = [];
                $scope.selected_ed = function(value){
                    if(coupons_msg.indexOf(value) == -1){
                        coupons_msg.push(value);
                        value.selected = 'check';
                    }else{
                        coupons_msg.splice(coupons_msg.indexOf(value), 1);
                        value.selected = '';
                    }
                };
                //立即使用
                $scope.coupons_use = function(){
                    if(coupons_msg.length>0 || Object.keys(coupons_msg).length>0){
                        $rootScope.pass_to_coupons_msg(coupons_msg);
                        Popup.notice('操作成功')
                    }else{
                        Popup.notice('请选择优惠券')
                    }
                };


                // 返回
                $scope.ngDialog_close = function(){
                    ngDialog.close(open_coupons_query_usable_window_id.id)
                    $rootScope.close_winform();
                }
            }]
        });
        }


        // 优惠券查询-不可用
        var open_coupons_query_msg_window_id = 0;
        $scope.open_coupons_query_msg_window=function(){
            open_coupons_query_msg_window_id = ngDialog.open({
                overlay: true,
                disableAnimation: false,
                showClose: false,
                closeByDocument:false,
                width: '430px',
                template: __config_sys__.src_path+'html/coupons/coupons_query_msg_window.html',
                scope: $scope,
                controller: ['$scope', function ($scope) {
                    //继续查询
                    $scope.go_to_coupons_query = function(){
                        ngDialog.close(open_coupons_query_msg_window_id.id);
                        $scope.open_coupons_query_window();
                    };
                    // 关闭弹框
                    $scope.ngDialog_close = function(){
                        ngDialog.close(open_coupons_query_msg_window_id.id);
                        $rootScope.close_winform();
                    };
                }]
            });
        }
    }];

CouponsCtrl.$injector = ['$rootScope', '$scope','ngDialog','Popup'];
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
var TokenCtrl = ['$rootScope', '$scope',
function ($rootScope, $scope) {

}];

TokenCtrl.$injector = ['$rootScope', '$scope'];
var VipCtrl = ['$rootScope', '$scope','ngDialog','$location','Popup',
    function ($rootScope, $scope,ngDialog,$location,Popup) {
        $scope.page_role()

        // 会员查询
        var open_vip_query_window_id = 0;
        $scope.open_vip_query_window=function(){
            open_vip_query_window_id = ngDialog.open({
                overlay: true,
                disableAnimation: false,
                showClose: false,
                closeByDocument:false,
                width: '430px',
                template: __config_sys__.src_path+'html/vip/vip_query_window.html',
                scope: $scope,
                controller: ['$scope','api','valid','Popup', function ($scope,api,valid,Popup) {
                    var data = {
                        'search_data':{}
                    }
                    $scope.data = data;


                    $scope.check_vip = function(){
                        var ret = {};//验证的字段
                        var check_data = [];
                        if(!$scope.data.search_data.tel_num && !$scope.data.search_data.vip_code){
                            check_data.push(
                                {'key': 'tel_num', 'valid': 'check_required', 'data': $scope.data.search_data.tel_num, 'tip': '两者选一必填'},
                                {'key': 'vip_code', 'valid': 'check_required', 'data': $scope.data.search_data.vip_code, 'tip': '两者选一必填'}
                                )
                        }
                        if($scope.data.search_data.tel_num){
                            if(!valid.check_mobile($scope.data.search_data.tel_num)){
                                Popup.notice('请输入合法的手机号')
                                return;
                            }
                        }
                        ret = valid.check(check_data);
                        $scope.valid = ret.data;
                        if (!ret.status) {return;}
                        api.request('common/third_plugin/third_plugin_operate', {'method':'customer_list','search_data':$scope.data.search_data}).then(function (result) {
                            if(result.status == 1){
                                if(result.data.length == 0 || result.data == []){
                                    $scope.open_vip_query_no_window();
                                }else if(Object.keys(result.data).length>0){
                                    $scope.open_vip_query_yes_window(result.data);
                                }
                                ngDialog.close(open_vip_query_window_id.id);
                            }
                        });
                    };
                    //判断回车键查询
                    $scope.key_press = function(e){
                        if (typeof e != 'undefined' && e.keyCode != 13) {
                            return;
                        } else {
                            $scope.check_vip();
                        }
                    };
                    // 关闭弹框
                    $scope.ngDialog_close = function(){
                        ngDialog.close(open_vip_query_window_id.id);
                        $rootScope.close_winform();
                    }
                }]
            });
        };
        $scope.open_vip_query_window();

        // 会员查询-无
        var open_vip_query_no_window_id = 0;
        $scope.open_vip_query_no_window=function(){
            open_vip_query_no_window_id = ngDialog.open({
                overlay: true,
                disableAnimation: false,
                showClose: false,
                closeByDocument:false,
                width: '430px',
                template: __config_sys__.src_path+'html/vip/vip_query_no_window.html',
                scope: $scope,
                controller: ['$scope', function ($scope) {
                    // 注册
                    $scope.go_to_reg = function(){
                        ngDialog.close(open_vip_query_no_window_id.id);
                        $location.path('/vip_reg');
                    };
                    // 返回
                    $scope.go_to_query = function(){
                        ngDialog.close(open_vip_query_no_window_id.id);
                        $scope.open_vip_query_window();
                    };
                    // 关闭弹框
                    $scope.ngDialog_close = function(){
                        ngDialog.close(open_vip_query_no_window_id.id);
                        $rootScope.close_winform();
                    }
                }]
            });
        };


        // 会员查詢-成功
        var open_vip_query_yes_window_id = 0;
        $scope.open_vip_query_yes_window=function(v){
            open_vip_query_yes_window_id = ngDialog.open({
                overlay: true,
                disableAnimation: false,
                showClose: false,
                closeByDocument:false,
                width: '560px',
                template: __config_sys__.src_path+'html/vip/vip_query_yes_window.html',
                scope: $scope,
                controller: ['$scope','api','Popup','$location', function ($scope,api,Popup,$location) {
                    var data = {
                        'search_data':{},
                        'form_data':{},
                        'vip_data':[]
                    };
                    $scope.data = data;
                    $scope.data.vip_data.push(v);

                    $scope.vip_details = function(id){
                        if(id){
                            $rootScope.vip_deatails_id = id;
                            ngDialog.close(open_vip_query_yes_window_id.id)
                            $location.path('/vip_details');
                        }else{
                            Popup.notice('缺少vip_code_unique')
                        }
                    };
                    //立即使用
                    $scope.vip_use = function(id){
                        // 页面详情
                        api.request('common/third_plugin/third_plugin_operate', {'method':'vip_detail','id':id}).then(function (ret) {
                            if(ret.status == 1){
                                $scope.data.form_data = ret.data;
                                if(Object.keys($scope.data.form_data).length>0 || $scope.data.form_data.length>0){
                                    $rootScope.pass_to_vip_msg($scope.data.form_data);
                                    Popup.notice('操作成功')
                                }else{
                                    Popup.notice('暂无会员信息~')
                                }
                            }
                        });
                    };

                    // 关闭弹框
                    $scope.ngDialog_close = function(){
                        ngDialog.close(open_vip_query_yes_window_id.id);
                        $rootScope.close_winform();
                    }
                }]
            });
        };

    }];

VipCtrl.$injector = ['$rootScope', '$scope','ngDialog','$location','Popup'];
var VipDetailsCtrl = ['$rootScope', '$scope','ngDialog','Popup','api','$location',
    function ($rootScope, $scope,ngDialog,Popup,api,$location) {
        $scope.page_role();

        var data ={
            'form_data':{},
            'search_data':{},
            'tab':1,
            'consume_list_data':{
                'list_data': [],
                'page_data': {},
                'search_data':{}
            },  //消费流水
            'consume_detail_data':{
                'list_data': [],
                'page_data': {},
                'search_data':{}
            },  //消费明细数据
            'integral_detail_data':{
                'list_data': [],
                'page_data': {},
                'search_data':{}
            },	//积分流水数据
            'vip_coupon_list_data':{
                'list_data': [],
                'page_data': {},
                'search_data':{}
            }, //优惠券
        }
        $scope.data = data;

        // 页面详情
        $scope.get_vip_details = function(id){
            api.request('common/third_plugin/third_plugin_operate', {'method':'vip_detail','id':id}).then(function (ret) {
                if(ret.status == 1){
                    $scope.data.form_data = ret.data;

                    if(ret.data.customer_sex == '保密'){
                        $scope.data.form_data.customer_sex = '0';
                    }else if(ret.data.customer_sex == '男'){
                        $scope.data.form_data.customer_sex = '1';
                    }else if(ret.data.customer_sex == '女'){
                        $scope.data.form_data.customer_sex = '2';
                    }


                    $scope.data.consume_detail_data.search_data.vip_code= ret.data.vip_code;
                    $scope.data.consume_detail_data.search_data.series_code = ret.data.series_code;
                    $scope.data.consume_detail_data.search_data.source = ret.data.source;
                    $scope.data.consume_detail_data.search_data.vip_id = ret.data.vip_id;
                    $scope.data.consume_detail_data.search_data.vip_code_unique = ret.data.vip_code_unique;

                    $scope.get_consume_list_search();
                }
            });
        };




        //获取消费流水
        $scope.get_consume_list_search = function () {
            api.request('common/third_plugin/third_plugin_operate', { 'method':'get_consume_list','search_data': $scope.data.consume_detail_data.search_data, 'page_data': $scope.data.consume_list_data.page_data }).then(function (result) {
                if(result.status==1){
                    $scope.data.consume_list_data.list_data = result.data.data;
                    $scope.data.consume_list_data.page_data = result.data.page_data;
                }
            });
        };
        //获取消费明细
        $scope.get_consume_detail_list = function () {
            api.request('common/third_plugin/third_plugin_operate', { 'method':'get_consume_detail_list','search_data': $scope.data.consume_detail_data.search_data, 'page_data': $scope.data.consume_detail_data.page_data }).then(function (result) {
                if(result.status==1){
                    $scope.data.consume_detail_data.list_data = result.data.data;
                    $scope.data.consume_detail_data.page_data = result.data.page_data;
                }
            });
        };
        //获取积分流水
        $scope.get_integral_detail_search = function () {
            api.request('common/third_plugin/third_plugin_operate', { 'method':'get_integral_detail_list','search_data': $scope.data.consume_detail_data.search_data, 'page_data': $scope.data.integral_detail_data.page_data }).then(function (result) {
                if(result.status==1){
                    $scope.data.integral_detail_data.list_data = result.data.data;
                    $scope.data.integral_detail_data.page_data = result.data.page_data;
                }
            });
        };
        //优惠券
        $scope.get_vip_coupon_list = function () {
            api.request('common/third_plugin/third_plugin_operate', { 'method':'get_customer_coupon_list' ,'search_data': $scope.data.consume_detail_data.search_data,'page_data': $scope.data.vip_coupon_list_data.page_data ,}).then(function (result) {
                if(result.status==1){
                    $scope.data.vip_coupon_list_data.list_data = result.data.data;
                    $scope.data.vip_coupon_list_data.page_data = result.data.page_data;
                }
            });
        }
        //Tab页签切换
        $scope.tab_switch = function (n) {
            $scope.data.tab = n;
            if ($scope.data.tab == 1 && ($scope.data.consume_list_data.list_data == undefined || $scope.data.consume_list_data.list_data.length == 0)) {
                $scope.get_consume_list_search();
            }
            if ($scope.data.tab == 2 && ($scope.data.consume_detail_data.list_data == undefined || $scope.data.consume_detail_data.list_data.length == 0)) {
                $scope.get_consume_detail_list();
            }
            if ($scope.data.tab == 3 && ($scope.data.integral_detail_data.list_data == undefined || $scope.data.integral_detail_data.list_data.length == 0)) {
                $scope.get_integral_detail_search();
            }
            if ($scope.data.tab == 4 && ($scope.data.vip_coupon_list_data.list_data == undefined || $scope.data.vip_coupon_list_data.list_data.length == 0)) {
                $scope.get_vip_coupon_list();
            }
        };


        // 会员详情
        var open_vip_query_details_window_id = 0;
        $scope.open_vip_query_details_window=function(){
            open_vip_query_details_window_id = ngDialog.open({
                overlay: true,
                disableAnimation: false,
                showClose: false,
                closeByDocument:false,
                width: '1152px',
                template: __config_sys__.src_path+'html/vip_details/vip_query_details_window.html',
                scope: $scope,
                controller: ['$scope','api','Popup','valid', function ($scope,api,Popup,valid) {

                    //立即使用
                    $scope.vip_use = function(){
                        if(Object.keys($scope.data.form_data).length>0 || $scope.data.form_data.length>0){
                            $rootScope.pass_to_vip_msg($scope.data.form_data);
                            Popup.notice('操作成功')
                        }else{
                            Popup.notice('暂无会员信息~')
                        }
                    };
                    // 保存
                    $scope.form_save = function(){
                        var undata_data = {
                            'customer_code':$scope.data.form_data.customer_code?$scope.data.form_data.customer_code:'',
                            'customer_name':$scope.data.form_data.customer_name?$scope.data.form_data.customer_name:'',
                            'customer_sex':$scope.data.form_data.customer_sex?$scope.data.form_data.customer_sex:'',
                            'birthday':$scope.data.form_data.birthday,
                            'customer_tel':$scope.data.form_data.tel?$scope.data.form_data.tel:''
                        };
                        if(undata_data.customer_tel != ''){
                            if(!valid.check_mobile(undata_data.customer_tel)){
                                Popup.notice('请输入正确的手机号')
                                return;
                            }
                        }
                        api.request('common/third_plugin/third_plugin_operate', { 'method':'update_tel_etc','form_data': undata_data }).then(function (result) {
                            if(result.status==1){
                                ngDialog.close(open_vip_query_details_window_id.id);
                                $scope.open_vip_query_msg_window(result.message);
                            }
                        });
                    };
                    // 关闭弹框
                    $scope.ngDialog_close = function(){
                        ngDialog.close(open_vip_query_details_window_id.id);
                        $rootScope.close_winform();
                    }
                }]
            });
        };



        // 会员信息修改
        var open_vip_query_msg_window_id = 0;
        $scope.open_vip_query_msg_window=function(v){
            open_vip_query_msg_window_id = ngDialog.open({
                overlay: true,
                disableAnimation: false,
                showClose: false,
                closeByDocument:false,
                width: '430px',
                template: __config_sys__.src_path+'html/vip_details/vip_query_msg_window.html',
                scope: $scope,
                controller: ['$scope', function ($scope) {
                    $scope.back_msg = v;
                    // 返回详情
                    $scope.go_back_details = function(){
                        ngDialog.close(open_vip_query_msg_window_id.id);
                        $scope.open_vip_query_details_window();
                        $scope.get_vip_details($rootScope.vip_deatails_id);
                    };
                    // 关闭弹框
                    $scope.ngDialog_close = function(){
                        ngDialog.close(open_vip_query_msg_window_id.id);
                        $rootScope.close_winform();
                    }
                }]
            });
        };

        if($rootScope.vip_deatails_id){
            ngDialog.close();
            $scope.get_vip_details($rootScope.vip_deatails_id);
            $scope.open_vip_query_details_window($rootScope.vip_deatails_data);
        }else{
            Popup.notice('缺少查询id')
        }

    }];

VipDetailsCtrl.$injector = ['$rootScope', '$scope','ngDialog','Popup','api','$location'];
var VipRegCtrl = ['$rootScope', '$scope','ngDialog','Popup','api','$routeParams',
    function ($rootScope, $scope,ngDialog,Popup,api,$routeParams) {
        $scope.page_role();

        var data = {
            'brand_options':[],
            'form_data':{}
        };
        $scope.data = data;

        // 获取注册品牌
        $scope.get_brand_code_and_name = function(){
            api.request('common/third_plugin/third_plugin_operate', {'method':'get_brand_code_and_name'}).then(function (result) {
                if(result.status == 1){
                    $scope.data.brand_options = result.data.data;
                }
            });
        };
        $scope.get_brand_code_and_name();

        // 会员注册
        var open_vip_query_reg_window_id = 0;
        $scope.open_vip_query_reg_window=function(){
            open_vip_query_reg_window_id = ngDialog.open({
                overlay: true,
                disableAnimation: false,
                showClose: false,
                closeByDocument:false,
                width: '780px',
                template: __config_sys__.src_path+'html/vip_reg/vip_query_reg_window.html',
                scope: $scope,
                controller: ['$scope','api','valid', function ($scope,api,valid) {

                    //注册
                    $scope.vip_reg = function(){
                        var ret = {};//验证的字段
                        var check_data = [
                            {'key': 'customer_name', 'valid': 'check_required', 'data': $scope.data.form_data.customer_name, 'tip': '必填项'},
                            {'key': 'customer_sex', 'valid': 'check_integer', 'data': $scope.data.form_data.customer_sex, 'tip': '必填项'},
                            {'key': 'birthday', 'valid': 'check_required', 'data': $scope.data.form_data.birthday, 'tip': '必填项'},
                            {'key': 'tel', 'valid': 'check_required', 'data': $scope.data.form_data.tel, 'tip': '必填项'},
                            {'key': 'brand', 'valid': 'check_required', 'data': $scope.data.form_data.brand, 'tip': '必填项'}
                        ];
                        if($scope.data.form_data.customer_tel){
                            if(!valid.check_mobile($scope.data.form_data.customer_tel)){
                                Popup.notice('请输入合法的手机号');
                                return;
                            }
                        }
                        if( $scope.data.form_data.customer_name){
                            if(!valid.check_character( $scope.data.form_data.customer_name)){
                                Popup.notice('姓名带有非法字符');
                                return;
                            }
                        }
                        ret = valid.check(check_data);
                        $scope.valid = ret.data;
                        if (!ret.status) {return;}
                        $scope.data.form_data.shop_code = $routeParams.shop_code;

                        api.request('common/third_plugin/third_plugin_operate', {'method':'register_vip','form_data':$scope.data.form_data}).then(function (result) {
                            if(result.status == 1){
                                ngDialog.close(open_vip_query_reg_window_id.id);
                                $scope.open_vip_query_reg_success_window();
                            }
                        });
                    };

                    // 关闭弹框
                    $scope.ngDialog_close = function(){
                        ngDialog.close(open_vip_query_reg_window_id.id);
                        $rootScope.close_winform();
                    }
                }]
            });
        };
        $scope.open_vip_query_reg_window();

        // 会员注册-成功
        var open_vip_query_reg_success_window_id = 0;
        $scope.open_vip_query_reg_success_window=function(){
            open_vip_query_reg_success_window_id = ngDialog.open({
                overlay: true,
                disableAnimation: false,
                showClose: false,
                closeByDocument:false,
                width: '430px',
                template: __config_sys__.src_path+'html/vip_reg/vip_query_reg_success_window.html',
                scope: $scope,
                controller: ['$scope','$location', function ($scope,$location) {

                    // 查询
                    $scope.go_to_query = function(){
                        ngDialog.close();
                        $location.path('/vip')
                    };
                    // 关闭弹框
                    $scope.ngDialog_close = function(){
                        ngDialog.close(open_vip_query_reg_success_window_id.id)
                        $rootScope.close_winform();
                    }
                }]
            });
        };
    }];

VipRegCtrl.$injector = ['$rootScope', '$scope','ngDialog','Popup','api'];
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
var myDirective = angular.module("myDirective", []);
angular.module('myFilters', [])
    .filter('orderObjectBy', function () {
        return function (items, field, reverse) {
            var filtered = [];
            angular.forEach(items, function (item) {
                filtered.push(item);
            });
            filtered.sort(function (a, b) {
                return (a[field] > b[field] ? 1 : -1);
            });
            if (reverse)
                filtered.reverse();
            return filtered;
        };
    })
    .filter('checkmark', function () {
        return function (input) {
            return (input===true||input==='true'||input===1||input==='1') ? '\u2713' : '\u2718';
        };
    }) 
    .filter('resolvetypemark', function () {
    	return function (input) {
			if(input=='0' || input==0){
				return '未处理';
			}else if(input=='-1' || input==-1){
				return '问题单';
			}else if(input=='1' || input==1){
				return '处理成功';
			}else{
				return '';
			}
        };
    })
    //会员状态
    .filter('vipstatusmark', function () {
        return function (input) {
            if (input == '0' || input == 0) {
                return '未激活';
            } else if (input == '1' || input == 1) {
                return '激活';
            } else if (input == '2' || input == 2) {
                return '停用';
            } else if (input == '3' || input == 3) {
                return '挂失';
            }
        };
    })
    .filter('sourcemark', function () {
        return function (input) {
            if (input == 1 || input == '1') {
                return 'erp';
            } else if (input == 6 || input == '6') {
                return 'pos';
            } else if (input == 7 || input == '7') {
                return '百胜icrm';
            } else if (input == 8 || input == '8') {
                return 'e3后台';
            } else if (input == 9 || input == '9') {
                return '淘宝';
            } else if (input == 10 || input == '10') {
                return '拍拍';
            } else if (input == 11 || input == '11') {
                return 'openshop';
            } else if (input == 12 || input == '12') {
                return '分销商';
            } else if (input == 13 || input == '13') {
                return '京东';
            } else if (input == 14 || input == '14') {
                return '亚马逊';
            } else if (input == 15 || input == '15') {
                return 'QQ网购';
            } else if (input == 16 || input == '16') {
                return '一号店';
            } else if (input == 17 || input == '17') {
                return 'eBay';
            } else if (input == 18 || input == '18') {
                return '网络分销主站';
            } else if (input == 19 || input == '19') {
                return '淘宝分销';
            } else if (input == 20 || input == '20') {
                return '新浪';
            } else if (input == 21 || input == '21') {
                return 'shopex';
            } else if (input == 22 || input == '22') {
                return 'ecshop';
            } else if (input == 23 || input == '23') {
                return '当当';
            } else if (input == 24 || input == '24') {
                return '邮乐';
            } else if (input == 25 || input == '25') {
                return '乐酷天';
            } else if (input == 26 || input == '26') {
                return 'shopex分销王';
            } else if (input == 27 || input == '27') {
                return 'vjia';
            } else if (input == 28 || input == '28') {
                return '优购';
            } else if (input == 29 || input == '29') {
                return 'efast';
            } else if (input == 30 || input == '30') {
                return '微购物';
            } else if (input == 31 || input == '31') {
                return '微信';
            } else if (input == 32 || input == '32') {
                return '苏宁';
            } else if (input == 33 || input == '33') {
                return '唯品会';
            } else if (input == 34 || input == '34') {
                return '聚美优品';
            } else if (input == 35 || input == '35') {
                return '卖网';
            } else if (input == 36 || input == '36') {
                return '库巴';
            } else if (input == 37 || input == '37') {
                return '名鞋库';
            } else if (input == 38 || input == '38') {
                return '阿里巴巴';
            } else if (input == 39 || input == '39') {
                return '口袋通';
            } else if (input == 40 || input == '40') {
                return '工行';
            } else if (input == 41 || input == '41') {
                return '银泰';
            } else if (input == 42 || input == '42') {
                return '走秀网';
            } else if (input == 43 || input == '43') {
                return '贝贝网';
            } else if (input == 44 || input == '44') {
                return '蘑菇街';
            } else if (input == 45 || input == '45') {
                return '拍鞋网';
            } else if (input == 46 || input == '46') {
                return '好乐买';
            } else if (input == 47 || input == '47') {
                return '乐蜂';
            } else if (input == 48 || input == '48') {
                return '微盟';
            } else if (input == 49 || input == '49') {
                return '折800';
            } else if (input == 50 || input == '50') {
                return 'OS主站';
            } else if (input == 51 || input == '51') {
                return 'API接口';
            } else if (input == 52 || input == '52') {
                return 'ncm';
            } else if (input == 53 || input == '53') {
                return 'BSERP2';
            } else if (input == 54 || input == '54') {
                return 'BS3000+';
            } else if (input == 55 || input == '55') {
                return '第三方仓储物流';
            } else if (input == 56 || input == '56') {
                return '唯品会JIT';
            } else if (input == 57 || input == '57') {
                return 'ISHOP';
            } else if (input == 58 || input == '58') {
                return '飞牛';
            } else if (input == 59 || input == '59') {
                return '蜜芽';
            } else if (input == 60 || input == '60') {
                return '百度mall接口';
            } else if (input == 61 || input == '61') {
                return '三足接口';
            } else if (input == 62 || input == '62') {
                return '移动pos';
            } else if (input == 63 || input == '63') {
                return 'M6';
            } else if (input == 65 || input == '65') {
                return '速卖通';
            } else if (input == 66 || input == '66') {
                return '明星衣橱';
            } else if (input == 67 || input == '67') {
                return '百胜E3';
            } else if (input == 68 || input == '68') {
                return '润和pos';
            } else if (input == 69 || input == '69') {
                return '内部员工';
            } else if (input == 70 || input == '70') {
                return 'PC门户';
            } else if (input == 71 || input == '71') {
                return '雅瑞POS';
            } else if (input == 72 || input == '72') {
                return 'SMS系统';
            } else if (input == 73 || input == '73') {
                return '巅峰呼叫中心';
            } else if (input == 74 || input == '74') {
                return '会员通';
            } else if (input == 78 || input == '78') {
                return '衣全球商城';
            } else if (input == 9000 || input == '9000') {
                return '错误来源';
            } else {
                return '';
            }
        };
    })
    //保留2位小数
    .filter('formatmoneymark', function () {
        return function (input) {
            if (input == undefined) {
                return '0.00';
            } else {
                return Number(input).toFixed(2);
            }

        };
    })
    //保留3位小数
    .filter('formatmoney3mark', function () {
        return function (input) {
            if (input == undefined) {
                return '0.000';
            } else {
                return Number(input).toFixed(3);
            }

        };
    })
    .filter('createtypemark', function () {
        return function (input) {
            if (input == 0 || input == '0') {
                return '消费';
            } else if (input == 1 || input == '1') {
                return '调整';
            } else if (input == 2 || input == '2') {
                return '活动';
            } else if (input == 3 || input == '3') {
                return '兑换';
            } else if (input == 4 || input == '4') {
                return '积分抵现';
            } else if (input == 5 || input == '5') {
                return '顾客充值送';
            } else if (input == 6 || input == '6') {
                return '过期清零';
            } else if (input == 7 || input == '7') {
                return '积分变现';
            } else if (input == 8 || input == '8') {
                return '停卡';
            } else if (input == 10 || input == '10') {
                return '其他';
            } else if (input == 12 || input == '12') {
                return '积分签到';
            } else if (input == 13 || input == '13') {
                return '推荐送';
            } else if (input == 14 || input == '14') {
                return '完善顾客资料送积分';
            } else if (input == 15 || input == '15') {
                return '开卡送';
            } else if (input == 16 || input == '16') {
                return '微信注册';
            } else if (input == 17 || input == '17') {
                return '评价送';
            } else if (input == 18 || input == '18') {
                return '调查问卷送';
            } else if (input == 19 || input == '19') {
                return '过期恢复积分';
            }
        };
    })
    //积分有效期
    .filter('checkexpdate', function () {
        return function (input) {
            if (input == '0000-00-00 00:00:00' || input == '' || input == null || input == 'null') {
                return '永久有效';
            } else {
                return input;
            }
        };
    })
    //优惠券类型
    .filter('coupontypemark', function () {
        return function (input) {
            if (input == 4 || input == '4') {
                return '现金券';
            } else if (input == 0 || input == '0') {
                return '折扣券';
            } else if (input == 1 || input == '1') {
                return '折扣券';
            } else if (input == 2 || input == '2') {
                return '赠券';
            } else if (input == 3 || input == '3') {
                return '随机金额券';
            } else if (input == 5 || input == '5') {
                return '代金券';
            } else if (input == 6 || input == '6') {
                return '整单折扣券';
            } else if (input == 7 || input == '7') {
                return '单品折扣券';
            } else if (input == 8 || input == '8') {
                return '礼品券';
            } else if (input == 9 || input == '9') {
                return '免运费券';
            } else if (input == 11 || input == '11') {
                return '抵用券';
            }
        };
    })
    //折扣
    .filter('couponrebate',function(){
        return function(input){
            if (input == 0.000) {
                return '0.0';
            } else {
                return Number(input).toFixed(1);
            }
        }
    })
angular.module('myService', [])
    .factory('api', ['$rootScope', '$http', '$location', '$q', 'Popup','$routeParams','ngDialog',
        function ($rootScope, $http, $location, $q, Popup,$routeParams,ngDialog) {
            //本地文件配置
            var request_demo = function (api_name, api_parm) {
                var post_url = "../api_demo/" + api_name + ".json";
                return $http.get(post_url, api_parm).then(function (ret) {
                    if (ret.data.status == 1) {
                        return ret.data;
                    } else {
                        // Popup.notice(ret.data.message);
                        return false;  //ret.data;
                    }
                }).catch(function (ret) {
                    // Popup.notice('网络访问失败');
                    return false;
                });
            };

            //生成sign
            var create_sign = function (api_name, param) {
                var key = 'baison';
                var secret = "123456";
                var act = api_name.replace(/\//g, "");//去除/
                act = act.replace(/(^\s*)|(\s*$)/g, "");//字符串左右去除空格
                var sign = key + act;
                // var sign_params={
                //     'timestamp':param.timestamp,
                //     'user_info':param.user_info
                // };
                //baisonsysuserget_listtimestamp1499915374user_id1user_codeadmin
                //追加其他参数
                param = $util.ksort(param);
                if (Object.keys(param).length != 0) {
                    for (var i in param) {
                        if (i != 'sign') {
                            if (angular.isObject(param[i])) {
                                for (var k in param[i]) {
                                    if (angular.isObject(param[i][k])) {
                                        continue;
                                    }
                                    if (param[i][k] != undefined) {
                                        sign += k + param[i][k];
                                    }
                                }
                            } else {
                                if (param[i] != undefined) {
                                    sign += i + param[i];
                                }
                            }
                        }
                    }
                }

                sign = $.md5(secret + sign + secret);
                return sign;
            }

            //线上配置
            //请求接口方法
            /**
             * api_name 接口名称 例如 base/customer/get_list
             * api_parm 请求参数 例如 {'search_data': {'code': '001', 'status': 1}}
             * http_parm http参数 例如 {'responseType': 'arraybuffer'}
             */
            var request = function (api_name, api_parm, http_parm) {
                var post_url = __config_sys__.api_path + '?app_act=' + api_name;


                //提交请求时附加上当前操作人信息
                if (api_parm) {
                    api_parm.user_info = {
                        // user_code: '13761612240',
                        // shop_code: '01I-000'
                        user_code: $routeParams.user_code,
                        shop_code: $routeParams.shop_code
                    }
                    //安全测试提交请求增加时间戳
                    var timestamp = Date.parse(new Date()) / 1000;
                    api_parm.timestamp = timestamp;
                    api_parm.sign = create_sign(api_name, api_parm);
                }
                //分页没有传num参数的处理
                if (api_parm.page_data) {
                    if (!api_parm.page_data.num) {
                        api_parm.page_data.num = 15;
                        // api_parm.page_data.count = 0;
                        // api_parm.page_data.countPage = 0;
                        // api_parm.page_data.pageNum = 0;
                    }
                }
                return $http.post(post_url, api_parm, http_parm).then(function (ret) {
                    if(ret.data.status == 1){
                        return ret.data;
                    }else if(ret.data.status == -1){
                        Popup.notice(ret.data.message);
                        return ret.data;
                    }

                }).catch(function (ret) {
                    return false;
                });
            };

            var request_route = function (api_name, api_parm, http_parm) {
                if (__config_sys__.fake_api === true) {
                    return request_demo(api_name, api_parm);
                } else {
                    return request(api_name, api_parm, http_parm);
                }
            }

            //获取URL请求的地址
            var get_api_url = function (api_name) {
                var post_url = __config_sys__.api_path + "manage/web/index.php?app_act=" + api_name;
                return post_url;
            };
            if (!$rootScope.config_sys) {
                $rootScope.config_sys = __config_sys__;
            };
            return {
                "get_api_url": get_api_url,   //获取请求的地址
                "request": request_route,     //API请求：根据配置是访问正式环境还是静态数据
                "request_demo": request_demo
            };

        }])
    .factory('valid', ['$rootScope', function ($rootScope) {

        //验证是否必填
        var check_required = function (input) {
            //console.log(input);
            if (typeof input == 'undefined' || input == undefined || input == '' || input == null) {
                return false;
            } else {
                return true;
            }
        }

        //验证正整数(不包含0)
        var check_positive_integer = function (input) {
            if ((/^(\+|-)?\d+$/.test(input)) && input > 0) {
                return true;
            } else {
                return false;
            }
        }

        //验证(包含0)的正整数
        var check_integer = function (input) {
            if ((/^(\+|-)?\d+$/.test(input)) && input >= 0) {
                return true;
            } else {
                return false;
            }
        }

        //验证手机号码
        var check_mobile = function (input) {
            if ((/^1\d{10}$/.test(input))) {
                return true;
            } else {
                return false;
            }
        }
        //验证邮箱
        var check_email = function (input) {
            if ((/^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/.test(input))) {
                return true;
            } else {
                return false;
            }
        }

        //验证0~1之间的数
        var check_zero_one = function (input) {
            if (input >= 0 && input <= 1) {
                return true;
            } else {
                return false;
            }
        }
        //验证1~100之间的数
        var check_one_hundred = function (input) {
            if (input >= 1 && input <= 100) {
                return true;
            } else {
                return false;
            }
        }
        //包含0的正数
        var check_zero_positive = function (input) {
            if ((/^[0-9]+.?[0-9]*$/.test(input)) && input >= 0) {
                return true;
            } else {
                return false;
            }
        }

        //正数(不包含0)
        var check_positive = function (input) {
            if ((/^[0-9]+.?[0-9]*$/.test(input)) && input > 0) {
                return true;
            } else {
                return false;
            }
        }

        //验证是否相等 input为有两个元素的数组
        var check_eq = function (input) {
            if (input[0] !== input[1]) {
                return false;
            } else {
                return true;
            }
        }

        //只能输入2位小数或正数(金额)
        var check_money_format = function (input) {
            if ((/^\d+(\.\d{2})*$/.test(input))) {
                return true;
            } else {
                return false;
            }
        }

        //非法字符
        var check_character = function(input){
            if((/[^a-zA-Z0-9\_\u4e00-\u9fa5]/.test(input))){
                return false;
            }else{
                return true;
            }
        }

        //验证选择
        var check_switch = function (func, dat) {
            switch (func) {
                case 'check_required': return check_required(dat);//验证是否必填
                case 'check_positive_integer': return check_positive_integer(dat);//验证正整数(不包含0)
                case 'check_integer': return check_integer(dat);//验证(包含0)的正整数
                case 'check_mobile': return check_mobile(dat);//验证手机号
                case 'check_email': return check_email(dat);//验证邮箱
                case 'check_zero_one': return check_zero_one(dat);//验证0~1之间的数
                case 'check_one_hundred': return check_one_hundred(dat);//验证1~100之间的数
                case 'check_zero_positive': return check_zero_positive(dat);//包含0的正数
                case 'check_positive': return check_positive(dat);//正数(不包含0)
                case 'check_money_format': return check_money_format(dat);//只能输入2位小数或正数(金额)
                case 'check_eq': return check_eq(dat);//验证是否相等 input为有两个元素的数组
                case 'check_character': return check_character(dat);//验证是否有非法字符
            }
            return true;
        }

        //各种验证: TODO 可以根据需要改造成promise返回
        var check = function (check_list) {
            var ret = {
                'status': true,
                'data': {}
            };

            check_list.forEach(function (o) {
                if (!check_switch(o.valid, o.data)) {
                    ret.status = false;
                    ret.data[o.key] = 'error';
                    ret.data[o.key + '_ico'] = 'glyphicon-warning-sign';
                    ret.data[o.key + '_tip'] = o.tip;
                } else {
                    ret.data[o.key] = 'success';
                    ret.data[o.key + '_ico'] = 'glyphicon-ok';
                    ret.data[o.key + '_tip'] = '';
                }
            });
            return ret;
        }

        return {
            "check": check,
            "check_required": check_required,//验证是否必填
            "check_positive_integer": check_positive_integer,//验证正整数(不包含0)
            "check_integer": check_integer,//验证(包含0)的正整数
            "check_mobile": check_mobile,//验证手机号
            "check_email": check_email,//验证邮箱
            "check_zero_one": check_zero_one,//验证0~1之间的数
            "check_one_hundred": check_one_hundred,//验证1~100之间的数
            "check_zero_positive": check_zero_positive,//包含0的正数
            "check_positive": check_positive,//正数(不包含0)
            "check_money_format": check_money_format,//只能输入2位小数或正数(金额)
            "check_eq": check_eq,//验证是否相等 input为有两个元素的数组
            "check_character": check_character//验证是否有非法字符
        }
    }])
    ;
(function(window){
    var u = {};
    var isAndroid = (/android/gi).test(navigator.appVersion);
    var uzStorage = function(){
        var ls = window.localStorage;
        if(isAndroid){
           ls = os.localStorage();
        }
        return ls;
    };
    function parseArguments(url, data, fnSuc, dataType) {
        if (typeof(data) == 'function') {
            dataType = fnSuc;
            fnSuc = data;
            data = undefined;
        }
        if (typeof(fnSuc) != 'function') {
            dataType = fnSuc;
            fnSuc = undefined;
        }
        return {
            url: url,
            data: data,
            fnSuc: fnSuc,
            dataType: dataType
        };
    }
    u.trim = function(str){
        if(String.prototype.trim){
            return str == null ? "" : String.prototype.trim.call(str);
        }else{
            return str.replace(/(^\s*)|(\s*$)/g, "");
        }
    };
    u.trimAll = function(str){
        return str.replace(/\s*/g,'');
    };
    u.isElement = function(obj){
        return !!(obj && obj.nodeType == 1);
    };
    u.isArray = function(obj){
        if(Array.isArray){
            return Array.isArray(obj);
        }else{
            return obj instanceof Array;
        }
    };
    u.isEmptyObject = function(obj){
        if(JSON.stringify(obj) === '{}'){
            return true;
        }
        return false;
    };
    u.addEvt = function(el, name, fn, useCapture){
        if(!u.isElement(el)){
            console.warn('$api.addEvt Function need el param, el param must be DOM Element');
            return;
        }
        useCapture = useCapture || false;
        if(el.addEventListener) {
            el.addEventListener(name, fn, useCapture);
        }
    };
    u.rmEvt = function(el, name, fn, useCapture){
        if(!u.isElement(el)){
            console.warn('$api.rmEvt Function need el param, el param must be DOM Element');
            return;
        }
        useCapture = useCapture || false;
        if (el.removeEventListener) {
            el.removeEventListener(name, fn, useCapture);
        }
    };
    u.one = function(el, name, fn, useCapture){
        if(!u.isElement(el)){
            console.warn('$api.one Function need el param, el param must be DOM Element');
            return;
        }
        useCapture = useCapture || false;
        var that = this;
        var cb = function(){
            fn && fn();
            that.rmEvt(el, name, cb, useCapture);
        };
        that.addEvt(el, name, cb, useCapture);
    };
    u.dom = function(el, selector){
        if(arguments.length === 1 && typeof arguments[0] == 'string'){
            if(document.querySelector){
                return document.querySelector(arguments[0]);
            }
        }else if(arguments.length === 2){
            if(el.querySelector){
                return el.querySelector(selector);
            }
        }
    };
    u.domAll = function(el, selector){
        if(arguments.length === 1 && typeof arguments[0] == 'string'){
            if(document.querySelectorAll){
                return document.querySelectorAll(arguments[0]);
            }
        }else if(arguments.length === 2){
            if(el.querySelectorAll){
                return el.querySelectorAll(selector);
            }
        }
    };
    u.byId = function(id){
        return document.getElementById(id);
    };
    u.first = function(el, selector){
        if(arguments.length === 1){
            if(!u.isElement(el)){
                console.warn('$api.first Function need el param, el param must be DOM Element');
                return;
            }
            return el.children[0];
        }
        if(arguments.length === 2){
            return this.dom(el, selector+':first-child');
        }
    };
    u.last = function(el, selector){
        if(arguments.length === 1){
            if(!u.isElement(el)){
                console.warn('$api.last Function need el param, el param must be DOM Element');
                return;
            }
            var children = el.children;
            return children[children.length - 1];
        }
        if(arguments.length === 2){
            return this.dom(el, selector+':last-child');
        }
    };
    u.eq = function(el, index){
        return this.dom(el, ':nth-child('+ index +')');
    };
    u.not = function(el, selector){
        return this.domAll(el, ':not('+ selector +')');
    };
    u.prev = function(el){
        if(!u.isElement(el)){
            console.warn('$api.prev Function need el param, el param must be DOM Element');
            return;
        }
        var node = el.previousSibling;
        if(node.nodeType && node.nodeType === 3){
            node = node.previousSibling;
            return node;
        }
    };
    u.next = function(el){
        if(!u.isElement(el)){
            console.warn('$api.next Function need el param, el param must be DOM Element');
            return;
        }
        var node = el.nextSibling;
        if(node.nodeType && node.nodeType === 3){
            node = node.nextSibling;
            return node;
        }
    };
    u.closest = function(el, selector){
        if(!u.isElement(el)){
            console.warn('$api.closest Function need el param, el param must be DOM Element');
            return;
        }
        var doms, targetDom;
        var isSame = function(doms, el){
            var i = 0, len = doms.length;
            for(i; i<len; i++){
                if(doms[i].isEqualNode(el)){
                    return doms[i];
                }
            }
            return false;
        };
        var traversal = function(el, selector){
            doms = u.domAll(el.parentNode, selector);
            targetDom = isSame(doms, el);
            while(!targetDom){
                var ell=el;
                 ell = el.parentNode;
                if(ell != null && ell.nodeType == ell.DOCUMENT_NODE){
                    return false;
                }
                traversal(ell, selector);
            }

            return targetDom;
        };

        return traversal(el, selector);
    };
    u.contains = function(parent,el){
        var mark = false;
        if(el === parent){
            mark = true;
            return mark;
        }else{
            do{
                el = el.parentNode;
                if(el === parent){
                    mark = true;
                    return mark;
                }
            }while(el === document.body || el === document.documentElement);

            return mark;
        }
        
    };
    u.remove = function(el){
        if(el && el.parentNode){
            el.parentNode.removeChild(el);
        }
    };
    u.attr = function(el, name, value){
        if(!u.isElement(el)){
            console.warn('$api.attr Function need el param, el param must be DOM Element');
            return;
        }
        if(arguments.length == 2){
            return el.getAttribute(name);
        }else if(arguments.length == 3){
            el.setAttribute(name, value);
            return el;
        }
    };
    u.removeAttr = function(el, name){
        if(!u.isElement(el)){
            console.warn('$api.removeAttr Function need el param, el param must be DOM Element');
            return;
        }
        if(arguments.length === 2){
            el.removeAttribute(name);
        }
    };
    u.hasCls = function(el, cls){
        if(!u.isElement(el)){
            console.warn('$api.hasCls Function need el param, el param must be DOM Element');
            return;
        }
        if(el.className.indexOf(cls) > -1){
            return true;
        }else{
            return false;
        }
    };
    u.addCls = function(el, cls){
        if(!u.isElement(el)){
            console.warn('$api.addCls Function need el param, el param must be DOM Element');
            return;
        }
        if('classList' in el){
            el.classList.add(cls);
        }else{
            var preCls = el.className;
            var newCls = preCls +' '+ cls;
            el.className = newCls;
        }
        return el;
    };
    u.removeCls = function(el, cls){
        if(!u.isElement(el)){
            console.warn('$api.removeCls Function need el param, el param must be DOM Element');
            return;
        }
        if('classList' in el){
            el.classList.remove(cls);
        }else{
            var preCls = el.className;
            var newCls = preCls.replace(cls, '');
            el.className = newCls;
        }
        return el;
    };
    u.toggleCls = function(el, cls){
        if(!u.isElement(el)){
            console.warn('$api.toggleCls Function need el param, el param must be DOM Element');
            return;
        }
       if('classList' in el){
            el.classList.toggle(cls);
        }else{
            if(u.hasCls(el, cls)){
                u.addCls(el, cls);
            }else{
                u.removeCls(el, cls);
            }
        }
        return el;
    };
    u.val = function(el, val){
        if(!u.isElement(el)){
            console.warn('$api.val Function need el param, el param must be DOM Element');
            return;
        }
        if(arguments.length === 1){
            switch(el.tagName){
                case 'SELECT':
                    var value = el.options[el.selectedIndex].value;
                    return value;
                    break;
                case 'INPUT':
                    return el.value;
                    break;
                case 'TEXTAREA':
                    return el.value;
                    break;
            }
        }
        if(arguments.length === 2){
            switch(el.tagName){
                case 'SELECT':
                    el.options[el.selectedIndex].value = val;
                    return el;
                    break;
                case 'INPUT':
                case 'TEXTAREA':
                    el.value = val;
                    return el;
                    break;
            }
        }
        
    };
    u.prepend = function(el, html){
        if(!u.isElement(el)){
            console.warn('$api.prepend Function need el param, el param must be DOM Element');
            return;
        }
        el.insertAdjacentHTML('afterbegin', html);
        return el;
    };
    u.append = function(el, html){
        if(!u.isElement(el)){
            console.warn('$api.append Function need el param, el param must be DOM Element');
            return;
        }
        el.insertAdjacentHTML('beforeend', html);
        return el;
    };
    u.before = function(el, html){
        if(!u.isElement(el)){
            console.warn('$api.before Function need el param, el param must be DOM Element');
            return;
        }
        el.insertAdjacentHTML('beforebegin', html);
        return el;
    };
    u.after = function(el, html){
        if(!u.isElement(el)){
            console.warn('$api.after Function need el param, el param must be DOM Element');
            return;
        }
        el.insertAdjacentHTML('afterend', html);
        return el;
    };
    u.html = function(el, html){
        if(!u.isElement(el)){
            console.warn('$api.html Function need el param, el param must be DOM Element');
            return;
        }
        if(arguments.length === 1){
            return el.innerHTML;
        }else if(arguments.length === 2){
            el.innerHTML = html;
            return el;
        }
    };
    u.text = function(el, txt){
        if(!u.isElement(el)){
            console.warn('$api.text Function need el param, el param must be DOM Element');
            return;
        }
        if(arguments.length === 1){
            return el.textContent;
        }else if(arguments.length === 2){
            el.textContent = txt;
            return el;
        }
    };
    u.offset = function(el){
        if(!u.isElement(el)){
            console.warn('$api.offset Function need el param, el param must be DOM Element');
            return;
        }
        var sl = Math.max(document.documentElement.scrollLeft, document.body.scrollLeft);
        var st = Math.max(document.documentElement.scrollTop, document.body.scrollTop);

        var rect = el.getBoundingClientRect();
        return {
            l: rect.left + sl,
            t: rect.top + st,
            w: el.offsetWidth,
            h: el.offsetHeight
        };
    };
    u.css = function(el, css){
        if(!u.isElement(el)){
            console.warn('$api.css Function need el param, el param must be DOM Element');
            return;
        }
        if(typeof css == 'string' && css.indexOf(':') >= 0){
            el.style && (el.style.cssText += ';' + css);
        }
    };
    u.cssVal = function(el, prop){
        if(!u.isElement(el)){
            console.warn('$api.cssVal Function need el param, el param must be DOM Element');
            return;
        }
        if(arguments.length === 2){
            var computedStyle = window.getComputedStyle(el, null);
            return computedStyle.getPropertyValue(prop);
        }
    };
    u.jsonToStr = function(json){
        if(typeof json === 'object'){
            return JSON && JSON.stringify(json);
        }
    };
    u.strToJson = function(str){
        if(typeof str === 'string'){
            return JSON && JSON.parse(str);
        }
    };
    u.setStorage = function(key, value){
        if(arguments.length === 2){
            var v = value;
            if(typeof v == 'object'){
                v = JSON.stringify(v);
                v = 'obj-'+ v;
            }else{
                v = 'str-'+ v;
            }
            var ls = uzStorage();
            if(ls){
                ls.setItem(key, v);
            }
        }
    };
    u.getStorage = function(key){
        var ls = uzStorage();
        if(ls){
            var v = ls.getItem(key);
            if(!v){return;}
            if(v.indexOf('obj-') === 0){
                v = v.slice(4);
                return JSON.parse(v);
            }else if(v.indexOf('str-') === 0){
                return v.slice(4);
            }
        }
    };
    u.rmStorage = function(key){
        var ls = uzStorage();
        if(ls && key){
            ls.removeItem(key);
        }
    };
    u.clearStorage = function(){
        var ls = uzStorage();
        if(ls){
            ls.clear();
        }
    };

   
    /*by king*/
    u.fixIos7Bar = function(el){
        if(!u.isElement(el)){
            console.warn('$api.fixIos7Bar Function need el param, el param must be DOM Element');
            return;
        }
        var strDM = api.systemType;
        if (strDM == 'ios') {
            var strSV = api.systemVersion;
            var numSV = parseInt(strSV,10);
            var fullScreen = api.fullScreen;
            var iOS7StatusBarAppearance = api.iOS7StatusBarAppearance;
            if (numSV >= 7 && !fullScreen && iOS7StatusBarAppearance) {
                el.style.paddingTop = '20px';
            }
        }
    };
    u.fixStatusBar = function(el){
        if(!u.isElement(el)){
            console.warn('$api.fixStatusBar Function need el param, el param must be DOM Element');
            return;
        }
        var sysType = api.systemType;
        if(sysType == 'ios'){
            u.fixIos7Bar(el);
        }else if(sysType == 'android'){
            var ver = api.systemVersion;
            ver = parseFloat(ver);
            if(ver >= 4.4){
                el.style.paddingTop = '25px';
            }
        }
    };
    u.toast = function(title, text, time){
        var opts = {};
        var show = function(opts, time){
            api.showProgress(opts);
            setTimeout(function(){
                api.hideProgress();
            },time);
        };
        if(arguments.length === 1){
            time = time || 500;
            if(typeof title === 'number'){
                time = title;
            }else{
                opts.title = title+'';
            }
            show(opts, time);
        }else if(arguments.length === 2){
            time = time || 500;
            // text = text;
            if(typeof text === "number"){
                var tmp = text;
                time = tmp;
                text = null;
            }
            if(title){
                opts.title = title;
            }
            if(text){
                opts.text = text;
            }
            show(opts, time);
        }
        if(title){
            opts.title = title;
        }
        if(text){
            opts.text = text;
        }
        time = time || 500;
        show(opts, time);
    };
    u.post = function(/*url,data,fnSuc,dataType*/){
        var argsToJson = parseArguments.apply(null, arguments);
        var json = {};
        var fnSuc = argsToJson.fnSuc;
        argsToJson.url && (json.url = argsToJson.url);
        argsToJson.data && (json.data = argsToJson.data);
        if(argsToJson.dataType){
            var type = argsToJson.dataType.toLowerCase();
            if (type == 'text'||type == 'json') {
                json.dataType = type;
            }
        }else{
            json.dataType = 'json';
        }
        json.method = 'post';
        api.ajax(json,
            function(ret,err){
                if (ret) {
                    fnSuc && fnSuc(ret);
                }
            }
        );
    };
    u.get = function(/*url,fnSuc,dataType*/){
        var argsToJson = parseArguments.apply(null, arguments);
        var json = {};
        var fnSuc = argsToJson.fnSuc;
        argsToJson.url && (json.url = argsToJson.url);
        //argsToJson.data && (json.data = argsToJson.data);
        if(argsToJson.dataType){
            var type = argsToJson.dataType.toLowerCase();
            if (type == 'text'||type == 'json') {
                json.dataType = type;
            }
        }else{
            json.dataType = 'text';
        }
        json.method = 'get';
        api.ajax(json,
            function(ret,err){
                if (ret) {
                    fnSuc && fnSuc(ret);
                }
            }
        );
    };
    u.setcookie = function(name, value, expiredays) {
        var exdate=new Date();
//      exdate.setDate(exdate.getDate()+expiredays);
		var num_time = 86400000 * expiredays;//毫秒为单位
        exdate.setTime(exdate.getTime() + num_time);
        document.cookie=name+ "=" +encodeURI(value)+ ((expiredays==null) ? "" : ";expires="+exdate.toGMTString());
    };
    u.getcookie = function (name) {
        var arr=document.cookie.split('; ');
        for(var i=0;i<arr.length;i++){
            var temp=arr[i].split('=');
            if(temp[0]==name){
                return decodeURI(temp[1]);
            }
        }
        return null;
    };
    u.removecookie = function(name) {
        u.setcookie(name,'',-1);
    };


    u.ksort = function(inputArr, sort_flags){

            //  discuss at: http://phpjs.org/functions/ksort/
            // original by: GeekFG (http://geekfg.blogspot.com)
            // improved by: Kevin van Zonneveld (http://kevin.vanzonneveld.net)
            // improved by: Brett Zamir (http://brett-zamir.me)
            //        note: The examples are correct, this is a new way
            //        note: This function deviates from PHP in returning a copy of the array instead
            //        note: of acting by reference and returning true; this was necessary because
            //        note: IE does not allow deleting and re-adding of properties without caching
            //        note: of property position; you can set the ini of "phpjs.strictForIn" to true to
            //        note: get the PHP behavior, but use this only if you are in an environment
            //        note: such as Firefox extensions where for-in iteration order is fixed and true
            //        note: property deletion is supported. Note that we intend to implement the PHP
            //        note: behavior by default if IE ever does allow it; only gives shallow copy since
            //        note: is by reference in PHP anyways
            //        note: Since JS objects' keys are always strings, and (the
            //        note: default) SORT_REGULAR flag distinguishes by key type,
            //        note: if the content is a numeric string, we treat the
            //        note: "original type" as numeric.
            //  depends on: i18n_loc_get_default
            //  depends on: strnatcmp
            //   example 1: data = {d: 'lemon', a: 'orange', b: 'banana', c: 'apple'};
            //   example 1: data = ksort(data);
            //   example 1: $result = data
            //   returns 1: {a: 'orange', b: 'banana', c: 'apple', d: 'lemon'}
            //   example 2: ini_set('phpjs.strictForIn', true);
            //   example 2: data = {2: 'van', 3: 'Zonneveld', 1: 'Kevin'};
            //   example 2: ksort(data);
            //   example 2: $result = data
            //   returns 2: {1: 'Kevin', 2: 'van', 3: 'Zonneveld'}

            var tmp_arr = {},
                keys = [],
                sorter, i, k, that = this,
                strictForIn = false,
                populateArr = {};

            switch (sort_flags) {
                case 'SORT_STRING':
                    // compare items as strings
                    sorter = function (a, b) {
                        return that.strnatcmp(a, b);
                    };
                    break;
                case 'SORT_LOCALE_STRING':
                    // compare items as strings, original by the current locale (set with  i18n_loc_set_default() as of PHP6)
                    var loc = this.i18n_loc_get_default();
                    sorter = this.php_js.i18nLocales[loc].sorting;
                    break;
                case 'SORT_NUMERIC':
                    // compare items numerically
                    sorter = function (a, b) {
                        return ((a + 0) - (b + 0));
                    };
                    break;
                // case 'SORT_REGULAR': // compare items normally (don't change types)
                default:
                    sorter = function (a, b) {
                        var aFloat = parseFloat(a),
                            bFloat = parseFloat(b),
                            aNumeric = aFloat + '' === a,
                            bNumeric = bFloat + '' === b;
                        if (aNumeric && bNumeric) {
                            return aFloat > bFloat ? 1 : aFloat < bFloat ? -1 : 0;
                        } else if (aNumeric && !bNumeric) {
                            return 1;
                        } else if (!aNumeric && bNumeric) {
                            return -1;
                        }
                        return a > b ? 1 : a < b ? -1 : 0;
                    };
                    break;
            }

            // Make a list of key names
            for (k in inputArr) {
                if (inputArr.hasOwnProperty(k)) {
                    keys.push(k);
                }
            }
            keys.sort(sorter);

            // BEGIN REDUNDANT
            this.php_js = this.php_js || {};
            this.php_js.ini = this.php_js.ini || {};
            // END REDUNDANT
            strictForIn = this.php_js.ini['phpjs.strictForIn'] && this.php_js.ini['phpjs.strictForIn'].local_value && this.php_js
                    .ini['phpjs.strictForIn'].local_value !== 'off';
            populateArr = strictForIn ? inputArr : populateArr;

            // Rebuild array with sorted key names
            for (i = 0; i < keys.length; i++) {
                k = keys[i];
                tmp_arr[k] = inputArr[k];
                if (strictForIn) {
                    delete inputArr[k];
                }
            }
            for (i in tmp_arr) {
                if (tmp_arr.hasOwnProperty(i)) {
                    populateArr[i] = tmp_arr[i];
                }
            }

            return strictForIn || populateArr;

    }
/*end*/
    

    window.$util = u;

})(window);



myDirective.directive(  "pager", function () {
    return {
        restrict: 'E',
        scope: {
            pageData: '=',    //分页数据
            pageSimply: '@',    //简洁样式
            pageFunc: '='     //点击页码触发的事件
        },
        templateUrl: 'src/html/directive/pager/PagerList.html',
        controller: ['$scope', '$element', '$route', 'ngDialog', function ($scope, $element, $route, ngDialog) {
            //默认显示个数
            //console.log($scope.pageData);
            //默认路由
            if($scope.pageSimply==undefined||$scope.pageSimply==''||$scope.pageSimply!=true||$scope.pageSimply!='true'){
                $scope.pageSimply = false;
            }
            var curr_route = 'default';
            var pager_conf_local = {};
            try{
                //当前分页器所在页面的路由
                curr_route = $route.current.$$route.originalPath;
            }catch(e){
                //TODO路由有问题
            }

            //跳转到上一页
            $scope.goto_prev = function(){
                if($scope.pageData.pageNum>1){$scope.pageData.pageNum--};
                $scope.goto_page($scope.pageData.pageNum);
            };

            //跳转到下一页
            $scope.goto_next = function(){
                if($scope.pageData.pageNum<$scope.pageData.countPage){$scope.pageData.pageNum++};
                $scope.goto_page($scope.pageData.pageNum);
            };

            //跳转到首页
            $scope.goto_first = function(){
                $scope.goto_page(1);
            };

            //跳转到尾页
            $scope.goto_last = function(){
                $scope.goto_page($scope.pageData.countPage);
            };

            //直接跳转到某页
            $scope.goto_page = function(i){
                //console.log($scope.pageData);
                $scope.pageData.num = parseInt($scope.pageData.num);
                $scope.pageData.pageNum = i;
                $scope.pageFunc();
            };

            //切换每页显示的数据量，并立刻刷新页面
            $scope.change_page_size = function(){
                //保存当前配置到本地存储
                var first = 0; // 判断是否是第一次加载
                if(pager_conf_local[curr_route]==undefined||pager_conf_local[curr_route]==''){
                    first = 1;
                }
                pager_conf_local[curr_route] = $scope.pageData.num;
                $util.setStorage('pager_conf_local',pager_conf_local);
                //重新获取分页数据
                if(first==0){ //第一次加载不要执行goto_page
                    $scope.goto_page(1);
                }
            };
            $scope.change_page_size();

            pager_conf_local = $util.getStorage('pager_conf_local')?$util.getStorage('pager_conf_local'):{};

            if(pager_conf_local[curr_route]!=undefined){
                //从本地localstorage取出当前路由设定的分页数
                $scope.pageData.num = parseInt(pager_conf_local[curr_route]);
            }else{
                //否则默认每页15条数据
                $scope.pageData.num = 15;
            }




        
        }]
    }
});
    myDirective.directive("selectDate", function () {
    return {
        restrict: 'E,A',
        scope: {
            inputValue: '=',    //输入框中的日期
            inputTitle: '@',    //弹框的标题
            inputReadonly: '=', //只读开关:true只读, false可编辑
            inputEdit: '=', //是否可编辑
            inputChange:'=', //变化后执行的方法
            startView:'=', //变化后执行的方法
            inputFormat: '@'    //输入的日期格式 1:yyyy-mm-dd 2:mm-dd 3:yyyy-mm 4：yyyy 5:hh:ii:ss  默认;yyyy-mm-dd hh:ii:ss
        },
        templateUrl: 'src/html/directive/selectdate/DirectiveSelectDate.html',
        controller: ['$scope', '$element', 'ngDialog', function ($scope, $element, ngDialog) {
            $scope.show = true;
            //var format = '';
            //// if($scope.startView){
            ////     $scope.startView =3
            //// }
            //var minView = '';
            //var maxView = '';
            //if($scope.inputFormat==1){
            //    format = 'yyyy-mm-dd';
            //    minView = 2;
            //    maxView = 4;
            //}else if($scope.inputFormat==2){
            //    format = 'mm-dd';
            //    minView = 2;
            //    maxView = 3;
            //}else if($scope.inputFormat==3){
            //    format = 'yyyy-mm';
            //    minView = 3;
            //    maxView = 4;
            //}else if($scope.inputFormat==5){
            //    format = 'hh:ii:ss';
            //    minView = 0;
            //    maxView = 1;
            //
            //}else {
            //    format = 'yyyy-mm-dd hh:ii';
            //    minView = 0;
            //    maxView = 4;
            //}
            //$('.form_time').datetimepicker({
            //    //language:  'fr',
            //    weekStart: 1,
            //    todayBtn:  1,
            //    autoclose: 1,
            //    todayHighlight: 1,
            //    startView: $scope.startView,
            //    pickerPosition: "bottom-left",
            //    minView:minView,
            //    maxView:maxView,
            //    forceParse: 0,
            //    format: format
            //});

            $scope.clear = function () {
                $element.children().children().val('');
                $scope.inputValue = '';
                $scope.show = true;
            }

            $scope.set_val = function () {
                $scope.inputValue = $element.children().children().val();
                $scope.show = false;
            }

            $scope.click_date = function () {
                $element.children().children().click()
            }


            //清空
            var watch1 = $scope.$watch('inputValue',function(){
                if($scope.inputValue==''||$scope.inputValue==undefined){
                    $scope.clear();
                }
            });



        }]
    }
});