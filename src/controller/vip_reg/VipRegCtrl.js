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