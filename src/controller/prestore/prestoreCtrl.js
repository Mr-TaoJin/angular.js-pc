var prestoreCtrl = ['$rootScope', '$scope', 'api',
  function ($rootScope, $scope, api) {

    var data = {
      tab:2,//默认显示代打票
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
    $rootScope.is_checked = 2;//导航
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
    //tab切换
    $scope.tab_toggle = function(tab){
      $scope.data.tab = tab;
    }
   
  }];

  prestoreCtrl.$injector = ['$rootScope', '$scope', 'api'];