var NavComponentCtrl = ['$scope','ngDialog',
function ($scope,ngDialog) {

    // 客服弹窗
    var open_service_window_id = 0;
    $scope.open_service_window = function(){
        open_service_window_id = ngDialog.open({
            overlay: true,
            disableAnimation: false,
            showClose: false,
            closeByDocument:true,
            width: '350px',
            template: __config_sys__.src_path+'html/component/window/serviceWindow.html',
            scope: $scope,
            controller: ['$scope', function ($scope,) {
                // 关闭弹框
                $scope.ngDialog_close = function(){
                    ngDialog.close(open_service_window_id.id)
                }
            }]
        });
    }
    // 退出登录
    var open_logout_window_id = 0;
    $scope.open_logout_window = function(){
        open_logout_window_id = ngDialog.open({
            overlay: true,
            disableAnimation: false,
            showClose: false,
            closeByDocument:true,
            width: '350px',
            template: __config_sys__.src_path+'html/component/window/logoutWindow.html',
            scope: $scope,
            controller: ['$scope', function ($scope,) {
                // 关闭弹框
                $scope.ngDialog_close = function(){
                    ngDialog.close(open_logout_window_id.id)
                }
            }]
        });
    }
    
}];

NavComponentCtrl.$injector = ['$scope','ngDialog'];