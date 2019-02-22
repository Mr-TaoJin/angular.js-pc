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