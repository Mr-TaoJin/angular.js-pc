var IndexMainCtrl = ['$rootScope', '$scope','ngDialog','api','$location','Popup','$routeParams',
function ($rootScope, $scope,ngDialog,api,$location,Popup,$routeParams) {
    // 该控制器方法所有子控制器都能调用
    // 路由跳转
    $scope.goto = function(url){
        $location.path(url)
    }
    // 提示消息
    $scope.notice = function(msg){
        Popup.notice(msg);
    }
    // 撤单
    var open_out_window_id = 0;
    $scope.open_out_window = function(){
        open_out_window_id = ngDialog.open({
            overlay: true,
            disableAnimation: false,
            showClose: false,
            closeByDocument:true,
            width: '350px',
            template: __config_sys__.src_path+'html/detail/window/outWindow.html',
            scope: $scope,
            controller: ['$scope', function ($scope,) {
                // 关闭弹框
                $scope.ngDialog_close = function(){
                    ngDialog.close(open_out_window_id.id)
                }
            }]
        });
    }
    // 确定撤单
    var open_revoke_window_id = 0;
    $scope.open_revoke_window = function(){
        open_revoke_window_id = ngDialog.open({
            overlay: true,
            disableAnimation: false,
            showClose: false,
            closeByDocument:true,
            width: '600px',
            template: __config_sys__.src_path+'html/detail/window/revokeWindow.html',
            scope: $scope,
            controller: ['$scope', function ($scope,) {
                // 关闭弹框
                $scope.ngDialog_close = function(){
                    ngDialog.close(open_revoke_window_id.id)
                }
            }]
        });
    }
    
    
    
}];

IndexMainCtrl.$injector = ['$rootScope', '$scope','ngDialog','api','$location','Popup','$routeParams'];