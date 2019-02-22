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