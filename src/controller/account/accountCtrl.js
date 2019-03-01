var accountCtrl = ['$rootScope', '$scope', 'api','ngDialog',
  function ($rootScope, $scope, api ,ngDialog) {

    var data = {
      search_data: {//查询条件

      },
      page_data: {//分页
        'pageNum': 1,
        'countPage': 10,
        'num': 15,
        'count': 156
      },
      form_data: {//页面数据

      }

    }
    $rootScope.is_checked = 3;//导航
    $rootScope.is_service_show = false;//是否显示客服
    $scope.data = data;

    $scope.form_search = function () {//请求数据
      // api.request('common/get_list', {
      //   'search_data': $scope.data.search_data,
      //   'page_data': $scope.data.page_data,
      //   'form_data': $scope.data.form_data
      // }).then(function (res) {
      //   res = {
      //     'status': 1,
      //     'message': '成功',
      //     'data': {
      //       page_data: {},
      //       data: {}
      //     }
      //   }
      //   if (res.status == 1) {
      //     $scope.data.form_data = res.data.data;
      //     $scope.data.page_data = res.data.page_data;
      //   } else {
      //     $scope.notice(res.message);
      //   }
      // });
      $scope.notice('请求成功');
    }

    // 预存弹窗
    var open_account_window_id = 0;
    $scope.open_account_window = function () {
      open_account_window_id = ngDialog.open({
        overlay: true,
        disableAnimation: false,
        showClose: false,
        closeByDocument: true,
        width: '350px',
        template: __config_sys__.src_path + 'html/account/window/accountWindow.html',
        scope: $scope,
        controller: ['$scope', function ($scope, ) {
          // 关闭弹框
          $scope.ngDialog_close = function () {
            ngDialog.close(open_account_window_id.id)
          }
        }]
      });
    }

  }];

  accountCtrl.$injector = ['$rootScope', '$scope', 'api' ,'ngDialog'];