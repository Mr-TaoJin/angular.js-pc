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
                                // if(result.data.data.length == 0 || result.data.data == []){
                                //     $scope.open_coupons_query_msg_window();
                                // }else if(Object.keys(result.data.data).length>0){
                                    $scope.open_coupons_query_usable_window(result.data);
                                // }
                                ngDialog.close(open_coupons_query_window_id.id);
                            }else{
                                $scope.open_coupons_query_msg_window(result.message);
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
        $scope.open_coupons_query_msg_window=function(v){
            open_coupons_query_msg_window_id = ngDialog.open({
                overlay: true,
                disableAnimation: false,
                showClose: false,
                closeByDocument:false,
                width: '430px',
                template: __config_sys__.src_path+'html/coupons/coupons_query_msg_window.html',
                scope: $scope,
                controller: ['$scope', function ($scope) {
                    $scope.query_no_use = v;
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