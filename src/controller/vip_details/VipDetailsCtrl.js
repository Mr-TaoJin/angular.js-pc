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