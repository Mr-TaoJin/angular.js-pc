// 未中奖详情
var noWinningDetailCtrl = ['$rootScope', '$scope', 'api','$routeParams',
  function ($rootScope, $scope, api,$routeParams) {
    var data = {
      form_data: {//页面数据

      }
    }
    $rootScope.is_checked = 1;//导航
    $scope.data = data;
    console.log($routeParams.id,'$routeParams.id')
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
  }];

  noWinningDetailCtrl.$injector = ['$rootScope', '$scope', 'api','$routeParams'];